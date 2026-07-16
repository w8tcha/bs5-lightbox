export default interface LightboxOptions {
    interval?: boolean;
    target?: string;
    gallery?: string | string[];
    size?: "sm" | "lg" | "xl" | "fullscreen" | string;
    constrain?: boolean;
    [key: string]: any;
}
