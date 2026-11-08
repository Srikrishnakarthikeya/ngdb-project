import bcrypt from 'bcryptjs';
import * as mock from '../../frontend/src/data/mockData.js';
import { writeCollection, dataDirectory } from '../src/storage/jsonStore.js';
import fs from 'node:fs/promises';

await fs.mkdir(dataDirectory, { recursive: true });
const collections = {
  departments: mock.INITIAL_DEPARTMENTS, venues: mock.INITIAL_VENUES, coordinators: mock.INITIAL_COORDINATORS,
  events: mock.INITIAL_EVENTS, eventCoordinators: mock.INITIAL_EVENT_COORDINATORS, sponsors: mock.INITIAL_SPONSORS,
  publicity: mock.INITIAL_PUBLICITY, participants: mock.INITIAL_PARTICIPANTS, registrations: mock.INITIAL_REGISTRATIONS,
  accommodations: mock.INITIAL_ACCOMMODATIONS, hospitality: mock.INITIAL_HOSPITALITY, evaluations: mock.INITIAL_EVALUATIONS,
  certificates: mock.INITIAL_CERTIFICATES, completionReports: mock.INITIAL_COMPLETION_REPORTS,
  photographs: mock.INITIAL_PHOTOGRAPHS, notifications: mock.INITIAL_NOTIFICATIONS
};
for (const [name, records] of Object.entries(collections)) await writeCollection(name, records);

const users = [
  ['STUDENT', 'PART-001', 'Prasad', 'prasad45@gmail.com', 'demoPass123', { category: 'Student', institution: 'NIT Trichy', rollNo: '205123045' }],
  ['STUDENT', 'PART-002', 'xyz', 'xyz@gmail.com', 'demoPass123', { category: 'External Student', institution: 'NITK Surathkal', rollNo: '21IT089' }],
  ['ADMIN', 'ADM-001', 'Admin', 'admin@gmail.com', 'adminPass123', { designation: 'Professor & Head of Department', department: 'Department of Computer Applications' }],
  ['COORDINATOR', 'COORD-01', 'Coordinator', 'coordinator@example.com', 'demoPass123', { designation: 'Associate Professor', department: 'Department of Computer Applications', assignedEvents: ['EVT-101', 'EVT-104'] }]
];
const userRecords = [];
for (const [role, userId, name, email, password, profile] of users) {
  userRecords.push({ userId, name, email, passwordHash: await bcrypt.hash(password, 10), role, profile });
}
for (const coordinator of mock.INITIAL_COORDINATORS) {
  if (coordinator.Coordinator_ID === 'COORD-01') continue;
  const assignedEvents = mock.INITIAL_EVENT_COORDINATORS.filter((item) => item.Coordinator_ID === coordinator.Coordinator_ID).map((item) => item.Event_ID);
  userRecords.push({ userId: coordinator.Coordinator_ID, name: coordinator.Name, email: coordinator.Email.toLowerCase(), userName: coordinator.Email.toLowerCase(), passwordHash: await bcrypt.hash('demoPass123', 10), role: 'COORDINATOR', mustChangePassword: false, profile: { designation: coordinator.Designation, department: coordinator.Department, assignedEvents } });
}
await writeCollection('users', userRecords);
await writeCollection('wallets', mock.INITIAL_PARTICIPANTS.map((participant) => ({ participantId: participant.Participant_ID, balance: 1000 })));
await writeCollection('participants', mock.INITIAL_PARTICIPANTS.map((participant) => ({ ...participant, Wallet: 1000 })));
await writeCollection('walletTopUps', []);
console.log(`Seeded ${Object.keys(collections).length + 3} JSON collection files in ${dataDirectory}`);
