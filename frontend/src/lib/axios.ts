import axios, { AxiosRequestConfig, AxiosResponse, AxiosInstance } from 'axios'
import { AXIOS_TIMEOUT } from '@/config'

const AXIOS_CONFIG_DEFAULTS = {
  timeout: AXIOS_TIMEOUT,
  headers: {
    Accept: 'application/json'
  }
}

export const AXIOS_CLIENT = axios.create(AXIOS_CONFIG_DEFAULTS)

type HTTPMethod = 'get' | 'post' | 'put' | 'delete' | 'patch'
type RequestParams<T> = {
  method: HTTPMethod
  url: string
  req: T
  config?: AxiosRequestConfig<T>
}
type MockParams<T> = {
  shouldReject?: boolean
  mockData: T
  timeout?: number
  errorMessage?: string
}

export const request = async <TReq, TRes>(
  params: RequestParams<TReq>,
  mockParams?: MockParams<TRes>
): Promise<TRes> => {
  try {
    if (mockParams) {
      return await fetchMockData(mockParams)
    }

    const response = await axiosFetch<TReq, TRes>(params, AXIOS_CLIENT)

    return response.data
  } catch (error) {
    throw error
  }
}

export const fetchMockData = <T>({
  mockData,
  shouldReject = false,
  timeout = 1000,
  errorMessage
}: MockParams<T>): Promise<T> =>
  new Promise<T>((resolve, reject) => {
    setTimeout(() => {
      if (shouldReject) {
        return reject(new Error(errorMessage || 'Fetch mock error'))
      }

      resolve(mockData)
    }, timeout)
  })

export const isMethodWithoutBody = (method: HTTPMethod) =>
  method === 'get' || method === 'delete'

const axiosFetch = <TReq, TRes>(
  params: RequestParams<TReq>,
  client: AxiosInstance
) => {
  const fetch = isMethodWithoutBody(params.method)
    ? client[params.method]<TReq, AxiosResponse<TRes, TReq>>(params.url, {
        params: params.req,
        ...params.config
      })
    : client[params.method]<TReq, AxiosResponse<TRes, TReq>>(
        params.url,
        params.req,
        params.config
      )

  return fetch
}
