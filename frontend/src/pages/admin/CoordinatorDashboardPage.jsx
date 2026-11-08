import React, { useEffect, useState } from 'react';
import { Calendar, UserCheck, HeartHandshake, Check, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Link } from 'react-router-dom';

const CoordinatorDashboardPage = () => {
  const { currentUser } = useAuth();
  const { events, eventCoordinators } = useData();
  const [applications, setApplications] = useState([]);
  const assignments = eventCoordinators.filter((item) => item.Coordinator_ID === currentUser?.id);
  const assignedEvents = assignments.map((assignment) => ({ assignment, event: events.find((event) => event.Event_ID === assignment.Event_ID) })).filter((item) => item.event);

  const loadApplications = async () => {
    try {
      const token = localStorage.getItem('nitt_ca_auth_token');
      const response = await fetch('/api/volunteer-applications/coordinator', { headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) } });
      const data = await response.json();
      if (response.ok) setApplications(data);
    } catch { setApplications([]); }
  };
  useEffect(() => { loadApplications(); }, [currentUser?.id]);

  const reviewApplication = async (applicationId, status) => {
    const token = localStorage.getItem('nitt_ca_auth_token');
    const response = await fetch(`/api/volunteer-applications/${encodeURIComponent(applicationId)}/${status}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) } });
    if (response.ok) await loadApplications();
  };

  return <div className="space-y-6">
    <div className="border-b border-slate-200 pb-4"><p className="text-xs font-bold uppercase text-amber-700">Coordinator portal</p><h1 className="mt-1 text-2xl font-bold text-slate-950">My Assigned Events</h1></div>
    {assignedEvents.length === 0 ? <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500"><UserCheck className="mx-auto mb-2 h-6 w-6" />No events have been assigned to you yet.</div> :
      <div className="grid gap-4 md:grid-cols-2">{assignedEvents.map(({ assignment, event }) => <article key={`${assignment.Event_ID}-${assignment.Coordinator_ID}`} className="rounded-xl border border-slate-200 bg-white p-5"><div className="flex items-start gap-3"><div className="rounded-lg bg-amber-100 p-2.5 text-amber-800"><Calendar className="h-5 w-5" /></div><div><p className="text-xs font-mono font-bold text-slate-500">{event.Event_ID}</p><h2 className="text-base font-bold text-slate-950">{event.Event_Name}</h2><p className="mt-1 text-xs text-slate-600">Role: <strong>{assignment.Assigned_Role}</strong></p><p className="mt-2 text-xs text-slate-500">{event.Start_Date} · {event.Venue_ID || 'Venue to be confirmed'}</p></div></div><Link to={`/events/${event.Event_ID}`} className="mt-4 inline-block text-xs font-bold text-blue-700">View event →</Link></article>)}</div>}
    <section className="rounded-xl border border-slate-200 bg-white p-5"><div className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-3"><HeartHandshake className="h-5 w-5 text-emerald-700" /><h2 className="font-bold text-slate-950">Volunteer Requests</h2></div>{applications.length === 0 ? <p className="text-xs text-slate-500">No volunteer requests for your assigned events.</p> : <div className="overflow-x-auto"><table className="w-full text-left text-xs"><thead><tr className="text-slate-500"><th className="py-2">Volunteer</th><th>Event</th><th>Status</th><th className="text-right">Action</th></tr></thead><tbody className="divide-y divide-slate-100">{applications.map((item) => <tr key={item.applicationId}><td className="py-3"><span className="block font-bold text-slate-900">{item.volunteerName}</span><span className="text-slate-500">{item.volunteerEmail}</span></td><td>{events.find((event) => event.Event_ID === item.Event_ID)?.Event_Name || item.Event_ID}</td><td><span className={`rounded-full px-2 py-1 text-[10px] font-bold ${item.Status === 'Accepted' ? 'bg-emerald-100 text-emerald-700' : item.Status === 'Rejected' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>{item.Status}</span></td><td className="text-right">{item.Status === 'Pending' && <><button onClick={() => reviewApplication(item.applicationId, 'Accepted')} className="mr-1 rounded-md bg-emerald-50 p-1.5 text-emerald-700" title="Accept"><Check className="h-4 w-4" /></button><button onClick={() => reviewApplication(item.applicationId, 'Rejected')} className="rounded-md bg-rose-50 p-1.5 text-rose-700" title="Reject"><X className="h-4 w-4" /></button></>}</td></tr>)}</tbody></table></div>}</section>
  </div>;
};
export default CoordinatorDashboardPage;
