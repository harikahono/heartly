<template>
  <div class="search-root flex flex-col gap-4 h-full">

    <!-- Search box -->
    <div class="search-box relative">
      <span class="absolute left-4 top-1/2 -translate-y-1/2 text-lg pointer-events-none">🔍</span>
      <input
        v-model="query"
        type="text"
        class="w-full pl-11 pr-4 py-3.5 bg-white border-2 border-border rounded-2xl text-sm font-medium placeholder:text-text-muted focus:border-primary focus:shadow-[0_0_0_4px_rgb(255_107_107/0.1)] outline-none transition-all"
        placeholder="Search recipe... (e.g. Pasta)"
        @input="handleSearch"
      />
      <span v-if="isLoading" class="absolute right-4 top-1/2 -translate-y-1/2 text-sm animate-spin">⏳</span>
    </div>

    <!-- Filter chips -->
    <div class="filter-chips flex flex-wrap gap-2">
      <button
        v-for="cat in categories"
        :key="cat.value"
        class="chip px-3 py-1.5 rounded-full border-2 text-xs font-nunito font-bold transition-all"
        :class="selectedCategory === cat.value
          ? 'border-primary bg-[#fff5f5] text-primary'
          : 'border-border bg-white text-text-muted hover:border-accent hover:bg-[#fffbeb]'"
        @click="selectCategory(cat.value)"
      >
        {{ cat.emoji }} {{ cat.label }}
      </button>
    </div>

    <!-- Results area — fixed height, no overflow bleed -->
    <div class="flex flex-col flex-1 min-h-0">

      <!-- Empty state -->
      <div v-if="!isLoading && results.length === 0 && query.length === 0"
        class="flex flex-col items-center justify-center py-12 gap-3 text-center flex-1">
        <span class="text-5xl">🍽️</span>
        <p class="font-nunito font-bold text-text text-sm">Search for a recipe</p>
        <p class="text-text-muted text-xs">Type above or pick a category</p>
      </div>

      <!-- No results -->
      <div v-else-if="!isLoading && results.length === 0 && query.length > 0"
        class="flex flex-col items-center justify-center py-12 gap-3 text-center flex-1">
        <span class="text-5xl">😅</span>
        <p class="font-nunito font-bold text-text text-sm">No results found</p>
        <p class="text-text-muted text-xs">Try a different keyword</p>
      </div>

      <!-- Recipe cards — fixed scroll area -->
      <div v-else class="flex flex-col gap-3 overflow-y-auto pr-1" style="max-height: 420px;">
        <RecipeCard
          v-for="meal in paginated"
          :key="meal.id"
          :meal="meal"
        />
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex items-center justify-center gap-1.5 pt-3 flex-wrap">
        <!-- Prev -->
        <button
          class="w-7 h-7 rounded-xl border-2 border-border text-text-muted text-xs font-bold hover:border-primary hover:text-primary transition-all disabled:opacity-30"
          :disabled="currentPage === 1"
          @click="goTo(currentPage - 1)"
        >
          &lt;
        </button>

        <!-- Page numbers -->
        <button
          v-for="page in pages"
          :key="page"
          class="w-7 h-7 rounded-xl border-2 text-xs font-nunito font-bold transition-all"
          :class="currentPage === page
            ? 'border-primary bg-primary text-white'
            : 'border-border text-text-muted hover:border-primary hover:text-primary'"
          @click="goTo(page)"
        >
          {{ page }}
        </button>

        <!-- Next -->
        <button
          class="w-7 h-7 rounded-xl border-2 border-border text-text-muted text-xs font-bold hover:border-primary hover:text-primary transition-all disabled:opacity-30"
          :disabled="currentPage === totalPages"
          @click="goTo(currentPage + 1)"
        >
          &gt;
        </button>
      </div>

      <!-- Result count -->
      <p v-if="results.length > 0" class="text-center text-[10px] text-text-muted mt-1">
        {{ results.length }} results · page {{ currentPage }} of {{ totalPages }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { searchMeals } from '../../services/mealdb'
import { filterSafeMeals } from '../../utils/allergy'
import { useUserStore } from '../../stores/userStore'
import { usePagination } from '../../composables/usePagination'
import type { Meal } from '../../types'
import RecipeCard from './RecipeCard.vue'

const userStore = useUserStore()

const query = ref('')
const results = ref<Meal[]>([])
const isLoading = ref(false)
const selectedCategory = ref<string | null>(null)

const { currentPage, totalPages, paginated, pages, goTo, reset } = usePagination(() => results.value, 5)

// Reset ke page 1 tiap kali results berubah
watch(results, () => reset())

const categories = [
  { value: 'Chicken',    label: 'Chicken',  emoji: '🍗' },
  { value: 'Seafood',    label: 'Seafood',  emoji: '🦐' },
  { value: 'Pasta',      label: 'Pasta',    emoji: '🍝' },
  { value: 'Dessert',    label: 'Dessert',  emoji: '🍰' },
  { value: 'Vegetarian', label: 'Veggie',   emoji: '🥦' },
  { value: 'Beef',       label: 'Beef',     emoji: '🥩' },
]

let debounceTimer: ReturnType<typeof setTimeout>

function handleSearch() {
  selectedCategory.value = null
  clearTimeout(debounceTimer)

  if (!query.value.trim()) {
    results.value = []
    return
  }

  isLoading.value = true
  debounceTimer = setTimeout(async () => {
    const raw = await searchMeals(query.value.trim())
    results.value = filterSafeMeals(raw, userStore.dietary)
    isLoading.value = false
  }, 500)
}

async function selectCategory(category: string) {
  if (selectedCategory.value === category) {
    selectedCategory.value = null
    results.value = []
    query.value = ''
    return
  }

  selectedCategory.value = category
  query.value = ''
  isLoading.value = true

  const raw = await searchMeals(category)
  results.value = filterSafeMeals(raw, userStore.dietary)
  isLoading.value = false
}
</script>