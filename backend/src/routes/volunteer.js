import express from 'express';
import { authenticate, requireDataMutation } from '../middleware/auth.js';
import { create, find, findOne, readCollection, update, writeCollection } from '../storage/jsonStore.js';

const router = express.Router();

const overlaps = (first, second) => {
  const firstStart = new Date(first.Start_Date || first.Event_Date || first.Start_DateTime || first.Start_Date).getTime();
  const firstEnd = new Date(first.End_Date || first.End_DateTime || first.Start_Date || first.Event_Date).getTime();
  const secondStart = new Date(second.Start_Date || second.Event_Date || second.Start_DateTime).getTime();
  const secondEnd = new Date(second.End_Date || second.End_DateTime || second.Start_Date || second.Event_Date).getTime();
  if (![firstStart, firstEnd, secondStart, secondEnd].every(Number.isFinite)) return false;
  return firstStart <= secondEnd && secondStart <= firstEnd;
};

router.post('/volunteer-applications/:eventId', authenticate, async (req, res, next) => {
  try {
    if (req.user.role !== 'VOLUNTEER') return res.status(403).json({ error: 'Only volunteer accounts can request volunteering.' });
    const { eventId } = req.params;
    const event = await findOne('events', { Event_ID: eventId });
    if (!event) return res.status(404).json({ error: 'Event not found.' });
    const volunteer = await findOne('users', { userId: req.user.sub });
    if (!volunteer) return res.status(404).json({ error: 'Volunteer account not found.' });

    const applications = await find('volunteerApplications', { volunteerId: req.user.sub });
    if (applications.some((item) => item.Event_ID === eventId && item.Status !== 'Rejected')) return res.status(409).json({ error: 'You already have a pending or accepted request for this event.' });

    const competing = [];
    for (const application of applications.filter((item) => item.Status !== 'Rejected')) {
      const otherEvent = await findOne('events', { Event_ID: application.Event_ID });
      if (otherEvent && overlaps(event, otherEvent)) competing.push(otherEvent);
    }
    if (competing.length) return res.status(409).json({ error: `This event overlaps with ${competing.map((item) => item.Event_Name).join(', ')}. You cannot volunteer for overlapping events.`, conflicts: competing.map((item) => item.Event_ID) });

    const application = await create('volunteerApplications', {
      applicationId: `VOLREQ-${String(Date.now()).slice(-8)}`,
      volunteerId: volunteer.userId,
      volunteerName: volunteer.name,
      volunteerEmail: volunteer.email,
      Event_ID: eventId,
      Status: 'Pending'
    });
    res.status(201).json(application);
  } catch (error) { next(error); }
});

router.get('/volunteer-applications/my', authenticate, async (req, res, next) => {
  try {
    if (req.user.role !== 'VOLUNTEER') return res.status(403).json({ error: 'Volunteer access required.' });
    res.json(await find('volunteerApplications', { volunteerId: req.user.sub }));
  } catch (error) { next(error); }
});

router.get('/volunteer-applications/coordinator', authenticate, async (req, res, next) => {
  try {
    if (req.user.role !== 'COORDINATOR' && req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Coordinator access required.' });
    const applications = await find('volunteerApplications', {});
    if (req.user.role === 'ADMIN') return res.json(applications);
    const assignments = await find('eventCoordinators', { Coordinator_ID: req.user.sub });
    const assignedIds = new Set(assignments.map((item) => item.Event_ID));
    res.json(applications.filter((item) => assignedIds.has(item.Event_ID)));
  } catch (error) { next(error); }
});

router.put('/volunteer-applications/:applicationId/:status', authenticate, async (req, res, next) => {
  try {
    if (!['Accepted', 'Rejected'].includes(req.params.status)) return res.status(400).json({ error: 'Status must be Accepted or Rejected.' });
    const application = await findOne('volunteerApplications', { applicationId: req.params.applicationId });
    if (!application) return res.status(404).json({ error: 'Volunteer request not found.' });

    if (req.user.role === 'COORDINATOR') {
      const assignment = await findOne('eventCoordinators', { Event_ID: application.Event_ID, Coordinator_ID: req.user.sub });
      if (!assignment) return res.status(403).json({ error: 'You are not assigned to this event.' });
    } else if (req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Only coordinators or administrators can review requests.' });

    const updated = await update('volunteerApplications', 'applicationId', application.applicationId, {
      Status: req.params.status,
      reviewedBy: req.user.sub,
      reviewedAt: new Date().toISOString()
    });
    res.json(updated);
  } catch (error) { next(error); }
});

export default router;
