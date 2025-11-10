import { bootstrapApplication } from '@angular/platform-browser';
import { appConfigComponent } from './app/app.config';
import { App } from './app/app.component';

bootstrapApplication(App, appConfigComponent)
  .catch((err) => console.error(err));
