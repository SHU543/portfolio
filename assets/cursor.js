/* 光标跟随：只保留一个小圆点，没有外圈、没有文字
   - 悬停可点元素时，圆点轻微放大并变蓝
   - 触屏设备 / prefers-reduced-motion 自动关闭
   - 不替换系统箭头，避免可用性问题 */
(function () {
  'use strict';
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.matchMedia('(hover: none)').matches) return;

  var style = document.createElement('style');
  style.textContent = [
    '.cur-dot{position:fixed;left:0;top:0;width:6px;height:6px;border-radius:50%;',
    'background:#9adcff;pointer-events:none;z-index:9500;will-change:transform,width,height,opacity;',
    'transform:translate3d(-100px,-100px,0);',
    'transition:width .18s ease,height .18s ease,background .18s ease,opacity .25s ease}',
    '.cur-dot.is-hot{width:11px;height:11px;background:#ffffff}',
    '.cur-dot.is-out{opacity:0}'
  ].join('');
  document.head.appendChild(style);

  var dot = document.createElement('div');
  dot.className = 'cur-dot';
  document.body.appendChild(dot);

  var mx = -100, my = -100, x = -100, y = -100;

  document.addEventListener('pointermove', function (e) {
    mx = e.clientX; my = e.clientY;
    dot.classList.remove('is-out');
  }, { passive: true });
  document.addEventListener('pointerleave', function () { dot.classList.add('is-out'); });
  document.addEventListener('pointerenter', function () { dot.classList.remove('is-out'); });

  document.addEventListener('pointerover', function (e) {
    var t = e.target.closest ? e.target.closest('a, button, .wk, .card, .tab, .wk-pill, .car-btn, .feat-media, .docs a, video') : null;
    dot.classList.toggle('is-hot', !!t);
  });

  function tick() {
    x += (mx - x) * 0.42;
    y += (my - y) * 0.42;
    dot.style.transform = 'translate3d(' + (x - 3) + 'px,' + (y - 3) + 'px,0)';
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();
