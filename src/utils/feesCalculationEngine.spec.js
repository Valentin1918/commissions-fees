import { FeesCalculationEngine } from './feesCalculationEngine.js';

describe('FeesCalculationEngine', () => {
  let feesCalculationEngine;

  beforeEach(() => {
    feesCalculationEngine = new FeesCalculationEngine();
  });

  describe('max method', () => {
    it('calculates maximum fee for cash_in natural below maximum', () => {
      const result = feesCalculationEngine.max({
        percents: 0.03,
        criteria: { amount: 5, currency: 'EUR' },
        operation: { amount: 100, currency: 'EUR' },
      });

      expect(result).toBe(0.03); // 100 * 0.03 / 100 = 0.03
    });

    it('calculates maximum fee for cash_in natural above maximum', () => {
      const result = feesCalculationEngine.max({
        percents: 0.03,
        criteria: { amount: 5, currency: 'EUR' },
        operation: { amount: 20000, currency: 'EUR' },
      });

      expect(result).toBe(5); // 20000 * 0.03 / 100 = 6, but maximum is 5
    });

    it('returns 0 for incompatible currency', () => {
      const result = feesCalculationEngine.max({
        percents: 0.03,
        criteria: { amount: 5, currency: 'EUR' },
        operation: { amount: 100, currency: 'UAH' },
      });

      expect(result).toBe(0);
    });
  });

  describe('min method', () => {
    it('calculates minimum fee for cash_out juridical above minimum', () => {
      const result = feesCalculationEngine.min({
        percents: 0.3,
        criteria: { amount: 0.5, currency: 'EUR' },
        operation: { amount: 200, currency: 'EUR' },
      });

      expect(result).toBe(0.6); // 0.3 * 200 / 100 = 0.6
    });

    it('calculates minimum fee for cash_out juridical below minimum', () => {
      const result = feesCalculationEngine.min({
        percents: 0.3,
        criteria: { amount: 0.5, currency: 'EUR' },
        operation: { amount: 100, currency: 'EUR' },
      });

      expect(result).toBe(0.5); // 0.3 * 100 / 100 = 0.3, but minimum is 0.5
    });

    it('returns 0 for incompatible currency', () => {
      const result = feesCalculationEngine.min({
        percents: 0.3,
        criteria: { amount: 0.5, currency: 'EUR' },
        operation: { amount: 100, currency: 'UAH' },
      });

      expect(result).toBe(0);
    });
  });

  describe('week_limit method', () => {
    it('calculates week limit fee for cash_out natural below free of change limit', () => {
      // Simulate operations across a week for a user
      feesCalculationEngine.week_limit({
        percents: 0.3,
        criteria: { amount: 1000, currency: 'EUR' },
        operation: { amount: 300, currency: 'EUR' },
        user_id: '1',
        date: '2023-07-12', // A specific date within a week
      });

      feesCalculationEngine.week_limit({
        percents: 0.3,
        criteria: { amount: 1000, currency: 'EUR' },
        operation: { amount: 300, currency: 'EUR' },
        user_id: '1',
        date: '2023-07-13', // A date within the same week
      });

      const result = feesCalculationEngine.week_limit({
        percents: 0.3,
        criteria: { amount: 1000, currency: 'EUR' },
        operation: { amount: 300, currency: 'EUR' },
        user_id: '1',
        date: '2023-07-14', // A date within the same week
      });

      expect(result).toBe(0); // 1000 - 300 - 300 - 300 = 100 (below free of change limit, so nothing is taxable)
    });

    it('calculates week limit fee for cash_out natural above free of change limit', () => {
      // Simulate operations across a week for a user
      feesCalculationEngine.week_limit({
        percents: 0.3,
        criteria: { amount: 1000, currency: 'EUR' },
        operation: { amount: 300, currency: 'EUR' },
        user_id: '1',
        date: '2023-07-12', // A specific date within a week
      });

      const result = feesCalculationEngine.week_limit({
        percents: 0.3,
        criteria: { amount: 1000, currency: 'EUR' },
        operation: { amount: 800, currency: 'EUR' },
        user_id: '1',
        date: '2023-07-14', // A date within the same week
      });

      expect(result).toBe(0.3); // 1000 - 300 - 800 = -100 (100 above free of change limit, so only 100 is taxable here)
      // 100 * 0.3 / 100 = 0.3
    });

    it('calculates week limit fee for cash_out natural away above free of change limit', () => {
      // Simulate operations across a week for a user
      feesCalculationEngine.week_limit({
        percents: 0.3,
        criteria: { amount: 1000, currency: 'EUR' },
        operation: { amount: 2000, currency: 'EUR' },
        user_id: '1',
        date: '2023-07-12', // A specific date within a week
      });

      const result = feesCalculationEngine.week_limit({
        percents: 0.3,
        criteria: { amount: 1000, currency: 'EUR' },
        operation: { amount: 1000, currency: 'EUR' },
        user_id: '1',
        date: '2023-07-14', // A date within the same week
      });

      expect(result).toBe(3); // 1000 - 2000 - 1000 = -2000 (2000 above free of change limit, but the current operation contains only amount of 1000 so only 1000 is taxable here)
      // 1000 * 0.3 / 100 = 0.3
    });

    it('returns 0 for incompatible currency', () => {
      const result = feesCalculationEngine.week_limit({
        percents: 0.3,
        criteria: { amount: 1000, currency: 'EUR' },
        operation: { amount: 300, currency: 'UAH' },
        user_id: '1',
        date: '2023-07-12',
      });

      expect(result).toBe(0);
    });
  });
});
