
// ============================================
// 1. PRELOADER LOGIC (With Safety Fallback)
// ============================================
const hidePreloader = () => {
  const loader = document.getElementById('preloader');
  if (loader && loader.style.display !== 'none') {
    loader.style.opacity = '0';
    setTimeout(() => {
      loader.style.display = 'none';
    }, 800);
  }
};

window.addEventListener('load', hidePreloader);
// Fallback so preloader never blocks the page if external assets load slowly
setTimeout(hidePreloader, 1500);

// ============================================
// 2. HEADER SCROLL EFFECT
// ============================================
window.addEventListener('scroll', () => {
  const header = document.querySelector('header');
  if (header) {
    if (window.scrollY > 50) {
      header.style.height = '56px';
      header.style.borderColor = 'rgba(59, 130, 246, 0.25)';
      header.style.background = 'rgba(5, 7, 12, 0.92)';
      header.style.boxShadow = '0 6px 28px rgba(0, 0, 0, 0.65)';
    } else {
      header.style.height = '60px';
      header.style.borderColor = 'rgba(255, 255, 255, 0.08)';
      header.style.background = 'rgba(7, 10, 16, 0.82)';
      header.style.boxShadow = '0 4px 24px rgba(0, 0, 0, 0.55)';
    }
  }
});

// ============================================
// 3. MOBILE NAVIGATION
// ============================================
const hamburger = document.querySelector('.hamburger');
const mobileNav = document.querySelector('.mobile-nav');

if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open');
    document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : 'auto';
  });

  mobileNav.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
      document.body.style.overflow = 'auto';
    }
  });
}

// ============================================
// 4. SCROLL REVEAL ANIMATIONS (IntersectionObserver)
// ============================================
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
revealElements.forEach(el => revealObserver.observe(el));

// ============================================
// 5. AMBIENT DARK STARFIELD / DUST CANVAS (Optimized)
// ============================================
const canvas = document.getElementById('starfield');
if (canvas && canvas.getContext) {
  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  let mouseX = 0, mouseY = 0;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Only run if not reduced motion
  if (!prefersReduced) {
    let frameId = null;
    let isVisible = true;

    function resize() {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;

      // Avoid full particle wipe on minor mobile address bar resize
      if (particles.length > 0 && Math.abs(width - newWidth) < 20 && Math.abs(height - newHeight) < 120) {
        width = canvas.width = newWidth;
        height = canvas.height = newHeight;
        return;
      }

      width = canvas.width = newWidth;
      height = canvas.height = newHeight;
      particles = [];
      const count = Math.min(80, Math.floor((width * height) / 15000));
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 1.2 + 0.3,
          alpha: Math.random() * 0.4 + 0.1,
          speedX: (Math.random() - 0.5) * 0.15,
          speedY: (Math.random() - 0.5) * 0.15,
          pulseSpeed: Math.random() * 0.015 + 0.005,
          color: Math.random() > 0.4 ? '240, 246, 255' : '96, 165, 250'
        });
      }
    }

    // Throttled mouse move
    let mouseTimeout;
    window.addEventListener('mousemove', (e) => {
      if (!mouseTimeout) {
        mouseTimeout = requestAnimationFrame(() => {
          mouseX = (e.clientX - width / 2) * 0.035;
          mouseY = (e.clientY - height / 2) * 0.035;
          mouseTimeout = null;
        });
      }
    });

    window.addEventListener('resize', resize);

    // Pause animation when tab is hidden
    document.addEventListener('visibilitychange', () => {
      isVisible = !document.hidden;
      if (isVisible && !frameId) {
        render();
      }
    });

    function render() {
      if (!isVisible) {
        frameId = null;
        return;
      }

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.speedX;
        p.y += p.speedY;
        p.alpha += Math.sin(Date.now() * p.pulseSpeed) * 0.005;
        p.alpha = Math.max(0.08, Math.min(0.65, p.alpha));

        if (p.x < 0) p.x += width;
        if (p.x > width) p.x -= width;
        if (p.y < 0) p.y += height;
        if (p.y > height) p.y -= height;

        const drawX = p.x - mouseX * (p.radius * 0.6);
        const drawY = p.y - mouseY * (p.radius * 0.6);

        ctx.beginPath();
        ctx.arc(drawX, drawY, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
        ctx.fill();
      }

      frameId = requestAnimationFrame(render);
    }

    resize();
    render();
  }
}

// ============================================
// 6. PORTFOLIO AUDIO LOGIC
// ============================================
const audioPlayers = document.querySelectorAll('.audio-item');
let currentAudio = null;

audioPlayers.forEach(item => {
  const audio = item.querySelector('audio');
  const span = item.querySelector('.overlay span');

  if (audio) {
    item.addEventListener('click', () => {
      if (audio.paused) {
        if (currentAudio && currentAudio !== audio) {
          currentAudio.pause();
          currentAudio.currentTime = 0;
          currentAudio.parentElement.querySelector('.overlay span').textContent = 'play';
        }
        audio.play();
        span.textContent = 'pause';
        currentAudio = audio;
      } else {
        audio.pause();
        span.textContent = 'play';
        currentAudio = null;
      }
    });

    audio.addEventListener('ended', () => {
      span.textContent = 'play';
      currentAudio = null;
    });
  }
});

// ============================================
// 7. YOUTUBE VIDEO MODAL (WORK CARDS & VIDEO ITEMS)
// ============================================
const modal = document.getElementById('video-modal');
const modalIframe = modal ? modal.querySelector('iframe') : null;
const closeModal = document.querySelector('.close-modal');

// Function to open video modal
function openVideoModal(videoId) {
  // Stop any playing audio
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.parentElement.querySelector('.overlay span').textContent = 'play';
    currentAudio = null;
  }

  if (modal && modalIframe) {
    modalIframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

// Function to close video modal
function closeVideoModal() {
  if (modal && modalIframe) {
    modal.classList.remove('open');
    modalIframe.src = '';
    document.body.style.overflow = 'auto';
  }
}

// Close modal with × button
if (closeModal) {
  closeModal.addEventListener('click', closeVideoModal);
}

// Close modal on outside click
if (modal) {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeVideoModal();
  });
}

// Handle work-card clicks (Mix & Master videos)
document.querySelectorAll('.work-card').forEach(item => {
  item.addEventListener('click', () => {
    const videoId = item.getAttribute('data-video');
    if (videoId) {
      openVideoModal(videoId);
    }
  });
});

// Handle video-item clicks (Film Sound videos)
document.querySelectorAll('.video-item').forEach(item => {
  item.addEventListener('click', () => {
    const videoId = item.getAttribute('data-video');
    if (videoId) {
      openVideoModal(videoId);
    }
  });
});

// ============================================
// 8. COVER ART MODAL
// ============================================
function openCoverModal(imageSrc, title, artist) {
  let coverModal = document.getElementById('cover-modal');

  // Create modal if it doesn't exist
  if (!coverModal) {
    coverModal = document.createElement('div');
    coverModal.id = 'cover-modal';
    coverModal.className = 'modal';
    coverModal.innerHTML = `
      <div class="modal-content" style="max-width: 580px; aspect-ratio: auto; background: transparent; display: flex; flex-direction: column; align-items: center; position: relative; border: none; box-shadow: none;">
        <span class="close-modal" id="cover-close-btn" style="position: absolute; top: -42px; right: 4px; color: var(--text-secondary); font-size: 2.2rem; cursor: pointer; z-index: 10; opacity: 0.8; transition: opacity 0.2s, color 0.2s;">&times;</span>
        <img id="cover-modal-img" src="" alt="Cover Art" style="width: 100%; height: auto; border-radius: 18px; box-shadow: 0 12px 40px rgba(0,0,0,0.75); border: 1px solid rgba(255, 255, 255, 0.08);">
        <div style="text-align: center; margin-top: 1.4rem; color: var(--text-primary);">
          <h3 id="cover-modal-title" style="font-size: 1.35rem; font-weight: 500; letter-spacing: 0; margin-bottom: 0.25rem; font-family: inherit; color: var(--text-primary);">Title</h3>
          <p id="cover-modal-artist" style="font-size: 0.92rem; color: var(--text-muted); font-family: inherit;">Artist</p>
        </div>
      </div>
    `;
    document.body.appendChild(coverModal);

    // Close on outside click
    coverModal.addEventListener('click', function (e) {
      if (e.target === coverModal) {
        closeCoverModal();
      }
    });

    // Close with × button
    document.getElementById('cover-close-btn')?.addEventListener('click', function () {
      closeCoverModal();
    });
  }

  // Update modal content
  const img = document.getElementById('cover-modal-img');
  const titleEl = document.getElementById('cover-modal-title');
  const artistEl = document.getElementById('cover-modal-artist');

  if (img) img.src = imageSrc;
  if (titleEl) titleEl.textContent = title;
  if (artistEl) artistEl.textContent = artist;

  // Open modal
  coverModal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCoverModal() {
  const coverModal = document.getElementById('cover-modal');
  if (coverModal) {
    coverModal.classList.remove('open');
    document.body.style.overflow = 'auto';
  }
}

// Bind to window for global inline onclick support
window.openCoverModal = openCoverModal;
window.closeCoverModal = closeCoverModal;
window.openVideoModal = openVideoModal;
window.closeVideoModal = closeVideoModal;

// ============================================
// 9. CLOSE MODALS WITH ESCAPE KEY
// ============================================
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeVideoModal();
    closeCoverModal();
  }
});

// ============================================
// 10. BOOKING SESSION SELECTION & PREFILL
// ============================================
const bookingButtons = document.querySelectorAll('.booking-btn');
const contactMessage = document.getElementById('contact-message');

bookingButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const plan = btn.getAttribute('data-plan');
    if (contactMessage && plan) {
      contactMessage.value = `Hello Ocompos,\n\nI would like to book a session for: ${plan}.\n\nPreferred dates/times:\nArtist / Project Name:\nAdditional notes: `;
      setTimeout(() => {
        contactMessage.focus();
      }, 350);
    }
  });
});

// ============================================
// 11. SMOOTH SCROLL FOR NAV LINKS
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;

    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const headerHeight = document.querySelector('header')?.offsetHeight || 0;
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// ============================================
// 12. 3D HERO INTERACTION (Viewport Client Coordinates)
// ============================================
const container = document.querySelector('.hero-container');
const content = document.getElementById('heroContent');

if (container && content) {
  const handleTilt = (clientX, clientY) => {
    const rect = container.getBoundingClientRect();
    // Only tilt when hero is within viewport
    if (rect.bottom < 0 || rect.top > window.innerHeight) return;

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const percentX = (clientX - centerX) / (rect.width / 2);
    const percentY = (clientY - centerY) / (rect.height / 2);

    const maxDeg = 10;
    const rotateY = Math.max(-maxDeg, Math.min(maxDeg, -percentX * maxDeg));
    const rotateX = Math.max(-maxDeg, Math.min(maxDeg, percentY * maxDeg));

    content.style.transform = `rotateY(${rotateY.toFixed(2)}deg) rotateX(${rotateX.toFixed(2)}deg)`;
  };

  // Mouse Movement (Desktop)
  container.addEventListener('mousemove', (e) => {
    handleTilt(e.clientX, e.clientY);
  });

  // Touch Movement (Mobile/Tablet)
  container.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches[0]) {
      handleTilt(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  // Reset to flat when mouse leaves
  container.addEventListener('mouseleave', () => {
    content.style.transform = 'rotateY(0deg) rotateX(0deg)';
    content.style.transition = 'transform 0.6s ease-out';
  });

  // Remove transition on mouse enter for smooth follow
  container.addEventListener('mouseenter', () => {
    content.style.transition = 'none';
  });
}

// ============================================
// 13. CONSOLE LOG (optional)
// ============================================
console.log('🎵 ByOcompos - Audio Engineer');
console.log('📧 contact@byocompos.com');