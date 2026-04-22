/* =============================================
   FUTURISTIC PORTFOLIO — script.js
   ============================================= */

// ── CUSTOM CURSOR ───────────────────────────────
document.addEventListener('mousemove', e => {
  document.body.style.setProperty('--x', e.clientX + 'px');
  document.body.style.setProperty('--y', e.clientY + 'px');
});

// ── NAVBAR SCROLL ───────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ── ACTIVE NAV LINK ─────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(a => {
        a.classList.remove('active');
        if (a.getAttribute('href') === '#' + entry.target.id) {
          a.classList.add('active');
        }
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => observer.observe(s));

// ── TYPED TEXT ANIMATION ────────────────────────
const phrases = [
  'Building LLM-Powered Systems',
  'Designing AI Automation',
  'Crafting RAG Pipelines',
  'Deploying Intelligent Models',
  'Turning Data into Decisions'
];

let phraseIdx = 0, charIdx = 0, isDeleting = false;
const typedEl = document.getElementById('typed');

function typeLoop() {
  const phrase = phrases[phraseIdx];
  if (!isDeleting) {
    typedEl.textContent = phrase.slice(0, charIdx + 1);
    charIdx++;
    if (charIdx === phrase.length) {
      isDeleting = true;
      setTimeout(typeLoop, 1800);
      return;
    }
  } else {
    typedEl.textContent = phrase.slice(0, charIdx - 1);
    charIdx--;
    if (charIdx === 0) {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
    }
  }
  setTimeout(typeLoop, isDeleting ? 45 : 90);
}
typeLoop();

// ── COUNTER ANIMATION ───────────────────────────
function animateCounter(el) {
  const target = parseInt(el.dataset.count, 10);
  let current = 0;
  const step = Math.ceil(target / 40);
  const interval = setInterval(() => {
    current += step;
    if (current >= target) {
      el.textContent = target;
      clearInterval(interval);
    } else {
      el.textContent = current;
    }
  }, 40);
}

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-num').forEach(animateCounter);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.hero-stats').forEach(el => counterObserver.observe(el));

// ── SKILL BAR ANIMATION ─────────────────────────
const skillObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-fill').forEach(bar => {
        bar.classList.add('animated');
      });
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-category').forEach(el => skillObserver.observe(el));

// ── SECTION REVEAL ──────────────────────────────
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

// Add reveal class and observe
const revealTargets = [
  '.about-card', '.about-summary',
  '.timeline-item',
  '.skill-category',
  '.edu-card',
  '.contact-intro'
];

revealTargets.forEach(selector => {
  document.querySelectorAll(selector).forEach(el => {
    el.classList.add('reveal');
    revealObserver.observe(el);
  });
});

// ── PARTICLE CANVAS ─────────────────────────────
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particles = [];
let animFrame;

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() {
    this.reset();
  }
  reset() {
    this.x  = Math.random() * canvas.width;
    this.y  = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.25;
    this.vy = (Math.random() - 0.5) * 0.25;
    this.radius = Math.random() * 1.2 + 0.2;
    this.alpha  = Math.random() * 0.4 + 0.08;
    // mostly cyan, some purple, rare green
    const rand = Math.random();
    if (rand < 0.6)       this.hue = 185;  // cyan
    else if (rand < 0.85) this.hue = 270;  // purple
    else                  this.hue = 160;  // green
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > canvas.width)  this.vx *= -1;
    if (this.y < 0 || this.y > canvas.height)  this.vy *= -1;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${this.hue}, 100%, 72%, ${this.alpha})`;
    ctx.fill();
    // tiny glow per particle
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius * 2.5, 0, Math.PI * 2);
    const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * 2.5);
    g.addColorStop(0, `hsla(${this.hue}, 100%, 72%, ${this.alpha * 0.4})`);
    g.addColorStop(1, 'transparent');
    ctx.fillStyle = g;
    ctx.fill();
  }
}

// Create particles
for (let i = 0; i < 160; i++) {
  particles.push(new Particle());
}

// Spotlight sweep
let spotX = 0;
let spotDir = 1;

function drawSpotlight() {
  spotX += 0.15 * spotDir;
  if (spotX > canvas.width * 1.1)  spotDir = -1;
  if (spotX < -canvas.width * 0.1) spotDir = 1;
  const g = ctx.createRadialGradient(spotX, canvas.height * 0.35, 0, spotX, canvas.height * 0.35, 450);
  g.addColorStop(0,   'rgba(0, 229, 255, 0.025)');
  g.addColorStop(0.5, 'rgba(0, 100, 200, 0.01)');
  g.addColorStop(1,   'transparent');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function connectParticles() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx  = particles[i].x - particles[j].x;
      const dy  = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 110) {
        const opacity = 0.055 * (1 - dist / 110);
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(0, 229, 255, ${opacity})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  // Deep black fill each frame
  ctx.fillStyle = 'rgba(0, 0, 5, 0.18)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  drawSpotlight();
  particles.forEach(p => { p.update(); p.draw(); });
  connectParticles();
  animFrame = requestAnimationFrame(animateParticles);
}
animateParticles();

// ── SMOOTH SCROLL for nav links ─────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── CARD HOVER GLOW EFFECT ──────────────────────
document.querySelectorAll('.glass-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top)  / rect.height) * 100;
    card.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(0,229,255,0.06) 0%, rgba(0,0,8,0.85) 55%)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.background = '';
  });
});

// ── SECTION NAV HIGHLIGHT ───────────────────────
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', function () {
    navLinks.forEach(a => a.classList.remove('active'));
    this.classList.add('active');
  });
});
