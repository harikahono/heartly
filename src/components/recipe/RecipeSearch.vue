<template>
  <div class="flex flex-col gap-3 h-full">

    <!-- Search input -->
    <div class="relative">
      <input
        v-model="query"
        type="text"
        class="w-full px-4 py-3 bg-white border border-border rounded-xl text-sm placeholder:text-text-muted focus:border-text-muted focus:outline-none transition-all"
        placeholder="Search recipes..."
        @input="handleSearch"
      />
      <div v-if="isLoading" class="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 border-2 border-border border-t-primary rounded-full animate-spin" />
    </div>

    <!-- Category filters -->
    <div class="flex flex-wrap gap-1.5">
      <button
        v-for="cat in categories"
        :key="cat.value"
        class="px-3 py-1 rounded-lg text-[11px] font-nunito font-bold border transition-all"
        :class="selectedCategory === cat.value
          ? 'border-text bg-text text-white'
          : 'border-border text-text-muted hover:border-text-muted hover:text-text bg-white'"
        @click="selectCategory(cat.value)"
      >
        {{ cat.label }}
      </button>
    </div>

    <!-- Results -->
    <div class="flex flex-col flex-1 min-h-0">

      <!-- Empty -->
      <div v-if="!isLoading && results.length === 0 && !query && !selectedCategory"
        class="flex-1 flex flex-col items-center justify-center gap-2 text-center py-8">
        <p class="text-xs font-bold text-text-muted">Search or pick a category</p>
        <p class="text-[10px] text-border">Drag any recipe to your plan</p>
      </div>

      <!-- No results -->
      <div v-else-if="!isLoading && results.length === 0"
        class="flex-1 flex flex-col items-center justify-center gap-2 text-center py-8">
        <p class="text-xs font-bold text-text-muted">No results found</p>
        <p class="text-[10px] text-border">Try a different keyword</p>
      </div>

      <!-- Cards -->
      <div v-else class="flex flex-col gap-2 overflow-y-auto" style="max-height: 420px;">
        <RecipeCard
          v-for="meal in paginated"
          :key="meal.id"
          :meal="meal"
        />
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex items-center justify-center gap-1 pt-3">
        <button
          class="w-6 h-6 rounded-lg border border-border text-text-muted text-xs font-bold hover:border-text-muted transition-all disabled:opacity-30"
          :disabled="currentPage === 1"
          @click="goTo(currentPage - 1)"
        >
          &lt;
        </button>
        <button
          v-for="page in pages"
          :key="page"
          class="w-6 h-6 rounded-lg border text-[11px] font-nunito font-bold transition-all"
          :class="currentPage === page
            ? 'border-text bg-text text-white'
            : 'border-border text-text-muted hover:border-text-muted'"
          @click="goTo(page)"
        >
          {{ page }}
        </button>
        <button
          class="w-6 h-6 rounded-lg border border-border text-text-muted text-xs font-bold hover:border-text-muted transition-all disabled:opacity-30"
          :disabled="currentPage === totalPages"
          @click="goTo(currentPage + 1)"
        >
          &gt;
        </button>
      </div>

      <!-- Count -->
      <p v-if="results.length > 0" class="text-center text-[10px] text-border mt-1.5">
        {{ results.length }} results · {{ currentPage }} / {{ totalPages }}
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
watch(results, () => reset())

const categories = [
  { value: 'Chicken',    label: 'Chicken'  },
  { value: 'Seafood',    label: 'Seafood'  },
  { value: 'Pasta',      label: 'Pasta'    },
  { value: 'Dessert',    label: 'Dessert'  },
  { value: 'Vegetarian', label: 'Veggie'   },
  { value: 'Beef',       label: 'Beef'     },
]

let debounceTimer: ReturnType<typeof setTimeout>

function handleSearch() {
  selectedCategory.value = null
  clearTimeout(debounceTimer)
  if (!query.value.trim()) { results.value = []; return }
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