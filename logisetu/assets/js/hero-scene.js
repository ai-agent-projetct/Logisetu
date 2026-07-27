/**
 * The cinematic hero scene: all four freight modes in one frame.
 *
 * A container ship crosses open water, a cargo plane banks overhead trailing
 * vapour, a freight train runs the embankment and trucks work the highway —
 * the multimodal story the site is about, in a single shot.
 *
 * Geometry is procedural (see hero-vehicles.js) and lighting is real-time with
 * soft shadows, so nothing here depends on external 3D assets.
 *
 * Each page sets `body[data-scene]` to pick a camera framing:
 *   yard     — wide establishing shot            (home)
 *   terminal — low and close on the port         (solutions)
 *   corridor — down the highway, traffic-forward (insights)
 *   grid     — high and calm                     (about, contact)
 *   orbit    — raised, angled toward the horizon (network)
 */

import * as THREE from 'three';
import { Stage, PALETTE, prefersReducedMotion } from './stage.js';
import { buildTruck, buildTrain, buildShip, buildPlane, buildTrail } from './hero-vehicles.js';

const SHOTS = {
  yard:     { pos: [26, 15, 46], look: [0, 6, -6],  fov: 40 },
  terminal: { pos: [34, 9, 30],  look: [2, 7, -12], fov: 44 },
  corridor: { pos: [14, 7, 40],  look: [6, 3, -24], fov: 46 },
  grid:     { pos: [22, 26, 52], look: [0, 4, -10], fov: 38 },
  orbit:    { pos: [30, 19, 44], look: [0, 9, -14], fov: 40 },
};

const WATER_LEVEL = 0;
const ROAD_Z = 26;
const RAIL_Z = 6;

export function createHeroScene(host, mode = 'yard') {
  const shot = SHOTS[mode] ?? SHOTS.yard;
  const stage = new Stage(host, { fov: shot.fov, clearColor: 0x0c203f });
  const { scene, camera, renderer } = stage;

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMappingExposure = 1.15;

  scene.fog = new THREE.FogExp2(0x122c52, 0.0075);

  camera.position.set(...shot.pos);
  const lookTarget = new THREE.Vector3(...shot.look);
  camera.lookAt(lookTarget);

  const world = new THREE.Group();
  scene.add(world);

  const environment = buildEnvironment(renderer, scene);
  buildLighting(scene);
  const water = buildWater(world);
  buildLand(world);

  const ship = placeShip(world);
  const plane = placePlane(world);
  const train = placeTrain(world);
  const trucks = placeTrucks(world);
  const dust = buildHaze(world);

  /* ------------------------------------------------------------ motion --- */

  const basePos = camera.position.clone();
  let scrollProgress = 0;

  const readScroll = () => {
    const rect = host.getBoundingClientRect();
    const span = rect.height + window.innerHeight;
    scrollProgress = THREE.MathUtils.clamp((window.innerHeight - rect.top) / span, 0, 1);
  };
  readScroll();
  window.addEventListener('scroll', readScroll, { passive: true });

  stage.onFrame((elapsed, delta) => {
    const rate = prefersReducedMotion ? 0 : 1;
    const step = delta * rate;

    // Ship: forward crawl plus a slow roll and pitch on the swell.
    ship.position.z -= step * 1.6;
    if (ship.position.z < -120) ship.position.z = 120;
    ship.rotation.z = Math.sin(elapsed * 0.45) * 0.014;
    ship.rotation.x = Math.sin(elapsed * 0.32 + 1) * 0.009;
    ship.position.y = Math.sin(elapsed * 0.5) * 0.35;

    // Plane: banked circuit across the sky.
    const t = (elapsed * 0.045) % 1;
    const angle = t * Math.PI * 2;
    plane.group.position.set(Math.cos(angle) * 95, 46 + Math.sin(angle * 2) * 5, Math.sin(angle) * 95);
    plane.group.rotation.y = -angle + Math.PI / 2;
    plane.group.rotation.z = 0.24;

    // Train: runs the embankment and wraps.
    train.position.z -= step * 11;
    if (train.position.z < -190) train.position.z = 150;

    for (const truck of trucks) {
      truck.group.position.z -= step * truck.speed;
      if (truck.group.position.z < -150) truck.group.position.z = 140;
    }

    // Water: scroll the normal map to fake a moving surface.
    if (water.material.map) {
      water.material.map.offset.y = (elapsed * 0.012) % 1;
      water.material.map.offset.x = Math.sin(elapsed * 0.05) * 0.02;
    }

    dust.rotation.y = elapsed * 0.006 * rate;

    // Camera: pointer parallax plus a scroll-driven lift.
    camera.position.x += (basePos.x + stage.pointer.x * 4.5 - camera.position.x) * 0.035;
    camera.position.y += (basePos.y + stage.pointer.y * -2.2 + scrollProgress * 9 - camera.position.y) * 0.035;
    camera.position.z += (basePos.z - scrollProgress * 10 - camera.position.z) * 0.03;
    camera.lookAt(lookTarget);
  });

  stage.dispose = ((original) => () => {
    window.removeEventListener('scroll', readScroll);
    environment.target.dispose();
    environment.pmrem.dispose();
    original.call(stage);
  })(stage.dispose);

  return stage;
}

/* ------------------------------------------------------------ lighting --- */

/**
 * Image-based lighting from a procedural sky gradient.
 *
 * This is not optional polish: a metallic PBR material reflects its
 * environment, so without `scene.environment` every metal surface here —
 * water, rails, hulls, glass — renders essentially black no matter how many
 * lights are added. The gradient is generated rather than loaded so the site
 * stays self-contained.
 */
function buildEnvironment(renderer, scene) {
  const width = 32;
  const height = 64;
  const data = new Uint8Array(width * height * 4);

  const zenith = [0x1a, 0x3c, 0x74];
  const horizon = [0x9d, 0xb9, 0xdc];
  const ground = [0x14, 0x25, 0x42];

  for (let y = 0; y < height; y++) {
    const v = y / (height - 1);          // 0 = zenith, 1 = nadir
    let colour;

    if (v < 0.48) {
      const k = Math.pow(v / 0.48, 0.7);
      colour = zenith.map((c, i) => c + (horizon[i] - c) * k);
    } else {
      const k = Math.min((v - 0.48) / 0.16, 1);
      colour = horizon.map((c, i) => c + (ground[i] - c) * k);
    }

    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      data[i] = colour[0];
      data[i + 1] = colour[1];
      data[i + 2] = colour[2];
      data[i + 3] = 255;
    }
  }

  const gradient = new THREE.DataTexture(data, width, height, THREE.RGBAFormat);
  gradient.mapping = THREE.EquirectangularReflectionMapping;
  gradient.colorSpace = THREE.SRGBColorSpace;
  gradient.needsUpdate = true;

  const pmrem = new THREE.PMREMGenerator(renderer);
  pmrem.compileEquirectangularShader();

  // Keep the render target alive: disposing the generator here would tear down
  // the target backing the texture it just handed back, leaving an environment
  // that silently contributes nothing.
  const target = pmrem.fromEquirectangular(gradient);
  scene.environment = target.texture;

  gradient.dispose();
  return { pmrem, target };
}

function buildLighting(scene) {
  scene.add(new THREE.HemisphereLight(0x9fc4f0, 0x16294a, 1.15));
  scene.add(new THREE.AmbientLight(0x7796c4, 0.35));

  // Low warm key, angled for long shadows across the water.
  const key = new THREE.DirectionalLight(0xffe8bd, 2.6);
  key.position.set(-60, 55, 40);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.camera.near = 1;
  key.shadow.camera.far = 260;
  key.shadow.camera.left = -110;
  key.shadow.camera.right = 110;
  key.shadow.camera.top = 110;
  key.shadow.camera.bottom = -110;
  key.shadow.bias = -0.0006;
  key.shadow.normalBias = 0.03;
  scene.add(key);

  const fill = new THREE.DirectionalLight(0x6f9fe0, 0.75);
  fill.position.set(50, 26, -40);
  scene.add(fill);

  const rim = new THREE.DirectionalLight(PALETTE.goldLit, 0.8);
  rim.position.set(20, 12, -70);
  scene.add(rim);
}

/* -------------------------------------------------------------- world --- */

function buildWater(world) {
  const geometry = new THREE.PlaneGeometry(700, 700, 90, 90);
  geometry.rotateX(-Math.PI / 2);

  // Gentle standing swell baked into the vertices.
  const position = geometry.attributes.position;
  for (let i = 0; i < position.count; i++) {
    const x = position.getX(i);
    const z = position.getZ(i);
    position.setY(i, Math.sin(x * 0.06) * 0.28 + Math.cos(z * 0.045) * 0.22);
  }
  geometry.computeVertexNormals();

  const water = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({
    color: 0x0e2444,
    roughness: 0.22,
    metalness: 0.65,
  }));
  water.position.y = WATER_LEVEL;
  water.receiveShadow = true;
  world.add(water);

  return water;
}

/** Quay, embankment and highway — the strip of land the freight runs along. */
function buildLand(world) {
  const concrete = new THREE.MeshStandardMaterial({ color: 0x1d3358, roughness: 0.85, metalness: 0.15 });
  const asphalt = new THREE.MeshStandardMaterial({ color: 0x16223b, roughness: 0.7, metalness: 0.25 });

  const quay = new THREE.Mesh(new THREE.BoxGeometry(120, 3, 420), concrete);
  quay.position.set(34, 1.5, 0);
  quay.receiveShadow = true;
  quay.castShadow = true;
  world.add(quay);

  const road = new THREE.Mesh(new THREE.BoxGeometry(17, 0.3, 420), asphalt);
  road.position.set(ROAD_Z, 3.15, 0);
  road.receiveShadow = true;
  world.add(road);

  // Lane dashes.
  const dashMaterial = new THREE.MeshBasicMaterial({ color: 0xd9e2f0, transparent: true, opacity: 0.55 });
  for (let z = -200; z < 200; z += 12) {
    const dash = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 5), dashMaterial);
    dash.rotation.x = -Math.PI / 2;
    dash.position.set(ROAD_Z, 3.32, z);
    world.add(dash);
  }

  // Rail bed with sleepers and rails.
  const ballast = new THREE.Mesh(new THREE.BoxGeometry(9, 1.2, 420), concrete);
  ballast.position.set(RAIL_Z, 3.6, 0);
  ballast.receiveShadow = true;
  world.add(ballast);

  const sleeper = new THREE.MeshStandardMaterial({ color: 0x2a3a55, roughness: 0.9 });
  for (let z = -200; z < 200; z += 3.4) {
    const tie = new THREE.Mesh(new THREE.BoxGeometry(6.2, 0.24, 0.9), sleeper);
    tie.position.set(RAIL_Z, 4.25, z);
    world.add(tie);
  }

  const railMaterial = new THREE.MeshStandardMaterial({ color: 0x9fb2cc, roughness: 0.3, metalness: 0.9 });
  for (const offset of [-1.35, 1.35]) {
    const rail = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.34, 420), railMaterial);
    rail.position.set(RAIL_Z + offset, 4.5, 0);
    rail.castShadow = true;
    world.add(rail);
  }

  // Quayside gantry cranes.
  const steel = new THREE.MeshStandardMaterial({ color: 0x53749f, roughness: 0.4, metalness: 0.8 });
  const accent = new THREE.MeshStandardMaterial({
    color: PALETTE.gold, roughness: 0.35, metalness: 0.6,
    emissive: PALETTE.gold, emissiveIntensity: 0.16,
  });

  for (let i = 0; i < 3; i++) {
    const crane = new THREE.Group();
    crane.position.set(20, 3, -60 + i * 62);

    for (const [x, z] of [[-1, -7], [9, -7], [-1, 7], [9, 7]]) {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(1.1, 30, 1.1), steel);
      leg.position.set(x, 15, z);
      leg.castShadow = true;
      crane.add(leg);
    }

    const beam = new THREE.Mesh(new THREE.BoxGeometry(52, 1.8, 2.4), steel);
    beam.position.set(-12, 30, 0);
    beam.castShadow = true;
    crane.add(beam);

    const trolley = new THREE.Mesh(new THREE.BoxGeometry(3.4, 1.6, 3), accent);
    trolley.position.set(-20 + (i * 7), 28.4, 0);
    crane.add(trolley);

    world.add(crane);
  }
}

/* ----------------------------------------------------------- vehicles --- */

function placeShip(world) {
  const ship = buildShip();
  ship.position.set(-26, 2.4, 20);
  ship.rotation.y = Math.PI;
  world.add(ship);

  // Wake spreading behind the hull.
  const wake = buildTrail(90, 26, 0xbcd8f5, 0.22);
  wake.position.set(0, -1.6, -22);
  ship.add(wake);

  return ship;
}

function placePlane(world) {
  const group = new THREE.Group();
  const plane = buildPlane();
  group.add(plane);

  // Twin vapour trails off the wingtips.
  for (const side of [-1, 1]) {
    const vapour = buildTrail(150, 3.4, 0xdcebff, 0.3);
    vapour.position.set(side * 8, 0, -12);
    vapour.rotation.x = -Math.PI / 2;
    group.add(vapour);
  }

  world.add(group);
  return { group, plane };
}

function placeTrain(world) {
  const train = buildTrain(5);
  train.position.set(RAIL_Z, 4.4, 60);
  world.add(train);
  return train;
}

function placeTrucks(world) {
  const trucks = [];
  const liveries = [
    { cabColor: 0xc9a227, trailerColor: 0xeef2f8 },
    { cabColor: 0x2f4c78, trailerColor: 0xdbe3ee },
    { cabColor: 0xb8452f, trailerColor: 0xeef2f8 },
    { cabColor: 0x1e355b, trailerColor: 0xc9a227 },
  ];

  for (let i = 0; i < 4; i++) {
    const group = buildTruck(liveries[i % liveries.length]);
    const lane = i % 2 === 0 ? -3.6 : 3.6;
    group.position.set(ROAD_Z + lane, 3.3, 90 - i * 46);
    world.add(group);

    const trail = buildTrail(26, 2.4, PALETTE.goldLit, 0.28);
    trail.position.set(0, -2.4, -9);
    group.add(trail);

    trucks.push({ group, speed: 15 + Math.random() * 7 });
  }

  return trucks;
}

/** Fine airborne haze so the fog has some sparkle in it. */
function buildHaze(world) {
  const count = 700;
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 340;
    positions[i * 3 + 1] = Math.random() * 70;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 340;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const points = new THREE.Points(geometry, new THREE.PointsMaterial({
    color: 0xdCE8FA,
    size: 0.26,
    transparent: true,
    opacity: 0.35,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  }));
  world.add(points);

  return points;
}
