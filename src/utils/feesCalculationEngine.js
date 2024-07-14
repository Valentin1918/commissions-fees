import { milliSecondsInDay, daysFromMonTillSun } from '../constants/index.js';

export class FeesCalculationEngine {
  #users = {};
  /*
  this.#users example while calculating fees:
    {
      '1': {
        '2016/1/4-2016/1/10': [ 30000, 1000, 100, 100 ],
        '2016/2/15-2016/2/21': [ 300 ]
      },
      '3': { '2016/1/4-2016/1/10': [ 1000 ] }
    }
  */

  #checkRuleCurrency(criteriaCurrency, operationCurrency) {
    return criteriaCurrency === operationCurrency;
    // If different - no correspondent fee rule detected for provided currency
  }

  #getDateName(date) {
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
  }

  #calculateResult(amount, percents) {
    return Math.ceil(amount * percents) / 100;
  }

  max({ percents, criteria, operation }) {
    if (!this.#checkRuleCurrency(criteria.currency, operation.currency)) {
      return 0;
    }

    const result = this.#calculateResult(operation.amount, percents);
    return result < criteria.amount ? result : criteria.amount;
  }

  min({ percents, criteria, operation }) {
    if (!this.#checkRuleCurrency(criteria.currency, operation.currency)) {
      return 0;
    }

    const result = this.#calculateResult(operation.amount, percents);
    return result < criteria.amount ? criteria.amount : result;
  }

  week_limit({ percents, criteria, operation, user_id, date }) {
    if (!this.#checkRuleCurrency(criteria.currency, operation.currency)) {
      return 0;
    }

    const operationDate = new Date(date);
    const dayNumber = operationDate.getDay() - 1; // -1 makes Monday equal 0, and Sunday -1. We need it for operating with Mon-Sun week format

    let monday;
    let sunday;
    if (dayNumber >= 0) {
      // current Mon-Sun week
      monday = new Date(
        operationDate.getTime() - dayNumber * milliSecondsInDay,
      );
      sunday = new Date(
        monday.getTime() + daysFromMonTillSun * milliSecondsInDay,
      );
    } else {
      // previous Mon-Sun week
      sunday = operationDate;
      monday = new Date(
        sunday.getTime() - daysFromMonTillSun * milliSecondsInDay,
      );
    }

    const weekName = `${this.#getDateName(monday)}-${this.#getDateName(sunday)}`;

    this.#users[user_id] = this.#users[user_id] || {};
    this.#users[user_id][weekName] = this.#users[user_id][weekName] || [];
    this.#users[user_id][weekName].push(operation.amount);

    const accumulatedWeekAmount = this.#users[user_id][weekName].reduce(
      (acc, amount) => acc + amount,
      0,
    );

    const exceededAmount = accumulatedWeekAmount - criteria.amount;

    const taxableOperationAmount =
      exceededAmount > 0
        ? Math.min.apply(null, [exceededAmount, operation.amount])
        : 0;

    return this.#calculateResult(taxableOperationAmount, percents);
  }
}

export default new FeesCalculationEngine();
