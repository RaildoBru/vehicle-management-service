import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  const uptimeSeconds = process.uptime();
  const hours = Math.floor(uptimeSeconds / 3600);
  const minutes = Math.floor(uptimeSeconds / 60);
  const seconds = Math.floor(uptimeSeconds);
  const formattedUptime = `${hours} hours(s), ${Math.floor((uptimeSeconds % 3600) / 60)} minutes(s) and ${Math.floor(uptimeSeconds % 60)} seconds(s)`;

  res.status(200).json({
    status: 'ok',
    uptime: {
      hours,
      minutes,
      seconds,
    },
    uptimeFormatted: formattedUptime,
    timestamp: new Date().toISOString(),
  });
});


/**
 * 
 * res.json({
  status: 'ok',
  uptime: process.uptime(),
  uptimeFormatted: formattedUptime,
  timestamp: new Date().toISOString(),
});
 * 
 */
export default router;
