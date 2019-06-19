import express from 'express';
import UserHelper from '../../helpers/User';

import { isEmpty } from '../../utils';

const router = express.Router();

router.post('/:id', (req, res) => {
	if (isEmpty(req.params.id)) return res.status(404);

	return ''
});
