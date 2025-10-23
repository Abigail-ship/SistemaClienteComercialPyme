import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductoService, Producto } from '../../services/producto.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SearchService } from '../../services/search.service';
import { Subscription } from 'rxjs';
import { CartService } from '../../services/cart.service';
import { filter } from 'rxjs/operators';
import { NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    RouterModule
  ],
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss']
})
export class ProductosComponent implements OnInit, OnDestroy {
  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  cargando = true;
  error: any;
  busqueda: string = '';
  private subscription!: Subscription;

  constructor(
    private productoService: ProductoService,
    private router: Router,
    private cartService: CartService,
    private searchService: SearchService
  ) {
    this.router.events.pipe(
    filter(event => event instanceof NavigationEnd)
  ).subscribe(() => {
    this.obtenerProductos();
  });
  }

  ngOnInit(): void {
    this.obtenerProductos();

    // Si tienes barra global de búsqueda vía SearchService
    this.subscription = this.searchService.currentSearchTerm.subscribe(term => {
      this.busqueda = term;
      this.filtrarProductos();
    });
  }

  obtenerProductos(): void {
  this.productoService.obtenerProductos().subscribe({
    next: (data: any) => {
      console.log('Productos recibidos:', data);

      // Extraer el arreglo real desde la propiedad $values
      this.productos = data;
      this.productosFiltrados = data;


      this.cargando = false;
      this.filtrarProductos();

      console.log('Productos cargados:', this.productos.length);
    },
    error: (err) => {
      this.error = 'No se pudieron cargar los productos.';
      this.cargando = false;
      console.error(err);
    }
  });
}


  filtrarProductos(): void {
    if (!this.busqueda.trim()) {
      this.productosFiltrados = this.productos;
      return;
    }
    const term = this.busqueda.toLowerCase();
    this.productosFiltrados = this.productos.filter(p =>
      p.nombre.toLowerCase().includes(term) ||
      p.descripcion.toLowerCase().includes(term) ||
      p.categoria?.nombre?.toLowerCase().includes(term)
    );
  }

  verDetalle(id: number) {
    this.router.navigate(['/producto', id]);
  }

  agregarAlCarrito(producto: Producto) {
    if (producto.stock === 0) {
      alert(`El producto "${producto.nombre}" no está disponible.`);
      return;
    }

    this.cartService.addItem(producto, 1);
    alert(`${producto.nombre} añadido al carrito`);
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}


  