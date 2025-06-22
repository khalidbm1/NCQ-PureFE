describe('Authentication Flow', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('Login', () => {
    it('should display login form', () => {
      cy.visit('/login');
      cy.getByTestId('login-form').should('be.visible');
      cy.get('input[name="email"]').should('be.visible');
      cy.get('input[name="password"]').should('be.visible');
      cy.get('button[type="submit"]').should('contain', 'Login');
    });

    it('should show validation errors for empty fields', () => {
      cy.visit('/login');
      cy.get('button[type="submit"]').click();
      cy.contains('Email is required').should('be.visible');
      cy.contains('Password is required').should('be.visible');
    });

    it('should login successfully with valid credentials', () => {
      cy.visit('/login');
      cy.fillForm({
        email: 'test@ncq.sa',
        password: 'Test123!@#',
      });
      cy.get('button[type="submit"]').click();
      
      cy.url().should('include', '/dashboard');
      cy.contains('Welcome').should('be.visible');
    });

    it('should show error for invalid credentials', () => {
      cy.visit('/login');
      cy.fillForm({
        email: 'wrong@ncq.sa',
        password: 'wrongpassword',
      });
      cy.get('button[type="submit"]').click();
      
      cy.contains('Invalid email or password').should('be.visible');
    });

    it('should redirect to requested page after login', () => {
      cy.visit('/dashboard/profile');
      cy.url().should('include', '/login');
      
      cy.fillForm({
        email: 'test@ncq.sa',
        password: 'Test123!@#',
      });
      cy.get('button[type="submit"]').click();
      
      cy.url().should('include', '/dashboard/profile');
    });
  });

  describe('Registration', () => {
    it('should display registration form', () => {
      cy.visit('/register');
      cy.getByTestId('register-form').should('be.visible');
      cy.get('input[name="firstName"]').should('be.visible');
      cy.get('input[name="lastName"]').should('be.visible');
      cy.get('input[name="email"]').should('be.visible');
      cy.get('input[name="phoneNumber"]').should('be.visible');
      cy.get('input[name="password"]').should('be.visible');
      cy.get('input[name="confirmPassword"]').should('be.visible');
    });

    it('should validate Saudi phone number format', () => {
      cy.visit('/register');
      cy.get('input[name="phoneNumber"]').type('123456789');
      cy.get('button[type="submit"]').click();
      cy.contains('Invalid Saudi phone number').should('be.visible');
    });

    it('should validate password requirements', () => {
      cy.visit('/register');
      cy.get('input[name="password"]').type('weak');
      cy.get('button[type="submit"]').click();
      cy.contains('Password must be at least 8 characters').should('be.visible');
    });

    it('should register successfully with valid data', () => {
      const timestamp = Date.now();
      cy.visit('/register');
      cy.fillForm({
        firstName: 'Test',
        lastName: 'User',
        email: `test${timestamp}@ncq.sa`,
        phoneNumber: '0501234567',
        password: 'Test123!@#',
        confirmPassword: 'Test123!@#',
      });
      cy.get('input[name="terms"]').check();
      cy.get('button[type="submit"]').click();
      
      cy.url().should('include', '/verify-email');
      cy.contains('Please verify your email').should('be.visible');
    });
  });

  describe('Logout', () => {
    beforeEach(() => {
      cy.login('test@ncq.sa', 'Test123!@#');
      cy.visit('/dashboard');
    });

    it('should logout successfully', () => {
      cy.getByTestId('user-menu').click();
      cy.contains('Logout').click();
      
      cy.url().should('equal', Cypress.config().baseUrl + '/');
      cy.window().its('localStorage').invoke('getItem', 'auth-token').should('be.null');
    });
  });

  describe('Password Reset', () => {
    it('should send password reset email', () => {
      cy.visit('/forgot-password');
      cy.get('input[name="email"]').type('test@ncq.sa');
      cy.get('button[type="submit"]').click();
      
      cy.contains('Password reset link sent').should('be.visible');
    });

    it('should reset password with valid token', () => {
      // This would typically use a test token
      cy.visit('/reset-password?token=test-token');
      cy.fillForm({
        password: 'NewTest123!@#',
        confirmPassword: 'NewTest123!@#',
      });
      cy.get('button[type="submit"]').click();
      
      cy.url().should('include', '/login');
      cy.contains('Password reset successful').should('be.visible');
    });
  });

  describe('Language Support', () => {
    it('should switch to Arabic', () => {
      cy.visit('/login');
      cy.switchLanguage('ar');
      
      cy.get('html').should('have.attr', 'lang', 'ar');
      cy.get('html').should('have.attr', 'dir', 'rtl');
      cy.contains('تسجيل الدخول').should('be.visible');
    });

    it('should persist language preference', () => {
      cy.visit('/login');
      cy.switchLanguage('ar');
      cy.reload();
      
      cy.get('html').should('have.attr', 'lang', 'ar');
    });
  });
});