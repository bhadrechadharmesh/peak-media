/**
 * Peak Media — Internship Certificate Registry
 * --------------------------------------------------------------
 * This is the SINGLE source of truth for all valid internship
 * certificates. It is a plain data file — no database involved.
 *
 * To add a new certificate:
 *   1. Copy one of the entries below.
 *   2. Paste it inside CERTIFICATES (keep the trailing comma).
 *   3. Change the values — the key MUST equal the `id` field,
 *      and should follow the format: PM-INT-YYYY-####
 *   4. Save. The certificate is instantly verifiable at /verify.
 *
 * Lookup is case-insensitive and ignores spaces/hyphens, so
 * "pm-int-2025-0142" and "PM INT 2025 0142" both match.
 *
 * `hash` is a 32-character hex string shown on the certificate as
 * the "registry hash". Generate one with, e.g.:
 *   echo -n "PM-INT-2025-0301-Diya Mehta-Content" | md5sum
 * …or just make up any 32 hex characters (0-9, a-f).
 */

export interface Certificate {
  /** Certificate number, format PM-INT-YYYY-####. Must match its object key. */
  id: string;
  /** Full name of the intern. */
  internName: string;
  /** Internship title, e.g. "Performance Marketing Intern". */
  role: string;
  /** Team / pod, e.g. "Performance", "Creative", "Growth". */
  department: string;
  /** Human-readable start date, e.g. "January 6, 2025". */
  startDate: string;
  /** Human-readable end date. */
  endDate: string;
  /** Duration summary, e.g. "3 months". */
  duration: string;
  /** Date the certificate was issued. */
  issueDate: string;
  /** Mentor's full name. */
  mentor: string;
  /** Grade, e.g. "A+", "A", "B+". */
  grade: string;
  /** Skills demonstrated during the internship. */
  skills: string[];
  /** Completion status, almost always "Completed". */
  status: string;
  /** Office city: Mumbai | Bengaluru | Delhi. */
  location: string;
  /** 32-char hex registry hash shown on the certificate. */
  hash: string;
}

export const CERTIFICATES: Record<string, Certificate> = {
  "PM-INT-2026-0142": {
    id: "PM-INT-2026-0142",
    internName: "Garv Bahal",
    role: "Backend Developer Intern",
    department: "Technology",
    startDate: "May 30, 2026",
    endDate: "July 31, 2026",
    duration: "2 months",
    issueDate: "August 2, 2026",
    mentor: "Rohan Desai",
    grade: "A+",
    skills: ["Node.js", "React.js", "Express.js", "MongoDB", "Python","Docker","Redis"],
    status: "Completed",
    location: "Jaipur",
    hash: "9f3a7c2e1b8d4f60a5e2c7b91d04f8a3",
  },
  "PM-INT-2026-0187": {
    id: "PM-INT-2026-0187",
    internName: "Divyank Parihar",
    role: "Machine Learning & AI Intern",
    department: "Technology",
    startDate: "May 30, 2026",
    endDate: "July 31, 2026",
    duration: "2 months",
    issueDate: "August 2, 2026",
    mentor: "Rohan Desai",
    grade: "A",
    skills: ["Data Science", "Python", "Machine Learning", "Deep Learning", "TensorFlow"],
    status: "Completed",
    location: "Jaipur",
    hash: "c4e8a01f7b2d9653ac1e0f48b6d27a13",
  },
  "PM-INT-2026-0331": {
    id: "PM-INT-2026-0331",
    internName: "Vishal Ghasoliya",
    role: "Frontend Developer Intern",
    department: "Technology",
    startDate: "June 1, 2026",
    endDate: "July 31, 2026",
    duration: "2 months",
    issueDate: "August 2, 2026",
    mentor: "Rohan Desai",
    grade: "A+",
    skills: ["React.js", "Next.js", "TypeScript", "Tailwind CSS", "Git"],
    status: "Completed",
    location: "Jaipur",
    hash: "2b6f9a04e8c1d735af029b74e6c81d4f",
  },
  "PM-INT-2026-0209": {
    id: "PM-INT-2026-0209",
    internName: "Dharmesh Bhadrecha",
    role: "Backend Developer Intern",
    department: "Technology",
    startDate: "June 1, 2026",
    endDate: "July 31, 2026",
    duration: "2 months",
    issueDate: "August 2, 2026",
    mentor: "Rohan Desai",
    grade: "A+",
    skills: ["Node.js", "Next.js", "Express.js", "MongoDB", "Python","Docker","Redis"],
    status: "Completed",
    location: "Jaipur",
    hash: "7d1c4a9f08e6b235c47a91f05d8b6e23",
  },
  "PM-INT-2026-0238": {
    id: "PM-INT-2026-0238",
    internName: "Devendra Gautam",
    role: "Frontend Developer Intern",
    department: "Technology",
    startDate: "June 1, 2026",
    endDate: "July 31, 2026",
    duration: "2 months",
    issueDate: "August 2, 2026",
    mentor: "Rohan Desai",
    grade: "A+",
    skills: ["React.js", "Next.js", "TypeScript", "Tailwind CSS", "Git"],
    status: "Completed",
    location: "Jaipur",
    hash: "5e8a02f7c4b9d163af8e0c47b6d2719a",
  },
    "PM-INT-2026-0269": {
    id: "PM-INT-2026-0269",
    internName: "Aman Jain",
    role: "Backend Developer Intern",
    department: "Technology",
    startDate: "June 1, 2026",
    endDate: "July 31, 2026",
    duration: "2 months",
    issueDate: "August 2, 2026",
    mentor: "Rohan Desai",
    grade: "A+",
    skills: ["Node.js", "Next.js", "Express.js", "MongoDB", "Python","Docker","Redis"],
    status: "Completed",
    location: "Jaipur",
    hash: "5e8a02f7c4b9d163af8e0c47b6d2719a",
  },
};

/**
 * Normalize a certificate number for lookup: trim + uppercase + strip
 * spaces/hyphens. ("pm-int-2025-0142" / "PM INT 2025 0142" → "PMINT20250142")
 */
export function normalizeCertificateId(raw: string): string {
  return raw.trim().toUpperCase().replace(/\s+/g, "").replace(/-/g, "");
}

/**
 * Look up a certificate by its (user-entered) number.
 * Returns the Certificate if found, otherwise null.
 */
export function getCertificate(rawId: string): Certificate | null {
  const id = normalizeCertificateId(rawId);
  if (!id) return null;
  // Match against normalized keys so formatting/spacing never blocks a match.
  const found = Object.values(CERTIFICATES).find(
    (c) => normalizeCertificateId(c.id) === id
  );
  return found ?? null;
}

/** Total number of registered certificates. */
export function certificateCount(): number {
  return Object.keys(CERTIFICATES).length;
}
