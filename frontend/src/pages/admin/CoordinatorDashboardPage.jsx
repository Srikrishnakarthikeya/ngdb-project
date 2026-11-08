import React from 'react';
import { Calendar, UserCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Link } from 'react-router-dom';

const CoordinatorDashboardPage = () => {
  const { currentUser } = useAuth();
  const { events, eventCoordinators } = useData();
  const assignments = eventCoordinators.filter((item) => item.Coordinator_ID === currentUser?.id);
  const assignedEvents = assignments.map((assignment) => ({ assignment, event: events.find((event) => event.Event_ID === assignment.Event_ID) })).filter((item) => item.event);

  return <div className="space-y-6">
    <div className="border-b border-slate-200 pb-4"><p className="text-xs font-bold uppercase text-amber-700">Coordinator portal</p><h1 className="mt-1 text-2xl font-bold text-slate-950">My Assigned Events</h1></div>
    {assignedEvents.length === 0 ? <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500"><UserCheck className="mx-auto mb-2 h-6 w-6" />No events have been assigned to you yet.</div> :
      <div className="grid gap-4 md:grid-cols-2">{assignedEvents.map(({ assignment, event }) => <article key={`${assignment.Event_ID}-${assignment.Coordinator_ID}`} className="rounded-xl border border-slate-200 bg-white p-5"><div className="flex items-start gap-3"><div className="rounded-lg bg-amber-100 p-2.5 text-amber-800"><Calendar className="h-5 w-5" /></div><div><p className="text-xs font-mono font-bold text-slate-500">{event.Event_ID}</p><h2 className="text-base font-bold text-slate-950">{event.Event_Name}</h2><p className="mt-1 text-xs text-slate-600">Role: <strong>{assignment.Assigned_Role}</strong></p><p className="mt-2 text-xs text-slate-500">{event.Event_Date} · {event.Venue_ID || 'Venue to be confirmed'}</p></div></div><Link to={`/events/${event.Event_ID}`} className="mt-4 inline-block text-xs font-bold text-blue-700">View event →</Link></article>)}</div>}
  </div>;
};
export default CoordinatorDashboardPage;
