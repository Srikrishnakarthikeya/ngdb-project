import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { randomUUID } from 'node:crypto';
import { networkInterfaces } from 'node:os';

const walletTopUpRequests = new Map();

const getLanAddress = () => Object.values(networkInterfaces())
  .flat()
  .find((address) => address && address.family === 'IPv4' && !address.internal && !address.address.startsWith('169.254.'));

const readRequestBody = (request) => new Promise((resolve, reject) => {
  let body = '';
  request.on('data', (chunk) => { body += chunk; });
  request.on('end', () => {
    try {
      resolve(body ? JSON.parse(body) : {});
    } catch (error) {
      reject(error);
    }
  });
  request.on('error', reject);
});

const walletTopUpRelay = () => ({
  name: 'temporary-wallet-top-up-relay',
  configureServer(server) {
    server.middlewares.use(async (request, response, next) => {
      const requestUrl = new URL(request.url || '/', 'http://localhost');
      if (request.method === 'GET' && requestUrl.pathname === '/api/wallet-top-ups/network-origin') {
        const address = getLanAddress();
        const serverAddress = server.httpServer?.address();
        const port = typeof serverAddress === 'object' && serverAddress ? serverAddress.port : null;
        response.statusCode = address && port ? 200 : 503;
        response.setHeader('Content-Type', 'application/json');
        response.end(JSON.stringify(address && port
          ? { origin: `http://${address.address}:${port}` }
          : { error: 'Unable to find this computer’s LAN address.' }
        ));
        return;
      }

      const route = requestUrl.pathname.match(/^\/api\/wallet-top-ups(?:\/([^/]+))?(?:\/(confirm|reject|complete))?$/);
      if (!route) return next();

      const [, requestId, action] = route;
      const respond = (statusCode, body) => {
        response.statusCode = statusCode;
        response.setHeader('Content-Type', 'application/json');
        response.end(JSON.stringify(body));
      };

      try {
        if (request.method === 'POST' && !requestId) {
          const body = await readRequestBody(request);
          const amount = Number(body.amount);
          if (!body.participantId || !Number.isSafeInteger(amount) || amount <= 0) {
            return respond(400, { error: 'A student and a positive whole-rupee amount are required.' });
          }

          const topUp = {
            id: randomUUID(),
            participantId: String(body.participantId),
            amount,
            status: 'pending',
            createdAt: Date.now()
          };
          walletTopUpRequests.set(topUp.id, topUp);
          return respond(201, topUp);
        }

        const topUp = walletTopUpRequests.get(requestId);
        if (!topUp || Date.now() - topUp.createdAt > 10 * 60 * 1000) {
          walletTopUpRequests.delete(requestId);
          return respond(404, { error: 'This wallet top-up request has expired.' });
        }

        if (request.method === 'POST' && action === 'confirm' && topUp.status === 'pending') {
          topUp.status = 'confirmed';
          return respond(200, topUp);
        }
        if (request.method === 'POST' && action === 'reject' && topUp.status === 'pending') {
          topUp.status = 'rejected';
          return respond(200, topUp);
        }
        if (request.method === 'POST' && action === 'complete' && topUp.status === 'confirmed') {
          topUp.status = 'completed';
          return respond(200, topUp);
        }
        if (request.method === 'GET' && !action) return respond(200, topUp);

        return respond(409, { error: 'This wallet top-up request cannot be updated.' });
      } catch {
        return respond(400, { error: 'Invalid wallet top-up request.' });
      }
    });
  }
});

export default defineConfig({
  plugins: [react(), walletTopUpRelay()],
  server: {
    port: 3000,
    open: false
  }
});
