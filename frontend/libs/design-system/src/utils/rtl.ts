/**
 * RTL (Right-to-Left) utilities for Arabic language support
 */

export const isRTL = (locale: string = 'en'): boolean => {
  return locale === 'ar' || locale.startsWith('ar-');
};

export const getDirection = (locale: string = 'en'): 'rtl' | 'ltr' => {
  return isRTL(locale) ? 'rtl' : 'ltr';
};

export const rtlClass = (locale: string = 'en', ltrClass: string, rtlClass: string): string => {
  return isRTL(locale) ? rtlClass : ltrClass;
};

// Directional classes for common patterns
export const directionalClasses = {
  marginLeft: (locale: string, value: string) => rtlClass(locale, `ml-${value}`, `mr-${value}`),
  marginRight: (locale: string, value: string) => rtlClass(locale, `mr-${value}`, `ml-${value}`),
  paddingLeft: (locale: string, value: string) => rtlClass(locale, `pl-${value}`, `pr-${value}`),
  paddingRight: (locale: string, value: string) => rtlClass(locale, `pr-${value}`, `pl-${value}`),
  left: (locale: string, value: string) => rtlClass(locale, `left-${value}`, `right-${value}`),
  right: (locale: string, value: string) => rtlClass(locale, `right-${value}`, `left-${value}`),
  borderLeft: (locale: string, value: string) => rtlClass(locale, `border-l-${value}`, `border-r-${value}`),
  borderRight: (locale: string, value: string) => rtlClass(locale, `border-r-${value}`, `border-l-${value}`),
  roundedLeft: (locale: string, value: string) => rtlClass(locale, `rounded-l-${value}`, `rounded-r-${value}`),
  roundedRight: (locale: string, value: string) => rtlClass(locale, `rounded-r-${value}`, `rounded-l-${value}`),
};