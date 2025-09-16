import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'

export interface RetryOptions {
  maxRetries?: number
  baseDelayMs?: number
  timeoutMs?: number
  shouldRetry?(error: unknown, attempt: number): boolean
}

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms))

const defaultShouldRetry = (error: unknown): boolean => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError
    if (axiosError.code === 'ECONNABORTED' || axiosError.message.includes('timeout')) {
      return true
    }
    const status = axiosError.response?.status
    return status ? status >= 500 && status < 600 : true
  }
  return true
}

export async function axiosGetWithRetry<T = unknown>(
  url: string,
  config: AxiosRequestConfig = {},
  options: RetryOptions = {},
): Promise<AxiosResponse<T>> {
  const {
    maxRetries = 3,
    baseDelayMs = 300,
    timeoutMs = 8000,
    shouldRetry = defaultShouldRetry,
  } = options

  let lastError: unknown = null
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await axios.get<T>(url, { timeout: timeoutMs, ...config })
      return response
    } catch (error) {
      lastError = error
      const isLastAttempt = attempt === maxRetries
      if (isLastAttempt || !shouldRetry(error, attempt)) break
      const jitter = Math.floor(Math.random() * 100)
      const delay = baseDelayMs * Math.pow(2, attempt) + jitter
      await sleep(delay)
    }
  }
  throw lastError
}

export const http = {
  getWithRetry: axiosGetWithRetry,
}
