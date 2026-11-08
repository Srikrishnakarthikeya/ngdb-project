import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import Button from '../../components/common/Button';
import CertificateModal from '../../components/common/CertificateModal';
import EmptyState from '../../components/common/EmptyState';
import { Award, Calendar, Download, Eye, ShieldCheck, Printer } from 'lucide-react';

const StudentCertificatesPage = () => {
  const { currentUser } = useAuth();
  const { certificates, getEvent, getParticipant } = useData();

  const studentId = currentUser?.id || 'PART-001';
  const myCertificates = certificates.filter((c) => c.Participant_ID === studentId);

  const [selectedCert, setSelectedCert] = useState(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-nitt-950">
            My Digital Certificates
          </h1>
          {/* <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded font-mono">
            CERTIFICATE (M : N)
          </span> */}
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Cryptographically stamped and institute-verified certificates issued by Department of Computer Applications, NIT Trichy
        </p>
      </div>

      {/* Certificates Cards */}
      {myCertificates.length === 0 ? (
        <EmptyState
          icon={Award}
          title="No certificates issued yet"
          description="Certificates are issued by the Faculty Convener upon successful participation and event completion."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {myCertificates.map((cert) => {
            const evt = getEvent(cert.Event_ID);
            const part = getParticipant(cert.Participant_ID) || currentUser;

            return (
              <div
                key={cert.Certificate_ID}
                className="bg-white rounded-2xl border-2 border-slate-200 hover:border-amber-400 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group relative overflow-hidden"
              >
                {/* Decorative background crest */}
                <div className="absolute -right-6 -bottom-6 opacity-5 pointer-events-none text-amber-900 group-hover:scale-110 transition-transform">
                  <Award className="w-40 h-40" />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      {cert.Certificate_No}
                    </span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Verified</span>
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-nitt-950 group-hover:text-blue-600 transition-colors">
                      {cert.Certificate_Type}
                    </h3>
                    <p className="text-xs font-semibold text-slate-600 mt-1">
                      Event: {evt?.Event_Name || cert.Event_ID}
                    </p>
                  </div>

                  <div className="text-xs text-slate-500 space-y-1 pt-1">
                    <p className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Date of Issuance: {cert.Issue_Date}</span>
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Issued by: {cert.IssuedBy || 'Admin'}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    icon={Eye}
                    onClick={() => setSelectedCert({ cert, evt, part })}
                  >
                    Preview Certificate
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    icon={Download}
                    onClick={() => setSelectedCert({ cert, evt, part })}
                  >
                    Download / Print
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Certificate Viewer Modal */}
      {selectedCert && (
        <CertificateModal
          isOpen={!!selectedCert}
          onClose={() => setSelectedCert(null)}
          certificate={selectedCert.cert}
          participant={selectedCert.part}
          event={selectedCert.evt}
        />
      )}
    </div>
  );
};

export default StudentCertificatesPage;
