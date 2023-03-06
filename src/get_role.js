const rNone = /^\s*(none|presentation)\s?/i;

function hasInheritedNone(node) {
  if (node.matches('li')) {
    return rNone.test(node.parentElement?.getAttribute('role') || '');
  }
  if (node.matches('tr,td,th,thead,tfoot,tbody')) {
    let cursor = node.parentElement;
    while (cursor?.matches('tr,table,thead,tbody,tfoot')) {
      if (rNone.test(node.parentElement?.getAttribute('role') || '')) {
        return true;
      }
      cursor = cursor.parentElement;
    }
  }
  return false;
}

export function getRole(node) {
  // Just use the first role if is a space separated list
  const role = node.getAttribute('role')?.trim()?.split(/\s+/)?.[0]?.toLowerCase();
  if (role) {
    return role;
  }
  if (hasInheritedNone(node)) {
    return 'none';
  }
  return null;
}
