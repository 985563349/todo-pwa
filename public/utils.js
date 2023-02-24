const appendChild = (el, child) => {
  if (child.nodeType === 1) {
    el.appendChild(child);
  } else {
    el.innerHTML = child;
  }
  return el;
};

function createElement(tagName, attributes, ...children) {
  const el = document.createElement(tagName);
  if (attributes) {
    Object.entries(attributes).forEach(([attr, value]) => el.setAttribute(attr, value));
  }
  children.forEach((child) => appendChild(el, child));
  return el;
}
