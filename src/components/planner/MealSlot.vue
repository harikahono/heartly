<template>
  <div
    class="meal-slot relative rounded-xl border transition-all duration-200 overflow-hidden"
    :class="slotClasses"
    @dragover.prevent="handleDragOver"
    @dragleave="handleDragLeave"
    @drop="handleDrop"
  >
    <!-- Filled state -->
    <div
      v-if="meal"
      class="group flex flex-col h-full"
      draggable="true"
      @dragstart="handleSlotDragStart"
      @dragend="handleDragEnd"
    >
      <!-- Thumbnail -->
      <div class="relative overflow-hidden" style="height: 72px;">
        <img :src="meal.thumb" :alt="meal.name" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

        <!-- Remove -->
        <button
          class="absolute top-1.5 right-1.5 w-5 h-5 bg-white/20 backdrop-blur-sm hover:bg-red-500 rounded-md text-white text-[9px] font-black flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
          @click.stop="handleRemove"
        >
          ✕
        </button>

        <!-- Slot label -->
        <span class="absolute bottom-1.5 left-2 text-white text-[9px] font-bold uppercase tracking-wider opacity-80">
          {{ label }}
        </span>
      </div>

      <!-- Meal name -->
      <div
        class="px-2.5 py-2 flex-1 cursor-pointer hover:bg-[#fafafa] transition-colors"
        @click="handleOpenDetail"
      >
        <p class="font-nunito font-bold text-[11px] text-text leading-tight line-clamp-2">
          {{ meal.name }}
        </p>
      </div>
    </div>

    <!-- Empty state -->
    <div
      v-else
      class="flex flex-col items-center justify-center gap-1 p-3 h-full min-h-[110px]"
    >
      <p class="text-[10px] font-bold text-text-muted uppercase tracking-wider">{{ label }}</p>
      <p class="text-[9px] text-border font-medium">drop here</p>
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
  if (isDragOver.value) return 'border-primary bg-[#fff5f5] scale-[1.02] shadow-[0_4px_16px_rgb(255_107_107/0.15)]'
  if (meal.value) return 'border-border bg-white cursor-grab hover:border-text-muted'
  return 'border-dashed border-border bg-white hover:border-text-muted min-h-[110px]'
})

function handleDragOver() {
  clearTimeout(dragLeaveTimer)
  isDragOver.value = true
}

function handleDragLeave() {
  dragLeaveTimer = setTimeout(() => { isDragOver.value = false }, 50)
}

function handleDrop() {
  clearTimeout(dragLeaveTimer)
  isDragOver.value = false
  if (!dragStore.draggedMeal) return
  plannerStore.setMeal(props.day, props.slotType, dragStore.draggedMeal)
  dragStore.clearDraggedMeal()
}

function handleSlotDragStart(e: DragEvent) {
  if (!meal.value) return
  dragStore.setDraggedMeal(meal.value)
  e.dataTransfer!.effectAllowed = 'move'
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