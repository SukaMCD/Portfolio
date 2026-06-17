export interface Project {
  title: string;
  category: string;
  date: string;
  description: string;
  tags: string[];
  links: { label: string; url: string }[];
  image: string;
  alt: string;
}

export const featuredProjects: Project[] = [
  {
    title: "Leafly Tea",
    category: "E-Commerce",
    date: "23 Apr, 2025",
    description:
      "Leafly Tea adalah website e-commerce yang dibuat untuk menjual produk-produk dari brand Leafly Tea. Website ini dibangun menggunakan PHP, HTML, CSS, dan JavaScript, serta menggunakan MySQL sebagai database.",
    tags: ["E-Commerce", "PHP", "MySQL", "Bootstrap"],
    links: [
      { label: "View Project", url: "https://github.com/SukaMCD/LeaflyTea" },
      {
        label: "Leafly Tea Demo",
        url: "https://budiluhurdigital.com/project/10RPL/LeaflyTea/",
      },
    ],
    image: "/image/imgporto1.webp",
    alt: "Screenshot website e-commerce Leafly Tea",
  },
  {
    title: "Lost Formula: A Forest Mystery",
    category: "Game Dev",
    date: "15 Mar, 2025",
    description:
      "Lost Formula: A Forest Mystery adalah proyek game dengan genre top-down adventure yang dikembangkan menggunakan Godot Engine 4. Game ini menghadirkan pengalaman eksplorasi serta narasi yang penuh teka-teki.",
    tags: ["Game Dev", "Godot Engine", "Adventure", "Top-down"],
    links: [
      { label: "View Project", url: "https://github.com/SukaMCD/lost-formula" },
      {
        label: "Lost Formula Demo",
        url: "https://sukamcd.itch.io/lost-formula-a-forest-mystery",
      },
    ],
    image: "/image/imgporto2.webp",
    alt: "Screenshot gameplay Lost Formula Godot Engine",
  },
  {
    title: "Web App Kegiatan Guru",
    category: "Web Application",
    date: "06 Aug, 2025",
    description:
      "Mengembangkan Web App manajemen kegiatan guru berbasis PHP dengan database PostgreSQL, yang berfokus pada perencanaan, pengelolaan, dan monitoring kegiatan guru.",
    tags: ["PHP", "PostgreSQL", "Management Tool", "Backend"],
    links: [
      {
        label: "View Project",
        url: "https://github.com/SukaMCD/Aplikasi-Guru",
      },
    ],
    image: "/image/imgporto3.webp",
    alt: "Interface Web App Kegiatan Guru PHP PostgreSQL",
  },
  {
    title: "Kedai Cendana",
    category: "Laravel",
    date: "06 Sep, 2025",
    description:
      "Website Kedai Cendana dibangun menggunakan Laravel dengan Filament sebagai panel admin dan PostgreSQL sebagai basis data, serta mendukung login menggunakan akun Google.",
    tags: ["Laravel", "PostgreSQL", "Filament", "Google Auth", "Firebase"],
    links: [
      { label: "View Project", url: "https://github.com/SukaMCD/Beasiswa" },
      { label: "Kedai Cendana Demo", url: "https://kedaicendana.my.id" },
    ],
    image: "/image/imgporto4.webp",
    alt: "Dashboard Laravel Kedai Cendana dengan Filament",
  },
  {
    title: "Instagram Clone Project",
    category: "Flutter",
    date: "11 Nov, 2025",
    description:
      "Instagram Clone adalah aplikasi mobile sederhana yang dibuat menggunakan Flutter dan Dart. Aplikasi ini menampilkan feed pengguna, fitur unggah foto, like, dan komentar.",
    tags: ["Flutter", "Dart", "Material Design", "Mobile App"],
    links: [
      {
        label: "View Project",
        url: "https://github.com/ieatcheese99/Instagram.git",
      },
    ],
    image: "/image/imgporto5.webp",
    alt: "Aplikasi Mobile Instagram Clone menggunakan Flutter",
  },
  {
    title: "Website Manajemen Sekolah",
    category: "WordPress",
    date: "30 Jan, 2025",
    description:
      "Website ini dibuat sebagai media informasi resmi untuk SD Ceria Timoho Yogyakarta dan SMP Budi Luhur menggunakan platform WordPress untuk pengelolaan konten dan tampilan.",
    tags: ["WordPress", "CMS", "School Management", "Web Design"],
    links: [
      { label: "SD Ceria", url: "https://timoho.ceria.sch.id" },
      { label: "SMP Budi Luhur", url: "https://smp.sekolahbudiluhur.sch.id" },
    ],
    image: "/image/imgporto6.webp",
    alt: "Tampilan Website Manajemen Sekolah berbasis WordPress",
  },
];
