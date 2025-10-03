# Playwright Movies App - Test Automation

A comprehensive Playwright test automation framework using Page Object Model (POM) pattern with advanced reporting capabilities.

## 🏗️ Project Structure

```
playwright-movies-test/
├── pages/                     # Page Object Model classes
│   ├── BasePage.js            # Base class with common methods
│   ├── HomePage.js            # Home page objects and methods
│   └── LoginPage.js           # Login page objects and methods
├── tests/                     # Test specifications
│   └── login.spec.js          # Login test cases
├── utils/                     # Utility modules
│   └── reportGenerator.js     # Custom HTML report generator
├── TestResults/               # Test execution results
│   ├── testHistory.json       # Test execution history
│   ├── *.html                 # Custom HTML reports
│   └── screenshots/           # Test screenshots
├── .env                       # Environment variables (credentials)
├── .gitignore                 # Git ignore rules
├── playwright.config.js       # Playwright configuration
├── package.json               # Project dependencies
└── README.md                  # This file
```

## 🚀 Features

- ✅ **Page Object Model (POM)** - Organized, maintainable test structure
- ✅ **BasePage Pattern** - Reusable methods across all page objects
- ✅ **Environment Variables** - Secure credential management via `.env`
- ✅ **Custom HTML Reports** - Beautiful reports with naming format: `<TestCase>-<YYYYMMDD>-<Sequence>.html`
- ✅ **Test History Tracking** - JSON-based history in `testHistory.json`
- ✅ **User-Centric Locators** - Using `getByRole`, `getByLabel`, `getByText`
- ✅ **Test Steps** - Organized with `test.step()` for clear reporting
- ✅ **Screenshots on Failure** - Automatic screenshot capture
- ✅ **Video Recording** - Video on failure for debugging
- TO-DO: **Multi-Browser Support** - Chromium, Firefox, WebKit

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## 🔧 Installation

1. **Clone or create the project structure**

2. **Install dependencies:**

```bash
npm install
```

3. **Install Playwright browsers:**

```bash
npx playwright install
```

4. **Create `.env` file** in the root directory:

```env
# Login Credentials
TEST_EMAIL=me@outlook.com
TEST_PASSWORD=12345

# Base URL
BASE_URL=https://debs-obrien.github.io/playwright-movies-app
```

5. **Create initial test history file:**

```bash
mkdir -p TestResults
echo "[]" > TestResults/testHistory.json
```

## 🏃 Running Tests

### Run all tests

```bash
npm test
```

### Run tests in headed mode (visible browser)

```bash
npm run test:headed
```

### Run tests in UI mode (interactive)

```bash
npm run test:ui
```

### Run tests in debug mode

```bash
npm run test:debug
```

### Run tests in specific browser

```bash
npm run test:chromium
npm run test:firefox
npm run test:webkit
```

### View Playwright HTML report

```bash
npm run report
```

### Clean test results

```bash
npm run clean
```

## 📊 Reports

### Custom HTML Reports

After each test run, a custom HTML report is generated in `TestResults/` with the format:

- `login_to_movies_app_with_valid_credentials-20250103-1.html`
- `login_to_movies_app_with_valid_credentials-20250103-2.html` (if run again same day)

These reports include:

- ✅ Test status (passed/failed)
- ⏱️ Duration and timestamps
- 📝 Step-by-step execution details
- 🐛 Error details (if failed)
- 🌐 Browser information

### Test History

`TestResults/testHistory.json` maintains a running history of all test executions:

```json
[
  {
    "timestamp": "2025-01-03T10:30:45.123Z",
    "testName": "login to movies app with valid credentials",
    "status": "passed",
    "duration": 3456,
    "reportFile": "login_to_movies_app_with_valid_credentials-20250103-1.html",
    "browser": "chromium",
    "summary": {
      "passed": 1,
      "failed": 0,
      "total": 1
    }
  }
]
```

## 📝 Page Object Model Structure

### BasePage.js

Common methods available to all page objects:

- `navigate(url)` - Navigate to URL
- `click(locator)` - Click element
- `fill(locator, text)` - Fill input field
- `isVisible(locator, timeout)` - Check visibility
- `waitForElement(locator, timeout)` - Wait for element
- `takeScreenshot(name)` - Capture screenshot
- `getTitle()` - Get page title
- `getCurrentUrl()` - Get current URL

### HomePage.js

Methods specific to the home page:

- `goto(baseUrl)` - Navigate to home
- `isUserLoggedIn()` - Check login status
- `clickLogin()` - Open login page
- `verifyLoggedIn()` - Verify successful login
- `searchMovie(movieName)` - Search for movies
- `getCategoryHeading()` - Get current category

### LoginPage.js

Methods for the login page:

- `login(email, password)` - Complete login flow
- `waitForLoginForm()` - Wait for form to load
- `fillEmail(email)` - Fill email field
- `fillPassword(password)` - Fill password field
- `clickLoginSubmit()` - Submit login
- `isLoginFormVisible()` - Check form visibility

## 🧪 Writing New Tests

Example test structure:

```javascript
import { test, expect } from "@playwright/test";
import { HomePage } from "../pages/HomePage.js";
import dotenv from "dotenv";

dotenv.config();

test("my new test", async ({ page }) => {
  const homePage = new HomePage(page);

  await test.step("Step 1 description", async () => {
    // Your test actions
    await homePage.goto(process.env.BASE_URL);
  });

  await test.step("Step 2 description", async () => {
    // More actions
  });
});
```

## 🔒 Security Best Practices

- ✅ Credentials stored in `.env` (not committed to git)
- ✅ `.env` added to `.gitignore`
- ✅ Environment variables loaded via `dotenv`
- ⚠️ Never hardcode credentials in test files
- ⚠️ Never commit `.env` to version control

## 📦 Dependencies

### Production Dependencies

- `dotenv` - Environment variable management

### Dev Dependencies

- `@playwright/test` - Playwright testing framework
- `@types/node` - TypeScript definitions for Node.js

## 🤝 Contributing

1. Create a new branch for your feature
2. Add tests in `tests/` directory
3. Create page objects in `pages/` if needed
4. Run tests to ensure they pass
5. Submit a pull request

## 📄 License

MIT

## 🐛 Troubleshooting

### Tests failing with "browser not found"

```bash
npx playwright install
```

### Environment variables not loading

- Ensure `.env` file exists in root directory
- Check that `dotenv.config()` is called in test files
- Verify variable names match in `.env` and test files

### Reports not generating

- Check that `TestResults/` directory exists
- Verify write permissions on the directory
- Check console for any error messages

## 📚 Additional Resources

- [Playwright Documentation](https://playwright.dev)
- [Page Object Model Pattern](https://playwright.dev/docs/pom)
- [Best Practices](https://playwright.dev/docs/best-practices)

---

**Happy Testing! 🎭**
