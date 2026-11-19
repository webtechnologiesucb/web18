import { Injectable, signal } from '@angular/core';
import { ApiService } from './api';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  user = signal<any>(this.readUser());
  token = signal<string | null>(localStorage.getItem('token'));

  constructor(private api: ApiService) {}

  private readUser() {
    try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch { return null; }
  }

  setSession(token: string | null, user: any) {
    this.token.set(token);
    this.user.set(user);
    if (token) localStorage.setItem('token', token); else localStorage.removeItem('token');
    if (user) localStorage.setItem('user', JSON.stringify(user)); else localStorage.removeItem('user');
  }

  login(email: string, password: string): Observable<any> {
    return this.api.post<any>('/auth/login', { email, password }).pipe(
      tap((data) => {
        const payload = data?.data || data;
        const t = payload?.token || data?.token;
        const u = payload?.user || payload?.usuario || data?.user || { email };
        this.setSession(t, u);
      })
    );
  }

  register(email: string, password: string, rol = 'espectador'): Observable<any> {
    return this.api.post<any>('/auth/register', { email, password, rol });
  }

  fetchPerfil(): Observable<any> {
    return this.api.get<any>('/auth/perfil').pipe(
      tap((data) => {
        const p = data?.data || data?.usuario || data?.user || data;
        const merged = { ...(this.user() || {}), ...(p || {}) };
        this.user.set(merged);
        localStorage.setItem('user', JSON.stringify(merged));
      })
    );
  }

  logout() {
    this.setSession(null, null);
  }

  isAuthenticated(): boolean {
    return !!this.token();
  }
}
