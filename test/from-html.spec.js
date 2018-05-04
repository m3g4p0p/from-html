import { JSDOM } from 'jsdom'
import fromHTML from '../lib/from-html'

describe('::fromHTML', () => {
  beforeEach(() => {
    const jsdom = new JSDOM('<!doctype html><html><body></body></html>')
    const { window } = jsdom

    global.window = window
    global.document = window.document
  })

  describe('references', () => {
    it('should create single references', () => {
      const { foo } = fromHTML(`
        <div ref="foo"></div>
      `)

      expect(foo instanceof window.HTMLElement).toBe(true)
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

      expect(foo instanceof window.HTMLElement).toBe(true)
    })
  })

  describe('options', () => {
    it('should work with custom attribute names', () => {
      const { foo } = fromHTML(`
        <div data-ref="foo"></div>
      `, { refAttribute: 'data-ref' })

      expect(foo instanceof window.HTMLElement).toBe(true)
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
      `, { removeRefAttribute: false })

      expect(foo.getAttribute('ref')).toBe('foo')
    })
  })
})
