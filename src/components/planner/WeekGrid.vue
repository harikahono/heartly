<template>
  <div class="week-grid grid grid-cols-7 gap-3">
    <DayColumn
      v-for="day in days"
      :key="day"
      :day="day"
    />
  </div>
</template>

<script setup lang="ts">
import type { DayOfWeek } from '../../types'
import DayColumn from './DayColumn.vue'

const days: DayOfWeek[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
</script>