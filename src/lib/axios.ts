import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import axios from 'axios'
import { env } from '#/env'

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean
}

export const apiBaseUrl = env.VITE_API_URL ?? 'http://localhost:8000/api/v1'
export const backendUrl = apiBaseUrl.replace(/\/api(\/v\d+)?\/?$/, '')

const api: AxiosInstance = axios.create({
    baseURL: apiBaseUrl,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest', // Tells Laravel this is a stateful SPA AJAX call
    },
    withCredentials: true, // Sends session cookies with every request
    withXSRFToken: true,   // Sends X-XSRF-TOKEN header automatically
})

/**
 * Initializes CSRF protection for Sanctum cookie-based session
 */
export async function getCsrfCookie(): Promise<void> {
    await axios.get(`${backendUrl}/sanctum/csrf-cookie`, {
        withCredentials: true,
    })
}

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config as CustomAxiosRequestConfig

        // If CSRF token expired (419) and hasn't been retried yet
        if (error.response?.status === 419 && originalRequest && !originalRequest._retry) {
            originalRequest._retry = true
            await getCsrfCookie()
            return api(originalRequest)
        }

        return Promise.reject(error)
    },
)

export default api