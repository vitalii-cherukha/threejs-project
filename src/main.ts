import * as THREE from "three";
import { Tween, Easing, Group } from "@tweenjs/tween.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";

interface WebkitDocument extends Document {
  webkitFullscreenElement?: Element;
  webkitExitFullscreen?: () => Promise<void>;
}

interface WebkitHTMLElement extends HTMLElement {
  webkitRequestFullscreen?: () => Promise<void>;
}

// Textures
const loadingManager = new THREE.LoadingManager();

loadingManager.onStart = () => {
  console.log("Loading started");
};

loadingManager.onLoad = () => {
  console.log("Loading finished");
};

loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
  console.log(
    `Started loading file: ${url}. Loaded ${itemsLoaded} of ${itemsTotal} files`,
  );
};

loadingManager.onError = (url) => {
  console.log(`There was an error loading ${url}`);
};

const textureLoader = new THREE.TextureLoader();

const colorTexture = textureLoader.load("../static/textures/door/color.jpg");
colorTexture.colorSpace = THREE.SRGBColorSpace;
const alphaTexture = textureLoader.load("../static/textures/door/alpha.jpg");
alphaTexture.colorSpace = THREE.SRGBColorSpace;
const heightTexture = textureLoader.load("../static/textures/door/height.jpg");
heightTexture.colorSpace = THREE.SRGBColorSpace;
const normalTexture = textureLoader.load("../static/textures/door/normal.jpg");
normalTexture.colorSpace = THREE.SRGBColorSpace;
const ambientOcclusionTexture = textureLoader.load(
  "../static/textures/door/ambientOcclusion.jpg",
);
ambientOcclusionTexture.colorSpace = THREE.SRGBColorSpace;
const metalnessTexture = textureLoader.load(
  "../static/textures/door/metalness.jpg",
);
metalnessTexture.colorSpace = THREE.SRGBColorSpace;
const roughnessTexture = textureLoader.load(
  "../static/textures/door/roughness.jpg",
);
roughnessTexture.colorSpace = THREE.SRGBColorSpace;

// Debug
const tweenGroup = new Group();

const gui = new GUI({
  width: 400,
  title: "Three.js Journey - Debug",
  closeFolders: false,
});
gui.close();

gui.hide();
window.addEventListener("keydown", (event) => {
  if (event.key === "h") {
    if (gui._hidden) {
      gui.show();
    } else {
      gui.hide();
    }
  }
});

const debugObject: any = {};

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
debugObject.color = "#7278a1";

const group = new THREE.Group();
group.scale.y = 2;
group.rotation.y = 0.1;
scene.add(group);

const cubeTweaks3 = gui.addFolder("Cube 3");
cubeTweaks3.close();

const cube1 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0xff0000 }),
);
cube1.position.x = -2;
group.add(cube1);

const cube2 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ map: colorTexture }),
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

  new THREE.MeshBasicMaterial({ color: debugObject.color, wireframe: true }),
);
cube3.position.x = 2;
group.add(cube3);

cubeTweaks3
  .add(cube3.position, "y")
  .min(-3)
  .max(3)
  .step(0.01)
  .name("Cube 3 Y Position");

cubeTweaks3.add(cube3, "visible").name("Cube 3 Visible");

cubeTweaks3.add(cube3.material, "wireframe").name("Cube 3 Wireframe");

cubeTweaks3
  .addColor(debugObject, "color")
  .onChange(() => {
    (cube3.material as THREE.MeshBasicMaterial).color.set(debugObject.color);
  })
  .name("Cube 3 Color");

debugObject.spin = () => {
  new Tween(cube3.rotation, tweenGroup)
    .to({ y: cube3.rotation.y + Math.PI * 2 }, 1000)
    .start();
};

cubeTweaks3.add(debugObject, "spin").name("Spin Cube 3");

debugObject.subdivision = 2;

cubeTweaks3
  .add(debugObject, "subdivision")
  .min(1)
  .max(20)
  .step(1)
  .onFinishChange(() => {
    cube3.geometry.dispose();
    cube3.geometry = new THREE.BoxGeometry(
      1,
      1,
      1,
      debugObject.subdivision,
      debugObject.subdivision,
      debugObject.subdivision,
    );
  });

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
const tween1 = new Tween(cube1.rotation, tweenGroup)
  .to({ x: Math.PI * 2 }, 30000)
  .repeat(Infinity)
  .easing(Easing.Linear.None)
  .start();

const tween2 = new Tween(cube2.rotation, tweenGroup)
  .to({ x: Math.PI * -2 }, 30000)
  .repeat(Infinity)
  .easing(Easing.Linear.None)
  .start();

const tween3 = new Tween(cube3.rotation, tweenGroup)
  .to({ x: Math.PI * 2 }, 30000)
  .repeat(Infinity)
  .easing(Easing.Linear.None)
  .start();

const clock = new THREE.Clock();

const tick = () => {
  tweenGroup.update();

  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
