import React from 'react';
import { useCurrency, Currency } from '../../context/CurrencyContext';
import { Globe } from 'lucide-react';

const CurrencySelector: React.FC = () => {
  const { currency, setCurrency } = useCurrency();

  const currencies: Currency[] = ['INR', 'USD', 'EUR', 'GBP'];

  return (
    <div className="flex items-center space-x-1.5 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/50 rounded-xl px-2.5 py-1 text-xs text-gray-200 transition-colors">
      <Globe className="w-3.5 h-3.5 text-blue-400" />
      <select
        value={currency}
        onChange={(e) => setCurrency(e.target.value as Currency)}
        className="bg-transparent border-none text-xs text-white font-medium focus:ring-0 focus:outline-none cursor-pointer pr-1"
      >
        {currencies.map((c) => (
          <option key={c} value={c} className="bg-slate-900 text-white">
            {c}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CurrencySelector;
