#ifndef _KalmanFilter_h
#define _KalmanFilter_h

class KalmanFilter {
public:
    KalmanFilter(float r, float q, float a, float b, float c);
	KalmanFilter(float r, float q);
	
	float filter(float measurement, float u);
	float filter(float measurement);
	
	float lastMeasurement();
	void setMeasurement(float noise);
	void setProcessNoise(float noise);
private:
	float R;
	float Q;
	
	float A;
	float B;
	float C;
	
	float x;
	float cov;
};

#endif