/**
 * Get element references from a HTML string
 *
 * @exports fromHTML
 * @param {string} html - HTML string or ID selector
 * @param {object} [controller = null] - controller object
 * @param {object|boolean|string} [options = false] - options object or boolean / string as shorthand for assigning to the controller
 * @param {string} [options.refAttribute = 'ref'] - the attribute to get the element references from
 * @param {string} [options.eventAttribute = 'on'] - the attribute denoting event bindings
 * @param {boolean} [options.removeRefAttribute = true] - whether to remove the reference attribute afterwards
 * @param {boolean} [options.removeEventAttribute = true] - whether to remove the event attribute afterwards
 * @param {boolean|string} [options.assignToController = false] - whether to assign the references to the controller
 * @returns {object} references as specified in the HTML
 */
export default function fromHTML (html, controller = null, options = {}) {
  const {
    refAttribute: refAttr = 'ref',
    eventAttribute: evtAttr = 'on',
    removeRefAttribute: removeRef = true,
    removeEventAttribute: removeEvt = true,
    assignToController: assign = (
      typeof options === 'boolean' ||
      typeof options === 'string'
    ) ? options : false
  } = typeof options === 'object' ? options : {}

  const container = document.createElement('div')
  const elementId = html[0] === '#' && html.slice(1)
  const assignProp = typeof assign === 'string' && assign

  container.innerHTML = elementId
    ? document.getElementById(elementId).innerHTML
    : html

  const refs = container.querySelectorAll(`[${refAttr}]`)
  const events = container.querySelectorAll(`[${evtAttr}]`)

  // Add event listeners
  Array.from(events, current => {
    current
      .getAttribute(evtAttr)
      .trim()
      .split(/\s+/)
      .forEach(binding => {
        const [type, method] = binding.split(':')
        const handler = method ? controller[method] : controller

        current.addEventListener(type, handler)
      })

    if (removeEvt) {
      current.removeAttribute(evtAttr)
    }
  })

  if (assignProp) {
    controller[assignProp] = controller[assignProp] || {}
  }

  // Add the references to the target object
  return Array.from(refs).reduce((carry, current) => {
    const [, propName, asArray] = current
      .getAttribute(refAttr)
      .trim()
      .match(/(.*?)(\[\])?$/)

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
  }, assign === false
    ? {}
    : assignProp
      ? controller[assignProp]
      : controller
  )
}
