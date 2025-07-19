export default interface LightboxOptions {
  interval?: boolean;
  // The target element selector to trigger lightbox events
  target?: string;
  // Optional gallery of elements or string containing gallery name
  gallery?: string | string[];
  // Size of lightbox. Can also be controlled via data-size attribute on the trigger element.
  size?: "sm" | "lg" | "xl" | "fullscreen" | string;
  // Don't allow images to be larger than their original size
  constrain?: boolean;
  [key: string]: any; // for extended Bootstrap options
}
