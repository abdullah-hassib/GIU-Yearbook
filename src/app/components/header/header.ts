
/* =====================================================================
   FILE: components/header/header.ts
   WHAT: The top bar of the site.
   FIGMA: Select the header in "Class of 2028 · Student directory".
          Notice 3 parts: logo + title, 3 navigation links, login button.
   ===================================================================== */

import { Component, signal, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { SavedService } from '../../services/saved.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  // RouterLink enables navigation without reloading the page.
  // RouterLinkActive highlights the current navigation link.
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {

  // Navigation links
  protected readonly navLinks = [
    { label: 'Class of 2028', path: '/', exact: true },
    { label: 'Teachers & Staff', path: '/teachers', exact: false },
    { label: 'Gallery', path: '/gallery', exact: false },
  ];

  // Tracks whether the logo image failed to load
  protected readonly logoFailed = signal(false);

  // Existing saved-students service
  protected readonly saved = inject(SavedService);

  // Authentication service
  // Exposed to the template so it can read auth.currentUser()
  protected readonly auth = inject(AuthService);

  // Angular router for navigation after logout
  private readonly router = inject(Router);

  // Sign out the current student
  protected signOut(): void {
    this.auth.logout().subscribe({
      next: () => {
        this.router.navigateByUrl('/login');
      },
      error: (err) => {
        console.error('Logout failed:', err);
      },
    });
  }
}
