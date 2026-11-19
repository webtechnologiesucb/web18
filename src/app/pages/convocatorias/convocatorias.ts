import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, normalizeList, getErrorMessage } from '../../services/api';

@Component({
  selector: 'app-convocatorias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './convocatorias.html',
  styleUrl: './convocatorias.css'
})
export class Convocatorias implements OnInit {
  convocatorias: any[] = [];
  loading = true;
  error = '';
  seleccionada: any = null;
  msg = '';
  msgOk = false;
  form: any = { nombre_completo: '', ci: '', email: '', telefono: '', carrera_ucb: '', experiencia_anios: 0, estilo_danza: '', link_video_demo: '' };

  constructor(private api: ApiService) {}
  ngOnInit() {
    this.api.get<any>('/convocatorias').subscribe({
      next: (data) => { this.convocatorias = normalizeList(data); this.loading = false; },
      error: (e) => { this.error = getErrorMessage(e, 'No se pudieron cargar las convocatorias.'); this.loading = false; }
    });
  }
  fmt(f: string) { if (!f) return '-'; try { return new Date(f).toLocaleDateString('es-BO'); } catch { return f; } }
  cId(c: any) { return c?.id || c?.id_convocatoria; }
  seleccionar(c: any) {
    this.seleccionada = c; this.msg = '';
    setTimeout(() => document.getElementById('form-postulacion')?.scrollIntoView({ behavior: 'smooth' }), 50);
  }
  enviar() {
    this.msg = ''; this.msgOk = false;
    const id = this.cId(this.seleccionada);
    const payload: any = { ...this.form };
    if (!payload.carrera_ucb) delete payload.carrera_ucb;
    if (!payload.link_video_demo) delete payload.link_video_demo;
    if (!payload.estilo_danza) delete payload.estilo_danza;
    this.api.post<any>(`/convocatorias/${id}/postulaciones`, payload).subscribe({
      next: (data) => {
        this.msg = data?.message || '¡Postulación enviada correctamente!';
        this.msgOk = true;
        this.form = { nombre_completo: '', ci: '', email: '', telefono: '', carrera_ucb: '', experiencia_anios: 0, estilo_danza: '', link_video_demo: '' };
      },
      error: (e) => { this.msg = getErrorMessage(e, 'No se pudo enviar la postulación.'); }
    });
  }
}
