import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CartService, CartItem } from '../../services/cart.service';
import { ClienteService, Cliente } from '../../services/cliente.service';
import { VentasService } from '../../services/ventas.service';
import { PagosService } from '../../services/pagos.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { loadStripe, Stripe, StripeCardElement } from '@stripe/stripe-js';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class CheckoutComponent implements OnInit {
  carrito: CartItem[] = [];
  total = 0;
  metodosPago: { metodoPagoId: number; nombre: string }[] = [];
  metodosPagoFiltrados: { metodoPagoId: number; nombre: string }[] = [];

  cliente: Cliente = { nombres: '', apellidos: '', email: '' };
  clienteRegistrado: Cliente | null = null;
  ventaCreada: any;
  error: string = '';

  stripe: Stripe | null = null;
  cardElement!: StripeCardElement;
  @ViewChild('cardInfo') cardInfo!: ElementRef;

  metodoPagoId!: number;
  idMetodoTarjeta = 2;

  mostrandoFormularioPago = false;
  pagoCompletado = false;

  constructor(
    private cartService: CartService,
    private clienteService: ClienteService,
    private ventasService: VentasService,
    private pagosService: PagosService,
    private router: Router
  ) {}

  ngOnInit() {
    const usuario = JSON.parse(localStorage.getItem('usuario') || 'null');
    if (!usuario) {
      alert('Debe iniciar sesión antes de continuar con la compra.');
      this.router.navigate(['/login']);
      return;
    }

    this.carrito = this.cartService.getItems();
    this.total = this.cartService.getTotal();
    this.cargarMetodosPago();

    // Si el usuario ya tiene cliente registrado, cargarlo automáticamente
    const usuarioEmail = (usuario?.email || usuario?.Email)?.trim().toLowerCase();
    if (usuarioEmail) {
      this.clienteService.obtenerClientePorEmail(usuarioEmail).subscribe({
        next: cliente => this.clienteRegistrado = cliente,
        error: err => {
          if (err.status !== 404) this.error = 'Error verificando cliente existente';
        }
      });
    }
  }
  
  cargarMetodosPago() {
  this.pagosService.getMetodosPago().subscribe({
    next: (respuesta: any) => {
      console.log('Respuesta de métodos de pago:', respuesta);

      // Aquí usamos directamente la respuesta
      this.metodosPago = respuesta;

      // Filtramos métodos de tarjeta si quieres
      this.metodosPagoFiltrados = this.metodosPago.filter((m: any) =>
        m.nombre.toLowerCase().includes('tarjeta')
      );

      if (this.metodosPagoFiltrados.length > 0) {
        this.metodoPagoId = this.metodosPagoFiltrados[0].metodoPagoId;
      }
    },
    error: () => this.error = 'Error al cargar métodos de pago'
  });
}


  registrarCliente() {
    const email = this.cliente.email?.trim().toLowerCase();
    if (!email) {
      alert('Ingrese un correo válido');
      return;
    }

    // Evita crear cliente si ya está registrado
    if (this.clienteRegistrado) {
      alert('Este cliente ya está registrado');
      return;
    }

    this.clienteService.obtenerClientePorEmail(email).subscribe({
      next: clienteExistente => {
        this.clienteRegistrado = clienteExistente;
        alert('Este cliente ya está registrado');
      },
      error: err => {
        if (err.status === 404) {
          // Cliente no encontrado → crear
          this.clienteService.crearCliente(this.cliente).subscribe({
            next: cliente => {
              this.clienteRegistrado = cliente;
              alert('Cliente registrado correctamente');
            },
            error: e => this.error = e.error?.mensaje || 'Error al registrar cliente'
          });
        } else {
          this.error = 'Error verificando cliente: ' + err.message;
        }
      }
    });
  }

  continuarCompra() {
    const usuario = JSON.parse(localStorage.getItem('usuario') || 'null');
    const usuarioId = usuario?.UsuarioId || usuario?.usuarioId;
    const usuarioEmail = (usuario?.email || usuario?.Email)?.trim().toLowerCase();

    if (!usuarioId || !usuarioEmail) {
      alert('Debe iniciar sesión para continuar con la compra.');
      return;
    }

    if (!this.clienteRegistrado) {
      alert('Debe registrarse como cliente antes de continuar.');
      return;
    }

    const detalleVentas = this.carrito.map(item => ({
      productoId: item.producto.productoId,
      cantidad: item.cantidad,
      precioUnitario: item.producto.precioVenta,
      subtotal: item.producto.precioVenta * item.cantidad
    }));

    const ventaRequest = {
      usuarioId: usuarioId,
      usuarioEmail: usuarioEmail,
      detalleVentas: detalleVentas
    };

    this.ventasService.crearVenta(ventaRequest).subscribe({
      next: ventaCreada => {
        this.ventaCreada = ventaCreada;
        alert('Venta creada, ahora puede procesar el pago.');
        this.mostrandoFormularioPago = true;
        this.loadStripePublicKey();
      },
      error: err => {
        console.error(err);
        this.error = err.error?.mensaje || 'Error al crear la venta';
      }
    });
  }

  async loadStripePublicKey() {
    try {
      const response = await this.pagosService.obtenerClavePublicaStripe().toPromise();
      this.stripe = await loadStripe(response!.publicKey);
      this.initStripeElements();
    } catch {
      this.error = 'Error cargando Stripe.';
    }
  }

  initStripeElements() {
    if (!this.stripe) return;
    const elements = this.stripe.elements();
    this.cardElement = elements.create('card');
    this.cardElement.mount(this.cardInfo.nativeElement);
  }
  
onMetodoPagoChange(nuevoMetodoId: number) {
  this.metodoPagoId = nuevoMetodoId;

  if (this.esMetodoTarjeta(this.metodoPagoId)) {
    setTimeout(() => {
      this.initStripeElements();
    }, 0);
  } else {
    if (this.cardElement) {
      this.cardElement.unmount();
    }
  }
}

esMetodoTarjeta(metodoId: number): boolean {
  return this.metodosPagoFiltrados.some(metodo => metodo.metodoPagoId === metodoId);
}

  async procesarPago() {
    if (!this.ventaCreada) {
      this.error = 'No hay venta creada para procesar el pago.';
      return;
    }
    this.error = '';

    try {
      const pagoResponse: any = await this.pagosService
        .procesarPago(this.ventaCreada.ventaId, this.metodoPagoId)
        .toPromise();

      if (pagoResponse.error) {
        this.error = pagoResponse.error;
        return;
      }

      const { error, paymentIntent } = await this.stripe!.confirmCardPayment(
        pagoResponse.clientSecret,
        {
          payment_method: {
            card: this.cardElement,
            billing_details: {
              name: `${this.clienteRegistrado?.nombres} ${this.clienteRegistrado?.apellidos}`,
              email: this.clienteRegistrado?.email
            }
          }
        }
      );

      if (error) {
        this.error = error.message || 'Error en el pago con Stripe.';
        return;
      }

      if (paymentIntent?.status !== 'succeeded') {
        this.error = `El pago no fue exitoso. Estado: ${paymentIntent?.status}`;
        return;
      }

      const confirmResponse = await this.pagosService
        .confirmarPago(this.ventaCreada.ventaId)
        .toPromise();

      if (!confirmResponse?.success) {
        this.error = confirmResponse?.error || 'Error confirmando el pago en el sistema.';
        return;
      }

      this.pagoCompletado = true;
      alert('Pago realizado con éxito');
      this.cartService.clearCart();
      // Navegar forzando recarga
  await this.router.navigateByUrl('/', { skipLocationChange: true });
  this.router.navigate(['/productos']);
    } catch (ex: any) {
      this.error = ex.message || 'Error inesperado en el pago.';
    }
  }
}


