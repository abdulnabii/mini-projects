import {
  ColumnProfile,
  ColumnDataType,
  FilterRule,
  DimensionMapping,
  VisualizationType,
} from '@/types';
import { calculateDescriptiveStats } from './statistics';

/**
 * Data Engine for OmniData.3D.
 * Handles robust CSV parsing, data type inference, filtering engine,
 * and dynamic transformation for 3D/2D views.
 */

// Robust CSV Parser (supports quotes, commas in quotes, escaped quotes)
export function parseCSV(csvText: string): { headers: string[]; rows: Record<string, any>[] } {
  const clean = csvText.trim();
  if (!clean) return { headers: [], rows: [] };

  const lines = clean.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 1) return { headers: [], rows: [] };

  const parseLine = (line: string): string[] => {
    const values: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());
    return values;
  };

  const rawHeaders = parseLine(lines[0]);
  const headers = rawHeaders.map((h, i) => (h ? h.replace(/^["']|["']$/g, '') : `col_${i + 1}`));

  const rows: Record<string, any>[] = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseLine(lines[i]);
    if (values.length === 0 || (values.length === 1 && values[0] === '')) continue;

    const row: Record<string, any> = { __rowIndex: i - 1 };
    headers.forEach((h, idx) => {
      const rawVal = values[idx] !== undefined ? values[idx].replace(/^["']|["']$/g, '') : '';
      row[h] = rawVal;
    });
    rows.push(row);
  }

  return { headers, rows };
}

// Column Data Type Inference
export function inferColumnType(values: any[]): ColumnDataType {
  const nonNulls = values.filter((v) => v !== null && v !== undefined && String(v).trim() !== '');
  if (nonNulls.length === 0) return 'text';

  // Check numeric
  const numericCount = nonNulls.filter((v) => !isNaN(Number(v)) && !isNaN(parseFloat(v))).length;
  if (numericCount / nonNulls.length > 0.8) {
    return 'numeric';
  }

  // Check geographic
  const geoKeywords = ['lat', 'lng', 'latitude', 'longitude', 'country', 'city', 'region', 'state', 'location'];
  // Temporal
  const dateRegex = /^\d{4}[-/.]\d{1,2}[-/.]\d{1,2}$|^\d{1,2}[-/.]\d{1,2}[-/.]\d{4}$|^Q[1-4]\s?\d{4}$/i;
  const dateMatches = nonNulls.filter((v) => dateRegex.test(String(v).trim()) || !isNaN(Date.parse(String(v)))).length;
  if (dateMatches / nonNulls.length > 0.8) {
    return 'temporal';
  }

  // Categorical vs text (low cardinality = categorical)
  const uniqueCount = new Set(nonNulls.map((v) => String(v).toLowerCase())).size;
  if (uniqueCount <= Math.max(10, nonNulls.length * 0.35)) {
    return 'categorical';
  }

  return 'text';
}

// Build Comprehensive Column Profiles
export function buildColumnProfiles(
  headers: string[],
  rows: Record<string, any>[]
): ColumnProfile[] {
  return headers.map((colName) => {
    const rawValues = rows.map((r) => r[colName]);
    const totalCount = rawValues.length;
    const nullCount = rawValues.filter(
      (v) => v === null || v === undefined || String(v).trim() === ''
    ).length;
    const completeness = totalCount > 0 ? Math.round(((totalCount - nullCount) / totalCount) * 1000) / 10 : 0;
    const uniqueCount = new Set(rawValues.filter((v) => v !== null && v !== undefined && String(v).trim() !== '')).size;

    // Check data type
    let dataType = inferColumnType(rawValues);
    // Force geographic if column name matches
    const lowerName = colName.toLowerCase();
    if (lowerName.includes('lat') || lowerName.includes('lng') || lowerName.includes('country') || lowerName.includes('city')) {
      dataType = 'geographic';
    }

    const sampleValues = rawValues
      .filter((v) => v !== null && v !== undefined && String(v).trim() !== '')
      .slice(0, 5);

    if (dataType === 'numeric' || (!isNaN(parseFloat(rawValues[0])) && !lowerName.includes('id'))) {
      const nums = rawValues
        .map((v) => parseFloat(v))
        .filter((v) => !isNaN(v));

      const stats = calculateDescriptiveStats(nums);

      // Count outliers using IQR
      let outlierCount = 0;
      if (stats.iqr > 0) {
        const lf = stats.q1 - 1.5 * stats.iqr;
        const uf = stats.q3 + 1.5 * stats.iqr;
        outlierCount = nums.filter((n) => n < lf || n > uf).length;
      }

      return {
        name: colName,
        dataType: 'numeric',
        totalCount,
        nullCount,
        uniqueCount,
        completeness,
        min: stats.min,
        max: stats.max,
        mean: stats.mean,
        median: stats.median,
        stdDev: stats.stdDev,
        q1: stats.q1,
        q3: stats.q3,
        iqr: stats.iqr,
        outlierCount,
        sampleValues,
      };
    }

    return {
      name: colName,
      dataType,
      totalCount,
      nullCount,
      uniqueCount,
      completeness,
      sampleValues,
    };
  });
}

// Filter Engine
export function applyFilters(
  rows: Record<string, any>[],
  filters: FilterRule[],
  globalSearch: string = ''
): Record<string, any>[] {
  return rows.filter((row) => {
    // 1. Global text search
    if (globalSearch.trim()) {
      const searchLower = globalSearch.toLowerCase().trim();
      const matchesSearch = Object.values(row).some((val) =>
        String(val).toLowerCase().includes(searchLower)
      );
      if (!matchesSearch) return false;
    }

    // 2. Specific filter rules
    for (const rule of filters) {
      const cellVal = row[rule.column];

      if (rule.type === 'numeric') {
        const num = parseFloat(cellVal);
        if (isNaN(num)) return false;

        if (rule.operator === 'between' && rule.numMin !== undefined && rule.numMax !== undefined) {
          if (num < rule.numMin || num > rule.numMax) return false;
        } else if (rule.operator === 'gt' && rule.numMin !== undefined) {
          if (num <= rule.numMin) return false;
        } else if (rule.operator === 'lt' && rule.numMax !== undefined) {
          if (num >= rule.numMax) return false;
        } else if (rule.operator === 'eq' && rule.numValue !== undefined) {
          if (num !== rule.numValue) return false;
        }
      } else if (rule.type === 'categorical' || rule.type === 'text') {
        if (rule.selectedCategories && rule.selectedCategories.length > 0) {
          const strVal = String(cellVal).trim();
          if (!rule.selectedCategories.includes(strVal)) return false;
        }
      }
    }

    return true;
  });
}

// Auto-infer Recommended Dimension Mapping for a Dataset
export function inferDefaultDimensionMapping(
  headers: string[],
  profiles: ColumnProfile[],
  chartType: VisualizationType
): DimensionMapping {
  const numericCols = profiles.filter((p) => p.dataType === 'numeric').map((p) => p.name);
  const catCols = profiles.filter((p) => p.dataType === 'categorical' || p.dataType === 'text' || p.dataType === 'geographic').map((p) => p.name);

  const findCol = (keywords: string[]): string | undefined => {
    for (const kw of keywords) {
      const found = headers.find((h) => h.toLowerCase().includes(kw));
      if (found) return found;
    }
    return undefined;
  };

  if (chartType === 'GLOBE_3D') {
    return {
      geoField: findCol(['country', 'nation', 'location', 'label', 'city']) || catCols[0],
      latField: findCol(['lat', 'latitude']),
      lngField: findCol(['lng', 'lon', 'longitude']),
      heightField: findCol(['value', 'metric', 'cases', 'volume', 'revenue', 'count']) || numericCols[0],
      secondaryValueField: numericCols[1] || numericCols[0],
      categoryField: findCol(['region', 'continent', 'category', 'group']) || catCols[0],
    };
  }

  if (chartType === 'NETWORK_GRAPH') {
    return {
      sourceField: findCol(['source', 'from', 'parent', 'origin']) || catCols[0],
      targetField: findCol(['target', 'to', 'child', 'destination']) || catCols[1] || catCols[0],
      weightField: findCol(['value', 'weight', 'val', 'volume', 'amount']) || numericCols[0],
      categoryField: findCol(['group', 'category', 'type', 'cluster']) || catCols[0],
    };
  }

  if (chartType === 'BAR_3D') {
    return {
      xCategoryField: findCol(['region', 'country', 'category', 'entity', 'label', 'name']) || catCols[0],
      zCategoryField: findCol(['quarter', 'year', 'date', 'month', 'period', 'type']) || catCols[1] || catCols[0],
      barHeightField: findCol(['value', 'revenue', 'mrr', 'amount', 'metric', 'score']) || numericCols[0],
      categoryField: catCols[0],
    };
  }

  // SCATTER_3D
  return {
    xField: numericCols[0] || headers[0],
    yField: numericCols[1] || headers[1],
    zField: numericCols[2] || headers[2],
    sizeField: numericCols[3] || numericCols[0],
    categoryField: catCols[0] || headers[0],
  };
}
