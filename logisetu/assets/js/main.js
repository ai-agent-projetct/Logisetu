/**
 * UI behaviour: sticky header state, mobile nav, scroll reveals and the
 * pointer-tracked 3D tilt on cards.
 */

(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------ sticky header --- */

  var header = document.getElementById('siteHeader');

  if (header) {
    var applyStuck = function () {
      header.classList.toggle('is-stuck', window.scrollY > 8);
    };
    applyStuck();
    window.addEventListener('scroll', applyStuck, { passive: true });
  }

  /* --------------------------------------------------------- mobile nav --- */

  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('siteNav');

  if (toggle && nav) {
    var setNav = function (open) {
      document.body.classList.toggle('nav-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    };

    toggle.addEventListener('click', function () {
      setNav(!document.body.classList.contains('nav-open'));
    });

    nav.addEventListener('click', function (event) {
      if (event.target.closest('a')) setNav(false);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') setNav(false);
    });

    // Drop the overlay if the viewport grows past the mobile breakpoint.
    window.matchMedia('(min-width: 861px)').addEventListener('change', function (event) {
      if (event.matches) setNav(false);
    });
  }

  /* ------------------------------------------------------ scroll reveal --- */

  var revealables = document.querySelectorAll('[data-reveal]');

  revealables.forEach(function (element) {
    element.style.setProperty('--reveal-delay', element.dataset.revealDelay || 0);
  });

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealables.forEach(function (element) { element.classList.add('is-visible'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    revealables.forEach(function (element) { revealObserver.observe(element); });
  }

  /* --------------------------------------------------------- hero film --- */

  var film = document.querySelector('.hero-film video');

  if (film) {
    // Autoplay is refused in more cases than the attribute suggests — iOS Low
    // Power Mode, data saver, some enterprise policies. Poster covers the
    // visual, but retry so the film starts as soon as it is allowed.
    var tryPlay = function () {
      if (!film.paused || reduceMotion) return;
      var attempt = film.play();
      if (attempt && attempt.catch) attempt.catch(function () { /* poster stands in */ });
    };

    tryPlay();
    document.addEventListener('visibilitychange', function () {
      if (!document.hidden) tryPlay();
    });
    ['pointerdown', 'keydown', 'touchstart'].forEach(function (evt) {
      window.addEventListener(evt, tryPlay, { once: true, passive: true });
    });

    if (reduceMotion) {
      film.pause();
    } else if ('IntersectionObserver' in window) {
      // Don't decode video that has scrolled away.
      new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) tryPlay();
          else film.pause();
        });
      }, { threshold: 0.01 }).observe(film);
    }
  }

  /* ------------------------------------------------------ network film --- */

  var reel = document.querySelector('[data-film]');

  if (reel) {
    var frame = reel.closest('.film-frame');
    var toggle = document.querySelector('[data-film-toggle]');
    var chapters = [].slice.call(document.querySelectorAll('[data-film-seek]'));
    var marks = chapters.map(function (b) { return parseFloat(b.dataset.filmSeek); });

    var setPlaying = function (playing) {
      frame.classList.toggle('is-playing', playing);
      toggle.setAttribute('aria-label', playing ? 'Pause the network film' : 'Play the network film');
    };

    toggle.addEventListener('click', function () {
      if (reel.paused) {
        var attempt = reel.play();
        if (attempt && attempt.catch) attempt.catch(function () {});
      } else {
        reel.pause();
      }
    });

    reel.addEventListener('play', function () { setPlaying(true); });
    reel.addEventListener('pause', function () { setPlaying(false); });

    chapters.forEach(function (button) {
      button.addEventListener('click', function () {
        reel.currentTime = parseFloat(button.dataset.filmSeek) + 0.05;
        var attempt = reel.play();
        if (attempt && attempt.catch) attempt.catch(function () {});
      });
    });

    // Highlight whichever chapter the playhead is currently inside.
    reel.addEventListener('timeupdate', function () {
      var active = 0;
      for (var i = 0; i < marks.length; i++) {
        if (reel.currentTime >= marks[i]) active = i;
      }
      chapters.forEach(function (button, i) {
        button.classList.toggle('is-active', i === active);
      });
    });

    // Autoplay muted when it scrolls into view; stop when it leaves.
    if (!reduceMotion && 'IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var attempt = reel.play();
            if (attempt && attempt.catch) attempt.catch(function () {});
          } else {
            reel.pause();
          }
        });
      }, { threshold: 0.35 }).observe(reel);
    }
  }

  /* ----------------------------------------------------------- 3D tilt --- */

  var supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (supportsHover && !reduceMotion) {
    document.querySelectorAll('[data-tilt]').forEach(function (card) {
      var frame = null;

      card.style.transformStyle = 'preserve-3d';

      var applyTilt = function (event) {
        if (frame) return;

        frame = requestAnimationFrame(function () {
          frame = null;

          var rect = card.getBoundingClientRect();
          var x = (event.clientX - rect.left) / rect.width - 0.5;
          var y = (event.clientY - rect.top) / rect.height - 0.5;

          card.style.transform =
            'perspective(900px) rotateX(' + (-y * 7).toFixed(2) + 'deg) ' +
            'rotateY(' + (x * 9).toFixed(2) + 'deg) translateY(-6px) scale(1.012)';
        });
      };

      var resetTilt = function () {
        if (frame) { cancelAnimationFrame(frame); frame = null; }
        card.style.transform = '';
      };

      card.addEventListener('pointermove', applyTilt);
      card.addEventListener('pointerleave', resetTilt);
      card.addEventListener('blur', resetTilt, true);
    });
  }
})();
