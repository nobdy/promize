<a href="https://promisesaplus.com/">
    <img src="https://promisesaplus.com/assets/logo-small.png" alt="Promises/A+ logo"
         title="Promises/A+ 1.1.0 compliant" align="right" />
</a>

## Promise

In order to facilitate the understanding of the principle of `Promise`, I wrote a `Promise` object to realize the function of `Promise`.

[![travis][travis-image]][travis-url]
[![dep][dep-image]][dep-url]
[![lang][lang-image]][lang-url]
[![ver][ver-image]][ver-url]
[![size][size-image]][size-url]
[![issue][issue-image]][issue-url]
[![lic][lic-image]][lic-url]
[![imp][imp-image]][imp-url]
[![act][act-image]][act-url]
[![fork][fork-image]][fork-url]
[![star][star-image]][star-url]

[travis-image]: https://img.shields.io/travis/nobdy/promize.svg?style=flat
[travis-url]: https://travis-ci.org/nobdy/promize
[dep-image]: https://img.shields.io/david/nobdy/promize.svg?style=flat
[dep-url]: https://david-dm.org/nobdy/promize
[lang-image]: https://img.shields.io/badge/language-JavaScript-43853d.svg
[lang-url]: https://img.shields.io/badge/language-JavaScript-43853d.svg
[ver-image]: https://img.shields.io/github/package-json/v/nobdy/promize
[ver-url]: https://github.com/nobdy/promize
[size-image]: https://img.shields.io/github/size/nobdy/promize/promise.js
[size-url]: https://github.com/nobdy/promize
[issue-image]: https://img.shields.io/github/issues/nobdy/promize
[issue-url]: https://github.com/nobdy/promize/issues
[lic-image]: https://img.shields.io/github/license/nobdy/promize
[lic-url]: https://github.com/nobdy/promize/blob/master/LICENSE
[imp-image]: https://img.shields.io/github/package-json/implements/nobdy/promize
[imp-url]: https://github.com/nobdy/promize
[act-image]: https://img.shields.io/github/last-commit/nobdy/promize
[act-url]: https://github.com/nobdy/promize/graphs/commit-activity
[fork-image]: https://img.shields.io/github/forks/nobdy/promize?label=Fork&style=social
[fork-url]: https://github.com/nobdy/promize/network/members
[star-image]: https://img.shields.io/github/stars/nobdy/promize?style=social
[star-url]: https://github.com/nobdy/promize/stargazers


### Run test cases

```bash
yarn
yarn test
```

or

```bash
npm install
npm run test
```

### Basic usage

```javascript
Promise.resolve('complete').then(r => {
    console.log(`the status is `, r)
})
```

### Release version

#### 2.0.0

On the basis of version 1.0.0, it is clearer to organize Promise from function into class.

#### 1.0.0

Achieved the Promises/A+ 1.1.0 standard and passed the test cases.

### Reference documents

1. [Promises/A+](https://promisesaplus.com/)

1. [Conformant Implementations](https://promisesaplus.com/implementations)
