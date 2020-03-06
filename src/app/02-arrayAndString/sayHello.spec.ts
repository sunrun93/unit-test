import { sayHello } from './sayHello';

describe('sayHello', () => {

  it('should contains the input name', () => {

    const result = sayHello('Reina');

    expect(result).toContain('Reina');
    // expect(result).toBe('Hello Reina !!')
  });
});


