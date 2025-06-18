import React, { useMemo } from 'react';
import { CandlestickData } from '../types';

interface CandlestickChartProps {
  data: CandlestickData[];
  width?: number;
  height?: number;
}

const CandlestickChart: React.FC<CandlestickChartProps> = ({ 
  data, 
  width = 800, 
  height = 400 
}) => {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return null;

    const prices = data.flatMap(d => [d.open, d.high, d.low, d.close]);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice;
    const padding = priceRange * 0.1;

    const chartMinPrice = minPrice - padding;
    const chartMaxPrice = maxPrice + padding;
    const chartPriceRange = chartMaxPrice - chartMinPrice;

    const candleWidth = (width - 80) / data.length * 0.8;
    const candleSpacing = (width - 80) / data.length;

    return {
      minPrice: chartMinPrice,
      maxPrice: chartMaxPrice,
      priceRange: chartPriceRange,
      candleWidth,
      candleSpacing,
      chartHeight: height - 60,
      chartTop: 40
    };
  }, [data, width, height]);

  if (!chartData || !data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 bg-slate-800 rounded-sm">
        <span className="text-slate-400">No data available</span>
      </div>
    );
  }

  const getY = (price: number) => {
    return chartData.chartTop + ((chartData.maxPrice - price) / chartData.priceRange) * chartData.chartHeight;
  };

  const formatPrice = (price: number) => `$${price.toFixed(2)}`;

  // Generate grid lines
  const gridLines = [];
  const numGridLines = 5;
  for (let i = 0; i <= numGridLines; i++) {
    const price = chartData.minPrice + (chartData.priceRange * i / numGridLines);
    const y = getY(price);
    gridLines.push({ price, y });
  }

  return (
    <div className="bg-slate-800 rounded-sm p-4">
      <svg width={width} height={height} className="overflow-visible">
        {/* Grid lines */}
        {gridLines.map((line, index) => (
          <g key={index}>
            <line
              x1={40}
              y1={line.y}
              x2={width - 40}
              y2={line.y}
              stroke="#475569"
              strokeWidth={0.5}
              strokeDasharray="2,2"
            />
            <text
              x={35}
              y={line.y + 4}
              textAnchor="end"
              fontSize={10}
              fill="#94A3B8"
              fontFamily="monospace"
            >
              {formatPrice(line.price)}
            </text>
          </g>
        ))}

        {/* Candlesticks */}
        {data.map((candle, index) => {
          const x = 40 + index * chartData.candleSpacing + chartData.candleSpacing / 2;
          const openY = getY(candle.open);
          const closeY = getY(candle.close);
          const highY = getY(candle.high);
          const lowY = getY(candle.low);
          
          const isGreen = candle.close > candle.open;
          const color = isGreen ? '#10B981' : '#EF4444';
          const bodyTop = Math.min(openY, closeY);
          const bodyHeight = Math.abs(closeY - openY);

          return (
            <g key={index}>
              {/* Wick */}
              <line
                x1={x}
                y1={highY}
                x2={x}
                y2={lowY}
                stroke={color}
                strokeWidth={1}
              />
              
              {/* Body */}
              <rect
                x={x - chartData.candleWidth / 2}
                y={bodyTop}
                width={chartData.candleWidth}
                height={Math.max(bodyHeight, 1)}
                fill={isGreen ? color : 'transparent'}
                stroke={color}
                strokeWidth={1}
              />
              
              {/* Hover area */}
              <rect
                x={x - chartData.candleSpacing / 2}
                y={chartData.chartTop}
                width={chartData.candleSpacing}
                height={chartData.chartHeight}
                fill="transparent"
                className="hover:fill-slate-600/20"
              >
                <title>
                  {`${candle.date} ${candle.time}
Open: ${formatPrice(candle.open)}
High: ${formatPrice(candle.high)}
Low: ${formatPrice(candle.low)}
Close: ${formatPrice(candle.close)}
Volume: ${candle.volume}`}
                </title>
              </rect>
            </g>
          );
        })}

        {/* Time axis labels */}
        {data.filter((_, i) => i % Math.max(1, Math.floor(data.length / 6)) === 0).map((candle, index) => {
          const originalIndex = data.findIndex(d => d.timestamp === candle.timestamp);
          const x = 40 + originalIndex * chartData.candleSpacing + chartData.candleSpacing / 2;
          
          return (
            <text
              key={index}
              x={x}
              y={height - 10}
              textAnchor="middle"
              fontSize={10}
              fill="#94A3B8"
              fontFamily="monospace"
            >
              {candle.time}
            </text>
          );
        })}
      </svg>
    </div>
  );
};

export default CandlestickChart;