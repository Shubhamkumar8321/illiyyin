// types/tinymce.d.ts

export interface TinyMCEBlobInfo {
  blob: () => Blob;
  blobUri: () => string;
  base64: () => string;
  filename: () => string;
}