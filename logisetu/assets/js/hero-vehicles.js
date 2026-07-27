/**
 * Procedural vehicle geometry for the hero scene.
 *
 * All original, built from primitives. Each builder returns a Group whose
 * origin sits on the ground at the vehicle's centre and which faces +Z, so the
 * scene can place and orient them uniformly.
 */

import * as THREE from 'three';

const PAINT = { roughness: 0.42, metalness: 0.5 };
const GLASS = {
  color: 0x8fc4f0,
  roughness: 0.08,
  metalness: 0.9,
  emissive: 0x1d4468,
  emissiveIntensity: 0.5,
};

const CONTAINER_COLORS = [
  0x2f4c78, 0x3d5a86, 0xc9a227, 0x54739f,
  0xb8452f, 0x1e355b, 0x6d8cb5, 0xd8dee8,
];

function mat(color, extra = {}) {
  return new THREE.MeshStandardMaterial({ color, ...PAINT, ...extra });
}

function box(w, h, d, material, x = 0, y = 0, z = 0) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

/** Shared wheel geometry — cylinders laid on their side. */
const wheelGeometry = new THREE.CylinderGeometry(1, 1, 1, 18);
wheelGeometry.rotateZ(Math.PI / 2);

function wheel(radius, width, material, x, y, z) {
  const mesh = new THREE.Mesh(wheelGeometry, material);
  mesh.scale.set(width, radius, radius);
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  return mesh;
}

/* ------------------------------------------------------------- trucks --- */

export function buildTruck({ cabColor = 0xc9a227, trailerColor = 0xe8edf5 } = {}) {
  const group = new THREE.Group();
  const tyre = new THREE.MeshStandardMaterial({ color: 0x11182a, roughness: 0.92 });
  const glass = new THREE.MeshStandardMaterial(GLASS);
  const chrome = mat(0xb9c6d8, { roughness: 0.2, metalness: 0.95 });

  const cab = box(2.3, 2.3, 2.9, mat(cabColor), 0, 1.75, 3.5);
  group.add(cab);
  group.add(box(2.34, 0.9, 0.16, glass, 0, 2.35, 5.0));
  group.add(box(2.1, 0.5, 0.3, chrome, 0, 0.85, 5.05));

  // Sleeper + exhaust stacks.
  group.add(box(2.2, 1.5, 1.0, mat(cabColor), 0, 2.2, 1.9));
  for (const x of [-1.0, 1.0]) {
    const stack = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 2.2, 10), chrome);
    stack.position.set(x, 2.6, 2.0);
    group.add(stack);
  }

  group.add(box(2.6, 2.9, 8.6, mat(trailerColor, { metalness: 0.25, roughness: 0.6 }), 0, 2.6, -3.4));
  group.add(box(2.2, 0.35, 8.2, mat(0x2b3648), 0, 1.05, -3.4));

  for (const [x, y, z] of [[-1.25, 0.62, 4.2], [1.25, 0.62, 4.2],
                           [-1.3, 0.62, -5.6], [1.3, 0.62, -5.6],
                           [-1.3, 0.62, -6.9], [1.3, 0.62, -6.9]]) {
    group.add(wheel(0.62, 0.36, tyre, x, y, z));
  }

  for (const x of [-0.85, 0.85]) {
    const lamp = new THREE.Mesh(
      new THREE.SphereGeometry(0.19, 12, 12),
      new THREE.MeshBasicMaterial({ color: 0xfff4d6 })
    );
    lamp.position.set(x, 1.35, 5.02);
    group.add(lamp);
  }

  const beam = new THREE.PointLight(0xffe9b0, 9, 16, 2);
  beam.position.set(0, 1.5, 6);
  group.add(beam);

  return group;
}

/* -------------------------------------------------------------- train --- */

export function buildTrain(cars = 4) {
  const group = new THREE.Group();
  const tyre = new THREE.MeshStandardMaterial({ color: 0x0f1626, roughness: 0.9 });
  const glass = new THREE.MeshStandardMaterial(GLASS);

  const loco = new THREE.Group();
  loco.add(box(3.0, 3.0, 9.0, mat(0x1e355b), 0, 2.5, 0));
  loco.add(box(2.7, 1.4, 2.4, mat(0x24406b), 0, 4.4, 2.4));
  loco.add(box(2.74, 0.85, 0.14, glass, 0, 4.5, 3.62));
  loco.add(box(3.1, 0.5, 9.2, mat(0xc9a227), 0, 1.15, 0));

  const headlamp = new THREE.Mesh(
    new THREE.SphereGeometry(0.3, 14, 14),
    new THREE.MeshBasicMaterial({ color: 0xfff6dd })
  );
  headlamp.position.set(0, 3.1, 4.6);
  loco.add(headlamp);
  const lampLight = new THREE.PointLight(0xffeec4, 12, 22, 2);
  lampLight.position.set(0, 3.1, 5.4);
  loco.add(lampLight);

  for (const z of [-3.2, 3.2]) {
    for (const x of [-1.35, 1.35]) loco.add(wheel(0.62, 0.3, tyre, x, 0.62, z));
  }
  group.add(loco);

  // Flat wagons carrying containers, the way a freight corridor actually runs.
  for (let i = 0; i < cars; i++) {
    const car = new THREE.Group();
    car.position.z = -11 - i * 11;

    car.add(box(3.0, 0.7, 9.6, mat(0x2b3648), 0, 1.15, 0));
    for (const z of [-3.4, 3.4]) {
      for (const x of [-1.35, 1.35]) car.add(wheel(0.55, 0.28, tyre, x, 0.55, z));
    }

    const colour = CONTAINER_COLORS[(i * 3) % CONTAINER_COLORS.length];
    car.add(box(2.7, 2.5, 8.6, mat(colour, { metalness: 0.35, roughness: 0.55 }), 0, 2.75, 0));

    group.add(car);
  }

  return group;
}

/* --------------------------------------------------------------- ship --- */

export function buildShip() {
  const group = new THREE.Group();
  const hull = mat(0x16294a, { roughness: 0.65, metalness: 0.3 });
  const deck = mat(0xb8452f, { roughness: 0.7, metalness: 0.2 });

  // Hull: a tapered box plus a bow wedge.
  const body = box(9, 5.4, 40, hull, 0, 2.7, 0);
  group.add(body);

  const bow = new THREE.Mesh(new THREE.ConeGeometry(4.5, 10, 4), hull);
  bow.rotation.x = -Math.PI / 2;
  bow.rotation.y = Math.PI / 4;
  bow.position.set(0, 2.7, 24);
  bow.scale.set(1, 1, 0.62);
  bow.castShadow = true;
  group.add(bow);

  group.add(box(9.6, 0.7, 40, deck, 0, 5.5, 0));

  // Container stacks across the deck.
  let n = 0;
  for (let z = -15; z <= 16; z += 4.4) {
    for (let x = -3; x <= 3; x += 3) {
      const height = 2 + ((n * 7) % 3);
      for (let level = 0; level < height; level++) {
        group.add(box(2.6, 1.3, 4.0,
          mat(CONTAINER_COLORS[(n + level * 5) % CONTAINER_COLORS.length],
              { metalness: 0.3, roughness: 0.6 }),
          x, 6.6 + level * 1.34, z));
      }
      n++;
    }
  }

  // Superstructure aft.
  group.add(box(7.5, 7, 6, mat(0xe3e8f0, { metalness: 0.2, roughness: 0.55 }), 0, 9.4, -15));
  group.add(box(7.6, 0.6, 6.1, mat(0x24406b), 0, 13.2, -15));
  const funnel = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.2, 3.4, 14), mat(0xc9a227));
  funnel.position.set(0, 15, -16.5);
  funnel.castShadow = true;
  group.add(funnel);

  for (let i = 0; i < 3; i++) {
    group.add(box(7.6, 0.5, 0.12, new THREE.MeshStandardMaterial(GLASS), 0, 8.2 + i * 2, -11.95));
  }

  return group;
}

/* -------------------------------------------------------------- plane --- */

export function buildPlane() {
  const group = new THREE.Group();
  const shell = mat(0xeef2f8, { roughness: 0.35, metalness: 0.45 });
  const accent = mat(0xc9a227);
  const engine = mat(0x33415c, { roughness: 0.4, metalness: 0.7 });

  const fuselage = new THREE.Mesh(new THREE.CapsuleGeometry(1.5, 15, 8, 18), shell);
  fuselage.rotation.x = Math.PI / 2;
  fuselage.castShadow = true;
  group.add(fuselage);

  const nose = new THREE.Mesh(new THREE.SphereGeometry(1.5, 18, 14), shell);
  nose.position.z = 8.6;
  nose.scale.set(1, 1, 1.5);
  group.add(nose);

  // Swept wings.
  for (const side of [-1, 1]) {
    const wing = new THREE.Mesh(new THREE.BoxGeometry(15, 0.45, 4.4), shell);
    wing.position.set(side * 8, 0.1, -0.6);
    wing.rotation.y = side * -0.34;
    wing.rotation.z = side * 0.05;
    wing.castShadow = true;
    group.add(wing);

    const pod = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.75, 3.4, 14), engine);
    pod.rotation.x = Math.PI / 2;
    pod.position.set(side * 6.5, -0.85, 0.9);
    pod.castShadow = true;
    group.add(pod);
  }

  // Tail.
  const fin = new THREE.Mesh(new THREE.BoxGeometry(0.4, 4.6, 3.6), accent);
  fin.position.set(0, 2.6, -7.4);
  fin.rotation.x = -0.28;
  fin.castShadow = true;
  group.add(fin);

  for (const side of [-1, 1]) {
    const tail = new THREE.Mesh(new THREE.BoxGeometry(5, 0.3, 1.8), shell);
    tail.position.set(side * 2.4, 0.9, -7.6);
    tail.rotation.y = side * -0.3;
    group.add(tail);
  }

  const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.5, 13), accent);
  stripe.position.set(1.45, 0.3, 0);
  group.add(stripe);

  return group;
}

/**
 * Tapered motion streak trailing a vehicle — the "whoosh" that sells speed in
 * a still frame. Built along -Z so it can be parented straight to a vehicle.
 */
export function buildTrail(length, width, color, opacity = 0.5) {
  const shape = new THREE.PlaneGeometry(width, length, 1, 24);
  const position = shape.attributes.position;
  const alpha = new Float32Array(position.count);

  for (let i = 0; i < position.count; i++) {
    // Fade and pinch toward the tail.
    const t = (position.getY(i) + length / 2) / length;
    alpha[i] = Math.pow(t, 1.7);
    position.setX(i, position.getX(i) * (0.25 + t * 0.75));
  }
  shape.setAttribute('aAlpha', new THREE.BufferAttribute(alpha, 1));

  const material = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
  });

  // Per-vertex fade, injected into the stock basic shader.
  material.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader
      .replace('void main() {', 'attribute float aAlpha;\nvarying float vAlpha;\nvoid main() {')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\n  vAlpha = aAlpha;');
    shader.fragmentShader = shader.fragmentShader
      .replace('void main() {', 'varying float vAlpha;\nvoid main() {')
      .replace('#include <opaque_fragment>',
        'diffuseColor.a *= vAlpha;\n#include <opaque_fragment>');
  };

  const mesh = new THREE.Mesh(shape, material);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.z = -length / 2;
  return mesh;
}
