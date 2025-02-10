// src/hooks/useInitialData.js
import { useState, useCallback, useEffect } from 'react';
import { api } from '../api';
import { toast } from 'react-toastify';

export const useInitialData = () => {
  const [data, setData] = useState({
    customers: [],
    projects: [],
    products: [],
    isLoading: false,
    error: null
  });

  const fetchData = useCallback(async () => {
    setData(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const [customersData, projectsData, productsData] = await Promise.all([
        api.get('/customers'),
        api.get('/api/projects'),
        api.get('/products'),
      ]);

      setData({
        customers: customersData.data || [],
        projects: projectsData.data || [],
        products: productsData.data || [],
        isLoading: false,
        error: null
      });
    } catch (error) {
      setData(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to load necessary data'
      }));
      console.error('Error fetching data:', error);
      toast.error('Failed to load necessary data. Please try again.');
    }
  }, []);

  useEffect(() => {
    fetchData();
    return () => {
      setData(prev => ({
        ...prev,
        customers: [],
        projects: [],
        products: []
      }));
    };
  }, [fetchData]);

  return { ...data, refetch: fetchData };
};