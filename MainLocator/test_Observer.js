var noble = require('noble');

// service, characteristic uuid of [indoor positioning system] 
const ips_service_uuid = 'fa6d99a51b0d417b8c9625de8bfc4435';
const ips_characteristic_uuid = '61207c9a1a7340fd947cea1991601d4a';

// event: state change
noble.on('stateChange', function(state) {
	console.log('State has changed: ' + state);
	
	if (state === 'poweredOn') {
		noble.startScanning(ips_service_uuid);
	} else {
		noble.stopScanning();
	}
});

// event: scan start
noble.on('scanStart', function() {
	console.log('Scan start...');
});

// event: scan stop
noble.on('scanStop', function() {
	console.log('Scan stop...');
});

// event: discover ble device
noble.on('discover', function(peripheral) {
	console.log('Discover: [Local Name: "' + peripheral.advertisement['localName'] + '", Address: "' + peripheral['address'] + '"]');
	
	noble.stopScanning();
	
	peripheral.connect();
	
	peripheral.once('connect', function() {
		console.log('Connected...');
		this.updateRssi();
	});
	
	peripheral.once('disconnect', function() {
		console.log('Disconnected...');
	});
	
	peripheral.once('rssiUpdate', function(rssi) {
		console.log('RSSI update: ' + rssi);
		this.discoverServices();
	});
	
	peripheral.once('servicesDiscover', function(services) {
		var serviceIndex = 0;
		
		services.forEach((service, index) => {
			console.log('Services discovered: [UUID: "' + service["uuid"] + '", Service Name: "' + service["name"] + '"]');
			
			// search indoor positioning system service
			if (service["uuid"] === ips_service_uuid) {
				serviceIndex = index;
			}
		});
		
		// action: discover characteristic by uuid
		services[serviceIndex].discoverCharacteristics(ips_characteristic_uuid);
		
		services[serviceIndex].once('characteristicsDiscover', function(characteristics) {
			var characteristicIndex = 0;
			
			characteristics.forEach((characteristic, index) => {
				console.log('Characteristics discovered: [UUID: "' + characteristic["uuid"] + '", Properties: "' + characteristic["properties"] + '"]');
				
				if (characteristic["uuid"] === ips_characteristic_uuid) {
					characteristicIndex = index;
				}
			});
			
			// action: read characteristic value
			characteristics[characteristicIndex].read();
		
			characteristics[characteristicIndex].once('read', function(data, isNotification) {
				// contain wearable device address
				var segment_one = data.slice(0, 6);
				
				// contain rssi of wearable device
				var segment_two = data.slice(6, data.length);
				
				// convert buffer to JSON
				// example => https://www.tutorialspoint.com/nodejs/nodejs_buffers.htm
				var json_data = segment_one.toJSON();
				var raw_data = Object.values(json_data["data"]);
				
				var wearable_address = raw_data[0].toString(16) + ':'
									 + raw_data[1].toString(16) + ':'
									 + raw_data[2].toString(16) + ':'
									 + raw_data[3].toString(16) + ':'
									 + raw_data[4].toString(16) + ':'
									 + raw_data[5].toString(16);
									 
				var wearable_rssi = segment_two[0] + (segment_two[1] << 8) + (segment_two[2] << 16) + (segment_two[3] << 24);
				
				console.log('characteristic data: [Wearable Address: "' + wearable_address + '", Wearable RSSI: "' + wearable_rssi + '"]');
			
				peripheral.disconnect();
			});
		
		});
					
	});

});

