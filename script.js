/* ═══════════════════════════════════════════════════
   BRASA URBANA — script.js  v2
   Works on both index.html and menu.html
═══════════════════════════════════════════════════ */

(function () {
  'use strict';

  const WA_NUMBER = '573174886630';

  // ─── BUILD WHATSAPP URL ───────────────────────────
  function buildWaUrl(productName, price) {
    const msg = `Hola Brasa Urbana 🔥\n\nQuiero pedir:\n▸ *${productName}*${price ? `\n▸ Precio: *${price}*` : ''}\n\n¿Está disponible ahora? ¿Cuál es el tiempo de entrega?\n\nGracias 🙌`;
    return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
  }

  // ─── MODAL ────────────────────────────────────────
  const modal      = document.getElementById('orderModal');
  const overlay    = document.getElementById('modalOverlay');
  const modalProd  = document.getElementById('modalProduct');
  const modalPrice = document.getElementById('modalPrice');
  const modalBtn   = document.getElementById('modalConfirm');
  const cancelBtn  = document.getElementById('modalCancel');

  function openModal(productName, price) {
    modalProd.textContent  = productName;
    modalPrice.textContent = price || '';
    modalBtn.href          = buildWaUrl(productName, price);
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setTimeout(() => modalBtn.focus(), 320);
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (overlay) overlay.addEventListener('click', closeModal);
  if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('open')) closeModal();
  });

  // ─── PRODUCT CLICK ───────────────────────────────
  // Combos → modal (el usuario puede querer personalizar)
  // Productos individuales → WhatsApp directo (menos fricción)
  const COMBO_KEYWORDS = ['combo', 'picada', 'familiar'];

  function isCombo(productName) {
    const lower = productName.toLowerCase();
    return COMBO_KEYWORDS.some(k => lower.includes(k));
  }

  function handleProductClick(e) {
    const target  = e.currentTarget;
    const product = target.dataset.product;
    const price   = target.dataset.price;
    if (!product) return;

    if (isCombo(product)) {
      // Combos: mostrar modal para personalización
      openModal(product, price);
    } else {
      // Productos simples: ir directo a WhatsApp
      window.open(buildWaUrl(product, price), '_blank');
    }
  }

  document.querySelectorAll('[data-product]').forEach((el) => {
    el.addEventListener('click', handleProductClick);
    el.setAttribute('tabindex', '0');
    el.setAttribute('role', 'button');
    el.setAttribute('aria-label', `Pedir ${el.dataset.product} por WhatsApp`);
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleProductClick(e);
      }
    });
  });

  // ─── TABS ─────────────────────────────────────────
  const tabs   = document.querySelectorAll('.tab');
  const panels = document.querySelectorAll('.tab-panel');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      tabs.forEach((t) => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      panels.forEach((panel) => {
        panel.classList.toggle('active', panel.id === `tab-${target}`);
      });
    });
  });

  // ─── STICKY HEADER SHADOW ─────────────────────────
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.style.boxShadow = window.scrollY > 10 ? '0 2px 24px rgba(0,0,0,0.6)' : 'none';
    }, { passive: true });
  }

  // ─── SCROLL FADE-IN ───────────────────────────────
  const fadeTargets = document.querySelectorAll('.section, .proof-bar, .menu-page-hero');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.07 }
  );
  fadeTargets.forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
    observer.observe(el);
  });

  // ─── SCROLL-SPY — resalta tab activo en menu.html ──
  const menuTabs = document.querySelectorAll('.menu-tab');
  if (menuTabs.length) {
    const sectionIds = ['carnes', 'combos', 'extras', 'bebidas'];
    const sections   = sectionIds.map(id => document.getElementById(id)).filter(Boolean);
    // Offset = alto del header (60px) + tabs bar (47px) + margen
    const OFFSET = 130;

    function updateActiveTab() {
      let current = sectionIds[0];
      sections.forEach(sec => {
        if (window.scrollY + OFFSET >= sec.offsetTop) current = sec.id;
      });
      menuTabs.forEach(tab => {
        const href = tab.getAttribute('href');
        tab.classList.toggle('active-tab', href === `#${current}`);
      });
    }

    window.addEventListener('scroll', updateActiveTab, { passive: true });
    updateActiveTab(); // on load
  }

  // ─── SMOOTH ANCHOR SCROLL ─────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 68;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

})();