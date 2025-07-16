/*!
 * Lightbox for Bootstrap 5 v1.8.5 (https://trvswgnr.github.io/bs5-lightbox/)
 * Copyright 2025 Travis Aaron Wagner (https://github.com/trvswgnr/)
 * Licensed under MIT (https://github.com/trvswgnr/bs5-lightbox/blob/main/LICENSE)
 */
(function(n,l){typeof exports=="object"&&typeof module<"u"?module.exports=l(require("bootstrap")):typeof define=="function"&&define.amd?define(["bootstrap"],l):(n=typeof globalThis<"u"?globalThis:n||self,n.lightbox=l(n.bootstrap))})(this,function(n){"use strict";const l={Modal:n.Modal,Carousel:n.Carousel};class i{constructor(t,e={}){this.hash=this.randomHash(),this.settings=Object.assign(Object.assign(Object.assign({},l.Modal.Default),l.Carousel.Default),{interval:!1,target:'[data-toggle="lightbox"]',gallery:"",size:"xl",constrain:!0}),this.settings=Object.assign(Object.assign({},this.settings),e),this.modalOptions=this.setOptionsFromSettings(l.Modal.Default),this.carouselOptions=this.setOptionsFromSettings(l.Carousel.Default),typeof t=="string"&&(this.settings.target=t,t=document.querySelector(this.settings.target)),this.el=t,this.type=t.dataset.type||"",t.dataset.size&&(this.settings.size=t.dataset.size),this.src=this.getSrc(t),this.sources=this.getGalleryItems(),this.createCarousel(),this.createModal()}show(){document.body.appendChild(this.modalElement),this.modal.show()}hide(){this.modal.hide()}setOptionsFromSettings(t){return Object.keys(t).reduce((e,a)=>Object.assign(e,{[a]:this.settings[a]}),{})}getSrc(t){let e=t.dataset.src||t.dataset.remote||t.href||"http://via.placeholder.com/1600x900";if(t.dataset.type==="html")return e;/\:\/\//.test(e)||(e=window.location.origin+e);const a=new URL(e);return(t.dataset.footer||t.dataset.caption)&&a.searchParams.set("caption",t.dataset.footer||t.dataset.caption),a.toString()}getGalleryItems(){let t;if(this.settings.gallery){if(Array.isArray(this.settings.gallery))return this.settings.gallery;t=this.settings.gallery}else this.el.dataset.gallery&&(t=this.el.dataset.gallery);return t?[...new Set(Array.from(document.querySelectorAll(`[data-gallery="${t}"]`),a=>`${a.dataset.type?a.dataset.type:""}${this.getSrc(a)}`))]:[`${this.type?this.type:""}${this.src}`]}getYoutubeId(t){if(!t)return!1;const e=t.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/);return e&&e[2].length===11?e[2]:!1}getYoutubeLink(t){const e=this.getYoutubeId(t);if(!e)return!1;const a=t.split("?");let r=a.length>1?"?"+a[1]:"";return`https://www.youtube.com/embed/${e}${r}`}getInstagramEmbed(t){if(/instagram/.test(t))return t+=/\/embed$/.test(t)?"":"/embed",`<iframe src="${t}" class="start-50 translate-middle-x" style="max-width: 500px" frameborder="0" scrolling="no" allowtransparency="true"></iframe>`}isEmbed(t){const a=new RegExp("("+i.allowedEmbedTypes.join("|")+")").test(t),r=/\.(png|jpe?g|gif|svg|webp)/i.test(t)||this.el.dataset.type==="image";return a||!r}createCarousel(){const t=document.createElement("template"),e=i.allowedMediaTypes.join("|"),a=this.sources.map((s,o)=>{s=s.replace(/\/$/,"");const m=new RegExp(`^(${e})`,"i"),$=/^html/.test(s),E=/^image/.test(s);m.test(s)&&(s=s.replace(m,""));const C=this.settings.constrain?"mw-100 mh-100 h-auto w-auto m-auto top-0 end-0 bottom-0 start-0":"h-100 w-100",g=new URLSearchParams(s.split("?")[1]);let p="",d=s;if(g.get("caption")){try{d=new URL(s),d.searchParams.delete("caption"),d=d.toString()}catch{d=s}p=`<div class="carousel-caption d-none d-md-block" style="z-index:2"><p class="bg-secondary rounded">${g.get("caption")}</p></div>`}let h=`<img src="${d}" class="d-block ${C} img-fluid" style="z-index: 1; object-fit: contain;" />`,b="";const S=this.getInstagramEmbed(s),y=this.getYoutubeLink(s);return this.isEmbed(s)&&!E&&(y&&(s=y,b='title="YouTube video player" frameborder="0" allow="accelerometer autoplay clipboard-write encrypted-media gyroscope picture-in-picture"'),h=S||`<img src="${s}" ${b} class="d-block mw-100 mh-100 h-auto w-auto m-auto top-0 end-0 bottom-0 start-0 img-fluid" style="z-index: 1; object-fit: contain;" />`),$&&(h=s),`
				<div class="carousel-item ${o?"":"active"}" style="min-height: 100px">
					<div class="position-absolute top-50 start-50 translate-middle text-white"><div class="spinner-border" style="width: 3rem height: 3rem" role="status"></div></div>
					<div class="ratio ratio-16x9" style="background-color: #000;">${h}</div>
					${p}
				</div>`}).join(""),r=this.sources.length<2?"":`
			<button id="#lightboxCarousel-${this.hash}-prev" class="carousel-control-prev" type="button" data-bs-target="#lightboxCarousel-${this.hash}" data-bs-slide="prev">
				<span class="btn btn-secondary carousel-control-prev-icon" aria-hidden="true"></span>
				<span class="visually-hidden">Previous</span>
			</button>
			<button id="#lightboxCarousel-${this.hash}-next" class="carousel-control-next" type="button" data-bs-target="#lightboxCarousel-${this.hash}" data-bs-slide="next">
				<span class="btn btn-secondary carousel-control-next-icon" aria-hidden="true"></span>
				<span class="visually-hidden">Next</span>
			</button>`;let u="lightbox-carousel carousel slide";this.settings.size==="fullscreen"&&(u+=" position-absolute w-100 translate-middle top-50 start-50");const f=`
			<div class="carousel-indicators" style="bottom: -40px">
				${this.sources.map((s,o)=>`
					<button type="button" data-bs-target="#lightboxCarousel-${this.hash}" data-bs-slide-to="${o}" class="${o===0?"active":""}" aria-current="${o===0?"true":"false"}" aria-label="Slide ${o+1}"></button>
				`).join("")}
			</div>`,v=`
			<div id="lightboxCarousel-${this.hash}" class="${u}" data-bs-ride="carousel" data-bs-interval="${this.carouselOptions.interval}">
			    <div class="carousel-inner">
					${a}
				</div>
			    ${f}
				${r}
			</div>`;t.innerHTML=v.trim(),this.carouselElement=t.content.firstChild;const w=Object.assign(Object.assign({},this.carouselOptions),{keyboard:!1});this.carousel=new l.Carousel(this.carouselElement,w);const x=this.type&&this.type!=="image"?this.type+this.src:this.src;return this.carousel.to(this.findGalleryItemIndex(this.sources,x)),this.carouselOptions.keyboard===!0&&document.addEventListener("keydown",s=>{if(s.code==="ArrowLeft"){const o=document.getElementById(`#lightboxCarousel-${this.hash}-prev`);return o&&o.click(),!1}if(s.code==="ArrowRight"){const o=document.getElementById(`#lightboxCarousel-${this.hash}-next`);return o&&o.click(),!1}}),this.carousel}findGalleryItemIndex(t,e){let a=0;for(const r of t){if(r.includes(e))return a;a++}return 0}createModal(){const t=document.createElement("template"),e=`
			<div class="modal lightbox fade" id="lightboxModal-${this.hash}" tabindex="-1" aria-hidden="true">
				<div class="modal-dialog modal-dialog-centered modal-${this.settings.size}">
					<div class="modal-content border-0 bg-transparent">
						<div class="modal-body p-0">
							<button type="button" class="btn-close position-absolute p-3" data-bs-dismiss="modal" aria-label="Close" style="top: -15px;right:-40px"></button>
						</div>
					</div>
				</div>
			</div>`;return t.innerHTML=e.trim(),this.modalElement=t.content.firstChild,this.modalElement.querySelector(".modal-body").appendChild(this.carouselElement),this.modalElement.addEventListener("hidden.bs.modal",()=>this.modalElement.remove()),this.modalElement.querySelector("[data-bs-dismiss]").addEventListener("click",()=>this.modal.hide()),this.modal=new l.Modal(this.modalElement,this.modalOptions),this.modal}randomHash(t=8){return Array.from({length:t},()=>Math.floor(Math.random()*36).toString(36)).join("")}}return i.allowedEmbedTypes=["embed","youtube","vimeo","instagram","url"],i.allowedMediaTypes=[...i.allowedEmbedTypes,"image","html"],i.defaultSelector='[data-toggle="lightbox"]',i.initialize=function(c){c.preventDefault(),new i(this).show()},document.querySelectorAll(i.defaultSelector).forEach(c=>c.addEventListener("click",i.initialize)),typeof window<"u"&&window.bootstrap&&(window.bootstrap.Lightbox=i),i});
//# sourceMappingURL=bs5-lightbox.umd.cjs.map
