import { Injectable } from '@angular/core';

import { environment } from './../environments/environment';

type FolderType = 'thumbnails' | 'filmstrips' | 'clips';

@Injectable()
export class FilePathService {

  constructor() { }

  /**
   * Build the browser-friendly path based on the input (only `/` and `%20`), prepend with `file://`
   * @param folderPath - path to where `vha-folder` is stored
   * @param hubName    - name of hub (to pick the correct `vha-folder` name)
   * @param subfolder  - whether `thumbnails`, `filmstrips`, or `clips`
   * @param hash       - file hash
   * @param video      - boolean -- if true then extension is `.mp4`
   */
  createFilePath(folderPath: string, hubName: string, subfolder: FolderType, hash: string, video?: boolean): string {
    return environment.imageRoutePrefix + subfolder + '/' + hash + '.jpg';
  }

}
