export interface Project {
  id: string;
  title: string;
  category: string;
  tagline: string;
  description: string;
  year: string;
  tags: string[];
  metrics: { label: string; value: string }[];
  image: string;
  links: { label: string; url: string }[];
  featured?: boolean;
}

export interface SkillDomain {
  domain: string;
  description: string;
  skills: { name: string; level: string; icon?: string; highlighted?: boolean }[];
}

export const PORTFOLIO_PROJECTS: Project[] = [
  {
    id: "kedai-cendana",
    title: "Kedai Cendana",
    category: "Fullstack Web Application",
    tagline: "High-performance scholarship & culinary management platform engineered with modern enterprise standards.",
    description: "Unified institutional management platform integrating modern Laravel architecture with Filament Admin Panel, indexed PostgreSQL database, and seamless Google OAuth authentication.",
    year: "2025",
    tags: ["Laravel 11", "PostgreSQL", "Filament PHP", "Google Auth", "Tailwind CSS"],
    metrics: [
      { label: "Architecture", value: "Clean MVC" },
      { label: "Database", value: "PostgreSQL Relational" },
      { label: "Security", value: "OAuth 2.0 & RBAC" }
    ],
    image: "/image/imgporto4.webp",
    links: [
      { label: "Live Deployment", url: "https://kedaicendana.my.id" },
      { label: "Source Code", url: "https://github.com/SukaMCD/Beasiswa" }
    ],
    featured: true
  },
  {
    id: "lost-formula",
    title: "Lost Formula: A Forest Mystery",
    category: "Game Dev & Engine Architecture",
    tagline: "Atmospheric top-down narrative adventure featuring procedural puzzles and dynamic environmental physics.",
    description: "Indie game project engineered from scratch using Godot Engine 4. Implements isolated finite state machines, dynamic 2D lighting shaders, and interactive audio systems.",
    year: "2025",
    tags: ["Godot Engine 4", "GDScript", "2D Lighting Shaders", "State Machine", "Game Design"],
    metrics: [
      { label: "Engine", value: "Godot 4.x" },
      { label: "Framerate", value: "60 FPS Locked" },
      { label: "Genre", value: "Top-Down Mystery" }
    ],
    image: "/image/imgporto2.webp",
    links: [
      { label: "Play on Itch.io", url: "https://sukamcd.itch.io/lost-formula-a-forest-mystery" },
      { label: "Repository", url: "https://github.com/SukaMCD/lost-formula" }
    ],
    featured: true
  },
  {
    id: "kegiatan-guru",
    title: "Faculty Activity Management System",
    category: "Enterprise Web App",
    tagline: "Streamlined educator performance monitoring, schedule orchestration, and automated administrative logging.",
    description: "Institutional productivity platform built to streamline daily educator reporting and activity monitoring. Designed with strict relational PostgreSQL schemas ensuring high data integrity.",
    year: "2025",
    tags: ["PHP 8", "PostgreSQL", "RESTful Design", "Admin Dashboard", "Reporting"],
    metrics: [
      { label: "Efficiency", value: "+70% Paperless" },
      { label: "Query Speed", value: "<120ms Indexing" },
      { label: "Role Control", value: "Admin & Teacher" }
    ],
    image: "/image/imgporto3.webp",
    links: [
      { label: "GitHub Code", url: "https://github.com/SukaMCD/Aplikasi-Guru" }
    ],
    featured: true
  },
  {
    id: "instagram-clone",
    title: "Native Android Social Suite",
    category: "Mobile Application",
    tagline: "Reactive social media client built native with Kotlin, reactive data streams, and Material 3 design.",
    description: "Modern Android architectural implementation using Kotlin. Features optimized recycler view performance, asynchronous image pipelines, strict memory management, and fluid UI transitions.",
    year: "2025",
    tags: ["Kotlin", "Android SDK", "Material Design 3", "Coroutines", "MVVM"],
    metrics: [
      { label: "Platform", value: "Android Native" },
      { label: "Architecture", value: "MVVM" },
      { label: "Language", value: "Kotlin" }
    ],
    image: "/image/imgporto5.webp",
    links: [
      { label: "Source Repository", url: "https://github.com/ieatcheese99/Instagram.git" }
    ]
  },
  {
    id: "leafly-tea",
    title: "Leafly Tea Digital Commerce",
    category: "E-Commerce Experience",
    tagline: "Artisanal beverage storefront with frictionless catalog exploration and responsive checkout flows.",
    description: "Boutique e-commerce platform designed for artisanal tea shopping, featuring dynamic catalog filtering, responsive search, and streamlined conversion flows.",
    year: "2024",
    tags: ["PHP", "MySQL", "JavaScript ES6", "Responsive Design", "Checkout Flow"],
    metrics: [
      { label: "Load Performance", value: "Sub-second" },
      { label: "Catalog", value: "Dynamic Filtering" },
      { label: "UX", value: "Mobile Optimized" }
    ],
    image: "/image/imgporto1.webp",
    links: [
      { label: "Live Store Demo", url: "https://budiluhurdigital.com/project/10RPL/LeaflyTea/" },
      { label: "Code Repository", url: "https://github.com/SukaMCD/LeaflyTea" }
    ]
  },
  {
    id: "manajemen-sekolah",
    title: "Budi Luhur Institutional Web Portal",
    category: "Institutional Platform",
    tagline: "Multi-campus digital presence serving thousands of students, teachers, and guardians seamlessly.",
    description: "Public institutional web architecture for SD Ceria Timoho and SMP Budi Luhur featuring comprehensive SEO optimization, modern security hardening, and intuitive content management.",
    year: "2025",
    tags: ["WordPress Headless / CMS", "PHP", "SEO Mastery", "Security Hardening"],
    metrics: [
      { label: "Traffic", value: "10k+ Monthly Visits" },
      { label: "Uptime", value: "99.9%" },
      { label: "SEO Score", value: "95+" }
    ],
    image: "/image/imgporto6.webp",
    links: [
      { label: "SD Ceria Portal", url: "https://timoho.ceria.sch.id" },
      { label: "SMP Budi Luhur Portal", url: "https://smp.sekolahbudiluhur.sch.id" }
    ]
  }
];

export const TECH_DOMAINS: SkillDomain[] = [
  {
    domain: "Backend & Systems",
    description: "Engineering robust data architectures, structured APIs, and high-performance server logic.",
    skills: [
      { name: "Laravel", level: "Advanced", highlighted: true },
      { name: "PHP 8+", level: "Advanced", highlighted: true },
      { name: "PostgreSQL", level: "Proficient", highlighted: true },
      { name: "MySQL / MariaDB", level: "Proficient" },
      { name: "RESTful APIs", level: "Advanced" },
      { name: "Firebase", level: "Proficient" }
    ]
  },
  {
    domain: "Frontend & Interfaces",
    description: "Designing interactive interfaces, cinematic motion transitions, and responsive layouts.",
    skills: [
      { name: "React.js", level: "Proficient", highlighted: true },
      { name: "TypeScript", level: "Proficient", highlighted: true },
      { name: "Tailwind CSS", level: "Advanced", highlighted: true },
      { name: "Framer Motion", level: "Proficient" },
      { name: "Astro", level: "Proficient" },
      { name: "JavaScript (ESNext)", level: "Advanced" }
    ]
  },
  {
    domain: "Native & Engine Dev",
    description: "Developing native mobile applications and interactive game engine architectures.",
    skills: [
      { name: "Godot Engine 4", level: "Proficient", highlighted: true },
      { name: "GDScript", level: "Proficient" },
      { name: "Kotlin", level: "Intermediate", highlighted: true },
      { name: "Android Studio", level: "Intermediate" },
      { name: "Git & GitHub CI", level: "Advanced" },
      { name: "Figma UI/UX", level: "Proficient" }
    ]
  }
];

export const MILESTONES = [
  {
    year: "2024 — Present",
    role: "Software Engineering Student",
    organization: "SMK Budi Luhur",
    description: "Deep technical focus on Software Engineering, structured algorithms, relational database architectures, and modern web systems."
  },
  {
    year: "2025",
    role: "Fullstack Developer & System Architect",
    organization: "Kedai Cendana & Institutional Projects",
    description: "Designed and deployed Laravel and PostgreSQL management systems to cloud production environments."
  },
  {
    year: "2025",
    role: "Independent Game Programmer",
    organization: "Lost Formula Release",
    description: "Published top-down mystery game 'Lost Formula' on Itch.io, receiving strong positive reception from the indie dev community."
  }
];
