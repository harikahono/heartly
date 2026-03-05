<template>
  <Teleport to="body">
    <div class="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4" @click.self="$emit('close')">
      <div class="bg-white rounded-3xl w-full max-w-lg max-h-[85vh] overflow-hidden flex flex-col shadow-2xl animate-[slideUp_0.3s_cubic-bezier(0.34,1.56,0.64,1)_both]">

        <!-- Header -->
        <div class="flex items-center justify-between p-5 border-b border-border">
          <div>
            <h2 class="font-nunito font-black text-xl text-text">Grocery List</h2>
            <p class="text-xs text-text-muted mt-0.5">{{ totalMeals }} meals · {{ totalIngredients }} ingredients</p>
          </div>
          <div class="flex items-center gap-2">
            <button class="px-4 py-2 bg-[#f0fdf4] border-2 border-[#bbf7d0] text-[#16a34a] rounded-2xl font-nunito font-bold text-xs hover:bg-[#dcfce7] transition-all" @click="handlePrint">
              Print
            </button>
            <button class="w-9 h-9 bg-[#fff5f5] border-2 border-[#fecaca] text-[#ef4444] rounded-full font-bold flex items-center justify-center hover:bg-[#fee2e2] transition-all" @click="$emit('close')">
              ✕
            </button>
          </div>
        </div>

        <!-- Loading -->
        <div v-if="isLoading" class="flex flex-col items-center justify-center py-16 gap-3">
          <span class="text-4xl animate-bounce">🛒</span>
          <p class="font-nunito font-bold text-text-muted text-sm">Collecting ingredients...</p>
        </div>

        <!-- Empty -->
        <div v-else-if="groupedIngredients.length === 0" class="flex flex-col items-center justify-center py-16 gap-3">
          <span class="text-5xl">🍽️</span>
          <p class="font-nunito font-black text-text">No meals planned yet</p>
          <p class="text-text-muted text-sm">Add meals to your planner first</p>
        </div>

        <!-- Ingredient list -->
        <div v-else class="overflow-y-auto flex-1 p-5 flex flex-col gap-4">
          <div v-for="group in groupedIngredients" :key="group.mealName">
            <div class="flex items-center gap-2 mb-2">
              <img :src="group.thumb" :alt="group.mealName" class="w-7 h-7 rounded-full object-cover border-2 border-border" />
              <p class="font-nunito font-black text-sm text-text">{{ group.mealName }}</p>
              <span class="text-[10px] text-text-muted ml-auto">{{ group.ingredients.length }} items</span>
            </div>
            <div class="grid grid-cols-2 gap-1.5 pl-9">
              <label v-for="ing in group.ingredients" :key="ing.name" class="flex items-center gap-2 p-2 rounded-xl hover:bg-[#fafafa] cursor-pointer transition-all">
                <input
                  type="checkbox"
                  :checked="checkedItems.has(`${group.mealName}-${ing.name}`)"
                  class="w-3.5 h-3.5 accent-[#ff6b6b] rounded cursor-pointer flex-shrink-0"
                  @change="toggleCheck(group.mealName, ing.name)"
                />
                <div class="min-w-0">
                  <p class="text-[11px] font-bold leading-tight truncate transition-all"
                    :class="checkedItems.has(`${group.mealName}-${ing.name}`) ? 'line-through text-text-muted' : 'text-text'">
                    {{ ing.name }}
                  </p>
                  <p class="text-[10px] text-text-muted">{{ ing.measure }}</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        <!-- Footer progress -->
        <div v-if="!isLoading && groupedIngredients.length > 0" class="p-4 border-t border-border">
          <div class="flex items-center justify-between mb-2">
            <p class="text-xs font-bold text-text-muted">{{ checkedItems.size }} / {{ totalIngredients }} checked</p>
            <button v-if="checkedItems.size > 0" class="text-xs text-primary font-bold hover:underline" @click="checkedItems.clear()">
              Clear all
            </button>
          </div>
          <div class="h-2 bg-border rounded-full overflow-hidden">
            <div class="h-full bg-gradient-to-r from-primary to-[#ff8e53] rounded-full transition-all duration-500" :style="{ width: `${progressPercent}%` }" />
          </div>
        </div>

      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { usePlannerStore } from '../../stores/plannerStore'
import { getMealById } from '../../services/mealdb'
import type { MealDetail, DayOfWeek, MealSlot } from '../../types'
import { printGroceryList } from '../../utils/printGrocery'

defineEmits<{ close: [] }>()

const plannerStore = usePlannerStore()
const isLoading = ref(true)
const mealDetails = ref<MealDetail[]>([])
const checkedItems = ref(new Set<string>())

const days: DayOfWeek[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const slots: MealSlot[] = ['breakfast', 'lunch', 'dinner']

const groupedIngredients = computed(() =>
  mealDetails.value.map(meal => ({
    mealName: meal.name,
    thumb: meal.thumb,
    ingredients: meal.ingredients,
  }))
)

const totalMeals = computed(() => mealDetails.value.length)
const totalIngredients = computed(() =>
  groupedIngredients.value.reduce((acc, g) => acc + g.ingredients.length, 0)
)
const progressPercent = computed(() =>
  totalIngredients.value === 0 ? 0 : Math.round((checkedItems.value.size / totalIngredients.value) * 100)
)

function toggleCheck(mealName: string, ingName: string) {
  const key = `${mealName}-${ingName}`
  checkedItems.value.has(key) ? checkedItems.value.delete(key) : checkedItems.value.add(key)
}

function handlePrint() {
  printGroceryList(mealDetails.value)
}

onMounted(async () => {
  const mealIds = new Set<string>()
  for (const day of days) {
    for (const slot of slots) {
      const meal = plannerStore.plan[day][slot]
      if (meal) mealIds.add(meal.id)
    }
  }

  const results = await Promise.all(
    Array.from(mealIds).map(id => getMealById(id))
  )

  mealDetails.value = results.filter(Boolean) as MealDetail[]
  isLoading.value = false
})
</script>