import isNumeric from './isNumeric';

describe('isNumeric - function to tell if given string is a numeric', () => {

  it('testing with not numeric string', () => {
    const res = isNumeric('abc');
    expect(res).toBe(false);
  });

  it('testing with not numeric string', () => {
    const res = isNumeric('123');
    expect(res).toBe(true);
  });

});
