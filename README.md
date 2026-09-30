# TS-008-Vue3.5-Project2

A responsive personal expense tracker for recording income and expenses, monitoring spending categories, and reviewing monthly balances. Transactions and custom categories persist locally across browser refreshes.

## Tech stack
Vue 3 (Composition API, <script setup>) + TypeScript, Vite, Tailwind CSS, Vue Router, Pinia.

## Getting started
```
npm install --legacy-peer-deps
cp .env.example .env
npm run dev
```
Then open http://localhost:35309

## Environment variables
See .env.example. VITE_API_URL is optional — every entity runs on local mock data (USE_MOCK = true in each src/stores/<entity>.ts) until it's set and each entity's flag is flipped to false.

## Project structure
src/assets — global Tailwind CSS entry point.
src/components — reusable navigation, metrics, and confirmation UI.
src/data — tagged development seed records.
src/layouts — shared application shell.
src/router — route definitions.
src/services — shared API client.
src/stores — Pinia-backed persisted transaction and category entities.
src/types — shared TypeScript entity models.
src/views — routed dashboard, management, summary, and fallback screens.
