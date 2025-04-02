import { Directive, ElementRef, HostListener, Provider, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/**
 * Provider for the CheckboxControlValueAccessor directive
 */
export const CHECKBOX_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CheckboxControlValueAccessorDirective),
  multi: true
};

/**
 * A directive that makes Fluent UI checkbox components work with Angular forms.
 * 
 * Usage:
 * ```
 * <fluent-checkbox ngCheckboxControl [(ngModel)]="isChecked">
 * ```
 */
@Directive({
  selector: 'fluent-checkbox[ngCheckboxControl]',
  standalone: true,
  providers: [CHECKBOX_VALUE_ACCESSOR]
})
export class CheckboxControlValueAccessorDirective implements ControlValueAccessor {
  /**
   * Called when the component value changes (UI → model)
   */
  private onChange: (value: boolean) => void = () => {};
  
  /**
   * Called when the component is touched
   */
  private onTouched: () => void = () => {};

  constructor(private readonly elementRef: ElementRef) {
    // Add event listener to the native change event from the Fluent component
    this.elementRef.nativeElement.addEventListener('change', this.handleChange.bind(this));
  }

  /**
   * Handle change events from the custom element
   */
  private handleChange(event: Event) {
    const checkbox = event.target as any;
    this.onChange(checkbox.checked);
  }

  /**
   * Listen for the click event to mark as touched
   */
  @HostListener('click')
  handleClick() {
    this.onTouched();
  }

  /**
   * Sets the "checked" property on the checkbox element
   * @param value New value from the model
   */
  writeValue(value: boolean): void {
    this.elementRef.nativeElement.checked = value;
  }

  /**
   * Registers a callback function that should be called when the control's value changes
   * @param fn Callback function to register
   */
  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  /**
   * Registers a callback function that should be called when the control is touched
   * @param fn Callback function to register
   */
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  /**
   * Function called when the control status changes to or from "DISABLED"
   * @param isDisabled Whether the form control is disabled
   */
  setDisabledState(isDisabled: boolean): void {
    this.elementRef.nativeElement.disabled = isDisabled;
  }
} 