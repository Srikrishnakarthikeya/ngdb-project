import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import {
  Calendar,
  ClipboardList,
  Award,
  Clock,
  ArrowRight,
  MapPin,
  BedDouble,
  UtensilsCrossed,
  Star,
  CheckCircle2,
  ExternalLink,
  Wallet
} from 'lucide-react';

const StudentDashboard = () => {
  const { currentUser } = useAuth();
  const {
    events,
    registrations,
    certificates,
    accommodations,
    hospitality,
    getEvent,
    getVenue,
    getWalletBalance
  } = useData();

  const studentId = currentUser?.id || 'PART-001';

  // Filter student-specific records
  const myRegistrations = registrations.filter((r) => r.Participant_ID === studentId);
  const myCertificates = certificates.filter((c) => c.Participant_ID === studentId);
  const myAccommodations = accommodations.filter((a) => a.Participant_ID === studentId);
  const myHospitality = hospitality.filter((h) => h.Participant_ID === studentId);

  const pendingRequests = myAccommodations.filter((a) => a.Status === 'Pending').length +
    myRegistrations.filter((r) => r.Payment_Status === 'Pending').length;


  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-nitt-950 via-nitt-900 to-nitt-800 rounded-2xl p-6 sm:p-8 text-white shadow-lg border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 text-[11px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Active Student Portal Session</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome, {currentUser?.name || 'Prasad'}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/student/events"
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            <span>Browse Events</span>
          </Link>
          <Link
            to="/student/certificates"
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span>My Certificates</span>
          </Link>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Wallet Balance"
          value={`Rs. ${getWalletBalance(studentId).toLocaleString('en-IN')}`}
          subtitle="Available for event entry"
          icon={Wallet}
          colorScheme="amber"
        />
        <StatCard
          title="Registered Events"
          value={myRegistrations.length}
          subtitle="Confirmed in database"
          icon={ClipboardList}
          colorScheme="blue"
        />
        <StatCard
          title="Upcoming Events"
          value={events.filter((e) => e.Status === 'Upcoming').length}
          subtitle="Open for enrollment"
          icon={Calendar}
          colorScheme="emerald"
        />
        <StatCard
          title="Issued Certificates"
          value={myCertificates.length}
          subtitle="Verified digital credentials"
          icon={Award}
          colorScheme="indigo"
        />
        <StatCard
          title="Pending Requests"
          value={pendingRequests}
          subtitle="Accommodation & verification"
          icon={Clock}
          colorScheme="amber"
        />
      </div>

      {/* Registered Events and student services */}
      <div className="space-y-6">
          {/* Section: My Registered Events */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-nitt-950 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <span>My Registered Events</span>
              </h2>
              <Link
                to="/student/registrations"
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <span>View All ({myRegistrations.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {myRegistrations.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500">
                  You have not registered for any events yet.
                </div>
              ) : (
                myRegistrations.map((reg) => {
                  const evt = getEvent(reg.Event_ID);
                  const venue = evt ? getVenue(evt.Venue_ID) : null;

                  return (
                    <div
                      key={reg.Registration_ID}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-blue-700">
                            {reg.Registration_ID}
                          </span>
                          <Badge status={reg.Status} />
                          <span className="text-[10px] text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                            {reg.Registration_Type}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-nitt-950">
                          {evt?.Event_Name || reg.Event_ID}
                        </h4>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {evt?.Start_Date}
                          </span>
                          <span>&bull;</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-rose-500" />
                            {venue?.Venue_Name || 'Campus Venue'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-center">
                        <Link
                          to={`/student/events/${reg.Event_ID}`}
                          className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-white transition-colors"
                        >
                          View Event
                        </Link>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Quick Services Links Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              to="/student/accommodation"
              className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 hover:border-amber-300 transition-all flex items-center gap-3"
            >
              <div className="p-2.5 rounded-lg bg-amber-100 text-amber-800">
                <BedDouble className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-amber-950">Accommodation</h4>
                <p className="text-[11px] text-amber-700">
                  {myAccommodations.length} room booking(s)
                </p>
              </div>
            </Link>

            <Link
              to="/student/hospitality"
              className="p-4 rounded-xl bg-orange-50/60 border border-orange-200 hover:border-orange-300 transition-all flex items-center gap-3"
            >
              <div className="p-2.5 rounded-lg bg-orange-100 text-orange-800">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-orange-950">Hospitality Passes</h4>
                <p className="text-[11px] text-orange-700">
                  {myHospitality.length} active arrangement(s)
                </p>
              </div>
            </Link>

            <Link
              to="/student/feedback"
              className="p-4 rounded-xl bg-purple-50/60 border border-purple-200 hover:border-purple-300 transition-all flex items-center gap-3"
            >
              <div className="p-2.5 rounded-lg bg-purple-100 text-purple-800">
                <Star className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-purple-950">Submit Feedback</h4>
                <p className="text-[11px] text-purple-700">Rate attended events</p>
              </div>
            </Link>
          </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
