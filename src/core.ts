import * as qs from 'qs'

const empty = Object.create(null)
Object.freeze(empty)

let parsed: Record<string, any> = empty
let keys: string[] = []

function init() {
  if (parsed === empty) {
    parsed = Core.parse(location.search)
    keys = Object.keys(parsed)
  }
}

/** for test purpose only */
export function reset() {
  parsed = empty
  keys = []
}

function replaceAndReset() {
  history.replaceState(
    {},
    document.title,
    location.origin +
      location.pathname +
      Core.stringify(parsed) +
      location.hash,
  )

  reset()
}

const timeoutIds: {
  reset?: number
  replaceAndReset?: number
} = {}

function willReset() {
  window.clearTimeout(timeoutIds.reset)
  timeoutIds.reset = window.setTimeout(reset, 0)
}

function willReplaceAndReset() {
  window.clearTimeout(timeoutIds.reset)
  window.clearTimeout(timeoutIds.replaceAndReset)
  timeoutIds.replaceAndReset = window.setTimeout(replaceAndReset, 0)
}

export class Core implements Storage {
  static parse(search: string) {
    return qs.parse(search, { ignoreQueryPrefix: true })
  }

  static stringify(parsed: any) {
    const search = qs.stringify(parsed)
    return search ? `?${search}` : ''
  }

  get length() {
    init()
    willReset()
    return keys.length
  }

  key(index: number) {
    init()
    willReset()
    return keys[index]
  }

  getItem(key: string) {
    init()
    willReset()
    return parsed[key]
  }

  setItem(key: string, value: any) {
    init()
    willReplaceAndReset()
    parsed[key] = value
  }

  removeItem(key: string) {
    init()
    willReplaceAndReset()
    delete parsed[key]
  }

  clear() {
    parsed = Object.create(null)
    keys = []
    willReplaceAndReset()
  }
}
