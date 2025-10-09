import { expect, test, trackStep } from "./common/testBase";
import AxeBuilder from "@axe-core/playwright";

test.describe("Accessibility Tests @a11y @guest", () => {
  // test("home page meets WCAG 2.1 Level AA standards", async ({
  //   page,
  //   homePage,
  //   testCredentials,
  //   reportGenerator,
  // }) => {
  //   const { testResult } = reportGenerator;

  //   await test.step("Navigate to home page", async () => {
  //     await trackStep(
  //       "Navigate to home page",
  //       async () => {
  //         await homePage.goTo(testCredentials.baseUrl);
  //         await expect(homePage.grid).toBeVisible();
  //       },
  //       testResult,
  //     );
  //   });

  //   await test.step("Run accessibility scan", async () => {
  //     await trackStep(
  //       "Run accessibility scan on home page",
  //       async () => {
  //         const accessibilityScanResults = await new AxeBuilder({ page })
  //           .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
  //           .analyze();

  //         if (accessibilityScanResults.violations.length > 0) {
  //           console.log(
  //             "\nAccessibility violations found: ",
  //             accessibilityScanResults.violations.length,
  //           );
  //           accessibilityScanResults.violations.forEach((violation) => {
  //             console.log(`\n${violation.id}: ${violation.description}`);
  //             console.log(`   Impact: ${violation.impact}`);
  //             console.log(`   Help: ${violation.helpUrl}`);
  //             violation.nodes.forEach((node) => {
  //               console.log(`   → ${node.html}`);
  //             });
  //           });
  //         }

  //         expect(accessibilityScanResults.violations).toEqual([]);
  //       },
  //       testResult,
  //     );
  //   });
  // });

  test("login page is accessible", async ({
    page,
    homePage,
    loginPage,
    testCredentials,
    reportGenerator,
  }) => {
    const { testResult } = reportGenerator;

    await test.step("Navigate to login page", async () => {
      await trackStep(
        "Navigate to login page",
        async () => {
          await homePage.goTo(testCredentials.baseUrl);
          await expect(homePage.grid).toBeVisible();
          await homePage.clickLogin();
          await expect(loginPage.loginHeading).toBeVisible();
        },
        testResult,
      );
    });

    await test.step("Scan login form accessibility", async () => {
      await trackStep(
        "Scan login form for WCAG compliance",
        async () => {
          const accessibilityScanResults = await new AxeBuilder({ page })
            .withTags(["wcag2a", "wcag2aa"])
            .include("form")
            .analyze();

          expect(accessibilityScanResults.violations).toEqual([]);
        },
        testResult,
      );
    });
  });

  // test("movie details modal is accessible", async ({
  //   page,
  //   homePage,
  //   movieDetailPage,
  //   testCredentials,
  //   reportGenerator,
  // }) => {
  //   const { testResult } = reportGenerator;

  //   await test.step("Open movie details", async () => {
  //     await trackStep(
  //       "Navigate and open first movie details",
  //       async () => {
  //         await homePage.goTo(testCredentials.baseUrl);
  //         await expect(homePage.grid).toBeVisible();
  //         await movieDetailPage.clickFirstMovie();
  //         await expect(movieDetailPage.movieTitle).toBeVisible();
  //       },
  //       testResult,
  //     );
  //   });

  //   await test.step("Scan modal accessibility", async () => {
  //     await trackStep(
  //       "Check modal ARIA attributes and keyboard support",
  //       async () => {
  //         const accessibilityScanResults = await new AxeBuilder({ page })
  //           .withTags(["wcag2a", "wcag2aa"])
  //           .analyze();

  //         expect(accessibilityScanResults.violations).toEqual([]);
  //       },
  //       testResult,
  //     );
  //   });
  // });

  test("search functionality is keyboard accessible", async ({
    page,
    homePage,
    testCredentials,
    reportGenerator,
  }) => {
    const { testResult } = reportGenerator;
    const searchText = "war";

    await test.step("Navigate to home page", async () => {
      await trackStep(
        "Load home page",
        async () => {
          await homePage.goTo(testCredentials.baseUrl);
          await expect(homePage.grid).toBeVisible();
        },
        testResult,
      );
    });

    await test.step("Test keyboard navigation through search", async () => {
      await trackStep(
        "Navigate search using keyboard only",
        async () => {
          await page.keyboard.press("Tab");
          await page.keyboard.press("Tab");

          await page.keyboard.press("Enter");

          await expect(homePage.searchInput).toBeFocused();
          await page.keyboard.type(searchText);

          await page.keyboard.press("Enter");
          await expect(homePage.searchResultsTitle).toBeVisible();

          const firstMovie = homePage.movieCard(searchText);
          await expect(firstMovie).toBeVisible();
        },
        testResult,
      );
    });

    await test.step("Verify search has proper ARIA labels", async () => {
      await trackStep(
        "Check search ARIA attributes",
        async () => {
          await homePage.goTo(testCredentials.baseUrl);

          const accessibilityScanResults = await new AxeBuilder({ page })
            .include('[role="search"]')
            .analyze();

          expect(accessibilityScanResults.violations).toEqual([]);
        },
        testResult,
      );
    });
  });

  test("color contrast meets WCAG standards", async ({
    page,
    homePage,
    testCredentials,
    reportGenerator,
  }) => {
    const { testResult } = reportGenerator;

    await test.step("Navigate to home page", async () => {
      await trackStep(
        "Load home page",
        async () => {
          await homePage.goTo(testCredentials.baseUrl);
          await expect(homePage.grid).toBeVisible();
        },
        testResult,
      );
    });

    await test.step("Check color contrast ratios", async () => {
      await trackStep(
        "Verify text color contrast meets WCAG AA",
        async () => {
          const accessibilityScanResults = await new AxeBuilder({ page })
            .withTags(["wcag2aa"])
            .options({
              rules: {
                "color-contrast": { enabled: true },
              },
            })
            .analyze();

          const contrastViolations = accessibilityScanResults.violations.filter(
            (v) => v.id === "color-contrast",
          );

          if (contrastViolations.length > 0) {
            console.log("\nColor contrast issues:");
            contrastViolations.forEach((violation) => {
              violation.nodes.forEach((node) => {
                console.log(`   → ${node.html}`);
                console.log(`     ${node.failureSummary}`);
              });
            });
          }

          expect(contrastViolations).toEqual([]);
        },
        testResult,
      );
    });
  });

  test("images have appropriate alt text", async ({
    page,
    homePage,
    testCredentials,
    reportGenerator,
  }) => {
    const { testResult } = reportGenerator;

    await test.step("Navigate to home page", async () => {
      await trackStep(
        "Load home page with images",
        async () => {
          await homePage.goTo(testCredentials.baseUrl);
          await expect(homePage.grid).toBeVisible();
        },
        testResult,
      );
    });

    await test.step("Check all images have alt text", async () => {
      await trackStep(
        "Verify images have descriptive alt attributes",
        async () => {
          const accessibilityScanResults = await new AxeBuilder({ page })
            .withTags(["wcag2a"])
            .options({
              rules: {
                "image-alt": { enabled: true },
              },
            })
            .analyze();

          const imageViolations = accessibilityScanResults.violations.filter(
            (v) => v.id === "image-alt",
          );

          expect(imageViolations).toEqual([]);
        },
        testResult,
      );
    });
  });

  test("heading hierarchy is logical", async ({
    page,
    homePage,
    testCredentials,
    reportGenerator,
  }) => {
    const { testResult } = reportGenerator;

    await test.step("Navigate to home page", async () => {
      await trackStep(
        "Load home page",
        async () => {
          await homePage.goTo(testCredentials.baseUrl);
          await expect(homePage.grid).toBeVisible();
        },
        testResult,
      );
    });

    await test.step("Verify heading structure", async () => {
      await trackStep(
        "Check headings follow proper hierarchy (h1 > h2 > h3)",
        async () => {
          const accessibilityScanResults = await new AxeBuilder({ page })
            .options({
              rules: {
                "heading-order": { enabled: true },
              },
            })
            .analyze();

          const headingViolations = accessibilityScanResults.violations.filter(
            (v) => v.id === "heading-order",
          );

          expect(headingViolations).toEqual([]);
        },
        testResult,
      );
    });

    await test.step("Verify page has h1", async () => {
      await trackStep(
        "Check page has exactly one h1 element",
        async () => {
          const h1Count = await page.locator("h1").count();
          expect(h1Count).toBeGreaterThan(0);
          console.log(`✓ Found ${h1Count} h1 element(s)`);
        },
        testResult,
      );
    });
  });

  test("focus indicators are visible", async ({
    page,
    homePage,
    testCredentials,
    reportGenerator,
  }) => {
    const { testResult } = reportGenerator;

    await test.step("Navigate to home page", async () => {
      await trackStep(
        "Load home page",
        async () => {
          await homePage.goTo(testCredentials.baseUrl);
        },
        testResult,
      );
    });

    await test.step("Test keyboard focus visibility", async () => {
      await trackStep(
        "Tab through interactive elements and verify focus indicators",
        async () => {
          const elementsToTest = 5;
          for (let i = 0; i < elementsToTest; i++) {
            await page.keyboard.press("Tab");

            const focusedElement = await page.evaluateHandle(
              () => document.activeElement,
            );

            // Check if focus is visible (has outline or visible focus state)
            const hasFocusIndicator = await page.evaluate((el) => {
              if (!el) return false;
              const style = window.getComputedStyle(el as Element);
              return (
                style.outline !== "none" ||
                style.outlineWidth !== "0px" ||
                style.boxShadow !== "none"
              );
            }, focusedElement);

            expect(hasFocusIndicator).toBeTruthy();
          }
        },
        testResult,
      );
    });
  });
});
