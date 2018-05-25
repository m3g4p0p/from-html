/**
 * Get element references from a HTML string
 *
 * @exports fromHTML
 * @param {string} html - HTML string or ID selector
 * @param {object} [eventListener = null] - event listener object
 * @param {object|boolean} [options = false] - options object or boolean as shorthand for assigning to the event listener
 * @param {string} [options.refAttribute = 'ref'] - the attribute to get the element references from
 * @param {string} [options.eventAttribute = 'on'] - the attribute denoting event bindings
 * @param {boolean} [options.removeRefAttribute = true] - whether to remove the reference attribute afterwards
 * @param {boolean} [options.removeEventAttribute = true] - whether to remove the event attribute afterwards
 * @param {boolean} [options.assignToEventListener = false] - whether to assign the references to the event listener
 * @returns {object} references as specified in the HTML
 */
export default function fromHTML (html, eventListener = null, options) {
  const {
    refAttribute: refAttr = 'ref',
    eventAttribute: evtAttr = 'on',
    removeRefAttribute: removeRef = true,
    removeEventAttribute: removeEvt = true,
    assignToEventListener: assign = typeof options === 'boolean' ? options : false
  } = typeof options === 'object' ? options : {}

  const container = document.createElement('div')
  const elementId = html[0] === '#' && html.slice(1)

  container.innerHTML = elementId
    ? document.getElementById(elementId).innerHTML
    : html

  const refs = container.querySelectorAll(`[${refAttr}]`)
  const events = container.querySelectorAll(`[${evtAttr}]`)

  Array.from(events).forEach(current => {
    const attrValue = current.getAttribute(evtAttr).trim()
    const handlers = attrValue.split(/\s+/)

    if (removeEvt) {
      current.removeAttribute(evtAttr)
    }

    handlers.forEach(handler => {
      const [type, method] = handler.split(':')

      current.addEventListener(type, method
        ? eventListener[method]
        : eventListener
      )
    })
  })

  const result = Array.from(refs).reduce((carry, current) => {
    const attrValue = current.getAttribute(refAttr).trim()
    const asArray = /\[\]$/.test(attrValue)
    const propName = asArray ? attrValue.slice(0, -2) : attrValue

    if (removeRef) {
      current.removeAttribute(refAttr)
    }

    if (asArray) {
      carry[propName] = carry[propName] || []
      carry[propName].push(current)
    } else {
      carry[propName] = current
    }

    return carry
  }, {})

  return assign ? Object.assign(eventListener, result) : result
}
