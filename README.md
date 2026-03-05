# Heartly.

> Smart weekly meal planner with allergy-aware suggestions and grocery list generation.

![Vue 3](https://img.shields.io/badge/Vue-3.x-42b883?style=flat-square&logo=vue.js)
![Vite](https://img.shields.io/badge/Vite-7.x-646cff?style=flat-square&logo=vite)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-06b6d4?style=flat-square&logo=tailwindcss)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)

---

## Overview

Heartly is a **zero-backend** weekly meal planner that helps you organize 21 meal slots (7 days × Breakfast, Lunch, Dinner) with smart dietary filtering. All data lives in your browser — no account, no server, no cost.

**Live Demo →** [heartly-meal-planner.netlify.app](heartly-meal-planner.netlify.app)

---

## Features

| Feature | Description |
|---|---|
| **Weekly Planner Grid** | 7 days × 3 meal slots (Breakfast, Lunch, Dinner) |
| **Drag & Drop** | Drag recipes from sidebar to any slot. Drag between slots to swap |
| **Auto Generate** | 1-click fill all 21 slots with allergy-aware random meals |
| **Recipe Search** | Search by keyword with 500ms debounce + paginated results |
| **Category Filter** | Quick filter by Chicken, Seafood, Pasta, Dessert, Veggie, Beef |
| **Recipe Detail** | Full ingredients, step-by-step instructions, YouTube link |
| **Grocery List** | Auto-aggregate all ingredients from your current plan |
| **Print Grocery List** | Clean printable PDF with checkboxes, grouped by meal |
| **Share via URL** | Encode your plan to a shareable URL — send to anyone |
| **Dietary Filtering** | 8 dietary preferences with keyword + category blocking |
| **Persistent State** | Plan and profile saved to localStorage |
| **Reset Plan** | Clear all meals with confirmation modal |

---

## Dietary Preferences

Heartly supports 8 dietary modes with best-effort filtering based on meal name, category, and tags:

- No Restriction
- Vegetarian
- Vegan
- Pescatarian
- No Seafood
- No Beef
- Gluten Free
- Dairy Free

> **Note:** Filtering is best-effort — TheMealDB's free API doesn't expose full ingredient lists on search/random endpoints. Category-level blocking (e.g. blocking "Pasta" category for Gluten Free) is applied first for better accuracy.

---

## Tech Stack

```
Vue 3          — Composition API, <script setup>
Vite 7         — Build tool & dev server
TypeScript     — Full type coverage
Tailwind CSS 4 — Utility styling via @theme variables
Pinia 3        — Global state (user, planner, drag)
@vueuse/core   — Vue composables utility
```

**Data:** [TheMealDB](https://www.themealdb.com/api.php) — free, no API key required.

**Deploy:** Static files only. Works on Vercel, Netlify, GitHub Pages — zero config.

---

## Project Structure

```
src/
├── components/
│   ├── grocery/        — GroceryList.vue
│   ├── layout/         — Navbar.vue
│   ├── planner/        — WeekGrid, DayColumn, MealSlot
│   └── recipe/         — RecipeCard, RecipeModal, RecipeSearch
├── composables/
│   └── usePagination.ts
├── services/
│   └── mealdb.ts       — TheMealDB API client + transformers
├── stores/
│   ├── dragStore.ts    — Ephemeral drag state
│   ├── plannerStore.ts — Weekly plan + auto-generate
│   └── userStore.ts    — User profile + dietary preference
├── types/
│   └── index.ts        — All TypeScript interfaces
├── utils/
│   ├── allergy.ts      — Dietary filter logic
│   ├── printGrocery.ts — Print template generator
│   └── shareUrl.ts     — URL encode/decode for plan sharing
└── views/
    ├── OnboardingView.vue
    └── PlannerView.vue
```

---

## Getting Started

**Requirements:** Node.js 18+, pnpm

```bash
# Clone
git clone https://github.com/harikahono/heartly.git
cd heartly

# Install
pnpm install

# Dev server
pnpm dev

# Build
pnpm build

# Preview build
pnpm preview
```

Open `http://localhost:5173`

---

## Deploy to Vercel

```bash
# Install Vercel CLI
pnpm add -g vercel

# Deploy
vercel --prod
```

Or connect your GitHub repo to [vercel.com](https://vercel.com) for automatic deployments on push.

---

## How It Works

**Drag & Drop**
Recipes from the search sidebar can be dragged into any meal slot. Dragging a filled slot onto another filled slot performs a swap — neither meal is lost.

**Auto Generate**
Fetches random meals from TheMealDB in batches of 3 (per day), with up to 15 retries per slot to find a meal that passes dietary filters. 7 days × 3 slots = 21 meals total.

**Share URL**
The current plan is JSON-encoded → base64 → appended as a URL query param (`?plan=...`). Anyone with the link can open it and the plan loads automatically.

**Grocery List**
When opened, fetches full meal details for all unique meals in the current plan in parallel, then aggregates ingredients grouped by meal. Supports checkbox tracking and clean print output.

---

## Known Limitations

- Dietary filtering is **best-effort** — based on meal name, category, and tags only. Full ingredient-level filtering would require 21 extra API calls per auto-generate
- TheMealDB free tier has no rate limiting documentation — heavy usage may occasionally fail silently (handled with try/catch fallbacks)
- Plan sharing via URL has a length limit depending on browser/server — very large plans may truncate

---

## License

MIT — do whatever you want with it.

---

*Built with Vue 3 + Vite + Tailwind CSS. Data from TheMealDB.*