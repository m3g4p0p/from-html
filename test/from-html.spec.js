const fromHTML = require('../src/from-html')

describe('::fromHTML', () => {
  describe('references', () => {
    it('should create single references', () => {
      const { foo } = fromHTML(`
        <div ref="foo"></div>
      `)

      expect(foo instanceof HTMLElement).toBe(true)
    })

    it('should create nested references', () => {
      const { foo, bar } = fromHTML(`
        <div ref="foo">
          <div ref="bar"></div>
        </div>
      `)

      expect(bar.parentNode).toBe(foo)
    })

    it('should create an array of references', () => {
      const { foo } = fromHTML(`
        <div ref="foo[]"></div>
        <div ref="foo[]"></div>
      `)

      expect(foo.length).toBe(2)
      expect(foo[0].nextElementSibling).toBe(foo[1])
    })

    it('should work with passing an ID', () => {
      document.body.innerHTML = `
        <script type="text/template" id="my-template">
          <div ref="foo"></div>
        </script>
      `

      const { foo } = fromHTML('#my-template')

      expect(foo instanceof HTMLElement).toBe(true)
    })
  })

  describe('events', () => {
    it('should call an event handler', done => {
      const { foo } = fromHTML(`
        <div ref="foo" on="click:handleClick"></div>
      `, {
        handleClick () {
          expect(this).toBe(foo)
          done()
        }
      })

      foo.click()
    })

    it('should call multiple handlers', done => {
      let clickReceived
      let focusReceived

      const { foo } = fromHTML(`
        <input ref="foo" on="
          click:handleClick
          focus:handleFocus
        "></input>
      `, {
        handleClick ({ type }) {
          expect(type).toBe('click')
          clickReceived()
        },
        handleFocus ({ type }) {
          expect(type).toBe('focus')
          focusReceived()
        }
      })

      Promise.all([
        new Promise(resolve => {
          clickReceived = resolve
        }),
        new Promise(resolve => {
          focusReceived = resolve
        })
      ]).then(done)

      foo.click()
      foo.focus()
    })

    it('should call handleEvent', done => {
      const controller = {
        handleEvent () {
          expect(this).toBe(controller)
          done()
        }
      }

      const { foo } = fromHTML(`
        <div ref="foo" on="click"></div>
      `, controller)

      foo.click()
    })
  })

  describe('options', () => {
    it('should work with custom attribute names', () => {
      const { foo } = fromHTML(`
        <div data-ref="foo"></div>
      `, null, { refAttribute: 'data-ref' })

      expect(foo instanceof HTMLElement).toBe(true)
    })

    it('should remove reference attributes by default', () => {
      const { foo } = fromHTML(`
        <div ref="foo"></div>
      `)

      expect(foo.getAttribute('ref')).toBeNull()
    })

    it('should keep reference attributes if desired', () => {
      const { foo } = fromHTML(`
        <div ref="foo"></div>
      `, null, { removeRefAttribute: false })

      expect(foo.getAttribute('ref')).toBe('foo')
    })

    it('should assign refs to the controller', () => {
      const foo = {}

      const bar = fromHTML(`
        <div ref="baz"></div>
      `, foo, {
        assignToController: true
      })

      expect(foo.baz instanceof HTMLElement).toBe(true)
      expect(foo).toBe(bar)
    })

    it('should not assign references by default', () => {
      const foo = {}

      fromHTML(`
        <div ref="bar"></div>
      `, foo)

      expect(foo.bar).toBeUndefined()

      fromHTML(`
        <div ref="bar"></div>
      `, foo, {
        refAttribute: 'data-ref'
      })

      expect(foo.bar).toBeUndefined()
    })

    it('should assign references to a given property', () => {
      const foo = {}

      const bar = fromHTML(`
        <div ref="baz"></div>
      `, foo, {
        assignToController: 'refs'
      })

      expect(foo.refs.baz instanceof HTMLElement).toBe(true)
      expect(foo.refs).toBe(bar)
    })

    it('should accept a boolean as shorthand for assigning the refs', () => {
      const foo = {}

      fromHTML(`
        <div ref="bar"></div>
      `, foo, false)

      expect(foo.bar).toBeUndefined()

      fromHTML(`
        <div ref="bar"></div>
      `, foo, true)

      expect(foo.bar instanceof HTMLElement).toBe(true)
    })

    it('should accept a string as a shorthand for assigning the refs to a prop', () => {
      const foo = {}

      const bar = fromHTML(`
        <div ref="baz"></div>
      `, foo, 'refs')

      expect(foo.refs.baz instanceof HTMLElement).toBe(true)
      expect(foo.refs).toBe(bar)
    })
  })
})
