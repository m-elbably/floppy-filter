const _set = require('lodash/set');
const _get = require('lodash/get');
const { flatObject } = require('./utils');

const REGEXP_SPECIAL_CHARS = /[-/\\^$+?.()|[\]{}]/g;
const REGEXP_ANY = /\.?\*+\.?/g;
const REGEXP_STARS = /\*+/;
const REGEXP_DOT = /\./g;

function detectRegexpPattern(match, index, string) {
  const quantifier = (string[0] === '*' || match[0] === '.') && match[match.length - 1] === '.'
    ? '+'
    : '*';

  const matcher = match.indexOf('**') === -1 ? '[^.]' : '.';
  const pattern = match.replace(REGEXP_DOT, '\\$&')
    .replace(REGEXP_STARS, matcher + quantifier);

  return index + match.length === string.length ? `(?:${pattern})?` : pattern;
}

function escapeRegexp(match, index, string) {
  if (match === '.' && (string[index - 1] === '*' || string[index + 1] === '*')) {
    return match;
  }

  return `\\${match}`;
}

function matchKey(string, pattern) {
  const regexPattern = pattern
    .replace(REGEXP_SPECIAL_CHARS, escapeRegexp)
    .replace(REGEXP_ANY, detectRegexpPattern);

  const regExp = new RegExp(`^${regexPattern}$`);
  return regExp.test(string);
}

function filterObject(object, fields) {
  if (object == null || typeof object !== 'object') {
    return object;
  }

  const allAllowed = (fields[0] === '*');
  const firstFieldIndex = (allAllowed ? 1 : 0);
  const flatProps = flatObject(object);
  const result = {};

  Object.keys(flatProps).forEach((k) => {
    let lNegated = false;
    let lMatchedIdx = -1;

    if (k == null) {
      return;
    }

    for (let i = firstFieldIndex; i < fields.length; i += 1) {
      const isNegated = fields[i].startsWith('!');
      const fieldPattern = !isNegated ? fields[i] : fields[i].substr(1);
      const matched = matchKey(k, fieldPattern);

      if (matched) {
        lNegated = isNegated;
        lMatchedIdx = i;
      }
    }

    if (lMatchedIdx >= 0 && lNegated) {
      return;
    }

    if (allAllowed || lMatchedIdx >= 0) {
      _set(result, k, _get(object, k));
    }
  });

  return result;
}

function filterObjects(objects, fields) {
  if (objects == null || !Array.isArray(objects)) {
    return objects;
  }

  return objects.map((object) => filterObject(object, fields));
}

function filterAll(source, fields) {
  if (Array.isArray(source)) {
    return filterObjects(source, fields);
  }

  return filterObject(source, fields);
}

module.exports = {
  filterObject,
  filterObjects,
  filterAll
};
