import './dist/server/entry.mjs'
import { renderPage } from 'vike/server'

function getMethod(event) {
  return event.requestContext?.http?.method || event.httpMethod || 'GET'
}

function getRawPath(event) {
  return event.rawPath || event.path || '/'
}

function getRawQuery(event) {
  if (typeof event.rawQueryString === 'string') return event.rawQueryString

  const params = event.queryStringParameters || {}
  const search = new URLSearchParams()

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue
    search.set(key, String(value))
  }

  return search.toString()
}

function getHost(event) {
  return event.headers?.host || event.headers?.Host || 'localhost'
}

function toNodeHeaders(headers) {
  const mapped = {}
  for (const [key, value] of Object.entries(headers || {})) {
    if (value === undefined || value === null) continue
    mapped[String(key).toLowerCase()] = String(value)
  }
  return mapped
}

function buildUrlOriginal(event) {
  const path = getRawPath(event)
  const query = getRawQuery(event)
  return query ? `${path}?${query}` : path
}

function applyHttpResponseHeaders(httpResponse, outHeaders) {
  const maybeHeaders = httpResponse?.headers

  if (!maybeHeaders) return

  if (Array.isArray(maybeHeaders)) {
    for (const header of maybeHeaders) {
      if (!header) continue
      const name = header.name || header[0]
      const value = header.value || header[1]
      if (!name || value === undefined || value === null) continue
      outHeaders[String(name)] = String(value)
    }
    return
  }

  for (const [name, value] of Object.entries(maybeHeaders)) {
    if (value === undefined || value === null) continue
    outHeaders[String(name)] = String(value)
  }
}

async function getBody(httpResponse) {
  if (typeof httpResponse.body === 'string') return httpResponse.body
  if (typeof httpResponse.getBody === 'function') {
    return await httpResponse.getBody()
  }
  return ''
}

function defaultHeaders() {
  return {
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'public, max-age=0, s-maxage=300, stale-while-revalidate=300',
  }
}

export async function handler(event) {
  const method = getMethod(event)

  if (method === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization',
      },
      body: '',
    }
  }

  const headersOriginal = toNodeHeaders(event.headers || {})
  const urlOriginal = buildUrlOriginal(event)

  try {
    const pageContext = await renderPage({
      urlOriginal,
      headersOriginal,
      method,
      host: getHost(event),
    })

    const httpResponse = pageContext.httpResponse

    if (!httpResponse) {
      return {
        statusCode: 404,
        headers: defaultHeaders(),
        body: '<!doctype html><html><head><title>404</title></head><body><h1>Not Found</h1></body></html>',
      }
    }

    const headers = defaultHeaders()
    applyHttpResponseHeaders(httpResponse, headers)

    const body = await getBody(httpResponse)

    return {
      statusCode: Number(httpResponse.statusCode || 200),
      headers,
      body,
      isBase64Encoded: false,
    }
  } catch (error) {
    console.error('SSR Lambda error:', error)
    return {
      statusCode: 500,
      headers: defaultHeaders(),
      body: '<!doctype html><html><head><title>500</title></head><body><h1>Internal Server Error</h1></body></html>',
    }
  }
}
