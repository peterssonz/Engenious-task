# Test info

- Name: User Sign-up and Login >> should allow a visitor to sign-up, login, and logout
- Location: /Users/peterzaujec/Engenious-task/playwright/tests/auth.spec.ts:46:7

# Error details

```
Error: Timed out 5000ms waiting for expect(locator).toBeVisible()

Locator: locator('[data-test="user-onboarding-dialog"]')
Expected: visible
Received: <element(s) not found>
Call log:
  - expect.toBeVisible with timeout 5000ms
  - waiting for locator('[data-test="user-onboarding-dialog"]')

    at /Users/peterzaujec/Engenious-task/playwright/tests/auth.spec.ts:74:60
```

# Page snapshot

```yaml
- main:
  - alert: Username or password is invalid
  - img
  - heading "Sign in" [level=1]
  - text: Username
  - textbox "Username"
  - text: Password
  - textbox "Password"
  - checkbox "Remember me"
  - text: Remember me
  - button "Sign In"
  - link "Don't have an account? Sign Up":
    - /url: /signup
  - paragraph:
    - text: Built by
    - link:
      - /url: https://cypress.io
      - img
```

# Test source

```ts
   1 | import { test, expect } from "@playwright/test";
   2 | import { devices, chromium } from "@playwright/test";
   3 | import { getBySel, getBySelInput, getBySelLike, login } from "../support/utils";
   4 |
   5 | const isMobile = true;
   6 | const signupSel = "signup";
   7 | const signupFirstNameSel = "signup-first-name";
   8 | const signinUsernameSel = "signin-username";
   9 |
   10 | test.describe("User Sign-up and Login", () => {
   11 |   test("should redirect unauthenticated user to signin page", async ({
   12 |     page,
   13 |   }) => {
   14 |     await page.goto("/personal");
   15 |     await expect(page).toHaveURL("/signin");
   16 |   });
   17 |
   18 |   test("should redirect to the home page after login", async ({ page }) => {
   19 |     await login(page, "Heath93", "s3cret");
   20 |     await expect(page).toHaveURL("/");
   21 |   });
   22 |
   23 |   test.skip("should remember a user for 30 days after login", async ({
   24 |     page,
   25 |     context,
   26 |   }) => {
   27 |     await login(page, "Heath93", "s3cret");
   28 |
   29 |     const cookies = await context.cookies();
   30 |     const sessionCookie = cookies.find((c) => c.name === "connect.sid");
   31 |     expect(sessionCookie?.expires).toBeTruthy();
   32 |
   33 |     //   if (isMobile) {
   34 |     // const browser = await chromium.launch();
   35 |     // await browser.newContext(
   36 |     //   isMobile
   37 |     //     ? { ...devices["Pixel 5"] }
   38 |     //     : { viewport: { width: 1280, height: 720 } },
   39 |     // );
   40 |     //     await getBySel(page, "sidenav-toggle").click();
   41 |     //   }
   42 |     await getBySel(page, "sidenav-signout").click();
   43 |     await expect(page).toHaveURL("/signin");
   44 |   });
   45 |
   46 |   test("should allow a visitor to sign-up, login, and logout", async ({
   47 |     page,
   48 |   }) => {
   49 |     // await page.route("**/users", (route) => route.continue());
   50 |     const userInfo = {
   51 |       firstName: `Bob${Math.floor(Math.random() * 1000)}`,
   52 |       lastName: "Ross",
   53 |       username: "username",
   54 |       password: "pwd123",
   55 |     };
   56 |
   57 |     await page.goto("/");
   58 |     await getBySel(page, signupSel).click();
   59 |     await getBySel(page, signupSel).click();
   60 |     await expect(getBySel(page, "signup-title")).toContainText("Sign Up");
   61 |
   62 |     await getBySelInput(page, signupFirstNameSel).fill(userInfo.firstName);
   63 |     await getBySelInput(page, "signup-last-name").fill(userInfo.lastName);
   64 |     await getBySelInput(page, "signup-username").fill(userInfo.username);
   65 |     await getBySelInput(page, "signup-password").fill(userInfo.password);
   66 |     await getBySelInput(page, "signup-confirmPassword").fill(userInfo.password);
   67 |     // await Promise.all([
   68 |     //   page.waitForRequest((req) => req.url().includes("/users") && req.method() === "POST"),
   69 |     //   await getBySel(page, "signup-submit").click(),
   70 |     // ]);
   71 |
   72 |     await login(page, userInfo.username, userInfo.password);
   73 |
>  74 |     await expect(getBySel(page, "user-onboarding-dialog")).toBeVisible();
      |                                                            ^ Error: Timed out 5000ms waiting for expect(locator).toBeVisible()
   75 |     await getBySel(page, "user-onboarding-next").click();
   76 |
   77 |     await getBySelLike(page, "bankaccount-bankName-input").fill(
   78 |       "The Best Bank",
   79 |     );
   80 |     await getBySelLike(page, "bankaccount-accountNumber-input").fill(
   81 |       "123456789",
   82 |     );
   83 |     await getBySelLike(page, "bankaccount-routingNumber-input").fill(
   84 |       "987654321",
   85 |     );
   86 |     await getBySel(page, "bankaccount-submit").click();
   87 |
   88 |     await expect(getBySel(page, "user-onboarding-dialog-title")).toContainText(
   89 |       "Finished",
   90 |     );
   91 |     await getBySel(page, "user-onboarding-next").click();
   92 |     await expect(getBySel(page, "transaction-list")).toBeVisible();
   93 |
   94 |     if (isMobile) {
   95 |       const browser = await chromium.launch();
   96 |       await browser.newContext(
   97 |         isMobile
   98 |           ? { ...devices["Pixel 5"] }
   99 |           : { viewport: { width: 1280, height: 720 } },
  100 |       );
  101 |       await getBySel(page, "sidenav-toggle").click();
  102 |     }
  103 |     await getBySel(page, "sidenav-signout").click();
  104 |     await expect(page).toHaveURL("/signin");
  105 |   });
  106 |
  107 |   test("should display login errors", async ({ page }) => {
  108 |     await page.goto("/");
  109 |
  110 |     await getBySelInput(page, signinUsernameSel).fill("User");
  111 |     await getBySel(page, signinUsernameSel).locator("input").fill("");
  112 |     await getBySel(page, signinUsernameSel).locator("input").blur();
  113 |     await expect(page.locator("#username-helper-text")).toContainText(
  114 |       "Username is required",
  115 |     );
  116 |
  117 |     await getBySelInput(page, "signin-password").fill("abc");
  118 |     await getBySel(page, "signin-password").locator("input").blur();
  119 |     await expect(page.locator("#password-helper-text")).toContainText(
  120 |       "Password must contain at least 4 characters",
  121 |     );
  122 |
  123 |     await expect(getBySel(page, "signin-submit")).toBeDisabled();
  124 |   });
  125 |
  126 |   test("should display signup errors", async ({ page }) => {
  127 |     await page.goto("/signup");
  128 |
  129 |     // await getBySelInput(page, "signup-first-name").fill("First");
  130 |     await getBySel(page, signupFirstNameSel).click();
  131 |     await getBySel(page, "signup-last-name").click();
  132 |     await expect(page.locator("#firstName-helper-text")).toContainText(
  133 |       "First Name is required",
  134 |     );
  135 |
  136 |     await getBySel(page, signupFirstNameSel).click();
  137 |     await expect(page.locator("#lastName-helper-text")).toContainText(
  138 |       "Last Name is required",
  139 |     );
  140 |
  141 |     await getBySelInput(page, "signup-username").click();
  142 |     await getBySel(page, signupFirstNameSel).click();
  143 |     await expect(page.locator("#username-helper-text")).toContainText(
  144 |       "Username is required",
  145 |     );
  146 |
  147 |     await getBySel(page, "signup-password").click();
  148 |     await getBySel(page, "signup-username").click();
  149 |     await expect(page.locator("#password-helper-text")).toContainText(
  150 |       "Enter your password",
  151 |     );
  152 |
  153 |     await getBySelInput(page, "signup-confirmPassword").fill("password");
  154 |     await getBySel(page, "signup-username").click();
  155 |     await expect(page.locator("#confirmPassword-helper-text")).toContainText(
  156 |       "Password does not match",
  157 |     );
  158 |
  159 |     await expect(getBySel(page, "signup-submit")).toBeDisabled();
  160 |   });
  161 |
  162 |   test("should error for an invalid user", async ({ page }) => {
  163 |     await login(page, "invalidUserName", "invalidPa$$word");
  164 |     await expect(getBySel(page, "signin-error")).toBeVisible();
  165 |     await expect(getBySel(page, "signin-error")).toHaveText(
  166 |       "Username or password is invalid",
  167 |     );
  168 |   });
  169 |
  170 |   test("should error for an invalid password for existing user", async ({
  171 |     page,
  172 |   }) => {
  173 |     const existingUser = "Heath93";
  174 |     await login(page, existingUser, "INVALID");
```