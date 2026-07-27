/**
 * Shared WebGL plumbing: renderer, camera, resize, render loop, HTML labels.
 *
 * Every visual on the site builds on a Stage so they all share the same
 * DPR cap, offscreen pausing and reduced-motion behaviour.
 */

import * as THREE from 'three';

export const PALETTE = {
  navy900: 0x0a1a33,
  navy800: 0x0c203f,
  navy700: 0x102950,
  navy600: 0x1e355b,
  navy400: 0x2f4c78,
  steel:   0x3d5a86,
  gold:    0xc9a227,
  goldLit: 0xe4c55e,
  paper:   0xffffff,
  mist:    0xf7f8fb,
  line:    0xe6e9f0,
};

export const prefersReducedMotion =
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Is `element` within `margin` pixels of the viewport right now?
 *
 * IntersectionObserver doesn't deliver an initial record in every context
 * (offscreen/background renderers in particular), so every observer here is
 * paired with a synchronous check to avoid a scene that never mounts.
 */
export function isNearViewport(element, margin = 300) {
  const rect = element.getBoundingClientRect();
  if (!rect.width && !rect.height) return false;

  return rect.top < window.innerHeight + margin && rect.bottom > -margin;
}

/** Cheap WebGL capability probe — lets callers bail out to the CSS gradient. */
export function supportsWebGL() {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl2') || canvas.getContext('webgl'))
    );
  } catch {
    return false;
  }
}

export class Stage {
  /**
   * @param {HTMLElement} host        Element the canvas fills.
   * @param {object}      [options]
   * @param {number}      [options.fov]
   * @param {boolean}     [options.alpha]      Transparent clear colour.
   * @param {number}      [options.clearColor]
   * @param {number}      [options.maxDpr]
   */
  constructor(host, options = {}) {
    const {
      fov = 45,
      alpha = false,
      clearColor = PALETTE.navy800,
      maxDpr = 1.75,
    } = options;

    this.host = host;
    this.maxDpr = maxDpr;
    this.clock = new THREE.Clock();
    this.updaters = [];
    this.labels = [];
    this.running = false;
    this.visible = false;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(fov, 1, 0.1, 400);

    this.renderer = new THREE.WebGLRenderer({
      antialias: window.devicePixelRatio < 2,
      alpha,
      powerPreference: 'high-performance',
    });
    this.renderer.setClearColor(clearColor, alpha ? 0 : 1);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;

    host.appendChild(this.renderer.domElement);

    // Pointer position normalised to [-1, 1], smoothed in `render`.
    this.pointer = new THREE.Vector2();
    this.pointerTarget = new THREE.Vector2();

    this.#observeSize();
    this.#observeVisibility();
    this.#bindPointer();
  }

  /** Register a per-frame callback: `(elapsed, delta) => void`. */
  onFrame(fn) {
    this.updaters.push(fn);
    return this;
  }

  /**
   * Attach an HTML label that tracks a 3D position each frame.
   * @param {THREE.Vector3} position
   * @param {string} html
   * @param {string} [className]
   */
  addLabel(position, html, className = '') {
    if (!this.labelLayer) {
      this.labelLayer = document.createElement('div');
      this.labelLayer.className = 'gl-labels';
      this.host.appendChild(this.labelLayer);
    }

    const el = document.createElement('div');
    el.className = `gl-label ${className}`.trim();
    el.innerHTML = html;
    this.labelLayer.appendChild(el);

    const label = { el, position: position.clone(), projected: new THREE.Vector3() };
    this.labels.push(label);
    return label;
  }

  #observeSize() {
    this.resize = () => {
      const { clientWidth: w, clientHeight: h } = this.host;
      if (!w || !h) return;

      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, this.maxDpr));
      this.renderer.setSize(w, h, false);
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.onResize?.(w, h);
    };

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(this.host);
    this.resize();
  }

  /** Only burn frames while the canvas is actually on screen. */
  #observeVisibility() {
    this.intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        this.visible = entry.isIntersecting;
        this.visible ? this.start() : this.stop();
      },
      { rootMargin: '120px' }
    );
    this.intersectionObserver.observe(this.host);

    // Don't wait on the observer's first record to draw the opening frame.
    if (isNearViewport(this.host, 120)) {
      this.visible = true;
      this.start();
    }

    document.addEventListener('visibilitychange', () => {
      document.hidden ? this.stop() : this.visible && this.start();
    });
  }

  #bindPointer() {
    this.handlePointer = (event) => {
      const rect = this.host.getBoundingClientRect();
      this.pointerTarget.set(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -(((event.clientY - rect.top) / rect.height) * 2 - 1)
      );
    };
    window.addEventListener('pointermove', this.handlePointer, { passive: true });
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.clock.getDelta();               // discard the idle gap
    this.#loop();
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.frameId);
  }

  #loop = () => {
    if (!this.running) return;
    this.frameId = requestAnimationFrame(this.#loop);

    const delta = Math.min(this.clock.getDelta(), 0.05);
    const elapsed = this.clock.elapsedTime;

    this.pointer.lerp(this.pointerTarget, 0.06);

    for (const update of this.updaters) update(elapsed, delta);

    this.#syncLabels();
    this.renderer.render(this.scene, this.camera);
  };

  #syncLabels() {
    if (!this.labels.length) return;

    const { clientWidth: w, clientHeight: h } = this.host;
    const cameraPos = this.camera.position;

    for (const label of this.labels) {
      const target = label.anchor ? label.anchor.getWorldPosition(label.projected) : label.projected.copy(label.position);
      const distance = cameraPos.distanceTo(target);

      target.project(this.camera);

      const behind = target.z > 1;
      label.el.style.opacity = behind || label.hidden ? '0' : String(label.opacity ?? 1);
      label.el.style.transform =
        `translate(-50%, -50%) translate(${(target.x * 0.5 + 0.5) * w}px, ${(-target.y * 0.5 + 0.5) * h}px)`;
      label.el.style.zIndex = String(Math.round(1000 - distance * 10));
    }
  }

  dispose() {
    this.stop();
    this.resizeObserver?.disconnect();
    this.intersectionObserver?.disconnect();
    window.removeEventListener('pointermove', this.handlePointer);

    this.scene.traverse((object) => {
      object.geometry?.dispose?.();
      const material = object.material;
      if (Array.isArray(material)) material.forEach((m) => m.dispose());
      else material?.dispose?.();
    });

    this.renderer.dispose();
    this.renderer.domElement.remove();
    this.labelLayer?.remove();
  }
}

/* ------------------------------------------------------------- helpers --- */

/** Lat/lon (degrees) to a point on a sphere of `radius`. */
export function latLonToVector3(lat, lon, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

/**
 * Great-circle-ish arc between two points on a sphere. Lift scales with the
 * angular distance so short hops stay flat and long hauls bow outward.
 */
export function arcBetween(from, to, segments = 64) {
  const angle = from.angleTo(to);
  const lift = 1 + angle * 0.38;
  const mid = from.clone().add(to).multiplyScalar(0.5).normalize().multiplyScalar(from.length() * lift);

  return new THREE.QuadraticBezierCurve3(from.clone(), mid, to.clone()).getPoints(segments);
}

/** Rounded box — softer silhouettes read better at small scale than hard cubes. */
export function roundedBoxGeometry(width, height, depth, radius = 0.04, segments = 2) {
  const shape = new THREE.Shape();
  const w = width / 2 - radius;
  const h = height / 2 - radius;

  shape.moveTo(-w, -h - radius);
  shape.lineTo(w, -h - radius);
  shape.quadraticCurveTo(w + radius, -h - radius, w + radius, -h);
  shape.lineTo(w + radius, h);
  shape.quadraticCurveTo(w + radius, h + radius, w, h + radius);
  shape.lineTo(-w, h + radius);
  shape.quadraticCurveTo(-w - radius, h + radius, -w - radius, h);
  shape.lineTo(-w - radius, -h);
  shape.quadraticCurveTo(-w - radius, -h - radius, -w, -h - radius);

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: depth - radius * 2,
    bevelEnabled: true,
    bevelThickness: radius,
    bevelSize: radius,
    bevelSegments: segments,
    curveSegments: segments,
  });

  geometry.center();
  return geometry;
}
