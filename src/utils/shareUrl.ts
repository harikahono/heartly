import type { WeekPlan } from '../types'

const PARAM_KEY = 'plan'

// Encode WeekPlan → base64 string → masuk ke URL
export function encodePlanToUrl(plan: WeekPlan): string {
  try {
    const json = JSON.stringify(plan)
    const encoded = btoa(encodeURIComponent(json))
    const url = new URL(window.location.href)
    url.searchParams.set(PARAM_KEY, encoded)
    return url.toString()
  } catch {
    return window.location.href
  }
}

// Decode URL → base64 → WeekPlan
export function decodePlanFromUrl(): WeekPlan | null {
  try {
    const url = new URL(window.location.href)
    const encoded = url.searchParams.get(PARAM_KEY)
    if (!encoded) return null

    const json = decodeURIComponent(atob(encoded))
    return JSON.parse(json) as WeekPlan
  } catch {
    return null
  }
}

// Hapus plan param dari URL tanpa reload
export function clearPlanFromUrl(): void {
  const url = new URL(window.location.href)
  url.searchParams.delete(PARAM_KEY)
  window.history.replaceState({}, '', url.toString())
}

// Check apakah URL sekarang ada shared plan
export function hasSharedPlan(): boolean {
  const url = new URL(window.location.href)
  return url.searchParams.has(PARAM_KEY)
}