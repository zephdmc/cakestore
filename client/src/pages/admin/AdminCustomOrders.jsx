// pages/admin/AdminCustomOrders.jsx
import { useState, useEffect } from 'react';
import { getAllCustomOrders, updateCustomOrderStatus } from '../../services/customOrderService';

export default function AdminCustomOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const ordersData = await getAllCustomOrders();
      setOrders(ordersData);
    } catch (error) {
      console.error('Error loading custom orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await updateCustomOrderStatus(orderId, newStatus);
      loadOrders(); // Reload orders
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.status === filter);

  if (loading) return <div className="flex justify-center py-8">Loading custom orders...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Custom Cake Orders</h1>
      
      <div className="mb-6">
        <label className="mr-2">Filter by status:</label>
        <select 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded p-2"
        >
          <option value="all">All Orders</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="in-progress">In Progress</option>
          <option value="ready">Ready for Pickup</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
      
      <div className="grid gap-6">
        {filteredOrders.length === 0 ? (
          <p className="text-center py-8">No orders found</p>
        ) : (
          filteredOrders.map(order => (
            <div key={order.id} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">Order #{order.id.slice(-6)}</h3>
                  <p className="text-gray-600">{order.userEmail}</p>
                  <p className="text-sm text-gray-500">{new Date(order.createdAt?.toDate()).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">₦{order.price?.toLocaleString()}</p>
                  <div className="flex items-center mt-1">
                    <span className="mr-2">Status:</span>
                    <select 
                      value={order.status} 
                      onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                      className="border rounded p-1 text-sm"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="in-progress">In Progress</option>
                      <option value="ready">Ready for Pickup</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-purpleDark mb-2">Cake Details</h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-gray-600">Occasion:</span> {order.occasion}</p>
                    <p><span className="text-gray-600">Size:</span> {order.size}</p>
                    <p><span className="text-gray-600">Flavor:</span> {order.flavor}</p>
                    <p><span className="text-gray-600">Frosting:</span> {order.frosting}</p>
                    <p><span className="text-gray-600">Filling:</span> {order.filling || 'None'}</p>
                    <p><span className="text-gray-600">Decorations:</span> {order.decorations}</p>
                    {order.message && <p><span className="text-gray-600">Message:</span> {order.message}</p>}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-purpleDark mb-2">Delivery Information</h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-gray-600">Delivery Date:</span> {order.deliveryDate}</p>
                    <p><span className="text-gray-600">Time:</span> {order.deliveryTime || 'Any time'}</p>
                    {order.allergies && <p><span className="text-gray-600">Allergies:</span> {order.allergies}</p>}
                    {order.specialInstructions && <p><span className="text-gray-600">Instructions:</span> {order.specialInstructions}</p>}
                  </div>
                  
                  {order.imageUrl && (
                    <div className="mt-4">
                      <h4 className="font-medium text-purpleDark mb-2">Reference Image</h4>
                      <img src={order.imageUrl} alt="Reference" className="h-32 object-contain" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
