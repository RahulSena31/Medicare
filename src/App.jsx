import React, { useState, useEffect } from 'react';
import { initialMedicines } from './data/initialMedicines';
import { healthTips } from './data/healthTips';
import { playChimeSound } from './utils/notificationSound';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { MedicineList } from './components/MedicineList';
import { AddMedicineForm } from './components/AddMedicineForm';
import { ReminderNotification } from './components/ReminderNotification';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { ToastContainer } from './components/Toast';
import { ProgressTracker } from './components/ProgressTracker';
import { StatisticsCards } from './components/StatisticsCards';
import { Sparkles, HeartPulse, CheckCircle2, Pill, ShieldCheck, HeartHandshake } from './components/Icons';

export function App() {
  // 1. Session Medicines State (in-memory, resets on browser refresh as requested)
  const [medicines, setMedicines] = useState(initialMedicines);

  // 2. Navigation State
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'schedule' | 'tips'

  // 3. Modal & Form States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState(null);
  const [deletingMedicine, setDeletingMedicine] = useState(null);

  // 4. Live Reminder Notification State
  const [activeReminder, setActiveReminder] = useState(null);
  const [notifiedDoseIds, setNotifiedDoseIds] = useState(new Set());

  // 5. Toast Notifications State
  const [toasts, setToasts] = useState([]);

  // 6. Mobile Drawer Navigation State
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Helper to show modern toast notifications
  const showToast = (message, type = 'success') => {
    const newToast = {
      id: `toast-${Date.now()}-${Math.random()}`,
      message,
      type
    };
    setToasts(prev => [...prev, newToast]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // 7. Background Timer Effect for Reminder Checking
  useEffect(() => {
    const checkReminderTimes = () => {
      const now = new Date();
      const currentHours = String(now.getHours()).padStart(2, '0');
      const currentMinutes = String(now.getMinutes()).padStart(2, '0');
      const currentTimeString = `${currentHours}:${currentMinutes}`;

      // Check if any pending medicine matches current time and hasn't been alerted
      medicines.forEach(med => {
        if (
          med.status === 'pending' &&
          med.time === currentTimeString &&
          !notifiedDoseIds.has(med.id)
        ) {
          // Trigger reminder
          setActiveReminder(med);
          setNotifiedDoseIds(prev => new Set(prev).add(med.id));
          playChimeSound();
          showToast(`Reminder alert: Time for ${med.name}!`, 'warning');
        }
      });
    };

    // Run check every 10 seconds
    const interval = setInterval(checkReminderTimes, 10000);
    return () => clearInterval(interval);
  }, [medicines, notifiedDoseIds]);

  // Handler: Add or Update Medicine
  const handleSaveMedicine = (medicineData) => {
    if (editingMedicine) {
      // Update existing
      setMedicines(prev => prev.map(m => m.id === medicineData.id ? { ...medicineData, updatedAt: new Date().toISOString() } : m));
      showToast(`Updated "${medicineData.name}" successfully!`, 'success');
      setEditingMedicine(null);
    } else {
      // Add new
      setMedicines(prev => [medicineData, ...prev]);
      showToast(`Added "${medicineData.name}" to your schedule!`, 'success');
    }
  };

  // Handler: Mark as Taken
  const handleMarkTaken = (id) => {
    setMedicines(prev => prev.map(med => {
      if (med.id === id) {
        const nextStatus = med.status === 'taken' ? 'pending' : 'taken';
        const msg = nextStatus === 'taken' 
          ? `Great job! "${med.name}" marked as taken.` 
          : `"${med.name}" reverted to pending.`;
        showToast(msg, nextStatus === 'taken' ? 'success' : 'info');
        return { ...med, status: nextStatus, updatedAt: new Date().toISOString() };
      }
      return med;
    }));

    // If currently showing reminder for this medicine, close it
    if (activeReminder && activeReminder.id === id) {
      setActiveReminder(null);
    }
  };

  // Handler: Skip Medicine
  const handleSkip = (id) => {
    setMedicines(prev => prev.map(med => {
      if (med.id === id) {
        showToast(`"${med.name}" marked as skipped for today.`, 'warning');
        return { ...med, status: 'skipped', updatedAt: new Date().toISOString() };
      }
      return med;
    }));

    if (activeReminder && activeReminder.id === id) {
      setActiveReminder(null);
    }
  };

  // Handler: Open Edit Form
  const handleEditClick = (medicine) => {
    setEditingMedicine(medicine);
    setIsFormModalOpen(true);
  };

  // Handler: Delete Medicine
  const handleDeleteClick = (medicine) => {
    setDeletingMedicine(medicine);
  };

  const handleConfirmDelete = (id) => {
    const medToDelete = medicines.find(m => m.id === id);
    setMedicines(prev => prev.filter(m => m.id !== id));
    showToast(`Removed "${medToDelete ? medToDelete.name : 'Medicine'}" from schedule.`, 'info');
    setDeletingMedicine(null);
  };

  // Handler: Trigger Test Reminder (for college presentation demonstration!)
  const handleTriggerTestReminder = () => {
    // Find the first pending medicine, or use the first available medicine
    const targetMed = medicines.find(m => m.status === 'pending') || medicines[0] || {
      id: `test-${Date.now()}`,
      name: 'Amoxicillin 500mg',
      dosage: '1 Capsule',
      type: 'Capsule',
      time: '12:00',
      foodInstruction: 'Before food',
      notes: 'Demo college presentation test notification.',
      status: 'pending'
    };

    setActiveReminder(targetMed);
    playChimeSound();
    showToast(`Test Reminder triggered for demonstration!`, 'warning');
  };

  // Calculated counts
  const pendingCount = medicines.filter(m => m.status === 'pending').length;
  const takenCount = medicines.filter(m => m.status === 'taken').length;

  return (
    <div className="app-root-layout">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingCount={pendingCount}
        takenCount={takenCount}
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        onOpenAddModal={() => {
          setEditingMedicine(null);
          setIsFormModalOpen(true);
        }}
      />

      {/* Main App Content Viewport */}
      <div className="app-main-viewport">
        {/* Top Header */}
        <Header
          onOpenAddModal={() => {
            setEditingMedicine(null);
            setIsFormModalOpen(true);
          }}
          onTriggerTestReminder={handleTriggerTestReminder}
          onToggleMobileMenu={() => setMobileMenuOpen(prev => !prev)}
          pendingCount={pendingCount}
        />

        {/* Dynamic Main Body Content */}
        <main className="app-body-container">
          {activeTab === 'dashboard' && (
            <Dashboard
              medicines={medicines}
              onMarkTaken={handleMarkTaken}
              onSkip={handleSkip}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
              onOpenAddModal={() => {
                setEditingMedicine(null);
                setIsFormModalOpen(true);
              }}
              onTriggerTestReminder={handleTriggerTestReminder}
            />
          )}

          {activeTab === 'schedule' && (
            <div className="schedule-view-page">
              <div className="page-header-row">
                <div>
                  <h2 className="page-main-title">Today's Medicine Schedule</h2>
                  <p className="page-subtitle">Track, filter, and manage your daily medications</p>
                </div>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    setEditingMedicine(null);
                    setIsFormModalOpen(true);
                  }}
                >
                  + Add Medicine
                </button>
              </div>

              {/* Progress Summary */}
              <ProgressTracker medicines={medicines} />

              {/* Medicine Filter List */}
              <MedicineList
                medicines={medicines}
                onMarkTaken={handleMarkTaken}
                onSkip={handleSkip}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
                onOpenAddModal={() => {
                  setEditingMedicine(null);
                  setIsFormModalOpen(true);
                }}
              />
            </div>
          )}

          {activeTab === 'tips' && (
            <div className="health-tips-page">
              <div className="page-header-row">
                <div>
                  <h2 className="page-main-title">Health & Wellness Advisory</h2>
                  <p className="page-subtitle">Best practices and medication safety advice</p>
                </div>
              </div>

              <div className="tips-grid">
                {healthTips.map((tip) => (
                  <div key={tip.id} className="tip-card-detailed">
                    <div className="tip-badge-category">
                      <Sparkles size={15} className="text-amber-500" />
                      <span>{tip.category}</span>
                    </div>
                    <p className="tip-detailed-text">"{tip.tip}"</p>
                    <div className="tip-footer-pill">
                      <ShieldCheck size={14} className="text-teal-600" />
                      <span>Medical Safety Recommendation</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Statistics & Motivation */}
              <div className="mt-8">
                <StatisticsCards medicines={medicines} />
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Add / Edit Medicine Modal */}
      <AddMedicineForm
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingMedicine(null);
        }}
        onSubmit={handleSaveMedicine}
        initialData={editingMedicine}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        medicine={deletingMedicine}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingMedicine(null)}
      />

      {/* Scheduled Reminder Alert Popup */}
      <ReminderNotification
        reminder={activeReminder}
        onDismiss={() => setActiveReminder(null)}
        onMarkTaken={(id) => handleMarkTaken(id)}
      />

      {/* Floating Toast Notification Container */}
      <ToastContainer
        toasts={toasts}
        onClose={removeToast}
      />
    </div>
  );
}
export default App;
