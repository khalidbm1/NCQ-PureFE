import { isValidEmail, isValidSaudiPhone, isValidNationalId } from './validation';

describe('Validation Utils', () => {
  describe('isValidEmail', () => {
    it('validates correct email addresses', () => {
      expect(isValidEmail('user@example.com')).toBe(true);
      expect(isValidEmail('test.user@company.co.uk')).toBe(true);
      expect(isValidEmail('user+tag@domain.com')).toBe(true);
      expect(isValidEmail('user_name@sub.domain.com')).toBe(true);
    });

    it('rejects invalid email addresses', () => {
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('@domain.com')).toBe(false);
      expect(isValidEmail('user@')).toBe(false);
      expect(isValidEmail('user @domain.com')).toBe(false);
      expect(isValidEmail('user@domain')).toBe(false);
      expect(isValidEmail('')).toBe(false);
    });
  });

  describe('isValidSaudiPhone', () => {
    it('validates correct Saudi phone numbers', () => {
      expect(isValidSaudiPhone('0501234567')).toBe(true);
      expect(isValidSaudiPhone('0551234567')).toBe(true);
      expect(isValidSaudiPhone('0591234567')).toBe(true);
      expect(isValidSaudiPhone('+966501234567')).toBe(true);
      expect(isValidSaudiPhone('966501234567')).toBe(true);
    });

    it('rejects invalid Saudi phone numbers', () => {
      expect(isValidSaudiPhone('0401234567')).toBe(false);
      expect(isValidSaudiPhone('050123456')).toBe(false);
      expect(isValidSaudiPhone('05012345678')).toBe(false);
      expect(isValidSaudiPhone('501234567')).toBe(false);
      expect(isValidSaudiPhone('')).toBe(false);
    });
  });

  describe('isValidNationalId', () => {
    it('validates correct Saudi national IDs', () => {
      expect(isValidNationalId('1234567890')).toBe(true);
      expect(isValidNationalId('1000000000')).toBe(true);
      expect(isValidNationalId('2999999999')).toBe(true);
    });

    it('rejects invalid national IDs', () => {
      expect(isValidNationalId('123456789')).toBe(false);
      expect(isValidNationalId('12345678901')).toBe(false);
      expect(isValidNationalId('0123456789')).toBe(false);
      expect(isValidNationalId('3000000000')).toBe(false);
      expect(isValidNationalId('abcdefghij')).toBe(false);
      expect(isValidNationalId('')).toBe(false);
    });
  });
});