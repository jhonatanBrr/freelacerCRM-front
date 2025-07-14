import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-ds-button',
  imports: [],
  templateUrl: './ds-button.component.html',
  styleUrl: './ds-button.component.scss'
})
export class DsButtonComponent {
  @Input() label: string = '';
  @Input() variant: 'primary' | 'secondary' = 'primary';
  @Input() disabled: boolean = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() onClick: () => void = () => {};

}
