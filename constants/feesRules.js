export default {
  cash_in: {
    natural: {
      percents: 0.03,
      ruleName: 'max',
      criteria: { amount: 5, currency: 'EUR' }
    },
    juridical: {
      percents: 0.03,
      ruleName: 'max',
      criteria: { amount: 5, currency: 'EUR' }
    }
  },
  cash_out: {
    natural: {
      percents: 0.3,
      ruleName: 'week_limit',
      criteria: { amount: 1000, currency: 'EUR' }
    },
    juridical: {
      percents: 0.3,
      ruleName: 'min',
      criteria: { amount: 0.5, currency: 'EUR' }
    }
  }
};

