import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { VirtualScrollerComponent } from 'ngx-virtual-scroller';

import { ImageElement, SocketMessage, VideoClickEmit } from './interfaces';

import { errorAppear, searchAnimation, settingsAnimation } from './animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [errorAppear, searchAnimation, settingsAnimation]
})
export class AppComponent implements OnInit {

  @ViewChild(VirtualScrollerComponent, { static: false }) virtualScroller: VirtualScrollerComponent;

  compactView: boolean = false;
  currentImgsPerRow: number = 2;
  darkMode: boolean = false;
  items: ImageElement[]; // ImageElement[]
  largerFont: boolean = true;
  previewHeight: number = 144;
  previewWidth: number = 256;
  searchString: string = '';
  showSearch: boolean = false;
  socketConnected: boolean = false;
  viewingSettings: boolean = false;
  websocket: WebSocket;

  hostname: string = window.location.hostname;
  port: string = window.location.port;

  constructor() { }

  ngOnInit() {
    this.setUpSocket();
    this.computePreviewWidth();
  }

  /**
   * Create a new socket connection, attach the four socket events to appropriate methods
   */
  setUpSocket(): void {
    // 'ws://localhost:8080' or for testing 'wss://echo.websocket.org'
    const socketAddress: string = 'ws://' + window.location.hostname + ':8080';

    this.websocket = new WebSocket(socketAddress);
    this.websocket.onopen = this.onOpen;
    this.websocket.onclose = this.onClose;
    this.websocket.onmessage = this.onMessage;
    this.websocket.onerror = this.onError;
  }

  /**
   * Handle click on video - send POST request to server
   * @param videoClick
   */
  handleClick(videoClick: VideoClickEmit): void {
    if (this.socketConnected) {
      const msg: SocketMessage = {
        type: 'open-file',
        data: videoClick
      };
      this.websocket.send(JSON.stringify(msg));
    }
  }

  /**
   * Zoom in
   */
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

  /**
   * Zoom out
   */
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

  /**
   * Toggle compact view on/off
   */
  toggleCompactView(): void {
    this.compactView = !this.compactView;
    this.virtualScroller.invalidateAllCachedMeasurements();
    this.computePreviewWidth();
  }

  /**
   * Toggle search tray on/off
   */
  toggleSearch(): void {
    this.showSearch = !this.showSearch;
    if (!this.showSearch) {
      this.searchString = '';
    }
  }

  /**
   * Request from server the current gallery view
   *      or refresh if not connected
   */
  refresh(): void {
    if (this.socketConnected) {
      const msg: SocketMessage = { type: 'refresh-request' };
      this.websocket.send(JSON.stringify(msg));
    } else {
      location.reload();
    }
  }

  // ===============================================================================================
  // Web socket event handlers
  // -----------------------------------------------------------------------------------------------

  /**
   * When socket connection succeeds
   */
  onOpen = (): void => {
    console.log('socket opened:');
    this.socketConnected = true;
    this.refresh();
  }

  /**
   * When a message arrives via socket connection
   * @param msg - object with `data` that is a JSON stringified `ImageElement[]`
   */
  onMessage = (msg: MessageEvent<string>): void => {
    // console.log('message received:');
    try {
      const data: ImageElement[] = JSON.parse(msg.data);
      this.items = data.filter((element: ImageElement) => element.cleanName !== '*FOLDER*' );
      // console.log(data[0]);
    } catch (e) {
      // console.log(e);
    }
  }

  /**
   * When socket connection closes
   */
  onClose = (): void => {
    console.log('CLOSING SOCKET');
    this.socketConnected = false;
    // make a message appear with a button "reconnect"
  }

  /**
   * When socket connection errors out
   */
  onError = (): void => {
    console.log('ERROR IN CONNECTION');
    this.socketConnected = false;
  }

}
