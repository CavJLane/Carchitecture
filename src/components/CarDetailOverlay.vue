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
          type="brand"
          :completeness="completeness"
          :validity="validity"
          :advanced="advancedView"
        />
        <SectionPanel
          title="Driver"
          :objects="driver ? [driver] : []"
          type="driver"
          :completeness="completeness"
          :validity="validity"
          :advanced="advancedView"
        />
        <SectionPanel
          title="Fleets"
          :objects="fleets"
          type="fleet"
          :completeness="completeness"
          :validity="validity"
          :advanced="advancedView"
        />
        <SectionPanel
          title="Sensors"
          :objects="sensors"
          type="sensor"
          :completeness="completeness"
          :validity="validity"
          :advanced="advancedView"
        />
        <SectionPanel
          title="Modes"
          :objects="modes"
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
import { ref, defineProps, defineEmits } from 'vue';
import type { CarRecord, BrandRecord, DriverRecord, FleetRecord, SensorRecord } from '../types/fleet-management';
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