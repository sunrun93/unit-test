import { getCurrency } from './getCurrency';

describe('getCUrrency', () => {
  it('should contain the correct currency', () => {
    const result = getCurrency();

    expect(result).toContain('CHY');
    expect(result).toContain('USD');
    expect(result).toContain('EUR');
  });
});
