import { useForm } from 'react-hook-form';
import { sendEmail } from '../api';
import { toast } from 'react-toastify';

const EmailForm = () => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    try {
      await sendEmail(data);
      toast.success('Email sent successfully');
      reset();
    } catch (error) {
      toast.error(error.message || 'Failed to send email');
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto p-8 space-y-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Send Email</h2>
      <div className="space-y-2">
        <input 
          {...register('recipient', {
            required: 'Recipient email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address'
            }
          })} 
          placeholder="Recipient Email" 
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-800 placeholder-gray-400"
          aria-invalid={errors.recipient ? "true" : "false"}
        />
        {errors.recipient && (
          <p className="text-red-500 text-sm font-medium">{errors.recipient.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <textarea 
          {...register('message', {
            required: 'Message is required',
            minLength: { value: 10, message: 'Message must be at least 10 characters' }
          })} 
          placeholder="Message" 
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 h-40 resize-y text-gray-800 placeholder-gray-400"
          aria-invalid={errors.message ? "true" : "false"}
        />
        {errors.message && (
          <p className="text-red-500 text-sm font-medium">{errors.message.message}</p>
        )}
      </div>
      <button 
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg shadow-sm"
      >
        {isSubmitting ? 'Sending...' : 'Send'}
      </button>
    </form>
  );
};

export default EmailForm;