<template>
  <div class="h-screen bg-bg font-sans flex flex-col overflow-hidden">
    <Navbar @toggle-grocery="showGrocery = !showGrocery" />

    <div class="flex-1 w-full max-w-[1400px] mx-auto p-6 lg:p-8 flex flex-col lg:flex-row gap-6 min-h-0 overflow-hidden">

      <!-- Sidebar -->
      <aside class="w-full lg:w-[300px] flex-shrink-0 flex flex-col min-h-0">
        <RecipeSearch />
      </aside>

      <!-- Main -->
      <main class="flex-1 min-w-0 flex flex-col min-h-0 overflow-y-auto pr-1">

        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 class="font-nunito text-2xl font-black text-text tracking-tight">Your Week</h2>
            <div class="flex items-center gap-2 mt-1">
              <div class="h-1.5 w-32 bg-border rounded-full overflow-hidden">
                <div
                  class="h-full bg-primary rounded-full transition-all duration-500"
                  :style="{ width: `${(totalMeals / 21) * 100}%` }"
                />
              </div>
              <span class="text-xs text-text-muted font-medium">{{ totalMeals }} / 21</span>
            </div>
          </div>

          <button
            class="relative px-6 py-2.5 rounded-xl bg-primary text-white font-nunito font-black text-sm tracking-wide transition-all hover:-translate-y-0.5 hover:bg-[#e55a5a] active:scale-[0.97] active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
            :disabled="plannerStore.isGenerating"
            @click="plannerStore.autoGenerate()"
          >
            <span v-if="plannerStore.isGenerating" class="flex items-center gap-2">
              <span class="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              Generating...
            </span>
            <span v-else>Auto Generate</span>
          </button>
        </div>

        <WeekGrid />
      </main>
    </div>

    <GroceryList v-if="showGrocery" @close="showGrocery = false" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { usePlannerStore } from '../stores/plannerStore'
import Navbar from '../components/layout/Navbar.vue'
import RecipeSearch from '../components/recipe/RecipeSearch.vue'
import WeekGrid from '../components/planner/WeekGrid.vue'
import GroceryList from '../components/grocery/GroceryList.vue'

const plannerStore = usePlannerStore()
const showGrocery = ref(false)
const totalMeals = computed(() => plannerStore.totalMeals)
</script>