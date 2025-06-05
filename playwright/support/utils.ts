import { Page } from "@playwright/test";

export const getBySel = (page: Page, dataTestAttribute: string) => {
  return page.locator(`[data-test="${dataTestAttribute}"]`);
};

export const getBySelInput = (page: Page, dataTestAttribute: string) => {
  return page.locator(`[data-test="${dataTestAttribute}"] input `);
};

export const getBySelLike = (page: Page, dataTestAttribute: string) => {
  return page.locator(`[data-test="${dataTestAttribute}"] >> input`);
};

export async function login(page, username: string, password: string) {
  await page.goto("/signin");
  await getBySelInput(page, "signin-username").fill(username);
  await getBySelInput(page, "signin-password").fill(password);
  await getBySel(page, "signin-submit").click();
}
