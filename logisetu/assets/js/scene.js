/**
 * Entry point for every WebGL surface on the page.
 * Scenes are created lazily so a hero below the fold costs nothing until seen.
 */

import { supportsWebGL, isNearViewport } from './stage.js';

if (!supportsWebGL()) {
  // The CSS gradient behind the hero already looks correct on its own.
  document.body.classList.add('no-webgl');
} else {
  const MARGIN = 300;

  const mounts = [
    { selector: '[data-hero-canvas]',    load: () => import('./hero-scene.js'), create: (m, el) => m.createHeroScene(el, document.body.dataset.scene) },
    { selector: '[data-globe-canvas]',   load: () => import('./visuals.js'),    create: (m, el) => m.createGlobe(el) },
    { selector: '[data-cluster-canvas]', load: () => import('./visuals.js'),    create: (m, el) => m.createCluster(el) },
    { selector: '[data-phases-canvas]',  load: () => import('./visuals.js'),    create: (m, el) => m.createPhases(el) },
  ];

  const mount = (element, config) => {
    if (element.dataset.mounted) return;
    element.dataset.mounted = '1';

    config.load()
      .then((module) => {
        module && config.create(module, element);
        element.classList.add('is-live');
      })
      .catch((error) => {
        console.warn('[LogiSetu] 3D scene failed to load:', error);
        document.body.classList.add('no-webgl');
      });
  };

  for (const config of mounts) {
    document.querySelectorAll(config.selector).forEach((element) => {
      // Mount anything already in view synchronously — IntersectionObserver
      // does not always deliver an initial record before first paint.
      if (isNearViewport(element, MARGIN)) {
        mount(element, config);
        return;
      }

      const observer = new IntersectionObserver(
        ([entry], self) => {
          if (!entry.isIntersecting) return;
          self.disconnect();
          mount(element, config);
        },
        { rootMargin: `${MARGIN}px` }
      );
      observer.observe(element);

      // Scroll fallback for the same reason.
      const onScroll = () => {
        if (!isNearViewport(element, MARGIN)) return;
        window.removeEventListener('scroll', onScroll);
        observer.disconnect();
        mount(element, config);
      };
      window.addEventListener('scroll', onScroll, { passive: true });
    });
  }
}
