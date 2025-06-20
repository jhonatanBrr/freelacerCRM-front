import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { Client } from '../../interfaces/dashboard.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {
  constructor(private apiService: ApiService) { 

  }

  getClients(): Observable<Client[]> {
    return this.apiService.get<Client[]>('clients/');
  }

  createClient(client: Client): Observable<Client> {
    return this.apiService.post<Client>('clients/', client);
  }
}
