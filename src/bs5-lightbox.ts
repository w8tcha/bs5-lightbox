/**
 * Lightbox for Bootstrap 5
 *
 * @file Creates a modal with a lightbox carousel.
 * @module bs5-lightbox
 */

import * as bootstrap from "bootstrap";
import LightboxOptions from "./interfaces/lightboxOptions";

class Lightbox {
  private hash: string;
  private settings: LightboxOptions;
  private modalOptions: bootstrap.Modal.Options;
  private carouselOptions: bootstrap.Carousel.Options;
  private el: HTMLElement;
  private src: string;
  private sources: string[];
  private type: string;
  private carouselElement!: HTMLElement;
  private modalElement!: HTMLElement;
  private modal!: bootstrap.Modal;
  private carousel!: bootstrap.Carousel;

  static allowedEmbedTypes = ["embed", "youtube", "vimeo", "instagram", "url"];
  static allowedMediaTypes = [...Lightbox.allowedEmbedTypes, "image", "html"];
  static defaultSelector = '[data-toggle="lightbox"]';

  constructor(
    el: HTMLElement | string,
    options: Partial<LightboxOptions> = {}
  ) {
    this.hash = this.randomHash();
    this.settings = Object.assign(
      {},
      bootstrap.Modal.Default,
      bootstrap.Carousel.Default,
      {
        interval: false,
        target: '[data-toggle="lightbox"]',
        gallery: "",
        size: "xl",
        constrain: true,
      },
      options
    );

    this.modalOptions = this.setOptionsFromSettings(bootstrap.Modal.Default);
    this.carouselOptions = this.setOptionsFromSettings(
      bootstrap.Carousel.Default
    );

    if (typeof el === "string") {
      this.settings.target = el;
      el = document.querySelector(el) as HTMLElement;
    }

    this.el = el;
    this.type = el.dataset.type || "";

    if (el.dataset.size) {
      this.settings.size = el.dataset.size;
    }

    this.src = this.getSrc(el);
    this.sources = this.getGalleryItems();
    this.createCarousel();
    this.createModal();
  }

  show(): void {
    document.body.appendChild(this.modalElement);
    this.modal.show();
  }

  hide(): void {
    this.modal.hide();
  }

  private setOptionsFromSettings(obj: any): any {
    return Object.keys(obj).reduce(
      (p: any, c: string) => Object.assign(p, { [c]: this.settings[c] }),
      {}
    );
  }

  private getSrc(el: HTMLElement): string {
    let src =
      el.dataset.src ||
      el.dataset.remote ||
      (el as HTMLAnchorElement).href ||
      "https://placehold.co/1600x900";

    if (el.dataset.type === "html" || el.dataset.type === "image") {
      return src;
    }

    if (!/https?:\/\//.test(src)) {
      src = window.location.origin + src;
    }

    const url = new URL(src);
    if (el.dataset.footer || el.dataset.caption) {
      url.searchParams.set(
        "caption",
        el.dataset.footer || el.dataset.caption || ""
      );
    }

    return url.toString();
  }

  private getGalleryItems(): string[] {
    let galleryTarget: string | undefined;

    if (this.settings.gallery) {
      if (Array.isArray(this.settings.gallery)) return this.settings.gallery;
      galleryTarget = this.settings.gallery;
    } else if (this.el.dataset.gallery) {
      galleryTarget = this.el.dataset.gallery;
    }

    const gallery = galleryTarget
      ? [
          ...new Set(
            Array.from(
              document.querySelectorAll(`[data-gallery="${galleryTarget}"]`),
              (v: Element) => {
                const el = v as HTMLElement;
                return `${el.dataset.type || ""}${this.getSrc(el)}`;
              }
            )
          ),
        ]
      : [`${this.type || ""}${this.src}`];

    return gallery;
  }

  private getYoutubeId(src: string): string | false {
    const matches = src.match(
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    );
    return matches && matches[2].length === 11 ? matches[2] : false;
  }

  private getYoutubeLink(src: string): string | false {
    const youtubeId = this.getYoutubeId(src);
    if (!youtubeId) return false;

    const arr = src.split("?");
    const params = arr.length > 1 ? `?${arr[1]}` : "";

    return `https://www.youtube.com/embed/${youtubeId}${params}`;
  }

  private getInstagramEmbed(src: string): string | undefined {
    if (/instagram/.test(src)) {
      src += /\/embed$/.test(src) ? "" : "/embed";
      return `<iframe src="${src}" class="start-50 translate-middle-x" style="max-width: 500px" frameborder="0" scrolling="no" allowtransparency="true"></iframe>`;
    }
  }

  private isEmbed(src: string): boolean {
    const regex = new RegExp(`(${Lightbox.allowedEmbedTypes.join("|")})`);
    const isEmbed = regex.test(src);
    const isImg =
      /\.(png|jpe?g|gif|svg|webp)/i.test(src) ||
      this.el.dataset.type === "image";

    return isEmbed || !isImg;
  }

  private createCarousel(): bootstrap.Carousel {
    const template = document.createElement("template");
    const types = Lightbox.allowedMediaTypes.join("|");

    const slidesHtml = this.sources
      .map((src, i) => {
        src = src.replace(/\/$/, "");
        const regex = new RegExp(`^(${types})`, "i");
        const isHtml = /^html/.test(src);
        const isForcedImage = /^image/.test(src);

        if (regex.test(src)) {
          src = src.replace(regex, "");
        }

        const imgClasses = this.settings.constrain
          ? "mw-100 mh-100 h-auto w-auto m-auto top-0 end-0 bottom-0 start-0"
          : "h-100 w-100";

        const params = new URLSearchParams(src.split("?")[1]);
        let caption = "";
        let url = src;

        if (params.get("caption")) {
          try {
            url = new URL(src).toString().replace(`?${params}`, "");
            caption = `<div class="carousel-caption d-none d-md-block" style="z-index:2"><p class="bg-secondary rounded">${params.get(
              "caption"
            )}</p></div>`;
          } catch {
            url = src;
          }
        }

        let inner = `<img src="${url}" class="d-block ${imgClasses} img-fluid" style="z-index: 1; object-fit: contain;" />`;
        let attributes = "";
        const instagramEmbed = this.getInstagramEmbed(src);
        const youtubeLink = this.getYoutubeLink(src);

        if (this.isEmbed(src) && !isForcedImage) {
          if (youtubeLink) {
            src = youtubeLink;
            attributes =
              'title="YouTube video player" frameborder="0" allow="accelerometer autoplay clipboard-write encrypted-media gyroscope picture-in-picture"';
          }
          inner =
            instagramEmbed ||
            `<img src="${src}" ${attributes} class="d-block mw-100 mh-100 h-auto w-auto m-auto top-0 end-0 bottom-0 start-0 img-fluid" style="z-index: 1; object-fit: contain;" />`;
        }

        if (isHtml) {
          inner = src;
        }

        const spinner = `<div class="position-absolute top-50 start-50 translate-middle text-white"><div class="spinner-border" style="width: 3rem; height: 3rem" role="status"></div></div>`;

        return `
          <div class="carousel-item ${
            !i ? "active" : ""
          }" style="min-height: 100px">
            ${spinner}
            <div class="ratio ratio-16x9" style="background-color: #000;">${inner}</div>
            ${caption}
          </div>`;
      })
      .join("");

    const controlsHtml =
      this.sources.length < 2
        ? ""
        : `
        <button id="#lightboxCarousel-${this.hash}-prev" class="carousel-control-prev" type="button" data-bs-target="#lightboxCarousel-${this.hash}" data-bs-slide="prev">
          <span class="btn btn-primary carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Previous</span>
        </button>
        <button id="#lightboxCarousel-${this.hash}-next" class="carousel-control-next" type="button" data-bs-target="#lightboxCarousel-${this.hash}" data-bs-slide="next">
          <span class="btn btn-primary carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Next</span>
        </button>`;

    const indicatorsHtml = `
      <div class="carousel-indicators" style="bottom: -40px">
        ${this.sources
          .map(
            (_, index) => `
            <button type="button" data-bs-target="#lightboxCarousel-${
              this.hash
            }" data-bs-slide-to="${index}" class="${
              index === 0 ? "active" : ""
            }" aria-current="${
              index === 0 ? "true" : "false"
            }" aria-label="Slide ${index + 1}"></button>`
          )
          .join("")}
      </div>`;

    template.innerHTML = `
      <div id="lightboxCarousel-${this.hash}" class="lightbox-carousel carousel slide" data-bs-ride="carousel" data-bs-interval="${this.carouselOptions.interval}">
        <div class="carousel-inner">${slidesHtml}</div>
        ${indicatorsHtml}
        ${controlsHtml}
      </div>`.trim();

    this.carouselElement = template.content.firstChild as HTMLElement;

    const options: bootstrap.Carousel.Options = {
      ...this.carouselOptions,
      keyboard: false,
    };

    this.carousel = new bootstrap.Carousel(this.carouselElement, options);

    const elSrc =
      this.type && this.type !== "image" ? this.type + this.src : this.src;
    this.carousel.to(this.findGalleryItemIndex(this.sources, elSrc));

    if (this.carouselOptions.keyboard === true) {
      document.addEventListener("keydown", (e: KeyboardEvent) => {
        if (e.code === "ArrowLeft") {
          document
            .getElementById(`#lightboxCarousel-${this.hash}-prev`)
            ?.click();
          return false;
        }
        if (e.code === "ArrowRight") {
          document
            .getElementById(`#lightboxCarousel-${this.hash}-next`)
            ?.click();
          return false;
        }
      });
    }

    return this.carousel;
  }

  private findGalleryItemIndex(haystack: string[], needle: string): number {
    return haystack.findIndex((item) => item.includes(needle)) || 0;
  }

  private createModal(): bootstrap.Modal {
    const template = document.createElement("template");
    template.innerHTML = `
      <div class="modal lightbox fade" id="lightboxModal-${this.hash}" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered modal-${this.settings.size}">
          <div class="modal-content border-0 bg-transparent">
            <div class="modal-body p-0">
              <button type="button" class="btn-close position-absolute p-3" data-bs-dismiss="modal" aria-label="Close" style="top: -15px;right:-40px"></button>
            </div>
          </div>
        </div>
      </div>`.trim();

    this.modalElement = template.content.firstChild as HTMLElement;
    this.modalElement
      .querySelector(".modal-body")
      ?.appendChild(this.carouselElement);

    this.modalElement.addEventListener("hidden.bs.modal", () =>
      this.modalElement.remove()
    );
    this.modalElement
      .querySelector("[data-bs-dismiss]")
      ?.addEventListener("click", () => this.modal.hide());

    this.modal = new bootstrap.Modal(this.modalElement, this.modalOptions);
    return this.modal;
  }

  private randomHash(length = 8): string {
    return Array.from({ length }, () =>
      Math.floor(Math.random() * 36).toString(36)
    ).join("");
  }

  static initialize(this: HTMLElement, e: Event): void {
    e.preventDefault();
    const lightbox = new Lightbox(this);
    lightbox.show();
  }
}

document
  .querySelectorAll(Lightbox.defaultSelector)
  .forEach((el) => el.addEventListener("click", Lightbox.initialize));

if (typeof window !== "undefined" && (window as any).bootstrap) {
  (window as any).bootstrap.Lightbox = Lightbox;
}

export default Lightbox;
