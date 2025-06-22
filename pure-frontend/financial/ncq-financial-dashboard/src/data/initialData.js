export const initialFinancialData = {
  products: {
    pgw: {
      name: "NCQ Payment Gateway",
      shortName: "PGW",
      color: "#3b82f6",
      icon: "CreditCard",
      description: "Digital payment processing solution for Saudi Arabia & GCC",
      marketSize: 450000000000, // SAR 450B
      growthRate: 0.7, // 70% YoY
      yearlyData: [
        { year: 1, clients: 5, revenue: 1500000, monthlyRevenue: 125000 },
        { year: 2, clients: 25, revenue: 6750000, monthlyRevenue: 562500 },
        { year: 3, clients: 75, revenue: 18000000, monthlyRevenue: 1500000 },
        { year: 4, clients: 150, revenue: 36000000, monthlyRevenue: 3000000 },
        { year: 5, clients: 250, revenue: 67500000, monthlyRevenue: 5625000 }
      ],
      pricing: {
        enterprise: { monthly: 15000, setup: 7500, transaction: 0.025 },
        professional: { monthly: 5000, setup: 2500, transaction: 0.029 },
        starter: { monthly: 1500, setup: 0, transaction: 0.029 }
      },
      costs: {
        networkFees: 0.35,
        infrastructure: 0.15,
        marketing: 0.20,
        operations: 0.15,
        rd: 0.10
      }
    },
    llm: {
      name: "NCQ LLM Platform",
      shortName: "LLM",
      color: "#8b5cf6",
      icon: "Brain",
      description: "Arabic-first AI platform for enterprises in MENA",
      marketSize: 56250000000, // SAR 56.25B
      growthRate: 0.35, // 35% CAGR
      yearlyData: [
        { year: 1, clients: 10, revenue: 1200000, monthlyRevenue: 100000 },
        { year: 2, clients: 50, revenue: 4500000, monthlyRevenue: 375000 },
        { year: 3, clients: 150, revenue: 13500000, monthlyRevenue: 1125000 },
        { year: 4, clients: 300, revenue: 27000000, monthlyRevenue: 2250000 },
        { year: 5, clients: 500, revenue: 45000000, monthlyRevenue: 3750000 }
      ],
      pricing: {
        government: { monthly: 50000, tokens: "Unlimited", support: "24/7" },
        enterprise: { monthly: 8000, tokens: "20M", support: "Priority" },
        professional: { monthly: 2500, tokens: "2M", support: "Business" },
        starter: { monthly: 500, tokens: "100K", support: "Email" }
      },
      costs: {
        infrastructure: 0.30,
        modelLicensing: 0.15,
        rd: 0.20,
        marketing: 0.15,
        operations: 0.10,
        support: 0.05
      }
    },
    hospitality: {
      name: "Smart Hospitality",
      shortName: "Hospitality",
      color: "#10b981",
      icon: "Building2",
      description: "IoT-powered smart building & hotel management platform",
      marketSize: 31880000000, // SAR 31.88B
      growthRate: 0.28, // 28% CAGR
      yearlyData: [
        { year: 1, clients: 8, revenue: 900000, monthlyRevenue: 75000 },
        { year: 2, clients: 30, revenue: 3375000, monthlyRevenue: 281250 },
        { year: 3, clients: 80, revenue: 9000000, monthlyRevenue: 750000 },
        { year: 4, clients: 150, revenue: 18000000, monthlyRevenue: 1500000 },
        { year: 5, clients: 250, revenue: 30000000, monthlyRevenue: 2500000 }
      ],
      pricing: {
        enterprise: { monthly: 12000, rooms: "Unlimited", features: "All" },
        professional: { monthly: 4000, rooms: 200, features: "Advanced" },
        starter: { monthly: 1200, rooms: 50, features: "Basic" }
      },
      costs: {
        hardware: 0.25,
        installation: 0.15,
        rd: 0.15,
        marketing: 0.20,
        operations: 0.15,
        infrastructure: 0.05
      }
    }
  },
  platform: {
    totalInvestmentRequired: 15000000, // SAR 15M
    marketingBudget: 22500000, // SAR 22.5M over 5 years (1.5x investment for marketing)
    expectedROI: 9.5, // 950% over 5 years (more realistic)
    breakEvenMonth: 18,
    yearlyTotals: [
      { year: 1, revenue: 3600000, costs: 8000000, profit: -4400000, margin: -1.22 },
      { year: 2, revenue: 14625000, costs: 12000000, profit: 2625000, margin: 0.18 },
      { year: 3, revenue: 40500000, costs: 22000000, profit: 18500000, margin: 0.46 },
      { year: 4, revenue: 81000000, costs: 35000000, profit: 46000000, margin: 0.57 },
      { year: 5, revenue: 142500000, costs: 52000000, profit: 90500000, margin: 0.63 }
    ]
  }
};