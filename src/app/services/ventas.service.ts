import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.prod';

export interface DetalleVentaRequest {
  productoId: number;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface VentaRequest {
  usuarioId: number;
  usuarioEmail: string;
  detalleVentas: DetalleVentaRequest[];
}

@Injectable({ providedIn: 'root' })
export class VentasService {
  private apiUrl = `${environment.apiUrl}/ventasapi`;

  constructor(private http: HttpClient) {}

  crearVenta(venta: VentaRequest): Observable<any> {
    return this.http.post<any>(this.apiUrl, venta);
  }

  agregarProductoAVenta(ventaId: number, detalle: any): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}/${ventaId}/agregar-producto`, detalle);
}

eliminarProductoDeVenta(ventaId: number, productoId: number): Observable<any> {
  return this.http.delete<any>(`${this.apiUrl}/${ventaId}/eliminar-producto/${productoId}`);
}

}
/*
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DetalleVentaRequest {
  productoId: number;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface VentaRequest {
  usuarioId: number;
  usuarioEmail: string;
  detalleVentas: DetalleVentaRequest[];
}

@Injectable({ providedIn: 'root' })
export class VentasService {
  private apiUrl = 'https://localhost:7046/api/ventasapi';

  constructor(private http: HttpClient) {}

  crearVenta(venta: VentaRequest): Observable<any> {
    return this.http.post<any>(this.apiUrl, venta);
  }

  agregarProductoAVenta(ventaId: number, detalle: any): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}/${ventaId}/agregar-producto`, detalle);
}

eliminarProductoDeVenta(ventaId: number, productoId: number): Observable<any> {
  return this.http.delete<any>(`${this.apiUrl}/${ventaId}/eliminar-producto/${productoId}`);
}

}
*/