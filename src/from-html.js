/**
 * Get element references from a HTML string
 *
 * @param {string} html - HTML string or ID selector
 * @param {object?} options - optional options object
 * @returns {object} - references as specified in the HTML
 */
export default function fromHTML (html, {
  refAttribute: attr = 'ref',
  removeRefAttribute: remove = true
} = {}) {
  let container = null;
  let elementId = null;

  if(html instanceof window.Element) {
    container = html;
  } else {
    container = document.createElement('div')
    elementId = html[0] === '#' && html.slice(1)

    container.innerHTML = elementId
        ? document.getElementById(elementId).innerHTML
        : html
  }

  const refs = container.querySelectorAll(`[${attr}]`)

  return Array.from(refs).reduce((carry, current) => {
    const attrValue = current.getAttribute(attr)
    const asArray = /\[\]$/.test(attrValue)
    const propName = asArray ? attrValue.slice(0, -2) : attrValue

    if (remove) {
      current.removeAttribute(attr)
    }

    if (asArray) {
      carry[propName] = carry[propName] || []
      carry[propName].push(current)
    } else {
      carry[propName] = current
    }

    return carry
  }, {})
}
