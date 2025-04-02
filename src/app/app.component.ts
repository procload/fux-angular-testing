import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import 'element-internals-polyfill';

import { 
  Button, Checkbox, Field, 
  ButtonDefinition, CheckboxDefinition, FieldDefinition,
  TextInputDefinition, SwitchDefinition
} from '@fluentui/web-components';

import { setTheme, webLightTheme } from '@fabric-msft/theme';
import { CheckboxControlValueAccessorDirective } from './directives/checkbox-control-value-accessor.directive';
import { SwitchControlValueAccessorDirective } from './directives/switch-control-value-accessor.directive';

setTheme(webLightTheme);

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CheckboxControlValueAccessorDirective,
    SwitchControlValueAccessorDirective
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppComponent implements OnInit {
  // Two-way binding test properties
  testTextValue: string = '';
  testCheckboxValue: boolean = false;
  testSwitchValue: boolean = false;
  
  ngOnInit() {
    // Define components after Angular has initialized
    try {
      ButtonDefinition.define(customElements);
      CheckboxDefinition.define(customElements);
      FieldDefinition.define(customElements);
      TextInputDefinition.define(customElements);
      SwitchDefinition.define(customElements);
    } catch (error) {
      console.error('Error defining web components:', error);
    }
  }
  
  // Methods for two-way binding test
  setTestValues() {
    this.testTextValue = 'Test value set programmatically';
    this.testCheckboxValue = true;
    this.testSwitchValue = true;
    
    console.log('Test values set', {
      text: this.testTextValue,
      checkbox: this.testCheckboxValue,
      switch: this.testSwitchValue
    });
  }
  
  resetTestValues() {
    this.testTextValue = '';
    this.testCheckboxValue = false;
    this.testSwitchValue = false;
    
    console.log('Test values reset');
  }
  
  onCheckboxChange(event: any) {
    // Update the testCheckboxValue based on the checkbox's checked property
    this.testCheckboxValue = event.target.checked;
    console.log('Checkbox value changed:', this.testCheckboxValue);
  }
  
  onSwitchChange(event: any) {
    // Update the testSwitchValue based on the switch's checked property
    this.testSwitchValue = event.target.checked;
    console.log('Switch value changed:', this.testSwitchValue);
  }
}
