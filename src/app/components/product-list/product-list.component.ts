import { Component, OnInit } from '@angular/core';
import { ProductoService, Producto } from '../../services/producto.service';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  productos: Producto[] = [];

  constructor(private productoService: ProductoService, private router: Router) {
    // Escuchar evento de navegación para recargar productos
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.cargarProductos();
    });
  }

  ngOnInit() {
    this.cargarProductos();
  }

  cargarProductos() {
    this.productoService.obtenerProductos().subscribe(data => {
      this.productos = data;
    });
  }

  verDetalle(id: number) {
    this.router.navigate(['/producto', id]);
  }
}

