import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import {
  ClipboardList,
  CheckCircle,
  XCircle,
  Eye,
  Search,
  Filter,
  DollarSign,
  Download,
  Calendar
} from 'lucide-react';

const RegistrationManagementPage = () => {
  const { registrations, events, participants, updateRegistrationStatus, getEvent, getParticipant } = useData();
  const { showToast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [eventFilter, setEventFilter] = useState('ALL');
  const [paymentFilter, setPaymentFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [selectedReg, setSelectedReg] = useState(null);

  const handleApprove = (regId) => {
    updateRegistrationStatus(regId, 'Confirmed', 'Confirmed');
    showToast(`Registration ${regId} has been approved and confirmed.`, 'success');
  };

  const handleReject = (regId) => {
    updateRegistrationStatus(regId, 'Rejected', 'Failed');
    showToast(`Registration ${regId} has been rejected.`, 'error');
  };

  const filteredRegistrations = registrations.filter((reg) => {
    const part = getParticipant(reg.Participant_ID);
    const evt = getEvent(reg.Event_ID);

    const matchesSearch =
      reg.Registration_ID.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (part?.Name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (evt?.Event_Name || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesEvent = eventFilter === 'ALL' || reg.Event_ID === eventFilter;
    const matchesPayment = paymentFilter === 'ALL' || reg.Payment_Status === paymentFilter;
    const matchesStatus = statusFilter === 'ALL' || reg.Status === statusFilter;

    return matchesSearch && matchesEvent && matchesPayment && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-nitt-950">
            Event Registration Management
          </h1>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Review participant enrollments, verify fee remittances, and approve delegate admissions
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by Registration ID, Participant Name, or Event..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100 text-xs">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Filter by Event
            </label>
            <select
              value={eventFilter}
              onChange={(e) => setEventFilter(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700"
            >
              <option value="ALL">All Events</option>
              {events.map((e) => (
                <option key={e.Event_ID} value={e.Event_ID}>
                  {e.Event_Name} ({e.Event_ID})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Payment Status
            </label>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700"
            >
              <option value="ALL">All Payment Statuses</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Pending">Pending</option>
              <option value="Exempted">Exempted</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Registration Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700"
            >
              <option value="ALL">All Statuses</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Rejected">Rejected</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Registrations Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-xs">
            <thead className="bg-slate-50 font-bold uppercase tracking-wider text-slate-600 text-[10px]">
              <tr>
                <th className="px-4 py-3 text-left">Registration ID (PK)</th>
                <th className="px-4 py-3 text-left">Participant (Participant_ID FK)</th>
                <th className="px-4 py-3 text-left">Event (Event_ID FK)</th>
                <th className="px-4 py-3 text-left">Reg Date</th>
                <th className="px-4 py-3 text-left">Fee Paid</th>
                <th className="px-4 py-3 text-left">Payment Status</th>
                <th className="px-4 py-3 text-left">Type</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-right">Review Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredRegistrations.map((reg) => {
                const part = getParticipant(reg.Participant_ID);
                const evt = getEvent(reg.Event_ID);

                return (
                  <tr key={reg.Registration_ID} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3.5 font-mono font-bold text-blue-700">
                      {reg.Registration_ID}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-bold text-slate-900 block">{part?.Name || reg.Participant_ID}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{reg.Participant_ID}</span>
                    </td>
                    <td className="px-4 py-3.5 max-w-[180px] truncate text-slate-800">
                      <span className="block font-bold truncate">{evt?.Event_Name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{reg.Event_ID}</span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-600 whitespace-nowrap">
                      {reg.Registration_Date}
                    </td>
                    <td className="px-4 py-3.5 font-bold text-slate-900">
                      {reg.Fee_Paid === 0 ? 'Complimentary' : `Rs. ${reg.Fee_Paid}`}
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge status={reg.Payment_Status} />
                    </td>
                    <td className="px-4 py-3.5 text-slate-600 whitespace-nowrap">
                      {reg.Registration_Type}
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge status={reg.Status} />
                    </td>
                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedReg({ reg, part, evt })}
                          className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600 hover:text-blue-600 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {reg.Status !== 'Confirmed' && (
                          <button
                            type="button"
                            onClick={() => handleApprove(reg.Registration_ID)}
                            className="p-1.5 rounded-md hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 transition-colors"
                            title="Approve & Confirm"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        {reg.Status !== 'Rejected' && reg.Status !== 'Cancelled' && (
                          <button
                            type="button"
                            onClick={() => handleReject(reg.Registration_ID)}
                            className="p-1.5 rounded-md hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
                            title="Reject"
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

      {/* Details Modal */}
      {selectedReg && (
        <Modal
          isOpen={!!selectedReg}
          onClose={() => setSelectedReg(null)}
          title="Registration Record Details"
          subtitle={`Verified Transaction #${selectedReg.reg.Registration_ID}`}
          maxWidth="max-w-md"
          footer={
            <Button variant="secondary" onClick={() => setSelectedReg(null)}>
              Close
            </Button>
          }
        >
          <div className="space-y-4 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Participant Name:</span>
                <span className="font-bold text-slate-900">{selectedReg.part?.Name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Email Address:</span>
                <span className="font-mono text-slate-700">{selectedReg.part?.Email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Institution:</span>
                <span className="text-slate-800">{selectedReg.part?.Institution_Name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Event:</span>
                <span className="font-bold text-slate-900">{selectedReg.evt?.Event_Name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Fee Paid:</span>
                <span className="font-bold text-emerald-700">Rs. {selectedReg.reg.Fee_Paid}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Payment Status:</span>
                <Badge status={selectedReg.reg.Payment_Status} />
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default RegistrationManagementPage;
