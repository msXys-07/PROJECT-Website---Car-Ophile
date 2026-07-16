/* ─── Car O'phile | script.js ─────────────────────────────────────────────── */

'use strict';

/* ══════════════════════════════════════════════════════════
   1. CUSTOM CURSOR
══════════════════════════════════════════════════════════ */
(function initCursor() {
  const dot  = document.createElement('div');
  const ring = document.createElement('div');
  dot.id  = 'cursor-dot';
  ring.id = 'cursor-ring';
  document.body.appendChild(dot);
  document.body.appendChild(ring);

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left  = mx + 'px';
    dot.style.top   = my + 'px';
  });

  // Ring follows with smooth lag
  (function animateRing() {
    rx += (mx - rx) * 0.15;
    ry += (my - ry) * 0.15;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animateRing);
  })();

  // Change cursor color on interactive elements
  const interactives = 'a, button, input, [data-hover]';
  document.addEventListener('mouseover', e => {
    if (e.target.matches(interactives)) {
      dot.style.background   = 'var(--neon-pink)';
      dot.style.boxShadow    = 'var(--glow-pink)';
    }
  });
  document.addEventListener('mouseout', e => {
    if (e.target.matches(interactives)) {
      dot.style.background   = 'var(--neon-cyan)';
      dot.style.boxShadow    = 'var(--glow-spread)';
    }
  });
})();


/* ══════════════════════════════════════════════════════════
   2. SCROLL-REVEAL
══════════════════════════════════════════════════════════ */
(function initReveal() {
  // Mark revealable elements
  const targets = document.querySelectorAll(
    'main > h2, main > img, main > ul, main > p, table, footer > *'
  );

  targets.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(el => observer.observe(el));
})();


/* ══════════════════════════════════════════════════════════
   3. SPEED BAR VISUALISATION (injected after each car block)
══════════════════════════════════════════════════════════ */
(function initSpeedBars() {
  const carData = [
    { name: 'Koenigsegg Jesko Absolut',   speed: 531,    color: '#00f5ff' },
    { name: 'Yangwang U9 Extreme',         speed: 496.22, color: '#39ff14' },
    { name: 'Bugatti Chiron SS 300+',      speed: 490.48, color: '#ff0080' },
    { name: 'SSC Tuatara',                 speed: 475,    color: '#ffe600' },
    { name: 'Bugatti W16 Mistral',         speed: 453.9,  color: '#ff6600' },
    { name: 'Bugatti Tourbillon',          speed: 445,    color: '#00f5ff' },
    { name: 'Hennessey Venom F5',          speed: 438,    color: '#39ff14' },
    { name: 'Rimac Nevera R',              speed: 431.45, color: '#ff0080' },
    { name: 'Aspark Owl',                  speed: 413,    color: '#ffe600' },
    { name: 'Czinger 21C V Max',           speed: 407,    color: '#ff6600' },
  ];

  const MAX_SPEED = 531;
  const hrs = document.querySelectorAll('main > hr');

  hrs.forEach((hr, i) => {
    if (!carData[i]) return;
    const { speed, color } = carData[i];
    const pct = ((speed / MAX_SPEED) * 100).toFixed(1);

    const wrap = document.createElement('div');
    wrap.className = 'speed-bar-wrap reveal';
    wrap.innerHTML = `
      <span class="speed-bar-label">TOP SPEED</span>
      <div class="speed-bar-track">
        <div class="speed-bar-fill" data-width="${pct}" style="background: linear-gradient(90deg, ${color}88, ${color}); box-shadow: 0 0 10px ${color}80;"></div>
      </div>
      <span class="speed-bar-value" style="color:${color}; text-shadow: 0 0 8px ${color};">${speed} km/h</span>
    `;
    hr.parentNode.insertBefore(wrap, hr);
  });

  // Animate bars when they enter the viewport
  const barObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target.querySelector('.speed-bar-fill');
        if (fill) {
          setTimeout(() => {
            fill.style.width = fill.dataset.width + '%';
          }, 100);
        }
        entry.target.classList.add('visible');
        barObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.speed-bar-wrap').forEach(el => barObserver.observe(el));
})();


/* ══════════════════════════════════════════════════════════
   4. LIVE SEARCH FILTER
══════════════════════════════════════════════════════════ */
(function initSearch() {
  const input = document.querySelector('input[type="placeholder"]');
  if (!input) return;

  // Change type so browser treats it normally
  input.type = 'text';

  // Collect all car sections (h2 + siblings up to next hr)
  const h2s = [...document.querySelectorAll('main > h2')];
  if (!h2s.length) return;

  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();

    h2s.forEach(h2 => {
      const text = h2.textContent.toLowerCase();
      const match = !q || text.includes(q);

      // Gather siblings until next h2 or table
      let el = h2;
      const group = [h2];
      while (el.nextElementSibling && !el.nextElementSibling.matches('h2, table')) {
        el = el.nextElementSibling;
        group.push(el);
      }

      group.forEach(node => {
        node.style.transition = 'opacity 0.3s, transform 0.3s';
        node.style.opacity    = match ? '1' : '0.12';
        node.style.transform  = match ? 'none' : 'scale(0.98)';
      });
    });
  });
})();


/* ══════════════════════════════════════════════════════════
   5. HEADER SCROLL SHRINK + NEON PULSE
══════════════════════════════════════════════════════════ */
(function initHeader() {
  const header = document.querySelector('header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      header.style.boxShadow = '0 2px 40px rgba(0,245,255,0.18)';
      header.style.borderBottomColor = 'rgba(0,245,255,0.4)';
    } else {
      header.style.boxShadow = '0 2px 30px rgba(0,245,255,0.08)';
      header.style.borderBottomColor = 'rgba(0,245,255,0.2)';
    }
  }, { passive: true });
})();


/* ══════════════════════════════════════════════════════════
   6. TABLE ROW HIGHLIGHT + RANK MEDAL BADGES
══════════════════════════════════════════════════════════ */
(function initTable() {
  const rows = document.querySelectorAll('tbody tr');
  const medals = ['🥇', '🥈', '🥉'];

  rows.forEach((row, i) => {
    // Add rank badge to first cell
    const firstCell = row.querySelector('td');
    if (firstCell) {
      const badge = document.createElement('span');
      badge.textContent = medals[i] || `#${i + 1}`;
      badge.style.cssText = `
        display: inline-block;
        margin-right: 8px;
        font-size: ${i < 3 ? '1rem' : '0.75rem'};
        opacity: ${i < 3 ? '1' : '0.5'};
        vertical-align: middle;
      `;
      firstCell.insertBefore(badge, firstCell.firstChild);
    }

    // Hover glow per row
    const neons = ['#00f5ff','#39ff14','#ff0080','#ffe600','#ff6600',
                   '#00f5ff','#39ff14','#ff0080','#ffe600','#ff6600'];
    const c = neons[i] || '#00f5ff';

    row.addEventListener('mouseenter', () => {
      row.style.boxShadow = `inset 3px 0 0 ${c}, inset 0 0 30px ${c}10`;
      row.style.background = `${c}08`;
    });
    row.addEventListener('mouseleave', () => {
      row.style.boxShadow = '';
      row.style.background = '';
    });
  });
})();


/* ══════════════════════════════════════════════════════════
   7. TYPING EFFECT on hero heading
══════════════════════════════════════════════════════════ */
(function initTyping() {
  const heading = document.querySelector('main > p > h1, main > h1');
  if (!heading) return;

  const original = heading.textContent;
  heading.textContent = '';
  heading.style.borderRight = '3px solid var(--neon-cyan)';
  heading.style.display = 'inline-block';

  let i = 0;
  const type = () => {
    if (i < original.length) {
      heading.textContent += original[i++];
      setTimeout(type, 38);
    } else {
      // Blinking caret then remove
      let blink = 0;
      const blinker = setInterval(() => {
        heading.style.borderRightColor = blink++ % 2 === 0 ? 'var(--neon-cyan)' : 'transparent';
        if (blink > 8) { clearInterval(blinker); heading.style.borderRight = 'none'; }
      }, 420);
    }
  };

  // Delay until visible
  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) { type(); obs.disconnect(); }
  }, { threshold: 0.5 });
  obs.observe(heading);
})();


/* ══════════════════════════════════════════════════════════
   8. CAR IMAGE NEON GLOW ON HOVER (dynamic color per car)
══════════════════════════════════════════════════════════ */
(function initImageGlow() {
  const neons = ['#00f5ff','#39ff14','#ff0080','#ffe600','#ff6600',
                 '#00f5ff','#39ff14','#ff0080','#ffe600','#ff6600'];

  // main images excluding the logo (first one)
  const imgs = [...document.querySelectorAll('main > img')].slice(1);

  imgs.forEach((img, i) => {
    const c = neons[i] || '#00f5ff';
    img.addEventListener('mouseenter', () => {
      img.style.boxShadow   = `0 0 50px ${c}50, 0 0 0 1px ${c}70`;
      img.style.borderColor = c;
    });
    img.addEventListener('mouseleave', () => {
      img.style.boxShadow   = '';
      img.style.borderColor = '';
    });
  });
})();


/* ══════════════════════════════════════════════════════════
   9. AMBIENT NEON PARTICLE FIELD (canvas background)
══════════════════════════════════════════════════════════ */
(function initParticles() {
  const canvas = document.createElement('canvas');
  canvas.style.cssText = `
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    opacity: 0.45;
  `;
  document.body.prepend(canvas);

  const ctx = canvas.getContext('2d');
  const COLORS = ['#00f5ff', '#39ff14', '#ff0080', '#ffe600'];
  let W, H, particles;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function Particle() {
    this.reset();
  }
  Particle.prototype.reset = function () {
    this.x     = Math.random() * W;
    this.y     = Math.random() * H;
    this.r     = Math.random() * 1.4 + 0.3;
    this.vx    = (Math.random() - 0.5) * 0.25;
    this.vy    = (Math.random() - 0.5) * 0.25;
    this.alpha = Math.random() * 0.6 + 0.1;
    this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    this.life  = 0;
    this.maxLife = 180 + Math.random() * 200;
  };

  Particle.prototype.update = function () {
    this.x    += this.vx;
    this.y    += this.vy;
    this.life++;
    if (this.life > this.maxLife || this.x < 0 || this.x > W || this.y < 0 || this.y > H) {
      this.reset();
    }
  };

  Particle.prototype.draw = function () {
    const fade = this.life < 30
      ? this.life / 30
      : this.life > this.maxLife - 30
        ? (this.maxLife - this.life) / 30
        : 1;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.alpha * fade;
    ctx.shadowColor = this.color;
    ctx.shadowBlur  = 6;
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.shadowBlur  = 0;
  };

  function init() {
    resize();
    particles = Array.from({ length: 80 }, () => new Particle());
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', () => { resize(); });
  init();
  loop();
})();


/* ══════════════════════════════════════════════════════════
   10. LOGO TEXT FALLBACK (if logo image missing)
══════════════════════════════════════════════════════════ */
(function initLogoFallback() {
  const logoImg = document.querySelector('.logo img');

  logoImg.addEventListener('error', () => {
    logoImg.style.display = 'none';
    logoLink.textContent = "CAR O'PHILE";
  });

  if (!logoLink.textContent.trim()) {
    logoLink.textContent = "CAR O'PHILE";
  }
})();

/* ══════════════════════════════════════════════════════════
   11. HERO INTRO
══════════════════════════════════════════════════════════ */

window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});