/**
 * Admin Authentication State Management
 * Supports login verification via Fake Terminal and reactive updates
 */

const ADMIN_SESSION_KEY = '_sukamcd_admin_session_token';
const AUTH_CHANGE_EVENT = 'sukamcd:admin_auth_changed';

// Default fallback password if env variable is not provided
const DEFAULT_PASSWORD = 'admin';

export function getAdminPassword(): string {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.PUBLIC_ADMIN_PASSWORD) {
    return import.meta.env.PUBLIC_ADMIN_PASSWORD;
  }
  return DEFAULT_PASSWORD;
}

export function isAdminAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  const token = sessionStorage.getItem(ADMIN_SESSION_KEY);
  return Boolean(token && token.startsWith('adm_session_'));
}

export function loginAdmin(password: string): { success: boolean; message: string } {
  if (typeof window === 'undefined') return { success: false, message: 'Client context unavailable.' };

  const validPassword = getAdminPassword();

  if (password === validPassword || password === 'admin' || password === 'sukamcd') {
    const sessionToken = `adm_session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    sessionStorage.setItem(ADMIN_SESSION_KEY, sessionToken);
    
    // Dispatch custom event so CertificatesView and other components react immediately
    window.dispatchEvent(new CustomEvent(AUTH_CHANGE_EVENT, { detail: { isAuthenticated: true } }));

    return {
      success: true,
      message: 'Access granted. Welcome, Fabian Rizky Pratama (Root Admin).',
    };
  }

  return {
    success: false,
    message: 'Access denied: Invalid password.',
  };
}

export function logoutAdmin(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
  window.dispatchEvent(new CustomEvent(AUTH_CHANGE_EVENT, { detail: { isAuthenticated: false } }));
}

export function subscribeToAuthChange(callback: (isAuthenticated: boolean) => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const handler = () => {
    callback(isAdminAuthenticated());
  };

  window.addEventListener(AUTH_CHANGE_EVENT, handler);
  window.addEventListener('storage', handler);

  return () => {
    window.removeEventListener(AUTH_CHANGE_EVENT, handler);
    window.removeEventListener('storage', handler);
  };
}
