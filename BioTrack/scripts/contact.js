// contact.js
// JavaScript for contact.html
// ============================================================
// Handles:
//   1. Hamburger menu (mobile)
//   2. Contact form submission

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

// --- Contact form handling ---
const initContactForm = () => {
  const form = $('#contact-form');
  const nameInput = $('#contact-name');
  const emailInput = $('#contact-email');
  const subjectInput = $('#contact-subject');
  const messageInput = $('#contact-message');
  const messageEl = $('#contact-form-message');

  if (!form || !nameInput || !emailInput || !subjectInput || !messageInput) return;

  const showMessage = (text, isError = false) => {
    if (messageEl) {
      messageEl.textContent = text;
      messageEl.classList.toggle('error', isError);
      messageEl.style.display = 'block';
      setTimeout(() => {
        messageEl.style.display = 'none';
      }, 4000);
    }
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const subject = subjectInput.value.trim();
    const message = messageInput.value.trim();

    // Basic validation
    if (!name || !email || !subject || !message) {
      showMessage('Please fill in all fields.', true);
      return;
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showMessage('Please enter a valid email address.', true);
      return;
    }

    // Simulate form submission (in a real app, this would send to a backend)
    showMessage('Thank you! Your message has been sent. We\'ll get back to you soon.');

    // Reset form
    form.reset();
  });
};

// --- Init
document.addEventListener('DOMContentLoaded', () => {
  initHamburgerMenu();
  initContactForm();
});
