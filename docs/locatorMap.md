| Feature         | Element (purpose)       | Preferred locator (Playwright)                                    | Fallback locator                             |
| --------------- | ----------------------- | ----------------------------------------------------------------- | -------------------------------------------- | ------------------------------------------- | ------------------------------------------- |
| Header          | Theme toggle            | page.getByRole('switch', { name: /toggle/i })                     | page.locator('[data-testid="theme-toggle"]') |
| Header          | User Profile            | page.getByRole("button", { name: "User Profile" });               |                                              |
| Header          | User Profile            | page.getByRole("button", { name: "User Profile" });               |                                              |
| Header          | Logout button           | page.getByRole('button', { name: 'Logout' })                      |                                              |
| Header          | Login button            | page.getByRole('button', { name: 'Log In' })                      |                                              |
| Login           | Login email             | page.getByRole('textbox', { name: 'Email address' })              |                                              |
| Login           | Login password          | page.getByRole('textbox', { name: 'Password' })                   |                                              |
| Login           | Login submit            | page.getByRole('button', { name: 'Login' })                       |                                              |
| Title           | Page title              | page.getByRole('heading', { name: /movies                         | film                                         | playwright/i })                             |
| Search          | Search button           | page.getByRole('search')                                          |
| Search          | Search input            | page.getByRole('textbox', { name: 'Search Input' })               |
| Search          | Search submit icon      | page.getByRole('button', { name: 'Search for a movie' })          |
| Grid            | Movie Container         | page.getByRole('list', { name: 'movies' })                        |
| Grid            | Movie card              | page.getByRole('link', { name: 'poster of Civil War Civil War' }) |
| Details         | Details container/modal | page.getByRole('dialog')                                          | page.getByTestId('movie-dialog')             |
| Details         | Close details           | page.getByRole('button', { name: /close/i })                      | page.getByTestId('close')                    |
| Feedback states | Empty results message   | page.getByText(/no results                                        | nothing found/i)                             | page.locator('[data-testid="empty-state"]') |
| Feedback states | Error message           | page.getByText(/error                                             | try again                                    | problem/i)                                  | page.locator('[data-testid="error-state"]') |
