// ============================================================
// BDSisters.org — System Security & Operations Mock Data
// Step 14: Muhsina Integration & System Security
// ============================================================

export interface AdminAuditLog {
  id: string;
  adminName: string;
  adminEmail: string;
  role: string;
  action: string;
  targetResource: string;
  ipAddress: string;
  location: string;
  status: "SUCCESS" | "DENIED" | "FLAGGED";
  timestamp: string;
  details?: string;
}

export interface LoginHistoryRecord {
  id: string;
  email: string;
  role: string;
  ipAddress: string;
  device: string;
  location: string;
  status: "SUCCESS" | "FAILED_PASSWORD" | "FAILED_2FA" | "BLOCKED_IP";
  timestamp: string;
}

export interface ActiveSession {
  id: string;
  userEmail: string;
  userName: string;
  role: string;
  ipAddress: string;
  device: string;
  location: string;
  startedAt: string;
  lastActivityAt: string;
  isCurrentSession: boolean;
}

export interface SecurityEvent {
  id: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  title: string;
  description: string;
  sourceIp: string;
  detectedAt: string;
  status: "OPEN" | "INVESTIGATING" | "RESOLVED";
  mitigationAction: string;
}

export interface DatabaseBackup {
  id: string;
  filename: string;
  size: string;
  type: "AUTOMATED_DAILY" | "MANUAL_SNAPSHOT" | "PRE_DEPLOYMENT";
  storageLocation: string;
  status: "VERIFIED_INTEGRAL" | "IN_PROGRESS" | "FAILED";
  createdAt: string;
  checksum: string;
}

export interface ServiceHealthItem {
  name: string;
  category: "APPLICATION" | "DATABASE" | "PAYMENT" | "MESSAGING" | "SECURITY";
  status: "HEALTHY" | "DEGRADED" | "DOWN";
  uptime: string;
  latency: string;
  lastChecked: string;
  notes?: string;
}

export const DEMO_SECURITY_KPIS = {
  securityScore: 94, // Out of 100
  activeAdminSessions: 3,
  twoFactorAdoptionRate: 88.5,
  blockedThreats24h: 142,
  failedLogins24h: 18,
  lastVulnerabilityScan: "2026-11-19T02:00:00Z",
  sslStatus: "TLS 1.3 / Strict HSTS Active",
};

export const DEMO_AUDIT_LOGS: AdminAuditLog[] = [
  {
    id: "audit-101",
    adminName: "Nusrat Jahan (Super Admin)",
    adminEmail: "admin@bdsisters.org",
    role: "SUPER_ADMIN",
    action: "ROLE_PERMISSION_UPDATE",
    targetResource: "Role: Community Moderator (Added: delete_comment)",
    ipAddress: "103.230.104.18",
    location: "Dhaka, Bangladesh",
    status: "SUCCESS",
    timestamp: "2026-11-19T04:12:00Z",
    details: "Granted comment moderation permissions to verified sister ambassadors.",
  },
  {
    id: "audit-102",
    adminName: "Farhana Yasmin (Staff)",
    adminEmail: "farhana.staff@bdsisters.org",
    role: "ADMIN",
    action: "MEMBER_VERIFICATION_APPROVAL",
    targetResource: "Member: BDS-88415 (NID Smart Card Verified)",
    ipAddress: "103.205.71.4",
    location: "Chattogram, Bangladesh",
    status: "SUCCESS",
    timestamp: "2026-11-19T03:45:00Z",
    details: "Female identity officer confirmed matching government biometric hash.",
  },
  {
    id: "audit-103",
    adminName: "Security Automated Sentinel",
    adminEmail: "system-sentinel@bdsisters.org",
    role: "SYSTEM",
    action: "SUSPICIOUS_IP_BLOCK",
    targetResource: "IP: 185.220.101.5 (Tor Exit Node)",
    ipAddress: "185.220.101.5",
    location: "Frankfurt, Germany",
    status: "SUCCESS",
    timestamp: "2026-11-19T02:18:00Z",
    details: "Automatic rate-limit trigger: 45 invalid login attempts in 60 seconds.",
  },
  {
    id: "audit-104",
    adminName: "Nusrat Jahan (Super Admin)",
    adminEmail: "admin@bdsisters.org",
    role: "SUPER_ADMIN",
    action: "MANUAL_BACKUP_TRIGGER",
    targetResource: "Snapshot: bdsisters_prod_snap_20261119.tar.gz",
    ipAddress: "103.230.104.18",
    location: "Dhaka, Bangladesh",
    status: "SUCCESS",
    timestamp: "2026-11-18T23:00:00Z",
    details: "Manual coldline backup created prior to scheduled maintenance.",
  },
];

export const DEMO_LOGIN_HISTORY: LoginHistoryRecord[] = [
  {
    id: "log-1",
    email: "admin@bdsisters.org",
    role: "SUPER_ADMIN",
    ipAddress: "103.230.104.18",
    device: "Chrome 130 / Windows 11",
    location: "Dhaka, Bangladesh",
    status: "SUCCESS",
    timestamp: "2026-11-19T04:10:00Z",
  },
  {
    id: "log-2",
    email: "farhana.staff@bdsisters.org",
    role: "ADMIN",
    ipAddress: "103.205.71.4",
    device: "Safari 18 / macOS Sonoma",
    location: "Chattogram, Bangladesh",
    status: "SUCCESS",
    timestamp: "2026-11-19T03:30:00Z",
  },
  {
    id: "log-3",
    email: "unknown_tester@mail.com",
    role: "ANONYMOUS",
    ipAddress: "185.220.101.5",
    device: "Python-Requests / Linux",
    location: "Frankfurt, Germany",
    status: "BLOCKED_IP",
    timestamp: "2026-11-19T02:17:55Z",
  },
  {
    id: "log-4",
    email: "dr.nusrat@bdsisters.org",
    role: "MEMBER",
    ipAddress: "103.140.92.12",
    device: "Mobile Safari / iOS 18",
    location: "Dhaka, Bangladesh",
    status: "SUCCESS",
    timestamp: "2026-11-19T01:45:00Z",
  },
];

export const DEMO_ACTIVE_SESSIONS: ActiveSession[] = [
  {
    id: "sess-1",
    userEmail: "admin@bdsisters.org",
    userName: "Nusrat Jahan",
    role: "SUPER_ADMIN",
    ipAddress: "103.230.104.18",
    device: "Chrome 130 on Windows 11",
    location: "Gulshan-2, Dhaka",
    startedAt: "2026-11-19T04:10:00Z",
    lastActivityAt: "Just now",
    isCurrentSession: true,
  },
  {
    id: "sess-2",
    userEmail: "farhana.staff@bdsisters.org",
    userName: "Farhana Yasmin",
    role: "ADMIN",
    ipAddress: "103.205.71.4",
    device: "Safari 18 on MacBook Air",
    location: "Nasirabad, Chattogram",
    startedAt: "2026-11-19T03:30:00Z",
    lastActivityAt: "12 mins ago",
    isCurrentSession: false,
  },
  {
    id: "sess-3",
    userEmail: "support.ops@bdsisters.org",
    userName: "Amina Khatun",
    role: "SUPPORT_LEAD",
    ipAddress: "103.111.45.19",
    device: "Firefox 132 on Windows 10",
    location: "Dhanmondi, Dhaka",
    startedAt: "2026-11-19T01:15:00Z",
    lastActivityAt: "45 mins ago",
    isCurrentSession: false,
  },
];

export const DEMO_SECURITY_EVENTS: SecurityEvent[] = [
  {
    id: "sec-1",
    severity: "HIGH",
    title: "Brute-force credential stuffing attack detected",
    description: "Multiple failed attempts targeting /api/auth/login from rotating proxy IP pool.",
    sourceIp: "185.220.101.0/24 (Subnet)",
    detectedAt: "2026-11-19T02:18:00Z",
    status: "RESOLVED",
    mitigationAction: "Cloudflare WAF Challenge triggered + IP range added to edge blacklist.",
  },
  {
    id: "sec-2",
    severity: "LOW",
    title: "Unusual geo-login for administrative user",
    description: "Admin logged in from international IP address while previous session was active in Dhaka.",
    sourceIp: "51.15.24.110 (Paris, France)",
    detectedAt: "2026-11-18T19:40:00Z",
    status: "RESOLVED",
    mitigationAction: "Mandatory 2FA challenge verified successfully by user.",
  },
];

export const DEMO_BACKUPS: DatabaseBackup[] = [
  {
    id: "bk-20261119-01",
    filename: "bdsisters_daily_dump_20261119_0000.tar.gz",
    size: "428 MB",
    type: "AUTOMATED_DAILY",
    storageLocation: "Google Cloud Storage (Coldline - Singapore)",
    status: "VERIFIED_INTEGRAL",
    createdAt: "2026-11-19T00:00:15Z",
    checksum: "sha256:8f2a1b9c3e4d5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0",
  },
  {
    id: "bk-20261118-01",
    filename: "bdsisters_daily_dump_20261118_0000.tar.gz",
    size: "422 MB",
    type: "AUTOMATED_DAILY",
    storageLocation: "Google Cloud Storage (Coldline - Singapore)",
    status: "VERIFIED_INTEGRAL",
    createdAt: "2026-11-18T00:00:12Z",
    checksum: "sha256:7e1a0b8c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9",
  },
  {
    id: "bk-20261117-snap",
    filename: "bdsisters_pre_patch_snapshot_20261117.tar.gz",
    size: "419 MB",
    type: "MANUAL_SNAPSHOT",
    storageLocation: "AWS S3 Glacier Instant (Mumbai)",
    status: "VERIFIED_INTEGRAL",
    createdAt: "2026-11-17T18:30:00Z",
    checksum: "sha256:6d0a9b7c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8",
  },
];

export const DEMO_SERVICE_HEALTH: ServiceHealthItem[] = [
  {
    name: "Next.js Core Application Server",
    category: "APPLICATION",
    status: "HEALTHY",
    uptime: "99.98%",
    latency: "38ms",
    lastChecked: "Just now",
  },
  {
    name: "MongoDB Atlas Primary Replica",
    category: "DATABASE",
    status: "HEALTHY",
    uptime: "99.99%",
    latency: "8ms",
    lastChecked: "Just now",
  },
  {
    name: "ZiniPay Merchant Gateway API",
    category: "PAYMENT",
    status: "HEALTHY",
    uptime: "99.95%",
    latency: "115ms",
    lastChecked: "1 min ago",
  },
  {
    name: "Resend Transactional Email Engine",
    category: "MESSAGING",
    status: "HEALTHY",
    uptime: "99.92%",
    latency: "142ms",
    lastChecked: "1 min ago",
  },
  {
    name: "Cloudflare Edge Security & WAF",
    category: "SECURITY",
    status: "HEALTHY",
    uptime: "100.0%",
    latency: "12ms",
    lastChecked: "Just now",
  },
];
