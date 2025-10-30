import http from 'http';
import { AddressInfo } from 'net';
import { requestHandler } from './index';

let server: http.Server;

beforeAll((done) => {
  server = http.createServer(requestHandler);
  server.listen(0, done); // port 0 = port libre auto
});

afterAll((done) => {
  server.close(done);
});

jest.setTimeout(15000); // Timeout global à 15 secondes

test('GET /inconnue retourne 404', async () => {
  const address = server.address() as AddressInfo;
  const url = `http://localhost:${address.port}/inconnue`;

  await new Promise<void>((resolve, reject) => {
    http.get(url, (res) => {
      try {
        expect(res.statusCode).toBe(404);
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          const json = JSON.parse(data);
          expect(json.error).toBe('Page non trouvée');
          resolve();
        });
      } catch (e) {
        reject(e);
      }
    }).on('error', reject);
  });
});
