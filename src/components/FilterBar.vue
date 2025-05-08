<template>
  <div class="filter-bar">
    <label>
      Fleet:
      <select v-model="selectedFleet" @change="emitFilters">
        <option value="">All</option>
        <option v-for="fleet in fleets" :key="fleet.fleet_id" :value="fleet.fleet_id">
          {{ fleet.fleet_name }}
        </option>
      </select>
    </label>
    <label>
      Brand:
      <select v-model="selectedBrand" @change="emitFilters">
        <option value="">All</option>
        <option v-for="brand in brands" :key="brand.brand_id" :value="brand.brand_id">
          {{ brand.brand_name }}
        </option>
      </select>
    </label>
    <label>
      Driver:
      <select v-model="selectedDriver" @change="emitFilters">
        <option value="">All</option>
        <option v-for="driver in drivers" :key="driver.driver_id" :value="driver.driver_id">
          {{ driver.driver_name }}
        </option>
      </select>
    </label>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from 'vue'
import type { FleetRecord, BrandRecord, DriverRecord } from '../types/fleet-management'

const props = defineProps<{
  fleets: FleetRecord[]
  brands: BrandRecord[]
  drivers: DriverRecord[]
  filterFleet: number | ''
  filterBrand: number | ''
  filterDriver: number | ''
}>()

const emit = defineEmits<{
  (e: 'update:filters', filters: { fleet: number | ''; brand: number | ''; driver: number | '' }): void
}>()

const selectedFleet = ref<number | ''>(props.filterFleet)
const selectedBrand = ref<number | ''>(props.filterBrand)
const selectedDriver = ref<number | ''>(props.filterDriver)

watch(() => [props.filterFleet, props.filterBrand, props.filterDriver], ([f, b, d]) => {
  selectedFleet.value = f
  selectedBrand.value = b
  selectedDriver.value = d
})

function emitFilters() {
  emit('update:filters', {
    fleet: selectedFleet.value,
    brand: selectedBrand.value,
    driver: selectedDriver.value
  })
}
</script>

<style scoped>
.filter-bar {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  align-items: center;
}
label {
  font-weight: 500;
}
select {
  margin-left: 0.5rem;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  border: 1px solid #ccc;
}
</style> 