// src/components/QuotationForm/QuotationForm.jsx
import { useForm, useFieldArray } from 'react-hook-form';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { QuotationFormView } from './QuotationFormView';
import { useInitialData } from '../../hooks/useInitialData';
import { useCustomerDetails } from '../../hooks/useCustomerDetails';
import { useQuotationCalculations } from '../../hooks/useQuotationCalculations';
import { api } from '../../api';

const QuotationForm = ({ currentQuotation, onSave }) => {
  const { register, handleSubmit, reset, watch, control, formState: { errors }, setValue } = useForm({
    defaultValues: currentQuotation || {},
    mode: 'onChange'
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "products"
  });

  const selectedCustomerId = watch('customer_id');
  const selectedProjectId = watch('project_id');
  const watchedProducts = watch('products');

  const { 
    customers, 
    projects, 
    products, 
    isLoading: isLoadingInitial, 
    error: initialError,
    refetch: refetchInitialData 
  } = useInitialData();

  const { 
    orders: selectedCustomerOrders,
    messages: selectedCustomerMessages,
    projects: selectedCustomerProjects,
    isLoading: isLoadingCustomer,
    error: customerError
  } = useCustomerDetails(selectedCustomerId);

  const { subtotal, calculateTotals } = useQuotationCalculations(watchedProducts);

  useEffect(() => {
    if (currentQuotation) {
      Object.keys(currentQuotation).forEach(key => {
        setValue(key, currentQuotation[key]);
      });
    }
  }, [currentQuotation, setValue]);

  const onSubmit = async (data) => {
    try {
      const customerData = {
        customer_type: data.customer_type || 'individual',
        name: data.customer_name?.trim(),
        email: data.customer_email?.trim(),
        phone: data.customer_phone?.trim(),
        address: data.customer_address?.trim(),
        status: 'active',
        notes: ''
      };

      if (!customers.find(c => c.id === parseInt(data.customer_id))) {
        const customerResponse = await fetch('https://techknow-backend.onrender.com/customers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(customerData)
        });
        const customerResult = await customerResponse.json();
        data.customer_id = customerResult.customer.id;
        await refetchInitialData();
      }

      const projectData = {
        name: data.project_name?.trim() || 'New Project',
        description: 'Project created from quotation',
        project_code: `PROJ-${Date.now()}`,
        customer_id: data.customer_id,
        status: 'not started'
      };

      if (!data.project_id || !projects.find(p => p.id === parseInt(data.project_id))) {
        const projectResponse = await api.post('/api/projects', projectData);
        data.project_id = projectResponse.data.project.id;
        await refetchInitialData();
      }

      const { taxAmount, totalAmount } = calculateTotals(data);
      const quotationData = {
        ...data,
        status: 'pending',
        tax_amount: taxAmount,
        total_amount: totalAmount,
        subtotal,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      if (currentQuotation?.id) {
        await api.put(`/quotations/${currentQuotation.id}`, quotationData);
        toast.success(`Quotation #${currentQuotation.id} updated successfully`);
      } else {
        const response = await api.post('/quotations', quotationData);
        toast.success(`New quotation #${response.data.id} created successfully`);
      }
      reset();
      onSave();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'An unexpected error occurred while saving the quotation';
      console.error('Error saving quotation:', error);
      toast.error(errorMessage);
    }
  };

  return (
    <QuotationFormView
      register={register}
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
      customers={customers}
      projects={projects}
      products={products}
      selectedCustomerId={selectedCustomerId}
      selectedProjectId={selectedProjectId}
      currentQuotation={currentQuotation}
      errors={errors}
      control={control}
      fields={fields}
      append={append}
      remove={remove}
      customerOrders={selectedCustomerOrders}
      customerMessages={selectedCustomerMessages}
      customerProjects={selectedCustomerProjects}
      isLoading={isLoadingInitial || isLoadingCustomer}
      error={initialError || customerError}
      subtotal={subtotal}
    />
  );
};

QuotationForm.propTypes = {
  currentQuotation: PropTypes.shape({
    id: PropTypes.number,
    description: PropTypes.string,
    quantity: PropTypes.number,
    unit_price: PropTypes.number,
    subtotal: PropTypes.number,
    tax_rate: PropTypes.number,
    discount: PropTypes.number,
    validity_period: PropTypes.number,
    terms_conditions: PropTypes.string,
    notes: PropTypes.string,
    account_number: PropTypes.string,
    customer_id: PropTypes.number,
    project_id: PropTypes.number,
    product_ids: PropTypes.arrayOf(PropTypes.number),
    customer_type: PropTypes.string,
    customer_name: PropTypes.string,
    customer_email: PropTypes.string,
    customer_phone: PropTypes.string,
    customer_address: PropTypes.string,
    created_at: PropTypes.string,
    updated_at: PropTypes.string,
  }),
  onSave: PropTypes.func.isRequired,
};

export default QuotationForm;