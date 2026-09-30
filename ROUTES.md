# TS-008-Vue3.5-Project2 — Routes & Navigation

## How to run
cd /workspace/frontend_runs/add1f6b9-9a54-4965-add8-ef2a22bb0b28/project
npm install --legacy-peer-deps && npm run dev -- --port 35309 --strictPort
Then open http://localhost:35309

## Routes

| Route | Component file | Description |
|-------|----------------|-------------|
| / | redirect | Redirects to the main screen |
| /dashboard | src/views/DashboardView.vue | Financial overview with aggregates, category spending, and recent activity. |
| /transactions | src/views/TransactionsView.vue | Searchable, filterable, sortable transaction list. |
| /transactions/new | src/views/TransactionFormView.vue | Create a validated transaction. |
| /transactions/:id/edit | src/views/TransactionFormView.vue | Edit or delete a selected transaction. |
| /categories | src/views/CategoriesView.vue | View predefined categories and manage custom categories. |
| /monthly-summary | src/views/MonthlySummaryView.vue | Selected-month income, expenses, balance, and category totals. |
| /:pathMatch(.*)* | src/views/NotFoundView.vue | Unknown URL fallback page. |

## Navigation map
- Dashboard -> Transactions (sidebar link or View all action)
- Dashboard -> Add Transaction (Add transaction button)
- Dashboard -> Edit Transaction (recent transaction row)
- Dashboard -> Categories (sidebar link)
- Dashboard -> Monthly Summary (sidebar link)
- Transactions -> Add Transaction (Add transaction button)
- Transactions -> Edit Transaction (Edit action)
- Transactions -> Transactions (confirmed deletion)
- Add Transaction -> Transactions (save or cancel)
- Edit Transaction -> Transactions (save, delete confirmation, cancel, or back)
- Categories -> Categories (create or confirmed custom-category deletion)
- Monthly Summary -> Dashboard, Transactions, or Categories (sidebar links)
- Any page -> NotFound (unknown URL)

## Shared components
- src/components/Sidebar.vue — desktop RouterLink navigation.
- src/components/TopBar.vue — responsive header and account affordances.
- src/components/MetricCard.vue — labeled financial statistic card.
- src/components/ConfirmDialog.vue — reusable destructive-action confirmation dialog.
- src/layouts/ShellLayout.vue — sidebar, top bar, and routed page frame.

## Design tokens
primary, primary-hover, surface, surface-muted, background, text-primary, text-secondary, border, success, danger, warning, info.
