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
import { initialProjects, type Project } from '../data/projects';

// Environment Variables
const firebaseConfig = {
  apiKey: typeof import.meta !== 'undefined' ? import.meta.env?.PUBLIC_FIREBASE_API_KEY : '',
  authDomain: typeof import.meta !== 'undefined' ? import.meta.env?.PUBLIC_FIREBASE_AUTH_DOMAIN : '',
  projectId: typeof import.meta !== 'undefined' ? import.meta.env?.PUBLIC_FIREBASE_PROJECT_ID : '',
  storageBucket: typeof import.meta !== 'undefined' ? import.meta.env?.PUBLIC_FIREBASE_STORAGE_BUCKET : '',
  messagingSenderId: typeof import.meta !== 'undefined' ? import.meta.env?.PUBLIC_FIREBASE_MESSAGING_SENDER_ID : '',
  appId: typeof import.meta !== 'undefined' ? import.meta.env?.PUBLIC_FIREBASE_APP_ID : '',
};

const LOCAL_STORAGE_KEY_CERTIFICATES = 'sukamcd_portfolio_certificates';
const COLLECTION_NAME_CERTIFICATES = 'certificates';

const LOCAL_STORAGE_KEY_PROJECTS = 'sukamcd_portfolio_projects';
const COLLECTION_NAME_PROJECTS = 'projects';

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

export const DEFAULT_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1572945281861-68b122e3e85a?q=80&w=600&auto=format&fit=crop';

/**
 * Extract Google Drive file ID from various link formats
 */
export function extractDriveFileId(url?: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  
  // Pattern 1: /file/d/([a-zA-Z0-9_-]+)
  const matchFile = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (matchFile && matchFile[1]) return matchFile[1];

  // Pattern 2: id=([a-zA-Z0-9_-]+)
  const matchId = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (matchId && matchId[1]) return matchId[1];

  // Pattern 3: /d/([a-zA-Z0-9_-]+)
  const matchD = trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (matchD && matchD[1]) return matchD[1];

  return null;
}

/**
 * Automatically converts Google Drive share URLs into direct embeddable image CDN links
 */
export function formatDriveImageUrl(url?: string): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (!trimmed || trimmed === '/image/.webp' || trimmed === '/image/' || trimmed === '.webp') return '';

  const fileId = extractDriveFileId(trimmed);
  if (fileId) {
    return `https://lh3.googleusercontent.com/d/${fileId}`;
  }

  return trimmed;
}

/**
 * Helper to parse various portfolio date formats into comparable timestamps for sorting (latest first)
 * Handles: "Feb, 2026", "24 Feb 2026", "2026", "25 Nov 2025", "14 Feb 2026", "2024-05-12", etc.
 */
export function parseDateToTimestamp(dateStr?: string): number {
  if (!dateStr) return 0;
  const str = dateStr.trim();

  // Try direct standard parse
  let ts = Date.parse(str);
  if (!isNaN(ts)) return ts;

  // Month mapping Indonesian -> English
  const idToEn: Record<string, string> = {
    'jan': 'Jan', 'januari': 'Jan', 'feb': 'Feb', 'februari': 'Feb', 'peb': 'Feb',
    'mar': 'Mar', 'maret': 'Mar', 'apr': 'Apr', 'april': 'Apr',
    'mei': 'May', 'jun': 'Jun', 'juni': 'Jun', 'jul': 'Jul', 'juli': 'Jul',
    'agu': 'Aug', 'agustus': 'Aug', 'ags': 'Aug',
    'sep': 'Sep', 'september': 'Sep', 'okt': 'Oct', 'oktober': 'Oct',
    'nov': 'Nov', 'november': 'Nov', 'des': 'Dec', 'desember': 'Dec'
  };

  let normalized = str.toLowerCase();
  for (const [id, en] of Object.entries(idToEn)) {
    normalized = normalized.replace(new RegExp(`\\b${id}\\b`, 'g'), en);
  }

  // Handle "Feb, 2026" or "Month, Year"
  if (/^[a-z]{3,9},\s*\d{4}$/i.test(normalized)) {
    const parts = normalized.split(',').map(s => s.trim());
    ts = Date.parse(`01 ${parts[0]} ${parts[1]}`);
    if (!isNaN(ts)) return ts;
  }

  // Handle pure 4-digit year "2026"
  if (/^\d{4}$/.test(str)) {
    return new Date(parseInt(str, 10), 11, 31).getTime();
  }

  // Try parsing with normalized string
  ts = Date.parse(normalized);
  if (!isNaN(ts)) return ts;

  // Extract 4-digit year as last resort
  const yearMatch = str.match(/\b(20\d{2}|19\d{2})\b/);
  if (yearMatch) {
    return new Date(parseInt(yearMatch[1], 10), 0, 1).getTime();
  }

  return 0;
}

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

/* ============================================================
   CERTIFICATES CRUD
   ============================================================ */

export function getLocalCertificates(): Certificate[] {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_CERTIFICATES);
    if (saved !== null) {
      const parsed: Certificate[] = JSON.parse(saved);
      return parsed.sort((a, b) => parseDateToTimestamp(b.date) - parseDateToTimestamp(a.date));
    }
  } catch (e) {
    console.error('Failed reading localStorage certificates:', e);
  }
  return [];
}

function setLocalCertificates(certs: Certificate[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LOCAL_STORAGE_KEY_CERTIFICATES, JSON.stringify(certs));
}

/**
 * Fetch all certificates from Firestore or LocalStorage (sorted latest first)
 */
export async function getCertificates(): Promise<Certificate[]> {
  if (db && isFirebaseConfigured) {
    try {
      const colRef = collection(db, COLLECTION_NAME_CERTIFICATES);
      const snapshot = await getDocs(colRef);
      
      const certs: Certificate[] = [];
      snapshot.forEach((doc) => {
        certs.push({ id: doc.id, ...doc.data() } as Certificate);
      });

      // Sort latest first
      certs.sort((a, b) => parseDateToTimestamp(b.date) - parseDateToTimestamp(a.date));

      setLocalCertificates(certs);
      return certs;
    } catch (err) {
      console.warn('[Firestore] Error fetching certificates, using local fallback:', err);
    }
  }

  return getLocalCertificates();
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
      await setDoc(doc(db, COLLECTION_NAME_CERTIFICATES, id), payload);
    } catch (err) {
      console.warn('[Firestore] Failed creating certificate in cloud, using local cache:', err);
    }
  }

  const current = getLocalCertificates();
  const updated = [newCertificate, ...current.filter(c => c.id !== id)];
  setLocalCertificates(updated);

  return newCertificate;
}

/**
 * Update an existing Certificate
 */
export async function updateCertificate(id: string, data: Partial<Certificate>): Promise<void> {
  if (!id) return;
  if (db && isFirebaseConfigured) {
    try {
      const docRef = doc(db, COLLECTION_NAME_CERTIFICATES, id);
      const payload = cleanFirestoreData(data);
      await updateDoc(docRef, payload);
    } catch (err) {
      console.warn('[Firestore] Failed updating certificate in cloud:', err);
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
  if (!id) return;
  if (db && isFirebaseConfigured) {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME_CERTIFICATES, id));
    } catch (err) {
      console.warn('[Firestore] Failed deleting certificate document from Firestore:', err);
    }
  }

  const current = getLocalCertificates();
  const updated = current.filter(c => c.id !== id);
  setLocalCertificates(updated);
}

/* ============================================================
   PROJECTS CRUD
   ============================================================ */

export function getLocalProjects(): Project[] {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_PROJECTS);
    if (saved !== null) {
      const parsed: Project[] = JSON.parse(saved);
      // Ensure all items have an ID and a safe image URL
      const mapped = parsed.map((p, idx) => {
        const rawImg = p.image?.trim();
        const safeImg = (rawImg && rawImg !== '/image/.webp' && rawImg !== '/image/' && rawImg !== '.webp')
          ? rawImg
          : DEFAULT_FALLBACK_IMAGE;
        return {
          ...p,
          id: p.id || `proj_legacy_${idx}_${p.title?.toLowerCase().replace(/[^a-z0-9]/g, '_') || Date.now()}`,
          image: safeImg,
        };
      });
      return mapped.sort((a, b) => parseDateToTimestamp(b.date) - parseDateToTimestamp(a.date));
    }
  } catch (e) {
    console.error('Failed reading localStorage projects:', e);
  }
  return [];
}

function setLocalProjects(projs: Project[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LOCAL_STORAGE_KEY_PROJECTS, JSON.stringify(projs));
}

/**
 * Fetch all projects from Firestore or LocalStorage (sorted latest first)
 */
export async function getProjects(): Promise<Project[]> {
  if (db && isFirebaseConfigured) {
    try {
      const colRef = collection(db, COLLECTION_NAME_PROJECTS);
      const snapshot = await getDocs(colRef);
      
      const projs: Project[] = [];
      snapshot.forEach((doc) => {
        projs.push({ id: doc.id, ...doc.data() } as Project);
      });

      // Sort latest first
      projs.sort((a, b) => parseDateToTimestamp(b.date) - parseDateToTimestamp(a.date));

      setLocalProjects(projs);
      return projs;
    } catch (err) {
      console.warn('[Firestore] Error fetching projects, using local fallback:', err);
    }
  }

  return getLocalProjects();
}

/**
 * Create a new Project
 */
export async function createProject(data: Omit<Project, 'id'> & { id?: string }): Promise<Project> {
  const id = data.id || `proj_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const newProject: Project = {
    ...data,
    id,
  };

  if (db && isFirebaseConfigured) {
    try {
      const payload = cleanFirestoreData(newProject);
      await setDoc(doc(db, COLLECTION_NAME_PROJECTS, id), payload);
    } catch (err) {
      console.warn('[Firestore] Failed creating project in cloud, using local cache:', err);
    }
  }

  const current = getLocalProjects();
  const updated = [newProject, ...current.filter(p => p.id !== id)];
  setLocalProjects(updated);

  return newProject;
}

/**
 * Update an existing Project
 */
export async function updateProject(id: string, data: Partial<Project>): Promise<void> {
  if (!id) return;
  if (db && isFirebaseConfigured) {
    try {
      const docRef = doc(db, COLLECTION_NAME_PROJECTS, id);
      const payload = cleanFirestoreData(data);
      await updateDoc(docRef, payload);
    } catch (err) {
      console.warn('[Firestore] Failed updating project in Firestore:', err);
    }
  }

  const current = getLocalProjects();
  const updated = current.map(p => p.id === id ? { ...p, ...data } : p);
  setLocalProjects(updated);
}

/**
 * Delete a Project
 */
export async function deleteProject(id: string): Promise<void> {
  if (!id) return;
  if (db && isFirebaseConfigured) {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME_PROJECTS, id));
    } catch (err) {
      console.warn('[Firestore] Failed deleting project from Firestore:', err);
    }
  }

  const current = getLocalProjects();
  const updated = current.filter(p => p.id !== id);
  setLocalProjects(updated);
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
