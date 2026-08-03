/**
 * Click-to-zoom for Stills and Markdown content images.
 * Uses a single shared <dialog> lightbox (full-viewport, grid-centered).
 */
function ensureLightbox(): HTMLDialogElement {
  let dialog = document.getElementById(
    "site-image-zoom",
  ) as HTMLDialogElement | null;
  if (dialog) return dialog;

  dialog = document.createElement("dialog");
  dialog.id = "site-image-zoom";
  dialog.className = "site-image-zoom";
  dialog.innerHTML = `
    <button type="button" class="site-image-zoom__close" aria-label="Close enlarged image">Close</button>
    <img class="site-image-zoom__img" alt="" />
  `;
  document.body.appendChild(dialog);

  const style = document.createElement("style");
  style.textContent = `
    .site-image-zoom {
      box-sizing: border-box;
      position: fixed;
      inset: 0;
      z-index: 9999;
      width: 100%;
      max-width: 100%;
      height: 100%;
      max-height: 100%;
      margin: 0;
      padding: 1.25rem;
      border: 0;
      background: transparent;
      overflow: auto;
    }
    .site-image-zoom[open] {
      display: grid;
      place-items: center;
    }
    .site-image-zoom::backdrop {
      background: rgba(0, 0, 0, 0.78);
    }
    .site-image-zoom__close {
      position: fixed;
      top: 0.75rem;
      right: 0.75rem;
      z-index: 2;
      appearance: none;
      border: 0;
      border-radius: 999px;
      padding: 0.4rem 0.85rem;
      font: inherit;
      cursor: pointer;
      color: #f8fafc;
      background: rgba(15, 23, 32, 0.85);
    }
    .site-image-zoom__img {
      display: block;
      box-sizing: border-box;
      width: min(96vw, 1400px);
      height: auto;
      max-width: 96vw;
      max-height: 90vh;
      margin: 0;
      border-radius: 0.4rem;
      object-fit: contain;
      background: #0f1720;
    }
    .sl-markdown-content img:not(.still__light):not(.still__dark) {
      cursor: zoom-in;
    }
  `;
  document.head.appendChild(style);

  dialog
    .querySelector(".site-image-zoom__close")
    ?.addEventListener("click", () => dialog?.close());

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });

  return dialog;
}

function isDarkTheme(): boolean {
  const root = document.documentElement;
  const theme = root.getAttribute("data-theme");
  if (theme === "dark") return true;
  if (theme === "light") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function openZoom(src: string, alt: string) {
  const dialog = ensureLightbox();
  const img = dialog.querySelector(
    ".site-image-zoom__img",
  ) as HTMLImageElement | null;
  if (!img) return;

  const show = () => {
    if (typeof dialog.showModal === "function") {
      if (!dialog.open) dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
    }
  };

  img.alt = alt || "";
  if (img.src === src && img.complete) {
    show();
    return;
  }
  img.onload = () => show();
  img.onerror = () => show();
  img.src = src;
  if (img.complete) show();
}

function stillZoomSrc(trigger: HTMLElement): string {
  const light = trigger.getAttribute("data-zoom-src") || "";
  const dark = trigger.getAttribute("data-zoom-dark-src") || "";
  if (dark && isDarkTheme()) return dark;
  return light;
}

document.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof Element)) return;

  const stillTrigger = target.closest(".still__trigger") as HTMLElement | null;
  if (stillTrigger) {
    event.preventDefault();
    openZoom(
      stillZoomSrc(stillTrigger),
      stillTrigger.getAttribute("data-zoom-alt") || "",
    );
    return;
  }

  const contentImg = target.closest(
    ".sl-markdown-content img",
  ) as HTMLImageElement | null;
  if (
    contentImg &&
    !contentImg.classList.contains("still__light") &&
    !contentImg.classList.contains("still__dark") &&
    contentImg.src
  ) {
    event.preventDefault();
    openZoom(contentImg.currentSrc || contentImg.src, contentImg.alt || "");
  }
});
