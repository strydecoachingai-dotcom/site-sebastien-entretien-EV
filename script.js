/* ================================================================
   SÉBASTIEN PAYSAGISTE — JavaScript
   Header scroll · Menu mobile · Filtres galerie · Formulaire · FAB ·
   Animations Intersection Observer · Smooth reveal
================================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ============================================================
     1. HEADER — Effet de scroll
  ============================================================ */
  const header = document.getElementById('header');

  const onScroll = () => {
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // init au chargement


  /* ============================================================
     2. MENU BURGER — Mobile
  ============================================================ */
  const burger = document.getElementById('burger');
  const nav    = document.getElementById('nav');

  if (burger && nav) {
    burger.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      burger.classList.toggle('active', isOpen);
      // Bloquer le scroll body quand menu ouvert
      document.body.style.overflow = isOpen ? 'hidden' : '';
      burger.setAttribute('aria-expanded', isOpen);
    });

    // Fermer le menu au clic sur un lien
    nav.querySelectorAll('.nav__link').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        burger.classList.remove('active');
        document.body.style.overflow = '';
        burger.setAttribute('aria-expanded', 'false');
      });
    });

    // Fermer avec Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        nav.classList.remove('open');
        burger.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }


  /* ============================================================
     3. SMOOTH SCROLL — Navigation ancrée
  ============================================================ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const headerH = header ? header.offsetHeight : 70;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - headerH - 20;
      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    });
  });


  /* ============================================================
     4. ANIMATIONS FADE-IN — Intersection Observer
  ============================================================ */
  // On ajoute la classe fade-in à tous les éléments à animer
  const animatables = [
    '.service-card',
    '.realisation-item',
    '.before-after-module',
    '.step',
    '.temoignage-card',
    '.cta-band__inner',
    '.cta-prefooter__inner',
    '.about__text',
    '.about__portrait',
    '.about__proofs',
    '.proofbar-item',
    '.pillar',
    '.reassurance-item',
    '.city-tag',
    '.contact__headline',
    '.contact__form',
    '.section-header',
    '.zone__text',
    '.zone__map',
  ];

  animatables.forEach(selector => {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.classList.add('fade-in');
      // Délai progressif pour les grilles
      if (i < 4) el.classList.add(`fade-in-delay-${i}`);
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));


  /* ============================================================
     5. FILTRES GALERIE — Réalisations
  ============================================================ */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const realisationItems = document.querySelectorAll('.realisation-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      // Mettre à jour les boutons actifs
      filterBtns.forEach(b => b.classList.remove('filter-btn--active'));
      btn.classList.add('filter-btn--active');

      // Filtrer les items
      realisationItems.forEach(item => {
        const category = item.getAttribute('data-category');
        const match = filter === 'all' || category === filter;

        if (match) {
          item.style.display = '';
          // Forcer une réapparition animée
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              item.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
              item.style.opacity = '1';
              item.style.transform = 'scale(1)';
            });
          });
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.9)';
          item.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
          setTimeout(() => {
            if (item.getAttribute('data-category') !== filter && filter !== 'all') {
              item.style.display = 'none';
            }
          }, 280);
        }
      });
    });
  });

  /* ============================================================
     5b. MODULE AVANT/APRES — Slider interactif
  ============================================================ */
  const beforeAfterRange = document.getElementById('beforeAfterRange');
  const beforeAfterViewer = document.getElementById('beforeAfterViewer');
  const baAvant = document.getElementById('baAvant');
  const baApres = document.getElementById('baApres');
  const beforeAfterDivider = document.getElementById('beforeAfterDivider');
  const beforeAfterTitle = document.getElementById('beforeAfterTitle');
  const beforeAfterDescription = document.getElementById('beforeAfterDescription');

  if (beforeAfterRange && beforeAfterViewer && baAvant && baApres && beforeAfterDivider) {
    let isPointerDragging = false;

    const updateBeforeAfter = () => {
      const value = Number(beforeAfterRange.value);
      baApres.style.clipPath = `inset(0 0 0 ${value}%)`;
      beforeAfterDivider.style.left = `${value}%`;
    };

    const setCompareSheetMode = (compareImage) => {
      const imageUrl = `url("${compareImage}")`;
      baAvant.style.backgroundImage = imageUrl;
      baApres.style.backgroundImage = imageUrl;
      baAvant.style.backgroundSize = '200% auto';
      baApres.style.backgroundSize = '200% auto';
      baAvant.style.backgroundPosition = '0% center';
      baApres.style.backgroundPosition = '100% center';
    };

    const setSplitMode = (beforeImage, afterImage) => {
      baAvant.style.backgroundImage = `url("${beforeImage}")`;
      baApres.style.backgroundImage = `url("${afterImage}")`;
      baAvant.style.backgroundSize = 'cover';
      baApres.style.backgroundSize = 'cover';
      baAvant.style.backgroundPosition = 'center';
      baApres.style.backgroundPosition = 'center';
    };

    const updateRangeFromPointer = (clientX) => {
      const bounds = beforeAfterViewer.getBoundingClientRect();
      if (!bounds.width) {
        return;
      }

      const ratio = (clientX - bounds.left) / bounds.width;
      const value = Math.min(100, Math.max(0, Math.round(ratio * 100)));
      beforeAfterRange.value = String(value);
      updateBeforeAfter();
    };

    beforeAfterRange.addEventListener('input', updateBeforeAfter);
    beforeAfterViewer.addEventListener('pointerdown', (event) => {
      isPointerDragging = true;
      if (typeof beforeAfterViewer.setPointerCapture === 'function') {
        beforeAfterViewer.setPointerCapture(event.pointerId);
      }
      updateRangeFromPointer(event.clientX);
    });
    beforeAfterViewer.addEventListener('pointermove', (event) => {
      if (!isPointerDragging) {
        return;
      }

      updateRangeFromPointer(event.clientX);
    });
    beforeAfterViewer.addEventListener('pointerup', (event) => {
      isPointerDragging = false;
      if (typeof beforeAfterViewer.releasePointerCapture === 'function') {
        beforeAfterViewer.releasePointerCapture(event.pointerId);
      }
    });
    beforeAfterViewer.addEventListener('pointercancel', () => {
      isPointerDragging = false;
    });
    updateBeforeAfter();

    const realisationCards = document.querySelectorAll('.realisation-item[data-compare-image], .realisation-item[data-before-image]');

    const syncRealisationBadges = (activeCard) => {
      realisationCards.forEach((item) => {
        const badge = item.querySelector('.realisation-badge');
        if (!badge) {
          return;
        }

        const defaultLabel = item.getAttribute('data-badge-label') || 'Voir le rendu';
        badge.textContent = item === activeCard ? 'Vue active' : defaultLabel;
      });
    };

    const applyRealisationSelection = (card) => {
      if (!card) {
        return;
      }

      const compareImage = card.getAttribute('data-compare-image');
      const beforeImage = card.getAttribute('data-before-image');
      const afterImage = card.getAttribute('data-after-image');
      const title = card.getAttribute('data-title');
      const description = card.getAttribute('data-description');
      const alt = card.getAttribute('data-alt') || '';
      const mode = card.getAttribute('data-mode') || 'compare-sheet';

      realisationCards.forEach((item) => {
        item.classList.remove('is-active');
        item.setAttribute('aria-pressed', 'false');
      });

      card.classList.add('is-active');
      card.setAttribute('aria-pressed', 'true');
      syncRealisationBadges(card);

      if (beforeAfterTitle && title) {
        beforeAfterTitle.textContent = title;
      }

      if (beforeAfterDescription && description) {
        beforeAfterDescription.textContent = description;
      }

      if (mode === 'split' && beforeImage && afterImage) {
        setSplitMode(beforeImage, afterImage);
      } else if (compareImage) {
        setCompareSheetMode(compareImage);
      }

      beforeAfterRange.value = '50';
      beforeAfterViewer.setAttribute('aria-label', `Comparaison avant apres - ${alt}`);

      updateBeforeAfter();
    };

    realisationCards.forEach((card) => {
      card.addEventListener('click', () => applyRealisationSelection(card));
      card.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          applyRealisationSelection(card);
        }
      });
    });

    const defaultCard = document.querySelector('.realisation-item.is-active[data-compare-image], .realisation-item.is-active[data-before-image]') || realisationCards[0];
    if (defaultCard) {
      applyRealisationSelection(defaultCard);
    }
  }

  /* ============================================================
     5c. CTA INTELLIGENT — Pre-remplissage type de projet
  ============================================================ */
  const prefillLinks = document.querySelectorAll('[data-prefill-projet]');
  const needChips = document.querySelectorAll('.need-chip');
  const projetField = document.getElementById('projet');
  const feedback = document.getElementById('formPrefillFeedback');

  const projetLabels = {
    tonte: 'Tonte',
    'tonte-bordures': 'Tonte + bordures',
    haies: 'Taille de haies',
    debroussaillage: 'Debroussaillage',
    entretien: 'Entretien regulier',
    remise: 'Remise en état terrain',
    nettoyage: 'Nettoyage exterieur',
    elagage: 'Elagage',
    evacuation: 'Evacuation déchets verts',
    bricolage: 'Petit bricolage',
    autre: 'Petit bricolage',
  };

  const selectedNeeds = new Set();

  const syncSelectedNeeds = () => {
    if (!projetField) return;
    projetField.value = Array.from(selectedNeeds).join(', ');
  };

  if (needChips.length > 0 && projetField) {
    needChips.forEach((chip) => {
      chip.addEventListener('click', () => {
        const value = chip.getAttribute('data-value');
        if (!value) return;

        if (selectedNeeds.has(value)) {
          selectedNeeds.delete(value);
          chip.classList.remove('is-active');
          chip.setAttribute('aria-pressed', 'false');
        } else {
          selectedNeeds.add(value);
          chip.classList.add('is-active');
          chip.setAttribute('aria-pressed', 'true');
        }

        syncSelectedNeeds();
      });
    });
  }

  if (projetField && prefillLinks.length > 0) {
    prefillLinks.forEach(link => {
      link.addEventListener('click', () => {
        const project = link.getAttribute('data-prefill-projet');
        if (!project) return;

        // Support multipage: conserver le service choisi pour la page contact
        try {
          localStorage.setItem('selectedService', project);
        } catch (_) {
          // no-op si localStorage indisponible
        }

        const mappedLabel = projetLabels[project];
        if (mappedLabel) {
          selectedNeeds.add(mappedLabel);
          needChips.forEach((chip) => {
            const value = chip.getAttribute('data-value');
            const isActive = value === mappedLabel;
            chip.classList.toggle('is-active', isActive);
            chip.setAttribute('aria-pressed', isActive ? 'true' : 'false');
          });
          syncSelectedNeeds();
        }

        if (feedback) {
          feedback.textContent = `Service preselectionne : ${mappedLabel || 'Besoin personnalise'}`;
          setTimeout(() => {
            feedback.textContent = '';
          }, 3500);
        }
      });
    });
  }

  // Préselection à l'arrivée sur contact.html via ?service=... puis fallback localStorage
  if (projetField) {
    const params = new URLSearchParams(window.location.search);
    const serviceFromQuery = params.get('service');
    let selectedService = serviceFromQuery;

    if (!selectedService) {
      try {
        selectedService = localStorage.getItem('selectedService');
      } catch (_) {
        selectedService = null;
      }
    }

    if (selectedService) {
      const mappedLabel = projetLabels[selectedService];
      if (mappedLabel) {
        selectedNeeds.add(mappedLabel);
        needChips.forEach((chip) => {
          const value = chip.getAttribute('data-value');
          const isActive = value === mappedLabel;
          chip.classList.toggle('is-active', isActive);
          chip.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        });
        syncSelectedNeeds();
        if (feedback) {
          feedback.textContent = `Service preselectionne : ${mappedLabel}`;
        }
      }
      try {
        localStorage.removeItem('selectedService');
      } catch (_) {
        // no-op
      }
    }
  }


  /* ============================================================
     6. FORMULAIRE DE CONTACT — Validation & soumission
  ============================================================ */
  const form  = document.getElementById('contactForm');
  const toast = document.getElementById('toast');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Réinitialiser les erreurs
      form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
      form.querySelectorAll('.error-msg').forEach(el => el.remove());

      let valid = true;

      // Fonction d'affichage d'erreur
      const showError = (input, msg, container) => {
        input.classList.add('error');
        const err = document.createElement('span');
        err.className = 'error-msg';
        err.textContent = msg;
        err.style.cssText = 'color:#e53e3e;font-size:0.78rem;margin-top:4px;display:block;';
        const parent = container || input.parentNode;
        parent.appendChild(err);
        valid = false;
      };

      // Valider nom (optionnel, mais cohérent si renseigné)
      const nom = form.querySelector('#nom');
      if (nom && nom.value.trim() && nom.value.trim().length < 2) {
        showError(nom, 'Veuillez entrer un nom valide.');
      }

      // Valider téléphone (format FR)
      const tel = form.querySelector('#tel');
      const telClean = tel.value.replace(/\s/g, '');
      const telRegex = /^(\+33|0033|0)[1-9][0-9]{8}$/;
      if (!telRegex.test(telClean)) {
        showError(tel, 'Numéro de téléphone invalide (ex : 06 12 34 56 78).');
      }

      // Valider email
      const email = form.querySelector('#email');
      if (email) {
        const emailValue = email.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailValue && !emailRegex.test(emailValue)) {
          showError(email, 'Adresse email invalide.');
        }
      }

      // Valider type de besoin (au moins un)
      const projet = form.querySelector('#projet');
      const needChipsContainer = form.querySelector('#needChips');
      if (projet && !projet.value.trim()) {
        showError(projet, 'Selectionnez au moins un type de besoin.', needChipsContainer ? needChipsContainer.parentNode : null);
      }

      // Message facultatif
      const message = form.querySelector('#message');
      if (message && message.value.trim() && message.value.trim().length < 8) {
        showError(message, 'Ajoutez au moins 8 caracteres ou laissez vide.');
      }

      if (!valid) {
        // Scroll vers la première erreur
        const firstError = form.querySelector('.error');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
          if (firstError.type !== 'hidden') {
            firstError.focus();
          }
        }
        return;
      }

      // ✅ Formulaire valide → Simuler l'envoi
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;

      submitBtn.disabled = true;
      submitBtn.textContent = 'Envoi en cours…';
      submitBtn.style.opacity = '0.7';

      // Simulation d'envoi (à remplacer par un vrai fetch vers votre backend / Formspree / Netlify)
      setTimeout(() => {
        form.reset();
        selectedNeeds.clear();
        needChips.forEach((chip) => {
          chip.classList.remove('is-active');
          chip.setAttribute('aria-pressed', 'false');
        });
        syncSelectedNeeds();
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        submitBtn.style.opacity = '';

        // Afficher le toast de confirmation
        showToast();
      }, 1400);
    });
  }

  // Toast notification
  function showToast() {
    if (!toast) return;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 5000);
  }


  /* ============================================================
     7. FAB CALL — Masquer quand on est dans le hero
  ============================================================ */
  let fabCall = document.getElementById('fabCall');

  // Garantir un bouton d'appel flottant sur toutes les pages.
  if (!fabCall) {
    fabCall = document.createElement('a');
    fabCall.id = 'fabCall';
    fabCall.className = 'fab-call';
    fabCall.href = 'tel:0683216528';
    fabCall.setAttribute('aria-label', 'Appeler maintenant');
    fabCall.innerHTML = '<span class="fab-call__text">&#128222; Appeler maintenant</span>';
    document.body.appendChild(fabCall);
  }

  fabCall.style.opacity = '1';
  fabCall.style.pointerEvents = '';


  /* ============================================================
     8. LIENS ACTIFS — Highlight nav au scroll
  ============================================================ */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link[href^="#"]');

  const activeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          const href = link.getAttribute('href');
          if (href === `#${id}`) {
            link.style.color = '#a8c97f';
          } else {
            link.style.color = '';
          }
        });
      }
    });
  }, {
    rootMargin: '-40% 0px -55% 0px',
    threshold: 0
  });

  sections.forEach(section => activeObserver.observe(section));

});
