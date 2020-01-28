#include <M5Stack.h>
#include <utility/MPU9250.h>

#define DELTA_TIME  0.01        // 10 ms sample rate

File file;
MPU9250 IMU;
float f_ax, f_ay, f_az;
float f_gx, f_gy, f_gz;
float totalAccel;
char buf[6];

void setup() {
  M5.begin();
  Wire.begin();
  Serial.begin(9600);
  if (!SD.begin()) {
    M5.Lcd.println("Card failed, or not present");
    while(1);
  }
  IMU.initMPU9250();
  IMU.calibrateMPU9250(IMU.gyroBias, IMU.accelBias);
  file = SD.open("/record.txt", FILE_APPEND);
  if (file) {
      file.println("----------------------------------------");
      file.println("new record");
      file.println("----------------------------------------");
      file.close();
    }
}

void loop() {
  M5.update();
  M5.Lcd.setCursor(0, 10);
  if (IMU.readByte(MPU9250_ADDRESS, INT_STATUS) & 0x01) {
    IMU.readAccelData(IMU.accelCount);
    IMU.getAres(); // get accelerometer scales saved to "aRes"
      
    IMU.ax = (float)IMU.accelCount[0] * IMU.aRes; // - accelBias[0];
    IMU.ay = (float)IMU.accelCount[1] * IMU.aRes; // - accelBias[1];
    IMU.az = (float)IMU.accelCount[2] * IMU.aRes; // - accelBias[2];

    // low pass filter
    f_ax = IMU.ax * 0.98 + (f_ax * 0.02);
    f_ay = IMU.ay * 0.98 + (f_ay * 0.02);
    f_az = IMU.az * 0.98 + (f_az * 0.02);

    totalAccel = sqrt(f_ax * f_ax + f_ay * f_ay + f_az * f_az);
    Serial.print(f_ax);
    Serial.print("\t");
    Serial.print(f_ay);
    Serial.print("\t");
    Serial.print(f_az);
    Serial.print("\t");
    Serial.println(totalAccel);

    file = SD.open("/record.txt", FILE_APPEND);
    if (file) {
      gcvt(totalAccel, 6, buf);
      M5.Lcd.print(buf);
      file.println(buf);
      file.close();
    }
  }
  delay(100);
}
