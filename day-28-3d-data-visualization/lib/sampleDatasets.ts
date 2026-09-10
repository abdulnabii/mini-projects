import { DatasetAnalysis } from '@/types';
import { buildColumnProfiles } from './dataEngine';
import {
  calculateDataQuality,
  detectAnomalies,
  calculatePearsonCorrelations,
} from './statistics';

// Helper to construct fully profiled DatasetAnalysis objects with raw rows
function createPreset(
  id: string,
  title: string,
  category: string,
  chartType: DatasetAnalysis['chartType'],
  colorScheme: DatasetAnalysis['colorScheme'],
  headers: string[],
  rawRows: Record<string, any>[],
  axisMapping: Record<string, string>,
  patterns: string[],
  anomaliesSummary: string[],
  narrative: string,
  animationRecommendation: string,
  data: DatasetAnalysis['data']
): DatasetAnalysis {
  const columnProfiles = buildColumnProfiles(headers, rawRows);
  const dataQuality = calculateDataQuality(rawRows, headers);
  const numericCols = columnProfiles.filter((p) => p.dataType === 'numeric').map((p) => p.name);
  const detailedAnomalies = detectAnomalies(rawRows, numericCols);
  const correlations = calculatePearsonCorrelations(rawRows, numericCols);

  return {
    id,
    title,
    category,
    isSynthetic: true,
    sourceType: 'preset',
    rowCount: rawRows.length,
    rawRows,
    headers,
    columnProfiles,
    dataQuality,
    chartType,
    axisMapping,
    colorScheme,
    patterns,
    anomalies: anomaliesSummary,
    detailedAnomalies,
    correlations,
    narrative,
    animationRecommendation,
    data,
  };
}

// 1. Pandemic & Healthcare Index (Globe 3D)
const pandemicRows: Record<string, any>[] = [
  { country: 'United States', lat: 37.0902, lng: -95.7129, cases: 95, vaccination: 74, region: 'North America' },
  { country: 'United Kingdom', lat: 55.3781, lng: -3.4360, cases: 72, vaccination: 82, region: 'Europe' },
  { country: 'Pakistan', lat: 30.3753, lng: 69.3451, cases: 48, vaccination: 86, region: 'Asia' },
  { country: 'Germany', lat: 51.1657, lng: 10.4515, cases: 68, vaccination: 79, region: 'Europe' },
  { country: 'Japan', lat: 36.2048, lng: 138.2529, cases: 52, vaccination: 88, region: 'Asia' },
  { country: 'Brazil', lat: -14.2350, lng: -51.9253, cases: 84, vaccination: 71, region: 'South America' },
  { country: 'India', lat: 20.5937, lng: 78.9629, cases: 88, vaccination: 76, region: 'Asia' },
  { country: 'Australia', lat: -25.2744, lng: 133.7751, cases: 34, vaccination: 91, region: 'Oceania' },
  { country: 'South Africa', lat: -30.5595, lng: 22.9375, cases: 62, vaccination: 58, region: 'Africa' },
  { country: 'United Arab Emirates', lat: 23.4241, lng: 53.8478, cases: 42, vaccination: 96, region: 'Middle East' },
  { country: 'Singapore', lat: 1.3521, lng: 103.8198, cases: 38, vaccination: 94, region: 'Asia' },
  { country: 'Canada', lat: 56.1304, lng: -106.3468, cases: 58, vaccination: 85, region: 'North America' },
  { country: 'France', lat: 46.2276, lng: 2.2137, cases: 70, vaccination: 81, region: 'Europe' },
  { country: 'Saudi Arabia', lat: 23.8859, lng: 45.0792, cases: 45, vaccination: 84, region: 'Middle East' },
  { country: 'New Zealand', lat: -40.9006, lng: 174.8860, cases: 18, vaccination: 93, region: 'Oceania' },
];

// 2. Cloud SaaS MRR Grid (3D Bars)
const cloudSaasRows: Record<string, any>[] = [
  { region: 'US-East (N. Virginia)', quarter: 'Q1 2025', mrr: 62, computeUsage: 78, tier: 'Americas' },
  { region: 'US-East (N. Virginia)', quarter: 'Q2 2025', mrr: 74, computeUsage: 82, tier: 'Americas' },
  { region: 'US-East (N. Virginia)', quarter: 'Q3 2025', mrr: 82, computeUsage: 89, tier: 'Americas' },
  { region: 'US-East (N. Virginia)', quarter: 'Q4 2025', mrr: 92, computeUsage: 94, tier: 'Americas' },
  { region: 'US-East (N. Virginia)', quarter: 'Q1 2026', mrr: 108, computeUsage: 102, tier: 'Americas' },

  { region: 'EU-Central (Frankfurt)', quarter: 'Q1 2025', mrr: 45, computeUsage: 54, tier: 'Europe' },
  { region: 'EU-Central (Frankfurt)', quarter: 'Q2 2025', mrr: 52, computeUsage: 61, tier: 'Europe' },
  { region: 'EU-Central (Frankfurt)', quarter: 'Q3 2025', mrr: 61, computeUsage: 70, tier: 'Europe' },
  { region: 'EU-Central (Frankfurt)', quarter: 'Q4 2025', mrr: 70, computeUsage: 77, tier: 'Europe' },
  { region: 'EU-Central (Frankfurt)', quarter: 'Q1 2026', mrr: 84, computeUsage: 88, tier: 'Europe' },

  { region: 'AP-South (Mumbai)', quarter: 'Q1 2025', mrr: 28, computeUsage: 35, tier: 'Asia-Pacific' },
  { region: 'AP-South (Mumbai)', quarter: 'Q2 2025', mrr: 38, computeUsage: 49, tier: 'Asia-Pacific' },
  { region: 'AP-South (Mumbai)', quarter: 'Q3 2025', mrr: 50, computeUsage: 64, tier: 'Asia-Pacific' },
  { region: 'AP-South (Mumbai)', quarter: 'Q4 2025', mrr: 66, computeUsage: 81, tier: 'Asia-Pacific' },
  { region: 'AP-South (Mumbai)', quarter: 'Q1 2026', mrr: 88, computeUsage: 96, tier: 'Asia-Pacific' },

  { region: 'SA-East (Sao Paulo)', quarter: 'Q1 2025', mrr: 19, computeUsage: 24, tier: 'Americas' },
  { region: 'SA-East (Sao Paulo)', quarter: 'Q2 2025', mrr: 24, computeUsage: 30, tier: 'Americas' },
  { region: 'SA-East (Sao Paulo)', quarter: 'Q3 2025', mrr: 31, computeUsage: 38, tier: 'Americas' },
  { region: 'SA-East (Sao Paulo)', quarter: 'Q4 2025', mrr: 40, computeUsage: 47, tier: 'Americas' },
  { region: 'SA-East (Sao Paulo)', quarter: 'Q1 2026', mrr: 52, computeUsage: 58, tier: 'Americas' },

  { region: 'ME-Central (Dubai)', quarter: 'Q1 2025', mrr: 22, computeUsage: 29, tier: 'Middle East' },
  { region: 'ME-Central (Dubai)', quarter: 'Q2 2025', mrr: 32, computeUsage: 41, tier: 'Middle East' },
  { region: 'ME-Central (Dubai)', quarter: 'Q3 2025', mrr: 44, computeUsage: 56, tier: 'Middle East' },
  { region: 'ME-Central (Dubai)', quarter: 'Q4 2025', mrr: 58, computeUsage: 70, tier: 'Middle East' },
  { region: 'ME-Central (Dubai)', quarter: 'Q1 2026', mrr: 76, computeUsage: 86, tier: 'Middle East' },
];

// 3. Tech Unicorns & VC Network (Network Graph)
const techVCRows: Record<string, any>[] = [
  { entity: 'Sequoia Capital', type: 'VC', valuation: 90, deals: 42, cluster: 'Venture' },
  { entity: 'Andreessen Horowitz', type: 'VC', valuation: 88, deals: 39, cluster: 'Venture' },
  { entity: 'OpenAI Ecosystem', type: 'AI Lab', valuation: 95, deals: 18, cluster: 'Foundation AI' },
  { entity: 'Anthropic Labs', type: 'AI Lab', valuation: 92, deals: 14, cluster: 'Foundation AI' },
  { entity: 'Y Combinator', type: 'Accelerator', valuation: 82, deals: 65, cluster: 'Early Stage' },
  { entity: 'Scale AI', type: 'Data Infra', valuation: 78, deals: 12, cluster: 'Data Systems' },
  { entity: 'Vercel Systems', type: 'Dev Platform', valuation: 75, deals: 16, cluster: 'Developer Tools' },
  { entity: 'Supabase Core', type: 'Database', valuation: 70, deals: 11, cluster: 'Data Systems' },
  { entity: 'Mistral AI', type: 'AI Lab', valuation: 80, deals: 9, cluster: 'Foundation AI' },
  { entity: 'Benchmark Capital', type: 'VC', valuation: 76, deals: 28, cluster: 'Venture' },
  { entity: 'Founders Fund', type: 'VC', valuation: 84, deals: 31, cluster: 'Venture' },
  { entity: 'Perplexity AI', type: 'Search Engine', valuation: 74, deals: 8, cluster: 'Foundation AI' },
  { entity: 'Cursor / Anysphere', type: 'DevTool', valuation: 72, deals: 6, cluster: 'Developer Tools' },
  { entity: 'LangChain Ecosystem', type: 'Agent Infra', valuation: 68, deals: 7, cluster: 'Agent Frameworks' },
];

// 4. Climate Sensors (Scatter 3D)
const climateRows: Record<string, any>[] = [
  { station: 'Atacama Desert Observatory', temp: 34.2, co2: 418.5, humidity: 8.2, uvIndex: 12.4, ecosystem: 'Arid' },
  { station: 'Amazon Rainforest Canopy', temp: 28.6, co2: 392.1, humidity: 89.4, uvIndex: 8.1, ecosystem: 'Tropical' },
  { station: 'Svalbard Arctic Base', temp: -14.8, co2: 424.0, humidity: 55.0, uvIndex: 2.2, ecosystem: 'Polar' },
  { station: 'Mauna Loa Observatory', temp: 12.4, co2: 421.2, humidity: 41.6, uvIndex: 11.0, ecosystem: 'High Altitude' },
  { station: 'Sahara Boundary Station', temp: 42.1, co2: 415.8, humidity: 12.1, uvIndex: 13.8, ecosystem: 'Arid' },
  { station: 'Great Barrier Reef Marine', temp: 26.5, co2: 409.0, humidity: 82.0, uvIndex: 9.5, ecosystem: 'Marine' },
  { station: 'Himalayan High Peak', temp: -18.2, co2: 412.3, humidity: 28.0, uvIndex: 10.8, ecosystem: 'Alpine' },
  { station: 'Congo Basin Primary Forest', temp: 29.8, co2: 395.4, humidity: 86.2, uvIndex: 8.7, ecosystem: 'Tropical' },
  { station: 'Greenland Ice Sheet Node', temp: -22.5, co2: 426.1, humidity: 62.0, uvIndex: 1.8, ecosystem: 'Polar' },
  { station: 'Sonoran Solar Array', temp: 38.9, co2: 416.7, humidity: 14.5, uvIndex: 12.9, ecosystem: 'Arid' },
  { station: 'Nordic Boreal Forest', temp: 16.2, co2: 404.3, humidity: 68.0, uvIndex: 5.2, ecosystem: 'Temperate' },
  { station: 'Mediterranean Coastal Hub', temp: 24.1, co2: 414.2, humidity: 60.5, uvIndex: 7.8, ecosystem: 'Coastal' },
];

// 5. Global Air Traffic (Globe 3D)
const aviationRows: Record<string, any>[] = [
  { airport: 'London Heathrow', lat: 51.4700, lng: -0.4543, flights: 92, onTimeRate: 78, continent: 'Europe' },
  { airport: 'New York JFK', lat: 40.6413, lng: -73.7781, flights: 94, onTimeRate: 72, continent: 'North America' },
  { airport: 'Dubai International', lat: 25.2532, lng: 55.3657, flights: 96, onTimeRate: 88, continent: 'Middle East' },
  { airport: 'Singapore Changi', lat: 1.3644, lng: 103.9915, flights: 88, onTimeRate: 91, continent: 'Asia' },
  { airport: 'Tokyo Haneda', lat: 35.5494, lng: 139.7798, flights: 86, onTimeRate: 93, continent: 'Asia' },
  { airport: 'Frankfurt Airport', lat: 50.0379, lng: 8.5622, flights: 82, onTimeRate: 81, continent: 'Europe' },
  { airport: 'Los Angeles LAX', lat: 33.9416, lng: -118.4085, flights: 90, onTimeRate: 75, continent: 'North America' },
  { airport: 'Islamabad International', lat: 33.5651, lng: 72.8517, flights: 54, onTimeRate: 85, continent: 'Asia' },
  { airport: 'Sydney Kingsford Smith', lat: -33.9399, lng: 151.1753, flights: 70, onTimeRate: 86, continent: 'Oceania' },
  { airport: 'Johannesburg OR Tambo', lat: -26.1367, lng: 28.2411, flights: 60, onTimeRate: 82, continent: 'Africa' },
];

// 6. Maritime Freight Logistics (3D Bars)
const maritimeRows: Record<string, any>[] = [
  { port: 'Port of Shanghai', metricType: 'TEU Volume', value: 98, portCategory: 'East Asia' },
  { port: 'Port of Singapore', metricType: 'TEU Volume', value: 94, portCategory: 'Southeast Asia' },
  { port: 'Port of Ningbo-Zhoushan', metricType: 'TEU Volume', value: 89, portCategory: 'East Asia' },
  { port: 'Port of Rotterdam', metricType: 'TEU Volume', value: 76, portCategory: 'Europe' },
  { port: 'Port of Los Angeles', metricType: 'TEU Volume', value: 81, portCategory: 'North America' },
  { port: 'Port of Dubai (Jebel Ali)', metricType: 'TEU Volume', value: 79, portCategory: 'Middle East' },
  { port: 'Port of Antwerp-Bruges', metricType: 'TEU Volume', value: 72, portCategory: 'Europe' },
  { port: 'Port of Karachi (KPT)', metricType: 'TEU Volume', value: 58, portCategory: 'South Asia' },
];

export const SAMPLE_DATASETS: DatasetAnalysis[] = [
  createPreset(
    'ds_pandemic',
    'Global Pandemic & Healthcare Vulnerability Index',
    'Geospatial & Public Health',
    'GLOBE_3D',
    'HEAT',
    ['country', 'lat', 'lng', 'cases', 'vaccination', 'region'],
    pandemicRows,
    {
      geo: 'Country Coordinates (Lat/Lng)',
      height: 'Cumulative Case Volume (Spike Height)',
      color: 'Vaccination Coverage %',
      arcs: 'International Transmission Corridors',
    },
    [
      'Clustered high case densities observed in North America and Western Europe.',
      'South & Southeast Asian territories show strong vaccination rates inversely correlated with severe outcomes.',
      'Global air transmission corridors align with high-frequency hub routes.',
    ],
    [
      'New Zealand demonstrated near-zero early transmission due to geography and quarantine controls.',
      'Territories with >90% vaccination rate showed pronounced case-to-hospitalization decoupling.',
    ],
    'This planetary geospatial model maps infectious transmission indicators and vaccination densities across global coordinates. Heightened vertical spikes correlate with high localized case volumes, while international orbital arcs delineate major transit corridors.',
    'Slow planetary orbital rotation with focus on Atlantic corridor then panning east toward Asia.',
    {
      globePoints: pandemicRows.map((r, i) => ({
        id: `p_${i + 1}`,
        label: r.country,
        lat: r.lat,
        lng: r.lng,
        value: r.cases,
        secondaryValue: r.vaccination,
        category: r.region,
      })),
      globeArcs: [
        { fromLat: 37.0902, fromLng: -95.7129, toLat: 55.3781, toLng: -3.4360, label: 'US-UK Corridor', value: 85 },
        { fromLat: 55.3781, fromLng: -3.4360, toLat: 23.4241, toLng: 53.8478, label: 'London-Dubai Hub', value: 92 },
        { fromLat: 23.4241, fromLng: 53.8478, toLat: 30.3753, toLng: 69.3451, label: 'Gulf-Pakistan Route', value: 65 },
        { fromLat: 23.4241, fromLng: 53.8478, toLat: 1.3521, toLng: 103.8198, label: 'Dubai-Singapore Link', value: 78 },
        { fromLat: 1.3521, fromLng: 103.8198, toLat: 36.2048, toLng: 138.2529, label: 'Singapore-Tokyo Route', value: 60 },
        { fromLat: 37.0902, fromLng: -95.7129, toLat: -14.2350, toLng: -51.9253, label: 'Pan-American Flightpath', value: 55 },
      ],
    }
  ),

  createPreset(
    'ds_saas_grid',
    'Multi-Region Cloud Infrastructure & MRR Matrix',
    'Cloud Architecture & Financials',
    'BAR_3D',
    'EMERALD',
    ['region', 'quarter', 'mrr', 'computeUsage', 'tier'],
    cloudSaasRows,
    {
      xAxis: 'Cloud Regions (US-East, EU-Central, AP-South, SA-East, ME-Central)',
      zAxis: 'Fiscal Quarters (Q1 2025 - Q1 2026)',
      yHeight: 'Monthly Recurring Revenue ($K)',
      color: 'Region Growth Tier',
    },
    [
      'Accelerating 140% MRR growth recorded in AP-South driven by edge AI inference demand.',
      'US-East maintains highest baseline absolute volume ($108K peak MRR) with 18% QoQ expansion.',
      'Compute consumption correlates strongly (r > 0.95) with recurring revenue.',
    ],
    ['Q3 2025 indicated hardware procurement constraints causing temporary growth flattening.'],
    'This 3D isometric surface visualizes cloud compute consumption and monthly recurring revenue across consecutive quarters and regional clusters.',
    'Isometric camera sweep with staggered vertical bar rise animation.',
    {
      bars: cloudSaasRows.map((r, i) => ({
        id: `b_${i + 1}`,
        xLabel: r.region,
        zLabel: r.quarter,
        value: r.mrr,
        category: r.tier,
      })),
    }
  ),

  createPreset(
    'ds_tech_vc',
    'Global Tech Unicorns & Venture Capital Network',
    'Venture Capital & Network Topology',
    'NETWORK_GRAPH',
    'CYBERPUNK',
    ['entity', 'type', 'valuation', 'deals', 'cluster'],
    techVCRows,
    {
      nodes: 'Startups, Venture Funds & Accelerators',
      links: 'Co-Investment & Round Syndication',
      size: 'Valuation Index',
      color: 'Sector Cluster',
    },
    [
      'High gravitational clustering around Tier-1 AI foundation models (OpenAI, Anthropic).',
      'Satellite clusters actively forming in DevTools and agent frameworks.',
      'Venture hub nodes anchor multi-stage syndicated co-investments.',
    ],
    ['Outlier valuations concentrated in sovereign-funded compute labs.'],
    'This 3D network graph models syndication ties and capital flows across technology ecosystems and venture institutions.',
    'Dynamic spring-force stabilization with orbital pan around central AI hubs.',
    {
      nodes: techVCRows.map((r, i) => ({
        id: `n_${i + 1}`,
        label: r.entity,
        group: r.type,
        val: r.valuation,
      })),
      links: [
        { source: 'n_1', target: 'n_3', value: 95 },
        { source: 'n_2', target: 'n_3', value: 85 },
        { source: 'n_2', target: 'n_4', value: 90 },
        { source: 'n_5', target: 'n_6', value: 75 },
        { source: 'n_5', target: 'n_8', value: 80 },
        { source: 'n_1', target: 'n_7', value: 78 },
        { source: 'n_11', target: 'n_4', value: 72 },
        { source: 'n_10', target: 'n_12', value: 68 },
        { source: 'n_2', target: 'n_13', value: 70 },
        { source: 'n_1', target: 'n_9', value: 74 },
        { source: 'n_2', target: 'n_14', value: 65 },
        { source: 'n_3', target: 'n_12', value: 80 },
      ],
    }
  ),

  createPreset(
    'ds_climate',
    'Planetary Climate & Atmospheric Sensor Swarm',
    'Earth Science & Atmospheric Physics',
    'SCATTER_3D',
    'OCEAN',
    ['station', 'temp', 'co2', 'humidity', 'uvIndex', 'ecosystem'],
    climateRows,
    {
      x: 'Ambient Temperature (°C)',
      y: 'CO2 Concentration (ppm)',
      z: 'Relative Humidity (%)',
      size: 'UV Index',
      color: 'Ecosystem Biome',
    },
    [
      'Clear divergence between arid high-temperature stations and tropical high-humidity canopies.',
      'Polar stations register highest baseline CO2 trapping relative to sub-zero temperatures.',
    ],
    ['Atacama station recorded extreme UV Index of 12.4 combined with sub-10% humidity.'],
    'This 3D particle scatter plot captures multi-dimensional atmospheric observations from automated monitoring stations.',
    'Continuous particle drift animation with spherical bounding box inspection.',
    {
      scatter: climateRows.map((r, i) => ({
        id: `s_${i + 1}`,
        label: r.station,
        x: r.temp,
        y: r.co2 - 380, // Normalized for 3D scale
        z: r.humidity,
        size: r.uvIndex * 1.5,
        category: r.ecosystem,
      })),
    }
  ),

  createPreset(
    'ds_aviation',
    'Global Aviation Corridors & Hub Traffic',
    'Transportation & Logistics',
    'GLOBE_3D',
    'CYBERPUNK',
    ['airport', 'lat', 'lng', 'flights', 'onTimeRate', 'continent'],
    aviationRows,
    {
      geo: 'International Airport Coordinates',
      height: 'Flight Frequency Density',
      color: 'On-Time Departure Rate %',
      arcs: 'Trans-continental Routes',
    },
    [
      'Highest flight volume concentrated in North America and Western Europe.',
      'East Asian hubs maintain exceptional on-time departure performance (>90%).',
    ],
    ['Dubai International operates as a 24-hour ultra-high capacity connecting hub.'],
    'A geospatial overview of international civil aviation hubs, highlighting on-time efficiency and flight frequencies.',
    'Orbital camera focus panning from Transatlantic corridors to the Asia-Pacific network.',
    {
      globePoints: aviationRows.map((r, i) => ({
        id: `av_${i + 1}`,
        label: r.airport,
        lat: r.lat,
        lng: r.lng,
        value: r.flights,
        secondaryValue: r.onTimeRate,
        category: r.continent,
      })),
      globeArcs: [
        { fromLat: 51.4700, fromLng: -0.4543, toLat: 40.6413, toLng: -73.7781, label: 'LHR-JFK', value: 92 },
        { fromLat: 51.4700, fromLng: -0.4543, toLat: 25.2532, toLng: 55.3657, label: 'LHR-DXB', value: 95 },
        { fromLat: 25.2532, fromLng: 55.3657, toLat: 1.3644, toLng: 103.9915, label: 'DXB-SIN', value: 89 },
        { fromLat: 1.3644, fromLng: 103.9915, toLat: 35.5494, toLng: 139.7798, label: 'SIN-HND', value: 84 },
        { fromLat: 40.6413, fromLng: -73.7781, toLat: 33.9416, toLng: -118.4085, label: 'JFK-LAX', value: 90 },
      ],
    }
  ),

  createPreset(
    'ds_maritime',
    'Global Maritime Freight & Container Throughput',
    'Global Trade & Maritime Infrastructure',
    'BAR_3D',
    'HEAT',
    ['port', 'metricType', 'value', 'portCategory'],
    maritimeRows,
    {
      xAxis: 'Major Deep-Water Seaports',
      zAxis: 'Cargo Category (TEU Volume)',
      yHeight: 'Throughput Index',
      color: 'Geographic Region',
    },
    [
      'East Asian ports (Shanghai, Ningbo) dominate international container throughput volume.',
      'European gateways (Rotterdam, Antwerp) handle substantial transshipment loads.',
    ],
    ['Port of Shanghai throughput indices exceed nearest competitors by over 20%.'],
    'A 3D isometric representation of seaport cargo volumes, benchmarking global supply chain critical nodes.',
    'Camera panning across isometric bar ranks.',
    {
      bars: maritimeRows.map((r, i) => ({
        id: `m_${i + 1}`,
        xLabel: r.port,
        zLabel: r.metricType,
        value: r.value,
        category: r.portCategory,
      })),
    }
  ),
];
