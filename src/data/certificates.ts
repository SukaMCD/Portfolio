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

export const initialCertificates: Certificate[] = [
  {
    id: "web-programming-basic",
    title: "Belajar Dasar Pemrograman Web",
    issuer: "Dicoding Indonesia",
    date: "12 May, 2025",
    credentialId: "81LD8OGG7ZPG",
    credentialUrl: "https://www.dicoding.com/certificates/81LD8OGG7ZPG",
    tags: ["HTML", "CSS", "Web Design"],
  },
  {
    id: "js-programming-basic",
    title: "Belajar Dasar Pemrograman JavaScript",
    issuer: "Dicoding Indonesia",
    date: "28 Jun, 2025",
    credentialId: "EOZQD4O6KZY1",
    credentialUrl: "https://www.dicoding.com/certificates/EOZQD4O6KZY1",
    tags: ["JavaScript", "Programming", "Logic"],
  },
  {
    id: "competency-rpl",
    title: "Sertifikat Kompetensi Keahlian RPL",
    issuer: "SMK Budi Luhur / LSP-P1",
    date: "10 Mar, 2026",
    credentialId: "LSP-SMKBL-2026-045",
    tags: ["Software Engineering", "Laravel", "MySQL"],
  }
];
