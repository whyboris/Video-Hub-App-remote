import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { VirtualScrollerModule } from 'ngx-virtual-scroller';

import { FilePathService } from './file-path.service';

import { AppComponent } from './app.component';
import { ThumbnailComponent } from './thumb/thumbnail.component';

import { SearchPipe } from './search.pipe';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    SearchPipe,
    ThumbnailComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    VirtualScrollerModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
  ],
  providers: [
    FilePathService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
