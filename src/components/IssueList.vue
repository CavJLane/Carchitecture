<template>
  <div class="issue-list">
    <h3>Issues</h3>
    <ul v-if="issues.length">
      <li v-for="(issue, idx) in issues" :key="idx" class="issue-item">
        <strong>{{ issue.objectType }} [ID: {{ issue.objectId }}]:</strong> {{ issue.message }}
      </li>
    </ul>
    <div v-else class="no-issues">All completeness and validity checks passed.</div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps<{
  issues: { objectType: string; objectId: number; message: string }[]
}>()
</script>

<style scoped>
.issue-list {
  margin-top: 2rem;
  padding: 1rem;
  border-top: 1px solid #eee;
}
.issue-item {
  color: #e53935;
  margin-bottom: 0.25rem;
}
.no-issues {
  color: #388e3c;
  font-weight: 500;
}
</style> 