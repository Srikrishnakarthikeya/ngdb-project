import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import Badge from '../../components/common/Badge';
import {
  Calendar,
  Users,
  Award,
  ClipboardCheck,
  Building2,
  MapPin,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  BookOpen,
  Cpu,
  Trophy,
} from 'lucide-react';

const HomePage = () => {
  const { events, participants, registrations, certificates, venues, departments } = useData();

  // Filter upcoming events
  const upcomingEvents = events.slice(0, 3);

  const categories = [
    { name: 'Technical Symposia', icon: Cpu, count: 'Annual Flagship', desc: 'Version & departmental national symposia' },
    { name: 'Hands-on Workshops', icon: BookOpen, count: 'Skill Labs', desc: 'AI, PyTorch, Cloud & Fullstack Bootcamps' },
    { name: 'National Conferences', icon: Users, count: 'Research Papers', desc: 'Data Science & High Performance Computing' },
    { name: 'Coding Competitions', icon: Trophy, count: 'Hackathons', desc: '24-hour algorithmic challenges & CTFs' },
    { name: 'Expert Seminars', icon: Sparkles, count: 'Keynotes', desc: 'Industry leaders from Silicon Valley & IEEE' },
    { name: 'Innovation Expos', icon: Building2, count: 'Product Demos', desc: 'Final-year MCA & M.Sc project showcases' }
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-nitt-950 via-nitt-900 to-slate-900 text-white pt-16 pb-20 px-4 sm:px-6 lg:px-8 border-b border-nitt-800">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-amber-300">
                  NIT Trichy Events
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-400 max-w-2xl leading-relaxed">
                Discover what’s happening at NIT Tiruchirappalli. Explore academic, technical, and cultural events, find workshops and symposiums, and take part in the ideas and experiences shaping our campus community.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/events"
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
                >
                  <span>Explore Events</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/student-login"
                  className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-sm backdrop-blur-xs flex items-center gap-2 transition-all"
                >
                  <Users className="w-4 h-4 text-amber-400" />
                  <span>Student Login</span>
                </Link>
              </div>

              {/* Trust badges */}
              <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>NIT Trichy Approved</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Verified Credentials</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>One Campus, Many Experiences</span>
                </div>
              </div>
            </div>

            {/* Right Academic Hero Visual */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md bg-gradient-to-br from-slate-800 to-nitt-950 p-3 rounded-2xl border border-slate-700 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80"
                  alt="NIT Trichy Department Auditorium and Symposia"
                  className="w-full h-72 object-cover rounded-xl shadow-md"
                />

                {/* Floating Venue Tag */}
                <div className="absolute -top-3 -right-3 bg-nitt-900 text-white px-3 py-1.5 rounded-lg shadow-md border border-nitt-700 text-xs font-bold flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>Barn Hall & Orion</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* UPCOMING EVENTS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">
              <Calendar className="w-4 h-4" />
              <span>Academic Calendar</span>
            </div>
            <h2 className="text-2xl font-bold text-nitt-950">
              Featured & Upcoming Events
            </h2>
          </div>
          <Link
            to="/events"
            className="inline-flex items-center gap-1 text-sm font-bold text-blue-600 hover:text-blue-700"
          >
            <span>View All Events ({events.length})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Event Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {upcomingEvents.map((evt) => {
            const venue = venues.find((v) => v.Venue_ID === evt.Venue_ID);
            const dept = departments.find((d) => d.Dept_ID === evt.Dept_ID);

            return (
              <div
                key={evt.Event_ID}
                className="bg-white rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden group"
              >
                {/* Event Image */}
                <div className="relative h-44 overflow-hidden bg-slate-100">
                  <img
                    src={evt.Banner}
                    alt={evt.Event_Name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge status={evt.Status} />
                  </div>
                  <div className="absolute top-3 right-3 bg-nitt-950/80 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-md">
                    {evt.Event_Type}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Calendar className="w-3.5 h-3.5 text-blue-600" />
                      <span>{new Date(evt.Start_Date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      <span>&bull;</span>
                      <span>{dept?.Dept_Name?.replace('Department of ', '') || 'CA'}</span>
                    </div>

                    <h3 className="text-base font-bold text-nitt-950 leading-snug group-hover:text-blue-600 transition-colors">
                      {evt.Event_Name}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {evt.Description}
                    </p>
                  </div>

                  {/* Venue & Capacity */}
                  <div className="pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
                      <span className="truncate">{venue?.Venue_Name || 'Campus Venue'}</span>
                    </div>
                  </div>

                  {/* Card Action */}
                  <div className="pt-2 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-slate-400 block">Registration Fee</span>
                      <span className="text-sm font-extrabold text-slate-900">
                        {evt.RegistrationFee === 0 ? 'Free Entry' : `Rs. ${evt.RegistrationFee}`}
                      </span>
                    </div>
                    <Link
                      to={`/events/${evt.Event_ID}`}
                      className="px-3.5 py-1.5 rounded-lg bg-nitt-900 hover:bg-nitt-800 text-white text-xs font-bold transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* EVENT CATEGORIES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
            Broad Spectrum of Activities
          </span>
          <h2 className="text-2xl font-bold text-nitt-950">
            Event Categories & Tracks
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Diverse programs curated for academic enrichment, industry preparedness, and technical mastery
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div
                key={idx}
                className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-blue-400 hover:shadow-md transition-all flex items-start gap-4"
              >
                <div className="p-3 rounded-xl bg-blue-50 text-blue-700 flex-shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-nitt-950">{cat.name}</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{cat.desc}</p>
                  <span className="inline-block mt-2 text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                    {cat.count}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-nitt-950 to-nitt-800 rounded-2xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 border border-nitt-700">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-bold">
              Ready to participate in NIT Trichy CA events?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Register now as an internal student or external delegate to unlock technical workshops, symposium hackathons, and verifiable credentials.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/student-login"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all"
            >
              Sign In to Register
            </Link>
            <Link
              to="/events"
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs transition-all"
            >
              Browse Event Calendar
            </Link>
          </div>
        </div>
      </section>

      {/* STATISTICS COUNTERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Campus at a glance</span>
          <h2 className="text-2xl font-bold text-nitt-950 mt-1">Event Portal Statistics</h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-5 shadow-md border border-slate-200 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-50 text-blue-700"><Calendar className="w-6 h-6" /></div>
            <div><p className="text-2xl font-extrabold text-slate-900">{events.length}</p><p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Events</p></div>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-md border border-slate-200 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700"><Users className="w-6 h-6" /></div>
            <div><p className="text-2xl font-extrabold text-slate-900">{participants.length}</p><p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Participants</p></div>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-md border border-slate-200 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-amber-50 text-amber-700"><ClipboardCheck className="w-6 h-6" /></div>
            <div><p className="text-2xl font-extrabold text-slate-900">{registrations.length}</p><p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Registrations</p></div>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-md border border-slate-200 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-purple-50 text-purple-700"><Award className="w-6 h-6" /></div>
            <div><p className="text-2xl font-extrabold text-slate-900">{certificates.length}</p><p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Certificates Issued</p></div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
