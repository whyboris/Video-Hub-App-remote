import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { VirtualScrollerComponent } from 'ngx-virtual-scroller';

import { environment } from './../environments/environment';

import { ImageElement, VideoClickEmit } from './interfaces';

import { searchAnimation, settingsAnimation } from './animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [searchAnimation, settingsAnimation]
})
export class AppComponent implements OnInit {

  @ViewChild(VirtualScrollerComponent, { static: false }) virtualScroller: VirtualScrollerComponent;
  @ViewChild('searchInput', { static: false }) searchInput: ElementRef;

  compactView: boolean = true;
  darkMode: boolean = false;
  currentImgsPerRow: number = 2;
  items: ImageElement[]; // ImageElement[]
  previewHeight: number = 144;
  previewWidth: number = 256;
  searchString: string = '';
  showSearch: boolean = false;
  socketConnected: boolean = false;
  viewingSettings: boolean = false;
  websocket: WebSocket;

  constructor(
    private http: HttpClient
  ) { }

  ngOnInit() {

    // 'ws://localhost:8080' or for testing 'wss://echo.websocket.org'
    const socketAddress: string = 'ws://' + window.location.hostname + ':8080';

    this.websocket = new WebSocket(socketAddress);
    this.websocket.onopen =    (event) => { this.onOpen(event)    };
    this.websocket.onclose =   (event) => { this.onClose(event)   };
    this.websocket.onmessage = (event) => { this.onMessage(event) };
    this.websocket.onerror =   (event) => { this.onError(event)   };

    console.log('fetching data!');

    this.getImageList().subscribe((data: ImageElement[]) => {
      console.log(data);
      this.items = data;
    });

    this.computePreviewWidth();

  }

  getImageList(): any {
    return this.http.get(environment.imageList);
  }

  handleClick(videoClick: VideoClickEmit): void {
    console.log(videoClick.video);
    console.log('Clicked index:', videoClick.thumbIndex);

    this.http.post(environment.openVideo, videoClick)
      .subscribe((response) => {
        console.log(response);
      });
  }

  zoomIn() {
    if (this.currentImgsPerRow > 1) {
      this.currentImgsPerRow = this.currentImgsPerRow - 1;
    }
    this.virtualScroller.invalidateAllCachedMeasurements();
    this.virtualScroller.refresh();
    this.computePreviewWidth();
    setTimeout(() => {
      document.getElementById('scrollDiv').scrollTop = 0;
    });
  }

  zoomOut() {
    if (this.currentImgsPerRow < 6) {
      this.currentImgsPerRow = this.currentImgsPerRow + 1;
    }
    this.virtualScroller.invalidateAllCachedMeasurements();
    this.virtualScroller.refresh();
    this.computePreviewWidth();
    setTimeout(() => {
      document.getElementById('scrollDiv').scrollTop = 0;
    });
  }

  /**
   * Computes the preview width for thumbnails view
   */
  computePreviewWidth(): void {
    const galleryWidth = document.getElementById('scrollDiv').getBoundingClientRect().width - 12;
    // note: we subtract 12 -- it is a bit more than the scrollbar on the right ----------- ^^^^

    const margin: number = (this.compactView ? 4 : 40);
    this.previewWidth = (galleryWidth / this.currentImgsPerRow) - margin;

    this.previewHeight = this.previewWidth * (9 / 16);
  }

  toggleCompactView(): void {
    this.compactView = !this.compactView;
    this.virtualScroller.invalidateAllCachedMeasurements();
    this.computePreviewWidth();
  }

  toggleSearch(): void {
    this.showSearch = !this.showSearch;
    if (this.showSearch) {
      setTimeout(() => {
        this.searchInput.nativeElement.focus();
      }, 100);
    } else {
      this.searchString = '';
    }
  }

  /**
   * Request from server the current gallery view
   */
  getLatestData() {
    this.websocket.send('refresh-request'); // request
  }

  /**
   * When socket connection succeeds
   */
  onOpen(a) {
    console.log('socket opened:');
    console.log(a);
    this.socketConnected = true;
    this.websocket.send('hi');
  }

  /**
   * When a message arrives via socket connection
   */
  onMessage(a) {
    console.log('message received:');
    try {
      const data: ImageElement[] = JSON.parse(a.data);
      this.items = data.filter((element: ImageElement) => element.cleanName !== '*FOLDER*' );
      console.log(data[0]);
    } catch (e) {
      console.log(e);
    }
  }

  /**
   * When socket connection closes
   */
  onClose(a) {
    console.log('CLOSING SOCKET');
    console.log(a);
    this.socketConnected = false;
    // make a message appear with a button "reconnect"
  }

  /**
   * When socket connection errors out
   */
  onError(a) {
    console.log('ERROR IN CONNECTION');
    console.log(a);
    this.socketConnected = false;
  }

}
