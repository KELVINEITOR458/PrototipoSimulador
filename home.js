// JavaScript para la página home

function startDemo() {
    // Redirigir al simulador demo
    window.location.href = 'simulador.html';
}

// Configurar modo demo en localStorage
function setDemoMode() {
    localStorage.setItem('demoMode', 'true');
}

// Verificar si estamos en modo demo
function isDemo() {
    return localStorage.getItem('demoMode') === 'true';
}

// Limpiar modo demo
function clearDemoMode() {
    localStorage.removeItem('demoMode');
}

