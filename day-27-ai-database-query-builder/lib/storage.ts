import { SavedQuery, DatabaseSchema } from '@/types';
import { SAMPLE_SCHEMAS } from './sampleSchemas';

const SAVED_KEY = 'queryforge_saved_queries';
const SCHEMAS_KEY = 'queryforge_schemas';

export function getSavedQueries(): SavedQuery[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(SAVED_KEY);
    if (!raw) {
      const seeds: SavedQuery[] = [
        {
          id: 'sq_1',
          title: 'Top 10 Customers by Revenue (Pakistan Q1)',
          question: 'Show top 10 customers by revenue in Q1 2026, Pakistan only',
          dialect: 'postgres',
          schemaName: 'E-Commerce Store & Global Orders',
          query: `SELECT \n  c.id, c.name, c.email,\n  SUM(o.total_amount) AS total_revenue,\n  COUNT(o.id) AS completed_orders\nFROM customers c\nINNER JOIN orders o ON c.id = o.customer_id\nWHERE c.country = 'Pakistan' AND o.status = 'completed'\nGROUP BY c.id, c.name, c.email\nORDER BY total_revenue DESC\nLIMIT 10;`,
          explanation: 'Aggregates total spend for Pakistani customers with completed orders.',
          createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
        },
      ];
      localStorage.setItem(SAVED_KEY, JSON.stringify(seeds));
      return seeds;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load saved queries:', e);
    return [];
  }
}

export function saveQuery(query: SavedQuery): SavedQuery[] {
  if (typeof window === 'undefined') return [];
  try {
    const current = getSavedQueries();
    const updated = [query, ...current.filter((q) => q.id !== query.id)];
    localStorage.setItem(SAVED_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to save query:', e);
    return [];
  }
}

export function deleteSavedQuery(id: string): SavedQuery[] {
  if (typeof window === 'undefined') return [];
  try {
    const current = getSavedQueries();
    const updated = current.filter((q) => q.id !== id);
    localStorage.setItem(SAVED_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to delete query:', e);
    return [];
  }
}

export function getAllSchemas(): DatabaseSchema[] {
  if (typeof window === 'undefined') return SAMPLE_SCHEMAS;
  try {
    const raw = localStorage.getItem(SCHEMAS_KEY);
    if (!raw) {
      localStorage.setItem(SCHEMAS_KEY, JSON.stringify(SAMPLE_SCHEMAS));
      return SAMPLE_SCHEMAS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load schemas:', e);
    return SAMPLE_SCHEMAS;
  }
}
