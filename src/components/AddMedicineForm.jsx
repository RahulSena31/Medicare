import React, { useState, useEffect } from 'react';
import { 
  Tablet, 
  Pill, 
  Beaker, 
  Droplet, 
  Syringe, 
  Clock, 
  Calendar, 
  Utensils, 
  X, 
  AlertCircle, 
  Check, 
  Plus, 
  Edit3 
} from './Icons';

export const AddMedicineForm = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData = null 
}) => {
  const isEditMode = Boolean(initialData);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    type: 'Tablet',
    time: '08:00',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    foodInstruction: 'After food',
    notes: ''
  });

  // Validation errors state
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Sync state if initialData changes (edit mode)
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        dosage: initialData.dosage || '',
        type: initialData.type || 'Tablet',
        time: initialData.time || '08:00',
        startDate: initialData.startDate || new Date().toISOString().split('T')[0],
        endDate: initialData.endDate || '',
        foodInstruction: initialData.foodInstruction || 'After food',
        notes: initialData.notes || ''
      });
      setErrors({});
      setTouched({});
    } else {
      // Reset form
      setFormData({
        name: '',
        dosage: '',
        type: 'Tablet',
        time: '08:00',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        foodInstruction: 'After food',
        notes: ''
      });
      setErrors({});
      setTouched({});
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  // Medicine types options
  const medicineTypes = [
    { id: 'Tablet', label: 'Tablet', icon: <Tablet size={18} /> },
    { id: 'Capsule', label: 'Capsule', icon: <Pill size={18} /> },
    { id: 'Syrup', label: 'Syrup', icon: <Beaker size={18} /> },
    { id: 'Drops', label: 'Drops', icon: <Droplet size={18} /> },
    { id: 'Other', label: 'Other', icon: <Syringe size={18} /> }
  ];

  // Food instruction options
  const foodOptions = [
    { id: 'Before food', label: 'Before Food' },
    { id: 'After food', label: 'After Food' },
    { id: 'With food', label: 'With Food' }
  ];

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Medicine name is required.';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Medicine name must be at least 2 characters.';
    }

    if (!formData.dosage.trim()) {
      newErrors.dosage = 'Dosage is required (e.g. 1 Tablet, 5 ml).';
    }

    if (!formData.time) {
      newErrors.time = 'Reminder time is required.';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required.';
    }

    if (formData.endDate && formData.endDate < formData.startDate) {
      newErrors.endDate = 'End date cannot be earlier than start date.';
    }

    return newErrors;
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setTouched(prev => ({ ...prev, [field]: true }));

    // Realtime error clearing
    if (errors[field]) {
      setErrors(prev => {
        const rest = { ...prev };
        delete rest[field];
        return rest;
      });
    }
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      // Mark all touched
      const allTouched = Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {});
      setTouched(allTouched);
      return;
    }

    // Submit payload
    onSubmit({
      ...formData,
      id: initialData ? initialData.id : `med-${Date.now()}`,
      status: initialData ? initialData.status : 'pending',
      updatedAt: new Date().toISOString()
    });

    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card form-modal-card animate-scale-up" role="dialog" aria-modal="true">
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="modal-header-icon">
              {isEditMode ? <Edit3 size={20} className="text-sky-600" /> : <Plus size={20} className="text-teal-600" />}
            </div>
            <div>
              <h3 className="modal-title">{isEditMode ? 'Edit Medicine Schedule' : 'Add New Medicine'}</h3>
              <p className="modal-subtitle">Configure dosage, schedule and instructions</p>
            </div>
          </div>
          <button 
            type="button" 
            className="modal-close-btn" 
            onClick={onClose}
            aria-label="Close form"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="medicine-form">
          {/* Row 1: Medicine Name & Dosage */}
          <div className="form-grid form-grid-2">
            <div className="form-field">
              <label className="form-label" htmlFor="med-name">
                Medicine Name <span className="text-rose-500">*</span>
              </label>
              <input
                id="med-name"
                type="text"
                className={`form-input ${touched.name && errors.name ? 'input-error' : ''}`}
                placeholder="e.g., Amoxicillin 500mg, Paracetamol"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                onBlur={() => handleBlur('name')}
              />
              {touched.name && errors.name && (
                <div className="field-error-message">
                  <AlertCircle size={13} />
                  <span>{errors.name}</span>
                </div>
              )}
            </div>

            <div className="form-field">
              <label className="form-label" htmlFor="med-dosage">
                Dosage <span className="text-rose-500">*</span>
              </label>
              <input
                id="med-dosage"
                type="text"
                className={`form-input ${touched.dosage && errors.dosage ? 'input-error' : ''}`}
                placeholder="e.g., 1 tablet, 5 ml, 2 drops"
                value={formData.dosage}
                onChange={(e) => handleChange('dosage', e.target.value)}
                onBlur={() => handleBlur('dosage')}
              />
              {touched.dosage && errors.dosage && (
                <div className="field-error-message">
                  <AlertCircle size={13} />
                  <span>{errors.dosage}</span>
                </div>
              )}
            </div>
          </div>

          {/* Medicine Type Selector */}
          <div className="form-field">
            <label className="form-label">
              Medicine Type <span className="text-rose-500">*</span>
            </label>
            <div className="type-buttons-selector">
              {medicineTypes.map((typeOption) => {
                const isSelected = formData.type === typeOption.id;
                return (
                  <button
                    key={typeOption.id}
                    type="button"
                    className={`type-select-btn ${isSelected ? 'type-btn-active' : ''}`}
                    onClick={() => handleChange('type', typeOption.id)}
                  >
                    <span className="type-btn-icon">{typeOption.icon}</span>
                    <span className="type-btn-label">{typeOption.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Row 2: Reminder Time & Start Date */}
          <div className="form-grid form-grid-3">
            <div className="form-field">
              <label className="form-label" htmlFor="med-time">
                Reminder Time <span className="text-rose-500">*</span>
              </label>
              <div className="input-with-icon">
                <Clock size={16} className="input-icon" />
                <input
                  id="med-time"
                  type="time"
                  className={`form-input pl-10 ${touched.time && errors.time ? 'input-error' : ''}`}
                  value={formData.time}
                  onChange={(e) => handleChange('time', e.target.value)}
                  onBlur={() => handleBlur('time')}
                />
              </div>
              {touched.time && errors.time && (
                <div className="field-error-message">
                  <AlertCircle size={13} />
                  <span>{errors.time}</span>
                </div>
              )}
            </div>

            <div className="form-field">
              <label className="form-label" htmlFor="med-start-date">
                Start Date <span className="text-rose-500">*</span>
              </label>
              <div className="input-with-icon">
                <Calendar size={16} className="input-icon" />
                <input
                  id="med-start-date"
                  type="date"
                  className={`form-input pl-10 ${touched.startDate && errors.startDate ? 'input-error' : ''}`}
                  value={formData.startDate}
                  onChange={(e) => handleChange('startDate', e.target.value)}
                  onBlur={() => handleBlur('startDate')}
                />
              </div>
              {touched.startDate && errors.startDate && (
                <div className="field-error-message">
                  <AlertCircle size={13} />
                  <span>{errors.startDate}</span>
                </div>
              )}
            </div>

            <div className="form-field">
              <label className="form-label" htmlFor="med-end-date">
                End Date <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <div className="input-with-icon">
                <Calendar size={16} className="input-icon" />
                <input
                  id="med-end-date"
                  type="date"
                  className={`form-input pl-10 ${touched.endDate && errors.endDate ? 'input-error' : ''}`}
                  value={formData.endDate}
                  onChange={(e) => handleChange('endDate', e.target.value)}
                  onBlur={() => handleBlur('endDate')}
                />
              </div>
              {touched.endDate && errors.endDate && (
                <div className="field-error-message">
                  <AlertCircle size={13} />
                  <span>{errors.endDate}</span>
                </div>
              )}
            </div>
          </div>

          {/* Food Instructions */}
          <div className="form-field">
            <label className="form-label">
              Food Instructions <span className="text-rose-500">*</span>
            </label>
            <div className="food-options-selector">
              {foodOptions.map((opt) => {
                const isSelected = formData.foodInstruction === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    className={`food-select-btn ${isSelected ? 'food-btn-active' : ''}`}
                    onClick={() => handleChange('foodInstruction', opt.id)}
                  >
                    <Utensils size={15} />
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Additional Notes */}
          <div className="form-field">
            <label className="form-label" htmlFor="med-notes">
              Additional Notes / Doctor Instructions <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <textarea
              id="med-notes"
              rows="2"
              className="form-textarea"
              placeholder="e.g. Drink plenty of warm water, take with milk, avoid citrus fruits..."
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
            ></textarea>
          </div>

          {/* Form Actions */}
          <div className="form-actions-row">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              {isEditMode ? (
                <>
                  <Check size={16} /> Save Changes
                </>
              ) : (
                <>
                  <Plus size={16} /> Add Medicine
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
