import React from 'react';

const Badge = ({ status, variant, children, className = '' }) => {
  const value = children || status;

  // Determine variant automatically from status if variant not explicitly provided
  let styleVariant = variant;
  if (!styleVariant && typeof value === 'string') {
    const s = value.toLowerCase();
    if (s.includes('upcoming') || s.includes('workshop') || s.includes('individual')) {
      styleVariant = 'info';
    } else if (s.includes('active') || s.includes('confirmed') || s.includes('approved') || s.includes('completed') || s.includes('checked in')) {
      styleVariant = 'success';
    } else if (s.includes('pending') || s.includes('symposium')) {
      styleVariant = 'warning';
    } else if (s.includes('rejected') || s.includes('cancelled') || s.includes('failed')) {
      styleVariant = 'danger';
    } else if (s.includes('exempted') || s.includes('seminar') || s.includes('conference')) {
      styleVariant = 'purple';
    } else {
      styleVariant = 'neutral';
    }
  }

  const styles = {
    info: 'bg-blue-50 text-blue-700 border-blue-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
    purple: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
    dark: 'bg-slate-800 text-white border-slate-700'
  }[styleVariant || 'neutral'];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-80" />
      {value}
    </span>
  );
};

export default Badge;
