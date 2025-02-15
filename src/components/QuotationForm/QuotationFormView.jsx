// src/components/QuotationForm/QuotationFormView.jsx
import PropTypes from 'prop-types';
import { CustomerList } from './CustomerList';
import { NewCustomerModal } from './NewCustomerModal';
import { FormField } from './FormField';
import { useState } from 'react';

export const QuotationFormView = ({
  register,
  handleSubmit,
  onSubmit,
  customers,
  // projects = [],
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

  const handleCustomerSelect = (customerId) => {
    setValue("selectedCustomerId", customerId);
    const customerSelect = document.querySelector('select[name="customer_id"]');
    if (customerSelect) {
      customerSelect.value = customerId;
      customerSelect.dispatchEvent(new Event('change', { bubbles: true }));
    }
  };

  const handleProjectSelect = (projectId) => {
    setValue("selectedProjectId", projectId);
    const projectSelect = document.querySelector('select[name="project_id"]');
    if (projectSelect) {
      projectSelect.value = projectId;
      projectSelect.dispatchEvent(new Event('change', { bubbles: true }));
    }
  };

  const handleOrderSelect = (order) => {
    append({ 
      item_name: order.product_name,
      quantity: 1,
      unit_price: order.price,
      product_id: order.product_id 
    });
  };

  // const projectOptions = projects && typeof projects === 'object' && !Array.isArray(projects) 
  //   ? Object.values(projects) 
  //   : (Array.isArray(projects) ? projects : []);

  const handleReview = (data) => {
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
  };

  const handleFormSubmit = async () => {
    try {
      console.log("Form data:", formData);
      
      console.log('Sending request to create quotation...');
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
      while (fields.length > 0) {
        remove(0);
      }
    } catch (error) {
      console.error('Error creating quotation:', error);
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    }
  };

  return (
    <div className="space-y-4 p-6 max-w-4xl mx-auto">
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
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Review Quotation Details</h2>
          <div className="space-y-4">
            <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded">
              {JSON.stringify(formData, null, 2)}
            </pre>
            <div className="flex space-x-4">
              <button
                onClick={handleFormSubmit}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Confirm and Submit
              </button>
              <button
                onClick={() => setShowReview(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Back to Edit
              </button>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(handleReview)} className="bg-white rounded-lg shadow-md">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {currentQuotation ? 'Edit Quotation' : 'Create Quotation'}
            </h2>
            
            <div className="space-y-4">
              {/* <FormField
                label="Customer"
                type="select"
                name="selectedCustomerId"
                register={register}
                options={[
                  { value: "", label: "Select Customer" },
                  ...customers.map(customer => ({
                    value: String(customer.id),
                    label: customer.name
                  }))
                ]}
              />

              <FormField
                label="Project"
                type="select"
                name="selectedProjectId"
                register={register}
                options={[
                  { value: "", label: "Select Project" },
                  ...projectOptions.map(project => ({
                    value: String(project.id),
                    label: project.name
                  }))
                ]}
              /> */}

              <div className="form-field">
                <label htmlFor="customer_name">Customer Name</label>
                <input
                  id="customer_name"
                  type="text"
                  {...register("customer_name")}
                  className="w-full p-2 border rounded"
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

              <div className="border p-4 rounded-md">
                <h3 className="text-lg font-semibold mb-4">Items</h3>
                {fields.map((field, index) => (
                  <div key={field.id} className="space-y-4 mb-4 p-4 border rounded">
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
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Remove Item
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => append({ item_name: '', quantity: 1, unit_price: 0 })}
                  className="bg-green-500 text-white px-4 py-2 rounded mt-4"
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
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
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
  setValue: PropTypes.func,
  reset: PropTypes.func,
};