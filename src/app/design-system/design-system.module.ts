import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DsButtonComponent } from './components/ds-button/ds-button.component';
import { DsInputComponent } from './components/ds-input.component/ds-input.component';

@NgModule({
  imports: [
    CommonModule,
    DsButtonComponent,
    DsInputComponent
  ],
  exports: [
    DsButtonComponent,
    DsInputComponent
  ]
})
export class DesignSystemModule {}
