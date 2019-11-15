#include <sys/time.h>
#include <BLEDevice.h>
#include <BLEUtils.h>
#include <M5Stack.h>
#include <utility/MPU9250.h>

#define EDDY_UUID   0xFEAA
#define DELTA_TIME  0.01        // 10 ms sample rate

#ifdef __cplusplus
extern "C" {
#endif

uint8_t temprature_sens_read();

#ifdef __cplusplus
}
#endif

// Prototype-Function
void appendFile(fs::FS &fs, const char * path, const char * message);
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
  SD.begin();   // for TF card
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
  float f_ax, f_ay, f_az;
  float f_gx, f_gy, f_gz;
  float totalAccel;
  while(1){
    // M5.update();
    if (IMU.readByte(MPU9250_ADDRESS, INT_STATUS) & 0x01){
      M5.Lcd.setCursor(0, 10);
      IMU.readAccelData(IMU.accelCount);
      IMU.readGyroData(IMU.gyroCount);
      IMU.getAres(); // get accelerometer scales saved to "aRes"
      IMU.getGres(); // get gyroscope scales saved to "gRes"
      
      IMU.ax = (float)IMU.accelCount[0] * IMU.aRes; // - accelBias[0];
      IMU.ay = (float)IMU.accelCount[1] * IMU.aRes; // - accelBias[1];
      IMU.az = (float)IMU.accelCount[2] * IMU.aRes; // - accelBias[2];

      IMU.gx = (float)IMU.gyroCount[0] * IMU.gRes;
      IMU.gy = (float)IMU.gyroCount[1] * IMU.gRes;
      IMU.gz = (float)IMU.gyroCount[2] * IMU.gRes;

      // accelRoll = (float)(atan2(IMU.ay, IMU.az)) * RAD_TO_DEG;
      // accelPitch = (float)(atan2(-IMU.ax, sqrt(pow(IMU.ay, 2) + pow(IMU.az, 2)))) * RAD_TO_DEG;
      // magX = IMU.mx * cos(accelPitch) + IMU.mz * sin(accelPitch);
      // magY = IMU.mx * sin(accelRoll) * sin(accelPitch) + IMU.my * cos(accelRoll) - IMU.mz * sin(accelRoll) * cos(accelPitch); 
      // magYaw = (float)(atan2(magY, magX)) * RAD_TO_DEG;
      
      // Complemetary Filter
      // roll = 0.98 * (roll + IMU.gx * DELTA_TIME) + 0.02 * accelRoll;
      // pitch = 0.98 * (pitch + IMU.gy * DELTA_TIME) + 0.02 * accelPitch;
      // yaw = 0.98 * (yaw + IMU.gz * DELTA_TIME) + 0.02 * magYaw;

      // low pass filter
      f_ax = IMU.ax * 0.98 + (f_ax * 0.02);
      f_ay = IMU.ay * 0.98 + (f_ay * 0.02);
      f_az = IMU.az * 0.98 + (f_az * 0.02);

      // high pass filter
      f_gx = (f_gx * DELTA_TIME) * 0.98 + (IMU.gx * 0.02);
      f_gy = (f_gy * DELTA_TIME) * 0.98 + (IMU.gy * 0.02);
      f_gz = (f_gz * DELTA_TIME) * 0.98 + (IMU.gz * 0.02);
      
      /*
      Serial.print(f_ax);
      Serial.print("\t");
      Serial.print(f_ay);
      Serial.print("\t");
      Serial.println(f_az);
      */

      /*
      M5.Lcd.println("Accelerometer");
      M5.Lcd.println(f_ax);
      M5.Lcd.println(f_ay);
      M5.Lcd.println(f_az);
      */
      
      /*
      Serial.print(f_gx);
      Serial.print("\t");
      Serial.print(f_gy);
      Serial.print("\t");
      Serial.println(f_gz);
      */

      /*
      M5.Lcd.println("Gyroscope");
      M5.Lcd.println(f_gx);
      M5.Lcd.println(f_gy);
      M5.Lcd.println(f_gz);
      */
      
      totalAccel = sqrt(f_ax * f_ax + f_ay * f_ay + f_az * f_az);
      // Serial.println(totalAccel);
      
      /*
      if (totalAccel >= 2){
        if (){
          
        }
      }
      */
      
    }
    vTaskDelay(20 / portTICK_PERIOD_MS); // 0.02 second
  }
  vTaskSuspend(NULL);
}

// Task for Advertising Beacon 
void advertiseBeaconTask(void *pvParameters){
  while (1){
    bootcount++;
    gettimeofday(&now, NULL);
    setupBeacon();
    pAdvertising->start();
    Serial.println("Start Advertising Beacon...");
    vTaskDelay(1000 / portTICK_PERIOD_MS); // for Advertise 1 second
    pAdvertising->stop();
    Serial.println("Stop Advertising Beacon...");
    vTaskDelay(1000 / portTICK_PERIOD_MS); // for break 1 second
  }
  vTaskSuspend(NULL);
}
