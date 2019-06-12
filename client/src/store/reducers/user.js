import Cookies from 'js-cookie';
import { ACTIONS, DEFAULT } from '../../config/constants';

const initialState = {
  user: {
    // uid: 1,
    uid: Cookies.get('uid'),
    username: '',
    avatar: DEFAULT.AVATAR,
  },
};

export const user = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.USER_LOGIN: return state;
    case ACTIONS.USER_REGISTER: return state;
    case ACTIONS.USER_LOGOUT: return state;
    case ACTIONS.USER_CHANGE_AVATAR: return state;
    case ACTIONS.USER_CHANGE_USERNAME: return state;
    case ACTIONS.USER_CHANGE_PASSWORD: return state;
    case ACTIONS.USER_CHANGE_EMAIL: return state;
    case ACTIONS.USER_UPDATE_STATS: return state;
    default: return state;
  }
};
