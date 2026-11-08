import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Button from '../../components/common/Button';
import { HeartHandshake, Lock, Mail, ArrowLeft, UserPlus } from 'lucide-react';

const VolunteerLoginPage = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [details, setDetails] = useState({ name: '', email: '', phone: '', institution: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginVolunteer, registerVolunteer } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    if (isRegistering && details.password !== details.confirmPassword) return setError('Passwords do not match.');
    setLoading(true);
    const result = isRegistering ? await registerVolunteer(details) : await loginVolunteer(identifier, password);
    setLoading(false);
    if (!result.success) return setError(result.error);
    showToast(isRegistering ? 'Volunteer account created!' : 'Welcome back!', 'success');
    navigate('/volunteer/dashboard', { replace: true });
  };

  return <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
    <div className="max-w-md w-full space-y-6">
      <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500"><ArrowLeft className="h-4 w-4" />Back to Portal Home</Link>
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
        <div className="mb-6 text-center"><div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-700 text-white"><HeartHandshake className="h-7 w-7" /></div><h1 className="mt-3 text-2xl font-extrabold text-nitt-950">{isRegistering ? 'Volunteer Sign Up' : 'Volunteer Sign In'}</h1><p className="mt-1 text-xs text-slate-500">Request event assignments and manage attendance duties</p></div>
        <form onSubmit={submit} className="space-y-4">
          {isRegistering ? <>
            <input required placeholder="Full name" value={details.name} onChange={(e) => setDetails({ ...details, name: e.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-xs" />
            <input required type="email" placeholder="Email address" value={details.email} onChange={(e) => setDetails({ ...details, email: e.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-xs" />
            <input required placeholder="Phone number" value={details.phone} onChange={(e) => setDetails({ ...details, phone: e.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-xs" />
            <input required placeholder="College / Institution" value={details.institution} onChange={(e) => setDetails({ ...details, institution: e.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-xs" />
          </> : <div className="relative"><Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" /><input required placeholder="Volunteer email or ID" value={identifier} onChange={(e) => setIdentifier(e.target.value)} className="w-full rounded-lg border border-slate-200 py-2.5 pl-9 pr-3 text-xs" /></div>}
          <div className="relative"><Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" /><input required minLength={6} type="password" placeholder={isRegistering ? 'Create password' : 'Password'} value={isRegistering ? details.password : password} onChange={(e) => isRegistering ? setDetails({ ...details, password: e.target.value }) : setPassword(e.target.value)} className="w-full rounded-lg border border-slate-200 py-2.5 pl-9 pr-3 text-xs" /></div>
          {isRegistering && <input required minLength={6} type="password" placeholder="Confirm password" value={details.confirmPassword} onChange={(e) => setDetails({ ...details, confirmPassword: e.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-xs" />}
          {error && <p className="rounded-lg bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">{error}</p>}
          <Button type="submit" size="lg" isLoading={loading} className="w-full bg-emerald-700 text-white">{isRegistering ? 'Create Volunteer Account' : 'Sign In'}</Button>
        </form>
        <button type="button" onClick={() => { setIsRegistering(!isRegistering); setError(''); }} className="mt-5 w-full text-center text-xs font-bold text-emerald-700">{isRegistering ? 'Already registered? Sign in' : 'New volunteer? Create an account'}</button>
      </div>
    </div>
  </div>;
};
export default VolunteerLoginPage;
