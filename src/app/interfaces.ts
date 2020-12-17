// Mouse click events
export interface VideoClickEmit {
  video: ImageElement;
  thumbIndex: number;
}

type SocketMessageType = 'open-file' | 'refresh-request' | 'save-settings';

export interface SocketMessage {
  type: SocketMessageType;
  data?: any;
}

// Inherited directly from `Video Hub App` repository

export interface ImageElement {
  cleanName: string;             // file name cleaned of dots, underscores,and file extension; for searching. Can be *FOLDER* sometimes
  duration: number;              // number of seconds - duration of film
  fileName: string;              // full file name with extension - for opening the file
  fileSize: number;              // file size in bytes
  hash: string;                  // used for detecting changed files and as a screenshot identifier
  height: AllowedScreenshotHeight; // height of the video (px)
  inputSource: number;           // corresponding to `inputDirs`
  mtime: number;                 // file modification time
  birthtime: number;             // file creation time
  partialPath: string;           // for opening the file, just prepend the `inputDir` (starts with "/", is "/fldr1/fldr2", or can be "")
  screens: number;               // number of screenshots for this file
  stars: StarRating;             // star rating 0 = n/a, otherwise 1, 2, 3
  timesPlayed: number;           // number of times the file has been launched by VHA
  width: number;                 // width of the video (px)
  // ========================================================================
  // OPTIONAL
  // ------------------------------------------------------------------------
  defaultScreen?: number;        // index of default screenshot to show
  notes?: string;                // any free-form notes a user may want to add to any video
  tags?: string[];               // tags associated with this particular file
  year?: number;                 // optional tag to track the year of the video
  // ========================================================================
  // Stripped out and not saved in the VHA file
  // ------------------------------------------------------------------------
  deleted?: boolean;             // toggled after a successful delete of file; removed before saving .vha file
  durationDisplay: string;       // displayed duration in X:XX:XX format
  fileSizeDisplay: string;       // displayed as XXXmb or X.Xgb -- also co-opted for showing number of files in a *FOLDER*
  index: number;                 // for the `default` sort order
  resBucket: number;             // the resolution category the video falls into (for faster sorting)
  resolution: ResolutionString;  // e.g. `720`, `1080`, `SD`, `HD`, etc
  selected?: boolean;            // for batch-tagging of videos
}

export type StarRating = 0.5 | 1.5 | 2.5 | 3.5 | 4.5 | 5.5;

// must be heights from true `16:9` resolutions AND divisible by 8
export type AllowedScreenshotHeight = 144 | 216 | 288 | 360 | 432 | 504;

export type ResolutionString = '' | 'SD' | '720' | '720+' | '1080' | '1080+' | '4K' | '4K+';
