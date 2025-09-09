// Application State Management
class AppState {
    constructor() {
        this.currentUser = null;
        this.currentPage = 'dashboard';
        this.isAuthenticated = false;
        this.data = {
            users: [
                {id: 1, name: "John Admin", email: "admin@inlintech.net", role: "admin", department: "IT", status: "active"},
                {id: 2, name: "Sarah HR", email: "sarah@inlintech.net", role: "hr_manager", department: "Human Resources", status: "active"},
                {id: 3, name: "Mike Inventory", email: "mike@inlintech.net", role: "inventory_manager", department: "Operations", status: "active"},
                {id: 4, name: "Alice Employee", email: "alice@inlintech.net", role: "employee", department: "Marketing", status: "active"}
            ],
            employees: [
                {id: 1, name: "Alice Johnson", position: "Marketing Specialist", department: "Marketing", joinDate: "2023-03-15", status: "Active"},
                {id: 2, name: "Bob Smith", position: "Software Developer", department: "IT", joinDate: "2022-11-20", status: "Active"},
                {id: 3, name: "Carol Wilson", position: "HR Assistant", department: "Human Resources", joinDate: "2024-01-10", status: "Active"},
                {id: 4, name: "David Brown", position: "Operations Manager", department: "Operations", joinDate: "2021-08-05", status: "Active"}
            ],
            inventory: [
                {id: 1, name: "Dell Laptop XPS 13", category: "Computers", assignedTo: "Alice Johnson", status: "In Use", purchaseDate: "2024-02-15", value: "$1,200"},
                {id: 2, name: "iPhone 14 Pro", category: "Mobile Devices", assignedTo: "Bob Smith", status: "In Use", purchaseDate: "2024-03-10", value: "$999"},
                {id: 3, name: "Office Chair", category: "Furniture", assignedTo: "Carol Wilson", status: "In Use", purchaseDate: "2024-01-20", value: "$350"},
                {id: 4, name: "Projector", category: "Electronics", assignedTo: "Unassigned", status: "Available", purchaseDate: "2023-12-05", value: "$800"}
            ],
            leaveRequests: [
                {id: 1, employee: "Alice Johnson", type: "Vacation", startDate: "2025-10-15", endDate: "2025-10-20", status: "Pending", days: 5},
                {id: 2, employee: "Bob Smith", type: "Sick Leave", startDate: "2025-09-10", endDate: "2025-09-12", status: "Approved", days: 3},
                {id: 3, employee: "Carol Wilson", type: "Personal", startDate: "2025-11-01", endDate: "2025-11-01", status: "Pending", days: 1}
            ]
        };
    }

    setCurrentUser(user) {
        this.currentUser = user;
        this.isAuthenticated = true;
        const userNameEl = document.getElementById('userName');
        if (userNameEl) {
            userNameEl.textContent = user.name;
        }
        this.updateUIForRole(user.role);
    }

    updateUIForRole(role) {
        // Show/hide navigation items based on role
        const navLinks = document.querySelectorAll('.nav-link[data-roles]');
        navLinks.forEach(link => {
            const allowedRoles = link.dataset.roles.split(',');
            if (allowedRoles.includes(role)) {
                link.style.display = 'flex';
            } else {
                link.style.display = 'none';
            }
        });

        // Set appropriate default page based on role
        if (role === 'employee') {
            this.setCurrentPage('portal');
        } else {
            this.setCurrentPage('dashboard');
        }
    }

    setCurrentPage(page) {
        this.currentPage = page;
        // Update active navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        const activeLink = document.querySelector(`[data-page="${page}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }

        // Show/hide pages
        document.querySelectorAll('.page').forEach(p => {
            p.classList.remove('active');
        });
        
        const activePage = document.getElementById(`${page}Page`);
        if (activePage) {
            activePage.classList.add('active');
        }
    }

    logout() {
        this.currentUser = null;
        this.isAuthenticated = false;
        this.currentPage = 'dashboard';
        const mainApp = document.getElementById('mainApp');
        const loginScreen = document.getElementById('loginScreen');
        if (mainApp && loginScreen) {
            mainApp.classList.add('hidden');
            loginScreen.classList.remove('hidden');
        }
    }
}

// Global app state
const appState = new AppState();

// Authentication Manager
class AuthManager {
    static authenticate(email, password) {
        console.log('Attempting authentication for:', email);
        const user = appState.data.users.find(u => u.email === email);
        if (user) {
            console.log('User found:', user);
            // In a real app, we'd verify password here
            appState.setCurrentUser(user);
            const loginScreen = document.getElementById('loginScreen');
            const mainApp = document.getElementById('mainApp');
            
            if (loginScreen && mainApp) {
                loginScreen.classList.add('hidden');
                mainApp.classList.remove('hidden');
            }
            
            // Initialize the appropriate page content
            setTimeout(() => {
                PageManager.initializePage(appState.currentPage);
            }, 100);
            return true;
        }
        console.log('User not found for email:', email);
        return false;
    }

    static logout() {
        appState.logout();
    }
}

// Page Management
class PageManager {
    static initializePage(page) {
        console.log('Initializing page:', page);
        switch(page) {
            case 'dashboard':
                this.initializeDashboard();
                break;
            case 'hr':
                this.initializeHRPage();
                break;
            case 'inventory':
                this.initializeInventoryPage();
                break;
            case 'portal':
                this.initializePortalPage();
                break;
            case 'admin':
                this.initializeAdminPage();
                break;
        }
    }

    static initializeDashboard() {
        // Initialize dashboard chart
        setTimeout(() => {
            this.initializeEmployeeChart();
        }, 200);
    }

    static initializeEmployeeChart() {
        const ctx = document.getElementById('employeeChart');
        if (ctx && !ctx.chart) {
            try {
                const chart = new Chart(ctx, {
                    type: 'doughnut',
                    data: {
                        labels: ['IT', 'Marketing', 'HR', 'Operations', 'Others'],
                        datasets: [{
                            data: [45, 30, 25, 35, 21],
                            backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F'],
                            borderWidth: 0
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                position: 'bottom',
                                labels: {
                                    padding: 20,
                                    usePointStyle: true
                                }
                            }
                        }
                    }
                });
                ctx.chart = chart;
            } catch (error) {
                console.log('Chart.js not available, skipping chart initialization');
            }
        }
    }

    static initializeHRPage() {
        this.renderEmployeeTable();
        this.renderLeaveRequestTable();
    }

    static initializeInventoryPage() {
        this.renderAssetTable();
    }

    static initializePortalPage() {
        // Portal content is mostly static, but we could populate user-specific data here
        console.log('Portal page initialized');
    }

    static initializeAdminPage() {
        this.renderUserTable();
    }

    static renderEmployeeTable() {
        const tbody = document.getElementById('employeeTableBody');
        if (!tbody) return;

        tbody.innerHTML = appState.data.employees.map(employee => `
            <tr>
                <td>${employee.name}</td>
                <td>${employee.position}</td>
                <td>${employee.department}</td>
                <td>${employee.joinDate}</td>
                <td>
                    <span class="status status--success">${employee.status}</span>
                </td>
                <td>
                    <div class="actions">
                        <button class="action-btn action-btn--edit" onclick="editEmployee(${employee.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn action-btn--delete" onclick="deleteEmployee(${employee.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    static renderLeaveRequestTable() {
        const tbody = document.getElementById('leaveRequestTableBody');
        if (!tbody) return;

        tbody.innerHTML = appState.data.leaveRequests.map(request => `
            <tr>
                <td>${request.employee}</td>
                <td>${request.type}</td>
                <td>${request.startDate}</td>
                <td>${request.endDate}</td>
                <td>${request.days}</td>
                <td>
                    <span class="status status--${request.status === 'Approved' ? 'success' : request.status === 'Pending' ? 'warning' : 'error'}">
                        ${request.status}
                    </span>
                </td>
                <td>
                    <div class="actions">
                        ${request.status === 'Pending' ? `
                            <button class="action-btn action-btn--edit" onclick="approveLeave(${request.id})">
                                <i class="fas fa-check"></i>
                            </button>
                            <button class="action-btn action-btn--delete" onclick="rejectLeave(${request.id})">
                                <i class="fas fa-times"></i>
                            </button>
                        ` : `
                            <button class="action-btn action-btn--edit" onclick="viewLeave(${request.id})">
                                <i class="fas fa-eye"></i>
                            </button>
                        `}
                    </div>
                </td>
            </tr>
        `).join('');
    }

    static renderAssetTable() {
        const tbody = document.getElementById('assetTableBody');
        if (!tbody) return;

        tbody.innerHTML = appState.data.inventory.map(asset => `
            <tr>
                <td>${asset.name}</td>
                <td>${asset.category}</td>
                <td>${asset.assignedTo}</td>
                <td>
                    <span class="status status--${asset.status === 'In Use' ? 'warning' : 'success'}">
                        ${asset.status}
                    </span>
                </td>
                <td>${asset.purchaseDate}</td>
                <td>${asset.value}</td>
                <td>
                    <div class="actions">
                        <button class="action-btn action-btn--edit" onclick="editAsset(${asset.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn action-btn--delete" onclick="deleteAsset(${asset.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    static renderUserTable() {
        const tbody = document.getElementById('userTableBody');
        if (!tbody) return;

        tbody.innerHTML = appState.data.users.map(user => `
            <tr>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>
                    <span class="status status--info">
                        ${user.role.replace('_', ' ').toUpperCase()}
                    </span>
                </td>
                <td>${user.department}</td>
                <td>
                    <span class="status status--success">${user.status}</span>
                </td>
                <td>
                    <div class="actions">
                        <button class="action-btn action-btn--edit" onclick="editUser(${user.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn action-btn--delete" onclick="deleteUser(${user.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }
}

// Modal Management
class ModalManager {
    static openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('hidden');
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    }

    static closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.classList.add('hidden');
                document.body.style.overflow = '';
            }, 300);
        }
    }

    static closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.classList.add('hidden');
                document.body.style.overflow = '';
            }, 300);
        });
    }
}

// Tab Management
class TabManager {
    static switchTab(tabContainer, tabId) {
        // Remove active class from all tab buttons in this container
        const container = document.querySelector(`.${tabContainer}`);
        if (!container) return;

        container.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Add active class to clicked tab button
        const activeBtn = container.querySelector(`[data-tab="${tabId}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }

        // Hide all tab panes
        document.querySelectorAll('.tab-pane').forEach(pane => {
            pane.classList.remove('active');
        });

        // Show active tab pane
        const activePane = document.getElementById(tabId);
        if (activePane) {
            activePane.classList.add('active');
        }
    }
}

// Form Management
class FormManager {
    static submitForm(formId) {
        const form = document.getElementById(formId);
        if (!form) return;

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Simulate form submission
        this.showNotification('Form submitted successfully!', 'success');
        
        // Add new data to appropriate array based on form type
        if (formId === 'addEmployeeForm') {
            const newEmployee = {
                id: appState.data.employees.length + 1,
                name: data.name,
                position: data.position,
                department: data.department,
                joinDate: data.joinDate,
                status: 'Active'
            };
            appState.data.employees.push(newEmployee);
            PageManager.renderEmployeeTable();
        } else if (formId === 'addAssetForm') {
            const newAsset = {
                id: appState.data.inventory.length + 1,
                name: data.name,
                category: data.category,
                assignedTo: 'Unassigned',
                status: 'Available',
                purchaseDate: data.purchaseDate,
                value: data.value
            };
            appState.data.inventory.push(newAsset);
            PageManager.renderAssetTable();
        } else if (formId === 'leaveRequestForm') {
            const startDate = new Date(data.startDate);
            const endDate = new Date(data.endDate);
            const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
            
            const newRequest = {
                id: appState.data.leaveRequests.length + 1,
                employee: appState.currentUser.name,
                type: data.type,
                startDate: data.startDate,
                endDate: data.endDate,
                status: 'Pending',
                days: days
            };
            appState.data.leaveRequests.push(newRequest);
            PageManager.renderLeaveRequestTable();
        }

        // Clear form and close modal
        form.reset();
        ModalManager.closeAllModals();
    }

    static showNotification(message, type = 'info') {
        // Create and show notification
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--color-surface);
            border: 1px solid var(--color-${type === 'success' ? 'success' : type === 'error' ? 'error' : 'info'});
            color: var(--color-${type === 'success' ? 'success' : type === 'error' ? 'error' : 'info'});
            padding: 16px 20px;
            border-radius: 8px;
            box-shadow: var(--shadow-lg);
            z-index: 2000;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Global functions for button clicks
function openModal(modalId) {
    ModalManager.openModal(modalId);
}

function closeModal(modalId) {
    ModalManager.closeModal(modalId);
}

function submitForm(formId) {
    FormManager.submitForm(formId);
}

// Action functions
function editEmployee(id) {
    FormManager.showNotification('Edit employee functionality would be implemented here', 'info');
}

function deleteEmployee(id) {
    if (confirm('Are you sure you want to delete this employee?')) {
        appState.data.employees = appState.data.employees.filter(emp => emp.id !== id);
        PageManager.renderEmployeeTable();
        FormManager.showNotification('Employee deleted successfully', 'success');
    }
}

function editAsset(id) {
    FormManager.showNotification('Edit asset functionality would be implemented here', 'info');
}

function deleteAsset(id) {
    if (confirm('Are you sure you want to delete this asset?')) {
        appState.data.inventory = appState.data.inventory.filter(asset => asset.id !== id);
        PageManager.renderAssetTable();
        FormManager.showNotification('Asset deleted successfully', 'success');
    }
}

function editUser(id) {
    FormManager.showNotification('Edit user functionality would be implemented here', 'info');
}

function deleteUser(id) {
    if (confirm('Are you sure you want to delete this user?')) {
        appState.data.users = appState.data.users.filter(user => user.id !== id);
        PageManager.renderUserTable();
        FormManager.showNotification('User deleted successfully', 'success');
    }
}

function approveLeave(id) {
    const request = appState.data.leaveRequests.find(req => req.id === id);
    if (request) {
        request.status = 'Approved';
        PageManager.renderLeaveRequestTable();
        FormManager.showNotification('Leave request approved', 'success');
    }
}

function rejectLeave(id) {
    const request = appState.data.leaveRequests.find(req => req.id === id);
    if (request) {
        request.status = 'Rejected';
        PageManager.renderLeaveRequestTable();
        FormManager.showNotification('Leave request rejected', 'info');
    }
}

function viewLeave(id) {
    FormManager.showNotification('Leave details view would be implemented here', 'info');
}

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded - Initializing application');
    
    // Login form handler
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        console.log('Login form found, adding event listener');
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Login form submitted');
            
            const emailInput = document.getElementById('email');
            const passwordInput = document.getElementById('password');
            
            if (!emailInput || !passwordInput) {
                console.error('Email or password input not found');
                return;
            }
            
            const email = emailInput.value.trim();
            const password = passwordInput.value.trim();
            
            console.log('Attempting login with email:', email);
            
            if (!email || !password) {
                FormManager.showNotification('Please enter both email and password', 'error');
                return;
            }
            
            if (AuthManager.authenticate(email, password)) {
                FormManager.showNotification('Login successful!', 'success');
            } else {
                FormManager.showNotification('Invalid credentials. Please try demo users.', 'error');
            }
        });
    } else {
        console.error('Login form not found');
    }

    // Demo user quick login
    document.querySelectorAll('.demo-user').forEach(userEl => {
        console.log('Adding click handler to demo user:', userEl.dataset.email);
        userEl.addEventListener('click', function(e) {
            e.preventDefault();
            const email = this.dataset.email;
            const emailInput = document.getElementById('email');
            const passwordInput = document.getElementById('password');
            
            if (emailInput && passwordInput) {
                emailInput.value = email;
                passwordInput.value = 'demo123';
                console.log('Populated login fields with:', email);
            } else {
                console.error('Could not find email or password inputs');
            }
        });
    });

    // Navigation handlers
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.dataset.page;
            if (page) {
                console.log('Navigating to page:', page);
                appState.setCurrentPage(page);
                PageManager.initializePage(page);
                
                // Close mobile menu if open
                const headerNav = document.getElementById('headerNav');
                if (headerNav) {
                    headerNav.classList.remove('show');
                }
            }
        });
    });

    // Mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const headerNav = document.getElementById('headerNav');
    if (mobileMenuToggle && headerNav) {
        mobileMenuToggle.addEventListener('click', function() {
            headerNav.classList.toggle('show');
        });
    }

    // User profile dropdown
    const userProfile = document.getElementById('userProfile');
    const userDropdown = document.getElementById('userDropdown');
    if (userProfile && userDropdown) {
        userProfile.addEventListener('click', function(e) {
            e.stopPropagation();
            userDropdown.classList.toggle('show');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function() {
            userDropdown.classList.remove('show');
        });
    }

    // Logout handler
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            AuthManager.logout();
            FormManager.showNotification('Logged out successfully', 'success');
        });
    }

    // Tab handlers
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.dataset.tab;
            const parentContainer = this.closest('.hr-tabs, .inventory-tabs, .admin-tabs');
            
            if (parentContainer) {
                const containerClass = parentContainer.className.split(' ')[0];
                TabManager.switchTab(containerClass, tabId);
            }
        });
    });

    // Modal backdrop close
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                ModalManager.closeModal(this.id);
            }
        });
    });

    // Form validation
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
        });
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Escape key closes modals
        if (e.key === 'Escape') {
            ModalManager.closeAllModals();
            const userDropdown = document.getElementById('userDropdown');
            if (userDropdown) {
                userDropdown.classList.remove('show');
            }
        }
    });

    // Initialize tooltips and other enhancements
    initializeEnhancements();
    
    console.log('Application initialization complete');
});

function initializeEnhancements() {
    // Add loading states to buttons
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function() {
            if (!this.classList.contains('loading')) {
                this.classList.add('loading');
                setTimeout(() => {
                    this.classList.remove('loading');
                }, 1000);
            }
        });
    });

    // Add hover effects to cards
    document.querySelectorAll('.card, .metric-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Search functionality (basic implementation)
    document.querySelectorAll('input[placeholder*="Search"]').forEach(searchInput => {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const table = this.closest('.search-bar').nextElementSibling.querySelector('table');
            
            if (table) {
                const rows = table.querySelectorAll('tbody tr');
                rows.forEach(row => {
                    const text = row.textContent.toLowerCase();
                    row.style.display = text.includes(searchTerm) ? '' : 'none';
                });
            }
        });
    });
}

// Service Worker Registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // In a real application, you would register a service worker here
        console.log('Service Worker support detected');
    });
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('Application error:', e.error);
    FormManager.showNotification('An error occurred. Please try again.', 'error');
});

// Online/offline detection
window.addEventListener('online', function() {
    FormManager.showNotification('Connection restored', 'success');
});

window.addEventListener('offline', function() {
    FormManager.showNotification('You are now offline', 'warning');
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        AppState,
        AuthManager,
        PageManager,
        ModalManager,
        TabManager,
        FormManager
    };
}