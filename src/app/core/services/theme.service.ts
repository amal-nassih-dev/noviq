import { Injectable, signal } from '@angular/core';

import { ThemeName } from '../models/theme/theme';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private readonly STORAGE_KEY = 'noviq-theme';

  readonly currentTheme =
    signal<ThemeName>(this.loadTheme());

  constructor() {
    this.applyTheme(this.currentTheme());
  }

  setTheme(theme: ThemeName): void {

    this.currentTheme.set(theme);

    localStorage.setItem(
      this.STORAGE_KEY,
      theme
    );

    this.applyTheme(theme);
  }

  private applyTheme(theme: ThemeName): void {

    document.documentElement.setAttribute(
      'data-theme',
      theme
    );
  }

  private loadTheme(): ThemeName {

    const savedTheme =
      localStorage.getItem(this.STORAGE_KEY);

    if (
      savedTheme === 'slate' ||
      savedTheme === 'ocean' ||
      savedTheme === 'forest' ||
      savedTheme === 'violet' ||
      savedTheme === 'midnight'
    ) {
      return savedTheme as ThemeName;
    }

    return 'slate';
  }
}
