/* ==========================================================================
   AVANT-GARDE 3D ARTIST PORTFOLIO — INTERACTIVE SCRIPT
   - Dynamic Ambient Atmosphere Controller
   - Color Scheme Morphing on Hover
   - Fullscreen Lightbox Modal
   - Ethereal Web Audio Drone Generator (Client-Side, zero dependencies)
   ========================================================================== */

(function () {
  'use strict';

  // ------------------------------------------------------------------------
  // 1. Ambient Aura Color Scheme Reactive Transition
  // ------------------------------------------------------------------------
  const root = document.documentElement;
  const ambientAura = document.querySelector('.ambient-aura');
  const menuItems = document.querySelectorAll('.category-menu-item, .film-menu-card');

  // Palette definitions
  const categoryPalettes = {
    red: {
      color: '#ff334b',
      ambient: 'rgba(255, 51, 75, 0.22)'
    },
    green: {
      color: '#00f0a8',
      ambient: 'rgba(0, 240, 168, 0.2)'
    },
    bw: {
      color: '#ffffff',
      ambient: 'rgba(255, 255, 255, 0.16)'
    },
    others: {
      color: '#b388ff',
      ambient: 'rgba(179, 136, 255, 0.22)'
    },
    film: {
      color: '#e9b35a',
      ambient: 'rgba(233, 179, 90, 0.22)'
    }
  };

  // Default color scheme based on body data-theme attribute
  const initialTheme = document.body.dataset.theme || 'default';
  if (categoryPalettes[initialTheme]) {
    setTheme(categoryPalettes[initialTheme]);
  }

  function setTheme(palette) {
    root.style.setProperty('--active-color', palette.color);
    root.style.setProperty('--active-ambient', palette.ambient);
  }

  // Reactive hover effect on menu cards (on main page)
  menuItems.forEach((item) => {
    item.addEventListener('mouseenter', () => {
      const themeKey = item.dataset.theme;
      if (themeKey && categoryPalettes[themeKey]) {
        setTheme(categoryPalettes[themeKey]);
      }
    });

    item.addEventListener('mouseleave', () => {
      if (categoryPalettes[initialTheme]) {
        setTheme(categoryPalettes[initialTheme]);
      } else {
        root.style.setProperty('--active-color', 'var(--theme-bw)');
        root.style.setProperty('--active-ambient', 'var(--theme-bw-ambient)');
      }
    });
  });

  // Dynamic Aura subtle follow
  if (ambientAura) {
    let targetX = 50;
    let targetY = 50;
    let currentX = 50;
    let currentY = 50;

    window.addEventListener('mousemove', (e) => {
      targetX = (e.clientX / window.innerWidth) * 100;
      targetY = (e.clientY / window.innerHeight) * 100;
    });

    function renderAura() {
      // Gentle smoothing interpolation
      currentX += (targetX - currentX) * 0.04;
      currentY += (targetY - currentY) * 0.04;
      ambientAura.style.top = `${currentY}%`;
      ambientAura.style.left = `${currentX}%`;
      requestAnimationFrame(renderAura);
    }
    renderAura();
  }

  // ------------------------------------------------------------------------
  // 2. Lightbox Modal Controller (for 3D artwork placeholders / inspection)
  // ------------------------------------------------------------------------
  const artworkFrames = document.querySelectorAll('.artwork-frame');
  const lightbox = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-image');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');

  if (lightbox) {
    artworkFrames.forEach((frame) => {
      frame.addEventListener('click', () => {
        const img = frame.querySelector('.artwork-image');
        const card = frame.closest('.artwork-card');
        const titleEl = card ? card.querySelector('.meta-title') : null;
        const numberEl = card ? card.querySelector('.meta-number') : null;

        const titleText = titleEl ? titleEl.textContent.trim() : 'UNTITLED 3D STUDY';
        const numText = numberEl ? numberEl.textContent.trim() : '';

        if (img && img.getAttribute('src')) {
          lightboxImg.src = img.src;
          lightboxImg.style.display = 'block';
        } else {
          // If no image is provided yet, show an artistic placeholder indicator
          lightboxImg.src = '';
          lightboxImg.style.display = 'none';
        }

        if (lightboxCaption) {
          lightboxCaption.textContent = `${numText} — ${titleText}`;
        }

        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }

    if (lightboxClose) {
      lightboxClose.addEventListener('click', closeLightbox);
    }

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
      }
    });
  }

  // ------------------------------------------------------------------------
  // 3. Ethereal Web Audio Ambient Synthesizer
  // Subtle, generative meditative drone (55Hz / 110Hz harmonics)
  // Completely safe, zero external assets, muted until user clicks
  // ------------------------------------------------------------------------
  const soundBtn = document.getElementById('sound-toggle');
  let audioCtx = null;
  let isPlaying = false;
  let masterGain = null;
  let osc1 = null;
  let osc2 = null;

  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      if (!audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContext();

        // Create low-pass filter for deep muffled dreaminess
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 240;

        masterGain = audioCtx.createGain();
        masterGain.gain.setValueAtTime(0, audioCtx.currentTime);

        // Low root drone (A1 = 55Hz)
        osc1 = audioCtx.createOscillator();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(55, audioCtx.currentTime);

        // Ethereal fifth harmonic (E2 = 82.4Hz) with subtle detune
        osc2 = audioCtx.createOscillator();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(82.4, audioCtx.currentTime);

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(masterGain);
        masterGain.connect(audioCtx.destination);

        osc1.start();
        osc2.start();
      }

      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      if (!isPlaying) {
        masterGain.gain.setTargetAtTime(0.08, audioCtx.currentTime, 0.8);
        soundBtn.classList.add('playing');
        soundBtn.setAttribute('aria-pressed', 'true');
        const textSpan = soundBtn.querySelector('.sound-btn-text');
        if (textSpan) textSpan.textContent = 'ATMOSPHERE: ACTIVE';
        isPlaying = true;
      } else {
        masterGain.gain.setTargetAtTime(0, audioCtx.currentTime, 0.4);
        soundBtn.classList.remove('playing');
        soundBtn.setAttribute('aria-pressed', 'false');
        const textSpan = soundBtn.querySelector('.sound-btn-text');
        if (textSpan) textSpan.textContent = 'ATMOSPHERE: MUTE';
        isPlaying = false;
      }
    });
  }

  // ------------------------------------------------------------------------
  // 4. Image Load Detection (Shows image smoothly when user adds src)
  // ------------------------------------------------------------------------
  document.querySelectorAll('.artwork-image').forEach((img) => {
    if (img.getAttribute('src') && img.getAttribute('src').trim() !== '') {
      img.addEventListener('load', () => {
        img.classList.add('loaded');
        const placeholderContent = img.parentElement.querySelector('.frame-placeholder-content');
        if (placeholderContent) {
          placeholderContent.style.opacity = '0';
        }
      });
      if (img.complete) {
        img.classList.add('loaded');
        const placeholderContent = img.parentElement.querySelector('.frame-placeholder-content');
        if (placeholderContent) {
          placeholderContent.style.opacity = '0';
        }
      }
    }
  });

})();
