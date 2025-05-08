import { reactive } from 'vue'
import type {
  CarRecord, BrandRecord, FleetRecord, FleetLinkRecord, DriverRecord, SensorRecord, SensorCarLinkRecord, TruckSensorRecord, SedanSensorRecord, TruckSpeedSensorModeRecord, TruckHeatSensorModeRecord, TruckSpeedModeSensorLinkRecord, TruckHeatModeSensorLinkRecord
} from '../types/fleet-management'

interface State {
  carRecords: CarRecord[];
  brandRecords: BrandRecord[];
  fleetRecords: FleetRecord[];
  fleetLinkRecords: FleetLinkRecord[];
  driverRecords: DriverRecord[];
  sensorRecords: SensorRecord[];
  sensorCarLinkRecords: SensorCarLinkRecord[];
  truckSensorRecords: TruckSensorRecord[];
  sedanSensorRecords: SedanSensorRecord[];
  truckSpeedSensorModeRecords: TruckSpeedSensorModeRecord[];
  truckHeatSensorModeRecords: TruckHeatSensorModeRecord[];
  truckSpeedModeSensorLinkRecords: TruckSpeedModeSensorLinkRecord[];
  truckHeatModeSensorLinkRecords: TruckHeatModeSensorLinkRecord[];
}

const state = reactive<State>({
  carRecords: [],
  brandRecords: [],
  fleetRecords: [],
  fleetLinkRecords: [],
  driverRecords: [],
  sensorRecords: [],
  sensorCarLinkRecords: [],
  truckSensorRecords: [],
  sedanSensorRecords: [],
  truckSpeedSensorModeRecords: [],
  truckHeatSensorModeRecords: [],
  truckSpeedModeSensorLinkRecords: [],
  truckHeatModeSensorLinkRecords: []
})

export const fleetStore = {
  state,

  // Get a car by its ID
  getCarById: (id: number) => state.carRecords.find(c => c.car_id === id),

  // Get a brand by its ID
  getBrandById: (id: number) => state.brandRecords.find(b => b.brand_id === id),

  // Get a driver by its ID
  getDriverById: (id: number) => state.driverRecords.find(d => d.driver_id === id),

  // Get all cars in a fleet
  getFleetCars: (fleetId: number) => {
    const links = state.fleetLinkRecords.filter(link => link.fleet_id === fleetId)
    return links.map(link => state.carRecords.find(c => c.car_id === link.car_id)).filter(Boolean)
  },

  // Get all fleets for a car
  getCarFleets: (carId: number) => {
    const links = state.fleetLinkRecords.filter(link => link.car_id === carId)
    return links.map(link => state.fleetRecords.find(f => f.fleet_id === link.fleet_id)).filter(Boolean)
  },

  // Get all cars for a brand
  getBrandCars: (brandId: number) => {
    return state.carRecords.filter(car => car.brand_id === brandId)
  },

  // Get all cars for a driver
  getDriverCars: (driverId: number) => {
    return state.carRecords.filter(car => car.driver_id === driverId)
  },

  // Get all sensors for a car
  getCarSensors: (carId: number) => {
    const links = state.sensorCarLinkRecords.filter(link => link.car_id === carId)
    return links.map(link => state.sensorRecords.find(s => s.sensor_id === link.sensor_id)).filter(Boolean)
  },

  // Get all modes for a sensor (truck and sedan)
  getSensorModes: (sensorId: number) => {
    // Truck sensor modes
    const truckSpeedLinks = state.truckSpeedModeSensorLinkRecords.filter(link => link.sensor_id === sensorId)
    const truckSpeedModes = truckSpeedLinks.map(link => state.truckSpeedSensorModeRecords.find(mode => mode.mode_id === link.mode_id)).filter(Boolean)
    const truckHeatLinks = state.truckHeatModeSensorLinkRecords.filter(link => link.sensor_id === sensorId)
    const truckHeatModes = truckHeatLinks.map(link => state.truckHeatSensorModeRecords.find(mode => mode.mode_id === link.mode_id)).filter(Boolean)
    // (If you add sedan modes, add them here)
    return [...truckSpeedModes, ...truckHeatModes]
  },

  // Check if a car is 'complete' (has a brand, driver, and at least one sensor)
  isCarComplete: (carId: number) => {
    const car = state.carRecords.find(c => c.car_id === carId)
    if (!car) return false
    const hasBrand = state.brandRecords.some(b => b.brand_id === car.brand_id)
    const hasDriver = state.driverRecords.some(d => d.driver_id === car.driver_id)
    const hasSensor = state.sensorCarLinkRecords.some(link => link.car_id === carId)
    return hasBrand && hasDriver && hasSensor
  },

  // Mutations
  setData(data: State) {
    state.carRecords = data.carRecords
    state.brandRecords = data.brandRecords
    state.fleetRecords = data.fleetRecords
    state.fleetLinkRecords = data.fleetLinkRecords
    state.driverRecords = data.driverRecords
    state.sensorRecords = data.sensorRecords
    state.sensorCarLinkRecords = data.sensorCarLinkRecords
    state.truckSensorRecords = data.truckSensorRecords
    state.sedanSensorRecords = data.sedanSensorRecords
    state.truckSpeedSensorModeRecords = data.truckSpeedSensorModeRecords
    state.truckHeatSensorModeRecords = data.truckHeatSensorModeRecords
    state.truckSpeedModeSensorLinkRecords = data.truckSpeedModeSensorLinkRecords
    state.truckHeatModeSensorLinkRecords = data.truckHeatModeSensorLinkRecords
  }
} 