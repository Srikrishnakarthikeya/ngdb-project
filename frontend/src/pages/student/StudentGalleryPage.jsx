import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import Modal from '../../components/common/Modal';
import { Image as ImageIcon, Calendar, FileText, ZoomIn, Eye } from 'lucide-react';

const StudentGalleryPage = () => {
  const { photographs, completionReports, getEvent } = useData();
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-nitt-950">
            Event Photo Gallery & Media Archive
          </h1>
          {/* <span className="text-[10px] bg-cyan-100 text-cyan-800 font-bold px-2 py-0.5 rounded font-mono">
            PHOTOGRAPH (1 : M via COMPLETION_REPORT)
          </span> */}
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Archived photographs from Department of CA symposiums, keynotes, labs, and award ceremonies
        </p>
      </div>

      {/* Photo Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {photographs.map((photo) => {
          const report = completionReports.find((r) => r.Report_ID === photo.Report_ID);
          const evt = report ? getEvent(report.Event_ID) : null;

          return (
            <div
              key={photo.Photo_ID}
              onClick={() => setSelectedPhoto({ photo, report, evt })}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer group flex flex-col justify-between"
            >
              <div className="relative h-56 bg-slate-100 overflow-hidden">
                <img
                  src={photo.Photo_URL}
                  alt={photo.Caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                  <div className="bg-nitt-950/80 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 backdrop-blur-xs">
                    <ZoomIn className="w-4 h-4" />
                    <span>View Photo</span>
                  </div>
                </div>
                <div className="absolute top-2.5 right-2.5 bg-nitt-950/80 text-white text-[10px] font-mono px-2 py-0.5 rounded backdrop-blur-xs">
                  {photo.Photo_ID}
                </div>
              </div>

              <div className="p-4 space-y-2">
                <p className="text-xs font-bold text-nitt-950 line-clamp-2">
                  {photo.Caption}
                </p>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-100">
                  <span className="truncate max-w-[180px]">{evt?.Event_Name || 'Department Event'}</span>
                  <span>{photo.Uploaded_Date}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Photo Lightbox Modal */}
      {selectedPhoto && (
        <Modal
          isOpen={!!selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
          title="Photograph Details"
          subtitle={`Report Link: ${selectedPhoto.photo.Report_ID}`}
          maxWidth="max-w-3xl"
        >
          <div className="space-y-4">
            <div className="rounded-xl overflow-hidden max-h-[60vh] bg-slate-900 flex items-center justify-center">
              <img
                src={selectedPhoto.photo.Photo_URL}
                alt={selectedPhoto.photo.Caption}
                className="max-h-[60vh] w-auto object-contain"
              />
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-bold text-nitt-950">
                {selectedPhoto.photo.Caption}
              </h4>
              <p className="text-xs text-slate-600">
                Linked Event: <span className="font-semibold text-slate-900">{selectedPhoto.evt?.Event_Name}</span> &bull; Uploaded on {selectedPhoto.photo.Uploaded_Date}
              </p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default StudentGalleryPage;
