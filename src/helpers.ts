function capitalize(s: string) {
  return s.replace(/\b\w/g, (l) => l.toUpperCase());
}

function toSearchString(s: string) {
  return s.trim().replace(/ /g, '+');
}

function regEx(s: string) {
  return new RegExp(s, 'i');
}

export { capitalize, toSearchString, regEx };
