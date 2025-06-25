export interface DrinkItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  status: 'pending' | 'delivered';
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  items: DrinkItem[];
  status: 'pending' | 'completed';
  createdAt: Date;
  totalAmount: number;
}

export type OrderStatus = 'pending' | 'completed';
export type ItemStatus = 'pending' | 'delivered';