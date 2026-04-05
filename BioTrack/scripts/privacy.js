// privacy.js
// JavaScript for privacy.html
// ============================================================
// Handles:
//   1. Hamburger menu (mobile)

"use strict";

// Small utilities
const $ = selector => document.querySelector(selector);
const $$ = selector => Array.from(document.querySelectorAll(selector));

// --- Hamburger / mobile nav ---
const initHamburgerMenu = () => {
  const btn = $('.hamburger-menu');
  const nav = $('.nav-menu');
  if (!btn || !nav) return;

  btn.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(open));
  });

  // Close menu when clicking a link
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));
};

// --- Init
document.addEventListener('DOMContentLoaded', () => {
  initHamburgerMenu();
});
