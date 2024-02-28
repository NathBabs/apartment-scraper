export const safeAccess = (
  element: any,
  ...properties: any[]
): Element | null => {
  let currentElement = element;
  for (const property of properties) {
    if (currentElement && currentElement[property]) {
      currentElement = currentElement[property];
    } else {
      return null; // Property doesn't exist, return null
    }
  }
  return currentElement;
};
