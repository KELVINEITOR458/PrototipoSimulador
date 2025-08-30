// Dashboard - Simulador de Negocios

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
});

function initializeDashboard() {
    // Verificar autenticación
    if (!isAuthenticated()) {
        window.location.href = 'index.html';
        return;
    }
    
    // Cargar datos del usuario
    loadUserData();
    
    // Cargar estadísticas
    loadDashboardStats();
    
    // Cargar simulaciones recientes
    loadRecentSimulations();
}

// Cargar datos del usuario
function loadUserData() {
    const user = getCurrentUser();
    if (user) {
        const userNameElements = document.querySelectorAll('#userName, #welcomeUserName');
        userNameElements.forEach(element => {
            element.textContent = user.firstName;
        });
    }
}

// Cargar estadísticas del dashboard
function loadDashboardStats() {
    // Simular carga de datos desde localStorage o servidor
    const simulations = getSimulationsFromStorage();
    
    // Calcular estadísticas
    const totalSimulaciones = simulations.length;
    const simulacionesMes = getSimulationsThisMonth(simulations);
    const mejorPuntuacion = getBestScore(simulations);
    const ultimaSimulacion = getLastSimulationDate(simulations);
    
    // Actualizar UI
    document.getElementById('totalSimulaciones').textContent = totalSimulaciones;
    document.getElementById('simulacionesMes').textContent = simulacionesMes;
    document.getElementById('mejorPuntuacion').textContent = mejorPuntuacion;
    document.getElementById('ultimaSimulacion').textContent = ultimaSimulacion;
}

// Cargar simulaciones recientes
function loadRecentSimulations() {
    const simulations = getSimulationsFromStorage();
    const recentSimulations = simulations.slice(0, 3); // Últimas 3
    
    const container = document.getElementById('recentSimulations');
    if (!container) return;
    
    if (recentSimulations.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-folder-open"></i>
                <h4>No hay simulaciones aún</h4>
                <p>Crea tu primera simulación para comenzar</p>
                <button class="btn btn-primary" onclick="window.location.href='configuracion.html'">
                    <i class="fas fa-plus"></i>
                    Crear Primera Simulación
                </button>
            </div>
        `;
        return;
    }
    
    let html = '';
    recentSimulations.forEach(simulation => {
        html += createSimulationCard(simulation);
    });
    
    container.innerHTML = html;
}

// Crear tarjeta de simulación
function createSimulationCard(simulation) {
    const date = new Date(simulation.createdAt).toLocaleDateString('es-ES');
    const score = simulation.score || 0;
    const scoreClass = score >= 70 ? 'success' : score >= 50 ? 'warning' : 'error';
    
    return `
        <div class="simulation-card" onclick="openSimulation('${simulation.id}')">
            <div class="simulation-header">
                <h4>${simulation.name}</h4>
                <span class="simulation-date">${date}</span>
            </div>
            <div class="simulation-content">
                <p>${simulation.description || 'Sin descripción'}</p>
                <div class="simulation-metrics">
                    <div class="metric">
                        <span class="metric-label">Tipo:</span>
                        <span class="metric-value">${simulation.businessType}</span>
                    </div>
                    <div class="metric">
                        <span class="metric-label">Inversión:</span>
                        <span class="metric-value">$${simulation.totalInvestment?.toFixed(2) || '0'}</span>
                    </div>
                </div>
            </div>
            <div class="simulation-footer">
                <div class="score-badge ${scoreClass}">
                    <i class="fas fa-star"></i>
                    ${score}/100
                </div>
                <div class="simulation-actions">
                    <button class="btn-icon" onclick="event.stopPropagation(); editSimulation('${simulation.id}')" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon" onclick="event.stopPropagation(); duplicateSimulation('${simulation.id}')" title="Duplicar">
                        <i class="fas fa-copy"></i>
                    </button>
                    <button class="btn-icon" onclick="event.stopPropagation(); deleteSimulation('${simulation.id}')" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Obtener simulaciones del almacenamiento
function getSimulationsFromStorage() {
    const simulations = localStorage.getItem('simulations');
    return simulations ? JSON.parse(simulations) : [];
}

// Obtener simulaciones de este mes
function getSimulationsThisMonth(simulations) {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    return simulations.filter(simulation => {
        const simDate = new Date(simulation.createdAt);
        return simDate.getMonth() === currentMonth && simDate.getFullYear() === currentYear;
    }).length;
}

// Obtener mejor puntuación
function getBestScore(simulations) {
    if (simulations.length === 0) return 0;
    
    const scores = simulations.map(s => s.score || 0);
    return Math.max(...scores);
}

// Obtener fecha de última simulación
function getLastSimulationDate(simulations) {
    if (simulations.length === 0) return '-';
    
    const lastSimulation = simulations.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
    )[0];
    
    const date = new Date(lastSimulation.createdAt);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`;
    
    return date.toLocaleDateString('es-ES');
}

// Abrir simulación
function openSimulation(simulationId) {
    // Cargar simulación y redirigir al análisis
    const simulations = getSimulationsFromStorage();
    const simulation = simulations.find(s => s.id === simulationId);
    
    if (simulation) {
        // Guardar simulación actual en sessionStorage
        sessionStorage.setItem('currentSimulation', JSON.stringify(simulation));
        window.location.href = 'analisis.html';
    }
}

// Editar simulación
function editSimulation(simulationId) {
    const simulations = getSimulationsFromStorage();
    const simulation = simulations.find(s => s.id === simulationId);
    
    if (simulation) {
        sessionStorage.setItem('currentSimulation', JSON.stringify(simulation));
        window.location.href = 'configuracion.html?edit=true';
    }
}

// Duplicar simulación
function duplicateSimulation(simulationId) {
    const simulations = getSimulationsFromStorage();
    const simulation = simulations.find(s => s.id === simulationId);
    
    if (simulation) {
        const newSimulation = {
            ...simulation,
            id: 'sim_' + Date.now(),
            name: simulation.name + ' (Copia)',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        simulations.unshift(newSimulation);
        localStorage.setItem('simulations', JSON.stringify(simulations));
        
        // Recargar dashboard
        loadDashboardStats();
        loadRecentSimulations();
        
        showSuccessMessage('Simulación duplicada exitosamente');
    }
}

// Eliminar simulación
function deleteSimulation(simulationId) {
    if (confirm('¿Estás seguro de que quieres eliminar esta simulación? Esta acción no se puede deshacer.')) {
        const simulations = getSimulationsFromStorage();
        const filteredSimulations = simulations.filter(s => s.id !== simulationId);
        
        localStorage.setItem('simulations', JSON.stringify(filteredSimulations));
        
        // Recargar dashboard
        loadDashboardStats();
        loadRecentSimulations();
        
        showSuccessMessage('Simulación eliminada exitosamente');
    }
}

// Mostrar mensaje de éxito
function showSuccessMessage(message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-success dashboard-alert';
    alertDiv.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    
    // Insertar al inicio del contenido principal
    const main = document.querySelector('.main .container');
    if (main) {
        main.insertBefore(alertDiv, main.firstChild);
        
        // Auto-remover después de 3 segundos
        setTimeout(() => {
            alertDiv.remove();
        }, 3000);
    }
}

// Función para guardar simulación (llamada desde otras páginas)
function saveSimulation(simulationData) {
    const simulations = getSimulationsFromStorage();
    
    // Si es una edición, actualizar la simulación existente
    const existingIndex = simulations.findIndex(s => s.id === simulationData.id);
    
    if (existingIndex !== -1) {
        simulations[existingIndex] = {
            ...simulations[existingIndex],
            ...simulationData,
            updatedAt: new Date().toISOString()
        };
    } else {
        // Nueva simulación
        const newSimulation = {
            ...simulationData,
            id: 'sim_' + Date.now(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        simulations.unshift(newSimulation);
    }
    
    localStorage.setItem('simulations', JSON.stringify(simulations));
}

// Función para obtener simulación actual (llamada desde otras páginas)
function getCurrentSimulation() {
    const simulationData = sessionStorage.getItem('currentSimulation');
    return simulationData ? JSON.parse(simulationData) : null;
}

// Función para limpiar simulación actual (llamada desde otras páginas)
function clearCurrentSimulation() {
    sessionStorage.removeItem('currentSimulation');
}
