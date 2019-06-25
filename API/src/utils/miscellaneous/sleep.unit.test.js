import sleep from './sleep';

describe('sleep - function to sleep thread for some time', () => {

  it('testing with 1ms', () => {
    const res = sleep(1);
    expect(res).toBe(undefined);
  });

});
