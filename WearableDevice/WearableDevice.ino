/* Include library file */
#include <M5Stack.h>
#include <BLE2902.h>
#include <BLEUtils.h>
#include <sys/time.h>
#include <BLEDevice.h>
#include <BLEServer.h>
#include <utility/MPU9250.h>

/* Define */
#define FALL_DETECT_SERVICE_UUID            "f2ad493c-4abb-4f33-9e25-0417ea0d1daf"
#define FALL_DETECT_CHARACTERISTIC_UUID     "bd663898-580e-411c-aa1c-65a839e176ec"
#define LOWER_THRESHOLD_ACCEL               0.2
#define UPPER_THRESHOLD_ACCEL               3.2
#define THRESHOLD_GYRO                      400

/* Define Prototype-Function */
void fallDetectTask(void *pvParameters);
void setupAdvertisementData(const char* data);

/* Define Global Variable */
MPU9250 IMU;
BLEServer* bleServer;
BLEAdvertising *bleAdvertising;
TaskHandle_t fall_detect_task_handle;

enum type {
  normal_activity,
  pre_fall,
  fall_detect
};

enum type state;

void setup() {
  M5.begin();
  Wire.begin();

  IMU.initMPU9250();
  IMU.initAK8963(IMU.magCalibration);
  IMU.calibrateMPU9250(IMU.gyroBias, IMU.accelBias);

  Serial.begin(115200);
  M5.Lcd.print("Device Start...\n");

  /* Create the BLE Device */
  BLEDevice::init("Wearable");
  /* Start advertising */
  bleAdvertising = BLEDevice::getAdvertising();
  setupAdvertisementData("test");

  vTaskPrioritySet(NULL, 1);    // set priority loop task

  /* initial state */
  state = normal_activity;

  /* Create Task */
  xTaskCreate(fallDetectTask, "Fall-Detection Task", 4000, NULL, 2, &fall_detect_task_handle);
}

void loop() {
  bleAdvertising->start();
  // Serial.println("Start Advertising...");
  vTaskDelay(250);

  bleAdvertising->stop();
  // Serial.println("Stop Advertising...");
  vTaskDelay(250);
}

/* Task for Fall-Detection */
void fallDetectTask(void *pvParameters) {
  float f_ax, f_ay, f_az;
  float f_gx, f_gy, f_gz;
  float vsa;                // vector sum of acceleration data = sqrt(x^2 + y^2 + z^2)
  float vsg;
  uint8_t wait = 0;
  while (1) {
    M5.update();
    if (IMU.readByte(MPU9250_ADDRESS, INT_STATUS) & 0x01) {
      M5.Lcd.setCursor(0, 10);
      IMU.readAccelData(IMU.accelCount);
      IMU.readGyroData(IMU.gyroCount);
      IMU.getAres(); // get accelerometer scales saved to "aRes"
      IMU.getGres(); //

      IMU.ax = (float)IMU.accelCount[0] * IMU.aRes; // - accelBias[0];
      IMU.ay = (float)IMU.accelCount[1] * IMU.aRes; // - accelBias[1];
      IMU.az = (float)IMU.accelCount[2] * IMU.aRes; // - accelBias[2];

      IMU.gx = (float)IMU.gyroCount[0] * IMU.gRes;
      IMU.gy = (float)IMU.gyroCount[1] * IMU.gRes;
      IMU.gz = (float)IMU.gyroCount[2] * IMU.gRes;

      /* Low pass filter */
      f_ax = IMU.ax * 0.98 + (f_ax * 0.02);
      f_ay = IMU.ay * 0.98 + (f_ay * 0.02);
      f_az = IMU.az * 0.98 + (f_az * 0.02);

      f_gx = IMU.gx;
      f_gy = IMU.gy;
      f_gz = IMU.gz;

      vsa = sqrt(f_ax * f_ax + f_ay * f_ay + f_az * f_az);
      vsg = sqrt(f_gx * f_gx + f_gy * f_gy + f_gz * f_gz);

      switch (state) {
        case normal_activity:
          wait = 0;
          if (vsa < LOWER_THRESHOLD_ACCEL) {
            if (vsg >= THRESHOLD_GYRO) {
              state = pre_fall;
            } else {
              state = normal_activity;
            }
          } else if (vsa > UPPER_THRESHOLD_ACCEL) {
            state = pre_fall;
          } else {
            state = normal_activity;
          }
          break;
        case pre_fall:
          if (vsa + 1 <= 1 || vsa + 1 >= 1) {
            if (wait == 5) {
              state = fall_detect;
            } else {
              wait++;
            }
          } else {
            state = normal_activity;
          }
          break;
        case fall_detect:
          wait = 0;
          setupAdvertisementData("Fall Detected !!!");
          Serial.println("Detect");
          M5.Speaker.tone(165, 3000);
          vTaskDelay(3000);
          state = normal_activity;
          break;
        default:
          break;
      }

      M5.Lcd.println(vsa);
      M5.Lcd.println(vsg);

      Serial.print(vsa);
      Serial.print("\t");
      Serial.println(vsg);

    }
    vTaskDelay(100);
  }
  vTaskDelete(NULL);
}

void setupAdvertisementData(const char* data) {
  BLEAdvertisementData advertisementData = BLEAdvertisementData();

  advertisementData.setServiceData(BLEUUID(FALL_DETECT_SERVICE_UUID), data);

  //  std::string serviceData = "";
  //  serviceData += (char)strlen(data);      // len
  //  serviceData += (char)0xFF;              // type
  //  serviceData += data;
  // advertisementData.setFlags(0x04);             // BR_EDR_NOT_SUPPORTED 0x04
  //  advertisementData.addData("data");

  bleAdvertising->setAdvertisementData(advertisementData);
}
