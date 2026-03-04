import * as THREE from "three";
import { Tween, Easing } from "@tweenjs/tween.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";

interface WebkitDocument extends Document {
  webkitFullscreenElement?: Element;
  webkitExitFullscreen?: () => Promise<void>;
}

interface WebkitHTMLElement extends HTMLElement {
  webkitRequestFullscreen?: () => Promise<void>;
}

// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl") as HTMLCanvasElement;

// Scene
const scene = new THREE.Scene();

/**
 * Axes Helper
 */
const axesHelper = new THREE.AxesHelper(2);
scene.add(axesHelper);

/**
 * Objects
 */
const group = new THREE.Group();
group.scale.y = 2;
group.rotation.y = 0.1;
scene.add(group);

const cube1 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0xff0000 }),
);
cube1.position.x = -2;
group.add(cube1);

const cube2 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: "green" }),
);
cube2.position.x = 0;
group.add(cube2);

const geometry = new THREE.BufferGeometry();

const count = 500;

const positionsArray = new Float32Array(count * 3 * 3);

for (let i = 0; i < count * 3 * 3; i++) {
  positionsArray[i] = Math.random() - 0.5;
}

const positionAttribute = new THREE.BufferAttribute(positionsArray, 3);

geometry.setAttribute("position", positionAttribute);

const cube3 = new THREE.Mesh(
  geometry,

  new THREE.MeshBasicMaterial({ color: "blue", wireframe: true }),
);
cube3.position.x = 2;
group.add(cube3);

gui
  .add(cube3.position, "y")
  .min(-3)
  .max(3)
  .step(0.01)
  .name("Cube 3 Y Position");

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
});

// Cursor
const cursor = {
  x: 0,
  y: 0,
};

window.addEventListener("mousemove", (event) => {
  cursor.x = event.clientX / sizes.width - 0.5;
  cursor.y = -(event.clientY / sizes.height - 0.5);
});

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 5;
// camera.lookAt(new THREE.Vector3(0, - 1, 0))
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Fullscreen on double click
window.addEventListener("dblclick", () => {
  const webkitDoc = document as WebkitDocument;
  const fullscreenElement =
    document.fullscreenElement || webkitDoc.webkitFullscreenElement;

  if (!fullscreenElement) {
    if (canvas.requestFullscreen) {
      canvas.requestFullscreen();
    } else if ((canvas as WebkitHTMLElement).webkitRequestFullscreen) {
      (canvas as WebkitHTMLElement).webkitRequestFullscreen!();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (webkitDoc.webkitExitFullscreen) {
      webkitDoc.webkitExitFullscreen();
    }
  }
});

/**
 * Animate
 */
const tween1 = new Tween(cube1.rotation)
  .to({ x: Math.PI * 2, y: Math.PI * 2 }, 30000)
  .repeat(Infinity)
  .easing(Easing.Linear.None)
  .start();

const tween2 = new Tween(cube2.rotation)
  .to({ x: Math.PI * -2, y: Math.PI * -2 }, 30000)
  .repeat(Infinity)
  .easing(Easing.Linear.None)
  .start();

const tween3 = new Tween(cube3.rotation)
  .to({ x: Math.PI * 2, y: Math.PI * 2 }, 30000)
  .repeat(Infinity)
  .easing(Easing.Linear.None)
  .start();

const clock = new THREE.Clock();

const tick = () => {
  tween1.update();
  tween2.update();
  tween3.update();

  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
