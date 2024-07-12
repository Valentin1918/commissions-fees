import logOperationOutput from './logOperationOutput';
import checkOperationErrors from './checkOperationErrors';
import feesCalculationEngine from './feesCalculationEngine';

jest.mock('./checkOperationErrors');
jest.mock('./feesCalculationEngine');

describe('logOperationOutput', () => {
  let consoleOutput = [];
  const originalConsoleLog = console.log;

  beforeEach(() => {
    console.log = jest.fn((...args) => {
      consoleOutput.push(args.join(' '));
    });
  });

  afterEach(() => {
    consoleOutput = [];
    console.log = originalConsoleLog;
  });

  it('logs operation errors', () => {
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

    logOperationOutput(mockInput);
    expect(console.log).toHaveBeenCalledWith(operationErrors.join(' '));
  });

  it('logs cash_in natural operation fee', () => {
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

    logOperationOutput(mockInput);
    expect(console.log).toHaveBeenCalledWith('6.00');
  });

  it('logs cash_in juridical operation fee', () => {
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

    logOperationOutput(mockInput);
    expect(console.log).toHaveBeenCalledWith('5.00');
  });

  it('logs cash_out juridical operation fee', () => {
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

    logOperationOutput(mockInput);
    expect(console.log).toHaveBeenCalledWith('4.00');
  });

  it('logs cash_out natural operation fee', () => {
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

    logOperationOutput(mockInput);
    expect(console.log).toHaveBeenCalledWith('3.00');
  });
});
