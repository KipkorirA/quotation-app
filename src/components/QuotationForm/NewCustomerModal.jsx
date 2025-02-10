// src/components/QuotationForm/NewCustomerModal.jsx
import PropTypes from 'prop-types';
import { FormField } from './FormField'; // Changed to named import

export const NewCustomerModal = ({ onSubmit }) => {
    const handleSubmit = async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const customerData = {
        customer_type: formData.get('new_customer.customer_type'),
        name: formData.get('new_customer.name'),
        email: formData.get('new_customer.email'),
        phone: formData.get('new_customer.phone'),
        address: formData.get('new_customer.address'),
        status: 'ACTIVE',
        notes: formData.get('new_customer.notes')
      };

      try {
        console.log("Submitting customer data:", customerData);
        
        const response = await fetch('https://techknow-backend.onrender.com/customers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(customerData)
        });

        const responseData = await response.json();
        console.log("Server response:", responseData);

        if (response.ok) {
          console.log("Customer created successfully:", responseData);
          onSubmit(responseData.customer);
          document.getElementById('newCustomerModal').close();
        } else {
          const errorMessage = responseData.message || 'Failed to create customer';
          throw new Error(errorMessage);
        }
      } catch (error) {
        console.error('Error creating customer:', {
          message: error.message,
          status: error.status,
          details: error
        });
      }
    };

    return (
      <dialog id="newCustomerModal" className="rounded-lg shadow-xl p-6 w-full max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Add New Customer</h3>
          <FormField
            label="Customer Type"
            name="new_customer.customer_type"
            type="select"
            options={[
              { value: "", label: "Select Type" },
              { value: "individual", label: "Individual" },
              { value: "company", label: "Company" }
            ]}
          />
          <FormField
            label="Name"
            name="new_customer.name"
            type="text"
          />
          <FormField
            label="Email"
            name="new_customer.email"
            type="email"
          />
          <FormField
            label="Phone"
            name="new_customer.phone"
            type="tel"
          />
          <FormField
            label="Address"
            name="new_customer.address"
            type="textarea"
            rows={3}
          />
          <FormField
            label="Notes"
            name="new_customer.notes"
            type="textarea"
            rows={3}
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => document.getElementById('newCustomerModal').close()}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Add Customer
            </button>
          </div>
        </form>
      </dialog>
    );
  };
  
  NewCustomerModal.propTypes = {
    onSubmit: PropTypes.func.isRequired,
  };