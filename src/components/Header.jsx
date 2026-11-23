import React, { useState, useEffect } from 'react';
import { 
  BellRing, 
  Plus, 
  Calendar, 
  Clock, 
  Menu, 
  HeartPulse,
  Activity
} from './Icons';

export const Header = ({ 
  onOpenAddModal, 
  onTriggerTestReminder, 
  onToggleMobileMenu,
  pendingCount 
}) => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = currentDateTime.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const formattedTime = currentDateTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  return (
    <header className="header-container">
      {/* Left side: Hamburger (mobile) + Date info */}
      <div className="header-left">
        <button 
          type="button" 
          className="header-menu-btn" 
          onClick={onToggleMobileMenu}
          aria-label="Open mobile menu"
        >
          <Menu size={22} />
        </button>

        <div className="header-date-badge">
          <Calendar size={16} className="text-sky-600" />
          <span className="header-date-text">{formattedDate}</span>
          <span className="header-date-divider">•</span>
          <Clock size={16} className="text-teal-600" />
          <span className="header-time-text">{formattedTime}</span>
        </div>
      </div>

      {/* Right side: Action buttons */}
      <div className="header-actions">
        {/* Test Reminder Button for presentation */}
        <button 
          type="button" 
          className="btn btn-test-reminder"
          onClick={onTriggerTestReminder}
          title="Click to instantly demonstrate a medicine alert notification during college presentation"
        >
          <BellRing size={17} className="bell-ring-pulse text-amber-500" />
          <span className="test-btn-text">Test Reminder</span>
          <span className="test-pill">Demo</span>
        </button>

        {/* Quick Add Medicine Button */}
        <button 
          type="button" 
          className="btn btn-primary"
          onClick={onOpenAddModal}
        >
          <Plus size={18} />
          <span className="add-btn-text">Add Medicine</span>
        </button>
      </div>
    </header>
  );
};
