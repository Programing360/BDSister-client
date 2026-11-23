// ============================================================
// BDSisters.org — Muhsina Organization Integration Demo Data
// Step 14: Muhsina Integration & System Security
// ============================================================

export interface MuhsinaWing {
  id: string;
  code: string;
  name: string;
  leadName: string;
  leadRole: string;
  leadEmail: string;
  focusAreas: string[];
  membersCount: number;
  activeProjectsCount: number;
  status: "ACTIVE" | "PENDING_REVIEW" | "INACTIVE";
  syncStatus: "SYNCHRONIZED" | "SYNCING" | "NEEDS_ATTENTION";
  description: string;
  establishedDate: string;
}

export interface MuhsinaMemberMapping {
  id: string;
  bdsistersId: string;
  muhsinaId: string;
  name: string;
  email: string;
  district: string;
  wingCode: string;
  wingName: string;
  wingRole: "COORDINATOR" | "EXECUTIVE" | "MENTOR" | "GENERAL_MEMBER";
  syncStatus: "SYNCHRONIZED" | "PENDING_SYNC" | "CONFLICT" | "UNMAPPED";
  lastSyncedAt: string;
  matchConfidence: number; // 0 - 100
}

export interface MuhsinaSyncLog {
  id: string;
  syncType: "AUTOMATED_HOURLY" | "MANUAL_TRIGGER" | "WEBHOOK_EVENT" | "MEMBER_ONBOARDING";
  initiatedBy: string;
  recordsProcessed: number;
  recordsUpdated: number;
  conflictsFound: number;
  status: "SUCCESS" | "WARNING" | "FAILED";
  timestamp: string;
  durationMs: number;
  notes?: string;
}

export interface MuhsinaConflictItem {
  id: string;
  memberId: string;
  memberName: string;
  fieldName: string;
  bdsistersValue: string;
  muhsinaValue: string;
  severity: "HIGH" | "MEDIUM" | "LOW";
  status: "PENDING_REVIEW" | "RESOLVED_LOCAL" | "RESOLVED_REMOTE" | "DISMISSED";
  detectedAt: string;
  resolutionNotes?: string;
}

export const DEMO_MUHSINA_KPIS = {
  totalSyncedMembers: 4820,
  syncHealthRate: 99.4,
  connectedWings: 5,
  pendingConflicts: 6,
  lastGlobalSync: "2026-11-19T03:30:00Z",
  syncEngineStatus: "OPERATIONAL",
  webhookStatus: "ACTIVE",
};

export const DEMO_MUHSINA_WINGS: MuhsinaWing[] = [
  {
    id: "wing-cop",
    code: "CoP",
    name: "Council of Professionals (CoP)",
    leadName: "Dr. Nusrat Jahan",
    leadRole: "Chief Medical Officer & Wing Dean",
    leadEmail: "nusrat.jahan@muhsina.org",
    focusAreas: ["Healthcare & Medical", "Corporate Leadership", "Legal Advocacy", "Higher Education"],
    membersCount: 1450,
    activeProjectsCount: 8,
    status: "ACTIVE",
    syncStatus: "SYNCHRONIZED",
    description: "Uniting female doctors, corporate directors, advocates, and academic researchers for cross-disciplinary sisterhood advancement.",
    establishedDate: "2023-04-15",
  },
  {
    id: "wing-tspp",
    code: "TSPP",
    name: "Tech & Software Professional Platform (TSPP)",
    leadName: "Farhana Yasmin",
    leadRole: "Lead Cloud Architect & Wing Chair",
    leadEmail: "farhana.yasmin@muhsina.org",
    focusAreas: ["Software Engineering", "AI & Machine Learning", "Cybersecurity", "UI/UX & Product"],
    membersCount: 1120,
    activeProjectsCount: 12,
    status: "ACTIVE",
    syncStatus: "SYNCHRONIZED",
    description: "Accelerating Bangladeshi women in high-growth technology careers, offshore engineering contracts, and tech founder incubators.",
    establishedDate: "2023-08-01",
  },
  {
    id: "wing-imbd",
    code: "IMBD",
    name: "Islamic Mentorship & Business Development (IMBD)",
    leadName: "Amina Khatun, FCA",
    leadRole: "Senior Financial Auditor & Wing President",
    leadEmail: "amina.khatun@muhsina.org",
    focusAreas: ["Halal Commerce", "Shariah Compliance", "Venture Grants", "Micro-enterprise Growth"],
    membersCount: 1280,
    activeProjectsCount: 14,
    status: "ACTIVE",
    syncStatus: "SYNCHRONIZED",
    description: "Providing authentic ethical business governance, halal financing frameworks, and peer mastermind guidance for founders.",
    establishedDate: "2023-02-10",
  },
  {
    id: "wing-mcpo",
    code: "MCPO",
    name: "Media, Communications & Public Outreach",
    leadName: "Rumana Kabir",
    leadRole: "Broadcast Journalist & Wing Lead",
    leadEmail: "rumana.kabir@muhsina.org",
    focusAreas: ["Investigative Journalism", "Documentary Film", "Brand Strategy", "Public Relations"],
    membersCount: 560,
    activeProjectsCount: 6,
    status: "ACTIVE",
    syncStatus: "SYNCHRONIZED",
    description: "Amplifying positive narratives of Bangladeshi women achievers and ensuring high-impact public representation.",
    establishedDate: "2024-01-20",
  },
  {
    id: "wing-swsa",
    code: "SWSA",
    name: "Social Welfare & Sisterhood Aid",
    leadName: "Sultana Razia",
    leadRole: "Community Operations Lead",
    leadEmail: "sultana.razia@muhsina.org",
    focusAreas: ["Emergency Crisis Relief", "Maternity Healthcare Aid", "Vocational Training Grants"],
    membersCount: 410,
    activeProjectsCount: 9,
    status: "ACTIVE",
    syncStatus: "NEEDS_ATTENTION",
    description: "Direct humanitarian safety nets for underprivileged sisters and vocational rehabilitation in grassroots districts.",
    establishedDate: "2024-05-12",
  },
];

export const DEMO_MUHSINA_MEMBERS: MuhsinaMemberMapping[] = [
  {
    id: "map-1",
    bdsistersId: "BDS-88410",
    muhsinaId: "MUH-COP-014",
    name: "Dr. Nusrat Jahan",
    email: "dr.nusrat@bdsisters.org",
    district: "Dhaka",
    wingCode: "CoP",
    wingName: "Council of Professionals",
    wingRole: "COORDINATOR",
    syncStatus: "SYNCHRONIZED",
    lastSyncedAt: "2026-11-19T03:30:00Z",
    matchConfidence: 100,
  },
  {
    id: "map-2",
    bdsistersId: "BDS-88411",
    muhsinaId: "MUH-TSPP-009",
    name: "Farhana Yasmin",
    email: "farhana.tech@bdsisters.org",
    district: "Dhaka",
    wingCode: "TSPP",
    wingName: "Tech & Software Professional Platform",
    wingRole: "COORDINATOR",
    syncStatus: "SYNCHRONIZED",
    lastSyncedAt: "2026-11-19T03:30:00Z",
    matchConfidence: 100,
  },
  {
    id: "map-3",
    bdsistersId: "BDS-88412",
    muhsinaId: "MUH-IMBD-088",
    name: "Amina Khatun, FCA",
    email: "amina.audit@bdsisters.org",
    district: "Chattogram",
    wingCode: "IMBD",
    wingName: "Islamic Mentorship & Business Development",
    wingRole: "MENTOR",
    syncStatus: "SYNCHRONIZED",
    lastSyncedAt: "2026-11-19T03:30:00Z",
    matchConfidence: 98,
  },
  {
    id: "map-4",
    bdsistersId: "BDS-88415",
    muhsinaId: "MUH-SWSA-045",
    name: "Tahmina Akter",
    email: "tahmina.crafts@bdsisters.org",
    district: "Narayanganj",
    wingCode: "SWSA",
    wingName: "Social Welfare & Sisterhood Aid",
    wingRole: "EXECUTIVE",
    syncStatus: "CONFLICT",
    lastSyncedAt: "2026-11-18T22:15:00Z",
    matchConfidence: 85,
  },
  {
    id: "map-5",
    bdsistersId: "BDS-88420",
    muhsinaId: "MUH-TSPP-122",
    name: "Rubaba Khan",
    email: "rubaba.design@bdsisters.org",
    district: "Sylhet",
    wingCode: "TSPP",
    wingName: "Tech & Software Professional Platform",
    wingRole: "GENERAL_MEMBER",
    syncStatus: "PENDING_SYNC",
    lastSyncedAt: "2026-11-18T18:00:00Z",
    matchConfidence: 94,
  },
  {
    id: "map-6",
    bdsistersId: "BDS-88432",
    muhsinaId: "MUH-COP-201",
    name: "Sharmin Sultana",
    email: "sharmin.mentor@bdsisters.org",
    district: "Rajshahi",
    wingCode: "CoP",
    wingName: "Council of Professionals",
    wingRole: "MENTOR",
    syncStatus: "SYNCHRONIZED",
    lastSyncedAt: "2026-11-19T03:30:00Z",
    matchConfidence: 100,
  },
];

export const DEMO_SYNC_LOGS: MuhsinaSyncLog[] = [
  {
    id: "sync-101",
    syncType: "AUTOMATED_HOURLY",
    initiatedBy: "System Cron (CronJob-MuhsinaSync)",
    recordsProcessed: 4820,
    recordsUpdated: 34,
    conflictsFound: 1,
    status: "SUCCESS",
    timestamp: "2026-11-19T03:30:00Z",
    durationMs: 1420,
    notes: "Regular differential synchronization completed cleanly across all 5 wings.",
  },
  {
    id: "sync-102",
    syncType: "WEBHOOK_EVENT",
    initiatedBy: "Muhsina Core Gateway Webhook",
    recordsProcessed: 1,
    recordsUpdated: 1,
    conflictsFound: 0,
    status: "SUCCESS",
    timestamp: "2026-11-19T02:14:22Z",
    durationMs: 240,
    notes: "Member profile role upgraded in CoP Wing.",
  },
  {
    id: "sync-103",
    syncType: "MANUAL_TRIGGER",
    initiatedBy: "Admin: Nusrat Jahan",
    recordsProcessed: 4819,
    recordsUpdated: 82,
    conflictsFound: 6,
    status: "WARNING",
    timestamp: "2026-11-18T22:15:00Z",
    durationMs: 2850,
    notes: "Bulk sync discovered 6 profile field discrepancies requiring administrative review.",
  },
];

export const DEMO_MAPPING_CONFLICTS: MuhsinaConflictItem[] = [
  {
    id: "conf-1",
    memberId: "BDS-88415",
    memberName: "Tahmina Akter",
    fieldName: "District Allocation",
    bdsistersValue: "Narayanganj",
    muhsinaValue: "Dhaka Central",
    severity: "MEDIUM",
    status: "PENDING_REVIEW",
    detectedAt: "2026-11-18T22:15:00Z",
  },
  {
    id: "conf-2",
    memberId: "BDS-88422",
    memberName: "Sabrina Hossain",
    fieldName: "Wing Role Assignment",
    bdsistersValue: "GENERAL_MEMBER",
    muhsinaValue: "EXECUTIVE",
    severity: "HIGH",
    status: "PENDING_REVIEW",
    detectedAt: "2026-11-18T22:15:00Z",
  },
  {
    id: "conf-3",
    memberId: "BDS-88435",
    memberName: "Farzana Chowdhury",
    fieldName: "Official Contact Phone",
    bdsistersValue: "+880 1711-234567",
    muhsinaValue: "+880 1711-998877",
    severity: "LOW",
    status: "PENDING_REVIEW",
    detectedAt: "2026-11-18T22:15:00Z",
  },
  {
    id: "conf-4",
    memberId: "BDS-88440",
    memberName: "Marium Sultana",
    fieldName: "NID Verification Flag",
    bdsistersValue: "VERIFIED_PASSED",
    muhsinaValue: "PENDING_REVIEW",
    severity: "HIGH",
    status: "RESOLVED_LOCAL",
    detectedAt: "2026-11-17T14:10:00Z",
    resolutionNotes: "Local female officer manual audit confirmed valid biometric smart card.",
  },
];
