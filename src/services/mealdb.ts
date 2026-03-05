import type { Meal, MealDetail, MealDBRaw, Ingredient } from '../types'

const BASE_URL = 'https://www.themealdb.com/api/json/v1/1'

// ===== TRANSFORMER =====
// Ubah raw response TheMealDB → tipe kita yang clean
function transformMeal(raw: MealDBRaw): Meal {
  return {
    id: raw.idMeal,
    name: raw.strMeal,
    thumb: raw.strMealThumb,
    category: raw.strCategory,
    area: raw.strArea,
    tags: raw.strTags ? raw.strTags.split(',').map(t => t.trim()) : [],
  }
}

function transformMealDetail(raw: MealDBRaw): MealDetail {
  const ingredients: Ingredient[] = []

  for (let i = 1; i <= 20; i++) {
    const name = raw[`strIngredient${i}`]
    const measure = raw[`strMeasure${i}`]
    if (name && name.trim()) {
      ingredients.push({ name: name.trim(), measure: measure?.trim() ?? '' })
    }
  }

  return {
    ...transformMeal(raw),
    ingredients,
    instructions: raw.strInstructions ?? '',
    youtubeUrl: raw.strYoutube ?? undefined,
    sourceUrl: raw.strSource ?? undefined,
  }
}

// ===== API FUNCTIONS =====
export async function searchMeals(query: string): Promise<Meal[]> {
  try {
    const res = await fetch(`${BASE_URL}/search.php?s=${query}`)
    const data = await res.json()
    return (data.meals ?? []).map(transformMeal)
  } catch {
    return []
  }
}

export async function getRandomMeal(): Promise<Meal | null> {
  try {
    const res = await fetch(`${BASE_URL}/random.php?t=${Date.now()}`)
    const data = await res.json()
    return data.meals ? transformMeal(data.meals[0]) : null
  } catch {
    return null
  }
}

export async function getMealById(id: string): Promise<MealDetail | null> {
  try {
    const res = await fetch(`${BASE_URL}/lookup.php?i=${id}`)
    const data = await res.json()
    return data.meals ? transformMealDetail(data.meals[0]) : null
  } catch {
    return null
  }
}

export async function getMealsByCategory(category: string): Promise<Meal[]> {
  try {
    const res = await fetch(`${BASE_URL}/filter.php?c=${category}`)
    const data = await res.json()
    return (data.meals ?? []).map(transformMeal)
  } catch {
    return []
  }
}