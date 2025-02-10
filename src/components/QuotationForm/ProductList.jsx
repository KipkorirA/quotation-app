// src/components/QuotationForm/ProductList.jsx
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

export const ProductList = ({ fields, register, remove, onAddProduct }) => {
    const [products, setProducts] = useState([]);
    const [showNewProductForm, setShowNewProductForm] = useState(false);
    const [newProduct, setNewProduct] = useState({
      name: '',
      description: '',
      price: '',
      stock: '',
      image_url: '',
      available: true,
      is_active: true,
      rating: ''
    });
    
    useEffect(() => {
      const fetchProducts = async () => {
        try {
          const response = await fetch('https://techknow-backend.onrender.com/products');
          const data = await response.json();
          setProducts(data?.products || []);
        } catch (error) {
          console.error('Error fetching products:', error);
          setProducts([]);
        }
      };
      
      fetchProducts();
    }, []);

    const handleNewProductSubmit = async (e) => {
      e.preventDefault();
      try {
        const formData = new FormData();
        Object.entries(newProduct).forEach(([key, value]) => {
          formData.append(key === 'image_url' ? 'image' : key, value);
        });

        const response = await fetch('https://techknow-backend.onrender.com/products', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
        }

        const { product } = await response.json();
        setProducts(prev => [...prev, product]);
        setShowNewProductForm(false);
        setNewProduct({
          name: '',
          description: '',
          price: '',
          stock: '',
          image_url: '',
          available: true,
          is_active: true,
          rating: ''
        });
      } catch (error) {
        console.error('Error creating product:', error);
      }
    };

    const handleInputChange = (e, field) => {
      const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
      setNewProduct(prev => ({ ...prev, [field]: value }));
    };
    
    return (
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">Products</label>
        {fields.map((field, index) => (
          <div key={field.id || index} className="flex gap-4">
            <select
              {...register(`products.${index}.product_id`)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Product</option>
              {products.map(product => (
                <option key={product.id} value={product.id}>
                  {product.name} - ${product.price}
                </option>
              ))}
            </select>
            <input
              {...register(`products.${index}.quantity`)}
              type="number"
              min="1"
              placeholder="Qty"
              className="w-24 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
            <input
              {...register(`products.${index}.unit_price`)}
              type="number"
              step="0.01"
              placeholder="Unit Price"
              className="w-32 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => remove(index)}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-200"
              aria-label="Remove product"
            >
              Remove
            </button>
          </div>
        ))}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onAddProduct}
            className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition duration-200"
          >
            Add Product
          </button>
          <button
            type="button"
            onClick={() => setShowNewProductForm(!showNewProductForm)}
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
          >
            Create New Product
          </button>
        </div>
        
        {showNewProductForm && (
          <div className="space-y-4 mt-4 p-4 border rounded-md">
            <input
              type="text"
              placeholder="Product Name"
              value={newProduct.name}
              onChange={(e) => handleInputChange(e, 'name')}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            />
            <textarea
              placeholder="Description"
              value={newProduct.description}
              onChange={(e) => handleInputChange(e, 'description')}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            />
            <input
              type="number"
              step="0.01"
              placeholder="Price"
              value={newProduct.price}
              onChange={(e) => handleInputChange(e, 'price')}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            />
            <input
              type="number"
              placeholder="Stock"
              value={newProduct.stock}
              onChange={(e) => handleInputChange(e, 'stock')}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleInputChange(e, 'image_url')}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            />
            <div className="flex items-center gap-4">
              <label>
                <input
                  type="checkbox"
                  checked={newProduct.available}
                  onChange={(e) => handleInputChange(e, 'available')}
                  className="mr-2"
                />
                Available
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={newProduct.is_active}
                  onChange={(e) => handleInputChange(e, 'is_active')}
                  className="mr-2"
                />
                Active
              </label>
            </div>
            <input
              type="number"
              step="0.1"
              min="0"
              max="5"
              placeholder="Rating (0-5)"
              value={newProduct.rating}
              onChange={(e) => handleInputChange(e, 'rating')}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            />
            <button
              type="button"
              onClick={handleNewProductSubmit}
              className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-200"
            >
              Create Product
            </button>
          </div>
        )}
      </div>
    );
  };
  
  ProductList.propTypes = {
    fields: PropTypes.array.isRequired,
    register: PropTypes.func.isRequired,
    remove: PropTypes.func.isRequired,
    onAddProduct: PropTypes.func.isRequired,
  };