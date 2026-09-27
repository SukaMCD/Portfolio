import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  onSnapshot,
  type Firestore,
} from 'firebase/firestore';

// Firebase config (Vite / Astro env vars)
const firebaseConfig = {
  apiKey:
    import.meta.env.PUBLIC_FIREBASE_API_KEY ||
    import.meta.env.VITE_FIREBASE_API_KEY ||
    'AIzaSyAad6R3wQl2POM33y3BIWvX0SwDUMzcT8M',
  authDomain:
    import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN ||
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ||
    'sukamcd-caea8.firebaseapp.com',
  projectId:
    import.meta.env.PUBLIC_FIREBASE_PROJECT_ID ||
    import.meta.env.VITE_FIREBASE_PROJECT_ID ||
    'sukamcd-caea8',
  storageBucket:
    import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET ||
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ||
    'sukamcd-caea8.firebasestorage.app',
  messagingSenderId:
    import.meta.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID ||
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ||
    '10250226196',
  appId:
    import.meta.env.PUBLIC_FIREBASE_APP_ID ||
    import.meta.env.VITE_FIREBASE_APP_ID ||
    '1:10250226196:web:169e6c6976b0e07ad97501',
};

const LOCAL_STORAGE_KEY_PROJECTS = 'sukamcd_portfolio_projects';
const COLLECTION_NAME_PROJECTS = 'projects';
const LOCAL_STORAGE_KEY_CERTIFICATES = 'sukamcd_portfolio_certificates';
const COLLECTION_NAME_CERTIFICATES = 'certificates';
const COLLECTION_NAME_EXPERIENCES = 'experiences';
export const DEFAULT_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1572945281861-68b122e3e85a?q=80&w=600&auto=format&fit=crop';

export const DEFAULT_EXPERIENCES: Experience[] = [
  {
    id: 'exp-istanakomputer',
    role: 'Mobile & Web Developer',
    organization: 'Istana Komputer · PT ISKOM SARANA NUSANTARA',
    period: 'FEB 2026 — PRESENT',
    type: 'PART-TIME',
    location: 'East Jakarta · Remote',
    description: 'Successfully transitioned from an internship role to part-time software developer driven by strong technical execution and consistent contributions.',
    highlights: [
      'Engineered and maintained high-performance web and mobile applications at PT ISKOM SARANA NUSANTARA',
      'Collaborated closely with core developers to design and execute clean application workflows aligned with user requirements',
      'Authored clean, scalable, and type-safe code to ensure optimal application performance and stability',
    ],
    technologies: ['Mobile & Web Dev', 'Flutter', 'RESTful API', 'Clean Architecture', 'Git'],
    order: 1,
  },
  {
    id: 'exp-budiluhur-web',
    role: 'Frontend Developer – School Web Team',
    organization: 'SMK Budi Luhur',
    period: 'JAN 2025 — JUL 2025',
    type: 'PART-TIME',
    location: 'East Jakarta · Hybrid',
    description: 'Recruited by Web & Mobile Programming faculty to join the institutional web development initiative powered by WordPress.',
    highlights: [
      'Architected and optimized UI/UX across school web platforms with focus on accessibility and page speed',
      'Entrusted with developing responsive portals for SD Ceria Demangan Yogyakarta and SMP Budi Luhur with intuitive layouts',
      'Delivered an accessible, informative digital platform for students, faculty, and guardians',
    ],
    technologies: ['WordPress', 'Web Design', 'Frontend Development', 'Responsive UI', 'PHP'],
    order: 2,
  },
  {
    id: 'exp-leaflytea',
    role: 'Frontend & Backend Developer',
    organization: 'Leafly Tea – E-commerce Platform',
    period: 'APR 2025 — MAY 2025',
    type: 'FREELANCE',
    location: 'Tangerang City, Banten',
    description: 'Engineered an e-commerce platform for artisanal tea beverages as an independent commercial software project.',
    highlights: [
      'Handled backend architecture in PHP and crafted responsive, dynamic client interfaces with JavaScript',
      'Implemented dynamic catalog browsing, cart state management, and seamless multi-device checkout flows',
      'Honed user-centric design principles and defensive programming techniques for scalable web services',
    ],
    technologies: ['PHP', 'JavaScript', 'E-Commerce Architecture', 'Responsive CSS', 'UI/UX'],
    order: 3,
  },
  {
    id: 'exp-lostformula',
    role: 'Game Developer – Lost Formula',
    organization: 'Lost Formula: A Forest Mystery',
    period: 'MAR 2025 — MAY 2025',
    type: 'FREELANCE',
    location: 'Tangerang City, Banten',
    description: 'Co-led technical development of a pixel-art 2D story adventure RPG built with Godot Engine 4.',
    highlights: [
      'Engineered core gameplay systems, state machines, inventory management, and interaction mechanics',
      'Collaborated with animation artists from SMK Budi Luhur for medieval fantasy asset pipelines and character rigging',
      'Implemented exploration puzzles, combat sequences, and procedural dialogue systems',
    ],
    technologies: ['Godot Engine 4', 'GDScript', 'Gameplay Logic', 'Inventory Systems', 'State Machine'],
    order: 4,
  },
];

let app: FirebaseApp | null = null;
let db: Firestore | null = null;

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  !String(firebaseConfig.apiKey).includes('your_api_key')
);

if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    db = getFirestore(app);
  } catch (error) {
    console.warn('[Firebase] Initialization error, falling back to localStorage:', error);
  }
}

// Project type
export interface ProjectLink {
  label: string;
  url: string;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  date: string;
  description: string;
  tags: string[];
  links: ProjectLink[];
  image: string;
  alt?: string;
}

// Certificate type
export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  credentialId?: string;
  credentialUrl?: string;
  image?: string;
  tags?: string[];
}

// Experience type
export interface Experience {
  id: string;
  role: string;
  organization: string;
  period: string;
  type: string;
  location?: string;
  description: string;
  highlights: string[];
  technologies: string[];
  order?: number;
}

// Google Drive image URL helpers
export function extractDriveFileId(url?: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  const matchFile = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (matchFile?.[1]) return matchFile[1];
  const matchId = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (matchId?.[1]) return matchId[1];
  const matchD = trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (matchD?.[1]) return matchD[1];
  return null;
}

export function formatDriveImageUrl(url?: string): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (!trimmed || trimmed === '/image/.webp' || trimmed === '/image/' || trimmed === '.webp') return '';
  const fileId = extractDriveFileId(trimmed);
  if (fileId) return `https://lh3.googleusercontent.com/d/${fileId}`;
  return trimmed;
}

// Date sort helper
function parseDateToTimestamp(dateStr: string): number {
  if (!dateStr) return 0;
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? 0 : d.getTime();
}

// Clear legacy local storage keys to ensure clean state
if (typeof window !== 'undefined') {
  try {
    localStorage.removeItem(LOCAL_STORAGE_KEY_PROJECTS);
    localStorage.removeItem(LOCAL_STORAGE_KEY_CERTIFICATES);
  } catch (_) {}
}

// Fetch all projects (Pure Firestore)
export async function getProjects(): Promise<Project[]> {
  if (db && isFirebaseConfigured) {
    try {
      const colRef = collection(db, COLLECTION_NAME_PROJECTS);
      const snapshot = await getDocs(colRef);
      const projs: Project[] = [];
      snapshot.forEach((doc) => {
        projs.push({ id: doc.id, ...doc.data() } as Project);
      });
      projs.sort((a, b) => parseDateToTimestamp(b.date) - parseDateToTimestamp(a.date));
      return projs;
    } catch (err) {
      console.warn('[Firestore] Error fetching projects:', err);
    }
  }
  return [];
}

// Fetch all certificates (Pure Firestore)
export async function getCertificates(): Promise<Certificate[]> {
  if (db && isFirebaseConfigured) {
    try {
      const colRef = collection(db, COLLECTION_NAME_CERTIFICATES);
      const snapshot = await getDocs(colRef);
      const certs: Certificate[] = [];
      snapshot.forEach((doc) => {
        certs.push({ id: doc.id, ...doc.data() } as Certificate);
      });
      certs.sort((a, b) => parseDateToTimestamp(b.date) - parseDateToTimestamp(a.date));
      return certs;
    } catch (err) {
      console.warn('[Firestore] Error fetching certificates:', err);
    }
  }
  return [];
}

// Realtime certificate subscriber (Pure Firestore)
export function subscribeCertificates(callback: (certs: Certificate[]) => void): () => void {
  if (db && isFirebaseConfigured) {
    try {
      const colRef = collection(db, COLLECTION_NAME_CERTIFICATES);
      return onSnapshot(
        colRef,
        (snapshot) => {
          const certs: Certificate[] = [];
          snapshot.forEach((doc) => {
            certs.push({ id: doc.id, ...doc.data() } as Certificate);
          });
          certs.sort((a, b) => parseDateToTimestamp(b.date) - parseDateToTimestamp(a.date));
          callback(certs);
        },
        (err) => {
          console.warn('[Firestore] Realtime certificates listener error:', err);
        }
      );
    } catch (e) {
      console.warn('[Firestore] Failed attaching realtime certificates listener:', e);
    }
  }
  return () => {};
}

// Realtime projects subscriber (Pure Firestore)
export function subscribeProjects(callback: (projects: Project[]) => void): () => void {
  if (db && isFirebaseConfigured) {
    try {
      const colRef = collection(db, COLLECTION_NAME_PROJECTS);
      return onSnapshot(
        colRef,
        (snapshot) => {
          const projs: Project[] = [];
          snapshot.forEach((doc) => {
            projs.push({ id: doc.id, ...doc.data() } as Project);
          });
          projs.sort((a, b) => parseDateToTimestamp(b.date) - parseDateToTimestamp(a.date));
          callback(projs);
        },
        (err) => {
          console.warn('[Firestore] Realtime projects listener error:', err);
        }
      );
    } catch (e) {
      console.warn('[Firestore] Failed attaching realtime projects listener:', e);
    }
  }
  return () => {};
}

// Fetch all experiences (Pure Firestore with fallback)
export async function getExperiences(): Promise<Experience[]> {
  if (db && isFirebaseConfigured) {
    try {
      const colRef = collection(db, COLLECTION_NAME_EXPERIENCES);
      const snapshot = await getDocs(colRef);
      if (!snapshot.empty) {
        const items: Experience[] = [];
        snapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() } as Experience);
        });
        items.sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
        return items;
      }
    } catch (err) {
      console.warn('[Firestore] Error fetching experiences:', err);
    }
  }
  return DEFAULT_EXPERIENCES;
}

// Realtime experiences subscriber (Pure Firestore with fallback)
export function subscribeExperiences(callback: (experiences: Experience[]) => void): () => void {
  if (db && isFirebaseConfigured) {
    try {
      const colRef = collection(db, COLLECTION_NAME_EXPERIENCES);
      return onSnapshot(
        colRef,
        (snapshot) => {
          if (!snapshot.empty) {
            const items: Experience[] = [];
            snapshot.forEach((doc) => {
              items.push({ id: doc.id, ...doc.data() } as Experience);
            });
            items.sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
            callback(items);
          } else {
            callback(DEFAULT_EXPERIENCES);
          }
        },
        (err) => {
          console.warn('[Firestore] Realtime experiences listener error, using defaults:', err);
          callback(DEFAULT_EXPERIENCES);
        }
      );
    } catch (e) {
      console.warn('[Firestore] Failed attaching realtime experiences listener:', e);
      callback(DEFAULT_EXPERIENCES);
    }
  } else {
    callback(DEFAULT_EXPERIENCES);
  }
  return () => {};
}



