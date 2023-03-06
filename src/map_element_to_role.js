import { getStyle } from './get_style.js';
import { getRole } from './get_role.js';

// Roles to their native elements
// Some of these are aria 1.3 mappings
const roles = {
  link: ['a', 'area', 'link'],
  blockquote: ['blockquote'],
  code: ['code'],
  deletion: ['del'],
  emphasis: ['em', 'i'],
  heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
  separator: ['hr'],
  image: ['img'],
  listitem: ['li', 'dt', 'dd'],
  list: ['ol', 'ul', 'dl'],
  paragraph: ['p'],
  strong: ['strong', 'b'],
  subscript: ['sub'],
  superscript: ['sup'],
  table: ['table'],
  grid: ['table'],
  treegrid: ['table'],
  rowgroup: ['tbody', 'thead', 'tfoot'],
  cell: ['td'],
  gridcell: ['td'],
  columnheader: ['th'],
  row: ['tr'],
};

function replaceElement(element, tagName) {
  const replacement = element.ownerDocument.createElement(tagName);
  const style = element.getAttribute('style');
  if (style) {
    replacement.setAttribute('style', style);
  }
  if (tagName === 'img') {
    replacement.alt = element.textContent;
  }
  return replacement;
}

export function mapElementToRole(element) {
  const role = getRole(element);

  if (['none', 'presentation'].includes(role)) {
    const inline = getStyle(element).display.includes('inline');
    if (inline) {
      return replaceElement(element, 'span');
    }
    return replaceElement(element, 'div');
  }

  if (role === 'heading' || (element.matches('h1,h2,h3,h4,h5,h6') && element.hasAttribute('aria-level'))) {
    const level = element.getAttribute('aria-level') || '2';
    if (element.tagName.toLowerCase() !== `h${level}`) {
      return replaceElement(element, `h${level}`);
    }
  }

  if (!roles[role] || roles[role].includes(element.tagName.toLowerCase())) {
    return element.cloneNode(false);
  }

  return replaceElement(element, roles[role][0]);
}
