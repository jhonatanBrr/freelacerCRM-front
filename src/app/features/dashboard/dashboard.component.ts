import { Component, OnInit, OnDestroy, signal, computed, effect } from '@angular/core';
import { CounterCardComponent } from '../../shared/counter-card.component/counter-card.component';
import { TableComponent } from '../../shared/table/table.component';
import { Tab, TabsSectionsComponent } from '../../shared/tabs-sections/tabs-sections.component';
import { TabsService } from '../../core/services/tabs/tabs.service';
import { DashboardService } from '../../core/services/dashboard/dashboard.service';
import { ClientsSummary, PendingInvoices, PendingTasks, ProjectsSummary } from '../../core/interfaces/dashboard.interface';
import { Subject, takeUntil, finalize } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  imports: [
    CounterCardComponent,
    TableComponent,
    TabsSectionsComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();

  clientsSummary = signal<ClientsSummary>({
    total_clientes: 0,
    clientes_activos: 0,
    nuevos_ult_mes: 0,
    ultimos_clientes: []
  });

  projectsSummary = signal<ProjectsSummary>({
    total_proyectos_activos: 0,
    proyectos_proximos_vencer: []
  });

  pendingTasks = signal<PendingTasks>({
    total_tareas_pendientes: 0,
    tareas: []
  });

  pendingInvoices = signal<PendingInvoices>({
    total_facturas_pendientes: 0,
    total_monto_pendiente: '0',
    facturas: []
  });

  // Signals para estados de UI
  loading = signal<{ [key: string]: boolean }>({
    clients: false,
    projects: false,
    tasks: false,
    invoices: false
  });

  error = signal<{ [key: string]: string }>({
    clients: '',
    projects: '',
    tasks: '',
    invoices: ''
  });

  // Computed signals para derivar valores
  hasErrors = computed(() => {
    return Object.values(this.error()).some(error => error !== '');
  });

  isLoading = computed(() => {
    return Object.values(this.loading()).some(loading => loading);
  });

  // Table configuration
  columnsClients = [
    { label: 'ID', path: 'id' },
    { label: 'Nombre', path: 'name' },
    { label: 'Empresa', path: 'company' },
    { label: 'Fecha de creación', path: 'created_at' },
  ];

  // Tabs configuration
  tabs: Tab[] = [
    { id: 'clients', label: 'Clients' },
    { id: 'projects', label: 'Projects' },
    { id: 'tasks', label: 'Tasks' },
    { id: 'invoicing', label: 'Invoicing' }
  ];

  // Legacy table data (should be removed when implementing real data)
  columns = [
    { label: 'Name', path: 'name' },
    { label: 'Company', path: 'company.name' },
    { label: 'Email', path: 'contact.email' },
    { label: 'Phone', path: 'contact.phone' },
    { label: 'Status', path: 'status' },
  ];

  rows = [
    {
      name: 'Juan Pérez',
      company: { name: 'Tech Co' },
      contact: {
        email: 'juan@techco.com',
        phone: '+57 312 345 6789',
      },
      status: 'Active',
    },
    {
      name: 'Laura Gómez',
      company: { name: 'Dev Studio' },
      contact: {
        email: 'laura@devstudio.com',
        phone: '+57 311 123 4567',
      },
      status: 'Inactive',
    },
  ];

  constructor(
    public tabsService: TabsService,
    private dashboardService: DashboardService
  ) {
    this.tabsService.init('clients');
  }

  ngOnInit(): void {
    this.loadAllData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Carga todos los datos del dashboard
   */
  loadAllData(): void {
    this.loadClientsSummary();
    this.loadProjectsSummary();
    this.loadPendingTasks();
    this.loadPendingInvoices();
  }

  /**
   * Carga el resumen de clientes
   */
  private loadClientsSummary(): void {
    this.setLoadingState('clients', true);
    this.clearError('clients');
    this.dashboardService.getClientsSummary()
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.setLoadingState('clients', false);
        })
      )
      .subscribe({
        next: (data: ClientsSummary) => {
          this.clientsSummary.set(data);
        },
        error: (error: any) => {
          this.handleError('clients', error);
        }
      });
  }

  /**
   * Carga el resumen de proyectos
   */
  private loadProjectsSummary(): void {
    this.setLoadingState('projects', true);
    this.clearError('projects');

    this.dashboardService.getProjectsSummary()
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.setLoadingState('projects', false))
      )
      .subscribe({
        next: (data: ProjectsSummary) => {
          this.projectsSummary.set(data);
        },
        error: (error: any) => {
          this.handleError('projects', error);
        }
      });
  }

  /**
   * Carga las tareas pendientes
   */
  private loadPendingTasks(): void {
    this.setLoadingState('tasks', true);
    this.clearError('tasks');

    this.dashboardService.getPendingTasks()
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.setLoadingState('tasks', false))
      )
      .subscribe({
        next: (data: PendingTasks) => {
          this.pendingTasks.set(data);
        },
        error: (error: any) => {
          this.handleError('tasks', error);
        }
      });
  }

  /**
   * Carga las facturas pendientes
   */
  private loadPendingInvoices(): void {
    this.setLoadingState('invoices', true);
    this.clearError('invoices');

    this.dashboardService.getPendingInvoices()
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.setLoadingState('invoices', false))
      )
      .subscribe({
        next: (data: PendingInvoices) => {
          this.pendingInvoices.set(data);
        },
        error: (error: any) => {
          this.handleError('invoices', error);
        }
      });
  }

  /**
   * Establece el estado de carga para una sección
   */
  private setLoadingState(section: string, isLoading: boolean): void {
    this.loading.update(current => ({
      ...current,
      [section]: isLoading
    }));
  }

  /**
   * Limpia el error de una sección
   */
  private clearError(section: string): void {
    this.error.update(current => ({
      ...current,
      [section]: ''
    }));
  }

  /**
   * Maneja los errores de las peticiones
   */
  private handleError(section: string, error: any): void {
    const errorMessage = error?.message || 'Ha ocurrido un error al cargar los datos';
    this.error.update(current => ({
      ...current,
      [section]: errorMessage
    }));
    console.error(`Error en ${section}:`, error);
  }

  /**
   * Recarga los datos de una sección específica
   */
  refreshSection(section: string): void {
    switch (section) {
      case 'clients':
        this.loadClientsSummary();
        break;
      case 'projects':
        this.loadProjectsSummary();
        break;
      case 'tasks':
        this.loadPendingTasks();
        break;
      case 'invoices':
        this.loadPendingInvoices();
        break;
      default:
        this.loadAllData();
    }
  }
}
