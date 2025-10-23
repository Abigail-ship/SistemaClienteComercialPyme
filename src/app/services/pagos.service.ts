import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.prod';

export interface MetodoPago {
  metodoPagoId: number;
  nombre: string;
  descripcion: string;
  activo: boolean;
}

interface PagoResponse {
  success: boolean;
  clientSecret?: string;
  stripePublicKey?: string;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PagosService {
  private apiUrl = `${environment.apiUrl}/pagos`;

  constructor(private http: HttpClient) {}

  obtenerClavePublicaStripe(): Observable<{ publicKey: string }> {
    return this.http.get<{ publicKey: string }>(`${this.apiUrl}/ObtenerClavePublica`);
  }

  procesarPago(ventaId: number, metodoPagoId: number, referencia?: string): Observable<PagoResponse> {
    return this.http.post<PagoResponse>(`${this.apiUrl}/procesar`, {
      ventaId,
      metodoPagoId,
      referencia
    });
  }
  confirmarPago(ventaId: number): Observable<{success: boolean, error?: string}> {
  return this.http.post<{success: boolean, error?: string}>(`${this.apiUrl}/confirmar`, {
    ventaId
  });
}
  getMetodosPago(): Observable<MetodoPago[]> {
  return this.http.get<MetodoPago[]>(`${this.apiUrl}/metodospago`);
}

}

/*
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface MetodoPago {
  metodoPagoId: number;
  nombre: string;
  descripcion: string;
  activo: boolean;
}

interface PagoResponse {
  success: boolean;
  clientSecret?: string;
  stripePublicKey?: string;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PagosService {
  private apiUrl = 'https://localhost:7046/api/pagos';

  constructor(private http: HttpClient) {}

  obtenerClavePublicaStripe(): Observable<{ publicKey: string }> {
    return this.http.get<{ publicKey: string }>(`${this.apiUrl}/ObtenerClavePublica`);
  }

  procesarPago(ventaId: number, metodoPagoId: number, referencia?: string): Observable<PagoResponse> {
    return this.http.post<PagoResponse>(`${this.apiUrl}/procesar`, {
      ventaId,
      metodoPagoId,
      referencia
    });
  }
  confirmarPago(ventaId: number): Observable<{success: boolean, error?: string}> {
  return this.http.post<{success: boolean, error?: string}>(`${this.apiUrl}/confirmar`, {
    ventaId
  });
}
  getMetodosPago(): Observable<MetodoPago[]> {
  return this.http.get<MetodoPago[]>(`${this.apiUrl}/metodospago`);
}

}
*/