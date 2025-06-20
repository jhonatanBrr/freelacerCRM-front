import { Component, Input } from '@angular/core';
import { LoaderService } from '../../core/services/loader/loader.service';

@Component({
  selector: 'app-loader',
  imports: [],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.scss'
})
export class LoaderComponent {
  constructor(
    public loaderService: LoaderService
  ) {}

  get isLoading(): boolean {
    return this.loaderService.isLoadingValue;
  }

  get textLoader(): string {
    return this.loaderService.textLoaderValue;
  }
}
