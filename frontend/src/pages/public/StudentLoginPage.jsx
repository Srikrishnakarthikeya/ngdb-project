import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Button from '../../components/common/Button';
import { GraduationCap, Lock, Mail, ArrowLeft, UserPlus } from 'lucide-react';

const StudentLoginPage = () => {
  const [emailOrId, setEmailOrId] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [formError, setFormError] = useState('');
  const [details, setDetails] = useState({ name: '', email: '', phone: '', institution: '', password: '', confirmPassword: '' });
  const [isLoading, setIsLoading] = useState(false);

  const { loginStudent, registerStudent } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (isRegistering && details.password !== details.confirmPassword) {
      setFormError('Passwords do not match.');
      return;
    }
    setIsLoading(true);

    const result = isRegistering ? await registerStudent(details) : await loginStudent(emailOrId, password);
    if (!result.success) {
      setFormError(result.error);
      setIsLoading(false);
      return;
    }
    showToast(isRegistering ? 'Student account created!' : 'Welcome back!', 'success');
    setIsLoading(false);
    navigate('/student/dashboard');
  };

  const handleQuickFill = (email) => {
    setIsRegistering(false);
    setFormError('');
    setEmailOrId(email);
    setPassword('demoPass123');
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
            <div className="w-12 h-12 rounded-xl bg-nitt-900 text-amber-400 flex items-center justify-center mx-auto shadow-md">
              <GraduationCap className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-extrabold text-nitt-950">
              {isRegistering ? 'Create Student Account' : 'Student / Participant Login'}
            </h2>
            <p className="text-xs text-slate-500">
              Department of Computer Applications &bull; NIT Trichy
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                {isRegistering ? 'Full Name' : 'Student ID / Webmail'}
              </label>
              <div className="relative">
                {isRegistering ? <UserPlus className="w-4 h-4 text-slate-400 absolute left-3 top-3" /> : <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />}
                <input
                  type={isRegistering ? 'text' : 'text'}
                  required
                  placeholder={isRegistering ? 'Your full name' : 'e.g. prasad45@gmail.com or 205123045'}
                  value={isRegistering ? details.name : emailOrId}
                  onChange={(e) => isRegistering ? setDetails({ ...details, name: e.target.value }) : setEmailOrId(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>
            </div>

            {isRegistering && <>
              {[
                ['email', 'Email address', 'you@example.com', 'email'],
                ['phone', 'Phone number', '+91 ...', 'tel'],
                ['institution', 'College / Institution', 'Your institution', 'text']
              ].map(([field, label, placeholder, type]) => <div key={field}>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">{label}</label>
                <input type={type} required value={details[field]} placeholder={placeholder} onChange={(e) => setDetails({ ...details, [field]: e.target.value })} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white" />
              </div>)}
            </>}

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  {isRegistering ? 'Create Password' : 'Password'}
                </label>
                <a
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault();
                    showToast('Default password is set for demo evaluation.', 'info');
                  }}
                  className="text-[11px] text-blue-600 hover:underline"
                >
                  Forgot Password?
                </a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={isRegistering ? details.password : password}
                  onChange={(e) => isRegistering ? setDetails({ ...details, password: e.target.value }) : setPassword(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>
            </div>

            {isRegistering && <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Confirm Password</label>
              <input type="password" required minLength={6} value={details.confirmPassword} onChange={(e) => setDetails({ ...details, confirmPassword: e.target.value })} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white" />
            </div>}

            {formError && <p role="alert" className="text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">{formError}</p>}

            <div className="pt-2">
              <Button
                variant="primary"
                type="submit"
                size="lg"
                isLoading={isLoading}
                className="w-full font-bold shadow-md bg-nitt-900 hover:bg-nitt-800"
              >
                {isRegistering ? 'Create Account' : 'Sign In to Student Portal'}
              </Button>
            </div>
          </form>

          {!isRegistering && <div className="pt-4 border-t border-slate-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Quick One-Click Demo Credentials
            </span>
            <div className="flex flex-col gap-1.5">
              <button
                type="button"
                onClick={() => handleQuickFill('prasad45@gmail.com')}
                className="text-left px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs flex items-center justify-between transition-colors"
              >
                <div>
                  <span className="font-bold text-slate-800 block">Prasad (MCA 2nd Year)</span>
                  <span className="text-[10px] text-slate-500">prasad45@gmail.com</span>
                </div>
                <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold">Use</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('xyz@gmail.com')}
                className="text-left px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs flex items-center justify-between transition-colors"
              >
                <div>
                  <span className="font-bold text-slate-800 block">Student Participant</span>
                  <span className="text-[10px] text-slate-500">xyz@gmail.com</span>
                </div>
                <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold">Use</span>
              </button>
            </div>
          </div>}

          <div className="text-center text-xs text-slate-600">
            {isRegistering ? 'Already have an account? ' : 'New student? '}
            <button type="button" onClick={() => { setIsRegistering(!isRegistering); setFormError(''); }} className="text-blue-600 font-bold hover:underline">
              {isRegistering ? 'Sign in' : 'Create an account'}
            </button>
          </div>

          <div className="text-center pt-2 text-xs text-slate-500">
            <span>Are you a faculty coordinator? </span>
            <Link to="/admin-login" className="text-blue-600 font-bold hover:underline">
              Admin Login &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentLoginPage;
