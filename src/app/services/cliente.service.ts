import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.prod';

export interface Cliente {
  clienteId?: number;
  nombres: string;
  apellidos: string;
  nombreComercial?: string;
  direccion?: string;
  telefono?: string;
  email?: string;
}

@Injectable({ providedIn: 'root' })
export class ClienteService {
  private apiUrl = `${environment.apiUrl}/clientes`;

  constructor(private http: HttpClient) {}

  crearCliente(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(this.apiUrl, cliente);
  }
  // 🔹 Nuevo método para obtener cliente por email
  obtenerClientePorEmail(email: string): Observable<Cliente | null> {
    return this.http.get<Cliente | null>(`${this.apiUrl}/email/${email}`);
  }
}



/*
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Cliente {
  clienteId?: number;
  nombres: string;
  apellidos: string;
  nombreComercial?: string;
  direccion?: string;
  telefono?: string;
  email?: string;
}

@Injectable({ providedIn: 'root' })
export class ClienteService {
  private apiUrl = 'https://localhost:7046/api/clientes';

  constructor(private http: HttpClient) {}

  crearCliente(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(this.apiUrl, cliente);
  }
  // 🔹 Nuevo método para obtener cliente por email
  obtenerClientePorEmail(email: string): Observable<Cliente | null> {
    return this.http.get<Cliente | null>(`${this.apiUrl}/email/${email}`);
  }
}

*/
