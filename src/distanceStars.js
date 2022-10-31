import * as THREE from "three";

export const distantStars = (scene) => {
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load("textures/distantStars/8.png");
  const particlesCount = 400;
  const objectDistance = 6;
  const positions = new Float32Array(particlesCount * 3);

  for (let i = 0; i < particlesCount; i++) {
    positions[i * 3 + 0] = (Math.random() - 0.5) * 30;
    positions[i * 3 + 1] =
      objectDistance * 0.5 - Math.random() * objectDistance * 3;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 30;
  }

  const particlesGeometry = new THREE.BufferGeometry();
  particlesGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
  );

  // Material
  const particlesMaterial = new THREE.PointsMaterial({
    color: new THREE.Color(0xffffff),
    sizeAttenuation: true,
    size: 0.1,
    transparent: true,
    alphaMap: texture,
    alphaTest: 0.5,
  });

  // Points
  const particles = new THREE.Points(particlesGeometry, particlesMaterial);

  return particles;
};
