import type {
  CarRecord, BrandRecord, FleetRecord, FleetLinkRecord, DriverRecord, SensorRecord, SensorCarLinkRecord, TruckSensorRecord, SedanSensorRecord, TruckSpeedSensorModeRecord, TruckHeatSensorModeRecord, TruckSpeedModeSensorLinkRecord, TruckHeatModeSensorLinkRecord
} from '../types/fleet-management'

// --- Sample Data for Cameron's Cars ---

// Brands
export const brandRecords: BrandRecord[] = [
  { brand_id: 1, brand_name: 'Toyota', brand_type: 'TRUCK' },
  { brand_id: 2, brand_name: 'Honda', brand_type: 'SEDAN' },
  { brand_id: 3, brand_name: 'Ford', brand_type: 'TRUCK' },
  { brand_id: 4, brand_name: 'Mazda', brand_type: 'SEDAN' }
]

// Drivers
export const driverRecords: DriverRecord[] = [
  { driver_id: 1, driver_name: 'John Smith' },
  { driver_id: 2, driver_name: 'Jane Doe' },
  { driver_id: 3, driver_name: 'Alex Kim' },
  { driver_id: 4, driver_name: 'Priya Patel' }
]

// Fleets
export const fleetRecords: FleetRecord[] = [
  { fleet_id: 1, fleet_name: 'Main Fleet' },
  { fleet_id: 2, fleet_name: 'Secondary Fleet' },
  { fleet_id: 3, fleet_name: 'Urban Fleet' },
  { fleet_id: 4, fleet_name: 'Rural Fleet' }
]

// Cars
export const carRecords: CarRecord[] = [
  { car_id: 1, car_name: 'Truck Alpha', brand_id: 1, driver_id: 1 },
  { car_id: 2, car_name: 'Sedan Beta', brand_id: 2, driver_id: 2 },
  { car_id: 3, car_name: 'Truck Gamma', brand_id: 3, driver_id: 3 },
  { car_id: 4, car_name: 'Sedan Delta', brand_id: 4, driver_id: 4 }
]

// Fleet-Car Links
export const fleetLinkRecords: FleetLinkRecord[] = [
  { car_id: 1, fleet_id: 1 },
  { car_id: 2, fleet_id: 2 },
  { car_id: 3, fleet_id: 3 },
  { car_id: 4, fleet_id: 4 },
  { car_id: 1, fleet_id: 2 }, // Car 1 in two fleets
  { car_id: 2, fleet_id: 3 }  // Car 2 in two fleets
]

// Sensors
export const sensorRecords: SensorRecord[] = [
  { sensor_id: 1, notes: { type: 'speed', description: 'Main speed sensor' } },
  { sensor_id: 2, notes: { type: 'heat', description: 'Cabin heat sensor' } },
  { sensor_id: 3, notes: { type: 'speed', description: 'Backup speed sensor' } },
  { sensor_id: 4, notes: { type: 'heat', description: 'Engine heat sensor' } }
]

// Sensor-Car Links
export const sensorCarLinkRecords: SensorCarLinkRecord[] = [
  { id: 1, car_id: 1, sensor_id: 1 },
  { id: 2, car_id: 1, sensor_id: 2 },
  { id: 3, car_id: 2, sensor_id: 3 },
  { id: 4, car_id: 3, sensor_id: 1 },
  { id: 5, car_id: 3, sensor_id: 4 },
  { id: 6, car_id: 4, sensor_id: 2 },
  { id: 7, car_id: 4, sensor_id: 3 }
]

// Truck Sensors
export const truckSensorRecords: TruckSensorRecord[] = [
  { sensor_id: 1, truck_speed_max: 120, truck_speed_min: 40 },
  { sensor_id: 3, truck_speed_max: 130, truck_speed_min: 50 }
]

// Sedan Sensors
export const sedanSensorRecords: SedanSensorRecord[] = [
  { sensor_id: 3, sedan_speed_max: 100, sedan_speed_min: 30 },
  { sensor_id: 4, sedan_speed_max: 90, sedan_speed_min: 25 }
]

// Truck Speed Sensor Modes
export const truckSpeedSensorModeRecords: TruckSpeedSensorModeRecord[] = [
  { mode_id: 1, mode_name: 'Fast', mode_type: 'Fast', average_speed: 110 },
  { mode_id: 2, mode_name: 'Slow', mode_type: 'Slow', average_speed: 50 },
  { mode_id: 3, mode_name: 'Eco', mode_type: 'Slow', average_speed: 60 }
]

// Truck Heat Sensor Modes
export const truckHeatSensorModeRecords: TruckHeatSensorModeRecord[] = [
  { mode_id: 1, mode_name: 'Hot', mode_type: 'Hot', average_temp: 90 },
  { mode_id: 2, mode_name: 'Cold', mode_type: 'Cold', average_temp: 40 },
  { mode_id: 3, mode_name: 'Warm', mode_type: 'Hot', average_temp: 70 }
]

// Truck Speed Mode-Sensor Links
export const truckSpeedModeSensorLinkRecords: TruckSpeedModeSensorLinkRecord[] = [
  { sensor_id: 1, mode_id: 1 },
  { sensor_id: 1, mode_id: 2 },
  { sensor_id: 3, mode_id: 3 }
]

// Truck Heat Mode-Sensor Links
export const truckHeatModeSensorLinkRecords: TruckHeatModeSensorLinkRecord[] = [
  { sensor_id: 2, mode_id: 1 },
  { sensor_id: 2, mode_id: 2 },
  { sensor_id: 4, mode_id: 3 }
] 