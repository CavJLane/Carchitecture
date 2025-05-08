<template>
  <div class="overlay-bg" @click.self="emit('close')">
    <div class="overlay-content">
      <button class="close-btn" @click="emit('close')">&times;</button>
      <h2>Car Details: {{ car.car_name }} (ID: {{ car.car_id }})</h2>
      <button class="advanced-btn" @click="toggleAdvanced">{{ advancedView ? 'Hide' : 'Show' }} Advanced View</button>
      <div class="sections">
        <SectionPanel
          title="Brand"
          :objects="brand ? [brand] : []"
          :available-objects="availableBrands"
          type="brand"
          :completeness="completeness"
          :validity="validity"
          :advanced="advancedView"
        />
        <SectionPanel
          title="Driver"
          :objects="driver ? [driver] : []"
          :available-objects="availableDrivers"
          type="driver"
          :completeness="completeness"
          :validity="validity"
          :advanced="advancedView"
        />
        <SectionPanel
          title="Fleets"
          :objects="fleets"
          :available-objects="availableFleets"
          type="fleet"
          :completeness="completeness"
          :validity="validity"
          :advanced="advancedView"
        />
        <SectionPanel
          title="Sensors"
          :objects="sensors"
          :available-objects="availableSensors"
          type="sensor"
          :completeness="completeness"
          :validity="validity"
          :advanced="advancedView"
        />
        <SectionPanel
          title="Modes"
          :objects="modes"
          :available-objects="availableModes"
          type="mode"
          :completeness="completeness"
          :validity="validity"
          :advanced="advancedView"
        />
      </div>
      <IssueList :issues="issues" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, computed } from 'vue';
import type { CarRecord, BrandRecord, DriverRecord, FleetRecord, SensorRecord } from '../types/fleet-management';
import { fleetStore } from '../store/fleetStore';
import IssueList from '../components/IssueList.vue'
import SectionPanel from '../components/SectionPanel.vue'

const props = defineProps<{
  car: CarRecord
  brand: BrandRecord | undefined
  driver: DriverRecord | undefined
  fleets: FleetRecord[]
  sensors: SensorRecord[]
  modes: any[]
  completeness: boolean
  validity: boolean
  issues: string[]
}>()

const emit = defineEmits(['close'])
const advancedView = ref(false)
function toggleAdvanced() {
  advancedView.value = !advancedView.value
}

// Available objects for each section
const availableBrands = computed(() => {
  return fleetStore.state.brandRecords.filter(b => !props.brand || b.brand_id !== props.brand.brand_id)
})
const availableDrivers = computed(() => {
  return fleetStore.state.driverRecords.filter(d => !props.driver || d.driver_id !== props.driver.driver_id)
})
const availableFleets = computed(() => {
  const linkedIds = props.fleets.map(f => f.fleet_id)
  return fleetStore.state.fleetRecords.filter(f => !linkedIds.includes(f.fleet_id))
})
const availableSensors = computed(() => {
  const linkedIds = props.sensors.map(s => s.sensor_id)
  return fleetStore.state.sensorRecords.filter(s => !linkedIds.includes(s.sensor_id))
})
const availableModes = computed(() => {
  // Modes not already linked to any of the car's sensors
  const linkedModeIds = props.modes.map((m: any) => m.mode_id)
  const allModes = [
    ...fleetStore.state.truckSpeedSensorModeRecords,
    ...fleetStore.state.truckHeatSensorModeRecords
  ]
  return allModes.filter(m => !linkedModeIds.includes(m.mode_id))
})
</script>

<style scoped>
.overlay-bg {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.4);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}
.overlay-content {
  background: #fff;
  border-radius: 10px;
  padding: 2rem;
  min-width: 400px;
  max-width: 90vw;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}
.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 2rem;
  background: none;
  border: none;
  cursor: pointer;
}
.advanced-btn {
  margin-bottom: 1rem;
  padding: 0.3rem 1rem;
  border-radius: 4px;
  border: 1px solid #ccc;
  background: #f5f5f5;
  cursor: pointer;
}
.sections {
  margin-bottom: 1.5rem;
}
</style> 