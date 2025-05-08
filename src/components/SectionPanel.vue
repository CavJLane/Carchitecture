<template>
  <div :class="['section-panel', borderClass]">
    <div class="section-header" @click="toggle">
      <span class="arrow">{{ expanded ? '▼' : '▶' }}</span>
      <span class="title">{{ title }}</span>
      <slot name="add"></slot>
    </div>
    <div v-if="expanded" class="section-body">
      <ul>
        <li v-for="obj in objects" :key="getObjectKey(obj)">
          <div class="object-summary">
            <span v-if="type === 'brand'">{{ obj.brand_name }} [ID: {{ obj.brand_id }}]</span>
            <span v-else-if="type === 'driver'">{{ obj.driver_name }} [ID: {{ obj.driver_id }}]</span>
            <span v-else-if="type === 'fleet'">{{ obj.fleet_name }} [ID: {{ obj.fleet_id }}]</span>
            <span v-else-if="type === 'sensor'">Sensor #{{ obj.sensor_id }}</span>
            <span v-else-if="type === 'mode'">Mode: {{ obj.mode_name || obj.mode_id }}</span>
            <slot name="remove" :object="obj"></slot>
          </div>
          <div v-if="advanced" class="object-advanced">
            <div v-for="(value, key) in obj" :key="key" class="advanced-row">
              <span class="advanced-label">{{ key }}:</span>
              <span class="advanced-value">{{ value }}</span>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, computed } from 'vue'

const props = defineProps<{
  title: string
  objects: any[]
  type: string
  completeness: boolean
  validity: boolean
  advanced: boolean
}>()

const expanded = ref(false)
function toggle() {
  expanded.value = !expanded.value
}

const borderClass = computed(() => {
  if (!props.completeness) return 'section-red'
  if (!props.validity) return 'section-yellow'
  return 'section-default'
})

function getObjectKey(obj: any) {
  // Try to use a unique id for each type
  return obj.brand_id || obj.driver_id || obj.fleet_id || obj.sensor_id || obj.mode_id || obj.id || JSON.stringify(obj)
}
</script>

<style scoped>
.section-panel {
  border: 2px solid var(--section-border-color, #ccc);
  border-radius: 6px;
  margin-bottom: 1rem;
  background: #fafbfc;
}
.section-header {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0.5rem 1rem;
  font-weight: 600;
  user-select: none;
}
.arrow {
  margin-right: 0.5rem;
}
.title {
  flex: 1;
}
.section-red {
  --section-border-color: #e53935;
}
.section-yellow {
  --section-border-color: #fbc02d;
}
.section-default {
  --section-border-color: #42b983;
}
.section-body {
  padding: 0.5rem 1.5rem 1rem 1.5rem;
}
.object-summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}
.object-advanced {
  background: #f5f5f5;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  margin-bottom: 0.5rem;
}
.advanced-row {
  display: flex;
  gap: 0.5rem;
}
.advanced-label {
  font-weight: 500;
  color: #555;
}
.advanced-value {
  color: #222;
}
</style> 