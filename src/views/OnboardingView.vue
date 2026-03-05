<template>
  <div class="h-screen bg-white flex overflow-hidden font-sans">

    <!-- LEFT PANEL — Bold brand statement -->
    <div class="hidden lg:flex w-[45%] bg-primary flex-col justify-between p-12 relative overflow-hidden flex-shrink-0">

      <!-- Grid texture background -->
      <div 
        class="absolute inset-0 opacity-10" 
        style="background-image: repeating-linear-gradient(0deg, white 0px, white 1px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, white 0px, white 1px, transparent 1px, transparent 40px);"
      ></div>

      <!-- Top logo -->
      <div class="relative z-10">
        <span class="font-nunito text-white text-2xl font-black tracking-tight">Heartly.</span>
      </div>

      <!-- Center statement -->
      <div class="relative z-10">
        <p class="text-white/50 text-sm font-semibold tracking-[0.2em] uppercase mb-6">Weekly Meal Planner</p>
        <h2 class="font-nunito text-white font-black leading-[1.05] tracking-tight text-[clamp(2.8rem,5vw,4.2rem)]">
          Eat well.<br>
          Plan once.<br>
          <span class="text-accent">Live fully.</span>
        </h2>
        <p class="text-white/60 mt-6 text-base leading-relaxed max-w-xs">
          Smart meal planning with allergy-aware suggestions. Your week, beautifully organized.
        </p>
      </div>

      <!-- Bottom stats -->
      <div class="relative z-10 flex gap-8">
        <div>
          <p class="font-nunito font-black text-white text-2xl">21</p>
          <p class="text-white/50 text-xs mt-0.5">Meal slots</p>
        </div>
        <div>
          <p class="font-nunito font-black text-white text-2xl">8</p>
          <p class="text-white/50 text-xs mt-0.5">Diet types</p>
        </div>
        <div>
          <p class="font-nunito font-black text-white text-2xl">Free</p>
          <p class="text-white/50 text-xs mt-0.5">Always</p>
        </div>
      </div>
    </div>

    <!-- RIGHT PANEL — Form -->
    <div class="flex-1 flex flex-col justify-center px-8 sm:px-12 lg:px-16 overflow-y-auto bg-bg">

      <!-- Mobile logo -->
      <div class="lg:hidden mb-10">
        <span class="font-nunito text-primary text-2xl font-black tracking-tight">Heartly.</span>
      </div>

      <!-- Form header -->
      <div class="mb-10 animate-[slideUp_0.4s_ease_both]">
        <h1 class="font-nunito font-black text-text tracking-tight mb-2 text-[clamp(1.8rem,3vw,2.4rem)]">
          Let's get you set up
        </h1>
        <p class="text-text-muted text-base">Takes less than 30 seconds.</p>
      </div>

      <div class="flex flex-col gap-7 max-w-md animate-[slideUp_0.5s_ease_both]">

        <!-- Name input -->
        <div>
          <label class="font-nunito font-bold text-sm text-text block mb-2.5">
            Your first name
          </label>
          <input
            v-model="name"
            type="text"
            class="w-full px-5 py-4 bg-surface border-2 border-border rounded-2xl text-base font-medium placeholder:text-text-muted focus:border-primary focus:shadow-[0_0_0_4px_rgb(255_107_107/0.1)] outline-none transition-all"
            placeholder="e.g. Bintang"
            @keyup.enter="handleSubmit"
          />
        </div>

        <!-- Dietary preference -->
        <div>
          <label class="font-nunito font-bold text-sm text-text block mb-3">
            Dietary preference
          </label>
          <div class="grid grid-cols-4 gap-2">
            <button
              v-for="opt in dietaryOptions"
              :key="opt.value"
              class="flex flex-col items-center gap-2 py-3.5 px-2 rounded-2xl border-2 transition-all"
              :class="selectedDietary === opt.value
                ? 'border-primary bg-[#fff5f5] shadow-[0_4px_14px_rgb(255_107_107/0.2)] -translate-y-0.5'
                : 'border-border bg-surface hover:border-accent hover:bg-[#fffbeb]'"
              @click="selectedDietary = opt.value"
            >
              <span class="text-2xl">{{ opt.emoji }}</span>
              <span
                class="text-[10px] font-bold text-center leading-tight"
                :class="selectedDietary === opt.value ? 'text-primary' : 'text-text-muted'"
              >
                {{ opt.label }}
              </span>
            </button>
          </div>
        </div>

        <!-- Submit -->
        <div class="pt-1">
          <button
            class="w-full py-4 rounded-2xl font-nunito font-black text-base tracking-wide transition-all duration-200"
            :class="name.trim()
              ? 'bg-primary text-white shadow-[var(--shadow-pop)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-hover)] active:scale-[0.98]'
              : 'bg-border text-text-muted cursor-not-allowed'"
            :disabled="!name.trim()"
            @click="handleSubmit"
          >
            Start planning
          </button>
          <p class="text-center text-xs text-text-muted mt-3">
            Your data stays in your browser. No account needed.
          </p>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '../stores/userStore'
import type { DietaryPreference } from '../types'

const userStore = useUserStore()
const name = ref('')
const selectedDietary = ref<DietaryPreference>('none')

const dietaryOptions: { value: DietaryPreference; label: string; emoji: string }[] = [
  { value: 'none',        label: 'No Restriction', emoji: '🍽️' },
  { value: 'vegetarian',  label: 'Vegetarian',     emoji: '🥦' },
  { value: 'vegan',       label: 'Vegan',          emoji: '🌱' },
  { value: 'pescatarian', label: 'Pescatarian',    emoji: '🐟' },
  { value: 'no-seafood',  label: 'No Seafood',     emoji: '🚫' },
  { value: 'no-beef',     label: 'No Beef',        emoji: '🥩' },
  { value: 'gluten-free', label: 'Gluten Free',    emoji: '🌾' },
  { value: 'dairy-free',  label: 'Dairy Free',     emoji: '🥛' },
]

function handleSubmit() {
  if (!name.value.trim()) return
  userStore.login(name.value.trim(), selectedDietary.value)
}
</script>