# Portfolio Website

Portfolio website pribadi untuk menampilkan proyek, blog, dan informasi tentang Fabian Rizky Pratama. Website ini dibangun dengan desain modern, interaktif, dan responsif.

🌐 **Live Website**: [fabiandev.my.id](https://fabiandev.my.id)

## Fitur

- **Responsive Design** - Optimal di desktop, tablet, dan mobile
- **Modern UI/UX** - Desain glassmorphism dengan efek neon
- **Interactive Cursor Effects** - Cursor glow dan click spark effects
- **Smooth Animations** - Animasi scroll dan transisi yang halus
- **Portfolio Showcase** - Menampilkan proyek-proyek dengan filter kategori
- **Blog Section** - Artikel tentang teknologi dan development
- **Contact Form** - Form kontak terintegrasi dengan EmailJS
- **Maintenance Mode** - Mode maintenance yang dapat diaktifkan
<!-- **Easter Egg** -->

## Teknologi yang Digunakan

### Frontend

- **HTML5** - Struktur website
- **CSS3** - Styling dengan glassmorphism dan neon effects
- **JavaScript (Vanilla)** - Interaktivitas dan logika
- **jQuery** - DOM manipulation dan event handling
- **Bootstrap 4.5.3** - Framework CSS untuk responsive design
- **AOS (Animate On Scroll)** - Library animasi scroll
- **Slick Carousel** - Carousel untuk portfolio dan blog

### Backend & Tools

- **EmailJS** - Service untuk mengirim email dari form kontak
- **Git** - Version control
- **GitHub Pages** - Hosting dan deployment

<!-- ## 📁 Struktur Folder

```
Portofolio/
├── assets/              # File assets (CV, cursor files)
│   ├── CV_Fabian_Rizky_Pratama.pdf
│   └── light/           # Custom cursor files
├── database/            # Data untuk portfolio dan blog
│   ├── projects.js
│   └── blogs.js
├── image/               # Gambar dan foto
├── js/                  # JavaScript modules
│   └── cursor-effects.js  # Module cursor effects (glow & click spark)
├── x7r4w2/              # Easter egg folder (dino game)
│   ├── v7b2m9.html
│   ├── l3n8t1.js
│   └── s9k1p5.css
├── config.js            # Konfigurasi maintenance mode
├── index.html           # Halaman utama
├── maintenance.html     # Halaman maintenance
├── script.js            # JavaScript utama
├── style.css            # Stylesheet utama
├── CNAME                # Custom domain configuration
└── README.md            # File ini
```

## 🚀 Cara Setup

### 1. Clone Repository

```bash
git clone https://github.com/username/Portofolio.git
cd Portofolio
```

### 2. Setup Local Server

Karena menggunakan beberapa fitur yang memerlukan server (seperti fetch), disarankan menggunakan local server:

**Menggunakan XAMPP:**
- Copy folder ke `htdocs/xampp/`
- Akses via `http://localhost/Portofolio/`

**Menggunakan Python:**
```bash
python -m http.server 8000
```

**Menggunakan Node.js (http-server):**
```bash
npx http-server
```

### 3. Konfigurasi

**Maintenance Mode:**
Edit file `config.js`:
```javascript
const isMaintenance = false; // true untuk aktifkan maintenance mode
```

**EmailJS (Contact Form):**
1. Daftar di [EmailJS](https://www.emailjs.com/)
2. Dapatkan Public Key dan Service ID
3. Update konfigurasi di `script.js` (jika diperlukan)

### 4. Custom Domain (Opsional)

Jika ingin menggunakan custom domain:
1. Edit file `CNAME` dengan domain Anda
2. Setup DNS records di provider domain
3. Konfigurasi di GitHub Pages settings

``` -->

<!-- ### Mengubah Cursor Effects

Edit file `js/cursor-effects.js` atau panggil dengan konfigurasi custom:
```javascript
initCursorEffects({
  sparkColor: "#00f2ff",
  sparkSize: 12,
  sparkRadius: 40,
  sparkCount: 10,
  duration: 500
});
``` -->

## License

Portfolio ini adalah proyek pribadi. Silakan gunakan sebagai referensi atau template untuk portfolio Anda sendiri.

## 👤 Author

**Fabian Rizky Pratama**

- GitHub: [@SukaMCD](https://github.com/SukaMCD)
- LinkedIn: [fabianrizkypratama](https://www.linkedin.com/in/fabianrizkypratama)
- Instagram: [@sukamcd.dev](https://www.instagram.com/sukamcd.dev/)

## Acknowledgments

- Bootstrap untuk framework CSS
- AOS untuk animasi scroll
- Slick Carousel untuk carousel functionality
- EmailJS untuk email service
- Font Awesome untuk icons
- Google Fonts (Inter) untuk typography

---

⭐ Jika Anda menyukai portfolio ini, jangan lupa berikan star!
