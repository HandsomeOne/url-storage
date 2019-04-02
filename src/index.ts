import { Core } from './core'

interface URLStorage extends Readonly<Core> {
  [key: string]: any
}

const core = new Core()

const urlStorage: URLStorage = new Proxy(core, {
  get(target, key) {
    if (Reflect.has(target, key)) {
      return Reflect.get(target, key)
    }
    return core.getItem(key.toString())
  },

  set(target, key, value) {
    if (Reflect.has(target, key)) {
      throw new Error(
        `Can't set \`${key.toString()}\` directly, use \`urlStorage.setItem('${key.toString()}', <value>)\` instead`,
      )
    }
    core.setItem(key.toString(), value)
    return true
  },

  deleteProperty(target, key) {
    if (Reflect.has(target, key)) {
      throw new Error(
        `Can't delete \`${key.toString()}\` directly, use \`urlStorage.removeItem('${key.toString()}')\` instead`,
      )
    }
    core.removeItem(key.toString())
    return true
  },
})

export { Core, urlStorage }
export default urlStorage
