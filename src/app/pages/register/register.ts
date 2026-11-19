import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import { getErrorMessage } from '../../services/api';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  email = '';
  password = '';
  rol = 'espectador';
  msg = '';
  ok = false;

  constructor(private auth: AuthService) {}

  onSubmit() {
    this.msg = ''; this.ok = false;
    this.auth.register(this.email, this.password, this.rol).subscribe({
      next: (data) => { this.msg = data?.message || 'Cuenta creada correctamente. Ahora puedes iniciar sesión.'; this.ok = true; },
      error: (e) => { this.msg = getErrorMessage(e, 'No se pudo completar el registro.'); }
    });
  }
}
