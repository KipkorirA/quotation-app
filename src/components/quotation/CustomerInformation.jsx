// components/quotation/CustomerInformation.jsx
import PropTypes from 'prop-types';

const CustomerInformation = ({ quotation }) => (
  <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Customer Information</h3>
    <div className="space-y-1.5 sm:space-y-2">
      <p className="text-sm sm:text-base text-gray-700"><span className="font-medium">Name:</span> {quotation.customer_name || 'N/A'}</p>
      <p className="text-sm sm:text-base text-gray-700"><span className="font-medium">Email:</span> {quotation.customer_email || 'N/A'}</p>
      <p className="text-sm sm:text-base text-gray-700"><span className="font-medium">Phone:</span> {quotation.customer_phone || 'N/A'}</p>
    </div>
  </div>
);

CustomerInformation.propTypes = {
  quotation: PropTypes.object.isRequired,
};

export default CustomerInformation;