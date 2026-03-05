# Heartly.

Smart weekly meal planner with allergy-aware suggestions and grocery list generation.

**[heartly-meal-planner.netlify.app](https://heartly-meal-planner.netlify.app)**

![Vue 3](https://img.shields.io/badge/Vue-3.x-42b883?style=flat-square&logo=vue.js)
![Vite](https://img.shields.io/badge/Vite-7.x-646cff?style=flat-square&logo=vite)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-06b6d4?style=flat-square&logo=tailwindcss)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)

---

## What it does

Heartly lets you plan 21 meal slots across a full week (Mon–Sun × Breakfast, Lunch, Dinner). Search or browse recipes, drag them into slots, auto-generate a full week in one click, then export a printable grocery list. Everything runs in the browser — no account, no backend, no cost.

---

## Features

| | Feature | Description |
|---|---|---|
| 📅 | **Weekly Planner** | 7 days × 3 slots with drag & drop and slot swapping |
| ✨ | **Auto Generate** | Fill all 21 slots instantly with dietary-filtered random meals |
| 🔍 | **Recipe Search** | Keyword search + category filters with paginated results |
| 📋 | **Recipe Detail** | Full ingredients list, step-by-step instructions, YouTube link |
| 🛒 | **Grocery List** | Aggregates all ingredients from your plan with checkbox tracking |
| 🖨️ | **Print** | Clean printable grocery list grouped by meal |
| 🔗 | **Share** | Encode your plan as a URL and share with anyone |
| 🌿 | **Dietary Filtering** | 8 dietary modes with keyword + category-level blocking |
| 💾 | **Persistent** | Plan and profile auto-saved to localStorage |

---

## Dietary Modes

`No Restriction` `Vegetarian` `Vegan` `Pescatarian` `No Seafood` `No Beef` `Gluten Free` `Dairy Free`

Filtering runs on meal name, category, and tags. Category-level blocking (e.g. blocking the entire "Pasta" category for Gluten Free) runs first for efficiency, followed by keyword matching on meal names and tags.

> Filtering is best-effort. TheMealDB's free API does not expose full ingredient lists on search and random endpoints, so meals with ambiguous names may occasionally slip through.

---

## Stack

| | |
|---|---|
| **Vue 3** | Composition API, `<script setup>` throughout |
| **Vite 7** | Dev server and static build |
| **TypeScript** | Full type coverage across components, stores, and services |
| **Tailwind CSS 4** | Utility-first styling via `@theme` custom tokens |
| **Pinia** | Three stores: user, planner, drag state |
| **TheMealDB** | Free recipe API, no key required |

---

## Project Structure

```
src/
├── components/
│   ├── grocery/          GroceryList.vue
│   ├── layout/           Navbar.vue
│   ├── planner/          WeekGrid, DayColumn, MealSlot
│   └── recipe/           RecipeCard, RecipeModal, RecipeSearch
├── composables/
│   └── usePagination.ts
├── services/
│   └── mealdb.ts         API client + response transformers
├── stores/
│   ├── dragStore.ts      Ephemeral drag state
│   ├── plannerStore.ts   Weekly plan + auto-generate logic
│   └── userStore.ts      User profile + dietary preference
├── types/
│   └── index.ts
├── utils/
│   ├── allergy.ts        Dietary filter logic
│   ├── printGrocery.ts   Print template generator
│   └── shareUrl.ts       URL encode/decode for plan sharing
└── views/
    ├── OnboardingView.vue
    └── PlannerView.vue
```

---

## Getting Started

Requires Node.js 18+ and pnpm.

```bash
git clone https://github.com/harikahono/heartly.git
cd heartly
pnpm install
pnpm dev
```

Open `http://localhost:5173`

```bash
pnpm build      # production build → dist/
pnpm preview    # preview the build locally
```

---

## Deploy

**Netlify (drag & drop)**
Run `pnpm build`, then drag the `dist/` folder to [app.netlify.com/drop](https://app.netlify.com/drop).

**Netlify (auto deploy)**
Connect the GitHub repo at [netlify.com](https://netlify.com). Set build command to `pnpm build` and publish directory to `dist`. Deploys automatically on every push to `main`.

The `public/_redirects` file is included to handle SPA routing:
```
/* /index.html 200
```

---

## How It Works

**Drag & Drop**
HTML5 native drag API. Dragging from the search sidebar into an empty slot fills it. Dragging from a filled slot into another filled slot swaps the two meals — neither is lost.

**Auto Generate**
Fetches random meals in batches of 3 per day (7 days × 3 slots = 21 total). Each fetch retries up to 15 times to find a meal that passes the active dietary filter before moving on.

**Share URL**
The weekly plan is serialized to JSON, base64-encoded, and appended as a `?plan=` query parameter. Opening the URL loads the shared plan automatically.

**Grocery List**
On open, fetches full meal details for all unique meals in parallel via TheMealDB's lookup endpoint. Ingredients are grouped by meal and support checkbox state for shopping.

---

## Known Limitations

- Dietary filtering operates on meal name, category, and tags — not full ingredient lists. Ingredient-level filtering would require up to 21 additional API calls per auto-generate cycle.
- TheMealDB's free tier has undocumented rate limits. Heavy usage may occasionally return empty responses, which are handled silently with fallbacks.
- Shared plan URLs grow with plan size. Very large plans may approach browser URL length limits.

---

## License

MIT