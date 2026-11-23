import React from 'react';
import { 
  BellRing, 
  Pill, 
  Clock, 
  Utensils, 
  Check, 
  X, 
  Volume2, 
  HeartPulse 
} from './Icons';

export const ReminderNotification = ({ 
  reminder, 
  onDismiss, 
  onMarkTaken 
}) => {
  if (!reminder) return null;

  // Format time
  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    const [hours, minutes] = timeStr.split(':');
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const formattedHours = h % 12 || 12;
    return `${formattedHours}:${minutes} ${ampm}`;
  };

  return (
    <div className="reminder-overlay-backdrop">
      <div className="reminder-popup-card animate-bounce-subtle" role="alertdialog" aria-modal="true">
        {/* Animated Beacon Header */}
        <div className="reminder-popup-header">
          <div className="reminder-bell-badge">
            <BellRing size={26} className="reminder-bell-svg animate-ring" />
          </div>
          <div className="reminder-header-titles">
            <span className="reminder-badge-tag">MEDICINE DUE NOW</span>
            <h3 className="reminder-alert-title">Time to Take Your Medicine!</h3>
          </div>
          <button 
            type="button" 
            className="reminder-close-btn" 
            onClick={() => onDismiss(reminder.id)}
            aria-label="Dismiss alert"
          >
            <X size={18} />
          </button>
        </div>

        {/* Medicine Details Box */}
        <div className="reminder-medicine-box">
          <div className="reminder-med-icon-wrap">
            <Pill size={28} className="text-sky-600" />
          </div>

          <div className="reminder-med-details">
            <h4 className="reminder-med-name">{reminder.name}</h4>
            <div className="reminder-tags-row">
              <span className="reminder-chip dosage-chip">Dosage: {reminder.dosage}</span>
              <span className="reminder-chip type-chip">{reminder.type}</span>
            </div>
          </div>
        </div>

        {/* Schedule & Food Instructions */}
        <div className="reminder-schedule-info">
          <div className="reminder-info-tile">
            <Clock size={16} className="text-sky-600" />
            <div className="tile-text">
              <span className="tile-label">Scheduled Time</span>
              <strong className="tile-val">{formatTime(reminder.time)}</strong>
            </div>
          </div>

          <div className="reminder-info-tile">
            <Utensils size={16} className="text-teal-600" />
            <div className="tile-text">
              <span className="tile-label">Food Instruction</span>
              <strong className="tile-val">{reminder.foodInstruction}</strong>
            </div>
          </div>
        </div>

        {/* Notes if present */}
        {reminder.notes && (
          <div className="reminder-notes-box">
            <p><strong>Note:</strong> {reminder.notes}</p>
          </div>
        )}

        {/* Audio indicator */}
        <div className="reminder-sound-alert">
          <Volume2 size={14} className="text-teal-600" />
          <span>Audio reminder sounded • Safe & timely intake protects your health</span>
        </div>

        {/* Actions */}
        <div className="reminder-actions-row">
          <button
            type="button"
            className="btn btn-secondary reminder-dismiss-btn"
            onClick={() => onDismiss(reminder.id)}
          >
            Dismiss for Now
          </button>
          <button
            type="button"
            className="btn btn-primary reminder-take-btn"
            onClick={() => onMarkTaken(reminder.id)}
          >
            <Check size={18} /> Mark as Taken
          </button>
        </div>
      </div>
    </div>
  );
};
