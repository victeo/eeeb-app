const originalSetItem = localStorage.setItem;

localStorage.setItem = function (...args: [string, string]) {
    console.log(`localStorage.setItem called with key: ${args[0]}, value: ${args[1]}`);
    if (args[0] === 'role') {
        console.trace('Setting role in localStorage');
    }
    originalSetItem.apply(this, args); // Passa os argumentos corretamente para o setItem original
};

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));


  
