import PhotoSwipeLightbox from "photoswipe/lightbox";
import "photoswipe/style.css";

/**
 * Composable that initializes and manages a PhotoSwipe lightbox instance.
 *
 * Usage (DOM-based — PhotoSwipe reads <a> children from the gallery element):
 * ```ts
 * const { init, destroy } = usePhotoSwipe()
 * onMounted(() => init('#my-gallery'))
 * onUnmounted(() => destroy())
 * ```
 */
export function usePhotoSwipe() {
  let lightbox: PhotoSwipeLightbox | null = null;

  function init(gallerySelector: string) {
    destroy();

    lightbox = new PhotoSwipeLightbox({
      gallery: gallerySelector,
      children: "a",
      pswpModule: () => import("photoswipe"),
      showHideAnimationType: "zoom",
      bgOpacity: 0.95,
      loop: false,
      preload: [1, 2],
      maxZoomLevel: 4,
    });

    lightbox.init();
  }

  function destroy() {
    if (lightbox) {
      lightbox.destroy();
      lightbox = null;
    }
  }

  function open(index = 0) {
    if (lightbox) {
      lightbox.loadAndOpen(index);
    }
  }

  return { init, destroy, open };
}
