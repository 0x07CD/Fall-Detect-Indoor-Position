#include <sys/time.h>
#include <BLEDevice.h>
#include <BLEUtils.h>
#include <M5Stack.h>
#include <utility/MPU9250.h>

#define EDDY_UUID   0xFEAA
#define DELTA_TIME  0.02        // 20 ms sample rate

#ifdef __cplusplus
extern "C" {
#endif

uint8_t temprature_sens_read();

#ifdef __cplusplus
}
#endif

// Prototype-Function
void setupBeacon();
void fallDetectTask(void *pvParameters);
void advertiseBeaconTask(void *pvParameters);

// Global Variable
BLEAdvertising *pAdvertising;
MPU9250 IMU;
TaskHandle_t fall_detect_task_handle;
TaskHandle_t advertise_beacon_task_handle;
struct timeval now;
uint32_t bootcount;

// M5 for test
void setup() {
  M5.begin();
  Wire.begin();
  IMU.initMPU9250();
  IMU.initAK8963(IMU.magCalibration);
  IMU.calibrateMPU9250(IMU.gyroBias, IMU.accelBias);
  Serial.begin(115200);
  M5.Lcd.print("Device Start...\n");
  // Create the BLE Device
  BLEDevice::init("Wearable");
  // Create the BLE Server
  pAdvertising = BLEDevice::getAdvertising();

  // Create Task
  xTaskCreate(fallDetectTask, "Fall-Detection Task", 10000, NULL, 2, &fall_detect_task_handle);
  xTaskCreate(advertiseBeaconTask, "Advertising Beacon Task", 10000, NULL, 1, &advertise_beacon_task_handle);
}

void loop() {
   
}

// setup eddystone beacon
void setupBeacon() {
  // for test
  char beacon_data[22];
  float cpuTemp = (temprature_sens_read() - 32) / 1.8;

  // setup eddystone-tlm data
  uint16_t beaconUUID = 0xFEAA;         // Eddystone 16-bit UUID
  // test value
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

// Task for Fall-Detection
void fallDetectTask(void *pvParameters){
  float accelRoll, accelPitch;
  float roll, pitch;
  float passRoll, passPitch;
  while(1){
    if (IMU.readByte(MPU9250_ADDRESS, INT_STATUS) & 0x01)
    {
      M5.Lcd.setCursor(0, 10);
      IMU.readAccelData(IMU.accelCount);
      IMU.readGyroData(IMU.gyroCount);
      // IMU.readMagData(IMU.magCount);
      IMU.getAres(); // get accelerometer scales saved to "aRes"
      IMU.getGres(); // get gyroscope scales saved to "gRes"
      // IMU.getMres(); // get megnetometor scales saved to "mRes"
      
      IMU.ax = (float)IMU.accelCount[0] * IMU.aRes; // - accelBias[0];
      IMU.ay = (float)IMU.accelCount[1] * IMU.aRes; // - accelBias[1];
      IMU.az = (float)IMU.accelCount[2] * IMU.aRes; // - accelBias[2];

      IMU.gx = (float)IMU.gyroCount[0] * IMU.gRes;
      IMU.gy = (float)IMU.gyroCount[1] * IMU.gRes;
      IMU.gz = (float)IMU.gyroCount[2] * IMU.gRes;
      
      // IMU.mx = (float)IMU.magCount[0] * IMU.mRes * IMU.magCalibration[0] - IMU.magbias[0];
      // IMU.my = (float)IMU.magCount[1] * IMU.mRes * IMU.magCalibration[1] - IMU.magbias[1];
      // IMU.mz = (float)IMU.magCount[2] * IMU.mRes * IMU.magCalibration[2] - IMU.magbias[2];

      accelRoll = (float)(atan2(IMU.ay, IMU.az)) * RAD_TO_DEG;
      accelPitch = (float)(atan2(-IMU.ax, sqrt(pow(IMU.ay, 2) + pow(IMU.az, 2)))) * RAD_TO_DEG;
      // magX = IMU.mx * cos(accelPitch) + IMU.mz * sin(accelPitch);
      // magY = IMU.mx * sin(accelRoll) * sin(accelPitch) + IMU.my * cos(accelRoll) - IMU.mz * sin(accelRoll) * cos(accelPitch); 
      // magYaw = (float)(atan2(magY, magX)) * RAD_TO_DEG;

      passRoll = roll;
      passPitch = pitch;
      
      // Complemetary Filter
      roll = 0.98 * (roll + IMU.gx * DELTA_TIME) + 0.02 * accelRoll;
      pitch = 0.98 * (pitch + IMU.gy * DELTA_TIME) + 0.02 * accelPitch;
      // yaw = 0.98 * (yaw + IMU.gz * DELTA_TIME) + 0.02 * magYaw;

      // for plot graph
      Serial.print("Roll\t");
      Serial.print(roll);
      Serial.print("\tPitch\t");
      Serial.println(pitch);
      // Serial.print("\tYaw\t");
      // Serial.println(yaw);

      M5.Lcd.print("Roll: ");
      M5.Lcd.println(roll);
      M5.Lcd.print("Pitch: ");
      M5.Lcd.println(pitch);
      // M5.Lcd.print("Yaw: ");
      // M5.Lcd.println(yaw);

      /* Fall Detect
       *  
       *  code
       *  
       */

    }
    vTaskDelay(20 / portTICK_PERIOD_MS); // 0.02 second
  }
}

// Task for Advertising Beacon 
void advertiseBeaconTask(void *pvParameters){
  while (1){
    bootcount++;
    gettimeofday(&now, NULL);
    setupBeacon();
    pAdvertising->start();
    // Serial.println("Start Advertising Beacon...");
    vTaskDelay(1000 / portTICK_PERIOD_MS); // for Advertise 1 second
    pAdvertising->stop();
    // Serial.println("Stop Advertising Beacon...");
    vTaskDelay(1000 / portTICK_PERIOD_MS); // for break 1 second
  }
}
