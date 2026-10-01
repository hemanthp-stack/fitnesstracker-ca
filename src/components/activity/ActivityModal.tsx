import React, { useEffect } from 'react';
import { PlusCircle, Pencil, X } from 'lucide-react';
import { useFitness } from '../../context/FitnessContext';
import { ActivityForm } from './ActivityForm';

export const ActivityModal: React.FC = () => {
  const {
    isAddModalOpen,
    setIsAddModalOpen,
    editingActivity,
    setEditingActivity,
  } = useFitness();

  const isOpen = isAddModalOpen || Boolean(editingActivity);
  const isEditing = Boolean(editingActivity);

  const handleClose = React.useCallback(() => {
    setIsAddModalOpen(false);
    setEditingActivity(null);
  }, [setIsAddModalOpen, setEditingActivity]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div
        className="relative bg-white rounded-2xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                isEditing ? 'bg-sky-50 text-sky-600' : 'bg-emerald-50 text-emerald-600'
              }`}
            >
              {isEditing ? <Pencil className="w-5 h-5" /> : <PlusCircle className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 leading-tight">
                {isEditing ? 'Edit Activity' : 'Log Fitness Activity'}
              </h2>
              <p className="text-xs text-slate-500">
                {isEditing
                  ? 'Update workout metrics and notes'
                  : 'Record steps, duration, and calories burned'}
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-100 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <ActivityForm
          initialActivity={editingActivity}
          onSubmitSuccess={handleClose}
          onCancel={handleClose}
        />
      </div>
    </div>
  );
};
