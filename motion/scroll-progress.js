/* Scroll Progress — native-scroll observer with reinitialization cleanup. */
(function () {
  'use strict';

  var GLOBAL_KEY = '__scrollProgressAnchorController__';
  var ANCHOR_SELECTOR = '[data-motion-target="scroll-progress-anchor"]';
  var SMOOTHING_TIME = 36;

  if (window[GLOBAL_KEY] && typeof window[GLOBAL_KEY].destroy === 'function') {
    window[GLOBAL_KEY].destroy();
  }

  function clamp(value) {
    return Math.max(0, Math.min(1, value));
  }

  function ScrollProgress(body, bar) {
    this.body = body;
    this.bar = bar;
    this.root = document.documentElement;
    this.reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.maxScroll = 0;
    this.current = 0;
    this.target = 0;
    this.rafId = 0;
    this.lastFrame = 0;

    this.onScroll = this.onScroll.bind(this);
    this.onGeometryChange = this.onGeometryChange.bind(this);
    this.onMotionPreference = this.onMotionPreference.bind(this);
    this.tick = this.tick.bind(this);

    window.addEventListener('scroll', this.onScroll, { passive: true });
    window.addEventListener('resize', this.onGeometryChange, { passive: true });
    document.addEventListener('load', this.onGeometryChange, true);
    this.reduceMotion.addEventListener('change', this.onMotionPreference);

    this.resizeObserver = 'ResizeObserver' in window
      ? new ResizeObserver(this.onGeometryChange)
      : null;

    if (this.resizeObserver) {
      this.resizeObserver.observe(this.root);
      this.resizeObserver.observe(this.body);
    }

    this.measure();
    this.target = this.readProgress();
    this.current = this.target;
    this.render();
  }

  ScrollProgress.prototype.measure = function () {
    this.maxScroll = Math.max(0, this.root.scrollHeight - window.innerHeight);
  };

  ScrollProgress.prototype.readProgress = function () {
    if (this.maxScroll <= 0) return 0;
    return clamp(window.scrollY / this.maxScroll);
  };

  ScrollProgress.prototype.render = function () {
    this.bar.style.transform = 'scaleX(' + clamp(this.current).toFixed(5) + ')';
  };

  ScrollProgress.prototype.requestRender = function () {
    this.target = this.readProgress();
    if (this.reduceMotion.matches) {
      this.current = this.target;
      this.render();
      if (this.rafId) cancelAnimationFrame(this.rafId);
      this.rafId = 0;
      return;
    }
    if (!this.rafId) {
      this.lastFrame = performance.now();
      this.rafId = requestAnimationFrame(this.tick);
    }
  };

  ScrollProgress.prototype.onScroll = function () {
    this.requestRender();
  };

  ScrollProgress.prototype.onGeometryChange = function () {
    this.measure();
    this.requestRender();
  };

  ScrollProgress.prototype.onMotionPreference = function () {
    this.requestRender();
  };

  ScrollProgress.prototype.tick = function (now) {
    var elapsed = Math.min(now - this.lastFrame, 64);
    var weight = 1 - Math.exp(-elapsed / SMOOTHING_TIME);
    this.lastFrame = now;
    this.current += (this.target - this.current) * weight;
    if (Math.abs(this.target - this.current) < 0.0001) {
      this.current = this.target;
      this.render();
      this.rafId = 0;
      return;
    }
    this.render();
    this.rafId = requestAnimationFrame(this.tick);
  };

  ScrollProgress.prototype.destroy = function () {
    window.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('resize', this.onGeometryChange);
    document.removeEventListener('load', this.onGeometryChange, true);
    this.reduceMotion.removeEventListener('change', this.onMotionPreference);
    if (this.resizeObserver) this.resizeObserver.disconnect();
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.rafId = 0;
    this.bar.style.transform = 'scaleX(0)';
  };

  function init() {
    var bar = document.querySelector(ANCHOR_SELECTOR);
    if (!document.body || !bar) return;
    if (window[GLOBAL_KEY] && typeof window[GLOBAL_KEY].destroy === 'function') {
      window[GLOBAL_KEY].destroy();
    }
    window[GLOBAL_KEY] = new ScrollProgress(document.body, bar);
  }

  if (document.readyState === 'loading') {
    var boot = function () {
      document.removeEventListener('DOMContentLoaded', boot);
      init();
    };
    document.addEventListener('DOMContentLoaded', boot);
    window[GLOBAL_KEY] = {
      destroy: function () { document.removeEventListener('DOMContentLoaded', boot); }
    };
  } else {
    init();
  }
})();
