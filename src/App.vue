<template>
  <div class="app-container">
    <div class="controls">
      <select v-model="selectedType" class="type-select">
        <option value="">Select Type</option>
        <option value="fleet">Fleet</option>
        <option value="brand">Brand</option>
        <option value="car">Car</option>
        <option value="driver">Driver</option>
        <option value="speedometer">Speedometer</option>
        <option value="gps_mode">GPS Mode</option>
        <option value="analog_mode">Analog Mode</option>
      </select>

      <div class="search-container">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Search..." 
          class="search-input"
          :disabled="!selectedType"
        >
      </div>
    </div>

    <div class="results-container">
      <div v-if="selectedType === 'fleet'" class="results-grid">
        <div 
          v-for="fleet in filteredFleets" 
          :key="fleet.Fleet_id" 
          class="card"
          @click="selectItem('fleet', fleet)"
          :class="{ 'selected': selectedItem?.Fleet_id === fleet.Fleet_id }"
        >
          <h3>{{ fleet.Fleet_Name }}</h3>
        </div>
      </div>

      <div v-if="selectedType === 'brand'" class="results-grid">
        <div 
          v-for="brand in filteredBrands" 
          :key="brand.Brand_id" 
          class="card"
          @click="selectItem('brand', brand)"
          :class="{ 'selected': selectedItem?.Brand_id === brand.Brand_id }"
        >
          <h3>{{ brand.Brand_Name }}</h3>
          <p>Speedometer Type: {{ brand.Speedometer_Type }}</p>
        </div>
      </div>

      <div v-if="selectedType === 'car'" class="results-grid">
        <div 
          v-for="car in filteredCars" 
          :key="car.Car_id" 
          class="card"
          @click="selectItem('car', car)"
          :class="{ 'selected': selectedItem?.Car_id === car.Car_id }"
        >
          <h3>Car #{{ car.Car_id }}</h3>
          <p>Brand: {{ getBrandName(car.Brand_id) }}</p>
          <p>Driver: {{ getDriverName(car.Driver_id) }}</p>
        </div>
      </div>

      <div v-if="selectedType === 'driver'" class="results-grid">
        <div 
          v-for="driver in filteredDrivers" 
          :key="driver.Driver_id" 
          class="card"
          @click="selectItem('driver', driver)"
          :class="{ 'selected': selectedItem?.Driver_id === driver.Driver_id }"
        >
          <h3>{{ driver.Driver_Name }}</h3>
        </div>
      </div>

      <div v-if="selectedType === 'speedometer'" class="results-grid">
        <div 
          v-for="speedometer in filteredSpeedometers" 
          :key="speedometer.Speedometer_id" 
          class="card"
          @click="selectItem('speedometer', speedometer)"
          :class="{ 'selected': selectedItem?.Speedometer_id === speedometer.Speedometer_id }"
        >
          <h3>Speedometer #{{ speedometer.Speedometer_id }}</h3>
          <p>Car: {{ getCarName(speedometer.Car_id) }}</p>
        </div>
      </div>

      <div v-else-if="selectedType === 'gps_mode'" class="results-grid">
        <div 
          v-for="mode in filteredGPSModes" 
          :key="mode.GPS_Mode_id" 
          class="card"
          @click="selectItem('gps_mode', mode)"
          :class="{ 'selected': selectedItem?.GPS_Mode_id === mode.GPS_Mode_id }"
        >
          <h3>{{ mode.GPS_Mode_Name }}</h3>
          <p>Type: {{ mode.GPS_Mode_Type }}</p>
          <p>Accuracy: {{ mode.Accuracy }}</p>
          <div v-if="mode.speedometer_links">
            <h4>Connected Speedometers:</h4>
            <ul>
              <li v-for="link in mode.speedometer_links" :key="link.id">
                {{ getSpeedometerName(link.speedometer_id) }}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div v-else-if="selectedType === 'analog_mode'" class="results-grid">
        <div 
          v-for="mode in filteredAnalogModes" 
          :key="mode.Analog_Mode_id" 
          class="card"
          @click="selectItem('analog_mode', mode)"
          :class="{ 'selected': selectedItem?.Analog_Mode_id === mode.Analog_Mode_id }"
        >
          <h3>{{ mode.Analog_Mode_Name }}</h3>
          <p>Type: {{ mode.Analog_Mode_Type }}</p>
          <p>Accuracy: {{ mode.Accuracy }}</p>
          <div v-if="mode.speedometer_links">
            <h4>Connected Speedometers:</h4>
            <ul>
              <li v-for="link in mode.speedometer_links" :key="link.id">
                {{ getSpeedometerName(link.speedometer_id) }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div v-if="selectedItem" class="details-container">
      <RelationshipTree 
        :selected-item="selectedItem"
        :selected-item-type="selectedItemType"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { fleetStore } from './store/fleetStore'
import type { Fleet, Brand, Car, Driver, Speedometer, GPS_Mode, Analog_Mode } from './types/fleet-management'
import RelationshipTree from './components/RelationshipTree.vue'

const selectedType = ref('')
const searchQuery = ref('')
const selectedItem = ref<Fleet | Brand | Car | Driver | Speedometer | GPS_Mode | Analog_Mode | null>(null)
const selectedItemType = ref<string>('')

const selectItem = (type: string, item: Fleet | Brand | Car | Driver | Speedometer | GPS_Mode | Analog_Mode) => {
  selectedItem.value = item
  selectedItemType.value = type
}

const getBrandName = (brandId: number) => {
  const brand = fleetStore.getBrandById(brandId)
  return brand?.Brand_Name || 'Unknown Brand'
}

const getDriverName = (driverId: number) => {
  const driver = fleetStore.getDriverById(driverId)
  return driver?.Driver_Name || 'Unknown Driver'
}

const getFleetCars = (fleetId: number) => {
  return fleetStore.getFleetCars(fleetId)
}

const getBrandCars = (brandId: number) => {
  return fleetStore.getBrandCars(brandId)
}

const getCarFleets = (carId: number) => {
  return fleetStore.getCarFleets(carId)
}

const getCarBrand = (carId: number) => {
  return fleetStore.getCarBrand(carId)
}

const getCarDriver = (carId: number) => {
  return fleetStore.getCarDriver(carId)
}

const getDriverCars = (driverId: number) => {
  return fleetStore.getDriverCars(driverId)
}

const getCarName = (carId: number) => {
  const car = fleetStore.getCarById(carId)
  return car ? `Car #${car.Car_id}` : 'Unknown Car'
}

const filteredFleets = computed(() => {
  if (!searchQuery.value) return fleetStore.state.fleets
  const query = searchQuery.value.toLowerCase()
  return fleetStore.state.fleets.filter(fleet => 
    fleet.Fleet_Name.toLowerCase().includes(query)
  )
})

const filteredBrands = computed(() => {
  if (!searchQuery.value) return fleetStore.state.brands
  const query = searchQuery.value.toLowerCase()
  return fleetStore.state.brands.filter(brand => 
    brand.Brand_Name.toLowerCase().includes(query)
  )
})

const filteredCars = computed(() => {
  if (!searchQuery.value) return fleetStore.state.cars
  const query = searchQuery.value.toLowerCase()
  return fleetStore.state.cars.filter(car => 
    getBrandName(car.Brand_id).toLowerCase().includes(query) ||
    getDriverName(car.Driver_id).toLowerCase().includes(query)
  )
})

const filteredDrivers = computed(() => {
  if (!searchQuery.value) return fleetStore.state.drivers
  const query = searchQuery.value.toLowerCase()
  return fleetStore.state.drivers.filter(driver => 
    driver.Driver_Name.toLowerCase().includes(query)
  )
})

const filteredSpeedometers = computed(() => {
  if (!searchQuery.value) return fleetStore.state.speedometers
  const query = searchQuery.value.toLowerCase()
  return fleetStore.state.speedometers.filter(speedometer => 
    getCarName(speedometer.Car_id).toLowerCase().includes(query)
  )
})

const filteredGPSModes = computed(() => {
  if (!searchQuery.value) return fleetStore.getAllGPSModes()
  const query = searchQuery.value.toLowerCase()
  return fleetStore.getAllGPSModes().filter(mode => 
    mode.GPS_Mode_Name.toLowerCase().includes(query) ||
    mode.GPS_Mode_Type.toLowerCase().includes(query)
  )
})

const filteredAnalogModes = computed(() => {
  if (!searchQuery.value) return fleetStore.getAllAnalogModes()
  const query = searchQuery.value.toLowerCase()
  return fleetStore.getAllAnalogModes().filter(mode => 
    mode.Analog_Mode_Name.toLowerCase().includes(query) ||
    mode.Analog_Mode_Type.toLowerCase().includes(query)
  )
})
</script>

<style scoped>
.app-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.controls {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.type-select {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  min-width: 200px;
}

.search-container {
  flex: 1;
}

.search-input {
  width: 100%;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.search-input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.results-container {
  margin-top: 2rem;
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

.card {
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.card.selected {
  border: 2px solid #4CAF50;
  background-color: #f8fff8;
}

.card h3 {
  margin: 0 0 0.5rem 0;
  color: #333;
}

.card p {
  margin: 0.25rem 0;
  color: #666;
}

.details-container {
  margin-top: 2rem;
  padding: 1rem;
  border-top: 1px solid #ddd;
}

.details-section {
  margin-bottom: 2rem;
}

.details-section h3 {
  margin-bottom: 1rem;
  color: #333;
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.related-grid .card {
  cursor: default;
}

.related-grid .card:hover {
  transform: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style> 