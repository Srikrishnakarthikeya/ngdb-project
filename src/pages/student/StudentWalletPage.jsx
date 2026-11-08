import React, { useEffect, useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { ArrowLeft, CircleDollarSign, Wallet } from 'lucide-react';

const StudentWalletPage = () => {
  const { currentUser } = useAuth();
  const { getWalletBalance, addWalletFunds } = useData();
  const { showToast } = useToast();
  const participantId = currentUser?.id || 'PART-001';

  const [amount, setAmount] = useState('');
  const [feedback, setFeedback] = useState('');
  const [feedbackIsError, setFeedbackIsError] = useState(false);
  const [pendingRequest, setPendingRequest] = useState(null);
  const [qrOrigin, setQrOrigin] = useState(window.location.origin);
  const processedRequestRef = useRef(false);

  useEffect(() => {
    if (!pendingRequest) return undefined;
    let active = true;

    const checkRequest = async () => {
      try {
        const response = await fetch(`/api/wallet-top-ups/${pendingRequest.id}`);
        const request = await response.json();
        if (!response.ok) throw new Error(request.error || 'Unable to check confirmation.');
        if (request.status === 'rejected') {
          if (!active) return;
          setFeedback('Top-up rejected. Your wallet balance has not changed.');
          setFeedbackIsError(true);
          setPendingRequest(null);
          return;
        }
        if (request.status !== 'confirmed' || processedRequestRef.current) return;

        processedRequestRef.current = true;
        const result = addWalletFunds(participantId, request.amount);
        if (!result.success) throw new Error(result.error);

        await fetch(`/api/wallet-top-ups/${request.id}/complete`, { method: 'POST' });
        if (!active) return;
        setFeedback(`Rs. ${request.amount.toLocaleString('en-IN')} added. New balance: Rs. ${result.balance.toLocaleString('en-IN')}.`);
        setFeedbackIsError(false);
        setPendingRequest(null);
        showToast('Wallet updated after mobile confirmation.', 'success');
      } catch (error) {
        if (!active) return;
        setFeedback(error.message);
        setFeedbackIsError(true);
      }
    };

    const intervalId = window.setInterval(checkRequest, 1000);
    checkRequest();
    return () => {
      active = false;
      window.clearInterval(intervalId);
    };
  }, [pendingRequest, participantId, addWalletFunds, showToast]);

  const handleAddFunds = async (event) => {
    event.preventDefault();
    const requestedAmount = Number(amount);
    if (!Number.isSafeInteger(requestedAmount) || requestedAmount <= 0) {
      setFeedback('Enter a positive whole-rupee amount.');
      setFeedbackIsError(true);
      return;
    }

    try {
      const originResponse = await fetch('/api/wallet-top-ups/network-origin');
      const network = await originResponse.json();
      if (!originResponse.ok) throw new Error(network.error || 'Unable to create a mobile-ready QR link.');

      const response = await fetch('/api/wallet-top-ups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ participantId, amount: requestedAmount })
      });
      const request = await response.json();
      if (!response.ok) throw new Error(request.error || 'Unable to create wallet request.');

      processedRequestRef.current = false;
      setQrOrigin(network.origin);
      setPendingRequest(request);
      setFeedback('Scan the QR and confirm the amount on your mobile. Your balance has not changed yet.');
      setFeedbackIsError(false);
      setAmount('');
    } catch (error) {
      setFeedback(error.message);
      setFeedbackIsError(true);
    }
  };

  const topUpUrl = pendingRequest
    ? new URL(`/wallet/confirm?requestId=${encodeURIComponent(pendingRequest.id)}`, qrOrigin)
    : null;

  return (
    <main className="max-w-5xl mx-auto space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <p className="text-xs font-bold uppercase tracking-wider text-amber-700">Student account</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-950">My Wallet</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px] gap-8 items-start">
        <section className="space-y-5">
          <div className="flex items-center gap-4 border-b border-slate-200 pb-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100 text-amber-800">
              <Wallet className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">Available balance</p>
              <p className="text-3xl font-extrabold text-slate-950">Rs. {getWalletBalance(participantId).toLocaleString('en-IN')}</p>
            </div>
          </div>

          <form onSubmit={handleAddFunds} className="max-w-md space-y-3">
            <label htmlFor="wallet-credit" className="block text-sm font-bold text-slate-800">Amount to add</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <CircleDollarSign className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  id="wallet-credit"
                  type="number"
                  min="1"
                  step="1"
                  required
                  inputMode="numeric"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  placeholder="Enter amount in rupees"
                  disabled={!!pendingRequest}
                  className="w-full rounded-md border border-slate-300 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:bg-slate-100"
                />
              </div>
              <button
                type="submit"
                disabled={!!pendingRequest}
                className="rounded-md bg-nitt-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-nitt-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Generate QR
              </button>
            </div>
            {feedback && (
              <p role={feedbackIsError ? 'alert' : 'status'} className={`text-xs ${feedbackIsError ? 'text-rose-700' : 'text-emerald-700'}`}>
                {feedback}
              </p>
            )}
          </form>

          <div className="border-t border-slate-200 pt-4 text-xs text-slate-500">
            Temporary demo credit only. No bank, card, or online payment is made.
          </div>
        </section>

        {pendingRequest && topUpUrl && (
          <aside className="border-t border-slate-200 pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0 space-y-3">
            <h2 className="text-sm font-bold text-slate-900">Confirm Rs. {pendingRequest.amount.toLocaleString('en-IN')}</h2>
            <div className="inline-flex rounded-md border border-slate-200 bg-white p-3">
              <QRCodeSVG value={topUpUrl.toString()} size={208} level="M" includeMargin title="Temporary wallet top-up confirmation QR" />
            </div>
            <p className="text-xs text-slate-500">The amount is added only after the mobile confirmation.</p>
          </aside>
        )}
      </div>
    </main>
  );
};

export default StudentWalletPage;