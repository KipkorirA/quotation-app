// src/components/QuotationForm/ProductList.jsx
import PropTypes from 'prop-types';

export const ProductList = ({ fields, products, register, remove, onAddProduct }) => {
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
        <button
          type="button"
          onClick={onAddProduct}
          className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition duration-200"
        >
          Add Product
        </button>
      </div>
    );
  };
  
  ProductList.propTypes = {
    fields: PropTypes.array.isRequired,
    products: PropTypes.array.isRequired,
    register: PropTypes.func.isRequired,
    remove: PropTypes.func.isRequired,
    onAddProduct: PropTypes.func.isRequired,
  };
