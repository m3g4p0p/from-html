# from-html

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

A small utility function to get element references directly from a HTML string.

- [Why?](#why)
- [Installation](#installation)
- [Usage](#usage)
  - [References](#references)
  - [Events](#events)
  - [Options](#options)
- [Breaking Changes](#breaking-changes)
- [License](#license)

## Why?

Creating nested DOM elements with JS can be tedious and verbose; you either have to create and assemble them manually, or set the `.innerHTML` of a container element and then query for its children so that you can add event listeners etc. With `fromHTML()` you can do both in one go:

```javascript
const {
  modal,
  cancelBtn,
  confirmBtn
} = fromHTML(`
  <div ref="modal" class="modal__overlay">
    <div class="modal__container">
      <div class="modal__content">Some message</div>
      <button
        ref="cancelBtn"
        class="modal__cancel-btn"
      >Cancel</button>
      <button
        ref="confirmBtn"
        class="modal__confirm-btn"
      >Confirm</button>
    </div>
  </div>
`)

cancelBtn.addEventListener('click', /* ... */)
confirmBtn.addEventListener('click', /* ... */)
document.body.appendChild(modal)
```

Or actually add event listeners directly:

```javascript
const { modal } = fromHTML(`
  <div ref="modal" class="modal__overlay">
    <div class="modal__container">
      <div class="modal__content">This site uses cookies.</div>
      <button
        on="click:accept"
        class="modal__confirm-btn"
      >Accept</button>
      <button
        on="click:reject"
        class="modal__cancel-btn"
      >Reject</button>
    </div>
  </div>
`, {
  accept () {
    document.cookie = 'cookies_accepted=1'
    modal.style.display = 'none'
  },
  reject () {
    throw 'We gotta get out of this place!'
  }
})
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

Instead of a HTML string it's also possible to pass an ID selector of a template to use:

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

While at it, you can also pass an event listener object and add event bindings with `on` attributes:

```javascript
const { button } = fromHTML(`
  <button ref="button" on="click:sayHello">Click me!</button>
`, {
  sayHello () {
    window.alert('Hello HTML!')
  }
})
```

The part before the colon specifies the type of the event, the part after it the method of the listener object to call. Multiple events can be bound with a space-separated list:

```javascript
const { button } = fromHTML(`
  <button
    ref="button"
    on="click:sayHello blur:sayGoodbye"
  >Click me!</button>
`, {
  sayHello () {
    window.alert('Hello HTML!')
  },
  sayGoodbye () {
    throw 'Goodbye!'
  }
})
```

If the method name is omitted, the listener object itself will be used to handle events (assuming of course it implements the [EventListener](https://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-EventListener) interface):

```javascript
const { button } = fromHTML(`
  <button ref="button" on="click blur">Click me!</button>
`, {
  handleEvent ({ type }) {
    switch (type) {
      case 'click':
        window.alert('Hello HTML!')
        break
      case 'blur':
        throw 'Goodbye!'
    }
  }
})
```

### Options

The following options can be specified:

Name | Type | Default | Description
-----|------|---------|------------
`refAttribute` | `string` | `ref` | The attribute to get the element references from
`eventAttribute` | `string` | `on` | The attribute denoting event bindings
`removeRefAttribute` | `boolean` | `true` | Whether to remove the reference attribute afterwards
`removeEventAttribute` | `boolean` | `true` | Whether to remove the event attribute afterwards
`assignToEventListener` | `boolean` | `false` | Whether to assign the element references to the event listener; if `true`, the merged object will be returned

For example, if you want to keep the `ref` attribute you might use `data-*` attributes for HTML compliance:

```javascript
const { button } = fromHTML(`
  <button data-ref="button">Click me!</button>
`, null, {
  refAttribute: 'data-ref',
  removeRefAttribute: false
})
```

Instead of an options object you can also pass a boolean as a shorthand for the `assignToEventListener` option:

```javascript
class DisposableButton {
  constructor (text) {
    fromHTML(`
      <button ref="_el" on="click">${text}</button>
    `, this, true)
  }

  get el () {
    return this._el
  }

  handleEvent ({ type }) {
    if (type === 'click') {
      this._el.remove()
    }
  }
}
```

## Breaking Changes

As of version 0.3.0, the options object is not the 2nd but the 3rd argument.

## License

MIT @ m3g4p0p 2018