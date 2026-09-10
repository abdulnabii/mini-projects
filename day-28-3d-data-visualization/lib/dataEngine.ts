import {
  ColumnProfile,
  ColumnDataType,
  FilterRule,
  DimensionMapping,
  VisualizationType,
  GeoDataPoint,
  GeoArcConnection,
  GraphNode,
  GraphLink,
  Bar3DPoint,
  Scatter3DPoint,
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

// Common Country Lat/Lng Dictionary for Auto-Geocoding
const COUNTRY_COORDS: Record<string, [number, number]> = {
  'united states': [37.0902, -95.7129],
  'usa': [37.0902, -95.7129],
  'us': [37.0902, -95.7129],
  'united kingdom': [55.3781, -3.4360],
  'uk': [55.3781, -3.4360],
  'germany': [51.1657, 10.4515],
  'france': [46.2276, 2.2137],
  'japan': [36.2048, 138.2529],
  'china': [35.8617, 104.1954],
  'india': [20.5937, 78.9629],
  'brazil': [-14.2350, -51.9253],
  'australia': [-25.2744, 133.7751],
  'canada': [56.1304, -106.3468],
  'pakistan': [30.3753, 69.3451],
  'south africa': [-30.5595, 22.9375],
  'united arab emirates': [23.4241, 53.8478],
  'uae': [23.4241, 53.8478],
  'dubai': [25.2048, 55.2708],
  'singapore': [1.3521, 103.8198],
  'saudi arabia': [23.8859, 45.0792],
  'new zealand': [-40.9006, 174.8860],
  'italy': [41.8719, 12.5674],
  'spain': [40.4637, -3.7492],
  'netherlands': [52.1326, 5.2913],
  'switzerland': [46.8182, 8.2275],
  'sweden': [60.1282, 18.6435],
  'norway': [60.4720, 8.4689],
  'mexico': [23.6345, -102.5528],
};

/**
 * Transform Raw Tabular Rows + Dimension Mapping into 3D Spatial Geometries.
 * This guarantees that uploaded CSV data immediately renders in the 3D Studio!
 */
export function build3DDataFromRows(
  rows: Record<string, any>[],
  headers: string[],
  chartType: VisualizationType,
  mapping: DimensionMapping
): {
  globePoints?: GeoDataPoint[];
  globeArcs?: GeoArcConnection[];
  nodes?: GraphNode[];
  links?: GraphLink[];
  bars?: Bar3DPoint[];
  scatter?: Scatter3DPoint[];
} {
  if (!rows || rows.length === 0) return {};

  const numericCols = headers.filter((h) => !isNaN(parseFloat(rows[0]?.[h])));
  const catCols = headers.filter((h) => isNaN(parseFloat(rows[0]?.[h])));

  // 1. GLOBE 3D
  if (chartType === 'GLOBE_3D') {
    const latKey = mapping.latField || headers.find((h) => h.toLowerCase().includes('lat'));
    const lngKey = mapping.lngField || headers.find((h) => h.toLowerCase().includes('lng') || h.toLowerCase().includes('lon'));
    const geoKey = mapping.geoField || headers.find((h) => h.toLowerCase().includes('country') || h.toLowerCase().includes('city') || h.toLowerCase().includes('location')) || catCols[0] || headers[0];
    const valKey = mapping.heightField || numericCols[0] || headers[1];
    const secKey = mapping.secondaryValueField || numericCols[1];
    const catKey = mapping.categoryField || catCols[0];

    const globePoints: GeoDataPoint[] = [];

    rows.forEach((row, i) => {
      let lat = latKey ? parseFloat(row[latKey]) : NaN;
      let lng = lngKey ? parseFloat(row[lngKey]) : NaN;
      const label = String(row[geoKey] || `Point ${i + 1}`);

      // Auto-geocode country name if coords are missing or invalid
      if (isNaN(lat) || isNaN(lng)) {
        const lookup = COUNTRY_COORDS[label.toLowerCase().trim()];
        if (lookup) {
          lat = lookup[0];
          lng = lookup[1];
        } else {
          // Synthetic procedural geo-distribution across world
          lat = (Math.sin(i * 1.7) * 60);
          lng = ((i * 47) % 360) - 180;
        }
      }

      const rawVal = valKey ? parseFloat(row[valKey]) : 50;
      const val = !isNaN(rawVal) ? rawVal : 50;
      const secVal = secKey && !isNaN(parseFloat(row[secKey])) ? parseFloat(row[secKey]) : undefined;
      const cat = catKey ? String(row[catKey] || 'General') : undefined;

      globePoints.push({
        id: `gp_${i + 1}`,
        label,
        lat,
        lng,
        value: val,
        secondaryValue: secVal,
        category: cat,
      });
    });

    // Generate interconnecting arcs between top points
    const globeArcs: GeoArcConnection[] = [];
    if (globePoints.length >= 2) {
      for (let i = 0; i < Math.min(globePoints.length - 1, 6); i++) {
        const p1 = globePoints[i];
        const p2 = globePoints[(i + 1) % globePoints.length];
        globeArcs.push({
          fromLat: p1.lat,
          fromLng: p1.lng,
          toLat: p2.lat,
          toLng: p2.lng,
          label: `${p1.label} ↔ ${p2.label}`,
          value: Math.round((p1.value + p2.value) / 2),
        });
      }
    }

    return { globePoints, globeArcs };
  }

  // 2. NETWORK GRAPH 3D
  if (chartType === 'NETWORK_GRAPH') {
    const sourceKey = mapping.sourceField || headers.find((h) => h.toLowerCase().includes('source') || h.toLowerCase().includes('entity') || h.toLowerCase().includes('from')) || catCols[0] || headers[0];
    const targetKey = mapping.targetField || headers.find((h) => h.toLowerCase().includes('target') || h.toLowerCase().includes('to')) || catCols[1] || catCols[0] || headers[0];
    const weightKey = mapping.weightField || numericCols[0];
    const catKey = mapping.categoryField || catCols[0];

    const nodesMap = new Map<string, GraphNode>();
    const links: GraphLink[] = [];

    rows.forEach((row, i) => {
      const srcName = String(row[sourceKey] || `Entity_${i + 1}`);
      const rawVal = weightKey ? parseFloat(row[weightKey]) : 60;
      const val = !isNaN(rawVal) ? Math.min(100, Math.max(20, rawVal)) : 50;
      const group = catKey ? String(row[catKey] || 'Cluster') : 'General';

      if (!nodesMap.has(srcName)) {
        nodesMap.set(srcName, {
          id: `node_${nodesMap.size + 1}`,
          label: srcName,
          group,
          val,
        });
      }

      if (targetKey && row[targetKey] && String(row[targetKey]) !== srcName) {
        const tgtName = String(row[targetKey]);
        if (!nodesMap.has(tgtName)) {
          nodesMap.set(tgtName, {
            id: `node_${nodesMap.size + 1}`,
            label: tgtName,
            group: 'Connected',
            val: 50,
          });
        }
        links.push({
          source: nodesMap.get(srcName)!.id,
          target: nodesMap.get(tgtName)!.id,
          value: val,
        });
      }
    });

    const nodes = Array.from(nodesMap.values());
    // If no explicit links, create network relationships between adjacent items
    if (links.length === 0 && nodes.length > 1) {
      for (let i = 0; i < nodes.length - 1; i++) {
        links.push({
          source: nodes[i].id,
          target: nodes[(i + 1) % nodes.length].id,
          value: 70,
        });
        if (i + 2 < nodes.length) {
          links.push({
            source: nodes[i].id,
            target: nodes[i + 2].id,
            value: 50,
          });
        }
      }
    }

    return { nodes, links };
  }

  // 3. BAR CHART 3D (ISOMETRIC VOXELS)
  if (chartType === 'BAR_3D') {
    const xKey = mapping.xCategoryField || catCols[0] || headers[0];
    const zKey = mapping.zCategoryField || catCols[1] || catCols[0] || headers[1];
    const valKey = mapping.barHeightField || numericCols[0] || headers[2] || headers[1];
    const catKey = mapping.categoryField || catCols[0];

    const bars: Bar3DPoint[] = rows.slice(0, 36).map((row, i) => {
      const xLabel = String(row[xKey] || `Col_${i + 1}`);
      const zLabel = zKey && row[zKey] ? String(row[zKey]) : `Metric_${(i % 5) + 1}`;
      const rawVal = valKey ? parseFloat(row[valKey]) : 50;
      const value = !isNaN(rawVal) ? rawVal : 50;
      const category = catKey ? String(row[catKey] || 'General') : undefined;

      return {
        id: `bar_${i + 1}`,
        xLabel,
        zLabel,
        value,
        category,
      };
    });

    return { bars };
  }

  // 4. SCATTER 3D (PARTICLE SWARM)
  const xKey = mapping.xField || numericCols[0] || headers[0];
  const yKey = mapping.yField || numericCols[1] || numericCols[0] || headers[1];
  const zKey = mapping.zField || numericCols[2] || numericCols[0] || headers[2] || headers[0];
  const sizeKey = mapping.sizeField;
  const catKey = mapping.categoryField || catCols[0];

  const scatter: Scatter3DPoint[] = rows.slice(0, 100).map((row, i) => {
    const rawX = parseFloat(row[xKey]);
    const rawY = parseFloat(row[yKey]);
    const rawZ = parseFloat(row[zKey]);
    const x = !isNaN(rawX) ? rawX : (i % 10) * 10 - 50;
    const y = !isNaN(rawY) ? rawY : Math.sin(i) * 40;
    const z = !isNaN(rawZ) ? rawZ : Math.cos(i) * 40;

    const rawSize = sizeKey ? parseFloat(row[sizeKey]) : 10;
    const size = !isNaN(rawSize) ? Math.min(25, Math.max(4, rawSize)) : 8;
    const category = catKey && row[catKey] ? String(row[catKey]) : 'Standard';

    return {
      id: `sc_${i + 1}`,
      label: String(row[headers[0]] || `Point ${i + 1}`),
      x,
      y,
      z,
      size,
      category,
    };
  });

  return { scatter };
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
      geoField: findCol(['country', 'nation', 'location', 'label', 'city']) || catCols[0] || headers[0],
      latField: findCol(['lat', 'latitude']),
      lngField: findCol(['lng', 'lon', 'longitude']),
      heightField: findCol(['value', 'metric', 'cases', 'volume', 'revenue', 'count']) || numericCols[0] || headers[1],
      secondaryValueField: numericCols[1] || numericCols[0],
      categoryField: findCol(['region', 'continent', 'category', 'group']) || catCols[0],
    };
  }

  if (chartType === 'NETWORK_GRAPH') {
    return {
      sourceField: findCol(['source', 'from', 'parent', 'origin']) || catCols[0] || headers[0],
      targetField: findCol(['target', 'to', 'child', 'destination']) || catCols[1] || catCols[0] || headers[0],
      weightField: findCol(['value', 'weight', 'val', 'volume', 'amount']) || numericCols[0] || headers[1],
      categoryField: findCol(['group', 'category', 'type', 'cluster']) || catCols[0],
    };
  }

  if (chartType === 'BAR_3D') {
    return {
      xCategoryField: findCol(['region', 'country', 'category', 'entity', 'label', 'name']) || catCols[0] || headers[0],
      zCategoryField: findCol(['quarter', 'year', 'date', 'month', 'period', 'type']) || catCols[1] || catCols[0] || headers[1],
      barHeightField: findCol(['value', 'revenue', 'mrr', 'amount', 'metric', 'score']) || numericCols[0] || headers[1],
      categoryField: catCols[0],
    };
  }

  // SCATTER_3D
  return {
    xField: numericCols[0] || headers[0],
    yField: numericCols[1] || headers[1] || numericCols[0],
    zField: numericCols[2] || headers[2] || numericCols[0],
    sizeField: numericCols[3] || numericCols[0],
    categoryField: catCols[0] || headers[0],
  };
}
