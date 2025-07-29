require('dotenv/config');
const { connectDB } = require('../src/config/db');
const Table = require('../src/models/table');

(async () => {
  await connectDB();
  await Table.deleteMany(); // destructive! dev-only

  const tables = Array.from({ length: 10 }).map((_, i) => ({
    name: `T-${(i + 1).toString().padStart(3, '0')}`,
    capacity: i < 2 ? 2 : i < 6 ? 4 : 6,
  }));

  await Table.insertMany(tables);
  console.log('Seeded tables ✅');
  process.exit();
})();
