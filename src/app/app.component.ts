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

  constructor(
    private http: HttpClient
  ) { }

  ngOnInit() {
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

}
