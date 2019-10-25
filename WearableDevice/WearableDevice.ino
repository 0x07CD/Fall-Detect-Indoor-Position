#include <sys/time.h>
#include <BLEDevice.h>
#include <BLEUtils.h>
#include <esp_sleep.h>
#include <M5Stack.h>

#define EDDY_UUID   0xFEAA

#define GPIO_DEEP_SLEEP_DURATION    2             // sleep x seconds and then wake up
RTC_DATA_ATTR static uint32_t last;               // remember last boot in RTC Memory
RTC_DATA_ATTR static uint32_t bootcount;          // remember number of boots in RTC Memory

#ifdef __cplusplus
extern "C" {
#endif

uint8_t temprature_sens_read();

#ifdef __cplusplus
}
#endif

// Variable
BLEAdvertising *pAdvertising;
struct timeval now;

// setup eddystone beacon
void setupBeacon() {
  // for test
  char beacon_data[22];
  float cpuTemp = (temprature_sens_read() - 32) / 1.8;

  // setup eddystone-tlm data
  uint16_t beaconUUID = 0xFEAA;         // Eddystone 16-bit UUID
  uint16_t volt = 3300;                 // 3300mV = 3.3V
  uint16_t temp = (uint16_t)cpuTemp;    // CPU Temp celcius
  uint32_t tmil = now.tv_sec*10;
  

  BLEAdvertisementData advertisementData = BLEAdvertisementData();

  advertisementData.setFlags(0x06); // GENERAL_DISK_MODE 0x02 | BR_EDR_NOT_SUPPORTED 0x04
  advertisementData.setCompleteServices(BLEUUID(beaconUUID));

  beacon_data[0] = 0x20;            // Eddystone Frame Type (Unencrypted Eddystone-TLM)
  beacon_data[1] = 0x00;            // TLM version
  beacon_data[2] = (volt>>8);       // Battery voltage, 1 mV/bit i.e. 0xCE4 = 3300mV = 3.3V
  beacon_data[3] = (volt&0xFF);     // 
  beacon_data[4] = (temp&0xFF);     // Beacon temperature
  beacon_data[5] = (temp>>8);       // 
  beacon_data[6] = ((bootcount & 0xFF000000) >> 24);  // Advertising PDU count
  beacon_data[7] = ((bootcount & 0xFF0000) >> 16);    // 
  beacon_data[8] = ((bootcount & 0xFF00) >> 8);       // 
  beacon_data[9] = (bootcount&0xFF);                  // 
  beacon_data[10] = ((tmil & 0xFF000000) >> 24);      // Time since power-on or reboot
  beacon_data[11] = ((tmil & 0xFF0000) >> 16);        // 
  beacon_data[12] = ((tmil & 0xFF00) >> 8);           // 
  beacon_data[13] = (tmil&0xFF);                      //
  
  advertisementData.setServiceData(BLEUUID(beaconUUID), std::string(beacon_data, 14));

  pAdvertising->setScanResponseData(advertisementData);
  
}

// M5 for test
void setup() {
  M5.begin();
  Serial.begin(115200);

  gettimeofday(&now, NULL);

  M5.Lcd.print("Device Start...\n");

  bootcount++;
  last = now.tv_sec;

  // Create the BLE Device
  BLEDevice::init("Wearable");

  // Create the BLE Server
  pAdvertising = BLEDevice::getAdvertising();

  // Setup beacon
  setupBeacon();
  // Start Advertising
  pAdvertising->start();
  M5.Lcd.print("Advertizing started...\n");
  delay(100);
  pAdvertising->stop();
  M5.Lcd.print("Enter Deep Sleep\n");
  esp_deep_sleep(1000000LL * GPIO_DEEP_SLEEP_DURATION);
  M5.Lcd.print("In Deep Sleep\n");
  M5.update();
}

void loop() {
  
}
