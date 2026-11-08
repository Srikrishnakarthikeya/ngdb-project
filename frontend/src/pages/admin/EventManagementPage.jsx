import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import {
  Calendar,
  PlusCircle,
  Edit2,
  Trash2,
  Eye,
  Search,
  Building2,
  MapPin,
  DollarSign
} from 'lucide-react';

const EVENT_CATEGORIES = [
  { type: 'Technical', examples: ['Hackathon', 'Seminars', 'Workshops', 'Technical Quiz', 'Web Design Challenge'] },
  { type: 'Non-Technical', examples: ['Debate', 'Just A Minute (JAM)', 'Meme Making', 'Short Film', 'Talent Show'] },
  { type: 'Fun Activity', examples: ['Treasure Hunt', 'Dumb Charades', 'Guess the Song', 'Blind Drawing'] }
];

const LEGACY_EVENT_TYPES = ['Workshop', 'Symposium', 'Seminar', 'Conference', 'Competition', 'Exhibition'];
const MAX_EVENT_IMAGE_SIZE = 1024 * 1024;
const ALLOWED_EVENT_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const EventManagementPage = () => {
  const { events, departments, venues, addEvent, updateEvent, deleteEvent } = useData();
  const { showToast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [deleteEventId, setDeleteEventId] = useState(null);

  const initialFormState = {
    Event_ID: `EVT-${Math.floor(100 + Math.random() * 900)}`,
    Event_Name: '',
    Event_Type: 'Technical',
    Start_Date: new Date().toISOString().split('T')[0],
    End_Date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    Description: '',
    Budget: 100000,
    Status: 'Upcoming',
    Dept_ID: 'DEPT-CA',
    Venue_ID: 'VEN-01',
    RegistrationFee: 99,
    Banner: ''
  };

  const [formData, setFormData] = useState(initialFormState);
  const [bannerError, setBannerError] = useState('');
  const selectedCategory = EVENT_CATEGORIES.find(({ type }) => type === formData.Event_Type);

  const handleOpenAdd = () => {
    setEditingEvent(null);
    setFormData({
      ...initialFormState,
      Event_ID: `EVT-${Math.floor(100 + Math.random() * 900)}`
    });
    setBannerError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (evt) => {
    setEditingEvent(evt);
    setFormData({ ...evt });
    setBannerError('');
    setIsModalOpen(true);
  };

  const handleBannerUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_EVENT_IMAGE_TYPES.includes(file.type)) {
      setBannerError('Choose a JPG, PNG, or WebP image.');
      e.target.value = '';
      return;
    }
    if (file.size > MAX_EVENT_IMAGE_SIZE) {
      setBannerError('Choose an image smaller than 1 MB.');
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFormData((previous) => ({ ...previous, Banner: reader.result }));
      setBannerError('');
    };
    reader.onerror = () => setBannerError('The selected image could not be read.');
    reader.readAsDataURL(file);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!editingEvent && !formData.Banner) {
      setBannerError('Upload an event image before creating the event.');
      return;
    }
    if (editingEvent) {
      updateEvent(editingEvent.Event_ID, formData);
      showToast(`Event ${editingEvent.Event_ID} updated successfully!`, 'success');
    } else {
      addEvent(formData);
      showToast(`Event ${formData.Event_ID} created successfully!`, 'success');
    }
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (deleteEventId) {
      deleteEvent(deleteEventId);
      showToast(`Event ${deleteEventId} has been removed.`, 'info');
      setDeleteEventId(null);
    }
  };

  const filteredEvents = events.filter((e) =>
    e.Event_Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.Event_ID.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.Event_Type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-nitt-950">
              Event Management
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Create, update, and manage academic symposiums, workshops, and conclaves
          </p>
        </div>

        <Button
          variant="primary"
          icon={PlusCircle}
          onClick={handleOpenAdd}
        >
          Create New Event
        </Button>
      </div>

      {/* Search & Statistics Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search events by ID, title, or type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="text-xs text-slate-500 font-semibold self-end sm:self-center">
          Showing <span className="text-slate-900 font-bold">{filteredEvents.length}</span> of {events.length} events
        </div>
      </div>

      {/* Events Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-xs">
            <thead className="bg-slate-50 font-bold uppercase tracking-wider text-slate-600 text-[10px]">
              <tr>
                <th className="px-4 py-3 text-left">Event ID (PK)</th>
                <th className="px-4 py-3 text-left">Event Name</th>
                <th className="px-4 py-3 text-left">Type</th>
                <th className="px-4 py-3 text-left">Duration</th>
                <th className="px-4 py-3 text-left">Department (Dept_ID FK)</th>
                <th className="px-4 py-3 text-left">Venue (Venue_ID FK)</th>
                <th className="px-4 py-3 text-left">Budget</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredEvents.map((evt) => {
                const dept = departments.find((d) => d.Dept_ID === evt.Dept_ID);
                const venue = venues.find((v) => v.Venue_ID === evt.Venue_ID);

                return (
                  <tr key={evt.Event_ID} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-blue-700">
                      {evt.Event_ID}
                    </td>
                    <td className="px-4 py-3 font-bold text-slate-900 max-w-[200px] truncate">
                      {evt.Event_Name}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {evt.Event_Type}
                    </td>
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                      {evt.Start_Date} to {evt.End_Date}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      <span className="font-mono text-slate-500 block text-[10px]">{evt.Dept_ID}</span>
                      <span className="truncate max-w-[120px] block">{dept?.Dept_Name?.replace('Department of ', '')}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      <span className="font-mono text-slate-500 block text-[10px]">{evt.Venue_ID}</span>
                      <span className="truncate max-w-[120px] block">{venue?.Venue_Name}</span>
                    </td>
                    <td className="px-4 py-3 font-bold text-emerald-700">
                      Rs. {Number(evt.Budget).toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3">
                      <Badge status={evt.Status} />
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(evt)}
                          className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600 hover:text-blue-600 transition-colors"
                          title="Edit Event"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteEventId(evt.Event_ID)}
                          className="p-1.5 rounded-md hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
                          title="Delete Event"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Event Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingEvent ? `Edit Event: ${editingEvent.Event_ID}` : 'Create New Event'}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Event ID (Primary Key)
              </label>
              <input
                type="text"
                required
                disabled={!!editingEvent}
                value={formData.Event_ID}
                onChange={(e) => setFormData({ ...formData, Event_ID: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-slate-800 disabled:opacity-60"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Event Category
              </label>
              <select
                value={formData.Event_Type}
                onChange={(e) => setFormData({ ...formData, Event_Type: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium"
              >
                {EVENT_CATEGORIES.map(({ type }) => (
                  <option key={type} value={type}>{type}</option>
                ))}
                {editingEvent && LEGACY_EVENT_TYPES.includes(formData.Event_Type) && (
                  <optgroup label="Existing event format">
                    <option value={formData.Event_Type}>{formData.Event_Type}</option>
                  </optgroup>
                )}
              </select>
              <p className="mt-1 text-[10px] text-slate-500">
                {selectedCategory
                  ? `Examples: ${selectedCategory.examples.join(', ')}`
                  : 'Existing event format. You can keep it or choose a category.'}
              </p>
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">
                Event Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. AI & Machine Learning National Bootcamp"
                value={formData.Event_Name}
                onChange={(e) => setFormData({ ...formData, Event_Name: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="event-banner-upload" className="block font-bold text-slate-700 mb-1">
                Event Image {!editingEvent && <span className="text-rose-600">(required)</span>}
              </label>
              <input
                key={editingEvent?.Event_ID || 'new-event'}
                id="event-banner-upload"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                required={!editingEvent && !formData.Banner}
                onChange={handleBannerUpload}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 file:mr-3 file:border-0 file:bg-blue-50 file:px-3 file:py-1 file:rounded-md file:text-xs file:font-bold file:text-blue-800"
              />
              <p className="mt-1 text-[10px] text-slate-500">JPG, PNG, or WebP; maximum 1 MB. The image is shown on the student event pages.</p>
              {bannerError && <p role="alert" className="mt-1 text-[11px] font-semibold text-rose-700">{bannerError}</p>}
              {formData.Banner && (
                <div className="mt-3 max-w-sm overflow-hidden rounded-md border border-slate-200 bg-slate-100">
                  <img src={formData.Banner} alt="Event image preview" className="h-36 w-full object-cover" />
                </div>
              )}
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                required
                value={formData.Start_Date}
                onChange={(e) => setFormData({ ...formData, Start_Date: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                required
                value={formData.End_Date}
                onChange={(e) => setFormData({ ...formData, End_Date: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Department (Dept_ID FK &rarr; DEPARTMENT)
              </label>
              <select
                value={formData.Dept_ID}
                onChange={(e) => setFormData({ ...formData, Dept_ID: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium"
              >
                {departments.map((d) => (
                  <option key={d.Dept_ID} value={d.Dept_ID}>
                    {d.Dept_Name} ({d.Dept_ID})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Venue (Venue_ID FK &rarr; VENUE)
              </label>
              <select
                value={formData.Venue_ID}
                onChange={(e) => setFormData({ ...formData, Venue_ID: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium"
              >
                {venues.map((v) => (
                  <option key={v.Venue_ID} value={v.Venue_ID}>
                    {v.Venue_Name} ({v.Capacity} seats)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Sanctioned Budget (Rs.)
              </label>
              <input
                type="number"
                required
                value={formData.Budget}
                onChange={(e) => setFormData({ ...formData, Budget: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Status
              </label>
              <select
                value={formData.Status}
                onChange={(e) => setFormData({ ...formData, Status: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium"
              >
                <option value="Upcoming">Upcoming</option>
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">
                Detailed Scope / Description
              </label>
              <textarea
                rows={3}
                required
                value={formData.Description}
                onChange={(e) => setFormData({ ...formData, Description: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editingEvent ? 'Save Changes' : 'Create Event'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteEventId}
        onClose={() => setDeleteEventId(null)}
        onConfirm={handleDelete}
        title="Delete Event Record"
        message={`Are you sure you want to delete ${deleteEventId}? This will remove associated registrations and coordinator assignments.`}
      />
    </div>
  );
};

export default EventManagementPage;
