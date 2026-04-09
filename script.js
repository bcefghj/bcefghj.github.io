document.addEventListener('DOMContentLoaded', () => {

  // ── GitHub API: Fetch live stats ──
  const GH_USER = 'bcefghj';

  async function fetchGitHubStats() {
    try {
      const [userRes, reposRes] = await Promise.all([
        fetch(`https://api.github.com/users/${GH_USER}`),
        fetch(`https://api.github.com/users/${GH_USER}/repos?per_page=100&sort=stars`)
      ]);

      if (!userRes.ok || !reposRes.ok) return;

      const user = await userRes.json();
      const repos = await reposRes.json();

      const totalStars = repos.reduce((sum, r) => sum + r.stargazers_count, 0);
      const totalRepos = user.public_repos;
      const followers = user.followers;

      animateNumber(document.getElementById('statStars'), totalStars);
      animateNumber(document.getElementById('statRepos'), totalRepos, '+');
      animateNumber(document.getElementById('statFollowers'), followers);

      const aboutStars = document.getElementById('aboutStars');
      if (aboutStars) aboutStars.textContent = totalStars + '+';
      const aboutRepos = document.getElementById('aboutRepos');
      if (aboutRepos) aboutRepos.textContent = totalRepos + '+';
      const achieveGh = document.getElementById('achieveGithub');
      if (achieveGh) achieveGh.textContent = `${totalStars} Stars · ${followers} Followers · ${totalRepos}+ Repos`;
      const totalBtn = document.getElementById('totalReposBtn');
      if (totalBtn) totalBtn.textContent = totalRepos + '+';

      // Update individual repo star counts
      const repoMap = {};
      repos.forEach(r => { repoMap[r.name] = r.stargazers_count; });

      document.querySelectorAll('[data-repo]').forEach(el => {
        const name = el.dataset.repo;
        if (repoMap[name] !== undefined) {
          const starEl = el.querySelector('.live-stars') || el.querySelector('.showcase-stars');
          if (starEl) {
            if (starEl.classList.contains('showcase-stars')) {
              starEl.textContent = '⭐ ' + repoMap[name];
            } else {
              starEl.textContent = repoMap[name];
            }
          }
        }
      });

      document.querySelectorAll('.showcase-stars[data-repo]').forEach(el => {
        const name = el.dataset.repo;
        if (repoMap[name] !== undefined) {
          el.textContent = '⭐ ' + repoMap[name];
        }
      });

    } catch (e) {
      // Fallback: show static values
      const el = document.getElementById('statStars');
      if (el && el.textContent === '--') {
        animateNumber(el, 1434);
        animateNumber(document.getElementById('statRepos'), 56, '+');
        animateNumber(document.getElementById('statFollowers'), 221);
      }
    }
  }

  function animateNumber(el, target, suffix) {
    if (!el) return;
    const duration = 2000;
    const start = performance.now();
    const easeOut = t => 1 - Math.pow(1 - t, 4);

    function update(now) {
      const progress = Math.min((now - start) / duration, 1);
      const value = Math.floor(easeOut(progress) * target);
      el.textContent = value.toLocaleString() + (suffix || '');
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  fetchGitHubStats();

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

  // ── Particle Field ──
  const particleField = document.getElementById('particleField');
  if (particleField && window.innerWidth > 768) {
    for (let i = 0; i < 40; i++) {
      const p = document.createElement('div');
      p.style.cssText = `
        position:absolute;
        width:${2 + Math.random() * 3}px;
        height:${2 + Math.random() * 3}px;
        background:rgba(59,130,246,${0.1 + Math.random() * 0.3});
        border-radius:50%;
        left:${Math.random() * 100}%;
        top:${Math.random() * 100}%;
        animation:particleDrift ${10 + Math.random() * 20}s linear infinite;
        animation-delay:${-Math.random() * 20}s;
      `;
      particleField.appendChild(p);
    }
    const style = document.createElement('style');
    style.textContent = `@keyframes particleDrift{0%{transform:translate(0,0) scale(1);opacity:0}10%{opacity:1}90%{opacity:1}100%{transform:translate(${Math.random()>0.5?'':'-'}${50+Math.random()*100}px,${-100-Math.random()*200}px) scale(0);opacity:0}}`;
    document.head.appendChild(style);
  }

  // ── Floating Nav ──
  const nav = document.getElementById('floatingNav');
  const sections = document.querySelectorAll('.section, .hero');
  const navLinks = document.querySelectorAll('.nav-links a');

  const updateNav = () => {
    nav.classList.toggle('visible', window.scrollY > 100);
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 200) current = s.id;
    });
    navLinks.forEach(a => a.classList.toggle('active', a.dataset.section === current));
  };
  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });

  // ── Reveal on Scroll ──
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

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
      if (charIdx === current.length) { setTimeout(() => { deleting = true; type(); }, 2000); return; }
      setTimeout(type, 80);
    } else {
      typingEl.textContent = current.substring(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) { deleting = false; phraseIdx = (phraseIdx + 1) % phrases.length; setTimeout(type, 500); return; }
      setTimeout(type, 40);
    }
  };
  setTimeout(type, 1000);

  // ── Tilt effect on cards ──
  document.querySelectorAll('.project-card, .achievement-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-6px) perspective(800px) rotateX(${y * -4}deg) rotateY(${x * 4}deg)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });

  // ── Gallery Lightbox ──
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.innerHTML = '<button class="lightbox-close">&times;</button><img src="" alt="">';
  document.body.appendChild(lightbox);

  const lbImg = lightbox.querySelector('img');
  const lbClose = lightbox.querySelector('.lightbox-close');

  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const src = item.querySelector('img').src;
      lbImg.src = src;
      lightbox.classList.add('active');
    });
  });

  lbClose.addEventListener('click', () => lightbox.classList.remove('active'));
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) lightbox.classList.remove('active');
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') lightbox.classList.remove('active');
  });

  // ── Parallax orbs ──
  if (window.innerWidth > 768) {
    window.addEventListener('scroll', () => {
      const s = window.scrollY;
      document.querySelectorAll('.gradient-orb').forEach((orb, i) => {
        orb.style.transform = `translateY(${s * (0.1 + i * 0.05)}px)`;
      });
    }, { passive: true });
  }

});
