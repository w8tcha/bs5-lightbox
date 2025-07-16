/*!
 * Lightbox for Bootstrap 5 v1.8.5 (https://trvswgnr.github.io/bs5-lightbox/)
 * Copyright 2025 Travis Aaron Wagner (https://github.com/trvswgnr/)
 * Licensed under MIT (https://github.com/trvswgnr/bs5-lightbox/blob/main/LICENSE)
 */
import { Modal as C, Carousel as O } from "bootstrap";
const r = {
  Modal: C,
  Carousel: O
};
class i {
  constructor(t, e = {}) {
    this.hash = this.randomHash(), this.settings = Object.assign(Object.assign(Object.assign({}, r.Modal.Default), r.Carousel.Default), {
      interval: !1,
      target: '[data-toggle="lightbox"]',
      gallery: "",
      size: "xl",
      constrain: !0
    }), this.settings = Object.assign(Object.assign({}, this.settings), e), this.modalOptions = this.setOptionsFromSettings(r.Modal.Default), this.carouselOptions = this.setOptionsFromSettings(r.Carousel.Default), typeof t == "string" && (this.settings.target = t, t = document.querySelector(this.settings.target)), this.el = t, this.type = t.dataset.type || "", t.dataset.size && (this.settings.size = t.dataset.size), this.src = this.getSrc(t), this.sources = this.getGalleryItems(), this.createCarousel(), this.createModal();
  }
  show() {
    document.body.appendChild(this.modalElement), this.modal.show();
  }
  hide() {
    this.modal.hide();
  }
  setOptionsFromSettings(t) {
    return Object.keys(t).reduce((e, s) => Object.assign(e, { [s]: this.settings[s] }), {});
  }
  getSrc(t) {
    let e = t.dataset.src || t.dataset.remote || t.href || "http://via.placeholder.com/1600x900";
    if (t.dataset.type === "html")
      return e;
    /\:\/\//.test(e) || (e = window.location.origin + e);
    const s = new URL(e);
    return (t.dataset.footer || t.dataset.caption) && s.searchParams.set("caption", t.dataset.footer || t.dataset.caption), s.toString();
  }
  getGalleryItems() {
    let t;
    if (this.settings.gallery) {
      if (Array.isArray(this.settings.gallery))
        return this.settings.gallery;
      t = this.settings.gallery;
    } else this.el.dataset.gallery && (t = this.el.dataset.gallery);
    return t ? [...new Set(Array.from(document.querySelectorAll(`[data-gallery="${t}"]`), (s) => `${s.dataset.type ? s.dataset.type : ""}${this.getSrc(s)}`))] : [`${this.type ? this.type : ""}${this.src}`];
  }
  getYoutubeId(t) {
    if (!t) return !1;
    const e = t.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/);
    return e && e[2].length === 11 ? e[2] : !1;
  }
  getYoutubeLink(t) {
    const e = this.getYoutubeId(t);
    if (!e)
      return !1;
    const s = t.split("?");
    let o = s.length > 1 ? "?" + s[1] : "";
    return `https://www.youtube.com/embed/${e}${o}`;
  }
  getInstagramEmbed(t) {
    if (/instagram/.test(t))
      return t += /\/embed$/.test(t) ? "" : "/embed", `<iframe src="${t}" class="start-50 translate-middle-x" style="max-width: 500px" frameborder="0" scrolling="no" allowtransparency="true"></iframe>`;
  }
  isEmbed(t) {
    const s = new RegExp("(" + i.allowedEmbedTypes.join("|") + ")").test(t), o = /\.(png|jpe?g|gif|svg|webp)/i.test(t) || this.el.dataset.type === "image";
    return s || !o;
  }
  createCarousel() {
    const t = document.createElement("template"), e = i.allowedMediaTypes.join("|"), s = this.sources.map((a, l) => {
      a = a.replace(/\/$/, "");
      const m = new RegExp(`^(${e})`, "i"), v = /^html/.test(a), x = /^image/.test(a);
      m.test(a) && (a = a.replace(m, ""));
      const $ = this.settings.constrain ? "mw-100 mh-100 h-auto w-auto m-auto top-0 end-0 bottom-0 start-0" : "h-100 w-100", u = new URLSearchParams(a.split("?")[1]);
      let g = "", n = a;
      if (u.get("caption")) {
        try {
          n = new URL(a), n.searchParams.delete("caption"), n = n.toString();
        } catch {
          n = a;
        }
        g = `<p class="lightbox-caption m-0 p-2 text-center text-white small"><em>${u.get("caption")}</em></p>`;
      }
      let c = `<img src="${n}" class="d-block ${$} img-fluid" style="z-index: 1; object-fit: contain;" />`, p = "";
      const E = this.getInstagramEmbed(a), b = this.getYoutubeLink(a);
      return this.isEmbed(a) && !x && (b && (a = b, p = 'title="YouTube video player" frameborder="0" allow="accelerometer autoplay clipboard-write encrypted-media gyroscope picture-in-picture"'), c = E || `<iframe src="${a}" ${p} allowfullscreen></iframe>`), v && (c = a), `
				<div class="carousel-item ${l ? "" : "active"}" style="min-height: 100px">
					<div class="position-absolute top-50 start-50 translate-middle text-white"><div class="spinner-border" style="width: 3rem height: 3rem" role="status"></div></div>
					<div class="ratio ratio-16x9" style="background-color: #000;">${c}</div>
					${g}
				</div>`;
    }).join(""), o = this.sources.length < 2 ? "" : `
			<button id="#lightboxCarousel-${this.hash}-prev" class="carousel-control carousel-control-prev h-75 m-auto" type="button" data-bs-target="#lightboxCarousel-${this.hash}" data-bs-slide="prev">
				<span class="carousel-control-prev-icon" aria-hidden="true"></span>
				<span class="visually-hidden">Previous</span>
			</button>
			<button id="#lightboxCarousel-${this.hash}-next" class="carousel-control carousel-control-next h-75 m-auto" type="button" data-bs-target="#lightboxCarousel-${this.hash}" data-bs-slide="next">
				<span class="carousel-control-next-icon" aria-hidden="true"></span>
				<span class="visually-hidden">Next</span>
			</button>`;
    let h = "lightbox-carousel carousel slide";
    this.settings.size === "fullscreen" && (h += " position-absolute w-100 translate-middle top-50 start-50");
    const y = `
			<div id="lightboxCarousel-${this.hash}" class="${h}" data-bs-ride="carousel" data-bs-interval="${this.carouselOptions.interval}">
				<div class="carousel-inner">
					${s}
				</div>
				${o}
			</div>`;
    t.innerHTML = y.trim(), this.carouselElement = t.content.firstChild;
    const f = Object.assign(Object.assign({}, this.carouselOptions), { keyboard: !1 });
    this.carousel = new r.Carousel(this.carouselElement, f);
    const w = this.type && this.type !== "image" ? this.type + this.src : this.src;
    return this.carousel.to(this.findGalleryItemIndex(this.sources, w)), this.carouselOptions.keyboard === !0 && document.addEventListener("keydown", (a) => {
      if (a.code === "ArrowLeft") {
        const l = document.getElementById(`#lightboxCarousel-${this.hash}-prev`);
        return l && l.click(), !1;
      }
      if (a.code === "ArrowRight") {
        const l = document.getElementById(`#lightboxCarousel-${this.hash}-next`);
        return l && l.click(), !1;
      }
    }), this.carousel;
  }
  findGalleryItemIndex(t, e) {
    let s = 0;
    for (const o of t) {
      if (o.includes(e))
        return s;
      s++;
    }
    return 0;
  }
  createModal() {
    const t = document.createElement("template"), s = `
			<div class="modal lightbox fade" id="lightboxModal-${this.hash}" tabindex="-1">
				<div class="modal-dialog modal-dialog-centered modal-${this.settings.size}">
					<div class="modal-content border-0 bg-transparent">
						<div class="modal-body p-0">
							<button type="button" class="btn-close position-absolute top-0 end-0 p-3" data-bs-dismiss="modal" aria-label="Close" style="z-index: 2; background: none;"><svg xmlns="http://www.w3.org/2000/svg" style="position: relative; top: -5px;" viewBox="0 0 16 16" fill="#fff"><path d="M.293.293a1 1 0 011.414 0L8 6.586 14.293.293a1 1 0 111.414 1.414L9.414 8l6.293 6.293a1 1 0 01-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 01-1.414-1.414L6.586 8 .293 1.707a1 1 0 010-1.414z"/></svg></button>
						</div>
					</div>
				</div>
			</div>`;
    return t.innerHTML = s.trim(), this.modalElement = t.content.firstChild, this.modalElement.querySelector(".modal-body").appendChild(this.carouselElement), this.modalElement.addEventListener("hidden.bs.modal", () => this.modalElement.remove()), this.modalElement.querySelector("[data-bs-dismiss]").addEventListener("click", () => this.modal.hide()), this.modal = new r.Modal(this.modalElement, this.modalOptions), this.modal;
  }
  randomHash(t = 8) {
    return Array.from({ length: t }, () => Math.floor(Math.random() * 36).toString(36)).join("");
  }
}
i.allowedEmbedTypes = ["embed", "youtube", "vimeo", "instagram", "url"];
i.allowedMediaTypes = [...i.allowedEmbedTypes, "image", "html"];
i.defaultSelector = '[data-toggle="lightbox"]';
i.initialize = function(d) {
  d.preventDefault(), new i(this).show();
};
document.querySelectorAll(i.defaultSelector).forEach((d) => d.addEventListener("click", i.initialize));
typeof window < "u" && window.bootstrap && (window.bootstrap.Lightbox = i);
export {
  i as default
};
//# sourceMappingURL=bs5-lightbox.js.map
