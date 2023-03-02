import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { ServiceWorkerModule } from '@angular/service-worker';

import { VirtualScrollerModule } from 'ngx-virtual-scroller';

import { FilePathService } from './file-path.service';

import { AppComponent } from './app.component';
import { ThumbnailComponent } from './thumb/thumbnail.component';

import { DurationPipe } from './duration.pipe';
import { SearchPipe } from './search.pipe';

import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    DurationPipe,
    SearchPipe,
    ThumbnailComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    VirtualScrollerModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
  ],
  providers: [
    FilePathService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
