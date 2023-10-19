<template>
    <div class="wrapper">
        <header>
            <ProfileComp></ProfileComp>
            <ScrollDownVue
                v-if="minWidth800Ref"
                class="scroll-down-box"
            ></ScrollDownVue>
        </header>
        <main class="home-main" :class="{ 'scroll-bar': !minWidth800Ref }">
            <ContentList></ContentList>
        </main>
    </div>
</template>

<script setup lang="ts">
import ContentList from '@/views/sub/ContentList.vue'
import ProfileComp from '@/views/sub/ProfileCard.vue'
import ScrollDownVue from '@/components/widgets/ScrollDown.vue'
import { ref } from 'vue'

const minWidth800Ref = ref(window.innerWidth <= 800)

// 媒体查询，对应 css 中的媒体查询 ------------------------------------
const mediaQuery = window.matchMedia('(min-width: 800px)')
mediaQuery.addEventListener('change', () => {
    minWidth800Ref.value = window.innerWidth <= 800
})
</script>

<style scoped lang="scss">
// ------------------ 结构 ------------------
header {
    height: 100vh;
    position: relative;

    .scroll-down-box {
        position: absolute;
        bottom: 100px;
        left: 50%;
        transform: translateX(-50%);
    }
}

@media (min-width: 800px) {
    .wrapper {
        display: grid;
        grid-template-columns: 1fr 2fr;

        .home-main {
            height: 100vh;
            overflow: auto;
        }
    }
}
</style>
