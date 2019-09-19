#include <sys/time.h>
#include <BLEEddystoneTLM.h>
#include <BLEDevice.h>
#include <BLEUtils.h>
#include <esp_sleep.h>
#include <M5Stack.h>

#define EDDY_UUID_H   0xFE
#define EDDY_UUID_L   0xAA

#define GPIO_DEEP_SLEEP_DURATION    5           // sleep x seconds and then wake up
RTC_DATA_ATTR static uint32_t timeSincePowerOn; // remember time since power on in RTC Memory
RTC_DATA_ATTR static uint32_t bootcount;        // remember number of boots in RTC Memory

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
float cpuTemp;

void setupBeacon() {
  //Test
  BLEEddystoneTLM beacon = BLEEddystoneTLM();
  //beacon.setVolt(5000);              //define 5000mV for test
  beacon.setTemp(cpuTemp);
  //beacon.setCount(bootcount);
  //beacon.setTime(timeSincePowerOn);

  BLEAdvertisementData advertisementData = BLEAdvertisementData();
  BLEAdvertisementData scanResponseData = BLEAdvertisementData();

  advertisementData.setFlags(0x06); // GENERAL_DISK_MODE 0x02 | BR_EDR_NOT_SUPPORTED 0x04

  std::string serviceData = "";
  serviceData += (char)0x03;                  // Len
  serviceData += (char)0x03;                  // 16-bit Service Class UUID
  serviceData += (char)EDDY_UUID_L;           // Eddystone UUID
  serviceData += (char)EDDY_UUID_H;
  serviceData += (char)0x11;                  // Eddystone-TLM Length
  serviceData += (char)0x16;                  // Service Data
  serviceData += (char)EDDY_UUID_L;
  serviceData += (char)EDDY_UUID_H;
  serviceData += beacon.getData();
  
  advertisementData.addData(serviceData);

  pAdvertising->setAdvertisementData(advertisementData);
  pAdvertising->setScanResponseData(scanResponseData);
  
}

void setup() {
  M5.begin();
  Serial.begin(115200);

  gettimeofday(&now, NULL);

  M5.Lcd.print("Device Start...\n");

  bootcount++;
  cpuTemp = (temprature_sens_read() - 32) / 1.8;
  timeSincePowerOn = now.tv_sec;

  // Create the BLE Device
  BLEDevice::init("Wearable");

  // Create the BLE Server
  pAdvertising = BLEDevice::getAdvertising();

  // Setup beacon
  setupBeacon();
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
  // cpuTemp = (temprature_sens_read() - 32) / 1.8;
}
