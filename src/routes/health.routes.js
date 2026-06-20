import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  const uptime = process.uptime();

  res.status(200).json({
    status: 'ok',
    uptime: {
      hours: Math.floor(uptime / 3600),
      minutes: Math.floor(uptime / 60),
      seconds: Math.floor(uptime),
    },
    timestamp: new Date().toISOString(),
  });
});

export default router;
