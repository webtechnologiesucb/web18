import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import { getErrorMessage } from '../../services/api';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  email = '';
  password = '';
  msg = '';

  constructor(private auth: AuthService, private router: Router, private route: ActivatedRoute) {}

  onSubmit() {
    this.msg = '';
    this.auth.login(this.email, this.password).subscribe({
      next: () => {
        const redirect = this.route.snapshot.queryParamMap.get('redirect') || '/perfil';
        this.router.navigateByUrl(redirect);
      },
      error: (e) => { this.msg = getErrorMessage(e, 'Credenciales inválidas o error del servidor.'); }
    });
  }
}
