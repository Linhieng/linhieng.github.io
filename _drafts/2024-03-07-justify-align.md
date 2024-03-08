---
# layout has been set to post by default
title: css 中的 justify 和 align 样式
category: css
tags: [css, basic, justify, align]
---

## 样式介绍

直接通过网站学习每个样式的作用：[lim-w-justify-align &#124; linhieng](https://blog.linhieng.com/lim-w-justify-align/)

表格速查：

| props             | grid                                                       | flex                                                    |
| ----------------- | ---------------------------------------------------------- | ------------------------------------------------------- |
| `justify-content` | **水平**方向上单元格的对齐方式（单元格左右间隙的分配方式） | 定义**主轴**方向上每个 flex 子项的位置 (剩余空间的分配) |
| `align-content`   | **垂直**方向上单元格的对齐方式（单元格上下间隙的分配方式） | 定义**辅轴**方向上每个 flex 子项的位置 (剩余空间的分配) |
| `justify-self`    | 定义**当前** grid 子项在**单元格内**的水平方向上的对齐方式 | 被忽略                                                  |
| `justify-items`   | 定义**所有** grid 子项在**单元格内**的水平方向上的对齐方式 | 被忽略                                                  |
| `align-self`      | 定义**当前** grid 子项在**单元格内**的垂直方向上的位置     | 定义**当前** flex 子项在（虚拟单元格）辅轴方向上的位置  |
| `align-items`     | 定义**所有** grid 子项在**单元格内**的垂直方向上的位置     | 定义**所有** flex 子项在（虚拟单元格）辅轴方向上的位置  |

需要注意区分的有：

- -items 和 -content 的区别
  - -items 的值没有 `space-*`，而 -content 有

- align-items 和 align-content 在 grid 中的区别
  - align-items 的 start, center, end 仅仅只是在当前单元格内上下移动；
  - 而 align-content 是对整个 grid 容器进行上下移动。

- align-items 和 align-content 在 flex 中的区别
  - 不换行时，start, center, end 没有区别。
  - 换行时，align-items 的 start, center, end 只是在当前行的范围内上下移动（假设主方向是水平的）；
  - 而 align-content 的 start, center, end 的应用对象是将每一行的 flex 项看作一个整体，然后在 flex 容器中上下移动（假设主方向是水平的）；

- 使用 grid 和 flex 将元素上下左右居中的区别
    使用 grid 时，item 的子元素难以撑满父元素（item）；
    使用 flex 时，子元素可以撑满父元素（宽高为 100%）。

    <main>
        <div class="flex-container">
            <div class="flex-item"> flex </div>
        </div>
        <div class="grid-container">
            <div class="grid-item"> grid </div>
        </div>
    </main>
    <style>
        main {
            display: flex;
        }
        [class$=container] {
            width: 100px;
            height: 100px;
            margin: 15px;
            outline: 1px solid gray;
            & [class$=item] {
                width: 100%;
                height: 100%;
                background-color: skyblue;
            }
        }

        .flex-container {
            display: flex;
            place-content: center;
            place-items: center;
        }
        .grid-container {
            display: grid;
            place-content: center;
            place-items: center;
        }
    </style>

justify 和 align 涉及的所有样式：

- `justify-content` 分配的是主轴/水平方向上的**空间**
- `justify-self` 设置 grid 子项在单元格内水平方向上的位置
- `justify-items` 统一为每一个子项设置 justify-self 值
- `justify-tracks` 火狐专属（需显式开启）

- `align-content` 分配的是辅轴/垂直方向上的**空间**
- `align-self` 设置子项在辅轴方向上的位置
- `align-items` 统一为每一个子项设置 align-self 值
- `align-tracks` 火狐专属（需显式开启）

- `place-content` 是 align-content 和 justify-content 的缩写
- `place-items` 是 align-items 和 justify-items 的缩写
- `place-self` 是 align-self 和 justify-self 的缩写

- `text-align`
- `text-align-last`
- `ruby-align`
- `vertical-align`
- `text-justify`
