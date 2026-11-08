import React, { useRef } from 'react';
import Modal from './Modal';
import Button from './Button';
import { Award, Printer, ShieldCheck, Download } from 'lucide-react';

const CertificateModal = ({ isOpen, onClose, certificate, participant, event }) => {
  if (!certificate) return null;

  const handlePrint = () => {
    window.print();
  };

  const participantName = participant?.Name || 'Participant';
  const eventName = event?.Event_Name || 'Department Event';
  const certType = certificate.Certificate_Type || 'Certificate of Participation';
  const certNo = certificate.Certificate_No || `NITT/CA/2026/${certificate.Certificate_ID}`;
  const issueDate = certificate.Issue_Date || new Date().toLocaleDateString('en-GB');

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Digital Certificate Viewer"
      subtitle={`Verified Credential #${certNo}`}
      maxWidth="max-w-4xl"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button variant="primary" icon={Printer} onClick={handlePrint}>
            Print / Save as PDF
          </Button>
        </>
      }
    >
      <div className="py-2">
        {/* Certificate Container */}
        <div
          id="printable-certificate"
          className="relative bg-amber-50/30 p-8 sm:p-12 border-8 border-double border-amber-700/80 rounded-lg shadow-inner text-center font-serif text-slate-800 overflow-hidden"
          style={{ backgroundImage: 'radial-gradient(ellipse at center, rgba(254, 243, 199, 0.4) 0%, rgba(255, 255, 255, 0.9) 100%)' }}
        >
          {/* Subtle Watermark Seal */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
            <Award className="w-96 h-96 text-amber-900" />
          </div>

          {/* Top Institute Header */}
          <div className="flex flex-col items-center justify-center border-b-2 border-amber-900/30 pb-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-nitt-900 text-amber-400 flex items-center justify-center font-bold text-2xl shadow-md border-2 border-amber-500 mb-2 font-sans">
              NIT
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-wider text-nitt-950 uppercase font-sans">
              National Institute of Technology, Tiruchirappalli
            </h1>
            <h2 className="text-sm sm:text-base font-semibold text-nitt-800 tracking-wide font-sans mt-0.5">
              Department of Computer Applications
            </h2>
            <p className="text-xs text-slate-500 font-sans mt-1">
              Tiruchirappalli - 620015, Tamil Nadu, India | An Institute of National Importance
            </p>
          </div>

          {/* Certificate Main Title */}
          <div className="my-6">
            <span className="text-xs uppercase tracking-widest text-amber-800 font-bold border-b border-amber-600/50 pb-1">
              OFFICIAL RECOGNITION
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-amber-900 mt-2 font-serif tracking-tight">
              {certType}
            </h3>
          </div>

          {/* Recipient Content */}
          <div className="my-6 space-y-3 max-w-2xl mx-auto font-sans">
            <p className="text-sm text-slate-600 italic">This is to certify that</p>
            <div className="text-2xl sm:text-3xl font-bold text-nitt-950 border-b-2 border-dotted border-slate-400 inline-block px-8 py-1 font-serif">
              {participantName}
            </div>
            <p className="text-sm text-slate-600">
              of <span className="font-semibold text-slate-800">{participant?.Institution_Name || 'National Institute of Technology, Tiruchirappalli'}</span>
            </p>
            <p className="text-sm text-slate-700 leading-relaxed pt-2">
              has successfully participated in and contributed to the national-level event
            </p>
            <div className="text-xl sm:text-2xl font-bold text-nitt-900 font-serif">
              "{eventName}"
            </div>
            <p className="text-xs text-slate-500">
              Organized by the Department of Computer Applications, NIT Trichy.
            </p>
          </div>

          {/* Verification Badge & Signatures */}
          <div className="mt-10 pt-6 border-t border-slate-200 grid grid-cols-3 items-end text-xs font-sans text-slate-700">
            {/* Signature 1 */}
            <div className="text-center">
              <div className="font-serif italic text-base text-slate-800 mb-1">
                Coordinator
              </div>
              <div className="border-t border-slate-400 pt-1 font-medium">
                Faculty Convener
              </div>
              <div className="text-[10px] text-slate-500">Dept. of Computer Applications</div>
            </div>

            {/* Central Official Seal */}
            <div className="flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-full border-2 border-dashed border-amber-600 flex flex-col items-center justify-center text-amber-700 p-1">
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
                <span className="text-[8px] font-bold uppercase mt-0.5 tracking-tighter">Verified</span>
              </div>
              <span className="text-[9px] text-slate-400 mt-1 font-mono">{certNo}</span>
              <span className="text-[9px] text-slate-500">Issued: {issueDate}</span>
            </div>

            {/* Signature 2 */}
            <div className="text-center">
              <div className="font-serif italic text-base text-slate-800 mb-1">
                Admin
              </div>
              <div className="border-t border-slate-400 pt-1 font-medium">
                Head of the Department
              </div>
              <div className="text-[10px] text-slate-500">Dept. of Computer Applications</div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CertificateModal;
