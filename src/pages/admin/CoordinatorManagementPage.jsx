import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { UserCheck, PlusCircle, Edit2, Trash2, Mail, Phone, BookOpen, Link2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const CoordinatorManagementPage = () => {
  const { coordinators, eventCoordinators, addCoordinator, updateCoordinator, deleteCoordinator } = useData();
  const { showToast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoord, setEditingCoord] = useState(null);
  const [deleteCoordId, setDeleteCoordId] = useState(null);

  const initialForm = {
    Coordinator_ID: `COORD-0${coordinators.length + 1}`,
    Name: '',
    Designation: 'Associate Professor',
    Email: '',
    Contact: '',
    Role: 'Faculty Coordinator',
    Department: 'DEPT-CA',
    Specialization: ''
  };

  const [formData, setFormData] = useState(initialForm);

  const handleOpenAdd = () => {
    setEditingCoord(null);
    setFormData({
      ...initialForm,
      Coordinator_ID: `COORD-0${coordinators.length + 1}`
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c) => {
    setEditingCoord(c);
    setFormData({ ...c });
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (editingCoord) {
      updateCoordinator(editingCoord.Coordinator_ID, formData);
      showToast(`Coordinator ${editingCoord.Coordinator_ID} updated!`, 'success');
    } else {
      addCoordinator(formData);
      showToast(`Coordinator ${formData.Coordinator_ID} created!`, 'success');
    }
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (deleteCoordId) {
      deleteCoordinator(deleteCoordId);
      showToast(`Coordinator ${deleteCoordId} deleted.`, 'info');
      setDeleteCoordId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-nitt-950">
              Faculty Coordinator Management
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Faculty conveners, organizing secretaries, and staff advisors from the Department of Computer Applications
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/event-coordinators"
            className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
          >
            <Link2 className="w-3.5 h-3.5 text-blue-600" />
            <span>Assign to Events</span>
          </Link>
          <Button
            variant="primary"
            icon={PlusCircle}
            onClick={handleOpenAdd}
          >
            Add Coordinator
          </Button>
        </div>
      </div>

      {/* Grid of Coordinators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coordinators.map((coord) => {
          const assignedEventsCount = eventCoordinators.filter((ec) => ec.Coordinator_ID === coord.Coordinator_ID).length;

          return (
            <div
              key={coord.Coordinator_ID}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-teal-800 to-nitt-900 text-white font-bold text-sm flex items-center justify-center shadow-xs">
                      {coord.Name.split(' ')[1]?.[0] || 'DR'}
                    </div>
                    <div>
                      <span className="text-xs font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                        {coord.Coordinator_ID}
                      </span>
                      <h3 className="text-base font-bold text-nitt-950 mt-1 leading-snug">
                        {coord.Name}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">{coord.Designation}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(coord)}
                      className="p-1 rounded hover:bg-slate-100 text-slate-500 hover:text-blue-600 transition-colors"
                      title="Edit Coordinator"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteCoordId(coord.Coordinator_ID)}
                      className="p-1 rounded hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
                      title="Delete Coordinator"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Department Role:</span>
                    <span className="font-bold text-slate-900">{coord.Role}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Email:</span>
                    <span className="font-mono text-slate-700 text-[11px]">{coord.Email}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Contact Phone:</span>
                    <span className="text-slate-700">{coord.Contact}</span>
                  </div>
                  {coord.Specialization && (
                    <div className="pt-1 border-t border-slate-200">
                      <span className="text-slate-500 font-medium block">Specialization:</span>
                      <span className="text-slate-700 text-[11px]">{coord.Specialization}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">
                  Currently Managing: <strong className="text-nitt-950">{assignedEventsCount} event(s)</strong>
                </span>
                <Link
                  to="/admin/event-coordinators"
                  className="text-blue-600 font-bold hover:underline"
                >
                  Manage &rarr;
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Coordinator Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCoord ? `Edit Coordinator: ${editingCoord.Coordinator_ID}` : 'Add Faculty Coordinator'}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Coordinator ID (Primary Key)
            </label>
            <input
              type="text"
              required
              disabled={!!editingCoord}
              value={formData.Coordinator_ID}
              onChange={(e) => setFormData({ ...formData, Coordinator_ID: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-slate-800 disabled:opacity-60"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Faculty / Staff Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Coordinator"
              value={formData.Name}
              onChange={(e) => setFormData({ ...formData, Name: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Designation
              </label>
              <select
                value={formData.Designation}
                onChange={(e) => setFormData({ ...formData, Designation: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
              >
                <option value="Professor">Professor</option>
                <option value="Associate Professor">Associate Professor</option>
                <option value="Assistant Professor">Assistant Professor</option>
                <option value="Professor & Dean">Professor & Dean</option>
                <option value="Staff Advisor">Staff Advisor</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Institutional Role
              </label>
              <input
                type="text"
                required
                placeholder="Faculty Coordinator"
                value={formData.Role}
                onChange={(e) => setFormData({ ...formData, Role: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Official Email
            </label>
            <input
              type="email"
              required
              placeholder="coordinator@example.com"
              value={formData.Email}
              onChange={(e) => setFormData({ ...formData, Email: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Contact Number
            </label>
            <input
              type="text"
              required
              placeholder="+91 9486001122"
              value={formData.Contact}
              onChange={(e) => setFormData({ ...formData, Contact: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Research Specialization
            </label>
            <input
              type="text"
              placeholder="e.g. Machine Learning, Intelligent Systems"
              value={formData.Specialization}
              onChange={(e) => setFormData({ ...formData, Specialization: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editingCoord ? 'Save Changes' : 'Add Coordinator'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deleteCoordId}
        onClose={() => setDeleteCoordId(null)}
        onConfirm={handleDelete}
        title="Delete Coordinator"
        message={`Are you sure you want to remove coordinator ${deleteCoordId}?`}
      />
    </div>
  );
};

export default CoordinatorManagementPage;
