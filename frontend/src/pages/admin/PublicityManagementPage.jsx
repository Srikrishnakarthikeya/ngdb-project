import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { Megaphone, PlusCircle, Edit2, Trash2, Calendar, TrendingUp, ExternalLink, Globe } from 'lucide-react';

const PublicityManagementPage = () => {
  const { publicity, events, addPublicity, updatePublicity, deletePublicity, getEvent } = useData();
  const { showToast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPub, setEditingPub] = useState(null);
  const [deletePubId, setDeletePubId] = useState(null);

  const initialForm = {
    Ad_ID: `PUB-0${publicity.length + 1}`,
    Event_ID: events[0]?.Event_ID || 'EVT-101',
    Medium: 'Website',
    Publish_Date: new Date().toISOString().split('T')[0],
    Reach_Count: 5000,
    Content_Link: 'https://nitt.edu/events/notice'
  };

  const [formData, setFormData] = useState(initialForm);

  const totalReach = publicity.reduce((acc, curr) => acc + (Number(curr.Reach_Count) || 0), 0);

  const handleOpenAdd = () => {
    setEditingPub(null);
    setFormData({
      ...initialForm,
      Ad_ID: `PUB-0${publicity.length + 1}`,
      Event_ID: events[0]?.Event_ID || 'EVT-101'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p) => {
    setEditingPub(p);
    setFormData({ ...p });
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (editingPub) {
      updatePublicity(editingPub.Ad_ID, formData);
      showToast(`Publicity Campaign ${editingPub.Ad_ID} updated!`, 'success');
    } else {
      addPublicity(formData);
      showToast(`Publicity Campaign ${formData.Ad_ID} created!`, 'success');
    }
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (deletePubId) {
      deletePublicity(deletePubId);
      showToast(`Campaign ${deletePubId} deleted.`, 'info');
      setDeletePubId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-nitt-950">
              Publicity & Campaign Management
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Track media outreach across Instagram, college circulars, website banners, and posters
          </p>
        </div>

        <Button
          variant="primary"
          icon={PlusCircle}
          onClick={handleOpenAdd}
        >
          New Publicity Campaign
        </Button>
      </div>

      {/* KPI Reach Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-indigo-950 to-nitt-950 p-6 rounded-2xl text-white shadow-md border border-purple-800/60 flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-purple-300 uppercase tracking-wider block">
            Aggregated Campaign Reach
          </span>
          <p className="text-3xl font-extrabold text-white mt-1">
            {totalReach.toLocaleString('en-IN')} Impressions
          </p>
          <span className="text-xs text-purple-200 mt-1 block">
            Across {publicity.length} active marketing and outreach channels
          </span>
        </div>
        <div className="p-4 bg-purple-800/40 rounded-2xl border border-purple-700">
          <TrendingUp className="w-10 h-10 text-purple-300" />
        </div>
      </div>

      {/* Publicity Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-xs">
            <thead className="bg-slate-50 font-bold uppercase tracking-wider text-slate-600 text-[10px]">
              <tr>
                <th className="px-4 py-3 text-left">Ad ID (PK)</th>
                <th className="px-4 py-3 text-left">Event (Event_ID FK)</th>
                <th className="px-4 py-3 text-left">Medium</th>
                <th className="px-4 py-3 text-left">Publish Date</th>
                <th className="px-4 py-3 text-left">Reach Count (Views)</th>
                <th className="px-4 py-3 text-left">Content Link</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {publicity.map((pub) => {
                const evt = getEvent(pub.Event_ID);

                return (
                  <tr key={pub.Ad_ID} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3.5 font-mono font-bold text-purple-700">
                      {pub.Ad_ID}
                    </td>
                    <td className="px-4 py-3.5 font-bold text-slate-900 max-w-[200px] truncate">
                      <span className="block truncate">{evt?.Event_Name || pub.Event_ID}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{pub.Event_ID}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-800 border border-indigo-200">
                        {pub.Medium}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-600 whitespace-nowrap">
                      {pub.Publish_Date}
                    </td>
                    <td className="px-4 py-3.5 font-extrabold text-slate-900 text-sm">
                      {Number(pub.Reach_Count).toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3.5 text-blue-600 max-w-[200px] truncate">
                      <a
                        href={pub.Content_Link}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:underline flex items-center gap-1 font-mono text-[11px]"
                      >
                        <span className="truncate">{pub.Content_Link}</span>
                        <ExternalLink className="w-3 h-3 flex-shrink-0" />
                      </a>
                    </td>
                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(pub)}
                          className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600 hover:text-blue-600 transition-colors"
                          title="Edit Campaign"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletePubId(pub.Ad_ID)}
                          className="p-1.5 rounded-md hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
                          title="Delete Campaign"
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
        title={editingPub ? `Edit Campaign: ${editingPub.Ad_ID}` : 'New Publicity Campaign'}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Ad ID (Primary Key)
            </label>
            <input
              type="text"
              required
              disabled={!!editingPub}
              value={formData.Ad_ID}
              onChange={(e) => setFormData({ ...formData, Ad_ID: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-slate-800 disabled:opacity-60"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Select Event (Event_ID FK &rarr; EVENT)
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
              Advertising Medium
            </label>
            <select
              value={formData.Medium}
              onChange={(e) => setFormData({ ...formData, Medium: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
            >
              <option value="Website">Institute Website Notice</option>
              <option value="Instagram">Instagram Campaign</option>
              <option value="Email">Campus Email Circular</option>
              <option value="Posters">Campus Physical Posters</option>
              <option value="Social Media">LinkedIn / Twitter / Telegram</option>
              <option value="Other">Other Outreach Channel</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Publish Date
              </label>
              <input
                type="date"
                required
                value={formData.Publish_Date}
                onChange={(e) => setFormData({ ...formData, Publish_Date: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Reach Count (Views)
              </label>
              <input
                type="number"
                required
                value={formData.Reach_Count}
                onChange={(e) => setFormData({ ...formData, Reach_Count: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Content Link / Social URL
            </label>
            <input
              type="url"
              required
              value={formData.Content_Link}
              onChange={(e) => setFormData({ ...formData, Content_Link: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editingPub ? 'Save Changes' : 'Create Campaign'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deletePubId}
        onClose={() => setDeletePubId(null)}
        onConfirm={handleDelete}
        title="Delete Campaign"
        message={`Are you sure you want to delete campaign ${deletePubId}?`}
      />
    </div>
  );
};

export default PublicityManagementPage;
