/* Seamless Button Loading — replace performAction() with a real request. */
(function () {
  'use strict';

  var SELECTOR = '[data-motion-target~="seamless-button-loading"]';
  var STATE_SELECTOR = '[data-loading-state]';
  var LOADING_DURATION = 1400;
  var SUCCESS_DURATION = 1000;
  var liveRegion = null;

  function wait(duration) {
    return new Promise(function (resolve) { window.setTimeout(resolve, duration); });
  }

  /* Async seam: replace this body with fetch()/your request promise. */
  function performAction() {
    return wait(LOADING_DURATION);
  }

  function announce(message) {
    if (liveRegion) liveRegion.textContent = message;
  }

  function showState(button, stateName) {
    var states = Array.prototype.slice.call(button.querySelectorAll(STATE_SELECTOR));
    var activeIndex = states.findIndex(function (state) {
      return state.getAttribute('data-loading-state') === stateName;
    });

    states.forEach(function (state, index) {
      state.classList.toggle('is-active', index === activeIndex);
      state.classList.toggle('is-before', index < activeIndex);
    });
  }

  async function activate(button) {
    if (button.getAttribute('aria-busy') === 'true') return;

    var idleWidth = button.getBoundingClientRect().width;
    button.style.width = idleWidth + 'px';
    button.setAttribute('aria-busy', 'true');
    button.disabled = true;
    showState(button, 'loading');
    announce('Түр хүлээнэ үү');

    try {
      await performAction(button);
      showState(button, 'success');
      announce('Амжилттай');
      await wait(SUCCESS_DURATION);
    } finally {
      showState(button, 'idle');
      button.setAttribute('aria-busy', 'false');
      button.disabled = false;
      button.style.width = '';
    }
  }

  function init() {
    liveRegion = document.querySelector('.seamless-loading-live');
    document.querySelectorAll(SELECTOR).forEach(function (button) {
      button.addEventListener('click', function () { activate(button); });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
