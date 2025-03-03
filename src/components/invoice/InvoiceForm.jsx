// InvoiceForm.jsx
import { useState } from 'react';
import PropTypes from 'prop-types';
import InvoiceItems from './InvoiceItems';

const InvoiceForm = ({ invoice, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: invoice?.name || '',
    email: invoice?.email || '',
    description: invoice?.description || '',
    due_date: invoice?.due_date || '',
    status: invoice?.status || 'pending',
    items: invoice?.items || [],
    created_by: invoice?.created_by || 1,
    subtotal: invoice?.subtotal || 0,
    tax_amount: invoice?.tax_amount || 0,
    total: invoice?.total || 0,
    address: invoice?.address || '',
    phone: invoice?.phone || '',
    discount: invoice?.discount || 10.0,
    tax_rate: invoice?.tax_rate || 0.1,
    terms_conditions: invoice?.terms_conditions || 'Standard terms'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const subtotal = formData.items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
      const tax_amount = subtotal * formData.tax_rate;
      const total = subtotal + tax_amount - formData.discount;

      const dataToSubmit = {
        ...formData,
        subtotal,
        tax_amount,
        total
      };
      
      console.log("Submitting Invoice Data:", dataToSubmit);
      
      const url = invoice ? `https://techknow-backend.onrender.com/invoices/${invoice.id}` : 'https://techknow-backend.onrender.com/invoices';
      const method = invoice ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSubmit)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error("POST request failed:", errorData);
        throw new Error(`Failed to save invoice: ${response.status} ${response.statusText}`);
      }
      
      const savedData = await response.json();
      console.log(`${method} request successful:`, savedData);
      onSubmit();
    } catch (error) {
      console.error('Error saving invoice:', error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 to-black bg-opacity-75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-[99999]">
      <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-100 relative">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center transition-all duration-200 hover:bg-gray-200"
          aria-label="Close form"
        >
          ×
        </button>

        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
            {invoice ? '✏️ Edit Invoice' : '📝 Create Invoice'}
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="border border-gray-300 p-3 rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-400"
              required
            />
            
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              className="border border-gray-300 p-3 rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-400"
              required
            />
            
            <input
              type="text"
              placeholder="Description"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="border border-gray-300 p-3 rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-400"
              required
            />
            
            <input
              type="date"
              value={formData.due_date}
              onChange={e => setFormData({ ...formData, due_date: e.target.value })}
              className="border border-gray-300 p-3 rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-400"
              required
            />

            <input
              type="text"
              placeholder="Address"
              value={formData.address}
              onChange={e => setFormData({ ...formData, address: e.target.value })}
              className="border border-gray-300 p-3 rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-400"
              required
            />

            <input
              type="tel"
              placeholder="Phone"
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
              className="border border-gray-300 p-3 rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-400"
              required
            />

            <input
              type="number"
              placeholder="Discount"
              value={formData.discount}
              onChange={e => setFormData({ ...formData, discount: parseFloat(e.target.value) })}
              className="border border-gray-300 p-3 rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-400"
              required
            />

            <input
              type="number"
              placeholder="Tax Rate"
              value={formData.tax_rate}
              onChange={e => setFormData({ ...formData, tax_rate: parseFloat(e.target.value) })}
              className="border border-gray-300 p-3 rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-400"
              required
              step="0.01"
            />
            
            <select
              value={formData.status}
              onChange={e => setFormData({ ...formData, status: e.target.value })}
              className="border border-gray-300 p-3 rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-400"
            >
              <option value="pending">⏳ Pending</option>
              <option value="paid">✅ Paid</option>
              <option value="overdue">⚠️ Overdue</option>
            </select>

            <textarea
              placeholder="Terms and Conditions"
              value={formData.terms_conditions}
              onChange={e => setFormData({ ...formData, terms_conditions: e.target.value })}
              className="border border-gray-300 p-3 rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-400"
              required
            />
          </div>

          <InvoiceItems
            items={formData.items}
            onChange={items => setFormData(prevData => ({ ...prevData, items }))}
          />

          <div className="flex justify-end gap-4 pt-4 border-t">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-medium transition-all duration-200 text-sm sm:text-base hover:shadow-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-all duration-200 text-sm sm:text-base hover:shadow-md transform hover:-translate-y-0.5"
            >
              {invoice ? '🔄 Update' : '✨ Create'} Invoice
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

InvoiceForm.propTypes = {
  invoice: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    email: PropTypes.string,
    description: PropTypes.string,
    due_date: PropTypes.string,
    status: PropTypes.string,
    items: PropTypes.array,
    created_by: PropTypes.number,
    subtotal: PropTypes.number,
    tax_amount: PropTypes.number,
    total: PropTypes.number,
    address: PropTypes.string,
    phone: PropTypes.string,
    discount: PropTypes.number,
    tax_rate: PropTypes.number,
    terms_conditions: PropTypes.string
  }),
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

export default InvoiceForm;