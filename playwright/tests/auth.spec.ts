import { test, expect } from "@playwright/test";
import { devices, chromium } from "@playwright/test";
import { getBySel, getBySelInput, getBySelLike, login } from "../support/utils";

const isMobile = true;
const signupSel = "signup";
const signupFirstNameSel = "signup-first-name";
const signinUsernameSel = "signin-username";

test.describe("User Sign-up and Login", () => {
  test("should redirect unauthenticated user to signin page", async ({
    page,
  }) => {
    await page.goto("/personal");
    await expect(page).toHaveURL("/signin");
  });

  test("should redirect to the home page after login", async ({ page }) => {
    await login(page, "Heath93", "s3cret");
    await expect(page).toHaveURL("/");
  });

  test.skip("should remember a user for 30 days after login", async ({
    page,
    context,
  }) => {
    await login(page, "Heath93", "s3cret");

    const cookies = await context.cookies();
    const sessionCookie = cookies.find((c) => c.name === "connect.sid");
    expect(sessionCookie?.expires).toBeTruthy();

    //   if (isMobile) {
    // const browser = await chromium.launch();
    // await browser.newContext(
    //   isMobile
    //     ? { ...devices["Pixel 5"] }
    //     : { viewport: { width: 1280, height: 720 } },
    // );
    //     await getBySel(page, "sidenav-toggle").click();
    //   }
    await getBySel(page, "sidenav-signout").click();
    await expect(page).toHaveURL("/signin");
  });

  test.skip("should allow a visitor to sign-up, login, and logout", async ({
    page,
  }) => {
    // await page.route("**/users", (route) => route.continue());
    const userInfo = {
      firstName: `Bob${Math.floor(Math.random() * 1000)}`,
      lastName: "Ross",
      username: "username",
      password: "pwd123",
    };

    await page.goto("/");
    await getBySel(page, signupSel).click();
    await getBySel(page, signupSel).click();
    await expect(getBySel(page, "signup-title")).toContainText("Sign Up");

    await getBySelInput(page, signupFirstNameSel).fill(userInfo.firstName);
    await getBySelInput(page, "signup-last-name").fill(userInfo.lastName);
    await getBySelInput(page, "signup-username").fill(userInfo.username);
    await getBySelInput(page, "signup-password").fill(userInfo.password);
    await getBySelInput(page, "signup-confirmPassword").fill(userInfo.password);
    // await Promise.all([
    //   page.waitForRequest((req) => req.url().includes("/users") && req.method() === "POST"),
    //   await getBySel(page, "signup-submit").click(),
    // ]);

    await login(page, userInfo.username, userInfo.password);

    await expect(getBySel(page, "user-onboarding-dialog")).toBeVisible();
    await getBySel(page, "user-onboarding-next").click();

    await getBySelLike(page, "bankaccount-bankName-input").fill(
      "The Best Bank",
    );
    await getBySelLike(page, "bankaccount-accountNumber-input").fill(
      "123456789",
    );
    await getBySelLike(page, "bankaccount-routingNumber-input").fill(
      "987654321",
    );
    await getBySel(page, "bankaccount-submit").click();

    await expect(getBySel(page, "user-onboarding-dialog-title")).toContainText(
      "Finished",
    );
    await getBySel(page, "user-onboarding-next").click();
    await expect(getBySel(page, "transaction-list")).toBeVisible();

    if (isMobile) {
      const browser = await chromium.launch();
      await browser.newContext(
        isMobile
          ? { ...devices["Pixel 5"] }
          : { viewport: { width: 1280, height: 720 } },
      );
      await getBySel(page, "sidenav-toggle").click();
    }
    await getBySel(page, "sidenav-signout").click();
    await expect(page).toHaveURL("/signin");
  });

  test("should display login errors", async ({ page }) => {
    await page.goto("/");

    await getBySelInput(page, signinUsernameSel).fill("User");
    await getBySel(page, signinUsernameSel).locator("input").fill("");
    await getBySel(page, signinUsernameSel).locator("input").blur();
    await expect(page.locator("#username-helper-text")).toContainText(
      "Username is required",
    );

    await getBySelInput(page, "signin-password").fill("abc");
    await getBySel(page, "signin-password").locator("input").blur();
    await expect(page.locator("#password-helper-text")).toContainText(
      "Password must contain at least 4 characters",
    );

    await expect(getBySel(page, "signin-submit")).toBeDisabled();
  });

  test("should display signup errors", async ({ page }) => {
    await page.goto("/signup");

    // await getBySelInput(page, "signup-first-name").fill("First");
    await getBySel(page, signupFirstNameSel).click();
    await getBySel(page, "signup-last-name").click();
    await expect(page.locator("#firstName-helper-text")).toContainText(
      "First Name is required",
    );

    await getBySel(page, signupFirstNameSel).click();
    await expect(page.locator("#lastName-helper-text")).toContainText(
      "Last Name is required",
    );

    await getBySelInput(page, "signup-username").click();
    await getBySel(page, signupFirstNameSel).click();
    await expect(page.locator("#username-helper-text")).toContainText(
      "Username is required",
    );

    await getBySel(page, "signup-password").click();
    await getBySel(page, "signup-username").click();
    await expect(page.locator("#password-helper-text")).toContainText(
      "Enter your password",
    );

    await getBySelInput(page, "signup-confirmPassword").fill("password");
    await getBySel(page, "signup-username").click();
    await expect(page.locator("#confirmPassword-helper-text")).toContainText(
      "Password does not match",
    );

    await expect(getBySel(page, "signup-submit")).toBeDisabled();
  });

  test("should error for an invalid user", async ({ page }) => {
    await login(page, "invalidUserName", "invalidPa$$word");
    await expect(getBySel(page, "signin-error")).toBeVisible();
    await expect(getBySel(page, "signin-error")).toHaveText(
      "Username or password is invalid",
    );
  });

  test("should error for an invalid password for existing user", async ({
    page,
  }) => {
    const existingUser = "Heath93";
    await login(page, existingUser, "INVALID");
    await expect(getBySel(page, "signin-error")).toBeVisible();
    await expect(getBySel(page, "signin-error")).toHaveText(
      "Username or password is invalid",
    );
  });
});
