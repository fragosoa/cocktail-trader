import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, TrendingDown, BarChart3, Volume2 } from 'lucide-react';
import { CocktailData, CandlestickData } from '../types';
import CandlestickChart from './CandlestickChart';

interface CocktailDetailProps {
  cocktails: CocktailData[];
}

const CocktailDetail: React.FC<CocktailDetailProps> = ({ cocktails }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const cocktail = cocktails.find(c => c.id === id);

  if (!cocktail) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Cocktail not found</h1>
          <button
            onClick={() => navigate('/')}
            className="bg-cyan-600 hover:bg-cyan-700 px-4 py-2 rounded-sm transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Convert price history to candlestick data
  const candlestickData: CandlestickData[] = cocktail.priceHistory.map(point => {
    const date = new Date(point.timestamp);
    return {
      ...point,
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      })
    };
  });

  const formatPrice = (price: number) => `$${price.toFixed(2)}`;
  const formatChange = (change: number) => `${change >= 0 ? '+' : ''}${change.toFixed(2)}`;
  const formatPercent = (percent: number) => `${percent >= 0 ? '+' : ''}${percent.toFixed(2)}%`;

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Dashboard
              </button>
            </div>
            
            <div className="text-right">
              <div className="text-sm text-slate-400">Last updated</div>
              <div className="text-sm text-slate-300">
                {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Cocktail Info */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <h1 className="text-4xl font-bold">{cocktail.name}</h1>
            <span className="text-2xl font-mono text-cyan-400">({cocktail.symbol})</span>
            {cocktail.change >= 0 ? (
              <TrendingUp className="w-8 h-8 text-emerald-400" />
            ) : (
              <TrendingDown className="w-8 h-8 text-red-400" />
            )}
          </div>
          
          <div className="flex items-center gap-8">
            <div>
              <div className="text-5xl font-mono font-bold mb-2">
                {formatPrice(cocktail.price)}
              </div>
              <div className="flex items-center gap-2">
                <span 
                  className={`text-xl font-mono font-bold ${
                    cocktail.change >= 0 ? 'text-emerald-400' : 'text-red-400'
                  }`}
                >
                  {formatChange(cocktail.change)}
                </span>
                <span 
                  className={`text-lg font-mono ${
                    cocktail.change >= 0 ? 'text-emerald-400' : 'text-red-400'
                  }`}
                >
                  ({formatPercent(cocktail.changePercent)})
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800 rounded-sm p-4">
            <div className="flex items-center gap-2 mb-2">
              <Volume2 className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-slate-400">Volume</span>
            </div>
            <div className="text-xl font-mono font-bold">
              {cocktail.volume.toLocaleString()}
            </div>
          </div>

          <div className="bg-slate-800 rounded-sm p-4">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-slate-400">Market Cap</span>
            </div>
            <div className="text-xl font-mono font-bold">
              ${(cocktail.marketCap / 1000000).toFixed(1)}M
            </div>
          </div>

          <div className="bg-slate-800 rounded-sm p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span className="text-sm text-slate-400">24h High</span>
            </div>
            <div className="text-xl font-mono font-bold text-emerald-400">
              {formatPrice(cocktail.high24h)}
            </div>
          </div>

          <div className="bg-slate-800 rounded-sm p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-4 h-4 text-red-400" />
              <span className="text-sm text-slate-400">24h Low</span>
            </div>
            <div className="text-xl font-mono font-bold text-red-400">
              {formatPrice(cocktail.low24h)}
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-slate-800 rounded-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-6 h-6 text-cyan-400" />
            <h2 className="text-2xl font-bold">5-Minute Candlestick Chart</h2>
          </div>
          
          <div className="overflow-x-auto">
            <CandlestickChart 
              data={candlestickData} 
              width={Math.max(800, candlestickData.length * 8)}
              height={500}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CocktailDetail;