
# Bellezza byNaomi - Nails & Art

Sitio web profesional para Bellezza byNaomi, un estudio de estética de uñas de alta gama.

## Características

- Catálogo dinámico de servicios.
- Galería de trabajos interactiva.
- Sistema de reservas online con integración de WhatsApp.
- Panel administrativo para gestión de contenidos.
- Diseño minimalista y elegante enfocado en dispositivos móviles.

## Tech Stack

- React 19
- Vite
- Tailwind CSS
- Supabase (Base de Datos y Autenticación)

## Despliegue en Vercel

1. Sube el código a un repositorio de GitHub.
2. Conecta el repositorio en Vercel.
3. Configura las variables de entorno si es necesario (el proyecto ya tiene las claves de Supabase hardcodeadas por simplicidad en este entorno, pero se recomienda usarlas como variables de entorno en producción).
4. Vercel detectará automáticamente la configuración de Vite y realizará el build.

## Estructura

- `components/`: Componentes modulares de la UI.
- `lib/`: Configuración de servicios externos (Supabase).
- `services/`: Lógica de negocio y WhatsApp.
- `types.ts`: Definiciones de TypeScript.
