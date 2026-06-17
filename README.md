# Fabian Rizky Pratama - Dev-Control Dashboard Portfolio

Dashboard Portofolio pribadi modern berdesain premium dengan tema ala sistem kontrol developer (Dev-Control Dashboard). Dibangun menggunakan Astro v5, React 19, dan Tailwind CSS v4.

---

## Isi Portofolio

Portofolio ini berisi rangkuman data profesional, keahlian, proyek-proyek yang telah dikembangkan, serta integrasi data real-time:

- **Ringkasan Profil (Overview)**: Memuat kartu informasi profil singkat, status ketersediaan kerja secara real-time, digital clock dinamis, serta status operasional sistem.
- **Daftar Portofolio Proyek (Projects)**: Halaman interaktif yang menampilkan katalog proyek yang pernah dikembangkan (termasuk Leafly Tea, Lost Formula, Web App Kegiatan Guru, Kedai Cendana, Instagram Clone, dan Website Manajemen Sekolah) lengkap dengan filter kategori, pencarian, dan modal detail proyek.
- **Grafik Tech Stack (Skills)**: Menampilkan visualisasi tingkat kemahiran teknologi pengembangan perangkat lunak (seperti Laravel, PHP, PostgreSQL, Flutter, Dart, Godot Engine, dan WordPress) menggunakan progress bar interaktif.
- **Statistik GitHub (GitHub Stats)**: Menampilkan total repositori, jumlah bintang (stars), garpu (forks), dan total kontribusi GitHub tahunan secara real-time dengan optimasi cache sessionStorage.
- **Sistem Tiket Dukungan (Contact Us)**: Formulir kontak bertema formulir tiket bantuan teknis untuk mengirimkan pesan langsung ke email pribadi terintegrasi EmailJS API.

---

## Struktur Proyek

```text
/
├── legacy-v1/              # Arsip kode portofolio statis versi lama
├── public/                 # File statis (Gambar, favicon, aset ikon)
├── src/
│   ├── components/
│   │   └── react/          # Komponen UI interaktif (React 19)
│   │       ├── DashboardContainer.tsx   # Pengatur navigasi tab dan grid bento layout
│   │       ├── Sidebar.tsx              # Profil, status ketersediaan, navigasi, dan toggle tema
│   │       ├── Header.tsx               # Jam digital dan status operasional sistem
│   │       ├── GithubStats.tsx          # Statistik real-time repositori & kontribusi GitHub
│   │       ├── ProjectsView.tsx         # Katalog portofolio proyek interaktif & detail modal
│   │       ├── SkillsChart.tsx          # Visualisasi progress meter tech stack
│   │       ├── TicketContact.tsx        # Formulir Support Ticket terintegrasi EmailJS
│   │       └── GooeyToast.tsx           # Notifikasi dengan efek cairan (gooey fluid)
│   ├── layouts/
│   │   └── Layout.astro    # Layout dasar HTML (SEO, script tema, filter gooey SVG)
│   ├── pages/
│   │   └── index.astro     # Halaman dashboard utama
│   └── styles/
│       └── global.css      # Konfigurasi Tailwind CSS v4 & variabel warna tema
├── package.json            # Dependensi dan script proyek
└── astro.config.mjs        # Konfigurasi integrasi Astro (React & Tailwind)
```

---

## Kontak

Untuk pertanyaan, kolaborasi, atau peluang kerja sama, silakan hubungi saya melalui:
- Email: dev@sukamcd.tech
- GitHub: [github.com/SukaMCD](https://github.com/SukaMCD)
- LinkedIn: [linkedin.com/in/fabian-rizky-pratama](https://linkedin.com/in/fabian-rizky-pratama)
- Instagram: [@sukamcd.dev](https://instagram.com/sukamcd.dev)

---

Copyright by SukaMCD
