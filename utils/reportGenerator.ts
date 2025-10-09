import fs from "fs";
import path from "path";
import type { TestResult } from "../fixtures/interfaces";
import type { StepTime } from "../fixtures/interfaces";

export class ReportGenerator {
  readonly resultsDir: string;
  readonly historyFile: string;

  constructor() {
    this.resultsDir = "TestResults";
    this.historyFile = path.join(this.resultsDir, "testHistory.json");
    this.ensureDirectories();
  }

  ensureDirectories(): void {
    if (!fs.existsSync(this.resultsDir)) {
      fs.mkdirSync(this.resultsDir, { recursive: true });
    }

    const screenshotsDir = path.join(this.resultsDir, "screenshots");
    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir, { recursive: true });
    }
  }

  /**
   * Generate filename with format: <TestCase>-<YYYYMMDD>-<Sequence>.html
   * @param {string} testName - Test case name
   * @returns {string} - Generated filename
   */
  generateFilename(testName: string): string {
    const date = new Date();
    const dateStr = date.toISOString().split("T")[0].replace(/-/g, "");

    // Clean test name for filename
    const cleanTestName = testName
      .replace(/[^a-zA-Z0-9]/g, "_")
      .replace(/_+/g, "_")
      .toLowerCase();

    // Find existing files with same test and date
    const pattern = new RegExp(`^${cleanTestName}-${dateStr}-(\\d+)\\.html$`);
    let sequence = 1;

    if (fs.existsSync(this.resultsDir)) {
      const files = fs.readdirSync(this.resultsDir);
      const matches = files
        .map((file) => file.match(pattern))
        .filter((match) => match !== null)
        .map((match) => parseInt(match[1]));

      if (matches.length > 0) {
        sequence = Math.max(...matches) + 1;
      }
    }

    return `${cleanTestName}-${dateStr}-${sequence}.html`;
  }

  /**
   * Generate HTML report
   * @param {Object} testResult - Test result object
   * @returns {string} - Path to generated report
   */
  generateReport(testResult: TestResult): string {
    const filename = this.generateFilename(testResult.testName);
    const filepath = path.join(this.resultsDir, filename);

    const html = this.createHTMLReport(testResult);
    fs.writeFileSync(filepath, html, "utf8");

    this.updateTestHistory(testResult, filename);

    return filepath;
  }

  /**
   * Create HTML report content
   * @param {Object} result - Test result
   * @returns {string} - HTML content
   */
  createHTMLReport(result: TestResult): string {
    const statusColor = result.status === "passed" ? "#4CAF50" : "#f44336";
    const statusIcon = result.status === "passed" ? "✓" : "✗";

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test Report - ${result.testName}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: #f5f5f5;
            padding: 20px;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
        }
        .header h1 {
            margin-bottom: 10px;
            font-size: 28px;
        }
        .status {
            display: inline-block;
            padding: 8px 20px;
            background: ${statusColor};
            border-radius: 20px;
            font-weight: bold;
            font-size: 14px;
        }
        .content {
            padding: 30px;
        }
        .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .info-card {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #667eea;
        }
        .info-card h3 {
            color: #667eea;
            font-size: 14px;
            text-transform: uppercase;
            margin-bottom: 8px;
        }
        .info-card p {
            font-size: 18px;
            font-weight: 600;
            color: #333;
        }
        .steps {
            margin-top: 30px;
        }
        .steps h2 {
            margin-bottom: 20px;
            color: #333;
        }
        .step {
            background: #f8f9fa;
            padding: 15px 20px;
            margin-bottom: 10px;
            border-radius: 6px;
            border-left: 4px solid ${statusColor};
        }
        .step-title {
            font-weight: 600;
            color: #333;
            margin-bottom: 5px;
        }
        .step-duration {
            color: #666;
            font-size: 14px;
        }
        .error-section {
            background: #fff3f3;
            border: 1px solid #ffcdd2;
            border-radius: 8px;
            padding: 20px;
            margin-top: 20px;
        }
        .error-section h3 {
            color: #d32f2f;
            margin-bottom: 10px;
        }
        .error-section pre {
            background: white;
            padding: 15px;
            border-radius: 4px;
            overflow-x: auto;
            font-size: 13px;
            color: #d32f2f;
        }
        .footer {
            background: #f8f9fa;
            padding: 20px 30px;
            text-align: center;
            color: #666;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>${statusIcon} ${result.testName}</h1>
            <span class="status">${result.status?.toUpperCase()}</span>
        </div>
        
        <div class="content">
            <div class="info-grid">
                <div class="info-card">
                    <h3>Duration</h3>
                    <p>${result.duration}ms</p>
                </div>
                <div class="info-card">
                    <h3>Started At</h3>
                    <p>${new Date(result.startTime).toLocaleString()}</p>
                </div>
                <div class="info-card">
                    <h3>Browser</h3>
                    <p>${result.browser || "chromium"}</p>
                </div>
                <div class="info-card">
                    <h3>Test File</h3>
                    <p>${result.testFile}</p>
                </div>
            </div>

            ${
              result.steps && result.steps.length > 0
                ? `
            <div class="steps">
                <h2>Test Steps</h2>
                ${result.steps
                  .map(
                    (step: StepTime, index: number) => `
                <div class="step">
                    <div class="step-title">${index + 1}. ${step.step}</div>
                    <div class="step-duration">Duration: ${step.duration}ms</div>
                </div>
                `,
                  )
                  .join("")}
            </div>
            `
                : ""
            }

            ${
              result.error
                ? `
            <div class="error-section">
                <h3>Error Details</h3>
                <pre>${result.error}</pre>
            </div>
            `
                : ""
            }
        </div>

        <div class="footer">
            Generated on ${new Date().toLocaleString()} | Playwright Test Report
        </div>
    </div>
</body>
</html>
    `.trim();
  }

  /**
   * Update test history JSON
   * @param {Object} testResult - Test result
   * @param {string} filename - Report filename
   */
  updateTestHistory(testResult: TestResult, filename: string): void {
    let history = [];

    // Read existing history
    if (fs.existsSync(this.historyFile)) {
      try {
        const content = fs.readFileSync(this.historyFile, "utf8");
        history = JSON.parse(content);
      } catch (error) {
        console.error("Error reading test history:", error);
        history = [];
      }
    }

    // Add new entry
    const entry = {
      timestamp: new Date().toISOString(),
      testName: testResult.testName,
      status: testResult.status,
      duration: testResult.duration,
      reportFile: filename,
      browser: testResult.browser || "chromium",
      summary: {
        passed: testResult.status === "passed" ? 1 : 0,
        failed: testResult.status === "failed" ? 1 : 0,
        total: 1,
      },
    };

    history.unshift(entry); // Add to beginning

    // Keep only last 100 entries
    if (history.length > 100) {
      history = history.slice(0, 100);
    }

    // Write updated history
    fs.writeFileSync(
      this.historyFile,
      JSON.stringify(history, null, 2),
      "utf8",
    );
  }

  /**
   * Get test history
   * @returns {Array} - Test history entries
   */
  getTestHistory(): object[] {
    if (!fs.existsSync(this.historyFile)) {
      return [];
    }

    try {
      const content = fs.readFileSync(this.historyFile, "utf8");
      return JSON.parse(content);
    } catch (error) {
      console.error("Error reading test history:", error);
      return [];
    }
  }
}
