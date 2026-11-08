import express from 'express';
import { ER_ENTITIES } from '../data/erModelInfo.js';
import { readCollection, find, create, update, remove } from '../storage/jsonStore.js';
import { requireDataMutation } from '../middleware/auth.js';

const router = express.Router();
router.get('/schema/er-model', (_req, res) => res.json(ER_ENTITIES));

const resources = {
  departments: 'departments', venues: 'venues', coordinators: 'coordinators', events: 'events',
  eventCoordinators: 'eventCoordinators', sponsors: 'sponsors', publicity: 'publicity', participants: 'participants',
  registrations: 'registrations', accommodations: 'accommodations', hospitality: 'hospitality', evaluations: 'evaluations',
  certificates: 'certificates', completionReports: 'completionReports', photographs: 'photographs', notifications: 'notifications',
  wallets: 'wallets', users: 'users', walletTopUps: 'walletTopUps'
};
const idFields = {
  departments: 'Dept_ID', venues: 'Venue_ID', coordinators: 'Coordinator_ID', events: 'Event_ID', eventCoordinators: null,
  sponsors: 'Sponsor_ID', publicity: 'Ad_ID', participants: 'Participant_ID', registrations: 'Registration_ID',
  accommodations: 'Accommodation_ID', hospitality: 'Hospitality_ID', evaluations: 'Evaluation_ID', certificates: 'Certificate_ID',
  completionReports: 'Report_ID', photographs: 'Photo_ID', notifications: 'id', wallets: 'participantId', users: 'userId', walletTopUps: null
};

router.get('/bootstrap', async (_req, res, next) => {
  try {
    const result = {};
    for (const [name, collection] of Object.entries(resources)) result[name] = await readCollection(collection);
    res.json(result);
  } catch (error) { next(error); }
});

for (const [name, collection] of Object.entries(resources)) {
  const idField = idFields[name];
  router.get(`/${name}`, async (req, res, next) => { try { res.json(await find(collection, req.query)); } catch (error) { next(error); } });
  router.post(`/${name}`, requireDataMutation, async (req, res, next) => { try { res.status(201).json(await create(collection, req.body)); } catch (error) { next(error); } });
  router.put(`/${name}/:value`, requireDataMutation, async (req, res, next) => {
    try {
      const value = await update(collection, idField, decodeURIComponent(req.params.value), req.body);
      if (!value) return res.status(404).json({ error: `${name} not found` });
      res.json(value);
    } catch (error) { next(error); }
  });
  router.delete(`/${name}/:value`, requireDataMutation, async (req, res, next) => {
    try {
      const deleted = await remove(collection, idField, decodeURIComponent(req.params.value));
      if (!deleted) return res.status(404).json({ error: `${name} not found` });
      res.status(204).end();
    } catch (error) { next(error); }
  });
}
export default router;
