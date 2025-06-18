import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { mockCocktails } from './data/mockData';
import { usePriceSimulation } from './hooks/usePriceSimulation';
import Dashboard from './components/Dashboard';
import CocktailDetail from './components/CocktailDetail';

function App() {
  const cocktails = usePriceSimulation(mockCocktails);

  return (
    <Router>
      <div className="min-h-screen bg-gray-950">
        <Routes>
          <Route path="/" element={<Dashboard cocktails={cocktails} />} />
          <Route path="/cocktail/:id" element={<CocktailDetail cocktails={cocktails} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;