import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService, normalizeList, getErrorMessage } from '../../services/api';

declare global { interface Window { BalletCarousel?: any; } }

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit, OnDestroy {
  obras: any[] = [];
  noticias: any[] = [];
  loadingObras = true;
  loadingNoticias = true;
  obrasError = '';
  noticiasError = '';
  sub = { nombre: '', email: '' };
  subMsg = '';
  private carouselInstance: any;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loadObras();
    this.loadNoticias();
    this.initCarousel();
  }

  ngOnDestroy() {
    if (this.carouselInstance?.destroy) this.carouselInstance.destroy();
  }

  resumen(txt: string = '') { return txt.length > 140 ? txt.slice(0, 140) + '…' : txt; }

  loadObras() {
    this.api.get<any>('/obras').subscribe({
      next: (data) => { this.obras = normalizeList(data); this.loadingObras = false; },
      error: (e) => { this.obrasError = getErrorMessage(e, 'No se pudieron cargar las obras (verifica que la API esté disponible).'); this.loadingObras = false; }
    });
  }

  loadNoticias() {
    this.api.get<any>('/noticias', { limit: 3 }).subscribe({
      next: (data) => { this.noticias = normalizeList(data); this.loadingNoticias = false; },
      error: (e) => { this.noticiasError = getErrorMessage(e, 'No se pudieron cargar las noticias.'); this.loadingNoticias = false; }
    });
  }

  suscribir() {
    this.subMsg = '';
    this.api.post<any>('/suscriptores', { email: this.sub.email, nombre: this.sub.nombre }).subscribe({
      next: () => { this.subMsg = '¡Suscripción registrada correctamente!'; this.sub = { nombre: '', email: '' }; },
      error: (e) => { this.subMsg = getErrorMessage(e, 'No se pudo registrar la suscripción.'); }
    });
  }

  initCarousel() {
    const tryInit = () => {
      if (window.BalletCarousel && document.getElementById('ballet-carousel')) {
        this.carouselInstance = new window.BalletCarousel('#ballet-carousel', { autoplayInterval: 4500, loop: true });
      } else {
        setTimeout(tryInit, 100);
      }
    };
    tryInit();
  }

  obraId(o: any) { return o?.id || o?.id_obra; }
  noticiaId(n: any) { return n?.id || n?.slug; }
}
