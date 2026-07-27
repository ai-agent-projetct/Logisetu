/**
 * In-page 3D data visuals — the 3D replacements for the flat diagrams
 * in the original design.
 *
 *   createGlobe(host)   — India / Dubai / London route globe
 *   createCluster(host) — demand clusters feeding an India-wide hub
 *   createPhases(host)  — phased capacity build-out bars
 */

import * as THREE from 'three';
import { Stage, PALETTE, prefersReducedMotion, latLonToVector3, arcBetween } from './stage.js';
import { MODES, ROUTES, PLACES } from './routes.js';

/* ============================================================== GLOBE === */

const GLOBE_RADIUS = 1.5;

/**
 * Earth with LogiSetu's multimodal freight network drawn on it.
 *
 * Geography comes from a Natural Earth texture (see .tools/rasterise-earth.py),
 * so coastlines and borders are real. Routes follow actual lanes — sea freight
 * tracks the Arabian Sea / Suez / Gibraltar passage rather than cutting across
 * land, and rail follows the Dedicated Freight Corridor alignments.
 */
export function createGlobe(host) {
  const dark = host.dataset.globeTheme !== 'light';

  const stage = new Stage(host, { fov: 38, alpha: true, maxDpr: 2 });
  const { scene, camera } = stage;

  // Filmic tone mapping would shift each route away from its declared colour,
  // so the HTML legend swatches would no longer match the lines on screen.
  // This is a data visualisation: the colours need to be literal.
  stage.renderer.toneMapping = THREE.NoToneMapping;

  camera.position.set(0, 0.3, 7);
  camera.lookAt(0, 0, 0);

  scene.add(new THREE.HemisphereLight(0xbcd4f5, 0x0a1a33, dark ? 1.15 : 1.5));
  const key = new THREE.DirectionalLight(0xffffff, dark ? 1.5 : 1.8);
  key.position.set(-3, 2.5, 4.5);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x6f9fe0, 0.6);
  rim.position.set(4, -1, -3);
  scene.add(rim);

  const globe = new THREE.Group();
  // Open on the India–Gulf–Europe corridor, which is where the network lives.
  globe.rotation.y = -1.15;
  globe.rotation.x = 0.22;
  scene.add(globe);

  /* -- the planet ------------------------------------------------------- */

  const texture = new THREE.TextureLoader().load(earthTextureUrl());
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;

  globe.add(new THREE.Mesh(
    new THREE.SphereGeometry(GLOBE_RADIUS, 96, 64),
    new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.88,
      metalness: 0.06,
    })
  ));

  // Atmospheric rim, drawn from the inside of a slightly larger shell.
  globe.add(new THREE.Mesh(
    new THREE.SphereGeometry(GLOBE_RADIUS * 1.055, 48, 32),
    new THREE.MeshBasicMaterial({
      color: dark ? 0x5aa0e8 : 0x7fb0ea,
      transparent: true,
      opacity: 0.16,
      side: THREE.BackSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
  ));

  /* -- routes ----------------------------------------------------------- */

  const traffic = [];
  const routeGroup = new THREE.Group();
  globe.add(routeGroup);

  for (const route of ROUTES) {
    const mode = MODES[route.mode];
    if (!mode) continue;

    const points = routePoints(route.waypoints, mode);
    const curve = new THREE.CatmullRomCurve3(points);

    const segments = Math.min(Math.max(points.length * 2, 24), 220);

    // Soft halo so short regional corridors still carry weight without being
    // drawn as fat pipes. BackSide only: the near faces would otherwise blend
    // additively over the opaque core and shift it off its declared colour, so
    // the halo is confined to the silhouette around the line.
    routeGroup.add(new THREE.Mesh(
      new THREE.TubeGeometry(curve, segments, mode.glow, 6, false),
      new THREE.MeshBasicMaterial({
        color: mode.color,
        transparent: true,
        opacity: 0.20,
        side: THREE.BackSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
    ));

    // Opaque core: at globe scale these lines are only a pixel or two wide, so
    // any background bleed muddies the colour past recognising it.
    routeGroup.add(new THREE.Mesh(
      new THREE.TubeGeometry(curve, segments, mode.tube, 6, false),
      new THREE.MeshBasicMaterial({ color: mode.color })
    ));

    // Cargo in transit.
    const cargo = new THREE.Mesh(
      new THREE.SphereGeometry(mode.marker, 12, 12),
      new THREE.MeshBasicMaterial({ color: mode.color })
    );
    routeGroup.add(cargo);

    const halo = new THREE.Mesh(
      new THREE.SphereGeometry(mode.marker * 2.1, 12, 12),
      new THREE.MeshBasicMaterial({
        color: mode.color,
        transparent: true,
        opacity: 0.28,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
    );
    routeGroup.add(halo);

    traffic.push({ curve, cargo, halo, speed: mode.speed, offset: Math.random() });
  }

  /* -- places ----------------------------------------------------------- */

  const markers = [];

  for (const place of PLACES) {
    const isHub = place.tier === 'hub';
    const position = latLonToVector3(place.lat, place.lon, GLOBE_RADIUS * 1.014);

    const dot = new THREE.Mesh(
      new THREE.SphereGeometry(isHub ? 0.03 : 0.016, 16, 16),
      new THREE.MeshBasicMaterial({ color: isHub ? PALETTE.goldLit : 0xdce6f5 })
    );
    dot.position.copy(position);
    globe.add(dot);

    if (!isHub) {
      markers.push({ dot, ring: null, label: null });
      continue;
    }

    const ring = new THREE.Mesh(
      new THREE.RingGeometry(0.05, 0.062, 32),
      new THREE.MeshBasicMaterial({
        color: PALETTE.goldLit,
        transparent: true,
        opacity: 0.75,
        side: THREE.DoubleSide,
        depthWrite: false,
      })
    );
    ring.position.copy(position);
    ring.lookAt(position.clone().multiplyScalar(2));
    globe.add(ring);

    const label = stage.addLabel(
      position,
      `<span class="gl-label-name">${escapeHTML(place.name)}</span>` +
      `<span class="gl-label-role">${escapeHTML(place.role ?? '')}</span>`,
      `gl-label--pin${dark ? ' gl-label--dark' : ''}`
    );
    label.anchor = dot;

    markers.push({ dot, ring, label, phase: Math.random() * Math.PI * 2 });
  }

  buildLegend(host, dark);

  /* -- framing ---------------------------------------------------------- */

  // Pull the camera back far enough that the globe never crops, accounting for
  // whichever of the two field-of-view axes is tighter.
  stage.onResize = (w, h) => {
    const fit = GLOBE_RADIUS * 1.34;
    const vFov = THREE.MathUtils.degToRad(camera.fov);
    const hFov = 2 * Math.atan(Math.tan(vFov / 2) * (w / h));

    const distance = Math.max(fit / Math.sin(vFov / 2), fit / Math.sin(hFov / 2));
    camera.position.setLength(distance);
    camera.lookAt(0, 0, 0);
  };
  stage.resize();

  /* -- motion ----------------------------------------------------------- */

  const drag = attachDragRotate(host, globe);
  const toCamera = new THREE.Vector3();
  const worldPos = new THREE.Vector3();

  stage.onFrame((elapsed, delta) => {
    const speed = prefersReducedMotion ? 0 : 1;

    if (!drag.active) globe.rotation.y += delta * 0.055 * speed;
    drag.update();

    toCamera.copy(camera.position).sub(globe.position).normalize();

    for (const marker of markers) {
      if (marker.ring) {
        const scale = 1 + Math.sin(elapsed * 1.6 + marker.phase) * 0.3;
        marker.ring.scale.setScalar(scale);
        marker.ring.material.opacity = 0.8 - (scale - 1) * 1.6;
      }

      if (marker.label) {
        // Fade a label out as its city rotates around the far side.
        marker.dot.getWorldPosition(worldPos);
        const facing = worldPos.normalize().dot(toCamera);
        marker.label.opacity = THREE.MathUtils.clamp((facing - 0.12) * 3.5, 0, 1);
      }
    }

    for (const item of traffic) {
      const t = (elapsed * item.speed + item.offset) % 1;
      item.curve.getPointAt(t, item.cargo.position);
      item.halo.position.copy(item.cargo.position);
      item.halo.material.opacity = 0.2 + Math.sin(elapsed * 3 + item.offset * 6) * 0.1;
    }
  });

  return stage;
}

/** Resolve the Earth texture next to this module, cache-buster included. */
function earthTextureUrl() {
  return new URL('../img/earth-map.png', import.meta.url).href;
}

/**
 * Build a route polyline that sits on (or above) the sphere.
 *
 * Points are interpolated between consecutive waypoints and re-normalised, so
 * every leg follows the surface. `lift` bows the whole route outward at its
 * midpoint, which is what separates an air corridor from a shipping lane.
 */
function routePoints(waypoints, { lift = 0, hug = 0.01 } = {}) {
  const nodes = waypoints.map(([lat, lon]) => latLonToVector3(lat, lon, 1));

  const legs = [];
  let total = 0;
  for (let i = 0; i < nodes.length - 1; i++) {
    const angle = nodes[i].angleTo(nodes[i + 1]);
    legs.push(angle);
    total += angle;
  }
  if (total === 0) return nodes.map((n) => n.multiplyScalar(GLOBE_RADIUS * (1 + hug)));

  const points = [];
  let travelled = 0;

  for (let i = 0; i < nodes.length - 1; i++) {
    // Denser sampling on longer legs keeps curvature smooth without wasting
    // vertices on short hops.
    const steps = Math.max(6, Math.round((legs[i] / Math.PI) * 160));

    for (let s = i === 0 ? 0 : 1; s <= steps; s++) {
      const f = s / steps;
      const t = (travelled + legs[i] * f) / total;

      const point = nodes[i].clone().lerp(nodes[i + 1], f).normalize();
      const altitude = hug + lift * Math.sin(Math.PI * t);
      points.push(point.multiplyScalar(GLOBE_RADIUS * (1 + altitude)));
    }

    travelled += legs[i];
  }

  return points;
}

/** Colour key for the four transport modes. */
function buildLegend(host, dark) {
  if (host.querySelector('.gl-legend')) return;

  const legend = document.createElement('ul');
  legend.className = `gl-legend${dark ? ' gl-legend--dark' : ''}`;

  for (const mode of Object.values(MODES)) {
    const item = document.createElement('li');
    const swatch = `#${mode.color.toString(16).padStart(6, '0')}`;
    item.innerHTML =
      `<span class="gl-legend-dot" style="background:${swatch}"></span>` +
      `${escapeHTML(mode.label)}`;
    legend.appendChild(item);
  }

  host.appendChild(legend);
}

/* ============================================================ CLUSTER === */

export function createCluster(host) {
  const nodes = readJSON(host, 'nodes', []);

  const stage = new Stage(host, { fov: 40, alpha: true, maxDpr: 2 });
  const { scene, camera } = stage;

  camera.position.set(0, 0.5, 7.9);
  camera.lookAt(0, -0.15, 0);

  scene.add(new THREE.HemisphereLight(0xffffff, 0xc7d2e4, 1.35));
  const key = new THREE.DirectionalLight(0xffffff, 1.1);
  key.position.set(-3, 5, 6);
  scene.add(key);

  const group = new THREE.Group();
  scene.add(group);

  const hubMaterial = new THREE.MeshStandardMaterial({
    color: PALETTE.gold,
    roughness: 0.3,
    metalness: 0.6,
    emissive: PALETTE.gold,
    emissiveIntensity: 0.35,
  });
  const spokeMaterial = new THREE.MeshStandardMaterial({
    color: PALETTE.navy900,
    roughness: 0.42,
    metalness: 0.35,
  });

  const hub = nodes.find((node) => node.hub) ?? nodes[0];
  const hubPosition = new THREE.Vector3(...(hub?.pos ?? [0, 0, 0]));

  const spheres = [];

  nodes.forEach((node, index) => {
    const position = new THREE.Vector3(...node.pos);
    const isHub = Boolean(node.hub);

    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(isHub ? 0.34 : 0.22, 28, 22),
      isHub ? hubMaterial : spokeMaterial
    );
    mesh.position.copy(position);
    group.add(mesh);

    if (isHub) {
      const halo = new THREE.Mesh(
        new THREE.RingGeometry(0.46, 0.54, 44),
        new THREE.MeshBasicMaterial({
          color: PALETTE.gold,
          transparent: true,
          opacity: 0.5,
          side: THREE.DoubleSide,
          depthWrite: false,
        })
      );
      halo.position.copy(position);
      group.add(halo);
      spheres.push({ mesh: halo, halo: true, phase: 0 });
    }

    const label = stage.addLabel(
      position,
      `<span class="gl-label-name">${escapeHTML(node.label)}</span>` +
      `<span class="gl-label-role">${escapeHTML(node.sub ?? '')}</span>`,
      'gl-label--offset'
    );
    label.anchor = mesh;

    spheres.push({ mesh, phase: index * 1.1, base: position.clone() });

    // Curved connector from each demand cluster into the India-wide hub.
    if (!isHub) {
      const mid = position.clone().add(hubPosition).multiplyScalar(0.5);
      mid.z += 0.9;
      mid.y += (position.y - hubPosition.y) * 0.18;

      const curve = new THREE.QuadraticBezierCurve3(position, mid, hubPosition);

      group.add(new THREE.Mesh(
        new THREE.TubeGeometry(curve, 44, 0.028, 8, false),
        new THREE.MeshStandardMaterial({
          color: 0xb9c3d3,
          roughness: 0.7,
          metalness: 0.1,
          transparent: true,
          opacity: 0.85,
        })
      ));

      const pulse = new THREE.Mesh(
        new THREE.SphereGeometry(0.07, 12, 12),
        new THREE.MeshBasicMaterial({ color: PALETTE.gold })
      );
      group.add(pulse);
      spheres.push({ mesh: pulse, curve, speed: 0.2 + Math.random() * 0.12, offset: Math.random() });
    }
  });

  const drag = attachDragRotate(host, group, 0.35);

  stage.onFrame((elapsed, delta) => {
    const speed = prefersReducedMotion ? 0 : 1;

    if (!drag.active) {
      group.rotation.y = Math.sin(elapsed * 0.18) * 0.24 * speed;
      group.rotation.x = Math.sin(elapsed * 0.12) * 0.07 * speed;
    }
    drag.update();

    group.rotation.y += stage.pointer.x * 0.0016;

    for (const item of spheres) {
      if (item.curve) {
        item.mesh.position.copy(item.curve.getPointAt((elapsed * item.speed + item.offset) % 1));
      } else if (item.halo) {
        const scale = 1 + Math.sin(elapsed * 1.4) * 0.16;
        item.mesh.scale.setScalar(scale);
        item.mesh.material.opacity = 0.55 - (scale - 1) * 1.4;
        item.mesh.quaternion.copy(camera.quaternion);
      } else if (item.base) {
        item.mesh.position.y = item.base.y + Math.sin(elapsed * 0.9 + item.phase) * 0.06 * speed;
      }
    }
  });

  return stage;
}

/* ============================================================= PHASES === */

export function createPhases(host) {
  const phases = readJSON(host, 'phases', []);

  const stage = new Stage(host, { fov: 34, alpha: true, maxDpr: 2 });
  const { scene, camera } = stage;

  camera.position.set(0.4, 2.5, 8.6);
  camera.lookAt(0, 0.9, 0);

  scene.add(new THREE.HemisphereLight(0xffffff, 0xd3dbe8, 1.4));
  const key = new THREE.DirectionalLight(0xffffff, 1.25);
  key.position.set(-4, 7, 6);
  scene.add(key);

  const group = new THREE.Group();
  scene.add(group);

  // Reflective floor slab the bars stand on.
  const floor = new THREE.Mesh(
    new THREE.BoxGeometry(7.4, 0.12, 2.2),
    new THREE.MeshStandardMaterial({ color: 0xeef1f7, roughness: 0.8, metalness: 0.05 })
  );
  floor.position.y = -0.06;
  group.add(floor);

  const spacing = 1.62;
  const startX = -((phases.length - 1) * spacing) / 2;
  const bars = [];

  phases.forEach((phase, index) => {
    const active = Boolean(phase.active);
    const height = Math.max(phase.value * 3.2, 0.2);

    const bar = new THREE.Mesh(
      new THREE.BoxGeometry(0.92, 1, 0.92),
      new THREE.MeshStandardMaterial({
        color: active ? PALETTE.navy900 : 0xf2f4f9,
        roughness: active ? 0.42 : 0.72,
        metalness: active ? 0.35 : 0.1,
      })
    );
    bar.position.set(startX + index * spacing, 0, 0);
    bar.scale.y = 0.001;
    group.add(bar);

    if (active) {
      const cap = new THREE.Mesh(
        new THREE.BoxGeometry(0.96, 0.07, 0.96),
        new THREE.MeshStandardMaterial({
          color: PALETTE.gold,
          roughness: 0.3,
          metalness: 0.7,
          emissive: PALETTE.gold,
          emissiveIntensity: 0.3,
        })
      );
      cap.position.set(bar.position.x, height + 0.04, 0);
      group.add(cap);
    }

    stage.addLabel(
      new THREE.Vector3(bar.position.x, -0.42, 0.6),
      `<span class="gl-label-role">${escapeHTML(phase.label)}</span>`,
      'gl-label--tick'
    );

    if (phase.caption) {
      stage.addLabel(
        new THREE.Vector3(bar.position.x, height + 0.5, 0.4),
        `<span class="gl-label-name">${escapeHTML(phase.caption)}</span>`,
        'gl-label--tick'
      );
    }

    bars.push({ bar, height, delay: index * 0.13 });
  });

  let grown = 0;

  stage.onFrame((elapsed, delta) => {
    grown = Math.min(grown + delta * 0.85, 1);

    bars.forEach(({ bar, height, delay }) => {
      const eased = easeOutCubic(THREE.MathUtils.clamp((grown - delay) / 0.7, 0, 1));
      bar.scale.y = Math.max(height * eased, 0.001);
      bar.position.y = (bar.scale.y) / 2;
    });

    const speed = prefersReducedMotion ? 0 : 1;
    group.rotation.y = (-0.34 + Math.sin(elapsed * 0.22) * 0.08 + stage.pointer.x * 0.12) * speed - 0.16;
    group.rotation.x = 0.04 + stage.pointer.y * -0.04 * speed;
  });

  return stage;
}

/* ------------------------------------------------------------- helpers --- */

function buildDotSphere(radius, color) {
  const count = 2600;
  const positions = new Float32Array(count * 3);
  const golden = Math.PI * (3 - Math.sqrt(5));

  // Fibonacci sphere — even coverage without a texture lookup.
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(Math.max(1 - y * y, 0));
    const theta = golden * i;

    positions[i * 3]     = Math.cos(theta) * r * radius;
    positions[i * 3 + 1] = y * radius;
    positions[i * 3 + 2] = Math.sin(theta) * r * radius;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  return new THREE.Points(geometry, new THREE.PointsMaterial({
    color,
    size: 0.022,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.9,
  }));
}

/** Pointer-drag rotation with inertia, shared by the globe and cluster. */
function attachDragRotate(host, target, sensitivity = 0.6) {
  const state = { active: false, lastX: 0, lastY: 0, velocityX: 0, velocityY: 0 };

  const down = (event) => {
    state.active = true;
    state.lastX = event.clientX;
    state.lastY = event.clientY;
    host.setPointerCapture?.(event.pointerId);
    host.classList.add('is-grabbing');
  };

  const move = (event) => {
    if (!state.active) return;
    state.velocityX = ((event.clientX - state.lastX) / host.clientWidth) * Math.PI * sensitivity * 2;
    state.velocityY = ((event.clientY - state.lastY) / host.clientHeight) * Math.PI * sensitivity;
    state.lastX = event.clientX;
    state.lastY = event.clientY;

    target.rotation.y += state.velocityX;
    target.rotation.x = THREE.MathUtils.clamp(target.rotation.x + state.velocityY, -0.8, 0.8);
  };

  const up = (event) => {
    state.active = false;
    host.releasePointerCapture?.(event.pointerId);
    host.classList.remove('is-grabbing');
  };

  host.addEventListener('pointerdown', down);
  host.addEventListener('pointermove', move);
  host.addEventListener('pointerup', up);
  host.addEventListener('pointercancel', up);
  host.addEventListener('pointerleave', up);
  host.classList.add('is-grabbable');

  return {
    get active() { return state.active; },
    update() {
      if (state.active) return;
      // Coast to a stop after release.
      state.velocityX *= 0.94;
      state.velocityY *= 0.94;
      if (Math.abs(state.velocityX) > 1e-4) target.rotation.y += state.velocityX;
      if (Math.abs(state.velocityY) > 1e-4) {
        target.rotation.x = THREE.MathUtils.clamp(target.rotation.x + state.velocityY, -0.8, 0.8);
      }
    },
  };
}

function readJSON(host, key, fallback) {
  try {
    return JSON.parse(host.dataset[key] ?? '') ?? fallback;
  } catch {
    return fallback;
  }
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (char) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]
  ));
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}
