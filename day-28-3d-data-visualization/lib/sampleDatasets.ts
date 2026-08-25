import { DatasetAnalysis } from '@/types';

export const SAMPLE_DATASETS: DatasetAnalysis[] = [
  {
    id: 'ds_pandemic',
    title: 'Global Pandemic & Healthcare Vulnerability Index',
    category: 'Geospatial & Public Health',
    rowCount: 20,
    chartType: 'GLOBE_3D',
    axisMapping: {
      geo: 'Country Coordinates (Lat/Lng)',
      height: 'Cumulative Case Volume (Spike Height)',
      color: 'Vaccination Coverage %',
      arcs: 'International Transmission Corridors',
    },
    colorScheme: 'HEAT',
    patterns: [
      'Strong clustering of early wave peaks in North America and Western Europe with high mortality preceding vaccine rollout.',
      'South & Southeast Asian nations exhibit high vaccination uptake resulting in 78% lower ICU admission velocities.',
      'Transcontinental flight corridors between London, New York, Dubai, and Singapore accelerated variant transmission by 4.2x.',
    ],
    anomalies: [
      'New Zealand maintained near-zero baseline transmission for 18 months via strict border isolation protocols.',
      'Island states with 90%+ vaccination showed decoupling of case volume from hospitalization peaks.',
    ],
    narrative:
      'This planetary geospatial model visualizes the multi-wave trajectory of global infectious transmission and immunization efficacy. Heightened spike clusters pinpoint epicenters of transmission velocity, while connecting orbital arcs map primary global transportation corridors. The correlation between vaccination density and mortality reduction remains the single most decisive factor across all continental territories.',
    animationRecommendation: 'Slow orbital rotation with focus on Atlantic corridor then panning east toward Asia.',
    data: {
      globePoints: [
        { id: 'p1', label: 'United States', lat: 37.0902, lng: -95.7129, value: 95, secondaryValue: 74, category: 'North America' },
        { id: 'p2', label: 'United Kingdom', lat: 55.3781, lng: -3.4360, value: 72, secondaryValue: 82, category: 'Europe' },
        { id: 'p3', label: 'Pakistan', lat: 30.3753, lng: 69.3451, value: 48, secondaryValue: 86, category: 'Asia' },
        { id: 'p4', label: 'Germany', lat: 51.1657, lng: 10.4515, value: 68, secondaryValue: 79, category: 'Europe' },
        { id: 'p5', label: 'Japan', lat: 36.2048, lng: 138.2529, value: 52, secondaryValue: 88, category: 'Asia' },
        { id: 'p6', label: 'Brazil', lat: -14.2350, lng: -51.9253, value: 84, secondaryValue: 71, category: 'South America' },
        { id: 'p7', label: 'India', lat: 20.5937, lng: 78.9629, value: 88, secondaryValue: 76, category: 'Asia' },
        { id: 'p8', label: 'Australia', lat: -25.2744, lng: 133.7751, value: 34, secondaryValue: 91, category: 'Oceania' },
        { id: 'p9', label: 'South Africa', lat: -30.5595, lng: 22.9375, value: 62, secondaryValue: 58, category: 'Africa' },
        { id: 'p10', label: 'United Arab Emirates', lat: 23.4241, lng: 53.8478, value: 42, secondaryValue: 96, category: 'Middle East' },
        { id: 'p11', label: 'Singapore', lat: 1.3521, lng: 103.8198, value: 38, secondaryValue: 94, category: 'Asia' },
        { id: 'p12', label: 'Canada', lat: 56.1304, lng: -106.3468, value: 58, secondaryValue: 85, category: 'North America' },
        { id: 'p13', label: 'France', lat: 46.2276, lng: 2.2137, value: 70, secondaryValue: 81, category: 'Europe' },
        { id: 'p14', label: 'Saudi Arabia', lat: 23.8859, lng: 45.0792, value: 45, secondaryValue: 84, category: 'Middle East' },
        { id: 'p15', label: 'New Zealand', lat: -40.9006, lng: 174.8860, value: 18, secondaryValue: 93, category: 'Oceania' },
      ],
      globeArcs: [
        { fromLat: 37.0902, fromLng: -95.7129, toLat: 55.3781, toLng: -3.4360, label: 'US-UK Corridor', value: 85 },
        { fromLat: 55.3781, fromLng: -3.4360, toLat: 23.4241, toLng: 53.8478, label: 'London-Dubai Hub', value: 92 },
        { fromLat: 23.4241, fromLng: 53.8478, toLat: 30.3753, toLng: 69.3451, label: 'Gulf-Pakistan Route', value: 65 },
        { fromLat: 23.4241, fromLng: 53.8478, toLat: 1.3521, toLng: 103.8198, label: 'Dubai-Singapore Link', value: 78 },
        { fromLat: 1.3521, fromLng: 103.8198, toLat: 36.2048, toLng: 138.2529, label: 'Singapore-Tokyo Route', value: 60 },
        { fromLat: 37.0902, fromLng: -95.7129, toLat: -14.2350, toLng: -51.9253, label: 'Pan-American Flightpath', value: 55 },
      ],
    },
  },
  {
    id: 'ds_tech_vc',
    title: 'Global Tech Unicorns & Venture Capital Network',
    category: 'Venture Capital & Network Topology',
    rowCount: 24,
    chartType: 'NETWORK_GRAPH',
    axisMapping: {
      nodes: 'Startups, Venture Funds & Accelerators',
      links: 'Co-Investment & Round Syndication',
      size: 'Valuation / Assets Under Management',
      color: 'Sector / Entity Tier',
    },
    colorScheme: 'CYBERPUNK',
    patterns: [
      'Dense gravitational clustering around Tier-1 AI foundation model companies with multi-fund syndicate participation.',
      'Secondary satellite nodes forming around Autonomous Agents and Edge AI infrastructure.',
      'High connectivity density between Silicon Valley and London/Singapore venture syndicates.',
    ],
    anomalies: [
      'Seed-stage specialized robotics startups receiving $500M+ mega-rounds directly from strategic sovereign funds.',
    ],
    narrative:
      'This 3D spatial network graph models the flow of capital and co-investment syndicates across the global technology ecosystem. Core hub nodes represent multi-stage venture institutions anchoring high-valuation AI infrastructure companies, while perimeter clusters represent emerging developer tool and open-source startups.',
    animationRecommendation: 'Dynamic spring-force stabilization with orbital pan around primary AI cluster.',
    data: {
      nodes: [
        { id: 'n1', label: 'Sequoia Capital', group: 'VC', val: 90 },
        { id: 'n2', label: 'Andreessen Horowitz', group: 'VC', val: 88 },
        { id: 'n3', label: 'OpenAI Ecosystem', group: 'AI Lab', val: 95 },
        { id: 'n4', label: 'Anthropic Labs', group: 'AI Lab', val: 92 },
        { id: 'n5', label: 'Y Combinator', group: 'Accelerator', val: 82 },
        { id: 'n6', label: 'Scale AI', group: 'Data Infra', val: 78 },
        { id: 'n7', label: 'Vercel Systems', group: 'Dev Platform', val: 75 },
        { id: 'n8', label: 'Supabase Core', group: 'Database', val: 70 },
        { id: 'n9', label: 'Mistral AI', group: 'AI Lab', val: 80 },
        { id: 'n10', label: 'Benchmark Capital', group: 'VC', val: 76 },
        { id: 'n11', label: 'Founders Fund', group: 'VC', val: 84 },
        { id: 'n12', label: 'Perplexity AI', group: 'Search Engine', val: 74 },
        { id: 'n13', label: 'Cursor / Anysphere', group: 'DevTool', val: 72 },
        { id: 'n14', label: 'LangChain Ecosystem', group: 'Agent Infra', val: 68 },
      ],
      links: [
        { source: 'n1', target: 'n3', value: 95 },
        { source: 'n2', target: 'n3', value: 85 },
        { source: 'n2', target: 'n4', value: 90 },
        { source: 'n5', target: 'n6', value: 75 },
        { source: 'n5', target: 'n8', value: 80 },
        { source: 'n1', target: 'n7', value: 78 },
        { source: 'n11', target: 'n4', value: 72 },
        { source: 'n10', target: 'n12', value: 68 },
        { source: 'n2', target: 'n13', value: 70 },
        { source: 'n1', target: 'n9', value: 74 },
        { source: 'n2', target: 'n14', value: 65 },
        { source: 'n3', target: 'n12', value: 80 },
      ],
    },
  },
  {
    id: 'ds_saas_grid',
    title: 'Multi-Region Cloud Infrastructure & MRR Matrix',
    category: 'Cloud Architecture & Financials',
    rowCount: 25,
    chartType: 'BAR_3D',
    axisMapping: {
      xAxis: 'Cloud Regions (US-East, EU-Central, AP-South, SA-East, ME-Central)',
      zAxis: 'Quarters (Q1 2025 - Q1 2026)',
      yHeight: 'Monthly Recurring Revenue ($K)',
      color: 'Region Growth Tier',
    },
    colorScheme: 'EMERALD',
    patterns: [
      'Exponential 140% MRR surge across AP-South (Singapore/Mumbai) driven by edge AI inference demand.',
      'US-East maintains largest baseline volume ($4.8M MRR) with steady 18% QoQ expansion.',
      'EU-Central shows accelerating enterprise workload migration with 99.99% SLA compliance.',
    ],
    anomalies: [
      'Q3 2025 marked temporary GPU supply constraint causing plateau before Q4 surge.',
    ],
    narrative:
      'This 3D isometric voxel surface maps multi-region cloud revenue and compute consumption across consecutive fiscal quarters. The elevation of each voxel column represents recurring revenue density, revealing geographic market acceleration in Asia-Pacific and the Middle East.',
    animationRecommendation: 'Isometric camera sweep with staggered vertical bar rise animation.',
    data: {
      bars: [
        { id: 'b1', xLabel: 'US-East (N. Virginia)', zLabel: 'Q1 2025', value: 62, category: 'Americas' },
        { id: 'b2', xLabel: 'US-East (N. Virginia)', zLabel: 'Q2 2025', value: 74, category: 'Americas' },
        { id: 'b3', xLabel: 'US-East (N. Virginia)', zLabel: 'Q3 2025', value: 82, category: 'Americas' },
        { id: 'b4', xLabel: 'US-East (N. Virginia)', zLabel: 'Q4 2025', value: 92, category: 'Americas' },
        { id: 'b5', xLabel: 'US-East (N. Virginia)', zLabel: 'Q1 2026', value: 108, category: 'Americas' },

        { id: 'b6', xLabel: 'EU-Central (Frankfurt)', zLabel: 'Q1 2025', value: 45, category: 'Europe' },
        { id: 'b7', xLabel: 'EU-Central (Frankfurt)', zLabel: 'Q2 2025', value: 52, category: 'Europe' },
        { id: 'b8', xLabel: 'EU-Central (Frankfurt)', zLabel: 'Q3 2025', value: 61, category: 'Europe' },
        { id: 'b9', xLabel: 'EU-Central (Frankfurt)', zLabel: 'Q4 2025', value: 70, category: 'Europe' },
        { id: 'b10', xLabel: 'EU-Central (Frankfurt)', zLabel: 'Q1 2026', value: 84, category: 'Europe' },

        { id: 'b11', xLabel: 'AP-South (Singapore)', zLabel: 'Q1 2025', value: 32, category: 'Asia' },
        { id: 'b12', xLabel: 'AP-South (Singapore)', zLabel: 'Q2 2025', value: 44, category: 'Asia' },
        { id: 'b13', xLabel: 'AP-South (Singapore)', zLabel: 'Q3 2025', value: 58, category: 'Asia' },
        { id: 'b14', xLabel: 'AP-South (Singapore)', zLabel: 'Q4 2025', value: 75, category: 'Asia' },
        { id: 'b15', xLabel: 'AP-South (Singapore)', zLabel: 'Q1 2026', value: 96, category: 'Asia' },

        { id: 'b16', xLabel: 'ME-Central (UAE)', zLabel: 'Q1 2025', value: 18, category: 'Middle East' },
        { id: 'b17', xLabel: 'ME-Central (UAE)', zLabel: 'Q2 2025', value: 26, category: 'Middle East' },
        { id: 'b18', xLabel: 'ME-Central (UAE)', zLabel: 'Q3 2025', value: 38, category: 'Middle East' },
        { id: 'b19', xLabel: 'ME-Central (UAE)', zLabel: 'Q4 2025', value: 50, category: 'Middle East' },
        { id: 'b20', xLabel: 'ME-Central (UAE)', zLabel: 'Q1 2026', value: 68, category: 'Middle East' },

        { id: 'b21', xLabel: 'SA-East (São Paulo)', zLabel: 'Q1 2025', value: 14, category: 'Americas' },
        { id: 'b22', xLabel: 'SA-East (São Paulo)', zLabel: 'Q2 2025', value: 19, category: 'Americas' },
        { id: 'b23', xLabel: 'SA-East (São Paulo)', zLabel: 'Q3 2025', value: 24, category: 'Americas' },
        { id: 'b24', xLabel: 'SA-East (São Paulo)', zLabel: 'Q4 2025', value: 31, category: 'Americas' },
        { id: 'b25', xLabel: 'SA-East (São Paulo)', zLabel: 'Q1 2026', value: 42, category: 'Americas' },
      ],
    },
  },
  {
    id: 'ds_climate_particles',
    title: 'Planetary Climate & Atmospheric Carbon Particle Swarm',
    category: 'Environmental Science & Physics',
    rowCount: 80,
    chartType: 'SCATTER_3D',
    axisMapping: {
      xAxis: 'Atmospheric Altitude (0 - 30 KM)',
      yAxis: 'CO2 Concentration (PPM)',
      zAxis: 'Temperature Anomaly (+°C)',
      size: 'Aerosol Optical Depth',
      color: 'Planetary Latitudinal Band',
    },
    colorScheme: 'HEAT',
    patterns: [
      'Dense hyper-concentration of thermal anomalies occurring at low altitude atmospheric bands between 20°N and 45°N.',
      'Strong inverse correlation between polar stratospheric cooling and tropical tropospheric heat retention.',
    ],
    anomalies: [
      'High-altitude methane release pocket observed over arctic tundra coordinates during peak summer solstice.',
    ],
    narrative:
      'This 3D particle swarm models multi-variable atmospheric dynamics across planetary altitude bands. Each point represents an atmospheric sensing coordinate colored by temperature anomaly and sized by optical aerosol density.',
    animationRecommendation: '360° orbit with continuous harmonic particle pulsing.',
    data: {
      scatter: Array.from({ length: 80 }, (_, i) => {
        const angle = (i / 80) * Math.PI * 4;
        const radius = 20 + (i % 5) * 8;
        return {
          id: `sc_${i}`,
          label: `Sensing Node #${i + 1}`,
          x: Math.cos(angle) * radius + (Math.random() - 0.5) * 6,
          y: (i - 40) * 1.2 + (Math.random() - 0.5) * 8,
          z: Math.sin(angle) * radius + (Math.random() - 0.5) * 6,
          size: 4 + (i % 6) * 2,
          category: i < 25 ? 'Troposphere' : i < 55 ? 'Stratosphere' : 'Mesosphere',
        };
      }),
    },
  },
];
