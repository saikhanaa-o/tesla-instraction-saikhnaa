/* Magnetic Button — isolated motion layer.
   Only touches elements matching SELECTOR below. Delete this file plus its
   <script> tag and the magnetic-button.css <link> in index.html to restore
   the static page exactly — no other markup depends on this script running. */
(function () {
  'use strict';

  var SELECTOR = '[data-motion-target~="magnetic-button"]';
  var LABEL_SELECTOR = '[data-motion-part="magnetic-button-label"]';

  var MAX_OFFSET = 8;          // px, hard clamp per axis on the button's own translation
  var LABEL_RATIO = 0.4;       // label trails the button at 40% of its offset (depth cue)
  var STRENGTH = 0.35;         // fraction of pointer-to-center distance applied before clamping
  var FOLLOW_SMOOTHING = 0.3;  // per-frame lerp toward the live target while following
  var RETURN_DURATION = 460;   // ms, within the required 420–520ms window
  var OVERSHOOT = 1.2;         // easeOutBack constant tuned for one gentle overshoot, no re-bounce

  if (!('requestAnimationFrame' in window) || !('matchMedia' in window)) return;

  var reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  var finePointerQuery = window.matchMedia('(pointer: fine)');

  function canRun() {
    return finePointerQuery.matches && !reduceMotionQuery.matches;
  }

  function clamp(value, min, max) {
    return value < min ? min : value > max ? max : value;
  }

  // Single-overshoot easing: settles at exactly 1 with one soft bounce past
  // it, then decays back — never oscillates a second time.
  function easeOutBack(t) {
    var c3 = OVERSHOOT + 1;
    var u = t - 1;
    return 1 + c3 * u * u * u + OVERSHOOT * u * u;
  }

  function MagneticButton(el) {
    this.el = el;
    this.label = el.querySelector(LABEL_SELECTOR);
    this.rect = null;
    this.state = 'idle'; // idle | following | returning
    this.pointerX = 0;
    this.pointerY = 0;
    this.currentX = 0;
    this.currentY = 0;
    this.returnFromX = 0;
    this.returnFromY = 0;
    this.returnStart = 0;

    this.onEnter = this.onEnter.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onLeave = this.onLeave.bind(this);

    el.addEventListener('pointerenter', this.onEnter);
    el.addEventListener('pointermove', this.onMove);
    el.addEventListener('pointerleave', this.onLeave);
  }

  MagneticButton.prototype.onEnter = function (event) {
    if (event.pointerType === 'touch') return;
    this.rect = this.el.getBoundingClientRect();
    this.pointerX = event.clientX;
    this.pointerY = event.clientY;
    this.state = 'following';
    activate(this);
  };

  MagneticButton.prototype.onMove = function (event) {
    if (this.state !== 'following') return;
    this.pointerX = event.clientX;
    this.pointerY = event.clientY;
  };

  MagneticButton.prototype.onLeave = function () {
    if (this.state !== 'following') return;
    this.returnFromX = this.currentX;
    this.returnFromY = this.currentY;
    this.returnStart = performance.now();
    this.state = 'returning';
    activate(this);
  };

  MagneticButton.prototype.targetOffset = function () {
    var cx = this.rect.left + this.rect.width / 2;
    var cy = this.rect.top + this.rect.height / 2;
    return {
      x: clamp((this.pointerX - cx) * STRENGTH, -MAX_OFFSET, MAX_OFFSET),
      y: clamp((this.pointerY - cy) * STRENGTH, -MAX_OFFSET, MAX_OFFSET)
    };
  };

  MagneticButton.prototype.tick = function (now) {
    if (this.state === 'following') {
      var target = this.targetOffset();
      this.currentX += (target.x - this.currentX) * FOLLOW_SMOOTHING;
      this.currentY += (target.y - this.currentY) * FOLLOW_SMOOTHING;
      this.paint();
      return true;
    }

    if (this.state === 'returning') {
      var t = Math.min((now - this.returnStart) / RETURN_DURATION, 1);
      var eased = easeOutBack(t);
      this.currentX = this.returnFromX * (1 - eased);
      this.currentY = this.returnFromY * (1 - eased);
      this.paint();
      if (t >= 1) {
        this.currentX = 0;
        this.currentY = 0;
        this.paint();
        this.state = 'idle';
        return false;
      }
      return true;
    }

    return false;
  };

  MagneticButton.prototype.paint = function () {
    this.el.style.transform = 'translate3d(' + this.currentX.toFixed(2) + 'px,' + this.currentY.toFixed(2) + 'px,0)';
    if (this.label) {
      this.label.style.transform = 'translate3d(' + (this.currentX * LABEL_RATIO).toFixed(2) + 'px,' + (this.currentY * LABEL_RATIO).toFixed(2) + 'px,0)';
    }
  };

  MagneticButton.prototype.reset = function () {
    this.state = 'idle';
    this.currentX = 0;
    this.currentY = 0;
    this.el.style.transform = '';
    if (this.label) this.label.style.transform = '';
  };

  MagneticButton.prototype.destroy = function () {
    this.el.removeEventListener('pointerenter', this.onEnter);
    this.el.removeEventListener('pointermove', this.onMove);
    this.el.removeEventListener('pointerleave', this.onLeave);
    this.reset();
  };

  var instances = [];
  var active = new Set();
  var rafId = null;

  function activate(instance) {
    active.add(instance);
    if (rafId === null) rafId = requestAnimationFrame(loop);
  }

  function loop(now) {
    active.forEach(function (instance) {
      if (!instance.tick(now)) active.delete(instance);
    });
    rafId = active.size > 0 ? requestAnimationFrame(loop) : null;
  }

  function setup() {
    var els = document.querySelectorAll(SELECTOR);
    els.forEach(function (el) {
      instances.push(new MagneticButton(el));
    });
  }

  function teardown() {
    instances.forEach(function (instance) { instance.destroy(); });
    instances = [];
    active.clear();
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  function sync() {
    teardown();
    if (canRun()) setup();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', sync);
  } else {
    sync();
  }

  reduceMotionQuery.addEventListener('change', sync);
  finePointerQuery.addEventListener('change', sync);
})();
