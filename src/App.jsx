import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import QuotationList from './components/QuotationList';
import QuotationForm from './components/QuotationForm/QuotationForm';
// import EmailForm from './components/EmailForm';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import InvoiceList from './components/invoice/InvoiceList';

const App = () => {
  const [currentQuotation, setCurrentQuotation] = useState(null);

  const handleEdit = (quotation) => setCurrentQuotation(quotation);

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="container mx-auto px-4 py-6 sm:py-12">
          <h1 className="text-3xl sm:text-5xl font-bold text-center mb-6 sm:mb-10 text-gray-800 tracking-tight">
            My Manager
          </h1>
          <nav className="flex justify-center space-x-3 sm:space-x-6 mb-8 sm:mb-12">
            <Link 
              to="/" 
              className="px-3 py-2 text-sm sm:text-base text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200 rounded-lg hover:bg-blue-50"
            >
              Quotations
            </Link>
            <Link 
              to="/new-quotation" 
              className="px-3 py-2 text-sm sm:text-base text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200 rounded-lg hover:bg-blue-50"
            >
              New Quotation
            </Link>
            <Link 
              to="/invoice" 
              className="px-3 py-2 text-sm sm:text-base text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200 rounded-lg hover:bg-blue-50"
            >
              Invoice
            </Link>
          </nav>
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-4 sm:p-8">
            <Routes>
              <Route path="/" element={<QuotationList onEdit={handleEdit} />} />
              <Route 
                path="/new-quotation" 
                element={
                  <QuotationForm
                    currentQuotation={currentQuotation}
                    onSave={() => setCurrentQuotation(null)}
                  />
                } 
              />
              <Route path="/invoice" element={<InvoiceList />} />
            </Routes>
            <ToastContainer />
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;