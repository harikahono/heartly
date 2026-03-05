<template>
  <div class="day-column flex flex-col gap-1.5">

    <!-- Day header -->
    <div
      class="text-center pb-2 mb-1 border-b-2 transition-colors"
      :class="isToday ? 'border-primary' : 'border-transparent'"
    >
      <p
        class="font-nunito font-black text-xs uppercase tracking-[0.15em] transition-colors"
        :class="isToday ? 'text-primary' : 'text-text-muted'"
      >
        {{ day }}
      </p>
      <p
        class="font-nunito font-black text-lg leading-none mt-0.5"
        :class="isToday ? 'text-text' : 'text-border'"
      >
        {{ dayNumber }}
      </p>
    </div>

    <MealSlotVue
      v-for="slot in slots"
      :key="slot.value"
      :day="day"
      :slot-type="slot.value"
      :label="slot.label"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { DayOfWeek, MealSlot } from '../../types'
import MealSlotVue from './MealSlot.vue'

const props = defineProps<{ day: DayOfWeek }>()

const slots: { value: MealSlot; label: string }[] = [
  { value: 'breakfast', label: 'Breakfast' },
  { value: 'lunch',     label: 'Lunch'     },
  { value: 'dinner',    label: 'Dinner'    },
]

const dayIndex: Record<DayOfWeek, number> = {
  Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5, Sun: 6
}

// Tampilkan tanggal aktual sesuai hari di minggu ini
const dayNumber = computed(() => {
  const today = new Date()
  const currentDay = today.getDay() === 0 ? 6 : today.getDay() - 1 // Mon = 0
  const diff = dayIndex[props.day] - currentDay
  const date = new Date(today)
  date.setDate(today.getDate() + diff)
  return date.getDate()
})

const isToday = computed(() => {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 3)
  return today === props.day
})
</script>