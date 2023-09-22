<script lang="ts">
    import type { TransitionConfig } from 'svelte/transition'

    let show = false
    let time = 170
    requestAnimationFrame(function second3() {
        if (time++ === 180) {
            time = 0
            show = !show
        }
        requestAnimationFrame(second3)
    })

    function typewriter(node: HTMLElement, { speed = 1 }): TransitionConfig {
        const valid =
            node.childNodes.length === 1 &&
            node.childNodes[0].nodeType === Node.TEXT_NODE

        if (!valid) {
            throw new Error(
                `This transition only works on elements with a single text node child`,
            )
        }

        const text = node.textContent as string
        const duration = text.length / (speed * 0.01)

        function tick(t: number) {
            const i = Math.trunc(text.length * t)
            node.textContent = text.slice(0, i)
        }

        return { duration, tick }
    }
</script>

<svelte:head>
    <title>HOME - 随心敲</title>
</svelte:head>

<h1>关于我</h1>

{#if show}
    <p in:typewriter={{ speed: 1 }} out:typewriter={{ speed: 5 }}>
        我只是一个喜欢前端的普通人。
    </p>
{/if}
