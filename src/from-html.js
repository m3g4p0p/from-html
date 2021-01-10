/**
 * Get element references from a HTML string
 *
 * @exports fromHTML
 * @param {string} html - HTML string or ID selector
 * @param {Object} [controller = null] - controller object
 * @param {Object|boolean|string} [options = false] - options object or boolean / string as shorthand for assigning to the controller
 * @param {string} [options.refAttribute = 'ref'] - the attribute to get the element references from
 * @param {string} [options.eventAttribute = 'on'] - the attribute denoting event bindings
 * @param {boolean} [options.removeRefAttribute = true] - whether to remove the reference attribute afterwards
 * @param {boolean} [options.removeEventAttribute = true] - whether to remove the event attribute afterwards
 * @param {boolean|string} [options.assignToController = false] - whether to assign the references to the controller
 * @returns {Object.<string, HTMLElement>} references as specified in the HTML
 */
export default function fromHTML (html, controller = null, options = false) {
  const {
    refAttribute: refAttr = 'ref',
    eventAttribute: evtAttr = 'on',
    removeRefAttribute: removeRef = true,
    removeEventAttribute: removeEvt = true,
    assignToController: assign = (
      typeof options === 'boolean' ||
      typeof options === 'string'
    )
      ? options
      : false
  } = typeof options === 'object'
    ? options
    : {}

  const container = document.createElement('div')
  const elementId = html[0] === '#' && html.slice(1)
  const assignProp = typeof assign === 'string' && assign

  container.innerHTML = elementId
    ? document.getElementById(elementId).innerHTML
    : html

  const refElements = container.querySelectorAll(`[${refAttr}]`)
  const evtElements = container.querySelectorAll(`[${evtAttr}]`)

  // Add event listeners
  Array.from(evtElements).forEach(element => {
    element
      .getAttribute(evtAttr)
      .trim()
      .split(/\s+/)
      .forEach(binding => {
        const [type, method] = binding.split(':')
        const handler = method ? controller[method] : controller

        element.addEventListener(type, handler)
      })

    if (removeEvt) {
      element.removeAttribute(evtAttr)
    }
  })

  // Add the references to the target object
  if (assignProp) {
    controller[assignProp] = controller[assignProp] || {}
  }

  return Array.from(refElements).reduce((carry, element) => {
    const [, propName, asArray] = element
      .getAttribute(refAttr)
      .trim()
      .match(/(.*?)(\[\])?$/)

    if (removeRef) {
      element.removeAttribute(refAttr)
    }

    if (asArray) {
      carry[propName] = carry[propName] || []
      carry[propName].push(element)
    } else {
      carry[propName] = element
    }

    return carry
  }, assign === false
    ? {}
    : assignProp
      ? controller[assignProp]
      : controller
  )
}
