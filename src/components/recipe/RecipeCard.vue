<template>
  <div
    class="recipe-card group relative bg-white rounded-2xl border-2 border-border overflow-hidden cursor-grab active:cursor-grabbing hover:border-primary hover:shadow-[0_4px_20px_rgb(255_107_107/0.15)] hover:-translate-y-1 transition-all duration-200"
    draggable="true"
    @dragstart="handleDragStart"
    @dragend="handleDragEnd"
    @click="$emit('click', meal)"
  >
    <!-- Thumbnail -->
    <div class="relative h-24 overflow-hidden bg-border">
      <img
        :src="meal.thumb"
        :alt="meal.name"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        loading="lazy"
      />
      <!-- Drag hint overlay -->
      <div class="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-all flex items-center justify-center">
        <span class="opacity-0 group-hover:opacity-100 text-white text-xl transition-opacity drop-shadow-lg">
          ✋
        </span>
      </div>
    </div>

    <!-- Info -->
    <div class="p-3">
      <p class="font-nunito font-bold text-sm text-text leading-tight line-clamp-2 mb-1.5">
        {{ meal.name }}
      </p>
      <div class="flex items-center gap-1.5 flex-wrap">
        <span
          v-if="meal.category"
          class="px-2 py-0.5 bg-[#fff5f5] text-primary text-[10px] font-bold rounded-full border border-[#fecaca]"
        >
          {{ meal.category }}
        </span>
        <span
          v-if="meal.area"
          class="px-2 py-0.5 bg-[#fffbeb] text-[#d97706] text-[10px] font-bold rounded-full border border-[#fde68a]"
        >
          {{ meal.area }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Meal } from '../../types'
import { useDragStore } from '../../stores/dragStore'

const props = defineProps<{ meal: Meal }>()
defineEmits<{ click: [meal: Meal] }>()

const dragStore = useDragStore()

function handleDragStart(e: DragEvent) {
  dragStore.setDraggedMeal(props.meal)
  e.dataTransfer!.effectAllowed = 'move'
}

function handleDragEnd() {
  dragStore.clearDraggedMeal()
}
</script>