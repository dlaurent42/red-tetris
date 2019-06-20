import { isEmpty } from '../utils';

import { TOKENS } from '../config/constants';

const middleware = (req, res, next) => {
  const bearerHeader = req.headers.authorization;
  if (isEmpty(bearerHeader)) return res.status(403);
  return (bearerHeader.split(' ')[1] === TOKENS.AUTH)
    ? next()
    : res.status(403).send();
};

export default middleware;
