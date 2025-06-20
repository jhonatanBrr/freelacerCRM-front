import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DesignSystemModule } from '../../design-system/design-system.module';

@Component({
  selector: 'app-header-container',
  imports: [DesignSystemModule],
  templateUrl: './header-container.component.html',
  styleUrl: './header-container.component.scss'
})
export class HeaderContainerComponent {
  @Input() title: string = '';
  @Input() buttonText: string = 'Acción';
  @Input() disabled: boolean = false;
  
  @Output() buttonClick = new EventEmitter<void>();

  onButtonClick(): void {
    if (!this.disabled) {
      this.buttonClick.emit();
    }
  }
}
