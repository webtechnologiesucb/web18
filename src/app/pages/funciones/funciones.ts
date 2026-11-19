import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService, normalizeList, getErrorMessage } from '../../services/api';

@Component({
  selector: 'app-funciones',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './funciones.html',
  styleUrl: './funciones.css'
})
export class Funciones implements OnInit {
  funciones: any[] = [];
  obras: any[] = [];
  loading = true;
  loadingObras = true;
  error = '';
  estado = '';

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.load();
    this.api.get<any>('/obras').subscribe({
      next: (data) => { this.obras = normalizeList(data); this.loadingObras = false; },
      error: () => { this.loadingObras = false; }
    });
  }

  load() {
    this.loading = true; this.error = '';
    const params: any = {};
    if (this.estado) params.estado = this.estado;
    this.api.get<any>('/funciones', params).subscribe({
      next: (data) => { this.funciones = normalizeList(data); this.loading = false; },
      error: (e) => { this.error = getErrorMessage(e, 'No se pudieron cargar las funciones.'); this.loading = false; }
    });
  }

  formatFecha(f: string) { if (!f) return '-'; try { return new Date(f).toLocaleString('es-BO'); } catch { return f; } }
  fId(f: any) { return f?.id || f?.id_funcion; }
  oId(o: any) { return o?.id || o?.id_obra; }
}
