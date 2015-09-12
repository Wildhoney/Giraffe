(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],3:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = setTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    clearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        setTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],4:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],5:[function(require,module,exports){
(function (process,global){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./support/isBuffer":4,"_process":3,"inherits":2}],6:[function(require,module,exports){
'use strict';


var yaml = require('./lib/js-yaml.js');


module.exports = yaml;

},{"./lib/js-yaml.js":7}],7:[function(require,module,exports){
'use strict';


var loader = require('./js-yaml/loader');
var dumper = require('./js-yaml/dumper');


function deprecated(name) {
  return function () {
    throw new Error('Function ' + name + ' is deprecated and cannot be used.');
  };
}


module.exports.Type                = require('./js-yaml/type');
module.exports.Schema              = require('./js-yaml/schema');
module.exports.FAILSAFE_SCHEMA     = require('./js-yaml/schema/failsafe');
module.exports.JSON_SCHEMA         = require('./js-yaml/schema/json');
module.exports.CORE_SCHEMA         = require('./js-yaml/schema/core');
module.exports.DEFAULT_SAFE_SCHEMA = require('./js-yaml/schema/default_safe');
module.exports.DEFAULT_FULL_SCHEMA = require('./js-yaml/schema/default_full');
module.exports.load                = loader.load;
module.exports.loadAll             = loader.loadAll;
module.exports.safeLoad            = loader.safeLoad;
module.exports.safeLoadAll         = loader.safeLoadAll;
module.exports.dump                = dumper.dump;
module.exports.safeDump            = dumper.safeDump;
module.exports.YAMLException       = require('./js-yaml/exception');

// Deprecated schema names from JS-YAML 2.0.x
module.exports.MINIMAL_SCHEMA = require('./js-yaml/schema/failsafe');
module.exports.SAFE_SCHEMA    = require('./js-yaml/schema/default_safe');
module.exports.DEFAULT_SCHEMA = require('./js-yaml/schema/default_full');

// Deprecated functions from JS-YAML 1.x.x
module.exports.scan           = deprecated('scan');
module.exports.parse          = deprecated('parse');
module.exports.compose        = deprecated('compose');
module.exports.addConstructor = deprecated('addConstructor');

},{"./js-yaml/dumper":9,"./js-yaml/exception":10,"./js-yaml/loader":11,"./js-yaml/schema":13,"./js-yaml/schema/core":14,"./js-yaml/schema/default_full":15,"./js-yaml/schema/default_safe":16,"./js-yaml/schema/failsafe":17,"./js-yaml/schema/json":18,"./js-yaml/type":19}],8:[function(require,module,exports){
'use strict';


function isNothing(subject) {
  return (typeof subject === 'undefined') || (null === subject);
}


function isObject(subject) {
  return (typeof subject === 'object') && (null !== subject);
}


function toArray(sequence) {
  if (Array.isArray(sequence)) {
    return sequence;
  } else if (isNothing(sequence)) {
    return [];
  }
  return [ sequence ];
}


function extend(target, source) {
  var index, length, key, sourceKeys;

  if (source) {
    sourceKeys = Object.keys(source);

    for (index = 0, length = sourceKeys.length; index < length; index += 1) {
      key = sourceKeys[index];
      target[key] = source[key];
    }
  }

  return target;
}


function repeat(string, count) {
  var result = '', cycle;

  for (cycle = 0; cycle < count; cycle += 1) {
    result += string;
  }

  return result;
}


function isNegativeZero(number) {
  return (0 === number) && (Number.NEGATIVE_INFINITY === 1 / number);
}


module.exports.isNothing      = isNothing;
module.exports.isObject       = isObject;
module.exports.toArray        = toArray;
module.exports.repeat         = repeat;
module.exports.isNegativeZero = isNegativeZero;
module.exports.extend         = extend;

},{}],9:[function(require,module,exports){
'use strict';

/*eslint-disable no-use-before-define*/

var common              = require('./common');
var YAMLException       = require('./exception');
var DEFAULT_FULL_SCHEMA = require('./schema/default_full');
var DEFAULT_SAFE_SCHEMA = require('./schema/default_safe');

var _toString       = Object.prototype.toString;
var _hasOwnProperty = Object.prototype.hasOwnProperty;

var CHAR_TAB                  = 0x09; /* Tab */
var CHAR_LINE_FEED            = 0x0A; /* LF */
var CHAR_CARRIAGE_RETURN      = 0x0D; /* CR */
var CHAR_SPACE                = 0x20; /* Space */
var CHAR_EXCLAMATION          = 0x21; /* ! */
var CHAR_DOUBLE_QUOTE         = 0x22; /* " */
var CHAR_SHARP                = 0x23; /* # */
var CHAR_PERCENT              = 0x25; /* % */
var CHAR_AMPERSAND            = 0x26; /* & */
var CHAR_SINGLE_QUOTE         = 0x27; /* ' */
var CHAR_ASTERISK             = 0x2A; /* * */
var CHAR_COMMA                = 0x2C; /* , */
var CHAR_MINUS                = 0x2D; /* - */
var CHAR_COLON                = 0x3A; /* : */
var CHAR_GREATER_THAN         = 0x3E; /* > */
var CHAR_QUESTION             = 0x3F; /* ? */
var CHAR_COMMERCIAL_AT        = 0x40; /* @ */
var CHAR_LEFT_SQUARE_BRACKET  = 0x5B; /* [ */
var CHAR_RIGHT_SQUARE_BRACKET = 0x5D; /* ] */
var CHAR_GRAVE_ACCENT         = 0x60; /* ` */
var CHAR_LEFT_CURLY_BRACKET   = 0x7B; /* { */
var CHAR_VERTICAL_LINE        = 0x7C; /* | */
var CHAR_RIGHT_CURLY_BRACKET  = 0x7D; /* } */

var ESCAPE_SEQUENCES = {};

ESCAPE_SEQUENCES[0x00]   = '\\0';
ESCAPE_SEQUENCES[0x07]   = '\\a';
ESCAPE_SEQUENCES[0x08]   = '\\b';
ESCAPE_SEQUENCES[0x09]   = '\\t';
ESCAPE_SEQUENCES[0x0A]   = '\\n';
ESCAPE_SEQUENCES[0x0B]   = '\\v';
ESCAPE_SEQUENCES[0x0C]   = '\\f';
ESCAPE_SEQUENCES[0x0D]   = '\\r';
ESCAPE_SEQUENCES[0x1B]   = '\\e';
ESCAPE_SEQUENCES[0x22]   = '\\"';
ESCAPE_SEQUENCES[0x5C]   = '\\\\';
ESCAPE_SEQUENCES[0x85]   = '\\N';
ESCAPE_SEQUENCES[0xA0]   = '\\_';
ESCAPE_SEQUENCES[0x2028] = '\\L';
ESCAPE_SEQUENCES[0x2029] = '\\P';

var DEPRECATED_BOOLEANS_SYNTAX = [
  'y', 'Y', 'yes', 'Yes', 'YES', 'on', 'On', 'ON',
  'n', 'N', 'no', 'No', 'NO', 'off', 'Off', 'OFF'
];

function compileStyleMap(schema, map) {
  var result, keys, index, length, tag, style, type;

  if (null === map) {
    return {};
  }

  result = {};
  keys = Object.keys(map);

  for (index = 0, length = keys.length; index < length; index += 1) {
    tag = keys[index];
    style = String(map[tag]);

    if ('!!' === tag.slice(0, 2)) {
      tag = 'tag:yaml.org,2002:' + tag.slice(2);
    }

    type = schema.compiledTypeMap[tag];

    if (type && _hasOwnProperty.call(type.styleAliases, style)) {
      style = type.styleAliases[style];
    }

    result[tag] = style;
  }

  return result;
}

function encodeHex(character) {
  var string, handle, length;

  string = character.toString(16).toUpperCase();

  if (character <= 0xFF) {
    handle = 'x';
    length = 2;
  } else if (character <= 0xFFFF) {
    handle = 'u';
    length = 4;
  } else if (character <= 0xFFFFFFFF) {
    handle = 'U';
    length = 8;
  } else {
    throw new YAMLException('code point within a string may not be greater than 0xFFFFFFFF');
  }

  return '\\' + handle + common.repeat('0', length - string.length) + string;
}

function State(options) {
  this.schema      = options['schema'] || DEFAULT_FULL_SCHEMA;
  this.indent      = Math.max(1, (options['indent'] || 2));
  this.skipInvalid = options['skipInvalid'] || false;
  this.flowLevel   = (common.isNothing(options['flowLevel']) ? -1 : options['flowLevel']);
  this.styleMap    = compileStyleMap(this.schema, options['styles'] || null);
  this.sortKeys    = options['sortKeys'] || false;

  this.implicitTypes = this.schema.compiledImplicit;
  this.explicitTypes = this.schema.compiledExplicit;

  this.tag = null;
  this.result = '';

  this.duplicates = [];
  this.usedDuplicates = null;
}

function indentString(string, spaces) {
  var ind = common.repeat(' ', spaces),
      position = 0,
      next = -1,
      result = '',
      line,
      length = string.length;

  while (position < length) {
    next = string.indexOf('\n', position);
    if (next === -1) {
      line = string.slice(position);
      position = length;
    } else {
      line = string.slice(position, next + 1);
      position = next + 1;
    }
    if (line.length && line !== '\n') {
      result += ind;
    }
    result += line;
  }

  return result;
}

function generateNextLine(state, level) {
  return '\n' + common.repeat(' ', state.indent * level);
}

function testImplicitResolving(state, str) {
  var index, length, type;

  for (index = 0, length = state.implicitTypes.length; index < length; index += 1) {
    type = state.implicitTypes[index];

    if (type.resolve(str)) {
      return true;
    }
  }

  return false;
}

function StringBuilder(source) {
  this.source = source;
  this.result = '';
  this.checkpoint = 0;
}

StringBuilder.prototype.takeUpTo = function (position) {
  var er;

  if (position < this.checkpoint) {
    er = new Error('position should be > checkpoint');
    er.position = position;
    er.checkpoint = this.checkpoint;
    throw er;
  }

  this.result += this.source.slice(this.checkpoint, position);
  this.checkpoint = position;
  return this;
};

StringBuilder.prototype.escapeChar = function () {
  var character, esc;

  character = this.source.charCodeAt(this.checkpoint);
  esc = ESCAPE_SEQUENCES[character] || encodeHex(character);
  this.result += esc;
  this.checkpoint += 1;

  return this;
};

StringBuilder.prototype.finish = function () {
  if (this.source.length > this.checkpoint) {
    this.takeUpTo(this.source.length);
  }
};

function writeScalar(state, object, level, iskey) {
  var simple, first, spaceWrap, folded, literal, single, double,
      sawLineFeed, linePosition, longestLine, indent, max, character,
      position, escapeSeq, hexEsc, previous, lineLength, modifier,
      trailingLineBreaks, result;

  if (0 === object.length) {
    state.dump = "''";
    return;
  }

  if (-1 !== DEPRECATED_BOOLEANS_SYNTAX.indexOf(object)) {
    state.dump = "'" + object + "'";
    return;
  }

  simple = true;
  first = object.length ? object.charCodeAt(0) : 0;
  spaceWrap = (CHAR_SPACE === first ||
               CHAR_SPACE === object.charCodeAt(object.length - 1));

  // Simplified check for restricted first characters
  // http://www.yaml.org/spec/1.2/spec.html#ns-plain-first%28c%29
  if (CHAR_MINUS         === first ||
      CHAR_QUESTION      === first ||
      CHAR_COMMERCIAL_AT === first ||
      CHAR_GRAVE_ACCENT  === first) {
    simple = false;
  }

  // can only use > and | if not wrapped in spaces or is not a key.
  if (spaceWrap) {
    simple = false;
    folded = false;
    literal = false;
  } else {
    folded = !iskey;
    literal = !iskey;
  }

  single = true;
  double = new StringBuilder(object);

  sawLineFeed = false;
  linePosition = 0;
  longestLine = 0;

  indent = state.indent * level;
  max = 80;
  if (indent < 40) {
    max -= indent;
  } else {
    max = 40;
  }

  for (position = 0; position < object.length; position++) {
    character = object.charCodeAt(position);
    if (simple) {
      // Characters that can never appear in the simple scalar
      if (!simpleChar(character)) {
        simple = false;
      } else {
        // Still simple.  If we make it all the way through like
        // this, then we can just dump the string as-is.
        continue;
      }
    }

    if (single && character === CHAR_SINGLE_QUOTE) {
      single = false;
    }

    escapeSeq = ESCAPE_SEQUENCES[character];
    hexEsc = needsHexEscape(character);

    if (!escapeSeq && !hexEsc) {
      continue;
    }

    if (character !== CHAR_LINE_FEED &&
        character !== CHAR_DOUBLE_QUOTE &&
        character !== CHAR_SINGLE_QUOTE) {
      folded = false;
      literal = false;
    } else if (character === CHAR_LINE_FEED) {
      sawLineFeed = true;
      single = false;
      if (position > 0) {
        previous = object.charCodeAt(position - 1);
        if (previous === CHAR_SPACE) {
          literal = false;
          folded = false;
        }
      }
      if (folded) {
        lineLength = position - linePosition;
        linePosition = position;
        if (lineLength > longestLine) {
          longestLine = lineLength;
        }
      }
    }

    if (character !== CHAR_DOUBLE_QUOTE) {
      single = false;
    }

    double.takeUpTo(position);
    double.escapeChar();
  }

  if (simple && testImplicitResolving(state, object)) {
    simple = false;
  }

  modifier = '';
  if (folded || literal) {
    trailingLineBreaks = 0;
    if (object.charCodeAt(object.length - 1) === CHAR_LINE_FEED) {
      trailingLineBreaks += 1;
      if (object.charCodeAt(object.length - 2) === CHAR_LINE_FEED) {
        trailingLineBreaks += 1;
      }
    }

    if (trailingLineBreaks === 0) {
      modifier = '-';
    } else if (trailingLineBreaks === 2) {
      modifier = '+';
    }
  }

  if (literal && longestLine < max) {
    folded = false;
  }

  // If it's literally one line, then don't bother with the literal.
  // We may still want to do a fold, though, if it's a super long line.
  if (!sawLineFeed) {
    literal = false;
  }

  if (simple) {
    state.dump = object;
  } else if (single) {
    state.dump = '\'' + object + '\'';
  } else if (folded) {
    result = fold(object, max);
    state.dump = '>' + modifier + '\n' + indentString(result, indent);
  } else if (literal) {
    if (!modifier) {
      object = object.replace(/\n$/, '');
    }
    state.dump = '|' + modifier + '\n' + indentString(object, indent);
  } else if (double) {
    double.finish();
    state.dump = '"' + double.result + '"';
  } else {
    throw new Error('Failed to dump scalar value');
  }

  return;
}

// The `trailing` var is a regexp match of any trailing `\n` characters.
//
// There are three cases we care about:
//
// 1. One trailing `\n` on the string.  Just use `|` or `>`.
//    This is the assumed default. (trailing = null)
// 2. No trailing `\n` on the string.  Use `|-` or `>-` to "chomp" the end.
// 3. More than one trailing `\n` on the string.  Use `|+` or `>+`.
//
// In the case of `>+`, these line breaks are *not* doubled (like the line
// breaks within the string), so it's important to only end with the exact
// same number as we started.
function fold(object, max) {
  var result = '',
      position = 0,
      length = object.length,
      trailing = /\n+$/.exec(object),
      newLine;

  if (trailing) {
    length = trailing.index + 1;
  }

  while (position < length) {
    newLine = object.indexOf('\n', position);
    if (newLine > length || newLine === -1) {
      if (result) {
        result += '\n\n';
      }
      result += foldLine(object.slice(position, length), max);
      position = length;
    } else {
      if (result) {
        result += '\n\n';
      }
      result += foldLine(object.slice(position, newLine), max);
      position = newLine + 1;
    }
  }
  if (trailing && trailing[0] !== '\n') {
    result += trailing[0];
  }

  return result;
}

function foldLine(line, max) {
  if (line === '') {
    return line;
  }

  var foldRe = /[^\s] [^\s]/g,
      result = '',
      prevMatch = 0,
      foldStart = 0,
      match = foldRe.exec(line),
      index,
      foldEnd,
      folded;

  while (match) {
    index = match.index;

    // when we cross the max len, if the previous match would've
    // been ok, use that one, and carry on.  If there was no previous
    // match on this fold section, then just have a long line.
    if (index - foldStart > max) {
      if (prevMatch !== foldStart) {
        foldEnd = prevMatch;
      } else {
        foldEnd = index;
      }

      if (result) {
        result += '\n';
      }
      folded = line.slice(foldStart, foldEnd);
      result += folded;
      foldStart = foldEnd + 1;
    }
    prevMatch = index + 1;
    match = foldRe.exec(line);
  }

  if (result) {
    result += '\n';
  }

  // if we end up with one last word at the end, then the last bit might
  // be slightly bigger than we wanted, because we exited out of the loop.
  if (foldStart !== prevMatch && line.length - foldStart > max) {
    result += line.slice(foldStart, prevMatch) + '\n' +
              line.slice(prevMatch + 1);
  } else {
    result += line.slice(foldStart);
  }

  return result;
}

// Returns true if character can be found in a simple scalar
function simpleChar(character) {
  return CHAR_TAB                  !== character &&
         CHAR_LINE_FEED            !== character &&
         CHAR_CARRIAGE_RETURN      !== character &&
         CHAR_COMMA                !== character &&
         CHAR_LEFT_SQUARE_BRACKET  !== character &&
         CHAR_RIGHT_SQUARE_BRACKET !== character &&
         CHAR_LEFT_CURLY_BRACKET   !== character &&
         CHAR_RIGHT_CURLY_BRACKET  !== character &&
         CHAR_SHARP                !== character &&
         CHAR_AMPERSAND            !== character &&
         CHAR_ASTERISK             !== character &&
         CHAR_EXCLAMATION          !== character &&
         CHAR_VERTICAL_LINE        !== character &&
         CHAR_GREATER_THAN         !== character &&
         CHAR_SINGLE_QUOTE         !== character &&
         CHAR_DOUBLE_QUOTE         !== character &&
         CHAR_PERCENT              !== character &&
         CHAR_COLON                !== character &&
         !ESCAPE_SEQUENCES[character]            &&
         !needsHexEscape(character);
}

// Returns true if the character code needs to be escaped.
function needsHexEscape(character) {
  return !((0x00020 <= character && character <= 0x00007E) ||
           (0x00085 === character)                         ||
           (0x000A0 <= character && character <= 0x00D7FF) ||
           (0x0E000 <= character && character <= 0x00FFFD) ||
           (0x10000 <= character && character <= 0x10FFFF));
}

function writeFlowSequence(state, level, object) {
  var _result = '',
      _tag    = state.tag,
      index,
      length;

  for (index = 0, length = object.length; index < length; index += 1) {
    // Write only valid elements.
    if (writeNode(state, level, object[index], false, false)) {
      if (0 !== index) {
        _result += ', ';
      }
      _result += state.dump;
    }
  }

  state.tag = _tag;
  state.dump = '[' + _result + ']';
}

function writeBlockSequence(state, level, object, compact) {
  var _result = '',
      _tag    = state.tag,
      index,
      length;

  for (index = 0, length = object.length; index < length; index += 1) {
    // Write only valid elements.
    if (writeNode(state, level + 1, object[index], true, true)) {
      if (!compact || 0 !== index) {
        _result += generateNextLine(state, level);
      }
      _result += '- ' + state.dump;
    }
  }

  state.tag = _tag;
  state.dump = _result || '[]'; // Empty sequence if no valid values.
}

function writeFlowMapping(state, level, object) {
  var _result       = '',
      _tag          = state.tag,
      objectKeyList = Object.keys(object),
      index,
      length,
      objectKey,
      objectValue,
      pairBuffer;

  for (index = 0, length = objectKeyList.length; index < length; index += 1) {
    pairBuffer = '';

    if (0 !== index) {
      pairBuffer += ', ';
    }

    objectKey = objectKeyList[index];
    objectValue = object[objectKey];

    if (!writeNode(state, level, objectKey, false, false)) {
      continue; // Skip this pair because of invalid key;
    }

    if (state.dump.length > 1024) {
      pairBuffer += '? ';
    }

    pairBuffer += state.dump + ': ';

    if (!writeNode(state, level, objectValue, false, false)) {
      continue; // Skip this pair because of invalid value.
    }

    pairBuffer += state.dump;

    // Both key and value are valid.
    _result += pairBuffer;
  }

  state.tag = _tag;
  state.dump = '{' + _result + '}';
}

function writeBlockMapping(state, level, object, compact) {
  var _result       = '',
      _tag          = state.tag,
      objectKeyList = Object.keys(object),
      index,
      length,
      objectKey,
      objectValue,
      explicitPair,
      pairBuffer;

  // Allow sorting keys so that the output file is deterministic
  if (state.sortKeys === true) {
    // Default sorting
    objectKeyList.sort();
  } else if (typeof state.sortKeys === 'function') {
    // Custom sort function
    objectKeyList.sort(state.sortKeys);
  } else if (state.sortKeys) {
    // Something is wrong
    throw new YAMLException('sortKeys must be a boolean or a function');
  }

  for (index = 0, length = objectKeyList.length; index < length; index += 1) {
    pairBuffer = '';

    if (!compact || 0 !== index) {
      pairBuffer += generateNextLine(state, level);
    }

    objectKey = objectKeyList[index];
    objectValue = object[objectKey];

    if (!writeNode(state, level + 1, objectKey, true, true, true)) {
      continue; // Skip this pair because of invalid key.
    }

    explicitPair = (null !== state.tag && '?' !== state.tag) ||
                   (state.dump && state.dump.length > 1024);

    if (explicitPair) {
      if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
        pairBuffer += '?';
      } else {
        pairBuffer += '? ';
      }
    }

    pairBuffer += state.dump;

    if (explicitPair) {
      pairBuffer += generateNextLine(state, level);
    }

    if (!writeNode(state, level + 1, objectValue, true, explicitPair)) {
      continue; // Skip this pair because of invalid value.
    }

    if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
      pairBuffer += ':';
    } else {
      pairBuffer += ': ';
    }

    pairBuffer += state.dump;

    // Both key and value are valid.
    _result += pairBuffer;
  }

  state.tag = _tag;
  state.dump = _result || '{}'; // Empty mapping if no valid pairs.
}

function detectType(state, object, explicit) {
  var _result, typeList, index, length, type, style;

  typeList = explicit ? state.explicitTypes : state.implicitTypes;

  for (index = 0, length = typeList.length; index < length; index += 1) {
    type = typeList[index];

    if ((type.instanceOf  || type.predicate) &&
        (!type.instanceOf || (('object' === typeof object) && (object instanceof type.instanceOf))) &&
        (!type.predicate  || type.predicate(object))) {

      state.tag = explicit ? type.tag : '?';

      if (type.represent) {
        style = state.styleMap[type.tag] || type.defaultStyle;

        if ('[object Function]' === _toString.call(type.represent)) {
          _result = type.represent(object, style);
        } else if (_hasOwnProperty.call(type.represent, style)) {
          _result = type.represent[style](object, style);
        } else {
          throw new YAMLException('!<' + type.tag + '> tag resolver accepts not "' + style + '" style');
        }

        state.dump = _result;
      }

      return true;
    }
  }

  return false;
}

// Serializes `object` and writes it to global `result`.
// Returns true on success, or false on invalid object.
//
function writeNode(state, level, object, block, compact, iskey) {
  state.tag = null;
  state.dump = object;

  if (!detectType(state, object, false)) {
    detectType(state, object, true);
  }

  var type = _toString.call(state.dump);

  if (block) {
    block = (0 > state.flowLevel || state.flowLevel > level);
  }

  var objectOrArray = '[object Object]' === type || '[object Array]' === type,
      duplicateIndex,
      duplicate;

  if (objectOrArray) {
    duplicateIndex = state.duplicates.indexOf(object);
    duplicate = duplicateIndex !== -1;
  }

  if ((null !== state.tag && '?' !== state.tag) || duplicate || (2 !== state.indent && level > 0)) {
    compact = false;
  }

  if (duplicate && state.usedDuplicates[duplicateIndex]) {
    state.dump = '*ref_' + duplicateIndex;
  } else {
    if (objectOrArray && duplicate && !state.usedDuplicates[duplicateIndex]) {
      state.usedDuplicates[duplicateIndex] = true;
    }
    if ('[object Object]' === type) {
      if (block && (0 !== Object.keys(state.dump).length)) {
        writeBlockMapping(state, level, state.dump, compact);
        if (duplicate) {
          state.dump = '&ref_' + duplicateIndex + state.dump;
        }
      } else {
        writeFlowMapping(state, level, state.dump);
        if (duplicate) {
          state.dump = '&ref_' + duplicateIndex + ' ' + state.dump;
        }
      }
    } else if ('[object Array]' === type) {
      if (block && (0 !== state.dump.length)) {
        writeBlockSequence(state, level, state.dump, compact);
        if (duplicate) {
          state.dump = '&ref_' + duplicateIndex + state.dump;
        }
      } else {
        writeFlowSequence(state, level, state.dump);
        if (duplicate) {
          state.dump = '&ref_' + duplicateIndex + ' ' + state.dump;
        }
      }
    } else if ('[object String]' === type) {
      if ('?' !== state.tag) {
        writeScalar(state, state.dump, level, iskey);
      }
    } else {
      if (state.skipInvalid) {
        return false;
      }
      throw new YAMLException('unacceptable kind of an object to dump ' + type);
    }

    if (null !== state.tag && '?' !== state.tag) {
      state.dump = '!<' + state.tag + '> ' + state.dump;
    }
  }

  return true;
}

function getDuplicateReferences(object, state) {
  var objects = [],
      duplicatesIndexes = [],
      index,
      length;

  inspectNode(object, objects, duplicatesIndexes);

  for (index = 0, length = duplicatesIndexes.length; index < length; index += 1) {
    state.duplicates.push(objects[duplicatesIndexes[index]]);
  }
  state.usedDuplicates = new Array(length);
}

function inspectNode(object, objects, duplicatesIndexes) {
  var objectKeyList,
      index,
      length;

  if (null !== object && 'object' === typeof object) {
    index = objects.indexOf(object);
    if (-1 !== index) {
      if (-1 === duplicatesIndexes.indexOf(index)) {
        duplicatesIndexes.push(index);
      }
    } else {
      objects.push(object);

      if (Array.isArray(object)) {
        for (index = 0, length = object.length; index < length; index += 1) {
          inspectNode(object[index], objects, duplicatesIndexes);
        }
      } else {
        objectKeyList = Object.keys(object);

        for (index = 0, length = objectKeyList.length; index < length; index += 1) {
          inspectNode(object[objectKeyList[index]], objects, duplicatesIndexes);
        }
      }
    }
  }
}

function dump(input, options) {
  options = options || {};

  var state = new State(options);

  getDuplicateReferences(input, state);

  if (writeNode(state, 0, input, true, true)) {
    return state.dump + '\n';
  }
  return '';
}

function safeDump(input, options) {
  return dump(input, common.extend({ schema: DEFAULT_SAFE_SCHEMA }, options));
}

module.exports.dump     = dump;
module.exports.safeDump = safeDump;

},{"./common":8,"./exception":10,"./schema/default_full":15,"./schema/default_safe":16}],10:[function(require,module,exports){
// YAML error class. http://stackoverflow.com/questions/8458984
//
'use strict';


var inherits = require('util').inherits;


function YAMLException(reason, mark) {
  // Super constructor
  Error.call(this);

  // Include stack trace in error object
  if (Error.captureStackTrace) {
    // Chrome and NodeJS
    Error.captureStackTrace(this, this.constructor);
  } else {
    // FF, IE 10+ and Safari 6+. Fallback for others
    this.stack = (new Error()).stack || '';
  }

  this.name = 'YAMLException';
  this.reason = reason;
  this.mark = mark;
  this.message = (this.reason || '(unknown reason)') + (this.mark ? ' ' + this.mark.toString() : '');
}


// Inherit from Error
inherits(YAMLException, Error);


YAMLException.prototype.toString = function toString(compact) {
  var result = this.name + ': ';

  result += this.reason || '(unknown reason)';

  if (!compact && this.mark) {
    result += ' ' + this.mark.toString();
  }

  return result;
};


module.exports = YAMLException;

},{"util":5}],11:[function(require,module,exports){
'use strict';

/*eslint-disable max-len,no-use-before-define*/

var common              = require('./common');
var YAMLException       = require('./exception');
var Mark                = require('./mark');
var DEFAULT_SAFE_SCHEMA = require('./schema/default_safe');
var DEFAULT_FULL_SCHEMA = require('./schema/default_full');


var _hasOwnProperty = Object.prototype.hasOwnProperty;


var CONTEXT_FLOW_IN   = 1;
var CONTEXT_FLOW_OUT  = 2;
var CONTEXT_BLOCK_IN  = 3;
var CONTEXT_BLOCK_OUT = 4;


var CHOMPING_CLIP  = 1;
var CHOMPING_STRIP = 2;
var CHOMPING_KEEP  = 3;


var PATTERN_NON_PRINTABLE         = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
var PATTERN_NON_ASCII_LINE_BREAKS = /[\x85\u2028\u2029]/;
var PATTERN_FLOW_INDICATORS       = /[,\[\]\{\}]/;
var PATTERN_TAG_HANDLE            = /^(?:!|!!|![a-z\-]+!)$/i;
var PATTERN_TAG_URI               = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;


function is_EOL(c) {
  return (c === 0x0A/* LF */) || (c === 0x0D/* CR */);
}

function is_WHITE_SPACE(c) {
  return (c === 0x09/* Tab */) || (c === 0x20/* Space */);
}

function is_WS_OR_EOL(c) {
  return (c === 0x09/* Tab */) ||
         (c === 0x20/* Space */) ||
         (c === 0x0A/* LF */) ||
         (c === 0x0D/* CR */);
}

function is_FLOW_INDICATOR(c) {
  return 0x2C/* , */ === c ||
         0x5B/* [ */ === c ||
         0x5D/* ] */ === c ||
         0x7B/* { */ === c ||
         0x7D/* } */ === c;
}

function fromHexCode(c) {
  var lc;

  if ((0x30/* 0 */ <= c) && (c <= 0x39/* 9 */)) {
    return c - 0x30;
  }

  /*eslint-disable no-bitwise*/
  lc = c | 0x20;

  if ((0x61/* a */ <= lc) && (lc <= 0x66/* f */)) {
    return lc - 0x61 + 10;
  }

  return -1;
}

function escapedHexLen(c) {
  if (c === 0x78/* x */) { return 2; }
  if (c === 0x75/* u */) { return 4; }
  if (c === 0x55/* U */) { return 8; }
  return 0;
}

function fromDecimalCode(c) {
  if ((0x30/* 0 */ <= c) && (c <= 0x39/* 9 */)) {
    return c - 0x30;
  }

  return -1;
}

function simpleEscapeSequence(c) {
  return (c === 0x30/* 0 */) ? '\x00' :
        (c === 0x61/* a */) ? '\x07' :
        (c === 0x62/* b */) ? '\x08' :
        (c === 0x74/* t */) ? '\x09' :
        (c === 0x09/* Tab */) ? '\x09' :
        (c === 0x6E/* n */) ? '\x0A' :
        (c === 0x76/* v */) ? '\x0B' :
        (c === 0x66/* f */) ? '\x0C' :
        (c === 0x72/* r */) ? '\x0D' :
        (c === 0x65/* e */) ? '\x1B' :
        (c === 0x20/* Space */) ? ' ' :
        (c === 0x22/* " */) ? '\x22' :
        (c === 0x2F/* / */) ? '/' :
        (c === 0x5C/* \ */) ? '\x5C' :
        (c === 0x4E/* N */) ? '\x85' :
        (c === 0x5F/* _ */) ? '\xA0' :
        (c === 0x4C/* L */) ? '\u2028' :
        (c === 0x50/* P */) ? '\u2029' : '';
}

function charFromCodepoint(c) {
  if (c <= 0xFFFF) {
    return String.fromCharCode(c);
  }
  // Encode UTF-16 surrogate pair
  // https://en.wikipedia.org/wiki/UTF-16#Code_points_U.2B010000_to_U.2B10FFFF
  return String.fromCharCode(((c - 0x010000) >> 10) + 0xD800,
                             ((c - 0x010000) & 0x03FF) + 0xDC00);
}

var simpleEscapeCheck = new Array(256); // integer, for fast access
var simpleEscapeMap = new Array(256);
for (var i = 0; i < 256; i++) {
  simpleEscapeCheck[i] = simpleEscapeSequence(i) ? 1 : 0;
  simpleEscapeMap[i] = simpleEscapeSequence(i);
}


function State(input, options) {
  this.input = input;

  this.filename  = options['filename']  || null;
  this.schema    = options['schema']    || DEFAULT_FULL_SCHEMA;
  this.onWarning = options['onWarning'] || null;
  this.legacy    = options['legacy']    || false;

  this.implicitTypes = this.schema.compiledImplicit;
  this.typeMap       = this.schema.compiledTypeMap;

  this.length     = input.length;
  this.position   = 0;
  this.line       = 0;
  this.lineStart  = 0;
  this.lineIndent = 0;

  this.documents = [];

  /*
  this.version;
  this.checkLineBreaks;
  this.tagMap;
  this.anchorMap;
  this.tag;
  this.anchor;
  this.kind;
  this.result;*/

}


function generateError(state, message) {
  return new YAMLException(
    message,
    new Mark(state.filename, state.input, state.position, state.line, (state.position - state.lineStart)));
}

function throwError(state, message) {
  throw generateError(state, message);
}

function throwWarning(state, message) {
  if (state.onWarning) {
    state.onWarning.call(null, generateError(state, message));
  }
}


var directiveHandlers = {

  YAML: function handleYamlDirective(state, name, args) {

      var match, major, minor;

      if (null !== state.version) {
        throwError(state, 'duplication of %YAML directive');
      }

      if (1 !== args.length) {
        throwError(state, 'YAML directive accepts exactly one argument');
      }

      match = /^([0-9]+)\.([0-9]+)$/.exec(args[0]);

      if (null === match) {
        throwError(state, 'ill-formed argument of the YAML directive');
      }

      major = parseInt(match[1], 10);
      minor = parseInt(match[2], 10);

      if (1 !== major) {
        throwError(state, 'unacceptable YAML version of the document');
      }

      state.version = args[0];
      state.checkLineBreaks = (minor < 2);

      if (1 !== minor && 2 !== minor) {
        throwWarning(state, 'unsupported YAML version of the document');
      }
    },

  TAG: function handleTagDirective(state, name, args) {

      var handle, prefix;

      if (2 !== args.length) {
        throwError(state, 'TAG directive accepts exactly two arguments');
      }

      handle = args[0];
      prefix = args[1];

      if (!PATTERN_TAG_HANDLE.test(handle)) {
        throwError(state, 'ill-formed tag handle (first argument) of the TAG directive');
      }

      if (_hasOwnProperty.call(state.tagMap, handle)) {
        throwError(state, 'there is a previously declared suffix for "' + handle + '" tag handle');
      }

      if (!PATTERN_TAG_URI.test(prefix)) {
        throwError(state, 'ill-formed tag prefix (second argument) of the TAG directive');
      }

      state.tagMap[handle] = prefix;
    }
};


function captureSegment(state, start, end, checkJson) {
  var _position, _length, _character, _result;

  if (start < end) {
    _result = state.input.slice(start, end);

    if (checkJson) {
      for (_position = 0, _length = _result.length;
           _position < _length;
           _position += 1) {
        _character = _result.charCodeAt(_position);
        if (!(0x09 === _character ||
              0x20 <= _character && _character <= 0x10FFFF)) {
          throwError(state, 'expected valid JSON character');
        }
      }
    }

    state.result += _result;
  }
}

function mergeMappings(state, destination, source) {
  var sourceKeys, key, index, quantity;

  if (!common.isObject(source)) {
    throwError(state, 'cannot merge mappings; the provided source object is unacceptable');
  }

  sourceKeys = Object.keys(source);

  for (index = 0, quantity = sourceKeys.length; index < quantity; index += 1) {
    key = sourceKeys[index];

    if (!_hasOwnProperty.call(destination, key)) {
      destination[key] = source[key];
    }
  }
}

function storeMappingPair(state, _result, keyTag, keyNode, valueNode) {
  var index, quantity;

  keyNode = String(keyNode);

  if (null === _result) {
    _result = {};
  }

  if ('tag:yaml.org,2002:merge' === keyTag) {
    if (Array.isArray(valueNode)) {
      for (index = 0, quantity = valueNode.length; index < quantity; index += 1) {
        mergeMappings(state, _result, valueNode[index]);
      }
    } else {
      mergeMappings(state, _result, valueNode);
    }
  } else {
    _result[keyNode] = valueNode;
  }

  return _result;
}

function readLineBreak(state) {
  var ch;

  ch = state.input.charCodeAt(state.position);

  if (0x0A/* LF */ === ch) {
    state.position++;
  } else if (0x0D/* CR */ === ch) {
    state.position++;
    if (0x0A/* LF */ === state.input.charCodeAt(state.position)) {
      state.position++;
    }
  } else {
    throwError(state, 'a line break is expected');
  }

  state.line += 1;
  state.lineStart = state.position;
}

function skipSeparationSpace(state, allowComments, checkIndent) {
  var lineBreaks = 0,
      ch = state.input.charCodeAt(state.position);

  while (0 !== ch) {
    while (is_WHITE_SPACE(ch)) {
      ch = state.input.charCodeAt(++state.position);
    }

    if (allowComments && 0x23/* # */ === ch) {
      do {
        ch = state.input.charCodeAt(++state.position);
      } while (ch !== 0x0A/* LF */ && ch !== 0x0D/* CR */ && 0 !== ch);
    }

    if (is_EOL(ch)) {
      readLineBreak(state);

      ch = state.input.charCodeAt(state.position);
      lineBreaks++;
      state.lineIndent = 0;

      while (0x20/* Space */ === ch) {
        state.lineIndent++;
        ch = state.input.charCodeAt(++state.position);
      }
    } else {
      break;
    }
  }

  if (-1 !== checkIndent && 0 !== lineBreaks && state.lineIndent < checkIndent) {
    throwWarning(state, 'deficient indentation');
  }

  return lineBreaks;
}

function testDocumentSeparator(state) {
  var _position = state.position,
      ch;

  ch = state.input.charCodeAt(_position);

  // Condition state.position === state.lineStart is tested
  // in parent on each call, for efficiency. No needs to test here again.
  if ((0x2D/* - */ === ch || 0x2E/* . */ === ch) &&
      state.input.charCodeAt(_position + 1) === ch &&
      state.input.charCodeAt(_position + 2) === ch) {

    _position += 3;

    ch = state.input.charCodeAt(_position);

    if (ch === 0 || is_WS_OR_EOL(ch)) {
      return true;
    }
  }

  return false;
}

function writeFoldedLines(state, count) {
  if (1 === count) {
    state.result += ' ';
  } else if (count > 1) {
    state.result += common.repeat('\n', count - 1);
  }
}


function readPlainScalar(state, nodeIndent, withinFlowCollection) {
  var preceding,
      following,
      captureStart,
      captureEnd,
      hasPendingContent,
      _line,
      _lineStart,
      _lineIndent,
      _kind = state.kind,
      _result = state.result,
      ch;

  ch = state.input.charCodeAt(state.position);

  if (is_WS_OR_EOL(ch)             ||
      is_FLOW_INDICATOR(ch)        ||
      0x23/* # */           === ch ||
      0x26/* & */           === ch ||
      0x2A/* * */           === ch ||
      0x21/* ! */           === ch ||
      0x7C/* | */           === ch ||
      0x3E/* > */           === ch ||
      0x27/* ' */           === ch ||
      0x22/* " */           === ch ||
      0x25/* % */           === ch ||
      0x40/* @ */           === ch ||
      0x60/* ` */           === ch) {
    return false;
  }

  if (0x3F/* ? */ === ch || 0x2D/* - */ === ch) {
    following = state.input.charCodeAt(state.position + 1);

    if (is_WS_OR_EOL(following) ||
        withinFlowCollection && is_FLOW_INDICATOR(following)) {
      return false;
    }
  }

  state.kind = 'scalar';
  state.result = '';
  captureStart = captureEnd = state.position;
  hasPendingContent = false;

  while (0 !== ch) {
    if (0x3A/* : */ === ch) {
      following = state.input.charCodeAt(state.position + 1);

      if (is_WS_OR_EOL(following) ||
          withinFlowCollection && is_FLOW_INDICATOR(following)) {
        break;
      }

    } else if (0x23/* # */ === ch) {
      preceding = state.input.charCodeAt(state.position - 1);

      if (is_WS_OR_EOL(preceding)) {
        break;
      }

    } else if ((state.position === state.lineStart && testDocumentSeparator(state)) ||
               withinFlowCollection && is_FLOW_INDICATOR(ch)) {
      break;

    } else if (is_EOL(ch)) {
      _line = state.line;
      _lineStart = state.lineStart;
      _lineIndent = state.lineIndent;
      skipSeparationSpace(state, false, -1);

      if (state.lineIndent >= nodeIndent) {
        hasPendingContent = true;
        ch = state.input.charCodeAt(state.position);
        continue;
      } else {
        state.position = captureEnd;
        state.line = _line;
        state.lineStart = _lineStart;
        state.lineIndent = _lineIndent;
        break;
      }
    }

    if (hasPendingContent) {
      captureSegment(state, captureStart, captureEnd, false);
      writeFoldedLines(state, state.line - _line);
      captureStart = captureEnd = state.position;
      hasPendingContent = false;
    }

    if (!is_WHITE_SPACE(ch)) {
      captureEnd = state.position + 1;
    }

    ch = state.input.charCodeAt(++state.position);
  }

  captureSegment(state, captureStart, captureEnd, false);

  if (state.result) {
    return true;
  }

  state.kind = _kind;
  state.result = _result;
  return false;
}

function readSingleQuotedScalar(state, nodeIndent) {
  var ch,
      captureStart, captureEnd;

  ch = state.input.charCodeAt(state.position);

  if (0x27/* ' */ !== ch) {
    return false;
  }

  state.kind = 'scalar';
  state.result = '';
  state.position++;
  captureStart = captureEnd = state.position;

  while (0 !== (ch = state.input.charCodeAt(state.position))) {
    if (0x27/* ' */ === ch) {
      captureSegment(state, captureStart, state.position, true);
      ch = state.input.charCodeAt(++state.position);

      if (0x27/* ' */ === ch) {
        captureStart = captureEnd = state.position;
        state.position++;
      } else {
        return true;
      }

    } else if (is_EOL(ch)) {
      captureSegment(state, captureStart, captureEnd, true);
      writeFoldedLines(state, skipSeparationSpace(state, false, nodeIndent));
      captureStart = captureEnd = state.position;

    } else if (state.position === state.lineStart && testDocumentSeparator(state)) {
      throwError(state, 'unexpected end of the document within a single quoted scalar');

    } else {
      state.position++;
      captureEnd = state.position;
    }
  }

  throwError(state, 'unexpected end of the stream within a single quoted scalar');
}

function readDoubleQuotedScalar(state, nodeIndent) {
  var captureStart,
      captureEnd,
      hexLength,
      hexResult,
      tmp,
      ch;

  ch = state.input.charCodeAt(state.position);

  if (0x22/* " */ !== ch) {
    return false;
  }

  state.kind = 'scalar';
  state.result = '';
  state.position++;
  captureStart = captureEnd = state.position;

  while (0 !== (ch = state.input.charCodeAt(state.position))) {
    if (0x22/* " */ === ch) {
      captureSegment(state, captureStart, state.position, true);
      state.position++;
      return true;

    } else if (0x5C/* \ */ === ch) {
      captureSegment(state, captureStart, state.position, true);
      ch = state.input.charCodeAt(++state.position);

      if (is_EOL(ch)) {
        skipSeparationSpace(state, false, nodeIndent);

        // TODO: rework to inline fn with no type cast?
      } else if (ch < 256 && simpleEscapeCheck[ch]) {
        state.result += simpleEscapeMap[ch];
        state.position++;

      } else if ((tmp = escapedHexLen(ch)) > 0) {
        hexLength = tmp;
        hexResult = 0;

        for (; hexLength > 0; hexLength--) {
          ch = state.input.charCodeAt(++state.position);

          if ((tmp = fromHexCode(ch)) >= 0) {
            hexResult = (hexResult << 4) + tmp;

          } else {
            throwError(state, 'expected hexadecimal character');
          }
        }

        state.result += charFromCodepoint(hexResult);

        state.position++;

      } else {
        throwError(state, 'unknown escape sequence');
      }

      captureStart = captureEnd = state.position;

    } else if (is_EOL(ch)) {
      captureSegment(state, captureStart, captureEnd, true);
      writeFoldedLines(state, skipSeparationSpace(state, false, nodeIndent));
      captureStart = captureEnd = state.position;

    } else if (state.position === state.lineStart && testDocumentSeparator(state)) {
      throwError(state, 'unexpected end of the document within a double quoted scalar');

    } else {
      state.position++;
      captureEnd = state.position;
    }
  }

  throwError(state, 'unexpected end of the stream within a double quoted scalar');
}

function readFlowCollection(state, nodeIndent) {
  var readNext = true,
      _line,
      _tag     = state.tag,
      _result,
      _anchor  = state.anchor,
      following,
      terminator,
      isPair,
      isExplicitPair,
      isMapping,
      keyNode,
      keyTag,
      valueNode,
      ch;

  ch = state.input.charCodeAt(state.position);

  if (ch === 0x5B/* [ */) {
    terminator = 0x5D;/* ] */
    isMapping = false;
    _result = [];
  } else if (ch === 0x7B/* { */) {
    terminator = 0x7D;/* } */
    isMapping = true;
    _result = {};
  } else {
    return false;
  }

  if (null !== state.anchor) {
    state.anchorMap[state.anchor] = _result;
  }

  ch = state.input.charCodeAt(++state.position);

  while (0 !== ch) {
    skipSeparationSpace(state, true, nodeIndent);

    ch = state.input.charCodeAt(state.position);

    if (ch === terminator) {
      state.position++;
      state.tag = _tag;
      state.anchor = _anchor;
      state.kind = isMapping ? 'mapping' : 'sequence';
      state.result = _result;
      return true;
    } else if (!readNext) {
      throwError(state, 'missed comma between flow collection entries');
    }

    keyTag = keyNode = valueNode = null;
    isPair = isExplicitPair = false;

    if (0x3F/* ? */ === ch) {
      following = state.input.charCodeAt(state.position + 1);

      if (is_WS_OR_EOL(following)) {
        isPair = isExplicitPair = true;
        state.position++;
        skipSeparationSpace(state, true, nodeIndent);
      }
    }

    _line = state.line;
    composeNode(state, nodeIndent, CONTEXT_FLOW_IN, false, true);
    keyTag = state.tag;
    keyNode = state.result;
    skipSeparationSpace(state, true, nodeIndent);

    ch = state.input.charCodeAt(state.position);

    if ((isExplicitPair || state.line === _line) && 0x3A/* : */ === ch) {
      isPair = true;
      ch = state.input.charCodeAt(++state.position);
      skipSeparationSpace(state, true, nodeIndent);
      composeNode(state, nodeIndent, CONTEXT_FLOW_IN, false, true);
      valueNode = state.result;
    }

    if (isMapping) {
      storeMappingPair(state, _result, keyTag, keyNode, valueNode);
    } else if (isPair) {
      _result.push(storeMappingPair(state, null, keyTag, keyNode, valueNode));
    } else {
      _result.push(keyNode);
    }

    skipSeparationSpace(state, true, nodeIndent);

    ch = state.input.charCodeAt(state.position);

    if (0x2C/* , */ === ch) {
      readNext = true;
      ch = state.input.charCodeAt(++state.position);
    } else {
      readNext = false;
    }
  }

  throwError(state, 'unexpected end of the stream within a flow collection');
}

function readBlockScalar(state, nodeIndent) {
  var captureStart,
      folding,
      chomping       = CHOMPING_CLIP,
      detectedIndent = false,
      textIndent     = nodeIndent,
      emptyLines     = 0,
      atMoreIndented = false,
      tmp,
      ch;

  ch = state.input.charCodeAt(state.position);

  if (ch === 0x7C/* | */) {
    folding = false;
  } else if (ch === 0x3E/* > */) {
    folding = true;
  } else {
    return false;
  }

  state.kind = 'scalar';
  state.result = '';

  while (0 !== ch) {
    ch = state.input.charCodeAt(++state.position);

    if (0x2B/* + */ === ch || 0x2D/* - */ === ch) {
      if (CHOMPING_CLIP === chomping) {
        chomping = (0x2B/* + */ === ch) ? CHOMPING_KEEP : CHOMPING_STRIP;
      } else {
        throwError(state, 'repeat of a chomping mode identifier');
      }

    } else if ((tmp = fromDecimalCode(ch)) >= 0) {
      if (tmp === 0) {
        throwError(state, 'bad explicit indentation width of a block scalar; it cannot be less than one');
      } else if (!detectedIndent) {
        textIndent = nodeIndent + tmp - 1;
        detectedIndent = true;
      } else {
        throwError(state, 'repeat of an indentation width identifier');
      }

    } else {
      break;
    }
  }

  if (is_WHITE_SPACE(ch)) {
    do { ch = state.input.charCodeAt(++state.position); }
    while (is_WHITE_SPACE(ch));

    if (0x23/* # */ === ch) {
      do { ch = state.input.charCodeAt(++state.position); }
      while (!is_EOL(ch) && (0 !== ch));
    }
  }

  while (0 !== ch) {
    readLineBreak(state);
    state.lineIndent = 0;

    ch = state.input.charCodeAt(state.position);

    while ((!detectedIndent || state.lineIndent < textIndent) &&
           (0x20/* Space */ === ch)) {
      state.lineIndent++;
      ch = state.input.charCodeAt(++state.position);
    }

    if (!detectedIndent && state.lineIndent > textIndent) {
      textIndent = state.lineIndent;
    }

    if (is_EOL(ch)) {
      emptyLines++;
      continue;
    }

    // End of the scalar.
    if (state.lineIndent < textIndent) {

      // Perform the chomping.
      if (chomping === CHOMPING_KEEP) {
        state.result += common.repeat('\n', emptyLines);
      } else if (chomping === CHOMPING_CLIP) {
        if (detectedIndent) { // i.e. only if the scalar is not empty.
          state.result += '\n';
        }
      }

      // Break this `while` cycle and go to the funciton's epilogue.
      break;
    }

    // Folded style: use fancy rules to handle line breaks.
    if (folding) {

      // Lines starting with white space characters (more-indented lines) are not folded.
      if (is_WHITE_SPACE(ch)) {
        atMoreIndented = true;
        state.result += common.repeat('\n', emptyLines + 1);

      // End of more-indented block.
      } else if (atMoreIndented) {
        atMoreIndented = false;
        state.result += common.repeat('\n', emptyLines + 1);

      // Just one line break - perceive as the same line.
      } else if (0 === emptyLines) {
        if (detectedIndent) { // i.e. only if we have already read some scalar content.
          state.result += ' ';
        }

      // Several line breaks - perceive as different lines.
      } else {
        state.result += common.repeat('\n', emptyLines);
      }

    // Literal style: just add exact number of line breaks between content lines.
    } else if (detectedIndent) {
      // If current line isn't the first one - count line break from the last content line.
      state.result += common.repeat('\n', emptyLines + 1);
    } else {
      // In case of the first content line - count only empty lines.
      state.result += common.repeat('\n', emptyLines);
    }

    detectedIndent = true;
    emptyLines = 0;
    captureStart = state.position;

    while (!is_EOL(ch) && (0 !== ch)) {
      ch = state.input.charCodeAt(++state.position);
    }

    captureSegment(state, captureStart, state.position, false);
  }

  return true;
}

function readBlockSequence(state, nodeIndent) {
  var _line,
      _tag      = state.tag,
      _anchor   = state.anchor,
      _result   = [],
      following,
      detected  = false,
      ch;

  if (null !== state.anchor) {
    state.anchorMap[state.anchor] = _result;
  }

  ch = state.input.charCodeAt(state.position);

  while (0 !== ch) {

    if (0x2D/* - */ !== ch) {
      break;
    }

    following = state.input.charCodeAt(state.position + 1);

    if (!is_WS_OR_EOL(following)) {
      break;
    }

    detected = true;
    state.position++;

    if (skipSeparationSpace(state, true, -1)) {
      if (state.lineIndent <= nodeIndent) {
        _result.push(null);
        ch = state.input.charCodeAt(state.position);
        continue;
      }
    }

    _line = state.line;
    composeNode(state, nodeIndent, CONTEXT_BLOCK_IN, false, true);
    _result.push(state.result);
    skipSeparationSpace(state, true, -1);

    ch = state.input.charCodeAt(state.position);

    if ((state.line === _line || state.lineIndent > nodeIndent) && (0 !== ch)) {
      throwError(state, 'bad indentation of a sequence entry');
    } else if (state.lineIndent < nodeIndent) {
      break;
    }
  }

  if (detected) {
    state.tag = _tag;
    state.anchor = _anchor;
    state.kind = 'sequence';
    state.result = _result;
    return true;
  }
  return false;
}

function readBlockMapping(state, nodeIndent, flowIndent) {
  var following,
      allowCompact,
      _line,
      _tag          = state.tag,
      _anchor       = state.anchor,
      _result       = {},
      keyTag        = null,
      keyNode       = null,
      valueNode     = null,
      atExplicitKey = false,
      detected      = false,
      ch;

  if (null !== state.anchor) {
    state.anchorMap[state.anchor] = _result;
  }

  ch = state.input.charCodeAt(state.position);

  while (0 !== ch) {
    following = state.input.charCodeAt(state.position + 1);
    _line = state.line; // Save the current line.

    //
    // Explicit notation case. There are two separate blocks:
    // first for the key (denoted by "?") and second for the value (denoted by ":")
    //
    if ((0x3F/* ? */ === ch || 0x3A/* : */  === ch) && is_WS_OR_EOL(following)) {

      if (0x3F/* ? */ === ch) {
        if (atExplicitKey) {
          storeMappingPair(state, _result, keyTag, keyNode, null);
          keyTag = keyNode = valueNode = null;
        }

        detected = true;
        atExplicitKey = true;
        allowCompact = true;

      } else if (atExplicitKey) {
        // i.e. 0x3A/* : */ === character after the explicit key.
        atExplicitKey = false;
        allowCompact = true;

      } else {
        throwError(state, 'incomplete explicit mapping pair; a key node is missed');
      }

      state.position += 1;
      ch = following;

    //
    // Implicit notation case. Flow-style node as the key first, then ":", and the value.
    //
    } else if (composeNode(state, flowIndent, CONTEXT_FLOW_OUT, false, true)) {

      if (state.line === _line) {
        ch = state.input.charCodeAt(state.position);

        while (is_WHITE_SPACE(ch)) {
          ch = state.input.charCodeAt(++state.position);
        }

        if (0x3A/* : */ === ch) {
          ch = state.input.charCodeAt(++state.position);

          if (!is_WS_OR_EOL(ch)) {
            throwError(state, 'a whitespace character is expected after the key-value separator within a block mapping');
          }

          if (atExplicitKey) {
            storeMappingPair(state, _result, keyTag, keyNode, null);
            keyTag = keyNode = valueNode = null;
          }

          detected = true;
          atExplicitKey = false;
          allowCompact = false;
          keyTag = state.tag;
          keyNode = state.result;

        } else if (detected) {
          throwError(state, 'can not read an implicit mapping pair; a colon is missed');

        } else {
          state.tag = _tag;
          state.anchor = _anchor;
          return true; // Keep the result of `composeNode`.
        }

      } else if (detected) {
        throwError(state, 'can not read a block mapping entry; a multiline key may not be an implicit key');

      } else {
        state.tag = _tag;
        state.anchor = _anchor;
        return true; // Keep the result of `composeNode`.
      }

    } else {
      break; // Reading is done. Go to the epilogue.
    }

    //
    // Common reading code for both explicit and implicit notations.
    //
    if (state.line === _line || state.lineIndent > nodeIndent) {
      if (composeNode(state, nodeIndent, CONTEXT_BLOCK_OUT, true, allowCompact)) {
        if (atExplicitKey) {
          keyNode = state.result;
        } else {
          valueNode = state.result;
        }
      }

      if (!atExplicitKey) {
        storeMappingPair(state, _result, keyTag, keyNode, valueNode);
        keyTag = keyNode = valueNode = null;
      }

      skipSeparationSpace(state, true, -1);
      ch = state.input.charCodeAt(state.position);
    }

    if (state.lineIndent > nodeIndent && (0 !== ch)) {
      throwError(state, 'bad indentation of a mapping entry');
    } else if (state.lineIndent < nodeIndent) {
      break;
    }
  }

  //
  // Epilogue.
  //

  // Special case: last mapping's node contains only the key in explicit notation.
  if (atExplicitKey) {
    storeMappingPair(state, _result, keyTag, keyNode, null);
  }

  // Expose the resulting mapping.
  if (detected) {
    state.tag = _tag;
    state.anchor = _anchor;
    state.kind = 'mapping';
    state.result = _result;
  }

  return detected;
}

function readTagProperty(state) {
  var _position,
      isVerbatim = false,
      isNamed    = false,
      tagHandle,
      tagName,
      ch;

  ch = state.input.charCodeAt(state.position);

  if (0x21/* ! */ !== ch) {
    return false;
  }

  if (null !== state.tag) {
    throwError(state, 'duplication of a tag property');
  }

  ch = state.input.charCodeAt(++state.position);

  if (0x3C/* < */ === ch) {
    isVerbatim = true;
    ch = state.input.charCodeAt(++state.position);

  } else if (0x21/* ! */ === ch) {
    isNamed = true;
    tagHandle = '!!';
    ch = state.input.charCodeAt(++state.position);

  } else {
    tagHandle = '!';
  }

  _position = state.position;

  if (isVerbatim) {
    do { ch = state.input.charCodeAt(++state.position); }
    while (0 !== ch && 0x3E/* > */ !== ch);

    if (state.position < state.length) {
      tagName = state.input.slice(_position, state.position);
      ch = state.input.charCodeAt(++state.position);
    } else {
      throwError(state, 'unexpected end of the stream within a verbatim tag');
    }
  } else {
    while (0 !== ch && !is_WS_OR_EOL(ch)) {

      if (0x21/* ! */ === ch) {
        if (!isNamed) {
          tagHandle = state.input.slice(_position - 1, state.position + 1);

          if (!PATTERN_TAG_HANDLE.test(tagHandle)) {
            throwError(state, 'named tag handle cannot contain such characters');
          }

          isNamed = true;
          _position = state.position + 1;
        } else {
          throwError(state, 'tag suffix cannot contain exclamation marks');
        }
      }

      ch = state.input.charCodeAt(++state.position);
    }

    tagName = state.input.slice(_position, state.position);

    if (PATTERN_FLOW_INDICATORS.test(tagName)) {
      throwError(state, 'tag suffix cannot contain flow indicator characters');
    }
  }

  if (tagName && !PATTERN_TAG_URI.test(tagName)) {
    throwError(state, 'tag name cannot contain such characters: ' + tagName);
  }

  if (isVerbatim) {
    state.tag = tagName;

  } else if (_hasOwnProperty.call(state.tagMap, tagHandle)) {
    state.tag = state.tagMap[tagHandle] + tagName;

  } else if ('!' === tagHandle) {
    state.tag = '!' + tagName;

  } else if ('!!' === tagHandle) {
    state.tag = 'tag:yaml.org,2002:' + tagName;

  } else {
    throwError(state, 'undeclared tag handle "' + tagHandle + '"');
  }

  return true;
}

function readAnchorProperty(state) {
  var _position,
      ch;

  ch = state.input.charCodeAt(state.position);

  if (0x26/* & */ !== ch) {
    return false;
  }

  if (null !== state.anchor) {
    throwError(state, 'duplication of an anchor property');
  }

  ch = state.input.charCodeAt(++state.position);
  _position = state.position;

  while (0 !== ch && !is_WS_OR_EOL(ch) && !is_FLOW_INDICATOR(ch)) {
    ch = state.input.charCodeAt(++state.position);
  }

  if (state.position === _position) {
    throwError(state, 'name of an anchor node must contain at least one character');
  }

  state.anchor = state.input.slice(_position, state.position);
  return true;
}

function readAlias(state) {
  var _position, alias,
      ch;

  ch = state.input.charCodeAt(state.position);

  if (0x2A/* * */ !== ch) {
    return false;
  }

  ch = state.input.charCodeAt(++state.position);
  _position = state.position;

  while (0 !== ch && !is_WS_OR_EOL(ch) && !is_FLOW_INDICATOR(ch)) {
    ch = state.input.charCodeAt(++state.position);
  }

  if (state.position === _position) {
    throwError(state, 'name of an alias node must contain at least one character');
  }

  alias = state.input.slice(_position, state.position);

  if (!state.anchorMap.hasOwnProperty(alias)) {
    throwError(state, 'unidentified alias "' + alias + '"');
  }

  state.result = state.anchorMap[alias];
  skipSeparationSpace(state, true, -1);
  return true;
}

function composeNode(state, parentIndent, nodeContext, allowToSeek, allowCompact) {
  var allowBlockStyles,
      allowBlockScalars,
      allowBlockCollections,
      indentStatus = 1, // 1: this>parent, 0: this=parent, -1: this<parent
      atNewLine  = false,
      hasContent = false,
      typeIndex,
      typeQuantity,
      type,
      flowIndent,
      blockIndent;

  state.tag    = null;
  state.anchor = null;
  state.kind   = null;
  state.result = null;

  allowBlockStyles = allowBlockScalars = allowBlockCollections =
    CONTEXT_BLOCK_OUT === nodeContext ||
    CONTEXT_BLOCK_IN  === nodeContext;

  if (allowToSeek) {
    if (skipSeparationSpace(state, true, -1)) {
      atNewLine = true;

      if (state.lineIndent > parentIndent) {
        indentStatus = 1;
      } else if (state.lineIndent === parentIndent) {
        indentStatus = 0;
      } else if (state.lineIndent < parentIndent) {
        indentStatus = -1;
      }
    }
  }

  if (1 === indentStatus) {
    while (readTagProperty(state) || readAnchorProperty(state)) {
      if (skipSeparationSpace(state, true, -1)) {
        atNewLine = true;
        allowBlockCollections = allowBlockStyles;

        if (state.lineIndent > parentIndent) {
          indentStatus = 1;
        } else if (state.lineIndent === parentIndent) {
          indentStatus = 0;
        } else if (state.lineIndent < parentIndent) {
          indentStatus = -1;
        }
      } else {
        allowBlockCollections = false;
      }
    }
  }

  if (allowBlockCollections) {
    allowBlockCollections = atNewLine || allowCompact;
  }

  if (1 === indentStatus || CONTEXT_BLOCK_OUT === nodeContext) {
    if (CONTEXT_FLOW_IN === nodeContext || CONTEXT_FLOW_OUT === nodeContext) {
      flowIndent = parentIndent;
    } else {
      flowIndent = parentIndent + 1;
    }

    blockIndent = state.position - state.lineStart;

    if (1 === indentStatus) {
      if (allowBlockCollections &&
          (readBlockSequence(state, blockIndent) ||
           readBlockMapping(state, blockIndent, flowIndent)) ||
          readFlowCollection(state, flowIndent)) {
        hasContent = true;
      } else {
        if ((allowBlockScalars && readBlockScalar(state, flowIndent)) ||
            readSingleQuotedScalar(state, flowIndent) ||
            readDoubleQuotedScalar(state, flowIndent)) {
          hasContent = true;

        } else if (readAlias(state)) {
          hasContent = true;

          if (null !== state.tag || null !== state.anchor) {
            throwError(state, 'alias node should not have any properties');
          }

        } else if (readPlainScalar(state, flowIndent, CONTEXT_FLOW_IN === nodeContext)) {
          hasContent = true;

          if (null === state.tag) {
            state.tag = '?';
          }
        }

        if (null !== state.anchor) {
          state.anchorMap[state.anchor] = state.result;
        }
      }
    } else if (0 === indentStatus) {
      // Special case: block sequences are allowed to have same indentation level as the parent.
      // http://www.yaml.org/spec/1.2/spec.html#id2799784
      hasContent = allowBlockCollections && readBlockSequence(state, blockIndent);
    }
  }

  if (null !== state.tag && '!' !== state.tag) {
    if ('?' === state.tag) {
      for (typeIndex = 0, typeQuantity = state.implicitTypes.length;
           typeIndex < typeQuantity;
           typeIndex += 1) {
        type = state.implicitTypes[typeIndex];

        // Implicit resolving is not allowed for non-scalar types, and '?'
        // non-specific tag is only assigned to plain scalars. So, it isn't
        // needed to check for 'kind' conformity.

        if (type.resolve(state.result)) { // `state.result` updated in resolver if matched
          state.result = type.construct(state.result);
          state.tag = type.tag;
          if (null !== state.anchor) {
            state.anchorMap[state.anchor] = state.result;
          }
          break;
        }
      }
    } else if (_hasOwnProperty.call(state.typeMap, state.tag)) {
      type = state.typeMap[state.tag];

      if (null !== state.result && type.kind !== state.kind) {
        throwError(state, 'unacceptable node kind for !<' + state.tag + '> tag; it should be "' + type.kind + '", not "' + state.kind + '"');
      }

      if (!type.resolve(state.result)) { // `state.result` updated in resolver if matched
        throwError(state, 'cannot resolve a node with !<' + state.tag + '> explicit tag');
      } else {
        state.result = type.construct(state.result);
        if (null !== state.anchor) {
          state.anchorMap[state.anchor] = state.result;
        }
      }
    } else {
      throwError(state, 'unknown tag !<' + state.tag + '>');
    }
  }

  return null !== state.tag || null !== state.anchor || hasContent;
}

function readDocument(state) {
  var documentStart = state.position,
      _position,
      directiveName,
      directiveArgs,
      hasDirectives = false,
      ch;

  state.version = null;
  state.checkLineBreaks = state.legacy;
  state.tagMap = {};
  state.anchorMap = {};

  while (0 !== (ch = state.input.charCodeAt(state.position))) {
    skipSeparationSpace(state, true, -1);

    ch = state.input.charCodeAt(state.position);

    if (state.lineIndent > 0 || 0x25/* % */ !== ch) {
      break;
    }

    hasDirectives = true;
    ch = state.input.charCodeAt(++state.position);
    _position = state.position;

    while (0 !== ch && !is_WS_OR_EOL(ch)) {
      ch = state.input.charCodeAt(++state.position);
    }

    directiveName = state.input.slice(_position, state.position);
    directiveArgs = [];

    if (directiveName.length < 1) {
      throwError(state, 'directive name must not be less than one character in length');
    }

    while (0 !== ch) {
      while (is_WHITE_SPACE(ch)) {
        ch = state.input.charCodeAt(++state.position);
      }

      if (0x23/* # */ === ch) {
        do { ch = state.input.charCodeAt(++state.position); }
        while (0 !== ch && !is_EOL(ch));
        break;
      }

      if (is_EOL(ch)) {
        break;
      }

      _position = state.position;

      while (0 !== ch && !is_WS_OR_EOL(ch)) {
        ch = state.input.charCodeAt(++state.position);
      }

      directiveArgs.push(state.input.slice(_position, state.position));
    }

    if (0 !== ch) {
      readLineBreak(state);
    }

    if (_hasOwnProperty.call(directiveHandlers, directiveName)) {
      directiveHandlers[directiveName](state, directiveName, directiveArgs);
    } else {
      throwWarning(state, 'unknown document directive "' + directiveName + '"');
    }
  }

  skipSeparationSpace(state, true, -1);

  if (0 === state.lineIndent &&
      0x2D/* - */ === state.input.charCodeAt(state.position) &&
      0x2D/* - */ === state.input.charCodeAt(state.position + 1) &&
      0x2D/* - */ === state.input.charCodeAt(state.position + 2)) {
    state.position += 3;
    skipSeparationSpace(state, true, -1);

  } else if (hasDirectives) {
    throwError(state, 'directives end mark is expected');
  }

  composeNode(state, state.lineIndent - 1, CONTEXT_BLOCK_OUT, false, true);
  skipSeparationSpace(state, true, -1);

  if (state.checkLineBreaks &&
      PATTERN_NON_ASCII_LINE_BREAKS.test(state.input.slice(documentStart, state.position))) {
    throwWarning(state, 'non-ASCII line breaks are interpreted as content');
  }

  state.documents.push(state.result);

  if (state.position === state.lineStart && testDocumentSeparator(state)) {

    if (0x2E/* . */ === state.input.charCodeAt(state.position)) {
      state.position += 3;
      skipSeparationSpace(state, true, -1);
    }
    return;
  }

  if (state.position < (state.length - 1)) {
    throwError(state, 'end of the stream or a document separator is expected');
  } else {
    return;
  }
}


function loadDocuments(input, options) {
  input = String(input);
  options = options || {};

  if (input.length !== 0) {

    // Add tailing `\n` if not exists
    if (0x0A/* LF */ !== input.charCodeAt(input.length - 1) &&
        0x0D/* CR */ !== input.charCodeAt(input.length - 1)) {
      input += '\n';
    }

    // Strip BOM
    if (input.charCodeAt(0) === 0xFEFF) {
      input = input.slice(1);
    }
  }

  var state = new State(input, options);

  if (PATTERN_NON_PRINTABLE.test(state.input)) {
    throwError(state, 'the stream contains non-printable characters');
  }

  // Use 0 as string terminator. That significantly simplifies bounds check.
  state.input += '\0';

  while (0x20/* Space */ === state.input.charCodeAt(state.position)) {
    state.lineIndent += 1;
    state.position += 1;
  }

  while (state.position < (state.length - 1)) {
    readDocument(state);
  }

  return state.documents;
}


function loadAll(input, iterator, options) {
  var documents = loadDocuments(input, options), index, length;

  for (index = 0, length = documents.length; index < length; index += 1) {
    iterator(documents[index]);
  }
}


function load(input, options) {
  var documents = loadDocuments(input, options);

  if (0 === documents.length) {
    /*eslint-disable no-undefined*/
    return undefined;
  } else if (1 === documents.length) {
    return documents[0];
  }
  throw new YAMLException('expected a single document in the stream, but found more');
}


function safeLoadAll(input, output, options) {
  loadAll(input, output, common.extend({ schema: DEFAULT_SAFE_SCHEMA }, options));
}


function safeLoad(input, options) {
  return load(input, common.extend({ schema: DEFAULT_SAFE_SCHEMA }, options));
}


module.exports.loadAll     = loadAll;
module.exports.load        = load;
module.exports.safeLoadAll = safeLoadAll;
module.exports.safeLoad    = safeLoad;

},{"./common":8,"./exception":10,"./mark":12,"./schema/default_full":15,"./schema/default_safe":16}],12:[function(require,module,exports){
'use strict';


var common = require('./common');


function Mark(name, buffer, position, line, column) {
  this.name     = name;
  this.buffer   = buffer;
  this.position = position;
  this.line     = line;
  this.column   = column;
}


Mark.prototype.getSnippet = function getSnippet(indent, maxLength) {
  var head, start, tail, end, snippet;

  if (!this.buffer) {
    return null;
  }

  indent = indent || 4;
  maxLength = maxLength || 75;

  head = '';
  start = this.position;

  while (start > 0 && -1 === '\x00\r\n\x85\u2028\u2029'.indexOf(this.buffer.charAt(start - 1))) {
    start -= 1;
    if (this.position - start > (maxLength / 2 - 1)) {
      head = ' ... ';
      start += 5;
      break;
    }
  }

  tail = '';
  end = this.position;

  while (end < this.buffer.length && -1 === '\x00\r\n\x85\u2028\u2029'.indexOf(this.buffer.charAt(end))) {
    end += 1;
    if (end - this.position > (maxLength / 2 - 1)) {
      tail = ' ... ';
      end -= 5;
      break;
    }
  }

  snippet = this.buffer.slice(start, end);

  return common.repeat(' ', indent) + head + snippet + tail + '\n' +
         common.repeat(' ', indent + this.position - start + head.length) + '^';
};


Mark.prototype.toString = function toString(compact) {
  var snippet, where = '';

  if (this.name) {
    where += 'in "' + this.name + '" ';
  }

  where += 'at line ' + (this.line + 1) + ', column ' + (this.column + 1);

  if (!compact) {
    snippet = this.getSnippet();

    if (snippet) {
      where += ':\n' + snippet;
    }
  }

  return where;
};


module.exports = Mark;

},{"./common":8}],13:[function(require,module,exports){
'use strict';

/*eslint-disable max-len*/

var common        = require('./common');
var YAMLException = require('./exception');
var Type          = require('./type');


function compileList(schema, name, result) {
  var exclude = [];

  schema.include.forEach(function (includedSchema) {
    result = compileList(includedSchema, name, result);
  });

  schema[name].forEach(function (currentType) {
    result.forEach(function (previousType, previousIndex) {
      if (previousType.tag === currentType.tag) {
        exclude.push(previousIndex);
      }
    });

    result.push(currentType);
  });

  return result.filter(function (type, index) {
    return -1 === exclude.indexOf(index);
  });
}


function compileMap(/* lists... */) {
  var result = {}, index, length;

  function collectType(type) {
    result[type.tag] = type;
  }

  for (index = 0, length = arguments.length; index < length; index += 1) {
    arguments[index].forEach(collectType);
  }

  return result;
}


function Schema(definition) {
  this.include  = definition.include  || [];
  this.implicit = definition.implicit || [];
  this.explicit = definition.explicit || [];

  this.implicit.forEach(function (type) {
    if (type.loadKind && 'scalar' !== type.loadKind) {
      throw new YAMLException('There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.');
    }
  });

  this.compiledImplicit = compileList(this, 'implicit', []);
  this.compiledExplicit = compileList(this, 'explicit', []);
  this.compiledTypeMap  = compileMap(this.compiledImplicit, this.compiledExplicit);
}


Schema.DEFAULT = null;


Schema.create = function createSchema() {
  var schemas, types;

  switch (arguments.length) {
  case 1:
    schemas = Schema.DEFAULT;
    types = arguments[0];
    break;

  case 2:
    schemas = arguments[0];
    types = arguments[1];
    break;

  default:
    throw new YAMLException('Wrong number of arguments for Schema.create function');
  }

  schemas = common.toArray(schemas);
  types = common.toArray(types);

  if (!schemas.every(function (schema) { return schema instanceof Schema; })) {
    throw new YAMLException('Specified list of super schemas (or a single Schema object) contains a non-Schema object.');
  }

  if (!types.every(function (type) { return type instanceof Type; })) {
    throw new YAMLException('Specified list of YAML types (or a single Type object) contains a non-Type object.');
  }

  return new Schema({
    include: schemas,
    explicit: types
  });
};


module.exports = Schema;

},{"./common":8,"./exception":10,"./type":19}],14:[function(require,module,exports){
// Standard YAML's Core schema.
// http://www.yaml.org/spec/1.2/spec.html#id2804923
//
// NOTE: JS-YAML does not support schema-specific tag resolution restrictions.
// So, Core schema has no distinctions from JSON schema is JS-YAML.


'use strict';


var Schema = require('../schema');


module.exports = new Schema({
  include: [
    require('./json')
  ]
});

},{"../schema":13,"./json":18}],15:[function(require,module,exports){
// JS-YAML's default schema for `load` function.
// It is not described in the YAML specification.
//
// This schema is based on JS-YAML's default safe schema and includes
// JavaScript-specific types: !!js/undefined, !!js/regexp and !!js/function.
//
// Also this schema is used as default base schema at `Schema.create` function.


'use strict';


var Schema = require('../schema');


module.exports = Schema.DEFAULT = new Schema({
  include: [
    require('./default_safe')
  ],
  explicit: [
    require('../type/js/undefined'),
    require('../type/js/regexp'),
    require('../type/js/function')
  ]
});

},{"../schema":13,"../type/js/function":24,"../type/js/regexp":25,"../type/js/undefined":26,"./default_safe":16}],16:[function(require,module,exports){
// JS-YAML's default schema for `safeLoad` function.
// It is not described in the YAML specification.
//
// This schema is based on standard YAML's Core schema and includes most of
// extra types described at YAML tag repository. (http://yaml.org/type/)


'use strict';


var Schema = require('../schema');


module.exports = new Schema({
  include: [
    require('./core')
  ],
  implicit: [
    require('../type/timestamp'),
    require('../type/merge')
  ],
  explicit: [
    require('../type/binary'),
    require('../type/omap'),
    require('../type/pairs'),
    require('../type/set')
  ]
});

},{"../schema":13,"../type/binary":20,"../type/merge":28,"../type/omap":30,"../type/pairs":31,"../type/set":33,"../type/timestamp":35,"./core":14}],17:[function(require,module,exports){
// Standard YAML's Failsafe schema.
// http://www.yaml.org/spec/1.2/spec.html#id2802346


'use strict';


var Schema = require('../schema');


module.exports = new Schema({
  explicit: [
    require('../type/str'),
    require('../type/seq'),
    require('../type/map')
  ]
});

},{"../schema":13,"../type/map":27,"../type/seq":32,"../type/str":34}],18:[function(require,module,exports){
// Standard YAML's JSON schema.
// http://www.yaml.org/spec/1.2/spec.html#id2803231
//
// NOTE: JS-YAML does not support schema-specific tag resolution restrictions.
// So, this schema is not such strict as defined in the YAML specification.
// It allows numbers in binary notaion, use `Null` and `NULL` as `null`, etc.


'use strict';


var Schema = require('../schema');


module.exports = new Schema({
  include: [
    require('./failsafe')
  ],
  implicit: [
    require('../type/null'),
    require('../type/bool'),
    require('../type/int'),
    require('../type/float')
  ]
});

},{"../schema":13,"../type/bool":21,"../type/float":22,"../type/int":23,"../type/null":29,"./failsafe":17}],19:[function(require,module,exports){
'use strict';

var YAMLException = require('./exception');

var TYPE_CONSTRUCTOR_OPTIONS = [
  'kind',
  'resolve',
  'construct',
  'instanceOf',
  'predicate',
  'represent',
  'defaultStyle',
  'styleAliases'
];

var YAML_NODE_KINDS = [
  'scalar',
  'sequence',
  'mapping'
];

function compileStyleAliases(map) {
  var result = {};

  if (null !== map) {
    Object.keys(map).forEach(function (style) {
      map[style].forEach(function (alias) {
        result[String(alias)] = style;
      });
    });
  }

  return result;
}

function Type(tag, options) {
  options = options || {};

  Object.keys(options).forEach(function (name) {
    if (-1 === TYPE_CONSTRUCTOR_OPTIONS.indexOf(name)) {
      throw new YAMLException('Unknown option "' + name + '" is met in definition of "' + tag + '" YAML type.');
    }
  });

  // TODO: Add tag format check.
  this.tag          = tag;
  this.kind         = options['kind']         || null;
  this.resolve      = options['resolve']      || function () { return true; };
  this.construct    = options['construct']    || function (data) { return data; };
  this.instanceOf   = options['instanceOf']   || null;
  this.predicate    = options['predicate']    || null;
  this.represent    = options['represent']    || null;
  this.defaultStyle = options['defaultStyle'] || null;
  this.styleAliases = compileStyleAliases(options['styleAliases'] || null);

  if (-1 === YAML_NODE_KINDS.indexOf(this.kind)) {
    throw new YAMLException('Unknown kind "' + this.kind + '" is specified for "' + tag + '" YAML type.');
  }
}

module.exports = Type;

},{"./exception":10}],20:[function(require,module,exports){
'use strict';

/*eslint-disable no-bitwise*/

// A trick for browserified version.
// Since we make browserifier to ignore `buffer` module, NodeBuffer will be undefined
var NodeBuffer = require('buffer').Buffer;
var Type       = require('../type');


// [ 64, 65, 66 ] -> [ padding, CR, LF ]
var BASE64_MAP = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=\n\r';


function resolveYamlBinary(data) {
  if (null === data) {
    return false;
  }

  var code, idx, bitlen = 0, max = data.length, map = BASE64_MAP;

  // Convert one by one.
  for (idx = 0; idx < max; idx++) {
    code = map.indexOf(data.charAt(idx));

    // Skip CR/LF
    if (code > 64) { continue; }

    // Fail on illegal characters
    if (code < 0) { return false; }

    bitlen += 6;
  }

  // If there are any bits left, source was corrupted
  return (bitlen % 8) === 0;
}

function constructYamlBinary(data) {
  var idx, tailbits,
      input = data.replace(/[\r\n=]/g, ''), // remove CR/LF & padding to simplify scan
      max = input.length,
      map = BASE64_MAP,
      bits = 0,
      result = [];

  // Collect by 6*4 bits (3 bytes)

  for (idx = 0; idx < max; idx++) {
    if ((idx % 4 === 0) && idx) {
      result.push((bits >> 16) & 0xFF);
      result.push((bits >> 8) & 0xFF);
      result.push(bits & 0xFF);
    }

    bits = (bits << 6) | map.indexOf(input.charAt(idx));
  }

  // Dump tail

  tailbits = (max % 4) * 6;

  if (tailbits === 0) {
    result.push((bits >> 16) & 0xFF);
    result.push((bits >> 8) & 0xFF);
    result.push(bits & 0xFF);
  } else if (tailbits === 18) {
    result.push((bits >> 10) & 0xFF);
    result.push((bits >> 2) & 0xFF);
  } else if (tailbits === 12) {
    result.push((bits >> 4) & 0xFF);
  }

  // Wrap into Buffer for NodeJS and leave Array for browser
  if (NodeBuffer) {
    return new NodeBuffer(result);
  }

  return result;
}

function representYamlBinary(object /*, style*/) {
  var result = '', bits = 0, idx, tail,
      max = object.length,
      map = BASE64_MAP;

  // Convert every three bytes to 4 ASCII characters.

  for (idx = 0; idx < max; idx++) {
    if ((idx % 3 === 0) && idx) {
      result += map[(bits >> 18) & 0x3F];
      result += map[(bits >> 12) & 0x3F];
      result += map[(bits >> 6) & 0x3F];
      result += map[bits & 0x3F];
    }

    bits = (bits << 8) + object[idx];
  }

  // Dump tail

  tail = max % 3;

  if (tail === 0) {
    result += map[(bits >> 18) & 0x3F];
    result += map[(bits >> 12) & 0x3F];
    result += map[(bits >> 6) & 0x3F];
    result += map[bits & 0x3F];
  } else if (tail === 2) {
    result += map[(bits >> 10) & 0x3F];
    result += map[(bits >> 4) & 0x3F];
    result += map[(bits << 2) & 0x3F];
    result += map[64];
  } else if (tail === 1) {
    result += map[(bits >> 2) & 0x3F];
    result += map[(bits << 4) & 0x3F];
    result += map[64];
    result += map[64];
  }

  return result;
}

function isBinary(object) {
  return NodeBuffer && NodeBuffer.isBuffer(object);
}

module.exports = new Type('tag:yaml.org,2002:binary', {
  kind: 'scalar',
  resolve: resolveYamlBinary,
  construct: constructYamlBinary,
  predicate: isBinary,
  represent: representYamlBinary
});

},{"../type":19,"buffer":1}],21:[function(require,module,exports){
'use strict';

var Type = require('../type');

function resolveYamlBoolean(data) {
  if (null === data) {
    return false;
  }

  var max = data.length;

  return (max === 4 && (data === 'true' || data === 'True' || data === 'TRUE')) ||
         (max === 5 && (data === 'false' || data === 'False' || data === 'FALSE'));
}

function constructYamlBoolean(data) {
  return data === 'true' ||
         data === 'True' ||
         data === 'TRUE';
}

function isBoolean(object) {
  return '[object Boolean]' === Object.prototype.toString.call(object);
}

module.exports = new Type('tag:yaml.org,2002:bool', {
  kind: 'scalar',
  resolve: resolveYamlBoolean,
  construct: constructYamlBoolean,
  predicate: isBoolean,
  represent: {
    lowercase: function (object) { return object ? 'true' : 'false'; },
    uppercase: function (object) { return object ? 'TRUE' : 'FALSE'; },
    camelcase: function (object) { return object ? 'True' : 'False'; }
  },
  defaultStyle: 'lowercase'
});

},{"../type":19}],22:[function(require,module,exports){
'use strict';

var common = require('../common');
var Type   = require('../type');

var YAML_FLOAT_PATTERN = new RegExp(
  '^(?:[-+]?(?:[0-9][0-9_]*)\\.[0-9_]*(?:[eE][-+][0-9]+)?' +
  '|\\.[0-9_]+(?:[eE][-+][0-9]+)?' +
  '|[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\\.[0-9_]*' +
  '|[-+]?\\.(?:inf|Inf|INF)' +
  '|\\.(?:nan|NaN|NAN))$');

function resolveYamlFloat(data) {
  if (null === data) {
    return false;
  }

  if (!YAML_FLOAT_PATTERN.test(data)) {
    return false;
  }
  return true;
}

function constructYamlFloat(data) {
  var value, sign, base, digits;

  value  = data.replace(/_/g, '').toLowerCase();
  sign   = '-' === value[0] ? -1 : 1;
  digits = [];

  if (0 <= '+-'.indexOf(value[0])) {
    value = value.slice(1);
  }

  if ('.inf' === value) {
    return (1 === sign) ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;

  } else if ('.nan' === value) {
    return NaN;

  } else if (0 <= value.indexOf(':')) {
    value.split(':').forEach(function (v) {
      digits.unshift(parseFloat(v, 10));
    });

    value = 0.0;
    base = 1;

    digits.forEach(function (d) {
      value += d * base;
      base *= 60;
    });

    return sign * value;

  }
  return sign * parseFloat(value, 10);
}

function representYamlFloat(object, style) {
  if (isNaN(object)) {
    switch (style) {
    case 'lowercase':
      return '.nan';
    case 'uppercase':
      return '.NAN';
    case 'camelcase':
      return '.NaN';
    }
  } else if (Number.POSITIVE_INFINITY === object) {
    switch (style) {
    case 'lowercase':
      return '.inf';
    case 'uppercase':
      return '.INF';
    case 'camelcase':
      return '.Inf';
    }
  } else if (Number.NEGATIVE_INFINITY === object) {
    switch (style) {
    case 'lowercase':
      return '-.inf';
    case 'uppercase':
      return '-.INF';
    case 'camelcase':
      return '-.Inf';
    }
  } else if (common.isNegativeZero(object)) {
    return '-0.0';
  }
  return object.toString(10);
}

function isFloat(object) {
  return ('[object Number]' === Object.prototype.toString.call(object)) &&
         (0 !== object % 1 || common.isNegativeZero(object));
}

module.exports = new Type('tag:yaml.org,2002:float', {
  kind: 'scalar',
  resolve: resolveYamlFloat,
  construct: constructYamlFloat,
  predicate: isFloat,
  represent: representYamlFloat,
  defaultStyle: 'lowercase'
});

},{"../common":8,"../type":19}],23:[function(require,module,exports){
'use strict';

var common = require('../common');
var Type   = require('../type');

function isHexCode(c) {
  return ((0x30/* 0 */ <= c) && (c <= 0x39/* 9 */)) ||
         ((0x41/* A */ <= c) && (c <= 0x46/* F */)) ||
         ((0x61/* a */ <= c) && (c <= 0x66/* f */));
}

function isOctCode(c) {
  return ((0x30/* 0 */ <= c) && (c <= 0x37/* 7 */));
}

function isDecCode(c) {
  return ((0x30/* 0 */ <= c) && (c <= 0x39/* 9 */));
}

function resolveYamlInteger(data) {
  if (null === data) {
    return false;
  }

  var max = data.length,
      index = 0,
      hasDigits = false,
      ch;

  if (!max) { return false; }

  ch = data[index];

  // sign
  if (ch === '-' || ch === '+') {
    ch = data[++index];
  }

  if (ch === '0') {
    // 0
    if (index + 1 === max) { return true; }
    ch = data[++index];

    // base 2, base 8, base 16

    if (ch === 'b') {
      // base 2
      index++;

      for (; index < max; index++) {
        ch = data[index];
        if (ch === '_') { continue; }
        if (ch !== '0' && ch !== '1') {
          return false;
        }
        hasDigits = true;
      }
      return hasDigits;
    }


    if (ch === 'x') {
      // base 16
      index++;

      for (; index < max; index++) {
        ch = data[index];
        if (ch === '_') { continue; }
        if (!isHexCode(data.charCodeAt(index))) {
          return false;
        }
        hasDigits = true;
      }
      return hasDigits;
    }

    // base 8
    for (; index < max; index++) {
      ch = data[index];
      if (ch === '_') { continue; }
      if (!isOctCode(data.charCodeAt(index))) {
        return false;
      }
      hasDigits = true;
    }
    return hasDigits;
  }

  // base 10 (except 0) or base 60

  for (; index < max; index++) {
    ch = data[index];
    if (ch === '_') { continue; }
    if (ch === ':') { break; }
    if (!isDecCode(data.charCodeAt(index))) {
      return false;
    }
    hasDigits = true;
  }

  if (!hasDigits) { return false; }

  // if !base60 - done;
  if (ch !== ':') { return true; }

  // base60 almost not used, no needs to optimize
  return /^(:[0-5]?[0-9])+$/.test(data.slice(index));
}

function constructYamlInteger(data) {
  var value = data, sign = 1, ch, base, digits = [];

  if (value.indexOf('_') !== -1) {
    value = value.replace(/_/g, '');
  }

  ch = value[0];

  if (ch === '-' || ch === '+') {
    if (ch === '-') { sign = -1; }
    value = value.slice(1);
    ch = value[0];
  }

  if ('0' === value) {
    return 0;
  }

  if (ch === '0') {
    if (value[1] === 'b') {
      return sign * parseInt(value.slice(2), 2);
    }
    if (value[1] === 'x') {
      return sign * parseInt(value, 16);
    }
    return sign * parseInt(value, 8);

  }

  if (value.indexOf(':') !== -1) {
    value.split(':').forEach(function (v) {
      digits.unshift(parseInt(v, 10));
    });

    value = 0;
    base = 1;

    digits.forEach(function (d) {
      value += (d * base);
      base *= 60;
    });

    return sign * value;

  }

  return sign * parseInt(value, 10);
}

function isInteger(object) {
  return ('[object Number]' === Object.prototype.toString.call(object)) &&
         (0 === object % 1 && !common.isNegativeZero(object));
}

module.exports = new Type('tag:yaml.org,2002:int', {
  kind: 'scalar',
  resolve: resolveYamlInteger,
  construct: constructYamlInteger,
  predicate: isInteger,
  represent: {
    binary:      function (object) { return '0b' + object.toString(2); },
    octal:       function (object) { return '0'  + object.toString(8); },
    decimal:     function (object) { return        object.toString(10); },
    hexadecimal: function (object) { return '0x' + object.toString(16).toUpperCase(); }
  },
  defaultStyle: 'decimal',
  styleAliases: {
    binary:      [ 2,  'bin' ],
    octal:       [ 8,  'oct' ],
    decimal:     [ 10, 'dec' ],
    hexadecimal: [ 16, 'hex' ]
  }
});

},{"../common":8,"../type":19}],24:[function(require,module,exports){
'use strict';

var esprima;

// Browserified version does not have esprima
//
// 1. For node.js just require module as deps
// 2. For browser try to require mudule via external AMD system.
//    If not found - try to fallback to window.esprima. If not
//    found too - then fail to parse.
//
try {
  esprima = require('esprima');
} catch (_) {
  /*global window */
  if (typeof window !== 'undefined') { esprima = window.esprima; }
}

var Type = require('../../type');

function resolveJavascriptFunction(data) {
  if (null === data) {
    return false;
  }

  try {
    var source = '(' + data + ')',
        ast    = esprima.parse(source, { range: true });

    if ('Program'             !== ast.type         ||
        1                     !== ast.body.length  ||
        'ExpressionStatement' !== ast.body[0].type ||
        'FunctionExpression'  !== ast.body[0].expression.type) {
      return false;
    }

    return true;
  } catch (err) {
    return false;
  }
}

function constructJavascriptFunction(data) {
  /*jslint evil:true*/

  var source = '(' + data + ')',
      ast    = esprima.parse(source, { range: true }),
      params = [],
      body;

  if ('Program'             !== ast.type         ||
      1                     !== ast.body.length  ||
      'ExpressionStatement' !== ast.body[0].type ||
      'FunctionExpression'  !== ast.body[0].expression.type) {
    throw new Error('Failed to resolve function');
  }

  ast.body[0].expression.params.forEach(function (param) {
    params.push(param.name);
  });

  body = ast.body[0].expression.body.range;

  // Esprima's ranges include the first '{' and the last '}' characters on
  // function expressions. So cut them out.
  /*eslint-disable no-new-func*/
  return new Function(params, source.slice(body[0] + 1, body[1] - 1));
}

function representJavascriptFunction(object /*, style*/) {
  return object.toString();
}

function isFunction(object) {
  return '[object Function]' === Object.prototype.toString.call(object);
}

module.exports = new Type('tag:yaml.org,2002:js/function', {
  kind: 'scalar',
  resolve: resolveJavascriptFunction,
  construct: constructJavascriptFunction,
  predicate: isFunction,
  represent: representJavascriptFunction
});

},{"../../type":19,"esprima":36}],25:[function(require,module,exports){
'use strict';

var Type = require('../../type');

function resolveJavascriptRegExp(data) {
  if (null === data) {
    return false;
  }

  if (0 === data.length) {
    return false;
  }

  var regexp = data,
      tail   = /\/([gim]*)$/.exec(data),
      modifiers = '';

  // if regexp starts with '/' it can have modifiers and must be properly closed
  // `/foo/gim` - modifiers tail can be maximum 3 chars
  if ('/' === regexp[0]) {
    if (tail) {
      modifiers = tail[1];
    }

    if (modifiers.length > 3) { return false; }
    // if expression starts with /, is should be properly terminated
    if (regexp[regexp.length - modifiers.length - 1] !== '/') { return false; }

    regexp = regexp.slice(1, regexp.length - modifiers.length - 1);
  }

  try {
    return true;
  } catch (error) {
    return false;
  }
}

function constructJavascriptRegExp(data) {
  var regexp = data,
      tail   = /\/([gim]*)$/.exec(data),
      modifiers = '';

  // `/foo/gim` - tail can be maximum 4 chars
  if ('/' === regexp[0]) {
    if (tail) {
      modifiers = tail[1];
    }
    regexp = regexp.slice(1, regexp.length - modifiers.length - 1);
  }

  return new RegExp(regexp, modifiers);
}

function representJavascriptRegExp(object /*, style*/) {
  var result = '/' + object.source + '/';

  if (object.global) {
    result += 'g';
  }

  if (object.multiline) {
    result += 'm';
  }

  if (object.ignoreCase) {
    result += 'i';
  }

  return result;
}

function isRegExp(object) {
  return '[object RegExp]' === Object.prototype.toString.call(object);
}

module.exports = new Type('tag:yaml.org,2002:js/regexp', {
  kind: 'scalar',
  resolve: resolveJavascriptRegExp,
  construct: constructJavascriptRegExp,
  predicate: isRegExp,
  represent: representJavascriptRegExp
});

},{"../../type":19}],26:[function(require,module,exports){
'use strict';

var Type = require('../../type');

function resolveJavascriptUndefined() {
  return true;
}

function constructJavascriptUndefined() {
  /*eslint-disable no-undefined*/
  return undefined;
}

function representJavascriptUndefined() {
  return '';
}

function isUndefined(object) {
  return 'undefined' === typeof object;
}

module.exports = new Type('tag:yaml.org,2002:js/undefined', {
  kind: 'scalar',
  resolve: resolveJavascriptUndefined,
  construct: constructJavascriptUndefined,
  predicate: isUndefined,
  represent: representJavascriptUndefined
});

},{"../../type":19}],27:[function(require,module,exports){
'use strict';

var Type = require('../type');

module.exports = new Type('tag:yaml.org,2002:map', {
  kind: 'mapping',
  construct: function (data) { return null !== data ? data : {}; }
});

},{"../type":19}],28:[function(require,module,exports){
'use strict';

var Type = require('../type');

function resolveYamlMerge(data) {
  return '<<' === data || null === data;
}

module.exports = new Type('tag:yaml.org,2002:merge', {
  kind: 'scalar',
  resolve: resolveYamlMerge
});

},{"../type":19}],29:[function(require,module,exports){
'use strict';

var Type = require('../type');

function resolveYamlNull(data) {
  if (null === data) {
    return true;
  }

  var max = data.length;

  return (max === 1 && data === '~') ||
         (max === 4 && (data === 'null' || data === 'Null' || data === 'NULL'));
}

function constructYamlNull() {
  return null;
}

function isNull(object) {
  return null === object;
}

module.exports = new Type('tag:yaml.org,2002:null', {
  kind: 'scalar',
  resolve: resolveYamlNull,
  construct: constructYamlNull,
  predicate: isNull,
  represent: {
    canonical: function () { return '~';    },
    lowercase: function () { return 'null'; },
    uppercase: function () { return 'NULL'; },
    camelcase: function () { return 'Null'; }
  },
  defaultStyle: 'lowercase'
});

},{"../type":19}],30:[function(require,module,exports){
'use strict';

var Type = require('../type');

var _hasOwnProperty = Object.prototype.hasOwnProperty;
var _toString       = Object.prototype.toString;

function resolveYamlOmap(data) {
  if (null === data) {
    return true;
  }

  var objectKeys = [], index, length, pair, pairKey, pairHasKey,
      object = data;

  for (index = 0, length = object.length; index < length; index += 1) {
    pair = object[index];
    pairHasKey = false;

    if ('[object Object]' !== _toString.call(pair)) {
      return false;
    }

    for (pairKey in pair) {
      if (_hasOwnProperty.call(pair, pairKey)) {
        if (!pairHasKey) {
          pairHasKey = true;
        } else {
          return false;
        }
      }
    }

    if (!pairHasKey) {
      return false;
    }

    if (-1 === objectKeys.indexOf(pairKey)) {
      objectKeys.push(pairKey);
    } else {
      return false;
    }
  }

  return true;
}

function constructYamlOmap(data) {
  return null !== data ? data : [];
}

module.exports = new Type('tag:yaml.org,2002:omap', {
  kind: 'sequence',
  resolve: resolveYamlOmap,
  construct: constructYamlOmap
});

},{"../type":19}],31:[function(require,module,exports){
'use strict';

var Type = require('../type');

var _toString = Object.prototype.toString;

function resolveYamlPairs(data) {
  if (null === data) {
    return true;
  }

  var index, length, pair, keys, result,
      object = data;

  result = new Array(object.length);

  for (index = 0, length = object.length; index < length; index += 1) {
    pair = object[index];

    if ('[object Object]' !== _toString.call(pair)) {
      return false;
    }

    keys = Object.keys(pair);

    if (1 !== keys.length) {
      return false;
    }

    result[index] = [ keys[0], pair[keys[0]] ];
  }

  return true;
}

function constructYamlPairs(data) {
  if (null === data) {
    return [];
  }

  var index, length, pair, keys, result,
      object = data;

  result = new Array(object.length);

  for (index = 0, length = object.length; index < length; index += 1) {
    pair = object[index];

    keys = Object.keys(pair);

    result[index] = [ keys[0], pair[keys[0]] ];
  }

  return result;
}

module.exports = new Type('tag:yaml.org,2002:pairs', {
  kind: 'sequence',
  resolve: resolveYamlPairs,
  construct: constructYamlPairs
});

},{"../type":19}],32:[function(require,module,exports){
'use strict';

var Type = require('../type');

module.exports = new Type('tag:yaml.org,2002:seq', {
  kind: 'sequence',
  construct: function (data) { return null !== data ? data : []; }
});

},{"../type":19}],33:[function(require,module,exports){
'use strict';

var Type = require('../type');

var _hasOwnProperty = Object.prototype.hasOwnProperty;

function resolveYamlSet(data) {
  if (null === data) {
    return true;
  }

  var key, object = data;

  for (key in object) {
    if (_hasOwnProperty.call(object, key)) {
      if (null !== object[key]) {
        return false;
      }
    }
  }

  return true;
}

function constructYamlSet(data) {
  return null !== data ? data : {};
}

module.exports = new Type('tag:yaml.org,2002:set', {
  kind: 'mapping',
  resolve: resolveYamlSet,
  construct: constructYamlSet
});

},{"../type":19}],34:[function(require,module,exports){
'use strict';

var Type = require('../type');

module.exports = new Type('tag:yaml.org,2002:str', {
  kind: 'scalar',
  construct: function (data) { return null !== data ? data : ''; }
});

},{"../type":19}],35:[function(require,module,exports){
'use strict';

var Type = require('../type');

var YAML_TIMESTAMP_REGEXP = new RegExp(
  '^([0-9][0-9][0-9][0-9])'          + // [1] year
  '-([0-9][0-9]?)'                   + // [2] month
  '-([0-9][0-9]?)'                   + // [3] day
  '(?:(?:[Tt]|[ \\t]+)'              + // ...
  '([0-9][0-9]?)'                    + // [4] hour
  ':([0-9][0-9])'                    + // [5] minute
  ':([0-9][0-9])'                    + // [6] second
  '(?:\\.([0-9]*))?'                 + // [7] fraction
  '(?:[ \\t]*(Z|([-+])([0-9][0-9]?)' + // [8] tz [9] tz_sign [10] tz_hour
  '(?::([0-9][0-9]))?))?)?$');         // [11] tz_minute

function resolveYamlTimestamp(data) {
  if (null === data) {
    return false;
  }

  if (YAML_TIMESTAMP_REGEXP.exec(data) === null) {
    return false;
  }

  return true;
}

function constructYamlTimestamp(data) {
  var match, year, month, day, hour, minute, second, fraction = 0,
      delta = null, tz_hour, tz_minute, date;

  match = YAML_TIMESTAMP_REGEXP.exec(data);

  if (null === match) {
    throw new Error('Date resolve error');
  }

  // match: [1] year [2] month [3] day

  year = +(match[1]);
  month = +(match[2]) - 1; // JS month starts with 0
  day = +(match[3]);

  if (!match[4]) { // no hour
    return new Date(Date.UTC(year, month, day));
  }

  // match: [4] hour [5] minute [6] second [7] fraction

  hour = +(match[4]);
  minute = +(match[5]);
  second = +(match[6]);

  if (match[7]) {
    fraction = match[7].slice(0, 3);
    while (fraction.length < 3) { // milli-seconds
      fraction += '0';
    }
    fraction = +fraction;
  }

  // match: [8] tz [9] tz_sign [10] tz_hour [11] tz_minute

  if (match[9]) {
    tz_hour = +(match[10]);
    tz_minute = +(match[11] || 0);
    delta = (tz_hour * 60 + tz_minute) * 60000; // delta in mili-seconds
    if ('-' === match[9]) {
      delta = -delta;
    }
  }

  date = new Date(Date.UTC(year, month, day, hour, minute, second, fraction));

  if (delta) {
    date.setTime(date.getTime() - delta);
  }

  return date;
}

function representYamlTimestamp(object /*, style*/) {
  return object.toISOString();
}

module.exports = new Type('tag:yaml.org,2002:timestamp', {
  kind: 'scalar',
  resolve: resolveYamlTimestamp,
  construct: constructYamlTimestamp,
  instanceOf: Date,
  represent: representYamlTimestamp
});

},{"../type":19}],36:[function(require,module,exports){
/*
  Copyright (C) 2013 Ariya Hidayat <ariya.hidayat@gmail.com>
  Copyright (C) 2013 Thaddee Tyl <thaddee.tyl@gmail.com>
  Copyright (C) 2013 Mathias Bynens <mathias@qiwi.be>
  Copyright (C) 2012 Ariya Hidayat <ariya.hidayat@gmail.com>
  Copyright (C) 2012 Mathias Bynens <mathias@qiwi.be>
  Copyright (C) 2012 Joost-Wim Boekesteijn <joost-wim@boekesteijn.nl>
  Copyright (C) 2012 Kris Kowal <kris.kowal@cixar.com>
  Copyright (C) 2012 Yusuke Suzuki <utatane.tea@gmail.com>
  Copyright (C) 2012 Arpad Borsos <arpad.borsos@googlemail.com>
  Copyright (C) 2011 Ariya Hidayat <ariya.hidayat@gmail.com>

  Redistribution and use in source and binary forms, with or without
  modification, are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.

  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
  ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

(function (root, factory) {
    'use strict';

    // Universal Module Definition (UMD) to support AMD, CommonJS/Node.js,
    // Rhino, and plain browser loading.

    /* istanbul ignore next */
    if (typeof define === 'function' && define.amd) {
        define(['exports'], factory);
    } else if (typeof exports !== 'undefined') {
        factory(exports);
    } else {
        factory((root.esprima = {}));
    }
}(this, function (exports) {
    'use strict';

    var Token,
        TokenName,
        FnExprTokens,
        Syntax,
        PlaceHolders,
        Messages,
        Regex,
        source,
        strict,
        sourceType,
        index,
        lineNumber,
        lineStart,
        hasLineTerminator,
        lastIndex,
        lastLineNumber,
        lastLineStart,
        startIndex,
        startLineNumber,
        startLineStart,
        scanning,
        length,
        lookahead,
        state,
        extra,
        isBindingElement,
        isAssignmentTarget,
        firstCoverInitializedNameError;

    Token = {
        BooleanLiteral: 1,
        EOF: 2,
        Identifier: 3,
        Keyword: 4,
        NullLiteral: 5,
        NumericLiteral: 6,
        Punctuator: 7,
        StringLiteral: 8,
        RegularExpression: 9,
        Template: 10
    };

    TokenName = {};
    TokenName[Token.BooleanLiteral] = 'Boolean';
    TokenName[Token.EOF] = '<end>';
    TokenName[Token.Identifier] = 'Identifier';
    TokenName[Token.Keyword] = 'Keyword';
    TokenName[Token.NullLiteral] = 'Null';
    TokenName[Token.NumericLiteral] = 'Numeric';
    TokenName[Token.Punctuator] = 'Punctuator';
    TokenName[Token.StringLiteral] = 'String';
    TokenName[Token.RegularExpression] = 'RegularExpression';
    TokenName[Token.Template] = 'Template';

    // A function following one of those tokens is an expression.
    FnExprTokens = ['(', '{', '[', 'in', 'typeof', 'instanceof', 'new',
                    'return', 'case', 'delete', 'throw', 'void',
                    // assignment operators
                    '=', '+=', '-=', '*=', '/=', '%=', '<<=', '>>=', '>>>=',
                    '&=', '|=', '^=', ',',
                    // binary/unary operators
                    '+', '-', '*', '/', '%', '++', '--', '<<', '>>', '>>>', '&',
                    '|', '^', '!', '~', '&&', '||', '?', ':', '===', '==', '>=',
                    '<=', '<', '>', '!=', '!=='];

    Syntax = {
        AssignmentExpression: 'AssignmentExpression',
        AssignmentPattern: 'AssignmentPattern',
        ArrayExpression: 'ArrayExpression',
        ArrayPattern: 'ArrayPattern',
        ArrowFunctionExpression: 'ArrowFunctionExpression',
        BlockStatement: 'BlockStatement',
        BinaryExpression: 'BinaryExpression',
        BreakStatement: 'BreakStatement',
        CallExpression: 'CallExpression',
        CatchClause: 'CatchClause',
        ClassBody: 'ClassBody',
        ClassDeclaration: 'ClassDeclaration',
        ClassExpression: 'ClassExpression',
        ConditionalExpression: 'ConditionalExpression',
        ContinueStatement: 'ContinueStatement',
        DoWhileStatement: 'DoWhileStatement',
        DebuggerStatement: 'DebuggerStatement',
        EmptyStatement: 'EmptyStatement',
        ExportAllDeclaration: 'ExportAllDeclaration',
        ExportDefaultDeclaration: 'ExportDefaultDeclaration',
        ExportNamedDeclaration: 'ExportNamedDeclaration',
        ExportSpecifier: 'ExportSpecifier',
        ExpressionStatement: 'ExpressionStatement',
        ForStatement: 'ForStatement',
        ForInStatement: 'ForInStatement',
        FunctionDeclaration: 'FunctionDeclaration',
        FunctionExpression: 'FunctionExpression',
        Identifier: 'Identifier',
        IfStatement: 'IfStatement',
        ImportDeclaration: 'ImportDeclaration',
        ImportDefaultSpecifier: 'ImportDefaultSpecifier',
        ImportNamespaceSpecifier: 'ImportNamespaceSpecifier',
        ImportSpecifier: 'ImportSpecifier',
        Literal: 'Literal',
        LabeledStatement: 'LabeledStatement',
        LogicalExpression: 'LogicalExpression',
        MemberExpression: 'MemberExpression',
        MethodDefinition: 'MethodDefinition',
        NewExpression: 'NewExpression',
        ObjectExpression: 'ObjectExpression',
        ObjectPattern: 'ObjectPattern',
        Program: 'Program',
        Property: 'Property',
        RestElement: 'RestElement',
        ReturnStatement: 'ReturnStatement',
        SequenceExpression: 'SequenceExpression',
        SpreadElement: 'SpreadElement',
        Super: 'Super',
        SwitchCase: 'SwitchCase',
        SwitchStatement: 'SwitchStatement',
        TaggedTemplateExpression: 'TaggedTemplateExpression',
        TemplateElement: 'TemplateElement',
        TemplateLiteral: 'TemplateLiteral',
        ThisExpression: 'ThisExpression',
        ThrowStatement: 'ThrowStatement',
        TryStatement: 'TryStatement',
        UnaryExpression: 'UnaryExpression',
        UpdateExpression: 'UpdateExpression',
        VariableDeclaration: 'VariableDeclaration',
        VariableDeclarator: 'VariableDeclarator',
        WhileStatement: 'WhileStatement',
        WithStatement: 'WithStatement'
    };

    PlaceHolders = {
        ArrowParameterPlaceHolder: 'ArrowParameterPlaceHolder'
    };

    // Error messages should be identical to V8.
    Messages = {
        UnexpectedToken: 'Unexpected token %0',
        UnexpectedNumber: 'Unexpected number',
        UnexpectedString: 'Unexpected string',
        UnexpectedIdentifier: 'Unexpected identifier',
        UnexpectedReserved: 'Unexpected reserved word',
        UnexpectedTemplate: 'Unexpected quasi %0',
        UnexpectedEOS: 'Unexpected end of input',
        NewlineAfterThrow: 'Illegal newline after throw',
        InvalidRegExp: 'Invalid regular expression',
        UnterminatedRegExp: 'Invalid regular expression: missing /',
        InvalidLHSInAssignment: 'Invalid left-hand side in assignment',
        InvalidLHSInForIn: 'Invalid left-hand side in for-in',
        MultipleDefaultsInSwitch: 'More than one default clause in switch statement',
        NoCatchOrFinally: 'Missing catch or finally after try',
        UnknownLabel: 'Undefined label \'%0\'',
        Redeclaration: '%0 \'%1\' has already been declared',
        IllegalContinue: 'Illegal continue statement',
        IllegalBreak: 'Illegal break statement',
        IllegalReturn: 'Illegal return statement',
        StrictModeWith: 'Strict mode code may not include a with statement',
        StrictCatchVariable: 'Catch variable may not be eval or arguments in strict mode',
        StrictVarName: 'Variable name may not be eval or arguments in strict mode',
        StrictParamName: 'Parameter name eval or arguments is not allowed in strict mode',
        StrictParamDupe: 'Strict mode function may not have duplicate parameter names',
        StrictFunctionName: 'Function name may not be eval or arguments in strict mode',
        StrictOctalLiteral: 'Octal literals are not allowed in strict mode.',
        StrictDelete: 'Delete of an unqualified identifier in strict mode.',
        StrictLHSAssignment: 'Assignment to eval or arguments is not allowed in strict mode',
        StrictLHSPostfix: 'Postfix increment/decrement may not have eval or arguments operand in strict mode',
        StrictLHSPrefix: 'Prefix increment/decrement may not have eval or arguments operand in strict mode',
        StrictReservedWord: 'Use of future reserved word in strict mode',
        TemplateOctalLiteral: 'Octal literals are not allowed in template strings.',
        ParameterAfterRestParameter: 'Rest parameter must be last formal parameter',
        DefaultRestParameter: 'Unexpected token =',
        ObjectPatternAsRestParameter: 'Unexpected token {',
        DuplicateProtoProperty: 'Duplicate __proto__ fields are not allowed in object literals',
        ConstructorSpecialMethod: 'Class constructor may not be an accessor',
        DuplicateConstructor: 'A class may only have one constructor',
        StaticPrototype: 'Classes may not have static property named prototype',
        MissingFromClause: 'Unexpected token',
        NoAsAfterImportNamespace: 'Unexpected token',
        InvalidModuleSpecifier: 'Unexpected token',
        IllegalImportDeclaration: 'Unexpected token',
        IllegalExportDeclaration: 'Unexpected token'
    };

    // See also tools/generate-unicode-regex.py.
    Regex = {
        NonAsciiIdentifierStart: new RegExp('[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0-\u08B2\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA7AD\uA7B0\uA7B1\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB5F\uAB64\uAB65\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]'),
        NonAsciiIdentifierPart: new RegExp('[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u08A0-\u08B2\u08E4-\u0963\u0966-\u096F\u0971-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C00-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58\u0C59\u0C60-\u0C63\u0C66-\u0C6F\u0C81-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D01-\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D57\u0D60-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19D9\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1AB0-\u1ABD\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1CD0-\u1CD2\u1CD4-\u1CF6\u1CF8\u1CF9\u1D00-\u1DF5\u1DFC-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u200C\u200D\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u2E2F\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099\u309A\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA69D\uA69F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA7AD\uA7B0\uA7B1\uA7F7-\uA827\uA840-\uA873\uA880-\uA8C4\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uA9E0-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB5F\uAB64\uAB65\uABC0-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE2D\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]')
    };

    // Ensure the condition is true, otherwise throw an error.
    // This is only to have a better contract semantic, i.e. another safety net
    // to catch a logic error. The condition shall be fulfilled in normal case.
    // Do NOT use this to enforce a certain condition on any user input.

    function assert(condition, message) {
        /* istanbul ignore if */
        if (!condition) {
            throw new Error('ASSERT: ' + message);
        }
    }

    function isDecimalDigit(ch) {
        return (ch >= 0x30 && ch <= 0x39);   // 0..9
    }

    function isHexDigit(ch) {
        return '0123456789abcdefABCDEF'.indexOf(ch) >= 0;
    }

    function isOctalDigit(ch) {
        return '01234567'.indexOf(ch) >= 0;
    }

    function octalToDecimal(ch) {
        // \0 is not octal escape sequence
        var octal = (ch !== '0'), code = '01234567'.indexOf(ch);

        if (index < length && isOctalDigit(source[index])) {
            octal = true;
            code = code * 8 + '01234567'.indexOf(source[index++]);

            // 3 digits are only allowed when string starts
            // with 0, 1, 2, 3
            if ('0123'.indexOf(ch) >= 0 &&
                    index < length &&
                    isOctalDigit(source[index])) {
                code = code * 8 + '01234567'.indexOf(source[index++]);
            }
        }

        return {
            code: code,
            octal: octal
        };
    }

    // 7.2 White Space

    function isWhiteSpace(ch) {
        return (ch === 0x20) || (ch === 0x09) || (ch === 0x0B) || (ch === 0x0C) || (ch === 0xA0) ||
            (ch >= 0x1680 && [0x1680, 0x180E, 0x2000, 0x2001, 0x2002, 0x2003, 0x2004, 0x2005, 0x2006, 0x2007, 0x2008, 0x2009, 0x200A, 0x202F, 0x205F, 0x3000, 0xFEFF].indexOf(ch) >= 0);
    }

    // 7.3 Line Terminators

    function isLineTerminator(ch) {
        return (ch === 0x0A) || (ch === 0x0D) || (ch === 0x2028) || (ch === 0x2029);
    }

    // 7.6 Identifier Names and Identifiers

    function isIdentifierStart(ch) {
        return (ch === 0x24) || (ch === 0x5F) ||  // $ (dollar) and _ (underscore)
            (ch >= 0x41 && ch <= 0x5A) ||         // A..Z
            (ch >= 0x61 && ch <= 0x7A) ||         // a..z
            (ch === 0x5C) ||                      // \ (backslash)
            ((ch >= 0x80) && Regex.NonAsciiIdentifierStart.test(String.fromCharCode(ch)));
    }

    function isIdentifierPart(ch) {
        return (ch === 0x24) || (ch === 0x5F) ||  // $ (dollar) and _ (underscore)
            (ch >= 0x41 && ch <= 0x5A) ||         // A..Z
            (ch >= 0x61 && ch <= 0x7A) ||         // a..z
            (ch >= 0x30 && ch <= 0x39) ||         // 0..9
            (ch === 0x5C) ||                      // \ (backslash)
            ((ch >= 0x80) && Regex.NonAsciiIdentifierPart.test(String.fromCharCode(ch)));
    }

    // 7.6.1.2 Future Reserved Words

    function isFutureReservedWord(id) {
        switch (id) {
        case 'enum':
        case 'export':
        case 'import':
        case 'super':
            return true;
        default:
            return false;
        }
    }

    // 11.6.2.2 Future Reserved Words

    function isStrictModeReservedWord(id) {
        switch (id) {
        case 'implements':
        case 'interface':
        case 'package':
        case 'private':
        case 'protected':
        case 'public':
        case 'static':
        case 'yield':
        case 'let':
            return true;
        default:
            return false;
        }
    }

    function isRestrictedWord(id) {
        return id === 'eval' || id === 'arguments';
    }

    // 7.6.1.1 Keywords

    function isKeyword(id) {

        // 'const' is specialized as Keyword in V8.
        // 'yield' and 'let' are for compatibility with SpiderMonkey and ES.next.
        // Some others are from future reserved words.

        switch (id.length) {
        case 2:
            return (id === 'if') || (id === 'in') || (id === 'do');
        case 3:
            return (id === 'var') || (id === 'for') || (id === 'new') ||
                (id === 'try') || (id === 'let');
        case 4:
            return (id === 'this') || (id === 'else') || (id === 'case') ||
                (id === 'void') || (id === 'with') || (id === 'enum');
        case 5:
            return (id === 'while') || (id === 'break') || (id === 'catch') ||
                (id === 'throw') || (id === 'const') || (id === 'yield') ||
                (id === 'class') || (id === 'super');
        case 6:
            return (id === 'return') || (id === 'typeof') || (id === 'delete') ||
                (id === 'switch') || (id === 'export') || (id === 'import');
        case 7:
            return (id === 'default') || (id === 'finally') || (id === 'extends');
        case 8:
            return (id === 'function') || (id === 'continue') || (id === 'debugger');
        case 10:
            return (id === 'instanceof');
        default:
            return false;
        }
    }

    // 7.4 Comments

    function addComment(type, value, start, end, loc) {
        var comment;

        assert(typeof start === 'number', 'Comment must have valid position');

        state.lastCommentStart = start;

        comment = {
            type: type,
            value: value
        };
        if (extra.range) {
            comment.range = [start, end];
        }
        if (extra.loc) {
            comment.loc = loc;
        }
        extra.comments.push(comment);
        if (extra.attachComment) {
            extra.leadingComments.push(comment);
            extra.trailingComments.push(comment);
        }
    }

    function skipSingleLineComment(offset) {
        var start, loc, ch, comment;

        start = index - offset;
        loc = {
            start: {
                line: lineNumber,
                column: index - lineStart - offset
            }
        };

        while (index < length) {
            ch = source.charCodeAt(index);
            ++index;
            if (isLineTerminator(ch)) {
                hasLineTerminator = true;
                if (extra.comments) {
                    comment = source.slice(start + offset, index - 1);
                    loc.end = {
                        line: lineNumber,
                        column: index - lineStart - 1
                    };
                    addComment('Line', comment, start, index - 1, loc);
                }
                if (ch === 13 && source.charCodeAt(index) === 10) {
                    ++index;
                }
                ++lineNumber;
                lineStart = index;
                return;
            }
        }

        if (extra.comments) {
            comment = source.slice(start + offset, index);
            loc.end = {
                line: lineNumber,
                column: index - lineStart
            };
            addComment('Line', comment, start, index, loc);
        }
    }

    function skipMultiLineComment() {
        var start, loc, ch, comment;

        if (extra.comments) {
            start = index - 2;
            loc = {
                start: {
                    line: lineNumber,
                    column: index - lineStart - 2
                }
            };
        }

        while (index < length) {
            ch = source.charCodeAt(index);
            if (isLineTerminator(ch)) {
                if (ch === 0x0D && source.charCodeAt(index + 1) === 0x0A) {
                    ++index;
                }
                hasLineTerminator = true;
                ++lineNumber;
                ++index;
                lineStart = index;
            } else if (ch === 0x2A) {
                // Block comment ends with '*/'.
                if (source.charCodeAt(index + 1) === 0x2F) {
                    ++index;
                    ++index;
                    if (extra.comments) {
                        comment = source.slice(start + 2, index - 2);
                        loc.end = {
                            line: lineNumber,
                            column: index - lineStart
                        };
                        addComment('Block', comment, start, index, loc);
                    }
                    return;
                }
                ++index;
            } else {
                ++index;
            }
        }

        // Ran off the end of the file - the whole thing is a comment
        if (extra.comments) {
            loc.end = {
                line: lineNumber,
                column: index - lineStart
            };
            comment = source.slice(start + 2, index);
            addComment('Block', comment, start, index, loc);
        }
        tolerateUnexpectedToken();
    }

    function skipComment() {
        var ch, start;
        hasLineTerminator = false;

        start = (index === 0);
        while (index < length) {
            ch = source.charCodeAt(index);

            if (isWhiteSpace(ch)) {
                ++index;
            } else if (isLineTerminator(ch)) {
                hasLineTerminator = true;
                ++index;
                if (ch === 0x0D && source.charCodeAt(index) === 0x0A) {
                    ++index;
                }
                ++lineNumber;
                lineStart = index;
                start = true;
            } else if (ch === 0x2F) { // U+002F is '/'
                ch = source.charCodeAt(index + 1);
                if (ch === 0x2F) {
                    ++index;
                    ++index;
                    skipSingleLineComment(2);
                    start = true;
                } else if (ch === 0x2A) {  // U+002A is '*'
                    ++index;
                    ++index;
                    skipMultiLineComment();
                } else {
                    break;
                }
            } else if (start && ch === 0x2D) { // U+002D is '-'
                // U+003E is '>'
                if ((source.charCodeAt(index + 1) === 0x2D) && (source.charCodeAt(index + 2) === 0x3E)) {
                    // '-->' is a single-line comment
                    index += 3;
                    skipSingleLineComment(3);
                } else {
                    break;
                }
            } else if (ch === 0x3C) { // U+003C is '<'
                if (source.slice(index + 1, index + 4) === '!--') {
                    ++index; // `<`
                    ++index; // `!`
                    ++index; // `-`
                    ++index; // `-`
                    skipSingleLineComment(4);
                } else {
                    break;
                }
            } else {
                break;
            }
        }
    }

    function scanHexEscape(prefix) {
        var i, len, ch, code = 0;

        len = (prefix === 'u') ? 4 : 2;
        for (i = 0; i < len; ++i) {
            if (index < length && isHexDigit(source[index])) {
                ch = source[index++];
                code = code * 16 + '0123456789abcdef'.indexOf(ch.toLowerCase());
            } else {
                return '';
            }
        }
        return String.fromCharCode(code);
    }

    function scanUnicodeCodePointEscape() {
        var ch, code, cu1, cu2;

        ch = source[index];
        code = 0;

        // At least, one hex digit is required.
        if (ch === '}') {
            throwUnexpectedToken();
        }

        while (index < length) {
            ch = source[index++];
            if (!isHexDigit(ch)) {
                break;
            }
            code = code * 16 + '0123456789abcdef'.indexOf(ch.toLowerCase());
        }

        if (code > 0x10FFFF || ch !== '}') {
            throwUnexpectedToken();
        }

        // UTF-16 Encoding
        if (code <= 0xFFFF) {
            return String.fromCharCode(code);
        }
        cu1 = ((code - 0x10000) >> 10) + 0xD800;
        cu2 = ((code - 0x10000) & 1023) + 0xDC00;
        return String.fromCharCode(cu1, cu2);
    }

    function getEscapedIdentifier() {
        var ch, id;

        ch = source.charCodeAt(index++);
        id = String.fromCharCode(ch);

        // '\u' (U+005C, U+0075) denotes an escaped character.
        if (ch === 0x5C) {
            if (source.charCodeAt(index) !== 0x75) {
                throwUnexpectedToken();
            }
            ++index;
            ch = scanHexEscape('u');
            if (!ch || ch === '\\' || !isIdentifierStart(ch.charCodeAt(0))) {
                throwUnexpectedToken();
            }
            id = ch;
        }

        while (index < length) {
            ch = source.charCodeAt(index);
            if (!isIdentifierPart(ch)) {
                break;
            }
            ++index;
            id += String.fromCharCode(ch);

            // '\u' (U+005C, U+0075) denotes an escaped character.
            if (ch === 0x5C) {
                id = id.substr(0, id.length - 1);
                if (source.charCodeAt(index) !== 0x75) {
                    throwUnexpectedToken();
                }
                ++index;
                ch = scanHexEscape('u');
                if (!ch || ch === '\\' || !isIdentifierPart(ch.charCodeAt(0))) {
                    throwUnexpectedToken();
                }
                id += ch;
            }
        }

        return id;
    }

    function getIdentifier() {
        var start, ch;

        start = index++;
        while (index < length) {
            ch = source.charCodeAt(index);
            if (ch === 0x5C) {
                // Blackslash (U+005C) marks Unicode escape sequence.
                index = start;
                return getEscapedIdentifier();
            }
            if (isIdentifierPart(ch)) {
                ++index;
            } else {
                break;
            }
        }

        return source.slice(start, index);
    }

    function scanIdentifier() {
        var start, id, type;

        start = index;

        // Backslash (U+005C) starts an escaped character.
        id = (source.charCodeAt(index) === 0x5C) ? getEscapedIdentifier() : getIdentifier();

        // There is no keyword or literal with only one character.
        // Thus, it must be an identifier.
        if (id.length === 1) {
            type = Token.Identifier;
        } else if (isKeyword(id)) {
            type = Token.Keyword;
        } else if (id === 'null') {
            type = Token.NullLiteral;
        } else if (id === 'true' || id === 'false') {
            type = Token.BooleanLiteral;
        } else {
            type = Token.Identifier;
        }

        return {
            type: type,
            value: id,
            lineNumber: lineNumber,
            lineStart: lineStart,
            start: start,
            end: index
        };
    }


    // 7.7 Punctuators

    function scanPunctuator() {
        var token, str;

        token = {
            type: Token.Punctuator,
            value: '',
            lineNumber: lineNumber,
            lineStart: lineStart,
            start: index,
            end: index
        };

        // Check for most common single-character punctuators.
        str = source[index];
        switch (str) {

        case '(':
            if (extra.tokenize) {
                extra.openParenToken = extra.tokens.length;
            }
            ++index;
            break;

        case '{':
            if (extra.tokenize) {
                extra.openCurlyToken = extra.tokens.length;
            }
            state.curlyStack.push('{');
            ++index;
            break;

        case '.':
            ++index;
            if (source[index] === '.' && source[index + 1] === '.') {
                // Spread operator: ...
                index += 2;
                str = '...';
            }
            break;

        case '}':
            ++index;
            state.curlyStack.pop();
            break;
        case ')':
        case ';':
        case ',':
        case '[':
        case ']':
        case ':':
        case '?':
        case '~':
            ++index;
            break;

        default:
            // 4-character punctuator.
            str = source.substr(index, 4);
            if (str === '>>>=') {
                index += 4;
            } else {

                // 3-character punctuators.
                str = str.substr(0, 3);
                if (str === '===' || str === '!==' || str === '>>>' ||
                    str === '<<=' || str === '>>=') {
                    index += 3;
                } else {

                    // 2-character punctuators.
                    str = str.substr(0, 2);
                    if (str === '&&' || str === '||' || str === '==' || str === '!=' ||
                        str === '+=' || str === '-=' || str === '*=' || str === '/=' ||
                        str === '++' || str === '--' || str === '<<' || str === '>>' ||
                        str === '&=' || str === '|=' || str === '^=' || str === '%=' ||
                        str === '<=' || str === '>=' || str === '=>') {
                        index += 2;
                    } else {

                        // 1-character punctuators.
                        str = source[index];
                        if ('<>=!+-*%&|^/'.indexOf(str) >= 0) {
                            ++index;
                        }
                    }
                }
            }
        }

        if (index === token.start) {
            throwUnexpectedToken();
        }

        token.end = index;
        token.value = str;
        return token;
    }

    // 7.8.3 Numeric Literals

    function scanHexLiteral(start) {
        var number = '';

        while (index < length) {
            if (!isHexDigit(source[index])) {
                break;
            }
            number += source[index++];
        }

        if (number.length === 0) {
            throwUnexpectedToken();
        }

        if (isIdentifierStart(source.charCodeAt(index))) {
            throwUnexpectedToken();
        }

        return {
            type: Token.NumericLiteral,
            value: parseInt('0x' + number, 16),
            lineNumber: lineNumber,
            lineStart: lineStart,
            start: start,
            end: index
        };
    }

    function scanBinaryLiteral(start) {
        var ch, number;

        number = '';

        while (index < length) {
            ch = source[index];
            if (ch !== '0' && ch !== '1') {
                break;
            }
            number += source[index++];
        }

        if (number.length === 0) {
            // only 0b or 0B
            throwUnexpectedToken();
        }

        if (index < length) {
            ch = source.charCodeAt(index);
            /* istanbul ignore else */
            if (isIdentifierStart(ch) || isDecimalDigit(ch)) {
                throwUnexpectedToken();
            }
        }

        return {
            type: Token.NumericLiteral,
            value: parseInt(number, 2),
            lineNumber: lineNumber,
            lineStart: lineStart,
            start: start,
            end: index
        };
    }

    function scanOctalLiteral(prefix, start) {
        var number, octal;

        if (isOctalDigit(prefix)) {
            octal = true;
            number = '0' + source[index++];
        } else {
            octal = false;
            ++index;
            number = '';
        }

        while (index < length) {
            if (!isOctalDigit(source[index])) {
                break;
            }
            number += source[index++];
        }

        if (!octal && number.length === 0) {
            // only 0o or 0O
            throwUnexpectedToken();
        }

        if (isIdentifierStart(source.charCodeAt(index)) || isDecimalDigit(source.charCodeAt(index))) {
            throwUnexpectedToken();
        }

        return {
            type: Token.NumericLiteral,
            value: parseInt(number, 8),
            octal: octal,
            lineNumber: lineNumber,
            lineStart: lineStart,
            start: start,
            end: index
        };
    }

    function isImplicitOctalLiteral() {
        var i, ch;

        // Implicit octal, unless there is a non-octal digit.
        // (Annex B.1.1 on Numeric Literals)
        for (i = index + 1; i < length; ++i) {
            ch = source[i];
            if (ch === '8' || ch === '9') {
                return false;
            }
            if (!isOctalDigit(ch)) {
                return true;
            }
        }

        return true;
    }

    function scanNumericLiteral() {
        var number, start, ch;

        ch = source[index];
        assert(isDecimalDigit(ch.charCodeAt(0)) || (ch === '.'),
            'Numeric literal must start with a decimal digit or a decimal point');

        start = index;
        number = '';
        if (ch !== '.') {
            number = source[index++];
            ch = source[index];

            // Hex number starts with '0x'.
            // Octal number starts with '0'.
            // Octal number in ES6 starts with '0o'.
            // Binary number in ES6 starts with '0b'.
            if (number === '0') {
                if (ch === 'x' || ch === 'X') {
                    ++index;
                    return scanHexLiteral(start);
                }
                if (ch === 'b' || ch === 'B') {
                    ++index;
                    return scanBinaryLiteral(start);
                }
                if (ch === 'o' || ch === 'O') {
                    return scanOctalLiteral(ch, start);
                }

                if (isOctalDigit(ch)) {
                    if (isImplicitOctalLiteral()) {
                        return scanOctalLiteral(ch, start);
                    }
                }
            }

            while (isDecimalDigit(source.charCodeAt(index))) {
                number += source[index++];
            }
            ch = source[index];
        }

        if (ch === '.') {
            number += source[index++];
            while (isDecimalDigit(source.charCodeAt(index))) {
                number += source[index++];
            }
            ch = source[index];
        }

        if (ch === 'e' || ch === 'E') {
            number += source[index++];

            ch = source[index];
            if (ch === '+' || ch === '-') {
                number += source[index++];
            }
            if (isDecimalDigit(source.charCodeAt(index))) {
                while (isDecimalDigit(source.charCodeAt(index))) {
                    number += source[index++];
                }
            } else {
                throwUnexpectedToken();
            }
        }

        if (isIdentifierStart(source.charCodeAt(index))) {
            throwUnexpectedToken();
        }

        return {
            type: Token.NumericLiteral,
            value: parseFloat(number),
            lineNumber: lineNumber,
            lineStart: lineStart,
            start: start,
            end: index
        };
    }

    // 7.8.4 String Literals

    function scanStringLiteral() {
        var str = '', quote, start, ch, unescaped, octToDec, octal = false;

        quote = source[index];
        assert((quote === '\'' || quote === '"'),
            'String literal must starts with a quote');

        start = index;
        ++index;

        while (index < length) {
            ch = source[index++];

            if (ch === quote) {
                quote = '';
                break;
            } else if (ch === '\\') {
                ch = source[index++];
                if (!ch || !isLineTerminator(ch.charCodeAt(0))) {
                    switch (ch) {
                    case 'u':
                    case 'x':
                        if (source[index] === '{') {
                            ++index;
                            str += scanUnicodeCodePointEscape();
                        } else {
                            unescaped = scanHexEscape(ch);
                            if (!unescaped) {
                                throw throwUnexpectedToken();
                            }
                            str += unescaped;
                        }
                        break;
                    case 'n':
                        str += '\n';
                        break;
                    case 'r':
                        str += '\r';
                        break;
                    case 't':
                        str += '\t';
                        break;
                    case 'b':
                        str += '\b';
                        break;
                    case 'f':
                        str += '\f';
                        break;
                    case 'v':
                        str += '\x0B';
                        break;
                    case '8':
                    case '9':
                        throw throwUnexpectedToken();

                    default:
                        if (isOctalDigit(ch)) {
                            octToDec = octalToDecimal(ch);

                            octal = octToDec.octal || octal;
                            str += String.fromCharCode(octToDec.code);
                        } else {
                            str += ch;
                        }
                        break;
                    }
                } else {
                    ++lineNumber;
                    if (ch === '\r' && source[index] === '\n') {
                        ++index;
                    }
                    lineStart = index;
                }
            } else if (isLineTerminator(ch.charCodeAt(0))) {
                break;
            } else {
                str += ch;
            }
        }

        if (quote !== '') {
            throwUnexpectedToken();
        }

        return {
            type: Token.StringLiteral,
            value: str,
            octal: octal,
            lineNumber: startLineNumber,
            lineStart: startLineStart,
            start: start,
            end: index
        };
    }

    function scanTemplate() {
        var cooked = '', ch, start, rawOffset, terminated, head, tail, restore, unescaped;

        terminated = false;
        tail = false;
        start = index;
        head = (source[index] === '`');
        rawOffset = 2;

        ++index;

        while (index < length) {
            ch = source[index++];
            if (ch === '`') {
                rawOffset = 1;
                tail = true;
                terminated = true;
                break;
            } else if (ch === '$') {
                if (source[index] === '{') {
                    state.curlyStack.push('${');
                    ++index;
                    terminated = true;
                    break;
                }
                cooked += ch;
            } else if (ch === '\\') {
                ch = source[index++];
                if (!isLineTerminator(ch.charCodeAt(0))) {
                    switch (ch) {
                    case 'n':
                        cooked += '\n';
                        break;
                    case 'r':
                        cooked += '\r';
                        break;
                    case 't':
                        cooked += '\t';
                        break;
                    case 'u':
                    case 'x':
                        if (source[index] === '{') {
                            ++index;
                            cooked += scanUnicodeCodePointEscape();
                        } else {
                            restore = index;
                            unescaped = scanHexEscape(ch);
                            if (unescaped) {
                                cooked += unescaped;
                            } else {
                                index = restore;
                                cooked += ch;
                            }
                        }
                        break;
                    case 'b':
                        cooked += '\b';
                        break;
                    case 'f':
                        cooked += '\f';
                        break;
                    case 'v':
                        cooked += '\v';
                        break;

                    default:
                        if (ch === '0') {
                            if (isDecimalDigit(source.charCodeAt(index))) {
                                // Illegal: \01 \02 and so on
                                throwError(Messages.TemplateOctalLiteral);
                            }
                            cooked += '\0';
                        } else if (isOctalDigit(ch)) {
                            // Illegal: \1 \2
                            throwError(Messages.TemplateOctalLiteral);
                        } else {
                            cooked += ch;
                        }
                        break;
                    }
                } else {
                    ++lineNumber;
                    if (ch === '\r' && source[index] === '\n') {
                        ++index;
                    }
                    lineStart = index;
                }
            } else if (isLineTerminator(ch.charCodeAt(0))) {
                ++lineNumber;
                if (ch === '\r' && source[index] === '\n') {
                    ++index;
                }
                lineStart = index;
                cooked += '\n';
            } else {
                cooked += ch;
            }
        }

        if (!terminated) {
            throwUnexpectedToken();
        }

        if (!head) {
            state.curlyStack.pop();
        }

        return {
            type: Token.Template,
            value: {
                cooked: cooked,
                raw: source.slice(start + 1, index - rawOffset)
            },
            head: head,
            tail: tail,
            lineNumber: lineNumber,
            lineStart: lineStart,
            start: start,
            end: index
        };
    }

    function testRegExp(pattern, flags) {
        var tmp = pattern;

        if (flags.indexOf('u') >= 0) {
            // Replace each astral symbol and every Unicode escape sequence
            // that possibly represents an astral symbol or a paired surrogate
            // with a single ASCII symbol to avoid throwing on regular
            // expressions that are only valid in combination with the `/u`
            // flag.
            // Note: replacing with the ASCII symbol `x` might cause false
            // negatives in unlikely scenarios. For example, `[\u{61}-b]` is a
            // perfectly valid pattern that is equivalent to `[a-b]`, but it
            // would be replaced by `[x-b]` which throws an error.
            tmp = tmp
                .replace(/\\u\{([0-9a-fA-F]+)\}/g, function ($0, $1) {
                    if (parseInt($1, 16) <= 0x10FFFF) {
                        return 'x';
                    }
                    throwUnexpectedToken(null, Messages.InvalidRegExp);
                })
                .replace(
                    /\\u([a-fA-F0-9]{4})|[\uD800-\uDBFF][\uDC00-\uDFFF]/g,
                    'x'
                );
        }

        // First, detect invalid regular expressions.
        try {
            RegExp(tmp);
        } catch (e) {
            throwUnexpectedToken(null, Messages.InvalidRegExp);
        }

        // Return a regular expression object for this pattern-flag pair, or
        // `null` in case the current environment doesn't support the flags it
        // uses.
        try {
            return new RegExp(pattern, flags);
        } catch (exception) {
            return null;
        }
    }

    function scanRegExpBody() {
        var ch, str, classMarker, terminated, body;

        ch = source[index];
        assert(ch === '/', 'Regular expression literal must start with a slash');
        str = source[index++];

        classMarker = false;
        terminated = false;
        while (index < length) {
            ch = source[index++];
            str += ch;
            if (ch === '\\') {
                ch = source[index++];
                // ECMA-262 7.8.5
                if (isLineTerminator(ch.charCodeAt(0))) {
                    throwUnexpectedToken(null, Messages.UnterminatedRegExp);
                }
                str += ch;
            } else if (isLineTerminator(ch.charCodeAt(0))) {
                throwUnexpectedToken(null, Messages.UnterminatedRegExp);
            } else if (classMarker) {
                if (ch === ']') {
                    classMarker = false;
                }
            } else {
                if (ch === '/') {
                    terminated = true;
                    break;
                } else if (ch === '[') {
                    classMarker = true;
                }
            }
        }

        if (!terminated) {
            throwUnexpectedToken(null, Messages.UnterminatedRegExp);
        }

        // Exclude leading and trailing slash.
        body = str.substr(1, str.length - 2);
        return {
            value: body,
            literal: str
        };
    }

    function scanRegExpFlags() {
        var ch, str, flags, restore;

        str = '';
        flags = '';
        while (index < length) {
            ch = source[index];
            if (!isIdentifierPart(ch.charCodeAt(0))) {
                break;
            }

            ++index;
            if (ch === '\\' && index < length) {
                ch = source[index];
                if (ch === 'u') {
                    ++index;
                    restore = index;
                    ch = scanHexEscape('u');
                    if (ch) {
                        flags += ch;
                        for (str += '\\u'; restore < index; ++restore) {
                            str += source[restore];
                        }
                    } else {
                        index = restore;
                        flags += 'u';
                        str += '\\u';
                    }
                    tolerateUnexpectedToken();
                } else {
                    str += '\\';
                    tolerateUnexpectedToken();
                }
            } else {
                flags += ch;
                str += ch;
            }
        }

        return {
            value: flags,
            literal: str
        };
    }

    function scanRegExp() {
        scanning = true;
        var start, body, flags, value;

        lookahead = null;
        skipComment();
        start = index;

        body = scanRegExpBody();
        flags = scanRegExpFlags();
        value = testRegExp(body.value, flags.value);
        scanning = false;
        if (extra.tokenize) {
            return {
                type: Token.RegularExpression,
                value: value,
                regex: {
                    pattern: body.value,
                    flags: flags.value
                },
                lineNumber: lineNumber,
                lineStart: lineStart,
                start: start,
                end: index
            };
        }

        return {
            literal: body.literal + flags.literal,
            value: value,
            regex: {
                pattern: body.value,
                flags: flags.value
            },
            start: start,
            end: index
        };
    }

    function collectRegex() {
        var pos, loc, regex, token;

        skipComment();

        pos = index;
        loc = {
            start: {
                line: lineNumber,
                column: index - lineStart
            }
        };

        regex = scanRegExp();

        loc.end = {
            line: lineNumber,
            column: index - lineStart
        };

        /* istanbul ignore next */
        if (!extra.tokenize) {
            // Pop the previous token, which is likely '/' or '/='
            if (extra.tokens.length > 0) {
                token = extra.tokens[extra.tokens.length - 1];
                if (token.range[0] === pos && token.type === 'Punctuator') {
                    if (token.value === '/' || token.value === '/=') {
                        extra.tokens.pop();
                    }
                }
            }

            extra.tokens.push({
                type: 'RegularExpression',
                value: regex.literal,
                regex: regex.regex,
                range: [pos, index],
                loc: loc
            });
        }

        return regex;
    }

    function isIdentifierName(token) {
        return token.type === Token.Identifier ||
            token.type === Token.Keyword ||
            token.type === Token.BooleanLiteral ||
            token.type === Token.NullLiteral;
    }

    function advanceSlash() {
        var prevToken,
            checkToken;
        // Using the following algorithm:
        // https://github.com/mozilla/sweet.js/wiki/design
        prevToken = extra.tokens[extra.tokens.length - 1];
        if (!prevToken) {
            // Nothing before that: it cannot be a division.
            return collectRegex();
        }
        if (prevToken.type === 'Punctuator') {
            if (prevToken.value === ']') {
                return scanPunctuator();
            }
            if (prevToken.value === ')') {
                checkToken = extra.tokens[extra.openParenToken - 1];
                if (checkToken &&
                        checkToken.type === 'Keyword' &&
                        (checkToken.value === 'if' ||
                         checkToken.value === 'while' ||
                         checkToken.value === 'for' ||
                         checkToken.value === 'with')) {
                    return collectRegex();
                }
                return scanPunctuator();
            }
            if (prevToken.value === '}') {
                // Dividing a function by anything makes little sense,
                // but we have to check for that.
                if (extra.tokens[extra.openCurlyToken - 3] &&
                        extra.tokens[extra.openCurlyToken - 3].type === 'Keyword') {
                    // Anonymous function.
                    checkToken = extra.tokens[extra.openCurlyToken - 4];
                    if (!checkToken) {
                        return scanPunctuator();
                    }
                } else if (extra.tokens[extra.openCurlyToken - 4] &&
                        extra.tokens[extra.openCurlyToken - 4].type === 'Keyword') {
                    // Named function.
                    checkToken = extra.tokens[extra.openCurlyToken - 5];
                    if (!checkToken) {
                        return collectRegex();
                    }
                } else {
                    return scanPunctuator();
                }
                // checkToken determines whether the function is
                // a declaration or an expression.
                if (FnExprTokens.indexOf(checkToken.value) >= 0) {
                    // It is an expression.
                    return scanPunctuator();
                }
                // It is a declaration.
                return collectRegex();
            }
            return collectRegex();
        }
        if (prevToken.type === 'Keyword' && prevToken.value !== 'this') {
            return collectRegex();
        }
        return scanPunctuator();
    }

    function advance() {
        var ch, token;

        if (index >= length) {
            return {
                type: Token.EOF,
                lineNumber: lineNumber,
                lineStart: lineStart,
                start: index,
                end: index
            };
        }

        ch = source.charCodeAt(index);

        if (isIdentifierStart(ch)) {
            token = scanIdentifier();
            if (strict && isStrictModeReservedWord(token.value)) {
                token.type = Token.Keyword;
            }
            return token;
        }

        // Very common: ( and ) and ;
        if (ch === 0x28 || ch === 0x29 || ch === 0x3B) {
            return scanPunctuator();
        }

        // String literal starts with single quote (U+0027) or double quote (U+0022).
        if (ch === 0x27 || ch === 0x22) {
            return scanStringLiteral();
        }

        // Dot (.) U+002E can also start a floating-point number, hence the need
        // to check the next character.
        if (ch === 0x2E) {
            if (isDecimalDigit(source.charCodeAt(index + 1))) {
                return scanNumericLiteral();
            }
            return scanPunctuator();
        }

        if (isDecimalDigit(ch)) {
            return scanNumericLiteral();
        }

        // Slash (/) U+002F can also start a regex.
        if (extra.tokenize && ch === 0x2F) {
            return advanceSlash();
        }

        // Template literals start with ` (U+0060) for template head
        // or } (U+007D) for template middle or template tail.
        if (ch === 0x60 || (ch === 0x7D && state.curlyStack[state.curlyStack.length - 1] === '${')) {
            return scanTemplate();
        }

        return scanPunctuator();
    }

    function collectToken() {
        var loc, token, value, entry;

        loc = {
            start: {
                line: lineNumber,
                column: index - lineStart
            }
        };

        token = advance();
        loc.end = {
            line: lineNumber,
            column: index - lineStart
        };

        if (token.type !== Token.EOF) {
            value = source.slice(token.start, token.end);
            entry = {
                type: TokenName[token.type],
                value: value,
                range: [token.start, token.end],
                loc: loc
            };
            if (token.regex) {
                entry.regex = {
                    pattern: token.regex.pattern,
                    flags: token.regex.flags
                };
            }
            extra.tokens.push(entry);
        }

        return token;
    }

    function lex() {
        var token;
        scanning = true;

        lastIndex = index;
        lastLineNumber = lineNumber;
        lastLineStart = lineStart;

        skipComment();

        token = lookahead;

        startIndex = index;
        startLineNumber = lineNumber;
        startLineStart = lineStart;

        lookahead = (typeof extra.tokens !== 'undefined') ? collectToken() : advance();
        scanning = false;
        return token;
    }

    function peek() {
        scanning = true;

        skipComment();

        lastIndex = index;
        lastLineNumber = lineNumber;
        lastLineStart = lineStart;

        startIndex = index;
        startLineNumber = lineNumber;
        startLineStart = lineStart;

        lookahead = (typeof extra.tokens !== 'undefined') ? collectToken() : advance();
        scanning = false;
    }

    function Position() {
        this.line = startLineNumber;
        this.column = startIndex - startLineStart;
    }

    function SourceLocation() {
        this.start = new Position();
        this.end = null;
    }

    function WrappingSourceLocation(startToken) {
        this.start = {
            line: startToken.lineNumber,
            column: startToken.start - startToken.lineStart
        };
        this.end = null;
    }

    function Node() {
        if (extra.range) {
            this.range = [startIndex, 0];
        }
        if (extra.loc) {
            this.loc = new SourceLocation();
        }
    }

    function WrappingNode(startToken) {
        if (extra.range) {
            this.range = [startToken.start, 0];
        }
        if (extra.loc) {
            this.loc = new WrappingSourceLocation(startToken);
        }
    }

    WrappingNode.prototype = Node.prototype = {

        processComment: function () {
            var lastChild,
                leadingComments,
                trailingComments,
                bottomRight = extra.bottomRightStack,
                i,
                comment,
                last = bottomRight[bottomRight.length - 1];

            if (this.type === Syntax.Program) {
                if (this.body.length > 0) {
                    return;
                }
            }

            if (extra.trailingComments.length > 0) {
                trailingComments = [];
                for (i = extra.trailingComments.length - 1; i >= 0; --i) {
                    comment = extra.trailingComments[i];
                    if (comment.range[0] >= this.range[1]) {
                        trailingComments.unshift(comment);
                        extra.trailingComments.splice(i, 1);
                    }
                }
                extra.trailingComments = [];
            } else {
                if (last && last.trailingComments && last.trailingComments[0].range[0] >= this.range[1]) {
                    trailingComments = last.trailingComments;
                    delete last.trailingComments;
                }
            }

            // Eating the stack.
            if (last) {
                while (last && last.range[0] >= this.range[0]) {
                    lastChild = last;
                    last = bottomRight.pop();
                }
            }

            if (lastChild) {
                if (lastChild.leadingComments && lastChild.leadingComments[lastChild.leadingComments.length - 1].range[1] <= this.range[0]) {
                    this.leadingComments = lastChild.leadingComments;
                    lastChild.leadingComments = undefined;
                }
            } else if (extra.leadingComments.length > 0) {
                leadingComments = [];
                for (i = extra.leadingComments.length - 1; i >= 0; --i) {
                    comment = extra.leadingComments[i];
                    if (comment.range[1] <= this.range[0]) {
                        leadingComments.unshift(comment);
                        extra.leadingComments.splice(i, 1);
                    }
                }
            }


            if (leadingComments && leadingComments.length > 0) {
                this.leadingComments = leadingComments;
            }
            if (trailingComments && trailingComments.length > 0) {
                this.trailingComments = trailingComments;
            }

            bottomRight.push(this);
        },

        finish: function () {
            if (extra.range) {
                this.range[1] = lastIndex;
            }
            if (extra.loc) {
                this.loc.end = {
                    line: lastLineNumber,
                    column: lastIndex - lastLineStart
                };
                if (extra.source) {
                    this.loc.source = extra.source;
                }
            }

            if (extra.attachComment) {
                this.processComment();
            }
        },

        finishArrayExpression: function (elements) {
            this.type = Syntax.ArrayExpression;
            this.elements = elements;
            this.finish();
            return this;
        },

        finishArrayPattern: function (elements) {
            this.type = Syntax.ArrayPattern;
            this.elements = elements;
            this.finish();
            return this;
        },

        finishArrowFunctionExpression: function (params, defaults, body, expression) {
            this.type = Syntax.ArrowFunctionExpression;
            this.id = null;
            this.params = params;
            this.defaults = defaults;
            this.body = body;
            this.generator = false;
            this.expression = expression;
            this.finish();
            return this;
        },

        finishAssignmentExpression: function (operator, left, right) {
            this.type = Syntax.AssignmentExpression;
            this.operator = operator;
            this.left = left;
            this.right = right;
            this.finish();
            return this;
        },

        finishAssignmentPattern: function (left, right) {
            this.type = Syntax.AssignmentPattern;
            this.left = left;
            this.right = right;
            this.finish();
            return this;
        },

        finishBinaryExpression: function (operator, left, right) {
            this.type = (operator === '||' || operator === '&&') ? Syntax.LogicalExpression : Syntax.BinaryExpression;
            this.operator = operator;
            this.left = left;
            this.right = right;
            this.finish();
            return this;
        },

        finishBlockStatement: function (body) {
            this.type = Syntax.BlockStatement;
            this.body = body;
            this.finish();
            return this;
        },

        finishBreakStatement: function (label) {
            this.type = Syntax.BreakStatement;
            this.label = label;
            this.finish();
            return this;
        },

        finishCallExpression: function (callee, args) {
            this.type = Syntax.CallExpression;
            this.callee = callee;
            this.arguments = args;
            this.finish();
            return this;
        },

        finishCatchClause: function (param, body) {
            this.type = Syntax.CatchClause;
            this.param = param;
            this.body = body;
            this.finish();
            return this;
        },

        finishClassBody: function (body) {
            this.type = Syntax.ClassBody;
            this.body = body;
            this.finish();
            return this;
        },

        finishClassDeclaration: function (id, superClass, body) {
            this.type = Syntax.ClassDeclaration;
            this.id = id;
            this.superClass = superClass;
            this.body = body;
            this.finish();
            return this;
        },

        finishClassExpression: function (id, superClass, body) {
            this.type = Syntax.ClassExpression;
            this.id = id;
            this.superClass = superClass;
            this.body = body;
            this.finish();
            return this;
        },

        finishConditionalExpression: function (test, consequent, alternate) {
            this.type = Syntax.ConditionalExpression;
            this.test = test;
            this.consequent = consequent;
            this.alternate = alternate;
            this.finish();
            return this;
        },

        finishContinueStatement: function (label) {
            this.type = Syntax.ContinueStatement;
            this.label = label;
            this.finish();
            return this;
        },

        finishDebuggerStatement: function () {
            this.type = Syntax.DebuggerStatement;
            this.finish();
            return this;
        },

        finishDoWhileStatement: function (body, test) {
            this.type = Syntax.DoWhileStatement;
            this.body = body;
            this.test = test;
            this.finish();
            return this;
        },

        finishEmptyStatement: function () {
            this.type = Syntax.EmptyStatement;
            this.finish();
            return this;
        },

        finishExpressionStatement: function (expression) {
            this.type = Syntax.ExpressionStatement;
            this.expression = expression;
            this.finish();
            return this;
        },

        finishForStatement: function (init, test, update, body) {
            this.type = Syntax.ForStatement;
            this.init = init;
            this.test = test;
            this.update = update;
            this.body = body;
            this.finish();
            return this;
        },

        finishForInStatement: function (left, right, body) {
            this.type = Syntax.ForInStatement;
            this.left = left;
            this.right = right;
            this.body = body;
            this.each = false;
            this.finish();
            return this;
        },

        finishFunctionDeclaration: function (id, params, defaults, body) {
            this.type = Syntax.FunctionDeclaration;
            this.id = id;
            this.params = params;
            this.defaults = defaults;
            this.body = body;
            this.generator = false;
            this.expression = false;
            this.finish();
            return this;
        },

        finishFunctionExpression: function (id, params, defaults, body) {
            this.type = Syntax.FunctionExpression;
            this.id = id;
            this.params = params;
            this.defaults = defaults;
            this.body = body;
            this.generator = false;
            this.expression = false;
            this.finish();
            return this;
        },

        finishIdentifier: function (name) {
            this.type = Syntax.Identifier;
            this.name = name;
            this.finish();
            return this;
        },

        finishIfStatement: function (test, consequent, alternate) {
            this.type = Syntax.IfStatement;
            this.test = test;
            this.consequent = consequent;
            this.alternate = alternate;
            this.finish();
            return this;
        },

        finishLabeledStatement: function (label, body) {
            this.type = Syntax.LabeledStatement;
            this.label = label;
            this.body = body;
            this.finish();
            return this;
        },

        finishLiteral: function (token) {
            this.type = Syntax.Literal;
            this.value = token.value;
            this.raw = source.slice(token.start, token.end);
            if (token.regex) {
                this.regex = token.regex;
            }
            this.finish();
            return this;
        },

        finishMemberExpression: function (accessor, object, property) {
            this.type = Syntax.MemberExpression;
            this.computed = accessor === '[';
            this.object = object;
            this.property = property;
            this.finish();
            return this;
        },

        finishNewExpression: function (callee, args) {
            this.type = Syntax.NewExpression;
            this.callee = callee;
            this.arguments = args;
            this.finish();
            return this;
        },

        finishObjectExpression: function (properties) {
            this.type = Syntax.ObjectExpression;
            this.properties = properties;
            this.finish();
            return this;
        },

        finishObjectPattern: function (properties) {
            this.type = Syntax.ObjectPattern;
            this.properties = properties;
            this.finish();
            return this;
        },

        finishPostfixExpression: function (operator, argument) {
            this.type = Syntax.UpdateExpression;
            this.operator = operator;
            this.argument = argument;
            this.prefix = false;
            this.finish();
            return this;
        },

        finishProgram: function (body) {
            this.type = Syntax.Program;
            this.body = body;
            if (sourceType === 'module') {
                // very restrictive for now
                this.sourceType = sourceType;
            }
            this.finish();
            return this;
        },

        finishProperty: function (kind, key, computed, value, method, shorthand) {
            this.type = Syntax.Property;
            this.key = key;
            this.computed = computed;
            this.value = value;
            this.kind = kind;
            this.method = method;
            this.shorthand = shorthand;
            this.finish();
            return this;
        },

        finishRestElement: function (argument) {
            this.type = Syntax.RestElement;
            this.argument = argument;
            this.finish();
            return this;
        },

        finishReturnStatement: function (argument) {
            this.type = Syntax.ReturnStatement;
            this.argument = argument;
            this.finish();
            return this;
        },

        finishSequenceExpression: function (expressions) {
            this.type = Syntax.SequenceExpression;
            this.expressions = expressions;
            this.finish();
            return this;
        },

        finishSpreadElement: function (argument) {
            this.type = Syntax.SpreadElement;
            this.argument = argument;
            this.finish();
            return this;
        },

        finishSwitchCase: function (test, consequent) {
            this.type = Syntax.SwitchCase;
            this.test = test;
            this.consequent = consequent;
            this.finish();
            return this;
        },

        finishSuper: function () {
            this.type = Syntax.Super;
            this.finish();
            return this;
        },

        finishSwitchStatement: function (discriminant, cases) {
            this.type = Syntax.SwitchStatement;
            this.discriminant = discriminant;
            this.cases = cases;
            this.finish();
            return this;
        },

        finishTaggedTemplateExpression: function (tag, quasi) {
            this.type = Syntax.TaggedTemplateExpression;
            this.tag = tag;
            this.quasi = quasi;
            this.finish();
            return this;
        },

        finishTemplateElement: function (value, tail) {
            this.type = Syntax.TemplateElement;
            this.value = value;
            this.tail = tail;
            this.finish();
            return this;
        },

        finishTemplateLiteral: function (quasis, expressions) {
            this.type = Syntax.TemplateLiteral;
            this.quasis = quasis;
            this.expressions = expressions;
            this.finish();
            return this;
        },

        finishThisExpression: function () {
            this.type = Syntax.ThisExpression;
            this.finish();
            return this;
        },

        finishThrowStatement: function (argument) {
            this.type = Syntax.ThrowStatement;
            this.argument = argument;
            this.finish();
            return this;
        },

        finishTryStatement: function (block, handler, finalizer) {
            this.type = Syntax.TryStatement;
            this.block = block;
            this.guardedHandlers = [];
            this.handlers = handler ? [ handler ] : [];
            this.handler = handler;
            this.finalizer = finalizer;
            this.finish();
            return this;
        },

        finishUnaryExpression: function (operator, argument) {
            this.type = (operator === '++' || operator === '--') ? Syntax.UpdateExpression : Syntax.UnaryExpression;
            this.operator = operator;
            this.argument = argument;
            this.prefix = true;
            this.finish();
            return this;
        },

        finishVariableDeclaration: function (declarations) {
            this.type = Syntax.VariableDeclaration;
            this.declarations = declarations;
            this.kind = 'var';
            this.finish();
            return this;
        },

        finishLexicalDeclaration: function (declarations, kind) {
            this.type = Syntax.VariableDeclaration;
            this.declarations = declarations;
            this.kind = kind;
            this.finish();
            return this;
        },

        finishVariableDeclarator: function (id, init) {
            this.type = Syntax.VariableDeclarator;
            this.id = id;
            this.init = init;
            this.finish();
            return this;
        },

        finishWhileStatement: function (test, body) {
            this.type = Syntax.WhileStatement;
            this.test = test;
            this.body = body;
            this.finish();
            return this;
        },

        finishWithStatement: function (object, body) {
            this.type = Syntax.WithStatement;
            this.object = object;
            this.body = body;
            this.finish();
            return this;
        },

        finishExportSpecifier: function (local, exported) {
            this.type = Syntax.ExportSpecifier;
            this.exported = exported || local;
            this.local = local;
            this.finish();
            return this;
        },

        finishImportDefaultSpecifier: function (local) {
            this.type = Syntax.ImportDefaultSpecifier;
            this.local = local;
            this.finish();
            return this;
        },

        finishImportNamespaceSpecifier: function (local) {
            this.type = Syntax.ImportNamespaceSpecifier;
            this.local = local;
            this.finish();
            return this;
        },

        finishExportNamedDeclaration: function (declaration, specifiers, src) {
            this.type = Syntax.ExportNamedDeclaration;
            this.declaration = declaration;
            this.specifiers = specifiers;
            this.source = src;
            this.finish();
            return this;
        },

        finishExportDefaultDeclaration: function (declaration) {
            this.type = Syntax.ExportDefaultDeclaration;
            this.declaration = declaration;
            this.finish();
            return this;
        },

        finishExportAllDeclaration: function (src) {
            this.type = Syntax.ExportAllDeclaration;
            this.source = src;
            this.finish();
            return this;
        },

        finishImportSpecifier: function (local, imported) {
            this.type = Syntax.ImportSpecifier;
            this.local = local || imported;
            this.imported = imported;
            this.finish();
            return this;
        },

        finishImportDeclaration: function (specifiers, src) {
            this.type = Syntax.ImportDeclaration;
            this.specifiers = specifiers;
            this.source = src;
            this.finish();
            return this;
        }
    };


    function recordError(error) {
        var e, existing;

        for (e = 0; e < extra.errors.length; e++) {
            existing = extra.errors[e];
            // Prevent duplicated error.
            /* istanbul ignore next */
            if (existing.index === error.index && existing.message === error.message) {
                return;
            }
        }

        extra.errors.push(error);
    }

    function createError(line, pos, description) {
        var error = new Error('Line ' + line + ': ' + description);
        error.index = pos;
        error.lineNumber = line;
        error.column = pos - (scanning ? lineStart : lastLineStart) + 1;
        error.description = description;
        return error;
    }

    // Throw an exception

    function throwError(messageFormat) {
        var args, msg;

        args = Array.prototype.slice.call(arguments, 1);
        msg = messageFormat.replace(/%(\d)/g,
            function (whole, idx) {
                assert(idx < args.length, 'Message reference must be in range');
                return args[idx];
            }
        );

        throw createError(lastLineNumber, lastIndex, msg);
    }

    function tolerateError(messageFormat) {
        var args, msg, error;

        args = Array.prototype.slice.call(arguments, 1);
        /* istanbul ignore next */
        msg = messageFormat.replace(/%(\d)/g,
            function (whole, idx) {
                assert(idx < args.length, 'Message reference must be in range');
                return args[idx];
            }
        );

        error = createError(lineNumber, lastIndex, msg);
        if (extra.errors) {
            recordError(error);
        } else {
            throw error;
        }
    }

    // Throw an exception because of the token.

    function unexpectedTokenError(token, message) {
        var value, msg = message || Messages.UnexpectedToken;

        if (token) {
            if (!message) {
                msg = (token.type === Token.EOF) ? Messages.UnexpectedEOS :
                    (token.type === Token.Identifier) ? Messages.UnexpectedIdentifier :
                    (token.type === Token.NumericLiteral) ? Messages.UnexpectedNumber :
                    (token.type === Token.StringLiteral) ? Messages.UnexpectedString :
                    (token.type === Token.Template) ? Messages.UnexpectedTemplate :
                    Messages.UnexpectedToken;

                if (token.type === Token.Keyword) {
                    if (isFutureReservedWord(token.value)) {
                        msg = Messages.UnexpectedReserved;
                    } else if (strict && isStrictModeReservedWord(token.value)) {
                        msg = Messages.StrictReservedWord;
                    }
                }
            }

            value = (token.type === Token.Template) ? token.value.raw : token.value;
        } else {
            value = 'ILLEGAL';
        }

        msg = msg.replace('%0', value);

        return (token && typeof token.lineNumber === 'number') ?
            createError(token.lineNumber, token.start, msg) :
            createError(scanning ? lineNumber : lastLineNumber, scanning ? index : lastIndex, msg);
    }

    function throwUnexpectedToken(token, message) {
        throw unexpectedTokenError(token, message);
    }

    function tolerateUnexpectedToken(token, message) {
        var error = unexpectedTokenError(token, message);
        if (extra.errors) {
            recordError(error);
        } else {
            throw error;
        }
    }

    // Expect the next token to match the specified punctuator.
    // If not, an exception will be thrown.

    function expect(value) {
        var token = lex();
        if (token.type !== Token.Punctuator || token.value !== value) {
            throwUnexpectedToken(token);
        }
    }

    /**
     * @name expectCommaSeparator
     * @description Quietly expect a comma when in tolerant mode, otherwise delegates
     * to <code>expect(value)</code>
     * @since 2.0
     */
    function expectCommaSeparator() {
        var token;

        if (extra.errors) {
            token = lookahead;
            if (token.type === Token.Punctuator && token.value === ',') {
                lex();
            } else if (token.type === Token.Punctuator && token.value === ';') {
                lex();
                tolerateUnexpectedToken(token);
            } else {
                tolerateUnexpectedToken(token, Messages.UnexpectedToken);
            }
        } else {
            expect(',');
        }
    }

    // Expect the next token to match the specified keyword.
    // If not, an exception will be thrown.

    function expectKeyword(keyword) {
        var token = lex();
        if (token.type !== Token.Keyword || token.value !== keyword) {
            throwUnexpectedToken(token);
        }
    }

    // Return true if the next token matches the specified punctuator.

    function match(value) {
        return lookahead.type === Token.Punctuator && lookahead.value === value;
    }

    // Return true if the next token matches the specified keyword

    function matchKeyword(keyword) {
        return lookahead.type === Token.Keyword && lookahead.value === keyword;
    }

    // Return true if the next token matches the specified contextual keyword
    // (where an identifier is sometimes a keyword depending on the context)

    function matchContextualKeyword(keyword) {
        return lookahead.type === Token.Identifier && lookahead.value === keyword;
    }

    // Return true if the next token is an assignment operator

    function matchAssign() {
        var op;

        if (lookahead.type !== Token.Punctuator) {
            return false;
        }
        op = lookahead.value;
        return op === '=' ||
            op === '*=' ||
            op === '/=' ||
            op === '%=' ||
            op === '+=' ||
            op === '-=' ||
            op === '<<=' ||
            op === '>>=' ||
            op === '>>>=' ||
            op === '&=' ||
            op === '^=' ||
            op === '|=';
    }

    function consumeSemicolon() {
        // Catch the very common case first: immediately a semicolon (U+003B).
        if (source.charCodeAt(startIndex) === 0x3B || match(';')) {
            lex();
            return;
        }

        if (hasLineTerminator) {
            return;
        }

        // FIXME(ikarienator): this is seemingly an issue in the previous location info convention.
        lastIndex = startIndex;
        lastLineNumber = startLineNumber;
        lastLineStart = startLineStart;

        if (lookahead.type !== Token.EOF && !match('}')) {
            throwUnexpectedToken(lookahead);
        }
    }

    // Cover grammar support.
    //
    // When an assignment expression position starts with an left parenthesis, the determination of the type
    // of the syntax is to be deferred arbitrarily long until the end of the parentheses pair (plus a lookahead)
    // or the first comma. This situation also defers the determination of all the expressions nested in the pair.
    //
    // There are three productions that can be parsed in a parentheses pair that needs to be determined
    // after the outermost pair is closed. They are:
    //
    //   1. AssignmentExpression
    //   2. BindingElements
    //   3. AssignmentTargets
    //
    // In order to avoid exponential backtracking, we use two flags to denote if the production can be
    // binding element or assignment target.
    //
    // The three productions have the relationship:
    //
    //   BindingElements ⊆ AssignmentTargets ⊆ AssignmentExpression
    //
    // with a single exception that CoverInitializedName when used directly in an Expression, generates
    // an early error. Therefore, we need the third state, firstCoverInitializedNameError, to track the
    // first usage of CoverInitializedName and report it when we reached the end of the parentheses pair.
    //
    // isolateCoverGrammar function runs the given parser function with a new cover grammar context, and it does not
    // effect the current flags. This means the production the parser parses is only used as an expression. Therefore
    // the CoverInitializedName check is conducted.
    //
    // inheritCoverGrammar function runs the given parse function with a new cover grammar context, and it propagates
    // the flags outside of the parser. This means the production the parser parses is used as a part of a potential
    // pattern. The CoverInitializedName check is deferred.
    function isolateCoverGrammar(parser) {
        var oldIsBindingElement = isBindingElement,
            oldIsAssignmentTarget = isAssignmentTarget,
            oldFirstCoverInitializedNameError = firstCoverInitializedNameError,
            result;
        isBindingElement = true;
        isAssignmentTarget = true;
        firstCoverInitializedNameError = null;
        result = parser();
        if (firstCoverInitializedNameError !== null) {
            throwUnexpectedToken(firstCoverInitializedNameError);
        }
        isBindingElement = oldIsBindingElement;
        isAssignmentTarget = oldIsAssignmentTarget;
        firstCoverInitializedNameError = oldFirstCoverInitializedNameError;
        return result;
    }

    function inheritCoverGrammar(parser) {
        var oldIsBindingElement = isBindingElement,
            oldIsAssignmentTarget = isAssignmentTarget,
            oldFirstCoverInitializedNameError = firstCoverInitializedNameError,
            result;
        isBindingElement = true;
        isAssignmentTarget = true;
        firstCoverInitializedNameError = null;
        result = parser();
        isBindingElement = isBindingElement && oldIsBindingElement;
        isAssignmentTarget = isAssignmentTarget && oldIsAssignmentTarget;
        firstCoverInitializedNameError = oldFirstCoverInitializedNameError || firstCoverInitializedNameError;
        return result;
    }

    function parseArrayPattern() {
        var node = new Node(), elements = [], rest, restNode;
        expect('[');

        while (!match(']')) {
            if (match(',')) {
                lex();
                elements.push(null);
            } else {
                if (match('...')) {
                    restNode = new Node();
                    lex();
                    rest = parseVariableIdentifier();
                    elements.push(restNode.finishRestElement(rest));
                    break;
                } else {
                    elements.push(parsePatternWithDefault());
                }
                if (!match(']')) {
                    expect(',');
                }
            }

        }

        expect(']');

        return node.finishArrayPattern(elements);
    }

    function parsePropertyPattern() {
        var node = new Node(), key, computed = match('['), init;
        if (lookahead.type === Token.Identifier) {
            key = parseVariableIdentifier();
            if (match('=')) {
                lex();
                init = parseAssignmentExpression();
                return node.finishProperty(
                    'init', key, false,
                    new WrappingNode(key).finishAssignmentPattern(key, init), false, false);
            } else if (!match(':')) {
                return node.finishProperty('init', key, false, key, false, true);
            }
        } else {
            key = parseObjectPropertyKey();
        }
        expect(':');
        init = parsePatternWithDefault();
        return node.finishProperty('init', key, computed, init, false, false);
    }

    function parseObjectPattern() {
        var node = new Node(), properties = [];

        expect('{');

        while (!match('}')) {
            properties.push(parsePropertyPattern());
            if (!match('}')) {
                expect(',');
            }
        }

        lex();

        return node.finishObjectPattern(properties);
    }

    function parsePattern() {
        if (lookahead.type === Token.Identifier) {
            return parseVariableIdentifier();
        } else if (match('[')) {
            return parseArrayPattern();
        } else if (match('{')) {
            return parseObjectPattern();
        }
        throwUnexpectedToken(lookahead);
    }

    function parsePatternWithDefault() {
        var startToken = lookahead, pattern, right;
        pattern = parsePattern();
        if (match('=')) {
            lex();
            right = isolateCoverGrammar(parseAssignmentExpression);
            pattern = new WrappingNode(startToken).finishAssignmentPattern(pattern, right);
        }
        return pattern;
    }

    // 11.1.4 Array Initialiser

    function parseArrayInitialiser() {
        var elements = [], node = new Node(), restSpread;

        expect('[');

        while (!match(']')) {
            if (match(',')) {
                lex();
                elements.push(null);
            } else if (match('...')) {
                restSpread = new Node();
                lex();
                restSpread.finishSpreadElement(inheritCoverGrammar(parseAssignmentExpression));

                if (!match(']')) {
                    isAssignmentTarget = isBindingElement = false;
                    expect(',');
                }
                elements.push(restSpread);
            } else {
                elements.push(inheritCoverGrammar(parseAssignmentExpression));

                if (!match(']')) {
                    expect(',');
                }
            }
        }

        lex();

        return node.finishArrayExpression(elements);
    }

    // 11.1.5 Object Initialiser

    function parsePropertyFunction(node, paramInfo) {
        var previousStrict, body;

        isAssignmentTarget = isBindingElement = false;

        previousStrict = strict;
        body = isolateCoverGrammar(parseFunctionSourceElements);

        if (strict && paramInfo.firstRestricted) {
            tolerateUnexpectedToken(paramInfo.firstRestricted, paramInfo.message);
        }
        if (strict && paramInfo.stricted) {
            tolerateUnexpectedToken(paramInfo.stricted, paramInfo.message);
        }

        strict = previousStrict;
        return node.finishFunctionExpression(null, paramInfo.params, paramInfo.defaults, body);
    }

    function parsePropertyMethodFunction() {
        var params, method, node = new Node();

        params = parseParams();
        method = parsePropertyFunction(node, params);

        return method;
    }

    function parseObjectPropertyKey() {
        var token, node = new Node(), expr;

        token = lex();

        // Note: This function is called only from parseObjectProperty(), where
        // EOF and Punctuator tokens are already filtered out.

        switch (token.type) {
        case Token.StringLiteral:
        case Token.NumericLiteral:
            if (strict && token.octal) {
                tolerateUnexpectedToken(token, Messages.StrictOctalLiteral);
            }
            return node.finishLiteral(token);
        case Token.Identifier:
        case Token.BooleanLiteral:
        case Token.NullLiteral:
        case Token.Keyword:
            return node.finishIdentifier(token.value);
        case Token.Punctuator:
            if (token.value === '[') {
                expr = isolateCoverGrammar(parseAssignmentExpression);
                expect(']');
                return expr;
            }
            break;
        }
        throwUnexpectedToken(token);
    }

    function lookaheadPropertyName() {
        switch (lookahead.type) {
        case Token.Identifier:
        case Token.StringLiteral:
        case Token.BooleanLiteral:
        case Token.NullLiteral:
        case Token.NumericLiteral:
        case Token.Keyword:
            return true;
        case Token.Punctuator:
            return lookahead.value === '[';
        }
        return false;
    }

    // This function is to try to parse a MethodDefinition as defined in 14.3. But in the case of object literals,
    // it might be called at a position where there is in fact a short hand identifier pattern or a data property.
    // This can only be determined after we consumed up to the left parentheses.
    //
    // In order to avoid back tracking, it returns `null` if the position is not a MethodDefinition and the caller
    // is responsible to visit other options.
    function tryParseMethodDefinition(token, key, computed, node) {
        var value, options, methodNode;

        if (token.type === Token.Identifier) {
            // check for `get` and `set`;

            if (token.value === 'get' && lookaheadPropertyName()) {
                computed = match('[');
                key = parseObjectPropertyKey();
                methodNode = new Node();
                expect('(');
                expect(')');
                value = parsePropertyFunction(methodNode, {
                    params: [],
                    defaults: [],
                    stricted: null,
                    firstRestricted: null,
                    message: null
                });
                return node.finishProperty('get', key, computed, value, false, false);
            } else if (token.value === 'set' && lookaheadPropertyName()) {
                computed = match('[');
                key = parseObjectPropertyKey();
                methodNode = new Node();
                expect('(');

                options = {
                    params: [],
                    defaultCount: 0,
                    defaults: [],
                    firstRestricted: null,
                    paramSet: {}
                };
                if (match(')')) {
                    tolerateUnexpectedToken(lookahead);
                } else {
                    parseParam(options);
                    if (options.defaultCount === 0) {
                        options.defaults = [];
                    }
                }
                expect(')');

                value = parsePropertyFunction(methodNode, options);
                return node.finishProperty('set', key, computed, value, false, false);
            }
        }

        if (match('(')) {
            value = parsePropertyMethodFunction();
            return node.finishProperty('init', key, computed, value, true, false);
        }

        // Not a MethodDefinition.
        return null;
    }

    function checkProto(key, computed, hasProto) {
        if (computed === false && (key.type === Syntax.Identifier && key.name === '__proto__' ||
            key.type === Syntax.Literal && key.value === '__proto__')) {
            if (hasProto.value) {
                tolerateError(Messages.DuplicateProtoProperty);
            } else {
                hasProto.value = true;
            }
        }
    }

    function parseObjectProperty(hasProto) {
        var token = lookahead, node = new Node(), computed, key, maybeMethod, value;

        computed = match('[');
        key = parseObjectPropertyKey();
        maybeMethod = tryParseMethodDefinition(token, key, computed, node);

        if (maybeMethod) {
            checkProto(maybeMethod.key, maybeMethod.computed, hasProto);
            // finished
            return maybeMethod;
        }

        // init property or short hand property.
        checkProto(key, computed, hasProto);

        if (match(':')) {
            lex();
            value = inheritCoverGrammar(parseAssignmentExpression);
            return node.finishProperty('init', key, computed, value, false, false);
        }

        if (token.type === Token.Identifier) {
            if (match('=')) {
                firstCoverInitializedNameError = lookahead;
                lex();
                value = isolateCoverGrammar(parseAssignmentExpression);
                return node.finishProperty('init', key, computed,
                    new WrappingNode(token).finishAssignmentPattern(key, value), false, true);
            }
            return node.finishProperty('init', key, computed, key, false, true);
        }

        throwUnexpectedToken(lookahead);
    }

    function parseObjectInitialiser() {
        var properties = [], hasProto = {value: false}, node = new Node();

        expect('{');

        while (!match('}')) {
            properties.push(parseObjectProperty(hasProto));

            if (!match('}')) {
                expectCommaSeparator();
            }
        }

        expect('}');

        return node.finishObjectExpression(properties);
    }

    function reinterpretExpressionAsPattern(expr) {
        var i;
        switch (expr.type) {
        case Syntax.Identifier:
        case Syntax.MemberExpression:
        case Syntax.RestElement:
        case Syntax.AssignmentPattern:
            break;
        case Syntax.SpreadElement:
            expr.type = Syntax.RestElement;
            reinterpretExpressionAsPattern(expr.argument);
            break;
        case Syntax.ArrayExpression:
            expr.type = Syntax.ArrayPattern;
            for (i = 0; i < expr.elements.length; i++) {
                if (expr.elements[i] !== null) {
                    reinterpretExpressionAsPattern(expr.elements[i]);
                }
            }
            break;
        case Syntax.ObjectExpression:
            expr.type = Syntax.ObjectPattern;
            for (i = 0; i < expr.properties.length; i++) {
                reinterpretExpressionAsPattern(expr.properties[i].value);
            }
            break;
        case Syntax.AssignmentExpression:
            expr.type = Syntax.AssignmentPattern;
            reinterpretExpressionAsPattern(expr.left);
            break;
        default:
            // Allow other node type for tolerant parsing.
            break;
        }
    }

    function parseTemplateElement(option) {
        var node, token;

        if (lookahead.type !== Token.Template || (option.head && !lookahead.head)) {
            throwUnexpectedToken();
        }

        node = new Node();
        token = lex();

        return node.finishTemplateElement({ raw: token.value.raw, cooked: token.value.cooked }, token.tail);
    }

    function parseTemplateLiteral() {
        var quasi, quasis, expressions, node = new Node();

        quasi = parseTemplateElement({ head: true });
        quasis = [ quasi ];
        expressions = [];

        while (!quasi.tail) {
            expressions.push(parseExpression());
            quasi = parseTemplateElement({ head: false });
            quasis.push(quasi);
        }

        return node.finishTemplateLiteral(quasis, expressions);
    }

    // 11.1.6 The Grouping Operator

    function parseGroupExpression() {
        var expr, expressions, startToken, i;

        expect('(');

        if (match(')')) {
            lex();
            if (!match('=>')) {
                expect('=>');
            }
            return {
                type: PlaceHolders.ArrowParameterPlaceHolder,
                params: []
            };
        }

        startToken = lookahead;
        if (match('...')) {
            expr = parseRestElement();
            expect(')');
            if (!match('=>')) {
                expect('=>');
            }
            return {
                type: PlaceHolders.ArrowParameterPlaceHolder,
                params: [expr]
            };
        }

        isBindingElement = true;
        expr = inheritCoverGrammar(parseAssignmentExpression);

        if (match(',')) {
            isAssignmentTarget = false;
            expressions = [expr];

            while (startIndex < length) {
                if (!match(',')) {
                    break;
                }
                lex();

                if (match('...')) {
                    if (!isBindingElement) {
                        throwUnexpectedToken(lookahead);
                    }
                    expressions.push(parseRestElement());
                    expect(')');
                    if (!match('=>')) {
                        expect('=>');
                    }
                    isBindingElement = false;
                    for (i = 0; i < expressions.length; i++) {
                        reinterpretExpressionAsPattern(expressions[i]);
                    }
                    return {
                        type: PlaceHolders.ArrowParameterPlaceHolder,
                        params: expressions
                    };
                }

                expressions.push(inheritCoverGrammar(parseAssignmentExpression));
            }

            expr = new WrappingNode(startToken).finishSequenceExpression(expressions);
        }


        expect(')');

        if (match('=>')) {
            if (!isBindingElement) {
                throwUnexpectedToken(lookahead);
            }

            if (expr.type === Syntax.SequenceExpression) {
                for (i = 0; i < expr.expressions.length; i++) {
                    reinterpretExpressionAsPattern(expr.expressions[i]);
                }
            } else {
                reinterpretExpressionAsPattern(expr);
            }

            expr = {
                type: PlaceHolders.ArrowParameterPlaceHolder,
                params: expr.type === Syntax.SequenceExpression ? expr.expressions : [expr]
            };
        }
        isBindingElement = false;
        return expr;
    }


    // 11.1 Primary Expressions

    function parsePrimaryExpression() {
        var type, token, expr, node;

        if (match('(')) {
            isBindingElement = false;
            return inheritCoverGrammar(parseGroupExpression);
        }

        if (match('[')) {
            return inheritCoverGrammar(parseArrayInitialiser);
        }

        if (match('{')) {
            return inheritCoverGrammar(parseObjectInitialiser);
        }

        type = lookahead.type;
        node = new Node();

        if (type === Token.Identifier) {
            expr = node.finishIdentifier(lex().value);
        } else if (type === Token.StringLiteral || type === Token.NumericLiteral) {
            isAssignmentTarget = isBindingElement = false;
            if (strict && lookahead.octal) {
                tolerateUnexpectedToken(lookahead, Messages.StrictOctalLiteral);
            }
            expr = node.finishLiteral(lex());
        } else if (type === Token.Keyword) {
            isAssignmentTarget = isBindingElement = false;
            if (matchKeyword('function')) {
                return parseFunctionExpression();
            }
            if (matchKeyword('this')) {
                lex();
                return node.finishThisExpression();
            }
            if (matchKeyword('class')) {
                return parseClassExpression();
            }
            throwUnexpectedToken(lex());
        } else if (type === Token.BooleanLiteral) {
            isAssignmentTarget = isBindingElement = false;
            token = lex();
            token.value = (token.value === 'true');
            expr = node.finishLiteral(token);
        } else if (type === Token.NullLiteral) {
            isAssignmentTarget = isBindingElement = false;
            token = lex();
            token.value = null;
            expr = node.finishLiteral(token);
        } else if (match('/') || match('/=')) {
            isAssignmentTarget = isBindingElement = false;
            index = startIndex;

            if (typeof extra.tokens !== 'undefined') {
                token = collectRegex();
            } else {
                token = scanRegExp();
            }
            lex();
            expr = node.finishLiteral(token);
        } else if (type === Token.Template) {
            expr = parseTemplateLiteral();
        } else {
            throwUnexpectedToken(lex());
        }

        return expr;
    }

    // 11.2 Left-Hand-Side Expressions

    function parseArguments() {
        var args = [];

        expect('(');

        if (!match(')')) {
            while (startIndex < length) {
                args.push(isolateCoverGrammar(parseAssignmentExpression));
                if (match(')')) {
                    break;
                }
                expectCommaSeparator();
            }
        }

        expect(')');

        return args;
    }

    function parseNonComputedProperty() {
        var token, node = new Node();

        token = lex();

        if (!isIdentifierName(token)) {
            throwUnexpectedToken(token);
        }

        return node.finishIdentifier(token.value);
    }

    function parseNonComputedMember() {
        expect('.');

        return parseNonComputedProperty();
    }

    function parseComputedMember() {
        var expr;

        expect('[');

        expr = isolateCoverGrammar(parseExpression);

        expect(']');

        return expr;
    }

    function parseNewExpression() {
        var callee, args, node = new Node();

        expectKeyword('new');
        callee = isolateCoverGrammar(parseLeftHandSideExpression);
        args = match('(') ? parseArguments() : [];

        isAssignmentTarget = isBindingElement = false;

        return node.finishNewExpression(callee, args);
    }

    function parseLeftHandSideExpressionAllowCall() {
        var quasi, expr, args, property, startToken, previousAllowIn = state.allowIn;

        startToken = lookahead;
        state.allowIn = true;

        if (matchKeyword('super') && state.inFunctionBody) {
            expr = new Node();
            lex();
            expr = expr.finishSuper();
            if (!match('(') && !match('.') && !match('[')) {
                throwUnexpectedToken(lookahead);
            }
        } else {
            expr = inheritCoverGrammar(matchKeyword('new') ? parseNewExpression : parsePrimaryExpression);
        }

        for (;;) {
            if (match('.')) {
                isBindingElement = false;
                isAssignmentTarget = true;
                property = parseNonComputedMember();
                expr = new WrappingNode(startToken).finishMemberExpression('.', expr, property);
            } else if (match('(')) {
                isBindingElement = false;
                isAssignmentTarget = false;
                args = parseArguments();
                expr = new WrappingNode(startToken).finishCallExpression(expr, args);
            } else if (match('[')) {
                isBindingElement = false;
                isAssignmentTarget = true;
                property = parseComputedMember();
                expr = new WrappingNode(startToken).finishMemberExpression('[', expr, property);
            } else if (lookahead.type === Token.Template && lookahead.head) {
                quasi = parseTemplateLiteral();
                expr = new WrappingNode(startToken).finishTaggedTemplateExpression(expr, quasi);
            } else {
                break;
            }
        }
        state.allowIn = previousAllowIn;

        return expr;
    }

    function parseLeftHandSideExpression() {
        var quasi, expr, property, startToken;
        assert(state.allowIn, 'callee of new expression always allow in keyword.');

        startToken = lookahead;

        if (matchKeyword('super') && state.inFunctionBody) {
            expr = new Node();
            lex();
            expr = expr.finishSuper();
            if (!match('[') && !match('.')) {
                throwUnexpectedToken(lookahead);
            }
        } else {
            expr = inheritCoverGrammar(matchKeyword('new') ? parseNewExpression : parsePrimaryExpression);
        }

        for (;;) {
            if (match('[')) {
                isBindingElement = false;
                isAssignmentTarget = true;
                property = parseComputedMember();
                expr = new WrappingNode(startToken).finishMemberExpression('[', expr, property);
            } else if (match('.')) {
                isBindingElement = false;
                isAssignmentTarget = true;
                property = parseNonComputedMember();
                expr = new WrappingNode(startToken).finishMemberExpression('.', expr, property);
            } else if (lookahead.type === Token.Template && lookahead.head) {
                quasi = parseTemplateLiteral();
                expr = new WrappingNode(startToken).finishTaggedTemplateExpression(expr, quasi);
            } else {
                break;
            }
        }
        return expr;
    }

    // 11.3 Postfix Expressions

    function parsePostfixExpression() {
        var expr, token, startToken = lookahead;

        expr = inheritCoverGrammar(parseLeftHandSideExpressionAllowCall);

        if (!hasLineTerminator && lookahead.type === Token.Punctuator) {
            if (match('++') || match('--')) {
                // 11.3.1, 11.3.2
                if (strict && expr.type === Syntax.Identifier && isRestrictedWord(expr.name)) {
                    tolerateError(Messages.StrictLHSPostfix);
                }

                if (!isAssignmentTarget) {
                    tolerateError(Messages.InvalidLHSInAssignment);
                }

                isAssignmentTarget = isBindingElement = false;

                token = lex();
                expr = new WrappingNode(startToken).finishPostfixExpression(token.value, expr);
            }
        }

        return expr;
    }

    // 11.4 Unary Operators

    function parseUnaryExpression() {
        var token, expr, startToken;

        if (lookahead.type !== Token.Punctuator && lookahead.type !== Token.Keyword) {
            expr = parsePostfixExpression();
        } else if (match('++') || match('--')) {
            startToken = lookahead;
            token = lex();
            expr = inheritCoverGrammar(parseUnaryExpression);
            // 11.4.4, 11.4.5
            if (strict && expr.type === Syntax.Identifier && isRestrictedWord(expr.name)) {
                tolerateError(Messages.StrictLHSPrefix);
            }

            if (!isAssignmentTarget) {
                tolerateError(Messages.InvalidLHSInAssignment);
            }
            expr = new WrappingNode(startToken).finishUnaryExpression(token.value, expr);
            isAssignmentTarget = isBindingElement = false;
        } else if (match('+') || match('-') || match('~') || match('!')) {
            startToken = lookahead;
            token = lex();
            expr = inheritCoverGrammar(parseUnaryExpression);
            expr = new WrappingNode(startToken).finishUnaryExpression(token.value, expr);
            isAssignmentTarget = isBindingElement = false;
        } else if (matchKeyword('delete') || matchKeyword('void') || matchKeyword('typeof')) {
            startToken = lookahead;
            token = lex();
            expr = inheritCoverGrammar(parseUnaryExpression);
            expr = new WrappingNode(startToken).finishUnaryExpression(token.value, expr);
            if (strict && expr.operator === 'delete' && expr.argument.type === Syntax.Identifier) {
                tolerateError(Messages.StrictDelete);
            }
            isAssignmentTarget = isBindingElement = false;
        } else {
            expr = parsePostfixExpression();
        }

        return expr;
    }

    function binaryPrecedence(token, allowIn) {
        var prec = 0;

        if (token.type !== Token.Punctuator && token.type !== Token.Keyword) {
            return 0;
        }

        switch (token.value) {
        case '||':
            prec = 1;
            break;

        case '&&':
            prec = 2;
            break;

        case '|':
            prec = 3;
            break;

        case '^':
            prec = 4;
            break;

        case '&':
            prec = 5;
            break;

        case '==':
        case '!=':
        case '===':
        case '!==':
            prec = 6;
            break;

        case '<':
        case '>':
        case '<=':
        case '>=':
        case 'instanceof':
            prec = 7;
            break;

        case 'in':
            prec = allowIn ? 7 : 0;
            break;

        case '<<':
        case '>>':
        case '>>>':
            prec = 8;
            break;

        case '+':
        case '-':
            prec = 9;
            break;

        case '*':
        case '/':
        case '%':
            prec = 11;
            break;

        default:
            break;
        }

        return prec;
    }

    // 11.5 Multiplicative Operators
    // 11.6 Additive Operators
    // 11.7 Bitwise Shift Operators
    // 11.8 Relational Operators
    // 11.9 Equality Operators
    // 11.10 Binary Bitwise Operators
    // 11.11 Binary Logical Operators

    function parseBinaryExpression() {
        var marker, markers, expr, token, prec, stack, right, operator, left, i;

        marker = lookahead;
        left = inheritCoverGrammar(parseUnaryExpression);

        token = lookahead;
        prec = binaryPrecedence(token, state.allowIn);
        if (prec === 0) {
            return left;
        }
        isAssignmentTarget = isBindingElement = false;
        token.prec = prec;
        lex();

        markers = [marker, lookahead];
        right = isolateCoverGrammar(parseUnaryExpression);

        stack = [left, token, right];

        while ((prec = binaryPrecedence(lookahead, state.allowIn)) > 0) {

            // Reduce: make a binary expression from the three topmost entries.
            while ((stack.length > 2) && (prec <= stack[stack.length - 2].prec)) {
                right = stack.pop();
                operator = stack.pop().value;
                left = stack.pop();
                markers.pop();
                expr = new WrappingNode(markers[markers.length - 1]).finishBinaryExpression(operator, left, right);
                stack.push(expr);
            }

            // Shift.
            token = lex();
            token.prec = prec;
            stack.push(token);
            markers.push(lookahead);
            expr = isolateCoverGrammar(parseUnaryExpression);
            stack.push(expr);
        }

        // Final reduce to clean-up the stack.
        i = stack.length - 1;
        expr = stack[i];
        markers.pop();
        while (i > 1) {
            expr = new WrappingNode(markers.pop()).finishBinaryExpression(stack[i - 1].value, stack[i - 2], expr);
            i -= 2;
        }

        return expr;
    }


    // 11.12 Conditional Operator

    function parseConditionalExpression() {
        var expr, previousAllowIn, consequent, alternate, startToken;

        startToken = lookahead;

        expr = inheritCoverGrammar(parseBinaryExpression);
        if (match('?')) {
            lex();
            previousAllowIn = state.allowIn;
            state.allowIn = true;
            consequent = isolateCoverGrammar(parseAssignmentExpression);
            state.allowIn = previousAllowIn;
            expect(':');
            alternate = isolateCoverGrammar(parseAssignmentExpression);

            expr = new WrappingNode(startToken).finishConditionalExpression(expr, consequent, alternate);
            isAssignmentTarget = isBindingElement = false;
        }

        return expr;
    }

    // [ES6] 14.2 Arrow Function

    function parseConciseBody() {
        if (match('{')) {
            return parseFunctionSourceElements();
        }
        return isolateCoverGrammar(parseAssignmentExpression);
    }

    function checkPatternParam(options, param) {
        var i;
        switch (param.type) {
        case Syntax.Identifier:
            validateParam(options, param, param.name);
            break;
        case Syntax.RestElement:
            checkPatternParam(options, param.argument);
            break;
        case Syntax.AssignmentPattern:
            checkPatternParam(options, param.left);
            break;
        case Syntax.ArrayPattern:
            for (i = 0; i < param.elements.length; i++) {
                if (param.elements[i] !== null) {
                    checkPatternParam(options, param.elements[i]);
                }
            }
            break;
        default:
            assert(param.type === Syntax.ObjectPattern, 'Invalid type');
            for (i = 0; i < param.properties.length; i++) {
                checkPatternParam(options, param.properties[i].value);
            }
            break;
        }
    }
    function reinterpretAsCoverFormalsList(expr) {
        var i, len, param, params, defaults, defaultCount, options, token;

        defaults = [];
        defaultCount = 0;
        params = [expr];

        switch (expr.type) {
        case Syntax.Identifier:
            break;
        case PlaceHolders.ArrowParameterPlaceHolder:
            params = expr.params;
            break;
        default:
            return null;
        }

        options = {
            paramSet: {}
        };

        for (i = 0, len = params.length; i < len; i += 1) {
            param = params[i];
            switch (param.type) {
            case Syntax.AssignmentPattern:
                params[i] = param.left;
                defaults.push(param.right);
                ++defaultCount;
                checkPatternParam(options, param.left);
                break;
            default:
                checkPatternParam(options, param);
                params[i] = param;
                defaults.push(null);
                break;
            }
        }

        if (options.message === Messages.StrictParamDupe) {
            token = strict ? options.stricted : options.firstRestricted;
            throwUnexpectedToken(token, options.message);
        }

        if (defaultCount === 0) {
            defaults = [];
        }

        return {
            params: params,
            defaults: defaults,
            stricted: options.stricted,
            firstRestricted: options.firstRestricted,
            message: options.message
        };
    }

    function parseArrowFunctionExpression(options, node) {
        var previousStrict, body;

        if (hasLineTerminator) {
            tolerateUnexpectedToken(lookahead);
        }
        expect('=>');
        previousStrict = strict;

        body = parseConciseBody();

        if (strict && options.firstRestricted) {
            throwUnexpectedToken(options.firstRestricted, options.message);
        }
        if (strict && options.stricted) {
            tolerateUnexpectedToken(options.stricted, options.message);
        }

        strict = previousStrict;

        return node.finishArrowFunctionExpression(options.params, options.defaults, body, body.type !== Syntax.BlockStatement);
    }

    // 11.13 Assignment Operators

    function parseAssignmentExpression() {
        var token, expr, right, list, startToken;

        startToken = lookahead;
        token = lookahead;

        expr = parseConditionalExpression();

        if (expr.type === PlaceHolders.ArrowParameterPlaceHolder || match('=>')) {
            isAssignmentTarget = isBindingElement = false;
            list = reinterpretAsCoverFormalsList(expr);

            if (list) {
                firstCoverInitializedNameError = null;
                return parseArrowFunctionExpression(list, new WrappingNode(startToken));
            }

            return expr;
        }

        if (matchAssign()) {
            if (!isAssignmentTarget) {
                tolerateError(Messages.InvalidLHSInAssignment);
            }

            // 11.13.1
            if (strict && expr.type === Syntax.Identifier && isRestrictedWord(expr.name)) {
                tolerateUnexpectedToken(token, Messages.StrictLHSAssignment);
            }

            if (!match('=')) {
                isAssignmentTarget = isBindingElement = false;
            } else {
                reinterpretExpressionAsPattern(expr);
            }

            token = lex();
            right = isolateCoverGrammar(parseAssignmentExpression);
            expr = new WrappingNode(startToken).finishAssignmentExpression(token.value, expr, right);
            firstCoverInitializedNameError = null;
        }

        return expr;
    }

    // 11.14 Comma Operator

    function parseExpression() {
        var expr, startToken = lookahead, expressions;

        expr = isolateCoverGrammar(parseAssignmentExpression);

        if (match(',')) {
            expressions = [expr];

            while (startIndex < length) {
                if (!match(',')) {
                    break;
                }
                lex();
                expressions.push(isolateCoverGrammar(parseAssignmentExpression));
            }

            expr = new WrappingNode(startToken).finishSequenceExpression(expressions);
        }

        return expr;
    }

    // 12.1 Block

    function parseStatementListItem() {
        if (lookahead.type === Token.Keyword) {
            switch (lookahead.value) {
            case 'export':
                if (sourceType !== 'module') {
                    tolerateUnexpectedToken(lookahead, Messages.IllegalExportDeclaration);
                }
                return parseExportDeclaration();
            case 'import':
                if (sourceType !== 'module') {
                    tolerateUnexpectedToken(lookahead, Messages.IllegalImportDeclaration);
                }
                return parseImportDeclaration();
            case 'const':
            case 'let':
                return parseLexicalDeclaration({inFor: false});
            case 'function':
                return parseFunctionDeclaration(new Node());
            case 'class':
                return parseClassDeclaration();
            }
        }

        return parseStatement();
    }

    function parseStatementList() {
        var list = [];
        while (startIndex < length) {
            if (match('}')) {
                break;
            }
            list.push(parseStatementListItem());
        }

        return list;
    }

    function parseBlock() {
        var block, node = new Node();

        expect('{');

        block = parseStatementList();

        expect('}');

        return node.finishBlockStatement(block);
    }

    // 12.2 Variable Statement

    function parseVariableIdentifier() {
        var token, node = new Node();

        token = lex();

        if (token.type !== Token.Identifier) {
            if (strict && token.type === Token.Keyword && isStrictModeReservedWord(token.value)) {
                tolerateUnexpectedToken(token, Messages.StrictReservedWord);
            } else {
                throwUnexpectedToken(token);
            }
        }

        return node.finishIdentifier(token.value);
    }

    function parseVariableDeclaration() {
        var init = null, id, node = new Node();

        id = parsePattern();

        // 12.2.1
        if (strict && isRestrictedWord(id.name)) {
            tolerateError(Messages.StrictVarName);
        }

        if (match('=')) {
            lex();
            init = isolateCoverGrammar(parseAssignmentExpression);
        } else if (id.type !== Syntax.Identifier) {
            expect('=');
        }

        return node.finishVariableDeclarator(id, init);
    }

    function parseVariableDeclarationList() {
        var list = [];

        do {
            list.push(parseVariableDeclaration());
            if (!match(',')) {
                break;
            }
            lex();
        } while (startIndex < length);

        return list;
    }

    function parseVariableStatement(node) {
        var declarations;

        expectKeyword('var');

        declarations = parseVariableDeclarationList();

        consumeSemicolon();

        return node.finishVariableDeclaration(declarations);
    }

    function parseLexicalBinding(kind, options) {
        var init = null, id, node = new Node();

        id = parsePattern();

        // 12.2.1
        if (strict && id.type === Syntax.Identifier && isRestrictedWord(id.name)) {
            tolerateError(Messages.StrictVarName);
        }

        if (kind === 'const') {
            if (!matchKeyword('in')) {
                expect('=');
                init = isolateCoverGrammar(parseAssignmentExpression);
            }
        } else if ((!options.inFor && id.type !== Syntax.Identifier) || match('=')) {
            expect('=');
            init = isolateCoverGrammar(parseAssignmentExpression);
        }

        return node.finishVariableDeclarator(id, init);
    }

    function parseBindingList(kind, options) {
        var list = [];

        do {
            list.push(parseLexicalBinding(kind, options));
            if (!match(',')) {
                break;
            }
            lex();
        } while (startIndex < length);

        return list;
    }

    function parseLexicalDeclaration(options) {
        var kind, declarations, node = new Node();

        kind = lex().value;
        assert(kind === 'let' || kind === 'const', 'Lexical declaration must be either let or const');

        declarations = parseBindingList(kind, options);

        consumeSemicolon();

        return node.finishLexicalDeclaration(declarations, kind);
    }

    function parseRestElement() {
        var param, node = new Node();

        lex();

        if (match('{')) {
            throwError(Messages.ObjectPatternAsRestParameter);
        }

        param = parseVariableIdentifier();

        if (match('=')) {
            throwError(Messages.DefaultRestParameter);
        }

        if (!match(')')) {
            throwError(Messages.ParameterAfterRestParameter);
        }

        return node.finishRestElement(param);
    }

    // 12.3 Empty Statement

    function parseEmptyStatement(node) {
        expect(';');
        return node.finishEmptyStatement();
    }

    // 12.4 Expression Statement

    function parseExpressionStatement(node) {
        var expr = parseExpression();
        consumeSemicolon();
        return node.finishExpressionStatement(expr);
    }

    // 12.5 If statement

    function parseIfStatement(node) {
        var test, consequent, alternate;

        expectKeyword('if');

        expect('(');

        test = parseExpression();

        expect(')');

        consequent = parseStatement();

        if (matchKeyword('else')) {
            lex();
            alternate = parseStatement();
        } else {
            alternate = null;
        }

        return node.finishIfStatement(test, consequent, alternate);
    }

    // 12.6 Iteration Statements

    function parseDoWhileStatement(node) {
        var body, test, oldInIteration;

        expectKeyword('do');

        oldInIteration = state.inIteration;
        state.inIteration = true;

        body = parseStatement();

        state.inIteration = oldInIteration;

        expectKeyword('while');

        expect('(');

        test = parseExpression();

        expect(')');

        if (match(';')) {
            lex();
        }

        return node.finishDoWhileStatement(body, test);
    }

    function parseWhileStatement(node) {
        var test, body, oldInIteration;

        expectKeyword('while');

        expect('(');

        test = parseExpression();

        expect(')');

        oldInIteration = state.inIteration;
        state.inIteration = true;

        body = parseStatement();

        state.inIteration = oldInIteration;

        return node.finishWhileStatement(test, body);
    }

    function parseForStatement(node) {
        var init, initSeq, initStartToken, test, update, left, right, kind, declarations,
            body, oldInIteration, previousAllowIn = state.allowIn;

        init = test = update = null;

        expectKeyword('for');

        expect('(');

        if (match(';')) {
            lex();
        } else {
            if (matchKeyword('var')) {
                init = new Node();
                lex();

                state.allowIn = false;
                init = init.finishVariableDeclaration(parseVariableDeclarationList());
                state.allowIn = previousAllowIn;

                if (init.declarations.length === 1 && matchKeyword('in')) {
                    lex();
                    left = init;
                    right = parseExpression();
                    init = null;
                } else {
                    expect(';');
                }
            } else if (matchKeyword('const') || matchKeyword('let')) {
                init = new Node();
                kind = lex().value;

                state.allowIn = false;
                declarations = parseBindingList(kind, {inFor: true});
                state.allowIn = previousAllowIn;

                if (declarations.length === 1 && declarations[0].init === null && matchKeyword('in')) {
                    init = init.finishLexicalDeclaration(declarations, kind);
                    lex();
                    left = init;
                    right = parseExpression();
                    init = null;
                } else {
                    consumeSemicolon();
                    init = init.finishLexicalDeclaration(declarations, kind);
                }
            } else {
                initStartToken = lookahead;
                state.allowIn = false;
                init = inheritCoverGrammar(parseAssignmentExpression);
                state.allowIn = previousAllowIn;

                if (matchKeyword('in')) {
                    if (!isAssignmentTarget) {
                        tolerateError(Messages.InvalidLHSInForIn);
                    }

                    lex();
                    reinterpretExpressionAsPattern(init);
                    left = init;
                    right = parseExpression();
                    init = null;
                } else {
                    if (match(',')) {
                        initSeq = [init];
                        while (match(',')) {
                            lex();
                            initSeq.push(isolateCoverGrammar(parseAssignmentExpression));
                        }
                        init = new WrappingNode(initStartToken).finishSequenceExpression(initSeq);
                    }
                    expect(';');
                }
            }
        }

        if (typeof left === 'undefined') {

            if (!match(';')) {
                test = parseExpression();
            }
            expect(';');

            if (!match(')')) {
                update = parseExpression();
            }
        }

        expect(')');

        oldInIteration = state.inIteration;
        state.inIteration = true;

        body = isolateCoverGrammar(parseStatement);

        state.inIteration = oldInIteration;

        return (typeof left === 'undefined') ?
                node.finishForStatement(init, test, update, body) :
                node.finishForInStatement(left, right, body);
    }

    // 12.7 The continue statement

    function parseContinueStatement(node) {
        var label = null, key;

        expectKeyword('continue');

        // Optimize the most common form: 'continue;'.
        if (source.charCodeAt(startIndex) === 0x3B) {
            lex();

            if (!state.inIteration) {
                throwError(Messages.IllegalContinue);
            }

            return node.finishContinueStatement(null);
        }

        if (hasLineTerminator) {
            if (!state.inIteration) {
                throwError(Messages.IllegalContinue);
            }

            return node.finishContinueStatement(null);
        }

        if (lookahead.type === Token.Identifier) {
            label = parseVariableIdentifier();

            key = '$' + label.name;
            if (!Object.prototype.hasOwnProperty.call(state.labelSet, key)) {
                throwError(Messages.UnknownLabel, label.name);
            }
        }

        consumeSemicolon();

        if (label === null && !state.inIteration) {
            throwError(Messages.IllegalContinue);
        }

        return node.finishContinueStatement(label);
    }

    // 12.8 The break statement

    function parseBreakStatement(node) {
        var label = null, key;

        expectKeyword('break');

        // Catch the very common case first: immediately a semicolon (U+003B).
        if (source.charCodeAt(lastIndex) === 0x3B) {
            lex();

            if (!(state.inIteration || state.inSwitch)) {
                throwError(Messages.IllegalBreak);
            }

            return node.finishBreakStatement(null);
        }

        if (hasLineTerminator) {
            if (!(state.inIteration || state.inSwitch)) {
                throwError(Messages.IllegalBreak);
            }

            return node.finishBreakStatement(null);
        }

        if (lookahead.type === Token.Identifier) {
            label = parseVariableIdentifier();

            key = '$' + label.name;
            if (!Object.prototype.hasOwnProperty.call(state.labelSet, key)) {
                throwError(Messages.UnknownLabel, label.name);
            }
        }

        consumeSemicolon();

        if (label === null && !(state.inIteration || state.inSwitch)) {
            throwError(Messages.IllegalBreak);
        }

        return node.finishBreakStatement(label);
    }

    // 12.9 The return statement

    function parseReturnStatement(node) {
        var argument = null;

        expectKeyword('return');

        if (!state.inFunctionBody) {
            tolerateError(Messages.IllegalReturn);
        }

        // 'return' followed by a space and an identifier is very common.
        if (source.charCodeAt(lastIndex) === 0x20) {
            if (isIdentifierStart(source.charCodeAt(lastIndex + 1))) {
                argument = parseExpression();
                consumeSemicolon();
                return node.finishReturnStatement(argument);
            }
        }

        if (hasLineTerminator) {
            // HACK
            return node.finishReturnStatement(null);
        }

        if (!match(';')) {
            if (!match('}') && lookahead.type !== Token.EOF) {
                argument = parseExpression();
            }
        }

        consumeSemicolon();

        return node.finishReturnStatement(argument);
    }

    // 12.10 The with statement

    function parseWithStatement(node) {
        var object, body;

        if (strict) {
            tolerateError(Messages.StrictModeWith);
        }

        expectKeyword('with');

        expect('(');

        object = parseExpression();

        expect(')');

        body = parseStatement();

        return node.finishWithStatement(object, body);
    }

    // 12.10 The swith statement

    function parseSwitchCase() {
        var test, consequent = [], statement, node = new Node();

        if (matchKeyword('default')) {
            lex();
            test = null;
        } else {
            expectKeyword('case');
            test = parseExpression();
        }
        expect(':');

        while (startIndex < length) {
            if (match('}') || matchKeyword('default') || matchKeyword('case')) {
                break;
            }
            statement = parseStatementListItem();
            consequent.push(statement);
        }

        return node.finishSwitchCase(test, consequent);
    }

    function parseSwitchStatement(node) {
        var discriminant, cases, clause, oldInSwitch, defaultFound;

        expectKeyword('switch');

        expect('(');

        discriminant = parseExpression();

        expect(')');

        expect('{');

        cases = [];

        if (match('}')) {
            lex();
            return node.finishSwitchStatement(discriminant, cases);
        }

        oldInSwitch = state.inSwitch;
        state.inSwitch = true;
        defaultFound = false;

        while (startIndex < length) {
            if (match('}')) {
                break;
            }
            clause = parseSwitchCase();
            if (clause.test === null) {
                if (defaultFound) {
                    throwError(Messages.MultipleDefaultsInSwitch);
                }
                defaultFound = true;
            }
            cases.push(clause);
        }

        state.inSwitch = oldInSwitch;

        expect('}');

        return node.finishSwitchStatement(discriminant, cases);
    }

    // 12.13 The throw statement

    function parseThrowStatement(node) {
        var argument;

        expectKeyword('throw');

        if (hasLineTerminator) {
            throwError(Messages.NewlineAfterThrow);
        }

        argument = parseExpression();

        consumeSemicolon();

        return node.finishThrowStatement(argument);
    }

    // 12.14 The try statement

    function parseCatchClause() {
        var param, body, node = new Node();

        expectKeyword('catch');

        expect('(');
        if (match(')')) {
            throwUnexpectedToken(lookahead);
        }

        param = parsePattern();

        // 12.14.1
        if (strict && isRestrictedWord(param.name)) {
            tolerateError(Messages.StrictCatchVariable);
        }

        expect(')');
        body = parseBlock();
        return node.finishCatchClause(param, body);
    }

    function parseTryStatement(node) {
        var block, handler = null, finalizer = null;

        expectKeyword('try');

        block = parseBlock();

        if (matchKeyword('catch')) {
            handler = parseCatchClause();
        }

        if (matchKeyword('finally')) {
            lex();
            finalizer = parseBlock();
        }

        if (!handler && !finalizer) {
            throwError(Messages.NoCatchOrFinally);
        }

        return node.finishTryStatement(block, handler, finalizer);
    }

    // 12.15 The debugger statement

    function parseDebuggerStatement(node) {
        expectKeyword('debugger');

        consumeSemicolon();

        return node.finishDebuggerStatement();
    }

    // 12 Statements

    function parseStatement() {
        var type = lookahead.type,
            expr,
            labeledBody,
            key,
            node;

        if (type === Token.EOF) {
            throwUnexpectedToken(lookahead);
        }

        if (type === Token.Punctuator && lookahead.value === '{') {
            return parseBlock();
        }
        isAssignmentTarget = isBindingElement = true;
        node = new Node();

        if (type === Token.Punctuator) {
            switch (lookahead.value) {
            case ';':
                return parseEmptyStatement(node);
            case '(':
                return parseExpressionStatement(node);
            default:
                break;
            }
        } else if (type === Token.Keyword) {
            switch (lookahead.value) {
            case 'break':
                return parseBreakStatement(node);
            case 'continue':
                return parseContinueStatement(node);
            case 'debugger':
                return parseDebuggerStatement(node);
            case 'do':
                return parseDoWhileStatement(node);
            case 'for':
                return parseForStatement(node);
            case 'function':
                return parseFunctionDeclaration(node);
            case 'if':
                return parseIfStatement(node);
            case 'return':
                return parseReturnStatement(node);
            case 'switch':
                return parseSwitchStatement(node);
            case 'throw':
                return parseThrowStatement(node);
            case 'try':
                return parseTryStatement(node);
            case 'var':
                return parseVariableStatement(node);
            case 'while':
                return parseWhileStatement(node);
            case 'with':
                return parseWithStatement(node);
            default:
                break;
            }
        }

        expr = parseExpression();

        // 12.12 Labelled Statements
        if ((expr.type === Syntax.Identifier) && match(':')) {
            lex();

            key = '$' + expr.name;
            if (Object.prototype.hasOwnProperty.call(state.labelSet, key)) {
                throwError(Messages.Redeclaration, 'Label', expr.name);
            }

            state.labelSet[key] = true;
            labeledBody = parseStatement();
            delete state.labelSet[key];
            return node.finishLabeledStatement(expr, labeledBody);
        }

        consumeSemicolon();

        return node.finishExpressionStatement(expr);
    }

    // 13 Function Definition

    function parseFunctionSourceElements() {
        var statement, body = [], token, directive, firstRestricted,
            oldLabelSet, oldInIteration, oldInSwitch, oldInFunctionBody, oldParenthesisCount,
            node = new Node();

        expect('{');

        while (startIndex < length) {
            if (lookahead.type !== Token.StringLiteral) {
                break;
            }
            token = lookahead;

            statement = parseStatementListItem();
            body.push(statement);
            if (statement.expression.type !== Syntax.Literal) {
                // this is not directive
                break;
            }
            directive = source.slice(token.start + 1, token.end - 1);
            if (directive === 'use strict') {
                strict = true;
                if (firstRestricted) {
                    tolerateUnexpectedToken(firstRestricted, Messages.StrictOctalLiteral);
                }
            } else {
                if (!firstRestricted && token.octal) {
                    firstRestricted = token;
                }
            }
        }

        oldLabelSet = state.labelSet;
        oldInIteration = state.inIteration;
        oldInSwitch = state.inSwitch;
        oldInFunctionBody = state.inFunctionBody;
        oldParenthesisCount = state.parenthesizedCount;

        state.labelSet = {};
        state.inIteration = false;
        state.inSwitch = false;
        state.inFunctionBody = true;
        state.parenthesizedCount = 0;

        while (startIndex < length) {
            if (match('}')) {
                break;
            }
            body.push(parseStatementListItem());
        }

        expect('}');

        state.labelSet = oldLabelSet;
        state.inIteration = oldInIteration;
        state.inSwitch = oldInSwitch;
        state.inFunctionBody = oldInFunctionBody;
        state.parenthesizedCount = oldParenthesisCount;

        return node.finishBlockStatement(body);
    }

    function validateParam(options, param, name) {
        var key = '$' + name;
        if (strict) {
            if (isRestrictedWord(name)) {
                options.stricted = param;
                options.message = Messages.StrictParamName;
            }
            if (Object.prototype.hasOwnProperty.call(options.paramSet, key)) {
                options.stricted = param;
                options.message = Messages.StrictParamDupe;
            }
        } else if (!options.firstRestricted) {
            if (isRestrictedWord(name)) {
                options.firstRestricted = param;
                options.message = Messages.StrictParamName;
            } else if (isStrictModeReservedWord(name)) {
                options.firstRestricted = param;
                options.message = Messages.StrictReservedWord;
            } else if (Object.prototype.hasOwnProperty.call(options.paramSet, key)) {
                options.firstRestricted = param;
                options.message = Messages.StrictParamDupe;
            }
        }
        options.paramSet[key] = true;
    }

    function parseParam(options) {
        var token, param, def;

        token = lookahead;
        if (token.value === '...') {
            param = parseRestElement();
            validateParam(options, param.argument, param.argument.name);
            options.params.push(param);
            options.defaults.push(null);
            return false;
        }

        param = parsePatternWithDefault();
        validateParam(options, token, token.value);

        if (param.type === Syntax.AssignmentPattern) {
            def = param.right;
            param = param.left;
            ++options.defaultCount;
        }

        options.params.push(param);
        options.defaults.push(def);

        return !match(')');
    }

    function parseParams(firstRestricted) {
        var options;

        options = {
            params: [],
            defaultCount: 0,
            defaults: [],
            firstRestricted: firstRestricted
        };

        expect('(');

        if (!match(')')) {
            options.paramSet = {};
            while (startIndex < length) {
                if (!parseParam(options)) {
                    break;
                }
                expect(',');
            }
        }

        expect(')');

        if (options.defaultCount === 0) {
            options.defaults = [];
        }

        return {
            params: options.params,
            defaults: options.defaults,
            stricted: options.stricted,
            firstRestricted: options.firstRestricted,
            message: options.message
        };
    }

    function parseFunctionDeclaration(node, identifierIsOptional) {
        var id = null, params = [], defaults = [], body, token, stricted, tmp, firstRestricted, message, previousStrict;

        expectKeyword('function');
        if (!identifierIsOptional || !match('(')) {
            token = lookahead;
            id = parseVariableIdentifier();
            if (strict) {
                if (isRestrictedWord(token.value)) {
                    tolerateUnexpectedToken(token, Messages.StrictFunctionName);
                }
            } else {
                if (isRestrictedWord(token.value)) {
                    firstRestricted = token;
                    message = Messages.StrictFunctionName;
                } else if (isStrictModeReservedWord(token.value)) {
                    firstRestricted = token;
                    message = Messages.StrictReservedWord;
                }
            }
        }

        tmp = parseParams(firstRestricted);
        params = tmp.params;
        defaults = tmp.defaults;
        stricted = tmp.stricted;
        firstRestricted = tmp.firstRestricted;
        if (tmp.message) {
            message = tmp.message;
        }

        previousStrict = strict;
        body = parseFunctionSourceElements();
        if (strict && firstRestricted) {
            throwUnexpectedToken(firstRestricted, message);
        }
        if (strict && stricted) {
            tolerateUnexpectedToken(stricted, message);
        }
        strict = previousStrict;

        return node.finishFunctionDeclaration(id, params, defaults, body);
    }

    function parseFunctionExpression() {
        var token, id = null, stricted, firstRestricted, message, tmp,
            params = [], defaults = [], body, previousStrict, node = new Node();

        expectKeyword('function');

        if (!match('(')) {
            token = lookahead;
            id = parseVariableIdentifier();
            if (strict) {
                if (isRestrictedWord(token.value)) {
                    tolerateUnexpectedToken(token, Messages.StrictFunctionName);
                }
            } else {
                if (isRestrictedWord(token.value)) {
                    firstRestricted = token;
                    message = Messages.StrictFunctionName;
                } else if (isStrictModeReservedWord(token.value)) {
                    firstRestricted = token;
                    message = Messages.StrictReservedWord;
                }
            }
        }

        tmp = parseParams(firstRestricted);
        params = tmp.params;
        defaults = tmp.defaults;
        stricted = tmp.stricted;
        firstRestricted = tmp.firstRestricted;
        if (tmp.message) {
            message = tmp.message;
        }

        previousStrict = strict;
        body = parseFunctionSourceElements();
        if (strict && firstRestricted) {
            throwUnexpectedToken(firstRestricted, message);
        }
        if (strict && stricted) {
            tolerateUnexpectedToken(stricted, message);
        }
        strict = previousStrict;

        return node.finishFunctionExpression(id, params, defaults, body);
    }


    function parseClassBody() {
        var classBody, token, isStatic, hasConstructor = false, body, method, computed, key;

        classBody = new Node();

        expect('{');
        body = [];
        while (!match('}')) {
            if (match(';')) {
                lex();
            } else {
                method = new Node();
                token = lookahead;
                isStatic = false;
                computed = match('[');
                key = parseObjectPropertyKey();
                if (key.name === 'static' && lookaheadPropertyName()) {
                    token = lookahead;
                    isStatic = true;
                    computed = match('[');
                    key = parseObjectPropertyKey();
                }
                method = tryParseMethodDefinition(token, key, computed, method);
                if (method) {
                    method['static'] = isStatic;
                    if (method.kind === 'init') {
                        method.kind = 'method';
                    }
                    if (!isStatic) {
                        if (!method.computed && (method.key.name || method.key.value.toString()) === 'constructor') {
                            if (method.kind !== 'method' || !method.method || method.value.generator) {
                                throwUnexpectedToken(token, Messages.ConstructorSpecialMethod);
                            }
                            if (hasConstructor) {
                                throwUnexpectedToken(token, Messages.DuplicateConstructor);
                            } else {
                                hasConstructor = true;
                            }
                            method.kind = 'constructor';
                        }
                    } else {
                        if (!method.computed && (method.key.name || method.key.value.toString()) === 'prototype') {
                            throwUnexpectedToken(token, Messages.StaticPrototype);
                        }
                    }
                    method.type = Syntax.MethodDefinition;
                    delete method.method;
                    delete method.shorthand;
                    body.push(method);
                } else {
                    throwUnexpectedToken(lookahead);
                }
            }
        }
        lex();
        return classBody.finishClassBody(body);
    }

    function parseClassDeclaration(identifierIsOptional) {
        var id = null, superClass = null, classNode = new Node(), classBody, previousStrict = strict;
        strict = true;

        expectKeyword('class');

        if (!identifierIsOptional || lookahead.type === Token.Identifier) {
            id = parseVariableIdentifier();
        }

        if (matchKeyword('extends')) {
            lex();
            superClass = isolateCoverGrammar(parseLeftHandSideExpressionAllowCall);
        }
        classBody = parseClassBody();
        strict = previousStrict;

        return classNode.finishClassDeclaration(id, superClass, classBody);
    }

    function parseClassExpression() {
        var id = null, superClass = null, classNode = new Node(), classBody, previousStrict = strict;
        strict = true;

        expectKeyword('class');

        if (lookahead.type === Token.Identifier) {
            id = parseVariableIdentifier();
        }

        if (matchKeyword('extends')) {
            lex();
            superClass = isolateCoverGrammar(parseLeftHandSideExpressionAllowCall);
        }
        classBody = parseClassBody();
        strict = previousStrict;

        return classNode.finishClassExpression(id, superClass, classBody);
    }

    // Modules grammar from:
    // people.mozilla.org/~jorendorff/es6-draft.html

    function parseModuleSpecifier() {
        var node = new Node();

        if (lookahead.type !== Token.StringLiteral) {
            throwError(Messages.InvalidModuleSpecifier);
        }
        return node.finishLiteral(lex());
    }

    function parseExportSpecifier() {
        var exported, local, node = new Node(), def;
        if (matchKeyword('default')) {
            // export {default} from 'something';
            def = new Node();
            lex();
            local = def.finishIdentifier('default');
        } else {
            local = parseVariableIdentifier();
        }
        if (matchContextualKeyword('as')) {
            lex();
            exported = parseNonComputedProperty();
        }
        return node.finishExportSpecifier(local, exported);
    }

    function parseExportNamedDeclaration(node) {
        var declaration = null,
            isExportFromIdentifier,
            src = null, specifiers = [];

        // non-default export
        if (lookahead.type === Token.Keyword) {
            // covers:
            // export var f = 1;
            switch (lookahead.value) {
                case 'let':
                case 'const':
                case 'var':
                case 'class':
                case 'function':
                    declaration = parseStatementListItem();
                    return node.finishExportNamedDeclaration(declaration, specifiers, null);
            }
        }

        expect('{');
        if (!match('}')) {
            do {
                isExportFromIdentifier = isExportFromIdentifier || matchKeyword('default');
                specifiers.push(parseExportSpecifier());
            } while (match(',') && lex());
        }
        expect('}');

        if (matchContextualKeyword('from')) {
            // covering:
            // export {default} from 'foo';
            // export {foo} from 'foo';
            lex();
            src = parseModuleSpecifier();
            consumeSemicolon();
        } else if (isExportFromIdentifier) {
            // covering:
            // export {default}; // missing fromClause
            throwError(lookahead.value ?
                    Messages.UnexpectedToken : Messages.MissingFromClause, lookahead.value);
        } else {
            // cover
            // export {foo};
            consumeSemicolon();
        }
        return node.finishExportNamedDeclaration(declaration, specifiers, src);
    }

    function parseExportDefaultDeclaration(node) {
        var declaration = null,
            expression = null;

        // covers:
        // export default ...
        expectKeyword('default');

        if (matchKeyword('function')) {
            // covers:
            // export default function foo () {}
            // export default function () {}
            declaration = parseFunctionDeclaration(new Node(), true);
            return node.finishExportDefaultDeclaration(declaration);
        }
        if (matchKeyword('class')) {
            declaration = parseClassDeclaration(true);
            return node.finishExportDefaultDeclaration(declaration);
        }

        if (matchContextualKeyword('from')) {
            throwError(Messages.UnexpectedToken, lookahead.value);
        }

        // covers:
        // export default {};
        // export default [];
        // export default (1 + 2);
        if (match('{')) {
            expression = parseObjectInitialiser();
        } else if (match('[')) {
            expression = parseArrayInitialiser();
        } else {
            expression = parseAssignmentExpression();
        }
        consumeSemicolon();
        return node.finishExportDefaultDeclaration(expression);
    }

    function parseExportAllDeclaration(node) {
        var src;

        // covers:
        // export * from 'foo';
        expect('*');
        if (!matchContextualKeyword('from')) {
            throwError(lookahead.value ?
                    Messages.UnexpectedToken : Messages.MissingFromClause, lookahead.value);
        }
        lex();
        src = parseModuleSpecifier();
        consumeSemicolon();

        return node.finishExportAllDeclaration(src);
    }

    function parseExportDeclaration() {
        var node = new Node();
        if (state.inFunctionBody) {
            throwError(Messages.IllegalExportDeclaration);
        }

        expectKeyword('export');

        if (matchKeyword('default')) {
            return parseExportDefaultDeclaration(node);
        }
        if (match('*')) {
            return parseExportAllDeclaration(node);
        }
        return parseExportNamedDeclaration(node);
    }

    function parseImportSpecifier() {
        // import {<foo as bar>} ...;
        var local, imported, node = new Node();

        imported = parseNonComputedProperty();
        if (matchContextualKeyword('as')) {
            lex();
            local = parseVariableIdentifier();
        }

        return node.finishImportSpecifier(local, imported);
    }

    function parseNamedImports() {
        var specifiers = [];
        // {foo, bar as bas}
        expect('{');
        if (!match('}')) {
            do {
                specifiers.push(parseImportSpecifier());
            } while (match(',') && lex());
        }
        expect('}');
        return specifiers;
    }

    function parseImportDefaultSpecifier() {
        // import <foo> ...;
        var local, node = new Node();

        local = parseNonComputedProperty();

        return node.finishImportDefaultSpecifier(local);
    }

    function parseImportNamespaceSpecifier() {
        // import <* as foo> ...;
        var local, node = new Node();

        expect('*');
        if (!matchContextualKeyword('as')) {
            throwError(Messages.NoAsAfterImportNamespace);
        }
        lex();
        local = parseNonComputedProperty();

        return node.finishImportNamespaceSpecifier(local);
    }

    function parseImportDeclaration() {
        var specifiers, src, node = new Node();

        if (state.inFunctionBody) {
            throwError(Messages.IllegalImportDeclaration);
        }

        expectKeyword('import');
        specifiers = [];

        if (lookahead.type === Token.StringLiteral) {
            // covers:
            // import 'foo';
            src = parseModuleSpecifier();
            consumeSemicolon();
            return node.finishImportDeclaration(specifiers, src);
        }

        if (!matchKeyword('default') && isIdentifierName(lookahead)) {
            // covers:
            // import foo
            // import foo, ...
            specifiers.push(parseImportDefaultSpecifier());
            if (match(',')) {
                lex();
            }
        }
        if (match('*')) {
            // covers:
            // import foo, * as foo
            // import * as foo
            specifiers.push(parseImportNamespaceSpecifier());
        } else if (match('{')) {
            // covers:
            // import foo, {bar}
            // import {bar}
            specifiers = specifiers.concat(parseNamedImports());
        }

        if (!matchContextualKeyword('from')) {
            throwError(lookahead.value ?
                    Messages.UnexpectedToken : Messages.MissingFromClause, lookahead.value);
        }
        lex();
        src = parseModuleSpecifier();
        consumeSemicolon();

        return node.finishImportDeclaration(specifiers, src);
    }

    // 14 Program

    function parseScriptBody() {
        var statement, body = [], token, directive, firstRestricted;

        while (startIndex < length) {
            token = lookahead;
            if (token.type !== Token.StringLiteral) {
                break;
            }

            statement = parseStatementListItem();
            body.push(statement);
            if (statement.expression.type !== Syntax.Literal) {
                // this is not directive
                break;
            }
            directive = source.slice(token.start + 1, token.end - 1);
            if (directive === 'use strict') {
                strict = true;
                if (firstRestricted) {
                    tolerateUnexpectedToken(firstRestricted, Messages.StrictOctalLiteral);
                }
            } else {
                if (!firstRestricted && token.octal) {
                    firstRestricted = token;
                }
            }
        }

        while (startIndex < length) {
            statement = parseStatementListItem();
            /* istanbul ignore if */
            if (typeof statement === 'undefined') {
                break;
            }
            body.push(statement);
        }
        return body;
    }

    function parseProgram() {
        var body, node;

        peek();
        node = new Node();

        body = parseScriptBody();
        return node.finishProgram(body);
    }

    function filterTokenLocation() {
        var i, entry, token, tokens = [];

        for (i = 0; i < extra.tokens.length; ++i) {
            entry = extra.tokens[i];
            token = {
                type: entry.type,
                value: entry.value
            };
            if (entry.regex) {
                token.regex = {
                    pattern: entry.regex.pattern,
                    flags: entry.regex.flags
                };
            }
            if (extra.range) {
                token.range = entry.range;
            }
            if (extra.loc) {
                token.loc = entry.loc;
            }
            tokens.push(token);
        }

        extra.tokens = tokens;
    }

    function tokenize(code, options) {
        var toString,
            tokens;

        toString = String;
        if (typeof code !== 'string' && !(code instanceof String)) {
            code = toString(code);
        }

        source = code;
        index = 0;
        lineNumber = (source.length > 0) ? 1 : 0;
        lineStart = 0;
        startIndex = index;
        startLineNumber = lineNumber;
        startLineStart = lineStart;
        length = source.length;
        lookahead = null;
        state = {
            allowIn: true,
            labelSet: {},
            inFunctionBody: false,
            inIteration: false,
            inSwitch: false,
            lastCommentStart: -1,
            curlyStack: []
        };

        extra = {};

        // Options matching.
        options = options || {};

        // Of course we collect tokens here.
        options.tokens = true;
        extra.tokens = [];
        extra.tokenize = true;
        // The following two fields are necessary to compute the Regex tokens.
        extra.openParenToken = -1;
        extra.openCurlyToken = -1;

        extra.range = (typeof options.range === 'boolean') && options.range;
        extra.loc = (typeof options.loc === 'boolean') && options.loc;

        if (typeof options.comment === 'boolean' && options.comment) {
            extra.comments = [];
        }
        if (typeof options.tolerant === 'boolean' && options.tolerant) {
            extra.errors = [];
        }

        try {
            peek();
            if (lookahead.type === Token.EOF) {
                return extra.tokens;
            }

            lex();
            while (lookahead.type !== Token.EOF) {
                try {
                    lex();
                } catch (lexError) {
                    if (extra.errors) {
                        recordError(lexError);
                        // We have to break on the first error
                        // to avoid infinite loops.
                        break;
                    } else {
                        throw lexError;
                    }
                }
            }

            filterTokenLocation();
            tokens = extra.tokens;
            if (typeof extra.comments !== 'undefined') {
                tokens.comments = extra.comments;
            }
            if (typeof extra.errors !== 'undefined') {
                tokens.errors = extra.errors;
            }
        } catch (e) {
            throw e;
        } finally {
            extra = {};
        }
        return tokens;
    }

    function parse(code, options) {
        var program, toString;

        toString = String;
        if (typeof code !== 'string' && !(code instanceof String)) {
            code = toString(code);
        }

        source = code;
        index = 0;
        lineNumber = (source.length > 0) ? 1 : 0;
        lineStart = 0;
        startIndex = index;
        startLineNumber = lineNumber;
        startLineStart = lineStart;
        length = source.length;
        lookahead = null;
        state = {
            allowIn: true,
            labelSet: {},
            inFunctionBody: false,
            inIteration: false,
            inSwitch: false,
            lastCommentStart: -1,
            curlyStack: []
        };
        sourceType = 'script';
        strict = false;

        extra = {};
        if (typeof options !== 'undefined') {
            extra.range = (typeof options.range === 'boolean') && options.range;
            extra.loc = (typeof options.loc === 'boolean') && options.loc;
            extra.attachComment = (typeof options.attachComment === 'boolean') && options.attachComment;

            if (extra.loc && options.source !== null && options.source !== undefined) {
                extra.source = toString(options.source);
            }

            if (typeof options.tokens === 'boolean' && options.tokens) {
                extra.tokens = [];
            }
            if (typeof options.comment === 'boolean' && options.comment) {
                extra.comments = [];
            }
            if (typeof options.tolerant === 'boolean' && options.tolerant) {
                extra.errors = [];
            }
            if (extra.attachComment) {
                extra.range = true;
                extra.comments = [];
                extra.bottomRightStack = [];
                extra.trailingComments = [];
                extra.leadingComments = [];
            }
            if (options.sourceType === 'module') {
                // very restrictive condition for now
                sourceType = options.sourceType;
                strict = true;
            }
        }

        try {
            program = parseProgram();
            if (typeof extra.comments !== 'undefined') {
                program.comments = extra.comments;
            }
            if (typeof extra.tokens !== 'undefined') {
                filterTokenLocation();
                program.tokens = extra.tokens;
            }
            if (typeof extra.errors !== 'undefined') {
                program.errors = extra.errors;
            }
        } catch (e) {
            throw e;
        } finally {
            extra = {};
        }

        return program;
    }

    // Sync with *.json manifests.
    exports.version = '2.2.0';

    exports.tokenize = tokenize;

    exports.parse = parse;

    // Deep copy.
    /* istanbul ignore next */
    exports.Syntax = (function () {
        var name, types = {};

        if (typeof Object.create === 'function') {
            types = Object.create(null);
        }

        for (name in Syntax) {
            if (Syntax.hasOwnProperty(name)) {
                types[name] = Syntax[name];
            }
        }

        if (typeof Object.freeze === 'function') {
            Object.freeze(types);
        }

        return types;
    }());

}));
/* vim: set sw=4 ts=4 et tw=80 : */

},{}],37:[function(require,module,exports){
(function (global){
; var __browserify_shim_require__=require;(function browserifyShim(module, exports, require, define, browserify_shim__define__module__export__) {
/*global window:true*/

/*
 * obelisk
 */

(function (window) {
    "use strict";

    /**
     * Static class holding library specific information
     * the library.
     * @class obelisk
     **/
    var obelisk = {};

    /**
     * @property version
     * @type String
     * @static
     **/
    obelisk.version = '1.1.0';

    /**
     * @property author
     * @type String
     * @static
     **/
    obelisk.author = 'max huang';

    window.obelisk = obelisk;
}(window));

/*global obelisk:true*/

/*
 * AbstractColor
 */

(function (obelisk) {
    "use strict";

    var AbstractColor, p;

    AbstractColor = function () {
        this.initialize();
    };
    p = AbstractColor.prototype;

    // public properties
    /**
     * The inner colors for elements of certain primitive
     */
    p.inner = null;

    /**
     * The border colors for elements of certain primitive
     */
    p.border = null;

    /**
     * The borderHighlight colors for elements of certain primitive
     */
    p.borderHighlight = null;

    /**
     * The left side colors for elements of certain primitive
     */
    p.left = null;

    /**
     * The right side colors for elements of certain primitive
     */
    p.right = null;

    /**
     * The horizontal colors for elements of certain primitive
     */
    p.horizontal = null;

    /**
     * The left slot side colors for elements of certain primitive
     */
    p.leftSlope = null;

    /**
     * The right slot side colors for elements of certain primitive
     */
    p.rightSlope = null;

    // constructor
    p.initialize = function () {
        return this;
    };

    // public methods
    p.toString = function () {
        return "[AbstractColor]";
    };

    // private methods

    obelisk.AbstractColor = AbstractColor;
}(obelisk));

/*global obelisk:true*/

/*
 * CubeColor
 */

(function (obelisk) {
    "use strict";

    var CubeColor, p;
    CubeColor = function (border, borderHighlight, left, right, horizontal) {
        this.initialize(border, borderHighlight, left, right, horizontal);
    };
    p = CubeColor.prototype = new obelisk.AbstractColor();

    // public properties
    p.BRIGHTNESS_GAIN = -20;

    // constructor
    p.initialize = function (border, borderHighlight, left, right, horizontal) {
        this.border = obelisk.ColorGeom.get32(border === undefined ? 0x878787 : border);
        this.borderHighlight = obelisk.ColorGeom.get32(borderHighlight === undefined ? 0xFFFFFF : borderHighlight);
        this.left = obelisk.ColorGeom.get32(left === undefined ? 0xC9CFD0 : left);
        this.right = obelisk.ColorGeom.get32(right === undefined ? 0xE3E3E3 : right);
        this.horizontal = obelisk.ColorGeom.get32(horizontal === undefined ? 0xEEEFF0 : horizontal);
        return this;
    };

    // public methods
    p.getByHorizontalColor = function (horizontal) {
        return new CubeColor(
            obelisk.ColorGeom.applyBrightness(horizontal, this.BRIGHTNESS_GAIN * 4),
            //apply hightlight
            obelisk.ColorGeom.applyBrightness(horizontal, 0, true),
            obelisk.ColorGeom.applyBrightness(horizontal, this.BRIGHTNESS_GAIN * 2),
            obelisk.ColorGeom.applyBrightness(horizontal, this.BRIGHTNESS_GAIN),
            horizontal
        );
    };

    p.toString = function () {
        return "[CubeColor]";
    };

    // private methods

    obelisk.CubeColor = CubeColor;
}(obelisk));

/*global obelisk:true*/

/*
 * PyramidColor
 */

(function (obelisk) {
    "use strict";

    var PyramidColor, p;
    PyramidColor = function (border, borderHighlight, left, right) {
        this.initialize(border, borderHighlight, left, right);
    };
    p = PyramidColor.prototype = new obelisk.AbstractColor();

    // public properties
    p.BRIGHTNESS_GAIN = -20;

    // constructor
    p.initialize = function (border, borderHighlight, left, right) {
        this.border = obelisk.ColorGeom.get32(border === undefined ? 0x949698 : border);
        this.borderHighlight = obelisk.ColorGeom.get32(borderHighlight === undefined ? 0xFFFFFF : borderHighlight);
        this.left = obelisk.ColorGeom.get32(left === undefined ? 0xE6E8E9 : left);
        this.right = obelisk.ColorGeom.get32(right === undefined ? 0xEEEFF0 : right);
        return this;
    };

    // public methods
    p.getByRightColor = function (right) {
        return new PyramidColor(
            obelisk.ColorGeom.applyBrightness(right, this.BRIGHTNESS_GAIN * 4),
            //apply hightlight
            obelisk.ColorGeom.applyBrightness(right, 0, true),
            obelisk.ColorGeom.applyBrightness(right, this.BRIGHTNESS_GAIN),
            right
        );
    };

    p.toString = function () {
        return "[PyramidColor]";
    };

    // private methods

    obelisk.PyramidColor = PyramidColor;
}(obelisk));

/*global obelisk:true*/

/*
 * SideColor
 */

(function (obelisk) {
    "use strict";

    var SideColor, p;
    SideColor = function (border, inner) {
        this.initialize(border, inner);
    };
    p = SideColor.prototype = new obelisk.AbstractColor();

    // public properties
    p.BRIGHTNESS_GAIN = -20;

    // constructor
    p.initialize = function (border, inner) {
        this.border = obelisk.ColorGeom.get32(border === undefined ? 0x878787 : border);
        this.inner = obelisk.ColorGeom.get32(inner === undefined ? 0xEEEEEE : inner);
        return this;
    };

    // public methods
    p.getByInnerColor = function (inner) {
        return new obelisk.SideColor(
            obelisk.ColorGeom.applyBrightness(inner, this.BRIGHTNESS_GAIN * 4),
            inner
        );
    };

    p.toString = function () {
        return "[SideColor]";
    };

    // private methods

    obelisk.SideColor = SideColor;
}(obelisk));

/*global obelisk:true*/

/*
 * SlopeColor
 */

(function (obelisk) {
    "use strict";

    var SlopeColor, p;
    SlopeColor = function (border, borderHighlight, left, right, leftSlope, rightSlope) {
        this.initialize(border, borderHighlight, left, right, leftSlope, rightSlope);
    };
    p = SlopeColor.prototype = new obelisk.AbstractColor();

    // public properties
    p.BRIGHTNESS_GAIN = -20;

    // constructor
    p.initialize = function (border, borderHighlight, left, right, leftSlope, rightSlope) {
        this.border = obelisk.ColorGeom.get32(border === undefined ? 0x949698 : border);
        this.borderHighlight = obelisk.ColorGeom.get32(borderHighlight === undefined ? 0xFFFFFF : borderHighlight);
        this.left = obelisk.ColorGeom.get32(left === undefined ? 0xC9CFD0 : left);
        this.right = obelisk.ColorGeom.get32(right === undefined ? 0xE6E8E9 : right);
        this.leftSlope = obelisk.ColorGeom.get32(leftSlope === undefined ? 0xDBDBDB : leftSlope);
        this.rightSlope = obelisk.ColorGeom.get32(rightSlope === undefined ? 0xDBDBDB : rightSlope);
        return this;
    };

    // public methods

    /*
     * horizontal side doesn't actually exist in the Slope primitive
     * you can assign the same horizontal color as cube
     * so that you will be able to arrange the slope with cube
     */
    p.getByHorizontalColor = function (horizontal) {
        return new obelisk.SlopeColor(
            obelisk.ColorGeom.applyBrightness(horizontal, this.BRIGHTNESS_GAIN * 4),
            //apply hightlight
            obelisk.ColorGeom.applyBrightness(horizontal, 0, true),
            obelisk.ColorGeom.applyBrightness(horizontal, this.BRIGHTNESS_GAIN * 2),
            obelisk.ColorGeom.applyBrightness(horizontal, this.BRIGHTNESS_GAIN),
            obelisk.ColorGeom.applyBrightness(horizontal, this.BRIGHTNESS_GAIN * 1.5),
            obelisk.ColorGeom.applyBrightness(horizontal, this.BRIGHTNESS_GAIN * 0.5)
        );
    };

    p.toString = function () {
        return "[SlopeColor]";
    };

    // private methods

    obelisk.SlopeColor = SlopeColor;
}(obelisk));

/*global obelisk:true*/

/*
 * AbstractDimension
 */

(function (obelisk) {
    "use strict";

    var AbstractDimension, p;
    AbstractDimension = function () {
        this.initialize();
    };
    p = AbstractDimension.prototype;

    // public properties
    /**
     * The x Axis dimensions in 22.6 degrees coordinate
     */
    p.xAxis = null;

    /**
     * The y Axis dimensions in 22.6 degrees coordinate
     */
    p.yAxis = null;

    /**
     * The z Axis dimensions in 22.6 degrees coordinate
     */
    p.zAxis = null;

    /**
     * Pyramid tall mode
     */
    p.tall = false;

    // constructor
    p.initialize = function () {
        return this;
    };

    // public methods
    p.toString = function () {
        return "[AbstractDimension]";
    };

    // private methods

    obelisk.AbstractDimension = AbstractDimension;
}(obelisk));

/*global obelisk:true*/

/*
 * BrickDimension
 */

(function (obelisk) {
    "use strict";

    var BrickDimension, p;
    BrickDimension = function (xAxis, yAxis) {
        this.initialize(xAxis, yAxis);
    };
    p = BrickDimension.prototype = new obelisk.AbstractDimension();

    // constructor
    p.initialize = function (xAxis, yAxis) {
        this.xAxis = xAxis || 30;
        this.yAxis = yAxis || 30;

        if (this.xAxis % 2 === 1 || this.yAxis % 2 === 1) {
            throw new Error("x,yAxis must be even number");
        }

        // xAxis || yAxis = 4 floodFill could not be applied
        if (this.xAxis <= 4 || this.yAxis <= 4) {
            throw new Error("dimension is too small");
        }

        return this;
    };

    p.toString = function () {
        return "[BrickDimension]";
    };

    obelisk.BrickDimension = BrickDimension;
}(obelisk));

/*global obelisk:true*/

/*
 * CubeDimension
 */

(function (obelisk) {
    "use strict";

    var CubeDimension, p;
    CubeDimension = function (xAxis, yAxis, zAxis) {
        this.initialize(xAxis, yAxis, zAxis);
    };
    p = CubeDimension.prototype = new obelisk.AbstractDimension();

    // constructor
    p.initialize = function (xAxis, yAxis, zAxis) {
        this.xAxis = xAxis || 30;
        this.yAxis = yAxis || 30;
        this.zAxis = zAxis || 30;

        if (this.xAxis % 2 === 1 || this.yAxis % 2 === 1) {
            throw new Error("x,yAxis must be even number");
        }

        // xAxis || yAxis = 4 floodFill could not be applied
        if (this.xAxis <= 4 || this.yAxis <= 4 || this.zAxis <= 2) {
            throw new Error("dimension is too small");
        }

        return this;
    };

    p.toString = function () {
        return "[CubeDimension]";
    };

    obelisk.CubeDimension = CubeDimension;
}(obelisk));

/*global obelisk:true*/

/*
 * PyramidDimension
 */

(function (obelisk) {
    "use strict";

    var PyramidDimension, p;
    PyramidDimension = function (axis, tall) {
        this.initialize(axis, tall);
    };
    p = PyramidDimension.prototype = new obelisk.AbstractDimension();

    // constructor
    p.initialize = function (axis, tall) {
        this.xAxis = axis || 30;
        this.yAxis = axis || 30;
        this.tall = tall || false;

        if (this.xAxis % 2 === 1) {
            throw new Error("axis must be even number");
        }

        if (this.xAxis <= 4) {
            throw new Error("dimension is too small");
        }

        return this;
    };

    p.toString = function () {
        return "[PyramidDimension]";
    };

    obelisk.PyramidDimension = PyramidDimension;
}(obelisk));

/*global obelisk:true*/

/*
 * SideXDimension
 */

(function (obelisk) {
    "use strict";

    var SideXDimension, p;
    SideXDimension = function (xAxis, zAxis) {
        this.initialize(xAxis, zAxis);
    };
    p = SideXDimension.prototype = new obelisk.AbstractDimension();

    // constructor
    p.initialize = function (xAxis, zAxis) {
        this.xAxis = xAxis || 30;
        this.zAxis = zAxis || 30;

        if (this.xAxis % 2 === 1) {
            throw new Error("xAxis must be even number");
        }

        // xAxis || zAxis = 4 floodFill could not be applied
        if (this.xAxis <= 4 || this.zAxis <= 2) {
            throw new Error("dimension is too small");
        }

        return this;
    };

    p.toString = function () {
        return "[SideXDimension]";
    };

    obelisk.SideXDimension = SideXDimension;
}(obelisk));

/*global obelisk:true*/

/*
 * SideYDimension
 */

(function (obelisk) {
    "use strict";

    var SideYDimension, p;

    SideYDimension = function (yAxis, zAxis) {
        this.initialize(yAxis, zAxis);
    };
    p = SideYDimension.prototype = new obelisk.AbstractDimension();

    // constructor
    p.initialize = function (yAxis, zAxis) {
        this.yAxis = yAxis || 30;
        this.zAxis = zAxis || 30;

        if (this.yAxis % 2 === 1) {
            throw new Error("yAxis must be even number");
        }

        // yAxis || zAxis = 4 floodFill could not be applied
        if (this.yAxis <= 4 || this.zAxis <= 2) {
            throw new Error("dimension is too small");
        }

        return this;
    };

    p.toString = function () {
        return "[SideYDimension]";
    };

    obelisk.SideYDimension = SideYDimension;
}(obelisk));

/*global obelisk:true*/

/*
 * SlopeDimension
 */

(function (obelisk) {
    "use strict";

    var SlopeDimension, p;
    SlopeDimension = function (xAxis, yAxis) {
        this.initialize(xAxis, yAxis);
    };
    p = SlopeDimension.prototype = new obelisk.AbstractDimension();

    // constructor
    p.initialize = function (xAxis, yAxis) {
        this.xAxis = xAxis || 30;
        this.yAxis = yAxis || 30;

        if (this.xAxis % 2 === 1 || this.yAxis % 2 === 1) {
            throw new Error("xAxis and yAxis must be even number");
        }

        if (this.xAxis <= 4 || this.yAxis <= 4) {
            throw new Error("dimension is too small");
        }

        return this;
    };

    p.toString = function () {
        return "[SlopeDimension]";
    };

    obelisk.SlopeDimension = SlopeDimension;
}(obelisk));

/*global obelisk:true*/

/*
 * BitmapData
 */

(function (obelisk) {
    "use strict";

    var BitmapData, p;
    BitmapData = function (w, h, useDefaultCanvas) {
        this.initialize(w, h, useDefaultCanvas);
    };
    p = BitmapData.prototype;

    // public property
    p.imageData = null;
    p.canvas = null;
    p.context = null;

    // constructor
    p.initialize = function (w, h, useDefaultCanvas) {
        if (w === undefined || h === undefined) {
            throw new Error("BitmapData width or height is missing");
        }

        if (useDefaultCanvas) {
            this.canvas = obelisk.CanvasManager.getDefaultCanvas();
        } else {
            this.canvas = obelisk.CanvasManager.getNewCanvas();
        }

        this.canvas.setAttribute('width', w);
        this.canvas.setAttribute('height', h);

        this.context = this.canvas.getContext('2d');
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.imageData = this.context.createImageData(w, h);

        return this;
    };

    p.setPixel = function (posX, posY, color) {
        var index = (posY * this.imageData.width + posX) * 4;
        this.setPixelByIndex(index, color);
    };

    p.setPixelByIndex = function (index, color) {
        var pixels = this.imageData.data;
        pixels[index] = (color >>> 16) & 0xFF;
        pixels[index + 1] = (color >>> 8) & 0xFF;
        pixels[index + 2] = (color >>> 0) & 0xFF;
        pixels[index + 3] = (color >>> 24) & 0xFF;
    };

    p.checkPixelAvailable = function (x, y) {
        var index = (y * this.imageData.width + x) * 4;
        return this.imageData.data[index + 3] === 0;
    };

    p.floodFill = function (posX, posY, color) {
        if (((color >>> 24) & 0xFF) === 0x00) {
            // transparent flood fill
            return;
        }

        var x = posX, y = posY,
            stack = [],
            nowCol = [],
            prevCol = [],
            col, row, matchFlag, newStart,
            w = this.imageData.width,
            h = this.imageData.height,
            i, j;

        // bound reach
        if (x < 0 || y < 0 || x >= w || y >= h) {
            return;
        }

        // first point check fail
        if (!this.checkPixelAvailable(x, y)) {
            throw new Error("Start point for flood fill is already filled");
        }

        // left side flood fill
        for (col = x; col >= 0; col -= 1) {
            // top side
            for (row = y; row >= 0; row -= 1) {
                if (this.checkPixelAvailable(col, row)) {
                    // available pixel
                    stack.push((row * w + col) * 4);
                    nowCol.push(row);
                } else {
                    // first one is invalid pixel && not at col top
                    if (row === y && this.checkPixelAvailable(col + 1, row - 1)) {

                        // next one is valid
                        if (this.checkPixelAvailable(col, row - 1)) {
                            newStart = row - 1;
                        } else {
                            if (this.checkPixelAvailable(col + 1, row - 2)) {
                                newStart = row - 2;
                            } else {
                                // fail, assign max value to avoid loop below
                                newStart = -1;
                            }
                        }

                        for (row = newStart; row >= 0; row -= 1) {
                            if (this.checkPixelAvailable(col, row)) {
                                // available pixel
                                stack.push((row * w + col) * 4);
                                nowCol.push(row);
                            } else {
                                break;
                            }
                        }
                    }

                    break;
                }
            }


            // bottom side
            for (row = y; row < h; row += 1) {
                if (this.checkPixelAvailable(col, row)) {
                    // available pixel
                    stack.push((row * w + col) * 4);
                    nowCol.push(row);
                } else {
                    // first one is invalid pixel && not at col bottom
                    if (row === y && this.checkPixelAvailable(col + 1, row + 1)) {

                        // next one is valid
                        if (this.checkPixelAvailable(col, row + 1)) {
                            newStart = row + 1;
                        } else {
                            if (this.checkPixelAvailable(col + 1, row + 2)) {
                                newStart = row + 2;
                            } else {
                                // fail, assign max value to avoid loop below
                                newStart = h;
                            }
                        }

                        for (row = newStart; row < h; row += 1) {
                            if (this.checkPixelAvailable(col, row)) {
                                // available pixel
                                stack.push((row * w + col) * 4);
                                nowCol.push(row);
                            } else {
                                break;
                            }
                        }
                    }

                    break;
                }
            }

            // compare with previous column
            // for first column
            // the given point should be inside the container
            if (col === x) {
                prevCol = nowCol.concat();
            }

            matchFlag = false;

            for (i = 0; i < prevCol.length; i += 1) {
                for (j = 0; j < prevCol.length; j += 1) {
                    if (nowCol[j] === prevCol[i]) {
                        matchFlag = true;
                        y = prevCol[i];
                        break;
                    }
                }

                if (matchFlag) {
                    break;
                }
            }

            if (matchFlag) {
                prevCol = nowCol.concat();
                nowCol = [];
            } else {
                // bound reach
                break;
            }
        }

        // reset start point
        x = posX;
        y = posY;
        prevCol = [];
        nowCol = [];

        // right side flood fill
        for (col = x; col < w; col += 1) {

            // top side
            for (row = y; row >= 0; row -= 1) {
                if (this.checkPixelAvailable(col, row)) {
                    // available pixel
                    stack.push((row * w + col) * 4);
                    nowCol.push(row);
                } else {
                    // first one is invalid pixel && not at col top
                    if (row === y && this.checkPixelAvailable(col - 1, row - 1)) {

                        // next one is valid
                        if (this.checkPixelAvailable(col, row - 1)) {
                            newStart = row - 1;
                        } else {
                            if (this.checkPixelAvailable(col - 1, row - 2)) {
                                newStart = row - 2;
                            } else {
                                // fail, assign max value to avoid loop below
                                newStart = -1;
                            }
                        }

                        for (row = newStart; row >= 0; row -= 1) {
                            if (this.checkPixelAvailable(col, row)) {
                                // available pixel
                                stack.push((row * w + col) * 4);
                                nowCol.push(row);
                            } else {
                                break;
                            }
                        }
                    }

                    break;
                }
            }

            // bottom side
            for (row = y; row < h; row += 1) {
                if (this.checkPixelAvailable(col, row)) {
                    // available pixel
                    stack.push((row * w + col) * 4);
                    nowCol.push(row);
                } else {
                    // first one is invalid pixel && not at col bottom
                    if (row === y && this.checkPixelAvailable(col - 1, row + 1)) {

                        // next one is valid
                        if (this.checkPixelAvailable(col, row + 1)) {
                            newStart = row + 1;
                        } else {
                            if (this.checkPixelAvailable(col - 1, row + 2)) {
                                newStart = row + 2;
                            } else {
                                // fail, assign max value to avoid loop below
                                newStart = h;
                            }
                        }

                        for (row = newStart; row < h; row += 1) {
                            if (this.checkPixelAvailable(col, row)) {
                                // available pixel
                                stack.push((row * w + col) * 4);
                                nowCol.push(row);
                            } else {
                                break;
                            }
                        }
                    }

                    break;
                }
            }

            // compare with previous column
            // for first column
            // the given point should be inside the container
            if (col === x) {
                prevCol = nowCol.concat();
            }

            matchFlag = false;

            for (i = 0; i < prevCol.length; i += 1) {
                for (j = 0; j < prevCol.length; j += 1) {
                    if (nowCol[j] === prevCol[i]) {
                        matchFlag = true;
                        y = prevCol[i];
                        break;
                    }
                }

                if (matchFlag) {
                    break;
                }
            }

            if (matchFlag) {
                prevCol = nowCol.concat();
                nowCol = [];
            } else {
                // bound reach
                break;
            }
        }

        // fill image data
        for (i = 0; i < stack.length; i += 1) {
            this.setPixelByIndex(stack[i], color);
        }
    };

    p.toString = function () {
        return "[BitmapData]";
    };

    obelisk.BitmapData = BitmapData;
}(obelisk));

/*global obelisk:true*/

/*
 * PixelObject
 */

(function (obelisk) {
    "use strict";

    var PixelObject, p;
    PixelObject = function (primitive, point3D) {
        this.initialize(primitive, point3D);
    };
    p = PixelObject.prototype;

    // public properties
    p.x = null;
    p.y = null;
    p.canvas = null;

    // constructor
    p.initialize = function (primitive, point3D) {
        if (!primitive) {
            throw new Error("Primitive is not defined");
        }

        var p3D = point3D || new obelisk.Point3D();

        this.canvas = primitive.canvas;
        this.x = primitive.matrix.tx + p3D.x - p3D.y;
        this.y = primitive.matrix.ty + Math.floor(p3D.x / 2 + p3D.y / 2) - p3D.z;

        return this;
    };

    // public methods

    // todo: add canvas remove method

    p.toString = function () {
        return "[PixelObject]";
    };

    // private methods

    obelisk.PixelObject = PixelObject;
}(obelisk));

/*global obelisk:true, jQuery:true*/

/*
 * PixelView
 */

(function (obelisk) {
    "use strict";

    var PixelView, p;
    PixelView = function (canvas, point) {
        this.initialize(canvas, point);
    };
    p = PixelView.prototype;

    // public properties
    p.canvas = null;
    p.context = null;
    p.point = null;

    // constructor
    p.initialize = function (canvas, point) {
        if (!canvas) {
            throw new Error("Canvas is not defined");
        }

        try {
            if (canvas instanceof jQuery) {
                canvas = canvas.get(0);
            }
        } catch (e) {
        }

        this.canvas = canvas;
        this.context = this.canvas.getContext('2d');
        this.point = point || new obelisk.Point(0, 0);

        return this;
    };

    // public methods
    p.renderObject = function (primitive, point3D) {
        var po = new obelisk.PixelObject(primitive, point3D);
        this.context.drawImage(po.canvas, this.point.x + po.x, this.point.y + po.y);
    };

    p.clear = function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    };

    p.toString = function () {
        return "[PixelView]";
    };

    obelisk.PixelView = PixelView;
}(obelisk));

/*global obelisk:true*/

/*
 * Matrix
 */

(function (obelisk) {
    "use strict";

    var Matrix, p;
    Matrix = function (a, b, c, d, tx, ty) {
        this.initialize(a, b, c, d, tx, ty);
    };
    p = Matrix.prototype;

    // public properties:
    /**
     * Position (0, 0) in a 3x3 matrix.
     * @property a
     * @type Number
     **/
    p.a = 1;

    /**
     * Position (0, 1) in a 3x3 matrix.
     * @property b
     * @type Number
     **/
    p.b = 0;

    /**
     * Position (1, 0) in a 3x3 matrix.
     * @property c
     * @type Number
     **/
    p.c = 0;

    /**
     * Position (1, 1) in a 3x3 matrix.
     * @property d
     * @type Number
     **/
    p.d = 1;

    /**
     * Position (2, 0) in a 3x3 matrix.
     * @property tx
     * @type Number
     **/
    p.tx = 0;

    /**
     * Position (2, 1) in a 3x3 matrix.
     * @property ty
     * @type Number
     **/
    p.ty = 0;

    // constructor
    p.initialize = function (a, b, c, d, tx, ty) {
        this.a = (a === undefined) ? 1 : a;
        this.b = b || 0;
        this.c = c || 0;
        this.d = (d === undefined) ? 1 : d;
        this.tx = tx || 0;
        this.ty = ty || 0;
        return this;
    };

    // public methods
    p.toString = function () {
        return "[Matrix]";
    };

    obelisk.Matrix = Matrix;
}(obelisk));

/*global obelisk:true*/

/*
 * Point
 */

(function (obelisk) {
    "use strict";

    var Point, p;
    Point = function (x, y) {
        this.initialize(x, y);
    };
    p = Point.prototype;

    // public properties
    p.x = 0;
    p.y = 0;

    // constructor
    p.initialize = function (x, y) {
        this.x = (x === undefined ? 0 : x);
        this.y = (y === undefined ? 0 : y);
        return this;
    };

    // public methods
    p.toString = function () {
        return "[Point x : " + this.x + ", y : " + this.y + "]";
    };

    // private methods

    obelisk.Point = Point;
}(obelisk));

/*global obelisk:true*/

/*
 * Point3D
 */

(function (obelisk) {
    "use strict";

    var Point3D, p;
    Point3D = function (x, y, z) {
        this.initialize(x, y, z);
    };
    p = Point3D.prototype;

    // public properties
    p.x = 0;
    p.y = 0;
    p.z = 0;

    // constructor
    p.initialize = function (x, y, z) {
        this.x = (x === undefined ? 0 : x);
        this.y = (y === undefined ? 0 : y);
        this.z = (z === undefined ? 0 : z);
        return this;
    };

    // public methods
    p.toGlobalCoordinates = function (offset) {
        var p2D = new obelisk.Point(
            this.x - this.y,
            Math.floor(this.x / 2 + this.y / 2) - this.z
        );

        if (offset !== undefined) {
            p2D.x = p2D.x + offset.x;
            p2D.y = p2D.y + offset.y;
        }

        return p2D;
    };

    p.toString = function () {
        return "[Point3D x : " + this.x + ", y : " + this.y + ", z: " + this.z + "]";
    };

    // private methods

    obelisk.Point3D = Point3D;
}(obelisk));

/*global obelisk:true*/

/*
 * AbstractPrimitive
 */

(function (obelisk) {
    "use strict";

    var AbstractPrimitive, p;
    AbstractPrimitive = function () {
        this.initialize();
    };
    p = AbstractPrimitive.prototype;

    // public properties
    /**
     * the canvas for drawImage to any canvas
     */
    p.canvas = null;

    // protect properties
    /**
     * the width of the bitmap in 2d flash coordinate
     */
    p.w = null;

    /**
     * the height of the bitmap in 2d flash coordinate
     */
    p.h = null;

    /**
     * the dimension of primitive in 3d pixel coordinate
     */
    p.dimension = null;

    /**
     * the color obj of the primitive
     */
    p.color = null;

    /**
     * the border option of the primitive
     */
    p.border = null;

    /**
     * the source bitmapdata contains pixel graphic
     */
    p.bitmapData = null;

    /**
     * the preserve canvas option
     */
    p.useDefaultCanvas = null;

    /**
     * the matrix offset between the bitmap and the 3d pixel coordinate ZERO point
     */
    p.matrix = null;

    // constructor
    p.initialize = function () {
        return this;
    };

    // public methods
    p.toString = function () {
        return "[AbstractPrimitive]";
    };

    // private methods

    obelisk.AbstractPrimitive = AbstractPrimitive;
}(obelisk));

/*global obelisk:true*/

/*
 * Brick
 */

(function (obelisk) {
    "use strict";

    var Brick, p;
    Brick = function (dimension, color, border, useDefaultCanvas) {
        this.initialize(dimension, color, border, useDefaultCanvas);
    };
    p = Brick.prototype = new obelisk.AbstractPrimitive();

    // public properties

    // constructor
    p.initialize = function (dimension, color, border, useDefaultCanvas) {
        this.initRender(dimension, color, border, useDefaultCanvas);
        this.initRectangle();
        this.initBitmapData();
        this.build();
        this.renderBitmapDataForCanvas();
        return this;
    };

    // private method
    p.initRender = function (dimension, color, border, useDefaultCanvas) {
        this.useDefaultCanvas = useDefaultCanvas || false;
        this.border = border || border === undefined;
        this.dimension = dimension === undefined ? new obelisk.BrickDimension() : dimension;
        this.color = color === undefined ? new obelisk.SideColor() : color;
    };

    p.initRectangle = function () {
        this.w = this.dimension.xAxis + this.dimension.yAxis;
        this.h = (this.dimension.xAxis + this.dimension.yAxis) / 2;

        // 22.6 degrees implementation
        this.w -= 2;
        this.h -= 1;

        // the matrix offset between the bitmap and the 3d pixel coordinate ZERO point
        this.matrix = new obelisk.Matrix();
        this.matrix.tx = -this.dimension.yAxis + 2;
        this.matrix.ty = 0;
    };

    p.initBitmapData = function () {
        this.bitmapData = new obelisk.BitmapData(this.w, this.h, this.useDefaultCanvas);
    };
    p.renderBitmapDataForCanvas = function () {
        this.bitmapData.context.putImageData(this.bitmapData.imageData, 0, 0);
        this.canvas = this.bitmapData.canvas;
    };

    p.build = function () {
        var xOffsetInner, yOffsetInner, xOffsetOut, yOffsetOut, i, j, borderColor;
        xOffsetInner = this.dimension.yAxis - 2;
        yOffsetInner = 0;
        xOffsetOut = this.dimension.xAxis - 1;
        yOffsetOut = this.h - 1;
        borderColor = this.border ? this.color.border : this.color.inner;

        //x axis
        for (i = 0; i < this.dimension.xAxis; i += 1) {
            this.bitmapData.setPixel(xOffsetInner + i, yOffsetInner + Math.floor(i / 2), borderColor);
            this.bitmapData.setPixel(xOffsetOut - i, yOffsetOut - Math.floor(i / 2), borderColor);
        }

        //y axis
        for (j = 0; j < this.dimension.yAxis; j += 1) {
            this.bitmapData.setPixel(xOffsetInner + 1 - j, yOffsetInner + Math.floor(j / 2), borderColor);
            this.bitmapData.setPixel(xOffsetOut - 1 + j, yOffsetOut - Math.floor(j / 2), borderColor);
        }

        //fill an pixel graphic enclosed
        this.bitmapData.floodFill(Math.floor(this.w / 2), Math.floor(this.h / 2), this.color.inner);
    };

    // public methods
    p.toString = function () {
        return "[Brick]";
    };

    obelisk.Brick = Brick;
}(obelisk));

/*global obelisk:true*/

/*
 * Cube
 */

(function (obelisk) {
    "use strict";

    var Cube, p;
    Cube = function (dimension, color, border, useDefaultCanvas) {
        this.initialize(dimension, color, border, useDefaultCanvas);
    };
    p = Cube.prototype = new obelisk.AbstractPrimitive();

    // public properties

    // constructor
    p.initialize = function (dimension, color, border, useDefaultCanvas) {
        this.initRender(dimension, color, border, useDefaultCanvas);
        this.initRectangle();
        this.initBitmapData();
        this.build();
        this.renderBitmapDataForCanvas();
        return this;
    };

    // private method
    p.initRender = function (dimension, color, border, useDefaultCanvas) {
        this.useDefaultCanvas = useDefaultCanvas || false;
        this.border = border || border === undefined;
        this.dimension = dimension === undefined ? new obelisk.CubeDimension() : dimension;
        this.color = color === undefined ? new obelisk.CubeColor() : color;
    };

    p.initRectangle = function () {
        this.w = this.dimension.xAxis + this.dimension.yAxis;
        this.h = this.dimension.zAxis + (this.dimension.xAxis + this.dimension.yAxis) / 2;

        // 22.6 degrees implementation
        this.w -= 2;
        this.h -= 1;

        // the matrix offset between the bitmap and the 3d pixel coordinate ZERO point
        this.matrix = new obelisk.Matrix();
        this.matrix.tx = -this.dimension.yAxis + 2;
        this.matrix.ty = -this.dimension.zAxis;
    };

    p.initBitmapData = function () {
        this.bitmapData = new obelisk.BitmapData(this.w, this.h, this.useDefaultCanvas);
    };
    p.renderBitmapDataForCanvas = function () {
        this.canvas = this.bitmapData.canvas;
    };

    p.build = function () {
        var brick, sideX, sideY, po_brick, po_x, po_y, ctx, bmd, offsetX, offsetY,
            i, j, k;
        // horizontal layer
        brick = new obelisk.Brick(
            new obelisk.BrickDimension(this.dimension.xAxis, this.dimension.yAxis),
            new obelisk.SideColor(this.color.border, this.color.horizontal),
            this.border
        );

        // left side
        sideX = new obelisk.SideX(
            new obelisk.SideXDimension(this.dimension.xAxis, this.dimension.zAxis),
            new obelisk.SideColor(this.color.border, this.color.left),
            this.border
        );

        // right side
        sideY = new obelisk.SideY(
            new obelisk.SideYDimension(this.dimension.yAxis, this.dimension.zAxis),
            new obelisk.SideColor(this.color.border, this.color.right),
            this.border
        );

        po_brick = new obelisk.PixelObject(brick);
        po_x = new obelisk.PixelObject(sideX);
        po_y = new obelisk.PixelObject(sideY);

        ctx = this.bitmapData.context;
        ctx.drawImage(po_brick.canvas, po_brick.x + this.dimension.yAxis - 2, po_brick.y);
        ctx.drawImage(po_x.canvas, po_x.x, po_x.y + this.dimension.zAxis + this.dimension.yAxis / 2 - 1);
        ctx.drawImage(po_y.canvas, po_y.x + this.w - 2, po_x.y + this.dimension.zAxis + this.dimension.xAxis / 2 - 1);

        // highlight & highlight fix
        bmd = new obelisk.BitmapData(this.w, this.h);

        if (this.border) {
            offsetX = this.dimension.xAxis - 2;
            offsetY = (this.dimension.xAxis + this.dimension.yAxis) / 2 - 2;

            //the 2px in bounding without hightlight
            for (i = 0; i < this.dimension.xAxis - 2; i += 1) {
                bmd.setPixel(offsetX + 1 - i, offsetY - Math.floor(i / 2), this.color.borderHighlight);
            }

            //the 2px in bounding without hightlight
            for (j = 0; j < this.dimension.yAxis - 2; j += 1) {
                bmd.setPixel(offsetX + j, offsetY - Math.floor(j / 2), this.color.borderHighlight);
            }

            for (k = 0; k < this.dimension.zAxis; k += 1) {
                bmd.setPixel(offsetX, offsetY + k, this.color.borderHighlight);
            }
        } else {
            for (i = 0; i < this.dimension.zAxis; i += 1) {
                bmd.setPixel(this.dimension.xAxis - 2, (this.dimension.xAxis + this.dimension.yAxis) / 2 - 1 + i, this.color.left);
            }
        }
        bmd.context.putImageData(bmd.imageData, 0, 0);
        ctx.drawImage(bmd.canvas, 0, 0);
    };

    // public methods
    p.toString = function () {
        return "[Cube]";
    };

    obelisk.Cube = Cube;
}(obelisk));

/*global obelisk:true*/

/*
 * Pyramid
 */

(function (obelisk) {
    "use strict";

    var Pyramid, p;
    Pyramid = function (dimension, color, border, useDefaultCanvas) {
        this.initialize(dimension, color, border, useDefaultCanvas);
    };
    p = Pyramid.prototype = new obelisk.AbstractPrimitive();

    // private properties
    p.hSize = null;
    p.hOffset = null;

    // constructor
    p.initialize = function (dimension, color, border, useDefaultCanvas) {
        this.initRender(dimension, color, border, useDefaultCanvas);
        this.initRectangle();
        this.initBitmapData();
        this.build();
        this.renderBitmapDataForCanvas();
        return this;
    };

    // private method
    p.initRender = function (dimension, color, border, useDefaultCanvas) {
        this.useDefaultCanvas = useDefaultCanvas || false;
        this.border = border || border === undefined;
        this.dimension = dimension === undefined ? new obelisk.PyramidDimension() : dimension;
        this.color = color === undefined ? new obelisk.PyramidColor() : color;

        this.hSize = this.dimension.tall ? this.dimension.xAxis * 2 : this.dimension.xAxis;
        this.hOffset = this.dimension.tall ? -3 : -2;
    };

    p.initRectangle = function () {
        this.w = this.dimension.xAxis + this.dimension.yAxis;
        this.h = this.hSize + this.dimension.xAxis / 2;

        // 22.6 degrees implementation
        this.w -= 2;
        this.h += this.hOffset;

        // the matrix offset between the bitmap and the 3d pixel coordinate ZERO point
        this.matrix = new obelisk.Matrix();
        this.matrix.tx = -this.dimension.xAxis + 2;
        this.matrix.ty = -this.hSize / 2 + 2 - (this.dimension.tall ? this.dimension.xAxis / 2 : 1);
    };

    p.initBitmapData = function () {
        this.bitmapData = new obelisk.BitmapData(this.w, this.h, this.useDefaultCanvas);
    };
    p.renderBitmapDataForCanvas = function () {
        this.bitmapData.context.putImageData(this.bitmapData.imageData, 0, 0);
        this.canvas = this.bitmapData.canvas;
    };

    p.build = function () {
        var colorborder_left, colorborder_right, colorborder_highlight,
            i, j, k, l1, m1, l2, m2;
        colorborder_left = this.border ? this.color.border : this.color.left;
        colorborder_right = this.border ? this.color.border : this.color.right;

        colorborder_highlight = this.border ? this.color.borderHighlight : colorborder_left;

        //z axis || hightlight
        for (k = 0; k < this.hSize + this.dimension.xAxis / 2 - 4; k += 1) {
            this.bitmapData.setPixel(this.dimension.xAxis - 2, k + 3 + this.hOffset, colorborder_highlight);
        }

        //x axis
        for (i = 0; i < this.dimension.xAxis; i += 1) {
            this.bitmapData.setPixel(i, this.hSize + Math.floor(i / 2) + this.hOffset, colorborder_left);
        }

        //y axis
        for (j = 0; j < this.dimension.xAxis; j += 1) {
            this.bitmapData.setPixel(j + this.dimension.xAxis - 2, this.hSize + this.dimension.xAxis / 2 - Math.floor(j / 2) - 1 + this.hOffset, colorborder_right);
        }

        if (!this.dimension.tall) {
            //left edge
            for (l1 = 0; l1 < this.hSize; l1 += 1) {
                this.bitmapData.setPixel(l1, this.hSize - l1 + this.hOffset, colorborder_left);
            }

            //right edge
            for (m1 = 0; m1 < this.hSize; m1 += 1) {
                this.bitmapData.setPixel(m1 + this.hSize - 2, m1 + 1 + this.hOffset, colorborder_right);
            }
        } else {
            //left edge
            for (l2 = 0; l2 < this.hSize - 2; l2 += 1) {
                this.bitmapData.setPixel(Math.floor(l2 / 2), this.hSize - l2 + this.hOffset, colorborder_left);
            }

            //right edge
            for (m2 = 2; m2 < this.hSize; m2 += 1) {
                this.bitmapData.setPixel(Math.floor(m2 / 2) + this.dimension.xAxis - 2, m2 + 1 + this.hOffset, colorborder_right);
            }
        }

        if (!this.border) {
            this.bitmapData.setPixel(this.dimension.xAxis - 2, this.hSize + this.dimension.xAxis / 2 - 1 + this.hOffset, colorborder_left);
        }

        //floodfill
        this.bitmapData.floodFill(this.dimension.xAxis - 1, this.hSize + Math.floor((this.dimension.xAxis - 1) / 2) + this.hOffset - 1, this.color.right);
        this.bitmapData.floodFill(this.dimension.xAxis - 3, this.hSize + Math.floor((this.dimension.xAxis - 1) / 2) + this.hOffset - 2, this.color.left);
    };

    // public methods
    p.toString = function () {
        return "[Pyramid]";
    };

    obelisk.Pyramid = Pyramid;
}(obelisk));

/*global obelisk:true*/

/*
 * SideX
 */

(function (obelisk) {
    "use strict";
    var SideX, p;
    SideX = function (dimension, color, border, useDefaultCanvas) {
        this.initialize(dimension, color, border, useDefaultCanvas);
    };
    p = SideX.prototype = new obelisk.AbstractPrimitive();

    // public properties

    // constructor
    p.initialize = function (dimension, color, border, useDefaultCanvas) {
        this.initRender(dimension, color, border, useDefaultCanvas);
        this.initRectangle();
        this.initBitmapData();
        this.build();
        this.renderBitmapDataForCanvas();
        return this;
    };

    // private method
    p.initRender = function (dimension, color, border, useDefaultCanvas) {
        this.useDefaultCanvas = useDefaultCanvas || false;
        this.border = border || border === undefined;
        this.dimension = dimension === undefined ? new obelisk.SideXDimension() : dimension;
        this.color = color === undefined ? new obelisk.SideColor() : color;
    };

    p.initRectangle = function () {
        this.w = this.dimension.xAxis;
        this.h = this.dimension.zAxis + this.dimension.xAxis / 2;

        // the matrix offset between the bitmap and the 3d pixel coordinate ZERO point
        this.matrix = new obelisk.Matrix();
        this.matrix.tx = 0;
        this.matrix.ty = -this.dimension.zAxis;
    };

    p.initBitmapData = function () {
        this.bitmapData = new obelisk.BitmapData(this.w, this.h, this.useDefaultCanvas);
    };
    p.renderBitmapDataForCanvas = function () {
        this.bitmapData.context.putImageData(this.bitmapData.imageData, 0, 0);
        this.canvas = this.bitmapData.canvas;
    };

    p.build = function () {
        var xOffsetInner, yOffsetInner, xOffsetOut, yOffsetOut, i, j, borderColor;

        xOffsetInner = 0;
        yOffsetInner = this.dimension.zAxis;
        xOffsetOut = this.dimension.xAxis - 1;
        yOffsetOut = this.h - this.dimension.zAxis - 1;
        borderColor = this.border ? this.color.border : this.color.inner;

        //x axis
        for (i = 0; i < this.dimension.xAxis; i += 1) {
            this.bitmapData.setPixel(xOffsetInner + i, yOffsetInner + Math.floor(i / 2), borderColor);
            this.bitmapData.setPixel(xOffsetOut - i, yOffsetOut - Math.floor(i / 2), borderColor);
        }

        //z axis
        for (j = 0; j < this.dimension.zAxis; j += 1) {
            this.bitmapData.setPixel(xOffsetInner, yOffsetInner - j, borderColor);
            this.bitmapData.setPixel(xOffsetOut, yOffsetOut + j, borderColor);
        }

        //fill an pixel graphic enclosed
        this.bitmapData.floodFill(Math.floor(this.w / 2), Math.floor(this.h / 2), this.color.inner);
    };

    // public methods
    p.toString = function () {
        return "[SideX]";
    };

    obelisk.SideX = SideX;
}(obelisk));

/*global obelisk:true*/

/*
 * SideY
 */

(function (obelisk) {
    "use strict";

    var SideY, p;
    SideY = function (dimension, color, border, useDefaultCanvas) {
        this.initialize(dimension, color, border, useDefaultCanvas);
    };
    p = SideY.prototype = new obelisk.AbstractPrimitive();

    // public properties

    // constructor
    p.initialize = function (dimension, color, border, useDefaultCanvas) {
        this.initRender(dimension, color, border, useDefaultCanvas);
        this.initRectangle();
        this.initBitmapData();
        this.build();
        this.renderBitmapDataForCanvas();
        return this;
    };

    // private method
    p.initRender = function (dimension, color, border, useDefaultCanvas) {
        this.useDefaultCanvas = useDefaultCanvas || false;
        this.border = border || border === undefined;
        this.dimension = dimension === undefined ? new obelisk.SideYDimension() : dimension;
        this.color = color === undefined ? new obelisk.SideColor() : color;
    };

    p.initRectangle = function () {
        this.w = this.dimension.yAxis;
        this.h = this.dimension.zAxis + this.dimension.yAxis / 2;

        // the matrix offset between the bitmap and the 3d pixel coordinate ZERO point
        this.matrix = new obelisk.Matrix();
        this.matrix.tx = -this.dimension.yAxis + 2;
        this.matrix.ty = -this.dimension.zAxis;
    };

    p.initBitmapData = function () {
        this.bitmapData = new obelisk.BitmapData(this.w, this.h, this.useDefaultCanvas);
    };
    p.renderBitmapDataForCanvas = function () {
        this.bitmapData.context.putImageData(this.bitmapData.imageData, 0, 0);
        this.canvas = this.bitmapData.canvas;
    };

    p.build = function () {
        var xOffsetInner, yOffsetInner, xOffsetOut, yOffsetOut, i, j, borderColor;
        xOffsetInner = 0;
        yOffsetInner = this.h - this.dimension.zAxis - 1;
        xOffsetOut = this.dimension.yAxis - 1;
        yOffsetOut = this.dimension.zAxis;
        borderColor = this.border ? this.color.border : this.color.inner;

        //y axis
        for (i = 0; i < this.dimension.yAxis; i += 1) {
            this.bitmapData.setPixel(xOffsetInner + i, yOffsetInner - Math.floor(i / 2), borderColor);
            this.bitmapData.setPixel(xOffsetOut - i, yOffsetOut + Math.floor(i / 2), borderColor);
        }

        //z axis
        for (j = 0; j < this.dimension.zAxis; j += 1) {
            this.bitmapData.setPixel(xOffsetInner, yOffsetInner + j, borderColor);
            this.bitmapData.setPixel(xOffsetOut, yOffsetOut - j, borderColor);
        }

        //fill an pixel graphic enclosed
        this.bitmapData.floodFill(Math.floor(this.w / 2), Math.floor(this.h / 2), this.color.inner);
    };

    // public methods
    p.toString = function () {
        return "[SideY]";
    };

    obelisk.SideY = SideY;
}(obelisk));

/*global obelisk:true*/

/*
 * Slope East
 */

(function (obelisk) {
    "use strict";

    var SlopeEast, p;
    SlopeEast = function (dimension, color, border, useDefaultCanvas) {
        this.initialize(dimension, color, border, useDefaultCanvas);
    };
    p = SlopeEast.prototype = new obelisk.AbstractPrimitive();

    // constructor
    p.initialize = function (dimension, color, border, useDefaultCanvas) {
        this.initRender(dimension, color, border, useDefaultCanvas);
        this.initRectangle();
        this.initBitmapData();
        this.build();
        this.renderBitmapDataForCanvas();
        return this;
    };

    // private method
    p.initRender = function (dimension, color, border, useDefaultCanvas) {
        this.useDefaultCanvas = useDefaultCanvas || false;
        this.border = border || border === undefined;
        this.dimension = dimension === undefined ? new obelisk.SlopeDimension() : dimension;
        this.color = color === undefined ? new obelisk.SlopeColor() : color;
    };

    p.initRectangle = function () {

        this.w = this.dimension.xAxis + this.dimension.yAxis;
        this.h = this.dimension.xAxis * 2 + this.dimension.yAxis / 2;

        // 22.6 degrees implementation
        this.w -= 2;
        this.h -= 3;

        // the matrix offset between the bitmap and the 3d pixel coordinate ZERO point
        this.matrix = new obelisk.Matrix();
        this.matrix.tx = -(this.dimension.yAxis - 2);
        this.matrix.ty = -(this.dimension.xAxis * 3 / 2 - 2);
    };

    p.initBitmapData = function () {
        this.bitmapData = new obelisk.BitmapData(this.w, this.h, this.useDefaultCanvas);
    };
    p.renderBitmapDataForCanvas = function () {
        this.bitmapData.context.putImageData(this.bitmapData.imageData, 0, 0);
        this.canvas = this.bitmapData.canvas;
    };

    p.build = function () {
        var colorBorderLeft, colorBorderRight,
            i, j, k, m, n;

        colorBorderLeft = this.border ? this.color.border : this.color.left;
        colorBorderRight = this.border ? this.color.border : this.color.rightSlope;

        // y axis
        for (j = 0; j < this.dimension.yAxis; j += 1) {
            this.bitmapData.setPixel(j, this.dimension.yAxis / 2 - Math.floor(j / 2) - 1, colorBorderRight);
            this.bitmapData.setPixel(j + this.dimension.xAxis - 2, this.h - Math.floor(j / 2) - 1, colorBorderRight);
        }

        // x axis
        for (i = 0; i < this.dimension.xAxis; i += 1) {
            this.bitmapData.setPixel(i, this.h - this.dimension.xAxis / 2 + Math.floor(i / 2), colorBorderLeft);
        }

        // z axis
        for (k = this.dimension.yAxis / 2 - 1; k < this.h - this.dimension.xAxis / 2; k += 1) {
            this.bitmapData.setPixel(0, k, colorBorderLeft);
        }

        // slot
        for (m = 0; m < this.dimension.xAxis * 2 - 2; m += 1) {
            this.bitmapData.setPixel(this.dimension.yAxis - 1 + Math.floor(m / 2), m, colorBorderRight);
            this.bitmapData.setPixel(1 + Math.floor(m / 2), this.dimension.yAxis / 2 + m - 1, colorBorderRight);
        }

        // flood fill
        this.bitmapData.floodFill(this.dimension.yAxis - 2, 1, this.color.rightSlope);
        this.bitmapData.floodFill(this.dimension.xAxis - 3, this.h - 3, this.color.left);
        // hack single pixel
        this.bitmapData.setPixel(this.dimension.xAxis - 2, this.h - 2, this.color.left);

        // highlight
        if (this.border) {
            for (n = 1; n < this.dimension.xAxis * 2 - 3; n += 1) {
                this.bitmapData.setPixel(1 + Math.floor(n / 2), this.dimension.yAxis / 2 + n - 1, this.color.borderHighlight);
            }
        }
    };

    // public methods
    p.toString = function () {
        return "[SlopeEast]";
    };

    obelisk.SlopeEast = SlopeEast;
}(obelisk));

/*global obelisk:true*/

/*
 * Slope North
 */

(function (obelisk) {
    "use strict";

    var SlopeNorth, p;
    SlopeNorth = function (dimension, color, border, useDefaultCanvas) {
        this.initialize(dimension, color, border, useDefaultCanvas);
    };
    p = SlopeNorth.prototype = new obelisk.AbstractPrimitive();

    // constructor
    p.initialize = function (dimension, color, border, useDefaultCanvas) {
        this.initRender(dimension, color, border, useDefaultCanvas);
        this.initRectangle();
        this.initBitmapData();
        this.build();
        this.renderBitmapDataForCanvas();
        return this;
    };

    // private method
    p.initRender = function (dimension, color, border, useDefaultCanvas) {
        this.useDefaultCanvas = useDefaultCanvas || false;
        this.border = border || border === undefined;
        this.dimension = dimension === undefined ? new obelisk.SlopeDimension() : dimension;
        this.color = color === undefined ? new obelisk.SlopeColor() : color;
    };

    p.initRectangle = function () {

        this.w = this.dimension.xAxis + this.dimension.yAxis;
        this.h = this.dimension.yAxis * 3 / 2 + this.dimension.xAxis / 2;

        // 22.6 degrees implementation
        this.w -= 2;
        this.h -= 3;

        // the matrix offset between the bitmap and the 3d pixel coordinate ZERO point
        this.matrix = new obelisk.Matrix();
        this.matrix.tx = -(this.dimension.yAxis - 2);
        this.matrix.ty = -(this.dimension.yAxis - 2);
    };

    p.initBitmapData = function () {
        this.bitmapData = new obelisk.BitmapData(this.w, this.h, this.useDefaultCanvas);
    };
    p.renderBitmapDataForCanvas = function () {
        this.canvas = this.bitmapData.canvas;
    };

    p.build = function () {
        var colorBorderLeft, colorBorderRight, colorBorderHighlight,
            sideX, poX, ctx, bmd,
            i, j, n;

        colorBorderLeft = this.border ? this.color.border : this.color.left;
        colorBorderRight = this.border ? this.color.border : this.color.right;
        colorBorderHighlight = this.border ? this.color.borderHighlight : this.color.left;

        sideX = new obelisk.SideX(
            new obelisk.SideXDimension(this.dimension.xAxis, this.h - this.dimension.xAxis / 2),
            new obelisk.SideColor(colorBorderLeft, this.color.left)
        );

        poX = new obelisk.PixelObject(sideX);

        ctx = this.bitmapData.context;
        ctx.drawImage(poX.canvas, poX.x, poX.y + this.h - this.dimension.xAxis / 2);

        bmd = new obelisk.BitmapData(this.w, this.h);

        // close the path for floodfill
        for (i = this.h - this.dimension.yAxis * 3 / 2 + 2; i < this.h; i += 1) {
            bmd.setPixel(this.dimension.xAxis - 1, i, colorBorderRight);
        }

        // y axis
        for (j = 1; j < this.dimension.yAxis; j += 1) {
            bmd.setPixel(this.dimension.xAxis + j - 2, this.h - Math.floor(j / 2) - 1, colorBorderRight);
            bmd.setPixel(this.dimension.xAxis + j - 2, this.dimension.xAxis / 2 - 2 + j, colorBorderRight);
        }

        // flood fill
        bmd.floodFill(this.dimension.xAxis + 1, this.h - 3, this.color.right);

        //highlight
        for (n = this.dimension.xAxis / 2; n < this.h - 1; n += 1) {
            bmd.setPixel(this.dimension.xAxis - 1, n, this.color.right);
            bmd.setPixel(this.dimension.xAxis - 2, n, colorBorderHighlight);
        }

        bmd.context.putImageData(bmd.imageData, 0, 0);
        ctx.drawImage(bmd.canvas, 0, 0);
    };

    // public methods
    p.toString = function () {
        return "[SlopeNorth]";
    };

    obelisk.SlopeNorth = SlopeNorth;
}(obelisk));

/*global obelisk:true*/

/*
 * Slope South
 */

(function (obelisk) {
    "use strict";

    var SlopeSouth, p;
    SlopeSouth = function (dimension, color, border, useDefaultCanvas) {
        this.initialize(dimension, color, border, useDefaultCanvas);
    };
    p = SlopeSouth.prototype = new obelisk.AbstractPrimitive();

    // constructor
    p.initialize = function (dimension, color, border, useDefaultCanvas) {
        this.initRender(dimension, color, border, useDefaultCanvas);
        this.initRectangle();
        this.initBitmapData();
        this.build();
        this.renderBitmapDataForCanvas();
        return this;
    };

    // private method
    p.initRender = function (dimension, color, border, useDefaultCanvas) {
        this.useDefaultCanvas = useDefaultCanvas || false;
        this.border = border || border === undefined;
        this.dimension = dimension === undefined ? new obelisk.SlopeDimension() : dimension;
        this.color = color === undefined ? new obelisk.SlopeColor() : color;
    };

    p.initRectangle = function () {

        this.w = this.dimension.xAxis + this.dimension.yAxis;
        this.h = this.dimension.xAxis / 2 + this.dimension.yAxis * 2;

        // 22.6 degrees implementation
        this.w -= 2;
        this.h -= 3;

        // the matrix offset between the bitmap and the 3d pixel coordinate ZERO point
        this.matrix = new obelisk.Matrix();
        this.matrix.tx = -(this.dimension.yAxis - 2);
        this.matrix.ty = -(this.dimension.yAxis * 3 / 2 - 2);
    };

    p.initBitmapData = function () {
        this.bitmapData = new obelisk.BitmapData(this.w, this.h, this.useDefaultCanvas);
    };
    p.renderBitmapDataForCanvas = function () {
        this.bitmapData.context.putImageData(this.bitmapData.imageData, 0, 0);
        this.canvas = this.bitmapData.canvas;
    };

    p.build = function () {
        var colorBorderLeft, colorBorderRight,
            i, j, k, m, n;

        colorBorderLeft = this.border ? this.color.border : this.color.leftSlope;
        colorBorderRight = this.border ? this.color.border : this.color.right;

        // x axis
        for (j = 0; j < this.dimension.xAxis; j += 1) {
            this.bitmapData.setPixel(j, this.dimension.yAxis * 2 + Math.floor(j / 2) - 3, colorBorderLeft);
            this.bitmapData.setPixel(j + this.dimension.yAxis - 2, Math.floor(j / 2), colorBorderLeft);
        }

        // y axis
        for (i = 0; i < this.dimension.yAxis; i += 1) {
            this.bitmapData.setPixel(this.dimension.xAxis - 2 + i, this.h - Math.floor(i / 2) - 1, colorBorderRight);
        }

        // z axis
        for (k = this.dimension.xAxis / 2 - 1; k < this.h - this.dimension.yAxis / 2; k += 1) {
            this.bitmapData.setPixel(this.w - 1, k, colorBorderRight);
        }

        // slot
        for (m = 0; m < this.dimension.yAxis * 2 - 2; m += 1) {
            this.bitmapData.setPixel(Math.floor(m / 2), this.dimension.yAxis * 2 - m - 3, colorBorderLeft);
            this.bitmapData.setPixel(this.dimension.xAxis - 2 + Math.floor(m / 2), this.h - m - 1, colorBorderLeft);
        }

        // flood fill
        this.bitmapData.floodFill(this.dimension.yAxis - 1, 1, this.color.leftSlope);
        this.bitmapData.floodFill(this.dimension.xAxis, this.h - 3, this.color.right);
        // hack single pixel
        this.bitmapData.setPixel(this.dimension.xAxis - 1, this.h - 2, this.color.right);

        // highlight
        if (this.border) {
            for (n = 1; n < this.dimension.yAxis * 2 - 3; n += 1) {
                this.bitmapData.setPixel(this.dimension.xAxis - 2 + Math.floor(n / 2), this.h - n - 1, this.color.borderHighlight);
            }
        }
    };

    // public methods
    p.toString = function () {
        return "[SlopeSouth]";
    };

    obelisk.SlopeSouth = SlopeSouth;
}(obelisk));

/*global obelisk:true*/

/*
 * Slope West
 */

(function (obelisk) {
    "use strict";

    var SlopeWest, p;
    SlopeWest = function (dimension, color, border, useDefaultCanvas) {
        this.initialize(dimension, color, border, useDefaultCanvas);
    };
    p = SlopeWest.prototype = new obelisk.AbstractPrimitive();

    // constructor
    p.initialize = function (dimension, color, border, useDefaultCanvas) {
        this.initRender(dimension, color, border, useDefaultCanvas);
        this.initRectangle();
        this.initBitmapData();
        this.build();
        this.renderBitmapDataForCanvas();
        return this;
    };

    // private method
    p.initRender = function (dimension, color, border, useDefaultCanvas) {
        this.useDefaultCanvas = useDefaultCanvas || false;
        this.border = border || border === undefined;
        this.dimension = dimension === undefined ? new obelisk.SlopeDimension() : dimension;
        this.color = color === undefined ? new obelisk.SlopeColor() : color;
    };

    p.initRectangle = function () {

        this.w = this.dimension.xAxis + this.dimension.yAxis;
        this.h = this.dimension.xAxis * 3 / 2 + this.dimension.yAxis / 2;

        // 22.6 degrees implementation
        this.w -= 2;
        this.h -= 3;

        // the matrix offset between the bitmap and the 3d pixel coordinate ZERO point
        this.matrix = new obelisk.Matrix();
        this.matrix.tx = -(this.dimension.yAxis - 2);
        this.matrix.ty = -(this.dimension.xAxis - 2);
    };

    p.initBitmapData = function () {
        this.bitmapData = new obelisk.BitmapData(this.w, this.h, this.useDefaultCanvas);
    };
    p.renderBitmapDataForCanvas = function () {
        this.canvas = this.bitmapData.canvas;
    };

    p.build = function () {
        var colorBorderLeft, colorBorderRight, colorBorderHighlight,
            sideY, poY, ctx, bmd,
            i, j, n;

        colorBorderLeft = this.border ? this.color.border : this.color.left;
        colorBorderRight = this.border ? this.color.border : this.color.right;
        colorBorderHighlight = this.border ? this.color.borderHighlight : this.color.left;

        sideY = new obelisk.SideY(
            new obelisk.SideYDimension(this.dimension.yAxis, this.h - this.dimension.yAxis / 2),
            new obelisk.SideColor(colorBorderRight, this.color.right)
        );

        poY = new obelisk.PixelObject(sideY);

        ctx = this.bitmapData.context;
        ctx.drawImage(poY.canvas, poY.x + this.w - 2, poY.y + this.h - this.dimension.yAxis / 2);

        bmd = new obelisk.BitmapData(this.w, this.h);

        // close the path for floodfill
        for (i = this.h - this.dimension.xAxis * 3 / 2 + 2; i < this.h; i += 1) {
            bmd.setPixel(this.dimension.xAxis - 2, i, colorBorderLeft);
        }

        //x axis
        for (j = 0; j < this.dimension.xAxis - 1; j += 1) {
            bmd.setPixel(j, this.dimension.xAxis + this.dimension.yAxis / 2 - 3 + Math.floor(j / 2), colorBorderLeft);
            bmd.setPixel(j, this.dimension.xAxis + this.dimension.yAxis / 2 - 3 - j, colorBorderLeft);
        }

        // flood fill
        bmd.floodFill(this.dimension.xAxis - 3, this.h - 3, this.color.left);

        //highlight
        for (n = this.dimension.yAxis / 2; n < this.h - 1; n += 1) {
            bmd.setPixel(this.dimension.xAxis - 2, n, colorBorderHighlight);
        }

        bmd.context.putImageData(bmd.imageData, 0, 0);
        ctx.drawImage(bmd.canvas, 0, 0);
    };

    // public methods
    p.toString = function () {
        return "[SlopeWest]";
    };

    obelisk.SlopeWest = SlopeWest;
}(obelisk));

/*global obelisk:true, document:true*/

/*
 * CanvasManager
 */

(function (obelisk, document) {
    "use strict";

    var CanvasManager, p;
    CanvasManager = function () {
        throw new Error('ColorGeom is a static Class, cannot be instanced.');
    };
    p = CanvasManager;

    // public properties
    p.defaultCanvas = null;

    // public methods
    p.getDefaultCanvas = function () {
        p.defaultCanvas = p.defaultCanvas || document.createElement('canvas');
        return p.defaultCanvas;
    };

    p.getNewCanvas = function () {
        return document.createElement('canvas');
    };

    p.toString = function () {
        return "[CanvasManager]";
    };

    obelisk.CanvasManager = CanvasManager;
}(obelisk, document));

/*global obelisk:true*/

/*
 * CanvasTool
 */

(function (obelisk) {
    "use strict";

    var CanvasTool, p;

    CanvasTool = function () {
        throw new Error('CanvasTool is a static Class, cannot be instanced.');
    };
    p = CanvasTool;

    // public methods
    p.getPixel = function (imageData, x, y) {
        var data, index, r, g, b;
        data = imageData.data;
        index = (y * imageData.width + x) * 4;
        r = data[index];
        g = data[index + 1];
        b = data[index + 2];

        return ((r << 16) | (g << 8) | b);
    };

    p.toString = function () {
        return "[CanvasTool]";
    };

    obelisk.CanvasTool = CanvasTool;
}(obelisk));

/*global obelisk:true*/

/*
 * ColorGeom
 */

(function (obelisk) {
    "use strict";

    var ColorGeom, p;

    ColorGeom = function () {
        throw new Error('ColorGeom is a static Class, cannot be instanced.');
    };
    p = ColorGeom;

    // public methods
    p.get32 = function (color) {
        return color < 0xFF000000 ? (color + 0xFF000000) : color;
    };

    p.applyBrightness = function (color, brightness, highlight) {
        var a, r, g, b, y, v, u;
        a = ((color >>> 24) & 0x000000FF);
        r = ((color >>> 16) & 0x000000FF);
        g = ((color >>> 8) & 0x000000FF);
        b = (color & 0x000000FF);

        y = ((r * 313524) >> 20) + ((g * 615514) >> 20) + ((b * 119538) >> 20);
        u = -((155189 * r) >> 20) - ((303038 * g) >> 20) + ((458227 * b) >> 20);
        v = ((644874 * r) >> 20) - ((540016 * g) >> 20) - ((104857 * b) >> 20);

        if (!highlight) {
            y += brightness;
        } else {
            y = 60 + Math.pow(y, 1.2);
        }

        r = y + ((1195376 * v) >> 20);
        g = y - ((408944 * u) >> 20) - ((608174 * v) >> 20);
        b = y + ((2128609 * u) >> 20);

        r = Math.max(0, Math.min(r, 255));
        g = Math.max(0, Math.min(g, 255));
        b = Math.max(0, Math.min(b, 255));

        return (a << 24) | (r << 16) | (g << 8) | b;
    };

    p.toString = function () {
        return "[ColorGeom]";
    };

    obelisk.ColorGeom = ColorGeom;
}(obelisk));

/*global obelisk:true*/

/*
 * ColorPattern
 */

(function (obelisk) {
    "use strict";

    var ColorPattren, p;

    ColorPattren = function () {
        throw new Error('ColorGeom is a static Class, cannot be instanced.');
    };
    p = ColorPattren;

    // public properties
    p.GRASS_GREEN = 0xCCFF00;
    p.YELLOW = 0xFFFF00;
    p.WINE_RED = 0xFF0099;
    p.PINK = 0xFF7CBF;
    p.PURPLE = 0xCC00FF;
    p.BLUE = 0x00CCFF;
    p.GRAY = 0xEEEEEE;
    p.BLACK = 0x666666;
    p.FINE_COLORS =
        [
            p.GRASS_GREEN,
            p.YELLOW,
            p.WINE_RED,
            p.PINK,
            p.PURPLE,
            p.BLUE,
            p.GRAY,
            p.BLACK
        ];

    // public methods
    p.getRandomComfortableColor = function () {
        return p.FINE_COLORS[Math.floor(Math.random() * p.FINE_COLORS.length)];
    };

    p.toString = function () {
        return "[ColorPattern]";
    };

    obelisk.ColorPattern = ColorPattren;
}(obelisk));

; browserify_shim__define__module__export__(typeof obelisk != "undefined" ? obelisk : window.obelisk);

}).call(global, undefined, undefined, undefined, undefined, function defineExport(ex) { module.exports = ex; });

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],38:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _obeliskJs = require('obelisk.js');

var _obeliskJs2 = _interopRequireDefault(_obeliskJs);

var _jsYaml = require('js-yaml');

var _jsYaml2 = _interopRequireDefault(_jsYaml);

/**
 * @constant DEFAULT_SIZE
 * @type {Number}
 */
var DEFAULT_SIZE = 10;

/**
 * @constant COLOUR_MAP
 * @type {Object}
 */
var COLOUR_MAP = {
    darkBrown: new _obeliskJs2['default'].CubeColor().getByHorizontalColor(0x704A3A),
    lightBrown: new _obeliskJs2['default'].CubeColor().getByHorizontalColor(0xEDCE93)
};

/**
 * @module Giraffe
 * @author Adam Timberlake
 * @link https://github.com/Wildhoney/Giraffe
 * @link http://giraffe-app.herokuapp.com/
 * @licence MIT
 */

var Giraffe = (function () {
    _createClass(Giraffe, null, [{
        key: 'ELEMENT',

        /**
         * @constant ELEMENT
         * @type {String}
         */
        value: 'canvas.giraffe',

        /**
         * @constructor
         * @return {Giraffe}
         */
        enumerable: true
    }]);

    function Giraffe() {
        _classCallCheck(this, Giraffe);

        this.renderModel();
    }

    /**
     * @method getModel
     * @param {String} filename
     * @return {Promise}
     */

    _createClass(Giraffe, [{
        key: 'getModel',
        value: function getModel(filename) {

            /**
             * @method parseItem
             * @param {String} item
             * @param {Object|Number} model
             * @return {Number}
             */
            var parseItem = function parseItem(item, model) {

                if (typeof model === 'undefined') return DEFAULT_SIZE;
                if (typeof model === 'object') return Number((model[item] || 1) * DEFAULT_SIZE);else return Number(model * DEFAULT_SIZE);
            };

            /**
             * @method parseModel
             * @param {Object} model
             * @return {Array}
             */
            var parseModel = function parseModel(model) {

                return model.reduce(function (accumulator, _ref) {
                    var colour = _ref.colour;
                    var size = _ref.size;
                    var position = _ref.position;

                    accumulator.push({
                        colour: COLOUR_MAP[colour],
                        size: { x: parseItem('x', size), y: parseItem('y', size), z: parseItem('z', size) },
                        position: { x: parseItem('x', position), y: parseItem('y', position), z: parseItem('z', position) }
                    });

                    return accumulator;
                }, []);
            };

            return fetch('./model/' + filename).then(function (data) {
                return data.text();
            }).then(function (data) {
                return _jsYaml2['default'].load(data);
            }).then(function (data) {
                return parseModel(data);
            });
        }

        /**
         * @method renderModel
         * @return {void}
         */
    }, {
        key: 'renderModel',
        value: function renderModel() {

            var canvas = this.getElement();
            var point = new _obeliskJs2['default'].Point(200, 200);
            var pixelView = new _obeliskJs2['default'].PixelView(canvas, point);

            this.getModel('Giraffe.yml').then(function (model) {

                model.forEach(function (_ref2) {
                    var colour = _ref2.colour;
                    var size = _ref2.size;
                    var position = _ref2.position;

                    var shapeModel = new _obeliskJs2['default'].CubeDimension(size.x, size.y, size.z);
                    var positionModel = new _obeliskJs2['default'].Point3D(position.x, position.y, position.z);

                    pixelView.renderObject(new _obeliskJs2['default'].Cube(shapeModel, colour, true), positionModel);
                });

                //Object.keys(model).forEach(key => {
                //    //model[key].forEach(component => pixelView.renderObject(component[0], component[1]));
                //
                //    model[key].forEach(({ colour, size, position }) => {
                //
                //        const shapeModel    = new obelisk.CubeDimension(size.x, size.y, size.z);
                //        const positionModel = new obelisk.Point3D(position.x, position.y, position.z);
                //
                //        pixelView.renderObject(new obelisk.Cube(shapeModel, colour, true), positionModel);
                //
                //    });
                //
                //    //const color  = new obelisk.SlopeColor().getByHorizontalColor(0xEDCE93);
                //    //
                //    //var dimensionSouth = new obelisk.SlopeDimension(SIZE, SIZE);
                //    //
                //    //
                //    //var slopeSouth = new obelisk.SlopeSouth(dimensionSouth, color);
                //    //var p3dSouth   = new obelisk.Point3D(80, 50, 50);
                //    //pixelView.renderObject(slopeSouth, p3dSouth);
                //
                //});
            });
        }

        /**
         * @method getElement
         * @return {Element}
         */
    }, {
        key: 'getElement',
        value: function getElement() {

            var canvas = document.querySelector(Giraffe.ELEMENT);
            window.addEventListener('resize', resizeCanvas, false);

            function resizeCanvas() {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }

            resizeCanvas();
            return canvas;
        }
    }]);

    return Giraffe;
})();

exports['default'] = Giraffe;

document.addEventListener('DOMContentLoaded', function () {
    return new Giraffe();
});
module.exports = exports['default'];

},{"js-yaml":6,"obelisk.js":37}]},{},[38])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1yZXNvbHZlL2VtcHR5LmpzIiwibm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2luaGVyaXRzL2luaGVyaXRzX2Jyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL3V0aWwvc3VwcG9ydC9pc0J1ZmZlckJyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvdXRpbC91dGlsLmpzIiwibm9kZV9tb2R1bGVzL2pzLXlhbWwvaW5kZXguanMiLCJub2RlX21vZHVsZXMvanMteWFtbC9saWIvanMteWFtbC5qcyIsIm5vZGVfbW9kdWxlcy9qcy15YW1sL2xpYi9qcy15YW1sL2NvbW1vbi5qcyIsIm5vZGVfbW9kdWxlcy9qcy15YW1sL2xpYi9qcy15YW1sL2R1bXBlci5qcyIsIm5vZGVfbW9kdWxlcy9qcy15YW1sL2xpYi9qcy15YW1sL2V4Y2VwdGlvbi5qcyIsIm5vZGVfbW9kdWxlcy9qcy15YW1sL2xpYi9qcy15YW1sL2xvYWRlci5qcyIsIm5vZGVfbW9kdWxlcy9qcy15YW1sL2xpYi9qcy15YW1sL21hcmsuanMiLCJub2RlX21vZHVsZXMvanMteWFtbC9saWIvanMteWFtbC9zY2hlbWEuanMiLCJub2RlX21vZHVsZXMvanMteWFtbC9saWIvanMteWFtbC9zY2hlbWEvY29yZS5qcyIsIm5vZGVfbW9kdWxlcy9qcy15YW1sL2xpYi9qcy15YW1sL3NjaGVtYS9kZWZhdWx0X2Z1bGwuanMiLCJub2RlX21vZHVsZXMvanMteWFtbC9saWIvanMteWFtbC9zY2hlbWEvZGVmYXVsdF9zYWZlLmpzIiwibm9kZV9tb2R1bGVzL2pzLXlhbWwvbGliL2pzLXlhbWwvc2NoZW1hL2ZhaWxzYWZlLmpzIiwibm9kZV9tb2R1bGVzL2pzLXlhbWwvbGliL2pzLXlhbWwvc2NoZW1hL2pzb24uanMiLCJub2RlX21vZHVsZXMvanMteWFtbC9saWIvanMteWFtbC90eXBlLmpzIiwibm9kZV9tb2R1bGVzL2pzLXlhbWwvbGliL2pzLXlhbWwvdHlwZS9iaW5hcnkuanMiLCJub2RlX21vZHVsZXMvanMteWFtbC9saWIvanMteWFtbC90eXBlL2Jvb2wuanMiLCJub2RlX21vZHVsZXMvanMteWFtbC9saWIvanMteWFtbC90eXBlL2Zsb2F0LmpzIiwibm9kZV9tb2R1bGVzL2pzLXlhbWwvbGliL2pzLXlhbWwvdHlwZS9pbnQuanMiLCJub2RlX21vZHVsZXMvanMteWFtbC9saWIvanMteWFtbC90eXBlL2pzL2Z1bmN0aW9uLmpzIiwibm9kZV9tb2R1bGVzL2pzLXlhbWwvbGliL2pzLXlhbWwvdHlwZS9qcy9yZWdleHAuanMiLCJub2RlX21vZHVsZXMvanMteWFtbC9saWIvanMteWFtbC90eXBlL2pzL3VuZGVmaW5lZC5qcyIsIm5vZGVfbW9kdWxlcy9qcy15YW1sL2xpYi9qcy15YW1sL3R5cGUvbWFwLmpzIiwibm9kZV9tb2R1bGVzL2pzLXlhbWwvbGliL2pzLXlhbWwvdHlwZS9tZXJnZS5qcyIsIm5vZGVfbW9kdWxlcy9qcy15YW1sL2xpYi9qcy15YW1sL3R5cGUvbnVsbC5qcyIsIm5vZGVfbW9kdWxlcy9qcy15YW1sL2xpYi9qcy15YW1sL3R5cGUvb21hcC5qcyIsIm5vZGVfbW9kdWxlcy9qcy15YW1sL2xpYi9qcy15YW1sL3R5cGUvcGFpcnMuanMiLCJub2RlX21vZHVsZXMvanMteWFtbC9saWIvanMteWFtbC90eXBlL3NlcS5qcyIsIm5vZGVfbW9kdWxlcy9qcy15YW1sL2xpYi9qcy15YW1sL3R5cGUvc2V0LmpzIiwibm9kZV9tb2R1bGVzL2pzLXlhbWwvbGliL2pzLXlhbWwvdHlwZS9zdHIuanMiLCJub2RlX21vZHVsZXMvanMteWFtbC9saWIvanMteWFtbC90eXBlL3RpbWVzdGFtcC5qcyIsIm5vZGVfbW9kdWxlcy9qcy15YW1sL25vZGVfbW9kdWxlcy9lc3ByaW1hL2VzcHJpbWEuanMiLCJub2RlX21vZHVsZXMvb2JlbGlzay5qcy9idWlsZC9vYmVsaXNrLmpzIiwiL1VzZXJzL2F0aW1iZXJsYWtlL1dlYnJvb3QvR2lyYWZmZS9zcmMvR2lyYWZmZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDMWtCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3owQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVpREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3pzS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7eUJDcjBFb0IsWUFBWTs7OztzQkFDZixTQUFTOzs7Ozs7OztBQU0xQixJQUFNLFlBQVksR0FBRyxFQUFFLENBQUM7Ozs7OztBQU14QixJQUFNLFVBQVUsR0FBRztBQUNmLGFBQVMsRUFBRSxJQUFJLHVCQUFRLFNBQVMsRUFBRSxDQUFDLG9CQUFvQixDQUFDLFFBQVEsQ0FBQztBQUNqRSxjQUFVLEVBQUUsSUFBSSx1QkFBUSxTQUFTLEVBQUUsQ0FBQyxvQkFBb0IsQ0FBQyxRQUFRLENBQUM7Q0FDckUsQ0FBQzs7Ozs7Ozs7OztJQVNtQixPQUFPO2lCQUFQLE9BQU87Ozs7Ozs7ZUFNUCxnQkFBZ0I7Ozs7Ozs7OztBQU10QixhQVpNLE9BQU8sR0FZVjs4QkFaRyxPQUFPOztBQWFwQixZQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7S0FDdEI7Ozs7Ozs7O2lCQWRnQixPQUFPOztlQXFCaEIsa0JBQUMsUUFBUSxFQUFFOzs7Ozs7OztBQVFmLGdCQUFNLFNBQVMsR0FBRyxTQUFaLFNBQVMsQ0FBSSxJQUFJLEVBQUUsS0FBSyxFQUFLOztBQUUvQixvQkFBSSxPQUFPLEtBQUssS0FBSyxXQUFXLEVBQUUsT0FBTyxZQUFZLENBQUM7QUFDdEQsb0JBQUksT0FBTyxLQUFLLEtBQUssUUFBUSxFQUFLLE9BQU8sTUFBTSxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQSxHQUFJLFlBQVksQ0FBQyxDQUFDLEtBQ2pELE9BQU8sTUFBTSxDQUFDLEtBQUssR0FBRyxZQUFZLENBQUMsQ0FBQzthQUV6RSxDQUFDOzs7Ozs7O0FBT0YsZ0JBQU0sVUFBVSxHQUFHLFNBQWIsVUFBVSxDQUFHLEtBQUssRUFBSTs7QUFFeEIsdUJBQU8sS0FBSyxDQUFDLE1BQU0sQ0FBQyxVQUFDLFdBQVcsRUFBRSxJQUF3QixFQUFLO3dCQUE1QixNQUFNLEdBQVAsSUFBd0IsQ0FBdkIsTUFBTTt3QkFBRSxJQUFJLEdBQWIsSUFBd0IsQ0FBZixJQUFJO3dCQUFFLFFBQVEsR0FBdkIsSUFBd0IsQ0FBVCxRQUFROztBQUVyRCwrQkFBVyxDQUFDLElBQUksQ0FBQztBQUNiLDhCQUFNLEVBQUUsVUFBVSxDQUFDLE1BQU0sQ0FBQztBQUMxQiw0QkFBSSxFQUFFLEVBQUUsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLEVBQUU7QUFDbkYsZ0NBQVEsRUFBRSxFQUFFLENBQUMsRUFBRSxTQUFTLENBQUMsR0FBRyxFQUFFLFFBQVEsQ0FBQyxFQUFFLENBQUMsRUFBRSxTQUFTLENBQUMsR0FBRyxFQUFFLFFBQVEsQ0FBQyxFQUFFLENBQUMsRUFBRSxTQUFTLENBQUMsR0FBRyxFQUFFLFFBQVEsQ0FBQyxFQUFFO3FCQUN0RyxDQUFDLENBQUM7O0FBRUgsMkJBQU8sV0FBVyxDQUFDO2lCQUV0QixFQUFFLEVBQUUsQ0FBQyxDQUFDO2FBRVYsQ0FBQzs7QUFFRixtQkFBTyxLQUFLLGNBQVksUUFBUSxDQUFHLENBQzlCLElBQUksQ0FBQyxVQUFBLElBQUk7dUJBQUksSUFBSSxDQUFDLElBQUksRUFBRTthQUFBLENBQUMsQ0FDekIsSUFBSSxDQUFDLFVBQUEsSUFBSTt1QkFBSSxvQkFBSyxJQUFJLENBQUMsSUFBSSxDQUFDO2FBQUEsQ0FBQyxDQUM3QixJQUFJLENBQUMsVUFBQSxJQUFJO3VCQUFJLFVBQVUsQ0FBQyxJQUFJLENBQUM7YUFBQSxDQUFDLENBQUM7U0FFdkM7Ozs7Ozs7O2VBTVUsdUJBQUc7O0FBRVYsZ0JBQU0sTUFBTSxHQUFNLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztBQUNwQyxnQkFBTSxLQUFLLEdBQU8sSUFBSSx1QkFBUSxLQUFLLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQzlDLGdCQUFNLFNBQVMsR0FBRyxJQUFJLHVCQUFRLFNBQVMsQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUM7O0FBRXZELGdCQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFBLEtBQUssRUFBSTs7QUFFdkMscUJBQUssQ0FBQyxPQUFPLENBQUMsVUFBQyxLQUEwQixFQUFLO3dCQUE3QixNQUFNLEdBQVIsS0FBMEIsQ0FBeEIsTUFBTTt3QkFBRSxJQUFJLEdBQWQsS0FBMEIsQ0FBaEIsSUFBSTt3QkFBRSxRQUFRLEdBQXhCLEtBQTBCLENBQVYsUUFBUTs7QUFFbkMsd0JBQU0sVUFBVSxHQUFNLElBQUksdUJBQVEsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDeEUsd0JBQU0sYUFBYSxHQUFHLElBQUksdUJBQVEsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7O0FBRTlFLDZCQUFTLENBQUMsWUFBWSxDQUFDLElBQUksdUJBQVEsSUFBSSxDQUFDLFVBQVUsRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLEVBQUUsYUFBYSxDQUFDLENBQUM7aUJBRXJGLENBQUMsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O2FBeUJOLENBQUMsQ0FBQztTQUVOOzs7Ozs7OztlQU1TLHNCQUFHOztBQUVULGdCQUFNLE1BQU0sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUN2RCxrQkFBTSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsRUFBRSxZQUFZLEVBQUUsS0FBSyxDQUFDLENBQUM7O0FBRXZELHFCQUFTLFlBQVksR0FBRztBQUNwQixzQkFBTSxDQUFDLEtBQUssR0FBSSxNQUFNLENBQUMsVUFBVSxDQUFDO0FBQ2xDLHNCQUFNLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxXQUFXLENBQUM7YUFDdEM7O0FBRUQsd0JBQVksRUFBRSxDQUFDO0FBQ2YsbUJBQU8sTUFBTSxDQUFDO1NBRWpCOzs7V0FsSWdCLE9BQU87OztxQkFBUCxPQUFPOztBQXNJNUIsUUFBUSxDQUFDLGdCQUFnQixDQUFDLGtCQUFrQixFQUFFO1dBQU0sSUFBSSxPQUFPLEVBQUU7Q0FBQSxDQUFDLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIixudWxsLCJpZiAodHlwZW9mIE9iamVjdC5jcmVhdGUgPT09ICdmdW5jdGlvbicpIHtcbiAgLy8gaW1wbGVtZW50YXRpb24gZnJvbSBzdGFuZGFyZCBub2RlLmpzICd1dGlsJyBtb2R1bGVcbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpbmhlcml0cyhjdG9yLCBzdXBlckN0b3IpIHtcbiAgICBjdG9yLnN1cGVyXyA9IHN1cGVyQ3RvclxuICAgIGN0b3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckN0b3IucHJvdG90eXBlLCB7XG4gICAgICBjb25zdHJ1Y3Rvcjoge1xuICAgICAgICB2YWx1ZTogY3RvcixcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcbn0gZWxzZSB7XG4gIC8vIG9sZCBzY2hvb2wgc2hpbSBmb3Igb2xkIGJyb3dzZXJzXG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaW5oZXJpdHMoY3Rvciwgc3VwZXJDdG9yKSB7XG4gICAgY3Rvci5zdXBlcl8gPSBzdXBlckN0b3JcbiAgICB2YXIgVGVtcEN0b3IgPSBmdW5jdGlvbiAoKSB7fVxuICAgIFRlbXBDdG9yLnByb3RvdHlwZSA9IHN1cGVyQ3Rvci5wcm90b3R5cGVcbiAgICBjdG9yLnByb3RvdHlwZSA9IG5ldyBUZW1wQ3RvcigpXG4gICAgY3Rvci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBjdG9yXG4gIH1cbn1cbiIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxuXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG52YXIgcXVldWUgPSBbXTtcbnZhciBkcmFpbmluZyA9IGZhbHNlO1xudmFyIGN1cnJlbnRRdWV1ZTtcbnZhciBxdWV1ZUluZGV4ID0gLTE7XG5cbmZ1bmN0aW9uIGNsZWFuVXBOZXh0VGljaygpIHtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGlmIChjdXJyZW50UXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHF1ZXVlID0gY3VycmVudFF1ZXVlLmNvbmNhdChxdWV1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgIH1cbiAgICBpZiAocXVldWUubGVuZ3RoKSB7XG4gICAgICAgIGRyYWluUXVldWUoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGNsZWFuVXBOZXh0VGljayk7XG4gICAgZHJhaW5pbmcgPSB0cnVlO1xuXG4gICAgdmFyIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgY3VycmVudFF1ZXVlID0gcXVldWU7XG4gICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIHdoaWxlICgrK3F1ZXVlSW5kZXggPCBsZW4pIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50UXVldWUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UXVldWVbcXVldWVJbmRleF0ucnVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgICAgICBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgfVxuICAgIGN1cnJlbnRRdWV1ZSA9IG51bGw7XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG59XG5cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcXVldWUucHVzaChuZXcgSXRlbShmdW4sIGFyZ3MpKTtcbiAgICBpZiAocXVldWUubGVuZ3RoID09PSAxICYmICFkcmFpbmluZykge1xuICAgICAgICBzZXRUaW1lb3V0KGRyYWluUXVldWUsIDApO1xuICAgIH1cbn07XG5cbi8vIHY4IGxpa2VzIHByZWRpY3RpYmxlIG9iamVjdHNcbmZ1bmN0aW9uIEl0ZW0oZnVuLCBhcnJheSkge1xuICAgIHRoaXMuZnVuID0gZnVuO1xuICAgIHRoaXMuYXJyYXkgPSBhcnJheTtcbn1cbkl0ZW0ucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZ1bi5hcHBseShudWxsLCB0aGlzLmFycmF5KTtcbn07XG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xucHJvY2Vzcy52ZXJzaW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc0J1ZmZlcihhcmcpIHtcbiAgcmV0dXJuIGFyZyAmJiB0eXBlb2YgYXJnID09PSAnb2JqZWN0J1xuICAgICYmIHR5cGVvZiBhcmcuY29weSA9PT0gJ2Z1bmN0aW9uJ1xuICAgICYmIHR5cGVvZiBhcmcuZmlsbCA9PT0gJ2Z1bmN0aW9uJ1xuICAgICYmIHR5cGVvZiBhcmcucmVhZFVJbnQ4ID09PSAnZnVuY3Rpb24nO1xufSIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG52YXIgZm9ybWF0UmVnRXhwID0gLyVbc2RqJV0vZztcbmV4cG9ydHMuZm9ybWF0ID0gZnVuY3Rpb24oZikge1xuICBpZiAoIWlzU3RyaW5nKGYpKSB7XG4gICAgdmFyIG9iamVjdHMgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgb2JqZWN0cy5wdXNoKGluc3BlY3QoYXJndW1lbnRzW2ldKSk7XG4gICAgfVxuICAgIHJldHVybiBvYmplY3RzLmpvaW4oJyAnKTtcbiAgfVxuXG4gIHZhciBpID0gMTtcbiAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XG4gIHZhciBsZW4gPSBhcmdzLmxlbmd0aDtcbiAgdmFyIHN0ciA9IFN0cmluZyhmKS5yZXBsYWNlKGZvcm1hdFJlZ0V4cCwgZnVuY3Rpb24oeCkge1xuICAgIGlmICh4ID09PSAnJSUnKSByZXR1cm4gJyUnO1xuICAgIGlmIChpID49IGxlbikgcmV0dXJuIHg7XG4gICAgc3dpdGNoICh4KSB7XG4gICAgICBjYXNlICclcyc6IHJldHVybiBTdHJpbmcoYXJnc1tpKytdKTtcbiAgICAgIGNhc2UgJyVkJzogcmV0dXJuIE51bWJlcihhcmdzW2krK10pO1xuICAgICAgY2FzZSAnJWonOlxuICAgICAgICB0cnkge1xuICAgICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShhcmdzW2krK10pO1xuICAgICAgICB9IGNhdGNoIChfKSB7XG4gICAgICAgICAgcmV0dXJuICdbQ2lyY3VsYXJdJztcbiAgICAgICAgfVxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIHg7XG4gICAgfVxuICB9KTtcbiAgZm9yICh2YXIgeCA9IGFyZ3NbaV07IGkgPCBsZW47IHggPSBhcmdzWysraV0pIHtcbiAgICBpZiAoaXNOdWxsKHgpIHx8ICFpc09iamVjdCh4KSkge1xuICAgICAgc3RyICs9ICcgJyArIHg7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0ciArPSAnICcgKyBpbnNwZWN0KHgpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gc3RyO1xufTtcblxuXG4vLyBNYXJrIHRoYXQgYSBtZXRob2Qgc2hvdWxkIG5vdCBiZSB1c2VkLlxuLy8gUmV0dXJucyBhIG1vZGlmaWVkIGZ1bmN0aW9uIHdoaWNoIHdhcm5zIG9uY2UgYnkgZGVmYXVsdC5cbi8vIElmIC0tbm8tZGVwcmVjYXRpb24gaXMgc2V0LCB0aGVuIGl0IGlzIGEgbm8tb3AuXG5leHBvcnRzLmRlcHJlY2F0ZSA9IGZ1bmN0aW9uKGZuLCBtc2cpIHtcbiAgLy8gQWxsb3cgZm9yIGRlcHJlY2F0aW5nIHRoaW5ncyBpbiB0aGUgcHJvY2VzcyBvZiBzdGFydGluZyB1cC5cbiAgaWYgKGlzVW5kZWZpbmVkKGdsb2JhbC5wcm9jZXNzKSkge1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBleHBvcnRzLmRlcHJlY2F0ZShmbiwgbXNnKS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH07XG4gIH1cblxuICBpZiAocHJvY2Vzcy5ub0RlcHJlY2F0aW9uID09PSB0cnVlKSB7XG4gICAgcmV0dXJuIGZuO1xuICB9XG5cbiAgdmFyIHdhcm5lZCA9IGZhbHNlO1xuICBmdW5jdGlvbiBkZXByZWNhdGVkKCkge1xuICAgIGlmICghd2FybmVkKSB7XG4gICAgICBpZiAocHJvY2Vzcy50aHJvd0RlcHJlY2F0aW9uKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihtc2cpO1xuICAgICAgfSBlbHNlIGlmIChwcm9jZXNzLnRyYWNlRGVwcmVjYXRpb24pIHtcbiAgICAgICAgY29uc29sZS50cmFjZShtc2cpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihtc2cpO1xuICAgICAgfVxuICAgICAgd2FybmVkID0gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICByZXR1cm4gZGVwcmVjYXRlZDtcbn07XG5cblxudmFyIGRlYnVncyA9IHt9O1xudmFyIGRlYnVnRW52aXJvbjtcbmV4cG9ydHMuZGVidWdsb2cgPSBmdW5jdGlvbihzZXQpIHtcbiAgaWYgKGlzVW5kZWZpbmVkKGRlYnVnRW52aXJvbikpXG4gICAgZGVidWdFbnZpcm9uID0gcHJvY2Vzcy5lbnYuTk9ERV9ERUJVRyB8fCAnJztcbiAgc2V0ID0gc2V0LnRvVXBwZXJDYXNlKCk7XG4gIGlmICghZGVidWdzW3NldF0pIHtcbiAgICBpZiAobmV3IFJlZ0V4cCgnXFxcXGInICsgc2V0ICsgJ1xcXFxiJywgJ2knKS50ZXN0KGRlYnVnRW52aXJvbikpIHtcbiAgICAgIHZhciBwaWQgPSBwcm9jZXNzLnBpZDtcbiAgICAgIGRlYnVnc1tzZXRdID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBtc2cgPSBleHBvcnRzLmZvcm1hdC5hcHBseShleHBvcnRzLCBhcmd1bWVudHMpO1xuICAgICAgICBjb25zb2xlLmVycm9yKCclcyAlZDogJXMnLCBzZXQsIHBpZCwgbXNnKTtcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlYnVnc1tzZXRdID0gZnVuY3Rpb24oKSB7fTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGRlYnVnc1tzZXRdO1xufTtcblxuXG4vKipcbiAqIEVjaG9zIHRoZSB2YWx1ZSBvZiBhIHZhbHVlLiBUcnlzIHRvIHByaW50IHRoZSB2YWx1ZSBvdXRcbiAqIGluIHRoZSBiZXN0IHdheSBwb3NzaWJsZSBnaXZlbiB0aGUgZGlmZmVyZW50IHR5cGVzLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmogVGhlIG9iamVjdCB0byBwcmludCBvdXQuXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0cyBPcHRpb25hbCBvcHRpb25zIG9iamVjdCB0aGF0IGFsdGVycyB0aGUgb3V0cHV0LlxuICovXG4vKiBsZWdhY3k6IG9iaiwgc2hvd0hpZGRlbiwgZGVwdGgsIGNvbG9ycyovXG5mdW5jdGlvbiBpbnNwZWN0KG9iaiwgb3B0cykge1xuICAvLyBkZWZhdWx0IG9wdGlvbnNcbiAgdmFyIGN0eCA9IHtcbiAgICBzZWVuOiBbXSxcbiAgICBzdHlsaXplOiBzdHlsaXplTm9Db2xvclxuICB9O1xuICAvLyBsZWdhY3kuLi5cbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPj0gMykgY3R4LmRlcHRoID0gYXJndW1lbnRzWzJdO1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+PSA0KSBjdHguY29sb3JzID0gYXJndW1lbnRzWzNdO1xuICBpZiAoaXNCb29sZWFuKG9wdHMpKSB7XG4gICAgLy8gbGVnYWN5Li4uXG4gICAgY3R4LnNob3dIaWRkZW4gPSBvcHRzO1xuICB9IGVsc2UgaWYgKG9wdHMpIHtcbiAgICAvLyBnb3QgYW4gXCJvcHRpb25zXCIgb2JqZWN0XG4gICAgZXhwb3J0cy5fZXh0ZW5kKGN0eCwgb3B0cyk7XG4gIH1cbiAgLy8gc2V0IGRlZmF1bHQgb3B0aW9uc1xuICBpZiAoaXNVbmRlZmluZWQoY3R4LnNob3dIaWRkZW4pKSBjdHguc2hvd0hpZGRlbiA9IGZhbHNlO1xuICBpZiAoaXNVbmRlZmluZWQoY3R4LmRlcHRoKSkgY3R4LmRlcHRoID0gMjtcbiAgaWYgKGlzVW5kZWZpbmVkKGN0eC5jb2xvcnMpKSBjdHguY29sb3JzID0gZmFsc2U7XG4gIGlmIChpc1VuZGVmaW5lZChjdHguY3VzdG9tSW5zcGVjdCkpIGN0eC5jdXN0b21JbnNwZWN0ID0gdHJ1ZTtcbiAgaWYgKGN0eC5jb2xvcnMpIGN0eC5zdHlsaXplID0gc3R5bGl6ZVdpdGhDb2xvcjtcbiAgcmV0dXJuIGZvcm1hdFZhbHVlKGN0eCwgb2JqLCBjdHguZGVwdGgpO1xufVxuZXhwb3J0cy5pbnNwZWN0ID0gaW5zcGVjdDtcblxuXG4vLyBodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0FOU0lfZXNjYXBlX2NvZGUjZ3JhcGhpY3Ncbmluc3BlY3QuY29sb3JzID0ge1xuICAnYm9sZCcgOiBbMSwgMjJdLFxuICAnaXRhbGljJyA6IFszLCAyM10sXG4gICd1bmRlcmxpbmUnIDogWzQsIDI0XSxcbiAgJ2ludmVyc2UnIDogWzcsIDI3XSxcbiAgJ3doaXRlJyA6IFszNywgMzldLFxuICAnZ3JleScgOiBbOTAsIDM5XSxcbiAgJ2JsYWNrJyA6IFszMCwgMzldLFxuICAnYmx1ZScgOiBbMzQsIDM5XSxcbiAgJ2N5YW4nIDogWzM2LCAzOV0sXG4gICdncmVlbicgOiBbMzIsIDM5XSxcbiAgJ21hZ2VudGEnIDogWzM1LCAzOV0sXG4gICdyZWQnIDogWzMxLCAzOV0sXG4gICd5ZWxsb3cnIDogWzMzLCAzOV1cbn07XG5cbi8vIERvbid0IHVzZSAnYmx1ZScgbm90IHZpc2libGUgb24gY21kLmV4ZVxuaW5zcGVjdC5zdHlsZXMgPSB7XG4gICdzcGVjaWFsJzogJ2N5YW4nLFxuICAnbnVtYmVyJzogJ3llbGxvdycsXG4gICdib29sZWFuJzogJ3llbGxvdycsXG4gICd1bmRlZmluZWQnOiAnZ3JleScsXG4gICdudWxsJzogJ2JvbGQnLFxuICAnc3RyaW5nJzogJ2dyZWVuJyxcbiAgJ2RhdGUnOiAnbWFnZW50YScsXG4gIC8vIFwibmFtZVwiOiBpbnRlbnRpb25hbGx5IG5vdCBzdHlsaW5nXG4gICdyZWdleHAnOiAncmVkJ1xufTtcblxuXG5mdW5jdGlvbiBzdHlsaXplV2l0aENvbG9yKHN0ciwgc3R5bGVUeXBlKSB7XG4gIHZhciBzdHlsZSA9IGluc3BlY3Quc3R5bGVzW3N0eWxlVHlwZV07XG5cbiAgaWYgKHN0eWxlKSB7XG4gICAgcmV0dXJuICdcXHUwMDFiWycgKyBpbnNwZWN0LmNvbG9yc1tzdHlsZV1bMF0gKyAnbScgKyBzdHIgK1xuICAgICAgICAgICAnXFx1MDAxYlsnICsgaW5zcGVjdC5jb2xvcnNbc3R5bGVdWzFdICsgJ20nO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBzdHI7XG4gIH1cbn1cblxuXG5mdW5jdGlvbiBzdHlsaXplTm9Db2xvcihzdHIsIHN0eWxlVHlwZSkge1xuICByZXR1cm4gc3RyO1xufVxuXG5cbmZ1bmN0aW9uIGFycmF5VG9IYXNoKGFycmF5KSB7XG4gIHZhciBoYXNoID0ge307XG5cbiAgYXJyYXkuZm9yRWFjaChmdW5jdGlvbih2YWwsIGlkeCkge1xuICAgIGhhc2hbdmFsXSA9IHRydWU7XG4gIH0pO1xuXG4gIHJldHVybiBoYXNoO1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdFZhbHVlKGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcykge1xuICAvLyBQcm92aWRlIGEgaG9vayBmb3IgdXNlci1zcGVjaWZpZWQgaW5zcGVjdCBmdW5jdGlvbnMuXG4gIC8vIENoZWNrIHRoYXQgdmFsdWUgaXMgYW4gb2JqZWN0IHdpdGggYW4gaW5zcGVjdCBmdW5jdGlvbiBvbiBpdFxuICBpZiAoY3R4LmN1c3RvbUluc3BlY3QgJiZcbiAgICAgIHZhbHVlICYmXG4gICAgICBpc0Z1bmN0aW9uKHZhbHVlLmluc3BlY3QpICYmXG4gICAgICAvLyBGaWx0ZXIgb3V0IHRoZSB1dGlsIG1vZHVsZSwgaXQncyBpbnNwZWN0IGZ1bmN0aW9uIGlzIHNwZWNpYWxcbiAgICAgIHZhbHVlLmluc3BlY3QgIT09IGV4cG9ydHMuaW5zcGVjdCAmJlxuICAgICAgLy8gQWxzbyBmaWx0ZXIgb3V0IGFueSBwcm90b3R5cGUgb2JqZWN0cyB1c2luZyB0aGUgY2lyY3VsYXIgY2hlY2suXG4gICAgICAhKHZhbHVlLmNvbnN0cnVjdG9yICYmIHZhbHVlLmNvbnN0cnVjdG9yLnByb3RvdHlwZSA9PT0gdmFsdWUpKSB7XG4gICAgdmFyIHJldCA9IHZhbHVlLmluc3BlY3QocmVjdXJzZVRpbWVzLCBjdHgpO1xuICAgIGlmICghaXNTdHJpbmcocmV0KSkge1xuICAgICAgcmV0ID0gZm9ybWF0VmFsdWUoY3R4LCByZXQsIHJlY3Vyc2VUaW1lcyk7XG4gICAgfVxuICAgIHJldHVybiByZXQ7XG4gIH1cblxuICAvLyBQcmltaXRpdmUgdHlwZXMgY2Fubm90IGhhdmUgcHJvcGVydGllc1xuICB2YXIgcHJpbWl0aXZlID0gZm9ybWF0UHJpbWl0aXZlKGN0eCwgdmFsdWUpO1xuICBpZiAocHJpbWl0aXZlKSB7XG4gICAgcmV0dXJuIHByaW1pdGl2ZTtcbiAgfVxuXG4gIC8vIExvb2sgdXAgdGhlIGtleXMgb2YgdGhlIG9iamVjdC5cbiAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyh2YWx1ZSk7XG4gIHZhciB2aXNpYmxlS2V5cyA9IGFycmF5VG9IYXNoKGtleXMpO1xuXG4gIGlmIChjdHguc2hvd0hpZGRlbikge1xuICAgIGtleXMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh2YWx1ZSk7XG4gIH1cblxuICAvLyBJRSBkb2Vzbid0IG1ha2UgZXJyb3IgZmllbGRzIG5vbi1lbnVtZXJhYmxlXG4gIC8vIGh0dHA6Ly9tc2RuLm1pY3Jvc29mdC5jb20vZW4tdXMvbGlicmFyeS9pZS9kd3c1MnNidCh2PXZzLjk0KS5hc3B4XG4gIGlmIChpc0Vycm9yKHZhbHVlKVxuICAgICAgJiYgKGtleXMuaW5kZXhPZignbWVzc2FnZScpID49IDAgfHwga2V5cy5pbmRleE9mKCdkZXNjcmlwdGlvbicpID49IDApKSB7XG4gICAgcmV0dXJuIGZvcm1hdEVycm9yKHZhbHVlKTtcbiAgfVxuXG4gIC8vIFNvbWUgdHlwZSBvZiBvYmplY3Qgd2l0aG91dCBwcm9wZXJ0aWVzIGNhbiBiZSBzaG9ydGN1dHRlZC5cbiAgaWYgKGtleXMubGVuZ3RoID09PSAwKSB7XG4gICAgaWYgKGlzRnVuY3Rpb24odmFsdWUpKSB7XG4gICAgICB2YXIgbmFtZSA9IHZhbHVlLm5hbWUgPyAnOiAnICsgdmFsdWUubmFtZSA6ICcnO1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKCdbRnVuY3Rpb24nICsgbmFtZSArICddJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gICAgaWYgKGlzUmVnRXhwKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKFJlZ0V4cC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSksICdyZWdleHAnKTtcbiAgICB9XG4gICAgaWYgKGlzRGF0ZSh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZShEYXRlLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSwgJ2RhdGUnKTtcbiAgICB9XG4gICAgaWYgKGlzRXJyb3IodmFsdWUpKSB7XG4gICAgICByZXR1cm4gZm9ybWF0RXJyb3IodmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIHZhciBiYXNlID0gJycsIGFycmF5ID0gZmFsc2UsIGJyYWNlcyA9IFsneycsICd9J107XG5cbiAgLy8gTWFrZSBBcnJheSBzYXkgdGhhdCB0aGV5IGFyZSBBcnJheVxuICBpZiAoaXNBcnJheSh2YWx1ZSkpIHtcbiAgICBhcnJheSA9IHRydWU7XG4gICAgYnJhY2VzID0gWydbJywgJ10nXTtcbiAgfVxuXG4gIC8vIE1ha2UgZnVuY3Rpb25zIHNheSB0aGF0IHRoZXkgYXJlIGZ1bmN0aW9uc1xuICBpZiAoaXNGdW5jdGlvbih2YWx1ZSkpIHtcbiAgICB2YXIgbiA9IHZhbHVlLm5hbWUgPyAnOiAnICsgdmFsdWUubmFtZSA6ICcnO1xuICAgIGJhc2UgPSAnIFtGdW5jdGlvbicgKyBuICsgJ10nO1xuICB9XG5cbiAgLy8gTWFrZSBSZWdFeHBzIHNheSB0aGF0IHRoZXkgYXJlIFJlZ0V4cHNcbiAgaWYgKGlzUmVnRXhwKHZhbHVlKSkge1xuICAgIGJhc2UgPSAnICcgKyBSZWdFeHAucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpO1xuICB9XG5cbiAgLy8gTWFrZSBkYXRlcyB3aXRoIHByb3BlcnRpZXMgZmlyc3Qgc2F5IHRoZSBkYXRlXG4gIGlmIChpc0RhdGUodmFsdWUpKSB7XG4gICAgYmFzZSA9ICcgJyArIERhdGUucHJvdG90eXBlLnRvVVRDU3RyaW5nLmNhbGwodmFsdWUpO1xuICB9XG5cbiAgLy8gTWFrZSBlcnJvciB3aXRoIG1lc3NhZ2UgZmlyc3Qgc2F5IHRoZSBlcnJvclxuICBpZiAoaXNFcnJvcih2YWx1ZSkpIHtcbiAgICBiYXNlID0gJyAnICsgZm9ybWF0RXJyb3IodmFsdWUpO1xuICB9XG5cbiAgaWYgKGtleXMubGVuZ3RoID09PSAwICYmICghYXJyYXkgfHwgdmFsdWUubGVuZ3RoID09IDApKSB7XG4gICAgcmV0dXJuIGJyYWNlc1swXSArIGJhc2UgKyBicmFjZXNbMV07XG4gIH1cblxuICBpZiAocmVjdXJzZVRpbWVzIDwgMCkge1xuICAgIGlmIChpc1JlZ0V4cCh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZShSZWdFeHAucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpLCAncmVnZXhwJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZSgnW09iamVjdF0nLCAnc3BlY2lhbCcpO1xuICAgIH1cbiAgfVxuXG4gIGN0eC5zZWVuLnB1c2godmFsdWUpO1xuXG4gIHZhciBvdXRwdXQ7XG4gIGlmIChhcnJheSkge1xuICAgIG91dHB1dCA9IGZvcm1hdEFycmF5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsIGtleXMpO1xuICB9IGVsc2Uge1xuICAgIG91dHB1dCA9IGtleXMubWFwKGZ1bmN0aW9uKGtleSkge1xuICAgICAgcmV0dXJuIGZvcm1hdFByb3BlcnR5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsIGtleSwgYXJyYXkpO1xuICAgIH0pO1xuICB9XG5cbiAgY3R4LnNlZW4ucG9wKCk7XG5cbiAgcmV0dXJuIHJlZHVjZVRvU2luZ2xlU3RyaW5nKG91dHB1dCwgYmFzZSwgYnJhY2VzKTtcbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRQcmltaXRpdmUoY3R4LCB2YWx1ZSkge1xuICBpZiAoaXNVbmRlZmluZWQodmFsdWUpKVxuICAgIHJldHVybiBjdHguc3R5bGl6ZSgndW5kZWZpbmVkJywgJ3VuZGVmaW5lZCcpO1xuICBpZiAoaXNTdHJpbmcodmFsdWUpKSB7XG4gICAgdmFyIHNpbXBsZSA9ICdcXCcnICsgSlNPTi5zdHJpbmdpZnkodmFsdWUpLnJlcGxhY2UoL15cInxcIiQvZywgJycpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvJy9nLCBcIlxcXFwnXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFxcXFwiL2csICdcIicpICsgJ1xcJyc7XG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKHNpbXBsZSwgJ3N0cmluZycpO1xuICB9XG4gIGlmIChpc051bWJlcih2YWx1ZSkpXG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKCcnICsgdmFsdWUsICdudW1iZXInKTtcbiAgaWYgKGlzQm9vbGVhbih2YWx1ZSkpXG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKCcnICsgdmFsdWUsICdib29sZWFuJyk7XG4gIC8vIEZvciBzb21lIHJlYXNvbiB0eXBlb2YgbnVsbCBpcyBcIm9iamVjdFwiLCBzbyBzcGVjaWFsIGNhc2UgaGVyZS5cbiAgaWYgKGlzTnVsbCh2YWx1ZSkpXG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKCdudWxsJywgJ251bGwnKTtcbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRFcnJvcih2YWx1ZSkge1xuICByZXR1cm4gJ1snICsgRXJyb3IucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpICsgJ10nO1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdEFycmF5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsIGtleXMpIHtcbiAgdmFyIG91dHB1dCA9IFtdO1xuICBmb3IgKHZhciBpID0gMCwgbCA9IHZhbHVlLmxlbmd0aDsgaSA8IGw7ICsraSkge1xuICAgIGlmIChoYXNPd25Qcm9wZXJ0eSh2YWx1ZSwgU3RyaW5nKGkpKSkge1xuICAgICAgb3V0cHV0LnB1c2goZm9ybWF0UHJvcGVydHkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cyxcbiAgICAgICAgICBTdHJpbmcoaSksIHRydWUpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgb3V0cHV0LnB1c2goJycpO1xuICAgIH1cbiAgfVxuICBrZXlzLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgaWYgKCFrZXkubWF0Y2goL15cXGQrJC8pKSB7XG4gICAgICBvdXRwdXQucHVzaChmb3JtYXRQcm9wZXJ0eShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLFxuICAgICAgICAgIGtleSwgdHJ1ZSkpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBvdXRwdXQ7XG59XG5cblxuZnVuY3Rpb24gZm9ybWF0UHJvcGVydHkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cywga2V5LCBhcnJheSkge1xuICB2YXIgbmFtZSwgc3RyLCBkZXNjO1xuICBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih2YWx1ZSwga2V5KSB8fCB7IHZhbHVlOiB2YWx1ZVtrZXldIH07XG4gIGlmIChkZXNjLmdldCkge1xuICAgIGlmIChkZXNjLnNldCkge1xuICAgICAgc3RyID0gY3R4LnN0eWxpemUoJ1tHZXR0ZXIvU2V0dGVyXScsICdzcGVjaWFsJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0ciA9IGN0eC5zdHlsaXplKCdbR2V0dGVyXScsICdzcGVjaWFsJyk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGlmIChkZXNjLnNldCkge1xuICAgICAgc3RyID0gY3R4LnN0eWxpemUoJ1tTZXR0ZXJdJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gIH1cbiAgaWYgKCFoYXNPd25Qcm9wZXJ0eSh2aXNpYmxlS2V5cywga2V5KSkge1xuICAgIG5hbWUgPSAnWycgKyBrZXkgKyAnXSc7XG4gIH1cbiAgaWYgKCFzdHIpIHtcbiAgICBpZiAoY3R4LnNlZW4uaW5kZXhPZihkZXNjLnZhbHVlKSA8IDApIHtcbiAgICAgIGlmIChpc051bGwocmVjdXJzZVRpbWVzKSkge1xuICAgICAgICBzdHIgPSBmb3JtYXRWYWx1ZShjdHgsIGRlc2MudmFsdWUsIG51bGwpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3RyID0gZm9ybWF0VmFsdWUoY3R4LCBkZXNjLnZhbHVlLCByZWN1cnNlVGltZXMgLSAxKTtcbiAgICAgIH1cbiAgICAgIGlmIChzdHIuaW5kZXhPZignXFxuJykgPiAtMSkge1xuICAgICAgICBpZiAoYXJyYXkpIHtcbiAgICAgICAgICBzdHIgPSBzdHIuc3BsaXQoJ1xcbicpLm1hcChmdW5jdGlvbihsaW5lKSB7XG4gICAgICAgICAgICByZXR1cm4gJyAgJyArIGxpbmU7XG4gICAgICAgICAgfSkuam9pbignXFxuJykuc3Vic3RyKDIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHN0ciA9ICdcXG4nICsgc3RyLnNwbGl0KCdcXG4nKS5tYXAoZnVuY3Rpb24obGluZSkge1xuICAgICAgICAgICAgcmV0dXJuICcgICAnICsgbGluZTtcbiAgICAgICAgICB9KS5qb2luKCdcXG4nKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBzdHIgPSBjdHguc3R5bGl6ZSgnW0NpcmN1bGFyXScsICdzcGVjaWFsJyk7XG4gICAgfVxuICB9XG4gIGlmIChpc1VuZGVmaW5lZChuYW1lKSkge1xuICAgIGlmIChhcnJheSAmJiBrZXkubWF0Y2goL15cXGQrJC8pKSB7XG4gICAgICByZXR1cm4gc3RyO1xuICAgIH1cbiAgICBuYW1lID0gSlNPTi5zdHJpbmdpZnkoJycgKyBrZXkpO1xuICAgIGlmIChuYW1lLm1hdGNoKC9eXCIoW2EtekEtWl9dW2EtekEtWl8wLTldKilcIiQvKSkge1xuICAgICAgbmFtZSA9IG5hbWUuc3Vic3RyKDEsIG5hbWUubGVuZ3RoIC0gMik7XG4gICAgICBuYW1lID0gY3R4LnN0eWxpemUobmFtZSwgJ25hbWUnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbmFtZSA9IG5hbWUucmVwbGFjZSgvJy9nLCBcIlxcXFwnXCIpXG4gICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXFxcXCIvZywgJ1wiJylcbiAgICAgICAgICAgICAgICAgLnJlcGxhY2UoLyheXCJ8XCIkKS9nLCBcIidcIik7XG4gICAgICBuYW1lID0gY3R4LnN0eWxpemUobmFtZSwgJ3N0cmluZycpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBuYW1lICsgJzogJyArIHN0cjtcbn1cblxuXG5mdW5jdGlvbiByZWR1Y2VUb1NpbmdsZVN0cmluZyhvdXRwdXQsIGJhc2UsIGJyYWNlcykge1xuICB2YXIgbnVtTGluZXNFc3QgPSAwO1xuICB2YXIgbGVuZ3RoID0gb3V0cHV0LnJlZHVjZShmdW5jdGlvbihwcmV2LCBjdXIpIHtcbiAgICBudW1MaW5lc0VzdCsrO1xuICAgIGlmIChjdXIuaW5kZXhPZignXFxuJykgPj0gMCkgbnVtTGluZXNFc3QrKztcbiAgICByZXR1cm4gcHJldiArIGN1ci5yZXBsYWNlKC9cXHUwMDFiXFxbXFxkXFxkP20vZywgJycpLmxlbmd0aCArIDE7XG4gIH0sIDApO1xuXG4gIGlmIChsZW5ndGggPiA2MCkge1xuICAgIHJldHVybiBicmFjZXNbMF0gK1xuICAgICAgICAgICAoYmFzZSA9PT0gJycgPyAnJyA6IGJhc2UgKyAnXFxuICcpICtcbiAgICAgICAgICAgJyAnICtcbiAgICAgICAgICAgb3V0cHV0LmpvaW4oJyxcXG4gICcpICtcbiAgICAgICAgICAgJyAnICtcbiAgICAgICAgICAgYnJhY2VzWzFdO1xuICB9XG5cbiAgcmV0dXJuIGJyYWNlc1swXSArIGJhc2UgKyAnICcgKyBvdXRwdXQuam9pbignLCAnKSArICcgJyArIGJyYWNlc1sxXTtcbn1cblxuXG4vLyBOT1RFOiBUaGVzZSB0eXBlIGNoZWNraW5nIGZ1bmN0aW9ucyBpbnRlbnRpb25hbGx5IGRvbid0IHVzZSBgaW5zdGFuY2VvZmBcbi8vIGJlY2F1c2UgaXQgaXMgZnJhZ2lsZSBhbmQgY2FuIGJlIGVhc2lseSBmYWtlZCB3aXRoIGBPYmplY3QuY3JlYXRlKClgLlxuZnVuY3Rpb24gaXNBcnJheShhcikge1xuICByZXR1cm4gQXJyYXkuaXNBcnJheShhcik7XG59XG5leHBvcnRzLmlzQXJyYXkgPSBpc0FycmF5O1xuXG5mdW5jdGlvbiBpc0Jvb2xlYW4oYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnYm9vbGVhbic7XG59XG5leHBvcnRzLmlzQm9vbGVhbiA9IGlzQm9vbGVhbjtcblxuZnVuY3Rpb24gaXNOdWxsKGFyZykge1xuICByZXR1cm4gYXJnID09PSBudWxsO1xufVxuZXhwb3J0cy5pc051bGwgPSBpc051bGw7XG5cbmZ1bmN0aW9uIGlzTnVsbE9yVW5kZWZpbmVkKGFyZykge1xuICByZXR1cm4gYXJnID09IG51bGw7XG59XG5leHBvcnRzLmlzTnVsbE9yVW5kZWZpbmVkID0gaXNOdWxsT3JVbmRlZmluZWQ7XG5cbmZ1bmN0aW9uIGlzTnVtYmVyKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ251bWJlcic7XG59XG5leHBvcnRzLmlzTnVtYmVyID0gaXNOdW1iZXI7XG5cbmZ1bmN0aW9uIGlzU3RyaW5nKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ3N0cmluZyc7XG59XG5leHBvcnRzLmlzU3RyaW5nID0gaXNTdHJpbmc7XG5cbmZ1bmN0aW9uIGlzU3ltYm9sKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ3N5bWJvbCc7XG59XG5leHBvcnRzLmlzU3ltYm9sID0gaXNTeW1ib2w7XG5cbmZ1bmN0aW9uIGlzVW5kZWZpbmVkKGFyZykge1xuICByZXR1cm4gYXJnID09PSB2b2lkIDA7XG59XG5leHBvcnRzLmlzVW5kZWZpbmVkID0gaXNVbmRlZmluZWQ7XG5cbmZ1bmN0aW9uIGlzUmVnRXhwKHJlKSB7XG4gIHJldHVybiBpc09iamVjdChyZSkgJiYgb2JqZWN0VG9TdHJpbmcocmUpID09PSAnW29iamVjdCBSZWdFeHBdJztcbn1cbmV4cG9ydHMuaXNSZWdFeHAgPSBpc1JlZ0V4cDtcblxuZnVuY3Rpb24gaXNPYmplY3QoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnb2JqZWN0JyAmJiBhcmcgIT09IG51bGw7XG59XG5leHBvcnRzLmlzT2JqZWN0ID0gaXNPYmplY3Q7XG5cbmZ1bmN0aW9uIGlzRGF0ZShkKSB7XG4gIHJldHVybiBpc09iamVjdChkKSAmJiBvYmplY3RUb1N0cmluZyhkKSA9PT0gJ1tvYmplY3QgRGF0ZV0nO1xufVxuZXhwb3J0cy5pc0RhdGUgPSBpc0RhdGU7XG5cbmZ1bmN0aW9uIGlzRXJyb3IoZSkge1xuICByZXR1cm4gaXNPYmplY3QoZSkgJiZcbiAgICAgIChvYmplY3RUb1N0cmluZyhlKSA9PT0gJ1tvYmplY3QgRXJyb3JdJyB8fCBlIGluc3RhbmNlb2YgRXJyb3IpO1xufVxuZXhwb3J0cy5pc0Vycm9yID0gaXNFcnJvcjtcblxuZnVuY3Rpb24gaXNGdW5jdGlvbihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdmdW5jdGlvbic7XG59XG5leHBvcnRzLmlzRnVuY3Rpb24gPSBpc0Z1bmN0aW9uO1xuXG5mdW5jdGlvbiBpc1ByaW1pdGl2ZShhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gbnVsbCB8fFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ2Jvb2xlYW4nIHx8XG4gICAgICAgICB0eXBlb2YgYXJnID09PSAnbnVtYmVyJyB8fFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ3N0cmluZycgfHxcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICdzeW1ib2wnIHx8ICAvLyBFUzYgc3ltYm9sXG4gICAgICAgICB0eXBlb2YgYXJnID09PSAndW5kZWZpbmVkJztcbn1cbmV4cG9ydHMuaXNQcmltaXRpdmUgPSBpc1ByaW1pdGl2ZTtcblxuZXhwb3J0cy5pc0J1ZmZlciA9IHJlcXVpcmUoJy4vc3VwcG9ydC9pc0J1ZmZlcicpO1xuXG5mdW5jdGlvbiBvYmplY3RUb1N0cmluZyhvKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwobyk7XG59XG5cblxuZnVuY3Rpb24gcGFkKG4pIHtcbiAgcmV0dXJuIG4gPCAxMCA/ICcwJyArIG4udG9TdHJpbmcoMTApIDogbi50b1N0cmluZygxMCk7XG59XG5cblxudmFyIG1vbnRocyA9IFsnSmFuJywgJ0ZlYicsICdNYXInLCAnQXByJywgJ01heScsICdKdW4nLCAnSnVsJywgJ0F1ZycsICdTZXAnLFxuICAgICAgICAgICAgICAnT2N0JywgJ05vdicsICdEZWMnXTtcblxuLy8gMjYgRmViIDE2OjE5OjM0XG5mdW5jdGlvbiB0aW1lc3RhbXAoKSB7XG4gIHZhciBkID0gbmV3IERhdGUoKTtcbiAgdmFyIHRpbWUgPSBbcGFkKGQuZ2V0SG91cnMoKSksXG4gICAgICAgICAgICAgIHBhZChkLmdldE1pbnV0ZXMoKSksXG4gICAgICAgICAgICAgIHBhZChkLmdldFNlY29uZHMoKSldLmpvaW4oJzonKTtcbiAgcmV0dXJuIFtkLmdldERhdGUoKSwgbW9udGhzW2QuZ2V0TW9udGgoKV0sIHRpbWVdLmpvaW4oJyAnKTtcbn1cblxuXG4vLyBsb2cgaXMganVzdCBhIHRoaW4gd3JhcHBlciB0byBjb25zb2xlLmxvZyB0aGF0IHByZXBlbmRzIGEgdGltZXN0YW1wXG5leHBvcnRzLmxvZyA9IGZ1bmN0aW9uKCkge1xuICBjb25zb2xlLmxvZygnJXMgLSAlcycsIHRpbWVzdGFtcCgpLCBleHBvcnRzLmZvcm1hdC5hcHBseShleHBvcnRzLCBhcmd1bWVudHMpKTtcbn07XG5cblxuLyoqXG4gKiBJbmhlcml0IHRoZSBwcm90b3R5cGUgbWV0aG9kcyBmcm9tIG9uZSBjb25zdHJ1Y3RvciBpbnRvIGFub3RoZXIuXG4gKlxuICogVGhlIEZ1bmN0aW9uLnByb3RvdHlwZS5pbmhlcml0cyBmcm9tIGxhbmcuanMgcmV3cml0dGVuIGFzIGEgc3RhbmRhbG9uZVxuICogZnVuY3Rpb24gKG5vdCBvbiBGdW5jdGlvbi5wcm90b3R5cGUpLiBOT1RFOiBJZiB0aGlzIGZpbGUgaXMgdG8gYmUgbG9hZGVkXG4gKiBkdXJpbmcgYm9vdHN0cmFwcGluZyB0aGlzIGZ1bmN0aW9uIG5lZWRzIHRvIGJlIHJld3JpdHRlbiB1c2luZyBzb21lIG5hdGl2ZVxuICogZnVuY3Rpb25zIGFzIHByb3RvdHlwZSBzZXR1cCB1c2luZyBub3JtYWwgSmF2YVNjcmlwdCBkb2VzIG5vdCB3b3JrIGFzXG4gKiBleHBlY3RlZCBkdXJpbmcgYm9vdHN0cmFwcGluZyAoc2VlIG1pcnJvci5qcyBpbiByMTE0OTAzKS5cbiAqXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjdG9yIENvbnN0cnVjdG9yIGZ1bmN0aW9uIHdoaWNoIG5lZWRzIHRvIGluaGVyaXQgdGhlXG4gKiAgICAgcHJvdG90eXBlLlxuICogQHBhcmFtIHtmdW5jdGlvbn0gc3VwZXJDdG9yIENvbnN0cnVjdG9yIGZ1bmN0aW9uIHRvIGluaGVyaXQgcHJvdG90eXBlIGZyb20uXG4gKi9cbmV4cG9ydHMuaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpO1xuXG5leHBvcnRzLl9leHRlbmQgPSBmdW5jdGlvbihvcmlnaW4sIGFkZCkge1xuICAvLyBEb24ndCBkbyBhbnl0aGluZyBpZiBhZGQgaXNuJ3QgYW4gb2JqZWN0XG4gIGlmICghYWRkIHx8ICFpc09iamVjdChhZGQpKSByZXR1cm4gb3JpZ2luO1xuXG4gIHZhciBrZXlzID0gT2JqZWN0LmtleXMoYWRkKTtcbiAgdmFyIGkgPSBrZXlzLmxlbmd0aDtcbiAgd2hpbGUgKGktLSkge1xuICAgIG9yaWdpbltrZXlzW2ldXSA9IGFkZFtrZXlzW2ldXTtcbiAgfVxuICByZXR1cm4gb3JpZ2luO1xufTtcblxuZnVuY3Rpb24gaGFzT3duUHJvcGVydHkob2JqLCBwcm9wKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKTtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxuXG52YXIgeWFtbCA9IHJlcXVpcmUoJy4vbGliL2pzLXlhbWwuanMnKTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IHlhbWw7XG4iLCIndXNlIHN0cmljdCc7XG5cblxudmFyIGxvYWRlciA9IHJlcXVpcmUoJy4vanMteWFtbC9sb2FkZXInKTtcbnZhciBkdW1wZXIgPSByZXF1aXJlKCcuL2pzLXlhbWwvZHVtcGVyJyk7XG5cblxuZnVuY3Rpb24gZGVwcmVjYXRlZChuYW1lKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdGdW5jdGlvbiAnICsgbmFtZSArICcgaXMgZGVwcmVjYXRlZCBhbmQgY2Fubm90IGJlIHVzZWQuJyk7XG4gIH07XG59XG5cblxubW9kdWxlLmV4cG9ydHMuVHlwZSAgICAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vanMteWFtbC90eXBlJyk7XG5tb2R1bGUuZXhwb3J0cy5TY2hlbWEgICAgICAgICAgICAgID0gcmVxdWlyZSgnLi9qcy15YW1sL3NjaGVtYScpO1xubW9kdWxlLmV4cG9ydHMuRkFJTFNBRkVfU0NIRU1BICAgICA9IHJlcXVpcmUoJy4vanMteWFtbC9zY2hlbWEvZmFpbHNhZmUnKTtcbm1vZHVsZS5leHBvcnRzLkpTT05fU0NIRU1BICAgICAgICAgPSByZXF1aXJlKCcuL2pzLXlhbWwvc2NoZW1hL2pzb24nKTtcbm1vZHVsZS5leHBvcnRzLkNPUkVfU0NIRU1BICAgICAgICAgPSByZXF1aXJlKCcuL2pzLXlhbWwvc2NoZW1hL2NvcmUnKTtcbm1vZHVsZS5leHBvcnRzLkRFRkFVTFRfU0FGRV9TQ0hFTUEgPSByZXF1aXJlKCcuL2pzLXlhbWwvc2NoZW1hL2RlZmF1bHRfc2FmZScpO1xubW9kdWxlLmV4cG9ydHMuREVGQVVMVF9GVUxMX1NDSEVNQSA9IHJlcXVpcmUoJy4vanMteWFtbC9zY2hlbWEvZGVmYXVsdF9mdWxsJyk7XG5tb2R1bGUuZXhwb3J0cy5sb2FkICAgICAgICAgICAgICAgID0gbG9hZGVyLmxvYWQ7XG5tb2R1bGUuZXhwb3J0cy5sb2FkQWxsICAgICAgICAgICAgID0gbG9hZGVyLmxvYWRBbGw7XG5tb2R1bGUuZXhwb3J0cy5zYWZlTG9hZCAgICAgICAgICAgID0gbG9hZGVyLnNhZmVMb2FkO1xubW9kdWxlLmV4cG9ydHMuc2FmZUxvYWRBbGwgICAgICAgICA9IGxvYWRlci5zYWZlTG9hZEFsbDtcbm1vZHVsZS5leHBvcnRzLmR1bXAgICAgICAgICAgICAgICAgPSBkdW1wZXIuZHVtcDtcbm1vZHVsZS5leHBvcnRzLnNhZmVEdW1wICAgICAgICAgICAgPSBkdW1wZXIuc2FmZUR1bXA7XG5tb2R1bGUuZXhwb3J0cy5ZQU1MRXhjZXB0aW9uICAgICAgID0gcmVxdWlyZSgnLi9qcy15YW1sL2V4Y2VwdGlvbicpO1xuXG4vLyBEZXByZWNhdGVkIHNjaGVtYSBuYW1lcyBmcm9tIEpTLVlBTUwgMi4wLnhcbm1vZHVsZS5leHBvcnRzLk1JTklNQUxfU0NIRU1BID0gcmVxdWlyZSgnLi9qcy15YW1sL3NjaGVtYS9mYWlsc2FmZScpO1xubW9kdWxlLmV4cG9ydHMuU0FGRV9TQ0hFTUEgICAgPSByZXF1aXJlKCcuL2pzLXlhbWwvc2NoZW1hL2RlZmF1bHRfc2FmZScpO1xubW9kdWxlLmV4cG9ydHMuREVGQVVMVF9TQ0hFTUEgPSByZXF1aXJlKCcuL2pzLXlhbWwvc2NoZW1hL2RlZmF1bHRfZnVsbCcpO1xuXG4vLyBEZXByZWNhdGVkIGZ1bmN0aW9ucyBmcm9tIEpTLVlBTUwgMS54Lnhcbm1vZHVsZS5leHBvcnRzLnNjYW4gICAgICAgICAgID0gZGVwcmVjYXRlZCgnc2NhbicpO1xubW9kdWxlLmV4cG9ydHMucGFyc2UgICAgICAgICAgPSBkZXByZWNhdGVkKCdwYXJzZScpO1xubW9kdWxlLmV4cG9ydHMuY29tcG9zZSAgICAgICAgPSBkZXByZWNhdGVkKCdjb21wb3NlJyk7XG5tb2R1bGUuZXhwb3J0cy5hZGRDb25zdHJ1Y3RvciA9IGRlcHJlY2F0ZWQoJ2FkZENvbnN0cnVjdG9yJyk7XG4iLCIndXNlIHN0cmljdCc7XG5cblxuZnVuY3Rpb24gaXNOb3RoaW5nKHN1YmplY3QpIHtcbiAgcmV0dXJuICh0eXBlb2Ygc3ViamVjdCA9PT0gJ3VuZGVmaW5lZCcpIHx8IChudWxsID09PSBzdWJqZWN0KTtcbn1cblxuXG5mdW5jdGlvbiBpc09iamVjdChzdWJqZWN0KSB7XG4gIHJldHVybiAodHlwZW9mIHN1YmplY3QgPT09ICdvYmplY3QnKSAmJiAobnVsbCAhPT0gc3ViamVjdCk7XG59XG5cblxuZnVuY3Rpb24gdG9BcnJheShzZXF1ZW5jZSkge1xuICBpZiAoQXJyYXkuaXNBcnJheShzZXF1ZW5jZSkpIHtcbiAgICByZXR1cm4gc2VxdWVuY2U7XG4gIH0gZWxzZSBpZiAoaXNOb3RoaW5nKHNlcXVlbmNlKSkge1xuICAgIHJldHVybiBbXTtcbiAgfVxuICByZXR1cm4gWyBzZXF1ZW5jZSBdO1xufVxuXG5cbmZ1bmN0aW9uIGV4dGVuZCh0YXJnZXQsIHNvdXJjZSkge1xuICB2YXIgaW5kZXgsIGxlbmd0aCwga2V5LCBzb3VyY2VLZXlzO1xuXG4gIGlmIChzb3VyY2UpIHtcbiAgICBzb3VyY2VLZXlzID0gT2JqZWN0LmtleXMoc291cmNlKTtcblxuICAgIGZvciAoaW5kZXggPSAwLCBsZW5ndGggPSBzb3VyY2VLZXlzLmxlbmd0aDsgaW5kZXggPCBsZW5ndGg7IGluZGV4ICs9IDEpIHtcbiAgICAgIGtleSA9IHNvdXJjZUtleXNbaW5kZXhdO1xuICAgICAgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGFyZ2V0O1xufVxuXG5cbmZ1bmN0aW9uIHJlcGVhdChzdHJpbmcsIGNvdW50KSB7XG4gIHZhciByZXN1bHQgPSAnJywgY3ljbGU7XG5cbiAgZm9yIChjeWNsZSA9IDA7IGN5Y2xlIDwgY291bnQ7IGN5Y2xlICs9IDEpIHtcbiAgICByZXN1bHQgKz0gc3RyaW5nO1xuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuXG5mdW5jdGlvbiBpc05lZ2F0aXZlWmVybyhudW1iZXIpIHtcbiAgcmV0dXJuICgwID09PSBudW1iZXIpICYmIChOdW1iZXIuTkVHQVRJVkVfSU5GSU5JVFkgPT09IDEgLyBudW1iZXIpO1xufVxuXG5cbm1vZHVsZS5leHBvcnRzLmlzTm90aGluZyAgICAgID0gaXNOb3RoaW5nO1xubW9kdWxlLmV4cG9ydHMuaXNPYmplY3QgICAgICAgPSBpc09iamVjdDtcbm1vZHVsZS5leHBvcnRzLnRvQXJyYXkgICAgICAgID0gdG9BcnJheTtcbm1vZHVsZS5leHBvcnRzLnJlcGVhdCAgICAgICAgID0gcmVwZWF0O1xubW9kdWxlLmV4cG9ydHMuaXNOZWdhdGl2ZVplcm8gPSBpc05lZ2F0aXZlWmVybztcbm1vZHVsZS5leHBvcnRzLmV4dGVuZCAgICAgICAgID0gZXh0ZW5kO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKmVzbGludC1kaXNhYmxlIG5vLXVzZS1iZWZvcmUtZGVmaW5lKi9cblxudmFyIGNvbW1vbiAgICAgICAgICAgICAgPSByZXF1aXJlKCcuL2NvbW1vbicpO1xudmFyIFlBTUxFeGNlcHRpb24gICAgICAgPSByZXF1aXJlKCcuL2V4Y2VwdGlvbicpO1xudmFyIERFRkFVTFRfRlVMTF9TQ0hFTUEgPSByZXF1aXJlKCcuL3NjaGVtYS9kZWZhdWx0X2Z1bGwnKTtcbnZhciBERUZBVUxUX1NBRkVfU0NIRU1BID0gcmVxdWlyZSgnLi9zY2hlbWEvZGVmYXVsdF9zYWZlJyk7XG5cbnZhciBfdG9TdHJpbmcgICAgICAgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xudmFyIF9oYXNPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG5cbnZhciBDSEFSX1RBQiAgICAgICAgICAgICAgICAgID0gMHgwOTsgLyogVGFiICovXG52YXIgQ0hBUl9MSU5FX0ZFRUQgICAgICAgICAgICA9IDB4MEE7IC8qIExGICovXG52YXIgQ0hBUl9DQVJSSUFHRV9SRVRVUk4gICAgICA9IDB4MEQ7IC8qIENSICovXG52YXIgQ0hBUl9TUEFDRSAgICAgICAgICAgICAgICA9IDB4MjA7IC8qIFNwYWNlICovXG52YXIgQ0hBUl9FWENMQU1BVElPTiAgICAgICAgICA9IDB4MjE7IC8qICEgKi9cbnZhciBDSEFSX0RPVUJMRV9RVU9URSAgICAgICAgID0gMHgyMjsgLyogXCIgKi9cbnZhciBDSEFSX1NIQVJQICAgICAgICAgICAgICAgID0gMHgyMzsgLyogIyAqL1xudmFyIENIQVJfUEVSQ0VOVCAgICAgICAgICAgICAgPSAweDI1OyAvKiAlICovXG52YXIgQ0hBUl9BTVBFUlNBTkQgICAgICAgICAgICA9IDB4MjY7IC8qICYgKi9cbnZhciBDSEFSX1NJTkdMRV9RVU9URSAgICAgICAgID0gMHgyNzsgLyogJyAqL1xudmFyIENIQVJfQVNURVJJU0sgICAgICAgICAgICAgPSAweDJBOyAvKiAqICovXG52YXIgQ0hBUl9DT01NQSAgICAgICAgICAgICAgICA9IDB4MkM7IC8qICwgKi9cbnZhciBDSEFSX01JTlVTICAgICAgICAgICAgICAgID0gMHgyRDsgLyogLSAqL1xudmFyIENIQVJfQ09MT04gICAgICAgICAgICAgICAgPSAweDNBOyAvKiA6ICovXG52YXIgQ0hBUl9HUkVBVEVSX1RIQU4gICAgICAgICA9IDB4M0U7IC8qID4gKi9cbnZhciBDSEFSX1FVRVNUSU9OICAgICAgICAgICAgID0gMHgzRjsgLyogPyAqL1xudmFyIENIQVJfQ09NTUVSQ0lBTF9BVCAgICAgICAgPSAweDQwOyAvKiBAICovXG52YXIgQ0hBUl9MRUZUX1NRVUFSRV9CUkFDS0VUICA9IDB4NUI7IC8qIFsgKi9cbnZhciBDSEFSX1JJR0hUX1NRVUFSRV9CUkFDS0VUID0gMHg1RDsgLyogXSAqL1xudmFyIENIQVJfR1JBVkVfQUNDRU5UICAgICAgICAgPSAweDYwOyAvKiBgICovXG52YXIgQ0hBUl9MRUZUX0NVUkxZX0JSQUNLRVQgICA9IDB4N0I7IC8qIHsgKi9cbnZhciBDSEFSX1ZFUlRJQ0FMX0xJTkUgICAgICAgID0gMHg3QzsgLyogfCAqL1xudmFyIENIQVJfUklHSFRfQ1VSTFlfQlJBQ0tFVCAgPSAweDdEOyAvKiB9ICovXG5cbnZhciBFU0NBUEVfU0VRVUVOQ0VTID0ge307XG5cbkVTQ0FQRV9TRVFVRU5DRVNbMHgwMF0gICA9ICdcXFxcMCc7XG5FU0NBUEVfU0VRVUVOQ0VTWzB4MDddICAgPSAnXFxcXGEnO1xuRVNDQVBFX1NFUVVFTkNFU1sweDA4XSAgID0gJ1xcXFxiJztcbkVTQ0FQRV9TRVFVRU5DRVNbMHgwOV0gICA9ICdcXFxcdCc7XG5FU0NBUEVfU0VRVUVOQ0VTWzB4MEFdICAgPSAnXFxcXG4nO1xuRVNDQVBFX1NFUVVFTkNFU1sweDBCXSAgID0gJ1xcXFx2JztcbkVTQ0FQRV9TRVFVRU5DRVNbMHgwQ10gICA9ICdcXFxcZic7XG5FU0NBUEVfU0VRVUVOQ0VTWzB4MERdICAgPSAnXFxcXHInO1xuRVNDQVBFX1NFUVVFTkNFU1sweDFCXSAgID0gJ1xcXFxlJztcbkVTQ0FQRV9TRVFVRU5DRVNbMHgyMl0gICA9ICdcXFxcXCInO1xuRVNDQVBFX1NFUVVFTkNFU1sweDVDXSAgID0gJ1xcXFxcXFxcJztcbkVTQ0FQRV9TRVFVRU5DRVNbMHg4NV0gICA9ICdcXFxcTic7XG5FU0NBUEVfU0VRVUVOQ0VTWzB4QTBdICAgPSAnXFxcXF8nO1xuRVNDQVBFX1NFUVVFTkNFU1sweDIwMjhdID0gJ1xcXFxMJztcbkVTQ0FQRV9TRVFVRU5DRVNbMHgyMDI5XSA9ICdcXFxcUCc7XG5cbnZhciBERVBSRUNBVEVEX0JPT0xFQU5TX1NZTlRBWCA9IFtcbiAgJ3knLCAnWScsICd5ZXMnLCAnWWVzJywgJ1lFUycsICdvbicsICdPbicsICdPTicsXG4gICduJywgJ04nLCAnbm8nLCAnTm8nLCAnTk8nLCAnb2ZmJywgJ09mZicsICdPRkYnXG5dO1xuXG5mdW5jdGlvbiBjb21waWxlU3R5bGVNYXAoc2NoZW1hLCBtYXApIHtcbiAgdmFyIHJlc3VsdCwga2V5cywgaW5kZXgsIGxlbmd0aCwgdGFnLCBzdHlsZSwgdHlwZTtcblxuICBpZiAobnVsbCA9PT0gbWFwKSB7XG4gICAgcmV0dXJuIHt9O1xuICB9XG5cbiAgcmVzdWx0ID0ge307XG4gIGtleXMgPSBPYmplY3Qua2V5cyhtYXApO1xuXG4gIGZvciAoaW5kZXggPSAwLCBsZW5ndGggPSBrZXlzLmxlbmd0aDsgaW5kZXggPCBsZW5ndGg7IGluZGV4ICs9IDEpIHtcbiAgICB0YWcgPSBrZXlzW2luZGV4XTtcbiAgICBzdHlsZSA9IFN0cmluZyhtYXBbdGFnXSk7XG5cbiAgICBpZiAoJyEhJyA9PT0gdGFnLnNsaWNlKDAsIDIpKSB7XG4gICAgICB0YWcgPSAndGFnOnlhbWwub3JnLDIwMDI6JyArIHRhZy5zbGljZSgyKTtcbiAgICB9XG5cbiAgICB0eXBlID0gc2NoZW1hLmNvbXBpbGVkVHlwZU1hcFt0YWddO1xuXG4gICAgaWYgKHR5cGUgJiYgX2hhc093blByb3BlcnR5LmNhbGwodHlwZS5zdHlsZUFsaWFzZXMsIHN0eWxlKSkge1xuICAgICAgc3R5bGUgPSB0eXBlLnN0eWxlQWxpYXNlc1tzdHlsZV07XG4gICAgfVxuXG4gICAgcmVzdWx0W3RhZ10gPSBzdHlsZTtcbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIGVuY29kZUhleChjaGFyYWN0ZXIpIHtcbiAgdmFyIHN0cmluZywgaGFuZGxlLCBsZW5ndGg7XG5cbiAgc3RyaW5nID0gY2hhcmFjdGVyLnRvU3RyaW5nKDE2KS50b1VwcGVyQ2FzZSgpO1xuXG4gIGlmIChjaGFyYWN0ZXIgPD0gMHhGRikge1xuICAgIGhhbmRsZSA9ICd4JztcbiAgICBsZW5ndGggPSAyO1xuICB9IGVsc2UgaWYgKGNoYXJhY3RlciA8PSAweEZGRkYpIHtcbiAgICBoYW5kbGUgPSAndSc7XG4gICAgbGVuZ3RoID0gNDtcbiAgfSBlbHNlIGlmIChjaGFyYWN0ZXIgPD0gMHhGRkZGRkZGRikge1xuICAgIGhhbmRsZSA9ICdVJztcbiAgICBsZW5ndGggPSA4O1xuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBZQU1MRXhjZXB0aW9uKCdjb2RlIHBvaW50IHdpdGhpbiBhIHN0cmluZyBtYXkgbm90IGJlIGdyZWF0ZXIgdGhhbiAweEZGRkZGRkZGJyk7XG4gIH1cblxuICByZXR1cm4gJ1xcXFwnICsgaGFuZGxlICsgY29tbW9uLnJlcGVhdCgnMCcsIGxlbmd0aCAtIHN0cmluZy5sZW5ndGgpICsgc3RyaW5nO1xufVxuXG5mdW5jdGlvbiBTdGF0ZShvcHRpb25zKSB7XG4gIHRoaXMuc2NoZW1hICAgICAgPSBvcHRpb25zWydzY2hlbWEnXSB8fCBERUZBVUxUX0ZVTExfU0NIRU1BO1xuICB0aGlzLmluZGVudCAgICAgID0gTWF0aC5tYXgoMSwgKG9wdGlvbnNbJ2luZGVudCddIHx8IDIpKTtcbiAgdGhpcy5za2lwSW52YWxpZCA9IG9wdGlvbnNbJ3NraXBJbnZhbGlkJ10gfHwgZmFsc2U7XG4gIHRoaXMuZmxvd0xldmVsICAgPSAoY29tbW9uLmlzTm90aGluZyhvcHRpb25zWydmbG93TGV2ZWwnXSkgPyAtMSA6IG9wdGlvbnNbJ2Zsb3dMZXZlbCddKTtcbiAgdGhpcy5zdHlsZU1hcCAgICA9IGNvbXBpbGVTdHlsZU1hcCh0aGlzLnNjaGVtYSwgb3B0aW9uc1snc3R5bGVzJ10gfHwgbnVsbCk7XG4gIHRoaXMuc29ydEtleXMgICAgPSBvcHRpb25zWydzb3J0S2V5cyddIHx8IGZhbHNlO1xuXG4gIHRoaXMuaW1wbGljaXRUeXBlcyA9IHRoaXMuc2NoZW1hLmNvbXBpbGVkSW1wbGljaXQ7XG4gIHRoaXMuZXhwbGljaXRUeXBlcyA9IHRoaXMuc2NoZW1hLmNvbXBpbGVkRXhwbGljaXQ7XG5cbiAgdGhpcy50YWcgPSBudWxsO1xuICB0aGlzLnJlc3VsdCA9ICcnO1xuXG4gIHRoaXMuZHVwbGljYXRlcyA9IFtdO1xuICB0aGlzLnVzZWREdXBsaWNhdGVzID0gbnVsbDtcbn1cblxuZnVuY3Rpb24gaW5kZW50U3RyaW5nKHN0cmluZywgc3BhY2VzKSB7XG4gIHZhciBpbmQgPSBjb21tb24ucmVwZWF0KCcgJywgc3BhY2VzKSxcbiAgICAgIHBvc2l0aW9uID0gMCxcbiAgICAgIG5leHQgPSAtMSxcbiAgICAgIHJlc3VsdCA9ICcnLFxuICAgICAgbGluZSxcbiAgICAgIGxlbmd0aCA9IHN0cmluZy5sZW5ndGg7XG5cbiAgd2hpbGUgKHBvc2l0aW9uIDwgbGVuZ3RoKSB7XG4gICAgbmV4dCA9IHN0cmluZy5pbmRleE9mKCdcXG4nLCBwb3NpdGlvbik7XG4gICAgaWYgKG5leHQgPT09IC0xKSB7XG4gICAgICBsaW5lID0gc3RyaW5nLnNsaWNlKHBvc2l0aW9uKTtcbiAgICAgIHBvc2l0aW9uID0gbGVuZ3RoO1xuICAgIH0gZWxzZSB7XG4gICAgICBsaW5lID0gc3RyaW5nLnNsaWNlKHBvc2l0aW9uLCBuZXh0ICsgMSk7XG4gICAgICBwb3NpdGlvbiA9IG5leHQgKyAxO1xuICAgIH1cbiAgICBpZiAobGluZS5sZW5ndGggJiYgbGluZSAhPT0gJ1xcbicpIHtcbiAgICAgIHJlc3VsdCArPSBpbmQ7XG4gICAgfVxuICAgIHJlc3VsdCArPSBsaW5lO1xuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gZ2VuZXJhdGVOZXh0TGluZShzdGF0ZSwgbGV2ZWwpIHtcbiAgcmV0dXJuICdcXG4nICsgY29tbW9uLnJlcGVhdCgnICcsIHN0YXRlLmluZGVudCAqIGxldmVsKTtcbn1cblxuZnVuY3Rpb24gdGVzdEltcGxpY2l0UmVzb2x2aW5nKHN0YXRlLCBzdHIpIHtcbiAgdmFyIGluZGV4LCBsZW5ndGgsIHR5cGU7XG5cbiAgZm9yIChpbmRleCA9IDAsIGxlbmd0aCA9IHN0YXRlLmltcGxpY2l0VHlwZXMubGVuZ3RoOyBpbmRleCA8IGxlbmd0aDsgaW5kZXggKz0gMSkge1xuICAgIHR5cGUgPSBzdGF0ZS5pbXBsaWNpdFR5cGVzW2luZGV4XTtcblxuICAgIGlmICh0eXBlLnJlc29sdmUoc3RyKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiBTdHJpbmdCdWlsZGVyKHNvdXJjZSkge1xuICB0aGlzLnNvdXJjZSA9IHNvdXJjZTtcbiAgdGhpcy5yZXN1bHQgPSAnJztcbiAgdGhpcy5jaGVja3BvaW50ID0gMDtcbn1cblxuU3RyaW5nQnVpbGRlci5wcm90b3R5cGUudGFrZVVwVG8gPSBmdW5jdGlvbiAocG9zaXRpb24pIHtcbiAgdmFyIGVyO1xuXG4gIGlmIChwb3NpdGlvbiA8IHRoaXMuY2hlY2twb2ludCkge1xuICAgIGVyID0gbmV3IEVycm9yKCdwb3NpdGlvbiBzaG91bGQgYmUgPiBjaGVja3BvaW50Jyk7XG4gICAgZXIucG9zaXRpb24gPSBwb3NpdGlvbjtcbiAgICBlci5jaGVja3BvaW50ID0gdGhpcy5jaGVja3BvaW50O1xuICAgIHRocm93IGVyO1xuICB9XG5cbiAgdGhpcy5yZXN1bHQgKz0gdGhpcy5zb3VyY2Uuc2xpY2UodGhpcy5jaGVja3BvaW50LCBwb3NpdGlvbik7XG4gIHRoaXMuY2hlY2twb2ludCA9IHBvc2l0aW9uO1xuICByZXR1cm4gdGhpcztcbn07XG5cblN0cmluZ0J1aWxkZXIucHJvdG90eXBlLmVzY2FwZUNoYXIgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBjaGFyYWN0ZXIsIGVzYztcblxuICBjaGFyYWN0ZXIgPSB0aGlzLnNvdXJjZS5jaGFyQ29kZUF0KHRoaXMuY2hlY2twb2ludCk7XG4gIGVzYyA9IEVTQ0FQRV9TRVFVRU5DRVNbY2hhcmFjdGVyXSB8fCBlbmNvZGVIZXgoY2hhcmFjdGVyKTtcbiAgdGhpcy5yZXN1bHQgKz0gZXNjO1xuICB0aGlzLmNoZWNrcG9pbnQgKz0gMTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cblN0cmluZ0J1aWxkZXIucHJvdG90eXBlLmZpbmlzaCA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKHRoaXMuc291cmNlLmxlbmd0aCA+IHRoaXMuY2hlY2twb2ludCkge1xuICAgIHRoaXMudGFrZVVwVG8odGhpcy5zb3VyY2UubGVuZ3RoKTtcbiAgfVxufTtcblxuZnVuY3Rpb24gd3JpdGVTY2FsYXIoc3RhdGUsIG9iamVjdCwgbGV2ZWwsIGlza2V5KSB7XG4gIHZhciBzaW1wbGUsIGZpcnN0LCBzcGFjZVdyYXAsIGZvbGRlZCwgbGl0ZXJhbCwgc2luZ2xlLCBkb3VibGUsXG4gICAgICBzYXdMaW5lRmVlZCwgbGluZVBvc2l0aW9uLCBsb25nZXN0TGluZSwgaW5kZW50LCBtYXgsIGNoYXJhY3RlcixcbiAgICAgIHBvc2l0aW9uLCBlc2NhcGVTZXEsIGhleEVzYywgcHJldmlvdXMsIGxpbmVMZW5ndGgsIG1vZGlmaWVyLFxuICAgICAgdHJhaWxpbmdMaW5lQnJlYWtzLCByZXN1bHQ7XG5cbiAgaWYgKDAgPT09IG9iamVjdC5sZW5ndGgpIHtcbiAgICBzdGF0ZS5kdW1wID0gXCInJ1wiO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmICgtMSAhPT0gREVQUkVDQVRFRF9CT09MRUFOU19TWU5UQVguaW5kZXhPZihvYmplY3QpKSB7XG4gICAgc3RhdGUuZHVtcCA9IFwiJ1wiICsgb2JqZWN0ICsgXCInXCI7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgc2ltcGxlID0gdHJ1ZTtcbiAgZmlyc3QgPSBvYmplY3QubGVuZ3RoID8gb2JqZWN0LmNoYXJDb2RlQXQoMCkgOiAwO1xuICBzcGFjZVdyYXAgPSAoQ0hBUl9TUEFDRSA9PT0gZmlyc3QgfHxcbiAgICAgICAgICAgICAgIENIQVJfU1BBQ0UgPT09IG9iamVjdC5jaGFyQ29kZUF0KG9iamVjdC5sZW5ndGggLSAxKSk7XG5cbiAgLy8gU2ltcGxpZmllZCBjaGVjayBmb3IgcmVzdHJpY3RlZCBmaXJzdCBjaGFyYWN0ZXJzXG4gIC8vIGh0dHA6Ly93d3cueWFtbC5vcmcvc3BlYy8xLjIvc3BlYy5odG1sI25zLXBsYWluLWZpcnN0JTI4YyUyOVxuICBpZiAoQ0hBUl9NSU5VUyAgICAgICAgID09PSBmaXJzdCB8fFxuICAgICAgQ0hBUl9RVUVTVElPTiAgICAgID09PSBmaXJzdCB8fFxuICAgICAgQ0hBUl9DT01NRVJDSUFMX0FUID09PSBmaXJzdCB8fFxuICAgICAgQ0hBUl9HUkFWRV9BQ0NFTlQgID09PSBmaXJzdCkge1xuICAgIHNpbXBsZSA9IGZhbHNlO1xuICB9XG5cbiAgLy8gY2FuIG9ubHkgdXNlID4gYW5kIHwgaWYgbm90IHdyYXBwZWQgaW4gc3BhY2VzIG9yIGlzIG5vdCBhIGtleS5cbiAgaWYgKHNwYWNlV3JhcCkge1xuICAgIHNpbXBsZSA9IGZhbHNlO1xuICAgIGZvbGRlZCA9IGZhbHNlO1xuICAgIGxpdGVyYWwgPSBmYWxzZTtcbiAgfSBlbHNlIHtcbiAgICBmb2xkZWQgPSAhaXNrZXk7XG4gICAgbGl0ZXJhbCA9ICFpc2tleTtcbiAgfVxuXG4gIHNpbmdsZSA9IHRydWU7XG4gIGRvdWJsZSA9IG5ldyBTdHJpbmdCdWlsZGVyKG9iamVjdCk7XG5cbiAgc2F3TGluZUZlZWQgPSBmYWxzZTtcbiAgbGluZVBvc2l0aW9uID0gMDtcbiAgbG9uZ2VzdExpbmUgPSAwO1xuXG4gIGluZGVudCA9IHN0YXRlLmluZGVudCAqIGxldmVsO1xuICBtYXggPSA4MDtcbiAgaWYgKGluZGVudCA8IDQwKSB7XG4gICAgbWF4IC09IGluZGVudDtcbiAgfSBlbHNlIHtcbiAgICBtYXggPSA0MDtcbiAgfVxuXG4gIGZvciAocG9zaXRpb24gPSAwOyBwb3NpdGlvbiA8IG9iamVjdC5sZW5ndGg7IHBvc2l0aW9uKyspIHtcbiAgICBjaGFyYWN0ZXIgPSBvYmplY3QuY2hhckNvZGVBdChwb3NpdGlvbik7XG4gICAgaWYgKHNpbXBsZSkge1xuICAgICAgLy8gQ2hhcmFjdGVycyB0aGF0IGNhbiBuZXZlciBhcHBlYXIgaW4gdGhlIHNpbXBsZSBzY2FsYXJcbiAgICAgIGlmICghc2ltcGxlQ2hhcihjaGFyYWN0ZXIpKSB7XG4gICAgICAgIHNpbXBsZSA9IGZhbHNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gU3RpbGwgc2ltcGxlLiAgSWYgd2UgbWFrZSBpdCBhbGwgdGhlIHdheSB0aHJvdWdoIGxpa2VcbiAgICAgICAgLy8gdGhpcywgdGhlbiB3ZSBjYW4ganVzdCBkdW1wIHRoZSBzdHJpbmcgYXMtaXMuXG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChzaW5nbGUgJiYgY2hhcmFjdGVyID09PSBDSEFSX1NJTkdMRV9RVU9URSkge1xuICAgICAgc2luZ2xlID0gZmFsc2U7XG4gICAgfVxuXG4gICAgZXNjYXBlU2VxID0gRVNDQVBFX1NFUVVFTkNFU1tjaGFyYWN0ZXJdO1xuICAgIGhleEVzYyA9IG5lZWRzSGV4RXNjYXBlKGNoYXJhY3Rlcik7XG5cbiAgICBpZiAoIWVzY2FwZVNlcSAmJiAhaGV4RXNjKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBpZiAoY2hhcmFjdGVyICE9PSBDSEFSX0xJTkVfRkVFRCAmJlxuICAgICAgICBjaGFyYWN0ZXIgIT09IENIQVJfRE9VQkxFX1FVT1RFICYmXG4gICAgICAgIGNoYXJhY3RlciAhPT0gQ0hBUl9TSU5HTEVfUVVPVEUpIHtcbiAgICAgIGZvbGRlZCA9IGZhbHNlO1xuICAgICAgbGl0ZXJhbCA9IGZhbHNlO1xuICAgIH0gZWxzZSBpZiAoY2hhcmFjdGVyID09PSBDSEFSX0xJTkVfRkVFRCkge1xuICAgICAgc2F3TGluZUZlZWQgPSB0cnVlO1xuICAgICAgc2luZ2xlID0gZmFsc2U7XG4gICAgICBpZiAocG9zaXRpb24gPiAwKSB7XG4gICAgICAgIHByZXZpb3VzID0gb2JqZWN0LmNoYXJDb2RlQXQocG9zaXRpb24gLSAxKTtcbiAgICAgICAgaWYgKHByZXZpb3VzID09PSBDSEFSX1NQQUNFKSB7XG4gICAgICAgICAgbGl0ZXJhbCA9IGZhbHNlO1xuICAgICAgICAgIGZvbGRlZCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoZm9sZGVkKSB7XG4gICAgICAgIGxpbmVMZW5ndGggPSBwb3NpdGlvbiAtIGxpbmVQb3NpdGlvbjtcbiAgICAgICAgbGluZVBvc2l0aW9uID0gcG9zaXRpb247XG4gICAgICAgIGlmIChsaW5lTGVuZ3RoID4gbG9uZ2VzdExpbmUpIHtcbiAgICAgICAgICBsb25nZXN0TGluZSA9IGxpbmVMZW5ndGg7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoY2hhcmFjdGVyICE9PSBDSEFSX0RPVUJMRV9RVU9URSkge1xuICAgICAgc2luZ2xlID0gZmFsc2U7XG4gICAgfVxuXG4gICAgZG91YmxlLnRha2VVcFRvKHBvc2l0aW9uKTtcbiAgICBkb3VibGUuZXNjYXBlQ2hhcigpO1xuICB9XG5cbiAgaWYgKHNpbXBsZSAmJiB0ZXN0SW1wbGljaXRSZXNvbHZpbmcoc3RhdGUsIG9iamVjdCkpIHtcbiAgICBzaW1wbGUgPSBmYWxzZTtcbiAgfVxuXG4gIG1vZGlmaWVyID0gJyc7XG4gIGlmIChmb2xkZWQgfHwgbGl0ZXJhbCkge1xuICAgIHRyYWlsaW5nTGluZUJyZWFrcyA9IDA7XG4gICAgaWYgKG9iamVjdC5jaGFyQ29kZUF0KG9iamVjdC5sZW5ndGggLSAxKSA9PT0gQ0hBUl9MSU5FX0ZFRUQpIHtcbiAgICAgIHRyYWlsaW5nTGluZUJyZWFrcyArPSAxO1xuICAgICAgaWYgKG9iamVjdC5jaGFyQ29kZUF0KG9iamVjdC5sZW5ndGggLSAyKSA9PT0gQ0hBUl9MSU5FX0ZFRUQpIHtcbiAgICAgICAgdHJhaWxpbmdMaW5lQnJlYWtzICs9IDE7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRyYWlsaW5nTGluZUJyZWFrcyA9PT0gMCkge1xuICAgICAgbW9kaWZpZXIgPSAnLSc7XG4gICAgfSBlbHNlIGlmICh0cmFpbGluZ0xpbmVCcmVha3MgPT09IDIpIHtcbiAgICAgIG1vZGlmaWVyID0gJysnO1xuICAgIH1cbiAgfVxuXG4gIGlmIChsaXRlcmFsICYmIGxvbmdlc3RMaW5lIDwgbWF4KSB7XG4gICAgZm9sZGVkID0gZmFsc2U7XG4gIH1cblxuICAvLyBJZiBpdCdzIGxpdGVyYWxseSBvbmUgbGluZSwgdGhlbiBkb24ndCBib3RoZXIgd2l0aCB0aGUgbGl0ZXJhbC5cbiAgLy8gV2UgbWF5IHN0aWxsIHdhbnQgdG8gZG8gYSBmb2xkLCB0aG91Z2gsIGlmIGl0J3MgYSBzdXBlciBsb25nIGxpbmUuXG4gIGlmICghc2F3TGluZUZlZWQpIHtcbiAgICBsaXRlcmFsID0gZmFsc2U7XG4gIH1cblxuICBpZiAoc2ltcGxlKSB7XG4gICAgc3RhdGUuZHVtcCA9IG9iamVjdDtcbiAgfSBlbHNlIGlmIChzaW5nbGUpIHtcbiAgICBzdGF0ZS5kdW1wID0gJ1xcJycgKyBvYmplY3QgKyAnXFwnJztcbiAgfSBlbHNlIGlmIChmb2xkZWQpIHtcbiAgICByZXN1bHQgPSBmb2xkKG9iamVjdCwgbWF4KTtcbiAgICBzdGF0ZS5kdW1wID0gJz4nICsgbW9kaWZpZXIgKyAnXFxuJyArIGluZGVudFN0cmluZyhyZXN1bHQsIGluZGVudCk7XG4gIH0gZWxzZSBpZiAobGl0ZXJhbCkge1xuICAgIGlmICghbW9kaWZpZXIpIHtcbiAgICAgIG9iamVjdCA9IG9iamVjdC5yZXBsYWNlKC9cXG4kLywgJycpO1xuICAgIH1cbiAgICBzdGF0ZS5kdW1wID0gJ3wnICsgbW9kaWZpZXIgKyAnXFxuJyArIGluZGVudFN0cmluZyhvYmplY3QsIGluZGVudCk7XG4gIH0gZWxzZSBpZiAoZG91YmxlKSB7XG4gICAgZG91YmxlLmZpbmlzaCgpO1xuICAgIHN0YXRlLmR1bXAgPSAnXCInICsgZG91YmxlLnJlc3VsdCArICdcIic7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdGYWlsZWQgdG8gZHVtcCBzY2FsYXIgdmFsdWUnKTtcbiAgfVxuXG4gIHJldHVybjtcbn1cblxuLy8gVGhlIGB0cmFpbGluZ2AgdmFyIGlzIGEgcmVnZXhwIG1hdGNoIG9mIGFueSB0cmFpbGluZyBgXFxuYCBjaGFyYWN0ZXJzLlxuLy9cbi8vIFRoZXJlIGFyZSB0aHJlZSBjYXNlcyB3ZSBjYXJlIGFib3V0OlxuLy9cbi8vIDEuIE9uZSB0cmFpbGluZyBgXFxuYCBvbiB0aGUgc3RyaW5nLiAgSnVzdCB1c2UgYHxgIG9yIGA+YC5cbi8vICAgIFRoaXMgaXMgdGhlIGFzc3VtZWQgZGVmYXVsdC4gKHRyYWlsaW5nID0gbnVsbClcbi8vIDIuIE5vIHRyYWlsaW5nIGBcXG5gIG9uIHRoZSBzdHJpbmcuICBVc2UgYHwtYCBvciBgPi1gIHRvIFwiY2hvbXBcIiB0aGUgZW5kLlxuLy8gMy4gTW9yZSB0aGFuIG9uZSB0cmFpbGluZyBgXFxuYCBvbiB0aGUgc3RyaW5nLiAgVXNlIGB8K2Agb3IgYD4rYC5cbi8vXG4vLyBJbiB0aGUgY2FzZSBvZiBgPitgLCB0aGVzZSBsaW5lIGJyZWFrcyBhcmUgKm5vdCogZG91YmxlZCAobGlrZSB0aGUgbGluZVxuLy8gYnJlYWtzIHdpdGhpbiB0aGUgc3RyaW5nKSwgc28gaXQncyBpbXBvcnRhbnQgdG8gb25seSBlbmQgd2l0aCB0aGUgZXhhY3Rcbi8vIHNhbWUgbnVtYmVyIGFzIHdlIHN0YXJ0ZWQuXG5mdW5jdGlvbiBmb2xkKG9iamVjdCwgbWF4KSB7XG4gIHZhciByZXN1bHQgPSAnJyxcbiAgICAgIHBvc2l0aW9uID0gMCxcbiAgICAgIGxlbmd0aCA9IG9iamVjdC5sZW5ndGgsXG4gICAgICB0cmFpbGluZyA9IC9cXG4rJC8uZXhlYyhvYmplY3QpLFxuICAgICAgbmV3TGluZTtcblxuICBpZiAodHJhaWxpbmcpIHtcbiAgICBsZW5ndGggPSB0cmFpbGluZy5pbmRleCArIDE7XG4gIH1cblxuICB3aGlsZSAocG9zaXRpb24gPCBsZW5ndGgpIHtcbiAgICBuZXdMaW5lID0gb2JqZWN0LmluZGV4T2YoJ1xcbicsIHBvc2l0aW9uKTtcbiAgICBpZiAobmV3TGluZSA+IGxlbmd0aCB8fCBuZXdMaW5lID09PSAtMSkge1xuICAgICAgaWYgKHJlc3VsdCkge1xuICAgICAgICByZXN1bHQgKz0gJ1xcblxcbic7XG4gICAgICB9XG4gICAgICByZXN1bHQgKz0gZm9sZExpbmUob2JqZWN0LnNsaWNlKHBvc2l0aW9uLCBsZW5ndGgpLCBtYXgpO1xuICAgICAgcG9zaXRpb24gPSBsZW5ndGg7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChyZXN1bHQpIHtcbiAgICAgICAgcmVzdWx0ICs9ICdcXG5cXG4nO1xuICAgICAgfVxuICAgICAgcmVzdWx0ICs9IGZvbGRMaW5lKG9iamVjdC5zbGljZShwb3NpdGlvbiwgbmV3TGluZSksIG1heCk7XG4gICAgICBwb3NpdGlvbiA9IG5ld0xpbmUgKyAxO1xuICAgIH1cbiAgfVxuICBpZiAodHJhaWxpbmcgJiYgdHJhaWxpbmdbMF0gIT09ICdcXG4nKSB7XG4gICAgcmVzdWx0ICs9IHRyYWlsaW5nWzBdO1xuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gZm9sZExpbmUobGluZSwgbWF4KSB7XG4gIGlmIChsaW5lID09PSAnJykge1xuICAgIHJldHVybiBsaW5lO1xuICB9XG5cbiAgdmFyIGZvbGRSZSA9IC9bXlxcc10gW15cXHNdL2csXG4gICAgICByZXN1bHQgPSAnJyxcbiAgICAgIHByZXZNYXRjaCA9IDAsXG4gICAgICBmb2xkU3RhcnQgPSAwLFxuICAgICAgbWF0Y2ggPSBmb2xkUmUuZXhlYyhsaW5lKSxcbiAgICAgIGluZGV4LFxuICAgICAgZm9sZEVuZCxcbiAgICAgIGZvbGRlZDtcblxuICB3aGlsZSAobWF0Y2gpIHtcbiAgICBpbmRleCA9IG1hdGNoLmluZGV4O1xuXG4gICAgLy8gd2hlbiB3ZSBjcm9zcyB0aGUgbWF4IGxlbiwgaWYgdGhlIHByZXZpb3VzIG1hdGNoIHdvdWxkJ3ZlXG4gICAgLy8gYmVlbiBvaywgdXNlIHRoYXQgb25lLCBhbmQgY2Fycnkgb24uICBJZiB0aGVyZSB3YXMgbm8gcHJldmlvdXNcbiAgICAvLyBtYXRjaCBvbiB0aGlzIGZvbGQgc2VjdGlvbiwgdGhlbiBqdXN0IGhhdmUgYSBsb25nIGxpbmUuXG4gICAgaWYgKGluZGV4IC0gZm9sZFN0YXJ0ID4gbWF4KSB7XG4gICAgICBpZiAocHJldk1hdGNoICE9PSBmb2xkU3RhcnQpIHtcbiAgICAgICAgZm9sZEVuZCA9IHByZXZNYXRjaDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZvbGRFbmQgPSBpbmRleDtcbiAgICAgIH1cblxuICAgICAgaWYgKHJlc3VsdCkge1xuICAgICAgICByZXN1bHQgKz0gJ1xcbic7XG4gICAgICB9XG4gICAgICBmb2xkZWQgPSBsaW5lLnNsaWNlKGZvbGRTdGFydCwgZm9sZEVuZCk7XG4gICAgICByZXN1bHQgKz0gZm9sZGVkO1xuICAgICAgZm9sZFN0YXJ0ID0gZm9sZEVuZCArIDE7XG4gICAgfVxuICAgIHByZXZNYXRjaCA9IGluZGV4ICsgMTtcbiAgICBtYXRjaCA9IGZvbGRSZS5leGVjKGxpbmUpO1xuICB9XG5cbiAgaWYgKHJlc3VsdCkge1xuICAgIHJlc3VsdCArPSAnXFxuJztcbiAgfVxuXG4gIC8vIGlmIHdlIGVuZCB1cCB3aXRoIG9uZSBsYXN0IHdvcmQgYXQgdGhlIGVuZCwgdGhlbiB0aGUgbGFzdCBiaXQgbWlnaHRcbiAgLy8gYmUgc2xpZ2h0bHkgYmlnZ2VyIHRoYW4gd2Ugd2FudGVkLCBiZWNhdXNlIHdlIGV4aXRlZCBvdXQgb2YgdGhlIGxvb3AuXG4gIGlmIChmb2xkU3RhcnQgIT09IHByZXZNYXRjaCAmJiBsaW5lLmxlbmd0aCAtIGZvbGRTdGFydCA+IG1heCkge1xuICAgIHJlc3VsdCArPSBsaW5lLnNsaWNlKGZvbGRTdGFydCwgcHJldk1hdGNoKSArICdcXG4nICtcbiAgICAgICAgICAgICAgbGluZS5zbGljZShwcmV2TWF0Y2ggKyAxKTtcbiAgfSBlbHNlIHtcbiAgICByZXN1bHQgKz0gbGluZS5zbGljZShmb2xkU3RhcnQpO1xuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLy8gUmV0dXJucyB0cnVlIGlmIGNoYXJhY3RlciBjYW4gYmUgZm91bmQgaW4gYSBzaW1wbGUgc2NhbGFyXG5mdW5jdGlvbiBzaW1wbGVDaGFyKGNoYXJhY3Rlcikge1xuICByZXR1cm4gQ0hBUl9UQUIgICAgICAgICAgICAgICAgICAhPT0gY2hhcmFjdGVyICYmXG4gICAgICAgICBDSEFSX0xJTkVfRkVFRCAgICAgICAgICAgICE9PSBjaGFyYWN0ZXIgJiZcbiAgICAgICAgIENIQVJfQ0FSUklBR0VfUkVUVVJOICAgICAgIT09IGNoYXJhY3RlciAmJlxuICAgICAgICAgQ0hBUl9DT01NQSAgICAgICAgICAgICAgICAhPT0gY2hhcmFjdGVyICYmXG4gICAgICAgICBDSEFSX0xFRlRfU1FVQVJFX0JSQUNLRVQgICE9PSBjaGFyYWN0ZXIgJiZcbiAgICAgICAgIENIQVJfUklHSFRfU1FVQVJFX0JSQUNLRVQgIT09IGNoYXJhY3RlciAmJlxuICAgICAgICAgQ0hBUl9MRUZUX0NVUkxZX0JSQUNLRVQgICAhPT0gY2hhcmFjdGVyICYmXG4gICAgICAgICBDSEFSX1JJR0hUX0NVUkxZX0JSQUNLRVQgICE9PSBjaGFyYWN0ZXIgJiZcbiAgICAgICAgIENIQVJfU0hBUlAgICAgICAgICAgICAgICAgIT09IGNoYXJhY3RlciAmJlxuICAgICAgICAgQ0hBUl9BTVBFUlNBTkQgICAgICAgICAgICAhPT0gY2hhcmFjdGVyICYmXG4gICAgICAgICBDSEFSX0FTVEVSSVNLICAgICAgICAgICAgICE9PSBjaGFyYWN0ZXIgJiZcbiAgICAgICAgIENIQVJfRVhDTEFNQVRJT04gICAgICAgICAgIT09IGNoYXJhY3RlciAmJlxuICAgICAgICAgQ0hBUl9WRVJUSUNBTF9MSU5FICAgICAgICAhPT0gY2hhcmFjdGVyICYmXG4gICAgICAgICBDSEFSX0dSRUFURVJfVEhBTiAgICAgICAgICE9PSBjaGFyYWN0ZXIgJiZcbiAgICAgICAgIENIQVJfU0lOR0xFX1FVT1RFICAgICAgICAgIT09IGNoYXJhY3RlciAmJlxuICAgICAgICAgQ0hBUl9ET1VCTEVfUVVPVEUgICAgICAgICAhPT0gY2hhcmFjdGVyICYmXG4gICAgICAgICBDSEFSX1BFUkNFTlQgICAgICAgICAgICAgICE9PSBjaGFyYWN0ZXIgJiZcbiAgICAgICAgIENIQVJfQ09MT04gICAgICAgICAgICAgICAgIT09IGNoYXJhY3RlciAmJlxuICAgICAgICAgIUVTQ0FQRV9TRVFVRU5DRVNbY2hhcmFjdGVyXSAgICAgICAgICAgICYmXG4gICAgICAgICAhbmVlZHNIZXhFc2NhcGUoY2hhcmFjdGVyKTtcbn1cblxuLy8gUmV0dXJucyB0cnVlIGlmIHRoZSBjaGFyYWN0ZXIgY29kZSBuZWVkcyB0byBiZSBlc2NhcGVkLlxuZnVuY3Rpb24gbmVlZHNIZXhFc2NhcGUoY2hhcmFjdGVyKSB7XG4gIHJldHVybiAhKCgweDAwMDIwIDw9IGNoYXJhY3RlciAmJiBjaGFyYWN0ZXIgPD0gMHgwMDAwN0UpIHx8XG4gICAgICAgICAgICgweDAwMDg1ID09PSBjaGFyYWN0ZXIpICAgICAgICAgICAgICAgICAgICAgICAgIHx8XG4gICAgICAgICAgICgweDAwMEEwIDw9IGNoYXJhY3RlciAmJiBjaGFyYWN0ZXIgPD0gMHgwMEQ3RkYpIHx8XG4gICAgICAgICAgICgweDBFMDAwIDw9IGNoYXJhY3RlciAmJiBjaGFyYWN0ZXIgPD0gMHgwMEZGRkQpIHx8XG4gICAgICAgICAgICgweDEwMDAwIDw9IGNoYXJhY3RlciAmJiBjaGFyYWN0ZXIgPD0gMHgxMEZGRkYpKTtcbn1cblxuZnVuY3Rpb24gd3JpdGVGbG93U2VxdWVuY2Uoc3RhdGUsIGxldmVsLCBvYmplY3QpIHtcbiAgdmFyIF9yZXN1bHQgPSAnJyxcbiAgICAgIF90YWcgICAgPSBzdGF0ZS50YWcsXG4gICAgICBpbmRleCxcbiAgICAgIGxlbmd0aDtcblxuICBmb3IgKGluZGV4ID0gMCwgbGVuZ3RoID0gb2JqZWN0Lmxlbmd0aDsgaW5kZXggPCBsZW5ndGg7IGluZGV4ICs9IDEpIHtcbiAgICAvLyBXcml0ZSBvbmx5IHZhbGlkIGVsZW1lbnRzLlxuICAgIGlmICh3cml0ZU5vZGUoc3RhdGUsIGxldmVsLCBvYmplY3RbaW5kZXhdLCBmYWxzZSwgZmFsc2UpKSB7XG4gICAgICBpZiAoMCAhPT0gaW5kZXgpIHtcbiAgICAgICAgX3Jlc3VsdCArPSAnLCAnO1xuICAgICAgfVxuICAgICAgX3Jlc3VsdCArPSBzdGF0ZS5kdW1wO1xuICAgIH1cbiAgfVxuXG4gIHN0YXRlLnRhZyA9IF90YWc7XG4gIHN0YXRlLmR1bXAgPSAnWycgKyBfcmVzdWx0ICsgJ10nO1xufVxuXG5mdW5jdGlvbiB3cml0ZUJsb2NrU2VxdWVuY2Uoc3RhdGUsIGxldmVsLCBvYmplY3QsIGNvbXBhY3QpIHtcbiAgdmFyIF9yZXN1bHQgPSAnJyxcbiAgICAgIF90YWcgICAgPSBzdGF0ZS50YWcsXG4gICAgICBpbmRleCxcbiAgICAgIGxlbmd0aDtcblxuICBmb3IgKGluZGV4ID0gMCwgbGVuZ3RoID0gb2JqZWN0Lmxlbmd0aDsgaW5kZXggPCBsZW5ndGg7IGluZGV4ICs9IDEpIHtcbiAgICAvLyBXcml0ZSBvbmx5IHZhbGlkIGVsZW1lbnRzLlxuICAgIGlmICh3cml0ZU5vZGUoc3RhdGUsIGxldmVsICsgMSwgb2JqZWN0W2luZGV4XSwgdHJ1ZSwgdHJ1ZSkpIHtcbiAgICAgIGlmICghY29tcGFjdCB8fCAwICE9PSBpbmRleCkge1xuICAgICAgICBfcmVzdWx0ICs9IGdlbmVyYXRlTmV4dExpbmUoc3RhdGUsIGxldmVsKTtcbiAgICAgIH1cbiAgICAgIF9yZXN1bHQgKz0gJy0gJyArIHN0YXRlLmR1bXA7XG4gICAgfVxuICB9XG5cbiAgc3RhdGUudGFnID0gX3RhZztcbiAgc3RhdGUuZHVtcCA9IF9yZXN1bHQgfHwgJ1tdJzsgLy8gRW1wdHkgc2VxdWVuY2UgaWYgbm8gdmFsaWQgdmFsdWVzLlxufVxuXG5mdW5jdGlvbiB3cml0ZUZsb3dNYXBwaW5nKHN0YXRlLCBsZXZlbCwgb2JqZWN0KSB7XG4gIHZhciBfcmVzdWx0ICAgICAgID0gJycsXG4gICAgICBfdGFnICAgICAgICAgID0gc3RhdGUudGFnLFxuICAgICAgb2JqZWN0S2V5TGlzdCA9IE9iamVjdC5rZXlzKG9iamVjdCksXG4gICAgICBpbmRleCxcbiAgICAgIGxlbmd0aCxcbiAgICAgIG9iamVjdEtleSxcbiAgICAgIG9iamVjdFZhbHVlLFxuICAgICAgcGFpckJ1ZmZlcjtcblxuICBmb3IgKGluZGV4ID0gMCwgbGVuZ3RoID0gb2JqZWN0S2V5TGlzdC5sZW5ndGg7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCArPSAxKSB7XG4gICAgcGFpckJ1ZmZlciA9ICcnO1xuXG4gICAgaWYgKDAgIT09IGluZGV4KSB7XG4gICAgICBwYWlyQnVmZmVyICs9ICcsICc7XG4gICAgfVxuXG4gICAgb2JqZWN0S2V5ID0gb2JqZWN0S2V5TGlzdFtpbmRleF07XG4gICAgb2JqZWN0VmFsdWUgPSBvYmplY3Rbb2JqZWN0S2V5XTtcblxuICAgIGlmICghd3JpdGVOb2RlKHN0YXRlLCBsZXZlbCwgb2JqZWN0S2V5LCBmYWxzZSwgZmFsc2UpKSB7XG4gICAgICBjb250aW51ZTsgLy8gU2tpcCB0aGlzIHBhaXIgYmVjYXVzZSBvZiBpbnZhbGlkIGtleTtcbiAgICB9XG5cbiAgICBpZiAoc3RhdGUuZHVtcC5sZW5ndGggPiAxMDI0KSB7XG4gICAgICBwYWlyQnVmZmVyICs9ICc/ICc7XG4gICAgfVxuXG4gICAgcGFpckJ1ZmZlciArPSBzdGF0ZS5kdW1wICsgJzogJztcblxuICAgIGlmICghd3JpdGVOb2RlKHN0YXRlLCBsZXZlbCwgb2JqZWN0VmFsdWUsIGZhbHNlLCBmYWxzZSkpIHtcbiAgICAgIGNvbnRpbnVlOyAvLyBTa2lwIHRoaXMgcGFpciBiZWNhdXNlIG9mIGludmFsaWQgdmFsdWUuXG4gICAgfVxuXG4gICAgcGFpckJ1ZmZlciArPSBzdGF0ZS5kdW1wO1xuXG4gICAgLy8gQm90aCBrZXkgYW5kIHZhbHVlIGFyZSB2YWxpZC5cbiAgICBfcmVzdWx0ICs9IHBhaXJCdWZmZXI7XG4gIH1cblxuICBzdGF0ZS50YWcgPSBfdGFnO1xuICBzdGF0ZS5kdW1wID0gJ3snICsgX3Jlc3VsdCArICd9Jztcbn1cblxuZnVuY3Rpb24gd3JpdGVCbG9ja01hcHBpbmcoc3RhdGUsIGxldmVsLCBvYmplY3QsIGNvbXBhY3QpIHtcbiAgdmFyIF9yZXN1bHQgICAgICAgPSAnJyxcbiAgICAgIF90YWcgICAgICAgICAgPSBzdGF0ZS50YWcsXG4gICAgICBvYmplY3RLZXlMaXN0ID0gT2JqZWN0LmtleXMob2JqZWN0KSxcbiAgICAgIGluZGV4LFxuICAgICAgbGVuZ3RoLFxuICAgICAgb2JqZWN0S2V5LFxuICAgICAgb2JqZWN0VmFsdWUsXG4gICAgICBleHBsaWNpdFBhaXIsXG4gICAgICBwYWlyQnVmZmVyO1xuXG4gIC8vIEFsbG93IHNvcnRpbmcga2V5cyBzbyB0aGF0IHRoZSBvdXRwdXQgZmlsZSBpcyBkZXRlcm1pbmlzdGljXG4gIGlmIChzdGF0ZS5zb3J0S2V5cyA9PT0gdHJ1ZSkge1xuICAgIC8vIERlZmF1bHQgc29ydGluZ1xuICAgIG9iamVjdEtleUxpc3Quc29ydCgpO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBzdGF0ZS5zb3J0S2V5cyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIC8vIEN1c3RvbSBzb3J0IGZ1bmN0aW9uXG4gICAgb2JqZWN0S2V5TGlzdC5zb3J0KHN0YXRlLnNvcnRLZXlzKTtcbiAgfSBlbHNlIGlmIChzdGF0ZS5zb3J0S2V5cykge1xuICAgIC8vIFNvbWV0aGluZyBpcyB3cm9uZ1xuICAgIHRocm93IG5ldyBZQU1MRXhjZXB0aW9uKCdzb3J0S2V5cyBtdXN0IGJlIGEgYm9vbGVhbiBvciBhIGZ1bmN0aW9uJyk7XG4gIH1cblxuICBmb3IgKGluZGV4ID0gMCwgbGVuZ3RoID0gb2JqZWN0S2V5TGlzdC5sZW5ndGg7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCArPSAxKSB7XG4gICAgcGFpckJ1ZmZlciA9ICcnO1xuXG4gICAgaWYgKCFjb21wYWN0IHx8IDAgIT09IGluZGV4KSB7XG4gICAgICBwYWlyQnVmZmVyICs9IGdlbmVyYXRlTmV4dExpbmUoc3RhdGUsIGxldmVsKTtcbiAgICB9XG5cbiAgICBvYmplY3RLZXkgPSBvYmplY3RLZXlMaXN0W2luZGV4XTtcbiAgICBvYmplY3RWYWx1ZSA9IG9iamVjdFtvYmplY3RLZXldO1xuXG4gICAgaWYgKCF3cml0ZU5vZGUoc3RhdGUsIGxldmVsICsgMSwgb2JqZWN0S2V5LCB0cnVlLCB0cnVlLCB0cnVlKSkge1xuICAgICAgY29udGludWU7IC8vIFNraXAgdGhpcyBwYWlyIGJlY2F1c2Ugb2YgaW52YWxpZCBrZXkuXG4gICAgfVxuXG4gICAgZXhwbGljaXRQYWlyID0gKG51bGwgIT09IHN0YXRlLnRhZyAmJiAnPycgIT09IHN0YXRlLnRhZykgfHxcbiAgICAgICAgICAgICAgICAgICAoc3RhdGUuZHVtcCAmJiBzdGF0ZS5kdW1wLmxlbmd0aCA+IDEwMjQpO1xuXG4gICAgaWYgKGV4cGxpY2l0UGFpcikge1xuICAgICAgaWYgKHN0YXRlLmR1bXAgJiYgQ0hBUl9MSU5FX0ZFRUQgPT09IHN0YXRlLmR1bXAuY2hhckNvZGVBdCgwKSkge1xuICAgICAgICBwYWlyQnVmZmVyICs9ICc/JztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBhaXJCdWZmZXIgKz0gJz8gJztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBwYWlyQnVmZmVyICs9IHN0YXRlLmR1bXA7XG5cbiAgICBpZiAoZXhwbGljaXRQYWlyKSB7XG4gICAgICBwYWlyQnVmZmVyICs9IGdlbmVyYXRlTmV4dExpbmUoc3RhdGUsIGxldmVsKTtcbiAgICB9XG5cbiAgICBpZiAoIXdyaXRlTm9kZShzdGF0ZSwgbGV2ZWwgKyAxLCBvYmplY3RWYWx1ZSwgdHJ1ZSwgZXhwbGljaXRQYWlyKSkge1xuICAgICAgY29udGludWU7IC8vIFNraXAgdGhpcyBwYWlyIGJlY2F1c2Ugb2YgaW52YWxpZCB2YWx1ZS5cbiAgICB9XG5cbiAgICBpZiAoc3RhdGUuZHVtcCAmJiBDSEFSX0xJTkVfRkVFRCA9PT0gc3RhdGUuZHVtcC5jaGFyQ29kZUF0KDApKSB7XG4gICAgICBwYWlyQnVmZmVyICs9ICc6JztcbiAgICB9IGVsc2Uge1xuICAgICAgcGFpckJ1ZmZlciArPSAnOiAnO1xuICAgIH1cblxuICAgIHBhaXJCdWZmZXIgKz0gc3RhdGUuZHVtcDtcblxuICAgIC8vIEJvdGgga2V5IGFuZCB2YWx1ZSBhcmUgdmFsaWQuXG4gICAgX3Jlc3VsdCArPSBwYWlyQnVmZmVyO1xuICB9XG5cbiAgc3RhdGUudGFnID0gX3RhZztcbiAgc3RhdGUuZHVtcCA9IF9yZXN1bHQgfHwgJ3t9JzsgLy8gRW1wdHkgbWFwcGluZyBpZiBubyB2YWxpZCBwYWlycy5cbn1cblxuZnVuY3Rpb24gZGV0ZWN0VHlwZShzdGF0ZSwgb2JqZWN0LCBleHBsaWNpdCkge1xuICB2YXIgX3Jlc3VsdCwgdHlwZUxpc3QsIGluZGV4LCBsZW5ndGgsIHR5cGUsIHN0eWxlO1xuXG4gIHR5cGVMaXN0ID0gZXhwbGljaXQgPyBzdGF0ZS5leHBsaWNpdFR5cGVzIDogc3RhdGUuaW1wbGljaXRUeXBlcztcblxuICBmb3IgKGluZGV4ID0gMCwgbGVuZ3RoID0gdHlwZUxpc3QubGVuZ3RoOyBpbmRleCA8IGxlbmd0aDsgaW5kZXggKz0gMSkge1xuICAgIHR5cGUgPSB0eXBlTGlzdFtpbmRleF07XG5cbiAgICBpZiAoKHR5cGUuaW5zdGFuY2VPZiAgfHwgdHlwZS5wcmVkaWNhdGUpICYmXG4gICAgICAgICghdHlwZS5pbnN0YW5jZU9mIHx8ICgoJ29iamVjdCcgPT09IHR5cGVvZiBvYmplY3QpICYmIChvYmplY3QgaW5zdGFuY2VvZiB0eXBlLmluc3RhbmNlT2YpKSkgJiZcbiAgICAgICAgKCF0eXBlLnByZWRpY2F0ZSAgfHwgdHlwZS5wcmVkaWNhdGUob2JqZWN0KSkpIHtcblxuICAgICAgc3RhdGUudGFnID0gZXhwbGljaXQgPyB0eXBlLnRhZyA6ICc/JztcblxuICAgICAgaWYgKHR5cGUucmVwcmVzZW50KSB7XG4gICAgICAgIHN0eWxlID0gc3RhdGUuc3R5bGVNYXBbdHlwZS50YWddIHx8IHR5cGUuZGVmYXVsdFN0eWxlO1xuXG4gICAgICAgIGlmICgnW29iamVjdCBGdW5jdGlvbl0nID09PSBfdG9TdHJpbmcuY2FsbCh0eXBlLnJlcHJlc2VudCkpIHtcbiAgICAgICAgICBfcmVzdWx0ID0gdHlwZS5yZXByZXNlbnQob2JqZWN0LCBzdHlsZSk7XG4gICAgICAgIH0gZWxzZSBpZiAoX2hhc093blByb3BlcnR5LmNhbGwodHlwZS5yZXByZXNlbnQsIHN0eWxlKSkge1xuICAgICAgICAgIF9yZXN1bHQgPSB0eXBlLnJlcHJlc2VudFtzdHlsZV0ob2JqZWN0LCBzdHlsZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhyb3cgbmV3IFlBTUxFeGNlcHRpb24oJyE8JyArIHR5cGUudGFnICsgJz4gdGFnIHJlc29sdmVyIGFjY2VwdHMgbm90IFwiJyArIHN0eWxlICsgJ1wiIHN0eWxlJyk7XG4gICAgICAgIH1cblxuICAgICAgICBzdGF0ZS5kdW1wID0gX3Jlc3VsdDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG4vLyBTZXJpYWxpemVzIGBvYmplY3RgIGFuZCB3cml0ZXMgaXQgdG8gZ2xvYmFsIGByZXN1bHRgLlxuLy8gUmV0dXJucyB0cnVlIG9uIHN1Y2Nlc3MsIG9yIGZhbHNlIG9uIGludmFsaWQgb2JqZWN0LlxuLy9cbmZ1bmN0aW9uIHdyaXRlTm9kZShzdGF0ZSwgbGV2ZWwsIG9iamVjdCwgYmxvY2ssIGNvbXBhY3QsIGlza2V5KSB7XG4gIHN0YXRlLnRhZyA9IG51bGw7XG4gIHN0YXRlLmR1bXAgPSBvYmplY3Q7XG5cbiAgaWYgKCFkZXRlY3RUeXBlKHN0YXRlLCBvYmplY3QsIGZhbHNlKSkge1xuICAgIGRldGVjdFR5cGUoc3RhdGUsIG9iamVjdCwgdHJ1ZSk7XG4gIH1cblxuICB2YXIgdHlwZSA9IF90b1N0cmluZy5jYWxsKHN0YXRlLmR1bXApO1xuXG4gIGlmIChibG9jaykge1xuICAgIGJsb2NrID0gKDAgPiBzdGF0ZS5mbG93TGV2ZWwgfHwgc3RhdGUuZmxvd0xldmVsID4gbGV2ZWwpO1xuICB9XG5cbiAgdmFyIG9iamVjdE9yQXJyYXkgPSAnW29iamVjdCBPYmplY3RdJyA9PT0gdHlwZSB8fCAnW29iamVjdCBBcnJheV0nID09PSB0eXBlLFxuICAgICAgZHVwbGljYXRlSW5kZXgsXG4gICAgICBkdXBsaWNhdGU7XG5cbiAgaWYgKG9iamVjdE9yQXJyYXkpIHtcbiAgICBkdXBsaWNhdGVJbmRleCA9IHN0YXRlLmR1cGxpY2F0ZXMuaW5kZXhPZihvYmplY3QpO1xuICAgIGR1cGxpY2F0ZSA9IGR1cGxpY2F0ZUluZGV4ICE9PSAtMTtcbiAgfVxuXG4gIGlmICgobnVsbCAhPT0gc3RhdGUudGFnICYmICc/JyAhPT0gc3RhdGUudGFnKSB8fCBkdXBsaWNhdGUgfHwgKDIgIT09IHN0YXRlLmluZGVudCAmJiBsZXZlbCA+IDApKSB7XG4gICAgY29tcGFjdCA9IGZhbHNlO1xuICB9XG5cbiAgaWYgKGR1cGxpY2F0ZSAmJiBzdGF0ZS51c2VkRHVwbGljYXRlc1tkdXBsaWNhdGVJbmRleF0pIHtcbiAgICBzdGF0ZS5kdW1wID0gJypyZWZfJyArIGR1cGxpY2F0ZUluZGV4O1xuICB9IGVsc2Uge1xuICAgIGlmIChvYmplY3RPckFycmF5ICYmIGR1cGxpY2F0ZSAmJiAhc3RhdGUudXNlZER1cGxpY2F0ZXNbZHVwbGljYXRlSW5kZXhdKSB7XG4gICAgICBzdGF0ZS51c2VkRHVwbGljYXRlc1tkdXBsaWNhdGVJbmRleF0gPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoJ1tvYmplY3QgT2JqZWN0XScgPT09IHR5cGUpIHtcbiAgICAgIGlmIChibG9jayAmJiAoMCAhPT0gT2JqZWN0LmtleXMoc3RhdGUuZHVtcCkubGVuZ3RoKSkge1xuICAgICAgICB3cml0ZUJsb2NrTWFwcGluZyhzdGF0ZSwgbGV2ZWwsIHN0YXRlLmR1bXAsIGNvbXBhY3QpO1xuICAgICAgICBpZiAoZHVwbGljYXRlKSB7XG4gICAgICAgICAgc3RhdGUuZHVtcCA9ICcmcmVmXycgKyBkdXBsaWNhdGVJbmRleCArIHN0YXRlLmR1bXA7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHdyaXRlRmxvd01hcHBpbmcoc3RhdGUsIGxldmVsLCBzdGF0ZS5kdW1wKTtcbiAgICAgICAgaWYgKGR1cGxpY2F0ZSkge1xuICAgICAgICAgIHN0YXRlLmR1bXAgPSAnJnJlZl8nICsgZHVwbGljYXRlSW5kZXggKyAnICcgKyBzdGF0ZS5kdW1wO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICgnW29iamVjdCBBcnJheV0nID09PSB0eXBlKSB7XG4gICAgICBpZiAoYmxvY2sgJiYgKDAgIT09IHN0YXRlLmR1bXAubGVuZ3RoKSkge1xuICAgICAgICB3cml0ZUJsb2NrU2VxdWVuY2Uoc3RhdGUsIGxldmVsLCBzdGF0ZS5kdW1wLCBjb21wYWN0KTtcbiAgICAgICAgaWYgKGR1cGxpY2F0ZSkge1xuICAgICAgICAgIHN0YXRlLmR1bXAgPSAnJnJlZl8nICsgZHVwbGljYXRlSW5kZXggKyBzdGF0ZS5kdW1wO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB3cml0ZUZsb3dTZXF1ZW5jZShzdGF0ZSwgbGV2ZWwsIHN0YXRlLmR1bXApO1xuICAgICAgICBpZiAoZHVwbGljYXRlKSB7XG4gICAgICAgICAgc3RhdGUuZHVtcCA9ICcmcmVmXycgKyBkdXBsaWNhdGVJbmRleCArICcgJyArIHN0YXRlLmR1bXA7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKCdbb2JqZWN0IFN0cmluZ10nID09PSB0eXBlKSB7XG4gICAgICBpZiAoJz8nICE9PSBzdGF0ZS50YWcpIHtcbiAgICAgICAgd3JpdGVTY2FsYXIoc3RhdGUsIHN0YXRlLmR1bXAsIGxldmVsLCBpc2tleSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChzdGF0ZS5za2lwSW52YWxpZCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICB0aHJvdyBuZXcgWUFNTEV4Y2VwdGlvbigndW5hY2NlcHRhYmxlIGtpbmQgb2YgYW4gb2JqZWN0IHRvIGR1bXAgJyArIHR5cGUpO1xuICAgIH1cblxuICAgIGlmIChudWxsICE9PSBzdGF0ZS50YWcgJiYgJz8nICE9PSBzdGF0ZS50YWcpIHtcbiAgICAgIHN0YXRlLmR1bXAgPSAnITwnICsgc3RhdGUudGFnICsgJz4gJyArIHN0YXRlLmR1bXA7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59XG5cbmZ1bmN0aW9uIGdldER1cGxpY2F0ZVJlZmVyZW5jZXMob2JqZWN0LCBzdGF0ZSkge1xuICB2YXIgb2JqZWN0cyA9IFtdLFxuICAgICAgZHVwbGljYXRlc0luZGV4ZXMgPSBbXSxcbiAgICAgIGluZGV4LFxuICAgICAgbGVuZ3RoO1xuXG4gIGluc3BlY3ROb2RlKG9iamVjdCwgb2JqZWN0cywgZHVwbGljYXRlc0luZGV4ZXMpO1xuXG4gIGZvciAoaW5kZXggPSAwLCBsZW5ndGggPSBkdXBsaWNhdGVzSW5kZXhlcy5sZW5ndGg7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCArPSAxKSB7XG4gICAgc3RhdGUuZHVwbGljYXRlcy5wdXNoKG9iamVjdHNbZHVwbGljYXRlc0luZGV4ZXNbaW5kZXhdXSk7XG4gIH1cbiAgc3RhdGUudXNlZER1cGxpY2F0ZXMgPSBuZXcgQXJyYXkobGVuZ3RoKTtcbn1cblxuZnVuY3Rpb24gaW5zcGVjdE5vZGUob2JqZWN0LCBvYmplY3RzLCBkdXBsaWNhdGVzSW5kZXhlcykge1xuICB2YXIgb2JqZWN0S2V5TGlzdCxcbiAgICAgIGluZGV4LFxuICAgICAgbGVuZ3RoO1xuXG4gIGlmIChudWxsICE9PSBvYmplY3QgJiYgJ29iamVjdCcgPT09IHR5cGVvZiBvYmplY3QpIHtcbiAgICBpbmRleCA9IG9iamVjdHMuaW5kZXhPZihvYmplY3QpO1xuICAgIGlmICgtMSAhPT0gaW5kZXgpIHtcbiAgICAgIGlmICgtMSA9PT0gZHVwbGljYXRlc0luZGV4ZXMuaW5kZXhPZihpbmRleCkpIHtcbiAgICAgICAgZHVwbGljYXRlc0luZGV4ZXMucHVzaChpbmRleCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIG9iamVjdHMucHVzaChvYmplY3QpO1xuXG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShvYmplY3QpKSB7XG4gICAgICAgIGZvciAoaW5kZXggPSAwLCBsZW5ndGggPSBvYmplY3QubGVuZ3RoOyBpbmRleCA8IGxlbmd0aDsgaW5kZXggKz0gMSkge1xuICAgICAgICAgIGluc3BlY3ROb2RlKG9iamVjdFtpbmRleF0sIG9iamVjdHMsIGR1cGxpY2F0ZXNJbmRleGVzKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb2JqZWN0S2V5TGlzdCA9IE9iamVjdC5rZXlzKG9iamVjdCk7XG5cbiAgICAgICAgZm9yIChpbmRleCA9IDAsIGxlbmd0aCA9IG9iamVjdEtleUxpc3QubGVuZ3RoOyBpbmRleCA8IGxlbmd0aDsgaW5kZXggKz0gMSkge1xuICAgICAgICAgIGluc3BlY3ROb2RlKG9iamVjdFtvYmplY3RLZXlMaXN0W2luZGV4XV0sIG9iamVjdHMsIGR1cGxpY2F0ZXNJbmRleGVzKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBkdW1wKGlucHV0LCBvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gIHZhciBzdGF0ZSA9IG5ldyBTdGF0ZShvcHRpb25zKTtcblxuICBnZXREdXBsaWNhdGVSZWZlcmVuY2VzKGlucHV0LCBzdGF0ZSk7XG5cbiAgaWYgKHdyaXRlTm9kZShzdGF0ZSwgMCwgaW5wdXQsIHRydWUsIHRydWUpKSB7XG4gICAgcmV0dXJuIHN0YXRlLmR1bXAgKyAnXFxuJztcbiAgfVxuICByZXR1cm4gJyc7XG59XG5cbmZ1bmN0aW9uIHNhZmVEdW1wKGlucHV0LCBvcHRpb25zKSB7XG4gIHJldHVybiBkdW1wKGlucHV0LCBjb21tb24uZXh0ZW5kKHsgc2NoZW1hOiBERUZBVUxUX1NBRkVfU0NIRU1BIH0sIG9wdGlvbnMpKTtcbn1cblxubW9kdWxlLmV4cG9ydHMuZHVtcCAgICAgPSBkdW1wO1xubW9kdWxlLmV4cG9ydHMuc2FmZUR1bXAgPSBzYWZlRHVtcDtcbiIsIi8vIFlBTUwgZXJyb3IgY2xhc3MuIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvODQ1ODk4NFxuLy9cbid1c2Ugc3RyaWN0JztcblxuXG52YXIgaW5oZXJpdHMgPSByZXF1aXJlKCd1dGlsJykuaW5oZXJpdHM7XG5cblxuZnVuY3Rpb24gWUFNTEV4Y2VwdGlvbihyZWFzb24sIG1hcmspIHtcbiAgLy8gU3VwZXIgY29uc3RydWN0b3JcbiAgRXJyb3IuY2FsbCh0aGlzKTtcblxuICAvLyBJbmNsdWRlIHN0YWNrIHRyYWNlIGluIGVycm9yIG9iamVjdFxuICBpZiAoRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UpIHtcbiAgICAvLyBDaHJvbWUgYW5kIE5vZGVKU1xuICAgIEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKHRoaXMsIHRoaXMuY29uc3RydWN0b3IpO1xuICB9IGVsc2Uge1xuICAgIC8vIEZGLCBJRSAxMCsgYW5kIFNhZmFyaSA2Ky4gRmFsbGJhY2sgZm9yIG90aGVyc1xuICAgIHRoaXMuc3RhY2sgPSAobmV3IEVycm9yKCkpLnN0YWNrIHx8ICcnO1xuICB9XG5cbiAgdGhpcy5uYW1lID0gJ1lBTUxFeGNlcHRpb24nO1xuICB0aGlzLnJlYXNvbiA9IHJlYXNvbjtcbiAgdGhpcy5tYXJrID0gbWFyaztcbiAgdGhpcy5tZXNzYWdlID0gKHRoaXMucmVhc29uIHx8ICcodW5rbm93biByZWFzb24pJykgKyAodGhpcy5tYXJrID8gJyAnICsgdGhpcy5tYXJrLnRvU3RyaW5nKCkgOiAnJyk7XG59XG5cblxuLy8gSW5oZXJpdCBmcm9tIEVycm9yXG5pbmhlcml0cyhZQU1MRXhjZXB0aW9uLCBFcnJvcik7XG5cblxuWUFNTEV4Y2VwdGlvbi5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZyhjb21wYWN0KSB7XG4gIHZhciByZXN1bHQgPSB0aGlzLm5hbWUgKyAnOiAnO1xuXG4gIHJlc3VsdCArPSB0aGlzLnJlYXNvbiB8fCAnKHVua25vd24gcmVhc29uKSc7XG5cbiAgaWYgKCFjb21wYWN0ICYmIHRoaXMubWFyaykge1xuICAgIHJlc3VsdCArPSAnICcgKyB0aGlzLm1hcmsudG9TdHJpbmcoKTtcbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gWUFNTEV4Y2VwdGlvbjtcbiIsIid1c2Ugc3RyaWN0JztcblxuLyplc2xpbnQtZGlzYWJsZSBtYXgtbGVuLG5vLXVzZS1iZWZvcmUtZGVmaW5lKi9cblxudmFyIGNvbW1vbiAgICAgICAgICAgICAgPSByZXF1aXJlKCcuL2NvbW1vbicpO1xudmFyIFlBTUxFeGNlcHRpb24gICAgICAgPSByZXF1aXJlKCcuL2V4Y2VwdGlvbicpO1xudmFyIE1hcmsgICAgICAgICAgICAgICAgPSByZXF1aXJlKCcuL21hcmsnKTtcbnZhciBERUZBVUxUX1NBRkVfU0NIRU1BID0gcmVxdWlyZSgnLi9zY2hlbWEvZGVmYXVsdF9zYWZlJyk7XG52YXIgREVGQVVMVF9GVUxMX1NDSEVNQSA9IHJlcXVpcmUoJy4vc2NoZW1hL2RlZmF1bHRfZnVsbCcpO1xuXG5cbnZhciBfaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuXG5cbnZhciBDT05URVhUX0ZMT1dfSU4gICA9IDE7XG52YXIgQ09OVEVYVF9GTE9XX09VVCAgPSAyO1xudmFyIENPTlRFWFRfQkxPQ0tfSU4gID0gMztcbnZhciBDT05URVhUX0JMT0NLX09VVCA9IDQ7XG5cblxudmFyIENIT01QSU5HX0NMSVAgID0gMTtcbnZhciBDSE9NUElOR19TVFJJUCA9IDI7XG52YXIgQ0hPTVBJTkdfS0VFUCAgPSAzO1xuXG5cbnZhciBQQVRURVJOX05PTl9QUklOVEFCTEUgICAgICAgICA9IC9bXFx4MDAtXFx4MDhcXHgwQlxceDBDXFx4MEUtXFx4MUZcXHg3Ri1cXHg4NFxceDg2LVxceDlGXFx1RkZGRVxcdUZGRkZdfFtcXHVEODAwLVxcdURCRkZdKD8hW1xcdURDMDAtXFx1REZGRl0pfCg/OlteXFx1RDgwMC1cXHVEQkZGXXxeKVtcXHVEQzAwLVxcdURGRkZdLztcbnZhciBQQVRURVJOX05PTl9BU0NJSV9MSU5FX0JSRUFLUyA9IC9bXFx4ODVcXHUyMDI4XFx1MjAyOV0vO1xudmFyIFBBVFRFUk5fRkxPV19JTkRJQ0FUT1JTICAgICAgID0gL1ssXFxbXFxdXFx7XFx9XS87XG52YXIgUEFUVEVSTl9UQUdfSEFORExFICAgICAgICAgICAgPSAvXig/OiF8ISF8IVthLXpcXC1dKyEpJC9pO1xudmFyIFBBVFRFUk5fVEFHX1VSSSAgICAgICAgICAgICAgID0gL14oPzohfFteLFxcW1xcXVxce1xcfV0pKD86JVswLTlhLWZdezJ9fFswLTlhLXpcXC0jO1xcL1xcPzpAJj1cXCtcXCQsX1xcLiF+XFwqJ1xcKFxcKVxcW1xcXV0pKiQvaTtcblxuXG5mdW5jdGlvbiBpc19FT0woYykge1xuICByZXR1cm4gKGMgPT09IDB4MEEvKiBMRiAqLykgfHwgKGMgPT09IDB4MEQvKiBDUiAqLyk7XG59XG5cbmZ1bmN0aW9uIGlzX1dISVRFX1NQQUNFKGMpIHtcbiAgcmV0dXJuIChjID09PSAweDA5LyogVGFiICovKSB8fCAoYyA9PT0gMHgyMC8qIFNwYWNlICovKTtcbn1cblxuZnVuY3Rpb24gaXNfV1NfT1JfRU9MKGMpIHtcbiAgcmV0dXJuIChjID09PSAweDA5LyogVGFiICovKSB8fFxuICAgICAgICAgKGMgPT09IDB4MjAvKiBTcGFjZSAqLykgfHxcbiAgICAgICAgIChjID09PSAweDBBLyogTEYgKi8pIHx8XG4gICAgICAgICAoYyA9PT0gMHgwRC8qIENSICovKTtcbn1cblxuZnVuY3Rpb24gaXNfRkxPV19JTkRJQ0FUT1IoYykge1xuICByZXR1cm4gMHgyQy8qICwgKi8gPT09IGMgfHxcbiAgICAgICAgIDB4NUIvKiBbICovID09PSBjIHx8XG4gICAgICAgICAweDVELyogXSAqLyA9PT0gYyB8fFxuICAgICAgICAgMHg3Qi8qIHsgKi8gPT09IGMgfHxcbiAgICAgICAgIDB4N0QvKiB9ICovID09PSBjO1xufVxuXG5mdW5jdGlvbiBmcm9tSGV4Q29kZShjKSB7XG4gIHZhciBsYztcblxuICBpZiAoKDB4MzAvKiAwICovIDw9IGMpICYmIChjIDw9IDB4MzkvKiA5ICovKSkge1xuICAgIHJldHVybiBjIC0gMHgzMDtcbiAgfVxuXG4gIC8qZXNsaW50LWRpc2FibGUgbm8tYml0d2lzZSovXG4gIGxjID0gYyB8IDB4MjA7XG5cbiAgaWYgKCgweDYxLyogYSAqLyA8PSBsYykgJiYgKGxjIDw9IDB4NjYvKiBmICovKSkge1xuICAgIHJldHVybiBsYyAtIDB4NjEgKyAxMDtcbiAgfVxuXG4gIHJldHVybiAtMTtcbn1cblxuZnVuY3Rpb24gZXNjYXBlZEhleExlbihjKSB7XG4gIGlmIChjID09PSAweDc4LyogeCAqLykgeyByZXR1cm4gMjsgfVxuICBpZiAoYyA9PT0gMHg3NS8qIHUgKi8pIHsgcmV0dXJuIDQ7IH1cbiAgaWYgKGMgPT09IDB4NTUvKiBVICovKSB7IHJldHVybiA4OyB9XG4gIHJldHVybiAwO1xufVxuXG5mdW5jdGlvbiBmcm9tRGVjaW1hbENvZGUoYykge1xuICBpZiAoKDB4MzAvKiAwICovIDw9IGMpICYmIChjIDw9IDB4MzkvKiA5ICovKSkge1xuICAgIHJldHVybiBjIC0gMHgzMDtcbiAgfVxuXG4gIHJldHVybiAtMTtcbn1cblxuZnVuY3Rpb24gc2ltcGxlRXNjYXBlU2VxdWVuY2UoYykge1xuICByZXR1cm4gKGMgPT09IDB4MzAvKiAwICovKSA/ICdcXHgwMCcgOlxuICAgICAgICAoYyA9PT0gMHg2MS8qIGEgKi8pID8gJ1xceDA3JyA6XG4gICAgICAgIChjID09PSAweDYyLyogYiAqLykgPyAnXFx4MDgnIDpcbiAgICAgICAgKGMgPT09IDB4NzQvKiB0ICovKSA/ICdcXHgwOScgOlxuICAgICAgICAoYyA9PT0gMHgwOS8qIFRhYiAqLykgPyAnXFx4MDknIDpcbiAgICAgICAgKGMgPT09IDB4NkUvKiBuICovKSA/ICdcXHgwQScgOlxuICAgICAgICAoYyA9PT0gMHg3Ni8qIHYgKi8pID8gJ1xceDBCJyA6XG4gICAgICAgIChjID09PSAweDY2LyogZiAqLykgPyAnXFx4MEMnIDpcbiAgICAgICAgKGMgPT09IDB4NzIvKiByICovKSA/ICdcXHgwRCcgOlxuICAgICAgICAoYyA9PT0gMHg2NS8qIGUgKi8pID8gJ1xceDFCJyA6XG4gICAgICAgIChjID09PSAweDIwLyogU3BhY2UgKi8pID8gJyAnIDpcbiAgICAgICAgKGMgPT09IDB4MjIvKiBcIiAqLykgPyAnXFx4MjInIDpcbiAgICAgICAgKGMgPT09IDB4MkYvKiAvICovKSA/ICcvJyA6XG4gICAgICAgIChjID09PSAweDVDLyogXFwgKi8pID8gJ1xceDVDJyA6XG4gICAgICAgIChjID09PSAweDRFLyogTiAqLykgPyAnXFx4ODUnIDpcbiAgICAgICAgKGMgPT09IDB4NUYvKiBfICovKSA/ICdcXHhBMCcgOlxuICAgICAgICAoYyA9PT0gMHg0Qy8qIEwgKi8pID8gJ1xcdTIwMjgnIDpcbiAgICAgICAgKGMgPT09IDB4NTAvKiBQICovKSA/ICdcXHUyMDI5JyA6ICcnO1xufVxuXG5mdW5jdGlvbiBjaGFyRnJvbUNvZGVwb2ludChjKSB7XG4gIGlmIChjIDw9IDB4RkZGRikge1xuICAgIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKGMpO1xuICB9XG4gIC8vIEVuY29kZSBVVEYtMTYgc3Vycm9nYXRlIHBhaXJcbiAgLy8gaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvVVRGLTE2I0NvZGVfcG9pbnRzX1UuMkIwMTAwMDBfdG9fVS4yQjEwRkZGRlxuICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZSgoKGMgLSAweDAxMDAwMCkgPj4gMTApICsgMHhEODAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKGMgLSAweDAxMDAwMCkgJiAweDAzRkYpICsgMHhEQzAwKTtcbn1cblxudmFyIHNpbXBsZUVzY2FwZUNoZWNrID0gbmV3IEFycmF5KDI1Nik7IC8vIGludGVnZXIsIGZvciBmYXN0IGFjY2Vzc1xudmFyIHNpbXBsZUVzY2FwZU1hcCA9IG5ldyBBcnJheSgyNTYpO1xuZm9yICh2YXIgaSA9IDA7IGkgPCAyNTY7IGkrKykge1xuICBzaW1wbGVFc2NhcGVDaGVja1tpXSA9IHNpbXBsZUVzY2FwZVNlcXVlbmNlKGkpID8gMSA6IDA7XG4gIHNpbXBsZUVzY2FwZU1hcFtpXSA9IHNpbXBsZUVzY2FwZVNlcXVlbmNlKGkpO1xufVxuXG5cbmZ1bmN0aW9uIFN0YXRlKGlucHV0LCBvcHRpb25zKSB7XG4gIHRoaXMuaW5wdXQgPSBpbnB1dDtcblxuICB0aGlzLmZpbGVuYW1lICA9IG9wdGlvbnNbJ2ZpbGVuYW1lJ10gIHx8IG51bGw7XG4gIHRoaXMuc2NoZW1hICAgID0gb3B0aW9uc1snc2NoZW1hJ10gICAgfHwgREVGQVVMVF9GVUxMX1NDSEVNQTtcbiAgdGhpcy5vbldhcm5pbmcgPSBvcHRpb25zWydvbldhcm5pbmcnXSB8fCBudWxsO1xuICB0aGlzLmxlZ2FjeSAgICA9IG9wdGlvbnNbJ2xlZ2FjeSddICAgIHx8IGZhbHNlO1xuXG4gIHRoaXMuaW1wbGljaXRUeXBlcyA9IHRoaXMuc2NoZW1hLmNvbXBpbGVkSW1wbGljaXQ7XG4gIHRoaXMudHlwZU1hcCAgICAgICA9IHRoaXMuc2NoZW1hLmNvbXBpbGVkVHlwZU1hcDtcblxuICB0aGlzLmxlbmd0aCAgICAgPSBpbnB1dC5sZW5ndGg7XG4gIHRoaXMucG9zaXRpb24gICA9IDA7XG4gIHRoaXMubGluZSAgICAgICA9IDA7XG4gIHRoaXMubGluZVN0YXJ0ICA9IDA7XG4gIHRoaXMubGluZUluZGVudCA9IDA7XG5cbiAgdGhpcy5kb2N1bWVudHMgPSBbXTtcblxuICAvKlxuICB0aGlzLnZlcnNpb247XG4gIHRoaXMuY2hlY2tMaW5lQnJlYWtzO1xuICB0aGlzLnRhZ01hcDtcbiAgdGhpcy5hbmNob3JNYXA7XG4gIHRoaXMudGFnO1xuICB0aGlzLmFuY2hvcjtcbiAgdGhpcy5raW5kO1xuICB0aGlzLnJlc3VsdDsqL1xuXG59XG5cblxuZnVuY3Rpb24gZ2VuZXJhdGVFcnJvcihzdGF0ZSwgbWVzc2FnZSkge1xuICByZXR1cm4gbmV3IFlBTUxFeGNlcHRpb24oXG4gICAgbWVzc2FnZSxcbiAgICBuZXcgTWFyayhzdGF0ZS5maWxlbmFtZSwgc3RhdGUuaW5wdXQsIHN0YXRlLnBvc2l0aW9uLCBzdGF0ZS5saW5lLCAoc3RhdGUucG9zaXRpb24gLSBzdGF0ZS5saW5lU3RhcnQpKSk7XG59XG5cbmZ1bmN0aW9uIHRocm93RXJyb3Ioc3RhdGUsIG1lc3NhZ2UpIHtcbiAgdGhyb3cgZ2VuZXJhdGVFcnJvcihzdGF0ZSwgbWVzc2FnZSk7XG59XG5cbmZ1bmN0aW9uIHRocm93V2FybmluZyhzdGF0ZSwgbWVzc2FnZSkge1xuICBpZiAoc3RhdGUub25XYXJuaW5nKSB7XG4gICAgc3RhdGUub25XYXJuaW5nLmNhbGwobnVsbCwgZ2VuZXJhdGVFcnJvcihzdGF0ZSwgbWVzc2FnZSkpO1xuICB9XG59XG5cblxudmFyIGRpcmVjdGl2ZUhhbmRsZXJzID0ge1xuXG4gIFlBTUw6IGZ1bmN0aW9uIGhhbmRsZVlhbWxEaXJlY3RpdmUoc3RhdGUsIG5hbWUsIGFyZ3MpIHtcblxuICAgICAgdmFyIG1hdGNoLCBtYWpvciwgbWlub3I7XG5cbiAgICAgIGlmIChudWxsICE9PSBzdGF0ZS52ZXJzaW9uKSB7XG4gICAgICAgIHRocm93RXJyb3Ioc3RhdGUsICdkdXBsaWNhdGlvbiBvZiAlWUFNTCBkaXJlY3RpdmUnKTtcbiAgICAgIH1cblxuICAgICAgaWYgKDEgIT09IGFyZ3MubGVuZ3RoKSB7XG4gICAgICAgIHRocm93RXJyb3Ioc3RhdGUsICdZQU1MIGRpcmVjdGl2ZSBhY2NlcHRzIGV4YWN0bHkgb25lIGFyZ3VtZW50Jyk7XG4gICAgICB9XG5cbiAgICAgIG1hdGNoID0gL14oWzAtOV0rKVxcLihbMC05XSspJC8uZXhlYyhhcmdzWzBdKTtcblxuICAgICAgaWYgKG51bGwgPT09IG1hdGNoKSB7XG4gICAgICAgIHRocm93RXJyb3Ioc3RhdGUsICdpbGwtZm9ybWVkIGFyZ3VtZW50IG9mIHRoZSBZQU1MIGRpcmVjdGl2ZScpO1xuICAgICAgfVxuXG4gICAgICBtYWpvciA9IHBhcnNlSW50KG1hdGNoWzFdLCAxMCk7XG4gICAgICBtaW5vciA9IHBhcnNlSW50KG1hdGNoWzJdLCAxMCk7XG5cbiAgICAgIGlmICgxICE9PSBtYWpvcikge1xuICAgICAgICB0aHJvd0Vycm9yKHN0YXRlLCAndW5hY2NlcHRhYmxlIFlBTUwgdmVyc2lvbiBvZiB0aGUgZG9jdW1lbnQnKTtcbiAgICAgIH1cblxuICAgICAgc3RhdGUudmVyc2lvbiA9IGFyZ3NbMF07XG4gICAgICBzdGF0ZS5jaGVja0xpbmVCcmVha3MgPSAobWlub3IgPCAyKTtcblxuICAgICAgaWYgKDEgIT09IG1pbm9yICYmIDIgIT09IG1pbm9yKSB7XG4gICAgICAgIHRocm93V2FybmluZyhzdGF0ZSwgJ3Vuc3VwcG9ydGVkIFlBTUwgdmVyc2lvbiBvZiB0aGUgZG9jdW1lbnQnKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gIFRBRzogZnVuY3Rpb24gaGFuZGxlVGFnRGlyZWN0aXZlKHN0YXRlLCBuYW1lLCBhcmdzKSB7XG5cbiAgICAgIHZhciBoYW5kbGUsIHByZWZpeDtcblxuICAgICAgaWYgKDIgIT09IGFyZ3MubGVuZ3RoKSB7XG4gICAgICAgIHRocm93RXJyb3Ioc3RhdGUsICdUQUcgZGlyZWN0aXZlIGFjY2VwdHMgZXhhY3RseSB0d28gYXJndW1lbnRzJyk7XG4gICAgICB9XG5cbiAgICAgIGhhbmRsZSA9IGFyZ3NbMF07XG4gICAgICBwcmVmaXggPSBhcmdzWzFdO1xuXG4gICAgICBpZiAoIVBBVFRFUk5fVEFHX0hBTkRMRS50ZXN0KGhhbmRsZSkpIHtcbiAgICAgICAgdGhyb3dFcnJvcihzdGF0ZSwgJ2lsbC1mb3JtZWQgdGFnIGhhbmRsZSAoZmlyc3QgYXJndW1lbnQpIG9mIHRoZSBUQUcgZGlyZWN0aXZlJyk7XG4gICAgICB9XG5cbiAgICAgIGlmIChfaGFzT3duUHJvcGVydHkuY2FsbChzdGF0ZS50YWdNYXAsIGhhbmRsZSkpIHtcbiAgICAgICAgdGhyb3dFcnJvcihzdGF0ZSwgJ3RoZXJlIGlzIGEgcHJldmlvdXNseSBkZWNsYXJlZCBzdWZmaXggZm9yIFwiJyArIGhhbmRsZSArICdcIiB0YWcgaGFuZGxlJyk7XG4gICAgICB9XG5cbiAgICAgIGlmICghUEFUVEVSTl9UQUdfVVJJLnRlc3QocHJlZml4KSkge1xuICAgICAgICB0aHJvd0Vycm9yKHN0YXRlLCAnaWxsLWZvcm1lZCB0YWcgcHJlZml4IChzZWNvbmQgYXJndW1lbnQpIG9mIHRoZSBUQUcgZGlyZWN0aXZlJyk7XG4gICAgICB9XG5cbiAgICAgIHN0YXRlLnRhZ01hcFtoYW5kbGVdID0gcHJlZml4O1xuICAgIH1cbn07XG5cblxuZnVuY3Rpb24gY2FwdHVyZVNlZ21lbnQoc3RhdGUsIHN0YXJ0LCBlbmQsIGNoZWNrSnNvbikge1xuICB2YXIgX3Bvc2l0aW9uLCBfbGVuZ3RoLCBfY2hhcmFjdGVyLCBfcmVzdWx0O1xuXG4gIGlmIChzdGFydCA8IGVuZCkge1xuICAgIF9yZXN1bHQgPSBzdGF0ZS5pbnB1dC5zbGljZShzdGFydCwgZW5kKTtcblxuICAgIGlmIChjaGVja0pzb24pIHtcbiAgICAgIGZvciAoX3Bvc2l0aW9uID0gMCwgX2xlbmd0aCA9IF9yZXN1bHQubGVuZ3RoO1xuICAgICAgICAgICBfcG9zaXRpb24gPCBfbGVuZ3RoO1xuICAgICAgICAgICBfcG9zaXRpb24gKz0gMSkge1xuICAgICAgICBfY2hhcmFjdGVyID0gX3Jlc3VsdC5jaGFyQ29kZUF0KF9wb3NpdGlvbik7XG4gICAgICAgIGlmICghKDB4MDkgPT09IF9jaGFyYWN0ZXIgfHxcbiAgICAgICAgICAgICAgMHgyMCA8PSBfY2hhcmFjdGVyICYmIF9jaGFyYWN0ZXIgPD0gMHgxMEZGRkYpKSB7XG4gICAgICAgICAgdGhyb3dFcnJvcihzdGF0ZSwgJ2V4cGVjdGVkIHZhbGlkIEpTT04gY2hhcmFjdGVyJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBzdGF0ZS5yZXN1bHQgKz0gX3Jlc3VsdDtcbiAgfVxufVxuXG5mdW5jdGlvbiBtZXJnZU1hcHBpbmdzKHN0YXRlLCBkZXN0aW5hdGlvbiwgc291cmNlKSB7XG4gIHZhciBzb3VyY2VLZXlzLCBrZXksIGluZGV4LCBxdWFudGl0eTtcblxuICBpZiAoIWNvbW1vbi5pc09iamVjdChzb3VyY2UpKSB7XG4gICAgdGhyb3dFcnJvcihzdGF0ZSwgJ2Nhbm5vdCBtZXJnZSBtYXBwaW5nczsgdGhlIHByb3ZpZGVkIHNvdXJjZSBvYmplY3QgaXMgdW5hY2NlcHRhYmxlJyk7XG4gIH1cblxuICBzb3VyY2VLZXlzID0gT2JqZWN0LmtleXMoc291cmNlKTtcblxuICBmb3IgKGluZGV4ID0gMCwgcXVhbnRpdHkgPSBzb3VyY2VLZXlzLmxlbmd0aDsgaW5kZXggPCBxdWFudGl0eTsgaW5kZXggKz0gMSkge1xuICAgIGtleSA9IHNvdXJjZUtleXNbaW5kZXhdO1xuXG4gICAgaWYgKCFfaGFzT3duUHJvcGVydHkuY2FsbChkZXN0aW5hdGlvbiwga2V5KSkge1xuICAgICAgZGVzdGluYXRpb25ba2V5XSA9IHNvdXJjZVtrZXldO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBzdG9yZU1hcHBpbmdQYWlyKHN0YXRlLCBfcmVzdWx0LCBrZXlUYWcsIGtleU5vZGUsIHZhbHVlTm9kZSkge1xuICB2YXIgaW5kZXgsIHF1YW50aXR5O1xuXG4gIGtleU5vZGUgPSBTdHJpbmcoa2V5Tm9kZSk7XG5cbiAgaWYgKG51bGwgPT09IF9yZXN1bHQpIHtcbiAgICBfcmVzdWx0ID0ge307XG4gIH1cblxuICBpZiAoJ3RhZzp5YW1sLm9yZywyMDAyOm1lcmdlJyA9PT0ga2V5VGFnKSB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWVOb2RlKSkge1xuICAgICAgZm9yIChpbmRleCA9IDAsIHF1YW50aXR5ID0gdmFsdWVOb2RlLmxlbmd0aDsgaW5kZXggPCBxdWFudGl0eTsgaW5kZXggKz0gMSkge1xuICAgICAgICBtZXJnZU1hcHBpbmdzKHN0YXRlLCBfcmVzdWx0LCB2YWx1ZU5vZGVbaW5kZXhdKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgbWVyZ2VNYXBwaW5ncyhzdGF0ZSwgX3Jlc3VsdCwgdmFsdWVOb2RlKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgX3Jlc3VsdFtrZXlOb2RlXSA9IHZhbHVlTm9kZTtcbiAgfVxuXG4gIHJldHVybiBfcmVzdWx0O1xufVxuXG5mdW5jdGlvbiByZWFkTGluZUJyZWFrKHN0YXRlKSB7XG4gIHZhciBjaDtcblxuICBjaCA9IHN0YXRlLmlucHV0LmNoYXJDb2RlQXQoc3RhdGUucG9zaXRpb24pO1xuXG4gIGlmICgweDBBLyogTEYgKi8gPT09IGNoKSB7XG4gICAgc3RhdGUucG9zaXRpb24rKztcbiAgfSBlbHNlIGlmICgweDBELyogQ1IgKi8gPT09IGNoKSB7XG4gICAgc3RhdGUucG9zaXRpb24rKztcbiAgICBpZiAoMHgwQS8qIExGICovID09PSBzdGF0ZS5pbnB1dC5jaGFyQ29kZUF0KHN0YXRlLnBvc2l0aW9uKSkge1xuICAgICAgc3RhdGUucG9zaXRpb24rKztcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdGhyb3dFcnJvcihzdGF0ZSwgJ2EgbGluZSBicmVhayBpcyBleHBlY3RlZCcpO1xuICB9XG5cbiAgc3RhdGUubGluZSArPSAxO1xuICBzdGF0ZS5saW5lU3RhcnQgPSBzdGF0ZS5wb3NpdGlvbjtcbn1cblxuZnVuY3Rpb24gc2tpcFNlcGFyYXRpb25TcGFjZShzdGF0ZSwgYWxsb3dDb21tZW50cywgY2hlY2tJbmRlbnQpIHtcbiAgdmFyIGxpbmVCcmVha3MgPSAwLFxuICAgICAgY2ggPSBzdGF0ZS5pbnB1dC5jaGFyQ29kZUF0KHN0YXRlLnBvc2l0aW9uKTtcblxuICB3aGlsZSAoMCAhPT0gY2gpIHtcbiAgICB3aGlsZSAoaXNfV0hJVEVfU1BBQ0UoY2gpKSB7XG4gICAgICBjaCA9IHN0YXRlLmlucHV0LmNoYXJDb2RlQXQoKytzdGF0ZS5wb3NpdGlvbik7XG4gICAgfVxuXG4gICAgaWYgKGFsbG93Q29tbWVudHMgJiYgMHgyMy8qICMgKi8gPT09IGNoKSB7XG4gICAgICBkbyB7XG4gICAgICAgIGNoID0gc3RhdGUuaW5wdXQuY2hhckNvZGVBdCgrK3N0YXRlLnBvc2l0aW9uKTtcbiAgICAgIH0gd2hpbGUgKGNoICE9PSAweDBBLyogTEYgKi8gJiYgY2ggIT09IDB4MEQvKiBDUiAqLyAmJiAwICE9PSBjaCk7XG4gICAgfVxuXG4gICAgaWYgKGlzX0VPTChjaCkpIHtcbiAgICAgIHJlYWRMaW5lQnJlYWsoc3RhdGUpO1xuXG4gICAgICBjaCA9IHN0YXRlLmlucHV0LmNoYXJDb2RlQXQoc3RhdGUucG9zaXRpb24pO1xuICAgICAgbGluZUJyZWFrcysrO1xuICAgICAgc3RhdGUubGluZUluZGVudCA9IDA7XG5cbiAgICAgIHdoaWxlICgweDIwLyogU3BhY2UgKi8gPT09IGNoKSB7XG4gICAgICAgIHN0YXRlLmxpbmVJbmRlbnQrKztcbiAgICAgICAgY2ggPSBzdGF0ZS5pbnB1dC5jaGFyQ29kZUF0KCsrc3RhdGUucG9zaXRpb24pO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBpZiAoLTEgIT09IGNoZWNrSW5kZW50ICYmIDAgIT09IGxpbmVCcmVha3MgJiYgc3RhdGUubGluZUluZGVudCA8IGNoZWNrSW5kZW50KSB7XG4gICAgdGhyb3dXYXJuaW5nKHN0YXRlLCAnZGVmaWNpZW50IGluZGVudGF0aW9uJyk7XG4gIH1cblxuICByZXR1cm4gbGluZUJyZWFrcztcbn1cblxuZnVuY3Rpb24gdGVzdERvY3VtZW50U2VwYXJhdG9yKHN0YXRlKSB7XG4gIHZhciBfcG9zaXRpb24gPSBzdGF0ZS5wb3NpdGlvbixcbiAgICAgIGNoO1xuXG4gIGNoID0gc3RhdGUuaW5wdXQuY2hhckNvZGVBdChfcG9zaXRpb24pO1xuXG4gIC8vIENvbmRpdGlvbiBzdGF0ZS5wb3NpdGlvbiA9PT0gc3RhdGUubGluZVN0YXJ0IGlzIHRlc3RlZFxuICAvLyBpbiBwYXJlbnQgb24gZWFjaCBjYWxsLCBmb3IgZWZmaWNpZW5jeS4gTm8gbmVlZHMgdG8gdGVzdCBoZXJlIGFnYWluLlxuICBpZiAoKDB4MkQvKiAtICovID09PSBjaCB8fCAweDJFLyogLiAqLyA9PT0gY2gpICYmXG4gICAgICBzdGF0ZS5pbnB1dC5jaGFyQ29kZUF0KF9wb3NpdGlvbiArIDEpID09PSBjaCAmJlxuICAgICAgc3RhdGUuaW5wdXQuY2hhckNvZGVBdChfcG9zaXRpb24gKyAyKSA9PT0gY2gpIHtcblxuICAgIF9wb3NpdGlvbiArPSAzO1xuXG4gICAgY2ggPSBzdGF0ZS5pbnB1dC5jaGFyQ29kZUF0KF9wb3NpdGlvbik7XG5cbiAgICBpZiAoY2ggPT09IDAgfHwgaXNfV1NfT1JfRU9MKGNoKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiB3cml0ZUZvbGRlZExpbmVzKHN0YXRlLCBjb3VudCkge1xuICBpZiAoMSA9PT0gY291bnQpIHtcbiAgICBzdGF0ZS5yZXN1bHQgKz0gJyAnO1xuICB9IGVsc2UgaWYgKGNvdW50ID4gMSkge1xuICAgIHN0YXRlLnJlc3VsdCArPSBjb21tb24ucmVwZWF0KCdcXG4nLCBjb3VudCAtIDEpO1xuICB9XG59XG5cblxuZnVuY3Rpb24gcmVhZFBsYWluU2NhbGFyKHN0YXRlLCBub2RlSW5kZW50LCB3aXRoaW5GbG93Q29sbGVjdGlvbikge1xuICB2YXIgcHJlY2VkaW5nLFxuICAgICAgZm9sbG93aW5nLFxuICAgICAgY2FwdHVyZVN0YXJ0LFxuICAgICAgY2FwdHVyZUVuZCxcbiAgICAgIGhhc1BlbmRpbmdDb250ZW50LFxuICAgICAgX2xpbmUsXG4gICAgICBfbGluZVN0YXJ0LFxuICAgICAgX2xpbmVJbmRlbnQsXG4gICAgICBfa2luZCA9IHN0YXRlLmtpbmQsXG4gICAgICBfcmVzdWx0ID0gc3RhdGUucmVzdWx0LFxuICAgICAgY2g7XG5cbiAgY2ggPSBzdGF0ZS5pbnB1dC5jaGFyQ29kZUF0KHN0YXRlLnBvc2l0aW9uKTtcblxuICBpZiAoaXNfV1NfT1JfRU9MKGNoKSAgICAgICAgICAgICB8fFxuICAgICAgaXNfRkxPV19JTkRJQ0FUT1IoY2gpICAgICAgICB8fFxuICAgICAgMHgyMy8qICMgKi8gICAgICAgICAgID09PSBjaCB8fFxuICAgICAgMHgyNi8qICYgKi8gICAgICAgICAgID09PSBjaCB8fFxuICAgICAgMHgyQS8qICogKi8gICAgICAgICAgID09PSBjaCB8fFxuICAgICAgMHgyMS8qICEgKi8gICAgICAgICAgID09PSBjaCB8fFxuICAgICAgMHg3Qy8qIHwgKi8gICAgICAgICAgID09PSBjaCB8fFxuICAgICAgMHgzRS8qID4gKi8gICAgICAgICAgID09PSBjaCB8fFxuICAgICAgMHgyNy8qICcgKi8gICAgICAgICAgID09PSBjaCB8fFxuICAgICAgMHgyMi8qIFwiICovICAgICAgICAgICA9PT0gY2ggfHxcbiAgICAgIDB4MjUvKiAlICovICAgICAgICAgICA9PT0gY2ggfHxcbiAgICAgIDB4NDAvKiBAICovICAgICAgICAgICA9PT0gY2ggfHxcbiAgICAgIDB4NjAvKiBgICovICAgICAgICAgICA9PT0gY2gpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAoMHgzRi8qID8gKi8gPT09IGNoIHx8IDB4MkQvKiAtICovID09PSBjaCkge1xuICAgIGZvbGxvd2luZyA9IHN0YXRlLmlucHV0LmNoYXJDb2RlQXQoc3RhdGUucG9zaXRpb24gKyAxKTtcblxuICAgIGlmIChpc19XU19PUl9FT0woZm9sbG93aW5nKSB8fFxuICAgICAgICB3aXRoaW5GbG93Q29sbGVjdGlvbiAmJiBpc19GTE9XX0lORElDQVRPUihmb2xsb3dpbmcpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgc3RhdGUua2luZCA9ICdzY2FsYXInO1xuICBzdGF0ZS5yZXN1bHQgPSAnJztcbiAgY2FwdHVyZVN0YXJ0ID0gY2FwdHVyZUVuZCA9IHN0YXRlLnBvc2l0aW9uO1xuICBoYXNQZW5kaW5nQ29udGVudCA9IGZhbHNlO1xuXG4gIHdoaWxlICgwICE9PSBjaCkge1xuICAgIGlmICgweDNBLyogOiAqLyA9PT0gY2gpIHtcbiAgICAgIGZvbGxvd2luZyA9IHN0YXRlLmlucHV0LmNoYXJDb2RlQXQoc3RhdGUucG9zaXRpb24gKyAxKTtcblxuICAgICAgaWYgKGlzX1dTX09SX0VPTChmb2xsb3dpbmcpIHx8XG4gICAgICAgICAgd2l0aGluRmxvd0NvbGxlY3Rpb24gJiYgaXNfRkxPV19JTkRJQ0FUT1IoZm9sbG93aW5nKSkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgIH0gZWxzZSBpZiAoMHgyMy8qICMgKi8gPT09IGNoKSB7XG4gICAgICBwcmVjZWRpbmcgPSBzdGF0ZS5pbnB1dC5jaGFyQ29kZUF0KHN0YXRlLnBvc2l0aW9uIC0gMSk7XG5cbiAgICAgIGlmIChpc19XU19PUl9FT0wocHJlY2VkaW5nKSkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgIH0gZWxzZSBpZiAoKHN0YXRlLnBvc2l0aW9uID09PSBzdGF0ZS5saW5lU3RhcnQgJiYgdGVzdERvY3VtZW50U2VwYXJhdG9yKHN0YXRlKSkgfHxcbiAgICAgICAgICAgICAgIHdpdGhpbkZsb3dDb2xsZWN0aW9uICYmIGlzX0ZMT1dfSU5ESUNBVE9SKGNoKSkge1xuICAgICAgYnJlYWs7XG5cbiAgICB9IGVsc2UgaWYgKGlzX0VPTChjaCkpIHtcbiAgICAgIF9saW5lID0gc3RhdGUubGluZTtcbiAgICAgIF9saW5lU3RhcnQgPSBzdGF0ZS5saW5lU3RhcnQ7XG4gICAgICBfbGluZUluZGVudCA9IHN0YXRlLmxpbmVJbmRlbnQ7XG4gICAgICBza2lwU2VwYXJhdGlvblNwYWNlKHN0YXRlLCBmYWxzZSwgLTEpO1xuXG4gICAgICBpZiAoc3RhdGUubGluZUluZGVudCA+PSBub2RlSW5kZW50KSB7XG4gICAgICAgIGhhc1BlbmRpbmdDb250ZW50ID0gdHJ1ZTtcbiAgICAgICAgY2ggPSBzdGF0ZS5pbnB1dC5jaGFyQ29kZUF0KHN0YXRlLnBvc2l0aW9uKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdGF0ZS5wb3NpdGlvbiA9IGNhcHR1cmVFbmQ7XG4gICAgICAgIHN0YXRlLmxpbmUgPSBfbGluZTtcbiAgICAgICAgc3RhdGUubGluZVN0YXJ0ID0gX2xpbmVTdGFydDtcbiAgICAgICAgc3RhdGUubGluZUluZGVudCA9IF9saW5lSW5kZW50O1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoaGFzUGVuZGluZ0NvbnRlbnQpIHtcbiAgICAgIGNhcHR1cmVTZWdtZW50KHN0YXRlLCBjYXB0dXJlU3RhcnQsIGNhcHR1cmVFbmQsIGZhbHNlKTtcbiAgICAgIHdyaXRlRm9sZGVkTGluZXMoc3RhdGUsIHN0YXRlLmxpbmUgLSBfbGluZSk7XG4gICAgICBjYXB0dXJlU3RhcnQgPSBjYXB0dXJlRW5kID0gc3RhdGUucG9zaXRpb247XG4gICAgICBoYXNQZW5kaW5nQ29udGVudCA9IGZhbHNlO1xuICAgIH1cblxuICAgIGlmICghaXNfV0hJVEVfU1BBQ0UoY2gpKSB7XG4gICAgICBjYXB0dXJlRW5kID0gc3RhdGUucG9zaXRpb24gKyAxO1xuICAgIH1cblxuICAgIGNoID0gc3RhdGUuaW5wdXQuY2hhckNvZGVBdCgrK3N0YXRlLnBvc2l0aW9uKTtcbiAgfVxuXG4gIGNhcHR1cmVTZWdtZW50KHN0YXRlLCBjYXB0dXJlU3RhcnQsIGNhcHR1cmVFbmQsIGZhbHNlKTtcblxuICBpZiAoc3RhdGUucmVzdWx0KSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBzdGF0ZS5raW5kID0gX2tpbmQ7XG4gIHN0YXRlLnJlc3VsdCA9IF9yZXN1bHQ7XG4gIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gcmVhZFNpbmdsZVF1b3RlZFNjYWxhcihzdGF0ZSwgbm9kZUluZGVudCkge1xuICB2YXIgY2gsXG4gICAgICBjYXB0dXJlU3RhcnQsIGNhcHR1cmVFbmQ7XG5cbiAgY2ggPSBzdGF0ZS5pbnB1dC5jaGFyQ29kZUF0KHN0YXRlLnBvc2l0aW9uKTtcblxuICBpZiAoMHgyNy8qICcgKi8gIT09IGNoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgc3RhdGUua2luZCA9ICdzY2FsYXInO1xuICBzdGF0ZS5yZXN1bHQgPSAnJztcbiAgc3RhdGUucG9zaXRpb24rKztcbiAgY2FwdHVyZVN0YXJ0ID0gY2FwdHVyZUVuZCA9IHN0YXRlLnBvc2l0aW9uO1xuXG4gIHdoaWxlICgwICE9PSAoY2ggPSBzdGF0ZS5pbnB1dC5jaGFyQ29kZUF0KHN0YXRlLnBvc2l0aW9uKSkpIHtcbiAgICBpZiAoMHgyNy8qICcgKi8gPT09IGNoKSB7XG4gICAgICBjYXB0dXJlU2VnbWVudChzdGF0ZSwgY2FwdHVyZVN0YXJ0LCBzdGF0ZS5wb3NpdGlvbiwgdHJ1ZSk7XG4gICAgICBjaCA9IHN0YXRlLmlucHV0LmNoYXJDb2RlQXQoKytzdGF0ZS5wb3NpdGlvbik7XG5cbiAgICAgIGlmICgweDI3LyogJyAqLyA9PT0gY2gpIHtcbiAgICAgICAgY2FwdHVyZVN0YXJ0ID0gY2FwdHVyZUVuZCA9IHN0YXRlLnBvc2l0aW9uO1xuICAgICAgICBzdGF0ZS5wb3NpdGlvbisrO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG5cbiAgICB9IGVsc2UgaWYgKGlzX0VPTChjaCkpIHtcbiAgICAgIGNhcHR1cmVTZWdtZW50KHN0YXRlLCBjYXB0dXJlU3RhcnQsIGNhcHR1cmVFbmQsIHRydWUpO1xuICAgICAgd3JpdGVGb2xkZWRMaW5lcyhzdGF0ZSwgc2tpcFNlcGFyYXRpb25TcGFjZShzdGF0ZSwgZmFsc2UsIG5vZGVJbmRlbnQpKTtcbiAgICAgIGNhcHR1cmVTdGFydCA9IGNhcHR1cmVFbmQgPSBzdGF0ZS5wb3NpdGlvbjtcblxuICAgIH0gZWxzZSBpZiAoc3RhdGUucG9zaXRpb24gPT09IHN0YXRlLmxpbmVTdGFydCAmJiB0ZXN0RG9jdW1lbnRTZXBhcmF0b3Ioc3RhdGUpKSB7XG4gICAgICB0aHJvd0Vycm9yKHN0YXRlLCAndW5leHBlY3RlZCBlbmQgb2YgdGhlIGRvY3VtZW50IHdpdGhpbiBhIHNpbmdsZSBxdW90ZWQgc2NhbGFyJyk7XG5cbiAgICB9IGVsc2Uge1xuICAgICAgc3RhdGUucG9zaXRpb24rKztcbiAgICAgIGNhcHR1cmVFbmQgPSBzdGF0ZS5wb3NpdGlvbjtcbiAgICB9XG4gIH1cblxuICB0aHJvd0Vycm9yKHN0YXRlLCAndW5leHBlY3RlZCBlbmQgb2YgdGhlIHN0cmVhbSB3aXRoaW4gYSBzaW5nbGUgcXVvdGVkIHNjYWxhcicpO1xufVxuXG5mdW5jdGlvbiByZWFkRG91YmxlUXVvdGVkU2NhbGFyKHN0YXRlLCBub2RlSW5kZW50KSB7XG4gIHZhciBjYXB0dXJlU3RhcnQsXG4gICAgICBjYXB0dXJlRW5kLFxuICAgICAgaGV4TGVuZ3RoLFxuICAgICAgaGV4UmVzdWx0LFxuICAgICAgdG1wLFxuICAgICAgY2g7XG5cbiAgY2ggPSBzdGF0ZS5pbnB1dC5jaGFyQ29kZUF0KHN0YXRlLnBvc2l0aW9uKTtcblxuICBpZiAoMHgyMi8qIFwiICovICE9PSBjaCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHN0YXRlLmtpbmQgPSAnc2NhbGFyJztcbiAgc3RhdGUucmVzdWx0ID0gJyc7XG4gIHN0YXRlLnBvc2l0aW9uKys7XG4gIGNhcHR1cmVTdGFydCA9IGNhcHR1cmVFbmQgPSBzdGF0ZS5wb3NpdGlvbjtcblxuICB3aGlsZSAoMCAhPT0gKGNoID0gc3RhdGUuaW5wdXQuY2hhckNvZGVBdChzdGF0ZS5wb3NpdGlvbikpKSB7XG4gICAgaWYgKDB4MjIvKiBcIiAqLyA9PT0gY2gpIHtcbiAgICAgIGNhcHR1cmVTZWdtZW50KHN0YXRlLCBjYXB0dXJlU3RhcnQsIHN0YXRlLnBvc2l0aW9uLCB0cnVlKTtcbiAgICAgIHN0YXRlLnBvc2l0aW9uKys7XG4gICAgICByZXR1cm4gdHJ1ZTtcblxuICAgIH0gZWxzZSBpZiAoMHg1Qy8qIFxcICovID09PSBjaCkge1xuICAgICAgY2FwdHVyZVNlZ21lbnQoc3RhdGUsIGNhcHR1cmVTdGFydCwgc3RhdGUucG9zaXRpb24sIHRydWUpO1xuICAgICAgY2ggPSBzdGF0ZS5pbnB1dC5jaGFyQ29kZUF0KCsrc3RhdGUucG9zaXRpb24pO1xuXG4gICAgICBpZiAoaXNfRU9MKGNoKSkge1xuICAgICAgICBza2lwU2VwYXJhdGlvblNwYWNlKHN0YXRlLCBmYWxzZSwgbm9kZUluZGVudCk7XG5cbiAgICAgICAgLy8gVE9ETzogcmV3b3JrIHRvIGlubGluZSBmbiB3aXRoIG5vIHR5cGUgY2FzdD9cbiAgICAgIH0gZWxzZSBpZiAoY2ggPCAyNTYgJiYgc2ltcGxlRXNjYXBlQ2hlY2tbY2hdKSB7XG4gICAgICAgIHN0YXRlLnJlc3VsdCArPSBzaW1wbGVFc2NhcGVNYXBbY2hdO1xuICAgICAgICBzdGF0ZS5wb3NpdGlvbisrO1xuXG4gICAgICB9IGVsc2UgaWYgKCh0bXAgPSBlc2NhcGVkSGV4TGVuKGNoKSkgPiAwKSB7XG4gICAgICAgIGhleExlbmd0aCA9IHRtcDtcbiAgICAgICAgaGV4UmVzdWx0ID0gMDtcblxuICAgICAgICBmb3IgKDsgaGV4TGVuZ3RoID4gMDsgaGV4TGVuZ3RoLS0pIHtcbiAgICAgICAgICBjaCA9IHN0YXRlLmlucHV0LmNoYXJDb2RlQXQoKytzdGF0ZS5wb3NpdGlvbik7XG5cbiAgICAgICAgICBpZiAoKHRtcCA9IGZyb21IZXhDb2RlKGNoKSkgPj0gMCkge1xuICAgICAgICAgICAgaGV4UmVzdWx0ID0gKGhleFJlc3VsdCA8PCA0KSArIHRtcDtcblxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvd0Vycm9yKHN0YXRlLCAnZXhwZWN0ZWQgaGV4YWRlY2ltYWwgY2hhcmFjdGVyJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgc3RhdGUucmVzdWx0ICs9IGNoYXJGcm9tQ29kZXBvaW50KGhleFJlc3VsdCk7XG5cbiAgICAgICAgc3RhdGUucG9zaXRpb24rKztcblxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3dFcnJvcihzdGF0ZSwgJ3Vua25vd24gZXNjYXBlIHNlcXVlbmNlJyk7XG4gICAgICB9XG5cbiAgICAgIGNhcHR1cmVTdGFydCA9IGNhcHR1cmVFbmQgPSBzdGF0ZS5wb3NpdGlvbjtcblxuICAgIH0gZWxzZSBpZiAoaXNfRU9MKGNoKSkge1xuICAgICAgY2FwdHVyZVNlZ21lbnQoc3RhdGUsIGNhcHR1cmVTdGFydCwgY2FwdHVyZUVuZCwgdHJ1ZSk7XG4gICAgICB3cml0ZUZvbGRlZExpbmVzKHN0YXRlLCBza2lwU2VwYXJhdGlvblNwYWNlKHN0YXRlLCBmYWxzZSwgbm9kZUluZGVudCkpO1xuICAgICAgY2FwdHVyZVN0YXJ0ID0gY2FwdHVyZUVuZCA9IHN0YXRlLnBvc2l0aW9uO1xuXG4gICAgfSBlbHNlIGlmIChzdGF0ZS5wb3NpdGlvbiA9PT0gc3RhdGUubGluZVN0YXJ0ICYmIHRlc3REb2N1bWVudFNlcGFyYXRvcihzdGF0ZSkpIHtcbiAgICAgIHRocm93RXJyb3Ioc3RhdGUsICd1bmV4cGVjdGVkIGVuZCBvZiB0aGUgZG9jdW1lbnQgd2l0aGluIGEgZG91YmxlIHF1b3RlZCBzY2FsYXInKTtcblxuICAgIH0gZWxzZSB7XG4gICAgICBzdGF0ZS5wb3NpdGlvbisrO1xuICAgICAgY2FwdHVyZUVuZCA9IHN0YXRlLnBvc2l0aW9uO1xuICAgIH1cbiAgfVxuXG4gIHRocm93RXJyb3Ioc3RhdGUsICd1bmV4cGVjdGVkIGVuZCBvZiB0aGUgc3RyZWFtIHdpdGhpbiBhIGRvdWJsZSBxdW90ZWQgc2NhbGFyJyk7XG59XG5cbmZ1bmN0aW9uIHJlYWRGbG93Q29sbGVjdGlvbihzdGF0ZSwgbm9kZUluZGVudCkge1xuICB2YXIgcmVhZE5leHQgPSB0cnVlLFxuICAgICAgX2xpbmUsXG4gICAgICBfdGFnICAgICA9IHN0YXRlLnRhZyxcbiAgICAgIF9yZXN1bHQsXG4gICAgICBfYW5jaG9yICA9IHN0YXRlLmFuY2hvcixcbiAgICAgIGZvbGxvd2luZyxcbiAgICAgIHRlcm1pbmF0b3IsXG4gICAgICBpc1BhaXIsXG4gICAgICBpc0V4cGxpY2l0UGFpcixcbiAgICAgIGlzTWFwcGluZyxcbiAgICAgIGtleU5vZGUsXG4gICAgICBrZXlUYWcsXG4gICAgICB2YWx1ZU5vZGUsXG4gICAgICBjaDtcblxuICBjaCA9IHN0YXRlLmlucHV0LmNoYXJDb2RlQXQoc3RhdGUucG9zaXRpb24pO1xuXG4gIGlmIChjaCA9PT0gMHg1Qi8qIFsgKi8pIHtcbiAgICB0ZXJtaW5hdG9yID0gMHg1RDsvKiBdICovXG4gICAgaXNNYXBwaW5nID0gZmFsc2U7XG4gICAgX3Jlc3VsdCA9IFtdO1xuICB9IGVsc2UgaWYgKGNoID09PSAweDdCLyogeyAqLykge1xuICAgIHRlcm1pbmF0b3IgPSAweDdEOy8qIH0gKi9cbiAgICBpc01hcHBpbmcgPSB0cnVlO1xuICAgIF9yZXN1bHQgPSB7fTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAobnVsbCAhPT0gc3RhdGUuYW5jaG9yKSB7XG4gICAgc3RhdGUuYW5jaG9yTWFwW3N0YXRlLmFuY2hvcl0gPSBfcmVzdWx0O1xuICB9XG5cbiAgY2ggPSBzdGF0ZS5pbnB1dC5jaGFyQ29kZUF0KCsrc3RhdGUucG9zaXRpb24pO1xuXG4gIHdoaWxlICgwICE9PSBjaCkge1xuICAgIHNraXBTZXBhcmF0aW9uU3BhY2Uoc3RhdGUsIHRydWUsIG5vZGVJbmRlbnQpO1xuXG4gICAgY2ggPSBzdGF0ZS5pbnB1dC5jaGFyQ29kZUF0KHN0YXRlLnBvc2l0aW9uKTtcblxuICAgIGlmIChjaCA9PT0gdGVybWluYXRvcikge1xuICAgICAgc3RhdGUucG9zaXRpb24rKztcbiAgICAgIHN0YXRlLnRhZyA9IF90YWc7XG4gICAgICBzdGF0ZS5hbmNob3IgPSBfYW5jaG9yO1xuICAgICAgc3RhdGUua2luZCA9IGlzTWFwcGluZyA/ICdtYXBwaW5nJyA6ICdzZXF1ZW5jZSc7XG4gICAgICBzdGF0ZS5yZXN1bHQgPSBfcmVzdWx0O1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIGlmICghcmVhZE5leHQpIHtcbiAgICAgIHRocm93RXJyb3Ioc3RhdGUsICdtaXNzZWQgY29tbWEgYmV0d2VlbiBmbG93IGNvbGxlY3Rpb24gZW50cmllcycpO1xuICAgIH1cblxuICAgIGtleVRhZyA9IGtleU5vZGUgPSB2YWx1ZU5vZGUgPSBudWxsO1xuICAgIGlzUGFpciA9IGlzRXhwbGljaXRQYWlyID0gZmFsc2U7XG5cbiAgICBpZiAoMHgzRi8qID8gKi8gPT09IGNoKSB7XG4gICAgICBmb2xsb3dpbmcgPSBzdGF0ZS5pbnB1dC5jaGFyQ29kZUF0KHN0YXRlLnBvc2l0aW9uICsgMSk7XG5cbiAgICAgIGlmIChpc19XU19PUl9FT0woZm9sbG93aW5nKSkge1xuICAgICAgICBpc1BhaXIgPSBpc0V4cGxpY2l0UGFpciA9IHRydWU7XG4gICAgICAgIHN0YXRlLnBvc2l0aW9uKys7XG4gICAgICAgIHNraXBTZXBhcmF0aW9uU3BhY2Uoc3RhdGUsIHRydWUsIG5vZGVJbmRlbnQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIF9saW5lID0gc3RhdGUubGluZTtcbiAgICBjb21wb3NlTm9kZShzdGF0ZSwgbm9kZUluZGVudCwgQ09OVEVYVF9GTE9XX0lOLCBmYWxzZSwgdHJ1ZSk7XG4gICAga2V5VGFnID0gc3RhdGUudGFnO1xuICAgIGtleU5vZGUgPSBzdGF0ZS5yZXN1bHQ7XG4gICAgc2tpcFNlcGFyYXRpb25TcGFjZShzdGF0ZSwgdHJ1ZSwgbm9kZUluZGVudCk7XG5cbiAgICBjaCA9IHN0YXRlLmlucHV0LmNoYXJDb2RlQXQoc3RhdGUucG9zaXRpb24pO1xuXG4gICAgaWYgKChpc0V4cGxpY2l0UGFpciB8fCBzdGF0ZS5saW5lID09PSBfbGluZSkgJiYgMHgzQS8qIDogKi8gPT09IGNoKSB7XG4gICAgICBpc1BhaXIgPSB0cnVlO1xuICAgICAgY2ggPSBzdGF0ZS5pbnB1dC5jaGFyQ29kZUF0KCsrc3RhdGUucG9zaXRpb24pO1xuICAgICAgc2tpcFNlcGFyYXRpb25TcGFjZShzdGF0ZSwgdHJ1ZSwgbm9kZUluZGVudCk7XG4gICAgICBjb21wb3NlTm9kZShzdGF0ZSwgbm9kZUluZGVudCwgQ09OVEVYVF9GTE9XX0lOLCBmYWxzZSwgdHJ1ZSk7XG4gICAgICB2YWx1ZU5vZGUgPSBzdGF0ZS5yZXN1bHQ7XG4gICAgfVxuXG4gICAgaWYgKGlzTWFwcGluZykge1xuICAgICAgc3RvcmVNYXBwaW5nUGFpcihzdGF0ZSwgX3Jlc3VsdCwga2V5VGFnLCBrZXlOb2RlLCB2YWx1ZU5vZGUpO1xuICAgIH0gZWxzZSBpZiAoaXNQYWlyKSB7XG4gICAgICBfcmVzdWx0LnB1c2goc3RvcmVNYXBwaW5nUGFpcihzdGF0ZSwgbnVsbCwga2V5VGFnLCBrZXlOb2RlLCB2YWx1ZU5vZGUpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgX3Jlc3VsdC5wdXNoKGtleU5vZGUpO1xuICAgIH1cblxuICAgIHNraXBTZXBhcmF0aW9uU3BhY2Uoc3RhdGUsIHRydWUsIG5vZGVJbmRlbnQpO1xuXG4gICAgY2ggPSBzdGF0ZS5pbnB1dC5jaGFyQ29kZUF0KHN0YXRlLnBvc2l0aW9uKTtcblxuICAgIGlmICgweDJDLyogLCAqLyA9PT0gY2gpIHtcbiAgICAgIHJlYWROZXh0ID0gdHJ1ZTtcbiAgICAgIGNoID0gc3RhdGUuaW5wdXQuY2hhckNvZGVBdCgrK3N0YXRlLnBvc2l0aW9uKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVhZE5leHQgPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICB0aHJvd0Vycm9yKHN0YXRlLCAndW5leHBlY3RlZCBlbmQgb2YgdGhlIHN0cmVhbSB3aXRoaW4gYSBmbG93IGNvbGxlY3Rpb24nKTtcbn1cblxuZnVuY3Rpb24gcmVhZEJsb2NrU2NhbGFyKHN0YXRlLCBub2RlSW5kZW50KSB7XG4gIHZhciBjYXB0dXJlU3RhcnQsXG4gICAgICBmb2xkaW5nLFxuICAgICAgY2hvbXBpbmcgICAgICAgPSBDSE9NUElOR19DTElQLFxuICAgICAgZGV0ZWN0ZWRJbmRlbnQgPSBmYWxzZSxcbiAgICAgIHRleHRJbmRlbnQgICAgID0gbm9kZUluZGVudCxcbiAgICAgIGVtcHR5TGluZXMgICAgID0gMCxcbiAgICAgIGF0TW9yZUluZGVudGVkID0gZmFsc2UsXG4gICAgICB0bXAsXG4gICAgICBjaDtcblxuICBjaCA9IHN0YXRlLmlucHV0LmNoYXJDb2RlQXQoc3RhdGUucG9zaXRpb24pO1xuXG4gIGlmIChjaCA9PT0gMHg3Qy8qIHwgKi8pIHtcbiAgICBmb2xkaW5nID0gZmFsc2U7XG4gIH0gZWxzZSBpZiAoY2ggPT09IDB4M0UvKiA+ICovKSB7XG4gICAgZm9sZGluZyA9IHRydWU7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgc3RhdGUua2luZCA9ICdzY2FsYXInO1xuICBzdGF0ZS5yZXN1bHQgPSAnJztcblxuICB3aGlsZSAoMCAhPT0gY2gpIHtcbiAgICBjaCA9IHN0YXRlLmlucHV0LmNoYXJDb2RlQXQoKytzdGF0ZS5wb3NpdGlvbik7XG5cbiAgICBpZiAoMHgyQi8qICsgKi8gPT09IGNoIHx8IDB4MkQvKiAtICovID09PSBjaCkge1xuICAgICAgaWYgKENIT01QSU5HX0NMSVAgPT09IGNob21waW5nKSB7XG4gICAgICAgIGNob21waW5nID0gKDB4MkIvKiArICovID09PSBjaCkgPyBDSE9NUElOR19LRUVQIDogQ0hPTVBJTkdfU1RSSVA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvd0Vycm9yKHN0YXRlLCAncmVwZWF0IG9mIGEgY2hvbXBpbmcgbW9kZSBpZGVudGlmaWVyJyk7XG4gICAgICB9XG5cbiAgICB9IGVsc2UgaWYgKCh0bXAgPSBmcm9tRGVjaW1hbENvZGUoY2gpKSA+PSAwKSB7XG4gICAgICBpZiAodG1wID09PSAwKSB7XG4gICAgICAgIHRocm93RXJyb3Ioc3RhdGUsICdiYWQgZXhwbGljaXQgaW5kZW50YXRpb24gd2lkdGggb2YgYSBibG9jayBzY2FsYXI7IGl0IGNhbm5vdCBiZSBsZXNzIHRoYW4gb25lJyk7XG4gICAgICB9IGVsc2UgaWYgKCFkZXRlY3RlZEluZGVudCkge1xuICAgICAgICB0ZXh0SW5kZW50ID0gbm9kZUluZGVudCArIHRtcCAtIDE7XG4gICAgICAgIGRldGVjdGVkSW5kZW50ID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93RXJyb3Ioc3RhdGUsICdyZXBlYXQgb2YgYW4gaW5kZW50YXRpb24gd2lkdGggaWRlbnRpZmllcicpO1xuICAgICAgfVxuXG4gICAgfSBlbHNlIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIGlmIChpc19XSElURV9TUEFDRShjaCkpIHtcbiAgICBkbyB7IGNoID0gc3RhdGUuaW5wdXQuY2hhckNvZGVBdCgrK3N0YXRlLnBvc2l0aW9uKTsgfVxuICAgIHdoaWxlIChpc19XSElURV9TUEFDRShjaCkpO1xuXG4gICAgaWYgKDB4MjMvKiAjICovID09PSBjaCkge1xuICAgICAgZG8geyBjaCA9IHN0YXRlLmlucHV0LmNoYXJDb2RlQXQoKytzdGF0ZS5wb3NpdGlvbik7IH1cbiAgICAgIHdoaWxlICghaXNfRU9MKGNoKSAmJiAoMCAhPT0gY2gpKTtcbiAgICB9XG4gIH1cblxuICB3aGlsZSAoMCAhPT0gY2gpIHtcbiAgICByZWFkTGluZUJyZWFrKHN0YXRlKTtcbiAgICBzdGF0ZS5saW5lSW5kZW50ID0gMDtcblxuICAgIGNoID0gc3RhdGUuaW5wdXQuY2hhckNvZGVBdChzdGF0ZS5wb3NpdGlvbik7XG5cbiAgICB3aGlsZSAoKCFkZXRlY3RlZEluZGVudCB8fCBzdGF0ZS5saW5lSW5kZW50IDwgdGV4dEluZGVudCkgJiZcbiAgICAgICAgICAgKDB4MjAvKiBTcGFjZSAqLyA9PT0gY2gpKSB7XG4gICAgICBzdGF0ZS5saW5lSW5kZW50Kys7XG4gICAgICBjaCA9IHN0YXRlLmlucHV0LmNoYXJDb2RlQXQoKytzdGF0ZS5wb3NpdGlvbik7XG4gICAgfVxuXG4gICAgaWYgKCFkZXRlY3RlZEluZGVudCAmJiBzdGF0ZS5saW5lSW5kZW50ID4gdGV4dEluZGVudCkge1xuICAgICAgdGV4dEluZGVudCA9IHN0YXRlLmxpbmVJbmRlbnQ7XG4gICAgfVxuXG4gICAgaWYgKGlzX0VPTChjaCkpIHtcbiAgICAgIGVtcHR5TGluZXMrKztcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8vIEVuZCBvZiB0aGUgc2NhbGFyLlxuICAgIGlmIChzdGF0ZS5saW5lSW5kZW50IDwgdGV4dEluZGVudCkge1xuXG4gICAgICAvLyBQZXJmb3JtIHRoZSBjaG9tcGluZy5cbiAgICAgIGlmIChjaG9tcGluZyA9PT0gQ0hPTVBJTkdfS0VFUCkge1xuICAgICAgICBzdGF0ZS5yZXN1bHQgKz0gY29tbW9uLnJlcGVhdCgnXFxuJywgZW1wdHlMaW5lcyk7XG4gICAgICB9IGVsc2UgaWYgKGNob21waW5nID09PSBDSE9NUElOR19DTElQKSB7XG4gICAgICAgIGlmIChkZXRlY3RlZEluZGVudCkgeyAvLyBpLmUuIG9ubHkgaWYgdGhlIHNjYWxhciBpcyBub3QgZW1wdHkuXG4gICAgICAgICAgc3RhdGUucmVzdWx0ICs9ICdcXG4nO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIEJyZWFrIHRoaXMgYHdoaWxlYCBjeWNsZSBhbmQgZ28gdG8gdGhlIGZ1bmNpdG9uJ3MgZXBpbG9ndWUuXG4gICAgICBicmVhaztcbiAgICB9XG5cbiAgICAvLyBGb2xkZWQgc3R5bGU6IHVzZSBmYW5jeSBydWxlcyB0byBoYW5kbGUgbGluZSBicmVha3MuXG4gICAgaWYgKGZvbGRpbmcpIHtcblxuICAgICAgLy8gTGluZXMgc3RhcnRpbmcgd2l0aCB3aGl0ZSBzcGFjZSBjaGFyYWN0ZXJzIChtb3JlLWluZGVudGVkIGxpbmVzKSBhcmUgbm90IGZvbGRlZC5cbiAgICAgIGlmIChpc19XSElURV9TUEFDRShjaCkpIHtcbiAgICAgICAgYXRNb3JlSW5kZW50ZWQgPSB0cnVlO1xuICAgICAgICBzdGF0ZS5yZXN1bHQgKz0gY29tbW9uLnJlcGVhdCgnXFxuJywgZW1wdHlMaW5lcyArIDEpO1xuXG4gICAgICAvLyBFbmQgb2YgbW9yZS1pbmRlbnRlZCBibG9jay5cbiAgICAgIH0gZWxzZSBpZiAoYXRNb3JlSW5kZW50ZWQpIHtcbiAgICAgICAgYXRNb3JlSW5kZW50ZWQgPSBmYWxzZTtcbiAgICAgICAgc3RhdGUucmVzdWx0ICs9IGNvbW1vbi5yZXBlYXQoJ1xcbicsIGVtcHR5TGluZXMgKyAxKTtcblxuICAgICAgLy8gSnVzdCBvbmUgbGluZSBicmVhayAtIHBlcmNlaXZlIGFzIHRoZSBzYW1lIGxpbmUuXG4gICAgICB9IGVsc2UgaWYgKDAgPT09IGVtcHR5TGluZXMpIHtcbiAgICAgICAgaWYgKGRldGVjdGVkSW5kZW50KSB7IC8vIGkuZS4gb25seSBpZiB3ZSBoYXZlIGFscmVhZHkgcmVhZCBzb21lIHNjYWxhciBjb250ZW50LlxuICAgICAgICAgIHN0YXRlLnJlc3VsdCArPSAnICc7XG4gICAgICAgIH1cblxuICAgICAgLy8gU2V2ZXJhbCBsaW5lIGJyZWFrcyAtIHBlcmNlaXZlIGFzIGRpZmZlcmVudCBsaW5lcy5cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN0YXRlLnJlc3VsdCArPSBjb21tb24ucmVwZWF0KCdcXG4nLCBlbXB0eUxpbmVzKTtcbiAgICAgIH1cblxuICAgIC8vIExpdGVyYWwgc3R5bGU6IGp1c3QgYWRkIGV4YWN0IG51bWJlciBvZiBsaW5lIGJyZWFrcyBiZXR3ZWVuIGNvbnRlbnQgbGluZXMuXG4gICAgfSBlbHNlIGlmIChkZXRlY3RlZEluZGVudCkge1xuICAgICAgLy8gSWYgY3VycmVudCBsaW5lIGlzbid0IHRoZSBmaXJzdCBvbmUgLSBjb3VudCBsaW5lIGJyZWFrIGZyb20gdGhlIGxhc3QgY29udGVudCBsaW5lLlxuICAgICAgc3RhdGUucmVzdWx0ICs9IGNvbW1vbi5yZXBlYXQoJ1xcbicsIGVtcHR5TGluZXMgKyAxKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gSW4gY2FzZSBvZiB0aGUgZmlyc3QgY29udGVudCBsaW5lIC0gY291bnQgb25seSBlbXB0eSBsaW5lcy5cbiAgICAgIHN0YXRlLnJlc3VsdCArPSBjb21tb24ucmVwZWF0KCdcXG4nLCBlbXB0eUxpbmVzKTtcbiAgICB9XG5cbiAgICBkZXRlY3RlZEluZGVudCA9IHRydWU7XG4gICAgZW1wdHlMaW5lcyA9IDA7XG4gICAgY2FwdHVyZVN0YXJ0ID0gc3RhdGUucG9zaXRpb247XG5cbiAgICB3aGlsZSAoIWlzX0VPTChjaCkgJiYgKDAgIT09IGNoKSkge1xuICAgICAgY2ggPSBzdGF0ZS5pbnB1dC5jaGFyQ29kZUF0KCsrc3RhdGUucG9zaXRpb24pO1xuICAgIH1cblxuICAgIGNhcHR1cmVTZWdtZW50KHN0YXRlLCBjYXB0dXJlU3RhcnQsIHN0YXRlLnBvc2l0aW9uLCBmYWxzZSk7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gcmVhZEJsb2NrU2VxdWVuY2Uoc3RhdGUsIG5vZGVJbmRlbnQpIHtcbiAgdmFyIF9saW5lLFxuICAgICAgX3RhZyAgICAgID0gc3RhdGUudGFnLFxuICAgICAgX2FuY2hvciAgID0gc3RhdGUuYW5jaG9yLFxuICAgICAgX3Jlc3VsdCAgID0gW10sXG4gICAgICBmb2xsb3dpbmcsXG4gICAgICBkZXRlY3RlZCAgPSBmYWxzZSxcbiAgICAgIGNoO1xuXG4gIGlmIChudWxsICE9PSBzdGF0ZS5hbmNob3IpIHtcbiAgICBzdGF0ZS5hbmNob3JNYXBbc3RhdGUuYW5jaG9yXSA9IF9yZXN1bHQ7XG4gIH1cblxuICBjaCA9IHN0YXRlLmlucHV0LmNoYXJDb2RlQXQoc3RhdGUucG9zaXRpb24pO1xuXG4gIHdoaWxlICgwICE9PSBjaCkge1xuXG4gICAgaWYgKDB4MkQvKiAtICovICE9PSBjaCkge1xuICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgZm9sbG93aW5nID0gc3RhdGUuaW5wdXQuY2hhckNvZGVBdChzdGF0ZS5wb3NpdGlvbiArIDEpO1xuXG4gICAgaWYgKCFpc19XU19PUl9FT0woZm9sbG93aW5nKSkge1xuICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgZGV0ZWN0ZWQgPSB0cnVlO1xuICAgIHN0YXRlLnBvc2l0aW9uKys7XG5cbiAgICBpZiAoc2tpcFNlcGFyYXRpb25TcGFjZShzdGF0ZSwgdHJ1ZSwgLTEpKSB7XG4gICAgICBpZiAoc3RhdGUubGluZUluZGVudCA8PSBub2RlSW5kZW50KSB7XG4gICAgICAgIF9yZXN1bHQucHVzaChudWxsKTtcbiAgICAgICAgY2ggPSBzdGF0ZS5pbnB1dC5jaGFyQ29kZUF0KHN0YXRlLnBvc2l0aW9uKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgX2xpbmUgPSBzdGF0ZS5saW5lO1xuICAgIGNvbXBvc2VOb2RlKHN0YXRlLCBub2RlSW5kZW50LCBDT05URVhUX0JMT0NLX0lOLCBmYWxzZSwgdHJ1ZSk7XG4gICAgX3Jlc3VsdC5wdXNoKHN0YXRlLnJlc3VsdCk7XG4gICAgc2tpcFNlcGFyYXRpb25TcGFjZShzdGF0ZSwgdHJ1ZSwgLTEpO1xuXG4gICAgY2ggPSBzdGF0ZS5pbnB1dC5jaGFyQ29kZUF0KHN0YXRlLnBvc2l0aW9uKTtcblxuICAgIGlmICgoc3RhdGUubGluZSA9PT0gX2xpbmUgfHwgc3RhdGUubGluZUluZGVudCA+IG5vZGVJbmRlbnQpICYmICgwICE9PSBjaCkpIHtcbiAgICAgIHRocm93RXJyb3Ioc3RhdGUsICdiYWQgaW5kZW50YXRpb24gb2YgYSBzZXF1ZW5jZSBlbnRyeScpO1xuICAgIH0gZWxzZSBpZiAoc3RhdGUubGluZUluZGVudCA8IG5vZGVJbmRlbnQpIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIGlmIChkZXRlY3RlZCkge1xuICAgIHN0YXRlLnRhZyA9IF90YWc7XG4gICAgc3RhdGUuYW5jaG9yID0gX2FuY2hvcjtcbiAgICBzdGF0ZS5raW5kID0gJ3NlcXVlbmNlJztcbiAgICBzdGF0ZS5yZXN1bHQgPSBfcmVzdWx0O1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gcmVhZEJsb2NrTWFwcGluZyhzdGF0ZSwgbm9kZUluZGVudCwgZmxvd0luZGVudCkge1xuICB2YXIgZm9sbG93aW5nLFxuICAgICAgYWxsb3dDb21wYWN0LFxuICAgICAgX2xpbmUsXG4gICAgICBfdGFnICAgICAgICAgID0gc3RhdGUudGFnLFxuICAgICAgX2FuY2hvciAgICAgICA9IHN0YXRlLmFuY2hvcixcbiAgICAgIF9yZXN1bHQgICAgICAgPSB7fSxcbiAgICAgIGtleVRhZyAgICAgICAgPSBudWxsLFxuICAgICAga2V5Tm9kZSAgICAgICA9IG51bGwsXG4gICAgICB2YWx1ZU5vZGUgICAgID0gbnVsbCxcbiAgICAgIGF0RXhwbGljaXRLZXkgPSBmYWxzZSxcbiAgICAgIGRldGVjdGVkICAgICAgPSBmYWxzZSxcbiAgICAgIGNoO1xuXG4gIGlmIChudWxsICE9PSBzdGF0ZS5hbmNob3IpIHtcbiAgICBzdGF0ZS5hbmNob3JNYXBbc3RhdGUuYW5jaG9yXSA9IF9yZXN1bHQ7XG4gIH1cblxuICBjaCA9IHN0YXRlLmlucHV0LmNoYXJDb2RlQXQoc3RhdGUucG9zaXRpb24pO1xuXG4gIHdoaWxlICgwICE9PSBjaCkge1xuICAgIGZvbGxvd2luZyA9IHN0YXRlLmlucHV0LmNoYXJDb2RlQXQoc3RhdGUucG9zaXRpb24gKyAxKTtcbiAgICBfbGluZSA9IHN0YXRlLmxpbmU7IC8vIFNhdmUgdGhlIGN1cnJlbnQgbGluZS5cblxuICAgIC8vXG4gICAgLy8gRXhwbGljaXQgbm90YXRpb24gY2FzZS4gVGhlcmUgYXJlIHR3byBzZXBhcmF0ZSBibG9ja3M6XG4gICAgLy8gZmlyc3QgZm9yIHRoZSBrZXkgKGRlbm90ZWQgYnkgXCI/XCIpIGFuZCBzZWNvbmQgZm9yIHRoZSB2YWx1ZSAoZGVub3RlZCBieSBcIjpcIilcbiAgICAvL1xuICAgIGlmICgoMHgzRi8qID8gKi8gPT09IGNoIHx8IDB4M0EvKiA6ICovICA9PT0gY2gpICYmIGlzX1dTX09SX0VPTChmb2xsb3dpbmcpKSB7XG5cbiAgICAgIGlmICgweDNGLyogPyAqLyA9PT0gY2gpIHtcbiAgICAgICAgaWYgKGF0RXhwbGljaXRLZXkpIHtcbiAgICAgICAgICBzdG9yZU1hcHBpbmdQYWlyKHN0YXRlLCBfcmVzdWx0LCBrZXlUYWcsIGtleU5vZGUsIG51bGwpO1xuICAgICAgICAgIGtleVRhZyA9IGtleU5vZGUgPSB2YWx1ZU5vZGUgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgZGV0ZWN0ZWQgPSB0cnVlO1xuICAgICAgICBhdEV4cGxpY2l0S2V5ID0gdHJ1ZTtcbiAgICAgICAgYWxsb3dDb21wYWN0ID0gdHJ1ZTtcblxuICAgICAgfSBlbHNlIGlmIChhdEV4cGxpY2l0S2V5KSB7XG4gICAgICAgIC8vIGkuZS4gMHgzQS8qIDogKi8gPT09IGNoYXJhY3RlciBhZnRlciB0aGUgZXhwbGljaXQga2V5LlxuICAgICAgICBhdEV4cGxpY2l0S2V5ID0gZmFsc2U7XG4gICAgICAgIGFsbG93Q29tcGFjdCA9IHRydWU7XG5cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93RXJyb3Ioc3RhdGUsICdpbmNvbXBsZXRlIGV4cGxpY2l0IG1hcHBpbmcgcGFpcjsgYSBrZXkgbm9kZSBpcyBtaXNzZWQnKTtcbiAgICAgIH1cblxuICAgICAgc3RhdGUucG9zaXRpb24gKz0gMTtcbiAgICAgIGNoID0gZm9sbG93aW5nO1xuXG4gICAgLy9cbiAgICAvLyBJbXBsaWNpdCBub3RhdGlvbiBjYXNlLiBGbG93LXN0eWxlIG5vZGUgYXMgdGhlIGtleSBmaXJzdCwgdGhlbiBcIjpcIiwgYW5kIHRoZSB2YWx1ZS5cbiAgICAvL1xuICAgIH0gZWxzZSBpZiAoY29tcG9zZU5vZGUoc3RhdGUsIGZsb3dJbmRlbnQsIENPTlRFWFRfRkxPV19PVVQsIGZhbHNlLCB0cnVlKSkge1xuXG4gICAgICBpZiAoc3RhdGUubGluZSA9PT0gX2xpbmUpIHtcbiAgICAgICAgY2ggPSBzdGF0ZS5pbnB1dC5jaGFyQ29kZUF0KHN0YXRlLnBvc2l0aW9uKTtcblxuICAgICAgICB3aGlsZSAoaXNfV0hJVEVfU1BBQ0UoY2gpKSB7XG4gICAgICAgICAgY2ggPSBzdGF0ZS5pbnB1dC5jaGFyQ29kZUF0KCsrc3RhdGUucG9zaXRpb24pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKDB4M0EvKiA6ICovID09PSBjaCkge1xuICAgICAgICAgIGNoID0gc3RhdGUuaW5wdXQuY2hhckNvZGVBdCgrK3N0YXRlLnBvc2l0aW9uKTtcblxuICAgICAgICAgIGlmICghaXNfV1NfT1JfRU9MKGNoKSkge1xuICAgICAgICAgICAgdGhyb3dFcnJvcihzdGF0ZSwgJ2Egd2hpdGVzcGFjZSBjaGFyYWN0ZXIgaXMgZXhwZWN0ZWQgYWZ0ZXIgdGhlIGtleS12YWx1ZSBzZXBhcmF0b3Igd2l0aGluIGEgYmxvY2sgbWFwcGluZycpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChhdEV4cGxpY2l0S2V5KSB7XG4gICAgICAgICAgICBzdG9yZU1hcHBpbmdQYWlyKHN0YXRlLCBfcmVzdWx0LCBrZXlUYWcsIGtleU5vZGUsIG51bGwpO1xuICAgICAgICAgICAga2V5VGFnID0ga2V5Tm9kZSA9IHZhbHVlTm9kZSA9IG51bGw7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgZGV0ZWN0ZWQgPSB0cnVlO1xuICAgICAgICAgIGF0RXhwbGljaXRLZXkgPSBmYWxzZTtcbiAgICAgICAgICBhbGxvd0NvbXBhY3QgPSBmYWxzZTtcbiAgICAgICAgICBrZXlUYWcgPSBzdGF0ZS50YWc7XG4gICAgICAgICAga2V5Tm9kZSA9IHN0YXRlLnJlc3VsdDtcblxuICAgICAgICB9IGVsc2UgaWYgKGRldGVjdGVkKSB7XG4gICAgICAgICAgdGhyb3dFcnJvcihzdGF0ZSwgJ2NhbiBub3QgcmVhZCBhbiBpbXBsaWNpdCBtYXBwaW5nIHBhaXI7IGEgY29sb24gaXMgbWlzc2VkJyk7XG5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzdGF0ZS50YWcgPSBfdGFnO1xuICAgICAgICAgIHN0YXRlLmFuY2hvciA9IF9hbmNob3I7XG4gICAgICAgICAgcmV0dXJuIHRydWU7IC8vIEtlZXAgdGhlIHJlc3VsdCBvZiBgY29tcG9zZU5vZGVgLlxuICAgICAgICB9XG5cbiAgICAgIH0gZWxzZSBpZiAoZGV0ZWN0ZWQpIHtcbiAgICAgICAgdGhyb3dFcnJvcihzdGF0ZSwgJ2NhbiBub3QgcmVhZCBhIGJsb2NrIG1hcHBpbmcgZW50cnk7IGEgbXVsdGlsaW5lIGtleSBtYXkgbm90IGJlIGFuIGltcGxpY2l0IGtleScpO1xuXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdGF0ZS50YWcgPSBfdGFnO1xuICAgICAgICBzdGF0ZS5hbmNob3IgPSBfYW5jaG9yO1xuICAgICAgICByZXR1cm4gdHJ1ZTsgLy8gS2VlcCB0aGUgcmVzdWx0IG9mIGBjb21wb3NlTm9kZWAuXG4gICAgICB9XG5cbiAgICB9IGVsc2Uge1xuICAgICAgYnJlYWs7IC8vIFJlYWRpbmcgaXMgZG9uZS4gR28gdG8gdGhlIGVwaWxvZ3VlLlxuICAgIH1cblxuICAgIC8vXG4gICAgLy8gQ29tbW9uIHJlYWRpbmcgY29kZSBmb3IgYm90aCBleHBsaWNpdCBhbmQgaW1wbGljaXQgbm90YXRpb25zLlxuICAgIC8vXG4gICAgaWYgKHN0YXRlLmxpbmUgPT09IF9saW5lIHx8IHN0YXRlLmxpbmVJbmRlbnQgPiBub2RlSW5kZW50KSB7XG4gICAgICBpZiAoY29tcG9zZU5vZGUoc3RhdGUsIG5vZGVJbmRlbnQsIENPTlRFWFRfQkxPQ0tfT1VULCB0cnVlLCBhbGxvd0NvbXBhY3QpKSB7XG4gICAgICAgIGlmIChhdEV4cGxpY2l0S2V5KSB7XG4gICAgICAgICAga2V5Tm9kZSA9IHN0YXRlLnJlc3VsdDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YWx1ZU5vZGUgPSBzdGF0ZS5yZXN1bHQ7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKCFhdEV4cGxpY2l0S2V5KSB7XG4gICAgICAgIHN0b3JlTWFwcGluZ1BhaXIoc3RhdGUsIF9yZXN1bHQsIGtleVRhZywga2V5Tm9kZSwgdmFsdWVOb2RlKTtcbiAgICAgICAga2V5VGFnID0ga2V5Tm9kZSA9IHZhbHVlTm9kZSA9IG51bGw7XG4gICAgICB9XG5cbiAgICAgIHNraXBTZXBhcmF0aW9uU3BhY2Uoc3RhdGUsIHRydWUsIC0xKTtcbiAgICAgIGNoID0gc3RhdGUuaW5wdXQuY2hhckNvZGVBdChzdGF0ZS5wb3NpdGlvbik7XG4gICAgfVxuXG4gICAgaWYgKHN0YXRlLmxpbmVJbmRlbnQgPiBub2RlSW5kZW50ICYmICgwICE9PSBjaCkpIHtcbiAgICAgIHRocm93RXJyb3Ioc3RhdGUsICdiYWQgaW5kZW50YXRpb24gb2YgYSBtYXBwaW5nIGVudHJ5Jyk7XG4gICAgfSBlbHNlIGlmIChzdGF0ZS5saW5lSW5kZW50IDwgbm9kZUluZGVudCkge1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgLy9cbiAgLy8gRXBpbG9ndWUuXG4gIC8vXG5cbiAgLy8gU3BlY2lhbCBjYXNlOiBsYXN0IG1hcHBpbmcncyBub2RlIGNvbnRhaW5zIG9ubHkgdGhlIGtleSBpbiBleHBsaWNpdCBub3RhdGlvbi5cbiAgaWYgKGF0RXhwbGljaXRLZXkpIHtcbiAgICBzdG9yZU1hcHBpbmdQYWlyKHN0YXRlLCBfcmVzdWx0LCBrZXlUYWcsIGtleU5vZGUsIG51bGwpO1xuICB9XG5cbiAgLy8gRXhwb3NlIHRoZSByZXN1bHRpbmcgbWFwcGluZy5cbiAgaWYgKGRldGVjdGVkKSB7XG4gICAgc3RhdGUudGFnID0gX3RhZztcbiAgICBzdGF0ZS5hbmNob3IgPSBfYW5jaG9yO1xuICAgIHN0YXRlLmtpbmQgPSAnbWFwcGluZyc7XG4gICAgc3RhdGUucmVzdWx0ID0gX3Jlc3VsdDtcbiAgfVxuXG4gIHJldHVybiBkZXRlY3RlZDtcbn1cblxuZnVuY3Rpb24gcmVhZFRhZ1Byb3BlcnR5KHN0YXRlKSB7XG4gIHZhciBfcG9zaXRpb24sXG4gICAgICBpc1ZlcmJhdGltID0gZmFsc2UsXG4gICAgICBpc05hbWVkICAgID0gZmFsc2UsXG4gICAgICB0YWdIYW5kbGUsXG4gICAgICB0YWdOYW1lLFxuICAgICAgY2g7XG5cbiAgY2ggPSBzdGF0ZS5pbnB1dC5jaGFyQ29kZUF0KHN0YXRlLnBvc2l0aW9uKTtcblxuICBpZiAoMHgyMS8qICEgKi8gIT09IGNoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKG51bGwgIT09IHN0YXRlLnRhZykge1xuICAgIHRocm93RXJyb3Ioc3RhdGUsICdkdXBsaWNhdGlvbiBvZiBhIHRhZyBwcm9wZXJ0eScpO1xuICB9XG5cbiAgY2ggPSBzdGF0ZS5pbnB1dC5jaGFyQ29kZUF0KCsrc3RhdGUucG9zaXRpb24pO1xuXG4gIGlmICgweDNDLyogPCAqLyA9PT0gY2gpIHtcbiAgICBpc1ZlcmJhdGltID0gdHJ1ZTtcbiAgICBjaCA9IHN0YXRlLmlucHV0LmNoYXJDb2RlQXQoKytzdGF0ZS5wb3NpdGlvbik7XG5cbiAgfSBlbHNlIGlmICgweDIxLyogISAqLyA9PT0gY2gpIHtcbiAgICBpc05hbWVkID0gdHJ1ZTtcbiAgICB0YWdIYW5kbGUgPSAnISEnO1xuICAgIGNoID0gc3RhdGUuaW5wdXQuY2hhckNvZGVBdCgrK3N0YXRlLnBvc2l0aW9uKTtcblxuICB9IGVsc2Uge1xuICAgIHRhZ0hhbmRsZSA9ICchJztcbiAgfVxuXG4gIF9wb3NpdGlvbiA9IHN0YXRlLnBvc2l0aW9uO1xuXG4gIGlmIChpc1ZlcmJhdGltKSB7XG4gICAgZG8geyBjaCA9IHN0YXRlLmlucHV0LmNoYXJDb2RlQXQoKytzdGF0ZS5wb3NpdGlvbik7IH1cbiAgICB3aGlsZSAoMCAhPT0gY2ggJiYgMHgzRS8qID4gKi8gIT09IGNoKTtcblxuICAgIGlmIChzdGF0ZS5wb3NpdGlvbiA8IHN0YXRlLmxlbmd0aCkge1xuICAgICAgdGFnTmFtZSA9IHN0YXRlLmlucHV0LnNsaWNlKF9wb3NpdGlvbiwgc3RhdGUucG9zaXRpb24pO1xuICAgICAgY2ggPSBzdGF0ZS5pbnB1dC5jaGFyQ29kZUF0KCsrc3RhdGUucG9zaXRpb24pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvd0Vycm9yKHN0YXRlLCAndW5leHBlY3RlZCBlbmQgb2YgdGhlIHN0cmVhbSB3aXRoaW4gYSB2ZXJiYXRpbSB0YWcnKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgd2hpbGUgKDAgIT09IGNoICYmICFpc19XU19PUl9FT0woY2gpKSB7XG5cbiAgICAgIGlmICgweDIxLyogISAqLyA9PT0gY2gpIHtcbiAgICAgICAgaWYgKCFpc05hbWVkKSB7XG4gICAgICAgICAgdGFnSGFuZGxlID0gc3RhdGUuaW5wdXQuc2xpY2UoX3Bvc2l0aW9uIC0gMSwgc3RhdGUucG9zaXRpb24gKyAxKTtcblxuICAgICAgICAgIGlmICghUEFUVEVSTl9UQUdfSEFORExFLnRlc3QodGFnSGFuZGxlKSkge1xuICAgICAgICAgICAgdGhyb3dFcnJvcihzdGF0ZSwgJ25hbWVkIHRhZyBoYW5kbGUgY2Fubm90IGNvbnRhaW4gc3VjaCBjaGFyYWN0ZXJzJyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaXNOYW1lZCA9IHRydWU7XG4gICAgICAgICAgX3Bvc2l0aW9uID0gc3RhdGUucG9zaXRpb24gKyAxO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRocm93RXJyb3Ioc3RhdGUsICd0YWcgc3VmZml4IGNhbm5vdCBjb250YWluIGV4Y2xhbWF0aW9uIG1hcmtzJyk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY2ggPSBzdGF0ZS5pbnB1dC5jaGFyQ29kZUF0KCsrc3RhdGUucG9zaXRpb24pO1xuICAgIH1cblxuICAgIHRhZ05hbWUgPSBzdGF0ZS5pbnB1dC5zbGljZShfcG9zaXRpb24sIHN0YXRlLnBvc2l0aW9uKTtcblxuICAgIGlmIChQQVRURVJOX0ZMT1dfSU5ESUNBVE9SUy50ZXN0KHRhZ05hbWUpKSB7XG4gICAgICB0aHJvd0Vycm9yKHN0YXRlLCAndGFnIHN1ZmZpeCBjYW5ub3QgY29udGFpbiBmbG93IGluZGljYXRvciBjaGFyYWN0ZXJzJyk7XG4gICAgfVxuICB9XG5cbiAgaWYgKHRhZ05hbWUgJiYgIVBBVFRFUk5fVEFHX1VSSS50ZXN0KHRhZ05hbWUpKSB7XG4gICAgdGhyb3dFcnJvcihzdGF0ZSwgJ3RhZyBuYW1lIGNhbm5vdCBjb250YWluIHN1Y2ggY2hhcmFjdGVyczogJyArIHRhZ05hbWUpO1xuICB9XG5cbiAgaWYgKGlzVmVyYmF0aW0pIHtcbiAgICBzdGF0ZS50YWcgPSB0YWdOYW1lO1xuXG4gIH0gZWxzZSBpZiAoX2hhc093blByb3BlcnR5LmNhbGwoc3RhdGUudGFnTWFwLCB0YWdIYW5kbGUpKSB7XG4gICAgc3RhdGUudGFnID0gc3RhdGUudGFnTWFwW3RhZ0hhbmRsZV0gKyB0YWdOYW1lO1xuXG4gIH0gZWxzZSBpZiAoJyEnID09PSB0YWdIYW5kbGUpIHtcbiAgICBzdGF0ZS50YWcgPSAnIScgKyB0YWdOYW1lO1xuXG4gIH0gZWxzZSBpZiAoJyEhJyA9PT0gdGFnSGFuZGxlKSB7XG4gICAgc3RhdGUudGFnID0gJ3RhZzp5YW1sLm9yZywyMDAyOicgKyB0YWdOYW1lO1xuXG4gIH0gZWxzZSB7XG4gICAgdGhyb3dFcnJvcihzdGF0ZSwgJ3VuZGVjbGFyZWQgdGFnIGhhbmRsZSBcIicgKyB0YWdIYW5kbGUgKyAnXCInKTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufVxuXG5mdW5jdGlvbiByZWFkQW5jaG9yUHJvcGVydHkoc3RhdGUpIHtcbiAgdmFyIF9wb3NpdGlvbixcbiAgICAgIGNoO1xuXG4gIGNoID0gc3RhdGUuaW5wdXQuY2hhckNvZGVBdChzdGF0ZS5wb3NpdGlvbik7XG5cbiAgaWYgKDB4MjYvKiAmICovICE9PSBjaCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmIChudWxsICE9PSBzdGF0ZS5hbmNob3IpIHtcbiAgICB0aHJvd0Vycm9yKHN0YXRlLCAnZHVwbGljYXRpb24gb2YgYW4gYW5jaG9yIHByb3BlcnR5Jyk7XG4gIH1cblxuICBjaCA9IHN0YXRlLmlucHV0LmNoYXJDb2RlQXQoKytzdGF0ZS5wb3NpdGlvbik7XG4gIF9wb3NpdGlvbiA9IHN0YXRlLnBvc2l0aW9uO1xuXG4gIHdoaWxlICgwICE9PSBjaCAmJiAhaXNfV1NfT1JfRU9MKGNoKSAmJiAhaXNfRkxPV19JTkRJQ0FUT1IoY2gpKSB7XG4gICAgY2ggPSBzdGF0ZS5pbnB1dC5jaGFyQ29kZUF0KCsrc3RhdGUucG9zaXRpb24pO1xuICB9XG5cbiAgaWYgKHN0YXRlLnBvc2l0aW9uID09PSBfcG9zaXRpb24pIHtcbiAgICB0aHJvd0Vycm9yKHN0YXRlLCAnbmFtZSBvZiBhbiBhbmNob3Igbm9kZSBtdXN0IGNvbnRhaW4gYXQgbGVhc3Qgb25lIGNoYXJhY3RlcicpO1xuICB9XG5cbiAgc3RhdGUuYW5jaG9yID0gc3RhdGUuaW5wdXQuc2xpY2UoX3Bvc2l0aW9uLCBzdGF0ZS5wb3NpdGlvbik7XG4gIHJldHVybiB0cnVlO1xufVxuXG5mdW5jdGlvbiByZWFkQWxpYXMoc3RhdGUpIHtcbiAgdmFyIF9wb3NpdGlvbiwgYWxpYXMsXG4gICAgICBjaDtcblxuICBjaCA9IHN0YXRlLmlucHV0LmNoYXJDb2RlQXQoc3RhdGUucG9zaXRpb24pO1xuXG4gIGlmICgweDJBLyogKiAqLyAhPT0gY2gpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBjaCA9IHN0YXRlLmlucHV0LmNoYXJDb2RlQXQoKytzdGF0ZS5wb3NpdGlvbik7XG4gIF9wb3NpdGlvbiA9IHN0YXRlLnBvc2l0aW9uO1xuXG4gIHdoaWxlICgwICE9PSBjaCAmJiAhaXNfV1NfT1JfRU9MKGNoKSAmJiAhaXNfRkxPV19JTkRJQ0FUT1IoY2gpKSB7XG4gICAgY2ggPSBzdGF0ZS5pbnB1dC5jaGFyQ29kZUF0KCsrc3RhdGUucG9zaXRpb24pO1xuICB9XG5cbiAgaWYgKHN0YXRlLnBvc2l0aW9uID09PSBfcG9zaXRpb24pIHtcbiAgICB0aHJvd0Vycm9yKHN0YXRlLCAnbmFtZSBvZiBhbiBhbGlhcyBub2RlIG11c3QgY29udGFpbiBhdCBsZWFzdCBvbmUgY2hhcmFjdGVyJyk7XG4gIH1cblxuICBhbGlhcyA9IHN0YXRlLmlucHV0LnNsaWNlKF9wb3NpdGlvbiwgc3RhdGUucG9zaXRpb24pO1xuXG4gIGlmICghc3RhdGUuYW5jaG9yTWFwLmhhc093blByb3BlcnR5KGFsaWFzKSkge1xuICAgIHRocm93RXJyb3Ioc3RhdGUsICd1bmlkZW50aWZpZWQgYWxpYXMgXCInICsgYWxpYXMgKyAnXCInKTtcbiAgfVxuXG4gIHN0YXRlLnJlc3VsdCA9IHN0YXRlLmFuY2hvck1hcFthbGlhc107XG4gIHNraXBTZXBhcmF0aW9uU3BhY2Uoc3RhdGUsIHRydWUsIC0xKTtcbiAgcmV0dXJuIHRydWU7XG59XG5cbmZ1bmN0aW9uIGNvbXBvc2VOb2RlKHN0YXRlLCBwYXJlbnRJbmRlbnQsIG5vZGVDb250ZXh0LCBhbGxvd1RvU2VlaywgYWxsb3dDb21wYWN0KSB7XG4gIHZhciBhbGxvd0Jsb2NrU3R5bGVzLFxuICAgICAgYWxsb3dCbG9ja1NjYWxhcnMsXG4gICAgICBhbGxvd0Jsb2NrQ29sbGVjdGlvbnMsXG4gICAgICBpbmRlbnRTdGF0dXMgPSAxLCAvLyAxOiB0aGlzPnBhcmVudCwgMDogdGhpcz1wYXJlbnQsIC0xOiB0aGlzPHBhcmVudFxuICAgICAgYXROZXdMaW5lICA9IGZhbHNlLFxuICAgICAgaGFzQ29udGVudCA9IGZhbHNlLFxuICAgICAgdHlwZUluZGV4LFxuICAgICAgdHlwZVF1YW50aXR5LFxuICAgICAgdHlwZSxcbiAgICAgIGZsb3dJbmRlbnQsXG4gICAgICBibG9ja0luZGVudDtcblxuICBzdGF0ZS50YWcgICAgPSBudWxsO1xuICBzdGF0ZS5hbmNob3IgPSBudWxsO1xuICBzdGF0ZS5raW5kICAgPSBudWxsO1xuICBzdGF0ZS5yZXN1bHQgPSBudWxsO1xuXG4gIGFsbG93QmxvY2tTdHlsZXMgPSBhbGxvd0Jsb2NrU2NhbGFycyA9IGFsbG93QmxvY2tDb2xsZWN0aW9ucyA9XG4gICAgQ09OVEVYVF9CTE9DS19PVVQgPT09IG5vZGVDb250ZXh0IHx8XG4gICAgQ09OVEVYVF9CTE9DS19JTiAgPT09IG5vZGVDb250ZXh0O1xuXG4gIGlmIChhbGxvd1RvU2Vlaykge1xuICAgIGlmIChza2lwU2VwYXJhdGlvblNwYWNlKHN0YXRlLCB0cnVlLCAtMSkpIHtcbiAgICAgIGF0TmV3TGluZSA9IHRydWU7XG5cbiAgICAgIGlmIChzdGF0ZS5saW5lSW5kZW50ID4gcGFyZW50SW5kZW50KSB7XG4gICAgICAgIGluZGVudFN0YXR1cyA9IDE7XG4gICAgICB9IGVsc2UgaWYgKHN0YXRlLmxpbmVJbmRlbnQgPT09IHBhcmVudEluZGVudCkge1xuICAgICAgICBpbmRlbnRTdGF0dXMgPSAwO1xuICAgICAgfSBlbHNlIGlmIChzdGF0ZS5saW5lSW5kZW50IDwgcGFyZW50SW5kZW50KSB7XG4gICAgICAgIGluZGVudFN0YXR1cyA9IC0xO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGlmICgxID09PSBpbmRlbnRTdGF0dXMpIHtcbiAgICB3aGlsZSAocmVhZFRhZ1Byb3BlcnR5KHN0YXRlKSB8fCByZWFkQW5jaG9yUHJvcGVydHkoc3RhdGUpKSB7XG4gICAgICBpZiAoc2tpcFNlcGFyYXRpb25TcGFjZShzdGF0ZSwgdHJ1ZSwgLTEpKSB7XG4gICAgICAgIGF0TmV3TGluZSA9IHRydWU7XG4gICAgICAgIGFsbG93QmxvY2tDb2xsZWN0aW9ucyA9IGFsbG93QmxvY2tTdHlsZXM7XG5cbiAgICAgICAgaWYgKHN0YXRlLmxpbmVJbmRlbnQgPiBwYXJlbnRJbmRlbnQpIHtcbiAgICAgICAgICBpbmRlbnRTdGF0dXMgPSAxO1xuICAgICAgICB9IGVsc2UgaWYgKHN0YXRlLmxpbmVJbmRlbnQgPT09IHBhcmVudEluZGVudCkge1xuICAgICAgICAgIGluZGVudFN0YXR1cyA9IDA7XG4gICAgICAgIH0gZWxzZSBpZiAoc3RhdGUubGluZUluZGVudCA8IHBhcmVudEluZGVudCkge1xuICAgICAgICAgIGluZGVudFN0YXR1cyA9IC0xO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhbGxvd0Jsb2NrQ29sbGVjdGlvbnMgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBpZiAoYWxsb3dCbG9ja0NvbGxlY3Rpb25zKSB7XG4gICAgYWxsb3dCbG9ja0NvbGxlY3Rpb25zID0gYXROZXdMaW5lIHx8IGFsbG93Q29tcGFjdDtcbiAgfVxuXG4gIGlmICgxID09PSBpbmRlbnRTdGF0dXMgfHwgQ09OVEVYVF9CTE9DS19PVVQgPT09IG5vZGVDb250ZXh0KSB7XG4gICAgaWYgKENPTlRFWFRfRkxPV19JTiA9PT0gbm9kZUNvbnRleHQgfHwgQ09OVEVYVF9GTE9XX09VVCA9PT0gbm9kZUNvbnRleHQpIHtcbiAgICAgIGZsb3dJbmRlbnQgPSBwYXJlbnRJbmRlbnQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZsb3dJbmRlbnQgPSBwYXJlbnRJbmRlbnQgKyAxO1xuICAgIH1cblxuICAgIGJsb2NrSW5kZW50ID0gc3RhdGUucG9zaXRpb24gLSBzdGF0ZS5saW5lU3RhcnQ7XG5cbiAgICBpZiAoMSA9PT0gaW5kZW50U3RhdHVzKSB7XG4gICAgICBpZiAoYWxsb3dCbG9ja0NvbGxlY3Rpb25zICYmXG4gICAgICAgICAgKHJlYWRCbG9ja1NlcXVlbmNlKHN0YXRlLCBibG9ja0luZGVudCkgfHxcbiAgICAgICAgICAgcmVhZEJsb2NrTWFwcGluZyhzdGF0ZSwgYmxvY2tJbmRlbnQsIGZsb3dJbmRlbnQpKSB8fFxuICAgICAgICAgIHJlYWRGbG93Q29sbGVjdGlvbihzdGF0ZSwgZmxvd0luZGVudCkpIHtcbiAgICAgICAgaGFzQ29udGVudCA9IHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoKGFsbG93QmxvY2tTY2FsYXJzICYmIHJlYWRCbG9ja1NjYWxhcihzdGF0ZSwgZmxvd0luZGVudCkpIHx8XG4gICAgICAgICAgICByZWFkU2luZ2xlUXVvdGVkU2NhbGFyKHN0YXRlLCBmbG93SW5kZW50KSB8fFxuICAgICAgICAgICAgcmVhZERvdWJsZVF1b3RlZFNjYWxhcihzdGF0ZSwgZmxvd0luZGVudCkpIHtcbiAgICAgICAgICBoYXNDb250ZW50ID0gdHJ1ZTtcblxuICAgICAgICB9IGVsc2UgaWYgKHJlYWRBbGlhcyhzdGF0ZSkpIHtcbiAgICAgICAgICBoYXNDb250ZW50ID0gdHJ1ZTtcblxuICAgICAgICAgIGlmIChudWxsICE9PSBzdGF0ZS50YWcgfHwgbnVsbCAhPT0gc3RhdGUuYW5jaG9yKSB7XG4gICAgICAgICAgICB0aHJvd0Vycm9yKHN0YXRlLCAnYWxpYXMgbm9kZSBzaG91bGQgbm90IGhhdmUgYW55IHByb3BlcnRpZXMnKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgfSBlbHNlIGlmIChyZWFkUGxhaW5TY2FsYXIoc3RhdGUsIGZsb3dJbmRlbnQsIENPTlRFWFRfRkxPV19JTiA9PT0gbm9kZUNvbnRleHQpKSB7XG4gICAgICAgICAgaGFzQ29udGVudCA9IHRydWU7XG5cbiAgICAgICAgICBpZiAobnVsbCA9PT0gc3RhdGUudGFnKSB7XG4gICAgICAgICAgICBzdGF0ZS50YWcgPSAnPyc7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG51bGwgIT09IHN0YXRlLmFuY2hvcikge1xuICAgICAgICAgIHN0YXRlLmFuY2hvck1hcFtzdGF0ZS5hbmNob3JdID0gc3RhdGUucmVzdWx0O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICgwID09PSBpbmRlbnRTdGF0dXMpIHtcbiAgICAgIC8vIFNwZWNpYWwgY2FzZTogYmxvY2sgc2VxdWVuY2VzIGFyZSBhbGxvd2VkIHRvIGhhdmUgc2FtZSBpbmRlbnRhdGlvbiBsZXZlbCBhcyB0aGUgcGFyZW50LlxuICAgICAgLy8gaHR0cDovL3d3dy55YW1sLm9yZy9zcGVjLzEuMi9zcGVjLmh0bWwjaWQyNzk5Nzg0XG4gICAgICBoYXNDb250ZW50ID0gYWxsb3dCbG9ja0NvbGxlY3Rpb25zICYmIHJlYWRCbG9ja1NlcXVlbmNlKHN0YXRlLCBibG9ja0luZGVudCk7XG4gICAgfVxuICB9XG5cbiAgaWYgKG51bGwgIT09IHN0YXRlLnRhZyAmJiAnIScgIT09IHN0YXRlLnRhZykge1xuICAgIGlmICgnPycgPT09IHN0YXRlLnRhZykge1xuICAgICAgZm9yICh0eXBlSW5kZXggPSAwLCB0eXBlUXVhbnRpdHkgPSBzdGF0ZS5pbXBsaWNpdFR5cGVzLmxlbmd0aDtcbiAgICAgICAgICAgdHlwZUluZGV4IDwgdHlwZVF1YW50aXR5O1xuICAgICAgICAgICB0eXBlSW5kZXggKz0gMSkge1xuICAgICAgICB0eXBlID0gc3RhdGUuaW1wbGljaXRUeXBlc1t0eXBlSW5kZXhdO1xuXG4gICAgICAgIC8vIEltcGxpY2l0IHJlc29sdmluZyBpcyBub3QgYWxsb3dlZCBmb3Igbm9uLXNjYWxhciB0eXBlcywgYW5kICc/J1xuICAgICAgICAvLyBub24tc3BlY2lmaWMgdGFnIGlzIG9ubHkgYXNzaWduZWQgdG8gcGxhaW4gc2NhbGFycy4gU28sIGl0IGlzbid0XG4gICAgICAgIC8vIG5lZWRlZCB0byBjaGVjayBmb3IgJ2tpbmQnIGNvbmZvcm1pdHkuXG5cbiAgICAgICAgaWYgKHR5cGUucmVzb2x2ZShzdGF0ZS5yZXN1bHQpKSB7IC8vIGBzdGF0ZS5yZXN1bHRgIHVwZGF0ZWQgaW4gcmVzb2x2ZXIgaWYgbWF0Y2hlZFxuICAgICAgICAgIHN0YXRlLnJlc3VsdCA9IHR5cGUuY29uc3RydWN0KHN0YXRlLnJlc3VsdCk7XG4gICAgICAgICAgc3RhdGUudGFnID0gdHlwZS50YWc7XG4gICAgICAgICAgaWYgKG51bGwgIT09IHN0YXRlLmFuY2hvcikge1xuICAgICAgICAgICAgc3RhdGUuYW5jaG9yTWFwW3N0YXRlLmFuY2hvcl0gPSBzdGF0ZS5yZXN1bHQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChfaGFzT3duUHJvcGVydHkuY2FsbChzdGF0ZS50eXBlTWFwLCBzdGF0ZS50YWcpKSB7XG4gICAgICB0eXBlID0gc3RhdGUudHlwZU1hcFtzdGF0ZS50YWddO1xuXG4gICAgICBpZiAobnVsbCAhPT0gc3RhdGUucmVzdWx0ICYmIHR5cGUua2luZCAhPT0gc3RhdGUua2luZCkge1xuICAgICAgICB0aHJvd0Vycm9yKHN0YXRlLCAndW5hY2NlcHRhYmxlIG5vZGUga2luZCBmb3IgITwnICsgc3RhdGUudGFnICsgJz4gdGFnOyBpdCBzaG91bGQgYmUgXCInICsgdHlwZS5raW5kICsgJ1wiLCBub3QgXCInICsgc3RhdGUua2luZCArICdcIicpO1xuICAgICAgfVxuXG4gICAgICBpZiAoIXR5cGUucmVzb2x2ZShzdGF0ZS5yZXN1bHQpKSB7IC8vIGBzdGF0ZS5yZXN1bHRgIHVwZGF0ZWQgaW4gcmVzb2x2ZXIgaWYgbWF0Y2hlZFxuICAgICAgICB0aHJvd0Vycm9yKHN0YXRlLCAnY2Fubm90IHJlc29sdmUgYSBub2RlIHdpdGggITwnICsgc3RhdGUudGFnICsgJz4gZXhwbGljaXQgdGFnJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdGF0ZS5yZXN1bHQgPSB0eXBlLmNvbnN0cnVjdChzdGF0ZS5yZXN1bHQpO1xuICAgICAgICBpZiAobnVsbCAhPT0gc3RhdGUuYW5jaG9yKSB7XG4gICAgICAgICAgc3RhdGUuYW5jaG9yTWFwW3N0YXRlLmFuY2hvcl0gPSBzdGF0ZS5yZXN1bHQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3dFcnJvcihzdGF0ZSwgJ3Vua25vd24gdGFnICE8JyArIHN0YXRlLnRhZyArICc+Jyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG51bGwgIT09IHN0YXRlLnRhZyB8fCBudWxsICE9PSBzdGF0ZS5hbmNob3IgfHwgaGFzQ29udGVudDtcbn1cblxuZnVuY3Rpb24gcmVhZERvY3VtZW50KHN0YXRlKSB7XG4gIHZhciBkb2N1bWVudFN0YXJ0ID0gc3RhdGUucG9zaXRpb24sXG4gICAgICBfcG9zaXRpb24sXG4gICAgICBkaXJlY3RpdmVOYW1lLFxuICAgICAgZGlyZWN0aXZlQXJncyxcbiAgICAgIGhhc0RpcmVjdGl2ZXMgPSBmYWxzZSxcbiAgICAgIGNoO1xuXG4gIHN0YXRlLnZlcnNpb24gPSBudWxsO1xuICBzdGF0ZS5jaGVja0xpbmVCcmVha3MgPSBzdGF0ZS5sZWdhY3k7XG4gIHN0YXRlLnRhZ01hcCA9IHt9O1xuICBzdGF0ZS5hbmNob3JNYXAgPSB7fTtcblxuICB3aGlsZSAoMCAhPT0gKGNoID0gc3RhdGUuaW5wdXQuY2hhckNvZGVBdChzdGF0ZS5wb3NpdGlvbikpKSB7XG4gICAgc2tpcFNlcGFyYXRpb25TcGFjZShzdGF0ZSwgdHJ1ZSwgLTEpO1xuXG4gICAgY2ggPSBzdGF0ZS5pbnB1dC5jaGFyQ29kZUF0KHN0YXRlLnBvc2l0aW9uKTtcblxuICAgIGlmIChzdGF0ZS5saW5lSW5kZW50ID4gMCB8fCAweDI1LyogJSAqLyAhPT0gY2gpIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIGhhc0RpcmVjdGl2ZXMgPSB0cnVlO1xuICAgIGNoID0gc3RhdGUuaW5wdXQuY2hhckNvZGVBdCgrK3N0YXRlLnBvc2l0aW9uKTtcbiAgICBfcG9zaXRpb24gPSBzdGF0ZS5wb3NpdGlvbjtcblxuICAgIHdoaWxlICgwICE9PSBjaCAmJiAhaXNfV1NfT1JfRU9MKGNoKSkge1xuICAgICAgY2ggPSBzdGF0ZS5pbnB1dC5jaGFyQ29kZUF0KCsrc3RhdGUucG9zaXRpb24pO1xuICAgIH1cblxuICAgIGRpcmVjdGl2ZU5hbWUgPSBzdGF0ZS5pbnB1dC5zbGljZShfcG9zaXRpb24sIHN0YXRlLnBvc2l0aW9uKTtcbiAgICBkaXJlY3RpdmVBcmdzID0gW107XG5cbiAgICBpZiAoZGlyZWN0aXZlTmFtZS5sZW5ndGggPCAxKSB7XG4gICAgICB0aHJvd0Vycm9yKHN0YXRlLCAnZGlyZWN0aXZlIG5hbWUgbXVzdCBub3QgYmUgbGVzcyB0aGFuIG9uZSBjaGFyYWN0ZXIgaW4gbGVuZ3RoJyk7XG4gICAgfVxuXG4gICAgd2hpbGUgKDAgIT09IGNoKSB7XG4gICAgICB3aGlsZSAoaXNfV0hJVEVfU1BBQ0UoY2gpKSB7XG4gICAgICAgIGNoID0gc3RhdGUuaW5wdXQuY2hhckNvZGVBdCgrK3N0YXRlLnBvc2l0aW9uKTtcbiAgICAgIH1cblxuICAgICAgaWYgKDB4MjMvKiAjICovID09PSBjaCkge1xuICAgICAgICBkbyB7IGNoID0gc3RhdGUuaW5wdXQuY2hhckNvZGVBdCgrK3N0YXRlLnBvc2l0aW9uKTsgfVxuICAgICAgICB3aGlsZSAoMCAhPT0gY2ggJiYgIWlzX0VPTChjaCkpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgaWYgKGlzX0VPTChjaCkpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgIF9wb3NpdGlvbiA9IHN0YXRlLnBvc2l0aW9uO1xuXG4gICAgICB3aGlsZSAoMCAhPT0gY2ggJiYgIWlzX1dTX09SX0VPTChjaCkpIHtcbiAgICAgICAgY2ggPSBzdGF0ZS5pbnB1dC5jaGFyQ29kZUF0KCsrc3RhdGUucG9zaXRpb24pO1xuICAgICAgfVxuXG4gICAgICBkaXJlY3RpdmVBcmdzLnB1c2goc3RhdGUuaW5wdXQuc2xpY2UoX3Bvc2l0aW9uLCBzdGF0ZS5wb3NpdGlvbikpO1xuICAgIH1cblxuICAgIGlmICgwICE9PSBjaCkge1xuICAgICAgcmVhZExpbmVCcmVhayhzdGF0ZSk7XG4gICAgfVxuXG4gICAgaWYgKF9oYXNPd25Qcm9wZXJ0eS5jYWxsKGRpcmVjdGl2ZUhhbmRsZXJzLCBkaXJlY3RpdmVOYW1lKSkge1xuICAgICAgZGlyZWN0aXZlSGFuZGxlcnNbZGlyZWN0aXZlTmFtZV0oc3RhdGUsIGRpcmVjdGl2ZU5hbWUsIGRpcmVjdGl2ZUFyZ3MpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvd1dhcm5pbmcoc3RhdGUsICd1bmtub3duIGRvY3VtZW50IGRpcmVjdGl2ZSBcIicgKyBkaXJlY3RpdmVOYW1lICsgJ1wiJyk7XG4gICAgfVxuICB9XG5cbiAgc2tpcFNlcGFyYXRpb25TcGFjZShzdGF0ZSwgdHJ1ZSwgLTEpO1xuXG4gIGlmICgwID09PSBzdGF0ZS5saW5lSW5kZW50ICYmXG4gICAgICAweDJELyogLSAqLyA9PT0gc3RhdGUuaW5wdXQuY2hhckNvZGVBdChzdGF0ZS5wb3NpdGlvbikgJiZcbiAgICAgIDB4MkQvKiAtICovID09PSBzdGF0ZS5pbnB1dC5jaGFyQ29kZUF0KHN0YXRlLnBvc2l0aW9uICsgMSkgJiZcbiAgICAgIDB4MkQvKiAtICovID09PSBzdGF0ZS5pbnB1dC5jaGFyQ29kZUF0KHN0YXRlLnBvc2l0aW9uICsgMikpIHtcbiAgICBzdGF0ZS5wb3NpdGlvbiArPSAzO1xuICAgIHNraXBTZXBhcmF0aW9uU3BhY2Uoc3RhdGUsIHRydWUsIC0xKTtcblxuICB9IGVsc2UgaWYgKGhhc0RpcmVjdGl2ZXMpIHtcbiAgICB0aHJvd0Vycm9yKHN0YXRlLCAnZGlyZWN0aXZlcyBlbmQgbWFyayBpcyBleHBlY3RlZCcpO1xuICB9XG5cbiAgY29tcG9zZU5vZGUoc3RhdGUsIHN0YXRlLmxpbmVJbmRlbnQgLSAxLCBDT05URVhUX0JMT0NLX09VVCwgZmFsc2UsIHRydWUpO1xuICBza2lwU2VwYXJhdGlvblNwYWNlKHN0YXRlLCB0cnVlLCAtMSk7XG5cbiAgaWYgKHN0YXRlLmNoZWNrTGluZUJyZWFrcyAmJlxuICAgICAgUEFUVEVSTl9OT05fQVNDSUlfTElORV9CUkVBS1MudGVzdChzdGF0ZS5pbnB1dC5zbGljZShkb2N1bWVudFN0YXJ0LCBzdGF0ZS5wb3NpdGlvbikpKSB7XG4gICAgdGhyb3dXYXJuaW5nKHN0YXRlLCAnbm9uLUFTQ0lJIGxpbmUgYnJlYWtzIGFyZSBpbnRlcnByZXRlZCBhcyBjb250ZW50Jyk7XG4gIH1cblxuICBzdGF0ZS5kb2N1bWVudHMucHVzaChzdGF0ZS5yZXN1bHQpO1xuXG4gIGlmIChzdGF0ZS5wb3NpdGlvbiA9PT0gc3RhdGUubGluZVN0YXJ0ICYmIHRlc3REb2N1bWVudFNlcGFyYXRvcihzdGF0ZSkpIHtcblxuICAgIGlmICgweDJFLyogLiAqLyA9PT0gc3RhdGUuaW5wdXQuY2hhckNvZGVBdChzdGF0ZS5wb3NpdGlvbikpIHtcbiAgICAgIHN0YXRlLnBvc2l0aW9uICs9IDM7XG4gICAgICBza2lwU2VwYXJhdGlvblNwYWNlKHN0YXRlLCB0cnVlLCAtMSk7XG4gICAgfVxuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmIChzdGF0ZS5wb3NpdGlvbiA8IChzdGF0ZS5sZW5ndGggLSAxKSkge1xuICAgIHRocm93RXJyb3Ioc3RhdGUsICdlbmQgb2YgdGhlIHN0cmVhbSBvciBhIGRvY3VtZW50IHNlcGFyYXRvciBpcyBleHBlY3RlZCcpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybjtcbiAgfVxufVxuXG5cbmZ1bmN0aW9uIGxvYWREb2N1bWVudHMoaW5wdXQsIG9wdGlvbnMpIHtcbiAgaW5wdXQgPSBTdHJpbmcoaW5wdXQpO1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICBpZiAoaW5wdXQubGVuZ3RoICE9PSAwKSB7XG5cbiAgICAvLyBBZGQgdGFpbGluZyBgXFxuYCBpZiBub3QgZXhpc3RzXG4gICAgaWYgKDB4MEEvKiBMRiAqLyAhPT0gaW5wdXQuY2hhckNvZGVBdChpbnB1dC5sZW5ndGggLSAxKSAmJlxuICAgICAgICAweDBELyogQ1IgKi8gIT09IGlucHV0LmNoYXJDb2RlQXQoaW5wdXQubGVuZ3RoIC0gMSkpIHtcbiAgICAgIGlucHV0ICs9ICdcXG4nO1xuICAgIH1cblxuICAgIC8vIFN0cmlwIEJPTVxuICAgIGlmIChpbnB1dC5jaGFyQ29kZUF0KDApID09PSAweEZFRkYpIHtcbiAgICAgIGlucHV0ID0gaW5wdXQuc2xpY2UoMSk7XG4gICAgfVxuICB9XG5cbiAgdmFyIHN0YXRlID0gbmV3IFN0YXRlKGlucHV0LCBvcHRpb25zKTtcblxuICBpZiAoUEFUVEVSTl9OT05fUFJJTlRBQkxFLnRlc3Qoc3RhdGUuaW5wdXQpKSB7XG4gICAgdGhyb3dFcnJvcihzdGF0ZSwgJ3RoZSBzdHJlYW0gY29udGFpbnMgbm9uLXByaW50YWJsZSBjaGFyYWN0ZXJzJyk7XG4gIH1cblxuICAvLyBVc2UgMCBhcyBzdHJpbmcgdGVybWluYXRvci4gVGhhdCBzaWduaWZpY2FudGx5IHNpbXBsaWZpZXMgYm91bmRzIGNoZWNrLlxuICBzdGF0ZS5pbnB1dCArPSAnXFwwJztcblxuICB3aGlsZSAoMHgyMC8qIFNwYWNlICovID09PSBzdGF0ZS5pbnB1dC5jaGFyQ29kZUF0KHN0YXRlLnBvc2l0aW9uKSkge1xuICAgIHN0YXRlLmxpbmVJbmRlbnQgKz0gMTtcbiAgICBzdGF0ZS5wb3NpdGlvbiArPSAxO1xuICB9XG5cbiAgd2hpbGUgKHN0YXRlLnBvc2l0aW9uIDwgKHN0YXRlLmxlbmd0aCAtIDEpKSB7XG4gICAgcmVhZERvY3VtZW50KHN0YXRlKTtcbiAgfVxuXG4gIHJldHVybiBzdGF0ZS5kb2N1bWVudHM7XG59XG5cblxuZnVuY3Rpb24gbG9hZEFsbChpbnB1dCwgaXRlcmF0b3IsIG9wdGlvbnMpIHtcbiAgdmFyIGRvY3VtZW50cyA9IGxvYWREb2N1bWVudHMoaW5wdXQsIG9wdGlvbnMpLCBpbmRleCwgbGVuZ3RoO1xuXG4gIGZvciAoaW5kZXggPSAwLCBsZW5ndGggPSBkb2N1bWVudHMubGVuZ3RoOyBpbmRleCA8IGxlbmd0aDsgaW5kZXggKz0gMSkge1xuICAgIGl0ZXJhdG9yKGRvY3VtZW50c1tpbmRleF0pO1xuICB9XG59XG5cblxuZnVuY3Rpb24gbG9hZChpbnB1dCwgb3B0aW9ucykge1xuICB2YXIgZG9jdW1lbnRzID0gbG9hZERvY3VtZW50cyhpbnB1dCwgb3B0aW9ucyk7XG5cbiAgaWYgKDAgPT09IGRvY3VtZW50cy5sZW5ndGgpIHtcbiAgICAvKmVzbGludC1kaXNhYmxlIG5vLXVuZGVmaW5lZCovXG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfSBlbHNlIGlmICgxID09PSBkb2N1bWVudHMubGVuZ3RoKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50c1swXTtcbiAgfVxuICB0aHJvdyBuZXcgWUFNTEV4Y2VwdGlvbignZXhwZWN0ZWQgYSBzaW5nbGUgZG9jdW1lbnQgaW4gdGhlIHN0cmVhbSwgYnV0IGZvdW5kIG1vcmUnKTtcbn1cblxuXG5mdW5jdGlvbiBzYWZlTG9hZEFsbChpbnB1dCwgb3V0cHV0LCBvcHRpb25zKSB7XG4gIGxvYWRBbGwoaW5wdXQsIG91dHB1dCwgY29tbW9uLmV4dGVuZCh7IHNjaGVtYTogREVGQVVMVF9TQUZFX1NDSEVNQSB9LCBvcHRpb25zKSk7XG59XG5cblxuZnVuY3Rpb24gc2FmZUxvYWQoaW5wdXQsIG9wdGlvbnMpIHtcbiAgcmV0dXJuIGxvYWQoaW5wdXQsIGNvbW1vbi5leHRlbmQoeyBzY2hlbWE6IERFRkFVTFRfU0FGRV9TQ0hFTUEgfSwgb3B0aW9ucykpO1xufVxuXG5cbm1vZHVsZS5leHBvcnRzLmxvYWRBbGwgICAgID0gbG9hZEFsbDtcbm1vZHVsZS5leHBvcnRzLmxvYWQgICAgICAgID0gbG9hZDtcbm1vZHVsZS5leHBvcnRzLnNhZmVMb2FkQWxsID0gc2FmZUxvYWRBbGw7XG5tb2R1bGUuZXhwb3J0cy5zYWZlTG9hZCAgICA9IHNhZmVMb2FkO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbnZhciBjb21tb24gPSByZXF1aXJlKCcuL2NvbW1vbicpO1xuXG5cbmZ1bmN0aW9uIE1hcmsobmFtZSwgYnVmZmVyLCBwb3NpdGlvbiwgbGluZSwgY29sdW1uKSB7XG4gIHRoaXMubmFtZSAgICAgPSBuYW1lO1xuICB0aGlzLmJ1ZmZlciAgID0gYnVmZmVyO1xuICB0aGlzLnBvc2l0aW9uID0gcG9zaXRpb247XG4gIHRoaXMubGluZSAgICAgPSBsaW5lO1xuICB0aGlzLmNvbHVtbiAgID0gY29sdW1uO1xufVxuXG5cbk1hcmsucHJvdG90eXBlLmdldFNuaXBwZXQgPSBmdW5jdGlvbiBnZXRTbmlwcGV0KGluZGVudCwgbWF4TGVuZ3RoKSB7XG4gIHZhciBoZWFkLCBzdGFydCwgdGFpbCwgZW5kLCBzbmlwcGV0O1xuXG4gIGlmICghdGhpcy5idWZmZXIpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGluZGVudCA9IGluZGVudCB8fCA0O1xuICBtYXhMZW5ndGggPSBtYXhMZW5ndGggfHwgNzU7XG5cbiAgaGVhZCA9ICcnO1xuICBzdGFydCA9IHRoaXMucG9zaXRpb247XG5cbiAgd2hpbGUgKHN0YXJ0ID4gMCAmJiAtMSA9PT0gJ1xceDAwXFxyXFxuXFx4ODVcXHUyMDI4XFx1MjAyOScuaW5kZXhPZih0aGlzLmJ1ZmZlci5jaGFyQXQoc3RhcnQgLSAxKSkpIHtcbiAgICBzdGFydCAtPSAxO1xuICAgIGlmICh0aGlzLnBvc2l0aW9uIC0gc3RhcnQgPiAobWF4TGVuZ3RoIC8gMiAtIDEpKSB7XG4gICAgICBoZWFkID0gJyAuLi4gJztcbiAgICAgIHN0YXJ0ICs9IDU7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICB0YWlsID0gJyc7XG4gIGVuZCA9IHRoaXMucG9zaXRpb247XG5cbiAgd2hpbGUgKGVuZCA8IHRoaXMuYnVmZmVyLmxlbmd0aCAmJiAtMSA9PT0gJ1xceDAwXFxyXFxuXFx4ODVcXHUyMDI4XFx1MjAyOScuaW5kZXhPZih0aGlzLmJ1ZmZlci5jaGFyQXQoZW5kKSkpIHtcbiAgICBlbmQgKz0gMTtcbiAgICBpZiAoZW5kIC0gdGhpcy5wb3NpdGlvbiA+IChtYXhMZW5ndGggLyAyIC0gMSkpIHtcbiAgICAgIHRhaWwgPSAnIC4uLiAnO1xuICAgICAgZW5kIC09IDU7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBzbmlwcGV0ID0gdGhpcy5idWZmZXIuc2xpY2Uoc3RhcnQsIGVuZCk7XG5cbiAgcmV0dXJuIGNvbW1vbi5yZXBlYXQoJyAnLCBpbmRlbnQpICsgaGVhZCArIHNuaXBwZXQgKyB0YWlsICsgJ1xcbicgK1xuICAgICAgICAgY29tbW9uLnJlcGVhdCgnICcsIGluZGVudCArIHRoaXMucG9zaXRpb24gLSBzdGFydCArIGhlYWQubGVuZ3RoKSArICdeJztcbn07XG5cblxuTWFyay5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZyhjb21wYWN0KSB7XG4gIHZhciBzbmlwcGV0LCB3aGVyZSA9ICcnO1xuXG4gIGlmICh0aGlzLm5hbWUpIHtcbiAgICB3aGVyZSArPSAnaW4gXCInICsgdGhpcy5uYW1lICsgJ1wiICc7XG4gIH1cblxuICB3aGVyZSArPSAnYXQgbGluZSAnICsgKHRoaXMubGluZSArIDEpICsgJywgY29sdW1uICcgKyAodGhpcy5jb2x1bW4gKyAxKTtcblxuICBpZiAoIWNvbXBhY3QpIHtcbiAgICBzbmlwcGV0ID0gdGhpcy5nZXRTbmlwcGV0KCk7XG5cbiAgICBpZiAoc25pcHBldCkge1xuICAgICAgd2hlcmUgKz0gJzpcXG4nICsgc25pcHBldDtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gd2hlcmU7XG59O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gTWFyaztcbiIsIid1c2Ugc3RyaWN0JztcblxuLyplc2xpbnQtZGlzYWJsZSBtYXgtbGVuKi9cblxudmFyIGNvbW1vbiAgICAgICAgPSByZXF1aXJlKCcuL2NvbW1vbicpO1xudmFyIFlBTUxFeGNlcHRpb24gPSByZXF1aXJlKCcuL2V4Y2VwdGlvbicpO1xudmFyIFR5cGUgICAgICAgICAgPSByZXF1aXJlKCcuL3R5cGUnKTtcblxuXG5mdW5jdGlvbiBjb21waWxlTGlzdChzY2hlbWEsIG5hbWUsIHJlc3VsdCkge1xuICB2YXIgZXhjbHVkZSA9IFtdO1xuXG4gIHNjaGVtYS5pbmNsdWRlLmZvckVhY2goZnVuY3Rpb24gKGluY2x1ZGVkU2NoZW1hKSB7XG4gICAgcmVzdWx0ID0gY29tcGlsZUxpc3QoaW5jbHVkZWRTY2hlbWEsIG5hbWUsIHJlc3VsdCk7XG4gIH0pO1xuXG4gIHNjaGVtYVtuYW1lXS5mb3JFYWNoKGZ1bmN0aW9uIChjdXJyZW50VHlwZSkge1xuICAgIHJlc3VsdC5mb3JFYWNoKGZ1bmN0aW9uIChwcmV2aW91c1R5cGUsIHByZXZpb3VzSW5kZXgpIHtcbiAgICAgIGlmIChwcmV2aW91c1R5cGUudGFnID09PSBjdXJyZW50VHlwZS50YWcpIHtcbiAgICAgICAgZXhjbHVkZS5wdXNoKHByZXZpb3VzSW5kZXgpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmVzdWx0LnB1c2goY3VycmVudFR5cGUpO1xuICB9KTtcblxuICByZXR1cm4gcmVzdWx0LmZpbHRlcihmdW5jdGlvbiAodHlwZSwgaW5kZXgpIHtcbiAgICByZXR1cm4gLTEgPT09IGV4Y2x1ZGUuaW5kZXhPZihpbmRleCk7XG4gIH0pO1xufVxuXG5cbmZ1bmN0aW9uIGNvbXBpbGVNYXAoLyogbGlzdHMuLi4gKi8pIHtcbiAgdmFyIHJlc3VsdCA9IHt9LCBpbmRleCwgbGVuZ3RoO1xuXG4gIGZ1bmN0aW9uIGNvbGxlY3RUeXBlKHR5cGUpIHtcbiAgICByZXN1bHRbdHlwZS50YWddID0gdHlwZTtcbiAgfVxuXG4gIGZvciAoaW5kZXggPSAwLCBsZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoOyBpbmRleCA8IGxlbmd0aDsgaW5kZXggKz0gMSkge1xuICAgIGFyZ3VtZW50c1tpbmRleF0uZm9yRWFjaChjb2xsZWN0VHlwZSk7XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5cbmZ1bmN0aW9uIFNjaGVtYShkZWZpbml0aW9uKSB7XG4gIHRoaXMuaW5jbHVkZSAgPSBkZWZpbml0aW9uLmluY2x1ZGUgIHx8IFtdO1xuICB0aGlzLmltcGxpY2l0ID0gZGVmaW5pdGlvbi5pbXBsaWNpdCB8fCBbXTtcbiAgdGhpcy5leHBsaWNpdCA9IGRlZmluaXRpb24uZXhwbGljaXQgfHwgW107XG5cbiAgdGhpcy5pbXBsaWNpdC5mb3JFYWNoKGZ1bmN0aW9uICh0eXBlKSB7XG4gICAgaWYgKHR5cGUubG9hZEtpbmQgJiYgJ3NjYWxhcicgIT09IHR5cGUubG9hZEtpbmQpIHtcbiAgICAgIHRocm93IG5ldyBZQU1MRXhjZXB0aW9uKCdUaGVyZSBpcyBhIG5vbi1zY2FsYXIgdHlwZSBpbiB0aGUgaW1wbGljaXQgbGlzdCBvZiBhIHNjaGVtYS4gSW1wbGljaXQgcmVzb2x2aW5nIG9mIHN1Y2ggdHlwZXMgaXMgbm90IHN1cHBvcnRlZC4nKTtcbiAgICB9XG4gIH0pO1xuXG4gIHRoaXMuY29tcGlsZWRJbXBsaWNpdCA9IGNvbXBpbGVMaXN0KHRoaXMsICdpbXBsaWNpdCcsIFtdKTtcbiAgdGhpcy5jb21waWxlZEV4cGxpY2l0ID0gY29tcGlsZUxpc3QodGhpcywgJ2V4cGxpY2l0JywgW10pO1xuICB0aGlzLmNvbXBpbGVkVHlwZU1hcCAgPSBjb21waWxlTWFwKHRoaXMuY29tcGlsZWRJbXBsaWNpdCwgdGhpcy5jb21waWxlZEV4cGxpY2l0KTtcbn1cblxuXG5TY2hlbWEuREVGQVVMVCA9IG51bGw7XG5cblxuU2NoZW1hLmNyZWF0ZSA9IGZ1bmN0aW9uIGNyZWF0ZVNjaGVtYSgpIHtcbiAgdmFyIHNjaGVtYXMsIHR5cGVzO1xuXG4gIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aCkge1xuICBjYXNlIDE6XG4gICAgc2NoZW1hcyA9IFNjaGVtYS5ERUZBVUxUO1xuICAgIHR5cGVzID0gYXJndW1lbnRzWzBdO1xuICAgIGJyZWFrO1xuXG4gIGNhc2UgMjpcbiAgICBzY2hlbWFzID0gYXJndW1lbnRzWzBdO1xuICAgIHR5cGVzID0gYXJndW1lbnRzWzFdO1xuICAgIGJyZWFrO1xuXG4gIGRlZmF1bHQ6XG4gICAgdGhyb3cgbmV3IFlBTUxFeGNlcHRpb24oJ1dyb25nIG51bWJlciBvZiBhcmd1bWVudHMgZm9yIFNjaGVtYS5jcmVhdGUgZnVuY3Rpb24nKTtcbiAgfVxuXG4gIHNjaGVtYXMgPSBjb21tb24udG9BcnJheShzY2hlbWFzKTtcbiAgdHlwZXMgPSBjb21tb24udG9BcnJheSh0eXBlcyk7XG5cbiAgaWYgKCFzY2hlbWFzLmV2ZXJ5KGZ1bmN0aW9uIChzY2hlbWEpIHsgcmV0dXJuIHNjaGVtYSBpbnN0YW5jZW9mIFNjaGVtYTsgfSkpIHtcbiAgICB0aHJvdyBuZXcgWUFNTEV4Y2VwdGlvbignU3BlY2lmaWVkIGxpc3Qgb2Ygc3VwZXIgc2NoZW1hcyAob3IgYSBzaW5nbGUgU2NoZW1hIG9iamVjdCkgY29udGFpbnMgYSBub24tU2NoZW1hIG9iamVjdC4nKTtcbiAgfVxuXG4gIGlmICghdHlwZXMuZXZlcnkoZnVuY3Rpb24gKHR5cGUpIHsgcmV0dXJuIHR5cGUgaW5zdGFuY2VvZiBUeXBlOyB9KSkge1xuICAgIHRocm93IG5ldyBZQU1MRXhjZXB0aW9uKCdTcGVjaWZpZWQgbGlzdCBvZiBZQU1MIHR5cGVzIChvciBhIHNpbmdsZSBUeXBlIG9iamVjdCkgY29udGFpbnMgYSBub24tVHlwZSBvYmplY3QuJyk7XG4gIH1cblxuICByZXR1cm4gbmV3IFNjaGVtYSh7XG4gICAgaW5jbHVkZTogc2NoZW1hcyxcbiAgICBleHBsaWNpdDogdHlwZXNcbiAgfSk7XG59O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gU2NoZW1hO1xuIiwiLy8gU3RhbmRhcmQgWUFNTCdzIENvcmUgc2NoZW1hLlxuLy8gaHR0cDovL3d3dy55YW1sLm9yZy9zcGVjLzEuMi9zcGVjLmh0bWwjaWQyODA0OTIzXG4vL1xuLy8gTk9URTogSlMtWUFNTCBkb2VzIG5vdCBzdXBwb3J0IHNjaGVtYS1zcGVjaWZpYyB0YWcgcmVzb2x1dGlvbiByZXN0cmljdGlvbnMuXG4vLyBTbywgQ29yZSBzY2hlbWEgaGFzIG5vIGRpc3RpbmN0aW9ucyBmcm9tIEpTT04gc2NoZW1hIGlzIEpTLVlBTUwuXG5cblxuJ3VzZSBzdHJpY3QnO1xuXG5cbnZhciBTY2hlbWEgPSByZXF1aXJlKCcuLi9zY2hlbWEnKTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBTY2hlbWEoe1xuICBpbmNsdWRlOiBbXG4gICAgcmVxdWlyZSgnLi9qc29uJylcbiAgXVxufSk7XG4iLCIvLyBKUy1ZQU1MJ3MgZGVmYXVsdCBzY2hlbWEgZm9yIGBsb2FkYCBmdW5jdGlvbi5cbi8vIEl0IGlzIG5vdCBkZXNjcmliZWQgaW4gdGhlIFlBTUwgc3BlY2lmaWNhdGlvbi5cbi8vXG4vLyBUaGlzIHNjaGVtYSBpcyBiYXNlZCBvbiBKUy1ZQU1MJ3MgZGVmYXVsdCBzYWZlIHNjaGVtYSBhbmQgaW5jbHVkZXNcbi8vIEphdmFTY3JpcHQtc3BlY2lmaWMgdHlwZXM6ICEhanMvdW5kZWZpbmVkLCAhIWpzL3JlZ2V4cCBhbmQgISFqcy9mdW5jdGlvbi5cbi8vXG4vLyBBbHNvIHRoaXMgc2NoZW1hIGlzIHVzZWQgYXMgZGVmYXVsdCBiYXNlIHNjaGVtYSBhdCBgU2NoZW1hLmNyZWF0ZWAgZnVuY3Rpb24uXG5cblxuJ3VzZSBzdHJpY3QnO1xuXG5cbnZhciBTY2hlbWEgPSByZXF1aXJlKCcuLi9zY2hlbWEnKTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IFNjaGVtYS5ERUZBVUxUID0gbmV3IFNjaGVtYSh7XG4gIGluY2x1ZGU6IFtcbiAgICByZXF1aXJlKCcuL2RlZmF1bHRfc2FmZScpXG4gIF0sXG4gIGV4cGxpY2l0OiBbXG4gICAgcmVxdWlyZSgnLi4vdHlwZS9qcy91bmRlZmluZWQnKSxcbiAgICByZXF1aXJlKCcuLi90eXBlL2pzL3JlZ2V4cCcpLFxuICAgIHJlcXVpcmUoJy4uL3R5cGUvanMvZnVuY3Rpb24nKVxuICBdXG59KTtcbiIsIi8vIEpTLVlBTUwncyBkZWZhdWx0IHNjaGVtYSBmb3IgYHNhZmVMb2FkYCBmdW5jdGlvbi5cbi8vIEl0IGlzIG5vdCBkZXNjcmliZWQgaW4gdGhlIFlBTUwgc3BlY2lmaWNhdGlvbi5cbi8vXG4vLyBUaGlzIHNjaGVtYSBpcyBiYXNlZCBvbiBzdGFuZGFyZCBZQU1MJ3MgQ29yZSBzY2hlbWEgYW5kIGluY2x1ZGVzIG1vc3Qgb2Zcbi8vIGV4dHJhIHR5cGVzIGRlc2NyaWJlZCBhdCBZQU1MIHRhZyByZXBvc2l0b3J5LiAoaHR0cDovL3lhbWwub3JnL3R5cGUvKVxuXG5cbid1c2Ugc3RyaWN0JztcblxuXG52YXIgU2NoZW1hID0gcmVxdWlyZSgnLi4vc2NoZW1hJyk7XG5cblxubW9kdWxlLmV4cG9ydHMgPSBuZXcgU2NoZW1hKHtcbiAgaW5jbHVkZTogW1xuICAgIHJlcXVpcmUoJy4vY29yZScpXG4gIF0sXG4gIGltcGxpY2l0OiBbXG4gICAgcmVxdWlyZSgnLi4vdHlwZS90aW1lc3RhbXAnKSxcbiAgICByZXF1aXJlKCcuLi90eXBlL21lcmdlJylcbiAgXSxcbiAgZXhwbGljaXQ6IFtcbiAgICByZXF1aXJlKCcuLi90eXBlL2JpbmFyeScpLFxuICAgIHJlcXVpcmUoJy4uL3R5cGUvb21hcCcpLFxuICAgIHJlcXVpcmUoJy4uL3R5cGUvcGFpcnMnKSxcbiAgICByZXF1aXJlKCcuLi90eXBlL3NldCcpXG4gIF1cbn0pO1xuIiwiLy8gU3RhbmRhcmQgWUFNTCdzIEZhaWxzYWZlIHNjaGVtYS5cbi8vIGh0dHA6Ly93d3cueWFtbC5vcmcvc3BlYy8xLjIvc3BlYy5odG1sI2lkMjgwMjM0NlxuXG5cbid1c2Ugc3RyaWN0JztcblxuXG52YXIgU2NoZW1hID0gcmVxdWlyZSgnLi4vc2NoZW1hJyk7XG5cblxubW9kdWxlLmV4cG9ydHMgPSBuZXcgU2NoZW1hKHtcbiAgZXhwbGljaXQ6IFtcbiAgICByZXF1aXJlKCcuLi90eXBlL3N0cicpLFxuICAgIHJlcXVpcmUoJy4uL3R5cGUvc2VxJyksXG4gICAgcmVxdWlyZSgnLi4vdHlwZS9tYXAnKVxuICBdXG59KTtcbiIsIi8vIFN0YW5kYXJkIFlBTUwncyBKU09OIHNjaGVtYS5cbi8vIGh0dHA6Ly93d3cueWFtbC5vcmcvc3BlYy8xLjIvc3BlYy5odG1sI2lkMjgwMzIzMVxuLy9cbi8vIE5PVEU6IEpTLVlBTUwgZG9lcyBub3Qgc3VwcG9ydCBzY2hlbWEtc3BlY2lmaWMgdGFnIHJlc29sdXRpb24gcmVzdHJpY3Rpb25zLlxuLy8gU28sIHRoaXMgc2NoZW1hIGlzIG5vdCBzdWNoIHN0cmljdCBhcyBkZWZpbmVkIGluIHRoZSBZQU1MIHNwZWNpZmljYXRpb24uXG4vLyBJdCBhbGxvd3MgbnVtYmVycyBpbiBiaW5hcnkgbm90YWlvbiwgdXNlIGBOdWxsYCBhbmQgYE5VTExgIGFzIGBudWxsYCwgZXRjLlxuXG5cbid1c2Ugc3RyaWN0JztcblxuXG52YXIgU2NoZW1hID0gcmVxdWlyZSgnLi4vc2NoZW1hJyk7XG5cblxubW9kdWxlLmV4cG9ydHMgPSBuZXcgU2NoZW1hKHtcbiAgaW5jbHVkZTogW1xuICAgIHJlcXVpcmUoJy4vZmFpbHNhZmUnKVxuICBdLFxuICBpbXBsaWNpdDogW1xuICAgIHJlcXVpcmUoJy4uL3R5cGUvbnVsbCcpLFxuICAgIHJlcXVpcmUoJy4uL3R5cGUvYm9vbCcpLFxuICAgIHJlcXVpcmUoJy4uL3R5cGUvaW50JyksXG4gICAgcmVxdWlyZSgnLi4vdHlwZS9mbG9hdCcpXG4gIF1cbn0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgWUFNTEV4Y2VwdGlvbiA9IHJlcXVpcmUoJy4vZXhjZXB0aW9uJyk7XG5cbnZhciBUWVBFX0NPTlNUUlVDVE9SX09QVElPTlMgPSBbXG4gICdraW5kJyxcbiAgJ3Jlc29sdmUnLFxuICAnY29uc3RydWN0JyxcbiAgJ2luc3RhbmNlT2YnLFxuICAncHJlZGljYXRlJyxcbiAgJ3JlcHJlc2VudCcsXG4gICdkZWZhdWx0U3R5bGUnLFxuICAnc3R5bGVBbGlhc2VzJ1xuXTtcblxudmFyIFlBTUxfTk9ERV9LSU5EUyA9IFtcbiAgJ3NjYWxhcicsXG4gICdzZXF1ZW5jZScsXG4gICdtYXBwaW5nJ1xuXTtcblxuZnVuY3Rpb24gY29tcGlsZVN0eWxlQWxpYXNlcyhtYXApIHtcbiAgdmFyIHJlc3VsdCA9IHt9O1xuXG4gIGlmIChudWxsICE9PSBtYXApIHtcbiAgICBPYmplY3Qua2V5cyhtYXApLmZvckVhY2goZnVuY3Rpb24gKHN0eWxlKSB7XG4gICAgICBtYXBbc3R5bGVdLmZvckVhY2goZnVuY3Rpb24gKGFsaWFzKSB7XG4gICAgICAgIHJlc3VsdFtTdHJpbmcoYWxpYXMpXSA9IHN0eWxlO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiBUeXBlKHRhZywgb3B0aW9ucykge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICBPYmplY3Qua2V5cyhvcHRpb25zKS5mb3JFYWNoKGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgaWYgKC0xID09PSBUWVBFX0NPTlNUUlVDVE9SX09QVElPTlMuaW5kZXhPZihuYW1lKSkge1xuICAgICAgdGhyb3cgbmV3IFlBTUxFeGNlcHRpb24oJ1Vua25vd24gb3B0aW9uIFwiJyArIG5hbWUgKyAnXCIgaXMgbWV0IGluIGRlZmluaXRpb24gb2YgXCInICsgdGFnICsgJ1wiIFlBTUwgdHlwZS4nKTtcbiAgICB9XG4gIH0pO1xuXG4gIC8vIFRPRE86IEFkZCB0YWcgZm9ybWF0IGNoZWNrLlxuICB0aGlzLnRhZyAgICAgICAgICA9IHRhZztcbiAgdGhpcy5raW5kICAgICAgICAgPSBvcHRpb25zWydraW5kJ10gICAgICAgICB8fCBudWxsO1xuICB0aGlzLnJlc29sdmUgICAgICA9IG9wdGlvbnNbJ3Jlc29sdmUnXSAgICAgIHx8IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRydWU7IH07XG4gIHRoaXMuY29uc3RydWN0ICAgID0gb3B0aW9uc1snY29uc3RydWN0J10gICAgfHwgZnVuY3Rpb24gKGRhdGEpIHsgcmV0dXJuIGRhdGE7IH07XG4gIHRoaXMuaW5zdGFuY2VPZiAgID0gb3B0aW9uc1snaW5zdGFuY2VPZiddICAgfHwgbnVsbDtcbiAgdGhpcy5wcmVkaWNhdGUgICAgPSBvcHRpb25zWydwcmVkaWNhdGUnXSAgICB8fCBudWxsO1xuICB0aGlzLnJlcHJlc2VudCAgICA9IG9wdGlvbnNbJ3JlcHJlc2VudCddICAgIHx8IG51bGw7XG4gIHRoaXMuZGVmYXVsdFN0eWxlID0gb3B0aW9uc1snZGVmYXVsdFN0eWxlJ10gfHwgbnVsbDtcbiAgdGhpcy5zdHlsZUFsaWFzZXMgPSBjb21waWxlU3R5bGVBbGlhc2VzKG9wdGlvbnNbJ3N0eWxlQWxpYXNlcyddIHx8IG51bGwpO1xuXG4gIGlmICgtMSA9PT0gWUFNTF9OT0RFX0tJTkRTLmluZGV4T2YodGhpcy5raW5kKSkge1xuICAgIHRocm93IG5ldyBZQU1MRXhjZXB0aW9uKCdVbmtub3duIGtpbmQgXCInICsgdGhpcy5raW5kICsgJ1wiIGlzIHNwZWNpZmllZCBmb3IgXCInICsgdGFnICsgJ1wiIFlBTUwgdHlwZS4nKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFR5cGU7XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qZXNsaW50LWRpc2FibGUgbm8tYml0d2lzZSovXG5cbi8vIEEgdHJpY2sgZm9yIGJyb3dzZXJpZmllZCB2ZXJzaW9uLlxuLy8gU2luY2Ugd2UgbWFrZSBicm93c2VyaWZpZXIgdG8gaWdub3JlIGBidWZmZXJgIG1vZHVsZSwgTm9kZUJ1ZmZlciB3aWxsIGJlIHVuZGVmaW5lZFxudmFyIE5vZGVCdWZmZXIgPSByZXF1aXJlKCdidWZmZXInKS5CdWZmZXI7XG52YXIgVHlwZSAgICAgICA9IHJlcXVpcmUoJy4uL3R5cGUnKTtcblxuXG4vLyBbIDY0LCA2NSwgNjYgXSAtPiBbIHBhZGRpbmcsIENSLCBMRiBdXG52YXIgQkFTRTY0X01BUCA9ICdBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvPVxcblxccic7XG5cblxuZnVuY3Rpb24gcmVzb2x2ZVlhbWxCaW5hcnkoZGF0YSkge1xuICBpZiAobnVsbCA9PT0gZGF0YSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHZhciBjb2RlLCBpZHgsIGJpdGxlbiA9IDAsIG1heCA9IGRhdGEubGVuZ3RoLCBtYXAgPSBCQVNFNjRfTUFQO1xuXG4gIC8vIENvbnZlcnQgb25lIGJ5IG9uZS5cbiAgZm9yIChpZHggPSAwOyBpZHggPCBtYXg7IGlkeCsrKSB7XG4gICAgY29kZSA9IG1hcC5pbmRleE9mKGRhdGEuY2hhckF0KGlkeCkpO1xuXG4gICAgLy8gU2tpcCBDUi9MRlxuICAgIGlmIChjb2RlID4gNjQpIHsgY29udGludWU7IH1cblxuICAgIC8vIEZhaWwgb24gaWxsZWdhbCBjaGFyYWN0ZXJzXG4gICAgaWYgKGNvZGUgPCAwKSB7IHJldHVybiBmYWxzZTsgfVxuXG4gICAgYml0bGVuICs9IDY7XG4gIH1cblxuICAvLyBJZiB0aGVyZSBhcmUgYW55IGJpdHMgbGVmdCwgc291cmNlIHdhcyBjb3JydXB0ZWRcbiAgcmV0dXJuIChiaXRsZW4gJSA4KSA9PT0gMDtcbn1cblxuZnVuY3Rpb24gY29uc3RydWN0WWFtbEJpbmFyeShkYXRhKSB7XG4gIHZhciBpZHgsIHRhaWxiaXRzLFxuICAgICAgaW5wdXQgPSBkYXRhLnJlcGxhY2UoL1tcXHJcXG49XS9nLCAnJyksIC8vIHJlbW92ZSBDUi9MRiAmIHBhZGRpbmcgdG8gc2ltcGxpZnkgc2NhblxuICAgICAgbWF4ID0gaW5wdXQubGVuZ3RoLFxuICAgICAgbWFwID0gQkFTRTY0X01BUCxcbiAgICAgIGJpdHMgPSAwLFxuICAgICAgcmVzdWx0ID0gW107XG5cbiAgLy8gQ29sbGVjdCBieSA2KjQgYml0cyAoMyBieXRlcylcblxuICBmb3IgKGlkeCA9IDA7IGlkeCA8IG1heDsgaWR4KyspIHtcbiAgICBpZiAoKGlkeCAlIDQgPT09IDApICYmIGlkeCkge1xuICAgICAgcmVzdWx0LnB1c2goKGJpdHMgPj4gMTYpICYgMHhGRik7XG4gICAgICByZXN1bHQucHVzaCgoYml0cyA+PiA4KSAmIDB4RkYpO1xuICAgICAgcmVzdWx0LnB1c2goYml0cyAmIDB4RkYpO1xuICAgIH1cblxuICAgIGJpdHMgPSAoYml0cyA8PCA2KSB8IG1hcC5pbmRleE9mKGlucHV0LmNoYXJBdChpZHgpKTtcbiAgfVxuXG4gIC8vIER1bXAgdGFpbFxuXG4gIHRhaWxiaXRzID0gKG1heCAlIDQpICogNjtcblxuICBpZiAodGFpbGJpdHMgPT09IDApIHtcbiAgICByZXN1bHQucHVzaCgoYml0cyA+PiAxNikgJiAweEZGKTtcbiAgICByZXN1bHQucHVzaCgoYml0cyA+PiA4KSAmIDB4RkYpO1xuICAgIHJlc3VsdC5wdXNoKGJpdHMgJiAweEZGKTtcbiAgfSBlbHNlIGlmICh0YWlsYml0cyA9PT0gMTgpIHtcbiAgICByZXN1bHQucHVzaCgoYml0cyA+PiAxMCkgJiAweEZGKTtcbiAgICByZXN1bHQucHVzaCgoYml0cyA+PiAyKSAmIDB4RkYpO1xuICB9IGVsc2UgaWYgKHRhaWxiaXRzID09PSAxMikge1xuICAgIHJlc3VsdC5wdXNoKChiaXRzID4+IDQpICYgMHhGRik7XG4gIH1cblxuICAvLyBXcmFwIGludG8gQnVmZmVyIGZvciBOb2RlSlMgYW5kIGxlYXZlIEFycmF5IGZvciBicm93c2VyXG4gIGlmIChOb2RlQnVmZmVyKSB7XG4gICAgcmV0dXJuIG5ldyBOb2RlQnVmZmVyKHJlc3VsdCk7XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiByZXByZXNlbnRZYW1sQmluYXJ5KG9iamVjdCAvKiwgc3R5bGUqLykge1xuICB2YXIgcmVzdWx0ID0gJycsIGJpdHMgPSAwLCBpZHgsIHRhaWwsXG4gICAgICBtYXggPSBvYmplY3QubGVuZ3RoLFxuICAgICAgbWFwID0gQkFTRTY0X01BUDtcblxuICAvLyBDb252ZXJ0IGV2ZXJ5IHRocmVlIGJ5dGVzIHRvIDQgQVNDSUkgY2hhcmFjdGVycy5cblxuICBmb3IgKGlkeCA9IDA7IGlkeCA8IG1heDsgaWR4KyspIHtcbiAgICBpZiAoKGlkeCAlIDMgPT09IDApICYmIGlkeCkge1xuICAgICAgcmVzdWx0ICs9IG1hcFsoYml0cyA+PiAxOCkgJiAweDNGXTtcbiAgICAgIHJlc3VsdCArPSBtYXBbKGJpdHMgPj4gMTIpICYgMHgzRl07XG4gICAgICByZXN1bHQgKz0gbWFwWyhiaXRzID4+IDYpICYgMHgzRl07XG4gICAgICByZXN1bHQgKz0gbWFwW2JpdHMgJiAweDNGXTtcbiAgICB9XG5cbiAgICBiaXRzID0gKGJpdHMgPDwgOCkgKyBvYmplY3RbaWR4XTtcbiAgfVxuXG4gIC8vIER1bXAgdGFpbFxuXG4gIHRhaWwgPSBtYXggJSAzO1xuXG4gIGlmICh0YWlsID09PSAwKSB7XG4gICAgcmVzdWx0ICs9IG1hcFsoYml0cyA+PiAxOCkgJiAweDNGXTtcbiAgICByZXN1bHQgKz0gbWFwWyhiaXRzID4+IDEyKSAmIDB4M0ZdO1xuICAgIHJlc3VsdCArPSBtYXBbKGJpdHMgPj4gNikgJiAweDNGXTtcbiAgICByZXN1bHQgKz0gbWFwW2JpdHMgJiAweDNGXTtcbiAgfSBlbHNlIGlmICh0YWlsID09PSAyKSB7XG4gICAgcmVzdWx0ICs9IG1hcFsoYml0cyA+PiAxMCkgJiAweDNGXTtcbiAgICByZXN1bHQgKz0gbWFwWyhiaXRzID4+IDQpICYgMHgzRl07XG4gICAgcmVzdWx0ICs9IG1hcFsoYml0cyA8PCAyKSAmIDB4M0ZdO1xuICAgIHJlc3VsdCArPSBtYXBbNjRdO1xuICB9IGVsc2UgaWYgKHRhaWwgPT09IDEpIHtcbiAgICByZXN1bHQgKz0gbWFwWyhiaXRzID4+IDIpICYgMHgzRl07XG4gICAgcmVzdWx0ICs9IG1hcFsoYml0cyA8PCA0KSAmIDB4M0ZdO1xuICAgIHJlc3VsdCArPSBtYXBbNjRdO1xuICAgIHJlc3VsdCArPSBtYXBbNjRdO1xuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gaXNCaW5hcnkob2JqZWN0KSB7XG4gIHJldHVybiBOb2RlQnVmZmVyICYmIE5vZGVCdWZmZXIuaXNCdWZmZXIob2JqZWN0KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBuZXcgVHlwZSgndGFnOnlhbWwub3JnLDIwMDI6YmluYXJ5Jywge1xuICBraW5kOiAnc2NhbGFyJyxcbiAgcmVzb2x2ZTogcmVzb2x2ZVlhbWxCaW5hcnksXG4gIGNvbnN0cnVjdDogY29uc3RydWN0WWFtbEJpbmFyeSxcbiAgcHJlZGljYXRlOiBpc0JpbmFyeSxcbiAgcmVwcmVzZW50OiByZXByZXNlbnRZYW1sQmluYXJ5XG59KTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIFR5cGUgPSByZXF1aXJlKCcuLi90eXBlJyk7XG5cbmZ1bmN0aW9uIHJlc29sdmVZYW1sQm9vbGVhbihkYXRhKSB7XG4gIGlmIChudWxsID09PSBkYXRhKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgdmFyIG1heCA9IGRhdGEubGVuZ3RoO1xuXG4gIHJldHVybiAobWF4ID09PSA0ICYmIChkYXRhID09PSAndHJ1ZScgfHwgZGF0YSA9PT0gJ1RydWUnIHx8IGRhdGEgPT09ICdUUlVFJykpIHx8XG4gICAgICAgICAobWF4ID09PSA1ICYmIChkYXRhID09PSAnZmFsc2UnIHx8IGRhdGEgPT09ICdGYWxzZScgfHwgZGF0YSA9PT0gJ0ZBTFNFJykpO1xufVxuXG5mdW5jdGlvbiBjb25zdHJ1Y3RZYW1sQm9vbGVhbihkYXRhKSB7XG4gIHJldHVybiBkYXRhID09PSAndHJ1ZScgfHxcbiAgICAgICAgIGRhdGEgPT09ICdUcnVlJyB8fFxuICAgICAgICAgZGF0YSA9PT0gJ1RSVUUnO1xufVxuXG5mdW5jdGlvbiBpc0Jvb2xlYW4ob2JqZWN0KSB7XG4gIHJldHVybiAnW29iamVjdCBCb29sZWFuXScgPT09IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmplY3QpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBUeXBlKCd0YWc6eWFtbC5vcmcsMjAwMjpib29sJywge1xuICBraW5kOiAnc2NhbGFyJyxcbiAgcmVzb2x2ZTogcmVzb2x2ZVlhbWxCb29sZWFuLFxuICBjb25zdHJ1Y3Q6IGNvbnN0cnVjdFlhbWxCb29sZWFuLFxuICBwcmVkaWNhdGU6IGlzQm9vbGVhbixcbiAgcmVwcmVzZW50OiB7XG4gICAgbG93ZXJjYXNlOiBmdW5jdGlvbiAob2JqZWN0KSB7IHJldHVybiBvYmplY3QgPyAndHJ1ZScgOiAnZmFsc2UnOyB9LFxuICAgIHVwcGVyY2FzZTogZnVuY3Rpb24gKG9iamVjdCkgeyByZXR1cm4gb2JqZWN0ID8gJ1RSVUUnIDogJ0ZBTFNFJzsgfSxcbiAgICBjYW1lbGNhc2U6IGZ1bmN0aW9uIChvYmplY3QpIHsgcmV0dXJuIG9iamVjdCA/ICdUcnVlJyA6ICdGYWxzZSc7IH1cbiAgfSxcbiAgZGVmYXVsdFN0eWxlOiAnbG93ZXJjYXNlJ1xufSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBjb21tb24gPSByZXF1aXJlKCcuLi9jb21tb24nKTtcbnZhciBUeXBlICAgPSByZXF1aXJlKCcuLi90eXBlJyk7XG5cbnZhciBZQU1MX0ZMT0FUX1BBVFRFUk4gPSBuZXcgUmVnRXhwKFxuICAnXig/OlstK10/KD86WzAtOV1bMC05X10qKVxcXFwuWzAtOV9dKig/OltlRV1bLStdWzAtOV0rKT8nICtcbiAgJ3xcXFxcLlswLTlfXSsoPzpbZUVdWy0rXVswLTldKyk/JyArXG4gICd8Wy0rXT9bMC05XVswLTlfXSooPzo6WzAtNV0/WzAtOV0pK1xcXFwuWzAtOV9dKicgK1xuICAnfFstK10/XFxcXC4oPzppbmZ8SW5mfElORiknICtcbiAgJ3xcXFxcLig/Om5hbnxOYU58TkFOKSkkJyk7XG5cbmZ1bmN0aW9uIHJlc29sdmVZYW1sRmxvYXQoZGF0YSkge1xuICBpZiAobnVsbCA9PT0gZGF0YSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmICghWUFNTF9GTE9BVF9QQVRURVJOLnRlc3QoZGF0YSkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG5cbmZ1bmN0aW9uIGNvbnN0cnVjdFlhbWxGbG9hdChkYXRhKSB7XG4gIHZhciB2YWx1ZSwgc2lnbiwgYmFzZSwgZGlnaXRzO1xuXG4gIHZhbHVlICA9IGRhdGEucmVwbGFjZSgvXy9nLCAnJykudG9Mb3dlckNhc2UoKTtcbiAgc2lnbiAgID0gJy0nID09PSB2YWx1ZVswXSA/IC0xIDogMTtcbiAgZGlnaXRzID0gW107XG5cbiAgaWYgKDAgPD0gJystJy5pbmRleE9mKHZhbHVlWzBdKSkge1xuICAgIHZhbHVlID0gdmFsdWUuc2xpY2UoMSk7XG4gIH1cblxuICBpZiAoJy5pbmYnID09PSB2YWx1ZSkge1xuICAgIHJldHVybiAoMSA9PT0gc2lnbikgPyBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFkgOiBOdW1iZXIuTkVHQVRJVkVfSU5GSU5JVFk7XG5cbiAgfSBlbHNlIGlmICgnLm5hbicgPT09IHZhbHVlKSB7XG4gICAgcmV0dXJuIE5hTjtcblxuICB9IGVsc2UgaWYgKDAgPD0gdmFsdWUuaW5kZXhPZignOicpKSB7XG4gICAgdmFsdWUuc3BsaXQoJzonKS5mb3JFYWNoKGZ1bmN0aW9uICh2KSB7XG4gICAgICBkaWdpdHMudW5zaGlmdChwYXJzZUZsb2F0KHYsIDEwKSk7XG4gICAgfSk7XG5cbiAgICB2YWx1ZSA9IDAuMDtcbiAgICBiYXNlID0gMTtcblxuICAgIGRpZ2l0cy5mb3JFYWNoKGZ1bmN0aW9uIChkKSB7XG4gICAgICB2YWx1ZSArPSBkICogYmFzZTtcbiAgICAgIGJhc2UgKj0gNjA7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gc2lnbiAqIHZhbHVlO1xuXG4gIH1cbiAgcmV0dXJuIHNpZ24gKiBwYXJzZUZsb2F0KHZhbHVlLCAxMCk7XG59XG5cbmZ1bmN0aW9uIHJlcHJlc2VudFlhbWxGbG9hdChvYmplY3QsIHN0eWxlKSB7XG4gIGlmIChpc05hTihvYmplY3QpKSB7XG4gICAgc3dpdGNoIChzdHlsZSkge1xuICAgIGNhc2UgJ2xvd2VyY2FzZSc6XG4gICAgICByZXR1cm4gJy5uYW4nO1xuICAgIGNhc2UgJ3VwcGVyY2FzZSc6XG4gICAgICByZXR1cm4gJy5OQU4nO1xuICAgIGNhc2UgJ2NhbWVsY2FzZSc6XG4gICAgICByZXR1cm4gJy5OYU4nO1xuICAgIH1cbiAgfSBlbHNlIGlmIChOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFkgPT09IG9iamVjdCkge1xuICAgIHN3aXRjaCAoc3R5bGUpIHtcbiAgICBjYXNlICdsb3dlcmNhc2UnOlxuICAgICAgcmV0dXJuICcuaW5mJztcbiAgICBjYXNlICd1cHBlcmNhc2UnOlxuICAgICAgcmV0dXJuICcuSU5GJztcbiAgICBjYXNlICdjYW1lbGNhc2UnOlxuICAgICAgcmV0dXJuICcuSW5mJztcbiAgICB9XG4gIH0gZWxzZSBpZiAoTnVtYmVyLk5FR0FUSVZFX0lORklOSVRZID09PSBvYmplY3QpIHtcbiAgICBzd2l0Y2ggKHN0eWxlKSB7XG4gICAgY2FzZSAnbG93ZXJjYXNlJzpcbiAgICAgIHJldHVybiAnLS5pbmYnO1xuICAgIGNhc2UgJ3VwcGVyY2FzZSc6XG4gICAgICByZXR1cm4gJy0uSU5GJztcbiAgICBjYXNlICdjYW1lbGNhc2UnOlxuICAgICAgcmV0dXJuICctLkluZic7XG4gICAgfVxuICB9IGVsc2UgaWYgKGNvbW1vbi5pc05lZ2F0aXZlWmVybyhvYmplY3QpKSB7XG4gICAgcmV0dXJuICctMC4wJztcbiAgfVxuICByZXR1cm4gb2JqZWN0LnRvU3RyaW5nKDEwKTtcbn1cblxuZnVuY3Rpb24gaXNGbG9hdChvYmplY3QpIHtcbiAgcmV0dXJuICgnW29iamVjdCBOdW1iZXJdJyA9PT0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iamVjdCkpICYmXG4gICAgICAgICAoMCAhPT0gb2JqZWN0ICUgMSB8fCBjb21tb24uaXNOZWdhdGl2ZVplcm8ob2JqZWN0KSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbmV3IFR5cGUoJ3RhZzp5YW1sLm9yZywyMDAyOmZsb2F0Jywge1xuICBraW5kOiAnc2NhbGFyJyxcbiAgcmVzb2x2ZTogcmVzb2x2ZVlhbWxGbG9hdCxcbiAgY29uc3RydWN0OiBjb25zdHJ1Y3RZYW1sRmxvYXQsXG4gIHByZWRpY2F0ZTogaXNGbG9hdCxcbiAgcmVwcmVzZW50OiByZXByZXNlbnRZYW1sRmxvYXQsXG4gIGRlZmF1bHRTdHlsZTogJ2xvd2VyY2FzZSdcbn0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgY29tbW9uID0gcmVxdWlyZSgnLi4vY29tbW9uJyk7XG52YXIgVHlwZSAgID0gcmVxdWlyZSgnLi4vdHlwZScpO1xuXG5mdW5jdGlvbiBpc0hleENvZGUoYykge1xuICByZXR1cm4gKCgweDMwLyogMCAqLyA8PSBjKSAmJiAoYyA8PSAweDM5LyogOSAqLykpIHx8XG4gICAgICAgICAoKDB4NDEvKiBBICovIDw9IGMpICYmIChjIDw9IDB4NDYvKiBGICovKSkgfHxcbiAgICAgICAgICgoMHg2MS8qIGEgKi8gPD0gYykgJiYgKGMgPD0gMHg2Ni8qIGYgKi8pKTtcbn1cblxuZnVuY3Rpb24gaXNPY3RDb2RlKGMpIHtcbiAgcmV0dXJuICgoMHgzMC8qIDAgKi8gPD0gYykgJiYgKGMgPD0gMHgzNy8qIDcgKi8pKTtcbn1cblxuZnVuY3Rpb24gaXNEZWNDb2RlKGMpIHtcbiAgcmV0dXJuICgoMHgzMC8qIDAgKi8gPD0gYykgJiYgKGMgPD0gMHgzOS8qIDkgKi8pKTtcbn1cblxuZnVuY3Rpb24gcmVzb2x2ZVlhbWxJbnRlZ2VyKGRhdGEpIHtcbiAgaWYgKG51bGwgPT09IGRhdGEpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICB2YXIgbWF4ID0gZGF0YS5sZW5ndGgsXG4gICAgICBpbmRleCA9IDAsXG4gICAgICBoYXNEaWdpdHMgPSBmYWxzZSxcbiAgICAgIGNoO1xuXG4gIGlmICghbWF4KSB7IHJldHVybiBmYWxzZTsgfVxuXG4gIGNoID0gZGF0YVtpbmRleF07XG5cbiAgLy8gc2lnblxuICBpZiAoY2ggPT09ICctJyB8fCBjaCA9PT0gJysnKSB7XG4gICAgY2ggPSBkYXRhWysraW5kZXhdO1xuICB9XG5cbiAgaWYgKGNoID09PSAnMCcpIHtcbiAgICAvLyAwXG4gICAgaWYgKGluZGV4ICsgMSA9PT0gbWF4KSB7IHJldHVybiB0cnVlOyB9XG4gICAgY2ggPSBkYXRhWysraW5kZXhdO1xuXG4gICAgLy8gYmFzZSAyLCBiYXNlIDgsIGJhc2UgMTZcblxuICAgIGlmIChjaCA9PT0gJ2InKSB7XG4gICAgICAvLyBiYXNlIDJcbiAgICAgIGluZGV4Kys7XG5cbiAgICAgIGZvciAoOyBpbmRleCA8IG1heDsgaW5kZXgrKykge1xuICAgICAgICBjaCA9IGRhdGFbaW5kZXhdO1xuICAgICAgICBpZiAoY2ggPT09ICdfJykgeyBjb250aW51ZTsgfVxuICAgICAgICBpZiAoY2ggIT09ICcwJyAmJiBjaCAhPT0gJzEnKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGhhc0RpZ2l0cyA9IHRydWU7XG4gICAgICB9XG4gICAgICByZXR1cm4gaGFzRGlnaXRzO1xuICAgIH1cblxuXG4gICAgaWYgKGNoID09PSAneCcpIHtcbiAgICAgIC8vIGJhc2UgMTZcbiAgICAgIGluZGV4Kys7XG5cbiAgICAgIGZvciAoOyBpbmRleCA8IG1heDsgaW5kZXgrKykge1xuICAgICAgICBjaCA9IGRhdGFbaW5kZXhdO1xuICAgICAgICBpZiAoY2ggPT09ICdfJykgeyBjb250aW51ZTsgfVxuICAgICAgICBpZiAoIWlzSGV4Q29kZShkYXRhLmNoYXJDb2RlQXQoaW5kZXgpKSkge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBoYXNEaWdpdHMgPSB0cnVlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGhhc0RpZ2l0cztcbiAgICB9XG5cbiAgICAvLyBiYXNlIDhcbiAgICBmb3IgKDsgaW5kZXggPCBtYXg7IGluZGV4KyspIHtcbiAgICAgIGNoID0gZGF0YVtpbmRleF07XG4gICAgICBpZiAoY2ggPT09ICdfJykgeyBjb250aW51ZTsgfVxuICAgICAgaWYgKCFpc09jdENvZGUoZGF0YS5jaGFyQ29kZUF0KGluZGV4KSkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgaGFzRGlnaXRzID0gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGhhc0RpZ2l0cztcbiAgfVxuXG4gIC8vIGJhc2UgMTAgKGV4Y2VwdCAwKSBvciBiYXNlIDYwXG5cbiAgZm9yICg7IGluZGV4IDwgbWF4OyBpbmRleCsrKSB7XG4gICAgY2ggPSBkYXRhW2luZGV4XTtcbiAgICBpZiAoY2ggPT09ICdfJykgeyBjb250aW51ZTsgfVxuICAgIGlmIChjaCA9PT0gJzonKSB7IGJyZWFrOyB9XG4gICAgaWYgKCFpc0RlY0NvZGUoZGF0YS5jaGFyQ29kZUF0KGluZGV4KSkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaGFzRGlnaXRzID0gdHJ1ZTtcbiAgfVxuXG4gIGlmICghaGFzRGlnaXRzKSB7IHJldHVybiBmYWxzZTsgfVxuXG4gIC8vIGlmICFiYXNlNjAgLSBkb25lO1xuICBpZiAoY2ggIT09ICc6JykgeyByZXR1cm4gdHJ1ZTsgfVxuXG4gIC8vIGJhc2U2MCBhbG1vc3Qgbm90IHVzZWQsIG5vIG5lZWRzIHRvIG9wdGltaXplXG4gIHJldHVybiAvXig6WzAtNV0/WzAtOV0pKyQvLnRlc3QoZGF0YS5zbGljZShpbmRleCkpO1xufVxuXG5mdW5jdGlvbiBjb25zdHJ1Y3RZYW1sSW50ZWdlcihkYXRhKSB7XG4gIHZhciB2YWx1ZSA9IGRhdGEsIHNpZ24gPSAxLCBjaCwgYmFzZSwgZGlnaXRzID0gW107XG5cbiAgaWYgKHZhbHVlLmluZGV4T2YoJ18nKSAhPT0gLTEpIHtcbiAgICB2YWx1ZSA9IHZhbHVlLnJlcGxhY2UoL18vZywgJycpO1xuICB9XG5cbiAgY2ggPSB2YWx1ZVswXTtcblxuICBpZiAoY2ggPT09ICctJyB8fCBjaCA9PT0gJysnKSB7XG4gICAgaWYgKGNoID09PSAnLScpIHsgc2lnbiA9IC0xOyB9XG4gICAgdmFsdWUgPSB2YWx1ZS5zbGljZSgxKTtcbiAgICBjaCA9IHZhbHVlWzBdO1xuICB9XG5cbiAgaWYgKCcwJyA9PT0gdmFsdWUpIHtcbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIGlmIChjaCA9PT0gJzAnKSB7XG4gICAgaWYgKHZhbHVlWzFdID09PSAnYicpIHtcbiAgICAgIHJldHVybiBzaWduICogcGFyc2VJbnQodmFsdWUuc2xpY2UoMiksIDIpO1xuICAgIH1cbiAgICBpZiAodmFsdWVbMV0gPT09ICd4Jykge1xuICAgICAgcmV0dXJuIHNpZ24gKiBwYXJzZUludCh2YWx1ZSwgMTYpO1xuICAgIH1cbiAgICByZXR1cm4gc2lnbiAqIHBhcnNlSW50KHZhbHVlLCA4KTtcblxuICB9XG5cbiAgaWYgKHZhbHVlLmluZGV4T2YoJzonKSAhPT0gLTEpIHtcbiAgICB2YWx1ZS5zcGxpdCgnOicpLmZvckVhY2goZnVuY3Rpb24gKHYpIHtcbiAgICAgIGRpZ2l0cy51bnNoaWZ0KHBhcnNlSW50KHYsIDEwKSk7XG4gICAgfSk7XG5cbiAgICB2YWx1ZSA9IDA7XG4gICAgYmFzZSA9IDE7XG5cbiAgICBkaWdpdHMuZm9yRWFjaChmdW5jdGlvbiAoZCkge1xuICAgICAgdmFsdWUgKz0gKGQgKiBiYXNlKTtcbiAgICAgIGJhc2UgKj0gNjA7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gc2lnbiAqIHZhbHVlO1xuXG4gIH1cblxuICByZXR1cm4gc2lnbiAqIHBhcnNlSW50KHZhbHVlLCAxMCk7XG59XG5cbmZ1bmN0aW9uIGlzSW50ZWdlcihvYmplY3QpIHtcbiAgcmV0dXJuICgnW29iamVjdCBOdW1iZXJdJyA9PT0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iamVjdCkpICYmXG4gICAgICAgICAoMCA9PT0gb2JqZWN0ICUgMSAmJiAhY29tbW9uLmlzTmVnYXRpdmVaZXJvKG9iamVjdCkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBUeXBlKCd0YWc6eWFtbC5vcmcsMjAwMjppbnQnLCB7XG4gIGtpbmQ6ICdzY2FsYXInLFxuICByZXNvbHZlOiByZXNvbHZlWWFtbEludGVnZXIsXG4gIGNvbnN0cnVjdDogY29uc3RydWN0WWFtbEludGVnZXIsXG4gIHByZWRpY2F0ZTogaXNJbnRlZ2VyLFxuICByZXByZXNlbnQ6IHtcbiAgICBiaW5hcnk6ICAgICAgZnVuY3Rpb24gKG9iamVjdCkgeyByZXR1cm4gJzBiJyArIG9iamVjdC50b1N0cmluZygyKTsgfSxcbiAgICBvY3RhbDogICAgICAgZnVuY3Rpb24gKG9iamVjdCkgeyByZXR1cm4gJzAnICArIG9iamVjdC50b1N0cmluZyg4KTsgfSxcbiAgICBkZWNpbWFsOiAgICAgZnVuY3Rpb24gKG9iamVjdCkgeyByZXR1cm4gICAgICAgIG9iamVjdC50b1N0cmluZygxMCk7IH0sXG4gICAgaGV4YWRlY2ltYWw6IGZ1bmN0aW9uIChvYmplY3QpIHsgcmV0dXJuICcweCcgKyBvYmplY3QudG9TdHJpbmcoMTYpLnRvVXBwZXJDYXNlKCk7IH1cbiAgfSxcbiAgZGVmYXVsdFN0eWxlOiAnZGVjaW1hbCcsXG4gIHN0eWxlQWxpYXNlczoge1xuICAgIGJpbmFyeTogICAgICBbIDIsICAnYmluJyBdLFxuICAgIG9jdGFsOiAgICAgICBbIDgsICAnb2N0JyBdLFxuICAgIGRlY2ltYWw6ICAgICBbIDEwLCAnZGVjJyBdLFxuICAgIGhleGFkZWNpbWFsOiBbIDE2LCAnaGV4JyBdXG4gIH1cbn0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZXNwcmltYTtcblxuLy8gQnJvd3NlcmlmaWVkIHZlcnNpb24gZG9lcyBub3QgaGF2ZSBlc3ByaW1hXG4vL1xuLy8gMS4gRm9yIG5vZGUuanMganVzdCByZXF1aXJlIG1vZHVsZSBhcyBkZXBzXG4vLyAyLiBGb3IgYnJvd3NlciB0cnkgdG8gcmVxdWlyZSBtdWR1bGUgdmlhIGV4dGVybmFsIEFNRCBzeXN0ZW0uXG4vLyAgICBJZiBub3QgZm91bmQgLSB0cnkgdG8gZmFsbGJhY2sgdG8gd2luZG93LmVzcHJpbWEuIElmIG5vdFxuLy8gICAgZm91bmQgdG9vIC0gdGhlbiBmYWlsIHRvIHBhcnNlLlxuLy9cbnRyeSB7XG4gIGVzcHJpbWEgPSByZXF1aXJlKCdlc3ByaW1hJyk7XG59IGNhdGNoIChfKSB7XG4gIC8qZ2xvYmFsIHdpbmRvdyAqL1xuICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHsgZXNwcmltYSA9IHdpbmRvdy5lc3ByaW1hOyB9XG59XG5cbnZhciBUeXBlID0gcmVxdWlyZSgnLi4vLi4vdHlwZScpO1xuXG5mdW5jdGlvbiByZXNvbHZlSmF2YXNjcmlwdEZ1bmN0aW9uKGRhdGEpIHtcbiAgaWYgKG51bGwgPT09IGRhdGEpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICB0cnkge1xuICAgIHZhciBzb3VyY2UgPSAnKCcgKyBkYXRhICsgJyknLFxuICAgICAgICBhc3QgICAgPSBlc3ByaW1hLnBhcnNlKHNvdXJjZSwgeyByYW5nZTogdHJ1ZSB9KTtcblxuICAgIGlmICgnUHJvZ3JhbScgICAgICAgICAgICAgIT09IGFzdC50eXBlICAgICAgICAgfHxcbiAgICAgICAgMSAgICAgICAgICAgICAgICAgICAgICE9PSBhc3QuYm9keS5sZW5ndGggIHx8XG4gICAgICAgICdFeHByZXNzaW9uU3RhdGVtZW50JyAhPT0gYXN0LmJvZHlbMF0udHlwZSB8fFxuICAgICAgICAnRnVuY3Rpb25FeHByZXNzaW9uJyAgIT09IGFzdC5ib2R5WzBdLmV4cHJlc3Npb24udHlwZSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cblxuZnVuY3Rpb24gY29uc3RydWN0SmF2YXNjcmlwdEZ1bmN0aW9uKGRhdGEpIHtcbiAgLypqc2xpbnQgZXZpbDp0cnVlKi9cblxuICB2YXIgc291cmNlID0gJygnICsgZGF0YSArICcpJyxcbiAgICAgIGFzdCAgICA9IGVzcHJpbWEucGFyc2Uoc291cmNlLCB7IHJhbmdlOiB0cnVlIH0pLFxuICAgICAgcGFyYW1zID0gW10sXG4gICAgICBib2R5O1xuXG4gIGlmICgnUHJvZ3JhbScgICAgICAgICAgICAgIT09IGFzdC50eXBlICAgICAgICAgfHxcbiAgICAgIDEgICAgICAgICAgICAgICAgICAgICAhPT0gYXN0LmJvZHkubGVuZ3RoICB8fFxuICAgICAgJ0V4cHJlc3Npb25TdGF0ZW1lbnQnICE9PSBhc3QuYm9keVswXS50eXBlIHx8XG4gICAgICAnRnVuY3Rpb25FeHByZXNzaW9uJyAgIT09IGFzdC5ib2R5WzBdLmV4cHJlc3Npb24udHlwZSkge1xuICAgIHRocm93IG5ldyBFcnJvcignRmFpbGVkIHRvIHJlc29sdmUgZnVuY3Rpb24nKTtcbiAgfVxuXG4gIGFzdC5ib2R5WzBdLmV4cHJlc3Npb24ucGFyYW1zLmZvckVhY2goZnVuY3Rpb24gKHBhcmFtKSB7XG4gICAgcGFyYW1zLnB1c2gocGFyYW0ubmFtZSk7XG4gIH0pO1xuXG4gIGJvZHkgPSBhc3QuYm9keVswXS5leHByZXNzaW9uLmJvZHkucmFuZ2U7XG5cbiAgLy8gRXNwcmltYSdzIHJhbmdlcyBpbmNsdWRlIHRoZSBmaXJzdCAneycgYW5kIHRoZSBsYXN0ICd9JyBjaGFyYWN0ZXJzIG9uXG4gIC8vIGZ1bmN0aW9uIGV4cHJlc3Npb25zLiBTbyBjdXQgdGhlbSBvdXQuXG4gIC8qZXNsaW50LWRpc2FibGUgbm8tbmV3LWZ1bmMqL1xuICByZXR1cm4gbmV3IEZ1bmN0aW9uKHBhcmFtcywgc291cmNlLnNsaWNlKGJvZHlbMF0gKyAxLCBib2R5WzFdIC0gMSkpO1xufVxuXG5mdW5jdGlvbiByZXByZXNlbnRKYXZhc2NyaXB0RnVuY3Rpb24ob2JqZWN0IC8qLCBzdHlsZSovKSB7XG4gIHJldHVybiBvYmplY3QudG9TdHJpbmcoKTtcbn1cblxuZnVuY3Rpb24gaXNGdW5jdGlvbihvYmplY3QpIHtcbiAgcmV0dXJuICdbb2JqZWN0IEZ1bmN0aW9uXScgPT09IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmplY3QpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBUeXBlKCd0YWc6eWFtbC5vcmcsMjAwMjpqcy9mdW5jdGlvbicsIHtcbiAga2luZDogJ3NjYWxhcicsXG4gIHJlc29sdmU6IHJlc29sdmVKYXZhc2NyaXB0RnVuY3Rpb24sXG4gIGNvbnN0cnVjdDogY29uc3RydWN0SmF2YXNjcmlwdEZ1bmN0aW9uLFxuICBwcmVkaWNhdGU6IGlzRnVuY3Rpb24sXG4gIHJlcHJlc2VudDogcmVwcmVzZW50SmF2YXNjcmlwdEZ1bmN0aW9uXG59KTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIFR5cGUgPSByZXF1aXJlKCcuLi8uLi90eXBlJyk7XG5cbmZ1bmN0aW9uIHJlc29sdmVKYXZhc2NyaXB0UmVnRXhwKGRhdGEpIHtcbiAgaWYgKG51bGwgPT09IGRhdGEpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAoMCA9PT0gZGF0YS5sZW5ndGgpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICB2YXIgcmVnZXhwID0gZGF0YSxcbiAgICAgIHRhaWwgICA9IC9cXC8oW2dpbV0qKSQvLmV4ZWMoZGF0YSksXG4gICAgICBtb2RpZmllcnMgPSAnJztcblxuICAvLyBpZiByZWdleHAgc3RhcnRzIHdpdGggJy8nIGl0IGNhbiBoYXZlIG1vZGlmaWVycyBhbmQgbXVzdCBiZSBwcm9wZXJseSBjbG9zZWRcbiAgLy8gYC9mb28vZ2ltYCAtIG1vZGlmaWVycyB0YWlsIGNhbiBiZSBtYXhpbXVtIDMgY2hhcnNcbiAgaWYgKCcvJyA9PT0gcmVnZXhwWzBdKSB7XG4gICAgaWYgKHRhaWwpIHtcbiAgICAgIG1vZGlmaWVycyA9IHRhaWxbMV07XG4gICAgfVxuXG4gICAgaWYgKG1vZGlmaWVycy5sZW5ndGggPiAzKSB7IHJldHVybiBmYWxzZTsgfVxuICAgIC8vIGlmIGV4cHJlc3Npb24gc3RhcnRzIHdpdGggLywgaXMgc2hvdWxkIGJlIHByb3Blcmx5IHRlcm1pbmF0ZWRcbiAgICBpZiAocmVnZXhwW3JlZ2V4cC5sZW5ndGggLSBtb2RpZmllcnMubGVuZ3RoIC0gMV0gIT09ICcvJykgeyByZXR1cm4gZmFsc2U7IH1cblxuICAgIHJlZ2V4cCA9IHJlZ2V4cC5zbGljZSgxLCByZWdleHAubGVuZ3RoIC0gbW9kaWZpZXJzLmxlbmd0aCAtIDEpO1xuICB9XG5cbiAgdHJ5IHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cblxuZnVuY3Rpb24gY29uc3RydWN0SmF2YXNjcmlwdFJlZ0V4cChkYXRhKSB7XG4gIHZhciByZWdleHAgPSBkYXRhLFxuICAgICAgdGFpbCAgID0gL1xcLyhbZ2ltXSopJC8uZXhlYyhkYXRhKSxcbiAgICAgIG1vZGlmaWVycyA9ICcnO1xuXG4gIC8vIGAvZm9vL2dpbWAgLSB0YWlsIGNhbiBiZSBtYXhpbXVtIDQgY2hhcnNcbiAgaWYgKCcvJyA9PT0gcmVnZXhwWzBdKSB7XG4gICAgaWYgKHRhaWwpIHtcbiAgICAgIG1vZGlmaWVycyA9IHRhaWxbMV07XG4gICAgfVxuICAgIHJlZ2V4cCA9IHJlZ2V4cC5zbGljZSgxLCByZWdleHAubGVuZ3RoIC0gbW9kaWZpZXJzLmxlbmd0aCAtIDEpO1xuICB9XG5cbiAgcmV0dXJuIG5ldyBSZWdFeHAocmVnZXhwLCBtb2RpZmllcnMpO1xufVxuXG5mdW5jdGlvbiByZXByZXNlbnRKYXZhc2NyaXB0UmVnRXhwKG9iamVjdCAvKiwgc3R5bGUqLykge1xuICB2YXIgcmVzdWx0ID0gJy8nICsgb2JqZWN0LnNvdXJjZSArICcvJztcblxuICBpZiAob2JqZWN0Lmdsb2JhbCkge1xuICAgIHJlc3VsdCArPSAnZyc7XG4gIH1cblxuICBpZiAob2JqZWN0Lm11bHRpbGluZSkge1xuICAgIHJlc3VsdCArPSAnbSc7XG4gIH1cblxuICBpZiAob2JqZWN0Lmlnbm9yZUNhc2UpIHtcbiAgICByZXN1bHQgKz0gJ2knO1xuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gaXNSZWdFeHAob2JqZWN0KSB7XG4gIHJldHVybiAnW29iamVjdCBSZWdFeHBdJyA9PT0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iamVjdCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbmV3IFR5cGUoJ3RhZzp5YW1sLm9yZywyMDAyOmpzL3JlZ2V4cCcsIHtcbiAga2luZDogJ3NjYWxhcicsXG4gIHJlc29sdmU6IHJlc29sdmVKYXZhc2NyaXB0UmVnRXhwLFxuICBjb25zdHJ1Y3Q6IGNvbnN0cnVjdEphdmFzY3JpcHRSZWdFeHAsXG4gIHByZWRpY2F0ZTogaXNSZWdFeHAsXG4gIHJlcHJlc2VudDogcmVwcmVzZW50SmF2YXNjcmlwdFJlZ0V4cFxufSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBUeXBlID0gcmVxdWlyZSgnLi4vLi4vdHlwZScpO1xuXG5mdW5jdGlvbiByZXNvbHZlSmF2YXNjcmlwdFVuZGVmaW5lZCgpIHtcbiAgcmV0dXJuIHRydWU7XG59XG5cbmZ1bmN0aW9uIGNvbnN0cnVjdEphdmFzY3JpcHRVbmRlZmluZWQoKSB7XG4gIC8qZXNsaW50LWRpc2FibGUgbm8tdW5kZWZpbmVkKi9cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuZnVuY3Rpb24gcmVwcmVzZW50SmF2YXNjcmlwdFVuZGVmaW5lZCgpIHtcbiAgcmV0dXJuICcnO1xufVxuXG5mdW5jdGlvbiBpc1VuZGVmaW5lZChvYmplY3QpIHtcbiAgcmV0dXJuICd1bmRlZmluZWQnID09PSB0eXBlb2Ygb2JqZWN0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBUeXBlKCd0YWc6eWFtbC5vcmcsMjAwMjpqcy91bmRlZmluZWQnLCB7XG4gIGtpbmQ6ICdzY2FsYXInLFxuICByZXNvbHZlOiByZXNvbHZlSmF2YXNjcmlwdFVuZGVmaW5lZCxcbiAgY29uc3RydWN0OiBjb25zdHJ1Y3RKYXZhc2NyaXB0VW5kZWZpbmVkLFxuICBwcmVkaWNhdGU6IGlzVW5kZWZpbmVkLFxuICByZXByZXNlbnQ6IHJlcHJlc2VudEphdmFzY3JpcHRVbmRlZmluZWRcbn0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgVHlwZSA9IHJlcXVpcmUoJy4uL3R5cGUnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBuZXcgVHlwZSgndGFnOnlhbWwub3JnLDIwMDI6bWFwJywge1xuICBraW5kOiAnbWFwcGluZycsXG4gIGNvbnN0cnVjdDogZnVuY3Rpb24gKGRhdGEpIHsgcmV0dXJuIG51bGwgIT09IGRhdGEgPyBkYXRhIDoge307IH1cbn0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgVHlwZSA9IHJlcXVpcmUoJy4uL3R5cGUnKTtcblxuZnVuY3Rpb24gcmVzb2x2ZVlhbWxNZXJnZShkYXRhKSB7XG4gIHJldHVybiAnPDwnID09PSBkYXRhIHx8IG51bGwgPT09IGRhdGE7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbmV3IFR5cGUoJ3RhZzp5YW1sLm9yZywyMDAyOm1lcmdlJywge1xuICBraW5kOiAnc2NhbGFyJyxcbiAgcmVzb2x2ZTogcmVzb2x2ZVlhbWxNZXJnZVxufSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBUeXBlID0gcmVxdWlyZSgnLi4vdHlwZScpO1xuXG5mdW5jdGlvbiByZXNvbHZlWWFtbE51bGwoZGF0YSkge1xuICBpZiAobnVsbCA9PT0gZGF0YSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgdmFyIG1heCA9IGRhdGEubGVuZ3RoO1xuXG4gIHJldHVybiAobWF4ID09PSAxICYmIGRhdGEgPT09ICd+JykgfHxcbiAgICAgICAgIChtYXggPT09IDQgJiYgKGRhdGEgPT09ICdudWxsJyB8fCBkYXRhID09PSAnTnVsbCcgfHwgZGF0YSA9PT0gJ05VTEwnKSk7XG59XG5cbmZ1bmN0aW9uIGNvbnN0cnVjdFlhbWxOdWxsKCkge1xuICByZXR1cm4gbnVsbDtcbn1cblxuZnVuY3Rpb24gaXNOdWxsKG9iamVjdCkge1xuICByZXR1cm4gbnVsbCA9PT0gb2JqZWN0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBUeXBlKCd0YWc6eWFtbC5vcmcsMjAwMjpudWxsJywge1xuICBraW5kOiAnc2NhbGFyJyxcbiAgcmVzb2x2ZTogcmVzb2x2ZVlhbWxOdWxsLFxuICBjb25zdHJ1Y3Q6IGNvbnN0cnVjdFlhbWxOdWxsLFxuICBwcmVkaWNhdGU6IGlzTnVsbCxcbiAgcmVwcmVzZW50OiB7XG4gICAgY2Fub25pY2FsOiBmdW5jdGlvbiAoKSB7IHJldHVybiAnfic7ICAgIH0sXG4gICAgbG93ZXJjYXNlOiBmdW5jdGlvbiAoKSB7IHJldHVybiAnbnVsbCc7IH0sXG4gICAgdXBwZXJjYXNlOiBmdW5jdGlvbiAoKSB7IHJldHVybiAnTlVMTCc7IH0sXG4gICAgY2FtZWxjYXNlOiBmdW5jdGlvbiAoKSB7IHJldHVybiAnTnVsbCc7IH1cbiAgfSxcbiAgZGVmYXVsdFN0eWxlOiAnbG93ZXJjYXNlJ1xufSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBUeXBlID0gcmVxdWlyZSgnLi4vdHlwZScpO1xuXG52YXIgX2hhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbnZhciBfdG9TdHJpbmcgICAgICAgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuXG5mdW5jdGlvbiByZXNvbHZlWWFtbE9tYXAoZGF0YSkge1xuICBpZiAobnVsbCA9PT0gZGF0YSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgdmFyIG9iamVjdEtleXMgPSBbXSwgaW5kZXgsIGxlbmd0aCwgcGFpciwgcGFpcktleSwgcGFpckhhc0tleSxcbiAgICAgIG9iamVjdCA9IGRhdGE7XG5cbiAgZm9yIChpbmRleCA9IDAsIGxlbmd0aCA9IG9iamVjdC5sZW5ndGg7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCArPSAxKSB7XG4gICAgcGFpciA9IG9iamVjdFtpbmRleF07XG4gICAgcGFpckhhc0tleSA9IGZhbHNlO1xuXG4gICAgaWYgKCdbb2JqZWN0IE9iamVjdF0nICE9PSBfdG9TdHJpbmcuY2FsbChwYWlyKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGZvciAocGFpcktleSBpbiBwYWlyKSB7XG4gICAgICBpZiAoX2hhc093blByb3BlcnR5LmNhbGwocGFpciwgcGFpcktleSkpIHtcbiAgICAgICAgaWYgKCFwYWlySGFzS2V5KSB7XG4gICAgICAgICAgcGFpckhhc0tleSA9IHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCFwYWlySGFzS2V5KSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKC0xID09PSBvYmplY3RLZXlzLmluZGV4T2YocGFpcktleSkpIHtcbiAgICAgIG9iamVjdEtleXMucHVzaChwYWlyS2V5KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufVxuXG5mdW5jdGlvbiBjb25zdHJ1Y3RZYW1sT21hcChkYXRhKSB7XG4gIHJldHVybiBudWxsICE9PSBkYXRhID8gZGF0YSA6IFtdO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBUeXBlKCd0YWc6eWFtbC5vcmcsMjAwMjpvbWFwJywge1xuICBraW5kOiAnc2VxdWVuY2UnLFxuICByZXNvbHZlOiByZXNvbHZlWWFtbE9tYXAsXG4gIGNvbnN0cnVjdDogY29uc3RydWN0WWFtbE9tYXBcbn0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgVHlwZSA9IHJlcXVpcmUoJy4uL3R5cGUnKTtcblxudmFyIF90b1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG5cbmZ1bmN0aW9uIHJlc29sdmVZYW1sUGFpcnMoZGF0YSkge1xuICBpZiAobnVsbCA9PT0gZGF0YSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgdmFyIGluZGV4LCBsZW5ndGgsIHBhaXIsIGtleXMsIHJlc3VsdCxcbiAgICAgIG9iamVjdCA9IGRhdGE7XG5cbiAgcmVzdWx0ID0gbmV3IEFycmF5KG9iamVjdC5sZW5ndGgpO1xuXG4gIGZvciAoaW5kZXggPSAwLCBsZW5ndGggPSBvYmplY3QubGVuZ3RoOyBpbmRleCA8IGxlbmd0aDsgaW5kZXggKz0gMSkge1xuICAgIHBhaXIgPSBvYmplY3RbaW5kZXhdO1xuXG4gICAgaWYgKCdbb2JqZWN0IE9iamVjdF0nICE9PSBfdG9TdHJpbmcuY2FsbChwYWlyKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGtleXMgPSBPYmplY3Qua2V5cyhwYWlyKTtcblxuICAgIGlmICgxICE9PSBrZXlzLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJlc3VsdFtpbmRleF0gPSBbIGtleXNbMF0sIHBhaXJba2V5c1swXV0gXTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufVxuXG5mdW5jdGlvbiBjb25zdHJ1Y3RZYW1sUGFpcnMoZGF0YSkge1xuICBpZiAobnVsbCA9PT0gZGF0YSkge1xuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIHZhciBpbmRleCwgbGVuZ3RoLCBwYWlyLCBrZXlzLCByZXN1bHQsXG4gICAgICBvYmplY3QgPSBkYXRhO1xuXG4gIHJlc3VsdCA9IG5ldyBBcnJheShvYmplY3QubGVuZ3RoKTtcblxuICBmb3IgKGluZGV4ID0gMCwgbGVuZ3RoID0gb2JqZWN0Lmxlbmd0aDsgaW5kZXggPCBsZW5ndGg7IGluZGV4ICs9IDEpIHtcbiAgICBwYWlyID0gb2JqZWN0W2luZGV4XTtcblxuICAgIGtleXMgPSBPYmplY3Qua2V5cyhwYWlyKTtcblxuICAgIHJlc3VsdFtpbmRleF0gPSBbIGtleXNbMF0sIHBhaXJba2V5c1swXV0gXTtcbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbmV3IFR5cGUoJ3RhZzp5YW1sLm9yZywyMDAyOnBhaXJzJywge1xuICBraW5kOiAnc2VxdWVuY2UnLFxuICByZXNvbHZlOiByZXNvbHZlWWFtbFBhaXJzLFxuICBjb25zdHJ1Y3Q6IGNvbnN0cnVjdFlhbWxQYWlyc1xufSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBUeXBlID0gcmVxdWlyZSgnLi4vdHlwZScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBUeXBlKCd0YWc6eWFtbC5vcmcsMjAwMjpzZXEnLCB7XG4gIGtpbmQ6ICdzZXF1ZW5jZScsXG4gIGNvbnN0cnVjdDogZnVuY3Rpb24gKGRhdGEpIHsgcmV0dXJuIG51bGwgIT09IGRhdGEgPyBkYXRhIDogW107IH1cbn0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgVHlwZSA9IHJlcXVpcmUoJy4uL3R5cGUnKTtcblxudmFyIF9oYXNPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG5cbmZ1bmN0aW9uIHJlc29sdmVZYW1sU2V0KGRhdGEpIHtcbiAgaWYgKG51bGwgPT09IGRhdGEpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHZhciBrZXksIG9iamVjdCA9IGRhdGE7XG5cbiAgZm9yIChrZXkgaW4gb2JqZWN0KSB7XG4gICAgaWYgKF9oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwga2V5KSkge1xuICAgICAgaWYgKG51bGwgIT09IG9iamVjdFtrZXldKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gY29uc3RydWN0WWFtbFNldChkYXRhKSB7XG4gIHJldHVybiBudWxsICE9PSBkYXRhID8gZGF0YSA6IHt9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBUeXBlKCd0YWc6eWFtbC5vcmcsMjAwMjpzZXQnLCB7XG4gIGtpbmQ6ICdtYXBwaW5nJyxcbiAgcmVzb2x2ZTogcmVzb2x2ZVlhbWxTZXQsXG4gIGNvbnN0cnVjdDogY29uc3RydWN0WWFtbFNldFxufSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBUeXBlID0gcmVxdWlyZSgnLi4vdHlwZScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBUeXBlKCd0YWc6eWFtbC5vcmcsMjAwMjpzdHInLCB7XG4gIGtpbmQ6ICdzY2FsYXInLFxuICBjb25zdHJ1Y3Q6IGZ1bmN0aW9uIChkYXRhKSB7IHJldHVybiBudWxsICE9PSBkYXRhID8gZGF0YSA6ICcnOyB9XG59KTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIFR5cGUgPSByZXF1aXJlKCcuLi90eXBlJyk7XG5cbnZhciBZQU1MX1RJTUVTVEFNUF9SRUdFWFAgPSBuZXcgUmVnRXhwKFxuICAnXihbMC05XVswLTldWzAtOV1bMC05XSknICAgICAgICAgICsgLy8gWzFdIHllYXJcbiAgJy0oWzAtOV1bMC05XT8pJyAgICAgICAgICAgICAgICAgICArIC8vIFsyXSBtb250aFxuICAnLShbMC05XVswLTldPyknICAgICAgICAgICAgICAgICAgICsgLy8gWzNdIGRheVxuICAnKD86KD86W1R0XXxbIFxcXFx0XSspJyAgICAgICAgICAgICAgKyAvLyAuLi5cbiAgJyhbMC05XVswLTldPyknICAgICAgICAgICAgICAgICAgICArIC8vIFs0XSBob3VyXG4gICc6KFswLTldWzAtOV0pJyAgICAgICAgICAgICAgICAgICAgKyAvLyBbNV0gbWludXRlXG4gICc6KFswLTldWzAtOV0pJyAgICAgICAgICAgICAgICAgICAgKyAvLyBbNl0gc2Vjb25kXG4gICcoPzpcXFxcLihbMC05XSopKT8nICAgICAgICAgICAgICAgICArIC8vIFs3XSBmcmFjdGlvblxuICAnKD86WyBcXFxcdF0qKFp8KFstK10pKFswLTldWzAtOV0/KScgKyAvLyBbOF0gdHogWzldIHR6X3NpZ24gWzEwXSB0el9ob3VyXG4gICcoPzo6KFswLTldWzAtOV0pKT8pKT8pPyQnKTsgICAgICAgICAvLyBbMTFdIHR6X21pbnV0ZVxuXG5mdW5jdGlvbiByZXNvbHZlWWFtbFRpbWVzdGFtcChkYXRhKSB7XG4gIGlmIChudWxsID09PSBkYXRhKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKFlBTUxfVElNRVNUQU1QX1JFR0VYUC5leGVjKGRhdGEpID09PSBudWxsKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59XG5cbmZ1bmN0aW9uIGNvbnN0cnVjdFlhbWxUaW1lc3RhbXAoZGF0YSkge1xuICB2YXIgbWF0Y2gsIHllYXIsIG1vbnRoLCBkYXksIGhvdXIsIG1pbnV0ZSwgc2Vjb25kLCBmcmFjdGlvbiA9IDAsXG4gICAgICBkZWx0YSA9IG51bGwsIHR6X2hvdXIsIHR6X21pbnV0ZSwgZGF0ZTtcblxuICBtYXRjaCA9IFlBTUxfVElNRVNUQU1QX1JFR0VYUC5leGVjKGRhdGEpO1xuXG4gIGlmIChudWxsID09PSBtYXRjaCkge1xuICAgIHRocm93IG5ldyBFcnJvcignRGF0ZSByZXNvbHZlIGVycm9yJyk7XG4gIH1cblxuICAvLyBtYXRjaDogWzFdIHllYXIgWzJdIG1vbnRoIFszXSBkYXlcblxuICB5ZWFyID0gKyhtYXRjaFsxXSk7XG4gIG1vbnRoID0gKyhtYXRjaFsyXSkgLSAxOyAvLyBKUyBtb250aCBzdGFydHMgd2l0aCAwXG4gIGRheSA9ICsobWF0Y2hbM10pO1xuXG4gIGlmICghbWF0Y2hbNF0pIHsgLy8gbm8gaG91clxuICAgIHJldHVybiBuZXcgRGF0ZShEYXRlLlVUQyh5ZWFyLCBtb250aCwgZGF5KSk7XG4gIH1cblxuICAvLyBtYXRjaDogWzRdIGhvdXIgWzVdIG1pbnV0ZSBbNl0gc2Vjb25kIFs3XSBmcmFjdGlvblxuXG4gIGhvdXIgPSArKG1hdGNoWzRdKTtcbiAgbWludXRlID0gKyhtYXRjaFs1XSk7XG4gIHNlY29uZCA9ICsobWF0Y2hbNl0pO1xuXG4gIGlmIChtYXRjaFs3XSkge1xuICAgIGZyYWN0aW9uID0gbWF0Y2hbN10uc2xpY2UoMCwgMyk7XG4gICAgd2hpbGUgKGZyYWN0aW9uLmxlbmd0aCA8IDMpIHsgLy8gbWlsbGktc2Vjb25kc1xuICAgICAgZnJhY3Rpb24gKz0gJzAnO1xuICAgIH1cbiAgICBmcmFjdGlvbiA9ICtmcmFjdGlvbjtcbiAgfVxuXG4gIC8vIG1hdGNoOiBbOF0gdHogWzldIHR6X3NpZ24gWzEwXSB0el9ob3VyIFsxMV0gdHpfbWludXRlXG5cbiAgaWYgKG1hdGNoWzldKSB7XG4gICAgdHpfaG91ciA9ICsobWF0Y2hbMTBdKTtcbiAgICB0el9taW51dGUgPSArKG1hdGNoWzExXSB8fCAwKTtcbiAgICBkZWx0YSA9ICh0el9ob3VyICogNjAgKyB0el9taW51dGUpICogNjAwMDA7IC8vIGRlbHRhIGluIG1pbGktc2Vjb25kc1xuICAgIGlmICgnLScgPT09IG1hdGNoWzldKSB7XG4gICAgICBkZWx0YSA9IC1kZWx0YTtcbiAgICB9XG4gIH1cblxuICBkYXRlID0gbmV3IERhdGUoRGF0ZS5VVEMoeWVhciwgbW9udGgsIGRheSwgaG91ciwgbWludXRlLCBzZWNvbmQsIGZyYWN0aW9uKSk7XG5cbiAgaWYgKGRlbHRhKSB7XG4gICAgZGF0ZS5zZXRUaW1lKGRhdGUuZ2V0VGltZSgpIC0gZGVsdGEpO1xuICB9XG5cbiAgcmV0dXJuIGRhdGU7XG59XG5cbmZ1bmN0aW9uIHJlcHJlc2VudFlhbWxUaW1lc3RhbXAob2JqZWN0IC8qLCBzdHlsZSovKSB7XG4gIHJldHVybiBvYmplY3QudG9JU09TdHJpbmcoKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBuZXcgVHlwZSgndGFnOnlhbWwub3JnLDIwMDI6dGltZXN0YW1wJywge1xuICBraW5kOiAnc2NhbGFyJyxcbiAgcmVzb2x2ZTogcmVzb2x2ZVlhbWxUaW1lc3RhbXAsXG4gIGNvbnN0cnVjdDogY29uc3RydWN0WWFtbFRpbWVzdGFtcCxcbiAgaW5zdGFuY2VPZjogRGF0ZSxcbiAgcmVwcmVzZW50OiByZXByZXNlbnRZYW1sVGltZXN0YW1wXG59KTtcbiIsIi8qXG4gIENvcHlyaWdodCAoQykgMjAxMyBBcml5YSBIaWRheWF0IDxhcml5YS5oaWRheWF0QGdtYWlsLmNvbT5cbiAgQ29weXJpZ2h0IChDKSAyMDEzIFRoYWRkZWUgVHlsIDx0aGFkZGVlLnR5bEBnbWFpbC5jb20+XG4gIENvcHlyaWdodCAoQykgMjAxMyBNYXRoaWFzIEJ5bmVucyA8bWF0aGlhc0BxaXdpLmJlPlxuICBDb3B5cmlnaHQgKEMpIDIwMTIgQXJpeWEgSGlkYXlhdCA8YXJpeWEuaGlkYXlhdEBnbWFpbC5jb20+XG4gIENvcHlyaWdodCAoQykgMjAxMiBNYXRoaWFzIEJ5bmVucyA8bWF0aGlhc0BxaXdpLmJlPlxuICBDb3B5cmlnaHQgKEMpIDIwMTIgSm9vc3QtV2ltIEJvZWtlc3RlaWpuIDxqb29zdC13aW1AYm9la2VzdGVpam4ubmw+XG4gIENvcHlyaWdodCAoQykgMjAxMiBLcmlzIEtvd2FsIDxrcmlzLmtvd2FsQGNpeGFyLmNvbT5cbiAgQ29weXJpZ2h0IChDKSAyMDEyIFl1c3VrZSBTdXp1a2kgPHV0YXRhbmUudGVhQGdtYWlsLmNvbT5cbiAgQ29weXJpZ2h0IChDKSAyMDEyIEFycGFkIEJvcnNvcyA8YXJwYWQuYm9yc29zQGdvb2dsZW1haWwuY29tPlxuICBDb3B5cmlnaHQgKEMpIDIwMTEgQXJpeWEgSGlkYXlhdCA8YXJpeWEuaGlkYXlhdEBnbWFpbC5jb20+XG5cbiAgUmVkaXN0cmlidXRpb24gYW5kIHVzZSBpbiBzb3VyY2UgYW5kIGJpbmFyeSBmb3Jtcywgd2l0aCBvciB3aXRob3V0XG4gIG1vZGlmaWNhdGlvbiwgYXJlIHBlcm1pdHRlZCBwcm92aWRlZCB0aGF0IHRoZSBmb2xsb3dpbmcgY29uZGl0aW9ucyBhcmUgbWV0OlxuXG4gICAgKiBSZWRpc3RyaWJ1dGlvbnMgb2Ygc291cmNlIGNvZGUgbXVzdCByZXRhaW4gdGhlIGFib3ZlIGNvcHlyaWdodFxuICAgICAgbm90aWNlLCB0aGlzIGxpc3Qgb2YgY29uZGl0aW9ucyBhbmQgdGhlIGZvbGxvd2luZyBkaXNjbGFpbWVyLlxuICAgICogUmVkaXN0cmlidXRpb25zIGluIGJpbmFyeSBmb3JtIG11c3QgcmVwcm9kdWNlIHRoZSBhYm92ZSBjb3B5cmlnaHRcbiAgICAgIG5vdGljZSwgdGhpcyBsaXN0IG9mIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmcgZGlzY2xhaW1lciBpbiB0aGVcbiAgICAgIGRvY3VtZW50YXRpb24gYW5kL29yIG90aGVyIG1hdGVyaWFscyBwcm92aWRlZCB3aXRoIHRoZSBkaXN0cmlidXRpb24uXG5cbiAgVEhJUyBTT0ZUV0FSRSBJUyBQUk9WSURFRCBCWSBUSEUgQ09QWVJJR0hUIEhPTERFUlMgQU5EIENPTlRSSUJVVE9SUyBcIkFTIElTXCJcbiAgQU5EIEFOWSBFWFBSRVNTIE9SIElNUExJRUQgV0FSUkFOVElFUywgSU5DTFVESU5HLCBCVVQgTk9UIExJTUlURUQgVE8sIFRIRVxuICBJTVBMSUVEIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZIEFORCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRVxuICBBUkUgRElTQ0xBSU1FRC4gSU4gTk8gRVZFTlQgU0hBTEwgPENPUFlSSUdIVCBIT0xERVI+IEJFIExJQUJMRSBGT1IgQU5ZXG4gIERJUkVDVCwgSU5ESVJFQ1QsIElOQ0lERU5UQUwsIFNQRUNJQUwsIEVYRU1QTEFSWSwgT1IgQ09OU0VRVUVOVElBTCBEQU1BR0VTXG4gIChJTkNMVURJTkcsIEJVVCBOT1QgTElNSVRFRCBUTywgUFJPQ1VSRU1FTlQgT0YgU1VCU1RJVFVURSBHT09EUyBPUiBTRVJWSUNFUztcbiAgTE9TUyBPRiBVU0UsIERBVEEsIE9SIFBST0ZJVFM7IE9SIEJVU0lORVNTIElOVEVSUlVQVElPTikgSE9XRVZFUiBDQVVTRUQgQU5EXG4gIE9OIEFOWSBUSEVPUlkgT0YgTElBQklMSVRZLCBXSEVUSEVSIElOIENPTlRSQUNULCBTVFJJQ1QgTElBQklMSVRZLCBPUiBUT1JUXG4gIChJTkNMVURJTkcgTkVHTElHRU5DRSBPUiBPVEhFUldJU0UpIEFSSVNJTkcgSU4gQU5ZIFdBWSBPVVQgT0YgVEhFIFVTRSBPRlxuICBUSElTIFNPRlRXQVJFLCBFVkVOIElGIEFEVklTRUQgT0YgVEhFIFBPU1NJQklMSVRZIE9GIFNVQ0ggREFNQUdFLlxuKi9cblxuKGZ1bmN0aW9uIChyb290LCBmYWN0b3J5KSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgLy8gVW5pdmVyc2FsIE1vZHVsZSBEZWZpbml0aW9uIChVTUQpIHRvIHN1cHBvcnQgQU1ELCBDb21tb25KUy9Ob2RlLmpzLFxuICAgIC8vIFJoaW5vLCBhbmQgcGxhaW4gYnJvd3NlciBsb2FkaW5nLlxuXG4gICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAgIGRlZmluZShbJ2V4cG9ydHMnXSwgZmFjdG9yeSk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgZmFjdG9yeShleHBvcnRzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBmYWN0b3J5KChyb290LmVzcHJpbWEgPSB7fSkpO1xuICAgIH1cbn0odGhpcywgZnVuY3Rpb24gKGV4cG9ydHMpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICB2YXIgVG9rZW4sXG4gICAgICAgIFRva2VuTmFtZSxcbiAgICAgICAgRm5FeHByVG9rZW5zLFxuICAgICAgICBTeW50YXgsXG4gICAgICAgIFBsYWNlSG9sZGVycyxcbiAgICAgICAgTWVzc2FnZXMsXG4gICAgICAgIFJlZ2V4LFxuICAgICAgICBzb3VyY2UsXG4gICAgICAgIHN0cmljdCxcbiAgICAgICAgc291cmNlVHlwZSxcbiAgICAgICAgaW5kZXgsXG4gICAgICAgIGxpbmVOdW1iZXIsXG4gICAgICAgIGxpbmVTdGFydCxcbiAgICAgICAgaGFzTGluZVRlcm1pbmF0b3IsXG4gICAgICAgIGxhc3RJbmRleCxcbiAgICAgICAgbGFzdExpbmVOdW1iZXIsXG4gICAgICAgIGxhc3RMaW5lU3RhcnQsXG4gICAgICAgIHN0YXJ0SW5kZXgsXG4gICAgICAgIHN0YXJ0TGluZU51bWJlcixcbiAgICAgICAgc3RhcnRMaW5lU3RhcnQsXG4gICAgICAgIHNjYW5uaW5nLFxuICAgICAgICBsZW5ndGgsXG4gICAgICAgIGxvb2thaGVhZCxcbiAgICAgICAgc3RhdGUsXG4gICAgICAgIGV4dHJhLFxuICAgICAgICBpc0JpbmRpbmdFbGVtZW50LFxuICAgICAgICBpc0Fzc2lnbm1lbnRUYXJnZXQsXG4gICAgICAgIGZpcnN0Q292ZXJJbml0aWFsaXplZE5hbWVFcnJvcjtcblxuICAgIFRva2VuID0ge1xuICAgICAgICBCb29sZWFuTGl0ZXJhbDogMSxcbiAgICAgICAgRU9GOiAyLFxuICAgICAgICBJZGVudGlmaWVyOiAzLFxuICAgICAgICBLZXl3b3JkOiA0LFxuICAgICAgICBOdWxsTGl0ZXJhbDogNSxcbiAgICAgICAgTnVtZXJpY0xpdGVyYWw6IDYsXG4gICAgICAgIFB1bmN0dWF0b3I6IDcsXG4gICAgICAgIFN0cmluZ0xpdGVyYWw6IDgsXG4gICAgICAgIFJlZ3VsYXJFeHByZXNzaW9uOiA5LFxuICAgICAgICBUZW1wbGF0ZTogMTBcbiAgICB9O1xuXG4gICAgVG9rZW5OYW1lID0ge307XG4gICAgVG9rZW5OYW1lW1Rva2VuLkJvb2xlYW5MaXRlcmFsXSA9ICdCb29sZWFuJztcbiAgICBUb2tlbk5hbWVbVG9rZW4uRU9GXSA9ICc8ZW5kPic7XG4gICAgVG9rZW5OYW1lW1Rva2VuLklkZW50aWZpZXJdID0gJ0lkZW50aWZpZXInO1xuICAgIFRva2VuTmFtZVtUb2tlbi5LZXl3b3JkXSA9ICdLZXl3b3JkJztcbiAgICBUb2tlbk5hbWVbVG9rZW4uTnVsbExpdGVyYWxdID0gJ051bGwnO1xuICAgIFRva2VuTmFtZVtUb2tlbi5OdW1lcmljTGl0ZXJhbF0gPSAnTnVtZXJpYyc7XG4gICAgVG9rZW5OYW1lW1Rva2VuLlB1bmN0dWF0b3JdID0gJ1B1bmN0dWF0b3InO1xuICAgIFRva2VuTmFtZVtUb2tlbi5TdHJpbmdMaXRlcmFsXSA9ICdTdHJpbmcnO1xuICAgIFRva2VuTmFtZVtUb2tlbi5SZWd1bGFyRXhwcmVzc2lvbl0gPSAnUmVndWxhckV4cHJlc3Npb24nO1xuICAgIFRva2VuTmFtZVtUb2tlbi5UZW1wbGF0ZV0gPSAnVGVtcGxhdGUnO1xuXG4gICAgLy8gQSBmdW5jdGlvbiBmb2xsb3dpbmcgb25lIG9mIHRob3NlIHRva2VucyBpcyBhbiBleHByZXNzaW9uLlxuICAgIEZuRXhwclRva2VucyA9IFsnKCcsICd7JywgJ1snLCAnaW4nLCAndHlwZW9mJywgJ2luc3RhbmNlb2YnLCAnbmV3JyxcbiAgICAgICAgICAgICAgICAgICAgJ3JldHVybicsICdjYXNlJywgJ2RlbGV0ZScsICd0aHJvdycsICd2b2lkJyxcbiAgICAgICAgICAgICAgICAgICAgLy8gYXNzaWdubWVudCBvcGVyYXRvcnNcbiAgICAgICAgICAgICAgICAgICAgJz0nLCAnKz0nLCAnLT0nLCAnKj0nLCAnLz0nLCAnJT0nLCAnPDw9JywgJz4+PScsICc+Pj49JyxcbiAgICAgICAgICAgICAgICAgICAgJyY9JywgJ3w9JywgJ149JywgJywnLFxuICAgICAgICAgICAgICAgICAgICAvLyBiaW5hcnkvdW5hcnkgb3BlcmF0b3JzXG4gICAgICAgICAgICAgICAgICAgICcrJywgJy0nLCAnKicsICcvJywgJyUnLCAnKysnLCAnLS0nLCAnPDwnLCAnPj4nLCAnPj4+JywgJyYnLFxuICAgICAgICAgICAgICAgICAgICAnfCcsICdeJywgJyEnLCAnficsICcmJicsICd8fCcsICc/JywgJzonLCAnPT09JywgJz09JywgJz49JyxcbiAgICAgICAgICAgICAgICAgICAgJzw9JywgJzwnLCAnPicsICchPScsICchPT0nXTtcblxuICAgIFN5bnRheCA9IHtcbiAgICAgICAgQXNzaWdubWVudEV4cHJlc3Npb246ICdBc3NpZ25tZW50RXhwcmVzc2lvbicsXG4gICAgICAgIEFzc2lnbm1lbnRQYXR0ZXJuOiAnQXNzaWdubWVudFBhdHRlcm4nLFxuICAgICAgICBBcnJheUV4cHJlc3Npb246ICdBcnJheUV4cHJlc3Npb24nLFxuICAgICAgICBBcnJheVBhdHRlcm46ICdBcnJheVBhdHRlcm4nLFxuICAgICAgICBBcnJvd0Z1bmN0aW9uRXhwcmVzc2lvbjogJ0Fycm93RnVuY3Rpb25FeHByZXNzaW9uJyxcbiAgICAgICAgQmxvY2tTdGF0ZW1lbnQ6ICdCbG9ja1N0YXRlbWVudCcsXG4gICAgICAgIEJpbmFyeUV4cHJlc3Npb246ICdCaW5hcnlFeHByZXNzaW9uJyxcbiAgICAgICAgQnJlYWtTdGF0ZW1lbnQ6ICdCcmVha1N0YXRlbWVudCcsXG4gICAgICAgIENhbGxFeHByZXNzaW9uOiAnQ2FsbEV4cHJlc3Npb24nLFxuICAgICAgICBDYXRjaENsYXVzZTogJ0NhdGNoQ2xhdXNlJyxcbiAgICAgICAgQ2xhc3NCb2R5OiAnQ2xhc3NCb2R5JyxcbiAgICAgICAgQ2xhc3NEZWNsYXJhdGlvbjogJ0NsYXNzRGVjbGFyYXRpb24nLFxuICAgICAgICBDbGFzc0V4cHJlc3Npb246ICdDbGFzc0V4cHJlc3Npb24nLFxuICAgICAgICBDb25kaXRpb25hbEV4cHJlc3Npb246ICdDb25kaXRpb25hbEV4cHJlc3Npb24nLFxuICAgICAgICBDb250aW51ZVN0YXRlbWVudDogJ0NvbnRpbnVlU3RhdGVtZW50JyxcbiAgICAgICAgRG9XaGlsZVN0YXRlbWVudDogJ0RvV2hpbGVTdGF0ZW1lbnQnLFxuICAgICAgICBEZWJ1Z2dlclN0YXRlbWVudDogJ0RlYnVnZ2VyU3RhdGVtZW50JyxcbiAgICAgICAgRW1wdHlTdGF0ZW1lbnQ6ICdFbXB0eVN0YXRlbWVudCcsXG4gICAgICAgIEV4cG9ydEFsbERlY2xhcmF0aW9uOiAnRXhwb3J0QWxsRGVjbGFyYXRpb24nLFxuICAgICAgICBFeHBvcnREZWZhdWx0RGVjbGFyYXRpb246ICdFeHBvcnREZWZhdWx0RGVjbGFyYXRpb24nLFxuICAgICAgICBFeHBvcnROYW1lZERlY2xhcmF0aW9uOiAnRXhwb3J0TmFtZWREZWNsYXJhdGlvbicsXG4gICAgICAgIEV4cG9ydFNwZWNpZmllcjogJ0V4cG9ydFNwZWNpZmllcicsXG4gICAgICAgIEV4cHJlc3Npb25TdGF0ZW1lbnQ6ICdFeHByZXNzaW9uU3RhdGVtZW50JyxcbiAgICAgICAgRm9yU3RhdGVtZW50OiAnRm9yU3RhdGVtZW50JyxcbiAgICAgICAgRm9ySW5TdGF0ZW1lbnQ6ICdGb3JJblN0YXRlbWVudCcsXG4gICAgICAgIEZ1bmN0aW9uRGVjbGFyYXRpb246ICdGdW5jdGlvbkRlY2xhcmF0aW9uJyxcbiAgICAgICAgRnVuY3Rpb25FeHByZXNzaW9uOiAnRnVuY3Rpb25FeHByZXNzaW9uJyxcbiAgICAgICAgSWRlbnRpZmllcjogJ0lkZW50aWZpZXInLFxuICAgICAgICBJZlN0YXRlbWVudDogJ0lmU3RhdGVtZW50JyxcbiAgICAgICAgSW1wb3J0RGVjbGFyYXRpb246ICdJbXBvcnREZWNsYXJhdGlvbicsXG4gICAgICAgIEltcG9ydERlZmF1bHRTcGVjaWZpZXI6ICdJbXBvcnREZWZhdWx0U3BlY2lmaWVyJyxcbiAgICAgICAgSW1wb3J0TmFtZXNwYWNlU3BlY2lmaWVyOiAnSW1wb3J0TmFtZXNwYWNlU3BlY2lmaWVyJyxcbiAgICAgICAgSW1wb3J0U3BlY2lmaWVyOiAnSW1wb3J0U3BlY2lmaWVyJyxcbiAgICAgICAgTGl0ZXJhbDogJ0xpdGVyYWwnLFxuICAgICAgICBMYWJlbGVkU3RhdGVtZW50OiAnTGFiZWxlZFN0YXRlbWVudCcsXG4gICAgICAgIExvZ2ljYWxFeHByZXNzaW9uOiAnTG9naWNhbEV4cHJlc3Npb24nLFxuICAgICAgICBNZW1iZXJFeHByZXNzaW9uOiAnTWVtYmVyRXhwcmVzc2lvbicsXG4gICAgICAgIE1ldGhvZERlZmluaXRpb246ICdNZXRob2REZWZpbml0aW9uJyxcbiAgICAgICAgTmV3RXhwcmVzc2lvbjogJ05ld0V4cHJlc3Npb24nLFxuICAgICAgICBPYmplY3RFeHByZXNzaW9uOiAnT2JqZWN0RXhwcmVzc2lvbicsXG4gICAgICAgIE9iamVjdFBhdHRlcm46ICdPYmplY3RQYXR0ZXJuJyxcbiAgICAgICAgUHJvZ3JhbTogJ1Byb2dyYW0nLFxuICAgICAgICBQcm9wZXJ0eTogJ1Byb3BlcnR5JyxcbiAgICAgICAgUmVzdEVsZW1lbnQ6ICdSZXN0RWxlbWVudCcsXG4gICAgICAgIFJldHVyblN0YXRlbWVudDogJ1JldHVyblN0YXRlbWVudCcsXG4gICAgICAgIFNlcXVlbmNlRXhwcmVzc2lvbjogJ1NlcXVlbmNlRXhwcmVzc2lvbicsXG4gICAgICAgIFNwcmVhZEVsZW1lbnQ6ICdTcHJlYWRFbGVtZW50JyxcbiAgICAgICAgU3VwZXI6ICdTdXBlcicsXG4gICAgICAgIFN3aXRjaENhc2U6ICdTd2l0Y2hDYXNlJyxcbiAgICAgICAgU3dpdGNoU3RhdGVtZW50OiAnU3dpdGNoU3RhdGVtZW50JyxcbiAgICAgICAgVGFnZ2VkVGVtcGxhdGVFeHByZXNzaW9uOiAnVGFnZ2VkVGVtcGxhdGVFeHByZXNzaW9uJyxcbiAgICAgICAgVGVtcGxhdGVFbGVtZW50OiAnVGVtcGxhdGVFbGVtZW50JyxcbiAgICAgICAgVGVtcGxhdGVMaXRlcmFsOiAnVGVtcGxhdGVMaXRlcmFsJyxcbiAgICAgICAgVGhpc0V4cHJlc3Npb246ICdUaGlzRXhwcmVzc2lvbicsXG4gICAgICAgIFRocm93U3RhdGVtZW50OiAnVGhyb3dTdGF0ZW1lbnQnLFxuICAgICAgICBUcnlTdGF0ZW1lbnQ6ICdUcnlTdGF0ZW1lbnQnLFxuICAgICAgICBVbmFyeUV4cHJlc3Npb246ICdVbmFyeUV4cHJlc3Npb24nLFxuICAgICAgICBVcGRhdGVFeHByZXNzaW9uOiAnVXBkYXRlRXhwcmVzc2lvbicsXG4gICAgICAgIFZhcmlhYmxlRGVjbGFyYXRpb246ICdWYXJpYWJsZURlY2xhcmF0aW9uJyxcbiAgICAgICAgVmFyaWFibGVEZWNsYXJhdG9yOiAnVmFyaWFibGVEZWNsYXJhdG9yJyxcbiAgICAgICAgV2hpbGVTdGF0ZW1lbnQ6ICdXaGlsZVN0YXRlbWVudCcsXG4gICAgICAgIFdpdGhTdGF0ZW1lbnQ6ICdXaXRoU3RhdGVtZW50J1xuICAgIH07XG5cbiAgICBQbGFjZUhvbGRlcnMgPSB7XG4gICAgICAgIEFycm93UGFyYW1ldGVyUGxhY2VIb2xkZXI6ICdBcnJvd1BhcmFtZXRlclBsYWNlSG9sZGVyJ1xuICAgIH07XG5cbiAgICAvLyBFcnJvciBtZXNzYWdlcyBzaG91bGQgYmUgaWRlbnRpY2FsIHRvIFY4LlxuICAgIE1lc3NhZ2VzID0ge1xuICAgICAgICBVbmV4cGVjdGVkVG9rZW46ICdVbmV4cGVjdGVkIHRva2VuICUwJyxcbiAgICAgICAgVW5leHBlY3RlZE51bWJlcjogJ1VuZXhwZWN0ZWQgbnVtYmVyJyxcbiAgICAgICAgVW5leHBlY3RlZFN0cmluZzogJ1VuZXhwZWN0ZWQgc3RyaW5nJyxcbiAgICAgICAgVW5leHBlY3RlZElkZW50aWZpZXI6ICdVbmV4cGVjdGVkIGlkZW50aWZpZXInLFxuICAgICAgICBVbmV4cGVjdGVkUmVzZXJ2ZWQ6ICdVbmV4cGVjdGVkIHJlc2VydmVkIHdvcmQnLFxuICAgICAgICBVbmV4cGVjdGVkVGVtcGxhdGU6ICdVbmV4cGVjdGVkIHF1YXNpICUwJyxcbiAgICAgICAgVW5leHBlY3RlZEVPUzogJ1VuZXhwZWN0ZWQgZW5kIG9mIGlucHV0JyxcbiAgICAgICAgTmV3bGluZUFmdGVyVGhyb3c6ICdJbGxlZ2FsIG5ld2xpbmUgYWZ0ZXIgdGhyb3cnLFxuICAgICAgICBJbnZhbGlkUmVnRXhwOiAnSW52YWxpZCByZWd1bGFyIGV4cHJlc3Npb24nLFxuICAgICAgICBVbnRlcm1pbmF0ZWRSZWdFeHA6ICdJbnZhbGlkIHJlZ3VsYXIgZXhwcmVzc2lvbjogbWlzc2luZyAvJyxcbiAgICAgICAgSW52YWxpZExIU0luQXNzaWdubWVudDogJ0ludmFsaWQgbGVmdC1oYW5kIHNpZGUgaW4gYXNzaWdubWVudCcsXG4gICAgICAgIEludmFsaWRMSFNJbkZvckluOiAnSW52YWxpZCBsZWZ0LWhhbmQgc2lkZSBpbiBmb3ItaW4nLFxuICAgICAgICBNdWx0aXBsZURlZmF1bHRzSW5Td2l0Y2g6ICdNb3JlIHRoYW4gb25lIGRlZmF1bHQgY2xhdXNlIGluIHN3aXRjaCBzdGF0ZW1lbnQnLFxuICAgICAgICBOb0NhdGNoT3JGaW5hbGx5OiAnTWlzc2luZyBjYXRjaCBvciBmaW5hbGx5IGFmdGVyIHRyeScsXG4gICAgICAgIFVua25vd25MYWJlbDogJ1VuZGVmaW5lZCBsYWJlbCBcXCclMFxcJycsXG4gICAgICAgIFJlZGVjbGFyYXRpb246ICclMCBcXCclMVxcJyBoYXMgYWxyZWFkeSBiZWVuIGRlY2xhcmVkJyxcbiAgICAgICAgSWxsZWdhbENvbnRpbnVlOiAnSWxsZWdhbCBjb250aW51ZSBzdGF0ZW1lbnQnLFxuICAgICAgICBJbGxlZ2FsQnJlYWs6ICdJbGxlZ2FsIGJyZWFrIHN0YXRlbWVudCcsXG4gICAgICAgIElsbGVnYWxSZXR1cm46ICdJbGxlZ2FsIHJldHVybiBzdGF0ZW1lbnQnLFxuICAgICAgICBTdHJpY3RNb2RlV2l0aDogJ1N0cmljdCBtb2RlIGNvZGUgbWF5IG5vdCBpbmNsdWRlIGEgd2l0aCBzdGF0ZW1lbnQnLFxuICAgICAgICBTdHJpY3RDYXRjaFZhcmlhYmxlOiAnQ2F0Y2ggdmFyaWFibGUgbWF5IG5vdCBiZSBldmFsIG9yIGFyZ3VtZW50cyBpbiBzdHJpY3QgbW9kZScsXG4gICAgICAgIFN0cmljdFZhck5hbWU6ICdWYXJpYWJsZSBuYW1lIG1heSBub3QgYmUgZXZhbCBvciBhcmd1bWVudHMgaW4gc3RyaWN0IG1vZGUnLFxuICAgICAgICBTdHJpY3RQYXJhbU5hbWU6ICdQYXJhbWV0ZXIgbmFtZSBldmFsIG9yIGFyZ3VtZW50cyBpcyBub3QgYWxsb3dlZCBpbiBzdHJpY3QgbW9kZScsXG4gICAgICAgIFN0cmljdFBhcmFtRHVwZTogJ1N0cmljdCBtb2RlIGZ1bmN0aW9uIG1heSBub3QgaGF2ZSBkdXBsaWNhdGUgcGFyYW1ldGVyIG5hbWVzJyxcbiAgICAgICAgU3RyaWN0RnVuY3Rpb25OYW1lOiAnRnVuY3Rpb24gbmFtZSBtYXkgbm90IGJlIGV2YWwgb3IgYXJndW1lbnRzIGluIHN0cmljdCBtb2RlJyxcbiAgICAgICAgU3RyaWN0T2N0YWxMaXRlcmFsOiAnT2N0YWwgbGl0ZXJhbHMgYXJlIG5vdCBhbGxvd2VkIGluIHN0cmljdCBtb2RlLicsXG4gICAgICAgIFN0cmljdERlbGV0ZTogJ0RlbGV0ZSBvZiBhbiB1bnF1YWxpZmllZCBpZGVudGlmaWVyIGluIHN0cmljdCBtb2RlLicsXG4gICAgICAgIFN0cmljdExIU0Fzc2lnbm1lbnQ6ICdBc3NpZ25tZW50IHRvIGV2YWwgb3IgYXJndW1lbnRzIGlzIG5vdCBhbGxvd2VkIGluIHN0cmljdCBtb2RlJyxcbiAgICAgICAgU3RyaWN0TEhTUG9zdGZpeDogJ1Bvc3RmaXggaW5jcmVtZW50L2RlY3JlbWVudCBtYXkgbm90IGhhdmUgZXZhbCBvciBhcmd1bWVudHMgb3BlcmFuZCBpbiBzdHJpY3QgbW9kZScsXG4gICAgICAgIFN0cmljdExIU1ByZWZpeDogJ1ByZWZpeCBpbmNyZW1lbnQvZGVjcmVtZW50IG1heSBub3QgaGF2ZSBldmFsIG9yIGFyZ3VtZW50cyBvcGVyYW5kIGluIHN0cmljdCBtb2RlJyxcbiAgICAgICAgU3RyaWN0UmVzZXJ2ZWRXb3JkOiAnVXNlIG9mIGZ1dHVyZSByZXNlcnZlZCB3b3JkIGluIHN0cmljdCBtb2RlJyxcbiAgICAgICAgVGVtcGxhdGVPY3RhbExpdGVyYWw6ICdPY3RhbCBsaXRlcmFscyBhcmUgbm90IGFsbG93ZWQgaW4gdGVtcGxhdGUgc3RyaW5ncy4nLFxuICAgICAgICBQYXJhbWV0ZXJBZnRlclJlc3RQYXJhbWV0ZXI6ICdSZXN0IHBhcmFtZXRlciBtdXN0IGJlIGxhc3QgZm9ybWFsIHBhcmFtZXRlcicsXG4gICAgICAgIERlZmF1bHRSZXN0UGFyYW1ldGVyOiAnVW5leHBlY3RlZCB0b2tlbiA9JyxcbiAgICAgICAgT2JqZWN0UGF0dGVybkFzUmVzdFBhcmFtZXRlcjogJ1VuZXhwZWN0ZWQgdG9rZW4geycsXG4gICAgICAgIER1cGxpY2F0ZVByb3RvUHJvcGVydHk6ICdEdXBsaWNhdGUgX19wcm90b19fIGZpZWxkcyBhcmUgbm90IGFsbG93ZWQgaW4gb2JqZWN0IGxpdGVyYWxzJyxcbiAgICAgICAgQ29uc3RydWN0b3JTcGVjaWFsTWV0aG9kOiAnQ2xhc3MgY29uc3RydWN0b3IgbWF5IG5vdCBiZSBhbiBhY2Nlc3NvcicsXG4gICAgICAgIER1cGxpY2F0ZUNvbnN0cnVjdG9yOiAnQSBjbGFzcyBtYXkgb25seSBoYXZlIG9uZSBjb25zdHJ1Y3RvcicsXG4gICAgICAgIFN0YXRpY1Byb3RvdHlwZTogJ0NsYXNzZXMgbWF5IG5vdCBoYXZlIHN0YXRpYyBwcm9wZXJ0eSBuYW1lZCBwcm90b3R5cGUnLFxuICAgICAgICBNaXNzaW5nRnJvbUNsYXVzZTogJ1VuZXhwZWN0ZWQgdG9rZW4nLFxuICAgICAgICBOb0FzQWZ0ZXJJbXBvcnROYW1lc3BhY2U6ICdVbmV4cGVjdGVkIHRva2VuJyxcbiAgICAgICAgSW52YWxpZE1vZHVsZVNwZWNpZmllcjogJ1VuZXhwZWN0ZWQgdG9rZW4nLFxuICAgICAgICBJbGxlZ2FsSW1wb3J0RGVjbGFyYXRpb246ICdVbmV4cGVjdGVkIHRva2VuJyxcbiAgICAgICAgSWxsZWdhbEV4cG9ydERlY2xhcmF0aW9uOiAnVW5leHBlY3RlZCB0b2tlbidcbiAgICB9O1xuXG4gICAgLy8gU2VlIGFsc28gdG9vbHMvZ2VuZXJhdGUtdW5pY29kZS1yZWdleC5weS5cbiAgICBSZWdleCA9IHtcbiAgICAgICAgTm9uQXNjaWlJZGVudGlmaWVyU3RhcnQ6IG5ldyBSZWdFeHAoJ1tcXHhBQVxceEI1XFx4QkFcXHhDMC1cXHhENlxceEQ4LVxceEY2XFx4RjgtXFx1MDJDMVxcdTAyQzYtXFx1MDJEMVxcdTAyRTAtXFx1MDJFNFxcdTAyRUNcXHUwMkVFXFx1MDM3MC1cXHUwMzc0XFx1MDM3NlxcdTAzNzdcXHUwMzdBLVxcdTAzN0RcXHUwMzdGXFx1MDM4NlxcdTAzODgtXFx1MDM4QVxcdTAzOENcXHUwMzhFLVxcdTAzQTFcXHUwM0EzLVxcdTAzRjVcXHUwM0Y3LVxcdTA0ODFcXHUwNDhBLVxcdTA1MkZcXHUwNTMxLVxcdTA1NTZcXHUwNTU5XFx1MDU2MS1cXHUwNTg3XFx1MDVEMC1cXHUwNUVBXFx1MDVGMC1cXHUwNUYyXFx1MDYyMC1cXHUwNjRBXFx1MDY2RVxcdTA2NkZcXHUwNjcxLVxcdTA2RDNcXHUwNkQ1XFx1MDZFNVxcdTA2RTZcXHUwNkVFXFx1MDZFRlxcdTA2RkEtXFx1MDZGQ1xcdTA2RkZcXHUwNzEwXFx1MDcxMi1cXHUwNzJGXFx1MDc0RC1cXHUwN0E1XFx1MDdCMVxcdTA3Q0EtXFx1MDdFQVxcdTA3RjRcXHUwN0Y1XFx1MDdGQVxcdTA4MDAtXFx1MDgxNVxcdTA4MUFcXHUwODI0XFx1MDgyOFxcdTA4NDAtXFx1MDg1OFxcdTA4QTAtXFx1MDhCMlxcdTA5MDQtXFx1MDkzOVxcdTA5M0RcXHUwOTUwXFx1MDk1OC1cXHUwOTYxXFx1MDk3MS1cXHUwOTgwXFx1MDk4NS1cXHUwOThDXFx1MDk4RlxcdTA5OTBcXHUwOTkzLVxcdTA5QThcXHUwOUFBLVxcdTA5QjBcXHUwOUIyXFx1MDlCNi1cXHUwOUI5XFx1MDlCRFxcdTA5Q0VcXHUwOURDXFx1MDlERFxcdTA5REYtXFx1MDlFMVxcdTA5RjBcXHUwOUYxXFx1MEEwNS1cXHUwQTBBXFx1MEEwRlxcdTBBMTBcXHUwQTEzLVxcdTBBMjhcXHUwQTJBLVxcdTBBMzBcXHUwQTMyXFx1MEEzM1xcdTBBMzVcXHUwQTM2XFx1MEEzOFxcdTBBMzlcXHUwQTU5LVxcdTBBNUNcXHUwQTVFXFx1MEE3Mi1cXHUwQTc0XFx1MEE4NS1cXHUwQThEXFx1MEE4Ri1cXHUwQTkxXFx1MEE5My1cXHUwQUE4XFx1MEFBQS1cXHUwQUIwXFx1MEFCMlxcdTBBQjNcXHUwQUI1LVxcdTBBQjlcXHUwQUJEXFx1MEFEMFxcdTBBRTBcXHUwQUUxXFx1MEIwNS1cXHUwQjBDXFx1MEIwRlxcdTBCMTBcXHUwQjEzLVxcdTBCMjhcXHUwQjJBLVxcdTBCMzBcXHUwQjMyXFx1MEIzM1xcdTBCMzUtXFx1MEIzOVxcdTBCM0RcXHUwQjVDXFx1MEI1RFxcdTBCNUYtXFx1MEI2MVxcdTBCNzFcXHUwQjgzXFx1MEI4NS1cXHUwQjhBXFx1MEI4RS1cXHUwQjkwXFx1MEI5Mi1cXHUwQjk1XFx1MEI5OVxcdTBCOUFcXHUwQjlDXFx1MEI5RVxcdTBCOUZcXHUwQkEzXFx1MEJBNFxcdTBCQTgtXFx1MEJBQVxcdTBCQUUtXFx1MEJCOVxcdTBCRDBcXHUwQzA1LVxcdTBDMENcXHUwQzBFLVxcdTBDMTBcXHUwQzEyLVxcdTBDMjhcXHUwQzJBLVxcdTBDMzlcXHUwQzNEXFx1MEM1OFxcdTBDNTlcXHUwQzYwXFx1MEM2MVxcdTBDODUtXFx1MEM4Q1xcdTBDOEUtXFx1MEM5MFxcdTBDOTItXFx1MENBOFxcdTBDQUEtXFx1MENCM1xcdTBDQjUtXFx1MENCOVxcdTBDQkRcXHUwQ0RFXFx1MENFMFxcdTBDRTFcXHUwQ0YxXFx1MENGMlxcdTBEMDUtXFx1MEQwQ1xcdTBEMEUtXFx1MEQxMFxcdTBEMTItXFx1MEQzQVxcdTBEM0RcXHUwRDRFXFx1MEQ2MFxcdTBENjFcXHUwRDdBLVxcdTBEN0ZcXHUwRDg1LVxcdTBEOTZcXHUwRDlBLVxcdTBEQjFcXHUwREIzLVxcdTBEQkJcXHUwREJEXFx1MERDMC1cXHUwREM2XFx1MEUwMS1cXHUwRTMwXFx1MEUzMlxcdTBFMzNcXHUwRTQwLVxcdTBFNDZcXHUwRTgxXFx1MEU4MlxcdTBFODRcXHUwRTg3XFx1MEU4OFxcdTBFOEFcXHUwRThEXFx1MEU5NC1cXHUwRTk3XFx1MEU5OS1cXHUwRTlGXFx1MEVBMS1cXHUwRUEzXFx1MEVBNVxcdTBFQTdcXHUwRUFBXFx1MEVBQlxcdTBFQUQtXFx1MEVCMFxcdTBFQjJcXHUwRUIzXFx1MEVCRFxcdTBFQzAtXFx1MEVDNFxcdTBFQzZcXHUwRURDLVxcdTBFREZcXHUwRjAwXFx1MEY0MC1cXHUwRjQ3XFx1MEY0OS1cXHUwRjZDXFx1MEY4OC1cXHUwRjhDXFx1MTAwMC1cXHUxMDJBXFx1MTAzRlxcdTEwNTAtXFx1MTA1NVxcdTEwNUEtXFx1MTA1RFxcdTEwNjFcXHUxMDY1XFx1MTA2NlxcdTEwNkUtXFx1MTA3MFxcdTEwNzUtXFx1MTA4MVxcdTEwOEVcXHUxMEEwLVxcdTEwQzVcXHUxMEM3XFx1MTBDRFxcdTEwRDAtXFx1MTBGQVxcdTEwRkMtXFx1MTI0OFxcdTEyNEEtXFx1MTI0RFxcdTEyNTAtXFx1MTI1NlxcdTEyNThcXHUxMjVBLVxcdTEyNURcXHUxMjYwLVxcdTEyODhcXHUxMjhBLVxcdTEyOERcXHUxMjkwLVxcdTEyQjBcXHUxMkIyLVxcdTEyQjVcXHUxMkI4LVxcdTEyQkVcXHUxMkMwXFx1MTJDMi1cXHUxMkM1XFx1MTJDOC1cXHUxMkQ2XFx1MTJEOC1cXHUxMzEwXFx1MTMxMi1cXHUxMzE1XFx1MTMxOC1cXHUxMzVBXFx1MTM4MC1cXHUxMzhGXFx1MTNBMC1cXHUxM0Y0XFx1MTQwMS1cXHUxNjZDXFx1MTY2Ri1cXHUxNjdGXFx1MTY4MS1cXHUxNjlBXFx1MTZBMC1cXHUxNkVBXFx1MTZFRS1cXHUxNkY4XFx1MTcwMC1cXHUxNzBDXFx1MTcwRS1cXHUxNzExXFx1MTcyMC1cXHUxNzMxXFx1MTc0MC1cXHUxNzUxXFx1MTc2MC1cXHUxNzZDXFx1MTc2RS1cXHUxNzcwXFx1MTc4MC1cXHUxN0IzXFx1MTdEN1xcdTE3RENcXHUxODIwLVxcdTE4NzdcXHUxODgwLVxcdTE4QThcXHUxOEFBXFx1MThCMC1cXHUxOEY1XFx1MTkwMC1cXHUxOTFFXFx1MTk1MC1cXHUxOTZEXFx1MTk3MC1cXHUxOTc0XFx1MTk4MC1cXHUxOUFCXFx1MTlDMS1cXHUxOUM3XFx1MUEwMC1cXHUxQTE2XFx1MUEyMC1cXHUxQTU0XFx1MUFBN1xcdTFCMDUtXFx1MUIzM1xcdTFCNDUtXFx1MUI0QlxcdTFCODMtXFx1MUJBMFxcdTFCQUVcXHUxQkFGXFx1MUJCQS1cXHUxQkU1XFx1MUMwMC1cXHUxQzIzXFx1MUM0RC1cXHUxQzRGXFx1MUM1QS1cXHUxQzdEXFx1MUNFOS1cXHUxQ0VDXFx1MUNFRS1cXHUxQ0YxXFx1MUNGNVxcdTFDRjZcXHUxRDAwLVxcdTFEQkZcXHUxRTAwLVxcdTFGMTVcXHUxRjE4LVxcdTFGMURcXHUxRjIwLVxcdTFGNDVcXHUxRjQ4LVxcdTFGNERcXHUxRjUwLVxcdTFGNTdcXHUxRjU5XFx1MUY1QlxcdTFGNURcXHUxRjVGLVxcdTFGN0RcXHUxRjgwLVxcdTFGQjRcXHUxRkI2LVxcdTFGQkNcXHUxRkJFXFx1MUZDMi1cXHUxRkM0XFx1MUZDNi1cXHUxRkNDXFx1MUZEMC1cXHUxRkQzXFx1MUZENi1cXHUxRkRCXFx1MUZFMC1cXHUxRkVDXFx1MUZGMi1cXHUxRkY0XFx1MUZGNi1cXHUxRkZDXFx1MjA3MVxcdTIwN0ZcXHUyMDkwLVxcdTIwOUNcXHUyMTAyXFx1MjEwN1xcdTIxMEEtXFx1MjExM1xcdTIxMTVcXHUyMTE5LVxcdTIxMURcXHUyMTI0XFx1MjEyNlxcdTIxMjhcXHUyMTJBLVxcdTIxMkRcXHUyMTJGLVxcdTIxMzlcXHUyMTNDLVxcdTIxM0ZcXHUyMTQ1LVxcdTIxNDlcXHUyMTRFXFx1MjE2MC1cXHUyMTg4XFx1MkMwMC1cXHUyQzJFXFx1MkMzMC1cXHUyQzVFXFx1MkM2MC1cXHUyQ0U0XFx1MkNFQi1cXHUyQ0VFXFx1MkNGMlxcdTJDRjNcXHUyRDAwLVxcdTJEMjVcXHUyRDI3XFx1MkQyRFxcdTJEMzAtXFx1MkQ2N1xcdTJENkZcXHUyRDgwLVxcdTJEOTZcXHUyREEwLVxcdTJEQTZcXHUyREE4LVxcdTJEQUVcXHUyREIwLVxcdTJEQjZcXHUyREI4LVxcdTJEQkVcXHUyREMwLVxcdTJEQzZcXHUyREM4LVxcdTJEQ0VcXHUyREQwLVxcdTJERDZcXHUyREQ4LVxcdTJEREVcXHUyRTJGXFx1MzAwNS1cXHUzMDA3XFx1MzAyMS1cXHUzMDI5XFx1MzAzMS1cXHUzMDM1XFx1MzAzOC1cXHUzMDNDXFx1MzA0MS1cXHUzMDk2XFx1MzA5RC1cXHUzMDlGXFx1MzBBMS1cXHUzMEZBXFx1MzBGQy1cXHUzMEZGXFx1MzEwNS1cXHUzMTJEXFx1MzEzMS1cXHUzMThFXFx1MzFBMC1cXHUzMUJBXFx1MzFGMC1cXHUzMUZGXFx1MzQwMC1cXHU0REI1XFx1NEUwMC1cXHU5RkNDXFx1QTAwMC1cXHVBNDhDXFx1QTREMC1cXHVBNEZEXFx1QTUwMC1cXHVBNjBDXFx1QTYxMC1cXHVBNjFGXFx1QTYyQVxcdUE2MkJcXHVBNjQwLVxcdUE2NkVcXHVBNjdGLVxcdUE2OURcXHVBNkEwLVxcdUE2RUZcXHVBNzE3LVxcdUE3MUZcXHVBNzIyLVxcdUE3ODhcXHVBNzhCLVxcdUE3OEVcXHVBNzkwLVxcdUE3QURcXHVBN0IwXFx1QTdCMVxcdUE3RjctXFx1QTgwMVxcdUE4MDMtXFx1QTgwNVxcdUE4MDctXFx1QTgwQVxcdUE4MEMtXFx1QTgyMlxcdUE4NDAtXFx1QTg3M1xcdUE4ODItXFx1QThCM1xcdUE4RjItXFx1QThGN1xcdUE4RkJcXHVBOTBBLVxcdUE5MjVcXHVBOTMwLVxcdUE5NDZcXHVBOTYwLVxcdUE5N0NcXHVBOTg0LVxcdUE5QjJcXHVBOUNGXFx1QTlFMC1cXHVBOUU0XFx1QTlFNi1cXHVBOUVGXFx1QTlGQS1cXHVBOUZFXFx1QUEwMC1cXHVBQTI4XFx1QUE0MC1cXHVBQTQyXFx1QUE0NC1cXHVBQTRCXFx1QUE2MC1cXHVBQTc2XFx1QUE3QVxcdUFBN0UtXFx1QUFBRlxcdUFBQjFcXHVBQUI1XFx1QUFCNlxcdUFBQjktXFx1QUFCRFxcdUFBQzBcXHVBQUMyXFx1QUFEQi1cXHVBQUREXFx1QUFFMC1cXHVBQUVBXFx1QUFGMi1cXHVBQUY0XFx1QUIwMS1cXHVBQjA2XFx1QUIwOS1cXHVBQjBFXFx1QUIxMS1cXHVBQjE2XFx1QUIyMC1cXHVBQjI2XFx1QUIyOC1cXHVBQjJFXFx1QUIzMC1cXHVBQjVBXFx1QUI1Qy1cXHVBQjVGXFx1QUI2NFxcdUFCNjVcXHVBQkMwLVxcdUFCRTJcXHVBQzAwLVxcdUQ3QTNcXHVEN0IwLVxcdUQ3QzZcXHVEN0NCLVxcdUQ3RkJcXHVGOTAwLVxcdUZBNkRcXHVGQTcwLVxcdUZBRDlcXHVGQjAwLVxcdUZCMDZcXHVGQjEzLVxcdUZCMTdcXHVGQjFEXFx1RkIxRi1cXHVGQjI4XFx1RkIyQS1cXHVGQjM2XFx1RkIzOC1cXHVGQjNDXFx1RkIzRVxcdUZCNDBcXHVGQjQxXFx1RkI0M1xcdUZCNDRcXHVGQjQ2LVxcdUZCQjFcXHVGQkQzLVxcdUZEM0RcXHVGRDUwLVxcdUZEOEZcXHVGRDkyLVxcdUZEQzdcXHVGREYwLVxcdUZERkJcXHVGRTcwLVxcdUZFNzRcXHVGRTc2LVxcdUZFRkNcXHVGRjIxLVxcdUZGM0FcXHVGRjQxLVxcdUZGNUFcXHVGRjY2LVxcdUZGQkVcXHVGRkMyLVxcdUZGQzdcXHVGRkNBLVxcdUZGQ0ZcXHVGRkQyLVxcdUZGRDdcXHVGRkRBLVxcdUZGRENdJyksXG4gICAgICAgIE5vbkFzY2lpSWRlbnRpZmllclBhcnQ6IG5ldyBSZWdFeHAoJ1tcXHhBQVxceEI1XFx4QkFcXHhDMC1cXHhENlxceEQ4LVxceEY2XFx4RjgtXFx1MDJDMVxcdTAyQzYtXFx1MDJEMVxcdTAyRTAtXFx1MDJFNFxcdTAyRUNcXHUwMkVFXFx1MDMwMC1cXHUwMzc0XFx1MDM3NlxcdTAzNzdcXHUwMzdBLVxcdTAzN0RcXHUwMzdGXFx1MDM4NlxcdTAzODgtXFx1MDM4QVxcdTAzOENcXHUwMzhFLVxcdTAzQTFcXHUwM0EzLVxcdTAzRjVcXHUwM0Y3LVxcdTA0ODFcXHUwNDgzLVxcdTA0ODdcXHUwNDhBLVxcdTA1MkZcXHUwNTMxLVxcdTA1NTZcXHUwNTU5XFx1MDU2MS1cXHUwNTg3XFx1MDU5MS1cXHUwNUJEXFx1MDVCRlxcdTA1QzFcXHUwNUMyXFx1MDVDNFxcdTA1QzVcXHUwNUM3XFx1MDVEMC1cXHUwNUVBXFx1MDVGMC1cXHUwNUYyXFx1MDYxMC1cXHUwNjFBXFx1MDYyMC1cXHUwNjY5XFx1MDY2RS1cXHUwNkQzXFx1MDZENS1cXHUwNkRDXFx1MDZERi1cXHUwNkU4XFx1MDZFQS1cXHUwNkZDXFx1MDZGRlxcdTA3MTAtXFx1MDc0QVxcdTA3NEQtXFx1MDdCMVxcdTA3QzAtXFx1MDdGNVxcdTA3RkFcXHUwODAwLVxcdTA4MkRcXHUwODQwLVxcdTA4NUJcXHUwOEEwLVxcdTA4QjJcXHUwOEU0LVxcdTA5NjNcXHUwOTY2LVxcdTA5NkZcXHUwOTcxLVxcdTA5ODNcXHUwOTg1LVxcdTA5OENcXHUwOThGXFx1MDk5MFxcdTA5OTMtXFx1MDlBOFxcdTA5QUEtXFx1MDlCMFxcdTA5QjJcXHUwOUI2LVxcdTA5QjlcXHUwOUJDLVxcdTA5QzRcXHUwOUM3XFx1MDlDOFxcdTA5Q0ItXFx1MDlDRVxcdTA5RDdcXHUwOURDXFx1MDlERFxcdTA5REYtXFx1MDlFM1xcdTA5RTYtXFx1MDlGMVxcdTBBMDEtXFx1MEEwM1xcdTBBMDUtXFx1MEEwQVxcdTBBMEZcXHUwQTEwXFx1MEExMy1cXHUwQTI4XFx1MEEyQS1cXHUwQTMwXFx1MEEzMlxcdTBBMzNcXHUwQTM1XFx1MEEzNlxcdTBBMzhcXHUwQTM5XFx1MEEzQ1xcdTBBM0UtXFx1MEE0MlxcdTBBNDdcXHUwQTQ4XFx1MEE0Qi1cXHUwQTREXFx1MEE1MVxcdTBBNTktXFx1MEE1Q1xcdTBBNUVcXHUwQTY2LVxcdTBBNzVcXHUwQTgxLVxcdTBBODNcXHUwQTg1LVxcdTBBOERcXHUwQThGLVxcdTBBOTFcXHUwQTkzLVxcdTBBQThcXHUwQUFBLVxcdTBBQjBcXHUwQUIyXFx1MEFCM1xcdTBBQjUtXFx1MEFCOVxcdTBBQkMtXFx1MEFDNVxcdTBBQzctXFx1MEFDOVxcdTBBQ0ItXFx1MEFDRFxcdTBBRDBcXHUwQUUwLVxcdTBBRTNcXHUwQUU2LVxcdTBBRUZcXHUwQjAxLVxcdTBCMDNcXHUwQjA1LVxcdTBCMENcXHUwQjBGXFx1MEIxMFxcdTBCMTMtXFx1MEIyOFxcdTBCMkEtXFx1MEIzMFxcdTBCMzJcXHUwQjMzXFx1MEIzNS1cXHUwQjM5XFx1MEIzQy1cXHUwQjQ0XFx1MEI0N1xcdTBCNDhcXHUwQjRCLVxcdTBCNERcXHUwQjU2XFx1MEI1N1xcdTBCNUNcXHUwQjVEXFx1MEI1Ri1cXHUwQjYzXFx1MEI2Ni1cXHUwQjZGXFx1MEI3MVxcdTBCODJcXHUwQjgzXFx1MEI4NS1cXHUwQjhBXFx1MEI4RS1cXHUwQjkwXFx1MEI5Mi1cXHUwQjk1XFx1MEI5OVxcdTBCOUFcXHUwQjlDXFx1MEI5RVxcdTBCOUZcXHUwQkEzXFx1MEJBNFxcdTBCQTgtXFx1MEJBQVxcdTBCQUUtXFx1MEJCOVxcdTBCQkUtXFx1MEJDMlxcdTBCQzYtXFx1MEJDOFxcdTBCQ0EtXFx1MEJDRFxcdTBCRDBcXHUwQkQ3XFx1MEJFNi1cXHUwQkVGXFx1MEMwMC1cXHUwQzAzXFx1MEMwNS1cXHUwQzBDXFx1MEMwRS1cXHUwQzEwXFx1MEMxMi1cXHUwQzI4XFx1MEMyQS1cXHUwQzM5XFx1MEMzRC1cXHUwQzQ0XFx1MEM0Ni1cXHUwQzQ4XFx1MEM0QS1cXHUwQzREXFx1MEM1NVxcdTBDNTZcXHUwQzU4XFx1MEM1OVxcdTBDNjAtXFx1MEM2M1xcdTBDNjYtXFx1MEM2RlxcdTBDODEtXFx1MEM4M1xcdTBDODUtXFx1MEM4Q1xcdTBDOEUtXFx1MEM5MFxcdTBDOTItXFx1MENBOFxcdTBDQUEtXFx1MENCM1xcdTBDQjUtXFx1MENCOVxcdTBDQkMtXFx1MENDNFxcdTBDQzYtXFx1MENDOFxcdTBDQ0EtXFx1MENDRFxcdTBDRDVcXHUwQ0Q2XFx1MENERVxcdTBDRTAtXFx1MENFM1xcdTBDRTYtXFx1MENFRlxcdTBDRjFcXHUwQ0YyXFx1MEQwMS1cXHUwRDAzXFx1MEQwNS1cXHUwRDBDXFx1MEQwRS1cXHUwRDEwXFx1MEQxMi1cXHUwRDNBXFx1MEQzRC1cXHUwRDQ0XFx1MEQ0Ni1cXHUwRDQ4XFx1MEQ0QS1cXHUwRDRFXFx1MEQ1N1xcdTBENjAtXFx1MEQ2M1xcdTBENjYtXFx1MEQ2RlxcdTBEN0EtXFx1MEQ3RlxcdTBEODJcXHUwRDgzXFx1MEQ4NS1cXHUwRDk2XFx1MEQ5QS1cXHUwREIxXFx1MERCMy1cXHUwREJCXFx1MERCRFxcdTBEQzAtXFx1MERDNlxcdTBEQ0FcXHUwRENGLVxcdTBERDRcXHUwREQ2XFx1MEREOC1cXHUwRERGXFx1MERFNi1cXHUwREVGXFx1MERGMlxcdTBERjNcXHUwRTAxLVxcdTBFM0FcXHUwRTQwLVxcdTBFNEVcXHUwRTUwLVxcdTBFNTlcXHUwRTgxXFx1MEU4MlxcdTBFODRcXHUwRTg3XFx1MEU4OFxcdTBFOEFcXHUwRThEXFx1MEU5NC1cXHUwRTk3XFx1MEU5OS1cXHUwRTlGXFx1MEVBMS1cXHUwRUEzXFx1MEVBNVxcdTBFQTdcXHUwRUFBXFx1MEVBQlxcdTBFQUQtXFx1MEVCOVxcdTBFQkItXFx1MEVCRFxcdTBFQzAtXFx1MEVDNFxcdTBFQzZcXHUwRUM4LVxcdTBFQ0RcXHUwRUQwLVxcdTBFRDlcXHUwRURDLVxcdTBFREZcXHUwRjAwXFx1MEYxOFxcdTBGMTlcXHUwRjIwLVxcdTBGMjlcXHUwRjM1XFx1MEYzN1xcdTBGMzlcXHUwRjNFLVxcdTBGNDdcXHUwRjQ5LVxcdTBGNkNcXHUwRjcxLVxcdTBGODRcXHUwRjg2LVxcdTBGOTdcXHUwRjk5LVxcdTBGQkNcXHUwRkM2XFx1MTAwMC1cXHUxMDQ5XFx1MTA1MC1cXHUxMDlEXFx1MTBBMC1cXHUxMEM1XFx1MTBDN1xcdTEwQ0RcXHUxMEQwLVxcdTEwRkFcXHUxMEZDLVxcdTEyNDhcXHUxMjRBLVxcdTEyNERcXHUxMjUwLVxcdTEyNTZcXHUxMjU4XFx1MTI1QS1cXHUxMjVEXFx1MTI2MC1cXHUxMjg4XFx1MTI4QS1cXHUxMjhEXFx1MTI5MC1cXHUxMkIwXFx1MTJCMi1cXHUxMkI1XFx1MTJCOC1cXHUxMkJFXFx1MTJDMFxcdTEyQzItXFx1MTJDNVxcdTEyQzgtXFx1MTJENlxcdTEyRDgtXFx1MTMxMFxcdTEzMTItXFx1MTMxNVxcdTEzMTgtXFx1MTM1QVxcdTEzNUQtXFx1MTM1RlxcdTEzODAtXFx1MTM4RlxcdTEzQTAtXFx1MTNGNFxcdTE0MDEtXFx1MTY2Q1xcdTE2NkYtXFx1MTY3RlxcdTE2ODEtXFx1MTY5QVxcdTE2QTAtXFx1MTZFQVxcdTE2RUUtXFx1MTZGOFxcdTE3MDAtXFx1MTcwQ1xcdTE3MEUtXFx1MTcxNFxcdTE3MjAtXFx1MTczNFxcdTE3NDAtXFx1MTc1M1xcdTE3NjAtXFx1MTc2Q1xcdTE3NkUtXFx1MTc3MFxcdTE3NzJcXHUxNzczXFx1MTc4MC1cXHUxN0QzXFx1MTdEN1xcdTE3RENcXHUxN0REXFx1MTdFMC1cXHUxN0U5XFx1MTgwQi1cXHUxODBEXFx1MTgxMC1cXHUxODE5XFx1MTgyMC1cXHUxODc3XFx1MTg4MC1cXHUxOEFBXFx1MThCMC1cXHUxOEY1XFx1MTkwMC1cXHUxOTFFXFx1MTkyMC1cXHUxOTJCXFx1MTkzMC1cXHUxOTNCXFx1MTk0Ni1cXHUxOTZEXFx1MTk3MC1cXHUxOTc0XFx1MTk4MC1cXHUxOUFCXFx1MTlCMC1cXHUxOUM5XFx1MTlEMC1cXHUxOUQ5XFx1MUEwMC1cXHUxQTFCXFx1MUEyMC1cXHUxQTVFXFx1MUE2MC1cXHUxQTdDXFx1MUE3Ri1cXHUxQTg5XFx1MUE5MC1cXHUxQTk5XFx1MUFBN1xcdTFBQjAtXFx1MUFCRFxcdTFCMDAtXFx1MUI0QlxcdTFCNTAtXFx1MUI1OVxcdTFCNkItXFx1MUI3M1xcdTFCODAtXFx1MUJGM1xcdTFDMDAtXFx1MUMzN1xcdTFDNDAtXFx1MUM0OVxcdTFDNEQtXFx1MUM3RFxcdTFDRDAtXFx1MUNEMlxcdTFDRDQtXFx1MUNGNlxcdTFDRjhcXHUxQ0Y5XFx1MUQwMC1cXHUxREY1XFx1MURGQy1cXHUxRjE1XFx1MUYxOC1cXHUxRjFEXFx1MUYyMC1cXHUxRjQ1XFx1MUY0OC1cXHUxRjREXFx1MUY1MC1cXHUxRjU3XFx1MUY1OVxcdTFGNUJcXHUxRjVEXFx1MUY1Ri1cXHUxRjdEXFx1MUY4MC1cXHUxRkI0XFx1MUZCNi1cXHUxRkJDXFx1MUZCRVxcdTFGQzItXFx1MUZDNFxcdTFGQzYtXFx1MUZDQ1xcdTFGRDAtXFx1MUZEM1xcdTFGRDYtXFx1MUZEQlxcdTFGRTAtXFx1MUZFQ1xcdTFGRjItXFx1MUZGNFxcdTFGRjYtXFx1MUZGQ1xcdTIwMENcXHUyMDBEXFx1MjAzRlxcdTIwNDBcXHUyMDU0XFx1MjA3MVxcdTIwN0ZcXHUyMDkwLVxcdTIwOUNcXHUyMEQwLVxcdTIwRENcXHUyMEUxXFx1MjBFNS1cXHUyMEYwXFx1MjEwMlxcdTIxMDdcXHUyMTBBLVxcdTIxMTNcXHUyMTE1XFx1MjExOS1cXHUyMTFEXFx1MjEyNFxcdTIxMjZcXHUyMTI4XFx1MjEyQS1cXHUyMTJEXFx1MjEyRi1cXHUyMTM5XFx1MjEzQy1cXHUyMTNGXFx1MjE0NS1cXHUyMTQ5XFx1MjE0RVxcdTIxNjAtXFx1MjE4OFxcdTJDMDAtXFx1MkMyRVxcdTJDMzAtXFx1MkM1RVxcdTJDNjAtXFx1MkNFNFxcdTJDRUItXFx1MkNGM1xcdTJEMDAtXFx1MkQyNVxcdTJEMjdcXHUyRDJEXFx1MkQzMC1cXHUyRDY3XFx1MkQ2RlxcdTJEN0YtXFx1MkQ5NlxcdTJEQTAtXFx1MkRBNlxcdTJEQTgtXFx1MkRBRVxcdTJEQjAtXFx1MkRCNlxcdTJEQjgtXFx1MkRCRVxcdTJEQzAtXFx1MkRDNlxcdTJEQzgtXFx1MkRDRVxcdTJERDAtXFx1MkRENlxcdTJERDgtXFx1MkRERVxcdTJERTAtXFx1MkRGRlxcdTJFMkZcXHUzMDA1LVxcdTMwMDdcXHUzMDIxLVxcdTMwMkZcXHUzMDMxLVxcdTMwMzVcXHUzMDM4LVxcdTMwM0NcXHUzMDQxLVxcdTMwOTZcXHUzMDk5XFx1MzA5QVxcdTMwOUQtXFx1MzA5RlxcdTMwQTEtXFx1MzBGQVxcdTMwRkMtXFx1MzBGRlxcdTMxMDUtXFx1MzEyRFxcdTMxMzEtXFx1MzE4RVxcdTMxQTAtXFx1MzFCQVxcdTMxRjAtXFx1MzFGRlxcdTM0MDAtXFx1NERCNVxcdTRFMDAtXFx1OUZDQ1xcdUEwMDAtXFx1QTQ4Q1xcdUE0RDAtXFx1QTRGRFxcdUE1MDAtXFx1QTYwQ1xcdUE2MTAtXFx1QTYyQlxcdUE2NDAtXFx1QTY2RlxcdUE2NzQtXFx1QTY3RFxcdUE2N0YtXFx1QTY5RFxcdUE2OUYtXFx1QTZGMVxcdUE3MTctXFx1QTcxRlxcdUE3MjItXFx1QTc4OFxcdUE3OEItXFx1QTc4RVxcdUE3OTAtXFx1QTdBRFxcdUE3QjBcXHVBN0IxXFx1QTdGNy1cXHVBODI3XFx1QTg0MC1cXHVBODczXFx1QTg4MC1cXHVBOEM0XFx1QThEMC1cXHVBOEQ5XFx1QThFMC1cXHVBOEY3XFx1QThGQlxcdUE5MDAtXFx1QTkyRFxcdUE5MzAtXFx1QTk1M1xcdUE5NjAtXFx1QTk3Q1xcdUE5ODAtXFx1QTlDMFxcdUE5Q0YtXFx1QTlEOVxcdUE5RTAtXFx1QTlGRVxcdUFBMDAtXFx1QUEzNlxcdUFBNDAtXFx1QUE0RFxcdUFBNTAtXFx1QUE1OVxcdUFBNjAtXFx1QUE3NlxcdUFBN0EtXFx1QUFDMlxcdUFBREItXFx1QUFERFxcdUFBRTAtXFx1QUFFRlxcdUFBRjItXFx1QUFGNlxcdUFCMDEtXFx1QUIwNlxcdUFCMDktXFx1QUIwRVxcdUFCMTEtXFx1QUIxNlxcdUFCMjAtXFx1QUIyNlxcdUFCMjgtXFx1QUIyRVxcdUFCMzAtXFx1QUI1QVxcdUFCNUMtXFx1QUI1RlxcdUFCNjRcXHVBQjY1XFx1QUJDMC1cXHVBQkVBXFx1QUJFQ1xcdUFCRURcXHVBQkYwLVxcdUFCRjlcXHVBQzAwLVxcdUQ3QTNcXHVEN0IwLVxcdUQ3QzZcXHVEN0NCLVxcdUQ3RkJcXHVGOTAwLVxcdUZBNkRcXHVGQTcwLVxcdUZBRDlcXHVGQjAwLVxcdUZCMDZcXHVGQjEzLVxcdUZCMTdcXHVGQjFELVxcdUZCMjhcXHVGQjJBLVxcdUZCMzZcXHVGQjM4LVxcdUZCM0NcXHVGQjNFXFx1RkI0MFxcdUZCNDFcXHVGQjQzXFx1RkI0NFxcdUZCNDYtXFx1RkJCMVxcdUZCRDMtXFx1RkQzRFxcdUZENTAtXFx1RkQ4RlxcdUZEOTItXFx1RkRDN1xcdUZERjAtXFx1RkRGQlxcdUZFMDAtXFx1RkUwRlxcdUZFMjAtXFx1RkUyRFxcdUZFMzNcXHVGRTM0XFx1RkU0RC1cXHVGRTRGXFx1RkU3MC1cXHVGRTc0XFx1RkU3Ni1cXHVGRUZDXFx1RkYxMC1cXHVGRjE5XFx1RkYyMS1cXHVGRjNBXFx1RkYzRlxcdUZGNDEtXFx1RkY1QVxcdUZGNjYtXFx1RkZCRVxcdUZGQzItXFx1RkZDN1xcdUZGQ0EtXFx1RkZDRlxcdUZGRDItXFx1RkZEN1xcdUZGREEtXFx1RkZEQ10nKVxuICAgIH07XG5cbiAgICAvLyBFbnN1cmUgdGhlIGNvbmRpdGlvbiBpcyB0cnVlLCBvdGhlcndpc2UgdGhyb3cgYW4gZXJyb3IuXG4gICAgLy8gVGhpcyBpcyBvbmx5IHRvIGhhdmUgYSBiZXR0ZXIgY29udHJhY3Qgc2VtYW50aWMsIGkuZS4gYW5vdGhlciBzYWZldHkgbmV0XG4gICAgLy8gdG8gY2F0Y2ggYSBsb2dpYyBlcnJvci4gVGhlIGNvbmRpdGlvbiBzaGFsbCBiZSBmdWxmaWxsZWQgaW4gbm9ybWFsIGNhc2UuXG4gICAgLy8gRG8gTk9UIHVzZSB0aGlzIHRvIGVuZm9yY2UgYSBjZXJ0YWluIGNvbmRpdGlvbiBvbiBhbnkgdXNlciBpbnB1dC5cblxuICAgIGZ1bmN0aW9uIGFzc2VydChjb25kaXRpb24sIG1lc3NhZ2UpIHtcbiAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgICAgIGlmICghY29uZGl0aW9uKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0FTU0VSVDogJyArIG1lc3NhZ2UpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNEZWNpbWFsRGlnaXQoY2gpIHtcbiAgICAgICAgcmV0dXJuIChjaCA+PSAweDMwICYmIGNoIDw9IDB4MzkpOyAgIC8vIDAuLjlcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc0hleERpZ2l0KGNoKSB7XG4gICAgICAgIHJldHVybiAnMDEyMzQ1Njc4OWFiY2RlZkFCQ0RFRicuaW5kZXhPZihjaCkgPj0gMDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc09jdGFsRGlnaXQoY2gpIHtcbiAgICAgICAgcmV0dXJuICcwMTIzNDU2NycuaW5kZXhPZihjaCkgPj0gMDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBvY3RhbFRvRGVjaW1hbChjaCkge1xuICAgICAgICAvLyBcXDAgaXMgbm90IG9jdGFsIGVzY2FwZSBzZXF1ZW5jZVxuICAgICAgICB2YXIgb2N0YWwgPSAoY2ggIT09ICcwJyksIGNvZGUgPSAnMDEyMzQ1NjcnLmluZGV4T2YoY2gpO1xuXG4gICAgICAgIGlmIChpbmRleCA8IGxlbmd0aCAmJiBpc09jdGFsRGlnaXQoc291cmNlW2luZGV4XSkpIHtcbiAgICAgICAgICAgIG9jdGFsID0gdHJ1ZTtcbiAgICAgICAgICAgIGNvZGUgPSBjb2RlICogOCArICcwMTIzNDU2NycuaW5kZXhPZihzb3VyY2VbaW5kZXgrK10pO1xuXG4gICAgICAgICAgICAvLyAzIGRpZ2l0cyBhcmUgb25seSBhbGxvd2VkIHdoZW4gc3RyaW5nIHN0YXJ0c1xuICAgICAgICAgICAgLy8gd2l0aCAwLCAxLCAyLCAzXG4gICAgICAgICAgICBpZiAoJzAxMjMnLmluZGV4T2YoY2gpID49IDAgJiZcbiAgICAgICAgICAgICAgICAgICAgaW5kZXggPCBsZW5ndGggJiZcbiAgICAgICAgICAgICAgICAgICAgaXNPY3RhbERpZ2l0KHNvdXJjZVtpbmRleF0pKSB7XG4gICAgICAgICAgICAgICAgY29kZSA9IGNvZGUgKiA4ICsgJzAxMjM0NTY3Jy5pbmRleE9mKHNvdXJjZVtpbmRleCsrXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgY29kZTogY29kZSxcbiAgICAgICAgICAgIG9jdGFsOiBvY3RhbFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8vIDcuMiBXaGl0ZSBTcGFjZVxuXG4gICAgZnVuY3Rpb24gaXNXaGl0ZVNwYWNlKGNoKSB7XG4gICAgICAgIHJldHVybiAoY2ggPT09IDB4MjApIHx8IChjaCA9PT0gMHgwOSkgfHwgKGNoID09PSAweDBCKSB8fCAoY2ggPT09IDB4MEMpIHx8IChjaCA9PT0gMHhBMCkgfHxcbiAgICAgICAgICAgIChjaCA+PSAweDE2ODAgJiYgWzB4MTY4MCwgMHgxODBFLCAweDIwMDAsIDB4MjAwMSwgMHgyMDAyLCAweDIwMDMsIDB4MjAwNCwgMHgyMDA1LCAweDIwMDYsIDB4MjAwNywgMHgyMDA4LCAweDIwMDksIDB4MjAwQSwgMHgyMDJGLCAweDIwNUYsIDB4MzAwMCwgMHhGRUZGXS5pbmRleE9mKGNoKSA+PSAwKTtcbiAgICB9XG5cbiAgICAvLyA3LjMgTGluZSBUZXJtaW5hdG9yc1xuXG4gICAgZnVuY3Rpb24gaXNMaW5lVGVybWluYXRvcihjaCkge1xuICAgICAgICByZXR1cm4gKGNoID09PSAweDBBKSB8fCAoY2ggPT09IDB4MEQpIHx8IChjaCA9PT0gMHgyMDI4KSB8fCAoY2ggPT09IDB4MjAyOSk7XG4gICAgfVxuXG4gICAgLy8gNy42IElkZW50aWZpZXIgTmFtZXMgYW5kIElkZW50aWZpZXJzXG5cbiAgICBmdW5jdGlvbiBpc0lkZW50aWZpZXJTdGFydChjaCkge1xuICAgICAgICByZXR1cm4gKGNoID09PSAweDI0KSB8fCAoY2ggPT09IDB4NUYpIHx8ICAvLyAkIChkb2xsYXIpIGFuZCBfICh1bmRlcnNjb3JlKVxuICAgICAgICAgICAgKGNoID49IDB4NDEgJiYgY2ggPD0gMHg1QSkgfHwgICAgICAgICAvLyBBLi5aXG4gICAgICAgICAgICAoY2ggPj0gMHg2MSAmJiBjaCA8PSAweDdBKSB8fCAgICAgICAgIC8vIGEuLnpcbiAgICAgICAgICAgIChjaCA9PT0gMHg1QykgfHwgICAgICAgICAgICAgICAgICAgICAgLy8gXFwgKGJhY2tzbGFzaClcbiAgICAgICAgICAgICgoY2ggPj0gMHg4MCkgJiYgUmVnZXguTm9uQXNjaWlJZGVudGlmaWVyU3RhcnQudGVzdChTdHJpbmcuZnJvbUNoYXJDb2RlKGNoKSkpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzSWRlbnRpZmllclBhcnQoY2gpIHtcbiAgICAgICAgcmV0dXJuIChjaCA9PT0gMHgyNCkgfHwgKGNoID09PSAweDVGKSB8fCAgLy8gJCAoZG9sbGFyKSBhbmQgXyAodW5kZXJzY29yZSlcbiAgICAgICAgICAgIChjaCA+PSAweDQxICYmIGNoIDw9IDB4NUEpIHx8ICAgICAgICAgLy8gQS4uWlxuICAgICAgICAgICAgKGNoID49IDB4NjEgJiYgY2ggPD0gMHg3QSkgfHwgICAgICAgICAvLyBhLi56XG4gICAgICAgICAgICAoY2ggPj0gMHgzMCAmJiBjaCA8PSAweDM5KSB8fCAgICAgICAgIC8vIDAuLjlcbiAgICAgICAgICAgIChjaCA9PT0gMHg1QykgfHwgICAgICAgICAgICAgICAgICAgICAgLy8gXFwgKGJhY2tzbGFzaClcbiAgICAgICAgICAgICgoY2ggPj0gMHg4MCkgJiYgUmVnZXguTm9uQXNjaWlJZGVudGlmaWVyUGFydC50ZXN0KFN0cmluZy5mcm9tQ2hhckNvZGUoY2gpKSk7XG4gICAgfVxuXG4gICAgLy8gNy42LjEuMiBGdXR1cmUgUmVzZXJ2ZWQgV29yZHNcblxuICAgIGZ1bmN0aW9uIGlzRnV0dXJlUmVzZXJ2ZWRXb3JkKGlkKSB7XG4gICAgICAgIHN3aXRjaCAoaWQpIHtcbiAgICAgICAgY2FzZSAnZW51bSc6XG4gICAgICAgIGNhc2UgJ2V4cG9ydCc6XG4gICAgICAgIGNhc2UgJ2ltcG9ydCc6XG4gICAgICAgIGNhc2UgJ3N1cGVyJzpcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gMTEuNi4yLjIgRnV0dXJlIFJlc2VydmVkIFdvcmRzXG5cbiAgICBmdW5jdGlvbiBpc1N0cmljdE1vZGVSZXNlcnZlZFdvcmQoaWQpIHtcbiAgICAgICAgc3dpdGNoIChpZCkge1xuICAgICAgICBjYXNlICdpbXBsZW1lbnRzJzpcbiAgICAgICAgY2FzZSAnaW50ZXJmYWNlJzpcbiAgICAgICAgY2FzZSAncGFja2FnZSc6XG4gICAgICAgIGNhc2UgJ3ByaXZhdGUnOlxuICAgICAgICBjYXNlICdwcm90ZWN0ZWQnOlxuICAgICAgICBjYXNlICdwdWJsaWMnOlxuICAgICAgICBjYXNlICdzdGF0aWMnOlxuICAgICAgICBjYXNlICd5aWVsZCc6XG4gICAgICAgIGNhc2UgJ2xldCc6XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzUmVzdHJpY3RlZFdvcmQoaWQpIHtcbiAgICAgICAgcmV0dXJuIGlkID09PSAnZXZhbCcgfHwgaWQgPT09ICdhcmd1bWVudHMnO1xuICAgIH1cblxuICAgIC8vIDcuNi4xLjEgS2V5d29yZHNcblxuICAgIGZ1bmN0aW9uIGlzS2V5d29yZChpZCkge1xuXG4gICAgICAgIC8vICdjb25zdCcgaXMgc3BlY2lhbGl6ZWQgYXMgS2V5d29yZCBpbiBWOC5cbiAgICAgICAgLy8gJ3lpZWxkJyBhbmQgJ2xldCcgYXJlIGZvciBjb21wYXRpYmlsaXR5IHdpdGggU3BpZGVyTW9ua2V5IGFuZCBFUy5uZXh0LlxuICAgICAgICAvLyBTb21lIG90aGVycyBhcmUgZnJvbSBmdXR1cmUgcmVzZXJ2ZWQgd29yZHMuXG5cbiAgICAgICAgc3dpdGNoIChpZC5sZW5ndGgpIHtcbiAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgcmV0dXJuIChpZCA9PT0gJ2lmJykgfHwgKGlkID09PSAnaW4nKSB8fCAoaWQgPT09ICdkbycpO1xuICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICByZXR1cm4gKGlkID09PSAndmFyJykgfHwgKGlkID09PSAnZm9yJykgfHwgKGlkID09PSAnbmV3JykgfHxcbiAgICAgICAgICAgICAgICAoaWQgPT09ICd0cnknKSB8fCAoaWQgPT09ICdsZXQnKTtcbiAgICAgICAgY2FzZSA0OlxuICAgICAgICAgICAgcmV0dXJuIChpZCA9PT0gJ3RoaXMnKSB8fCAoaWQgPT09ICdlbHNlJykgfHwgKGlkID09PSAnY2FzZScpIHx8XG4gICAgICAgICAgICAgICAgKGlkID09PSAndm9pZCcpIHx8IChpZCA9PT0gJ3dpdGgnKSB8fCAoaWQgPT09ICdlbnVtJyk7XG4gICAgICAgIGNhc2UgNTpcbiAgICAgICAgICAgIHJldHVybiAoaWQgPT09ICd3aGlsZScpIHx8IChpZCA9PT0gJ2JyZWFrJykgfHwgKGlkID09PSAnY2F0Y2gnKSB8fFxuICAgICAgICAgICAgICAgIChpZCA9PT0gJ3Rocm93JykgfHwgKGlkID09PSAnY29uc3QnKSB8fCAoaWQgPT09ICd5aWVsZCcpIHx8XG4gICAgICAgICAgICAgICAgKGlkID09PSAnY2xhc3MnKSB8fCAoaWQgPT09ICdzdXBlcicpO1xuICAgICAgICBjYXNlIDY6XG4gICAgICAgICAgICByZXR1cm4gKGlkID09PSAncmV0dXJuJykgfHwgKGlkID09PSAndHlwZW9mJykgfHwgKGlkID09PSAnZGVsZXRlJykgfHxcbiAgICAgICAgICAgICAgICAoaWQgPT09ICdzd2l0Y2gnKSB8fCAoaWQgPT09ICdleHBvcnQnKSB8fCAoaWQgPT09ICdpbXBvcnQnKTtcbiAgICAgICAgY2FzZSA3OlxuICAgICAgICAgICAgcmV0dXJuIChpZCA9PT0gJ2RlZmF1bHQnKSB8fCAoaWQgPT09ICdmaW5hbGx5JykgfHwgKGlkID09PSAnZXh0ZW5kcycpO1xuICAgICAgICBjYXNlIDg6XG4gICAgICAgICAgICByZXR1cm4gKGlkID09PSAnZnVuY3Rpb24nKSB8fCAoaWQgPT09ICdjb250aW51ZScpIHx8IChpZCA9PT0gJ2RlYnVnZ2VyJyk7XG4gICAgICAgIGNhc2UgMTA6XG4gICAgICAgICAgICByZXR1cm4gKGlkID09PSAnaW5zdGFuY2VvZicpO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gNy40IENvbW1lbnRzXG5cbiAgICBmdW5jdGlvbiBhZGRDb21tZW50KHR5cGUsIHZhbHVlLCBzdGFydCwgZW5kLCBsb2MpIHtcbiAgICAgICAgdmFyIGNvbW1lbnQ7XG5cbiAgICAgICAgYXNzZXJ0KHR5cGVvZiBzdGFydCA9PT0gJ251bWJlcicsICdDb21tZW50IG11c3QgaGF2ZSB2YWxpZCBwb3NpdGlvbicpO1xuXG4gICAgICAgIHN0YXRlLmxhc3RDb21tZW50U3RhcnQgPSBzdGFydDtcblxuICAgICAgICBjb21tZW50ID0ge1xuICAgICAgICAgICAgdHlwZTogdHlwZSxcbiAgICAgICAgICAgIHZhbHVlOiB2YWx1ZVxuICAgICAgICB9O1xuICAgICAgICBpZiAoZXh0cmEucmFuZ2UpIHtcbiAgICAgICAgICAgIGNvbW1lbnQucmFuZ2UgPSBbc3RhcnQsIGVuZF07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGV4dHJhLmxvYykge1xuICAgICAgICAgICAgY29tbWVudC5sb2MgPSBsb2M7XG4gICAgICAgIH1cbiAgICAgICAgZXh0cmEuY29tbWVudHMucHVzaChjb21tZW50KTtcbiAgICAgICAgaWYgKGV4dHJhLmF0dGFjaENvbW1lbnQpIHtcbiAgICAgICAgICAgIGV4dHJhLmxlYWRpbmdDb21tZW50cy5wdXNoKGNvbW1lbnQpO1xuICAgICAgICAgICAgZXh0cmEudHJhaWxpbmdDb21tZW50cy5wdXNoKGNvbW1lbnQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2tpcFNpbmdsZUxpbmVDb21tZW50KG9mZnNldCkge1xuICAgICAgICB2YXIgc3RhcnQsIGxvYywgY2gsIGNvbW1lbnQ7XG5cbiAgICAgICAgc3RhcnQgPSBpbmRleCAtIG9mZnNldDtcbiAgICAgICAgbG9jID0ge1xuICAgICAgICAgICAgc3RhcnQ6IHtcbiAgICAgICAgICAgICAgICBsaW5lOiBsaW5lTnVtYmVyLFxuICAgICAgICAgICAgICAgIGNvbHVtbjogaW5kZXggLSBsaW5lU3RhcnQgLSBvZmZzZXRcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICB3aGlsZSAoaW5kZXggPCBsZW5ndGgpIHtcbiAgICAgICAgICAgIGNoID0gc291cmNlLmNoYXJDb2RlQXQoaW5kZXgpO1xuICAgICAgICAgICAgKytpbmRleDtcbiAgICAgICAgICAgIGlmIChpc0xpbmVUZXJtaW5hdG9yKGNoKSkge1xuICAgICAgICAgICAgICAgIGhhc0xpbmVUZXJtaW5hdG9yID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBpZiAoZXh0cmEuY29tbWVudHMpIHtcbiAgICAgICAgICAgICAgICAgICAgY29tbWVudCA9IHNvdXJjZS5zbGljZShzdGFydCArIG9mZnNldCwgaW5kZXggLSAxKTtcbiAgICAgICAgICAgICAgICAgICAgbG9jLmVuZCA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmU6IGxpbmVOdW1iZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2x1bW46IGluZGV4IC0gbGluZVN0YXJ0IC0gMVxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICBhZGRDb21tZW50KCdMaW5lJywgY29tbWVudCwgc3RhcnQsIGluZGV4IC0gMSwgbG9jKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGNoID09PSAxMyAmJiBzb3VyY2UuY2hhckNvZGVBdChpbmRleCkgPT09IDEwKSB7XG4gICAgICAgICAgICAgICAgICAgICsraW5kZXg7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICsrbGluZU51bWJlcjtcbiAgICAgICAgICAgICAgICBsaW5lU3RhcnQgPSBpbmRleDtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZXh0cmEuY29tbWVudHMpIHtcbiAgICAgICAgICAgIGNvbW1lbnQgPSBzb3VyY2Uuc2xpY2Uoc3RhcnQgKyBvZmZzZXQsIGluZGV4KTtcbiAgICAgICAgICAgIGxvYy5lbmQgPSB7XG4gICAgICAgICAgICAgICAgbGluZTogbGluZU51bWJlcixcbiAgICAgICAgICAgICAgICBjb2x1bW46IGluZGV4IC0gbGluZVN0YXJ0XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgYWRkQ29tbWVudCgnTGluZScsIGNvbW1lbnQsIHN0YXJ0LCBpbmRleCwgbG9jKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNraXBNdWx0aUxpbmVDb21tZW50KCkge1xuICAgICAgICB2YXIgc3RhcnQsIGxvYywgY2gsIGNvbW1lbnQ7XG5cbiAgICAgICAgaWYgKGV4dHJhLmNvbW1lbnRzKSB7XG4gICAgICAgICAgICBzdGFydCA9IGluZGV4IC0gMjtcbiAgICAgICAgICAgIGxvYyA9IHtcbiAgICAgICAgICAgICAgICBzdGFydDoge1xuICAgICAgICAgICAgICAgICAgICBsaW5lOiBsaW5lTnVtYmVyLFxuICAgICAgICAgICAgICAgICAgICBjb2x1bW46IGluZGV4IC0gbGluZVN0YXJ0IC0gMlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICB3aGlsZSAoaW5kZXggPCBsZW5ndGgpIHtcbiAgICAgICAgICAgIGNoID0gc291cmNlLmNoYXJDb2RlQXQoaW5kZXgpO1xuICAgICAgICAgICAgaWYgKGlzTGluZVRlcm1pbmF0b3IoY2gpKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNoID09PSAweDBEICYmIHNvdXJjZS5jaGFyQ29kZUF0KGluZGV4ICsgMSkgPT09IDB4MEEpIHtcbiAgICAgICAgICAgICAgICAgICAgKytpbmRleDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaGFzTGluZVRlcm1pbmF0b3IgPSB0cnVlO1xuICAgICAgICAgICAgICAgICsrbGluZU51bWJlcjtcbiAgICAgICAgICAgICAgICArK2luZGV4O1xuICAgICAgICAgICAgICAgIGxpbmVTdGFydCA9IGluZGV4O1xuICAgICAgICAgICAgfSBlbHNlIGlmIChjaCA9PT0gMHgyQSkge1xuICAgICAgICAgICAgICAgIC8vIEJsb2NrIGNvbW1lbnQgZW5kcyB3aXRoICcqLycuXG4gICAgICAgICAgICAgICAgaWYgKHNvdXJjZS5jaGFyQ29kZUF0KGluZGV4ICsgMSkgPT09IDB4MkYpIHtcbiAgICAgICAgICAgICAgICAgICAgKytpbmRleDtcbiAgICAgICAgICAgICAgICAgICAgKytpbmRleDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGV4dHJhLmNvbW1lbnRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb21tZW50ID0gc291cmNlLnNsaWNlKHN0YXJ0ICsgMiwgaW5kZXggLSAyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvYy5lbmQgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGluZTogbGluZU51bWJlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2x1bW46IGluZGV4IC0gbGluZVN0YXJ0XG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgYWRkQ29tbWVudCgnQmxvY2snLCBjb21tZW50LCBzdGFydCwgaW5kZXgsIGxvYyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICArK2luZGV4O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICArK2luZGV4O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gUmFuIG9mZiB0aGUgZW5kIG9mIHRoZSBmaWxlIC0gdGhlIHdob2xlIHRoaW5nIGlzIGEgY29tbWVudFxuICAgICAgICBpZiAoZXh0cmEuY29tbWVudHMpIHtcbiAgICAgICAgICAgIGxvYy5lbmQgPSB7XG4gICAgICAgICAgICAgICAgbGluZTogbGluZU51bWJlcixcbiAgICAgICAgICAgICAgICBjb2x1bW46IGluZGV4IC0gbGluZVN0YXJ0XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgY29tbWVudCA9IHNvdXJjZS5zbGljZShzdGFydCArIDIsIGluZGV4KTtcbiAgICAgICAgICAgIGFkZENvbW1lbnQoJ0Jsb2NrJywgY29tbWVudCwgc3RhcnQsIGluZGV4LCBsb2MpO1xuICAgICAgICB9XG4gICAgICAgIHRvbGVyYXRlVW5leHBlY3RlZFRva2VuKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2tpcENvbW1lbnQoKSB7XG4gICAgICAgIHZhciBjaCwgc3RhcnQ7XG4gICAgICAgIGhhc0xpbmVUZXJtaW5hdG9yID0gZmFsc2U7XG5cbiAgICAgICAgc3RhcnQgPSAoaW5kZXggPT09IDApO1xuICAgICAgICB3aGlsZSAoaW5kZXggPCBsZW5ndGgpIHtcbiAgICAgICAgICAgIGNoID0gc291cmNlLmNoYXJDb2RlQXQoaW5kZXgpO1xuXG4gICAgICAgICAgICBpZiAoaXNXaGl0ZVNwYWNlKGNoKSkge1xuICAgICAgICAgICAgICAgICsraW5kZXg7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGlzTGluZVRlcm1pbmF0b3IoY2gpKSB7XG4gICAgICAgICAgICAgICAgaGFzTGluZVRlcm1pbmF0b3IgPSB0cnVlO1xuICAgICAgICAgICAgICAgICsraW5kZXg7XG4gICAgICAgICAgICAgICAgaWYgKGNoID09PSAweDBEICYmIHNvdXJjZS5jaGFyQ29kZUF0KGluZGV4KSA9PT0gMHgwQSkge1xuICAgICAgICAgICAgICAgICAgICArK2luZGV4O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICArK2xpbmVOdW1iZXI7XG4gICAgICAgICAgICAgICAgbGluZVN0YXJ0ID0gaW5kZXg7XG4gICAgICAgICAgICAgICAgc3RhcnQgPSB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChjaCA9PT0gMHgyRikgeyAvLyBVKzAwMkYgaXMgJy8nXG4gICAgICAgICAgICAgICAgY2ggPSBzb3VyY2UuY2hhckNvZGVBdChpbmRleCArIDEpO1xuICAgICAgICAgICAgICAgIGlmIChjaCA9PT0gMHgyRikge1xuICAgICAgICAgICAgICAgICAgICArK2luZGV4O1xuICAgICAgICAgICAgICAgICAgICArK2luZGV4O1xuICAgICAgICAgICAgICAgICAgICBza2lwU2luZ2xlTGluZUNvbW1lbnQoMik7XG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGNoID09PSAweDJBKSB7ICAvLyBVKzAwMkEgaXMgJyonXG4gICAgICAgICAgICAgICAgICAgICsraW5kZXg7XG4gICAgICAgICAgICAgICAgICAgICsraW5kZXg7XG4gICAgICAgICAgICAgICAgICAgIHNraXBNdWx0aUxpbmVDb21tZW50KCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChzdGFydCAmJiBjaCA9PT0gMHgyRCkgeyAvLyBVKzAwMkQgaXMgJy0nXG4gICAgICAgICAgICAgICAgLy8gVSswMDNFIGlzICc+J1xuICAgICAgICAgICAgICAgIGlmICgoc291cmNlLmNoYXJDb2RlQXQoaW5kZXggKyAxKSA9PT0gMHgyRCkgJiYgKHNvdXJjZS5jaGFyQ29kZUF0KGluZGV4ICsgMikgPT09IDB4M0UpKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vICctLT4nIGlzIGEgc2luZ2xlLWxpbmUgY29tbWVudFxuICAgICAgICAgICAgICAgICAgICBpbmRleCArPSAzO1xuICAgICAgICAgICAgICAgICAgICBza2lwU2luZ2xlTGluZUNvbW1lbnQoMyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChjaCA9PT0gMHgzQykgeyAvLyBVKzAwM0MgaXMgJzwnXG4gICAgICAgICAgICAgICAgaWYgKHNvdXJjZS5zbGljZShpbmRleCArIDEsIGluZGV4ICsgNCkgPT09ICchLS0nKSB7XG4gICAgICAgICAgICAgICAgICAgICsraW5kZXg7IC8vIGA8YFxuICAgICAgICAgICAgICAgICAgICArK2luZGV4OyAvLyBgIWBcbiAgICAgICAgICAgICAgICAgICAgKytpbmRleDsgLy8gYC1gXG4gICAgICAgICAgICAgICAgICAgICsraW5kZXg7IC8vIGAtYFxuICAgICAgICAgICAgICAgICAgICBza2lwU2luZ2xlTGluZUNvbW1lbnQoNCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNjYW5IZXhFc2NhcGUocHJlZml4KSB7XG4gICAgICAgIHZhciBpLCBsZW4sIGNoLCBjb2RlID0gMDtcblxuICAgICAgICBsZW4gPSAocHJlZml4ID09PSAndScpID8gNCA6IDI7XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBsZW47ICsraSkge1xuICAgICAgICAgICAgaWYgKGluZGV4IDwgbGVuZ3RoICYmIGlzSGV4RGlnaXQoc291cmNlW2luZGV4XSkpIHtcbiAgICAgICAgICAgICAgICBjaCA9IHNvdXJjZVtpbmRleCsrXTtcbiAgICAgICAgICAgICAgICBjb2RlID0gY29kZSAqIDE2ICsgJzAxMjM0NTY3ODlhYmNkZWYnLmluZGV4T2YoY2gudG9Mb3dlckNhc2UoKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZShjb2RlKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzY2FuVW5pY29kZUNvZGVQb2ludEVzY2FwZSgpIHtcbiAgICAgICAgdmFyIGNoLCBjb2RlLCBjdTEsIGN1MjtcblxuICAgICAgICBjaCA9IHNvdXJjZVtpbmRleF07XG4gICAgICAgIGNvZGUgPSAwO1xuXG4gICAgICAgIC8vIEF0IGxlYXN0LCBvbmUgaGV4IGRpZ2l0IGlzIHJlcXVpcmVkLlxuICAgICAgICBpZiAoY2ggPT09ICd9Jykge1xuICAgICAgICAgICAgdGhyb3dVbmV4cGVjdGVkVG9rZW4oKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHdoaWxlIChpbmRleCA8IGxlbmd0aCkge1xuICAgICAgICAgICAgY2ggPSBzb3VyY2VbaW5kZXgrK107XG4gICAgICAgICAgICBpZiAoIWlzSGV4RGlnaXQoY2gpKSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb2RlID0gY29kZSAqIDE2ICsgJzAxMjM0NTY3ODlhYmNkZWYnLmluZGV4T2YoY2gudG9Mb3dlckNhc2UoKSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29kZSA+IDB4MTBGRkZGIHx8IGNoICE9PSAnfScpIHtcbiAgICAgICAgICAgIHRocm93VW5leHBlY3RlZFRva2VuKCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBVVEYtMTYgRW5jb2RpbmdcbiAgICAgICAgaWYgKGNvZGUgPD0gMHhGRkZGKSB7XG4gICAgICAgICAgICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZShjb2RlKTtcbiAgICAgICAgfVxuICAgICAgICBjdTEgPSAoKGNvZGUgLSAweDEwMDAwKSA+PiAxMCkgKyAweEQ4MDA7XG4gICAgICAgIGN1MiA9ICgoY29kZSAtIDB4MTAwMDApICYgMTAyMykgKyAweERDMDA7XG4gICAgICAgIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKGN1MSwgY3UyKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRFc2NhcGVkSWRlbnRpZmllcigpIHtcbiAgICAgICAgdmFyIGNoLCBpZDtcblxuICAgICAgICBjaCA9IHNvdXJjZS5jaGFyQ29kZUF0KGluZGV4KyspO1xuICAgICAgICBpZCA9IFN0cmluZy5mcm9tQ2hhckNvZGUoY2gpO1xuXG4gICAgICAgIC8vICdcXHUnIChVKzAwNUMsIFUrMDA3NSkgZGVub3RlcyBhbiBlc2NhcGVkIGNoYXJhY3Rlci5cbiAgICAgICAgaWYgKGNoID09PSAweDVDKSB7XG4gICAgICAgICAgICBpZiAoc291cmNlLmNoYXJDb2RlQXQoaW5kZXgpICE9PSAweDc1KSB7XG4gICAgICAgICAgICAgICAgdGhyb3dVbmV4cGVjdGVkVG9rZW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgICsraW5kZXg7XG4gICAgICAgICAgICBjaCA9IHNjYW5IZXhFc2NhcGUoJ3UnKTtcbiAgICAgICAgICAgIGlmICghY2ggfHwgY2ggPT09ICdcXFxcJyB8fCAhaXNJZGVudGlmaWVyU3RhcnQoY2guY2hhckNvZGVBdCgwKSkpIHtcbiAgICAgICAgICAgICAgICB0aHJvd1VuZXhwZWN0ZWRUb2tlbigpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWQgPSBjaDtcbiAgICAgICAgfVxuXG4gICAgICAgIHdoaWxlIChpbmRleCA8IGxlbmd0aCkge1xuICAgICAgICAgICAgY2ggPSBzb3VyY2UuY2hhckNvZGVBdChpbmRleCk7XG4gICAgICAgICAgICBpZiAoIWlzSWRlbnRpZmllclBhcnQoY2gpKSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICArK2luZGV4O1xuICAgICAgICAgICAgaWQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShjaCk7XG5cbiAgICAgICAgICAgIC8vICdcXHUnIChVKzAwNUMsIFUrMDA3NSkgZGVub3RlcyBhbiBlc2NhcGVkIGNoYXJhY3Rlci5cbiAgICAgICAgICAgIGlmIChjaCA9PT0gMHg1Qykge1xuICAgICAgICAgICAgICAgIGlkID0gaWQuc3Vic3RyKDAsIGlkLmxlbmd0aCAtIDEpO1xuICAgICAgICAgICAgICAgIGlmIChzb3VyY2UuY2hhckNvZGVBdChpbmRleCkgIT09IDB4NzUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3dVbmV4cGVjdGVkVG9rZW4oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgKytpbmRleDtcbiAgICAgICAgICAgICAgICBjaCA9IHNjYW5IZXhFc2NhcGUoJ3UnKTtcbiAgICAgICAgICAgICAgICBpZiAoIWNoIHx8IGNoID09PSAnXFxcXCcgfHwgIWlzSWRlbnRpZmllclBhcnQoY2guY2hhckNvZGVBdCgwKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3dVbmV4cGVjdGVkVG9rZW4oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWQgKz0gY2g7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gaWQ7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0SWRlbnRpZmllcigpIHtcbiAgICAgICAgdmFyIHN0YXJ0LCBjaDtcblxuICAgICAgICBzdGFydCA9IGluZGV4Kys7XG4gICAgICAgIHdoaWxlIChpbmRleCA8IGxlbmd0aCkge1xuICAgICAgICAgICAgY2ggPSBzb3VyY2UuY2hhckNvZGVBdChpbmRleCk7XG4gICAgICAgICAgICBpZiAoY2ggPT09IDB4NUMpIHtcbiAgICAgICAgICAgICAgICAvLyBCbGFja3NsYXNoIChVKzAwNUMpIG1hcmtzIFVuaWNvZGUgZXNjYXBlIHNlcXVlbmNlLlxuICAgICAgICAgICAgICAgIGluZGV4ID0gc3RhcnQ7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGdldEVzY2FwZWRJZGVudGlmaWVyKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaXNJZGVudGlmaWVyUGFydChjaCkpIHtcbiAgICAgICAgICAgICAgICArK2luZGV4O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzb3VyY2Uuc2xpY2Uoc3RhcnQsIGluZGV4KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzY2FuSWRlbnRpZmllcigpIHtcbiAgICAgICAgdmFyIHN0YXJ0LCBpZCwgdHlwZTtcblxuICAgICAgICBzdGFydCA9IGluZGV4O1xuXG4gICAgICAgIC8vIEJhY2tzbGFzaCAoVSswMDVDKSBzdGFydHMgYW4gZXNjYXBlZCBjaGFyYWN0ZXIuXG4gICAgICAgIGlkID0gKHNvdXJjZS5jaGFyQ29kZUF0KGluZGV4KSA9PT0gMHg1QykgPyBnZXRFc2NhcGVkSWRlbnRpZmllcigpIDogZ2V0SWRlbnRpZmllcigpO1xuXG4gICAgICAgIC8vIFRoZXJlIGlzIG5vIGtleXdvcmQgb3IgbGl0ZXJhbCB3aXRoIG9ubHkgb25lIGNoYXJhY3Rlci5cbiAgICAgICAgLy8gVGh1cywgaXQgbXVzdCBiZSBhbiBpZGVudGlmaWVyLlxuICAgICAgICBpZiAoaWQubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICB0eXBlID0gVG9rZW4uSWRlbnRpZmllcjtcbiAgICAgICAgfSBlbHNlIGlmIChpc0tleXdvcmQoaWQpKSB7XG4gICAgICAgICAgICB0eXBlID0gVG9rZW4uS2V5d29yZDtcbiAgICAgICAgfSBlbHNlIGlmIChpZCA9PT0gJ251bGwnKSB7XG4gICAgICAgICAgICB0eXBlID0gVG9rZW4uTnVsbExpdGVyYWw7XG4gICAgICAgIH0gZWxzZSBpZiAoaWQgPT09ICd0cnVlJyB8fCBpZCA9PT0gJ2ZhbHNlJykge1xuICAgICAgICAgICAgdHlwZSA9IFRva2VuLkJvb2xlYW5MaXRlcmFsO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdHlwZSA9IFRva2VuLklkZW50aWZpZXI7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdHlwZTogdHlwZSxcbiAgICAgICAgICAgIHZhbHVlOiBpZCxcbiAgICAgICAgICAgIGxpbmVOdW1iZXI6IGxpbmVOdW1iZXIsXG4gICAgICAgICAgICBsaW5lU3RhcnQ6IGxpbmVTdGFydCxcbiAgICAgICAgICAgIHN0YXJ0OiBzdGFydCxcbiAgICAgICAgICAgIGVuZDogaW5kZXhcbiAgICAgICAgfTtcbiAgICB9XG5cblxuICAgIC8vIDcuNyBQdW5jdHVhdG9yc1xuXG4gICAgZnVuY3Rpb24gc2NhblB1bmN0dWF0b3IoKSB7XG4gICAgICAgIHZhciB0b2tlbiwgc3RyO1xuXG4gICAgICAgIHRva2VuID0ge1xuICAgICAgICAgICAgdHlwZTogVG9rZW4uUHVuY3R1YXRvcixcbiAgICAgICAgICAgIHZhbHVlOiAnJyxcbiAgICAgICAgICAgIGxpbmVOdW1iZXI6IGxpbmVOdW1iZXIsXG4gICAgICAgICAgICBsaW5lU3RhcnQ6IGxpbmVTdGFydCxcbiAgICAgICAgICAgIHN0YXJ0OiBpbmRleCxcbiAgICAgICAgICAgIGVuZDogaW5kZXhcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBDaGVjayBmb3IgbW9zdCBjb21tb24gc2luZ2xlLWNoYXJhY3RlciBwdW5jdHVhdG9ycy5cbiAgICAgICAgc3RyID0gc291cmNlW2luZGV4XTtcbiAgICAgICAgc3dpdGNoIChzdHIpIHtcblxuICAgICAgICBjYXNlICcoJzpcbiAgICAgICAgICAgIGlmIChleHRyYS50b2tlbml6ZSkge1xuICAgICAgICAgICAgICAgIGV4dHJhLm9wZW5QYXJlblRva2VuID0gZXh0cmEudG9rZW5zLmxlbmd0aDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgICsraW5kZXg7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlICd7JzpcbiAgICAgICAgICAgIGlmIChleHRyYS50b2tlbml6ZSkge1xuICAgICAgICAgICAgICAgIGV4dHJhLm9wZW5DdXJseVRva2VuID0gZXh0cmEudG9rZW5zLmxlbmd0aDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN0YXRlLmN1cmx5U3RhY2sucHVzaCgneycpO1xuICAgICAgICAgICAgKytpbmRleDtcbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgJy4nOlxuICAgICAgICAgICAgKytpbmRleDtcbiAgICAgICAgICAgIGlmIChzb3VyY2VbaW5kZXhdID09PSAnLicgJiYgc291cmNlW2luZGV4ICsgMV0gPT09ICcuJykge1xuICAgICAgICAgICAgICAgIC8vIFNwcmVhZCBvcGVyYXRvcjogLi4uXG4gICAgICAgICAgICAgICAgaW5kZXggKz0gMjtcbiAgICAgICAgICAgICAgICBzdHIgPSAnLi4uJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgJ30nOlxuICAgICAgICAgICAgKytpbmRleDtcbiAgICAgICAgICAgIHN0YXRlLmN1cmx5U3RhY2sucG9wKCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnKSc6XG4gICAgICAgIGNhc2UgJzsnOlxuICAgICAgICBjYXNlICcsJzpcbiAgICAgICAgY2FzZSAnWyc6XG4gICAgICAgIGNhc2UgJ10nOlxuICAgICAgICBjYXNlICc6JzpcbiAgICAgICAgY2FzZSAnPyc6XG4gICAgICAgIGNhc2UgJ34nOlxuICAgICAgICAgICAgKytpbmRleDtcbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAvLyA0LWNoYXJhY3RlciBwdW5jdHVhdG9yLlxuICAgICAgICAgICAgc3RyID0gc291cmNlLnN1YnN0cihpbmRleCwgNCk7XG4gICAgICAgICAgICBpZiAoc3RyID09PSAnPj4+PScpIHtcbiAgICAgICAgICAgICAgICBpbmRleCArPSA0O1xuICAgICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgICAgIC8vIDMtY2hhcmFjdGVyIHB1bmN0dWF0b3JzLlxuICAgICAgICAgICAgICAgIHN0ciA9IHN0ci5zdWJzdHIoMCwgMyk7XG4gICAgICAgICAgICAgICAgaWYgKHN0ciA9PT0gJz09PScgfHwgc3RyID09PSAnIT09JyB8fCBzdHIgPT09ICc+Pj4nIHx8XG4gICAgICAgICAgICAgICAgICAgIHN0ciA9PT0gJzw8PScgfHwgc3RyID09PSAnPj49Jykge1xuICAgICAgICAgICAgICAgICAgICBpbmRleCArPSAzO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gMi1jaGFyYWN0ZXIgcHVuY3R1YXRvcnMuXG4gICAgICAgICAgICAgICAgICAgIHN0ciA9IHN0ci5zdWJzdHIoMCwgMik7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzdHIgPT09ICcmJicgfHwgc3RyID09PSAnfHwnIHx8IHN0ciA9PT0gJz09JyB8fCBzdHIgPT09ICchPScgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0ciA9PT0gJys9JyB8fCBzdHIgPT09ICctPScgfHwgc3RyID09PSAnKj0nIHx8IHN0ciA9PT0gJy89JyB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgc3RyID09PSAnKysnIHx8IHN0ciA9PT0gJy0tJyB8fCBzdHIgPT09ICc8PCcgfHwgc3RyID09PSAnPj4nIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICBzdHIgPT09ICcmPScgfHwgc3RyID09PSAnfD0nIHx8IHN0ciA9PT0gJ149JyB8fCBzdHIgPT09ICclPScgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0ciA9PT0gJzw9JyB8fCBzdHIgPT09ICc+PScgfHwgc3RyID09PSAnPT4nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbmRleCArPSAyO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAxLWNoYXJhY3RlciBwdW5jdHVhdG9ycy5cbiAgICAgICAgICAgICAgICAgICAgICAgIHN0ciA9IHNvdXJjZVtpbmRleF07XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoJzw+PSErLSolJnxeLycuaW5kZXhPZihzdHIpID49IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICArK2luZGV4O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGluZGV4ID09PSB0b2tlbi5zdGFydCkge1xuICAgICAgICAgICAgdGhyb3dVbmV4cGVjdGVkVG9rZW4oKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRva2VuLmVuZCA9IGluZGV4O1xuICAgICAgICB0b2tlbi52YWx1ZSA9IHN0cjtcbiAgICAgICAgcmV0dXJuIHRva2VuO1xuICAgIH1cblxuICAgIC8vIDcuOC4zIE51bWVyaWMgTGl0ZXJhbHNcblxuICAgIGZ1bmN0aW9uIHNjYW5IZXhMaXRlcmFsKHN0YXJ0KSB7XG4gICAgICAgIHZhciBudW1iZXIgPSAnJztcblxuICAgICAgICB3aGlsZSAoaW5kZXggPCBsZW5ndGgpIHtcbiAgICAgICAgICAgIGlmICghaXNIZXhEaWdpdChzb3VyY2VbaW5kZXhdKSkge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbnVtYmVyICs9IHNvdXJjZVtpbmRleCsrXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChudW1iZXIubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICB0aHJvd1VuZXhwZWN0ZWRUb2tlbigpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGlzSWRlbnRpZmllclN0YXJ0KHNvdXJjZS5jaGFyQ29kZUF0KGluZGV4KSkpIHtcbiAgICAgICAgICAgIHRocm93VW5leHBlY3RlZFRva2VuKCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdHlwZTogVG9rZW4uTnVtZXJpY0xpdGVyYWwsXG4gICAgICAgICAgICB2YWx1ZTogcGFyc2VJbnQoJzB4JyArIG51bWJlciwgMTYpLFxuICAgICAgICAgICAgbGluZU51bWJlcjogbGluZU51bWJlcixcbiAgICAgICAgICAgIGxpbmVTdGFydDogbGluZVN0YXJ0LFxuICAgICAgICAgICAgc3RhcnQ6IHN0YXJ0LFxuICAgICAgICAgICAgZW5kOiBpbmRleFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNjYW5CaW5hcnlMaXRlcmFsKHN0YXJ0KSB7XG4gICAgICAgIHZhciBjaCwgbnVtYmVyO1xuXG4gICAgICAgIG51bWJlciA9ICcnO1xuXG4gICAgICAgIHdoaWxlIChpbmRleCA8IGxlbmd0aCkge1xuICAgICAgICAgICAgY2ggPSBzb3VyY2VbaW5kZXhdO1xuICAgICAgICAgICAgaWYgKGNoICE9PSAnMCcgJiYgY2ggIT09ICcxJykge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbnVtYmVyICs9IHNvdXJjZVtpbmRleCsrXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChudW1iZXIubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAvLyBvbmx5IDBiIG9yIDBCXG4gICAgICAgICAgICB0aHJvd1VuZXhwZWN0ZWRUb2tlbigpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGluZGV4IDwgbGVuZ3RoKSB7XG4gICAgICAgICAgICBjaCA9IHNvdXJjZS5jaGFyQ29kZUF0KGluZGV4KTtcbiAgICAgICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG4gICAgICAgICAgICBpZiAoaXNJZGVudGlmaWVyU3RhcnQoY2gpIHx8IGlzRGVjaW1hbERpZ2l0KGNoKSkge1xuICAgICAgICAgICAgICAgIHRocm93VW5leHBlY3RlZFRva2VuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdHlwZTogVG9rZW4uTnVtZXJpY0xpdGVyYWwsXG4gICAgICAgICAgICB2YWx1ZTogcGFyc2VJbnQobnVtYmVyLCAyKSxcbiAgICAgICAgICAgIGxpbmVOdW1iZXI6IGxpbmVOdW1iZXIsXG4gICAgICAgICAgICBsaW5lU3RhcnQ6IGxpbmVTdGFydCxcbiAgICAgICAgICAgIHN0YXJ0OiBzdGFydCxcbiAgICAgICAgICAgIGVuZDogaW5kZXhcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzY2FuT2N0YWxMaXRlcmFsKHByZWZpeCwgc3RhcnQpIHtcbiAgICAgICAgdmFyIG51bWJlciwgb2N0YWw7XG5cbiAgICAgICAgaWYgKGlzT2N0YWxEaWdpdChwcmVmaXgpKSB7XG4gICAgICAgICAgICBvY3RhbCA9IHRydWU7XG4gICAgICAgICAgICBudW1iZXIgPSAnMCcgKyBzb3VyY2VbaW5kZXgrK107XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvY3RhbCA9IGZhbHNlO1xuICAgICAgICAgICAgKytpbmRleDtcbiAgICAgICAgICAgIG51bWJlciA9ICcnO1xuICAgICAgICB9XG5cbiAgICAgICAgd2hpbGUgKGluZGV4IDwgbGVuZ3RoKSB7XG4gICAgICAgICAgICBpZiAoIWlzT2N0YWxEaWdpdChzb3VyY2VbaW5kZXhdKSkge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbnVtYmVyICs9IHNvdXJjZVtpbmRleCsrXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghb2N0YWwgJiYgbnVtYmVyLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgLy8gb25seSAwbyBvciAwT1xuICAgICAgICAgICAgdGhyb3dVbmV4cGVjdGVkVG9rZW4oKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpc0lkZW50aWZpZXJTdGFydChzb3VyY2UuY2hhckNvZGVBdChpbmRleCkpIHx8IGlzRGVjaW1hbERpZ2l0KHNvdXJjZS5jaGFyQ29kZUF0KGluZGV4KSkpIHtcbiAgICAgICAgICAgIHRocm93VW5leHBlY3RlZFRva2VuKCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdHlwZTogVG9rZW4uTnVtZXJpY0xpdGVyYWwsXG4gICAgICAgICAgICB2YWx1ZTogcGFyc2VJbnQobnVtYmVyLCA4KSxcbiAgICAgICAgICAgIG9jdGFsOiBvY3RhbCxcbiAgICAgICAgICAgIGxpbmVOdW1iZXI6IGxpbmVOdW1iZXIsXG4gICAgICAgICAgICBsaW5lU3RhcnQ6IGxpbmVTdGFydCxcbiAgICAgICAgICAgIHN0YXJ0OiBzdGFydCxcbiAgICAgICAgICAgIGVuZDogaW5kZXhcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc0ltcGxpY2l0T2N0YWxMaXRlcmFsKCkge1xuICAgICAgICB2YXIgaSwgY2g7XG5cbiAgICAgICAgLy8gSW1wbGljaXQgb2N0YWwsIHVubGVzcyB0aGVyZSBpcyBhIG5vbi1vY3RhbCBkaWdpdC5cbiAgICAgICAgLy8gKEFubmV4IEIuMS4xIG9uIE51bWVyaWMgTGl0ZXJhbHMpXG4gICAgICAgIGZvciAoaSA9IGluZGV4ICsgMTsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICBjaCA9IHNvdXJjZVtpXTtcbiAgICAgICAgICAgIGlmIChjaCA9PT0gJzgnIHx8IGNoID09PSAnOScpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIWlzT2N0YWxEaWdpdChjaCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNjYW5OdW1lcmljTGl0ZXJhbCgpIHtcbiAgICAgICAgdmFyIG51bWJlciwgc3RhcnQsIGNoO1xuXG4gICAgICAgIGNoID0gc291cmNlW2luZGV4XTtcbiAgICAgICAgYXNzZXJ0KGlzRGVjaW1hbERpZ2l0KGNoLmNoYXJDb2RlQXQoMCkpIHx8IChjaCA9PT0gJy4nKSxcbiAgICAgICAgICAgICdOdW1lcmljIGxpdGVyYWwgbXVzdCBzdGFydCB3aXRoIGEgZGVjaW1hbCBkaWdpdCBvciBhIGRlY2ltYWwgcG9pbnQnKTtcblxuICAgICAgICBzdGFydCA9IGluZGV4O1xuICAgICAgICBudW1iZXIgPSAnJztcbiAgICAgICAgaWYgKGNoICE9PSAnLicpIHtcbiAgICAgICAgICAgIG51bWJlciA9IHNvdXJjZVtpbmRleCsrXTtcbiAgICAgICAgICAgIGNoID0gc291cmNlW2luZGV4XTtcblxuICAgICAgICAgICAgLy8gSGV4IG51bWJlciBzdGFydHMgd2l0aCAnMHgnLlxuICAgICAgICAgICAgLy8gT2N0YWwgbnVtYmVyIHN0YXJ0cyB3aXRoICcwJy5cbiAgICAgICAgICAgIC8vIE9jdGFsIG51bWJlciBpbiBFUzYgc3RhcnRzIHdpdGggJzBvJy5cbiAgICAgICAgICAgIC8vIEJpbmFyeSBudW1iZXIgaW4gRVM2IHN0YXJ0cyB3aXRoICcwYicuXG4gICAgICAgICAgICBpZiAobnVtYmVyID09PSAnMCcpIHtcbiAgICAgICAgICAgICAgICBpZiAoY2ggPT09ICd4JyB8fCBjaCA9PT0gJ1gnKSB7XG4gICAgICAgICAgICAgICAgICAgICsraW5kZXg7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzY2FuSGV4TGl0ZXJhbChzdGFydCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChjaCA9PT0gJ2InIHx8IGNoID09PSAnQicpIHtcbiAgICAgICAgICAgICAgICAgICAgKytpbmRleDtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNjYW5CaW5hcnlMaXRlcmFsKHN0YXJ0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGNoID09PSAnbycgfHwgY2ggPT09ICdPJykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2Nhbk9jdGFsTGl0ZXJhbChjaCwgc3RhcnQpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChpc09jdGFsRGlnaXQoY2gpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpc0ltcGxpY2l0T2N0YWxMaXRlcmFsKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzY2FuT2N0YWxMaXRlcmFsKGNoLCBzdGFydCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHdoaWxlIChpc0RlY2ltYWxEaWdpdChzb3VyY2UuY2hhckNvZGVBdChpbmRleCkpKSB7XG4gICAgICAgICAgICAgICAgbnVtYmVyICs9IHNvdXJjZVtpbmRleCsrXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNoID0gc291cmNlW2luZGV4XTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjaCA9PT0gJy4nKSB7XG4gICAgICAgICAgICBudW1iZXIgKz0gc291cmNlW2luZGV4KytdO1xuICAgICAgICAgICAgd2hpbGUgKGlzRGVjaW1hbERpZ2l0KHNvdXJjZS5jaGFyQ29kZUF0KGluZGV4KSkpIHtcbiAgICAgICAgICAgICAgICBudW1iZXIgKz0gc291cmNlW2luZGV4KytdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2ggPSBzb3VyY2VbaW5kZXhdO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNoID09PSAnZScgfHwgY2ggPT09ICdFJykge1xuICAgICAgICAgICAgbnVtYmVyICs9IHNvdXJjZVtpbmRleCsrXTtcblxuICAgICAgICAgICAgY2ggPSBzb3VyY2VbaW5kZXhdO1xuICAgICAgICAgICAgaWYgKGNoID09PSAnKycgfHwgY2ggPT09ICctJykge1xuICAgICAgICAgICAgICAgIG51bWJlciArPSBzb3VyY2VbaW5kZXgrK107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaXNEZWNpbWFsRGlnaXQoc291cmNlLmNoYXJDb2RlQXQoaW5kZXgpKSkge1xuICAgICAgICAgICAgICAgIHdoaWxlIChpc0RlY2ltYWxEaWdpdChzb3VyY2UuY2hhckNvZGVBdChpbmRleCkpKSB7XG4gICAgICAgICAgICAgICAgICAgIG51bWJlciArPSBzb3VyY2VbaW5kZXgrK107XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aHJvd1VuZXhwZWN0ZWRUb2tlbigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGlzSWRlbnRpZmllclN0YXJ0KHNvdXJjZS5jaGFyQ29kZUF0KGluZGV4KSkpIHtcbiAgICAgICAgICAgIHRocm93VW5leHBlY3RlZFRva2VuKCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdHlwZTogVG9rZW4uTnVtZXJpY0xpdGVyYWwsXG4gICAgICAgICAgICB2YWx1ZTogcGFyc2VGbG9hdChudW1iZXIpLFxuICAgICAgICAgICAgbGluZU51bWJlcjogbGluZU51bWJlcixcbiAgICAgICAgICAgIGxpbmVTdGFydDogbGluZVN0YXJ0LFxuICAgICAgICAgICAgc3RhcnQ6IHN0YXJ0LFxuICAgICAgICAgICAgZW5kOiBpbmRleFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8vIDcuOC40IFN0cmluZyBMaXRlcmFsc1xuXG4gICAgZnVuY3Rpb24gc2NhblN0cmluZ0xpdGVyYWwoKSB7XG4gICAgICAgIHZhciBzdHIgPSAnJywgcXVvdGUsIHN0YXJ0LCBjaCwgdW5lc2NhcGVkLCBvY3RUb0RlYywgb2N0YWwgPSBmYWxzZTtcblxuICAgICAgICBxdW90ZSA9IHNvdXJjZVtpbmRleF07XG4gICAgICAgIGFzc2VydCgocXVvdGUgPT09ICdcXCcnIHx8IHF1b3RlID09PSAnXCInKSxcbiAgICAgICAgICAgICdTdHJpbmcgbGl0ZXJhbCBtdXN0IHN0YXJ0cyB3aXRoIGEgcXVvdGUnKTtcblxuICAgICAgICBzdGFydCA9IGluZGV4O1xuICAgICAgICArK2luZGV4O1xuXG4gICAgICAgIHdoaWxlIChpbmRleCA8IGxlbmd0aCkge1xuICAgICAgICAgICAgY2ggPSBzb3VyY2VbaW5kZXgrK107XG5cbiAgICAgICAgICAgIGlmIChjaCA9PT0gcXVvdGUpIHtcbiAgICAgICAgICAgICAgICBxdW90ZSA9ICcnO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChjaCA9PT0gJ1xcXFwnKSB7XG4gICAgICAgICAgICAgICAgY2ggPSBzb3VyY2VbaW5kZXgrK107XG4gICAgICAgICAgICAgICAgaWYgKCFjaCB8fCAhaXNMaW5lVGVybWluYXRvcihjaC5jaGFyQ29kZUF0KDApKSkge1xuICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKGNoKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ3UnOlxuICAgICAgICAgICAgICAgICAgICBjYXNlICd4JzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzb3VyY2VbaW5kZXhdID09PSAneycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICArK2luZGV4O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0ciArPSBzY2FuVW5pY29kZUNvZGVQb2ludEVzY2FwZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1bmVzY2FwZWQgPSBzY2FuSGV4RXNjYXBlKGNoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXVuZXNjYXBlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyB0aHJvd1VuZXhwZWN0ZWRUb2tlbigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHIgKz0gdW5lc2NhcGVkO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ24nOlxuICAgICAgICAgICAgICAgICAgICAgICAgc3RyICs9ICdcXG4nO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ3InOlxuICAgICAgICAgICAgICAgICAgICAgICAgc3RyICs9ICdcXHInO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ3QnOlxuICAgICAgICAgICAgICAgICAgICAgICAgc3RyICs9ICdcXHQnO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2InOlxuICAgICAgICAgICAgICAgICAgICAgICAgc3RyICs9ICdcXGInO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2YnOlxuICAgICAgICAgICAgICAgICAgICAgICAgc3RyICs9ICdcXGYnO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ3YnOlxuICAgICAgICAgICAgICAgICAgICAgICAgc3RyICs9ICdcXHgwQic7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnOCc6XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJzknOlxuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgdGhyb3dVbmV4cGVjdGVkVG9rZW4oKTtcblxuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlzT2N0YWxEaWdpdChjaCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvY3RUb0RlYyA9IG9jdGFsVG9EZWNpbWFsKGNoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9jdGFsID0gb2N0VG9EZWMub2N0YWwgfHwgb2N0YWw7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RyICs9IFN0cmluZy5mcm9tQ2hhckNvZGUob2N0VG9EZWMuY29kZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0ciArPSBjaDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgKytsaW5lTnVtYmVyO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY2ggPT09ICdcXHInICYmIHNvdXJjZVtpbmRleF0gPT09ICdcXG4nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICArK2luZGV4O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGxpbmVTdGFydCA9IGluZGV4O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaXNMaW5lVGVybWluYXRvcihjaC5jaGFyQ29kZUF0KDApKSkge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzdHIgKz0gY2g7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocXVvdGUgIT09ICcnKSB7XG4gICAgICAgICAgICB0aHJvd1VuZXhwZWN0ZWRUb2tlbigpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHR5cGU6IFRva2VuLlN0cmluZ0xpdGVyYWwsXG4gICAgICAgICAgICB2YWx1ZTogc3RyLFxuICAgICAgICAgICAgb2N0YWw6IG9jdGFsLFxuICAgICAgICAgICAgbGluZU51bWJlcjogc3RhcnRMaW5lTnVtYmVyLFxuICAgICAgICAgICAgbGluZVN0YXJ0OiBzdGFydExpbmVTdGFydCxcbiAgICAgICAgICAgIHN0YXJ0OiBzdGFydCxcbiAgICAgICAgICAgIGVuZDogaW5kZXhcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzY2FuVGVtcGxhdGUoKSB7XG4gICAgICAgIHZhciBjb29rZWQgPSAnJywgY2gsIHN0YXJ0LCByYXdPZmZzZXQsIHRlcm1pbmF0ZWQsIGhlYWQsIHRhaWwsIHJlc3RvcmUsIHVuZXNjYXBlZDtcblxuICAgICAgICB0ZXJtaW5hdGVkID0gZmFsc2U7XG4gICAgICAgIHRhaWwgPSBmYWxzZTtcbiAgICAgICAgc3RhcnQgPSBpbmRleDtcbiAgICAgICAgaGVhZCA9IChzb3VyY2VbaW5kZXhdID09PSAnYCcpO1xuICAgICAgICByYXdPZmZzZXQgPSAyO1xuXG4gICAgICAgICsraW5kZXg7XG5cbiAgICAgICAgd2hpbGUgKGluZGV4IDwgbGVuZ3RoKSB7XG4gICAgICAgICAgICBjaCA9IHNvdXJjZVtpbmRleCsrXTtcbiAgICAgICAgICAgIGlmIChjaCA9PT0gJ2AnKSB7XG4gICAgICAgICAgICAgICAgcmF3T2Zmc2V0ID0gMTtcbiAgICAgICAgICAgICAgICB0YWlsID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0ZXJtaW5hdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY2ggPT09ICckJykge1xuICAgICAgICAgICAgICAgIGlmIChzb3VyY2VbaW5kZXhdID09PSAneycpIHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdGUuY3VybHlTdGFjay5wdXNoKCckeycpO1xuICAgICAgICAgICAgICAgICAgICArK2luZGV4O1xuICAgICAgICAgICAgICAgICAgICB0ZXJtaW5hdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvb2tlZCArPSBjaDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY2ggPT09ICdcXFxcJykge1xuICAgICAgICAgICAgICAgIGNoID0gc291cmNlW2luZGV4KytdO1xuICAgICAgICAgICAgICAgIGlmICghaXNMaW5lVGVybWluYXRvcihjaC5jaGFyQ29kZUF0KDApKSkge1xuICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKGNoKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ24nOlxuICAgICAgICAgICAgICAgICAgICAgICAgY29va2VkICs9ICdcXG4nO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ3InOlxuICAgICAgICAgICAgICAgICAgICAgICAgY29va2VkICs9ICdcXHInO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ3QnOlxuICAgICAgICAgICAgICAgICAgICAgICAgY29va2VkICs9ICdcXHQnO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ3UnOlxuICAgICAgICAgICAgICAgICAgICBjYXNlICd4JzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzb3VyY2VbaW5kZXhdID09PSAneycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICArK2luZGV4O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvb2tlZCArPSBzY2FuVW5pY29kZUNvZGVQb2ludEVzY2FwZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN0b3JlID0gaW5kZXg7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5lc2NhcGVkID0gc2NhbkhleEVzY2FwZShjaCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHVuZXNjYXBlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb29rZWQgKz0gdW5lc2NhcGVkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4ID0gcmVzdG9yZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29va2VkICs9IGNoO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdiJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvb2tlZCArPSAnXFxiJztcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdmJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvb2tlZCArPSAnXFxmJztcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlICd2JzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvb2tlZCArPSAnXFx2JztcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2ggPT09ICcwJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpc0RlY2ltYWxEaWdpdChzb3VyY2UuY2hhckNvZGVBdChpbmRleCkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIElsbGVnYWw6IFxcMDEgXFwwMiBhbmQgc28gb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3dFcnJvcihNZXNzYWdlcy5UZW1wbGF0ZU9jdGFsTGl0ZXJhbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvb2tlZCArPSAnXFwwJztcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaXNPY3RhbERpZ2l0KGNoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIElsbGVnYWw6IFxcMSBcXDJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvd0Vycm9yKE1lc3NhZ2VzLlRlbXBsYXRlT2N0YWxMaXRlcmFsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29va2VkICs9IGNoO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICArK2xpbmVOdW1iZXI7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjaCA9PT0gJ1xccicgJiYgc291cmNlW2luZGV4XSA9PT0gJ1xcbicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICsraW5kZXg7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgbGluZVN0YXJ0ID0gaW5kZXg7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChpc0xpbmVUZXJtaW5hdG9yKGNoLmNoYXJDb2RlQXQoMCkpKSB7XG4gICAgICAgICAgICAgICAgKytsaW5lTnVtYmVyO1xuICAgICAgICAgICAgICAgIGlmIChjaCA9PT0gJ1xccicgJiYgc291cmNlW2luZGV4XSA9PT0gJ1xcbicpIHtcbiAgICAgICAgICAgICAgICAgICAgKytpbmRleDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbGluZVN0YXJ0ID0gaW5kZXg7XG4gICAgICAgICAgICAgICAgY29va2VkICs9ICdcXG4nO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb29rZWQgKz0gY2g7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRlcm1pbmF0ZWQpIHtcbiAgICAgICAgICAgIHRocm93VW5leHBlY3RlZFRva2VuKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWhlYWQpIHtcbiAgICAgICAgICAgIHN0YXRlLmN1cmx5U3RhY2sucG9wKCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdHlwZTogVG9rZW4uVGVtcGxhdGUsXG4gICAgICAgICAgICB2YWx1ZToge1xuICAgICAgICAgICAgICAgIGNvb2tlZDogY29va2VkLFxuICAgICAgICAgICAgICAgIHJhdzogc291cmNlLnNsaWNlKHN0YXJ0ICsgMSwgaW5kZXggLSByYXdPZmZzZXQpXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgaGVhZDogaGVhZCxcbiAgICAgICAgICAgIHRhaWw6IHRhaWwsXG4gICAgICAgICAgICBsaW5lTnVtYmVyOiBsaW5lTnVtYmVyLFxuICAgICAgICAgICAgbGluZVN0YXJ0OiBsaW5lU3RhcnQsXG4gICAgICAgICAgICBzdGFydDogc3RhcnQsXG4gICAgICAgICAgICBlbmQ6IGluZGV4XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdGVzdFJlZ0V4cChwYXR0ZXJuLCBmbGFncykge1xuICAgICAgICB2YXIgdG1wID0gcGF0dGVybjtcblxuICAgICAgICBpZiAoZmxhZ3MuaW5kZXhPZigndScpID49IDApIHtcbiAgICAgICAgICAgIC8vIFJlcGxhY2UgZWFjaCBhc3RyYWwgc3ltYm9sIGFuZCBldmVyeSBVbmljb2RlIGVzY2FwZSBzZXF1ZW5jZVxuICAgICAgICAgICAgLy8gdGhhdCBwb3NzaWJseSByZXByZXNlbnRzIGFuIGFzdHJhbCBzeW1ib2wgb3IgYSBwYWlyZWQgc3Vycm9nYXRlXG4gICAgICAgICAgICAvLyB3aXRoIGEgc2luZ2xlIEFTQ0lJIHN5bWJvbCB0byBhdm9pZCB0aHJvd2luZyBvbiByZWd1bGFyXG4gICAgICAgICAgICAvLyBleHByZXNzaW9ucyB0aGF0IGFyZSBvbmx5IHZhbGlkIGluIGNvbWJpbmF0aW9uIHdpdGggdGhlIGAvdWBcbiAgICAgICAgICAgIC8vIGZsYWcuXG4gICAgICAgICAgICAvLyBOb3RlOiByZXBsYWNpbmcgd2l0aCB0aGUgQVNDSUkgc3ltYm9sIGB4YCBtaWdodCBjYXVzZSBmYWxzZVxuICAgICAgICAgICAgLy8gbmVnYXRpdmVzIGluIHVubGlrZWx5IHNjZW5hcmlvcy4gRm9yIGV4YW1wbGUsIGBbXFx1ezYxfS1iXWAgaXMgYVxuICAgICAgICAgICAgLy8gcGVyZmVjdGx5IHZhbGlkIHBhdHRlcm4gdGhhdCBpcyBlcXVpdmFsZW50IHRvIGBbYS1iXWAsIGJ1dCBpdFxuICAgICAgICAgICAgLy8gd291bGQgYmUgcmVwbGFjZWQgYnkgYFt4LWJdYCB3aGljaCB0aHJvd3MgYW4gZXJyb3IuXG4gICAgICAgICAgICB0bXAgPSB0bXBcbiAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFxcXHVcXHsoWzAtOWEtZkEtRl0rKVxcfS9nLCBmdW5jdGlvbiAoJDAsICQxKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwYXJzZUludCgkMSwgMTYpIDw9IDB4MTBGRkZGKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJ3gnO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRocm93VW5leHBlY3RlZFRva2VuKG51bGwsIE1lc3NhZ2VzLkludmFsaWRSZWdFeHApO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnJlcGxhY2UoXG4gICAgICAgICAgICAgICAgICAgIC9cXFxcdShbYS1mQS1GMC05XXs0fSl8W1xcdUQ4MDAtXFx1REJGRl1bXFx1REMwMC1cXHVERkZGXS9nLFxuICAgICAgICAgICAgICAgICAgICAneCdcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gRmlyc3QsIGRldGVjdCBpbnZhbGlkIHJlZ3VsYXIgZXhwcmVzc2lvbnMuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBSZWdFeHAodG1wKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgdGhyb3dVbmV4cGVjdGVkVG9rZW4obnVsbCwgTWVzc2FnZXMuSW52YWxpZFJlZ0V4cCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBSZXR1cm4gYSByZWd1bGFyIGV4cHJlc3Npb24gb2JqZWN0IGZvciB0aGlzIHBhdHRlcm4tZmxhZyBwYWlyLCBvclxuICAgICAgICAvLyBgbnVsbGAgaW4gY2FzZSB0aGUgY3VycmVudCBlbnZpcm9ubWVudCBkb2Vzbid0IHN1cHBvcnQgdGhlIGZsYWdzIGl0XG4gICAgICAgIC8vIHVzZXMuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFJlZ0V4cChwYXR0ZXJuLCBmbGFncyk7XG4gICAgICAgIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzY2FuUmVnRXhwQm9keSgpIHtcbiAgICAgICAgdmFyIGNoLCBzdHIsIGNsYXNzTWFya2VyLCB0ZXJtaW5hdGVkLCBib2R5O1xuXG4gICAgICAgIGNoID0gc291cmNlW2luZGV4XTtcbiAgICAgICAgYXNzZXJ0KGNoID09PSAnLycsICdSZWd1bGFyIGV4cHJlc3Npb24gbGl0ZXJhbCBtdXN0IHN0YXJ0IHdpdGggYSBzbGFzaCcpO1xuICAgICAgICBzdHIgPSBzb3VyY2VbaW5kZXgrK107XG5cbiAgICAgICAgY2xhc3NNYXJrZXIgPSBmYWxzZTtcbiAgICAgICAgdGVybWluYXRlZCA9IGZhbHNlO1xuICAgICAgICB3aGlsZSAoaW5kZXggPCBsZW5ndGgpIHtcbiAgICAgICAgICAgIGNoID0gc291cmNlW2luZGV4KytdO1xuICAgICAgICAgICAgc3RyICs9IGNoO1xuICAgICAgICAgICAgaWYgKGNoID09PSAnXFxcXCcpIHtcbiAgICAgICAgICAgICAgICBjaCA9IHNvdXJjZVtpbmRleCsrXTtcbiAgICAgICAgICAgICAgICAvLyBFQ01BLTI2MiA3LjguNVxuICAgICAgICAgICAgICAgIGlmIChpc0xpbmVUZXJtaW5hdG9yKGNoLmNoYXJDb2RlQXQoMCkpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93VW5leHBlY3RlZFRva2VuKG51bGwsIE1lc3NhZ2VzLlVudGVybWluYXRlZFJlZ0V4cCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHN0ciArPSBjaDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaXNMaW5lVGVybWluYXRvcihjaC5jaGFyQ29kZUF0KDApKSkge1xuICAgICAgICAgICAgICAgIHRocm93VW5leHBlY3RlZFRva2VuKG51bGwsIE1lc3NhZ2VzLlVudGVybWluYXRlZFJlZ0V4cCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNsYXNzTWFya2VyKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNoID09PSAnXScpIHtcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NNYXJrZXIgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChjaCA9PT0gJy8nKSB7XG4gICAgICAgICAgICAgICAgICAgIHRlcm1pbmF0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGNoID09PSAnWycpIHtcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NNYXJrZXIgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGVybWluYXRlZCkge1xuICAgICAgICAgICAgdGhyb3dVbmV4cGVjdGVkVG9rZW4obnVsbCwgTWVzc2FnZXMuVW50ZXJtaW5hdGVkUmVnRXhwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEV4Y2x1ZGUgbGVhZGluZyBhbmQgdHJhaWxpbmcgc2xhc2guXG4gICAgICAgIGJvZHkgPSBzdHIuc3Vic3RyKDEsIHN0ci5sZW5ndGggLSAyKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHZhbHVlOiBib2R5LFxuICAgICAgICAgICAgbGl0ZXJhbDogc3RyXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2NhblJlZ0V4cEZsYWdzKCkge1xuICAgICAgICB2YXIgY2gsIHN0ciwgZmxhZ3MsIHJlc3RvcmU7XG5cbiAgICAgICAgc3RyID0gJyc7XG4gICAgICAgIGZsYWdzID0gJyc7XG4gICAgICAgIHdoaWxlIChpbmRleCA8IGxlbmd0aCkge1xuICAgICAgICAgICAgY2ggPSBzb3VyY2VbaW5kZXhdO1xuICAgICAgICAgICAgaWYgKCFpc0lkZW50aWZpZXJQYXJ0KGNoLmNoYXJDb2RlQXQoMCkpKSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICsraW5kZXg7XG4gICAgICAgICAgICBpZiAoY2ggPT09ICdcXFxcJyAmJiBpbmRleCA8IGxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGNoID0gc291cmNlW2luZGV4XTtcbiAgICAgICAgICAgICAgICBpZiAoY2ggPT09ICd1Jykge1xuICAgICAgICAgICAgICAgICAgICArK2luZGV4O1xuICAgICAgICAgICAgICAgICAgICByZXN0b3JlID0gaW5kZXg7XG4gICAgICAgICAgICAgICAgICAgIGNoID0gc2NhbkhleEVzY2FwZSgndScpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY2gpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZsYWdzICs9IGNoO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChzdHIgKz0gJ1xcXFx1JzsgcmVzdG9yZSA8IGluZGV4OyArK3Jlc3RvcmUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHIgKz0gc291cmNlW3Jlc3RvcmVdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXggPSByZXN0b3JlO1xuICAgICAgICAgICAgICAgICAgICAgICAgZmxhZ3MgKz0gJ3UnO1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RyICs9ICdcXFxcdSc7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdG9sZXJhdGVVbmV4cGVjdGVkVG9rZW4oKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBzdHIgKz0gJ1xcXFwnO1xuICAgICAgICAgICAgICAgICAgICB0b2xlcmF0ZVVuZXhwZWN0ZWRUb2tlbigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZmxhZ3MgKz0gY2g7XG4gICAgICAgICAgICAgICAgc3RyICs9IGNoO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHZhbHVlOiBmbGFncyxcbiAgICAgICAgICAgIGxpdGVyYWw6IHN0clxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNjYW5SZWdFeHAoKSB7XG4gICAgICAgIHNjYW5uaW5nID0gdHJ1ZTtcbiAgICAgICAgdmFyIHN0YXJ0LCBib2R5LCBmbGFncywgdmFsdWU7XG5cbiAgICAgICAgbG9va2FoZWFkID0gbnVsbDtcbiAgICAgICAgc2tpcENvbW1lbnQoKTtcbiAgICAgICAgc3RhcnQgPSBpbmRleDtcblxuICAgICAgICBib2R5ID0gc2NhblJlZ0V4cEJvZHkoKTtcbiAgICAgICAgZmxhZ3MgPSBzY2FuUmVnRXhwRmxhZ3MoKTtcbiAgICAgICAgdmFsdWUgPSB0ZXN0UmVnRXhwKGJvZHkudmFsdWUsIGZsYWdzLnZhbHVlKTtcbiAgICAgICAgc2Nhbm5pbmcgPSBmYWxzZTtcbiAgICAgICAgaWYgKGV4dHJhLnRva2VuaXplKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHR5cGU6IFRva2VuLlJlZ3VsYXJFeHByZXNzaW9uLFxuICAgICAgICAgICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgICAgICAgICByZWdleDoge1xuICAgICAgICAgICAgICAgICAgICBwYXR0ZXJuOiBib2R5LnZhbHVlLFxuICAgICAgICAgICAgICAgICAgICBmbGFnczogZmxhZ3MudmFsdWVcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGxpbmVOdW1iZXI6IGxpbmVOdW1iZXIsXG4gICAgICAgICAgICAgICAgbGluZVN0YXJ0OiBsaW5lU3RhcnQsXG4gICAgICAgICAgICAgICAgc3RhcnQ6IHN0YXJ0LFxuICAgICAgICAgICAgICAgIGVuZDogaW5kZXhcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbGl0ZXJhbDogYm9keS5saXRlcmFsICsgZmxhZ3MubGl0ZXJhbCxcbiAgICAgICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgICAgIHJlZ2V4OiB7XG4gICAgICAgICAgICAgICAgcGF0dGVybjogYm9keS52YWx1ZSxcbiAgICAgICAgICAgICAgICBmbGFnczogZmxhZ3MudmFsdWVcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzdGFydDogc3RhcnQsXG4gICAgICAgICAgICBlbmQ6IGluZGV4XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY29sbGVjdFJlZ2V4KCkge1xuICAgICAgICB2YXIgcG9zLCBsb2MsIHJlZ2V4LCB0b2tlbjtcblxuICAgICAgICBza2lwQ29tbWVudCgpO1xuXG4gICAgICAgIHBvcyA9IGluZGV4O1xuICAgICAgICBsb2MgPSB7XG4gICAgICAgICAgICBzdGFydDoge1xuICAgICAgICAgICAgICAgIGxpbmU6IGxpbmVOdW1iZXIsXG4gICAgICAgICAgICAgICAgY29sdW1uOiBpbmRleCAtIGxpbmVTdGFydFxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIHJlZ2V4ID0gc2NhblJlZ0V4cCgpO1xuXG4gICAgICAgIGxvYy5lbmQgPSB7XG4gICAgICAgICAgICBsaW5lOiBsaW5lTnVtYmVyLFxuICAgICAgICAgICAgY29sdW1uOiBpbmRleCAtIGxpbmVTdGFydFxuICAgICAgICB9O1xuXG4gICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICAgICAgIGlmICghZXh0cmEudG9rZW5pemUpIHtcbiAgICAgICAgICAgIC8vIFBvcCB0aGUgcHJldmlvdXMgdG9rZW4sIHdoaWNoIGlzIGxpa2VseSAnLycgb3IgJy89J1xuICAgICAgICAgICAgaWYgKGV4dHJhLnRva2Vucy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgdG9rZW4gPSBleHRyYS50b2tlbnNbZXh0cmEudG9rZW5zLmxlbmd0aCAtIDFdO1xuICAgICAgICAgICAgICAgIGlmICh0b2tlbi5yYW5nZVswXSA9PT0gcG9zICYmIHRva2VuLnR5cGUgPT09ICdQdW5jdHVhdG9yJykge1xuICAgICAgICAgICAgICAgICAgICBpZiAodG9rZW4udmFsdWUgPT09ICcvJyB8fCB0b2tlbi52YWx1ZSA9PT0gJy89Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgZXh0cmEudG9rZW5zLnBvcCgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBleHRyYS50b2tlbnMucHVzaCh7XG4gICAgICAgICAgICAgICAgdHlwZTogJ1JlZ3VsYXJFeHByZXNzaW9uJyxcbiAgICAgICAgICAgICAgICB2YWx1ZTogcmVnZXgubGl0ZXJhbCxcbiAgICAgICAgICAgICAgICByZWdleDogcmVnZXgucmVnZXgsXG4gICAgICAgICAgICAgICAgcmFuZ2U6IFtwb3MsIGluZGV4XSxcbiAgICAgICAgICAgICAgICBsb2M6IGxvY1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVnZXg7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNJZGVudGlmaWVyTmFtZSh0b2tlbikge1xuICAgICAgICByZXR1cm4gdG9rZW4udHlwZSA9PT0gVG9rZW4uSWRlbnRpZmllciB8fFxuICAgICAgICAgICAgdG9rZW4udHlwZSA9PT0gVG9rZW4uS2V5d29yZCB8fFxuICAgICAgICAgICAgdG9rZW4udHlwZSA9PT0gVG9rZW4uQm9vbGVhbkxpdGVyYWwgfHxcbiAgICAgICAgICAgIHRva2VuLnR5cGUgPT09IFRva2VuLk51bGxMaXRlcmFsO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFkdmFuY2VTbGFzaCgpIHtcbiAgICAgICAgdmFyIHByZXZUb2tlbixcbiAgICAgICAgICAgIGNoZWNrVG9rZW47XG4gICAgICAgIC8vIFVzaW5nIHRoZSBmb2xsb3dpbmcgYWxnb3JpdGhtOlxuICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vbW96aWxsYS9zd2VldC5qcy93aWtpL2Rlc2lnblxuICAgICAgICBwcmV2VG9rZW4gPSBleHRyYS50b2tlbnNbZXh0cmEudG9rZW5zLmxlbmd0aCAtIDFdO1xuICAgICAgICBpZiAoIXByZXZUb2tlbikge1xuICAgICAgICAgICAgLy8gTm90aGluZyBiZWZvcmUgdGhhdDogaXQgY2Fubm90IGJlIGEgZGl2aXNpb24uXG4gICAgICAgICAgICByZXR1cm4gY29sbGVjdFJlZ2V4KCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHByZXZUb2tlbi50eXBlID09PSAnUHVuY3R1YXRvcicpIHtcbiAgICAgICAgICAgIGlmIChwcmV2VG9rZW4udmFsdWUgPT09ICddJykge1xuICAgICAgICAgICAgICAgIHJldHVybiBzY2FuUHVuY3R1YXRvcigpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHByZXZUb2tlbi52YWx1ZSA9PT0gJyknKSB7XG4gICAgICAgICAgICAgICAgY2hlY2tUb2tlbiA9IGV4dHJhLnRva2Vuc1tleHRyYS5vcGVuUGFyZW5Ub2tlbiAtIDFdO1xuICAgICAgICAgICAgICAgIGlmIChjaGVja1Rva2VuICYmXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGVja1Rva2VuLnR5cGUgPT09ICdLZXl3b3JkJyAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgKGNoZWNrVG9rZW4udmFsdWUgPT09ICdpZicgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICBjaGVja1Rva2VuLnZhbHVlID09PSAnd2hpbGUnIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgY2hlY2tUb2tlbi52YWx1ZSA9PT0gJ2ZvcicgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICBjaGVja1Rva2VuLnZhbHVlID09PSAnd2l0aCcpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjb2xsZWN0UmVnZXgoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNjYW5QdW5jdHVhdG9yKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocHJldlRva2VuLnZhbHVlID09PSAnfScpIHtcbiAgICAgICAgICAgICAgICAvLyBEaXZpZGluZyBhIGZ1bmN0aW9uIGJ5IGFueXRoaW5nIG1ha2VzIGxpdHRsZSBzZW5zZSxcbiAgICAgICAgICAgICAgICAvLyBidXQgd2UgaGF2ZSB0byBjaGVjayBmb3IgdGhhdC5cbiAgICAgICAgICAgICAgICBpZiAoZXh0cmEudG9rZW5zW2V4dHJhLm9wZW5DdXJseVRva2VuIC0gM10gJiZcbiAgICAgICAgICAgICAgICAgICAgICAgIGV4dHJhLnRva2Vuc1tleHRyYS5vcGVuQ3VybHlUb2tlbiAtIDNdLnR5cGUgPT09ICdLZXl3b3JkJykge1xuICAgICAgICAgICAgICAgICAgICAvLyBBbm9ueW1vdXMgZnVuY3Rpb24uXG4gICAgICAgICAgICAgICAgICAgIGNoZWNrVG9rZW4gPSBleHRyYS50b2tlbnNbZXh0cmEub3BlbkN1cmx5VG9rZW4gLSA0XTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFjaGVja1Rva2VuKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2NhblB1bmN0dWF0b3IoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZXh0cmEudG9rZW5zW2V4dHJhLm9wZW5DdXJseVRva2VuIC0gNF0gJiZcbiAgICAgICAgICAgICAgICAgICAgICAgIGV4dHJhLnRva2Vuc1tleHRyYS5vcGVuQ3VybHlUb2tlbiAtIDRdLnR5cGUgPT09ICdLZXl3b3JkJykge1xuICAgICAgICAgICAgICAgICAgICAvLyBOYW1lZCBmdW5jdGlvbi5cbiAgICAgICAgICAgICAgICAgICAgY2hlY2tUb2tlbiA9IGV4dHJhLnRva2Vuc1tleHRyYS5vcGVuQ3VybHlUb2tlbiAtIDVdO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWNoZWNrVG9rZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjb2xsZWN0UmVnZXgoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzY2FuUHVuY3R1YXRvcigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBjaGVja1Rva2VuIGRldGVybWluZXMgd2hldGhlciB0aGUgZnVuY3Rpb24gaXNcbiAgICAgICAgICAgICAgICAvLyBhIGRlY2xhcmF0aW9uIG9yIGFuIGV4cHJlc3Npb24uXG4gICAgICAgICAgICAgICAgaWYgKEZuRXhwclRva2Vucy5pbmRleE9mKGNoZWNrVG9rZW4udmFsdWUpID49IDApIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gSXQgaXMgYW4gZXhwcmVzc2lvbi5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNjYW5QdW5jdHVhdG9yKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIEl0IGlzIGEgZGVjbGFyYXRpb24uXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbGxlY3RSZWdleCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGNvbGxlY3RSZWdleCgpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwcmV2VG9rZW4udHlwZSA9PT0gJ0tleXdvcmQnICYmIHByZXZUb2tlbi52YWx1ZSAhPT0gJ3RoaXMnKSB7XG4gICAgICAgICAgICByZXR1cm4gY29sbGVjdFJlZ2V4KCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHNjYW5QdW5jdHVhdG9yKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYWR2YW5jZSgpIHtcbiAgICAgICAgdmFyIGNoLCB0b2tlbjtcblxuICAgICAgICBpZiAoaW5kZXggPj0gbGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHR5cGU6IFRva2VuLkVPRixcbiAgICAgICAgICAgICAgICBsaW5lTnVtYmVyOiBsaW5lTnVtYmVyLFxuICAgICAgICAgICAgICAgIGxpbmVTdGFydDogbGluZVN0YXJ0LFxuICAgICAgICAgICAgICAgIHN0YXJ0OiBpbmRleCxcbiAgICAgICAgICAgICAgICBlbmQ6IGluZGV4XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgY2ggPSBzb3VyY2UuY2hhckNvZGVBdChpbmRleCk7XG5cbiAgICAgICAgaWYgKGlzSWRlbnRpZmllclN0YXJ0KGNoKSkge1xuICAgICAgICAgICAgdG9rZW4gPSBzY2FuSWRlbnRpZmllcigpO1xuICAgICAgICAgICAgaWYgKHN0cmljdCAmJiBpc1N0cmljdE1vZGVSZXNlcnZlZFdvcmQodG9rZW4udmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgdG9rZW4udHlwZSA9IFRva2VuLktleXdvcmQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdG9rZW47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBWZXJ5IGNvbW1vbjogKCBhbmQgKSBhbmQgO1xuICAgICAgICBpZiAoY2ggPT09IDB4MjggfHwgY2ggPT09IDB4MjkgfHwgY2ggPT09IDB4M0IpIHtcbiAgICAgICAgICAgIHJldHVybiBzY2FuUHVuY3R1YXRvcigpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gU3RyaW5nIGxpdGVyYWwgc3RhcnRzIHdpdGggc2luZ2xlIHF1b3RlIChVKzAwMjcpIG9yIGRvdWJsZSBxdW90ZSAoVSswMDIyKS5cbiAgICAgICAgaWYgKGNoID09PSAweDI3IHx8IGNoID09PSAweDIyKSB7XG4gICAgICAgICAgICByZXR1cm4gc2NhblN0cmluZ0xpdGVyYWwoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIERvdCAoLikgVSswMDJFIGNhbiBhbHNvIHN0YXJ0IGEgZmxvYXRpbmctcG9pbnQgbnVtYmVyLCBoZW5jZSB0aGUgbmVlZFxuICAgICAgICAvLyB0byBjaGVjayB0aGUgbmV4dCBjaGFyYWN0ZXIuXG4gICAgICAgIGlmIChjaCA9PT0gMHgyRSkge1xuICAgICAgICAgICAgaWYgKGlzRGVjaW1hbERpZ2l0KHNvdXJjZS5jaGFyQ29kZUF0KGluZGV4ICsgMSkpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNjYW5OdW1lcmljTGl0ZXJhbCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHNjYW5QdW5jdHVhdG9yKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXNEZWNpbWFsRGlnaXQoY2gpKSB7XG4gICAgICAgICAgICByZXR1cm4gc2Nhbk51bWVyaWNMaXRlcmFsKCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBTbGFzaCAoLykgVSswMDJGIGNhbiBhbHNvIHN0YXJ0IGEgcmVnZXguXG4gICAgICAgIGlmIChleHRyYS50b2tlbml6ZSAmJiBjaCA9PT0gMHgyRikge1xuICAgICAgICAgICAgcmV0dXJuIGFkdmFuY2VTbGFzaCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gVGVtcGxhdGUgbGl0ZXJhbHMgc3RhcnQgd2l0aCBgIChVKzAwNjApIGZvciB0ZW1wbGF0ZSBoZWFkXG4gICAgICAgIC8vIG9yIH0gKFUrMDA3RCkgZm9yIHRlbXBsYXRlIG1pZGRsZSBvciB0ZW1wbGF0ZSB0YWlsLlxuICAgICAgICBpZiAoY2ggPT09IDB4NjAgfHwgKGNoID09PSAweDdEICYmIHN0YXRlLmN1cmx5U3RhY2tbc3RhdGUuY3VybHlTdGFjay5sZW5ndGggLSAxXSA9PT0gJyR7JykpIHtcbiAgICAgICAgICAgIHJldHVybiBzY2FuVGVtcGxhdGUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzY2FuUHVuY3R1YXRvcigpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNvbGxlY3RUb2tlbigpIHtcbiAgICAgICAgdmFyIGxvYywgdG9rZW4sIHZhbHVlLCBlbnRyeTtcblxuICAgICAgICBsb2MgPSB7XG4gICAgICAgICAgICBzdGFydDoge1xuICAgICAgICAgICAgICAgIGxpbmU6IGxpbmVOdW1iZXIsXG4gICAgICAgICAgICAgICAgY29sdW1uOiBpbmRleCAtIGxpbmVTdGFydFxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIHRva2VuID0gYWR2YW5jZSgpO1xuICAgICAgICBsb2MuZW5kID0ge1xuICAgICAgICAgICAgbGluZTogbGluZU51bWJlcixcbiAgICAgICAgICAgIGNvbHVtbjogaW5kZXggLSBsaW5lU3RhcnRcbiAgICAgICAgfTtcblxuICAgICAgICBpZiAodG9rZW4udHlwZSAhPT0gVG9rZW4uRU9GKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IHNvdXJjZS5zbGljZSh0b2tlbi5zdGFydCwgdG9rZW4uZW5kKTtcbiAgICAgICAgICAgIGVudHJ5ID0ge1xuICAgICAgICAgICAgICAgIHR5cGU6IFRva2VuTmFtZVt0b2tlbi50eXBlXSxcbiAgICAgICAgICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgICAgICAgICAgcmFuZ2U6IFt0b2tlbi5zdGFydCwgdG9rZW4uZW5kXSxcbiAgICAgICAgICAgICAgICBsb2M6IGxvY1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGlmICh0b2tlbi5yZWdleCkge1xuICAgICAgICAgICAgICAgIGVudHJ5LnJlZ2V4ID0ge1xuICAgICAgICAgICAgICAgICAgICBwYXR0ZXJuOiB0b2tlbi5yZWdleC5wYXR0ZXJuLFxuICAgICAgICAgICAgICAgICAgICBmbGFnczogdG9rZW4ucmVnZXguZmxhZ3NcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZXh0cmEudG9rZW5zLnB1c2goZW50cnkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRva2VuO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxleCgpIHtcbiAgICAgICAgdmFyIHRva2VuO1xuICAgICAgICBzY2FubmluZyA9IHRydWU7XG5cbiAgICAgICAgbGFzdEluZGV4ID0gaW5kZXg7XG4gICAgICAgIGxhc3RMaW5lTnVtYmVyID0gbGluZU51bWJlcjtcbiAgICAgICAgbGFzdExpbmVTdGFydCA9IGxpbmVTdGFydDtcblxuICAgICAgICBza2lwQ29tbWVudCgpO1xuXG4gICAgICAgIHRva2VuID0gbG9va2FoZWFkO1xuXG4gICAgICAgIHN0YXJ0SW5kZXggPSBpbmRleDtcbiAgICAgICAgc3RhcnRMaW5lTnVtYmVyID0gbGluZU51bWJlcjtcbiAgICAgICAgc3RhcnRMaW5lU3RhcnQgPSBsaW5lU3RhcnQ7XG5cbiAgICAgICAgbG9va2FoZWFkID0gKHR5cGVvZiBleHRyYS50b2tlbnMgIT09ICd1bmRlZmluZWQnKSA/IGNvbGxlY3RUb2tlbigpIDogYWR2YW5jZSgpO1xuICAgICAgICBzY2FubmluZyA9IGZhbHNlO1xuICAgICAgICByZXR1cm4gdG9rZW47XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcGVlaygpIHtcbiAgICAgICAgc2Nhbm5pbmcgPSB0cnVlO1xuXG4gICAgICAgIHNraXBDb21tZW50KCk7XG5cbiAgICAgICAgbGFzdEluZGV4ID0gaW5kZXg7XG4gICAgICAgIGxhc3RMaW5lTnVtYmVyID0gbGluZU51bWJlcjtcbiAgICAgICAgbGFzdExpbmVTdGFydCA9IGxpbmVTdGFydDtcblxuICAgICAgICBzdGFydEluZGV4ID0gaW5kZXg7XG4gICAgICAgIHN0YXJ0TGluZU51bWJlciA9IGxpbmVOdW1iZXI7XG4gICAgICAgIHN0YXJ0TGluZVN0YXJ0ID0gbGluZVN0YXJ0O1xuXG4gICAgICAgIGxvb2thaGVhZCA9ICh0eXBlb2YgZXh0cmEudG9rZW5zICE9PSAndW5kZWZpbmVkJykgPyBjb2xsZWN0VG9rZW4oKSA6IGFkdmFuY2UoKTtcbiAgICAgICAgc2Nhbm5pbmcgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBQb3NpdGlvbigpIHtcbiAgICAgICAgdGhpcy5saW5lID0gc3RhcnRMaW5lTnVtYmVyO1xuICAgICAgICB0aGlzLmNvbHVtbiA9IHN0YXJ0SW5kZXggLSBzdGFydExpbmVTdGFydDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBTb3VyY2VMb2NhdGlvbigpIHtcbiAgICAgICAgdGhpcy5zdGFydCA9IG5ldyBQb3NpdGlvbigpO1xuICAgICAgICB0aGlzLmVuZCA9IG51bGw7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gV3JhcHBpbmdTb3VyY2VMb2NhdGlvbihzdGFydFRva2VuKSB7XG4gICAgICAgIHRoaXMuc3RhcnQgPSB7XG4gICAgICAgICAgICBsaW5lOiBzdGFydFRva2VuLmxpbmVOdW1iZXIsXG4gICAgICAgICAgICBjb2x1bW46IHN0YXJ0VG9rZW4uc3RhcnQgLSBzdGFydFRva2VuLmxpbmVTdGFydFxuICAgICAgICB9O1xuICAgICAgICB0aGlzLmVuZCA9IG51bGw7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gTm9kZSgpIHtcbiAgICAgICAgaWYgKGV4dHJhLnJhbmdlKSB7XG4gICAgICAgICAgICB0aGlzLnJhbmdlID0gW3N0YXJ0SW5kZXgsIDBdO1xuICAgICAgICB9XG4gICAgICAgIGlmIChleHRyYS5sb2MpIHtcbiAgICAgICAgICAgIHRoaXMubG9jID0gbmV3IFNvdXJjZUxvY2F0aW9uKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBXcmFwcGluZ05vZGUoc3RhcnRUb2tlbikge1xuICAgICAgICBpZiAoZXh0cmEucmFuZ2UpIHtcbiAgICAgICAgICAgIHRoaXMucmFuZ2UgPSBbc3RhcnRUb2tlbi5zdGFydCwgMF07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGV4dHJhLmxvYykge1xuICAgICAgICAgICAgdGhpcy5sb2MgPSBuZXcgV3JhcHBpbmdTb3VyY2VMb2NhdGlvbihzdGFydFRva2VuKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIFdyYXBwaW5nTm9kZS5wcm90b3R5cGUgPSBOb2RlLnByb3RvdHlwZSA9IHtcblxuICAgICAgICBwcm9jZXNzQ29tbWVudDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGxhc3RDaGlsZCxcbiAgICAgICAgICAgICAgICBsZWFkaW5nQ29tbWVudHMsXG4gICAgICAgICAgICAgICAgdHJhaWxpbmdDb21tZW50cyxcbiAgICAgICAgICAgICAgICBib3R0b21SaWdodCA9IGV4dHJhLmJvdHRvbVJpZ2h0U3RhY2ssXG4gICAgICAgICAgICAgICAgaSxcbiAgICAgICAgICAgICAgICBjb21tZW50LFxuICAgICAgICAgICAgICAgIGxhc3QgPSBib3R0b21SaWdodFtib3R0b21SaWdodC5sZW5ndGggLSAxXTtcblxuICAgICAgICAgICAgaWYgKHRoaXMudHlwZSA9PT0gU3ludGF4LlByb2dyYW0pIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5ib2R5Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGV4dHJhLnRyYWlsaW5nQ29tbWVudHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIHRyYWlsaW5nQ29tbWVudHMgPSBbXTtcbiAgICAgICAgICAgICAgICBmb3IgKGkgPSBleHRyYS50cmFpbGluZ0NvbW1lbnRzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbW1lbnQgPSBleHRyYS50cmFpbGluZ0NvbW1lbnRzW2ldO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY29tbWVudC5yYW5nZVswXSA+PSB0aGlzLnJhbmdlWzFdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0cmFpbGluZ0NvbW1lbnRzLnVuc2hpZnQoY29tbWVudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBleHRyYS50cmFpbGluZ0NvbW1lbnRzLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBleHRyYS50cmFpbGluZ0NvbW1lbnRzID0gW107XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChsYXN0ICYmIGxhc3QudHJhaWxpbmdDb21tZW50cyAmJiBsYXN0LnRyYWlsaW5nQ29tbWVudHNbMF0ucmFuZ2VbMF0gPj0gdGhpcy5yYW5nZVsxXSkge1xuICAgICAgICAgICAgICAgICAgICB0cmFpbGluZ0NvbW1lbnRzID0gbGFzdC50cmFpbGluZ0NvbW1lbnRzO1xuICAgICAgICAgICAgICAgICAgICBkZWxldGUgbGFzdC50cmFpbGluZ0NvbW1lbnRzO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gRWF0aW5nIHRoZSBzdGFjay5cbiAgICAgICAgICAgIGlmIChsYXN0KSB7XG4gICAgICAgICAgICAgICAgd2hpbGUgKGxhc3QgJiYgbGFzdC5yYW5nZVswXSA+PSB0aGlzLnJhbmdlWzBdKSB7XG4gICAgICAgICAgICAgICAgICAgIGxhc3RDaGlsZCA9IGxhc3Q7XG4gICAgICAgICAgICAgICAgICAgIGxhc3QgPSBib3R0b21SaWdodC5wb3AoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChsYXN0Q2hpbGQpIHtcbiAgICAgICAgICAgICAgICBpZiAobGFzdENoaWxkLmxlYWRpbmdDb21tZW50cyAmJiBsYXN0Q2hpbGQubGVhZGluZ0NvbW1lbnRzW2xhc3RDaGlsZC5sZWFkaW5nQ29tbWVudHMubGVuZ3RoIC0gMV0ucmFuZ2VbMV0gPD0gdGhpcy5yYW5nZVswXSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmxlYWRpbmdDb21tZW50cyA9IGxhc3RDaGlsZC5sZWFkaW5nQ29tbWVudHM7XG4gICAgICAgICAgICAgICAgICAgIGxhc3RDaGlsZC5sZWFkaW5nQ29tbWVudHMgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChleHRyYS5sZWFkaW5nQ29tbWVudHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGxlYWRpbmdDb21tZW50cyA9IFtdO1xuICAgICAgICAgICAgICAgIGZvciAoaSA9IGV4dHJhLmxlYWRpbmdDb21tZW50cy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICAgICAgICAgICAgICBjb21tZW50ID0gZXh0cmEubGVhZGluZ0NvbW1lbnRzW2ldO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY29tbWVudC5yYW5nZVsxXSA8PSB0aGlzLnJhbmdlWzBdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZWFkaW5nQ29tbWVudHMudW5zaGlmdChjb21tZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGV4dHJhLmxlYWRpbmdDb21tZW50cy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgaWYgKGxlYWRpbmdDb21tZW50cyAmJiBsZWFkaW5nQ29tbWVudHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIHRoaXMubGVhZGluZ0NvbW1lbnRzID0gbGVhZGluZ0NvbW1lbnRzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRyYWlsaW5nQ29tbWVudHMgJiYgdHJhaWxpbmdDb21tZW50cy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy50cmFpbGluZ0NvbW1lbnRzID0gdHJhaWxpbmdDb21tZW50cztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYm90dG9tUmlnaHQucHVzaCh0aGlzKTtcbiAgICAgICAgfSxcblxuICAgICAgICBmaW5pc2g6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmIChleHRyYS5yYW5nZSkge1xuICAgICAgICAgICAgICAgIHRoaXMucmFuZ2VbMV0gPSBsYXN0SW5kZXg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZXh0cmEubG9jKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2MuZW5kID0ge1xuICAgICAgICAgICAgICAgICAgICBsaW5lOiBsYXN0TGluZU51bWJlcixcbiAgICAgICAgICAgICAgICAgICAgY29sdW1uOiBsYXN0SW5kZXggLSBsYXN0TGluZVN0YXJ0XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBpZiAoZXh0cmEuc291cmNlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9jLnNvdXJjZSA9IGV4dHJhLnNvdXJjZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChleHRyYS5hdHRhY2hDb21tZW50KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wcm9jZXNzQ29tbWVudCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIGZpbmlzaEFycmF5RXhwcmVzc2lvbjogZnVuY3Rpb24gKGVsZW1lbnRzKSB7XG4gICAgICAgICAgICB0aGlzLnR5cGUgPSBTeW50YXguQXJyYXlFeHByZXNzaW9uO1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50cyA9IGVsZW1lbnRzO1xuICAgICAgICAgICAgdGhpcy5maW5pc2goKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9LFxuXG4gICAgICAgIGZpbmlzaEFycmF5UGF0dGVybjogZnVuY3Rpb24gKGVsZW1lbnRzKSB7XG4gICAgICAgICAgICB0aGlzLnR5cGUgPSBTeW50YXguQXJyYXlQYXR0ZXJuO1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50cyA9IGVsZW1lbnRzO1xuICAgICAgICAgICAgdGhpcy5maW5pc2goKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9LFxuXG4gICAgICAgIGZpbmlzaEFycm93RnVuY3Rpb25FeHByZXNzaW9uOiBmdW5jdGlvbiAocGFyYW1zLCBkZWZhdWx0cywgYm9keSwgZXhwcmVzc2lvbikge1xuICAgICAgICAgICAgdGhpcy50eXBlID0gU3ludGF4LkFycm93RnVuY3Rpb25FeHByZXNzaW9uO1xuICAgICAgICAgICAgdGhpcy5pZCA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLnBhcmFtcyA9IHBhcmFtcztcbiAgICAgICAgICAgIHRoaXMuZGVmYXVsdHMgPSBkZWZhdWx0cztcbiAgICAgICAgICAgIHRoaXMuYm9keSA9IGJvZHk7XG4gICAgICAgICAgICB0aGlzLmdlbmVyYXRvciA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5leHByZXNzaW9uID0gZXhwcmVzc2lvbjtcbiAgICAgICAgICAgIHRoaXMuZmluaXNoKCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSxcblxuICAgICAgICBmaW5pc2hBc3NpZ25tZW50RXhwcmVzc2lvbjogZnVuY3Rpb24gKG9wZXJhdG9yLCBsZWZ0LCByaWdodCkge1xuICAgICAgICAgICAgdGhpcy50eXBlID0gU3ludGF4LkFzc2lnbm1lbnRFeHByZXNzaW9uO1xuICAgICAgICAgICAgdGhpcy5vcGVyYXRvciA9IG9wZXJhdG9yO1xuICAgICAgICAgICAgdGhpcy5sZWZ0ID0gbGVmdDtcbiAgICAgICAgICAgIHRoaXMucmlnaHQgPSByaWdodDtcbiAgICAgICAgICAgIHRoaXMuZmluaXNoKCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSxcblxuICAgICAgICBmaW5pc2hBc3NpZ25tZW50UGF0dGVybjogZnVuY3Rpb24gKGxlZnQsIHJpZ2h0KSB7XG4gICAgICAgICAgICB0aGlzLnR5cGUgPSBTeW50YXguQXNzaWdubWVudFBhdHRlcm47XG4gICAgICAgICAgICB0aGlzLmxlZnQgPSBsZWZ0O1xuICAgICAgICAgICAgdGhpcy5yaWdodCA9IHJpZ2h0O1xuICAgICAgICAgICAgdGhpcy5maW5pc2goKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9LFxuXG4gICAgICAgIGZpbmlzaEJpbmFyeUV4cHJlc3Npb246IGZ1bmN0aW9uIChvcGVyYXRvciwgbGVmdCwgcmlnaHQpIHtcbiAgICAgICAgICAgIHRoaXMudHlwZSA9IChvcGVyYXRvciA9PT0gJ3x8JyB8fCBvcGVyYXRvciA9PT0gJyYmJykgPyBTeW50YXguTG9naWNhbEV4cHJlc3Npb24gOiBTeW50YXguQmluYXJ5RXhwcmVzc2lvbjtcbiAgICAgICAgICAgIHRoaXMub3BlcmF0b3IgPSBvcGVyYXRvcjtcbiAgICAgICAgICAgIHRoaXMubGVmdCA9IGxlZnQ7XG4gICAgICAgICAgICB0aGlzLnJpZ2h0ID0gcmlnaHQ7XG4gICAgICAgICAgICB0aGlzLmZpbmlzaCgpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZmluaXNoQmxvY2tTdGF0ZW1lbnQ6IGZ1bmN0aW9uIChib2R5KSB7XG4gICAgICAgICAgICB0aGlzLnR5cGUgPSBTeW50YXguQmxvY2tTdGF0ZW1lbnQ7XG4gICAgICAgICAgICB0aGlzLmJvZHkgPSBib2R5O1xuICAgICAgICAgICAgdGhpcy5maW5pc2goKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9LFxuXG4gICAgICAgIGZpbmlzaEJyZWFrU3RhdGVtZW50OiBmdW5jdGlvbiAobGFiZWwpIHtcbiAgICAgICAgICAgIHRoaXMudHlwZSA9IFN5bnRheC5CcmVha1N0YXRlbWVudDtcbiAgICAgICAgICAgIHRoaXMubGFiZWwgPSBsYWJlbDtcbiAgICAgICAgICAgIHRoaXMuZmluaXNoKCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSxcblxuICAgICAgICBmaW5pc2hDYWxsRXhwcmVzc2lvbjogZnVuY3Rpb24gKGNhbGxlZSwgYXJncykge1xuICAgICAgICAgICAgdGhpcy50eXBlID0gU3ludGF4LkNhbGxFeHByZXNzaW9uO1xuICAgICAgICAgICAgdGhpcy5jYWxsZWUgPSBjYWxsZWU7XG4gICAgICAgICAgICB0aGlzLmFyZ3VtZW50cyA9IGFyZ3M7XG4gICAgICAgICAgICB0aGlzLmZpbmlzaCgpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZmluaXNoQ2F0Y2hDbGF1c2U6IGZ1bmN0aW9uIChwYXJhbSwgYm9keSkge1xuICAgICAgICAgICAgdGhpcy50eXBlID0gU3ludGF4LkNhdGNoQ2xhdXNlO1xuICAgICAgICAgICAgdGhpcy5wYXJhbSA9IHBhcmFtO1xuICAgICAgICAgICAgdGhpcy5ib2R5ID0gYm9keTtcbiAgICAgICAgICAgIHRoaXMuZmluaXNoKCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSxcblxuICAgICAgICBmaW5pc2hDbGFzc0JvZHk6IGZ1bmN0aW9uIChib2R5KSB7XG4gICAgICAgICAgICB0aGlzLnR5cGUgPSBTeW50YXguQ2xhc3NCb2R5O1xuICAgICAgICAgICAgdGhpcy5ib2R5ID0gYm9keTtcbiAgICAgICAgICAgIHRoaXMuZmluaXNoKCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSxcblxuICAgICAgICBmaW5pc2hDbGFzc0RlY2xhcmF0aW9uOiBmdW5jdGlvbiAoaWQsIHN1cGVyQ2xhc3MsIGJvZHkpIHtcbiAgICAgICAgICAgIHRoaXMudHlwZSA9IFN5bnRheC5DbGFzc0RlY2xhcmF0aW9uO1xuICAgICAgICAgICAgdGhpcy5pZCA9IGlkO1xuICAgICAgICAgICAgdGhpcy5zdXBlckNsYXNzID0gc3VwZXJDbGFzcztcbiAgICAgICAgICAgIHRoaXMuYm9keSA9IGJvZHk7XG4gICAgICAgICAgICB0aGlzLmZpbmlzaCgpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZmluaXNoQ2xhc3NFeHByZXNzaW9uOiBmdW5jdGlvbiAoaWQsIHN1cGVyQ2xhc3MsIGJvZHkpIHtcbiAgICAgICAgICAgIHRoaXMudHlwZSA9IFN5bnRheC5DbGFzc0V4cHJlc3Npb247XG4gICAgICAgICAgICB0aGlzLmlkID0gaWQ7XG4gICAgICAgICAgICB0aGlzLnN1cGVyQ2xhc3MgPSBzdXBlckNsYXNzO1xuICAgICAgICAgICAgdGhpcy5ib2R5ID0gYm9keTtcbiAgICAgICAgICAgIHRoaXMuZmluaXNoKCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSxcblxuICAgICAgICBmaW5pc2hDb25kaXRpb25hbEV4cHJlc3Npb246IGZ1bmN0aW9uICh0ZXN0LCBjb25zZXF1ZW50LCBhbHRlcm5hdGUpIHtcbiAgICAgICAgICAgIHRoaXMudHlwZSA9IFN5bnRheC5Db25kaXRpb25hbEV4cHJlc3Npb247XG4gICAgICAgICAgICB0aGlzLnRlc3QgPSB0ZXN0O1xuICAgICAgICAgICAgdGhpcy5jb25zZXF1ZW50ID0gY29uc2VxdWVudDtcbiAgICAgICAgICAgIHRoaXMuYWx0ZXJuYXRlID0gYWx0ZXJuYXRlO1xuICAgICAgICAgICAgdGhpcy5maW5pc2goKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9LFxuXG4gICAgICAgIGZpbmlzaENvbnRpbnVlU3RhdGVtZW50OiBmdW5jdGlvbiAobGFiZWwpIHtcbiAgICAgICAgICAgIHRoaXMudHlwZSA9IFN5bnRheC5Db250aW51ZVN0YXRlbWVudDtcbiAgICAgICAgICAgIHRoaXMubGFiZWwgPSBsYWJlbDtcbiAgICAgICAgICAgIHRoaXMuZmluaXNoKCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSxcblxuICAgICAgICBmaW5pc2hEZWJ1Z2dlclN0YXRlbWVudDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy50eXBlID0gU3ludGF4LkRlYnVnZ2VyU3RhdGVtZW50O1xuICAgICAgICAgICAgdGhpcy5maW5pc2goKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9LFxuXG4gICAgICAgIGZpbmlzaERvV2hpbGVTdGF0ZW1lbnQ6IGZ1bmN0aW9uIChib2R5LCB0ZXN0KSB7XG4gICAgICAgICAgICB0aGlzLnR5cGUgPSBTeW50YXguRG9XaGlsZVN0YXRlbWVudDtcbiAgICAgICAgICAgIHRoaXMuYm9keSA9IGJvZHk7XG4gICAgICAgICAgICB0aGlzLnRlc3QgPSB0ZXN0O1xuICAgICAgICAgICAgdGhpcy5maW5pc2goKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9LFxuXG4gICAgICAgIGZpbmlzaEVtcHR5U3RhdGVtZW50OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLnR5cGUgPSBTeW50YXguRW1wdHlTdGF0ZW1lbnQ7XG4gICAgICAgICAgICB0aGlzLmZpbmlzaCgpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZmluaXNoRXhwcmVzc2lvblN0YXRlbWVudDogZnVuY3Rpb24gKGV4cHJlc3Npb24pIHtcbiAgICAgICAgICAgIHRoaXMudHlwZSA9IFN5bnRheC5FeHByZXNzaW9uU3RhdGVtZW50O1xuICAgICAgICAgICAgdGhpcy5leHByZXNzaW9uID0gZXhwcmVzc2lvbjtcbiAgICAgICAgICAgIHRoaXMuZmluaXNoKCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSxcblxuICAgICAgICBmaW5pc2hGb3JTdGF0ZW1lbnQ6IGZ1bmN0aW9uIChpbml0LCB0ZXN0LCB1cGRhdGUsIGJvZHkpIHtcbiAgICAgICAgICAgIHRoaXMudHlwZSA9IFN5bnRheC5Gb3JTdGF0ZW1lbnQ7XG4gICAgICAgICAgICB0aGlzLmluaXQgPSBpbml0O1xuICAgICAgICAgICAgdGhpcy50ZXN0ID0gdGVzdDtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlID0gdXBkYXRlO1xuICAgICAgICAgICAgdGhpcy5ib2R5ID0gYm9keTtcbiAgICAgICAgICAgIHRoaXMuZmluaXNoKCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSxcblxuICAgICAgICBmaW5pc2hGb3JJblN0YXRlbWVudDogZnVuY3Rpb24gKGxlZnQsIHJpZ2h0LCBib2R5KSB7XG4gICAgICAgICAgICB0aGlzLnR5cGUgPSBTeW50YXguRm9ySW5TdGF0ZW1lbnQ7XG4gICAgICAgICAgICB0aGlzLmxlZnQgPSBsZWZ0O1xuICAgICAgICAgICAgdGhpcy5yaWdodCA9IHJpZ2h0O1xuICAgICAgICAgICAgdGhpcy5ib2R5ID0gYm9keTtcbiAgICAgICAgICAgIHRoaXMuZWFjaCA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5maW5pc2goKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9LFxuXG4gICAgICAgIGZpbmlzaEZ1bmN0aW9uRGVjbGFyYXRpb246IGZ1bmN0aW9uIChpZCwgcGFyYW1zLCBkZWZhdWx0cywgYm9keSkge1xuICAgICAgICAgICAgdGhpcy50eXBlID0gU3ludGF4LkZ1bmN0aW9uRGVjbGFyYXRpb247XG4gICAgICAgICAgICB0aGlzLmlkID0gaWQ7XG4gICAgICAgICAgICB0aGlzLnBhcmFtcyA9IHBhcmFtcztcbiAgICAgICAgICAgIHRoaXMuZGVmYXVsdHMgPSBkZWZhdWx0cztcbiAgICAgICAgICAgIHRoaXMuYm9keSA9IGJvZHk7XG4gICAgICAgICAgICB0aGlzLmdlbmVyYXRvciA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5leHByZXNzaW9uID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLmZpbmlzaCgpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZmluaXNoRnVuY3Rpb25FeHByZXNzaW9uOiBmdW5jdGlvbiAoaWQsIHBhcmFtcywgZGVmYXVsdHMsIGJvZHkpIHtcbiAgICAgICAgICAgIHRoaXMudHlwZSA9IFN5bnRheC5GdW5jdGlvbkV4cHJlc3Npb247XG4gICAgICAgICAgICB0aGlzLmlkID0gaWQ7XG4gICAgICAgICAgICB0aGlzLnBhcmFtcyA9IHBhcmFtcztcbiAgICAgICAgICAgIHRoaXMuZGVmYXVsdHMgPSBkZWZhdWx0cztcbiAgICAgICAgICAgIHRoaXMuYm9keSA9IGJvZHk7XG4gICAgICAgICAgICB0aGlzLmdlbmVyYXRvciA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5leHByZXNzaW9uID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLmZpbmlzaCgpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZmluaXNoSWRlbnRpZmllcjogZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgICAgICAgIHRoaXMudHlwZSA9IFN5bnRheC5JZGVudGlmaWVyO1xuICAgICAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgICAgICAgIHRoaXMuZmluaXNoKCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSxcblxuICAgICAgICBmaW5pc2hJZlN0YXRlbWVudDogZnVuY3Rpb24gKHRlc3QsIGNvbnNlcXVlbnQsIGFsdGVybmF0ZSkge1xuICAgICAgICAgICAgdGhpcy50eXBlID0gU3ludGF4LklmU3RhdGVtZW50O1xuICAgICAgICAgICAgdGhpcy50ZXN0ID0gdGVzdDtcbiAgICAgICAgICAgIHRoaXMuY29uc2VxdWVudCA9IGNvbnNlcXVlbnQ7XG4gICAgICAgICAgICB0aGlzLmFsdGVybmF0ZSA9IGFsdGVybmF0ZTtcbiAgICAgICAgICAgIHRoaXMuZmluaXNoKCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSxcblxuICAgICAgICBmaW5pc2hMYWJlbGVkU3RhdGVtZW50OiBmdW5jdGlvbiAobGFiZWwsIGJvZHkpIHtcbiAgICAgICAgICAgIHRoaXMudHlwZSA9IFN5bnRheC5MYWJlbGVkU3RhdGVtZW50O1xuICAgICAgICAgICAgdGhpcy5sYWJlbCA9IGxhYmVsO1xuICAgICAgICAgICAgdGhpcy5ib2R5ID0gYm9keTtcbiAgICAgICAgICAgIHRoaXMuZmluaXNoKCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSxcblxuICAgICAgICBmaW5pc2hMaXRlcmFsOiBmdW5jdGlvbiAodG9rZW4pIHtcbiAgICAgICAgICAgIHRoaXMudHlwZSA9IFN5bnRheC5MaXRlcmFsO1xuICAgICAgICAgICAgdGhpcy52YWx1ZSA9IHRva2VuLnZhbHVlO1xuICAgICAgICAgICAgdGhpcy5yYXcgPSBzb3VyY2Uuc2xpY2UodG9rZW4uc3RhcnQsIHRva2VuLmVuZCk7XG4gICAgICAgICAgICBpZiAodG9rZW4ucmVnZXgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlZ2V4ID0gdG9rZW4ucmVnZXg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmZpbmlzaCgpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZmluaXNoTWVtYmVyRXhwcmVzc2lvbjogZnVuY3Rpb24gKGFjY2Vzc29yLCBvYmplY3QsIHByb3BlcnR5KSB7XG4gICAgICAgICAgICB0aGlzLnR5cGUgPSBTeW50YXguTWVtYmVyRXhwcmVzc2lvbjtcbiAgICAgICAgICAgIHRoaXMuY29tcHV0ZWQgPSBhY2Nlc3NvciA9PT0gJ1snO1xuICAgICAgICAgICAgdGhpcy5vYmplY3QgPSBvYmplY3Q7XG4gICAgICAgICAgICB0aGlzLnByb3BlcnR5ID0gcHJvcGVydHk7XG4gICAgICAgICAgICB0aGlzLmZpbmlzaCgpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZmluaXNoTmV3RXhwcmVzc2lvbjogZnVuY3Rpb24gKGNhbGxlZSwgYXJncykge1xuICAgICAgICAgICAgdGhpcy50eXBlID0gU3ludGF4Lk5ld0V4cHJlc3Npb247XG4gICAgICAgICAgICB0aGlzLmNhbGxlZSA9IGNhbGxlZTtcbiAgICAgICAgICAgIHRoaXMuYXJndW1lbnRzID0gYXJncztcbiAgICAgICAgICAgIHRoaXMuZmluaXNoKCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSxcblxuICAgICAgICBmaW5pc2hPYmplY3RFeHByZXNzaW9uOiBmdW5jdGlvbiAocHJvcGVydGllcykge1xuICAgICAgICAgICAgdGhpcy50eXBlID0gU3ludGF4Lk9iamVjdEV4cHJlc3Npb247XG4gICAgICAgICAgICB0aGlzLnByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzO1xuICAgICAgICAgICAgdGhpcy5maW5pc2goKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9LFxuXG4gICAgICAgIGZpbmlzaE9iamVjdFBhdHRlcm46IGZ1bmN0aW9uIChwcm9wZXJ0aWVzKSB7XG4gICAgICAgICAgICB0aGlzLnR5cGUgPSBTeW50YXguT2JqZWN0UGF0dGVybjtcbiAgICAgICAgICAgIHRoaXMucHJvcGVydGllcyA9IHByb3BlcnRpZXM7XG4gICAgICAgICAgICB0aGlzLmZpbmlzaCgpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZmluaXNoUG9zdGZpeEV4cHJlc3Npb246IGZ1bmN0aW9uIChvcGVyYXRvciwgYXJndW1lbnQpIHtcbiAgICAgICAgICAgIHRoaXMudHlwZSA9IFN5bnRheC5VcGRhdGVFeHByZXNzaW9uO1xuICAgICAgICAgICAgdGhpcy5vcGVyYXRvciA9IG9wZXJhdG9yO1xuICAgICAgICAgICAgdGhpcy5hcmd1bWVudCA9IGFyZ3VtZW50O1xuICAgICAgICAgICAgdGhpcy5wcmVmaXggPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuZmluaXNoKCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSxcblxuICAgICAgICBmaW5pc2hQcm9ncmFtOiBmdW5jdGlvbiAoYm9keSkge1xuICAgICAgICAgICAgdGhpcy50eXBlID0gU3ludGF4LlByb2dyYW07XG4gICAgICAgICAgICB0aGlzLmJvZHkgPSBib2R5O1xuICAgICAgICAgICAgaWYgKHNvdXJjZVR5cGUgPT09ICdtb2R1bGUnKSB7XG4gICAgICAgICAgICAgICAgLy8gdmVyeSByZXN0cmljdGl2ZSBmb3Igbm93XG4gICAgICAgICAgICAgICAgdGhpcy5zb3VyY2VUeXBlID0gc291cmNlVHlwZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuZmluaXNoKCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSxcblxuICAgICAgICBmaW5pc2hQcm9wZXJ0eTogZnVuY3Rpb24gKGtpbmQsIGtleSwgY29tcHV0ZWQsIHZhbHVlLCBtZXRob2QsIHNob3J0aGFuZCkge1xuICAgICAgICAgICAgdGhpcy50eXBlID0gU3ludGF4LlByb3BlcnR5O1xuICAgICAgICAgICAgdGhpcy5rZXkgPSBrZXk7XG4gICAgICAgICAgICB0aGlzLmNvbXB1dGVkID0gY29tcHV0ZWQ7XG4gICAgICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgICAgICB0aGlzLmtpbmQgPSBraW5kO1xuICAgICAgICAgICAgdGhpcy5tZXRob2QgPSBtZXRob2Q7XG4gICAgICAgICAgICB0aGlzLnNob3J0aGFuZCA9IHNob3J0aGFuZDtcbiAgICAgICAgICAgIHRoaXMuZmluaXNoKCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSxcblxuICAgICAgICBmaW5pc2hSZXN0RWxlbWVudDogZnVuY3Rpb24gKGFyZ3VtZW50KSB7XG4gICAgICAgICAgICB0aGlzLnR5cGUgPSBTeW50YXguUmVzdEVsZW1lbnQ7XG4gICAgICAgICAgICB0aGlzLmFyZ3VtZW50ID0gYXJndW1lbnQ7XG4gICAgICAgICAgICB0aGlzLmZpbmlzaCgpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZmluaXNoUmV0dXJuU3RhdGVtZW50OiBmdW5jdGlvbiAoYXJndW1lbnQpIHtcbiAgICAgICAgICAgIHRoaXMudHlwZSA9IFN5bnRheC5SZXR1cm5TdGF0ZW1lbnQ7XG4gICAgICAgICAgICB0aGlzLmFyZ3VtZW50ID0gYXJndW1lbnQ7XG4gICAgICAgICAgICB0aGlzLmZpbmlzaCgpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZmluaXNoU2VxdWVuY2VFeHByZXNzaW9uOiBmdW5jdGlvbiAoZXhwcmVzc2lvbnMpIHtcbiAgICAgICAgICAgIHRoaXMudHlwZSA9IFN5bnRheC5TZXF1ZW5jZUV4cHJlc3Npb247XG4gICAgICAgICAgICB0aGlzLmV4cHJlc3Npb25zID0gZXhwcmVzc2lvbnM7XG4gICAgICAgICAgICB0aGlzLmZpbmlzaCgpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZmluaXNoU3ByZWFkRWxlbWVudDogZnVuY3Rpb24gKGFyZ3VtZW50KSB7XG4gICAgICAgICAgICB0aGlzLnR5cGUgPSBTeW50YXguU3ByZWFkRWxlbWVudDtcbiAgICAgICAgICAgIHRoaXMuYXJndW1lbnQgPSBhcmd1bWVudDtcbiAgICAgICAgICAgIHRoaXMuZmluaXNoKCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSxcblxuICAgICAgICBmaW5pc2hTd2l0Y2hDYXNlOiBmdW5jdGlvbiAodGVzdCwgY29uc2VxdWVudCkge1xuICAgICAgICAgICAgdGhpcy50eXBlID0gU3ludGF4LlN3aXRjaENhc2U7XG4gICAgICAgICAgICB0aGlzLnRlc3QgPSB0ZXN0O1xuICAgICAgICAgICAgdGhpcy5jb25zZXF1ZW50ID0gY29uc2VxdWVudDtcbiAgICAgICAgICAgIHRoaXMuZmluaXNoKCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSxcblxuICAgICAgICBmaW5pc2hTdXBlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy50eXBlID0gU3ludGF4LlN1cGVyO1xuICAgICAgICAgICAgdGhpcy5maW5pc2goKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9LFxuXG4gICAgICAgIGZpbmlzaFN3aXRjaFN0YXRlbWVudDogZnVuY3Rpb24gKGRpc2NyaW1pbmFudCwgY2FzZXMpIHtcbiAgICAgICAgICAgIHRoaXMudHlwZSA9IFN5bnRheC5Td2l0Y2hTdGF0ZW1lbnQ7XG4gICAgICAgICAgICB0aGlzLmRpc2NyaW1pbmFudCA9IGRpc2NyaW1pbmFudDtcbiAgICAgICAgICAgIHRoaXMuY2FzZXMgPSBjYXNlcztcbiAgICAgICAgICAgIHRoaXMuZmluaXNoKCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSxcblxuICAgICAgICBmaW5pc2hUYWdnZWRUZW1wbGF0ZUV4cHJlc3Npb246IGZ1bmN0aW9uICh0YWcsIHF1YXNpKSB7XG4gICAgICAgICAgICB0aGlzLnR5cGUgPSBTeW50YXguVGFnZ2VkVGVtcGxhdGVFeHByZXNzaW9uO1xuICAgICAgICAgICAgdGhpcy50YWcgPSB0YWc7XG4gICAgICAgICAgICB0aGlzLnF1YXNpID0gcXVhc2k7XG4gICAgICAgICAgICB0aGlzLmZpbmlzaCgpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZmluaXNoVGVtcGxhdGVFbGVtZW50OiBmdW5jdGlvbiAodmFsdWUsIHRhaWwpIHtcbiAgICAgICAgICAgIHRoaXMudHlwZSA9IFN5bnRheC5UZW1wbGF0ZUVsZW1lbnQ7XG4gICAgICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgICAgICB0aGlzLnRhaWwgPSB0YWlsO1xuICAgICAgICAgICAgdGhpcy5maW5pc2goKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9LFxuXG4gICAgICAgIGZpbmlzaFRlbXBsYXRlTGl0ZXJhbDogZnVuY3Rpb24gKHF1YXNpcywgZXhwcmVzc2lvbnMpIHtcbiAgICAgICAgICAgIHRoaXMudHlwZSA9IFN5bnRheC5UZW1wbGF0ZUxpdGVyYWw7XG4gICAgICAgICAgICB0aGlzLnF1YXNpcyA9IHF1YXNpcztcbiAgICAgICAgICAgIHRoaXMuZXhwcmVzc2lvbnMgPSBleHByZXNzaW9ucztcbiAgICAgICAgICAgIHRoaXMuZmluaXNoKCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSxcblxuICAgICAgICBmaW5pc2hUaGlzRXhwcmVzc2lvbjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy50eXBlID0gU3ludGF4LlRoaXNFeHByZXNzaW9uO1xuICAgICAgICAgICAgdGhpcy5maW5pc2goKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9LFxuXG4gICAgICAgIGZpbmlzaFRocm93U3RhdGVtZW50OiBmdW5jdGlvbiAoYXJndW1lbnQpIHtcbiAgICAgICAgICAgIHRoaXMudHlwZSA9IFN5bnRheC5UaHJvd1N0YXRlbWVudDtcbiAgICAgICAgICAgIHRoaXMuYXJndW1lbnQgPSBhcmd1bWVudDtcbiAgICAgICAgICAgIHRoaXMuZmluaXNoKCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSxcblxuICAgICAgICBmaW5pc2hUcnlTdGF0ZW1lbnQ6IGZ1bmN0aW9uIChibG9jaywgaGFuZGxlciwgZmluYWxpemVyKSB7XG4gICAgICAgICAgICB0aGlzLnR5cGUgPSBTeW50YXguVHJ5U3RhdGVtZW50O1xuICAgICAgICAgICAgdGhpcy5ibG9jayA9IGJsb2NrO1xuICAgICAgICAgICAgdGhpcy5ndWFyZGVkSGFuZGxlcnMgPSBbXTtcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlcnMgPSBoYW5kbGVyID8gWyBoYW5kbGVyIF0gOiBbXTtcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlciA9IGhhbmRsZXI7XG4gICAgICAgICAgICB0aGlzLmZpbmFsaXplciA9IGZpbmFsaXplcjtcbiAgICAgICAgICAgIHRoaXMuZmluaXNoKCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSxcblxuICAgICAgICBmaW5pc2hVbmFyeUV4cHJlc3Npb246IGZ1bmN0aW9uIChvcGVyYXRvciwgYXJndW1lbnQpIHtcbiAgICAgICAgICAgIHRoaXMudHlwZSA9IChvcGVyYXRvciA9PT0gJysrJyB8fCBvcGVyYXRvciA9PT0gJy0tJykgPyBTeW50YXguVXBkYXRlRXhwcmVzc2lvbiA6IFN5bnRheC5VbmFyeUV4cHJlc3Npb247XG4gICAgICAgICAgICB0aGlzLm9wZXJhdG9yID0gb3BlcmF0b3I7XG4gICAgICAgICAgICB0aGlzLmFyZ3VtZW50ID0gYXJndW1lbnQ7XG4gICAgICAgICAgICB0aGlzLnByZWZpeCA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLmZpbmlzaCgpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZmluaXNoVmFyaWFibGVEZWNsYXJhdGlvbjogZnVuY3Rpb24gKGRlY2xhcmF0aW9ucykge1xuICAgICAgICAgICAgdGhpcy50eXBlID0gU3ludGF4LlZhcmlhYmxlRGVjbGFyYXRpb247XG4gICAgICAgICAgICB0aGlzLmRlY2xhcmF0aW9ucyA9IGRlY2xhcmF0aW9ucztcbiAgICAgICAgICAgIHRoaXMua2luZCA9ICd2YXInO1xuICAgICAgICAgICAgdGhpcy5maW5pc2goKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9LFxuXG4gICAgICAgIGZpbmlzaExleGljYWxEZWNsYXJhdGlvbjogZnVuY3Rpb24gKGRlY2xhcmF0aW9ucywga2luZCkge1xuICAgICAgICAgICAgdGhpcy50eXBlID0gU3ludGF4LlZhcmlhYmxlRGVjbGFyYXRpb247XG4gICAgICAgICAgICB0aGlzLmRlY2xhcmF0aW9ucyA9IGRlY2xhcmF0aW9ucztcbiAgICAgICAgICAgIHRoaXMua2luZCA9IGtpbmQ7XG4gICAgICAgICAgICB0aGlzLmZpbmlzaCgpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZmluaXNoVmFyaWFibGVEZWNsYXJhdG9yOiBmdW5jdGlvbiAoaWQsIGluaXQpIHtcbiAgICAgICAgICAgIHRoaXMudHlwZSA9IFN5bnRheC5WYXJpYWJsZURlY2xhcmF0b3I7XG4gICAgICAgICAgICB0aGlzLmlkID0gaWQ7XG4gICAgICAgICAgICB0aGlzLmluaXQgPSBpbml0O1xuICAgICAgICAgICAgdGhpcy5maW5pc2goKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9LFxuXG4gICAgICAgIGZpbmlzaFdoaWxlU3RhdGVtZW50OiBmdW5jdGlvbiAodGVzdCwgYm9keSkge1xuICAgICAgICAgICAgdGhpcy50eXBlID0gU3ludGF4LldoaWxlU3RhdGVtZW50O1xuICAgICAgICAgICAgdGhpcy50ZXN0ID0gdGVzdDtcbiAgICAgICAgICAgIHRoaXMuYm9keSA9IGJvZHk7XG4gICAgICAgICAgICB0aGlzLmZpbmlzaCgpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZmluaXNoV2l0aFN0YXRlbWVudDogZnVuY3Rpb24gKG9iamVjdCwgYm9keSkge1xuICAgICAgICAgICAgdGhpcy50eXBlID0gU3ludGF4LldpdGhTdGF0ZW1lbnQ7XG4gICAgICAgICAgICB0aGlzLm9iamVjdCA9IG9iamVjdDtcbiAgICAgICAgICAgIHRoaXMuYm9keSA9IGJvZHk7XG4gICAgICAgICAgICB0aGlzLmZpbmlzaCgpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZmluaXNoRXhwb3J0U3BlY2lmaWVyOiBmdW5jdGlvbiAobG9jYWwsIGV4cG9ydGVkKSB7XG4gICAgICAgICAgICB0aGlzLnR5cGUgPSBTeW50YXguRXhwb3J0U3BlY2lmaWVyO1xuICAgICAgICAgICAgdGhpcy5leHBvcnRlZCA9IGV4cG9ydGVkIHx8IGxvY2FsO1xuICAgICAgICAgICAgdGhpcy5sb2NhbCA9IGxvY2FsO1xuICAgICAgICAgICAgdGhpcy5maW5pc2goKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9LFxuXG4gICAgICAgIGZpbmlzaEltcG9ydERlZmF1bHRTcGVjaWZpZXI6IGZ1bmN0aW9uIChsb2NhbCkge1xuICAgICAgICAgICAgdGhpcy50eXBlID0gU3ludGF4LkltcG9ydERlZmF1bHRTcGVjaWZpZXI7XG4gICAgICAgICAgICB0aGlzLmxvY2FsID0gbG9jYWw7XG4gICAgICAgICAgICB0aGlzLmZpbmlzaCgpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZmluaXNoSW1wb3J0TmFtZXNwYWNlU3BlY2lmaWVyOiBmdW5jdGlvbiAobG9jYWwpIHtcbiAgICAgICAgICAgIHRoaXMudHlwZSA9IFN5bnRheC5JbXBvcnROYW1lc3BhY2VTcGVjaWZpZXI7XG4gICAgICAgICAgICB0aGlzLmxvY2FsID0gbG9jYWw7XG4gICAgICAgICAgICB0aGlzLmZpbmlzaCgpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZmluaXNoRXhwb3J0TmFtZWREZWNsYXJhdGlvbjogZnVuY3Rpb24gKGRlY2xhcmF0aW9uLCBzcGVjaWZpZXJzLCBzcmMpIHtcbiAgICAgICAgICAgIHRoaXMudHlwZSA9IFN5bnRheC5FeHBvcnROYW1lZERlY2xhcmF0aW9uO1xuICAgICAgICAgICAgdGhpcy5kZWNsYXJhdGlvbiA9IGRlY2xhcmF0aW9uO1xuICAgICAgICAgICAgdGhpcy5zcGVjaWZpZXJzID0gc3BlY2lmaWVycztcbiAgICAgICAgICAgIHRoaXMuc291cmNlID0gc3JjO1xuICAgICAgICAgICAgdGhpcy5maW5pc2goKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9LFxuXG4gICAgICAgIGZpbmlzaEV4cG9ydERlZmF1bHREZWNsYXJhdGlvbjogZnVuY3Rpb24gKGRlY2xhcmF0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLnR5cGUgPSBTeW50YXguRXhwb3J0RGVmYXVsdERlY2xhcmF0aW9uO1xuICAgICAgICAgICAgdGhpcy5kZWNsYXJhdGlvbiA9IGRlY2xhcmF0aW9uO1xuICAgICAgICAgICAgdGhpcy5maW5pc2goKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9LFxuXG4gICAgICAgIGZpbmlzaEV4cG9ydEFsbERlY2xhcmF0aW9uOiBmdW5jdGlvbiAoc3JjKSB7XG4gICAgICAgICAgICB0aGlzLnR5cGUgPSBTeW50YXguRXhwb3J0QWxsRGVjbGFyYXRpb247XG4gICAgICAgICAgICB0aGlzLnNvdXJjZSA9IHNyYztcbiAgICAgICAgICAgIHRoaXMuZmluaXNoKCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSxcblxuICAgICAgICBmaW5pc2hJbXBvcnRTcGVjaWZpZXI6IGZ1bmN0aW9uIChsb2NhbCwgaW1wb3J0ZWQpIHtcbiAgICAgICAgICAgIHRoaXMudHlwZSA9IFN5bnRheC5JbXBvcnRTcGVjaWZpZXI7XG4gICAgICAgICAgICB0aGlzLmxvY2FsID0gbG9jYWwgfHwgaW1wb3J0ZWQ7XG4gICAgICAgICAgICB0aGlzLmltcG9ydGVkID0gaW1wb3J0ZWQ7XG4gICAgICAgICAgICB0aGlzLmZpbmlzaCgpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZmluaXNoSW1wb3J0RGVjbGFyYXRpb246IGZ1bmN0aW9uIChzcGVjaWZpZXJzLCBzcmMpIHtcbiAgICAgICAgICAgIHRoaXMudHlwZSA9IFN5bnRheC5JbXBvcnREZWNsYXJhdGlvbjtcbiAgICAgICAgICAgIHRoaXMuc3BlY2lmaWVycyA9IHNwZWNpZmllcnM7XG4gICAgICAgICAgICB0aGlzLnNvdXJjZSA9IHNyYztcbiAgICAgICAgICAgIHRoaXMuZmluaXNoKCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuICAgIH07XG5cblxuICAgIGZ1bmN0aW9uIHJlY29yZEVycm9yKGVycm9yKSB7XG4gICAgICAgIHZhciBlLCBleGlzdGluZztcblxuICAgICAgICBmb3IgKGUgPSAwOyBlIDwgZXh0cmEuZXJyb3JzLmxlbmd0aDsgZSsrKSB7XG4gICAgICAgICAgICBleGlzdGluZyA9IGV4dHJhLmVycm9yc1tlXTtcbiAgICAgICAgICAgIC8vIFByZXZlbnQgZHVwbGljYXRlZCBlcnJvci5cbiAgICAgICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICAgICAgICAgICBpZiAoZXhpc3RpbmcuaW5kZXggPT09IGVycm9yLmluZGV4ICYmIGV4aXN0aW5nLm1lc3NhZ2UgPT09IGVycm9yLm1lc3NhZ2UpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBleHRyYS5lcnJvcnMucHVzaChlcnJvcik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY3JlYXRlRXJyb3IobGluZSwgcG9zLCBkZXNjcmlwdGlvbikge1xuICAgICAgICB2YXIgZXJyb3IgPSBuZXcgRXJyb3IoJ0xpbmUgJyArIGxpbmUgKyAnOiAnICsgZGVzY3JpcHRpb24pO1xuICAgICAgICBlcnJvci5pbmRleCA9IHBvcztcbiAgICAgICAgZXJyb3IubGluZU51bWJlciA9IGxpbmU7XG4gICAgICAgIGVycm9yLmNvbHVtbiA9IHBvcyAtIChzY2FubmluZyA/IGxpbmVTdGFydCA6IGxhc3RMaW5lU3RhcnQpICsgMTtcbiAgICAgICAgZXJyb3IuZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvbjtcbiAgICAgICAgcmV0dXJuIGVycm9yO1xuICAgIH1cblxuICAgIC8vIFRocm93IGFuIGV4Y2VwdGlvblxuXG4gICAgZnVuY3Rpb24gdGhyb3dFcnJvcihtZXNzYWdlRm9ybWF0KSB7XG4gICAgICAgIHZhciBhcmdzLCBtc2c7XG5cbiAgICAgICAgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgICAgIG1zZyA9IG1lc3NhZ2VGb3JtYXQucmVwbGFjZSgvJShcXGQpL2csXG4gICAgICAgICAgICBmdW5jdGlvbiAod2hvbGUsIGlkeCkge1xuICAgICAgICAgICAgICAgIGFzc2VydChpZHggPCBhcmdzLmxlbmd0aCwgJ01lc3NhZ2UgcmVmZXJlbmNlIG11c3QgYmUgaW4gcmFuZ2UnKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gYXJnc1tpZHhdO1xuICAgICAgICAgICAgfVxuICAgICAgICApO1xuXG4gICAgICAgIHRocm93IGNyZWF0ZUVycm9yKGxhc3RMaW5lTnVtYmVyLCBsYXN0SW5kZXgsIG1zZyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdG9sZXJhdGVFcnJvcihtZXNzYWdlRm9ybWF0KSB7XG4gICAgICAgIHZhciBhcmdzLCBtc2csIGVycm9yO1xuXG4gICAgICAgIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAgICAgICBtc2cgPSBtZXNzYWdlRm9ybWF0LnJlcGxhY2UoLyUoXFxkKS9nLFxuICAgICAgICAgICAgZnVuY3Rpb24gKHdob2xlLCBpZHgpIHtcbiAgICAgICAgICAgICAgICBhc3NlcnQoaWR4IDwgYXJncy5sZW5ndGgsICdNZXNzYWdlIHJlZmVyZW5jZSBtdXN0IGJlIGluIHJhbmdlJyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGFyZ3NbaWR4XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcblxuICAgICAgICBlcnJvciA9IGNyZWF0ZUVycm9yKGxpbmVOdW1iZXIsIGxhc3RJbmRleCwgbXNnKTtcbiAgICAgICAgaWYgKGV4dHJhLmVycm9ycykge1xuICAgICAgICAgICAgcmVjb3JkRXJyb3IoZXJyb3IpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBUaHJvdyBhbiBleGNlcHRpb24gYmVjYXVzZSBvZiB0aGUgdG9rZW4uXG5cbiAgICBmdW5jdGlvbiB1bmV4cGVjdGVkVG9rZW5FcnJvcih0b2tlbiwgbWVzc2FnZSkge1xuICAgICAgICB2YXIgdmFsdWUsIG1zZyA9IG1lc3NhZ2UgfHwgTWVzc2FnZXMuVW5leHBlY3RlZFRva2VuO1xuXG4gICAgICAgIGlmICh0b2tlbikge1xuICAgICAgICAgICAgaWYgKCFtZXNzYWdlKSB7XG4gICAgICAgICAgICAgICAgbXNnID0gKHRva2VuLnR5cGUgPT09IFRva2VuLkVPRikgPyBNZXNzYWdlcy5VbmV4cGVjdGVkRU9TIDpcbiAgICAgICAgICAgICAgICAgICAgKHRva2VuLnR5cGUgPT09IFRva2VuLklkZW50aWZpZXIpID8gTWVzc2FnZXMuVW5leHBlY3RlZElkZW50aWZpZXIgOlxuICAgICAgICAgICAgICAgICAgICAodG9rZW4udHlwZSA9PT0gVG9rZW4uTnVtZXJpY0xpdGVyYWwpID8gTWVzc2FnZXMuVW5leHBlY3RlZE51bWJlciA6XG4gICAgICAgICAgICAgICAgICAgICh0b2tlbi50eXBlID09PSBUb2tlbi5TdHJpbmdMaXRlcmFsKSA/IE1lc3NhZ2VzLlVuZXhwZWN0ZWRTdHJpbmcgOlxuICAgICAgICAgICAgICAgICAgICAodG9rZW4udHlwZSA9PT0gVG9rZW4uVGVtcGxhdGUpID8gTWVzc2FnZXMuVW5leHBlY3RlZFRlbXBsYXRlIDpcbiAgICAgICAgICAgICAgICAgICAgTWVzc2FnZXMuVW5leHBlY3RlZFRva2VuO1xuXG4gICAgICAgICAgICAgICAgaWYgKHRva2VuLnR5cGUgPT09IFRva2VuLktleXdvcmQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzRnV0dXJlUmVzZXJ2ZWRXb3JkKHRva2VuLnZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbXNnID0gTWVzc2FnZXMuVW5leHBlY3RlZFJlc2VydmVkO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHN0cmljdCAmJiBpc1N0cmljdE1vZGVSZXNlcnZlZFdvcmQodG9rZW4udmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtc2cgPSBNZXNzYWdlcy5TdHJpY3RSZXNlcnZlZFdvcmQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhbHVlID0gKHRva2VuLnR5cGUgPT09IFRva2VuLlRlbXBsYXRlKSA/IHRva2VuLnZhbHVlLnJhdyA6IHRva2VuLnZhbHVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFsdWUgPSAnSUxMRUdBTCc7XG4gICAgICAgIH1cblxuICAgICAgICBtc2cgPSBtc2cucmVwbGFjZSgnJTAnLCB2YWx1ZSk7XG5cbiAgICAgICAgcmV0dXJuICh0b2tlbiAmJiB0eXBlb2YgdG9rZW4ubGluZU51bWJlciA9PT0gJ251bWJlcicpID9cbiAgICAgICAgICAgIGNyZWF0ZUVycm9yKHRva2VuLmxpbmVOdW1iZXIsIHRva2VuLnN0YXJ0LCBtc2cpIDpcbiAgICAgICAgICAgIGNyZWF0ZUVycm9yKHNjYW5uaW5nID8gbGluZU51bWJlciA6IGxhc3RMaW5lTnVtYmVyLCBzY2FubmluZyA/IGluZGV4IDogbGFzdEluZGV4LCBtc2cpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHRocm93VW5leHBlY3RlZFRva2VuKHRva2VuLCBtZXNzYWdlKSB7XG4gICAgICAgIHRocm93IHVuZXhwZWN0ZWRUb2tlbkVycm9yKHRva2VuLCBtZXNzYWdlKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB0b2xlcmF0ZVVuZXhwZWN0ZWRUb2tlbih0b2tlbiwgbWVzc2FnZSkge1xuICAgICAgICB2YXIgZXJyb3IgPSB1bmV4cGVjdGVkVG9rZW5FcnJvcih0b2tlbiwgbWVzc2FnZSk7XG4gICAgICAgIGlmIChleHRyYS5lcnJvcnMpIHtcbiAgICAgICAgICAgIHJlY29yZEVycm9yKGVycm9yKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gRXhwZWN0IHRoZSBuZXh0IHRva2VuIHRvIG1hdGNoIHRoZSBzcGVjaWZpZWQgcHVuY3R1YXRvci5cbiAgICAvLyBJZiBub3QsIGFuIGV4Y2VwdGlvbiB3aWxsIGJlIHRocm93bi5cblxuICAgIGZ1bmN0aW9uIGV4cGVjdCh2YWx1ZSkge1xuICAgICAgICB2YXIgdG9rZW4gPSBsZXgoKTtcbiAgICAgICAgaWYgKHRva2VuLnR5cGUgIT09IFRva2VuLlB1bmN0dWF0b3IgfHwgdG9rZW4udmFsdWUgIT09IHZhbHVlKSB7XG4gICAgICAgICAgICB0aHJvd1VuZXhwZWN0ZWRUb2tlbih0b2tlbik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBleHBlY3RDb21tYVNlcGFyYXRvclxuICAgICAqIEBkZXNjcmlwdGlvbiBRdWlldGx5IGV4cGVjdCBhIGNvbW1hIHdoZW4gaW4gdG9sZXJhbnQgbW9kZSwgb3RoZXJ3aXNlIGRlbGVnYXRlc1xuICAgICAqIHRvIDxjb2RlPmV4cGVjdCh2YWx1ZSk8L2NvZGU+XG4gICAgICogQHNpbmNlIDIuMFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGV4cGVjdENvbW1hU2VwYXJhdG9yKCkge1xuICAgICAgICB2YXIgdG9rZW47XG5cbiAgICAgICAgaWYgKGV4dHJhLmVycm9ycykge1xuICAgICAgICAgICAgdG9rZW4gPSBsb29rYWhlYWQ7XG4gICAgICAgICAgICBpZiAodG9rZW4udHlwZSA9PT0gVG9rZW4uUHVuY3R1YXRvciAmJiB0b2tlbi52YWx1ZSA9PT0gJywnKSB7XG4gICAgICAgICAgICAgICAgbGV4KCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRva2VuLnR5cGUgPT09IFRva2VuLlB1bmN0dWF0b3IgJiYgdG9rZW4udmFsdWUgPT09ICc7Jykge1xuICAgICAgICAgICAgICAgIGxleCgpO1xuICAgICAgICAgICAgICAgIHRvbGVyYXRlVW5leHBlY3RlZFRva2VuKHRva2VuKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdG9sZXJhdGVVbmV4cGVjdGVkVG9rZW4odG9rZW4sIE1lc3NhZ2VzLlVuZXhwZWN0ZWRUb2tlbik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBleHBlY3QoJywnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIEV4cGVjdCB0aGUgbmV4dCB0b2tlbiB0byBtYXRjaCB0aGUgc3BlY2lmaWVkIGtleXdvcmQuXG4gICAgLy8gSWYgbm90LCBhbiBleGNlcHRpb24gd2lsbCBiZSB0aHJvd24uXG5cbiAgICBmdW5jdGlvbiBleHBlY3RLZXl3b3JkKGtleXdvcmQpIHtcbiAgICAgICAgdmFyIHRva2VuID0gbGV4KCk7XG4gICAgICAgIGlmICh0b2tlbi50eXBlICE9PSBUb2tlbi5LZXl3b3JkIHx8IHRva2VuLnZhbHVlICE9PSBrZXl3b3JkKSB7XG4gICAgICAgICAgICB0aHJvd1VuZXhwZWN0ZWRUb2tlbih0b2tlbik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBSZXR1cm4gdHJ1ZSBpZiB0aGUgbmV4dCB0b2tlbiBtYXRjaGVzIHRoZSBzcGVjaWZpZWQgcHVuY3R1YXRvci5cblxuICAgIGZ1bmN0aW9uIG1hdGNoKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBsb29rYWhlYWQudHlwZSA9PT0gVG9rZW4uUHVuY3R1YXRvciAmJiBsb29rYWhlYWQudmFsdWUgPT09IHZhbHVlO1xuICAgIH1cblxuICAgIC8vIFJldHVybiB0cnVlIGlmIHRoZSBuZXh0IHRva2VuIG1hdGNoZXMgdGhlIHNwZWNpZmllZCBrZXl3b3JkXG5cbiAgICBmdW5jdGlvbiBtYXRjaEtleXdvcmQoa2V5d29yZCkge1xuICAgICAgICByZXR1cm4gbG9va2FoZWFkLnR5cGUgPT09IFRva2VuLktleXdvcmQgJiYgbG9va2FoZWFkLnZhbHVlID09PSBrZXl3b3JkO1xuICAgIH1cblxuICAgIC8vIFJldHVybiB0cnVlIGlmIHRoZSBuZXh0IHRva2VuIG1hdGNoZXMgdGhlIHNwZWNpZmllZCBjb250ZXh0dWFsIGtleXdvcmRcbiAgICAvLyAod2hlcmUgYW4gaWRlbnRpZmllciBpcyBzb21ldGltZXMgYSBrZXl3b3JkIGRlcGVuZGluZyBvbiB0aGUgY29udGV4dClcblxuICAgIGZ1bmN0aW9uIG1hdGNoQ29udGV4dHVhbEtleXdvcmQoa2V5d29yZCkge1xuICAgICAgICByZXR1cm4gbG9va2FoZWFkLnR5cGUgPT09IFRva2VuLklkZW50aWZpZXIgJiYgbG9va2FoZWFkLnZhbHVlID09PSBrZXl3b3JkO1xuICAgIH1cblxuICAgIC8vIFJldHVybiB0cnVlIGlmIHRoZSBuZXh0IHRva2VuIGlzIGFuIGFzc2lnbm1lbnQgb3BlcmF0b3JcblxuICAgIGZ1bmN0aW9uIG1hdGNoQXNzaWduKCkge1xuICAgICAgICB2YXIgb3A7XG5cbiAgICAgICAgaWYgKGxvb2thaGVhZC50eXBlICE9PSBUb2tlbi5QdW5jdHVhdG9yKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgb3AgPSBsb29rYWhlYWQudmFsdWU7XG4gICAgICAgIHJldHVybiBvcCA9PT0gJz0nIHx8XG4gICAgICAgICAgICBvcCA9PT0gJyo9JyB8fFxuICAgICAgICAgICAgb3AgPT09ICcvPScgfHxcbiAgICAgICAgICAgIG9wID09PSAnJT0nIHx8XG4gICAgICAgICAgICBvcCA9PT0gJys9JyB8fFxuICAgICAgICAgICAgb3AgPT09ICctPScgfHxcbiAgICAgICAgICAgIG9wID09PSAnPDw9JyB8fFxuICAgICAgICAgICAgb3AgPT09ICc+Pj0nIHx8XG4gICAgICAgICAgICBvcCA9PT0gJz4+Pj0nIHx8XG4gICAgICAgICAgICBvcCA9PT0gJyY9JyB8fFxuICAgICAgICAgICAgb3AgPT09ICdePScgfHxcbiAgICAgICAgICAgIG9wID09PSAnfD0nO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNvbnN1bWVTZW1pY29sb24oKSB7XG4gICAgICAgIC8vIENhdGNoIHRoZSB2ZXJ5IGNvbW1vbiBjYXNlIGZpcnN0OiBpbW1lZGlhdGVseSBhIHNlbWljb2xvbiAoVSswMDNCKS5cbiAgICAgICAgaWYgKHNvdXJjZS5jaGFyQ29kZUF0KHN0YXJ0SW5kZXgpID09PSAweDNCIHx8IG1hdGNoKCc7JykpIHtcbiAgICAgICAgICAgIGxleCgpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGhhc0xpbmVUZXJtaW5hdG9yKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBGSVhNRShpa2FyaWVuYXRvcik6IHRoaXMgaXMgc2VlbWluZ2x5IGFuIGlzc3VlIGluIHRoZSBwcmV2aW91cyBsb2NhdGlvbiBpbmZvIGNvbnZlbnRpb24uXG4gICAgICAgIGxhc3RJbmRleCA9IHN0YXJ0SW5kZXg7XG4gICAgICAgIGxhc3RMaW5lTnVtYmVyID0gc3RhcnRMaW5lTnVtYmVyO1xuICAgICAgICBsYXN0TGluZVN0YXJ0ID0gc3RhcnRMaW5lU3RhcnQ7XG5cbiAgICAgICAgaWYgKGxvb2thaGVhZC50eXBlICE9PSBUb2tlbi5FT0YgJiYgIW1hdGNoKCd9JykpIHtcbiAgICAgICAgICAgIHRocm93VW5leHBlY3RlZFRva2VuKGxvb2thaGVhZCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBDb3ZlciBncmFtbWFyIHN1cHBvcnQuXG4gICAgLy9cbiAgICAvLyBXaGVuIGFuIGFzc2lnbm1lbnQgZXhwcmVzc2lvbiBwb3NpdGlvbiBzdGFydHMgd2l0aCBhbiBsZWZ0IHBhcmVudGhlc2lzLCB0aGUgZGV0ZXJtaW5hdGlvbiBvZiB0aGUgdHlwZVxuICAgIC8vIG9mIHRoZSBzeW50YXggaXMgdG8gYmUgZGVmZXJyZWQgYXJiaXRyYXJpbHkgbG9uZyB1bnRpbCB0aGUgZW5kIG9mIHRoZSBwYXJlbnRoZXNlcyBwYWlyIChwbHVzIGEgbG9va2FoZWFkKVxuICAgIC8vIG9yIHRoZSBmaXJzdCBjb21tYS4gVGhpcyBzaXR1YXRpb24gYWxzbyBkZWZlcnMgdGhlIGRldGVybWluYXRpb24gb2YgYWxsIHRoZSBleHByZXNzaW9ucyBuZXN0ZWQgaW4gdGhlIHBhaXIuXG4gICAgLy9cbiAgICAvLyBUaGVyZSBhcmUgdGhyZWUgcHJvZHVjdGlvbnMgdGhhdCBjYW4gYmUgcGFyc2VkIGluIGEgcGFyZW50aGVzZXMgcGFpciB0aGF0IG5lZWRzIHRvIGJlIGRldGVybWluZWRcbiAgICAvLyBhZnRlciB0aGUgb3V0ZXJtb3N0IHBhaXIgaXMgY2xvc2VkLiBUaGV5IGFyZTpcbiAgICAvL1xuICAgIC8vICAgMS4gQXNzaWdubWVudEV4cHJlc3Npb25cbiAgICAvLyAgIDIuIEJpbmRpbmdFbGVtZW50c1xuICAgIC8vICAgMy4gQXNzaWdubWVudFRhcmdldHNcbiAgICAvL1xuICAgIC8vIEluIG9yZGVyIHRvIGF2b2lkIGV4cG9uZW50aWFsIGJhY2t0cmFja2luZywgd2UgdXNlIHR3byBmbGFncyB0byBkZW5vdGUgaWYgdGhlIHByb2R1Y3Rpb24gY2FuIGJlXG4gICAgLy8gYmluZGluZyBlbGVtZW50IG9yIGFzc2lnbm1lbnQgdGFyZ2V0LlxuICAgIC8vXG4gICAgLy8gVGhlIHRocmVlIHByb2R1Y3Rpb25zIGhhdmUgdGhlIHJlbGF0aW9uc2hpcDpcbiAgICAvL1xuICAgIC8vICAgQmluZGluZ0VsZW1lbnRzIOKKhiBBc3NpZ25tZW50VGFyZ2V0cyDiioYgQXNzaWdubWVudEV4cHJlc3Npb25cbiAgICAvL1xuICAgIC8vIHdpdGggYSBzaW5nbGUgZXhjZXB0aW9uIHRoYXQgQ292ZXJJbml0aWFsaXplZE5hbWUgd2hlbiB1c2VkIGRpcmVjdGx5IGluIGFuIEV4cHJlc3Npb24sIGdlbmVyYXRlc1xuICAgIC8vIGFuIGVhcmx5IGVycm9yLiBUaGVyZWZvcmUsIHdlIG5lZWQgdGhlIHRoaXJkIHN0YXRlLCBmaXJzdENvdmVySW5pdGlhbGl6ZWROYW1lRXJyb3IsIHRvIHRyYWNrIHRoZVxuICAgIC8vIGZpcnN0IHVzYWdlIG9mIENvdmVySW5pdGlhbGl6ZWROYW1lIGFuZCByZXBvcnQgaXQgd2hlbiB3ZSByZWFjaGVkIHRoZSBlbmQgb2YgdGhlIHBhcmVudGhlc2VzIHBhaXIuXG4gICAgLy9cbiAgICAvLyBpc29sYXRlQ292ZXJHcmFtbWFyIGZ1bmN0aW9uIHJ1bnMgdGhlIGdpdmVuIHBhcnNlciBmdW5jdGlvbiB3aXRoIGEgbmV3IGNvdmVyIGdyYW1tYXIgY29udGV4dCwgYW5kIGl0IGRvZXMgbm90XG4gICAgLy8gZWZmZWN0IHRoZSBjdXJyZW50IGZsYWdzLiBUaGlzIG1lYW5zIHRoZSBwcm9kdWN0aW9uIHRoZSBwYXJzZXIgcGFyc2VzIGlzIG9ubHkgdXNlZCBhcyBhbiBleHByZXNzaW9uLiBUaGVyZWZvcmVcbiAgICAvLyB0aGUgQ292ZXJJbml0aWFsaXplZE5hbWUgY2hlY2sgaXMgY29uZHVjdGVkLlxuICAgIC8vXG4gICAgLy8gaW5oZXJpdENvdmVyR3JhbW1hciBmdW5jdGlvbiBydW5zIHRoZSBnaXZlbiBwYXJzZSBmdW5jdGlvbiB3aXRoIGEgbmV3IGNvdmVyIGdyYW1tYXIgY29udGV4dCwgYW5kIGl0IHByb3BhZ2F0ZXNcbiAgICAvLyB0aGUgZmxhZ3Mgb3V0c2lkZSBvZiB0aGUgcGFyc2VyLiBUaGlzIG1lYW5zIHRoZSBwcm9kdWN0aW9uIHRoZSBwYXJzZXIgcGFyc2VzIGlzIHVzZWQgYXMgYSBwYXJ0IG9mIGEgcG90ZW50aWFsXG4gICAgLy8gcGF0dGVybi4gVGhlIENvdmVySW5pdGlhbGl6ZWROYW1lIGNoZWNrIGlzIGRlZmVycmVkLlxuICAgIGZ1bmN0aW9uIGlzb2xhdGVDb3ZlckdyYW1tYXIocGFyc2VyKSB7XG4gICAgICAgIHZhciBvbGRJc0JpbmRpbmdFbGVtZW50ID0gaXNCaW5kaW5nRWxlbWVudCxcbiAgICAgICAgICAgIG9sZElzQXNzaWdubWVudFRhcmdldCA9IGlzQXNzaWdubWVudFRhcmdldCxcbiAgICAgICAgICAgIG9sZEZpcnN0Q292ZXJJbml0aWFsaXplZE5hbWVFcnJvciA9IGZpcnN0Q292ZXJJbml0aWFsaXplZE5hbWVFcnJvcixcbiAgICAgICAgICAgIHJlc3VsdDtcbiAgICAgICAgaXNCaW5kaW5nRWxlbWVudCA9IHRydWU7XG4gICAgICAgIGlzQXNzaWdubWVudFRhcmdldCA9IHRydWU7XG4gICAgICAgIGZpcnN0Q292ZXJJbml0aWFsaXplZE5hbWVFcnJvciA9IG51bGw7XG4gICAgICAgIHJlc3VsdCA9IHBhcnNlcigpO1xuICAgICAgICBpZiAoZmlyc3RDb3ZlckluaXRpYWxpemVkTmFtZUVycm9yICE9PSBudWxsKSB7XG4gICAgICAgICAgICB0aHJvd1VuZXhwZWN0ZWRUb2tlbihmaXJzdENvdmVySW5pdGlhbGl6ZWROYW1lRXJyb3IpO1xuICAgICAgICB9XG4gICAgICAgIGlzQmluZGluZ0VsZW1lbnQgPSBvbGRJc0JpbmRpbmdFbGVtZW50O1xuICAgICAgICBpc0Fzc2lnbm1lbnRUYXJnZXQgPSBvbGRJc0Fzc2lnbm1lbnRUYXJnZXQ7XG4gICAgICAgIGZpcnN0Q292ZXJJbml0aWFsaXplZE5hbWVFcnJvciA9IG9sZEZpcnN0Q292ZXJJbml0aWFsaXplZE5hbWVFcnJvcjtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpbmhlcml0Q292ZXJHcmFtbWFyKHBhcnNlcikge1xuICAgICAgICB2YXIgb2xkSXNCaW5kaW5nRWxlbWVudCA9IGlzQmluZGluZ0VsZW1lbnQsXG4gICAgICAgICAgICBvbGRJc0Fzc2lnbm1lbnRUYXJnZXQgPSBpc0Fzc2lnbm1lbnRUYXJnZXQsXG4gICAgICAgICAgICBvbGRGaXJzdENvdmVySW5pdGlhbGl6ZWROYW1lRXJyb3IgPSBmaXJzdENvdmVySW5pdGlhbGl6ZWROYW1lRXJyb3IsXG4gICAgICAgICAgICByZXN1bHQ7XG4gICAgICAgIGlzQmluZGluZ0VsZW1lbnQgPSB0cnVlO1xuICAgICAgICBpc0Fzc2lnbm1lbnRUYXJnZXQgPSB0cnVlO1xuICAgICAgICBmaXJzdENvdmVySW5pdGlhbGl6ZWROYW1lRXJyb3IgPSBudWxsO1xuICAgICAgICByZXN1bHQgPSBwYXJzZXIoKTtcbiAgICAgICAgaXNCaW5kaW5nRWxlbWVudCA9IGlzQmluZGluZ0VsZW1lbnQgJiYgb2xkSXNCaW5kaW5nRWxlbWVudDtcbiAgICAgICAgaXNBc3NpZ25tZW50VGFyZ2V0ID0gaXNBc3NpZ25tZW50VGFyZ2V0ICYmIG9sZElzQXNzaWdubWVudFRhcmdldDtcbiAgICAgICAgZmlyc3RDb3ZlckluaXRpYWxpemVkTmFtZUVycm9yID0gb2xkRmlyc3RDb3ZlckluaXRpYWxpemVkTmFtZUVycm9yIHx8IGZpcnN0Q292ZXJJbml0aWFsaXplZE5hbWVFcnJvcjtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwYXJzZUFycmF5UGF0dGVybigpIHtcbiAgICAgICAgdmFyIG5vZGUgPSBuZXcgTm9kZSgpLCBlbGVtZW50cyA9IFtdLCByZXN0LCByZXN0Tm9kZTtcbiAgICAgICAgZXhwZWN0KCdbJyk7XG5cbiAgICAgICAgd2hpbGUgKCFtYXRjaCgnXScpKSB7XG4gICAgICAgICAgICBpZiAobWF0Y2goJywnKSkge1xuICAgICAgICAgICAgICAgIGxleCgpO1xuICAgICAgICAgICAgICAgIGVsZW1lbnRzLnB1c2gobnVsbCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChtYXRjaCgnLi4uJykpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdE5vZGUgPSBuZXcgTm9kZSgpO1xuICAgICAgICAgICAgICAgICAgICBsZXgoKTtcbiAgICAgICAgICAgICAgICAgICAgcmVzdCA9IHBhcnNlVmFyaWFibGVJZGVudGlmaWVyKCk7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnRzLnB1c2gocmVzdE5vZGUuZmluaXNoUmVzdEVsZW1lbnQocmVzdCkpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50cy5wdXNoKHBhcnNlUGF0dGVybldpdGhEZWZhdWx0KCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoIW1hdGNoKCddJykpIHtcbiAgICAgICAgICAgICAgICAgICAgZXhwZWN0KCcsJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgICAgICBleHBlY3QoJ10nKTtcblxuICAgICAgICByZXR1cm4gbm9kZS5maW5pc2hBcnJheVBhdHRlcm4oZWxlbWVudHMpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBhcnNlUHJvcGVydHlQYXR0ZXJuKCkge1xuICAgICAgICB2YXIgbm9kZSA9IG5ldyBOb2RlKCksIGtleSwgY29tcHV0ZWQgPSBtYXRjaCgnWycpLCBpbml0O1xuICAgICAgICBpZiAobG9va2FoZWFkLnR5cGUgPT09IFRva2VuLklkZW50aWZpZXIpIHtcbiAgICAgICAgICAgIGtleSA9IHBhcnNlVmFyaWFibGVJZGVudGlmaWVyKCk7XG4gICAgICAgICAgICBpZiAobWF0Y2goJz0nKSkge1xuICAgICAgICAgICAgICAgIGxleCgpO1xuICAgICAgICAgICAgICAgIGluaXQgPSBwYXJzZUFzc2lnbm1lbnRFeHByZXNzaW9uKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5vZGUuZmluaXNoUHJvcGVydHkoXG4gICAgICAgICAgICAgICAgICAgICdpbml0Jywga2V5LCBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgbmV3IFdyYXBwaW5nTm9kZShrZXkpLmZpbmlzaEFzc2lnbm1lbnRQYXR0ZXJuKGtleSwgaW5pdCksIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCFtYXRjaCgnOicpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5vZGUuZmluaXNoUHJvcGVydHkoJ2luaXQnLCBrZXksIGZhbHNlLCBrZXksIGZhbHNlLCB0cnVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGtleSA9IHBhcnNlT2JqZWN0UHJvcGVydHlLZXkoKTtcbiAgICAgICAgfVxuICAgICAgICBleHBlY3QoJzonKTtcbiAgICAgICAgaW5pdCA9IHBhcnNlUGF0dGVybldpdGhEZWZhdWx0KCk7XG4gICAgICAgIHJldHVybiBub2RlLmZpbmlzaFByb3BlcnR5KCdpbml0Jywga2V5LCBjb21wdXRlZCwgaW5pdCwgZmFsc2UsIGZhbHNlKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwYXJzZU9iamVjdFBhdHRlcm4oKSB7XG4gICAgICAgIHZhciBub2RlID0gbmV3IE5vZGUoKSwgcHJvcGVydGllcyA9IFtdO1xuXG4gICAgICAgIGV4cGVjdCgneycpO1xuXG4gICAgICAgIHdoaWxlICghbWF0Y2goJ30nKSkge1xuICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHBhcnNlUHJvcGVydHlQYXR0ZXJuKCkpO1xuICAgICAgICAgICAgaWYgKCFtYXRjaCgnfScpKSB7XG4gICAgICAgICAgICAgICAgZXhwZWN0KCcsJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBsZXgoKTtcblxuICAgICAgICByZXR1cm4gbm9kZS5maW5pc2hPYmplY3RQYXR0ZXJuKHByb3BlcnRpZXMpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBhcnNlUGF0dGVybigpIHtcbiAgICAgICAgaWYgKGxvb2thaGVhZC50eXBlID09PSBUb2tlbi5JZGVudGlmaWVyKSB7XG4gICAgICAgICAgICByZXR1cm4gcGFyc2VWYXJpYWJsZUlkZW50aWZpZXIoKTtcbiAgICAgICAgfSBlbHNlIGlmIChtYXRjaCgnWycpKSB7XG4gICAgICAgICAgICByZXR1cm4gcGFyc2VBcnJheVBhdHRlcm4oKTtcbiAgICAgICAgfSBlbHNlIGlmIChtYXRjaCgneycpKSB7XG4gICAgICAgICAgICByZXR1cm4gcGFyc2VPYmplY3RQYXR0ZXJuKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhyb3dVbmV4cGVjdGVkVG9rZW4obG9va2FoZWFkKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwYXJzZVBhdHRlcm5XaXRoRGVmYXVsdCgpIHtcbiAgICAgICAgdmFyIHN0YXJ0VG9rZW4gPSBsb29rYWhlYWQsIHBhdHRlcm4sIHJpZ2h0O1xuICAgICAgICBwYXR0ZXJuID0gcGFyc2VQYXR0ZXJuKCk7XG4gICAgICAgIGlmIChtYXRjaCgnPScpKSB7XG4gICAgICAgICAgICBsZXgoKTtcbiAgICAgICAgICAgIHJpZ2h0ID0gaXNvbGF0ZUNvdmVyR3JhbW1hcihwYXJzZUFzc2lnbm1lbnRFeHByZXNzaW9uKTtcbiAgICAgICAgICAgIHBhdHRlcm4gPSBuZXcgV3JhcHBpbmdOb2RlKHN0YXJ0VG9rZW4pLmZpbmlzaEFzc2lnbm1lbnRQYXR0ZXJuKHBhdHRlcm4sIHJpZ2h0KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcGF0dGVybjtcbiAgICB9XG5cbiAgICAvLyAxMS4xLjQgQXJyYXkgSW5pdGlhbGlzZXJcblxuICAgIGZ1bmN0aW9uIHBhcnNlQXJyYXlJbml0aWFsaXNlcigpIHtcbiAgICAgICAgdmFyIGVsZW1lbnRzID0gW10sIG5vZGUgPSBuZXcgTm9kZSgpLCByZXN0U3ByZWFkO1xuXG4gICAgICAgIGV4cGVjdCgnWycpO1xuXG4gICAgICAgIHdoaWxlICghbWF0Y2goJ10nKSkge1xuICAgICAgICAgICAgaWYgKG1hdGNoKCcsJykpIHtcbiAgICAgICAgICAgICAgICBsZXgoKTtcbiAgICAgICAgICAgICAgICBlbGVtZW50cy5wdXNoKG51bGwpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChtYXRjaCgnLi4uJykpIHtcbiAgICAgICAgICAgICAgICByZXN0U3ByZWFkID0gbmV3IE5vZGUoKTtcbiAgICAgICAgICAgICAgICBsZXgoKTtcbiAgICAgICAgICAgICAgICByZXN0U3ByZWFkLmZpbmlzaFNwcmVhZEVsZW1lbnQoaW5oZXJpdENvdmVyR3JhbW1hcihwYXJzZUFzc2lnbm1lbnRFeHByZXNzaW9uKSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoIW1hdGNoKCddJykpIHtcbiAgICAgICAgICAgICAgICAgICAgaXNBc3NpZ25tZW50VGFyZ2V0ID0gaXNCaW5kaW5nRWxlbWVudCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBleHBlY3QoJywnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxlbWVudHMucHVzaChyZXN0U3ByZWFkKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudHMucHVzaChpbmhlcml0Q292ZXJHcmFtbWFyKHBhcnNlQXNzaWdubWVudEV4cHJlc3Npb24pKTtcblxuICAgICAgICAgICAgICAgIGlmICghbWF0Y2goJ10nKSkge1xuICAgICAgICAgICAgICAgICAgICBleHBlY3QoJywnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBsZXgoKTtcblxuICAgICAgICByZXR1cm4gbm9kZS5maW5pc2hBcnJheUV4cHJlc3Npb24oZWxlbWVudHMpO1xuICAgIH1cblxuICAgIC8vIDExLjEuNSBPYmplY3QgSW5pdGlhbGlzZXJcblxuICAgIGZ1bmN0aW9uIHBhcnNlUHJvcGVydHlGdW5jdGlvbihub2RlLCBwYXJhbUluZm8pIHtcbiAgICAgICAgdmFyIHByZXZpb3VzU3RyaWN0LCBib2R5O1xuXG4gICAgICAgIGlzQXNzaWdubWVudFRhcmdldCA9IGlzQmluZGluZ0VsZW1lbnQgPSBmYWxzZTtcblxuICAgICAgICBwcmV2aW91c1N0cmljdCA9IHN0cmljdDtcbiAgICAgICAgYm9keSA9IGlzb2xhdGVDb3ZlckdyYW1tYXIocGFyc2VGdW5jdGlvblNvdXJjZUVsZW1lbnRzKTtcblxuICAgICAgICBpZiAoc3RyaWN0ICYmIHBhcmFtSW5mby5maXJzdFJlc3RyaWN0ZWQpIHtcbiAgICAgICAgICAgIHRvbGVyYXRlVW5leHBlY3RlZFRva2VuKHBhcmFtSW5mby5maXJzdFJlc3RyaWN0ZWQsIHBhcmFtSW5mby5tZXNzYWdlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc3RyaWN0ICYmIHBhcmFtSW5mby5zdHJpY3RlZCkge1xuICAgICAgICAgICAgdG9sZXJhdGVVbmV4cGVjdGVkVG9rZW4ocGFyYW1JbmZvLnN0cmljdGVkLCBwYXJhbUluZm8ubWVzc2FnZSk7XG4gICAgICAgIH1cblxuICAgICAgICBzdHJpY3QgPSBwcmV2aW91c1N0cmljdDtcbiAgICAgICAgcmV0dXJuIG5vZGUuZmluaXNoRnVuY3Rpb25FeHByZXNzaW9uKG51bGwsIHBhcmFtSW5mby5wYXJhbXMsIHBhcmFtSW5mby5kZWZhdWx0cywgYm9keSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcGFyc2VQcm9wZXJ0eU1ldGhvZEZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgcGFyYW1zLCBtZXRob2QsIG5vZGUgPSBuZXcgTm9kZSgpO1xuXG4gICAgICAgIHBhcmFtcyA9IHBhcnNlUGFyYW1zKCk7XG4gICAgICAgIG1ldGhvZCA9IHBhcnNlUHJvcGVydHlGdW5jdGlvbihub2RlLCBwYXJhbXMpO1xuXG4gICAgICAgIHJldHVybiBtZXRob2Q7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcGFyc2VPYmplY3RQcm9wZXJ0eUtleSgpIHtcbiAgICAgICAgdmFyIHRva2VuLCBub2RlID0gbmV3IE5vZGUoKSwgZXhwcjtcblxuICAgICAgICB0b2tlbiA9IGxleCgpO1xuXG4gICAgICAgIC8vIE5vdGU6IFRoaXMgZnVuY3Rpb24gaXMgY2FsbGVkIG9ubHkgZnJvbSBwYXJzZU9iamVjdFByb3BlcnR5KCksIHdoZXJlXG4gICAgICAgIC8vIEVPRiBhbmQgUHVuY3R1YXRvciB0b2tlbnMgYXJlIGFscmVhZHkgZmlsdGVyZWQgb3V0LlxuXG4gICAgICAgIHN3aXRjaCAodG9rZW4udHlwZSkge1xuICAgICAgICBjYXNlIFRva2VuLlN0cmluZ0xpdGVyYWw6XG4gICAgICAgIGNhc2UgVG9rZW4uTnVtZXJpY0xpdGVyYWw6XG4gICAgICAgICAgICBpZiAoc3RyaWN0ICYmIHRva2VuLm9jdGFsKSB7XG4gICAgICAgICAgICAgICAgdG9sZXJhdGVVbmV4cGVjdGVkVG9rZW4odG9rZW4sIE1lc3NhZ2VzLlN0cmljdE9jdGFsTGl0ZXJhbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbm9kZS5maW5pc2hMaXRlcmFsKHRva2VuKTtcbiAgICAgICAgY2FzZSBUb2tlbi5JZGVudGlmaWVyOlxuICAgICAgICBjYXNlIFRva2VuLkJvb2xlYW5MaXRlcmFsOlxuICAgICAgICBjYXNlIFRva2VuLk51bGxMaXRlcmFsOlxuICAgICAgICBjYXNlIFRva2VuLktleXdvcmQ6XG4gICAgICAgICAgICByZXR1cm4gbm9kZS5maW5pc2hJZGVudGlmaWVyKHRva2VuLnZhbHVlKTtcbiAgICAgICAgY2FzZSBUb2tlbi5QdW5jdHVhdG9yOlxuICAgICAgICAgICAgaWYgKHRva2VuLnZhbHVlID09PSAnWycpIHtcbiAgICAgICAgICAgICAgICBleHByID0gaXNvbGF0ZUNvdmVyR3JhbW1hcihwYXJzZUFzc2lnbm1lbnRFeHByZXNzaW9uKTtcbiAgICAgICAgICAgICAgICBleHBlY3QoJ10nKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZXhwcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIHRocm93VW5leHBlY3RlZFRva2VuKHRva2VuKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsb29rYWhlYWRQcm9wZXJ0eU5hbWUoKSB7XG4gICAgICAgIHN3aXRjaCAobG9va2FoZWFkLnR5cGUpIHtcbiAgICAgICAgY2FzZSBUb2tlbi5JZGVudGlmaWVyOlxuICAgICAgICBjYXNlIFRva2VuLlN0cmluZ0xpdGVyYWw6XG4gICAgICAgIGNhc2UgVG9rZW4uQm9vbGVhbkxpdGVyYWw6XG4gICAgICAgIGNhc2UgVG9rZW4uTnVsbExpdGVyYWw6XG4gICAgICAgIGNhc2UgVG9rZW4uTnVtZXJpY0xpdGVyYWw6XG4gICAgICAgIGNhc2UgVG9rZW4uS2V5d29yZDpcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICBjYXNlIFRva2VuLlB1bmN0dWF0b3I6XG4gICAgICAgICAgICByZXR1cm4gbG9va2FoZWFkLnZhbHVlID09PSAnWyc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8vIFRoaXMgZnVuY3Rpb24gaXMgdG8gdHJ5IHRvIHBhcnNlIGEgTWV0aG9kRGVmaW5pdGlvbiBhcyBkZWZpbmVkIGluIDE0LjMuIEJ1dCBpbiB0aGUgY2FzZSBvZiBvYmplY3QgbGl0ZXJhbHMsXG4gICAgLy8gaXQgbWlnaHQgYmUgY2FsbGVkIGF0IGEgcG9zaXRpb24gd2hlcmUgdGhlcmUgaXMgaW4gZmFjdCBhIHNob3J0IGhhbmQgaWRlbnRpZmllciBwYXR0ZXJuIG9yIGEgZGF0YSBwcm9wZXJ0eS5cbiAgICAvLyBUaGlzIGNhbiBvbmx5IGJlIGRldGVybWluZWQgYWZ0ZXIgd2UgY29uc3VtZWQgdXAgdG8gdGhlIGxlZnQgcGFyZW50aGVzZXMuXG4gICAgLy9cbiAgICAvLyBJbiBvcmRlciB0byBhdm9pZCBiYWNrIHRyYWNraW5nLCBpdCByZXR1cm5zIGBudWxsYCBpZiB0aGUgcG9zaXRpb24gaXMgbm90IGEgTWV0aG9kRGVmaW5pdGlvbiBhbmQgdGhlIGNhbGxlclxuICAgIC8vIGlzIHJlc3BvbnNpYmxlIHRvIHZpc2l0IG90aGVyIG9wdGlvbnMuXG4gICAgZnVuY3Rpb24gdHJ5UGFyc2VNZXRob2REZWZpbml0aW9uKHRva2VuLCBrZXksIGNvbXB1dGVkLCBub2RlKSB7XG4gICAgICAgIHZhciB2YWx1ZSwgb3B0aW9ucywgbWV0aG9kTm9kZTtcblxuICAgICAgICBpZiAodG9rZW4udHlwZSA9PT0gVG9rZW4uSWRlbnRpZmllcikge1xuICAgICAgICAgICAgLy8gY2hlY2sgZm9yIGBnZXRgIGFuZCBgc2V0YDtcblxuICAgICAgICAgICAgaWYgKHRva2VuLnZhbHVlID09PSAnZ2V0JyAmJiBsb29rYWhlYWRQcm9wZXJ0eU5hbWUoKSkge1xuICAgICAgICAgICAgICAgIGNvbXB1dGVkID0gbWF0Y2goJ1snKTtcbiAgICAgICAgICAgICAgICBrZXkgPSBwYXJzZU9iamVjdFByb3BlcnR5S2V5KCk7XG4gICAgICAgICAgICAgICAgbWV0aG9kTm9kZSA9IG5ldyBOb2RlKCk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KCcoJyk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KCcpJyk7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSBwYXJzZVByb3BlcnR5RnVuY3Rpb24obWV0aG9kTm9kZSwge1xuICAgICAgICAgICAgICAgICAgICBwYXJhbXM6IFtdLFxuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0czogW10sXG4gICAgICAgICAgICAgICAgICAgIHN0cmljdGVkOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICBmaXJzdFJlc3RyaWN0ZWQ6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IG51bGxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gbm9kZS5maW5pc2hQcm9wZXJ0eSgnZ2V0Jywga2V5LCBjb21wdXRlZCwgdmFsdWUsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRva2VuLnZhbHVlID09PSAnc2V0JyAmJiBsb29rYWhlYWRQcm9wZXJ0eU5hbWUoKSkge1xuICAgICAgICAgICAgICAgIGNvbXB1dGVkID0gbWF0Y2goJ1snKTtcbiAgICAgICAgICAgICAgICBrZXkgPSBwYXJzZU9iamVjdFByb3BlcnR5S2V5KCk7XG4gICAgICAgICAgICAgICAgbWV0aG9kTm9kZSA9IG5ldyBOb2RlKCk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KCcoJyk7XG5cbiAgICAgICAgICAgICAgICBvcHRpb25zID0ge1xuICAgICAgICAgICAgICAgICAgICBwYXJhbXM6IFtdLFxuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0Q291bnQ6IDAsXG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHRzOiBbXSxcbiAgICAgICAgICAgICAgICAgICAgZmlyc3RSZXN0cmljdGVkOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICBwYXJhbVNldDoge31cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGlmIChtYXRjaCgnKScpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRvbGVyYXRlVW5leHBlY3RlZFRva2VuKGxvb2thaGVhZCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcGFyc2VQYXJhbShvcHRpb25zKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMuZGVmYXVsdENvdW50ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zLmRlZmF1bHRzID0gW107XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZXhwZWN0KCcpJyk7XG5cbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHBhcnNlUHJvcGVydHlGdW5jdGlvbihtZXRob2ROb2RlLCBvcHRpb25zKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gbm9kZS5maW5pc2hQcm9wZXJ0eSgnc2V0Jywga2V5LCBjb21wdXRlZCwgdmFsdWUsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobWF0Y2goJygnKSkge1xuICAgICAgICAgICAgdmFsdWUgPSBwYXJzZVByb3BlcnR5TWV0aG9kRnVuY3Rpb24oKTtcbiAgICAgICAgICAgIHJldHVybiBub2RlLmZpbmlzaFByb3BlcnR5KCdpbml0Jywga2V5LCBjb21wdXRlZCwgdmFsdWUsIHRydWUsIGZhbHNlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIE5vdCBhIE1ldGhvZERlZmluaXRpb24uXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNoZWNrUHJvdG8oa2V5LCBjb21wdXRlZCwgaGFzUHJvdG8pIHtcbiAgICAgICAgaWYgKGNvbXB1dGVkID09PSBmYWxzZSAmJiAoa2V5LnR5cGUgPT09IFN5bnRheC5JZGVudGlmaWVyICYmIGtleS5uYW1lID09PSAnX19wcm90b19fJyB8fFxuICAgICAgICAgICAga2V5LnR5cGUgPT09IFN5bnRheC5MaXRlcmFsICYmIGtleS52YWx1ZSA9PT0gJ19fcHJvdG9fXycpKSB7XG4gICAgICAgICAgICBpZiAoaGFzUHJvdG8udmFsdWUpIHtcbiAgICAgICAgICAgICAgICB0b2xlcmF0ZUVycm9yKE1lc3NhZ2VzLkR1cGxpY2F0ZVByb3RvUHJvcGVydHkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBoYXNQcm90by52YWx1ZSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwYXJzZU9iamVjdFByb3BlcnR5KGhhc1Byb3RvKSB7XG4gICAgICAgIHZhciB0b2tlbiA9IGxvb2thaGVhZCwgbm9kZSA9IG5ldyBOb2RlKCksIGNvbXB1dGVkLCBrZXksIG1heWJlTWV0aG9kLCB2YWx1ZTtcblxuICAgICAgICBjb21wdXRlZCA9IG1hdGNoKCdbJyk7XG4gICAgICAgIGtleSA9IHBhcnNlT2JqZWN0UHJvcGVydHlLZXkoKTtcbiAgICAgICAgbWF5YmVNZXRob2QgPSB0cnlQYXJzZU1ldGhvZERlZmluaXRpb24odG9rZW4sIGtleSwgY29tcHV0ZWQsIG5vZGUpO1xuXG4gICAgICAgIGlmIChtYXliZU1ldGhvZCkge1xuICAgICAgICAgICAgY2hlY2tQcm90byhtYXliZU1ldGhvZC5rZXksIG1heWJlTWV0aG9kLmNvbXB1dGVkLCBoYXNQcm90byk7XG4gICAgICAgICAgICAvLyBmaW5pc2hlZFxuICAgICAgICAgICAgcmV0dXJuIG1heWJlTWV0aG9kO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gaW5pdCBwcm9wZXJ0eSBvciBzaG9ydCBoYW5kIHByb3BlcnR5LlxuICAgICAgICBjaGVja1Byb3RvKGtleSwgY29tcHV0ZWQsIGhhc1Byb3RvKTtcblxuICAgICAgICBpZiAobWF0Y2goJzonKSkge1xuICAgICAgICAgICAgbGV4KCk7XG4gICAgICAgICAgICB2YWx1ZSA9IGluaGVyaXRDb3ZlckdyYW1tYXIocGFyc2VBc3NpZ25tZW50RXhwcmVzc2lvbik7XG4gICAgICAgICAgICByZXR1cm4gbm9kZS5maW5pc2hQcm9wZXJ0eSgnaW5pdCcsIGtleSwgY29tcHV0ZWQsIHZhbHVlLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRva2VuLnR5cGUgPT09IFRva2VuLklkZW50aWZpZXIpIHtcbiAgICAgICAgICAgIGlmIChtYXRjaCgnPScpKSB7XG4gICAgICAgICAgICAgICAgZmlyc3RDb3ZlckluaXRpYWxpemVkTmFtZUVycm9yID0gbG9va2FoZWFkO1xuICAgICAgICAgICAgICAgIGxleCgpO1xuICAgICAgICAgICAgICAgIHZhbHVlID0gaXNvbGF0ZUNvdmVyR3JhbW1hcihwYXJzZUFzc2lnbm1lbnRFeHByZXNzaW9uKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gbm9kZS5maW5pc2hQcm9wZXJ0eSgnaW5pdCcsIGtleSwgY29tcHV0ZWQsXG4gICAgICAgICAgICAgICAgICAgIG5ldyBXcmFwcGluZ05vZGUodG9rZW4pLmZpbmlzaEFzc2lnbm1lbnRQYXR0ZXJuKGtleSwgdmFsdWUpLCBmYWxzZSwgdHJ1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbm9kZS5maW5pc2hQcm9wZXJ0eSgnaW5pdCcsIGtleSwgY29tcHV0ZWQsIGtleSwgZmFsc2UsIHRydWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhyb3dVbmV4cGVjdGVkVG9rZW4obG9va2FoZWFkKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwYXJzZU9iamVjdEluaXRpYWxpc2VyKCkge1xuICAgICAgICB2YXIgcHJvcGVydGllcyA9IFtdLCBoYXNQcm90byA9IHt2YWx1ZTogZmFsc2V9LCBub2RlID0gbmV3IE5vZGUoKTtcblxuICAgICAgICBleHBlY3QoJ3snKTtcblxuICAgICAgICB3aGlsZSAoIW1hdGNoKCd9JykpIHtcbiAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaChwYXJzZU9iamVjdFByb3BlcnR5KGhhc1Byb3RvKSk7XG5cbiAgICAgICAgICAgIGlmICghbWF0Y2goJ30nKSkge1xuICAgICAgICAgICAgICAgIGV4cGVjdENvbW1hU2VwYXJhdG9yKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBleHBlY3QoJ30nKTtcblxuICAgICAgICByZXR1cm4gbm9kZS5maW5pc2hPYmplY3RFeHByZXNzaW9uKHByb3BlcnRpZXMpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlaW50ZXJwcmV0RXhwcmVzc2lvbkFzUGF0dGVybihleHByKSB7XG4gICAgICAgIHZhciBpO1xuICAgICAgICBzd2l0Y2ggKGV4cHIudHlwZSkge1xuICAgICAgICBjYXNlIFN5bnRheC5JZGVudGlmaWVyOlxuICAgICAgICBjYXNlIFN5bnRheC5NZW1iZXJFeHByZXNzaW9uOlxuICAgICAgICBjYXNlIFN5bnRheC5SZXN0RWxlbWVudDpcbiAgICAgICAgY2FzZSBTeW50YXguQXNzaWdubWVudFBhdHRlcm46XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBTeW50YXguU3ByZWFkRWxlbWVudDpcbiAgICAgICAgICAgIGV4cHIudHlwZSA9IFN5bnRheC5SZXN0RWxlbWVudDtcbiAgICAgICAgICAgIHJlaW50ZXJwcmV0RXhwcmVzc2lvbkFzUGF0dGVybihleHByLmFyZ3VtZW50KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFN5bnRheC5BcnJheUV4cHJlc3Npb246XG4gICAgICAgICAgICBleHByLnR5cGUgPSBTeW50YXguQXJyYXlQYXR0ZXJuO1xuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IGV4cHIuZWxlbWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoZXhwci5lbGVtZW50c1tpXSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICByZWludGVycHJldEV4cHJlc3Npb25Bc1BhdHRlcm4oZXhwci5lbGVtZW50c1tpXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgU3ludGF4Lk9iamVjdEV4cHJlc3Npb246XG4gICAgICAgICAgICBleHByLnR5cGUgPSBTeW50YXguT2JqZWN0UGF0dGVybjtcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBleHByLnByb3BlcnRpZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICByZWludGVycHJldEV4cHJlc3Npb25Bc1BhdHRlcm4oZXhwci5wcm9wZXJ0aWVzW2ldLnZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFN5bnRheC5Bc3NpZ25tZW50RXhwcmVzc2lvbjpcbiAgICAgICAgICAgIGV4cHIudHlwZSA9IFN5bnRheC5Bc3NpZ25tZW50UGF0dGVybjtcbiAgICAgICAgICAgIHJlaW50ZXJwcmV0RXhwcmVzc2lvbkFzUGF0dGVybihleHByLmxlZnQpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAvLyBBbGxvdyBvdGhlciBub2RlIHR5cGUgZm9yIHRvbGVyYW50IHBhcnNpbmcuXG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBhcnNlVGVtcGxhdGVFbGVtZW50KG9wdGlvbikge1xuICAgICAgICB2YXIgbm9kZSwgdG9rZW47XG5cbiAgICAgICAgaWYgKGxvb2thaGVhZC50eXBlICE9PSBUb2tlbi5UZW1wbGF0ZSB8fCAob3B0aW9uLmhlYWQgJiYgIWxvb2thaGVhZC5oZWFkKSkge1xuICAgICAgICAgICAgdGhyb3dVbmV4cGVjdGVkVG9rZW4oKTtcbiAgICAgICAgfVxuXG4gICAgICAgIG5vZGUgPSBuZXcgTm9kZSgpO1xuICAgICAgICB0b2tlbiA9IGxleCgpO1xuXG4gICAgICAgIHJldHVybiBub2RlLmZpbmlzaFRlbXBsYXRlRWxlbWVudCh7IHJhdzogdG9rZW4udmFsdWUucmF3LCBjb29rZWQ6IHRva2VuLnZhbHVlLmNvb2tlZCB9LCB0b2tlbi50YWlsKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwYXJzZVRlbXBsYXRlTGl0ZXJhbCgpIHtcbiAgICAgICAgdmFyIHF1YXNpLCBxdWFzaXMsIGV4cHJlc3Npb25zLCBub2RlID0gbmV3IE5vZGUoKTtcblxuICAgICAgICBxdWFzaSA9IHBhcnNlVGVtcGxhdGVFbGVtZW50KHsgaGVhZDogdHJ1ZSB9KTtcbiAgICAgICAgcXVhc2lzID0gWyBxdWFzaSBdO1xuICAgICAgICBleHByZXNzaW9ucyA9IFtdO1xuXG4gICAgICAgIHdoaWxlICghcXVhc2kudGFpbCkge1xuICAgICAgICAgICAgZXhwcmVzc2lvbnMucHVzaChwYXJzZUV4cHJlc3Npb24oKSk7XG4gICAgICAgICAgICBxdWFzaSA9IHBhcnNlVGVtcGxhdGVFbGVtZW50KHsgaGVhZDogZmFsc2UgfSk7XG4gICAgICAgICAgICBxdWFzaXMucHVzaChxdWFzaSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbm9kZS5maW5pc2hUZW1wbGF0ZUxpdGVyYWwocXVhc2lzLCBleHByZXNzaW9ucyk7XG4gICAgfVxuXG4gICAgLy8gMTEuMS42IFRoZSBHcm91cGluZyBPcGVyYXRvclxuXG4gICAgZnVuY3Rpb24gcGFyc2VHcm91cEV4cHJlc3Npb24oKSB7XG4gICAgICAgIHZhciBleHByLCBleHByZXNzaW9ucywgc3RhcnRUb2tlbiwgaTtcblxuICAgICAgICBleHBlY3QoJygnKTtcblxuICAgICAgICBpZiAobWF0Y2goJyknKSkge1xuICAgICAgICAgICAgbGV4KCk7XG4gICAgICAgICAgICBpZiAoIW1hdGNoKCc9PicpKSB7XG4gICAgICAgICAgICAgICAgZXhwZWN0KCc9PicpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB0eXBlOiBQbGFjZUhvbGRlcnMuQXJyb3dQYXJhbWV0ZXJQbGFjZUhvbGRlcixcbiAgICAgICAgICAgICAgICBwYXJhbXM6IFtdXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgc3RhcnRUb2tlbiA9IGxvb2thaGVhZDtcbiAgICAgICAgaWYgKG1hdGNoKCcuLi4nKSkge1xuICAgICAgICAgICAgZXhwciA9IHBhcnNlUmVzdEVsZW1lbnQoKTtcbiAgICAgICAgICAgIGV4cGVjdCgnKScpO1xuICAgICAgICAgICAgaWYgKCFtYXRjaCgnPT4nKSkge1xuICAgICAgICAgICAgICAgIGV4cGVjdCgnPT4nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgdHlwZTogUGxhY2VIb2xkZXJzLkFycm93UGFyYW1ldGVyUGxhY2VIb2xkZXIsXG4gICAgICAgICAgICAgICAgcGFyYW1zOiBbZXhwcl1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICBpc0JpbmRpbmdFbGVtZW50ID0gdHJ1ZTtcbiAgICAgICAgZXhwciA9IGluaGVyaXRDb3ZlckdyYW1tYXIocGFyc2VBc3NpZ25tZW50RXhwcmVzc2lvbik7XG5cbiAgICAgICAgaWYgKG1hdGNoKCcsJykpIHtcbiAgICAgICAgICAgIGlzQXNzaWdubWVudFRhcmdldCA9IGZhbHNlO1xuICAgICAgICAgICAgZXhwcmVzc2lvbnMgPSBbZXhwcl07XG5cbiAgICAgICAgICAgIHdoaWxlIChzdGFydEluZGV4IDwgbGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFtYXRjaCgnLCcpKSB7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBsZXgoKTtcblxuICAgICAgICAgICAgICAgIGlmIChtYXRjaCgnLi4uJykpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFpc0JpbmRpbmdFbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvd1VuZXhwZWN0ZWRUb2tlbihsb29rYWhlYWQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGV4cHJlc3Npb25zLnB1c2gocGFyc2VSZXN0RWxlbWVudCgpKTtcbiAgICAgICAgICAgICAgICAgICAgZXhwZWN0KCcpJyk7XG4gICAgICAgICAgICAgICAgICAgIGlmICghbWF0Y2goJz0+JykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGV4cGVjdCgnPT4nKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpc0JpbmRpbmdFbGVtZW50ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBleHByZXNzaW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVpbnRlcnByZXRFeHByZXNzaW9uQXNQYXR0ZXJuKGV4cHJlc3Npb25zW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogUGxhY2VIb2xkZXJzLkFycm93UGFyYW1ldGVyUGxhY2VIb2xkZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJhbXM6IGV4cHJlc3Npb25zXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZXhwcmVzc2lvbnMucHVzaChpbmhlcml0Q292ZXJHcmFtbWFyKHBhcnNlQXNzaWdubWVudEV4cHJlc3Npb24pKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZXhwciA9IG5ldyBXcmFwcGluZ05vZGUoc3RhcnRUb2tlbikuZmluaXNoU2VxdWVuY2VFeHByZXNzaW9uKGV4cHJlc3Npb25zKTtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgZXhwZWN0KCcpJyk7XG5cbiAgICAgICAgaWYgKG1hdGNoKCc9PicpKSB7XG4gICAgICAgICAgICBpZiAoIWlzQmluZGluZ0VsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICB0aHJvd1VuZXhwZWN0ZWRUb2tlbihsb29rYWhlYWQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoZXhwci50eXBlID09PSBTeW50YXguU2VxdWVuY2VFeHByZXNzaW9uKSB7XG4gICAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IGV4cHIuZXhwcmVzc2lvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgcmVpbnRlcnByZXRFeHByZXNzaW9uQXNQYXR0ZXJuKGV4cHIuZXhwcmVzc2lvbnNbaV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmVpbnRlcnByZXRFeHByZXNzaW9uQXNQYXR0ZXJuKGV4cHIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBleHByID0ge1xuICAgICAgICAgICAgICAgIHR5cGU6IFBsYWNlSG9sZGVycy5BcnJvd1BhcmFtZXRlclBsYWNlSG9sZGVyLFxuICAgICAgICAgICAgICAgIHBhcmFtczogZXhwci50eXBlID09PSBTeW50YXguU2VxdWVuY2VFeHByZXNzaW9uID8gZXhwci5leHByZXNzaW9ucyA6IFtleHByXVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBpc0JpbmRpbmdFbGVtZW50ID0gZmFsc2U7XG4gICAgICAgIHJldHVybiBleHByO1xuICAgIH1cblxuXG4gICAgLy8gMTEuMSBQcmltYXJ5IEV4cHJlc3Npb25zXG5cbiAgICBmdW5jdGlvbiBwYXJzZVByaW1hcnlFeHByZXNzaW9uKCkge1xuICAgICAgICB2YXIgdHlwZSwgdG9rZW4sIGV4cHIsIG5vZGU7XG5cbiAgICAgICAgaWYgKG1hdGNoKCcoJykpIHtcbiAgICAgICAgICAgIGlzQmluZGluZ0VsZW1lbnQgPSBmYWxzZTtcbiAgICAgICAgICAgIHJldHVybiBpbmhlcml0Q292ZXJHcmFtbWFyKHBhcnNlR3JvdXBFeHByZXNzaW9uKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChtYXRjaCgnWycpKSB7XG4gICAgICAgICAgICByZXR1cm4gaW5oZXJpdENvdmVyR3JhbW1hcihwYXJzZUFycmF5SW5pdGlhbGlzZXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG1hdGNoKCd7JykpIHtcbiAgICAgICAgICAgIHJldHVybiBpbmhlcml0Q292ZXJHcmFtbWFyKHBhcnNlT2JqZWN0SW5pdGlhbGlzZXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgdHlwZSA9IGxvb2thaGVhZC50eXBlO1xuICAgICAgICBub2RlID0gbmV3IE5vZGUoKTtcblxuICAgICAgICBpZiAodHlwZSA9PT0gVG9rZW4uSWRlbnRpZmllcikge1xuICAgICAgICAgICAgZXhwciA9IG5vZGUuZmluaXNoSWRlbnRpZmllcihsZXgoKS52YWx1ZSk7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gVG9rZW4uU3RyaW5nTGl0ZXJhbCB8fCB0eXBlID09PSBUb2tlbi5OdW1lcmljTGl0ZXJhbCkge1xuICAgICAgICAgICAgaXNBc3NpZ25tZW50VGFyZ2V0ID0gaXNCaW5kaW5nRWxlbWVudCA9IGZhbHNlO1xuICAgICAgICAgICAgaWYgKHN0cmljdCAmJiBsb29rYWhlYWQub2N0YWwpIHtcbiAgICAgICAgICAgICAgICB0b2xlcmF0ZVVuZXhwZWN0ZWRUb2tlbihsb29rYWhlYWQsIE1lc3NhZ2VzLlN0cmljdE9jdGFsTGl0ZXJhbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBleHByID0gbm9kZS5maW5pc2hMaXRlcmFsKGxleCgpKTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlID09PSBUb2tlbi5LZXl3b3JkKSB7XG4gICAgICAgICAgICBpc0Fzc2lnbm1lbnRUYXJnZXQgPSBpc0JpbmRpbmdFbGVtZW50ID0gZmFsc2U7XG4gICAgICAgICAgICBpZiAobWF0Y2hLZXl3b3JkKCdmdW5jdGlvbicpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhcnNlRnVuY3Rpb25FeHByZXNzaW9uKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobWF0Y2hLZXl3b3JkKCd0aGlzJykpIHtcbiAgICAgICAgICAgICAgICBsZXgoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gbm9kZS5maW5pc2hUaGlzRXhwcmVzc2lvbigpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG1hdGNoS2V5d29yZCgnY2xhc3MnKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBwYXJzZUNsYXNzRXhwcmVzc2lvbigpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhyb3dVbmV4cGVjdGVkVG9rZW4obGV4KCkpO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGUgPT09IFRva2VuLkJvb2xlYW5MaXRlcmFsKSB7XG4gICAgICAgICAgICBpc0Fzc2lnbm1lbnRUYXJnZXQgPSBpc0JpbmRpbmdFbGVtZW50ID0gZmFsc2U7XG4gICAgICAgICAgICB0b2tlbiA9IGxleCgpO1xuICAgICAgICAgICAgdG9rZW4udmFsdWUgPSAodG9rZW4udmFsdWUgPT09ICd0cnVlJyk7XG4gICAgICAgICAgICBleHByID0gbm9kZS5maW5pc2hMaXRlcmFsKHRva2VuKTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlID09PSBUb2tlbi5OdWxsTGl0ZXJhbCkge1xuICAgICAgICAgICAgaXNBc3NpZ25tZW50VGFyZ2V0ID0gaXNCaW5kaW5nRWxlbWVudCA9IGZhbHNlO1xuICAgICAgICAgICAgdG9rZW4gPSBsZXgoKTtcbiAgICAgICAgICAgIHRva2VuLnZhbHVlID0gbnVsbDtcbiAgICAgICAgICAgIGV4cHIgPSBub2RlLmZpbmlzaExpdGVyYWwodG9rZW4pO1xuICAgICAgICB9IGVsc2UgaWYgKG1hdGNoKCcvJykgfHwgbWF0Y2goJy89JykpIHtcbiAgICAgICAgICAgIGlzQXNzaWdubWVudFRhcmdldCA9IGlzQmluZGluZ0VsZW1lbnQgPSBmYWxzZTtcbiAgICAgICAgICAgIGluZGV4ID0gc3RhcnRJbmRleDtcblxuICAgICAgICAgICAgaWYgKHR5cGVvZiBleHRyYS50b2tlbnMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgdG9rZW4gPSBjb2xsZWN0UmVnZXgoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdG9rZW4gPSBzY2FuUmVnRXhwKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXgoKTtcbiAgICAgICAgICAgIGV4cHIgPSBub2RlLmZpbmlzaExpdGVyYWwodG9rZW4pO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGUgPT09IFRva2VuLlRlbXBsYXRlKSB7XG4gICAgICAgICAgICBleHByID0gcGFyc2VUZW1wbGF0ZUxpdGVyYWwoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93VW5leHBlY3RlZFRva2VuKGxleCgpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBleHByO1xuICAgIH1cblxuICAgIC8vIDExLjIgTGVmdC1IYW5kLVNpZGUgRXhwcmVzc2lvbnNcblxuICAgIGZ1bmN0aW9uIHBhcnNlQXJndW1lbnRzKCkge1xuICAgICAgICB2YXIgYXJncyA9IFtdO1xuXG4gICAgICAgIGV4cGVjdCgnKCcpO1xuXG4gICAgICAgIGlmICghbWF0Y2goJyknKSkge1xuICAgICAgICAgICAgd2hpbGUgKHN0YXJ0SW5kZXggPCBsZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBhcmdzLnB1c2goaXNvbGF0ZUNvdmVyR3JhbW1hcihwYXJzZUFzc2lnbm1lbnRFeHByZXNzaW9uKSk7XG4gICAgICAgICAgICAgICAgaWYgKG1hdGNoKCcpJykpIHtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGV4cGVjdENvbW1hU2VwYXJhdG9yKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBleHBlY3QoJyknKTtcblxuICAgICAgICByZXR1cm4gYXJncztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwYXJzZU5vbkNvbXB1dGVkUHJvcGVydHkoKSB7XG4gICAgICAgIHZhciB0b2tlbiwgbm9kZSA9IG5ldyBOb2RlKCk7XG5cbiAgICAgICAgdG9rZW4gPSBsZXgoKTtcblxuICAgICAgICBpZiAoIWlzSWRlbnRpZmllck5hbWUodG9rZW4pKSB7XG4gICAgICAgICAgICB0aHJvd1VuZXhwZWN0ZWRUb2tlbih0b2tlbik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbm9kZS5maW5pc2hJZGVudGlmaWVyKHRva2VuLnZhbHVlKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwYXJzZU5vbkNvbXB1dGVkTWVtYmVyKCkge1xuICAgICAgICBleHBlY3QoJy4nKTtcblxuICAgICAgICByZXR1cm4gcGFyc2VOb25Db21wdXRlZFByb3BlcnR5KCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcGFyc2VDb21wdXRlZE1lbWJlcigpIHtcbiAgICAgICAgdmFyIGV4cHI7XG5cbiAgICAgICAgZXhwZWN0KCdbJyk7XG5cbiAgICAgICAgZXhwciA9IGlzb2xhdGVDb3ZlckdyYW1tYXIocGFyc2VFeHByZXNzaW9uKTtcblxuICAgICAgICBleHBlY3QoJ10nKTtcblxuICAgICAgICByZXR1cm4gZXhwcjtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwYXJzZU5ld0V4cHJlc3Npb24oKSB7XG4gICAgICAgIHZhciBjYWxsZWUsIGFyZ3MsIG5vZGUgPSBuZXcgTm9kZSgpO1xuXG4gICAgICAgIGV4cGVjdEtleXdvcmQoJ25ldycpO1xuICAgICAgICBjYWxsZWUgPSBpc29sYXRlQ292ZXJHcmFtbWFyKHBhcnNlTGVmdEhhbmRTaWRlRXhwcmVzc2lvbik7XG4gICAgICAgIGFyZ3MgPSBtYXRjaCgnKCcpID8gcGFyc2VBcmd1bWVudHMoKSA6IFtdO1xuXG4gICAgICAgIGlzQXNzaWdubWVudFRhcmdldCA9IGlzQmluZGluZ0VsZW1lbnQgPSBmYWxzZTtcblxuICAgICAgICByZXR1cm4gbm9kZS5maW5pc2hOZXdFeHByZXNzaW9uKGNhbGxlZSwgYXJncyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcGFyc2VMZWZ0SGFuZFNpZGVFeHByZXNzaW9uQWxsb3dDYWxsKCkge1xuICAgICAgICB2YXIgcXVhc2ksIGV4cHIsIGFyZ3MsIHByb3BlcnR5LCBzdGFydFRva2VuLCBwcmV2aW91c0FsbG93SW4gPSBzdGF0ZS5hbGxvd0luO1xuXG4gICAgICAgIHN0YXJ0VG9rZW4gPSBsb29rYWhlYWQ7XG4gICAgICAgIHN0YXRlLmFsbG93SW4gPSB0cnVlO1xuXG4gICAgICAgIGlmIChtYXRjaEtleXdvcmQoJ3N1cGVyJykgJiYgc3RhdGUuaW5GdW5jdGlvbkJvZHkpIHtcbiAgICAgICAgICAgIGV4cHIgPSBuZXcgTm9kZSgpO1xuICAgICAgICAgICAgbGV4KCk7XG4gICAgICAgICAgICBleHByID0gZXhwci5maW5pc2hTdXBlcigpO1xuICAgICAgICAgICAgaWYgKCFtYXRjaCgnKCcpICYmICFtYXRjaCgnLicpICYmICFtYXRjaCgnWycpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3dVbmV4cGVjdGVkVG9rZW4obG9va2FoZWFkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGV4cHIgPSBpbmhlcml0Q292ZXJHcmFtbWFyKG1hdGNoS2V5d29yZCgnbmV3JykgPyBwYXJzZU5ld0V4cHJlc3Npb24gOiBwYXJzZVByaW1hcnlFeHByZXNzaW9uKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAoOzspIHtcbiAgICAgICAgICAgIGlmIChtYXRjaCgnLicpKSB7XG4gICAgICAgICAgICAgICAgaXNCaW5kaW5nRWxlbWVudCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGlzQXNzaWdubWVudFRhcmdldCA9IHRydWU7XG4gICAgICAgICAgICAgICAgcHJvcGVydHkgPSBwYXJzZU5vbkNvbXB1dGVkTWVtYmVyKCk7XG4gICAgICAgICAgICAgICAgZXhwciA9IG5ldyBXcmFwcGluZ05vZGUoc3RhcnRUb2tlbikuZmluaXNoTWVtYmVyRXhwcmVzc2lvbignLicsIGV4cHIsIHByb3BlcnR5KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobWF0Y2goJygnKSkge1xuICAgICAgICAgICAgICAgIGlzQmluZGluZ0VsZW1lbnQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBpc0Fzc2lnbm1lbnRUYXJnZXQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBhcmdzID0gcGFyc2VBcmd1bWVudHMoKTtcbiAgICAgICAgICAgICAgICBleHByID0gbmV3IFdyYXBwaW5nTm9kZShzdGFydFRva2VuKS5maW5pc2hDYWxsRXhwcmVzc2lvbihleHByLCBhcmdzKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobWF0Y2goJ1snKSkge1xuICAgICAgICAgICAgICAgIGlzQmluZGluZ0VsZW1lbnQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBpc0Fzc2lnbm1lbnRUYXJnZXQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHByb3BlcnR5ID0gcGFyc2VDb21wdXRlZE1lbWJlcigpO1xuICAgICAgICAgICAgICAgIGV4cHIgPSBuZXcgV3JhcHBpbmdOb2RlKHN0YXJ0VG9rZW4pLmZpbmlzaE1lbWJlckV4cHJlc3Npb24oJ1snLCBleHByLCBwcm9wZXJ0eSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGxvb2thaGVhZC50eXBlID09PSBUb2tlbi5UZW1wbGF0ZSAmJiBsb29rYWhlYWQuaGVhZCkge1xuICAgICAgICAgICAgICAgIHF1YXNpID0gcGFyc2VUZW1wbGF0ZUxpdGVyYWwoKTtcbiAgICAgICAgICAgICAgICBleHByID0gbmV3IFdyYXBwaW5nTm9kZShzdGFydFRva2VuKS5maW5pc2hUYWdnZWRUZW1wbGF0ZUV4cHJlc3Npb24oZXhwciwgcXVhc2kpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBzdGF0ZS5hbGxvd0luID0gcHJldmlvdXNBbGxvd0luO1xuXG4gICAgICAgIHJldHVybiBleHByO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBhcnNlTGVmdEhhbmRTaWRlRXhwcmVzc2lvbigpIHtcbiAgICAgICAgdmFyIHF1YXNpLCBleHByLCBwcm9wZXJ0eSwgc3RhcnRUb2tlbjtcbiAgICAgICAgYXNzZXJ0KHN0YXRlLmFsbG93SW4sICdjYWxsZWUgb2YgbmV3IGV4cHJlc3Npb24gYWx3YXlzIGFsbG93IGluIGtleXdvcmQuJyk7XG5cbiAgICAgICAgc3RhcnRUb2tlbiA9IGxvb2thaGVhZDtcblxuICAgICAgICBpZiAobWF0Y2hLZXl3b3JkKCdzdXBlcicpICYmIHN0YXRlLmluRnVuY3Rpb25Cb2R5KSB7XG4gICAgICAgICAgICBleHByID0gbmV3IE5vZGUoKTtcbiAgICAgICAgICAgIGxleCgpO1xuICAgICAgICAgICAgZXhwciA9IGV4cHIuZmluaXNoU3VwZXIoKTtcbiAgICAgICAgICAgIGlmICghbWF0Y2goJ1snKSAmJiAhbWF0Y2goJy4nKSkge1xuICAgICAgICAgICAgICAgIHRocm93VW5leHBlY3RlZFRva2VuKGxvb2thaGVhZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBleHByID0gaW5oZXJpdENvdmVyR3JhbW1hcihtYXRjaEtleXdvcmQoJ25ldycpID8gcGFyc2VOZXdFeHByZXNzaW9uIDogcGFyc2VQcmltYXJ5RXhwcmVzc2lvbik7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKDs7KSB7XG4gICAgICAgICAgICBpZiAobWF0Y2goJ1snKSkge1xuICAgICAgICAgICAgICAgIGlzQmluZGluZ0VsZW1lbnQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBpc0Fzc2lnbm1lbnRUYXJnZXQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHByb3BlcnR5ID0gcGFyc2VDb21wdXRlZE1lbWJlcigpO1xuICAgICAgICAgICAgICAgIGV4cHIgPSBuZXcgV3JhcHBpbmdOb2RlKHN0YXJ0VG9rZW4pLmZpbmlzaE1lbWJlckV4cHJlc3Npb24oJ1snLCBleHByLCBwcm9wZXJ0eSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG1hdGNoKCcuJykpIHtcbiAgICAgICAgICAgICAgICBpc0JpbmRpbmdFbGVtZW50ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgaXNBc3NpZ25tZW50VGFyZ2V0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0eSA9IHBhcnNlTm9uQ29tcHV0ZWRNZW1iZXIoKTtcbiAgICAgICAgICAgICAgICBleHByID0gbmV3IFdyYXBwaW5nTm9kZShzdGFydFRva2VuKS5maW5pc2hNZW1iZXJFeHByZXNzaW9uKCcuJywgZXhwciwgcHJvcGVydHkpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChsb29rYWhlYWQudHlwZSA9PT0gVG9rZW4uVGVtcGxhdGUgJiYgbG9va2FoZWFkLmhlYWQpIHtcbiAgICAgICAgICAgICAgICBxdWFzaSA9IHBhcnNlVGVtcGxhdGVMaXRlcmFsKCk7XG4gICAgICAgICAgICAgICAgZXhwciA9IG5ldyBXcmFwcGluZ05vZGUoc3RhcnRUb2tlbikuZmluaXNoVGFnZ2VkVGVtcGxhdGVFeHByZXNzaW9uKGV4cHIsIHF1YXNpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGV4cHI7XG4gICAgfVxuXG4gICAgLy8gMTEuMyBQb3N0Zml4IEV4cHJlc3Npb25zXG5cbiAgICBmdW5jdGlvbiBwYXJzZVBvc3RmaXhFeHByZXNzaW9uKCkge1xuICAgICAgICB2YXIgZXhwciwgdG9rZW4sIHN0YXJ0VG9rZW4gPSBsb29rYWhlYWQ7XG5cbiAgICAgICAgZXhwciA9IGluaGVyaXRDb3ZlckdyYW1tYXIocGFyc2VMZWZ0SGFuZFNpZGVFeHByZXNzaW9uQWxsb3dDYWxsKTtcblxuICAgICAgICBpZiAoIWhhc0xpbmVUZXJtaW5hdG9yICYmIGxvb2thaGVhZC50eXBlID09PSBUb2tlbi5QdW5jdHVhdG9yKSB7XG4gICAgICAgICAgICBpZiAobWF0Y2goJysrJykgfHwgbWF0Y2goJy0tJykpIHtcbiAgICAgICAgICAgICAgICAvLyAxMS4zLjEsIDExLjMuMlxuICAgICAgICAgICAgICAgIGlmIChzdHJpY3QgJiYgZXhwci50eXBlID09PSBTeW50YXguSWRlbnRpZmllciAmJiBpc1Jlc3RyaWN0ZWRXb3JkKGV4cHIubmFtZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdG9sZXJhdGVFcnJvcihNZXNzYWdlcy5TdHJpY3RMSFNQb3N0Zml4KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoIWlzQXNzaWdubWVudFRhcmdldCkge1xuICAgICAgICAgICAgICAgICAgICB0b2xlcmF0ZUVycm9yKE1lc3NhZ2VzLkludmFsaWRMSFNJbkFzc2lnbm1lbnQpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlzQXNzaWdubWVudFRhcmdldCA9IGlzQmluZGluZ0VsZW1lbnQgPSBmYWxzZTtcblxuICAgICAgICAgICAgICAgIHRva2VuID0gbGV4KCk7XG4gICAgICAgICAgICAgICAgZXhwciA9IG5ldyBXcmFwcGluZ05vZGUoc3RhcnRUb2tlbikuZmluaXNoUG9zdGZpeEV4cHJlc3Npb24odG9rZW4udmFsdWUsIGV4cHIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGV4cHI7XG4gICAgfVxuXG4gICAgLy8gMTEuNCBVbmFyeSBPcGVyYXRvcnNcblxuICAgIGZ1bmN0aW9uIHBhcnNlVW5hcnlFeHByZXNzaW9uKCkge1xuICAgICAgICB2YXIgdG9rZW4sIGV4cHIsIHN0YXJ0VG9rZW47XG5cbiAgICAgICAgaWYgKGxvb2thaGVhZC50eXBlICE9PSBUb2tlbi5QdW5jdHVhdG9yICYmIGxvb2thaGVhZC50eXBlICE9PSBUb2tlbi5LZXl3b3JkKSB7XG4gICAgICAgICAgICBleHByID0gcGFyc2VQb3N0Zml4RXhwcmVzc2lvbigpO1xuICAgICAgICB9IGVsc2UgaWYgKG1hdGNoKCcrKycpIHx8IG1hdGNoKCctLScpKSB7XG4gICAgICAgICAgICBzdGFydFRva2VuID0gbG9va2FoZWFkO1xuICAgICAgICAgICAgdG9rZW4gPSBsZXgoKTtcbiAgICAgICAgICAgIGV4cHIgPSBpbmhlcml0Q292ZXJHcmFtbWFyKHBhcnNlVW5hcnlFeHByZXNzaW9uKTtcbiAgICAgICAgICAgIC8vIDExLjQuNCwgMTEuNC41XG4gICAgICAgICAgICBpZiAoc3RyaWN0ICYmIGV4cHIudHlwZSA9PT0gU3ludGF4LklkZW50aWZpZXIgJiYgaXNSZXN0cmljdGVkV29yZChleHByLm5hbWUpKSB7XG4gICAgICAgICAgICAgICAgdG9sZXJhdGVFcnJvcihNZXNzYWdlcy5TdHJpY3RMSFNQcmVmaXgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIWlzQXNzaWdubWVudFRhcmdldCkge1xuICAgICAgICAgICAgICAgIHRvbGVyYXRlRXJyb3IoTWVzc2FnZXMuSW52YWxpZExIU0luQXNzaWdubWVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBleHByID0gbmV3IFdyYXBwaW5nTm9kZShzdGFydFRva2VuKS5maW5pc2hVbmFyeUV4cHJlc3Npb24odG9rZW4udmFsdWUsIGV4cHIpO1xuICAgICAgICAgICAgaXNBc3NpZ25tZW50VGFyZ2V0ID0gaXNCaW5kaW5nRWxlbWVudCA9IGZhbHNlO1xuICAgICAgICB9IGVsc2UgaWYgKG1hdGNoKCcrJykgfHwgbWF0Y2goJy0nKSB8fCBtYXRjaCgnficpIHx8IG1hdGNoKCchJykpIHtcbiAgICAgICAgICAgIHN0YXJ0VG9rZW4gPSBsb29rYWhlYWQ7XG4gICAgICAgICAgICB0b2tlbiA9IGxleCgpO1xuICAgICAgICAgICAgZXhwciA9IGluaGVyaXRDb3ZlckdyYW1tYXIocGFyc2VVbmFyeUV4cHJlc3Npb24pO1xuICAgICAgICAgICAgZXhwciA9IG5ldyBXcmFwcGluZ05vZGUoc3RhcnRUb2tlbikuZmluaXNoVW5hcnlFeHByZXNzaW9uKHRva2VuLnZhbHVlLCBleHByKTtcbiAgICAgICAgICAgIGlzQXNzaWdubWVudFRhcmdldCA9IGlzQmluZGluZ0VsZW1lbnQgPSBmYWxzZTtcbiAgICAgICAgfSBlbHNlIGlmIChtYXRjaEtleXdvcmQoJ2RlbGV0ZScpIHx8IG1hdGNoS2V5d29yZCgndm9pZCcpIHx8IG1hdGNoS2V5d29yZCgndHlwZW9mJykpIHtcbiAgICAgICAgICAgIHN0YXJ0VG9rZW4gPSBsb29rYWhlYWQ7XG4gICAgICAgICAgICB0b2tlbiA9IGxleCgpO1xuICAgICAgICAgICAgZXhwciA9IGluaGVyaXRDb3ZlckdyYW1tYXIocGFyc2VVbmFyeUV4cHJlc3Npb24pO1xuICAgICAgICAgICAgZXhwciA9IG5ldyBXcmFwcGluZ05vZGUoc3RhcnRUb2tlbikuZmluaXNoVW5hcnlFeHByZXNzaW9uKHRva2VuLnZhbHVlLCBleHByKTtcbiAgICAgICAgICAgIGlmIChzdHJpY3QgJiYgZXhwci5vcGVyYXRvciA9PT0gJ2RlbGV0ZScgJiYgZXhwci5hcmd1bWVudC50eXBlID09PSBTeW50YXguSWRlbnRpZmllcikge1xuICAgICAgICAgICAgICAgIHRvbGVyYXRlRXJyb3IoTWVzc2FnZXMuU3RyaWN0RGVsZXRlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlzQXNzaWdubWVudFRhcmdldCA9IGlzQmluZGluZ0VsZW1lbnQgPSBmYWxzZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGV4cHIgPSBwYXJzZVBvc3RmaXhFeHByZXNzaW9uKCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZXhwcjtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBiaW5hcnlQcmVjZWRlbmNlKHRva2VuLCBhbGxvd0luKSB7XG4gICAgICAgIHZhciBwcmVjID0gMDtcblxuICAgICAgICBpZiAodG9rZW4udHlwZSAhPT0gVG9rZW4uUHVuY3R1YXRvciAmJiB0b2tlbi50eXBlICE9PSBUb2tlbi5LZXl3b3JkKSB7XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIHN3aXRjaCAodG9rZW4udmFsdWUpIHtcbiAgICAgICAgY2FzZSAnfHwnOlxuICAgICAgICAgICAgcHJlYyA9IDE7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlICcmJic6XG4gICAgICAgICAgICBwcmVjID0gMjtcbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgJ3wnOlxuICAgICAgICAgICAgcHJlYyA9IDM7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlICdeJzpcbiAgICAgICAgICAgIHByZWMgPSA0O1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSAnJic6XG4gICAgICAgICAgICBwcmVjID0gNTtcbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgJz09JzpcbiAgICAgICAgY2FzZSAnIT0nOlxuICAgICAgICBjYXNlICc9PT0nOlxuICAgICAgICBjYXNlICchPT0nOlxuICAgICAgICAgICAgcHJlYyA9IDY7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlICc8JzpcbiAgICAgICAgY2FzZSAnPic6XG4gICAgICAgIGNhc2UgJzw9JzpcbiAgICAgICAgY2FzZSAnPj0nOlxuICAgICAgICBjYXNlICdpbnN0YW5jZW9mJzpcbiAgICAgICAgICAgIHByZWMgPSA3O1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSAnaW4nOlxuICAgICAgICAgICAgcHJlYyA9IGFsbG93SW4gPyA3IDogMDtcbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgJzw8JzpcbiAgICAgICAgY2FzZSAnPj4nOlxuICAgICAgICBjYXNlICc+Pj4nOlxuICAgICAgICAgICAgcHJlYyA9IDg7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlICcrJzpcbiAgICAgICAgY2FzZSAnLSc6XG4gICAgICAgICAgICBwcmVjID0gOTtcbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgJyonOlxuICAgICAgICBjYXNlICcvJzpcbiAgICAgICAgY2FzZSAnJSc6XG4gICAgICAgICAgICBwcmVjID0gMTE7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcHJlYztcbiAgICB9XG5cbiAgICAvLyAxMS41IE11bHRpcGxpY2F0aXZlIE9wZXJhdG9yc1xuICAgIC8vIDExLjYgQWRkaXRpdmUgT3BlcmF0b3JzXG4gICAgLy8gMTEuNyBCaXR3aXNlIFNoaWZ0IE9wZXJhdG9yc1xuICAgIC8vIDExLjggUmVsYXRpb25hbCBPcGVyYXRvcnNcbiAgICAvLyAxMS45IEVxdWFsaXR5IE9wZXJhdG9yc1xuICAgIC8vIDExLjEwIEJpbmFyeSBCaXR3aXNlIE9wZXJhdG9yc1xuICAgIC8vIDExLjExIEJpbmFyeSBMb2dpY2FsIE9wZXJhdG9yc1xuXG4gICAgZnVuY3Rpb24gcGFyc2VCaW5hcnlFeHByZXNzaW9uKCkge1xuICAgICAgICB2YXIgbWFya2VyLCBtYXJrZXJzLCBleHByLCB0b2tlbiwgcHJlYywgc3RhY2ssIHJpZ2h0LCBvcGVyYXRvciwgbGVmdCwgaTtcblxuICAgICAgICBtYXJrZXIgPSBsb29rYWhlYWQ7XG4gICAgICAgIGxlZnQgPSBpbmhlcml0Q292ZXJHcmFtbWFyKHBhcnNlVW5hcnlFeHByZXNzaW9uKTtcblxuICAgICAgICB0b2tlbiA9IGxvb2thaGVhZDtcbiAgICAgICAgcHJlYyA9IGJpbmFyeVByZWNlZGVuY2UodG9rZW4sIHN0YXRlLmFsbG93SW4pO1xuICAgICAgICBpZiAocHJlYyA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIGxlZnQ7XG4gICAgICAgIH1cbiAgICAgICAgaXNBc3NpZ25tZW50VGFyZ2V0ID0gaXNCaW5kaW5nRWxlbWVudCA9IGZhbHNlO1xuICAgICAgICB0b2tlbi5wcmVjID0gcHJlYztcbiAgICAgICAgbGV4KCk7XG5cbiAgICAgICAgbWFya2VycyA9IFttYXJrZXIsIGxvb2thaGVhZF07XG4gICAgICAgIHJpZ2h0ID0gaXNvbGF0ZUNvdmVyR3JhbW1hcihwYXJzZVVuYXJ5RXhwcmVzc2lvbik7XG5cbiAgICAgICAgc3RhY2sgPSBbbGVmdCwgdG9rZW4sIHJpZ2h0XTtcblxuICAgICAgICB3aGlsZSAoKHByZWMgPSBiaW5hcnlQcmVjZWRlbmNlKGxvb2thaGVhZCwgc3RhdGUuYWxsb3dJbikpID4gMCkge1xuXG4gICAgICAgICAgICAvLyBSZWR1Y2U6IG1ha2UgYSBiaW5hcnkgZXhwcmVzc2lvbiBmcm9tIHRoZSB0aHJlZSB0b3Btb3N0IGVudHJpZXMuXG4gICAgICAgICAgICB3aGlsZSAoKHN0YWNrLmxlbmd0aCA+IDIpICYmIChwcmVjIDw9IHN0YWNrW3N0YWNrLmxlbmd0aCAtIDJdLnByZWMpKSB7XG4gICAgICAgICAgICAgICAgcmlnaHQgPSBzdGFjay5wb3AoKTtcbiAgICAgICAgICAgICAgICBvcGVyYXRvciA9IHN0YWNrLnBvcCgpLnZhbHVlO1xuICAgICAgICAgICAgICAgIGxlZnQgPSBzdGFjay5wb3AoKTtcbiAgICAgICAgICAgICAgICBtYXJrZXJzLnBvcCgpO1xuICAgICAgICAgICAgICAgIGV4cHIgPSBuZXcgV3JhcHBpbmdOb2RlKG1hcmtlcnNbbWFya2Vycy5sZW5ndGggLSAxXSkuZmluaXNoQmluYXJ5RXhwcmVzc2lvbihvcGVyYXRvciwgbGVmdCwgcmlnaHQpO1xuICAgICAgICAgICAgICAgIHN0YWNrLnB1c2goZXhwcik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFNoaWZ0LlxuICAgICAgICAgICAgdG9rZW4gPSBsZXgoKTtcbiAgICAgICAgICAgIHRva2VuLnByZWMgPSBwcmVjO1xuICAgICAgICAgICAgc3RhY2sucHVzaCh0b2tlbik7XG4gICAgICAgICAgICBtYXJrZXJzLnB1c2gobG9va2FoZWFkKTtcbiAgICAgICAgICAgIGV4cHIgPSBpc29sYXRlQ292ZXJHcmFtbWFyKHBhcnNlVW5hcnlFeHByZXNzaW9uKTtcbiAgICAgICAgICAgIHN0YWNrLnB1c2goZXhwcik7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBGaW5hbCByZWR1Y2UgdG8gY2xlYW4tdXAgdGhlIHN0YWNrLlxuICAgICAgICBpID0gc3RhY2subGVuZ3RoIC0gMTtcbiAgICAgICAgZXhwciA9IHN0YWNrW2ldO1xuICAgICAgICBtYXJrZXJzLnBvcCgpO1xuICAgICAgICB3aGlsZSAoaSA+IDEpIHtcbiAgICAgICAgICAgIGV4cHIgPSBuZXcgV3JhcHBpbmdOb2RlKG1hcmtlcnMucG9wKCkpLmZpbmlzaEJpbmFyeUV4cHJlc3Npb24oc3RhY2tbaSAtIDFdLnZhbHVlLCBzdGFja1tpIC0gMl0sIGV4cHIpO1xuICAgICAgICAgICAgaSAtPSAyO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGV4cHI7XG4gICAgfVxuXG5cbiAgICAvLyAxMS4xMiBDb25kaXRpb25hbCBPcGVyYXRvclxuXG4gICAgZnVuY3Rpb24gcGFyc2VDb25kaXRpb25hbEV4cHJlc3Npb24oKSB7XG4gICAgICAgIHZhciBleHByLCBwcmV2aW91c0FsbG93SW4sIGNvbnNlcXVlbnQsIGFsdGVybmF0ZSwgc3RhcnRUb2tlbjtcblxuICAgICAgICBzdGFydFRva2VuID0gbG9va2FoZWFkO1xuXG4gICAgICAgIGV4cHIgPSBpbmhlcml0Q292ZXJHcmFtbWFyKHBhcnNlQmluYXJ5RXhwcmVzc2lvbik7XG4gICAgICAgIGlmIChtYXRjaCgnPycpKSB7XG4gICAgICAgICAgICBsZXgoKTtcbiAgICAgICAgICAgIHByZXZpb3VzQWxsb3dJbiA9IHN0YXRlLmFsbG93SW47XG4gICAgICAgICAgICBzdGF0ZS5hbGxvd0luID0gdHJ1ZTtcbiAgICAgICAgICAgIGNvbnNlcXVlbnQgPSBpc29sYXRlQ292ZXJHcmFtbWFyKHBhcnNlQXNzaWdubWVudEV4cHJlc3Npb24pO1xuICAgICAgICAgICAgc3RhdGUuYWxsb3dJbiA9IHByZXZpb3VzQWxsb3dJbjtcbiAgICAgICAgICAgIGV4cGVjdCgnOicpO1xuICAgICAgICAgICAgYWx0ZXJuYXRlID0gaXNvbGF0ZUNvdmVyR3JhbW1hcihwYXJzZUFzc2lnbm1lbnRFeHByZXNzaW9uKTtcblxuICAgICAgICAgICAgZXhwciA9IG5ldyBXcmFwcGluZ05vZGUoc3RhcnRUb2tlbikuZmluaXNoQ29uZGl0aW9uYWxFeHByZXNzaW9uKGV4cHIsIGNvbnNlcXVlbnQsIGFsdGVybmF0ZSk7XG4gICAgICAgICAgICBpc0Fzc2lnbm1lbnRUYXJnZXQgPSBpc0JpbmRpbmdFbGVtZW50ID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZXhwcjtcbiAgICB9XG5cbiAgICAvLyBbRVM2XSAxNC4yIEFycm93IEZ1bmN0aW9uXG5cbiAgICBmdW5jdGlvbiBwYXJzZUNvbmNpc2VCb2R5KCkge1xuICAgICAgICBpZiAobWF0Y2goJ3snKSkge1xuICAgICAgICAgICAgcmV0dXJuIHBhcnNlRnVuY3Rpb25Tb3VyY2VFbGVtZW50cygpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpc29sYXRlQ292ZXJHcmFtbWFyKHBhcnNlQXNzaWdubWVudEV4cHJlc3Npb24pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNoZWNrUGF0dGVyblBhcmFtKG9wdGlvbnMsIHBhcmFtKSB7XG4gICAgICAgIHZhciBpO1xuICAgICAgICBzd2l0Y2ggKHBhcmFtLnR5cGUpIHtcbiAgICAgICAgY2FzZSBTeW50YXguSWRlbnRpZmllcjpcbiAgICAgICAgICAgIHZhbGlkYXRlUGFyYW0ob3B0aW9ucywgcGFyYW0sIHBhcmFtLm5hbWUpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgU3ludGF4LlJlc3RFbGVtZW50OlxuICAgICAgICAgICAgY2hlY2tQYXR0ZXJuUGFyYW0ob3B0aW9ucywgcGFyYW0uYXJndW1lbnQpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgU3ludGF4LkFzc2lnbm1lbnRQYXR0ZXJuOlxuICAgICAgICAgICAgY2hlY2tQYXR0ZXJuUGFyYW0ob3B0aW9ucywgcGFyYW0ubGVmdCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBTeW50YXguQXJyYXlQYXR0ZXJuOlxuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IHBhcmFtLmVsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKHBhcmFtLmVsZW1lbnRzW2ldICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIGNoZWNrUGF0dGVyblBhcmFtKG9wdGlvbnMsIHBhcmFtLmVsZW1lbnRzW2ldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIGFzc2VydChwYXJhbS50eXBlID09PSBTeW50YXguT2JqZWN0UGF0dGVybiwgJ0ludmFsaWQgdHlwZScpO1xuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IHBhcmFtLnByb3BlcnRpZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBjaGVja1BhdHRlcm5QYXJhbShvcHRpb25zLCBwYXJhbS5wcm9wZXJ0aWVzW2ldLnZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIHJlaW50ZXJwcmV0QXNDb3ZlckZvcm1hbHNMaXN0KGV4cHIpIHtcbiAgICAgICAgdmFyIGksIGxlbiwgcGFyYW0sIHBhcmFtcywgZGVmYXVsdHMsIGRlZmF1bHRDb3VudCwgb3B0aW9ucywgdG9rZW47XG5cbiAgICAgICAgZGVmYXVsdHMgPSBbXTtcbiAgICAgICAgZGVmYXVsdENvdW50ID0gMDtcbiAgICAgICAgcGFyYW1zID0gW2V4cHJdO1xuXG4gICAgICAgIHN3aXRjaCAoZXhwci50eXBlKSB7XG4gICAgICAgIGNhc2UgU3ludGF4LklkZW50aWZpZXI6XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBQbGFjZUhvbGRlcnMuQXJyb3dQYXJhbWV0ZXJQbGFjZUhvbGRlcjpcbiAgICAgICAgICAgIHBhcmFtcyA9IGV4cHIucGFyYW1zO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIG9wdGlvbnMgPSB7XG4gICAgICAgICAgICBwYXJhbVNldDoge31cbiAgICAgICAgfTtcblxuICAgICAgICBmb3IgKGkgPSAwLCBsZW4gPSBwYXJhbXMubGVuZ3RoOyBpIDwgbGVuOyBpICs9IDEpIHtcbiAgICAgICAgICAgIHBhcmFtID0gcGFyYW1zW2ldO1xuICAgICAgICAgICAgc3dpdGNoIChwYXJhbS50eXBlKSB7XG4gICAgICAgICAgICBjYXNlIFN5bnRheC5Bc3NpZ25tZW50UGF0dGVybjpcbiAgICAgICAgICAgICAgICBwYXJhbXNbaV0gPSBwYXJhbS5sZWZ0O1xuICAgICAgICAgICAgICAgIGRlZmF1bHRzLnB1c2gocGFyYW0ucmlnaHQpO1xuICAgICAgICAgICAgICAgICsrZGVmYXVsdENvdW50O1xuICAgICAgICAgICAgICAgIGNoZWNrUGF0dGVyblBhcmFtKG9wdGlvbnMsIHBhcmFtLmxlZnQpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBjaGVja1BhdHRlcm5QYXJhbShvcHRpb25zLCBwYXJhbSk7XG4gICAgICAgICAgICAgICAgcGFyYW1zW2ldID0gcGFyYW07XG4gICAgICAgICAgICAgICAgZGVmYXVsdHMucHVzaChudWxsKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChvcHRpb25zLm1lc3NhZ2UgPT09IE1lc3NhZ2VzLlN0cmljdFBhcmFtRHVwZSkge1xuICAgICAgICAgICAgdG9rZW4gPSBzdHJpY3QgPyBvcHRpb25zLnN0cmljdGVkIDogb3B0aW9ucy5maXJzdFJlc3RyaWN0ZWQ7XG4gICAgICAgICAgICB0aHJvd1VuZXhwZWN0ZWRUb2tlbih0b2tlbiwgb3B0aW9ucy5tZXNzYWdlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChkZWZhdWx0Q291bnQgPT09IDApIHtcbiAgICAgICAgICAgIGRlZmF1bHRzID0gW107XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcGFyYW1zOiBwYXJhbXMsXG4gICAgICAgICAgICBkZWZhdWx0czogZGVmYXVsdHMsXG4gICAgICAgICAgICBzdHJpY3RlZDogb3B0aW9ucy5zdHJpY3RlZCxcbiAgICAgICAgICAgIGZpcnN0UmVzdHJpY3RlZDogb3B0aW9ucy5maXJzdFJlc3RyaWN0ZWQsXG4gICAgICAgICAgICBtZXNzYWdlOiBvcHRpb25zLm1lc3NhZ2VcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwYXJzZUFycm93RnVuY3Rpb25FeHByZXNzaW9uKG9wdGlvbnMsIG5vZGUpIHtcbiAgICAgICAgdmFyIHByZXZpb3VzU3RyaWN0LCBib2R5O1xuXG4gICAgICAgIGlmIChoYXNMaW5lVGVybWluYXRvcikge1xuICAgICAgICAgICAgdG9sZXJhdGVVbmV4cGVjdGVkVG9rZW4obG9va2FoZWFkKTtcbiAgICAgICAgfVxuICAgICAgICBleHBlY3QoJz0+Jyk7XG4gICAgICAgIHByZXZpb3VzU3RyaWN0ID0gc3RyaWN0O1xuXG4gICAgICAgIGJvZHkgPSBwYXJzZUNvbmNpc2VCb2R5KCk7XG5cbiAgICAgICAgaWYgKHN0cmljdCAmJiBvcHRpb25zLmZpcnN0UmVzdHJpY3RlZCkge1xuICAgICAgICAgICAgdGhyb3dVbmV4cGVjdGVkVG9rZW4ob3B0aW9ucy5maXJzdFJlc3RyaWN0ZWQsIG9wdGlvbnMubWVzc2FnZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHN0cmljdCAmJiBvcHRpb25zLnN0cmljdGVkKSB7XG4gICAgICAgICAgICB0b2xlcmF0ZVVuZXhwZWN0ZWRUb2tlbihvcHRpb25zLnN0cmljdGVkLCBvcHRpb25zLm1lc3NhZ2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RyaWN0ID0gcHJldmlvdXNTdHJpY3Q7XG5cbiAgICAgICAgcmV0dXJuIG5vZGUuZmluaXNoQXJyb3dGdW5jdGlvbkV4cHJlc3Npb24ob3B0aW9ucy5wYXJhbXMsIG9wdGlvbnMuZGVmYXVsdHMsIGJvZHksIGJvZHkudHlwZSAhPT0gU3ludGF4LkJsb2NrU3RhdGVtZW50KTtcbiAgICB9XG5cbiAgICAvLyAxMS4xMyBBc3NpZ25tZW50IE9wZXJhdG9yc1xuXG4gICAgZnVuY3Rpb24gcGFyc2VBc3NpZ25tZW50RXhwcmVzc2lvbigpIHtcbiAgICAgICAgdmFyIHRva2VuLCBleHByLCByaWdodCwgbGlzdCwgc3RhcnRUb2tlbjtcblxuICAgICAgICBzdGFydFRva2VuID0gbG9va2FoZWFkO1xuICAgICAgICB0b2tlbiA9IGxvb2thaGVhZDtcblxuICAgICAgICBleHByID0gcGFyc2VDb25kaXRpb25hbEV4cHJlc3Npb24oKTtcblxuICAgICAgICBpZiAoZXhwci50eXBlID09PSBQbGFjZUhvbGRlcnMuQXJyb3dQYXJhbWV0ZXJQbGFjZUhvbGRlciB8fCBtYXRjaCgnPT4nKSkge1xuICAgICAgICAgICAgaXNBc3NpZ25tZW50VGFyZ2V0ID0gaXNCaW5kaW5nRWxlbWVudCA9IGZhbHNlO1xuICAgICAgICAgICAgbGlzdCA9IHJlaW50ZXJwcmV0QXNDb3ZlckZvcm1hbHNMaXN0KGV4cHIpO1xuXG4gICAgICAgICAgICBpZiAobGlzdCkge1xuICAgICAgICAgICAgICAgIGZpcnN0Q292ZXJJbml0aWFsaXplZE5hbWVFcnJvciA9IG51bGw7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhcnNlQXJyb3dGdW5jdGlvbkV4cHJlc3Npb24obGlzdCwgbmV3IFdyYXBwaW5nTm9kZShzdGFydFRva2VuKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBleHByO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG1hdGNoQXNzaWduKCkpIHtcbiAgICAgICAgICAgIGlmICghaXNBc3NpZ25tZW50VGFyZ2V0KSB7XG4gICAgICAgICAgICAgICAgdG9sZXJhdGVFcnJvcihNZXNzYWdlcy5JbnZhbGlkTEhTSW5Bc3NpZ25tZW50KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gMTEuMTMuMVxuICAgICAgICAgICAgaWYgKHN0cmljdCAmJiBleHByLnR5cGUgPT09IFN5bnRheC5JZGVudGlmaWVyICYmIGlzUmVzdHJpY3RlZFdvcmQoZXhwci5uYW1lKSkge1xuICAgICAgICAgICAgICAgIHRvbGVyYXRlVW5leHBlY3RlZFRva2VuKHRva2VuLCBNZXNzYWdlcy5TdHJpY3RMSFNBc3NpZ25tZW50KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCFtYXRjaCgnPScpKSB7XG4gICAgICAgICAgICAgICAgaXNBc3NpZ25tZW50VGFyZ2V0ID0gaXNCaW5kaW5nRWxlbWVudCA9IGZhbHNlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZWludGVycHJldEV4cHJlc3Npb25Bc1BhdHRlcm4oZXhwcik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRva2VuID0gbGV4KCk7XG4gICAgICAgICAgICByaWdodCA9IGlzb2xhdGVDb3ZlckdyYW1tYXIocGFyc2VBc3NpZ25tZW50RXhwcmVzc2lvbik7XG4gICAgICAgICAgICBleHByID0gbmV3IFdyYXBwaW5nTm9kZShzdGFydFRva2VuKS5maW5pc2hBc3NpZ25tZW50RXhwcmVzc2lvbih0b2tlbi52YWx1ZSwgZXhwciwgcmlnaHQpO1xuICAgICAgICAgICAgZmlyc3RDb3ZlckluaXRpYWxpemVkTmFtZUVycm9yID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBleHByO1xuICAgIH1cblxuICAgIC8vIDExLjE0IENvbW1hIE9wZXJhdG9yXG5cbiAgICBmdW5jdGlvbiBwYXJzZUV4cHJlc3Npb24oKSB7XG4gICAgICAgIHZhciBleHByLCBzdGFydFRva2VuID0gbG9va2FoZWFkLCBleHByZXNzaW9ucztcblxuICAgICAgICBleHByID0gaXNvbGF0ZUNvdmVyR3JhbW1hcihwYXJzZUFzc2lnbm1lbnRFeHByZXNzaW9uKTtcblxuICAgICAgICBpZiAobWF0Y2goJywnKSkge1xuICAgICAgICAgICAgZXhwcmVzc2lvbnMgPSBbZXhwcl07XG5cbiAgICAgICAgICAgIHdoaWxlIChzdGFydEluZGV4IDwgbGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFtYXRjaCgnLCcpKSB7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBsZXgoKTtcbiAgICAgICAgICAgICAgICBleHByZXNzaW9ucy5wdXNoKGlzb2xhdGVDb3ZlckdyYW1tYXIocGFyc2VBc3NpZ25tZW50RXhwcmVzc2lvbikpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBleHByID0gbmV3IFdyYXBwaW5nTm9kZShzdGFydFRva2VuKS5maW5pc2hTZXF1ZW5jZUV4cHJlc3Npb24oZXhwcmVzc2lvbnMpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGV4cHI7XG4gICAgfVxuXG4gICAgLy8gMTIuMSBCbG9ja1xuXG4gICAgZnVuY3Rpb24gcGFyc2VTdGF0ZW1lbnRMaXN0SXRlbSgpIHtcbiAgICAgICAgaWYgKGxvb2thaGVhZC50eXBlID09PSBUb2tlbi5LZXl3b3JkKSB7XG4gICAgICAgICAgICBzd2l0Y2ggKGxvb2thaGVhZC52YWx1ZSkge1xuICAgICAgICAgICAgY2FzZSAnZXhwb3J0JzpcbiAgICAgICAgICAgICAgICBpZiAoc291cmNlVHlwZSAhPT0gJ21vZHVsZScpIHtcbiAgICAgICAgICAgICAgICAgICAgdG9sZXJhdGVVbmV4cGVjdGVkVG9rZW4obG9va2FoZWFkLCBNZXNzYWdlcy5JbGxlZ2FsRXhwb3J0RGVjbGFyYXRpb24pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gcGFyc2VFeHBvcnREZWNsYXJhdGlvbigpO1xuICAgICAgICAgICAgY2FzZSAnaW1wb3J0JzpcbiAgICAgICAgICAgICAgICBpZiAoc291cmNlVHlwZSAhPT0gJ21vZHVsZScpIHtcbiAgICAgICAgICAgICAgICAgICAgdG9sZXJhdGVVbmV4cGVjdGVkVG9rZW4obG9va2FoZWFkLCBNZXNzYWdlcy5JbGxlZ2FsSW1wb3J0RGVjbGFyYXRpb24pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gcGFyc2VJbXBvcnREZWNsYXJhdGlvbigpO1xuICAgICAgICAgICAgY2FzZSAnY29uc3QnOlxuICAgICAgICAgICAgY2FzZSAnbGV0JzpcbiAgICAgICAgICAgICAgICByZXR1cm4gcGFyc2VMZXhpY2FsRGVjbGFyYXRpb24oe2luRm9yOiBmYWxzZX0pO1xuICAgICAgICAgICAgY2FzZSAnZnVuY3Rpb24nOlxuICAgICAgICAgICAgICAgIHJldHVybiBwYXJzZUZ1bmN0aW9uRGVjbGFyYXRpb24obmV3IE5vZGUoKSk7XG4gICAgICAgICAgICBjYXNlICdjbGFzcyc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhcnNlQ2xhc3NEZWNsYXJhdGlvbigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHBhcnNlU3RhdGVtZW50KCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcGFyc2VTdGF0ZW1lbnRMaXN0KCkge1xuICAgICAgICB2YXIgbGlzdCA9IFtdO1xuICAgICAgICB3aGlsZSAoc3RhcnRJbmRleCA8IGxlbmd0aCkge1xuICAgICAgICAgICAgaWYgKG1hdGNoKCd9JykpIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxpc3QucHVzaChwYXJzZVN0YXRlbWVudExpc3RJdGVtKCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGxpc3Q7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcGFyc2VCbG9jaygpIHtcbiAgICAgICAgdmFyIGJsb2NrLCBub2RlID0gbmV3IE5vZGUoKTtcblxuICAgICAgICBleHBlY3QoJ3snKTtcblxuICAgICAgICBibG9jayA9IHBhcnNlU3RhdGVtZW50TGlzdCgpO1xuXG4gICAgICAgIGV4cGVjdCgnfScpO1xuXG4gICAgICAgIHJldHVybiBub2RlLmZpbmlzaEJsb2NrU3RhdGVtZW50KGJsb2NrKTtcbiAgICB9XG5cbiAgICAvLyAxMi4yIFZhcmlhYmxlIFN0YXRlbWVudFxuXG4gICAgZnVuY3Rpb24gcGFyc2VWYXJpYWJsZUlkZW50aWZpZXIoKSB7XG4gICAgICAgIHZhciB0b2tlbiwgbm9kZSA9IG5ldyBOb2RlKCk7XG5cbiAgICAgICAgdG9rZW4gPSBsZXgoKTtcblxuICAgICAgICBpZiAodG9rZW4udHlwZSAhPT0gVG9rZW4uSWRlbnRpZmllcikge1xuICAgICAgICAgICAgaWYgKHN0cmljdCAmJiB0b2tlbi50eXBlID09PSBUb2tlbi5LZXl3b3JkICYmIGlzU3RyaWN0TW9kZVJlc2VydmVkV29yZCh0b2tlbi52YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICB0b2xlcmF0ZVVuZXhwZWN0ZWRUb2tlbih0b2tlbiwgTWVzc2FnZXMuU3RyaWN0UmVzZXJ2ZWRXb3JkKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhyb3dVbmV4cGVjdGVkVG9rZW4odG9rZW4pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5vZGUuZmluaXNoSWRlbnRpZmllcih0b2tlbi52YWx1ZSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcGFyc2VWYXJpYWJsZURlY2xhcmF0aW9uKCkge1xuICAgICAgICB2YXIgaW5pdCA9IG51bGwsIGlkLCBub2RlID0gbmV3IE5vZGUoKTtcblxuICAgICAgICBpZCA9IHBhcnNlUGF0dGVybigpO1xuXG4gICAgICAgIC8vIDEyLjIuMVxuICAgICAgICBpZiAoc3RyaWN0ICYmIGlzUmVzdHJpY3RlZFdvcmQoaWQubmFtZSkpIHtcbiAgICAgICAgICAgIHRvbGVyYXRlRXJyb3IoTWVzc2FnZXMuU3RyaWN0VmFyTmFtZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobWF0Y2goJz0nKSkge1xuICAgICAgICAgICAgbGV4KCk7XG4gICAgICAgICAgICBpbml0ID0gaXNvbGF0ZUNvdmVyR3JhbW1hcihwYXJzZUFzc2lnbm1lbnRFeHByZXNzaW9uKTtcbiAgICAgICAgfSBlbHNlIGlmIChpZC50eXBlICE9PSBTeW50YXguSWRlbnRpZmllcikge1xuICAgICAgICAgICAgZXhwZWN0KCc9Jyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbm9kZS5maW5pc2hWYXJpYWJsZURlY2xhcmF0b3IoaWQsIGluaXQpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBhcnNlVmFyaWFibGVEZWNsYXJhdGlvbkxpc3QoKSB7XG4gICAgICAgIHZhciBsaXN0ID0gW107XG5cbiAgICAgICAgZG8ge1xuICAgICAgICAgICAgbGlzdC5wdXNoKHBhcnNlVmFyaWFibGVEZWNsYXJhdGlvbigpKTtcbiAgICAgICAgICAgIGlmICghbWF0Y2goJywnKSkge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV4KCk7XG4gICAgICAgIH0gd2hpbGUgKHN0YXJ0SW5kZXggPCBsZW5ndGgpO1xuXG4gICAgICAgIHJldHVybiBsaXN0O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBhcnNlVmFyaWFibGVTdGF0ZW1lbnQobm9kZSkge1xuICAgICAgICB2YXIgZGVjbGFyYXRpb25zO1xuXG4gICAgICAgIGV4cGVjdEtleXdvcmQoJ3ZhcicpO1xuXG4gICAgICAgIGRlY2xhcmF0aW9ucyA9IHBhcnNlVmFyaWFibGVEZWNsYXJhdGlvbkxpc3QoKTtcblxuICAgICAgICBjb25zdW1lU2VtaWNvbG9uKCk7XG5cbiAgICAgICAgcmV0dXJuIG5vZGUuZmluaXNoVmFyaWFibGVEZWNsYXJhdGlvbihkZWNsYXJhdGlvbnMpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBhcnNlTGV4aWNhbEJpbmRpbmcoa2luZCwgb3B0aW9ucykge1xuICAgICAgICB2YXIgaW5pdCA9IG51bGwsIGlkLCBub2RlID0gbmV3IE5vZGUoKTtcblxuICAgICAgICBpZCA9IHBhcnNlUGF0dGVybigpO1xuXG4gICAgICAgIC8vIDEyLjIuMVxuICAgICAgICBpZiAoc3RyaWN0ICYmIGlkLnR5cGUgPT09IFN5bnRheC5JZGVudGlmaWVyICYmIGlzUmVzdHJpY3RlZFdvcmQoaWQubmFtZSkpIHtcbiAgICAgICAgICAgIHRvbGVyYXRlRXJyb3IoTWVzc2FnZXMuU3RyaWN0VmFyTmFtZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoa2luZCA9PT0gJ2NvbnN0Jykge1xuICAgICAgICAgICAgaWYgKCFtYXRjaEtleXdvcmQoJ2luJykpIHtcbiAgICAgICAgICAgICAgICBleHBlY3QoJz0nKTtcbiAgICAgICAgICAgICAgICBpbml0ID0gaXNvbGF0ZUNvdmVyR3JhbW1hcihwYXJzZUFzc2lnbm1lbnRFeHByZXNzaW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICgoIW9wdGlvbnMuaW5Gb3IgJiYgaWQudHlwZSAhPT0gU3ludGF4LklkZW50aWZpZXIpIHx8IG1hdGNoKCc9JykpIHtcbiAgICAgICAgICAgIGV4cGVjdCgnPScpO1xuICAgICAgICAgICAgaW5pdCA9IGlzb2xhdGVDb3ZlckdyYW1tYXIocGFyc2VBc3NpZ25tZW50RXhwcmVzc2lvbik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbm9kZS5maW5pc2hWYXJpYWJsZURlY2xhcmF0b3IoaWQsIGluaXQpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBhcnNlQmluZGluZ0xpc3Qoa2luZCwgb3B0aW9ucykge1xuICAgICAgICB2YXIgbGlzdCA9IFtdO1xuXG4gICAgICAgIGRvIHtcbiAgICAgICAgICAgIGxpc3QucHVzaChwYXJzZUxleGljYWxCaW5kaW5nKGtpbmQsIG9wdGlvbnMpKTtcbiAgICAgICAgICAgIGlmICghbWF0Y2goJywnKSkge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV4KCk7XG4gICAgICAgIH0gd2hpbGUgKHN0YXJ0SW5kZXggPCBsZW5ndGgpO1xuXG4gICAgICAgIHJldHVybiBsaXN0O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBhcnNlTGV4aWNhbERlY2xhcmF0aW9uKG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIGtpbmQsIGRlY2xhcmF0aW9ucywgbm9kZSA9IG5ldyBOb2RlKCk7XG5cbiAgICAgICAga2luZCA9IGxleCgpLnZhbHVlO1xuICAgICAgICBhc3NlcnQoa2luZCA9PT0gJ2xldCcgfHwga2luZCA9PT0gJ2NvbnN0JywgJ0xleGljYWwgZGVjbGFyYXRpb24gbXVzdCBiZSBlaXRoZXIgbGV0IG9yIGNvbnN0Jyk7XG5cbiAgICAgICAgZGVjbGFyYXRpb25zID0gcGFyc2VCaW5kaW5nTGlzdChraW5kLCBvcHRpb25zKTtcblxuICAgICAgICBjb25zdW1lU2VtaWNvbG9uKCk7XG5cbiAgICAgICAgcmV0dXJuIG5vZGUuZmluaXNoTGV4aWNhbERlY2xhcmF0aW9uKGRlY2xhcmF0aW9ucywga2luZCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcGFyc2VSZXN0RWxlbWVudCgpIHtcbiAgICAgICAgdmFyIHBhcmFtLCBub2RlID0gbmV3IE5vZGUoKTtcblxuICAgICAgICBsZXgoKTtcblxuICAgICAgICBpZiAobWF0Y2goJ3snKSkge1xuICAgICAgICAgICAgdGhyb3dFcnJvcihNZXNzYWdlcy5PYmplY3RQYXR0ZXJuQXNSZXN0UGFyYW1ldGVyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHBhcmFtID0gcGFyc2VWYXJpYWJsZUlkZW50aWZpZXIoKTtcblxuICAgICAgICBpZiAobWF0Y2goJz0nKSkge1xuICAgICAgICAgICAgdGhyb3dFcnJvcihNZXNzYWdlcy5EZWZhdWx0UmVzdFBhcmFtZXRlcik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIW1hdGNoKCcpJykpIHtcbiAgICAgICAgICAgIHRocm93RXJyb3IoTWVzc2FnZXMuUGFyYW1ldGVyQWZ0ZXJSZXN0UGFyYW1ldGVyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBub2RlLmZpbmlzaFJlc3RFbGVtZW50KHBhcmFtKTtcbiAgICB9XG5cbiAgICAvLyAxMi4zIEVtcHR5IFN0YXRlbWVudFxuXG4gICAgZnVuY3Rpb24gcGFyc2VFbXB0eVN0YXRlbWVudChub2RlKSB7XG4gICAgICAgIGV4cGVjdCgnOycpO1xuICAgICAgICByZXR1cm4gbm9kZS5maW5pc2hFbXB0eVN0YXRlbWVudCgpO1xuICAgIH1cblxuICAgIC8vIDEyLjQgRXhwcmVzc2lvbiBTdGF0ZW1lbnRcblxuICAgIGZ1bmN0aW9uIHBhcnNlRXhwcmVzc2lvblN0YXRlbWVudChub2RlKSB7XG4gICAgICAgIHZhciBleHByID0gcGFyc2VFeHByZXNzaW9uKCk7XG4gICAgICAgIGNvbnN1bWVTZW1pY29sb24oKTtcbiAgICAgICAgcmV0dXJuIG5vZGUuZmluaXNoRXhwcmVzc2lvblN0YXRlbWVudChleHByKTtcbiAgICB9XG5cbiAgICAvLyAxMi41IElmIHN0YXRlbWVudFxuXG4gICAgZnVuY3Rpb24gcGFyc2VJZlN0YXRlbWVudChub2RlKSB7XG4gICAgICAgIHZhciB0ZXN0LCBjb25zZXF1ZW50LCBhbHRlcm5hdGU7XG5cbiAgICAgICAgZXhwZWN0S2V5d29yZCgnaWYnKTtcblxuICAgICAgICBleHBlY3QoJygnKTtcblxuICAgICAgICB0ZXN0ID0gcGFyc2VFeHByZXNzaW9uKCk7XG5cbiAgICAgICAgZXhwZWN0KCcpJyk7XG5cbiAgICAgICAgY29uc2VxdWVudCA9IHBhcnNlU3RhdGVtZW50KCk7XG5cbiAgICAgICAgaWYgKG1hdGNoS2V5d29yZCgnZWxzZScpKSB7XG4gICAgICAgICAgICBsZXgoKTtcbiAgICAgICAgICAgIGFsdGVybmF0ZSA9IHBhcnNlU3RhdGVtZW50KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhbHRlcm5hdGUgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5vZGUuZmluaXNoSWZTdGF0ZW1lbnQodGVzdCwgY29uc2VxdWVudCwgYWx0ZXJuYXRlKTtcbiAgICB9XG5cbiAgICAvLyAxMi42IEl0ZXJhdGlvbiBTdGF0ZW1lbnRzXG5cbiAgICBmdW5jdGlvbiBwYXJzZURvV2hpbGVTdGF0ZW1lbnQobm9kZSkge1xuICAgICAgICB2YXIgYm9keSwgdGVzdCwgb2xkSW5JdGVyYXRpb247XG5cbiAgICAgICAgZXhwZWN0S2V5d29yZCgnZG8nKTtcblxuICAgICAgICBvbGRJbkl0ZXJhdGlvbiA9IHN0YXRlLmluSXRlcmF0aW9uO1xuICAgICAgICBzdGF0ZS5pbkl0ZXJhdGlvbiA9IHRydWU7XG5cbiAgICAgICAgYm9keSA9IHBhcnNlU3RhdGVtZW50KCk7XG5cbiAgICAgICAgc3RhdGUuaW5JdGVyYXRpb24gPSBvbGRJbkl0ZXJhdGlvbjtcblxuICAgICAgICBleHBlY3RLZXl3b3JkKCd3aGlsZScpO1xuXG4gICAgICAgIGV4cGVjdCgnKCcpO1xuXG4gICAgICAgIHRlc3QgPSBwYXJzZUV4cHJlc3Npb24oKTtcblxuICAgICAgICBleHBlY3QoJyknKTtcblxuICAgICAgICBpZiAobWF0Y2goJzsnKSkge1xuICAgICAgICAgICAgbGV4KCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbm9kZS5maW5pc2hEb1doaWxlU3RhdGVtZW50KGJvZHksIHRlc3QpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBhcnNlV2hpbGVTdGF0ZW1lbnQobm9kZSkge1xuICAgICAgICB2YXIgdGVzdCwgYm9keSwgb2xkSW5JdGVyYXRpb247XG5cbiAgICAgICAgZXhwZWN0S2V5d29yZCgnd2hpbGUnKTtcblxuICAgICAgICBleHBlY3QoJygnKTtcblxuICAgICAgICB0ZXN0ID0gcGFyc2VFeHByZXNzaW9uKCk7XG5cbiAgICAgICAgZXhwZWN0KCcpJyk7XG5cbiAgICAgICAgb2xkSW5JdGVyYXRpb24gPSBzdGF0ZS5pbkl0ZXJhdGlvbjtcbiAgICAgICAgc3RhdGUuaW5JdGVyYXRpb24gPSB0cnVlO1xuXG4gICAgICAgIGJvZHkgPSBwYXJzZVN0YXRlbWVudCgpO1xuXG4gICAgICAgIHN0YXRlLmluSXRlcmF0aW9uID0gb2xkSW5JdGVyYXRpb247XG5cbiAgICAgICAgcmV0dXJuIG5vZGUuZmluaXNoV2hpbGVTdGF0ZW1lbnQodGVzdCwgYm9keSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcGFyc2VGb3JTdGF0ZW1lbnQobm9kZSkge1xuICAgICAgICB2YXIgaW5pdCwgaW5pdFNlcSwgaW5pdFN0YXJ0VG9rZW4sIHRlc3QsIHVwZGF0ZSwgbGVmdCwgcmlnaHQsIGtpbmQsIGRlY2xhcmF0aW9ucyxcbiAgICAgICAgICAgIGJvZHksIG9sZEluSXRlcmF0aW9uLCBwcmV2aW91c0FsbG93SW4gPSBzdGF0ZS5hbGxvd0luO1xuXG4gICAgICAgIGluaXQgPSB0ZXN0ID0gdXBkYXRlID0gbnVsbDtcblxuICAgICAgICBleHBlY3RLZXl3b3JkKCdmb3InKTtcblxuICAgICAgICBleHBlY3QoJygnKTtcblxuICAgICAgICBpZiAobWF0Y2goJzsnKSkge1xuICAgICAgICAgICAgbGV4KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAobWF0Y2hLZXl3b3JkKCd2YXInKSkge1xuICAgICAgICAgICAgICAgIGluaXQgPSBuZXcgTm9kZSgpO1xuICAgICAgICAgICAgICAgIGxleCgpO1xuXG4gICAgICAgICAgICAgICAgc3RhdGUuYWxsb3dJbiA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGluaXQgPSBpbml0LmZpbmlzaFZhcmlhYmxlRGVjbGFyYXRpb24ocGFyc2VWYXJpYWJsZURlY2xhcmF0aW9uTGlzdCgpKTtcbiAgICAgICAgICAgICAgICBzdGF0ZS5hbGxvd0luID0gcHJldmlvdXNBbGxvd0luO1xuXG4gICAgICAgICAgICAgICAgaWYgKGluaXQuZGVjbGFyYXRpb25zLmxlbmd0aCA9PT0gMSAmJiBtYXRjaEtleXdvcmQoJ2luJykpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV4KCk7XG4gICAgICAgICAgICAgICAgICAgIGxlZnQgPSBpbml0O1xuICAgICAgICAgICAgICAgICAgICByaWdodCA9IHBhcnNlRXhwcmVzc2lvbigpO1xuICAgICAgICAgICAgICAgICAgICBpbml0ID0gbnVsbDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBleHBlY3QoJzsnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG1hdGNoS2V5d29yZCgnY29uc3QnKSB8fCBtYXRjaEtleXdvcmQoJ2xldCcpKSB7XG4gICAgICAgICAgICAgICAgaW5pdCA9IG5ldyBOb2RlKCk7XG4gICAgICAgICAgICAgICAga2luZCA9IGxleCgpLnZhbHVlO1xuXG4gICAgICAgICAgICAgICAgc3RhdGUuYWxsb3dJbiA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGRlY2xhcmF0aW9ucyA9IHBhcnNlQmluZGluZ0xpc3Qoa2luZCwge2luRm9yOiB0cnVlfSk7XG4gICAgICAgICAgICAgICAgc3RhdGUuYWxsb3dJbiA9IHByZXZpb3VzQWxsb3dJbjtcblxuICAgICAgICAgICAgICAgIGlmIChkZWNsYXJhdGlvbnMubGVuZ3RoID09PSAxICYmIGRlY2xhcmF0aW9uc1swXS5pbml0ID09PSBudWxsICYmIG1hdGNoS2V5d29yZCgnaW4nKSkge1xuICAgICAgICAgICAgICAgICAgICBpbml0ID0gaW5pdC5maW5pc2hMZXhpY2FsRGVjbGFyYXRpb24oZGVjbGFyYXRpb25zLCBraW5kKTtcbiAgICAgICAgICAgICAgICAgICAgbGV4KCk7XG4gICAgICAgICAgICAgICAgICAgIGxlZnQgPSBpbml0O1xuICAgICAgICAgICAgICAgICAgICByaWdodCA9IHBhcnNlRXhwcmVzc2lvbigpO1xuICAgICAgICAgICAgICAgICAgICBpbml0ID0gbnVsbDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb25zdW1lU2VtaWNvbG9uKCk7XG4gICAgICAgICAgICAgICAgICAgIGluaXQgPSBpbml0LmZpbmlzaExleGljYWxEZWNsYXJhdGlvbihkZWNsYXJhdGlvbnMsIGtpbmQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaW5pdFN0YXJ0VG9rZW4gPSBsb29rYWhlYWQ7XG4gICAgICAgICAgICAgICAgc3RhdGUuYWxsb3dJbiA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGluaXQgPSBpbmhlcml0Q292ZXJHcmFtbWFyKHBhcnNlQXNzaWdubWVudEV4cHJlc3Npb24pO1xuICAgICAgICAgICAgICAgIHN0YXRlLmFsbG93SW4gPSBwcmV2aW91c0FsbG93SW47XG5cbiAgICAgICAgICAgICAgICBpZiAobWF0Y2hLZXl3b3JkKCdpbicpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghaXNBc3NpZ25tZW50VGFyZ2V0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0b2xlcmF0ZUVycm9yKE1lc3NhZ2VzLkludmFsaWRMSFNJbkZvckluKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGxleCgpO1xuICAgICAgICAgICAgICAgICAgICByZWludGVycHJldEV4cHJlc3Npb25Bc1BhdHRlcm4oaW5pdCk7XG4gICAgICAgICAgICAgICAgICAgIGxlZnQgPSBpbml0O1xuICAgICAgICAgICAgICAgICAgICByaWdodCA9IHBhcnNlRXhwcmVzc2lvbigpO1xuICAgICAgICAgICAgICAgICAgICBpbml0ID0gbnVsbDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAobWF0Y2goJywnKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5pdFNlcSA9IFtpbml0XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdoaWxlIChtYXRjaCgnLCcpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV4KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5pdFNlcS5wdXNoKGlzb2xhdGVDb3ZlckdyYW1tYXIocGFyc2VBc3NpZ25tZW50RXhwcmVzc2lvbikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaW5pdCA9IG5ldyBXcmFwcGluZ05vZGUoaW5pdFN0YXJ0VG9rZW4pLmZpbmlzaFNlcXVlbmNlRXhwcmVzc2lvbihpbml0U2VxKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBleHBlY3QoJzsnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mIGxlZnQgPT09ICd1bmRlZmluZWQnKSB7XG5cbiAgICAgICAgICAgIGlmICghbWF0Y2goJzsnKSkge1xuICAgICAgICAgICAgICAgIHRlc3QgPSBwYXJzZUV4cHJlc3Npb24oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGV4cGVjdCgnOycpO1xuXG4gICAgICAgICAgICBpZiAoIW1hdGNoKCcpJykpIHtcbiAgICAgICAgICAgICAgICB1cGRhdGUgPSBwYXJzZUV4cHJlc3Npb24oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGV4cGVjdCgnKScpO1xuXG4gICAgICAgIG9sZEluSXRlcmF0aW9uID0gc3RhdGUuaW5JdGVyYXRpb247XG4gICAgICAgIHN0YXRlLmluSXRlcmF0aW9uID0gdHJ1ZTtcblxuICAgICAgICBib2R5ID0gaXNvbGF0ZUNvdmVyR3JhbW1hcihwYXJzZVN0YXRlbWVudCk7XG5cbiAgICAgICAgc3RhdGUuaW5JdGVyYXRpb24gPSBvbGRJbkl0ZXJhdGlvbjtcblxuICAgICAgICByZXR1cm4gKHR5cGVvZiBsZWZ0ID09PSAndW5kZWZpbmVkJykgP1xuICAgICAgICAgICAgICAgIG5vZGUuZmluaXNoRm9yU3RhdGVtZW50KGluaXQsIHRlc3QsIHVwZGF0ZSwgYm9keSkgOlxuICAgICAgICAgICAgICAgIG5vZGUuZmluaXNoRm9ySW5TdGF0ZW1lbnQobGVmdCwgcmlnaHQsIGJvZHkpO1xuICAgIH1cblxuICAgIC8vIDEyLjcgVGhlIGNvbnRpbnVlIHN0YXRlbWVudFxuXG4gICAgZnVuY3Rpb24gcGFyc2VDb250aW51ZVN0YXRlbWVudChub2RlKSB7XG4gICAgICAgIHZhciBsYWJlbCA9IG51bGwsIGtleTtcblxuICAgICAgICBleHBlY3RLZXl3b3JkKCdjb250aW51ZScpO1xuXG4gICAgICAgIC8vIE9wdGltaXplIHRoZSBtb3N0IGNvbW1vbiBmb3JtOiAnY29udGludWU7Jy5cbiAgICAgICAgaWYgKHNvdXJjZS5jaGFyQ29kZUF0KHN0YXJ0SW5kZXgpID09PSAweDNCKSB7XG4gICAgICAgICAgICBsZXgoKTtcblxuICAgICAgICAgICAgaWYgKCFzdGF0ZS5pbkl0ZXJhdGlvbikge1xuICAgICAgICAgICAgICAgIHRocm93RXJyb3IoTWVzc2FnZXMuSWxsZWdhbENvbnRpbnVlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIG5vZGUuZmluaXNoQ29udGludWVTdGF0ZW1lbnQobnVsbCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaGFzTGluZVRlcm1pbmF0b3IpIHtcbiAgICAgICAgICAgIGlmICghc3RhdGUuaW5JdGVyYXRpb24pIHtcbiAgICAgICAgICAgICAgICB0aHJvd0Vycm9yKE1lc3NhZ2VzLklsbGVnYWxDb250aW51ZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBub2RlLmZpbmlzaENvbnRpbnVlU3RhdGVtZW50KG51bGwpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGxvb2thaGVhZC50eXBlID09PSBUb2tlbi5JZGVudGlmaWVyKSB7XG4gICAgICAgICAgICBsYWJlbCA9IHBhcnNlVmFyaWFibGVJZGVudGlmaWVyKCk7XG5cbiAgICAgICAgICAgIGtleSA9ICckJyArIGxhYmVsLm5hbWU7XG4gICAgICAgICAgICBpZiAoIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzdGF0ZS5sYWJlbFNldCwga2V5KSkge1xuICAgICAgICAgICAgICAgIHRocm93RXJyb3IoTWVzc2FnZXMuVW5rbm93bkxhYmVsLCBsYWJlbC5uYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN1bWVTZW1pY29sb24oKTtcblxuICAgICAgICBpZiAobGFiZWwgPT09IG51bGwgJiYgIXN0YXRlLmluSXRlcmF0aW9uKSB7XG4gICAgICAgICAgICB0aHJvd0Vycm9yKE1lc3NhZ2VzLklsbGVnYWxDb250aW51ZSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbm9kZS5maW5pc2hDb250aW51ZVN0YXRlbWVudChsYWJlbCk7XG4gICAgfVxuXG4gICAgLy8gMTIuOCBUaGUgYnJlYWsgc3RhdGVtZW50XG5cbiAgICBmdW5jdGlvbiBwYXJzZUJyZWFrU3RhdGVtZW50KG5vZGUpIHtcbiAgICAgICAgdmFyIGxhYmVsID0gbnVsbCwga2V5O1xuXG4gICAgICAgIGV4cGVjdEtleXdvcmQoJ2JyZWFrJyk7XG5cbiAgICAgICAgLy8gQ2F0Y2ggdGhlIHZlcnkgY29tbW9uIGNhc2UgZmlyc3Q6IGltbWVkaWF0ZWx5IGEgc2VtaWNvbG9uIChVKzAwM0IpLlxuICAgICAgICBpZiAoc291cmNlLmNoYXJDb2RlQXQobGFzdEluZGV4KSA9PT0gMHgzQikge1xuICAgICAgICAgICAgbGV4KCk7XG5cbiAgICAgICAgICAgIGlmICghKHN0YXRlLmluSXRlcmF0aW9uIHx8IHN0YXRlLmluU3dpdGNoKSkge1xuICAgICAgICAgICAgICAgIHRocm93RXJyb3IoTWVzc2FnZXMuSWxsZWdhbEJyZWFrKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIG5vZGUuZmluaXNoQnJlYWtTdGF0ZW1lbnQobnVsbCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaGFzTGluZVRlcm1pbmF0b3IpIHtcbiAgICAgICAgICAgIGlmICghKHN0YXRlLmluSXRlcmF0aW9uIHx8IHN0YXRlLmluU3dpdGNoKSkge1xuICAgICAgICAgICAgICAgIHRocm93RXJyb3IoTWVzc2FnZXMuSWxsZWdhbEJyZWFrKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIG5vZGUuZmluaXNoQnJlYWtTdGF0ZW1lbnQobnVsbCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobG9va2FoZWFkLnR5cGUgPT09IFRva2VuLklkZW50aWZpZXIpIHtcbiAgICAgICAgICAgIGxhYmVsID0gcGFyc2VWYXJpYWJsZUlkZW50aWZpZXIoKTtcblxuICAgICAgICAgICAga2V5ID0gJyQnICsgbGFiZWwubmFtZTtcbiAgICAgICAgICAgIGlmICghT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHN0YXRlLmxhYmVsU2V0LCBrZXkpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3dFcnJvcihNZXNzYWdlcy5Vbmtub3duTGFiZWwsIGxhYmVsLm5hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3VtZVNlbWljb2xvbigpO1xuXG4gICAgICAgIGlmIChsYWJlbCA9PT0gbnVsbCAmJiAhKHN0YXRlLmluSXRlcmF0aW9uIHx8IHN0YXRlLmluU3dpdGNoKSkge1xuICAgICAgICAgICAgdGhyb3dFcnJvcihNZXNzYWdlcy5JbGxlZ2FsQnJlYWspO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5vZGUuZmluaXNoQnJlYWtTdGF0ZW1lbnQobGFiZWwpO1xuICAgIH1cblxuICAgIC8vIDEyLjkgVGhlIHJldHVybiBzdGF0ZW1lbnRcblxuICAgIGZ1bmN0aW9uIHBhcnNlUmV0dXJuU3RhdGVtZW50KG5vZGUpIHtcbiAgICAgICAgdmFyIGFyZ3VtZW50ID0gbnVsbDtcblxuICAgICAgICBleHBlY3RLZXl3b3JkKCdyZXR1cm4nKTtcblxuICAgICAgICBpZiAoIXN0YXRlLmluRnVuY3Rpb25Cb2R5KSB7XG4gICAgICAgICAgICB0b2xlcmF0ZUVycm9yKE1lc3NhZ2VzLklsbGVnYWxSZXR1cm4pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gJ3JldHVybicgZm9sbG93ZWQgYnkgYSBzcGFjZSBhbmQgYW4gaWRlbnRpZmllciBpcyB2ZXJ5IGNvbW1vbi5cbiAgICAgICAgaWYgKHNvdXJjZS5jaGFyQ29kZUF0KGxhc3RJbmRleCkgPT09IDB4MjApIHtcbiAgICAgICAgICAgIGlmIChpc0lkZW50aWZpZXJTdGFydChzb3VyY2UuY2hhckNvZGVBdChsYXN0SW5kZXggKyAxKSkpIHtcbiAgICAgICAgICAgICAgICBhcmd1bWVudCA9IHBhcnNlRXhwcmVzc2lvbigpO1xuICAgICAgICAgICAgICAgIGNvbnN1bWVTZW1pY29sb24oKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gbm9kZS5maW5pc2hSZXR1cm5TdGF0ZW1lbnQoYXJndW1lbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGhhc0xpbmVUZXJtaW5hdG9yKSB7XG4gICAgICAgICAgICAvLyBIQUNLXG4gICAgICAgICAgICByZXR1cm4gbm9kZS5maW5pc2hSZXR1cm5TdGF0ZW1lbnQobnVsbCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIW1hdGNoKCc7JykpIHtcbiAgICAgICAgICAgIGlmICghbWF0Y2goJ30nKSAmJiBsb29rYWhlYWQudHlwZSAhPT0gVG9rZW4uRU9GKSB7XG4gICAgICAgICAgICAgICAgYXJndW1lbnQgPSBwYXJzZUV4cHJlc3Npb24oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN1bWVTZW1pY29sb24oKTtcblxuICAgICAgICByZXR1cm4gbm9kZS5maW5pc2hSZXR1cm5TdGF0ZW1lbnQoYXJndW1lbnQpO1xuICAgIH1cblxuICAgIC8vIDEyLjEwIFRoZSB3aXRoIHN0YXRlbWVudFxuXG4gICAgZnVuY3Rpb24gcGFyc2VXaXRoU3RhdGVtZW50KG5vZGUpIHtcbiAgICAgICAgdmFyIG9iamVjdCwgYm9keTtcblxuICAgICAgICBpZiAoc3RyaWN0KSB7XG4gICAgICAgICAgICB0b2xlcmF0ZUVycm9yKE1lc3NhZ2VzLlN0cmljdE1vZGVXaXRoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cGVjdEtleXdvcmQoJ3dpdGgnKTtcblxuICAgICAgICBleHBlY3QoJygnKTtcblxuICAgICAgICBvYmplY3QgPSBwYXJzZUV4cHJlc3Npb24oKTtcblxuICAgICAgICBleHBlY3QoJyknKTtcblxuICAgICAgICBib2R5ID0gcGFyc2VTdGF0ZW1lbnQoKTtcblxuICAgICAgICByZXR1cm4gbm9kZS5maW5pc2hXaXRoU3RhdGVtZW50KG9iamVjdCwgYm9keSk7XG4gICAgfVxuXG4gICAgLy8gMTIuMTAgVGhlIHN3aXRoIHN0YXRlbWVudFxuXG4gICAgZnVuY3Rpb24gcGFyc2VTd2l0Y2hDYXNlKCkge1xuICAgICAgICB2YXIgdGVzdCwgY29uc2VxdWVudCA9IFtdLCBzdGF0ZW1lbnQsIG5vZGUgPSBuZXcgTm9kZSgpO1xuXG4gICAgICAgIGlmIChtYXRjaEtleXdvcmQoJ2RlZmF1bHQnKSkge1xuICAgICAgICAgICAgbGV4KCk7XG4gICAgICAgICAgICB0ZXN0ID0gbnVsbDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGV4cGVjdEtleXdvcmQoJ2Nhc2UnKTtcbiAgICAgICAgICAgIHRlc3QgPSBwYXJzZUV4cHJlc3Npb24oKTtcbiAgICAgICAgfVxuICAgICAgICBleHBlY3QoJzonKTtcblxuICAgICAgICB3aGlsZSAoc3RhcnRJbmRleCA8IGxlbmd0aCkge1xuICAgICAgICAgICAgaWYgKG1hdGNoKCd9JykgfHwgbWF0Y2hLZXl3b3JkKCdkZWZhdWx0JykgfHwgbWF0Y2hLZXl3b3JkKCdjYXNlJykpIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN0YXRlbWVudCA9IHBhcnNlU3RhdGVtZW50TGlzdEl0ZW0oKTtcbiAgICAgICAgICAgIGNvbnNlcXVlbnQucHVzaChzdGF0ZW1lbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5vZGUuZmluaXNoU3dpdGNoQ2FzZSh0ZXN0LCBjb25zZXF1ZW50KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwYXJzZVN3aXRjaFN0YXRlbWVudChub2RlKSB7XG4gICAgICAgIHZhciBkaXNjcmltaW5hbnQsIGNhc2VzLCBjbGF1c2UsIG9sZEluU3dpdGNoLCBkZWZhdWx0Rm91bmQ7XG5cbiAgICAgICAgZXhwZWN0S2V5d29yZCgnc3dpdGNoJyk7XG5cbiAgICAgICAgZXhwZWN0KCcoJyk7XG5cbiAgICAgICAgZGlzY3JpbWluYW50ID0gcGFyc2VFeHByZXNzaW9uKCk7XG5cbiAgICAgICAgZXhwZWN0KCcpJyk7XG5cbiAgICAgICAgZXhwZWN0KCd7Jyk7XG5cbiAgICAgICAgY2FzZXMgPSBbXTtcblxuICAgICAgICBpZiAobWF0Y2goJ30nKSkge1xuICAgICAgICAgICAgbGV4KCk7XG4gICAgICAgICAgICByZXR1cm4gbm9kZS5maW5pc2hTd2l0Y2hTdGF0ZW1lbnQoZGlzY3JpbWluYW50LCBjYXNlcyk7XG4gICAgICAgIH1cblxuICAgICAgICBvbGRJblN3aXRjaCA9IHN0YXRlLmluU3dpdGNoO1xuICAgICAgICBzdGF0ZS5pblN3aXRjaCA9IHRydWU7XG4gICAgICAgIGRlZmF1bHRGb3VuZCA9IGZhbHNlO1xuXG4gICAgICAgIHdoaWxlIChzdGFydEluZGV4IDwgbGVuZ3RoKSB7XG4gICAgICAgICAgICBpZiAobWF0Y2goJ30nKSkge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2xhdXNlID0gcGFyc2VTd2l0Y2hDYXNlKCk7XG4gICAgICAgICAgICBpZiAoY2xhdXNlLnRlc3QgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBpZiAoZGVmYXVsdEZvdW5kKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93RXJyb3IoTWVzc2FnZXMuTXVsdGlwbGVEZWZhdWx0c0luU3dpdGNoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZGVmYXVsdEZvdW5kID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhc2VzLnB1c2goY2xhdXNlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHN0YXRlLmluU3dpdGNoID0gb2xkSW5Td2l0Y2g7XG5cbiAgICAgICAgZXhwZWN0KCd9Jyk7XG5cbiAgICAgICAgcmV0dXJuIG5vZGUuZmluaXNoU3dpdGNoU3RhdGVtZW50KGRpc2NyaW1pbmFudCwgY2FzZXMpO1xuICAgIH1cblxuICAgIC8vIDEyLjEzIFRoZSB0aHJvdyBzdGF0ZW1lbnRcblxuICAgIGZ1bmN0aW9uIHBhcnNlVGhyb3dTdGF0ZW1lbnQobm9kZSkge1xuICAgICAgICB2YXIgYXJndW1lbnQ7XG5cbiAgICAgICAgZXhwZWN0S2V5d29yZCgndGhyb3cnKTtcblxuICAgICAgICBpZiAoaGFzTGluZVRlcm1pbmF0b3IpIHtcbiAgICAgICAgICAgIHRocm93RXJyb3IoTWVzc2FnZXMuTmV3bGluZUFmdGVyVGhyb3cpO1xuICAgICAgICB9XG5cbiAgICAgICAgYXJndW1lbnQgPSBwYXJzZUV4cHJlc3Npb24oKTtcblxuICAgICAgICBjb25zdW1lU2VtaWNvbG9uKCk7XG5cbiAgICAgICAgcmV0dXJuIG5vZGUuZmluaXNoVGhyb3dTdGF0ZW1lbnQoYXJndW1lbnQpO1xuICAgIH1cblxuICAgIC8vIDEyLjE0IFRoZSB0cnkgc3RhdGVtZW50XG5cbiAgICBmdW5jdGlvbiBwYXJzZUNhdGNoQ2xhdXNlKCkge1xuICAgICAgICB2YXIgcGFyYW0sIGJvZHksIG5vZGUgPSBuZXcgTm9kZSgpO1xuXG4gICAgICAgIGV4cGVjdEtleXdvcmQoJ2NhdGNoJyk7XG5cbiAgICAgICAgZXhwZWN0KCcoJyk7XG4gICAgICAgIGlmIChtYXRjaCgnKScpKSB7XG4gICAgICAgICAgICB0aHJvd1VuZXhwZWN0ZWRUb2tlbihsb29rYWhlYWQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcGFyYW0gPSBwYXJzZVBhdHRlcm4oKTtcblxuICAgICAgICAvLyAxMi4xNC4xXG4gICAgICAgIGlmIChzdHJpY3QgJiYgaXNSZXN0cmljdGVkV29yZChwYXJhbS5uYW1lKSkge1xuICAgICAgICAgICAgdG9sZXJhdGVFcnJvcihNZXNzYWdlcy5TdHJpY3RDYXRjaFZhcmlhYmxlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGV4cGVjdCgnKScpO1xuICAgICAgICBib2R5ID0gcGFyc2VCbG9jaygpO1xuICAgICAgICByZXR1cm4gbm9kZS5maW5pc2hDYXRjaENsYXVzZShwYXJhbSwgYm9keSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcGFyc2VUcnlTdGF0ZW1lbnQobm9kZSkge1xuICAgICAgICB2YXIgYmxvY2ssIGhhbmRsZXIgPSBudWxsLCBmaW5hbGl6ZXIgPSBudWxsO1xuXG4gICAgICAgIGV4cGVjdEtleXdvcmQoJ3RyeScpO1xuXG4gICAgICAgIGJsb2NrID0gcGFyc2VCbG9jaygpO1xuXG4gICAgICAgIGlmIChtYXRjaEtleXdvcmQoJ2NhdGNoJykpIHtcbiAgICAgICAgICAgIGhhbmRsZXIgPSBwYXJzZUNhdGNoQ2xhdXNlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobWF0Y2hLZXl3b3JkKCdmaW5hbGx5JykpIHtcbiAgICAgICAgICAgIGxleCgpO1xuICAgICAgICAgICAgZmluYWxpemVyID0gcGFyc2VCbG9jaygpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFoYW5kbGVyICYmICFmaW5hbGl6ZXIpIHtcbiAgICAgICAgICAgIHRocm93RXJyb3IoTWVzc2FnZXMuTm9DYXRjaE9yRmluYWxseSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbm9kZS5maW5pc2hUcnlTdGF0ZW1lbnQoYmxvY2ssIGhhbmRsZXIsIGZpbmFsaXplcik7XG4gICAgfVxuXG4gICAgLy8gMTIuMTUgVGhlIGRlYnVnZ2VyIHN0YXRlbWVudFxuXG4gICAgZnVuY3Rpb24gcGFyc2VEZWJ1Z2dlclN0YXRlbWVudChub2RlKSB7XG4gICAgICAgIGV4cGVjdEtleXdvcmQoJ2RlYnVnZ2VyJyk7XG5cbiAgICAgICAgY29uc3VtZVNlbWljb2xvbigpO1xuXG4gICAgICAgIHJldHVybiBub2RlLmZpbmlzaERlYnVnZ2VyU3RhdGVtZW50KCk7XG4gICAgfVxuXG4gICAgLy8gMTIgU3RhdGVtZW50c1xuXG4gICAgZnVuY3Rpb24gcGFyc2VTdGF0ZW1lbnQoKSB7XG4gICAgICAgIHZhciB0eXBlID0gbG9va2FoZWFkLnR5cGUsXG4gICAgICAgICAgICBleHByLFxuICAgICAgICAgICAgbGFiZWxlZEJvZHksXG4gICAgICAgICAgICBrZXksXG4gICAgICAgICAgICBub2RlO1xuXG4gICAgICAgIGlmICh0eXBlID09PSBUb2tlbi5FT0YpIHtcbiAgICAgICAgICAgIHRocm93VW5leHBlY3RlZFRva2VuKGxvb2thaGVhZCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZSA9PT0gVG9rZW4uUHVuY3R1YXRvciAmJiBsb29rYWhlYWQudmFsdWUgPT09ICd7Jykge1xuICAgICAgICAgICAgcmV0dXJuIHBhcnNlQmxvY2soKTtcbiAgICAgICAgfVxuICAgICAgICBpc0Fzc2lnbm1lbnRUYXJnZXQgPSBpc0JpbmRpbmdFbGVtZW50ID0gdHJ1ZTtcbiAgICAgICAgbm9kZSA9IG5ldyBOb2RlKCk7XG5cbiAgICAgICAgaWYgKHR5cGUgPT09IFRva2VuLlB1bmN0dWF0b3IpIHtcbiAgICAgICAgICAgIHN3aXRjaCAobG9va2FoZWFkLnZhbHVlKSB7XG4gICAgICAgICAgICBjYXNlICc7JzpcbiAgICAgICAgICAgICAgICByZXR1cm4gcGFyc2VFbXB0eVN0YXRlbWVudChub2RlKTtcbiAgICAgICAgICAgIGNhc2UgJygnOlxuICAgICAgICAgICAgICAgIHJldHVybiBwYXJzZUV4cHJlc3Npb25TdGF0ZW1lbnQobm9kZSk7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHR5cGUgPT09IFRva2VuLktleXdvcmQpIHtcbiAgICAgICAgICAgIHN3aXRjaCAobG9va2FoZWFkLnZhbHVlKSB7XG4gICAgICAgICAgICBjYXNlICdicmVhayc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhcnNlQnJlYWtTdGF0ZW1lbnQobm9kZSk7XG4gICAgICAgICAgICBjYXNlICdjb250aW51ZSc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhcnNlQ29udGludWVTdGF0ZW1lbnQobm9kZSk7XG4gICAgICAgICAgICBjYXNlICdkZWJ1Z2dlcic6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhcnNlRGVidWdnZXJTdGF0ZW1lbnQobm9kZSk7XG4gICAgICAgICAgICBjYXNlICdkbyc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhcnNlRG9XaGlsZVN0YXRlbWVudChub2RlKTtcbiAgICAgICAgICAgIGNhc2UgJ2Zvcic6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhcnNlRm9yU3RhdGVtZW50KG5vZGUpO1xuICAgICAgICAgICAgY2FzZSAnZnVuY3Rpb24nOlxuICAgICAgICAgICAgICAgIHJldHVybiBwYXJzZUZ1bmN0aW9uRGVjbGFyYXRpb24obm9kZSk7XG4gICAgICAgICAgICBjYXNlICdpZic6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhcnNlSWZTdGF0ZW1lbnQobm9kZSk7XG4gICAgICAgICAgICBjYXNlICdyZXR1cm4nOlxuICAgICAgICAgICAgICAgIHJldHVybiBwYXJzZVJldHVyblN0YXRlbWVudChub2RlKTtcbiAgICAgICAgICAgIGNhc2UgJ3N3aXRjaCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhcnNlU3dpdGNoU3RhdGVtZW50KG5vZGUpO1xuICAgICAgICAgICAgY2FzZSAndGhyb3cnOlxuICAgICAgICAgICAgICAgIHJldHVybiBwYXJzZVRocm93U3RhdGVtZW50KG5vZGUpO1xuICAgICAgICAgICAgY2FzZSAndHJ5JzpcbiAgICAgICAgICAgICAgICByZXR1cm4gcGFyc2VUcnlTdGF0ZW1lbnQobm9kZSk7XG4gICAgICAgICAgICBjYXNlICd2YXInOlxuICAgICAgICAgICAgICAgIHJldHVybiBwYXJzZVZhcmlhYmxlU3RhdGVtZW50KG5vZGUpO1xuICAgICAgICAgICAgY2FzZSAnd2hpbGUnOlxuICAgICAgICAgICAgICAgIHJldHVybiBwYXJzZVdoaWxlU3RhdGVtZW50KG5vZGUpO1xuICAgICAgICAgICAgY2FzZSAnd2l0aCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhcnNlV2l0aFN0YXRlbWVudChub2RlKTtcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBleHByID0gcGFyc2VFeHByZXNzaW9uKCk7XG5cbiAgICAgICAgLy8gMTIuMTIgTGFiZWxsZWQgU3RhdGVtZW50c1xuICAgICAgICBpZiAoKGV4cHIudHlwZSA9PT0gU3ludGF4LklkZW50aWZpZXIpICYmIG1hdGNoKCc6JykpIHtcbiAgICAgICAgICAgIGxleCgpO1xuXG4gICAgICAgICAgICBrZXkgPSAnJCcgKyBleHByLm5hbWU7XG4gICAgICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHN0YXRlLmxhYmVsU2V0LCBrZXkpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3dFcnJvcihNZXNzYWdlcy5SZWRlY2xhcmF0aW9uLCAnTGFiZWwnLCBleHByLm5hbWUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzdGF0ZS5sYWJlbFNldFtrZXldID0gdHJ1ZTtcbiAgICAgICAgICAgIGxhYmVsZWRCb2R5ID0gcGFyc2VTdGF0ZW1lbnQoKTtcbiAgICAgICAgICAgIGRlbGV0ZSBzdGF0ZS5sYWJlbFNldFtrZXldO1xuICAgICAgICAgICAgcmV0dXJuIG5vZGUuZmluaXNoTGFiZWxlZFN0YXRlbWVudChleHByLCBsYWJlbGVkQm9keSk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdW1lU2VtaWNvbG9uKCk7XG5cbiAgICAgICAgcmV0dXJuIG5vZGUuZmluaXNoRXhwcmVzc2lvblN0YXRlbWVudChleHByKTtcbiAgICB9XG5cbiAgICAvLyAxMyBGdW5jdGlvbiBEZWZpbml0aW9uXG5cbiAgICBmdW5jdGlvbiBwYXJzZUZ1bmN0aW9uU291cmNlRWxlbWVudHMoKSB7XG4gICAgICAgIHZhciBzdGF0ZW1lbnQsIGJvZHkgPSBbXSwgdG9rZW4sIGRpcmVjdGl2ZSwgZmlyc3RSZXN0cmljdGVkLFxuICAgICAgICAgICAgb2xkTGFiZWxTZXQsIG9sZEluSXRlcmF0aW9uLCBvbGRJblN3aXRjaCwgb2xkSW5GdW5jdGlvbkJvZHksIG9sZFBhcmVudGhlc2lzQ291bnQsXG4gICAgICAgICAgICBub2RlID0gbmV3IE5vZGUoKTtcblxuICAgICAgICBleHBlY3QoJ3snKTtcblxuICAgICAgICB3aGlsZSAoc3RhcnRJbmRleCA8IGxlbmd0aCkge1xuICAgICAgICAgICAgaWYgKGxvb2thaGVhZC50eXBlICE9PSBUb2tlbi5TdHJpbmdMaXRlcmFsKSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0b2tlbiA9IGxvb2thaGVhZDtcblxuICAgICAgICAgICAgc3RhdGVtZW50ID0gcGFyc2VTdGF0ZW1lbnRMaXN0SXRlbSgpO1xuICAgICAgICAgICAgYm9keS5wdXNoKHN0YXRlbWVudCk7XG4gICAgICAgICAgICBpZiAoc3RhdGVtZW50LmV4cHJlc3Npb24udHlwZSAhPT0gU3ludGF4LkxpdGVyYWwpIHtcbiAgICAgICAgICAgICAgICAvLyB0aGlzIGlzIG5vdCBkaXJlY3RpdmVcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRpcmVjdGl2ZSA9IHNvdXJjZS5zbGljZSh0b2tlbi5zdGFydCArIDEsIHRva2VuLmVuZCAtIDEpO1xuICAgICAgICAgICAgaWYgKGRpcmVjdGl2ZSA9PT0gJ3VzZSBzdHJpY3QnKSB7XG4gICAgICAgICAgICAgICAgc3RyaWN0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBpZiAoZmlyc3RSZXN0cmljdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHRvbGVyYXRlVW5leHBlY3RlZFRva2VuKGZpcnN0UmVzdHJpY3RlZCwgTWVzc2FnZXMuU3RyaWN0T2N0YWxMaXRlcmFsKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICghZmlyc3RSZXN0cmljdGVkICYmIHRva2VuLm9jdGFsKSB7XG4gICAgICAgICAgICAgICAgICAgIGZpcnN0UmVzdHJpY3RlZCA9IHRva2VuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIG9sZExhYmVsU2V0ID0gc3RhdGUubGFiZWxTZXQ7XG4gICAgICAgIG9sZEluSXRlcmF0aW9uID0gc3RhdGUuaW5JdGVyYXRpb247XG4gICAgICAgIG9sZEluU3dpdGNoID0gc3RhdGUuaW5Td2l0Y2g7XG4gICAgICAgIG9sZEluRnVuY3Rpb25Cb2R5ID0gc3RhdGUuaW5GdW5jdGlvbkJvZHk7XG4gICAgICAgIG9sZFBhcmVudGhlc2lzQ291bnQgPSBzdGF0ZS5wYXJlbnRoZXNpemVkQ291bnQ7XG5cbiAgICAgICAgc3RhdGUubGFiZWxTZXQgPSB7fTtcbiAgICAgICAgc3RhdGUuaW5JdGVyYXRpb24gPSBmYWxzZTtcbiAgICAgICAgc3RhdGUuaW5Td2l0Y2ggPSBmYWxzZTtcbiAgICAgICAgc3RhdGUuaW5GdW5jdGlvbkJvZHkgPSB0cnVlO1xuICAgICAgICBzdGF0ZS5wYXJlbnRoZXNpemVkQ291bnQgPSAwO1xuXG4gICAgICAgIHdoaWxlIChzdGFydEluZGV4IDwgbGVuZ3RoKSB7XG4gICAgICAgICAgICBpZiAobWF0Y2goJ30nKSkge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYm9keS5wdXNoKHBhcnNlU3RhdGVtZW50TGlzdEl0ZW0oKSk7XG4gICAgICAgIH1cblxuICAgICAgICBleHBlY3QoJ30nKTtcblxuICAgICAgICBzdGF0ZS5sYWJlbFNldCA9IG9sZExhYmVsU2V0O1xuICAgICAgICBzdGF0ZS5pbkl0ZXJhdGlvbiA9IG9sZEluSXRlcmF0aW9uO1xuICAgICAgICBzdGF0ZS5pblN3aXRjaCA9IG9sZEluU3dpdGNoO1xuICAgICAgICBzdGF0ZS5pbkZ1bmN0aW9uQm9keSA9IG9sZEluRnVuY3Rpb25Cb2R5O1xuICAgICAgICBzdGF0ZS5wYXJlbnRoZXNpemVkQ291bnQgPSBvbGRQYXJlbnRoZXNpc0NvdW50O1xuXG4gICAgICAgIHJldHVybiBub2RlLmZpbmlzaEJsb2NrU3RhdGVtZW50KGJvZHkpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHZhbGlkYXRlUGFyYW0ob3B0aW9ucywgcGFyYW0sIG5hbWUpIHtcbiAgICAgICAgdmFyIGtleSA9ICckJyArIG5hbWU7XG4gICAgICAgIGlmIChzdHJpY3QpIHtcbiAgICAgICAgICAgIGlmIChpc1Jlc3RyaWN0ZWRXb3JkKG5hbWUpKSB7XG4gICAgICAgICAgICAgICAgb3B0aW9ucy5zdHJpY3RlZCA9IHBhcmFtO1xuICAgICAgICAgICAgICAgIG9wdGlvbnMubWVzc2FnZSA9IE1lc3NhZ2VzLlN0cmljdFBhcmFtTmFtZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob3B0aW9ucy5wYXJhbVNldCwga2V5KSkge1xuICAgICAgICAgICAgICAgIG9wdGlvbnMuc3RyaWN0ZWQgPSBwYXJhbTtcbiAgICAgICAgICAgICAgICBvcHRpb25zLm1lc3NhZ2UgPSBNZXNzYWdlcy5TdHJpY3RQYXJhbUR1cGU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoIW9wdGlvbnMuZmlyc3RSZXN0cmljdGVkKSB7XG4gICAgICAgICAgICBpZiAoaXNSZXN0cmljdGVkV29yZChuYW1lKSkge1xuICAgICAgICAgICAgICAgIG9wdGlvbnMuZmlyc3RSZXN0cmljdGVkID0gcGFyYW07XG4gICAgICAgICAgICAgICAgb3B0aW9ucy5tZXNzYWdlID0gTWVzc2FnZXMuU3RyaWN0UGFyYW1OYW1lO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChpc1N0cmljdE1vZGVSZXNlcnZlZFdvcmQobmFtZSkpIHtcbiAgICAgICAgICAgICAgICBvcHRpb25zLmZpcnN0UmVzdHJpY3RlZCA9IHBhcmFtO1xuICAgICAgICAgICAgICAgIG9wdGlvbnMubWVzc2FnZSA9IE1lc3NhZ2VzLlN0cmljdFJlc2VydmVkV29yZDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9wdGlvbnMucGFyYW1TZXQsIGtleSkpIHtcbiAgICAgICAgICAgICAgICBvcHRpb25zLmZpcnN0UmVzdHJpY3RlZCA9IHBhcmFtO1xuICAgICAgICAgICAgICAgIG9wdGlvbnMubWVzc2FnZSA9IE1lc3NhZ2VzLlN0cmljdFBhcmFtRHVwZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBvcHRpb25zLnBhcmFtU2V0W2tleV0gPSB0cnVlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBhcnNlUGFyYW0ob3B0aW9ucykge1xuICAgICAgICB2YXIgdG9rZW4sIHBhcmFtLCBkZWY7XG5cbiAgICAgICAgdG9rZW4gPSBsb29rYWhlYWQ7XG4gICAgICAgIGlmICh0b2tlbi52YWx1ZSA9PT0gJy4uLicpIHtcbiAgICAgICAgICAgIHBhcmFtID0gcGFyc2VSZXN0RWxlbWVudCgpO1xuICAgICAgICAgICAgdmFsaWRhdGVQYXJhbShvcHRpb25zLCBwYXJhbS5hcmd1bWVudCwgcGFyYW0uYXJndW1lbnQubmFtZSk7XG4gICAgICAgICAgICBvcHRpb25zLnBhcmFtcy5wdXNoKHBhcmFtKTtcbiAgICAgICAgICAgIG9wdGlvbnMuZGVmYXVsdHMucHVzaChudWxsKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHBhcmFtID0gcGFyc2VQYXR0ZXJuV2l0aERlZmF1bHQoKTtcbiAgICAgICAgdmFsaWRhdGVQYXJhbShvcHRpb25zLCB0b2tlbiwgdG9rZW4udmFsdWUpO1xuXG4gICAgICAgIGlmIChwYXJhbS50eXBlID09PSBTeW50YXguQXNzaWdubWVudFBhdHRlcm4pIHtcbiAgICAgICAgICAgIGRlZiA9IHBhcmFtLnJpZ2h0O1xuICAgICAgICAgICAgcGFyYW0gPSBwYXJhbS5sZWZ0O1xuICAgICAgICAgICAgKytvcHRpb25zLmRlZmF1bHRDb3VudDtcbiAgICAgICAgfVxuXG4gICAgICAgIG9wdGlvbnMucGFyYW1zLnB1c2gocGFyYW0pO1xuICAgICAgICBvcHRpb25zLmRlZmF1bHRzLnB1c2goZGVmKTtcblxuICAgICAgICByZXR1cm4gIW1hdGNoKCcpJyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcGFyc2VQYXJhbXMoZmlyc3RSZXN0cmljdGVkKSB7XG4gICAgICAgIHZhciBvcHRpb25zO1xuXG4gICAgICAgIG9wdGlvbnMgPSB7XG4gICAgICAgICAgICBwYXJhbXM6IFtdLFxuICAgICAgICAgICAgZGVmYXVsdENvdW50OiAwLFxuICAgICAgICAgICAgZGVmYXVsdHM6IFtdLFxuICAgICAgICAgICAgZmlyc3RSZXN0cmljdGVkOiBmaXJzdFJlc3RyaWN0ZWRcbiAgICAgICAgfTtcblxuICAgICAgICBleHBlY3QoJygnKTtcblxuICAgICAgICBpZiAoIW1hdGNoKCcpJykpIHtcbiAgICAgICAgICAgIG9wdGlvbnMucGFyYW1TZXQgPSB7fTtcbiAgICAgICAgICAgIHdoaWxlIChzdGFydEluZGV4IDwgbGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFwYXJzZVBhcmFtKG9wdGlvbnMpKSB7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBleHBlY3QoJywnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGV4cGVjdCgnKScpO1xuXG4gICAgICAgIGlmIChvcHRpb25zLmRlZmF1bHRDb3VudCA9PT0gMCkge1xuICAgICAgICAgICAgb3B0aW9ucy5kZWZhdWx0cyA9IFtdO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHBhcmFtczogb3B0aW9ucy5wYXJhbXMsXG4gICAgICAgICAgICBkZWZhdWx0czogb3B0aW9ucy5kZWZhdWx0cyxcbiAgICAgICAgICAgIHN0cmljdGVkOiBvcHRpb25zLnN0cmljdGVkLFxuICAgICAgICAgICAgZmlyc3RSZXN0cmljdGVkOiBvcHRpb25zLmZpcnN0UmVzdHJpY3RlZCxcbiAgICAgICAgICAgIG1lc3NhZ2U6IG9wdGlvbnMubWVzc2FnZVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBhcnNlRnVuY3Rpb25EZWNsYXJhdGlvbihub2RlLCBpZGVudGlmaWVySXNPcHRpb25hbCkge1xuICAgICAgICB2YXIgaWQgPSBudWxsLCBwYXJhbXMgPSBbXSwgZGVmYXVsdHMgPSBbXSwgYm9keSwgdG9rZW4sIHN0cmljdGVkLCB0bXAsIGZpcnN0UmVzdHJpY3RlZCwgbWVzc2FnZSwgcHJldmlvdXNTdHJpY3Q7XG5cbiAgICAgICAgZXhwZWN0S2V5d29yZCgnZnVuY3Rpb24nKTtcbiAgICAgICAgaWYgKCFpZGVudGlmaWVySXNPcHRpb25hbCB8fCAhbWF0Y2goJygnKSkge1xuICAgICAgICAgICAgdG9rZW4gPSBsb29rYWhlYWQ7XG4gICAgICAgICAgICBpZCA9IHBhcnNlVmFyaWFibGVJZGVudGlmaWVyKCk7XG4gICAgICAgICAgICBpZiAoc3RyaWN0KSB7XG4gICAgICAgICAgICAgICAgaWYgKGlzUmVzdHJpY3RlZFdvcmQodG9rZW4udmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRvbGVyYXRlVW5leHBlY3RlZFRva2VuKHRva2VuLCBNZXNzYWdlcy5TdHJpY3RGdW5jdGlvbk5hbWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKGlzUmVzdHJpY3RlZFdvcmQodG9rZW4udmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIGZpcnN0UmVzdHJpY3RlZCA9IHRva2VuO1xuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlID0gTWVzc2FnZXMuU3RyaWN0RnVuY3Rpb25OYW1lO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaXNTdHJpY3RNb2RlUmVzZXJ2ZWRXb3JkKHRva2VuLnZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICBmaXJzdFJlc3RyaWN0ZWQgPSB0b2tlbjtcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZSA9IE1lc3NhZ2VzLlN0cmljdFJlc2VydmVkV29yZDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0bXAgPSBwYXJzZVBhcmFtcyhmaXJzdFJlc3RyaWN0ZWQpO1xuICAgICAgICBwYXJhbXMgPSB0bXAucGFyYW1zO1xuICAgICAgICBkZWZhdWx0cyA9IHRtcC5kZWZhdWx0cztcbiAgICAgICAgc3RyaWN0ZWQgPSB0bXAuc3RyaWN0ZWQ7XG4gICAgICAgIGZpcnN0UmVzdHJpY3RlZCA9IHRtcC5maXJzdFJlc3RyaWN0ZWQ7XG4gICAgICAgIGlmICh0bXAubWVzc2FnZSkge1xuICAgICAgICAgICAgbWVzc2FnZSA9IHRtcC5tZXNzYWdlO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJldmlvdXNTdHJpY3QgPSBzdHJpY3Q7XG4gICAgICAgIGJvZHkgPSBwYXJzZUZ1bmN0aW9uU291cmNlRWxlbWVudHMoKTtcbiAgICAgICAgaWYgKHN0cmljdCAmJiBmaXJzdFJlc3RyaWN0ZWQpIHtcbiAgICAgICAgICAgIHRocm93VW5leHBlY3RlZFRva2VuKGZpcnN0UmVzdHJpY3RlZCwgbWVzc2FnZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHN0cmljdCAmJiBzdHJpY3RlZCkge1xuICAgICAgICAgICAgdG9sZXJhdGVVbmV4cGVjdGVkVG9rZW4oc3RyaWN0ZWQsIG1lc3NhZ2UpO1xuICAgICAgICB9XG4gICAgICAgIHN0cmljdCA9IHByZXZpb3VzU3RyaWN0O1xuXG4gICAgICAgIHJldHVybiBub2RlLmZpbmlzaEZ1bmN0aW9uRGVjbGFyYXRpb24oaWQsIHBhcmFtcywgZGVmYXVsdHMsIGJvZHkpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBhcnNlRnVuY3Rpb25FeHByZXNzaW9uKCkge1xuICAgICAgICB2YXIgdG9rZW4sIGlkID0gbnVsbCwgc3RyaWN0ZWQsIGZpcnN0UmVzdHJpY3RlZCwgbWVzc2FnZSwgdG1wLFxuICAgICAgICAgICAgcGFyYW1zID0gW10sIGRlZmF1bHRzID0gW10sIGJvZHksIHByZXZpb3VzU3RyaWN0LCBub2RlID0gbmV3IE5vZGUoKTtcblxuICAgICAgICBleHBlY3RLZXl3b3JkKCdmdW5jdGlvbicpO1xuXG4gICAgICAgIGlmICghbWF0Y2goJygnKSkge1xuICAgICAgICAgICAgdG9rZW4gPSBsb29rYWhlYWQ7XG4gICAgICAgICAgICBpZCA9IHBhcnNlVmFyaWFibGVJZGVudGlmaWVyKCk7XG4gICAgICAgICAgICBpZiAoc3RyaWN0KSB7XG4gICAgICAgICAgICAgICAgaWYgKGlzUmVzdHJpY3RlZFdvcmQodG9rZW4udmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRvbGVyYXRlVW5leHBlY3RlZFRva2VuKHRva2VuLCBNZXNzYWdlcy5TdHJpY3RGdW5jdGlvbk5hbWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKGlzUmVzdHJpY3RlZFdvcmQodG9rZW4udmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIGZpcnN0UmVzdHJpY3RlZCA9IHRva2VuO1xuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlID0gTWVzc2FnZXMuU3RyaWN0RnVuY3Rpb25OYW1lO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaXNTdHJpY3RNb2RlUmVzZXJ2ZWRXb3JkKHRva2VuLnZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICBmaXJzdFJlc3RyaWN0ZWQgPSB0b2tlbjtcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZSA9IE1lc3NhZ2VzLlN0cmljdFJlc2VydmVkV29yZDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0bXAgPSBwYXJzZVBhcmFtcyhmaXJzdFJlc3RyaWN0ZWQpO1xuICAgICAgICBwYXJhbXMgPSB0bXAucGFyYW1zO1xuICAgICAgICBkZWZhdWx0cyA9IHRtcC5kZWZhdWx0cztcbiAgICAgICAgc3RyaWN0ZWQgPSB0bXAuc3RyaWN0ZWQ7XG4gICAgICAgIGZpcnN0UmVzdHJpY3RlZCA9IHRtcC5maXJzdFJlc3RyaWN0ZWQ7XG4gICAgICAgIGlmICh0bXAubWVzc2FnZSkge1xuICAgICAgICAgICAgbWVzc2FnZSA9IHRtcC5tZXNzYWdlO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJldmlvdXNTdHJpY3QgPSBzdHJpY3Q7XG4gICAgICAgIGJvZHkgPSBwYXJzZUZ1bmN0aW9uU291cmNlRWxlbWVudHMoKTtcbiAgICAgICAgaWYgKHN0cmljdCAmJiBmaXJzdFJlc3RyaWN0ZWQpIHtcbiAgICAgICAgICAgIHRocm93VW5leHBlY3RlZFRva2VuKGZpcnN0UmVzdHJpY3RlZCwgbWVzc2FnZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHN0cmljdCAmJiBzdHJpY3RlZCkge1xuICAgICAgICAgICAgdG9sZXJhdGVVbmV4cGVjdGVkVG9rZW4oc3RyaWN0ZWQsIG1lc3NhZ2UpO1xuICAgICAgICB9XG4gICAgICAgIHN0cmljdCA9IHByZXZpb3VzU3RyaWN0O1xuXG4gICAgICAgIHJldHVybiBub2RlLmZpbmlzaEZ1bmN0aW9uRXhwcmVzc2lvbihpZCwgcGFyYW1zLCBkZWZhdWx0cywgYm9keSk7XG4gICAgfVxuXG5cbiAgICBmdW5jdGlvbiBwYXJzZUNsYXNzQm9keSgpIHtcbiAgICAgICAgdmFyIGNsYXNzQm9keSwgdG9rZW4sIGlzU3RhdGljLCBoYXNDb25zdHJ1Y3RvciA9IGZhbHNlLCBib2R5LCBtZXRob2QsIGNvbXB1dGVkLCBrZXk7XG5cbiAgICAgICAgY2xhc3NCb2R5ID0gbmV3IE5vZGUoKTtcblxuICAgICAgICBleHBlY3QoJ3snKTtcbiAgICAgICAgYm9keSA9IFtdO1xuICAgICAgICB3aGlsZSAoIW1hdGNoKCd9JykpIHtcbiAgICAgICAgICAgIGlmIChtYXRjaCgnOycpKSB7XG4gICAgICAgICAgICAgICAgbGV4KCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG1ldGhvZCA9IG5ldyBOb2RlKCk7XG4gICAgICAgICAgICAgICAgdG9rZW4gPSBsb29rYWhlYWQ7XG4gICAgICAgICAgICAgICAgaXNTdGF0aWMgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBjb21wdXRlZCA9IG1hdGNoKCdbJyk7XG4gICAgICAgICAgICAgICAga2V5ID0gcGFyc2VPYmplY3RQcm9wZXJ0eUtleSgpO1xuICAgICAgICAgICAgICAgIGlmIChrZXkubmFtZSA9PT0gJ3N0YXRpYycgJiYgbG9va2FoZWFkUHJvcGVydHlOYW1lKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdG9rZW4gPSBsb29rYWhlYWQ7XG4gICAgICAgICAgICAgICAgICAgIGlzU3RhdGljID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgY29tcHV0ZWQgPSBtYXRjaCgnWycpO1xuICAgICAgICAgICAgICAgICAgICBrZXkgPSBwYXJzZU9iamVjdFByb3BlcnR5S2V5KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG1ldGhvZCA9IHRyeVBhcnNlTWV0aG9kRGVmaW5pdGlvbih0b2tlbiwga2V5LCBjb21wdXRlZCwgbWV0aG9kKTtcbiAgICAgICAgICAgICAgICBpZiAobWV0aG9kKSB7XG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZFsnc3RhdGljJ10gPSBpc1N0YXRpYztcbiAgICAgICAgICAgICAgICAgICAgaWYgKG1ldGhvZC5raW5kID09PSAnaW5pdCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1ldGhvZC5raW5kID0gJ21ldGhvZCc7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFpc1N0YXRpYykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFtZXRob2QuY29tcHV0ZWQgJiYgKG1ldGhvZC5rZXkubmFtZSB8fCBtZXRob2Qua2V5LnZhbHVlLnRvU3RyaW5nKCkpID09PSAnY29uc3RydWN0b3InKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1ldGhvZC5raW5kICE9PSAnbWV0aG9kJyB8fCAhbWV0aG9kLm1ldGhvZCB8fCBtZXRob2QudmFsdWUuZ2VuZXJhdG9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93VW5leHBlY3RlZFRva2VuKHRva2VuLCBNZXNzYWdlcy5Db25zdHJ1Y3RvclNwZWNpYWxNZXRob2QpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaGFzQ29uc3RydWN0b3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3dVbmV4cGVjdGVkVG9rZW4odG9rZW4sIE1lc3NhZ2VzLkR1cGxpY2F0ZUNvbnN0cnVjdG9yKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoYXNDb25zdHJ1Y3RvciA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1ldGhvZC5raW5kID0gJ2NvbnN0cnVjdG9yJztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghbWV0aG9kLmNvbXB1dGVkICYmIChtZXRob2Qua2V5Lm5hbWUgfHwgbWV0aG9kLmtleS52YWx1ZS50b1N0cmluZygpKSA9PT0gJ3Byb3RvdHlwZScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvd1VuZXhwZWN0ZWRUb2tlbih0b2tlbiwgTWVzc2FnZXMuU3RhdGljUHJvdG90eXBlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBtZXRob2QudHlwZSA9IFN5bnRheC5NZXRob2REZWZpbml0aW9uO1xuICAgICAgICAgICAgICAgICAgICBkZWxldGUgbWV0aG9kLm1ldGhvZDtcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIG1ldGhvZC5zaG9ydGhhbmQ7XG4gICAgICAgICAgICAgICAgICAgIGJvZHkucHVzaChtZXRob2QpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93VW5leHBlY3RlZFRva2VuKGxvb2thaGVhZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGxleCgpO1xuICAgICAgICByZXR1cm4gY2xhc3NCb2R5LmZpbmlzaENsYXNzQm9keShib2R5KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwYXJzZUNsYXNzRGVjbGFyYXRpb24oaWRlbnRpZmllcklzT3B0aW9uYWwpIHtcbiAgICAgICAgdmFyIGlkID0gbnVsbCwgc3VwZXJDbGFzcyA9IG51bGwsIGNsYXNzTm9kZSA9IG5ldyBOb2RlKCksIGNsYXNzQm9keSwgcHJldmlvdXNTdHJpY3QgPSBzdHJpY3Q7XG4gICAgICAgIHN0cmljdCA9IHRydWU7XG5cbiAgICAgICAgZXhwZWN0S2V5d29yZCgnY2xhc3MnKTtcblxuICAgICAgICBpZiAoIWlkZW50aWZpZXJJc09wdGlvbmFsIHx8IGxvb2thaGVhZC50eXBlID09PSBUb2tlbi5JZGVudGlmaWVyKSB7XG4gICAgICAgICAgICBpZCA9IHBhcnNlVmFyaWFibGVJZGVudGlmaWVyKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobWF0Y2hLZXl3b3JkKCdleHRlbmRzJykpIHtcbiAgICAgICAgICAgIGxleCgpO1xuICAgICAgICAgICAgc3VwZXJDbGFzcyA9IGlzb2xhdGVDb3ZlckdyYW1tYXIocGFyc2VMZWZ0SGFuZFNpZGVFeHByZXNzaW9uQWxsb3dDYWxsKTtcbiAgICAgICAgfVxuICAgICAgICBjbGFzc0JvZHkgPSBwYXJzZUNsYXNzQm9keSgpO1xuICAgICAgICBzdHJpY3QgPSBwcmV2aW91c1N0cmljdDtcblxuICAgICAgICByZXR1cm4gY2xhc3NOb2RlLmZpbmlzaENsYXNzRGVjbGFyYXRpb24oaWQsIHN1cGVyQ2xhc3MsIGNsYXNzQm9keSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcGFyc2VDbGFzc0V4cHJlc3Npb24oKSB7XG4gICAgICAgIHZhciBpZCA9IG51bGwsIHN1cGVyQ2xhc3MgPSBudWxsLCBjbGFzc05vZGUgPSBuZXcgTm9kZSgpLCBjbGFzc0JvZHksIHByZXZpb3VzU3RyaWN0ID0gc3RyaWN0O1xuICAgICAgICBzdHJpY3QgPSB0cnVlO1xuXG4gICAgICAgIGV4cGVjdEtleXdvcmQoJ2NsYXNzJyk7XG5cbiAgICAgICAgaWYgKGxvb2thaGVhZC50eXBlID09PSBUb2tlbi5JZGVudGlmaWVyKSB7XG4gICAgICAgICAgICBpZCA9IHBhcnNlVmFyaWFibGVJZGVudGlmaWVyKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobWF0Y2hLZXl3b3JkKCdleHRlbmRzJykpIHtcbiAgICAgICAgICAgIGxleCgpO1xuICAgICAgICAgICAgc3VwZXJDbGFzcyA9IGlzb2xhdGVDb3ZlckdyYW1tYXIocGFyc2VMZWZ0SGFuZFNpZGVFeHByZXNzaW9uQWxsb3dDYWxsKTtcbiAgICAgICAgfVxuICAgICAgICBjbGFzc0JvZHkgPSBwYXJzZUNsYXNzQm9keSgpO1xuICAgICAgICBzdHJpY3QgPSBwcmV2aW91c1N0cmljdDtcblxuICAgICAgICByZXR1cm4gY2xhc3NOb2RlLmZpbmlzaENsYXNzRXhwcmVzc2lvbihpZCwgc3VwZXJDbGFzcywgY2xhc3NCb2R5KTtcbiAgICB9XG5cbiAgICAvLyBNb2R1bGVzIGdyYW1tYXIgZnJvbTpcbiAgICAvLyBwZW9wbGUubW96aWxsYS5vcmcvfmpvcmVuZG9yZmYvZXM2LWRyYWZ0Lmh0bWxcblxuICAgIGZ1bmN0aW9uIHBhcnNlTW9kdWxlU3BlY2lmaWVyKCkge1xuICAgICAgICB2YXIgbm9kZSA9IG5ldyBOb2RlKCk7XG5cbiAgICAgICAgaWYgKGxvb2thaGVhZC50eXBlICE9PSBUb2tlbi5TdHJpbmdMaXRlcmFsKSB7XG4gICAgICAgICAgICB0aHJvd0Vycm9yKE1lc3NhZ2VzLkludmFsaWRNb2R1bGVTcGVjaWZpZXIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBub2RlLmZpbmlzaExpdGVyYWwobGV4KCkpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBhcnNlRXhwb3J0U3BlY2lmaWVyKCkge1xuICAgICAgICB2YXIgZXhwb3J0ZWQsIGxvY2FsLCBub2RlID0gbmV3IE5vZGUoKSwgZGVmO1xuICAgICAgICBpZiAobWF0Y2hLZXl3b3JkKCdkZWZhdWx0JykpIHtcbiAgICAgICAgICAgIC8vIGV4cG9ydCB7ZGVmYXVsdH0gZnJvbSAnc29tZXRoaW5nJztcbiAgICAgICAgICAgIGRlZiA9IG5ldyBOb2RlKCk7XG4gICAgICAgICAgICBsZXgoKTtcbiAgICAgICAgICAgIGxvY2FsID0gZGVmLmZpbmlzaElkZW50aWZpZXIoJ2RlZmF1bHQnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxvY2FsID0gcGFyc2VWYXJpYWJsZUlkZW50aWZpZXIoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobWF0Y2hDb250ZXh0dWFsS2V5d29yZCgnYXMnKSkge1xuICAgICAgICAgICAgbGV4KCk7XG4gICAgICAgICAgICBleHBvcnRlZCA9IHBhcnNlTm9uQ29tcHV0ZWRQcm9wZXJ0eSgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBub2RlLmZpbmlzaEV4cG9ydFNwZWNpZmllcihsb2NhbCwgZXhwb3J0ZWQpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBhcnNlRXhwb3J0TmFtZWREZWNsYXJhdGlvbihub2RlKSB7XG4gICAgICAgIHZhciBkZWNsYXJhdGlvbiA9IG51bGwsXG4gICAgICAgICAgICBpc0V4cG9ydEZyb21JZGVudGlmaWVyLFxuICAgICAgICAgICAgc3JjID0gbnVsbCwgc3BlY2lmaWVycyA9IFtdO1xuXG4gICAgICAgIC8vIG5vbi1kZWZhdWx0IGV4cG9ydFxuICAgICAgICBpZiAobG9va2FoZWFkLnR5cGUgPT09IFRva2VuLktleXdvcmQpIHtcbiAgICAgICAgICAgIC8vIGNvdmVyczpcbiAgICAgICAgICAgIC8vIGV4cG9ydCB2YXIgZiA9IDE7XG4gICAgICAgICAgICBzd2l0Y2ggKGxvb2thaGVhZC52YWx1ZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgJ2xldCc6XG4gICAgICAgICAgICAgICAgY2FzZSAnY29uc3QnOlxuICAgICAgICAgICAgICAgIGNhc2UgJ3Zhcic6XG4gICAgICAgICAgICAgICAgY2FzZSAnY2xhc3MnOlxuICAgICAgICAgICAgICAgIGNhc2UgJ2Z1bmN0aW9uJzpcbiAgICAgICAgICAgICAgICAgICAgZGVjbGFyYXRpb24gPSBwYXJzZVN0YXRlbWVudExpc3RJdGVtKCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBub2RlLmZpbmlzaEV4cG9ydE5hbWVkRGVjbGFyYXRpb24oZGVjbGFyYXRpb24sIHNwZWNpZmllcnMsIG51bGwpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZXhwZWN0KCd7Jyk7XG4gICAgICAgIGlmICghbWF0Y2goJ30nKSkge1xuICAgICAgICAgICAgZG8ge1xuICAgICAgICAgICAgICAgIGlzRXhwb3J0RnJvbUlkZW50aWZpZXIgPSBpc0V4cG9ydEZyb21JZGVudGlmaWVyIHx8IG1hdGNoS2V5d29yZCgnZGVmYXVsdCcpO1xuICAgICAgICAgICAgICAgIHNwZWNpZmllcnMucHVzaChwYXJzZUV4cG9ydFNwZWNpZmllcigpKTtcbiAgICAgICAgICAgIH0gd2hpbGUgKG1hdGNoKCcsJykgJiYgbGV4KCkpO1xuICAgICAgICB9XG4gICAgICAgIGV4cGVjdCgnfScpO1xuXG4gICAgICAgIGlmIChtYXRjaENvbnRleHR1YWxLZXl3b3JkKCdmcm9tJykpIHtcbiAgICAgICAgICAgIC8vIGNvdmVyaW5nOlxuICAgICAgICAgICAgLy8gZXhwb3J0IHtkZWZhdWx0fSBmcm9tICdmb28nO1xuICAgICAgICAgICAgLy8gZXhwb3J0IHtmb299IGZyb20gJ2Zvbyc7XG4gICAgICAgICAgICBsZXgoKTtcbiAgICAgICAgICAgIHNyYyA9IHBhcnNlTW9kdWxlU3BlY2lmaWVyKCk7XG4gICAgICAgICAgICBjb25zdW1lU2VtaWNvbG9uKCk7XG4gICAgICAgIH0gZWxzZSBpZiAoaXNFeHBvcnRGcm9tSWRlbnRpZmllcikge1xuICAgICAgICAgICAgLy8gY292ZXJpbmc6XG4gICAgICAgICAgICAvLyBleHBvcnQge2RlZmF1bHR9OyAvLyBtaXNzaW5nIGZyb21DbGF1c2VcbiAgICAgICAgICAgIHRocm93RXJyb3IobG9va2FoZWFkLnZhbHVlID9cbiAgICAgICAgICAgICAgICAgICAgTWVzc2FnZXMuVW5leHBlY3RlZFRva2VuIDogTWVzc2FnZXMuTWlzc2luZ0Zyb21DbGF1c2UsIGxvb2thaGVhZC52YWx1ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBjb3ZlclxuICAgICAgICAgICAgLy8gZXhwb3J0IHtmb299O1xuICAgICAgICAgICAgY29uc3VtZVNlbWljb2xvbigpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBub2RlLmZpbmlzaEV4cG9ydE5hbWVkRGVjbGFyYXRpb24oZGVjbGFyYXRpb24sIHNwZWNpZmllcnMsIHNyYyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcGFyc2VFeHBvcnREZWZhdWx0RGVjbGFyYXRpb24obm9kZSkge1xuICAgICAgICB2YXIgZGVjbGFyYXRpb24gPSBudWxsLFxuICAgICAgICAgICAgZXhwcmVzc2lvbiA9IG51bGw7XG5cbiAgICAgICAgLy8gY292ZXJzOlxuICAgICAgICAvLyBleHBvcnQgZGVmYXVsdCAuLi5cbiAgICAgICAgZXhwZWN0S2V5d29yZCgnZGVmYXVsdCcpO1xuXG4gICAgICAgIGlmIChtYXRjaEtleXdvcmQoJ2Z1bmN0aW9uJykpIHtcbiAgICAgICAgICAgIC8vIGNvdmVyczpcbiAgICAgICAgICAgIC8vIGV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGZvbyAoKSB7fVxuICAgICAgICAgICAgLy8gZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKCkge31cbiAgICAgICAgICAgIGRlY2xhcmF0aW9uID0gcGFyc2VGdW5jdGlvbkRlY2xhcmF0aW9uKG5ldyBOb2RlKCksIHRydWUpO1xuICAgICAgICAgICAgcmV0dXJuIG5vZGUuZmluaXNoRXhwb3J0RGVmYXVsdERlY2xhcmF0aW9uKGRlY2xhcmF0aW9uKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobWF0Y2hLZXl3b3JkKCdjbGFzcycpKSB7XG4gICAgICAgICAgICBkZWNsYXJhdGlvbiA9IHBhcnNlQ2xhc3NEZWNsYXJhdGlvbih0cnVlKTtcbiAgICAgICAgICAgIHJldHVybiBub2RlLmZpbmlzaEV4cG9ydERlZmF1bHREZWNsYXJhdGlvbihkZWNsYXJhdGlvbik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobWF0Y2hDb250ZXh0dWFsS2V5d29yZCgnZnJvbScpKSB7XG4gICAgICAgICAgICB0aHJvd0Vycm9yKE1lc3NhZ2VzLlVuZXhwZWN0ZWRUb2tlbiwgbG9va2FoZWFkLnZhbHVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGNvdmVyczpcbiAgICAgICAgLy8gZXhwb3J0IGRlZmF1bHQge307XG4gICAgICAgIC8vIGV4cG9ydCBkZWZhdWx0IFtdO1xuICAgICAgICAvLyBleHBvcnQgZGVmYXVsdCAoMSArIDIpO1xuICAgICAgICBpZiAobWF0Y2goJ3snKSkge1xuICAgICAgICAgICAgZXhwcmVzc2lvbiA9IHBhcnNlT2JqZWN0SW5pdGlhbGlzZXIoKTtcbiAgICAgICAgfSBlbHNlIGlmIChtYXRjaCgnWycpKSB7XG4gICAgICAgICAgICBleHByZXNzaW9uID0gcGFyc2VBcnJheUluaXRpYWxpc2VyKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBleHByZXNzaW9uID0gcGFyc2VBc3NpZ25tZW50RXhwcmVzc2lvbigpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN1bWVTZW1pY29sb24oKTtcbiAgICAgICAgcmV0dXJuIG5vZGUuZmluaXNoRXhwb3J0RGVmYXVsdERlY2xhcmF0aW9uKGV4cHJlc3Npb24pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBhcnNlRXhwb3J0QWxsRGVjbGFyYXRpb24obm9kZSkge1xuICAgICAgICB2YXIgc3JjO1xuXG4gICAgICAgIC8vIGNvdmVyczpcbiAgICAgICAgLy8gZXhwb3J0ICogZnJvbSAnZm9vJztcbiAgICAgICAgZXhwZWN0KCcqJyk7XG4gICAgICAgIGlmICghbWF0Y2hDb250ZXh0dWFsS2V5d29yZCgnZnJvbScpKSB7XG4gICAgICAgICAgICB0aHJvd0Vycm9yKGxvb2thaGVhZC52YWx1ZSA/XG4gICAgICAgICAgICAgICAgICAgIE1lc3NhZ2VzLlVuZXhwZWN0ZWRUb2tlbiA6IE1lc3NhZ2VzLk1pc3NpbmdGcm9tQ2xhdXNlLCBsb29rYWhlYWQudmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIGxleCgpO1xuICAgICAgICBzcmMgPSBwYXJzZU1vZHVsZVNwZWNpZmllcigpO1xuICAgICAgICBjb25zdW1lU2VtaWNvbG9uKCk7XG5cbiAgICAgICAgcmV0dXJuIG5vZGUuZmluaXNoRXhwb3J0QWxsRGVjbGFyYXRpb24oc3JjKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwYXJzZUV4cG9ydERlY2xhcmF0aW9uKCkge1xuICAgICAgICB2YXIgbm9kZSA9IG5ldyBOb2RlKCk7XG4gICAgICAgIGlmIChzdGF0ZS5pbkZ1bmN0aW9uQm9keSkge1xuICAgICAgICAgICAgdGhyb3dFcnJvcihNZXNzYWdlcy5JbGxlZ2FsRXhwb3J0RGVjbGFyYXRpb24pO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwZWN0S2V5d29yZCgnZXhwb3J0Jyk7XG5cbiAgICAgICAgaWYgKG1hdGNoS2V5d29yZCgnZGVmYXVsdCcpKSB7XG4gICAgICAgICAgICByZXR1cm4gcGFyc2VFeHBvcnREZWZhdWx0RGVjbGFyYXRpb24obm9kZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG1hdGNoKCcqJykpIHtcbiAgICAgICAgICAgIHJldHVybiBwYXJzZUV4cG9ydEFsbERlY2xhcmF0aW9uKG5vZGUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwYXJzZUV4cG9ydE5hbWVkRGVjbGFyYXRpb24obm9kZSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcGFyc2VJbXBvcnRTcGVjaWZpZXIoKSB7XG4gICAgICAgIC8vIGltcG9ydCB7PGZvbyBhcyBiYXI+fSAuLi47XG4gICAgICAgIHZhciBsb2NhbCwgaW1wb3J0ZWQsIG5vZGUgPSBuZXcgTm9kZSgpO1xuXG4gICAgICAgIGltcG9ydGVkID0gcGFyc2VOb25Db21wdXRlZFByb3BlcnR5KCk7XG4gICAgICAgIGlmIChtYXRjaENvbnRleHR1YWxLZXl3b3JkKCdhcycpKSB7XG4gICAgICAgICAgICBsZXgoKTtcbiAgICAgICAgICAgIGxvY2FsID0gcGFyc2VWYXJpYWJsZUlkZW50aWZpZXIoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBub2RlLmZpbmlzaEltcG9ydFNwZWNpZmllcihsb2NhbCwgaW1wb3J0ZWQpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBhcnNlTmFtZWRJbXBvcnRzKCkge1xuICAgICAgICB2YXIgc3BlY2lmaWVycyA9IFtdO1xuICAgICAgICAvLyB7Zm9vLCBiYXIgYXMgYmFzfVxuICAgICAgICBleHBlY3QoJ3snKTtcbiAgICAgICAgaWYgKCFtYXRjaCgnfScpKSB7XG4gICAgICAgICAgICBkbyB7XG4gICAgICAgICAgICAgICAgc3BlY2lmaWVycy5wdXNoKHBhcnNlSW1wb3J0U3BlY2lmaWVyKCkpO1xuICAgICAgICAgICAgfSB3aGlsZSAobWF0Y2goJywnKSAmJiBsZXgoKSk7XG4gICAgICAgIH1cbiAgICAgICAgZXhwZWN0KCd9Jyk7XG4gICAgICAgIHJldHVybiBzcGVjaWZpZXJzO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBhcnNlSW1wb3J0RGVmYXVsdFNwZWNpZmllcigpIHtcbiAgICAgICAgLy8gaW1wb3J0IDxmb28+IC4uLjtcbiAgICAgICAgdmFyIGxvY2FsLCBub2RlID0gbmV3IE5vZGUoKTtcblxuICAgICAgICBsb2NhbCA9IHBhcnNlTm9uQ29tcHV0ZWRQcm9wZXJ0eSgpO1xuXG4gICAgICAgIHJldHVybiBub2RlLmZpbmlzaEltcG9ydERlZmF1bHRTcGVjaWZpZXIobG9jYWwpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBhcnNlSW1wb3J0TmFtZXNwYWNlU3BlY2lmaWVyKCkge1xuICAgICAgICAvLyBpbXBvcnQgPCogYXMgZm9vPiAuLi47XG4gICAgICAgIHZhciBsb2NhbCwgbm9kZSA9IG5ldyBOb2RlKCk7XG5cbiAgICAgICAgZXhwZWN0KCcqJyk7XG4gICAgICAgIGlmICghbWF0Y2hDb250ZXh0dWFsS2V5d29yZCgnYXMnKSkge1xuICAgICAgICAgICAgdGhyb3dFcnJvcihNZXNzYWdlcy5Ob0FzQWZ0ZXJJbXBvcnROYW1lc3BhY2UpO1xuICAgICAgICB9XG4gICAgICAgIGxleCgpO1xuICAgICAgICBsb2NhbCA9IHBhcnNlTm9uQ29tcHV0ZWRQcm9wZXJ0eSgpO1xuXG4gICAgICAgIHJldHVybiBub2RlLmZpbmlzaEltcG9ydE5hbWVzcGFjZVNwZWNpZmllcihsb2NhbCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcGFyc2VJbXBvcnREZWNsYXJhdGlvbigpIHtcbiAgICAgICAgdmFyIHNwZWNpZmllcnMsIHNyYywgbm9kZSA9IG5ldyBOb2RlKCk7XG5cbiAgICAgICAgaWYgKHN0YXRlLmluRnVuY3Rpb25Cb2R5KSB7XG4gICAgICAgICAgICB0aHJvd0Vycm9yKE1lc3NhZ2VzLklsbGVnYWxJbXBvcnREZWNsYXJhdGlvbik7XG4gICAgICAgIH1cblxuICAgICAgICBleHBlY3RLZXl3b3JkKCdpbXBvcnQnKTtcbiAgICAgICAgc3BlY2lmaWVycyA9IFtdO1xuXG4gICAgICAgIGlmIChsb29rYWhlYWQudHlwZSA9PT0gVG9rZW4uU3RyaW5nTGl0ZXJhbCkge1xuICAgICAgICAgICAgLy8gY292ZXJzOlxuICAgICAgICAgICAgLy8gaW1wb3J0ICdmb28nO1xuICAgICAgICAgICAgc3JjID0gcGFyc2VNb2R1bGVTcGVjaWZpZXIoKTtcbiAgICAgICAgICAgIGNvbnN1bWVTZW1pY29sb24oKTtcbiAgICAgICAgICAgIHJldHVybiBub2RlLmZpbmlzaEltcG9ydERlY2xhcmF0aW9uKHNwZWNpZmllcnMsIHNyYyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIW1hdGNoS2V5d29yZCgnZGVmYXVsdCcpICYmIGlzSWRlbnRpZmllck5hbWUobG9va2FoZWFkKSkge1xuICAgICAgICAgICAgLy8gY292ZXJzOlxuICAgICAgICAgICAgLy8gaW1wb3J0IGZvb1xuICAgICAgICAgICAgLy8gaW1wb3J0IGZvbywgLi4uXG4gICAgICAgICAgICBzcGVjaWZpZXJzLnB1c2gocGFyc2VJbXBvcnREZWZhdWx0U3BlY2lmaWVyKCkpO1xuICAgICAgICAgICAgaWYgKG1hdGNoKCcsJykpIHtcbiAgICAgICAgICAgICAgICBsZXgoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAobWF0Y2goJyonKSkge1xuICAgICAgICAgICAgLy8gY292ZXJzOlxuICAgICAgICAgICAgLy8gaW1wb3J0IGZvbywgKiBhcyBmb29cbiAgICAgICAgICAgIC8vIGltcG9ydCAqIGFzIGZvb1xuICAgICAgICAgICAgc3BlY2lmaWVycy5wdXNoKHBhcnNlSW1wb3J0TmFtZXNwYWNlU3BlY2lmaWVyKCkpO1xuICAgICAgICB9IGVsc2UgaWYgKG1hdGNoKCd7JykpIHtcbiAgICAgICAgICAgIC8vIGNvdmVyczpcbiAgICAgICAgICAgIC8vIGltcG9ydCBmb28sIHtiYXJ9XG4gICAgICAgICAgICAvLyBpbXBvcnQge2Jhcn1cbiAgICAgICAgICAgIHNwZWNpZmllcnMgPSBzcGVjaWZpZXJzLmNvbmNhdChwYXJzZU5hbWVkSW1wb3J0cygpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghbWF0Y2hDb250ZXh0dWFsS2V5d29yZCgnZnJvbScpKSB7XG4gICAgICAgICAgICB0aHJvd0Vycm9yKGxvb2thaGVhZC52YWx1ZSA/XG4gICAgICAgICAgICAgICAgICAgIE1lc3NhZ2VzLlVuZXhwZWN0ZWRUb2tlbiA6IE1lc3NhZ2VzLk1pc3NpbmdGcm9tQ2xhdXNlLCBsb29rYWhlYWQudmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIGxleCgpO1xuICAgICAgICBzcmMgPSBwYXJzZU1vZHVsZVNwZWNpZmllcigpO1xuICAgICAgICBjb25zdW1lU2VtaWNvbG9uKCk7XG5cbiAgICAgICAgcmV0dXJuIG5vZGUuZmluaXNoSW1wb3J0RGVjbGFyYXRpb24oc3BlY2lmaWVycywgc3JjKTtcbiAgICB9XG5cbiAgICAvLyAxNCBQcm9ncmFtXG5cbiAgICBmdW5jdGlvbiBwYXJzZVNjcmlwdEJvZHkoKSB7XG4gICAgICAgIHZhciBzdGF0ZW1lbnQsIGJvZHkgPSBbXSwgdG9rZW4sIGRpcmVjdGl2ZSwgZmlyc3RSZXN0cmljdGVkO1xuXG4gICAgICAgIHdoaWxlIChzdGFydEluZGV4IDwgbGVuZ3RoKSB7XG4gICAgICAgICAgICB0b2tlbiA9IGxvb2thaGVhZDtcbiAgICAgICAgICAgIGlmICh0b2tlbi50eXBlICE9PSBUb2tlbi5TdHJpbmdMaXRlcmFsKSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHN0YXRlbWVudCA9IHBhcnNlU3RhdGVtZW50TGlzdEl0ZW0oKTtcbiAgICAgICAgICAgIGJvZHkucHVzaChzdGF0ZW1lbnQpO1xuICAgICAgICAgICAgaWYgKHN0YXRlbWVudC5leHByZXNzaW9uLnR5cGUgIT09IFN5bnRheC5MaXRlcmFsKSB7XG4gICAgICAgICAgICAgICAgLy8gdGhpcyBpcyBub3QgZGlyZWN0aXZlXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkaXJlY3RpdmUgPSBzb3VyY2Uuc2xpY2UodG9rZW4uc3RhcnQgKyAxLCB0b2tlbi5lbmQgLSAxKTtcbiAgICAgICAgICAgIGlmIChkaXJlY3RpdmUgPT09ICd1c2Ugc3RyaWN0Jykge1xuICAgICAgICAgICAgICAgIHN0cmljdCA9IHRydWU7XG4gICAgICAgICAgICAgICAgaWYgKGZpcnN0UmVzdHJpY3RlZCkge1xuICAgICAgICAgICAgICAgICAgICB0b2xlcmF0ZVVuZXhwZWN0ZWRUb2tlbihmaXJzdFJlc3RyaWN0ZWQsIE1lc3NhZ2VzLlN0cmljdE9jdGFsTGl0ZXJhbCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoIWZpcnN0UmVzdHJpY3RlZCAmJiB0b2tlbi5vY3RhbCkge1xuICAgICAgICAgICAgICAgICAgICBmaXJzdFJlc3RyaWN0ZWQgPSB0b2tlbjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB3aGlsZSAoc3RhcnRJbmRleCA8IGxlbmd0aCkge1xuICAgICAgICAgICAgc3RhdGVtZW50ID0gcGFyc2VTdGF0ZW1lbnRMaXN0SXRlbSgpO1xuICAgICAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgICAgICAgICBpZiAodHlwZW9mIHN0YXRlbWVudCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJvZHkucHVzaChzdGF0ZW1lbnQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBib2R5O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBhcnNlUHJvZ3JhbSgpIHtcbiAgICAgICAgdmFyIGJvZHksIG5vZGU7XG5cbiAgICAgICAgcGVlaygpO1xuICAgICAgICBub2RlID0gbmV3IE5vZGUoKTtcblxuICAgICAgICBib2R5ID0gcGFyc2VTY3JpcHRCb2R5KCk7XG4gICAgICAgIHJldHVybiBub2RlLmZpbmlzaFByb2dyYW0oYm9keSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZmlsdGVyVG9rZW5Mb2NhdGlvbigpIHtcbiAgICAgICAgdmFyIGksIGVudHJ5LCB0b2tlbiwgdG9rZW5zID0gW107XG5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGV4dHJhLnRva2Vucy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgZW50cnkgPSBleHRyYS50b2tlbnNbaV07XG4gICAgICAgICAgICB0b2tlbiA9IHtcbiAgICAgICAgICAgICAgICB0eXBlOiBlbnRyeS50eXBlLFxuICAgICAgICAgICAgICAgIHZhbHVlOiBlbnRyeS52YWx1ZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGlmIChlbnRyeS5yZWdleCkge1xuICAgICAgICAgICAgICAgIHRva2VuLnJlZ2V4ID0ge1xuICAgICAgICAgICAgICAgICAgICBwYXR0ZXJuOiBlbnRyeS5yZWdleC5wYXR0ZXJuLFxuICAgICAgICAgICAgICAgICAgICBmbGFnczogZW50cnkucmVnZXguZmxhZ3NcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGV4dHJhLnJhbmdlKSB7XG4gICAgICAgICAgICAgICAgdG9rZW4ucmFuZ2UgPSBlbnRyeS5yYW5nZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChleHRyYS5sb2MpIHtcbiAgICAgICAgICAgICAgICB0b2tlbi5sb2MgPSBlbnRyeS5sb2M7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0b2tlbnMucHVzaCh0b2tlbik7XG4gICAgICAgIH1cblxuICAgICAgICBleHRyYS50b2tlbnMgPSB0b2tlbnM7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdG9rZW5pemUoY29kZSwgb3B0aW9ucykge1xuICAgICAgICB2YXIgdG9TdHJpbmcsXG4gICAgICAgICAgICB0b2tlbnM7XG5cbiAgICAgICAgdG9TdHJpbmcgPSBTdHJpbmc7XG4gICAgICAgIGlmICh0eXBlb2YgY29kZSAhPT0gJ3N0cmluZycgJiYgIShjb2RlIGluc3RhbmNlb2YgU3RyaW5nKSkge1xuICAgICAgICAgICAgY29kZSA9IHRvU3RyaW5nKGNvZGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgc291cmNlID0gY29kZTtcbiAgICAgICAgaW5kZXggPSAwO1xuICAgICAgICBsaW5lTnVtYmVyID0gKHNvdXJjZS5sZW5ndGggPiAwKSA/IDEgOiAwO1xuICAgICAgICBsaW5lU3RhcnQgPSAwO1xuICAgICAgICBzdGFydEluZGV4ID0gaW5kZXg7XG4gICAgICAgIHN0YXJ0TGluZU51bWJlciA9IGxpbmVOdW1iZXI7XG4gICAgICAgIHN0YXJ0TGluZVN0YXJ0ID0gbGluZVN0YXJ0O1xuICAgICAgICBsZW5ndGggPSBzb3VyY2UubGVuZ3RoO1xuICAgICAgICBsb29rYWhlYWQgPSBudWxsO1xuICAgICAgICBzdGF0ZSA9IHtcbiAgICAgICAgICAgIGFsbG93SW46IHRydWUsXG4gICAgICAgICAgICBsYWJlbFNldDoge30sXG4gICAgICAgICAgICBpbkZ1bmN0aW9uQm9keTogZmFsc2UsXG4gICAgICAgICAgICBpbkl0ZXJhdGlvbjogZmFsc2UsXG4gICAgICAgICAgICBpblN3aXRjaDogZmFsc2UsXG4gICAgICAgICAgICBsYXN0Q29tbWVudFN0YXJ0OiAtMSxcbiAgICAgICAgICAgIGN1cmx5U3RhY2s6IFtdXG4gICAgICAgIH07XG5cbiAgICAgICAgZXh0cmEgPSB7fTtcblxuICAgICAgICAvLyBPcHRpb25zIG1hdGNoaW5nLlxuICAgICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgICAgICAvLyBPZiBjb3Vyc2Ugd2UgY29sbGVjdCB0b2tlbnMgaGVyZS5cbiAgICAgICAgb3B0aW9ucy50b2tlbnMgPSB0cnVlO1xuICAgICAgICBleHRyYS50b2tlbnMgPSBbXTtcbiAgICAgICAgZXh0cmEudG9rZW5pemUgPSB0cnVlO1xuICAgICAgICAvLyBUaGUgZm9sbG93aW5nIHR3byBmaWVsZHMgYXJlIG5lY2Vzc2FyeSB0byBjb21wdXRlIHRoZSBSZWdleCB0b2tlbnMuXG4gICAgICAgIGV4dHJhLm9wZW5QYXJlblRva2VuID0gLTE7XG4gICAgICAgIGV4dHJhLm9wZW5DdXJseVRva2VuID0gLTE7XG5cbiAgICAgICAgZXh0cmEucmFuZ2UgPSAodHlwZW9mIG9wdGlvbnMucmFuZ2UgPT09ICdib29sZWFuJykgJiYgb3B0aW9ucy5yYW5nZTtcbiAgICAgICAgZXh0cmEubG9jID0gKHR5cGVvZiBvcHRpb25zLmxvYyA9PT0gJ2Jvb2xlYW4nKSAmJiBvcHRpb25zLmxvYztcblxuICAgICAgICBpZiAodHlwZW9mIG9wdGlvbnMuY29tbWVudCA9PT0gJ2Jvb2xlYW4nICYmIG9wdGlvbnMuY29tbWVudCkge1xuICAgICAgICAgICAgZXh0cmEuY29tbWVudHMgPSBbXTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIG9wdGlvbnMudG9sZXJhbnQgPT09ICdib29sZWFuJyAmJiBvcHRpb25zLnRvbGVyYW50KSB7XG4gICAgICAgICAgICBleHRyYS5lcnJvcnMgPSBbXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBwZWVrKCk7XG4gICAgICAgICAgICBpZiAobG9va2FoZWFkLnR5cGUgPT09IFRva2VuLkVPRikge1xuICAgICAgICAgICAgICAgIHJldHVybiBleHRyYS50b2tlbnM7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxleCgpO1xuICAgICAgICAgICAgd2hpbGUgKGxvb2thaGVhZC50eXBlICE9PSBUb2tlbi5FT0YpIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBsZXgoKTtcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChsZXhFcnJvcikge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZXh0cmEuZXJyb3JzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWNvcmRFcnJvcihsZXhFcnJvcik7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBXZSBoYXZlIHRvIGJyZWFrIG9uIHRoZSBmaXJzdCBlcnJvclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gdG8gYXZvaWQgaW5maW5pdGUgbG9vcHMuXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IGxleEVycm9yO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmaWx0ZXJUb2tlbkxvY2F0aW9uKCk7XG4gICAgICAgICAgICB0b2tlbnMgPSBleHRyYS50b2tlbnM7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGV4dHJhLmNvbW1lbnRzICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgIHRva2Vucy5jb21tZW50cyA9IGV4dHJhLmNvbW1lbnRzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHR5cGVvZiBleHRyYS5lcnJvcnMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgdG9rZW5zLmVycm9ycyA9IGV4dHJhLmVycm9ycztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgIGV4dHJhID0ge307XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRva2VucztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwYXJzZShjb2RlLCBvcHRpb25zKSB7XG4gICAgICAgIHZhciBwcm9ncmFtLCB0b1N0cmluZztcblxuICAgICAgICB0b1N0cmluZyA9IFN0cmluZztcbiAgICAgICAgaWYgKHR5cGVvZiBjb2RlICE9PSAnc3RyaW5nJyAmJiAhKGNvZGUgaW5zdGFuY2VvZiBTdHJpbmcpKSB7XG4gICAgICAgICAgICBjb2RlID0gdG9TdHJpbmcoY29kZSk7XG4gICAgICAgIH1cblxuICAgICAgICBzb3VyY2UgPSBjb2RlO1xuICAgICAgICBpbmRleCA9IDA7XG4gICAgICAgIGxpbmVOdW1iZXIgPSAoc291cmNlLmxlbmd0aCA+IDApID8gMSA6IDA7XG4gICAgICAgIGxpbmVTdGFydCA9IDA7XG4gICAgICAgIHN0YXJ0SW5kZXggPSBpbmRleDtcbiAgICAgICAgc3RhcnRMaW5lTnVtYmVyID0gbGluZU51bWJlcjtcbiAgICAgICAgc3RhcnRMaW5lU3RhcnQgPSBsaW5lU3RhcnQ7XG4gICAgICAgIGxlbmd0aCA9IHNvdXJjZS5sZW5ndGg7XG4gICAgICAgIGxvb2thaGVhZCA9IG51bGw7XG4gICAgICAgIHN0YXRlID0ge1xuICAgICAgICAgICAgYWxsb3dJbjogdHJ1ZSxcbiAgICAgICAgICAgIGxhYmVsU2V0OiB7fSxcbiAgICAgICAgICAgIGluRnVuY3Rpb25Cb2R5OiBmYWxzZSxcbiAgICAgICAgICAgIGluSXRlcmF0aW9uOiBmYWxzZSxcbiAgICAgICAgICAgIGluU3dpdGNoOiBmYWxzZSxcbiAgICAgICAgICAgIGxhc3RDb21tZW50U3RhcnQ6IC0xLFxuICAgICAgICAgICAgY3VybHlTdGFjazogW11cbiAgICAgICAgfTtcbiAgICAgICAgc291cmNlVHlwZSA9ICdzY3JpcHQnO1xuICAgICAgICBzdHJpY3QgPSBmYWxzZTtcblxuICAgICAgICBleHRyYSA9IHt9O1xuICAgICAgICBpZiAodHlwZW9mIG9wdGlvbnMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBleHRyYS5yYW5nZSA9ICh0eXBlb2Ygb3B0aW9ucy5yYW5nZSA9PT0gJ2Jvb2xlYW4nKSAmJiBvcHRpb25zLnJhbmdlO1xuICAgICAgICAgICAgZXh0cmEubG9jID0gKHR5cGVvZiBvcHRpb25zLmxvYyA9PT0gJ2Jvb2xlYW4nKSAmJiBvcHRpb25zLmxvYztcbiAgICAgICAgICAgIGV4dHJhLmF0dGFjaENvbW1lbnQgPSAodHlwZW9mIG9wdGlvbnMuYXR0YWNoQ29tbWVudCA9PT0gJ2Jvb2xlYW4nKSAmJiBvcHRpb25zLmF0dGFjaENvbW1lbnQ7XG5cbiAgICAgICAgICAgIGlmIChleHRyYS5sb2MgJiYgb3B0aW9ucy5zb3VyY2UgIT09IG51bGwgJiYgb3B0aW9ucy5zb3VyY2UgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGV4dHJhLnNvdXJjZSA9IHRvU3RyaW5nKG9wdGlvbnMuc291cmNlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25zLnRva2VucyA9PT0gJ2Jvb2xlYW4nICYmIG9wdGlvbnMudG9rZW5zKSB7XG4gICAgICAgICAgICAgICAgZXh0cmEudG9rZW5zID0gW107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodHlwZW9mIG9wdGlvbnMuY29tbWVudCA9PT0gJ2Jvb2xlYW4nICYmIG9wdGlvbnMuY29tbWVudCkge1xuICAgICAgICAgICAgICAgIGV4dHJhLmNvbW1lbnRzID0gW107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodHlwZW9mIG9wdGlvbnMudG9sZXJhbnQgPT09ICdib29sZWFuJyAmJiBvcHRpb25zLnRvbGVyYW50KSB7XG4gICAgICAgICAgICAgICAgZXh0cmEuZXJyb3JzID0gW107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZXh0cmEuYXR0YWNoQ29tbWVudCkge1xuICAgICAgICAgICAgICAgIGV4dHJhLnJhbmdlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBleHRyYS5jb21tZW50cyA9IFtdO1xuICAgICAgICAgICAgICAgIGV4dHJhLmJvdHRvbVJpZ2h0U3RhY2sgPSBbXTtcbiAgICAgICAgICAgICAgICBleHRyYS50cmFpbGluZ0NvbW1lbnRzID0gW107XG4gICAgICAgICAgICAgICAgZXh0cmEubGVhZGluZ0NvbW1lbnRzID0gW107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAob3B0aW9ucy5zb3VyY2VUeXBlID09PSAnbW9kdWxlJykge1xuICAgICAgICAgICAgICAgIC8vIHZlcnkgcmVzdHJpY3RpdmUgY29uZGl0aW9uIGZvciBub3dcbiAgICAgICAgICAgICAgICBzb3VyY2VUeXBlID0gb3B0aW9ucy5zb3VyY2VUeXBlO1xuICAgICAgICAgICAgICAgIHN0cmljdCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcHJvZ3JhbSA9IHBhcnNlUHJvZ3JhbSgpO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBleHRyYS5jb21tZW50cyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICBwcm9ncmFtLmNvbW1lbnRzID0gZXh0cmEuY29tbWVudHM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodHlwZW9mIGV4dHJhLnRva2VucyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICBmaWx0ZXJUb2tlbkxvY2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgcHJvZ3JhbS50b2tlbnMgPSBleHRyYS50b2tlbnM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodHlwZW9mIGV4dHJhLmVycm9ycyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICBwcm9ncmFtLmVycm9ycyA9IGV4dHJhLmVycm9ycztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgIGV4dHJhID0ge307XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcHJvZ3JhbTtcbiAgICB9XG5cbiAgICAvLyBTeW5jIHdpdGggKi5qc29uIG1hbmlmZXN0cy5cbiAgICBleHBvcnRzLnZlcnNpb24gPSAnMi4yLjAnO1xuXG4gICAgZXhwb3J0cy50b2tlbml6ZSA9IHRva2VuaXplO1xuXG4gICAgZXhwb3J0cy5wYXJzZSA9IHBhcnNlO1xuXG4gICAgLy8gRGVlcCBjb3B5LlxuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICAgZXhwb3J0cy5TeW50YXggPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgbmFtZSwgdHlwZXMgPSB7fTtcblxuICAgICAgICBpZiAodHlwZW9mIE9iamVjdC5jcmVhdGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHR5cGVzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAobmFtZSBpbiBTeW50YXgpIHtcbiAgICAgICAgICAgIGlmIChTeW50YXguaGFzT3duUHJvcGVydHkobmFtZSkpIHtcbiAgICAgICAgICAgICAgICB0eXBlc1tuYW1lXSA9IFN5bnRheFtuYW1lXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlb2YgT2JqZWN0LmZyZWV6ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgT2JqZWN0LmZyZWV6ZSh0eXBlcyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdHlwZXM7XG4gICAgfSgpKTtcblxufSkpO1xuLyogdmltOiBzZXQgc3c9NCB0cz00IGV0IHR3PTgwIDogKi9cbiIsIjsgdmFyIF9fYnJvd3NlcmlmeV9zaGltX3JlcXVpcmVfXz1yZXF1aXJlOyhmdW5jdGlvbiBicm93c2VyaWZ5U2hpbShtb2R1bGUsIGV4cG9ydHMsIHJlcXVpcmUsIGRlZmluZSwgYnJvd3NlcmlmeV9zaGltX19kZWZpbmVfX21vZHVsZV9fZXhwb3J0X18pIHtcbi8qZ2xvYmFsIHdpbmRvdzp0cnVlKi9cblxuLypcbiAqIG9iZWxpc2tcbiAqL1xuXG4oZnVuY3Rpb24gKHdpbmRvdykge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgLyoqXG4gICAgICogU3RhdGljIGNsYXNzIGhvbGRpbmcgbGlicmFyeSBzcGVjaWZpYyBpbmZvcm1hdGlvblxuICAgICAqIHRoZSBsaWJyYXJ5LlxuICAgICAqIEBjbGFzcyBvYmVsaXNrXG4gICAgICoqL1xuICAgIHZhciBvYmVsaXNrID0ge307XG5cbiAgICAvKipcbiAgICAgKiBAcHJvcGVydHkgdmVyc2lvblxuICAgICAqIEB0eXBlIFN0cmluZ1xuICAgICAqIEBzdGF0aWNcbiAgICAgKiovXG4gICAgb2JlbGlzay52ZXJzaW9uID0gJzEuMS4wJztcblxuICAgIC8qKlxuICAgICAqIEBwcm9wZXJ0eSBhdXRob3JcbiAgICAgKiBAdHlwZSBTdHJpbmdcbiAgICAgKiBAc3RhdGljXG4gICAgICoqL1xuICAgIG9iZWxpc2suYXV0aG9yID0gJ21heCBodWFuZyc7XG5cbiAgICB3aW5kb3cub2JlbGlzayA9IG9iZWxpc2s7XG59KHdpbmRvdykpO1xuXG4vKmdsb2JhbCBvYmVsaXNrOnRydWUqL1xuXG4vKlxuICogQWJzdHJhY3RDb2xvclxuICovXG5cbihmdW5jdGlvbiAob2JlbGlzaykge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgdmFyIEFic3RyYWN0Q29sb3IsIHA7XG5cbiAgICBBYnN0cmFjdENvbG9yID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmluaXRpYWxpemUoKTtcbiAgICB9O1xuICAgIHAgPSBBYnN0cmFjdENvbG9yLnByb3RvdHlwZTtcblxuICAgIC8vIHB1YmxpYyBwcm9wZXJ0aWVzXG4gICAgLyoqXG4gICAgICogVGhlIGlubmVyIGNvbG9ycyBmb3IgZWxlbWVudHMgb2YgY2VydGFpbiBwcmltaXRpdmVcbiAgICAgKi9cbiAgICBwLmlubmVyID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIFRoZSBib3JkZXIgY29sb3JzIGZvciBlbGVtZW50cyBvZiBjZXJ0YWluIHByaW1pdGl2ZVxuICAgICAqL1xuICAgIHAuYm9yZGVyID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIFRoZSBib3JkZXJIaWdobGlnaHQgY29sb3JzIGZvciBlbGVtZW50cyBvZiBjZXJ0YWluIHByaW1pdGl2ZVxuICAgICAqL1xuICAgIHAuYm9yZGVySGlnaGxpZ2h0ID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIFRoZSBsZWZ0IHNpZGUgY29sb3JzIGZvciBlbGVtZW50cyBvZiBjZXJ0YWluIHByaW1pdGl2ZVxuICAgICAqL1xuICAgIHAubGVmdCA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgcmlnaHQgc2lkZSBjb2xvcnMgZm9yIGVsZW1lbnRzIG9mIGNlcnRhaW4gcHJpbWl0aXZlXG4gICAgICovXG4gICAgcC5yaWdodCA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgaG9yaXpvbnRhbCBjb2xvcnMgZm9yIGVsZW1lbnRzIG9mIGNlcnRhaW4gcHJpbWl0aXZlXG4gICAgICovXG4gICAgcC5ob3Jpem9udGFsID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIFRoZSBsZWZ0IHNsb3Qgc2lkZSBjb2xvcnMgZm9yIGVsZW1lbnRzIG9mIGNlcnRhaW4gcHJpbWl0aXZlXG4gICAgICovXG4gICAgcC5sZWZ0U2xvcGUgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogVGhlIHJpZ2h0IHNsb3Qgc2lkZSBjb2xvcnMgZm9yIGVsZW1lbnRzIG9mIGNlcnRhaW4gcHJpbWl0aXZlXG4gICAgICovXG4gICAgcC5yaWdodFNsb3BlID0gbnVsbDtcblxuICAgIC8vIGNvbnN0cnVjdG9yXG4gICAgcC5pbml0aWFsaXplID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgLy8gcHVibGljIG1ldGhvZHNcbiAgICBwLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gXCJbQWJzdHJhY3RDb2xvcl1cIjtcbiAgICB9O1xuXG4gICAgLy8gcHJpdmF0ZSBtZXRob2RzXG5cbiAgICBvYmVsaXNrLkFic3RyYWN0Q29sb3IgPSBBYnN0cmFjdENvbG9yO1xufShvYmVsaXNrKSk7XG5cbi8qZ2xvYmFsIG9iZWxpc2s6dHJ1ZSovXG5cbi8qXG4gKiBDdWJlQ29sb3JcbiAqL1xuXG4oZnVuY3Rpb24gKG9iZWxpc2spIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHZhciBDdWJlQ29sb3IsIHA7XG4gICAgQ3ViZUNvbG9yID0gZnVuY3Rpb24gKGJvcmRlciwgYm9yZGVySGlnaGxpZ2h0LCBsZWZ0LCByaWdodCwgaG9yaXpvbnRhbCkge1xuICAgICAgICB0aGlzLmluaXRpYWxpemUoYm9yZGVyLCBib3JkZXJIaWdobGlnaHQsIGxlZnQsIHJpZ2h0LCBob3Jpem9udGFsKTtcbiAgICB9O1xuICAgIHAgPSBDdWJlQ29sb3IucHJvdG90eXBlID0gbmV3IG9iZWxpc2suQWJzdHJhY3RDb2xvcigpO1xuXG4gICAgLy8gcHVibGljIHByb3BlcnRpZXNcbiAgICBwLkJSSUdIVE5FU1NfR0FJTiA9IC0yMDtcblxuICAgIC8vIGNvbnN0cnVjdG9yXG4gICAgcC5pbml0aWFsaXplID0gZnVuY3Rpb24gKGJvcmRlciwgYm9yZGVySGlnaGxpZ2h0LCBsZWZ0LCByaWdodCwgaG9yaXpvbnRhbCkge1xuICAgICAgICB0aGlzLmJvcmRlciA9IG9iZWxpc2suQ29sb3JHZW9tLmdldDMyKGJvcmRlciA9PT0gdW5kZWZpbmVkID8gMHg4Nzg3ODcgOiBib3JkZXIpO1xuICAgICAgICB0aGlzLmJvcmRlckhpZ2hsaWdodCA9IG9iZWxpc2suQ29sb3JHZW9tLmdldDMyKGJvcmRlckhpZ2hsaWdodCA9PT0gdW5kZWZpbmVkID8gMHhGRkZGRkYgOiBib3JkZXJIaWdobGlnaHQpO1xuICAgICAgICB0aGlzLmxlZnQgPSBvYmVsaXNrLkNvbG9yR2VvbS5nZXQzMihsZWZ0ID09PSB1bmRlZmluZWQgPyAweEM5Q0ZEMCA6IGxlZnQpO1xuICAgICAgICB0aGlzLnJpZ2h0ID0gb2JlbGlzay5Db2xvckdlb20uZ2V0MzIocmlnaHQgPT09IHVuZGVmaW5lZCA/IDB4RTNFM0UzIDogcmlnaHQpO1xuICAgICAgICB0aGlzLmhvcml6b250YWwgPSBvYmVsaXNrLkNvbG9yR2VvbS5nZXQzMihob3Jpem9udGFsID09PSB1bmRlZmluZWQgPyAweEVFRUZGMCA6IGhvcml6b250YWwpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgLy8gcHVibGljIG1ldGhvZHNcbiAgICBwLmdldEJ5SG9yaXpvbnRhbENvbG9yID0gZnVuY3Rpb24gKGhvcml6b250YWwpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBDdWJlQ29sb3IoXG4gICAgICAgICAgICBvYmVsaXNrLkNvbG9yR2VvbS5hcHBseUJyaWdodG5lc3MoaG9yaXpvbnRhbCwgdGhpcy5CUklHSFRORVNTX0dBSU4gKiA0KSxcbiAgICAgICAgICAgIC8vYXBwbHkgaGlnaHRsaWdodFxuICAgICAgICAgICAgb2JlbGlzay5Db2xvckdlb20uYXBwbHlCcmlnaHRuZXNzKGhvcml6b250YWwsIDAsIHRydWUpLFxuICAgICAgICAgICAgb2JlbGlzay5Db2xvckdlb20uYXBwbHlCcmlnaHRuZXNzKGhvcml6b250YWwsIHRoaXMuQlJJR0hUTkVTU19HQUlOICogMiksXG4gICAgICAgICAgICBvYmVsaXNrLkNvbG9yR2VvbS5hcHBseUJyaWdodG5lc3MoaG9yaXpvbnRhbCwgdGhpcy5CUklHSFRORVNTX0dBSU4pLFxuICAgICAgICAgICAgaG9yaXpvbnRhbFxuICAgICAgICApO1xuICAgIH07XG5cbiAgICBwLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gXCJbQ3ViZUNvbG9yXVwiO1xuICAgIH07XG5cbiAgICAvLyBwcml2YXRlIG1ldGhvZHNcblxuICAgIG9iZWxpc2suQ3ViZUNvbG9yID0gQ3ViZUNvbG9yO1xufShvYmVsaXNrKSk7XG5cbi8qZ2xvYmFsIG9iZWxpc2s6dHJ1ZSovXG5cbi8qXG4gKiBQeXJhbWlkQ29sb3JcbiAqL1xuXG4oZnVuY3Rpb24gKG9iZWxpc2spIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHZhciBQeXJhbWlkQ29sb3IsIHA7XG4gICAgUHlyYW1pZENvbG9yID0gZnVuY3Rpb24gKGJvcmRlciwgYm9yZGVySGlnaGxpZ2h0LCBsZWZ0LCByaWdodCkge1xuICAgICAgICB0aGlzLmluaXRpYWxpemUoYm9yZGVyLCBib3JkZXJIaWdobGlnaHQsIGxlZnQsIHJpZ2h0KTtcbiAgICB9O1xuICAgIHAgPSBQeXJhbWlkQ29sb3IucHJvdG90eXBlID0gbmV3IG9iZWxpc2suQWJzdHJhY3RDb2xvcigpO1xuXG4gICAgLy8gcHVibGljIHByb3BlcnRpZXNcbiAgICBwLkJSSUdIVE5FU1NfR0FJTiA9IC0yMDtcblxuICAgIC8vIGNvbnN0cnVjdG9yXG4gICAgcC5pbml0aWFsaXplID0gZnVuY3Rpb24gKGJvcmRlciwgYm9yZGVySGlnaGxpZ2h0LCBsZWZ0LCByaWdodCkge1xuICAgICAgICB0aGlzLmJvcmRlciA9IG9iZWxpc2suQ29sb3JHZW9tLmdldDMyKGJvcmRlciA9PT0gdW5kZWZpbmVkID8gMHg5NDk2OTggOiBib3JkZXIpO1xuICAgICAgICB0aGlzLmJvcmRlckhpZ2hsaWdodCA9IG9iZWxpc2suQ29sb3JHZW9tLmdldDMyKGJvcmRlckhpZ2hsaWdodCA9PT0gdW5kZWZpbmVkID8gMHhGRkZGRkYgOiBib3JkZXJIaWdobGlnaHQpO1xuICAgICAgICB0aGlzLmxlZnQgPSBvYmVsaXNrLkNvbG9yR2VvbS5nZXQzMihsZWZ0ID09PSB1bmRlZmluZWQgPyAweEU2RThFOSA6IGxlZnQpO1xuICAgICAgICB0aGlzLnJpZ2h0ID0gb2JlbGlzay5Db2xvckdlb20uZ2V0MzIocmlnaHQgPT09IHVuZGVmaW5lZCA/IDB4RUVFRkYwIDogcmlnaHQpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgLy8gcHVibGljIG1ldGhvZHNcbiAgICBwLmdldEJ5UmlnaHRDb2xvciA9IGZ1bmN0aW9uIChyaWdodCkge1xuICAgICAgICByZXR1cm4gbmV3IFB5cmFtaWRDb2xvcihcbiAgICAgICAgICAgIG9iZWxpc2suQ29sb3JHZW9tLmFwcGx5QnJpZ2h0bmVzcyhyaWdodCwgdGhpcy5CUklHSFRORVNTX0dBSU4gKiA0KSxcbiAgICAgICAgICAgIC8vYXBwbHkgaGlnaHRsaWdodFxuICAgICAgICAgICAgb2JlbGlzay5Db2xvckdlb20uYXBwbHlCcmlnaHRuZXNzKHJpZ2h0LCAwLCB0cnVlKSxcbiAgICAgICAgICAgIG9iZWxpc2suQ29sb3JHZW9tLmFwcGx5QnJpZ2h0bmVzcyhyaWdodCwgdGhpcy5CUklHSFRORVNTX0dBSU4pLFxuICAgICAgICAgICAgcmlnaHRcbiAgICAgICAgKTtcbiAgICB9O1xuXG4gICAgcC50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIFwiW1B5cmFtaWRDb2xvcl1cIjtcbiAgICB9O1xuXG4gICAgLy8gcHJpdmF0ZSBtZXRob2RzXG5cbiAgICBvYmVsaXNrLlB5cmFtaWRDb2xvciA9IFB5cmFtaWRDb2xvcjtcbn0ob2JlbGlzaykpO1xuXG4vKmdsb2JhbCBvYmVsaXNrOnRydWUqL1xuXG4vKlxuICogU2lkZUNvbG9yXG4gKi9cblxuKGZ1bmN0aW9uIChvYmVsaXNrKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICB2YXIgU2lkZUNvbG9yLCBwO1xuICAgIFNpZGVDb2xvciA9IGZ1bmN0aW9uIChib3JkZXIsIGlubmVyKSB7XG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZShib3JkZXIsIGlubmVyKTtcbiAgICB9O1xuICAgIHAgPSBTaWRlQ29sb3IucHJvdG90eXBlID0gbmV3IG9iZWxpc2suQWJzdHJhY3RDb2xvcigpO1xuXG4gICAgLy8gcHVibGljIHByb3BlcnRpZXNcbiAgICBwLkJSSUdIVE5FU1NfR0FJTiA9IC0yMDtcblxuICAgIC8vIGNvbnN0cnVjdG9yXG4gICAgcC5pbml0aWFsaXplID0gZnVuY3Rpb24gKGJvcmRlciwgaW5uZXIpIHtcbiAgICAgICAgdGhpcy5ib3JkZXIgPSBvYmVsaXNrLkNvbG9yR2VvbS5nZXQzMihib3JkZXIgPT09IHVuZGVmaW5lZCA/IDB4ODc4Nzg3IDogYm9yZGVyKTtcbiAgICAgICAgdGhpcy5pbm5lciA9IG9iZWxpc2suQ29sb3JHZW9tLmdldDMyKGlubmVyID09PSB1bmRlZmluZWQgPyAweEVFRUVFRSA6IGlubmVyKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIC8vIHB1YmxpYyBtZXRob2RzXG4gICAgcC5nZXRCeUlubmVyQ29sb3IgPSBmdW5jdGlvbiAoaW5uZXIpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBvYmVsaXNrLlNpZGVDb2xvcihcbiAgICAgICAgICAgIG9iZWxpc2suQ29sb3JHZW9tLmFwcGx5QnJpZ2h0bmVzcyhpbm5lciwgdGhpcy5CUklHSFRORVNTX0dBSU4gKiA0KSxcbiAgICAgICAgICAgIGlubmVyXG4gICAgICAgICk7XG4gICAgfTtcblxuICAgIHAudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBcIltTaWRlQ29sb3JdXCI7XG4gICAgfTtcblxuICAgIC8vIHByaXZhdGUgbWV0aG9kc1xuXG4gICAgb2JlbGlzay5TaWRlQ29sb3IgPSBTaWRlQ29sb3I7XG59KG9iZWxpc2spKTtcblxuLypnbG9iYWwgb2JlbGlzazp0cnVlKi9cblxuLypcbiAqIFNsb3BlQ29sb3JcbiAqL1xuXG4oZnVuY3Rpb24gKG9iZWxpc2spIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHZhciBTbG9wZUNvbG9yLCBwO1xuICAgIFNsb3BlQ29sb3IgPSBmdW5jdGlvbiAoYm9yZGVyLCBib3JkZXJIaWdobGlnaHQsIGxlZnQsIHJpZ2h0LCBsZWZ0U2xvcGUsIHJpZ2h0U2xvcGUpIHtcbiAgICAgICAgdGhpcy5pbml0aWFsaXplKGJvcmRlciwgYm9yZGVySGlnaGxpZ2h0LCBsZWZ0LCByaWdodCwgbGVmdFNsb3BlLCByaWdodFNsb3BlKTtcbiAgICB9O1xuICAgIHAgPSBTbG9wZUNvbG9yLnByb3RvdHlwZSA9IG5ldyBvYmVsaXNrLkFic3RyYWN0Q29sb3IoKTtcblxuICAgIC8vIHB1YmxpYyBwcm9wZXJ0aWVzXG4gICAgcC5CUklHSFRORVNTX0dBSU4gPSAtMjA7XG5cbiAgICAvLyBjb25zdHJ1Y3RvclxuICAgIHAuaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uIChib3JkZXIsIGJvcmRlckhpZ2hsaWdodCwgbGVmdCwgcmlnaHQsIGxlZnRTbG9wZSwgcmlnaHRTbG9wZSkge1xuICAgICAgICB0aGlzLmJvcmRlciA9IG9iZWxpc2suQ29sb3JHZW9tLmdldDMyKGJvcmRlciA9PT0gdW5kZWZpbmVkID8gMHg5NDk2OTggOiBib3JkZXIpO1xuICAgICAgICB0aGlzLmJvcmRlckhpZ2hsaWdodCA9IG9iZWxpc2suQ29sb3JHZW9tLmdldDMyKGJvcmRlckhpZ2hsaWdodCA9PT0gdW5kZWZpbmVkID8gMHhGRkZGRkYgOiBib3JkZXJIaWdobGlnaHQpO1xuICAgICAgICB0aGlzLmxlZnQgPSBvYmVsaXNrLkNvbG9yR2VvbS5nZXQzMihsZWZ0ID09PSB1bmRlZmluZWQgPyAweEM5Q0ZEMCA6IGxlZnQpO1xuICAgICAgICB0aGlzLnJpZ2h0ID0gb2JlbGlzay5Db2xvckdlb20uZ2V0MzIocmlnaHQgPT09IHVuZGVmaW5lZCA/IDB4RTZFOEU5IDogcmlnaHQpO1xuICAgICAgICB0aGlzLmxlZnRTbG9wZSA9IG9iZWxpc2suQ29sb3JHZW9tLmdldDMyKGxlZnRTbG9wZSA9PT0gdW5kZWZpbmVkID8gMHhEQkRCREIgOiBsZWZ0U2xvcGUpO1xuICAgICAgICB0aGlzLnJpZ2h0U2xvcGUgPSBvYmVsaXNrLkNvbG9yR2VvbS5nZXQzMihyaWdodFNsb3BlID09PSB1bmRlZmluZWQgPyAweERCREJEQiA6IHJpZ2h0U2xvcGUpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgLy8gcHVibGljIG1ldGhvZHNcblxuICAgIC8qXG4gICAgICogaG9yaXpvbnRhbCBzaWRlIGRvZXNuJ3QgYWN0dWFsbHkgZXhpc3QgaW4gdGhlIFNsb3BlIHByaW1pdGl2ZVxuICAgICAqIHlvdSBjYW4gYXNzaWduIHRoZSBzYW1lIGhvcml6b250YWwgY29sb3IgYXMgY3ViZVxuICAgICAqIHNvIHRoYXQgeW91IHdpbGwgYmUgYWJsZSB0byBhcnJhbmdlIHRoZSBzbG9wZSB3aXRoIGN1YmVcbiAgICAgKi9cbiAgICBwLmdldEJ5SG9yaXpvbnRhbENvbG9yID0gZnVuY3Rpb24gKGhvcml6b250YWwpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBvYmVsaXNrLlNsb3BlQ29sb3IoXG4gICAgICAgICAgICBvYmVsaXNrLkNvbG9yR2VvbS5hcHBseUJyaWdodG5lc3MoaG9yaXpvbnRhbCwgdGhpcy5CUklHSFRORVNTX0dBSU4gKiA0KSxcbiAgICAgICAgICAgIC8vYXBwbHkgaGlnaHRsaWdodFxuICAgICAgICAgICAgb2JlbGlzay5Db2xvckdlb20uYXBwbHlCcmlnaHRuZXNzKGhvcml6b250YWwsIDAsIHRydWUpLFxuICAgICAgICAgICAgb2JlbGlzay5Db2xvckdlb20uYXBwbHlCcmlnaHRuZXNzKGhvcml6b250YWwsIHRoaXMuQlJJR0hUTkVTU19HQUlOICogMiksXG4gICAgICAgICAgICBvYmVsaXNrLkNvbG9yR2VvbS5hcHBseUJyaWdodG5lc3MoaG9yaXpvbnRhbCwgdGhpcy5CUklHSFRORVNTX0dBSU4pLFxuICAgICAgICAgICAgb2JlbGlzay5Db2xvckdlb20uYXBwbHlCcmlnaHRuZXNzKGhvcml6b250YWwsIHRoaXMuQlJJR0hUTkVTU19HQUlOICogMS41KSxcbiAgICAgICAgICAgIG9iZWxpc2suQ29sb3JHZW9tLmFwcGx5QnJpZ2h0bmVzcyhob3Jpem9udGFsLCB0aGlzLkJSSUdIVE5FU1NfR0FJTiAqIDAuNSlcbiAgICAgICAgKTtcbiAgICB9O1xuXG4gICAgcC50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIFwiW1Nsb3BlQ29sb3JdXCI7XG4gICAgfTtcblxuICAgIC8vIHByaXZhdGUgbWV0aG9kc1xuXG4gICAgb2JlbGlzay5TbG9wZUNvbG9yID0gU2xvcGVDb2xvcjtcbn0ob2JlbGlzaykpO1xuXG4vKmdsb2JhbCBvYmVsaXNrOnRydWUqL1xuXG4vKlxuICogQWJzdHJhY3REaW1lbnNpb25cbiAqL1xuXG4oZnVuY3Rpb24gKG9iZWxpc2spIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHZhciBBYnN0cmFjdERpbWVuc2lvbiwgcDtcbiAgICBBYnN0cmFjdERpbWVuc2lvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5pbml0aWFsaXplKCk7XG4gICAgfTtcbiAgICBwID0gQWJzdHJhY3REaW1lbnNpb24ucHJvdG90eXBlO1xuXG4gICAgLy8gcHVibGljIHByb3BlcnRpZXNcbiAgICAvKipcbiAgICAgKiBUaGUgeCBBeGlzIGRpbWVuc2lvbnMgaW4gMjIuNiBkZWdyZWVzIGNvb3JkaW5hdGVcbiAgICAgKi9cbiAgICBwLnhBeGlzID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIFRoZSB5IEF4aXMgZGltZW5zaW9ucyBpbiAyMi42IGRlZ3JlZXMgY29vcmRpbmF0ZVxuICAgICAqL1xuICAgIHAueUF4aXMgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogVGhlIHogQXhpcyBkaW1lbnNpb25zIGluIDIyLjYgZGVncmVlcyBjb29yZGluYXRlXG4gICAgICovXG4gICAgcC56QXhpcyA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBQeXJhbWlkIHRhbGwgbW9kZVxuICAgICAqL1xuICAgIHAudGFsbCA9IGZhbHNlO1xuXG4gICAgLy8gY29uc3RydWN0b3JcbiAgICBwLmluaXRpYWxpemUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICAvLyBwdWJsaWMgbWV0aG9kc1xuICAgIHAudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBcIltBYnN0cmFjdERpbWVuc2lvbl1cIjtcbiAgICB9O1xuXG4gICAgLy8gcHJpdmF0ZSBtZXRob2RzXG5cbiAgICBvYmVsaXNrLkFic3RyYWN0RGltZW5zaW9uID0gQWJzdHJhY3REaW1lbnNpb247XG59KG9iZWxpc2spKTtcblxuLypnbG9iYWwgb2JlbGlzazp0cnVlKi9cblxuLypcbiAqIEJyaWNrRGltZW5zaW9uXG4gKi9cblxuKGZ1bmN0aW9uIChvYmVsaXNrKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICB2YXIgQnJpY2tEaW1lbnNpb24sIHA7XG4gICAgQnJpY2tEaW1lbnNpb24gPSBmdW5jdGlvbiAoeEF4aXMsIHlBeGlzKSB7XG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZSh4QXhpcywgeUF4aXMpO1xuICAgIH07XG4gICAgcCA9IEJyaWNrRGltZW5zaW9uLnByb3RvdHlwZSA9IG5ldyBvYmVsaXNrLkFic3RyYWN0RGltZW5zaW9uKCk7XG5cbiAgICAvLyBjb25zdHJ1Y3RvclxuICAgIHAuaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uICh4QXhpcywgeUF4aXMpIHtcbiAgICAgICAgdGhpcy54QXhpcyA9IHhBeGlzIHx8IDMwO1xuICAgICAgICB0aGlzLnlBeGlzID0geUF4aXMgfHwgMzA7XG5cbiAgICAgICAgaWYgKHRoaXMueEF4aXMgJSAyID09PSAxIHx8IHRoaXMueUF4aXMgJSAyID09PSAxKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJ4LHlBeGlzIG11c3QgYmUgZXZlbiBudW1iZXJcIik7XG4gICAgICAgIH1cblxuICAgICAgICAvLyB4QXhpcyB8fCB5QXhpcyA9IDQgZmxvb2RGaWxsIGNvdWxkIG5vdCBiZSBhcHBsaWVkXG4gICAgICAgIGlmICh0aGlzLnhBeGlzIDw9IDQgfHwgdGhpcy55QXhpcyA8PSA0KSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJkaW1lbnNpb24gaXMgdG9vIHNtYWxsXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIHAudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBcIltCcmlja0RpbWVuc2lvbl1cIjtcbiAgICB9O1xuXG4gICAgb2JlbGlzay5Ccmlja0RpbWVuc2lvbiA9IEJyaWNrRGltZW5zaW9uO1xufShvYmVsaXNrKSk7XG5cbi8qZ2xvYmFsIG9iZWxpc2s6dHJ1ZSovXG5cbi8qXG4gKiBDdWJlRGltZW5zaW9uXG4gKi9cblxuKGZ1bmN0aW9uIChvYmVsaXNrKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICB2YXIgQ3ViZURpbWVuc2lvbiwgcDtcbiAgICBDdWJlRGltZW5zaW9uID0gZnVuY3Rpb24gKHhBeGlzLCB5QXhpcywgekF4aXMpIHtcbiAgICAgICAgdGhpcy5pbml0aWFsaXplKHhBeGlzLCB5QXhpcywgekF4aXMpO1xuICAgIH07XG4gICAgcCA9IEN1YmVEaW1lbnNpb24ucHJvdG90eXBlID0gbmV3IG9iZWxpc2suQWJzdHJhY3REaW1lbnNpb24oKTtcblxuICAgIC8vIGNvbnN0cnVjdG9yXG4gICAgcC5pbml0aWFsaXplID0gZnVuY3Rpb24gKHhBeGlzLCB5QXhpcywgekF4aXMpIHtcbiAgICAgICAgdGhpcy54QXhpcyA9IHhBeGlzIHx8IDMwO1xuICAgICAgICB0aGlzLnlBeGlzID0geUF4aXMgfHwgMzA7XG4gICAgICAgIHRoaXMuekF4aXMgPSB6QXhpcyB8fCAzMDtcblxuICAgICAgICBpZiAodGhpcy54QXhpcyAlIDIgPT09IDEgfHwgdGhpcy55QXhpcyAlIDIgPT09IDEpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIngseUF4aXMgbXVzdCBiZSBldmVuIG51bWJlclwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHhBeGlzIHx8IHlBeGlzID0gNCBmbG9vZEZpbGwgY291bGQgbm90IGJlIGFwcGxpZWRcbiAgICAgICAgaWYgKHRoaXMueEF4aXMgPD0gNCB8fCB0aGlzLnlBeGlzIDw9IDQgfHwgdGhpcy56QXhpcyA8PSAyKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJkaW1lbnNpb24gaXMgdG9vIHNtYWxsXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIHAudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBcIltDdWJlRGltZW5zaW9uXVwiO1xuICAgIH07XG5cbiAgICBvYmVsaXNrLkN1YmVEaW1lbnNpb24gPSBDdWJlRGltZW5zaW9uO1xufShvYmVsaXNrKSk7XG5cbi8qZ2xvYmFsIG9iZWxpc2s6dHJ1ZSovXG5cbi8qXG4gKiBQeXJhbWlkRGltZW5zaW9uXG4gKi9cblxuKGZ1bmN0aW9uIChvYmVsaXNrKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICB2YXIgUHlyYW1pZERpbWVuc2lvbiwgcDtcbiAgICBQeXJhbWlkRGltZW5zaW9uID0gZnVuY3Rpb24gKGF4aXMsIHRhbGwpIHtcbiAgICAgICAgdGhpcy5pbml0aWFsaXplKGF4aXMsIHRhbGwpO1xuICAgIH07XG4gICAgcCA9IFB5cmFtaWREaW1lbnNpb24ucHJvdG90eXBlID0gbmV3IG9iZWxpc2suQWJzdHJhY3REaW1lbnNpb24oKTtcblxuICAgIC8vIGNvbnN0cnVjdG9yXG4gICAgcC5pbml0aWFsaXplID0gZnVuY3Rpb24gKGF4aXMsIHRhbGwpIHtcbiAgICAgICAgdGhpcy54QXhpcyA9IGF4aXMgfHwgMzA7XG4gICAgICAgIHRoaXMueUF4aXMgPSBheGlzIHx8IDMwO1xuICAgICAgICB0aGlzLnRhbGwgPSB0YWxsIHx8IGZhbHNlO1xuXG4gICAgICAgIGlmICh0aGlzLnhBeGlzICUgMiA9PT0gMSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiYXhpcyBtdXN0IGJlIGV2ZW4gbnVtYmVyXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMueEF4aXMgPD0gNCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiZGltZW5zaW9uIGlzIHRvbyBzbWFsbFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICBwLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gXCJbUHlyYW1pZERpbWVuc2lvbl1cIjtcbiAgICB9O1xuXG4gICAgb2JlbGlzay5QeXJhbWlkRGltZW5zaW9uID0gUHlyYW1pZERpbWVuc2lvbjtcbn0ob2JlbGlzaykpO1xuXG4vKmdsb2JhbCBvYmVsaXNrOnRydWUqL1xuXG4vKlxuICogU2lkZVhEaW1lbnNpb25cbiAqL1xuXG4oZnVuY3Rpb24gKG9iZWxpc2spIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHZhciBTaWRlWERpbWVuc2lvbiwgcDtcbiAgICBTaWRlWERpbWVuc2lvbiA9IGZ1bmN0aW9uICh4QXhpcywgekF4aXMpIHtcbiAgICAgICAgdGhpcy5pbml0aWFsaXplKHhBeGlzLCB6QXhpcyk7XG4gICAgfTtcbiAgICBwID0gU2lkZVhEaW1lbnNpb24ucHJvdG90eXBlID0gbmV3IG9iZWxpc2suQWJzdHJhY3REaW1lbnNpb24oKTtcblxuICAgIC8vIGNvbnN0cnVjdG9yXG4gICAgcC5pbml0aWFsaXplID0gZnVuY3Rpb24gKHhBeGlzLCB6QXhpcykge1xuICAgICAgICB0aGlzLnhBeGlzID0geEF4aXMgfHwgMzA7XG4gICAgICAgIHRoaXMuekF4aXMgPSB6QXhpcyB8fCAzMDtcblxuICAgICAgICBpZiAodGhpcy54QXhpcyAlIDIgPT09IDEpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcInhBeGlzIG11c3QgYmUgZXZlbiBudW1iZXJcIik7XG4gICAgICAgIH1cblxuICAgICAgICAvLyB4QXhpcyB8fCB6QXhpcyA9IDQgZmxvb2RGaWxsIGNvdWxkIG5vdCBiZSBhcHBsaWVkXG4gICAgICAgIGlmICh0aGlzLnhBeGlzIDw9IDQgfHwgdGhpcy56QXhpcyA8PSAyKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJkaW1lbnNpb24gaXMgdG9vIHNtYWxsXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIHAudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBcIltTaWRlWERpbWVuc2lvbl1cIjtcbiAgICB9O1xuXG4gICAgb2JlbGlzay5TaWRlWERpbWVuc2lvbiA9IFNpZGVYRGltZW5zaW9uO1xufShvYmVsaXNrKSk7XG5cbi8qZ2xvYmFsIG9iZWxpc2s6dHJ1ZSovXG5cbi8qXG4gKiBTaWRlWURpbWVuc2lvblxuICovXG5cbihmdW5jdGlvbiAob2JlbGlzaykge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgdmFyIFNpZGVZRGltZW5zaW9uLCBwO1xuXG4gICAgU2lkZVlEaW1lbnNpb24gPSBmdW5jdGlvbiAoeUF4aXMsIHpBeGlzKSB7XG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZSh5QXhpcywgekF4aXMpO1xuICAgIH07XG4gICAgcCA9IFNpZGVZRGltZW5zaW9uLnByb3RvdHlwZSA9IG5ldyBvYmVsaXNrLkFic3RyYWN0RGltZW5zaW9uKCk7XG5cbiAgICAvLyBjb25zdHJ1Y3RvclxuICAgIHAuaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uICh5QXhpcywgekF4aXMpIHtcbiAgICAgICAgdGhpcy55QXhpcyA9IHlBeGlzIHx8IDMwO1xuICAgICAgICB0aGlzLnpBeGlzID0gekF4aXMgfHwgMzA7XG5cbiAgICAgICAgaWYgKHRoaXMueUF4aXMgJSAyID09PSAxKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJ5QXhpcyBtdXN0IGJlIGV2ZW4gbnVtYmVyXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8geUF4aXMgfHwgekF4aXMgPSA0IGZsb29kRmlsbCBjb3VsZCBub3QgYmUgYXBwbGllZFxuICAgICAgICBpZiAodGhpcy55QXhpcyA8PSA0IHx8IHRoaXMuekF4aXMgPD0gMikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiZGltZW5zaW9uIGlzIHRvbyBzbWFsbFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICBwLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gXCJbU2lkZVlEaW1lbnNpb25dXCI7XG4gICAgfTtcblxuICAgIG9iZWxpc2suU2lkZVlEaW1lbnNpb24gPSBTaWRlWURpbWVuc2lvbjtcbn0ob2JlbGlzaykpO1xuXG4vKmdsb2JhbCBvYmVsaXNrOnRydWUqL1xuXG4vKlxuICogU2xvcGVEaW1lbnNpb25cbiAqL1xuXG4oZnVuY3Rpb24gKG9iZWxpc2spIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHZhciBTbG9wZURpbWVuc2lvbiwgcDtcbiAgICBTbG9wZURpbWVuc2lvbiA9IGZ1bmN0aW9uICh4QXhpcywgeUF4aXMpIHtcbiAgICAgICAgdGhpcy5pbml0aWFsaXplKHhBeGlzLCB5QXhpcyk7XG4gICAgfTtcbiAgICBwID0gU2xvcGVEaW1lbnNpb24ucHJvdG90eXBlID0gbmV3IG9iZWxpc2suQWJzdHJhY3REaW1lbnNpb24oKTtcblxuICAgIC8vIGNvbnN0cnVjdG9yXG4gICAgcC5pbml0aWFsaXplID0gZnVuY3Rpb24gKHhBeGlzLCB5QXhpcykge1xuICAgICAgICB0aGlzLnhBeGlzID0geEF4aXMgfHwgMzA7XG4gICAgICAgIHRoaXMueUF4aXMgPSB5QXhpcyB8fCAzMDtcblxuICAgICAgICBpZiAodGhpcy54QXhpcyAlIDIgPT09IDEgfHwgdGhpcy55QXhpcyAlIDIgPT09IDEpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcInhBeGlzIGFuZCB5QXhpcyBtdXN0IGJlIGV2ZW4gbnVtYmVyXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMueEF4aXMgPD0gNCB8fCB0aGlzLnlBeGlzIDw9IDQpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcImRpbWVuc2lvbiBpcyB0b28gc21hbGxcIik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgcC50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIFwiW1Nsb3BlRGltZW5zaW9uXVwiO1xuICAgIH07XG5cbiAgICBvYmVsaXNrLlNsb3BlRGltZW5zaW9uID0gU2xvcGVEaW1lbnNpb247XG59KG9iZWxpc2spKTtcblxuLypnbG9iYWwgb2JlbGlzazp0cnVlKi9cblxuLypcbiAqIEJpdG1hcERhdGFcbiAqL1xuXG4oZnVuY3Rpb24gKG9iZWxpc2spIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHZhciBCaXRtYXBEYXRhLCBwO1xuICAgIEJpdG1hcERhdGEgPSBmdW5jdGlvbiAodywgaCwgdXNlRGVmYXVsdENhbnZhcykge1xuICAgICAgICB0aGlzLmluaXRpYWxpemUodywgaCwgdXNlRGVmYXVsdENhbnZhcyk7XG4gICAgfTtcbiAgICBwID0gQml0bWFwRGF0YS5wcm90b3R5cGU7XG5cbiAgICAvLyBwdWJsaWMgcHJvcGVydHlcbiAgICBwLmltYWdlRGF0YSA9IG51bGw7XG4gICAgcC5jYW52YXMgPSBudWxsO1xuICAgIHAuY29udGV4dCA9IG51bGw7XG5cbiAgICAvLyBjb25zdHJ1Y3RvclxuICAgIHAuaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uICh3LCBoLCB1c2VEZWZhdWx0Q2FudmFzKSB7XG4gICAgICAgIGlmICh3ID09PSB1bmRlZmluZWQgfHwgaCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJCaXRtYXBEYXRhIHdpZHRoIG9yIGhlaWdodCBpcyBtaXNzaW5nXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHVzZURlZmF1bHRDYW52YXMpIHtcbiAgICAgICAgICAgIHRoaXMuY2FudmFzID0gb2JlbGlzay5DYW52YXNNYW5hZ2VyLmdldERlZmF1bHRDYW52YXMoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY2FudmFzID0gb2JlbGlzay5DYW52YXNNYW5hZ2VyLmdldE5ld0NhbnZhcygpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jYW52YXMuc2V0QXR0cmlidXRlKCd3aWR0aCcsIHcpO1xuICAgICAgICB0aGlzLmNhbnZhcy5zZXRBdHRyaWJ1dGUoJ2hlaWdodCcsIGgpO1xuXG4gICAgICAgIHRoaXMuY29udGV4dCA9IHRoaXMuY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gICAgICAgIHRoaXMuY29udGV4dC5jbGVhclJlY3QoMCwgMCwgdGhpcy5jYW52YXMud2lkdGgsIHRoaXMuY2FudmFzLmhlaWdodCk7XG5cbiAgICAgICAgdGhpcy5pbWFnZURhdGEgPSB0aGlzLmNvbnRleHQuY3JlYXRlSW1hZ2VEYXRhKHcsIGgpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICBwLnNldFBpeGVsID0gZnVuY3Rpb24gKHBvc1gsIHBvc1ksIGNvbG9yKSB7XG4gICAgICAgIHZhciBpbmRleCA9IChwb3NZICogdGhpcy5pbWFnZURhdGEud2lkdGggKyBwb3NYKSAqIDQ7XG4gICAgICAgIHRoaXMuc2V0UGl4ZWxCeUluZGV4KGluZGV4LCBjb2xvcik7XG4gICAgfTtcblxuICAgIHAuc2V0UGl4ZWxCeUluZGV4ID0gZnVuY3Rpb24gKGluZGV4LCBjb2xvcikge1xuICAgICAgICB2YXIgcGl4ZWxzID0gdGhpcy5pbWFnZURhdGEuZGF0YTtcbiAgICAgICAgcGl4ZWxzW2luZGV4XSA9IChjb2xvciA+Pj4gMTYpICYgMHhGRjtcbiAgICAgICAgcGl4ZWxzW2luZGV4ICsgMV0gPSAoY29sb3IgPj4+IDgpICYgMHhGRjtcbiAgICAgICAgcGl4ZWxzW2luZGV4ICsgMl0gPSAoY29sb3IgPj4+IDApICYgMHhGRjtcbiAgICAgICAgcGl4ZWxzW2luZGV4ICsgM10gPSAoY29sb3IgPj4+IDI0KSAmIDB4RkY7XG4gICAgfTtcblxuICAgIHAuY2hlY2tQaXhlbEF2YWlsYWJsZSA9IGZ1bmN0aW9uICh4LCB5KSB7XG4gICAgICAgIHZhciBpbmRleCA9ICh5ICogdGhpcy5pbWFnZURhdGEud2lkdGggKyB4KSAqIDQ7XG4gICAgICAgIHJldHVybiB0aGlzLmltYWdlRGF0YS5kYXRhW2luZGV4ICsgM10gPT09IDA7XG4gICAgfTtcblxuICAgIHAuZmxvb2RGaWxsID0gZnVuY3Rpb24gKHBvc1gsIHBvc1ksIGNvbG9yKSB7XG4gICAgICAgIGlmICgoKGNvbG9yID4+PiAyNCkgJiAweEZGKSA9PT0gMHgwMCkge1xuICAgICAgICAgICAgLy8gdHJhbnNwYXJlbnQgZmxvb2QgZmlsbFxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHggPSBwb3NYLCB5ID0gcG9zWSxcbiAgICAgICAgICAgIHN0YWNrID0gW10sXG4gICAgICAgICAgICBub3dDb2wgPSBbXSxcbiAgICAgICAgICAgIHByZXZDb2wgPSBbXSxcbiAgICAgICAgICAgIGNvbCwgcm93LCBtYXRjaEZsYWcsIG5ld1N0YXJ0LFxuICAgICAgICAgICAgdyA9IHRoaXMuaW1hZ2VEYXRhLndpZHRoLFxuICAgICAgICAgICAgaCA9IHRoaXMuaW1hZ2VEYXRhLmhlaWdodCxcbiAgICAgICAgICAgIGksIGo7XG5cbiAgICAgICAgLy8gYm91bmQgcmVhY2hcbiAgICAgICAgaWYgKHggPCAwIHx8IHkgPCAwIHx8IHggPj0gdyB8fCB5ID49IGgpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGZpcnN0IHBvaW50IGNoZWNrIGZhaWxcbiAgICAgICAgaWYgKCF0aGlzLmNoZWNrUGl4ZWxBdmFpbGFibGUoeCwgeSkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlN0YXJ0IHBvaW50IGZvciBmbG9vZCBmaWxsIGlzIGFscmVhZHkgZmlsbGVkXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gbGVmdCBzaWRlIGZsb29kIGZpbGxcbiAgICAgICAgZm9yIChjb2wgPSB4OyBjb2wgPj0gMDsgY29sIC09IDEpIHtcbiAgICAgICAgICAgIC8vIHRvcCBzaWRlXG4gICAgICAgICAgICBmb3IgKHJvdyA9IHk7IHJvdyA+PSAwOyByb3cgLT0gMSkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoZWNrUGl4ZWxBdmFpbGFibGUoY29sLCByb3cpKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGF2YWlsYWJsZSBwaXhlbFxuICAgICAgICAgICAgICAgICAgICBzdGFjay5wdXNoKChyb3cgKiB3ICsgY29sKSAqIDQpO1xuICAgICAgICAgICAgICAgICAgICBub3dDb2wucHVzaChyb3cpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGZpcnN0IG9uZSBpcyBpbnZhbGlkIHBpeGVsICYmIG5vdCBhdCBjb2wgdG9wXG4gICAgICAgICAgICAgICAgICAgIGlmIChyb3cgPT09IHkgJiYgdGhpcy5jaGVja1BpeGVsQXZhaWxhYmxlKGNvbCArIDEsIHJvdyAtIDEpKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIG5leHQgb25lIGlzIHZhbGlkXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jaGVja1BpeGVsQXZhaWxhYmxlKGNvbCwgcm93IC0gMSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdTdGFydCA9IHJvdyAtIDE7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoZWNrUGl4ZWxBdmFpbGFibGUoY29sICsgMSwgcm93IC0gMikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3U3RhcnQgPSByb3cgLSAyO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGZhaWwsIGFzc2lnbiBtYXggdmFsdWUgdG8gYXZvaWQgbG9vcCBiZWxvd1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdTdGFydCA9IC0xO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChyb3cgPSBuZXdTdGFydDsgcm93ID49IDA7IHJvdyAtPSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY2hlY2tQaXhlbEF2YWlsYWJsZShjb2wsIHJvdykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYXZhaWxhYmxlIHBpeGVsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YWNrLnB1c2goKHJvdyAqIHcgKyBjb2wpICogNCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vd0NvbC5wdXNoKHJvdyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgIC8vIGJvdHRvbSBzaWRlXG4gICAgICAgICAgICBmb3IgKHJvdyA9IHk7IHJvdyA8IGg7IHJvdyArPSAxKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY2hlY2tQaXhlbEF2YWlsYWJsZShjb2wsIHJvdykpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gYXZhaWxhYmxlIHBpeGVsXG4gICAgICAgICAgICAgICAgICAgIHN0YWNrLnB1c2goKHJvdyAqIHcgKyBjb2wpICogNCk7XG4gICAgICAgICAgICAgICAgICAgIG5vd0NvbC5wdXNoKHJvdyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gZmlyc3Qgb25lIGlzIGludmFsaWQgcGl4ZWwgJiYgbm90IGF0IGNvbCBib3R0b21cbiAgICAgICAgICAgICAgICAgICAgaWYgKHJvdyA9PT0geSAmJiB0aGlzLmNoZWNrUGl4ZWxBdmFpbGFibGUoY29sICsgMSwgcm93ICsgMSkpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gbmV4dCBvbmUgaXMgdmFsaWRcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoZWNrUGl4ZWxBdmFpbGFibGUoY29sLCByb3cgKyAxKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld1N0YXJ0ID0gcm93ICsgMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY2hlY2tQaXhlbEF2YWlsYWJsZShjb2wgKyAxLCByb3cgKyAyKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdTdGFydCA9IHJvdyArIDI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZmFpbCwgYXNzaWduIG1heCB2YWx1ZSB0byBhdm9pZCBsb29wIGJlbG93XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld1N0YXJ0ID0gaDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAocm93ID0gbmV3U3RhcnQ7IHJvdyA8IGg7IHJvdyArPSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY2hlY2tQaXhlbEF2YWlsYWJsZShjb2wsIHJvdykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYXZhaWxhYmxlIHBpeGVsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YWNrLnB1c2goKHJvdyAqIHcgKyBjb2wpICogNCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vd0NvbC5wdXNoKHJvdyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBjb21wYXJlIHdpdGggcHJldmlvdXMgY29sdW1uXG4gICAgICAgICAgICAvLyBmb3IgZmlyc3QgY29sdW1uXG4gICAgICAgICAgICAvLyB0aGUgZ2l2ZW4gcG9pbnQgc2hvdWxkIGJlIGluc2lkZSB0aGUgY29udGFpbmVyXG4gICAgICAgICAgICBpZiAoY29sID09PSB4KSB7XG4gICAgICAgICAgICAgICAgcHJldkNvbCA9IG5vd0NvbC5jb25jYXQoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbWF0Y2hGbGFnID0gZmFsc2U7XG5cbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBwcmV2Q29sLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICAgICAgZm9yIChqID0gMDsgaiA8IHByZXZDb2wubGVuZ3RoOyBqICs9IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5vd0NvbFtqXSA9PT0gcHJldkNvbFtpXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWF0Y2hGbGFnID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHkgPSBwcmV2Q29sW2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAobWF0Y2hGbGFnKSB7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG1hdGNoRmxhZykge1xuICAgICAgICAgICAgICAgIHByZXZDb2wgPSBub3dDb2wuY29uY2F0KCk7XG4gICAgICAgICAgICAgICAgbm93Q29sID0gW107XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIGJvdW5kIHJlYWNoXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyByZXNldCBzdGFydCBwb2ludFxuICAgICAgICB4ID0gcG9zWDtcbiAgICAgICAgeSA9IHBvc1k7XG4gICAgICAgIHByZXZDb2wgPSBbXTtcbiAgICAgICAgbm93Q29sID0gW107XG5cbiAgICAgICAgLy8gcmlnaHQgc2lkZSBmbG9vZCBmaWxsXG4gICAgICAgIGZvciAoY29sID0geDsgY29sIDwgdzsgY29sICs9IDEpIHtcblxuICAgICAgICAgICAgLy8gdG9wIHNpZGVcbiAgICAgICAgICAgIGZvciAocm93ID0geTsgcm93ID49IDA7IHJvdyAtPSAxKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY2hlY2tQaXhlbEF2YWlsYWJsZShjb2wsIHJvdykpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gYXZhaWxhYmxlIHBpeGVsXG4gICAgICAgICAgICAgICAgICAgIHN0YWNrLnB1c2goKHJvdyAqIHcgKyBjb2wpICogNCk7XG4gICAgICAgICAgICAgICAgICAgIG5vd0NvbC5wdXNoKHJvdyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gZmlyc3Qgb25lIGlzIGludmFsaWQgcGl4ZWwgJiYgbm90IGF0IGNvbCB0b3BcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJvdyA9PT0geSAmJiB0aGlzLmNoZWNrUGl4ZWxBdmFpbGFibGUoY29sIC0gMSwgcm93IC0gMSkpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gbmV4dCBvbmUgaXMgdmFsaWRcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoZWNrUGl4ZWxBdmFpbGFibGUoY29sLCByb3cgLSAxKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld1N0YXJ0ID0gcm93IC0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY2hlY2tQaXhlbEF2YWlsYWJsZShjb2wgLSAxLCByb3cgLSAyKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdTdGFydCA9IHJvdyAtIDI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZmFpbCwgYXNzaWduIG1heCB2YWx1ZSB0byBhdm9pZCBsb29wIGJlbG93XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld1N0YXJ0ID0gLTE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHJvdyA9IG5ld1N0YXJ0OyByb3cgPj0gMDsgcm93IC09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jaGVja1BpeGVsQXZhaWxhYmxlKGNvbCwgcm93KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhdmFpbGFibGUgcGl4ZWxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhY2sucHVzaCgocm93ICogdyArIGNvbCkgKiA0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm93Q29sLnB1c2gocm93KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGJvdHRvbSBzaWRlXG4gICAgICAgICAgICBmb3IgKHJvdyA9IHk7IHJvdyA8IGg7IHJvdyArPSAxKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY2hlY2tQaXhlbEF2YWlsYWJsZShjb2wsIHJvdykpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gYXZhaWxhYmxlIHBpeGVsXG4gICAgICAgICAgICAgICAgICAgIHN0YWNrLnB1c2goKHJvdyAqIHcgKyBjb2wpICogNCk7XG4gICAgICAgICAgICAgICAgICAgIG5vd0NvbC5wdXNoKHJvdyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gZmlyc3Qgb25lIGlzIGludmFsaWQgcGl4ZWwgJiYgbm90IGF0IGNvbCBib3R0b21cbiAgICAgICAgICAgICAgICAgICAgaWYgKHJvdyA9PT0geSAmJiB0aGlzLmNoZWNrUGl4ZWxBdmFpbGFibGUoY29sIC0gMSwgcm93ICsgMSkpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gbmV4dCBvbmUgaXMgdmFsaWRcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoZWNrUGl4ZWxBdmFpbGFibGUoY29sLCByb3cgKyAxKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld1N0YXJ0ID0gcm93ICsgMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY2hlY2tQaXhlbEF2YWlsYWJsZShjb2wgLSAxLCByb3cgKyAyKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdTdGFydCA9IHJvdyArIDI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZmFpbCwgYXNzaWduIG1heCB2YWx1ZSB0byBhdm9pZCBsb29wIGJlbG93XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld1N0YXJ0ID0gaDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAocm93ID0gbmV3U3RhcnQ7IHJvdyA8IGg7IHJvdyArPSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY2hlY2tQaXhlbEF2YWlsYWJsZShjb2wsIHJvdykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYXZhaWxhYmxlIHBpeGVsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YWNrLnB1c2goKHJvdyAqIHcgKyBjb2wpICogNCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vd0NvbC5wdXNoKHJvdyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBjb21wYXJlIHdpdGggcHJldmlvdXMgY29sdW1uXG4gICAgICAgICAgICAvLyBmb3IgZmlyc3QgY29sdW1uXG4gICAgICAgICAgICAvLyB0aGUgZ2l2ZW4gcG9pbnQgc2hvdWxkIGJlIGluc2lkZSB0aGUgY29udGFpbmVyXG4gICAgICAgICAgICBpZiAoY29sID09PSB4KSB7XG4gICAgICAgICAgICAgICAgcHJldkNvbCA9IG5vd0NvbC5jb25jYXQoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbWF0Y2hGbGFnID0gZmFsc2U7XG5cbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBwcmV2Q29sLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICAgICAgZm9yIChqID0gMDsgaiA8IHByZXZDb2wubGVuZ3RoOyBqICs9IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5vd0NvbFtqXSA9PT0gcHJldkNvbFtpXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWF0Y2hGbGFnID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHkgPSBwcmV2Q29sW2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAobWF0Y2hGbGFnKSB7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG1hdGNoRmxhZykge1xuICAgICAgICAgICAgICAgIHByZXZDb2wgPSBub3dDb2wuY29uY2F0KCk7XG4gICAgICAgICAgICAgICAgbm93Q29sID0gW107XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIGJvdW5kIHJlYWNoXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBmaWxsIGltYWdlIGRhdGFcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IHN0YWNrLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICB0aGlzLnNldFBpeGVsQnlJbmRleChzdGFja1tpXSwgY29sb3IpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIHAudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBcIltCaXRtYXBEYXRhXVwiO1xuICAgIH07XG5cbiAgICBvYmVsaXNrLkJpdG1hcERhdGEgPSBCaXRtYXBEYXRhO1xufShvYmVsaXNrKSk7XG5cbi8qZ2xvYmFsIG9iZWxpc2s6dHJ1ZSovXG5cbi8qXG4gKiBQaXhlbE9iamVjdFxuICovXG5cbihmdW5jdGlvbiAob2JlbGlzaykge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgdmFyIFBpeGVsT2JqZWN0LCBwO1xuICAgIFBpeGVsT2JqZWN0ID0gZnVuY3Rpb24gKHByaW1pdGl2ZSwgcG9pbnQzRCkge1xuICAgICAgICB0aGlzLmluaXRpYWxpemUocHJpbWl0aXZlLCBwb2ludDNEKTtcbiAgICB9O1xuICAgIHAgPSBQaXhlbE9iamVjdC5wcm90b3R5cGU7XG5cbiAgICAvLyBwdWJsaWMgcHJvcGVydGllc1xuICAgIHAueCA9IG51bGw7XG4gICAgcC55ID0gbnVsbDtcbiAgICBwLmNhbnZhcyA9IG51bGw7XG5cbiAgICAvLyBjb25zdHJ1Y3RvclxuICAgIHAuaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uIChwcmltaXRpdmUsIHBvaW50M0QpIHtcbiAgICAgICAgaWYgKCFwcmltaXRpdmUpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlByaW1pdGl2ZSBpcyBub3QgZGVmaW5lZFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBwM0QgPSBwb2ludDNEIHx8IG5ldyBvYmVsaXNrLlBvaW50M0QoKTtcblxuICAgICAgICB0aGlzLmNhbnZhcyA9IHByaW1pdGl2ZS5jYW52YXM7XG4gICAgICAgIHRoaXMueCA9IHByaW1pdGl2ZS5tYXRyaXgudHggKyBwM0QueCAtIHAzRC55O1xuICAgICAgICB0aGlzLnkgPSBwcmltaXRpdmUubWF0cml4LnR5ICsgTWF0aC5mbG9vcihwM0QueCAvIDIgKyBwM0QueSAvIDIpIC0gcDNELno7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIC8vIHB1YmxpYyBtZXRob2RzXG5cbiAgICAvLyB0b2RvOiBhZGQgY2FudmFzIHJlbW92ZSBtZXRob2RcblxuICAgIHAudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBcIltQaXhlbE9iamVjdF1cIjtcbiAgICB9O1xuXG4gICAgLy8gcHJpdmF0ZSBtZXRob2RzXG5cbiAgICBvYmVsaXNrLlBpeGVsT2JqZWN0ID0gUGl4ZWxPYmplY3Q7XG59KG9iZWxpc2spKTtcblxuLypnbG9iYWwgb2JlbGlzazp0cnVlLCBqUXVlcnk6dHJ1ZSovXG5cbi8qXG4gKiBQaXhlbFZpZXdcbiAqL1xuXG4oZnVuY3Rpb24gKG9iZWxpc2spIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHZhciBQaXhlbFZpZXcsIHA7XG4gICAgUGl4ZWxWaWV3ID0gZnVuY3Rpb24gKGNhbnZhcywgcG9pbnQpIHtcbiAgICAgICAgdGhpcy5pbml0aWFsaXplKGNhbnZhcywgcG9pbnQpO1xuICAgIH07XG4gICAgcCA9IFBpeGVsVmlldy5wcm90b3R5cGU7XG5cbiAgICAvLyBwdWJsaWMgcHJvcGVydGllc1xuICAgIHAuY2FudmFzID0gbnVsbDtcbiAgICBwLmNvbnRleHQgPSBudWxsO1xuICAgIHAucG9pbnQgPSBudWxsO1xuXG4gICAgLy8gY29uc3RydWN0b3JcbiAgICBwLmluaXRpYWxpemUgPSBmdW5jdGlvbiAoY2FudmFzLCBwb2ludCkge1xuICAgICAgICBpZiAoIWNhbnZhcykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2FudmFzIGlzIG5vdCBkZWZpbmVkXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlmIChjYW52YXMgaW5zdGFuY2VvZiBqUXVlcnkpIHtcbiAgICAgICAgICAgICAgICBjYW52YXMgPSBjYW52YXMuZ2V0KDApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNhbnZhcyA9IGNhbnZhcztcbiAgICAgICAgdGhpcy5jb250ZXh0ID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICAgICAgdGhpcy5wb2ludCA9IHBvaW50IHx8IG5ldyBvYmVsaXNrLlBvaW50KDAsIDApO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICAvLyBwdWJsaWMgbWV0aG9kc1xuICAgIHAucmVuZGVyT2JqZWN0ID0gZnVuY3Rpb24gKHByaW1pdGl2ZSwgcG9pbnQzRCkge1xuICAgICAgICB2YXIgcG8gPSBuZXcgb2JlbGlzay5QaXhlbE9iamVjdChwcmltaXRpdmUsIHBvaW50M0QpO1xuICAgICAgICB0aGlzLmNvbnRleHQuZHJhd0ltYWdlKHBvLmNhbnZhcywgdGhpcy5wb2ludC54ICsgcG8ueCwgdGhpcy5wb2ludC55ICsgcG8ueSk7XG4gICAgfTtcblxuICAgIHAuY2xlYXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuY29udGV4dC5jbGVhclJlY3QoMCwgMCwgdGhpcy5jYW52YXMud2lkdGgsIHRoaXMuY2FudmFzLmhlaWdodCk7XG4gICAgfTtcblxuICAgIHAudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBcIltQaXhlbFZpZXddXCI7XG4gICAgfTtcblxuICAgIG9iZWxpc2suUGl4ZWxWaWV3ID0gUGl4ZWxWaWV3O1xufShvYmVsaXNrKSk7XG5cbi8qZ2xvYmFsIG9iZWxpc2s6dHJ1ZSovXG5cbi8qXG4gKiBNYXRyaXhcbiAqL1xuXG4oZnVuY3Rpb24gKG9iZWxpc2spIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHZhciBNYXRyaXgsIHA7XG4gICAgTWF0cml4ID0gZnVuY3Rpb24gKGEsIGIsIGMsIGQsIHR4LCB0eSkge1xuICAgICAgICB0aGlzLmluaXRpYWxpemUoYSwgYiwgYywgZCwgdHgsIHR5KTtcbiAgICB9O1xuICAgIHAgPSBNYXRyaXgucHJvdG90eXBlO1xuXG4gICAgLy8gcHVibGljIHByb3BlcnRpZXM6XG4gICAgLyoqXG4gICAgICogUG9zaXRpb24gKDAsIDApIGluIGEgM3gzIG1hdHJpeC5cbiAgICAgKiBAcHJvcGVydHkgYVxuICAgICAqIEB0eXBlIE51bWJlclxuICAgICAqKi9cbiAgICBwLmEgPSAxO1xuXG4gICAgLyoqXG4gICAgICogUG9zaXRpb24gKDAsIDEpIGluIGEgM3gzIG1hdHJpeC5cbiAgICAgKiBAcHJvcGVydHkgYlxuICAgICAqIEB0eXBlIE51bWJlclxuICAgICAqKi9cbiAgICBwLmIgPSAwO1xuXG4gICAgLyoqXG4gICAgICogUG9zaXRpb24gKDEsIDApIGluIGEgM3gzIG1hdHJpeC5cbiAgICAgKiBAcHJvcGVydHkgY1xuICAgICAqIEB0eXBlIE51bWJlclxuICAgICAqKi9cbiAgICBwLmMgPSAwO1xuXG4gICAgLyoqXG4gICAgICogUG9zaXRpb24gKDEsIDEpIGluIGEgM3gzIG1hdHJpeC5cbiAgICAgKiBAcHJvcGVydHkgZFxuICAgICAqIEB0eXBlIE51bWJlclxuICAgICAqKi9cbiAgICBwLmQgPSAxO1xuXG4gICAgLyoqXG4gICAgICogUG9zaXRpb24gKDIsIDApIGluIGEgM3gzIG1hdHJpeC5cbiAgICAgKiBAcHJvcGVydHkgdHhcbiAgICAgKiBAdHlwZSBOdW1iZXJcbiAgICAgKiovXG4gICAgcC50eCA9IDA7XG5cbiAgICAvKipcbiAgICAgKiBQb3NpdGlvbiAoMiwgMSkgaW4gYSAzeDMgbWF0cml4LlxuICAgICAqIEBwcm9wZXJ0eSB0eVxuICAgICAqIEB0eXBlIE51bWJlclxuICAgICAqKi9cbiAgICBwLnR5ID0gMDtcblxuICAgIC8vIGNvbnN0cnVjdG9yXG4gICAgcC5pbml0aWFsaXplID0gZnVuY3Rpb24gKGEsIGIsIGMsIGQsIHR4LCB0eSkge1xuICAgICAgICB0aGlzLmEgPSAoYSA9PT0gdW5kZWZpbmVkKSA/IDEgOiBhO1xuICAgICAgICB0aGlzLmIgPSBiIHx8IDA7XG4gICAgICAgIHRoaXMuYyA9IGMgfHwgMDtcbiAgICAgICAgdGhpcy5kID0gKGQgPT09IHVuZGVmaW5lZCkgPyAxIDogZDtcbiAgICAgICAgdGhpcy50eCA9IHR4IHx8IDA7XG4gICAgICAgIHRoaXMudHkgPSB0eSB8fCAwO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgLy8gcHVibGljIG1ldGhvZHNcbiAgICBwLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gXCJbTWF0cml4XVwiO1xuICAgIH07XG5cbiAgICBvYmVsaXNrLk1hdHJpeCA9IE1hdHJpeDtcbn0ob2JlbGlzaykpO1xuXG4vKmdsb2JhbCBvYmVsaXNrOnRydWUqL1xuXG4vKlxuICogUG9pbnRcbiAqL1xuXG4oZnVuY3Rpb24gKG9iZWxpc2spIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHZhciBQb2ludCwgcDtcbiAgICBQb2ludCA9IGZ1bmN0aW9uICh4LCB5KSB7XG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZSh4LCB5KTtcbiAgICB9O1xuICAgIHAgPSBQb2ludC5wcm90b3R5cGU7XG5cbiAgICAvLyBwdWJsaWMgcHJvcGVydGllc1xuICAgIHAueCA9IDA7XG4gICAgcC55ID0gMDtcblxuICAgIC8vIGNvbnN0cnVjdG9yXG4gICAgcC5pbml0aWFsaXplID0gZnVuY3Rpb24gKHgsIHkpIHtcbiAgICAgICAgdGhpcy54ID0gKHggPT09IHVuZGVmaW5lZCA/IDAgOiB4KTtcbiAgICAgICAgdGhpcy55ID0gKHkgPT09IHVuZGVmaW5lZCA/IDAgOiB5KTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIC8vIHB1YmxpYyBtZXRob2RzXG4gICAgcC50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIFwiW1BvaW50IHggOiBcIiArIHRoaXMueCArIFwiLCB5IDogXCIgKyB0aGlzLnkgKyBcIl1cIjtcbiAgICB9O1xuXG4gICAgLy8gcHJpdmF0ZSBtZXRob2RzXG5cbiAgICBvYmVsaXNrLlBvaW50ID0gUG9pbnQ7XG59KG9iZWxpc2spKTtcblxuLypnbG9iYWwgb2JlbGlzazp0cnVlKi9cblxuLypcbiAqIFBvaW50M0RcbiAqL1xuXG4oZnVuY3Rpb24gKG9iZWxpc2spIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHZhciBQb2ludDNELCBwO1xuICAgIFBvaW50M0QgPSBmdW5jdGlvbiAoeCwgeSwgeikge1xuICAgICAgICB0aGlzLmluaXRpYWxpemUoeCwgeSwgeik7XG4gICAgfTtcbiAgICBwID0gUG9pbnQzRC5wcm90b3R5cGU7XG5cbiAgICAvLyBwdWJsaWMgcHJvcGVydGllc1xuICAgIHAueCA9IDA7XG4gICAgcC55ID0gMDtcbiAgICBwLnogPSAwO1xuXG4gICAgLy8gY29uc3RydWN0b3JcbiAgICBwLmluaXRpYWxpemUgPSBmdW5jdGlvbiAoeCwgeSwgeikge1xuICAgICAgICB0aGlzLnggPSAoeCA9PT0gdW5kZWZpbmVkID8gMCA6IHgpO1xuICAgICAgICB0aGlzLnkgPSAoeSA9PT0gdW5kZWZpbmVkID8gMCA6IHkpO1xuICAgICAgICB0aGlzLnogPSAoeiA9PT0gdW5kZWZpbmVkID8gMCA6IHopO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgLy8gcHVibGljIG1ldGhvZHNcbiAgICBwLnRvR2xvYmFsQ29vcmRpbmF0ZXMgPSBmdW5jdGlvbiAob2Zmc2V0KSB7XG4gICAgICAgIHZhciBwMkQgPSBuZXcgb2JlbGlzay5Qb2ludChcbiAgICAgICAgICAgIHRoaXMueCAtIHRoaXMueSxcbiAgICAgICAgICAgIE1hdGguZmxvb3IodGhpcy54IC8gMiArIHRoaXMueSAvIDIpIC0gdGhpcy56XG4gICAgICAgICk7XG5cbiAgICAgICAgaWYgKG9mZnNldCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBwMkQueCA9IHAyRC54ICsgb2Zmc2V0Lng7XG4gICAgICAgICAgICBwMkQueSA9IHAyRC55ICsgb2Zmc2V0Lnk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcDJEO1xuICAgIH07XG5cbiAgICBwLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gXCJbUG9pbnQzRCB4IDogXCIgKyB0aGlzLnggKyBcIiwgeSA6IFwiICsgdGhpcy55ICsgXCIsIHo6IFwiICsgdGhpcy56ICsgXCJdXCI7XG4gICAgfTtcblxuICAgIC8vIHByaXZhdGUgbWV0aG9kc1xuXG4gICAgb2JlbGlzay5Qb2ludDNEID0gUG9pbnQzRDtcbn0ob2JlbGlzaykpO1xuXG4vKmdsb2JhbCBvYmVsaXNrOnRydWUqL1xuXG4vKlxuICogQWJzdHJhY3RQcmltaXRpdmVcbiAqL1xuXG4oZnVuY3Rpb24gKG9iZWxpc2spIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHZhciBBYnN0cmFjdFByaW1pdGl2ZSwgcDtcbiAgICBBYnN0cmFjdFByaW1pdGl2ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5pbml0aWFsaXplKCk7XG4gICAgfTtcbiAgICBwID0gQWJzdHJhY3RQcmltaXRpdmUucHJvdG90eXBlO1xuXG4gICAgLy8gcHVibGljIHByb3BlcnRpZXNcbiAgICAvKipcbiAgICAgKiB0aGUgY2FudmFzIGZvciBkcmF3SW1hZ2UgdG8gYW55IGNhbnZhc1xuICAgICAqL1xuICAgIHAuY2FudmFzID0gbnVsbDtcblxuICAgIC8vIHByb3RlY3QgcHJvcGVydGllc1xuICAgIC8qKlxuICAgICAqIHRoZSB3aWR0aCBvZiB0aGUgYml0bWFwIGluIDJkIGZsYXNoIGNvb3JkaW5hdGVcbiAgICAgKi9cbiAgICBwLncgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogdGhlIGhlaWdodCBvZiB0aGUgYml0bWFwIGluIDJkIGZsYXNoIGNvb3JkaW5hdGVcbiAgICAgKi9cbiAgICBwLmggPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogdGhlIGRpbWVuc2lvbiBvZiBwcmltaXRpdmUgaW4gM2QgcGl4ZWwgY29vcmRpbmF0ZVxuICAgICAqL1xuICAgIHAuZGltZW5zaW9uID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIHRoZSBjb2xvciBvYmogb2YgdGhlIHByaW1pdGl2ZVxuICAgICAqL1xuICAgIHAuY29sb3IgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogdGhlIGJvcmRlciBvcHRpb24gb2YgdGhlIHByaW1pdGl2ZVxuICAgICAqL1xuICAgIHAuYm9yZGVyID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIHRoZSBzb3VyY2UgYml0bWFwZGF0YSBjb250YWlucyBwaXhlbCBncmFwaGljXG4gICAgICovXG4gICAgcC5iaXRtYXBEYXRhID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIHRoZSBwcmVzZXJ2ZSBjYW52YXMgb3B0aW9uXG4gICAgICovXG4gICAgcC51c2VEZWZhdWx0Q2FudmFzID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIHRoZSBtYXRyaXggb2Zmc2V0IGJldHdlZW4gdGhlIGJpdG1hcCBhbmQgdGhlIDNkIHBpeGVsIGNvb3JkaW5hdGUgWkVSTyBwb2ludFxuICAgICAqL1xuICAgIHAubWF0cml4ID0gbnVsbDtcblxuICAgIC8vIGNvbnN0cnVjdG9yXG4gICAgcC5pbml0aWFsaXplID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgLy8gcHVibGljIG1ldGhvZHNcbiAgICBwLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gXCJbQWJzdHJhY3RQcmltaXRpdmVdXCI7XG4gICAgfTtcblxuICAgIC8vIHByaXZhdGUgbWV0aG9kc1xuXG4gICAgb2JlbGlzay5BYnN0cmFjdFByaW1pdGl2ZSA9IEFic3RyYWN0UHJpbWl0aXZlO1xufShvYmVsaXNrKSk7XG5cbi8qZ2xvYmFsIG9iZWxpc2s6dHJ1ZSovXG5cbi8qXG4gKiBCcmlja1xuICovXG5cbihmdW5jdGlvbiAob2JlbGlzaykge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgdmFyIEJyaWNrLCBwO1xuICAgIEJyaWNrID0gZnVuY3Rpb24gKGRpbWVuc2lvbiwgY29sb3IsIGJvcmRlciwgdXNlRGVmYXVsdENhbnZhcykge1xuICAgICAgICB0aGlzLmluaXRpYWxpemUoZGltZW5zaW9uLCBjb2xvciwgYm9yZGVyLCB1c2VEZWZhdWx0Q2FudmFzKTtcbiAgICB9O1xuICAgIHAgPSBCcmljay5wcm90b3R5cGUgPSBuZXcgb2JlbGlzay5BYnN0cmFjdFByaW1pdGl2ZSgpO1xuXG4gICAgLy8gcHVibGljIHByb3BlcnRpZXNcblxuICAgIC8vIGNvbnN0cnVjdG9yXG4gICAgcC5pbml0aWFsaXplID0gZnVuY3Rpb24gKGRpbWVuc2lvbiwgY29sb3IsIGJvcmRlciwgdXNlRGVmYXVsdENhbnZhcykge1xuICAgICAgICB0aGlzLmluaXRSZW5kZXIoZGltZW5zaW9uLCBjb2xvciwgYm9yZGVyLCB1c2VEZWZhdWx0Q2FudmFzKTtcbiAgICAgICAgdGhpcy5pbml0UmVjdGFuZ2xlKCk7XG4gICAgICAgIHRoaXMuaW5pdEJpdG1hcERhdGEoKTtcbiAgICAgICAgdGhpcy5idWlsZCgpO1xuICAgICAgICB0aGlzLnJlbmRlckJpdG1hcERhdGFGb3JDYW52YXMoKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIC8vIHByaXZhdGUgbWV0aG9kXG4gICAgcC5pbml0UmVuZGVyID0gZnVuY3Rpb24gKGRpbWVuc2lvbiwgY29sb3IsIGJvcmRlciwgdXNlRGVmYXVsdENhbnZhcykge1xuICAgICAgICB0aGlzLnVzZURlZmF1bHRDYW52YXMgPSB1c2VEZWZhdWx0Q2FudmFzIHx8IGZhbHNlO1xuICAgICAgICB0aGlzLmJvcmRlciA9IGJvcmRlciB8fCBib3JkZXIgPT09IHVuZGVmaW5lZDtcbiAgICAgICAgdGhpcy5kaW1lbnNpb24gPSBkaW1lbnNpb24gPT09IHVuZGVmaW5lZCA/IG5ldyBvYmVsaXNrLkJyaWNrRGltZW5zaW9uKCkgOiBkaW1lbnNpb247XG4gICAgICAgIHRoaXMuY29sb3IgPSBjb2xvciA9PT0gdW5kZWZpbmVkID8gbmV3IG9iZWxpc2suU2lkZUNvbG9yKCkgOiBjb2xvcjtcbiAgICB9O1xuXG4gICAgcC5pbml0UmVjdGFuZ2xlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLncgPSB0aGlzLmRpbWVuc2lvbi54QXhpcyArIHRoaXMuZGltZW5zaW9uLnlBeGlzO1xuICAgICAgICB0aGlzLmggPSAodGhpcy5kaW1lbnNpb24ueEF4aXMgKyB0aGlzLmRpbWVuc2lvbi55QXhpcykgLyAyO1xuXG4gICAgICAgIC8vIDIyLjYgZGVncmVlcyBpbXBsZW1lbnRhdGlvblxuICAgICAgICB0aGlzLncgLT0gMjtcbiAgICAgICAgdGhpcy5oIC09IDE7XG5cbiAgICAgICAgLy8gdGhlIG1hdHJpeCBvZmZzZXQgYmV0d2VlbiB0aGUgYml0bWFwIGFuZCB0aGUgM2QgcGl4ZWwgY29vcmRpbmF0ZSBaRVJPIHBvaW50XG4gICAgICAgIHRoaXMubWF0cml4ID0gbmV3IG9iZWxpc2suTWF0cml4KCk7XG4gICAgICAgIHRoaXMubWF0cml4LnR4ID0gLXRoaXMuZGltZW5zaW9uLnlBeGlzICsgMjtcbiAgICAgICAgdGhpcy5tYXRyaXgudHkgPSAwO1xuICAgIH07XG5cbiAgICBwLmluaXRCaXRtYXBEYXRhID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmJpdG1hcERhdGEgPSBuZXcgb2JlbGlzay5CaXRtYXBEYXRhKHRoaXMudywgdGhpcy5oLCB0aGlzLnVzZURlZmF1bHRDYW52YXMpO1xuICAgIH07XG4gICAgcC5yZW5kZXJCaXRtYXBEYXRhRm9yQ2FudmFzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmJpdG1hcERhdGEuY29udGV4dC5wdXRJbWFnZURhdGEodGhpcy5iaXRtYXBEYXRhLmltYWdlRGF0YSwgMCwgMCk7XG4gICAgICAgIHRoaXMuY2FudmFzID0gdGhpcy5iaXRtYXBEYXRhLmNhbnZhcztcbiAgICB9O1xuXG4gICAgcC5idWlsZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHhPZmZzZXRJbm5lciwgeU9mZnNldElubmVyLCB4T2Zmc2V0T3V0LCB5T2Zmc2V0T3V0LCBpLCBqLCBib3JkZXJDb2xvcjtcbiAgICAgICAgeE9mZnNldElubmVyID0gdGhpcy5kaW1lbnNpb24ueUF4aXMgLSAyO1xuICAgICAgICB5T2Zmc2V0SW5uZXIgPSAwO1xuICAgICAgICB4T2Zmc2V0T3V0ID0gdGhpcy5kaW1lbnNpb24ueEF4aXMgLSAxO1xuICAgICAgICB5T2Zmc2V0T3V0ID0gdGhpcy5oIC0gMTtcbiAgICAgICAgYm9yZGVyQ29sb3IgPSB0aGlzLmJvcmRlciA/IHRoaXMuY29sb3IuYm9yZGVyIDogdGhpcy5jb2xvci5pbm5lcjtcblxuICAgICAgICAvL3ggYXhpc1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5kaW1lbnNpb24ueEF4aXM7IGkgKz0gMSkge1xuICAgICAgICAgICAgdGhpcy5iaXRtYXBEYXRhLnNldFBpeGVsKHhPZmZzZXRJbm5lciArIGksIHlPZmZzZXRJbm5lciArIE1hdGguZmxvb3IoaSAvIDIpLCBib3JkZXJDb2xvcik7XG4gICAgICAgICAgICB0aGlzLmJpdG1hcERhdGEuc2V0UGl4ZWwoeE9mZnNldE91dCAtIGksIHlPZmZzZXRPdXQgLSBNYXRoLmZsb29yKGkgLyAyKSwgYm9yZGVyQ29sb3IpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy95IGF4aXNcbiAgICAgICAgZm9yIChqID0gMDsgaiA8IHRoaXMuZGltZW5zaW9uLnlBeGlzOyBqICs9IDEpIHtcbiAgICAgICAgICAgIHRoaXMuYml0bWFwRGF0YS5zZXRQaXhlbCh4T2Zmc2V0SW5uZXIgKyAxIC0gaiwgeU9mZnNldElubmVyICsgTWF0aC5mbG9vcihqIC8gMiksIGJvcmRlckNvbG9yKTtcbiAgICAgICAgICAgIHRoaXMuYml0bWFwRGF0YS5zZXRQaXhlbCh4T2Zmc2V0T3V0IC0gMSArIGosIHlPZmZzZXRPdXQgLSBNYXRoLmZsb29yKGogLyAyKSwgYm9yZGVyQ29sb3IpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9maWxsIGFuIHBpeGVsIGdyYXBoaWMgZW5jbG9zZWRcbiAgICAgICAgdGhpcy5iaXRtYXBEYXRhLmZsb29kRmlsbChNYXRoLmZsb29yKHRoaXMudyAvIDIpLCBNYXRoLmZsb29yKHRoaXMuaCAvIDIpLCB0aGlzLmNvbG9yLmlubmVyKTtcbiAgICB9O1xuXG4gICAgLy8gcHVibGljIG1ldGhvZHNcbiAgICBwLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gXCJbQnJpY2tdXCI7XG4gICAgfTtcblxuICAgIG9iZWxpc2suQnJpY2sgPSBCcmljaztcbn0ob2JlbGlzaykpO1xuXG4vKmdsb2JhbCBvYmVsaXNrOnRydWUqL1xuXG4vKlxuICogQ3ViZVxuICovXG5cbihmdW5jdGlvbiAob2JlbGlzaykge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgdmFyIEN1YmUsIHA7XG4gICAgQ3ViZSA9IGZ1bmN0aW9uIChkaW1lbnNpb24sIGNvbG9yLCBib3JkZXIsIHVzZURlZmF1bHRDYW52YXMpIHtcbiAgICAgICAgdGhpcy5pbml0aWFsaXplKGRpbWVuc2lvbiwgY29sb3IsIGJvcmRlciwgdXNlRGVmYXVsdENhbnZhcyk7XG4gICAgfTtcbiAgICBwID0gQ3ViZS5wcm90b3R5cGUgPSBuZXcgb2JlbGlzay5BYnN0cmFjdFByaW1pdGl2ZSgpO1xuXG4gICAgLy8gcHVibGljIHByb3BlcnRpZXNcblxuICAgIC8vIGNvbnN0cnVjdG9yXG4gICAgcC5pbml0aWFsaXplID0gZnVuY3Rpb24gKGRpbWVuc2lvbiwgY29sb3IsIGJvcmRlciwgdXNlRGVmYXVsdENhbnZhcykge1xuICAgICAgICB0aGlzLmluaXRSZW5kZXIoZGltZW5zaW9uLCBjb2xvciwgYm9yZGVyLCB1c2VEZWZhdWx0Q2FudmFzKTtcbiAgICAgICAgdGhpcy5pbml0UmVjdGFuZ2xlKCk7XG4gICAgICAgIHRoaXMuaW5pdEJpdG1hcERhdGEoKTtcbiAgICAgICAgdGhpcy5idWlsZCgpO1xuICAgICAgICB0aGlzLnJlbmRlckJpdG1hcERhdGFGb3JDYW52YXMoKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIC8vIHByaXZhdGUgbWV0aG9kXG4gICAgcC5pbml0UmVuZGVyID0gZnVuY3Rpb24gKGRpbWVuc2lvbiwgY29sb3IsIGJvcmRlciwgdXNlRGVmYXVsdENhbnZhcykge1xuICAgICAgICB0aGlzLnVzZURlZmF1bHRDYW52YXMgPSB1c2VEZWZhdWx0Q2FudmFzIHx8IGZhbHNlO1xuICAgICAgICB0aGlzLmJvcmRlciA9IGJvcmRlciB8fCBib3JkZXIgPT09IHVuZGVmaW5lZDtcbiAgICAgICAgdGhpcy5kaW1lbnNpb24gPSBkaW1lbnNpb24gPT09IHVuZGVmaW5lZCA/IG5ldyBvYmVsaXNrLkN1YmVEaW1lbnNpb24oKSA6IGRpbWVuc2lvbjtcbiAgICAgICAgdGhpcy5jb2xvciA9IGNvbG9yID09PSB1bmRlZmluZWQgPyBuZXcgb2JlbGlzay5DdWJlQ29sb3IoKSA6IGNvbG9yO1xuICAgIH07XG5cbiAgICBwLmluaXRSZWN0YW5nbGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMudyA9IHRoaXMuZGltZW5zaW9uLnhBeGlzICsgdGhpcy5kaW1lbnNpb24ueUF4aXM7XG4gICAgICAgIHRoaXMuaCA9IHRoaXMuZGltZW5zaW9uLnpBeGlzICsgKHRoaXMuZGltZW5zaW9uLnhBeGlzICsgdGhpcy5kaW1lbnNpb24ueUF4aXMpIC8gMjtcblxuICAgICAgICAvLyAyMi42IGRlZ3JlZXMgaW1wbGVtZW50YXRpb25cbiAgICAgICAgdGhpcy53IC09IDI7XG4gICAgICAgIHRoaXMuaCAtPSAxO1xuXG4gICAgICAgIC8vIHRoZSBtYXRyaXggb2Zmc2V0IGJldHdlZW4gdGhlIGJpdG1hcCBhbmQgdGhlIDNkIHBpeGVsIGNvb3JkaW5hdGUgWkVSTyBwb2ludFxuICAgICAgICB0aGlzLm1hdHJpeCA9IG5ldyBvYmVsaXNrLk1hdHJpeCgpO1xuICAgICAgICB0aGlzLm1hdHJpeC50eCA9IC10aGlzLmRpbWVuc2lvbi55QXhpcyArIDI7XG4gICAgICAgIHRoaXMubWF0cml4LnR5ID0gLXRoaXMuZGltZW5zaW9uLnpBeGlzO1xuICAgIH07XG5cbiAgICBwLmluaXRCaXRtYXBEYXRhID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmJpdG1hcERhdGEgPSBuZXcgb2JlbGlzay5CaXRtYXBEYXRhKHRoaXMudywgdGhpcy5oLCB0aGlzLnVzZURlZmF1bHRDYW52YXMpO1xuICAgIH07XG4gICAgcC5yZW5kZXJCaXRtYXBEYXRhRm9yQ2FudmFzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmNhbnZhcyA9IHRoaXMuYml0bWFwRGF0YS5jYW52YXM7XG4gICAgfTtcblxuICAgIHAuYnVpbGQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBicmljaywgc2lkZVgsIHNpZGVZLCBwb19icmljaywgcG9feCwgcG9feSwgY3R4LCBibWQsIG9mZnNldFgsIG9mZnNldFksXG4gICAgICAgICAgICBpLCBqLCBrO1xuICAgICAgICAvLyBob3Jpem9udGFsIGxheWVyXG4gICAgICAgIGJyaWNrID0gbmV3IG9iZWxpc2suQnJpY2soXG4gICAgICAgICAgICBuZXcgb2JlbGlzay5Ccmlja0RpbWVuc2lvbih0aGlzLmRpbWVuc2lvbi54QXhpcywgdGhpcy5kaW1lbnNpb24ueUF4aXMpLFxuICAgICAgICAgICAgbmV3IG9iZWxpc2suU2lkZUNvbG9yKHRoaXMuY29sb3IuYm9yZGVyLCB0aGlzLmNvbG9yLmhvcml6b250YWwpLFxuICAgICAgICAgICAgdGhpcy5ib3JkZXJcbiAgICAgICAgKTtcblxuICAgICAgICAvLyBsZWZ0IHNpZGVcbiAgICAgICAgc2lkZVggPSBuZXcgb2JlbGlzay5TaWRlWChcbiAgICAgICAgICAgIG5ldyBvYmVsaXNrLlNpZGVYRGltZW5zaW9uKHRoaXMuZGltZW5zaW9uLnhBeGlzLCB0aGlzLmRpbWVuc2lvbi56QXhpcyksXG4gICAgICAgICAgICBuZXcgb2JlbGlzay5TaWRlQ29sb3IodGhpcy5jb2xvci5ib3JkZXIsIHRoaXMuY29sb3IubGVmdCksXG4gICAgICAgICAgICB0aGlzLmJvcmRlclxuICAgICAgICApO1xuXG4gICAgICAgIC8vIHJpZ2h0IHNpZGVcbiAgICAgICAgc2lkZVkgPSBuZXcgb2JlbGlzay5TaWRlWShcbiAgICAgICAgICAgIG5ldyBvYmVsaXNrLlNpZGVZRGltZW5zaW9uKHRoaXMuZGltZW5zaW9uLnlBeGlzLCB0aGlzLmRpbWVuc2lvbi56QXhpcyksXG4gICAgICAgICAgICBuZXcgb2JlbGlzay5TaWRlQ29sb3IodGhpcy5jb2xvci5ib3JkZXIsIHRoaXMuY29sb3IucmlnaHQpLFxuICAgICAgICAgICAgdGhpcy5ib3JkZXJcbiAgICAgICAgKTtcblxuICAgICAgICBwb19icmljayA9IG5ldyBvYmVsaXNrLlBpeGVsT2JqZWN0KGJyaWNrKTtcbiAgICAgICAgcG9feCA9IG5ldyBvYmVsaXNrLlBpeGVsT2JqZWN0KHNpZGVYKTtcbiAgICAgICAgcG9feSA9IG5ldyBvYmVsaXNrLlBpeGVsT2JqZWN0KHNpZGVZKTtcblxuICAgICAgICBjdHggPSB0aGlzLmJpdG1hcERhdGEuY29udGV4dDtcbiAgICAgICAgY3R4LmRyYXdJbWFnZShwb19icmljay5jYW52YXMsIHBvX2JyaWNrLnggKyB0aGlzLmRpbWVuc2lvbi55QXhpcyAtIDIsIHBvX2JyaWNrLnkpO1xuICAgICAgICBjdHguZHJhd0ltYWdlKHBvX3guY2FudmFzLCBwb194LngsIHBvX3gueSArIHRoaXMuZGltZW5zaW9uLnpBeGlzICsgdGhpcy5kaW1lbnNpb24ueUF4aXMgLyAyIC0gMSk7XG4gICAgICAgIGN0eC5kcmF3SW1hZ2UocG9feS5jYW52YXMsIHBvX3kueCArIHRoaXMudyAtIDIsIHBvX3gueSArIHRoaXMuZGltZW5zaW9uLnpBeGlzICsgdGhpcy5kaW1lbnNpb24ueEF4aXMgLyAyIC0gMSk7XG5cbiAgICAgICAgLy8gaGlnaGxpZ2h0ICYgaGlnaGxpZ2h0IGZpeFxuICAgICAgICBibWQgPSBuZXcgb2JlbGlzay5CaXRtYXBEYXRhKHRoaXMudywgdGhpcy5oKTtcblxuICAgICAgICBpZiAodGhpcy5ib3JkZXIpIHtcbiAgICAgICAgICAgIG9mZnNldFggPSB0aGlzLmRpbWVuc2lvbi54QXhpcyAtIDI7XG4gICAgICAgICAgICBvZmZzZXRZID0gKHRoaXMuZGltZW5zaW9uLnhBeGlzICsgdGhpcy5kaW1lbnNpb24ueUF4aXMpIC8gMiAtIDI7XG5cbiAgICAgICAgICAgIC8vdGhlIDJweCBpbiBib3VuZGluZyB3aXRob3V0IGhpZ2h0bGlnaHRcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCB0aGlzLmRpbWVuc2lvbi54QXhpcyAtIDI7IGkgKz0gMSkge1xuICAgICAgICAgICAgICAgIGJtZC5zZXRQaXhlbChvZmZzZXRYICsgMSAtIGksIG9mZnNldFkgLSBNYXRoLmZsb29yKGkgLyAyKSwgdGhpcy5jb2xvci5ib3JkZXJIaWdobGlnaHQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvL3RoZSAycHggaW4gYm91bmRpbmcgd2l0aG91dCBoaWdodGxpZ2h0XG4gICAgICAgICAgICBmb3IgKGogPSAwOyBqIDwgdGhpcy5kaW1lbnNpb24ueUF4aXMgLSAyOyBqICs9IDEpIHtcbiAgICAgICAgICAgICAgICBibWQuc2V0UGl4ZWwob2Zmc2V0WCArIGosIG9mZnNldFkgLSBNYXRoLmZsb29yKGogLyAyKSwgdGhpcy5jb2xvci5ib3JkZXJIaWdobGlnaHQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3IgKGsgPSAwOyBrIDwgdGhpcy5kaW1lbnNpb24uekF4aXM7IGsgKz0gMSkge1xuICAgICAgICAgICAgICAgIGJtZC5zZXRQaXhlbChvZmZzZXRYLCBvZmZzZXRZICsgaywgdGhpcy5jb2xvci5ib3JkZXJIaWdobGlnaHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IHRoaXMuZGltZW5zaW9uLnpBeGlzOyBpICs9IDEpIHtcbiAgICAgICAgICAgICAgICBibWQuc2V0UGl4ZWwodGhpcy5kaW1lbnNpb24ueEF4aXMgLSAyLCAodGhpcy5kaW1lbnNpb24ueEF4aXMgKyB0aGlzLmRpbWVuc2lvbi55QXhpcykgLyAyIC0gMSArIGksIHRoaXMuY29sb3IubGVmdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgYm1kLmNvbnRleHQucHV0SW1hZ2VEYXRhKGJtZC5pbWFnZURhdGEsIDAsIDApO1xuICAgICAgICBjdHguZHJhd0ltYWdlKGJtZC5jYW52YXMsIDAsIDApO1xuICAgIH07XG5cbiAgICAvLyBwdWJsaWMgbWV0aG9kc1xuICAgIHAudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBcIltDdWJlXVwiO1xuICAgIH07XG5cbiAgICBvYmVsaXNrLkN1YmUgPSBDdWJlO1xufShvYmVsaXNrKSk7XG5cbi8qZ2xvYmFsIG9iZWxpc2s6dHJ1ZSovXG5cbi8qXG4gKiBQeXJhbWlkXG4gKi9cblxuKGZ1bmN0aW9uIChvYmVsaXNrKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICB2YXIgUHlyYW1pZCwgcDtcbiAgICBQeXJhbWlkID0gZnVuY3Rpb24gKGRpbWVuc2lvbiwgY29sb3IsIGJvcmRlciwgdXNlRGVmYXVsdENhbnZhcykge1xuICAgICAgICB0aGlzLmluaXRpYWxpemUoZGltZW5zaW9uLCBjb2xvciwgYm9yZGVyLCB1c2VEZWZhdWx0Q2FudmFzKTtcbiAgICB9O1xuICAgIHAgPSBQeXJhbWlkLnByb3RvdHlwZSA9IG5ldyBvYmVsaXNrLkFic3RyYWN0UHJpbWl0aXZlKCk7XG5cbiAgICAvLyBwcml2YXRlIHByb3BlcnRpZXNcbiAgICBwLmhTaXplID0gbnVsbDtcbiAgICBwLmhPZmZzZXQgPSBudWxsO1xuXG4gICAgLy8gY29uc3RydWN0b3JcbiAgICBwLmluaXRpYWxpemUgPSBmdW5jdGlvbiAoZGltZW5zaW9uLCBjb2xvciwgYm9yZGVyLCB1c2VEZWZhdWx0Q2FudmFzKSB7XG4gICAgICAgIHRoaXMuaW5pdFJlbmRlcihkaW1lbnNpb24sIGNvbG9yLCBib3JkZXIsIHVzZURlZmF1bHRDYW52YXMpO1xuICAgICAgICB0aGlzLmluaXRSZWN0YW5nbGUoKTtcbiAgICAgICAgdGhpcy5pbml0Qml0bWFwRGF0YSgpO1xuICAgICAgICB0aGlzLmJ1aWxkKCk7XG4gICAgICAgIHRoaXMucmVuZGVyQml0bWFwRGF0YUZvckNhbnZhcygpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgLy8gcHJpdmF0ZSBtZXRob2RcbiAgICBwLmluaXRSZW5kZXIgPSBmdW5jdGlvbiAoZGltZW5zaW9uLCBjb2xvciwgYm9yZGVyLCB1c2VEZWZhdWx0Q2FudmFzKSB7XG4gICAgICAgIHRoaXMudXNlRGVmYXVsdENhbnZhcyA9IHVzZURlZmF1bHRDYW52YXMgfHwgZmFsc2U7XG4gICAgICAgIHRoaXMuYm9yZGVyID0gYm9yZGVyIHx8IGJvcmRlciA9PT0gdW5kZWZpbmVkO1xuICAgICAgICB0aGlzLmRpbWVuc2lvbiA9IGRpbWVuc2lvbiA9PT0gdW5kZWZpbmVkID8gbmV3IG9iZWxpc2suUHlyYW1pZERpbWVuc2lvbigpIDogZGltZW5zaW9uO1xuICAgICAgICB0aGlzLmNvbG9yID0gY29sb3IgPT09IHVuZGVmaW5lZCA/IG5ldyBvYmVsaXNrLlB5cmFtaWRDb2xvcigpIDogY29sb3I7XG5cbiAgICAgICAgdGhpcy5oU2l6ZSA9IHRoaXMuZGltZW5zaW9uLnRhbGwgPyB0aGlzLmRpbWVuc2lvbi54QXhpcyAqIDIgOiB0aGlzLmRpbWVuc2lvbi54QXhpcztcbiAgICAgICAgdGhpcy5oT2Zmc2V0ID0gdGhpcy5kaW1lbnNpb24udGFsbCA/IC0zIDogLTI7XG4gICAgfTtcblxuICAgIHAuaW5pdFJlY3RhbmdsZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy53ID0gdGhpcy5kaW1lbnNpb24ueEF4aXMgKyB0aGlzLmRpbWVuc2lvbi55QXhpcztcbiAgICAgICAgdGhpcy5oID0gdGhpcy5oU2l6ZSArIHRoaXMuZGltZW5zaW9uLnhBeGlzIC8gMjtcblxuICAgICAgICAvLyAyMi42IGRlZ3JlZXMgaW1wbGVtZW50YXRpb25cbiAgICAgICAgdGhpcy53IC09IDI7XG4gICAgICAgIHRoaXMuaCArPSB0aGlzLmhPZmZzZXQ7XG5cbiAgICAgICAgLy8gdGhlIG1hdHJpeCBvZmZzZXQgYmV0d2VlbiB0aGUgYml0bWFwIGFuZCB0aGUgM2QgcGl4ZWwgY29vcmRpbmF0ZSBaRVJPIHBvaW50XG4gICAgICAgIHRoaXMubWF0cml4ID0gbmV3IG9iZWxpc2suTWF0cml4KCk7XG4gICAgICAgIHRoaXMubWF0cml4LnR4ID0gLXRoaXMuZGltZW5zaW9uLnhBeGlzICsgMjtcbiAgICAgICAgdGhpcy5tYXRyaXgudHkgPSAtdGhpcy5oU2l6ZSAvIDIgKyAyIC0gKHRoaXMuZGltZW5zaW9uLnRhbGwgPyB0aGlzLmRpbWVuc2lvbi54QXhpcyAvIDIgOiAxKTtcbiAgICB9O1xuXG4gICAgcC5pbml0Qml0bWFwRGF0YSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5iaXRtYXBEYXRhID0gbmV3IG9iZWxpc2suQml0bWFwRGF0YSh0aGlzLncsIHRoaXMuaCwgdGhpcy51c2VEZWZhdWx0Q2FudmFzKTtcbiAgICB9O1xuICAgIHAucmVuZGVyQml0bWFwRGF0YUZvckNhbnZhcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5iaXRtYXBEYXRhLmNvbnRleHQucHV0SW1hZ2VEYXRhKHRoaXMuYml0bWFwRGF0YS5pbWFnZURhdGEsIDAsIDApO1xuICAgICAgICB0aGlzLmNhbnZhcyA9IHRoaXMuYml0bWFwRGF0YS5jYW52YXM7XG4gICAgfTtcblxuICAgIHAuYnVpbGQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBjb2xvcmJvcmRlcl9sZWZ0LCBjb2xvcmJvcmRlcl9yaWdodCwgY29sb3Jib3JkZXJfaGlnaGxpZ2h0LFxuICAgICAgICAgICAgaSwgaiwgaywgbDEsIG0xLCBsMiwgbTI7XG4gICAgICAgIGNvbG9yYm9yZGVyX2xlZnQgPSB0aGlzLmJvcmRlciA/IHRoaXMuY29sb3IuYm9yZGVyIDogdGhpcy5jb2xvci5sZWZ0O1xuICAgICAgICBjb2xvcmJvcmRlcl9yaWdodCA9IHRoaXMuYm9yZGVyID8gdGhpcy5jb2xvci5ib3JkZXIgOiB0aGlzLmNvbG9yLnJpZ2h0O1xuXG4gICAgICAgIGNvbG9yYm9yZGVyX2hpZ2hsaWdodCA9IHRoaXMuYm9yZGVyID8gdGhpcy5jb2xvci5ib3JkZXJIaWdobGlnaHQgOiBjb2xvcmJvcmRlcl9sZWZ0O1xuXG4gICAgICAgIC8veiBheGlzIHx8IGhpZ2h0bGlnaHRcbiAgICAgICAgZm9yIChrID0gMDsgayA8IHRoaXMuaFNpemUgKyB0aGlzLmRpbWVuc2lvbi54QXhpcyAvIDIgLSA0OyBrICs9IDEpIHtcbiAgICAgICAgICAgIHRoaXMuYml0bWFwRGF0YS5zZXRQaXhlbCh0aGlzLmRpbWVuc2lvbi54QXhpcyAtIDIsIGsgKyAzICsgdGhpcy5oT2Zmc2V0LCBjb2xvcmJvcmRlcl9oaWdobGlnaHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy94IGF4aXNcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IHRoaXMuZGltZW5zaW9uLnhBeGlzOyBpICs9IDEpIHtcbiAgICAgICAgICAgIHRoaXMuYml0bWFwRGF0YS5zZXRQaXhlbChpLCB0aGlzLmhTaXplICsgTWF0aC5mbG9vcihpIC8gMikgKyB0aGlzLmhPZmZzZXQsIGNvbG9yYm9yZGVyX2xlZnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy95IGF4aXNcbiAgICAgICAgZm9yIChqID0gMDsgaiA8IHRoaXMuZGltZW5zaW9uLnhBeGlzOyBqICs9IDEpIHtcbiAgICAgICAgICAgIHRoaXMuYml0bWFwRGF0YS5zZXRQaXhlbChqICsgdGhpcy5kaW1lbnNpb24ueEF4aXMgLSAyLCB0aGlzLmhTaXplICsgdGhpcy5kaW1lbnNpb24ueEF4aXMgLyAyIC0gTWF0aC5mbG9vcihqIC8gMikgLSAxICsgdGhpcy5oT2Zmc2V0LCBjb2xvcmJvcmRlcl9yaWdodCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRoaXMuZGltZW5zaW9uLnRhbGwpIHtcbiAgICAgICAgICAgIC8vbGVmdCBlZGdlXG4gICAgICAgICAgICBmb3IgKGwxID0gMDsgbDEgPCB0aGlzLmhTaXplOyBsMSArPSAxKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5iaXRtYXBEYXRhLnNldFBpeGVsKGwxLCB0aGlzLmhTaXplIC0gbDEgKyB0aGlzLmhPZmZzZXQsIGNvbG9yYm9yZGVyX2xlZnQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvL3JpZ2h0IGVkZ2VcbiAgICAgICAgICAgIGZvciAobTEgPSAwOyBtMSA8IHRoaXMuaFNpemU7IG0xICs9IDEpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmJpdG1hcERhdGEuc2V0UGl4ZWwobTEgKyB0aGlzLmhTaXplIC0gMiwgbTEgKyAxICsgdGhpcy5oT2Zmc2V0LCBjb2xvcmJvcmRlcl9yaWdodCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvL2xlZnQgZWRnZVxuICAgICAgICAgICAgZm9yIChsMiA9IDA7IGwyIDwgdGhpcy5oU2l6ZSAtIDI7IGwyICs9IDEpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmJpdG1hcERhdGEuc2V0UGl4ZWwoTWF0aC5mbG9vcihsMiAvIDIpLCB0aGlzLmhTaXplIC0gbDIgKyB0aGlzLmhPZmZzZXQsIGNvbG9yYm9yZGVyX2xlZnQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvL3JpZ2h0IGVkZ2VcbiAgICAgICAgICAgIGZvciAobTIgPSAyOyBtMiA8IHRoaXMuaFNpemU7IG0yICs9IDEpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmJpdG1hcERhdGEuc2V0UGl4ZWwoTWF0aC5mbG9vcihtMiAvIDIpICsgdGhpcy5kaW1lbnNpb24ueEF4aXMgLSAyLCBtMiArIDEgKyB0aGlzLmhPZmZzZXQsIGNvbG9yYm9yZGVyX3JpZ2h0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhpcy5ib3JkZXIpIHtcbiAgICAgICAgICAgIHRoaXMuYml0bWFwRGF0YS5zZXRQaXhlbCh0aGlzLmRpbWVuc2lvbi54QXhpcyAtIDIsIHRoaXMuaFNpemUgKyB0aGlzLmRpbWVuc2lvbi54QXhpcyAvIDIgLSAxICsgdGhpcy5oT2Zmc2V0LCBjb2xvcmJvcmRlcl9sZWZ0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vZmxvb2RmaWxsXG4gICAgICAgIHRoaXMuYml0bWFwRGF0YS5mbG9vZEZpbGwodGhpcy5kaW1lbnNpb24ueEF4aXMgLSAxLCB0aGlzLmhTaXplICsgTWF0aC5mbG9vcigodGhpcy5kaW1lbnNpb24ueEF4aXMgLSAxKSAvIDIpICsgdGhpcy5oT2Zmc2V0IC0gMSwgdGhpcy5jb2xvci5yaWdodCk7XG4gICAgICAgIHRoaXMuYml0bWFwRGF0YS5mbG9vZEZpbGwodGhpcy5kaW1lbnNpb24ueEF4aXMgLSAzLCB0aGlzLmhTaXplICsgTWF0aC5mbG9vcigodGhpcy5kaW1lbnNpb24ueEF4aXMgLSAxKSAvIDIpICsgdGhpcy5oT2Zmc2V0IC0gMiwgdGhpcy5jb2xvci5sZWZ0KTtcbiAgICB9O1xuXG4gICAgLy8gcHVibGljIG1ldGhvZHNcbiAgICBwLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gXCJbUHlyYW1pZF1cIjtcbiAgICB9O1xuXG4gICAgb2JlbGlzay5QeXJhbWlkID0gUHlyYW1pZDtcbn0ob2JlbGlzaykpO1xuXG4vKmdsb2JhbCBvYmVsaXNrOnRydWUqL1xuXG4vKlxuICogU2lkZVhcbiAqL1xuXG4oZnVuY3Rpb24gKG9iZWxpc2spIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICB2YXIgU2lkZVgsIHA7XG4gICAgU2lkZVggPSBmdW5jdGlvbiAoZGltZW5zaW9uLCBjb2xvciwgYm9yZGVyLCB1c2VEZWZhdWx0Q2FudmFzKSB7XG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZShkaW1lbnNpb24sIGNvbG9yLCBib3JkZXIsIHVzZURlZmF1bHRDYW52YXMpO1xuICAgIH07XG4gICAgcCA9IFNpZGVYLnByb3RvdHlwZSA9IG5ldyBvYmVsaXNrLkFic3RyYWN0UHJpbWl0aXZlKCk7XG5cbiAgICAvLyBwdWJsaWMgcHJvcGVydGllc1xuXG4gICAgLy8gY29uc3RydWN0b3JcbiAgICBwLmluaXRpYWxpemUgPSBmdW5jdGlvbiAoZGltZW5zaW9uLCBjb2xvciwgYm9yZGVyLCB1c2VEZWZhdWx0Q2FudmFzKSB7XG4gICAgICAgIHRoaXMuaW5pdFJlbmRlcihkaW1lbnNpb24sIGNvbG9yLCBib3JkZXIsIHVzZURlZmF1bHRDYW52YXMpO1xuICAgICAgICB0aGlzLmluaXRSZWN0YW5nbGUoKTtcbiAgICAgICAgdGhpcy5pbml0Qml0bWFwRGF0YSgpO1xuICAgICAgICB0aGlzLmJ1aWxkKCk7XG4gICAgICAgIHRoaXMucmVuZGVyQml0bWFwRGF0YUZvckNhbnZhcygpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgLy8gcHJpdmF0ZSBtZXRob2RcbiAgICBwLmluaXRSZW5kZXIgPSBmdW5jdGlvbiAoZGltZW5zaW9uLCBjb2xvciwgYm9yZGVyLCB1c2VEZWZhdWx0Q2FudmFzKSB7XG4gICAgICAgIHRoaXMudXNlRGVmYXVsdENhbnZhcyA9IHVzZURlZmF1bHRDYW52YXMgfHwgZmFsc2U7XG4gICAgICAgIHRoaXMuYm9yZGVyID0gYm9yZGVyIHx8IGJvcmRlciA9PT0gdW5kZWZpbmVkO1xuICAgICAgICB0aGlzLmRpbWVuc2lvbiA9IGRpbWVuc2lvbiA9PT0gdW5kZWZpbmVkID8gbmV3IG9iZWxpc2suU2lkZVhEaW1lbnNpb24oKSA6IGRpbWVuc2lvbjtcbiAgICAgICAgdGhpcy5jb2xvciA9IGNvbG9yID09PSB1bmRlZmluZWQgPyBuZXcgb2JlbGlzay5TaWRlQ29sb3IoKSA6IGNvbG9yO1xuICAgIH07XG5cbiAgICBwLmluaXRSZWN0YW5nbGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMudyA9IHRoaXMuZGltZW5zaW9uLnhBeGlzO1xuICAgICAgICB0aGlzLmggPSB0aGlzLmRpbWVuc2lvbi56QXhpcyArIHRoaXMuZGltZW5zaW9uLnhBeGlzIC8gMjtcblxuICAgICAgICAvLyB0aGUgbWF0cml4IG9mZnNldCBiZXR3ZWVuIHRoZSBiaXRtYXAgYW5kIHRoZSAzZCBwaXhlbCBjb29yZGluYXRlIFpFUk8gcG9pbnRcbiAgICAgICAgdGhpcy5tYXRyaXggPSBuZXcgb2JlbGlzay5NYXRyaXgoKTtcbiAgICAgICAgdGhpcy5tYXRyaXgudHggPSAwO1xuICAgICAgICB0aGlzLm1hdHJpeC50eSA9IC10aGlzLmRpbWVuc2lvbi56QXhpcztcbiAgICB9O1xuXG4gICAgcC5pbml0Qml0bWFwRGF0YSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5iaXRtYXBEYXRhID0gbmV3IG9iZWxpc2suQml0bWFwRGF0YSh0aGlzLncsIHRoaXMuaCwgdGhpcy51c2VEZWZhdWx0Q2FudmFzKTtcbiAgICB9O1xuICAgIHAucmVuZGVyQml0bWFwRGF0YUZvckNhbnZhcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5iaXRtYXBEYXRhLmNvbnRleHQucHV0SW1hZ2VEYXRhKHRoaXMuYml0bWFwRGF0YS5pbWFnZURhdGEsIDAsIDApO1xuICAgICAgICB0aGlzLmNhbnZhcyA9IHRoaXMuYml0bWFwRGF0YS5jYW52YXM7XG4gICAgfTtcblxuICAgIHAuYnVpbGQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB4T2Zmc2V0SW5uZXIsIHlPZmZzZXRJbm5lciwgeE9mZnNldE91dCwgeU9mZnNldE91dCwgaSwgaiwgYm9yZGVyQ29sb3I7XG5cbiAgICAgICAgeE9mZnNldElubmVyID0gMDtcbiAgICAgICAgeU9mZnNldElubmVyID0gdGhpcy5kaW1lbnNpb24uekF4aXM7XG4gICAgICAgIHhPZmZzZXRPdXQgPSB0aGlzLmRpbWVuc2lvbi54QXhpcyAtIDE7XG4gICAgICAgIHlPZmZzZXRPdXQgPSB0aGlzLmggLSB0aGlzLmRpbWVuc2lvbi56QXhpcyAtIDE7XG4gICAgICAgIGJvcmRlckNvbG9yID0gdGhpcy5ib3JkZXIgPyB0aGlzLmNvbG9yLmJvcmRlciA6IHRoaXMuY29sb3IuaW5uZXI7XG5cbiAgICAgICAgLy94IGF4aXNcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IHRoaXMuZGltZW5zaW9uLnhBeGlzOyBpICs9IDEpIHtcbiAgICAgICAgICAgIHRoaXMuYml0bWFwRGF0YS5zZXRQaXhlbCh4T2Zmc2V0SW5uZXIgKyBpLCB5T2Zmc2V0SW5uZXIgKyBNYXRoLmZsb29yKGkgLyAyKSwgYm9yZGVyQ29sb3IpO1xuICAgICAgICAgICAgdGhpcy5iaXRtYXBEYXRhLnNldFBpeGVsKHhPZmZzZXRPdXQgLSBpLCB5T2Zmc2V0T3V0IC0gTWF0aC5mbG9vcihpIC8gMiksIGJvcmRlckNvbG9yKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8veiBheGlzXG4gICAgICAgIGZvciAoaiA9IDA7IGogPCB0aGlzLmRpbWVuc2lvbi56QXhpczsgaiArPSAxKSB7XG4gICAgICAgICAgICB0aGlzLmJpdG1hcERhdGEuc2V0UGl4ZWwoeE9mZnNldElubmVyLCB5T2Zmc2V0SW5uZXIgLSBqLCBib3JkZXJDb2xvcik7XG4gICAgICAgICAgICB0aGlzLmJpdG1hcERhdGEuc2V0UGl4ZWwoeE9mZnNldE91dCwgeU9mZnNldE91dCArIGosIGJvcmRlckNvbG9yKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vZmlsbCBhbiBwaXhlbCBncmFwaGljIGVuY2xvc2VkXG4gICAgICAgIHRoaXMuYml0bWFwRGF0YS5mbG9vZEZpbGwoTWF0aC5mbG9vcih0aGlzLncgLyAyKSwgTWF0aC5mbG9vcih0aGlzLmggLyAyKSwgdGhpcy5jb2xvci5pbm5lcik7XG4gICAgfTtcblxuICAgIC8vIHB1YmxpYyBtZXRob2RzXG4gICAgcC50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIFwiW1NpZGVYXVwiO1xuICAgIH07XG5cbiAgICBvYmVsaXNrLlNpZGVYID0gU2lkZVg7XG59KG9iZWxpc2spKTtcblxuLypnbG9iYWwgb2JlbGlzazp0cnVlKi9cblxuLypcbiAqIFNpZGVZXG4gKi9cblxuKGZ1bmN0aW9uIChvYmVsaXNrKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICB2YXIgU2lkZVksIHA7XG4gICAgU2lkZVkgPSBmdW5jdGlvbiAoZGltZW5zaW9uLCBjb2xvciwgYm9yZGVyLCB1c2VEZWZhdWx0Q2FudmFzKSB7XG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZShkaW1lbnNpb24sIGNvbG9yLCBib3JkZXIsIHVzZURlZmF1bHRDYW52YXMpO1xuICAgIH07XG4gICAgcCA9IFNpZGVZLnByb3RvdHlwZSA9IG5ldyBvYmVsaXNrLkFic3RyYWN0UHJpbWl0aXZlKCk7XG5cbiAgICAvLyBwdWJsaWMgcHJvcGVydGllc1xuXG4gICAgLy8gY29uc3RydWN0b3JcbiAgICBwLmluaXRpYWxpemUgPSBmdW5jdGlvbiAoZGltZW5zaW9uLCBjb2xvciwgYm9yZGVyLCB1c2VEZWZhdWx0Q2FudmFzKSB7XG4gICAgICAgIHRoaXMuaW5pdFJlbmRlcihkaW1lbnNpb24sIGNvbG9yLCBib3JkZXIsIHVzZURlZmF1bHRDYW52YXMpO1xuICAgICAgICB0aGlzLmluaXRSZWN0YW5nbGUoKTtcbiAgICAgICAgdGhpcy5pbml0Qml0bWFwRGF0YSgpO1xuICAgICAgICB0aGlzLmJ1aWxkKCk7XG4gICAgICAgIHRoaXMucmVuZGVyQml0bWFwRGF0YUZvckNhbnZhcygpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgLy8gcHJpdmF0ZSBtZXRob2RcbiAgICBwLmluaXRSZW5kZXIgPSBmdW5jdGlvbiAoZGltZW5zaW9uLCBjb2xvciwgYm9yZGVyLCB1c2VEZWZhdWx0Q2FudmFzKSB7XG4gICAgICAgIHRoaXMudXNlRGVmYXVsdENhbnZhcyA9IHVzZURlZmF1bHRDYW52YXMgfHwgZmFsc2U7XG4gICAgICAgIHRoaXMuYm9yZGVyID0gYm9yZGVyIHx8IGJvcmRlciA9PT0gdW5kZWZpbmVkO1xuICAgICAgICB0aGlzLmRpbWVuc2lvbiA9IGRpbWVuc2lvbiA9PT0gdW5kZWZpbmVkID8gbmV3IG9iZWxpc2suU2lkZVlEaW1lbnNpb24oKSA6IGRpbWVuc2lvbjtcbiAgICAgICAgdGhpcy5jb2xvciA9IGNvbG9yID09PSB1bmRlZmluZWQgPyBuZXcgb2JlbGlzay5TaWRlQ29sb3IoKSA6IGNvbG9yO1xuICAgIH07XG5cbiAgICBwLmluaXRSZWN0YW5nbGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMudyA9IHRoaXMuZGltZW5zaW9uLnlBeGlzO1xuICAgICAgICB0aGlzLmggPSB0aGlzLmRpbWVuc2lvbi56QXhpcyArIHRoaXMuZGltZW5zaW9uLnlBeGlzIC8gMjtcblxuICAgICAgICAvLyB0aGUgbWF0cml4IG9mZnNldCBiZXR3ZWVuIHRoZSBiaXRtYXAgYW5kIHRoZSAzZCBwaXhlbCBjb29yZGluYXRlIFpFUk8gcG9pbnRcbiAgICAgICAgdGhpcy5tYXRyaXggPSBuZXcgb2JlbGlzay5NYXRyaXgoKTtcbiAgICAgICAgdGhpcy5tYXRyaXgudHggPSAtdGhpcy5kaW1lbnNpb24ueUF4aXMgKyAyO1xuICAgICAgICB0aGlzLm1hdHJpeC50eSA9IC10aGlzLmRpbWVuc2lvbi56QXhpcztcbiAgICB9O1xuXG4gICAgcC5pbml0Qml0bWFwRGF0YSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5iaXRtYXBEYXRhID0gbmV3IG9iZWxpc2suQml0bWFwRGF0YSh0aGlzLncsIHRoaXMuaCwgdGhpcy51c2VEZWZhdWx0Q2FudmFzKTtcbiAgICB9O1xuICAgIHAucmVuZGVyQml0bWFwRGF0YUZvckNhbnZhcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5iaXRtYXBEYXRhLmNvbnRleHQucHV0SW1hZ2VEYXRhKHRoaXMuYml0bWFwRGF0YS5pbWFnZURhdGEsIDAsIDApO1xuICAgICAgICB0aGlzLmNhbnZhcyA9IHRoaXMuYml0bWFwRGF0YS5jYW52YXM7XG4gICAgfTtcblxuICAgIHAuYnVpbGQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB4T2Zmc2V0SW5uZXIsIHlPZmZzZXRJbm5lciwgeE9mZnNldE91dCwgeU9mZnNldE91dCwgaSwgaiwgYm9yZGVyQ29sb3I7XG4gICAgICAgIHhPZmZzZXRJbm5lciA9IDA7XG4gICAgICAgIHlPZmZzZXRJbm5lciA9IHRoaXMuaCAtIHRoaXMuZGltZW5zaW9uLnpBeGlzIC0gMTtcbiAgICAgICAgeE9mZnNldE91dCA9IHRoaXMuZGltZW5zaW9uLnlBeGlzIC0gMTtcbiAgICAgICAgeU9mZnNldE91dCA9IHRoaXMuZGltZW5zaW9uLnpBeGlzO1xuICAgICAgICBib3JkZXJDb2xvciA9IHRoaXMuYm9yZGVyID8gdGhpcy5jb2xvci5ib3JkZXIgOiB0aGlzLmNvbG9yLmlubmVyO1xuXG4gICAgICAgIC8veSBheGlzXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCB0aGlzLmRpbWVuc2lvbi55QXhpczsgaSArPSAxKSB7XG4gICAgICAgICAgICB0aGlzLmJpdG1hcERhdGEuc2V0UGl4ZWwoeE9mZnNldElubmVyICsgaSwgeU9mZnNldElubmVyIC0gTWF0aC5mbG9vcihpIC8gMiksIGJvcmRlckNvbG9yKTtcbiAgICAgICAgICAgIHRoaXMuYml0bWFwRGF0YS5zZXRQaXhlbCh4T2Zmc2V0T3V0IC0gaSwgeU9mZnNldE91dCArIE1hdGguZmxvb3IoaSAvIDIpLCBib3JkZXJDb2xvcik7XG4gICAgICAgIH1cblxuICAgICAgICAvL3ogYXhpc1xuICAgICAgICBmb3IgKGogPSAwOyBqIDwgdGhpcy5kaW1lbnNpb24uekF4aXM7IGogKz0gMSkge1xuICAgICAgICAgICAgdGhpcy5iaXRtYXBEYXRhLnNldFBpeGVsKHhPZmZzZXRJbm5lciwgeU9mZnNldElubmVyICsgaiwgYm9yZGVyQ29sb3IpO1xuICAgICAgICAgICAgdGhpcy5iaXRtYXBEYXRhLnNldFBpeGVsKHhPZmZzZXRPdXQsIHlPZmZzZXRPdXQgLSBqLCBib3JkZXJDb2xvcik7XG4gICAgICAgIH1cblxuICAgICAgICAvL2ZpbGwgYW4gcGl4ZWwgZ3JhcGhpYyBlbmNsb3NlZFxuICAgICAgICB0aGlzLmJpdG1hcERhdGEuZmxvb2RGaWxsKE1hdGguZmxvb3IodGhpcy53IC8gMiksIE1hdGguZmxvb3IodGhpcy5oIC8gMiksIHRoaXMuY29sb3IuaW5uZXIpO1xuICAgIH07XG5cbiAgICAvLyBwdWJsaWMgbWV0aG9kc1xuICAgIHAudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBcIltTaWRlWV1cIjtcbiAgICB9O1xuXG4gICAgb2JlbGlzay5TaWRlWSA9IFNpZGVZO1xufShvYmVsaXNrKSk7XG5cbi8qZ2xvYmFsIG9iZWxpc2s6dHJ1ZSovXG5cbi8qXG4gKiBTbG9wZSBFYXN0XG4gKi9cblxuKGZ1bmN0aW9uIChvYmVsaXNrKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICB2YXIgU2xvcGVFYXN0LCBwO1xuICAgIFNsb3BlRWFzdCA9IGZ1bmN0aW9uIChkaW1lbnNpb24sIGNvbG9yLCBib3JkZXIsIHVzZURlZmF1bHRDYW52YXMpIHtcbiAgICAgICAgdGhpcy5pbml0aWFsaXplKGRpbWVuc2lvbiwgY29sb3IsIGJvcmRlciwgdXNlRGVmYXVsdENhbnZhcyk7XG4gICAgfTtcbiAgICBwID0gU2xvcGVFYXN0LnByb3RvdHlwZSA9IG5ldyBvYmVsaXNrLkFic3RyYWN0UHJpbWl0aXZlKCk7XG5cbiAgICAvLyBjb25zdHJ1Y3RvclxuICAgIHAuaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uIChkaW1lbnNpb24sIGNvbG9yLCBib3JkZXIsIHVzZURlZmF1bHRDYW52YXMpIHtcbiAgICAgICAgdGhpcy5pbml0UmVuZGVyKGRpbWVuc2lvbiwgY29sb3IsIGJvcmRlciwgdXNlRGVmYXVsdENhbnZhcyk7XG4gICAgICAgIHRoaXMuaW5pdFJlY3RhbmdsZSgpO1xuICAgICAgICB0aGlzLmluaXRCaXRtYXBEYXRhKCk7XG4gICAgICAgIHRoaXMuYnVpbGQoKTtcbiAgICAgICAgdGhpcy5yZW5kZXJCaXRtYXBEYXRhRm9yQ2FudmFzKCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICAvLyBwcml2YXRlIG1ldGhvZFxuICAgIHAuaW5pdFJlbmRlciA9IGZ1bmN0aW9uIChkaW1lbnNpb24sIGNvbG9yLCBib3JkZXIsIHVzZURlZmF1bHRDYW52YXMpIHtcbiAgICAgICAgdGhpcy51c2VEZWZhdWx0Q2FudmFzID0gdXNlRGVmYXVsdENhbnZhcyB8fCBmYWxzZTtcbiAgICAgICAgdGhpcy5ib3JkZXIgPSBib3JkZXIgfHwgYm9yZGVyID09PSB1bmRlZmluZWQ7XG4gICAgICAgIHRoaXMuZGltZW5zaW9uID0gZGltZW5zaW9uID09PSB1bmRlZmluZWQgPyBuZXcgb2JlbGlzay5TbG9wZURpbWVuc2lvbigpIDogZGltZW5zaW9uO1xuICAgICAgICB0aGlzLmNvbG9yID0gY29sb3IgPT09IHVuZGVmaW5lZCA/IG5ldyBvYmVsaXNrLlNsb3BlQ29sb3IoKSA6IGNvbG9yO1xuICAgIH07XG5cbiAgICBwLmluaXRSZWN0YW5nbGUgPSBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgdGhpcy53ID0gdGhpcy5kaW1lbnNpb24ueEF4aXMgKyB0aGlzLmRpbWVuc2lvbi55QXhpcztcbiAgICAgICAgdGhpcy5oID0gdGhpcy5kaW1lbnNpb24ueEF4aXMgKiAyICsgdGhpcy5kaW1lbnNpb24ueUF4aXMgLyAyO1xuXG4gICAgICAgIC8vIDIyLjYgZGVncmVlcyBpbXBsZW1lbnRhdGlvblxuICAgICAgICB0aGlzLncgLT0gMjtcbiAgICAgICAgdGhpcy5oIC09IDM7XG5cbiAgICAgICAgLy8gdGhlIG1hdHJpeCBvZmZzZXQgYmV0d2VlbiB0aGUgYml0bWFwIGFuZCB0aGUgM2QgcGl4ZWwgY29vcmRpbmF0ZSBaRVJPIHBvaW50XG4gICAgICAgIHRoaXMubWF0cml4ID0gbmV3IG9iZWxpc2suTWF0cml4KCk7XG4gICAgICAgIHRoaXMubWF0cml4LnR4ID0gLSh0aGlzLmRpbWVuc2lvbi55QXhpcyAtIDIpO1xuICAgICAgICB0aGlzLm1hdHJpeC50eSA9IC0odGhpcy5kaW1lbnNpb24ueEF4aXMgKiAzIC8gMiAtIDIpO1xuICAgIH07XG5cbiAgICBwLmluaXRCaXRtYXBEYXRhID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmJpdG1hcERhdGEgPSBuZXcgb2JlbGlzay5CaXRtYXBEYXRhKHRoaXMudywgdGhpcy5oLCB0aGlzLnVzZURlZmF1bHRDYW52YXMpO1xuICAgIH07XG4gICAgcC5yZW5kZXJCaXRtYXBEYXRhRm9yQ2FudmFzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmJpdG1hcERhdGEuY29udGV4dC5wdXRJbWFnZURhdGEodGhpcy5iaXRtYXBEYXRhLmltYWdlRGF0YSwgMCwgMCk7XG4gICAgICAgIHRoaXMuY2FudmFzID0gdGhpcy5iaXRtYXBEYXRhLmNhbnZhcztcbiAgICB9O1xuXG4gICAgcC5idWlsZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGNvbG9yQm9yZGVyTGVmdCwgY29sb3JCb3JkZXJSaWdodCxcbiAgICAgICAgICAgIGksIGosIGssIG0sIG47XG5cbiAgICAgICAgY29sb3JCb3JkZXJMZWZ0ID0gdGhpcy5ib3JkZXIgPyB0aGlzLmNvbG9yLmJvcmRlciA6IHRoaXMuY29sb3IubGVmdDtcbiAgICAgICAgY29sb3JCb3JkZXJSaWdodCA9IHRoaXMuYm9yZGVyID8gdGhpcy5jb2xvci5ib3JkZXIgOiB0aGlzLmNvbG9yLnJpZ2h0U2xvcGU7XG5cbiAgICAgICAgLy8geSBheGlzXG4gICAgICAgIGZvciAoaiA9IDA7IGogPCB0aGlzLmRpbWVuc2lvbi55QXhpczsgaiArPSAxKSB7XG4gICAgICAgICAgICB0aGlzLmJpdG1hcERhdGEuc2V0UGl4ZWwoaiwgdGhpcy5kaW1lbnNpb24ueUF4aXMgLyAyIC0gTWF0aC5mbG9vcihqIC8gMikgLSAxLCBjb2xvckJvcmRlclJpZ2h0KTtcbiAgICAgICAgICAgIHRoaXMuYml0bWFwRGF0YS5zZXRQaXhlbChqICsgdGhpcy5kaW1lbnNpb24ueEF4aXMgLSAyLCB0aGlzLmggLSBNYXRoLmZsb29yKGogLyAyKSAtIDEsIGNvbG9yQm9yZGVyUmlnaHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8geCBheGlzXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCB0aGlzLmRpbWVuc2lvbi54QXhpczsgaSArPSAxKSB7XG4gICAgICAgICAgICB0aGlzLmJpdG1hcERhdGEuc2V0UGl4ZWwoaSwgdGhpcy5oIC0gdGhpcy5kaW1lbnNpb24ueEF4aXMgLyAyICsgTWF0aC5mbG9vcihpIC8gMiksIGNvbG9yQm9yZGVyTGVmdCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyB6IGF4aXNcbiAgICAgICAgZm9yIChrID0gdGhpcy5kaW1lbnNpb24ueUF4aXMgLyAyIC0gMTsgayA8IHRoaXMuaCAtIHRoaXMuZGltZW5zaW9uLnhBeGlzIC8gMjsgayArPSAxKSB7XG4gICAgICAgICAgICB0aGlzLmJpdG1hcERhdGEuc2V0UGl4ZWwoMCwgaywgY29sb3JCb3JkZXJMZWZ0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHNsb3RcbiAgICAgICAgZm9yIChtID0gMDsgbSA8IHRoaXMuZGltZW5zaW9uLnhBeGlzICogMiAtIDI7IG0gKz0gMSkge1xuICAgICAgICAgICAgdGhpcy5iaXRtYXBEYXRhLnNldFBpeGVsKHRoaXMuZGltZW5zaW9uLnlBeGlzIC0gMSArIE1hdGguZmxvb3IobSAvIDIpLCBtLCBjb2xvckJvcmRlclJpZ2h0KTtcbiAgICAgICAgICAgIHRoaXMuYml0bWFwRGF0YS5zZXRQaXhlbCgxICsgTWF0aC5mbG9vcihtIC8gMiksIHRoaXMuZGltZW5zaW9uLnlBeGlzIC8gMiArIG0gLSAxLCBjb2xvckJvcmRlclJpZ2h0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGZsb29kIGZpbGxcbiAgICAgICAgdGhpcy5iaXRtYXBEYXRhLmZsb29kRmlsbCh0aGlzLmRpbWVuc2lvbi55QXhpcyAtIDIsIDEsIHRoaXMuY29sb3IucmlnaHRTbG9wZSk7XG4gICAgICAgIHRoaXMuYml0bWFwRGF0YS5mbG9vZEZpbGwodGhpcy5kaW1lbnNpb24ueEF4aXMgLSAzLCB0aGlzLmggLSAzLCB0aGlzLmNvbG9yLmxlZnQpO1xuICAgICAgICAvLyBoYWNrIHNpbmdsZSBwaXhlbFxuICAgICAgICB0aGlzLmJpdG1hcERhdGEuc2V0UGl4ZWwodGhpcy5kaW1lbnNpb24ueEF4aXMgLSAyLCB0aGlzLmggLSAyLCB0aGlzLmNvbG9yLmxlZnQpO1xuXG4gICAgICAgIC8vIGhpZ2hsaWdodFxuICAgICAgICBpZiAodGhpcy5ib3JkZXIpIHtcbiAgICAgICAgICAgIGZvciAobiA9IDE7IG4gPCB0aGlzLmRpbWVuc2lvbi54QXhpcyAqIDIgLSAzOyBuICs9IDEpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmJpdG1hcERhdGEuc2V0UGl4ZWwoMSArIE1hdGguZmxvb3IobiAvIDIpLCB0aGlzLmRpbWVuc2lvbi55QXhpcyAvIDIgKyBuIC0gMSwgdGhpcy5jb2xvci5ib3JkZXJIaWdobGlnaHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8vIHB1YmxpYyBtZXRob2RzXG4gICAgcC50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIFwiW1Nsb3BlRWFzdF1cIjtcbiAgICB9O1xuXG4gICAgb2JlbGlzay5TbG9wZUVhc3QgPSBTbG9wZUVhc3Q7XG59KG9iZWxpc2spKTtcblxuLypnbG9iYWwgb2JlbGlzazp0cnVlKi9cblxuLypcbiAqIFNsb3BlIE5vcnRoXG4gKi9cblxuKGZ1bmN0aW9uIChvYmVsaXNrKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICB2YXIgU2xvcGVOb3J0aCwgcDtcbiAgICBTbG9wZU5vcnRoID0gZnVuY3Rpb24gKGRpbWVuc2lvbiwgY29sb3IsIGJvcmRlciwgdXNlRGVmYXVsdENhbnZhcykge1xuICAgICAgICB0aGlzLmluaXRpYWxpemUoZGltZW5zaW9uLCBjb2xvciwgYm9yZGVyLCB1c2VEZWZhdWx0Q2FudmFzKTtcbiAgICB9O1xuICAgIHAgPSBTbG9wZU5vcnRoLnByb3RvdHlwZSA9IG5ldyBvYmVsaXNrLkFic3RyYWN0UHJpbWl0aXZlKCk7XG5cbiAgICAvLyBjb25zdHJ1Y3RvclxuICAgIHAuaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uIChkaW1lbnNpb24sIGNvbG9yLCBib3JkZXIsIHVzZURlZmF1bHRDYW52YXMpIHtcbiAgICAgICAgdGhpcy5pbml0UmVuZGVyKGRpbWVuc2lvbiwgY29sb3IsIGJvcmRlciwgdXNlRGVmYXVsdENhbnZhcyk7XG4gICAgICAgIHRoaXMuaW5pdFJlY3RhbmdsZSgpO1xuICAgICAgICB0aGlzLmluaXRCaXRtYXBEYXRhKCk7XG4gICAgICAgIHRoaXMuYnVpbGQoKTtcbiAgICAgICAgdGhpcy5yZW5kZXJCaXRtYXBEYXRhRm9yQ2FudmFzKCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICAvLyBwcml2YXRlIG1ldGhvZFxuICAgIHAuaW5pdFJlbmRlciA9IGZ1bmN0aW9uIChkaW1lbnNpb24sIGNvbG9yLCBib3JkZXIsIHVzZURlZmF1bHRDYW52YXMpIHtcbiAgICAgICAgdGhpcy51c2VEZWZhdWx0Q2FudmFzID0gdXNlRGVmYXVsdENhbnZhcyB8fCBmYWxzZTtcbiAgICAgICAgdGhpcy5ib3JkZXIgPSBib3JkZXIgfHwgYm9yZGVyID09PSB1bmRlZmluZWQ7XG4gICAgICAgIHRoaXMuZGltZW5zaW9uID0gZGltZW5zaW9uID09PSB1bmRlZmluZWQgPyBuZXcgb2JlbGlzay5TbG9wZURpbWVuc2lvbigpIDogZGltZW5zaW9uO1xuICAgICAgICB0aGlzLmNvbG9yID0gY29sb3IgPT09IHVuZGVmaW5lZCA/IG5ldyBvYmVsaXNrLlNsb3BlQ29sb3IoKSA6IGNvbG9yO1xuICAgIH07XG5cbiAgICBwLmluaXRSZWN0YW5nbGUgPSBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgdGhpcy53ID0gdGhpcy5kaW1lbnNpb24ueEF4aXMgKyB0aGlzLmRpbWVuc2lvbi55QXhpcztcbiAgICAgICAgdGhpcy5oID0gdGhpcy5kaW1lbnNpb24ueUF4aXMgKiAzIC8gMiArIHRoaXMuZGltZW5zaW9uLnhBeGlzIC8gMjtcblxuICAgICAgICAvLyAyMi42IGRlZ3JlZXMgaW1wbGVtZW50YXRpb25cbiAgICAgICAgdGhpcy53IC09IDI7XG4gICAgICAgIHRoaXMuaCAtPSAzO1xuXG4gICAgICAgIC8vIHRoZSBtYXRyaXggb2Zmc2V0IGJldHdlZW4gdGhlIGJpdG1hcCBhbmQgdGhlIDNkIHBpeGVsIGNvb3JkaW5hdGUgWkVSTyBwb2ludFxuICAgICAgICB0aGlzLm1hdHJpeCA9IG5ldyBvYmVsaXNrLk1hdHJpeCgpO1xuICAgICAgICB0aGlzLm1hdHJpeC50eCA9IC0odGhpcy5kaW1lbnNpb24ueUF4aXMgLSAyKTtcbiAgICAgICAgdGhpcy5tYXRyaXgudHkgPSAtKHRoaXMuZGltZW5zaW9uLnlBeGlzIC0gMik7XG4gICAgfTtcblxuICAgIHAuaW5pdEJpdG1hcERhdGEgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuYml0bWFwRGF0YSA9IG5ldyBvYmVsaXNrLkJpdG1hcERhdGEodGhpcy53LCB0aGlzLmgsIHRoaXMudXNlRGVmYXVsdENhbnZhcyk7XG4gICAgfTtcbiAgICBwLnJlbmRlckJpdG1hcERhdGFGb3JDYW52YXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuY2FudmFzID0gdGhpcy5iaXRtYXBEYXRhLmNhbnZhcztcbiAgICB9O1xuXG4gICAgcC5idWlsZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGNvbG9yQm9yZGVyTGVmdCwgY29sb3JCb3JkZXJSaWdodCwgY29sb3JCb3JkZXJIaWdobGlnaHQsXG4gICAgICAgICAgICBzaWRlWCwgcG9YLCBjdHgsIGJtZCxcbiAgICAgICAgICAgIGksIGosIG47XG5cbiAgICAgICAgY29sb3JCb3JkZXJMZWZ0ID0gdGhpcy5ib3JkZXIgPyB0aGlzLmNvbG9yLmJvcmRlciA6IHRoaXMuY29sb3IubGVmdDtcbiAgICAgICAgY29sb3JCb3JkZXJSaWdodCA9IHRoaXMuYm9yZGVyID8gdGhpcy5jb2xvci5ib3JkZXIgOiB0aGlzLmNvbG9yLnJpZ2h0O1xuICAgICAgICBjb2xvckJvcmRlckhpZ2hsaWdodCA9IHRoaXMuYm9yZGVyID8gdGhpcy5jb2xvci5ib3JkZXJIaWdobGlnaHQgOiB0aGlzLmNvbG9yLmxlZnQ7XG5cbiAgICAgICAgc2lkZVggPSBuZXcgb2JlbGlzay5TaWRlWChcbiAgICAgICAgICAgIG5ldyBvYmVsaXNrLlNpZGVYRGltZW5zaW9uKHRoaXMuZGltZW5zaW9uLnhBeGlzLCB0aGlzLmggLSB0aGlzLmRpbWVuc2lvbi54QXhpcyAvIDIpLFxuICAgICAgICAgICAgbmV3IG9iZWxpc2suU2lkZUNvbG9yKGNvbG9yQm9yZGVyTGVmdCwgdGhpcy5jb2xvci5sZWZ0KVxuICAgICAgICApO1xuXG4gICAgICAgIHBvWCA9IG5ldyBvYmVsaXNrLlBpeGVsT2JqZWN0KHNpZGVYKTtcblxuICAgICAgICBjdHggPSB0aGlzLmJpdG1hcERhdGEuY29udGV4dDtcbiAgICAgICAgY3R4LmRyYXdJbWFnZShwb1guY2FudmFzLCBwb1gueCwgcG9YLnkgKyB0aGlzLmggLSB0aGlzLmRpbWVuc2lvbi54QXhpcyAvIDIpO1xuXG4gICAgICAgIGJtZCA9IG5ldyBvYmVsaXNrLkJpdG1hcERhdGEodGhpcy53LCB0aGlzLmgpO1xuXG4gICAgICAgIC8vIGNsb3NlIHRoZSBwYXRoIGZvciBmbG9vZGZpbGxcbiAgICAgICAgZm9yIChpID0gdGhpcy5oIC0gdGhpcy5kaW1lbnNpb24ueUF4aXMgKiAzIC8gMiArIDI7IGkgPCB0aGlzLmg7IGkgKz0gMSkge1xuICAgICAgICAgICAgYm1kLnNldFBpeGVsKHRoaXMuZGltZW5zaW9uLnhBeGlzIC0gMSwgaSwgY29sb3JCb3JkZXJSaWdodCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyB5IGF4aXNcbiAgICAgICAgZm9yIChqID0gMTsgaiA8IHRoaXMuZGltZW5zaW9uLnlBeGlzOyBqICs9IDEpIHtcbiAgICAgICAgICAgIGJtZC5zZXRQaXhlbCh0aGlzLmRpbWVuc2lvbi54QXhpcyArIGogLSAyLCB0aGlzLmggLSBNYXRoLmZsb29yKGogLyAyKSAtIDEsIGNvbG9yQm9yZGVyUmlnaHQpO1xuICAgICAgICAgICAgYm1kLnNldFBpeGVsKHRoaXMuZGltZW5zaW9uLnhBeGlzICsgaiAtIDIsIHRoaXMuZGltZW5zaW9uLnhBeGlzIC8gMiAtIDIgKyBqLCBjb2xvckJvcmRlclJpZ2h0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGZsb29kIGZpbGxcbiAgICAgICAgYm1kLmZsb29kRmlsbCh0aGlzLmRpbWVuc2lvbi54QXhpcyArIDEsIHRoaXMuaCAtIDMsIHRoaXMuY29sb3IucmlnaHQpO1xuXG4gICAgICAgIC8vaGlnaGxpZ2h0XG4gICAgICAgIGZvciAobiA9IHRoaXMuZGltZW5zaW9uLnhBeGlzIC8gMjsgbiA8IHRoaXMuaCAtIDE7IG4gKz0gMSkge1xuICAgICAgICAgICAgYm1kLnNldFBpeGVsKHRoaXMuZGltZW5zaW9uLnhBeGlzIC0gMSwgbiwgdGhpcy5jb2xvci5yaWdodCk7XG4gICAgICAgICAgICBibWQuc2V0UGl4ZWwodGhpcy5kaW1lbnNpb24ueEF4aXMgLSAyLCBuLCBjb2xvckJvcmRlckhpZ2hsaWdodCk7XG4gICAgICAgIH1cblxuICAgICAgICBibWQuY29udGV4dC5wdXRJbWFnZURhdGEoYm1kLmltYWdlRGF0YSwgMCwgMCk7XG4gICAgICAgIGN0eC5kcmF3SW1hZ2UoYm1kLmNhbnZhcywgMCwgMCk7XG4gICAgfTtcblxuICAgIC8vIHB1YmxpYyBtZXRob2RzXG4gICAgcC50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIFwiW1Nsb3BlTm9ydGhdXCI7XG4gICAgfTtcblxuICAgIG9iZWxpc2suU2xvcGVOb3J0aCA9IFNsb3BlTm9ydGg7XG59KG9iZWxpc2spKTtcblxuLypnbG9iYWwgb2JlbGlzazp0cnVlKi9cblxuLypcbiAqIFNsb3BlIFNvdXRoXG4gKi9cblxuKGZ1bmN0aW9uIChvYmVsaXNrKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICB2YXIgU2xvcGVTb3V0aCwgcDtcbiAgICBTbG9wZVNvdXRoID0gZnVuY3Rpb24gKGRpbWVuc2lvbiwgY29sb3IsIGJvcmRlciwgdXNlRGVmYXVsdENhbnZhcykge1xuICAgICAgICB0aGlzLmluaXRpYWxpemUoZGltZW5zaW9uLCBjb2xvciwgYm9yZGVyLCB1c2VEZWZhdWx0Q2FudmFzKTtcbiAgICB9O1xuICAgIHAgPSBTbG9wZVNvdXRoLnByb3RvdHlwZSA9IG5ldyBvYmVsaXNrLkFic3RyYWN0UHJpbWl0aXZlKCk7XG5cbiAgICAvLyBjb25zdHJ1Y3RvclxuICAgIHAuaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uIChkaW1lbnNpb24sIGNvbG9yLCBib3JkZXIsIHVzZURlZmF1bHRDYW52YXMpIHtcbiAgICAgICAgdGhpcy5pbml0UmVuZGVyKGRpbWVuc2lvbiwgY29sb3IsIGJvcmRlciwgdXNlRGVmYXVsdENhbnZhcyk7XG4gICAgICAgIHRoaXMuaW5pdFJlY3RhbmdsZSgpO1xuICAgICAgICB0aGlzLmluaXRCaXRtYXBEYXRhKCk7XG4gICAgICAgIHRoaXMuYnVpbGQoKTtcbiAgICAgICAgdGhpcy5yZW5kZXJCaXRtYXBEYXRhRm9yQ2FudmFzKCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICAvLyBwcml2YXRlIG1ldGhvZFxuICAgIHAuaW5pdFJlbmRlciA9IGZ1bmN0aW9uIChkaW1lbnNpb24sIGNvbG9yLCBib3JkZXIsIHVzZURlZmF1bHRDYW52YXMpIHtcbiAgICAgICAgdGhpcy51c2VEZWZhdWx0Q2FudmFzID0gdXNlRGVmYXVsdENhbnZhcyB8fCBmYWxzZTtcbiAgICAgICAgdGhpcy5ib3JkZXIgPSBib3JkZXIgfHwgYm9yZGVyID09PSB1bmRlZmluZWQ7XG4gICAgICAgIHRoaXMuZGltZW5zaW9uID0gZGltZW5zaW9uID09PSB1bmRlZmluZWQgPyBuZXcgb2JlbGlzay5TbG9wZURpbWVuc2lvbigpIDogZGltZW5zaW9uO1xuICAgICAgICB0aGlzLmNvbG9yID0gY29sb3IgPT09IHVuZGVmaW5lZCA/IG5ldyBvYmVsaXNrLlNsb3BlQ29sb3IoKSA6IGNvbG9yO1xuICAgIH07XG5cbiAgICBwLmluaXRSZWN0YW5nbGUgPSBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgdGhpcy53ID0gdGhpcy5kaW1lbnNpb24ueEF4aXMgKyB0aGlzLmRpbWVuc2lvbi55QXhpcztcbiAgICAgICAgdGhpcy5oID0gdGhpcy5kaW1lbnNpb24ueEF4aXMgLyAyICsgdGhpcy5kaW1lbnNpb24ueUF4aXMgKiAyO1xuXG4gICAgICAgIC8vIDIyLjYgZGVncmVlcyBpbXBsZW1lbnRhdGlvblxuICAgICAgICB0aGlzLncgLT0gMjtcbiAgICAgICAgdGhpcy5oIC09IDM7XG5cbiAgICAgICAgLy8gdGhlIG1hdHJpeCBvZmZzZXQgYmV0d2VlbiB0aGUgYml0bWFwIGFuZCB0aGUgM2QgcGl4ZWwgY29vcmRpbmF0ZSBaRVJPIHBvaW50XG4gICAgICAgIHRoaXMubWF0cml4ID0gbmV3IG9iZWxpc2suTWF0cml4KCk7XG4gICAgICAgIHRoaXMubWF0cml4LnR4ID0gLSh0aGlzLmRpbWVuc2lvbi55QXhpcyAtIDIpO1xuICAgICAgICB0aGlzLm1hdHJpeC50eSA9IC0odGhpcy5kaW1lbnNpb24ueUF4aXMgKiAzIC8gMiAtIDIpO1xuICAgIH07XG5cbiAgICBwLmluaXRCaXRtYXBEYXRhID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmJpdG1hcERhdGEgPSBuZXcgb2JlbGlzay5CaXRtYXBEYXRhKHRoaXMudywgdGhpcy5oLCB0aGlzLnVzZURlZmF1bHRDYW52YXMpO1xuICAgIH07XG4gICAgcC5yZW5kZXJCaXRtYXBEYXRhRm9yQ2FudmFzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmJpdG1hcERhdGEuY29udGV4dC5wdXRJbWFnZURhdGEodGhpcy5iaXRtYXBEYXRhLmltYWdlRGF0YSwgMCwgMCk7XG4gICAgICAgIHRoaXMuY2FudmFzID0gdGhpcy5iaXRtYXBEYXRhLmNhbnZhcztcbiAgICB9O1xuXG4gICAgcC5idWlsZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGNvbG9yQm9yZGVyTGVmdCwgY29sb3JCb3JkZXJSaWdodCxcbiAgICAgICAgICAgIGksIGosIGssIG0sIG47XG5cbiAgICAgICAgY29sb3JCb3JkZXJMZWZ0ID0gdGhpcy5ib3JkZXIgPyB0aGlzLmNvbG9yLmJvcmRlciA6IHRoaXMuY29sb3IubGVmdFNsb3BlO1xuICAgICAgICBjb2xvckJvcmRlclJpZ2h0ID0gdGhpcy5ib3JkZXIgPyB0aGlzLmNvbG9yLmJvcmRlciA6IHRoaXMuY29sb3IucmlnaHQ7XG5cbiAgICAgICAgLy8geCBheGlzXG4gICAgICAgIGZvciAoaiA9IDA7IGogPCB0aGlzLmRpbWVuc2lvbi54QXhpczsgaiArPSAxKSB7XG4gICAgICAgICAgICB0aGlzLmJpdG1hcERhdGEuc2V0UGl4ZWwoaiwgdGhpcy5kaW1lbnNpb24ueUF4aXMgKiAyICsgTWF0aC5mbG9vcihqIC8gMikgLSAzLCBjb2xvckJvcmRlckxlZnQpO1xuICAgICAgICAgICAgdGhpcy5iaXRtYXBEYXRhLnNldFBpeGVsKGogKyB0aGlzLmRpbWVuc2lvbi55QXhpcyAtIDIsIE1hdGguZmxvb3IoaiAvIDIpLCBjb2xvckJvcmRlckxlZnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8geSBheGlzXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCB0aGlzLmRpbWVuc2lvbi55QXhpczsgaSArPSAxKSB7XG4gICAgICAgICAgICB0aGlzLmJpdG1hcERhdGEuc2V0UGl4ZWwodGhpcy5kaW1lbnNpb24ueEF4aXMgLSAyICsgaSwgdGhpcy5oIC0gTWF0aC5mbG9vcihpIC8gMikgLSAxLCBjb2xvckJvcmRlclJpZ2h0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHogYXhpc1xuICAgICAgICBmb3IgKGsgPSB0aGlzLmRpbWVuc2lvbi54QXhpcyAvIDIgLSAxOyBrIDwgdGhpcy5oIC0gdGhpcy5kaW1lbnNpb24ueUF4aXMgLyAyOyBrICs9IDEpIHtcbiAgICAgICAgICAgIHRoaXMuYml0bWFwRGF0YS5zZXRQaXhlbCh0aGlzLncgLSAxLCBrLCBjb2xvckJvcmRlclJpZ2h0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHNsb3RcbiAgICAgICAgZm9yIChtID0gMDsgbSA8IHRoaXMuZGltZW5zaW9uLnlBeGlzICogMiAtIDI7IG0gKz0gMSkge1xuICAgICAgICAgICAgdGhpcy5iaXRtYXBEYXRhLnNldFBpeGVsKE1hdGguZmxvb3IobSAvIDIpLCB0aGlzLmRpbWVuc2lvbi55QXhpcyAqIDIgLSBtIC0gMywgY29sb3JCb3JkZXJMZWZ0KTtcbiAgICAgICAgICAgIHRoaXMuYml0bWFwRGF0YS5zZXRQaXhlbCh0aGlzLmRpbWVuc2lvbi54QXhpcyAtIDIgKyBNYXRoLmZsb29yKG0gLyAyKSwgdGhpcy5oIC0gbSAtIDEsIGNvbG9yQm9yZGVyTGVmdCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBmbG9vZCBmaWxsXG4gICAgICAgIHRoaXMuYml0bWFwRGF0YS5mbG9vZEZpbGwodGhpcy5kaW1lbnNpb24ueUF4aXMgLSAxLCAxLCB0aGlzLmNvbG9yLmxlZnRTbG9wZSk7XG4gICAgICAgIHRoaXMuYml0bWFwRGF0YS5mbG9vZEZpbGwodGhpcy5kaW1lbnNpb24ueEF4aXMsIHRoaXMuaCAtIDMsIHRoaXMuY29sb3IucmlnaHQpO1xuICAgICAgICAvLyBoYWNrIHNpbmdsZSBwaXhlbFxuICAgICAgICB0aGlzLmJpdG1hcERhdGEuc2V0UGl4ZWwodGhpcy5kaW1lbnNpb24ueEF4aXMgLSAxLCB0aGlzLmggLSAyLCB0aGlzLmNvbG9yLnJpZ2h0KTtcblxuICAgICAgICAvLyBoaWdobGlnaHRcbiAgICAgICAgaWYgKHRoaXMuYm9yZGVyKSB7XG4gICAgICAgICAgICBmb3IgKG4gPSAxOyBuIDwgdGhpcy5kaW1lbnNpb24ueUF4aXMgKiAyIC0gMzsgbiArPSAxKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5iaXRtYXBEYXRhLnNldFBpeGVsKHRoaXMuZGltZW5zaW9uLnhBeGlzIC0gMiArIE1hdGguZmxvb3IobiAvIDIpLCB0aGlzLmggLSBuIC0gMSwgdGhpcy5jb2xvci5ib3JkZXJIaWdobGlnaHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8vIHB1YmxpYyBtZXRob2RzXG4gICAgcC50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIFwiW1Nsb3BlU291dGhdXCI7XG4gICAgfTtcblxuICAgIG9iZWxpc2suU2xvcGVTb3V0aCA9IFNsb3BlU291dGg7XG59KG9iZWxpc2spKTtcblxuLypnbG9iYWwgb2JlbGlzazp0cnVlKi9cblxuLypcbiAqIFNsb3BlIFdlc3RcbiAqL1xuXG4oZnVuY3Rpb24gKG9iZWxpc2spIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHZhciBTbG9wZVdlc3QsIHA7XG4gICAgU2xvcGVXZXN0ID0gZnVuY3Rpb24gKGRpbWVuc2lvbiwgY29sb3IsIGJvcmRlciwgdXNlRGVmYXVsdENhbnZhcykge1xuICAgICAgICB0aGlzLmluaXRpYWxpemUoZGltZW5zaW9uLCBjb2xvciwgYm9yZGVyLCB1c2VEZWZhdWx0Q2FudmFzKTtcbiAgICB9O1xuICAgIHAgPSBTbG9wZVdlc3QucHJvdG90eXBlID0gbmV3IG9iZWxpc2suQWJzdHJhY3RQcmltaXRpdmUoKTtcblxuICAgIC8vIGNvbnN0cnVjdG9yXG4gICAgcC5pbml0aWFsaXplID0gZnVuY3Rpb24gKGRpbWVuc2lvbiwgY29sb3IsIGJvcmRlciwgdXNlRGVmYXVsdENhbnZhcykge1xuICAgICAgICB0aGlzLmluaXRSZW5kZXIoZGltZW5zaW9uLCBjb2xvciwgYm9yZGVyLCB1c2VEZWZhdWx0Q2FudmFzKTtcbiAgICAgICAgdGhpcy5pbml0UmVjdGFuZ2xlKCk7XG4gICAgICAgIHRoaXMuaW5pdEJpdG1hcERhdGEoKTtcbiAgICAgICAgdGhpcy5idWlsZCgpO1xuICAgICAgICB0aGlzLnJlbmRlckJpdG1hcERhdGFGb3JDYW52YXMoKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIC8vIHByaXZhdGUgbWV0aG9kXG4gICAgcC5pbml0UmVuZGVyID0gZnVuY3Rpb24gKGRpbWVuc2lvbiwgY29sb3IsIGJvcmRlciwgdXNlRGVmYXVsdENhbnZhcykge1xuICAgICAgICB0aGlzLnVzZURlZmF1bHRDYW52YXMgPSB1c2VEZWZhdWx0Q2FudmFzIHx8IGZhbHNlO1xuICAgICAgICB0aGlzLmJvcmRlciA9IGJvcmRlciB8fCBib3JkZXIgPT09IHVuZGVmaW5lZDtcbiAgICAgICAgdGhpcy5kaW1lbnNpb24gPSBkaW1lbnNpb24gPT09IHVuZGVmaW5lZCA/IG5ldyBvYmVsaXNrLlNsb3BlRGltZW5zaW9uKCkgOiBkaW1lbnNpb247XG4gICAgICAgIHRoaXMuY29sb3IgPSBjb2xvciA9PT0gdW5kZWZpbmVkID8gbmV3IG9iZWxpc2suU2xvcGVDb2xvcigpIDogY29sb3I7XG4gICAgfTtcblxuICAgIHAuaW5pdFJlY3RhbmdsZSA9IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICB0aGlzLncgPSB0aGlzLmRpbWVuc2lvbi54QXhpcyArIHRoaXMuZGltZW5zaW9uLnlBeGlzO1xuICAgICAgICB0aGlzLmggPSB0aGlzLmRpbWVuc2lvbi54QXhpcyAqIDMgLyAyICsgdGhpcy5kaW1lbnNpb24ueUF4aXMgLyAyO1xuXG4gICAgICAgIC8vIDIyLjYgZGVncmVlcyBpbXBsZW1lbnRhdGlvblxuICAgICAgICB0aGlzLncgLT0gMjtcbiAgICAgICAgdGhpcy5oIC09IDM7XG5cbiAgICAgICAgLy8gdGhlIG1hdHJpeCBvZmZzZXQgYmV0d2VlbiB0aGUgYml0bWFwIGFuZCB0aGUgM2QgcGl4ZWwgY29vcmRpbmF0ZSBaRVJPIHBvaW50XG4gICAgICAgIHRoaXMubWF0cml4ID0gbmV3IG9iZWxpc2suTWF0cml4KCk7XG4gICAgICAgIHRoaXMubWF0cml4LnR4ID0gLSh0aGlzLmRpbWVuc2lvbi55QXhpcyAtIDIpO1xuICAgICAgICB0aGlzLm1hdHJpeC50eSA9IC0odGhpcy5kaW1lbnNpb24ueEF4aXMgLSAyKTtcbiAgICB9O1xuXG4gICAgcC5pbml0Qml0bWFwRGF0YSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5iaXRtYXBEYXRhID0gbmV3IG9iZWxpc2suQml0bWFwRGF0YSh0aGlzLncsIHRoaXMuaCwgdGhpcy51c2VEZWZhdWx0Q2FudmFzKTtcbiAgICB9O1xuICAgIHAucmVuZGVyQml0bWFwRGF0YUZvckNhbnZhcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5jYW52YXMgPSB0aGlzLmJpdG1hcERhdGEuY2FudmFzO1xuICAgIH07XG5cbiAgICBwLmJ1aWxkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgY29sb3JCb3JkZXJMZWZ0LCBjb2xvckJvcmRlclJpZ2h0LCBjb2xvckJvcmRlckhpZ2hsaWdodCxcbiAgICAgICAgICAgIHNpZGVZLCBwb1ksIGN0eCwgYm1kLFxuICAgICAgICAgICAgaSwgaiwgbjtcblxuICAgICAgICBjb2xvckJvcmRlckxlZnQgPSB0aGlzLmJvcmRlciA/IHRoaXMuY29sb3IuYm9yZGVyIDogdGhpcy5jb2xvci5sZWZ0O1xuICAgICAgICBjb2xvckJvcmRlclJpZ2h0ID0gdGhpcy5ib3JkZXIgPyB0aGlzLmNvbG9yLmJvcmRlciA6IHRoaXMuY29sb3IucmlnaHQ7XG4gICAgICAgIGNvbG9yQm9yZGVySGlnaGxpZ2h0ID0gdGhpcy5ib3JkZXIgPyB0aGlzLmNvbG9yLmJvcmRlckhpZ2hsaWdodCA6IHRoaXMuY29sb3IubGVmdDtcblxuICAgICAgICBzaWRlWSA9IG5ldyBvYmVsaXNrLlNpZGVZKFxuICAgICAgICAgICAgbmV3IG9iZWxpc2suU2lkZVlEaW1lbnNpb24odGhpcy5kaW1lbnNpb24ueUF4aXMsIHRoaXMuaCAtIHRoaXMuZGltZW5zaW9uLnlBeGlzIC8gMiksXG4gICAgICAgICAgICBuZXcgb2JlbGlzay5TaWRlQ29sb3IoY29sb3JCb3JkZXJSaWdodCwgdGhpcy5jb2xvci5yaWdodClcbiAgICAgICAgKTtcblxuICAgICAgICBwb1kgPSBuZXcgb2JlbGlzay5QaXhlbE9iamVjdChzaWRlWSk7XG5cbiAgICAgICAgY3R4ID0gdGhpcy5iaXRtYXBEYXRhLmNvbnRleHQ7XG4gICAgICAgIGN0eC5kcmF3SW1hZ2UocG9ZLmNhbnZhcywgcG9ZLnggKyB0aGlzLncgLSAyLCBwb1kueSArIHRoaXMuaCAtIHRoaXMuZGltZW5zaW9uLnlBeGlzIC8gMik7XG5cbiAgICAgICAgYm1kID0gbmV3IG9iZWxpc2suQml0bWFwRGF0YSh0aGlzLncsIHRoaXMuaCk7XG5cbiAgICAgICAgLy8gY2xvc2UgdGhlIHBhdGggZm9yIGZsb29kZmlsbFxuICAgICAgICBmb3IgKGkgPSB0aGlzLmggLSB0aGlzLmRpbWVuc2lvbi54QXhpcyAqIDMgLyAyICsgMjsgaSA8IHRoaXMuaDsgaSArPSAxKSB7XG4gICAgICAgICAgICBibWQuc2V0UGl4ZWwodGhpcy5kaW1lbnNpb24ueEF4aXMgLSAyLCBpLCBjb2xvckJvcmRlckxlZnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy94IGF4aXNcbiAgICAgICAgZm9yIChqID0gMDsgaiA8IHRoaXMuZGltZW5zaW9uLnhBeGlzIC0gMTsgaiArPSAxKSB7XG4gICAgICAgICAgICBibWQuc2V0UGl4ZWwoaiwgdGhpcy5kaW1lbnNpb24ueEF4aXMgKyB0aGlzLmRpbWVuc2lvbi55QXhpcyAvIDIgLSAzICsgTWF0aC5mbG9vcihqIC8gMiksIGNvbG9yQm9yZGVyTGVmdCk7XG4gICAgICAgICAgICBibWQuc2V0UGl4ZWwoaiwgdGhpcy5kaW1lbnNpb24ueEF4aXMgKyB0aGlzLmRpbWVuc2lvbi55QXhpcyAvIDIgLSAzIC0gaiwgY29sb3JCb3JkZXJMZWZ0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGZsb29kIGZpbGxcbiAgICAgICAgYm1kLmZsb29kRmlsbCh0aGlzLmRpbWVuc2lvbi54QXhpcyAtIDMsIHRoaXMuaCAtIDMsIHRoaXMuY29sb3IubGVmdCk7XG5cbiAgICAgICAgLy9oaWdobGlnaHRcbiAgICAgICAgZm9yIChuID0gdGhpcy5kaW1lbnNpb24ueUF4aXMgLyAyOyBuIDwgdGhpcy5oIC0gMTsgbiArPSAxKSB7XG4gICAgICAgICAgICBibWQuc2V0UGl4ZWwodGhpcy5kaW1lbnNpb24ueEF4aXMgLSAyLCBuLCBjb2xvckJvcmRlckhpZ2hsaWdodCk7XG4gICAgICAgIH1cblxuICAgICAgICBibWQuY29udGV4dC5wdXRJbWFnZURhdGEoYm1kLmltYWdlRGF0YSwgMCwgMCk7XG4gICAgICAgIGN0eC5kcmF3SW1hZ2UoYm1kLmNhbnZhcywgMCwgMCk7XG4gICAgfTtcblxuICAgIC8vIHB1YmxpYyBtZXRob2RzXG4gICAgcC50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIFwiW1Nsb3BlV2VzdF1cIjtcbiAgICB9O1xuXG4gICAgb2JlbGlzay5TbG9wZVdlc3QgPSBTbG9wZVdlc3Q7XG59KG9iZWxpc2spKTtcblxuLypnbG9iYWwgb2JlbGlzazp0cnVlLCBkb2N1bWVudDp0cnVlKi9cblxuLypcbiAqIENhbnZhc01hbmFnZXJcbiAqL1xuXG4oZnVuY3Rpb24gKG9iZWxpc2ssIGRvY3VtZW50KSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICB2YXIgQ2FudmFzTWFuYWdlciwgcDtcbiAgICBDYW52YXNNYW5hZ2VyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NvbG9yR2VvbSBpcyBhIHN0YXRpYyBDbGFzcywgY2Fubm90IGJlIGluc3RhbmNlZC4nKTtcbiAgICB9O1xuICAgIHAgPSBDYW52YXNNYW5hZ2VyO1xuXG4gICAgLy8gcHVibGljIHByb3BlcnRpZXNcbiAgICBwLmRlZmF1bHRDYW52YXMgPSBudWxsO1xuXG4gICAgLy8gcHVibGljIG1ldGhvZHNcbiAgICBwLmdldERlZmF1bHRDYW52YXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHAuZGVmYXVsdENhbnZhcyA9IHAuZGVmYXVsdENhbnZhcyB8fCBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgICAgICAgcmV0dXJuIHAuZGVmYXVsdENhbnZhcztcbiAgICB9O1xuXG4gICAgcC5nZXROZXdDYW52YXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgICB9O1xuXG4gICAgcC50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIFwiW0NhbnZhc01hbmFnZXJdXCI7XG4gICAgfTtcblxuICAgIG9iZWxpc2suQ2FudmFzTWFuYWdlciA9IENhbnZhc01hbmFnZXI7XG59KG9iZWxpc2ssIGRvY3VtZW50KSk7XG5cbi8qZ2xvYmFsIG9iZWxpc2s6dHJ1ZSovXG5cbi8qXG4gKiBDYW52YXNUb29sXG4gKi9cblxuKGZ1bmN0aW9uIChvYmVsaXNrKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICB2YXIgQ2FudmFzVG9vbCwgcDtcblxuICAgIENhbnZhc1Rvb2wgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignQ2FudmFzVG9vbCBpcyBhIHN0YXRpYyBDbGFzcywgY2Fubm90IGJlIGluc3RhbmNlZC4nKTtcbiAgICB9O1xuICAgIHAgPSBDYW52YXNUb29sO1xuXG4gICAgLy8gcHVibGljIG1ldGhvZHNcbiAgICBwLmdldFBpeGVsID0gZnVuY3Rpb24gKGltYWdlRGF0YSwgeCwgeSkge1xuICAgICAgICB2YXIgZGF0YSwgaW5kZXgsIHIsIGcsIGI7XG4gICAgICAgIGRhdGEgPSBpbWFnZURhdGEuZGF0YTtcbiAgICAgICAgaW5kZXggPSAoeSAqIGltYWdlRGF0YS53aWR0aCArIHgpICogNDtcbiAgICAgICAgciA9IGRhdGFbaW5kZXhdO1xuICAgICAgICBnID0gZGF0YVtpbmRleCArIDFdO1xuICAgICAgICBiID0gZGF0YVtpbmRleCArIDJdO1xuXG4gICAgICAgIHJldHVybiAoKHIgPDwgMTYpIHwgKGcgPDwgOCkgfCBiKTtcbiAgICB9O1xuXG4gICAgcC50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIFwiW0NhbnZhc1Rvb2xdXCI7XG4gICAgfTtcblxuICAgIG9iZWxpc2suQ2FudmFzVG9vbCA9IENhbnZhc1Rvb2w7XG59KG9iZWxpc2spKTtcblxuLypnbG9iYWwgb2JlbGlzazp0cnVlKi9cblxuLypcbiAqIENvbG9yR2VvbVxuICovXG5cbihmdW5jdGlvbiAob2JlbGlzaykge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgdmFyIENvbG9yR2VvbSwgcDtcblxuICAgIENvbG9yR2VvbSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDb2xvckdlb20gaXMgYSBzdGF0aWMgQ2xhc3MsIGNhbm5vdCBiZSBpbnN0YW5jZWQuJyk7XG4gICAgfTtcbiAgICBwID0gQ29sb3JHZW9tO1xuXG4gICAgLy8gcHVibGljIG1ldGhvZHNcbiAgICBwLmdldDMyID0gZnVuY3Rpb24gKGNvbG9yKSB7XG4gICAgICAgIHJldHVybiBjb2xvciA8IDB4RkYwMDAwMDAgPyAoY29sb3IgKyAweEZGMDAwMDAwKSA6IGNvbG9yO1xuICAgIH07XG5cbiAgICBwLmFwcGx5QnJpZ2h0bmVzcyA9IGZ1bmN0aW9uIChjb2xvciwgYnJpZ2h0bmVzcywgaGlnaGxpZ2h0KSB7XG4gICAgICAgIHZhciBhLCByLCBnLCBiLCB5LCB2LCB1O1xuICAgICAgICBhID0gKChjb2xvciA+Pj4gMjQpICYgMHgwMDAwMDBGRik7XG4gICAgICAgIHIgPSAoKGNvbG9yID4+PiAxNikgJiAweDAwMDAwMEZGKTtcbiAgICAgICAgZyA9ICgoY29sb3IgPj4+IDgpICYgMHgwMDAwMDBGRik7XG4gICAgICAgIGIgPSAoY29sb3IgJiAweDAwMDAwMEZGKTtcblxuICAgICAgICB5ID0gKChyICogMzEzNTI0KSA+PiAyMCkgKyAoKGcgKiA2MTU1MTQpID4+IDIwKSArICgoYiAqIDExOTUzOCkgPj4gMjApO1xuICAgICAgICB1ID0gLSgoMTU1MTg5ICogcikgPj4gMjApIC0gKCgzMDMwMzggKiBnKSA+PiAyMCkgKyAoKDQ1ODIyNyAqIGIpID4+IDIwKTtcbiAgICAgICAgdiA9ICgoNjQ0ODc0ICogcikgPj4gMjApIC0gKCg1NDAwMTYgKiBnKSA+PiAyMCkgLSAoKDEwNDg1NyAqIGIpID4+IDIwKTtcblxuICAgICAgICBpZiAoIWhpZ2hsaWdodCkge1xuICAgICAgICAgICAgeSArPSBicmlnaHRuZXNzO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgeSA9IDYwICsgTWF0aC5wb3coeSwgMS4yKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHIgPSB5ICsgKCgxMTk1Mzc2ICogdikgPj4gMjApO1xuICAgICAgICBnID0geSAtICgoNDA4OTQ0ICogdSkgPj4gMjApIC0gKCg2MDgxNzQgKiB2KSA+PiAyMCk7XG4gICAgICAgIGIgPSB5ICsgKCgyMTI4NjA5ICogdSkgPj4gMjApO1xuXG4gICAgICAgIHIgPSBNYXRoLm1heCgwLCBNYXRoLm1pbihyLCAyNTUpKTtcbiAgICAgICAgZyA9IE1hdGgubWF4KDAsIE1hdGgubWluKGcsIDI1NSkpO1xuICAgICAgICBiID0gTWF0aC5tYXgoMCwgTWF0aC5taW4oYiwgMjU1KSk7XG5cbiAgICAgICAgcmV0dXJuIChhIDw8IDI0KSB8IChyIDw8IDE2KSB8IChnIDw8IDgpIHwgYjtcbiAgICB9O1xuXG4gICAgcC50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIFwiW0NvbG9yR2VvbV1cIjtcbiAgICB9O1xuXG4gICAgb2JlbGlzay5Db2xvckdlb20gPSBDb2xvckdlb207XG59KG9iZWxpc2spKTtcblxuLypnbG9iYWwgb2JlbGlzazp0cnVlKi9cblxuLypcbiAqIENvbG9yUGF0dGVyblxuICovXG5cbihmdW5jdGlvbiAob2JlbGlzaykge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgdmFyIENvbG9yUGF0dHJlbiwgcDtcblxuICAgIENvbG9yUGF0dHJlbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDb2xvckdlb20gaXMgYSBzdGF0aWMgQ2xhc3MsIGNhbm5vdCBiZSBpbnN0YW5jZWQuJyk7XG4gICAgfTtcbiAgICBwID0gQ29sb3JQYXR0cmVuO1xuXG4gICAgLy8gcHVibGljIHByb3BlcnRpZXNcbiAgICBwLkdSQVNTX0dSRUVOID0gMHhDQ0ZGMDA7XG4gICAgcC5ZRUxMT1cgPSAweEZGRkYwMDtcbiAgICBwLldJTkVfUkVEID0gMHhGRjAwOTk7XG4gICAgcC5QSU5LID0gMHhGRjdDQkY7XG4gICAgcC5QVVJQTEUgPSAweENDMDBGRjtcbiAgICBwLkJMVUUgPSAweDAwQ0NGRjtcbiAgICBwLkdSQVkgPSAweEVFRUVFRTtcbiAgICBwLkJMQUNLID0gMHg2NjY2NjY7XG4gICAgcC5GSU5FX0NPTE9SUyA9XG4gICAgICAgIFtcbiAgICAgICAgICAgIHAuR1JBU1NfR1JFRU4sXG4gICAgICAgICAgICBwLllFTExPVyxcbiAgICAgICAgICAgIHAuV0lORV9SRUQsXG4gICAgICAgICAgICBwLlBJTkssXG4gICAgICAgICAgICBwLlBVUlBMRSxcbiAgICAgICAgICAgIHAuQkxVRSxcbiAgICAgICAgICAgIHAuR1JBWSxcbiAgICAgICAgICAgIHAuQkxBQ0tcbiAgICAgICAgXTtcblxuICAgIC8vIHB1YmxpYyBtZXRob2RzXG4gICAgcC5nZXRSYW5kb21Db21mb3J0YWJsZUNvbG9yID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gcC5GSU5FX0NPTE9SU1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBwLkZJTkVfQ09MT1JTLmxlbmd0aCldO1xuICAgIH07XG5cbiAgICBwLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gXCJbQ29sb3JQYXR0ZXJuXVwiO1xuICAgIH07XG5cbiAgICBvYmVsaXNrLkNvbG9yUGF0dGVybiA9IENvbG9yUGF0dHJlbjtcbn0ob2JlbGlzaykpO1xuXG47IGJyb3dzZXJpZnlfc2hpbV9fZGVmaW5lX19tb2R1bGVfX2V4cG9ydF9fKHR5cGVvZiBvYmVsaXNrICE9IFwidW5kZWZpbmVkXCIgPyBvYmVsaXNrIDogd2luZG93Lm9iZWxpc2spO1xuXG59KS5jYWxsKGdsb2JhbCwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBmdW5jdGlvbiBkZWZpbmVFeHBvcnQoZXgpIHsgbW9kdWxlLmV4cG9ydHMgPSBleDsgfSk7XG4iLCJpbXBvcnQgb2JlbGlzayBmcm9tICdvYmVsaXNrLmpzJztcbmltcG9ydCB5YW1sIGZyb20gJ2pzLXlhbWwnO1xuXG4vKipcbiAqIEBjb25zdGFudCBERUZBVUxUX1NJWkVcbiAqIEB0eXBlIHtOdW1iZXJ9XG4gKi9cbmNvbnN0IERFRkFVTFRfU0laRSA9IDEwO1xuXG4vKipcbiAqIEBjb25zdGFudCBDT0xPVVJfTUFQXG4gKiBAdHlwZSB7T2JqZWN0fVxuICovXG5jb25zdCBDT0xPVVJfTUFQID0ge1xuICAgIGRhcmtCcm93bjogbmV3IG9iZWxpc2suQ3ViZUNvbG9yKCkuZ2V0QnlIb3Jpem9udGFsQ29sb3IoMHg3MDRBM0EpLFxuICAgIGxpZ2h0QnJvd246IG5ldyBvYmVsaXNrLkN1YmVDb2xvcigpLmdldEJ5SG9yaXpvbnRhbENvbG9yKDB4RURDRTkzKVxufTtcblxuLyoqXG4gKiBAbW9kdWxlIEdpcmFmZmVcbiAqIEBhdXRob3IgQWRhbSBUaW1iZXJsYWtlXG4gKiBAbGluayBodHRwczovL2dpdGh1Yi5jb20vV2lsZGhvbmV5L0dpcmFmZmVcbiAqIEBsaW5rIGh0dHA6Ly9naXJhZmZlLWFwcC5oZXJva3VhcHAuY29tL1xuICogQGxpY2VuY2UgTUlUXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdpcmFmZmUge1xuXG4gICAgLyoqXG4gICAgICogQGNvbnN0YW50IEVMRU1FTlRcbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAqL1xuICAgIHN0YXRpYyBFTEVNRU5UID0gJ2NhbnZhcy5naXJhZmZlJztcblxuICAgIC8qKlxuICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAqIEByZXR1cm4ge0dpcmFmZmV9XG4gICAgICovXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMucmVuZGVyTW9kZWwoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbWV0aG9kIGdldE1vZGVsXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGZpbGVuYW1lXG4gICAgICogQHJldHVybiB7UHJvbWlzZX1cbiAgICAgKi9cbiAgICBnZXRNb2RlbChmaWxlbmFtZSkge1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbWV0aG9kIHBhcnNlSXRlbVxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gaXRlbVxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdHxOdW1iZXJ9IG1vZGVsXG4gICAgICAgICAqIEByZXR1cm4ge051bWJlcn1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IHBhcnNlSXRlbSA9IChpdGVtLCBtb2RlbCkgPT4ge1xuXG4gICAgICAgICAgICBpZiAodHlwZW9mIG1vZGVsID09PSAndW5kZWZpbmVkJykgcmV0dXJuIERFRkFVTFRfU0laRTtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgbW9kZWwgPT09ICdvYmplY3QnKSAgICByZXR1cm4gTnVtYmVyKChtb2RlbFtpdGVtXSB8fCAxKSAqIERFRkFVTFRfU0laRSk7XG4gICAgICAgICAgICBlbHNlICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIE51bWJlcihtb2RlbCAqIERFRkFVTFRfU0laRSk7XG5cbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1ldGhvZCBwYXJzZU1vZGVsXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBtb2RlbFxuICAgICAgICAgKiBAcmV0dXJuIHtBcnJheX1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IHBhcnNlTW9kZWwgPSBtb2RlbCA9PiB7XG5cbiAgICAgICAgICAgIHJldHVybiBtb2RlbC5yZWR1Y2UoKGFjY3VtdWxhdG9yLCB7Y29sb3VyLCBzaXplLCBwb3NpdGlvbn0pID0+IHtcblxuICAgICAgICAgICAgICAgIGFjY3VtdWxhdG9yLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICBjb2xvdXI6IENPTE9VUl9NQVBbY29sb3VyXSxcbiAgICAgICAgICAgICAgICAgICAgc2l6ZTogeyB4OiBwYXJzZUl0ZW0oJ3gnLCBzaXplKSwgeTogcGFyc2VJdGVtKCd5Jywgc2l6ZSksIHo6IHBhcnNlSXRlbSgneicsIHNpemUpIH0sXG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiB7IHg6IHBhcnNlSXRlbSgneCcsIHBvc2l0aW9uKSwgeTogcGFyc2VJdGVtKCd5JywgcG9zaXRpb24pLCB6OiBwYXJzZUl0ZW0oJ3onLCBwb3NpdGlvbikgfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGFjY3VtdWxhdG9yO1xuXG4gICAgICAgICAgICB9LCBbXSk7XG5cbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gZmV0Y2goYC4vbW9kZWwvJHtmaWxlbmFtZX1gKVxuICAgICAgICAgICAgLnRoZW4oZGF0YSA9PiBkYXRhLnRleHQoKSlcbiAgICAgICAgICAgIC50aGVuKGRhdGEgPT4geWFtbC5sb2FkKGRhdGEpKVxuICAgICAgICAgICAgLnRoZW4oZGF0YSA9PiBwYXJzZU1vZGVsKGRhdGEpKTtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBtZXRob2QgcmVuZGVyTW9kZWxcbiAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAqL1xuICAgIHJlbmRlck1vZGVsKCkge1xuXG4gICAgICAgIGNvbnN0IGNhbnZhcyAgICA9IHRoaXMuZ2V0RWxlbWVudCgpO1xuICAgICAgICBjb25zdCBwb2ludCAgICAgPSBuZXcgb2JlbGlzay5Qb2ludCgyMDAsIDIwMCk7XG4gICAgICAgIGNvbnN0IHBpeGVsVmlldyA9IG5ldyBvYmVsaXNrLlBpeGVsVmlldyhjYW52YXMsIHBvaW50KTtcblxuICAgICAgICB0aGlzLmdldE1vZGVsKCdHaXJhZmZlLnltbCcpLnRoZW4obW9kZWwgPT4ge1xuXG4gICAgICAgICAgICBtb2RlbC5mb3JFYWNoKCh7IGNvbG91ciwgc2l6ZSwgcG9zaXRpb24gfSkgPT4ge1xuXG4gICAgICAgICAgICAgICAgY29uc3Qgc2hhcGVNb2RlbCAgICA9IG5ldyBvYmVsaXNrLkN1YmVEaW1lbnNpb24oc2l6ZS54LCBzaXplLnksIHNpemUueik7XG4gICAgICAgICAgICAgICAgY29uc3QgcG9zaXRpb25Nb2RlbCA9IG5ldyBvYmVsaXNrLlBvaW50M0QocG9zaXRpb24ueCwgcG9zaXRpb24ueSwgcG9zaXRpb24ueik7XG5cbiAgICAgICAgICAgICAgICBwaXhlbFZpZXcucmVuZGVyT2JqZWN0KG5ldyBvYmVsaXNrLkN1YmUoc2hhcGVNb2RlbCwgY29sb3VyLCB0cnVlKSwgcG9zaXRpb25Nb2RlbCk7XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvL09iamVjdC5rZXlzKG1vZGVsKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICAgICAgICAvLyAgICAvL21vZGVsW2tleV0uZm9yRWFjaChjb21wb25lbnQgPT4gcGl4ZWxWaWV3LnJlbmRlck9iamVjdChjb21wb25lbnRbMF0sIGNvbXBvbmVudFsxXSkpO1xuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIC8vICAgIG1vZGVsW2tleV0uZm9yRWFjaCgoeyBjb2xvdXIsIHNpemUsIHBvc2l0aW9uIH0pID0+IHtcbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAvLyAgICAgICAgY29uc3Qgc2hhcGVNb2RlbCAgICA9IG5ldyBvYmVsaXNrLkN1YmVEaW1lbnNpb24oc2l6ZS54LCBzaXplLnksIHNpemUueik7XG4gICAgICAgICAgICAvLyAgICAgICAgY29uc3QgcG9zaXRpb25Nb2RlbCA9IG5ldyBvYmVsaXNrLlBvaW50M0QocG9zaXRpb24ueCwgcG9zaXRpb24ueSwgcG9zaXRpb24ueik7XG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgLy8gICAgICAgIHBpeGVsVmlldy5yZW5kZXJPYmplY3QobmV3IG9iZWxpc2suQ3ViZShzaGFwZU1vZGVsLCBjb2xvdXIsIHRydWUpLCBwb3NpdGlvbk1vZGVsKTtcbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAvLyAgICB9KTtcbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAvLyAgICAvL2NvbnN0IGNvbG9yICA9IG5ldyBvYmVsaXNrLlNsb3BlQ29sb3IoKS5nZXRCeUhvcml6b250YWxDb2xvcigweEVEQ0U5Myk7XG4gICAgICAgICAgICAvLyAgICAvL1xuICAgICAgICAgICAgLy8gICAgLy92YXIgZGltZW5zaW9uU291dGggPSBuZXcgb2JlbGlzay5TbG9wZURpbWVuc2lvbihTSVpFLCBTSVpFKTtcbiAgICAgICAgICAgIC8vICAgIC8vXG4gICAgICAgICAgICAvLyAgICAvL1xuICAgICAgICAgICAgLy8gICAgLy92YXIgc2xvcGVTb3V0aCA9IG5ldyBvYmVsaXNrLlNsb3BlU291dGgoZGltZW5zaW9uU291dGgsIGNvbG9yKTtcbiAgICAgICAgICAgIC8vICAgIC8vdmFyIHAzZFNvdXRoICAgPSBuZXcgb2JlbGlzay5Qb2ludDNEKDgwLCA1MCwgNTApO1xuICAgICAgICAgICAgLy8gICAgLy9waXhlbFZpZXcucmVuZGVyT2JqZWN0KHNsb3BlU291dGgsIHAzZFNvdXRoKTtcbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAvL30pO1xuXG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG1ldGhvZCBnZXRFbGVtZW50XG4gICAgICogQHJldHVybiB7RWxlbWVudH1cbiAgICAgKi9cbiAgICBnZXRFbGVtZW50KCkge1xuXG4gICAgICAgIGNvbnN0IGNhbnZhcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoR2lyYWZmZS5FTEVNRU5UKTtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHJlc2l6ZUNhbnZhcywgZmFsc2UpO1xuXG4gICAgICAgIGZ1bmN0aW9uIHJlc2l6ZUNhbnZhcygpIHtcbiAgICAgICAgICAgIGNhbnZhcy53aWR0aCAgPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgICAgICAgICAgIGNhbnZhcy5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXNpemVDYW52YXMoKTtcbiAgICAgICAgcmV0dXJuIGNhbnZhcztcblxuICAgIH1cblxufVxuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4gbmV3IEdpcmFmZmUoKSk7XG4iXX0=
