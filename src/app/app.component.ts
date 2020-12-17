import { Component, OnInit, ViewChild } from '@angular/core';
import { Platform } from '@angular/cdk/platform';

import { VirtualScrollerComponent } from 'ngx-virtual-scroller';

import { ImageElement, SocketMessage, VideoClickEmit } from './interfaces';

import { errorAppear, searchAnimation, settingsAnimation } from './animations';

interface RemoteSettings {
  compactView: boolean;
  darkMode: boolean;
  imgsPerRow: number;
  largerText: boolean;
}

type SocketMessageType = 'gallery' | 'settings';

interface IncomingMessage {
  type: SocketMessageType;
  data: RemoteSettings | ImageElement[];
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [errorAppear, searchAnimation, settingsAnimation]
})
export class AppComponent implements OnInit {

  @ViewChild(VirtualScrollerComponent, { static: false }) virtualScroller: VirtualScrollerComponent;

  settings: RemoteSettings = {
    compactView: false,
    darkMode: false,
    imgsPerRow: 2,
    largerText: true,
  }

  // variables
  items: ImageElement[]; // ImageElement[]
  previewHeight: number = 144;
  previewWidth: number = 256;
  searchString: string = '';
  showInstructions: boolean = false;
  showSearch: boolean = false;
  socketConnected: boolean = false;
  viewingSettings: boolean = false;
  websocket: WebSocket;

  // constants
  hostname: string = window.location.hostname;
  port: string = window.location.port;

  constructor(
    public platform: Platform
  ) { }

  ngOnInit() {
    this.setUpSocket();
    this.computePreviewWidth();
    this.showInstallInstructions();
  }

  /**
   * If iOS browser, show user how to install the app
   * otherwise do nothing
   */
  showInstallInstructions(): void {
    if (this.platform.IOS || this.platform.ANDROID) {
      const isInStandaloneMode = ('standalone' in window.navigator) && (window.navigator['standalone']);
      if (!isInStandaloneMode) {
        this.showInstructions = true;
      }
    }
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
  zoomIn(): void {
    if (this.settings.imgsPerRow > 1) {
      this.settings.imgsPerRow = this.settings.imgsPerRow - 1;
      this.updateAfterZoom();
    }
  }

  /**
   * Zoom out
   */
  zoomOut(): void {
    if (this.settings.imgsPerRow < 6) {
      this.settings.imgsPerRow = this.settings.imgsPerRow + 1;
      this.updateAfterZoom();
    }
  }

  /**
   * Refresh virtualScroller, width measurements, and update the view
   */
  updateAfterZoom(): void {
    this.virtualScroller.invalidateAllCachedMeasurements();
    this.virtualScroller.refresh();
    this.computePreviewWidth();
    setTimeout(() => {
      document.getElementById('scrollDiv').scrollTop = 0;
    });
    this.sendSettings();
  }

  /**
   * Computes the preview width for thumbnails view
   */
  computePreviewWidth(): void {
    const galleryWidth = document.getElementById('scrollDiv').getBoundingClientRect().width - 12;
    // note: we subtract 12 -- it is a bit more than the scrollbar on the right ----------- ^^^^

    const margin: number = (this.settings.compactView ? 4 : 40);
    this.previewWidth = (galleryWidth / this.settings.imgsPerRow) - margin;

    this.previewHeight = this.previewWidth * (9 / 16);
  }

  /**
   * Toggle compact view on/off
   */
  toggleCompactView(): void {
    this.settings.compactView = !this.settings.compactView;
    this.virtualScroller.invalidateAllCachedMeasurements();
    this.computePreviewWidth();
    this.sendSettings();
  }

  /**
   * Toggle dark mode
   */
  toggleDarkMode(): void {
    this.settings.darkMode = !this.settings.darkMode;
    this.sendSettings();
  }

  /**
   * Toggle font size
   */
  toggleFontSize(): void {
    this.settings.largerText = !this.settings.largerText;
    this.sendSettings();
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

  /**
   * Send over settings to VHA for saving
   */
  sendSettings(): void {
    if (this.socketConnected) {
      const msg: SocketMessage = {
        type: 'save-settings',
        data: this.settings,
      }
      this.websocket.send(JSON.stringify(msg));
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
      const data: IncomingMessage = JSON.parse(msg.data);

      if (data.type === 'settings') {
        console.log('SETTINGS ARRIVED !!!');
        console.log(data.data);
        if (data.data) {
          this.settings = data.data as RemoteSettings;
          this.updateAfterZoom();
        }

      } else if (data.type === 'gallery') {
        this.items = (data.data as ImageElement[]).filter((element: ImageElement) => element.cleanName !== '*FOLDER*' );
      }

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
  }

  /**
   * When socket connection errors out
   */
  onError = (): void => {
    console.log('ERROR IN CONNECTION');
    this.socketConnected = false;
  }

}
