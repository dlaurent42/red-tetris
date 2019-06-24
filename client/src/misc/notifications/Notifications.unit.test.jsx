import React from 'react';
import configureStore from 'redux-mock-store';
import { MemoryRouter } from 'react-router';
import { Provider } from 'react-redux';
import { configure } from 'enzyme';
import { createMount } from '@material-ui/core/test-utils';
import { useSnackbar, SnackbarProvider } from 'notistack';
import Adapter from 'enzyme-adapter-react-16';
import socketIOClient from 'socket.io-client';
import Notifications from './Notifications';
import { NOTIFICATIONS, SOCKETS, CONFIG } from '../../config/constants';

const middlewares = [];
const mockStore = configureStore(middlewares);
const initialState = { socket: { socket: { on: jest.fn() } } };
const store = mockStore(initialState);

const initializeSocket = () => (
  new Promise((resolve) => {

    const socket = socketIOClient(`${CONFIG.SERVER.URL}:${CONFIG.SERVER.PORT}`, {
      'reconnection delay': 0,
      'reopen delay': 0,
      'force new connection': true,
    });

    // define event handler for sucessfull connection
    socket.on('connect', () => resolve(socket));
  })
);

configure({ adapter: new Adapter() });

describe('<Header />', () => {

  // Mock socket io server and connection
  let mount;
  let wrapper;
  let socket;
  beforeEach(async () => {
    socket = await initializeSocket();
    mount = createMount();
  });
  afterEach(() => {
    // socket.disconnect();
    mount.cleanUp();
  });

  it('should render correctly without user account', () => {
    wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <SnackbarProvider
            maxSnack={4}
            dense
            preventDuplicate
            hideIconVariant
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
          >
            <Notifications socket={socket} />
          </SnackbarProvider>
        </MemoryRouter>
      </Provider>,
    );
    socket.emit(SOCKETS.JEST_NOTIFY_PLAYER_LEFT_GAME, { username: 'titi' });
    setTimeout(() => {}, 2000);
  });
});
