// InvoiceItems.jsx
import PropTypes from 'prop-types';

const InvoiceItems = ({ items = [], onChange }) => {
  const addItem = () => {
    onChange([...items, { description: '', quantity: 1, unit_price: 0, amount: 0 }]);
  };

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    const updatedItem = { ...newItems[index], [field]: value };
    
    // Calculate amount whenever quantity or unit_price changes
    updatedItem.amount = updatedItem.quantity * updatedItem.unit_price;
    newItems[index] = updatedItem;
    
    onChange(newItems);
  };

  const removeItem = (index) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">Invoice Items</h3>
        <button
          type="button"
          onClick={addItem}
          className="text-blue-500 hover:text-blue-600 px-4 py-2 rounded"
        >
          Add Item
        </button>
      </div>

      {items.length === 0 && (
        <p className="text-gray-500 text-center py-4">No items added yet</p>
      )}

      {items.map((item, index) => (
        <div key={index} className="flex gap-2 items-center">
          <input
            type="text"
            placeholder="Enter item description"
            value={item.description}
            onChange={e => updateItem(index, 'description', e.target.value)}
            className="border p-2 rounded flex-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <input
            type="number"
            min="1"
            placeholder="Enter quantity"
            value={item.quantity}
            onChange={e => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
            className="border p-2 rounded w-20 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <input
            type="number"
            step="0.01"
            min="0"
            placeholder="Enter unit price"
            value={item.unit_price}
            onChange={e => updateItem(index, 'unit_price', parseFloat(e.target.value) || 0)}
            className="border p-2 rounded w-24 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <div className="w-24 text-right pr-2">
            ${(item.amount || 0).toFixed(2)}
          </div>
          <button
            type="button"
            onClick={() => removeItem(index)}
            className="text-red-500 hover:text-red-600 px-2 py-1 rounded hover:bg-red-50"
            aria-label={`Remove item ${index + 1}`}
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
};

InvoiceItems.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    description: PropTypes.string.isRequired,
    quantity: PropTypes.number.isRequired,
    unit_price: PropTypes.number.isRequired,
    amount: PropTypes.number.isRequired
  })).isRequired,
  onChange: PropTypes.func.isRequired
};

export default InvoiceItems;