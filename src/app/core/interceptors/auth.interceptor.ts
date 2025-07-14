import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError, switchMap, catchError, of } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

/**
 * Interceptor de autenticación
 * 
 * FUNCIÓN:
 * 1. Agrega el token de autorización a todas las peticiones HTTP
 * 2. Maneja errores 401 (Unauthorized) intentando refresh del token
 * 3. Reintenta la petición original con el nuevo token
 * 4. Si el refresh falla, hace logout y redirige a login
 * 
 * FLUJO DE REFRESH:
 * - Petición → 401 → Intentar refresh → Reintentar petición → Éxito/Error
 */
export const authInterceptor: HttpInterceptorFn = (request: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  const router = inject(Router);
  const auth = inject(AuthService);
  
  // PASO 1: Obtener el token actual
  const token = auth.getToken();

  // esta peticion la excluyo porque al estar invalido el refresh token obtendre un 401
  // al intentar refrescar el token, lo cual volvera a ejecutar la logica de refresh de mi interceptor
  // que nuevamente al solicitar el token generara otro 401, generando un bucle infinito
  if (request.url.includes('token/refresh/')) {
    return next(request); 
  }

  // PASO 2: Si hay token, agregarlo al header de autorización
  if (token) {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // PASO 3: Enviar la petición y manejar errores
  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      console.log(error);
      
      // Solo manejar errores 401 (Unauthorized)
      if (error.status === 401) {
        console.log('Error 401 detectado, intentando refresh token...');
        
        // PASO 4: Verificar si tenemos un refresh token
        const refreshToken = auth.getRefreshToken();
        
        if (refreshToken) {
          console.log('Refresh token encontrado, iniciando refresh...');
          
          // PASO 5: Intentar refresh del token
          return auth.refreshToken().pipe(
            switchMap((response) => {
              console.log(response);
              
              // PASO 6: Si el refresh es exitoso, obtener el nuevo token
              const newToken = auth.getToken();
              if (newToken) {
                console.log('Refresh exitoso, reintentando petición original...');
                
                // PASO 7: Crear nueva petición con el token actualizado
                const newRequest = request.clone({
                  setHeaders: {
                    Authorization: `Bearer ${newToken}`
                  }
                });
                
                // PASO 8: Reintentar la petición original con el nuevo token
                return next(newRequest);
              } else {
                // Si no hay nuevo token después del refresh, algo salió mal
                console.error('Refresh exitoso pero no hay nuevo token');
                auth.logout();
                router.navigate(['/login']);
                return throwError(() => error);
              }
            }),
            catchError((refreshError) => {
              // PASO 9: Si el refresh falla, hacer logout
              console.error('Refresh token failed:', refreshError);
              auth.logout();
              router.navigate(['/login']);
              return throwError(() => error);
            })
          );
        } else {
          // PASO 10: No hay refresh token, hacer logout directamente
          console.log('No hay refresh token disponible, haciendo logout...');
          auth.logout();
          router.navigate(['/login']);
          return throwError(() => error);
        }
      }
      
      // Para otros errores (no 401), simplemente propagar el error
      return throwError(() => error);
    })
  );
};
