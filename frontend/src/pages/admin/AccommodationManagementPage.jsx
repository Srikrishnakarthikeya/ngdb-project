import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { ACCOMMODATION_RATE_PER_DAY, getAccommodationDays, getAccommodationFee } from '../../data/accommodationPricing';
import { BedDouble, CheckCircle, XCircle, Edit2, Search, Building } from 'lucide-react';

const AccommodationManagementPage = () => {
  const { accommodations, participants, updateAccommodation, getParticipant } = useData();
  const { showToast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [editingAcc, setEditingAcc] = useState(null);

  const [formData, setFormData] = useState({
    Room_No: '',
    Hostel_Block: 'Garnet-A Hostel',
    Check_in_Date: '',
    Check_out_Date: '',
    Status: 'Approved',
    Notes: ''
  });

  const handleOpenAssign = (acc) => {
    setEditingAcc(acc);
    setFormData({
      Room_No: acc.Room_No === 'Pending Assignment' || acc.Room_No === 'Unassigned' ? 'B-101' : acc.Room_No,
      Hostel_Block: acc.Hostel_Block || 'Garnet-A Hostel',
      Check_in_Date: acc.Check_in_Date,
      Check_out_Date: acc.Check_out_Date,
      Status: 'Approved',
      Notes: acc.Notes || 'Room key to be collected from Warden office.'
    });
  };

  const handleSaveAssignment = (e) => {
    e.preventDefault();
    if (editingAcc) {
      updateAccommodation(editingAcc.Accommodation_ID, formData);
      const amountDue = getAccommodationFee(formData.Check_in_Date, formData.Check_out_Date);
      showToast(`Room assigned. Student payment due: Rs. ${amountDue}.`, 'success');
      setEditingAcc(null);
    }
  };

  const handleQuickStatus = (accId, newStatus) => {
    updateAccommodation(accId, { Status: newStatus });
    showToast(`Accommodation ${accId} status updated to ${newStatus}.`, 'info');
  };

  const filteredAccommodations = accommodations.filter((acc) => {
    const part = getParticipant(acc.Participant_ID);
    const matchesSearch =
      acc.Accommodation_ID.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (part?.Name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (acc.Hostel_Block || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || acc.Status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-nitt-950">
            Hostel Accommodation Control
          </h1>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Assign hostel rooms, review check-in/out dates, and manage delegate boarding across campus hostels
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by ID, Participant, or Hostel..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700"
          >
            <option value="ALL">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Checked In">Checked In</option>
            <option value="Completed">Completed</option>
            <option value="Rejected">Rejected</option>
          </select>
          <div className="text-xs text-slate-500 font-semibold">
            {filteredAccommodations.length} requests
          </div>
        </div>
      </div>

      {/* Accommodation Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-xs">
            <thead className="bg-slate-50 font-bold uppercase tracking-wider text-slate-600 text-[10px]">
              <tr>
                <th className="px-4 py-3 text-left">Accommodation ID (PK)</th>
                <th className="px-4 py-3 text-left">Participant (Participant_ID FK)</th>
                <th className="px-4 py-3 text-left">Hostel Block</th>
                <th className="px-4 py-3 text-left">Assigned Room</th>
                <th className="px-4 py-3 text-left">Check-in Date</th>
                <th className="px-4 py-3 text-left">Check-out Date</th>
                <th className="px-4 py-3 text-left">Fee Due</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredAccommodations.map((acc) => {
                const part = getParticipant(acc.Participant_ID);
                const amountDue = getAccommodationFee(acc.Check_in_Date, acc.Check_out_Date);

                return (
                  <tr key={acc.Accommodation_ID} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3.5 font-mono font-bold text-amber-700">
                      {acc.Accommodation_ID}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-bold text-slate-900 block">{part?.Name || acc.Participant_ID}</span>
                      <span className="text-[10px] text-slate-400">{part?.Institution_Name?.split(',')[0]}</span>
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-slate-800">
                      {acc.Hostel_Block}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`px-2 py-0.5 rounded font-mono font-bold text-xs ${
                        acc.Room_No && acc.Room_No !== 'Pending Assignment' && acc.Room_No !== 'Unassigned'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-500'
                      }`}>
                        {acc.Room_No || 'Pending'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-600 whitespace-nowrap">
                      {acc.Check_in_Date}
                    </td>
                    <td className="px-4 py-3.5 text-slate-600 whitespace-nowrap">
                      {acc.Check_out_Date}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="block font-bold text-slate-900">Rs. {amountDue}</span>
                      <span className="text-[10px] text-slate-500">
                        {getAccommodationDays(acc.Check_in_Date, acc.Check_out_Date)} days × Rs. {ACCOMMODATION_RATE_PER_DAY}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge status={acc.Status} />
                    </td>
                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="outline"
                          size="sm"
                          icon={Edit2}
                          onClick={() => handleOpenAssign(acc)}
                        >
                          Assign Room
                        </Button>
                        {acc.Status === 'Approved' && (
                          <button
                            type="button"
                            onClick={() => handleQuickStatus(acc.Accommodation_ID, 'Checked In')}
                            className="p-1.5 rounded-md hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 transition-colors"
                            title="Mark as Checked In"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        {acc.Status !== 'Rejected' && acc.Status !== 'Completed' && (
                          <button
                            type="button"
                            onClick={() => handleQuickStatus(acc.Accommodation_ID, 'Rejected')}
                            className="p-1.5 rounded-md hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
                            title="Reject Request"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assign Room Modal */}
      {editingAcc && (
        <Modal
          isOpen={!!editingAcc}
          onClose={() => setEditingAcc(null)}
          title={`Assign Room: ${editingAcc.Accommodation_ID}`}
          subtitle={`Participant: ${getParticipant(editingAcc.Participant_ID)?.Name}`}
          maxWidth="max-w-md"
        >
          <form onSubmit={handleSaveAssignment} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Hostel Block
              </label>
              <select
                value={formData.Hostel_Block}
                onChange={(e) => setFormData({ ...formData, Hostel_Block: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
              >
                <option value="Garnet-A Hostel (Boys)">Garnet-A Hostel (Boys)</option>
                <option value="Aquamarine Hostel (Boys)">Aquamarine Hostel (Boys)</option>
                <option value="Opal-B Hostel (Girls)">Opal-B Hostel (Girls)</option>
                <option value="Opal-C Hostel (Girls)">Opal-C Hostel (Girls)</option>
                <option value="Institute Guest House">Institute Guest House</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Assigned Room Number
              </label>
              <input
                type="text"
                required
                placeholder="e.g. B-204"
                value={formData.Room_No}
                onChange={(e) => setFormData({ ...formData, Room_No: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-slate-800"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Check-in Date
                </label>
                <input
                  type="date"
                  required
                  value={formData.Check_in_Date}
                  onChange={(e) => setFormData({ ...formData, Check_in_Date: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Check-out Date
                </label>
                <input
                  type="date"
                  required
                  value={formData.Check_out_Date}
                  onChange={(e) => setFormData({ ...formData, Check_out_Date: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>
            </div>

            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
              <p className="font-bold">Accommodation charge</p>
              <p className="mt-1">
                {getAccommodationDays(formData.Check_in_Date, formData.Check_out_Date)} days × Rs. {ACCOMMODATION_RATE_PER_DAY} = Rs. {getAccommodationFee(formData.Check_in_Date, formData.Check_out_Date)}
              </p>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Booking Status
              </label>
              <select
                value={formData.Status}
                onChange={(e) => setFormData({ ...formData, Status: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
              >
                <option value="Approved">Approved</option>
                <option value="Checked In">Checked In</option>
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setEditingAcc(null)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Save Room Allocation
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default AccommodationManagementPage;
