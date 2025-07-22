/*!
 * Lightbox for Bootstrap 5 v1.8.6 (https://trvswgnr.github.io/bs5-lightbox/)
 * Copyright 2025 Travis Aaron Wagner (https://github.com/trvswgnr/)
 * Licensed under MIT (https://github.com/trvswgnr/bs5-lightbox/blob/main/LICENSE)
 */
import * as r from "bootstrap";
class o {
  hash;
  settings;
  modalOptions;
  carouselOptions;
  el;
  src;
  sources;
  type;
  carouselElement;
  modalElement;
  modal;
  carousel;
  static allowedEmbedTypes = ["embed", "youtube", "vimeo", "instagram", "url"];
  static allowedMediaTypes = [...o.allowedEmbedTypes, "image", "html"];
  static defaultSelector = '[data-toggle="lightbox"]';
  constructor(t, e = {}) {
    this.hash = this.randomHash(), this.settings = Object.assign(
      {},
      r.Modal.Default,
      r.Carousel.Default,
      {
        interval: !1,
        target: '[data-toggle="lightbox"]',
        gallery: "",
        size: "xl",
        constrain: !0
      },
      e
    ), this.modalOptions = this.setOptionsFromSettings(r.Modal.Default), this.carouselOptions = this.setOptionsFromSettings(
      r.Carousel.Default
    ), typeof t == "string" && (this.settings.target = t, t = document.querySelector(t)), this.el = t, this.type = t.dataset.type || "", t.dataset.size && (this.settings.size = t.dataset.size), this.src = this.getSrc(t), this.sources = this.getGalleryItems(), this.createCarousel(), this.createModal();
  }
  show() {
    document.body.appendChild(this.modalElement), this.modal.show();
  }
  hide() {
    this.modal.hide();
  }
  setOptionsFromSettings(t) {
    return Object.keys(t).reduce(
      (e, a) => Object.assign(e, { [a]: this.settings[a] }),
      {}
    );
  }
  getSrc(t) {
    let e = t.dataset.src || t.dataset.remote || t.href || "https://placehold.co/1600x900";
    if (t.dataset.type === "html" || t.dataset.type === "image")
      return e;
    /https?:\/\//.test(e) || (e = window.location.origin + e);
    const a = new URL(e);
    return (t.dataset.footer || t.dataset.caption) && a.searchParams.set(
      "caption",
      t.dataset.footer || t.dataset.caption || ""
    ), a.toString();
  }
  getGalleryItems() {
    let t;
    if (this.settings.gallery) {
      if (Array.isArray(this.settings.gallery)) return this.settings.gallery;
      t = this.settings.gallery;
    } else this.el.dataset.gallery && (t = this.el.dataset.gallery);
    return t ? [
      ...new Set(
        Array.from(
          document.querySelectorAll(`[data-gallery="${t}"]`),
          (a) => {
            const i = a;
            return `${i.dataset.type || ""}${this.getSrc(i)}`;
          }
        )
      )
    ] : [`${this.type || ""}${this.src}`];
  }
  getYoutubeId(t) {
    const e = t.match(
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    );
    return e && e[2].length === 11 ? e[2] : !1;
  }
  getYoutubeLink(t) {
    const e = this.getYoutubeId(t);
    if (!e) return !1;
    const a = t.split("?"), i = a.length > 1 ? `?${a[1]}` : "";
    return `https://www.youtube.com/embed/${e}${i}`;
  }
  getInstagramEmbed(t) {
    if (/instagram/.test(t))
      return t += /\/embed$/.test(t) ? "" : "/embed", `<iframe src="${t}" class="start-50 translate-middle-x" style="max-width: 500px" frameborder="0" scrolling="no" allowtransparency="true"></iframe>`;
  }
  isEmbed(t) {
    const a = new RegExp(`(${o.allowedEmbedTypes.join("|")})`).test(t), i = /\.(png|jpe?g|gif|svg|webp)/i.test(t) || this.el.dataset.type === "image";
    return a || !i;
  }
  createCarousel() {
    const t = document.createElement("template"), e = o.allowedMediaTypes.join("|"), a = this.sources.map((s, l) => {
      s = s.replace(/\/$/, "");
      const c = new RegExp(`^(${e})`, "i"), w = /^html/.test(s), $ = /^image/.test(s);
      c.test(s) && (s = s.replace(c, ""));
      const x = this.settings.constrain ? "mw-100 mh-100 h-auto w-auto m-auto top-0 end-0 bottom-0 start-0" : "h-100 w-100", h = new URLSearchParams(s.split("?")[1]);
      let u = "", n = s;
      if (h.get("caption"))
        try {
          let g = new URL(s);
          g.searchParams.delete("caption"), n = g.toString(), u = `<div class="carousel-caption d-none d-md-block" style="z-index:2"><p class="bg-secondary rounded">${h.get(
            "caption"
          )}</p></div>`;
        } catch {
          n = s;
        }
      let d = `<img src="${n}" class="d-block ${x} img-fluid" style="z-index: 1; object-fit: contain;" />`, m = "";
      const E = this.getInstagramEmbed(s), p = this.getYoutubeLink(s);
      return this.isEmbed(s) && !$ && (p && (s = p, m = 'title="YouTube video player" frameborder="0" allow="accelerometer autoplay clipboard-write encrypted-media gyroscope picture-in-picture"'), d = E || `<img src="${s}" ${m} class="d-block mw-100 mh-100 h-auto w-auto m-auto top-0 end-0 bottom-0 start-0 img-fluid" style="z-index: 1; object-fit: contain;" />`), w && (d = s), `
          <div class="carousel-item ${l ? "" : "active"}" style="min-height: 100px">
            <div class="position-absolute top-50 start-50 translate-middle text-white"><div class="spinner-border" style="width: 3rem; height: 3rem" role="status"></div></div>
            <div class="ratio ratio-16x9" style="background-color: #000;">${d}</div>
            ${u}
          </div>`;
    }).join(""), i = this.sources.length < 2 ? "" : `
        <button id="#lightboxCarousel-${this.hash}-prev" class="carousel-control-prev" type="button" data-bs-target="#lightboxCarousel-${this.hash}" data-bs-slide="prev">
          <span class="btn btn-primary carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Previous</span>
        </button>
        <button id="#lightboxCarousel-${this.hash}-next" class="carousel-control-next" type="button" data-bs-target="#lightboxCarousel-${this.hash}" data-bs-slide="next">
          <span class="btn btn-primary carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Next</span>
        </button>`, y = `
      <div class="carousel-indicators" style="bottom: -40px">
        ${this.sources.map(
      (s, l) => `
            <button type="button" data-bs-target="#lightboxCarousel-${this.hash}" data-bs-slide-to="${l}" class="${l === 0 ? "active" : ""}" aria-current="${l === 0 ? "true" : "false"}" aria-label="Slide ${l + 1}"></button>`
    ).join("")}
      </div>`;
    t.innerHTML = `
      <div id="lightboxCarousel-${this.hash}" class="lightbox-carousel carousel slide" data-bs-ride="carousel" data-bs-interval="${this.carouselOptions.interval}">
        <div class="carousel-inner">${a}</div>
        ${y}
        ${i}
      </div>`.trim(), this.carouselElement = t.content.firstChild;
    const f = {
      ...this.carouselOptions,
      keyboard: !1
    };
    this.carousel = new r.Carousel(this.carouselElement, f);
    const v = this.type && this.type !== "image" ? this.type + this.src : this.src;
    return this.carousel.to(this.findGalleryItemIndex(this.sources, v)), this.carouselOptions.keyboard === !0 && document.addEventListener("keydown", (s) => {
      if (s.code === "ArrowLeft")
        return document.getElementById(`#lightboxCarousel-${this.hash}-prev`)?.click(), !1;
      if (s.code === "ArrowRight")
        return document.getElementById(`#lightboxCarousel-${this.hash}-next`)?.click(), !1;
    }), this.carousel;
  }
  findGalleryItemIndex(t, e) {
    return t.findIndex((a) => a.includes(e)) || 0;
  }
  createModal() {
    const t = document.createElement("template");
    return t.innerHTML = `
      <div class="modal lightbox fade" id="lightboxModal-${this.hash}" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered modal-${this.settings.size}">
          <div class="modal-content border-0 bg-transparent">
            <div class="modal-body p-0">
              <button type="button" class="btn-close position-absolute p-3" data-bs-dismiss="modal" aria-label="Close" style="top: -15px;right:-40px"></button>
            </div>
          </div>
        </div>
      </div>`.trim(), this.modalElement = t.content.firstChild, this.modalElement.querySelector(".modal-body")?.appendChild(this.carouselElement), this.modalElement.addEventListener(
      "hidden.bs.modal",
      () => this.modalElement.remove()
    ), this.modalElement.querySelector("[data-bs-dismiss]")?.addEventListener("click", () => this.modal.hide()), this.modal = new r.Modal(this.modalElement, this.modalOptions), this.modal;
  }
  randomHash(t = 8) {
    return Array.from(
      { length: t },
      () => Math.floor(Math.random() * 36).toString(36)
    ).join("");
  }
  static initialize(t) {
    t.preventDefault(), new o(this).show();
  }
}
document.querySelectorAll(o.defaultSelector).forEach((b) => b.addEventListener("click", o.initialize));
typeof window < "u" && window.bootstrap && (window.bootstrap.Lightbox = o);
export {
  o as default
};
//# sourceMappingURL=bs5-lightbox.js.map
