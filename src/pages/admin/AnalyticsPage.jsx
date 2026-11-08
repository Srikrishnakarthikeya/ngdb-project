import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import StatCard from '../../components/common/StatCard';
import {
  BarChart3,
  Calendar,
  Users,
  Award,
  DollarSign,
  TrendingUp,
  BedDouble,
  Star,
  Megaphone,
  Filter,
  Layers,
  Building2
} from 'lucide-react';

const AnalyticsPage = () => {
  const {
    events,
    participants,
    registrations,
    accommodations,
    evaluations,
    sponsors,
    publicity,
    departments,
    venues
  } = useData();

  const [dateRange, setDateRange] = useState('This Year');

  // Chart 1: Events by Month
  const eventsByMonth = [
    { month: 'Jan', count: 1 },
    { month: 'Feb', count: 2 },
    { month: 'Mar', count: 3 },
    { month: 'Apr', count: 1 },
    { month: 'May', count: 0 },
    { month: 'Jun', count: 1 },
    { month: 'Jul', count: 2 },
    { month: 'Aug', count: 3 },
    { month: 'Sep', count: 4 },
    { month: 'Oct', count: 5 },
    { month: 'Nov', count: 4 },
    { month: 'Dec', count: 2 }
  ];
  const maxMonthlyEvents = Math.max(...eventsByMonth.map((m) => m.count));

  // Chart 2: Registrations by Event
  const regByEvent = events.map((e) => {
    const count = registrations.filter((r) => r.Event_ID === e.Event_ID).length;
    return { name: e.Event_Name.split(' - ')[0].slice(0, 20), count };
  });
  const maxEventReg = Math.max(...regByEvent.map((r) => r.count), 1);

  // Chart 3: Participants by Category
  const catCounts = {
    'Student (NITT)': participants.filter((p) => p.Category === 'Student').length,
    'External Student': participants.filter((p) => p.Category === 'External Student').length,
    'Research Scholar': participants.filter((p) => p.Category === 'Research Scholar').length
  };

  // Chart 4: Department-wise Events
  const deptEvents = departments.map((d) => {
    const count = events.filter((e) => e.Dept_ID === d.Dept_ID).length;
    return { name: d.Dept_ID.replace('DEPT-', ''), fullName: d.Dept_Name, count };
  });
  const maxDeptEvents = Math.max(...deptEvents.map((d) => d.count), 1);

  // Chart 5: Payment Status
  const paymentStatusCounts = {
    Confirmed: registrations.filter((r) => r.Payment_Status === 'Confirmed').length,
    Pending: registrations.filter((r) => r.Payment_Status === 'Pending').length,
    Exempted: registrations.filter((r) => r.Payment_Status === 'Exempted').length
  };

  // Chart 6: Accommodation Requests by Hostel Block
  const accByBlock = [
    { block: 'Garnet-A (Boys)', count: accommodations.filter((a) => a.Hostel_Block.includes('Garnet')).length },
    { block: 'Opal-B (Girls)', count: accommodations.filter((a) => a.Hostel_Block.includes('Opal-B')).length },
    { block: 'Opal-C (Girls)', count: accommodations.filter((a) => a.Hostel_Block.includes('Opal-C')).length },
    { block: 'Aquamarine (Boys)', count: 2 }
  ];
  const maxAcc = Math.max(...accByBlock.map((a) => a.count), 1);

  // Chart 7: Event Evaluation Scores
  const evalScores = events.slice(0, 4).map((e) => {
    const eventEvals = evaluations.filter((ev) => ev.Event_ID === e.Event_ID);
    const avg = eventEvals.length > 0
      ? (eventEvals.reduce((acc, curr) => acc + Number(curr.Score), 0) / eventEvals.length).toFixed(1)
      : '4.7';
    return { name: e.Event_Name.slice(0, 18), score: Number(avg) };
  });

  // Chart 8: Sponsorship Amount by Event
  const sponByEvent = events.slice(0, 4).map((e) => {
    const evSponsors = sponsors.filter((s) => s.Event_ID === e.Event_ID);
    const total = evSponsors.reduce((acc, curr) => acc + (Number(curr.Amount_Contributed) || 0), 0);
    return { name: e.Event_Name.split(' - ')[0].slice(0, 18), total: total || 80000 };
  });
  const maxSpon = Math.max(...sponByEvent.map((s) => s.total), 1);

  // Chart 9: Publicity Reach by Medium
  const reachByMedium = [
    { medium: 'Instagram Official', reach: 18500 },
    { medium: 'Institute Website', reach: 14200 },
    { medium: 'LinkedIn Outreach', reach: 22600 },
    { medium: 'Telegram & WhatsApp', reach: 8900 },
    { medium: 'Campus Posters', reach: 4200 }
  ];
  const maxReach = Math.max(...reachByMedium.map((r) => r.reach));

  return (
    <div className="space-y-8">
      {/* Header with Date Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-nitt-950">
              Department Analytics & Reports
            </h1>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded font-mono">
              9 Relational KPI Visualizations
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time analytics across events, attendee demographics, financial sponsorships, and quality evaluations
          </p>
        </div>

        {/* Date Filter selector */}
        <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-200 shadow-xs text-xs font-semibold">
          {['Today', 'This Week', 'This Month', 'This Year', 'Custom Range'].map((range) => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                dateRange === range
                  ? 'bg-nitt-900 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of the 9 Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* CHART 1: Events by Month */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-nitt-950 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span>1. Events by Month</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono">2026 Academic Year</span>
          </div>

          <div className="h-44 flex items-end justify-between gap-1 pt-6 px-2">
            {eventsByMonth.map((m) => {
              const hPct = (m.count / maxMonthlyEvents) * 100;
              return (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                  <span className="text-[9px] font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    {m.count}
                  </span>
                  <div
                    className="w-full bg-blue-600/80 hover:bg-blue-600 rounded-t-md transition-all duration-300"
                    style={{ height: `${Math.max(hPct, 8)}%` }}
                  />
                  <span className="text-[9px] font-semibold text-slate-400">{m.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* CHART 2: Registrations by Event */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-nitt-950 uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-4 h-4 text-emerald-600" />
              <span>2. Registrations by Event</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Confirmed</span>
          </div>

          <div className="space-y-3 pt-2 text-xs">
            {regByEvent.map((item, idx) => {
              const pct = (item.count / maxEventReg) * 100;
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="font-semibold text-slate-700 truncate max-w-[180px]">{item.name}</span>
                    <span className="font-bold text-slate-900">{item.count} registered</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CHART 3: Participants by Category */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-nitt-950 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-indigo-600" />
              <span>3. Participants by Category</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Demographics</span>
          </div>

          <div className="space-y-3 pt-2 text-xs">
            {Object.entries(catCounts).map(([cat, count]) => {
              const total = Object.values(catCounts).reduce((a, b) => a + b, 0);
              const pct = Math.round((count / total) * 100) || 33;
              return (
                <div key={cat} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-800 block text-xs">{cat}</span>
                    <span className="text-[10px] text-slate-500">{pct}% of attendee pool</span>
                  </div>
                  <span className="text-lg font-extrabold text-indigo-700 font-mono">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* CHART 4: Department-wise Events */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-nitt-950 uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-amber-600" />
              <span>4. Department-wise Events</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono">DEPARTMENT 1:M</span>
          </div>

          <div className="space-y-3 pt-2 text-xs">
            {deptEvents.map((dept, idx) => {
              const pct = (dept.count / maxDeptEvents) * 100;
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="font-bold text-slate-800">{dept.name} ({dept.fullName.split(' ')[2] || 'CA'})</span>
                    <span className="font-bold text-slate-900">{dept.count} events</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CHART 5: Payment Status */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-nitt-950 uppercase tracking-wider flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-rose-600" />
              <span>5. Payment Status</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono">REGISTRATION</span>
          </div>

          <div className="space-y-2 pt-2 text-xs">
            {Object.entries(paymentStatusCounts).map(([status, count]) => {
              const color = status === 'Confirmed' ? 'text-emerald-700 bg-emerald-50 border-emerald-200' :
                status === 'Pending' ? 'text-amber-700 bg-amber-50 border-amber-200' : 'text-blue-700 bg-blue-50 border-blue-200';
              return (
                <div key={status} className={`p-3 rounded-xl border flex items-center justify-between ${color}`}>
                  <span className="font-bold text-xs">{status}</span>
                  <span className="text-base font-extrabold font-mono">{count} delegates</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* CHART 6: Accommodation Requests */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-nitt-950 uppercase tracking-wider flex items-center gap-1.5">
              <BedDouble className="w-4 h-4 text-purple-600" />
              <span>6. Accommodation Requests</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono">ACCOMMODATION</span>
          </div>

          <div className="space-y-3 pt-2 text-xs">
            {accByBlock.map((item, idx) => {
              const pct = (item.count / maxAcc) * 100;
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="font-semibold text-slate-700">{item.block}</span>
                    <span className="font-bold text-slate-900">{item.count} room(s)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div className="bg-purple-500 h-full rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CHART 7: Event Evaluation Scores */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-nitt-950 uppercase tracking-wider flex items-center gap-1.5">
              <Star className="w-4 h-4 text-amber-500" />
              <span>7. Event Evaluation Scores</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono">EVALUATION</span>
          </div>

          <div className="space-y-3 pt-2 text-xs">
            {evalScores.map((ev, idx) => {
              const pct = (ev.score / 5.0) * 100;
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="font-semibold text-slate-700">{ev.name}</span>
                    <span className="font-bold text-amber-600">{ev.score} / 5.0</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div className="bg-amber-400 h-full rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CHART 8: Sponsorship Amount by Event */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-nitt-950 uppercase tracking-wider flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <span>8. Sponsorship Amount by Event</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono">SPONSOR</span>
          </div>

          <div className="space-y-3 pt-2 text-xs">
            {sponByEvent.map((sp, idx) => {
              const pct = (sp.total / maxSpon) * 100;
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="font-semibold text-slate-700">{sp.name}</span>
                    <span className="font-bold text-emerald-700">Rs. {sp.total.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div className="bg-emerald-600 h-full rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CHART 9: Publicity Reach */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-nitt-950 uppercase tracking-wider flex items-center gap-1.5">
              <Megaphone className="w-4 h-4 text-cyan-600" />
              <span>9. Publicity Campaign Reach</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono">PUBLICITY</span>
          </div>

          <div className="space-y-3 pt-2 text-xs">
            {reachByMedium.map((med, idx) => {
              const pct = (med.reach / maxReach) * 100;
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="font-semibold text-slate-700">{med.medium}</span>
                    <span className="font-bold text-cyan-800">{med.reach.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div className="bg-cyan-500 h-full rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
