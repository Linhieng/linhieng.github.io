<template>
    <ul class="article-list-wrapper">
        <li
            class="article-list-item"
            v-for="(item, i) of articleArrRef"
            :key="i"
        >
            <a
                :href="`https://juejin.cn/post/${item.article_id}`"
                target="_blank"
                class="no-underline"
            >
                <h3 class="article-title text-shadow-black">
                    {{ item.article_info.title }}
                </h3>
                <p class="article-abstract">
                    {{ item.article_info.brief_content }}
                </p>
            </a>
        </li>
    </ul>
</template>

<script setup lang="ts">
import queryArticleArr, { type ArticleItem } from '@/request/queryArticleArr'
import { onBeforeMount, ref } from 'vue'

// data ------------------------------------
const articleArrRef = ref<Array<ArticleItem>>([])

// life cycle ------------------------------------
onBeforeMount(() => {
    getArticleArr()
})

// fetch data ------------------------------------

async function getArticleArr() {
    articleArrRef.value = await queryArticleArr()
}
</script>

<style scoped lang="scss">
.article-list-wrapper {
    padding: 2rem;

    .article-list-item {
        display: block;
        padding: 10px 4px;

        &:first-of-type {
            padding-top: 0;
            a {
                padding-top: 10px;
            }
        }

        a {
            display: block;
            padding: 20px 0;
        }

        &:not(:last-of-type) {
            border-bottom: 1px solid #ddd;
        }

        .article-title {
            font-size: 1.3rem;
            color: black;
            margin-bottom: 4px;
            transition: 0.2s color;
        }
        .article-abstract {
            font-size: 1rem;
            color: #999;
        }
    }
}

.article-list-item a:hover {
    .article-title {
        color: skyblue;
        text-shadow: none;
    }
    .article-abstract {
        filter: brightness(1.2);
    }
}
</style>
