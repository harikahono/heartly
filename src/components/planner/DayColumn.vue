<template>
  <div class="day-column flex flex-col gap-2">
    <div
      class="day-header text-center py-2 rounded-2xl font-nunito font-black text-sm"
      :class="isToday
        ? 'bg-primary text-white shadow-[0_4px_12px_rgb(255_107_107/0.35)]'
        : 'bg-white border-2 border-border text-text-muted'"
    >
      <p class="text-xs uppercase tracking-widest opacity-70">{{ day }}</p>
      <p class="text-lg leading-none">{{ dayEmoji }}</p>
    </div>

    <MealSlotVue
      v-for="slot in slots"
      :key="slot.value"
      :day="day"
      :slot-type="slot.value"
      :label="slot.label"
      :emoji="slot.emoji"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { DayOfWeek, MealSlot } from '../../types'
import MealSlotVue from './MealSlot.vue'

const props = defineProps<{ day: DayOfWeek }>()

const slots: { value: MealSlot; label: string; emoji: string }[] = [
  { value: 'breakfast', label: 'Breakfast', emoji: '🌅' },
  { value: 'lunch',     label: 'Lunch',     emoji: '☀️' },
  { value: 'dinner',    label: 'Dinner',    emoji: '🌙' },
]

const dayEmojis: Record<DayOfWeek, string> = {
  Mon: '💪', Tue: '🔥', Wed: '⚡', Thu: '🌿', Fri: '🎉', Sat: '😎', Sun: '☀️'
}

const dayEmoji = computed(() => dayEmojis[props.day])

const isToday = computed(() => {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 3)
  return today === props.day
})
</script>