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

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Configurar eventos para selección de tipo de negocio
    setupBusinessTypeSelection();
    
    // Configurar eventos para cálculos automáticos
    setupAutoCalculations();
    
    // Configurar validaciones de formularios
    setupFormValidations();
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
        });
    });
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

// Funciones para guardar y exportar
function guardarSimulacion() {
    // Simular guardado
    alert('Simulación guardada exitosamente.');
}

function exportarReporte() {
    // Simular exportación
    alert('Reporte exportado como PDF.');
}
