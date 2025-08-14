// Theme Management
class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        this.applyTheme();
        this.bindEvents();
    }

    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.theme);
        localStorage.setItem('theme', this.theme);
    }

    toggle() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        this.applyTheme();
    }

    bindEvents() {
        const toggleBtn = document.getElementById('theme-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.toggle());
        }
    }
}

// Authentication Manager
class AuthManager {
    constructor() {
        this.isAuthenticated = false;
        this.user = null;
        this.init();
    }

    init() {
        this.checkAuthStatus();
        this.bindEvents();
    }

    checkAuthStatus() {
        const authData = localStorage.getItem('airway-auth');
        if (authData) {
            try {
                const parsed = JSON.parse(authData);
                this.isAuthenticated = true;
                this.user = parsed.user;
                this.showDashboard();
            } catch (e) {
                localStorage.removeItem('airway-auth');
            }
        }
    }

    async login(email, password) {
        // Mock authentication - in real app, this would call your API
        return new Promise((resolve) => {
            setTimeout(() => {
                if (email && password) {
                    const userData = {
                        user: {
                            id: "1",
                            name: "John Pilot",
                            email: email,
                            role: "Captain",
                            employeeId: "AW001",
                            department: "Flight Operations",
                        },
                        token: "mock-jwt-token",
                    };
                    
                    localStorage.setItem('airway-auth', JSON.stringify(userData));
                    this.isAuthenticated = true;
                    this.user = userData.user;
                    resolve({ success: true });
                } else {
                    resolve({ success: false, error: 'Invalid credentials' });
                }
            }, 1000);
        });
    }

    logout() {
        localStorage.removeItem('airway-auth');
        this.isAuthenticated = false;
        this.user = null;
        this.showLogin();
    }

    showDashboard() {
        document.querySelector('.container').classList.add('hidden');
        document.getElementById('dashboard').classList.remove('hidden');
        
        // Update user name in dashboard
        const userNameEl = document.getElementById('user-name');
        if (userNameEl && this.user) {
            userNameEl.textContent = this.user.name;
        }
    }

    showLogin() {
        document.querySelector('.container').classList.remove('hidden');
        document.getElementById('dashboard').classList.add('hidden');
    }

    bindEvents() {
        // Login form
        const loginForm = document.getElementById('login-form');
        const submitBtn = document.getElementById('submit-btn');
        
        if (loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;
                
                // Show loading state
                submitBtn.classList.add('loading');
                submitBtn.disabled = true;
                
                try {
                    const result = await this.login(email, password);
                    
                    if (result.success) {
                        this.showDashboard();
                    } else {
                        alert('Login failed: ' + result.error);
                    }
                } catch (error) {
                    alert('Login failed: ' + error.message);
                } finally {
                    // Remove loading state
                    submitBtn.classList.remove('loading');
                    submitBtn.disabled = false;
                }
            });
        }

        // Logout button
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.logout();
            });
        }
    }
}

// Dashboard Manager
class DashboardManager {
    constructor() {
        this.stats = {
            activeFlights: 24,
            todayRevenue: 45230,
            availableAircraft: 18,
            totalAircraft: 20,
            activeEmployees: 156
        };
        this.init();
    }

    init() {
        this.updateStats();
        this.startRealTimeUpdates();
    }

    updateStats() {
        // Simulate real-time updates
        this.stats.activeFlights = Math.floor(Math.random() * 10) + 20;
        this.stats.todayRevenue += Math.floor(Math.random() * 1000);
        this.stats.availableAircraft = Math.floor(Math.random() * 3) + 17;
        
        // Update DOM if dashboard is visible
        const dashboard = document.getElementById('dashboard');
        if (dashboard && !dashboard.classList.contains('hidden')) {
            this.renderStats();
        }
    }

    renderStats() {
        const cards = document.querySelectorAll('.dashboard-card');
        if (cards.length >= 4) {
            cards[0].querySelector('.stat-number').textContent = this.stats.activeFlights;
            cards[1].querySelector('.stat-number').textContent = `$${this.stats.todayRevenue.toLocaleString()}`;
            cards[2].querySelector('.stat-number').textContent = `${this.stats.availableAircraft}/${this.stats.totalAircraft}`;
            cards[3].querySelector('.stat-number').textContent = this.stats.activeEmployees;
        }
    }

    startRealTimeUpdates() {
        // Update stats every 30 seconds
        setInterval(() => {
            this.updateStats();
        }, 30000);
    }
}

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    // Initialize managers
    const themeManager = new ThemeManager();
    const authManager = new AuthManager();
    const dashboardManager = new DashboardManager();

    // Add some interactive animations
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-4px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Add form validation feedback
    const inputs = document.querySelectorAll('.form-input');
    inputs.forEach(input => {
        input.addEventListener('blur', () => {
            if (input.value && input.checkValidity()) {
                input.style.borderColor = '#10b981';
            } else if (input.value) {
                input.style.borderColor = '#ef4444';
            }
        });

        input.addEventListener('focus', () => {
            input.style.borderColor = 'var(--primary-color)';
        });
    });

    console.log('SkyLine Airways Employee Portal initialized successfully!');
});
