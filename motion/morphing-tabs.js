/* Inventory Morphing Tabs — shared active pill, keyboard support, no library. */
(function () {
  'use strict';

  var ROOT_SELECTOR = '[data-motion-target~="morphing-tabs-shared-layout"]';
  var TAB_SELECTOR = '[role="tab"]';
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function MorphingTabs(root) {
    this.root = root;
    this.tabs = Array.prototype.slice.call(root.querySelectorAll(TAB_SELECTOR));
    this.indicator = root.querySelector('[data-motion-part="active-pill"]');
    this.selected = this.tabs.find(function (tab) {
      return tab.getAttribute('aria-selected') === 'true';
    }) || this.tabs[0];
    this.commitTimer = 0;
    this.resizeFrame = 0;

    this.onClick = this.onClick.bind(this);
    this.onKeydown = this.onKeydown.bind(this);
    this.onResize = this.onResize.bind(this);

    this.tabs.forEach(function (tab) {
      tab.addEventListener('click', this.onClick);
      tab.addEventListener('keydown', this.onKeydown);
    }, this);

    this.resizeObserver = 'ResizeObserver' in window
      ? new ResizeObserver(this.onResize)
      : null;

    if (this.resizeObserver) {
      this.resizeObserver.observe(root);
      this.tabs.forEach(function (tab) { this.resizeObserver.observe(tab); }, this);
    } else {
      window.addEventListener('resize', this.onResize);
    }

    this.syncSelection(this.selected);
    this.snapToSelected();
  }

  MorphingTabs.prototype.measure = function (tab) {
    var rootRect = this.root.getBoundingClientRect();
    var tabRect = tab.getBoundingClientRect();
    return {
      x: tabRect.left - rootRect.left,
      y: tabRect.top - rootRect.top,
      width: tabRect.width,
      height: tabRect.height
    };
  };

  MorphingTabs.prototype.setIndicator = function (box) {
    this.indicator.style.width = box.width + 'px';
    this.indicator.style.height = box.height + 'px';
    this.indicator.style.transform = 'translate3d(' + box.x + 'px,' + box.y + 'px,0) scale(1,1)';
  };

  MorphingTabs.prototype.snapToSelected = function () {
    if (!this.selected || !this.indicator) return;
    window.clearTimeout(this.commitTimer);
    this.indicator.style.transition = 'none';
    this.setIndicator(this.measure(this.selected));
  };

  MorphingTabs.prototype.morphTo = function (tab) {
    var target = this.measure(tab);

    if (reduceMotion.matches) {
      this.snapToSelected();
      return;
    }

    window.clearTimeout(this.commitTimer);

    /* Capture the pill's current visual box so a rapid second selection starts
       from the in-flight shape rather than jumping back to an old endpoint. */
    var rootRect = this.root.getBoundingClientRect();
    var visualRect = this.indicator.getBoundingClientRect();
    var current = {
      x: visualRect.left - rootRect.left,
      y: visualRect.top - rootRect.top,
      width: visualRect.width,
      height: visualRect.height
    };

    this.indicator.style.transition = 'none';
    this.setIndicator(current);
    this.indicator.getBoundingClientRect();

    this.indicator.style.transition = 'transform 400ms cubic-bezier(.22,1,.36,1)';
    this.indicator.style.transform =
      'translate3d(' + target.x + 'px,' + target.y + 'px,0) ' +
      'scale(' + (target.width / current.width) + ',' + (target.height / current.height) + ')';

    this.commitTimer = window.setTimeout(function () {
      this.indicator.style.transition = 'none';
      this.setIndicator(target);
    }.bind(this), 410);
  };

  MorphingTabs.prototype.syncSelection = function (tab) {
    this.tabs.forEach(function (item) {
      var isSelected = item === tab;
      item.setAttribute('aria-selected', String(isSelected));
      item.setAttribute('tabindex', isSelected ? '0' : '-1');
    });
    this.selected = tab;
  };

  MorphingTabs.prototype.select = function (tab) {
    if (!tab || tab === this.selected) return;
    this.syncSelection(tab);
    this.morphTo(tab);
  };

  MorphingTabs.prototype.onClick = function (event) {
    this.select(event.currentTarget);
  };

  MorphingTabs.prototype.onKeydown = function (event) {
    var currentIndex = this.tabs.indexOf(event.currentTarget);
    var nextIndex = currentIndex;

    if (event.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + this.tabs.length) % this.tabs.length;
    else if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % this.tabs.length;
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = this.tabs.length - 1;
    else return;

    event.preventDefault();
    this.tabs[nextIndex].focus();
    this.select(this.tabs[nextIndex]);
  };

  MorphingTabs.prototype.onResize = function () {
    window.cancelAnimationFrame(this.resizeFrame);
    this.resizeFrame = window.requestAnimationFrame(function () {
      this.snapToSelected();
    }.bind(this));
  };

  function init() {
    document.querySelectorAll(ROOT_SELECTOR).forEach(function (root) {
      if (!root.__morphingTabs) root.__morphingTabs = new MorphingTabs(root);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
