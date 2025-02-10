// src/hooks/useCustomerDetails.js
import { useState, useCallback, useEffect } from 'react';
import { api } from '../api';
import { toast } from 'react-toastify';

export const useCustomerDetails = (customerId) => {
  const [customerDetails, setCustomerDetails] = useState({
    orders: [],
    messages: [],
    projects: [],
    isLoading: false,
    error: null
  });

  const fetchCustomerDetails = useCallback(async (id) => {
    if (!id) {
      setCustomerDetails(prev => ({
        ...prev,
        orders: [],
        messages: [],
        projects: []
      }));
      return;
    }

    setCustomerDetails(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const [orders, messages, projects] = await Promise.all([
        api.get(`/orders?customer_id=${id}`),
        api.get(`/messages?customer_id=${id}`),
        api.get(`/api/projects?customer_id=${id}`)
      ]);

      setCustomerDetails({
        orders: orders.data || [],
        messages: messages.data || [],
        projects: projects.data || [],
        isLoading: false,
        error: null
      });
    } catch (error) {
      setCustomerDetails(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to load customer details'
      }));
      console.error('Error fetching customer details:', error);
      toast.error('Failed to load customer details');
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    
    if (customerId && isMounted) {
      fetchCustomerDetails(customerId);
    }
    
    return () => {
      isMounted = false;
    };
  }, [customerId, fetchCustomerDetails]);

  return customerDetails;
};