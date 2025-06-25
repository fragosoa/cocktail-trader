import React from 'react';
import { X, Check, Clock, DollarSign } from 'lucide-react';
import { Order, DrinkItem } from '../types';

interface OrderModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onMarkDelivered: (orderId: string, itemId: string) => void;
}

export const OrderModal: React.FC<OrderModalProps> = ({
  order,
  isOpen,
  onClose,
  onMarkDelivered
}) => {
  if (!isOpen || !order) return null;

  const handleMarkDelivered = (itemId: string) => {
    onMarkDelivered(order.id, itemId);
  };

  const pendingItems = order.items.filter(item => item.status === 'pending');
  const deliveredItems = order.items.filter(item => item.status === 'delivered');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{order.orderNumber}</h2>
              <p className="text-blue-100 mt-1">{order.customerName}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-blue-600 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="flex items-center mt-4 text-blue-100">
            <DollarSign className="w-5 h-5 mr-2" />
            <span className="text-lg font-semibold">${order.totalAmount.toFixed(2)}</span>
            <span className="mx-4">•</span>
            <Clock className="w-5 h-5 mr-2" />
            <span>{order.createdAt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {/* Pending Items */}
          {pendingItems.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-orange-500" />
                Pending Items ({pendingItems.length})
              </h3>
              <div className="space-y-3">
                {pendingItems.map((item: DrinkItem) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 bg-orange-50 border-l-4 border-orange-400 rounded-r-lg"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.name}</h4>
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <span>Qty: {item.quantity}</span>
                        <span className="mx-2">•</span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleMarkDelivered(item.id)}
                      className="ml-4 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center min-w-[120px] justify-center"
                    >
                      <Check className="w-5 h-5 mr-2" />
                      Deliver
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Delivered Items */}
          {deliveredItems.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Check className="w-5 h-5 mr-2 text-green-500" />
                Delivered Items ({deliveredItems.length})
              </h3>
              <div className="space-y-3">
                {deliveredItems.map((item: DrinkItem) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 bg-green-50 border-l-4 border-green-400 rounded-r-lg opacity-75"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-700">{item.name}</h4>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <span>Qty: {item.quantity}</span>
                        <span className="mx-2">•</span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="ml-4 text-green-600 font-medium flex items-center">
                      <Check className="w-5 h-5 mr-2" />
                      Delivered
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Order Complete Message */}
          {order.status === 'completed' && (
            <div className="mt-6 p-4 bg-green-100 border border-green-300 rounded-lg">
              <div className="flex items-center text-green-800">
                <Check className="w-6 h-6 mr-2" />
                <span className="font-semibold">Order Complete!</span>
              </div>
              <p className="text-green-700 mt-1">All items have been delivered to {order.customerName}.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {pendingItems.length > 0 
                ? `${pendingItems.length} item${pendingItems.length !== 1 ? 's' : ''} remaining`
                : 'All items delivered'
              }
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};