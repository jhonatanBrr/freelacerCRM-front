import { Component, signal, OnDestroy, HostListener } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AuthService } from '../../core/services/auth/auth.service';

interface NavItem {
  path: string;
  label: string;
  icon?: string;
}

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnDestroy {
  
  private destroy$ = new Subject<void>();

  isMobileMenuOpen = signal(false);
  isUserMenuOpen = signal(false);
  currentRoute = signal('');
  isScrolled = signal(false);

  navItems: NavItem[] = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/clients', label: 'Clients' },
    //{ path: '/tasks', label: 'Tasks' }
  ];

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((event: NavigationEnd) => {
        this.currentRoute.set(event.url);
      });
    this.currentRoute.set(this.router.url);
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.isScrolled.set(scrollPosition > 10);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    // Cerrar menú de usuario si se hace clic fuera
    const target = event.target as HTMLElement;
    if (!target.closest('.navbar__user')) {
      this.isUserMenuOpen.set(false);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update(current => !current);
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }

  toggleUserMenu(): void {
    this.isUserMenuOpen.update(current => !current);
  }

  closeUserMenu(): void {
    this.isUserMenuOpen.set(false);
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
    this.closeMobileMenu();
  }

  logout(): void {
    this.authService.logout();
    this.closeUserMenu();
    this.router.navigate(['/login']);
  }

  // Método para obtener información del usuario
  getUserInfo(): any {
    return this.authService.getUserInfo();
  }

  getNavbarClass(): string {
    return this.isScrolled() ? 'navbar navbar--scrolled' : 'navbar';
  }
}
