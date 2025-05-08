import { fleetStore } from '../store/fleetStore'
import type { CarRecord, BrandRecord, DriverRecord, SensorRecord } from '../types/fleet-management'

/**
 * Checks if a car is complete according to the rules:
 * - Has a valid brand
 * - Has a valid driver
 * - Has at least one sensor
 * - Each sensor has at least one mode
 */
export function isCarComplete(car: CarRecord): boolean {
  const brand = fleetStore.state.brandRecords.find(b => b.brand_id === car.brand_id)
  const driver = fleetStore.state.driverRecords.find(d => d.driver_id === car.driver_id)
  const sensorLinks = fleetStore.state.sensorCarLinkRecords.filter(link => link.car_id === car.car_id)
  if (!brand || !driver || sensorLinks.length === 0) return false
  for (const link of sensorLinks) {
    const hasSpeedMode = fleetStore.state.truckSpeedModeSensorLinkRecords.some(l => l.sensor_id === link.sensor_id)
    const hasHeatMode = fleetStore.state.truckHeatModeSensorLinkRecords.some(l => l.sensor_id === link.sensor_id)
    if (!hasSpeedMode && !hasHeatMode) return false
  }
  return true
}

/**
 * Checks if a car is valid according to the rules:
 * - All sensors are of the same type (Truck or Sedan)
 * - Each sensor is only mapped to either Speed or Heat modes, not both
 */
export function isCarValid(car: CarRecord): boolean {
  const sensorLinks = fleetStore.state.sensorCarLinkRecords.filter(link => link.car_id === car.car_id)
  if (sensorLinks.length === 0) return true // No sensors, let completeness handle this
  // Check all sensors are of the same type
  let type: 'TRUCK' | 'SEDAN' | null = null
  for (const link of sensorLinks) {
    const isTruck = fleetStore.state.truckSensorRecords.some(s => s.sensor_id === link.sensor_id)
    const isSedan = fleetStore.state.sedanSensorRecords.some(s => s.sensor_id === link.sensor_id)
    if (isTruck && !isSedan) {
      if (type === null) type = 'TRUCK'
      if (type !== 'TRUCK') return false
    } else if (isSedan && !isTruck) {
      if (type === null) type = 'SEDAN'
      if (type !== 'SEDAN') return false
    } else {
      // Sensor is neither or both, invalid
      return false
    }
    // Check each sensor is only mapped to either Speed or Heat modes, not both
    const hasSpeed = fleetStore.state.truckSpeedModeSensorLinkRecords.some(l => l.sensor_id === link.sensor_id)
    const hasHeat = fleetStore.state.truckHeatModeSensorLinkRecords.some(l => l.sensor_id === link.sensor_id)
    if (hasSpeed && hasHeat) return false
  }
  return true
} 