import express from 'express';
import UserHelper from '../../helpers/User';

import { isNumeric } from '../../utils';

const router = express.Router();

router.get('/:id', (req, res) => {
  if (!isNumeric(req.params.id)) return res.status(404);
  return res.json({ test: 'test' });
});
