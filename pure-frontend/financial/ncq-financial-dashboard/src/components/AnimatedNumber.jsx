import React from 'react';
import { motion } from 'framer-motion';
import { useAnimatedValue } from '../hooks/useAnimatedValue';
import { formatCurrency, formatNumber, formatPercentage, formatCompactNumber } from '../utils/formatters';
import { useCurrency } from '../contexts/CurrencyContext';

const AnimatedNumber = ({ 
  value, 
  format = 'number', 
  duration = 2000, 
  prefix = '', 
  suffix = '', 
  decimals = 0,
  className = ''
}) => {
  const animatedValue = useAnimatedValue(value, duration);
  const { displayCurrency } = useCurrency();
  
  const formatValue = () => {
    switch (format) {
      case 'currency':
        return formatCurrency(animatedValue, displayCurrency);
      case 'compact-currency':
        return formatCompactNumber(animatedValue, displayCurrency);
      case 'percentage':
        return formatPercentage(animatedValue / 100, decimals);
      case 'number':
      default:
        return formatNumber(Math.round(animatedValue));
    }
  };

  return (
    <motion.span
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`text-gray-900 dark:text-white ${className}`}
    >
      {prefix}{formatValue()}{suffix}
    </motion.span>
  );
};

export default AnimatedNumber;