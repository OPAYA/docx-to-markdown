export interface ConversionResult {
  markdown: string;
  images: ImageData[];
  warnings: string[];
}

export interface ImageData {
  filename: string;
  data: Blob;
  url: string;
}

export interface ConversionOptions {
  imagePrefix: string;
  headingDepthShift: number;
  inlineImages: boolean;
}