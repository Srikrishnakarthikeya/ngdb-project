import express from 'express';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import { create, find, findOne, update, remove, writeCollection } from '../storage/jsonStore.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

const makeDefaultPassword = () => `NITC@${Math.random().toString(36).slice(-6).toUpperCase()}`;

const syncAssignedEvents = async () => {
  const assignments = await find('eventCoordinators', {});
  const users = await find('users', { role: 'COORDINATOR' });
  for (const user of users) {
    const assignedEvents = assignments.filter((item) => item.Coordinator_ID === user.userId).map((item) => item.Event_ID);
    await update('users', 'userId', user.userId, { profile: { ...(user.profile || {}), assignedEvents: [...new Set(assignedEvents)] } });
  }
};

const sendCredentials = async ({ name, email, userName, password }) => {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('[Coordinator Email] SMTP credentials are not configured; no email was sent.');
    return { sent: false, reason: 'SMTP credentials are not configured' };
  }
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_SECURE || 'false') === 'true',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
  });
  const info = await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: email,
    subject: 'Your NIT Trichy coordinator account',
    text: `Hello ${name},\n\nYour coordinator account has been created.\nUsername/email: ${userName}\nDefault password: ${password}\n\nPlease login and change your password immediately.\n`
  });
  console.log(`[Coordinator Email] Successfully sent credentials to ${email}. Message ID: ${info.messageId || 'not-provided'}`);
  return { sent: true, messageId: info.messageId || null };
};

router.post('/coordinator-management', requireAdmin, async (req, res, next) => {
  try {
    const { Name, Email, UserName, Contact, Designation, Role, Department, Specialization } = req.body;
    const email = String(Email || '').trim().toLowerCase();
    const userName = String(UserName || email).trim().toLowerCase();
    if (!Name || !email || !userName) return res.status(400).json({ error: 'Name, email and username are required.' });
    if (await findOne('users', { email })) return res.status(409).json({ error: 'A user already exists with this email.' });

    const coordinators = await find('coordinators', {});
    const nextNumber = Math.max(0, ...coordinators.map((item) => Number(String(item.Coordinator_ID || '').replace(/\D/g, '')) || 0)) + 1;
    const coordinatorId = `COORD-${String(nextNumber).padStart(2, '0')}`;
    const password = makeDefaultPassword();
    const passwordHash = await bcrypt.hash(password, 10);

    const coordinator = await create('coordinators', {
      Coordinator_ID: coordinatorId,
      Name: String(Name).trim(), Email: email, UserName: userName, Contact: Contact || '',
      Designation: Designation || 'Coordinator', Role: Role || 'Faculty Coordinator', Department: Department || 'DEPT-CA', Specialization: Specialization || ''
    });
    await create('users', {
      userId: coordinatorId,
      name: String(Name).trim(),
      email,
      userName,
      passwordHash,
      role: 'COORDINATOR',
      mustChangePassword: true,
      profile: { designation: Designation || 'Coordinator', department: Department || 'DEPT-CA', assignedEvents: [] }
    });

    console.log(`[Development Coordinator Account] ${Name} | Username/email: ${userName} | Default password: ${password}`);
    let emailResult;
    try { emailResult = await sendCredentials({ name: Name, email, userName, password }); }
    catch (error) {
      console.error(`[Coordinator Email] Failed to send credentials to ${email}`);
      console.error(`[Coordinator Email] Error code: ${error.code || 'UNKNOWN'}`);
      console.error(`[Coordinator Email] Error: ${error.message || String(error)}`);
      if (error.response) console.error(`[Coordinator Email] Server response: ${error.response}`);
      emailResult = { sent: false, reason: error.message };
    }

    res.status(201).json({ coordinator, defaultPassword: password, emailResult });
  } catch (error) { next(error); }
});

router.put('/coordinator-management/:id', requireAdmin, async (req, res, next) => {
  try {
    const coordinatorId = decodeURIComponent(req.params.id);
    const coordinator = await update('coordinators', 'Coordinator_ID', coordinatorId, req.body);
    if (!coordinator) return res.status(404).json({ error: 'Coordinator not found.' });
    const email = String(req.body.Email || coordinator.Email || '').trim().toLowerCase();
    const userName = String(req.body.UserName || coordinator.UserName || email).trim().toLowerCase();
    await update('users', 'userId', coordinatorId, { name: coordinator.Name, email, userName, profile: { ...(await findOne('users', { userId: coordinatorId }))?.profile, designation: coordinator.Designation, department: coordinator.Department } });
    res.json(coordinator);
  } catch (error) { next(error); }
});

router.delete('/coordinator-management/:id', requireAdmin, async (req, res, next) => {
  try {
    const coordinatorId = decodeURIComponent(req.params.id);
    const coordinatorsDeleted = await remove('coordinators', 'Coordinator_ID', coordinatorId);
    await remove('users', 'userId', coordinatorId);
    const assignments = await find('eventCoordinators', {});
    await writeCollection('eventCoordinators', assignments.filter((item) => item.Coordinator_ID !== coordinatorId));
    if (!coordinatorsDeleted) return res.status(404).json({ error: 'Coordinator not found.' });
    res.status(204).end();
  } catch (error) { next(error); }
});

router.post('/event-coordinators', requireAdmin, async (req, res, next) => {
  try {
    const { Event_ID, Coordinator_ID, Assigned_Role } = req.body;
    if (!Event_ID || !Coordinator_ID) return res.status(400).json({ error: 'Event and coordinator are required.' });
    const existing = await findOne('eventCoordinators', { Event_ID, Coordinator_ID });
    if (existing) return res.status(409).json({ error: 'This coordinator is already assigned to the event.' });
    const assignment = await create('eventCoordinators', { Event_ID, Coordinator_ID, Assigned_Role: Assigned_Role || 'Event Coordinator' });
    await syncAssignedEvents();
    res.status(201).json(assignment);
  } catch (error) { next(error); }
});

router.delete('/event-coordinators/:eventId/:coordinatorId', requireAdmin, async (req, res, next) => {
  try {
    const assignments = await find('eventCoordinators', {});
    const eventId = decodeURIComponent(req.params.eventId);
    const coordinatorId = decodeURIComponent(req.params.coordinatorId);
    const remaining = assignments.filter((item) => !(item.Event_ID === eventId && item.Coordinator_ID === coordinatorId));
    if (remaining.length === assignments.length) return res.status(404).json({ error: 'Assignment not found.' });
    await writeCollection('eventCoordinators', remaining);
    await syncAssignedEvents();
    res.status(204).end();
  } catch (error) { next(error); }
});

router.post('/event-coordinators/search', async (req, res, next) => {
  try {
    const query = String(req.body.query || '').trim().toLowerCase();
    const coordinators = await find('coordinators', {});
    const matches = coordinators.filter((item) => !query || [item.Name, item.Email, item.UserName, item.Coordinator_ID].some((value) => String(value || '').toLowerCase().includes(query)));
    res.json(matches);
  } catch (error) { next(error); }
});

export default router;
