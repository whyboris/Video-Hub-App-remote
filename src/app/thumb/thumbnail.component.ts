import { Component, Input, Output, EventEmitter, OnInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';

import { FilePathService } from '../file-path.service';

import { ImageElement, VideoClickEmit } from '../interfaces';

@Component({
  selector: 'app-thumbnail',
  templateUrl: './thumbnail.component.html',
  styleUrls: ['./thumbnail.component.scss']
})
export class ThumbnailComponent implements OnInit, OnDestroy {

  @ViewChild('filmstripHolder', { static: false }) filmstripHolder: ElementRef;

  @Output() videoClick = new EventEmitter<VideoClickEmit>();

  @Input() video: ImageElement;

  @Input() compactView: boolean;
  @Input() connected: boolean;
  @Input() darkMode: boolean;
  @Input() elHeight: number;
  @Input() elWidth: number;
  @Input() folderPath: string;
  @Input() hoverScrub: boolean;
  @Input() hubName: string;
  @Input() imgHeight: number;
  @Input() largerFont: boolean;
  @Input() returnToFirstScreenshot: boolean;
  @Input() showMeta: boolean;
  @Input() thumbAutoAdvance: boolean;

  containerWidth: number;
  firstFilePath = '';
  folderThumbPaths: string[] = [];
  fullFilePath = '';
  hover: boolean;
  indexToShow: number = 1;
  percentOffset: number = 0;
  scrollInterval: any = null;

  leftOffset: number;


  constructor(
    public filePathService: FilePathService
  ) { }

  ngOnInit() {

    this.firstFilePath = this.filePathService.createFilePath(this.folderPath, this.hubName, 'thumbnails', this.video.hash);
    this.fullFilePath = this.filePathService.createFilePath(this.folderPath, this.hubName, 'filmstrips', this.video.hash);
    this.folderThumbPaths.push(this.firstFilePath);


    if (this.video.defaultScreen) {
      this.hover = true;
      this.percentOffset = this.defaultScreenOffset(this.video);
    }
  }

  defaultScreenOffset(video: ImageElement): number {
    return 100 * video.defaultScreen / (video.screens - 1);
  }

  /**
   * Handle when user starts touching the element (thumbnail)
   */
  handleTouchStart() {

    // console.log('TOUCH START!!!');

    this.containerWidth = this.filmstripHolder.nativeElement.getBoundingClientRect().width;

    // x offset -- for `handleTouchMove`
    this.leftOffset = this.filmstripHolder.nativeElement.getBoundingClientRect().left;

    if (this.thumbAutoAdvance) {
      this.hover = true;

      this.scrollInterval = setInterval(() => {
        this.percentOffset = this.indexToShow * (100 / (this.video.screens - 1));
        this.indexToShow++;
      }, 750);

    } else if (this.hoverScrub) {
      this.hover = true;
    }
  }

  /**
   * Handle when user stops touching the screen
   */
  handleTouchEnd() {

    // console.log('TOUCH END !!!');

    if (this.thumbAutoAdvance) {
      clearInterval(this.scrollInterval);
    }

    if (this.returnToFirstScreenshot) {
      if (this.video.defaultScreen !== undefined) {
        this.percentOffset = this.defaultScreenOffset(this.video);
      } else {
        this.hover = false;
        this.percentOffset = 0;
      }
    }
  }

  /**
   * Handle finger dragging
   * @param $event
   */
  handleTouchMove($event: any) {
    if (this.hoverScrub) {

      const cursorX = ($event.targetTouches[0].clientX) - this.leftOffset;

      if (cursorX < this.containerWidth && cursorX > 0) {
        this.indexToShow = Math.floor(cursorX * (this.video.screens / this.containerWidth));
        this.percentOffset = this.indexToShow * (100 / (this.video.screens - 1));
      }

    }
  }

  /**
   * Use $event to determine `indexToShow`
   * @param $event
   */
  handleClick($event: any) {
    // TODO -- handle: this.hoverScrub
    // and then change name to `this.playFromClickedLocation` or something

    if (this.connected) {
      const cursorX = $event.layerX;
      this.indexToShow = Math.floor(cursorX * (this.video.screens / this.containerWidth));
      this.videoClick.emit({ video: this.video, thumbIndex: this.indexToShow });
    }
  }

  ngOnDestroy() {
    clearInterval(this.scrollInterval);
  }

}
