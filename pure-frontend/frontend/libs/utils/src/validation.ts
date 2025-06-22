/**
 * Email validation
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Saudi phone number validation
 * Accepts formats: 05XXXXXXXX, +9665XXXXXXXX, 9665XXXXXXXX
 */
export const isValidSaudiPhone = (phone: string): boolean => {
  const phoneRegex = /^(\+?966|0)?5[0-9]{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * Saudi National ID validation
 * Must be 10 digits starting with 1 or 2
 */
export const isValidNationalId = (id: string): boolean => {
  const idRegex = /^[12][0-9]{9}$/;
  return idRegex.test(id);
};