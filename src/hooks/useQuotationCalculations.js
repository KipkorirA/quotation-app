// src/hooks/useQuotationCalculations.js
import { useMemo } from 'react';

export const useQuotationCalculations = (items = []) => {
  const subtotal = useMemo(() => {
    if (!items || !Array.isArray(items)) return 0;
    return items.reduce((sum, item) => {
      const quantity = parseFloat(item.quantity) || 0;
      const price = parseFloat(item.unit_price) || 0;
      return sum + (quantity * price);
    }, 0).toFixed(2);
  }, [items]);

  const calculateTotals = (data = {}) => {
    const taxRate = parseFloat(data.tax_rate || 0);
    const discount = parseFloat(data.discount || 0);
    const validityPeriod = parseInt(data.validity_period || 30);

    const numericSubtotal = Number(subtotal);
    const taxAmount = (numericSubtotal * (taxRate / 100)).toFixed(2);
    const totalAmount = (numericSubtotal - discount + Number(taxAmount)).toFixed(2);

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + validityPeriod);

    return {
      subtotal: numericSubtotal.toFixed(2),
      taxAmount,
      totalAmount,
      validityPeriod,
      expiryDate: expiryDate.toISOString(),
      itemCount: items?.length || 0
    };
  };

  return { subtotal, calculateTotals };
};