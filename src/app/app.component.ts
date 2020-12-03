import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

import { environment } from './../environments/environment';

import { ImageElement, VideoClickEmit } from './interfaces';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  items: ImageElement[]; // ImageElement[]
  searchString: string = '';
  websocket: WebSocket;
  socketConnected: boolean = false;

  constructor(
    private http: HttpClient
  ) { }

  ngOnInit() {

    // 'ws://localhost:8080' or for testing 'wss://echo.websocket.org');
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
      this.items = data;
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
