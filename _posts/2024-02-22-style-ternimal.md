---
# layout has been set to post by default
title: 终端命令提示符配置
category: CLI
tags: [ternimal, style, shell]
---

## window

### 配置 powershell 命令提示符

通过编辑 `$Profile` 文件（路径为 `%UserProfile%\Documents\WindowsPowerShell\Microsoft.PowerShell_profile.ps1`）可以自定义 powershell 命令行提示符。如果已安装 vscode，可以直接运行 `code $Profile` 来编辑该文件。

> 如果提示“无法加载文件 ...，因为在此系统上禁止运行脚本”。尝试执行 `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser` 命令解决。

### 风格：只显示当前目录

```powershell
function prompt {
    $p = Split-Path -leaf -path (Get-Location)
    "$p> " # 最后一个表达式默认就是返回值，所以这里省略了 return
}
```

### 风格：修改命令提示符的颜色

```powershell
function prompt {
    $promptString = Split-Path -leaf -path (Get-Location)
    "$([char]0x1b)[92m" + "$promptString" + "$([char]0x1b)[91m" + " > "
}
```

更多颜色，可通过运行 `Get-PSReadLineOption` 命令查看。

### 风格：正则替换路径中的 `\` 为 `/`

```powershell
function prompt {
    $full_path = "/" + (Get-Location) -replace ":?\\", "/"
    echo (
        $full_path +
        ([System.Environment]::NewLine) + "$([char]0x1b)[91m" + "$ "
    )
}
```

参考自 [正则替换字符串](https://learn.microsoft.com/zh-cn/powershell/module/microsoft.powershell.core/about/about_comparison_operators#replacement-operator)

### 风格：换行 + 彩色 + 判断是否管理员

参考自 [about_Prompts](https://learn.microsoft.com/zh-cn/powershell/module/microsoft.powershell.core/about/about_prompts?view=powershell-7.3) 和 [stack overflow](https://stackoverflow.com/questions/37367460/how-achieve-a-two-line-prompt)

```powershell
function prompt {
    $identity = [Security.Principal.WindowsIdentity]::GetCurrent()
    $principal = [Security.Principal.WindowsPrincipal] $identity
    $adminRole = [Security.Principal.WindowsBuiltInRole]::Administrator
    $fullpath = (Get-Location) -replace "\\", "/"

    if($principal.IsInRole($adminRole)) {
        ([System.Environment]::NewLine) + "[Admin] " + "$([char]0x1b)[92m" + "$fullpath" + "$([char]0x1b)[91m" + ([System.Environment]::NewLine) + "> "
    } else  {
        ([System.Environment]::NewLine) + "$([char]0x1b)[92m" + "$fullpath" + "$([char]0x1b)[91m" + ([System.Environment]::NewLine) + "> "
    }
}
```

### 风格：显式当前所在 git 分支

参考 [stack Overflow](https://stackoverflow.com/questions/1287718/how-can-i-display-my-current-git-branch-name-in-my-powershell-prompt)

```powershell
function Write-BranchName () {
    try {
        $branch = git rev-parse --abbrev-ref HEAD

        if ($branch -eq "HEAD") {
            # we're probably in detached HEAD state, so print the SHA
            $branch = git rev-parse --short HEAD
            Write-Host " ($branch)" -ForegroundColor "red"
        }
        else {
            # we're on an actual branch, so print it
            Write-Host " ($branch)" -ForegroundColor "blue"
        }
    } catch {
        # we'll end up here if we're in a newly initiated git repo
        Write-Host " (no branches yet)" -ForegroundColor "yellow"
    }
}

function prompt {
    $base = "PS "
    $path = "$($executionContext.SessionState.Path.CurrentLocation)"
    $userPrompt = "$('>' * ($nestedPromptLevel + 1)) "

    Write-Host "`n$base" -NoNewline

    if (Test-Path .git) {
        Write-Host $path -NoNewline -ForegroundColor "green"
        Write-BranchName
    }
    else {
        # we're not in a repo so don't bother displaying branch name/sha
        Write-Host $path -ForegroundColor "green"
    }

    return $userPrompt
}
```

### 风格：管理员+git分支+标签+子目录+空提交

```powershell
function parseGitPosition {
    <#
    可能的返回值：
        空

        (main) sub, not commit yet
        (main) not commit yet

        (main)
        (main) sub, tag: v1
        (main) tag: v1
        (a1s2d3f4)
        (a1s2d3f4) sub, tag: v1
        (a1s2d3f4) tag: v1
     #>

    # 空（非 git 仓库）
    if (!(git rev-parse --is-inside-work-tree)) {
        Write-Host ""
        return
    }

    $sub = ""

    # 非 git 根目录
    if (!(Test-Path .git)) {
        $sub = "sub"
    }

    # 无提交记录
    if (!(git log)) {

        $defaultBranch = git symbolic-ref --short HEAD
        Write-Host " (" -NoNewline
        Write-Host "$defaultBranch" -ForegroundColor "yellow" -NoNewline
        Write-Host ")" -NoNewline
        if ($sub -ne "") {
            Write-Host " ${sub}," -NoNewline
        }
        Write-Host " not commit yet"

        return
    }

    $tag = git describe --tags --exact-match HEAD
    if ($?) {
        # HEAD 在某一标签上
        $tag = "tag: $tag"
    }


    $branch = git symbolic-ref --short HEAD
    if ($?) {

        # normal
        Write-Host " (" -NoNewline
        Write-Host "$branch" -ForegroundColor "blue" -NoNewline
        Write-Host ")" -NoNewline
        if ($sub -ne "" -And $tag -ne $null) {
            Write-Host " ${sub}, ${tag}"
        } else {
            Write-Host " ${sub}${tag}"
        }

    } else {

        # detached HEAD status
        $hash = git rev-parse --short HEAD
        Write-Host " (" -NoNewline
        Write-Host "$hash" -ForegroundColor "red" -NoNewline
        Write-Host ")" -NoNewline
        if ($sub -ne "" -And $tag -ne $null) {
            Write-Host " ${sub}, ${tag}"
        } else {
            Write-Host " ${sub}${tag}"
        }
    }

}

function hasAdminPower {
    $identity = [Security.Principal.WindowsIdentity]::GetCurrent()
    $principal = [Security.Principal.WindowsPrincipal] $identity
    $adminRole = [Security.Principal.WindowsBuiltInRole]::Administrator
    return $principal.IsInRole($adminRole)
}

function prompt {
    $base = "PS$($Host.version.Major) "
    $path = "$($executionContext.SessionState.Path.CurrentLocation)"
    $prompt = "$('$' * ($nestedPromptLevel + 1)) " # 嵌套级别，比如输入一个 { 回车，就会变成 >>

    if (hasAdminPower) {
        $prompt = "$('#' * ($nestedPromptLevel + 1)) "
    }

    Write-Host "`n$base" -NoNewline
    Write-Host $path -NoNewline -ForegroundColor "green"
    parseGitPosition

    return $prompt
}

```

### [oh my posh](https://ohmyposh.dev/) 命令行提示符主题

基本步骤如下：

1. 安装 [Window terminal](https://apps.microsoft.com/store/detail/windows-terminal/9N0DX20HK701)
1. 安装 [`winget`](https://apps.microsoft.com/detail/9NBLGGH4NNS1) 工具
1. 执行 `winget install JanDeDobbeleer.OhMyPosh -s winget` 然后重启终端
1. 管理员权限下安装字体 `oh-my-posh font install`，不想通过管理员安装，则运行 `oh-my-posh font install --user`
1. 在 Window terminal 中修改字体为刚刚安装的字体
1. 通过 `echo "oh-my-posh init pwsh | Invoke-Expression" > $Profile` 命令启用 oh my posh
1. 查看所有可用主题 `Get-PoshThemes` 。如果没有出现图标/显示方块，那就是字体没有设置好，请重新设置字体然后重启终端。注意在 vscode 中主要在 settings 中设置字体，配置项为 `"terminal.integrated.fontFamily": "Hack Nerd Font"`，这样可以不覆盖编辑器中的字体。
1. 执行命令（自行替换 `<theme-name>`） `oh-my-posh init pwsh --config "$env:POSH_THEMES_PATH\<theme-name>.omp.json"`，此时会输出一行字符串，执行该字符串就可以应用主题。以主题 `rudolfs-dark` 为例，执行 `oh-my-posh init pwsh --config "$env:POSH_THEMES_PATH\paradox.omp.json"`，然后再执行输出的字符串。
1. 或者直接 `oh-my-posh init pwsh --config "$env:POSH_THEMES_PATH\paradox.omp.json" | Invoke-Expression` 就可以临时应用主题。
1. 想要永久保存主题则运行命令 `oh-my-posh init pwsh --config "$env:POSH_THEMES_PATH\<theme-name>.omp.json" > $profile`。

自定义主题：

1. 创建自己的文件样式文件：`code "$env:POSH_THEMES_PATH/lim-default.omp.json"`
2. 编写样式（可以在别人的主题上进行修改）~~快逃，这是个兔子洞~~
3. 应用：`oh-my-posh init pwsh --config "$env:POSH_THEMES_PATH/lim-default.omp.json" > $profile`

在 [nerd fonts 中查看所有可用特殊字符](https://www.nerdfonts.com/cheat-sheet)

[我的主题参考](https://gist.github.com/Linhieng/092192b87a23e9c53f77249f14e267dd)

虽然 oh my posh 很漂亮，但性能要求高，启动速度慢，所以电脑性能差的慎选（比如我）。


## linux

```bash
my_bash_prompt() {
    git_branch() {
        if [ $(git rev-parse --is-inside-work-tree 2> /dev/null) ]
        then
            branch=$(git symbolic-ref --short HEAD 2> /dev/null)
            if [ $? -ne 0 ]
            then
                branch=$(git rev-parse --short HEAD)
            fi

            echo " (${branch}) "
        fi
    }

    uname_hostname="\[\e[1;30;47m\] \u\[\e[31m\]@\[\e[30m\]\h "
    full_path="\[\e[37;44m\] \w "
    branch_color="\[\e[37;45m\]"
    ln="\[\e[0m\]\n"
    prompt=" \[\e[1;33m\]\\$\[\e[0m\] "

    # \$(git_branch) 如果写成 $(git_branch)，则不会动态更新！
    PS1="${uname_hostname}${full_path}${branch_color}\$(git_branch)${ln}${prompt}"

}
```



```
\u：当前用户名
\h：当前主机名。永久修改主机名需要改 /etc/hostname, /etc/hosts
\w：当前工作目录的完整路径
\W：当前工作目录的基本名称
\d：日期，以周几、月、日的形式显示
\t：当前时间（24小时制）
\#：命令计数器，即当前 shell 会话中执行的命令数量
\$：如果用户是普通用户，则显示 $；如果用户是 root 用户，则显示 #


支持的颜色
    \e[0m：重置所有属性
    \e[1m：粗体
    \e[4m：下划线
    \e[7m：反色（文本和背景颠倒）
    设置文本颜色
        \e[30m  黑
        \e[31m  红
        \e[32m  绿
        \e[33m  黄
        \e[34m  蓝
        \e[35m  洋红
        \e[36m  青
        \e[37m  白
    设置背景颜色
        \e[40m  黑
        \e[41m  红
        \e[42m  绿
        \e[43m  黄
        \e[44m  蓝
        \e[45m  洋红
        \e[46m  青
        \e[47m  白

使用方式：用 [] 括起来，如 \[\e[0m\] 。因为转义应该用 [] 括起来，否则第二行命令行会覆盖第一行的命令行
```
