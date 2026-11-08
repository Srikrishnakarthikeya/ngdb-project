import React, { useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import {
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Wallet
} from 'lucide-react';

const EventPaymentPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const { currentUser } = useAuth();
  const { registrations, getEvent, getVenue, getWalletBalance, payForEvent } = useData();
  const { showToast } = useToast();
  const [paymentResult, setPaymentResult] = useState(null);
  const [paymentError, setPaymentError] = useState('');

  const event = getEvent(id);
  const participantId = currentUser?.id || 'PART-001';
  const walletBalance = getWalletBalance(participantId);
  const entryFee = Number(event?.RegistrationFee) || 99;
  const participant = location.state?.participant || {
    name: currentUser?.name || 'Prasad',
    email: currentUser?.email || 'prasad45@gmail.com'
  };
  const registrationType = location.state?.registrationType || 'Individual Participant';
  const existingRegistration = registrations.find((registration) =>
    registration.Event_ID === id &&
    registration.Participant_ID === participantId &&
    !['Cancelled', 'Rejected'].includes(registration.Status)
  );
  const confirmedRegistration = paymentResult?.registration || existingRegistration;

  const handlePayment = (eventSubmit) => {
    eventSubmit.preventDefault();
    if (confirmedRegistration) return;

    const result = payForEvent({
      participantId,
      eventId: id,
      registrationType
    });
    if (!result.success) {
      setPaymentError(result.error);
      showToast(result.error, 'error');
      return;
    }
    setPaymentError('');
    setPaymentResult(result);
    showToast('Wallet payment successful. Your registration is confirmed.', 'success');
  };

  if (!event) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold text-slate-900">Event Not Found</h1>
        <p className="text-sm text-slate-500">This event is unavailable for payment.</p>
        <Link to="/events" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700">
          <ArrowLeft className="w-4 h-4" /> Back to Events
        </Link>
      </main>
    );
  }

  const venue = getVenue(event.Venue_ID);

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Link
        to={`/events/${event.Event_ID}`}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900"
      >
        <ArrowLeft className="w-4 h-4" /> Back to {event.Event_Name}
      </Link>

      <div className="border-b border-slate-200 pb-4">
        <p className="text-xs font-bold uppercase tracking-wider text-blue-700">Event checkout</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-950">Complete Payment</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-8 items-start">
        <section className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 space-y-5">
          {confirmedRegistration ? (
            <div className="text-center py-6 space-y-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <div>
                <h2 className="text-xl font-bold text-slate-900">Payment confirmed</h2>
                <p className="mt-1 text-sm text-slate-500">Your place at {event.Event_Name} is confirmed.</p>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-md p-4 text-left max-w-sm mx-auto">
                <p className="text-xs text-slate-500">Registration ID</p>
                <p className="font-mono font-bold text-slate-900">{confirmedRegistration.Registration_ID}</p>
                <p className="mt-2 text-sm font-semibold text-emerald-700">Rs. {entryFee} paid from wallet</p>
                <p className="mt-1 text-xs text-slate-500">
                  Wallet balance: Rs. {paymentResult?.balance ?? walletBalance}
                </p>
              </div>
              <Link to="/student/registrations" className="inline-flex px-4 py-2 rounded-md bg-nitt-900 text-white text-sm font-bold">
                View My Registrations
              </Link>
            </div>
          ) : (
            <form onSubmit={handlePayment} className="space-y-5">
              <div className="flex items-center justify-between gap-4 bg-blue-50 border border-blue-200 rounded-md p-4">
                <div className="flex items-center gap-3">
                  <Wallet className="w-5 h-5 text-blue-700" />
                  <div>
                    <p className="text-sm font-bold text-slate-900">Student wallet</p>
                    <p className="text-xs text-slate-600">Balance available</p>
                  </div>
                </div>
                <p className="text-lg font-extrabold text-blue-900 whitespace-nowrap">
                  Rs. {walletBalance.toLocaleString('en-IN')}
                </p>
              </div>

              {paymentError && (
                <p role="alert" className="rounded-md border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">
                  {paymentError}
                </p>
              )}

              <div className="flex items-start gap-2 rounded-md bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-900">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <p>Payment is deducted from your student wallet. This demo does not connect to a bank or payment gateway.</p>
              </div>

              <button type="submit" disabled={walletBalance < entryFee} className="w-full px-4 py-3 rounded-md bg-nitt-900 text-white text-sm font-bold hover:bg-nitt-800 disabled:cursor-not-allowed disabled:opacity-50">
                Pay Rs. {entryFee} from Wallet
              </button>
            </form>
          )}
        </section>

        <aside className="border-t lg:border-t-0 lg:border-l border-slate-200 pt-5 lg:pt-0 lg:pl-6 space-y-4">
          <h2 className="text-sm font-bold text-slate-900">Order summary</h2>
          <div>
            <p className="font-bold text-slate-900">{event.Event_Name}</p>
            <p className="mt-1 text-xs text-slate-500">{event.Start_Date} · {venue?.Venue_Name || 'Campus venue'}</p>
          </div>
          <div className="border-t border-slate-200 pt-3 space-y-2 text-xs">
            <div className="flex justify-between gap-4 text-slate-600">
              <span>Entry fee</span><span>Rs. {entryFee}</span>
            </div>
            <div className="flex justify-between gap-4 border-t border-slate-200 pt-2 font-bold text-slate-900">
              <span>Total</span><span>Rs. {entryFee}</span>
            </div>
          </div>
          <div className="text-xs text-slate-500">
            <p>{participant.name}</p>
            <p>{participant.email}</p>
          </div>
        </aside>
      </div>
    </main>
  );
};

export default EventPaymentPage;