# 🎬 Playwright Movies App - Test Automation Framework

[![Playwright Tests](https://github.com/foxynhi/movie-web-playwright/actions/workflows/playwright.yml/badge.svg)](https://github.com/foxynhi/movie-web-playwright/actions/workflows/playwright.yml)
[![Visual Regression Tests](https://github.com/foxynhi/movie-web-playwright/actions/workflows/visual-tests.yml/badge.svg)](https://github.com/foxynhi/movie-web-playwright/actions/workflows/visual-tests.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A comprehensive, production-ready Playwright test automation framework featuring Page Object Model architecture, custom reporting, accessibility testing, and visual regression testing.

![Homepage snapshot](https://github.com/foxynhi/movie-web-playwright/blob/main/tests/visual.spec.ts-snapshots/home-auth-chromium-linux.png)

## 🌟 Key Features

- ✅ **Page Object Model (POM)** - Scalable and maintainable test architecture
- ✅ **TypeScript** - Type-safe code with full IDE support
- ✅ **Multi-Browser Testing** - Chromium, Firefox, WebKit, Mobile, Edge, Chrome
- ✅ **Authentication Management** - Global setup with storage state reuse
- ✅ **Custom HTML Reports** - Beautiful reports with test history tracking
- ✅ **Accessibility Testing** - WCAG 2.1 Level AA compliance checks using Axe
- ✅ **Visual Regression Testing** - Automated screenshot comparison
- ✅ **CI/CD Ready** - GitHub Actions workflows with smart caching
- ✅ **Code Quality** - ESLint + Prettier with strict TypeScript rules
- ✅ **Test Tagging** - Organize tests by authentication state (@auth, @guest, @agnostic)

## 📋 Table of Contents

- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running Tests](#-running-tests)
- [Writing Tests](#-writing-tests)
- [Page Objects](#-page-objects)
- [Custom Fixtures](#-custom-fixtures)
- [Reports](#-reports)
- [CI/CD](#-cicd)
- [Code Quality](#-code-quality)
- [Contributing](#-contributing)
- [Troubleshooting](#-troubleshooting)

## 🏗️ Project Structure

```
playwright-movies-test/
├── .github/
│   └── workflows/              # CI/CD workflows
│       ├── playwright.yml      # Main test workflow
│       └── visual-tests.yml    # Visual regression workflow
├── fixtures/                   # Custom fixtures and interfaces
│   └── interfaces.ts          # TypeScript interfaces
├── pages/                      # Page Object Model classes
│   ├── basePage.ts            # Base page with common methods
│   ├── homePage.ts            # Home page objects
│   ├── loginPage.ts           # Login page objects
│   ├── movieDetailPage.ts     # Movie detail page objects
│   └── movieListPage.ts       # Movie list page objects
├── tests/                      # Test specifications
│   ├── common/                # Shared test utilities
│   │   ├── auth.ts           # Authentication helper
│   │   └── testBase.ts       # Custom test fixture
│   ├── accessibility.spec.ts  # A11y tests
│   ├── login.spec.ts         # Login tests
│   ├── logout.spec.ts        # Logout tests
│   ├── movieDetail.spec.ts   # Movie detail tests
│   ├── movieList.spec.ts     # Movie list tests
│   ├── search.spec.ts        # Search tests
│   ├── smoke.spec.ts         # Smoke tests
│   ├── ui.states.spec.ts     # UI state tests
│   └── visual.spec.ts        # Visual regression tests
├── utils/                      # Utility modules
│   ├── globalSetup.ts        # Global test setup
│   └── reportGenerator.ts    # Custom report generator
├── TestResults/               # Test execution results
│   ├── testHistory.json      # Test history tracking
│   ├── playwright-report/    # Playwright HTML reports
│   └── screenshots/          # Failure screenshots
├── .env                       # Environment variables (not in repo)
├── example.env               # Environment template
├── eslint.config.js          # ESLint configuration
├── playwright.config.ts      # Playwright configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Dependencies and scripts
```

## 📋 Prerequisites

- **Node.js** v16 or higher
- **npm** or **yarn**
- **Git**

## 🔧 Installation

1. **Clone the repository:**

```bash
git clone https://github.com/foxynhi/movie-web-playwright.git
cd playwright-movies-test
```

2. **Install dependencies:**

```bash
npm install
```

3. **Install Playwright browsers:**

```bash
npx playwright install
```

4. **Configure environment variables:**

```bash
cp example.env .env
```

Edit `.env` with your credentials:

```env
# Login Credentials
TEST_EMAIL=your-email@example.com
TEST_PASSWORD=your-password

# Base URL
BASE_URL=https://debs-obrien.github.io/playwright-movies-app
```

5. **Create TestResults directory:**

```bash
mkdir -p TestResults/screenshots
echo "[]" > TestResults/testHistory.json
```

## ⚙️ Configuration

### Playwright Configuration

The `playwright.config.ts` file contains all test configuration:

- **Base URL**: Set via `BASE_URL` environment variable
- **Timeouts**: Default 30s for actions, 60 minutes for tests
- **Retries**: 2 retries on CI, 0 locally
- **Parallel Execution**: 6 workers on CI
- **Browsers**: Multiple projects for different browsers and authentication states

### Projects

- **guest-chromium/firefox/mobile-chromium** - Unauthenticated tests
- **auth-chromium/firefox/mobile-chromium** - Authenticated tests (uses storage state)

## 🏃 Running Tests

### Basic Commands

```bash
# Run all tests
npm test

# Run in headed mode (visible browser)
npm run test:headed

# Run in UI mode (interactive)
npm run test:ui

# Run in debug mode
npm run test:debug
```

### Browser-Specific Tests

```bash
# Chromium
npm run test:chromium

# Firefox
npm run test:firefox

# Mobile Chrome
npm run test:mobile-chromium

# Google Chrome
npm run test:google-chrome

# Microsoft Edge
npm run test:microsoft-edge
```

### Tagged Tests

```bash
# Run only smoke tests
npm run test:smoke

# Run tests with specific tag
npx playwright test --grep @auth
npx playwright test --grep @guest
npx playwright test --grep @a11y
```

### Other Commands

```bash
# View test report
npm run report

# Clean test results
npm run clean

# Code inspection tool
npm run inspect
```

## 📝 Writing Tests

### Basic Test Structure

```typescript
import { expect, test, trackStep } from "./common/testBase";

test.describe("Feature Name @tag", () => {
  test("test case description", async ({
    homePage,
    testCredentials,
    reportGenerator,
  }) => {
    const { testResult } = reportGenerator;

    await test.step("Step description", async () => {
      await trackStep(
        "Step description",
        async () => {
          // Your test actions
          await homePage.goTo(testCredentials.baseUrl);
          await expect(homePage.grid).toBeVisible();
        },
        testResult,
      );
    });
  });
});
```

### Test Tags

- `@guest` - Tests that require unauthenticated state
- `@auth` - Tests that require authenticated state
- `@agnostic` - Tests that work in any state
- `@smoke` - Critical smoke tests
- `@a11y` - Accessibility tests
- `@visual` - Visual regression tests

### Using Fixtures

```typescript
test("example", async ({
  page, // Playwright page
  homePage, // Home page object
  loginPage, // Login page object
  movieDetailPage, // Movie detail page object
  movieListPage, // Movie list page object
  testCredentials, // { email, password, baseUrl }
  reportGenerator, // Custom report generator
}) => {
  // Your test code
});
```

## 🎯 Page Objects

### BasePage

Common methods available to all page objects:

```typescript
await basePage.goTo(url);
await basePage.click(locator);
await basePage.fill(locator, text);
await basePage.waitForElement(locator);
await basePage.isVisible(locator);
await basePage.takeScreenshot(name);
const title = await basePage.getTitle();
const url = basePage.getCurrentUrl();
```

### HomePage

```typescript
await homePage.goTo(baseUrl);
await homePage.clickLogin();
await homePage.clickLogOut();
await homePage.fillSearchInput(searchText);
await homePage.goToCreateListPage();
await homePage.goToMyListPage();
const isLoggedIn = await homePage.isUserLoggedIn();
const heading = await homePage.getCategoryHeading();
const movieCard = homePage.movieCard(title);
const count = await homePage.movieCardCount(title);
```

### LoginPage

```typescript
await loginPage.login(email, password);
await loginPage.waitForLoginForm();
const isVisible = await loginPage.isLoginFormVisible();
```

## 🔧 Custom Fixtures

### testBase.ts

Provides custom fixtures with automatic setup/teardown:

- **Page Objects**: Automatically initialized
- **Report Generator**: Automatically generates reports after each test
- **Test Credentials**: Loads from environment variables
- **Authentication**: Global setup for authenticated tests

### trackStep()

Helper function for tracking test steps with timing:

```typescript
await trackStep(
  "Step description",
  async () => {
    // Step actions
  },
  testResult,
);
```

## 📊 Reports

### Custom HTML Reports

Generated in `TestResults/` with format:

```
<test_name>-<YYYYMMDD>-<sequence>.html
```

**Features:**

- Test status with visual indicators
- Duration and timing information
- Step-by-step execution details
- Browser information
- Error details with stack traces
- Beautiful, responsive design

### Test History

`TestResults/testHistory.json` maintains execution history:

```json
[
  {
    "timestamp": "2025-01-10T10:30:45.123Z",
    "testName": "login with valid credentials",
    "status": "passed",
    "duration": 3456,
    "reportFile": "login_with_valid_credentials-20250110-1.html",
    "browser": "chromium",
    "summary": {
      "passed": 1,
      "failed": 0,
      "total": 1
    }
  }
]
```

### Playwright Reports

Standard Playwright HTML reports available at:

- `TestResults/playwright-report/`

View with: `npm run report`

## 🚀 CI/CD

### GitHub Actions Workflows

#### Main Test Workflow (`playwright.yml`)

- Runs on push/PR to `main` and `dev` branches
- Excludes visual regression tests
- Uploads test results and screenshots
- Uses browser caching for faster runs

#### Visual Regression Workflow (`visual-tests.yml`)

- Runs visual comparison tests
- Auto-generates baseline snapshots if missing
- Commits baseline snapshots automatically
- Stores visual diffs as artifacts

### Running in CI

Tests automatically run on:

- Push to `main` or `dev` branches
- Pull requests targeting `main` or `dev`

### Artifacts

CI uploads the following artifacts:

- Test results
- Playwright HTML report
- Screenshots on failure
- Visual regression snapshots

## 🎨 Code Quality

### Linting and Formatting

```bash
# Format code with Prettier
npm run format

# Check formatting
npm run format-check

# Lint with ESLint
npm run lint

# Check linting
npm run lint-check

# Run both format and lint
npm run validate
```

### Pre-commit Validation

Always run before committing:

```bash
npm run validate
```

## 🤝 Contributing

### Naming Conventions

| Type      | Convention   | Example                      |
| --------- | ------------ | ---------------------------- |
| Files     | camelCase.ts | `homePage.ts`                |
| Classes   | PascalCase   | `HomePage`, `LoginPage`      |
| Methods   | camelCase    | `clickLogin()`, `fillForm()` |
| Variables | camelCase    | `testResult`, `isVisible`    |
| Constants | UPPER_SNAKE  | `TEST_EMAIL`, `BASE_URL`     |

### Commit Message Format

```bash
type: Description

Examples:
feat: Add search functionality tests
fix: Resolve flaky login test
docs: Update README with examples
refactor: Simplify page object methods
test: Add accessibility tests
```

### Branch Naming

```bash
feature/description
fix/description
refactor/description

Examples:
feature/add-api-tests
fix/flaky-login-test
refactor/simplify-page-objects
```

## 🐛 Troubleshooting

### Browsers Not Found

```bash
npx playwright install
```

### Environment Variables Not Loading

- Ensure `.env` file exists in root directory
- Check variable names match `example.env`
- Restart your terminal/IDE after creating `.env`

### Tests Failing on CI

- Check that visual snapshots are committed for Linux
- Verify BASE_URL is accessible from GitHub runners
- Review GitHub Actions logs for specific errors

### Authentication Issues

- Verify credentials in `.env` are correct
- Check `fixtures/storageState.auth.json` was generated
- Review `utils/globalSetup.ts` for auth logic

### Visual Test Failures

- Visual tests use Linux snapshots by default
- Regenerate snapshots: `npx playwright test visual.spec.ts --update-snapshots`
- Commit new snapshots for your platform

### Reports Not Generating

- Verify `TestResults/` directory exists
- Check write permissions
- Ensure `testHistory.json` exists and is valid JSON

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 📚 Additional Resources

- [Playwright Documentation](https://playwright.dev)
- [Page Object Model Best Practices](https://playwright.dev/docs/pom)
- [Web Accessibility Guidelines (WCAG)](https://www.w3.org/WAI/WCAG21/quickref/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 👤 Author

**Foxy Nhi**

- GitHub: [@foxynhi](https://github.com/foxynhi)

## 🙏 Acknowledgments

- Test application by [Debbie O'Brien](https://github.com/debs-obrien/playwright-movies-app)
- Built with [Playwright](https://playwright.dev)
- Accessibility testing with [Axe-core](https://github.com/dequelabs/axe-core)

---

**Happy Testing! 🎭**
