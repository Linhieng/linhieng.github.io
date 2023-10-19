import axios, { AxiosError } from 'axios'
// import { BASE_URL } from '@/constants'
// axios.defaults.baseURL = BASE_URL

export async function post(url: string, data: any): Promise<any> {
    try {
        const response = await axios.post(url, data)
        return response.data
    } catch (error) {
        return undefined
        // if (error instanceof AxiosError) {
        //     return error.response
        // }
    }
}
