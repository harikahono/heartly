import type { Meal, DietaryPreference } from '../types'

// ===== KEYWORD TRIGGERS =====
// Ngecek nama meal, kategori, dan tags
const DIETARY_TRIGGERS: Record<DietaryPreference, string[]> = {
  'none': [],

  'vegetarian': [
    'chicken', 'beef', 'pork', 'lamb', 'fish', 'shrimp', 'prawn', 'meat',
    'bacon', 'turkey', 'duck', 'veal', 'mince', 'minced', 'ham', 'sausage',
    'salami', 'pepperoni', 'anchovy', 'anchovies', 'lard', 'gelatin',
    'venison', 'bison', 'rabbit', 'goat', 'crab', 'lobster', 'mussel',
    'oyster', 'squid', 'tuna', 'salmon', 'cod', 'tilapia', 'sardine',
  ],

  'vegan': [
    'chicken', 'beef', 'pork', 'lamb', 'fish', 'shrimp', 'prawn', 'meat',
    'bacon', 'turkey', 'duck', 'veal', 'mince', 'minced', 'ham', 'sausage',
    'salami', 'pepperoni', 'anchovy', 'anchovies', 'lard', 'gelatin',
    'venison', 'bison', 'rabbit', 'goat', 'crab', 'lobster', 'mussel',
    'oyster', 'squid', 'tuna', 'salmon', 'cod', 'tilapia', 'sardine',
    'egg', 'eggs', 'milk', 'cream', 'cheese', 'butter', 'honey',
    'yogurt', 'ghee', 'whey', 'casein', 'lactose', 'mayo', 'mayonnaise',
    'parmesan', 'mozzarella', 'cheddar', 'brie', 'ricotta', 'custard',
  ],

  'pescatarian': [
    'chicken', 'beef', 'pork', 'lamb', 'meat', 'bacon', 'turkey', 'duck',
    'veal', 'mince', 'minced', 'ham', 'sausage', 'salami', 'pepperoni',
    'lard', 'gelatin', 'venison', 'bison', 'rabbit', 'goat',
  ],

  'no-seafood': [
    'shrimp', 'fish', 'prawn', 'crab', 'shellfish', 'oyster', 'squid',
    'mussel', 'lobster', 'clam', 'seafood', 'salmon', 'tuna', 'cod',
    'tilapia', 'sardine', 'anchovy', 'anchovies', 'scallop', 'octopus',
    'catfish', 'herring', 'mackerel', 'trout', 'bass', 'snapper',
  ],

  'no-beef': [
    'beef', 'steak', 'veal', 'burger', 'mince', 'minced beef',
    'ground beef', 'brisket', 'ribeye', 'sirloin', 'corned beef',
  ],

  'gluten-free': [
    // Nama dish yang pasti mengandung gluten
    'pasta', 'spaghetti', 'penne', 'fettuccine', 'linguine', 'tagliatelle',
    'lasagne', 'lasagna', 'ravioli', 'gnocchi', 'noodle', 'noodles',
    'ramen', 'udon', 'soba', 'dumpling', 'dumplings', 'wonton',
    'bread', 'brioche', 'baguette', 'focaccia', 'croissant', 'pretzel',
    'pizza', 'calzone', 'pie', 'tart', 'quiche',
    'cake', 'cupcake', 'muffin', 'cookie', 'cookies', 'biscuit', 'biscuits',
    'brownie', 'waffle', 'pancake', 'crepe', 'crumble', 'cobbler',
    'pastry', 'churro', 'donut', 'doughnut', 'scone',
    // Bahan yang mengandung gluten
    'flour', 'wheat', 'barley', 'rye', 'semolina', 'breadcrumbs',
    'breaded', 'battered',
  ],

  'dairy-free': [
    // Produk dairy langsung
    'milk', 'cream', 'butter', 'cheese', 'yogurt', 'ghee', 'whey',
    'casein', 'lactose', 'custard',
    // Jenis cheese spesifik
    'parmesan', 'mozzarella', 'cheddar', 'brie', 'ricotta', 'gouda',
    'feta', 'camembert', 'gruyere', 'halloumi', 'provolone', 'manchego',
    // Dish berbasis dairy
    'cheesecake', 'milkshake', 'ice cream', 'gelato',
    'bechamel', 'alfredo', 'carbonara',
  ],
}

// ===== CATEGORY BLOCKING =====
// Blokir langsung dari kategori TheMealDB tanpa perlu cek keyword
const BLOCKED_CATEGORIES: Record<DietaryPreference, string[]> = {
  'none': [],
  'vegetarian': ['beef', 'chicken', 'lamb', 'pork', 'seafood'],
  'vegan': ['beef', 'chicken', 'lamb', 'pork', 'seafood'],
  'pescatarian': ['beef', 'chicken', 'lamb', 'pork'],
  'no-seafood': ['seafood'],
  'no-beef': ['beef'],
  'gluten-free': ['pasta'],
  'dairy-free': [],
}

// ===== METADATA BUILDER =====
function buildMetadata(meal: Meal): string {
  return [
    meal.name,
    meal.category ?? '',
    ...(meal.tags ?? []),
  ].join(' ').toLowerCase()
}

// ===== EXPORTS =====
export function isAllergySafe(meal: Meal, dietary: DietaryPreference): boolean {
  if (dietary === 'none') return true

  // 1. Blokir by category dulu (lebih cepat)
  const blockedCats = BLOCKED_CATEGORIES[dietary]
  if (blockedCats.some(cat => meal.category?.toLowerCase().includes(cat))) {
    return false
  }

  // 2. Cek keyword di nama + tags
  const metadata = buildMetadata(meal)
  const forbidden = DIETARY_TRIGGERS[dietary]
  return !forbidden.some(word => metadata.includes(word))
}

export function filterSafeMeals(meals: Meal[], dietary: DietaryPreference): Meal[] {
  return meals.filter(meal => isAllergySafe(meal, dietary))
}

export const DIETARY_LABELS: Record<DietaryPreference, string> = {
  'none': 'No Restriction',
  'vegetarian': 'Vegetarian',
  'vegan': 'Vegan',
  'pescatarian': 'Pescatarian',
  'no-seafood': 'No Seafood',
  'no-beef': 'No Beef',
  'gluten-free': 'Gluten Free',
  'dairy-free': 'Dairy Free',
}