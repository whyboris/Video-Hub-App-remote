import { enableProdMode, provideZonelessChangeDetection, importProvidersFrom } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';


import { environment } from './environments/environment';
import { FilePathService } from './app/file-path.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VirtualScrollerModule } from '@iharbeck/ngx-virtual-scroller';
import { ServiceWorkerModule } from '@angular/service-worker';
import { AppComponent } from './app/app.component';

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
