/* unity.cn 式交互：滚动淡入 / 筛选 / 数字计数 / 顶栏状态 */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. 滚动进入 ---------- */
  var REVEAL_SELECTORS = [
    '.sec-head', '.grid > .card', '.paths > *', '.cols .col',
    '.split-txt', '.split-media', '.card-body', '.case-meta > div',
    '.blk', '.blk > *', '.fig2 > figure', '.bleed', '.results > li',
    '.docs > a', '.cta h2', '.cta-links', '.page-head h1', '.page-head p',
    '.hero-in > *'
  ].join(',');

  function setupReveal() {
    var nodes = Array.prototype.slice.call(document.querySelectorAll(REVEAL_SELECTORS));
    if (!nodes.length) return;

    if (reduced || !('IntersectionObserver' in window)) {
      nodes.forEach(function (n) { n.classList.add('is-in'); });
      return;
    }

    nodes.forEach(function (n, i) {
      n.classList.add('reveal');
      // 同组错开一点，像 unity 那样依次浮现
      var sibs = n.parentNode ? Array.prototype.slice.call(n.parentNode.children) : [];
      var idx = sibs.indexOf(n);
      n.style.transitionDelay = Math.min(idx, 5) * 70 + 'ms';
    });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });

    nodes.forEach(function (n) { io.observe(n); });
  }

  /* ---------- 2. 数字计数 ---------- */
  function setupCounters() {
    var nums = document.querySelectorAll('.hero-nums b, .case-numbers b');
    if (!nums.length || reduced) return;

    var run = function (el) {
      var raw = el.textContent.trim();
      var target = parseInt(raw.replace(/[^\d]/g, ''), 10);
      if (!isFinite(target) || target <= 0 || target > 99999) return;
      var suffix = raw.replace(/[\d]/g, '');
      var start = null, dur = 1100;
      var tick = function (ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      el.textContent = '0' + suffix;
      requestAnimationFrame(tick);
    };

    if (!('IntersectionObserver' in window)) { nums.forEach(run); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { run(e.target); io.unobserve(e.target); }
      });
    }, { threshold: 0.2 });
    nums.forEach(function (n) { io.observe(n); });
  }


  /* ---------- 5. 横向滚动卡片流 ---------- */
  function setupCarousel() {
    var track = document.getElementById('carTrack');
    if (!track) return;
    var prev = document.getElementById('carPrev');
    var next = document.getElementById('carNext');
    var fill = document.getElementById('carFill');

    function stepWidth() {
      var card = track.querySelector('.card');
      return card ? card.offsetWidth + 22 : 320;
    }

    function update() {
      var max = track.scrollWidth - track.clientWidth;
      var x = track.scrollLeft;
      if (fill) {
        var ratio = track.clientWidth / Math.max(track.scrollWidth, 1);
        var w = Math.max(ratio * 100, 10);
        var shift = max > 0 ? (x / max) * (100 - w) : 0;
        fill.style.width = w + '%';
        fill.style.transform = 'translateX(' + shift + '%)';
      }
      if (prev) prev.disabled = x <= 4;
      if (next) next.disabled = x >= max - 4;
    }

    if (prev) prev.addEventListener('click', function () {
      track.scrollBy({ left: -stepWidth(), behavior: 'smooth' });
    });
    if (next) next.addEventListener('click', function () {
      track.scrollBy({ left: stepWidth(), behavior: 'smooth' });
    });
    track.addEventListener('scroll', function () { requestAnimationFrame(update); }, { passive: true });

    /* 鼠标拖拽 */
    var down = false, startX = 0, startLeft = 0, moved = 0;
    track.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'touch') return;
      down = true; moved = 0; startX = e.clientX; startLeft = track.scrollLeft;
      track.classList.add('is-dragging');
    });
    window.addEventListener('pointermove', function (e) {
      if (!down) return;
      var dx = e.clientX - startX;
      if (Math.abs(dx) > 4) { moved = Math.abs(dx); track.scrollLeft = startLeft - dx; }
    });
    window.addEventListener('pointerup', function () {
      if (!down) return;
      down = false;
      track.classList.remove('is-dragging');
      setTimeout(function () { moved = 0; }, 60);
    });
    /* 拖拽结束时不要触发卡片点击 */
    track.addEventListener('click', function (e) {
      if (moved > 6) { e.preventDefault(); e.stopPropagation(); }
    }, true);

    /* 键盘左右 */
    track.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); track.scrollBy({ left: stepWidth(), behavior: 'smooth' }); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); track.scrollBy({ left: -stepWidth(), behavior: 'smooth' }); }
    });

    update();
    window.addEventListener('resize', update);
    track.__update = update;
  }

  /* ---------- 3. 胶囊筛选 ---------- */
  function setupTabs() {
    var bar = document.querySelector('.tabbar');
    if (!bar) return;
    var tabs = bar.querySelectorAll('.tab');
    var cards = document.querySelectorAll('.card[data-t]');
    if (!tabs.length || !cards.length) return;

    Array.prototype.forEach.call(tabs, function (btn) {
      btn.addEventListener('click', function () {
        Array.prototype.forEach.call(tabs, function (b) {
          b.classList.remove('is-active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('is-active');
        btn.setAttribute('aria-pressed', 'true');

        var track = document.getElementById('carTrack');
        var f = btn.dataset.f;
        Array.prototype.forEach.call(cards, function (card) {
          var show = (f === 'all' || card.dataset.t === f);
          if (show) {
            card.style.display = '';
            requestAnimationFrame(function () { card.classList.remove('is-filtered'); });
          } else {
            card.classList.add('is-filtered');
            setTimeout(function () {
              if (card.classList.contains('is-filtered')) card.style.display = 'none';
            }, 300);
          }
        });
        if (track) {
          track.scrollTo({ left: 0, behavior: 'smooth' });
          setTimeout(function () { if (track.__update) track.__update(); }, 320);
        }
      });
    });
  }

  /* ---------- 4. 顶栏滚动状态 ---------- */
  function setupTop() {
    var top = document.getElementById('top');
    if (!top) return;
    var fn = function () {
      top.classList.toggle('is-scrolled', window.scrollY > 24);
    };
    window.addEventListener('scroll', fn, { passive: true });
    fn();
  }

  function init() {
    setupReveal();
    setupCarousel();
    setupCounters();
    setupTabs();
    setupTop();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
