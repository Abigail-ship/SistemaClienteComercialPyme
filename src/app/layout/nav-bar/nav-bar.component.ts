import { Component, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule, Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { SubscribeDialogComponent } from '../../subscribe-dialog/subscribe-dialog.component';
import { ProductoService, Producto } from '../../services/producto.service';
import { LoginUsuarioClienteComponent } from '../../components/login-usuario-cliente/login-usuario-cliente.component';
import { MatCardModule } from '@angular/material/card';
import { CartService } from '../../services/cart.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    FormsModule,
    RouterModule,
    MatDialogModule,
    MatSidenavModule,
    MatCardModule
  ],
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  searchTerm: string = '';
  productosFiltrados: Producto[] = [];
  cargando = false;
  usuarioLogueado?: { usuarioId: number; nombres: string };

  constructor(
    private dialog: MatDialog,
    private productoService: ProductoService,
    public cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  get totalItemsCarrito(): number {
    return this.cartService.getItems().reduce((acc, item) => acc + item.cantidad, 0);
  }

  openSubscribeDialog() {
    this.dialog.open(SubscribeDialogComponent, { width: '400px' });
  }

  abrirBusquedaLateral() {
    this.sidenav?.open();
    this.productosFiltrados = [];
    this.searchTerm = '';
  }

  filtrarEnTiempoReal(): void {
  const term = this.searchTerm.trim().toLowerCase();

  if (!term) {
    this.productosFiltrados = [];
    return;
  }

  this.cargando = true;
  this.productoService.obtenerProductos().pipe(take(1)).subscribe({
  next: (data: any) => {
    // Si tu API ya devuelve un array
    const productosArray = Array.isArray(data) ? data : data?.$values ?? [];

    this.productosFiltrados = productosArray.filter((p: Producto) =>
      p.nombre?.toLowerCase().includes(term) ||
      p.descripcion?.toLowerCase().includes(term) ||
      p.categoria?.nombre?.toLowerCase().includes(term)
    );
    this.cargando = false;
  },
  error: () => {
    this.cargando = false;
  }
});

}
  irADetalle(id: number): void {
    this.sidenav.close();
    this.router.navigate(['/producto', id]);
  }

  abrirLogin() {
    const dialogRef = this.dialog.open(LoginUsuarioClienteComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // result puede ser el usuario logueado
        this.usuarioLogueado = result;
      }
    });
  }

  logout() {
      localStorage.removeItem('usuario');

  // Limpiar variable interna de usuario logueado
  this.usuarioLogueado = undefined;

  // Redirigir a página de inicio (opcional)
  this.router.navigate(['/']);
    
  }
}


