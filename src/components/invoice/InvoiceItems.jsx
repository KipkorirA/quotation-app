// InvoiceItems.jsx
import PropTypes from 'prop-types';

export const InvoiceItems = ({ items = [], onChange }) => {
  const addItem = () => {
    const newItems = [...items, { description: '', quantity: 1, unit_price: 0, subtotal: 0 }];
    console.log('POST - Adding new item:', newItems[newItems.length - 1]);
    onChange(newItems);
  };

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    const updatedItem = { ...newItems[index], [field]: value };
    
    // Calculate subtotal whenever quantity or unit_price changes
    updatedItem.subtotal = Number(updatedItem.quantity) * Number(updatedItem.unit_price);
    newItems[index] = updatedItem;
    
    console.log('PUT - Updating item at index', index, ':', updatedItem);
    onChange(newItems);
  };

  const removeItem = (index) => {
    console.log('DELETE - Removing item at index:', index);
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-0 justify-between items-center bg-gradient-to-r from-blue-50 to-blue-100 p-3 sm:p-4 rounded-lg shadow-sm">
        <h3 className="text-lg sm:text-xl font-bold text-blue-800">Invoice Items</h3>
        <button
          type="button"
          onClick={addItem}
          className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg transition-all duration-200 ease-in-out transform hover:scale-105 shadow-md flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add Item
        </button>
      </div>

      {items.length === 0 && (
        <div className="bg-gray-50 rounded-lg p-4 sm:p-8 text-center">
          <p className="text-gray-500 text-base sm:text-lg">No items added yet</p>
          <p className="text-gray-400 text-xs sm:text-sm mt-2">Click 'Add Item' to get started</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 sm:gap-4">
        {items.map((item, index) => (
          <div key={index} className="bg-white p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
            <div className="grid grid-cols-1 gap-3 sm:gap-4">
              <div className="w-full">
                <label className="block text-sm text-gray-600 mb-1">Description</label>
                <input
                  type="text"
                  placeholder="Enter item description"
                  value={item.description}
                  onChange={e => updateItem(index, 'description', e.target.value)}
                  className="border border-gray-300 p-2 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="Qty"
                    value={isNaN(item.quantity) ? 0 : item.quantity}
                    onChange={e => updateItem(index, 'quantity', Number(e.target.value) || 0)}
                    className="border border-gray-300 p-2 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Unit Price</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Price"
                    value={isNaN(item.unit_price) ? 0 : item.unit_price}
                    onChange={e => updateItem(index, 'unit_price', Number(e.target.value) || 0)}
                    className="border border-gray-300 p-2 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm text-gray-600 mb-1">Subtotal</label>
                  <div className="text-right font-medium text-gray-700 bg-gray-50 p-2 rounded-lg">
                    Ksh.{(isNaN(item.subtotal) ? 0 : item.subtotal).toFixed(2)}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="w-full sm:w-auto text-red-500 hover:text-white hover:bg-red-500 px-4 py-2 rounded-lg transition-all duration-200 ease-in-out flex items-center justify-center gap-2 mt-2 sm:mt-0"
                aria-label={`Remove item ${index + 1}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

InvoiceItems.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    description: PropTypes.string.isRequired,
    quantity: PropTypes.number.isRequired,
    unit_price: PropTypes.number.isRequired,
    subtotal: PropTypes.number.isRequired
  })).isRequired,
  onChange: PropTypes.func.isRequired
};

export default InvoiceItems;