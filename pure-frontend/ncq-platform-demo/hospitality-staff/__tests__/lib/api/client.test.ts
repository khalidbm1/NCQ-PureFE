import { apiClient } from '@/lib/api/client'
import { setupServer } from 'msw/node'
import { rest } from 'msw'

// Mock server setup
const server = setupServer(
  rest.get('/api/test', (req, res, ctx) => {
    return res(ctx.json({ message: 'success' }))
  }),
  rest.post('/api/test', (req, res, ctx) => {
    return res(ctx.json({ data: req.body }))
  }),
  rest.get('/api/error', (req, res, ctx) => {
    return res(ctx.status(500), ctx.json({ error: 'Server error' }))
  }),
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('API Client', () => {
  it('makes GET requests successfully', async () => {
    const response = await apiClient.get('/test')
    
    expect(response.data).toEqual({ message: 'success' })
    expect(response.status).toBe(200)
  })

  it('makes POST requests with data', async () => {
    const payload = { name: 'Test', value: 123 }
    const response = await apiClient.post('/test', payload)
    
    expect(response.data).toEqual({ data: payload })
  })

  it('includes authentication headers when token is set', async () => {
    // Mock localStorage
    const mockToken = 'test-token-123'
    Storage.prototype.getItem = jest.fn(() => mockToken)
    
    server.use(
      rest.get('/api/auth-test', (req, res, ctx) => {
        const authHeader = req.headers.get('Authorization')
        return res(ctx.json({ authHeader }))
      })
    )
    
    const response = await apiClient.get('/auth-test')
    expect(response.data.authHeader).toBe(`Bearer ${mockToken}`)
  })

  it('handles error responses', async () => {
    await expect(apiClient.get('/error')).rejects.toThrow()
  })

  it('retries failed requests', async () => {
    let attempts = 0
    server.use(
      rest.get('/api/retry-test', (req, res, ctx) => {
        attempts++
        if (attempts < 3) {
          return res(ctx.status(503))
        }
        return res(ctx.json({ success: true }))
      })
    )
    
    const response = await apiClient.get('/retry-test', { retry: 3 })
    expect(response.data).toEqual({ success: true })
    expect(attempts).toBe(3)
  })

  it('transforms request data', async () => {
    const dateValue = new Date('2024-01-01')
    const response = await apiClient.post('/test', {
      date: dateValue,
      nested: { date: dateValue }
    })
    
    expect(response.data.data.date).toBe(dateValue.toISOString())
    expect(response.data.data.nested.date).toBe(dateValue.toISOString())
  })

  it('handles request timeout', async () => {
    server.use(
      rest.get('/api/timeout', async (req, res, ctx) => {
        await new Promise(resolve => setTimeout(resolve, 5000))
        return res(ctx.json({ message: 'delayed' }))
      })
    )
    
    await expect(
      apiClient.get('/timeout', { timeout: 100 })
    ).rejects.toThrow('timeout')
  })

  it('cancels requests with AbortController', async () => {
    const controller = new AbortController()
    
    const promise = apiClient.get('/test', { signal: controller.signal })
    controller.abort()
    
    await expect(promise).rejects.toThrow('aborted')
  })

  it('caches GET requests when cache option is enabled', async () => {
    let callCount = 0
    server.use(
      rest.get('/api/cache-test', (req, res, ctx) => {
        callCount++
        return res(ctx.json({ count: callCount }))
      })
    )
    
    const response1 = await apiClient.get('/cache-test', { cache: true })
    const response2 = await apiClient.get('/cache-test', { cache: true })
    
    expect(response1.data.count).toBe(1)
    expect(response2.data.count).toBe(1) // Should be cached
    expect(callCount).toBe(1)
  })

  it('invalidates cache when specified', async () => {
    let callCount = 0
    server.use(
      rest.get('/api/cache-invalidate', (req, res, ctx) => {
        callCount++
        return res(ctx.json({ count: callCount }))
      })
    )
    
    await apiClient.get('/cache-invalidate', { cache: true })
    apiClient.invalidateCache('/cache-invalidate')
    const response = await apiClient.get('/cache-invalidate', { cache: true })
    
    expect(response.data.count).toBe(2)
  })
})