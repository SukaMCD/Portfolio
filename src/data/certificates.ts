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

export const initialCertificates: Certificate[] = [];

