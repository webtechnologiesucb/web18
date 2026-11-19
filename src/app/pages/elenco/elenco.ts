import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, normalizeList, getErrorMessage } from '../../services/api';

@Component({
  selector: 'app-elenco',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './elenco.html',
  styleUrl: './elenco.css'
})
export class Elenco implements OnInit {
  elenco: any[] = [];
  loading = true;
  error = '';
  rol = '';

  constructor(private api: ApiService) {}
  ngOnInit() { this.load(); }

  load() {
    this.loading = true; this.error = '';
    const params: any = {};
    if (this.rol) params.rol = this.rol;
    this.api.get<any>('/elenco', params).subscribe({
      next: (data) => { this.elenco = normalizeList(data); this.loading = false; },
      error: (e) => { this.error = getErrorMessage(e, 'No se pudo cargar el elenco.'); this.loading = false; }
    });
  }
  formatRol(r: string) { return (r || '').replace(/_/g, ' '); }
  mId(m: any) { return m?.id || m?.id_integrante; }
}
