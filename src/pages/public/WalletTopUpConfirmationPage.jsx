import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Wallet } from 'lucide-react';

const WalletTopUpConfirmationPage = () => {
  const [searchParams] = useSearchParams();
  const requestId = searchParams.get('requestId');
  const [topUpRequest, setTopUpRequest] = useState(null);
  const [error, setError] = useState('');
  const [isDeciding, setIsDeciding] = useState(false);

  useEffect(() => {
    let active = true;
    const loadRequest = async () => {
      try {
        const response = await fetch(`/api/wallet-top-ups/${encodeURIComponent(requestId || '')}`);
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Wallet request not found.');
        if (active) setTopUpRequest(result);
      } catch (requestError) {
        if (active) setError(requestError.message);
      }
    };

    loadRequest();
    return () => { active = false; };
  }, [requestId]);

  const handleDecision = async (decision) => {
    setIsDeciding(true);
    setError('');
    try {
      const action = decision === 'proceed' ? 'confirm' : 'reject';
      const response = await fetch(`/api/wallet-top-ups/${encodeURIComponent(requestId)}/${action}`, { method: 'POST' });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Unable to update this request.');
      setTopUpRequest(result);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsDeciding(false);
    }
  };

  const isConfirmed = ['confirmed', 'completed'].includes(topUpRequest?.status);
  const isRejected = topUpRequest?.status === 'rejected';

  return (
    <main className="max-w-md mx-auto px-4 py-10">
      <div className="border-b border-slate-200 pb-4">
        <p className="text-xs font-bold uppercase tracking-wider text-amber-700">Temporary wallet credit</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-950">Confirm top-up</h1>
      </div>

      <section className="mt-6 space-y-5">
        {error && <p role="alert" className="rounded-md border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">{error}</p>}

        {topUpRequest && (
          <>
            <div className="flex items-center gap-3 border-b border-slate-200 pb-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-md bg-amber-100 text-amber-800">
                <Wallet className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500">Amount requested</p>
                <p className="text-3xl font-extrabold text-slate-950">Rs. {topUpRequest.amount.toLocaleString('en-IN')}</p>
              </div>
            </div>

            {isConfirmed ? (
              <div role="status" className="flex items-start gap-3 rounded-md border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
                <CheckCircle2 className="h-5 w-5 shrink-0" />
                <p>Confirmed. The student wallet will update when the request is received by the wallet page.</p>
              </div>
            ) : isRejected ? (
              <div role="status" className="rounded-md border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                Top-up rejected. The student wallet was not changed.
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-slate-600">Proceed to add this temporary amount, or reject it. No payment will be processed.</p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleDecision('proceed')}
                    disabled={isDeciding || topUpRequest.status !== 'pending'}
                    className="rounded-md bg-nitt-900 px-4 py-3 text-sm font-bold text-white hover:bg-nitt-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isDeciding ? 'Please wait…' : 'Proceed'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDecision('reject')}
                    disabled={isDeciding || topUpRequest.status !== 'pending'}
                    className="rounded-md border border-slate-300 bg-white px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Reject
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        <p className="border-t border-slate-200 pt-4 text-xs text-slate-500">
          This is a temporary local wallet update. No bank, card, or online payment is made.
        </p>
        <Link to="/student/wallet" className="inline-flex text-xs font-bold text-blue-700 hover:underline">
          Open student wallet
        </Link>
      </section>
    </main>
  );
};

export default WalletTopUpConfirmationPage;