# Simulador de Negocios - Prototipo HTML

## Descripción

Este es un prototipo completo de un simulador de negocios para emprendedores que quieren evaluar la viabilidad de su negocio de comida. El sistema guía al usuario paso a paso a través de un análisis completo que incluye:

- Configuración básica del negocio
- Inversión inicial y financiamiento
- Costos fijos mensuales
- Costos variables (recetas)
- Precios de venta
- Análisis final y proyecciones

## Características Principales

### 🎯 **Flujo Paso a Paso**
- 6 pasos secuenciales con barra de progreso
- Validaciones en tiempo real
- Navegación intuitiva entre pasos

### 🧮 **Cálculos Automáticos**
- Cálculo de costos totales de inversión
- Cálculo de costos fijos con cargas sociales
- Cálculo de costos variables por producto
- Punto de equilibrio automático
- Flujo de caja proyectado

### 🤖 **Validaciones Inteligentes**
- Alertas de datos irrealistas
- Sugerencias contextuales
- Validaciones de mercado por ubicación
- Análisis de rentabilidad por producto

### 📊 **Análisis Completo**
- Punto de equilibrio
- Margen de ganancia
- Flujo de caja a 12 meses
- Puntuación de viabilidad
- Recomendaciones personalizadas

## Estructura del Proyecto

```
prot_1/
├── index.html              # Página principal
├── configuracion.html      # Paso 1: Configuración básica
├── inversion.html          # Paso 2: Inversión inicial
├── costos-fijos.html       # Paso 3: Costos fijos
├── costos-variables.html   # Paso 4: Recetas y costos variables
├── precios.html            # Paso 5: Precios de venta
├── analisis.html           # Paso 6: Análisis final
├── styles.css              # Estilos CSS completos
├── script.js               # Funcionalidad JavaScript
└── README.md               # Este archivo
```

## Cómo Usar

### 1. **Inicio**
- Abre `index.html` en tu navegador
- Haz clic en "Nueva Simulación" para comenzar

### 2. **Configuración Básica**
- Selecciona el tipo de negocio (restaurante, cafetería, bar, etc.)
- Define ubicación y tamaño
- Ingresa información básica del negocio

### 3. **Inversión Inicial**
- Ingresa gastos de montaje (equipos, garantías, licencias)
- Define fuentes de financiamiento
- El sistema calcula automáticamente el resumen

### 4. **Costos Fijos**
- Define arriendo, personal y servicios
- El sistema calcula el costo real del personal
- Incluye cargas sociales automáticamente

### 5. **Costos Variables**
- Define hasta 3 productos principales
- Ingresa recetas con ingredientes y cantidades
- Incluye mano de obra por producto

### 6. **Precios de Venta**
- Define precios por producto
- Recibe validaciones de mercado
- Análisis de rentabilidad automático

### 7. **Análisis Final**
- Proyecciones de ventas mensuales
- Punto de equilibrio calculado
- Flujo de caja a 12 meses
- Decisión final con puntuación

## Funcionalidades Técnicas

### **Cálculos Automáticos**
- **Inversión**: Suma automática de gastos y financiamiento
- **Costos Fijos**: Cálculo de cargas sociales (38% adicional)
- **Costos Variables**: Conversión de unidades y costos por producto
- **Punto de Equilibrio**: Cálculo automático basado en costos fijos y margen

### **Validaciones**
- Rangos realistas para precios de mercado
- Validación de capacidad vs proyecciones
- Alertas de datos inconsistentes
- Sugerencias contextuales por ubicación

### **Interfaz Responsiva**
- Diseño moderno y atractivo
- Compatible con móviles y tablets
- Navegación intuitiva
- Feedback visual inmediato

## Tecnologías Utilizadas

- **HTML5**: Estructura semántica
- **CSS3**: Estilos modernos con variables CSS
- **JavaScript**: Funcionalidad interactiva
- **Font Awesome**: Iconos
- **Diseño Responsivo**: Mobile-first approach

## Características de Diseño

### **Paleta de Colores**
- Azul primario: `#2563eb`
- Gris secundario: `#64748b`
- Verde éxito: `#10b981`
- Rojo error: `#ef4444`
- Amarillo advertencia: `#f59e0b`

### **Tipografía**
- Fuente principal: Inter (sistema)
- Jerarquía clara de títulos
- Legibilidad optimizada

### **Componentes**
- Cards con sombras suaves
- Botones con estados hover
- Formularios con validación visual
- Alertas contextuales
- Gráficos y métricas visuales

## Limitaciones del Prototipo

Este es un prototipo funcional que demuestra el flujo completo. Algunas limitaciones:

- **Sin Backend**: Los datos no se guardan permanentemente
- **Sin IA Real**: Las validaciones son simuladas
- **Sin Base de Datos**: No hay persistencia de datos
- **Sin Autenticación**: No hay sistema de usuarios

## Próximos Pasos

Para convertir esto en una aplicación completa:

1. **Backend**: API REST con Node.js/Python
2. **Base de Datos**: PostgreSQL/MongoDB
3. **Autenticación**: Sistema de usuarios
4. **IA Real**: Integración con APIs de IA
5. **Reportes**: Generación de PDFs
6. **Móvil**: App nativa o PWA

## Instalación y Uso

1. Descarga todos los archivos en una carpeta
2. Abre `index.html` en tu navegador
3. ¡Comienza a simular tu negocio!

## Contribución

Este es un prototipo educativo. Si quieres contribuir:

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## Licencia

Este proyecto es educativo y está disponible para uso libre.

---

**Desarrollado para emprendedores que quieren tomar decisiones informadas sobre sus negocios.**
