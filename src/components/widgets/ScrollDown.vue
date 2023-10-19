<!-- https://codepen.io/xonic/pen/KWMaqe -->
<template>
    <div class="scroll-down-icon-container">
        <div class="chevron"></div>
        <div class="chevron"></div>
        <div class="chevron"></div>
        <span class="text">往下滑</span>
    </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.scroll-down-icon-container {
    margin: auto;
    position: relative;
    $width: 3rem;
    width: $width;
    height: 100px;
    display: flex;
    flex-direction: column-reverse;

    .chevron {
        position: absolute;
        top: 0;
        margin: calc($width / 4);
        width: calc($width / 2);
        height: 8px;
        opacity: 0;
        transform: scale3d(0.5, 0.5, 0.5);
        animation: move 3s ease-out infinite;
        &:first-child {
            animation: move 3s ease-out 1s infinite;
        }
        &:nth-child(2) {
            animation: move 3s ease-out 2s infinite;
        }
        &:before,
        &:after {
            content: ' ';
            position: absolute;
            top: 0;
            height: 100%;
            width: 51%;
            background: #999;
        }
        &:before {
            left: 0;
            transform: skew(0deg, 30deg);
        }
        &:after {
            right: 0;
            width: 50%;
            transform: skew(0deg, -30deg);
        }
    }
    .text {
        font-size: 1rem;
        color: #333;
        white-space: nowrap;
        text-align: center;
        opacity: 0.25;
        animation: pulse 2s linear alternate infinite;
    }
}

@keyframes move {
    25% {
        opacity: 1;
    }
    33% {
        opacity: 1;
        transform: translateY(30px);
    }
    67% {
        opacity: 1;
        transform: translateY(40px);
    }
    100% {
        opacity: 0;
        transform: translateY(55px) scale3d(0.5, 0.5, 0.5);
    }
}

@keyframes pulse {
    to {
        opacity: 1;
    }
}
</style>
