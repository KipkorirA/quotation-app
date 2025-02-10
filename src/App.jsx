import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import QuotationList from './components/QuotationList';
import QuotationForm from './components/QuotationForm/QuotationForm';
import EmailForm from './components/EmailForm';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

const App = () => {
  const [currentQuotation, setCurrentQuotation] = useState(null);

  const handleEdit = (quotation) => setCurrentQuotation(quotation);

  return (
    <Router>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Quotation Manager</h1>
        <nav className="flex justify-center space-x-4 mb-8">
          <Link to="/" className="text-blue-600 hover:text-blue-800">Quotations</Link>
          <Link to="/new-quotation" className="text-blue-600 hover:text-blue-800">New Quotation</Link>
          <Link to="/email" className="text-blue-600 hover:text-blue-800">Email</Link>
        </nav>
        <div className="max-w-3xl mx-auto">
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
            <Route path="/email" element={<EmailForm />} />
          </Routes>
          <ToastContainer />
        </div>
      </div>
    </Router>
  );
};

export default App;