"use strict";

/* ══════════════════════════════════════════════════
   INZU STUDIO — Full JavaScript
   ══════════════════════════════════════════════════ */

/* ── EMAILJS INIT ───────────────────────────────────
   SETUP STEPS:
   1. Go to https://emailjs.com and sign up free
   2. Create a service (Gmail) → copy Service ID
   3. Create an email template → copy Template ID
   4. Copy your Public Key
   5. Replace the 3 values below
   ──────────────────────────────────────────────── */
const EMAILJS_SERVICE_ID  = "YOUR_SERVICE_ID";   // e.g. "service_abc123"
const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID";  // e.g. "template_xyz456"
const EMAILJS_PUBLIC_KEY  = "YOUR_PUBLIC_KEY";   // e.g. "abcDEFghiJKL"

(function(){
  if (typeof emailjs !== 'undefined') {
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  }
})();

/* ── STUDIO BIRTHDAY: May 12 ───────────────────────
   Auto-calculates years, and shows birthday banner
   ──────────────────────────────────────────────── */
const BIRTHDAY_MONTH = 5;  // May
const BIRTHDAY_DAY   = 12;
const BIRTH_YEAR     = 2025;

function getStudioStats() {
  const now   = new Date();
  const bday  = new Date(BIRTH_YEAR, BIRTHDAY_MONTH - 1, BIRTHDAY_DAY);
  const msPerDay = 1000 * 60 * 60 * 24;
  const daysActive = Math.max(0, Math.floor((now - bday) / msPerDay));

  // 1 project every ~3 days, 1 client every ~5 days (realistic growth)
  const projects = Math.max(1, Math.floor(daysActive / 3));
  const clients  = Math.max(1, Math.floor(daysActive / 5));

  // Years: fractional year since birthday
  const yearsFraction = (now - bday) / (365.25 * msPerDay);
  const yearsDisplay  = yearsFraction < 1
    ? (yearsFraction < 0.083 ? "New" : Math.round(yearsFraction * 12) + "m")
    : (Math.floor(yearsFraction) + "y");

  // Birthday check
  const isBirthday = now.getMonth() + 1 === BIRTHDAY_MONTH && now.getDate() === BIRTHDAY_DAY;

  return { projects, clients, yearsDisplay, isBirthday };
}

function updateStats() {
  const { projects, clients, yearsDisplay, isBirthday } = getStudioStats();

  // Hero floating cards
  const sp = document.getElementById("stat-projects");
  if (sp) sp.textContent = projects + "+";

  // About section
  const ap = document.getElementById("about-projects");
  const ac = document.getElementById("about-clients");
  const ay = document.getElementById("about-years");
  if (ap) animateCounter(ap, projects, "+");
  if (ac) animateCounter(ac, clients, "+");
  if (ay) ay.textContent = yearsDisplay;

  // Birthday banner
  const banner = document.getElementById("birthday-banner");
  if (banner && isBirthday) banner.style.display = "block";
}

/* ── VISITOR COUNTER ────────────────────────────────
   Uses localStorage to count unique daily visits
   ──────────────────────────────────────────────── */
function initVisitorCounter() {
  const KEY_TOTAL = "inzu_total_visits";
  const KEY_TODAY = "inzu_last_visit_date";

  const today     = new Date().toDateString();
  const lastVisit = localStorage.getItem(KEY_TODAY);
  let   total     = parseInt(localStorage.getItem(KEY_TOTAL) || "0");

  if (lastVisit !== today) {
    total++;
    localStorage.setItem(KEY_TOTAL, total);
    localStorage.setItem(KEY_TODAY, today);
  }

  const sv = document.getElementById("stat-viewers");
  const fv = document.getElementById("footer-viewers");
  if (sv) animateCounter(sv, total, "");
  if (fv) fv.textContent = total;
}

/* ── COUNTER ANIMATION ──────────────────────────── */
function animateCounter(el, target, suffix) {
  if (!el) return;
  let current = 0;
  const step  = Math.max(1, Math.floor(target / 50));
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      el.textContent = target + suffix;
      clearInterval(timer);
    } else {
      el.textContent = current + suffix;
    }
  }, 30);
}

/* ── LOADER ──────────────────────────────────────── */
window.addEventListener("load", () => {
  setTimeout(() => {
    const loader = document.getElementById("loader");
    if (loader) loader.classList.add("done");
    document.body.style.overflow = "";
    initHeroAnimations();
    updateStats();
    initVisitorCounter();
  }, 2200);
});
document.body.style.overflow = "hidden";

/* ── CUSTOM CURSOR ──────────────────────────────── */
const cursor      = document.getElementById("cursor");
const cursorTrail = document.getElementById("cursor-trail");
let mouseX = 0, mouseY = 0, trailX = 0, trailY = 0;

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX; mouseY = e.clientY;
  if (cursor) { cursor.style.left = mouseX + "px"; cursor.style.top = mouseY + "px"; }
});
function animateTrail() {
  trailX += (mouseX - trailX) * 0.12;
  trailY += (mouseY - trailY) * 0.12;
  if (cursorTrail) { cursorTrail.style.left = trailX + "px"; cursorTrail.style.top = trailY + "px"; }
  requestAnimationFrame(animateTrail);
}
animateTrail();

/* ── NAVBAR SCROLL ──────────────────────────────── */
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
  if (navbar) navbar.classList.toggle("scrolled", window.scrollY > 40);
});

/* ── HAMBURGER MENU ─────────────────────────────── */
const hamburger  = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");
if (hamburger) {
  hamburger.addEventListener("click", () => mobileMenu.classList.toggle("open"));
}
document.querySelectorAll(".mm-link").forEach(link => {
  link.addEventListener("click", () => mobileMenu.classList.remove("open"));
});

/* ── PARTICLE CANVAS ────────────────────────────── */
const canvas = document.getElementById("particleCanvas");
if (canvas) {
  const ctx = canvas.getContext("2d");
  let particles = [];
  let pmouse = { x: null, y: null };

  function resizeCanvas() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", () => { resizeCanvas(); initParticles(); });

  canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    pmouse.x = e.clientX - rect.left;
    pmouse.y = e.clientY - rect.top;
  });
  canvas.addEventListener("mouseleave", () => { pmouse.x = null; pmouse.y = null; });

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x      = Math.random() * canvas.width;
      this.y      = Math.random() * canvas.height;
      this.size   = Math.random() * 1.8 + 0.4;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.4;
      this.opacity= Math.random() * 0.5 + 0.1;
      this.gold   = Math.random() > 0.65;
    }
    update() {
      this.x += this.speedX; this.y += this.speedY;
      if (pmouse.x !== null) {
        const dx = this.x - pmouse.x, dy = this.y - pmouse.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 100) { const f = (100-dist)/100; this.x += (dx/dist)*f*1.5; this.y += (dy/dist)*f*1.5; }
      }
      if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
    }
    draw() {
      ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI*2);
      ctx.fillStyle = this.gold ? `rgba(200,134,10,${this.opacity})` : `rgba(232,224,208,${this.opacity*0.5})`;
      ctx.fill();
    }
  }

  function initParticles() {
    const count = Math.min(120, Math.floor((canvas.width * canvas.height) / 8000));
    particles = Array.from({ length: count }, () => new Particle());
  }
  initParticles();

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i+1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 90) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(200,134,10,${(1-dist/90)*0.12})`;
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
}

/* ── TYPING ANIMATION ───────────────────────────── */
const typingEl = document.getElementById("typingTarget");
const phrases  = ["Grow Businesses", "Tell Stories", "Build Brands", "Inspire People"];
let phraseIdx = 0, charIdx = 0, isDeleting = false;

function typeLoop() {
  if (!typingEl) return;
  const current = phrases[phraseIdx];
  if (!isDeleting) {
    typingEl.textContent = current.slice(0, ++charIdx);
    if (charIdx === current.length) { isDeleting = true; setTimeout(typeLoop, 2200); return; }
  } else {
    typingEl.textContent = current.slice(0, --charIdx);
    if (charIdx === 0) { isDeleting = false; phraseIdx = (phraseIdx+1) % phrases.length; }
  }
  setTimeout(typeLoop, isDeleting ? 55 : 90);
}

function initHeroAnimations() {
  typeLoop();
  document.querySelectorAll(".fade-up").forEach((el, i) => {
    if (isInViewport(el)) {
      el.style.transitionDelay = `${(el.dataset.delay||0)*0.001 + i*0.05}s`;
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
      setTimeout(() => entry.target.classList.add("visible"), parseInt(entry.target.dataset.delay||0));
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });
document.querySelectorAll(".fade-up").forEach(el => observer.observe(el));

/* ── 3D TILT CARDS ──────────────────────────────── */
document.querySelectorAll(".tilt-card").forEach(card => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const dx = (e.clientX - rect.left - rect.width/2)  / (rect.width/2);
    const dy = (e.clientY - rect.top  - rect.height/2) / (rect.height/2);
    card.style.transform = `perspective(800px) rotateY(${dx*12}deg) rotateX(${-dy*12}deg) scale(1.02)`;
    card.style.transition = "transform 0.1s ease";
  });
  card.addEventListener("mouseleave", () => {
    card.style.transform = "perspective(800px) rotateY(0deg) rotateX(0deg) scale(1)";
    card.style.transition = "transform 0.5s ease";
  });
});

/* ── PARALLAX SCROLL ────────────────────────────── */
window.addEventListener("scroll", () => {
  const sy = window.scrollY;
  const o1 = document.querySelector(".orb1");
  const o2 = document.querySelector(".orb2");
  const o3 = document.querySelector(".orb3");
  if (o1) o1.style.transform = `translate(${sy*.08}px,${sy*.05}px)`;
  if (o2) o2.style.transform = `translate(${-sy*.06}px,${sy*.04}px)`;
  if (o3) o3.style.transform = `translate(${sy*.04}px,${-sy*.03}px)`;
  const hc = document.querySelector(".hero-content");
  if (hc && sy < window.innerHeight) {
    hc.style.transform = `translateY(${sy*.28}px)`;
    hc.style.opacity   = 1 - sy/(window.innerHeight*.8);
  }
});

/* ── ABOUT RINGS ROTATION ───────────────────────── */
let ringAngle = 0;
function animateRings() {
  ringAngle += 0.003;
  const r1 = document.querySelector(".av-ring1");
  const r3 = document.querySelector(".av-ring3");
  if (r1) r1.style.transform = `rotate(${ringAngle*20}deg)`;
  if (r3) r3.style.transform = `rotate(${-ringAngle*30}deg)`;
  requestAnimationFrame(animateRings);
}
animateRings();

/* ── STATS COUNTER TRIGGER (About section) ──────── */
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) { updateStats(); statsObserver.unobserve(entry.target); }
  });
}, { threshold: 0.5 });
const statsSection = document.querySelector(".about-stats");
if (statsSection) statsObserver.observe(statsSection);

/* ── PORTFOLIO SHIMMER ──────────────────────────── */
document.querySelectorAll(".pf-img").forEach(card => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width)  * 100;
    const y = ((e.clientY - rect.top)  / rect.height) * 100;
    const shine = card.querySelector(".pf-shine");
    if (shine) shine.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,.18), transparent 60%)`;
  });
  card.addEventListener("mouseleave", () => {
    const shine = card.querySelector(".pf-shine");
    if (shine) shine.style.background = "linear-gradient(135deg, rgba(255,255,255,.08) 0%, transparent 50%)";
  });
});

/* ── STAR RATING ────────────────────────────────── */
const starSelector = document.getElementById("starSelector");
if (starSelector) {
  const stars     = starSelector.querySelectorAll("span");
  let ratingData  = JSON.parse(localStorage.getItem("inzu_ratings") || '{"total":15,"sum":75}');
  let userRated   = localStorage.getItem("inzu_user_rated") === "true";

  function updateAvgDisplay() {
    const avg = (ratingData.sum / ratingData.total).toFixed(1);
    const el  = document.getElementById("avgRating");
    const el2 = document.getElementById("totalRatings");
    if (el)  el.textContent  = avg;
    if (el2) el2.textContent = ratingData.total;
  }
  updateAvgDisplay();

  if (userRated) {
    stars.forEach(s => s.classList.add("active"));
    const t = document.getElementById("rateThanks");
    if (t) t.style.display = "block";
  }

  stars.forEach((star, idx) => {
    star.addEventListener("mouseenter", () => {
      if (userRated) return;
      stars.forEach((s, i) => s.classList.toggle("hover", i <= idx));
    });
    star.addEventListener("mouseleave", () => {
      stars.forEach(s => s.classList.remove("hover"));
    });
    star.addEventListener("click", () => {
      if (userRated) return;
      const val = parseInt(star.dataset.val);
      ratingData.total++;
      ratingData.sum += val;
      localStorage.setItem("inzu_ratings",    JSON.stringify(ratingData));
      localStorage.setItem("inzu_user_rated", "true");
      userRated = true;
      stars.forEach((s, i) => { s.classList.remove("hover"); s.classList.toggle("active", i < val); });
      updateAvgDisplay();
      const t = document.getElementById("rateThanks");
      if (t) t.style.display = "block";
    });
  });
}

/* ── CONTACT FORM → EMAILJS ─────────────────────── */
const contactForm = document.getElementById("contactForm");
if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name    = document.getElementById("cf-name")?.value    || "";
    const email   = document.getElementById("cf-email")?.value   || "";
    const service = document.getElementById("cf-service")?.value || "";
    const details = document.getElementById("cf-details")?.value || "";
    const btn     = document.getElementById("cf-submit");
    const status  = document.getElementById("cf-status");

    if (!name || !email) return;

    btn.textContent   = "Sending…";
    btn.style.opacity = ".7";

    const templateParams = {
      from_name   : name,
      from_email  : email,
      service     : service || "Not specified",
      message     : details || "No details provided",
      to_email    : "inzustudio@gmail.com",
    };

    try {
      if (typeof emailjs !== 'undefined' && EMAILJS_SERVICE_ID !== "YOUR_SERVICE_ID") {
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
        btn.textContent   = "Sent! ✦";
        btn.style.opacity = "1";
        btn.style.background = "linear-gradient(135deg,#0a7a3d,#0ac86e)";
        if (status) { status.textContent = "✦ Message sent! We'll reply within 24 hours."; status.style.display = "block"; }
      } else {
        // Fallback: open mailto if EmailJS not set up yet
        const subject = encodeURIComponent(`New Project Enquiry from ${name} — ${service}`);
        const body    = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nService: ${service}\n\nDetails:\n${details}`);
        window.open(`mailto:inzustudio@gmail.com?subject=${subject}&body=${body}`);
        btn.textContent   = "Sent! ✦";
        btn.style.opacity = "1";
        if (status) { status.textContent = "✦ Opening your email app…"; status.style.display = "block"; }
      }
      setTimeout(() => {
        btn.textContent      = "Send Message ✦";
        btn.style.background = "";
        btn.style.opacity    = "1";
        if (status) status.style.display = "none";
        contactForm.reset();
      }, 4000);
    } catch (err) {
      btn.textContent   = "Send Message ✦";
      btn.style.opacity = "1";
      if (status) { status.textContent = "⚠ Error. Please email us directly."; status.style.display = "block"; }
    }
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

/* ── COPYRIGHT YEAR ─────────────────────────────── */
const cyEl = document.getElementById("copy-year");
if (cyEl) cyEl.textContent = new Date().getFullYear();

/* ── PRICING GLOW PULSE ─────────────────────────── */
const pcGlow = document.querySelector(".pc-glow");
if (pcGlow) {
  let gp = 0;
  setInterval(() => {
    gp += 0.05;
    pcGlow.style.background = `radial-gradient(circle at 50% 0%, rgba(200,134,10,${0.08+Math.sin(gp)*0.04}), transparent 70%)`;
  }, 50);
}

/* ── PAGE ENTRY TRANSITION ──────────────────────── */
const pt = document.createElement("div");
pt.style.cssText = "position:fixed;inset:0;background:#000;z-index:99999;pointer-events:none;opacity:1;transition:opacity .6s ease;";
document.body.prepend(pt);
setTimeout(() => { pt.style.opacity = "0"; }, 50);
