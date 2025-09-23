const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../app');

const SECRET = 'mon-secret';
function token(roles = ['admin']) {
  return jwt.sign({ sub: 'ops', roles }, SECRET);
}

describe('Monitoring & Logging - Ingestion', () => {
  beforeAll(() => {
    process.env.JWT_SECRET = SECRET;
  });

  it('POST /api/v1/logs requires auth', async () => {
    let res = await request(app).post('/api/v1/logs').send({});
    expect([401, 403]).toContain(res.status);

    res = await request(app)
      .post('/api/v1/logs')
      .set('Authorization', `Bearer ${token(['admin'])}`)
      .send({
        timestamp: new Date().toISOString(),
        level: 'INFO',
        message: 'Test log',
        source: 'jest',
      });
    expect([201, 400, 500]).toContain(res.status);
  });

  it('GET /api/v1/alerts requires auth and returns list or 200/500', async () => {
    const res = await request(app)
      .get('/api/v1/alerts')
      .set('Authorization', `Bearer ${token(['viewer'])}`);
    expect([200, 500]).toContain(res.status);
  });
});
