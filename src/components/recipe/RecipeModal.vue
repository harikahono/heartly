<template>
  <Teleport to="body">
    <div class="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4" @click.self="$emit('close')">
      <div class="bg-white rounded-2xl w-full max-w-lg max-h-[88vh] overflow-hidden flex flex-col shadow-2xl animate-[slideUp_0.25s_ease_both]">

        <!-- Loading -->
        <div v-if="isLoading" class="flex flex-col items-center justify-center py-20 gap-3">
          <div class="w-8 h-8 border-2 border-border border-t-primary rounded-full animate-spin" />
          <p class="text-xs font-bold text-text-muted">Loading recipe...</p>
        </div>

        <!-- Error -->
        <div v-else-if="!meal" class="flex flex-col items-center justify-center py-20 gap-4">
          <p class="font-nunito font-black text-text">Failed to load</p>
          <button class="px-5 py-2 bg-primary text-white rounded-xl font-nunito font-bold text-sm" @click="$emit('close')">Close</button>
        </div>

        <!-- Content -->
        <template v-else>

          <!-- Hero -->
          <div class="relative flex-shrink-0 overflow-hidden" style="height: 200px;">
            <img :src="meal.thumb" :alt="meal.name" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <button class="absolute top-3 right-3 w-7 h-7 bg-black/30 backdrop-blur-sm hover:bg-black/50 rounded-lg text-white text-xs font-black flex items-center justify-center transition-all" @click="$emit('close')">✕</button>
            <div class="absolute bottom-0 left-0 right-0 p-4">
              <div class="flex items-end justify-between gap-3">
                <h2 class="font-nunito font-black text-white text-lg leading-tight">{{ meal.name }}</h2>
                <div class="flex gap-1.5 flex-shrink-0 flex-wrap justify-end">
                  <span v-if="meal.category" class="px-2 py-0.5 bg-primary text-white text-[9px] font-black uppercase tracking-wider rounded-md">{{ meal.category }}</span>
                  <span v-if="meal.area" class="px-2 py-0.5 bg-white/20 backdrop-blur-sm text-white text-[9px] font-black uppercase tracking-wider rounded-md">{{ meal.area }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Body -->
          <div class="overflow-y-auto flex-1 flex flex-col">

            <!-- Ingredients -->
            <div class="p-5 border-b border-border">
              <div class="flex items-center justify-between mb-3">
                <h3 class="font-nunito font-black text-sm text-text uppercase tracking-wider">Ingredients</h3>
                <span class="text-[10px] font-bold text-text-muted">{{ meal.ingredients.length }} items</span>
              </div>
              <div class="grid grid-cols-2 gap-1.5">
                <div v-for="ing in meal.ingredients" :key="ing.name" class="flex items-center gap-2 px-3 py-2 bg-bg rounded-lg border border-border">
                  <div class="w-1 h-1 rounded-full bg-primary flex-shrink-0" />
                  <div class="min-w-0">
                    <p class="text-[11px] font-bold text-text truncate">{{ ing.name }}</p>
                    <p class="text-[10px] text-text-muted">{{ ing.measure }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Instructions -->
            <div class="p-5 border-b border-border">
              <h3 class="font-nunito font-black text-sm text-text uppercase tracking-wider mb-3">Instructions</h3>
              <div class="flex flex-col gap-3">
                <div v-for="(step, i) in instructionSteps" :key="i" class="flex gap-3">
                  <span class="w-5 h-5 rounded-md bg-text text-white text-[9px] font-black flex items-center justify-center flex-shrink-0 mt-0.5">{{ i + 1 }}</span>
                  <p class="text-xs text-text leading-relaxed">{{ step }}</p>
                </div>
              </div>
            </div>

            <!-- Links -->
            <div v-if="meal.youtubeUrl || meal.sourceUrl" class="p-4 flex gap-2">
              <a v-if="meal.youtubeUrl" :href="meal.youtubeUrl" target="_blank" class="flex-1 py-2.5 text-center rounded-xl border border-border text-xs font-nunito font-bold text-text-muted hover:border-text-muted hover:text-text transition-all">Watch on YouTube</a>
              <a v-if="meal.sourceUrl" :href="meal.sourceUrl" target="_blank" class="flex-1 py-2.5 text-center rounded-xl bg-primary text-white text-xs font-nunito font-bold hover:bg-[#e55a5a] transition-all">Original Recipe</a>
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