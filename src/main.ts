import { createApp } from 'vue'
import App from './App.vue'
import { fleetStore } from './store/fleetStore'
import {
  fleets,
  brands,
  cars,
  drivers,
  speedometers,
  speedometer_sources,
  gps_modes,
  analog_modes,
  fleet_links,
  gps_mode_links,
  analog_mode_links
} from './data/sampleData'

// Initialize the store with sample data
try {
  fleetStore.setData({
    fleets,
    brands,
    cars,
    drivers,
    speedometers,
    speedometer_sources,
    gps_modes,
    analog_modes,
    fleet_links,
    gps_mode_links,
    analog_mode_links
  })

  const app = createApp(App)
  app.mount('#app')
} catch (error) {
  console.error('Error initializing application:', error)
} 