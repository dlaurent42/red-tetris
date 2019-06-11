import { get } from 'lodash';

const middleware = () => (
  next => (action) => {

    // Verify if action needs to be emitted to server
    const io = get(action, 'meta.socket.socket');
    if (io) io.emit(action.meta.socket.event, action.meta.socket.payload);

    // Run action
    return next(action);
  }
);

export default middleware;
