<template>
  <div
    class="group flex gap-3 p-2.5 rounded-xl border border-border bg-white hover:border-text-muted cursor-grab active:cursor-grabbing transition-all duration-150"
    draggable="true"
    @dragstart="handleDragStart"
    @dragend="handleDragEnd"
  >
    <!-- Thumbnail -->
    <div class="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-border">
      <img
        :src="meal.thumb"
        :alt="meal.name"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        loading="lazy"
      />
    </div>

    <!-- Info -->
    <div class="flex flex-col justify-center min-w-0 gap-1">
      <p class="font-nunito font-bold text-xs text-text leading-tight line-clamp-2">
        {{ meal.name }}
      </p>
      <p class="text-[10px] text-text-muted">
        {{ [meal.category, meal.area].filter(Boolean).join(' · ') }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Meal } from '../../types'
import { useDragStore } from '../../stores/dragStore'

const props = defineProps<{ meal: Meal }>()
const dragStore = useDragStore()

function handleDragStart(e: DragEvent) {
  dragStore.setDraggedMeal(props.meal)
  e.dataTransfer!.effectAllowed = 'move'
}

function handleDragEnd() {
  dragStore.clearDraggedMeal()
}
</script>