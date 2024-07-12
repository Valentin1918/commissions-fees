import fs from 'fs';

const mockLogOperationOutput = jest.fn();
jest.mock('./utils/logOperationOutput.js', () => mockLogOperationOutput);

describe('app', () => {
  const originalArgv = process.argv;

  beforeEach(() => {
    jest.resetModules(); // Clear module registry to reset process.argv changes
    process.argv = [...originalArgv];
  });

  afterEach(() => {
    process.argv = originalArgv;
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

  it('calls logOperationOutput for each operation in the JSON file', async () => {
    const mockReadFile = jest.spyOn(fs, 'readFile');
    mockLogOperationOutput.mockRestore();

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

    expect(mockLogOperationOutput).toHaveBeenCalledTimes(2);
    expect(mockLogOperationOutput).toHaveBeenCalledWith(operations[0]);
    expect(mockLogOperationOutput).toHaveBeenCalledWith(operations[1]);

    mockReadFile.mockRestore();
  });
});
