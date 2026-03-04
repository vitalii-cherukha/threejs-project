import * as THREE from "three";
import { Tween, Easing } from "@tweenjs/tween.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

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

const cube3 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: "blue" }),
);
cube3.position.x = 2;
group.add(cube3);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

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

/**
 * Animate
 */
// const tween1 = new Tween(cube1.rotation)
//   .to({ x: Math.PI * 2, y: Math.PI * 2 }, 3000)
//   .repeat(Infinity)
//   .easing(Easing.Linear.None)
//   .start();

// const tween2 = new Tween(cube2.rotation)
//   .to({ x: Math.PI * 2, y: Math.PI * 2 }, 3000)
//   .repeat(Infinity)
//   .easing(Easing.Linear.None)
//   .start();

// const tween3 = new Tween(cube3.rotation)
//   .to({ x: Math.PI * 2, y: Math.PI * 2 }, 3000)
//   .repeat(Infinity)
//   .easing(Easing.Linear.None)
//   .start();

const clock = new THREE.Clock();

const tick = () => {
  // tween1.update();
  // tween2.update();
  // tween3.update();

  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
