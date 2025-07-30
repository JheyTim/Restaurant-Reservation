const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env.test') });
const request = require('supertest');
const User = require('../src/models/user');
const app = require('../src/app');
const { connectInMemoryDB, disconnectInMemoryDB } = require('./utils/db.mock');

beforeAll(async () => {
  await connectInMemoryDB();
  await User.syncIndexes();
});
afterAll(() => disconnectInMemoryDB());

describe('Auth flow', () => {
  it('registers & logs in a user', async () => {
    const payload = { email: 'alice@demo.io', password: 'hunter22' };

    const reg = await request(app).post('/api/auth/register').send(payload);
    expect(reg.status).toBe(201);
    expect(reg.body.token).toBeDefined();

    const login = await request(app).post('/api/auth/login').send(payload);
    expect(login.status).toBe(200);
    expect(login.body.token).toBeDefined();
  });

  it('blocks wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'alice@demo.io', password: 'wrong' });
    expect(res.status).toBe(401);
  });
});
