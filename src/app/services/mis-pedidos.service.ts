import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment.prod';

@Injectable({ providedIn: 'root' })
export class PedidosService {
  private apiUrl = `${environment.apiUrl}/Usuariosclientes`;

  constructor(private http: HttpClient) {}

  obtenerPedidosUsuario(usuarioId: number): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/${usuarioId}/pedidos`);
}



}

/*
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PedidosService {
  private apiUrl = 'https://localhost:7046/api/Usuariosclientes';

  constructor(private http: HttpClient) {}

  obtenerPedidosUsuario(usuarioId: number): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/${usuarioId}/pedidos`);
}



}
*/
