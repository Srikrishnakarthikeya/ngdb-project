import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { findOne, find, create, update } from '../storage/jsonStore.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'development-only-change-me';
const sign = (user) => jwt.sign({ sub: user.userId, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
const publicUser = (user) => ({ id: user.userId, name: user.name, email: user.email, userName: user.userName || user.email, role: user.role, mustChangePassword: Boolean(user.mustChangePassword), ...(user.profile || {}) });

router.post('/student/register', async (req, res, next) => {
  try {
    const { name, email, phone, institution, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'Name, email and password are required.' });
    const normalizedEmail = String(email).trim().toLowerCase();
    const existing = await findOne('users', {});
    const users = await find('users', {});
    if (users.some((user) => user.email.toLowerCase() === normalizedEmail)) return res.status(409).json({ error: 'An account already exists with this email.' });
    const userId = `PART-${String(Date.now()).slice(-6)}`;
    const passwordHash = await bcrypt.hash(password, 10);
    const profile = { category: 'Student', institution, institution_Name: institution, Institution_Name: institution, phone, Phone: phone, branch: '', year: '', rollNo: '' };
    const user = await create('users', { userId, name: name.trim(), email: normalizedEmail, passwordHash, role: 'STUDENT', profile });
    await create('participants', { Participant_ID: userId, Name: name.trim(), Email: normalizedEmail, Phone: phone || '', Category: 'Student', Institution_Name: institution || '', Branch: '', Year_of_Study: '', Roll_No: '', Wallet: 1000 });
    await create('wallets', { participantId: userId, balance: 1000 });
    res.status(201).json({ token: sign(user), user: publicUser(user) });
  } catch (error) { next(error); }
});

router.post('/student/login', async (req, res, next) => {
  try {
    const identifier = String(req.body.identifier || req.body.email || '').trim().toLowerCase();
    if (!identifier || !req.body.password) return res.status(400).json({ error: 'Email/ID and password are required.' });
    const users = await find('users', { role: 'STUDENT' });
    const user = users.find((item) => item.email?.toLowerCase() === identifier || item.userId?.toLowerCase() === identifier);
    if (!user || !(await bcrypt.compare(req.body.password, user.passwordHash))) return res.status(401).json({ error: 'Incorrect email/ID or password.' });
    res.json({ token: sign(user), user: publicUser(user) });
  } catch (error) { next(error); }
});

router.post('/staff/login', async (req, res, next) => {
  try {
    const role = req.body.role === 'COORDINATOR' ? 'COORDINATOR' : 'ADMIN';
    const identifier = String(req.body.email || req.body.userName || '').trim().toLowerCase();
    const users = await find('users', { role });
    const user = users.find((item) => item.email?.toLowerCase() === identifier || item.userName?.toLowerCase() === identifier);
    if (!user || !(await bcrypt.compare(req.body.password || '', user.passwordHash))) return res.status(401).json({ error: 'Incorrect email, username or password.' });
    res.json({ token: sign(user), user: publicUser(user) });
  } catch (error) { next(error); }
});

router.post('/change-password', async (req, res, next) => {
  try {
    const { userId, currentPassword, newPassword } = req.body;
    if (!userId || !currentPassword || !newPassword) return res.status(400).json({ error: 'User, current password and new password are required.' });
    if (String(newPassword).length < 8) return res.status(400).json({ error: 'New password must be at least 8 characters.' });
    const user = await findOne('users', { userId });
    if (!user || !(await bcrypt.compare(currentPassword, user.passwordHash))) return res.status(401).json({ error: 'Current password is incorrect.' });
    const passwordHash = await bcrypt.hash(newPassword, 10);
    const updated = await update('users', 'userId', userId, { passwordHash, mustChangePassword: false });
    res.json({ token: sign(updated), user: publicUser(updated), message: 'Password changed successfully.' });
  } catch (error) { next(error); }
});
export default router;
