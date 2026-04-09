document.addEventListener('DOMContentLoaded', () => {

  // ── Cursor Glow ──
  const glow = document.getElementById('cursorGlow');
  if (glow && window.innerWidth > 768) {
    let mx = 0, my = 0, gx = 0, gy = 0;
    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
    (function animate() {
      gx += (mx - gx) * 0.08;
      gy += (my - gy) * 0.08;
      glow.style.left = gx + 'px';
      glow.style.top = gy + 'px';
      requestAnimationFrame(animate);
    })();
  }

  // ── Floating Nav ──
  const nav = document.getElementById('floatingNav');
  const sections = document.querySelectorAll('.section, .hero');
  const navLinks = document.querySelectorAll('.nav-links a');

  const updateNav = () => {
    if (window.scrollY > 100) {
      nav.classList.add('visible');
    } else {
      nav.classList.remove('visible');
    }

    let current = '';
    sections.forEach(s => {
      const top = s.offsetTop - 200;
      if (window.scrollY >= top) current = s.id;
    });
    navLinks.forEach(a => {
      a.classList.toggle('active', a.dataset.section === current);
    });
  };

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  // ── Smooth scroll for nav links ──
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ── Reveal on Scroll ──
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  reveals.forEach(el => observer.observe(el));

  // ── Counter Animation ──
  const counters = document.querySelectorAll('.stat-number[data-target]');
  let countersAnimated = false;

  const animateCounters = () => {
    if (countersAnimated) return;
    countersAnimated = true;

    counters.forEach(counter => {
      const target = parseInt(counter.dataset.target);
      const duration = 2000;
      const start = performance.now();

      const easeOutQuart = t => 1 - Math.pow(1 - t, 4);

      const update = now => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const value = Math.floor(easeOutQuart(progress) * target);

        if (target >= 10000) {
          counter.textContent = (value / 10000).toFixed(1) + 'w';
        } else {
          counter.textContent = value.toLocaleString();
        }

        if (progress < 1) requestAnimationFrame(update);
      };

      requestAnimationFrame(update);
    });
  };

  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) {
    const statsObserver = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        animateCounters();
        statsObserver.disconnect();
      }
    }, { threshold: 0.5 });
    statsObserver.observe(heroStats);
  }

  // ── Typing Effect ──
  const typingEl = document.getElementById('typingText');
  const phrases = [
    'AI Agent 系统架构师',
    'Claude Code 源码分析者',
    'Multi-Agent 编排专家',
    '开源社区贡献者',
    '中科大在读硕士',
  ];

  let phraseIdx = 0, charIdx = 0, deleting = false;

  const type = () => {
    const current = phrases[phraseIdx];
    if (!deleting) {
      typingEl.textContent = current.substring(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        setTimeout(() => { deleting = true; type(); }, 2000);
        return;
      }
      setTimeout(type, 80);
    } else {
      typingEl.textContent = current.substring(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        setTimeout(type, 500);
        return;
      }
      setTimeout(type, 40);
    }
  };

  setTimeout(type, 1000);

  // ── Tilt effect on project cards ──
  document.querySelectorAll('.project-card, .achievement-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / centerY * -3;
      const rotateY = (x - centerX) / centerX * 3;
      card.style.transform = `translateY(-6px) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // ── Parallax for gradient orbs ──
  if (window.innerWidth > 768) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      document.querySelectorAll('.gradient-orb').forEach((orb, i) => {
        const speed = 0.1 + i * 0.05;
        orb.style.transform = `translateY(${scrolled * speed}px)`;
      });
    }, { passive: true });
  }

});
