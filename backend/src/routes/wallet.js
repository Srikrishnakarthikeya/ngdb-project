import express from 'express';
import os from 'node:os';
import { find, findOne, create, update, writeCollection } from '../storage/jsonStore.js';

const router = express.Router();
const getLanAddress = () => Object.values(os.networkInterfaces()).flat().find((a) => a && a.family === 'IPv4' && !a.internal && !a.address.startsWith('169.254.'))?.address;
const syncParticipantWallet = async (participantId, balance) => update('participants', 'Participant_ID', participantId, { Wallet: balance });
router.get('/network-origin', (_req, res) => { const address = getLanAddress(); if (!address) return res.status(503).json({ error: 'Unable to find this computer’s LAN address.' }); res.json({ origin: `http://${address}:3000` }); });

router.get('/wallets/:participantId', async (req, res, next) => {
  try { let wallet = await findOne('wallets', { participantId: req.params.participantId }); if (!wallet) wallet = await create('wallets', { participantId: req.params.participantId, balance: 1000 }); await syncParticipantWallet(req.params.participantId, Number(wallet.balance || 0)); res.json({ participantId: wallet.participantId, balance: wallet.balance }); } catch (error) { next(error); }
});
router.post('/wallets/:participantId/credit', async (req, res, next) => {
  try { const amount = Number(req.body.amount); if (!Number.isSafeInteger(amount) || amount <= 0) return res.status(400).json({ error: 'Enter a positive whole-rupee amount.' }); let wallet = await findOne('wallets', { participantId: req.params.participantId }); wallet = wallet || await create('wallets', { participantId: req.params.participantId, balance: 1000 }); const balance = Number(wallet.balance || 0) + amount; const saved = await update('wallets', 'participantId', req.params.participantId, { balance }); await syncParticipantWallet(req.params.participantId, balance); res.json({ participantId: saved.participantId, balance: saved.balance }); } catch (error) { next(error); }
});
router.post('/wallets/:participantId/debit', async (req, res, next) => {
  try { const amount = Number(req.body.amount); if (!Number.isSafeInteger(amount) || amount <= 0) return res.status(400).json({ error: 'Enter a positive whole-rupee amount.' }); let wallet = await findOne('wallets', { participantId: req.params.participantId }); wallet = wallet || await create('wallets', { participantId: req.params.participantId, balance: 1000 }); const current = Number(wallet.balance || 0); if (current < amount) return res.status(400).json({ error: 'Your wallet balance is too low.' }); const balance = current - amount; const saved = await update('wallets', 'participantId', req.params.participantId, { balance }); await syncParticipantWallet(req.params.participantId, balance); res.json({ participantId: saved.participantId, balance: saved.balance }); } catch (error) { next(error); }
});
router.post('/wallet-top-ups', async (req, res, next) => {
  try { const amount = Number(req.body.amount); if (!req.body.participantId || !Number.isSafeInteger(amount) || amount <= 0) return res.status(400).json({ error: 'A student and positive whole-rupee amount are required.' }); const topUp = await create('walletTopUps', { participantId: req.body.participantId, amount, status: 'awaiting-proof', expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), paymentProof: null }); res.status(201).json({ id: topUp._id, participantId: topUp.participantId, amount: topUp.amount, status: topUp.status, createdAt: topUp.createdAt }); } catch (error) { next(error); }
});
router.get('/wallet-top-ups/:id', async (req, res, next) => {
  try { const topUps = await find('walletTopUps', {}); const topUp = topUps.find((item) => String(item._id) === String(req.params.id)); if (!topUp || new Date(topUp.expiresAt).getTime() < Date.now()) return res.status(404).json({ error: 'This wallet top-up request has expired.' }); res.json({ id: topUp._id, participantId: topUp.participantId, amount: topUp.amount, status: topUp.status }); } catch (error) { next(error); }
});
router.post('/wallet-top-ups/:id/:action', async (req, res, next) => {
  try {
    const topUps = await find('walletTopUps', {});
    const index = topUps.findIndex((item) => String(item._id) === String(req.params.id));
    if (index < 0 || new Date(topUps[index].expiresAt).getTime() < Date.now()) return res.status(404).json({ error: 'This wallet top-up request has expired.' });

    const topUp = topUps[index];
    const { action } = req.params;

    if (action === 'complete') {
      if (topUp.status === 'completed') {
        const wallet = await findOne('wallets', { participantId: topUp.participantId });
        return res.json({ id: topUp._id, participantId: topUp.participantId, amount: topUp.amount, status: 'completed', balance: Number(wallet?.balance || 0), alreadyCompleted: true });
      }
      if (!['confirmed', 'awaiting-proof'].includes(topUp.status)) return res.status(409).json({ error: 'This wallet top-up request cannot be updated.' });
      if (!req.body.paymentProof) return res.status(400).json({ error: 'Payment confirmation screenshot is required.' });

      topUp.status = 'completed';
      topUp.paymentProof = { fileName: req.body.fileName || 'payment-proof', dataUrl: req.body.paymentProof, submittedAt: new Date().toISOString() };
      await writeCollection('walletTopUps', topUps);

      let wallet = await findOne('wallets', { participantId: topUp.participantId });
      wallet = wallet || await create('wallets', { participantId: topUp.participantId, balance: 1000 });
      const balance = Number(wallet.balance || 0) + Number(topUp.amount);
      await update('wallets', 'participantId', topUp.participantId, { balance });
      await syncParticipantWallet(topUp.participantId, balance);
      return res.json({ id: topUp._id, participantId: topUp.participantId, amount: topUp.amount, status: 'completed', balance });
    }

    if (action === 'confirm' && ['pending', 'awaiting-proof'].includes(topUp.status)) topUp.status = 'confirmed';
    else if (action === 'reject' && ['pending', 'awaiting-proof'].includes(topUp.status)) topUp.status = 'rejected';
    else return res.status(409).json({ error: 'This wallet top-up request cannot be updated.' });

    await writeCollection('walletTopUps', topUps);
    return res.json({ id: topUp._id, participantId: topUp.participantId, amount: topUp.amount, status: topUp.status });
  } catch (error) { next(error); }
});
export default router;
