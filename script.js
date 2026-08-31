// Interactive Logic & White-Blue Glassmorphism Particle Engine for WarungPOS

document.addEventListener('DOMContentLoaded', () => {

  // 1. INITIALIZE INTERACTIVE CANVAS PARTICLES
  initParticles();

  // 2. MOBILE MENU TOGGLE
  const btnMobileMenu = document.getElementById('btn-mobile-menu');
  const mobileMenu = document.getElementById('mobile-menu');

  if (btnMobileMenu && mobileMenu) {
    btnMobileMenu.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });
  }

  // 3. INTERACTIVE UMKM PROFIT & TIME CALCULATOR
  const calcTrans = document.getElementById('calc-trans');
  const calcBasket = document.getElementById('calc-basket');
  const calcTransVal = document.getElementById('calc-trans-val');
  const calcBasketVal = document.getElementById('calc-basket-val');
  const calcOmsetRes = document.getElementById('calc-omset-res');
  const calcTimeRes = document.getElementById('calc-time-res');

  function updateCalculations() {
    if (!calcTrans || !calcBasket) return;

    const transCount = parseInt(calcTrans.value) || 60;
    const basketSize = parseInt(calcBasket.value) || 35000;

    // Update text labels
    if (calcTransVal) calcTransVal.textContent = `${transCount} Nota / hari`;
    if (calcBasketVal) calcBasketVal.textContent = `Rp ${basketSize.toLocaleString('id-ID')}`;

    // Calculations
    const dailyOmset = transCount * basketSize;
    const monthlyOmset = dailyOmset * 30;

    // Time saved calculation (~1.5 minutes saved per transaction in logging/checkout + end-of-day reconciliation)
    const minutesSavedDaily = (transCount * 1.5) + 30;
    const hoursSavedMonthly = Math.round((minutesSavedDaily * 30) / 60);

    // Update UI Results
    if (calcOmsetRes) calcOmsetRes.textContent = `Rp ${monthlyOmset.toLocaleString('id-ID')}`;
    if (calcTimeRes) calcTimeRes.textContent = `${hoursSavedMonthly} Jam / Bulan`;
  }

  if (calcTrans && calcBasket) {
    calcTrans.addEventListener('input', updateCalculations);
    calcBasket.addEventListener('input', updateCalculations);
    updateCalculations();
  }

  // 4. FAQ ACCORDION TOGGLE
  const faqToggles = document.querySelectorAll('.faq-toggle');
  faqToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const content = toggle.nextElementSibling;
      const isActive = toggle.classList.contains('active');

      // Close all other open FAQs
      faqToggles.forEach(otherToggle => {
        otherToggle.classList.remove('active');
        if (otherToggle.nextElementSibling) {
          otherToggle.nextElementSibling.classList.add('hidden');
        }
      });

      // Toggle clicked FAQ
      if (!isActive) {
        toggle.classList.add('active');
        if (content) content.classList.remove('hidden');
      }
    });
  });

  // 5. HEADER BACKDROP SCROLL SHADOW
  const header = document.getElementById('main-header');
  window.addEventListener('scroll', () => {
    if (!header) return;
    if (window.scrollY > 20) {
      header.classList.add('shadow-md', 'bg-white/95');
      header.classList.remove('bg-white/85');
    } else {
      header.classList.remove('shadow-md', 'bg-white/95');
      header.classList.add('bg-white/85');
    }
  });

  // 6. LATEST .EXE RELEASE FETCHER (FOR PRIVATE REPOSITORIES & WEB HOSTING)
  function applyReleaseData(data) {
    if (!data || !data.version) return;
    const downloadBtns = document.querySelectorAll('.btn-download-exe');
    const versionBadges = document.querySelectorAll('.version-text');
    const releaseDateTexts = document.querySelectorAll('.release-date-text');
    const fileSizeTexts = document.querySelectorAll('.file-size-text');

    downloadBtns.forEach(btn => {
      if (data.downloadUrl) btn.setAttribute('href', data.downloadUrl);
    });

    versionBadges.forEach(badge => {
      badge.textContent = `v${data.version}`;
    });

    releaseDateTexts.forEach(txt => {
      if (data.releaseDate) txt.textContent = data.releaseDate;
    });

    fileSizeTexts.forEach(txt => {
      if (data.fileSize) txt.textContent = data.fileSize;
    });
  }

  if (window.WARUNGPOS_RELEASE) {
    applyReleaseData(window.WARUNGPOS_RELEASE);
  } else {
    fetch('./latest.json')
      .then(res => res.json())
      .then(data => applyReleaseData(data))
      .catch(err => console.log('Offline mode using fallback release data:', err));
  }

  // 7. DARK THEME TOGGLE & PERSISTENCE
  initThemeToggle();
});

// DARK THEME TOGGLE ENGINE & LOGO SWAPPER
function initThemeToggle() {
  const toggleBtns = document.querySelectorAll('#theme-toggle, #theme-toggle-mobile');
  const logoImgs = document.querySelectorAll('.site-logo');
  const sunIcons = document.querySelectorAll('.theme-toggle-sun');
  const moonIcons = document.querySelectorAll('.theme-toggle-moon');

  function applyTheme(isDark) {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      logoImgs.forEach(img => {
        img.src = './assets/logo_musang_dark-theme.png';
      });
      sunIcons.forEach(icon => icon.classList.remove('hidden'));
      moonIcons.forEach(icon => icon.classList.add('hidden'));
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      logoImgs.forEach(img => {
        img.src = './assets/logo_musang.png';
      });
      sunIcons.forEach(icon => icon.classList.add('hidden'));
      moonIcons.forEach(icon => icon.classList.remove('hidden'));
    }
  }

  // Detect current active theme state
  const isDark = document.documentElement.classList.contains('dark') ||
    (localStorage.getItem('theme') === 'dark') ||
    (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);

  applyTheme(isDark);

  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const isCurrentlyDark = document.documentElement.classList.contains('dark');
      applyTheme(!isCurrentlyDark);
    });
  });
}

// INTERACTIVE PARTICLES ENGINE
function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const particleCount = 65;

  let mouse = {
    x: null,
    y: null,
    radius: 140
  };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', () => {
    resize();
    createParticles();
  });

  resize();

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.8;
      this.vy = (Math.random() - 0.5) * 0.8;
      this.radius = Math.random() * 2.5 + 1.2;

      // Color variation: Electric Blue, Cyan, Indigo, Soft White
      const colors = [
        'rgba(37, 99, 235, 0.45)',  // Blue
        'rgba(2, 132, 199, 0.45)',  // Sky
        'rgba(6, 182, 212, 0.4)',   // Cyan
        'rgba(99, 102, 241, 0.35)', // Indigo
        'rgba(255, 255, 255, 0.6)'  // White Glow
      ];
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0) this.x = width;
      if (this.x > width) this.x = 0;
      if (this.y < 0) this.y = height;
      if (this.y > height) this.y = 0;

      // Mouse repulsion/attraction interaction
      if (mouse.x !== null && mouse.y !== null) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          let force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 2;
          this.y -= (dy / dist) * force * 2;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.shadowColor = 'rgba(59, 130, 246, 0.4)';
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  function createParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }

  createParticles();

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Draw connecting lines between close particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        let dx = particles[i].x - particles[j].x;
        let dy = particles[i].y - particles[j].y;
        let dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          let alpha = (1 - dist / 110) * 0.25;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(59, 130, 246, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(animate);
  }

  animate();
}
