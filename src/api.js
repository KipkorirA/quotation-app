import axios from 'axios';

const API_BASE_URL = 'https://techknow-backend.onrender.com'; // Flask backend URL

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Quotation APIs
export const fetchQuotations = () => api.get('/quotations/');
export const createQuotation = (data) => api.post('/quotations/', data);
export const updateQuotation = (id, data) => api.put(`/quotations/${id}`, data);
export const deleteQuotation = (id) => api.delete(`/quotations/${id}`);

// Product APIs
export const fetchProducts = () => api.get('/products/');
export const createProduct = (data) => api.post('/products/', data);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);

// Project APIs
export const fetchProjects = () => api.get('/projects/');
export const createProject = (data) => api.post('/projects/', data);
export const updateProject = (id, data) => api.put(`/projects/${id}`, data);
export const deleteProject = (id) => api.delete(`/projects/${id}`);

// Customer APIs
export const fetchCustomers = () => api.get('/customers/');
export const createCustomer = (data) => api.post('/customers/', data);
export const updateCustomer = (id, data) => api.put(`/customers/${id}`, data);
export const deleteCustomer = (id) => api.delete(`/customers/${id}`);

// Email APIs
export const sendEmail = (data) => api.post('/send-mail', data);