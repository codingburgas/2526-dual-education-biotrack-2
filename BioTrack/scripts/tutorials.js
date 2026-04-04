// tutorials.js — modernized, accessible, ES6+
"use strict";

const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));

const initHamburgerMenu = () => {
  const btn = $('.hamburger-menu');
  const nav = $('.nav-menu');
  if (!btn || !nav) return;
  btn.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(open));
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));
};

const initCategoryFilter = () => {
  const buttons = $$('.cat-btn');
  const cards = $$('.tut-card');
  if (!buttons.length || !cards.length) return;

  buttons.forEach(btn => btn.addEventListener('click', () => {
    const cat = btn.dataset.category || 'all';
    buttons.forEach(b => b.classList.toggle('active', b === btn));
    cards.forEach(card => card.classList.toggle('hidden', !(cat === 'all' || card.dataset.category === cat)));
  }));
};

const initVideoCards = () => {
  const cards = $$('.tut-card');
  const iframe = $('#featured-iframe');
  const titleEl = $('#featured-title');
  if (!cards.length || !iframe) return;

  const playCard = (card) => {
    const id = card.dataset.video;
    const title = card.dataset.title || '';
    if (!id) return;
    const url = `https://www.youtube.com/embed/${encodeURIComponent(id)}`;
    if (iframe.src !== url) iframe.src = url;
    if (titleEl) titleEl.textContent = title;
    cards.forEach(c => c.classList.toggle('playing', c === card));
    const section = document.querySelector('.featured-player-section');
    if (section) section.scrollIntoView({ behavior: 'smooth' });
  };

  cards.forEach(card => {
    card.addEventListener('click', () => playCard(card));
    card.setAttribute('tabindex', '0');
    card.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); playCard(card); } });
  });
};

document.addEventListener('DOMContentLoaded', () => {
  initHamburgerMenu();
  initCategoryFilter();
  initVideoCards();
});