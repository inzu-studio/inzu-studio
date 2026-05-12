/* ══════════════════════════════════════════════════
   INZU STUDIO — Premium Agency JavaScript
   ══════════════════════════════════════════════════ */

"use strict";

/* ── LOADER ─────────────────────────────────────── */
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  setTimeout(() => {
    loader.classList.add("done");
    document.body.style.overflow = "";
    initHeroAnimations();
  }, 2200);
});
document.body.style.overflow = "hidden";

/* ── CUSTOM CURSOR ──────────────────────────────── */
const cursor = document.getElementById("cursor");
const cursorTrail = document.getElementById("cursor-trail");
let mouseX = 0, mouseY = 0;
let trailX = 0, trailY = 0;

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + "px";
  cursor.style.top = mouseY + "px";
});

function animateTrail() {
  trailX += (mouseX - trailX) * 0.12;
  trailY += (mouseY - trailY) * 0.12;
  cursorTrail.style.left = trailX + "px";
  cursorTrail.style.top = trailY + "px";
  requestAnimationFrame(animateTrail);
}
animateTrail();

document.querySelectorAll("a, button, .service-card, .pf-card, .testi-card").forEach(el => {
  el.addEventListener("mouseenter", () => {
    cursor.style.width = "20px";
    cursor.style.height = "20px";
    cursorTrail.style.width = "52px";
    cursorTrail.style.height = "52px";
    cursorTrail.style.opacity = ".8";
  });
  el.addEventListener("mouseleave", () => {
    cursor.style.width = "12px";
    cursor.style.height = "12px";
    cursorTrail.style.width = "36px";
    cursorTrail.style.height = "36px";
    cursorTrail.style.opacity = ".5";
  });
});

/* ── NAVBAR SCROLL ──────────────────────────────── */
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 40);
});

/* ── HAMBURGER MENU ─────────────────────────────── */
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");
hamburger.addEventListener("click", () => {
  mobileMenu.classList.toggle("open");
});
document.querySelectorAll(".mm-link").forEach(link => {
  link.addEventListener("click", () => mobileMenu.classList.remove("open"));
});

/* ── PARTICLE CANVAS ────────────────────────────── */
const canvas = document.getElementById("particleCanvas");
const ctx = canvas.getContext("2d");
let particles = [];
let mouse = { x: null, y: null };

function resizeCanvas() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

canvas.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  mouse.x = e.clientX - rect.left;
  mouse.y = e.clientY - rect.top;
});
canvas.addEventListener("mouseleave", () => {
  mouse.x = null;
  mouse.y = null;
});

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 1.8 + 0.4;
    this.speedX = (Math.random() - 0.5) * 0.4;
    this.speedY = (Math.random() - 0.5) * 0.4;
    this.opacity = Math.random() * 0.5 + 0.1;
    this.gold = Math.random() > 0.65;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (mouse.x !== null) {
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        const force = (100 - dist) / 100;
        this.x += (dx / dist) * force * 1.5;
        this.y += (dy / dist) * force * 1.5;
      }
    }
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
      this.reset();
    }
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.gold
      ? `rgba(200,134,10,${this.opacity})`
      : `rgba(232,224,208,${this.opacity * 0.5})`;
    ctx.fill();
  }
}

function initParticles() {
  const count = Math.min(120, Math.floor((canvas.width * canvas.height) / 8000));
  particles = Array.from({ length: count }, () => new Particle());
}
initParticles();
window.addEventListener("resize", initParticles);

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 90) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(200,134,10,${(1 - dist / 90) * 0.12})`;
        ctx.lineWidth = 0.5;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  drawConnections();
  requestAnimationFrame(animateParticles);
}
animateParticles();

/* ── TYPING ANIMATION ───────────────────────────── */
const typingEl = document.getElementById("typingTarget");
const phrases = ["Grow Businesses", "Tell Stories", "Build Brands", "Inspire People"];
let phraseIdx = 0, charIdx = 0, isDeleting = false;

function typeLoop() {
  const current = phrases[phraseIdx];
  if (!isDeleting) {
    typingEl.textContent = current.slice(0, ++charIdx);
    if (charIdx === current.length) {
      isDeleting = true;
      setTimeout(typeLoop, 2200);
      return;
    }
  } else {
    typingEl.textContent = current.slice(0, --charIdx);
    if (charIdx === 0) {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
    }
  }
  setTimeout(typeLoop, isDeleting ? 55 : 90);
}

function initHeroAnimations() {
  typeLoop();
  document.querySelectorAll(".fade-up").forEach((el, i) => {
    if (isInViewport(el)) {
      el.style.transitionDelay = `${(el.dataset.delay || 0) * 0.001 + i * 0.05}s`;
      el.classList.add("visible");
    }
  });
}

/* ── SCROLL FADE-IN ─────────────────────────────── */
function isInViewport(el) {
  const rect = el.getBoundingClientRect();
  return rect.top < window.innerHeight * 0.92 && rect.bottom > 0;
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => {
        entry.target.classList.add("visible");
      }, parseInt(delay));
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll(".fade-up").forEach(el => observer.observe(el));

/* ── 3D TILT CARDS ──────────────────────────────── */
document.querySelectorAll(".tilt-card").forEach(card => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    const maxTilt = 12;
    card.style.transform = `perspective(800px) rotateY(${dx * maxTilt}deg) rotateX(${-dy * maxTilt}deg) scale(1.02)`;
  });
  card.addEventListener("mouseleave", () => {
    card.style.transform = "perspective(800px) rotateY(0deg) rotateX(0deg) scale(1)";
    card.style.transition = "transform 0.5s ease";
  });
  card.addEventListener("mouseenter", () => {
    card.style.transition = "transform 0.1s ease";
  });
});

/* ── PARALLAX SCROLL ────────────────────────────── */
window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;
  const orb1 = document.querySelector(".orb1");
  const orb2 = document.querySelector(".orb2");
  const orb3 = document.querySelector(".orb3");
  if (orb1) orb1.style.transform = `translate(${scrollY * 0.08}px, ${scrollY * 0.05}px)`;
  if (orb2) orb2.style.transform = `translate(${-scrollY * 0.06}px, ${scrollY * 0.04}px)`;
  if (orb3) orb3.style.transform = `translate(${scrollY * 0.04}px, ${-scrollY * 0.03}px)`;

  const heroContent = document.querySelector(".hero-content");
  if (heroContent && scrollY < window.innerHeight) {
    heroContent.style.transform = `translateY(${scrollY * 0.28}px)`;
    heroContent.style.opacity = 1 - scrollY / (window.innerHeight * 0.8);
  }
});

/* ── ABOUT RINGS ROTATION ───────────────────────── */
let ringAngle = 0;
function animateRings() {
  ringAngle += 0.003;
  const ring1 = document.querySelector(".av-ring1");
  const ring3 = document.querySelector(".av-ring3");
  if (ring1) ring1.style.transform = `rotate(${ringAngle * 20}deg)`;
  if (ring3) ring3.style.transform = `rotate(${-ringAngle * 30}deg)`;
  requestAnimationFrame(animateRings);
}
animateRings();

/* ── CONTACT FORM ───────────────────────────────── */
const contactForm = document.getElementById("contactForm");
if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector("button[type='submit']");
    btn.textContent = "Message Sent! ✦";
    btn.style.background = "linear-gradient(135deg, #0a7a3d, #0ac86e)";
    setTimeout(() => {
      btn.textContent = "Send Message ✦";
      btn.style.background = "";
      contactForm.reset();
    }, 3500);
  });
}

/* ── SMOOTH ANCHOR SCROLL ───────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", (e) => {
    const target = document.querySelector(anchor.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

/* ── PORTFOLIO CARD SHIMMER ─────────────────────── */
document.querySelectorAll(".pf-img").forEach(card => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.querySelector(".pf-shine").style.background =
      `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,.18), transparent 60%)`;
  });
  card.addEventListener("mouseleave", () => {
    card.querySelector(".pf-shine").style.background =
      "linear-gradient(135deg, rgba(255,255,255,.08) 0%, transparent 50%)";
  });
});

/* ── NEON PULSE ON SERVICE CARDS ────────────────── */
document.querySelectorAll(".service-card").forEach(card => {
  card.addEventListener("mouseenter", () => {
    card.style.boxShadow = "0 0 30px rgba(200,134,10,.15), 0 8px 40px rgba(0,0,0,.3)";
  });
  card.addEventListener("mouseleave", () => {
    card.style.boxShadow = "";
  });
});

/* ── NUMBER COUNTER ANIMATION ───────────────────── */
function animateCounter(el, target, suffix = "") {
  let current = 0;
  const step = target / 60;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      el.textContent = target + suffix;
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(current) + suffix;
    }
  }, 25);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const items = entry.target.querySelectorAll(".as-item strong");
      items.forEach(item => {
        const text = item.textContent;
        const num = parseInt(text);
        const suffix = text.replace(/[0-9]/g, "");
        if (!isNaN(num)) animateCounter(item, num, suffix);
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const statsSection = document.querySelector(".about-stats");
if (statsSection) statsObserver.observe(statsSection);

/* ── PRICING CARD GLOW PULSE ────────────────────── */
const pcGlow = document.querySelector(".pc-glow");
if (pcGlow) {
  let glowPhase = 0;
  setInterval(() => {
    glowPhase += 0.05;
    const intensity = 0.08 + Math.sin(glowPhase) * 0.04;
    pcGlow.style.background = `radial-gradient(circle at 50% 0%, rgba(200,134,10,${intensity}), transparent 70%)`;
  }, 50);
}

/* ── PAGE ENTRY TRANSITION ──────────────────────── */
document.body.insertAdjacentHTML("afterbegin", `
  <div id="pageTransition" style="
    position:fixed; inset:0; background:#000;
    z-index:99999; pointer-events:none;
    opacity:1; transition:opacity .6s ease;
  "></div>
`);
setTimeout(() => {
  document.getElementById("pageTransition").style.opacity = "0";
}, 50);
