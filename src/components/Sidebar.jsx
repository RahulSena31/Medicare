import React from 'react';
import { 
  HeartPulse, 
  LayoutDashboard, 
  CalendarDays, 
  FilePlus2, 
  Sparkles, 
  Pill, 
  CheckCircle2, 
  Clock, 
  X 
} from './Icons';

export const Sidebar = ({ 
  activeTab, 
  setActiveTab, 
  pendingCount, 
  takenCount, 
  isOpen, 
  onClose,
  onOpenAddModal 
}) => {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard size={20} />,
      badge: null
    },
    {
      id: 'schedule',
      label: "Today's Schedule",
      icon: <CalendarDays size={20} />,
      badge: pendingCount > 0 ? pendingCount : null,
      badgeColor: 'badge-amber'
    },
    {
      id: 'add',
      label: 'Add Medicine',
      icon: <FilePlus2 size={20} />,
      badge: null,
      onClick: () => {
        if (onOpenAddModal) onOpenAddModal();
        else setActiveTab('add');
      }
    },
    {
      id: 'tips',
      label: 'Health & Wellness',
      icon: <Sparkles size={20} />,
      badge: null
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="sidebar-mobile-backdrop" 
          onClick={onClose} 
          aria-hidden="true" 
        />
      )}

      <aside className={`sidebar-container ${isOpen ? 'sidebar-open' : ''}`}>
        {/* Brand Header */}
        <div className="sidebar-brand">
          <div className="brand-logo-icon">
            <HeartPulse size={24} className="text-white" />
          </div>
          <div className="brand-text">
            <h1 className="brand-title">MediCare</h1>
            <span className="brand-subtitle">Smart Medicine Reminder</span>
          </div>
          {isOpen && (
            <button 
              type="button" 
              className="sidebar-close-btn" 
              onClick={onClose}
              aria-label="Close sidebar"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Quick Add Action */}
        <div className="sidebar-quick-action">
          <button 
            type="button" 
            className="sidebar-add-btn"
            onClick={() => {
              if (onOpenAddModal) onOpenAddModal();
              else setActiveTab('add');
              if (onClose) onClose();
            }}
          >
            <Pill size={18} />
            <span>+ Add Medicine</span>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="sidebar-nav">
          <div className="nav-section-title">MAIN MENU</div>
          <ul className="nav-list">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <li key={item.id} className="nav-item">
                  <button
                    type="button"
                    className={`nav-link ${isActive ? 'nav-link-active' : ''}`}
                    onClick={() => {
                      if (item.onClick) {
                        item.onClick();
                      } else {
                        setActiveTab(item.id);
                      }
                      if (onClose) onClose();
                    }}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    <span className="nav-label">{item.label}</span>
                    {item.badge !== null && (
                      <span className={`nav-badge ${item.badgeColor || ''}`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Daily Health Summary Card */}
        <div className="sidebar-compliance-card">
          <div className="compliance-header">
            <CheckCircle2 size={16} className="text-emerald-500" />
            <span className="compliance-title">Today's Progress</span>
          </div>
          <div className="compliance-stats">
            <div className="compliance-stat-item">
              <span className="stat-num text-emerald-600">{takenCount}</span>
              <span className="stat-label">Taken</span>
            </div>
            <div className="compliance-stat-item">
              <span className="stat-num text-amber-600">{pendingCount}</span>
              <span className="stat-label">Pending</span>
            </div>
          </div>
          <div className="compliance-footer">
            <Clock size={12} />
            <span>Live Session Active</span>
          </div>
        </div>

        {/* User / Demo Info */}
        <div className="sidebar-footer">
          <div className="demo-badge">
            <span className="status-dot"></span>
            <span className="demo-text">College Mini Project</span>
          </div>
          <p className="college-tag">Academic Presentation Edition</p>
        </div>
      </aside>
    </>
  );
};
