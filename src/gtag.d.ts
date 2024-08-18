type TagType = "event";

export declare global {
  interface Window {
    gtag(type: TagType, event: string, params: { [key: string]: any }): void;
  }
}
