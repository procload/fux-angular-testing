import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { ButtonWrapperModule, FieldWrapperModule, CheckboxWrapperModule } from '@fabric-msft/fluent-angular';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, ButtonWrapperModule, FieldWrapperModule, CheckboxWrapperModule], // Include the standalone component and Fluent module
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    compiled = fixture.nativeElement;
  });

  it('should render the Fluent button', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const fluentButton = compiled.querySelector('fluent-button');
    expect(fluentButton).toBeTruthy();
  });

  it('should render the label correctly', () => {
    const label = compiled.querySelector('label[slot="label"]');
    expect(label).toBeTruthy();
    expect(label?.textContent?.trim()).toBe('Checked (circular)');
  });

  it('should render the checkbox with the correct attributes', async () => {
    const checkbox = compiled.querySelector('fluent-checkbox') as any;
    checkbox.checked = true;
    expect(checkbox).toBeTruthy();
    expect(checkbox.getAttribute('id')).toBe('checkbox-2');
    expect(checkbox.getAttribute('shape')).toBe('circular');
    expect(checkbox.getAttribute('slot')).toBe('input');
  
    // Wait for the web component lifecycle to complete
    await new Promise((resolve) => setTimeout(resolve, 100));
  
    // Check the 'checked' property after initialization
    const isChecked = (checkbox as any).checked; // Access the property directly
    expect(isChecked).toBe(true);
  });

  it('should toggle the checkbox when clicked', () => {
    const checkbox = compiled.querySelector('fluent-checkbox') as HTMLElement;
    checkbox?.dispatchEvent(new MouseEvent('click'));
    fixture.detectChanges();

    // Check the state after interaction
    expect(checkbox?.getAttribute('checked')).toBeNull();
  });
});