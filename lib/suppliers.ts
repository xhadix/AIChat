// lib/suppliers.ts

export type Supplier = {
  id: string;
  name: string;
  riskScore: number;
  riskCategories: string[];
  location: string;
  industry: string;
};

export const suppliers: Supplier[] = [
  {
    id: "s001",
    name: "MediTech Solutions",
    riskScore: 8,
    riskCategories: ["Data Privacy", "Regulatory Compliance", "Financial Stability"],
    location: "United States",
    industry: "Healthcare"
  },
  {
    id: "s002",
    name: "GlobalTransport Logistics",
    riskScore: 6,
    riskCategories: ["Environmental", "Labor Practices"],
    location: "Germany",
    industry: "Transportation"
  },
  {
    id: "s003",
    name: "EcoManufacturing Inc",
    riskScore: 3,
    riskCategories: ["Quality Control", "Supply Chain"],
    location: "Canada",
    industry: "Manufacturing"
  },
  {
    id: "s004",
    name: "SecureTech Systems",
    riskScore: 7,
    riskCategories: ["Data Privacy", "Cybersecurity", "Financial Stability"],
    location: "United Kingdom",
    industry: "Technology"
  },
  {
    id: "s005",
    name: "PharmaGlobal Ltd",
    riskScore: 9,
    riskCategories: ["Regulatory Compliance", "Quality Control", "Environmental"],
    location: "Switzerland",
    industry: "Healthcare"
  },
  {
    id: "s006",
    name: "AgriHarvest Co",
    riskScore: 4,
    riskCategories: ["Environmental", "Supply Chain"],
    location: "Brazil",
    industry: "Agriculture"
  },
  {
    id: "s007",
    name: "FinancePartners Group",
    riskScore: 8,
    riskCategories: ["Financial Stability", "Regulatory Compliance", "Data Privacy"],
    location: "Singapore",
    industry: "Financial Services"
  },
  {
    id: "s008",
    name: "EnergyFuture Corp",
    riskScore: 7,
    riskCategories: ["Environmental", "Regulatory Compliance", "Safety"],
    location: "Australia",
    industry: "Energy"
  },
  {
    id: "s009",
    name: "RetailExpress Ltd",
    riskScore: 5,
    riskCategories: ["Supply Chain", "Labor Practices"],
    location: "United States",
    industry: "Retail"
  },
  {
    id: "s010",
    name: "CloudCompute Systems",
    riskScore: 6,
    riskCategories: ["Cybersecurity", "Data Privacy"],
    location: "Ireland",
    industry: "Technology"
  }
];

export function filterSuppliersByRiskScore(minScore: number): Supplier[] {
  return suppliers.filter(supplier => supplier.riskScore >= minScore);
}

export function getHighestRiskSuppliers(count: number = 3): Supplier[] {
  return [...suppliers]
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, count);
}

export function filterSuppliersByIndustry(industry: string): Supplier[] {
  return suppliers.filter(supplier => 
    supplier.industry.toLowerCase() === industry.toLowerCase()
  );
}

export function filterSuppliersByRiskCategory(category: string): Supplier[] {
  return suppliers.filter(supplier => 
    supplier.riskCategories.some(cat => 
      cat.toLowerCase().includes(category.toLowerCase())
    )
  );
}

export function filterSuppliersByLocation(location: string): Supplier[] {
  return suppliers.filter(supplier => 
    supplier.location.toLowerCase().includes(location.toLowerCase())
  );
}

export function searchSuppliers(query: string): Supplier[] {
  const lowerQuery = query.toLowerCase();
  return suppliers.filter(supplier => 
    supplier.name.toLowerCase().includes(lowerQuery) ||
    supplier.industry.toLowerCase().includes(lowerQuery) ||
    supplier.location.toLowerCase().includes(lowerQuery) ||
    supplier.riskCategories.some(cat => cat.toLowerCase().includes(lowerQuery))
  );
}