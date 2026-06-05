/* ================================================================
   SCRIPT.JS — Portfolio Fotografi & Graphic Design
   Fitur:
     1. Navbar — scroll state + hamburger menu mobile
     2. Scroll Reveal Animation (IntersectionObserver)
     3. Gallery Filter (Photography / Graphic Design / All)
     4. Lightbox / Modal Gambar
     5. Navbar Active Link Highlight saat scroll
     6. Back to Top Button
     7. Footer Year Auto-update
   ================================================================ */
 
'use strict';
 
/* ----------------------------------------------------------------
   UTIL: Query selector ringkas
   ---------------------------------------------------------------- */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
 
/* ================================================================
   1. NAVBAR
   ================================================================ */
const navbar    = $('#navbar');
const hamburger = $('#hamburger');
const navLinks  = $('#navLinks');
const navLinkEls = $$('.nav-link');
 
// Tambahkan class "scrolled" saat halaman di-scroll > 60px
function handleNavbarScroll() {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}
 
// Toggle menu hamburger (mobile)
hamburger.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('open');
  navLinks.classList.toggle('open', isOpen);
  // Prevent body scroll saat menu terbuka
  document.body.style.overflow = isOpen ? 'hidden' : '';
});
 
// Tutup menu saat link diklik (mobile)
navLinkEls.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});
 
// Tutup menu saat klik di luar area menu (mobile)
document.addEventListener('click', (e) => {
  if (
    navLinks.classList.contains('open') &&
    !navLinks.contains(e.target) &&
    !hamburger.contains(e.target)
  ) {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  }
});
 
/* ================================================================
   2. SCROLL REVEAL ANIMATION
   Menggunakan IntersectionObserver agar performa lebih baik
   dari pendekatan scroll event tradisional.
   ================================================================ */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Berhenti mengamati setelah terlihat (agar tidak repeat)
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.12,   // Terlihat 12% dari elemen baru trigger
    rootMargin: '0px 0px -40px 0px'
  }
);
 
// Amati semua elemen dengan class .reveal
function initReveal() {
  $$('.reveal').forEach(el => revealObserver.observe(el));
}
 
/* ================================================================
   3. GALLERY FILTER
   ================================================================ */
const filterBtns  = $$('.filter-btn');
const galleryCards = $$('.gallery-card');
 
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Hapus active dari semua tombol, set ke yang diklik
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
 
    const filter = btn.dataset.filter; // "all", "photography", atau "design"
 
    galleryCards.forEach(card => {
      const cat = card.dataset.category; // nilai dari data-category di HTML
 
      if (filter === 'all' || cat === filter) {
        // Tampilkan card — gunakan animasi fade-in halus
        card.classList.remove('hidden');
        card.style.animation = 'none';
        // Trigger reflow untuk reset animasi
        void card.offsetWidth;
        card.style.animation = 'fadeIn 0.4s ease forwards';
      } else {
        // Sembunyikan card
        card.classList.add('hidden');
      }
    });
  });
});
 
/* ================================================================
   4. LIGHTBOX / MODAL
   ================================================================ */
const lightbox      = $('#lightbox');
const lightboxClose = $('#lightboxClose');
const lightboxImg   = $('#lightboxImg');
const lightboxTitle = $('#lightboxTitle');
const lightboxDesc  = $('#lightboxDesc');
const lightboxCat   = $('#lightboxCat');
 
// Buka lightbox saat kartu diklik
galleryCards.forEach(card => {
  card.addEventListener('click', () => {
    // Ambil data dari atribut data-* pada elemen kartu
    const imgSrc  = card.dataset.img;         // URL gambar full
    const title   = card.dataset.title;       // Judul karya
    const desc    = card.dataset.desc;        // Deskripsi karya
    const cat     = card.dataset.category;   // Kategori
 
    // Isi konten lightbox
    lightboxImg.src = imgSrc;
    lightboxImg.alt = title;
    lightboxTitle.textContent = title;
    lightboxDesc.textContent  = desc;
    lightboxCat.textContent   = cat === 'photography' ? 'Photography' : 'Graphic Design';
 
    // Tampilkan lightbox
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden'; // Prevent background scroll
  });
});
 
// Tutup lightbox via tombol X
lightboxClose.addEventListener('click', closeLightbox);
 
// Tutup lightbox saat klik di luar gambar
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});
 
// Tutup lightbox dengan tombol Escape di keyboard
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && lightbox.classList.contains('open')) {
    closeLightbox();
  }
});
 
function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
  // Reset src setelah transisi selesai agar tidak ada gambar tertinggal
  setTimeout(() => {
    lightboxImg.src = '';
  }, 350);
}
 
/* ================================================================
   5. ACTIVE NAV LINK HIGHLIGHT saat scroll
   Menggunakan IntersectionObserver untuk efisiensi.
   ================================================================ */
const sections    = $$('section[id]');
const navMap      = {};
 
// Buat map: id section → elemen nav link
navLinkEls.forEach(link => {
  const href = link.getAttribute('href').replace('#', '');
  navMap[href] = link;
});
 
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Hapus active dari semua nav link
        navLinkEls.forEach(l => l.classList.remove('active'));
        // Set active pada link yang sesuai
        const activeLink = navMap[entry.target.id];
        if (activeLink) activeLink.classList.add('active');
      }
    });
  },
  {
    // Trigger saat section berada di 20–80% viewport
    rootMargin: '-20% 0px -60% 0px'
  }
);
 
sections.forEach(sec => sectionObserver.observe(sec));
 
/* ================================================================
   6. BACK TO TOP BUTTON
   ================================================================ */
const backTopBtn = $('#backTop');
 
function handleBackTop() {
  if (window.scrollY > 400) {
    backTopBtn.classList.add('show');
  } else {
    backTopBtn.classList.remove('show');
  }
}
 
backTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
 
/* ================================================================
   7. FOOTER YEAR AUTO-UPDATE
   Agar tahun copyright selalu terkini tanpa perlu edit manual.
   ================================================================ */
const yearEl = $('#year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
 
/* ================================================================
   8. SCROLL EVENT LISTENER (throttled)
   Gabungkan semua fungsi scroll dalam satu listener untuk performa
   ================================================================ */
let ticking = false;
 
function onScroll() {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      handleNavbarScroll();
      handleBackTop();
      ticking = false;
    });
    ticking = true;
  }
}
 
window.addEventListener('scroll', onScroll, { passive: true });
 
/* ================================================================
   9. CSS ANIMATION untuk filter gallery (didefinisikan via JS)
   ================================================================ */
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; transform: scale(0.97) translateY(10px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }
`;
document.head.appendChild(styleSheet);
 
/* ================================================================
   10. INISIALISASI
   Jalankan semua fungsi init setelah DOM siap.
   ================================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initReveal();       // Aktifkan scroll reveal
  handleNavbarScroll(); // Set state navbar awal
  handleBackTop();      // Set state back-to-top awal
 
  console.log('✅ Portfolio loaded. Semangat berkarya! 🎨📸');
});