import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  constructor() { }

  private isLoading = signal(false);
  private textLoader = signal('Cargando...');

  get isLoadingValue(): boolean {
    return this.isLoading();
  }

  get textLoaderValue(): string {
    return this.textLoader();
  }

  setIsLoading(isLoading: boolean): void {
    this.isLoading.set(isLoading);
  }

  setTextLoader(text: string): void {
    this.textLoader.set(text);
  }
}
