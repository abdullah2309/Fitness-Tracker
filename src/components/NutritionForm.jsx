import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function NutritionForm({ onClose, onSubmit }) {
  const [mealType, setMealType] = useState('breakfast');
  const [foodItems, setFoodItems] = useState('');
  const [calories, setCalories] = useState(0);
  const [protein, setProtein] = useState(0);
  const [carbs, setCarbs] = useState(0);
  const [fats, setFats] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ mealType, foodItems, calories, protein, carbs, fats });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-900">Log Nutrition</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Meal Type</label>
            <select 
              value={mealType}
              onChange={(e) => setMealType(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 outline-none"
            >
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="snack">Snack</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Food Items</label>
            <textarea 
              required
              value={foodItems}
              onChange={(e) => setFoodItems(e.target.value)}
              placeholder="e.g., 2 eggs, 1 slice of toast, coffee"
              className="w-full px-4 py-2 rounded-xl border border-slate-200 outline-none min-h-[80px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Calories (kcal)</label>
              <input 
                type="number"
                value={calories}
                onChange={(e) => setCalories(parseInt(e.target.value))}
                className="w-full px-4 py-2 rounded-xl border border-slate-200"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Protein (g)</label>
              <input 
                type="number"
                value={protein}
                onChange={(e) => setProtein(parseInt(e.target.value))}
                className="w-full px-4 py-2 rounded-xl border border-slate-200"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Carbs (g)</label>
              <input 
                type="number"
                value={carbs}
                onChange={(e) => setCarbs(parseInt(e.target.value))}
                className="w-full px-4 py-2 rounded-xl border border-slate-200"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Fats (g)</label>
              <input 
                type="number"
                value={fats}
                onChange={(e) => setFats(parseInt(e.target.value))}
                className="w-full px-4 py-2 rounded-xl border border-slate-200"
              />
            </div>
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
              Save Entry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
