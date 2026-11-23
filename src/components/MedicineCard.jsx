import React from 'react';
import { 
  Pill, 
  Tablet, 
  Beaker, 
  Droplet, 
  Syringe, 
  Clock, 
  Utensils, 
  CheckCircle2, 
  XCircle, 
  Edit3, 
  Trash2, 
  Info,
  Check
} from './Icons';

export const MedicineCard = ({ 
  medicine, 
  onMarkTaken, 
  onSkip, 
  onEdit, 
  onDelete 
}) => {
  // Helper to render type-specific icon
  const getTypeIcon = (type) => {
    switch (type) {
      case 'Tablet':
        return <Tablet size={18} />;
      case 'Capsule':
        return <Pill size={18} />;
      case 'Syrup':
        return <Beaker size={18} />;
      case 'Drops':
        return <Droplet size={18} />;
      default:
        return <Syringe size={18} />;
    }
  };

  // Helper to format 24-hr time to 12-hr format (e.g., 13:30 -> 1:30 PM)
  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    const [hours, minutes] = timeStr.split(':');
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const formattedHours = h % 12 || 12;
    return `${formattedHours}:${minutes} ${ampm}`;
  };

  // Helper for food instruction badge styling
  const getFoodStyle = (instruction) => {
    switch (instruction) {
      case 'Before food':
        return 'food-before';
      case 'After food':
        return 'food-after';
      case 'With food':
        return 'food-with';
      default:
        return 'food-general';
    }
  };

  // Status configuration
  const statusConfig = {
    taken: {
      label: 'Taken',
      badgeClass: 'status-badge-taken',
      icon: <CheckCircle2 size={14} />,
      borderClass: 'card-border-taken'
    },
    pending: {
      label: 'Pending',
      badgeClass: 'status-badge-pending',
      icon: <Clock size={14} />,
      borderClass: 'card-border-pending'
    },
    skipped: {
      label: 'Skipped',
      badgeClass: 'status-badge-skipped',
      icon: <XCircle size={14} />,
      borderClass: 'card-border-skipped'
    }
  };

  const statusInfo = statusConfig[medicine.status] || statusConfig.pending;

  return (
    <div className={`medicine-card ${statusInfo.borderClass}`}>
      {/* Top Bar: Type + Status */}
      <div className="card-top-row">
        <div className="card-type-chip">
          <span className="type-icon">{getTypeIcon(medicine.type)}</span>
          <span className="type-label">{medicine.type}</span>
        </div>

        <div className={`status-pill ${statusInfo.badgeClass}`}>
          {statusInfo.icon}
          <span>{statusInfo.label}</span>
        </div>
      </div>

      {/* Main Info */}
      <div className="card-main-info">
        <h4 className="medicine-title">{medicine.name}</h4>
        <div className="dosage-tag">Dosage: {medicine.dosage}</div>
      </div>

      {/* Meta Grid: Time & Food */}
      <div className="card-meta-grid">
        <div className="meta-item">
          <Clock size={15} className="text-sky-600" />
          <span className="meta-label">Time:</span>
          <strong className="meta-value">{formatTime(medicine.time)}</strong>
        </div>

        <div className="meta-item">
          <Utensils size={15} className="text-teal-600" />
          <span className={`food-badge ${getFoodStyle(medicine.foodInstruction)}`}>
            {medicine.foodInstruction}
          </span>
        </div>
      </div>

      {/* Optional Notes */}
      {medicine.notes && (
        <div className="card-notes-box">
          <Info size={13} className="notes-icon" />
          <p className="notes-text">{medicine.notes}</p>
        </div>
      )}

      {/* Dates row if provided */}
      {medicine.startDate && (
        <div className="card-dates-row">
          <span>Started: {medicine.startDate}</span>
          {medicine.endDate && <span>Until: {medicine.endDate}</span>}
        </div>
      )}

      {/* Card Actions */}
      <div className="card-actions">
        {medicine.status !== 'taken' ? (
          <button
            type="button"
            className="card-btn btn-action-take"
            onClick={() => onMarkTaken(medicine.id)}
            title="Mark as Taken"
          >
            <Check size={16} />
            <span>Mark as Taken</span>
          </button>
        ) : (
          <button
            type="button"
            className="card-btn btn-action-completed"
            onClick={() => onMarkTaken(medicine.id)}
            title="Click to reset to Pending"
          >
            <CheckCircle2 size={16} />
            <span>Completed</span>
          </button>
        )}

        {medicine.status === 'pending' && (
          <button
            type="button"
            className="card-btn btn-action-skip"
            onClick={() => onSkip(medicine.id)}
            title="Mark as Skipped"
          >
            <XCircle size={15} />
            <span>Skip</span>
          </button>
        )}

        {medicine.status === 'skipped' && (
          <button
            type="button"
            className="card-btn btn-action-retry"
            onClick={() => onMarkTaken(medicine.id)}
            title="Take now"
          >
            <Check size={15} />
            <span>Take Now</span>
          </button>
        )}

        <div className="card-action-icon-group">
          <button
            type="button"
            className="icon-action-btn edit-btn"
            onClick={() => onEdit(medicine)}
            title="Edit medicine details"
            aria-label="Edit"
          >
            <Edit3 size={16} />
          </button>

          <button
            type="button"
            className="icon-action-btn delete-btn"
            onClick={() => onDelete(medicine)}
            title="Delete medicine"
            aria-label="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
