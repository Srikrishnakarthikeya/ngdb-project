import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import EmptyState from '../../components/common/EmptyState';
import { ACCOMMODATION_RATE_PER_DAY, getAccommodationDays, getAccommodationFee } from '../../data/accommodationPricing';
import {
  BedDouble,
  Calendar,
  Clock,
  PlusCircle,
  Info,
  Wallet
} from 'lucide-react';

const StudentAccommodationPage = () => {
  const { currentUser } = useAuth();
  const { accommodations, requestAccommodation, payForAccommodation, getWalletBalance } = useData();
  const { showToast } = useToast();

  const studentId = currentUser?.id || 'PART-001';
  const myAccommodations = accommodations.filter((a) => a.Participant_ID === studentId);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    Hostel_Block: 'Garnet Hostel (Boys)',
    Check_in_Date: '2026-10-14',
    Check_out_Date: '2026-10-18',
    Notes: 'Requesting room allocation for AI Bootcamp duration.'
  });

  const handleCreateRequest = (e) => {
    e.preventDefault();
    if (getAccommodationDays(formData.Check_in_Date, formData.Check_out_Date) <= 0) {
      showToast('Check-out date must be after check-in date.', 'error');
      return;
    }

    const newAcc = requestAccommodation({
      Participant_ID: studentId,
      ...formData
    });
    setIsModalOpen(false);
    showToast(`Accommodation request submitted! ID: ${newAcc.Accommodation_ID}`, 'success');
  };

  const handlePayAccommodation = (accommodationId) => {
    const result = payForAccommodation(accommodationId, studentId);
    if (!result.success) {
      showToast(result.error, 'error');
      return;
    }
    showToast(`Accommodation payment of Rs. ${result.amount} paid from wallet.`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-nitt-950">
              Hostel Accommodation Management
            </h1>
            {/* <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded font-mono">
              ACCOMMODATION
            </span> */}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Hostel boarding requests, room numbers, and check-in logistics for NIT Trichy events
          </p>
        </div>

        <Button
          variant="primary"
          icon={PlusCircle}
          onClick={() => setIsModalOpen(true)}
        >
          Request Accommodation
        </Button>
      </div>

      {/* Guidelines Card */}
      <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold">NIT Trichy Hostel Allocation Guidelines:</p>
          <p className="text-amber-800 leading-relaxed text-[11px]">
            Rooms are allocated in Garnet / Aquamarine hostels for male participants, and Opal hostels for female participants. Outstation delegates receive complimentary mattress and linen kits upon physical check-in at the Hostel Warden Office.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-4 text-xs">
        <span className="font-semibold text-slate-600">Accommodation rate: Rs. {ACCOMMODATION_RATE_PER_DAY} per day</span>
        <span className="font-bold text-slate-900 flex items-center gap-1.5">
          <Wallet className="w-4 h-4 text-blue-700" /> Wallet: Rs. {getWalletBalance(studentId).toLocaleString('en-IN')}
        </span>
      </div>

      {/* Accommodation Requests Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {myAccommodations.length === 0 ? (
          <EmptyState
            icon={BedDouble}
            title="No accommodation requests"
            description="You have not requested hostel boarding for any upcoming events. Click the button above to request a room."
            actionLabel="Request Room"
            onAction={() => setIsModalOpen(true)}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-xs">
              <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-4 py-3 text-left">Accommodation ID</th>
                  <th className="px-4 py-3 text-left">Hostel Block</th>
                  <th className="px-4 py-3 text-left">Room Number</th>
                  <th className="px-4 py-3 text-left">Check-in Date</th>
                  <th className="px-4 py-3 text-left">Check-out Date</th>
                  <th className="px-4 py-3 text-left">Fee / Payment</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Notes / Instructions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {myAccommodations.map((acc) => {
                  const days = getAccommodationDays(acc.Check_in_Date, acc.Check_out_Date);
                  const fee = getAccommodationFee(acc.Check_in_Date, acc.Check_out_Date);
                  const roomAssigned = acc.Status === 'Approved' && acc.Room_No && !['Pending Assignment', 'Unassigned'].includes(acc.Room_No);

                  return (
                  <tr key={acc.Accommodation_ID} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3.5 font-mono font-bold text-amber-700">
                      {acc.Accommodation_ID}
                    </td>
                    <td className="px-4 py-3.5 font-bold text-slate-900">
                      {acc.Hostel_Block}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`px-2 py-0.5 rounded font-mono font-bold text-xs ${
                        acc.Room_No && acc.Room_No !== 'Unassigned' && acc.Room_No !== 'Pending Assignment'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-500'
                      }`}>
                        {acc.Room_No || 'Pending Assignment'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-600 whitespace-nowrap">
                      {acc.Check_in_Date}
                    </td>
                    <td className="px-4 py-3.5 text-slate-600 whitespace-nowrap">
                      {acc.Check_out_Date}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="block font-bold text-slate-900">Rs. {fee}</span>
                      <span className="block text-[10px] text-slate-500">{days} days × Rs. {ACCOMMODATION_RATE_PER_DAY}</span>
                      {acc.Payment_Status === 'Confirmed' ? (
                        <span className="block mt-1 text-[10px] font-bold text-emerald-700">Paid</span>
                      ) : roomAssigned ? (
                        <button
                          type="button"
                          onClick={() => handlePayAccommodation(acc.Accommodation_ID)}
                          disabled={fee <= 0 || getWalletBalance(studentId) < fee}
                          className="mt-1 inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 hover:text-blue-900 disabled:cursor-not-allowed disabled:text-slate-400"
                        >
                          <Wallet className="w-3 h-3" /> Pay from wallet
                        </button>
                      ) : (
                        <span className="block mt-1 text-[10px] text-slate-500">Pay after room assignment</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge status={acc.Status} />
                    </td>
                    <td className="px-4 py-3.5 text-slate-500 text-[11px] max-w-xs truncate">
                      {acc.Notes || 'No notes provided.'}
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Request Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Hostel Accommodation Request"
        subtitle="Submit your arrival and departure dates for campus room allocation"
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleCreateRequest} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Select Preferred Hostel Block
            </label>
            <select
              value={formData.Hostel_Block}
              onChange={(e) => setFormData({ ...formData, Hostel_Block: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="Garnet-A Hostel (Boys)">Garnet-A Hostel (Boys)</option>
              <option value="Aquamarine Hostel (Boys)">Aquamarine Hostel (Boys)</option>
              <option value="Opal-B Hostel (Girls)">Opal-B Hostel (Girls)</option>
              <option value="Opal-C Hostel (Girls)">Opal-C Hostel (Girls)</option>
              <option value="Guest House (Faculty / Delegates)">Institute Guest House</option>
            </select>
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
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
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
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
            <p className="font-bold">Estimated accommodation fee</p>
            <p className="mt-1">
              {getAccommodationDays(formData.Check_in_Date, formData.Check_out_Date)} days × Rs. {ACCOMMODATION_RATE_PER_DAY} = Rs. {getAccommodationFee(formData.Check_in_Date, formData.Check_out_Date)}
            </p>
            <p className="mt-1 text-[11px]">Pay from your wallet after the admin assigns your room.</p>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Special Requirements / Dietary / Arrival Time
            </label>
            <textarea
              rows={3}
              value={formData.Notes}
              onChange={(e) => setFormData({ ...formData, Notes: e.target.value })}
              placeholder="e.g. Late night arrival from Trichy Junction, ground floor preference..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Submit Request
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default StudentAccommodationPage;
