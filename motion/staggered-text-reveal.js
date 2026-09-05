/* Staggered Text Reveal — one-shot observer with a short visual-only scramble. */
(function () {
  'use strict';

  var SELECTOR = '[data-motion-target~="staggered-text-reveal"]';
  var STAGGER = 90;
  var REVEAL_DURATION = 600;
  var SCRAMBLE_DURATION = 260;
  var GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var textTags = /^(H1|H2|H3|H4|H5|H6|P)$/;

  function directTextChildren(group) {
    return Array.prototype.filter.call(group.children, function (child) {
      return textTags.test(child.tagName) &&
        !child.hidden &&
        child.getAttribute('aria-hidden') !== 'true' &&
        !child.matches('.sr-only, .visually-hidden, .seamless-loading-live');
    });
  }

  function isScrambleSafe(text) {
    return !/[\u0400-\u04ff]/.test(text) &&
      !/[₮$€£¥]/.test(text) &&
      !/\b(?:APR|Starting|From|mo)\b/i.test(text);
  }

  function fontString(style) {
    return [style.fontStyle, style.fontWeight, style.fontSize, style.fontFamily].join(' ');
  }

  function replacementMap(text, element) {
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    var style = getComputedStyle(element);
    var map = Object.create(null);
    if (!context) return map;
    context.font = fontString(style);

    Array.prototype.forEach.call(text, function (character) {
      if (map[character] || !/[A-Za-z]/.test(character)) return;
      var targetWidth = context.measureText(character).width;
      var best = character;
      var bestDelta = Infinity;
      for (var i = 0; i < GLYPHS.length; i += 1) {
        var candidate = GLYPHS[i];
        if (candidate === character) continue;
        var delta = Math.abs(context.measureText(candidate).width - targetWidth);
        if (delta < bestDelta) {
          best = candidate;
          bestDelta = delta;
        }
      }
      map[character] = best;
    });
    return map;
  }

  function scrambleText(text, map, progress, frame) {
    var boundary = Math.floor(text.length * progress);
    return Array.prototype.map.call(text, function (character, index) {
      if (index < boundary || !/[A-Za-z]/.test(character)) return character;
      /* One of every three eligible glyphs changes: never more than 35%. */
      if ((index + frame) % 3 !== 0) return character;
      return map[character] || character;
    }).join('');
  }

  function runScramble(element) {
    var original = element.textContent;
    if (!original.trim() || !isScrambleSafe(original)) return;

    var style = getComputedStyle(element);
    var overlay = document.createElement('span');
    var map = replacementMap(original, element);
    var start = performance.now();
    var frame = 0;

    overlay.className = 'stagger-reveal__scramble';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.textContent = original;
    element.style.setProperty('--stagger-text-color', style.color);
    element.setAttribute('aria-label', original);
    element.classList.add('is-scrambling');
    element.appendChild(overlay);

    function tick(now) {
      var progress = Math.min((now - start) / SCRAMBLE_DURATION, 1);
      overlay.textContent = scrambleText(original, map, progress, frame++);
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        overlay.remove();
        element.classList.remove('is-scrambling');
        element.style.removeProperty('--stagger-text-color');
        element.removeAttribute('aria-label');
      }
    }

    requestAnimationFrame(tick);
  }

  function reveal(group) {
    if (group.dataset.staggerRevealComplete === 'true') return;
    group.dataset.staggerRevealComplete = 'true';
    var items = directTextChildren(group);

    if (reduceMotion.matches) {
      group.classList.add('is-revealing');
      return;
    }

    items.forEach(function (item, index) {
      item.style.setProperty('--stagger-delay', (index * STAGGER) + 'ms');
      window.setTimeout(function () { runScramble(item); }, index * STAGGER);
    });
    group.classList.add('is-revealing');

    window.setTimeout(function () {
      group.classList.remove('is-reveal-ready', 'is-revealing');
      items.forEach(function (item) {
        item.classList.remove('stagger-reveal__item');
        item.style.removeProperty('--stagger-delay');
      });
    }, REVEAL_DURATION + ((items.length - 1) * STAGGER) + 40);
  }

  function init() {
    var groups = document.querySelectorAll(SELECTOR);
    if (reduceMotion.matches || !('IntersectionObserver' in window)) {
      groups.forEach(reveal);
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
          observer.unobserve(entry.target);
          reveal(entry.target);
        }
      });
    }, { threshold: [0.3] });

    groups.forEach(function (group) {
      var items = directTextChildren(group);
      if (!items.length) return;
      items.forEach(function (item) { item.classList.add('stagger-reveal__item'); });
      group.classList.add('is-reveal-ready');
      observer.observe(group);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
