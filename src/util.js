const fromAnyElement = elementId => {
  const template = document.getElementById(elementId)

  if (template instanceof HTMLTemplateElement) {
    return template.content
  }

  return document.importNode(template, true)
}

export const fromTemplate = html => {
  const elementId = html[0] === '#' && html.slice(1)

  if (elementId) {
    return fromAnyElement(elementId)
  }

  const template = document.createElement('template')
  template.innerHTML = html
  return template.content
}
