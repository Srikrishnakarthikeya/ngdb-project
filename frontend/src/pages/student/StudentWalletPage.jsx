import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { CircleDollarSign, Upload, Wallet } from 'lucide-react';

const StudentWalletPage = () => {
  const { currentUser } = useAuth();
  const { getWalletBalance, refresh } = useData();
  const { showToast } = useToast();
  const participantId = currentUser?.id || 'PART-001';

  const [amount, setAmount] = useState('');
  const [feedback, setFeedback] = useState('');
  const [feedbackIsError, setFeedbackIsError] = useState(false);
  const [pendingRequest, setPendingRequest] = useState(null);
  const [proofFile, setProofFile] = useState(null);
  const [proofPreview, setProofPreview] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const resetPaymentForm = () => {
    setPendingRequest(null);
    setProofFile(null);
    setProofPreview('');
  };

  const handleOpenPaymentForm = async (event) => {
    event.preventDefault();
    const requestedAmount = Number(amount);
    if (!Number.isSafeInteger(requestedAmount) || requestedAmount <= 0) {
      setFeedback('Enter a positive whole-rupee amount.');
      setFeedbackIsError(true);
      return;
    }

    try {
      const response = await fetch('/api/wallet-top-ups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ participantId, amount: requestedAmount })
      });
      const request = await response.json();
      if (!response.ok) throw new Error(request.error || 'Unable to create wallet request.');

      setPendingRequest(request);
      setProofFile(null);
      setProofPreview('');
      setFeedback('Scan the QR, pay the shown amount, and upload the confirmation screenshot.');
      setFeedbackIsError(false);
    } catch (error) {
      setFeedback(error.message);
      setFeedbackIsError(true);
    }
  };

  const handleProofChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setFeedback('Please upload an image screenshot.');
      setFeedbackIsError(true);
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setFeedback('Screenshot must be smaller than 8 MB.');
      setFeedbackIsError(true);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setProofFile(file);
      setProofPreview(String(reader.result));
      setFeedback('');
      setFeedbackIsError(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitProof = async (event) => {
    event.preventDefault();
    if (!pendingRequest) return;
    if (!proofFile || !proofPreview) {
      setFeedback('Upload the payment confirmation screenshot first.');
      setFeedbackIsError(true);
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`/api/wallet-top-ups/${encodeURIComponent(pendingRequest.id)}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentProof: proofPreview, fileName: proofFile.name })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Unable to submit payment confirmation.');

      await refresh();
      showToast(`Rs. ${pendingRequest.amount.toLocaleString('en-IN')} added to your wallet.`, 'success');
      resetPaymentForm();
      setAmount('');
      setFeedback('Top-up successful. Your wallet balance is updated.');
      setFeedbackIsError(false);
    } catch (error) {
      setFeedback(error.message);
      setFeedbackIsError(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="max-w-5xl mx-auto space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <p className="text-xs font-bold uppercase tracking-wider text-amber-700">Student account</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-950">My Wallet</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-8 items-start">
        <section className="space-y-5">
          <div className="flex items-center gap-4 border-b border-slate-200 pb-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100 text-amber-800"><Wallet className="h-6 w-6" /></div>
            <div>
              <p className="text-xs font-semibold text-slate-500">Available balance</p>
              <p className="text-3xl font-extrabold text-slate-950">Rs. {getWalletBalance(participantId).toLocaleString('en-IN')}</p>
            </div>
          </div>

          {!pendingRequest ? (
            <form onSubmit={handleOpenPaymentForm} className="max-w-md space-y-3">
              <label htmlFor="wallet-credit" className="block text-sm font-bold text-slate-800">Amount to add</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <CircleDollarSign className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input id="wallet-credit" type="number" min="1" step="1" required inputMode="numeric" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="Enter amount in rupees" className="w-full rounded-md border border-slate-300 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" />
                </div>
                <button type="submit" className="rounded-md bg-nitt-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-nitt-800">Continue</button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSubmitProof} className="max-w-md space-y-4 rounded-lg border border-slate-200 bg-white p-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Payment confirmation</p>
                <h2 className="mt-1 text-lg font-bold text-slate-950">Confirm Rs. {pendingRequest.amount.toLocaleString('en-IN')}</h2>
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-center">
                <QRCodeSVG value={`NITT Wallet top-up|${participantId}|${pendingRequest.amount}`} size={190} level="M" includeMargin />
                <p className="mt-2 text-xs text-slate-500">Demo payment QR</p>
              </div>

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-800">Upload payment screenshot</span>
                <input type="file" accept="image/*" onChange={handleProofChange} className="block w-full text-xs text-slate-600 file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-xs file:font-bold file:text-slate-700" />
              </label>

              {proofPreview && <img src={proofPreview} alt="Payment confirmation preview" className="max-h-48 w-full rounded-md border border-slate-200 object-contain" />}

              <div className="flex gap-2">
                <button type="button" onClick={resetPaymentForm} className="flex-1 rounded-md border border-slate-300 px-4 py-2.5 text-xs font-bold text-slate-700">Cancel</button>
                <button type="submit" disabled={submitting || !proofFile} className="flex-1 rounded-md bg-nitt-900 px-4 py-2.5 text-xs font-bold text-white disabled:cursor-not-allowed disabled:opacity-50">{submitting ? 'Submitting…' : 'Submit payment proof'}</button>
              </div>
            </form>
          )}

          {feedback && <p role={feedbackIsError ? 'alert' : 'status'} className={`text-xs ${feedbackIsError ? 'text-rose-700' : 'text-emerald-700'}`}>{feedback}</p>}
          <div className="border-t border-slate-200 pt-4 text-xs text-slate-500"><span className="inline-flex items-center gap-1.5"><Upload className="h-3.5 w-3.5" /> Demo payment confirmation only. No real payment is processed.</span></div>
        </section>
      </div>
    </main>
  );
};

export default StudentWalletPage;
