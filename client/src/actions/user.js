import { ACTIONS } from '../config/constants';

export const userLogin = payload => ({
  type: ACTIONS.USER_LOGIN,
  payload,
});

export const userRegister = payload => ({
  type: ACTIONS.USER_REGISTER,
  payload,
});

export const userLogout = payload => ({
  type: ACTIONS.USER_LOGOUT,
  payload,
});

export const userChangeAvatar = payload => ({
  type: ACTIONS.USER_CHANGE_AVATAR,
  payload,
});

export const userChangeUsername = payload => ({
  type: ACTIONS.USER_CHANGE_USERNAME,
  payload,
});

export const userChangePassword = payload => ({
  type: ACTIONS.USER_CHANGE_PASSWORD,
  payload,
});

export const userChangeEmail = payload => ({
  type: ACTIONS.USER_CHANGE_EMAIL,
  payload,
});

export const userUpdateStats = payload => ({
  type: ACTIONS.USER_UPDATE_STATS,
  payload,
});
