import React, { useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Button from '../../components/common/Button';
import { Shield, Lock, Mail, ArrowLeft } from 'lucide-react';

const AdminLoginPage = () => {
  const [searchParams] = useSearchParams();
  const requestedRole = searchParams.get('role') === 'COORDINATOR' ? 'COORDINATOR' : 'ADMIN';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState(requestedRole);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const { loginAdmin } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');
    setIsLoading(true);

    setTimeout(() => {
      const result = loginAdmin(email, password, selectedRole);
      if (!result.success) {
        setFormError(result.error);
        setIsLoading(false);
        return;
      }
      showToast(`Logged in successfully as ${selectedRole}`, 'success');
      setIsLoading(false);
      navigate(location.state?.from?.pathname || '/admin/dashboard', { replace: true });
    }, 400);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-6">
        {/* Back Link */}
        <div>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-nitt-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Portal Home</span>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-nitt-950 text-rose-400 flex items-center justify-center mx-auto shadow-md border border-slate-800">
              <Shield className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-extrabold text-nitt-950">Staff & Coordinator Login</h2>
            <p className="text-xs text-slate-500">
              Department Administration &bull; National Institute of Technology Trichy
            </p>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setSelectedRole('ADMIN');
                setEmail('');
                setPassword('');
                setFormError('');
              }}
              className={`flex-1 py-2 rounded-lg transition-all ${selectedRole === 'ADMIN' ? 'bg-white text-rose-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
            >
              ADMIN (Full Access)
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedRole('COORDINATOR');
                setEmail('');
                setPassword('');
                setFormError('');
              }}
              className={`flex-1 py-2 rounded-lg transition-all ${selectedRole === 'COORDINATOR' ? 'bg-white text-amber-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
            >
              COORDINATOR / STAFF
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Staff Email / Username
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  autoComplete="off"
                  placeholder="Enter your demo username"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setFormError('');
                  }}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Access Password
                </label>
                <span className="text-[11px] text-slate-400">Project demo account</span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setFormError('');
                  }}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white"
                />
              </div>
            </div>

            {formError && (
              <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-800">
                {formError}
              </p>
            )}

            <div className="pt-2">
              <Button
                variant={selectedRole === 'ADMIN' ? 'danger' : 'accent'}
                type="submit"
                size="lg"
                isLoading={isLoading}
                className="w-full font-bold shadow-md"
              >
                Sign In as {selectedRole}
              </Button>
            </div>
          </form>

          <div className="text-center pt-2 text-xs text-slate-500">
            <span>Are you a student or attendee? </span>
            <Link to="/student-login" className="text-blue-600 font-bold hover:underline">
              Student Login &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
