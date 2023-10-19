<template>
    <div class="profile">
        <!-- <h2>关于我</h2> -->
        <div class="avatar">
            <img
                src="https://pic.imgdb.cn/item/6304358116f2c2beb15e9a9b.jpg"
                alt="avatar"
            />
        </div>
        <div class="info grid-layout">
            <h3 class="profile-into-title text-shadow-black">
                <span class="icon-box"><IconHabit /></span> 我的个性：
            </h3>
            <p class="text-shadow-black profile-into-contnet">
                <TypeWriter
                    text="一个喜欢新鲜技术、热爱开源、乐观开朗的大男孩。"
                ></TypeWriter>
            </p>
            <h3 class="profile-into-title text-shadow-black">
                <span class="icon-box"><IconIndividual /></span> 我的兴趣：
            </h3>
            <p class="text-shadow-black profile-into-contnet item-arr">
                <span
                    v-for="(habit, i) of habitArrRef"
                    :key="i"
                    class="follow-separator"
                    >{{ habit }}</span
                >
            </p>
            <h3 class="profile-into-title text-shadow-black">
                <span class="icon-box"><IconLiveStyle /></span> 我的特长：
            </h3>
            <p class="text-shadow-black profile-into-contnet">
                <span v-for="(tech, i) of techArrRef" :key="i">{{ tech }}</span>
            </p>
            <h3 class="profile-into-title text-shadow-black">
                <span class="icon-box"><IconTech /></span> 生活习惯：
            </h3>
            <p class="text-shadow-black profile-into-contnet">
                <TypeWriter text="健康第一：早起早睡、坚持运动。"></TypeWriter>
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
import TypeWriter from '@/components/widgets/TypeWriter.vue'
import IconHabit from '@/components/icons/IconHabit.vue'
import IconIndividual from '@/components/icons/IconIndividual.vue'
import IconLiveStyle from '@/components/icons/IconLiveStyle.vue'
import IconTech from '@/components/icons/IconTech.vue'
import queryTechArr from '@/request/queryTechArr'
import queryHabitArr from '@/request/queryHabitArr'
import { onBeforeMount, ref } from 'vue'

// data ------------------------------------
const habitArrRef = ref<Array<string>>(['...'])
const techArrRef = ref<Array<string>>(['...'])

// life cycle ------------------------------------
onBeforeMount(() => {
    getHabitArr()
    getTechArr()
})

// fetch data ------------------------------------
async function getHabitArr() {
    habitArrRef.value = await queryHabitArr()
}
async function getTechArr() {
    techArrRef.value = await queryTechArr()
}
</script>

<style scoped lang="scss">
.profile {
    min-width: 300px;
    margin: 0 auto;
    padding: 2rem;

    display: flex;
    flex-direction: column;
    align-items: center;

    .avatar {
        width: 140px;
        height: 140px;
        overflow: hidden;
        border-radius: 100%;
        margin: 20px;
        img {
            object-position: -30px 0px;
        }
    }

    .grid-layout {
        display: grid;
        grid-template-columns: max-content 1fr;
        align-items: center;
        row-gap: 10px;

        .profile-into-title {
            font-weight: bold;
            display: flex;
            align-items: center;
            .icon-box {
                height: 24px;
                margin-right: 5px;
            }
        }

        .follow-separator:not(:last-of-type)::after {
            content: '、';
        }
    }
}
</style>
