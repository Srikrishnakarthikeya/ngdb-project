import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import {
  Calendar,
  Layers,
  Bell,
  User,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Sparkles
} from 'lucide-react';

const Navbar = () => {
  const { currentUser, isAuthenticated, isStudent, isAdmin, isCoordinator, isVolunteer, switchRole, logout } = useAuth();
  const { notifications } = useData();
  const navigate = useNavigate();

  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const relevantNotifs = notifications.filter((n) =>
    currentUser ? (currentUser.role === 'STUDENT' ? n.recipient === 'student' : n.recipient === 'admin') : false
  );

  const handleRoleSwitch = (newRole) => {
    setIsRoleDropdownOpen(false);
    if (newRole === 'STUDENT') {
      switchRole(newRole);
      navigate('/student/dashboard');
    } else if (newRole === 'ADMIN' || newRole === 'COORDINATOR') {
      logout();
      navigate(`/admin-login?role=${newRole}`);
    } else {
      switchRole('GUEST');
      navigate('/');
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        {/* Main Navbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo & Name */}
            <Link to="/" className="flex items-center group" aria-label="NIT Trichy Events home">
              <img src="/images/nitt-logo.png" alt="National Institute of Technology Tiruchirappalli" className="h-12 w-12 object-contain" />
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-6 text-sm font-semibold text-slate-600">
              <Link to="/" className="hover:text-nitt-900 transition-colors">
                Home
              </Link>
              <Link to="/events" className="hover:text-nitt-900 transition-colors">
                Browse Events
              </Link>
              <Link to="/gallery" className="hover:text-nitt-900 transition-colors">
                Photo Gallery
              </Link>
              <Link to="/about" className="hover:text-nitt-900 transition-colors">
                About Dept
              </Link>
              <Link to="/contact" className="hover:text-nitt-900 transition-colors">
                Contact
              </Link>
            </nav>

            {/* Right Action Icons & Auth Controls */}
            <div className="flex items-center space-x-3">
              {/* If Authenticated: Notification Bell & Role Badge */}
              {isAuthenticated ? (
                <>
                  {/* Notifications */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsNotifOpen(!isNotifOpen)}
                      className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 relative transition-colors cursor-pointer"
                    >
                      <Bell className="w-5 h-5" />
                      {relevantNotifs.length > 0 && (
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white animate-pulse" />
                      )}
                    </button>

                    {/* Notification Dropdown */}
                    {isNotifOpen && (
                      <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-fade-in">
                        <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900">Notifications</span>
                          <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-bold">
                            {relevantNotifs.length} new
                          </span>
                        </div>
                        <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 text-xs">
                          {relevantNotifs.length === 0 ? (
                            <div className="p-4 text-center text-slate-400">No new notifications</div>
                          ) : (
                            relevantNotifs.map((n) => (
                              <div key={n.id} className="p-3 hover:bg-slate-50 transition-colors">
                                <p className="font-semibold text-slate-800">{n.title}</p>
                                <p className="text-slate-500 mt-0.5 leading-snug">{n.message}</p>
                                <span className="text-[10px] text-slate-400 mt-1 block">{n.time}</span>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Role Switcher & User Menu */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                      className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all cursor-pointer"
                    >
                      {/* <img
                        src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                        alt={currentUser.name}
                        className="w-7 h-7 rounded-lg object-cover border border-slate-300"
                      /> */}
                      <div className="text-left hidden sm:block">
                        <span className="text-xs font-bold text-slate-900 block leading-tight">
                          {currentUser.name.split(' ')[0]}
                        </span>
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${
                          isAdmin ? 'text-rose-600' : isCoordinator ? 'text-amber-600' : 'text-blue-600'
                        }`}>
                          {currentUser.role}
                        </span>
                      </div>
                      <ChevronDown className="w-4 h-4 text-slate-400 ml-1" />
                    </button>

                    {/* Role Switcher Menu */}
                    {isRoleDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
                        <div className="px-4 py-2 border-b border-slate-100">
                          <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                          <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                        </div>

                        {/* Quick Dashboard link */}
                        <div className="py-1">
                          <Link
                            to={isStudent ? '/student/dashboard' : isCoordinator ? '/admin/coordinator-dashboard' : isVolunteer ? '/volunteer/dashboard' : '/admin/dashboard'}
                            onClick={() => setIsRoleDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-nitt-900 hover:bg-slate-50"
                          >
                            <Calendar className="w-4 h-4 text-blue-600" />
                            <span>Go to Dashboard</span>
                          </Link>
                        </div>

                        {/* Quick Role Switcher for Viva Demo */}
                        <div className="border-t border-slate-100 pt-2 pb-1">
                          <span className="px-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                            Demo Role Switcher (Viva)
                          </span>
                          <button
                            onClick={() => handleRoleSwitch('STUDENT')}
                            className={`w-full text-left px-4 py-1.5 text-xs flex items-center justify-between hover:bg-slate-50 ${
                              isStudent ? 'text-blue-700 font-bold bg-blue-50/50' : 'text-slate-600'
                            }`}
                          >
                            <span>Student</span>
                            {isStudent && <span className="text-[10px] bg-blue-600 text-white px-1.5 rounded">Active</span>}
                          </button>
                          <button
                            onClick={() => handleRoleSwitch('ADMIN')}
                            className={`w-full text-left px-4 py-1.5 text-xs flex items-center justify-between hover:bg-slate-50 ${
                              isAdmin ? 'text-rose-700 font-bold bg-rose-50/50' : 'text-slate-600'
                            }`}
                          >
                            <span>Admin</span>
                            {isAdmin && <span className="text-[10px] bg-rose-600 text-white px-1.5 rounded">Active</span>}
                          </button>
                          <button
                            onClick={() => handleRoleSwitch('COORDINATOR')}
                            className={`w-full text-left px-4 py-1.5 text-xs flex items-center justify-between hover:bg-slate-50 ${
                              isCoordinator ? 'text-amber-700 font-bold bg-amber-50/50' : 'text-slate-600'
                            }`}
                          >
                            <span>Coordinator</span>
                            {isCoordinator && <span className="text-[10px] bg-amber-600 text-white px-1.5 rounded">Active</span>}
                          </button>
                        </div>

                        <div className="border-t border-slate-100 pt-1">
                          <button
                            onClick={() => {
                              logout();
                              setIsRoleDropdownOpen(false);
                              navigate('/');
                            }}
                            className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium"
                          >
                            <LogOut className="w-3.5 h-3.5" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                /* Not Logged In - Login Buttons */
                <div className="flex items-center space-x-2">
                  <Link
                    to="/student-login"
                    className="px-3.5 py-1.5 text-xs font-bold text-nitt-900 hover:bg-slate-100 rounded-lg transition-colors border border-slate-300"
                  >
                    Student Login
                  </Link>
                  <Link
                    to="/volunteer-login"
                    className="px-3.5 py-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-50 rounded-lg border border-emerald-200 transition-colors"
                  >
                    Volunteer
                  </Link>
                  <Link
                    to="/admin-login"
                    className="px-3.5 py-1.5 text-xs font-bold text-white bg-nitt-900 hover:bg-nitt-800 rounded-lg shadow-sm transition-colors"
                  >
                    Admin Login
                  </Link>
                </div>
              )}

              {/* Mobile Menu Hamburger */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-3">
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-sm font-semibold text-slate-700 py-1"
            >
              Home
            </Link>
            <Link
              to="/events"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-sm font-semibold text-slate-700 py-1"
            >
              Browse Events
            </Link>
            <Link
              to="/gallery"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-sm font-semibold text-slate-700 py-1"
            >
              Photo Gallery
            </Link>
            <Link
              to="/about"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-sm font-semibold text-slate-700 py-1"
            >
              About Department
            </Link>
            <Link
              to="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-sm font-semibold text-slate-700 py-1"
            >
              Contact
            </Link>

          </div>
        )}
      </header>

    </>
  );
};

export default Navbar;
