<template>
  <div>
    <OnboardingView v-if="!userStore.isLoggedIn" />
    <PlannerView v-else />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useUserStore } from './stores/userStore'
import { usePlannerStore } from './stores/plannerStore'
import OnboardingView from './views/OnboardingView.vue'
import PlannerView from './views/PlannerView.vue'

const userStore = useUserStore()
const plannerStore = usePlannerStore()

// Cek URL shared plan waktu app pertama dibuka
onMounted(() => {
  plannerStore.loadSharedPlan()
})
</script>