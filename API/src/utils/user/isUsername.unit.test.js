import isUsername from './isUsername';

import { BOUNDARY_VALUES } from '../../config/constants';

describe('isUsername - function to tell is given string has format of username', () => {

  it('testing with empty string', () => {
    const res = isUsername('');
    expect(res).toBe(false);
  });

  it('testing with null string', () => {
    const res = isUsername(null);
    expect(res).toBe(false);
  });

  it('testing with one char string', () => {
    const res = isUsername('a');
    expect(res).toBe(false);
  });

  it('testing with very little lenght of string', () => {
    const res = isUsername('a'.repeat(BOUNDARY_VALUES.NAME_MIN_LEN - 1));
    expect(res).toBe(false);
  });

  it('testing with too long string', () => {
    const res = isUsername(`${'a'.repeat(BOUNDARY_VALUES.NAME_MAX_LEN)}test`);
    expect(res).toBe(false);
  });

  it('testing with not isAlphanumeric string', () => {
    const res = isUsername(`${'a'.repeat(BOUNDARY_VALUES.NAME_MAX_LEN - 2)}!1`);
    expect(res).toBe(false);
  });

  it('testing with correct string', () => {
    const res = isUsername(`${'a'.repeat(BOUNDARY_VALUES.NAME_MAX_LEN - 2)}`);
    expect(res).toBe(true);
  });

});
