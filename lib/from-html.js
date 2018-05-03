export default function fromHTML (html, {
  refAttribute: attr = 'ref',
  removeRefAttribute: remove = true
} = {}) {
  const container = document.createElement('div')

  container.innerHTML = html

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
