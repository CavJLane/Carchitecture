import { fleetStore } from '../store/fleetStore'
import type { CarRecord, BrandRecord, DriverRecord, SensorRecord } from '../types/fleet-management'
import * as yup from 'yup'

/**
 * Yup schemas for each object type
 */
const brandSchema = yup.object({
  brand_id: yup.number().required(),
  brand_name: yup.string().required(),
  brand_type: yup.string().oneOf(['TRUCK', 'SEDAN']).required()
})

const driverSchema = yup.object({
  driver_id: yup.number().required(),
  driver_name: yup.string().required()
})

const sensorSchema = yup.object({
  sensor_id: yup.number().required(),
  notes: yup.object().required()
})

const carSchema = yup.object({
  car_id: yup.number().required(),
  car_name: yup.string().required(),
  brand_id: yup.number().required(),
  driver_id: yup.number().required()
})

const modeSchema = yup.object({
  mode_id: yup.number().required(),
  mode_name: yup.string().required(),
  mode_type: yup.string().required()
})

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

/**
 * Returns a string array of all completeness and validity issues for a car.
 */
export function getCarIssues(car: CarRecord): string[] {
  const issues: string[] = []
  const brand = fleetStore.state.brandRecords.find(b => b.brand_id === car.brand_id)
  if (!brand) issues.push('Car is not linked to a valid Brand.')
  const driver = fleetStore.state.driverRecords.find(d => d.driver_id === car.driver_id)
  if (!driver) issues.push('Car is not linked to a valid Driver.')
  const sensorLinks = fleetStore.state.sensorCarLinkRecords.filter(link => link.car_id === car.car_id)
  if (sensorLinks.length === 0) issues.push('Car does not have any Sensors linked.')
  for (const link of sensorLinks) {
    const sensor = fleetStore.state.sensorRecords.find(s => s.sensor_id === link.sensor_id)
    if (!sensor) issues.push(`Sensor link with id ${link.id} is not linked to a valid Sensor.`)
    const hasSpeedMode = fleetStore.state.truckSpeedModeSensorLinkRecords.some(l => l.sensor_id === link.sensor_id)
    const hasHeatMode = fleetStore.state.truckHeatModeSensorLinkRecords.some(l => l.sensor_id === link.sensor_id)
    if (!hasSpeedMode && !hasHeatMode) issues.push(`Sensor #${link.sensor_id} is not linked to any Mode.`)
  }
  // Validity checks
  let type: 'TRUCK' | 'SEDAN' | null = null
  for (const link of sensorLinks) {
    const isTruck = fleetStore.state.truckSensorRecords.some(s => s.sensor_id === link.sensor_id)
    const isSedan = fleetStore.state.sedanSensorRecords.some(s => s.sensor_id === link.sensor_id)
    if (isTruck && !isSedan) {
      if (type === null) type = 'TRUCK'
      if (type !== 'TRUCK') issues.push('Car has Sensors of mixed types (Truck and Sedan).')
    } else if (isSedan && !isTruck) {
      if (type === null) type = 'SEDAN'
      if (type !== 'SEDAN') issues.push('Car has Sensors of mixed types (Truck and Sedan).')
    } else {
      issues.push(`Sensor #${link.sensor_id} is not mapped to a valid Truck or Sedan sensor.`)
    }
    const hasSpeed = fleetStore.state.truckSpeedModeSensorLinkRecords.some(l => l.sensor_id === link.sensor_id)
    const hasHeat = fleetStore.state.truckHeatModeSensorLinkRecords.some(l => l.sensor_id === link.sensor_id)
    if (hasSpeed && hasHeat) issues.push(`Sensor #${link.sensor_id} is mapped to both Speed and Heat modes (should only be one).`)
  }
  return issues
}

/**
 * Validate a car and all mapped objects using Yup.
 * Returns an array of { objectType, objectId, message } for all issues.
 */
export function validateCarWithYup(car: CarRecord) {
  const issues: { objectType: string; objectId: number; message: string }[] = []

  // Validate Car
  try {
    carSchema.validateSync(car)
  } catch (e: any) {
    issues.push({ objectType: 'Car', objectId: car.car_id, message: e.message })
  }

  // Validate Brand
  const brand = fleetStore.state.brandRecords.find(b => b.brand_id === car.brand_id)
  if (!brand) {
    issues.push({ objectType: 'Brand', objectId: car.brand_id, message: 'Car is not linked to a valid Brand.' })
  } else {
    try {
      brandSchema.validateSync(brand)
    } catch (e: any) {
      issues.push({ objectType: 'Brand', objectId: brand.brand_id, message: e.message })
    }
  }

  // Validate Driver
  const driver = fleetStore.state.driverRecords.find(d => d.driver_id === car.driver_id)
  if (!driver) {
    issues.push({ objectType: 'Driver', objectId: car.driver_id, message: 'Car is not linked to a valid Driver.' })
  } else {
    try {
      driverSchema.validateSync(driver)
    } catch (e: any) {
      issues.push({ objectType: 'Driver', objectId: driver.driver_id, message: e.message })
    }
  }

  // Validate Sensors
  const sensorLinks = fleetStore.state.sensorCarLinkRecords.filter(link => link.car_id === car.car_id)
  if (sensorLinks.length === 0) {
    issues.push({ objectType: 'Car', objectId: car.car_id, message: 'Car does not have any Sensors linked.' })
  }
  for (const link of sensorLinks) {
    const sensor = fleetStore.state.sensorRecords.find(s => s.sensor_id === link.sensor_id)
    if (!sensor) {
      issues.push({ objectType: 'Sensor', objectId: link.sensor_id, message: `Sensor link with id ${link.id} is not linked to a valid Sensor.` })
      continue
    }
    try {
      sensorSchema.validateSync(sensor)
    } catch (e: any) {
      issues.push({ objectType: 'Sensor', objectId: sensor.sensor_id, message: e.message })
    }
    // Check sensor has at least one mode
    const hasSpeedMode = fleetStore.state.truckSpeedModeSensorLinkRecords.some(l => l.sensor_id === link.sensor_id)
    const hasHeatMode = fleetStore.state.truckHeatModeSensorLinkRecords.some(l => l.sensor_id === link.sensor_id)
    if (!hasSpeedMode && !hasHeatMode) {
      issues.push({ objectType: 'Sensor', objectId: sensor.sensor_id, message: `Sensor #${sensor.sensor_id} is not linked to any Mode.` })
    }
    // Validate modes
    const modeLinks = [
      ...fleetStore.state.truckSpeedModeSensorLinkRecords.filter(l => l.sensor_id === link.sensor_id),
      ...fleetStore.state.truckHeatModeSensorLinkRecords.filter(l => l.sensor_id === link.sensor_id)
    ]
    for (const modeLink of modeLinks) {
      const mode = fleetStore.state.truckSpeedSensorModeRecords.find(m => m.mode_id === modeLink.mode_id) ||
        fleetStore.state.truckHeatSensorModeRecords.find(m => m.mode_id === modeLink.mode_id)
      if (mode) {
        try {
          modeSchema.validateSync(mode)
        } catch (e: any) {
          issues.push({ objectType: 'Mode', objectId: mode.mode_id, message: e.message })
        }
      } else {
        issues.push({ objectType: 'Mode', objectId: modeLink.mode_id, message: `Sensor #${sensor.sensor_id} is linked to an invalid Mode.` })
      }
    }
  }

  // Validity checks
  // All sensors should be of the same type
  let type: 'TRUCK' | 'SEDAN' | null = null
  for (const link of sensorLinks) {
    const isTruck = fleetStore.state.truckSensorRecords.some(s => s.sensor_id === link.sensor_id)
    const isSedan = fleetStore.state.sedanSensorRecords.some(s => s.sensor_id === link.sensor_id)
    if (isTruck && !isSedan) {
      if (type === null) type = 'TRUCK'
      if (type !== 'TRUCK') issues.push({ objectType: 'Sensor', objectId: link.sensor_id, message: 'Car has Sensors of mixed types (Truck and Sedan).' })
    } else if (isSedan && !isTruck) {
      if (type === null) type = 'SEDAN'
      if (type !== 'SEDAN') issues.push({ objectType: 'Sensor', objectId: link.sensor_id, message: 'Car has Sensors of mixed types (Truck and Sedan).' })
    } else {
      issues.push({ objectType: 'Sensor', objectId: link.sensor_id, message: `Sensor #${link.sensor_id} is not mapped to a valid Truck or Sedan sensor.` })
    }
    // Each sensor should only be mapped to either Speed or Heat modes, not both
    const hasSpeed = fleetStore.state.truckSpeedModeSensorLinkRecords.some(l => l.sensor_id === link.sensor_id)
    const hasHeat = fleetStore.state.truckHeatModeSensorLinkRecords.some(l => l.sensor_id === link.sensor_id)
    if (hasSpeed && hasHeat) {
      issues.push({ objectType: 'Sensor', objectId: link.sensor_id, message: `Sensor #${link.sensor_id} is mapped to both Speed and Heat modes (should only be one).` })
    }
  }

  return issues
} 