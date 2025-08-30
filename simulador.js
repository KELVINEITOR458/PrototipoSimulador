// Simulador de Negocios - JavaScript para SPA (Single Page Application)

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

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    initializeSimulador();
});

function initializeSimulador() {
    try {
        console.log('Inicializando simulador...');
        
        // Verificar que el DOM esté listo
        console.log('Verificando elementos del DOM...');
        const progressBar = document.getElementById('progressBar');
        console.log('Progress bar encontrada:', progressBar);
        
        const steps = document.querySelectorAll('.form-step');
        console.log(`Encontrados ${steps.length} pasos en el DOM`);
        
    // Cargar datos guardados
    loadFromStorage();
    
    // Configurar eventos de navegación
    setupNavigation();
    
    // Configurar eventos de formularios
    setupFormEvents();
    
    // Configurar eventos de guardado automático
    setupAutoSave();
        
        // Configurar eventos del modal
        setupModalEvents();
    
    // Mostrar el primer paso
        console.log('Intentando mostrar paso 1...');
    showStep(1);
    
    // Actualizar barra de progreso
    updateProgressBar();
    
    // Generar resúmenes
    generateStepSummaries();
    
        console.log('Simulador inicializado correctamente');
        
    } catch (error) {
        console.error('Error al inicializar simulador:', error);
    }
}

// Navegación entre pasos
function setupNavigation() {
    // Los botones de navegación ya están configurados en el HTML con onclick
}

// Configurar eventos del modal
function setupModalEvents() {
    const modal = document.getElementById('summaryModal');
    
    // Cerrar modal con Escape
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.classList.contains('show')) {
            toggleSummaryModal();
        }
    });
    
    // Cerrar modal haciendo clic fuera del contenido
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            toggleSummaryModal();
        }
    });
}

function nextStep() {
    try {
        // Verificar si el botón siguiente está habilitado (análisis completado)
        const currentStepElement = document.querySelector('.form-step.active');
        const nextBtn = currentStepElement ? currentStepElement.querySelector('#nextBtn') : null;
        if (nextBtn && nextBtn.disabled) {
            showNotification('❌ Debes hacer clic en "Analizar" antes de continuar al siguiente paso.', 'error');
            return;
        }
        
        if (validateCurrentStep()) {
            if (currentStep < 6) {
                currentStep++;
                showStep(currentStep);
                updateProgressBar();
                generateStepSummaries();
            }
        }
    } catch (error) {
        console.error('Error al avanzar paso:', error);
    }
}

function previousStep() {
    try {
    if (currentStep > 1) {
        currentStep--;
        showStep(currentStep);
        updateProgressBar();
        generateStepSummaries();
        }
    } catch (error) {
        console.error('Error al retroceder paso:', error);
    }
}

function showStep(stepNumber) {
    try {
        console.log(`Mostrando paso ${stepNumber}...`);
        
    // Ocultar todos los pasos
        const allSteps = document.querySelectorAll('.form-step');
        console.log(`Encontrados ${allSteps.length} pasos`);
        
        allSteps.forEach(step => {
            step.classList.remove('active');
    });
    
    // Mostrar el paso actual
    const currentStepElement = document.getElementById(`step${stepNumber}`);
        console.log(`Buscando elemento step${stepNumber}:`, currentStepElement);
        
    if (currentStepElement) {
            currentStepElement.classList.add('active');
        currentStep = stepNumber;
            console.log(`Paso ${stepNumber} mostrado correctamente`);
        
        // Limpiar todos los errores al cambiar de paso
        clearAllErrors();
        
        // Ejecutar funciones específicas del paso
        executeStepFunctions(stepNumber);
        
        // Deshabilitar botón siguiente al cambiar de paso
        const nextBtn = document.querySelector('.form-step.active #nextBtn');
        if (nextBtn) {
            nextBtn.disabled = true;
        }
        } else {
            console.error(`No se encontró el elemento step${stepNumber}`);
        }
    } catch (error) {
        console.error('Error al mostrar paso:', error);
    }
}

// Función para limpiar todos los errores
function clearAllErrors() {
    // Limpiar errores de campos
    document.querySelectorAll('.field-error').forEach(error => error.remove());
    document.querySelectorAll('.error').forEach(field => field.classList.remove('error'));
    
    // Limpiar errores de configuración
    document.querySelectorAll('.configuration-error').forEach(error => error.remove());
    
    // Limpiar errores de pasos
    document.querySelectorAll('.step-error').forEach(error => error.remove());
    
    // Limpiar errores de IA
    clearAllAIErrors();
}

function executeStepFunctions(stepNumber) {
    try {
        console.log(`Ejecutando funciones del paso ${stepNumber}...`);
        
    switch(stepNumber) {
        case 1:
            // Configuración - no necesita funciones especiales
                console.log('Paso 1: No requiere funciones especiales');
            break;
        case 2:
            // Inversión - calcular totales
                console.log('Paso 2: Calculando totales de inversión...');
            calculateTotalExpenses();
            calculateTotalFunding();
                console.log('Paso 2: Cálculos completados');
            break;
        case 3:
            // Costos fijos - calcular totales
                console.log('Paso 3: Calculando costos fijos...');
            calculateStaffCosts();
            calculateTotalServices();
            calculateTotalFixedCosts();
                console.log('Paso 3: Cálculos completados');
            break;
        case 4:
            // Costos variables - generar productos
                console.log('Paso 4: Generando productos...');
            generateProductCards();
                console.log('Paso 4: Productos generados');
            break;
        case 5:
            // Precios - generar campos de precio
                console.log('Paso 5: Generando campos de precio...');
            generatePricingFields();
            calculatePricingAnalysis();
                console.log('Paso 5: Campos de precio generados');
            break;
        case 6:
            // Análisis final - ejecutar todos los cálculos
                console.log('Paso 6: Ejecutando análisis final...');
            setTimeout(() => {
                calculateBreakEven();
                calculateCashFlow();
                calculateViabilityScore();
                generateIAAlerts();
                generatePriceManipulator();
                    console.log('Paso 6: Análisis final completado');
            }, 500);
            break;
        }
    } catch (error) {
        console.error(`Error ejecutando funciones del paso ${stepNumber}:`, error);
    }
}

function updateProgressBar() {
    const progressBar = document.getElementById('progressBar');
    const progress = (currentStep / 6) * 100;
    progressBar.style.width = `${progress}%`;
}

// Validación de pasos
function validateCurrentStep() {
    try {
        console.log(`Validando paso ${currentStep} con IA...`);
        
        // Primero validar en tiempo real
        let isValid = true;
        
        switch (currentStep) {
            case 1:
                isValid = validateConfigurationInRealTime();
                break;
            case 2:
                isValid = validateInvestmentInRealTime();
                break;
            case 3:
                isValid = validateFixedCostsInRealTime();
                break;
            case 4:
                isValid = validateVariableCostsInRealTime();
                break;
            case 5:
                isValid = validatePricingInRealTime();
                break;
            default:
                isValid = true;
        }
        
        // Si hay errores básicos, no permitir avanzar
        if (!isValid) {
            return false;
        }
        
        // Validaciones con IA específicas del paso
        switch (currentStep) {
            case 1:
                return validateConfigurationWithAI();
            case 2:
                return validateInvestmentWithAI();
            case 3:
                return validateFixedCostsWithAI();
            case 4:
                return validateVariableCostsWithAI();
            case 5:
                return validatePricingWithAI();
            default:
                return true;
        }
    } catch (error) {
        console.error('Error validando paso actual:', error);
        return false;
    }
}

function validateConfiguration() {
    console.log('Iniciando validación de configuración...');
    const businessType = document.querySelector('.business-option.selected');
    const location = document.getElementById('location').value;
    const size = document.getElementById('size').value;
    const capacity = document.getElementById('capacity').value;
    
    console.log('Datos de configuración:', {
        businessType: businessType ? businessType.dataset.type : 'no seleccionado',
        location: location,
        size: size,
        capacity: capacity
    });
    
    let isValid = true;
    
    if (!businessType) {
        showError('businessTypeError');
        isValid = false;
    } else {
        hideError('businessTypeError');
    }
    
    if (!location || location.trim() === '') {
        alert('Por favor ingresa la ubicación de tu negocio en Pichincha.');
        isValid = false;
    }
    
    if (!size || size < 10 || size > 1000) {
        alert('Por favor ingresa un tamaño válido (entre 10 y 1000 m²).');
        isValid = false;
    }
    
    if (!capacity || capacity < 5 || capacity > 200) {
        alert('Por favor ingresa una capacidad válida (entre 5 y 200 personas).');
        isValid = false;
    }
    
    if (isValid) {
        // Guardar datos de configuración
        businessData.configuracion = {
            tipoNegocio: businessType.dataset.type,
            ubicacion: location,
            tamaño: parseFloat(size),
            capacidad: parseFloat(capacity),
            nombreNegocio: document.getElementById('businessName').value,
            descripcion: document.getElementById('description').value
        };
        saveToStorage();
        console.log('Configuración válida, datos guardados');
    } else {
        console.log('Configuración inválida');
    }
    
    console.log('validateConfiguration() retornando:', isValid);
    return isValid;
}

function validateInvestment() {
    // Primero actualizar los datos del formulario
    updateBusinessDataFromForm();
    
    // Calcular totales
    calculateTotalExpenses();
    calculateTotalFunding();
    
    const totalGastos = businessData.inversion.totalGastos || 0;
    const totalFinanciamiento = businessData.inversion.totalFinanciamiento || 0;
    
    if (totalGastos === 0) {
        alert('Por favor ingresa al menos un gasto de montaje.');
        return false;
    }
    
    if (totalFinanciamiento === 0) {
        alert('Por favor ingresa al menos una fuente de financiamiento.');
        return false;
    }
    
    return true;
}

function validateFixedCosts() {
    console.log('Validando costos fijos...');
    
    // Validar arriendo
    const arriendo = parseFloat(document.getElementById('arriendo')?.value) || 0;
    console.log('Arriendo:', arriendo);
    
    if (arriendo === 0) {
        alert('Por favor ingresa el monto del arriendo.');
        return false;
    }
    
    // Validar que al menos un rol de personal tenga datos
    const staffRoles = ['cocinero', 'meseros', 'caja', 'limpieza'];
    let hasValidStaff = false;
    
    staffRoles.forEach(role => {
        const quantityInput = document.querySelector(`[data-role="${role}"][data-type="quantity"]`);
        const salaryInput = document.querySelector(`[data-role="${role}"][data-type="salary"]`);
        
        if (quantityInput && salaryInput) {
            const quantity = parseInt(quantityInput.value) || 0;
            const salary = parseFloat(salaryInput.value) || 0;
            
            if (quantity > 0 && salary > 0) {
                hasValidStaff = true;
            }
        }
    });
    
    if (!hasValidStaff) {
        console.log('No hay personal válido');
        alert('Por favor ingresa al menos un rol de personal con cantidad y salario.');
        return false;
    }
    
    console.log('Personal válido encontrado');
    
    // Validar que al menos un servicio tenga datos (si no está incluido en arriendo)
    const serviciosArriendo = document.getElementById('serviciosArriendo')?.value || 'ninguno';
    console.log('Servicios incluidos en arriendo:', serviciosArriendo);
    
    const serviceInputs = document.querySelectorAll('.service-input:not([disabled])');
    let hasValidService = false;
    
    serviceInputs.forEach(input => {
        const serviceValue = parseFloat(input.value) || 0;
        if (serviceValue > 0) {
            hasValidService = true;
        }
    });
    
    console.log('Tiene servicios válidos:', hasValidService);
    
    // Si no hay servicios incluidos en arriendo, al menos uno debe tener valor
    if (serviciosArriendo === 'ninguno' && !hasValidService) {
        console.log('No hay servicios válidos');
        alert('Por favor ingresa al menos un servicio básico (electricidad, agua, internet o gas).');
        return false;
    }
    
    console.log('Validación de costos fijos exitosa');
    return true;
}

function validateVariableCosts() {
    console.log('Validando costos variables...');
    
    const products = document.querySelectorAll('.product-card');
    let hasValidProduct = false;
    let validationErrors = [];
    
    products.forEach((product, index) => {
        const productName = product.querySelector('.product-name').value.trim();
        if (productName) {
            hasValidProduct = true;
            
            // Validar que tenga al menos un ingrediente
            const ingredients = product.querySelectorAll('.ingredient-name');
            const hasIngredients = Array.from(ingredients).some(ing => ing.value.trim() !== '');
            
            if (!hasIngredients) {
                validationErrors.push(`Producto ${index + 1} (${productName}): Debes agregar al menos un ingrediente`);
            } else {
                // Validar consistencia entre nombre del plato e ingredientes
                const ingredientNames = Array.from(ingredients).map(ing => ing.value.trim().toLowerCase());
                
                // Análisis de consistencia con IA
                const consistencyCheck = validateDishIngredientConsistency(productName, ingredientNames);
                if (!consistencyCheck.isConsistent) {
                    validationErrors.push(`Producto ${index + 1} (${productName}): ${consistencyCheck.message}`);
                }
                
                // Validar precios de ingredientes
                const ingredientItems = product.querySelectorAll('.ingredient-item');
                ingredientItems.forEach((item, ingIndex) => {
                    const nameInput = item.querySelector('.ingredient-name');
                    const priceInput = item.querySelector('.ingredient-price');
                    
                    if (nameInput && priceInput && nameInput.value.trim()) {
                        const ingredientName = nameInput.value.trim();
                        const price = parseFloat(priceInput.value) || 0;
                        
                        // Validar precio del ingrediente
                        const priceValidation = validateIngredientPrice(ingredientName, price);
                        if (!priceValidation.isValid) {
                            validationErrors.push(`Producto ${index + 1} (${productName}) - ${ingredientName}: ${priceValidation.message}`);
                        }
                    }
                });
            }
        }
    });
    
    if (!hasValidProduct) {
        alert('Por favor ingresa al menos un producto con su nombre.');
        return false;
    }
    
    if (validationErrors.length > 0) {
        const errorMessage = '❌ Errores de validación detectados:\n\n' + validationErrors.join('\n\n') + '\n\n💡 Sugerencia: Usa el botón "Aplicar Ingredientes Sugeridos" para corregir automáticamente.';
        alert(errorMessage);
        return false;
    }
    
    return true;
}

function validateIngredientPrice(ingredientName, price) {
    console.log('Validando precio de ingrediente:', ingredientName, price);
    
    // Precios base por unidad en Ecuador (USD)
    const basePrices = {
        // Carnes (por kg)
        'pollo': { min: 2.5, max: 4.5, unit: 'kg' },
        'carne de res': { min: 4.0, max: 8.0, unit: 'kg' },
        'cerdo': { min: 3.0, max: 5.5, unit: 'kg' },
        'pescado': { min: 3.5, max: 7.0, unit: 'kg' },
        'camarón': { min: 8.0, max: 15.0, unit: 'kg' },
        
        // Verduras (por kg)
        'cebolla': { min: 0.8, max: 1.5, unit: 'kg' },
        'tomate': { min: 1.0, max: 2.0, unit: 'kg' },
        'papa': { min: 0.6, max: 1.2, unit: 'kg' },
        'zanahoria': { min: 0.8, max: 1.5, unit: 'kg' },
        'lechuga': { min: 1.0, max: 2.0, unit: 'kg' },
        'arroz': { min: 0.8, max: 1.5, unit: 'kg' },
        'frijoles': { min: 1.2, max: 2.5, unit: 'kg' },
        'lentejas': { min: 1.0, max: 2.0, unit: 'kg' },
        
        // Condimentos (por kg)
        'sal': { min: 0.5, max: 1.0, unit: 'kg' },
        'azúcar': { min: 0.8, max: 1.5, unit: 'kg' },
        'aceite': { min: 2.0, max: 4.0, unit: 'l' },
        'mantequilla': { min: 3.0, max: 6.0, unit: 'kg' },
        
        // Lácteos
        'leche': { min: 1.0, max: 1.8, unit: 'l' },
        'queso': { min: 4.0, max: 8.0, unit: 'kg' },
        'huevos': { min: 2.5, max: 4.0, unit: 'docena' },
        
        // Frutas
        'plátano': { min: 0.8, max: 1.5, unit: 'kg' },
        'manzana': { min: 1.5, max: 3.0, unit: 'kg' },
        'naranja': { min: 1.0, max: 2.0, unit: 'kg' },
        'limón': { min: 1.5, max: 3.0, unit: 'kg' }
    };
    
    // Buscar el ingrediente en la base de datos
    const normalizedName = ingredientName.toLowerCase();
    let foundIngredient = null;
    
    for (const [key, value] of Object.entries(basePrices)) {
        if (normalizedName.includes(key) || key.includes(normalizedName)) {
            foundIngredient = { ...value, name: key };
            break;
        }
    }
    
    if (!foundIngredient) {
        // Si no se encuentra, usar rangos genéricos
        foundIngredient = { min: 0.5, max: 10.0, unit: 'unidad', name: 'ingrediente genérico' };
    }
    
    // Validar precio
    if (price <= 0) {
        return {
            isValid: false,
            message: `El precio debe ser mayor a 0`
        };
    }
    
    if (price < foundIngredient.min * 0.3) {
        return {
            isValid: false,
            message: `El precio ($${price}/${foundIngredient.unit}) es muy bajo para ${foundIngredient.name}. Rango típico: $${foundIngredient.min}-$${foundIngredient.max}/${foundIngredient.unit}`
        };
    }
    
    if (price > foundIngredient.max * 3) {
        return {
            isValid: false,
            message: `El precio ($${price}/${foundIngredient.unit}) es muy alto para ${foundIngredient.name}. Rango típico: $${foundIngredient.min}-$${foundIngredient.max}/${foundIngredient.unit}`
        };
    }
    
    return {
        isValid: true,
        message: 'Precio válido'
    };
}

function validateDishIngredientConsistency(dishName, ingredientNames) {
    console.log('Validando consistencia:', dishName, ingredientNames);
    
    const normalizedDishName = dishName.toLowerCase();
    
    // Reglas de validación para platos específicos
    const validationRules = {
        'seco de pollo': {
            required: ['pollo'],
            forbidden: ['carne de res', 'res', 'vaca', 'ternera', 'cerdo', 'chivo'],
            message: 'El Seco de Pollo debe contener pollo, no carne de res'
        },
        'seco de chivo': {
            required: ['chivo', 'carne de chivo'],
            forbidden: ['pollo', 'carne de res', 'res', 'vaca', 'ternera'],
            message: 'El Seco de Chivo debe contener carne de chivo, no otros tipos de carne'
        },
        'ceviche': {
            required: ['pescado', 'limón'],
            forbidden: ['carne de res', 'pollo', 'cerdo', 'chivo'],
            message: 'El Ceviche debe contener pescado y limón, no carnes rojas'
        },
        'encebollado': {
            required: ['atún', 'yuca'],
            forbidden: ['carne de res', 'pollo', 'cerdo', 'chivo'],
            message: 'El Encebollado debe contener atún y yuca, no carnes rojas'
        },
        'hornado': {
            required: ['cerdo', 'carne de cerdo'],
            forbidden: ['pollo', 'carne de res', 'res', 'vaca', 'ternera', 'chivo'],
            message: 'El Hornado debe contener carne de cerdo, no otros tipos de carne'
        },
        'fritada': {
            required: ['cerdo', 'carne de cerdo'],
            forbidden: ['pollo', 'carne de res', 'res', 'vaca', 'ternera', 'chivo'],
            message: 'La Fritada debe contener carne de cerdo, no otros tipos de carne'
        },
        'hamburguesa': {
            required: ['carne', 'pan'],
            forbidden: ['pescado', 'atún', 'arroz', 'frijoles', 'lentejas'],
            message: 'La Hamburguesa debe contener carne y pan, no ingredientes como arroz, frijoles o pescado'
        },
        'pizza': {
            required: ['harina', 'queso'],
            forbidden: ['pescado', 'atún'],
            message: 'La Pizza debe contener harina y queso, no pescado'
        },
        'café': {
            required: ['café'],
            forbidden: ['carne', 'pescado', 'pollo', 'cerdo'],
            message: 'El Café debe contener café, no carnes'
        },
        'jugo': {
            required: ['fruta', 'naranja', 'limón'],
            forbidden: ['carne', 'pescado', 'pollo', 'cerdo'],
            message: 'El Jugo debe contener frutas, no carnes'
        },
        'tacos': {
            required: ['carne', 'tortilla'],
            forbidden: ['pescado', 'atún'],
            message: 'Los Tacos deben contener carne y tortilla, no pescado'
        },
        'burrito': {
            required: ['carne', 'tortilla'],
            forbidden: ['pescado', 'atún'],
            message: 'El Burrito debe contener carne y tortilla, no pescado'
        },
        'sandwich': {
            required: ['pan'],
            forbidden: ['pescado', 'atún'],
            message: 'El Sandwich debe contener pan, no pescado'
        },
        'ensalada': {
            required: ['lechuga', 'tomate'],
            forbidden: [],
            message: 'La Ensalada debe contener vegetales'
        }
    };
    
    // Buscar regla de validación para el plato
    for (const [dishKey, rule] of Object.entries(validationRules)) {
        if (normalizedDishName.includes(dishKey)) {
            console.log(`Validando plato: ${dishKey} con ingredientes:`, ingredientNames);
            
            // Verificar ingredientes requeridos
            const hasRequired = rule.required.some(req => 
                ingredientNames.some(ing => ing.includes(req))
            );
            
            // Verificar ingredientes prohibidos
            const hasForbidden = rule.forbidden.some(forb => 
                ingredientNames.some(ing => ing.includes(forb))
            );
            
            console.log(`Ingredientes requeridos encontrados: ${hasRequired}`);
            console.log(`Ingredientes prohibidos encontrados: ${hasForbidden}`);
            
            if (!hasRequired) {
                return {
                    isConsistent: false,
                    message: `Faltan ingredientes requeridos: ${rule.required.join(', ')}`
                };
            }
            
            if (hasForbidden) {
                const forbiddenFound = rule.forbidden.filter(forb => 
                    ingredientNames.some(ing => ing.includes(forb))
                );
                return {
                    isConsistent: false,
                    message: `${rule.message} (Ingredientes inapropiados encontrados: ${forbiddenFound.join(', ')})`
                };
            }
            
            return { isConsistent: true, message: 'Consistente' };
        }
    }
    
    // Si no hay regla específica, validación básica
    if (normalizedDishName.includes('pollo') && ingredientNames.some(ing => ing.includes('carne de res'))) {
        return {
            isConsistent: false,
            message: 'Un plato de pollo no debe contener carne de res'
        };
    }
    
    if (normalizedDishName.includes('pescado') && ingredientNames.some(ing => ing.includes('carne de res'))) {
        return {
            isConsistent: false,
            message: 'Un plato de pescado no debe contener carne de res'
        };
    }
    
    return { isConsistent: true, message: 'Consistente' };
}

function validatePricing() {
    const priceInputs = document.querySelectorAll('.price-input');
    let hasValidPrice = false;
    let hasEmptyFields = false;
    
    priceInputs.forEach(input => {
        const price = parseFloat(input.value) || 0;
        const fieldValue = input.value.trim();
        
        if (fieldValue !== '') {
            if (price > 0) {
                hasValidPrice = true;
            }
        } else {
            hasEmptyFields = true;
        }
    });
    
    // Solo mostrar error si no hay campos vacíos y no hay precios válidos
    if (!hasEmptyFields && !hasValidPrice) {
        alert('Por favor ingresa al menos un precio de venta.');
        return false;
    }
    
    return true;
}

// Sistema de persistencia
function saveToStorage() {
    try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(businessData));
        console.log('Datos guardados:', businessData);
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
            console.log('Datos cargados:', businessData);
            return true;
        }
    } catch (error) {
        console.error('Error al cargar datos:', error);
    }
    return false;
}

function clearStorage() {
    sessionStorage.removeItem(STORAGE_KEY);
    businessData = {
        configuracion: {},
        inversion: {},
        costosFijos: {},
        costosVariables: {},
        precios: {},
        proyecciones: {}
    };
}

// Configurar eventos de formularios
function setupFormEvents() {
    // Selección de tipo de negocio
    const businessOptions = document.querySelectorAll('.business-option');
    businessOptions.forEach(option => {
        option.addEventListener('click', function() {
            businessOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            businessData.configuracion.tipoNegocio = this.dataset.type;
            saveToStorage();
            generateStepSummaries(); // Actualizar resúmenes
        });
    });
    
    // Selección de tamaño
    const sizeOptions = document.querySelectorAll('.size-option');
    sizeOptions.forEach(option => {
        option.addEventListener('click', function() {
            sizeOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            businessData.configuracion.categoriaTamaño = this.dataset.size;
            saveToStorage();
            generateStepSummaries(); // Actualizar resúmenes
        });
    });
    
    // Eventos específicos para inputs de inversión
    setupInvestmentEvents();
    
    // Eventos específicos para inputs de costos fijos
    setupFixedCostsEvents();
    
    // Eventos específicos para inputs de costos variables
    setupVariableCostsEvents();
    
    // Eventos para ingredientes de productos
    setupProductEvents();
    
    // Evento para validación de ubicación
    const locationInput = document.getElementById('location');
    if (locationInput) {
        locationInput.addEventListener('input', function() {
            businessData.configuracion.ubicacion = this.value;
            saveToStorage();
            generateStepSummaries();
            validateConfigurationInRealTime();
            
            // Mostrar información del análisis de ubicación
            if (this.value.trim()) {
                const analysis = analyzeLocationWithAI(this.value);
                showLocationAnalysis(analysis);
            } else {
                hideLocationAnalysis();
            }
        });
    }
    
    // Evento para switch de servicio a domicilio
    const servicioDomicilioSwitch = document.getElementById('servicioDomicilio');
    if (servicioDomicilioSwitch) {
        servicioDomicilioSwitch.addEventListener('change', function() {
            businessData.configuracion.servicioDomicilio = this.checked;
            saveToStorage();
            generateStepSummaries();
            console.log('Servicio a domicilio:', this.checked ? 'Activado' : 'Desactivado');
        });
    }
    
    // Eventos para otros campos del paso 1
    const businessNameInput = document.getElementById('businessName');
    if (businessNameInput) {
        businessNameInput.addEventListener('input', function() {
            businessData.configuracion.nombreNegocio = this.value;
            saveToStorage();
            generateStepSummaries();
        });
    }
    
    const sizeInput = document.getElementById('size');
    if (sizeInput) {
        sizeInput.addEventListener('input', function() {
            businessData.configuracion.tamaño = parseFloat(this.value) || 0;
            saveToStorage();
            generateStepSummaries();
        });
    }
    
    const capacityInput = document.getElementById('capacity');
    if (capacityInput) {
        capacityInput.addEventListener('input', function() {
            businessData.configuracion.capacidad = parseFloat(this.value) || 0;
            saveToStorage();
            generateStepSummaries();
        });
    }
    
    const descriptionInput = document.getElementById('description');
    if (descriptionInput) {
        descriptionInput.addEventListener('input', function() {
            businessData.configuracion.descripcion = this.value;
            saveToStorage();
            generateStepSummaries();
        });
    }
}

// Configurar eventos específicos para inversión
function setupInvestmentEvents() {
    // Eventos para inputs de gastos
    document.addEventListener('input', function(e) {
        if (e.target.classList.contains('expense-input')) {
            clearTimeout(window.expenseTimeout);
            window.expenseTimeout = setTimeout(() => {
                calculateTotalExpenses();
                updateBusinessDataFromForm();
                saveToStorage();
                generateStepSummaries();
            }, 300);
        }
    });
    
    // Eventos para inputs de financiamiento
    document.addEventListener('input', function(e) {
        if (e.target.classList.contains('funding-input')) {
            clearTimeout(window.fundingTimeout);
            window.fundingTimeout = setTimeout(() => {
                calculateTotalFunding();
                updateBusinessDataFromForm();
                saveToStorage();
                generateStepSummaries();
            }, 300);
        }
    });
    
    // Restaurar selecciones guardadas
    if (businessData.configuracion.tipoNegocio) {
        const businessOption = document.querySelector(`[data-type="${businessData.configuracion.tipoNegocio}"]`);
        if (businessOption) {
            businessOptions.forEach(opt => opt.classList.remove('selected'));
            businessOption.classList.add('selected');
        }
    }
    
    if (businessData.configuracion.categoriaTamaño) {
        const sizeOption = document.querySelector(`[data-size="${businessData.configuracion.categoriaTamaño}"]`);
        if (sizeOption) {
            sizeOptions.forEach(opt => opt.classList.remove('selected'));
            sizeOption.classList.add('selected');
        }
    }
    
    if (businessData.configuracion.ubicacion) {
        const locationInput = document.getElementById('location');
        if (locationInput) {
            locationInput.value = businessData.configuracion.ubicacion;
        }
    }
    
    // Restaurar switch de servicio a domicilio
    if (businessData.configuracion.servicioDomicilio !== undefined) {
        const servicioDomicilioSwitch = document.getElementById('servicioDomicilio');
        if (servicioDomicilioSwitch) {
            servicioDomicilioSwitch.checked = businessData.configuracion.servicioDomicilio;
        }
    }
    
    // Restaurar otros campos del paso 1
    if (businessData.configuracion.nombreNegocio) {
        const businessNameInput = document.getElementById('businessName');
        if (businessNameInput) {
            businessNameInput.value = businessData.configuracion.nombreNegocio;
        }
    }
    
    if (businessData.configuracion.tamaño) {
        const sizeInput = document.getElementById('size');
        if (sizeInput) {
            sizeInput.value = businessData.configuracion.tamaño;
        }
    }
    
    if (businessData.configuracion.capacidad) {
        const capacityInput = document.getElementById('capacity');
        if (capacityInput) {
            capacityInput.value = businessData.configuracion.capacidad;
        }
    }
    
    if (businessData.configuracion.descripcion) {
        const descriptionInput = document.getElementById('description');
        if (descriptionInput) {
            descriptionInput.value = businessData.configuracion.descripcion;
        }
    }
}

// Configurar eventos específicos para costos fijos
function setupFixedCostsEvents() {
    // Eventos para inputs de arriendo
    document.addEventListener('input', function(e) {
        if (e.target.classList.contains('fixed-cost-input')) {
            clearTimeout(window.fixedCostsTimeout);
            window.fixedCostsTimeout = setTimeout(() => {
                calculateTotalFixedCosts();
                updateBusinessDataFromForm();
                saveToStorage();
                generateStepSummaries();
            }, 300);
        }
    });
    
    // Eventos para personal (cantidad y sueldo)
    document.addEventListener('input', function(e) {
        if (e.target.classList.contains('staff-quantity-input') || e.target.classList.contains('staff-salary-input')) {
            clearTimeout(window.staffTimeout);
            window.staffTimeout = setTimeout(() => {
                calculateStaffTotals();
                calculateTotalFixedCosts();
                updateBusinessDataFromForm();
                saveToStorage();
                generateStepSummaries();
                
                // Validación IA en tiempo real para personal
                validateStaffInRealTime();
            }, 300);
        }
    });
    
    // Evento para servicios incluidos en arriendo
    const serviciosArriendo = document.getElementById('serviciosArriendo');
    if (serviciosArriendo) {
        serviciosArriendo.addEventListener('change', function() {
            updateServicesVisibility(this.value);
        });
        
        // Inicializar servicios según valor actual
        updateServicesVisibility(serviciosArriendo.value);
    }
    
    // Eventos para inputs de servicios
    document.addEventListener('input', function(e) {
        if (e.target.classList.contains('service-input')) {
            clearTimeout(window.servicesTimeout);
            window.servicesTimeout = setTimeout(() => {
                calculateTotalServices();
                calculateTotalFixedCosts();
                updateBusinessDataFromForm();
                saveToStorage();
                generateStepSummaries();
            }, 300);
        }
    });
    
    // Eventos para otros costos
    document.addEventListener('input', function(e) {
        if (e.target.classList.contains('other-cost-input')) {
            clearTimeout(window.otherCostsTimeout);
            window.otherCostsTimeout = setTimeout(() => {
                calculateTotalFixedCosts();
                updateBusinessDataFromForm();
                saveToStorage();
                generateStepSummaries();
            }, 300);
        }
    });
}

// Configurar eventos específicos para costos variables
function setupVariableCostsEvents() {
    // Eventos para nombres de productos
    document.addEventListener('input', function(e) {
        if (e.target.classList.contains('product-name')) {
            clearTimeout(window.productNameTimeout);
            window.productNameTimeout = setTimeout(() => {
                updateProductsData();
                updateBusinessDataFromForm();
                saveToStorage();
                generateStepSummaries();
            }, 300);
        }
    });
    
    // Eventos para tipos de productos
    document.addEventListener('change', function(e) {
        if (e.target.classList.contains('product-type')) {
            updateProductsData();
            updateBusinessDataFromForm();
            saveToStorage();
            generateStepSummaries();
        }
    });
    
    // Eventos para nombres de ingredientes
    document.addEventListener('input', function(e) {
        if (e.target.classList.contains('ingredient-name')) {
            clearTimeout(window.ingredientNameTimeout);
            window.ingredientNameTimeout = setTimeout(() => {
                const productId = e.target.dataset.product;
                if (productId) {
                    updateProductTotalCost(productId);
                    updateProductsData();
                    updateBusinessDataFromForm();
                    saveToStorage();
                    generateStepSummaries();
                }
            }, 300);
        }
    });
    
    // Eventos para cantidades de ingredientes
    document.addEventListener('input', function(e) {
        if (e.target.classList.contains('ingredient-quantity')) {
            clearTimeout(window.ingredientQuantityTimeout);
            window.ingredientQuantityTimeout = setTimeout(() => {
                const productId = e.target.dataset.product;
                if (productId) {
                    updateProductTotalCost(productId);
                    updateProductsData();
                    updateBusinessDataFromForm();
                    saveToStorage();
                    generateStepSummaries();
                }
            }, 300);
        }
    });
    
    // Eventos para unidades de ingredientes
    document.addEventListener('change', function(e) {
        if (e.target.classList.contains('ingredient-unit')) {
            const productId = e.target.dataset.product;
            if (productId) {
                updateProductTotalCost(productId);
                updateProductsData();
                updateBusinessDataFromForm();
                saveToStorage();
                generateStepSummaries();
            }
        }
    });
    
    // Eventos para precios de ingredientes
    document.addEventListener('input', function(e) {
        if (e.target.classList.contains('ingredient-price')) {
            const productId = e.target.dataset.product;
            if (productId) {
                clearTimeout(window.ingredientPriceTimeout);
                window.ingredientPriceTimeout = setTimeout(() => {
                    updateProductTotalCost(productId);
                    updateProductsData();
                    updateBusinessDataFromForm();
                    saveToStorage();
                    generateStepSummaries();
                }, 300);
            }
        }
    });
    
    // Eventos para unidades de compra
    document.addEventListener('change', function(e) {
        if (e.target.classList.contains('ingredient-purchase-unit')) {
            const productId = e.target.dataset.product;
            if (productId) {
                updateProductsData();
                updateBusinessDataFromForm();
                saveToStorage();
                generateStepSummaries();
            }
        }
    });
}

// Configurar eventos para productos
function setupProductEvents() {
    // Eventos para precios de ingredientes
    document.addEventListener('input', function(e) {
        if (e.target.classList.contains('ingredient-price')) {
            const productId = e.target.dataset.product;
            if (productId) {
                clearTimeout(window.productTimeout);
                window.productTimeout = setTimeout(() => {
                    updateProductTotalCost(productId);
                    updateBusinessDataFromForm();
                    saveToStorage();
                    generateStepSummaries();
                }, 300);
            }
        }
    });
}

// Configurar guardado automático y validaciones en tiempo real
function setupAutoSave() {
    // Validar en tiempo real al escribir
    document.addEventListener('input', function(e) {
        if (e.target.matches('input[type="number"], input[type="text"], textarea, select')) {
            clearTimeout(window.autoSaveTimeout);
            window.autoSaveTimeout = setTimeout(() => {
                updateBusinessDataFromForm();
                saveToStorage();
                validateFieldInRealTime(e.target);
                validateCurrentStepInRealTime();
                generateStepSummaries(); // Actualizar resúmenes
            }, 300);
        }
    });
    
    // Validar cuando se pierde el foco
    document.addEventListener('blur', function(e) {
        if (e.target.matches('input[type="number"], input[type="text"], textarea, select')) {
            updateBusinessDataFromForm();
            saveToStorage();
            validateFieldInRealTime(e.target);
            validateCurrentStepInRealTime();
            generateStepSummaries(); // Actualizar resúmenes
        }
    }, true);
    
    // Validar cuando se cambia un select
    document.addEventListener('change', function(e) {
        if (e.target.matches('select')) {
            updateBusinessDataFromForm();
            saveToStorage();
            validateFieldInRealTime(e.target);
            validateCurrentStepInRealTime();
            generateStepSummaries(); // Actualizar resúmenes
        }
    });
    
    // Validar selecciones de tipo de negocio y tamaño
    document.addEventListener('click', function(e) {
        if (e.target.closest('.business-option, .size-option')) {
            setTimeout(() => {
                validateConfigurationInRealTime();
            }, 100);
        }
    });
    
    // Limpiar errores cuando el usuario empiece a escribir en campos de precio
    document.addEventListener('input', function(e) {
        if (e.target.classList.contains('price-input')) {
            const fieldValue = e.target.value.trim();
            if (fieldValue === '') {
                // Si el campo está vacío, remover errores
                removeFieldError(e.target);
            }
            
            // Guardar el precio inmediatamente
            const productId = e.target.dataset.product;
            if (productId) {
                if (!businessData.precios.productos) {
                    businessData.precios.productos = {};
                }
                businessData.precios.productos[productId] = parseFloat(e.target.value) || 0;
                console.log(`Precio guardado para producto ${productId}: $${businessData.precios.productos[productId]}`);
                saveToStorage();
            }
        }
    });
}

// Validación en tiempo real para campos individuales
function validateFieldInRealTime(field) {
    const fieldId = field.id;
    const fieldValue = field.value.trim();
    const fieldType = field.type;
    const fieldClass = field.className;
    const fieldName = field.name;
    
    // Remover mensajes de error existentes
    removeFieldError(field);
    
    // Validaciones específicas por campo
    if (fieldType === 'number') {
        const numValue = parseFloat(fieldValue) || 0;
        
        // Validar que no sea negativo
        if (numValue < 0) {
            showFieldError(field, 'El valor no puede ser negativo');
            return false;
        }
        
        // Validar campos obligatorios específicos
        if (fieldId === 'arriendo' && numValue === 0) {
            showFieldError(field, 'El arriendo es obligatorio');
            return false;
        }
        
        // Validar gastos de inversión
        if (fieldClass.includes('expense-input') && numValue === 0) {
            showFieldError(field, 'Este campo es obligatorio');
            return false;
        }
        
        // Validar financiamiento
        if (fieldClass.includes('funding-input') && numValue === 0) {
            showFieldError(field, 'Este campo es obligatorio');
            return false;
        }
        
        // Validar costos fijos
        if (fieldClass.includes('fixed-cost-input') && numValue === 0) {
            showFieldError(field, 'Este campo es obligatorio');
            return false;
        }
        
        // Validar staff
        if (fieldClass.includes('staff-input') && numValue === 0) {
            showFieldError(field, 'Este campo es obligatorio');
            return false;
        }
        
        // Validar servicios
        if (fieldClass.includes('service-input') && numValue === 0) {
            showFieldError(field, 'Este campo es obligatorio');
            return false;
        }
    }
    
    // Validar campos de texto obligatorios
    if (fieldType === 'text') {
        if (fieldClass.includes('product-name') && fieldValue === '') {
            showFieldError(field, 'El nombre del producto es obligatorio');
            return false;
        }
        
        // Validar otros campos de texto obligatorios
        if ((fieldId === 'businessName' || fieldId === 'location' || fieldName === 'businessName' || fieldName === 'location') && fieldValue === '') {
            showFieldError(field, 'Este campo es obligatorio');
            return false;
        }
        
        // Validar longitud mínima para nombres de productos
        if (fieldClass.includes('product-name') && fieldValue.length > 0 && fieldValue.length < 2) {
            showFieldError(field, 'El nombre del producto debe tener al menos 2 caracteres');
            return false;
        }
    }
    
    // Validar precios de venta
    if (fieldClass.includes('price-input')) {
        const price = parseFloat(fieldValue) || 0;
        // Solo mostrar error si el campo no está vacío y el valor es 0 o negativo
        if (fieldValue !== '' && price <= 0) {
            showFieldError(field, 'El precio de venta debe ser mayor a 0');
            return false;
        } else if (fieldValue !== '' && price > 0) {
            // Si el precio es válido, remover cualquier error existente
            removeFieldError(field);
        }
    }
    
    return true;
}

// Validación en tiempo real para configuración
function validateConfigurationInRealTime() {
    const businessSelected = document.querySelector('.business-option.selected');
    const sizeSelected = document.querySelector('.size-option.selected');
    const locationSelected = document.getElementById('location').value;
    
    // Remover mensajes de error existentes
    removeConfigurationErrors();
    
    let isValid = true;
    
    if (!businessSelected) {
        showConfigurationError('.business-options', 'Debes seleccionar un tipo de negocio');
        isValid = false;
    }
    
    if (!sizeSelected) {
        showConfigurationError('.size-options', 'Debes seleccionar un tamaño de negocio');
        isValid = false;
    }
    
    if (!locationSelected || locationSelected.trim() === '') {
        showConfigurationError('#location', 'Debes ingresar una ubicación en Pichincha');
        isValid = false;
    }
    
    return isValid;
}

// Mostrar error para un campo específico
function showFieldError(field, message) {
    // Remover error existente primero
    removeFieldError(field);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    
    // Insertar el error después del campo
    field.parentNode.insertBefore(errorDiv, field.nextSibling);
    field.classList.add('error');
    
    // Scroll suave al error si es necesario
    if (!isElementInViewport(field)) {
        field.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// Función auxiliar para verificar si un elemento está visible
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Remover error de un campo específico
function removeFieldError(field) {
    // Buscar el error en el contenedor padre
    const parent = field.parentNode;
    const existingError = parent.querySelector('.field-error');
    
    if (existingError) {
        existingError.remove();
    }
    
    // Remover la clase de error del campo
    field.classList.remove('error');
}

// Mostrar error para configuración
function showConfigurationError(selector, message) {
    const container = document.querySelector(selector);
    if (container) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'configuration-error';
        errorDiv.textContent = message;
        
        container.appendChild(errorDiv);
    }
}

// Remover errores de configuración
function removeConfigurationErrors() {
    document.querySelectorAll('.configuration-error').forEach(error => error.remove());
}

// Validación en tiempo real para inversión
function validateInvestmentInRealTime() {
    // Primero actualizar los datos del formulario
    updateBusinessDataFromForm();
    
    const expenseInputs = document.querySelectorAll('.expense-input');
    const fundingInputs = document.querySelectorAll('.funding-input');
    
    // Remover errores existentes
    removeStepErrors('inversion');
    
    let isValid = true;
    let totalExpenses = 0;
    let totalFunding = 0;
    let hasExpense = false;
    let hasFunding = false;
    
    // Validar gastos
    expenseInputs.forEach(input => {
        const value = parseFloat(input.value) || 0;
        totalExpenses += value;
        
        if (value < 0) {
            showFieldError(input, 'El valor no puede ser negativo');
            isValid = false;
        } else if (value > 0) {
            hasExpense = true;
        }
    });
    
    // Validar financiamiento
    fundingInputs.forEach(input => {
        const value = parseFloat(input.value) || 0;
        totalFunding += value;
        
        if (value < 0) {
            showFieldError(input, 'El valor no puede ser negativo');
            isValid = false;
        } else if (value > 0) {
            hasFunding = true;
        }
    });
    
    // Validar que haya al menos un gasto
    if (!hasExpense) {
        showStepError('inversion', 'Debes ingresar al menos un gasto de inversión');
        isValid = false;
    }
    
    // Validar que haya al menos una fuente de financiamiento
    if (!hasFunding) {
        showStepError('inversion', 'Debes ingresar al menos una fuente de financiamiento');
        isValid = false;
    }
    
    // Actualizar businessData con los totales calculados
    businessData.inversion.totalGastos = totalExpenses;
    businessData.inversion.totalFinanciamiento = totalFunding;
    
    return isValid;
}

// Validación en tiempo real para costos fijos
function validateFixedCostsInRealTime() {
    const arriendoInput = document.getElementById('arriendo');
    
    // Remover errores existentes
    removeStepErrors('costos-fijos');
    
    let isValid = true;
    
    // Validar arriendo
    if (arriendoInput) {
        const arriendo = parseFloat(arriendoInput.value) || 0;
        
        if (arriendo < 0) {
            showFieldError(arriendoInput, 'El arriendo no puede ser negativo');
            isValid = false;
        } else if (arriendo === 0) {
            showFieldError(arriendoInput, 'El arriendo es obligatorio');
            isValid = false;
        }
    }
    
    // Validar que al menos un rol de personal tenga datos
    const staffRoles = ['cocinero', 'meseros', 'caja', 'limpieza'];
    let hasValidStaff = false;
    
    staffRoles.forEach(role => {
        const quantityInput = document.querySelector(`[data-role="${role}"][data-type="quantity"]`);
        const salaryInput = document.querySelector(`[data-role="${role}"][data-type="salary"]`);
        
        if (quantityInput && salaryInput) {
            const quantity = parseInt(quantityInput.value) || 0;
            const salary = parseFloat(salaryInput.value) || 0;
            
            if (quantity > 0 && salary > 0) {
                hasValidStaff = true;
            }
        }
    });
    
    if (!hasValidStaff) {
        showStepError('costos-fijos', 'Debes ingresar al menos un rol de personal con cantidad y salario');
        isValid = false;
    }
    
    return isValid;
}

// Validación en tiempo real para costos variables
function validateVariableCostsInRealTime() {
    const productCards = document.querySelectorAll('.product-card');
    const addProductButton = document.querySelector('.btn-add-product');
    
    // Remover errores existentes
    removeStepErrors('costos-variables');
    
    let isValid = true;
    let hasValidProduct = false;
    
    // Si no hay productos, mostrar error
    if (productCards.length === 0) {
        if (addProductButton) {
            showStepError('costos-variables', 'Debes agregar al menos un producto');
        }
        return false;
    }
    
    productCards.forEach(card => {
        const productName = card.querySelector('.product-name');
        if (productName) {
            if (productName.value.trim() === '') {
                showFieldError(productName, 'El nombre del producto es obligatorio');
                isValid = false;
            } else {
                hasValidProduct = true;
            }
        }
    });
    
    if (!hasValidProduct) {
        showStepError('costos-variables', 'Debes ingresar al menos un producto con nombre');
        isValid = false;
    }
    
    return isValid;
}

// Validación en tiempo real para precios
function validatePricingInRealTime() {
    const priceInputs = document.querySelectorAll('.price-input');
    
    // Remover errores existentes
    removeStepErrors('precios');
    
    let isValid = true;
    let hasValidPrice = false;
    let hasEmptyFields = false;
    
    priceInputs.forEach(input => {
        const price = parseFloat(input.value) || 0;
        const fieldValue = input.value.trim();
        
        // Solo validar si el campo no está vacío
        if (fieldValue !== '') {
            if (price < 0) {
                showFieldError(input, 'El precio no puede ser negativo');
                isValid = false;
            } else if (price === 0) {
                showFieldError(input, 'El precio de venta debe ser mayor a 0');
                isValid = false;
            } else if (price > 0) {
                hasValidPrice = true;
            }
        } else {
            hasEmptyFields = true;
        }
    });
    
    // Solo mostrar error de paso si no hay campos vacíos y no hay precios válidos
    if (!hasEmptyFields && !hasValidPrice) {
        showStepError('precios', 'Debes ingresar al menos un precio de venta');
        isValid = false;
    }
    
    return isValid;
}

// Validación en tiempo real para el paso actual
function validateCurrentStepInRealTime() {
    switch (currentStep) {
        case 1:
            return validateConfigurationInRealTime();
        case 2:
            return validateInvestmentInRealTime();
        case 3:
            return validateFixedCostsInRealTime();
        case 4:
            return validateVariableCostsInRealTime();
        case 5:
            return validatePricingInRealTime();
        default:
            return true;
    }
}

// Mostrar error para un paso específico
function showStepError(stepId, message) {
    const stepElement = document.getElementById(`step${currentStep}`);
    if (stepElement) {
        // Remover errores existentes del paso
        const existingErrors = stepElement.querySelectorAll('.step-error');
        existingErrors.forEach(error => error.remove());
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'step-error';
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        
        // Insertar al final del paso
        stepElement.appendChild(errorDiv);
        
        // Scroll suave al error
        errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// Remover errores de un paso específico
function removeStepErrors(stepId) {
    document.querySelectorAll('.step-error').forEach(error => error.remove());
}

// Actualizar businessData desde formularios
function updateBusinessDataFromForm() {
    // Actualizar configuración
    const businessType = document.querySelector('.business-option.selected');
    const sizeType = document.querySelector('.size-option.selected');
    const locationInput = document.getElementById('location');
    const businessName = document.getElementById('businessName');
    const size = document.getElementById('size');
    const capacity = document.getElementById('capacity');
    const description = document.getElementById('description');
    
    if (businessType) {
        businessData.configuracion.tipoNegocio = businessType.dataset.type;
    }
    if (sizeType) {
        businessData.configuracion.categoriaTamaño = sizeType.dataset.size;
    }
    if (locationInput) {
        businessData.configuracion.ubicacion = locationInput.value;
    }
    if (businessName) {
        businessData.configuracion.nombreNegocio = businessName.value;
    }
    if (size) {
        businessData.configuracion.metrosCuadrados = parseFloat(size.value) || 0;
    }
    if (capacity) {
        businessData.configuracion.capacidad = parseInt(capacity.value) || 0;
    }
    if (description) {
        businessData.configuracion.descripcion = description.value;
    }
    
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
    
    // Actualizar financiamiento
    const fundingInputs = document.querySelectorAll('.funding-input');
    if (fundingInputs.length > 0) {
        if (!businessData.inversion.financiamiento) businessData.inversion.financiamiento = {};
        fundingInputs.forEach(input => {
            const key = input.dataset.category;
            if (key) {
                businessData.inversion.financiamiento[key] = parseFloat(input.value) || 0;
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
    
    // Actualizar staff con cantidad y sueldo
    const staffRoles = ['cocinero', 'meseros', 'caja', 'limpieza'];
    if (!businessData.costosFijos.staff) businessData.costosFijos.staff = {};
    
    staffRoles.forEach(role => {
        const quantityInput = document.querySelector(`[data-role="${role}"][data-type="quantity"]`);
        const salaryInput = document.querySelector(`[data-role="${role}"][data-type="salary"]`);
        
        if (quantityInput && salaryInput) {
            const quantity = parseInt(quantityInput.value) || 0;
            const salary = parseFloat(salaryInput.value) || 0;
            const total = quantity * salary;
            
            businessData.costosFijos.staff[role] = {
                cantidad: quantity,
                sueldoPorPersona: salary,
                total: total
            };
        }
    });
    
    // Actualizar servicios
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
    
    // Actualizar productos
    updateProductsData();
}

// Función para actualizar datos de productos
function updateProductsData() {
    try {
        console.log('Actualizando datos de productos...');
        if (!businessData.costosVariables.productos) businessData.costosVariables.productos = [];
        
        const productCards = document.querySelectorAll('.product-card');
        console.log(`Encontrados ${productCards.length} productos`);
        const products = [];
        let totalCosto = 0;
        let totalIngredientes = 0;
        
        productCards.forEach((card, index) => {
            const productId = index + 1;
            const nameInput = card.querySelector('.product-name');
            const typeSelect = card.querySelector('.product-type');
            const ingredients = [];
            
            // Obtener ingredientes del producto
            const ingredientItems = card.querySelectorAll('.ingredient-item');
            console.log(`Producto ${productId}: ${ingredientItems.length} ingredientes`);
            
            ingredientItems.forEach((item, ingIndex) => {
                const nameInput = item.querySelector('.ingredient-name');
                const quantityInput = item.querySelector('.ingredient-quantity');
                const unitSelect = item.querySelector('.ingredient-unit');
                const priceInput = item.querySelector('.ingredient-price');
                const purchaseUnitInput = item.querySelector('.ingredient-purchase-unit');
                
                if (nameInput && nameInput.value.trim()) {
                    const ingredient = {
                        id: ingIndex + 1,
                        nombre: nameInput.value.trim(),
                        cantidad: parseFloat(quantityInput?.value) || 0,
                        unidad: unitSelect?.value || 'g',
                        precioCompra: parseFloat(priceInput?.value) || 0,
                        unidadCompra: purchaseUnitInput?.value || ''
                    };
                    ingredients.push(ingredient);
                    totalIngredientes++;
                    console.log(`Ingrediente: ${ingredient.nombre}, Precio: $${ingredient.precioCompra.toFixed(2)}`);
                }
            });
            
            // Crear producto incluso si no tiene nombre, pero tiene ingredientes
            const productName = nameInput && nameInput.value.trim() ? nameInput.value.trim() : `Producto ${productId}`;
            const hasIngredients = ingredients.length > 0;
            
            if (hasIngredients) {
                const product = {
                    id: productId,
                    nombre: productName,
                    tipo: typeSelect?.value || 'comida',
                    ingredientes: ingredients,
                    costoTotal: calculateProductCost(ingredients)
                };
                products.push(product);
                
                // Calcular costo total del producto
                const productCost = product.costoTotal;
                totalCosto += productCost;
                console.log(`Producto: ${product.nombre}, Costo: $${productCost.toFixed(2)}`);
            }
        });
        
        businessData.costosVariables.productos = products;
        businessData.costosVariables.totalCosto = totalCosto;
        businessData.costosVariables.totalIngredientes = totalIngredientes;
        
        console.log(`Total productos: ${products.length}, Total ingredientes: ${totalIngredientes}, Total costo: $${totalCosto.toFixed(2)}`);
        console.log('Datos de productos actualizados');
        
        // Actualizar el resumen de productos en el DOM
        updateProductsSummary();
        
    } catch (error) {
        console.error('Error actualizando datos de productos:', error);
    }
}

// Función para calcular costo de un producto
function calculateProductCost(ingredients) {
    try {
        let totalCost = 0;
        ingredients.forEach(ingredient => {
            totalCost += ingredient.precioCompra || 0;
        });
        console.log(`Costo calculado del producto: $${totalCost.toFixed(2)}`);
        return totalCost;
    } catch (error) {
        console.error('Error calculando costo del producto:', error);
        return 0;
    }
}

// Función para actualizar el costo total de un producto en el DOM
function updateProductTotalCost(productId) {
    try {
        console.log(`Actualizando costo total del producto ${productId}...`);
        const productCard = document.getElementById(`producto${productId}`);
        if (!productCard) {
            console.error(`No se encontró el producto ${productId}`);
            return;
        }
        
        const ingredients = productCard.querySelectorAll('.ingredient-item');
        let totalCost = 0;
        
        ingredients.forEach(ingredient => {
            const priceInput = ingredient.querySelector('.ingredient-price');
            if (priceInput) {
                const price = parseFloat(priceInput.value) || 0;
                totalCost += price;
                console.log(`Precio ingrediente: $${price.toFixed(2)}`);
            }
        });
        
        const totalElement = document.getElementById(`productTotal${productId}`);
        if (totalElement) {
            totalElement.textContent = `$${totalCost.toFixed(2)}`;
            console.log(`Costo total actualizado: $${totalCost.toFixed(2)}`);
        } else {
            console.error(`No se encontró el elemento productTotal${productId}`);
        }
        
        // Actualizar también el elemento costoTotal si existe
        const costoTotalElement = document.getElementById(`costoTotal${productId}`);
        if (costoTotalElement) {
            costoTotalElement.textContent = `$${totalCost.toFixed(2)}`;
        }
        
        console.log(`Costo total del producto ${productId} actualizado`);
    } catch (error) {
        console.error(`Error actualizando costo total del producto ${productId}:`, error);
    }
}

// Función para actualizar el resumen de productos en el DOM
function updateProductsSummary() {
    try {
        console.log('Actualizando resumen de productos...');
        
        const totalProductosElement = document.getElementById('totalProductos');
        const costoPromedioElement = document.getElementById('costoPromedio');
        const productoMayorCostoElement = document.getElementById('productoMayorCosto');
        
        const productos = businessData.costosVariables.productos || [];
        const totalCosto = businessData.costosVariables.totalCosto || 0;
        
        // Actualizar total de productos
        if (totalProductosElement) {
            totalProductosElement.textContent = productos.length;
            console.log(`Total productos actualizado: ${productos.length}`);
        } else {
            console.error('No se encontró el elemento totalProductos');
        }
        
        // Calcular y actualizar costo promedio
        if (costoPromedioElement) {
            const costoPromedio = productos.length > 0 ? totalCosto / productos.length : 0;
            costoPromedioElement.textContent = `$${costoPromedio.toFixed(2)}`;
            console.log(`Costo promedio actualizado: $${costoPromedio.toFixed(2)}`);
        } else {
            console.error('No se encontró el elemento costoPromedio');
        }
        
        // Encontrar y actualizar producto de mayor costo
        if (productoMayorCostoElement) {
            if (productos.length > 0) {
                const productoMayorCosto = productos.reduce((max, producto) => 
                    producto.costoTotal > max.costoTotal ? producto : max
                );
                productoMayorCostoElement.textContent = productoMayorCosto.nombre;
                console.log(`Producto mayor costo actualizado: ${productoMayorCosto.nombre}`);
            } else {
                productoMayorCostoElement.textContent = '-';
                console.log('No hay productos para mostrar mayor costo');
            }
        } else {
            console.error('No se encontró el elemento productoMayorCosto');
        }
        
        console.log('Resumen de productos actualizado');
    } catch (error) {
        console.error('Error actualizando resumen de productos:', error);
    }
}

// ===== SISTEMA DE VALIDACIÓN CON IA =====

// Función principal de IA para análisis de datos
function analyzeDataWithAI(data, context) {
    try {
        console.log('Analizando datos con IA...', context);
        
        const analysis = {
            isValid: true,
            warnings: [],
            suggestions: [],
            estimatedValues: {}
        };
        
        // Obtener contexto del paso 1 para validaciones más precisas
        const contextData = getBusinessContext();
        console.log('Contexto del negocio:', contextData);
        
        // Análisis específico según el contexto
        switch (context) {
            case 'investment':
                return analyzeInvestmentData(data, contextData);
            case 'fixedCosts':
                return analyzeFixedCostsData(data, contextData);
            case 'variableCosts':
                return analyzeVariableCostsData(data, contextData);
            case 'pricing':
                return analyzePricingData(data, contextData);
            default:
                return analysis;
        }
    } catch (error) {
        console.error('Error en análisis de IA:', error);
        return { isValid: true, warnings: [], suggestions: [], estimatedValues: {} };
    }
}

// Función para obtener el contexto del negocio del paso 1
function getBusinessContext() {
    const config = businessData.configuracion || {};
    
    // Analizar la ubicación con IA si existe
    let ubicacionAnalizada = 'centro_quito';
    let multiplier = 1.0;
    let confidence = 0;
    let description = '';
    
    if (config.ubicacion) {
        const analysis = analyzeLocationWithAI(config.ubicacion);
        ubicacionAnalizada = analysis.location;
        multiplier = analysis.multiplier;
        confidence = analysis.confidence;
        description = analysis.description;
    }
    
    return {
        tipoNegocio: config.tipoNegocio || 'restaurante',
        ubicacion: ubicacionAnalizada,
        ubicacionOriginal: config.ubicacion || '',
        multiplier: multiplier,
        confidence: confidence,
        description: description,
        metrosCuadrados: parseFloat(config.metrosCuadrados) || 80,
        capacidad: parseInt(config.capacidad) || 30,
        categoriaTamaño: config.categoriaTamaño || 'mediano'
    };
}

// Función de IA para analizar la ubicación escrita por el usuario
function analyzeLocationWithAI(userLocation) {
    console.log('Analizando ubicación con IA:', userLocation);
    
    if (!userLocation || userLocation.trim() === '') {
        return {
            matchedLocation: 'centro_quito',
            confidence: 0,
            multiplier: 1.0,
            description: 'Ubicación no especificada, usando valores por defecto'
        };
    }
    
    const locationText = userLocation.toLowerCase().trim();
    
    // Mapeo de palabras clave a ubicaciones específicas
    const locationMappings = {
        // Quito - Zonas Principales
        'centro': { location: 'centro_quito', multiplier: 1.8, keywords: ['centro', 'histórico', 'quito centro', 'plaza grande', 'independencia'] },
        'mariscal': { location: 'mariscal', multiplier: 1.6, keywords: ['mariscal', 'foch', 'la mariscal', 'zona rosa antigua'] },
        'zona rosa': { location: 'zona_rosa', multiplier: 1.7, keywords: ['zona rosa', 'gonzález suárez', 'gonzalez suarez', 'rosa'] },
        'financiera': { location: 'zona_financiera', multiplier: 1.9, keywords: ['financiera', 'amazonas', 'zona financiera', 'banco'] },
        'floresta': { location: 'floresta', multiplier: 1.5, keywords: ['floresta', 'la floresta'] },
        'bellavista': { location: 'bellavista', multiplier: 1.3, keywords: ['bellavista', 'bella vista'] },
        'innaquito': { location: 'innaquito', multiplier: 1.4, keywords: ['innaquito', 'inna quito'] },
        
        // Quito - Valles
        'cumbaya': { location: 'cumbaya', multiplier: 1.4, keywords: ['cumbaya', 'cumbayá', 'valle'] },
        'tumbaco': { location: 'tumbaco', multiplier: 1.2, keywords: ['tumbaco'] },
        'valle de los chillos': { location: 'valle_chorlavi', multiplier: 1.1, keywords: ['valle de los chillos', 'chillos', 'valle chillos'] },
        'puembo': { location: 'puembo', multiplier: 1.2, keywords: ['puembo'] },
        'sangolqui': { location: 'sangolqui', multiplier: 1.1, keywords: ['sangolqui', 'sangolquí'] },
        
        // Quito - Zonas Norte
        'calderon': { location: 'calderon', multiplier: 0.9, keywords: ['calderon', 'calderón'] },
        'carapungo': { location: 'carapungo', multiplier: 0.8, keywords: ['carapungo'] },
        'conocoto': { location: 'conocoto', multiplier: 1.0, keywords: ['conocoto'] },
        'nayon': { location: 'nayon', multiplier: 1.0, keywords: ['nayon', 'nayón'] },
        'rumipamba': { location: 'rumipamba', multiplier: 1.1, keywords: ['rumipamba'] },
        
        // Quito - Zonas Especiales
        'mitad del mundo': { location: 'mitad_mundo', multiplier: 1.3, keywords: ['mitad del mundo', 'mitad mundo', 'monumento'] },
        'san antonio': { location: 'san_antonio', multiplier: 1.2, keywords: ['san antonio', 'san antonio pichincha'] },
        'aeropuerto': { location: 'aeropuerto', multiplier: 1.0, keywords: ['aeropuerto', 'tababela', 'mariscal sucre'] },
        'terminal': { location: 'terminal_terrestre', multiplier: 0.9, keywords: ['terminal', 'terminal terrestre', 'quitumbe', 'carcelén'] },
        
        // Zonas Comerciales
        'centro comercial': { location: 'centro_comercial', multiplier: 1.6, keywords: ['centro comercial', 'mall', 'plaza', 'comercial'] },
        'comercial alto': { location: 'comercial_intenso', multiplier: 1.7, keywords: ['comercial alto', 'alto comercio', 'zona comercial alta'] },
        'comercial medio': { location: 'comercial_medio', multiplier: 1.3, keywords: ['comercial medio', 'medio comercio', 'zona comercial media'] },
        'comercial bajo': { location: 'comercial_bajo', multiplier: 0.9, keywords: ['comercial bajo', 'bajo comercio', 'zona comercial baja'] },
        
        // Zonas Residenciales
        'residencial alto': { location: 'residencial_alto', multiplier: 1.3, keywords: ['residencial alto', 'zona alta', 'barrio alto', 'sector alto'] },
        'residencial medio': { location: 'residencial_medio', multiplier: 1.0, keywords: ['residencial medio', 'zona media', 'barrio medio', 'sector medio'] },
        'residencial bajo': { location: 'residencial_bajo', multiplier: 0.8, keywords: ['residencial bajo', 'zona baja', 'barrio bajo', 'sector bajo'] },
        
        // Zonas por Tipo
        'universidad': { location: 'universidad', multiplier: 1.2, keywords: ['universidad', 'universitario', 'campus', 'espol', 'uce', 'usfq'] },
        'hospital': { location: 'hospital', multiplier: 1.1, keywords: ['hospital', 'clínica', 'médico', 'salud'] },
        'parque': { location: 'parque', multiplier: 1.0, keywords: ['parque', 'parqueadero', 'área verde', 'area verde'] },
        'avenida': { location: 'avenida_principal', multiplier: 1.4, keywords: ['avenida', 'av.', 'principal', '6 de diciembre', 'amazonas', 'naciones unidas'] },
        'calle': { location: 'calle_secundaria', multiplier: 1.0, keywords: ['calle', 'secundaria', 'pequeña', 'pequena'] },
        
        // Otros Cantones
        'pomasqui': { location: 'pomasqui', multiplier: 0.8, keywords: ['pomasqui', 'pomasquí'] },
        'tababela': { location: 'tababela', multiplier: 0.9, keywords: ['tababela'] },
        'yaruqui': { location: 'yaruqui', multiplier: 0.8, keywords: ['yaruqui', 'yaruquí'] },
        'guayllabamba': { location: 'guayllabamba', multiplier: 0.7, keywords: ['guayllabamba'] },
        'industrial': { location: 'industrial', multiplier: 0.7, keywords: ['industrial', 'zona industrial', 'parque industrial'] },
        'rural': { location: 'rural', multiplier: 0.6, keywords: ['rural', 'campo', 'pueblo', 'comunidad'] }
    };
    
    // Buscar coincidencias
    let bestMatch = {
        location: 'centro_quito',
        multiplier: 1.0,
        confidence: 0,
        description: 'Ubicación no reconocida, usando valores por defecto'
    };
    
    // Buscar coincidencias exactas primero
    for (const [key, mapping] of Object.entries(locationMappings)) {
        if (locationText.includes(key)) {
            bestMatch = {
                location: mapping.location,
                multiplier: mapping.multiplier,
                confidence: 0.9,
                description: `Coincidencia exacta: ${key}`
            };
            break;
        }
    }
    
    // Si no hay coincidencia exacta, buscar por palabras clave
    if (bestMatch.confidence === 0) {
        for (const [key, mapping] of Object.entries(locationMappings)) {
            for (const keyword of mapping.keywords) {
                if (locationText.includes(keyword)) {
                    bestMatch = {
                        location: mapping.location,
                        multiplier: mapping.multiplier,
                        confidence: 0.7,
                        description: `Coincidencia por palabra clave: "${keyword}"`
                    };
                    break;
                }
            }
            if (bestMatch.confidence > 0) break;
        }
    }
    
    // Si aún no hay coincidencia, intentar análisis semántico
    if (bestMatch.confidence === 0) {
        // Análisis por contexto
        if (locationText.includes('quito') || locationText.includes('capital')) {
            bestMatch = {
                location: 'centro_quito',
                multiplier: 1.8,
                confidence: 0.5,
                description: 'Ubicación en Quito detectada, usando valores del centro'
            };
        } else if (locationText.includes('valle') || locationText.includes('cumbaya') || locationText.includes('tumbaco')) {
            bestMatch = {
                location: 'cumbaya',
                multiplier: 1.4,
                confidence: 0.5,
                description: 'Ubicación en valle detectada, usando valores de Cumbayá'
            };
        } else if (locationText.includes('norte') || locationText.includes('calderon') || locationText.includes('carapungo')) {
            bestMatch = {
                location: 'calderon',
                multiplier: 0.9,
                confidence: 0.5,
                description: 'Ubicación en zona norte detectada, usando valores de Calderón'
            };
        }
    }
    
    console.log('Resultado del análisis de ubicación:', bestMatch);
    return bestMatch;
}

// Función para mostrar el análisis de ubicación
function showLocationAnalysis(analysis) {
    // Remover análisis anterior
    hideLocationAnalysis();
    
    const locationInput = document.getElementById('location');
    if (!locationInput) return;
    
    const analysisDiv = document.createElement('div');
    analysisDiv.className = 'location-analysis';
    analysisDiv.innerHTML = `
        <div class="analysis-content">
            <i class="fas fa-map-marker-alt"></i>
            <div class="analysis-info">
                <strong>Análisis de IA:</strong> ${analysis.description}
                <br>
                <small>Confianza: ${Math.round(analysis.confidence * 100)}% | Multiplicador: ${analysis.multiplier}x</small>
            </div>
        </div>
    `;
    
    // Insertar después del input
    locationInput.parentNode.appendChild(analysisDiv);
}

// Función para ocultar el análisis de ubicación
function hideLocationAnalysis() {
    const existingAnalysis = document.querySelector('.location-analysis');
    if (existingAnalysis) {
        existingAnalysis.remove();
    }
}

// Función para calcular totales de personal
function calculateStaffTotals() {
    const staffRoles = ['cocinero', 'meseros', 'caja', 'limpieza'];
    
    staffRoles.forEach(role => {
        const quantityInput = document.querySelector(`[data-role="${role}"][data-type="quantity"]`);
        const salaryInput = document.querySelector(`[data-role="${role}"][data-type="salary"]`);
        const totalSpan = document.querySelector(`[data-role="${role}"].staff-total-amount`);
        
        if (quantityInput && salaryInput && totalSpan) {
            const quantity = parseInt(quantityInput.value) || 0;
            const salary = parseFloat(salaryInput.value) || 0;
            const total = quantity * salary;
            
            totalSpan.textContent = total.toLocaleString();
        }
    });
}

// Función para actualizar visibilidad de servicios según arriendo
function updateServicesVisibility(serviciosIncluidos) {
    const serviceGroups = document.querySelectorAll('.service-group');
    
    serviceGroups.forEach(group => {
        const serviceType = group.dataset.service;
        const input = group.querySelector('.service-input');
        const status = group.querySelector('.service-status');
        
        if (serviceType === 'electricidad' || serviceType === 'agua') {
            // Servicios que pueden estar incluidos en arriendo
            if (serviciosIncluidos === 'agua' && serviceType === 'agua') {
                input.disabled = true;
                input.value = '';
                status.innerHTML = '<i class="fas fa-check-circle"></i> Incluido en arriendo';
                status.className = 'service-status included';
                group.classList.add('disabled');
            } else if (serviciosIncluidos === 'luz' && serviceType === 'electricidad') {
                input.disabled = true;
                input.value = '';
                status.innerHTML = '<i class="fas fa-check-circle"></i> Incluido en arriendo';
                status.className = 'service-status included';
                group.classList.add('disabled');
            } else if (serviciosIncluidos === 'agua-luz' && (serviceType === 'agua' || serviceType === 'electricidad')) {
                input.disabled = true;
                input.value = '';
                status.innerHTML = '<i class="fas fa-check-circle"></i> Incluido en arriendo';
                status.className = 'service-status included';
                group.classList.add('disabled');
            } else if (serviciosIncluidos === 'todos' && (serviceType === 'agua' || serviceType === 'electricidad')) {
                input.disabled = true;
                input.value = '';
                status.innerHTML = '<i class="fas fa-check-circle"></i> Incluido en arriendo';
                status.className = 'service-status included';
                group.classList.add('disabled');
            } else {
                input.disabled = false;
                status.innerHTML = '<i class="fas fa-times-circle"></i> No incluido en arriendo';
                status.className = 'service-status not-included';
                group.classList.remove('disabled');
            }
        } else {
            // Servicios independientes (internet, gas)
            input.disabled = false;
            status.innerHTML = '<i class="fas fa-check-circle"></i> Servicio independiente';
            status.className = 'service-status independent';
            group.classList.remove('disabled');
        }
    });
    
    // Recalcular totales
    calculateTotalServices();
    calculateTotalFixedCosts();
    updateBusinessDataFromForm();
    saveToStorage();
    generateStepSummaries();
}

// Función centralizada para obtener multiplicadores de ubicación de Pichincha, Ecuador
function getLocationMultipliers() {
    return {
        // Quito - Zonas principales
        'centro_quito': 1.8,           // Centro histórico de Quito
        'mariscal': 1.6,               // La Mariscal
        'cumbaya': 1.4,                // Cumbayá
        'tumbaco': 1.2,                // Tumbaco
        'valle_chorlavi': 1.1,         // Valle de los Chillos
        'calderon': 0.9,               // Calderón
        'carapungo': 0.8,              // Carapungo
        'conocoto': 1.0,               // Conocoto
        'guayllabamba': 0.7,           // Guayllabamba
        'mitad_mundo': 1.3,            // Mitad del Mundo
        'pomasqui': 0.8,               // Pomasquí
        'puembo': 1.2,                 // Puembo
        'sangolqui': 1.1,              // Sangolquí
        'tababela': 0.9,               // Tababela
        'yaruqui': 0.8,                // Yaruquí
        'zona_rosa': 1.7,              // Zona Rosa (Gonzalez Suarez)
        'floresta': 1.5,               // La Floresta
        'bellavista': 1.3,             // Bellavista
        'innaquito': 1.4,              // Innaquito
        'nayon': 1.0,                  // Nayón
        'rumipamba': 1.1,              // Rumipamba
        'san_antonio': 1.2,            // San Antonio de Pichincha
        'zona_financiera': 1.9,        // Zona financiera (Amazonas)
        'aeropuerto': 1.0,             // Zona del aeropuerto
        'terminal_terrestre': 0.9,     // Zona terminal terrestre
        'centro_comercial': 1.6,       // Cerca de centros comerciales
        'universidad': 1.2,            // Zonas universitarias
        'hospital': 1.1,               // Zonas hospitalarias
        'parque': 1.0,                 // Cerca de parques
        'avenida_principal': 1.4,      // Avenidas principales
        'calle_secundaria': 1.0,       // Calles secundarias
        'residencial_alto': 1.3,       // Zonas residenciales altas
        'residencial_medio': 1.0,      // Zonas residenciales medias
        'residencial_bajo': 0.8,       // Zonas residenciales bajas
        'comercial_intenso': 1.7,      // Zonas de alto comercio
        'comercial_medio': 1.3,        // Zonas de comercio medio
        'comercial_bajo': 0.9,         // Zonas de bajo comercio
        'industrial': 0.7,             // Zonas industriales
        'rural': 0.6                   // Zonas rurales
    };
}

// Análisis de datos de inversión
function analyzeInvestmentData(data, context) {
    const analysis = { isValid: true, warnings: [], suggestions: [], estimatedValues: {} };
    
    // Calcular rangos basados en el contexto
    const { tipoNegocio, ubicacion, metrosCuadrados, capacidad, categoriaTamaño } = context;
    
    // Multiplicadores por tipo de negocio
    const businessMultipliers = {
        'restaurante': 1.0,
        'cafeteria': 0.7,
        'bar': 1.2,
        'panaderia': 0.8,
        'heladeria': 0.6,
        'pizzeria': 0.9
    };
    
    // Multiplicadores por tamaño
    const sizeMultipliers = {
        'pequeno': 0.6,
        'mediano': 1.0,
        'grande': 1.8
    };
    
    const baseMultiplier = (context.multiplier || 1.0) * 
                          (businessMultipliers[tipoNegocio] || 1.0) * 
                          (sizeMultipliers[categoriaTamaño] || 1.0);
    
    // Rangos base por metro cuadrado (precios en USD para Ecuador)
    const baseRanges = {
        garantia: { min: 15, max: 40 }, // por m² (2-3 meses de arriendo)
        equipos: { min: 80, max: 250 }, // por m² (equipos de cocina)
        mobiliario: { min: 40, max: 120 }, // por m² (mesas, sillas, mostradores)
        decoracion: { min: 15, max: 50 }, // por m² (pintura, iluminación, etc.)
        licencias: { min: 300, max: 1500 }, // fijo (licencias municipales)
        pos: { min: 200, max: 1200 } // fijo (sistema de punto de venta)
    };
    
    // Análisis de gastos de montaje
    if (data.gastos) {
        // Garantía de arriendo
        if (data.gastos.garantia) {
            const expectedMin = baseRanges.garantia.min * metrosCuadrados * baseMultiplier;
            const expectedMax = baseRanges.garantia.max * metrosCuadrados * baseMultiplier;
            
            if (data.gastos.garantia < expectedMin * 0.5) {
                analysis.warnings.push(`La garantía de arriendo ($${data.gastos.garantia}) parece muy baja para un ${tipoNegocio} de ${metrosCuadrados}m² en ${ubicacion}. Considera que generalmente es 2-3 meses de arriendo.`);
                analysis.estimatedValues.garantia = Math.round(expectedMin);
            } else if (data.gastos.garantia > expectedMax * 2) {
                analysis.warnings.push(`La garantía de arriendo ($${data.gastos.garantia}) parece muy alta para un ${tipoNegocio} de ${metrosCuadrados}m² en ${ubicacion}. Verifica que sea correcta.`);
            }
        }
        
        // Equipos de cocina
        if (data.gastos.equipos) {
            const expectedMin = baseRanges.equipos.min * metrosCuadrados * baseMultiplier;
            const expectedMax = baseRanges.equipos.max * metrosCuadrados * baseMultiplier;
            
            if (data.gastos.equipos < expectedMin * 0.6) {
                analysis.warnings.push(`Los equipos de cocina ($${data.gastos.equipos}) parecen muy baratos para un ${tipoNegocio} de ${metrosCuadrados}m². Una cocina básica cuesta entre $${Math.round(expectedMin)}-$${Math.round(expectedMax)}.`);
                analysis.estimatedValues.equipos = Math.round(expectedMin);
            } else if (data.gastos.equipos > expectedMax * 2) {
                analysis.warnings.push(`Los equipos de cocina ($${data.gastos.equipos}) parecen muy caros para un ${tipoNegocio} de ${metrosCuadrados}m². Verifica los precios.`);
            }
        }
        
        // Mobiliario
        if (data.gastos.mobiliario) {
            const expectedMin = baseRanges.mobiliario.min * metrosCuadrados * baseMultiplier;
            const expectedMax = baseRanges.mobiliario.max * metrosCuadrados * baseMultiplier;
            
            if (data.gastos.mobiliario < expectedMin * 0.5) {
                analysis.warnings.push(`El mobiliario ($${data.gastos.mobiliario}) parece muy barato para un ${tipoNegocio} de ${metrosCuadrados}m². Considera mesas, sillas, mostradores para ${capacidad} personas.`);
                analysis.estimatedValues.mobiliario = Math.round(expectedMin);
            } else if (data.gastos.mobiliario > expectedMax * 2) {
                analysis.warnings.push(`El mobiliario ($${data.gastos.mobiliario}) parece muy caro para un ${tipoNegocio} de ${metrosCuadrados}m². Verifica los precios.`);
            }
        }
        
        // Decoración
        if (data.gastos.decoracion) {
            const expectedMin = baseRanges.decoracion.min * metrosCuadrados * baseMultiplier;
            const expectedMax = baseRanges.decoracion.max * metrosCuadrados * baseMultiplier;
            
            if (data.gastos.decoracion < expectedMin * 0.3) {
                analysis.warnings.push(`La decoración ($${data.gastos.decoracion}) parece muy barata para un ${tipoNegocio} de ${metrosCuadrados}m² en ${ubicacion}.`);
                analysis.estimatedValues.decoracion = Math.round(expectedMin);
            } else if (data.gastos.decoracion > expectedMax * 3) {
                analysis.warnings.push(`La decoración ($${data.gastos.decoracion}) parece muy cara para un ${tipoNegocio} de ${metrosCuadrados}m².`);
            }
        }
        
        // Licencias
        if (data.gastos.licencias) {
            const expectedMin = baseRanges.licencias.min * baseMultiplier;
            const expectedMax = baseRanges.licencias.max * baseMultiplier;
            
            if (data.gastos.licencias < expectedMin * 0.5) {
                analysis.warnings.push(`Las licencias ($${data.gastos.licencias}) parecen muy baratas para un ${tipoNegocio} en ${ubicacion}.`);
                analysis.estimatedValues.licencias = Math.round(expectedMin);
            } else if (data.gastos.licencias > expectedMax * 2) {
                analysis.warnings.push(`Las licencias ($${data.gastos.licencias}) parecen muy caras para un ${tipoNegocio} en ${ubicacion}.`);
            }
        }
        
        // Sistema POS
        if (data.gastos.pos) {
            const expectedMin = baseRanges.pos.min * baseMultiplier;
            const expectedMax = baseRanges.pos.max * baseMultiplier;
            
            if (data.gastos.pos < expectedMin * 0.5) {
                analysis.warnings.push(`El sistema POS ($${data.gastos.pos}) parece muy barato para un ${tipoNegocio} de ${categoriaTamaño} tamaño.`);
                analysis.estimatedValues.pos = Math.round(expectedMin);
            } else if (data.gastos.pos > expectedMax * 2) {
                analysis.warnings.push(`El sistema POS ($${data.gastos.pos}) parece muy caro para un ${tipoNegocio} de ${categoriaTamaño} tamaño.`);
            }
        }
    }
    
    // Análisis de financiamiento
    if (data.financiamiento) {
        const totalFunding = Object.values(data.financiamiento).reduce((sum, val) => sum + (val || 0), 0);
        const totalExpenses = Object.values(data.gastos || {}).reduce((sum, val) => sum + (val || 0), 0);
        
        if (totalFunding < totalExpenses * 0.8) {
            analysis.warnings.push('El financiamiento parece insuficiente para cubrir los gastos de inversión.');
            analysis.suggestions.push('Considera aumentar el capital propio o buscar más financiamiento.');
        }
        
        if (totalFunding > totalExpenses * 1.5) {
            analysis.warnings.push('El financiamiento es mucho mayor que los gastos. Considera si realmente necesitas tanto capital.');
        }
    }
    
    return analysis;
}

// Análisis de costos fijos
function analyzeFixedCostsData(data, context) {
    const analysis = { isValid: true, warnings: [], suggestions: [], estimatedValues: {} };
    
    // Calcular rangos basados en el contexto
    const { tipoNegocio, ubicacion, metrosCuadrados, capacidad, categoriaTamaño } = context;
    
    // Multiplicadores por ubicación específica de Pichincha, Ecuador
    const locationMultipliers = getLocationMultipliers();
    
    // Multiplicadores por tipo de negocio
    const businessMultipliers = {
        'restaurante': 1.0,
        'cafeteria': 0.7,
        'bar': 1.2,
        'panaderia': 0.8,
        'heladeria': 0.6,
        'pizzeria': 0.9
    };
    
    // Multiplicadores por tamaño
    const sizeMultipliers = {
        'pequeno': 0.6,
        'mediano': 1.0,
        'grande': 1.8
    };
    
    const baseMultiplier = (locationMultipliers[ubicacion] || 1.0) * 
                          (businessMultipliers[tipoNegocio] || 1.0) * 
                          (sizeMultipliers[categoriaTamaño] || 1.0);
    
    // Rangos base por metro cuadrado (precios en USD para Ecuador)
    const baseRanges = {
        arriendo: { min: 12, max: 35 }, // por m² (arriendo mensual)
        electricidad: { min: 2, max: 6 }, // por m² (consumo mensual)
        agua: { min: 0.8, max: 2.5 }, // por m² (consumo mensual)
        gas: { min: 1.5, max: 4 }, // por m² (consumo mensual)
        internet: { min: 40, max: 120 }, // fijo (plan mensual)
        cocinero: { min: 600, max: 1200 }, // fijo (salario mensual)
        meseros: { min: 450, max: 800 }, // fijo (salario mensual)
        caja: { min: 550, max: 900 }, // fijo (salario mensual)
        limpieza: { min: 400, max: 600 } // fijo (salario mensual)
    };
    
    // Análisis de arriendo
    if (data.arriendo) {
        const expectedMin = baseRanges.arriendo.min * metrosCuadrados * baseMultiplier;
        const expectedMax = baseRanges.arriendo.max * metrosCuadrados * baseMultiplier;
        
        if (data.arriendo < expectedMin * 0.5) {
            analysis.warnings.push(`El arriendo ($${data.arriendo}) parece muy bajo para un ${tipoNegocio} de ${metrosCuadrados}m² en ${ubicacion}. El rango típico es $${Math.round(expectedMin)}-$${Math.round(expectedMax)}/mes.`);
            analysis.estimatedValues.arriendo = Math.round(expectedMin);
        } else if (data.arriendo > expectedMax * 2) {
            analysis.warnings.push(`El arriendo ($${data.arriendo}) parece muy alto para un ${tipoNegocio} de ${metrosCuadrados}m² en ${ubicacion}. Verifica que sea el precio correcto por mes.`);
        }
    }
    
    // Análisis de personal con nueva estructura
    if (data.staff) {
        Object.keys(data.staff).forEach(role => {
            const staffData = data.staff[role];
            if (staffData && staffData.sueldoPorPersona) {
                const salaryRange = baseRanges[role];
                if (salaryRange) {
                    const expectedMin = salaryRange.min * baseMultiplier;
                    const expectedMax = salaryRange.max * baseMultiplier;
                    const salary = staffData.sueldoPorPersona;
                    
                    // Validar salario por persona
                    if (salary < expectedMin * 0.7) {
                        const roleNames = {
                            'cocinero': 'Cocinero',
                            'meseros': 'Mesero',
                            'caja': 'Caja/Administrativo',
                            'limpieza': 'Limpieza'
                        };
                        const roleName = roleNames[role] || role;
                        analysis.warnings.push(`💸 El sueldo del ${roleName} ($${salary}/mes) parece muy bajo para un ${tipoNegocio} en ${ubicacion}. En esta zona, un ${roleName} gana entre $${Math.round(expectedMin)}-$${Math.round(expectedMax)}/mes. Considera que salarios muy bajos pueden afectar la calidad del servicio y la retención de empleados.`);
                        analysis.estimatedValues[role] = Math.round(expectedMin);
                    } else if (salary > expectedMax * 1.5) {
                        const roleNames = {
                            'cocinero': 'Cocinero',
                            'meseros': 'Mesero',
                            'caja': 'Caja/Administrativo',
                            'limpieza': 'Limpieza'
                        };
                        const roleName = roleNames[role] || role;
                        analysis.warnings.push(`💸 El sueldo del ${roleName} ($${salary}/mes) parece muy alto para un ${tipoNegocio} de ${categoriaTamaño} tamaño en ${ubicacion}. Esto podría afectar significativamente tu rentabilidad. Verifica que sea el salario correcto para la experiencia y responsabilidades del puesto.`);
                    }
                    
                    // Validar cantidad de personal
                    const quantity = staffData.cantidad || 0;
                    const expectedQuantity = getExpectedStaffQuantity(role, capacidad, categoriaTamaño);
                    
                    if (quantity < expectedQuantity.min) {
                        const roleNames = {
                            'cocinero': 'Cocinero',
                            'meseros': 'Meseros',
                            'caja': 'Caja/Administrativo',
                            'limpieza': 'Limpieza'
                        };
                        const roleName = roleNames[role] || role;
                        analysis.warnings.push(`⚠️ La cantidad de ${roleName} (${quantity}) parece muy baja para un ${tipoNegocio} con capacidad de ${capacidad} personas. Se recomienda al menos ${expectedQuantity.min} ${roleName}${expectedQuantity.min > 1 ? 's' : ''} para operar eficientemente.`);
                    } else if (quantity > expectedQuantity.max) {
                        const roleNames = {
                            'cocinero': 'Cocinero',
                            'meseros': 'Meseros',
                            'caja': 'Caja/Administrativo',
                            'limpieza': 'Limpieza'
                        };
                        const roleName = roleNames[role] || role;
                        analysis.warnings.push(`⚠️ La cantidad de ${roleName} (${quantity}) parece muy alta para un ${tipoNegocio} con capacidad de ${capacidad} personas. Esto podría aumentar significativamente tus costos operativos.`);
                    }
                    
                    // Validar costo total por rol
                    const totalCost = quantity * salary;
                    const expectedTotalMin = expectedQuantity.min * expectedMin;
                    const expectedTotalMax = expectedQuantity.max * expectedMax;
                    
                    if (totalCost > expectedTotalMax * 1.3) {
                        const roleNames = {
                            'cocinero': 'Cocinero',
                            'meseros': 'Meseros',
                            'caja': 'Caja/Administrativo',
                            'limpieza': 'Limpieza'
                        };
                        const roleName = roleNames[role] || role;
                        analysis.warnings.push(`💰 El costo total de ${roleName}s ($${totalCost}/mes) parece muy alto para un ${tipoNegocio} de ${categoriaTamaño} tamaño. Considera optimizar la cantidad o los salarios.`);
                    } else if (totalCost < expectedTotalMin * 0.5) {
                        const roleNames = {
                            'cocinero': 'Cocinero',
                            'meseros': 'Meseros',
                            'caja': 'Caja/Administrativo',
                            'limpieza': 'Limpieza'
                        };
                        const roleName = roleNames[role] || role;
                        analysis.warnings.push(`💰 El costo total de ${roleName}s ($${totalCost}/mes) parece muy bajo. Verifica que puedas operar eficientemente con este presupuesto.`);
                    }
                }
            }
        });
    }
    
    // Análisis del costo total de personal
    if (data.staff) {
        let totalStaffCost = 0;
        let totalStaffCount = 0;
        
        Object.keys(data.staff).forEach(role => {
            const staffData = data.staff[role];
            if (staffData && staffData.sueldoPorPersona && staffData.cantidad) {
                totalStaffCost += staffData.sueldoPorPersona * staffData.cantidad;
                totalStaffCount += staffData.cantidad;
            }
        });
        
        // Validar proporción del costo de personal vs ingresos esperados
        const expectedMonthlyRevenue = capacidad * 30 * 15; // 30 días, $15 promedio por cliente
        const staffCostRatio = totalStaffCost / expectedMonthlyRevenue;
        
        if (staffCostRatio > 0.4) {
            analysis.warnings.push(`💼 El costo total de personal ($${totalStaffCost}/mes) representa ${Math.round(staffCostRatio * 100)}% de los ingresos esperados. Esto es muy alto y podría afectar la rentabilidad. Se recomienda mantener el costo de personal por debajo del 30% de los ingresos.`);
        } else if (staffCostRatio < 0.1) {
            analysis.warnings.push(`💼 El costo total de personal ($${totalStaffCost}/mes) representa solo ${Math.round(staffCostRatio * 100)}% de los ingresos esperados. Esto podría indicar personal insuficiente para operar eficientemente.`);
        }
        
        // Validar cantidad total de personal
        const expectedTotalStaff = Math.ceil(capacidad / 15); // 1 empleado por cada 15 clientes
        
        if (totalStaffCount < expectedTotalStaff * 0.7) {
            analysis.warnings.push(`👥 La cantidad total de personal (${totalStaffCount}) parece insuficiente para un ${tipoNegocio} con capacidad de ${capacidad} personas. Se recomienda al menos ${Math.ceil(expectedTotalStaff * 0.7)} empleados para operar eficientemente.`);
        } else if (totalStaffCount > expectedTotalStaff * 1.5) {
            analysis.warnings.push(`👥 La cantidad total de personal (${totalStaffCount}) parece excesiva para un ${tipoNegocio} con capacidad de ${capacidad} personas. Esto podría aumentar innecesariamente los costos operativos.`);
        }
    }
    
    // Análisis de servicios
    if (data.servicios) {
        // Electricidad
        if (data.servicios.electricidad) {
            const expectedMin = baseRanges.electricidad.min * metrosCuadrados * baseMultiplier;
            const expectedMax = baseRanges.electricidad.max * metrosCuadrados * baseMultiplier;
            
            if (data.servicios.electricidad < expectedMin * 0.5) {
                analysis.warnings.push(`La electricidad ($${data.servicios.electricidad}) parece muy barata para un ${tipoNegocio} de ${metrosCuadrados}m². Considera el consumo de equipos de cocina.`);
                analysis.estimatedValues.electricidad = Math.round(expectedMin);
            } else if (data.servicios.electricidad > expectedMax * 2) {
                analysis.warnings.push(`La electricidad ($${data.servicios.electricidad}) parece muy cara para un ${tipoNegocio} de ${metrosCuadrados}m².`);
            }
        }
        
        // Agua
        if (data.servicios.agua) {
            const expectedMin = baseRanges.agua.min * metrosCuadrados * baseMultiplier;
            const expectedMax = baseRanges.agua.max * metrosCuadrados * baseMultiplier;
            
            if (data.servicios.agua < expectedMin * 0.5) {
                analysis.warnings.push(`El agua ($${data.servicios.agua}) parece muy barata para un ${tipoNegocio} de ${metrosCuadrados}m². Considera el consumo de un ${tipoNegocio}.`);
                analysis.estimatedValues.agua = Math.round(expectedMin);
            } else if (data.servicios.agua > expectedMax * 2) {
                analysis.warnings.push(`El agua ($${data.servicios.agua}) parece muy cara para un ${tipoNegocio} de ${metrosCuadrados}m².`);
            }
        }
        
        // Gas
        if (data.servicios.gas) {
            const expectedMin = baseRanges.gas.min * metrosCuadrados * baseMultiplier;
            const expectedMax = baseRanges.gas.max * metrosCuadrados * baseMultiplier;
            
            if (data.servicios.gas < expectedMin * 0.5) {
                analysis.warnings.push(`El gas ($${data.servicios.gas}) parece muy barato para un ${tipoNegocio} de ${metrosCuadrados}m².`);
                analysis.estimatedValues.gas = Math.round(expectedMin);
            } else if (data.servicios.gas > expectedMax * 2) {
                analysis.warnings.push(`El gas ($${data.servicios.gas}) parece muy caro para un ${tipoNegocio} de ${metrosCuadrados}m².`);
            }
        }
        
        // Internet
        if (data.servicios.internet) {
            const expectedMin = baseRanges.internet.min * baseMultiplier;
            const expectedMax = baseRanges.internet.max * baseMultiplier;
            
            if (data.servicios.internet < expectedMin * 0.5) {
                analysis.warnings.push(`El internet ($${data.servicios.internet}) parece muy barato para un ${tipoNegocio} en ${ubicacion}.`);
                analysis.estimatedValues.internet = Math.round(expectedMin);
            } else if (data.servicios.internet > expectedMax * 2) {
                analysis.warnings.push(`El internet ($${data.servicios.internet}) parece muy caro para un ${tipoNegocio} en ${ubicacion}.`);
            }
        }
    }
    
    return analysis;
}

// Función para calcular la cantidad esperada de personal según capacidad y tipo
function getExpectedStaffQuantity(role, capacidad, categoriaTamaño) {
    const staffRatios = {
        cocinero: {
            pequeno: { min: 1, max: 2 },
            mediano: { min: 1, max: 3 },
            grande: { min: 2, max: 5 }
        },
        meseros: {
            pequeno: { min: 1, max: 3 },
            mediano: { min: 2, max: 5 },
            grande: { min: 4, max: 10 }
        },
        caja: {
            pequeno: { min: 1, max: 1 },
            mediano: { min: 1, max: 2 },
            grande: { min: 1, max: 3 }
        },
        limpieza: {
            pequeno: { min: 1, max: 1 },
            mediano: { min: 1, max: 2 },
            grande: { min: 1, max: 3 }
        }
    };
    
    // Ajustar según capacidad
    const capacityMultiplier = capacidad / 30; // Base de 30 personas
    
    const baseRatio = staffRatios[role]?.[categoriaTamaño] || { min: 1, max: 2 };
    
    return {
        min: Math.max(1, Math.round(baseRatio.min * capacityMultiplier)),
        max: Math.max(baseRatio.min, Math.round(baseRatio.max * capacityMultiplier))
    };
}

// Función para validación IA en tiempo real del personal
function validateStaffInRealTime() {
    const context = getBusinessContext();
    const staffData = businessData.costosFijos.staff || {};
    
    // Limpiar errores anteriores de personal
    document.querySelectorAll('.staff-quantity-input, .staff-salary-input').forEach(input => {
        removeAIError(input);
    });
    
    Object.keys(staffData).forEach(role => {
        const staffInfo = staffData[role];
        if (staffInfo && staffInfo.sueldoPorPersona && staffInfo.cantidad) {
            const salaryInput = document.querySelector(`[data-role="${role}"][data-type="salary"]`);
            const quantityInput = document.querySelector(`[data-role="${role}"][data-type="quantity"]`);
            
            if (salaryInput && quantityInput) {
                // Validar salario
                const salaryRange = {
                    cocinero: { min: 600, max: 1200 },
                    meseros: { min: 450, max: 800 },
                    caja: { min: 550, max: 900 },
                    limpieza: { min: 400, max: 600 }
                };
                
                const range = salaryRange[role];
                if (range) {
                    const expectedMin = range.min * context.multiplier;
                    const expectedMax = range.max * context.multiplier;
                    const salary = staffInfo.sueldoPorPersona;
                    
                    if (salary < expectedMin * 0.7) {
                        const roleNames = {
                            'cocinero': 'Cocinero',
                            'meseros': 'Mesero',
                            'caja': 'Caja/Administrativo',
                            'limpieza': 'Limpieza'
                        };
                        const roleName = roleNames[role] || role;
                        showAIError(salaryInput, `💸 Salario muy bajo para ${roleName} en ${context.ubicacionOriginal}. Rango esperado: $${Math.round(expectedMin)}-$${Math.round(expectedMax)}/mes`, Math.round(expectedMin));
                    } else if (salary > expectedMax * 1.5) {
                        const roleNames = {
                            'cocinero': 'Cocinero',
                            'meseros': 'Mesero',
                            'caja': 'Caja/Administrativo',
                            'limpieza': 'Limpieza'
                        };
                        const roleName = roleNames[role] || role;
                        showAIError(salaryInput, `💸 Salario muy alto para ${roleName} en ${context.ubicacionOriginal}. Verifica que sea correcto.`);
                    }
                }
                
                // Validar cantidad
                const expectedQuantity = getExpectedStaffQuantity(role, context.capacidad, context.categoriaTamaño);
                const quantity = staffInfo.cantidad;
                
                if (quantity < expectedQuantity.min) {
                    const roleNames = {
                        'cocinero': 'Cocinero',
                        'meseros': 'Meseros',
                        'caja': 'Caja/Administrativo',
                        'limpieza': 'Limpieza'
                    };
                    const roleName = roleNames[role] || role;
                    showAIError(quantityInput, `⚠️ Muy pocos ${roleName}s para ${context.capacidad} personas. Recomendado: ${expectedQuantity.min}-${expectedQuantity.max}`, expectedQuantity.min);
                } else if (quantity > expectedQuantity.max) {
                    const roleNames = {
                        'cocinero': 'Cocinero',
                        'meseros': 'Meseros',
                        'caja': 'Caja/Administrativo',
                        'limpieza': 'Limpieza'
                    };
                    const roleName = roleNames[role] || role;
                    showAIError(quantityInput, `⚠️ Demasiados ${roleName}s para ${context.capacidad} personas. Recomendado: ${expectedQuantity.min}-${expectedQuantity.max}`, expectedQuantity.max);
                }
            }
        }
    });
}

// Análisis de costos variables
function analyzeVariableCostsData(data, context) {
    const analysis = { isValid: true, warnings: [], suggestions: [], estimatedValues: {} };
    
    // Calcular rangos basados en el contexto
    const { tipoNegocio, ubicacion, metrosCuadrados, capacidad, categoriaTamaño } = context;
    
    // Multiplicadores por ubicación específica de Pichincha, Ecuador (precios de ingredientes)
    const locationMultipliers = getLocationMultipliers();
    
    const baseMultiplier = locationMultipliers[ubicacion] || 1.0;
    
    // Rangos de precios por tipo de ingrediente (por kg o unidad) - Ecuador
    const ingredientRanges = {
        'carne': { min: 6, max: 15 },      // Carne de res por kg
        'pollo': { min: 4, max: 12 },      // Pollo por kg
        'cerdo': { min: 5, max: 14 },      // Cerdo por kg
        'pescado': { min: 8, max: 20 },    // Pescado por kg
        'pan': { min: 1.5, max: 4 },       // Pan por kg
        'queso': { min: 6, max: 15 },      // Queso por kg
        'lechuga': { min: 0.8, max: 2.5 }, // Lechuga por kg
        'tomate': { min: 1.5, max: 4 },    // Tomate por kg
        'cebolla': { min: 0.8, max: 2.5 }, // Cebolla por kg
        'papa': { min: 0.8, max: 3 },      // Papa por kg
        'arroz': { min: 1.5, max: 4 },     // Arroz por kg
        'frijoles': { min: 2, max: 6 },    // Frijoles por kg
        'aceite': { min: 3, max: 8 },      // Aceite por litro
        'sal': { min: 0.5, max: 2 },       // Sal por kg
        'azucar': { min: 1.5, max: 4 },    // Azúcar por kg
        'harina': { min: 1.5, max: 5 },    // Harina por kg
        'huevos': { min: 2, max: 6 },      // Huevos por docena
        'leche': { min: 1.5, max: 4 },     // Leche por litro
        'mantequilla': { min: 4, max: 10 } // Mantequilla por kg
    };
    
    if (data.productos) {
        data.productos.forEach((producto, index) => {
            if (producto.ingredientes) {
                producto.ingredientes.forEach((ingrediente, ingIndex) => {
                    // Análisis de precios de ingredientes
                    if (ingrediente.precioCompra > 0) {
                        const key = `producto_${index}_ingrediente_${ingIndex}`;
                        const nombreIngrediente = ingrediente.nombre.toLowerCase();
                        
                        // Buscar el rango apropiado para el ingrediente
                        let ingredientRange = null;
                        for (const [tipo, rango] of Object.entries(ingredientRanges)) {
                            if (nombreIngrediente.includes(tipo)) {
                                ingredientRange = rango;
                                break;
                            }
                        }
                        
                        // Si no se encuentra un rango específico, usar uno genérico
                        if (!ingredientRange) {
                            ingredientRange = { min: 2, max: 8 };
                        }
                        
                        const expectedMin = ingredientRange.min * baseMultiplier;
                        const expectedMax = ingredientRange.max * baseMultiplier;
                        
                        if (ingrediente.precioCompra < expectedMin * 0.5) {
                            analysis.warnings.push(`El precio de ${ingrediente.nombre} ($${ingrediente.precioCompra}) parece muy bajo para ${ubicacion}. El rango típico es $${Math.round(expectedMin)}-$${Math.round(expectedMax)}/${ingrediente.unidadCompra || 'kg'}.`);
                            analysis.estimatedValues[key] = Math.round(expectedMin);
                        } else if (ingrediente.precioCompra > expectedMax * 2) {
                            analysis.warnings.push(`El precio de ${ingrediente.nombre} ($${ingrediente.precioCompra}) parece muy alto para ${ubicacion}. Verifica que sea el precio correcto.`);
                        }
                    }
                });
                
                // Análisis del costo total del producto
                const totalCost = producto.ingredientes.reduce((sum, ing) => sum + (ing.precioCompra || 0), 0);
                const expectedMaxCost = capacidad * 2; // Costo máximo basado en capacidad
                
                if (totalCost > expectedMaxCost) {
                    analysis.warnings.push(`El costo total de ${producto.nombre} ($${totalCost}) parece muy alto para un ${tipoNegocio} de ${categoriaTamaño} tamaño. Verifica los precios de los ingredientes.`);
                }
            }
        });
    }
    
    return analysis;
}

// Análisis de precios
function analyzePricingData(data, context) {
    console.log('Iniciando análisis de precios con datos:', data);
    console.log('Contexto:', context);
    
    const analysis = { isValid: true, warnings: [], suggestions: [], estimatedValues: {} };
    
    // Calcular rangos basados en el contexto
    const { tipoNegocio, ubicacion, metrosCuadrados, capacidad, categoriaTamaño } = context;
    
    // Multiplicadores por ubicación específica de Pichincha, Ecuador (precios de venta)
    const locationMultipliers = getLocationMultipliers();
    
    // Multiplicadores por tipo de negocio
    const businessMultipliers = {
        'restaurante': 1.0,
        'cafeteria': 0.8,
        'bar': 1.3,
        'panaderia': 0.7,
        'heladeria': 0.9,
        'pizzeria': 0.9
    };
    
    const baseMultiplier = (locationMultipliers[ubicacion] || 1.0) * 
                          (businessMultipliers[tipoNegocio] || 1.0);
    
    // Rangos de precios por tipo de producto (USD) - Ecuador
    const productRanges = {
        'hamburguesa': { min: 4, max: 12 },   // Hamburguesa
        'pizza': { min: 6, max: 18 },         // Pizza
        'pollo': { min: 5, max: 15 },         // Pollo
        'pescado': { min: 8, max: 20 },       // Pescado
        'ensalada': { min: 3, max: 10 },      // Ensalada
        'sopa': { min: 3, max: 8 },           // Sopa
        'pasta': { min: 4, max: 12 },         // Pasta
        'arroz': { min: 3, max: 10 },         // Arroz
        'papas': { min: 2, max: 6 },          // Papas fritas
        'bebida': { min: 1.5, max: 4 },       // Bebidas
        'postre': { min: 2, max: 8 },         // Postres
        'cafe': { min: 1.5, max: 6 },         // Café
        'pan': { min: 0.8, max: 3 },          // Pan
        'empanada': { min: 1.5, max: 4 },     // Empanadas
        'ceviche': { min: 6, max: 15 },       // Ceviche
        'seco': { min: 5, max: 12 },          // Seco de pollo/carne
        'locro': { min: 4, max: 10 },         // Locro
        'fritada': { min: 4, max: 10 },       // Fritada
        'hornado': { min: 5, max: 12 },       // Hornado
        'llapingacho': { min: 3, max: 8 },    // Llapingachos
        'churrasco': { min: 4, max: 12 },     // Churrasco
        'encebollado': { min: 3, max: 8 },    // Encebollado
        'bolon': { min: 2, max: 5 },          // Bolón de verde
        'tigrillo': { min: 3, max: 7 },       // Tigrillo
        'colada': { min: 1.5, max: 4 },       // Colada morada
        'canelazo': { min: 2, max: 6 }        // Canelazo
    };
    
    if (data.productos) {
        console.log('Analizando productos:', data.productos);
        Object.entries(data.productos).forEach(([productId, precio]) => {
            console.log(`Analizando producto ${productId} con precio $${precio}`);
            // Obtener el costo del producto
            const producto = businessData.costosVariables.productos.find(p => p.id == productId);
            if (producto) {
                console.log(`Producto encontrado: ${producto.nombre}, costo: $${producto.costoTotal}`);
                const costo = producto.costoTotal || 0;
                const margen = ((precio - costo) / precio) * 100;
                const nombreProducto = producto.nombre.toLowerCase();
                
                // Buscar el rango apropiado para el producto
                let productRange = null;
                for (const [tipo, rango] of Object.entries(productRanges)) {
                    if (nombreProducto.includes(tipo)) {
                        productRange = rango;
                        break;
                    }
                }
                
                // Si no se encuentra un rango específico, usar uno genérico
                if (!productRange) {
                    productRange = { min: 5, max: 15 };
                }
                
                const expectedMin = productRange.min * baseMultiplier;
                const expectedMax = productRange.max * baseMultiplier;
                
                // Análisis de margen
                if (margen < 20) {
                    analysis.warnings.push(`El margen de ${producto.nombre} es muy bajo (${margen.toFixed(1)}%) para un ${tipoNegocio} en ${ubicacion}. Considera aumentar el precio.`);
                    analysis.estimatedValues[`precio_${productId}`] = Math.round(costo * 1.6); // 60% de margen
                } else if (margen > 80) {
                    analysis.warnings.push(`El margen de ${producto.nombre} es muy alto (${margen.toFixed(1)}%) para un ${tipoNegocio} en ${ubicacion}. Verifica que el precio sea competitivo.`);
                }
                
                // Análisis de precio vs mercado
                if (precio < expectedMin * 0.6) {
                    analysis.warnings.push(`El precio de ${producto.nombre} ($${precio}) parece muy bajo para un ${tipoNegocio} en ${ubicacion}. El rango típico es $${Math.round(expectedMin)}-$${Math.round(expectedMax)}.`);
                    analysis.estimatedValues[`precio_${productId}`] = Math.round(expectedMin);
                } else if (precio > expectedMax * 1.5) {
                    analysis.warnings.push(`El precio de ${producto.nombre} ($${precio}) parece muy alto para un ${tipoNegocio} en ${ubicacion}. Verifica que sea competitivo en el mercado.`);
                }
                
                // Análisis de precio vs costo
                if (precio < costo * 1.2) {
                    analysis.warnings.push(`El precio de ${producto.nombre} ($${precio}) es muy cercano al costo ($${costo}). Necesitas un margen mayor para ser rentable.`);
                    analysis.estimatedValues[`precio_${productId}`] = Math.round(costo * 1.5);
                }
            }
        });
    }
    
    return analysis;
}

// Funciones de validación con IA para cada paso
function validateConfigurationWithAI() {
    console.log('Validando configuración con IA...');
    return true; // La configuración no necesita validación de IA
}

function validateInvestmentWithAI() {
    console.log('Validando inversión con IA...');
    
    // Limpiar errores anteriores
    clearAllAIErrors();
    
    // Obtener datos de inversión
    const investmentData = {
        gastos: businessData.inversion.gastos || {},
        financiamiento: businessData.inversion.financiamiento || {}
    };
    
    const analysis = analyzeDataWithAI(investmentData, 'investment');
    
    // Mostrar errores inline
    if (analysis.warnings.length > 0) {
        analysis.warnings.forEach(warning => {
            // Mapear advertencias a campos específicos
            if (warning.includes('garantía')) {
                const input = document.querySelector('[data-category="garantia"]');
                if (input) showAIError(input, warning, analysis.estimatedValues.garantia);
            } else if (warning.includes('equipos')) {
                const input = document.querySelector('[data-category="equipos"]');
                if (input) showAIError(input, warning, analysis.estimatedValues.equipos);
            } else if (warning.includes('mobiliario')) {
                const input = document.querySelector('[data-category="mobiliario"]');
                if (input) showAIError(input, warning, analysis.estimatedValues.mobiliario);
            } else if (warning.includes('financiamiento')) {
                // Mostrar en el primer campo de financiamiento
                const input = document.querySelector('[data-category="capital"]');
                if (input) showAIError(input, warning);
            }
        });
        
        return false;
    }
    
    return true;
}

function validateFixedCostsWithAI() {
    console.log('Validando costos fijos con IA...');
    
    // Limpiar errores anteriores
    clearAllAIErrors();
    
    // Validar servicios básicos
    const serviciosArriendo = document.getElementById('serviciosArriendo')?.value || 'ninguno';
    const serviceInputs = document.querySelectorAll('.service-input:not([disabled])');
    let hasValidService = false;
    let serviceErrors = [];
    
    // Verificar que al menos un servicio básico tenga valor
    serviceInputs.forEach(input => {
        const serviceValue = parseFloat(input.value) || 0;
        if (serviceValue > 0) {
            hasValidService = true;
        } else if (input.dataset.service === 'electricidad' || input.dataset.service === 'agua') {
            // Para electricidad y agua, si no están incluidos en arriendo, deben tener valor
            if (serviciosArriendo === 'ninguno' || 
                (serviciosArriendo === 'agua' && input.dataset.service === 'electricidad') ||
                (serviciosArriendo === 'luz' && input.dataset.service === 'agua')) {
                serviceErrors.push(`${input.dataset.service}: Debes ingresar un valor para este servicio básico`);
            }
        }
    });
    
    // Si no hay servicios incluidos en arriendo, al menos uno debe tener valor
    if (serviciosArriendo === 'ninguno' && !hasValidService) {
        serviceErrors.push('Debes ingresar al menos un servicio básico (electricidad, agua, internet o gas)');
    }
    
    // Mostrar errores de servicios
    if (serviceErrors.length > 0) {
        serviceErrors.forEach(error => {
            showNotification(`❌ ${error}`, 'error');
        });
        console.log('Errores de servicios detectados, bloqueando avance');
        return false;
    }
    
    // Obtener datos de costos fijos con nueva estructura de personal
    const fixedCostsData = {
        arriendo: parseFloat(document.getElementById('arriendo')?.value) || 0,
        staff: businessData.costosFijos.staff || {},
        servicios: businessData.costosFijos.servicios || {}
    };
    
    console.log('Datos de costos fijos para análisis:', fixedCostsData);
    
    const context = getBusinessContext();
    console.log('Contexto del negocio:', context);
    
    const analysis = analyzeFixedCostsData(fixedCostsData, context);
    console.log('Resultado del análisis de costos fijos:', analysis);
    
    // Mostrar advertencias inline y bloquear avance si hay valores incoherentes
    if (analysis.warnings.length > 0) {
        let hasBlockingErrors = false;
        
        analysis.warnings.forEach(warning => {
            // Determinar si la advertencia es para un servicio básico (debe bloquear)
            const isServiceWarning = warning.includes('electricidad') || 
                                   warning.includes('agua') || 
                                   warning.includes('internet') || 
                                   warning.includes('gas');
            
            // Mapear advertencias a campos específicos
            if (warning.includes('arriendo')) {
                const input = document.getElementById('arriendo');
                if (input) showAIError(input, warning, analysis.estimatedValues.arriendo);
            } else if (warning.includes('cocinero')) {
                const input = document.querySelector('[data-role="cocinero"][data-type="salary"]');
                if (input) showAIError(input, warning, analysis.estimatedValues.cocinero);
            } else if (warning.includes('meseros')) {
                const input = document.querySelector('[data-role="meseros"][data-type="salary"]');
                if (input) showAIError(input, warning, analysis.estimatedValues.meseros);
            } else if (warning.includes('caja')) {
                const input = document.querySelector('[data-role="caja"][data-type="salary"]');
                if (input) showAIError(input, warning, analysis.estimatedValues.caja);
            } else if (warning.includes('limpieza')) {
                const input = document.querySelector('[data-role="limpieza"][data-type="salary"]');
                if (input) showAIError(input, warning, analysis.estimatedValues.limpieza);
            } else if (warning.includes('electricidad')) {
                const input = document.querySelector('[data-service="electricidad"]');
                if (input) showAIError(input, warning, analysis.estimatedValues.electricidad);
                if (isServiceWarning) hasBlockingErrors = true;
            } else if (warning.includes('agua')) {
                const input = document.querySelector('[data-service="agua"]');
                if (input) showAIError(input, warning, analysis.estimatedValues.agua);
                if (isServiceWarning) hasBlockingErrors = true;
            } else if (warning.includes('internet')) {
                const input = document.querySelector('[data-service="internet"]');
                if (input) showAIError(input, warning, analysis.estimatedValues.internet);
                if (isServiceWarning) hasBlockingErrors = true;
            } else if (warning.includes('gas')) {
                const input = document.querySelector('[data-service="gas"]');
                if (input) showAIError(input, warning, analysis.estimatedValues.gas);
                if (isServiceWarning) hasBlockingErrors = true;
            }
        });
        
        // Si hay errores bloqueantes en servicios básicos, mostrar notificación y bloquear
        if (hasBlockingErrors) {
            showNotification('❌ Los valores de los servicios básicos no son coherentes. Por favor, ajusta los valores según las recomendaciones de la IA.', 'error');
            console.log('Valores incoherentes detectados en servicios básicos, bloqueando avance');
            return false;
        }
        
        console.log('Advertencias IA mostradas, pero permitiendo continuar...');
    } else {
        console.log('No se encontraron advertencias de IA para costos fijos');
    }
    
    console.log('validateFixedCostsWithAI() retornando: true');
    return true;
}

function validateVariableCostsWithAI() {
    console.log('Validando costos variables con IA...');
    
    // Limpiar errores anteriores
    clearAllAIErrors();
    
    // Obtener datos de productos e ingredientes
    const products = document.querySelectorAll('.product-card');
    let hasWarnings = false;
    
    products.forEach((product, productIndex) => {
        const productName = product.querySelector('.product-name')?.value.trim();
        if (!productName) return;
        
        const ingredientItems = product.querySelectorAll('.ingredient-item');
        ingredientItems.forEach((item, ingredientIndex) => {
            const nameInput = item.querySelector('.ingredient-name');
            const priceInput = item.querySelector('.ingredient-price');
            const unitInput = item.querySelector('.ingredient-purchase-unit');
            const quantityInput = item.querySelector('.ingredient-quantity');
            
            if (nameInput && priceInput && unitInput && nameInput.value.trim()) {
                const ingredientName = nameInput.value.trim();
                const price = parseFloat(priceInput.value) || 0;
                const unit = unitInput.value.trim();
                const quantity = parseFloat(quantityInput?.value) || 0;
                
                // Validar precio del ingrediente
                const priceValidation = validateIngredientPrice(ingredientName, price, unit);
                if (!priceValidation.isValid) {
                    showAIError(priceInput, priceValidation.message);
                    hasWarnings = true;
                }
                
                // Validar cantidad vs precio
                if (quantity > 0 && price > 0) {
                    const totalCost = quantity * price;
                    
                    // Validar que el costo total del ingrediente no sea excesivo
                    if (totalCost > 50) { // Más de $50 por ingrediente es sospechoso
                        const message = `El costo total de ${ingredientName} ($${totalCost}) parece muy alto. Verifica la cantidad y el precio.`;
                        showAIError(priceInput, message);
                        hasWarnings = true;
                    }
                }
            }
        });
    });
    
    // Validar consistencia de costos totales por producto
    products.forEach((product, productIndex) => {
        const productName = product.querySelector('.product-name')?.value.trim();
        if (!productName) return;
        

        
        let totalProductCost = 0;
        const ingredientItems = product.querySelectorAll('.ingredient-item');
        
        ingredientItems.forEach((item) => {
            const priceInput = item.querySelector('.ingredient-price');
            const quantityInput = item.querySelector('.ingredient-quantity');
            
            if (priceInput && quantityInput) {
                const price = parseFloat(priceInput.value) || 0;
                const quantity = parseFloat(quantityInput.value) || 0;
                totalProductCost += price * quantity;
            }
        });
        
        // Validar que el costo total del producto sea razonable
        if (totalProductCost > 20) { // Más de $20 de costo por producto es alto
            const message = `El costo total del producto "${productName}" ($${totalProductCost}) parece muy alto. Revisa los precios de los ingredientes.`;
            showNotification(message, 'warning');
            hasWarnings = true;
        }
    });
    
    if (hasWarnings) {
        console.log('Advertencias de IA mostradas para costos variables');
    } else {
        console.log('No se encontraron advertencias de IA para costos variables');
    }
    
    // Las validaciones IA son solo advertencias, no bloquean el avance
    return true;
}

function validatePricingWithAI() {
    console.log('Validando precios con IA...');
    
    // Limpiar errores anteriores
    clearAllAIErrors();
    
    // Asegurar que businessData.precios.productos esté inicializado como objeto
    if (!businessData.precios.productos) {
        businessData.precios.productos = {};
    }
    
    console.log('Datos de precios a analizar:', businessData.precios);
    console.log('Productos de costos variables:', businessData.costosVariables.productos);
    
    // Verificar que hay al menos un precio ingresado
    const priceInputs = document.querySelectorAll('.price-input');
    let hasAnyPrice = false;
    priceInputs.forEach(input => {
        const price = parseFloat(input.value) || 0;
        if (price > 0) {
            hasAnyPrice = true;
        }
    });
    
    if (!hasAnyPrice) {
        console.log('No hay precios ingresados, mostrando error');
        showNotification('❌ Debes ingresar al menos un precio de venta antes de continuar.', 'error');
        return false;
    }
    
    const analysis = analyzeDataWithAI(businessData.precios, 'pricing');
    console.log('Análisis de IA:', analysis);
    
    // Mostrar errores inline
    if (analysis.warnings.length > 0) {
        console.log('Mostrando advertencias de IA:', analysis.warnings);
        analysis.warnings.forEach(warning => {
            // Buscar el producto específico mencionado en la advertencia
            const priceInputs = document.querySelectorAll('.price-input');
            console.log(`Buscando match para advertencia: "${warning}"`);
            priceInputs.forEach((input, index) => {
                const productId = input.dataset.product;
                console.log(`Revisando input con productId: ${productId}`);
                // Obtener el nombre del producto para hacer match con las advertencias
                const product = businessData.costosVariables.productos.find(p => p.id == productId);
                if (product) {
                    console.log(`Producto encontrado: ${product.nombre}`);
                    if (warning.includes(product.nombre)) {
                        console.log(`Match encontrado para: ${product.nombre}`);
                        const key = `precio_${productId}`;
                        if (analysis.estimatedValues[key]) {
                            showAIError(input, warning, analysis.estimatedValues[key]);
                        } else {
                            showAIError(input, warning);
                        }
                    }
                }
            });
        });
        
        return false;
    }
    
    return true;
}

// Función para mostrar el modal de validación de IA
function showAIValidationModal(analysis, stepName) {
    console.log('Mostrando modal de validación de IA...');
    
    let modalContent = `
        <div class="ai-validation-modal">
            <div class="ai-validation-header">
                <i class="fas fa-robot"></i>
                <h3>Análisis IA - ${stepName}</h3>
            </div>
            <div class="ai-validation-body">
    `;
    
    if (analysis.warnings.length > 0) {
        modalContent += `
            <div class="ai-section">
                <h4><i class="fas fa-exclamation-triangle"></i> Advertencias</h4>
                <ul>
        `;
        analysis.warnings.forEach(warning => {
            modalContent += `<li>${warning}</li>`;
        });
        modalContent += `</ul></div>`;
    }
    
    if (analysis.suggestions.length > 0) {
        modalContent += `
            <div class="ai-section">
                <h4><i class="fas fa-lightbulb"></i> Sugerencias</h4>
                <ul>
        `;
        analysis.suggestions.forEach(suggestion => {
            modalContent += `<li>${suggestion}</li>`;
        });
        modalContent += `</ul></div>`;
    }
    
    if (Object.keys(analysis.estimatedValues).length > 0) {
        modalContent += `
            <div class="ai-section">
                <h4><i class="fas fa-calculator"></i> Valores Estimados</h4>
                <ul>
        `;
        Object.entries(analysis.estimatedValues).forEach(([key, value]) => {
            modalContent += `<li><strong>${key}:</strong> $${value.toFixed(2)}</li>`;
        });
        modalContent += `</ul></div>`;
    }
    
    modalContent += `
            </div>
            <div class="ai-validation-footer">
                <button type="button" class="btn btn-secondary" onclick="closeAIValidationModal()">
                    <i class="fas fa-times"></i> Cerrar
                </button>
                <button type="button" class="btn btn-primary" onclick="applyAIEstimates()">
                    <i class="fas fa-check"></i> Aplicar Estimaciones
                </button>
            </div>
        </div>
    `;
    
    // Crear o actualizar el modal
    let modal = document.getElementById('aiValidationModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'aiValidationModal';
        modal.className = 'modal ai-validation-modal-container';
        document.body.appendChild(modal);
    }
    
    modal.innerHTML = modalContent;
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // Guardar el análisis para uso posterior
    window.currentAIAnalysis = analysis;
}

// Función para cerrar el modal de validación de IA
function closeAIValidationModal() {
    const modal = document.getElementById('aiValidationModal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
}

// ===== FUNCIONES DE AUTOCOMPLETADO =====

// Función principal de autocompletado
function autoCompleteStep(stepNumber) {
    console.log(`Autocompletando paso ${stepNumber}...`);
    
    switch (stepNumber) {
        case 1:
            autoCompleteConfiguration();
            break;
        case 2:
            autoCompleteInvestment();
            break;
        case 3:
            autoCompleteFixedCosts();
            break;
        case 4:
            autoCompleteVariableCosts();
            break;
        case 5:
            autoCompletePricing();
            break;
    }
    
    // Actualizar datos y cálculos
    updateBusinessDataFromForm();
    saveToStorage();
    
    // Ejecutar cálculos específicos del paso
    executeStepFunctions(stepNumber);
    
    console.log(`Paso ${stepNumber} autocompletado`);
}

// Autocompletar configuración
function autoCompleteConfiguration() {
    // Seleccionar tipo de negocio
    const restaurantOption = document.querySelector('[data-type="restaurante"]');
    if (restaurantOption) {
        document.querySelectorAll('.business-option').forEach(opt => opt.classList.remove('selected'));
        restaurantOption.classList.add('selected');
        businessData.configuracion.tipoNegocio = 'restaurante';
    }
    
    // Seleccionar tamaño
    const medianoOption = document.querySelector('[data-size="mediano"]');
    if (medianoOption) {
        document.querySelectorAll('.size-option').forEach(opt => opt.classList.remove('selected'));
        medianoOption.classList.add('selected');
        businessData.configuracion.categoriaTamaño = 'mediano';
    }
    
    // Llenar información adicional
    const businessName = document.getElementById('businessName');
    if (businessName) businessName.value = 'Mi Restaurante';
    
    const location = document.getElementById('location');
    if (location) location.value = 'Centro Histórico de Quito';
    
    const size = document.getElementById('size');
    if (size) size.value = '80';
    
    const capacity = document.getElementById('capacity');
    if (capacity) capacity.value = '30';
    
    const description = document.getElementById('description');
    if (description) description.value = 'Restaurante de comida rápida con ambiente familiar y precios accesibles.';
    
    // Configurar servicio a domicilio (activado por defecto)
    const servicioDomicilioSwitch = document.getElementById('servicioDomicilio');
    if (servicioDomicilioSwitch) {
        servicioDomicilioSwitch.checked = true;
        businessData.configuracion.servicioDomicilio = true;
    }
}

// Autocompletar inversión
function autoCompleteInvestment() {
    // Obtener contexto del paso 1
    const context = getBusinessContext();
    const { tipoNegocio, ubicacion, metrosCuadrados, capacidad, categoriaTamaño } = context;
    
    // Calcular multiplicadores basados en el contexto de Pichincha, Ecuador
    const locationMultipliers = getLocationMultipliers();
    
    const businessMultipliers = {
        'restaurante': 1.0,
        'cafeteria': 0.7,
        'bar': 1.2,
        'panaderia': 0.8,
        'heladeria': 0.6,
        'pizzeria': 0.9
    };
    
    const sizeMultipliers = {
        'pequeno': 0.6,
        'mediano': 1.0,
        'grande': 1.8
    };
    
    const baseMultiplier = (locationMultipliers[ubicacion] || 1.0) * 
                          (businessMultipliers[tipoNegocio] || 1.0) * 
                          (sizeMultipliers[categoriaTamaño] || 1.0);
    
    // Calcular valores basados en metros cuadrados y contexto (USD para Ecuador)
    const garantia = Math.round(25 * metrosCuadrados * baseMultiplier);
    const equipos = Math.round(120 * metrosCuadrados * baseMultiplier);
    const mobiliario = Math.round(60 * metrosCuadrados * baseMultiplier);
    const decoracion = Math.round(25 * metrosCuadrados * baseMultiplier);
    const licencias = Math.round(800 * baseMultiplier);
    const pos = Math.round(400 * baseMultiplier);
    
    // Gastos de montaje
    const garantiaInput = document.querySelector('[data-category="garantia"]');
    if (garantiaInput) garantiaInput.value = garantia;
    
    const equiposInput = document.querySelector('[data-category="equipos"]');
    if (equiposInput) equiposInput.value = equipos;
    
    const mobiliarioInput = document.querySelector('[data-category="mobiliario"]');
    if (mobiliarioInput) mobiliarioInput.value = mobiliario;
    
    const decoracionInput = document.querySelector('[data-category="decoracion"]');
    if (decoracionInput) decoracionInput.value = decoracion;
    
    const licenciasInput = document.querySelector('[data-category="licencias"]');
    if (licenciasInput) licenciasInput.value = licencias;
    
    const posInput = document.querySelector('[data-category="pos"]');
    if (posInput) posInput.value = pos;
    
    // Financiamiento (60% capital propio, 40% préstamos)
    const totalGastos = garantia + equipos + mobiliario + decoracion + licencias + pos;
    const capital = Math.round(totalGastos * 0.6);
    const prestamos = Math.round(totalGastos * 0.4);
    
    const capitalInput = document.querySelector('[data-category="capital"]');
    if (capitalInput) capitalInput.value = capital;
    
    const prestamosInput = document.querySelector('[data-category="prestamos"]');
    if (prestamosInput) prestamosInput.value = prestamos;
    
    const inversoresInput = document.querySelector('[data-category="inversores"]');
    if (inversoresInput) inversoresInput.value = '0';
    
    const otrosInput = document.querySelector('[data-category="otros"]');
    if (otrosInput) otrosInput.value = '0';
}

// Autocompletar costos fijos
function autoCompleteFixedCosts() {
    // Obtener contexto del paso 1
    const context = getBusinessContext();
    const { tipoNegocio, ubicacion, metrosCuadrados, capacidad, categoriaTamaño } = context;
    
    // Calcular multiplicadores basados en el contexto de Pichincha, Ecuador
    const locationMultipliers = getLocationMultipliers();
    
    const businessMultipliers = {
        'restaurante': 1.0,
        'cafeteria': 0.7,
        'bar': 1.2,
        'panaderia': 0.8,
        'heladeria': 0.6,
        'pizzeria': 0.9
    };
    
    const sizeMultipliers = {
        'pequeno': 0.6,
        'mediano': 1.0,
        'grande': 1.8
    };
    
    const baseMultiplier = (locationMultipliers[ubicacion] || 1.0) * 
                          (businessMultipliers[tipoNegocio] || 1.0) * 
                          (sizeMultipliers[categoriaTamaño] || 1.0);
    
    // Calcular valores basados en metros cuadrados y contexto (USD para Ecuador)
    const arriendo = Math.round(20 * metrosCuadrados * baseMultiplier);
    const electricidad = Math.round(4 * metrosCuadrados * baseMultiplier);
    const agua = Math.round(1.5 * metrosCuadrados * baseMultiplier);
    const gas = Math.round(2.5 * metrosCuadrados * baseMultiplier);
    const internet = Math.round(80 * baseMultiplier);
    
    // Salarios basados en ubicación y tipo de negocio (USD para Ecuador)
    const cocinero = Math.round(800 * baseMultiplier);
    const meseros = Math.round(600 * baseMultiplier);
    const caja = Math.round(700 * baseMultiplier);
    const limpieza = Math.round(500 * baseMultiplier);
    
    // Arriendo
    const arriendoInput = document.getElementById('arriendo');
    if (arriendoInput) arriendoInput.value = arriendo;
    
    // Personal con cantidad y sueldo
    const cocineroQuantity = document.querySelector('[data-role="cocinero"][data-type="quantity"]');
    const cocineroSalary = document.querySelector('[data-role="cocinero"][data-type="salary"]');
    if (cocineroQuantity) cocineroQuantity.value = '1';
    if (cocineroSalary) cocineroSalary.value = cocinero;
    
    const meserosQuantity = document.querySelector('[data-role="meseros"][data-type="quantity"]');
    const meserosSalary = document.querySelector('[data-role="meseros"][data-type="salary"]');
    if (meserosQuantity) meserosQuantity.value = '2';
    if (meserosSalary) meserosSalary.value = meseros;
    
    const cajaQuantity = document.querySelector('[data-role="caja"][data-type="quantity"]');
    const cajaSalary = document.querySelector('[data-role="caja"][data-type="salary"]');
    if (cajaQuantity) cajaQuantity.value = '1';
    if (cajaSalary) cajaSalary.value = caja;
    
    const limpiezaQuantity = document.querySelector('[data-role="limpieza"][data-type="quantity"]');
    const limpiezaSalary = document.querySelector('[data-role="limpieza"][data-type="salary"]');
    if (limpiezaQuantity) limpiezaQuantity.value = '1';
    if (limpiezaSalary) limpiezaSalary.value = limpieza;
    
    // Calcular totales de personal
    calculateStaffTotals();
    
    // Configurar servicios incluidos en arriendo (ninguno por defecto para autocompletado)
    const serviciosArriendoSelect = document.getElementById('serviciosArriendo');
    if (serviciosArriendoSelect) {
        serviciosArriendoSelect.value = 'ninguno';
        updateServicesVisibility('ninguno');
    }
    
    // Servicios (ahora todos habilitados)
    const electricidadInput = document.querySelector('[data-service="electricidad"]');
    if (electricidadInput) {
        electricidadInput.disabled = false;
        electricidadInput.value = electricidad;
    }
    
    const aguaInput = document.querySelector('[data-service="agua"]');
    if (aguaInput) {
        aguaInput.disabled = false;
        aguaInput.value = agua;
    }
    
    const internetInput = document.querySelector('[data-service="internet"]');
    if (internetInput) internetInput.value = internet;
    
    const gasInput = document.querySelector('[data-service="gas"]');
    if (gasInput) gasInput.value = gas;
    
    // Otros costos (USD para Ecuador)
    const otrosCostInputs = document.querySelectorAll('.other-cost-input');
    otrosCostInputs[0].value = Math.round(200 * baseMultiplier); // Seguros
    otrosCostInputs[1].value = Math.round(150 * baseMultiplier); // Mantenimiento
    otrosCostInputs[2].value = Math.round(300 * baseMultiplier); // Marketing
    otrosCostInputs[3].value = Math.round(80 * baseMultiplier); // Otros
}

// Autocompletar costos variables
function autoCompleteVariableCosts() {
    // Generar productos si no existen
    const productsContainer = document.querySelector('.products-container');
    if (productsContainer && productsContainer.children.length === 0) {
        addProduct();
        addProduct();
    }
    
    // Producto 1: Seco de Pollo (plato típico ecuatoriano)
    const product1 = document.getElementById('producto1');
    if (product1) {
        const nameInput = product1.querySelector('.product-name');
        if (nameInput) nameInput.value = 'Seco de Pollo';
        
        // Agregar ingredientes
        const ingredientsList = product1.querySelector('.ingredients-list');
        if (ingredientsList && ingredientsList.children.length === 0) {
            addIngredient(1);
            addIngredient(1);
            addIngredient(1);
            addIngredient(1);
        }
        
        // Llenar ingredientes
        const ingredientItems = product1.querySelectorAll('.ingredient-item');
        if (ingredientItems.length >= 4) {
            // Pollo
            const polloName = ingredientItems[0].querySelector('.ingredient-name');
            const polloPrice = ingredientItems[0].querySelector('.ingredient-price');
            if (polloName) polloName.value = 'Pollo';
            if (polloPrice) polloPrice.value = '8';
            
            // Arroz
            const arrozName = ingredientItems[1].querySelector('.ingredient-name');
            const arrozPrice = ingredientItems[1].querySelector('.ingredient-price');
            if (arrozName) arrozName.value = 'Arroz';
            if (arrozPrice) arrozPrice.value = '2.5';
            
            // Papa
            const papaName = ingredientItems[2].querySelector('.ingredient-name');
            const papaPrice = ingredientItems[2].querySelector('.ingredient-price');
            if (papaName) papaName.value = 'Papa';
            if (papaPrice) papaPrice.value = '1.5';
            
            // Cebolla
            const cebollaName = ingredientItems[3].querySelector('.ingredient-name');
            const cebollaPrice = ingredientItems[3].querySelector('.ingredient-price');
            if (cebollaName) cebollaName.value = 'Cebolla';
            if (cebollaPrice) cebollaPrice.value = '1';
        }
    }
    
    // Producto 2: Llapingachos (plato típico ecuatoriano)
    const product2 = document.getElementById('producto2');
    if (product2) {
        const nameInput = product2.querySelector('.product-name');
        if (nameInput) nameInput.value = 'Llapingachos';
        
        // Agregar ingredientes
        const ingredientsList = product2.querySelector('.ingredients-list');
        if (ingredientsList && ingredientsList.children.length === 0) {
            addIngredient(2);
            addIngredient(2);
            addIngredient(2);
        }
        
        // Llenar ingredientes
        const ingredientItems = product2.querySelectorAll('.ingredient-item');
        if (ingredientItems.length >= 3) {
            // Papa
            const papaName = ingredientItems[0].querySelector('.ingredient-name');
            const papaPrice = ingredientItems[0].querySelector('.ingredient-price');
            if (papaName) papaName.value = 'Papa';
            if (papaPrice) papaPrice.value = '1.5';
            
            // Queso
            const quesoName = ingredientItems[1].querySelector('.ingredient-name');
            const quesoPrice = ingredientItems[1].querySelector('.ingredient-price');
            if (quesoName) quesoName.value = 'Queso';
            if (quesoPrice) quesoPrice.value = '8';
            
            // Aceite
            const aceiteName = ingredientItems[2].querySelector('.ingredient-name');
            const aceitePrice = ingredientItems[2].querySelector('.ingredient-price');
            if (aceiteName) aceiteName.value = 'Aceite';
            if (aceitePrice) aceitePrice.value = '4';
        }
    }
}

// Autocompletar precios
function autoCompletePricing() {
    console.log('Autocompletando precios...');
    
    // Generar campos de precio si no existen
    generatePricingFields();
    
    // Obtener productos de costos variables
    const products = businessData.costosVariables.productos || [];
    
    if (products.length === 0) {
        console.log('No hay productos definidos para autocompletar precios');
        showNotification('No hay productos definidos. Completa el paso anterior primero.', 'warning');
        return;
    }
    
    // Establecer precios basados en costos y márgenes típicos (USD para Ecuador)
    products.forEach((product, index) => {
        const cost = product.costoTotal || 0;
        let suggestedPrice = 0;
        
        // Calcular precio sugerido basado en el tipo de producto
        if (product.nombre.toLowerCase().includes('seco') || product.nombre.toLowerCase().includes('plato')) {
            suggestedPrice = Math.max(cost * 2.5, 6); // Mínimo $6 para platos principales
        } else if (product.nombre.toLowerCase().includes('bebida') || product.nombre.toLowerCase().includes('jugo')) {
            suggestedPrice = Math.max(cost * 3.0, 2); // Mínimo $2 para bebidas
        } else if (product.nombre.toLowerCase().includes('postre') || product.nombre.toLowerCase().includes('dulce')) {
            suggestedPrice = Math.max(cost * 2.8, 3); // Mínimo $3 para postres
        } else {
            suggestedPrice = Math.max(cost * 2.5, 4); // Precio base para otros productos
        }
        
        // Buscar el input de precio correspondiente
        const priceInput = document.querySelector(`[data-product="${product.id}"].price-input`);
        if (priceInput) {
            priceInput.value = Math.round(suggestedPrice * 100) / 100; // Redondear a 2 decimales
            console.log(`Precio autocompletado para ${product.nombre}: $${priceInput.value}`);
        }
    });
    
    // Actualizar datos y cálculos
    updateBusinessDataFromForm();
    saveToStorage();
    
    // Actualizar análisis de precios
    calculatePricingAnalysis();
    
    console.log('Precios autocompletados correctamente');
    showNotification('Precios autocompletados basados en costos y márgenes típicos.', 'success');
}

// ===== VALIDACIÓN IA CON ERRORES INLINE =====

// Función para mostrar errores de IA debajo de cada input
function showAIError(input, message, estimatedValue = null) {
    // Remover errores existentes
    removeAIError(input);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'ai-error';
    errorDiv.innerHTML = `
        <i class="fas fa-robot"></i>
        <span class="ai-error-message">${message}</span>
        ${estimatedValue ? `<button type="button" class="ai-error-fix" onclick="applyAIEstimate('${input.id || input.dataset.category || input.dataset.role || input.dataset.service}', ${estimatedValue})">
            <i class="fas fa-magic"></i> Aplicar $${estimatedValue}
        </button>` : ''}
    `;
    
    // Insertar después del input
    input.parentNode.appendChild(errorDiv);
    input.classList.add('ai-error-input');
}

// Función para remover errores de IA
function removeAIError(input) {
    const existingError = input.parentNode.querySelector('.ai-error');
    if (existingError) {
        existingError.remove();
    }
    input.classList.remove('ai-error-input');
}

// Función para aplicar estimación de IA
function applyAIEstimate(fieldId, value) {
    console.log(`Aplicando estimación IA: ${fieldId} = ${value}`);
    
    // Buscar el input por diferentes selectores
    let input = document.getElementById(fieldId);
    if (!input) {
        input = document.querySelector(`[data-category="${fieldId}"]`);
    }
    if (!input) {
        input = document.querySelector(`[data-role="${fieldId}"]`);
    }
    if (!input) {
        input = document.querySelector(`[data-service="${fieldId}"]`);
    }
    
    if (input) {
        input.value = value;
        removeAIError(input);
        
        // Actualizar datos y cálculos
        updateBusinessDataFromForm();
        saveToStorage();
        
        // Ejecutar cálculos específicos del paso actual
        executeStepFunctions(currentStep);
    }
}

// Función para limpiar todos los errores de IA
function clearAllAIErrors() {
    document.querySelectorAll('.ai-error').forEach(error => error.remove());
    document.querySelectorAll('.ai-error-input').forEach(input => input.classList.remove('ai-error-input'));
}

// Función para aplicar las estimaciones de IA
function applyAIEstimates() {
    console.log('Aplicando estimaciones de IA...');
    
    if (window.currentAIAnalysis && window.currentAIAnalysis.estimatedValues) {
        Object.entries(window.currentAIAnalysis.estimatedValues).forEach(([key, value]) => {
            // Aplicar estimaciones según el tipo de campo
            if (key.startsWith('garantia')) {
                const input = document.querySelector('[data-category="garantia"]');
                if (input) input.value = value;
            } else if (key.startsWith('equipos')) {
                const input = document.querySelector('[data-category="equipos"]');
                if (input) input.value = value;
            } else if (key.startsWith('mobiliario')) {
                const input = document.querySelector('[data-category="mobiliario"]');
                if (input) input.value = value;
            } else if (key === 'arriendo') {
                const input = document.getElementById('arriendo');
                if (input) input.value = value;
            } else if (key.startsWith('staff_')) {
                const role = key.replace('staff_', '');
                const input = document.querySelector(`[data-role="${role}"]`);
                if (input) input.value = value;
            } else if (key === 'electricidad') {
                const input = document.querySelector('[data-service="electricidad"]');
                if (input) input.value = value;
            } else if (key === 'agua') {
                const input = document.querySelector('[data-service="agua"]');
                if (input) input.value = value;
            }
        });
        
        // Actualizar datos y cálculos
        updateBusinessDataFromForm();
        saveToStorage();
        
        // Ejecutar cálculos específicos del paso actual
        switch (currentStep) {
            case 2:
                calculateTotalExpenses();
                calculateTotalFunding();
                break;
            case 3:
                calculateStaffCosts();
                calculateTotalServices();
                calculateTotalFixedCosts();
                break;
        }
    }
    
    closeAIValidationModal();
}

// Generar resúmenes de pasos
function generateStepSummaries() {
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
    
    // Actualizar también el resumen de productos en el DOM si estamos en el paso 4
    if (currentStep === 4) {
        updateProductsSummary();
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
    
    // Guardar resúmenes para el modal
    window.stepSummaries = summaries;
    
    // Actualizar el botón según si hay resúmenes
    updateSummaryButton(summaries);
}

// Función para mostrar/ocultar el modal de resumen
function toggleSummaryModal() {
    const modal = document.getElementById('summaryModal');
    const modalSummaries = document.getElementById('modalStepSummaries');
    
    if (modal.classList.contains('show')) {
        // Cerrar modal
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    } else {
        // Abrir modal
        if (window.stepSummaries && window.stepSummaries.length > 0) {
            modalSummaries.innerHTML = generateModalSummariesHTML(window.stepSummaries);
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        } else {
            modalSummaries.innerHTML = '<div class="no-summaries"><p>No hay pasos completados aún.</p></div>';
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    }
}

// Función para actualizar el estado del botón
function updateSummaryButton(summaries) {
    const buttons = document.querySelectorAll('#showSummaryBtn');
    buttons.forEach(button => {
        if (summaries.length > 0) {
            button.innerHTML = '<i class="fas fa-list-alt"></i> Ver Resumen de Pasos Completados (' + summaries.length + ')';
            button.classList.remove('btn-outline-secondary');
            button.classList.add('btn-outline-primary');
        } else {
            button.innerHTML = '<i class="fas fa-list-alt"></i> Ver Resumen de Pasos Completados';
            button.classList.remove('btn-outline-primary');
            button.classList.add('btn-outline-secondary');
        }
    });
}

// Función para generar HTML del modal
function generateModalSummariesHTML(summaries) {
    if (summaries.length === 0) {
        return '<div class="no-summaries"><p>No hay pasos completados aún.</p></div>';
    }
    
    let html = '';
        summaries.forEach(summary => {
            if (summary.step < currentStep) {
                html += createSummaryCard(summary);
            }
        });
        
    return html;
}



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

// Función para resetear la simulación
function resetSimulacion() {
    if (confirm('¿Estás seguro de que quieres empezar una nueva simulación? Se perderán todos los datos actuales.')) {
        clearStorage();
        currentStep = 1;
        showStep(1);
        updateProgressBar();
        generateStepSummaries();
        
        // Limpiar formularios
        document.querySelectorAll('input, textarea, select').forEach(element => {
            element.value = '';
        });
        
        // Limpiar selecciones
        document.querySelectorAll('.business-option, .size-option').forEach(option => {
            option.classList.remove('selected');
        });
        
        // Limpiar contenedores dinámicos
        const productsContainer = document.querySelector('.products-container');
        if (productsContainer) productsContainer.innerHTML = '';
        
        const pricingContainer = document.getElementById('pricingContainer');
        if (pricingContainer) pricingContainer.innerHTML = '';
        
        alert('Simulación reseteada. Puedes comenzar de nuevo.');
    }
}

// Importar funciones del script original
// Nota: Estas funciones deben estar definidas en el script original
// y serán llamadas desde aquí

// Cálculos de inversión
function calculateTotalExpenses() {
    try {
        console.log('Calculando total de gastos...');
    let total = 0;
    const expenseInputs = document.querySelectorAll('.expense-input');
        console.log(`Encontrados ${expenseInputs.length} inputs de gastos`);
    
    expenseInputs.forEach(input => {
        const value = parseFloat(input.value) || 0;
        total += value;
    });
    
    const totalElement = document.getElementById('totalGastos');
    if (totalElement) {
        totalElement.textContent = `$${total.toFixed(2)}`;
            console.log(`Total de gastos actualizado: $${total.toFixed(2)}`);
        } else {
            console.error('No se encontró el elemento totalGastos');
    }
    
    businessData.inversion.totalGastos = total;
    saveToStorage();
        generateStepSummaries(); // Actualizar resúmenes
    } catch (error) {
        console.error('Error calculando total de gastos:', error);
    }
}

function calculateTotalFunding() {
    try {
        console.log('Calculando total de financiamiento...');
    let total = 0;
        let capital = 0;
        let prestamos = 0;
    const fundingInputs = document.querySelectorAll('.funding-input');
        console.log(`Encontrados ${fundingInputs.length} inputs de financiamiento`);
    
    fundingInputs.forEach(input => {
        const value = parseFloat(input.value) || 0;
        total += value;
            
            // Categorizar el financiamiento
            const category = input.dataset.category;
            if (category === 'capital' || category === 'inversores') {
                capital += value;
            } else if (category === 'prestamos' || category === 'otros') {
                prestamos += value;
            }
        });
        
        // Calcular porcentajes recomendados
        const capitalRecomendado = total * 0.6; // 60%
        const prestamosRecomendado = total * 0.4; // 40%
        const diferencia = capital - capitalRecomendado;
        
        console.log(`Total: $${total.toFixed(2)}, Capital: $${capital.toFixed(2)}, Préstamos: $${prestamos.toFixed(2)}, Diferencia: $${diferencia.toFixed(2)}`);
        
        // Actualizar elementos en el DOM
    const totalElement = document.getElementById('totalFinanciamiento');
        const capitalElement = document.getElementById('resumenCapital');
        const prestamosElement = document.getElementById('resumenPrestamos');
        const diferenciaElement = document.getElementById('diferencia');
        
    if (totalElement) {
        totalElement.textContent = `$${total.toFixed(2)}`;
        } else {
            console.error('No se encontró el elemento totalFinanciamiento');
        }
        
        if (capitalElement) {
            capitalElement.textContent = `$${capital.toFixed(2)}`;
        } else {
            console.error('No se encontró el elemento resumenCapital');
        }
        
        if (prestamosElement) {
            prestamosElement.textContent = `$${prestamos.toFixed(2)}`;
        } else {
            console.error('No se encontró el elemento resumenPrestamos');
        }
        
        if (diferenciaElement) {
            diferenciaElement.textContent = `$${diferencia.toFixed(2)}`;
            
            // Cambiar color según la diferencia
            if (diferencia < 0) {
                diferenciaElement.style.color = '#ef4444'; // Rojo si falta capital
            } else if (diferencia > 0) {
                diferenciaElement.style.color = '#10b981'; // Verde si hay exceso
            } else {
                diferenciaElement.style.color = '#f59e0b'; // Naranja si está balanceado
            }
        } else {
            console.error('No se encontró el elemento diferencia');
    }
    
    businessData.inversion.totalFinanciamiento = total;
        businessData.inversion.capital = capital;
        businessData.inversion.prestamos = prestamos;
        businessData.inversion.diferencia = diferencia;
        
    saveToStorage();
        generateStepSummaries(); // Actualizar resúmenes
        console.log('Cálculo de financiamiento completado');
    } catch (error) {
        console.error('Error calculando total de financiamiento:', error);
    }
}

// Cálculos de costos fijos
function calculateStaffCosts() {
    try {
        console.log('Calculando costos de personal...');
    let totalBase = 0;
    const staffInputs = document.querySelectorAll('.staff-input');
        console.log(`Encontrados ${staffInputs.length} inputs de personal`);
    
    staffInputs.forEach(input => {
        const value = parseFloat(input.value) || 0;
        totalBase += value;
            console.log(`Input ${input.dataset.role}: $${value.toFixed(2)}`);
    });
    
    const costoReal = totalBase * 1.38; // 38% adicional por cargas sociales
    
    const baseElement = document.getElementById('totalSalariosBase');
    const realElement = document.getElementById('totalSalariosReal');
    
        if (baseElement) {
            baseElement.textContent = `$${totalBase.toFixed(2)}`;
            console.log(`Total salarios base actualizado: $${totalBase.toFixed(2)}`);
        } else {
            console.error('No se encontró el elemento totalSalariosBase');
        }
        
        if (realElement) {
            realElement.textContent = `$${costoReal.toFixed(2)}`;
            console.log(`Total salarios real actualizado: $${costoReal.toFixed(2)}`);
        } else {
            console.error('No se encontró el elemento totalSalariosReal');
        }
    
    businessData.costosFijos.totalSalarios = costoReal;
    saveToStorage();
        generateStepSummaries(); // Actualizar resúmenes
        console.log('Cálculo de personal completado');
    } catch (error) {
        console.error('Error calculando costos de personal:', error);
    }
}

function calculateTotalServices() {
    try {
        console.log('Calculando total de servicios...');
    let total = 0;
    const serviceInputs = document.querySelectorAll('.service-input');
        console.log(`Encontrados ${serviceInputs.length} inputs de servicios`);
    
    serviceInputs.forEach(input => {
        const value = parseFloat(input.value) || 0;
        total += value;
            console.log(`Servicio ${input.dataset.service}: $${value.toFixed(2)}`);
    });
    
    businessData.costosFijos.totalServicios = total;
    saveToStorage();
        generateStepSummaries(); // Actualizar resúmenes
        console.log(`Total servicios actualizado: $${total.toFixed(2)}`);
    } catch (error) {
        console.error('Error calculando total de servicios:', error);
    }
}

function calculateTotalFixedCosts() {
    try {
        console.log('Calculando total de costos fijos...');
    const arriendo = parseFloat(document.getElementById('arriendo')?.value) || 0;
    const salarios = businessData.costosFijos.totalSalarios || 0;
    const servicios = businessData.costosFijos.totalServicios || 0;
    
    let otrosCostos = 0;
    const otherCostInputs = document.querySelectorAll('.other-cost-input');
        console.log(`Encontrados ${otherCostInputs.length} inputs de otros costos`);
        
    otherCostInputs.forEach(input => {
            const value = parseFloat(input.value) || 0;
            otrosCostos += value;
    });
    
    const total = arriendo + salarios + servicios + otrosCostos;
        
        console.log(`Arriendo: $${arriendo.toFixed(2)}, Salarios: $${salarios.toFixed(2)}, Servicios: $${servicios.toFixed(2)}, Otros: $${otrosCostos.toFixed(2)}, Total: $${total.toFixed(2)}`);
    
    // Actualizar resumen
    const arriendoElement = document.getElementById('resumenArriendo');
    const personalElement = document.getElementById('resumenPersonal');
    const serviciosElement = document.getElementById('resumenServicios');
    const otrosElement = document.getElementById('resumenOtros');
    const totalElement = document.getElementById('totalCostosFijos');
    
        if (arriendoElement) {
            arriendoElement.textContent = `$${arriendo.toFixed(2)}`;
        } else {
            console.error('No se encontró el elemento resumenArriendo');
        }
        
        if (personalElement) {
            personalElement.textContent = `$${salarios.toFixed(2)}`;
        } else {
            console.error('No se encontró el elemento resumenPersonal');
        }
        
        if (serviciosElement) {
            serviciosElement.textContent = `$${servicios.toFixed(2)}`;
        } else {
            console.error('No se encontró el elemento resumenServicios');
        }
        
        if (otrosElement) {
            otrosElement.textContent = `$${otrosCostos.toFixed(2)}`;
        } else {
            console.error('No se encontró el elemento resumenOtros');
        }
        
        if (totalElement) {
            totalElement.textContent = `$${total.toFixed(2)}`;
        } else {
            console.error('No se encontró el elemento totalCostosFijos');
        }
    
    businessData.costosFijos.total = total;
    saveToStorage();
        generateStepSummaries(); // Actualizar resúmenes
        console.log('Cálculo de costos fijos completado');
    } catch (error) {
        console.error('Error calculando total de costos fijos:', error);
    }
}

// Nota: Las siguientes funciones deben ser importadas del script original
// o redefinidas aquí según sea necesario:
// - generateProductCards()
// - generatePricingFields()
// - calculatePricingAnalysis()
// - calculateBreakEven()
// - calculateCashFlow()
// - calculateViabilityScore()
// - generateIAAlerts()
// - guardarSimulacion()
// - exportarReporte()

// Sistema de IA para análisis de platos y ingredientes
function analyzeDishWithAI(dishName, businessType = 'restaurante') {
    console.log('Analizando plato con IA:', dishName);
    
    // Normalizar el nombre del plato
    const normalizedName = dishName.toLowerCase().trim();
    
    // Base de datos de platos ecuatorianos y sus ingredientes típicos
    const ecuadorianDishes = {
        // Platos principales
        'seco de pollo': {
            ingredients: [
                { name: 'Pollo', quantity: 300, unit: 'g', price: 4.50, purchaseUnit: 'kg', purchasePrice: 15.00 },
                { name: 'Arroz', quantity: 150, unit: 'g', price: 0.45, purchaseUnit: 'kg', purchasePrice: 3.00 },
                { name: 'Cebolla', quantity: 50, unit: 'g', price: 0.25, purchaseUnit: 'kg', purchasePrice: 5.00 },
                { name: 'Ajo', quantity: 10, unit: 'g', price: 0.20, purchaseUnit: 'kg', purchasePrice: 20.00 },
                { name: 'Comino', quantity: 5, unit: 'g', price: 0.30, purchaseUnit: 'kg', purchasePrice: 60.00 },
                { name: 'Achiote', quantity: 5, unit: 'g', price: 0.25, purchaseUnit: 'kg', purchasePrice: 50.00 },
                { name: 'Aceite', quantity: 30, unit: 'ml', price: 0.18, purchaseUnit: 'l', purchasePrice: 6.00 }
            ],
            description: 'Plato típico ecuatoriano con pollo cocido en especias'
        },
        'seco de chivo': {
            ingredients: [
                { name: 'Carne de chivo', quantity: 300, unit: 'g', price: 6.00, purchaseUnit: 'kg', purchasePrice: 20.00 },
                { name: 'Arroz', quantity: 150, unit: 'g', price: 0.45, purchaseUnit: 'kg', purchasePrice: 3.00 },
                { name: 'Cebolla', quantity: 50, unit: 'g', price: 0.25, purchaseUnit: 'kg', purchasePrice: 5.00 },
                { name: 'Ajo', quantity: 10, unit: 'g', price: 0.20, purchaseUnit: 'kg', purchasePrice: 20.00 },
                { name: 'Comino', quantity: 5, unit: 'g', price: 0.30, purchaseUnit: 'kg', purchasePrice: 60.00 },
                { name: 'Achiote', quantity: 5, unit: 'g', price: 0.25, purchaseUnit: 'kg', purchasePrice: 50.00 },
                { name: 'Aceite', quantity: 30, unit: 'ml', price: 0.18, purchaseUnit: 'l', purchasePrice: 6.00 }
            ],
            description: 'Plato tradicional con carne de chivo marinada'
        },
        'ceviche': {
            ingredients: [
                { name: 'Pescado fresco', quantity: 200, unit: 'g', price: 4.00, purchaseUnit: 'kg', purchasePrice: 20.00 },
                { name: 'Limón', quantity: 100, unit: 'ml', price: 0.40, purchaseUnit: 'kg', purchasePrice: 4.00 },
                { name: 'Cebolla roja', quantity: 50, unit: 'g', price: 0.30, purchaseUnit: 'kg', purchasePrice: 6.00 },
                { name: 'Tomate', quantity: 50, unit: 'g', price: 0.25, purchaseUnit: 'kg', purchasePrice: 5.00 },
                { name: 'Cilantro', quantity: 10, unit: 'g', price: 0.20, purchaseUnit: 'kg', purchasePrice: 20.00 },
                { name: 'Sal', quantity: 5, unit: 'g', price: 0.05, purchaseUnit: 'kg', purchasePrice: 10.00 }
            ],
            description: 'Plato de pescado marinado en limón'
        },
        'encebollado': {
            ingredients: [
                { name: 'Atún', quantity: 150, unit: 'g', price: 3.00, purchaseUnit: 'kg', purchasePrice: 20.00 },
                { name: 'Yuca', quantity: 200, unit: 'g', price: 0.40, purchaseUnit: 'kg', purchasePrice: 2.00 },
                { name: 'Cebolla curtida', quantity: 50, unit: 'g', price: 0.30, purchaseUnit: 'kg', purchasePrice: 6.00 },
                { name: 'Limón', quantity: 30, unit: 'ml', price: 0.12, purchaseUnit: 'kg', purchasePrice: 4.00 },
                { name: 'Aceite', quantity: 20, unit: 'ml', price: 0.12, purchaseUnit: 'l', purchasePrice: 6.00 },
                { name: 'Sal', quantity: 5, unit: 'g', price: 0.05, purchaseUnit: 'kg', purchasePrice: 10.00 }
            ],
            description: 'Sopa de pescado con yuca y cebolla curtida'
        },
        'hornado': {
            ingredients: [
                { name: 'Carne de cerdo', quantity: 250, unit: 'g', price: 3.75, purchaseUnit: 'kg', purchasePrice: 15.00 },
                { name: 'Tortilla de papa', quantity: 100, unit: 'g', price: 0.60, purchaseUnit: 'kg', purchasePrice: 6.00 },
                { name: 'Encurtido', quantity: 30, unit: 'g', price: 0.30, purchaseUnit: 'kg', purchasePrice: 10.00 },
                { name: 'Achiote', quantity: 5, unit: 'g', price: 0.25, purchaseUnit: 'kg', purchasePrice: 50.00 },
                { name: 'Comino', quantity: 3, unit: 'g', price: 0.18, purchaseUnit: 'kg', purchasePrice: 60.00 }
            ],
            description: 'Carne de cerdo horneada con tortilla de papa'
        },
        'fritada': {
            ingredients: [
                { name: 'Carne de cerdo', quantity: 250, unit: 'g', price: 3.75, purchaseUnit: 'kg', purchasePrice: 15.00 },
                { name: 'Tortilla de papa', quantity: 100, unit: 'g', price: 0.60, purchaseUnit: 'kg', purchasePrice: 6.00 },
                { name: 'Encurtido', quantity: 30, unit: 'g', price: 0.30, purchaseUnit: 'kg', purchasePrice: 10.00 },
                { name: 'Aceite', quantity: 50, unit: 'ml', price: 0.30, purchaseUnit: 'l', purchasePrice: 6.00 }
            ],
            description: 'Carne de cerdo frita con tortilla de papa'
        },
        'llapingacho': {
            ingredients: [
                { name: 'Papa', quantity: 300, unit: 'g', price: 0.90, purchaseUnit: 'kg', purchasePrice: 3.00 },
                { name: 'Queso', quantity: 50, unit: 'g', price: 1.00, purchaseUnit: 'kg', purchasePrice: 20.00 },
                { name: 'Mantequilla', quantity: 20, unit: 'g', price: 0.40, purchaseUnit: 'kg', purchasePrice: 20.00 },
                { name: 'Aceite', quantity: 30, unit: 'ml', price: 0.18, purchaseUnit: 'l', purchasePrice: 6.00 },
                { name: 'Sal', quantity: 5, unit: 'g', price: 0.05, purchaseUnit: 'kg', purchasePrice: 10.00 }
            ],
            description: 'Tortilla de papa con queso'
        },
        'empanada': {
            ingredients: [
                { name: 'Harina de trigo', quantity: 100, unit: 'g', price: 0.30, purchaseUnit: 'kg', purchasePrice: 3.00 },
                { name: 'Queso', quantity: 50, unit: 'g', price: 1.00, purchaseUnit: 'kg', purchasePrice: 20.00 },
                { name: 'Aceite', quantity: 50, unit: 'ml', price: 0.30, purchaseUnit: 'l', purchasePrice: 6.00 },
                { name: 'Sal', quantity: 3, unit: 'g', price: 0.03, purchaseUnit: 'kg', purchasePrice: 10.00 }
            ],
            description: 'Empanada de queso frita'
        },
        'humita': {
            ingredients: [
                { name: 'Choclo', quantity: 200, unit: 'g', price: 0.80, purchaseUnit: 'kg', purchasePrice: 4.00 },
                { name: 'Queso', quantity: 30, unit: 'g', price: 0.60, purchaseUnit: 'kg', purchasePrice: 20.00 },
                { name: 'Mantequilla', quantity: 15, unit: 'g', price: 0.30, purchaseUnit: 'kg', purchasePrice: 20.00 },
                { name: 'Sal', quantity: 3, unit: 'g', price: 0.03, purchaseUnit: 'kg', purchasePrice: 10.00 }
            ],
            description: 'Humita de choclo con queso'
        },
        'tamal': {
            ingredients: [
                { name: 'Harina de maíz', quantity: 150, unit: 'g', price: 0.45, purchaseUnit: 'kg', purchasePrice: 3.00 },
                { name: 'Carne de cerdo', quantity: 100, unit: 'g', price: 1.50, purchaseUnit: 'kg', purchasePrice: 15.00 },
                { name: 'Achiote', quantity: 5, unit: 'g', price: 0.25, purchaseUnit: 'kg', purchasePrice: 50.00 },
                { name: 'Hojas de plátano', quantity: 2, unit: 'hoja', price: 0.20, purchaseUnit: 'docena', purchasePrice: 2.40 }
            ],
            description: 'Tamal de maíz con carne'
        },
        'hamburguesa': {
            ingredients: [
                { name: 'Carne de res', quantity: 150, unit: 'g', price: 2.25, purchaseUnit: 'kg', purchasePrice: 15.00 },
                { name: 'Pan de hamburguesa', quantity: 1, unit: 'unidad', price: 0.50, purchaseUnit: 'unidad', purchasePrice: 0.50 },
                { name: 'Lechuga', quantity: 20, unit: 'g', price: 0.20, purchaseUnit: 'kg', purchasePrice: 10.00 },
                { name: 'Tomate', quantity: 30, unit: 'g', price: 0.15, purchaseUnit: 'kg', purchasePrice: 5.00 },
                { name: 'Queso', quantity: 25, unit: 'g', price: 0.50, purchaseUnit: 'kg', purchasePrice: 20.00 },
                { name: 'Aceite', quantity: 15, unit: 'ml', price: 0.09, purchaseUnit: 'l', purchasePrice: 6.00 }
            ],
            description: 'Hamburguesa clásica con carne, lechuga, tomate y queso'
        },
        'pizza': {
            ingredients: [
                { name: 'Harina de trigo', quantity: 200, unit: 'g', price: 0.60, purchaseUnit: 'kg', purchasePrice: 3.00 },
                { name: 'Salsa de tomate', quantity: 100, unit: 'ml', price: 0.30, purchaseUnit: 'l', purchasePrice: 3.00 },
                { name: 'Queso mozzarella', quantity: 100, unit: 'g', price: 2.00, purchaseUnit: 'kg', purchasePrice: 20.00 },
                { name: 'Jamón', quantity: 50, unit: 'g', price: 1.00, purchaseUnit: 'kg', purchasePrice: 20.00 },
                { name: 'Aceite de oliva', quantity: 20, unit: 'ml', price: 0.20, purchaseUnit: 'l', purchasePrice: 10.00 },
                { name: 'Levadura', quantity: 5, unit: 'g', price: 0.10, purchaseUnit: 'kg', purchasePrice: 20.00 }
            ],
            description: 'Pizza con masa, salsa, queso y jamón'
        },
        'pasta': {
            ingredients: [
                { name: 'Pasta', quantity: 150, unit: 'g', price: 0.75, purchaseUnit: 'kg', purchasePrice: 5.00 },
                { name: 'Salsa de tomate', quantity: 100, unit: 'ml', price: 0.30, purchaseUnit: 'l', purchasePrice: 3.00 },
                { name: 'Carne molida', quantity: 100, unit: 'g', price: 1.50, purchaseUnit: 'kg', purchasePrice: 15.00 },
                { name: 'Cebolla', quantity: 30, unit: 'g', price: 0.15, purchaseUnit: 'kg', purchasePrice: 5.00 },
                { name: 'Ajo', quantity: 5, unit: 'g', price: 0.10, purchaseUnit: 'kg', purchasePrice: 20.00 },
                { name: 'Aceite', quantity: 20, unit: 'ml', price: 0.12, purchaseUnit: 'l', purchasePrice: 6.00 }
            ],
            description: 'Pasta con salsa de carne y tomate'
        },
        'ensalada': {
            ingredients: [
                { name: 'Lechuga', quantity: 100, unit: 'g', price: 1.00, purchaseUnit: 'kg', purchasePrice: 10.00 },
                { name: 'Tomate', quantity: 80, unit: 'g', price: 0.40, purchaseUnit: 'kg', purchasePrice: 5.00 },
                { name: 'Cebolla', quantity: 30, unit: 'g', price: 0.15, purchaseUnit: 'kg', purchasePrice: 5.00 },
                { name: 'Aceite de oliva', quantity: 15, unit: 'ml', price: 0.15, purchaseUnit: 'l', purchasePrice: 10.00 },
                { name: 'Limón', quantity: 20, unit: 'ml', price: 0.08, purchaseUnit: 'kg', purchasePrice: 4.00 },
                { name: 'Sal', quantity: 3, unit: 'g', price: 0.03, purchaseUnit: 'kg', purchasePrice: 10.00 }
            ],
            description: 'Ensalada fresca con lechuga, tomate y aderezo'
        },
        'sopa': {
            ingredients: [
                { name: 'Caldo de pollo', quantity: 300, unit: 'ml', price: 0.90, purchaseUnit: 'l', purchasePrice: 3.00 },
                { name: 'Verduras', quantity: 100, unit: 'g', price: 0.80, purchaseUnit: 'kg', purchasePrice: 8.00 },
                { name: 'Fideos', quantity: 50, unit: 'g', price: 0.25, purchaseUnit: 'kg', purchasePrice: 5.00 },
                { name: 'Pollo', quantity: 80, unit: 'g', price: 1.20, purchaseUnit: 'kg', purchasePrice: 15.00 },
                { name: 'Sal', quantity: 3, unit: 'g', price: 0.03, purchaseUnit: 'kg', purchasePrice: 10.00 }
            ],
            description: 'Sopa de pollo con verduras y fideos'
        },
        'café': {
            ingredients: [
                { name: 'Café molido', quantity: 15, unit: 'g', price: 0.30, purchaseUnit: 'kg', purchasePrice: 20.00 },
                { name: 'Agua', quantity: 200, unit: 'ml', price: 0.00, purchaseUnit: 'l', purchasePrice: 0.00 },
                { name: 'Azúcar', quantity: 10, unit: 'g', price: 0.06, purchaseUnit: 'kg', purchasePrice: 6.00 }
            ],
            description: 'Café negro con azúcar'
        },
        'jugo': {
            ingredients: [
                { name: 'Fruta (naranja)', quantity: 200, unit: 'g', price: 0.80, purchaseUnit: 'kg', purchasePrice: 4.00 },
                { name: 'Azúcar', quantity: 15, unit: 'g', price: 0.09, purchaseUnit: 'kg', purchasePrice: 6.00 },
                { name: 'Agua', quantity: 100, unit: 'ml', price: 0.00, purchaseUnit: 'l', purchasePrice: 0.00 }
            ],
            description: 'Jugo natural de frutas'
        }
    };
    
    // Búsqueda por coincidencia exacta
    if (ecuadorianDishes[normalizedName]) {
        return {
            found: true,
            dish: ecuadorianDishes[normalizedName],
            confidence: 'high',
            message: `Plato ecuatoriano reconocido: ${ecuadorianDishes[normalizedName].description}`
        };
    }
    
    // Búsqueda por palabras clave
    const keywords = {
        'pollo': 'seco de pollo',
        'chivo': 'seco de chivo',
        'pescado': 'ceviche',
        'atún': 'encebollado',
        'cerdo': 'hornado',
        'frita': 'fritada',
        'papa': 'llapingacho',
        'empanada': 'empanada',
        'choclo': 'humita',
        'maíz': 'tamal',
        'hamburguesa': 'hamburguesa',
        'pizza': 'pizza',
        'pasta': 'pasta',
        'ensalada': 'ensalada',
        'sopa': 'sopa'
    };
    
    for (const [keyword, dishType] of Object.entries(keywords)) {
        if (normalizedName.includes(keyword)) {
            if (ecuadorianDishes[dishType]) {
                return {
                    found: true,
                    dish: ecuadorianDishes[dishType],
                    confidence: 'medium',
                    message: `Plato sugerido basado en "${keyword}": ${ecuadorianDishes[dishType].description}`
                };
            }
        }
    }
    
    // Si no se encuentra, generar ingredientes genéricos basados en el tipo de negocio
    return generateGenericIngredients(normalizedName, businessType);
}

function generateGenericIngredients(dishName, businessType) {
    const genericIngredients = {
        'restaurante': [
            { name: 'Ingrediente principal', quantity: 200, unit: 'g', price: 3.00, purchaseUnit: 'kg', purchasePrice: 15.00 },
            { name: 'Aceite', quantity: 30, unit: 'ml', price: 0.18, purchaseUnit: 'l', purchasePrice: 6.00 },
            { name: 'Sal', quantity: 5, unit: 'g', price: 0.05, purchaseUnit: 'kg', purchasePrice: 10.00 },
            { name: 'Especias', quantity: 10, unit: 'g', price: 0.30, purchaseUnit: 'kg', purchasePrice: 30.00 }
        ],
        'cafeteria': [
            { name: 'Café', quantity: 20, unit: 'g', price: 0.40, purchaseUnit: 'kg', purchasePrice: 20.00 },
            { name: 'Azúcar', quantity: 15, unit: 'g', price: 0.09, purchaseUnit: 'kg', purchasePrice: 6.00 },
            { name: 'Leche', quantity: 100, unit: 'ml', price: 0.30, purchaseUnit: 'l', purchasePrice: 3.00 }
        ],
        'panaderia': [
            { name: 'Harina de trigo', quantity: 200, unit: 'g', price: 0.60, purchaseUnit: 'kg', purchasePrice: 3.00 },
            { name: 'Levadura', quantity: 10, unit: 'g', price: 0.20, purchaseUnit: 'kg', purchasePrice: 20.00 },
            { name: 'Azúcar', quantity: 20, unit: 'g', price: 0.12, purchaseUnit: 'kg', purchasePrice: 6.00 },
            { name: 'Sal', quantity: 5, unit: 'g', price: 0.05, purchaseUnit: 'kg', purchasePrice: 10.00 }
        ]
    };
    
    return {
        found: false,
        dish: {
            ingredients: genericIngredients[businessType] || genericIngredients['restaurante'],
            description: `Plato genérico: ${dishName}`
        },
        confidence: 'low',
        message: `No se encontró el plato específico. Se generaron ingredientes genéricos para ${businessType}.`
    };
}

function suggestIngredientsForDish(productId) {
    // Función deshabilitada para evitar mensajes automáticos
    // Los análisis de IA ahora solo se ejecutan cuando se hace clic en "Analizar"
    return;
    
    /*
    const productNameInput = document.querySelector(`[data-product="${productId}"].product-name`);
    if (!productNameInput) return;
    
    const dishName = productNameInput.value.trim();
    if (!dishName) return;
    
    // Obtener el tipo de negocio del contexto
    const businessType = businessData.configuracion.tipoNegocio || 'restaurante';
    
    // Analizar el plato con IA
    const analysis = analyzeDishWithAI(dishName, businessType);
    
    // Mostrar sugerencia (solo información, sin aplicar automáticamente)
    showDishAnalysis(analysis, productId);
    */
}

// Función para corregir consistencia (mantenida para el botón "Corregir Automáticamente")
function fixDishConsistency(productId) {
    const productCard = document.getElementById(`producto${productId}`);
    if (!productCard) return;
    
    const productName = productCard.querySelector('.product-name').value.trim();
    const businessType = businessData.configuracion.tipoNegocio || 'restaurante';
    
    // Analizar el plato y aplicar ingredientes correctos
    const analysis = analyzeDishWithAI(productName, businessType);
    
    if (analysis.found) {
        applySuggestedIngredients(productId, analysis.dish.ingredients);
        showNotification('Ingredientes corregidos automáticamente', 'success');
    } else {
        showNotification('No se pudo corregir automáticamente. Revisa manualmente.', 'error');
    }
}

// Función para analizar el paso actual
function analyzeCurrentStep() {
    const currentStep = getCurrentStep();
    console.log('Analizando paso actual:', currentStep);
    
    // Cambiar estado del botón de analizar
    const analyzeBtn = document.getElementById('analyzeBtn');
    if (analyzeBtn) {
        analyzeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analizando...';
        analyzeBtn.disabled = true;
    }
    
    // Validar según el paso actual
    let isValid = false;
    let validationMessage = '';
    
    switch (currentStep) {
        case 1: // Configuración
            console.log('Validando paso 1: Configuración');
            isValid = validateConfiguration();
            console.log('validateConfiguration() retornó:', isValid);
            if (isValid) {
                isValid = validateConfigurationWithAI();
                console.log('validateConfigurationWithAI() retornó:', isValid);
            }
            validationMessage = 'configuración';
            break;
            
        case 2: // Inversión
            console.log('Validando paso 2: Inversión');
            isValid = validateInvestment();
            console.log('validateInvestment() retornó:', isValid);
            if (isValid) {
                isValid = validateInvestmentWithAI();
                console.log('validateInvestmentWithAI() retornó:', isValid);
            }
            validationMessage = 'inversión';
            break;
            
        case 3: // Costos Fijos
            console.log('Validando paso 3: Costos Fijos');
            isValid = validateFixedCosts();
            console.log('validateFixedCosts() retornó:', isValid);
            if (isValid) {
                isValid = validateFixedCostsWithAI();
                console.log('validateFixedCostsWithAI() retornó:', isValid);
            }
            validationMessage = 'costos fijos';
            break;
            
        case 4: // Costos Variables
            console.log('Validando paso 4: Costos Variables');
            isValid = validateVariableCosts();
            console.log('validateVariableCosts() retornó:', isValid);
            if (isValid) {
                isValid = validateVariableCostsWithAI();
                console.log('validateVariableCostsWithAI() retornó:', isValid);
            }
            validationMessage = 'costos variables';
            break;
            
        case 5: // Precios
            console.log('Validando paso 5: Precios');
            isValid = validatePricing();
            console.log('validatePricing() retornó:', isValid);
            if (isValid) {
                isValid = validatePricingWithAI();
                console.log('validatePricingWithAI() retornó:', isValid);
            }
            validationMessage = 'precios';
            break;
            
        default:
            isValid = false;
            validationMessage = 'paso actual';
    }
    
    // Restaurar botón de analizar
    if (analyzeBtn) {
        analyzeBtn.innerHTML = '<i class="fas fa-robot"></i> Analizar';
        analyzeBtn.disabled = false;
    }
    
    // Habilitar o deshabilitar botón siguiente
    console.log('Resultado final de validación:', isValid);
    
    // Buscar el botón siguiente en el paso actual
    const currentStepElement = document.querySelector('.form-step.active');
    const nextBtn = currentStepElement ? currentStepElement.querySelector('#nextBtn') : null;
    
    if (nextBtn) {
        console.log('Botón siguiente encontrado, estado actual:', nextBtn.disabled);
        if (isValid) {
            nextBtn.disabled = false;
            console.log('Botón siguiente habilitado');
            showNotification(`✅ Análisis completado. Los ${validationMessage} están correctos.`, 'success');
        } else {
            nextBtn.disabled = true;
            console.log('Botón siguiente deshabilitado');
            showNotification(`❌ Análisis completado. Hay errores en los ${validationMessage}. Revisa los mensajes anteriores.`, 'error');
        }
    } else {
        console.log('ERROR: No se encontró el botón siguiente en el paso actual');
    }
    
    return isValid;
}

// Función para obtener el paso actual
function getCurrentStep() {
    const currentStepElement = document.querySelector('.form-step.active');
    if (currentStepElement) {
        return parseInt(currentStepElement.getAttribute('data-step'));
    }
    return 1;
}

function showDishAnalysis(analysis, productId) {
    // Remover análisis anterior
    const existingAnalysis = document.querySelector(`[data-product="${productId}"] .dish-analysis`);
    if (existingAnalysis) {
        existingAnalysis.remove();
    }
    
    const productCard = document.getElementById(`producto${productId}`);
    if (!productCard) return;
    
    const analysisHtml = `
        <div class="dish-analysis" data-product="${productId}" style="display: none;">
            <div class="analysis-header">
                <i class="fas fa-robot"></i>
                <strong>Análisis IA: ${analysis.message}</strong>
            </div>
            <div class="analysis-content">
                <p><strong>Confianza:</strong> ${analysis.confidence === 'high' ? 'Alta' : analysis.confidence === 'medium' ? 'Media' : 'Baja'}</p>
                <p><strong>Descripción:</strong> ${analysis.dish.description}</p>
                ${analysis.found && analysis.confidence !== 'low' ? 
                    '<button type="button" class="btn btn-sm btn-primary" onclick="applySuggestedIngredients(' + productId + ', ' + JSON.stringify(analysis.dish.ingredients).replace(/"/g, '&quot;') + ')">Aplicar Ingredientes Sugeridos</button>' : 
                    ''
                }
            </div>
        </div>
    `;
    
    // Insertar después del nombre del producto
    const productNameContainer = productCard.querySelector('.form-row');
    productNameContainer.insertAdjacentHTML('afterend', analysisHtml);
}

function applySuggestedIngredients(productId, ingredients) {
    const ingredientsList = document.getElementById(`ingredients${productId}`);
    if (!ingredientsList) return;
    
    // Limpiar ingredientes existentes
    ingredientsList.innerHTML = '';
    
    // Agregar ingredientes sugeridos
    ingredients.forEach((ingredient, index) => {
        const ingredientId = index + 1;
        const ingredientHtml = createIngredientHTML(productId, ingredientId, ingredient);
        ingredientsList.innerHTML += ingredientHtml;
    });
    
    // Actualizar cálculos
    calculateProductCost(productId);
    updateBusinessDataFromForm();
    saveToStorage();
    generateStepSummaries();
    
    // Mostrar mensaje de confirmación
    showNotification('Ingredientes aplicados correctamente', 'success');
}

function createIngredientHTML(productId, ingredientId, ingredient = null) {
    return `
        <div class="ingredient-item">
            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">Ingrediente</label>
                    <input type="text" class="form-input ingredient-name" placeholder="Ej: Carne de res" data-product="${productId}" data-ingredient="${ingredientId}" value="${ingredient ? ingredient.name : ''}">
                </div>
                <div class="form-group">
                    <label class="form-label">Cantidad</label>
                    <input type="number" class="form-input ingredient-quantity" placeholder="100" data-product="${productId}" data-ingredient="${ingredientId}" step="0.1" value="${ingredient ? ingredient.quantity : ''}">
                </div>
                <div class="form-group">
                    <label class="form-label">Unidad</label>
                    <select class="form-select ingredient-unit" data-product="${productId}" data-ingredient="${ingredientId}">
                        <option value="g" ${ingredient && ingredient.unit === 'g' ? 'selected' : ''}>Gramos (g)</option>
                        <option value="kg" ${ingredient && ingredient.unit === 'kg' ? 'selected' : ''}>Kilogramos (kg)</option>
                        <option value="ml" ${ingredient && ingredient.unit === 'ml' ? 'selected' : ''}>Mililitros (ml)</option>
                        <option value="l" ${ingredient && ingredient.unit === 'l' ? 'selected' : ''}>Litros (l)</option>
                        <option value="unidad" ${ingredient && ingredient.unit === 'unidad' ? 'selected' : ''}>Unidad</option>
                        <option value="hoja" ${ingredient && ingredient.unit === 'hoja' ? 'selected' : ''}>Hoja</option>
                        <option value="rebanada" ${ingredient && ingredient.unit === 'rebanada' ? 'selected' : ''}>Rebanada</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Precio de Compra</label>
                    <input type="number" class="form-input ingredient-price" placeholder="0" data-product="${productId}" data-ingredient="${ingredientId}" step="0.01" value="${ingredient ? ingredient.purchasePrice : ''}">
                </div>
                <div class="form-group">
                    <label class="form-label">Unidad de Compra</label>
                    <select class="form-select ingredient-purchase-unit" data-product="${productId}" data-ingredient="${ingredientId}">
                        <option value="">Seleccionar unidad</option>
                        <option value="kg" ${ingredient && ingredient.purchaseUnit === 'kg' ? 'selected' : ''}>Kilogramos (kg)</option>
                        <option value="g" ${ingredient && ingredient.purchaseUnit === 'g' ? 'selected' : ''}>Gramos (g)</option>
                        <option value="l" ${ingredient && ingredient.purchaseUnit === 'l' ? 'selected' : ''}>Litros (l)</option>
                        <option value="ml" ${ingredient && ingredient.purchaseUnit === 'ml' ? 'selected' : ''}>Mililitros (ml)</option>
                        <option value="unidad" ${ingredient && ingredient.purchaseUnit === 'unidad' ? 'selected' : ''}>Unidad</option>
                        <option value="caja" ${ingredient && ingredient.purchaseUnit === 'caja' ? 'selected' : ''}>Caja</option>
                        <option value="paquete" ${ingredient && ingredient.purchaseUnit === 'paquete' ? 'selected' : ''}>Paquete</option>
                        <option value="botella" ${ingredient && ingredient.purchaseUnit === 'botella' ? 'selected' : ''}>Botella</option>
                        <option value="lata" ${ingredient && ingredient.purchaseUnit === 'lata' ? 'selected' : ''}>Lata</option>
                        <option value="bolsa" ${ingredient && ingredient.purchaseUnit === 'bolsa' ? 'selected' : ''}>Bolsa</option>
                        <option value="docena" ${ingredient && ingredient.purchaseUnit === 'docena' ? 'selected' : ''}>Docena</option>
                        <option value="kilo" ${ingredient && ingredient.purchaseUnit === 'kilo' ? 'selected' : ''}>Kilo</option>
                        <option value="libra" ${ingredient && ingredient.purchaseUnit === 'libra' ? 'selected' : ''}>Libra</option>
                        <option value="onza" ${ingredient && ingredient.purchaseUnit === 'onza' ? 'selected' : ''}>Onza</option>
                        <option value="taza" ${ingredient && ingredient.purchaseUnit === 'taza' ? 'selected' : ''}>Taza</option>
                        <option value="cucharada" ${ingredient && ingredient.purchaseUnit === 'cucharada' ? 'selected' : ''}>Cucharada</option>
                        <option value="cucharadita" ${ingredient && ingredient.purchaseUnit === 'cucharadita' ? 'selected' : ''}>Cucharadita</option>
                    </select>
                </div>
            </div>
            <button type="button" class="btn-remove-ingredient" onclick="removeIngredient(${productId}, ${ingredientId})">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
}

function showNotification(message, type = 'info') {
    // Crear notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
        <button type="button" class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Agregar al body
    document.body.appendChild(notification);
    
    // Remover automáticamente después de 5 segundos
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
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
    
    // Actualizar resúmenes
    generateStepSummaries();
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
        
        // Actualizar resúmenes
        generateStepSummaries();
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
                    <input type="text" class="form-input product-name" placeholder="Ej: Seco de Pollo, Ceviche, Hamburguesa..." data-product="${productId}">
                    <div class="form-help">Escribe el nombre del plato. La IA analizará los ingredientes cuando hagas clic en "Analizar"</div>
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
                                <label class="form-label">Precio por Unidad de Compra</label>
                                <input type="number" class="form-input ingredient-price" placeholder="0" data-product="${productId}" data-ingredient="1" step="0.01">
                            </div>
                        </div>
                        <button type="button" class="btn-remove-ingredient" onclick="removeIngredient(${productId}, 1)">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
                <button type="button" class="btn btn-secondary btn-add-ingredient" onclick="addIngredient(${productId})">
                    <i class="fas fa-plus"></i> Agregar Ingrediente
                </button>
            </div>
            
            <div class="product-summary">
                <div class="summary-item">
                    <span>Costo Total:</span>
                    <span class="product-total-cost" id="productTotal${productId}">$0.00</span>
                </div>
            </div>
        </div>
    `;
}

function generateProductCards() {
    // Generar productos iniciales si no existen
    const productsContainer = document.querySelector('.products-container');
    if (productsContainer && productsContainer.children.length === 0) {
        addProduct(); // Agregar primer producto por defecto
    }
}

function generatePricingFields() {
    const pricingContainer = document.getElementById('pricingContainer');
    if (!pricingContainer) return;
    
    // Limpiar contenedor
    pricingContainer.innerHTML = '';
    
    // Obtener productos de costos variables
    const products = businessData.costosVariables.productos || [];
    
    if (products.length === 0) {
        pricingContainer.innerHTML = '<div class="alert alert-warning">No hay productos definidos. Completa el paso anterior primero.</div>';
        return;
    }
    
    // Generar campos de precio para cada producto
    products.forEach(product => {
        const priceField = document.createElement('div');
        priceField.className = 'form-section';
        priceField.innerHTML = `
            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">${product.nombre}</label>
                    <input type="number" class="form-input price-input" data-product="${product.id}" placeholder="0" min="0" step="0.01">
                    <div class="form-help">Precio de venta sugerido: $${(product.costoTotal * 2.5).toFixed(2)}</div>
                </div>
            </div>
        `;
        pricingContainer.appendChild(priceField);
    });
    
    // Actualizar resúmenes
    generateStepSummaries();
}

function calculatePricingAnalysis() {
    const products = businessData.costosVariables.productos || [];
    const prices = businessData.precios.productos || {};
    
    if (products.length === 0) return;
    
    let totalMargin = 0;
    let productCount = 0;
    let criticalProducts = 0;
    let mostProfitable = null;
    let leastProfitable = null;
    let maxMargin = 0;
    let minMargin = Infinity;
    
    products.forEach(product => {
        const price = prices[product.id] || 0;
        const cost = product.costoTotal || 0;
        
        if (price > 0 && cost > 0) {
            const margin = ((price - cost) / price) * 100;
            totalMargin += margin;
            productCount++;
            
            if (margin < 20) {
                criticalProducts++;
            }
            
            if (margin > maxMargin) {
                maxMargin = margin;
                mostProfitable = product.nombre;
            }
            
            if (margin < minMargin) {
                minMargin = margin;
                leastProfitable = product.nombre;
            }
        }
    });
    
    // Actualizar elementos en el DOM
    const avgMarginElement = document.getElementById('margenPromedio');
    const mostProfitableElement = document.getElementById('productoMasRentable');
    const leastProfitableElement = document.getElementById('productoMenosRentable');
    const criticalElement = document.getElementById('productosCriticos');
    
    if (avgMarginElement) {
        avgMarginElement.textContent = productCount > 0 ? `${(totalMargin / productCount).toFixed(1)}%` : '0%';
    }
    
    if (mostProfitableElement) {
        mostProfitableElement.textContent = mostProfitable || '-';
    }
    
    if (leastProfitableElement) {
        leastProfitableElement.textContent = leastProfitable || '-';
    }
    
    if (criticalElement) {
        criticalElement.textContent = criticalProducts.toString();
    }
}

function calculateBreakEven() {
    const fixedCosts = businessData.costosFijos.total || 0;
    const products = businessData.costosVariables.productos || [];
    const prices = businessData.precios.productos || {};
    
    if (fixedCosts === 0 || products.length === 0) return;
    
    // Calcular precio promedio y costo promedio
    let totalPrice = 0;
    let totalCost = 0;
    let productCount = 0;
    
    products.forEach(product => {
        const price = prices[product.id] || 0;
        const cost = product.costoTotal || 0;
        
        if (price > 0 && cost > 0) {
            totalPrice += price;
            totalCost += cost;
            productCount++;
        }
    });
    
    if (productCount === 0) return;
    
    const avgPrice = totalPrice / productCount;
    const avgCost = totalCost / productCount;
    const contributionMargin = avgPrice - avgCost;
    
    if (contributionMargin <= 0) return;
    
    const breakEvenUnits = fixedCosts / contributionMargin;
    const breakEvenSales = breakEvenUnits * avgPrice;
    
    // Actualizar elementos en el DOM
    const unitsElement = document.getElementById('unidadesEquilibrio');
    const salesElement = document.getElementById('ventasEquilibrio');
    
    if (unitsElement) {
        unitsElement.textContent = Math.ceil(breakEvenUnits).toString();
    }
    
    if (salesElement) {
        salesElement.textContent = `$${breakEvenSales.toFixed(2)}`;
    }
}

function calculateCashFlow() {
    const fixedCosts = businessData.costosFijos.total || 0;
    const products = businessData.costosVariables.productos || [];
    const prices = businessData.precios.productos || {};
    
    if (fixedCosts === 0 || products.length === 0) return;
    
    // Simulación de 12 meses
    let totalProfit = 0;
    let bestMonth = 0;
    let worstMonth = Infinity;
    
    for (let month = 1; month <= 12; month++) {
        // Simular ventas (crecimiento gradual)
        const baseSales = 100; // Ventas base
        const growthRate = 0.1; // 10% de crecimiento mensual
        const monthlySales = baseSales * (1 + growthRate * month);
        
        let monthlyRevenue = 0;
        let monthlyCosts = 0;
        
        products.forEach(product => {
            const price = prices[product.id] || 0;
            const cost = product.costoTotal || 0;
            const unitsSold = monthlySales / products.length;
            
            monthlyRevenue += price * unitsSold;
            monthlyCosts += cost * unitsSold;
        });
        
        const monthlyProfit = monthlyRevenue - monthlyCosts - fixedCosts;
        totalProfit += monthlyProfit;
        
        if (monthlyProfit > bestMonth) {
            bestMonth = monthlyProfit;
        }
        
        if (monthlyProfit < worstMonth) {
            worstMonth = monthlyProfit;
        }
    }
    
    // Actualizar elementos en el DOM
    const totalProfitElement = document.getElementById('gananciaTotal');
    const bestMonthElement = document.getElementById('mejorMes');
    const worstMonthElement = document.getElementById('peorMes');
    
    if (totalProfitElement) {
        totalProfitElement.textContent = `$${totalProfit.toFixed(2)}`;
    }
    
    if (bestMonthElement) {
        bestMonthElement.textContent = `$${bestMonth.toFixed(2)}`;
    }
    
    if (worstMonthElement) {
        worstMonthElement.textContent = `$${worstMonth.toFixed(2)}`;
    }
}

function calculateViabilityScore() {
    let score = 0;
    const maxScore = 100;
    
    // Configuración (20 puntos)
    if (businessData.configuracion.tipoNegocio) score += 10;
    if (businessData.configuracion.categoriaTamaño) score += 10;
    
    // Inversión (20 puntos)
    if (businessData.inversion.totalGastos > 0) score += 10;
    if (businessData.inversion.totalFinanciamiento > 0) score += 10;
    
    // Costos fijos (20 puntos)
    if (businessData.costosFijos.total > 0) score += 20;
    
    // Productos (20 puntos)
    const products = businessData.costosVariables.productos || [];
    if (products.length > 0) score += 20;
    
    // Precios (20 puntos)
    const prices = businessData.precios.productos || {};
    if (Object.keys(prices).length > 0) score += 20;
    
    // Actualizar puntuación en el DOM
    const scoreElement = document.querySelector('.score-value');
    if (scoreElement) {
        scoreElement.textContent = score.toString();
    }
    
    // Determinar decisión
    const decisionElement = document.getElementById('decisionAnswer');
    const reasoningElement = document.getElementById('decisionReasoning');
    
    if (decisionElement && reasoningElement) {
        if (score >= 80) {
            decisionElement.textContent = '¡APROBADO! Tu negocio es viable.';
            decisionElement.className = 'decision-answer approved';
            reasoningElement.textContent = 'Excelente planificación. Todos los aspectos están bien definidos.';
        } else if (score >= 60) {
            decisionElement.textContent = 'CONDICIONAL. Necesitas mejorar algunos aspectos.';
            decisionElement.className = 'decision-answer conditional';
            reasoningElement.textContent = 'Buen proyecto, pero hay áreas que requieren atención.';
        } else {
            decisionElement.textContent = 'RECHAZADO. Necesitas replantear tu estrategia.';
            decisionElement.className = 'decision-answer rejected';
            reasoningElement.textContent = 'El proyecto actual no es viable. Revisa todos los aspectos.';
        }
    }
}

function generateIAAlerts() {
    const alertsContainer = document.getElementById('recommendationsContainer');
    if (!alertsContainer) return;
    
    alertsContainer.innerHTML = '';
    
    const alerts = [];
    
    // Verificar configuración
    if (!businessData.configuracion.tipoNegocio) {
        alerts.push({
            type: 'warning',
            message: 'Define el tipo de negocio para obtener recomendaciones específicas.'
        });
    }
    
    // Verificar inversión
    if (businessData.inversion.totalGastos === 0) {
        alerts.push({
            type: 'error',
            message: 'No has definido gastos de inversión. Esto es crítico para el análisis.'
        });
    }
    
    // Verificar costos fijos
    if (businessData.costosFijos.total === 0) {
        alerts.push({
            type: 'error',
            message: 'Los costos fijos son esenciales. Define al menos el arriendo.'
        });
    }
    
    // Verificar productos
    const products = businessData.costosVariables.productos || [];
    if (products.length === 0) {
        alerts.push({
            type: 'warning',
            message: 'Define al menos un producto para completar el análisis.'
        });
    }
    
    // Generar alertas en el DOM
    alerts.forEach(alert => {
        const alertElement = document.createElement('div');
        alertElement.className = `alert alert-${alert.type}`;
        alertElement.innerHTML = `
            <i class="fas fa-${alert.type === 'error' ? 'exclamation-triangle' : 'info-circle'}"></i>
            <div>${alert.message}</div>
        `;
        alertsContainer.appendChild(alertElement);
    });
}

function guardarSimulacion() {
    const simulationData = {
        ...businessData,
        timestamp: new Date().toISOString(),
        id: Date.now()
    };
    
    // Guardar en localStorage
    const savedSimulations = JSON.parse(localStorage.getItem('simulations') || '[]');
    savedSimulations.push(simulationData);
    localStorage.setItem('simulations', JSON.stringify(savedSimulations));
    
    alert('Simulación guardada exitosamente.');
}

function exportarReporte() {
    const reportData = {
        configuracion: businessData.configuracion,
        inversion: businessData.inversion,
        costosFijos: businessData.costosFijos,
        costosVariables: businessData.costosVariables,
        precios: businessData.precios,
        timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `simulacion-negocio-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    alert('Reporte exportado exitosamente.');
}

// Funciones para manejar ingredientes
function addIngredient(productId) {
    const ingredientsList = document.getElementById(`ingredients${productId}`);
    const ingredientCount = ingredientsList.querySelectorAll('.ingredient-item').length;
    const newIngredientId = ingredientCount + 1;
    
    const ingredientHtml = createIngredientHTML(productId, newIngredientId);
    ingredientsList.insertAdjacentHTML('beforeend', ingredientHtml);
    
    // Actualizar resúmenes
    generateStepSummaries();
}

function removeIngredient(productId, ingredientId) {
    const ingredientItem = document.querySelector(`[data-product="${productId}"][data-ingredient="${ingredientId}"]`).closest('.ingredient-item');
    if (ingredientItem) {
        ingredientItem.remove();
        
        // Actualizar resúmenes
        generateStepSummaries();
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
                    <label class="form-label">Precio por Unidad de Compra</label>
                    <input type="number" class="form-input ingredient-price" placeholder="0" data-product="${productId}" data-ingredient="${ingredientId}" step="0.01">
                </div>
            </div>
            <button type="button" class="btn-remove-ingredient" onclick="removeIngredient(${productId}, ${ingredientId})">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
}

// Variables globales para el manipulador de precios
let originalPrices = {};
let currentPrices = {};

// Función para generar el manipulador de precios
function generatePriceManipulator() {
    const products = businessData.costosVariables.productos || [];
    const prices = businessData.precios.productos || {};
    const controlsContainer = document.getElementById('priceControls');
    
    if (!controlsContainer || products.length === 0) return;
    
    // Guardar precios originales
    originalPrices = { ...prices };
    currentPrices = { ...prices };
    
    controlsContainer.innerHTML = '';
    
    products.forEach(product => {
        const currentPrice = prices[product.id] || 0;
        const cost = product.costoTotal || 0;
        
        // Calcular rango de precios sugerido
        const minPrice = Math.max(cost * 1.1, cost + 1); // Mínimo 10% sobre costo o $1 más
        const maxPrice = cost * 3; // Máximo 3x el costo
        const suggestedPrice = cost * 1.5; // Precio sugerido 50% sobre costo
        
        const controlHtml = `
            <div class="price-control-item">
                <div class="price-control-header">
                    <span class="price-control-title">${product.nombre}</span>
                    <span class="price-control-current">Precio actual: $${currentPrice.toFixed(2)}</span>
                </div>
                <div class="price-slider-container">
                    <input type="range" 
                           class="price-slider" 
                           id="slider_${product.id}"
                           min="${minPrice.toFixed(2)}" 
                           max="${maxPrice.toFixed(2)}" 
                           step="0.01" 
                           value="${currentPrice || suggestedPrice}"
                           data-product-id="${product.id}">
                    <input type="number" 
                           class="price-input-field" 
                           id="input_${product.id}"
                           value="${currentPrice || suggestedPrice}"
                           min="${minPrice.toFixed(2)}" 
                           max="${maxPrice.toFixed(2)}" 
                           step="0.01"
                           data-product-id="${product.id}">
                </div>
                <div class="price-range-info">
                    <span>Mín: $${minPrice.toFixed(2)}</span>
                    <span>Sugerido: $${suggestedPrice.toFixed(2)}</span>
                    <span>Máx: $${maxPrice.toFixed(2)}</span>
                </div>
            </div>
        `;
        
        controlsContainer.insertAdjacentHTML('beforeend', controlHtml);
    });
    
    // Configurar event listeners para los controles
    setupPriceControlEvents();
    
    // Calcular impacto inicial
    updatePriceImpact();
}

// Configurar eventos para los controles de precio
function setupPriceControlEvents() {
    const sliders = document.querySelectorAll('.price-slider');
    const inputs = document.querySelectorAll('.price-input-field');
    
    sliders.forEach(slider => {
        slider.addEventListener('input', function() {
            const productId = this.dataset.productId;
            const input = document.getElementById(`input_${productId}`);
            input.value = this.value;
            currentPrices[productId] = parseFloat(this.value);
            updatePriceImpact();
        });
    });
    
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            const productId = this.dataset.productId;
            const slider = document.getElementById(`slider_${productId}`);
            slider.value = this.value;
            currentPrices[productId] = parseFloat(this.value) || 0;
            updatePriceImpact();
        });
    });
}

// Actualizar el impacto de los cambios de precio
function updatePriceImpact() {
    const products = businessData.costosVariables.productos || [];
    const fixedCosts = businessData.costosFijos.total || 0;
    
    if (products.length === 0 || fixedCosts === 0) return;
    
    // Calcular nuevos promedios
    let totalNewPrice = 0;
    let totalCost = 0;
    let productCount = 0;
    
    products.forEach(product => {
        const newPrice = currentPrices[product.id] || 0;
        const cost = product.costoTotal || 0;
        
        if (newPrice > 0 && cost > 0) {
            totalNewPrice += newPrice;
            totalCost += cost;
            productCount++;
        }
    });
    
    if (productCount === 0) return;
    
    const avgNewPrice = totalNewPrice / productCount;
    const avgCost = totalCost / productCount;
    const newContributionMargin = avgNewPrice - avgCost;
    
    // Calcular nuevo punto de equilibrio
    const newBreakEvenUnits = newContributionMargin > 0 ? fixedCosts / newContributionMargin : 0;
    const newBreakEvenSales = newBreakEvenUnits * avgNewPrice;
    
    // Calcular margen promedio
    const newAverageMargin = ((avgNewPrice - avgCost) / avgNewPrice) * 100;
    
    // Calcular cambio en ventas necesarias
    const originalBreakEvenUnits = parseFloat(document.getElementById('unidadesEquilibrio').textContent) || 0;
    const changeInUnits = newBreakEvenUnits - originalBreakEvenUnits;
    const changeInSales = changeInUnits * avgNewPrice;
    
    // Actualizar elementos del DOM
    const nuevoEquilibrioElement = document.getElementById('nuevoEquilibrio');
    const nuevoMargenElement = document.getElementById('nuevoMargen');
    const cambioVentasElement = document.getElementById('cambioVentas');
    const viabilidadElement = document.getElementById('viabilidadActual');
    
    if (nuevoEquilibrioElement) {
        nuevoEquilibrioElement.textContent = `${Math.ceil(newBreakEvenUnits)} unidades`;
    }
    
    if (nuevoMargenElement) {
        nuevoMargenElement.textContent = `${newAverageMargin.toFixed(1)}%`;
        nuevoMargenElement.className = newAverageMargin >= 30 ? 'impact-value positive' : 'impact-value negative';
    }
    
    if (cambioVentasElement) {
        const changeText = changeInSales >= 0 ? `+$${changeInSales.toFixed(2)}` : `-$${Math.abs(changeInSales).toFixed(2)}`;
        cambioVentasElement.textContent = changeText;
        cambioVentasElement.className = changeInSales <= 0 ? 'impact-value positive' : 'impact-value negative';
    }
    
    if (viabilidadElement) {
        let viability = 'Excelente';
        let viabilityClass = 'positive';
        
        if (newAverageMargin < 20) {
            viability = 'Baja';
            viabilityClass = 'negative';
        } else if (newAverageMargin < 30) {
            viability = 'Media';
            viabilityClass = 'negative';
        } else if (newAverageMargin < 50) {
            viability = 'Buena';
            viabilityClass = 'positive';
        }
        
        viabilidadElement.textContent = viability;
        viabilidadElement.className = `impact-value ${viabilityClass}`;
    }
}

// Aplicar cambios de precio
function aplicarCambiosPrecios() {
    // Actualizar businessData con los nuevos precios
    businessData.precios.productos = { ...currentPrices };
    
    // Guardar en sessionStorage
    sessionStorage.setItem('businessData', JSON.stringify(businessData));
    
    // Recalcular análisis
    calculateBreakEven();
    calculateCashFlow();
    calculateViabilityScore();
    
    // Actualizar precios originales
    originalPrices = { ...currentPrices };
    
    // Mostrar mensaje de confirmación
    alert('Los cambios de precio han sido aplicados exitosamente.');
}

// Restaurar precios originales
function restaurarPreciosOriginales() {
    currentPrices = { ...originalPrices };
    
    // Actualizar controles
    Object.keys(currentPrices).forEach(productId => {
        const slider = document.getElementById(`slider_${productId}`);
        const input = document.getElementById(`input_${productId}`);
        
        if (slider) slider.value = currentPrices[productId];
        if (input) input.value = currentPrices[productId];
    });
    
    updatePriceImpact();
    
    alert('Los precios han sido restaurados a sus valores originales.');
}

// Optimizar precios automáticamente
function optimizarPreciosAutomaticamente() {
    const products = businessData.costosVariables.productos || [];
    const fixedCosts = businessData.costosFijos.total || 0;
    
    if (products.length === 0 || fixedCosts === 0) {
        alert('No hay suficientes datos para optimizar los precios.');
        return;
    }
    
    // Estrategia de optimización: buscar un margen promedio del 40%
    const targetMargin = 0.4; // 40%
    
    products.forEach(product => {
        const cost = product.costoTotal || 0;
        if (cost > 0) {
            // Calcular precio óptimo para 40% de margen
            const optimalPrice = cost / (1 - targetMargin);
            currentPrices[product.id] = optimalPrice;
            
            // Actualizar controles
            const slider = document.getElementById(`slider_${product.id}`);
            const input = document.getElementById(`input_${product.id}`);
            
            if (slider) slider.value = optimalPrice;
            if (input) input.value = optimalPrice;
        }
    });
    
    updatePriceImpact();
    
    alert('Los precios han sido optimizados automáticamente para un margen promedio del 40%.');
}
