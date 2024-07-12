import checkOperationErrors from './checkOperationErrors.js';

describe('checkOperationErrors', () => {
  test('should return no errors for valid input', () => {
    const inputParams = {
      user_id: 1,
      date: '2016-01-05',
      operationAmount: 200.0,
      operationCurrency: 'EUR',
      operationType: 'cash_in',
      operationUserType: 'natural',
    };

    const errors = checkOperationErrors(inputParams);
    expect(errors).toEqual([]);
  });

  test('should return error for missing user_id', () => {
    const inputParams = {
      user_id: '',
      date: '2016-01-05',
      operationAmount: 200.0,
      operationCurrency: 'EUR',
      operationType: 'cash_in',
      operationUserType: 'natural',
    };

    const errors = checkOperationErrors(inputParams);
    expect(errors).toContain('No user id provided!');
  });

  test('should return error for invalid date', () => {
    const inputParams = {
      user_id: 1,
      date: 'invalid-date',
      operationAmount: 200.0,
      operationCurrency: 'EUR',
      operationType: 'cash_in',
      operationUserType: 'natural',
    };

    const errors = checkOperationErrors(inputParams);
    expect(errors).toContain('Invalid date provided!');
  });

  test('should return error for invalid operation amount', () => {
    const inputParams = {
      user_id: 1,
      date: '2016-01-05',
      operationAmount: -100,
      operationCurrency: 'EUR',
      operationType: 'cash_in',
      operationUserType: 'natural',
    };

    const errors = checkOperationErrors(inputParams);
    expect(errors).toContain('Invalid operation amount!');
  });

  test('should return error for invalid operation currency', () => {
    const inputParams = {
      user_id: 1,
      date: '2016-01-05',
      operationAmount: 200.0,
      operationCurrency: 'EURO',
      operationType: 'cash_in',
      operationUserType: 'natural',
    };

    const errors = checkOperationErrors(inputParams);
    expect(errors).toContain('Invalid operation currency!');
  });

  test('should return error for unknown operation type', () => {
    const inputParams = {
      user_id: 1,
      date: '2016-01-05',
      operationAmount: 200.0,
      operationCurrency: 'EUR',
      operationType: 'some_unknown_operation_type',
      operationUserType: 'natural',
    };

    const errors = checkOperationErrors(inputParams);
    expect(errors).toContain('Unknown operation!');
  });

  test('should return error for unknown user type', () => {
    const inputParams = {
      user_id: 1,
      date: '2016-01-05',
      operationAmount: 200.0,
      operationCurrency: 'EUR',
      operationType: 'cash_in',
      operationUserType: 'some_unknown_user_type',
    };

    const errors = checkOperationErrors(inputParams);
    expect(errors).toContain('Unknown user type!');
  });
});
