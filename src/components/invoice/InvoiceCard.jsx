// InvoiceCard.jsx
import { useState, useCallback, memo } from 'react';
import PropTypes from 'prop-types';
import InvoiceForm from './InvoiceForm';

const InvoiceCard = memo(({ invoice, onUpdate }) => {
  const [showEdit, setShowEdit] = useState(false);

  const handleDelete = useCallback(async () => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      try {
        const response = await fetch(`https://techknow-backend.onrender.com/invoices/${invoice.id}`, { 
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) {
          throw new Error(`Failed to delete invoice: ${response.statusText}`);
        }
        onUpdate();
      } catch (error) {
        console.error('Error deleting invoice:', error);
        alert('Failed to delete invoice. Please try again.');
      }
    }
  }, [invoice.id, onUpdate]);

  const handleDownload = useCallback(async () => {
    try {
      window.open(`https://techknow-backend.onrender.com/invoices/${invoice.id}/download`);
    } catch (error) {
      console.error('Error downloading invoice:', error);
      alert('Failed to download invoice. Please try again.');
    }
  }, [invoice.id]);

  const getStatusColor = useCallback((status) => {
    const statusColors = {
      'paid': 'bg-green-100 text-green-800',
      'pending': 'bg-yellow-100 text-yellow-800',
      'overdue': 'bg-red-100 text-red-800',
      'draft': 'bg-gray-100 text-gray-800'
    };
    return statusColors[status.toLowerCase()] || 'bg-blue-100 text-blue-800';
  }, []);

  const handleEdit = useCallback(() => setShowEdit(true), []);
  const handleCancel = useCallback(() => setShowEdit(false), []);
  const handleSubmit = useCallback(() => {
    onUpdate();
    setShowEdit(false);
  }, [onUpdate]);

  const formatCurrency = useCallback((amount) => {
    return `Ksh.${amount.toLocaleString()}`;
  }, []);

  return (
    <div className="border-2 rounded-xl p-3 sm:p-4 lg:p-8 shadow-2xl bg-white hover:shadow-3xl transition-all duration-300 hover:scale-[1.02] max-w-6xl mx-auto relative">
      {showEdit ? (
        <div className="absolute inset-0 z-50">
          <InvoiceForm
            invoice={invoice}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </div>
      ) : (
        <>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4 sm:mb-8">
            <div className="relative w-full sm:w-auto">
              <h3 className="font-bold text-xl sm:text-2xl lg:text-4xl text-gray-800 tracking-tight">Invoice #{invoice.id}</h3>
              <p className="text-sm sm:text-base lg:text-xl text-gray-600 mt-1 sm:mt-2 font-medium">{invoice.name}</p>
              <div className="absolute -left-2 top-0 w-1 h-full bg-blue-500 rounded-full"></div>
            </div>
            <div className="flex space-x-2 sm:space-x-4 mt-4 lg:mt-0 w-full sm:w-auto">
              <button
                onClick={handleDownload}
                className="flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base lg:text-lg bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200 transform hover:-translate-y-1 shadow-md hover:shadow-lg"
              >
                Download
              </button>
              <button
                onClick={handleEdit}
                className="flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base lg:text-lg bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 transform hover:-translate-y-1 shadow-md hover:shadow-lg"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base lg:text-lg bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 transform hover:-translate-y-1 shadow-md hover:shadow-lg"
              >
                Delete
              </button>
            </div>
          </div>

          <div className="space-y-3 sm:space-y-4 lg:space-y-6 bg-gray-50 p-3 sm:p-6 lg:p-8 rounded-xl backdrop-blur-sm shadow-inner">
            <div className="grid gap-3 sm:gap-6">
              <p className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm sm:text-base"><span className="font-semibold text-gray-700">Email:</span> <span className="text-blue-600 hover:text-blue-700 transition-colors break-all">{invoice.email}</span></p>
              <p className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm sm:text-base"><span className="font-semibold text-gray-700">Phone:</span> <span className="font-medium">{invoice.phone}</span></p>
              <p className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm sm:text-base"><span className="font-semibold text-gray-700">Address:</span> <span className="italic">{invoice.address}</span></p>
              <p className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm sm:text-base"><span className="font-semibold text-gray-700">Description:</span> <span>{invoice.description}</span></p>
              <p className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm sm:text-base"><span className="font-semibold text-gray-700">Status:</span> <span className={`px-4 sm:px-6 py-1 sm:py-2 rounded-full font-medium text-center ${getStatusColor(invoice.status)}`}>{invoice.status}</span></p>
              <p className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm sm:text-base"><span className="font-semibold text-gray-700">Due Date:</span> <span className="font-medium">{new Date(invoice.due_date).toLocaleDateString()}</span></p>
            </div>
            <div className="border-t border-gray-200 my-4 sm:my-6"></div>
            <div className="grid gap-3 sm:gap-6">
              <p className="flex justify-between items-center text-sm sm:text-base"><span className="font-semibold text-gray-700">Subtotal:</span> <span className="font-mono">{formatCurrency(invoice.subtotal)}</span></p>
              <p className="flex justify-between items-center text-sm sm:text-base"><span className="font-semibold text-gray-700">Tax Rate:</span> <span className="font-mono">{invoice.tax_rate * 100}%</span></p>
              <p className="flex justify-between items-center text-sm sm:text-base"><span className="font-semibold text-gray-700">Tax Amount:</span> <span className="font-mono">{formatCurrency(invoice.tax_amount)}</span></p>
              <p className="flex justify-between items-center text-sm sm:text-base"><span className="font-semibold text-gray-700">Discount:</span> <span className="font-mono text-green-600">{invoice.discount}%</span></p>
            </div>
            <p className="flex justify-between items-center text-lg sm:text-xl lg:text-2xl font-bold bg-white p-4 sm:p-6 rounded-lg shadow-sm"><span className="text-gray-700">Total:</span> <span className="font-mono text-blue-600">{formatCurrency(invoice.total)}</span></p>
          </div>

          {Array.isArray(invoice.items) && invoice.items.length > 0 && (
            <div className="mt-6 sm:mt-8 lg:mt-10">
              <h4 className="font-bold text-lg sm:text-xl lg:text-2xl mb-4 sm:mb-6 text-gray-800 flex items-center">
                <span className="mr-2">Items</span>
                <span className="text-sm sm:text-base bg-blue-100 text-blue-800 px-2 sm:px-3 py-1 rounded-full">{invoice.items.length}</span>
              </h4>
              <div className="bg-gray-50 rounded-xl p-3 sm:p-6 lg:p-8 shadow-inner">
                <div className="grid gap-3 sm:gap-4">
                  {invoice.items.map((item) => (
                    <div key={item.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm sm:text-base lg:text-lg py-3 sm:py-4 border-b last:border-0 hover:bg-gray-100 transition-colors rounded-lg px-3 sm:px-4">
                      <span className="text-gray-700 font-medium mb-2 sm:mb-0">{item.description} <span className="text-gray-500">x{item.quantity}</span> <span className="text-blue-600">@ {formatCurrency(item.unit_price)}</span></span>
                      <span className="font-bold">{formatCurrency(item.subtotal)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 sm:mt-8 lg:mt-10 bg-gray-50 p-3 sm:p-6 lg:p-8 rounded-xl shadow-inner">
            <p className="space-y-2 sm:space-y-3">
              <span className="font-bold text-gray-700 text-lg sm:text-xl block">Terms & Conditions:</span>
              <span className="text-gray-600 italic text-sm sm:text-lg block">{invoice.terms_conditions}</span>
            </p>
          </div>
        </>
      )}
    </div>
  );
});

InvoiceCard.displayName = 'InvoiceCard';

InvoiceCard.propTypes = {
  invoice: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    due_date: PropTypes.string.isRequired,
    subtotal: PropTypes.number.isRequired,
    tax_rate: PropTypes.number.isRequired,
    tax_amount: PropTypes.number.isRequired,
    discount: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    terms_conditions: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      description: PropTypes.string.isRequired,
      quantity: PropTypes.number.isRequired,
      unit_price: PropTypes.number.isRequired,
      subtotal: PropTypes.number.isRequired
    }))
  }).isRequired,
  onUpdate: PropTypes.func.isRequired
};

export default InvoiceCard;