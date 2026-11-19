import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService, getErrorMessage } from '../../services/api';

@Component({
  selector: 'app-obra-detalle',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './obra-detalle.html',
  styleUrl: './obra-detalle.css'
})
export class ObraDetalle implements OnInit {
  obra: any = null;
  funciones: any[] = [];
  loading = true;
  error = '';

  constructor(private route: ActivatedRoute, private api: ApiService) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (!id) return;
      this.loading = true; this.error = '';
      this.api.get<any>(`/obras/${id}`).subscribe({
        next: (data) => {
          const payload = data?.data || data?.obra || data;
          this.obra = payload;
          this.funciones = payload?.funciones || data?.funciones || [];
          this.loading = false;
        },
        error: (e) => { this.error = getErrorMessage(e, 'No se pudo cargar la obra.'); this.loading = false; }
      });
    });
  }
  formatFecha(f: string) { if (!f) return '-'; try { return new Date(f).toLocaleString('es-BO'); } catch { return f; } }
  fId(f: any) { return f?.id || f?.id_funcion; }
}
