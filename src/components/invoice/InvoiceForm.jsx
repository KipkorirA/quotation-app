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
    items: invoice?.items || []
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      console.log('Starting invoice submission...', { formData });
      
      const url = invoice ? `http://127.0.0.1:5000/invoices/${invoice.id}` : 'http://127.0.0.1:5000/invoices';
      const method = invoice ? 'PUT' : 'POST';
      
      console.log('Sending request to:', url, 'with method:', method);
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('Server error details:', errorData);
        throw new Error(`Failed to save invoice: ${response.status} ${response.statusText}`);
      }
      
      const savedData = await response.json();
      console.log('Invoice saved successfully:', savedData);
      
      onSubmit();
    } catch (error) {
      console.error('Error saving invoice:', {
        message: error.message,
        stack: error.stack,
        formData
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <h2 className="text-xl font-bold mb-4">
          {invoice ? 'Edit Invoice' : 'Create Invoice'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="border p-2 rounded"
              required
            />
            
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              className="border p-2 rounded"
              required
            />
            
            <input
              type="text"
              placeholder="Description"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="border p-2 rounded"
              required
            />
            
            <input
              type="date"
              value={formData.due_date}
              onChange={e => setFormData({ ...formData, due_date: e.target.value })}
              className="border p-2 rounded"
              required
            />
            
            <select
              value={formData.status}
              onChange={e => setFormData({ ...formData, status: e.target.value })}
              className="border p-2 rounded"
            >
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>

          <InvoiceItems
            items={formData.items}
            onChange={items => setFormData({ ...formData, items })}
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {invoice ? 'Update' : 'Create'} Invoice
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
    items: PropTypes.array
  }),
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

export default InvoiceForm;