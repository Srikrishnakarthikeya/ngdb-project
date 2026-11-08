import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { UtensilsCrossed, PlusCircle, Edit2, Trash2, Bus, Calendar, User } from 'lucide-react';

const HospitalityManagementPage = () => {
  const { hospitality, events, participants, addHospitality, updateHospitality, deleteHospitality, getEvent, getParticipant } = useData();
  const { showToast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHosp, setEditingHosp] = useState(null);
  const [deleteHospId, setDeleteHospId] = useState(null);

  const initialForm = {
    Hospitality_ID: `HOSP-0${hospitality.length + 1}`,
    Participant_ID: participants[0]?.Participant_ID || 'PART-001',
    Event_ID: events[0]?.Event_ID || 'EVT-101',
    Meal_Type: 'Breakfast + Working Lunch + High Tea',
    Date: new Date().toISOString().split('T')[0],
    Transport_Provided: 'Campus Shuttle Bus (Hostel to Venue)'
  };

  const [formData, setFormData] = useState(initialForm);

  const handleOpenAdd = () => {
    setEditingHosp(null);
    setFormData({
      ...initialForm,
      Hospitality_ID: `HOSP-0${hospitality.length + 1}`
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (h) => {
    setEditingHosp(h);
    setFormData({ ...h });
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (editingHosp) {
      updateHospitality(editingHosp.Hospitality_ID, formData);
      showToast(`Hospitality arrangement ${editingHosp.Hospitality_ID} updated!`, 'success');
    } else {
      addHospitality(formData);
      showToast(`Hospitality pass ${formData.Hospitality_ID} created!`, 'success');
    }
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (deleteHospId) {
      deleteHospitality(deleteHospId);
      showToast(`Hospitality record ${deleteHospId} deleted.`, 'info');
      setDeleteHospId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-nitt-950">
              Hospitality & Transit Logistics
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage delegate dining passes, banquet catering, campus shuttles, and station transit
          </p>
        </div>

        <Button
          variant="primary"
          icon={PlusCircle}
          onClick={handleOpenAdd}
        >
          Issue Hospitality Pass
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-xs">
            <thead className="bg-slate-50 font-bold uppercase tracking-wider text-slate-600 text-[10px]">
              <tr>
                <th className="px-4 py-3 text-left">Hospitality ID (PK)</th>
                <th className="px-4 py-3 text-left">Participant (Participant_ID FK)</th>
                <th className="px-4 py-3 text-left">Event (Event_ID FK)</th>
                <th className="px-4 py-3 text-left">Meal Arrangement</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Transport Logistics</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {hospitality.map((hosp) => {
                const part = getParticipant(hosp.Participant_ID);
                const evt = getEvent(hosp.Event_ID);

                return (
                  <tr key={hosp.Hospitality_ID} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3.5 font-mono font-bold text-orange-700">
                      {hosp.Hospitality_ID}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-bold text-slate-900 block">{part?.Name || hosp.Participant_ID}</span>
                      <span className="text-[10px] text-slate-400">{part?.Institution_Name?.split(',')[0]}</span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-800 max-w-[180px] truncate">
                      <span className="font-bold block truncate">{evt?.Event_Name || hosp.Event_ID}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{hosp.Event_ID}</span>
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-slate-900">
                      {hosp.Meal_Type}
                    </td>
                    <td className="px-4 py-3.5 text-slate-600 whitespace-nowrap">
                      {hosp.Date}
                    </td>
                    <td className="px-4 py-3.5 text-blue-700 font-semibold flex items-center gap-1.5 pt-4">
                      <Bus className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                      <span className="truncate max-w-[200px]">{hosp.Transport_Provided}</span>
                    </td>
                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(hosp)}
                          className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600 hover:text-blue-600 transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteHospId(hosp.Hospitality_ID)}
                          className="p-1.5 rounded-md hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
                          title="Delete"
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

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingHosp ? `Edit Hospitality: ${editingHosp.Hospitality_ID}` : 'Issue Hospitality Pass'}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Hospitality ID (Primary Key)
            </label>
            <input
              type="text"
              required
              disabled={!!editingHosp}
              value={formData.Hospitality_ID}
              onChange={(e) => setFormData({ ...formData, Hospitality_ID: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-slate-800 disabled:opacity-60"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Select Participant (Participant_ID FK)
            </label>
            <select
              value={formData.Participant_ID}
              onChange={(e) => setFormData({ ...formData, Participant_ID: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
            >
              {participants.map((p) => (
                <option key={p.Participant_ID} value={p.Participant_ID}>
                  {p.Name} ({p.Participant_ID}) - {p.Institution_Name?.split(',')[0]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Select Event (Event_ID FK)
            </label>
            <select
              value={formData.Event_ID}
              onChange={(e) => setFormData({ ...formData, Event_ID: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
            >
              {events.map((e) => (
                <option key={e.Event_ID} value={e.Event_ID}>
                  {e.Event_Name} ({e.Event_ID})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Meal Arrangement Type
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Breakfast + High Tea + Buffet Luncheon"
              value={formData.Meal_Type}
              onChange={(e) => setFormData({ ...formData, Meal_Type: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Pass Date
            </label>
            <input
              type="date"
              required
              value={formData.Date}
              onChange={(e) => setFormData({ ...formData, Date: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Transport Logistics
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Campus Shuttle / Railway Station Cab Pickup"
              value={formData.Transport_Provided}
              onChange={(e) => setFormData({ ...formData, Transport_Provided: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editingHosp ? 'Save Changes' : 'Issue Pass'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deleteHospId}
        onClose={() => setDeleteHospId(null)}
        onConfirm={handleDelete}
        title="Delete Hospitality Pass"
        message={`Are you sure you want to remove pass ${deleteHospId}?`}
      />
    </div>
  );
};

export default HospitalityManagementPage;
