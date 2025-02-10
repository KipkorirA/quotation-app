// src/components/QuotationForm/useQuotationForm.js
import { useState, useEffect } from 'react';
import { api } from '../../api';
import { toast } from 'react-toastify';

export const useQuotationForm = () => {
  const [customers, setCustomers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const customersData = await api.get('/customers').then(res => res.data);
        const projectsData = await api.get('/api/projects').then(res => res.data);
        const productsData = await api.get('/products').then(res => res.data);
        setCustomers(Array.isArray(customersData) ? customersData : []);
        setProjects(Array.isArray(projectsData) ? projectsData : []);
        setProducts(Array.isArray(productsData) ? productsData : []);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load customers, projects and products');
      }
    };
    fetchData();
  }, []);

  return {
    customers,
    projects,
    products,
  };
};