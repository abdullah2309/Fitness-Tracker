import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function ProgressForm({ onClose, onSubmit }) {
  const [weight, setWeight] = useState(0);
  const [bodyFat, setBodyFat] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ weight, bodyFat });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-900">Record Progress</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Weight (kg)</label>
            <input 
              required
              type="number"
              step="0.1"
              value={weight}
              onChange={(e) => setWeight(parseFloat(e.target.value))}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Body Fat % (Optional)</label>
            <input 
              type="number"
              step="0.1"
              value={bodyFat}
              onChange={(e) => setBodyFat(parseFloat(e.target.value))}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 outline-none"
            />
          </div>

          <div className="pt-4 flex gap-3">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 px-6 py-3 rounded-xl font-bold bg-brand-500 text-white hover:bg-brand-600 shadow-lg shadow-brand-500/20 transition-all"
            >
              Save Progress
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
