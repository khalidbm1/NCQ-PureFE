import React, { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext();

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

export const CurrencyProvider = ({ children }) => {
  const [displayCurrency, setDisplayCurrency] = useState('SAR');

  const toggleCurrency = () => {
    const newCurrency = displayCurrency === 'SAR' ? 'USD' : 'SAR';
    setDisplayCurrency(newCurrency);
    localStorage.setItem('displayCurrency', newCurrency);
  };

  useEffect(() => {
    // Load saved currency preference from localStorage
    const savedCurrency = localStorage.getItem('displayCurrency');
    if (savedCurrency && ['SAR', 'USD'].includes(savedCurrency)) {
      setDisplayCurrency(savedCurrency);
    }
  }, []);

  const value = {
    displayCurrency,
    setDisplayCurrency,
    toggleCurrency,
    isSAR: displayCurrency === 'SAR',
    isUSD: displayCurrency === 'USD'
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};