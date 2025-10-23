import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.prod';

export interface UsuarioCliente {
  usuarioId?: number;
  email: string;
  passwordHash: string;
  nombres?: string;
  apellidos?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioClienteService {

  private apiUrl = `${environment.apiUrl}/Usuariosclientes`; // Cambia el puerto según tu backend

  constructor(private http: HttpClient) { }

  registrar(usuario: UsuarioCliente): Observable<any> {
    return this.http.post(`${this.apiUrl}/registrar`, usuario);
  }

  login(usuario: UsuarioCliente): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, usuario);
  }

  obtenerPedidos(usuarioId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${usuarioId}/pedidos`);
  }
}

/*
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UsuarioCliente {
  usuarioId?: number;
  email: string;
  passwordHash: string;
  nombres?: string;
  apellidos?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioClienteService {

  private apiUrl = 'https://localhost:7046/api/Usuariosclientes'; // Cambia el puerto según tu backend

  constructor(private http: HttpClient) { }

  registrar(usuario: UsuarioCliente): Observable<any> {
    return this.http.post(`${this.apiUrl}/registrar`, usuario);
  }

  login(usuario: UsuarioCliente): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, usuario);
  }

  obtenerPedidos(usuarioId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${usuarioId}/pedidos`);
  }
}
*/