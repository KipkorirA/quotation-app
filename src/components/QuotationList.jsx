// QuotationList.jsx
import { useEffect, useState, useCallback } from 'react';
import { fetchQuotations} from '../api';
import { toast } from 'react-toastify';
import CustomerInformation from './quotation/CustomerInformation';
import FinancialDetails from './quotation/FinancialDetails';
import QuotationItems from './quotation/QuotationItems';
import AdditionalInformation from './quotation/AdditionalInformation';
import LoadingSpinner from './common/LoadingSpinner';

const QuotationList = () => {
  const [quotations, setQuotations] = useState([]);
  const [filteredQuotations, setFilteredQuotations] = useState([]);
  const [quotationItems, setQuotationItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  const loadQuotations = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetchQuotations();
      setQuotations(response.data);
      setFilteredQuotations(response.data);
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

  const handleSendEmail = async (quotation) => {
    if (!quotation.customer_email) {
      toast.error('Customer email is required to send quotation');
      return;
    }

    try {
      const response = await fetch(`https://techknow-backend.onrender.com/quotations/${quotation.id}/download`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to download quotation');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `quotation_${quotation.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('Quotation downloaded successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to download quotation');
      console.error(error);
    }
  };

  const handleDelete = async (quotationId) => {
    try {
      const response = await fetch(`https://techknow-backend.onrender.com/quotations/${quotationId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete quotation');
      }

      toast.success('Quotation deleted successfully');
      loadQuotations();
    } catch (error) {
      toast.error(error.message || 'Failed to delete quotation');
      console.error(error);
    }
  };

  useEffect(() => {
    loadQuotations();
  }, [loadQuotations]);

  useEffect(() => {
    let result = [...quotations];

    if (statusFilter !== 'all') {
      result = result.filter(q => q.status === statusFilter);
    }

    if (searchTerm) {
      result = result.filter(q => 
        q.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.id.toString().includes(searchTerm)
      );
    }

    result.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.customer_name.localeCompare(b.customer_name);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'date':
          comparison = new Date(b.created_at) - new Date(a.created_at);
          break;
        default:
          comparison = 0;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    setFilteredQuotations(result);
  }, [quotations, searchTerm, statusFilter, sortBy, sortOrder]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-0">Quotation List</h2>
        <button
          onClick={loadQuotations}
          className="w-full sm:w-auto inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
        >
          Refresh
        </button>
      </div>

      <div className="mb-4 sm:mb-6 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Search quotations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="sent">Sent</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="date">Sort by Date</option>
            <option value="name">Sort by Name</option>
            <option value="status">Sort by Status</option>
          </select>

          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="w-full sm:w-auto px-3 py-2 text-sm border rounded-md bg-gray-100 hover:bg-gray-200"
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>

      {filteredQuotations.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-base sm:text-lg text-gray-500">No quotations found</p>
        </div>
      ) : (
        <ul className="space-y-4 sm:space-y-6">
          {filteredQuotations.map((q) => (
            <li key={q.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden">
              <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start mb-4 sm:mb-6">
                  <div className="flex flex-col mb-3 sm:mb-0">
                    <span className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
                      Account: {q.customer_name}
                    </span>
                    <span className="text-sm text-gray-600">ID: {q.id}</span>
                    <span className="text-sm text-gray-600">Description: {q.description}</span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-2">
                      Status: {q.status}
                    </span>
                  </div>

                  <div className="w-full sm:w-auto flex gap-2">
                    <button
                      onClick={() => handleSendEmail(q)}
                      className="w-full sm:w-auto inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200"
                    >
                      Download PDF
                    </button>
                    <button
                      onClick={() => handleDelete(q.id)}
                      className="w-full sm:w-auto inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:gap-6">
                  <CustomerInformation quotation={q} />
                  <FinancialDetails quotation={q} />
                </div>
                <QuotationItems quotationItems={quotationItems.filter(item => item.quotation_id === q.id)} />
                <AdditionalInformation quotation={q} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default QuotationList;