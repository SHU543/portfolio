/* 光标跟随：小点 + 外环，悬停可点元素时放大并显示文字 */
(function () {
  'use strict';
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.matchMedia('(hover: none)').matches) return;   // 触屏不做

  var style = document.createElement('style');
  style.textContent = [
    '.cur-dot,.cur-ring{position:fixed;left:0;top:0;pointer-events:none;z-index:9500;',
    'will-change:transform;transform:translate3d(-100px,-100px,0)}',
    '.cur-dot{width:6px;height:6px;border-radius:50%;background:#4dabf5;',
    'transition:opacity .2s,width .2s,height .2s}',
    '.cur-ring{width:34px;height:34px;border-radius:50%;',
    'border:1px solid rgba(77,171,245,.55);',
    'transition:width .22s cubic-bezier(.2,.7,.2,1),height .22s cubic-bezier(.2,.7,.2,1),',
    'opacity .22s,background .22s,border-color .22s;',
    'display:flex;align-items:center;justify-content:center;',
    'font-size:10px;letter-spacing:.14em;color:#04070a;font-weight:700}',
    '.cur-ring.is-hot{width:56px;height:56px;background:rgba(33,150,243,.16);',
    'border-color:rgba(120,200,255,.95)}',
    '.cur-ring.is-hot::before{content:"";width:6px;height:6px;border-radius:50%;',
    'background:#8fd4ff}',
    '.cur-dot{transition:opacity .2s,transform .18s,background .18s}',
    'body{cursor:auto}'
  ].join('');
  document.head.appendChild(style);

  var dot = document.createElement('div'); dot.className = 'cur-dot';
  var ring = document.createElement('div'); ring.className = 'cur-ring';
  document.body.appendChild(dot); document.body.appendChild(ring);

  var mx = -100, my = -100, rx = -100, ry = -100, dx = -100, dy = -100;

  document.addEventListener('pointermove', function (e) {
    mx = e.clientX; my = e.clientY;
  }, { passive: true });

  document.addEventListener('pointerleave', function () {
    dot.style.opacity = '0'; ring.style.opacity = '0';
  });
  document.addEventListener('pointerenter', function () {
    dot.style.opacity = '1'; ring.style.opacity = '1';
  });

  var HOT = 'a, button, .btn, .wk, .card, .tab, .wk-pill, .car-btn, .feat-media, .nxt a, .docs a';
  var TEXT = '.wk, .feat-media, .card, .nxt a';

  document.addEventListener('pointerover', function (e) {
    var t = e.target.closest ? e.target.closest('a, button, .wk, .card, .tab, .wk-pill, .car-btn, .feat-media, .docs a') : null;
    ring.classList.toggle('is-hot', !!t);
  });

  function tick() {
    dx += (mx - dx) * 0.55; dy += (my - dy) * 0.55;
    rx += (mx - rx) * 0.16; ry += (my - ry) * 0.16;
    dot.style.transform = 'translate3d(' + (dx - 3) + 'px,' + (dy - 3) + 'px,0)';
    ring.style.transform = 'translate3d(' + (rx) + 'px,' + (ry) + 'px,0) translate(-50%,-50%)';
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();
