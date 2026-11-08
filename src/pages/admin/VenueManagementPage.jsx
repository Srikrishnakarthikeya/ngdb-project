import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { MapPin, PlusCircle, Edit2, Trash2, Users, Calendar, CheckCircle2, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const VenueManagementPage = () => {
  const { venues, events, addVenue, updateVenue, deleteVenue } = useData();
  const { showToast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVenue, setEditingVenue] = useState(null);
  const [deleteVenueId, setDeleteVenueId] = useState(null);

  const initialForm = {
    Venue_ID: `VEN-0${venues.length + 1}`,
    Venue_Name: '',
    Location: '',
    Capacity: 150,
    Venue_Type: 'Seminar Hall',
    Facilities: 'Projector, Sound System, Air Conditioning'
  };

  const [formData, setFormData] = useState(initialForm);

  const handleOpenAdd = () => {
    setEditingVenue(null);
    setFormData({
      ...initialForm,
      Venue_ID: `VEN-0${venues.length + 1}`
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (v) => {
    setEditingVenue(v);
    setFormData({ ...v });
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (editingVenue) {
      updateVenue(editingVenue.Venue_ID, formData);
      showToast(`Venue ${editingVenue.Venue_ID} updated!`, 'success');
    } else {
      addVenue(formData);
      showToast(`Venue ${formData.Venue_ID} added!`, 'success');
    }
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (deleteVenueId) {
      deleteVenue(deleteVenueId);
      showToast(`Venue ${deleteVenueId} deleted.`, 'info');
      setDeleteVenueId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-nitt-950">
              Campus Venue & Infrastructure Management
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Auditoriums, seminar halls, high-performance computing labs, and booking schedules
          </p>
        </div>

        <Button
          variant="primary"
          icon={PlusCircle}
          onClick={handleOpenAdd}
        >
          Add Campus Venue
        </Button>
      </div>

      {/* Venues Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {venues.map((venue) => {
          const bookedEvents = events.filter((e) => e.Venue_ID === venue.Venue_ID);
          const isOccupied = bookedEvents.some((e) => e.Status === 'Active' || e.Status === 'Upcoming');

          return (
            <div
              key={venue.Venue_ID}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-mono font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                        {venue.Venue_ID}
                      </span>
                      <h3 className="text-base font-bold text-nitt-950 mt-1">
                        {venue.Venue_Name}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(venue)}
                      className="p-1 rounded hover:bg-slate-100 text-slate-500 hover:text-blue-600 transition-colors"
                      title="Edit Venue"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteVenueId(venue.Venue_ID)}
                      className="p-1 rounded hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
                      title="Delete Venue"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Type:</span>
                    <span className="font-semibold text-slate-800">{venue.Venue_Type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Seating Capacity:</span>
                    <span className="font-bold text-slate-900">{venue.Capacity} Seats</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Campus Location:</span>
                    <span className="text-slate-700 truncate max-w-[150px]">{venue.Location}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-200">
                    <span className="text-slate-500 font-medium">Availability:</span>
                    <span className={`font-bold flex items-center gap-1 ${isOccupied ? 'text-amber-600' : 'text-emerald-600'}`}>
                      {isOccupied ? <Clock className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                      <span>{isOccupied ? 'Booked for Events' : 'Available'}</span>
                    </span>
                  </div>
                </div>

                {venue.Facilities && (
                  <p className="text-[11px] text-slate-500 leading-tight">
                    <strong className="text-slate-700">Facilities: </strong>{venue.Facilities}
                  </p>
                )}
              </div>

              {/* Booked Events in this venue */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-rose-600" />
                    <span>Booked Events ({bookedEvents.length})</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">EVENT &rarr; HELD_AT</span>
                </div>

                <div className="space-y-1 max-h-28 overflow-y-auto">
                  {bookedEvents.length === 0 ? (
                    <p className="text-[11px] text-slate-400 italic">No events booked in this venue.</p>
                  ) : (
                    bookedEvents.map((evt) => (
                      <Link
                        key={evt.Event_ID}
                        to={`/events/${evt.Event_ID}`}
                        className="p-1.5 rounded bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-between text-[11px] transition-colors"
                      >
                        <span className="font-medium text-slate-800 truncate max-w-[160px]">{evt.Event_Name}</span>
                        <span className="text-slate-500 text-[10px]">{evt.Start_Date}</span>
                      </Link>
                    ))
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingVenue ? `Edit Venue: ${editingVenue.Venue_ID}` : 'Add Campus Venue'}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Venue ID (Primary Key)
            </label>
            <input
              type="text"
              required
              disabled={!!editingVenue}
              value={formData.Venue_ID}
              onChange={(e) => setFormData({ ...formData, Venue_ID: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-slate-800 disabled:opacity-60"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Venue Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Barn Hall Auditorium"
              value={formData.Venue_Name}
              onChange={(e) => setFormData({ ...formData, Venue_Name: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Campus Location & Zone
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Administrative Quadrangle, Central Zone"
              value={formData.Location}
              onChange={(e) => setFormData({ ...formData, Location: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Seating Capacity
              </label>
              <input
                type="number"
                required
                value={formData.Capacity}
                onChange={(e) => setFormData({ ...formData, Capacity: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Venue Type
              </label>
              <select
                value={formData.Venue_Type}
                onChange={(e) => setFormData({ ...formData, Venue_Type: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
              >
                <option value="Auditorium">Auditorium</option>
                <option value="Mega Auditorium">Mega Auditorium</option>
                <option value="Seminar Hall">Seminar Hall</option>
                <option value="Computer Lab">Computer Lab</option>
                <option value="Conference Hall">Conference Hall</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Equipped Facilities
            </label>
            <textarea
              rows={2}
              value={formData.Facilities}
              onChange={(e) => setFormData({ ...formData, Facilities: e.target.value })}
              placeholder="e.g. 4K Laser Projector, Surround Audio, Central AC"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editingVenue ? 'Save Changes' : 'Add Venue'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deleteVenueId}
        onClose={() => setDeleteVenueId(null)}
        onConfirm={handleDelete}
        title="Delete Venue"
        message={`Are you sure you want to delete ${deleteVenueId}?`}
      />
    </div>
  );
};

export default VenueManagementPage;
