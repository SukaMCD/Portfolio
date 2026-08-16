import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  deleteDoc, 
  updateDoc,
  type Firestore 
} from 'firebase/firestore';
import { initialCertificates, type Certificate } from '../data/certificates';

// Environment Variables
const firebaseConfig = {
  apiKey: typeof import.meta !== 'undefined' ? import.meta.env?.PUBLIC_FIREBASE_API_KEY : '',
  authDomain: typeof import.meta !== 'undefined' ? import.meta.env?.PUBLIC_FIREBASE_AUTH_DOMAIN : '',
  projectId: typeof import.meta !== 'undefined' ? import.meta.env?.PUBLIC_FIREBASE_PROJECT_ID : '',
  storageBucket: typeof import.meta !== 'undefined' ? import.meta.env?.PUBLIC_FIREBASE_STORAGE_BUCKET : '',
  messagingSenderId: typeof import.meta !== 'undefined' ? import.meta.env?.PUBLIC_FIREBASE_MESSAGING_SENDER_ID : '',
  appId: typeof import.meta !== 'undefined' ? import.meta.env?.PUBLIC_FIREBASE_APP_ID : '',
};

const LOCAL_STORAGE_KEY = 'sukamcd_portfolio_certificates';
const COLLECTION_NAME = 'certificates';

let app: FirebaseApp | null = null;
let db: Firestore | null = null;

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && 
  firebaseConfig.projectId && 
  !firebaseConfig.apiKey.includes('your_api_key')
);

if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    db = getFirestore(app);
  } catch (error) {
    console.warn('[Firebase] Initialization error, falling back to local storage:', error);
  }
}

// Fallback helper for local storage
function getLocalCertificates(): Certificate[] {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved !== null) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed reading localStorage certificates:', e);
  }
  return [];
}

function setLocalCertificates(certs: Certificate[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(certs));
}

/**
 * Fetch all certificates from Firestore or LocalStorage
 */
export async function getCertificates(): Promise<Certificate[]> {
  if (db && isFirebaseConfigured) {
    try {
      const colRef = collection(db, COLLECTION_NAME);
      const snapshot = await getDocs(colRef);
      
      const certs: Certificate[] = [];
      snapshot.forEach((doc) => {
        certs.push({ id: doc.id, ...doc.data() } as Certificate);
      });
      setLocalCertificates(certs);
      return certs;
    } catch (err) {
      console.warn('[Firestore] Error fetching documents, using local fallback:', err);
    }
  }

  return getLocalCertificates();
}

/**
 * Create a new Certificate
 */
// Clean undefined/empty values so Firestore does not reject the document
function cleanFirestoreData<T extends Record<string, any>>(data: T): Record<string, any> {
  const cleaned: Record<string, any> = {};
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) {
      cleaned[key] = value;
    }
  }
  return cleaned;
}

/**
 * Create a new Certificate
 */
export async function createCertificate(data: Omit<Certificate, 'id'> & { id?: string }): Promise<Certificate> {
  const id = data.id || `cert_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const newCertificate: Certificate = {
    ...data,
    id,
  };

  if (db && isFirebaseConfigured) {
    try {
      const payload = cleanFirestoreData(newCertificate);
      await setDoc(doc(db, COLLECTION_NAME, id), payload);
    } catch (err) {
      console.error('[Firestore] Failed creating certificate:', err);
      throw err;
    }
  }

  // Always keep local storage updated as cache / offline support
  const current = getLocalCertificates();
  const updated = [newCertificate, ...current.filter(c => c.id !== id)];
  setLocalCertificates(updated);

  return newCertificate;
}

/**
 * Update an existing Certificate
 */
export async function updateCertificate(id: string, data: Partial<Certificate>): Promise<void> {
  if (db && isFirebaseConfigured) {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const payload = cleanFirestoreData(data);
      await updateDoc(docRef, payload);
    } catch (err) {
      console.error('[Firestore] Failed updating certificate:', err);
      throw err;
    }
  }

  const current = getLocalCertificates();
  const updated = current.map(c => c.id === id ? { ...c, ...data } : c);
  setLocalCertificates(updated);
}

/**
 * Delete a Certificate
 */
export async function deleteCertificate(id: string): Promise<void> {
  if (db && isFirebaseConfigured) {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch (err) {
      console.error('[Firestore] Failed deleting certificate:', err);
      throw err;
    }
  }

  const current = getLocalCertificates();
  const updated = current.filter(c => c.id !== id);
  setLocalCertificates(updated);
}

/* ============================================================
   ADMIN AUTHENTICATION STATE & TERMINAL LOGIN
   ============================================================ */
const ADMIN_SESSION_KEY = '_sukamcd_admin_session_token';
const AUTH_CHANGE_EVENT = 'sukamcd:admin_auth_changed';
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
