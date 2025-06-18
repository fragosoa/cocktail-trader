import { CocktailData, PricePoint } from '../types';

// Generate realistic price history for candlestick charts
const generatePriceHistory = (basePrice: number, days: number = 1): PricePoint[] => {
  const points: PricePoint[] = [];
  const now = Date.now();
  const intervalMs = 5 * 60 * 1000; // 5 minutes
  const totalPoints = (days * 24 * 60) / 5; // 5-minute intervals
  
  let currentPrice = basePrice;
  
  for (let i = totalPoints; i >= 0; i--) {
    const timestamp = now - (i * intervalMs);
    const volatility = 0.02; // 2% volatility
    const trend = (Math.random() - 0.5) * volatility;
    
    const open = currentPrice;
    const changePercent = (Math.random() - 0.5) * 0.03; // Max 3% change per interval
    const close = open * (1 + changePercent);
    const high = Math.max(open, close) * (1 + Math.random() * 0.01);
    const low = Math.min(open, close) * (1 - Math.random() * 0.01);
    const volume = Math.floor(Math.random() * 1000) + 100;
    
    points.push({
      timestamp,
      open: Math.round(open * 100) / 100,
      high: Math.round(high * 100) / 100,
      low: Math.round(low * 100) / 100,
      close: Math.round(close * 100) / 100,
      volume
    });
    
    currentPrice = close;
  }
  
  return points;
};

export const mockCocktails: CocktailData[] = [
  {
    id: '1',
    name: 'Mojito',
    symbol: 'MOJ',
    price: 12.50,
    change: 0.25,
    changePercent: 2.04,
    volume: 15420,
    marketCap: 2400000,
    high24h: 13.10,
    low24h: 11.80,
    priceHistory: generatePriceHistory(12.50)
  },
  {
    id: '2',
    name: 'Margarita',
    symbol: 'MAR',
    price: 11.75,
    change: -0.15,
    changePercent: -1.26,
    volume: 12890,
    marketCap: 1890000,
    high24h: 12.25,
    low24h: 11.40,
    priceHistory: generatePriceHistory(11.75)
  },
  {
    id: '3',
    name: 'Old Fashioned',
    symbol: 'OLD',
    price: 15.80,
    change: 0.80,
    changePercent: 5.33,
    volume: 8950,
    marketCap: 3200000,
    high24h: 16.20,
    low24h: 14.50,
    priceHistory: generatePriceHistory(15.80)
  },
  {
    id: '4',
    name: 'Negroni',
    symbol: 'NEG',
    price: 14.25,
    change: -0.35,
    changePercent: -2.40,
    volume: 11200,
    marketCap: 2100000,
    high24h: 15.10,
    low24h: 13.90,
    priceHistory: generatePriceHistory(14.25)
  },
  {
    id: '5',
    name: 'Manhattan',
    symbol: 'MAN',
    price: 16.90,
    change: 0.45,
    changePercent: 2.74,
    volume: 7800,
    marketCap: 2800000,
    high24h: 17.25,
    low24h: 15.80,
    priceHistory: generatePriceHistory(16.90)
  },
  {
    id: '6',
    name: 'Whiskey Sour',
    symbol: 'WHS',
    price: 13.60,
    change: 0.10,
    changePercent: 0.74,
    volume: 9600,
    marketCap: 1950000,
    high24h: 14.20,
    low24h: 13.20,
    priceHistory: generatePriceHistory(13.60)
  },
  {
    id: '7',
    name: 'Cosmopolitan',
    symbol: 'COS',
    price: 12.95,
    change: -0.20,
    changePercent: -1.52,
    volume: 13400,
    marketCap: 2200000,
    high24h: 13.80,
    low24h: 12.50,
    priceHistory: generatePriceHistory(12.95)
  },
  {
    id: '8',
    name: 'Daiquiri',
    symbol: 'DAI',
    price: 10.85,
    change: 0.30,
    changePercent: 2.84,
    volume: 16800,
    marketCap: 1650000,
    high24h: 11.40,
    low24h: 10.20,
    priceHistory: generatePriceHistory(10.85)
  }
];