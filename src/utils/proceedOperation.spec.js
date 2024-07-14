import proceedOperation from './proceedOperation';
import checkOperationErrors from './checkOperationErrors';
import feesCalculationEngine from './feesCalculationEngine';

jest.mock('./checkOperationErrors');
jest.mock('./feesCalculationEngine');

describe('proceedOperation', () => {
  it('return operation errors', () => {
    // Mocking operationErrors to simulate errors
    const operationErrors = ['No user id provided!', 'Invalid date provided!'];
    checkOperationErrors.mockReturnValue(operationErrors);

    const mockInput = {
      user_id: 1,
      date: '2016-01-05',
      user_type: 'natural',
      type: 'cash_in',
      operation: { amount: 200.0, currency: 'EUR' },
    };

    const feeOutput = proceedOperation(mockInput);
    expect(feeOutput).toBe(operationErrors.join(' '));
  });

  it('return cash_in natural operation fee', () => {
    // Mocking operationErrors to simulate no errors
    const operationErrors = [];
    checkOperationErrors.mockReturnValue(operationErrors);

    const mockInput = {
      user_id: 1,
      date: '2016-01-05',
      user_type: 'natural',
      type: 'cash_in',
      operation: { amount: 200.0, currency: 'EUR' },
    };

    // Mocking max rule
    feesCalculationEngine.max.mockReturnValue(6);

    const feeOutput = proceedOperation(mockInput);
    expect(feeOutput).toBe('6.00');
  });

  it('return cash_in juridical operation fee', () => {
    // Mocking operationErrors to simulate no errors
    const operationErrors = [];
    checkOperationErrors.mockReturnValue(operationErrors);

    const mockInput = {
      user_id: 1,
      date: '2016-01-05',
      user_type: 'juridical',
      type: 'cash_in',
      operation: { amount: 200.0, currency: 'EUR' },
    };

    // Mocking max rule
    feesCalculationEngine.max.mockReturnValue(5);

    const feeOutput = proceedOperation(mockInput);
    expect(feeOutput).toBe('5.00');
  });

  it('return cash_out juridical operation fee', () => {
    // Mocking operationErrors to simulate no errors
    const operationErrors = [];
    checkOperationErrors.mockReturnValue(operationErrors);

    const mockInput = {
      user_id: 1,
      date: '2016-01-05',
      user_type: 'juridical',
      type: 'cash_out',
      operation: { amount: 200.0, currency: 'EUR' },
    };

    // Mocking min rule
    feesCalculationEngine.min.mockReturnValue(4);

    const feeOutput = proceedOperation(mockInput);
    expect(feeOutput).toBe('4.00');
  });

  it('return cash_out natural operation fee', () => {
    // Mocking operationErrors to simulate no errors
    const operationErrors = [];
    checkOperationErrors.mockReturnValue(operationErrors);

    const mockInput = {
      user_id: 1,
      date: '2016-01-05',
      user_type: 'natural',
      type: 'cash_out',
      operation: { amount: 200.0, currency: 'EUR' },
    };

    // Mocking week_limit rule
    feesCalculationEngine.week_limit.mockReturnValue(3);

    const feeOutput = proceedOperation(mockInput);
    expect(feeOutput).toBe('3.00');
  });
});
