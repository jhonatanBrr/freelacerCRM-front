import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { ApiService } from '../api/api.service';
import { catchError, tap } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

interface AuthResponse {
  access: string;
  refresh: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Flag para evitar múltiples refreshes simultáneos
  private isRefreshing = false;
  
  // Subject que emite el nuevo token cuando se completa un refresh
  // Esto permite que múltiples peticiones esperen el mismo refresh
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);

  constructor(
    private apiService: ApiService,
    // PLATFORM_ID: Token de inyección que nos dice si estamos en navegador o servidor
    // @Inject: Decorator para inyectar tokens manualmente
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
  }

  /**
   * Inicia sesión del usuario
   * @param credentials - Credenciales de login (username, password)
   * @returns Observable con la respuesta del servidor (access + refresh tokens)
   */
  login(credentials: { username: string; password: string }): Observable<AuthResponse> {
    return this.apiService.post<AuthResponse>('token/', credentials).pipe(
      tap(response => {
        // Guarda los tokens en localStorage solo si estamos en el navegador
        if (isPlatformBrowser(this.platformId)) {
          this.setTokens(response.access, response.refresh);
        }
      }),
      catchError((error) => {
        console.error('Login failed:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Obtiene el token de acceso actual
   * @returns Token de acceso o null si no existe
   */
  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('access_token');
    }
    return null;
  }

  /**
   * Obtiene el refresh token actual
   * @returns Refresh token o null si no existe
   */
  getRefreshToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('refresh_token');
    }
    return null;
  }

  /**
   * Guarda los tokens en localStorage
   * @param accessToken - Token de acceso
   * @param refreshToken - Token de refresh (opcional)
   */
  private setTokens(accessToken: string, refreshToken?: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('access_token', accessToken);
      if (refreshToken) {
        localStorage.setItem('refresh_token', refreshToken);
      }
    }
  }

  /**
   * Cierra la sesión del usuario
   * Limpia todos los tokens y datos del usuario
   */
  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      // Emite null para notificar a cualquier suscriptor que el refresh falló
      this.refreshTokenSubject.next(null);
    }
  }

  /**
   * Verifica si el usuario está logueado
   * @returns true si hay un token válido y no ha expirado
   */
  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    // Verificar si el token no ha expirado
    try {
      // Decodifica el payload del JWT (segunda parte del token)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = payload.exp * 1000; // Convierte a milisegundos
      return Date.now() < expirationTime;
    } catch (error) {
      console.error('Error parsing token:', error);
      return false;
    }
  }

  /**
   * Refresca el token de acceso usando el refresh token
   * 
   * LÓGICA IMPORTANTE:
   * 1. Si ya hay un refresh en progreso, espera a que termine
   * 2. Si no hay refresh en progreso, inicia uno nuevo
   * 3. Cuando el refresh termina, notifica a todos los que estaban esperando
   * 
   * @returns Observable con el nuevo token de acceso
   */
  refreshToken(): Observable<AuthResponse> {
    // PASO 1: Verificar que existe un refresh token
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    // PASO 2: Si ya hay un refresh en progreso, esperar a que termine
    if (this.isRefreshing) {
      console.log('Refresh ya en progreso, esperando...');
      
      return new Observable(observer => {
        // Se suscribe al BehaviorSubject para esperar el resultado del refresh en progreso
        const subscription = this.refreshTokenSubject.subscribe({
          next: (token) => {
            if (token) {
              // El refresh fue exitoso, emitir el nuevo token
              console.log('Refresh completado, recibiendo nuevo token');
              observer.next({ access: token, refresh: '' });
              observer.complete();
              subscription.unsubscribe(); // Limpiar suscripción
            }
          },
          error: (error) => {
            // El refresh falló, propagar el error
            console.log('Refresh falló, propagando error');
            observer.error(error);
            subscription.unsubscribe(); // Limpiar suscripción
          }
        });
      });
    }

    // PASO 3: Iniciar nuevo refresh
    console.log('Iniciando nuevo refresh...');
    this.isRefreshing = true;

    return this.apiService.post<AuthResponse>('token/refresh/', {
      refresh: refreshToken
    }).pipe(
      tap(response => {
        // PASO 4: Refresh exitoso
        console.log('Refresh exitoso, guardando nuevo token');
        
        if (isPlatformBrowser(this.platformId)) {
          // Guardar el nuevo token
          this.setTokens(response.access, response.refresh);
          // Notificar a todos los que estaban esperando
          this.refreshTokenSubject.next(response.access);
        }
        this.isRefreshing = false;
      }),
      catchError((error) => {
        // PASO 5: Refresh falló
        console.error('Refresh token failed:', error);
        
        this.isRefreshing = false;
        // Notificar a todos los que estaban esperando que falló
        this.refreshTokenSubject.next(null);
        this.logout();
        return throwError(() => error);
      })
    );
  }

  /**
   * Obtiene información del usuario desde el token JWT
   * @returns Objeto con información del usuario o null si no se puede decodificar
   */
  getUserInfo(): any {
    const token = this.getToken();
    if (!token) return null;

    try {
      // Decodifica el payload del JWT
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        id: payload.user_id,
        username: payload.username,
        email: payload.email,
        // Agregar otros campos según la estructura de tu token
      };
    } catch (error) {
      console.error('Error parsing user info from token:', error);
      return null;
    }
  }

  /**
   * Verifica si el token expirará pronto
   * Útil para hacer refresh proactivo antes de que expire
   * @param minutes - Minutos antes de la expiración para considerar "pronto"
   * @returns true si el token expirará en los próximos X minutos
   */
  isTokenExpiringSoon(minutes: number = 5): boolean {
    const token = this.getToken();
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = payload.exp * 1000;
      const currentTime = Date.now();
      const timeUntilExpiration = expirationTime - currentTime;
      const minutesUntilExpiration = timeUntilExpiration / (1000 * 60);
      
      return minutesUntilExpiration <= minutes;
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return true;
    }
  }
}
