import isEmail from './isEmail';

import { BOUNDARY_VALUES } from '../../config/constants';


describe('isEmail - function to tell is given string has format of email', () => {

  it('testing with empty string', () => {
    const res = isEmail('');
    expect(res).toBe(false);
  });

  it('testing with correct string', () => {
    const res = isEmail('admin@admin.com');
    expect(res).toBe(true);
  });

  it('testing with incorrect string', () => {
    const res = isEmail('@admin.com');
    expect(res).toBe(false);
  });

  it('testing with email lenght bigger then BOUNDARY_VALUES', () => {
    const str = 'a'.repeat(BOUNDARY_VALUES.EMAIL_MAX_LEN);
    const res = isEmail(`${str}@mail.com`);
    expect(res).toBe(false);
  });

});
