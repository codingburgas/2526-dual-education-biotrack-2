// workouts.js
// JavaScript for workouts.html — Simple and readable version
// ============================================================
// This file handles:
//   1. Mobile hamburger menu
//   2. Workout card rendering from data
//   3. Statistics bar updates
//   4. Filtering workouts by status
//   5. Adding new workouts
//   6. Session tracking with display results

"use strict";

// Storage key for saving workouts to browser
var WORKOUTS_STORAGE_KEY = 'biotrack_workouts_v1';

// Storage key for saving session data
var SESSION_STORAGE_KEY = 'biotrack_session_v1';

// Default workouts to show if no saved data exists
var defaultWorkoutsList = [
  { name: 'Sports', status: 'completed', img: '../assets/sports.png' },
  { name: 'Running', status: 'upcoming', img: '../assets/running.png' },
  { name: 'Weights', status: 'missed', img: '../assets/weights.png' }
];

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
// LOCAL STORAGE — Load and save workout data
// ============================================================

function loadWorkoutsFromStorage() {
  try {
    var storedData = localStorage.getItem(WORKOUTS_STORAGE_KEY);
    if (storedData) {
      return JSON.parse(storedData);
    } else {
      return defaultWorkoutsList.slice();
    }
  } catch (error) {
    return defaultWorkoutsList.slice();
  }
}

function saveWorkoutsToStorage(workoutArray) {
  try {
    localStorage.setItem(WORKOUTS_STORAGE_KEY, JSON.stringify(workoutArray));
  } catch (error) {
    console.log('Error saving workouts');
  }
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
// WORKOUT CARDS — Display workout cards on the page
// ============================================================

function displayWorkoutCards() {
  var workoutGrid = getElementById('workout-grid');
  
  if (!workoutGrid) {
    return;
  }
  
  // Clear existing cards
  workoutGrid.innerHTML = '';
  
  // Load workouts from storage
  var allWorkouts = loadWorkoutsFromStorage();
  
  // Create a card for each workout
  allWorkouts.forEach(function(workout) {
    // Create card container
    var card = document.createElement('div');
    card.className = 'workout-card ' + workout.status;
    
    // Create image container
    var imgContainer = document.createElement('div');
    imgContainer.className = 'img-container';
    
    // Create image
    var image = document.createElement('img');
    image.src = workout.img;
    image.alt = workout.name;
    
    // Create label
    var label = document.createElement('p');
    label.textContent = workout.name;
    
    // Add image to container
    imgContainer.appendChild(image);
    
    // Add to card
    card.appendChild(imgContainer);
    card.appendChild(label);
    
    // Add card to grid
    workoutGrid.appendChild(card);
  });
}

// ============================================================
// STATISTICS BAR — Count and display workout statistics
// ============================================================

function updateStatisticsBar() {
  var completedCount = 0;
  var upcomingCount = 0;
  var missedCount = 0;
  
  // Load all workouts
  var allWorkouts = loadWorkoutsFromStorage();
  
  // Count workouts by status
  allWorkouts.forEach(function(workout) {
    if (workout.status === 'completed') {
      completedCount = completedCount + 1;
    } else if (workout.status === 'upcoming') {
      upcomingCount = upcomingCount + 1;
    } else if (workout.status === 'missed') {
      missedCount = missedCount + 1;
    }
  });
  
  // Calculate total
  var totalCount = allWorkouts.length;
  
  // Update the display
  var completedElement = getElementById('stat-completed');
  var upcomingElement = getElementById('stat-upcoming');
  var missedElement = getElementById('stat-missed');
  var totalElement = getElementById('stat-total');
  
  if (completedElement) completedElement.textContent = completedCount;
  if (upcomingElement) upcomingElement.textContent = upcomingCount;
  if (missedElement) missedElement.textContent = missedCount;
  if (totalElement) totalElement.textContent = totalCount;
}

// ============================================================
// FILTER BUTTONS — Filter workouts by status
// ============================================================

function initWorkoutFilter() {
  var filterButtons = getElementsBySelector('.filter-btn');
  var workoutCards = getElementsBySelector('.workout-card');
  
  if (filterButtons.length === 0 || workoutCards.length === 0) {
    return;
  }

  // Add click handler to each filter button
  filterButtons.forEach(function(button) {
    button.addEventListener('click', function() {
      var filterType = this.dataset.filter || 'all';
      
      // Update active button
      filterButtons.forEach(function(btn) {
        btn.classList.remove('active');
      });
      button.classList.add('active');
      
      // Show/hide cards based on filter
      workoutCards.forEach(function(card) {
        if (filterType === 'all') {
          card.classList.remove('hidden');
        } else if (card.classList.contains(filterType)) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

// ============================================================
// ADD WORKOUT FORM — Add new workouts from form input
// ============================================================

function initAddWorkoutForm() {
  var addButton = getElementById('add-workout-btn');
  var workoutNameInput = getElementById('workout-name');
  var workoutStatusSelect = getElementById('workout-status');
  var formMessageElement = getElementById('form-message');
  
  if (!addButton || !workoutNameInput || !workoutStatusSelect) {
    return;
  }

  addButton.addEventListener('click', function() {
    // Get input values
    var workoutName = workoutNameInput.value.trim();
    var workoutStatus = workoutStatusSelect.value;
    
    // Validate workout name
    if (!workoutName) {
      showWorkoutMessage('Please enter a workout name', true);
      return;
    }
    
    // Validate workout status
    var validStatuses = ['completed', 'upcoming', 'missed'];
    if (!validStatuses.includes(workoutStatus)) {
      showWorkoutMessage('Invalid status selected', true);
      return;
    }
    
    // Create new workout object
    var newWorkout = {
      name: workoutName,
      status: workoutStatus,
      img: '../assets/sports.png'
    };
    
    // Load existing workouts
    var existingWorkouts = loadWorkoutsFromStorage();
    
    // Add new workout to list
    existingWorkouts.push(newWorkout);
    
    // Save to storage
    saveWorkoutsToStorage(existingWorkouts);
    
    // Update display
    displayWorkoutCards();
    updateStatisticsBar();
    
    // Clear form
    workoutNameInput.value = '';
    workoutStatusSelect.value = 'completed';
    
    // Show success message
    showWorkoutMessage('Workout added successfully!', false);
  });
}

function showWorkoutMessage(messageText, isError) {
  var messageElement = getElementById('form-message');
  
  if (!messageElement) {
    return;
  }
  
  // Set text and color
  messageElement.textContent = messageText;
  messageElement.style.color = isError ? '#ef4444' : 'var(--accent)';
  
  // Hide message after 3 seconds
  setTimeout(function() {
    messageElement.textContent = '';
  }, 3000);
}

// ============================================================
// SESSION TRACKER — Track session and display results
// ============================================================

function initSessionTracker() {
  var sessionChecklistContainer = getElementById('session-checklist');
  var saveSessionButton = getElementById('save-session');
  var clearSessionButton = getElementById('clear-session');
  
  if (!sessionChecklistContainer) {
    return;
  }
  
  // Load previously saved session
  loadSessionState();
  
  // Handle save session button
  if (saveSessionButton) {
    saveSessionButton.addEventListener('click', function() {
      saveSessionState();
      displaySessionResults();
    });
  }
  
  // Handle clear session button
  if (clearSessionButton) {
    clearSessionButton.addEventListener('click', function() {
      // Uncheck all boxes
      var checkboxes = sessionChecklistContainer.querySelectorAll('input[type="checkbox"]');
      checkboxes.forEach(function(checkbox) {
        checkbox.checked = false;
      });
      
      // Clear saved session
      localStorage.removeItem(SESSION_STORAGE_KEY);
      
      // Remove results box if it exists
      var resultBox = getElementById('session-results-box');
      if (resultBox) {
        resultBox.remove();
      }
    });
  }
}

function loadSessionState() {
  var sessionChecklistContainer = getElementById('session-checklist');
  
  if (!sessionChecklistContainer) {
    return;
  }
  
  try {
    var savedSession = localStorage.getItem(SESSION_STORAGE_KEY);
    if (savedSession) {
      var checkedItems = JSON.parse(savedSession);
      var checkboxes = sessionChecklistContainer.querySelectorAll('input[type="checkbox"]');
      
      checkboxes.forEach(function(checkbox) {
        if (checkedItems.includes(checkbox.dataset.name)) {
          checkbox.checked = true;
        }
      });
    }
  } catch (error) {
    console.log('Error loading session state');
  }
}

function saveSessionState() {
  var sessionChecklistContainer = getElementById('session-checklist');
  
  if (!sessionChecklistContainer) {
    return;
  }
  
  // Get all checked items
  var checkboxes = sessionChecklistContainer.querySelectorAll('input[type="checkbox"]');
  var checkedItems = [];
  
  checkboxes.forEach(function(checkbox) {
    if (checkbox.checked) {
      checkedItems.push(checkbox.dataset.name);
    }
  });
  
  // Save to storage
  try {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(checkedItems));
  } catch (error) {
    console.log('Error saving session state');
  }
}

function displaySessionResults() {
  var sessionChecklistContainer = getElementById('session-checklist');
  
  if (!sessionChecklistContainer) {
    return;
  }
  
  // Remove old results box if it exists
  var oldResultBox = getElementById('session-results-box');
  if (oldResultBox) {
    oldResultBox.remove();
  }
  
  // Get all checked items
  var checkboxes = sessionChecklistContainer.querySelectorAll('input[type="checkbox"]');
  var checkedItems = [];
  var totalItems = 0;
  
  checkboxes.forEach(function(checkbox) {
    totalItems = totalItems + 1;
    if (checkbox.checked) {
      var itemLabel = checkbox.parentElement.textContent.trim();
      checkedItems.push(itemLabel);
    }
  });
  
  // Calculate completion percentage
  var completionPercentage = 0;
  if (totalItems > 0) {
    completionPercentage = Math.round((checkedItems.length / totalItems) * 100);
  }
  
  // Create results box
  var resultsBox = document.createElement('div');
  resultsBox.id = 'session-results-box';
  resultsBox.className = 'session-results-box';
  
  // Create title
  var titleElement = document.createElement('h3');
  titleElement.textContent = 'Session Summary';
  
  // Create completion text
  var completionText = document.createElement('p');
  completionText.className = 'session-completion';
  completionText.textContent = 'Completed: ' + checkedItems.length + ' of ' + totalItems + ' items (' + completionPercentage + '%)';
  
  // Create items list
  var itemsList = document.createElement('ul');
  itemsList.className = 'session-items-list';
  
  checkedItems.forEach(function(item) {
    var listItem = document.createElement('li');
    listItem.textContent = item;
    itemsList.appendChild(listItem);
  });
  
  // Add content to results box
  resultsBox.appendChild(titleElement);
  resultsBox.appendChild(completionText);
  if (checkedItems.length > 0) {
    resultsBox.appendChild(itemsList);
  }
  
  // Insert results box after session controls
  var sessionControls = getElementBySelector('.session-controls');
  if (sessionControls) {
    sessionControls.parentNode.insertBefore(resultsBox, sessionControls.nextSibling);
  }
}

// ============================================================
// INITIALIZATION — Run all functions when page loads
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
  initHamburgerMenu();
  displayWorkoutCards();
  updateStatisticsBar();
  initWorkoutFilter();
  initAddWorkoutForm();
  initSessionTracker();
});
