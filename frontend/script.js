/*
==================================================
  Smart Wardrobe - Master JavaScript File - Final
==================================================
*/

// Main function to run when the page is ready
document.addEventListener('DOMContentLoaded', function() { // Wait for DOM to be fully loaded before executing code

    // --- SHARED FUNCTIONALITY (Runs on every page) ---
    initSidebar(); // Initialize collapsible sidebar functionality
    initAvatarDropdown(); // Initialize user avatar dropdown menu

    // --- PAGE-SPECIFIC INITIALIZATION ---
    const path = window.location.pathname; // Get current page path
    
    if (path.includes('index.html') || path.endsWith('/')) { // Check if on home page
        initHomePage(); // Initialize home page specific functionality
    }
    // Add other page initializers here if needed
    // else if (path.includes('wardrobe.html')) {
    //     initWardrobePage();
    // }
});

/**
 * Initializes the collapsible sidebar functionality.
 */
function initSidebar() {
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const body = document.body;

    if (sidebarToggle && body) {
        const updateToggleUI = () => {
            const isCollapsed = body.classList.contains('sidebar-collapsed');
            const labelEl = sidebarToggle.querySelector('.label');
            const iconEl = sidebarToggle.querySelector('svg, .fa-chevron-left');
            if (labelEl) labelEl.textContent = isCollapsed ? 'Expand' : 'Collapse';
            sidebarToggle.setAttribute('aria-label', isCollapsed ? 'Expand sidebar' : 'Collapse sidebar');
            sidebarToggle.setAttribute('title', isCollapsed ? 'Expand sidebar' : 'Collapse sidebar');
            if (iconEl && iconEl.classList && iconEl.classList.contains('fa-chevron-left')) {
                iconEl.classList.toggle('fa-rotate-180', isCollapsed);
            }
        };

        sidebarToggle.addEventListener('click', () => {
            body.classList.toggle('sidebar-collapsed');
            localStorage.setItem('sidebarCollapsed', body.classList.contains('sidebar-collapsed'));
            updateToggleUI();
        });

        if (localStorage.getItem('sidebarCollapsed') === 'true') {
            body.classList.add('sidebar-collapsed');
        }
        updateToggleUI();
    }
}

/**
 * Initializes the user avatar dropdown and logout button.
 */
function initAvatarDropdown() {
    const avatar = document.getElementById('user-avatar');
    const dropdown = document.getElementById('user-dropdown');
    const logoutBtn = document.getElementById('logout-btn');

    if (avatar && dropdown) {
        avatar.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('show');
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            try { if (window.userDB && typeof userDB.logoutUser === 'function') userDB.logoutUser(); } catch (e) {}
            // Fallback: ensure auth flags are cleared
            try { sessionStorage.removeItem('isLoggedIn'); } catch (e) {}
            try { localStorage.removeItem('currentUser'); } catch (e) {}
            if (dropdown) dropdown.classList.remove('show');
            window.location.href = 'login.html';
        });
    }

    // Close dropdown if clicked outside
    document.addEventListener('click', () => {
        if (dropdown && dropdown.classList.contains('show')) {
            dropdown.classList.remove('show');
        }
    });
}

/**
 * Initializes functionality for the Home page (index.html).
 */
function initHomePage() {
    updateWeatherUI(24, 'Clear'); // Example: 24°C, Clear
}

/**
 * Updates the weather widget on the UI.
 * @param {number} temperature - The temperature in Celsius.
 * @param {string} condition - The weather condition (e.g., 'Clear', 'Rain').
 */
function updateWeatherUI(temperature, condition) {
    const tempElement = document.getElementById('current-temp');
    const tipElement = document.getElementById('weather-outfit-tip');
    const weatherIcon = document.querySelector('.current-weather i');

    if (!tempElement || !tipElement || !weatherIcon) return;

    tempElement.textContent = `${Math.round(temperature)}°C`;
    weatherIcon.className = 'fas'; // Reset classes

    if (condition === 'Clear') {
        weatherIcon.classList.add('fa-sun');
        tipElement.textContent = 'Perfect day for light layers!';
    } else if (condition === 'Rain') {
        weatherIcon.classList.add('fa-cloud-rain');
        tipElement.textContent = 'Don\'t forget your umbrella!';
    } else {
        weatherIcon.classList.add('fa-cloud');
        tipElement.textContent = 'A light jacket might be a good idea!';
    }
}