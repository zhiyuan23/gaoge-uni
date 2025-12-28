export interface CommonReq {
  [key: string]: any;
}

export interface CommonRes {
  [key: string]: any;
}

export interface UploadReq {
  filePath: string;
  name?: string;
  extraData?: Record<string, any>;
}
export interface UploadRes {
  file: string;
  url: string;
}
