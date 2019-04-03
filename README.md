# url-storage

使用 URL 参数来存取数据，用来解决分享 URL 的需求。

[![NPM](https://nodei.co/npm/url-storage.png)](https://nodei.co/npm/url-storage/)

完全采用 TypeScript 开发，并且有 100% 的测试覆盖率。

`urlStorage` 实现了 `Storage` 接口，意味着它的 API 和 `localStorage` 以及 `sessionStorage` 是一致的。

## 安装与引入

使用 npm：

```sh
npm install url-storage
```

使用 yarn：

```sh
yarn add url-storage
```

引入：

```js
import urlStorage from 'url-storage'
```

## 获取参数

假设当前 URL 为 `http://example.com/?id=1&arr[0]=apple&arr[1]=banana`。

```js
urlStorage.getItem('id') // "1"
urlStorage.getItem('fruits') // ["apple", "banana"]
// 或者直接这么写:
urlStorage.id // "1"
urlStorage.arr // ["apple", "banana"]
```

## 设置参数

```js
urlStorage.setItem('id', '2')
urlStorage.setItem('arr', ['cherry', 'durian'])
// 或者直接这么写:
urlStorage.id = '2'
urlStorage.arr = ['cherry', 'durian']
// URL 现在为 `http://example.com/?id=2&arr[0]=cherry&arr[1]=durian`
```

## 删除参数

```js
urlStorage.removeItem('arr')
// 或者直接这么写:
delete urlStorage.arr
// URL 现在为 `http://example.com/?id=2
```

## 清空参数

```js
urlStorage.clear()
// URL 现在为 `http://example.com/
```

## 遍历参数

```js
// 假设 URL 仍然为 `http://example.com/?id=1&arr[0]=apple&arr[1]=banana`。
for (let i = 0, n = urlStorage.length; i < n; i++) {
  console.log(urlStorage.key(i))
}
// "id"
// "arr"
```

以上便是所有的 API。

## 注意事项

值得注意的是，当使用简便语法来设置或者删除参数时，参数名不可为 urlStorage 上已存在的属性，请使用 `setItem` 和 `removeItem` 代替。

这种用法会抛出运行时错误。如果使用 TypeScript 的话，会在编译时给出提示。

```js
urlStorage.key = 'zxcvbn'
//         ^^^
//         [ts] 无法分配到“key”，因为它是常数或只读属性。
//
// Error: Can't set `key` directly, use `urlStorage.setItem('key', <value>)` instead

delete urlStorage.length
//     ^^^^^^^^^^^^^^^^^
//     [ts] 删除运算符的操作数不能是只读属性。
//
// Error: Can't delete `length` directly, use `urlStorage.removeItem('length')` instead
```

## 自定义序列化方法

本项目默认采用 `qs` 包来实现参数序列化和反序列化功能，你也可以使用自定义方法来覆盖。默认的实现为：

```js
import qs from 'qs'
import { Core } from 'url-storage'

Core.parse = search => {
  return qs.parse(search, { ignoreQueryPrefix: true })
}

Core.stringify = parsed => {
  const search = qs.stringify(parsed)
  return search ? `?${search}` : ''
}
```
