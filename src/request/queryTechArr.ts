import { post } from '@/request'

const techArr = ['前端']

export default async function queryTechArr(): Promise<Array<string>> {
    return techArr
}
