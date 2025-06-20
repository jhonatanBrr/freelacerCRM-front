import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;
  private version = environment.apiVersion;

  constructor(private http: HttpClient) {}

  private getUrl(endpoint: string): string {
    return `${this.apiUrl}/${this.version}/${endpoint}`;
  }

  get<T>(endpoint: string, params = {}): Observable<T> {
    return this.http.get<T>(this.getUrl(endpoint), { params });
  }

  post<T>(endpoint: string, data: any): Observable<T> {
    return this.http.post<T>(this.getUrl(endpoint), data);
  }

  put<T>(endpoint: string, data: any): Observable<T> {
    return this.http.put<T>(this.getUrl(endpoint), data);
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(this.getUrl(endpoint));
  }
}
