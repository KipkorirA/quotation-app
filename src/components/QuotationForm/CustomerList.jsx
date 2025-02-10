// src/components/QuotationForm/components/CustomerList.jsx
import PropTypes from 'prop-types';
import CustomerDetails from './CustomerDetails';

export const CustomerList = ({ 
  customers, 
  selectedCustomerId, 
  customerOrders, 
  customerProjects, 
  onCustomerSelect, 
  onOrderSelect, 
  onProjectSelect 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Customer List</h2>
        <button
          type="button"
          onClick={() => document.getElementById('newCustomerModal').showModal()}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
        >
          Add New Customer
        </button>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {customers.map(customer => (
          <div
            key={customer.id}
            className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition duration-200"
            onClick={() => onCustomerSelect(customer.id)}
          >
            <h3 className="font-semibold">{customer.name}</h3>
            <p className="text-gray-600">{customer.email}</p>
            {selectedCustomerId === customer.id.toString() && (
              <div className="mt-4 space-y-4">
                <CustomerDetails 
                  orders={customerOrders}
                  projects={customerProjects}
                  onOrderSelect={onOrderSelect}
                  onProjectSelect={onProjectSelect}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

CustomerList.propTypes = {
  customers: PropTypes.array.isRequired,
  selectedCustomerId: PropTypes.string,
  customerOrders: PropTypes.array.isRequired,
  customerProjects: PropTypes.array.isRequired,
  onCustomerSelect: PropTypes.func.isRequired,
  onOrderSelect: PropTypes.func.isRequired,
  onProjectSelect: PropTypes.func.isRequired,
};