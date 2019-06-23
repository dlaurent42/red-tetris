import isPassword from './isPassword';

import { BOUNDARY_VALUES } from '../../config/constants';

describe('isPassword - function to tell is given string has format of password', () => {

  it('testing with empty string', () => {
    const res = isPassword('');
    expect(res).toBe(false);
  });

  it('testing with string smaller then BOUNDARY_VALUES', () => {
    const res = isPassword('a'.repeat(BOUNDARY_VALUES.PASS_MIN_LEN - 1));
    expect(res).toBe(false);
  });

  it('testing with string w/o digits', () => {
    const res = isPassword(`${'a'.repeat(BOUNDARY_VALUES.PASS_MIN_LEN)}1`);
    expect(res).toBe(false);
  });

  it('testing with correct string', () => {
    const res = isPassword('TestPasswrd!123');
    expect(res).toBe(true);
  });

  it('testing with two correct string', () => {
    const res = isPassword('TestPasswrd!123', 'TestPasswrd!123');
    expect(res).toBe(true);
  });

  it('testing with two correct, but different string', () => {
    const res = isPassword('TestPasswrd!123', 'TestPasswrd!1234');
    expect(res).toBe(false);
  });

});
