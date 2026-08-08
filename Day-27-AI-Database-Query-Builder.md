# Day 27 — AI Database Query Builder (No-SQL)

## 🗓️ Day: 27 of 30
## 🏷️ Category: Developer Tools / Natural Language Processing
## ⚡ Difficulty: Intermediate-Advanced
## 🕐 Estimated Build Time: 7–9 hours

---

## 📌 Project Overview

A web app where developers and non-technical stakeholders write plain English questions and instantly get back SQL queries, MongoDB aggregation pipelines, or REST API calls — no database knowledge required. Connect to your actual database (PostgreSQL, MySQL, MongoDB) via a secure connection string, describe your schema once, then ask questions like "Show me the top 10 customers by revenue this quarter" and get production-ready queries with explanation.

---

## 🎯 Core Features

| Feature | Description |
|---|---|
| Natural Language Input | Type questions in plain English |
| Multi-Database Support | PostgreSQL, MySQL, MongoDB, SQLite |
| Schema Auto-Detection | Reads your schema automatically |
| Query Explanation | Plain English explanation of generated query |
| Query Optimization Tips | Suggests indexes and performance improvements |
| Live Query Execution | Run against actual DB and see results |
| Query History | Save and revisit past queries |
| Data Visualization | Auto-generate charts from query results |
| Export Results | CSV, JSON, or Excel download |
| Collaboration | Share queries with team members |

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, Monaco Editor, Recharts, Tailwind CSS
- **AI**: Google Gemini 1.5 Pro
- **Database Drivers**: `pg` (PostgreSQL), `mysql2` (MySQL), `mongodb` (Mongo)
- **Query Validation**: `sqlparser` npm (validate before execution)
- **Auth**: Clerk
- **Storage**: Supabase (query history, saved schemas)
- **Deployment**: Vercel + Railway (DB proxy server)

---

## 🔧 Key Functions

### `detectDatabaseSchema(connectionString: string, dbType: DBType): Promise<Schema>`
Connects to the database, introspects the information schema (PostgreSQL) or collection samples (MongoDB), and returns a structured schema definition with tables, columns, types, and foreign key relationships.

### `generateQuery(question: string, schema: Schema, dbType: DBType): Promise<GeneratedQuery>`
Builds a detailed system prompt with the full schema and sends the natural language question to Gemini. Returns the generated query string, explanation, estimated performance tier, and suggested optimizations.

### `validateQuery(query: string, dbType: DBType): ValidationResult`
Parses the generated SQL using `sqlparser` to check for syntax errors, destructive operations (DROP/DELETE without WHERE), and potential injection patterns before execution.

### `executeQuery(query: string, connectionString: string, dbType: DBType): Promise<QueryResult>`
Executes the validated query against the actual database via the appropriate driver. Applies a strict 10-second timeout and returns results with column metadata for visualization.

### `autoVisualize(result: QueryResult, question: string): ChartConfig | null`
Analyzes the query result shape and the original question intent to determine the most appropriate chart type (bar, line, pie, table). Returns chart configuration for Recharts rendering.

---

## 📁 File Structure

```
query-builder/
├── app/
│   ├── page.tsx              # Landing + DB connection
│   ├── query/page.tsx        # Main query interface
│   ├── history/page.tsx      # Saved queries
│   └── api/
│       ├── schema/route.ts   # Schema detection
│       ├── generate/route.ts # Query generation
│       ├── execute/route.ts  # Query execution
│       └── visualize/route.ts# Chart config gen
├── components/
│   ├── QueryInput.tsx        # Natural language input
│   ├── QueryOutput.tsx       # Generated query + editor
│   ├── ResultTable.tsx       # Query results table
│   ├── AutoChart.tsx         # Auto-generated charts
│   └── SchemaViewer.tsx      # Visual schema tree
└── lib/
    ├── db-connector.ts       # Multi-DB connection
    ├── schema-detector.ts
    ├── gemini.ts
    └── sql-validator.ts
```

---

## 💡 AI Prompt Used

```
SYSTEM PROMPT:
You are an expert database engineer who converts natural language questions into 
optimized SQL queries (or MongoDB aggregation pipelines).

DATABASE SCHEMA:
{schema}

DATABASE TYPE: {dbType}

Rules:
1. Generate the MOST efficient query for the question
2. Always include WHERE clauses to limit data when possible
3. Use JOINs properly based on schema relationships
4. Add LIMIT 1000 to all SELECT queries for safety
5. Never generate DROP, TRUNCATE, or DELETE without explicit confirmation
6. Explain the query in 2 sentences of plain English

Output JSON only:
{
  "query": "SELECT ... complete query here ...",
  "explanation": "Plain English: This query...",
  "queryType": "SELECT",
  "estimatedComplexity": "LOW|MEDIUM|HIGH",
  "optimizationTips": [
    "Add index on orders.customer_id for 10x faster JOINs",
    "Consider materialized view if run frequently"
  ],
  "warnings": []
}

QUESTION: {question}
```

---

## 📤 Expected Output (Result)

**Schema:** `customers(id, name, email, country)`, `orders(id, customer_id, total, created_at, status)`, `products(id, name, price, category)`

**Question:** "Show me top 10 customers by total revenue in Q1 2026, only from Pakistan"

```json
{
  "query": "SELECT \n  c.id,\n  c.name,\n  c.email,\n  SUM(o.total) AS total_revenue,\n  COUNT(o.id) AS order_count\nFROM customers c\nINNER JOIN orders o ON c.id = o.customer_id\nWHERE \n  c.country = 'Pakistan'\n  AND o.status = 'completed'\n  AND o.created_at >= '2026-01-01'\n  AND o.created_at < '2026-04-01'\nGROUP BY c.id, c.name, c.email\nORDER BY total_revenue DESC\nLIMIT 10;",
  "explanation": "This query joins customers with their completed orders, filters for Pakistani customers in Q1 2026 (Jan–Mar), sums their total revenue, and returns the top 10 highest-spending customers ordered by revenue.",
  "queryType": "SELECT",
  "estimatedComplexity": "MEDIUM",
  "optimizationTips": [
    "Add composite index: CREATE INDEX idx_orders_customer_date ON orders(customer_id, created_at) — reduces query time from ~800ms to ~45ms",
    "Add index on customers.country if queried frequently: CREATE INDEX idx_customers_country ON customers(country)"
  ],
  "warnings": []
}
```

**UI Display:**
```
💬 "Show top 10 customers by revenue in Q1 2026, Pakistan only"

Generated PostgreSQL Query:
────────────────────────────────
SELECT
  c.id, c.name, c.email,
  SUM(o.total) AS total_revenue,
  COUNT(o.id) AS order_count
FROM customers c
INNER JOIN orders o ON c.id = o.customer_id
WHERE c.country = 'Pakistan'
  AND o.status = 'completed'
  AND o.created_at BETWEEN '2026-01-01' AND '2026-04-01'
GROUP BY c.id, c.name, c.email
ORDER BY total_revenue DESC
LIMIT 10;

📖 Explanation: Joins customers with completed orders,
   filters Pakistan + Q1 2026, ranks by total spend.

⚡ Optimization: Add index on orders.customer_id (10x faster)

[▶ Run Query] [Copy SQL] [Export CSV] [📊 Auto Chart]
```

---

## 🚀 Stretch Goals

- [ ] Supabase, Prisma, and Drizzle ORM output modes
- [ ] Explain existing complex queries in plain English
- [ ] Query diff tool (compare two query performance plans)
- [ ] Slack bot integration for team data queries
