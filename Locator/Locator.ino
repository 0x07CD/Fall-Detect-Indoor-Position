#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEScan.h>
#include <BLE2902.h>
#include <BLEServer.h>
#include <BLEAdvertisedDevice.h>

// See the following for generating UUIDs:
// https://www.uuidgenerator.net/

// for Indoor Positioning Service
#define IPS_SERVICE_UUID        "fa6d99a5-1b0d-417b-8c96-25de8bfc4435"
#define IPS_CHARACTERISTIC_UUID "61207c9a-1a73-40fd-947c-ea1991601d4a"

const int scanTime = 5; // x seconds

BLEScan *pBLEScan;
BLEServer *pServer;
BLECharacteristic *pCharacteristic;

class MyAdvertisedDeviceCallbacks: public BLEAdvertisedDeviceCallbacks {
  void onResult(BLEAdvertisedDevice advertisedDevice) {
    // get address of found device 
    std::string wearable_address = advertisedDevice.getAddress().toString();
    // get rssi of found device
    int wearable_rssi = advertisedDevice.getRSSI();

    // Monitor
    Serial.printf("Advertised Device: %s and RSSI: ", wearable_address.c_str());
    Serial.printf("%d \n", wearable_rssi);

    // setup characteristic value
    // example address xx:xx:xx:xx:xx:xx
    // save "xx" only don't save ':', Therefore collecting 6 bytes of data
    // rssi is an integer, Therefore collecting 4 bytes of data
    // total 10 byte  
    uint8_t wearable_value[10];
    uint8_t wearable_nativeAddress[6];
    memcpy(wearable_nativeAddress, advertisedDevice.getAddress().getNative(), 6);
    
    // address value
    wearable_value[0] = wearable_nativeAddress[0];
    wearable_value[1] = wearable_nativeAddress[1];
    wearable_value[2] = wearable_nativeAddress[2];
    wearable_value[3] = wearable_nativeAddress[3];
    wearable_value[4] = wearable_nativeAddress[4];
    wearable_value[5] = wearable_nativeAddress[5];

    // rssi value
    wearable_value[6] = (uint8_t)wearable_rssi;
    wearable_value[7] = (uint8_t)(wearable_rssi >> 8);
    wearable_value[8] = (uint8_t)(wearable_rssi >> 16);
    wearable_value[9] = (uint8_t)(wearable_rssi >> 24);

    pCharacteristic->setValue(wearable_value, 10);
    pCharacteristic->notify();
  }
};

void setup() {
  Serial.begin(115200);
  Serial.println("Start...");

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
  Serial.println("Create Indoor Positioning Service");
  BLEService *ipsService = pServer->createService(IPS_SERVICE_UUID);
  Serial.print("Service UUID: ");
  Serial.println(ipsService->getUUID().toString().c_str());  //** invalid
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
  Serial.println("Waiting a Main Locator connection to notify...");
}

void loop() {
  BLEScanResults foundDevices = pBLEScan->start(scanTime, false);
  Serial.print("Devices found: ");
  Serial.println(foundDevices.getCount());
  Serial.println("Scan done!");
  pBLEScan->clearResults();   // delete results fromBLEScan buffer to release memory
  delay(2000);
}
