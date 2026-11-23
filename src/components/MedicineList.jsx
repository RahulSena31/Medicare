import React, { useState } from 'react';
import { MedicineCard } from './MedicineCard';
import { Search, Filter, Pill, Plus, X } from './Icons';

export const MedicineList = ({ 
  medicines, 
  onMarkTaken, 
  onSkip, 
  onEdit, 
  onDelete, 
  onOpenAddModal 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'pending' | 'taken' | 'skipped'

  // Filter calculations
  const totalCount = medicines.length;
  const takenCount = medicines.filter(m => m.status === 'taken').length;
  const pendingCount = medicines.filter(m => m.status === 'pending').length;
  const skippedCount = medicines.filter(m => m.status === 'skipped').length;

  const filteredMedicines = medicines.filter((medicine) => {
    // Search match
    const matchesSearch = medicine.name.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
      medicine.type.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
      medicine.notes.toLowerCase().includes(searchTerm.toLowerCase().trim());

    // Status filter match
    const matchesStatus = statusFilter === 'all' || medicine.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Sort: pending first, then by scheduled time
  const sortedMedicines = [...filteredMedicines].sort((a, b) => {
    if (a.status === 'pending' && b.status !== 'pending') return -1;
    if (a.status !== 'pending' && b.status === 'pending') return 1;
    return a.time.localeCompare(b.time);
  });

  return (
    <div className="medicine-list-section">
      {/* Search and Filters Control Bar */}
      <div className="list-controls-bar">
        {/* Search Input */}
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search medicine by name or notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => setSearchTerm('')}
              aria-label="Clear search"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="filter-pills-group">
          <button
            type="button"
            className={`filter-pill ${statusFilter === 'all' ? 'filter-pill-active' : ''}`}
            onClick={() => setStatusFilter('all')}
          >
            <span>All</span>
            <span className="pill-count">{totalCount}</span>
          </button>

          <button
            type="button"
            className={`filter-pill filter-pill-pending ${statusFilter === 'pending' ? 'filter-pill-active' : ''}`}
            onClick={() => setStatusFilter('pending')}
          >
            <span>Pending</span>
            <span className="pill-count">{pendingCount}</span>
          </button>

          <button
            type="button"
            className={`filter-pill filter-pill-taken ${statusFilter === 'taken' ? 'filter-pill-active' : ''}`}
            onClick={() => setStatusFilter('taken')}
          >
            <span>Taken</span>
            <span className="pill-count">{takenCount}</span>
          </button>

          <button
            type="button"
            className={`filter-pill filter-pill-skipped ${statusFilter === 'skipped' ? 'filter-pill-active' : ''}`}
            onClick={() => setStatusFilter('skipped')}
          >
            <span>Skipped</span>
            <span className="pill-count">{skippedCount}</span>
          </button>
        </div>
      </div>

      {/* Results Header */}
      <div className="results-meta-row">
        <span className="results-count">
          Showing <strong>{sortedMedicines.length}</strong> of {totalCount} medications
          {statusFilter !== 'all' && ` (Filtered by: ${statusFilter})`}
          {searchTerm && ` (Matching "${searchTerm}")`}
        </span>

        {(searchTerm || statusFilter !== 'all') && (
          <button
            type="button"
            className="reset-filters-btn"
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
            }}
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Grid of Cards or Empty State */}
      {sortedMedicines.length > 0 ? (
        <div className="medicine-cards-grid">
          {sortedMedicines.map((medicine) => (
            <MedicineCard
              key={medicine.id}
              medicine={medicine}
              onMarkTaken={onMarkTaken}
              onSkip={onSkip}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state-card">
          <div className="empty-icon-circle">
            <Pill size={36} className="text-sky-500" />
          </div>
          <h3 className="empty-title">No Medications Found</h3>
          <p className="empty-description">
            {searchTerm || statusFilter !== 'all'
              ? 'No medicines match your current search query or active filter. Try resetting filters.'
              : 'Your medicine schedule is currently empty. Add your first medicine to get started with smart reminders!'}
          </p>
          <div className="empty-actions">
            {searchTerm || statusFilter !== 'all' ? (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                }}
              >
                Clear Search & Filters
              </button>
            ) : null}

            <button
              type="button"
              className="btn btn-primary"
              onClick={onOpenAddModal}
            >
              <Plus size={16} /> Add Medicine
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
