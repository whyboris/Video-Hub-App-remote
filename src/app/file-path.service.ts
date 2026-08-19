import { Injectable } from '@angular/core';

import { environment } from './../environments/environment';

type FolderType = 'thumbnails' | 'filmstrips' | 'clips';

@Injectable()
export class FilePathService {

  /**
   * Build the browser-friendly path based on the input (only `/` and `%20`), prepend with `file://`
   * @param subfolder  - whether `thumbnails`, `filmstrips`, or `clips`
   * @param hash       - file hash
   */
  createFilePath(subfolder: FolderType, hash: string): string {
    return environment.imageRoutePrefix + subfolder + '/' + hash + '.jpg';
  }

}
