import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { Client } from '../../interfaces/dashboard.interface';
import { Observable } from 'rxjs';

export interface Response<T> {
  count: number;
  next: string;
  previous: string;
  results: T[];
}

@Injectable({
  providedIn: 'root'
})

export class ClientsService {
  constructor(private apiService: ApiService) { 

  }

  getClients(page?: number | null): Observable<Response<Client>> {
    return this.apiService.get<Response<Client>>(`clients/${page ? "?page=" + page : ""}`);
  }

  createClient(client: Client): Observable<Client> {
    return this.apiService.post<Client>('clients/', client);
  }
}
