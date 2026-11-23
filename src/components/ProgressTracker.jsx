import React from 'react';
import { Activity, ShieldCheck, HeartPulse } from './Icons';

export const ProgressTracker = ({ medicines }) => {
  const total = medicines.length;
  const taken = medicines.filter(m => m.status === 'taken').length;
  const pending = medicines.filter(m => m.status === 'pending').length;
  const skipped = medicines.filter(m => m.status === 'skipped').length;

  const percentage = total > 0 ? Math.round((taken / total) * 100) : 0;
  const pendingPercent = total > 0 ? Math.round((pending / total) * 100) : 0;
  const skippedPercent = total > 0 ? Math.round((skipped / total) * 100) : 0;

  // Motivational message based on progress
  let feedback = {
    title: 'Start Your Regimen',
    message: 'Take your scheduled medicines on time to maintain health balance.',
    color: 'text-sky-700'
  };

  if (total === 0) {
    feedback = {
      title: 'No Medicines Scheduled',
      message: 'Click "Add Medicine" to create your personalized daily schedule.',
      color: 'text-slate-600'
    };
  } else if (percentage === 100) {
    feedback = {
      title: 'Outstanding! 100% Adherence',
      message: 'You have taken all scheduled medications today. Keep up the healthy habits!',
      color: 'text-emerald-700'
    };
  } else if (percentage >= 50) {
    feedback = {
      title: 'Good Progress!',
      message: `You've completed ${percentage}% of your regimen. ${pending} more doses remaining today.`,
      color: 'text-teal-700'
    };
  } else if (taken > 0) {
    feedback = {
      title: 'Regimen in Progress',
      message: `${taken} dose taken so far. Stay hydrated and watch for upcoming reminders.`,
      color: 'text-blue-700'
    };
  } else if (skipped > 0) {
    feedback = {
      title: 'Doses Missed',
      message: 'You have skipped some doses. Try to resume your schedule as advised by your doctor.',
      color: 'text-amber-700'
    };
  }

  return (
    <div className="progress-tracker-card">
      <div className="progress-header">
        <div className="progress-title-group">
          <div className="progress-icon-badge">
            <Activity size={20} className="text-teal-600" />
          </div>
          <div>
            <h3 className="progress-main-title">Daily Adherence Tracker</h3>
            <p className="progress-subtitle">Real-time medication intake completion</p>
          </div>
        </div>
        <div className="progress-score-badge">
          <span className="progress-score-num">{percentage}%</span>
          <span className="progress-score-label">Completed</span>
        </div>
      </div>

      {/* Segmented Progress Bar */}
      <div className="progress-bar-container">
        <div className="progress-bar-track">
          <div 
            className="progress-bar-segment segment-taken" 
            style={{ width: `${percentage}%` }}
            title={`Taken: ${taken} (${percentage}%)`}
          />
          <div 
            className="progress-bar-segment segment-skipped" 
            style={{ width: `${skippedPercent}%` }}
            title={`Skipped: ${skipped} (${skippedPercent}%)`}
          />
        </div>
      </div>

      {/* Legend & Feedback */}
      <div className="progress-footer">
        <div className="progress-legend">
          <div className="legend-item">
            <span className="legend-dot dot-taken"></span>
            <span>Taken ({taken})</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot dot-pending"></span>
            <span>Pending ({pending})</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot dot-skipped"></span>
            <span>Skipped ({skipped})</span>
          </div>
        </div>

        <div className="progress-feedback">
          <ShieldCheck size={16} className="text-teal-600 flex-shrink-0" />
          <span className={`feedback-text ${feedback.color}`}>
            <strong>{feedback.title}:</strong> {feedback.message}
          </span>
        </div>
      </div>
    </div>
  );
};
