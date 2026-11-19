import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  // Usa proxy de Angular (/api -> http://localhost:3000) en desarrollo.
  // Para producción puede ajustarse a URL absoluta.
  private baseUrl = '/api';

  constructor(private http: HttpClient) {}

  get<T>(path: string, params?: Record<string, any>): Observable<T> {
    let httpParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') httpParams = httpParams.set(k, String(v));
      });
    }
    return this.http.get<T>(`${this.baseUrl}${path}`, { params: httpParams });
  }

  post<T>(path: string, body: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${path}`, body);
  }

  put<T>(path: string, body: any): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}${path}`, body);
  }

  patch<T>(path: string, body: any): Observable<T> {
    return this.http.patch<T>(`${this.baseUrl}${path}`, body);
  }

  delete<T>(path: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}${path}`);
  }
}

export function normalizeList(data: any): any[] {
  const v = data?.data ?? data?.obras ?? data?.noticias ?? data?.funciones ?? data?.elenco ?? data?.convocatorias ?? data?.items ?? data?.rows ?? data?.results ?? data;
  return Array.isArray(v) ? v : [];
}

export function getErrorMessage(err: any, fallback = 'Ocurrió un error.'): string {
  return err?.error?.message || err?.message || fallback;
}
