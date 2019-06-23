import random from './random';

describe('random - function to generate random string of given length', () => {

  it('testing with not numeric string', () => {
    const res = random(1);
    expect(res).toHaveLength(1);
  });


});
