import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const ChangePasswordPage = () => {
  const { changePassword, isCoordinator } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    if (newPassword !== confirmPassword) { setError('Passwords do not match.'); return; }
    if (newPassword.length < 8) { setError('New password must be at least 8 characters.'); return; }
    const result = await changePassword(currentPassword, newPassword);
    if (!result.success) { setError(result.error); return; }
    showToast('Password changed successfully.', 'success');
    navigate(isCoordinator ? '/admin/coordinator-dashboard' : '/admin/dashboard', { replace: true });
  };

  return <main className="mx-auto max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
    <h1 className="text-xl font-bold text-slate-950">Change Password</h1>
    <p className="mt-1 text-xs text-slate-500">{isCoordinator ? 'Coordinator accounts must change their default password before continuing.' : 'Update your account password.'}</p>
    <form onSubmit={submit} className="mt-5 space-y-4">
      <div><label className="mb-1 block text-xs font-bold text-slate-700">Current/default password</label><input type="password" required value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" /></div>
      <div><label className="mb-1 block text-xs font-bold text-slate-700">New password</label><input type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" /></div>
      <div><label className="mb-1 block text-xs font-bold text-slate-700">Confirm new password</label><input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" /></div>
      {error && <p role="alert" className="rounded-lg bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">{error}</p>}
      <button type="submit" className="w-full rounded-lg bg-nitt-900 px-4 py-2.5 text-xs font-bold text-white">Save new password</button>
    </form>
  </main>;
};
export default ChangePasswordPage;
