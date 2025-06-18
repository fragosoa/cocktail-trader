import React, { useState } from 'react';
import { X, ShoppingCart, TrendingUp, TrendingDown } from 'lucide-react';
import { CocktailData } from '../types';

interface PurchaseModalProps {
  cocktail: CocktailData;
  isOpen: boolean;
  onClose: () => void;
}

const PurchaseModal: React.FC<PurchaseModalProps> = ({ cocktail, isOpen, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const formatPrice = (price: number) => `$${price.toFixed(2)}`;
  const formatChange = (change: number) => `${change >= 0 ? '+' : ''}${change.toFixed(2)}`;
  const formatPercent = (percent: number) => `${percent >= 0 ? '+' : ''}${percent.toFixed(2)}%`;
  
  const totalPrice = cocktail.price * quantity;

  const handleConfirmPurchase = async () => {
    setIsProcessing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    alert(`Purchase confirmed!\n${quantity} shares of ${cocktail.name} (${cocktail.symbol}) at ${formatPrice(cocktail.price)} each.\nTotal: ${formatPrice(totalPrice)}`);
    
    setIsProcessing(false);
    onClose();
    setQuantity(1);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-sm max-w-md w-full border border-slate-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-6 h-6 text-cyan-400" />
            <h2 className="text-xl font-bold text-white">Buy Order</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Cocktail Info */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div>
                <h3 className="text-2xl font-bold text-white">{cocktail.name}</h3>
                <span className="text-lg font-mono text-cyan-400">({cocktail.symbol})</span>
              </div>
              {cocktail.change >= 0 ? (
                <TrendingUp className="w-6 h-6 text-emerald-400" />
              ) : (
                <TrendingDown className="w-6 h-6 text-red-400" />
              )}
            </div>
            
            <div className="bg-slate-700 rounded-sm p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-300">Current Price</span>
                <span className="text-2xl font-mono font-bold text-white">
                  {formatPrice(cocktail.price)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">24h Change</span>
                <div className="flex items-center gap-2">
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
                    ({formatPercent(cocktail.changePercent)})
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Quantity (Shares)
            </label>
            <input
              type="number"
              min="1"
              max="1000"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full bg-slate-700 border border-slate-600 rounded-sm px-3 py-2 text-white font-mono focus:outline-none focus:border-cyan-400 transition-colors"
            />
          </div>

          {/* Order Summary */}
          <div className="bg-slate-700 rounded-sm p-4 mb-6">
            <h4 className="text-lg font-bold text-white mb-3">Order Summary</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-300">Shares</span>
                <span className="font-mono text-white">{quantity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Price per Share</span>
                <span className="font-mono text-white">{formatPrice(cocktail.price)}</span>
              </div>
              <div className="border-t border-slate-600 pt-2">
                <div className="flex justify-between">
                  <span className="text-white font-bold">Total</span>
                  <span className="font-mono font-bold text-xl text-cyan-400">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 bg-slate-600 hover:bg-slate-500 text-white py-3 px-4 rounded-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmPurchase}
              disabled={isProcessing}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-800 disabled:cursor-not-allowed text-white py-3 px-4 rounded-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  Confirm Purchase
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseModal;