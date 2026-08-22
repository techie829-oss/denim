/**
 * DENIM MACHINE — Main JavaScript
 * Rebuilt from scratch: simple, reliable, no click-blocking
 */

'use strict';

/* =========================================================
   HEADER SCROLL
   ========================================================= */
const siteHeader = document.getElementById('site-header');
if (siteHeader) {
  window.addEventListener('scroll', () => {
    siteHeader.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
}

/* =========================================================
   MOBILE MENU — hamburger open/close
   ========================================================= */
const hamburger     = document.getElementById('hamburger');
const mobileMenu    = document.getElementById('mobile-menu');
const mobileClose   = document.getElementById('mobile-close');
const mobileOverlay = document.getElementById('mobile-overlay');

function openMenu() {
  if (mobileMenu)    { mobileMenu.classList.add('open'); mobileMenu.removeAttribute('aria-hidden'); }
  if (mobileOverlay) mobileOverlay.classList.add('active');
  if (hamburger)     { hamburger.classList.add('open'); hamburger.setAttribute('aria-expanded', 'true'); }
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  if (mobileMenu)    { mobileMenu.classList.remove('open'); mobileMenu.setAttribute('aria-hidden', 'true'); }
  if (mobileOverlay) mobileOverlay.classList.remove('active');
  if (hamburger)     { hamburger.classList.remove('open'); hamburger.setAttribute('aria-expanded', 'false'); }
  document.body.style.overflow = '';
}

if (hamburger)     hamburger.addEventListener('click', openMenu);
if (mobileClose)   mobileClose.addEventListener('click', closeMenu);
if (mobileOverlay) mobileOverlay.addEventListener('click', closeMenu);

document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', closeMenu);
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeMenu();
});

/* =========================================================
   SCROLL REVEAL
   ========================================================= */
const revealEls = document.querySelectorAll(
  '.reveal-up, .reveal-left, .reveal-right, .collection-item, .gallery-item, .journey-step, .why-card, .policy-content'
);

if ('IntersectionObserver' in window && revealEls.length > 0) {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add('visible');
        obs.unobserve(en.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
  revealEls.forEach(el => obs.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('visible'));
}

/* =========================================================
   BACK TO TOP
   ========================================================= */
const backToTop = document.getElementById('back-to-top');
if (backToTop) {
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* =========================================================
   SMOOTH SCROLL — hash-only links (#section)
   ========================================================= */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const id = link.getAttribute('href').slice(1);
    if (!id) return;
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      const hh = 80;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - hh, behavior: 'smooth' });
    }
  });
});

/* =========================================================
   LIGHTBOX
   ========================================================= */
const lightbox        = document.getElementById('lightbox');
const lightboxImg     = document.getElementById('lightbox-img');
const lightboxClose   = document.getElementById('lightbox-close');
const lightboxPrev    = document.getElementById('lightbox-prev');
const lightboxNext    = document.getElementById('lightbox-next');
const lightboxCounter = document.getElementById('lightbox-counter');

let lbImages = [];
let lbIndex  = 0;

function lbShow() {
  if (!lightbox || !lightboxImg || lbImages.length === 0) return;
  const { src, alt } = lbImages[lbIndex];
  lightboxImg.src = src;
  lightboxImg.alt = alt || '';
  if (lightboxCounter) lightboxCounter.textContent = `${lbIndex + 1} / ${lbImages.length}`;
  lightbox.hidden = false;
  document.body.style.overflow = 'hidden';
}

function lbClose() {
  if (!lightbox) return;
  lightbox.hidden = true;
  document.body.style.overflow = '';
}

function lbPrev() { lbIndex = (lbIndex - 1 + lbImages.length) % lbImages.length; lbShow(); }
function lbNext() { lbIndex = (lbIndex + 1) % lbImages.length; lbShow(); }

if (lightboxClose)   lightboxClose.addEventListener('click', lbClose);
if (lightboxPrev)    lightboxPrev.addEventListener('click', lbPrev);
if (lightboxNext)    lightboxNext.addEventListener('click', lbNext);
if (lightbox)        lightbox.addEventListener('click', e => { if (e.target === lightbox) lbClose(); });

document.addEventListener('keydown', e => {
  if (!lightbox || lightbox.hidden) return;
  if (e.key === 'ArrowLeft')  lbPrev();
  if (e.key === 'ArrowRight') lbNext();
  if (e.key === 'Escape')     lbClose();
});

/* Collection lightbox triggers */
const collectionItems = document.querySelectorAll('.collection-item');
if (collectionItems.length > 0) {
  const imgs = [...collectionItems].map(item => {
    const img = item.querySelector('img');
    return { src: img ? img.src : '', alt: img ? img.alt : '' };
  });
  collectionItems.forEach((item, i) => {
    item.style.cursor = 'pointer';
    item.addEventListener('click', () => { lbImages = imgs; lbIndex = i; lbShow(); });
  });
}

/* Gallery lightbox triggers */
const galleryItems = document.querySelectorAll('.gallery-item');
if (galleryItems.length > 0) {
  const imgs = [...galleryItems].map(item => {
    const img = item.querySelector('img');
    return { src: img ? img.src : '', alt: img ? img.alt : '' };
  });
  galleryItems.forEach((item, i) => {
    item.style.cursor = 'pointer';
    item.addEventListener('click', () => { lbImages = imgs; lbIndex = i; lbShow(); });
  });
}

/* =========================================================
   CONTACT FORM
   ========================================================= */
const contactForm   = document.getElementById('contact-form');
const formSuccess   = document.getElementById('form-success');
const formSubmitBtn = document.getElementById('form-submit-btn');

if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const name    = contactForm.querySelector('#contact-name')?.value.trim();
    const email   = contactForm.querySelector('#contact-email')?.value.trim();
    const message = contactForm.querySelector('#contact-message')?.value.trim();
    if (!name || !email || !message) return;
    if (formSubmitBtn) {
      formSubmitBtn.disabled = true;
      const t = formSubmitBtn.querySelector('.btn-text');
      if (t) t.textContent = 'Sending…';
    }
    setTimeout(() => {
      if (formSuccess) formSuccess.hidden = false;
      contactForm.reset();
      if (formSubmitBtn) {
        formSubmitBtn.disabled = false;
        const t = formSubmitBtn.querySelector('.btn-text');
        if (t) t.textContent = 'Submit Enquiry';
      }
    }, 800);
  });
}

/* =========================================================
   FAQ ACCORDIONS
   ========================================================= */
document.querySelectorAll('.faq-item').forEach(item => {
  const btn = item.querySelector('.faq-question');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => {
      i.classList.remove('open');
      i.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
    });
    if (!isOpen) { item.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); }
  });
});

/* =========================================================
   FILTER TABS
   ========================================================= */
const filterBtns  = document.querySelectorAll('.filter-btn');
const filterCards = document.querySelectorAll('[data-category]');
if (filterBtns.length > 0 && filterCards.length > 0) {
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const val = btn.getAttribute('data-filter');
      filterCards.forEach(card => {
        const cat = card.getAttribute('data-category') || '';
        const show = val === 'all' || cat === val || cat.includes(val);
        card.style.display = show ? '' : 'none';
        card.style.opacity = show ? '1' : '0';
      });
    });
  });
}

/* =========================================================
   ACTIVE NAV HIGHLIGHT
   ========================================================= */
(function() {
  const page = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('.nav-link, .mobile-link').forEach(link => {
    const href = (link.getAttribute('href') || '').toLowerCase();
    if (href === page || (page === '' && href === 'index.html')) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });
})();

/* =========================================================
   SCROLL PROGRESS BAR
   ========================================================= */
const scrollProgressBar = document.getElementById('scroll-progress');
if (scrollProgressBar) {
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgressBar.style.width = `${progress}%`;
  }, { passive: true });
}

/* =========================================================
   INTERACTIVE WASH STUDIO SWITCHER
   ========================================================= */
const washData = {
  'raw-indigo': {
    title: 'Raw Deep Indigo',
    desc: 'Our flagship heavy-duty denim weave. Pure indigo dipped multiple times for unprecedented colour depth and natural personalized fading over time.',
    img: 'images/img4.jpg',
    weightVal: '14.5 oz (Heavy)',
    weightBar: '95%',
    fadeVal: 'High Honeycombs',
    fadeBar: '90%',
    stretchVal: '1% Natural Flex',
    stretchBar: '30%'
  },
  'mid-wash': {
    title: 'Vintage Mid-Blue',
    desc: 'A sun-drenched classic. Enzyme stonewashed with subtle whisker patterning along thigh creases for a broken-in vintage look from day one.',
    img: 'images/img5.jpg',
    weightVal: '13.5 oz (Medium)',
    weightBar: '80%',
    fadeVal: 'Medium Contrast',
    fadeBar: '65%',
    stretchVal: '2% Comfort Spandex',
    stretchBar: '50%'
  },
  'dark-wash': {
    title: 'Midnight Obsidian',
    desc: 'Dual sulfur and indigo dye bath delivering an intense dark tone with subtle satin sheen. Engineered for formal and evening silhouettes.',
    img: 'images/img9.jpg',
    weightVal: '14.0 oz (Medium-Heavy)',
    weightBar: '88%',
    fadeVal: 'Low / Deep Tone',
    fadeBar: '25%',
    stretchVal: '1.5% Ergonomic Stretch',
    stretchBar: '40%'
  },
  'washed-grey': {
    title: 'Washed Grey & Blue',
    desc: 'Contemporary monochrome fade featuring brushed cotton yarn and artisanal scraping. Soft handfeel with high abrasion resistance.',
    img: 'images/img1.jpg',
    weightVal: '12.5 oz (Light-Medium)',
    weightBar: '70%',
    fadeVal: 'Artisanal Distressed',
    fadeBar: '85%',
    stretchVal: '2.5% Maximum Comfort',
    stretchBar: '75%'
  }
};

const washTabs = document.querySelectorAll('.wash-tab-btn');
const washImg = document.getElementById('wash-preview-img');
const washTitle = document.getElementById('wash-detail-title');
const washDesc = document.getElementById('wash-detail-desc');
const weightVal = document.getElementById('metric-weight-val');
const weightBar = document.getElementById('metric-weight-bar');
const fadeVal = document.getElementById('metric-fade-val');
const fadeBar = document.getElementById('metric-fade-bar');
const stretchVal = document.getElementById('metric-stretch-val');
const stretchBar = document.getElementById('metric-stretch-bar');

if (washTabs.length > 0 && washImg) {
  washTabs.forEach(btn => {
    btn.addEventListener('click', () => {
      washTabs.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const washKey = btn.getAttribute('data-wash');
      const data = washData[washKey];
      if (data) {
        washImg.style.opacity = '0.3';
        washImg.style.transform = 'scale(0.97)';
        setTimeout(() => {
          washImg.src = data.img;
          washImg.alt = data.title;
          if (washTitle) washTitle.textContent = data.title;
          if (washDesc) washDesc.textContent = data.desc;
          if (weightVal) weightVal.textContent = data.weightVal;
          if (weightBar) weightBar.style.width = data.weightBar;
          if (fadeVal) fadeVal.textContent = data.fadeVal;
          if (fadeBar) fadeBar.style.width = data.fadeBar;
          if (stretchVal) stretchVal.textContent = data.stretchVal;
          if (stretchBar) stretchBar.style.width = data.stretchBar;
          washImg.style.opacity = '1';
          washImg.style.transform = 'scale(1)';
        }, 150);
      }
    });
  });
}

/* =========================================================
   RAW VS FINISHED COMPARISON SLIDER
   ========================================================= */
const compareContainer = document.getElementById('compare-container');
const compareAfterWrap = document.getElementById('compare-after-wrap');
const compareSliderBar = document.getElementById('compare-slider-bar');

if (compareContainer && compareAfterWrap && compareSliderBar) {
  let isDragging = false;

  function updateSlider(xPos) {
    const rect = compareContainer.getBoundingClientRect();
    let x = xPos - rect.left;
    if (x < 0) x = 0;
    if (x > rect.width) x = rect.width;
    const percentage = (x / rect.width) * 100;
    compareAfterWrap.style.width = `${percentage}%`;
    compareSliderBar.style.left = `${percentage}%`;
  }

  function onPointerDown(e) {
    isDragging = true;
    updateSlider(e.pageX || (e.touches && e.touches[0].pageX));
  }

  function onPointerMove(e) {
    if (!isDragging) return;
    updateSlider(e.pageX || (e.touches && e.touches[0].pageX));
  }

  function onPointerUp() {
    isDragging = false;
  }

  compareContainer.addEventListener('mousedown', onPointerDown);
  window.addEventListener('mousemove', onPointerMove);
  window.addEventListener('mouseup', onPointerUp);

  compareContainer.addEventListener('touchstart', onPointerDown, { passive: true });
  window.addEventListener('touchmove', onPointerMove, { passive: true });
  window.addEventListener('touchend', onPointerUp);
}

/* =========================================================
   SUBTLE 3D TILT EFFECT ON CARDS
   ========================================================= */
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  const tiltCards = document.querySelectorAll('.collection-item, .craft-img-block');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const xPct = (x / rect.width - 0.5) * 10;
      const yPct = (y / rect.height - 0.5) * -10;
      card.style.transform = `perspective(1000px) rotateX(${yPct}deg) rotateY(${xPct}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

