import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { Image as ImageIcon, PlusCircle, Trash2, Calendar, Link2, ZoomIn } from 'lucide-react';

const PhotoGalleryManagementPage = () => {
  const { photographs, completionReports, uploadPhotograph, deletePhotograph, getEvent } = useData();
  const { showToast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletePhotoId, setDeletePhotoId] = useState(null);
  const [viewPhoto, setViewPhoto] = useState(null);

  const initialForm = {
    Report_ID: completionReports[0]?.Report_ID || 'REP-301',
    Photo_URL: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
    Caption: ''
  };

  const [formData, setFormData] = useState(initialForm);

  const handleUpload = (e) => {
    e.preventDefault();
    const newPhoto = uploadPhotograph(formData);
    showToast(`Photograph ${newPhoto.Photo_ID} uploaded!`, 'success');
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (deletePhotoId) {
      deletePhotograph(deletePhotoId);
      showToast(`Photograph ${deletePhotoId} deleted.`, 'info');
      setDeletePhotoId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-nitt-950">
              Event Photograph & Media Archive
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Publish high-resolution photo archives linked to completion audit reports
          </p>
        </div>

        <Button
          variant="primary"
          icon={PlusCircle}
          onClick={() => setIsModalOpen(true)}
        >
          Upload Photograph
        </Button>
      </div>

      {/* Photographs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {photographs.map((photo) => {
          const report = completionReports.find((r) => r.Report_ID === photo.Report_ID);
          const evt = report ? getEvent(report.Event_ID) : null;

          return (
            <div
              key={photo.Photo_ID}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="relative h-48 bg-slate-100 overflow-hidden group">
                <img
                  src={photo.Photo_URL}
                  alt={photo.Caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button
                  type="button"
                  onClick={() => setViewPhoto(photo)}
                  className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                >
                  <span className="bg-nitt-950/80 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 backdrop-blur-xs">
                    <ZoomIn className="w-4 h-4" />
                    <span>View Image</span>
                  </span>
                </button>
                <div className="absolute top-2.5 left-2.5 bg-nitt-950/80 text-white text-[10px] font-mono px-2 py-0.5 rounded backdrop-blur-xs">
                  {photo.Photo_ID}
                </div>
              </div>

              <div className="p-4 space-y-3">
                <p className="text-xs font-bold text-nitt-950 line-clamp-2">
                  {photo.Caption}
                </p>

                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-[11px] space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Report Link:</span>
                    <span className="font-mono font-bold text-blue-700">{photo.Report_ID}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Event:</span>
                    <span className="text-slate-800 font-semibold truncate max-w-[150px]">{evt?.Event_Name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Uploaded:</span>
                    <span className="text-slate-600">{photo.Uploaded_Date}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setDeletePhotoId(photo.Photo_ID)}
                    className="p-1.5 rounded-md hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors text-xs flex items-center gap-1 font-semibold"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Photo</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Upload Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Upload Event Photograph"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleUpload} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Select Completion Report (Report_ID FK)
            </label>
            <select
              value={formData.Report_ID}
              onChange={(e) => setFormData({ ...formData, Report_ID: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
            >
              {completionReports.map((r) => (
                <option key={r.Report_ID} value={r.Report_ID}>
                  {r.Report_ID} &bull; {getEvent(r.Event_ID)?.Event_Name || r.Event_ID}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Photograph URL / Image Resource
            </label>
            <input
              type="url"
              required
              placeholder="https://images.unsplash.com/..."
              value={formData.Photo_URL}
              onChange={(e) => setFormData({ ...formData, Photo_URL: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono text-[11px]"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Descriptive Caption
            </label>
            <textarea
              rows={3}
              required
              placeholder="e.g. Inauguration Ceremony & Lighting of Kuthu Vilakku in Barn Hall"
              value={formData.Caption}
              onChange={(e) => setFormData({ ...formData, Caption: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Upload Photo
            </Button>
          </div>
        </form>
      </Modal>

      {/* Lightbox Modal */}
      {viewPhoto && (
        <Modal
          isOpen={!!viewPhoto}
          onClose={() => setViewPhoto(null)}
          title={viewPhoto.Photo_ID}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-3">
            <img
              src={viewPhoto.Photo_URL}
              alt={viewPhoto.Caption}
              className="w-full max-h-[60vh] object-contain rounded-xl bg-slate-900"
            />
            <p className="text-xs text-slate-700 font-medium text-center">
              {viewPhoto.Caption}
            </p>
          </div>
        </Modal>
      )}

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deletePhotoId}
        onClose={() => setDeletePhotoId(null)}
        onConfirm={handleDelete}
        title="Delete Photograph"
        message={`Are you sure you want to delete photograph ${deletePhotoId}?`}
      />
    </div>
  );
};

export default PhotoGalleryManagementPage;
