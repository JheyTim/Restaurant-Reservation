const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env.test') });
const request = require('supertest');
const app = require('../src/app');
const { signToken } = require('../src/utils/jwt');
const Table = require('../src/models/table');
const Reservation = require('../src/models/reservation');
const { connectInMemoryDB, disconnectInMemoryDB } = require('./utils/db.mock');

const adminToken = signToken({ id: 'dummy', role: 'admin' });
const custToken = signToken({ id: 'u1', role: 'customer' });

beforeAll(async () => {
  await connectInMemoryDB();
  await Table.syncIndexes();
  await Reservation.syncIndexes();
});
afterAll(() => disconnectInMemoryDB());

describe('Admin metrics RBAC', () => {
  it('allows admin', async () => {
    const res = await request(app)
      .get('/api/admin/metrics/peak-hours')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
  });

  it('blocks customer', async () => {
    const res = await request(app)
      .get('/api/admin/metrics/peak-hours')
      .set('Authorization', `Bearer ${custToken}`);
    expect(res.status).toBe(403);
  });
});
