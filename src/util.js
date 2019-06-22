const fromElementId = elementId => {
  const element = document.getElementById(elementId)

  return element instanceof HTMLTemplateElement
    ? element.content
    : document.importNode(element, true)
}

const fromString = html => Object.assign(
  document.createElement('template'),
  { innerHTML: html }
).content

export const fromTemplate = html => html[0] === '#'
  ? fromElementId(html.slice(1))
  : fromString(html)
