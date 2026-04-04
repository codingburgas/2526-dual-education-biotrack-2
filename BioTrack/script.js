// script.js
// Fitness Pro Dashboard — BioTrack project
// ==========================================
// This file handles all interactive behaviour:
//   1. Hamburger menu (mobile nav toggle)
//   2. CTA button scroll (banner)
//   3. Progress circle animation
//   4. Workout filter buttons
//   5. Badge auto-unlock
//   6. Video selector
// ==========================================

'use strict'; // catch common coding mistakes early


/* ============================================================
   DATA
   Simulated user stats — in a real app these would come from
   a server or localStorage.
   ============================================================ */

// Used by the progress circles (Task 5 spec example)
const progressData = {
  steps:    7500,
  calories: 1200,
  workouts: 2
};

// Used to decide which badges are unlocked (Task 7)
const userStats = {
  workouts: 12,     // > 10   → earns "First 10 Workouts"
  miles:    45,     // < 100  → NOT earned
  calories: 11500,  // > 10000 → earns "Burned 10,000 Calories"
  streak:   7       // >= 7   → earns "7-Day Streak"
};


/* ============================================================
   1. HAMBURGER MENU  (Task 3)
      Toggles the mobile navigation open or closed.
   ============================================================ */

function initHamburgerMenu() {
  // Grab the button and the nav element
  const hamburgerBtn = document.querySelector('.hamburger-menu');
  const navMenu      = document.querySelector('.nav-menu');

  // Safety check — stop if elements are missing
  if (!hamburgerBtn || !navMenu) return;

  // When the hamburger button is clicked, add or remove the 'open' class.
  // CSS uses that class to slide the nav in/out (max-height transition).
  hamburgerBtn.addEventListener('click', function () {
    navMenu.classList.toggle('open');
  });

  // Also close the menu when any nav link is clicked
  // (so the menu does not stay open after navigation)
  const allNavLinks = navMenu.querySelectorAll('a');
  allNavLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      navMenu.classList.remove('open');
    });
  });
}


/* ============================================================
   2. CTA BUTTON — scroll to progress section  (Task 2)
      Clicking "Get Started" smoothly scrolls down the page.
   ============================================================ */

function initCtaButton() {
  const ctaBtn          = document.querySelector('.cta-button');
  const progressSection = document.getElementById('progress-overview');

  if (!ctaBtn || !progressSection) return;

  ctaBtn.addEventListener('click', function () {
    // scrollIntoView with 'smooth' uses the CSS scroll-behavior: smooth rule
    progressSection.scrollIntoView({ behavior: 'smooth' });
  });
}


/* ============================================================
   3. PROGRESS CIRCLES  (Task 5)
      Animates each circle from 0% to its target percentage.
      Uses requestAnimationFrame for a smooth animation.
   ============================================================ */

// Runs the animation for all circles
function animateProgressCircles() {
  const circles = document.querySelectorAll('.progress-circle');

  circles.forEach(function (circle) {
    // Read the target from the data-progress HTML attribute (e.g. "75")
    const target  = parseInt(circle.getAttribute('data-progress'), 10);
    let   current = 0;

    // Divide the target into 60 small steps (≈ 1 second at 60fps)
    const step = target / 60;

    function tick() {
      current += step;

      // Clamp so we never go above the target
      if (current >= target) {
        current = target;
      }

      // Update the CSS variable — this re-draws the conic-gradient
      circle.style.setProperty('--progress', current.toFixed(1) + '%');

      // Keep animating until we hit the target
      if (current < target) {
        requestAnimationFrame(tick);
      }
    }

    // Start the animation loop
    requestAnimationFrame(tick);
  });
}

// Only trigger the animation when the section is visible on screen.
// IntersectionObserver fires when at least 30% of the section is visible.
function initProgressObserver() {
  const section = document.getElementById('progress-overview');
  if (!section) return;

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateProgressCircles();   // start animation
          observer.disconnect();      // only animate once
        }
      });
    },
    { threshold: 0.3 }  // fire when 30% of the section is in view
  );

  observer.observe(section);
}


/* ============================================================
   4. WORKOUT FILTER  (Task 6)
      Shows only cards that match the selected status.
      "All" shows every card.
   ============================================================ */

function initWorkoutFilter() {
  const filterBtns  = document.querySelectorAll('.filter-btn');
  const workoutCards = document.querySelectorAll('.workout-card');

  if (!filterBtns.length || !workoutCards.length) return;

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      // Read the filter value from the button's data-filter attribute
      const filter = btn.getAttribute('data-filter'); // "all", "completed", etc.

      // Update which button looks active
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');

      // Show or hide each card depending on the filter
      workoutCards.forEach(function (card) {
        // A card is visible if filter is "all" OR the card has that class
        const isVisible = (filter === 'all') || card.classList.contains(filter);

        // toggle('hidden', true) adds the class; toggle('hidden', false) removes it
        card.classList.toggle('hidden', !isVisible);
      });
    });
  });
}


/* ============================================================
   5. BADGE AUTO-UNLOCK  (Task 7)
      Checks each badge's condition against userStats.
      Adds the 'achieved' class when the threshold is met.
   ============================================================ */

function initBadges() {
  const badges = document.querySelectorAll('.badge');

  badges.forEach(function (badge) {
    // data-condition tells us which userStats key to check
    const condition = badge.getAttribute('data-condition');  // e.g. "workouts"
    // data-threshold tells us the minimum value needed
    const threshold = parseInt(badge.getAttribute('data-threshold'), 10); // e.g. 10

    // If the user's stat exists and is >= the threshold, unlock the badge
    if (userStats[condition] !== undefined && userStats[condition] >= threshold) {
      badge.classList.add('achieved'); // CSS makes it bright and fully visible
    }
  });
}


/* ============================================================
   6. VIDEO SELECTOR  (Task 8)
      Clicking a selector button swaps the first video's src
      and updates its title label.
   ============================================================ */

function initVideoSelector() {
  const videoBtns  = document.querySelectorAll('.video-btn');
  const mainVideo  = document.getElementById('main-video');   // first iframe
  const videoTitle = document.getElementById('video-title');  // first card h4

  if (!videoBtns.length || !mainVideo) return;

  videoBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const videoId = btn.getAttribute('data-video');   // YouTube video ID
      const title   = btn.getAttribute('data-title');   // Human-readable title

      // Update the active button highlight
      videoBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');

      // Swap the iframe source to the new YouTube embed URL
      mainVideo.src = 'https://www.youtube.com/embed/' + videoId;

      // Update the title text below the first video card
      if (videoTitle) {
        videoTitle.textContent = title;
      }
    });
  });
}


/* ============================================================
   INIT — run everything after the HTML is fully loaded
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {
  initHamburgerMenu();    // Task 3 — mobile nav toggle
  initCtaButton();        // Task 2 — scroll on CTA click
  initProgressObserver(); // Task 5 — animate circles on scroll
  initWorkoutFilter();    // Task 6 — filter workout cards
  initBadges();           // Task 7 — unlock achieved badges
  initVideoSelector();    // Task 8 — switch tutorial video
});
