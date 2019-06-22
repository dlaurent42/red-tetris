import { ACTIONS } from '../../config/constants';

export const userLogin = (payload = { user: {} }) => ({
  type: ACTIONS.USER_LOGIN,
  payload,
});

export const userRegister = (payload = { user: {} }) => ({
  type: ACTIONS.USER_REGISTER,
  payload,
});

export const userLogout = (payload = { user: {} }) => ({
  type: ACTIONS.USER_LOGOUT,
  payload,
});

export const userUpdate = (payload = { user: {} }) => ({
  type: ACTIONS.USER_UPDATE,
  payload,
});

export const userDelete = (payload = { user: {} }) => ({
  type: ACTIONS.USER_DELETE,
  payload,
});
