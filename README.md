# Simulador de Negocios - Versión SPA

Un simulador completo para evaluar la viabilidad de negocios de comida, ahora con una interfaz de una sola página (SPA) que no requiere recargas.

## 🚀 Características Principales

### ✨ Nueva Versión SPA
- **Navegación fluida**: Cambio entre pasos sin recargar la página
- **Persistencia automática**: Los datos se guardan automáticamente mientras navegas
- **Resúmenes dinámicos**: Ve un resumen de todos los pasos completados en cada página
- **Barra de progreso**: Visualiza tu avance en tiempo real

### 📊 Funcionalidades del Simulador
- **Configuración del negocio**: Tipo, tamaño, ubicación
- **Inversión inicial**: Gastos de montaje y financiamiento
- **Costos fijos**: Arriendo, personal, servicios
- **Costos variables**: Productos, ingredientes, mano de obra
- **Precios de venta**: Con recomendaciones automáticas de IA
- **Análisis final**: Punto de equilibrio, flujo de caja, viabilidad

### 🤖 Inteligencia Artificial
- Recomendaciones de precios basadas en costos y tipo de negocio
- Alertas automáticas sobre riesgos y oportunidades
- Validaciones inteligentes de datos
- Sugerencias de optimización

## 📁 Estructura del Proyecto

```
PrototipoSimulador/
├── simulador.html          # Nueva página principal del simulador SPA
├── simulador.js            # JavaScript específico para el simulador SPA
├── home.html              # Página de inicio
├── home.js                # JavaScript para la página de inicio
├── index.html             # Página de login
├── auth.js                # Sistema de autenticación
├── styles.css             # Estilos CSS
├── script.js              # Script original (para referencia)
└── README.md              # Este archivo
```

## 🎯 Cómo Usar

### 1. Página de Inicio
- Abre `home.html` en tu navegador
- Elige entre "Versión Completa" (con login) o "Probar Demo"

### 2. Simulador SPA
- Navega por los 6 pasos del simulador
- Los datos se guardan automáticamente
- Puedes regresar a pasos anteriores sin perder información
- Ve resúmenes de pasos completados en cada página

### 3. Pasos del Simulador

#### Paso 1: Configuración
- Selecciona tipo de negocio (Restaurante, Cafetería, Bar, Food Truck)
- Define tamaño del local
- Ingresa información básica

#### Paso 2: Inversión Inicial
- Gastos de montaje (equipos, mobiliario, licencias)
- Fuentes de financiamiento
- Cálculos automáticos de totales

#### Paso 3: Costos Fijos
- Arriendo y servicios
- Personal y salarios
- Otros gastos fijos mensuales

#### Paso 4: Costos Variables
- Define hasta 3 productos principales
- Ingredientes y costos por producto
- Mano de obra por producto

#### Paso 5: Precios de Venta
- Precios recomendados por IA
- Análisis de márgenes
- Recomendaciones de optimización

#### Paso 6: Análisis Final
- Puntuación de viabilidad
- Punto de equilibrio
- Proyecciones de flujo de caja
- Decisión final con razonamiento

## 🔧 Tecnologías Utilizadas

- **HTML5**: Estructura semántica
- **CSS3**: Estilos modernos con variables CSS
- **JavaScript ES6+**: Lógica del simulador
- **SessionStorage**: Persistencia de datos
- **Font Awesome**: Iconografía

## 💾 Persistencia de Datos

El simulador utiliza `sessionStorage` para:
- Guardar datos automáticamente mientras navegas
- Mantener información entre pasos
- Limpiar datos solo al recargar completamente la página

## 🎨 Características de Diseño

- **Responsive**: Funciona en móviles y tablets
- **Accesible**: Navegación por teclado y lectores de pantalla
- **Moderno**: Diseño limpio y profesional
- **Intuitivo**: Interfaz fácil de usar

## 🚀 Instalación y Uso

1. **Clona o descarga** el proyecto
2. **Abre** `home.html` en tu navegador
3. **Haz clic** en "Probar Demo" para usar el simulador
4. **Navega** por los pasos y completa la información
5. **Revisa** el análisis final y las recomendaciones

## 🔄 Migración desde la Versión Anterior

Si tienes datos guardados en la versión anterior:
- Los datos se mantienen en `sessionStorage`
- Puedes continuar desde donde lo dejaste
- La nueva versión es compatible con datos existentes

## 📝 Notas de Desarrollo

### Archivos Principales
- `simulador.html`: Contiene todos los formularios en una sola página
- `simulador.js`: Maneja la navegación y lógica del SPA
- `styles.css`: Incluye estilos específicos para el simulador SPA

### Funciones Clave
- `nextStep()` / `previousStep()`: Navegación entre pasos
- `showStep()`: Muestra/oculta pasos
- `saveToStorage()`: Guarda datos automáticamente
- `generateStepSummaries()`: Crea resúmenes dinámicos

## 🤝 Contribuciones

Para contribuir al proyecto:
1. Fork el repositorio
2. Crea una rama para tu feature
3. Haz commit de tus cambios
4. Abre un Pull Request

## 📄 Licencia

Este proyecto está desarrollado para emprendedores y es de uso libre.

---

**¡Disfruta simulando tu negocio! 🚀**
