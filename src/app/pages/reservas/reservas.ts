import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, normalizeList, getErrorMessage } from '../../services/api';

@Component({
  selector: 'app-reservas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reservas.html',
  styleUrl: './reservas.css'
})
export class Reservas implements OnInit {
  funciones: any[] = [];
  loadingFunciones = true;
  form: any = { id_funcion: '', cantidad_entradas: 1, ci: '', nombre_completo: '', correo: '', telefono: '', es_estudiante_ucb: false };
  resMsg = ''; resOk = false; resCodigo = '';
  codigo = ''; consulta: any = null; consultaMsg = '';

  constructor(private api: ApiService) {}
  ngOnInit() {
    this.api.get<any>('/funciones').subscribe({
      next: (data) => { this.funciones = normalizeList(data); this.loadingFunciones = false; },
      error: () => { this.loadingFunciones = false; }
    });
  }
  fmt(f: string) { if (!f) return '-'; try { return new Date(f).toLocaleString('es-BO'); } catch { return f; } }
  fId(f: any) { return f?.id || f?.id_funcion; }
  reservar() {
    this.resMsg = ''; this.resOk = false; this.resCodigo = '';
    const payload: any = { ...this.form, id_funcion: Number(this.form.id_funcion), cantidad_entradas: Number(this.form.cantidad_entradas) };
    if (!payload.telefono) delete payload.telefono;
    this.api.post<any>('/reservas', payload).subscribe({
      next: (data) => {
        const d = data?.data || data;
        this.resCodigo = d?.codigo_reserva || d?.codigo || '';
        this.resMsg = data?.message || 'Reserva confirmada.';
        this.resOk = true;
      },
      error: (e) => { this.resMsg = getErrorMessage(e, 'No se pudo registrar la reserva.'); }
    });
  }
  consultar() {
    this.consulta = null; this.consultaMsg = '';
    const code = encodeURIComponent((this.codigo || '').trim());
    this.api.get<any>(`/reservas/codigo/${code}`).subscribe({
      next: (data) => { this.consulta = data?.data || data?.reserva || data; },
      error: (e) => { this.consultaMsg = getErrorMessage(e, 'No se encontró una reserva con ese código.'); }
    });
  }
}
