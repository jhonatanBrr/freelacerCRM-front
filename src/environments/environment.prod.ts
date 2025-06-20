// Este archivo contiene la configuración para producción (cuando el sitio esté publicado)
export const environment = {
  // Indica que estamos en producción
  production: true,
  
  // URL de la API en producción - usa variables de entorno para mayor seguridad
  // Si no encuentra la variable de entorno, usa una URL por defecto
  apiUrl: process.env['API_URL'] || 'https://api.yourproduction.com/api',
  
  // Versión de la API
  apiVersion: 'v1',
};
