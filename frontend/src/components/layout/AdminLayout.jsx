import React, { useState } from 'react';
import { Outlet, Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../common/Sidebar';
import { Menu, ArrowLeft } from 'lucide-react';

const AdminLayout = () => {
  const { currentUser, isAdmin, isCoordinator, logout } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  if (!currentUser || (!isAdmin && !isCoordinator)) {
    return <Navigate to="/admin-login" replace state={{ from: location }} />;
  }

  if (isCoordinator && !['/admin/coordinator-dashboard', '/admin/change-password'].includes(location.pathname)) {
    return <Navigate to="/admin/coordinator-dashboard" replace />;
  }

  const requestRoleLogin = (role) => {
    logout();
    navigate(`/admin-login?role=${role}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-xs border-b border-slate-200 h-16 flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm sm:text-base text-nitt-950">
                Department of Computer Applications
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[11px] font-extrabold uppercase tracking-wider ${
                  isAdmin
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {isAdmin ? 'Admin Console' : 'Coordinator Portal'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-semibold">
              <button
                onClick={() => requestRoleLogin('ADMIN')}
                className={`px-2.5 py-1 rounded-md transition-all ${isAdmin ? 'bg-white text-rose-700 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-800'}`}
              >
                Admin Mode
              </button>
              <button
                onClick={() => requestRoleLogin('COORDINATOR')}
                className={`px-2.5 py-1 rounded-md transition-all ${isCoordinator ? 'bg-white text-amber-700 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-800'}`}
              >
                Coordinator Mode
              </button>
            </div>
            <Link
              to="/"
              className="text-xs font-semibold text-slate-600 hover:text-nitt-900 flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Public Portal</span>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

    </div>
  );
};

export default AdminLayout;
