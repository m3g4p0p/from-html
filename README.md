# from-html

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

A tiny utility function to get element references directly from a HTML string.

## Why?

If you want to create a somewhat complex element tree with JS you may have found yourself writing something like this:

```javascript
const overlay = document.createElement('div')
const container = document.createElement('div')
const content = document.createElement('div')
const cancelBtn = document.createElement('button')
const confirmBtn = document.createElement('button')

overlay.classList.add('modal__overlay')
container.classList.add('modal__container')
content.classList.add('modal__content')
cancelBtn.classList.add('modal__cancel-btn')
confirmBtn.classList.add('modal__confirm-btn')

content.textContent = 'Some message'
cancelBtn.textContent = 'Cancel'
confirmBtn.textContent = 'Confirm'

overlay.appendChild(container)
container.appendChild(content)
container.appendChild(cancelBtn)
container.appendChild(confirmBtn)

cancelBtn.addEventListener('click', () => {/* ... */})
// ...
document.body.appendChild(overlay)
```

Now this is pretty verbose, and you can't immediately see the tree structure from just looking at the code. This looks somewhat better:

```javascript
const overlay = document.createElement('div')

modal.innerHTML = `
  <div class="modal__overlay">
    <div class="modal__container">
      <div class="modal__content">Some message</div>
      <button class="modal__cancel-btn">Cancel</button>
      <button class="modal__confirm-btn">Confirm</button>
    </div>
  </div>
`

const content = overlay.querySelector('.modal__content')
const cancelBtn = overlay.querySelector('.modal__cancel-btn')
const confirmBtn = overlay.querySelector('.modal__confirm-btn')
```

... but it's still quite verbose, and you have to keep the query selectors in sync with the markup. So here's how it looks like using `fromHTML()`:

```javascript
const {
  overlay,
  content,
  cancelBtn,
  confirmBtn
} = fromHTML(`
  <div class="modal__overlay" ref="overlay">
    <div class="modal__container">
      <div class="modal__content" ref="content">Some message</div>
      <button class="modal__cancel-btn" ref="cancelBtn">Cancel</button>
      <button class="modal__confirm-btn" ref="confirmBtn">Confirm</button>
    </div>
  </div>
`)
```

A simple but complete real-world example can be seen [here](https://gist.github.com/m3g4p0p/8638c37447c638bede24fc1a767ab486).

## Installation

Install like usual:

```
yarn add from-html
```

Then include it in your JS like

```javascript
import fromHTML from 'from-html'
```

Or if you prefer the old-fashioned way:

```html
<script src="./node_modules/from-html/lib/from-html.js"></script>
```

## Usage

```
fromHTML(htmlString [, eventListener [, options]])
```

### References

The values of the `ref` attributes will get mapped to the property names of the returned object; you can also get an array of elements (not a node list!) by appending square brackets to the `ref` name:

```javascript
const names = ['Jane', 'John', 'Jimmy']

const { list, items } = fromHTML(`
  <ul ref="list">
    ${names.map(name => `<li ref="items[]">${name}</li>`).join('')}
  </ul>
`)
```

Instead of a HTML string it's also possible to pass an ID selector:

```html
<script type="text/template" id="my-template">
  <ul ref="list">
    <li ref="items[]">Jane</li>
    <li ref="items[]">John</li>
    <li ref="items[]">Jimmy</li>
  </ul>
</script>
```

```javascript
const { list, items } = fromHTML('#my-template')
```

### Events

While at it, you can pass an event listener object and add event bindings with `on` attributes:

```javascript
const { button } = fromHTML(`
  <button ref="button" on="click:sayHello">Click me!</button>
`, {
  sayHello () {
    window.alert('Hello HTML!)
  }
})
```

The part before the colon specifies the type of the event, the part after it the method of the listener object to call. If the method name is omitted, the listener object itself will get added as an event listener (assuming of course it implements the [EventListener](https://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-EventListener) interface):

```javascript
const { button } = fromHTML(`
  <button ref="button" on="click">Click me!</button>
`, {
  handleEvent ({ type }) {
    if (type === 'click) {
      window.alert('Hello HTML!)
    }
  }
})
```

Multiple events can be bound with a space-separated list:

```javascript
const { button } = fromHTML(`
  <button
    ref="button"
    on="click:sayHello blur:sayGoobye"
  >Click me!</button>
`, {
  sayHello () {
    window.alert('Hello HTML!)
  },
  sayGoobye () {
    throw 'Goodbye!'
  }
})
```

### Options

The following options can be specified:

- `refAttribute: string` -- the attribute to get the element references from; defaults to `ref`
- `eventAttribute: string` -- the attribute denoting event bindings; defaults to `on`
- `removeRefAttribute: boolean` -- whether to remove the reference attribute afterwards; defaults to `true`
- `removeEventAttribute: boolean` -- whether to remove the event attribute afterwards; defaults to `true`

For example, if you want to keep the `ref` attribute you might use `data-*` attributes for HTML compliance:

```javascript
const { button } = fromHTML(`
  <button data-ref="button">Click me!</button>
`, {
  refAttribute: 'data-ref',
  removeRefAttribute: false
})
```

## Breaking Changes

As of version 0.3.0, the options object is not the 2nd but the 3rd argument.

## License

MIT @ m3g4p0p 2018