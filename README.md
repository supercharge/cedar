<div align="center">
  <a href="https://superchargejs.com">
    <img width="471" style="max-width:100%;" src="https://superchargejs.com/images/supercharge-text.svg" />
  </a>
  <br/>
  <br/>
  <p>
    <h3>Cedar</h3>
  </p>
  <p>
    Build beautiful console applications.
  </p>
  <br/>
  <p>
    <a href="#installation"><strong>Installation</strong></a> ·
    <a href="#docs"><strong>Docs</strong></a> ·
    <a href="#api"><strong>API</strong></a>
  </p>
  <br/>
  <br/>
  <p>
    <a href="https://www.npmjs.com/package/@supercharge/cedar"><img src="https://img.shields.io/npm/v/@supercharge/cedar.svg" alt="Latest Version"></a>
    <a href="https://www.npmjs.com/package/@supercharge/cedar"><img src="https://img.shields.io/npm/dm/@supercharge/cedar.svg" alt="Monthly downloads"></a>
  </p>
  <p>
    <em>Follow <a href="http://twitter.com/marcuspoehls">@marcuspoehls</a> and <a href="http://twitter.com/superchargejs">@superchargejs</a> for updates!</em>
  </p>
</div>

---

## Introduction
The `@supercharge/cedar` package allows you to create beautiful console applications.


## Installation

```
npm i @supercharge/cedar
```


## Docs
Find all the [details for `@supercharge/cedar` in the extensive Supercharge docs](https://superchargejs.com/docs/console).


## Usage
Using `@supercharge/cedar` is pretty straightforward. The package exports a handful of methods that you can reach for when requiring the package:

```js
const { Application } = require('@supercharge/cedar')

async function run () {
  const app = new Application('console-app-name')
  await app.run()
}
```


## Contributing
Do you miss a function? We very much appreciate your contribution! Please send in a pull request 😊

1.  Create a fork
2.  Create your feature branch: `git checkout -b my-feature`
3.  Commit your changes: `git commit -am 'Add some feature'`
4.  Push to the branch: `git push origin my-new-feature`
5.  Submit a pull request 🚀


## License
MIT © [Supercharge](https://superchargejs.com)

---

> [superchargejs.com](https://superchargejs.com) &nbsp;&middot;&nbsp;
> GitHub [@supercharge](https://github.com/supercharge) &nbsp;&middot;&nbsp;
> Twitter [@superchargejs](https://twitter.com/superchargejs)
