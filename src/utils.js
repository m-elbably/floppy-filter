function isObject(value) {
  const type = typeof value;
  return value != null && (type === 'object');
}

function flatObject(obj) {
  const delimiter = '.';
  const result = {};

  function process(object, path) {
    Object.keys(object).forEach((key) => {
      const value = object[key];
      const nPath = path ? path + delimiter + key : key;

      if (isObject(value) && Object.keys(value).length) {
        return process(value, nPath);
      }

      result[nPath] = value;
    });
  }

  process(obj);
  return result;
}

module.exports = {
  flatObject
};
