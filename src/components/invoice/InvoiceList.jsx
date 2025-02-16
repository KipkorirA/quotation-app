// InvoiceList.jsx
import { useState, useEffect } from 'react';
import InvoiceForm from './InvoiceForm';
import InvoiceCard from './InvoiceCard';

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await fetch('https://techknow-backend.onrender.com/invoices');
      if (!response.ok) {
        throw new Error('Failed to fetch invoices');
      }
      const data = await response.json();
      setInvoices(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading invoices...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Invoices</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create Invoice
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.isArray(invoices) && invoices.map(invoice => (
          <InvoiceCard
            key={invoice.id}
            invoice={invoice}
            onUpdate={fetchInvoices}
          />
        ))}
      </div>
    </div>
  );
};

export default InvoiceList;





