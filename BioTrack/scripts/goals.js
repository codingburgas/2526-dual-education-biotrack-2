// goals.js
// JavaScript for goals.html — Simple and readable version
// ============================================================
// This file handles:
//   1. Mobile hamburger menu
//   2. Badge unlocking when goals are met
//   3. Goal progress bars with animations
//   4. Custom goal creation and display

"use strict";

// Default user stats for the dashboard
var DEFAULT_STATS = { workouts: 12, miles: 45, calories: 11500, streak: 7 };

// Storage key for saving custom goals to the browser
var CUSTOM_GOALS_STORAGE_KEY = 'biotrack_custom_goals_v1';

// ============================================================
// HELPER FUNCTIONS — Getting elements from the page
// ============================================================

function getElementById(elementId) {
  return document.getElementById(elementId);
}

function getElementBySelector(selector) {
  return document.querySelector(selector);
}

function getElementsBySelector(selector) {
  return Array.from(document.querySelectorAll(selector));
}

// ============================================================
// HAMBURGER MENU — Toggle mobile navigation
// ============================================================

function initHamburgerMenu() {
  var hamburgerButton = getElementBySelector('.hamburger-menu');
  var navigationMenu = getElementBySelector('.nav-menu');
  
  if (!hamburgerButton || !navigationMenu) {
    return;
  }

  // Click hamburger to open/close menu
  hamburgerButton.addEventListener('click', function() {
    var isOpen = navigationMenu.classList.toggle('open');
    hamburgerButton.setAttribute('aria-expanded', String(isOpen));
  });

  // Close menu when clicking any link
  var navigationLinks = navigationMenu.querySelectorAll('a');
  navigationLinks.forEach(function(link) {
    link.addEventListener('click', function() {
      navigationMenu.classList.remove('open');
    });
  });
}

// ============================================================
// BADGE UNLOCKING — Unlock badges when user hits goal thresholds
// ============================================================

function initBadges() {
  var badges = getElementsBySelector('.badge');
  
  badges.forEach(function(badge) {
    var condition = badge.dataset.condition;
    var threshold = parseInt(badge.dataset.threshold, 10) || 0;
    var userValue = DEFAULT_STATS[condition] || 0;
    
    // If user has reached the threshold, add the 'achieved' class
    if (userValue >= threshold) {
      badge.classList.add('achieved');
    }
  });
}

// ============================================================
// LOCAL STORAGE FUNCTIONS — Save and load custom goals
// ============================================================

function loadCustomGoalsFromStorage() {
  try {
    var stored = localStorage.getItem(CUSTOM_GOALS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    return {};
  }
}

function saveCustomGoalsToStorage(goalsObject) {
  try {
    localStorage.setItem(CUSTOM_GOALS_STORAGE_KEY, JSON.stringify(goalsObject));
    return true;
  } catch (error) {
    return false;
  }
}

// ============================================================
// GOAL PROGRESS BARS — Update the progress bars on the page
// ============================================================

function initGoalBars() {
  var customGoals = loadCustomGoalsFromStorage();
  var allGoalRows = getElementsBySelector('.goal-row');
  
  allGoalRows.forEach(function(goalRow) {
    var statKey = goalRow.dataset.stat;
    var defaultGoalValue = parseInt(goalRow.dataset.goal, 10) || 1;
    var userCustomGoal = customGoals[statKey];
    
    // Use custom goal if it exists, otherwise use default goal
    var targetGoalValue = (userCustomGoal && userCustomGoal > 0) ? userCustomGoal : defaultGoalValue;
    
    // Get the current user stat value
    var currentValue = DEFAULT_STATS[statKey] || 0;
    
    // Calculate percentage (max 100%)
    var percentage = Math.min(100, Math.round((currentValue / targetGoalValue) * 100));
    
    // Update the progress bar numbers (e.g. "12 / 20")
    var goalNumbersElement = getElementById('goal-nums-' + statKey);
    if (goalNumbersElement) {
      goalNumbersElement.textContent = currentValue + ' / ' + targetGoalValue;
    }
    
    // Update the progress bar fill
    var goalBarFill = getElementById('goal-bar-' + statKey);
    if (goalBarFill) {
      // If goal is complete, add the green color
      if (percentage >= 100) {
        goalBarFill.classList.add('complete');
      }
      // Animate the bar width after a short delay
      setTimeout(function() {
        goalBarFill.style.width = percentage + '%';
      }, 200);
    }
  });
}

// ============================================================
// DYNAMIC CUSTOM GOALS — Display user-created goals on the page
// ============================================================

function displayCustomGoals() {
  var customGoalsContainer = getElementById('custom-goals-list');
  
  // If the container doesn't exist, create it
  if (!customGoalsContainer) {
    var goalSetterSection = getElementBySelector('.goal-setter-section');
    if (!goalSetterSection) {
      return;
    }
    
    customGoalsContainer = document.createElement('div');
    customGoalsContainer.id = 'custom-goals-list';
    customGoalsContainer.className = 'custom-goals-list';
    goalSetterSection.parentNode.insertBefore(customGoalsContainer, goalSetterSection.nextSibling);
  }
  
  // Clear the list first
  customGoalsContainer.innerHTML = '';
  
  // Load custom goals from storage
  var customGoals = loadCustomGoalsFromStorage();
  
  // Create a card for each custom goal
  for (var goalKey in customGoals) {
    if (customGoals.hasOwnProperty(goalKey)) {
      var goalValue = customGoals[goalKey];
      
      // Create the goal card div
      var goalCard = document.createElement('div');
      goalCard.className = 'custom-goal-card';
      
      // Card content
      var goalText = document.createElement('p');
      goalText.className = 'custom-goal-text';
      goalText.textContent = 'Goal: ' + goalKey + ' = ' + goalValue;
      
      // Delete button
      var deleteButton = document.createElement('button');
      deleteButton.className = 'delete-goal-btn';
      deleteButton.textContent = 'Delete';
      deleteButton.setAttribute('data-goal-key', goalKey);
      
      // Add click handler to delete button
      deleteButton.addEventListener('click', function() {
        var keyToDelete = this.getAttribute('data-goal-key');
        deleteCustomGoal(keyToDelete);
      });
      
      // Add content to card
      goalCard.appendChild(goalText);
      goalCard.appendChild(deleteButton);
      
      // Add card to container
      customGoalsContainer.appendChild(goalCard);
    }
  }
}

function deleteCustomGoal(goalKey) {
  var customGoals = loadCustomGoalsFromStorage();
  delete customGoals[goalKey];
  saveCustomGoalsToStorage(customGoals);
  displayCustomGoals();
  initGoalBars();
}

// ============================================================
// GOAL SETTER FORM — Handle form submission for new goals
// ============================================================

function initGoalSetterForm() {
  var goalSetterForm = getElementById('goal-setter-form');
  var goalKeyInput = getElementById('goal-key');
  var goalValueInput = getElementById('goal-value');
  var formMessage = getElementById('goal-form-message');
  
  if (!goalSetterForm || !goalKeyInput || !goalValueInput) {
    return;
  }

  goalSetterForm.addEventListener('submit', function(event) {
    // Prevent page reload
    event.preventDefault();
    
    // Get user input
    var goalKeyValue = goalKeyInput.value.trim();
    var goalValueNumber = Number(goalValueInput.value);
    
    // Validate inputs
    if (!goalKeyValue) {
      showFormMessage('Please enter a goal name (e.g., miles, calories)', true);
      return;
    }
    
    if (!Number.isFinite(goalValueNumber) || goalValueNumber <= 0) {
      showFormMessage('Please enter a number greater than 0', true);
      return;
    }
    
    // Load existing goals
    var customGoals = loadCustomGoalsFromStorage();
    
    // Add the new goal
    customGoals[goalKeyValue] = goalValueNumber;
    
    // Save to storage
    var savedSuccessfully = saveCustomGoalsToStorage(customGoals);
    
    if (savedSuccessfully) {
      showFormMessage('Goal saved successfully!', false);
      displayCustomGoals();
      initGoalBars();
      goalSetterForm.reset();
    } else {
      showFormMessage('Error saving goal. Please try again.', true);
    }
  });
}

function showFormMessage(message, isError) {
  var formMessage = getElementById('goal-form-message');
  
  if (!formMessage) {
    return;
  }
  
  // Set message text and color
  formMessage.textContent = message;
  formMessage.style.color = isError ? '#ef4444' : 'var(--accent)';
  
  // Hide message after 4 seconds
  setTimeout(function() {
    formMessage.textContent = '';
  }, 4000);
}

// ============================================================
// INITIALIZATION — Run all functions when page loads
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
  initHamburgerMenu();
  initBadges();
  initGoalBars();
  initGoalSetterForm();
  displayCustomGoals();
});