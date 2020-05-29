/* Include Library file */
#include <WiFi.h>
#include <EEPROM.h>
#include <Arduino.h>
#include <BLEScan.h>
#include <BLEDevice.h>
#include <WiFiMulti.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <SimpleKalmanFilter.h>

/* Define */
#define TX_POWER                            -64.734                 // find Distance Power with measurement RSSI between Reference and Wristband in 1 meter
#define SCAN_TIME                           1                       // second
#define EEPROM_SIZE                         128                     // bytes
#define DEFAULT_LOCATION                    "location1"
#define DEFAULT_MAX_USER                    2                       // maximum number of user (Wearable) in system
#define DEFAULT_WIFI_SSID                   "ESP32-Test"
#define DEFAULT_WIFI_PASSWORD               "fO7apcsdog"
#define WRISTBAND1_MAC                      "80:7d:3a:c4:5e:b2"
#define WRISTBAND2_MAC                      "80:7d:3a:c4:6a:96"
#define FALL_DETECT_SERVICE_UUID            "f2ad493c-4abb-4f33-9e25-0417ea0d1daf"
#define FALL_DETECT_CHARACTERISTIC_UUID     "bd663898-580e-411c-aa1c-65a839e176ec"
#define UPDATE_POSITION_URL                 "https://us-central1-ce62-29.cloudfunctions.net/api/patients/position"

/* Define Global Variable */
BLEScan* bleScan;
WiFiMulti WiFiMulti;
/*
  SimpleKalmanFilter(e_mea, e_est, q);
  e_mea: Measurement Uncertainty
  e_est: Estimation Uncertainty
  q: Process Noise
*/
SimpleKalmanFilter kf(2, 2, 0.1);
TaskHandle_t scanTaskHandle;
std::string deviceList[DEFAULT_MAX_USER];
struct clientParameterStruct {
  const char* mac_address;
  int start_address;
  int rssi;
  bool resume_task;
  bool fall;
} clientParameter[DEFAULT_MAX_USER];
byte state;

/*
   EEPROM structure (1 byte peer address)
   -----------------------------------------------------------
    address |        data         |        description
   -----------------------------------------------------------
      0     |   operation mode    |       0 = BLE mode
            |                     |       1 = WiFi mode
   -----------------------------------------------------------
      1     |   own MAC address   |         character
      .     |         .           |             .
      .     |         .           |             .
      18    | terminate character |            '\0'
   -----------------------------------------------------------
      19    |  number of matching |          integer
            |       device        |
   -----------------------------------------------------------
      20    |   matching device   |         character
      .     |     MAC address     |             .
      .     |         .           |             .
      .     |         .           |             .
      37    | terminate character |            '\0'
   -----------------------------------------------------------
      38    |   rssi of maching   |          integer
            |       device        |
      39    |     fall status     |          boolean
   -----------------------------------------------------------

   Repeat from address 20 to 39 at the next address
   If more than 1 matching device is found
   Maximum size of EEPROM in eps32 is 512 byte
   Our program uses 128 bytes
   Define at EEPROM_SIZE

*/

/* Prototype-Function */
void scanTask(void*);
void clientTask(void*);
void updatePositiontTask(void*);
bool isExists(std::string);

/* setup */
void setup() {
  Serial.begin(115200);
  EEPROM.begin(EEPROM_SIZE);
  /* add list of wearable device address (MAC Address) */
  deviceList[0] = WRISTBAND1_MAC;
  deviceList[1] = WRISTBAND2_MAC;
  state = EEPROM.read(0);

  Serial.println(state);
  switch (state) {
    case 0:                                 // ble mode
      Serial.println("BLE Mode");
      setupBLE();
      xTaskCreate(scanTask, "Scan Task", 4000, NULL, 1, &scanTaskHandle);
      break;
    case 1:                                 // wifi mode
      Serial.println("WiFi Mode");
      setupWifi();
      xTaskCreate(updatePositionTask, "Update Position Task", 8000, NULL, 1, NULL);
      break;
    default:                                // default with ble mode
      Serial.println("BLE Mode");
      setupBLE();
      xTaskCreate(scanTask, "Scan Task", 4000, NULL, 1, &scanTaskHandle);
      break;
  }
  vTaskSuspend(NULL);
  vTaskDelete(NULL);
}

/* main loop */
void loop() {
}

void scanTask(void*) {
  /* start scan */
  BLEScanResults results = bleScan->start(SCAN_TIME, false);
  Serial.printf("Number of found device: %d\n", results.getCount());

  int nod = 0;                // number of device
  int startIndex = 20;

  for (int i = 0; i < results.getCount(); i++) {
    std::string address = results.getDevice(i).getAddress().toString();
    Serial.printf("BLE Advertised Device found: %s\n", address.c_str());

    std::string serviceData = results.getDevice(i).getServiceData();
    Serial.printf("Service Data: %s\n", serviceData.c_str());

    if (isExists(address)) {
      int rssi = results.getDevice(i).getRSSI();
      /* write mac address to eeprom */
      write_String(startIndex, address.c_str());
      Serial.printf("write address %s to eeprom\n", read_String(startIndex).c_str());
      startIndex += (strlen(address.c_str()) + 1);
      EEPROM.write(startIndex, rssi);
      EEPROM.commit();
      Serial.printf("write rssi %d to eeprom\n", (int8_t)EEPROM.read(startIndex));
      startIndex++;

      if (!strcmp(serviceData.c_str(), "Fall Detect !!!")) {
        EEPROM.write(startIndex, 1);
        EEPROM.commit();
        startIndex++;
      } else {
        EEPROM.write(startIndex, 0);
        EEPROM.commit();
        startIndex++;
      }
      Serial.printf("write fall status %d to eeprom\n", (int)EEPROM.read(startIndex));

      nod++;
    }
  }

  EEPROM.write(19, nod);       // write number of device in address 2

  bleScan->clearResults();
  bleScan->stop();

  Serial.println("Prepare to change mode BLE -> WiFi...");
  EEPROM.write(0, 1);                                             // switch mode to wifi mode
  EEPROM.commit();

  ESP.restart();
  /* make sure */
  vTaskDelete(NULL);
}

void updatePositionTask(void*) {
  int count = (int)EEPROM.read(19);
  String ownAddress = read_String(1);
  Serial.println(ownAddress.c_str());

  if (count == 0) {
    Serial.println("Prepare to change mode Wifi -> BLE...");
    EEPROM.write(0, 0);              // switch mode to ble mode
    EEPROM.commit();
    ESP.restart();
  }

  int startIndex = 20;

  char buff[200];
  StaticJsonDocument<200> payload;
  payload["address"] = ownAddress.c_str();
  payload["location"] = DEFAULT_LOCATION;
  JsonArray wearableDevice = payload.createNestedArray("wearableDevice");

  const char* url = "https://us-central1-ce62-29.cloudfunctions.net/api/monitoring/status";
  for (int i = 0; i < count; i++) {
    String address = read_String(startIndex);
    JsonObject device = wearableDevice.createNestedObject();
    device["address"] = address;
    startIndex += (strlen(address.c_str()) + 1);
    device["rssi"] = (int8_t)EEPROM.read(startIndex++);         // cast byte to integer 8 bit include nagative value
    device["fall"] = (bool)EEPROM.read(startIndex++);           // cast byte to boolean 0 => false, 1 => true
  }

  serializeJson(payload, Serial);
  serializeJson(payload, buff);
  connectAPI(url, buff);
  Serial.println("Prepare to change mode Wifi -> BLE...");
  EEPROM.write(0, 0);              // switch mode to ble mode
  EEPROM.commit();
  ESP.restart();
  /* make sure */
  vTaskDelete(NULL);
}

void setupWifi() {
  WiFiMulti.addAP(DEFAULT_WIFI_SSID, DEFAULT_WIFI_PASSWORD);
  /* Wait for WiFi Connection */
  Serial.println("Waiting for WiFi to connect...");
  while (WiFiMulti.run() != WL_CONNECTED) {
  }
  Serial.println("Wifi Connected...");
}

void setupBLE() {
  BLEDevice::init("Reference Node");
  BLEAddress ownAddress = BLEDevice::getAddress();
  // write own address to eeprom
  write_String(1, ownAddress.toString().c_str());
  bleScan = BLEDevice::getScan();            // create new scan
  bleScan->setActiveScan(true);              // active scan uses more power, but get results faster
  bleScan->setInterval(189);
  bleScan->setWindow(29);                    // less or equal setInterval value
}

void connectAPI(const char* url, char* buff) {
  /* connect to api */
  if (WiFiMulti.run() == WL_CONNECTED) {
    HTTPClient https;
    Serial.println("[HTTPS] begin...");
    if (https.begin(url)) {
      Serial.printf("[HTTPS] POST... %s\n", url);
      https.addHeader("Content-Type", "application/json");
      int httpCode = https.POST(buff);
      if (httpCode > 0) {
        Serial.printf("[HTTPS] POST... code: %d\n", httpCode);

        if (httpCode == HTTP_CODE_OK) {
          const char* payload = https.getString().c_str();
          Serial.printf("%s\n", payload);
        }
      } else {
        Serial.printf("[HTTPS] PSOT... failed, error: %s\n", https.errorToString(httpCode).c_str());
      }
    } else {
      Serial.println("[HTTPS] Unable to connect");
    }
    https.end();
  } else {
    Serial.println("Unable to create client");
  }
}

bool isExists(std::string address) {
  for (int i = 0; i < DEFAULT_MAX_USER; i++) {
    if (!strcmp(address.c_str(), deviceList[i].c_str())) {     // if equal strcmp return 0 or false
      return true;
    }
  }
  return false;
}

//float getDistance(int rssi, int txPower) {
//  return pow(10, (txPower - rssi) / (10 * 2));
//}

String read_String(int address) {
  int i;
  char data[100];     // Max 18 bytes
  int len = 0;
  unsigned char k;
  k = EEPROM.read(address);
  while (k != '\0' && len < 500)  //Read until null character
  {
    k = EEPROM.read(address + len);
    data[len] = k;
    len++;
  }
  data[len] = '\0';
  return String(data);
}

void write_String(int address, String data) {
  int _size = data.length();
  for (int i = 0; i < _size; i++)
  {
    EEPROM.write(address + i, data[i]);
  }
  EEPROM.write(address + _size, '\0'); //Add termination null character for String Data
  EEPROM.commit();
}
