import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Meal, DayOfWeek, MealSlot } from '../types'

export const useDragStore = defineStore('drag', () => {
  const draggedMeal = ref<Meal | null>(null)
  const sourceDay = ref<DayOfWeek | null>(null)
  const sourceSlot = ref<MealSlot | null>(null)

  function setDraggedMeal(meal: Meal) {
    draggedMeal.value = meal
  }

  function clearDraggedMeal() {
    draggedMeal.value = null
  }

  function setSourceSlot(day: DayOfWeek, slot: MealSlot) {
    sourceDay.value = day
    sourceSlot.value = slot
  }

  function clearSourceSlot() {
    sourceDay.value = null
    sourceSlot.value = null
  }

  return {
    draggedMeal,
    sourceDay,
    sourceSlot,
    setDraggedMeal,
    clearDraggedMeal,
    setSourceSlot,
    clearSourceSlot,
  }
})