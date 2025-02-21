// components/quotation/FinancialDetails.jsx
import PropTypes from 'prop-types';

const FinancialDetails = ({ quotation }) => (
  <div className="bg-gray-50 rounded-lg p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Details</h3>
    <div className="space-y-2">
      <p className="text-gray-700"><span className="font-medium">Quantity:</span> {quotation.quantity}</p>
      <p className="text-gray-700"><span className="font-medium">Unit Price:</span> Ksh.{quotation.unit_price.toFixed(2)}</p>
      <p className="text-gray-700"><span className="font-medium">Subtotal:</span> Ksh.{quotation.subtotal.toFixed(2)}</p>
      <p className="text-gray-700"><span className="font-medium">Tax Rate:</span> {quotation.tax_rate}%</p>
      <p className="text-gray-700"><span className="font-medium">Tax Amount:</span> Ksh.{quotation.tax_amount.toFixed(2)}</p>
      <p className="text-gray-700"><span className="font-medium">Discount:</span> Ksh.{quotation.discount.toFixed(2)}</p>
      <p className="text-gray-900 font-bold mt-4">Total Amount: Ksh.{quotation.total_amount.toFixed(2)}</p>
    </div>
  </div>
);

FinancialDetails.propTypes = {
  quotation: PropTypes.object.isRequired,
};

export default FinancialDetails;