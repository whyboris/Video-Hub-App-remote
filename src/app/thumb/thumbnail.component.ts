import { ChangeDetectionStrategy, Component, EventEmitter, Output, ViewChild, input } from '@angular/core';
import { NgStyle, NgClass } from '@angular/common';

import { FilePathService } from '../file-path.service';

import type { ImageElement, VideoClickEmit } from '../interfaces';
import type { OnInit, ElementRef, OnDestroy } from "@angular/core";

@Component({
    selector: 'app-thumbnail',
    templateUrl: './thumbnail.component.html',
    styleUrls: ['./thumbnail.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [NgStyle, NgClass]
})
export class ThumbnailComponent implements OnInit, OnDestroy {

  @ViewChild('filmstripHolder', { static: false }) filmstripHolder: ElementRef;

  @Output() videoClick = new EventEmitter<VideoClickEmit>();

  readonly video = input<ImageElement>(undefined);

  readonly compactView = input<boolean>(undefined);
  readonly connected = input<boolean>(undefined);
  readonly darkMode = input<boolean>(undefined);
  readonly elHeight = input<number>(undefined);
  readonly elWidth = input<number>(undefined);
  readonly folderPath = input<string>(undefined);
  readonly hoverScrub = input<boolean>(undefined);
  readonly hubName = input<string>(undefined);
  readonly imgHeight = input<number>(undefined);
  readonly largerFont = input<boolean>(undefined);
  readonly returnToFirstScreenshot = input<boolean>(undefined);
  readonly showMeta = input<boolean>(undefined);
  readonly thumbAutoAdvance = input<boolean>(undefined);

  containerWidth: number;
  firstFilePath = '';
  folderThumbPaths: string[] = [];
  fullFilePath = '';
  hover: boolean;
  indexToShow = 1;
  leftOffset: number;
  percentOffset = 0;
  scrollInterval: number = null;

  constructor(
    public filePathService: FilePathService
  ) { }

  ngOnInit() {

    this.firstFilePath = this.filePathService.createFilePath('thumbnails', this.video().hash);
    this.fullFilePath = this.filePathService.createFilePath('filmstrips', this.video().hash);
    this.folderThumbPaths.push(this.firstFilePath);


    const video = this.video();
    if (video.defaultScreen) {
      this.hover = true;
      this.percentOffset = this.defaultScreenOffset(video);
    }
  }

  defaultScreenOffset(video: ImageElement): number {
    return 100 * video.defaultScreen / (video.screens);
  }

  /**
   * Handle when user starts touching the element (thumbnail)
   */
  handleTouchStart() {

    // console.log('TOUCH START!!!');

    this.containerWidth = this.filmstripHolder.nativeElement.getBoundingClientRect().width;

    // x offset -- for `handleTouchMove`
    this.leftOffset = this.filmstripHolder.nativeElement.getBoundingClientRect().left;

    if (this.thumbAutoAdvance()) {
      this.hover = true;

      this.scrollInterval = setInterval(() => {
        this.percentOffset = this.indexToShow * (100 / (this.video().screens));
        this.indexToShow++;
      }, 750);

    } else if (this.hoverScrub()) {
      this.hover = true;
    }
  }

  /**
   * Handle when user stops touching the screen
   */
  handleTouchEnd() {

    // console.log('TOUCH END !!!');

    if (this.thumbAutoAdvance()) {
      clearInterval(this.scrollInterval);
    }

    if (this.returnToFirstScreenshot()) {
      const video = this.video();
      if (video.defaultScreen !== undefined) {
        this.percentOffset = this.defaultScreenOffset(video);
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
  handleTouchMove($event: TouchEvent) {
    if (this.hoverScrub()) {

      const cursorX = ($event.targetTouches[0].clientX) - this.leftOffset;

      if (cursorX < this.containerWidth && cursorX > 0) {
        this.indexToShow = Math.floor(cursorX * (this.video().screens / this.containerWidth));
        this.percentOffset = this.indexToShow * (100 / (this.video().screens));
      }

    }
  }

  /**
   * Use $event to determine `indexToShow`
   * @param $event
   */
  handleClick($event: PointerEvent) {
    // TODO -- handle: this.hoverScrub
    // and then change name to `this.playFromClickedLocation` or something

    if (this.connected()) {
      const cursorX = $event.layerX;
      this.indexToShow = Math.floor(cursorX * (this.video().screens / this.containerWidth));
      this.videoClick.emit({ video: this.video(), thumbIndex: this.indexToShow });
    }
  }

  ngOnDestroy() {
    clearInterval(this.scrollInterval);
  }

}
