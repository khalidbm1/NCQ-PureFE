import FingerprintJS from '@fingerprintjs/fingerprintjs';

let fpPromise: Promise<any> | null = null;

/**
 * Initialize FingerprintJS library
 */
const initializeFingerprint = () => {
  if (!fpPromise) {
    fpPromise = FingerprintJS.load();
  }
  return fpPromise;
};

/**
 * Get device fingerprint for enhanced security
 */
export const getDeviceFingerprint = async (): Promise<string> => {
  try {
    const fp = await initializeFingerprint();
    const result = await fp.get();
    
    // Combine with additional browser info
    const additionalInfo = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      cookieEnabled: navigator.cookieEnabled,
      doNotTrack: navigator.doNotTrack,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      screen: {
        width: window.screen.width,
        height: window.screen.height,
        colorDepth: window.screen.colorDepth,
      },
      canvas: await getCanvasFingerprint(),
      webgl: getWebGLFingerprint(),
    };
    
    // Create composite fingerprint
    const compositeFingerprint = {
      visitorId: result.visitorId,
      components: result.components,
      additional: additionalInfo,
    };
    
    // Return base64 encoded fingerprint
    return btoa(JSON.stringify(compositeFingerprint));
  } catch (error) {
    console.error('Failed to generate device fingerprint:', error);
    // Return a fallback fingerprint
    return generateFallbackFingerprint();
  }
};

/**
 * Generate canvas fingerprint
 */
const getCanvasFingerprint = (): Promise<string> => {
  return new Promise((resolve) => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        resolve('');
        return;
      }
      
      canvas.width = 200;
      canvas.height = 50;
      
      // Text with special characters
      ctx.textBaseline = 'top';
      ctx.font = '14px "Arial Unicode MS"';
      ctx.textBaseline = 'alphabetic';
      ctx.fillStyle = '#f60';
      ctx.fillRect(125, 1, 62, 20);
      ctx.fillStyle = '#069';
      ctx.fillText('NCQ Canvas fp ñ∑', 2, 15);
      ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
      ctx.fillText('NCQ Canvas fp ñ∑', 4, 17);
      
      // Get canvas data
      const dataURL = canvas.toDataURL();
      resolve(dataURL);
    } catch (error) {
      resolve('');
    }
  });
};

/**
 * Get WebGL fingerprint
 */
const getWebGLFingerprint = (): string => {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) return '';
    
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (!debugInfo) return '';
    
    return JSON.stringify({
      vendor: gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL),
      renderer: gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL),
    });
  } catch (error) {
    return '';
  }
};

/**
 * Generate fallback fingerprint when FingerprintJS fails
 */
const generateFallbackFingerprint = (): string => {
  const fallbackData = {
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    timezone: new Date().getTimezoneOffset(),
    timestamp: Date.now(),
    random: Math.random().toString(36).substring(2, 15),
  };
  
  return btoa(JSON.stringify(fallbackData));
};

/**
 * Validate device fingerprint against stored fingerprint
 */
export const validateDeviceFingerprint = async (
  storedFingerprint: string
): Promise<boolean> => {
  try {
    const currentFingerprint = await getDeviceFingerprint();
    const stored = JSON.parse(atob(storedFingerprint));
    const current = JSON.parse(atob(currentFingerprint));
    
    // Compare key components
    return (
      stored.visitorId === current.visitorId &&
      stored.additional.platform === current.additional.platform &&
      stored.additional.screen.width === current.additional.screen.width &&
      stored.additional.screen.height === current.additional.screen.height
    );
  } catch (error) {
    console.error('Failed to validate device fingerprint:', error);
    return false;
  }
};

/**
 * Get device trust score based on various factors
 */
export const getDeviceTrustScore = async (): Promise<number> => {
  let score = 0;
  
  try {
    // Check for common bot/automation indicators
    if (!navigator.webdriver) score += 20;
    if (navigator.hardwareConcurrency > 1) score += 10;
    if (navigator.deviceMemory && navigator.deviceMemory >= 4) score += 10;
    if (navigator.connection) score += 10;
    
    // Check for consistent behavior
    const fp = await getDeviceFingerprint();
    if (fp.length > 100) score += 10;
    
    // Check for human-like interactions
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) score += 10;
    
    // Check for common browser features
    if ('serviceWorker' in navigator) score += 10;
    if ('geolocation' in navigator) score += 10;
    if (window.indexedDB) score += 10;
    
    return Math.min(score, 100);
  } catch (error) {
    return 50; // Default middle score on error
  }
};