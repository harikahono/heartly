<template>
  <nav class="bg-white border-b border-border sticky top-0 z-50">
    <div class="max-w-[1400px] mx-auto px-6 h-12 flex items-center justify-between">

      <span class="font-nunito text-lg font-black text-text tracking-tight">Heartly.</span>

      <div class="flex items-center gap-1">

        <!-- User chip -->
        <div class="flex items-center gap-2 px-2.5 py-1.5 rounded-lg">
          <span class="w-5 h-5 rounded-md bg-primary text-white flex items-center justify-center font-nunito font-black text-[10px]">
            {{ userInitial }}
          </span>
          <div class="hidden sm:block leading-none">
            <span class="text-xs font-bold text-text">{{ userStore.userName }}</span>
            <span v-if="userStore.dietary !== 'none'" class="block text-[10px] text-text-muted mt-0.5">
              {{ userStore.dietaryLabel }}
            </span>
          </div>
        </div>

        <div class="w-px h-4 bg-border mx-1" />

        <!-- Share -->
        <button
          class="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:bg-bg hover:text-text transition-all"
          :title="copied ? 'Copied!' : 'Share'"
          @click="handleShare"
        >
          <svg v-if="!copied" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/>
          </svg>
          <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </button>

        <!-- Grocery -->
        <button
          class="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:bg-bg hover:text-text transition-all"
          title="Grocery List"
          @click="$emit('toggleGrocery')"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
        </button>

        <!-- Reset -->
        <button
          class="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:bg-bg hover:text-text transition-all"
          title="Reset Plan"
          @click="showConfirm = true"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.5"/>
          </svg>
        </button>

        <div class="w-px h-4 bg-border mx-1" />

        <!-- Logout -->
        <button
          class="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:bg-bg hover:text-primary transition-all"
          title="Logout"
          @click="handleLogout"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
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