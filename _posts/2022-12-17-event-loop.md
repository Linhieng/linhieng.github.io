---
# layout has been set to post by default
title: 事件循环相关内容
category: js
tags: [js, event-loop, microtask, macrotask, concept, expert]
# img_cdn: {{ site.baseurl | append: '/img/' | append: page.basename }}
img_cdn: {{ site.baseurl }}
---

TODO:

- 笔记距今太久，内容需要重新描述
- 使用 diagrams 绘制相关图片，并保存为 svg

## 🍕 涉及到的概念

- 事件循环 (`Event Loop`)
- `宏任务` (macrotask)
- `宏任务队列` (macrotask queue)。在 [WHATWG specification] 中被简单地称为 **task queue**。<cite><sup>[1]</sup></cite>
- `微任务` (microtask)
- `微任务队列` (microtask queue)
- `执行栈`, 或调用栈 (Call Stack)
- `任务队列` (Task Queue, Event Queue), 我这里将 `宏任务队列` 和 `微任务队列` 统称为 `任务队列`
- 异步编程 (asynchronous programming)
- 单线程 (single-thread)

## 🍕 通过一段代码, 来简单认识 Event Loop

我这里先做定义一个 `异步任务源`, 任务源可以分配任务, `异步任务源` 就是专门分配 `异步任务` 的。这个想法来自 [task-source | WHATWG]。我这里不对定义做过多说明，直接看我的例子, 你应该就明白我想表达什么了：

比如 `setTimeout(callback)` 中的 `setTimeout` 是一个 `异步任务源`, 它的参数 `callback` 就是一个 `异步任务`, `setTimeout` 本身的执行是同步的, 只不过在它执行的过程中, 它创建一个 `异步任务`, 这个 `异步任务` 不会立马执行。

```js
function test () {
  console.log('1') // f1
  setTimeout(fn, delay/* 假设是500ms */) // f2
  console.log('2') // f3
}
;(function main () {
  test()
})()
```

我专门画了一张图, 来简单描述一下过程

![](/img/2022-12-17-event-loop/event-loop.drawio.svg){: width="700" }
_Event Loop_

1.  首先, `main()` 会进入 `执行栈`, 然后 `执行栈` 会自上而下执行该函数中的各条语句
2.  在执行语句的过程中, 如果遇到形如同步函数, 比如 `test()`, 那么它会先等待其执行完毕, 也就是会将 `test()` 压入栈, 然后继续执行 `test()` 中的各条语句
3.  在执行 `f1` 时, `执行栈` 又遇到了同步函数 `console.log`, 于是它继续先等待其执行完毕, 也就是会先等屏幕输出 `1`, 然后才继续开始下一条语句
4.  接着, `执行栈` 遇到了 `异步任务源`, 也就是 `setTimeout`, 于是他会将 `setTimeout` 分配的 `异步任务`(包含 fn 和 delay) 送到某个区域, 这个区域我们先称其为 **异步模块** (在浏览器环境中叫 APIs), 然后 `执行栈` 就会继续执行下一条语句了。注意此时 fn 并没有执行。

> `APIs` 的执行由浏览器单独负责, 他和 JS 的单线程没有关系。记住: JS 是单线程的, 但浏览器是多线程的。 <cite><sup>[2]</sup></cite>

1.  `执行栈` 接着执行, 然后会输出 `2`, 此时主函数执行完, `执行栈` 中没有其他的任务需要执行了。
2.  当 `执行栈` 为空时, 会让 `Event Loop` 从一个区域中取出新的任务执行, 这个区域我们称之为 `任务队列`, `任务队列` 中的任务都是等待程序处理的任务, 这些任务的来源就是我们刚刚提到的 **异步模块**。因为此时时间还没有过去太久(不足500ms), 所以 `任务队列` 为空, `执行栈` 也为空
3.  **异步模块** 每过一段时间就会查看一下它维护的那些 `异步任务`, 经过大约 500ms(实际数值肯定大于500ms) 后, **异步模块** 发现有一个 `异步任务`(fn) 可以执行了, 于是将这个 fn 发送给 `任务队列`, 此时 `任务队列` 不为空
4.  `执行栈` 为空, 并且 `任务队列` 有任务在等待执行, 于是 `Event Loop` 从中取出任务(fn), 并发送到 `执行栈` 中执行, 于是 `执行栈` 继续执行, 并输出了 `3`

从上面的步骤可以看到, 一个重要的时间点就是 `执行栈` 为空, 并且这个时间点后, 相关操作都是由 `Event Loop` 处理的, `Event Loop` 负责调控整个流程。 当然 **异步模块** 中的内容是另外的一部分, 正因如此, 当 `执行栈` 中执行任务时, **异步模块** 可以对异步任务进行计时。

总的来说, `执行栈` 执行任务, 执行完后, 就会让 `Event Loop` 从 `任务队列` 中取出新的任务送到 `执行栈` 中执行。注意, 当 `执行栈` 不为空时, `任务队列` 中的任务是无法进入 `执行栈` 中执行的。

现在, 让我们了解两个新名词, `宏任务` 和 `微任务`, 前面的 `异步任务` 并不是常见的名词, 而是我自己在此处定义的名词, `异步任务` 其实就是 `宏任务` 和 `微任务` 的总称。

## 🍕 宏任务和微任务

`宏任务` 和 `微任务` 是两类不同的 **异步** 任务。<cite><sup>[3]</sup></cite>

`宏任务队列` 的数据结构 **不是队列**, 而是 **集合**。<cite><sup>[4]</sup></cite>
记住这个概念很重要, 因为队列是有序的, 而集合是无序的, 所以在 `宏任务队列` 中, 先到达的任务 **不一定** 会先执行。

`微任务队列` 的数据结构是 **队列**, 所以 `微任务队列` 中任务的执行一定是有序的。`微任务队列` 还有这么一个特点, 当 `微任务队列` 中的 `微任务` 开始执行时, 它可以继续添加新的 `微任务` 到 `微任务队列` 中, 并且 `微任务队列` 一旦开始执行, 就会执行到 `微任务队列` 为空。换句话说, 如果不断的有新的 `微任务` 加入到 `微任务队列` 中来, 那么 `宏任务` 将不断的被阻塞, 无法执行。这种情况导致的最常见的后果就是页面无法响应你的鼠标或者滚轮, 因为与用户的交互是属于 `宏任务`。~~为了处理无限递归的 `微任务`, 听说以前的 Nodejs 中, 会提供一个机制来限制最大的递归数量, 但我没有在官方文档中找到具体的内容。[from1], [from2]~~

`微任务队列` 中的任务会一次性执行完, 带来的好处是它确保了每一个 `微任务` 之间的应用程序环境基本相同（没有鼠标坐标更改，没有新的网络数据等）。<cite><sup>[5]</sup></cite>

如果要给 `微任务` 和 `宏任务` 定一个优先级, 那么你可以认为 `微任务` 的优先级更高。但我认为, 与其记住谁的优先级更高, 不如记住这么一句话: **每一个宏任务执行之前, 必须确保微任务队列为空**。<cite><sup>[6]</sup></cite>

下面给出已知的 `宏任务` 和 `微任务`

- 宏任务
    - `setTimeout`
    - `setInterval`
    - `setImmediate` (Node 独有)
    - `requestAnimationFrame` (浏览器独有)
    - I/O
    - UI rendering (浏览器独有)
- 微任务
    - `process.nextTick` (Node 独有)
    - Promises (准确的说是 Promise.then() 中 then 的回调函数, 而不是 new promise(callback) 携带的回调函数)
    - `Object.observe`
    - `MutationObserver`
    - `queueMicrotask`

## 🍕 通过一段代码来理解宏任务和微任务

```js
setTimeout(() => { // l-1
  console.log("宏任务: 计时任务1") // l-3
  Promise.resolve().then(() => { // l-4
    console.log("微任务1") // l-5
  })
}, 500);

setTimeout(() => { // l-2
  console.log("宏任务: 计时任务2") // l-6
  Promise.resolve().then(() => { // l-7
    console.log("微任务2") // l-8
  })
}, 500);
```

先讨论真正有用的, 也就是Node11之后版本和浏览器的版本, 下面以浏览器内核进行解释:

- `l-数字` 代表某行代码
- `APIs` 是浏览器中的一个机制, 详细的结果不清楚, 只知道一些异步API的处理, 都是由它进行处理的, 当异步函数执行完毕时, 也是由它负责发送给 `任务队列`。<cite><sup>[7]</sup></cite>
- `宏任务队列`, 由宏任务组成的队列, 宏任务队列分为 **计时器队列** (Expired Timer Callbacks, 即到期的setTimeout/setInterval)、**IO事件队列**(I/O Events)、**即时队列** (Immediate Queue, 即 setImmediate)、**关闭事件处理程序队列** (close Handlers)。<cite><sup>[8] [9]</sup></cite>
- `微任务队列`, 由微任务组成的队列

1.  首先, 浏览器自上而下的执行(执行的过程中 `执行栈` 中进行), 先执行 `l-1`, 发现是 `setTimeout`, 于是将它的参数(callback,delay)发送给 `APIs`
2.  然后继续识别 `l-2`, 发现又是 `setTimeout`, 于是继续将它的参数发送给 `APIs`
3.  `APIs` 接收到 `setTimeout` 的内容后, 会进行计时, 当经过 delay(也就是500ms) 后, 会将 callback(也就是l-1的回调函数) 发送给 `任务队列` 中的 `宏任务队列`。这样的事情 `APIs` 干了两次(因为有两个 `setTimeout`)。
4.  (继2) 当 `执行栈` 为空时, `Event Loop` 会将 `任务队列` 中的任务发送到 `执行栈` 中执行。不过此时 `任务队列` 为空, 故什么都不执行
5.  经过 delay 时间后, 两个计时器的回调函数将会被 `APIs` 发送给 `宏任务队列`
6.  此时 `执行栈` 为空, 并且 `微任务队列` 为空, `宏任务队列` 非空, 故可以将 `宏任务队列` 中的第一个 `宏任务` 送到 `执行栈` 中执行
7.  `执行栈` 执行 `l-1` 的回调函数, 先执行 `l-3`, 此时直接输出 `"宏任务: 计时任务1"`
8.  继续执行 `l-4`, 发现是 `Promise`, 于是将 then 的回调函数送到 `APIs` (反正是类似 `APIs` 的异步处理模块, 但该模块不属于 JS 的单线程范畴), 然后执行了 resolve 了, 于是 then 的回调函数被发送到了 `微任务队列` 中
9.  `执行栈` 执行完 `l-3` 和 `l-4` 后, 又为空了, 于是 `Event Loop` 继续查看 `任务队列`
10. 此时的 `任务队列` 中, `微任务队列` 有了新的 `微任务`, 故先执行 `微任务`, 也就是将 `l-5` 送入 `执行栈` 中执行, 此时输出 `"微任务1"`
11. 执行完 `l-5` 后, `执行栈` 为空, `微任务队列` 为空, 于是 `Event Loop` 再从 `宏任务队列` 中取出一个 `宏任务` 送往 `执行栈`
12. 后面的就和前面的重复(循环)了
13. 先执行 `l-6`, 输出 `"宏任务: 计时任务2"`
14. 在执行 `l-7`, 执行完后会 `微任务队列` 又增加了一个 `微任务`
15. `执行栈` 又为空, 继续查看 `任务队列`, 取出 `微任务` 送往 `执行栈`
16. 执行 `l-8`, 输出 `"微任务2"`
17. ~~结束~~, `任务队列` 又为空, 不作任何操作, 等待异步模块继续发送某些 `宏任务` 或 `微任务` 到 `任务队列` 中, 比如用户突然点击了某个绑定了回调事件的按钮, 或者某个网络请求请求结束, 或者是之前设置的某些定时任务到了触发的时间了等等..

看完上面的过程, 我们其实可以发现, 打开网页时, 除了网页文档中的 `script` 脚本是直接送入 `执行栈`, 其他的 `任务`, 其实都是从 `任务队列` 中取出的了。或者更加简单一点, 我们可以直接认为, 文档中最开始的 `script` 其实就是在 `任务队列` 中的。可能是 `宏任务`, 也可能是 `微任务`。反正记住一点, 最先开始执行的肯定是 `script` 脚本中的内容, 其他的内容, 就都是从 `任务队列` 中取出的了, 而 `任务队列` 中的内容, 是由异步模块(比如 `APIs`, 其实我也就只知道一个 `APIs` 了)发送给我们的。

对于 `宏任务` 和 `微任务`, 不需要在意谁先执行谁后执行, 只需要记住一点就可以了: **当一个 `宏任务` 想要执行时, 必须确保 `微任务队列` 为空**。记住这一点后, 其他的都能够直接推理出来了, 比如 `微任务队列` 不为空时, 永远轮不到 `宏任务` 执行, 换句话说, 我们要小心使用 `微任务队列`, 不然会出现死循环的情况, 这也是为什么官网不建议我们用太多 `queueMicrotask()` 函数。

## 🍕 NodeJS11 之前的 Event Loop (不重要, 可忽略)

下面来谈一点 "过时" 的东西, 前面的分析, 在现在这个时间点(22.12.15)都是对的。而在之前, 也就是 NodeJS11版本之前(不包括11), node 和 浏览器的 `Event Loop` 机制是不一样的, 最大的区别就在于 `宏任务` 和 `微任务`。前面已经说了，每一个 `宏任务` 执行时, 都要确保 `微任务队列` 为空, 这是新版本的标准。在此之前的版本有一点点不同，之前的版本所要求的的是 **同一类宏任务队列** 执行之前, 要确保 **微任务队列为空**。这个差异导致的结果就是，当存在两个 `setTimeout` 时, 会先执行完这两个宏任务, 然后再去执行微任务, 所以前面的代码, 用 node11 之前的版本运行时, 会是不一样的结果

![](https://l-oss-bucket-sz.oss-cn-shenzhen.aliyuncs.com/t/tmp1.png)
_node 10 vs 16_

有关 nodejs 的 `Event Loop` 具体的流程图, 可以看下面这张图 <cite><sup>[10]</sup></cite>

![](https://l-oss-bucket-sz.oss-cn-shenzhen.aliyuncs.com/t/tmp2.png)
_11版本之前的流程图_

在这个过程中, 还发现了一个 ~~让人困惑~~ 有意思的现象, 那就是当我们将两个 `setTimeout` 的 `delay` 设置为 `0` 秒时, 输出的情况是不确定的, 有时候会出现 `微任务1` 在 `宏任务2` 之前输出, 如图所示

![](https://l-oss-bucket-sz.oss-cn-shenzhen.aliyuncs.com/t/tmp3.png)
_nodejs10 different output_

下面我想试着解释这么一种现象。

首先, 通过输出可以发现, 大多数情况下, 还是先输出两个宏任务, 然后才输出微任务, 这个很好理解, 当 `宏任务队列` 存在两个 `setTimeout` 时, 肯定会先执行完两个 `setTimeout` 后再去查看 `微任务队列` (注意这是 NodeJS11 版本之前, 新版本不是这样的)。

那么什么情况下, 会出现先输出 **宏任务1** 和 **微任务1** 呢?, 我认为关键就在于程序具体执行的细节中。上一段话中, 我们说了 **当 `宏任务队列` 存在两个 `setTimeout` 时, 肯定会先执行完两个 `setTimeout`**, 但实际运行时, `宏任务队列` 中一定会存在两个 `setTimeout` 吗? 或者应该这么问, 当第一个 `setTimeout` 运行完后, 另外一个 `setTimeout` 真的存在 `宏任务队列` 中吗? 答案应该是不一定的, 让我逐帧来分析一下:

在开始分析之前, 容许我再重复一下上面的代码:

```js
setTimeout(() => { // l-1
  console.log("宏任务: 计时任务1") // l-3
  Promise.resolve().then(() => { // l-4
    console.log("微任务1") // l-5
  })
}, 0)

setTimeout(() => { // l-2
  console.log("宏任务: 计时任务2") // l-6
  Promise.resolve().then(() => { // l-7
    console.log("微任务2") // l-8
  })
}, 0)
```

1.  首先, `l-1` 和 `l-2` 都会在 `执行栈` 中等待执行
2.  `执行栈` 先执行 `l-1`, 此时会将 `l-3,4,5` 送到 **异步模块** 中。为方便描述, 记 `l-3,4,5` 为 `s1`。
3.  `执行栈` 继续执行 `l-2`, 此时会将 `l-6,7,8` 送到 **异步模块** 中。 记 `l-6,7,8` 为 `s2`

> 因为 **异步模块** 不属于 JS 单线程的范畴, 所以 **异步模块** 的内容和 `执行栈` 中的内容是可以并发进行的,  这就导致了一种分歧: 当 `执行栈` 为空时, **异步模块** 可能还未将 `s1` 发送给 `宏任务队列`, 也可能已经将 `s1` 发送给 `宏任务队列`。
> 理由: 我们设置的延迟时间是 0, 理论上 `s1` 被送往 **异步模块** 时, **异步模块** 应该马上将其发送给 `任务队列`, 但实际上, **异步模块** 应该会每隔一段时间, 才检查 `s1` 的延迟时间是否已经到期, 才决定是否将 `s1` 送往 `宏任务队列`。
> 下面我们考虑的是情况是, 当 `执行栈` 为空时, 只有 `s1` 已经被送往 `宏任务队列`。

4.  当 `执行栈` 将 `s2` 送往 **异步模块** 后, `执行栈` 为空, 此时 `宏任务队列` 只有 `s1`, `微任务队列` 为空, 于是 `Event Loop` 将 `s1` 送往 `执行栈` 执行
5.  **关键来了!**, 存在这么一个时间节点, `执行栈` 在执行 `s1`, **异步模块** 在等待 `s2` 的时间到期, `任务队列` 为空。***当*** `执行栈` 先执行完 `s1` 时, `l-4` (Promise callbacks) 会被送往了 **异步模块**, ***并且*** **异步模块** 还未将 `s2` 送往 `宏任务队列`。 也就是说, 此时的 **异步模块** 同时存在 `s2` 和 `l-4` (Promise callbacks), ***并且*** **异步模块** 会先将微任务 `l-4` (Promise callbacks) 送往 `微任务队列`, 而 `s2` 还停留在 **异步模块** 中。

> 虽然我不清楚 **异步模块** 具体实现的源代码, 甚至都不敢保证 node 中存在 **异步模块** 这个机制, 但因为 **微任务** 是优于 **宏任务** 的, 所以, 当同时存在 0 秒延迟的 `setTimeout` 和微任务(Promise callbacks)时, 即使 `setTimeout` 是率先到达 **异步模块** 的, 我也认为微任务是有机会先于 `setTimeout` 被发送到 `任务队列` 的。

6.  **异步模块** 先将 `l-4` 发送到 `微任务队列`, 此时, `执行栈` 为空, `s2` 还未送往 `宏任务队列`, `微任务队列` 中存在 `l-4`, 于是 `Event Loop` 就先将 `l-4` 送往 `执行栈` 中执行了, 从而导致了 **微任务1** 先于 **宏任务2** 输出。后面的分析就没有什么需要做笔记的了。

总的来说, 我的解释就是: 存在这么一个时间节点, **异步模块** 中同时存在 **宏任务2** 和 **微任务1**。并且, 虽然 **宏任务2** 先于 **微任务1** 进入 **异步模块**, 但 **异步模块** 还是可能先将 **微任务1** 发送到 `任务队列`, 从而导致了 **微任务1** 先于 **宏任务2** 执行。

其实, 我不确定上面的解释是否是正确的, 因为我不清楚 nodejs 的源代码是如何编写的, 更不确定 nodejs 是否真的存在一个 **异步模块**, 但因为浏览器存在一个 `APIs`, 所以我感觉 nodejs 可能也有一个 **异步模块** 。

下面我再用别人给出的 nodejs11版本之前的 `Event Loop` 图, 来解释一下:

![](https://l-oss-bucket-sz.oss-cn-shenzhen.aliyuncs.com/t/tmp4.png)
_关键的时间点1, setTimeout1 开始执行, 但 setTimeout2 还没有进入宏任务队列中_

![](https://l-oss-bucket-sz.oss-cn-shenzhen.aliyuncs.com/t/tmp5.png)
_关键时间点2, 只要 微任务1 能够在 s2 还未执行时进入到队列中, 那么它就有很大概率先于 s2 执行_

好了, 这一部分, 仅仅只是感觉有意思的, 所以想着纪录一下, 初次学习(说的就是我)不要 **只想不做**, 不然容易误入歧途, 最好休息一下, 放空放空大脑, 或者去看看大佬的文章, 再回头来思考一下。

## 🍕 总结

- `Event Loop` 是一种机制, 它指示了异步任务任务之间的运行规则。
- JS 的单线程, 体现在 `执行栈` 只有一个, 并且只有 `执行栈` 为空时, 才有机会将新的任务送入 `执行栈` 中执行。
- 每一个宏任务执行之前, 必须确保 `微任务队列` 为空。两个 `setTimeout` 的回调函数, 属于两个宏任务。

## 🍕 参考资料

- [JS 的异步机制一探 - ByteEE](https://mp.weixin.qq.com/s/jfXQgAR6Su8yvwgc24g-Lw)
- [NodeJS Event Loop: JavaScript Event Loop vs Node JS Event Loop - Deepal Jayasekara](https://blog.insiderattack.net/javascript-event-loop-vs-node-js-event-loop-aea2b1b85f5c)（很优秀的系列文章, 这里有[翻译版](https://zhuanlan.zhihu.com/p/88770385), 不过最新的一篇没有翻译 —— 有关Nodejs和浏览器的对比）
- [Difference between microtask and macrotask within an event loop context - stack overflow](https://stackoverflow.com/questions/25915634/difference-between-microtask-and-macrotask-within-an-event-loop-context)
- [Event Loop - WHATWG](https://html.spec.whatwg.org/multipage/webappapis.html#event-loops)（想要更深入时必读）
- [what is an event loop in javascript](https://www.educative.io/answers/what-is-an-event-loop-in-javascript), (不长, 可简单的认识什么是 Event Loop)
- [JavaScript Event Loop](https://www.javascripttutorial.net/javascript-event-loop/), (不是很长, 介绍的是 Event Loop, 图表更丰富一些)
- [Understanding the Event Loop, Callbacks, Promises, and Async/Await in JavaScript](https://www.digitalocean.com/community/tutorials/understanding-the-event-loop-callbacks-promises-and-async-await-in-javascript)
- [event-loop](https://zh.javascript.info/event-loop)
- [带你了解事件循环机制(Event Loop)](https://blog.csdn.net/weixin_52092151/article/details/119788483)

---

[1]: https://stackoverflow.com/questions/25915634/difference-between-microtask-and-macrotask-within-an-event-loop-context#:~:text=this%20queue%20is%20simply%20called%20the%20task%20queue
[2]: https://blog.csdn.net/weixin_52092151/article/details/119788483
[3]: https://blog.insiderattack.net/javascript-event-loop-vs-node-js-event-loop-aea2b1b85f5c#:~:text=What%20are%20microtasks%20and%20macrotasks
[4]: https://html.spec.whatwg.org/multipage/webappapis.html#:~:text=Task%20queues%20are%20sets,%20not%20queues
[5]: https://javascript.info/event-loop#:~:text=as%20it%20guarantees%20that
[6]: https://blog.insiderattack.net/javascript-event-loop-vs-node-js-event-loop-aea2b1b85f5c#:~:text=the%20event%20loop%20has%20to%20make%20sure%20that%20the%20microtask%20queue%20is%20empty
[7]: https://www.educative.io/answers/what-is-an-event-loop-in-javascript
[8]: https://mp.weixin.qq.com/s/jfXQgAR6Su8yvwgc24g-Lw
[9]: https://blog.insiderattack.net/event-loop-and-the-big-picture-nodejs-event-loop-part-1-1cb67a182810
[10]: https://blog.insiderattack.net/event-loop-and-the-big-picture-nodejs-event-loop-part-1-1cb67a182810
[from1]: https://stackoverflow.com/questions/25915634/difference-between-microtask-and-macrotask-within-an-event-loop-context#:~:text=blocking%20by%20means%20of%20process.maxTickDepth
[from2]: https://blog.insiderattack.net/event-loop-and-the-big-picture-nodejs-event-loop-part-1-1cb67a182810#:~:text=process.maxTickDepth

[WHATWG specification]: https://html.spec.whatwg.org/multipage/webappapis.html#task-queue
[task-source | WHATWG]: https://html.spec.whatwg.org/multipage/webappapis.html#task-source
