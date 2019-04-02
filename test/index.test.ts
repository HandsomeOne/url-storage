import { urlStorage, Core } from '../src'
import { reset } from '../src/core'

afterEach(reset)

describe('Basic', () => {
  beforeEach(() => {
    history.replaceState({}, 'test', '/?a=1&b=2')
  })

  test('get item', () => {
    expect(urlStorage.getItem('a')).toBe('1')
  })

  test('set item', done => {
    urlStorage.setItem('a', 2)
    setTimeout(() => {
      expect(location.search).toMatch(/a=2/)
      done()
    }, 0)
  })

  test('remove item', done => {
    urlStorage.removeItem('a')
    setTimeout(() => {
      expect(location.search).toBe('?b=2')
      done()
    }, 0)
  })

  test('clear', done => {
    urlStorage.clear()
    setTimeout(() => {
      expect(location.search).toBe('')
      done()
    }, 0)
  })

  test('for each', () => {
    const n = urlStorage.length
    const keys: string[] = []
    for (let i = 0; i < n; i++) {
      keys.push(urlStorage.key(i))
    }

    expect(n).toBe(2)
    expect(keys).toContain('a')
    expect(keys).toContain('b')
  })

  test('mixed', () => {
    expect(urlStorage.getItem('a')).toBe('1')
    urlStorage.setItem('a', '2')
    expect(urlStorage.getItem('a')).toBe('2')
    urlStorage.removeItem('a')
    expect(urlStorage.getItem('a')).toBeUndefined()
    urlStorage.clear()
    expect(urlStorage.getItem('b')).toBeUndefined()
  })
})

describe('Custom Core', () => {
  const originalParse = Core.parse
  const originalStringify = Core.stringify

  beforeAll(() => {
    Core.parse = (search: string) => {
      search = search.replace(/^\?/, '')
      search = decodeURIComponent(search)
      try {
        return JSON.parse(search)
      } catch {
        return {}
      }
    }

    Core.stringify = (parsed: any) => {
      const search = encodeURIComponent(JSON.stringify(parsed))
      return search ? `?${search}` : ''
    }
  })

  afterAll(() => {
    Core.parse = originalParse
    Core.stringify = originalStringify
  })

  beforeEach(() => {
    history.replaceState({}, 'test', '/?{"a":1,"b":2}')
  })

  test('get item', () => {
    expect(urlStorage.getItem('a')).toBe(1)
  })

  test('set item', done => {
    urlStorage.setItem('a', 2)
    setTimeout(() => {
      expect(decodeURIComponent(location.search)).toMatch(/"a":2/)
      done()
    })
  })
})

describe('Basic Proxy', () => {
  beforeEach(() => {
    history.replaceState({}, 'test', '/?a=1&b=2')
  })

  test('get item', () => {
    expect(urlStorage.length).toBe(2)
    expect(urlStorage.a).toBe('1')
    expect(urlStorage.b).toBe('2')
  })

  test('set item', done => {
    urlStorage.a = 2
    setTimeout(() => {
      expect(location.search).toMatch(/a=2/)
      done()
    }, 0)
  })

  test('remove item', done => {
    delete urlStorage.a
    setTimeout(() => {
      expect(location.search).toBe('?b=2')
      done()
    }, 0)
  })

  test('protect fields', () => {
    expect(() => ((urlStorage as any).key = 1)).toThrow()
    expect(() => delete (urlStorage as any).key).toThrow()
  })
})

describe('Advanced Proxy', () => {
  beforeEach(() => {
    history.replaceState({}, 'test', '/?a[0]=1&b[key]=value')
  })

  test('value', () => {
    expect(urlStorage.a).toEqual(['1'])
    expect(urlStorage.b).toEqual({ key: 'value' })
  })
})
