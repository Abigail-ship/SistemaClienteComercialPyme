import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { SuscripcionesService } from '../services/suscripciones.service';

@Component({
  selector: 'app-subscribe-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule
  ],
  templateUrl: './subscribe-dialog.component.html',
  styleUrls: ['./subscribe-dialog.component.scss']
})
export class SubscribeDialogComponent {
  email: string = '';

  constructor(private suscripcionesService: SuscripcionesService) {}

  subscribe() {
    if (!this.email) return;

    this.suscripcionesService.agregarCorreo(this.email).subscribe({
      next: (res) => {
        console.log('Correo suscrito:', res);
        alert('¡Gracias por suscribirte!');
        this.email = ''; // Limpiar input
      },
      error: (err) => {
        if (err.status === 409) {
          alert('Este correo ya está suscrito.');
        } else {
          alert('Ocurrió un error, intenta nuevamente.');
        }
      }
    });
  }
}


