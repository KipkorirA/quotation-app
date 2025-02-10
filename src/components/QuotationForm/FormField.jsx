// src/components/QuotationForm/FormField.jsx
import PropTypes from 'prop-types';

export const FormField = ({ label, type, name, register, options, rows }) => {
    const className = "w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500";
    
    const renderField = () => {
      switch (type) {
        case 'select':
          return (
            <select name={name} className={className}>
              {options.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          );
        case 'textarea':
          return (
            <textarea 
              name={name}
              rows={rows || 3}
              className={className}
              {...(register && register(name))}
            />
          );
        default:
          return (
            <input
              type={type}
              name={name}
              className={className}
              {...(register && register(name))}
            />
          );
      }
    };
  
    return (
      <div className="form-group">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        {renderField()}
      </div>
    );
  };
  
  FormField.propTypes = {
    label: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    register: PropTypes.func,
    options: PropTypes.arrayOf(PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string,
    })),
    rows: PropTypes.number,
  };
