#include <BLEDevice.h>

class WearableQueue {
	private:
		int front, rear, size;
		uint8_t capacity;
		std::string* queue;
		
	public:
		WearableQueue(uint8_t capacity);
		
		int getSize();
		
		bool isFull();
		bool isEmpty();
		bool haveElement(std::string waerable_address);
	
		void enqueue(std::string element);
		void deleteElement(std::string waerable_address);
		
		std::string dequeue();
		std::string getFront();
		std::string getRear();
		
};