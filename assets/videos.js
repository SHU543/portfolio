/* 视频卡片：悬停静音自动播放，点击全屏并开声音 */
(function () {
  'use strict';
  document.querySelectorAll('.vid video').forEach(function (v) {
    v.muted = true;
    v.loop = true;
    v.playsInline = true;
    v.preload = 'none';
    v.addEventListener('mouseenter', function () {
      var p = v.play();
      if (p && p.catch) p.catch(function () {});
    });
    v.addEventListener('mouseleave', function () {
      v.pause();
    });
    v.addEventListener('click', function () {
      v.muted = false;
      if (v.requestFullscreen) {
        v.requestFullscreen().catch(function () { v.play(); });
      } else {
        v.play();
      }
    });
  });
})();
