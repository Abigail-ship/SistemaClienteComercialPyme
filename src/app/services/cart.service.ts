import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Producto } from './producto.service';

export interface CartItem {
  producto: Producto;
  cantidad: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private itemsSubject = new BehaviorSubject<CartItem[]>([]);
  items$ = this.itemsSubject.asObservable();

  constructor() {
    // Si quieres persistir en localStorage, puedes leerlo aquí y next(...)
    const saved = localStorage.getItem('cart_items');
    if (saved) {
      try {
        this.itemsSubject.next(JSON.parse(saved));
      } catch { /* ignore */ }
    }
  }

  private persist() {
    localStorage.setItem('cart_items', JSON.stringify(this.itemsSubject.value));
  }

  getItems(): CartItem[] {
    return this.itemsSubject.value;
  }

  addItem(producto: Producto, cantidad: number = 1): void {
    const items = [...this.itemsSubject.value];
    const existing = items.find(i => i.producto.productoId === producto.productoId);
    if (existing) {
      existing.cantidad += cantidad;
    } else {
      items.push({ producto, cantidad });
    }
    this.itemsSubject.next(items);
    this.persist();
  }

  updateQuantity(productoId: number, cantidad: number): void {
    let items = this.itemsSubject.value.map(i => {
      if (i.producto.productoId === productoId) {
        return { ...i, cantidad: cantidad > 0 ? cantidad : 1 };
      }
      return i;
    });
    this.itemsSubject.next(items);
    this.persist();
  }

  removeItem(productoId: number): void {
    const items = this.itemsSubject.value.filter(i => i.producto.productoId !== productoId);
    this.itemsSubject.next(items);
    this.persist();
  }

  clearCart(): void {
    this.itemsSubject.next([]);
    this.persist();
  }

  getTotal(): number {
    return this.itemsSubject.value.reduce((acc, item) => acc + item.producto.precioVenta * item.cantidad, 0);
  }
}

