// components/quotation/AdditionalInformation.jsx
import PropTypes from 'prop-types';

const AdditionalInformation = ({ quotation }) => (
  <div className="mt-4 sm:mt-6 bg-gray-50 rounded-lg p-4 sm:p-6">
    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Additional Information</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
      <div>
        <p className="text-sm sm:text-base text-gray-700"><span className="font-medium">Validity Period:</span> {quotation.validity_period} days</p>
        <p className="text-sm sm:text-base text-gray-700"><span className="font-medium">Notes:</span> {quotation.notes || 'N/A'}</p>
        <p className="text-sm sm:text-base text-gray-700"><span className="font-medium">Terms and Conditions:</span> {quotation.terms_conditions || 'N/A'}</p>
      </div>
      <div>
        <p className="text-sm sm:text-base text-gray-700"><span className="font-medium">Created At:</span> {new Date(quotation.created_at).toLocaleString()}</p>
        <p className="text-sm sm:text-base text-gray-700"><span className="font-medium">Updated At:</span> {new Date(quotation.updated_at).toLocaleString()}</p>
      </div>
    </div>
  </div>
);

AdditionalInformation.propTypes = {
  quotation: PropTypes.object.isRequired,
};

export default AdditionalInformation;