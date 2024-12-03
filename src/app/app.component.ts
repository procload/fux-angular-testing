import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonWrapperModule, FieldWrapperModule, CheckboxWrapperModule } from '@fabric-msft/fluent-angular';
import { setTheme, webLightTheme } from '@fabric-msft/theme';

setTheme(webLightTheme);

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ButtonWrapperModule, FieldWrapperModule, CheckboxWrapperModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'fabric-angular-testing';
}
