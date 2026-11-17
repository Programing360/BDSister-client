/**
 * BDSisters.org - Admin Profile Management Mock Data
 * Step 5: Member Profile Management & Approval System (Frontend Only)
 *
 * NOTE: STRICT FRONTEND SIMULATION DATASET
 * Profiles, approval statuses, and review logs are fictional simulation records
 * for administrative interface validation. Zero persistent database operations.
 */

import type {
  AdminProfileItem,
  ProfileKpiData,
  ProfileApprovalStatus,
} from "../types/admin-profile.ts";

export const DEMO_PROFILES_DISCLAIMER =
  "SIMULATED PROFILE HUB: Member profile records, public visibility badges, and administrative moderation logs are isolated demonstration datasets. Real persistence and verification will be integrated during the backend phase.";

export const DEMO_PROFILE_KPIS: ProfileKpiData = {
  totalProfiles: 2537,
  publishedProfiles: 2180,
  pendingApproval: 142,
  rejectedProfiles: 38,
  draftProfiles: 115,
  reportedProfiles: 18,
  featuredProfiles: 24,
  changesRequestedCount: 44,
};

export const DEMO_ADMIN_PROFILES: AdminProfileItem[] = [
  // 1. Nusrat Jahan Chowdhury (Published, Featured, Verified, Business Owner)
  {
    id: "prof_301",
    memberId: "BDS-MEM-10492",
    userId: "user_nusrat_jahan",
    fullName: "Nusrat Jahan Chowdhury",
    professionalName: "Nusrat Chowdhury Jamdani",
    headline: "Master Jamdani Weaver & Heritage Textile Revivalist",
    profession: "Heritage Textile Designer",
    occupation: "Master Weaver & Founder",
    industry: "Handloom & Craft Heritage",
    category: "Fashion & Lifestyle",
    avatar: "/demo/avatars/nusrat.jpg",
    coverImage: "/demo/covers/jamdani-loom.jpg",
    bio: "Honoring 3 generations of Dhakai Jamdani heritage weaving in Sonargaon, Narayanganj. Empowering 85 village craftswomen with fair wages, sustainable botanical dyed yarns, and modern modest fashion cuts.",
    email: "nusrat.jahan@nilambari.bd",
    phone: "+880 1712-345678",
    location: {
      address: "House 14, Road 7, Sector 3, Uttara",
      city: "Dhaka",
      district: "Dhaka",
      division: "Dhaka",
      country: "Bangladesh",
    },
    education: [
      {
        id: "edu_1",
        institution: "National Institute of Textile Engineering and Research (NITER)",
        degree: "B.Sc. in Textile Engineering & Design",
        startDate: "2015",
        endDate: "2019",
        current: false,
        description: "Specialized in natural dye extractions and heritage Jacquard loom techniques.",
      },
    ],
    experience: [
      {
        id: "exp_1",
        company: "Nilambari Craft Collective",
        role: "Founder & Creative Director",
        location: "Narayanganj & Dhaka",
        startDate: "2020-03",
        current: true,
        description: "Directing 85 female artisan weavers, export quality control, and national exhibitions.",
      },
      {
        id: "exp_2",
        company: "Aarong Bangladesh",
        role: "Senior Textile Quality Associate",
        location: "Dhaka",
        startDate: "2019-01",
        endDate: "2020-02",
        current: false,
        description: "Evaluated handloom weave density and export certification standards.",
      },
    ],
    skills: [
      { id: "sk_1", name: "Jamdani Motif Drafting", category: "Vocational & Crafts", level: "EXPERT", endorsedCount: 42 },
      { id: "sk_2", name: "Botanical Dye Chemistry", category: "Technical", level: "EXPERT", endorsedCount: 38 },
      { id: "sk_3", name: "Fair Trade Collective Leadership", category: "Business & Entrepreneurship", level: "EXPERT", endorsedCount: 29 },
      { id: "sk_4", name: "Adobe Illustrator Textile CAD", category: "Software", level: "INTERMEDIATE", endorsedCount: 15 },
    ],
    interests: ["Heritage Weaving", "Slow Fashion", "Rural Women Financial Literacy", "Museum Textile Conservation"],
    languages: [
      { language: "Bengali", proficiency: "NATIVE" },
      { language: "English", proficiency: "FLUENT" },
    ],
    socialLinks: {
      website: "https://nilambari.bd",
      facebook: "https://facebook.com/nilambari.crafts",
      instagram: "https://instagram.com/nilambari.heritage",
      linkedin: "https://linkedin.com/in/nusrat-jahan-textiles",
    },
    privacySettings: {
      profileVisibility: "PUBLIC",
      showEmail: false,
      showPhone: false,
      showLocation: true,
      showEducation: true,
      showExperience: true,
      showSkills: true,
      showSocialLinks: true,
    },
    approvalStatus: "PUBLISHED",
    verificationStatus: "VERIFIED",
    profileVisibility: "PUBLIC",
    isFeatured: true,
    featuredOrder: 1,
    featuredDate: "2026-11-01",
    reviewPriority: "NORMAL",
    business: {
      hasBusiness: true,
      businessId: "biz_101",
      businessName: "Nilambari Crafts & Heritage Loom",
      businessCategory: "Handicrafts & Handloom",
      businessSlug: "nilambari-crafts",
      tradeLicenseVerified: true,
      shopUrl: "/shops/nilambari-crafts",
    },
    profileCompletion: 100,
    submittedAt: "2026-09-12 10:30",
    lastUpdated: "2026-11-14 16:45",
    approvedAt: "2026-09-13 14:20",
    approvedBy: "Platform Administrator (Salma)",
    reportsCount: 0,
  },

  // 2. Dr. Mahmuda Khanam (Published, Verified, Healthcare)
  {
    id: "prof_302",
    memberId: "BDS-MEM-10489",
    userId: "user_mahmuda_khanam",
    fullName: "Dr. Mahmuda Khanam",
    professionalName: "Dr. Mahmuda",
    headline: "Ayurvedic Physician & Organic Herbal Formulator",
    profession: "Physician & Herbal Researcher",
    occupation: "Chief Medical Officer",
    industry: "Healthcare & Herbal Wellness",
    category: "Healthcare & Wellness",
    avatar: null,
    coverImage: null,
    bio: "MBBS, MD in Complementary Herbal Medicine. Practicing clinical wellness in Sylhet with a passion for integrating indigenous tea garden medicinal flora into safe herbal skincare and tea infusions.",
    email: "dr.mahmuda@sylhetherbs.com",
    phone: "+880 1819-876543",
    location: {
      address: "Zindabazar Medical Enclave",
      city: "Sylhet",
      district: "Sylhet",
      division: "Sylhet",
      country: "Bangladesh",
    },
    education: [
      {
        id: "edu_2",
        institution: "Sylhet MAG Osmani Medical College",
        degree: "MBBS",
        startDate: "2010",
        endDate: "2016",
        current: false,
      },
    ],
    experience: [
      {
        id: "exp_3",
        company: "Sylhet Natural Botanicals",
        role: "Managing Director",
        location: "Sylhet",
        startDate: "2021-06",
        current: true,
        description: "Formulating GMP certified organic herbal extracts and essential oils.",
      },
    ],
    skills: [
      { id: "sk_5", name: "Clinical Phytotherapy", category: "Professional", level: "EXPERT", endorsedCount: 31 },
      { id: "sk_6", name: "Good Manufacturing Practice (GMP)", category: "Technical", level: "EXPERT", endorsedCount: 22 },
      { id: "sk_7", name: "Integrative Health Counseling", category: "Subject Expertise", level: "EXPERT", endorsedCount: 19 },
    ],
    interests: ["Medicinal Plants", "Women Preventative Health", "Ethnobotanical Fieldwork"],
    languages: [
      { language: "Bengali", proficiency: "NATIVE" },
      { language: "English", proficiency: "FLUENT" },
      { language: "Sylheti", proficiency: "NATIVE" },
    ],
    socialLinks: {
      website: "https://sylhetherbs.com",
      linkedin: "https://linkedin.com/in/dr-mahmuda-khanam",
    },
    privacySettings: {
      profileVisibility: "PUBLIC",
      showEmail: true,
      showPhone: false,
      showLocation: true,
      showEducation: true,
      showExperience: true,
      showSkills: true,
      showSocialLinks: true,
    },
    approvalStatus: "PUBLISHED",
    verificationStatus: "VERIFIED",
    profileVisibility: "PUBLIC",
    isFeatured: true,
    featuredOrder: 2,
    featuredDate: "2026-11-05",
    reviewPriority: "NORMAL",
    business: {
      hasBusiness: true,
      businessId: "biz_103",
      businessName: "Sylhet Natural Botanicals",
      businessCategory: "Health & Organic Wellness",
      businessSlug: "sylhet-natural-botanicals",
      tradeLicenseVerified: true,
      shopUrl: "/shops/sylhet-natural-botanicals",
    },
    profileCompletion: 95,
    submittedAt: "2026-08-20 11:15",
    lastUpdated: "2026-11-10 09:30",
    approvedAt: "2026-08-21 16:00",
    approvedBy: "Platform Administrator (Salma)",
    reportsCount: 0,
  },

  // 3. Sabrina Akter (Pending Review, Creative & Design)
  {
    id: "prof_303",
    memberId: "BDS-MEM-10490",
    userId: "user_sabrina_akter",
    fullName: "Sabrina Akter",
    professionalName: "Sabrina Clay Studio",
    headline: "Contemporary Terracotta Ceramicist & Clay Sculptor",
    profession: "Terracotta Ceramicist",
    occupation: "Ceramic Artist",
    industry: "Fine Arts & Terracotta Pottery",
    category: "Creative & Design",
    avatar: null,
    coverImage: null,
    bio: "Pioneering eco-friendly terracotta dining ware and artisanal decorative tiles in Bogura. Training young girls in wheel throwing, kiln firing, and non-toxic glazing.",
    email: "sabrina.akter@clayart.com",
    phone: "+880 1913-223344",
    location: {
      address: "Pottery Lane, Sherpur Road",
      city: "Bogura",
      district: "Bogura",
      division: "Rajshahi",
      country: "Bangladesh",
    },
    education: [
      {
        id: "edu_3",
        institution: "Faculty of Fine Arts, University of Rajshahi",
        degree: "BFA in Ceramics & Sculpture",
        startDate: "2017",
        endDate: "2021",
        current: false,
      },
    ],
    experience: [
      {
        id: "exp_4",
        company: "Matir Maya Ceramic Studio",
        role: "Lead Potter",
        location: "Bogura",
        startDate: "2022-01",
        current: true,
      },
    ],
    skills: [
      { id: "sk_8", name: "Wheel Throwing", category: "Vocational & Crafts", level: "EXPERT", endorsedCount: 16 },
      { id: "sk_9", name: "Kiln Temperature Control", category: "Technical", level: "INTERMEDIATE", endorsedCount: 12 },
      { id: "sk_10", name: "Lead-Free Glaze Formulation", category: "Subject Expertise", level: "EXPERT", endorsedCount: 14 },
    ],
    interests: ["Ceramics", "Eco-friendly Tableware", "Clay Architectural Murals"],
    languages: [{ language: "Bengali", proficiency: "NATIVE" }],
    socialLinks: {
      instagram: "https://instagram.com/sabrina.clayart",
      facebook: "https://facebook.com/matir.maya.bogura",
    },
    privacySettings: {
      profileVisibility: "PUBLIC",
      showEmail: false,
      showPhone: false,
      showLocation: true,
      showEducation: true,
      showExperience: true,
      showSkills: true,
      showSocialLinks: true,
    },
    approvalStatus: "PENDING_REVIEW",
    verificationStatus: "UNDER_REVIEW",
    profileVisibility: "PUBLIC",
    isFeatured: false,
    reviewPriority: "HIGH",
    business: {
      hasBusiness: true,
      businessId: "biz_102",
      businessName: "Matir Maya Clay Art & Terracotta Studio",
      businessCategory: "Pottery & Terracotta",
      businessSlug: "matir-maya-pottery",
      tradeLicenseVerified: false,
    },
    profileCompletion: 85,
    submittedAt: "2026-11-15 14:00",
    lastUpdated: "2026-11-15 14:00",
    reportsCount: 0,
  },

  // 4. Farzana Yasmin (Under Review, Agriculture & Agro)
  {
    id: "prof_304",
    memberId: "BDS-MEM-10491",
    userId: "user_farzana_yasmin",
    fullName: "Farzana Yasmin",
    headline: "Mangrove Sundarbans Honey Harvester & Forest Conservationist",
    profession: "Agro-forestry Entrepreneur",
    occupation: "Collective Coordinator",
    industry: "Organic Food & Apiculture",
    category: "Agriculture & Agro-processing",
    avatar: null,
    bio: "Working with traditional 'Mawali' honey gatherer families in Khulna to establish ethical, wild-harvested raw Sundarbans mangrove flower honey with scientific moisture testing.",
    email: "farzana.honey@sundarbans.org",
    phone: "+880 1515-998877",
    location: {
      city: "Khulna",
      district: "Khulna",
      division: "Khulna",
      country: "Bangladesh",
    },
    education: [],
    experience: [
      {
        id: "exp_5",
        company: "Sundarbans Wild Pure Honey Collective",
        role: "Project Director",
        startDate: "2021-08",
        current: true,
      },
    ],
    skills: [
      { id: "sk_11", name: "Sustainable Apiculture", category: "Vocational & Crafts", level: "EXPERT" },
      { id: "sk_12", name: "Honey Moisture Refractometry", category: "Technical", level: "INTERMEDIATE" },
    ],
    interests: ["Forest Preservation", "Organic Agro Products", "Mangrove Ecology"],
    languages: [{ language: "Bengali", proficiency: "NATIVE" }],
    socialLinks: {
      facebook: "https://facebook.com/sundarbans.wildhoney",
    },
    privacySettings: {
      profileVisibility: "MEMBERS_ONLY",
      showEmail: false,
      showPhone: false,
      showLocation: true,
      showEducation: false,
      showExperience: true,
      showSkills: true,
      showSocialLinks: true,
    },
    approvalStatus: "UNDER_REVIEW",
    verificationStatus: "VERIFIED",
    profileVisibility: "MEMBERS_ONLY",
    isFeatured: false,
    reviewPriority: "NORMAL",
    business: {
      hasBusiness: true,
      businessName: "Sundarbans Pure Honey & Agro Farm",
      businessCategory: "Food & Organic Produce",
      tradeLicenseVerified: true,
    },
    profileCompletion: 75,
    submittedAt: "2026-11-14 09:20",
    lastUpdated: "2026-11-16 11:30",
    internalNotes: "Verification document verified. Waiting for business trade license scan clarity.",
    reportsCount: 0,
  },

  // 5. Tahmina Anam (Changes Requested, Culinary Arts)
  {
    id: "prof_305",
    memberId: "BDS-MEM-10486",
    userId: "user_tahmina_anam",
    fullName: "Tahmina Anam",
    headline: "Artisanal Baker & Traditional Pitha Curator",
    profession: "Culinary Entrepreneur",
    occupation: "Master Pastry Chef",
    industry: "Culinary Arts & Confectionery",
    category: "Culinary Arts & Organic Food",
    avatar: null,
    bio: "Pioneering heritage Bangladeshi seasonal pitha boxes and wedding sweets using organic date palm jaggery (Khejurer Gur) sourced directly from Jessore.",
    email: "tahmina.culinary@dhaka.com",
    phone: "+880 1616-554433",
    location: {
      city: "Dhaka",
      district: "Dhaka",
      division: "Dhaka",
      country: "Bangladesh",
    },
    education: [],
    experience: [],
    skills: [
      { id: "sk_13", name: "Artisanal Pitha Crafting", category: "Vocational & Crafts", level: "EXPERT" },
      { id: "sk_14", name: "Hygienic Food Packaging", category: "Professional", level: "INTERMEDIATE" },
    ],
    interests: ["Heritage Cuisine", "Baking", "Food Styling"],
    languages: [{ language: "Bengali", proficiency: "NATIVE" }],
    socialLinks: {
      instagram: "https://instagram.com/tahmina.pitha",
    },
    privacySettings: {
      profileVisibility: "PUBLIC",
      showEmail: false,
      showPhone: false,
      showLocation: true,
      showEducation: false,
      showExperience: false,
      showSkills: true,
      showSocialLinks: true,
    },
    approvalStatus: "CHANGES_REQUESTED",
    verificationStatus: "PENDING",
    profileVisibility: "PUBLIC",
    isFeatured: false,
    reviewPriority: "HIGH",
    business: {
      hasBusiness: false,
    },
    profileCompletion: 60,
    submittedAt: "2026-11-12 18:00",
    lastUpdated: "2026-11-13 14:10",
    changesRequestedNote: "Please provide a complete education background or professional training certification in your bio to be approved for public spotlight.",
    changesRequestedDate: "2026-11-13 14:10",
    reportsCount: 0,
  },

  // 6. Rasheda Khatun (Rejected, Misleading Information Report)
  {
    id: "prof_306",
    memberId: "BDS-MEM-10484",
    userId: "user_rasheda_khatun",
    fullName: "Rasheda Khatun",
    headline: "Wholesale Textile Importer & Distributor",
    profession: "Commercial Importer",
    occupation: "Managing Partner",
    industry: "Wholesale Apparel",
    category: "Fashion & Lifestyle",
    avatar: null,
    bio: "Bulk distributor claiming to be a handmade indigenous weaver collective in Rangamati. Products found to be imported mass-manufactured polyester prints.",
    email: "rasheda.apparel@chittagong.bd",
    phone: "+880 1718-001122",
    location: {
      city: "Chattogram",
      district: "Chattogram",
      division: "Chattogram",
      country: "Bangladesh",
    },
    education: [],
    experience: [],
    skills: [],
    interests: [],
    languages: [{ language: "Bengali", proficiency: "NATIVE" }],
    socialLinks: {},
    privacySettings: {
      profileVisibility: "PRIVATE",
      showEmail: false,
      showPhone: false,
      showLocation: false,
      showEducation: false,
      showExperience: false,
      showSkills: false,
      showSocialLinks: false,
    },
    approvalStatus: "REJECTED",
    verificationStatus: "REJECTED",
    profileVisibility: "PRIVATE",
    isFeatured: false,
    reviewPriority: "LOW",
    business: {
      hasBusiness: true,
      businessName: "Rasheda Trade International",
      tradeLicenseVerified: false,
    },
    profileCompletion: 40,
    submittedAt: "2026-10-18 16:30",
    lastUpdated: "2026-10-20 11:00",
    rejectionReason: "Violated BDSisters Artisan Code of Conduct. Misrepresented imported machine-made synthetic apparel as indigenous handloom craft.",
    rejectionDate: "2026-10-20 11:00",
    rejectedBy: "Platform Administrator (Tasnim)",
    reportsCount: 3,
  },

  // 7. Sadia Rahman (Published, Tech & Software)
  {
    id: "prof_307",
    memberId: "BDS-MEM-10488",
    userId: "user_sadia_rahman",
    fullName: "Sadia Rahman",
    headline: "Full-Stack Web Architect & Open Source Contributor",
    profession: "Software Engineer",
    occupation: "Senior Frontend Lead",
    industry: "Information Technology",
    category: "Technology & Software",
    avatar: null,
    bio: "Passionate about building performant, accessible web software using Next.js and TypeScript. Dedicated to mentoring young female university students entering tech careers in Bangladesh.",
    email: "sadia.rahman@botanicals.bd",
    phone: "+880 1711-223344",
    location: {
      city: "Dhaka",
      district: "Dhaka",
      division: "Dhaka",
      country: "Bangladesh",
    },
    education: [
      {
        id: "edu_4",
        institution: "BUET - Bangladesh University of Engineering and Technology",
        degree: "B.Sc. in Computer Science and Engineering",
        startDate: "2016",
        endDate: "2020",
        current: false,
      },
    ],
    experience: [
      {
        id: "exp_6",
        company: "Apex Tech Labs",
        role: "Senior Engineering Lead",
        startDate: "2022-03",
        current: true,
      },
    ],
    skills: [
      { id: "sk_15", name: "Next.js & React 19", category: "Software", level: "EXPERT", endorsedCount: 45 },
      { id: "sk_16", name: "TypeScript Architecture", category: "Technical", level: "EXPERT", endorsedCount: 39 },
      { id: "sk_17", name: "UI/UX Accessibility (WCAG 2.2)", category: "Professional", level: "EXPERT", endorsedCount: 28 },
    ],
    interests: ["Open Source", "Women in STEM", "Mentorship", "Algorithms"],
    languages: [
      { language: "Bengali", proficiency: "NATIVE" },
      { language: "English", proficiency: "FLUENT" },
    ],
    socialLinks: {
      github: "https://github.com/sadia-rahman",
      linkedin: "https://linkedin.com/in/sadia-rahman-dev",
    },
    privacySettings: {
      profileVisibility: "PUBLIC",
      showEmail: true,
      showPhone: false,
      showLocation: true,
      showEducation: true,
      showExperience: true,
      showSkills: true,
      showSocialLinks: true,
    },
    approvalStatus: "PUBLISHED",
    verificationStatus: "VERIFIED",
    profileVisibility: "PUBLIC",
    isFeatured: true,
    featuredOrder: 3,
    featuredDate: "2026-11-08",
    reviewPriority: "NORMAL",
    business: {
      hasBusiness: false,
    },
    profileCompletion: 95,
    submittedAt: "2026-09-01 12:00",
    lastUpdated: "2026-11-12 18:20",
    approvedAt: "2026-09-02 10:15",
    approvedBy: "Super Administrator (Admin Salma)",
    reportsCount: 0,
  },

  // 8. Naila Kabeer (Suspended, Community Impersonation)
  {
    id: "prof_308",
    memberId: "BDS-MEM-10485",
    userId: "user_naila_kabeer",
    fullName: "Naila Kabeer",
    headline: "Freelance Graphic Designer & Brand Consultant",
    profession: "Graphic Designer",
    occupation: "Freelancer",
    industry: "Creative & Design",
    category: "Creative & Design",
    avatar: null,
    bio: "Logo design, branding collaterals, and social media post designs for startup business sisters.",
    email: "naila.kabeer@designstudio.bd",
    phone: "+880 1818-445566",
    location: {
      city: "Dhaka",
      district: "Dhaka",
      division: "Dhaka",
      country: "Bangladesh",
    },
    education: [],
    experience: [],
    skills: [
      { id: "sk_18", name: "Canva & Figma Design", category: "Software", level: "INTERMEDIATE" },
    ],
    interests: ["Logo Design", "Typography"],
    languages: [{ language: "Bengali", proficiency: "NATIVE" }],
    socialLinks: {},
    privacySettings: {
      profileVisibility: "PRIVATE",
      showEmail: false,
      showPhone: false,
      showLocation: false,
      showEducation: false,
      showExperience: false,
      showSkills: false,
      showSocialLinks: false,
    },
    approvalStatus: "SUSPENDED",
    verificationStatus: "NOT_SUBMITTED",
    profileVisibility: "PRIVATE",
    isFeatured: false,
    reviewPriority: "URGENT",
    business: {
      hasBusiness: false,
    },
    profileCompletion: 50,
    submittedAt: "2026-10-05 14:00",
    lastUpdated: "2026-11-08 09:40",
    suspendedReason: "Suspended pending investigation following multiple member reports of copied portfolio designs and unsolicited commercial spam.",
    reportsCount: 4,
  },

  // 9. Afroza Begum (Draft, Education & Mentorship)
  {
    id: "prof_309",
    memberId: "BDS-MEM-10483",
    userId: "user_afroza_begum",
    fullName: "Afroza Begum",
    headline: "Vocational Tailoring Instructor & Community Organizer",
    profession: "Vocational Trainer",
    occupation: "Community Instructor",
    industry: "Education & Skills Training",
    category: "Education & Mentorship",
    avatar: null,
    bio: "Teaching pattern drafting, basic sewing machine repair, and embroidery to underprivileged village women in Rangpur.",
    email: "afroza.trainer@rangpur.edu",
    phone: "+880 1714-778899",
    location: {
      city: "Rangpur",
      district: "Rangpur",
      division: "Rangpur",
      country: "Bangladesh",
    },
    education: [],
    experience: [],
    skills: [
      { id: "sk_19", name: "Apparel Pattern Drafting", category: "Vocational & Crafts", level: "EXPERT" },
      { id: "sk_20", name: "Community Workshop Facilitation", category: "Professional", level: "EXPERT" },
    ],
    interests: ["Vocational Literacy", "Rural Skills"],
    languages: [{ language: "Bengali", proficiency: "NATIVE" }],
    socialLinks: {},
    privacySettings: {
      profileVisibility: "MEMBERS_ONLY",
      showEmail: false,
      showPhone: false,
      showLocation: true,
      showEducation: false,
      showExperience: false,
      showSkills: true,
      showSocialLinks: false,
    },
    approvalStatus: "DRAFT",
    verificationStatus: "NOT_SUBMITTED",
    profileVisibility: "MEMBERS_ONLY",
    isFeatured: false,
    reviewPriority: "LOW",
    business: {
      hasBusiness: false,
    },
    profileCompletion: 60,
    submittedAt: "2026-11-16 17:00",
    lastUpdated: "2026-11-16 17:00",
    reportsCount: 0,
  },

  // 10. Shaila Sharmin (Pending Review, Finance & Accounting)
  {
    id: "prof_310",
    memberId: "BDS-MEM-10482",
    userId: "user_shaila_sharmin",
    fullName: "Shaila Sharmin",
    headline: "Chartered Financial Analyst & Small Business Bookkeeping Consultant",
    profession: "Financial Consultant",
    occupation: "Consultant & Certified Accountant",
    industry: "Finance & Taxation",
    category: "Finance & Accounting",
    avatar: null,
    bio: "Helping female startup founders and cottage entrepreneurs structure clean bookkeeping, VAT registration, trade license compliance, and bank loan readiness.",
    email: "shaila.sharmin@finadvisors.bd",
    phone: "+880 1817-334455",
    location: {
      city: "Dhaka",
      district: "Dhaka",
      division: "Dhaka",
      country: "Bangladesh",
    },
    education: [
      {
        id: "edu_5",
        institution: "University of Dhaka",
        degree: "BBA & MBA in Accounting & Information Systems",
        startDate: "2014",
        endDate: "2019",
        current: false,
      },
    ],
    experience: [
      {
        id: "exp_7",
        company: "KPMG Bangladesh",
        role: "Senior Audit Associate",
        startDate: "2019",
        endDate: "2022",
        current: false,
      },
      {
        id: "exp_8",
        company: "Shaila Accounting Services",
        role: "Principal Advisor",
        startDate: "2022-04",
        current: true,
      },
    ],
    skills: [
      { id: "sk_21", name: "QuickBooks & Xero Accounting", category: "Software", level: "EXPERT", endorsedCount: 33 },
      { id: "sk_22", name: "NBR VAT & Tax Filing", category: "Subject Expertise", level: "EXPERT", endorsedCount: 29 },
      { id: "sk_23", name: "SME Cashflow Modeling", category: "Business & Entrepreneurship", level: "EXPERT", endorsedCount: 24 },
    ],
    interests: ["Financial Literacy", "Tax Reform", "Women Investor Circles"],
    languages: [
      { language: "Bengali", proficiency: "NATIVE" },
      { language: "English", proficiency: "FLUENT" },
    ],
    socialLinks: {
      linkedin: "https://linkedin.com/in/shaila-sharmin-finance",
      website: "https://finadvisors.bd",
    },
    privacySettings: {
      profileVisibility: "PUBLIC",
      showEmail: true,
      showPhone: false,
      showLocation: true,
      showEducation: true,
      showExperience: true,
      showSkills: true,
      showSocialLinks: true,
    },
    approvalStatus: "PENDING_REVIEW",
    verificationStatus: "VERIFIED",
    profileVisibility: "PUBLIC",
    isFeatured: false,
    reviewPriority: "HIGH",
    business: {
      hasBusiness: true,
      businessName: "Shaila Accounting & Financial Advisory",
      businessCategory: "Professional Services",
      tradeLicenseVerified: true,
    },
    profileCompletion: 90,
    submittedAt: "2026-11-16 08:45",
    lastUpdated: "2026-11-16 08:45",
    reportsCount: 0,
  },
];

// Helper Lookups
export function getAdminProfileById(id: string): AdminProfileItem | undefined {
  if (!id) return undefined;
  const normalized = id.toLowerCase();
  return DEMO_ADMIN_PROFILES.find(
    (p) =>
      p.id.toLowerCase() === normalized ||
      p.memberId.toLowerCase() === normalized ||
      p.userId.toLowerCase() === normalized
  );
}

export function getAdminProfilesByStatus(status: ProfileApprovalStatus): AdminProfileItem[] {
  return DEMO_ADMIN_PROFILES.filter((p) => p.approvalStatus === status);
}

export function getFeaturedProfiles(): AdminProfileItem[] {
  return DEMO_ADMIN_PROFILES.filter((p) => p.isFeatured).sort(
    (a, b) => (a.featuredOrder || 99) - (b.featuredOrder || 99)
  );
}

export function calculateProfileCompletenessScore(profile: AdminProfileItem): {
  percentage: number;
  breakdown: { label: string; completed: boolean; weight: number }[];
} {
  const breakdown = [
    {
      label: "Basic Information",
      completed: Boolean(profile.fullName && profile.profession && profile.headline),
      weight: 15,
    },
    {
      label: "Profile Photo",
      completed: Boolean(profile.avatar),
      weight: 10,
    },
    {
      label: "About Me Story",
      completed: Boolean(profile.bio && profile.bio.trim().length >= 20),
      weight: 15,
    },
    {
      label: "Professional Details",
      completed: Boolean(profile.occupation && profile.industry && (profile.location?.city || profile.location?.district)),
      weight: 15,
    },
    {
      label: "Education Credentials",
      completed: Boolean(profile.education && profile.education.length > 0),
      weight: 10,
    },
    {
      label: "Skills & Expertise",
      completed: Boolean(profile.skills && profile.skills.length > 0),
      weight: 15,
    },
    {
      label: "Career Experience",
      completed: Boolean(profile.experience && profile.experience.length > 0),
      weight: 10,
    },
    {
      label: "Social & Portfolio Links",
      completed: Boolean(
        profile.socialLinks &&
        (profile.socialLinks.website ||
          profile.socialLinks.linkedin ||
          profile.socialLinks.facebook ||
          profile.socialLinks.instagram ||
          profile.socialLinks.github)
      ),
      weight: 10,
    },
  ];

  const percentage = breakdown.reduce(
    (acc, item) => (item.completed ? acc + item.weight : acc),
    0
  );

  return { percentage, breakdown };
}
