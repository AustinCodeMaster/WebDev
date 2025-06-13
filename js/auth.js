// Check if user is logged in
function checkAuth() {
    const user = localStorage.getItem('lofoUser');
    const publicPages = ['login.html', 'register.html', 'about.html', 'contact.html'];
    const currentPage = window.location.pathname.split('/').pop();

    if (!user && !publicPages.includes(currentPage)) {
        window.location.href = 'login.html';
    } else if (user && currentPage === 'login.html') {
        window.location.href = 'home.html';
    }
}

// Handle logout
function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    window.location.href = 'login.html';
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
