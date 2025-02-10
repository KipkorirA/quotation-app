// src/components/QuotationForm/CustomerDetails.jsx
import PropTypes from 'prop-types';

const CustomerDetails = ({ orders, projects, onOrderSelect, onProjectSelect }) => {
  return (
    <>
      <div>
        <h4 className="font-medium">Recent Orders</h4>
        <ul className="list-disc pl-5">
          {orders.map(order => (
            <li 
              key={order.id} 
              className="cursor-pointer hover:text-blue-500 transition duration-200" 
              onClick={(e) => {
                e.stopPropagation();
                onOrderSelect(order);
              }}
            >
              Order #{order.id} - {order.status}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h4 className="font-medium">Projects</h4>
        <ul className="list-disc pl-5">
          {projects.map(project => (
            <li 
              key={project.id} 
              className="cursor-pointer hover:text-blue-500 transition duration-200" 
              onClick={(e) => {
                e.stopPropagation();
                onProjectSelect(project.id);
              }}
            >
              {project.name} - {project.status}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

CustomerDetails.propTypes = {
  orders: PropTypes.array.isRequired,
  projects: PropTypes.array.isRequired,
  onOrderSelect: PropTypes.func.isRequired,
  onProjectSelect: PropTypes.func.isRequired,
};

export default CustomerDetails;