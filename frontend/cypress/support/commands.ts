/// <reference types="cypress" />

// Custom commands for NCQ Platform E2E tests

// Authentication commands
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.request('POST', `${Cypress.env('apiUrl')}/api/v1/auth/login`, {
    email,
    password,
  }).then((response) => {
    window.localStorage.setItem('auth-token', response.body.data.token);
    window.localStorage.setItem('user', JSON.stringify(response.body.data.user));
  });
});

Cypress.Commands.add('logout', () => {
  window.localStorage.removeItem('auth-token');
  window.localStorage.removeItem('user');
});

// API commands
Cypress.Commands.add('apiRequest', (method: string, url: string, body?: any) => {
  return cy.request({
    method,
    url: `${Cypress.env('apiUrl')}${url}`,
    body,
    headers: {
      Authorization: `Bearer ${window.localStorage.getItem('auth-token')}`,
    },
  });
});

// UI commands
Cypress.Commands.add('getByTestId', (testId: string) => {
  return cy.get(`[data-testid="${testId}"]`);
});

Cypress.Commands.add('getByRole', (role: string, name?: string) => {
  if (name) {
    return cy.get(`[role="${role}"][aria-label="${name}"], [role="${role}"][title="${name}"]`);
  }
  return cy.get(`[role="${role}"]`);
});

// Form commands
Cypress.Commands.add('fillForm', (formData: Record<string, string>) => {
  Object.entries(formData).forEach(([field, value]) => {
    cy.get(`[name="${field}"]`).clear().type(value);
  });
});

// Accessibility commands
Cypress.Commands.add('checkA11y', (context?: string) => {
  cy.injectAxe();
  cy.checkA11y(context);
});

// Waiting commands
Cypress.Commands.add('waitForApi', (alias: string) => {
  cy.intercept('GET', `${Cypress.env('apiUrl')}/**`).as(alias);
  cy.wait(`@${alias}`);
});

// Language commands
Cypress.Commands.add('switchLanguage', (lang: 'en' | 'ar') => {
  cy.getByTestId('language-switcher').click();
  cy.getByTestId(`language-${lang}`).click();
});

// TypeScript support for custom commands
declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>;
      logout(): Chainable<void>;
      apiRequest(method: string, url: string, body?: any): Chainable<Response<any>>;
      getByTestId(testId: string): Chainable<JQuery<HTMLElement>>;
      getByRole(role: string, name?: string): Chainable<JQuery<HTMLElement>>;
      fillForm(formData: Record<string, string>): Chainable<void>;
      checkA11y(context?: string): Chainable<void>;
      waitForApi(alias: string): Chainable<void>;
      switchLanguage(lang: 'en' | 'ar'): Chainable<void>;
    }
  }
}

export {};