import Cookies from 'js-cookie';
import { ACTIONS, DEFAULT } from '../../config/constants';

// Initialize state
const id = Cookies.get('user');
const initialState = (id)
  ? { user: { id } }
  : { user: { username: '', avatar: DEFAULT.AVATAR } };

const updateState = (state, updatedValues) => ({
  ...state,
  ...updatedValues,
});

const loginAndRegisterHandlers = (state, action) => {
  Cookies.set('user', action.payload.id, { expires: 7 });
  return updateState(state, {
    user: { ...action.payload },
  });
};

const logoutAndDeleteHandler = (state) => {
  Cookies.remove('user');
  return updateState(state, {
    user: {
      id: 0,
      username: '',
      avatar: DEFAULT.AVATAR,
    },
  });
};

export const user = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.USER_LOGIN: return loginAndRegisterHandlers(state, action);
    case ACTIONS.USER_REGISTER: return loginAndRegisterHandlers(state, action);
    case ACTIONS.USER_UPDATE: return updateState(state, { user: action.payload });
    case ACTIONS.USER_LOGOUT: return logoutAndDeleteHandler(state);
    case ACTIONS.USER_DELETE: return logoutAndDeleteHandler(state);
    default: return state;
  }
};
