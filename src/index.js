"use strict";

import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";
import { distantStars } from "./distanceStars";
import {
  sun,
  mercury,
  earth,
  mars,
  jupiter,
  saturn,
  uranus,
  neptune,
  venus,
} from "./objects";
import { objectProperties } from "./objectProperties";
import { content } from "./contents";

let controls, renderer, camera;

let objectRevolving = true;
let contentShowing = false;
const mercuryPivoted = new THREE.Object3D();
const venusPivoted = new THREE.Object3D();
const earthPivoted = new THREE.Object3D();
const marsPivoted = new THREE.Object3D();
const jupiterPivoted = new THREE.Object3D();
const saturnPivoted = new THREE.Object3D();
const uranusPivoted = new THREE.Object3D();
const neptunePivoted = new THREE.Object3D();

let mercuryObject;
let venusObject;
let earthObject;
let marsObject;
let jupiterObject;
let saturnGroup;
let uranusObject;
let neptuneObject;
let sunObject;

const scene = new THREE.Scene();

const dropDownUp = document.createElement("img");
dropDownUp.src = "imgs/dropup.svg";
dropDownUp.className = "dropup";
document.querySelector(".visibility").appendChild(dropDownUp);

const init = () => {
  const canvas = document.querySelector("canvas.webgl");

  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
  scene.add(directionalLight);
  directionalLight.position.z = 1;

  const camera = initCamera(sizes);
  scene.add(camera);
  initControls(camera, canvas);
  renderer = initRenderer(sizes, canvas);

  initObjects();
  initDOM();
  handleButtonClicks();
  updateSize(sizes, camera, renderer);
};
const initCamera = (sizes) => {
  camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    100
  );
  camera.position.z = 17;
  return camera;
};
const initControls = (camera, canvas) => {
  controls = new OrbitControls(camera, canvas);
  return controls;
};
const initRenderer = (sizes, canvas) => {
  const rendererScoped = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
  });
  rendererScoped.setSize(sizes.width, sizes.height);
  rendererScoped.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  return rendererScoped;
};
const initObjects = () => {
  const secondParticles = distantStars();

  scene.add(secondParticles);
  sunObject = [...sun()];

  scene.add(sunObject[0], sunObject[1]);

  mercuryObject = mercury();
  mercuryPivoted.add(mercuryObject);

  venusObject = venus();
  venusPivoted.add(venusObject);

  earthObject = earth();
  earthPivoted.add(earthObject);

  marsObject = mars();
  marsPivoted.add(marsObject);

  jupiterObject = jupiter();
  jupiterPivoted.add(jupiterObject);

  saturnGroup = saturn();
  saturnPivoted.add(saturnGroup);

  uranusObject = uranus();
  uranusPivoted.add(uranusObject);

  neptuneObject = neptune();
  neptunePivoted.add(neptuneObject);

  scene.add(
    mercuryPivoted,
    venusPivoted,
    earthPivoted,
    marsPivoted,
    jupiterPivoted,
    saturnPivoted,
    uranusPivoted,
    neptunePivoted
  );
};

const updateSize = (sizes, camera, renderer) => {
  window.addEventListener("resize", () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });
};

const clock = new THREE.Clock();

const rotateObjects = () => {
  mercuryObject.rotation.y += objectProperties.mercury.rotationSpeed;
  venusObject.rotation.y += objectProperties.venus.rotationSpeed;
  marsObject.rotation.y += objectProperties.mars.rotationSpeed;
  jupiterObject.rotation.y += objectProperties.jupiter.rotationSpeed;
  uranusObject.rotation.y += objectProperties.uranus.rotationSpeed;
  neptuneObject.rotation.y += objectProperties.neptune.rotationSpeed;
};
const revolveObjects = () => {
  mercuryPivoted.rotation.y += objectProperties.mercury.revolutionSpeed;
  venusPivoted.rotation.y += objectProperties.venus.revolutionSpeed;
  marsPivoted.rotation.y += objectProperties.mars.revolutionSpeed;
  jupiterPivoted.rotation.y += objectProperties.jupiter.revolutionSpeed;
  saturnPivoted.rotation.y += objectProperties.saturn.revolutionSpeed;
  uranusPivoted.rotation.y += objectProperties.uranus.revolutionSpeed;
  neptunePivoted.rotation.y += objectProperties.neptune.revolutionSpeed;
};

const stopRevolvingObject = () => {
  mercuryObject.rotation.y += 0;
  venusObject.rotation.y += 0;
  marsObject.rotation.y += 0;
  jupiterObject.rotation.y += 0;
  uranusObject.rotation.y += 0;
  neptuneObject.rotation.y += 0;
};

const showContent = () => {
  if (!contentShowing) {
    dropDownUp.src = "imgs/dropdown.svg";
    dropDownUp.className = "dropdown";
  }
  document.querySelector(".stats__desc").style.display = "flex";
  contentShowing = true;
};
const hideContent = () => {
  if (contentShowing) {
    dropDownUp.src = "imgs/dropup.svg";
    dropDownUp.className = "dropup";
  }
  document.querySelector(".stats__desc").style.display = "none";
  contentShowing = false;
};
const initDOM = () => {
  hideContent();
  document.querySelector(".visibility").addEventListener("click", () => {
    if (!contentShowing) {
      showContent();
    } else hideContent();
  });
  document.querySelector(".return").addEventListener("click", () => {
    resetProperties();
  });
};
const handleButtonClicks = () => {
  const planets = document.querySelector(".planets");
  const contentList = ["notes", "weight", "rotation", "revolution"];
  planets.childNodes.forEach((planet) => {
    planet.addEventListener("pointerdown", () => {
      objectRevolving = false;
      const planetName = planet.textContent.toLowerCase();
      const domContent = document.querySelectorAll(".stats__desc > div > p");
      domContent.forEach((elem, index) => {
        elem.textContent = content[planetName][contentList[index]];
      });
      resetProperties();
      zoomOnPlanet(planetName);
      showContent();
    });
  });
};
const resetProperties = () => {
  objectRevolving = true;
  camera.position.z = 17;
  mercuryObject.position.x = objectProperties.mercury.position;
  mercuryObject.scale.set(
    objectProperties.mercury.scale,
    objectProperties.mercury.scale,
    objectProperties.mercury.scale
  );
  venusObject.position.x = objectProperties.venus.position;
  venusObject.scale.set(
    objectProperties.venus.scale,
    objectProperties.venus.scale,
    objectProperties.venus.scale
  );
  earthObject.position.x = objectProperties.earth.position;
  earthObject.scale.set(
    objectProperties.earth.scale,
    objectProperties.earth.scale,
    objectProperties.earth.scale
  );
  marsObject.position.x = objectProperties.mars.position;
  marsObject.scale.set(
    objectProperties.mars.scale,
    objectProperties.mars.scale,
    objectProperties.mars.scale
  );
  jupiterObject.position.x = objectProperties.jupiter.position;
  jupiterObject.scale.set(
    objectProperties.jupiter.scale,
    objectProperties.jupiter.scale,
    objectProperties.jupiter.scale
  );
  saturnGroup.position.x = objectProperties.saturn.position;
  saturnGroup.scale.set(1, 1, 1);
  uranusObject.position.x = objectProperties.uranus.position;
  uranusObject.scale.set(
    objectProperties.uranus.scale,
    objectProperties.uranus.scale,
    objectProperties.uranus.scale
  );
  neptuneObject.position.x = objectProperties.neptune.position;
  neptuneObject.scale.set(
    objectProperties.neptune.scale,
    objectProperties.neptune.scale,
    objectProperties.neptune.scale
  );
};

const zoomOnPlanet = (planet) => {
  objectRevolving = false;
  // camera.position.z = 5;
  switch (planet) {
    case "mercury":
      mercuryObject.position.x = 0;
      mercuryObject.scale.set(1, 1, 1);
      break;
    case "venus":
      venusObject.position.x = 0;
      venusObject.scale.set(1, 1, 1);
      break;
    case "earth":
      earthObject.position.x = 0;
      earthObject.scale.set(1, 1, 1);
      break;
    case "mars":
      marsObject.position.x = 0;
      marsObject.scale.set(1, 1, 1);
      break;
    case "jupiter":
      jupiterObject.position.x = 0;
      jupiterObject.scale.set(1, 1, 1);
      break;
    case "saturn":
      saturnGroup.position.x = 0;
      const reverseScale = ((1 / objectProperties.saturn.scale) * 1) / 2;
      saturnGroup.scale.set(reverseScale, reverseScale, reverseScale);
      break;
    case "uranus":
      uranusObject.position.x = 0;
      uranusObject.scale.set(1, 1, 1);
      break;
    case "neptune":
      neptuneObject.position.x = 0;
      neptuneObject.scale.set(1, 1, 1);
      break;
  }
};
init();
const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  if (saturnGroup.children[2]) {
    saturnGroup.children[2].rotateZ(0.0005);
  }
  if (sunObject) {
    sunObject[0].material.uniforms.uTime.value = elapsedTime;
  }
  rotateObjects();
  if (objectRevolving) revolveObjects();
  // else stopRevolvingObject();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
