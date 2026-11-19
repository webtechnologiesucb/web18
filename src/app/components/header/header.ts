import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header implements OnInit {
  navOpen = false;
  isLight = false;

  constructor(public auth: AuthService) {}

  ngOnInit() {
    this.applyTheme(localStorage.getItem('ballet_theme') || 'dark');
  }

  applyTheme(t: string) {
    this.isLight = t === 'light';
    if (this.isLight) document.documentElement.setAttribute('data-theme', 'light');
    else document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('ballet_theme', t);
  }

  toggleTheme() {
    this.applyTheme(this.isLight ? 'dark' : 'light');
  }
}
