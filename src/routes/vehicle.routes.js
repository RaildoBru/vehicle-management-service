import express from 'express';

const router = express.Router();

router.get('/vehicles', (req, res) => {
  res.status(200).json({
    teste: 'teste'
  });
});

export default router;