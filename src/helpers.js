function capitalize(string) {
  return string.replace(/\b\w/g, l => l.toUpperCase());
}

function toSearchString(string) {
  return string.trim().replace(/ /g, '+');
}

function regEx(string) {
  return new RegExp(string, 'i');
}

export { capitalize, toSearchString, regEx };
