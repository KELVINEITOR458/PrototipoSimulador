// Simulador de Negocios - JavaScript

// Variables globales
let currentStep = 1;
let businessData = {
    configuracion: {},
    inversion: {},
    costosFijos: {},
    costosVariables: {},
    precios: {},
    proyecciones: {}
};

// Sistema de persistencia de datos
const STORAGE_KEY = 'businessData';
const STEP_SUMMARY_KEY = 'stepSummaries';

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    // Limpiar storage solo en recarga completa
    setupStorageCleanup();
    initializeApp();
});

// Sistema de persistencia de datos
function saveToStorage() {
    try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(businessData));
        console.log('Datos guardados en sessionStorage:', businessData);
    } catch (error) {
        console.error('Error al guardar datos:', error);
    }
}

function loadFromStorage() {
    try {
        const savedData = sessionStorage.getItem(STORAGE_KEY);
        if (savedData) {
            const savedBusinessData = JSON.parse(savedData);
            businessData = { ...businessData, ...savedBusinessData };
            console.log('Datos cargados desde sessionStorage:', businessData);
            return true;
        }
    } catch (error) {
        console.error('Error al cargar datos:', error);
    }
    return false;
}

function clearStorage() {
    sessionStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(STEP_SUMMARY_KEY);
    businessData = {
        configuracion: {},
        inversion: {},
        costosFijos: {},
        costosVariables: {},
        precios: {},
        proyecciones: {}
    };
}

// Cargar datos guardados (mantener compatibilidad)
function loadSavedData() {
    return loadFromStorage();
}

function initializeApp() {
    // Cargar datos guardados
    loadSavedData();
    
    // Cargar datos en formularios
    populateFormData();
    
    // Generar resúmenes de pasos anteriores
    generateStepSummaries();
    
    // Configurar eventos para selección de tipo de negocio
    setupBusinessTypeSelection();
    
    // Configurar eventos para selección de tamaño
    setupSizeSelection();
    
    // Configurar eventos para cálculos automáticos
    setupAutoCalculations();
    
    // Configurar validaciones de formularios
    setupFormValidations();
    
    // Configurar eventos para costos variables
    setupVariableCostsEvents();
    
    // Configurar eventos para precios
    setupPricingEvents();
    
    // Configurar eventos para análisis final
    setupAnalysisEvents();
    
    // Configurar eventos de navegación
    setupNavigationEvents();
    
    // Configurar eventos de guardado automático
    setupAutoSave();
}

// Poblar formularios con datos guardados
function populateFormData() {
    console.log('Poblando formularios con datos:', businessData);
    
    // Poblar inversión
    if (businessData.inversion.gastos) {
        Object.keys(businessData.inversion.gastos).forEach(key => {
            const input = document.querySelector(`[data-category="${key}"].expense-input`);
            if (input) {
                input.value = businessData.inversion.gastos[key];
            }
        });
        calculateTotalExpenses();
    }
    
    // Poblar costos fijos
    if (businessData.costosFijos.gastos) {
        Object.keys(businessData.costosFijos.gastos).forEach(key => {
            const input = document.querySelector(`[data-category="${key}"].fixed-cost-input`);
            if (input) {
                input.value = businessData.costosFijos.gastos[key];
            }
        });
        calculateTotalFixedCosts();
    }
    
    // Poblar staff
    if (businessData.costosFijos.staff) {
        Object.keys(businessData.costosFijos.staff).forEach(key => {
            const input = document.querySelector(`[data-role="${key}"].staff-input`);
            if (input) {
                input.value = businessData.costosFijos.staff[key];
            }
        });
        calculateStaffCosts();
    }
    
    // Poblar servicios
    if (businessData.costosFijos.servicios) {
        Object.keys(businessData.costosFijos.servicios).forEach(key => {
            const input = document.querySelector(`[data-service="${key}"].service-input`);
            if (input) {
                input.value = businessData.costosFijos.servicios[key];
            }
        });
        calculateTotalServices();
    }
    
    // Poblar selects de configuración
    if (businessData.configuracion.tipoNegocio) {
        const businessOption = document.querySelector(`[data-type="${businessData.configuracion.tipoNegocio}"]`);
        if (businessOption) {
            document.querySelectorAll('.business-option').forEach(opt => opt.classList.remove('selected'));
            businessOption.classList.add('selected');
        }
    }
    
    if (businessData.configuracion.categoriaTamaño) {
        const sizeOption = document.querySelector(`[data-size="${businessData.configuracion.categoriaTamaño}"]`);
        if (sizeOption) {
            document.querySelectorAll('.size-option').forEach(opt => opt.classList.remove('selected'));
            sizeOption.classList.add('selected');
        }
    }
    
    // Poblar otros selects
    if (businessData.costosFijos.serviciosArriendo) {
        const serviciosArriendoSelect = document.getElementById('serviciosArriendo');
        if (serviciosArriendoSelect) {
            serviciosArriendoSelect.value = businessData.costosFijos.serviciosArriendo;
        }
    }
    
    // Poblar productos (costos variables)
    if (businessData.costosVariables.productos && businessData.costosVariables.productos.length > 0) {
        generateProductCards();
    }
    
    // Poblar precios
    if (businessData.precios.productos) {
        Object.keys(businessData.precios.productos).forEach(productId => {
            const priceInput = document.querySelector(`[data-product="${productId}"].price-input`);
            if (priceInput) {
                priceInput.value = businessData.precios.productos[productId];
            }
        });
    }
}

// Generar resúmenes de pasos anteriores
function generateStepSummaries() {
    const currentPage = getCurrentPage();
    const summaries = [];
    
    // Resumen de configuración (paso 1)
    if (businessData.configuracion.tipoNegocio) {
        summaries.push({
            step: 1,
            title: 'Configuración del Negocio',
            data: {
                tipo: businessData.configuracion.tipoNegocio,
                tamaño: businessData.configuracion.categoriaTamaño || 'No especificado'
            }
        });
    }
    
    // Resumen de inversión (paso 2)
    if (businessData.inversion.totalGastos && businessData.inversion.totalGastos > 0) {
        summaries.push({
            step: 2,
            title: 'Inversión Inicial',
            data: {
                total: businessData.inversion.totalGastos
            }
        });
    }
    
    // Resumen de costos fijos (paso 3)
    if (businessData.costosFijos.total && businessData.costosFijos.total > 0) {
        summaries.push({
            step: 3,
            title: 'Costos Fijos Mensuales',
            data: {
                total: businessData.costosFijos.total
            }
        });
    }
    
    // Resumen de costos variables (paso 4)
    if (businessData.costosVariables.productos && businessData.costosVariables.productos.length > 0) {
        summaries.push({
            step: 4,
            title: 'Productos/Servicios',
            data: {
                cantidad: businessData.costosVariables.productos.length,
                totalCosto: businessData.costosVariables.totalCosto || 0
            }
        });
    }
    
    // Resumen de precios (paso 5)
    if (businessData.precios.productos && Object.keys(businessData.precios.productos).length > 0) {
        summaries.push({
            step: 5,
            title: 'Precios de Venta',
            data: {
                productos: Object.keys(businessData.precios.productos).length
            }
        });
    }
    
    // Mostrar resúmenes en la página actual
    displayStepSummaries(summaries, currentPage);
}

// Mostrar resúmenes en la página
function displayStepSummaries(summaries, currentPage) {
    const summaryContainer = document.querySelector('.step-summaries');
    if (!summaryContainer || summaries.length === 0) return;
    
    let html = '<div class="summaries-header"><h4>Resumen de Pasos Completados</h4></div>';
    
    summaries.forEach(summary => {
        if (summary.step < currentPage) {
            html += createSummaryCard(summary);
        }
    });
    
    summaryContainer.innerHTML = html;
}

// Crear tarjeta de resumen
function createSummaryCard(summary) {
    let details = '';
    
    switch (summary.step) {
        case 1:
            details = `
                <div class="summary-detail">
                    <span class="detail-label">Tipo:</span>
                    <span class="detail-value">${summary.data.tipo}</span>
                </div>
                <div class="summary-detail">
                    <span class="detail-label">Tamaño:</span>
                    <span class="detail-value">${summary.data.tamaño}</span>
                </div>
            `;
            break;
        case 2:
            details = `
                <div class="summary-detail">
                    <span class="detail-label">Inversión Total:</span>
                    <span class="detail-value">$${summary.data.total.toFixed(2)}</span>
                </div>
            `;
            break;
        case 3:
            details = `
                <div class="summary-detail">
                    <span class="detail-label">Costos Fijos:</span>
                    <span class="detail-value">$${summary.data.total.toFixed(2)}/mes</span>
                </div>
            `;
            break;
        case 4:
            details = `
                <div class="summary-detail">
                    <span class="detail-label">Productos:</span>
                    <span class="detail-value">${summary.data.cantidad}</span>
                </div>
                <div class="summary-detail">
                    <span class="detail-label">Costo Total:</span>
                    <span class="detail-value">$${summary.data.totalCosto.toFixed(2)}</span>
                </div>
            `;
            break;
        case 5:
            details = `
                <div class="summary-detail">
                    <span class="detail-label">Productos con Precio:</span>
                    <span class="detail-value">${summary.data.productos}</span>
                </div>
            `;
            break;
    }
    
    return `
        <div class="summary-card step-${summary.step}">
            <div class="summary-header">
                <span class="step-number">${summary.step}</span>
                <h5>${summary.title}</h5>
            </div>
            <div class="summary-content">
                ${details}
            </div>
        </div>
    `;
}

// Obtener página actual
function getCurrentPage() {
    const path = window.location.pathname;
    if (path.includes('configuracion.html')) return 1;
    if (path.includes('inversion.html')) return 2;
    if (path.includes('costos-fijos.html')) return 3;
    if (path.includes('costos-variables.html')) return 4;
    if (path.includes('precios.html')) return 5;
    if (path.includes('analisis.html')) return 6;
    return 1;
}

// Selección de tipo de negocio
function setupBusinessTypeSelection() {
    const businessOptions = document.querySelectorAll('.business-option');
    businessOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remover selección previa
            businessOptions.forEach(opt => opt.classList.remove('selected'));
            // Seleccionar actual
            this.classList.add('selected');
            
            // Guardar selección
            const businessType = this.dataset.type;
            businessData.configuracion.tipoNegocio = businessType;
            
            // Guardar automáticamente
            saveToStorage();
        });
    });
}

// Selección de categoría de tamaño
function setupSizeSelection() {
    const sizeOptions = document.querySelectorAll('.size-option');
    sizeOptions.forEach(option => {
        option.addEventListener('click', function() {
            sizeOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            
            const size = this.dataset.size;
            businessData.configuracion.categoriaTamaño = size;
            
            // Guardar automáticamente
            saveToStorage();
        });
    });
}

// Configurar guardado automático
function setupAutoSave() {
    // Guardar en cambios de inputs
    document.addEventListener('input', function(e) {
        if (e.target.matches('input[type="number"], input[type="text"], textarea, select')) {
            // Debounce para no guardar en cada tecla
            clearTimeout(window.autoSaveTimeout);
            window.autoSaveTimeout = setTimeout(() => {
                updateBusinessDataFromForm();
                saveToStorage();
            }, 500);
        }
    });
    
    // Guardar cuando se pierde el foco de un input
    document.addEventListener('blur', function(e) {
        if (e.target.matches('input[type="number"], input[type="text"], textarea, select')) {
            updateBusinessDataFromForm();
            saveToStorage();
        }
    }, true);
    
    // Guardar cuando se cambia un select
    document.addEventListener('change', function(e) {
        if (e.target.matches('select')) {
            updateBusinessDataFromForm();
            saveToStorage();
        }
    });
    
    // Guardar antes de cerrar la página
    window.addEventListener('beforeunload', function() {
        updateBusinessDataFromForm();
        saveToStorage();
    });
}

// Actualizar businessData desde formularios
function updateBusinessDataFromForm() {
    // Actualizar inversión
    const expenseInputs = document.querySelectorAll('.expense-input');
    if (expenseInputs.length > 0) {
        if (!businessData.inversion.gastos) businessData.inversion.gastos = {};
        expenseInputs.forEach(input => {
            const key = input.dataset.category;
            if (key) {
                businessData.inversion.gastos[key] = parseFloat(input.value) || 0;
            }
        });
    }
    
    // Actualizar costos fijos
    const fixedCostInputs = document.querySelectorAll('.fixed-cost-input');
    if (fixedCostInputs.length > 0) {
        if (!businessData.costosFijos.gastos) businessData.costosFijos.gastos = {};
        fixedCostInputs.forEach(input => {
            const key = input.dataset.category;
            if (key) {
                businessData.costosFijos.gastos[key] = parseFloat(input.value) || 0;
            }
        });
    }
    
    // Actualizar staff inputs
    const staffInputs = document.querySelectorAll('.staff-input');
    if (staffInputs.length > 0) {
        if (!businessData.costosFijos.staff) businessData.costosFijos.staff = {};
        staffInputs.forEach(input => {
            const key = input.dataset.role;
            if (key) {
                businessData.costosFijos.staff[key] = parseFloat(input.value) || 0;
            }
        });
    }
    
    // Actualizar service inputs
    const serviceInputs = document.querySelectorAll('.service-input');
    if (serviceInputs.length > 0) {
        if (!businessData.costosFijos.servicios) businessData.costosFijos.servicios = {};
        serviceInputs.forEach(input => {
            const key = input.dataset.service;
            if (key) {
                businessData.costosFijos.servicios[key] = parseFloat(input.value) || 0;
            }
        });
    }
    
    // Actualizar precios
    const priceInputs = document.querySelectorAll('.price-input');
    if (priceInputs.length > 0) {
        if (!businessData.precios.productos) businessData.precios.productos = {};
        priceInputs.forEach(input => {
            const productId = input.dataset.product;
            if (productId) {
                businessData.precios.productos[productId] = parseFloat(input.value) || 0;
            }
        });
    }
    
    // Actualizar selects de configuración
    const businessTypeSelect = document.querySelector('.business-option.selected');
    if (businessTypeSelect) {
        businessData.configuracion.tipoNegocio = businessTypeSelect.dataset.type;
    }
    
    const sizeSelect = document.querySelector('.size-option.selected');
    if (sizeSelect) {
        businessData.configuracion.categoriaTamaño = sizeSelect.dataset.size;
    }
    
    // Actualizar otros selects importantes
    const serviciosArriendoSelect = document.getElementById('serviciosArriendo');
    if (serviciosArriendoSelect) {
        businessData.costosFijos.serviciosArriendo = serviciosArriendoSelect.value;
    }
}

// Cálculos automáticos
function setupAutoCalculations() {
    // Cálculos de inversión inicial
    const expenseInputs = document.querySelectorAll('.expense-input');
    expenseInputs.forEach(input => {
        input.addEventListener('input', calculateTotalExpenses);
    });
    
    const fundingInputs = document.querySelectorAll('.funding-input');
    fundingInputs.forEach(input => {
        input.addEventListener('input', calculateTotalFunding);
    });
    
    // Cálculos de costos fijos
    const staffInputs = document.querySelectorAll('.staff-input');
    staffInputs.forEach(input => {
        input.addEventListener('input', calculateStaffCosts);
    });
    
    const serviceInputs = document.querySelectorAll('.service-input');
    serviceInputs.forEach(input => {
        input.addEventListener('input', calculateTotalServices);
    });
}

// Cálculo de gastos totales
function calculateTotalExpenses() {
    let total = 0;
    const expenseInputs = document.querySelectorAll('.expense-input');
    
    expenseInputs.forEach(input => {
        const value = parseFloat(input.value) || 0;
        total += value;
    });
    
    document.getElementById('totalGastos').textContent = `$${total.toFixed(2)}`;
    businessData.inversion.totalGastos = total;
    
    calculateInvestmentSummary();
    
    // Guardar automáticamente
    saveToStorage();
}

// Cálculo de financiamiento total
function calculateTotalFunding() {
    let total = 0;
    const fundingInputs = document.querySelectorAll('.funding-input');
    
    fundingInputs.forEach(input => {
        const value = parseFloat(input.value) || 0;
        total += value;
    });
    
    document.getElementById('totalFinanciamiento').textContent = `$${total.toFixed(2)}`;
    businessData.inversion.totalFinanciamiento = total;
    
    calculateInvestmentSummary();
}

// Cálculo del resumen de inversión
function calculateInvestmentSummary() {
    const totalGastos = businessData.inversion.totalGastos || 0;
    const totalFinanciamiento = businessData.inversion.totalFinanciamiento || 0;
    
    document.getElementById('totalInversion').textContent = `$${totalGastos.toFixed(2)}`;
    document.getElementById('resumenCapital').textContent = `$${(totalFinanciamiento * 0.6).toFixed(2)}`;
    document.getElementById('resumenPrestamos').textContent = `$${(totalFinanciamiento * 0.4).toFixed(2)}`;
    
    const diferencia = totalFinanciamiento - totalGastos;
    document.getElementById('diferencia').textContent = `$${diferencia.toFixed(2)}`;
    
    // Calcular cuota mensual si hay préstamos
    const prestamos = totalFinanciamiento * 0.4;
    const tasaInteres = parseFloat(document.getElementById('tasaInteres')?.value) || 15;
    const plazo = parseFloat(document.getElementById('plazoPrestamo')?.value) || 24;
    
    if (prestamos > 0 && tasaInteres > 0 && plazo > 0) {
        const cuotaMensual = calculateMonthlyPayment(prestamos, tasaInteres, plazo);
        document.getElementById('cuotaMensual').textContent = `$${cuotaMensual.toFixed(2)}`;
    }
}

// Cálculo de cuota mensual
function calculateMonthlyPayment(principal, annualRate, months) {
    const monthlyRate = annualRate / 100 / 12;
    if (monthlyRate === 0) return principal / months;
    
    return principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / 
           (Math.pow(1 + monthlyRate, months) - 1);
}

// Cálculo de costos de personal
function calculateStaffCosts() {
    let totalBase = 0;
    const staffInputs = document.querySelectorAll('.staff-input');
    
    staffInputs.forEach(input => {
        const value = parseFloat(input.value) || 0;
        totalBase += value;
    });
    
    // Calcular costo real (incluye IESS, décimos, vacaciones, fondos de reserva)
    const costoReal = totalBase * 1.38; // 38% adicional por cargas sociales
    
    document.getElementById('totalSalariosBase').textContent = `$${totalBase.toFixed(2)}`;
    document.getElementById('totalSalariosReal').textContent = `$${costoReal.toFixed(2)}`;
    
    businessData.costosFijos.totalSalarios = costoReal;
    calculateTotalFixedCosts();
}

// Cálculo de servicios totales
function calculateTotalServices() {
    let total = 0;
    const serviceInputs = document.querySelectorAll('.service-input');
    
    serviceInputs.forEach(input => {
        const value = parseFloat(input.value) || 0;
        total += value;
    });
    
    businessData.costosFijos.totalServicios = total;
    calculateTotalFixedCosts();
}

// Cálculo de costos fijos totales
function calculateTotalFixedCosts() {
    const arriendo = parseFloat(document.getElementById('arriendo')?.value) || 0;
    const salarios = businessData.costosFijos.totalSalarios || 0;
    const servicios = businessData.costosFijos.totalServicios || 0;
    
    // Calcular otros costos
    let otrosCostos = 0;
    const otherCostInputs = document.querySelectorAll('.other-cost-input');
    otherCostInputs.forEach(input => {
        otrosCostos += parseFloat(input.value) || 0;
    });
    
    const total = arriendo + salarios + servicios + otrosCostos;
    
    // Actualizar resumen
    document.getElementById('resumenArriendo').textContent = `$${arriendo.toFixed(2)}`;
    document.getElementById('resumenPersonal').textContent = `$${salarios.toFixed(2)}`;
    document.getElementById('resumenServicios').textContent = `$${servicios.toFixed(2)}`;
    document.getElementById('resumenOtros').textContent = `$${otrosCostos.toFixed(2)}`;
    document.getElementById('totalCostosFijos').textContent = `$${total.toFixed(2)}`;
    
    businessData.costosFijos.total = total;
    
    // Guardar automáticamente
    saveToStorage();
}

// Validaciones de formularios
function setupFormValidations() {
    // Validación de configuración
    const configForm = document.getElementById('configForm');
    if (configForm) {
        configForm.addEventListener('submit', validateConfiguration);
    }
    
    // Validación de inversión
    const inversionForm = document.getElementById('inversionForm');
    if (inversionForm) {
        inversionForm.addEventListener('submit', validateInvestment);
    }
    
    // Validación de costos fijos
    const costosFijosForm = document.getElementById('costosFijosForm');
    if (costosFijosForm) {
        costosFijosForm.addEventListener('submit', validateFixedCosts);
    }
    
    // Validación de costos variables
    const costosVariablesForm = document.getElementById('costosVariablesForm');
    if (costosVariablesForm) {
        costosVariablesForm.addEventListener('submit', validateVariableCosts);
    }
    
    // Validación de precios
    const preciosForm = document.getElementById('preciosForm');
    if (preciosForm) {
        preciosForm.addEventListener('submit', validatePricing);
    }
    
    // Validación de análisis
    const analisisForm = document.getElementById('analisisForm');
    if (analisisForm) {
        analisisForm.addEventListener('submit', validateAnalysis);
    }
}

// Configuración de eventos para costos variables
function setupVariableCostsEvents() {
    // Inicializar cálculos si estamos en la página de costos variables
    if (window.location.pathname.includes('costos-variables.html')) {
        setTimeout(() => {
            calculateIngredientCosts();
            calculateLaborCosts();
            updateProductSummary();
        }, 500);
    }
    
    // Eventos para ingredientes
    document.addEventListener('input', function(e) {
        if (e.target.classList.contains('ingredient-quantity') || 
            e.target.classList.contains('ingredient-price')) {
            calculateIngredientCosts();
        }
    });
    
    // Eventos para mano de obra
    document.addEventListener('input', function(e) {
        if (e.target.classList.contains('labor-time') || 
            e.target.classList.contains('labor-role')) {
            calculateLaborCosts();
        }
    });
    
    // Eventos para nombres de productos
    document.addEventListener('input', function(e) {
        if (e.target.classList.contains('product-name')) {
            updateProductSummary();
        }
    });
}

// Configuración de eventos para precios
function setupPricingEvents() {
    // Generar campos de precio dinámicamente
    generatePricingFields();
    
    // Inicializar análisis si estamos en la página de precios
    if (window.location.pathname.includes('precios.html')) {
        setTimeout(() => {
            calculatePricingAnalysis();
        }, 1000);
    }
    
    document.addEventListener('input', function(e) {
        if (e.target.classList.contains('price-input')) {
            calculatePricingAnalysis();
            savePricingData();
        }
    });
}

// Generar campos de precio
function generatePricingFields() {
    const pricingContainer = document.getElementById('pricingContainer');
    if (!pricingContainer) return;
    
    // Cargar datos guardados si no están en el DOM
    if (!businessData.costosVariables.productos || businessData.costosVariables.productos.length === 0) {
        const savedData = sessionStorage.getItem('businessData');
        if (savedData) {
            const savedBusinessData = JSON.parse(savedData);
            if (savedBusinessData.costosVariables && savedBusinessData.costosVariables.productos) {
                businessData.costosVariables.productos = savedBusinessData.costosVariables.productos;
            }
        }
    }
    
    // Usar productos del DOM si están disponibles, sino usar datos guardados
    let products = [];
    const domProducts = document.querySelectorAll('.product-card');
    
    if (domProducts.length > 0) {
        // Si hay productos en el DOM, usarlos
        domProducts.forEach(product => {
            const productId = product.id.replace('producto', '');
            const productName = product.querySelector('.product-name').value || `Producto ${productId}`;
            const productCost = document.getElementById(`costoTotal${productId}`)?.textContent || '$0';
            
            products.push({
                id: productId,
                name: productName,
                cost: productCost
            });
        });
    } else if (businessData.costosVariables.productos && businessData.costosVariables.productos.length > 0) {
        // Si no hay productos en el DOM, usar datos guardados
        products = businessData.costosVariables.productos.map(product => ({
            id: product.id,
            name: product.name,
            cost: `$${product.cost.toFixed(2)}`,
            type: product.type || 'comida'
        }));
    }
    
    let pricingHTML = '';
    
    products.forEach(product => {
        // Buscar precio guardado para este producto
        let savedPrice = '';
        if (businessData.precios && businessData.precios.productos) {
            const savedProduct = businessData.precios.productos.find(p => p.id === product.id);
            if (savedProduct) {
                savedPrice = savedProduct.price;
            }
        }
        
        // Calcular precio recomendado
        const productCost = parseFloat(product.cost.replace('$', '')) || 0;
        const recommendedPrice = calculateRecommendedPrice(productCost, product.type);
        
        pricingHTML += `
            <div class="pricing-item">
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">${product.name}</label>
                        <div class="form-help">Costo: ${product.cost}</div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Precio de Venta</label>
                        <input type="number" class="form-input price-input" data-product="${product.id}" placeholder="0" min="0" step="0.01" value="${savedPrice}">
                        <div class="form-help">Precio que cobrarás al cliente</div>
                        <div class="price-recommendation">
                            <i class="fas fa-lightbulb"></i>
                            <strong>Precio recomendado:</strong> $${recommendedPrice.toFixed(2)}
                            <button type="button" class="btn-apply-recommendation" onclick="applyRecommendedPrice('${product.id}', ${recommendedPrice})">
                                <i class="fas fa-check"></i> Aplicar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    pricingContainer.innerHTML = pricingHTML;
}

// Configuración de eventos para análisis final
function setupAnalysisEvents() {
    // Ejecutar análisis cuando se carga la página
    if (window.location.pathname.includes('analisis.html')) {
        setTimeout(() => {
            generateProjections();
            calculateBreakEven();
            calculateCashFlow();
            calculateViabilityScore();
        }, 1000);
    }
    
    // Generar alertas de IA
    setTimeout(() => {
        generateIAAlerts();
    }, 500);
}

// Generar proyecciones de ventas
function generateProjections() {
    const projectionsContainer = document.getElementById('projectionsContainer');
    if (!projectionsContainer) return;
    
    // Verificar si hay productos guardados
    if (!businessData.costosVariables.productos || businessData.costosVariables.productos.length === 0) {
        projectionsContainer.innerHTML = '<p class="alert alert-warning">No hay productos configurados para generar proyecciones.</p>';
        return;
    }
    
    let projectionsHTML = '';
    
    businessData.costosVariables.productos.forEach(product => {
        projectionsHTML += `
            <div class="projection-item">
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">${product.name}</label>
                        <div class="form-help">Proyección mensual de ventas</div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Unidades por Mes</label>
                        <input type="number" class="form-input projection-input" data-product="${product.id}" placeholder="50" min="0" value="50">
                        <div class="form-help">Cantidad que esperas vender mensualmente</div>
                    </div>
                </div>
            </div>
        `;
    });
    
    projectionsContainer.innerHTML = projectionsHTML;
}

// Validación de configuración
function validateConfiguration(e) {
    e.preventDefault();
    
    const businessType = document.querySelector('.business-option.selected');
    const location = document.getElementById('location').value;
    const size = document.getElementById('size').value;
    const capacity = document.getElementById('capacity').value;
    
    let isValid = true;
    
    // Validar tipo de negocio
    if (!businessType) {
        showError('businessTypeError');
        isValid = false;
    } else {
        hideError('businessTypeError');
    }
    
    // Validar ubicación
    if (!location.trim()) {
        showError('locationError');
        isValid = false;
    } else {
        hideError('locationError');
    }
    
    // Validar tamaño
    if (!size || size < 10 || size > 1000) {
        showError('sizeError');
        isValid = false;
    } else {
        hideError('sizeError');
    }
    
    // Validar capacidad
    if (!capacity || capacity < 5 || capacity > 200) {
        showError('capacityError');
        isValid = false;
    } else {
        hideError('capacityError');
    }
    
    if (isValid) {
        // Guardar datos
        businessData.configuracion = {
            tipoNegocio: businessType.dataset.type,
            ubicacion: location,
            tamaño: parseFloat(size),
            capacidad: parseFloat(capacity),
            nombreNegocio: document.getElementById('businessName').value,
            descripcion: document.getElementById('description').value
        };
        
        // Navegar al siguiente paso
        window.location.href = 'inversion.html';
    }
}

// Validación de inversión
function validateInvestment(e) {
    e.preventDefault();
    
    const totalGastos = businessData.inversion.totalGastos || 0;
    const totalFinanciamiento = businessData.inversion.totalFinanciamiento || 0;
    
    if (totalGastos === 0) {
        alert('Por favor ingresa al menos un gasto de montaje.');
        return;
    }
    
    if (totalFinanciamiento === 0) {
        alert('Por favor ingresa al menos una fuente de financiamiento.');
        return;
    }
    
    // Guardar datos y navegar
    window.location.href = 'costos-fijos.html';
}

// Validación de costos fijos
function validateFixedCosts(e) {
    e.preventDefault();
    
    const arriendo = parseFloat(document.getElementById('arriendo')?.value) || 0;
    
    if (arriendo === 0) {
        alert('Por favor ingresa el monto del arriendo.');
        return;
    }
    
    // Guardar datos y navegar
    window.location.href = 'costos-variables.html';
}

// Validación de costos variables
function validateVariableCosts(e) {
    e.preventDefault();
    
    const products = document.querySelectorAll('.product-card');
    let hasValidProduct = false;
    
    products.forEach(product => {
        const productName = product.querySelector('.product-name').value;
        if (productName.trim()) {
            hasValidProduct = true;
        }
    });
    
    if (!hasValidProduct) {
        alert('Por favor ingresa al menos un producto con su nombre.');
        return;
    }
    
    // Guardar datos y navegar
    window.location.href = 'precios.html';
}

// Validación de precios
function validatePricing(e) {
    e.preventDefault();
    
    // Buscar campos de precio en la página de precios
    const priceInputs = document.querySelectorAll('.price-input');
    let hasValidPrice = false;
    
    priceInputs.forEach(input => {
        const price = parseFloat(input.value) || 0;
        if (price > 0) {
            hasValidPrice = true;
        }
    });
    
    if (!hasValidPrice) {
        alert('Por favor ingresa al menos un precio de venta.');
        return;
    }
    
    // Guardar datos antes de navegar
    savePricingData();
    
    // Guardar datos y navegar
    window.location.href = 'analisis.html';
}

// Validación de análisis
function validateAnalysis(e) {
    e.preventDefault();
    
    // El análisis se ejecuta automáticamente
    // Esta función puede usarse para validaciones adicionales si es necesario
    return true;
}

// Funciones de utilidad
function showError(errorId) {
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
        errorElement.style.display = 'block';
    }
}

function hideError(errorId) {
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
        errorElement.style.display = 'none';
    }
}

function generateIAAlerts() {
    const alertsContainer = document.getElementById('iaAlerts');
    if (!alertsContainer) return;
    
    let alertsHTML = '';
    
    // Alertas específicas según la página
    const currentPage = window.location.pathname;
    
    if (currentPage.includes('inversion.html')) {
        const totalGastos = businessData.inversion.totalGastos || 0;
        const totalFinanciamiento = businessData.inversion.totalFinanciamiento || 0;
        
        if (totalFinanciamiento < totalGastos) {
            alertsHTML += `
                <div class="alert alert-warning">
                    <i class="fas fa-exclamation-triangle"></i>
                    <div>
                        <strong>Déficit de financiamiento:</strong> 
                        Necesitas $${(totalGastos - totalFinanciamiento).toFixed(2)} adicionales para cubrir todos los gastos de montaje.
                    </div>
                </div>
            `;
        }
        
        if (totalGastos > 50000) {
            alertsHTML += `
                <div class="alert alert-info">
                    <i class="fas fa-info-circle"></i>
                    <div>
                        <strong>Inversión alta:</strong> 
                        Tu inversión inicial es considerable. Asegúrate de tener un plan de recuperación claro.
                    </div>
                </div>
            `;
        }
    }
    
    if (currentPage.includes('costos-fijos.html')) {
        const totalFixedCosts = businessData.costosFijos.total || 0;
        
        if (totalFixedCosts > 8000) {
            alertsHTML += `
                <div class="alert alert-warning">
                    <i class="fas fa-exclamation-triangle"></i>
                    <div>
                        <strong>Costos fijos altos:</strong> 
                        Tus costos fijos mensuales son elevados. Considera optimizar gastos para mejorar la rentabilidad.
                    </div>
                </div>
            `;
        }
    }
    
    if (currentPage.includes('costos-variables.html')) {
        const averageCost = parseFloat(document.getElementById('costoPromedio')?.textContent.replace('$', '')) || 0;
        
        if (averageCost > 15) {
            alertsHTML += `
                <div class="alert alert-warning">
                    <i class="fas fa-exclamation-triangle"></i>
                    <div>
                        <strong>Costo por producto alto:</strong> 
                        El costo promedio por producto es elevado. Revisa si puedes optimizar ingredientes o procesos.
                    </div>
                </div>
            `;
        }
    }
    
    alertsContainer.innerHTML = alertsHTML;
}

// Funciones para productos (costos variables)
function addProduct() {
    const productsContainer = document.querySelector('.products-container');
    const addButton = document.getElementById('addProductBtn');
    const productCount = document.querySelectorAll('.product-card').length;
    
    if (productCount >= 3) {
        alert('Máximo 3 productos principales.');
        return;
    }
    
    const newProductId = productCount + 1;
    const productHtml = createProductHTML(newProductId);
    
    // Insertar antes del botón de agregar
    addButton.insertAdjacentHTML('beforebegin', productHtml);
    
    // Si llegamos a 3 productos, ocultar el botón
    if (newProductId >= 3) {
        addButton.style.display = 'none';
    }
}

function removeProduct(productId) {
    const productCard = document.getElementById(`producto${productId}`);
    if (productCard) {
        productCard.remove();
        
        // Mostrar botón de agregar si hay menos de 3 productos
        const addButton = document.getElementById('addProductBtn');
        const remainingProducts = document.querySelectorAll('.product-card').length;
        if (remainingProducts < 3) {
            addButton.style.display = 'block';
        }
    }
}

function createProductHTML(productId) {
    return `
        <div class="product-card" id="producto${productId}">
            <div class="product-header">
                <h4><i class="fas fa-hamburger"></i> Producto ${productId}</h4>
                <button type="button" class="btn-remove" onclick="removeProduct(${productId})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">Nombre del Producto</label>
                    <input type="text" class="form-input product-name" placeholder="Ej: Hamburguesa Clásica" data-product="${productId}">
                </div>
                <div class="form-group">
                    <label class="form-label">Tipo</label>
                    <select class="form-select product-type" data-product="${productId}">
                        <option value="comida">Comida</option>
                        <option value="bebida">Bebida</option>
                        <option value="reventa">Reventa</option>
                    </select>
                </div>
            </div>

            <div class="ingredients-section">
                <h5><i class="fas fa-list"></i> Ingredientes</h5>
                <div class="ingredients-list" id="ingredients${productId}">
                    <div class="ingredient-item">
                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label">Ingrediente</label>
                                <input type="text" class="form-input ingredient-name" placeholder="Ej: Carne de res" data-product="${productId}" data-ingredient="1">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Cantidad</label>
                                <input type="number" class="form-input ingredient-quantity" placeholder="100" data-product="${productId}" data-ingredient="1" step="0.1">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Unidad</label>
                                <select class="form-select ingredient-unit" data-product="${productId}" data-ingredient="1">
                                    <option value="g">Gramos (g)</option>
                                    <option value="kg">Kilogramos (kg)</option>
                                    <option value="ml">Mililitros (ml)</option>
                                    <option value="l">Litros (l)</option>
                                    <option value="unidad">Unidad</option>
                                    <option value="hoja">Hoja</option>
                                    <option value="rebanada">Rebanada</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Precio de Compra</label>
                                <input type="number" class="form-input ingredient-price" placeholder="0" data-product="${productId}" data-ingredient="1" step="0.01">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Unidad de Compra</label>
                                <input type="text" class="form-input ingredient-purchase-unit" placeholder="Ej: kg, caja, unidad" data-product="${productId}" data-ingredient="1">
                            </div>
                        </div>
                        <button type="button" class="btn-remove-ingredient" onclick="removeIngredient(${productId}, 1)">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
                <button type="button" class="btn btn-secondary btn-sm" onclick="addIngredient(${productId})">
                    <i class="fas fa-plus"></i> Agregar Ingrediente
                </button>
            </div>

            <div class="labor-section">
                <h5><i class="fas fa-clock"></i> Mano de Obra</h5>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Tiempo de Preparación (minutos)</label>
                        <input type="number" class="form-input labor-time" placeholder="10" data-product="${productId}" min="0" step="0.5">
                        <div class="form-help">Tiempo promedio para preparar este producto</div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Rol Responsable</label>
                        <select class="form-select labor-role" data-product="${productId}">
                            <option value="cocinero">Cocinero</option>
                            <option value="mesero">Mesero</option>
                            <option value="caja">Caja</option>
                            <option value="limpieza">Limpieza</option>
                        </select>
                        <div class="form-help">Quién prepara este producto</div>
                    </div>
                </div>
            </div>

            <div class="product-summary">
                <div class="summary-item">
                    <span>Costo de Ingredientes:</span>
                    <span class="summary-amount" id="costoIngredientes${productId}">$0</span>
                </div>
                <div class="summary-item">
                    <span>Costo de Mano de Obra:</span>
                    <span class="summary-amount" id="costoManoObra${productId}">$0</span>
                </div>
                <div class="summary-item total-product">
                    <span><strong>Costo Total por Unidad:</strong></span>
                    <span class="summary-amount" id="costoTotal${productId}">$0</span>
                </div>
            </div>
        </div>
    `;
}

function addIngredient(productId) {
    const ingredientsList = document.getElementById(`ingredients${productId}`);
    const ingredientCount = ingredientsList.children.length;
    const newIngredientId = ingredientCount + 1;
    
    const ingredientHtml = createIngredientHTML(productId, newIngredientId);
    ingredientsList.insertAdjacentHTML('beforeend', ingredientHtml);
}

function removeIngredient(productId, ingredientId) {
    const ingredientItem = document.querySelector(`[data-product="${productId}"][data-ingredient="${ingredientId}"]`).closest('.ingredient-item');
    if (ingredientItem) {
        ingredientItem.remove();
    }
}

function createIngredientHTML(productId, ingredientId) {
    return `
        <div class="ingredient-item">
            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">Ingrediente</label>
                    <input type="text" class="form-input ingredient-name" placeholder="Ej: Carne de res" data-product="${productId}" data-ingredient="${ingredientId}">
                </div>
                <div class="form-group">
                    <label class="form-label">Cantidad</label>
                    <input type="number" class="form-input ingredient-quantity" placeholder="100" data-product="${productId}" data-ingredient="${ingredientId}" step="0.1">
                </div>
                <div class="form-group">
                    <label class="form-label">Unidad</label>
                    <select class="form-select ingredient-unit" data-product="${productId}" data-ingredient="${ingredientId}">
                        <option value="g">Gramos (g)</option>
                        <option value="kg">Kilogramos (kg)</option>
                        <option value="ml">Mililitros (ml)</option>
                        <option value="l">Litros (l)</option>
                        <option value="unidad">Unidad</option>
                        <option value="hoja">Hoja</option>
                        <option value="rebanada">Rebanada</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Precio de Compra</label>
                    <input type="number" class="form-input ingredient-price" placeholder="0" data-product="${productId}" data-ingredient="${ingredientId}" step="0.01">
                </div>
                <div class="form-group">
                    <label class="form-label">Unidad de Compra</label>
                    <input type="text" class="form-input ingredient-purchase-unit" placeholder="Ej: kg, caja, unidad" data-product="${productId}" data-ingredient="${ingredientId}">
                </div>
            </div>
            <button type="button" class="btn-remove-ingredient" onclick="removeIngredient(${productId}, ${ingredientId})">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
}

// Funciones para costos variables
function calculateIngredientCosts() {
    const products = document.querySelectorAll('.product-card');
    products.forEach(product => {
        const productId = product.id.replace('producto', '');
        let totalCost = 0;
        
        const ingredients = product.querySelectorAll('.ingredient-item');
        ingredients.forEach(ingredient => {
            const quantity = parseFloat(ingredient.querySelector('.ingredient-quantity').value) || 0;
            const price = parseFloat(ingredient.querySelector('.ingredient-price').value) || 0;
            const purchaseUnit = ingredient.querySelector('.ingredient-purchase-unit').value;
            
            // Calcular costo unitario del ingrediente
            let unitCost = 0;
            if (purchaseUnit && price > 0) {
                // Simplificado: asumimos que el precio es por unidad estándar
                unitCost = price;
            }
            
            totalCost += (quantity * unitCost) / 1000; // Convertir a dólares
        });
        
        // Actualizar resumen del producto
        const costoIngredientesElement = document.getElementById(`costoIngredientes${productId}`);
        if (costoIngredientesElement) {
            costoIngredientesElement.textContent = `$${totalCost.toFixed(2)}`;
        }
        
        calculateProductTotalCost(productId);
    });
}

function calculateLaborCosts() {
    const products = document.querySelectorAll('.product-card');
    products.forEach(product => {
        const productId = product.id.replace('producto', '');
        const laborTime = parseFloat(product.querySelector('.labor-time').value) || 0;
        const laborRole = product.querySelector('.labor-role').value;
        
        // Obtener salario base del rol (simplificado)
        let hourlyRate = 0;
        switch(laborRole) {
            case 'cocinero':
                hourlyRate = 3.5; // $3.5/hora
                break;
            case 'mesero':
                hourlyRate = 2.5; // $2.5/hora
                break;
            case 'caja':
                hourlyRate = 3.0; // $3.0/hora
                break;
            case 'limpieza':
                hourlyRate = 2.0; // $2.0/hora
                break;
        }
        
        const laborCost = (laborTime / 60) * hourlyRate;
        
        // Actualizar resumen del producto
        const costoManoObraElement = document.getElementById(`costoManoObra${productId}`);
        if (costoManoObraElement) {
            costoManoObraElement.textContent = `$${laborCost.toFixed(2)}`;
        }
        
        calculateProductTotalCost(productId);
    });
}

function calculateProductTotalCost(productId) {
    const costoIngredientes = parseFloat(document.getElementById(`costoIngredientes${productId}`)?.textContent.replace('$', '')) || 0;
    const costoManoObra = parseFloat(document.getElementById(`costoManoObra${productId}`)?.textContent.replace('$', '')) || 0;
    
    const totalCost = costoIngredientes + costoManoObra;
    
    const costoTotalElement = document.getElementById(`costoTotal${productId}`);
    if (costoTotalElement) {
        costoTotalElement.textContent = `$${totalCost.toFixed(2)}`;
    }
    
    updateProductSummary();
}

function updateProductSummary() {
    const products = document.querySelectorAll('.product-card');
    const totalProductos = products.length;
    
    let totalCost = 0;
    let maxCost = 0;
    let maxCostProduct = '-';
    
    // Guardar datos de productos en businessData
    businessData.costosVariables.productos = [];
    
    products.forEach(product => {
        const productId = product.id.replace('producto', '');
        const productCost = parseFloat(document.getElementById(`costoTotal${productId}`)?.textContent.replace('$', '')) || 0;
        const productName = product.querySelector('.product-name').value || `Producto ${productId}`;
        const productType = product.querySelector('.product-type').value || 'comida';
        
        // Guardar datos del producto
        businessData.costosVariables.productos.push({
            id: productId,
            name: productName,
            type: productType,
            cost: productCost,
            ingredients: [],
            labor: {
                time: parseFloat(product.querySelector('.labor-time').value) || 0,
                role: product.querySelector('.labor-role').value || 'cocinero'
            }
        });
        
        // Recopilar ingredientes del producto
        const ingredients = product.querySelectorAll('.ingredient-item');
        ingredients.forEach((ingredient, index) => {
            const ingredientData = {
                name: ingredient.querySelector('.ingredient-name').value || '',
                quantity: parseFloat(ingredient.querySelector('.ingredient-quantity').value) || 0,
                unit: ingredient.querySelector('.ingredient-unit').value || 'g',
                price: parseFloat(ingredient.querySelector('.ingredient-price').value) || 0,
                purchaseUnit: ingredient.querySelector('.ingredient-purchase-unit').value || ''
            };
            businessData.costosVariables.productos[businessData.costosVariables.productos.length - 1].ingredients.push(ingredientData);
        });
        
        totalCost += productCost;
        
        if (productCost > maxCost) {
            maxCost = productCost;
            maxCostProduct = productName;
        }
    });
    
    const averageCost = totalProductos > 0 ? totalCost / totalProductos : 0;
    
    // Actualizar resumen
    const totalProductosElement = document.getElementById('totalProductos');
    const costoPromedioElement = document.getElementById('costoPromedio');
    const productoMayorCostoElement = document.getElementById('productoMayorCosto');
    
    if (totalProductosElement) totalProductosElement.textContent = totalProductos;
    if (costoPromedioElement) costoPromedioElement.textContent = `$${averageCost.toFixed(2)}`;
    if (productoMayorCostoElement) productoMayorCostoElement.textContent = maxCostProduct;
    
    // Guardar datos en sessionStorage para persistencia entre páginas
    saveToStorage();
}

// Funciones para precios
function calculatePricingAnalysis() {
    // Obtener productos del DOM o de datos guardados
    let products = [];
    const domProducts = document.querySelectorAll('.product-card');
    
    if (domProducts.length > 0) {
        // Si hay productos en el DOM, usarlos
        domProducts.forEach(product => {
            const productId = product.id.replace('producto', '');
            const productCost = parseFloat(document.getElementById(`costoTotal${productId}`)?.textContent.replace('$', '')) || 0;
            const productPrice = parseFloat(document.querySelector(`[data-product="${productId}"].price-input`)?.value) || 0;
            const productName = product.querySelector('.product-name').value || `Producto ${productId}`;
            
            products.push({
                id: productId,
                name: productName,
                cost: productCost,
                price: productPrice
            });
        });
    } else if (businessData.costosVariables.productos && businessData.costosVariables.productos.length > 0) {
        // Si no hay productos en el DOM, usar datos guardados
        businessData.costosVariables.productos.forEach(product => {
            const productPrice = parseFloat(document.querySelector(`[data-product="${product.id}"].price-input`)?.value) || 0;
            
            products.push({
                id: product.id,
                name: product.name,
                cost: product.cost,
                price: productPrice
            });
        });
    }
    
    let totalMargin = 0;
    let maxMargin = 0;
    let minMargin = 100;
    let maxMarginProduct = '-';
    let minMarginProduct = '-';
    let criticalProducts = 0;
    
    products.forEach(product => {
        if (product.price > 0 && product.cost > 0) {
            const margin = ((product.price - product.cost) / product.price) * 100;
            totalMargin += margin;
            
            if (margin > maxMargin) {
                maxMargin = margin;
                maxMarginProduct = product.name;
            }
            
            if (margin < minMargin) {
                minMargin = margin;
                minMarginProduct = product.name;
            }
            
            if (margin < 20) {
                criticalProducts++;
            }
        }
    });
    
    const averageMargin = products.length > 0 ? totalMargin / products.length : 0;
    
    // Actualizar métricas
    const margenPromedioElement = document.getElementById('margenPromedio');
    const productoMasRentableElement = document.getElementById('productoMasRentable');
    const productoMenosRentableElement = document.getElementById('productoMenosRentable');
    const productosCriticosElement = document.getElementById('productosCriticos');
    
    if (margenPromedioElement) margenPromedioElement.textContent = `${averageMargin.toFixed(1)}%`;
    if (productoMasRentableElement) productoMasRentableElement.textContent = maxMarginProduct;
    if (productoMenosRentableElement) productoMenosRentableElement.textContent = minMarginProduct;
    if (productosCriticosElement) productosCriticosElement.textContent = criticalProducts;
    
    updatePricingSummary();
    generateAIRecommendations();
}

// Guardar datos de precios
function savePricingData() {
    if (!businessData.precios) {
        businessData.precios = {};
    }
    
    businessData.precios.productos = [];
    
    // Obtener precios de los inputs
    const priceInputs = document.querySelectorAll('.price-input');
    priceInputs.forEach(input => {
        const productId = input.getAttribute('data-product');
        const price = parseFloat(input.value) || 0;
        
        // Buscar el producto correspondiente
        let productName = `Producto ${productId}`;
        if (businessData.costosVariables.productos) {
            const product = businessData.costosVariables.productos.find(p => p.id === productId);
            if (product) {
                productName = product.name;
            }
        }
        
        businessData.precios.productos.push({
            id: productId,
            name: productName,
            price: price
        });
    });
    
    // Guardar en sessionStorage
    saveToStorage();
}

// Calcular precio recomendado basado en el costo y tipo de producto
function calculateRecommendedPrice(cost, productType = 'comida') {
    if (cost <= 0) return 0;
    
    // Definir márgenes recomendados por tipo de producto
    const margins = {
        'comida': {
            min: 2.5,    // 250% de margen (mínimo)
            optimal: 3.0, // 300% de margen (óptimo)
            max: 4.0     // 400% de margen (máximo)
        },
        'bebida': {
            min: 3.0,    // 300% de margen (mínimo)
            optimal: 4.0, // 400% de margen (óptimo)
            max: 5.0     // 500% de margen (máximo)
        },
        'reventa': {
            min: 1.5,    // 150% de margen (mínimo)
            optimal: 2.0, // 200% de margen (óptimo)
            max: 2.5     // 250% de margen (máximo)
        }
    };
    
    const margin = margins[productType] || margins['comida'];
    
    // Calcular precio recomendado usando el margen óptimo
    let recommendedPrice = cost * margin.optimal;
    
    // Ajustar según el rango de precios del mercado
    if (recommendedPrice < 1) {
        // Para productos muy baratos, establecer un precio mínimo
        recommendedPrice = Math.max(1.50, cost * margin.min);
    } else if (recommendedPrice > 50) {
        // Para productos caros, usar un margen más conservador
        recommendedPrice = cost * margin.min;
    }
    
    // Redondear a 0.25 más cercano para precios más atractivos
    recommendedPrice = Math.round(recommendedPrice * 4) / 4;
    
    return recommendedPrice;
}

// Aplicar precio recomendado al input
function applyRecommendedPrice(productId, recommendedPrice) {
    const priceInput = document.querySelector(`[data-product="${productId}"].price-input`);
    if (priceInput) {
        priceInput.value = recommendedPrice.toFixed(2);
        
        // Disparar evento de cambio para actualizar cálculos
        const event = new Event('input', { bubbles: true });
        priceInput.dispatchEvent(event);
        
        // Mostrar confirmación
        showPriceAppliedMessage(recommendedPrice);
    }
}

// Mostrar mensaje de confirmación
function showPriceAppliedMessage(price) {
    // Crear notificación temporal
    const notification = document.createElement('div');
    notification.className = 'price-notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>Precio aplicado: $${price.toFixed(2)}</span>
    `;
    
    // Agregar al body
    document.body.appendChild(notification);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}

// Configurar eventos de navegación
function setupNavigationEvents() {
    // Interceptar clics en enlaces de navegación
    document.addEventListener('click', function(e) {
        if (e.target.tagName === 'A' && e.target.href) {
            // Guardar datos antes de navegar
            saveCurrentPageData();
        }
    });
    
    // Interceptar envíos de formularios
    document.addEventListener('submit', function(e) {
        // Guardar datos antes de enviar formulario
        saveCurrentPageData();
    });
}

// Guardar datos de la página actual
function saveCurrentPageData() {
    const currentPage = window.location.pathname;
    
    if (currentPage.includes('costos-variables.html')) {
        // Guardar datos de costos variables
        updateProductSummary();
    } else if (currentPage.includes('precios.html')) {
        // Guardar datos de precios
        savePricingData();
    }
    
    // Guardar en sessionStorage
    saveToStorage();
}

function generateAIRecommendations() {
    const recommendationsContainer = document.getElementById('recommendationsContainer');
    if (!recommendationsContainer) return;
    
    const averageMargin = parseFloat(document.getElementById('margenPromedio')?.textContent.replace('%', '')) || 0;
    const criticalProducts = parseInt(document.getElementById('productosCriticos')?.textContent) || 0;
    
    let recommendationsHTML = '';
    
    if (averageMargin < 20) {
        recommendationsHTML += `
            <div class="recommendation-item error">
                <div class="recommendation-header">
                    <i class="fas fa-exclamation-triangle"></i>
                    <span>Margen de ganancia bajo</span>
                </div>
                <div class="recommendation-content">
                    Tu margen promedio de ${averageMargin.toFixed(1)}% es muy bajo. Considera aumentar precios o reducir costos para alcanzar al menos un 30% de margen.
                </div>
            </div>
        `;
    }
    
    if (criticalProducts > 0) {
        recommendationsHTML += `
            <div class="recommendation-item warning">
                <div class="recommendation-header">
                    <i class="fas fa-exclamation-circle"></i>
                    <span>Productos con margen crítico</span>
                </div>
                <div class="recommendation-content">
                    Tienes ${criticalProducts} producto(s) con margen menor al 20%. Revisa sus precios o costos para mejorar la rentabilidad.
                </div>
            </div>
        `;
    }
    
    if (averageMargin >= 30) {
        recommendationsHTML += `
            <div class="recommendation-item success">
                <div class="recommendation-header">
                    <i class="fas fa-check-circle"></i>
                    <span>Excelente margen de ganancia</span>
                </div>
                <div class="recommendation-content">
                    Tu margen promedio de ${averageMargin.toFixed(1)}% es saludable. Mantén esta estructura de precios y costos.
                </div>
            </div>
        `;
    }
    
    recommendationsHTML += `
        <div class="recommendation-item info">
            <div class="recommendation-header">
                <i class="fas fa-lightbulb"></i>
                <span>Consejo general</span>
            </div>
            <div class="recommendation-content">
                Recuerda que los precios deben ser competitivos en tu zona. Investiga los precios de la competencia para asegurar que tus precios sean atractivos para los clientes.
            </div>
        </div>
    `;
    
    recommendationsContainer.innerHTML = recommendationsHTML;
}

function updatePricingSummary() {
    const products = document.querySelectorAll('.product-card');
    let totalPrice = 0;
    let maxPrice = 0;
    let minPrice = Infinity;
    let maxPriceProduct = '-';
    let minPriceProduct = '-';
    
    products.forEach(product => {
        const productId = product.id.replace('producto', '');
        const productPrice = parseFloat(document.querySelector(`[data-product="${productId}"].price-input`)?.value) || 0;
        const productName = product.querySelector('.product-name').value || `Producto ${productId}`;
        
        if (productPrice > 0) {
            totalPrice += productPrice;
            
            if (productPrice > maxPrice) {
                maxPrice = productPrice;
                maxPriceProduct = productName;
            }
            
            if (productPrice < minPrice) {
                minPrice = productPrice;
                minPriceProduct = productName;
            }
        }
    });
    
    const averagePrice = products.length > 0 ? totalPrice / products.length : 0;
    
    // Actualizar resumen
    const precioPromedioElement = document.getElementById('precioPromedio');
    const productoMasCaroElement = document.getElementById('productoMasCaro');
    const productoMasBaratoElement = document.getElementById('productoMasBarato');
    
    if (precioPromedioElement) precioPromedioElement.textContent = `$${averagePrice.toFixed(2)}`;
    if (productoMasCaroElement) productoMasCaroElement.textContent = maxPriceProduct;
    if (productoMasBaratoElement) productoMasBaratoElement.textContent = minPriceProduct;
    
    // Actualizar resumen de margen
    const resumenMargenElement = document.getElementById('resumenMargen');
    if (resumenMargenElement) {
        const averageMargin = parseFloat(document.getElementById('margenPromedio')?.textContent.replace('%', '')) || 0;
        resumenMargenElement.textContent = `${averageMargin.toFixed(1)}%`;
    }
}

// Funciones para análisis final
function calculateBreakEven() {
    const totalFixedCosts = businessData.costosFijos.total || 0;
    
    // Calcular precio y costo promedio desde los datos guardados
    let averagePrice = 0;
    let averageCost = 0;
    
    if (businessData.precios && businessData.precios.productos && businessData.precios.productos.length > 0) {
        const totalPrice = businessData.precios.productos.reduce((sum, product) => sum + (product.price || 0), 0);
        averagePrice = totalPrice / businessData.precios.productos.length;
    }
    
    if (businessData.costosVariables && businessData.costosVariables.productos && businessData.costosVariables.productos.length > 0) {
        const totalCost = businessData.costosVariables.productos.reduce((sum, product) => sum + (product.cost || 0), 0);
        averageCost = totalCost / businessData.costosVariables.productos.length;
    }
    
    if (averagePrice > averageCost && averageCost > 0) {
        const contributionMargin = averagePrice - averageCost;
        const breakEvenUnits = totalFixedCosts / contributionMargin;
        const breakEvenSales = breakEvenUnits * averagePrice;
        
        // Actualizar métricas
        const unidadesEquilibrioElement = document.getElementById('unidadesEquilibrio');
        const ventasEquilibrioElement = document.getElementById('ventasEquilibrio');
        
        if (unidadesEquilibrioElement) unidadesEquilibrioElement.textContent = Math.ceil(breakEvenUnits);
        if (ventasEquilibrioElement) ventasEquilibrioElement.textContent = `$${breakEvenSales.toFixed(2)}`;
        
        // Calcular margen de seguridad (simplificado)
        const projectedSales = 100; // Ventas proyectadas mensuales
        const marginOfSafety = ((projectedSales - breakEvenUnits) / projectedSales) * 100;
        
        const margenSeguridadElement = document.getElementById('margenSeguridad');
        if (margenSeguridadElement) {
            margenSeguridadElement.textContent = `${Math.max(0, marginOfSafety).toFixed(1)}%`;
        }
    }
}

function calculateCashFlow() {
    // Simulación de flujo de caja (simplificada)
    const totalFixedCosts = businessData.costosFijos.total || 0;
    
    // Calcular precio y costo promedio desde los datos guardados
    let averagePrice = 0;
    let averageCost = 0;
    
    if (businessData.precios && businessData.precios.productos && businessData.precios.productos.length > 0) {
        const totalPrice = businessData.precios.productos.reduce((sum, product) => sum + (product.price || 0), 0);
        averagePrice = totalPrice / businessData.precios.productos.length;
    }
    
    if (businessData.costosVariables && businessData.costosVariables.productos && businessData.costosVariables.productos.length > 0) {
        const totalCost = businessData.costosVariables.productos.reduce((sum, product) => sum + (product.cost || 0), 0);
        averageCost = totalCost / businessData.costosVariables.productos.length;
    }
    
    let totalProfit = 0;
    let bestMonth = 0;
    let worstMonth = 0;
    
    // Simular 12 meses con crecimiento gradual
    for (let month = 1; month <= 12; month++) {
        const projectedSales = Math.floor(50 + (month * 10)); // Crecimiento gradual
        const revenue = projectedSales * averagePrice;
        const variableCosts = projectedSales * averageCost;
        const profit = revenue - variableCosts - totalFixedCosts;
        
        totalProfit += profit;
        
        if (month === 1) {
            bestMonth = profit;
            worstMonth = profit;
        } else {
            if (profit > bestMonth) bestMonth = profit;
            if (profit < worstMonth) worstMonth = profit;
        }
    }
    
    // Actualizar métricas
    const gananciaTotalElement = document.getElementById('gananciaTotal');
    const mejorMesElement = document.getElementById('mejorMes');
    const peorMesElement = document.getElementById('peorMes');
    
    if (gananciaTotalElement) gananciaTotalElement.textContent = `$${totalProfit.toFixed(2)}`;
    if (mejorMesElement) mejorMesElement.textContent = `$${bestMonth.toFixed(2)}`;
    if (peorMesElement) peorMesElement.textContent = `$${worstMonth.toFixed(2)}`;
    
    // Calcular tiempo de recuperación de inversión
    const totalInversion = businessData.inversion.totalGastos || 0;
    let recoveryMonths = 0;
    let accumulatedProfit = 0;
    
    for (let month = 1; month <= 12; month++) {
        const projectedSales = Math.floor(50 + (month * 10));
        const revenue = projectedSales * averagePrice;
        const variableCosts = projectedSales * averageCost;
        const profit = revenue - variableCosts - totalFixedCosts;
        
        accumulatedProfit += profit;
        if (accumulatedProfit >= totalInversion && recoveryMonths === 0) {
            recoveryMonths = month;
        }
    }
    
    const recuperacionInversionElement = document.getElementById('recuperacionInversion');
    if (recuperacionInversionElement) {
        recuperacionInversionElement.textContent = recoveryMonths > 0 ? recoveryMonths : '12+';
    }
}

function calculateViabilityScore() {
    const totalFixedCosts = businessData.costosFijos.total || 0;
    
    // Calcular precio y costo promedio desde los datos guardados
    let averagePrice = 0;
    let averageCost = 0;
    let averageMargin = 0;
    
    if (businessData.precios && businessData.precios.productos && businessData.precios.productos.length > 0) {
        const totalPrice = businessData.precios.productos.reduce((sum, product) => sum + (product.price || 0), 0);
        averagePrice = totalPrice / businessData.precios.productos.length;
    }
    
    if (businessData.costosVariables && businessData.costosVariables.productos && businessData.costosVariables.productos.length > 0) {
        const totalCost = businessData.costosVariables.productos.reduce((sum, product) => sum + (product.cost || 0), 0);
        averageCost = totalCost / businessData.costosVariables.productos.length;
    }
    
    // Calcular margen promedio
    if (averagePrice > 0 && averageCost > 0) {
        averageMargin = ((averagePrice - averageCost) / averagePrice) * 100;
    }
    
    let score = 0;
    
    // Evaluar margen de ganancia (40 puntos)
    if (averageMargin >= 30) score += 40;
    else if (averageMargin >= 20) score += 25;
    else if (averageMargin >= 10) score += 10;
    
    // Evaluar punto de equilibrio (30 puntos)
    if (averagePrice > averageCost) {
        const contributionMargin = averagePrice - averageCost;
        const breakEvenUnits = totalFixedCosts / contributionMargin;
        
        if (breakEvenUnits <= 100) score += 30;
        else if (breakEvenUnits <= 200) score += 20;
        else if (breakEvenUnits <= 300) score += 10;
    }
    
    // Evaluar costos fijos (30 puntos)
    if (totalFixedCosts <= 2000) score += 30;
    else if (totalFixedCosts <= 4000) score += 20;
    else if (totalFixedCosts <= 6000) score += 10;
    
    // Actualizar puntuación en la UI si existe
    const viabilityScoreElement = document.getElementById('viabilityScore');
    if (viabilityScoreElement) {
        viabilityScoreElement.querySelector('.score-value').textContent = score;
    }
    
    // Actualizar decisión
    updateDecision(score);
    
    // Actualizar resumen ejecutivo
    updateExecutiveSummary();
    
    return score;
}

function updateExecutiveSummary() {
    const totalInversion = businessData.inversion.totalGastos || 0;
    const totalFixedCosts = businessData.costosFijos.total || 0;
    
    // Calcular precio y costo promedio desde los datos guardados
    let averageCost = 0;
    let averagePrice = 0;
    let averageMargin = 0;
    
    if (businessData.costosVariables && businessData.costosVariables.productos && businessData.costosVariables.productos.length > 0) {
        const totalCost = businessData.costosVariables.productos.reduce((sum, product) => sum + (product.cost || 0), 0);
        averageCost = totalCost / businessData.costosVariables.productos.length;
    }
    
    if (businessData.precios && businessData.precios.productos && businessData.precios.productos.length > 0) {
        const totalPrice = businessData.precios.productos.reduce((sum, product) => sum + (product.price || 0), 0);
        averagePrice = totalPrice / businessData.precios.productos.length;
    }
    
    // Calcular margen promedio
    if (averagePrice > 0 && averageCost > 0) {
        averageMargin = ((averagePrice - averageCost) / averagePrice) * 100;
    }
    
    // Calcular punto de equilibrio
    let breakEvenUnits = 0;
    if (averagePrice > averageCost && averageCost > 0) {
        const contributionMargin = averagePrice - averageCost;
        breakEvenUnits = totalFixedCosts / contributionMargin;
    }
    
    // Actualizar resumen ejecutivo
    const resumenInversionElement = document.getElementById('resumenInversion');
    const resumenCostosFijosElement = document.getElementById('resumenCostosFijos');
    const resumenCostoProductoElement = document.getElementById('resumenCostoProducto');
    const resumenPrecioVentaElement = document.getElementById('resumenPrecioVenta');
    const resumenMargenFinalElement = document.getElementById('resumenMargenFinal');
    const resumenEquilibrioElement = document.getElementById('resumenEquilibrio');
    
    if (resumenInversionElement) resumenInversionElement.textContent = `$${totalInversion.toFixed(2)}`;
    if (resumenCostosFijosElement) resumenCostosFijosElement.textContent = `$${totalFixedCosts.toFixed(2)}`;
    if (resumenCostoProductoElement) resumenCostoProductoElement.textContent = `$${averageCost.toFixed(2)}`;
    if (resumenPrecioVentaElement) resumenPrecioVentaElement.textContent = `$${averagePrice.toFixed(2)}`;
    if (resumenMargenFinalElement) resumenMargenFinalElement.textContent = `${averageMargin.toFixed(1)}%`;
    if (resumenEquilibrioElement) resumenEquilibrioElement.textContent = `${Math.ceil(breakEvenUnits)} unidades/mes`;
}

function updateDecision(score) {
    const decisionAnswerElement = document.getElementById('decisionAnswer');
    const decisionReasoningElement = document.getElementById('decisionReasoning');
    
    if (score >= 70) {
        decisionAnswerElement.innerHTML = '<span class="answer-text">¡SÍ, EMPRENDE!</span>';
        decisionReasoningElement.innerHTML = '<p>Tu negocio tiene un alto potencial de éxito. Los márgenes son saludables y el punto de equilibrio es alcanzable.</p>';
    } else if (score >= 50) {
        decisionAnswerElement.innerHTML = '<span class="answer-text">CONSIDERA EMPRENDER</span>';
        decisionReasoningElement.innerHTML = '<p>Tu negocio es viable pero necesita optimizaciones. Considera ajustar precios o reducir costos.</p>';
    } else {
        decisionAnswerElement.innerHTML = '<span class="answer-text">NO RECOMENDADO</span>';
        decisionReasoningElement.innerHTML = '<p>El negocio presenta riesgos significativos. Revisa tu modelo de negocio antes de proceder.</p>';
    }
}

// Funciones para guardar y exportar
function guardarSimulacion() {
    // Verificar si estamos en modo demo o autenticado
    if (isDemo()) {
        alert('En modo demo no se pueden guardar simulaciones. Crea una cuenta para guardar tus simulaciones.');
        return;
    }
    
    if (!isAuthenticated()) {
        alert('Debes iniciar sesión para guardar simulaciones.');
        window.location.href = 'login.html';
        return;
    }
    
    // Recopilar datos de la simulación
    const simulationData = {
        name: businessData.configuracion.nombreNegocio || 'Simulación sin nombre',
        description: businessData.configuracion.descripcion || '',
        businessType: businessData.configuracion.tipoNegocio || '',
        totalInvestment: businessData.inversion.totalGastos || 0,
        score: calculateViabilityScore(),
        configuracion: businessData.configuracion,
        inversion: businessData.inversion,
        costosFijos: businessData.costosFijos,
        costosVariables: businessData.costosVariables,
        precios: businessData.precios,
        proyecciones: businessData.proyecciones
    };
    
    // Guardar usando la función del dashboard
    if (typeof saveSimulation === 'function') {
        saveSimulation(simulationData);
        alert('Simulación guardada exitosamente.');
    } else {
        // Fallback para cuando no está disponible la función del dashboard
        const simulations = JSON.parse(localStorage.getItem('simulations') || '[]');
        const newSimulation = {
            ...simulationData,
            id: 'sim_' + Date.now(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        simulations.unshift(newSimulation);
        localStorage.setItem('simulations', JSON.stringify(simulations));
        alert('Simulación guardada exitosamente.');
    }
}

function exportarReporte() {
    // Verificar si estamos en modo demo
    if (isDemo()) {
        showPremiumMessage();
        return;
    }
    
    if (!isAuthenticated()) {
        alert('Debes iniciar sesión para exportar reportes.');
        window.location.href = 'login.html';
        return;
    }
    
    // Verificar acceso premium
    if (!hasPremiumAccess()) {
        showPremiumMessage();
        return;
    }
    
    // Simular exportación
    alert('Reporte exportado como PDF.');
}

// Función para limpiar storage al recargar la página
function setupStorageCleanup() {
    // Limpiar storage solo si es una recarga completa (no navegación interna)
    if (performance.navigation.type === 1) { // 1 = reload
        clearStorage();
        console.log('Storage limpiado por recarga de página');
    }
}
