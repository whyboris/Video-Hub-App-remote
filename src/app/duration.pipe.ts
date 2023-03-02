import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'durationPipe'
})
export class DurationPipe implements PipeTransform {

  /**
   * Return length of video file formatted as X:XX:XX
   * or if `omitSeconds` then `Xhr XXmin`
   * @param numOfSec
   * @param destination -- dictates the output format (TimeFormat)
   */
  transform(
    numOfSec: number
  ): string {

    if (numOfSec === undefined) {
      // short circuit
      return '';
    }

    const h: string = (Math.floor(numOfSec / 3600)).toString();
    const m: string = (Math.floor(numOfSec / 60) % 60).toString();
    const s: string = (Math.floor(numOfSec) % 60).toString();

    // file should behave thus:
    // 0:00, 0:01 ... 0:59, 1:00, 1:01 ... 59:59, 1:00:00 ... 3:14:15 ...
    if (h !== '0') {
      return h + ':' + m.padStart(2, '0') + ':' + s.padStart(2, '0');
    } else {
      return           m.padStart(2, '0') + ':' + s.padStart(2, '0');
    }

  }

}
