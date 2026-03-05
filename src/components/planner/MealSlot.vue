<template>
  <div
    class="meal-slot relative rounded-2xl border-2 transition-all duration-200 overflow-hidden min-h-[120px]"
    :class="slotClasses"
    @dragover.prevent="handleDragOver"
    @dragleave="handleDragLeave"
    @drop="handleDrop"
  >
    <!-- Filled state -->
    <div
      v-if="meal"
      class="filled h-full flex flex-col group"
      draggable="true"
      @dragstart="handleSlotDragStart"
      @dragend="handleDragEnd"
    >
      <div class="relative h-16 overflow-hidden">
        <img :src="meal.thumb" :alt="meal.name" class="w-full h-full object-cover" />
        <button
          class="absolute top-1 right-1 w-5 h-5 bg-black/50 hover:bg-red-500 rounded-full text-white text-[10px] flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
          @click.stop="handleRemove"
        >
          ✕
        </button>
        <span class="absolute bottom-1 left-1 px-1.5 py-0.5 bg-black/40 text-white text-[9px] font-bold rounded-full backdrop-blur-sm">
          {{ emoji }} {{ label }}
        </span>
      </div>
      <div class="p-2 flex-1 cursor-pointer hover:bg-primary/5 transition-colors" @click="handleOpenDetail">
        <p class="font-nunito font-bold text-[11px] text-text leading-tight line-clamp-2">{{ meal.name }}</p>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else class="empty h-full flex flex-col items-center justify-center gap-1 p-3 min-h-[120px]">
      <span class="text-xl opacity-40">{{ emoji }}</span>
      <p class="text-[10px] font-bold text-text-muted text-center opacity-60">{{ label }}</p>
      <p class="text-[9px] text-text-muted opacity-40 text-center">Drop here</p>
    </div>
  </div>

  <RecipeModal v-if="showModal" :meal-id="meal!.id" @close="showModal = false" />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { DayOfWeek, MealSlot, Meal } from '../../types'
import { usePlannerStore } from '../../stores/plannerStore'
import { useDragStore } from '../../stores/dragStore'
import RecipeModal from '../recipe/RecipeModal.vue'

const props = defineProps<{
  day: DayOfWeek
  slotType: MealSlot
  label: string
  emoji: string
}>()

const plannerStore = usePlannerStore()
const dragStore = useDragStore()

const isDragOver = ref(false)
const showModal = ref(false)
let dragLeaveTimer: ReturnType<typeof setTimeout>

const meal = computed<Meal | undefined>(
  () => plannerStore.plan[props.day][props.slotType]
)

const slotClasses = computed(() => {
  if (isDragOver.value) return 'border-primary bg-[#fff5f5] scale-[1.02] shadow-[0_4px_20px_rgb(255_107_107/0.2)]'
  if (meal.value) return 'border-border bg-white hover:border-primary/50'
  return 'border-dashed border-border bg-white/60 hover:border-primary/40 hover:bg-[#fff5f5]/50'
})

function handleDragOver() {
  // Cancel pending dragleave biar ga flicker
  clearTimeout(dragLeaveTimer)
  isDragOver.value = true
}

function handleDragLeave() {
  // Delay dragleave biar child element ga trigger false negative
  dragLeaveTimer = setTimeout(() => {
    isDragOver.value = false
  }, 50)
}

function handleDrop() {
  clearTimeout(dragLeaveTimer)
  isDragOver.value = false
  if (!dragStore.draggedMeal) return
  plannerStore.setMeal(props.day, props.slotType, dragStore.draggedMeal)
  dragStore.clearDraggedMeal()
}

// Drag dari slot ke slot lain
function handleSlotDragStart(e: DragEvent) {
  if (!meal.value) return
  dragStore.setDraggedMeal(meal.value)
  e.dataTransfer!.effectAllowed = 'move'
  // Hapus dari slot asal setelah drop
  dragStore.setSourceSlot(props.day, props.slotType)
}

function handleDragEnd() {
  dragStore.clearDraggedMeal()
  dragStore.clearSourceSlot()
}

function handleRemove() {
  plannerStore.removeMeal(props.day, props.slotType)
}

function handleOpenDetail() {
  if (meal.value) showModal.value = true
}
</script>