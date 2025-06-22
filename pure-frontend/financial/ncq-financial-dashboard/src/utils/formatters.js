const SAR_TO_USD = 0.266667; // 1 SAR = 0.266667 USD (1 USD = 3.75 SAR)
const USD_TO_SAR = 3.75; // 1 USD = 3.75 SAR

// Get current language from localStorage or default
const getCurrentLanguage = () => {
  return localStorage.getItem('language') || 'en';
};

// Create a React hook version that can access the language context
export const useFormatters = () => {
  const language = getCurrentLanguage();
  const locale = language === 'ar' ? 'ar-SA' : 'en-US';
  
  return {
    formatCurrency: (sarValue, displayCurrency = 'SAR', showBoth = false) => formatCurrency(sarValue, displayCurrency, showBoth),
    formatNumber: (value) => formatNumber(value),
    formatPercentage: (value, decimals = 1) => formatPercentage(value, decimals),
    formatCompactNumber: (sarValue, displayCurrency = 'SAR') => formatCompactNumber(sarValue, displayCurrency),
    convertToUSD: (sarAmount) => convertToUSD(sarAmount),
    convertToSAR: (usdAmount) => convertToSAR(usdAmount)
  };
};

// All financial data in the system is stored in SAR (base currency)
// This function converts and formats based on the display currency
export const formatCurrency = (sarValue, displayCurrency = 'SAR', showBoth = false) => {
  if (typeof sarValue !== 'number') return '0';
  
  // Convert SAR to USD if needed
  const usdValue = sarValue * SAR_TO_USD;
  
  const language = getCurrentLanguage();
  const locale = language === 'ar' ? 'ar-SA' : 'en-US';
  
  const sarFormatted = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'SAR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(sarValue).replace('SAR', language === 'ar' ? 'ريال ' : 'SAR ');
  
  const usdFormatted = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(usdValue);
  
  if (showBoth) {
    return displayCurrency === 'SAR' 
      ? `${sarFormatted} (${usdFormatted})`
      : `${usdFormatted} (${sarFormatted})`;
  }
  
  return displayCurrency === 'SAR' ? sarFormatted : usdFormatted;
};

export const formatNumber = (value) => {
  if (typeof value !== 'number') return '0';
  
  const language = getCurrentLanguage();
  const locale = language === 'ar' ? 'ar-SA' : 'en-US';
  
  return new Intl.NumberFormat(locale).format(value);
};

export const formatPercentage = (value, decimals = 1) => {
  if (typeof value !== 'number') return '0%';
  
  return `${(value * 100).toFixed(decimals)}%`;
};

export const formatCompactNumber = (sarValue, displayCurrency = 'SAR') => {
  if (typeof sarValue !== 'number') return '0';
  
  const language = getCurrentLanguage();
  const locale = language === 'ar' ? 'ar-SA' : 'en-US';
  
  // Convert to display currency if needed
  const value = displayCurrency === 'USD' ? sarValue * SAR_TO_USD : sarValue;
  const symbol = displayCurrency === 'USD' ? '$' : (language === 'ar' ? 'ريال ' : 'SAR ');
  
  // Format number part
  const formatNum = (num) => new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(num);
  
  if (value >= 1e9) {
    const suffix = language === 'ar' ? 'مليار' : 'B';
    return `${symbol}${formatNum(value / 1e9)}${suffix}`;
  } else if (value >= 1e6) {
    const suffix = language === 'ar' ? 'مليون' : 'M';
    return `${symbol}${formatNum(value / 1e6)}${suffix}`;
  } else if (value >= 1e3) {
    const suffix = language === 'ar' ? 'ألف' : 'K';
    return `${symbol}${formatNum(value / 1e3)}${suffix}`;
  }
  
  return `${symbol}${new Intl.NumberFormat(locale).format(Math.round(value))}`;
};

export const convertToUSD = (sarAmount) => {
  return sarAmount * SAR_TO_USD;
};

export const convertToSAR = (usdAmount) => {
  return usdAmount * USD_TO_SAR;
};