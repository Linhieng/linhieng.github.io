---
# layout has been set to post by default
title: 计算机网络之运输层
category: network
tags: [network, tcp, ip]
---

## 可靠传输工作原理


```

运输层的协议数据单位 —— 报文段。       \
                                    一般情况下可以简单的统称为分组
网络层的协议数据单元 —— IP数据报文     /


1. 停止等待协议
    1.1 无差错 / 理想状态
         A       B
        发送
            .
            .
            .
                接收
                确认
            .
            .
            .
        停止等待，
        继续发送
            .
            .
            .
    1.2 超时重传

        直接原因：A 发送后，在指定时间内没有收到确认
            - 超时
            - 没有 ACK
        具体可能原因：
            - B 没收到报文段
            - B 收到报文段，但
                - 有错，所以不发送确认
                - 没错，已发送确定，但确认未送达 A

    1.3 考虑 B 已发送确认的可能情况

        1.3.1 B 的确认延迟了
            - B 会接收到 A 重新发送的 M1，此时 B 需要执行操作：
                - 忽略 M1
                - 再次发送确认（此时会有两个确认）
            - A 可能接收到两个确认，对于第二个确定，A 的操作：
                - 忽略

        1.3.2 B 的确认丢失了
            - B 会接收到 A 重新发送的 M1，此时 B 需要执行操作：
                - 忽略 M1
                - 再次发送确认（此时会有两个确认）
            - A 会接收到确认

        1.3.3 极端情况
            - B 的确认一直无法到达 A
            - A 一直超时重传
            - B 会一直收到重复相同的 M1
            - 这意味着 B 的网络(发送)状况很差

2. ARQ

前面 1停止等待协议 中提到的超时重传，其实就是 ARQ (Automatic Repeat reQuest, 自动重传请求)

3. 信道利用率的计算

        |
        T_D 指的是 A 发送分组所需要的 时间
        |

        RTT (Round-Trip Time) 指往返时间，即报文段的发出时间，到收到相应的确认的时间。

        |
        T_A 指 B 发送确认所需时间。通常 T_A << T_D

    因为仅仅只在 T_D 内才用来传送有用的数据（包括分组的首部）
    因此信道的利用率 U 等于
                    T_D
        U = ——————————————————
            T_D + RTT + T_A
    这个计算的最理想，或者称为最好情况下的利用率，其中忽略了
        - A 处理确认的时间
        - B 处理分组的时间
    如果出现超时重传，利用率还将继续下降


4. 流水线传输

通过了解停止等待协议，可以看到它的效率很低，痛点在
    - 无效的等待
    - 需要重传

对于无效的等待，我们可以采用流水线传输
        |发
        |发
        |发        确认
        |发收      确认
        |发收      确认
        |发收      确认
        |发收      ...

想要使用流水线，就得利用连续 ARQ + 滚动窗口


对于重传的解决方案，需要分情况
    - 必要的重传：由于报文段出错，或者报文段确实没送达，即出现丢失
    - 不必要的重传：通常是返回的确认未送达
        - 确认延迟了
        - 确认丢失了

> 注意：由于现在的通信线路的传输质量中很好，所以因为传输出错而导致丢弃分组的概率是很小的（远远小于 1%）

我们能做的就是检测哪些是必要的重传，哪些是不必要的重传。

5. 窗口

窗口，只想简单理解的话不难，看几个案例就懂了

案例一：理想情况

    A 中
        总： 1 2 3 4 5 6 7 8 9 10 11 12
        发： 1 2 3 4 5
    B 中
        收到 1 2 3 4 5
        于是返回 1 2 3 4 5 的确认
    可以看出，此时只要 5 的确认到达，那么就无所谓 1 2 3 4 确认的状态了！
    A 中
        收到 5 确认
        此时可以直接移动 5 个窗格

案例而：不连续
    A 中
        总： 1 2 3 4 5 6 7 8 9 10 11 12
        发： 1 2 3 4 5
    B 中
        收到 1 2 x 4 5
        可以看到，其中的 3 没有收到，或者出现了错误
        那么此时 B 只能返回 1 2 确认，不能返回 4 5 确认
    A 中
        收到 2 确认
        所以只能移动 2 窗格
        此时 3 4 5 会重新发送
    可以看出，如果能够让 A 知道 4 5 其实也被收到，那么就能提高效率
    但这只是人类大脑中的想法，对应的具体信号中并不是这么简单的
    因为这会增加额外的计算量，而且传输时也需要额外的空间
    [RFC 2018, 简易标准] 中确实提供了 选择确认(Selective ACK)，用于解决这类问题
    方法就是在 TCP 报文段的首部中
        - 在建立 TCP 连接时，添加 “允许SACK” 选项
        - 指定边界
    但是：
        - 首部长度最多 40 字节
        - 一个边界就需要 4 字节（因为序号是 32 位，4 字节）
        - 一个字节用来指定 SACK 选项
        - 一个字节来指定这个选项要占用多少字节
        所以最多报告 4 个字节块（8 个边界） 8*4 + 1 + 1  = 34 字节 <= 40 字节
        如果报告 5 个字节块（10边界），那么 10*4 + 1 + 1 = 42 字节 > 40 字节


```

## 流量控制 和 拥塞控制

虽然两者都是把窗口变小，但

- 流量控制是为了让小容量接收设备来得及接收，此时网络线路通畅
- 拥塞控制是为了减低网络线路的堵塞情况，此时并不考虑接收设备的容量大小（即使它容量很大）

拥塞控制方法

- 慢开始（初始窗口小，然后较快地增加，1 2 4 8 16） + 阻塞避免（增加到一定量时，开始一个一个增加 16 17 18 19 ...）遇到阻塞，重新慢开始（18 18 18 1 2 4 ）
- 快重传（立刻发送确认，不要等到要发送数据时捎带确认）和快恢复（只是丢失个别报文段时，不需要直接又从 1 开始，而，而是减缓一点点）

## TCP 连接

建立：三报文握手
释放：四报文握手
保活计时器（keepalive timer）太久无响应时，可以断开。
