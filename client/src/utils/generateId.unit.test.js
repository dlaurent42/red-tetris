import generateId from './generateId';

describe('generateId - creates a random string of specified length', () => {

  it('should return empty string', () => {
    const res = generateId(0);
    expect(res).toEqual('');
  });

  it('should return non-empty string', () => {
    const res = generateId(6);
    expect(res.length).toEqual(6);
  });

});
