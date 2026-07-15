import request from 'supertest';
import express from 'express';
import healthRoutes from '../src/routes/health.routes.js';

describe('Health Routes', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use('/health', healthRoutes);
  });

  describe('GET /', () => {
    it('should return 200 status code', async () => {
      const response = await request(app)
        .get('/health/')
        .expect(200);
    });

    it('should return JSON response', async () => {
      const response = await request(app)
        .get('/health/')
        .expect('Content-Type', /json/);
    });

    it('should return status "ok"', async () => {
      const response = await request(app)
        .get('/health/');

      expect(response.body.status).toBe('ok');
    });

    it('should return uptime object with hours, minutes, and seconds', async () => {
      const response = await request(app)
        .get('/health/');

      expect(response.body.uptime).toBeDefined();
      expect(response.body.uptime).toHaveProperty('hours');
      expect(response.body.uptime).toHaveProperty('minutes');
      expect(response.body.uptime).toHaveProperty('seconds');
    });

    it('should return uptime values as numbers', async () => {
      const response = await request(app)
        .get('/health/');

      expect(typeof response.body.uptime.hours).toBe('number');
      expect(typeof response.body.uptime.minutes).toBe('number');
      expect(typeof response.body.uptime.seconds).toBe('number');
    });

    it('should return uptime values greater than or equal to zero', async () => {
      const response = await request(app)
        .get('/health/');

      expect(response.body.uptime.hours).toBeGreaterThanOrEqual(0);
      expect(response.body.uptime.minutes).toBeGreaterThanOrEqual(0);
      expect(response.body.uptime.seconds).toBeGreaterThanOrEqual(0);
    });

    it('should return a valid ISO timestamp', async () => {
      const response = await request(app)
        .get('/health/');

      expect(response.body.timestamp).toBeDefined();
      expect(typeof response.body.timestamp).toBe('string');
      
      // Verify it's a valid ISO string
      const date = new Date(response.body.timestamp);
      expect(date.toString()).not.toBe('Invalid Date');
    });

    it('should return minutes as total minutes of uptime', async () => {
      const response = await request(app)
        .get('/health/');

      const { hours, minutes, seconds } = response.body.uptime;
      
      // minutes should be the total minutes (not just the remainder)
      expect(minutes).toBeGreaterThanOrEqual(hours * 60);
    });

    it('should return seconds as total seconds of uptime', async () => {
      const response = await request(app)
        .get('/health/');

      const { hours, minutes, seconds } = response.body.uptime;
      
      // seconds should be the total seconds (not just the remainder)
      expect(seconds).toBeGreaterThanOrEqual(minutes * 60);
    });

    it('should have consistent structure on multiple calls', async () => {
      const response1 = await request(app)
        .get('/health/');

      const response2 = await request(app)
        .get('/health/');

      expect(Object.keys(response1.body).sort()).toEqual(
        Object.keys(response2.body).sort()
      );

      expect(Object.keys(response1.body.uptime).sort()).toEqual(
        Object.keys(response2.body.uptime).sort()
      );
    });

    it('should have uptime increasing or staying the same on subsequent calls', async () => {
      const response1 = await request(app)
        .get('/health/');

      // Small delay to ensure time passes
      await new Promise(resolve => setTimeout(resolve, 10));

      const response2 = await request(app)
        .get('/health/');

      expect(response2.body.uptime.seconds).toBeGreaterThanOrEqual(
        response1.body.uptime.seconds
      );
    });
  });
});
