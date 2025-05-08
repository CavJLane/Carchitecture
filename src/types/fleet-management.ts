// Car Company Data Structure for Cameron's Cars

// Car class
export class Car {
  carId: number;
  carName: string;
  brandId: number; // This should ALWAYS match the brand_id of the brandRecord passed into the constructor.
  brandName: string;
  driverId: number;
  sensors: Sensor[];
  constructor(carRecord: CarRecord, brandRecord: BrandRecord, sensors: Sensor[]) {
    this.carId = carRecord.car_id;
    this.carName = carRecord.car_name;
    this.brandId = carRecord.brand_id;
    this.brandName = brandRecord.brand_name;
    this.driverId = carRecord.driver_id;
    this.sensors = sensors;
  }
}

// Car record interface
export interface CarRecord {
  car_id: number;
  car_name: string;
  brand_id: number;
  driver_id: number;
}

// Brand record interface
export interface BrandRecord {
  brand_id: number;
  brand_name: string;
  brand_type: 'TRUCK' | 'SEDAN';
}

// Driver record interface
export interface DriverRecord {
  driver_id: number;
  driver_name: string;
}

// Fleet record interface
export interface FleetRecord {
  fleet_id: number;
  fleet_name: string;
}

// Fleet link record interface
export interface FleetLinkRecord {
  car_id: number; // Matches the car_id of the CarRecord to which it is mapped.
  fleet_id: number; // Matches the fleet_id of the FleetRecord to which it is mapped.
}

// Sensor-Car link record interface
export interface SensorCarLinkRecord {
  id: number;
  car_id: number;
  sensor_id: number;
}

// Sensor class
export class Sensor {
  sensor_id: number;
  notes: {};
  constructor(sensorRecord: SensorRecord) {
    this.sensor_id = sensorRecord.sensor_id;
    this.notes = sensorRecord.notes;
  }
}

// Sensor record interface
export interface SensorRecord {
  sensor_id: number;
  notes: {};
}

// Truck sensor record interface
export interface TruckSensorRecord {
  sensor_id: number; // Matches the sensor_id of the SensorRecord to which it is mapped.
  truck_speed_max: number;
  truck_speed_min: number;
}

// Sedan sensor record interface
export interface SedanSensorRecord {
  sensor_id: number; // Matches the sensor_id of the SensorRecord to which it is mapped.
  sedan_speed_max: number;
  sedan_speed_min: number;
}

// Truck speed sensor mode record interface
export interface TruckSpeedSensorModeRecord {
  mode_id: number;
  mode_name: string;
  mode_type: 'Fast' | 'Slow';
  average_speed: number;
}

// Truck heat sensor mode record interface
export interface TruckHeatSensorModeRecord {
  mode_id: number;
  mode_name: string;
  mode_type: 'Hot' | 'Cold';
  average_temp: number;
}

// Truck speed mode sensor link record interface
export interface TruckSpeedModeSensorLinkRecord {
  sensor_id: number; // Matches the sensor_id of the SensorRecord to which it is mapped.
  mode_id: number; // Matches the mode_id of the SensorRecord to which it is mapped.
}

// Truck heat mode sensor link record interface
export interface TruckHeatModeSensorLinkRecord {
  sensor_id: number; // Matches the sensor_id of the SensorRecord to which it is mapped.
  mode_id: number; // Matches the mode_id of the SensorRecord to which it is mapped.
} 