<template>
  <div class="app-container">
    <FilterBar
      :fleets="fleetStore.state.fleetRecords"
      :brands="fleetStore.state.brandRecords"
      :drivers="fleetStore.state.driverRecords"
      :filter-fleet="filterFleet"
      :filter-brand="filterBrand"
      :filter-driver="filterDriver"
      @update:filters="onUpdateFilters"
    />
    <div class="car-grid">
      <CarCard
        v-for="car in filteredCars"
        :key="car.car_id"
        :car="car"
        :brand="getBrand(car.brand_id)"
        :driver="getDriver(car.driver_id)"
        :fleets="getCarFleets(car.car_id)"
        :sensors="getCarSensors(car.car_id)"
        :getSensorModes="getSensorModes"
        :completeness="isCarComplete(car)"
        :validity="isCarValid(car)"
        @open-detail="openCarDetail"
      />
    </div>
    <!-- Detailed car view overlay will be implemented here -->
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { fleetStore } from './store/fleetStore'
import FilterBar from './components/FilterBar.vue'
import CarCard from './components/CarCard.vue'
import { isCarComplete, isCarValid } from './composables/useCarChecks'
import type { CarRecord, BrandRecord, DriverRecord, FleetRecord, SensorRecord } from './types/fleet-management'

const filterFleet = ref<number | ''>('')
const filterBrand = ref<number | ''>('')
const filterDriver = ref<number | ''>('')

function onUpdateFilters(filters: { fleet: number | ''; brand: number | ''; driver: number | '' }) {
  filterFleet.value = filters.fleet
  filterBrand.value = filters.brand
  filterDriver.value = filters.driver
}

const filteredCars = computed(() => {
  return fleetStore.state.carRecords.filter(car => {
    const fleetMatch = !filterFleet.value || fleetStore.state.fleetLinkRecords.some(link => link.car_id === car.car_id && link.fleet_id === filterFleet.value)
    const brandMatch = !filterBrand.value || car.brand_id === filterBrand.value
    const driverMatch = !filterDriver.value || car.driver_id === filterDriver.value
    return fleetMatch && brandMatch && driverMatch
  })
})

function getBrand(brandId: number): BrandRecord | undefined {
  return fleetStore.state.brandRecords.find(b => b.brand_id === brandId)
}
function getDriver(driverId: number): DriverRecord | undefined {
  return fleetStore.state.driverRecords.find(d => d.driver_id === driverId)
}
function getCarFleets(carId: number): FleetRecord[] {
  return fleetStore.state.fleetLinkRecords
    .filter(link => link.car_id === carId)
    .map(link => fleetStore.state.fleetRecords.find(f => f.fleet_id === link.fleet_id)!)
    .filter(Boolean)
}
function getCarSensors(carId: number): SensorRecord[] {
  return fleetStore.state.sensorCarLinkRecords
    .filter(link => link.car_id === carId)
    .map(link => fleetStore.state.sensorRecords.find(s => s.sensor_id === link.sensor_id)!)
    .filter(Boolean)
}
function getSensorModes(sensorId: number) {
  // Combine truck speed and heat modes for this sensor
  const speedLinks = fleetStore.state.truckSpeedModeSensorLinkRecords.filter(l => l.sensor_id === sensorId)
  const speedModes = speedLinks.map(l => fleetStore.state.truckSpeedSensorModeRecords.find(m => m.mode_id === l.mode_id)).filter(Boolean)
  const heatLinks = fleetStore.state.truckHeatModeSensorLinkRecords.filter(l => l.sensor_id === sensorId)
  const heatModes = heatLinks.map(l => fleetStore.state.truckHeatSensorModeRecords.find(m => m.mode_id === l.mode_id)).filter(Boolean)
  return [...speedModes, ...heatModes]
}
function openCarDetail(carId: number) {
  // Placeholder for opening the detailed car view overlay
  // To be implemented
  // e.g. showOverlay.value = true; selectedCarId.value = carId;
}
</script>

<style scoped>
.app-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}
.car-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  justify-content: flex-start;
}
</style> 