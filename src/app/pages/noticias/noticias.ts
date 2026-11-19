import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService, normalizeList, getErrorMessage } from '../../services/api';

@Component({
  selector: 'app-noticias',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './noticias.html',
  styleUrl: './noticias.css'
})
export class Noticias implements OnInit {
  noticias: any[] = [];
  loading = true;
  error = '';

  constructor(private api: ApiService) {}
  ngOnInit() {
    this.api.get<any>('/noticias').subscribe({
      next: (data) => { this.noticias = normalizeList(data); this.loading = false; },
      error: (e) => { this.error = getErrorMessage(e, 'No se pudieron cargar las noticias.'); this.loading = false; }
    });
  }
  resumen(t: string = '') { return t.length > 220 ? t.slice(0, 220) + '…' : t; }
}
