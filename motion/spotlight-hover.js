/* Spotlight Hover — isolated motion layer.
   Only touches elements matching SELECTOR below. Delete this file plus its
   <script> tag and the spotlight-hover.css <link> in index.html to restore
   the static page exactly — no other markup depends on this script running. */
(function () {
  'use strict';

  var SELECTOR = '[data-motion-target~="spotlight-hover"]';
  var ACTIVE_CLASS = 'is-spotlight-active';

  if (!('requestAnimationFrame' in window) || !('matchMedia' in window)) return;

  var reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  var finePointerQuery = window.matchMedia('(pointer: fine)');

  function canRun() {
    return finePointerQuery.matches && !reduceMotionQuery.matches;
  }

  var activeCard = null;

  function SpotlightCard(el) {
    this.el = el;
    this.rect = null;
    this.pointerX = 0;
    this.pointerY = 0;
    this.scheduled = false;

    this.onEnter = this.onEnter.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onLeave = this.onLeave.bind(this);
    this.applyPosition = this.applyPosition.bind(this);

    el.addEventListener('pointerenter', this.onEnter);
    el.addEventListener('pointermove', this.onMove);
    el.addEventListener('pointerleave', this.onLeave);
  }

  // A single cached rect (read once, on entry) is all a hover-tracked
  // spotlight needs — every later frame only ever writes the two custom
  // properties, so a frame never mixes a layout read with a write.
  SpotlightCard.prototype.onEnter = function (event) {
    if (event.pointerType === 'touch') return;
    if (activeCard && activeCard !== this) activeCard.deactivate();
    this.rect = this.el.getBoundingClientRect();
    this.el.classList.add(ACTIVE_CLASS);
    activeCard = this;
    this.queue(event);
  };

  SpotlightCard.prototype.onMove = function (event) {
    if (!this.rect) return;
    this.queue(event);
  };

  SpotlightCard.prototype.onLeave = function () {
    this.deactivate();
  };

  SpotlightCard.prototype.queue = function (event) {
    this.pointerX = event.clientX;
    this.pointerY = event.clientY;
    if (!this.scheduled) {
      this.scheduled = true;
      requestAnimationFrame(this.applyPosition);
    }
  };

  SpotlightCard.prototype.applyPosition = function () {
    this.scheduled = false;
    if (!this.rect) return;
    var xPct = ((this.pointerX - this.rect.left) / this.rect.width) * 100;
    var yPct = ((this.pointerY - this.rect.top) / this.rect.height) * 100;
    this.el.style.setProperty('--spot-x', xPct.toFixed(2) + '%');
    this.el.style.setProperty('--spot-y', yPct.toFixed(2) + '%');
  };

  SpotlightCard.prototype.deactivate = function () {
    this.el.classList.remove(ACTIVE_CLASS);
    this.rect = null;
    if (activeCard === this) activeCard = null;
  };

  SpotlightCard.prototype.destroy = function () {
    this.el.removeEventListener('pointerenter', this.onEnter);
    this.el.removeEventListener('pointermove', this.onMove);
    this.el.removeEventListener('pointerleave', this.onLeave);
    this.deactivate();
    this.el.style.removeProperty('--spot-x');
    this.el.style.removeProperty('--spot-y');
  };

  var instances = [];

  function setup() {
    var els = document.querySelectorAll(SELECTOR);
    els.forEach(function (el) {
      instances.push(new SpotlightCard(el));
    });
  }

  function teardown() {
    instances.forEach(function (instance) { instance.destroy(); });
    instances = [];
    activeCard = null;
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
