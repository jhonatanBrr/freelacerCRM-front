import { Component, OnInit, signal, effect } from '@angular/core';
import { TableComponent } from '../../shared/table/table.component';
import { HeaderContainerComponent } from '../../shared/header-container/header-container.component';
import { ClientsService } from '../../core/services/clients/clients.service';
import { Client } from '../../core/interfaces/dashboard.interface';
import { finalize } from 'rxjs';
import { ModalComponent } from '../../shared/modal/modal.component';
import { DesignSystemModule } from '../../design-system/design-system.module';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoaderService } from '../../core/services/loader/loader.service';

@Component({
  selector: 'app-clients',
  imports: [
    TableComponent,
    HeaderContainerComponent,
    ModalComponent,
    DesignSystemModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss'
})
export class ClientsComponent implements OnInit {
  clients = signal<Client[]>([])
  isOpen = signal<boolean>(false);
  title = signal<string>('Agregar Cliente');
  form: FormGroup;

  page = signal<number>(1)
  totalRecords = signal<number>(0)

  constructor(
    private clientsService: ClientsService,
    private formBuilder: FormBuilder,
    private loaderService: LoaderService
  ) {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      company: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      country: ['', Validators.required],
      notes: ['', Validators.required]
    });

    this.loaderService.setTextLoader('Cargando clientes...');

    effect(() => {
      const currentPage = this.page();
      this.loadClients(currentPage);
    });
  }

  ngOnInit(): void {
    this.loadClients(this.page());
  }

  get getClients(): Client[] {
    return this.clients();
  }

  get totalClients(): number {
    return this.totalRecords()
  }

  get isLoading(): boolean {
    return this.loaderService.isLoadingValue;
  }

  loadClients(page: number): void {
    this.loaderService.setIsLoading(true);
    this.clientsService.getClients(page).pipe(
      finalize(() => {
        this.loaderService.setIsLoading(false)
      })
    ).subscribe({
      next: (clients) => {
        this.clients.set(clients.results)
        this.totalRecords.set(clients.count)
      },
      error: (error) => {
        console.error('Error al cargar los clientes', error)
      }
    })

  }

  columns = [
    { label: 'id', path: 'id' },
    { label: 'Nombre', path: 'name' },
    { label: 'Empresa', path: 'company' },
    { label: 'Email', path: 'email' },
    { label: 'Teléfono', path: 'phone' },
    { label: 'País', path: 'country' },
    { label: 'Notas', path: 'notes' },
    { label: 'Propietario', path: 'owner' },
    { label: 'Creado', path: 'created_at' },
    { label: 'Actualizado', path: 'updated_at' },
  ];

  onAddUser(): void {
    this.isOpen.set(true)
  }

  onClose(): void {
    this.isOpen.set(false)
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.clientsService.createClient({ ...this.form.value }).subscribe({
      next: (client) => {
        console.log('client', client)
      },
      error: (error) => {
        console.error('Error al crear el cliente', error)
      }
    })
  }
}

