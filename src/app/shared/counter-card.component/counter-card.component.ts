import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-counter-card',
  imports: [],
  templateUrl: './counter-card.component.html',
  styleUrl: './counter-card.component.scss'
})
export class CounterCardComponent {
  @Input() title: string = '';
  @Input() number!: number | string;
  @Input() percentage: boolean = false;
}
