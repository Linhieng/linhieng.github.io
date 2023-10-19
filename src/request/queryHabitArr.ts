import { post } from '@/request'

// prettier-ignore
const habitArr = [ '前端', '动漫', '漫画', '后端', '算法', '嵌入式', '脚本', 'ffmpeg', ]

export default async function queryHabitArr(): Promise<Array<string>> {
    return habitArr
}
