<template>
  <div class="relationship-tree">
    <div class="tree-node" v-if="selectedItem">
      <!-- Center Node -->
      <div v-if="selectedItemType !== 'car' && selectedItemType !== 'driver' && selectedItemType !== 'speedometer' && selectedItemType !== 'gps_mode' && selectedItemType !== 'analog_mode'" class="center-node">
        <h3>{{ getItemName(selectedItem) }}</h3>
        <p v-if="selectedItemType === 'brand'">Speedometer Type: {{ (selectedItem as Brand).Speedometer_Type }}</p>
        <p v-if="selectedItemType === 'gps_mode'">
          <span>Type: {{ (selectedItem as GPS_Mode).GPS_Mode_Type }}</span><br>
          <span>Accuracy: {{ (selectedItem as GPS_Mode).Accuracy }}</span>
        </p>
        <p v-if="selectedItemType === 'analog_mode'">
          <span>Type: {{ (selectedItem as Analog_Mode).Analog_Mode_Type }}</span><br>
          <span>Accuracy: {{ (selectedItem as Analog_Mode).Accuracy }}</span>
        </p>
      </div>

      <!-- Linked Objects by Category -->
      <div v-if="linkedFleets.length > 0 && selectedItemType !== 'fleet' && selectedItemType !== 'car' && selectedItemType !== 'driver' && selectedItemType !== 'speedometer' && selectedItemType !== 'gps_mode' && selectedItemType !== 'analog_mode'" class="linked-category">
        <h4>Fleets</h4>
        <div class="node-group">
          <div v-for="fleet in linkedFleets" :key="fleet.Fleet_id" class="node">
            <h5>{{ fleet.Fleet_Name }}</h5>
          </div>
        </div>
      </div>

      <div v-if="selectedItemType === 'driver'" class="car-grid">
        <div v-for="car in fleetStore.getDriverCars((selectedItem as Driver).Driver_id)" :key="car.Car_id" class="car-node" :class="{ 'no-speedometer': !fleetStore.hasSpeedometer(car.Car_id) }" @click="selectCar(car)">
          <div class="car-header">
            <h6>Car #{{ car.Car_id }}</h6>
            <div class="status-icon" :class="{ 'status-complete': fleetStore.isCarComplete(car.Car_id) }">
              <span class="material-icons">check_circle</span>
            </div>
          </div>
          <div class="car-details">
            <div class="car-linked-item">
              <p class="label">Brand:</p>
              <p>{{ getBrandName(car.Brand_id) }}</p>
            </div>
            <div class="car-linked-item">
              <p class="label">Fleets:</p>
              <div v-if="fleetStore.getCarFleets(car.Car_id).length > 0" class="fleet-list">
                <div v-for="fleet in fleetStore.getCarFleets(car.Car_id)" :key="fleet.Fleet_id" class="fleet-item">
                  <p>{{ fleet.Fleet_Name }}</p>
                </div>
              </div>
              <p v-else>No fleets</p>
            </div>
            <div class="car-linked-item">
              <p class="label">Speedometers:</p>
              <div v-if="fleetStore.getSpeedometersByCarId(car.Car_id).length > 0" class="speedometer-grid">
                <div v-for="speedometer in fleetStore.getSpeedometersByCarId(car.Car_id)" 
                     :key="speedometer.Speedometer_id" 
                     class="speedometer-box">
                  <h6>Speedometer #{{ speedometer.Speedometer_id }}</h6>
                  <div class="mode-list">
                    <p class="label">Modes:</p>
                    <ul>
                      <li v-for="mode in getSpeedometerModes(speedometer.Speedometer_id)" 
                          :key="mode.id">
                        {{ mode.name }} ({{ mode.type }})
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <p v-else>No speedometers</p>
            </div>
          </div>
        </div>
      </div>

      <div v-if="selectedItemType === 'fleet'" class="car-grid">
        <div v-for="car in fleetStore.getFleetCars(linkedFleets[0].Fleet_id)" :key="car.Car_id" class="car-node" :class="{ 'no-speedometer': !fleetStore.hasSpeedometer(car.Car_id) }" @click="selectCar(car)">
          <div class="car-header">
            <h6>Car #{{ car.Car_id }}</h6>
            <div class="status-icon" :class="{ 'status-complete': fleetStore.isCarComplete(car.Car_id) }">
              <span class="material-icons">check_circle</span>
            </div>
          </div>
          <div class="car-details">
            <div class="car-linked-item">
              <p class="label">Brand:</p>
              <p>{{ getBrandName(car.Brand_id) }}</p>
            </div>
            <div class="car-linked-item">
              <p class="label">Driver:</p>
              <p>{{ getDriverName(car.Driver_id) }}</p>
            </div>
            <div class="car-linked-item">
              <p class="label">Speedometers:</p>
              <div v-if="fleetStore.getSpeedometersByCarId(car.Car_id).length > 0" class="speedometer-grid">
                <div v-for="speedometer in fleetStore.getSpeedometersByCarId(car.Car_id)" 
                     :key="speedometer.Speedometer_id" 
                     class="speedometer-box">
                  <h6>Speedometer #{{ speedometer.Speedometer_id }}</h6>
                  <div class="mode-list">
                    <p class="label">Modes:</p>
                    <ul>
                      <li v-for="mode in getSpeedometerModes(speedometer.Speedometer_id)" 
                          :key="mode.id">
                        {{ mode.name }} ({{ mode.type }})
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <p v-else>No speedometers</p>
            </div>
          </div>
        </div>
      </div>

      <div v-if="selectedItemType === 'brand'" class="car-grid">
        <div v-for="car in fleetStore.getBrandCars(linkedBrand.Brand_id)" :key="car.Car_id" class="car-node" :class="{ 'no-speedometer': !fleetStore.hasSpeedometer(car.Car_id) }" @click="selectCar(car)">
          <div class="car-header">
            <h6>Car #{{ car.Car_id }}</h6>
            <div class="status-icon" :class="{ 'status-complete': fleetStore.isCarComplete(car.Car_id) }">
              <span class="material-icons">check_circle</span>
            </div>
          </div>
          <div class="car-details">
            <div class="car-linked-item">
              <p class="label">Driver:</p>
              <p>{{ getDriverName(car.Driver_id) }}</p>
            </div>
            <div class="car-linked-item">
              <p class="label">Fleets:</p>
              <div v-if="fleetStore.getCarFleets(car.Car_id).length > 0" class="fleet-list">
                <div v-for="fleet in fleetStore.getCarFleets(car.Car_id)" :key="fleet.Fleet_id" class="fleet-item">
                  <p>{{ fleet.Fleet_Name }}</p>
                </div>
              </div>
              <p v-else>No fleets</p>
            </div>
            <div class="car-linked-item">
              <p class="label">Speedometers:</p>
              <div v-if="fleetStore.getSpeedometersByCarId(car.Car_id).length > 0" class="speedometer-grid">
                <div v-for="speedometer in fleetStore.getSpeedometersByCarId(car.Car_id)" 
                     :key="speedometer.Speedometer_id" 
                     class="speedometer-box">
                  <h6>Speedometer #{{ speedometer.Speedometer_id }}</h6>
                  <div class="mode-list">
                    <p class="label">Modes:</p>
                    <ul>
                      <li v-for="mode in getSpeedometerModes(speedometer.Speedometer_id)" 
                          :key="mode.id">
                        {{ mode.name }} ({{ mode.type }})
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <p v-else>No speedometers</p>
            </div>
          </div>
        </div>
      </div>

      <div v-if="selectedItemType === 'car'" class="car-details">
        <div class="car-info">
          <div class="car-header">
            <h4>Car #{{ (selectedItem as Car).Car_id }}</h4>
            <div class="status-icon" :class="{ 'status-complete': fleetStore.isCarComplete((selectedItem as Car).Car_id) }">
              <span class="material-icons">check_circle</span>
            </div>
          </div>
          <div class="car-linked-item">
            <p class="label">Brand:</p>
            <p>{{ getBrandName((selectedItem as Car).Brand_id) }}</p>
          </div>
          <div class="car-linked-item">
            <p class="label">Driver:</p>
            <p>{{ getDriverName((selectedItem as Car).Driver_id) }}</p>
          </div>
          <div class="car-linked-item">
            <p class="label">Fleets:</p>
            <div v-if="fleetStore.getCarFleets((selectedItem as Car).Car_id).length > 0" class="fleet-list">
              <div v-for="fleet in fleetStore.getCarFleets((selectedItem as Car).Car_id)" 
                   :key="fleet.Fleet_id" 
                   class="fleet-item">
                <p>{{ fleet.Fleet_Name }}</p>
              </div>
            </div>
            <p v-else>No fleets</p>
          </div>
          <div class="car-linked-item">
            <p class="label">Speedometers:</p>
            <div v-if="fleetStore.getSpeedometersByCarId((selectedItem as Car).Car_id).length > 0" class="speedometer-grid">
              <div v-for="speedometer in fleetStore.getSpeedometersByCarId((selectedItem as Car).Car_id)" 
                   :key="speedometer.Speedometer_id" 
                   class="speedometer-box">
                <h6>Speedometer #{{ speedometer.Speedometer_id }}</h6>
                <div class="mode-list">
                  <p class="label">Modes:</p>
                  <ul>
                    <li v-for="mode in getSpeedometerModes(speedometer.Speedometer_id)" 
                        :key="mode.id">
                      {{ mode.name }} ({{ mode.type }})
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <p v-else>No speedometers</p>
          </div>
        </div>
      </div>

      <div v-if="selectedItemType === 'speedometer' || selectedItemType === 'gps_mode' || selectedItemType === 'analog_mode'" class="car-grid">
        <div v-for="car in selectedItemType === 'speedometer' 
          ? fleetStore.getCarsBySpeedometerId((selectedItem as Speedometer).Speedometer_id)
          : selectedItemType === 'gps_mode'
            ? fleetStore.getCarsByGPSModeId((selectedItem as GPS_Mode).GPS_Mode_id)
            : fleetStore.getCarsByAnalogModeId((selectedItem as Analog_Mode).Analog_Mode_id)" 
             :key="car.Car_id" 
             class="car-node"
             :class="{ 'no-speedometer': !fleetStore.hasSpeedometer(car.Car_id) }"
             @click="selectCar(car)">
          <div class="car-header">
            <h6>Car #{{ car.Car_id }}</h6>
            <div class="status-icon" :class="{ 'status-complete': fleetStore.isCarComplete(car.Car_id) }">
              <span class="material-icons">check_circle</span>
            </div>
          </div>
          <div class="car-details">
            <div class="car-linked-item">
              <p class="label">Brand:</p>
              <p>{{ getBrandName(car.Brand_id) }}</p>
            </div>
            <div class="car-linked-item">
              <p class="label">Driver:</p>
              <p>{{ getDriverName(car.Driver_id) }}</p>
            </div>
            <div class="car-linked-item">
              <p class="label">Fleets:</p>
              <div v-if="fleetStore.getCarFleets(car.Car_id).length > 0" class="fleet-list">
                <div v-for="fleet in fleetStore.getCarFleets(car.Car_id)" :key="fleet.Fleet_id" class="fleet-item">
                  <p>{{ fleet.Fleet_Name }}</p>
                </div>
              </div>
              <p v-else>No fleets</p>
            </div>
            <div class="car-linked-item">
              <p class="label">Speedometers:</p>
              <div v-if="fleetStore.getSpeedometersByCarId(car.Car_id).length > 0" class="speedometer-grid">
                <div v-for="speedometer in fleetStore.getSpeedometersByCarId(car.Car_id)" 
                     :key="speedometer.Speedometer_id" 
                     class="speedometer-box">
                  <h6>Speedometer #{{ speedometer.Speedometer_id }}</h6>
                  <div class="mode-list">
                    <p class="label">Modes:</p>
                    <ul>
                      <li v-for="mode in getSpeedometerModes(speedometer.Speedometer_id)" 
                          :key="mode.id">
                        {{ mode.name }} ({{ mode.type }})
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <p v-else>No speedometers</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Selected Car Detail View -->
      <div v-if="selectedCar" class="selected-car-overlay" @click="selectedCar = null">
        <div class="selected-car-detail" @click.stop>
          <div class="car-header">
            <h4>Car #{{ selectedCar.Car_id }}</h4>
            <div class="status-icon" :class="{ 'status-complete': fleetStore.isCarComplete(selectedCar.Car_id) }">
              <span class="material-icons">check_circle</span>
            </div>
          </div>
          <div class="car-linked-item">
            <p class="label">Brand:</p>
            <div class="detail-value">
              <p>{{ getBrandName(selectedCar.Brand_id) }}</p>
              <p class="detail-info">ID: {{ selectedCar.Brand_id }}</p>
            </div>
          </div>
          <div class="car-linked-item">
            <p class="label">Driver:</p>
            <div class="detail-value">
              <p>{{ getDriverName(selectedCar.Driver_id) }}</p>
              <p class="detail-info">ID: {{ selectedCar.Driver_id }}</p>
            </div>
          </div>
          <div class="car-linked-item">
            <div class="section-header">
              <p class="label">Fleets:</p>
              <button v-if="fleetStore.getAvailableFleets(selectedCar.Car_id).length > 0"
                      @click="showAddFleet = !showAddFleet" 
                      class="toggle-add-button"
                      :class="{ 'active': showAddFleet }">
                <span class="material-icons">{{ showAddFleet ? 'remove' : 'add' }}</span>
                {{ showAddFleet ? 'Cancel' : 'Add to Fleet' }}
              </button>
            </div>
            <div class="fleet-section">
              <div v-if="fleetStore.getCarFleets(selectedCar.Car_id).length > 0" class="fleet-list">
                <div v-for="fleet in fleetStore.getCarFleets(selectedCar.Car_id)" :key="fleet.Fleet_id" class="fleet-item">
                  <p>{{ fleet.Fleet_Name }}</p>
                  <p class="detail-info">ID: {{ fleet.Fleet_id }}</p>
                </div>
              </div>
              <p v-else>No fleets</p>
              
              <div class="add-fleet-section" v-if="showAddFleet">
                <select v-model="selectedFleetId" class="fleet-select">
                  <option :value="null">Select a fleet to add...</option>
                  <option v-for="fleet in fleetStore.getAvailableFleets(selectedCar.Car_id)"
                          :key="fleet.Fleet_id"
                          :value="fleet.Fleet_id">
                    {{ fleet.Fleet_Name }}
                  </option>
                </select>
                <button @click="addFleet" 
                        :disabled="!selectedFleetId" 
                        class="add-fleet-button">
                  Add
                </button>
              </div>
            </div>
          </div>
          <div class="car-linked-item">
            <div class="section-header">
              <p class="label">Speedometers:</p>
              <button v-if="fleetStore.getAvailableSpeedometerSources(selectedCar.Car_id).length > 0"
                      @click="showAddSpeedometer = !showAddSpeedometer" 
                      class="toggle-add-button"
                      :class="{ 'active': showAddSpeedometer }">
                <span class="material-icons">{{ showAddSpeedometer ? 'remove' : 'add' }}</span>
                {{ showAddSpeedometer ? 'Cancel' : 'Add Speedometer' }}
              </button>
            </div>
            <div class="speedometer-section">
              <div v-if="fleetStore.getSpeedometersByCarId(selectedCar.Car_id).length > 0" class="speedometer-grid">
                <div v-for="speedometer in fleetStore.getSpeedometersByCarId(selectedCar.Car_id)" 
                     :key="speedometer.Speedometer_id" 
                     class="speedometer-box">
                  <h6>Speedometer #{{ speedometer.Speedometer_id }}</h6>
                  <div class="mode-list">
                    <p class="label">Modes:</p>
                    <ul>
                      <li v-for="mode in getSpeedometerModes(speedometer.Speedometer_id)" 
                          :key="mode.id">
                        {{ mode.name }} ({{ mode.type }})
                        <p class="detail-info">ID: {{ mode.id }}</p>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <p v-else>No speedometers</p>
              
              <div class="add-speedometer-section" v-if="showAddSpeedometer">
                <select v-model="selectedSpeedometerSourceId" class="speedometer-select">
                  <option :value="null">Select a speedometer source to add...</option>
                  <option v-for="source in fleetStore.getAvailableSpeedometerSources(selectedCar.Car_id)"
                          :key="source.Speedometer_Source_id"
                          :value="source.Speedometer_Source_id">
                    Speedometer Source #{{ source.Speedometer_Source_id }} 
                    ({{ source.Minimum_Speed }}-{{ source.Maximum_Speed }} km/h)
                  </option>
                </select>
                <div v-if="selectedSpeedometerSourceId" class="source-details">
                  <p class="label">Available Modes:</p>
                  <ul class="mode-preview">
                    <li v-for="mode in getSourceModes(selectedSpeedometerSourceId)" 
                        :key="mode.id">
                      {{ mode.name }} ({{ mode.type }})
                    </li>
                  </ul>
                </div>
                <button @click="addSpeedometer" 
                        :disabled="!selectedSpeedometerSourceId" 
                        class="add-speedometer-button">
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { fleetStore } from '../store/fleetStore'
import type { Fleet, Brand, Car, Driver, Speedometer, GPS_Mode, Analog_Mode } from '../types/fleet-management'

const selectedCar = ref<Car | null>(null)
const selectedFleetId = ref<number | null>(null)
const showAddFleet = ref(false)
const selectedSpeedometerSourceId = ref<number | null>(null)
const showAddSpeedometer = ref(false)

const props = defineProps<{
  selectedItem: Fleet | Brand | Car | Driver | Speedometer | GPS_Mode | Analog_Mode | null
  selectedItemType: string
}>()

const getItemName = (item: any) => {
  if ('Fleet_Name' in item) return item.Fleet_Name
  if ('Brand_Name' in item) return item.Brand_Name
  if ('Driver_Name' in item) return item.Driver_Name
  if ('Car_id' in item) return `Car #${item.Car_id}`
  if ('Speedometer_id' in item) return `Speedometer #${item.Speedometer_id}`
  if ('GPS_Mode_Name' in item) return item.GPS_Mode_Name
  if ('Analog_Mode_Name' in item) return item.Analog_Mode_Name
  return 'Unknown'
}

const linkedFleets = computed(() => {
  if (!props.selectedItem) return []
  
  switch (props.selectedItemType) {
    case 'car': {
      const selectedCar = props.selectedItem as Car
      return fleetStore.getCarFleets(selectedCar.Car_id)
    }
    case 'fleet': {
      const selectedFleet = props.selectedItem as Fleet
      return [selectedFleet]
    }
    default:
      return []
  }
})

const linkedBrand = computed(() => {
  if (!props.selectedItem) return null
  
  switch (props.selectedItemType) {
    case 'car': {
      const selectedCar = props.selectedItem as Car
      return fleetStore.getBrandById(selectedCar.Brand_id)
    }
    case 'brand': {
      return props.selectedItem as Brand
    }
    default:
      return null
  }
})

const linkedDriver = computed(() => {
  if (!props.selectedItem) return null
  
  switch (props.selectedItemType) {
    case 'car': {
      const selectedCar = props.selectedItem as Car
      return fleetStore.getDriverById(selectedCar.Driver_id)
    }
    case 'driver': {
      return props.selectedItem as Driver
    }
    default:
      return null
  }
})

const linkedSpeedometers = computed(() => {
  if (!props.selectedItem) return []
  
  switch (props.selectedItemType) {
    case 'car': {
      const selectedCar = props.selectedItem as Car
      const speedometer = fleetStore.getSpeedometerByCarId(selectedCar.Car_id)
      return speedometer ? [speedometer] : []
    }
    case 'speedometer': {
      return [props.selectedItem as Speedometer]
    }
    case 'gps_mode': {
      const selectedMode = props.selectedItem as GPS_Mode
      return fleetStore.getSpeedometersByGPSMode(selectedMode.GPS_Mode_id)
    }
    case 'analog_mode': {
      const selectedMode = props.selectedItem as Analog_Mode
      return fleetStore.getSpeedometersByAnalogMode(selectedMode.Analog_Mode_id)
    }
    default:
      return []
  }
})

const getSpeedometerModes = (speedometerId: number) => {
  const gpsMode = fleetStore.getGPSModeBySpeedometerId(speedometerId)
  const analogMode = fleetStore.getAnalogModeBySpeedometerId(speedometerId)
  const modes = []
  if (gpsMode) modes.push({ id: gpsMode.GPS_Mode_id, name: gpsMode.GPS_Mode_Name, type: gpsMode.GPS_Mode_Type })
  if (analogMode) modes.push({ id: analogMode.Analog_Mode_id, name: analogMode.Analog_Mode_Name, type: analogMode.Analog_Mode_Type })
  return modes
}

const getBrandName = (brandId: number) => {
  const brand = fleetStore.getBrandById(brandId)
  return brand?.Brand_Name || 'Unknown Brand'
}

const getDriverName = (driverId: number) => {
  const driver = fleetStore.getDriverById(driverId)
  return driver?.Driver_Name || 'Unknown Driver'
}

// Add method to handle car selection
const selectCar = (car: Car) => {
  selectedCar.value = selectedCar.value?.Car_id === car.Car_id ? null : car
}

// Add method to handle fleet addition
const addFleet = () => {
  if (selectedCar.value && selectedFleetId.value) {
    fleetStore.addCarToFleet(selectedCar.value.Car_id, selectedFleetId.value)
    selectedFleetId.value = null
    showAddFleet.value = false
  }
}

const getSourceModes = (sourceId: number) => {
  const sourceDetails = fleetStore.getSpeedometerSourceDetails(sourceId)
  return sourceDetails?.modes || []
}

const addSpeedometer = () => {
  if (selectedCar.value && selectedSpeedometerSourceId.value) {
    fleetStore.addSpeedometerToCar(selectedCar.value.Car_id, selectedSpeedometerSourceId.value)
    selectedSpeedometerSourceId.value = null
    showAddSpeedometer.value = false
  }
}
</script>

<style scoped>
.relationship-tree {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
}

.tree-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.center-node {
  background: #fff;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
  min-width: 200px;
}

.linked-category {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  width: 100%;
}

.node-group {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  width: 100%;
}

.node {
  background: #f5f5f5;
  padding: 1rem;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  min-width: 180px;
  text-align: center;
}

h3, h4, h5 {
  margin: 0;
  padding: 0;
}

h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

h4 {
  font-size: 1.2rem;
  color: #666;
}

h5 {
  font-size: 1rem;
  color: #333;
}

p {
  margin: 0.5rem 0 0;
  color: #666;
  font-size: 0.9rem;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0.5rem 0 0;
}

li {
  font-size: 0.9rem;
  color: #666;
  margin-top: 0.25rem;
}

.car-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 0.75rem;
  width: 100%;
  margin-top: 1rem;
  max-width: 1200px;
}

.car-node {
  background: white;
  padding: 0.5rem;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  height: 100%;
  min-width: 0;
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
  border: 2px solid transparent;
}

.car-node.no-speedometer {
  border-color: #ff4444;
}

.car-node:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.car-node.no-speedometer:hover {
  box-shadow: 0 4px 8px rgba(255, 68, 68, 0.2);
}

.car-details {
  margin-top: 0.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  align-items: center;
}

.car-linked-item {
  padding: 0.25rem;
  background: #f5f5f5;
  border-radius: 4px;
  width: 100%;
}

.speedometer-details {
  margin-top: 0.15rem;
  text-align: center;
}

.mode-list {
  margin-top: 0.15rem;
  padding-left: 0;
  text-align: center;
}

.label {
  font-weight: bold;
  color: #333;
  margin-bottom: 0.1rem;
  font-size: 0.8rem;
}

h6 {
  font-size: 0.9rem;
  color: #333;
  margin: 0 0 0.15rem 0;
}

p {
  margin: 0.1rem 0 0;
  color: #666;
  font-size: 0.8rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0.1rem 0 0;
}

li {
  font-size: 0.8rem;
  color: #666;
  margin-top: 0.1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.car-details {
  margin-top: 0.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  align-items: center;
}

.car-info {
  background: #fff;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
  min-width: 200px;
}

.fleet-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
  width: 100%;
}

.fleet-item {
  background: #f5f5f5;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  min-width: 100px;
  text-align: center;
}

.speedometer-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  width: 100%;
  margin-top: 0.5rem;
}

.speedometer-box {
  background: #f8f8f8;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
}

.speedometer-box h6 {
  font-size: 1rem;
  color: #333;
  margin: 0 0 0.5rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e0e0e0;
}

.speedometer-box .mode-list {
  margin-top: 0.5rem;
}

.speedometer-box .mode-list .label {
  font-weight: bold;
  color: #555;
  margin-bottom: 0.5rem;
}

.speedometer-box .mode-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.speedometer-box .mode-list li {
  background: #fff;
  padding: 0.5rem;
  margin-bottom: 0.25rem;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
  font-size: 0.9rem;
  color: #444;
}

.speedometer-box .mode-list li:last-child {
  margin-bottom: 0;
}

.car-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.status-icon {
  color: #ccc;
  font-size: 1.2rem;
}

.status-icon.status-complete {
  color: #4caf50;
}

.material-icons {
  font-family: 'Material Icons';
  font-weight: normal;
  font-style: normal;
  font-size: 24px;
  line-height: 1;
  letter-spacing: normal;
  text-transform: none;
  display: inline-block;
  white-space: nowrap;
  word-wrap: normal;
  direction: ltr;
  -webkit-font-feature-settings: 'liga';
  -webkit-font-smoothing: antialiased;
}

.selected-car-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.selected-car-detail {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  max-width: 800px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.detail-info {
  font-size: 0.8rem;
  color: #666;
  margin-top: 0.25rem;
  font-style: italic;
}

.detail-value {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.fleet-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.add-fleet-section {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid #e0e0e0;
  animation: slideDown 0.2s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fleet-select {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 0.9rem;
}

.add-fleet-button {
  padding: 0.5rem 1rem;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  white-space: nowrap;
}

.add-fleet-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.add-fleet-button:not(:disabled):hover {
  background-color: #45a049;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.toggle-add-button {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  color: #666;
  transition: all 0.2s;
}

.toggle-add-button:hover {
  background-color: #e0e0e0;
}

.toggle-add-button.active {
  background-color: #e0e0e0;
  border-color: #999;
}

.toggle-add-button .material-icons {
  font-size: 1rem;
}

.speedometer-section {
  margin-top: 0.5rem;
}

.add-speedometer-section {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  background: #f9f9f9;
  padding: 0.75rem;
  border-radius: 4px;
}

.speedometer-select {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
  width: 100%;
}

.source-details {
  background: #fff;
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #eee;
}

.mode-preview {
  margin: 0.25rem 0 0;
  padding-left: 1rem;
}

.mode-preview li {
  font-size: 0.8rem;
  color: #666;
}

.add-speedometer-button {
  padding: 0.5rem;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s;
}

.add-speedometer-button:hover:not(:disabled) {
  background: #45a049;
}

.add-speedometer-button:disabled {
  background: #cccccc;
  cursor: not-allowed;
}
</style> 