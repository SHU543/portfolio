# 作品集（参考 unity.cn 排版）

> 纯静态、零依赖、双击 `index.html` 即可。样式只有 `assets/dark.css`，数据在 `assets/data.js`。

## 排版语言（来自 unity.cn）

| unity.cn 的做法 | 这里的实现 |
|---|---|
| 黑色实底顶栏 + 白色导航 + 右侧胶囊按钮 | `.top`（64px 高、`#0a0a0b`、胶囊 `简历 PDF`） |
| 全幅影像首屏 + 居中叠字 | `.hero`（100vh、`hero-bg` 图 + 径向暗角，内容居中） |
| 小字两行在上、超粗大标题在下 | `.hero-kicker` + `h1`（Noto Sans SC，700，两行） |
| 胶囊描边按钮，hover 反白 | `.btn`（46px 高、999px 圆角，`--solid` 为蓝色实心） |
| 无衬线（Noto Sans SC）+ 蓝色强调 #2196F3 | `--sans` / `--accent` |
| 卡片 4–6px 圆角 | `.card`（8px）、`.paths > *`（8px）、`.docs a`（8px） |
| 分屏区块、居中标题 + 英文小标 | `.sec-head`（`.en` 蓝色大写 + 中文标题 + 一行说明） |
| 居中大 CTA + 胶囊链接 | `.cta` |
| 全屏高清影像、深色渐变遮罩 | 案例页 `.case-hero`（封面图 + 双层渐变） |

## 页面结构

```
index.html      首屏（全幅影像 + 居中标题 + 三数字）+ 精选 6 件（3 列）+ 三条路径 + 联系我
├─ game.html    居中式页头 + 4 个案例（2 列）+ 能力与职责 + 其他方向
├─ ai.html      居中式页头 + 4 张卡 + 工作流四步 + 其他方向
├─ bonus.html   居中式页头 + 4 张卡 + 能独立完成的活 + 其他方向
└─ work.html    案例页：全幅封面 + 居中标题 → 四格元信息 → 三数字 → 做法 → 图流 → 结果 → 交付物 → 下一个
   ?p=<id>     9 个主推案例
   ?slug=<slug> 73 件站点作品
```

## 设计规则（改动时守住）

- 底色 `#000`／卡片底 `#141416`；正文 `#fff`，次要 `#b3b3b3`，弱化 `#8a8a8a`
- 唯一强调色 `#2196F3`（蓝），只用于小号英文标、卡片序号、激活态
- 字体统一无衬线（Noto Sans SC / 苹方 / 微软雅黑），标题 700，不用衬线体
- 圆角：卡片 8px、胶囊 999px；细线 `rgba(255,255,255,.12)`
- 首屏 100vh；每个区块居中标题；案例页图可整幅出血，超高图限高 1100px

## 数据字段（`assets/data.js` → `window.PROJECTS`）

`no / kindLabel / year / title / shortTitle / sub / role / time / tools / output / facts / background / challenge / process / result / retro / figures / deliverables / cover`

## 占位与待办

- 页头「简历 PDF」与页尾联系方式仍是占位。
- 关卡场景概念 4 组无原图，未进主推。
- 旧版（浅色杂志式 / 早期深色衬线式）备份在 `../proto.bak/`。

## 动效与交互（对齐 unity.cn）

文件：`assets/motion.css` + `assets/motion.js`（无依赖，约 6KB）

| 交互 | 触发 | 实现 |
|---|---|---|
| 滚动淡入上移 | 进入视口 | IntersectionObserver → `.reveal.is-in`，同组错开 70ms |
| 数字计数 | 进入视口 | `requestAnimationFrame` 缓动到目标值 |
| 二级胶囊筛选 | 点「全部 / 游戏 / AIGC / 复合技能」 | 卡片淡出缩放后 `display:none`，再淡入 |
| 吸顶胶囊条 | 首屏之下 | `position:sticky; top:64px` + 毛玻璃 |
| 整屏分栏聚焦 | 悬停某列 | 其余列压暗、当前列放大，说明文字上浮 |
| 左文右图拼贴 | 悬停 | 三张图轻微位移与旋转 |
| 卡片悬停 | 悬停 | 上移 3px + 图片放大 1.04 |
| 顶栏状态 | 滚动 > 24px | 阴影/描边加深 |

无障碍：`prefers-reduced-motion: reduce` 时全部动效关闭、内容直接可见。

## 精选作品：横向滚动卡片流

- 结构：.carousel > .car-track（flex + overflow-x + scroll-snap）+ 左右圆形按钮 + 进度条
- 交互：点箭头按一卡宽度滚动；鼠标可拖拽；触屏原生滑动；键盘 ←/→ 可滚
- 视觉：右缘渐隐提示还有内容；拖拽后不会误触卡片跳转
- 手机：一屏 84vw 一卡，箭头隐藏，靠滑动
- 筛选：上方胶囊条照旧生效，切换后自动回到最左

## 视觉作品页 works.html（73 件）

- 数据来自 `assets/data.js` 的 `window.WORKS`（73 条），图片映射为自动生成的
  `window.WORK_IMGS`（原图，灯箱用）与 `window.WORK_THUMBS`（760px 缩略图，网格用）
- 布局：CSS 多列瀑布流（1600 宽 4 列 / 1200 宽 3 列 / 820 宽 2 列 / 520 宽 1 列）
- 筛选：按 `tags[0]` 自动生成 22 个类别胶囊，带数量
- 灯箱：大图 + 标题 + 副标题 + 年份 + 说明 + 亮点；左右切换、键盘 ←/→、ESC 关闭、点背景关闭
- 图片加载失败自动隐藏该件，不会出现黑块

## 点击特效（全站）

`assets/crackers.js`：点击/触摸时在落点迸发 16 个彩色粒子（蓝 #2196f3 / 浅蓝 #4dabf5 / 薄荷 #a5fecb / 白）
+ 一圈扩散波纹，重力与阻尼模拟自然下坠；`prefers-reduced-motion: reduce` 时整段关闭。
灯箱打开时会额外在中屏爆一次。
