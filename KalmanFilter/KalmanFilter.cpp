#include <KalmanFilter.h>

KalmanFilter::KalmanFilter(float r, float q, float a, float b, float c){
	A = a;		// state vector
	B = b;		// control vector
	C = c;		// Measurement vector

	R = r;		// Process noise
	Q = q;		// Measurement noise
	
	cov = 0;
	x = 0;

};

KalmanFilter::KalmanFilter(float r, float q){
	R = r;
	Q = q;
};

float KalmanFilter::filter(float measurement, float u){
	if (x == 0){
		x = (1/C) * measurement;
		cov = (1/C) * Q * (1/C);
	}else{
		float predicX = (A * x) + (B * u);
		float predicCov = ((A * cov) * A) + R;
		
		float K = predicCov * C * (1/((C * predicCov * C) + Q));
		
		x = predicX + K * (measurement - (C * predicX));
		cov = predicCov - (K * C * predicCov);
	}
	return x;
};

float KalmanFilter::filter(float measurement){
	float u = 0;
	if (x == 0){
		x = (1/C) * measurement;
		cov = (1/C) * Q * (1/C);
	}else{
		float predicX = (A * x) + (B * u);
		float predicCov = ((A * cov) * A) + R;
		
		float K = predicCov * C * (1/((C * predicCov * C) + Q));
		
		x = predicX + K * (measurement - (C * predicX));
		cov = predicCov - (K * C * predicCov);
	}
	return x;
};

float KalmanFilter::lastMeasurement(){
	return x;
};

void KalmanFilter::setMeasurement(float noise){
	Q = noise;
};

void KalmanFilter::setProcessNoise(float noise){
	R = noise;
};