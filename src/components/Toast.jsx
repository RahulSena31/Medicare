import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from './Icons';

export const Toast = ({ toast, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onClose]);

  const typeConfig = {
    success: {
      bg: 'bg-emerald-50 border-emerald-200 text-emerald-800',
      icon: <CheckCircle2 size={18} className="text-emerald-600" />,
      title: 'Success'
    },
    warning: {
      bg: 'bg-amber-50 border-amber-200 text-amber-800',
      icon: <AlertCircle size={18} className="text-amber-600" />,
      title: 'Attention'
    },
    info: {
      bg: 'bg-sky-50 border-sky-200 text-sky-800',
      icon: <Info size={18} className="text-sky-600" />,
      title: 'Update'
    }
  };

  const config = typeConfig[toast.type] || typeConfig.info;

  return (
    <div className={`toast-item ${config.bg} animate-slide-in`}>
      <div className="toast-icon">{config.icon}</div>
      <div className="toast-content">
        <span className="toast-message">{toast.message}</span>
      </div>
      <button 
        type="button" 
        onClick={() => onClose(toast.id)} 
        className="toast-close-btn"
        aria-label="Close notification"
      >
        <X size={15} />
      </button>
    </div>
  );
};

export const ToastContainer = ({ toasts, onClose }) => {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} onClose={onClose} />
      ))}
    </div>
  );
};
