import fs from 'fs';
import path from 'path';
import logOperationOutput from './utils/logOperationOutput.js';

const jsonFilePath = process.argv[2];

if (!jsonFilePath) {
  console.error('Please provide a path to the JSON file as an argument.');
  process.exit(1);
}

fs.readFile(path.resolve(jsonFilePath), 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading the JSON file:', err);
    return;
  }

  try {
    const operations = JSON.parse(data);
    operations.forEach((args) => logOperationOutput(args));
  } catch (error) {
    console.error('Error parsing JSON:', error);
  }
});
