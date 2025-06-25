import { Order } from '../types';

export const getOrderStatusColor = (order: Order): string => {
  if (order.status === 'completed') return 'bg-green-100 text-green-800 border-green-200';
  
  const now = new Date();
  const orderAge = (now.getTime() - order.createdAt.getTime()) / (1000 * 60); // minutes
  
  if (orderAge > 20) return 'bg-red-100 text-red-800 border-red-200'; // overdue
  return 'bg-blue-100 text-blue-800 border-blue-200'; // active/pending
};

export const getOrderStatusText = (order: Order): string => {
  if (order.status === 'completed') return 'Completed';
  
  const now = new Date();
  const orderAge = (now.getTime() - order.createdAt.getTime()) / (1000 * 60); // minutes
  
  if (orderAge > 20) return 'Overdue';
  return 'Active';
};

export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  });
};

export const getTimeSince = (date: Date): string => {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes === 1) return '1 min ago';
  if (diffInMinutes < 60) return `${diffInMinutes} mins ago`;
  
  const hours = Math.floor(diffInMinutes / 60);
  const remainingMins = diffInMinutes % 60;
  
  if (hours === 1) return remainingMins > 0 ? `1h ${remainingMins}m ago` : '1h ago';
  return remainingMins > 0 ? `${hours}h ${remainingMins}m ago` : `${hours}h ago`;
};

export const getPendingItemsCount = (order: Order): number => {
  return order.items.filter(item => item.status === 'pending').length;
};

export const isOrderOverdue = (order: Order): boolean => {
  const now = new Date();
  const orderAge = (now.getTime() - order.createdAt.getTime()) / (1000 * 60);
  return orderAge > 20 && order.status === 'pending';
};