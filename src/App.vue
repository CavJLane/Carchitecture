<template>
  <div class="app-container">
    <div class="filter-controls">
      <label>
        Filter by:
        <select v-model="filterType">
          <option value="">Select Type</option>
          <option value="brand">Brand</option>
          <option value="fleet">Fleet</option>
          <option value="driver">Driver</option>
        </select>
      </label>
      <label v-if="filterType">
        <span v-if="filterType === 'brand'">Brand:</span>
        <span v-else-if="filterType === 'fleet'">Fleet:</span>
        <span v-else-if="filterType === 'driver'">Driver:</span>
        <select v-model="selectedObjectId">
          <option value="">Select</option>
          <option v-for="obj in filterObjects" :key="obj.id" :value="obj.id">
            {{ obj.label }}
          </option>
        </select>
      </label>
    </div>
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
    <CarDetailOverlay
      v-if="showOverlay && selectedCar"
      :car="selectedCar"
      :brand="getBrand(selectedCar.brand_id)"
      :driver="getDriver(selectedCar.driver_id)"
      :fleets="getCarFleets(selectedCar.car_id)"
      :sensors="getCarSensors(selectedCar.car_id)"
      :modes="getCarModes(selectedCar.car_id)"
      :completeness="isCarComplete(selectedCar)"
      :validity="isCarValid(selectedCar)"
      :issues="getCarIssues(selectedCar)"
      @close="closeOverlay"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { fleetStore } from './store/fleetStore'
import CarCard from './components/CarCard.vue'
import CarDetailOverlay from './components/CarDetailOverlay.vue'
import { isCarComplete, isCarValid, getCarIssues } from './composables/useCarChecks'
import type { CarRecord, BrandRecord, DriverRecord, FleetRecord, SensorRecord } from './types/fleet-management'

const filterType = ref('')
const selectedObjectId = ref<number | ''>('')
const showOverlay = ref(false)
const selectedCar = ref<CarRecord | null>(null)

const filterObjects = computed(() => {
  if (filterType.value === 'brand') {
    return fleetStore.state.brandRecords.map(b => ({ id: b.brand_id, label: `${b.brand_name} [ID: ${b.brand_id}]` }))
  } else if (filterType.value === 'fleet') {
    return fleetStore.state.fleetRecords.map(f => ({ id: f.fleet_id, label: `${f.fleet_name} [ID: ${f.fleet_id}]` }))
  } else if (filterType.value === 'driver') {
    return fleetStore.state.driverRecords.map(d => ({ id: d.driver_id, label: `${d.driver_name} [ID: ${d.driver_id}]` }))
  }
  return []
})

const filteredCars = computed(() => {
  if (!filterType.value || !selectedObjectId.value) return []
  if (filterType.value === 'brand') {
    return fleetStore.state.carRecords.filter(car => car.brand_id === selectedObjectId.value)
  } else if (filterType.value === 'fleet') {
    const carIds = fleetStore.state.fleetLinkRecords.filter(link => link.fleet_id === selectedObjectId.value).map(link => link.car_id)
    return fleetStore.state.carRecords.filter(car => carIds.includes(car.car_id))
  } else if (filterType.value === 'driver') {
    return fleetStore.state.carRecords.filter(car => car.driver_id === selectedObjectId.value)
  }
  return []
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
function getCarModes(carId: number) {
  // Get all modes for all sensors of this car
  const sensors = getCarSensors(carId)
  return sensors.flatMap(sensor => getSensorModes(sensor.sensor_id))
}
function openCarDetail(carId: number) {
  console.log('Opening detail for car:', carId)
  const car = fleetStore.state.carRecords.find(c => c.car_id === carId) || null
  selectedCar.value = car
  showOverlay.value = !!car
}
function closeOverlay() {
  showOverlay.value = false
  selectedCar.value = null
}
</script>

<style scoped>
.app-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}
.filter-controls {
  display: flex;
  gap: 1.5rem;
  align-items: center;
  margin-bottom: 2rem;
}
.car-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  justify-content: flex-start;
}
</style> 