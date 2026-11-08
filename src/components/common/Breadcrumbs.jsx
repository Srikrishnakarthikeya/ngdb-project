import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumbs = ({ items = [] }) => {
  const location = useLocation();

  // If items not provided, generate from current path
  const pathSegments = location.pathname.split('/').filter(Boolean);

  const formattedItems = items.length > 0 ? items : pathSegments.map((segment, index) => {
    const to = `/${pathSegments.slice(0, index + 1).join('/')}`;
    const label = segment
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
    return { label, to: index === pathSegments.length - 1 ? null : to };
  });

  return (
    <nav className="flex items-center text-xs text-slate-500 mb-4 overflow-x-auto whitespace-nowrap">
      <Link to="/" className="flex items-center hover:text-nitt-700 transition-colors">
        <Home className="w-3.5 h-3.5 mr-1" />
        <span>Home</span>
      </Link>
      {formattedItems.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="w-3.5 h-3.5 mx-1.5 text-slate-400 flex-shrink-0" />
          {item.to ? (
            <Link to={item.to} className="hover:text-nitt-700 transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="font-semibold text-slate-800">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumbs;
