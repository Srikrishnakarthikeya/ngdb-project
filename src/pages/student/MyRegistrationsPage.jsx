import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import EmptyState from '../../components/common/EmptyState';
import {
  ClipboardList,
  Calendar,
  Download,
  Eye,
  XCircle,
  FileCheck,
  CheckCircle2,
  Printer
} from 'lucide-react';

const MyRegistrationsPage = () => {
  const { currentUser } = useAuth();
  const { registrations, events, getEvent, updateRegistrationStatus } = useData();
  const { showToast } = useToast();

  const studentId = currentUser?.id || 'PART-001';
  const myRegistrations = registrations.filter((r) => r.Participant_ID === studentId);

  const [receiptReg, setReceiptReg] = useState(null);
  const [cancelRegId, setCancelRegId] = useState(null);

  const handleCancelRegistration = () => {
    if (cancelRegId) {
      updateRegistrationStatus(cancelRegId, 'Cancelled', 'Refund Pending');
      showToast(`Registration ${cancelRegId} has been cancelled.`, 'info');
      setCancelRegId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-nitt-950">
            My Event Registrations
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Tracking your participation records, fee verification, and event status
          </p>
        </div>

        <Link
          to="/student/events"
          className="px-4 py-2 rounded-lg bg-nitt-900 text-white text-xs font-bold hover:bg-nitt-800 transition-colors flex items-center gap-1.5 self-start"
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Register for New Event</span>
        </Link>
      </div>

      {/* Registrations Table Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {myRegistrations.length === 0 ? (
          <EmptyState
            title="No registrations yet"
            description="You haven't registered for any events yet. Explore upcoming technical events and workshops to participate."
            actionLabel="Browse Events"
            onAction={() => {}}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-xs">
              <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-4 py-3 text-left">Registration ID</th>
                  <th className="px-4 py-3 text-left">Event Details</th>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Fee Paid</th>
                  <th className="px-4 py-3 text-left">Payment Status</th>
                  <th className="px-4 py-3 text-left">Registration Type</th>
                  <th className="px-4 py-3 text-left">Event Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {myRegistrations.map((reg) => {
                  const evt = getEvent(reg.Event_ID);

                  return (
                    <tr key={reg.Registration_ID} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3.5 font-mono font-bold text-blue-700">
                        {reg.Registration_ID}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="font-bold text-slate-900">
                          {evt?.Event_Name || reg.Event_ID}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {reg.Event_ID} &bull; {evt?.Event_Type}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-slate-600 whitespace-nowrap">
                        {reg.Registration_Date}
                      </td>
                      <td className="px-4 py-3.5 font-bold text-slate-900">
                        {reg.Fee_Paid === 0 ? 'Free' : `Rs. ${reg.Fee_Paid}`}
                      </td>
                      <td className="px-4 py-3.5">
                        <Badge status={reg.Payment_Status} />
                      </td>
                      <td className="px-4 py-3.5 text-slate-600 whitespace-nowrap">
                        {reg.Registration_Type}
                      </td>
                      <td className="px-4 py-3.5">
                        <Badge status={evt?.Status || reg.Status} />
                      </td>
                      <td className="px-4 py-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setReceiptReg(reg)}
                            className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600 hover:text-blue-600 transition-colors"
                            title="View / Print Official Receipt"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <Link
                            to={`/student/events/${reg.Event_ID}`}
                            className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
                            title="View Event Details"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          {reg.Status !== 'Cancelled' && reg.Status !== 'Completed' && (
                            <button
                              type="button"
                              onClick={() => setCancelRegId(reg.Registration_ID)}
                              className="p-1.5 rounded-md hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
                              title="Cancel Registration"
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
        )}
      </div>

      {/* Official Registration Receipt Modal */}
      {receiptReg && (
        <Modal
          isOpen={!!receiptReg}
          onClose={() => setReceiptReg(null)}
          title="Official Registration Receipt"
          subtitle={`NIT Trichy &bull; Department of Computer Applications`}
          maxWidth="max-w-md"
          footer={
            <>
              <Button variant="secondary" onClick={() => setReceiptReg(null)}>
                Close
              </Button>
              <Button
                variant="primary"
                icon={Printer}
                onClick={() => window.print()}
              >
                Print Receipt
              </Button>
            </>
          }
        >
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-4">
            <div className="text-center border-b border-slate-200 pb-3">
              <div className="w-10 h-10 rounded-lg bg-nitt-900 text-amber-400 font-bold text-xs flex items-center justify-center mx-auto mb-1">
                NIT
              </div>
              <h4 className="font-bold text-nitt-950 uppercase">
                National Institute of Technology, Tiruchirappalli
              </h4>
              <p className="text-[10px] text-slate-500">Department of Computer Applications</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Receipt / Reg No:</span>
                <span className="font-mono font-bold text-slate-900">{receiptReg.Registration_ID}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Event:</span>
                <span className="font-bold text-slate-900">{getEvent(receiptReg.Event_ID)?.Event_Name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Participant:</span>
                <span className="font-semibold text-slate-800">{currentUser?.name} ({receiptReg.Participant_ID})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Date of Registration:</span>
                <span className="text-slate-700">{receiptReg.Registration_Date}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Type:</span>
                <span className="text-slate-700">{receiptReg.Registration_Type}</span>
              </div>
              <div className="flex justify-between py-1 pt-2">
                <span className="text-slate-800 font-bold">Total Fee Paid:</span>
                <span className="font-bold text-emerald-700 text-sm">
                  {receiptReg.Fee_Paid === 0 ? 'Complimentary (Rs. 0)' : `Rs. ${receiptReg.Fee_Paid}`}
                </span>
              </div>
            </div>

            <div className="bg-emerald-50 text-emerald-800 p-2.5 rounded-lg text-center font-bold text-[11px]">
              Payment Status: Verified ({receiptReg.Payment_Status})
            </div>
          </div>
        </Modal>
      )}

      {/* Confirmation Dialog for Cancellation */}
      <ConfirmDialog
        isOpen={!!cancelRegId}
        onClose={() => setCancelRegId(null)}
        onConfirm={handleCancelRegistration}
        title="Cancel Event Registration?"
        message={`Are you sure you want to cancel registration ${cancelRegId}? This will free up your seat for other waiting participants.`}
        confirmText="Confirm Cancellation"
        variant="danger"
      />
    </div>
  );
};

export default MyRegistrationsPage;
