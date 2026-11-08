import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { DollarSign, PlusCircle, Edit2, Trash2, Calendar, Phone, Award, Building } from 'lucide-react';

const SponsorManagementPage = () => {
  const { sponsors, events, addSponsor, updateSponsor, deleteSponsor, getEvent } = useData();
  const { showToast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSpon, setEditingSpon] = useState(null);
  const [deleteSponId, setDeleteSponId] = useState(null);

  const initialForm = {
    Sponsor_ID: `SPON-0${sponsors.length + 1}`,
    Sponsor_Name: '',
    Contact: '',
    Amount_Contributed: 50000,
    Event_ID: events[0]?.Event_ID || 'EVT-101',
    Tier: 'Associate Sponsor'
  };

  const [formData, setFormData] = useState(initialForm);

  const totalSponsorship = sponsors.reduce(
    (acc, curr) => acc + (Number(curr.Amount_Contributed) || 0),
    0
  );

  const handleOpenAdd = () => {
    setEditingSpon(null);
    setFormData({
      ...initialForm,
      Sponsor_ID: `SPON-0${sponsors.length + 1}`,
      Event_ID: events[0]?.Event_ID || 'EVT-101'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (s) => {
    setEditingSpon(s);
    setFormData({ ...s });
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (editingSpon) {
      updateSponsor(editingSpon.Sponsor_ID, formData);
      showToast(`Sponsor ${editingSpon.Sponsor_ID} updated!`, 'success');
    } else {
      addSponsor(formData);
      showToast(`Sponsor ${formData.Sponsor_ID} added!`, 'success');
    }
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (deleteSponId) {
      deleteSponsor(deleteSponId);
      showToast(`Sponsor ${deleteSponId} removed.`, 'info');
      setDeleteSponId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-nitt-950">
              Sponsor & Corporate Partnership Management
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Industry sponsors, knowledge partners, and corporate funding for CA department symposiums
          </p>
        </div>

        <Button
          variant="primary"
          icon={PlusCircle}
          onClick={handleOpenAdd}
        >
          Add Corporate Sponsor
        </Button>
      </div>

      {/* KPI Overview Banner */}
      <div className="bg-gradient-to-r from-emerald-900 to-teal-950 p-6 rounded-2xl text-white shadow-md border border-emerald-800 flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider block">
            Total Sponsorship Funds Collected
          </span>
          <p className="text-3xl font-extrabold text-white mt-1">
            Rs. {totalSponsorship.toLocaleString('en-IN')}
          </p>
          <span className="text-xs text-emerald-200 mt-1 block">
            Contributed across {sponsors.length} active corporate partners
          </span>
        </div>
        <div className="p-4 bg-emerald-800/50 rounded-2xl border border-emerald-700">
          <DollarSign className="w-10 h-10 text-emerald-300" />
        </div>
      </div>

      {/* Sponsors Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-xs">
            <thead className="bg-slate-50 font-bold uppercase tracking-wider text-slate-600 text-[10px]">
              <tr>
                <th className="px-4 py-3 text-left">Sponsor ID (PK)</th>
                <th className="px-4 py-3 text-left">Sponsor Organization</th>
                <th className="px-4 py-3 text-left">Partnership Tier</th>
                <th className="px-4 py-3 text-left">Sponsored Event (Event_ID FK)</th>
                <th className="px-4 py-3 text-left">Amount Contributed</th>
                <th className="px-4 py-3 text-left">Contact Info</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {sponsors.map((spon) => {
                const evt = getEvent(spon.Event_ID);

                return (
                  <tr key={spon.Sponsor_ID} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3.5 font-mono font-bold text-emerald-700">
                      {spon.Sponsor_ID}
                    </td>
                    <td className="px-4 py-3.5 font-bold text-slate-900">
                      {spon.Sponsor_Name}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                        {spon.Tier || 'Associate Partner'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-700 max-w-[200px] truncate">
                      <span className="font-bold block truncate">{evt?.Event_Name || spon.Event_ID}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{spon.Event_ID}</span>
                    </td>
                    <td className="px-4 py-3.5 font-extrabold text-emerald-700 text-sm">
                      Rs. {Number(spon.Amount_Contributed).toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3.5 text-slate-600">
                      {spon.Contact}
                    </td>
                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(spon)}
                          className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600 hover:text-blue-600 transition-colors"
                          title="Edit Sponsor"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteSponId(spon.Sponsor_ID)}
                          className="p-1.5 rounded-md hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
                          title="Delete Sponsor"
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
        title={editingSpon ? `Edit Sponsor: ${editingSpon.Sponsor_ID}` : 'Add Corporate Sponsor'}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Sponsor ID (Primary Key)
            </label>
            <input
              type="text"
              required
              disabled={!!editingSpon}
              value={formData.Sponsor_ID}
              onChange={(e) => setFormData({ ...formData, Sponsor_ID: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-slate-800 disabled:opacity-60"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Sponsor Name / Organization
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Tata Consultancy Services (TCS)"
              value={formData.Sponsor_Name}
              onChange={(e) => setFormData({ ...formData, Sponsor_Name: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Associated Event (Event_ID FK &rarr; EVENT)
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

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Amount Contributed (Rs.)
              </label>
              <input
                type="number"
                required
                value={formData.Amount_Contributed}
                onChange={(e) => setFormData({ ...formData, Amount_Contributed: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Sponsorship Tier
              </label>
              <select
                value={formData.Tier}
                onChange={(e) => setFormData({ ...formData, Tier: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
              >
                <option value="Platinum Title Sponsor">Platinum Title Sponsor</option>
                <option value="Gold Partner">Gold Partner</option>
                <option value="Silver Sponsor">Silver Sponsor</option>
                <option value="Associate Sponsor">Associate Sponsor</option>
                <option value="Knowledge Partner">Knowledge Partner</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Contact Number / Corporate Email
            </label>
            <input
              type="text"
              required
              placeholder="+91 80 67890000"
              value={formData.Contact}
              onChange={(e) => setFormData({ ...formData, Contact: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editingSpon ? 'Save Changes' : 'Add Sponsor'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deleteSponId}
        onClose={() => setDeleteSponId(null)}
        onConfirm={handleDelete}
        title="Remove Sponsor"
        message={`Are you sure you want to remove sponsor ${deleteSponId}?`}
      />
    </div>
  );
};

export default SponsorManagementPage;
