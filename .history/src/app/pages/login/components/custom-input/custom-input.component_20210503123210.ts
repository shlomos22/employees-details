import { Component, OnInit, Input, forwardRef, ChangeDetectionStrategy } from '@angular/core'
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms'

@Component({
  selector: 'app-custom-input',
  templateUrl: './custom-input.component.html',
  styleUrls: ['./custom-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInputComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomInputComponent implements OnInit, ControlValueAccessor {

  constructor() { }

  @Input() type = 'text'
  @Input() inputmode = 'text'
  @Input() placeholder = 'text'
  @Input() value = ''
  @Input() disabled = false

  onChange = (_: any) => { }
  onTouched = (_: any) => { }

  onValueChanged(event: CustomEvent) {
    this.writeValue(event.detail.value)
  }

  writeValue(value: any): void {
    this.value = value
    this.onChange(value)
  }
  registerOnChange(fn: any): void {
    this.onChange = fn
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn
  }
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled
  }

  ngOnInit() { }

}
