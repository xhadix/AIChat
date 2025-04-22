
// lib/actions/supplierRisk.ts

import { 
  suppliers, 
  filterSuppliersByRiskScore, 
  getHighestRiskSuppliers, 
  filterSuppliersByIndustry,
  filterSuppliersByRiskCategory,
  filterSuppliersByLocation,
  searchSuppliers
} from '../suppliers';

export type SupplierQuery = {
  type: 'highest_risk' | 'by_industry' | 'by_risk_category' | 'by_location' | 'by_min_score' | 'search';
  value?: string;
  count?: number;
  minScore?: number;
};

export async function querySuppliers(query: SupplierQuery) {
  // Simulate network latency for realism
  await new Promise(resolve => setTimeout(resolve, 800));

  try {
    switch (query.type) {
      case 'highest_risk':
        return getHighestRiskSuppliers(query.count || 3);
      
      case 'by_industry':
        if (!query.value) return { error: 'Industry not specified' };
        return filterSuppliersByIndustry(query.value);
      
      case 'by_risk_category':
        if (!query.value) return { error: 'Risk category not specified' };
        return filterSuppliersByRiskCategory(query.value);
      
      case 'by_location':
        if (!query.value) return { error: 'Location not specified' };
        return filterSuppliersByLocation(query.value);
      
      case 'by_min_score':
        const minScore = query.minScore || 5;
        return filterSuppliersByRiskScore(minScore);
      
      case 'search':
        if (!query.value) return { error: 'Search query not specified' };
        return searchSuppliers(query.value);
      
      default:
        return { error: 'Invalid query type' };
    }
  } catch (error) {
    console.error('Error querying suppliers:', error);
    return { error: 'Failed to query suppliers' };
  }
}