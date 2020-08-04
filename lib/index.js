(function(e, a) { for(var i in a) e[i] = a[i]; }(exports, /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

var _set = __webpack_require__(1);

var _get = __webpack_require__(2);

var _require = __webpack_require__(3),
    flatObject = _require.flatObject;

var REGEXP_SPECIAL_CHARS = /[-/\\^$+?.()|[\]{}]/g;
var REGEXP_ANY = /\.?\*+\.?/g;
var REGEXP_STARS = /\*+/;
var REGEXP_DOT = /\./g;

function detectRegexpPattern(match, index, string) {
  var quantifier = (string[0] === '*' || match[0] === '.') && match[match.length - 1] === '.' ? '+' : '*';
  var matcher = match.indexOf('**') === -1 ? '[^.]' : '.';
  var pattern = match.replace(REGEXP_DOT, '\\$&').replace(REGEXP_STARS, matcher + quantifier);
  return index + match.length === string.length ? "(?:".concat(pattern, ")?") : pattern;
}

function escapeRegexp(match, index, string) {
  if (match === '.' && (string[index - 1] === '*' || string[index + 1] === '*')) {
    return match;
  }

  return "\\".concat(match);
}

function matchKey(string, pattern) {
  var regexPattern = pattern.replace(REGEXP_SPECIAL_CHARS, escapeRegexp).replace(REGEXP_ANY, detectRegexpPattern);
  var regExp = new RegExp("^".concat(regexPattern, "$"));
  return regExp.test(string);
}

function filterObject(object, fields) {
  if (object == null) {
    return object;
  }

  var allAllowed = fields[0] === '*';
  var firstFieldIndex = allAllowed ? 1 : 0;
  var flatProps = flatObject(object);
  var result = {};
  Object.keys(flatProps).forEach(function (k) {
    var isNegated = false;
    var matched = false;

    if (k == null) {
      return;
    }

    for (var i = firstFieldIndex; i < fields.length; i += 1) {
      isNegated = fields[i].startsWith('!');
      var fieldPattern = !isNegated ? fields[i] : fields[i].substr(1);
      matched = matchKey(k, fieldPattern);

      if (matched) {
        break;
      }
    }

    if (matched && isNegated) {
      return;
    }

    if (allAllowed || matched) {
      _set(result, k, _get(object, k));
    }
  });
  return result;
}

function filterObjects(objects, fields) {
  if (objects == null || !Array.isArray(objects)) {
    return objects;
  }

  return objects.map(function (object) {
    return filterObject(object, fields);
  });
}

module.exports = {
  filterObject: filterObject,
  filterObjects: filterObjects
};

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("lodash/set");

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("lodash/get");

/***/ }),
/* 3 */
/***/ (function(module, exports) {

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function isObject(value) {
  var type = _typeof(value);

  return value != null && type === 'object';
}

function flatObject(obj) {
  var delimiter = '.';
  var result = {};

  function process(object, path) {
    Object.keys(object).forEach(function (key) {
      var value = object[key];
      var nPath = path ? path + delimiter + key : key;

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
  flatObject: flatObject
};

/***/ })
/******/ ])));