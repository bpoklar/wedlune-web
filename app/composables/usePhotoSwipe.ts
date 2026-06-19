import PhotoSwipeLightbox from "photoswipe/lightbox";
import "photoswipe/style.css";

export interface PhotoSwipeImage {
  id: string;
  src: string;
  width: number | null;
  height: number | null;
  caption?: string | null;
  category?: string | null;
  thumbSrc?: string;
}

/**
 * Composable that initializes and manages a PhotoSwipe lightbox instance.
 *
 * Usage:
 * ```ts
 * const { init, destroy } = usePhotoSwipe()
 * onMounted(() => init('#my-gallery', images))
 * onUnmounted(() => destroy())
 * ```
 */
export function usePhotoSwipe() {
  let lightbox: PhotoSwipeLightbox | null = null;

  function init(
    gallerySelector: string,
    images: PhotoSwipeImage[],
    startIndex = 0,
  ) {
    destroy();

    lightbox = new PhotoSwipeLightbox({
      gallery: gallerySelector,
      children: "a",
      pswpModule: () => import("photoswipe"),
      dataSource: images.map((img) => ({
        src: img.src,
        w: img.width ?? 1200,
        h: img.height ?? 900,
        alt: img.caption ?? "",
        title: img.caption ?? "",
        msrc: img.thumbSrc,
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
