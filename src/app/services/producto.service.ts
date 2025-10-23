import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.prod';

export interface Categoria {
  categoriaId: number;
  nombre: string;
}

export interface Producto {
  productoId: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  categoriaId?: number;
  categoria?: Categoria;  
  precioVenta: number;
  stock: number;
  stockMinimo: number;
  fechaCreacion: string;
  imagen?: string;  
}

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private apiUrl = `${environment.apiUrl}/productosapi`; // Ajusta el puerto si es necesario

  constructor(private http: HttpClient) {}

  obtenerProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl);
  }

  obtenerProductoPorId(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.apiUrl}/${id}`);
  }
}
/*
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Categoria {
  categoriaId: number;
  nombre: string;
}

export interface Producto {
  productoId: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  categoriaId?: number;
  categoria?: Categoria;  
  precioVenta: number;
  stock: number;
  stockMinimo: number;
  fechaCreacion: string;
  imagen?: string;  
}

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private apiUrl = 'https://localhost:7046/api/productosapi'; // Ajusta el puerto si es necesario

  constructor(private http: HttpClient) {}

  obtenerProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl);
  }

  obtenerProductoPorId(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.apiUrl}/${id}`);
  }
}
*/
