import checkOperationErrors from './checkOperationErrors.js';
import feesCalculationEngine from './feesCalculationEngine.js';
import feesRules from '../constants/feesRules.js';

export default ({ user_id, date, user_type, type, operation }) => {
  const operationErrors = checkOperationErrors({
    user_id,
    date,
    operationAmount: operation.amount,
    operationCurrency: operation.currency,
    operationType: type,
    operationUserType: user_type,
  });

  if (operationErrors.length) {
    console.log(operationErrors.join(' '));
    return;
  }

  const { percents, ruleName, criteria } = feesRules[type][user_type];

  const operationFee = feesCalculationEngine[ruleName]({
    percents,
    criteria,
    operation,
    user_id,
    date,
  });

  console.log(operationFee.toFixed(2));
};
