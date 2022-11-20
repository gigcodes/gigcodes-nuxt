export const formatValue = (value: any) => {
  if (
    value &&
    typeof value === 'object' && !value.isArray() && value.thumbnail
  ) {
    let html = `<span class="img"><img src="${value.thumbnail}" alt="${value.value}" />`
    if (value.value) {
      html += `<span>${value.value}</span>`
    }
    html += '</span>'
    return html
  }

  function htmlEntities (str: string) {
    if (!str) {
      return ''
    }
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
  }

  return Array.isArray(value)
    ? value.map(v => htmlEntities(v)).join(', ')
    : htmlEntities(value)
}

export const tableColWidth = (width: string | number) => {
  if (!width || width === 100) {
    return
  }
  if (typeof width === 'string' && width.endsWith('px')) {
    return width
  }
  return `${width}%`
}
