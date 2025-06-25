import React from 'react';
import { Clock, Users, DollarSign } from 'lucide-react';
import { Order } from '../types';
import { 
  getOrderStatusColor, 
  getOrderStatusText, 
  formatTime, 
  getTimeSince, 
  getPendingItemsCount,
  isOrderOverdue 
} from '../utils/orderUtils';

interface OrderCardProps {
  order: Order;
  onClick: (order: Order) => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order, onClick }) => {
  const statusColor = getOrderStatusColor(order);
  const statusText = getOrderStatusText(order);
  const pendingItems = getPendingItemsCount(order);
  const overdue = isOrderOverdue(order);

  return (
    <div
      onClick={() => onClick(order)}
      className={`
        bg-white rounded-xl shadow-md border-2 cursor-pointer
        transform transition-all duration-200 hover:scale-105 hover:shadow-lg
        active:scale-95 min-h-[200px] flex flex-col
        ${overdue ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-blue-300'}
      `}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold text-gray-900">{order.orderNumber}</h3>
          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${statusColor}`}>
            {statusText}
          </span>
        </div>
        <p className="text-gray-600 font-medium">{order.customerName}</p>
      </div>

      {/* Content */}
      <div className="flex-1 p-4">
        <div className="space-y-3">
          <div className="flex items-center text-gray-600">
            <Users className="w-5 h-5 mr-2" />
            <span className="text-sm">
              {order.items.length} item{order.items.length !== 1 ? 's' : ''}
              {pendingItems > 0 && (
                <span className="ml-2 px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">
                  {pendingItems} pending
                </span>
              )}
            </span>
          </div>

          <div className="flex items-center text-gray-600">
            <DollarSign className="w-5 h-5 mr-2" />
            <span className="text-sm font-medium">${order.totalAmount.toFixed(2)}</span>
          </div>

          <div className="flex items-center text-gray-600">
            <Clock className="w-5 h-5 mr-2" />
            <div className="text-sm">
              <div>{formatTime(order.createdAt)}</div>
              <div className={`text-xs ${overdue ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                {getTimeSince(order.createdAt)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="p-4 pt-0">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              order.status === 'completed' 
                ? 'bg-green-500' 
                : overdue 
                  ? 'bg-red-500' 
                  : 'bg-blue-500'
            }`}
            style={{
              width: `${((order.items.length - pendingItems) / order.items.length) * 100}%`
            }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{order.items.length - pendingItems} completed</span>
          <span>{order.items.length} total</span>
        </div>
      </div>
    </div>
  );
};