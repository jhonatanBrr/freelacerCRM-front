import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DsButtonComponent } from './components/atoms/ds-button/ds-button.component';
import { DsInputComponent } from './components/atoms/ds-input.component/ds-input.component';
import { DsPaginatorComponent } from './components/organisms/ds-paginator/ds-paginator.component';

@NgModule({
  imports: [
    CommonModule,
    DsButtonComponent,
    DsInputComponent,
    DsPaginatorComponent
  ],
  exports: [
    DsButtonComponent,
    DsInputComponent,
    DsPaginatorComponent
  ]
})
export class DesignSystemModule {}
