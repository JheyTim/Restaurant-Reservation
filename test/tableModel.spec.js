const mongoose = require('mongoose');
const Table = require('../src/models/table');
const { connectInMemoryDB, disconnectInMemoryDB } = require('./db.mock'); // mock DB

beforeAll(async () => {
  await connectInMemoryDB();
  await Table.syncIndexes(); // ✅ Ensures 'unique' index is active
});
afterAll(() => disconnectInMemoryDB());

describe('Table model', () => {
  it('rejects duplicate names', async () => {
    await Table.create({ name: 'VIP-1', capacity: 4 });
    await expect(Table.create({ name: 'VIP-1', capacity: 4 })).rejects.toThrow(
      /duplicate key/
    );
  });
});
