// src/components/QuotationForm/useQuotationForm.js
import { useState, useEffect } from 'react';
import { api } from '../../api';
import { toast } from 'react-toastify';

export const useQuotationForm = () => {
  const [customers, setCustomers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [products, setProducts] = useState([]);
  const [quotations, setQuotations] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);

  const handleNewCustomerSubmit = async (customerData) => {
    try {
      const response = await api.post('/customers', customerData);
      setCustomers(prev => [...prev, response.data]);
      toast.success('Customer added successfully');
      return response.data;
    } catch (error) {
      console.error('Error adding customer:', error);
      toast.error('Failed to add customer');
      throw error;
    }
  };

  const handleProductSelect = (product, quantity) => {
    setSelectedProducts(prev => [...prev, { ...product, quantity }]);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [customersData, projectsData, productsData, quotationsData] = await Promise.all([
          api.get('/customers').then(res => res.data),
          api.get('/api/projects').then(res => res.data),
          api.get('/products').then(res => res.data),
          api.get('/quotations').then(res => res.data)
        ]);

        setCustomers(Array.isArray(customersData) ? customersData : []);
        setProjects(Array.isArray(projectsData) ? projectsData : []);
        setProducts(Array.isArray(productsData) ? productsData : []);
        setQuotations(Array.isArray(quotationsData) ? quotationsData : []);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load data');
        // Initialize with empty arrays in case of error
        setCustomers([]);
        setProjects([]);
        setProducts([]);
        setQuotations([]);
      }
    };
    fetchData();
  }, []);

  return {
    customers,
    projects,
    products: Array.isArray(products) ? products : [],
    quotations,
    selectedProducts,
    handleNewCustomerSubmit,
    handleProductSelect,
    append: () => {}, // Adding empty append function to satisfy prop requirement
  };
};