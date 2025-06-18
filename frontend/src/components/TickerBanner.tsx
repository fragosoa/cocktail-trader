import React, { useEffect, useState } from 'react';
import { CocktailData } from '../types';

interface TickerBannerProps {
  cocktails: CocktailData[];
}

const TickerBanner: React.FC<TickerBannerProps> = ({ cocktails }) => {
  const [animationKey, setAnimationKey] = useState(0);

  // Reset animation when cocktails data changes to ensure smooth updates
  useEffect(() => {
    setAnimationKey(prev => prev + 1);
  }, [cocktails]);

  const formatPrice = (price: number) => `$${price.toFixed(2)}`;
  const formatChange = (change: number) => `${change >= 0 ? '+' : ''}${change.toFixed(2)}`;
  const formatPercent = (percent: number) => `(${percent >= 0 ? '+' : ''}${percent.toFixed(2)}%)`;

  // Duplicate the cocktails array to create seamless loop
  const tickerItems = [...cocktails, ...cocktails];

  return (
    <div className="bg-slate-950 border-b border-slate-700 overflow-hidden relative h-12">
      <div 
        key={animationKey}
        className="flex items-center h-full whitespace-nowrap"
        style={{
          animation: 'ticker-rtl 60s linear infinite'
        }}
      >
        {tickerItems.map((cocktail, index) => (
          <div key={`${cocktail.id}-${index}`} className="flex items-center px-8 text-sm font-mono">
            <span className="text-white font-bold mr-2">{cocktail.symbol}</span>
            <span className="text-slate-200 mr-2">{formatPrice(cocktail.price)}</span>
            <span 
              className={`mr-2 ${
                cocktail.change >= 0 ? 'text-emerald-400' : 'text-red-400'
              }`}
            >
              {formatChange(cocktail.change)}
            </span>
            <span 
              className={`${
                cocktail.change >= 0 ? 'text-emerald-400' : 'text-red-400'
              }`}
            >
              {formatPercent(cocktail.changePercent)}
            </span>
          </div>
        ))}
      </div>
      
      {/* Gradient overlays for smooth fade effect */}
      <div className="absolute top-0 left-0 w-20 h-full bg-gradient-to-r from-slate-950 to-transparent pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-slate-950 to-transparent pointer-events-none"></div>
    </div>
  );
};

export default TickerBanner;