import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { WeekPlan, DayOfWeek, MealSlot, Meal } from '../types'
import { getRandomMeal } from '../services/mealdb'
import { isAllergySafe } from '../utils/allergy'
import { decodePlanFromUrl, clearPlanFromUrl, hasSharedPlan } from '../utils/shareUrl'
import { useUserStore } from './userStore'
import { useDragStore } from './dragStore'

const STORAGE_KEY = 'heartly_plan'

const EMPTY_PLAN: WeekPlan = {
  Mon: {}, Tue: {}, Wed: {}, Thu: {}, Fri: {}, Sat: {}, Sun: {},
}

export const usePlannerStore = defineStore('planner', () => {
  // ===== STATE =====
  const plan = ref<WeekPlan>(loadInitialPlan())
  const isGenerating = ref(false)

  // ===== GETTERS =====
  const totalMeals = computed(() => {
    let count = 0
    for (const day of Object.values(plan.value)) {
      if (day.breakfast) count++
      if (day.lunch) count++
      if (day.dinner) count++
    }
    return count
  })

  const allIngredients = computed(() => {
    const map = new Map<string, string>()
    for (const day of Object.values(plan.value)) {
      const meals = [day.breakfast, day.lunch, day.dinner].filter(Boolean) as Meal[]
      for (const meal of meals) {
        map.set(meal.id, meal.name)
      }
    }
    return Array.from(map.values())
  })

  // ===== ACTIONS =====
  function setMeal(day: DayOfWeek, slot: MealSlot, meal: Meal) {
    const dragStore = useDragStore()

    if (dragStore.sourceDay && dragStore.sourceSlot) {
      const isSameSlot = dragStore.sourceDay === day && dragStore.sourceSlot === slot
      if (!isSameSlot) {
        // Swap — meal di target pindah ke slot asal
        const targetMeal = plan.value[day][slot]
        plan.value[dragStore.sourceDay][dragStore.sourceSlot] = targetMeal ?? undefined
      }
    }

    plan.value[day][slot] = meal
    saveToStorage(plan.value)
  }

  function removeMeal(day: DayOfWeek, slot: MealSlot) {
    plan.value[day][slot] = undefined
    saveToStorage(plan.value)
  }

  function clearPlan() {
    plan.value = { Mon: {}, Tue: {}, Wed: {}, Thu: {}, Fri: {}, Sat: {}, Sun: {} }
    saveToStorage(plan.value)
  }

  async function autoGenerate() {
    const userStore = useUserStore()
    const days: DayOfWeek[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    const slots: MealSlot[] = ['breakfast', 'lunch', 'dinner']

    isGenerating.value = true

    const fetchSafeMeal = async (attempt = 0): Promise<Meal | null> => {
      if (attempt > 15) return null
      const meal = await getRandomMeal()
      if (meal && isAllergySafe(meal, userStore.dietary)) return meal
      return fetchSafeMeal(attempt + 1)
    }

    try {
      for (const day of days) {
        const results = await Promise.all(
          slots.map(slot => fetchSafeMeal().then(meal => ({ slot, meal })))
        )
        for (const { slot, meal } of results) {
          if (meal) plan.value[day][slot] = meal
        }
      }
      saveToStorage(plan.value)
    } finally {
      isGenerating.value = false
    }
  }

  function loadSharedPlan() {
    if (!hasSharedPlan()) return false
    const shared = decodePlanFromUrl()
    if (!shared) return false
    plan.value = shared
    saveToStorage(plan.value)
    clearPlanFromUrl()
    return true
  }

  // ===== HELPERS =====
  function saveToStorage(data: WeekPlan) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }

  function loadInitialPlan(): WeekPlan {
    if (hasSharedPlan()) {
      const shared = decodePlanFromUrl()
      if (shared) {
        clearPlanFromUrl()
        return shared
      }
    }
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : { ...EMPTY_PLAN }
    } catch {
      return { ...EMPTY_PLAN }
    }
  }

  return {
    plan,
    isGenerating,
    totalMeals,
    allIngredients,
    setMeal,
    removeMeal,
    clearPlan,
    autoGenerate,
    loadSharedPlan,
  }
})