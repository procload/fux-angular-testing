import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, isDevMode } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import 'element-internals-polyfill';

import { 
  Button, Checkbox, Field, 
  ButtonDefinition, CheckboxDefinition, FieldDefinition,
  RadioDefinition, RadioGroupDefinition, TextInputDefinition,
  TextAreaDefinition, DropdownDefinition
} from '@fluentui/web-components';

import { setTheme, webLightTheme } from '@fabric-msft/theme';

setTheme(webLightTheme);

// API base URL
const DND_API_BASE = 'https://www.dnd5eapi.co/api';

// Interface for character data
interface Character {
  name: string;
  class: string;
  background: string;
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
  equipment: string[];
}

// Interface for API responses
interface DndApiResponse {
  index: string;
  name: string;
  [key: string]: any;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    CommonModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppComponent implements OnInit {
  characterForm!: FormGroup;
  dndClasses: DndApiResponse[] = [];
  dndBackgrounds: DndApiResponse[] = [];
  equipment: DndApiResponse[] = [];
  
  characterData: Character | null = null;
  classDetails: any = null;
  isLoading = false;
  errorMessage = '';
  
  // Two-way binding test properties
  testTextValue: string = '';
  testCheckboxValue: boolean = false;
  testRadioValue: string = '';
  
  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    // ElementInternals polyfill is already imported at the top of the file
  }
  
  ngOnInit() {
    // Define components after Angular has initialized
    try {
      ButtonDefinition.define(customElements);
      CheckboxDefinition.define(customElements);
      FieldDefinition.define(customElements);
      RadioDefinition.define(customElements);
      RadioGroupDefinition.define(customElements);
      TextInputDefinition.define(customElements);
      TextAreaDefinition.define(customElements);
      DropdownDefinition.define(customElements);
    } catch (error) {
      console.error('Error defining web components:', error);
    }
    
    // Initialize the form
    this.characterForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      class: ['', Validators.required],
      background: ['', Validators.required],
      strength: [10, [Validators.required, Validators.min(3), Validators.max(20)]],
      dexterity: [10, [Validators.required, Validators.min(3), Validators.max(20)]],
      constitution: [10, [Validators.required, Validators.min(3), Validators.max(20)]],
      intelligence: [10, [Validators.required, Validators.min(3), Validators.max(20)]],
      wisdom: [10, [Validators.required, Validators.min(3), Validators.max(20)]],
      charisma: [10, [Validators.required, Validators.min(3), Validators.max(20)]],
      equipment: this.fb.array([])
    });
    
    // Fetch data from D&D API
    this.fetchClasses();
    this.fetchBackgrounds();
    this.fetchEquipment();
  }
  
  // Methods for two-way binding test
  setTestValues() {
    this.testTextValue = 'Test value set programmatically';
    this.testCheckboxValue = true;
    this.testRadioValue = 'option2';
    console.log('Test values set', {
      text: this.testTextValue,
      checkbox: this.testCheckboxValue,
      radio: this.testRadioValue
    });
  }
  
  resetTestValues() {
    this.testTextValue = '';
    this.testCheckboxValue = false;
    this.testRadioValue = '';
    console.log('Test values reset');
  }
  
  onCheckboxChange(event: any) {
    // Update the testCheckboxValue based on the checkbox's checked property
    this.testCheckboxValue = event.target.checked;
    console.log('Checkbox value changed:', this.testCheckboxValue);
  }
  
  fetchClasses() {
    this.http.get<any>(`${DND_API_BASE}/classes`).subscribe({
      next: (response) => {
        if (response && response.results) {
          this.dndClasses = response.results;
        } else {
          console.error('Invalid response format from /classes API:', response);
          this.errorMessage = 'Failed to load character classes. Invalid response format.';
        }
      },
      error: (error) => {
        console.error('Error fetching classes:', error);
        this.errorMessage = 'Failed to load character classes. Please try again.';
      }
    });
  }
  
  fetchBackgrounds() {
    this.http.get<any>(`${DND_API_BASE}/backgrounds`).subscribe({
      next: (response) => {
        if (response && response.results) {
          this.dndBackgrounds = response.results;
        } else {
          console.error('Invalid response format from /backgrounds API:', response);
        }
      },
      error: (error) => {
        console.error('Error fetching backgrounds:', error);
      }
    });
  }
  
  fetchEquipment() {
    this.http.get<any>(`${DND_API_BASE}/equipment-categories/weapon`).subscribe({
      next: (response) => {
        if (response && response.equipment) {
          this.equipment = response.equipment.slice(0, 10); // Limit to 10 items for simplicity
        } else if (response && response.results) {
          // Handle the case where the API might return 'results' instead of 'equipment'
          this.equipment = response.results.slice(0, 10);
        } else {
          console.error('Invalid response format from /equipment-categories/weapon API:', response);
          this.equipment = []; // Set to empty array to avoid undefined errors
        }
      },
      error: (error) => {
        console.error('Error fetching equipment:', error);
      }
    });
  }
  
  onSubmit() {
    if (this.characterForm.invalid) {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.characterForm.controls).forEach(key => {
        const control = this.characterForm.get(key);
        control?.markAsTouched();
      });
      return;
    }
    
    this.isLoading = true;
    this.characterData = this.characterForm.value;
    
    // Fetch class details from the API
    const selectedClass = this.characterForm.get('class')?.value;
    this.http.get<any>(`${DND_API_BASE}/classes/${selectedClass}`).subscribe({
      next: (response) => {
        this.classDetails = response;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching class details:', error);
        this.errorMessage = 'Failed to load class details. Please try again.';
        this.isLoading = false;
      }
    });
  }
  
  onEquipmentChange(event: any) {
    const equipmentFormArray = this.characterForm.get('equipment') as FormArray;
    
    if (event.target.checked) {
      equipmentFormArray.push(this.fb.control(event.target.value));
    } else {
      const index = equipmentFormArray.value.indexOf(event.target.value);
      if (index >= 0) {
        equipmentFormArray.removeAt(index);
      }
    }
  }
  
  resetForm() {
    this.characterForm.reset({
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10
    });
    this.characterData = null;
    this.classDetails = null;
    this.errorMessage = '';
  }
  
  // Helper getter for form validation
  get f() { 
    return this.characterForm.controls; 
  }
  
  // Get modifier for an ability score
  getModifier(score: number): string {
    const modifier = Math.floor((score - 10) / 2);
    return modifier >= 0 ? `+${modifier}` : `${modifier}`;
  }
}
