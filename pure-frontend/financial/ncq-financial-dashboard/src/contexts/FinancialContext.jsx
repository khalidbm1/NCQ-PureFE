import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialFinancialData } from '../data/initialData';

const FinancialContext = createContext();

export const useFinancial = () => {
  const context = useContext(FinancialContext);
  if (!context) {
    throw new Error('useFinancial must be used within a FinancialProvider');
  }
  return context;
};

export const FinancialProvider = ({ children }) => {
  const [financialData, setFinancialData] = useState(() => {
    const savedData = localStorage.getItem('ncq-financial-data');
    return savedData ? JSON.parse(savedData) : initialFinancialData;
  });

  const [selectedProduct, setSelectedProduct] = useState('pgw');
  const [selectedYear, setSelectedYear] = useState(5);
  const [comparisonMode, setComparisonMode] = useState(false);
  const [compareProducts, setCompareProducts] = useState(['pgw', 'llm']);

  useEffect(() => {
    localStorage.setItem('ncq-financial-data', JSON.stringify(financialData));
  }, [financialData]);

  const updateProductData = (productKey, field, value) => {
    setFinancialData(prev => ({
      ...prev,
      products: {
        ...prev.products,
        [productKey]: {
          ...prev.products[productKey],
          [field]: value
        }
      }
    }));
  };

  const updateYearlyData = (productKey, yearIndex, field, value) => {
    setFinancialData(prev => ({
      ...prev,
      products: {
        ...prev.products,
        [productKey]: {
          ...prev.products[productKey],
          yearlyData: prev.products[productKey].yearlyData.map((data, index) =>
            index === yearIndex ? { ...data, [field]: value } : data
          )
        }
      }
    }));
  };

  const updatePricing = (productKey, tier, field, value) => {
    setFinancialData(prev => ({
      ...prev,
      products: {
        ...prev.products,
        [productKey]: {
          ...prev.products[productKey],
          pricing: {
            ...prev.products[productKey].pricing,
            [tier]: {
              ...prev.products[productKey].pricing[tier],
              [field]: value
            }
          }
        }
      }
    }));
  };

  const recalculateProjections = (productKey) => {
    const product = financialData.products[productKey];
    const basePricing = product.pricing.enterprise.monthly;
    
    // Simple recalculation logic - can be enhanced
    const newYearlyData = product.yearlyData.map((data, index) => {
      const yearMultiplier = Math.pow(1.5, index); // Growth multiplier
      const clients = Math.round(data.clients);
      const monthlyRevenue = basePricing * clients * yearMultiplier;
      const revenue = monthlyRevenue * 12;
      
      return {
        ...data,
        revenue: Math.round(revenue),
        monthlyRevenue: Math.round(monthlyRevenue)
      };
    });

    updateProductData(productKey, 'yearlyData', newYearlyData);
  };

  const resetData = () => {
    setFinancialData(initialFinancialData);
    localStorage.removeItem('ncq-financial-data');
  };

  const value = {
    financialData,
    selectedProduct,
    setSelectedProduct,
    selectedYear,
    setSelectedYear,
    comparisonMode,
    setComparisonMode,
    compareProducts,
    setCompareProducts,
    updateProductData,
    updateYearlyData,
    updatePricing,
    recalculateProjections,
    resetData
  };

  return (
    <FinancialContext.Provider value={value}>
      {children}
    </FinancialContext.Provider>
  );
};