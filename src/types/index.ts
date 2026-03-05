// ===== USER =====
export interface User {
  name: string
  dietary: DietaryPreference
}

export type DietaryPreference =
  | 'none'
  | 'vegetarian'
  | 'vegan'
  | 'pescatarian'
  | 'no-seafood'
  | 'no-beef'
  | 'gluten-free'
  | 'dairy-free'

// ===== MEAL =====
export interface Meal {
  id: string
  name: string
  thumb: string
  category?: string
  area?: string
  tags?: string[]
}

export interface MealDetail extends Meal {
  ingredients: Ingredient[]
  instructions: string
  youtubeUrl?: string
  sourceUrl?: string
}

export interface Ingredient {
  name: string
  measure: string
}

// ===== PLANNER =====
export type DayOfWeek = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun'
export type MealSlot = 'breakfast' | 'lunch' | 'dinner'

export interface DayPlan {
  breakfast?: Meal
  lunch?: Meal
  dinner?: Meal
}

// Key = DayOfWeek, Value = DayPlan
export type WeekPlan = Record<DayOfWeek, DayPlan>

// ===== API RAW RESPONSE =====
// Ini shape asli dari TheMealDB, biar kita bisa transform dengan bener
export interface MealDBRaw {
  idMeal: string
  strMeal: string
  strMealThumb: string
  strCategory: string
  strArea: string
  strTags: string | null
  strInstructions: string
  strYoutube: string | null
  strSource: string | null
  [key: string]: string | null // buat strIngredient1..20 & strMeasure1..20
}