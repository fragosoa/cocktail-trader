import { useState, useEffect, useCallback } from 'react';
import { CocktailData } from '../types';

export const usePriceSimulation = (initialCocktails: CocktailData[]) => {
  const [cocktails, setCocktails] = useState<CocktailData[]>(initialCocktails);

  const updatePrices = useCallback(() => {
    setCocktails(prevCocktails => 
      prevCocktails.map(cocktail => {
        // Random chance to update price (30% chance per update)
        if (Math.random() > 0.3) return cocktail;

        // Generate realistic price movement
        const volatility = 0.01; // 1% max change per update
        const changePercent = (Math.random() - 0.5) * volatility;
        const newPrice = cocktail.price * (1 + changePercent);
        const priceChange = newPrice - cocktail.price;
        const newChangePercent = (priceChange / cocktail.price) * 100;

        // Update 24h high/low
        const newHigh24h = Math.max(cocktail.high24h, newPrice);
        const newLow24h = Math.min(cocktail.low24h, newPrice);

        // Simulate volume changes
        const volumeChange = (Math.random() - 0.5) * 0.1; // 10% volume volatility
        const newVolume = Math.max(100, Math.floor(cocktail.volume * (1 + volumeChange)));

        return {
          ...cocktail,
          price: Math.round(newPrice * 100) / 100,
          change: Math.round(priceChange * 100) / 100,
          changePercent: Math.round(newChangePercent * 100) / 100,
          volume: newVolume,
          high24h: Math.round(newHigh24h * 100) / 100,
          low24h: Math.round(newLow24h * 100) / 100,
        };
      })
    );
  }, []);

  useEffect(() => {
    const intervals = [
      setInterval(updatePrices, 2000), // Every 2 seconds
      setInterval(updatePrices, 3000), // Every 3 seconds
      setInterval(updatePrices, 5000), // Every 5 seconds
    ];

    return () => {
      intervals.forEach(interval => clearInterval(interval));
    };
  }, [updatePrices]);

  return cocktails;
};