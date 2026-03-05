import type { Meal, MealDetail, MealDBRaw, Ingredient } from '../types'

const BASE_URL = 'https://www.themealdb.com/api/json/v1/1'

function transformMeal(raw: MealDBRaw): Meal {
  return {
    id: raw.idMeal,
    name: raw.strMeal,
    thumb: raw.strMealThumb,
    category: raw.strCategory ?? undefined,
    area: raw.strArea ?? undefined,
    tags: raw.strTags ? raw.strTags.split(',').map(t => t.trim()).filter(Boolean) : [],
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
    youtubeUrl: raw.strYoutube || undefined,
    sourceUrl: raw.strSource || undefined,
  }
}

export async function searchMeals(query: string): Promise<Meal[]> {
  try {
    const res = await fetch(`${BASE_URL}/search.php?s=${encodeURIComponent(query)}`)
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

// Fix: pakai search.php?s= bukan filter.php?c= 
// karena filter.php return data incomplete (no category/area/tags)
// search.php?s= return full data + jauh lebih banyak hasil per kategori
export async function getMealsByCategory(category: string): Promise<Meal[]> {
  try {
    // Coba search by category name dulu — return full meal data
    const res = await fetch(`${BASE_URL}/search.php?s=${encodeURIComponent(category)}`)
    const data = await res.json()
    if (data.meals && data.meals.length > 0) {
      return data.meals.map(transformMeal)
    }

    // Fallback: filter.php kalau search ga return hasil
    // Inject category manually karena filter.php ga provide ini
    const fallback = await fetch(`${BASE_URL}/filter.php?c=${encodeURIComponent(category)}`)
    const fallbackData = await fallback.json()
    return (fallbackData.meals ?? []).map((raw: MealDBRaw) => ({
      ...transformMeal(raw),
      category, // inject manual biar allergy filter tetap works
    }))
  } catch {
    return []
  }
}