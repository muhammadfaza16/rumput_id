// Anonymous session management

export function generateSessionId(): string {
  if (typeof window === 'undefined') {
    return 'server-session'; // SSR fallback
  }

  // Kombinasi browser fingerprint yang tidak menyimpan PII
  const components = [
    navigator.language,
    screen.width + 'x' + screen.height,
    new Date().getTimezoneOffset(),
    navigator.hardwareConcurrency || 2,
  ].join('|');
  
  // Create a simple hash/base64 of the components
  return btoa(components).replace(/[^a-zA-Z0-9]/g, '').substring(0, 32);
}
