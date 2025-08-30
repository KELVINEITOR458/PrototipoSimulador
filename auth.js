// Sistema de Autenticación - Simulador de Negocios

// Variables globales
let currentUser = null;
let isDemoMode = false;

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    initializeAuth();
});

function initializeAuth() {
    // Verificar si hay una sesión activa
    checkAuthStatus();
    
    // Configurar formularios
    setupAuthForms();
    
    // Configurar navegación
    setupAuthNavigation();
}

// Verificar estado de autenticación
function checkAuthStatus() {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
        try {
            currentUser = JSON.parse(userData);
            updateUIForLoggedUser();
        } catch (error) {
            console.error('Error parsing user data:', error);
            logout();
        }
    } else {
        updateUIForGuest();
    }
}

// Configurar formularios de autenticación
function setupAuthForms() {
    // Formulario de login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Formulario de registro
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
}

// Manejar login
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;
    
    // Validaciones básicas
    if (!email || !password) {
        showAuthError('Por favor completa todos los campos');
        return;
    }
    
    if (!isValidEmail(email)) {
        showAuthError('Por favor ingresa un email válido');
        return;
    }
    
    // Simular login (en producción esto sería una llamada al servidor)
    simulateLogin(email, password, remember);
}

// Manejar registro
function handleRegister(e) {
    e.preventDefault();
    
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const terms = document.getElementById('terms').checked;
    
    // Validaciones
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
        showAuthError('Por favor completa todos los campos');
        return;
    }
    
    if (!isValidEmail(email)) {
        showAuthError('Por favor ingresa un email válido');
        return;
    }
    
    if (password.length < 8) {
        showAuthError('La contraseña debe tener al menos 8 caracteres');
        return;
    }
    
    if (password !== confirmPassword) {
        showAuthError('Las contraseñas no coinciden');
        return;
    }
    
    if (!terms) {
        showAuthError('Debes aceptar los términos y condiciones');
        return;
    }
    
    // Simular registro
    simulateRegister(firstName, lastName, email, password);
}

// Simular login
function simulateLogin(email, password, remember) {
    // Mostrar loading
    showAuthLoading();
    
    // Simular delay de red
    setTimeout(() => {
        // En producción, aquí se validaría contra el servidor
        if (email === 'demo@example.com' && password === 'demo123') {
            const userData = {
                id: 1,
                firstName: 'Usuario',
                lastName: 'Demo',
                email: email,
                plan: 'premium'
            };
            
            loginSuccess(userData, remember);
        } else {
            showAuthError('Email o contraseña incorrectos');
        }
    }, 1500);
}

// Simular registro
function simulateRegister(firstName, lastName, email, password) {
    showAuthLoading();
    
    setTimeout(() => {
        // Verificar si el email ya existe (simulado)
        if (email === 'demo@example.com') {
            showAuthError('Este email ya está registrado');
            return;
        }
        
        const userData = {
            id: Date.now(),
            firstName: firstName,
            lastName: lastName,
            email: email,
            plan: 'free'
        };
        
        registerSuccess(userData);
    }, 1500);
}

// Login exitoso
function loginSuccess(userData, remember) {
    currentUser = userData;
    
    // Guardar en localStorage
    const token = generateToken();
    localStorage.setItem('authToken', token);
    localStorage.setItem('userData', JSON.stringify(userData));
    
    if (remember) {
        localStorage.setItem('rememberMe', 'true');
    }
    
    // Redirigir al dashboard
    window.location.href = 'dashboard.html';
}

// Registro exitoso
function registerSuccess(userData) {
    currentUser = userData;
    
    // Guardar en localStorage
    const token = generateToken();
    localStorage.setItem('authToken', token);
    localStorage.setItem('userData', JSON.stringify(userData));
    
    // Mostrar mensaje de bienvenida
    showAuthSuccess('¡Cuenta creada exitosamente!');
    
    // Redirigir al dashboard
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 2000);
}

// Logout
function logout() {
    currentUser = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('rememberMe');
    
    // Redirigir al inicio
    window.location.href = 'index.html';
}

// Generar token (simulado)
function generateToken() {
    return 'token_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Validar email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Mostrar error de autenticación
function showAuthError(message) {
    hideAuthLoading();
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'alert alert-error auth-alert';
    errorDiv.innerHTML = `
        <i class="fas fa-exclamation-circle"></i>
        <span>${message}</span>
    `;
    
    insertAuthAlert(errorDiv);
}

// Mostrar éxito de autenticación
function showAuthSuccess(message) {
    hideAuthLoading();
    
    const successDiv = document.createElement('div');
    successDiv.className = 'alert alert-success auth-alert';
    successDiv.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    
    insertAuthAlert(successDiv);
}

// Mostrar loading
function showAuthLoading() {
    const submitBtn = document.querySelector('.auth-form .btn');
    if (submitBtn) {
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';
        submitBtn.disabled = true;
    }
}

// Ocultar loading
function hideAuthLoading() {
    const submitBtn = document.querySelector('.auth-form .btn');
    if (submitBtn) {
        const isLogin = window.location.pathname.includes('login.html');
        submitBtn.innerHTML = isLogin ? 
            '<i class="fas fa-sign-in-alt"></i> Iniciar Sesión' :
            '<i class="fas fa-user-plus"></i> Crear Cuenta';
        submitBtn.disabled = false;
    }
}

// Insertar alerta de autenticación
function insertAuthAlert(alertElement) {
    const form = document.querySelector('.auth-form');
    if (form) {
        // Remover alertas previas
        const prevAlerts = form.querySelectorAll('.auth-alert');
        prevAlerts.forEach(alert => alert.remove());
        
        // Insertar nueva alerta
        form.insertBefore(alertElement, form.firstChild);
        
        // Auto-remover después de 5 segundos
        setTimeout(() => {
            alertElement.remove();
        }, 5000);
    }
}

// Actualizar UI para usuario logueado
function updateUIForLoggedUser() {
    const nav = document.querySelector('.nav');
    if (nav) {
        nav.innerHTML = `
            <a href="dashboard.html" class="nav-link">Dashboard</a>
            <a href="mis-simulaciones.html" class="nav-link">Mis Simulaciones</a>
            <div class="user-menu">
                <button class="user-menu-btn" onclick="toggleUserMenu()">
                    <i class="fas fa-user-circle"></i>
                    ${currentUser.firstName}
                    <i class="fas fa-chevron-down"></i>
                </button>
                <div class="user-dropdown" id="userDropdown">
                    <a href="perfil.html" class="dropdown-item">
                        <i class="fas fa-user"></i> Mi Perfil
                    </a>
                    <a href="configuracion.html" class="dropdown-item">
                        <i class="fas fa-cog"></i> Configuración
                    </a>
                    <div class="dropdown-divider"></div>
                    <a href="#" class="dropdown-item" onclick="logout()">
                        <i class="fas fa-sign-out-alt"></i> Cerrar Sesión
                    </a>
                </div>
            </div>
        `;
    }
}

// Actualizar UI para invitado
function updateUIForGuest() {
    const nav = document.querySelector('.nav');
    if (nav) {
        nav.innerHTML = `
            <a href="#" class="nav-link active">Inicio</a>
            <a href="#" class="nav-link">Demo</a>
            <a href="#" class="nav-link">Ayuda</a>
            <a href="login.html" class="nav-link">Iniciar Sesión</a>
        `;
    }
}

// Configurar navegación de autenticación
function setupAuthNavigation() {
    // Verificar si estamos en modo demo
    const urlParams = new URLSearchParams(window.location.search);
    isDemoMode = urlParams.get('demo') === 'true';
    
    if (isDemoMode) {
        updateUIForDemoMode();
    }
}

// Actualizar UI para modo demo
function updateUIForDemoMode() {
    const nav = document.querySelector('.nav');
    if (nav) {
        nav.innerHTML = `
            <a href="index.html" class="nav-link">Inicio</a>
            <a href="#" class="nav-link active">Demo</a>
            <a href="#" class="nav-link">Ayuda</a>
            <a href="login.html" class="nav-link">Versión Completa</a>
        `;
    }
}

// Toggle menú de usuario
function toggleUserMenu() {
    const dropdown = document.getElementById('userDropdown');
    if (dropdown) {
        dropdown.classList.toggle('show');
    }
}

// Cerrar menú de usuario al hacer clic fuera
document.addEventListener('click', function(e) {
    const userMenu = document.querySelector('.user-menu');
    const dropdown = document.getElementById('userDropdown');
    
    if (userMenu && !userMenu.contains(e.target) && dropdown) {
        dropdown.classList.remove('show');
    }
});

// Verificar si el usuario está autenticado
function isAuthenticated() {
    return currentUser !== null;
}

// Verificar si es modo demo
function isDemo() {
    return isDemoMode;
}

// Obtener usuario actual
function getCurrentUser() {
    return currentUser;
}

// Función para iniciar modo demo
function startDemo() {
    isDemoMode = true;
    window.location.href = 'configuracion.html?demo=true';
}

// Función para verificar acceso a funcionalidades premium
function hasPremiumAccess() {
    return isAuthenticated() && currentUser.plan === 'premium';
}

// Función para mostrar mensaje de funcionalidad premium
function showPremiumMessage() {
    const message = 'Esta funcionalidad está disponible solo para usuarios premium. <a href="login.html">Inicia sesión</a> o <a href="register.html">crea una cuenta</a> para acceder.';
    
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-info';
    alertDiv.innerHTML = `
        <i class="fas fa-crown"></i>
        <div>
            <strong>Función Premium:</strong> ${message}
        </div>
    `;
    
    // Insertar al inicio del contenido principal
    const main = document.querySelector('.main .container');
    if (main) {
        main.insertBefore(alertDiv, main.firstChild);
    }
}
