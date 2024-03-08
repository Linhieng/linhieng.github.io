---
# layout has been set to post by default
title: 事件循环相关内容
category: js
tags: [js, event-loop, microtask, macrotask, concept, expert]
# img_cdn: {{ site.baseurl | append: '/img/' | append: page.basename }}
img_cdn: {{ site.baseurl }}
---

TODO:

- ~~笔记距今太久，内容需要重新描述~~ 原来 23-9-22 的时候更新过了
- 使用 diagrams 绘制相关图片，并保存为 svg
- 搜索新的资料优化内容。

## 涉及到的概念

- 事件循环 (`Event Loop`)
- `宏任务` (macrotask)
- `宏任务队列` (macrotask queue)。在 [WHATWG specification](https://html.spec.whatwg.org/multipage/webappapis.html#task-queue) 中被简单地称为 **task queue**。[[from]](https://stackoverflow.com/questions/25915634/difference-between-microtask-and-macrotask-within-an-event-loop-context#:~:text=this%20queue%20is%20simply%20called%20the%20task%20queue)
- `微任务` (microtask)
- `微任务队列` (microtask queue)
- `执行栈`，或称为调用栈 (Call Stack)
- `任务队列` (Task Queue / Event Queue)，本文将 `宏任务队列` 和 `微任务队列` 统称为 `任务队列`
- 异步编程 (asynchronous programming)
- 单线程 (single-thread)

## 先通过一段代码，来简单认识 Event Loop

在开始之前，先定义一下 `异步任务源`。任务源可以分配任务，而 `异步任务源` 就是专门分配 `异步任务` 的。[这个想法来自 WHATWG 的 task source](https://html.spec.whatwg.org/multipage/webappapis.html#task-source)。我这里不对定义做过多说明，直接看我的例子，你应该就明白我想表达什么了。

比如下面代码中，`setTimeout()` 函数本身是一个 `异步任务源`，其回调函数就是一个 `异步任务`。`setTimeout` 函数本身的执行是同步的，只不过在它执行的过程中, 它创建了一个 `异步任务`，这个 `异步任务` 是异步执行的。

```js
function test () {
  console.log('1') // f1
  setTimeout(fn, delay/* 假设是500ms */) // f2
  console.log('2') // f3
}
(function main () {
  test()
})()
```

我专门画了一张图来简单描述一下过程：

![](/img/2022-12-17-event-loop/event-loop.drawio.svg){: width="1200" }
_Event Loop_


1. 首先 `main()` 会进入 `执行栈`，然后 `执行栈` 会自上而下执行该函数中的各条语句。
2. 在执行语句的过程中，如果遇到形如同步函数，比如 `test()`，那么它会先等待其执行完毕——也就是会将 `test()` 压入栈, 然后继续执行 `test()` 函数中的内容。
3. 在执行 `f1` 时，`执行栈` 又遇到了 `console.log` 这个同步函数，于是它继续先等待其执行完毕——也就是会先等屏幕输出 `1`，然后才继续开始下一条语句。
4. 接着，`执行栈` 遇到了 `异步任务源` `setTimeout`，于是它会将 `setTimeout` 分配的 `异步任务`（包含 fn 和 delay）送到某个区域，这个区域我们先称其为 **异步模块**（在浏览器环境中叫 APIs），然后 `执行栈` 就会继续执行下一条语句了。注意此时 fn 并没有执行。

    > `APIs` 的执行由浏览器单独负责，它和 JS 的单线程没有关系。记住: JS 是单线程的，但浏览器是多线程的 [[from]](https://blog.csdn.net/weixin_52092151/article/details/119788483)

5. `执行栈` 接着执行，然后会输出 `2`，此时主函数执行完，`执行栈` 中没有其他的任务需要执行了。
6. 当 `执行栈` 为空时，`Event Loop` 从  `任务队列` 中取出新的任务执行。`任务队列` 中的任务都是等待程序处理的任务，这些任务的来源就是我们刚刚提到的 **异步模块**。因为此时时间还没有过去太久（不足500ms），所以 `任务队列` 为空、`执行栈` 也为空。
7. **异步模块** 每过一段时间就会查看一下它维护的那些 `异步任务`，经过大约 500ms(实际数值肯定大于500ms) 后，**异步模块** 发现有一个 `异步任务`(fn) 可以执行了，于是将这个 fn 发送给 `任务队列`。此时 `任务队列` 不为空。
8. `执行栈` 为空，并且 `任务队列` 有任务在等待执行，于是 `Event Loop` 从中取出任务(fn)，并发送到 `执行栈` 中执行。于是 `执行栈` 继续执行，并输出了 `3`。

从上面的步骤可以看到，一个重要的时间点就是 `执行栈` 为空，并且这个时间点后，许多操作都是由 `Event Loop` 负责调控的。当然 **异步模块** 中的内容是另外的一部分，正因如此，当 `执行栈` 中执行任务时，**异步模块** 可以对异步任务进行计时。

总的来说：`执行栈` 执行任务——栈空时才允许 `Event Loop` 将 `任务队列` 中的任务送到 `执行栈` 中执行。

## 宏任务和微任务

前面的 `异步任务` 其实就是 `宏任务` 和 `微任务` 的总称。`宏任务` 和 `微任务` 是两类不同的 **异步** 任务。[[from]](https://blog.insiderattack.net/javascript-event-loop-vs-node-js-event-loop-aea2b1b85f5c#:~:text=What%20are%20microtasks%20and%20macrotasks)

`宏任务队列` 的数据结构 **不是队列**，而是 **集合**。这个概念很重要，因为队列是有序的，而集合是无序的，所以在 `宏任务队列` 中先到达的任务 **不一定** 会先执行。[[from]](https://html.spec.whatwg.org/multipage/webappapis.html#:~:text=Task%20queues%20are%20sets,%20not%20queues)

但 `微任务队列` 的数据结构是 **队列**，所以 `微任务队列` 中任务的执行一定是有序的。

此外，`微任务队列` 还有这么以下特点：

- 当 `微任务队列` 中的 `微任务` 开始执行时，它可以继续添加新的 `微任务` 到 `微任务队列` 中。
- `微任务队列` 一旦开始执行，就会执行到 `微任务队列` 为空。所以，如果不断地添加 `微任务` 加入到 `微任务队列` 中，那么 `宏任务` 将不断地被阻塞。这种情况导致的最常见的后果就是页面无法与用户进行交互，因为与用户的交互是也是在 `执行栈` 中执行。

`微任务队列` 中的任务会一次性执行完，这样做的好处是它确保了每一个 `微任务` 之间的应用程序环境基本相同（没有鼠标坐标更改，没有新的网络数据等）。[[from]](https://javascript.info/event-loop#:~:text=as%20it%20guarantees%20that)

如果要给 `微任务` 和 `宏任务` 定一个优先级, 那么你可以认为 `微任务` 的优先级更高。但我认为, 与其记住谁的优先级更高, 不如记住这么一句话: **每一个宏任务执行之前, 必须确保微任务队列为空**。[[from]](https://blog.insiderattack.net/javascript-event-loop-vs-node-js-event-loop-aea2b1b85f5c#:~:text=the%20event%20loop%20has%20to%20make%20sure%20that%20the%20microtask%20queue%20is%20empty)

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

## 通过一段代码来理解宏任务和微任务

```js
setTimeout(() => {
  console.log("1")
  Promise.resolve()
    .then(() => {
        console.log("3")
    })
  console.log("2")
}, 500);
```

- `APIs` 是浏览器中的一个机制，它负责处理一些异步 API。当这些异步回调函数执行完毕时会将这些函数发送给 `任务队列`。[[from]](https://www.educative.io/answers/what-is-an-event-loop-in-javascript)
- `宏任务队列`：由宏任务组成的队列。宏任务队列分为计时器队列（setTimeout）、IO 事件队列、关闭事件处理程序队列。[from](https://mp.weixin.qq.com/s/jfXQgAR6Su8yvwgc24g-Lw), [from](https://blog.insiderattack.net/event-loop-and-the-big-picture-nodejs-event-loop-part-1-1cb67a182810)
- `微任务队列`：由微任务组成的队列。

同步代码的执行很简单：

- 执行同步代码，发现是 `setTimeout`，于是将它携带的回调函数发送给 `APIs`

此时 `执行栈` 为空，后面的事情就都是基于事件驱动了，也就是由事件循环负责处理。

- 事件循环会不断地查询以下内容：
    - `执行栈` 是否为空
    - `微任务队列` 是否有任务需要执行
    - `宏任务队列` 是否有任务需要执行
    - `APIs` 是否有任务需要添加到执行
    - ……
- 前面的同步代码中的计时器回调函数会在 `APIs` 中计时
- 经过 `500ms` 后，该回调函数会被送入宏任务队列中。
- 宏任务队列回调函数，会等待 Event Loop 来询问它是否有任务需要执行
- 由于执行栈为空，微任务队列也为空，所以 Event Loop 会将宏任务队列中的一个任务送入执行栈中执行
- 此时执行栈会执行回调函数中的代码，就像执行同步代码那样执行
- 先同步执行 `console.log`
- 然后同步执行 `Promise.resolve()` 函数，并且会将该 Promise 中所有 then 中的回调函数添加到微任务队列中等待执行
- 最后再次执行 `console.log`

此外 `执行栈` 又为空了，后续还有什么任务，都是由 Event Loop 决定的。

- 前面的 Promise 中还有一个回调函数，虽然执行 `Promise.resolve()` 能够马上将 promise 的状态设为兑现，但 then 中的回调函数也不会立马执行，而是等待 Event Loop 的调配
- 当执行栈为空时，Event Loop 会再次发现微任务队列中有任务等待执行，也就是 then 中的回调函数
- 最后就是 Event Loop 将微任务队列中的任务送入执行栈中执行

## 总结

- 只有当 `微任务队列` 为空时，`宏任务` 才有机会执行。
- `宏任务队列` 每次只会添加一个任务到执行栈中执行，但 `微任务队列` 可以一直添任务到执行栈中执行
- 如果 `微任务队列` 源源不断地有新的任务加入，那么其他事情（宏任务、用户交互等）将会被阻塞，因为执行栈不为空。
- `Event Loop` 是一种机制，它负责调度异步任务任务的运行时机。
- JS 的单线程, 体现在 `执行栈` 只有一个, 并且只有 `执行栈` 为空时, 才有机会将新的任务送入 `执行栈` 中执行。

## 参考资料

- [JS 的异步机制一探 - ByteEE](https://mp.weixin.qq.com/s/jfXQgAR6Su8yvwgc24g-Lw)
- [NodeJS Event Loop: JavaScript Event Loop vs Node JS Event Loop - Deepal Jayasekara](https://blog.insiderattack.net/javascript-event-loop-vs-node-js-event-loop-aea2b1b85f5c)（很优秀的系列文章, 这里有[翻译版](https://zhuanlan.zhihu.com/p/88770385), 不过最新的一篇没有翻译 —— 有关Nodejs和浏览器的对比）
- [Difference between microtask and macrotask within an event loop context - stack overflow](https://stackoverflow.com/questions/25915634/difference-between-microtask-and-macrotask-within-an-event-loop-context)
- [Event Loop - WHATWG](https://html.spec.whatwg.org/multipage/webappapis.html#event-loops)（想要更深入时必读）
- [what is an event loop in javascript](https://www.educative.io/answers/what-is-an-event-loop-in-javascript), (不长, 可简单的认识什么是 Event Loop)
- [JavaScript Event Loop](https://www.javascripttutorial.net/javascript-event-loop/), (不是很长, 介绍的是 Event Loop, 图表更丰富一些)
- [Understanding the Event Loop, Callbacks, Promises, and Async/Await in JavaScript](https://www.digitalocean.com/community/tutorials/understanding-the-event-loop-callbacks-promises-and-async-await-in-javascript)
- [event-loop](https://zh.javascript.info/event-loop)
- [带你了解事件循环机制(Event Loop)](https://blog.csdn.net/weixin_52092151/article/details/119788483)
