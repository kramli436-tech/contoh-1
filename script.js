// ======================================================
//  LILEVY.AE FINAL SCRIPT — NAVBAR, DARK MODE, MUSIC, ANIMATION
// ======================================================
(() => {
  'use strict';

  // ---------- ELEMENT REFERENSI ----------
  const burger = document.getElementById('burger');
  const navList = document.querySelector('.menu ul');
  const themeToggle = document.getElementById('themeToggle');
  const musicToggle = document.getElementById('musicToggle');
  const body = document.body;
  const commentForm = document.getElementById('commentForm');
  const commentsDisplay = document.getElementById('commentsDisplay');
  const faders = document.querySelectorAll('.fade-in');
  const hero = document.getElementById('home');
  const bgMusic = document.getElementById('bgMusic');

  // ======================================================
  //  NAVBAR BURGER MENU
  // ======================================================
  if (burger && navList) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('active');
      navList.classList.toggle('show');
    });

    navList.addEventListener('click', (e) => {
      if (e.target.tagName === 'A' && window.innerWidth <= 900) {
        burger.classList.remove('active');
        navList.classList.remove('show');
      }
    });

    document.addEventListener('click', (e) => {
      if (window.innerWidth <= 900) {
        if (!navList.contains(e.target) && !burger.contains(e.target)) {
          burger.classList.remove('active');
          navList.classList.remove('show');
        }
      }
    });
  }

  // ======================================================
  //  DARK / LIGHT MODE TOGGLE
  // ======================================================
  const setThemeIcon = (isDark) => {
    themeToggle.innerHTML = isDark ? '<span>☀️</span>' : '<span>🌙</span>';
  };

  try {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
      body.classList.add('dark-mode');
      setThemeIcon(true);
    } else {
      body.classList.remove('dark-mode');
      setThemeIcon(false);
    }
  } catch {
    setThemeIcon(false);
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isDark = body.classList.toggle('dark-mode');
      setThemeIcon(isDark);
      try {
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
      } catch {}
    });
  }

  // ======================================================
  //  KOMENTAR (LOCAL STORAGE)
  // ======================================================
  function getSavedComments() {
    try {
      return JSON.parse(localStorage.getItem('comments')) || [];
    } catch {
      return [];
    }
  }

  function saveComments(comments) {
    try {
      localStorage.setItem('comments', JSON.stringify(comments));
    } catch {}
  }

  function createCommentElement(c) {
    const el = document.createElement('div');
    el.className = 'comment';
    const name = document.createElement('h4');
    name.textContent = c.name;
    const p = document.createElement('p');
    p.textContent = c.text;
    const small = document.createElement('small');
    small.textContent = c.time;
    el.appendChild(name);
    el.appendChild(p);
    el.appendChild(small);
    return el;
  }

  function displayComments() {
    if (!commentsDisplay) return;
    const saved = getSavedComments();
    commentsDisplay.innerHTML = '<h3>Komentar:</h3>';
    saved.forEach(c => commentsDisplay.appendChild(createCommentElement(c)));
  }

  if (commentForm) {
    commentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameEl = document.getElementById('name');
      const commentEl = document.getElementById('comment');
      if (!nameEl || !commentEl) return;

      const name = nameEl.value.trim();
      const text = commentEl.value.trim();
      if (!name || !text) return;

      const newComment = {
        name,
        text,
        time: new Date().toLocaleString('id-ID')
      };

      const saved = getSavedComments();
      saved.push(newComment);
      saveComments(saved);
      displayComments();
      commentForm.reset();

      setTimeout(() => {
        commentsDisplay.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }, 120);
    });
  }

  displayComments();

  // ======================================================
  //  FADE-IN ON SCROLL (Intersection Observer)
  // ======================================================
  if ('IntersectionObserver' in window && faders.length) {
    const appearOptions = { threshold: 0.15, rootMargin: "0px 0px -50px 0px" };
    const appearOnScroll = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('show');
        observer.unobserve(entry.target);
      });
    }, appearOptions);
    faders.forEach(f => appearOnScroll.observe(f));
  } else {
    faders.forEach(f => f.classList.add('show'));
  }

  // ======================================================
  //  PARALLAX HERO (non-mobile)
  // ======================================================
  const enableParallax = () => {
    if (!hero) return;
    const onScroll = () => {
      const offset = window.pageYOffset;
      hero.style.backgroundPositionY = (offset * 0.35) + 'px';
    };
    if (window.innerWidth > 768) {
      window.addEventListener('scroll', onScroll);
      onScroll();
    } else {
      hero.style.backgroundPositionY = 'center';
    }
  };

  enableParallax();
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(enableParallax, 150);
  });

  // ======================================================
  //  BACKGROUND MUSIC — FADE-IN + MUTE + AUTOPLAY FIX
  // ======================================================
  (function musicControl() {
    if (!bgMusic) return;
    let fadeInterval;

    function fadeIn(audio, duration = 2000) {
      clearInterval(fadeInterval);
      audio.volume = 0;
      audio.play().catch(() => {});
      let volume = 0;
      const step = 0.05;
      fadeInterval = setInterval(() => {
        if (volume < 1.0) {
          volume = Math.min(volume + step, 1.0);
          audio.volume = volume;
        } else {
          clearInterval(fadeInterval);
        }
      }, Math.max(10, duration * step));
    }

    if (bgMusic.readyState >= 2) fadeIn(bgMusic, 2200);
    else {
      bgMusic.addEventListener('canplay', () => fadeIn(bgMusic, 2200), { once: true });
      window.addEventListener('load', () => setTimeout(() => fadeIn(bgMusic, 2200), 100), { once: true });
    }

    // Tombol Mute/Unmute
    if (musicToggle) {
      musicToggle.addEventListener('click', () => {
        bgMusic.muted = !bgMusic.muted;
        musicToggle.innerHTML = bgMusic.muted ? '<span>🔇</span>' : '<span>🔊</span>';
      });
    }

    // AUTOPLAY FIX UNTUK HP: aktif setelah tap pertama
    document.addEventListener('touchstart', enableAudioOnce, { once: true });
    document.addEventListener('click', enableAudioOnce, { once: true });

    function enableAudioOnce() {
      if (bgMusic && bgMusic.paused) {
        bgMusic.play().catch(() => {});
        bgMusic.muted = false;
        if (musicToggle) musicToggle.innerHTML = '<span>🔊</span>';
      }
    }
  })();

  // ======================================================
  //  ESC MENUTUP MENU MOBILE
  // ======================================================
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (burger && navList) {
        burger.classList.remove('active');
        navList.classList.remove('show');
      }
    }
  });

})();
