#include "./WearableQueue.h"
#include <BLEDevice.h>

WearableQueue::WearableQueue(uint8_t capacity){
	this->size = 0;
	this->capacity = capacity;
	this->front = 0;
	this->rear = -1;
	this->queue = new std::string[this->capacity];
}

int WearableQueue::getSize(){
	return this->size;
}

bool WearableQueue::isFull(){
	return this->size == this->capacity;
}

bool WearableQueue::isEmpty(){
	return this->size == 0;
}

bool WearableQueue::haveElement(std::string wearable_address){
	for (int i = 0; i < this->size; i++) {
		if (!strcmp(wearable_address.c_str(), this->queue[i].c_str())) {
			return true;
		} 
	}
	return false;
}

void WearableQueue::enqueue(std::string element){
	if (isFull()) {
		return;
	}
	this->rear += 1;
	this->queue[this->rear] = element;
	this->size += 1;
}

void WearableQueue::deleteElement(std::string wearable_address){
	if (isEmpty()) {
		return;
	}
	int i = this->front;
	while (i < this->size && strcmp(this->queue[i].c_str(), wearable_address.c_str()) ) {
		i++;
	}
	/* if not have */
	if (i == this->size) {
		return;
	}
	/* else queue element "i" is a target */
	while (i < this->rear) {
		this->queue[i] = this->queue[i+1];
		i++;
	}
	this->queue[i] = "";
	this->rear -= 1;
	this->size -= 1;
	return;
}

std::string WearableQueue::dequeue(){
	if (isEmpty()) {
		return NULL;
	}
	std::string item = this->queue[this->front];
	int i = this->front;
	while (i < this->size) {
		this->queue[i] = this->queue[i+1];
	}
	this->rear -= 1;
	this->size -= 1;
}

std::string WearableQueue::getFront(){
	return this->queue[this->front];
}

std::string WearableQueue::getRear(){
	return this->queue[this->rear];
}