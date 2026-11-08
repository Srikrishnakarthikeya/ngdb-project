import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import Button from '../../components/common/Button';
import { Edit3, Save } from 'lucide-react';

const StudentProfilePage = () => {
  const { currentUser } = useAuth();
  const { participants, updateParticipant } = useData();
  const { showToast } = useToast();

  const studentId = currentUser?.id || 'PART-001';
  const existingParticipant = participants.find((p) => p.Participant_ID === studentId) || {
    Participant_ID: studentId,
    Name: currentUser?.name || '',
    Email: currentUser?.email || '',
    Phone: currentUser?.phone || '',
    Institution_Name: currentUser?.institution || ''
  };

  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(existingParticipant);

  useEffect(() => {
    if (!isEditing) setProfileData(existingParticipant);
  }, [participants, studentId, isEditing]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const saved = await updateParticipant(studentId, { ...profileData, Participant_ID: studentId });
      setProfileData(saved);
      setIsEditing(false);
      showToast('Participant profile updated in the backend successfully!', 'success');
    } catch (error) {
      showToast(error.message || 'Unable to update the participant profile.', 'error');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Main Profile Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-nitt-950 to-nitt-800 p-6 text-white flex items-center justify-between gap-5">
          <div className="flex items-center gap-5 min-w-0">
          <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-amber-400 font-bold text-xl backdrop-blur-xs">
            {profileData.Name.split(' ')[0][0]}{profileData.Name.split(' ')[1]?.[0] || 'L'}
          </div>
          <div>
            <h2 className="text-xl font-bold">{profileData.Name}</h2>
          </div>
          </div>
          <Button
            variant="white"
            icon={isEditing ? Save : Edit3}
            onClick={() => setIsEditing(!isEditing)}
            className="shrink-0"
          >
            {isEditing ? 'Cancel Editing' : 'Edit Details'}
          </Button>
        </div>

        {/* Profile Content */}
        <form onSubmit={handleSave} className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            {/* Name */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                disabled={!isEditing}
                required
                value={profileData.Name}
                onChange={(e) => setProfileData({ ...profileData, Name: e.target.value })}
                className={`w-full px-3 py-2 rounded-lg border text-slate-800 font-medium ${
                  isEditing
                    ? 'bg-white border-blue-400 focus:ring-2 focus:ring-blue-500'
                    : 'bg-slate-50 border-slate-200'
                }`}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                disabled={!isEditing}
                required
                value={profileData.Email}
                onChange={(e) => setProfileData({ ...profileData, Email: e.target.value })}
                className={`w-full px-3 py-2 rounded-lg border text-slate-800 font-medium ${
                  isEditing
                    ? 'bg-white border-blue-400 focus:ring-2 focus:ring-blue-500'
                    : 'bg-slate-50 border-slate-200'
                }`}
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                Contact Phone
              </label>
              <input
                type="tel"
                disabled={!isEditing}
                required
                value={profileData.Phone}
                onChange={(e) => setProfileData({ ...profileData, Phone: e.target.value })}
                className={`w-full px-3 py-2 rounded-lg border text-slate-800 font-medium ${
                  isEditing
                    ? 'bg-white border-blue-400 focus:ring-2 focus:ring-blue-500'
                    : 'bg-slate-50 border-slate-200'
                }`}
              />
            </div>

            {/* Institution Name */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                Institution Name
              </label>
              <input
                type="text"
                disabled={!isEditing}
                required
                value={profileData.Institution_Name}
                onChange={(e) => setProfileData({ ...profileData, Institution_Name: e.target.value })}
                className={`w-full px-3 py-2 rounded-lg border text-slate-800 font-medium ${
                  isEditing
                    ? 'bg-white border-blue-400 focus:ring-2 focus:ring-blue-500'
                    : 'bg-slate-50 border-slate-200'
                }`}
              />
            </div>

          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 flex items-center justify-between">
            <span className="font-bold text-slate-700">Wallet Balance</span>
            <span className="font-bold text-nitt-800">₹{Number(profileData.Wallet ?? 1000).toLocaleString('en-IN')}</span>
          </div>

          {isEditing && (
            <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" icon={Save}>
                Save Changes to Database
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default StudentProfilePage;
