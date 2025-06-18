import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { CocktailData } from '../types';
import CocktailTable from './CocktailTable';
import TickerBanner from './TickerBanner';

interface DashboardProps {
  cocktails: CocktailData[];
}

const Dashboard: React.FC<DashboardProps> = ({ cocktails }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Calculate market stats
  const totalMarketCap = cocktails.reduce((sum, cocktail) => sum + cocktail.marketCap, 0);
  const totalVolume = cocktails.reduce((sum, cocktail) => sum + cocktail.volume, 0);
  const gainers = cocktails.filter(c => c.change > 0).length;
  const losers = cocktails.filter(c => c.change < 0).length;

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Ticker Banner */}
      <TickerBanner cocktails={cocktails} />

      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-8 h-8 text-cyan-400" />
                <h1 className="text-2xl font-bold">Cocktail Exchange</h1>
              </div>
              <div className="flex items-center gap-2 text-emerald-400">
                <Activity className="w-4 h-4" />
                <span className="text-sm">LIVE</span>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-sm text-slate-400">Market Time</div>
              <div className="text-lg font-mono">
                {currentTime.toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Market Overview */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800 rounded-sm p-6 border border-slate-700">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-5 h-5 text-cyan-400" />
              <span className="text-sm text-slate-400">Total Market Cap</span>
            </div>
            <div className="text-2xl font-mono font-bold">
              ${(totalMarketCap / 1000000).toFixed(1)}M
            </div>
          </div>

          <div className="bg-slate-800 rounded-sm p-6 border border-slate-700">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-5 h-5 text-cyan-400" />
              <span className="text-sm text-slate-400">24h Volume</span>
            </div>
            <div className="text-2xl font-mono font-bold">
              {totalVolume.toLocaleString()}
            </div>
          </div>

          <div className="bg-slate-800 rounded-sm p-6 border border-slate-700">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <span className="text-sm text-slate-400">Gainers</span>
            </div>
            <div className="text-2xl font-mono font-bold text-emerald-400">
              {gainers}
            </div>
          </div>

          <div className="bg-slate-800 rounded-sm p-6 border border-slate-700">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-5 h-5 text-red-400" />
              <span className="text-sm text-slate-400">Losers</span>
            </div>
            <div className="text-2xl font-mono font-bold text-red-400">
              {losers}
            </div>
          </div>
        </div>

        {/* Cocktail Table */}
        <CocktailTable cocktails={cocktails} />
      </div>

      {/* Footer */}
      <div className="mt-12 bg-slate-800 border-t border-slate-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="text-center text-slate-400 text-sm">
            Cocktail Exchange © 2025 | Real-time market data simulation
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;