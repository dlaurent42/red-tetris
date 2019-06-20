import { isEmpty } from '../utils';

import { TOKENS } from '../config/constants';

const middleware = (req, res, next) => {
  const bearerHeader = req.headers.authorization;
  return (!isEmpty(bearerHeader) && bearerHeader.split(' ')[1] === TOKENS.AUTH)
    ? next()
    : res.status(403).send();
};

export default middleware;
