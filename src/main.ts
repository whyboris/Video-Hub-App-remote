import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { enableProdMode, importProvidersFrom } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ServiceWorkerModule } from '@angular/service-worker';

import { VirtualScrollerModule } from '@iharbeck/ngx-virtual-scroller';

import { FilePathService } from './app/file-path.service';

import { AppComponent } from './app/app.component';

import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserAnimationsModule, BrowserModule, CommonModule, FormsModule, VirtualScrollerModule, ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })),
        FilePathService
    ]
})
  .catch(err => console.error(err));
