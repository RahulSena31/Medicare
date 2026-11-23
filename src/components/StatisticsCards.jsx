import React from 'react';
import { Pill, CheckCircle2, Clock, XCircle, Activity } from './Icons';

export const StatisticsCards = ({ medicines }) => {
  const total = medicines.length;
  const taken = medicines.filter(m => m.status === 'taken').length;
  const pending = medicines.filter(m => m.status === 'pending').length;
  const skipped = medicines.filter(m => m.status === 'skipped').length;

  const takenPercent = total > 0 ? Math.round((taken / total) * 100) : 0;

  const cards = [
    {
      id: 'total',
      title: 'Total Scheduled',
      value: total,
      subtext: `${total === 1 ? '1 medicine' : `${total} medicines`} active`,
      icon: <Pill size={22} />,
      colorClass: 'stat-card-blue',
      iconBg: 'bg-blue-100 text-blue-600',
      badge: 'Full Regimen'
    },
    {
      id: 'taken',
      title: 'Medicines Taken',
      value: taken,
      subtext: `${takenPercent}% daily completion`,
      icon: <CheckCircle2 size={22} />,
      colorClass: 'stat-card-green',
      iconBg: 'bg-emerald-100 text-emerald-600',
      badge: `${takenPercent}%`
    },
    {
      id: 'pending',
      title: 'Pending Doses',
      value: pending,
      subtext: pending === 0 ? 'All doses cleared!' : 'Awaiting schedule',
      icon: <Clock size={22} />,
      colorClass: 'stat-card-amber',
      iconBg: 'bg-amber-100 text-amber-600',
      badge: pending > 0 ? 'Action Due' : 'All Clear'
    },
    {
      id: 'skipped',
      title: 'Skipped Doses',
      value: skipped,
      subtext: skipped === 0 ? 'No doses missed' : 'Needs attention',
      icon: <XCircle size={22} />,
      colorClass: 'stat-card-rose',
      iconBg: 'bg-rose-100 text-rose-600',
      badge: skipped > 0 ? 'Skipped' : 'Zero'
    }
  ];

  return (
    <div className="stats-grid">
      {cards.map((card) => (
        <div key={card.id} className={`stat-card ${card.colorClass}`}>
          <div className="stat-card-top">
            <div className={`stat-icon-wrapper ${card.iconBg}`}>
              {card.icon}
            </div>
            <span className="stat-badge">{card.badge}</span>
          </div>
          <div className="stat-card-body">
            <h4 className="stat-card-title">{card.title}</h4>
            <div className="stat-card-value">{card.value}</div>
            <p className="stat-card-subtext">{card.subtext}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
