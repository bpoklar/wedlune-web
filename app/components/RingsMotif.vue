<template>
  <span class="rings-motif" :class="`rings-${size}`" aria-hidden="true">
    <svg viewBox="0 0 112 72" fill="none">
      <defs>
        <mask :id="leftMaskId" maskUnits="userSpaceOnUse" x="0" y="0" width="112" height="72">
          <rect width="112" height="72" fill="white" />
          <circle cx="56" cy="55" r="6" fill="black" />
        </mask>
        <mask :id="rightMaskId" maskUnits="userSpaceOnUse" x="0" y="0" width="112" height="72">
          <rect width="112" height="72" fill="white" />
          <circle cx="56" cy="17" r="6" fill="black" />
        </mask>
      </defs>

      <g class="ring ring-left" :mask="`url(#${leftMaskId})`">
        <ellipse class="ring-edge ring-edge-outer" cx="42" cy="36" rx="25" ry="23" />
        <ellipse class="ring-edge ring-edge-inner" cx="42" cy="36" rx="22" ry="20" />
      </g>
      <g class="ring ring-right" :mask="`url(#${rightMaskId})`">
        <ellipse class="ring-edge ring-edge-outer" cx="70" cy="36" rx="25" ry="23" />
        <ellipse class="ring-edge ring-edge-inner" cx="70" cy="36" rx="22" ry="20" />
      </g>

      <path class="ring-highlight" d="M24 24.5c4.2-5.8 10-9 17.5-9.8" />
      <path class="ring-highlight" d="M69.5 13.2c7.2 0 13.7 2.8 18.5 7.4" />
      <path class="ring-spark" d="m103 5 1.4 3.6 3.6 1.4-3.6 1.4-1.4 3.6-1.4-3.6L98 10l3.6-1.4L103 5Z" />
    </svg>
  </span>
</template>

<script setup lang="ts">
import { useId } from "vue";

withDefaults(defineProps<{ size?: "small" | "medium" | "large" | "xl" }>(), {
  size: "medium",
});

const componentId = useId();
const leftMaskId = `rings-left-${componentId}`;
const rightMaskId = `rings-right-${componentId}`;
</script>

<style scoped>
.rings-motif {
  display: inline-block;
  flex: 0 0 auto;
  line-height: 0;
}

.rings-motif svg {
  display: block;
  width: 100%;
  height: 100%;
  overflow: visible;
}

.rings-small {
  width: 1.75rem;
  height: 1.15rem;
}

.rings-medium {
  width: 5.5rem;
  height: 3.6rem;
}

.rings-large {
  width: 8rem;
  height: 5.2rem;
}

.rings-xl {
  width: 26rem;
  height: 17rem;
}

.ring-edge,
.ring-highlight {
  stroke: currentColor;
  vector-effect: non-scaling-stroke;
}

.ring-edge-outer {
  stroke-width: 1.2;
}

.ring-edge-inner {
  stroke-width: 0.65;
  opacity: 0.32;
}

.ring-left {
  opacity: 0.66;
}

.ring-right {
  opacity: 0.82;
}

.ring-highlight {
  stroke-linecap: round;
  stroke-width: 1.45;
  opacity: 0.72;
}

.ring-spark {
  fill: currentColor;
  opacity: 0.8;
}

.rings-small .ring-edge-inner {
  display: none;
}

.rings-small .ring-highlight {
  stroke-width: 1;
  opacity: 0.62;
}
</style>
