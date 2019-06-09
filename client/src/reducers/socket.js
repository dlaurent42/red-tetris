import socketIOClient from 'socket.io-client';
import { CONFIG } from '../config/constants';

const initialState = {
  socket: socketIOClient(`${CONFIG.SERVER.URL}:${CONFIG.SERVER.PORT}`),
};

export const socket = (state = initialState) => state;
