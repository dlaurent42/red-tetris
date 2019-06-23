import hash from './hash';

describe('hash - function to has given string with sha512 ', () => {

  it('testing with some strings', () => {
    const res = hash('asd', 'asd');
    expect(res).toHaveLength(128);
  });

});
