import { Component, forwardRef, Input, Optional, Injector, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-ds-input',
  imports: [ReactiveFormsModule],
  templateUrl: './ds-input.component.html',
  styleUrl: './ds-input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DsInputComponent),
      multi: true
    }
  ]
})
export class DsInputComponent implements ControlValueAccessor, OnInit {
  @Input() label = 'Label';
  @Input() type: 'text' | 'email' | 'password' = 'text';
  @Input() disabled = false;
  @Input() errorMessage = 'Este campo es requerido';

  value = '';
  isFocused = false;
  ngControl: NgControl | null = null;

  constructor(private injector: Injector) {}

  ngOnInit() {
    try {
      this.ngControl = this.injector.get(NgControl, null);
      if (this.ngControl) {
        this.ngControl.valueAccessor = this;
      }
    } catch (e) {
      // NgControl no está disponible, lo cual es normal si no se usa con reactive forms
    }
  }

  onChange = (value: string) => {};
  onTouched = () => {};

  writeValue(value: string): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  handleInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.value = input.value;
    this.onChange(this.value);
  }

  hasError(): boolean {
    return this.ngControl?.invalid && (this.ngControl?.touched || this.ngControl?.dirty) || false;
  }
}