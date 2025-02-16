// InvoiceCard.jsx
import { useState } from 'react';
import PropTypes from 'prop-types';
import InvoiceForm from './InvoiceForm';

const InvoiceCard = ({ invoice, onUpdate }) => {
  const [showEdit, setShowEdit] = useState(false);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      try {
        const response = await fetch(`https://techknow-backend.onrender.com/invoices/${invoice.id}`, { method: 'DELETE' });
        if (!response.ok) {
          throw new Error('Failed to delete invoice');
        }
        onUpdate();
      } catch (error) {
        console.error('Error deleting invoice:', error);
      }
    }
  };

  return (
    <div className="border rounded-lg p-4 shadow">
      {showEdit ? (
        <InvoiceForm
          invoice={invoice}
          onSubmit={() => {
            onUpdate();
            setShowEdit(false);
          }}
          onCancel={() => setShowEdit(false)}
        />
      ) : (
        <>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-bold text-lg">Invoice #{invoice.id}</h3>
              <p className="text-gray-600">{invoice.name}</p>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => setShowEdit(true)}
                className="text-blue-500 hover:text-blue-600"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="text-red-500 hover:text-red-600"
              >
                Delete
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <p><span className="font-semibold">Email:</span> {invoice.email}</p>
            <p><span className="font-semibold">Status:</span> {invoice.status}</p>
            <p><span className="font-semibold">Due Date:</span> {new Date(invoice.due_date).toLocaleDateString()}</p>
            <p><span className="font-semibold">Total:</span> ${invoice.total}</p>
          </div>

          {Array.isArray(invoice.items) && invoice.items.length > 0 && (
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Items</h4>
              <div className="space-y-2">
                {invoice.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{item.description}</span>
                    <span>${item.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

InvoiceCard.propTypes = {
  invoice: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    due_date: PropTypes.string.isRequired,
    total: PropTypes.number.isRequired,
    items: PropTypes.arrayOf(PropTypes.shape({
      description: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired
    }))
  }).isRequired,
  onUpdate: PropTypes.func.isRequired
};

export default InvoiceCard;