// src/components/QuotationForm/QuotationFormView.jsx
import PropTypes from 'prop-types';
import { CustomerList } from './CustomerList';
import { NewCustomerModal } from './NewCustomerModal';
import { FormField } from './FormField';
import { useState, useCallback } from 'react';

export const QuotationFormView = ({
  register,
  handleSubmit,
  onSubmit,
  customers,
  selectedCustomerId,
  currentQuotation,
  customerOrders = [],
  customerProjects = [],
  append = () => {},
  handleNewCustomerSubmit = () => {},
  fields = [],
  remove = () => {},
  setValue,
  reset
}) => {
  const [showReview, setShowReview] = useState(false);
  const [formData, setFormData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCustomerSelect = useCallback((customerId) => {
    setValue("selectedCustomerId", customerId);
    const customerSelect = document.querySelector('select[name="customer_id"]');
    if (customerSelect) {
      customerSelect.value = customerId;
      customerSelect.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }, [setValue]);

  const handleProjectSelect = useCallback((projectId) => {
    setValue("selectedProjectId", projectId);
    const projectSelect = document.querySelector('select[name="project_id"]');
    if (projectSelect) {
      projectSelect.value = projectId;
      projectSelect.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }, [setValue]);

  const handleOrderSelect = useCallback((order) => {
    append({ 
      item_name: order.product_name,
      quantity: 1,
      unit_price: order.price,
      product_id: order.product_id 
    });
  }, [append]);

  const handleReview = useCallback((data) => {
    const formattedData = {
      ...data,
      customer_id: data.selectedCustomerId || null,
      project_id: data.selectedProjectId || null,
      customer_name: data.customer_name?.trim(),
      customer_email: data.customer_email?.trim(),
      customer_phone: data.customer_phone?.trim(),
      items: data.items.map(item => ({
        ...item,
        quantity: Number(item.quantity),
        unit_price: Number(item.unit_price)
      })),
      tax_rate: Number(data.tax_rate),
      discount: Number(data.discount),
      validity_period: Number(data.validity_period)
    };
    setFormData(formattedData);
    setShowReview(true);
  }, []);

  const handleFormSubmit = async () => {
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      const response = await fetch('https://techknow-backend.onrender.com/quotations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.message || 'Failed to create quotation');
      }
      
      const result = await response.json();
      onSubmit(result);
      setShowReview(false);
      reset();
      fields.forEach((_, index) => remove(index));
    } catch (error) {
      console.error('Error creating quotation:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 p-4 sm:p-6 max-w-4xl mx-auto text-base sm:text-lg">
      <CustomerList
        customers={customers}
        selectedCustomerId={selectedCustomerId}
        customerOrders={customerOrders}
        customerProjects={customerProjects}
        onCustomerSelect={handleCustomerSelect}
        onOrderSelect={handleOrderSelect}
        onProjectSelect={handleProjectSelect}
      />
      
      <NewCustomerModal onSubmit={handleNewCustomerSubmit} />

      {showReview ? (
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Review Quotation Details</h2>
          <div className="space-y-4">
            <pre className="whitespace-pre-wrap bg-gray-100 p-3 sm:p-4 rounded text-sm sm:text-base">
              {JSON.stringify(formData, null, 2)}
            </pre>
            <div className="flex flex-col sm:flex-row gap-3 sm:space-x-4">
              <button
                onClick={handleFormSubmit}
                disabled={isSubmitting}
                className={`${
                  isSubmitting ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
                } text-white px-4 py-2 rounded text-base sm:text-lg transition duration-200 w-full sm:w-auto`}
              >
                {isSubmitting ? 'Submitting...' : 'Confirm and Submit'}
              </button>
              <button
                onClick={() => setShowReview(false)}
                disabled={isSubmitting}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-200 text-base sm:text-lg w-full sm:w-auto"
              >
                Back to Edit
              </button>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(handleReview)} className="bg-white rounded-lg shadow-md">
          <div className="p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">
              {currentQuotation ? 'Edit Quotation' : 'Create Quotation'}
            </h2>
            
            <div className="space-y-4">
              <div className="form-field">
                <label htmlFor="customer_name" className="block text-base sm:text-lg font-medium text-gray-700 mb-1">
                  Customer Name
                </label>
                <input
                  id="customer_name"
                  type="text"
                  {...register("customer_name")}
                  className="w-full p-2 sm:p-3 border rounded focus:ring-blue-500 focus:border-blue-500 text-base sm:text-lg"
                />
              </div>
              
              <FormField
                label="Customer Email"
                type="email"
                name="customer_email"
                register={register}
              />

              <FormField
                label="Customer Phone"
                type="text"
                name="customer_phone"
                register={register}
              />

              <div className="border p-3 sm:p-4 rounded-md">
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Items</h3>
                {fields.map((field, index) => (
                  <div key={field.id} className="space-y-3 sm:space-y-4 mb-4 p-3 sm:p-4 border rounded">
                    <FormField
                      label="Item Name"
                      type="text"
                      name={`items.${index}.item_name`}
                      register={register}
                    />

                    <FormField
                      label="Quantity"
                      type="number"
                      name={`items.${index}.quantity`}
                      register={register}
                    />

                    <FormField
                      label="Unit Price"
                      type="number"
                      name={`items.${index}.unit_price`}
                      register={register}
                    />

                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition duration-200 text-base sm:text-lg"
                    >
                      Remove Item
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => append({ item_name: '', quantity: 1, unit_price: 0 })}
                  className="bg-green-500 text-white px-4 py-2 rounded mt-4 hover:bg-green-600 transition duration-200 text-base sm:text-lg w-full sm:w-auto"
                >
                  Add Item
                </button>
              </div>

              <FormField
                label="Tax Rate (%)"
                type="number"
                name="tax_rate"
                register={register}
              />

              <FormField
                label="Discount"
                type="number"
                name="discount"
                register={register}
              />

              <FormField
                label="Validity Period (days)"
                type="number"
                name="validity_period"
                register={register}
              />

              <FormField
                label="Account Number"
                type="text"
                name="account_number"
                register={register}
              />

              <FormField
                label="Description"
                type="textarea"
                name="description"
                register={register}
              />

              <FormField
                label="Terms and Conditions"
                type="textarea"
                name="terms_conditions"
                register={register}
              />

              <FormField
                label="Notes"
                type="textarea"
                name="notes"
                register={register}
              />

              <button 
                type="submit"
                className="w-full bg-blue-500 text-white py-3 px-4 rounded-md hover:bg-blue-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-base sm:text-lg"
              >
                Review Details
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

QuotationFormView.propTypes = {
  register: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  customers: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  })).isRequired,
  projects: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
    }))
  ]),
  selectedCustomerId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  currentQuotation: PropTypes.object,
  customerOrders: PropTypes.array,
  customerProjects: PropTypes.array,
  append: PropTypes.func,
  handleNewCustomerSubmit: PropTypes.func,
  fields: PropTypes.array,
  remove: PropTypes.func,
  setValue: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
};