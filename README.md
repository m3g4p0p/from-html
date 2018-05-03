# from-html.js

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

A tiny helper function to get element references directly from a HTML string.

## Motivation

If you want to create a somewhat complex element tree you may have found yourself writing something like this:

```javascript
const overlay = document.createElement('div')
const content = document.createElement('div')
const cancelBtn = document.createElement('button')
const confirmBtn = document.createElement('button')

overlay.classList.add('modal__overlay')
content.classList.add('modal__content')
cancelBtn.classList.add('modal__cancel-btn')
confirmBtn.classList.add('modal__confirm-btn')

overlay.appendChild(content)
overlay.appendChild(cancelBtn)
overlay.appendChild(confirmBtn)

cancelBtn.addEventListener('click', /* ... */)
// ...
```

Now this is pretty verbose, and you can't immediately see the tree structure from just looking at the code. This looks somewhat better:

```javascript
const overlay = document.createElement('div')

modal.innerHTML = `
  <div class="modal__overlay">
    <div class="modal__content">...</div>
    <button class="modal__cancel-btn">Cancel</button>
    <button class="modal__confirm-btn">Confirm</button>
  </div>
`

const content = overlay.querySelector('.modal__content')
const cancelBtn = overlay.querySelector('.modal__cancel-btn')
const confirmBtn = overlay.querySelector('.modal__confirm-btn')
```

... but that's still quite verbose, and you have to keep the query selectors in sync with the markup. So here's how it looks like using `fromHTML()`:

```javascript
import fromHTML from 'from-html'

const {
  overlay,
  content,
  cancelBtn,
  confirmBtn
} = fromHTML(`
  <div class="modal__overlay" ref="overlay">
    <div class="modal__content" ref="content">...</div>
    <button class="modal__cancel-btn" ref="cancelBtn">Cancel</button>
    <button class="modal__confirm-btn" ref="confirmBtn">Confirm</button>
  </div>
`)
```

## Installation

Install like usual:

```
yarn add from-html
```

Then include it in your JS like

```javascript
import fromHTML from 'from-html'
```

## API

```
fromHTML(htmlString [, options])
```

The values of the `ref` attributes will get mapped to the property names of the returned object; it's also possible to get an array of elements (not a node list!) by appending square brackets to the `ref` name. Example:

```javascript
const names = ['Jane', 'John', 'Jimmy']

const { list, items } = fromHTML(`
  <ul ref="list">
    ${names.map(name => `<li ref="items[]">${name}</li>`).join('')}
  </ul>
`)
```

Possible options are:

- `refAttribute: String` -- the attribute to get the element references from; defaults to `ref`
- `removeRefAttribute: Boolean` -- whether to remove that attribute afterwards; defaults to `true`

If you want to keep the `ref` attribute it would probably be advisable to use `data-*` attributes, like e.g.

```javascript
const { container, button } = fromHTML(`
  <div data-ref="container">
    <button data-ref="button">Click me!</button>
  </div>
`, {
  refAttribute: 'data-ref',
  removeRefAttribute: false
})
```

## License

MIT @ m3g4p0p 2018