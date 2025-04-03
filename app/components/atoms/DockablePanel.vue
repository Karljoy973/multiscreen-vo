<template>
    <div
      class="dockable-panel"
      :class="{
        'is-dragging': isDragging,
        'is-maximized': isMaximized,
        'is-minimized': isMinimized,
        'is-resizing': isResizing,
        [`dock-${dockPosition}`]: dockPosition !== 'free'
      }"
      :style="{
        width: width + 'px',
        height: height + 'px',
        ...(dockPosition === 'free' ? { top: top + 'px', left: left + 'px' } : {})
      }"
      ref="panelRef"
    >
      <div class="panel-header" @mousedown.prevent="startDrag" @touchstart.prevent="startDrag">
        <div class="panel-title">{{ title }}</div>
        <div class="panel-actions">
          <v-btn icon="mdi-window-minimize" density="compact" variant="text" @click.stop="minimize" v-if="allowMinimize" />
          <v-btn
            icon="mdi-open-in-new"
            density="compact"
            variant="text"
            @click.stop="toggleMaximize"
            v-if="allowMaximize"
          />
          <v-btn icon="mdi-close" density="compact" variant="text" @click.stop="close" v-if="allowClose" />
        </div>
      </div>
  
      <div class="panel-content">
        <slot></slot>
      </div>
  
      <!-- Resize handles -->
      <div
        v-if="allowResize && !isMaximized"
        class="resize-handle resize-handle-right"
        @mousedown.prevent="startResize('right')"
        @touchstart.prevent="startResize('right')"
      ></div>
      <div
        v-if="allowResize && !isMaximized"
        class="resize-handle resize-handle-bottom"
        @mousedown.prevent="startResize('bottom')"
        @touchstart.prevent="startResize('bottom')"
      ></div>
      <div
        v-if="allowResize && !isMaximized"
        class="resize-handle resize-handle-corner"
        @mousedown.prevent="startResize('corner')"
        @touchstart.prevent="startResize('corner')"
      ></div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, onBeforeUnmount } from 'vue';
  import DragHandle from './DragHandle.vue';
  
  export type DockPosition = 'free' | 'left' | 'right' | 'top' | 'bottom' | 'center';
  
  const props = defineProps({
    id: {
      type: String,
      required: true
    },
    title: {
      type: String,
      default: 'Panel'
    },
    initialWidth: {
      type: Number,
      default: 300
    },
    initialHeight: {
      type: Number,
      default: 200
    },
    initialTop: {
      type: Number,
      default: 100
    },
    initialLeft: {
      type: Number,
      default: 100
    },
    minWidth: {
      type: Number,
      default: 200
    },
    minHeight: {
      type: Number,
      default: 100
    },
    maxWidth: {
      type: Number,
      default: Infinity
    },
    maxHeight: {
      type: Number,
      default: Infinity
    },
    initialDockPosition: {
      type: String as () => DockPosition,
      default: 'free',
      validator: (value: string) => {
        return ['free', 'left', 'right', 'top', 'bottom', 'center'].includes(value);
      }
    },
    allowClose: {
      type: Boolean,
      default: true
    },
    allowMinimize: {
      type: Boolean,
      default: true
    },
    allowMaximize: {
      type: Boolean,
      default: true
    },
    allowResize: {
      type: Boolean,
      default: true
    },
    active: {
      type: Boolean,
      default: true
    },
    windowUrl: {
      type: String,
      default: ''  // URL par défaut pour l'ouverture en fenêtre
    }
  });
  
  const emit = defineEmits([
    'update:active',
    'close',
    'minimize',
    'maximize',
    'restore',
    'dragStart',
    'dragEnd',
    'resize',
    'dockChange',
    'destroy',  // Ajout du nouvel événement
    'popout'  // Nouvel événement pour l'ouverture en fenêtre
  ]);
  
  const panelRef = ref<HTMLElement | null>(null);
  const width = ref(props.initialWidth);
  const height = ref(props.initialHeight);
  const top = ref(props.initialTop);
  const left = ref(props.initialLeft);
  const savedDimensions = ref({
    width: props.initialWidth,
    height: props.initialHeight,
    top: props.initialTop,
    left: props.initialLeft
  });
  
  const isDragging = ref(false);
  const isResizing = ref(false);
  const isMaximized = ref(false);
  const isMinimized = ref(false);
  const dockPosition = ref<DockPosition>(props.initialDockPosition);
  const resizeDirection = ref<'right' | 'bottom' | 'corner' | null>(null);
  
  const startDragPos = ref({ x: 0, y: 0 });
  const startElementPos = ref({ x: 0, y: 0 });
  const startElementSize = ref({ width: 0, height: 0 });
  
  function startDrag(event: MouseEvent | TouchEvent) {
    if (dockPosition.value !== 'free') {
      // If docked, undock first
      dockPosition.value = 'free';
      emit('dockChange', { id: props.id, dockPosition: 'free' });
    }
  
    isDragging.value = true;
  
    // Get clientX/Y for both mouse and touch events
    const clientX = event instanceof MouseEvent ? event.clientX : (event.touches && event.touches[0] ? event.touches[0].clientX : 0);
    const clientY = event instanceof MouseEvent ? event.clientY : (event.touches && event.touches[0] ? event.touches[0].clientY : 0);
  
    startDragPos.value = { x: clientX, y: clientY };
    startElementPos.value = { x: left.value, y: top.value };
  
    document.addEventListener('mousemove', drag);
    document.addEventListener('touchmove', drag);
    document.addEventListener('mouseup', stopDrag);
    document.addEventListener('touchend', stopDrag);
  
    emit('dragStart', { id: props.id, event });
  }
  
  function drag(event: MouseEvent | TouchEvent) {
    if (!isDragging.value) return;
  
    const clientX = event instanceof MouseEvent ? event.clientX : event.touches?.[0]?.clientX ?? 0;
    const clientY = event instanceof MouseEvent ? event.clientY : event.touches?.[0]?.clientY ?? 0;
  
    const deltaX = clientX - startDragPos.value.x;
    const deltaY = clientY - startDragPos.value.y;
  
    left.value = startElementPos.value.x + deltaX;
    top.value = startElementPos.value.y + deltaY;
  }
  
  function stopDrag() {
    if (!isDragging.value) return;
  
    isDragging.value = false;
  
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('touchmove', drag);
    document.removeEventListener('mouseup', stopDrag);
    document.removeEventListener('touchend', stopDrag);
  
    emit('dragEnd', { id: props.id, position: { top: top.value, left: left.value } });
  }
  
  function startResize(direction: 'right' | 'bottom' | 'corner') {
    isResizing.value = true;
    resizeDirection.value = direction;
  
    const clientX = event instanceof MouseEvent
      ? (event as MouseEvent).clientX
      : (event as TouchEvent).touches?.[0]?.clientX ?? 0;
  
    const clientY = event instanceof MouseEvent
      ? (event as MouseEvent).clientY
      : (event as TouchEvent).touches?.[0]?.clientY ?? 0;
  
    startDragPos.value = { x: clientX, y: clientY };
    startElementSize.value = { width: width.value, height: height.value };
  
    document.addEventListener('mousemove', resize);
    document.addEventListener('touchmove', resize);
    document.addEventListener('mouseup', stopResize);
    document.addEventListener('touchend', stopResize);
  }
  
  function resize(event: MouseEvent | TouchEvent) {
    if (!isResizing.value) return;
  
    const clientX = event instanceof MouseEvent ? event.clientX : event.touches?.[0]?.clientX ?? 0;
    const clientY = event instanceof MouseEvent ? event.clientY : event.touches?.[0]?.clientY ?? 0;
  
    const deltaX = clientX - startDragPos.value.x;
    const deltaY = clientY - startDragPos.value.y;
  
    if (resizeDirection.value === 'right' || resizeDirection.value === 'corner') {
      const newWidth = startElementSize.value.width + deltaX;
      width.value = Math.min(Math.max(newWidth, props.minWidth), props.maxWidth);
    }
  
    if (resizeDirection.value === 'bottom' || resizeDirection.value === 'corner') {
      const newHeight = startElementSize.value.height + deltaY;
      height.value = Math.min(Math.max(newHeight, props.minHeight), props.maxHeight);
    }
  
    emit('resize', {
      id: props.id,
      size: { width: width.value, height: height.value }
    });
  }
  
  function stopResize() {
    if (!isResizing.value) return;
  
    isResizing.value = false;
    resizeDirection.value = null;
  
    document.removeEventListener('mousemove', resize);
    document.removeEventListener('touchmove', resize);
    document.removeEventListener('mouseup', stopResize);
    document.removeEventListener('touchend', stopResize);
  }
  
  function toggleMaximize() {
    if (isMaximized.value) {
      // Restore previous size and position
      width.value = savedDimensions.value.width;
      height.value = savedDimensions.value.height;
  
      if (dockPosition.value === 'free') {
        top.value = savedDimensions.value.top;
        left.value = savedDimensions.value.left;
      }
  
      isMaximized.value = false;
      emit('restore', { id: props.id });
    } else {
      // Open in a new window
      const windowFeatures = `
        width=${width.value},
        height=${height.value},
        left=${left.value},
        top=${top.value},
        menubar=no,
        toolbar=no,
        location=no,
        status=no
      `;
      
      const windowName = `panel-${props.id}`;
      const url = `${props.windowUrl}?id=${props.id}`;
      
      window.open(url, windowName, windowFeatures);
      emit('popout', { id: props.id, url });
    }
  }
  
  function minimize() {
    isMinimized.value = !isMinimized.value;
    emit('minimize', { id: props.id, minimized: isMinimized.value });
  }
  
  function close() {
    emit('update:active', false);
    emit('close', { id: props.id });
    emit('destroy', { id: props.id }); // Émettre l'événement de destruction
  }
  
  function onDragStart(event: any) {
    startDrag(event.event);
  }
  
  function onDragEnd() {
    stopDrag();
  }
  
  onMounted(() => {
    if (props.initialDockPosition !== 'free') {
      // If initially docked, apply the docking position
      dockPosition.value = props.initialDockPosition;
    }
  });
  
  onBeforeUnmount(() => {
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('touchmove', drag);
    document.removeEventListener('mouseup', stopDrag);
    document.removeEventListener('touchend', stopDrag);
    document.removeEventListener('mousemove', resize);
    document.removeEventListener('touchmove', resize);
    document.removeEventListener('mouseup', stopResize);
    document.removeEventListener('touchend', stopResize);
  });
  </script>
  
  <style scoped>
  .dockable-panel {
    position: absolute;
    background-color: rgba(255, 255, 255, 0.95);
    border-radius: 4px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    transition: box-shadow 0.2s ease;
    border: 1px solid rgba(0, 0, 0, 0.1);
    z-index: 10;
  }
  
  .dockable-panel:hover {
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  }
  
  .dockable-panel.is-dragging {
    opacity: 0.8;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
    z-index: 100;
  }
  
  .dockable-panel.is-maximized {
    z-index: 50;
  }
  
  .dockable-panel.is-minimized .panel-content {
    display: none;
  }
  
  .dockable-panel.is-minimized {
    height: auto !important;
  }
  
  /* Docked positions */
  .dockable-panel.dock-left {
    top: 0;
    left: 0;
    bottom: 0;
    height: 100% !important;
    border-radius: 0;
    border-right: 1px solid rgba(0, 0, 0, 0.1);
    border-left: none;
    border-top: none;
    border-bottom: none;
  }
  
  .dockable-panel.dock-right {
    top: 0;
    right: 0;
    bottom: 0;
    height: 100% !important;
    border-radius: 0;
    border-left: 1px solid rgba(0, 0, 0, 0.1);
    border-right: none;
    border-top: none;
    border-bottom: none;
  }
  
  .dockable-panel.dock-top {
    top: 0;
    left: 0;
    right: 0;
    width: 100% !important;
    border-radius: 0;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    border-top: none;
    border-left: none;
    border-right: none;
  }
  
  .dockable-panel.dock-bottom {
    bottom: 0;
    left: 0;
    right: 0;
    width: 100% !important;
    border-radius: 0;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    border-bottom: none;
    border-left: none;
    border-right: none;
  }
  
  .dockable-panel.dock-center {
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100% !important;
    height: 100% !important;
    border-radius: 0;
    border: none;
  }
  
  .panel-header {
    display: flex;
    align-items: center;
    padding: 8px 12px;
    background-color: #f5f5f5;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    user-select: none;
    cursor: move;
    min-height: 40px;
  }
  
  .panel-title {
    flex: 1;
    font-weight: 500;
    font-size: 14px;
    margin-right: 8px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  .panel-actions {
    display: flex;
    gap: 4px;
    align-items: center;
  }
  
  .panel-actions .v-btn {
    min-width: 24px;
    min-height: 24px;
    padding: 0;
    color: rgba(0, 0, 0, 0.7);
  }
  
  :deep(.v-btn--icon.v-btn--density-compact) {
    width: 24px;
    height: 24px;
  }
  
  :deep(.v-theme--dark) .panel-actions .v-btn {
    color: rgba(255, 255, 255, 0.7);
  }
  
  .panel-content {
    flex: 1;
    overflow: auto;
    position: relative;
  }
  
  .resize-handle {
    position: absolute;
    background-color: transparent;
  }
  
  .resize-handle-right {
    top: 0;
    right: 0;
    width: 6px;
    height: 100%;
    cursor: ew-resize;
  }
  
  .resize-handle-bottom {
    bottom: 0;
    left: 0;
    height: 6px;
    width: 100%;
    cursor: ns-resize;
  }
  
  .resize-handle-corner {
    bottom: 0;
    right: 0;
    width: 12px;
    height: 12px;
    cursor: nwse-resize;
  }
  
  /* Dark mode styles */
  :deep(.v-theme--dark) .dockable-panel {
    background-color: rgba(30, 30, 30, 0.95);
    border-color: rgba(255, 255, 255, 0.1);
  }
  
  :deep(.v-theme--dark) .panel-header {
    background-color: #333;
    border-color: rgba(255, 255, 255, 0.1);
  }
  
  .is-resizing {
    user-select: none;
  }
  </style>
