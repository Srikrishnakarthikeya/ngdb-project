import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import * as models from '../src/models/index.js';
import * as mock from '../../frontend/src/data/mockData.js';

const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nitt_ca_ems';

const collections = {
  departments: { Model: models.Department, data: mock.INITIAL_DEPARTMENTS, key: 'Dept_ID' },
  venues: { Model: models.Venue, data: mock.INITIAL_VENUES, key: 'Venue_ID' },
  coordinators: { Model: models.Coordinator, data: mock.INITIAL_COORDINATORS, key: 'Coordinator_ID' },
  events: { Model: models.Event, data: mock.INITIAL_EVENTS, key: 'Event_ID' },
  eventCoordinators: { Model: models.EventCoordinator, data: mock.INITIAL_EVENT_COORDINATORS, key: null },
  sponsors: { Model: models.Sponsor, data: mock.INITIAL_SPONSORS, key: 'Sponsor_ID' },
  publicity: { Model: models.Publicity, data: mock.INITIAL_PUBLICITY, key: 'Ad_ID' },
  participants: { Model: models.Participant, data: mock.INITIAL_PARTICIPANTS, key: 'Participant_ID' },
  registrations: { Model: models.Registration, data: mock.INITIAL_REGISTRATIONS, key: 'Registration_ID' },
  accommodations: { Model: models.Accommodation, data: mock.INITIAL_ACCOMMODATIONS, key: 'Accommodation_ID' },
  hospitality: { Model: models.Hospitality, data: mock.INITIAL_HOSPITALITY, key: 'Hospitality_ID' },
  evaluations: { Model: models.Evaluation, data: mock.INITIAL_EVALUATIONS, key: 'Evaluation_ID' },
  certificates: { Model: models.Certificate, data: mock.INITIAL_CERTIFICATES, key: 'Certificate_ID' },
  completionReports: { Model: models.CompletionReport, data: mock.INITIAL_COMPLETION_REPORTS, key: 'Report_ID' },
  photographs: { Model: models.Photograph, data: mock.INITIAL_PHOTOGRAPHS, key: 'Photo_ID' },
  notifications: { Model: models.Notification, data: mock.INITIAL_NOTIFICATIONS, key: 'id' }
};

await mongoose.connect(mongoUri);
if (process.env.RESET_DATABASE === 'true') {
  await mongoose.connection.db.dropDatabase();
  console.log('Database reset.');
}
for (const { Model, data, key } of Object.values(collections)) {
  for (const record of data) {
    if (key && record[key]) await Model.findOneAndUpdate({ [key]: record[key] }, record, { upsert: true, new: true });
    else await Model.create(record);
  }
}

const demoUsers = [
  ['STUDENT', 'PART-001', 'Prasad', 'prasad45@gmail.com', 'demoPass123', { category: 'Student', institution: 'NIT Trichy', rollNo: '205123045' }],
  ['STUDENT', 'PART-002', 'xyz', 'xyz@gmail.com', 'demoPass123', { category: 'External Student', institution: 'NITK Surathkal', rollNo: '21IT089' }],
  ['ADMIN', 'ADM-001', 'Admin', 'admin@gmail.com', 'adminPass123', { designation: 'Professor & Head of Department', department: 'Department of Computer Applications' }],
  ['COORDINATOR', 'COORD-01', 'Coordinator', 'coordinator@example.com', 'demoPass123', { designation: 'Associate Professor', department: 'Department of Computer Applications', assignedEvents: ['EVT-101', 'EVT-104'] }]
];
for (const [role, userId, name, email, password, profile] of demoUsers) {
  await models.User.findOneAndUpdate({ email }, { userId, name, email, passwordHash: await bcrypt.hash(password, 10), role, profile }, { upsert: true, new: true });
}
for (const participant of mock.INITIAL_PARTICIPANTS) await models.Wallet.findOneAndUpdate({ participantId: participant.Participant_ID }, { $setOnInsert: { balance: 1000 } }, { upsert: true });

console.log(`Seed complete in database: ${mongoose.connection.name}`);
await mongoose.disconnect();
