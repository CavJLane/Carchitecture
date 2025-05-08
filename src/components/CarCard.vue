<template>
  <div
    class="car-card"
    :class="borderClass"
    @click="onClick"
  >
    <h2>{{ car.car_name }} (ID: {{ car.car_id }})</h2>
    <div class="section">
      <strong>Brand:</strong>
      <span v-if="brand">{{ brand.brand_name }} ({{ brand.brand_type }}) [ID: {{ brand.brand_id }}]</span>
      <span v-else>None</span>
    </div>
    <div class="section">
      <strong>Driver:</strong>
      <span v-if="driver">{{ driver.driver_name }} [ID: {{ driver.driver_id }}]</span>
      <span v-else>None</span>
    </div>
    <div class="section">
      <strong>Fleets:</strong>
      <span v-if="fleets.length">{{ fleets.map(f => `${f.fleet_name} [ID: ${f.fleet_id}]`).join(', ') }}</span>
      <span v-else>None</span>
    </div>
    <div class="section">
      <strong>Sensors:</strong>
      <ul>
        <li v-for="sensor in sensors" :key="sensor.sensor_id">
          Sensor #{{ sensor.sensor_id }} ({{ sensor.notes.type }})
          <ul>
            <li v-for="mode in getSensorModes(sensor.sensor_id)" :key="mode.mode_id">
              Mode: {{ mode.mode_name }} ({{ mode.mode_type }})
            </li>
          </ul>
        </li>
      </ul>
      <span v-if="!sensors.length">None</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps, defineEmits } from 'vue'
import { CarRecord, BrandRecord, DriverRecord, FleetRecord, SensorRecord } from '../types/fleet-management'

const props = defineProps<{
  car: CarRecord
  brand: BrandRecord | undefined
  driver: DriverRecord | undefined
  fleets: FleetRecord[]
  sensors: SensorRecord[]
  getSensorModes: (sensorId: number) => any[]
  completeness: boolean
  validity: boolean
}>()

const emit = defineEmits(['open-detail'])

const borderClass = computed(() => {
  if (!props.completeness) return 'border-red'
  if (!props.validity) return 'border-yellow'
  return 'border-default'
})

function onClick() {
  emit('open-detail', props.car.car_id)
}
</script>

<style scoped>
.car-card {
  border: 2px solid var(--border-color, #ccc);
  border-radius: 8px;
  padding: 1rem;
  margin: 1rem;
  cursor: pointer;
  background: #fff;
  transition: border-color 0.2s;
}
.border-red {
  --border-color: #e53935;
}
.border-yellow {
  --border-color: #fbc02d;
}
.border-default {
  --border-color: #42b983;
}
.section {
  margin-bottom: 0.5rem;
}
</style> 