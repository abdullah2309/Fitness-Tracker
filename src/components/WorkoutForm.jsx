import React, { useState } from 'react';
import { X, Plus, Minus } from 'lucide-react';

export default function WorkoutForm({ onClose, onSubmit }) {
  const [name, setName] = useState('');
  const [type, setType] = useState('strength');
  const [exercises, setExercises] = useState([{ name: '', sets: 3, reps: 10, weight: 0 }]);
  const [notes, setNotes] = useState('');

  const addExercise = () => {
    setExercises([...exercises, { name: '', sets: 3, reps: 10, weight: 0 }]);
  };

  const removeExercise = (index) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const updateExercise = (index, field, value) => {
    const newExercises = [...exercises];
    newExercises[index] = { ...newExercises[index], [field]: value };
    setExercises(newExercises);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, type, exercises, notes });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-900">Log Workout</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Routine Name</label>
              <input 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Push Day"
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Type</label>
              <select 
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all"
              >
                <option value="strength">Strength</option>
                <option value="cardio">Cardio</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-700">Exercises</label>
              <button 
                type="button"
                onClick={addExercise}
                className="text-brand-500 text-sm font-bold flex items-center gap-1 hover:underline"
              >
                <Plus size={16} /> Add Exercise
              </button>
            </div>

            {exercises.map((ex, index) => (
              <div key={index} className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-4 relative">
                {exercises.length > 1 && (
                  <button 
                    type="button"
                    onClick={() => removeExercise(index)}
                    className="absolute top-2 right-2 p-1 text-slate-300 hover:text-red-500"
                  >
                    <Minus size={16} />
                  </button>
                )}
                <input 
                  required
                  placeholder="Exercise name"
                  value={ex.name}
                  onChange={(e) => updateExercise(index, 'name', e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:border-brand-500 outline-none"
                />
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Sets</label>
                    <input 
                      type="number"
                      value={ex.sets}
                      onChange={(e) => updateExercise(index, 'sets', parseInt(e.target.value))}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Reps</label>
                    <input 
                      type="number"
                      value={ex.reps}
                      onChange={(e) => updateExercise(index, 'reps', parseInt(e.target.value))}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Weight (kg)</label>
                    <input 
                      type="number"
                      value={ex.weight}
                      onChange={(e) => updateExercise(index, 'weight', parseInt(e.target.value))}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Notes (Optional)</label>
            <textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-brand-500 outline-none min-h-[100px]"
            />
          </div>
        </form>

        <div className="p-6 border-t border-slate-100 flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 px-6 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-all"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            className="flex-1 px-6 py-3 rounded-xl font-bold bg-brand-500 text-white hover:bg-brand-600 shadow-lg shadow-brand-500/20 transition-all"
          >
            Save Workout
          </button>
        </div>
      </div>
    </div>
  );
}
