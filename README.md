# Commission Fees App

Wholly developed by Valentyn Grekulov.

### Prerequisites: node v20.12.2, npm 10.6.0

### This project contains only the dev dependencies, so run `npm i` if needed to run lint, prettier, or test scripts

## Available Scripts

In the project directory, you can run:

### `npm run execute`

Runs the App, and the output is displayed in the terminal.
It is possible to modify the `src/input.json` to verify the accuracy of the logic.
It is not only displaying the fees, but also various informative warning messages, is case if input is not valid.

### `npm run lint`

Checks all project according to ESLint rules, which are extended from the Airbnb config

### `npm run lint:fix`

Trying to fix all possible places according to the ESLint rules

### `npm run prettier:write`

Checks the code matching with the style rules defined by Prettier

### `npm run prettier:write`

Format your code to match the style rules defined by Prettier

### `npm run test`

Runs all tests

### `npm run prepare`

Initialises the husky. It is needed only for further work with this repository.
Needs to run only once -- establish pre-commit and pre-push hooks

## Project Structure

~ `src/app.js` --> root file which is running from `npm run execute`.
It is reading and parsing file by path provided as a second argument of the `execute` script.
For each operation it fires the `logOperationOutput` function and passes the operation's data as an argument.

~ `src/input.json` --> data from what fees are calculated and displayed.

~ `src/constants/feeRuleDetails.js` --> consolidated presentation of the fees calculation rule details.
It is organised by `operationType` and by `operationUserType`.
Resulting rule details object has always the same interface:

```typescript
interface FeeRuleDetails {
  percents: number;
  ruleName: string;
  criteria: { amount: number; currency: string };
}
```

Acceptable `operationType`:

```typescript
type OperationType = 'cash_in' | 'cash_out';
```

Acceptable `operationUserType`:

```typescript
type OperationType = 'natural' | 'juridical';
```

`feeRuleDetails` can be extended with various `operationType` and `operationUserType`

~ `src/utils/feesCalculationEngine.js` --> core place which contains the calculating fees logic based on the `ruleName`.
Each rule-based method don't know anything about `operationType` or `operationUserType` and
as a result it is `FeeRuleDetails` agnostic, it receives them as arguments altogether with the operation data.
This class can be extended with any additional calculation rules.

~ `src/utils/checkOperationErrors.js` --> as there is no TS, I've decided to add such input validation layer.
It simply validates an operation input and returns an array of errors, or empty array is all is fine.

~ `src/utils/logOperationOutput.js` --> this function is running for each operation.
It checks the operation validity with `checkOperationErrors`.
If there are resulting errors, it displays them and don't proceed further.
If the operation is valid it is retrieving the needed `ruleName` from the `feeRuleDetails` based on the `operationType`
and `operationUserType`.
It runs the `feesCalculationEngine` instance method with the name equal to `ruleName` value
and passing there as argument an object with correspondent `feeRuleDetails` and operation data.
The fee output is rounded to 2 decimals and logged into a terminal.
