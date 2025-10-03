## Code Quality Practices  
- **Locators**: Prefer user-centric locators such as `getByRole`, `getByLabel`, or `getByText`. Use `test.step()` to organize actions for readability and clear reporting.  
- **Assertions**: Leverage Playwright’s built-in auto-retrying assertions (e.g., `await expect(locator).toHaveText()`). Avoid plain visibility checks unless specifically required.  
- **Timeouts**: Depend on Playwright’s auto-waiting; avoid manual waits or increasing timeouts unnecessarily.  
- **Clarity**: Write meaningful test and step names. Use comments sparingly, only to explain complex or non-obvious logic.  

## Test Structure  
- **Imports**: Start with `import { test, expect } from '@playwright/test';`.  
- **Grouping**: Organize related tests with `test.describe()`.  
- **Hooks**: Use `beforeEach` for repeated setup tasks such as navigation.  
- **Titles**: Follow a descriptive pattern like `Feature - Action or Scenario`.  

## File Organization  
- **Location**: Store test files inside the `tests/` directory.  
- **Naming**: Use `<feature-or-page>.spec.ts` format (e.g., `login.spec.ts`).  
- **Scope**: Keep each test file focused on one major feature or page.  

## Assertion Guidelines  
- **UI Structure**: Use `toMatchAriaSnapshot` to validate accessibility tree structures.  
- **Element Counts**: Use `toHaveCount` for verifying element numbers.  
- **Text Validation**: Use `toHaveText` for exact matches and `toContainText` for partial matches.  
- **Navigation**: Validate URLs with `toHaveURL`.  

## Scope
- Execute only the test cases listed under the **/tests** section.

## Execution Rules
1. **Running Tests**  
   - If any step or verification fails:  
     - Mark the entire test case as **Failed**.  
     - Capture a screenshot of the failure immediately.  
     - Save screenshots in `/screenshots`.  

1. **Test Case Completion**  
   - After finishing one test case, move to the next in the sequence.  
   - Continue until all test cases in scope are executed.  

## Reporting
1. **Report Generation**  
   - Generate a single HTML report after execution.  
   - Save the report under the `TestResults/` folder.  
   - Report naming format:  
     ```
     <TestCase>-<YYYYMMDD>-<Sequence>.html
     ```
     - `<TestCase>` → name of the test case
     - `<YYYYMMDD>` → current date in year-month-day format (e.g., 20250930).  
     - `<Sequence>` → incremented by +1 compared to the last report in the folder.  

2. **Report Contents**  
   The HTML report must include:  
   - **Summary Card** (fixed at the top) showing total Passed, Failed, and Skipped.  
   - **Pie Chart** to visualize Passed / Failed / Skipped distribution.  
   - **Trend Line Chart** showing results over time using data from `testHistory.json`.  
   - **Detailed Results Table** for each test case with:  
     - Test case name  
     - Status (Passed / Failed / Skipped)  
     - Duration  
     - Error message (if failed)  
     - Embedded screenshot (if failed)  

3. **Style and Usability**  
   - Use professional formatting similar to Allure/Extent reports.  
   - Colors: Green = Passed, Red = Failed, Yellow = Skipped.  
   - Add collapsible sections for each test case.  
   - Provide search and filter options for test cases.  
   - Ensure responsive layout for different screen sizes.  

4. **History Tracking**  
   - Update `TestResults/testHistory.json` after each run with the latest summary.  
   - Use this file to generate execution trends (line chart).  

## Test Configurations
- **Web Browser:** Chrome  
- **Priority:** Low  

## Test Suite
- [User Login](/tests/userLogin.md)  
- [Search Products](/tests/searchProducts.md)  
