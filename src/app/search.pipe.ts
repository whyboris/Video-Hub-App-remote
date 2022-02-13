import { Pipe } from '@angular/core';

import type { PipeTransform } from '@angular/core';
import type { ImageElement } from './interfaces';

@Pipe({
  name: 'searchPipe'
})
export class SearchPipe implements PipeTransform {

  /**
   * Return only items that match search string
   * @param finalArray
   * @param toggleHack    {boolean} Hack to return zero results
   */
  transform(finalArray: ImageElement[], searchString: string): ImageElement[] {

    if (searchString) {
      return finalArray.filter(element => element.cleanName.toLowerCase().includes(searchString.toLowerCase()));
    } else {
      return finalArray;
    }

  }

}
