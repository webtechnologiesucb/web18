import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService, getErrorMessage } from '../../services/api';

@Component({
  selector: 'app-noticia-detalle',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './noticia-detalle.html',
  styleUrl: './noticia-detalle.css'
})
export class NoticiaDetalle implements OnInit {
  noticia: any = null;
  loading = true;
  error = '';

  constructor(private route: ActivatedRoute, private api: ApiService) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug');
      if (!slug) return;
      this.loading = true; this.error = '';
      this.api.get<any>(`/noticias/${slug}`).subscribe({
        next: (data) => { this.noticia = data?.data || data?.noticia || data; this.loading = false; },
        error: (e) => { this.error = getErrorMessage(e, 'No se pudo cargar la noticia.'); this.loading = false; }
      });
    });
  }
}
