import { post } from '@/request'

export interface ArticleItem {
    article_id: string
    article_info: {
        title: string
        brief_content: string
    }
}

// prettier-ignore
const articleArr = [{"article_id":"7141718239729418271","article_info":{"title":"vscode 中对 c 语言的格式化( clang-format )","brief_content":"内容都写在 我的 github 仓库 里面了. 配置项主要参考了 torvalds/linux/ 仓库和 14版本的 clang-format 官方文档. 这里给出当前积累的配置项, 后续还有新增都会"}},{"article_id":"7178045168384704567","article_info":{"title":"简单认识一下 Event Loop、宏任务和微任务","brief_content":"初次系统的学习 Event Loop，自己查阅了一些文章，并整理了一些我认为重要的知识点，不知道别人阅读起来感觉如何。共勉"}},{"article_id":"7222996508319678521","article_info":{"title":"简单认识 Shell ｜ 青训营笔记","brief_content":"简单的了解一下 shell，主要介绍了基本概念、相关语法。内容本身不多，但如果每一个都自己跑一遍的话，还是要花点时间的。"}},{"article_id":"7120014348319195166","article_info":{"title":"textarea 高度自适应（扒element-plus源码）","brief_content":"写在前面 我爱开源！！！！！ 需求：实现像微博评论输入框那样的功能，使用 textarea 元素，实现高度自适应，并且能够提前换行、可以指定最大高度！ 明明应该是一个很简单的功能，但是我愣是找了几个小"}},{"article_id":"7096844558570536974","article_info":{"title":"跟着调试 TS 源码","brief_content":"今天刚好看到一个视频讲解如何调试 ts 源码，感觉很有趣，虽然只学过 ts 语法，没用过 ts 做项目。但是并不影响我的“好奇心”，于是跟着试了一下，可以成功，所以做了个笔记纪录一下步骤（细节我也不懂"}},{"article_id":"7088647681991507976","article_info":{"title":"前端图片压缩上传","brief_content":"基本原理 重点就是借助 canvas 提供的 API 进行压缩：参考文档 基本步骤 获取图片 将图片 “画” 在 canvas 上面 调用 canvas.toDataURL 对图片进行压缩 得到压缩后"}},{"article_id":"7105004141377749023","article_info":{"title":"c语言控制台实现回退到上一行","brief_content":"c语言控制台实现回退到上一行。全部源码，加录制 gif 图演示，顺便分享了一下刚刚找到的 gitcan 软件"}},{"article_id":"7106465055851577375","article_info":{"title":"前端屏幕录制","brief_content":"效果：对自己的电脑进行录屏，并通过网页查看。 目的：简单了解一下前端如何实现直播和展示实时监控 用到的知识点 ffmpeg ffmpeg 是一个软件，用来进行录屏，并将视频流上传到服务器。 官网：ht"}},{"article_id":"7106790431098142734","article_info":{"title":"如何捕获只出现一瞬间的类名样式","brief_content":"需求来源 今天突然看到 ISUX 的文章，他们的网页设计惊艳到我了，于是就打开控制台看看样式代码。然后发现有一个类名 showup 只出现一瞬间就消失了，于是我想往常一样，利用我的手速截屏查看它的样式"}},{"article_id":"7107481040968482830","article_info":{"title":"remix 基本使用","brief_content":"网址: https://remix.ethereum.org/ remix 的基本使用 在 contract 文件夹下编写 4_My_contract.sol 文件 编写基本代码(注意指定编译版本) "}}]

export default async function queryArticleArr(): Promise<Array<ArticleItem>> {
    return articleArr
    // const data = {
    //     user_id: '1117534793513069',
    //     sort_type: 1, // 1 表示根据热门程度排序，2 表示根据时间排序
    //     // cursor: 10, // 分页
    // }
    // const res = await post(
    //     'https://api.juejin.cn/content_api/v1/article/query_list',
    //     data,
    // )
}
