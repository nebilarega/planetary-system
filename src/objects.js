import * as THREE from "three";
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler";
import sunVertexShader from "./shaders/sun/vertex.glsl";
import sunFragmentShader from "./shaders/sun/fragment.glsl";
import sunBackVertexShader from "./shaders/sun/vertexBack.glsl";
import sunBackFragmentShader from "./shaders/sun/fragmentBack.glsl";
import earthAtmosphereVertexShader from "./shaders/earth/vertexAtmos.glsl";
import earthAtmosphereFragmentShader from "./shaders/earth/fragmentAtmos.glsl";
import { objectProperties } from "./objectProperties";

const sunSize = 10;

const textureLoaderFunction = () => {
  const loadingManager = new THREE.LoadingManager();
  loadingManager.onStart = () => {
    console.log("loadingManager: loading started");
  };
  loadingManager.onLoad = () => {
    console.log("loadingManager: loading finished");
  };
  loadingManager.onProgress = () => {
    console.log("loadingManager: loading progressing");
  };
  loadingManager.onError = () => {
    console.log("loadingManager: loading error");
  };

  return new THREE.TextureLoader(loadingManager);
};

const textureLoader = textureLoaderFunction();

export const sun = () => {
  const geometery = new THREE.SphereGeometry(3, 64, 64);
  const material = new THREE.ShaderMaterial({
    side: THREE.DoubleSide,
    uniforms: {
      uTime: { value: 0 },
      uPosition: { value: new THREE.Vector3(0, 0, 0) },
    },
    vertexShader: sunVertexShader,
    fragmentShader: sunFragmentShader,
  });
  const sunMesh = new THREE.Mesh(geometery, material);

  const backGeometery = new THREE.SphereGeometry(3.2, 32, 32);
  const backmaterial = new THREE.ShaderMaterial({
    uniforms: {
      uTexture: { value: null },
      uPosition: { value: new THREE.Vector3(0, 0, 0) },
      uIntensityScale: { value: 0.3 },
    },
    side: THREE.BackSide,
    vertexShader: sunBackVertexShader,
    fragmentShader: sunBackFragmentShader,
  });
  const sunBackMesh = new THREE.Mesh(backGeometery, backmaterial);
  return [sunMesh, sunBackMesh];
};

export const earth = () => {
  const earthUVMap = textureLoader.load("textures/earth/earthUV.jpeg");

  const geometery = new THREE.SphereGeometry(sunSize, 64, 64);
  const material = new THREE.MeshStandardMaterial({
    map: earthUVMap,
  });
  const earthMesh = new THREE.Mesh(geometery, material);
  earthMesh.rotation.z = objectProperties.earth.tilt;
  earthMesh.scale.set(
    objectProperties.earth.scale,
    objectProperties.earth.scale,
    objectProperties.earth.scale
  );

  const atmosGeometery = new THREE.SphereGeometry(sunSize + 0.15, 32, 32);
  const atmosMaterial = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    vertexShader: earthAtmosphereVertexShader,
    fragmentShader: earthAtmosphereFragmentShader,
  });
  const atmosphere = new THREE.Mesh(atmosGeometery, atmosMaterial);
  atmosphere.scale.set(
    objectProperties.earth.scale,
    objectProperties.earth.scale,
    objectProperties.earth.scale
  );

  const earthGroup = new THREE.Group();
  earthGroup.add(earthMesh, atmosphere);
  earthGroup.position.x = objectProperties.earth.position;
  return earthGroup;
};
const ringParticles = (model) => {
  const sampleGeometry = model.geometry;
  const sampleMaterial = model.material;

  const surfaceMesh = new THREE.Mesh(sampleGeometry, sampleMaterial);
  const sampler = new MeshSurfaceSampler(surfaceMesh)
    .setWeightAttribute("color")
    .build();

  const _position = new THREE.Vector3();
  const particleGeometery = new THREE.BufferGeometry();
  const vertices = [];

  for (let i = 0; i < 4000; i++) {
    sampler.sample(_position);
    vertices.push(_position.x, _position.y, _position.z);
  }
  particleGeometery.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(vertices, 3)
  );
  const particleMaterial = new THREE.PointsMaterial({});
  particleMaterial.size = 0.002;
  particleMaterial.color = new THREE.Color(0xc3d6db);
  particleMaterial.sizeAttenuation = true;
  const particleSystem = new THREE.Points(particleGeometery, particleMaterial);
  return particleSystem;
};
export const saturn = () => {
  const saturnUVMap = textureLoader.load("textures/saturn/saturnUV.jpeg");
  const saturnRingTex = textureLoader.load(
    "textures/saturn/saturn_ring_circle.png"
  );
  const geometery = new THREE.SphereGeometry(
    sunSize * objectProperties.saturn.scale,
    64,
    64
  );
  const material = new THREE.MeshStandardMaterial({
    map: saturnUVMap,
  });
  const saturnMesh = new THREE.Mesh(geometery, material);

  const ringGeometery = new THREE.RingGeometry(
    sunSize * objectProperties.saturn.scale + 0.2,
    sunSize * objectProperties.saturn.scale + 0.6,
    64
  );
  const ringMaterial = new THREE.MeshStandardMaterial({
    transparent: true,
    map: saturnRingTex,
    side: THREE.DoubleSide,
  });
  const saturnRing = new THREE.Mesh(ringGeometery, ringMaterial);

  saturnRing.rotation.x = Math.PI / 2 + 0.2;

  const ringParticleSystem = ringParticles(saturnRing);
  ringParticleSystem.rotation.x = Math.PI / 2 + 0.2;
  ringParticleSystem.position.y = 0.1;

  const saturnGroup = new THREE.Group();
  saturnGroup.add(saturnMesh, saturnRing, ringParticleSystem);
  saturnGroup.position.x = objectProperties.saturn.position;

  saturnGroup.rotation.z = objectProperties.saturn.tilt;
  saturnGroup.scale.set();

  return saturnGroup;
};

export const mars = () => {
  const marsUVMap = textureLoader.load("textures/mars/marsUV.jpeg");

  const geometery = new THREE.SphereGeometry(sunSize, 64, 64);
  const material = new THREE.MeshStandardMaterial({
    map: marsUVMap,
  });
  const marsMesh = new THREE.Mesh(geometery, material);

  marsMesh.position.x = objectProperties.mars.position;
  marsMesh.rotation.z = objectProperties.mars.tilt;
  marsMesh.scale.set(
    objectProperties.mars.scale,
    objectProperties.mars.scale,
    objectProperties.mars.scale
  );
  return marsMesh;
};

export const jupiter = () => {
  const jupiterUVMap = textureLoader.load("textures/jupiter/jupiterUV.jpeg");

  const geometery = new THREE.SphereGeometry(sunSize, 64, 64);
  const material = new THREE.MeshStandardMaterial({
    map: jupiterUVMap,
  });
  const jupiterMesh = new THREE.Mesh(geometery, material);

  jupiterMesh.position.x = objectProperties.jupiter.position;
  jupiterMesh.rotation.z = objectProperties.jupiter.tilt;
  jupiterMesh.scale.set(
    objectProperties.jupiter.scale,
    objectProperties.jupiter.scale,
    objectProperties.jupiter.scale
  );

  return jupiterMesh;
};

export const mercury = () => {
  const mercuryUVMap = textureLoader.load("textures/mercury/mercuryUV.jpeg");

  const geometery = new THREE.SphereGeometry(sunSize, 64, 64);
  const material = new THREE.MeshStandardMaterial({
    map: mercuryUVMap,
  });
  const mercuryMesh = new THREE.Mesh(geometery, material);

  mercuryMesh.position.x = objectProperties.mercury.position;
  mercuryMesh.rotation.z = objectProperties.mercury.tilt;
  mercuryMesh.scale.set(
    objectProperties.mercury.scale,
    objectProperties.mercury.scale,
    objectProperties.mercury.scale
  );
  return mercuryMesh;
};

export const uranus = () => {
  const uranusUVMap = textureLoader.load("textures/uranus/uranusUV.jpeg");

  const geometery = new THREE.SphereGeometry(sunSize, 64, 64);
  const material = new THREE.MeshStandardMaterial({
    map: uranusUVMap,
  });
  const uranusMesh = new THREE.Mesh(geometery, material);

  uranusMesh.position.x = objectProperties.uranus.position;
  uranusMesh.rotation.z = objectProperties.uranus.tilt;
  uranusMesh.scale.set(
    objectProperties.uranus.scale,
    objectProperties.uranus.scale,
    objectProperties.uranus.scale
  );
  return uranusMesh;
};

export const neptune = () => {
  const neptuneUVMap = textureLoader.load("textures/neptune/neptuneUV.jpeg");

  const geometery = new THREE.SphereGeometry(sunSize, 64, 64);
  const material = new THREE.MeshStandardMaterial({
    map: neptuneUVMap,
  });
  const neptuneMesh = new THREE.Mesh(geometery, material);

  neptuneMesh.position.x = objectProperties.neptune.position;
  neptuneMesh.rotation.z = objectProperties.neptune.tilt;
  neptuneMesh.scale.set(
    objectProperties.neptune.scale,
    objectProperties.neptune.scale,
    objectProperties.neptune.scale
  );
  return neptuneMesh;
};
export const venus = () => {
  const venusUVMap = textureLoader.load("textures/venus/venusUV.jpeg");

  const geometery = new THREE.SphereGeometry(sunSize, 64, 64);
  const material = new THREE.MeshStandardMaterial({
    map: venusUVMap,
  });
  const venusMesh = new THREE.Mesh(geometery, material);

  venusMesh.position.x = objectProperties.venus.position;
  venusMesh.rotation.z = objectProperties.venus.tilt;
  venusMesh.scale.set(
    objectProperties.venus.scale,
    objectProperties.venus.scale,
    objectProperties.venus.scale
  );
  return venusMesh;
};
