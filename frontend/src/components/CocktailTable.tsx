import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown, Volume2, ShoppingCart } from 'lucide-react';
import { CocktailData } from '../types';
import PurchaseModal from './PurchaseModal';

interface CocktailTableProps {
  cocktails: CocktailData[];
}

const CocktailTable: React.FC<CocktailTableProps> = ({ cocktails }) => {
  const navigate = useNavigate();
  const [flashingIds, setFlashingIds] = useState<Set<string>>(new Set());
  const [prevPrices, setPrevPrices] = useState<Map<string, number>>(new Map());
  const [selectedCocktail, setSelectedCocktail] = useState<CocktailData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const newFlashingIds = new Set<string>();
    const newPrevPrices = new Map<string, number>();

    cocktails.forEach(cocktail => {
      const prevPrice = prevPrices.get(cocktail.id);
      if (prevPrice && prevPrice !== cocktail.price) {
        newFlashingIds.add(cocktail.id);
      }
      newPrevPrices.set(cocktail.id, cocktail.price);
    });

    if (newFlashingIds.size > 0) {
      setFlashingIds(newFlashingIds);
      setTimeout(() => setFlashingIds(new Set()), 1000);
    }

    setPrevPrices(newPrevPrices);
  }, [cocktails, prevPrices]);

  const formatPrice = (price: number) => `$${price.toFixed(2)}`;
  const formatChange = (change: number) => `${change >= 0 ? '+' : ''}${change.toFixed(2)}`;
  const formatPercent = (percent: number) => `${percent >= 0 ? '+' : ''}${percent.toFixed(2)}%`;
  const formatVolume = (volume: number) => {
    if (volume >= 1000000) return `${(volume / 1000000).toFixed(1)}M`;
    if (volume >= 1000) return `${(volume / 1000).toFixed(1)}K`;
    return volume.toString();
  };

  const handleRowClick = (cocktailId: string, event: React.MouseEvent) => {
    // Don't navigate if clicking on the buy button
    if ((event.target as HTMLElement).closest('.buy-button')) {
      return;
    }
    navigate(`/cocktail/${cocktailId}`);
  };

  const handleBuyClick = (cocktail: CocktailData, event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedCocktail(cocktail);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCocktail(null);
  };

  return (
    <>
      <div className="bg-slate-800 rounded-sm overflow-hidden shadow-2xl">
        <div className="bg-slate-700 px-6 py-4 border-b border-slate-600">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-cyan-400" />
            Cocktail Exchange
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700 text-slate-300">
              <tr>
                <th className="px-6 py-4 text-left font-medium">Symbol</th>
                <th className="px-6 py-4 text-left font-medium">Name</th>
                <th className="px-6 py-4 text-right font-medium">Price</th>
                <th className="px-6 py-4 text-right font-medium">Change</th>
                <th className="px-6 py-4 text-right font-medium">Volume</th>
                <th className="px-6 py-4 text-right font-medium">Market Cap</th>
                <th className="px-6 py-4 text-right font-medium">24h Range</th>
                <th className="px-6 py-4 text-center font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-600">
              {cocktails.map((cocktail) => (
                <tr
                  key={cocktail.id}
                  onClick={(e) => handleRowClick(cocktail.id, e)}
                  className={`
                    hover:bg-slate-700 cursor-pointer transition-all duration-200
                    ${flashingIds.has(cocktail.id) 
                      ? cocktail.change >= 0 
                        ? 'bg-emerald-900/20 animate-pulse'
                        : 'bg-red-900/20 animate-pulse'
                      : 'bg-slate-800'
                    }
                  `}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-cyan-400">
                        {cocktail.symbol}
                      </span>
                      {cocktail.change >= 0 ? (
                        <TrendingUp className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-400" />
                      )}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <span className="text-white font-medium">{cocktail.name}</span>
                  </td>
                  
                  <td className="px-6 py-4 text-right">
                    <div className="flex flex-col items-end">
                      <span className="font-mono font-bold text-lg text-white">
                        {formatPrice(cocktail.price)}
                      </span>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 text-right">
                    <div className="flex flex-col items-end">
                      <span 
                        className={`font-mono font-bold ${
                          cocktail.change >= 0 ? 'text-emerald-400' : 'text-red-400'
                        }`}
                      >
                        {formatChange(cocktail.change)}
                      </span>
                      <span 
                        className={`font-mono text-sm ${
                          cocktail.change >= 0 ? 'text-emerald-400' : 'text-red-400'
                        }`}
                      >
                        {formatPercent(cocktail.changePercent)}
                      </span>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 text-right">
                    <span className="font-mono text-slate-300">
                      {formatVolume(cocktail.volume)}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4 text-right">
                    <span className="font-mono text-slate-300">
                      ${(cocktail.marketCap / 1000000).toFixed(1)}M
                    </span>
                  </td>
                  
                  <td className="px-6 py-4 text-right">
                    <div className="flex flex-col items-end text-sm">
                      <span className="text-emerald-400 font-mono">
                        {formatPrice(cocktail.high24h)}
                      </span>
                      <span className="text-red-400 font-mono">
                        {formatPrice(cocktail.low24h)}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={(e) => handleBuyClick(cocktail, e)}
                      className="buy-button bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-sm font-medium transition-colors flex items-center gap-2 mx-auto"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Buy
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Purchase Modal */}
      {selectedCocktail && (
        <PurchaseModal
          cocktail={selectedCocktail}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default CocktailTable;