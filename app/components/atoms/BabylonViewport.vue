<template>
  <div class="babylon-viewport" ref="canvasContainer">
    <canvas ref="renderCanvas" class="render-canvas"></canvas>
    <div v-if="loading" class="loading-overlay">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import {
  Engine,
  Scene,
  ArcRotateCamera,
  Vector3,
  HemisphericLight,
  MeshBuilder
} from '@babylonjs/core';

const props = defineProps({
  sceneId: {
    type: String,
    required: true
  },
  viewportType: {
    type: String,
    default: 'perspective', // perspective, top, front, side
    validator: (value: string) => {
      return ['perspective', 'top', 'front', 'side'].includes(value);
    }
  },
  width: {
    type: Number,
    default: 0 // 0 = auto (100%)
  },
  height: {
    type: Number,
    default: 0 // 0 = auto (100%)
  },
  active: {
    type: Boolean,
    default: true
  },
  enableGrid: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['ready', 'resize']);

const canvasContainer = ref<HTMLDivElement | null>(null);
const renderCanvas = ref<HTMLCanvasElement | null>(null);
const engine = ref<Engine | null>(null);
const scene = ref<Scene | null>(null);
const camera = ref<ArcRotateCamera | null>(null);
const loading = ref(true);

function setupViewport() {
  if (!renderCanvas.value) return;

  // Create engine
  engine.value = new Engine(renderCanvas.value, true, {
    preserveDrawingBuffer: true,
    stencil: true
  });

  // Create scene
  scene.value = new Scene(engine.value as Engine);
  scene.value.clearColor.set(0.05, 0.05, 0.05, 1);

  // Create camera based on viewport type
  setupCamera();

  // Add light
  const light = new HemisphericLight("light", new Vector3(0, 1, 0), (scene.value as Scene));
  light.intensity = 0.7;

  // Add simple ground for reference
  if (props.enableGrid) {
    const ground = MeshBuilder.CreateGround("ground", { width: 10, height: 10 }, (scene.value as Scene));
    ground.isPickable = false;
  }

  // Create a demo sphere
  const sphere = MeshBuilder.CreateSphere("sphere", { diameter: 1 }, (scene.value as Scene));
  sphere.position.y = 0.5;

  // Start rendering
  (engine.value as Engine).runRenderLoop(() => {
    if ((scene.value as Scene) && camera.value && props.active) {
      (scene.value as Scene).render();
    }
  });

  // Handle window resize
  window.addEventListener('resize', onResize);

  // Initial resize to set dimensions
  onResize();

  // Set loading to false when ready
  loading.value = false;

  // Emit ready event with the scene
  emit('ready', {
    sceneId: props.sceneId,
    scene: (scene.value as Scene),
    engine: engine.value as Engine,
    camera: camera.value
  });
}

function setupCamera() {
  if (!(scene.value as Scene)) return;

  switch (props.viewportType) {
    case 'perspective':
      camera.value = new ArcRotateCamera(
        "camera",
        -Math.PI / 2,
        Math.PI / 3,
        5,
        Vector3.Zero(),
        (scene.value as Scene)
      );
      break;

    case 'top':
      camera.value = new ArcRotateCamera(
        "camera",
        0,
        0,
        10,
        Vector3.Zero(),
        (scene.value as Scene)
      );
      break;

    case 'front':
      camera.value = new ArcRotateCamera(
        "camera",
        0,
        Math.PI / 2,
        10,
        Vector3.Zero(),
        (scene.value as Scene)
      );
      break;

    case 'side':
      camera.value = new ArcRotateCamera(
        "camera",
        Math.PI / 2,
        Math.PI / 2,
        10,
        Vector3.Zero(),
        (scene.value as Scene)
      );
      break;
  }

  if (camera.value) {
    camera.value.attachControl(renderCanvas.value, true);
    camera.value.wheelPrecision = 50;
    camera.value.lowerRadiusLimit = 1;
    camera.value.upperRadiusLimit = 100;
  }
}

function onResize() {
  if (!(engine.value as Engine) || !canvasContainer.value) return;

  const width = props.width || canvasContainer.value.clientWidth;
  const height = props.height || canvasContainer.value.clientHeight;

  (engine.value as Engine).resize();

  emit('resize', { width, height });
}

function cleanup() {
  window.removeEventListener('resize', onResize);

  if (engine.value as Engine) {
    (engine.value as Engine).dispose();
    engine.value = null;
  }
}

// Watch for changes in the active prop
watch(() => props.active, (newValue) => {
  if (newValue && engine.value as Engine && !(engine.value as Engine).isDisposed) {
    (engine.value as Engine).runRenderLoop(() => {
      if ((scene.value as Scene)) {
        (scene.value as Scene).render();
      }
    });
  }
});

onMounted(() => {
  setupViewport();
});

onBeforeUnmount(() => {
  cleanup();
});
</script>

<style scoped>
.babylon-viewport {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: #111;
}

.render-canvas {
  width: 100%;
  height: 100%;
  outline: none;
  touch-action: none;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 10;
}
</style>
