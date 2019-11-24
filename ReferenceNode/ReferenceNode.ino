#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEScan.h>
#include <BLE2902.h>
#include <BLEServer.h>
#include <BLEAdvertisedDevice.h>
#include <KalmanFilter.h>

// See the following for generating UUIDs:
// https://www.uuidgenerator.net/

// for Indoor Positioning Service
/*
 * R1 = -71.1 dBm
 * R2 = -74.8 dBm
 */
#define TX_POWER                -64.734         // find Distance Power with measurement RSSI between Reference and Wristband in 1 meter
#define WRISTBAND1_MAC          "80:7d:3a:c4:5e:b2"
#define IPS_SERVICE_UUID        "fa6d99a5-1b0d-417b-8c96-25de8bfc4435"
#define IPS_CHARACTERISTIC_UUID "61207c9a-1a73-40fd-947c-ea1991601d4a"

const int scanTime = 1; // x seconds

BLEScan *pBLEScan;
BLEServer *pServer;
BLECharacteristic *pCharacteristic;
KalmanFilter kf = KalmanFilter(0.01f, 2.0f, 1.0f, .0f, 1.0f);
TaskHandle_t scan_beacon_task_handle;
TaskHandle_t update_distance_task_handle;
volatile float rssi_filter = 0;
volatile float distance = 0;
int wearable_rssi;
uint8_t wearable_value[10];
uint8_t wearable_nativeAddress[6];

void scanBeaconTask(void *pvParameters);
void updateDistanceTask(void *pvParameters);

class MyAdvertisedDeviceCallbacks: public BLEAdvertisedDeviceCallbacks {
    void onResult(BLEAdvertisedDevice advertisedDevice) {
      // get address of found device
      std::string wearable_address = advertisedDevice.getAddress().toString();
      if (!strcmp(wearable_address.c_str(), WRISTBAND1_MAC)) {
        // get rssi of found device
        wearable_rssi = advertisedDevice.getRSSI();
        memcpy(wearable_nativeAddress, advertisedDevice.getAddress().getNative(), 6);

        // Monitor
        //Serial.printf("Advertised Device: %s and RSSI: ", wearable_address.c_str());
        //Serial.printf("%d \n", wearable_rssi);

        // distance = 10^(tx_power - rssi / 10 * n)
        /*
        rssi_filter = kf.filter(wearable_rssi);
        Serial.println(wearable_rssi);
        Serial.println(rssi_filter);
        distance = pow(10, (TX_POWER - rssi_filter) / (10 * 2.5));
        Serial.println(distance);
        */
      }
    }
};

void setup() {
  Serial.begin(115200);
  //Serial.println("Start...");

  // Create the BLE Device
  BLEDevice::init("Locator");
  pBLEScan = BLEDevice::getScan();            // create new scan
  pBLEScan->setAdvertisedDeviceCallbacks(new MyAdvertisedDeviceCallbacks());
  pBLEScan->setActiveScan(true);              // active scan uses more power, but get results faster
  pBLEScan->setInterval(100);
  pBLEScan->setWindow(99);                    // less or equal setInterval value

  // Create the BLE Server
  pServer = BLEDevice::createServer();

  // Create the Indoor Positioning Service
  //Serial.println("Create Indoor Positioning Service");
  BLEService *ipsService = pServer->createService(IPS_SERVICE_UUID);
  //Serial.print("Service UUID: ");
  //Serial.println(ipsService->getUUID().toString().c_str());  //** invalid
  pCharacteristic = ipsService->createCharacteristic(
                      IPS_CHARACTERISTIC_UUID,
                      BLECharacteristic::PROPERTY_READ   |
                      BLECharacteristic::PROPERTY_WRITE  |
                      BLECharacteristic::PROPERTY_NOTIFY |
                      BLECharacteristic::PROPERTY_INDICATE
                    );

  pCharacteristic->setWriteProperty(false);

  // Create a BLE Descriptor
  pCharacteristic->addDescriptor(new BLE2902());

  // Start the Indoor Positioning Service
  ipsService->start();

  BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(IPS_SERVICE_UUID);
  pAdvertising->setScanResponse(true);
  pAdvertising->setMinPreferred(0x00);  // set value to 0x00 to not advertise this parameter

  // Start advertising
  BLEDevice::startAdvertising();

  // Create Task
  xTaskCreate(scanBeaconTask, "Scan Beacon Task", 10000, NULL, 2, &scan_beacon_task_handle);
  xTaskCreate(updateDistanceTask, "Update Distance Task", 10000, NULL, 1, &update_distance_task_handle);

}

void loop() {

}

void scanBeaconTask(void *pvParameters) {
  while(1){
    BLEScanResults foundDevices = pBLEScan->start(scanTime, false);
    Serial.printf("find MAC Address: %s\n", WRISTBAND1_MAC);
    Serial.print("Devices found: ");
    Serial.println(foundDevices.getCount());
    Serial.println("Scan done!");
    pBLEScan->clearResults();   // delete results fromBLEScan buffer to release memory
    vTaskDelay(100 / portTICK_PERIOD_MS);
  }
  vTaskSuspend(NULL);
}

void updateDistanceTask(void *pvParameters) {
  while(1){
    
    rssi_filter = kf.filter(wearable_rssi);
    Serial.println(wearable_rssi);
    Serial.println(rssi_filter);
    distance = pow(10, (TX_POWER - rssi_filter) / (10 * 2.5));
    Serial.println(distance);
  
    // setup characteristic value
    // example address xx:xx:xx:xx:xx:xx
    // save "xx" only don't save ':', Therefore collecting 6 bytes of data
    // rssi is an integer, Therefore collecting 4 bytes of data
    // total 10 byte
    wearable_value[0] = wearable_nativeAddress[0];
    wearable_value[1] = wearable_nativeAddress[1];
    wearable_value[2] = wearable_nativeAddress[2];
    wearable_value[3] = wearable_nativeAddress[3];
    wearable_value[4] = wearable_nativeAddress[4];
    wearable_value[5] = wearable_nativeAddress[5];
    wearable_value[6] = (uint8_t)(int)distance;
    wearable_value[7] = (uint8_t)((int)distance >> 8);
    wearable_value[8] = (uint8_t)((int)distance >> 16);
    wearable_value[9] = (uint8_t)((int)distance >> 24);

    pCharacteristic->setValue(wearable_value, 10);
    pCharacteristic->notify();
    vTaskDelay(250 / portTICK_PERIOD_MS);
  }
  vTaskSuspend(NULL);
}
