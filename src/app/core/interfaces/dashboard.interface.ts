export interface Client {
    id: number;
    name: string;
    company: string;
    created_at: string;
}

export interface ClientsSummary {
    total_clientes: number;
    clientes_activos: number;
    nuevos_ult_mes: number;
    ultimos_clientes: Client[];
}

export interface Project {
    id: number;
    name: string;
    due_date: string;
    status: 'active' | 'completed' | 'on_hold' | 'cancelled';
}

export interface ProjectsSummary {
    total_proyectos_activos: number;
    proyectos_proximos_vencer: Project[];
}

export interface Task {
    id: number;
    title: string;
    due_date: string;
    status: 'todo' | 'in_progress' | 'completed' | 'cancelled';
    project_name: string;
}

export interface PendingTasks {
    total_tareas_pendientes: number;
    tareas: Task[];
}

export interface Invoice {
    id: number;
    amount: string;
    status: 'pending' | 'partial' | 'paid';
    issued_date: string;
    project_name: string;
}

export interface PendingInvoices {
    total_facturas_pendientes: number;
    total_monto_pendiente: string;
    facturas: Invoice[];
}