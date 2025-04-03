<template>
  <div
    class="drag-overlay"
    :class="{ active: isActive }"
    :style="{
      '--overlay-opacity': opacity
    }"
  >
    <div
      v-for="(zone, index) in dropZones"
      :key="index"
      class="drop-zone"
      :class="{ 'can-drop': zone.canDrop, 'hover': zone.isHovering }"
      :style="{
        left: `${zone.x}px`,
        top: `${zone.y}px`,
        width: `${zone.width}px`,
        height: `${zone.height}px`
      }"
    >
      <div class="drop-zone-indicator"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

export interface DropZone {
  x: number;
  y: number;
  width: number;
  height: number;
  canDrop: boolean;
  isHovering: boolean;
}

const props = defineProps({
  isActive: {
    type: Boolean,
    default: false
  },
  dropZones: {
    type: Array as () => DropZone[],
    default: () => []
  },
  opacity: {
    type: Number,
    default: 0.6
  }
});

const showOverlay = computed(() => {
  return props.isActive && props.dropZones.length > 0;
});
</script>

<style scoped>
.drag-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, var(--overlay-opacity, 0.6));
  z-index: 1000;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.2s ease;
  display: flex;
  justify-content: center;
  align-items: center;
}

.drag-overlay.active {
  opacity: 1;
}

.drop-zone {
  position: absolute;
  border: 2px dashed rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  background-color: rgba(255, 255, 255, 0.1);
  transition: all 0.2s ease;
  display: flex;
  justify-content: center;
  align-items: center;
}

.drop-zone.can-drop {
  border-color: rgba(59, 130, 246, 0.5);
  background-color: rgba(59, 130, 246, 0.2);
}

.drop-zone.hover {
  border-color: rgba(59, 130, 246, 0.8);
  background-color: rgba(59, 130, 246, 0.3);
  transform: scale(1.02);
}

.drop-zone-indicator {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.7);
  opacity: 0;
  transform: scale(0.8);
  transition: all 0.2s ease;
}

.drop-zone.can-drop .drop-zone-indicator {
  opacity: 0.5;
  transform: scale(1);
}

.drop-zone.hover .drop-zone-indicator {
  opacity: 1;
  transform: scale(1.2);
}
</style>
