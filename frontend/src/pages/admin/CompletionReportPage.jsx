import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { FileText, PlusCircle, Edit2, Download, Calendar, Users, CheckCircle2, DollarSign, Printer } from 'lucide-react';
import { Link } from 'react-router-dom';

const CompletionReportPage = () => {
  const { completionReports, events, coordinators, photographs, saveCompletionReport, getEvent, getCoordinator } = useData();
  const { showToast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  const initialForm = {
    Report_ID: `REP-30${completionReports.length + 1}`,
    Event_ID: events.find((e) => e.Status === 'Completed')?.Event_ID || events[0]?.Event_ID,
    Prepared_By: coordinators[0]?.Coordinator_ID || 'COORD-01',
    Report_Date: new Date().toISOString().split('T')[0],
    Summary: '',
    No_of_Participants: 250
  };

  const [formData, setFormData] = useState(initialForm);

  const handleOpenAdd = () => {
    setFormData({
      ...initialForm,
      Report_ID: `REP-30${completionReports.length + 1}`
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const saved = saveCompletionReport(formData);
    showToast(`Completion Report ${saved.Report_ID} recorded successfully!`, 'success');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-nitt-950">
              Event Completion Audit Reports
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Formal post-event outcomes, registered attendee tallies, proceedings publication, and financial auditing
          </p>
        </div>

        <Button
          variant="primary"
          icon={PlusCircle}
          onClick={handleOpenAdd}
        >
          Create Completion Report
        </Button>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 gap-6">
        {completionReports.map((report) => {
          const evt = getEvent(report.Event_ID);
          const coord = getCoordinator(report.Prepared_By);
          const reportPhotos = photographs.filter((p) => p.Report_ID === report.Report_ID);

          return (
            <div
              key={report.Report_ID}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6"
            >
              {/* Report Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                      Report #{report.Report_ID}
                    </span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Audited & Approved</span>
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-nitt-950">
                    {evt?.Event_Name || report.Event_ID}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span>Date Filed: {report.Report_Date}</span>
                    <span>&bull;</span>
                    <span>Prepared By: <strong className="text-slate-800">{coord?.Name}</strong> ({report.Prepared_By})</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    icon={Printer}
                    onClick={() => {
                      setSelectedReport({ report, evt, coord, reportPhotos });
                      setTimeout(() => window.print(), 200);
                    }}
                  >
                    Print Audit
                  </Button>
                </div>
              </div>

              {/* Summary Text */}
              <div className="space-y-2 text-xs">
                <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] block">
                  Executive Summary & Outcomes
                </span>
                <p className="text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
                  {report.Summary}
                </p>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-400 font-bold uppercase text-[10px] block">Total Participants</span>
                  <span className="text-xl font-extrabold text-slate-900 mt-1 block">
                    {report.No_of_Participants} Delegates
                  </span>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-400 font-bold uppercase text-[10px] block">Archived Photos</span>
                  <span className="text-xl font-extrabold text-cyan-700 mt-1 block">
                    {reportPhotos.length} Photos
                  </span>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-400 font-bold uppercase text-[10px] block">Allocated Budget</span>
                  <span className="text-xl font-extrabold text-slate-900 mt-1 block">
                    Rs. {evt?.Budget?.toLocaleString('en-IN') || '1,80,000'}
                  </span>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-400 font-bold uppercase text-[10px] block">Department</span>
                  <span className="text-sm font-bold text-slate-900 mt-1 block truncate">
                    Dept of CA
                  </span>
                </div>
              </div>

              {/* Attached Photographs from ER relation COMPLETION_REPORT 1 : M PHOTOGRAPH */}
              <div className="pt-2 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">
                    Contained Photographs
                  </span>
                  <Link to="/admin/gallery" className="text-blue-600 font-bold hover:underline">
                    Manage Gallery &rarr;
                  </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {reportPhotos.map((p) => (
                    <div key={p.Photo_ID} className="rounded-lg overflow-hidden border border-slate-200 bg-slate-100 group">
                      <img
                        src={p.Photo_URL}
                        alt={p.Caption}
                        className="w-full h-24 object-cover group-hover:scale-105 transition-transform"
                      />
                      <p className="p-1.5 text-[10px] text-slate-600 truncate bg-white font-medium">
                        {p.Caption}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Completion Report"
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Report ID (Primary Key)
            </label>
            <input
              type="text"
              required
              value={formData.Report_ID}
              onChange={(e) => setFormData({ ...formData, Report_ID: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-slate-800"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Event (Event_ID FK &rarr; EVENT [1:1])
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
              Prepared By (Prepared_By FK &rarr; COORDINATOR)
            </label>
            <select
              value={formData.Prepared_By}
              onChange={(e) => setFormData({ ...formData, Prepared_By: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
            >
              {coordinators.map((coordinator) => (
                <option key={coordinator.Coordinator_ID} value={coordinator.Coordinator_ID}>
                  {coordinator.Name} ({coordinator.Coordinator_ID}) - {coordinator.Designation}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Report Date
              </label>
              <input
                type="date"
                required
                value={formData.Report_Date}
                onChange={(e) => setFormData({ ...formData, Report_Date: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Number of Participants (Confirmed)
              </label>
              <input
                type="number"
                required
                value={formData.No_of_Participants}
                onChange={(e) => setFormData({ ...formData, No_of_Participants: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Executive Summary & Outcomes
            </label>
            <textarea
              rows={4}
              required
              placeholder="Detail session attendance, speaker highlights, budget reconciliations, and academic impact..."
              value={formData.Summary}
              onChange={(e) => setFormData({ ...formData, Summary: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Completion Report
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CompletionReportPage;
