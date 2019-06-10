export const ACTIONS = {
  USER_LOGIN: 'USER_LOGIN',
  USER_REGISTER: 'USER_REGISTER',
  USER_LOGOUT: 'USER_LOGOUT',
  USER_CHANGE_AVATAR: 'USER_CHANGE_AVATAR',
  USER_CHANGE_USERNAME: 'USER_CHANGE_USERNAME',
  USER_CHANGE_PASSWORD: 'USER_CHANGE_PASSWORD',
  USER_CHANGE_EMAIL: 'USER_CHANGE_EMAIL',
  USER_UPDATE_STATS: 'USER_UPDATE_STATS',
};

export const DEFAULT = {
  AVATAR: 'man.png',
};

export const CONFIG = {
  SERVER: {
    URL: 'http://localhost',
    PORT: '8080',
  },
};

export const REGEX = {
  USERNAME: /^[a-zA-Z0-9]{6,}$/,
  EMAIL: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, //eslint-disable-line
  PASSWORD: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
};

export const AVATARS = [
  'businessman.png',
  'businesswoman.png',
  'man-1.png',
  'man-10.png',
  'man-11.png',
  'man-12.png',
  'man-13.png',
  'man-14.png',
  'man-15.png',
  'man-16.png',
  'man-17.png',
  'man-18.png',
  'man-19.png',
  'man-2.png',
  'man-20.png',
  'man-21.png',
  'man-22.png',
  'man-23.png',
  'man-24.png',
  'man-25.png',
  'man-26.png',
  'man-27.png',
  'man-28.png',
  'man-29.png',
  'man-3.png',
  'man-30.png',
  'man-31.png',
  'man-32.png',
  'man-33.png',
  'man-34.png',
  'man-4.png',
  'man-5.png',
  'man-6.png',
  'man-7.png',
  'man-8.png',
  'man-9.png',
  'man.png',
  'woman-1.png',
  'woman-10.png',
  'woman-11.png',
  'woman-12.png',
  'woman-2.png',
  'woman-3.png',
  'woman-4.png',
  'woman-5.png',
  'woman-6.png',
  'woman-7.png',
  'woman-8.png',
  'woman-9.png',
  'woman.png',
];
