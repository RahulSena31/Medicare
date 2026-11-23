import React, { useState, useEffect } from 'react';
import { StatisticsCards } from './StatisticsCards';
import { ProgressTracker } from './ProgressTracker';
import { MedicineList } from './MedicineList';
import { 
  Sparkles, 
  HeartPulse, 
  Calendar, 
  Clock, 
  BellRing, 
  Plus, 
  CheckCircle2, 
  AlertCircle,
  Pill,
  Utensils
} from './Icons';
import { healthTips } from '../data/healthTips';

export const Dashboard = ({ 
  medicines, 
  onMarkTaken, 
  onSkip, 
  onEdit, 
  onDelete, 
  onOpenAddModal, 
  onTriggerTestReminder 
}) => {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  // Cycle health tips automatically every 15 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % healthTips.length);
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  // Time-aware greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning!';
    if (hour < 17) return 'Good Afternoon!';
    return 'Good Evening!';
  };

  const currentDateFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  // Calculate upcoming pending medicine
  const pendingMedicines = medicines
    .filter(m => m.status === 'pending')
    .sort((a, b) => a.time.localeCompare(b.time));

  const nextMedicine = pendingMedicines.length > 0 ? pendingMedicines[0] : null;

  const currentTip = healthTips[currentTipIndex];

  return (
    <div className="dashboard-content-wrapper">
      {/* Welcome Banner */}
      <div className="welcome-banner">
        <div className="welcome-banner-decorations"></div>
        <div className="welcome-banner-left">
          <div className="welcome-badge">
            <HeartPulse size={16} className="text-teal-600" />
            <span>Health & Medication Assistant</span>
          </div>
          <h2 className="welcome-title">{getGreeting()} Take care of your health.</h2>
          <p className="welcome-subtitle">
            Welcome to MediCare. Keep your medication routine organized, on-track, and never miss a scheduled dose.
          </p>

          <div className="welcome-quick-actions">
            <button 
              type="button" 
              className="btn btn-primary"
              onClick={onOpenAddModal}
            >
              <Plus size={16} /> Add New Medicine
            </button>
            <button 
              type="button" 
              className="btn btn-secondary banner-test-btn"
              onClick={onTriggerTestReminder}
              title="Test the reminder alert popup"
            >
              <BellRing size={16} className="text-amber-500" /> Test Reminder Alert
            </button>
          </div>
        </div>

        {/* Next Due Dose Highlight Card */}
        <div className="upcoming-dose-highlight">
          <div className="highlight-header">
            <span className="highlight-tag">NEXT UPCOMING DOSE</span>
            <Clock size={15} className="text-sky-600" />
          </div>

          {nextMedicine ? (
            <div className="highlight-body">
              <div className="highlight-med-row">
                <div className="highlight-icon">
                  <Pill size={22} className="text-sky-600" />
                </div>
                <div>
                  <h4 className="highlight-name">{nextMedicine.name}</h4>
                  <span className="highlight-dosage">{nextMedicine.dosage} • {nextMedicine.type}</span>
                </div>
              </div>

              <div className="highlight-time-box">
                <div className="time-display">
                  <Clock size={16} />
                  <span>Scheduled: {nextMedicine.time}</span>
                </div>
                <span className="food-tag">{nextMedicine.foodInstruction}</span>
              </div>

              <button 
                type="button" 
                className="btn btn-take-quick"
                onClick={() => onMarkTaken(nextMedicine.id)}
              >
                <CheckCircle2 size={16} /> Mark as Taken
              </button>
            </div>
          ) : (
            <div className="highlight-empty">
              <CheckCircle2 size={32} className="text-emerald-500 mb-2" />
              <h4>All Caught Up!</h4>
              <p>No pending medicines scheduled for now. Great job adhering to your health plan!</p>
            </div>
          )}
        </div>
      </div>

      {/* Motivational Health Tip Banner */}
      <div className="health-tip-banner">
        <div className="tip-icon-box">
          <Sparkles size={20} className="text-amber-500" />
        </div>
        <div className="tip-content">
          <span className="tip-category">Daily Health Wisdom • {currentTip.category}</span>
          <p className="tip-quote">"{currentTip.tip}"</p>
        </div>
        <div className="tip-dots">
          {healthTips.map((_, i) => (
            <button
              key={i}
              type="button"
              className={`tip-dot ${i === currentTipIndex ? 'tip-dot-active' : ''}`}
              onClick={() => setCurrentTipIndex(i)}
              aria-label={`Jump to tip ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Dynamic Statistics Cards */}
      <StatisticsCards medicines={medicines} />

      {/* Daily Progress Tracker */}
      <ProgressTracker medicines={medicines} />

      {/* Today's Medicine Schedule with Search & Filters */}
      <div className="dashboard-section-header">
        <div>
          <h3 className="section-main-title">Today's Medicine Schedule</h3>
          <p className="section-subtitle">Real-time medication roster with interactive controls</p>
        </div>
        <span className="date-tag-badge">
          <Calendar size={14} className="inline mr-1" /> {currentDateFormatted}
        </span>
      </div>

      <MedicineList
        medicines={medicines}
        onMarkTaken={onMarkTaken}
        onSkip={onSkip}
        onEdit={onEdit}
        onDelete={onDelete}
        onOpenAddModal={onOpenAddModal}
      />
    </div>
  );
};
