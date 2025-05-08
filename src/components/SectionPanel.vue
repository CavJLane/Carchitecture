<template>
  <div :class="['section-panel', borderClass]">
    <div class="section-header" @click="toggle">
      <span class="arrow">{{ expanded ? '▼' : '▶' }}</span>
      <span class="title">{{ title }}</span>
      <button v-if="availableObjects.length && !showAdd" class="add-btn" @click.stop="showAdd = true">Add</button>
      <slot name="add"></slot>
    </div>
    <div v-if="expanded" class="section-body">
      <ul>
        <li v-for="obj in localObjects" :key="getObjectKey(obj)">
          <div class="object-summary">
            <span v-if="type === 'brand'">{{ obj.brand_name }} [ID: {{ obj.brand_id }}]</span>
            <span v-else-if="type === 'driver'">{{ obj.driver_name }} [ID: {{ obj.driver_id }}]</span>
            <span v-else-if="type === 'fleet'">{{ obj.fleet_name }} [ID: {{ obj.fleet_id }}]</span>
            <span v-else-if="type === 'sensor'">Sensor #{{ obj.sensor_id }}</span>
            <span v-else-if="type === 'mode'">Mode: {{ obj.mode_name || obj.mode_id }}</span>
            <button class="remove-btn" @click.stop="removeObject(obj)">Remove</button>
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
      <div v-if="showAdd" class="add-section">
        <select v-model="selectedAddId">
          <option value="">Select...</option>
          <option v-for="obj in availableObjects" :key="getObjectKey(obj)" :value="getObjectKey(obj)">
            <span v-if="type === 'brand'">{{ obj.brand_name }} [ID: {{ obj.brand_id }}]</span>
            <span v-else-if="type === 'driver'">{{ obj.driver_name }} [ID: {{ obj.driver_id }}]</span>
            <span v-else-if="type === 'fleet'">{{ obj.fleet_name }} [ID: {{ obj.fleet_id }}]</span>
            <span v-else-if="type === 'sensor'">Sensor #{{ obj.sensor_id }}</span>
            <span v-else-if="type === 'mode'">Mode: {{ obj.mode_name || obj.mode_id }}</span>
          </option>
        </select>
        <button class="add-confirm-btn" :disabled="!selectedAddId" @click.stop="addSelected">Add</button>
        <button class="add-cancel-btn" @click.stop="showAdd = false">Cancel</button>
      </div>
      <button v-if="hasChanges" class="save-btn" @click.stop="saveChanges">Save</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, computed, watch, toRefs } from 'vue'

const props = defineProps<{
  title: string
  objects: any[]
  availableObjects: any[]
  type: string
  completeness: boolean
  validity: boolean
  advanced: boolean
}>()

const emit = defineEmits(['add-object', 'remove-object', 'save'])

const expanded = ref(false)
const showAdd = ref(false)
const selectedAddId = ref('')
const localObjects = ref<any[]>([...props.objects])
const originalObjects = ref<any[]>([...props.objects])

watch(() => props.objects, (newVal) => {
  localObjects.value = [...newVal]
  originalObjects.value = [...newVal]
})

function toggle() {
  expanded.value = !expanded.value
}

const borderClass = computed(() => {
  if (!props.completeness) return 'section-red'
  if (!props.validity) return 'section-yellow'
  return 'section-default'
})

function getObjectKey(obj: any) {
  return obj.brand_id || obj.driver_id || obj.fleet_id || obj.sensor_id || obj.mode_id || obj.id || JSON.stringify(obj)
}

function removeObject(obj: any) {
  localObjects.value = localObjects.value.filter(o => getObjectKey(o) !== getObjectKey(obj))
  emit('remove-object', obj)
}

function addSelected() {
  if (!selectedAddId.value) return
  const obj = props.availableObjects.find(o => getObjectKey(o) === selectedAddId.value)
  if (obj) {
    localObjects.value.push(obj)
    emit('add-object', obj)
  }
  showAdd.value = false
  selectedAddId.value = ''
}

const hasChanges = computed(() => {
  // Compare localObjects to originalObjects by keys
  const origKeys = new Set(originalObjects.value.map(getObjectKey))
  const localKeys = new Set(localObjects.value.map(getObjectKey))
  if (origKeys.size !== localKeys.size) return true
  for (const key of origKeys) if (!localKeys.has(key)) return true
  for (const key of localKeys) if (!origKeys.has(key)) return true
  return false
})

function saveChanges() {
  emit('save', localObjects.value)
  originalObjects.value = [...localObjects.value]
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
.add-btn {
  margin-left: 1rem;
  padding: 0.2rem 0.7rem;
  border-radius: 4px;
  border: 1px solid #42b983;
  background: #e8f5e9;
  color: #2e7d32;
  cursor: pointer;
}
.remove-btn {
  margin-left: 1rem;
  padding: 0.2rem 0.7rem;
  border-radius: 4px;
  border: 1px solid #e53935;
  background: #ffebee;
  color: #b71c1c;
  cursor: pointer;
}
.add-section {
  margin-top: 0.5rem;
  display: flex;
  gap: 0.5rem;
  align-items: center;
}
.add-confirm-btn, .add-cancel-btn {
  padding: 0.2rem 0.7rem;
  border-radius: 4px;
  border: 1px solid #42b983;
  background: #e8f5e9;
  color: #2e7d32;
  cursor: pointer;
}
.add-cancel-btn {
  border: 1px solid #aaa;
  background: #f5f5f5;
  color: #333;
}
.save-btn {
  margin-top: 1rem;
  padding: 0.3rem 1.2rem;
  border-radius: 4px;
  border: 1px solid #1976d2;
  background: #e3f2fd;
  color: #1976d2;
  font-weight: 600;
  cursor: pointer;
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