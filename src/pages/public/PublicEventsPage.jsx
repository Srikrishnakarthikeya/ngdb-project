import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import {
  Search,
  Calendar,
  MapPin,
  ArrowUpDown,
  ArrowRight
} from 'lucide-react';

const PublicEventsPage = () => {
  const { events, venues } = useData();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedDiscipline, setSelectedDiscipline] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [sortBy, setSortBy] = useState('date-asc');
  const [categoryToScroll, setCategoryToScroll] = useState(null);
  const categories = [
    { type: 'Technical', icon: '\u{1F4BB}', style: 'border-blue-200 bg-blue-50 text-blue-900' },
    { type: 'Non-Technical', icon: '\u{1F3AD}', style: 'border-purple-200 bg-purple-50 text-purple-900' },
    { type: 'Fun Activity', icon: '\u{1F389}', style: 'border-amber-200 bg-amber-50 text-amber-900' }
  ];

  const eventTypes = ['ALL', ...categories.map(({ type }) => type)];

  const getEventCategory = (event) => categories.some(({ type }) => type === event.Event_Type)
    ? event.Event_Type
    : null;
  const getCategoryId = (type) => `event-category-${type.toLowerCase().replace(/\s+/g, '-')}`;

  const matchesDiscipline = (event) => {
    if (selectedDiscipline === 'ALL' || ['Non-Technical', 'Fun Activity'].includes(getEventCategory(event))) return true;
    if (Number(event.Event_ID.split('-')[1]) >= 201) return true;
    const text = `${event.Event_Name} ${event.Description} ${event.TargetAudience || ''}`.toLowerCase();
    if (selectedDiscipline === 'Data Analytics') return /data|analytics|ai|machine learning/.test(text);
    if (selectedDiscipline === 'MCA') return /mca|computer application|computer science|students/.test(text);
    return /m\.sc|msc|science|research|students/.test(text);
  };

  // Filter & sort logic
  const filteredEvents = useMemo(() => {
    return events
      .filter((evt) => {
        const matchesSearch =
          evt.Event_Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          evt.Description.toLowerCase().includes(searchTerm.toLowerCase());
        const category = getEventCategory(evt);
        const matchesType = category !== null && (selectedType === 'ALL' || category === selectedType);
        const matchesDisciplineFilter = matchesDiscipline(evt);
        const matchesStatus = selectedStatus === 'ALL' || evt.Status === selectedStatus;
        return matchesSearch && matchesType && matchesDisciplineFilter && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'date-asc') return new Date(a.Start_Date) - new Date(b.Start_Date);
        if (sortBy === 'date-desc') return new Date(b.Start_Date) - new Date(a.Start_Date);
        if (sortBy === 'name-asc') return a.Event_Name.localeCompare(b.Event_Name);
        return 0;
      });
  }, [events, searchTerm, selectedType, selectedDiscipline, selectedStatus, sortBy]);

  useEffect(() => {
    if (!categoryToScroll) return;
    document.getElementById(getCategoryId(categoryToScroll))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setCategoryToScroll(null);
  }, [categoryToScroll, filteredEvents]);

  const handleCategoryClick = (type) => {
    setSearchTerm('');
    setSelectedDiscipline('ALL');
    setSelectedStatus('ALL');
    setSelectedType(type);
    setCategoryToScroll(type);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block mb-1">
              NIT Trichy &bull; Department of CA
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-nitt-950">
              Browse Events
            </h1>
            {/* <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Explore national workshops, conferences, competitive hackathons, and guest lectures
            </p> */}
          </div>

          <div className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
            Showing <span className="text-nitt-900 font-bold">{filteredEvents.length}</span> of {events.length} events
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {categories.map(({ type, icon, style }) => (
          <button key={type} type="button" onClick={() => handleCategoryClick(type)} className={`rounded-xl border p-4 text-left transition-all hover:shadow-sm ${style} ${selectedType === type ? 'ring-2 ring-offset-1 ring-blue-500' : ''}`}>
            <span className="text-xl" aria-hidden="true">{icon}</span>
            <span className="ml-2 font-bold">{type}</span>
            <span className="block mt-1 text-xs opacity-75">{events.filter((event) => getEventCategory(event) === type).length} activities &middot; view activities</span>
          </button>
        ))}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-4">
        {/* Top Row: Search and Sort */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by event title, topic, or keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="date-asc">Sort: Date (Upcoming first)</option>
              <option value="date-desc">Sort: Date (Recent first)</option>
              <option value="name-asc">Sort: Event Name (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Bottom Row: Event Type, Discipline & Status Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Event Type
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {eventTypes.map((type) => (
                <option key={type} value={type}>
                  {type === 'ALL' ? 'All Event Types' : type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Discipline
            </label>
            <select
              value={selectedDiscipline}
              onChange={(e) => setSelectedDiscipline(e.target.value)}
              className="w-full py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Disciplines</option>
              <option value="Data Analytics">Data Analytics</option>
              <option value="MCA">MCA</option>
              <option value="MSc">MSc</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Event Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="Upcoming">Upcoming</option>
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Event Cards */}
      {filteredEvents.length === 0 ? (
        <EmptyState
          title="No events found"
          description="Try clearing your filters or changing your search terms to discover scheduled events."
          actionLabel="Clear Filters"
          onAction={() => {
            setSearchTerm('');
            setSelectedType('ALL');
            setSelectedDiscipline('ALL');
            setSelectedStatus('ALL');
          }}
        />
      ) : (
        <div className="space-y-10">
          {categories.map(({ type, icon, style }) => {
            const categoryEvents = filteredEvents.filter((event) => getEventCategory(event) === type);
            if (!categoryEvents.length) return null;
            return <section key={type} id={getCategoryId(type)} className="scroll-mt-24 space-y-4">
              <div className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 ${style}`}>
                <span aria-hidden="true">{icon}</span><h2 className="font-bold">{type} Events</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryEvents.map((evt) => {
                  const venue = venues.find((v) => v.Venue_ID === evt.Venue_ID);
                  return <article key={evt.Event_ID} className="bg-white rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col overflow-hidden group">
                    <div className="relative h-44 overflow-hidden bg-slate-100">
                      <img src={evt.Banner} alt={evt.Event_Name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <div className="absolute top-3 left-3"><Badge status={evt.Status} /></div>
                      <div className="absolute top-3 right-3 bg-nitt-950/80 text-white text-[11px] font-bold px-2.5 py-1 rounded-md">{type}</div>
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs text-slate-500"><Calendar className="w-3.5 h-3.5 text-blue-600" /><span>{new Date(evt.Start_Date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} - {new Date(evt.End_Date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span></div>
                        <h3 className="text-base font-bold text-nitt-950 leading-snug group-hover:text-blue-600">{evt.Event_Name}</h3>
                        <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">{evt.Description}</p>
                      </div>
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500"><span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-rose-500" />{venue?.Venue_Name || 'Campus Venue'}</span><span className="font-bold text-slate-900">{evt.RegistrationFee === 0 ? 'Free Entry' : `Rs. ${evt.RegistrationFee}`}</span></div>
                      <Link to={`/events/${evt.Event_ID}`} className="px-4 py-2 rounded-lg bg-nitt-900 hover:bg-nitt-800 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5"><span>Details & Register</span><ArrowRight className="w-3.5 h-3.5" /></Link>
                    </div>
                  </article>;
                })}
              </div>
            </section>;
          })}
        </div>
      )}
    </div>
  );
};

export default PublicEventsPage;
