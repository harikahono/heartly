<template>
  <Teleport to="body">
    <div class="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" @click.self="$emit('close')">
      <div class="modal-card bg-white rounded-3xl w-full max-w-lg max-h-[85vh] overflow-hidden flex flex-col shadow-2xl animate-[slideUp_0.3s_cubic-bezier(0.34,1.56,0.64,1)_both]">

        <!-- Loading state -->
        <div v-if="isLoading" class="flex flex-col items-center justify-center py-20 gap-4">
          <span class="text-5xl animate-spin">🍳</span>
          <p class="font-nunito font-bold text-text-muted">Loading recipe...</p>
        </div>

        <!-- Error state -->
        <div v-else-if="!meal" class="flex flex-col items-center justify-center py-20 gap-4">
          <span class="text-5xl">😅</span>
          <p class="font-nunito font-bold text-text">Failed to load recipe</p>
          <button class="px-6 py-2 bg-primary text-white rounded-2xl font-nunito font-bold text-sm" @click="$emit('close')">Close</button>
        </div>

        <!-- Content -->
        <template v-else>
          <!-- Hero image -->
          <div class="relative h-52 flex-shrink-0 overflow-hidden">
            <img :src="meal.thumb" :alt="meal.name" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <button class="absolute top-3 right-3 w-9 h-9 bg-white/20 backdrop-blur-sm hover:bg-white/40 rounded-full text-white font-bold flex items-center justify-center transition-all" @click="$emit('close')">✕</button>
            <div class="absolute bottom-4 left-4 right-12">
              <h2 class="font-nunito font-black text-white text-xl leading-tight drop-shadow-lg">{{ meal.name }}</h2>
              <div class="flex gap-1.5 mt-2 flex-wrap">
                <span v-if="meal.category" class="px-2.5 py-0.5 bg-white/20 backdrop-blur-sm text-white text-[10px] font-bold rounded-full">{{ meal.category }}</span>
                <span v-if="meal.area" class="px-2.5 py-0.5 bg-white/20 backdrop-blur-sm text-white text-[10px] font-bold rounded-full">{{ meal.area }}</span>
                <span v-for="tag in meal.tags?.slice(0, 2)" :key="tag" class="px-2.5 py-0.5 bg-white/20 backdrop-blur-sm text-white text-[10px] font-bold rounded-full">{{ tag }}</span>
              </div>
            </div>
          </div>

          <!-- Scrollable body -->
          <div class="overflow-y-auto flex-1 p-5 flex flex-col gap-5">

            <!-- Ingredients -->
            <div>
              <h3 class="font-nunito font-black text-text text-base mb-3 flex items-center gap-2">
                Ingredients
                <span class="px-2 py-0.5 bg-[#fff5f5] text-primary text-xs font-bold rounded-full">{{ meal.ingredients.length }}</span>
              </h3>
              <div class="grid grid-cols-2 gap-2">
                <div v-for="ing in meal.ingredients" :key="ing.name" class="flex items-start gap-2 p-2.5 bg-[#fafafa] rounded-xl border border-border">
                  <span class="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  <div class="min-w-0">
                    <p class="text-[11px] font-bold text-text truncate">{{ ing.name }}</p>
                    <p class="text-[10px] text-text-muted">{{ ing.measure }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Instructions -->
            <div>
              <h3 class="font-nunito font-black text-text text-base mb-3">Instructions</h3>
              <div class="space-y-2">
                <p v-for="(step, i) in instructionSteps" :key="i" class="flex gap-3 text-sm text-text leading-relaxed">
                  <span class="w-5 h-5 rounded-full bg-primary text-white text-[10px] font-black flex items-center justify-center flex-shrink-0 mt-0.5">{{ i + 1 }}</span>
                  {{ step }}
                </p>
              </div>
            </div>

            <!-- Links -->
            <div class="flex gap-3 pb-1">
              <a v-if="meal.youtubeUrl" :href="meal.youtubeUrl" target="_blank" class="flex-1 flex items-center justify-center py-3 bg-[#fee2e2] text-[#dc2626] rounded-2xl font-nunito font-bold text-sm hover:bg-[#fecaca] transition-colors">Watch on YouTube</a>
              <a v-if="meal.sourceUrl" :href="meal.sourceUrl" target="_blank" class="flex-1 flex items-center justify-center py-3 bg-[#f0fdf4] text-[#16a34a] rounded-2xl font-nunito font-bold text-sm hover:bg-[#dcfce7] transition-colors">Original Recipe</a>
            </div>

          </div>
        </template>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { MealDetail } from '../../types'
import { getMealById } from '../../services/mealdb'

const props = defineProps<{ mealId: string }>()
defineEmits<{ close: [] }>()

const meal = ref<MealDetail | null>(null)
const isLoading = ref(true)

const instructionSteps = computed(() => {
  if (!meal.value?.instructions) return []
  return meal.value.instructions
    .split(/\r?\n/)
    .map(s => s.trim())
    .filter(s => s.length > 10)
})

onMounted(async () => {
  meal.value = await getMealById(props.mealId)
  isLoading.value = false
})
</script>