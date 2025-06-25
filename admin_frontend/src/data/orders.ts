import { Order } from '../types';

export const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: '#001',
    customerName: 'Table 12',
    status: 'pending',
    createdAt: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
    totalAmount: 45.50,
    items: [
      { id: '1a', name: 'Mojito', quantity: 2, price: 12.00, status: 'pending' },
      { id: '1b', name: 'Whiskey Sour', quantity: 1, price: 11.50, status: 'pending' },
      { id: '1c', name: 'Beer (Draft)', quantity: 1, price: 5.00, status: 'delivered' },
      { id: '1d', name: 'Caesar Salad', quantity: 1, price: 17.00, status: 'pending' }
    ]
  },
  {
    id: '2',
    orderNumber: '#002',
    customerName: 'Bar Seat 3',
    status: 'pending',
    createdAt: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    totalAmount: 28.00,
    items: [
      { id: '2a', name: 'Old Fashioned', quantity: 1, price: 14.00, status: 'pending' },
      { id: '2b', name: 'Manhattan', quantity: 1, price: 14.00, status: 'pending' }
    ]
  },
  {
    id: '3',
    orderNumber: '#003',
    customerName: 'Table 8',
    status: 'completed',
    createdAt: new Date(Date.now() - 25 * 60 * 1000), // 25 minutes ago
    totalAmount: 32.50,
    items: [
      { id: '3a', name: 'Margarita', quantity: 2, price: 11.00, status: 'delivered' },
      { id: '3b', name: 'Nachos', quantity: 1, price: 10.50, status: 'delivered' }
    ]
  },
  {
    id: '4',
    orderNumber: '#004',
    customerName: 'Table 15',
    status: 'pending',
    createdAt: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    totalAmount: 67.00,
    items: [
      { id: '4a', name: 'Cosmopolitan', quantity: 3, price: 13.00, status: 'pending' },
      { id: '4b', name: 'Gin & Tonic', quantity: 2, price: 9.00, status: 'pending' },
      { id: '4c', name: 'Wings Platter', quantity: 1, price: 19.00, status: 'pending' }
    ]
  },
  {
    id: '5',
    orderNumber: '#005',
    customerName: 'Table 5',
    status: 'pending',
    createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago (overdue)
    totalAmount: 23.50,
    items: [
      { id: '5a', name: 'Negroni', quantity: 1, price: 12.50, status: 'pending' },
      { id: '5b', name: 'Aperol Spritz', quantity: 1, price: 11.00, status: 'pending' }
    ]
  },
  {
    id: '6',
    orderNumber: '#006',
    customerName: 'Bar Seat 1',
    status: 'pending',
    createdAt: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
    totalAmount: 15.50,
    items: [
      { id: '6a', name: 'IPA (Draft)', quantity: 2, price: 6.00, status: 'pending' },
      { id: '6b', name: 'Pretzels', quantity: 1, price: 3.50, status: 'pending' }
    ]
  }
];