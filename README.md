# 🌱 Renace Soacha

## Plataforma Inteligente de Resiliencia Climática

**Transformando datos en resiliencia, tecnología en esperanza.**

---

## 🎯 Contexto Estratégico

El municipio de Soacha, Cundinamarca, se encuentra en una **encrucijada crítica** donde la urbanización acelerada, alta densidad poblacional y construcción informal convergen con los impactos severos del cambio climático. Fenómenos como **inundaciones, remociones en masa y avenidas torrenciales**, exacerbados por la variabilidad climática, han creado un escenario de vulnerabilidad que amenaza la seguridad y bienestar de miles de habitantes.

### El Desafío en Números

- 🌊 **71% de incidencia de inundaciones** en la zona
- ⚠️ **62% no conoce protocolos de evacuación**
- 💰 **81% sin ahorros para emergencias**
- 🍽️ **27% sufre inseguridad alimentaria**
- 📅 **Temporadas críticas**: Marzo-Junio, Octubre-Noviembre
- 👥 **10,605 personas** objetivo de la Fase II del UCRP (2025-2027)

### Proyecto de Resiliencia Climática Urbana (UCRP) - Fase II

El **UCRP**, respaldado por **Zurich Foundation** e implementado por **Cruz Roja Colombiana** en alianza con la **Universidad de La Sabana**, centra sus esfuerzos en las comunidades de **La María y El Danubio**. El objetivo: fortalecer capacidades comunitarias para reducir la vulnerabilidad ante amenazas climáticas, pasando de un **modelo reactivo a uno proactivo y basado en evidencia**.

**Renace Soacha** es la respuesta tecnológica a este desafío, transformando datos dispersos (AVCA/CRMC) en inteligencia accionable mediante:

- 🗺️ Visualización geoespacial interactiva
- 🤖 Inteligencia Artificial para análisis predictivo
- 📲 Alertas tempranas vía notificaciones push
- 💬 Asistente virtual conversacional
- 📊 Dashboard de impacto en tiempo real

---

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+ instalado
- Git instalado
- API Key de Ollama Cloud (gratuita en [ollama.com/settings/keys](https://ollama.com/settings/keys))

### Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/Kapum357/algorythm.git
cd algorythm

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.local.example .env.local
# Editar .env.local y agregar OLLAMA_API_KEY

# 4. Generar claves VAPID para notificaciones push
npm run generate-vapid-keys

# 5. Iniciar servidor de desarrollo
npm run dev

# 6. Abrir en navegador
# http://localhost:3000
```

### Rutas Principales

- `/` - Mapa interactivo de riesgo
- `/alerts` - Sistema de alertas tempranas
- `/dashboard` - Panel de métricas e impacto
- `/ecovigia` - Dashboard integrado EcoVigía
- `/assistant` - Asistente virtual conversacional

---

## 🎯 Definición del Reto (Cruz Roja Colombiana)
------------------------

El desafío consiste en desarrollar un prototipo funcional (web, dashboard o aplicación) que integre datos georreferenciados y visualizaciones interactivas para analizar, monitorear y comunicar información sobre la resiliencia climática urbana en Soacha. La solución debe permitir identificar las zonas de mayor vulnerabilidad, estimar la cantidad de personas afectadas por una emergencia y generar alertas preventivas basadas en datos ambientales o históricos.Líneas de desarrollo posibles:1. Mapa interactivo con capas georreferenciadas que muestre zonas de riesgo, puntos críticos y rutas seguras.2. Dashboard de impacto poblacional: herramienta que calcule cuántas personas o familias fueron afectadas por cada evento y en qué sectores.3. Sistema de predicción o alerta preventiva mediante IA o análisis estadístico de datos climáticos (precipitación, temperatura, humedad).4. Plataforma de reporte ciudadano o panel de control que permita visualizar actualizaciones de campo, fotografías o registros.

**Condiciones que debe cumplir la solución:**
---------------------------------------------

1\. Georreferenciación:   - Integrar mapas de acceso libre (OpenStreetMap, Leaflet, Google Maps, Mapbox, etc.) para representar información territorial.2. Datos abiertos:   - Usar datos disponibles del proyecto RCU (AVCA y CRMC) o fuentes públicas (IDEAM, OpenWeather, datos demográficos).3. Visualización e impacto:   - Permitir filtrar, visualizar y comparar información por zonas, periodos o tipo de evento.4. Inteligencia Artificial o analítica predictiva:   - Aplicar algoritmos simples para generar alertas tempranas o detectar patrones de riesgo.5. Usabilidad:   - Interfaz intuitiva para voluntarios, líderes comunitarios o instituciones sin conocimientos técnicos.6. Escalabilidad:   - Capacidad de extender el sistema a otras comunidades o municipios.

**Entregable esperado:**
------------------------

\- Prototipo funcional o demo navegable (mapa interactivo, dashboard, app o sistema web).- Pitch de 5.- Descripción técnica del modelo de datos, herramientas utilizadas y posibles integraciones con sistemas institucionales.

---

## 🤖 Integración de IA con Ollama Cloud

Este proyecto ahora incluye **capacidades de Inteligencia Artificial** mediante **Ollama Cloud** para potenciar el análisis de resiliencia climática:

### ✨ Nuevas Funcionalidades AI

- **🔍 Análisis Automático de Vulnerabilidades** - Procesa datos CRMC/AVCA y genera insights accionables
- **🌊 Evaluación Inteligente de Riesgo de Inundación** - Análisis contextual por ubicación
- **🚨 Generación de Planes de Emergencia** - Recomendaciones personalizadas para incidentes
- **📊 Predicción de Patrones de Riesgo** - Identifica períodos críticos basándose en datos históricos

### 🚀 Inicio Rápido con IA

1. **Configura tu API Key de Ollama**:

   ```bash
   # Crea .env y agrega:
   OLLAMA_API_KEY=tu_api_key_aqui
   ```

   Obtén tu API key en: [ollama.com/settings/keys](https://ollama.com/settings/keys)

2. **Ejecuta el proyecto**:

   ```bash
   npm install
   npm run dev
   ```

3. **Prueba la demo interactiva**:
   - Visita: [http://localhost:3000/ai-demo](http://localhost:3000/ai-demo)
   - Prueba los 3 casos de uso principales de IA

### 🛠️ Stack Tecnológico AI

- **Ollama Cloud**: Modelos gpt-oss:120b-cloud y glm-4.6:cloud
- **Next.js 16 API Routes**: Endpoints RESTful para servicios de IA
- **React 19**: Interfaz interactiva y componentes reutilizables
- **OpenStreetMap + Leaflet**: Visualización geoespacial

### 🎯 Impacto

La integración de IA transforma DIR-Soacha de una herramienta de visualización a una **plataforma inteligente de gestión de resiliencia** que:

✅ Reduce el tiempo de análisis de vulnerabilidades de horas a minutos  
✅ Genera recomendaciones contextualizadas basadas en datos locales  
✅ Permite anticipar riesgos en lugar de solo reaccionar a emergencias  
✅ Empodera a líderes comunitarios con insights accionables

---

---

## 🔔 Sistema de Notificaciones Push

DIR-Soacha ahora incluye un **sistema completo de notificaciones push** para enviar alertas climáticas en tiempo real a dispositivos móviles y de escritorio.

### 📱 Características

- ✅ **Multiplataforma**: Android, iOS, Windows, Linux, macOS
- ✅ **Tiempo Real**: Notificaciones instantáneas incluso con navegador cerrado
- ✅ **Niveles de Severidad**: Alta (roja), Media (amarilla), Baja (verde)
- ✅ **Seguro**: Encriptación end-to-end con VAPID
- ✅ **Offline-Ready**: Funciona con Service Workers

### � Configuración Rápida

1. **Genera las llaves VAPID**:

   ```bash
   npm run generate-vapid-keys
   ```

2. **Reinicia el servidor**:

   ```bash
   npm run dev
   ```

3. **Activa notificaciones**:
   - Ve a <http://localhost:3000/alerts>
   - Haz clic en "Activar Notificaciones"
   - Acepta el permiso en tu navegador

4. **Prueba el sistema**:
   - Reporta una alerta de cualquier severidad
   - Recibirás una notificación push instantánea

### 📖 Documentación Completa

- Arquitectura, API endpoints, integración con IA
- Solución de problemas y mejores prácticas
