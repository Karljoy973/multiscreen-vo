<template>
  <div
    class="drag-handle"
    :class="{ active: isDragging }"
    @mousedown="startDrag"
    @touchstart="startDrag"
  >
    <div class="dot"></div>
    <div class="dot"></div>
    <div class="dot"></div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps({
  elementId: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['dragStart', 'dragEnd']);

const isDragging = ref(false);

function startDrag(event: MouseEvent | TouchEvent) {
  event.preventDefault();
  isDragging.value = true;
  emit('dragStart', {
    elementId: props.elementId,
    event
  });

  // Add global event listeners
  document.addEventListener('mousemove', drag);
  document.addEventListener('touchmove', drag);
  document.addEventListener('mouseup', stopDrag);
  document.addEventListener('touchend', stopDrag);
}

function drag(event: MouseEvent | TouchEvent) {
  if (!isDragging.value) return;

  // Let the parent component handle the actual dragging logic
  // We're just emitting events
}

function stopDrag() {
  if (!isDragging.value) return;

  isDragging.value = false;
  emit('dragEnd', { elementId: props.elementId });

  // Remove global event listeners
  document.removeEventListener('mousemove', drag);
  document.removeEventListener('touchmove', drag);
  document.removeEventListener('mouseup', stopDrag);
  document.removeEventListener('touchend', stopDrag);
}
</script>

<style scoped>
.drag-handle {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 16px;
  height: 24px;
  cursor: grab;
  padding: 2px;
  border-radius: 4px;
  opacity: 0.5;
  transition: opacity 0.2s, background-color 0.2s;
}

.drag-handle:hover {
  opacity: 1;
  background-color: rgba(0, 0, 0, 0.05);
}

.drag-handle.active {
  cursor: grabbing;
  opacity: 1;
  background-color: rgba(0, 0, 0, 0.1);
}

.dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: currentColor;
}
</style>
