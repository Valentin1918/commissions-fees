import checkOperationErrors from './checkOperationErrors.js';
import feesCalculationEngine from './feesCalculationEngine.js';
import feeRuleDetails from '../constants/feeRuleDetails.js';

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
    return operationErrors.join(' ');
  }

  const { percents, ruleName, criteria } = feeRuleDetails[type][user_type];

  const operationFee = feesCalculationEngine[ruleName]({
    percents,
    criteria,
    operation,
    user_id,
    date,
  });

  return operationFee.toFixed(2);
};
