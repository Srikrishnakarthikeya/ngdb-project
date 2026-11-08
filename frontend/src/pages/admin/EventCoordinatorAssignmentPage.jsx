import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { Link2, PlusCircle, Trash2, Calendar, UserCheck, Shield } from 'lucide-react';

const EventCoordinatorAssignmentPage = () => {
  const {
    events,
    coordinators,
    eventCoordinators,
    assignEventCoordinator,
    removeEventCoordinator,
    getEvent,
    getCoordinator
  } = useData();
  const { showToast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(events[0]?.Event_ID || '');
  const [selectedCoordinatorId, setSelectedCoordinatorId] = useState(coordinators[0]?.Coordinator_ID || '');
  const [assignedRole, setAssignedRole] = useState('Chief Organizing Secretary');
  const [removeTarget, setRemoveTarget] = useState(null);
  const [coordinatorSearch, setCoordinatorSearch] = useState('');

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!selectedEventId || !selectedCoordinatorId) {
      showToast('Please select both an event and a coordinator.', 'error');
      return;
    }

    try {
      await assignEventCoordinator({
        Event_ID: selectedEventId,
        Coordinator_ID: selectedCoordinatorId,
        Assigned_Role: assignedRole
      });
      showToast('Coordinator assigned to event successfully!', 'success');
      setIsModalOpen(false);
      setCoordinatorSearch('');
    } catch (error) { showToast(error.message || 'Unable to assign coordinator.', 'error'); }
  };

  const handleRemove = () => {
    if (removeTarget) {
      removeEventCoordinator(removeTarget.Event_ID, removeTarget.Coordinator_ID);
      showToast('Assignment removed.', 'info');
      setRemoveTarget(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-nitt-950">Event Coordinator Assignments</h1>
          <p className="text-xs text-slate-500 mt-1">
            Assign faculty members to events and define their responsibilities.
          </p>
        </div>
        <Button variant="primary" icon={PlusCircle} onClick={() => setIsModalOpen(true)}>
          Assign Coordinator to Event
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-xs">
            <thead className="bg-slate-50 font-bold uppercase tracking-wider text-slate-600 text-[10px]">
              <tr>
                <th className="px-4 py-3 text-left">Event ID</th>
                <th className="px-4 py-3 text-left">Event Name</th>
                <th className="px-4 py-3 text-left">Coordinator ID</th>
                <th className="px-4 py-3 text-left">Faculty Coordinator</th>
                <th className="px-4 py-3 text-left">Assigned Role</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {eventCoordinators.map((assignment, index) => {
                const event = getEvent(assignment.Event_ID);
                const coordinator = getCoordinator(assignment.Coordinator_ID);

                return (
                  <tr key={`${assignment.Event_ID}-${assignment.Coordinator_ID}-${index}`} className="hover:bg-slate-50">
                    <td className="px-4 py-3.5 font-mono font-bold text-blue-700">{assignment.Event_ID}</td>
                    <td className="px-4 py-3.5 font-bold text-slate-900 max-w-[200px] truncate">{event?.Event_Name || 'Unknown Event'}</td>
                    <td className="px-4 py-3.5 font-mono font-bold text-teal-700">{assignment.Coordinator_ID}</td>
                    <td className="px-4 py-3.5 text-slate-800">
                      <span className="font-bold block">{coordinator?.Name || 'Unknown'}</span>
                      <span className="text-[10px] text-slate-400">{coordinator?.Designation}</span>
                    </td>
                    <td className="px-4 py-3.5">{assignment.Assigned_Role}</td>
                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => setRemoveTarget({ Event_ID: assignment.Event_ID, Coordinator_ID: assignment.Coordinator_ID })}
                        className="p-1.5 rounded-md hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
                        title="Remove Assignment"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Assign Coordinator to Event"
        subtitle="Assign a faculty convener and responsibility for this event."
        maxWidth="max-w-md"
      >
        <form onSubmit={handleAssign} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Select Event</label>
            <select value={selectedEventId} onChange={(e) => setSelectedEventId(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800">
              {events.map((event) => <option key={event.Event_ID} value={event.Event_ID}>{event.Event_Name} ({event.Event_ID})</option>)}
            </select>
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Search and Select Coordinator</label>
            <input type="text" value={coordinatorSearch} onChange={(e) => setCoordinatorSearch(e.target.value)} placeholder="Search by name, email, username or ID" className="mb-2 w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800" />
            <select value={selectedCoordinatorId} onChange={(e) => setSelectedCoordinatorId(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800">
              {coordinators.filter((coordinator) => {
                const query = coordinatorSearch.trim().toLowerCase();
                return !query || [coordinator.Name, coordinator.Email, coordinator.UserName, coordinator.Coordinator_ID].some((value) => String(value || '').toLowerCase().includes(query));
              }).map((coordinator) => <option key={coordinator.Coordinator_ID} value={coordinator.Coordinator_ID}>{coordinator.Name} ({coordinator.Coordinator_ID}) - {coordinator.Email}</option>)}
            </select>
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Assigned Role in Event</label>
            <input type="text" required value={assignedRole} onChange={(e) => setAssignedRole(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800" />
          </div>
          <div className="pt-3 border-t border-slate-100 flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button variant="primary" type="submit">Assign Coordinator</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!removeTarget}
        onClose={() => setRemoveTarget(null)}
        onConfirm={handleRemove}
        title="Remove Coordinator Assignment"
        message={`Remove assignment between Event ${removeTarget?.Event_ID} and Coordinator ${removeTarget?.Coordinator_ID}?`}
      />
    </div>
  );
};

export default EventCoordinatorAssignmentPage;
