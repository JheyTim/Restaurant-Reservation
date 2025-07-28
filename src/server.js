require('dotenv/config'); // load .env first
const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const { connectDB } = require('./config/db');

const PORT = process.env.PORT || 4000;

(async () => {
  await connectDB(); // wait for Mongo before accepting requests

  /* ⇣ Real‑time layer (no handlers yet) */
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: { origin: process.env.CORS_ORIGIN?.split(',') || '*' },
  });

  /* Make io available in routes via req.io */
  app.use((req, _, next) => {
    req.io = io;
    next();
  });

  server.listen(PORT, () =>
    console.log(`🚀 API ready @ http://localhost:${PORT}`)
  );
})();
