import { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { fetchQuotations, deleteQuotation } from '../api';
import { toast } from 'react-toastify';

const QuotationList = ({ onEdit }) => {
  const [quotations, setQuotations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadQuotations = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetchQuotations();
      setQuotations(response.data);
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

  useEffect(() => {
    loadQuotations();
  }, [loadQuotations]);

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Quotation List</h2>
        <button
          onClick={loadQuotations}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
        >
          Refresh
        </button>
      </div>
      {quotations.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No quotations found</p>
      ) : (
        <ul className="space-y-4">
          {quotations.map((q) => (
            <li key={q.id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
              <span className="text-gray-800">
                {q.reference_number} - {q.description}
              </span>
              <div className="space-x-2">
                <button
                  onClick={() => onEdit(q)}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(q.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
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