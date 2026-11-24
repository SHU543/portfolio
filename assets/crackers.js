/* 点击粒子 + 波纹：配合深色 + 蓝绿强调色
   桌面鼠标、触屏都支持；prefers-reduced-motion 时自动关闭 */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) {
    window.Crackers = { burst: function () {} };
    return;
  }

  var COLORS = ['#2196f3', '#4dabf5', '#a5fecb', '#ffffff'];

  var canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:9000';
  var ctx = canvas.getContext('2d');
  var parts = [], rings = [], dpr = 1, W = 0, H = 0;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);

  function spawn(x, y, n) {
    for (var i = 0; i < n; i++) {
      var a = Math.random() * Math.PI * 2;
      var sp = 1.8 + Math.random() * 5.2;
      parts.push({
        x: x, y: y,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp - 1.2,
        r: 1.2 + Math.random() * 2.6,
        life: 1,
        decay: 0.012 + Math.random() * 0.02,
        color: COLORS[(Math.random() * COLORS.length) | 0],
        square: Math.random() > 0.65
      });
    }
    rings.push({ x: x, y: y, r: 4, life: 1 });
    if (!running) { running = true; requestAnimationFrame(loop); }
  }

  var running = false;
  function loop() {
    ctx.clearRect(0, 0, W, H);

    for (var i = parts.length - 1; i >= 0; i--) {
      var p = parts[i];
      p.vy += 0.16;          // 重力
      p.vx *= 0.985;         // 阻尼
      p.x += p.vx; p.y += p.vy;
      p.life -= p.decay;
      if (p.life <= 0) { parts.splice(i, 1); continue; }
      ctx.globalAlpha = Math.max(p.life, 0);
      ctx.fillStyle = p.color;
      if (p.square) {
        ctx.fillRect(p.x - p.r, p.y - p.r, p.r * 2, p.r * 2);
      } else {
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      }
    }

    for (var j = rings.length - 1; j >= 0; j--) {
      var ring = rings[j];
      ring.r += 5.2;
      ring.life -= 0.035;
      if (ring.life <= 0) { rings.splice(j, 1); continue; }
      ctx.globalAlpha = Math.max(ring.life, 0) * 0.55;
      ctx.strokeStyle = '#4dabf5';
      ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.arc(ring.x, ring.y, ring.r, 0, Math.PI * 2); ctx.stroke();
    }

    ctx.globalAlpha = 1;
    if (parts.length || rings.length) {
      requestAnimationFrame(loop);
    } else {
      running = false;
      ctx.clearRect(0, 0, W, H);
    }
  }

  function onDown(e) {
    var x = e.clientX, y = e.clientY;
    if (e.touches && e.touches[0]) { x = e.touches[0].clientX; y = e.touches[0].clientY; }
    spawn(x, y, 16);
  }

  document.addEventListener('pointerdown', onDown, { passive: true });
  document.body.appendChild(canvas);

  window.Crackers = { burst: function (x, y, n) { spawn(x, y, n || 18); } };
})();
