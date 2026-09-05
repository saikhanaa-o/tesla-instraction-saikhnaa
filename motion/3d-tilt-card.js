/* 3D Tilt Card — pointer-only, rAF-interpolated and framework-free. */
(function () {
  'use strict';

  var SELECTOR = '[data-motion-target~="3d-tilt-card"]';
  var MAX_X = 3.5;
  var MAX_Y = 4.5;
  var MAX_IMAGE_SCALE = 1.018;
  var CONTENT_Z = 12;
  var RETURN_DURATION = 500;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var fineHover = window.matchMedia('(hover: hover) and (pointer: fine)');
  var instances = [];
  var active = new Set();
  var rafId = 0;

  function canRun() {
    return fineHover.matches && !reduceMotion.matches;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function activate(instance) {
    active.add(instance);
    if (!rafId) rafId = requestAnimationFrame(loop);
  }

  function loop(now) {
    active.forEach(function (instance) {
      if (!instance.tick(now)) active.delete(instance);
    });
    rafId = active.size ? requestAnimationFrame(loop) : 0;
  }

  function TiltCard(card) {
    this.card = card;
    this.parent = card.parentElement;
    this.rect = null;
    this.mode = 'idle';
    this.lastTime = 0;
    this.currentX = 0;
    this.currentY = 0;
    this.currentDepth = 0;
    this.targetX = 0;
    this.targetY = 0;
    this.returnStart = 0;
    this.returnX = 0;
    this.returnY = 0;
    this.returnDepth = 0;

    this.onEnter = this.onEnter.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onLeave = this.onLeave.bind(this);
    this.onFocusIn = this.onFocusIn.bind(this);
    this.onFocusOut = this.onFocusOut.bind(this);

    this.parent.classList.add('has-3d-tilt-card');
    card.addEventListener('pointerenter', this.onEnter);
    card.addEventListener('pointermove', this.onMove);
    card.addEventListener('pointerleave', this.onLeave);
    card.addEventListener('focusin', this.onFocusIn);
    card.addEventListener('focusout', this.onFocusOut);
  }

  TiltCard.prototype.hasKeyboardFocus = function () {
    return this.card.contains(document.activeElement);
  };

  TiltCard.prototype.readPointer = function (event) {
    if (!this.rect) this.rect = this.card.getBoundingClientRect();
    var nx = clamp(((event.clientX - this.rect.left) / this.rect.width) * 2 - 1, -1, 1);
    var ny = clamp(((event.clientY - this.rect.top) / this.rect.height) * 2 - 1, -1, 1);
    this.targetX = clamp(-ny * MAX_X, -MAX_X, MAX_X);
    this.targetY = clamp(nx * MAX_Y, -MAX_Y, MAX_Y);
  };

  TiltCard.prototype.onEnter = function (event) {
    if (!canRun() || event.pointerType === 'touch' || this.hasKeyboardFocus()) return;
    this.rect = this.card.getBoundingClientRect();
    this.readPointer(event);
    this.mode = 'tracking';
    this.lastTime = performance.now();
    this.card.classList.add('is-3d-tilting');
    activate(this);
  };

  TiltCard.prototype.onMove = function (event) {
    if (event.pointerType === 'touch' || this.hasKeyboardFocus()) return;
    if (this.mode === 'idle' && canRun()) this.onEnter(event);
    if (this.mode === 'tracking') this.readPointer(event);
  };

  TiltCard.prototype.onLeave = function () {
    this.returnToRest();
  };

  TiltCard.prototype.onFocusIn = function () {
    this.returnToRest();
  };

  TiltCard.prototype.onFocusOut = function () {
    /* A focus move between descendants must keep the effect disabled. */
    requestAnimationFrame(function () {
      if (this.hasKeyboardFocus()) this.returnToRest();
    }.bind(this));
  };

  TiltCard.prototype.returnToRest = function () {
    if (this.mode === 'idle') return;
    this.mode = 'returning';
    this.returnStart = performance.now();
    this.returnX = this.currentX;
    this.returnY = this.currentY;
    this.returnDepth = this.currentDepth;
    activate(this);
  };

  TiltCard.prototype.tick = function (now) {
    if (this.mode === 'tracking') {
      var dt = Math.min(now - this.lastTime, 40);
      var weight = 1 - Math.exp(-dt / 85);
      this.lastTime = now;
      this.currentX += (this.targetX - this.currentX) * weight;
      this.currentY += (this.targetY - this.currentY) * weight;
      this.currentDepth += (1 - this.currentDepth) * weight;
      this.paint();
      return true;
    }

    if (this.mode === 'returning') {
      var progress = Math.min((now - this.returnStart) / RETURN_DURATION, 1);
      var remainder = 1 - easeOutCubic(progress);
      this.currentX = this.returnX * remainder;
      this.currentY = this.returnY * remainder;
      this.currentDepth = this.returnDepth * remainder;
      this.paint();
      if (progress === 1) {
        this.reset();
        return false;
      }
      return true;
    }

    return false;
  };

  TiltCard.prototype.paint = function () {
    var depth = clamp(this.currentDepth, 0, 1);
    var imageScale = 1 + (MAX_IMAGE_SCALE - 1) * depth;
    this.card.style.transform =
      'rotateX(' + this.currentX.toFixed(3) + 'deg) rotateY(' + this.currentY.toFixed(3) + 'deg)';
    this.card.style.boxShadow =
      '0 ' + (12 * depth).toFixed(2) + 'px ' + (34 * depth).toFixed(2) +
      'px rgba(2,8,9,' + (0.12 * depth).toFixed(3) + ')';
    this.card.style.setProperty('--tilt-image-z', (2 * depth).toFixed(2) + 'px');
    this.card.style.setProperty('--tilt-image-scale', imageScale.toFixed(5));
    this.card.style.setProperty('--tilt-content-z', (CONTENT_Z * depth).toFixed(2) + 'px');
  };

  TiltCard.prototype.reset = function () {
    this.mode = 'idle';
    this.rect = null;
    this.currentX = this.currentY = this.currentDepth = 0;
    this.targetX = this.targetY = 0;
    this.card.classList.remove('is-3d-tilting');
    this.card.style.transform = '';
    this.card.style.boxShadow = '';
    this.card.style.removeProperty('--tilt-image-z');
    this.card.style.removeProperty('--tilt-image-scale');
    this.card.style.removeProperty('--tilt-content-z');
  };

  TiltCard.prototype.destroy = function () {
    this.card.removeEventListener('pointerenter', this.onEnter);
    this.card.removeEventListener('pointermove', this.onMove);
    this.card.removeEventListener('pointerleave', this.onLeave);
    this.card.removeEventListener('focusin', this.onFocusIn);
    this.card.removeEventListener('focusout', this.onFocusOut);
    this.reset();
  };

  function teardown() {
    var parents = new Set(instances.map(function (instance) { return instance.parent; }));
    instances.forEach(function (instance) { instance.destroy(); });
    parents.forEach(function (parent) { parent.classList.remove('has-3d-tilt-card'); });
    instances = [];
    active.clear();
    if (rafId) cancelAnimationFrame(rafId);
    rafId = 0;
  }

  function sync() {
    teardown();
    if (!canRun()) return;
    document.querySelectorAll(SELECTOR).forEach(function (card) {
      instances.push(new TiltCard(card));
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', sync, { once: true });
  } else {
    sync();
  }

  reduceMotion.addEventListener('change', sync);
  fineHover.addEventListener('change', sync);
})();
