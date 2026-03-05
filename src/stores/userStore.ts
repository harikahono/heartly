import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, DietaryPreference } from '../types'
import { DIETARY_LABELS } from '../utils/allergy'

const STORAGE_KEY = 'heartly_user'

export const useUserStore = defineStore('user', () => {
  // ===== STATE =====
  // ref() = useState() di React
  const user = ref<User | null>(loadFromStorage())

  // ===== GETTERS =====
  // computed() = useMemo() di React
  const isLoggedIn = computed(() => user.value !== null)
  const userName = computed(() => user.value?.name ?? '')
  const dietary = computed(() => user.value?.dietary ?? 'none')
  const dietaryLabel = computed(() => DIETARY_LABELS[dietary.value])

  // ===== ACTIONS =====
  function login(name: string, dietaryPref: DietaryPreference) {
    user.value = { name, dietary: dietaryPref }
    saveToStorage(user.value)
  }

  function logout() {
    user.value = null
    localStorage.removeItem(STORAGE_KEY)
  }

  // ===== HELPERS (private) =====
  function saveToStorage(data: User) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }

  function loadFromStorage(): User | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  }

  return {
    user,
    isLoggedIn,
    userName,
    dietary,
    dietaryLabel,
    login,
    logout,
  }
})