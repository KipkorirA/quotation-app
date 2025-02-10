// src/hooks/useQuotationCalculations.js
import { useMemo } from 'react';

export const useQuotationCalculations = (products) => {
  const subtotal = useMemo(() => {
    if (!products) return 0;
    return products.reduce((sum, product) => {
      const quantity = parseFloat(product.quantity) || 0;
      const price = parseFloat(product.unit_price) || 0;
      return sum + (quantity * price);
    }, 0).toFixed(2);
  }, [products]);

  const calculateTotals = (data) => {
    const taxRate = parseFloat(data.tax_rate || 0);
    const discount = parseFloat(data.discount || 0);
    
    const taxAmount = (parseFloat(subtotal) * (taxRate / 100)).toFixed(2);
    const totalAmount = (parseFloat(subtotal) - discount + parseFloat(taxAmount)).toFixed(2);
    
    return { taxAmount, totalAmount };
  };

  return { subtotal, calculateTotals };
};