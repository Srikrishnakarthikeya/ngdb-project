import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import CertificateModal from '../../components/common/CertificateModal';
import { Award, PlusCircle, Eye, Download, Search, CheckCircle2, ShieldCheck } from 'lucide-react';

const CertificateManagementPage = () => {
  const { certificates, events, participants, generateCertificate, getEvent, getParticipant } = useData();
  const { showToast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [selectedPreviewCert, setSelectedPreviewCert] = useState(null);

  const initialForm = {
    Participant_ID: participants[0]?.Participant_ID || 'PART-001',
    Event_ID: events[0]?.Event_ID || 'EVT-101',
    Certificate_Type: 'Certificate of Participation',
    IssuedBy: 'Admin & Coordinator'
  };

  const [formData, setFormData] = useState(initialForm);

  const handleGenerate = (e) => {
    e.preventDefault();
    const newCert = generateCertificate(formData);
    showToast(`Certificate ${newCert.Certificate_No} generated and issued!`, 'success');
    setIsGenerateModalOpen(false);
  };

  const filteredCerts = certificates.filter((cert) => {
    const part = getParticipant(cert.Participant_ID);
    const evt = getEvent(cert.Event_ID);

    return (
      cert.Certificate_No.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (part?.Name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (evt?.Event_Name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.Certificate_Type.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-nitt-950">
              Institutional Certificate Management
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Generate, stamp, and issue official verifiable digital credentials for symposium winners and attendees
          </p>
        </div>

        <Button
          variant="primary"
          icon={PlusCircle}
          onClick={() => setIsGenerateModalOpen(true)}
        >
          Generate Certificate
        </Button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by Cert No, Participant, or Event..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="text-xs text-slate-500 font-semibold">
          Showing <span className="text-slate-900 font-bold">{filteredCerts.length}</span> of {certificates.length} certificates
        </div>
      </div>

      {/* Certificates Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-xs">
            <thead className="bg-slate-50 font-bold uppercase tracking-wider text-slate-600 text-[10px]">
              <tr>
                <th className="px-4 py-3 text-left">Certificate No (Unique Code)</th>
                <th className="px-4 py-3 text-left">Participant (Participant_ID FK)</th>
                <th className="px-4 py-3 text-left">Event (Event_ID FK)</th>
                <th className="px-4 py-3 text-left">Certificate Type</th>
                <th className="px-4 py-3 text-left">Issue Date</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-right">Preview Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredCerts.map((cert) => {
                const part = getParticipant(cert.Participant_ID);
                const evt = getEvent(cert.Event_ID);

                return (
                  <tr key={cert.Certificate_ID} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3.5 font-mono font-bold text-purple-700">
                      {cert.Certificate_No}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-bold text-slate-900 block">{part?.Name || cert.Participant_ID}</span>
                      <span className="text-[10px] text-slate-400">{part?.Institution_Name?.split(',')[0]}</span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-800 max-w-[180px] truncate">
                      <span className="font-bold block truncate">{evt?.Event_Name || cert.Event_ID}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{cert.Event_ID}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="px-2.5 py-1 rounded-md font-bold text-xs bg-amber-50 text-amber-900 border border-amber-200">
                        {cert.Certificate_Type}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-600 whitespace-nowrap">
                      {cert.Issue_Date}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1 w-max">
                        <ShieldCheck className="w-3 h-3" />
                        <span>Issued</span>
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="outline"
                          size="sm"
                          icon={Eye}
                          onClick={() => setSelectedPreviewCert({ cert, evt, part })}
                        >
                          View & Print
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Generate Modal */}
      <Modal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        title="Generate & Issue Digital Certificate"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleGenerate} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Select Participant (Participant_ID FK)
            </label>
            <select
              value={formData.Participant_ID}
              onChange={(e) => setFormData({ ...formData, Participant_ID: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
            >
              {participants.map((p) => (
                <option key={p.Participant_ID} value={p.Participant_ID}>
                  {p.Name} ({p.Participant_ID}) - {p.Institution_Name?.split(',')[0]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Select Event (Event_ID FK)
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
              Certificate Classification Type
            </label>
            <select
              value={formData.Certificate_Type}
              onChange={(e) => setFormData({ ...formData, Certificate_Type: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
            >
              <option value="Certificate of Participation">Certificate of Participation</option>
              <option value="Winner (1st Prize)">Winner (1st Prize)</option>
              <option value="Runner-Up (2nd Prize)">Runner-Up (2nd Prize)</option>
              <option value="Certificate of Appreciation (Volunteer)">Certificate of Appreciation (Volunteer)</option>
              <option value="Distinguished Service Certificate">Distinguished Service Certificate</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Authorized Signatories
            </label>
            <input
              type="text"
              required
              value={formData.IssuedBy}
              onChange={(e) => setFormData({ ...formData, IssuedBy: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setIsGenerateModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Generate & Seal Certificate
            </Button>
          </div>
        </form>
      </Modal>

      {/* Printable Certificate Modal */}
      {selectedPreviewCert && (
        <CertificateModal
          isOpen={!!selectedPreviewCert}
          onClose={() => setSelectedPreviewCert(null)}
          certificate={selectedPreviewCert.cert}
          participant={selectedPreviewCert.part}
          event={selectedPreviewCert.evt}
        />
      )}
    </div>
  );
};

export default CertificateManagementPage;
