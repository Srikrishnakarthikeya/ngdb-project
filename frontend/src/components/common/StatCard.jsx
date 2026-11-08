import React from 'react';

const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendPositive = true,
  colorScheme = 'blue',
  onClick
}) => {
  const colorMap = {
    blue: {
      bg: 'bg-blue-50 text-blue-700',
      border: 'hover:border-blue-300',
      badge: 'text-blue-700'
    },
    emerald: {
      bg: 'bg-emerald-50 text-emerald-700',
      border: 'hover:border-emerald-300',
      badge: 'text-emerald-700'
    },
    amber: {
      bg: 'bg-amber-50 text-amber-700',
      border: 'hover:border-amber-300',
      badge: 'text-amber-700'
    },
    indigo: {
      bg: 'bg-indigo-50 text-indigo-700',
      border: 'hover:border-indigo-300',
      badge: 'text-indigo-700'
    },
    rose: {
      bg: 'bg-rose-50 text-rose-700',
      border: 'hover:border-rose-300',
      badge: 'text-rose-700'
    },
    navy: {
      bg: 'bg-slate-100 text-nitt-900',
      border: 'hover:border-slate-400',
      badge: 'text-nitt-900'
    }
  };

  const currentScheme = colorMap[colorScheme] || colorMap.blue;

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border border-slate-200 p-5 shadow-sm transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:shadow-md' : ''
      } ${currentScheme.border}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
          {title}
        </span>
        {Icon && (
          <div className={`p-2.5 rounded-lg ${currentScheme.bg}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline justify-between">
        <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
          {value}
        </div>
        {trend && (
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              trendPositive
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-rose-50 text-rose-700'
            }`}
          >
            {trend}
          </span>
        )}
      </div>

      {subtitle && (
        <div className="mt-2 text-xs text-slate-500 flex items-center gap-1.5">
          {subtitle}
        </div>
      )}
    </div>
  );
};

export default StatCard;
