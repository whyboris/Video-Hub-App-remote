import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { VirtualScrollerModule } from 'ngx-virtual-scroller';

import { FilePathService } from './file-path.service';

import { AppComponent } from './app.component';
import { ThumbnailComponent } from './thumb/thumbnail.component';

import { SearchPipe } from './search.pipe';

@NgModule({
  declarations: [
    AppComponent,
    SearchPipe,
    ThumbnailComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    VirtualScrollerModule,
  ],
  providers: [
    FilePathService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
