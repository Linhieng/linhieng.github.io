---
# the default layout is 'page'
icon: fas fa-info-circle
order: 4
---


<img src="./hello.svg" alt="">

<input type="radio" name="lang" id="en" checked />
<input type="radio" name="lang" id="zh" />
<div align="center" id="info">
    <label id="en-label" for="en">English</label>
    <label id="zh-label" for="zh">中文</label>
    <p id="en-info"> Hello! Welcome to my blog.</p>
    <p id="zh-info"> 哈喽！欢迎来到我的个人博客。</p>
</div>

<style>
  #en,#zh {opacity: 0; pointer-events: none;}
  #info {
      display: grid;
      grid-template-areas:
          "en zh"
          "info info";
      grid-template-columns: max-content 1fr;
      column-gap: 20px;
      row-gap: 10px;
      justify-items: start;
  }
  #en-label {grid-area: en; cursor: pointer;}
  #zh-label {grid-area: zh; cursor: pointer;}
  #info p { grid-area:info; display: none;     text-align: start;}
  #en:checked ~ #info #en-info {display: block;}
  #zh:checked ~ #info #zh-info {display: block;}
</style>


专业技能：

- 基础核心
  - HTML 熟练
  - CSS 熟练
  - JavaScript 熟练
  - TypeScript 掌握
  - Git 掌握
  - NodeJs 掌握
- 框架
  - Vue3 掌握
  - Vue-Route 掌握
  - Element-Plus 掌握
  - Mysql / [Mysql2]
  - [ECharts] 用过

个人兴趣

- 插件
  - vscode extension
  - browser extension
- 命令行
  - FFmpeg
  - ImageMagick
  - ExifTool
- Python
  - NumPy
  - Pandas
  - Matplotlib

## 个人作品

- 复刻
  - [animal-pieces]
  - [homework-mdn]
  - ...（旧项目等待上传GitHub）
- 原创
  - [symbol-transform]

## 了解的技术

- Vue 生态
  - Vue3 掌握
  - Vue-Route 掌握
  - Element-Plus 掌握
  - Vite
  - Pinia
  - Vitest
  - [rolldown]（待学）
  - [nuxt]（待学）
- 其他
  - Express 掌握
  - Rollup 用过
  - MongoDB / mongoose 学过
  - Mysql / Mysql2
  - [ajv]
  - Docker
  - [Pug]
- 数据可视化
  - [ECharts] 用过
  - [D3]
  - [Vega]
  - [G2]
- 不常用
  - Webpack 学过
  - react 学过
  - svelte 学过
  - jQuery 学过
  - 微信小程序 学过
- 学习中
  - [Rust]
- 待学习的技术（优先级高）
  - [Flutter]
  - [Electron]
  - [Qwik]
- 等待学习的技术
  - [Solid]
  - [Lit]
  - [Ruby]
  - [astro]
  - [quasar]
  - [ionicframework]
  - [tauri]
  - [next]
  - [Deno]
  - [Bun]
  - [Rspack]
  - [htmx]
  - [Remix]
- 样式
  - [tailwindcss]
  - [purgecss]
  - [naiveUI]
  - [HintCSS]
  - [vant]
  - [AntDesign]
  - [SurelyVue]
  - [gasp]
- WebGL
  - [ThreeJS]
  - [spriteJS]
  - [meshJS]
  - [doodle]
  - [社区 shadertoy][shadertoy]

---

[animal-pieces]: https://blog.linhieng.com/animal-pieces/
[homework-mdn]: https://blog.linhieng.com/homework-mdn/
[symbol-transform]: https://blog.linhieng.com/symbol-transform/

[Rust]: https://www.rust-lang.org/
[Ruby]: https://www.ruby-lang.org/
[Flutter]: https://flutter.dev/
[Electron]: https://www.electronjs.org/
[rolldown]: https://rolldown.rs/
[quasar]: https://quasar.dev/
[ionicframework]: https://ionicframework.com/
[tauri]: https://tauri.app/
[astro]: https://astro.build/
[qwik]: https://qwik.dev/
[nuxt]: https://nuxt.com/
[next]: https://nextjs.org/
[Deno]: https://deno.com/
[Bun]: https://bun.sh/
[Rspack]: https://www.rspack.dev/
[Solid]: https://www.solidjs.com/
[htmx]: https://htmx.rog/
[Remix]: https://remix.run/
[Lit]: https://lit.dev/Lit
[ajv]: https://ajv.js.org/

[ThreeJS]: https://threejs.org/
[meshJS]: https://meshjs.webgl.group/demo/#/docs/index
[doodle]: https://doodle.webgl.group/demo/#/getting_start
[spriteJS]: http://spritejs.com/demo/#/quick_start
[shadertoy]: https://www.shadertoy.com/

[tailwindcss]: https://tailwindcss.com/
[purgecss]: https://purgecss.com/
[naiveUI]: https://www.naiveui.com/
[HintCSS]: https://kushagra.dev/lab/hint/
[vant]: https://vant-ui.github.io/vant/#/
[AntDesign]: https://www.antdv.com/components/overview
[SurelyVue]: https://www.surely.cool/
[gasp]: https://gsap.com/

[ECharts]: https://echarts.apache.org/
[D3]: https://d3js.org/
[Vega]: https://vega.github.io/vega/
[G2]: https://g2.antv.vision

[Pug]: https://pugjs.org/api/getting-started.html
[Mysql2]: https://www.npmjs.com/package/mysql2
