// Check if user is logged in
function checkAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn && !window.location.href.includes('index.html')) {
        window.location.href = 'index.html';
    } else if (isLoggedIn && window.location.href.includes('index.html')) {
        window.location.href = 'home.html';
    }
}

// Handle logout
function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    window.location.href = 'index.html';
}

// Add welcome message
function addWelcomeMessage() {
    const username = localStorage.getItem('username');
    if (username) {
        const welcomeMessage = document.querySelector('.welcome-message');
        if (welcomeMessage) {
            welcomeMessage.textContent = `Welcome, ${username}!`;
        }
    }
}

// Run auth check when page loads
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    addWelcomeMessage();
    
    // Add logout functionality to logout buttons
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }
});
