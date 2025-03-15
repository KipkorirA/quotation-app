// src/components/QuotationForm/QuotationForm.jsx
import { useForm, useFieldArray } from 'react-hook-form';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { QuotationFormView } from './QuotationFormView';
import { useInitialData } from '../../hooks/useInitialData';
import { useCustomerDetails } from '../../hooks/useCustomerDetails';
import { useQuotationCalculations } from '../../hooks/useQuotationCalculations';

const QuotationForm = ({ currentQuotation, onSave }) => {
  const [showReview, setShowReview] = useState(false);
  const [formData, setFormData] = useState(null);
  
  const { register, handleSubmit, reset, watch, control, formState: { errors }, setValue } = useForm({
    defaultValues: currentQuotation || {
      items: [{ quantity: '', unit_price: '', item_name: '', product_id: null }],
      customer_name: '',
      selectedCustomerId: null
    },
    mode: 'onChange'
  });

  const { fields = [], append = () => {}, remove = () => {} } = useFieldArray({
    control,
    name: "items"
  }) || {};

  const selectedCustomerId = watch('selectedCustomerId');
  const selectedProjectId = watch('project_id');
  const items = watch('items');

  const { 
    customers, 
    projects, 
    products, 
    isLoading: isLoadingInitial, 
    error: initialError
  } = useInitialData();

  const { 
    orders: selectedCustomerOrders,
    messages: selectedCustomerMessages,
    projects: selectedCustomerProjects,
    isLoading: isLoadingCustomer,
    error: customerError
  } = useCustomerDetails(selectedCustomerId);

  useQuotationCalculations();

  useEffect(() => {
    if (currentQuotation) {
      Object.keys(currentQuotation).forEach(key => {
        if (currentQuotation[key] !== undefined && currentQuotation[key] !== null) {
          setValue(key, currentQuotation[key]);
        }
      });
      if (currentQuotation.customer_id) {
        setValue('selectedCustomerId', currentQuotation.customer_id);
      }
    }
  }, [currentQuotation, setValue]);

  const handleReview = (data) => {
    if (!data.customer_name?.trim()) {
      toast.error('Please enter a customer name');
      return;
    }

    for (const item of data.items) {
      if (!item.quantity || item.quantity <= 0) {
        toast.error('Please enter a valid quantity for all items');
        return;
      }
    }

    setFormData(data);
    setShowReview(true);
  };

  const handleConfirmSubmit = async () => {
    try {
      const quotationData = {
        account_number: formData.account_number,
        admin_id: null,
        attachments: [],
        customer_email: formData.customer_email?.trim(),
        customer_id: formData.selectedCustomerId || null,
        customer_name: formData.customer_name?.trim(),
        customer_phone: formData.customer_phone?.trim(),
        description: formData.description?.trim(),
        discount: formData.discount || 0.0,
        items: formData.items.map(item => ({
          item_name: item.item_name?.trim(),
          quantity: Number(item.quantity),
          unit_price: Number(item.unit_price),
          product_id: item.product_id
        })),
        notes: formData.notes?.trim(),
        project_id: formData.project_id || null,
        status: 'pending',
        tax_rate: formData.tax_rate || 0.1,
        terms_conditions: formData.terms_conditions?.trim(),
        validity_period: formData.validity_period || 30
      };

      const response = await fetch('https://techknow-backend.onrender.com/quotations/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(quotationData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create quotation');
      }

      const responseData = await response.json();
      console.log('New quotation created:', responseData);
      toast.success(`New quotation #${responseData.id} created successfully`);
      setShowReview(false);
      setFormData(null);
      reset({
        items: [{ quantity: '', unit_price: '', item_name: '', product_id: null }],
        customer_name: '',
        selectedCustomerId: null
      });
      onSave();
    } catch (error) {
      console.error('Error saving quotation:', error);
      const errorMessage = error.message || 'An unexpected error occurred while saving the quotation';
      toast.error(errorMessage);
    }
  };

  return (
    <QuotationFormView
      register={register}
      handleSubmit={handleSubmit}
      onSubmit={handleReview}
      customers={customers || []}
      projects={Array.isArray(projects) ? projects : []}
      products={Array.isArray(products) ? products : []}
      selectedCustomerId={selectedCustomerId}
      selectedProjectId={selectedProjectId}
      currentQuotation={currentQuotation}
      errors={errors}
      control={control}
      customerOrders={selectedCustomerOrders}
      customerMessages={selectedCustomerMessages}
      customerProjects={selectedCustomerProjects}
      isLoading={isLoadingInitial || isLoadingCustomer}
      error={initialError || customerError}
      items={items}
      fields={fields}
      append={append}
      remove={remove}
      showReview={showReview}
      formData={formData}
      handleConfirmSubmit={handleConfirmSubmit}
      handleCancelReview={() => setShowReview(false)}
    />
  );
};

QuotationForm.propTypes = {
  currentQuotation: PropTypes.shape({
    id: PropTypes.number,
    account_number: PropTypes.string,
    admin_id: PropTypes.number,
    attachments: PropTypes.array,
    customer_email: PropTypes.string,
    customer_id: PropTypes.number,
    customer_name: PropTypes.string,
    customer_phone: PropTypes.string,
    description: PropTypes.string,
    discount: PropTypes.number,
    items: PropTypes.arrayOf(PropTypes.shape({
      item_name: PropTypes.string,
      quantity: PropTypes.number,
      unit_price: PropTypes.number,
      product_id: PropTypes.number
    })),
    notes: PropTypes.string,
    project_id: PropTypes.number,
    status: PropTypes.string,
    tax_rate: PropTypes.number,
    terms_conditions: PropTypes.string,
    validity_period: PropTypes.number,
    created_at: PropTypes.string,
    updated_at: PropTypes.string,
  }),
  onSave: PropTypes.func.isRequired,
};

export default QuotationForm;