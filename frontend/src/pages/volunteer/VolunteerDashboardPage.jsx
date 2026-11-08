import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { Calendar, MapPin } from 'lucide-react';

const VolunteerDashboardPage = () => {
  const { currentUser } = useAuth();
  const { events, getVenue } = useData();
  const { showToast } = useToast();
  const [applications, setApplications] = useState([]);
  const [tab, setTab] = useState('Browse');

  const authorizedRequest = async (path, options = {}) => {
    const token = localStorage.getItem('nitt_ca_auth_token');
    const response = await fetch(path, { ...options, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: options.body });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || 'Request failed');
    return data;
  };
  const refreshApplications = async () => {
    try { setApplications(await authorizedRequest('/api/volunteer-applications/my')); } catch (error) { showToast(error.message, 'error'); }
  };
  useEffect(() => { refreshApplications(); }, []);

  const applicationByEvent = useMemo(() => new Map(applications.filter((item) => item.Status !== 'Rejected').map((item) => [item.Event_ID, item])), [applications]);
  const requestEvent = async (eventId) => {
    try {
      await authorizedRequest(`/api/volunteer-applications/${encodeURIComponent(eventId)}`, { method: 'POST' });
      await refreshApplications();
      showToast('Volunteer request submitted.', 'success');
    } catch (error) { showToast(error.message, 'error'); }
  };
  const statusEvents = applications.filter((item) => tab === 'Pending' ? item.Status === 'Pending' : tab === 'Accepted' ? item.Status === 'Accepted' : item.Status === 'Rejected').map((item) => ({ ...events.find((event) => event.Event_ID === item.Event_ID), application: item })).filter((item) => item.Event_ID);

  return <div className="space-y-6">
    <div className="border-b border-slate-200 pb-4"><p className="text-xs font-bold uppercase text-emerald-700">Volunteer portal</p><h1 className="mt-1 text-2xl font-bold text-nitt-950">Welcome, {currentUser?.name}</h1></div>
    <div className="flex flex-wrap gap-2">{['Browse', 'Pending', 'Accepted', 'Rejected'].map((name) => <button key={name} onClick={() => setTab(name)} className={`rounded-lg px-3 py-2 text-xs font-bold ${tab === name ? 'bg-emerald-700 text-white' : 'border border-slate-200 bg-white text-slate-600'}`}>{name}</button>)}</div>
    {tab === 'Browse' ? <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{events.map((event) => { const application = applicationByEvent.get(event.Event_ID); const venue = getVenue(event.Venue_ID); return <article key={event.Event_ID} className="rounded-xl border border-slate-200 bg-white p-5"><p className="font-mono text-[10px] font-bold text-slate-400">{event.Event_ID}</p><h2 className="mt-1 font-bold text-slate-950">{event.Event_Name}</h2><div className="mt-3 space-y-2 text-xs text-slate-600"><p className="flex items-center gap-2"><Calendar className="h-4 w-4 text-blue-600" />{event.Start_Date} to {event.End_Date}</p><p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-rose-600" />{venue?.Venue_Name || 'Venue to be confirmed'}</p></div>{application ? <div className={`mt-4 rounded-lg px-3 py-2 text-center text-xs font-bold ${application.Status === 'Accepted' ? 'bg-emerald-50 text-emerald-700' : application.Status === 'Rejected' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'}`}>{application.Status}</div> : <button onClick={() => requestEvent(event.Event_ID)} className="mt-4 w-full rounded-lg bg-emerald-700 px-3 py-2 text-xs font-bold text-white">Request to Volunteer</button>}</article>; })}</div> : <div className="grid gap-4 md:grid-cols-2">{statusEvents.length === 0 ? <p className="text-sm text-slate-500">No {tab.toLowerCase()} requests.</p> : statusEvents.map((item) => <article key={item.Event_ID} className="rounded-xl border border-slate-200 bg-white p-5"><h2 className="font-bold text-slate-950">{item.Event_Name}</h2><p className="mt-2 text-xs text-slate-500">{item.Start_Date} to {item.End_Date}</p><div className="mt-4"><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${item.application.Status === 'Accepted' ? 'bg-emerald-100 text-emerald-700' : item.application.Status === 'Rejected' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>{item.application.Status}</span></div></article>)}</div>}
  </div>;
};
export default VolunteerDashboardPage;
