import unfetch from 'isomorphic-unfetch'

const isServer = typeof window === 'undefined'
const prefix = isServer ? process.env.BASE_API_URL : ''

export const fetch = (url: string, options?: RequestInit) =>
  unfetch((url.startsWith('http') ? '' : prefix) + url, options)
