<template>
  <nav class="bg-white border-b border-border sticky top-0 z-50">
    <div class="max-w-[1400px] mx-auto px-6 h-14 flex items-center justify-between">

      <!-- Logo -->
      <span class="font-nunito text-xl font-black text-primary tracking-tight">Heartly.</span>

      <!-- Right -->
      <div class="flex items-center gap-2">

        <!-- User chip -->
        <div class="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-bg border border-border">
          <span class="w-6 h-6 rounded-lg bg-primary text-white flex items-center justify-center font-nunito font-black text-xs flex-shrink-0">
            {{ userInitial }}
          </span>
          <div class="hidden sm:block leading-none">
            <p class="font-nunito font-bold text-xs text-text">{{ userStore.userName }}</p>
            <p class="text-[10px] text-text-muted mt-0.5">{{ userStore.dietaryLabel }}</p>
          </div>
        </div>

        <!-- Divider -->
        <div class="w-px h-5 bg-border mx-1" />

        <!-- Actions -->
        <button
          class="px-4 py-1.5 rounded-xl text-xs font-nunito font-bold text-text-muted border border-transparent hover:border-border hover:bg-bg hover:text-text transition-all"
          @click="handleShare"
        >
          {{ copied ? 'Copied!' : 'Share' }}
        </button>

        <button
          class="px-4 py-1.5 rounded-xl text-xs font-nunito font-bold text-text-muted border border-transparent hover:border-border hover:bg-bg hover:text-text transition-all"
          @click="$emit('toggleGrocery')"
        >
          Grocery
        </button>

        <button
          class="px-4 py-1.5 rounded-xl text-xs font-nunito font-bold text-text-muted border border-transparent hover:border-border hover:bg-bg hover:text-text transition-all"
          @click="showConfirm = true"
        >
          Reset
        </button>

        <!-- Divider -->
        <div class="w-px h-5 bg-border mx-1" />

        <!-- Logout -->
        <button
          class="text-xs font-nunito font-bold text-text-muted hover:text-red-500 transition-colors px-2 py-1.5"
          @click="handleLogout"
        >
          Logout
        </button>
      </div>
    </div>
  </nav>

  <!-- Confirm Reset Modal -->
  <Teleport to="body">
    <div
      v-if="showConfirm"
      class="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      @click.self="showConfirm = false"
    >
      <div class="bg-white rounded-2xl w-full max-w-sm shadow-xl animate-[slideUp_0.25s_ease_both] overflow-hidden">
        <div class="h-1 bg-primary w-full" />
        <div class="p-7 flex flex-col gap-4">
          <div>
            <h3 class="font-nunito font-black text-lg text-text">Reset your plan?</h3>
            <p class="text-sm text-text-muted mt-1 leading-relaxed">All meals will be cleared. Your profile and preferences stay saved.</p>
          </div>
          <div class="flex gap-2 pt-1">
            <button
              class="flex-1 py-2.5 rounded-xl border border-border font-nunito font-bold text-sm text-text-muted hover:bg-bg transition-all"
              @click="showConfirm = false"
            >
              Cancel
            </button>
            <button
              class="flex-1 py-2.5 rounded-xl bg-primary font-nunito font-bold text-sm text-white hover:bg-[#e55a5a] transition-all"
              @click="handleReset"
            >
              Yes, reset
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useUserStore } from '../../stores/userStore'
import { usePlannerStore } from '../../stores/plannerStore'
import { encodePlanToUrl } from '../../utils/shareUrl'

defineEmits<{ toggleGrocery: [] }>()

const userStore = useUserStore()
const plannerStore = usePlannerStore()
const copied = ref(false)
const showConfirm = ref(false)

const userInitial = computed(() => userStore.userName.charAt(0).toUpperCase())

function handleShare() {
  const url = encodePlanToUrl(plannerStore.plan)
  navigator.clipboard.writeText(url).then(() => {
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  })
}

function handleReset() {
  plannerStore.clearPlan()
  showConfirm.value = false
}

function handleLogout() {
  userStore.logout()
  plannerStore.clearPlan()
}
</script>