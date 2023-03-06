export function getStyle(node) {
  return node.ownerDocument.defaultView.getComputedStyle(node);
}
