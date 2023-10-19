<template>
    <p class="text-shadow-black">
        {{ typewriterTextRef }}
    </p>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
    text: string
}>()

const typewriterTextRef = ref('')

const indexAnimationArr = initIndexAnimationArr(props.text.length)

function initIndexAnimationArr(length: number): number[] {
    const arr = []
    for (let i = 0; i < length; i++) {
        arr.push(i)
    }
    for (let i = 0; i < length; i++) {
        arr.push(length)
    }
    for (let i = length - 1; i >= 0; i--) {
        arr.push(i)
    }
    for (let i = length - 1; i >= 0; i--) {
        arr.push(0)
    }
    return arr
}

function nextIndex() {
    const index = indexAnimationArr.shift() as number
    indexAnimationArr.push(index)
    return index
}

setTimeout(function loop() {
    const index = nextIndex()
    typewriterTextRef.value = props.text.slice(0, index)
    setTimeout(loop, 100)
}, 100)
</script>

<style scoped lang="scss"></style>
