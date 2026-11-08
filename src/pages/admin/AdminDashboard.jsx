import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import {
  Calendar,
  Users,
  ClipboardList,
  Building2,
  MapPin,
  UserCheck,
  BedDouble,
  DollarSign,
  Award,
  BarChart3,
  Clock,
  PlusCircle,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

const AdminDashboard = () => {
  const { currentUser, isAdmin, isCoordinator } = useAuth();
  const {
    events,
    participants,
    registrations,
    accommodations,
    certificates,
    sponsors,
    departments,
    venues,
    coordinators,
    getEvent,
    getParticipant
  } = useData();

  // Metrics
  const totalEvents = events.length;
  const upcomingEvents = events.filter((e) => e.Status === 'Upcoming').length;
  const totalParticipants = participants.length;
  const totalRegistrations = registrations.length;
  const pendingRegistrations = registrations.filter((r) => r.Payment_Status === 'Pending' || r.Status === 'Pending').length;
  const accommodationRequests = accommodations.length;
  const pendingAccommodations = accommodations.filter((a) => a.Status === 'Pending').length;
  const certificatesIssued = certificates.length;
  const totalSponsorship = sponsors.reduce((acc, curr) => acc + (Number(curr.Amount_Contributed) || 0), 0);

  const recentRegistrations = registrations.slice(0, 5);
  const pendingAccList = accommodations.filter((a) => a.Status === 'Pending').slice(0, 4);

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-nitt-950 via-nitt-900 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/30">
              {isAdmin ? 'ADMINISTRATOR PRIVILEGES' : 'COORDINATOR PORTAL'}
            </span>
            <span className="text-slate-400 text-xs font-mono">&bull; CA Department</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Institutional Event Control Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Welcome, {currentUser?.name || 'Admin'} ({currentUser?.designation || 'Head of Department'})
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {isAdmin && (
            <Link
              to="/admin/events/new"
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Event</span>
            </Link>
          )}
          <Link
            to="/admin/analytics"
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
          >
            <BarChart3 className="w-4 h-4 text-emerald-400" />
            <span>Full Analytics</span>
          </Link>
        </div>
      </div>

      {/* 8 Primary Dashboard KPI Cards as requested in Section 18 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Events"
          value={totalEvents}
          subtitle="Across all departments"
          icon={Calendar}
          colorScheme="blue"
        />
        <StatCard
          title="Upcoming Events"
          value={upcomingEvents}
          subtitle="Scheduled on campus"
          icon={Clock}
          colorScheme="emerald"
        />
        <StatCard
          title="Total Participants"
          value={totalParticipants}
          subtitle="Internal & outstation delegates"
          icon={Users}
          colorScheme="indigo"
        />
        <StatCard
          title="Total Registrations"
          value={totalRegistrations}
          subtitle={`${pendingRegistrations} pending approval`}
          icon={ClipboardList}
          colorScheme="navy"
        />
        <StatCard
          title="Pending Registrations"
          value={pendingRegistrations}
          subtitle="Requires fee verification"
          icon={Clock}
          colorScheme="amber"
        />
        <StatCard
          title="Accommodation Requests"
          value={accommodationRequests}
          subtitle={`${pendingAccommodations} pending room allocation`}
          icon={BedDouble}
          colorScheme="rose"
        />
        <StatCard
          title="Certificates Issued"
          value={certificatesIssued}
          subtitle="Digitally signed credentials"
          icon={Award}
          colorScheme="purple"
        />
        <StatCard
          title="Total Sponsorship"
          value={`Rs. ${(totalSponsorship / 100000).toFixed(2)}L`}
          subtitle="Corporate contributions"
          icon={DollarSign}
          colorScheme="emerald"
        />
      </div>

      {/* Main Grid: Recent Registrations & Pending Accommodation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 8 Cols: Recent Registrations */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-nitt-950 flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-blue-600" />
                <span>Recent Registrations (REGISTRATION)</span>
              </h2>
              <p className="text-xs text-slate-500">Latest participant enrollments awaiting coordinator review</p>
            </div>
            <Link
              to="/admin/registrations"
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-xs">
              <thead className="bg-slate-50 font-bold uppercase tracking-wider text-slate-600 text-[10px]">
                <tr>
                  <th className="px-3 py-2.5 text-left">Reg ID</th>
                  <th className="px-3 py-2.5 text-left">Participant</th>
                  <th className="px-3 py-2.5 text-left">Event</th>
                  <th className="px-3 py-2.5 text-left">Fee Status</th>
                  <th className="px-3 py-2.5 text-left">Date</th>
                  <th className="px-3 py-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {recentRegistrations.map((reg) => {
                  const part = getParticipant(reg.Participant_ID);
                  const evt = getEvent(reg.Event_ID);

                  return (
                    <tr key={reg.Registration_ID} className="hover:bg-slate-50">
                      <td className="px-3 py-3 font-mono font-bold text-blue-700">
                        {reg.Registration_ID}
                      </td>
                      <td className="px-3 py-3">
                        <span className="font-bold text-slate-900 block">{part?.Name || reg.Participant_ID}</span>
                        <span className="text-[10px] text-slate-400">{part?.Institution_Name?.split(',')[0]}</span>
                      </td>
                      <td className="px-3 py-3 text-slate-700 max-w-[150px] truncate">
                        {evt?.Event_Name}
                      </td>
                      <td className="px-3 py-3">
                        <Badge status={reg.Payment_Status} />
                      </td>
                      <td className="px-3 py-3 text-slate-500 whitespace-nowrap">
                        {reg.Registration_Date}
                      </td>
                      <td className="px-3 py-3 text-right">
                        <Link
                          to="/admin/registrations"
                          className="text-xs text-blue-600 hover:underline font-bold"
                        >
                          Review
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 4 Cols: Pending Hostel Accommodation */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-nitt-950 flex items-center gap-2">
                <BedDouble className="w-5 h-5 text-amber-600" />
                <span>Accommodation Queue</span>
              </h2>
              <p className="text-xs text-slate-500">Pending room allocations</p>
            </div>
            <Link
              to="/admin/accommodation"
              className="text-xs font-bold text-blue-600 hover:text-blue-700"
            >
              Manage
            </Link>
          </div>

          <div className="space-y-3">
            {pendingAccList.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6">
                All accommodation requests have been processed.
              </p>
            ) : (
              pendingAccList.map((acc) => {
                const part = getParticipant(acc.Participant_ID);

                return (
                  <div
                    key={acc.Accommodation_ID}
                    className="p-3 rounded-lg border border-slate-200 bg-slate-50/70 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{part?.Name || acc.Participant_ID}</span>
                      <Badge status={acc.Status} />
                    </div>
                    <p className="text-[11px] text-slate-500">{acc.Hostel_Block}</p>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-200">
                      <span>Check-in: {acc.Check_in_Date}</span>
                      <Link
                        to="/admin/accommodation"
                        className="text-amber-700 font-bold hover:underline"
                      >
                        Assign Room &rarr;
                      </Link>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;
