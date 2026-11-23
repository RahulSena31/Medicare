import React from 'react';
import { Trash2, AlertCircle, X } from './Icons';

export const DeleteConfirmModal = ({ medicine, onConfirm, onCancel }) => {
  if (!medicine) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-card delete-modal-card animate-scale-up" role="dialog" aria-modal="true">
        <div className="delete-modal-header">
          <div className="delete-icon-wrapper">
            <Trash2 size={24} className="text-rose-600" />
          </div>
          <button 
            type="button" 
            className="modal-close-btn" 
            onClick={onCancel}
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        <div className="delete-modal-body">
          <h3 className="delete-modal-title">Delete Medication Schedule?</h3>
          <p className="delete-modal-description">
            Are you sure you want to remove <strong>"{medicine.name}"</strong> ({medicine.dosage}) from your reminder list?
          </p>
          <div className="delete-medicine-summary">
            <span className="summary-chip">Type: {medicine.type}</span>
            <span className="summary-chip">Time: {medicine.time}</span>
            <span className="summary-chip">Food: {medicine.foodInstruction}</span>
          </div>
          <p className="delete-modal-warning">
            <AlertCircle size={14} className="inline mr-1" /> This action cannot be undone for this session.
          </p>
        </div>

        <div className="delete-modal-actions">
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={onCancel}
          >
            Cancel
          </button>
          <button 
            type="button" 
            className="btn btn-danger" 
            onClick={() => onConfirm(medicine.id)}
          >
            <Trash2 size={16} /> Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
};
