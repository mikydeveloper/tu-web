# ⚡ Tu Web - Plataforma de Cotización y Agendamiento 

Este repositorio contiene el código fuente del Frontend de **Tu Web** (proyecto Aliado Web), una plataforma interactiva diseñada para que dueños de pequeñas y medianas empresas (Mypes) puedan cotizar servicios de desarrollo web y agendar asesorías de forma automatizada.

El proyecto implementa una arquitectura **BaaS (Backend as a Service)** utilizando **Supabase** como capa de datos, separando la lógica de negocio en módulos independientes y altamente escalables.

## 🚀 Tecnologías Utilizadas

* **Framework:** Angular 21 (Standalone Components, Signals, Control Flow `@if`, `@for`).
* **Estilos:** Tailwind CSS (Diseño responsivo, modo oscuro nativo, animaciones custom).
* **Animaciones:** `ng-particles` / `tsparticles-slim` (Fondo de red neuronal interactiva).
* **BaaS (Base de Datos):** Supabase (PostgreSQL) con integración directa vía `@supabase/supabase-js`.
* **Control de Versiones:** Git & GitHub.

## 🏗️ Arquitectura y Módulos Principales

El proyecto sigue los principios SOLID y separa responsabilidades en las siguientes características (features):

1.  **Módulo de Cotización (`/cotizador`):**
    * Formulario reactivo con cálculo de precios en tiempo real.
    * Consulta de catálogo dinámico de servicios desde Supabase.
    * Transacción multi-tabla: Guarda el prospecto, genera la cabecera de la cotización y el detalle de la misma.
2.  **Módulo de Agendamiento (`/agendar`):**
    * Comportamiento adaptativo: Detecta si el usuario proviene del cotizador (recibe ID por URL) o si es tráfico directo desde el Navbar.
    * Simulación de integración con Google Meet para salas de videollamada.
3.  **Capa DAO (`core/services/supabase.ts`):**
    * Servicio inyectable que centraliza y encapsula todas las peticiones asíncronas a PostgreSQL.

## 🛠️ Requisitos Previos

Asegúrate de tener instalado en tu entorno local:
* [Node.js](https://nodejs.org/) (v18 o superior).
* [Angular CLI](https://angular.dev/tools/cli) (`npm install -g @angular/cli`).
* Una cuenta en [Supabase](https://supabase.com/) con un proyecto creado.

## ⚙️ Instalación y Configuración Local

**1. Clonar el repositorio:**
```bash
git clone [https://github.com/mikydeveloper/tu-web.git](https://github.com/mikydeveloper/tu-web.git)
cd tu-web
