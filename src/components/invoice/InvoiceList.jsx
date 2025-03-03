// InvoiceList.jsx
import { useState, useEffect } from 'react';
import InvoiceForm from './InvoiceForm';
import InvoiceCard from './InvoiceCard';

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await fetch('https://techknow-backend.onrender.com/invoices');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch invoices: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      setInvoices(data.invoices || []);
    } catch (error) {
      setError(error.message);
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
        <div className="text-base sm:text-xl font-bold text-gray-700 animate-bounce flex items-center">
          <svg className="animate-spin h-6 w-6 sm:h-8 sm:w-8 mr-2 sm:mr-3 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading invoices...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
        <div className="text-base sm:text-xl font-bold text-red-600 flex items-center">
          <svg className="h-6 w-6 sm:h-8 sm:w-8 mr-2 sm:mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-3 sm:px-4 md:px-8 lg:px-12 py-4 sm:py-8 md:py-12 lg:py-16 max-w-screen-2xl">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0 mb-6 sm:mb-8 md:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 tracking-tight text-center sm:text-left">
            Invoices
          </h1>
          <button
            onClick={() => setShowForm(true)}
            className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 sm:px-6 md:px-10 py-2 sm:py-3 text-sm md:text-lg rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-semibold"
          >
            + Create Invoice
          </button>
        </div>

        {showForm && (
          <InvoiceForm
            onSubmit={() => {
              fetchInvoices();
              setShowForm(false);
            }}
            onCancel={() => setShowForm(false)}
          />
        )}

        {invoices.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <p className="text-lg sm:text-xl text-gray-600">No invoices found. Create your first invoice!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4 sm:gap-6">
            {invoices.map(invoice => (
              <div key={invoice.id} className="transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl w-full">
                <InvoiceCard
                  invoice={{...invoice, amount: invoice.amount?.replace('KSh')}}
                  onUpdate={fetchInvoices}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceList;