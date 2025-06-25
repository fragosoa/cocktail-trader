import React, { useState, useEffect } from 'react';
import { BarChart3, RefreshCw, Filter } from 'lucide-react';
import { Order } from '../types';
import { OrderCard } from './OrderCard';
import { OrderModal } from './OrderModal';
import { mockOrders } from '../data/orders';

export const Dashboard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  // Sort orders by newest first
  const sortedOrders = [...orders].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  // Filter orders based on selected filter
  const filteredOrders = sortedOrders.filter(order => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleMarkDelivered = (orderId: string, itemId: string) => {
    setOrders(prevOrders => {
      return prevOrders.map(order => {
        if (order.id === orderId) {
          const updatedItems = order.items.map(item =>
            item.id === itemId ? { ...item, status: 'delivered' as const } : item
          );
          
          // Check if all items are delivered
          const allDelivered = updatedItems.every(item => item.status === 'delivered');
          
          const updatedOrder = {
            ...order,
            items: updatedItems,
            status: allDelivered ? 'completed' as const : order.status
          };

          // Update selected order if it's the one being modified
          if (selectedOrder?.id === orderId) {
            setSelectedOrder(updatedOrder);
          }

          return updatedOrder;
        }
        return order;
      });
    });
  };

  const handleRefresh = () => {
    // In a real app, this would fetch fresh data from the API
    setOrders([...mockOrders]);
  };

  const pendingOrdersCount = orders.filter(order => order.status === 'pending').length;
  const completedOrdersCount = orders.filter(order => order.status === 'completed').length;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center">
              <BarChart3 className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Bar Dashboard</h1>
                <p className="text-sm text-gray-600">Manage drink orders in real-time</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={handleRefresh}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Refresh orders"
              >
                <RefreshCw className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <div className="text-sm">
                <span className="text-gray-600">Total Orders:</span>
                <span className="ml-2 font-semibold text-gray-900">{orders.length}</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-600">Pending:</span>
                <span className="ml-2 font-semibold text-orange-600">{pendingOrdersCount}</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-600">Completed:</span>
                <span className="ml-2 font-semibold text-green-600">{completedOrdersCount}</span>
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-600" />
              <div className="flex rounded-lg overflow-hidden border border-gray-300">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    filter === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter('pending')}
                  className={`px-4 py-2 text-sm font-medium transition-colors border-l border-gray-300 ${
                    filter === 'pending'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Pending
                </button>
                <button
                  onClick={() => setFilter('completed')}
                  className={`px-4 py-2 text-sm font-medium transition-colors border-l border-gray-300 ${
                    filter === 'completed'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Completed
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <BarChart3 className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-600">
              {filter === 'all' 
                ? 'No orders to display at the moment.'
                : `No ${filter} orders to display.`
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onClick={handleOrderClick}
              />
            ))}
          </div>
        )}
      </div>

      {/* Order Modal */}
      <OrderModal
        order={selectedOrder}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedOrder(null);
        }}
        onMarkDelivered={handleMarkDelivered}
      />
    </div>
  );
};