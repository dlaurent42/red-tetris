import isEmpty from './isEmpty';

describe('isEmpty - function to tell is given object empty', () => {

  it('testing with null', () => {
    const res = isEmpty(null);
    expect(res).toBe(true);
  });

  it('testing with undefined', () => {
    const res = isEmpty(test);
    expect(res).toBe(true);
  });

  it('testing with empty object', () => {
    const res = isEmpty({});
    expect(res).toBe(true);
  });

  it('testing with empty string', () => {
    const res = isEmpty('');
    expect(res).toBe(true);
  });

  it('testing with non-empty object', () => {
    const res = isEmpty({ test: 'yes' });
    expect(res).toBe(false);
  });

});
