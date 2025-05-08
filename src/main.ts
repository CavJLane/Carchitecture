import { createApp } from 'vue'
import App from './App.vue'
import { fleetStore } from './store/fleetStore'
import {
  carRecords,
  brandRecords,
  fleetRecords,
  fleetLinkRecords,
  driverRecords,
  sensorRecords,
  sensorCarLinkRecords,
  truckSensorRecords,
  sedanSensorRecords,
  truckSpeedSensorModeRecords,
  truckHeatSensorModeRecords,
  truckSpeedModeSensorLinkRecords,
  truckHeatModeSensorLinkRecords
} from './data/sampleData'

// Initialize the store with sample data
try {
  fleetStore.setData({
    carRecords,
    brandRecords,
    fleetRecords,
    fleetLinkRecords,
    driverRecords,
    sensorRecords,
    sensorCarLinkRecords,
    truckSensorRecords,
    sedanSensorRecords,
    truckSpeedSensorModeRecords,
    truckHeatSensorModeRecords,
    truckSpeedModeSensorLinkRecords,
    truckHeatModeSensorLinkRecords
  })

  const app = createApp(App)
  app.mount('#app')
} catch (error) {
  console.error('Error initializing application:', error)
} 