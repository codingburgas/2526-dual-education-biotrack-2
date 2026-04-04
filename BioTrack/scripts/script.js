// script.js
// BioTrack Dashboard — BioTrack project
// ==========================================
// This file handles all interactive behaviour:
//   1. Hamburger menu (mobile nav toggle)
//   2. CTA button scroll (banner)
//   3. Progress circle animation
//   4. Workout filter buttons
//   5. Badge auto-unlock
//   6. Video selector
// ==========================================

"use strict";

// --- Simulated data (would come from an API or storage in a real app) ---
const userStats = {
  workouts: 12,
  miles: 45,
  calories: 11500,
  streak: 7
};

// Small utilities
const $ = selector => document.querySelector(selector);
const $$ = selector => Array.from(document.querySelectorAll(selector));
const isNumber = v => typeof v === 'number' && !Number.isNaN(v) && Number.isFinite(v);

// Toggle a single element's class and return the new state
const toggleClass = (el, className, force) => el.classList.toggle(className, force);

// Safe parse for integers with fallback
const parseIntSafe = (value, fallback = 0) => {
  const n = parseInt(value, 10);
  return Number.isNaN(n) ? fallback : n;
};

// --- Hamburger / mobile nav ---
const initHamburgerMenu = () => {
  const btn = $('.hamburger-menu');
  const nav = $('.nav-menu');
  if (!btn || !nav) return;

  btn.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(isOpen));
  });

  // Close menu when clicking a link
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));
};

// --- CTA scroll ---
const initCtaButton = () => {
  const cta = $('.cta-button');
  const target = $('#progress-overview');
  if (!cta || !target) return;
  cta.addEventListener('click', () => target.scrollIntoView({ behavior: 'smooth' }));
};

// --- Progress circle animation ---
const animateProgressCircle = (circle) => {
  const target = parseIntSafe(circle.getAttribute('data-progress'));
  if (!isNumber(target) || target <= 0) return;

  let current = 0;
  const duration = 800; // ms
  const start = performance.now();

  const step = (ts) => {
    const elapsed = ts - start;
    const progress = Math.min(elapsed / duration, 1);
    current = Math.round((target * progress) * 10) / 10; // 1 decimal
    circle.style.setProperty('--progress', `${current}%`);
    if (progress < 1) requestAnimationFrame(step);
  };

  requestAnimationFrame(step);
};

const initProgressObserver = () => {
  const section = $('#progress-overview');
  if (!section) return;

  const obs = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        $$('.progress-circle').forEach(animateProgressCircle);
        observer.disconnect();
      }
    });
  }, { threshold: 0.3 });

  obs.observe(section);
};

// --- Workout filtering (DRY and aria updates) ---
const initWorkoutFilter = () => {
  const buttons = $$('.filter-btn');
  const cards = $$('.workout-card');
  if (!buttons.length || !cards.length) return;

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter || 'all';

      buttons.forEach(b => {
        const active = b === btn;
        toggleClass(b, 'active', active);
        b.setAttribute('aria-pressed', String(active));
      });

      cards.forEach(card => {
        const visible = filter === 'all' || card.classList.contains(filter);
        toggleClass(card, 'hidden', !visible);
      });
    });
  });
};

// --- Badge unlocking ---
const initBadges = () => {
  $$('.badge').forEach(badge => {
    const key = badge.dataset.condition;
    const threshold = parseIntSafe(badge.dataset.threshold, 0);
    const value = (userStats && Object.prototype.hasOwnProperty.call(userStats, key)) ? userStats[key] : undefined;
    if (isNumber(value) && value >= threshold) badge.classList.add('achieved');
  });
};

// --- Video selector ---
const initVideoSelector = () => {
  const btns = $$('.video-btn');
  const main = $('#main-video');
  const title = $('#video-title');
  if (!btns.length || !main) return;

  btns.forEach(btn => btn.addEventListener('click', () => {
    const id = btn.dataset.video;
    const t = btn.dataset.title || '';
    if (!id) return;

    btns.forEach(b => toggleClass(b, 'active', b === btn));
    btns.forEach(b => b.setAttribute('aria-pressed', String(b === btn)));

    // Use URL API to safely build the embed url
    const embed = `https://www.youtube.com/embed/${encodeURIComponent(id)}`;
    if (main.src !== embed) main.src = embed;
    if (title) title.textContent = t;
  }));
};

// --- Init all ---
document.addEventListener('DOMContentLoaded', () => {
  initHamburgerMenu();
  initCtaButton();
  initProgressObserver();
  initWorkoutFilter();
  initBadges();
  initVideoSelector();
});
