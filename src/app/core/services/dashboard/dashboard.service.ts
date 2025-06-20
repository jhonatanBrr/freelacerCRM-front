import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../api/api.service';
import { 
  ClientsSummary,
  PendingInvoices, 
  PendingTasks, 
  ProjectsSummary 
} from '../../interfaces/dashboard.interface';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor(private apiService: ApiService) {}
  /**
   * Obtiene el resumen de clientes
   * @returns Observable con el resumen de clientes
   */
  getClientsSummary(): Observable<ClientsSummary> {
    return this.apiService.get<ClientsSummary>('dashboard/resumen_clientes')
  }

  /**
   * Obtiene el resumen de proyectos
   * @returns Observable con el resumen de proyectos
   */
  getProjectsSummary(): Observable<ProjectsSummary> {
    return this.apiService.get<ProjectsSummary>('dashboard/resumen_proyectos')
  }

  /**
   * Obtiene las tareas pendientes
   * @returns Observable con las tareas pendientes
   */
  getPendingTasks(): Observable<PendingTasks> {
    return this.apiService.get<PendingTasks>('dashboard/tareas_pendientes')
  }

  /**
   * Obtiene las facturas pendientes
   * @returns Observable con las facturas pendientes
   */
  getPendingInvoices(): Observable<PendingInvoices> {
    return this.apiService.get<PendingInvoices>('dashboard/facturas_pendientes')
  }

}
