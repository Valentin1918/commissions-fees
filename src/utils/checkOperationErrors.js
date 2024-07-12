import {
  allowedOperationTypes,
  allowedOperationUserTypes,
} from '../constants/index.js';

const operationErrorMap = {
  user_id: {
    isValid: (value) => !!`${value}`.length,
    errorMessage: 'No user id provided!',
  },
  date: {
    isValid: (value) => new Date(value).toString() !== 'Invalid Date',
    errorMessage: 'Invalid date provided!',
  },
  operationAmount: {
    isValid: (value) => !Number.isNaN(value) && value > 0,
    errorMessage: 'Invalid operation amount!',
  },
  operationCurrency: {
    isValid: (value) => typeof value === 'string' && value.length === 3,
    errorMessage: 'Invalid operation currency!',
  },
  operationType: {
    isValid: (value) => allowedOperationTypes.includes(value),
    errorMessage: 'Unknown operation!',
  },
  operationUserType: {
    isValid: (value) => allowedOperationUserTypes.includes(value),
    errorMessage: 'Unknown user type!',
  },
};

export default (inputParams) =>
  Object.entries(inputParams).reduce((acc, [key, value]) => {
    if (operationErrorMap[key] && !operationErrorMap[key].isValid(value)) {
      acc.push(operationErrorMap[key].errorMessage);
    }
    return acc;
  }, []);
