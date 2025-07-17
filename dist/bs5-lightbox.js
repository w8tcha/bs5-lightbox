/*!
 * Lightbox for Bootstrap 5 v1.8.5 (https://trvswgnr.github.io/bs5-lightbox/)
 * Copyright 2025 Travis Aaron Wagner (https://github.com/trvswgnr/)
 * Licensed under MIT (https://github.com/trvswgnr/bs5-lightbox/blob/main/LICENSE)
 */
var C = Object.defineProperty;
var I = (n, t, e) => t in n ? C(n, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : n[t] = e;
var i = (n, t, e) => I(n, typeof t != "symbol" ? t + "" : t, e);
import * as d from "bootstrap";
const l = class l {
  constructor(t, e = {}) {
    i(this, "hash");
    i(this, "settings");
    i(this, "modalOptions");
    i(this, "carouselOptions");
    i(this, "el");
    i(this, "src");
    i(this, "sources");
    i(this, "type");
    i(this, "carouselElement");
    i(this, "modalElement");
    i(this, "modal");
    i(this, "carousel");
    this.hash = this.randomHash(), this.settings = Object.assign(
      {},
      d.Modal.Default,
      d.Carousel.Default,
      {
        interval: !1,
        target: '[data-toggle="lightbox"]',
        gallery: "",
        size: "xl",
        constrain: !0
      },
      e
    ), this.modalOptions = this.setOptionsFromSettings(d.Modal.Default), this.carouselOptions = this.setOptionsFromSettings(
      d.Carousel.Default
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
            const r = a;
            return `${r.dataset.type || ""}${this.getSrc(r)}`;
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
    const a = t.split("?"), r = a.length > 1 ? `?${a[1]}` : "";
    return `https://www.youtube.com/embed/${e}${r}`;
  }
  getInstagramEmbed(t) {
    if (/instagram/.test(t))
      return t += /\/embed$/.test(t) ? "" : "/embed", `<iframe src="${t}" class="start-50 translate-middle-x" style="max-width: 500px" frameborder="0" scrolling="no" allowtransparency="true"></iframe>`;
  }
  isEmbed(t) {
    const a = new RegExp(`(${l.allowedEmbedTypes.join("|")})`).test(t), r = /\.(png|jpe?g|gif|svg|webp)/i.test(t) || this.el.dataset.type === "image";
    return a || !r;
  }
  createCarousel() {
    const t = document.createElement("template"), e = l.allowedMediaTypes.join("|"), a = this.sources.map((s, o) => {
      s = s.replace(/\/$/, "");
      const c = new RegExp(`^(${e})`, "i"), $ = /^html/.test(s), x = /^image/.test(s);
      c.test(s) && (s = s.replace(c, ""));
      const E = this.settings.constrain ? "mw-100 mh-100 h-auto w-auto m-auto top-0 end-0 bottom-0 start-0" : "h-100 w-100", u = new URLSearchParams(s.split("?")[1]);
      let g = "", m = s;
      if (u.get("caption"))
        try {
          m = new URL(s).toString().replace(`?${u}`, ""), g = `<div class="carousel-caption d-none d-md-block" style="z-index:2"><p class="bg-secondary rounded">${u.get(
            "caption"
          )}</p></div>`;
        } catch {
          m = s;
        }
      let p = `<img src="${m}" class="d-block ${E} img-fluid" style="z-index: 1; object-fit: contain;" />`, b = "";
      const S = this.getInstagramEmbed(s), y = this.getYoutubeLink(s);
      return this.isEmbed(s) && !x && (y && (s = y, b = 'title="YouTube video player" frameborder="0" allow="accelerometer autoplay clipboard-write encrypted-media gyroscope picture-in-picture"'), p = S || `<img src="${s}" ${b} class="d-block mw-100 mh-100 h-auto w-auto m-auto top-0 end-0 bottom-0 start-0 img-fluid" style="z-index: 1; object-fit: contain;" />`), $ && (p = s), `
          <div class="carousel-item ${o ? "" : "active"}" style="min-height: 100px">
            <div class="position-absolute top-50 start-50 translate-middle text-white"><div class="spinner-border" style="width: 3rem; height: 3rem" role="status"></div></div>
            <div class="ratio ratio-16x9" style="background-color: #000;">${p}</div>
            ${g}
          </div>`;
    }).join(""), r = this.sources.length < 2 ? "" : `
        <button id="#lightboxCarousel-${this.hash}-prev" class="carousel-control-prev" type="button" data-bs-target="#lightboxCarousel-${this.hash}" data-bs-slide="prev">
          <span class="btn btn-primary carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Previous</span>
        </button>
        <button id="#lightboxCarousel-${this.hash}-next" class="carousel-control-next" type="button" data-bs-target="#lightboxCarousel-${this.hash}" data-bs-slide="next">
          <span class="btn btn-primary carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Next</span>
        </button>`, f = `
      <div class="carousel-indicators" style="bottom: -40px">
        ${this.sources.map(
      (s, o) => `
            <button type="button" data-bs-target="#lightboxCarousel-${this.hash}" data-bs-slide-to="${o}" class="${o === 0 ? "active" : ""}" aria-current="${o === 0 ? "true" : "false"}" aria-label="Slide ${o + 1}"></button>`
    ).join("")}
      </div>`;
    t.innerHTML = `
      <div id="lightboxCarousel-${this.hash}" class="lightbox-carousel carousel slide" data-bs-ride="carousel" data-bs-interval="${this.carouselOptions.interval}">
        <div class="carousel-inner">${a}</div>
        ${f}
        ${r}
      </div>`.trim(), this.carouselElement = t.content.firstChild;
    const v = {
      ...this.carouselOptions,
      keyboard: !1
    };
    this.carousel = new d.Carousel(this.carouselElement, v);
    const w = this.type && this.type !== "image" ? this.type + this.src : this.src;
    return this.carousel.to(this.findGalleryItemIndex(this.sources, w)), this.carouselOptions.keyboard === !0 && document.addEventListener("keydown", (s) => {
      var o, c;
      if (s.code === "ArrowLeft")
        return (o = document.getElementById(`#lightboxCarousel-${this.hash}-prev`)) == null || o.click(), !1;
      if (s.code === "ArrowRight")
        return (c = document.getElementById(`#lightboxCarousel-${this.hash}-next`)) == null || c.click(), !1;
    }), this.carousel;
  }
  findGalleryItemIndex(t, e) {
    return t.findIndex((a) => a.includes(e)) || 0;
  }
  createModal() {
    var e, a;
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
      </div>`.trim(), this.modalElement = t.content.firstChild, (e = this.modalElement.querySelector(".modal-body")) == null || e.appendChild(this.carouselElement), this.modalElement.addEventListener(
      "hidden.bs.modal",
      () => this.modalElement.remove()
    ), (a = this.modalElement.querySelector("[data-bs-dismiss]")) == null || a.addEventListener("click", () => this.modal.hide()), this.modal = new d.Modal(this.modalElement, this.modalOptions), this.modal;
  }
  randomHash(t = 8) {
    return Array.from(
      { length: t },
      () => Math.floor(Math.random() * 36).toString(36)
    ).join("");
  }
  static initialize(t) {
    t.preventDefault(), new l(this).show();
  }
};
i(l, "allowedEmbedTypes", ["embed", "youtube", "vimeo", "instagram", "url"]), i(l, "allowedMediaTypes", [...l.allowedEmbedTypes, "image", "html"]), i(l, "defaultSelector", '[data-toggle="lightbox"]');
let h = l;
document.querySelectorAll(h.defaultSelector).forEach((n) => n.addEventListener("click", h.initialize));
typeof window < "u" && window.bootstrap && (window.bootstrap.Lightbox = h);
export {
  h as default
};
//# sourceMappingURL=bs5-lightbox.js.map
