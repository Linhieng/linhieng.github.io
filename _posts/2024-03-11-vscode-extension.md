---
# layout has been set to post by default
title: 开发 vscode 扩展时，可记录的相关知识点
category: vs
tags: [vs, vscode-extension]
---

该文章旨在记录我的 vscode 扩展（比如 [vs-misc](https://github.com/Linhieng/vs-misc.git)）的开发流程。

由于网络上有关开发 vscode 扩展的文章几乎已经烂大街了，我只有在第一次开发 vscode 扩展时，才发现那些文章有点价值，但当我开发过几个自己的扩展后，就发现这些文章对我来说太过“啰嗦”（非贬义）了，而且版本太旧了。我现在所需要的知识点，几乎都是通过官方文档，或者 GitHub 上的 issue 搜索，或者直接通过 vscode 的 ts 类型查看注释得来的。但考虑到我也不是专门开发 vscode 扩展的，时间一久可能有些太简单的内容也会忘记，所以这里简单记录一下，方便自己以后一看就懂。

本文章虽然会持续更新，但考虑到还没有形成我喜欢的知识体系，所以并没有在个人博客中发布。

此外，本文中持续内容是自下而上的，也就是下面的内容是旧内容，上面的内容是新内容。

---

## 编辑内容、和需要熟记的 Range, Selection 和 Position

具体内容直接在开发时查看类型声明文件（优秀的项目，它的注释就是文档）。这里只做简单说明

`Position` 相当于编辑器中的坐标，通过 line (第几行) 和 character (第几列) 可以唯一确定一个位置

`Range` 表示一个范围 (start, end)，它提供了很多方便的 api，比如光标是非有选择内容，两个范围是否相同等等，

`Selection` 继承自 `Range`，表示光标选择的内容，anchor 表示描点，也就是选择的开始，active 表示光标位置。

对编辑器中的内容进行更改时，可以使用 `vscode.window.activeTextEditor.edit`，需要注意一点的是，如果编辑多行光标内容时，应该是一次性在该函数中编辑，而不是循环调用该编辑函数。下面是从项目中提取处理的代码，以进行说明

❌错误示例

```ts
// 获取当前编辑器中的多个光标位置
const selections = editor.selections
selections.forEach(selection => {
    // 通过循环调用编辑函数来编辑内容？❌
    void editor.edit(editBuilder => {
        editBuilder.insert(selection.active, 'xx')
    })
})
```

✅正确示例

```ts
// 获取当前编辑器中的多个光标位置
const selections = editor.selections
// 一次性完成编辑！
void editor.edit(editBuilder => {
    selections.forEach(selection => {
        editBuilder.insert(selection.active, 'xx')
    })
})
```

参考自：https://github.com/microsoft/vscode/issues/5886

## 需要熟记的 vscode UI 图

![alt text](https://code.visualstudio.com/assets/api/ux-guidelines/examples/architecture-containers.png)

---

![alt text](https://code.visualstudio.com/assets/api/ux-guidelines/examples/architecture-sections.png)

## 基本通用流程

官方文档：[Get Started](https://code.visualstudio.com/api/get-started/your-first-extension)

1. 创建项目

```sh
npx --package yo --package generator-code -- yo code

# 或者

npm install --global yo generator-code

yo code
```

2. 编辑对应文件

- [package.json] 参考 [extension-manifest]
- [tsconfig.json] 参考 [extension-manifest]
- [eslint.config.js] 参考 [typescript-eslint]
- [esbuild.config.js] 使用 esbuild 进行打包
- [build.js] 编写自己的打包脚本
- [tasks.json] 添加一个 tasks 任务，用于调试扩展。至于 [launch.json] 文件，可直接使用默认生成的

在 package.json 文件中，注意是修改必要的插件信息（如 name, publisher, version, engines）。还有配置打包 (package) 和发布 (publish) 脚本。

此外，目前最新(2024-03-11)打包扩展的命令是 `@vscode/vsce` 而不是以前的 `vsce`

3. 发布扩展到应用商城

发布前注意，虽然扩展的 ID(Identifier) 由 `publisher` 字段和 `name` 字段组成，但还是要求你的 `name` 字段在整个扩展市场中唯一。

发布流程核心步骤如下：

1. 进入[插件市场][vs-marketplace]，点击右上角的 "Publish extensions"。（需要登录时按照提示进行登录，比如可以通过 GitHub 账户登录）
2. 初次发布时，需要创建一个 publisher，名称要和 package.json 中的 `publisher` 字段相同
3. 然后就可以通过命令 `npx @vscode/vsce publish` 将插件发布到公共插件市场了

运行命令时，会提示你输入一个密钥，或者密钥的方式如下：

1. 还是进入[插件市场][vs-marketplace]，然后点击右上角的 Alan(linhieng@qq.com)
2. 此时会进入 [aex.dev.azure.com/me](https://aex.dev.azure.com/me)
3. 如果初次进入，那么就需要先创建一个组织，跟着提示进行创建
4. 如果已有组织，点击进入该组织，网址通常是 `https://dev.azure.com/<组织的名称>`
5. 进入组织后，不需要创建新项目，直接点击右上角的用户设置图标，选择个人密钥 (personal access tokens)
6. 然后创建一个新密钥 (new token)，作用域 (scopes) 选择全局 (full access) 就可以了。
7. 复制生成的密钥，粘贴到刚刚的命令终端里面

---

[package.json]: https://github.com/Linhieng/vs-misc/blob/main/package.json
[eslint.config.js]: https://github.com/Linhieng/vs-misc/blob/main/eslint.config.js
[esbuild.config.js]: https://github.com/Linhieng/vs-misc/blob/main/esbuild.config.js
[tsconfig.json]: https://github.com/Linhieng/vs-misc/blob/main/tsconfig.json
[build.js]: https://github.com/Linhieng/vs-misc/blob/main/build.js
[tasks.json]: https://github.com/Linhieng/vs-misc/blob/main/.vscode/tasks.json
[launch.json]: https://github.com/Linhieng/vs-misc/blob/main/.vscode/launch.json

[extension-manifest]: https://code.visualstudio.com/api/references/extension-manifest
[typescript-eslint]: https://typescript-eslint.io/getting-started/
[vs-marketplace]: https://marketplace.visualstudio.com/
