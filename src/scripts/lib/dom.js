export const query = (selector, target = document) =>
  target.querySelector(selector);

export const queryAll = (selector, target = document) =>
  target.querySelectorAll(selector);
