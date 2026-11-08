import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { Users, PlusCircle, Edit2, Trash2, Search, Filter, Mail, Phone, Building2 } from 'lucide-react';

const ParticipantManagementPage = () => {
  const { participants, addParticipant, updateParticipant, deleteParticipant } = useData();
  const { showToast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPart, setEditingPart] = useState(null);
  const [deletePartId, setDeletePartId] = useState(null);

  const initialForm = {
    Participant_ID: `PART-00${participants.length + 1}`,
    Name: '',
    Email: '',
    Phone: '',
    Category: 'Student',
    Institution_Name: 'National Institute of Technology, Tiruchirappalli',
    Branch: 'Computer Applications (MCA)',
    Year_of_Study: '2nd Year',
    Roll_No: ''
  };

  const [formData, setFormData] = useState(initialForm);

  const handleOpenAdd = () => {
    setEditingPart(null);
    setFormData({
      ...initialForm,
      Participant_ID: `PART-00${participants.length + 1}`
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p) => {
    setEditingPart(p);
    setFormData({ ...p });
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (editingPart) {
      updateParticipant(editingPart.Participant_ID, formData);
      showToast(`Participant ${editingPart.Participant_ID} updated!`, 'success');
    } else {
      addParticipant(formData);
      showToast(`Participant ${formData.Participant_ID} registered!`, 'success');
    }
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (deletePartId) {
      deleteParticipant(deletePartId);
      showToast(`Participant ${deletePartId} deleted.`, 'info');
      setDeletePartId(null);
    }
  };

  const filteredParticipants = participants.filter((p) => {
    const matchesSearch =
      p.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.Participant_ID.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.Email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.Institution_Name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || p.Category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-nitt-950">
              Participant Database Management
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Registered students, scholars, external college delegates, and symposium participants
          </p>
        </div>

        <Button
          variant="primary"
          icon={PlusCircle}
          onClick={handleOpenAdd}
        >
          Add Participant
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by name, ID, email, college..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700"
          >
            <option value="ALL">All Categories</option>
            <option value="Student">Internal Student</option>
            <option value="External Student">External Student</option>
            <option value="Research Scholar">Research Scholar</option>
          </select>
        </div>

        <div className="text-xs text-slate-500 font-semibold self-end sm:self-center">
          Showing <span className="text-slate-900 font-bold">{filteredParticipants.length}</span> of {participants.length}
        </div>
      </div>

      {/* Participants Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-xs">
            <thead className="bg-slate-50 font-bold uppercase tracking-wider text-slate-600 text-[10px]">
              <tr>
                <th className="px-4 py-3 text-left">Participant ID (PK)</th>
                <th className="px-4 py-3 text-left">Participant Name</th>
                <th className="px-4 py-3 text-left">Contact Info</th>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-left">Institution Name</th>
                <th className="px-4 py-3 text-left">Branch</th>
                <th className="px-4 py-3 text-left">Year</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredParticipants.map((part) => (
                <tr key={part.Participant_ID} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-blue-700">
                    {part.Participant_ID}
                  </td>
                  <td className="px-4 py-3 font-bold text-slate-900">
                    {part.Name}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    <span className="block text-slate-800">{part.Email}</span>
                    <span className="text-[10px] text-slate-400">{part.Phone}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      part.Category === 'Student'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}>
                      {part.Category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-700 max-w-[200px] truncate">
                    {part.Institution_Name}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {part.Branch}
                  </td>
                  <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                    {part.Year_of_Study}
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(part)}
                        className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600 hover:text-blue-600 transition-colors"
                        title="Edit Participant"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletePartId(part.Participant_ID)}
                        className="p-1.5 rounded-md hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
                        title="Delete Participant"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPart ? `Edit Participant: ${editingPart.Participant_ID}` : 'Add Participant'}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Participant ID (Primary Key)
            </label>
            <input
              type="text"
              required
              disabled={!!editingPart}
              value={formData.Participant_ID}
              onChange={(e) => setFormData({ ...formData, Participant_ID: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-slate-800 disabled:opacity-60"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={formData.Name}
              onChange={(e) => setFormData({ ...formData, Name: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={formData.Email}
                onChange={(e) => setFormData({ ...formData, Email: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                required
                value={formData.Phone}
                onChange={(e) => setFormData({ ...formData, Phone: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Category
            </label>
            <select
              value={formData.Category}
              onChange={(e) => setFormData({ ...formData, Category: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
            >
              <option value="Student">Student (NIT Trichy)</option>
              <option value="External Student">External College Student</option>
              <option value="Research Scholar">Research Scholar</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Institution Name
            </label>
            <input
              type="text"
              required
              value={formData.Institution_Name}
              onChange={(e) => setFormData({ ...formData, Institution_Name: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Branch / Specialization
              </label>
              <input
                type="text"
                required
                value={formData.Branch}
                onChange={(e) => setFormData({ ...formData, Branch: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Year of Study
              </label>
              <input
                type="text"
                required
                value={formData.Year_of_Study}
                onChange={(e) => setFormData({ ...formData, Year_of_Study: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editingPart ? 'Save Changes' : 'Add Participant'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deletePartId}
        onClose={() => setDeletePartId(null)}
        onConfirm={handleDelete}
        title="Delete Participant Record"
        message={`Are you sure you want to delete participant ${deletePartId}?`}
      />
    </div>
  );
};

export default ParticipantManagementPage;
