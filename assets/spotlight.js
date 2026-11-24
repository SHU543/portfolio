/* 鼠标跟随聚光（效果 10 的轻量版）
   - 一团柔和的冷光跟着鼠标，screen 混合，只提亮不遮挡
   - 移到图片/卡片上时光会收紧、变亮，像手电筒扫过
   - 触屏 / 减少动态效果 自动关闭；不替换系统光标 */
(function () {
  'use strict';
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.matchMedia('(hover: none)').matches) return;

  var style = document.createElement('style');
  style.textContent = [
    '#spotlight{position:fixed;left:0;top:0;width:100vw;height:100vh;pointer-events:none;',
    'z-index:9400;mix-blend-mode:screen;opacity:0;transition:opacity .35s ease}',
    '#spotlight.on{opacity:1}',
    '#spotlight i{position:absolute;left:0;top:0;width:520px;height:520px;border-radius:50%;',
    'transform:translate3d(-50%,-50%,0);will-change:transform;',
    'background:radial-gradient(circle closest-side,'
      + 'rgba(120,190,255,.16) 0%,'
      + 'rgba(90,170,255,.10) 38%,'
      + 'rgba(60,140,255,.045) 62%,'
      + 'rgba(0,0,0,0) 78%);',
    'transition:width .3s ease,height .3s ease,background .3s ease}',
    '#spotlight.hot i{background:radial-gradient(circle closest-side,'
      + 'rgba(150,210,255,.26) 0%,'
      + 'rgba(90,170,255,.16) 40%,'
      + 'rgba(60,140,255,.07) 64%,'
      + 'rgba(0,0,0,0) 80%)}',
    '@media (max-width:760px){#spotlight{display:none}}'
  ].join('');
  document.head.appendChild(style);

  var wrap = document.createElement('div');
  wrap.id = 'spotlight';
  var glow = document.createElement('i');
  wrap.appendChild(glow);
  document.body.appendChild(wrap);

  var mx = -600, my = -600, x = -600, y = -600, hot = false;

  document.addEventListener('pointermove', function (e) {
    mx = e.clientX; my = e.clientY;
  }, { passive: true });
  document.addEventListener('pointerleave', function () { wrap.classList.remove('on'); });
  document.addEventListener('pointerenter', function () { if (mx > -500) wrap.classList.add('on'); });
  document.addEventListener('pointerover', function (e) {
    var t = e.target.closest ? e.target.closest('a, button, .wk, .card, .feat-media, .case-body img, video') : null;
    if (!!t !== hot) { hot = !!t; wrap.classList.toggle('hot', hot); }
  });

  function tick() {
    x += (mx - x) * 0.18;
    y += (my - y) * 0.18;
    glow.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0) translate(-50%,-50%)';
    if (mx > -400) wrap.classList.add('on');
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();
