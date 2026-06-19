import PhotoSwipeLightbox from "photoswipe/lightbox";
import "photoswipe/style.css";

export interface PhotoSwipeImage {
  src: string;
  w: number;
  h: number;
  title?: string;
}

/**
 * Composable that initializes and manages a PhotoSwipe lightbox instance.
 *
 * Usage:
 * ```ts
 * const { init, destroy } = usePhotoSwipe()
 * // DOM-based (reads <a> children from the gallery element):
 * onMounted(() => init('#my-gallery'))
 * // dataSource-based (provides dimensions upfront):
 * onMounted(() => init('#my-gallery', images))
 * onUnmounted(() => destroy())
 * ```
 */
export function usePhotoSwipe() {
  let lightbox: PhotoSwipeLightbox | null = null;

  function init(
    gallerySelector: string,
    images?: PhotoSwipeImage[],
  ) {
    destroy();

    lightbox = new PhotoSwipeLightbox({
      gallery: gallerySelector,
      children: "a",
      pswpModule: () => import("photoswipe"),
      dataSource: images?.map((img) => ({
        src: img.src,
        w: img.w,
        h: img.h,
        title: img.title ?? "",
      })),
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
