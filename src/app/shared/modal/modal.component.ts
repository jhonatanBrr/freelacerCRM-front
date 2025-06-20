import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DesignSystemModule } from '../../design-system/design-system.module';

@Component({
  selector: 'app-modal',
  imports: [DesignSystemModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent {
  @Input() isOpen: boolean = false;
  @Input() title: string = '';
  @Input() disabledActionButton: boolean = false;

  @Output() close = new EventEmitter<boolean>();
  @Output() submit = new EventEmitter<any>();


  onClose(): void {
    this.close.emit();
  }

  onSubmit(): void {
    this.submit.emit();
  }
}
