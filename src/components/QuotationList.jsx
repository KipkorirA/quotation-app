import { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { fetchQuotations, deleteQuotation } from '../api';
import { toast } from 'react-toastify';

const QuotationList = ({ onEdit }) => {
  const [quotations, setQuotations] = useState([]);
  const [quotationItems, setQuotationItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadQuotations = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetchQuotations();
      const pendingQuotations = response.data.filter(q => q.status === "pending");
      setQuotations(pendingQuotations);
      try {
        const itemsResponse = await fetch('https://techknow-backend.onrender.com/quotations/quotationitems');
        if (itemsResponse.ok) {
          const items = await itemsResponse.json();
          setQuotationItems(Array.isArray(items) ? items : []);
        } else {
          setQuotationItems([]);
        }
      } catch (itemsError) {
        console.error('Failed to load quotation items:', itemsError);
        setQuotationItems([]);
      }
    } catch (error) {
      toast.error('Failed to load quotations');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this quotation?')) {
      return;
    }

    try {
      await deleteQuotation(id);
      toast.success('Quotation deleted successfully');
      loadQuotations();
    } catch (error) {
      toast.error('Failed to delete quotation');
      console.error(error);
    }
  };

  const handleSendEmail = async (quotation) => {
    if (!quotation.customer_email) {
      toast.error('Customer email is required to send quotation');
      return;
    }

    try {
      const response = await fetch(`https://techknow-backend.onrender.com/quotations/${quotation.id}/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipient: quotation.customer_email,
          subject: `Quotation ${quotation.customer_name} Details`,
          body: `Dear Valued Customer,

Please find the details of your quotation below:

Quotation Details:
------------------
Description: ${quotation.description}
Quantity: ${quotation.quantity}
Unit Price: ${quotation.unit_price.toFixed(2)}
Subtotal: ${quotation.subtotal.toFixed(2)}
Tax Rate: ${quotation.tax_rate}%
Tax Amount: ${quotation.tax_amount.toFixed(2)}
Discount: ${quotation.discount.toFixed(2)}
Total Amount: ${quotation.total_amount.toFixed(2)}

Customer Information:
-------------------
Name: ${quotation.customer_name || 'N/A'}
Email: ${quotation.customer_email || 'N/A'}
Phone: ${quotation.customer_phone || 'N/A'}

Validity Period: ${quotation.validity_period} days
Status: ${quotation.status}

Notes: ${quotation.notes || 'N/A'}

Terms and Conditions: ${quotation.terms_conditions || 'N/A'}

Thank you for your business.

Best regards,
Your Company Name`
        })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to send email');
      }
      
      toast.success('Quotation email sent successfully');

      setQuotations((prevQuotations) =>
        prevQuotations.filter((q) => q.id !== quotation.id)
    );

    } catch (error) {
      toast.error(error.message || 'Failed to send email');
      console.error(error);
    }
  };

  useEffect(() => {
    loadQuotations();
  }, [loadQuotations]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-extrabold text-gray-900">Quotation List</h2>
        <button
          onClick={loadQuotations}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
        >
          Refresh
        </button>
      </div>
      {quotations.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-500">No quotations found</p>
        </div>
      ) : (
        <ul className="space-y-6">
          {quotations.map((q) => (
            <li key={q.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold text-gray-900 mb-2">
                      Account: {q.customer_name}
                    </span>
                    <span className="text-gray-600">ID: {q.id}</span>
                    <span className="text-gray-600">Description: {q.description}</span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mt-2">
                      Status: {q.status}
                    </span>
                  </div>
                  <div className="flex space-x-3">

                    <button
                      onClick={() => handleSendEmail(q)}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200"
                    >
                      Send Email
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
                    <div className="space-y-2">
                      <p className="text-gray-700"><span className="font-medium">Name:</span> {q.customer_name || 'N/A'}</p>
                      <p className="text-gray-700"><span className="font-medium">Email:</span> {q.customer_email || 'N/A'}</p>
                      <p className="text-gray-700"><span className="font-medium">Phone:</span> {q.customer_phone || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Details</h3>
                    <div className="space-y-2">
                      <p className="text-gray-700"><span className="font-medium">Quantity:</span> {q.quantity}</p>
                      <p className="text-gray-700"><span className="font-medium">Unit Price:</span> Ksh.{q.unit_price.toFixed(2)}</p>
                      <p className="text-gray-700"><span className="font-medium">Subtotal:</span> Ksh.{q.subtotal.toFixed(2)}</p>
                      <p className="text-gray-700"><span className="font-medium">Tax Rate:</span> {q.tax_rate}%</p>
                      <p className="text-gray-700"><span className="font-medium">Tax Amount:</span> Ksh.{q.tax_amount.toFixed(2)}</p>
                      <p className="text-gray-700"><span className="font-medium">Discount:</span> Ksh.{q.discount.toFixed(2)}</p>
                      <p className="text-gray-900 font-bold mt-4">Total Amount: Ksh.{q.total_amount.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quotation Items</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {Array.isArray(quotationItems) && quotationItems
                          .filter(item => item.quotation_id === q.id)
                          .map(item => (
                            <tr key={item.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.item_name}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.quantity}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Ksh.{item.unit_price.toFixed(2)}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Ksh.{item.subtotal.toFixed(2)}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="mt-6 bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-700"><span className="font-medium">Validity Period:</span> {q.validity_period} days</p>
                      <p className="text-gray-700"><span className="font-medium">Notes:</span> {q.notes || 'N/A'}</p>
                      <p className="text-gray-700"><span className="font-medium">Terms and Conditions:</span> {q.terms_conditions || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-gray-700"><span className="font-medium">Created At:</span> {new Date(q.created_at).toLocaleString()}</p>
                      <p className="text-gray-700"><span className="font-medium">Updated At:</span> {new Date(q.updated_at).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

QuotationList.propTypes = {
  onEdit: PropTypes.func.isRequired,
};

export default QuotationList;