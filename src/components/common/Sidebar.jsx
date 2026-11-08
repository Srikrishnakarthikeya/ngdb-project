import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Calendar,
  Wallet,
  PlusCircle,
  Users,
  ClipboardList,
  Building2,
  MapPin,
  UserCheck,
  Link2,
  BedDouble,
  UtensilsCrossed,
  DollarSign,
  Megaphone,
  Star,
  Award,
  FileText,
  Image,
  BarChart3,
  User,
  LogOut,
  ChevronRight,
  Shield,
  GraduationCap
} from 'lucide-react';

const Sidebar = ({ isMobileOpen, setIsMobileOpen }) => {
  const { currentUser, isStudent, isAdmin, isCoordinator, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItemClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
      isActive
        ? 'bg-nitt-900 text-white shadow-xs font-bold'
        : 'text-slate-600 hover:text-nitt-900 hover:bg-slate-100'
    }`;

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-200 bg-slate-50/70">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-nitt-900 flex items-center justify-center text-amber-400 font-bold text-sm shadow-xs">
              NIT
            </div>
            <div>
              <span className="font-extrabold text-slate-900 text-xs block leading-tight">
                {isStudent ? 'Student Portal' : isAdmin ? 'Admin Console' : 'Coordinator Portal'}
              </span>
              <span className="text-[10px] text-slate-500 font-medium">
                Dept of CA - NIT Trichy
              </span>
            </div>
          </div>
        </div>

        {/* User Card */}
        <div className="p-3.5 border-b border-slate-100 bg-slate-50/30">
          <div className="flex items-center space-x-3">
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
              alt={currentUser?.name}
              className="w-9 h-9 rounded-lg object-cover border border-slate-200"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-900 truncate">
                {currentUser?.name}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded uppercase ${
                  isAdmin ? 'bg-rose-100 text-rose-700' : isCoordinator ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-700'
                }`}>
                  {currentUser?.role}
                </span>
                {currentUser?.id && (
                  <span className="text-[10px] text-slate-400 font-mono truncate">
                    {currentUser.id}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {/* STUDENT MENU */}
          {isStudent && (
            <div className="space-y-1">
              <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Participant Workspace
              </span>
              <NavLink to="/student/dashboard" className={navItemClass}>
                <LayoutDashboard className="w-4 h-4 text-blue-600" />
                <span>Dashboard</span>
              </NavLink>
              <NavLink to="/student/events" className={navItemClass}>
                <Calendar className="w-4 h-4 text-indigo-600" />
                <span>Browse Events</span>
              </NavLink>
              <NavLink to="/student/registrations" className={navItemClass}>
                <ClipboardList className="w-4 h-4 text-emerald-600" />
                <span>My Registrations</span>
              </NavLink>
              <NavLink to="/student/wallet" className={navItemClass}>
                <Wallet className="w-4 h-4 text-amber-600" />
                <span>My Wallet</span>
              </NavLink>
              <NavLink to="/student/profile" className={navItemClass}>
                <User className="w-4 h-4 text-slate-600" />
                <span>My Profile</span>
              </NavLink>

              <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 block pt-4 mb-2">
                Services & Logistics
              </span>
              <NavLink to="/student/accommodation" className={navItemClass}>
                <BedDouble className="w-4 h-4 text-amber-600" />
                <span>Accommodation</span>
              </NavLink>
              <NavLink to="/student/hospitality" className={navItemClass}>
                <UtensilsCrossed className="w-4 h-4 text-orange-600" />
                <span>Hospitality & Meals</span>
              </NavLink>

              <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 block pt-4 mb-2">
                Outcomes & Feedback
              </span>
              <NavLink to="/student/certificates" className={navItemClass}>
                <Award className="w-4 h-4 text-purple-600" />
                <span>My Certificates</span>
              </NavLink>
              <NavLink to="/student/feedback" className={navItemClass}>
                <Star className="w-4 h-4 text-amber-500" />
                <span>Submit Evaluation</span>
              </NavLink>
              <NavLink to="/student/gallery" className={navItemClass}>
                <Image className="w-4 h-4 text-cyan-600" />
                <span>Event Gallery</span>
              </NavLink>
            </div>
          )}

          {/* ADMIN MENU */}
          {(isAdmin || isCoordinator) && (
            <div className="space-y-4">
              {/* Core Analytics */}
              <div className="space-y-1">
                <NavLink to="/admin/dashboard" className={navItemClass}>
                  <LayoutDashboard className="w-4 h-4 text-blue-600" />
                  <span>Dashboard Overview</span>
                </NavLink>
                <NavLink to="/admin/analytics" className={navItemClass}>
                  <BarChart3 className="w-4 h-4 text-emerald-600" />
                  <span>Analytics & Charts</span>
                </NavLink>
              </div>

              {/* Event Management */}
              <div className="space-y-1">
                <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Event Management
                </span>
                <NavLink to="/admin/events" className={navItemClass}>
                  <Calendar className="w-4 h-4 text-indigo-600" />
                  <span>All Events</span>
                </NavLink>
                {isAdmin && (
                  <NavLink to="/admin/events/new" className={navItemClass}>
                    <PlusCircle className="w-4 h-4 text-blue-600" />
                    <span>Create Event</span>
                  </NavLink>
                )}
              </div>

              {/* Participants */}
              <div className="space-y-1">
                <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Participants & Registrations
                </span>
                <NavLink to="/admin/participants" className={navItemClass}>
                  <Users className="w-4 h-4 text-cyan-600" />
                  <span>Participants</span>
                </NavLink>
                <NavLink to="/admin/registrations" className={navItemClass}>
                  <ClipboardList className="w-4 h-4 text-emerald-600" />
                  <span>Registrations</span>
                </NavLink>
              </div>

              {/* Venue & Staff */}
              <div className="space-y-1">
                <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Venue & Staff
                </span>
                {isAdmin && (
                  <>
                    <NavLink to="/admin/departments" className={navItemClass}>
                      <Building2 className="w-4 h-4 text-amber-600" />
                      <span>Departments</span>
                    </NavLink>
                    <NavLink to="/admin/venues" className={navItemClass}>
                      <MapPin className="w-4 h-4 text-rose-600" />
                      <span>Venues</span>
                    </NavLink>
                    <NavLink to="/admin/coordinators" className={navItemClass}>
                      <UserCheck className="w-4 h-4 text-teal-600" />
                      <span>Coordinators</span>
                    </NavLink>
                  </>
                )}
                <NavLink to="/admin/event-coordinators" className={navItemClass}>
                  <Link2 className="w-4 h-4 text-indigo-600" />
                  <span>Event Coordinators</span>
                </NavLink>
              </div>

              {/* Event Services */}
              <div className="space-y-1">
                <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Services & Logistics
                </span>
                <NavLink to="/admin/accommodation" className={navItemClass}>
                  <BedDouble className="w-4 h-4 text-amber-600" />
                  <span>Accommodation</span>
                </NavLink>
                <NavLink to="/admin/hospitality" className={navItemClass}>
                  <UtensilsCrossed className="w-4 h-4 text-orange-600" />
                  <span>Hospitality</span>
                </NavLink>
                <NavLink to="/admin/sponsors" className={navItemClass}>
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                  <span>Sponsors</span>
                </NavLink>
                <NavLink to="/admin/publicity" className={navItemClass}>
                  <Megaphone className="w-4 h-4 text-purple-600" />
                  <span>Publicity & Reach</span>
                </NavLink>
              </div>

              {/* Quality & Outcomes */}
              <div className="space-y-1">
                <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Quality & Outcomes
                </span>
                <NavLink to="/admin/evaluations" className={navItemClass}>
                  <Star className="w-4 h-4 text-amber-500" />
                  <span>Evaluations & Feedback</span>
                </NavLink>
                <NavLink to="/admin/certificates" className={navItemClass}>
                  <Award className="w-4 h-4 text-purple-600" />
                  <span>Certificates</span>
                </NavLink>
                <NavLink to="/admin/reports" className={navItemClass}>
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>Completion Reports</span>
                </NavLink>
                <NavLink to="/admin/gallery" className={navItemClass}>
                  <Image className="w-4 h-4 text-cyan-600" />
                  <span>Photo Gallery</span>
                </NavLink>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Signout & Return */}
        <div className="p-3 border-t border-slate-200 bg-slate-50/70">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
