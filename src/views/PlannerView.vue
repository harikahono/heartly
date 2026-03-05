<template>
  <div class="h-screen bg-bg font-sans flex flex-col overflow-hidden">
    <Navbar @toggle-grocery="showGrocery = !showGrocery" />

    <div class="flex-1 w-full max-w-[1400px] mx-auto p-6 lg:p-8 flex flex-col lg:flex-row gap-6 min-h-0 overflow-hidden">

      <!-- Sidebar — fixed, internal scroll -->
      <aside class="w-full lg:w-[300px] flex-shrink-0 flex flex-col min-h-0">
        <RecipeSearch />
      </aside>

      <!-- Main content — scrollable sendiri -->
      <main class="flex-1 min-w-0 flex flex-col min-h-0 overflow-y-auto pr-1">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h2 class="font-nunito text-[28px] font-black text-text tracking-[-0.5px]">Your Week</h2>
            <p class="text-sm text-text-soft mt-1">{{ totalMeals }} / 21 meals planned</p>
          </div>
          <button
            class="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-accent to-primary text-white font-nunito font-bold text-sm tracking-wide shadow-[var(--shadow-pop)] hover:shadow-[var(--shadow-hover)] hover:-translate-y-0.5 active:scale-[0.97] disabled:opacity-60 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            :disabled="plannerStore.isGenerating"
            @click="plannerStore.autoGenerate()"
          >
            <span>{{ plannerStore.isGenerating ? 'Generating...' : 'Auto Generate' }}</span>
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