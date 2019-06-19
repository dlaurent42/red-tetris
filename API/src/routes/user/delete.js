import express from 'express';

const router = express.Router();

router.delete('/:id', (req, res) => {
  res.status(200).json({ success: false, err: 'Not implemented yet' });
});

export default router;
