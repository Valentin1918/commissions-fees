import fs from 'fs';

const mockProceedOperation = jest.fn();
jest.mock('./utils/proceedOperation.js', () => mockProceedOperation);

describe('app', () => {
  const originalArgv = process.argv;
  const originalConsoleLog = console.log;

  beforeEach(() => {
    jest.resetModules(); // Clear module registry to reset process.argv changes
    console.log = jest.fn();
    process.argv = [...originalArgv];
  });

  afterEach(() => {
    process.argv = originalArgv;
    console.log = originalConsoleLog;
  });

  it('exits with error if no JSON file path is provided', async () => {
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const processExitSpy = jest
      .spyOn(process, 'exit')
      .mockImplementation(() => {});

    process.argv = ['node', 'src/app.js']; // Simulate no file path provided
    await import('./app.js').catch(() => {}); // Load and execute the script

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Please provide a path to the JSON file as an argument.',
    );
    expect(processExitSpy).toHaveBeenCalledWith(1);

    consoleErrorSpy.mockRestore();
    processExitSpy.mockRestore();
  });

  it('logs error if reading JSON file fails', async () => {
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    const mockReadFile = jest.spyOn(fs, 'readFile');

    process.argv = ['node', 'src/app.js', 'src/input.json']; // Simulate providing file path
    mockReadFile.mockImplementation((filePath, encoding, callback) => {
      callback(new Error('Read file error'));
    });

    await import('./app.js'); // Load and execute the script

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error reading the JSON file:',
      expect.any(Error),
    );

    consoleErrorSpy.mockRestore();
    mockReadFile.mockRestore();
  });

  it('logs error if parsing JSON fails', async () => {
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const mockReadFile = jest.spyOn(fs, 'readFile');

    process.argv = ['node', 'src/app.js', 'src/input.json'];
    mockReadFile.mockImplementation((filePath, encoding, callback) => {
      callback(null, 'invalid JSON');
    });

    await import('./app.js'); // Load and execute the script

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error parsing JSON:',
      expect.any(Error),
    );

    consoleErrorSpy.mockRestore();
    mockReadFile.mockRestore();
  });

  it('calls proceedOperation and console.log for each operation in the JSON file', async () => {
    const mockReadFile = jest.spyOn(fs, 'readFile');
    mockProceedOperation.mockRestore();

    const operations = [
      {
        user_id: 1,
        date: '2016-01-05',
        user_type: 'natural',
        type: 'cash_in',
        operation: { amount: 200, currency: 'EUR' },
      },
      {
        user_id: 2,
        date: '2016-01-06',
        user_type: 'juridical',
        type: 'cash_out',
        operation: { amount: 300, currency: 'USD' },
      },
    ];

    mockReadFile.mockImplementation((filePath, encoding, callback) => {
      callback(null, JSON.stringify(operations));
    });

    process.argv = ['node', 'src/app.js', 'src/input.json'];

    await import('./app.js'); // Load and execute the script

    expect(mockProceedOperation).toHaveBeenCalledTimes(2);
    expect(mockProceedOperation).toHaveBeenCalledWith(operations[0]);
    expect(mockProceedOperation).toHaveBeenCalledWith(operations[1]);
    expect(console.log).toHaveBeenCalledTimes(2);

    mockReadFile.mockRestore();
  });
});
