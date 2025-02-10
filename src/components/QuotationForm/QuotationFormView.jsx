// src/components/QuotationForm/QuotationFormView.jsx
import PropTypes from 'prop-types';
import { CustomerList } from './CustomerList';
import { NewCustomerModal } from './NewCustomerModal';
import { ProductList } from './ProductList';
import { FormField } from './FormField';

export const QuotationFormView = ({
  register,
  handleSubmit,
  onSubmit,
  customers,
  projects = [],
  products,
  selectedCustomerId,
  currentQuotation,
  customerOrders,
  customerProjects,
  fields,
  append,
  remove,
  handleNewCustomerSubmit
}) => {
  const handleCustomerSelect = (customerId) => {
    const customerSelect = document.querySelector('select[name="customer_id"]');
    if (customerSelect) {
      customerSelect.value = customerId;
      customerSelect.dispatchEvent(new Event('change', { bubbles: true }));
    }
  };

  const handleProjectSelect = (projectId) => {
    const projectSelect = document.querySelector('select[name="project_id"]');
    if (projectSelect) {
      projectSelect.value = projectId;
      projectSelect.dispatchEvent(new Event('change', { bubbles: true }));
    }
  };

  const handleProductAdd = () => {
    append({ product_id: '', quantity: 1, unit_price: 0 });
  };

  const handleOrderSelect = (order) => {
    append({ product_id: order.product_id, quantity: order.quantity });
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

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-md">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {currentQuotation ? 'Edit Quotation' : 'Create Quotation'}
          </h2>
          
          <div className="space-y-4">
            <FormField
              label="Customer"
              type="select"
              name="customer_id"
              register={register}
              options={[
                { value: "", label: "Select Customer" },
                ...customers.map(customer => ({
                  value: customer.id,
                  label: `${customer.name} (${customer.email})`
                }))
              ]}
            />

            <FormField
              label="Project"
              type="select"
              name="project_id"
              register={register}
              options={[
                { value: "", label: "Select Project" },
                ...(Array.isArray(projects) ? projects.map(project => ({
                  value: project.id,
                  label: project.name
                })) : [])
              ]}
            />

            <ProductList
              fields={fields}
              products={products}
              register={register}
              remove={remove}
              onAddProduct={handleProductAdd}
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
              {currentQuotation ? 'Update Quotation' : 'Create Quotation'}
            </button>
          </div>
        </div>
      </form>
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
  projects: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
  })),
  products: PropTypes.array.isRequired,
  selectedCustomerId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  currentQuotation: PropTypes.object,
  customerOrders: PropTypes.array.isRequired,
  customerProjects: PropTypes.array.isRequired,
  fields: PropTypes.array.isRequired,
  append: PropTypes.func.isRequired,
  remove: PropTypes.func.isRequired,
  handleNewCustomerSubmit: PropTypes.func.isRequired,
};