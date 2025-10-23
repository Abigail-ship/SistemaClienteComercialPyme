import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.prod';

// Modelo opcional para tipar la suscripción
export interface Suscripcion {
  suscripcionId?: number;
  email: string;
  fechaRegistro?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SuscripcionesService {
  private apiUrl = `${environment.apiUrl}/suscripcionesapi`;

  constructor(private http: HttpClient) {}

  // Obtener todas las suscripciones (opcional)
  obtenerSuscripciones(): Observable<Suscripcion[]> {
    return this.http.get<Suscripcion[]>(this.apiUrl);
  }

  // Agregar un nuevo correo
  agregarCorreo(email: string): Observable<Suscripcion> {
    const nueva: Suscripcion = { email };
    return this.http.post<Suscripcion>(this.apiUrl, nueva);
  }
}
/*
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Modelo opcional para tipar la suscripción
export interface Suscripcion {
  suscripcionId?: number;
  email: string;
  fechaRegistro?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SuscripcionesService {
  private apiUrl = 'https://localhost:7046/api/suscripcionesapi';

  constructor(private http: HttpClient) {}

  // Obtener todas las suscripciones (opcional)
  obtenerSuscripciones(): Observable<Suscripcion[]> {
    return this.http.get<Suscripcion[]>(this.apiUrl);
  }

  // Agregar un nuevo correo
  agregarCorreo(email: string): Observable<Suscripcion> {
    const nueva: Suscripcion = { email };
    return this.http.post<Suscripcion>(this.apiUrl, nueva);
  }
}
*/