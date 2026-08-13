export default defineNuxtPlugin((nuxtApp) => {
  if (import.meta.server) {
    nuxtApp.vueApp.directive("reveal", {
      getSSRProps: () => ({}),
    });
    return;
  }

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add("motion-enter");
      observer.unobserve(entry.target);
    }
  }, {
    rootMargin: "0px 0px -8% 0px",
    threshold: 0.08,
  });

  nuxtApp.vueApp.directive("reveal", {
    mounted(element: HTMLElement) {
      if (reducedMotion.matches) return;
      observer.observe(element);
    },
    unmounted(element: HTMLElement) {
      observer.unobserve(element);
    },
  });
});
