import { getStyle } from './get_style.js';
import { mapElementToRole } from './map_element_to_role.js';

const types = NodeFilter.SHOW_ELEMENT + NodeFilter.SHOW_TEXT;

const nodeFilter = {
  acceptNode(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      return NodeFilter.FILTER_ACCEPT;
    }
    const { display, visibility } = getStyle(node);
    if (visibility !== 'visible') {
      return NodeFilter.FILTER_SKIP;
    }
    if (display === 'none' || node.getAttribute('aria-hidden') === 'true') {
      return NodeFilter.FILTER_REJECT;
    }
    return NodeFilter.FILTER_ACCEPT;
  },
};

function* walk(walker) {
  do {
    const { currentNode: node } = walker;

    if (node instanceof Text) {
      const { visibility } = getStyle(node.parentElement);
      if (visibility === 'visible') {
        yield node.cloneNode();
      }
      continue;
    }

    // Keep captions - hast-util-to-mdast is currently discarding them
    if (node.matches('table') && node.caption) {
      yield* walkNode(node.caption); // eslint-disable-line no-use-before-define
    }
    if (node.matches('caption') && node !== walker.root) {
      continue;
    }

    const cloned = mapElementToRole(node);
    yield cloned;

    if (!cloned.matches('hr,img') && walker.firstChild()) {
      cloned.append(...walk(walker));
      walker.parentNode();
    }
  } while (walker.nextSibling());
}

function* walkNode(element) {
  const walker = document.createTreeWalker(element, types, nodeFilter);
  if (walker.currentNode) {
    yield* walk(walker);
  }
}

export function buildDom(element) {
  const fragment = element.ownerDocument.createDocumentFragment();
  const walker = document.createTreeWalker(element, types, nodeFilter);
  if (walker.currentNode) {
    fragment.append(...walkNode(element));
  }
  return fragment;
}
