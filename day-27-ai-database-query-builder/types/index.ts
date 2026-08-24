export type DatabaseDialect =
  | 'postgres'
  | 'mysql'
  | 'mongodb'
  | 'sqlite'
  | 'prisma'
  | 'drizzle';

export interface ColumnDefinition {
  name: string;
  type: string;
  isPrimary?: boolean;
  isForeignKey?: boolean;
  references?: string;
  description?: string;
}

export interface TableDefinition {
  name: string;
  description: string;
  rowCountEstimate: number;
  columns: ColumnDefinition[];
}

export interface DatabaseSchema {
  id: string;
  name: string;
  category: string;
  dialect: DatabaseDialect;
  tables: TableDefinition[];
  description: string;
  sampleQuestions: string[];
}

export interface GeneratedQuery {
  id: string;
  question: string;
  dialect: DatabaseDialect;
  query: string;
  explanation: string;
  queryType: 'SELECT' | 'AGGREGATE' | 'JOIN' | 'MUTATION';
  estimatedComplexity: 'LOW' | 'MEDIUM' | 'HIGH';
  executionTimeEstimate: string;
  optimizationTips: string[];
  warnings: string[];
  createdAt: string;
}

export interface ExecutionResult {
  columns: string[];
  rows: Record<string, any>[];
  totalRows: number;
  executionTimeMs: number;
  error?: string;
}

export interface SavedQuery {
  id: string;
  title: string;
  question: string;
  dialect: DatabaseDialect;
  schemaName: string;
  query: string;
  explanation?: string;
  createdAt: string;
}
