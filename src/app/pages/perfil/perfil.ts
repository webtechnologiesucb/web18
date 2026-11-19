import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import { getErrorMessage } from '../../services/api';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css'
})
export class Perfil implements OnInit {
  perfil: any = {};
  loading = false;
  error = '';
  raw = '';

  constructor(public auth: AuthService, private router: Router) {}

  ngOnInit() { this.load(); }

  load() {
    if (!this.auth.token()) return;
    this.loading = true; this.error = '';
    this.auth.fetchPerfil().subscribe({
      next: (data) => {
        this.perfil = data?.data || data?.usuario || data?.user || data || {};
        const extra: any = { ...this.perfil };
        delete extra.email; delete extra.rol; delete extra.id; delete extra.id_usuario;
        this.raw = Object.keys(extra).length ? JSON.stringify(extra, null, 2) : '';
        this.loading = false;
      },
      error: (e) => { this.error = getErrorMessage(e, 'No se pudo cargar el perfil.'); this.loading = false; }
    });
  }

  doLogout() {
    this.auth.logout();
    this.router.navigateByUrl('/');
  }
}
