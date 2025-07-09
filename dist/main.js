/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/anymatch/index.js":
/*!****************************************!*\
  !*** ./node_modules/anymatch/index.js ***!
  \****************************************/
/***/ ((module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({ value: true }));

const picomatch = __webpack_require__(/*! picomatch */ "./node_modules/picomatch/index.js");
const normalizePath = __webpack_require__(/*! normalize-path */ "./node_modules/normalize-path/index.js");

/**
 * @typedef {(testString: string) => boolean} AnymatchFn
 * @typedef {string|RegExp|AnymatchFn} AnymatchPattern
 * @typedef {AnymatchPattern|AnymatchPattern[]} AnymatchMatcher
 */
const BANG = '!';
const DEFAULT_OPTIONS = {returnIndex: false};
const arrify = (item) => Array.isArray(item) ? item : [item];

/**
 * @param {AnymatchPattern} matcher
 * @param {object} options
 * @returns {AnymatchFn}
 */
const createPattern = (matcher, options) => {
  if (typeof matcher === 'function') {
    return matcher;
  }
  if (typeof matcher === 'string') {
    const glob = picomatch(matcher, options);
    return (string) => matcher === string || glob(string);
  }
  if (matcher instanceof RegExp) {
    return (string) => matcher.test(string);
  }
  return (string) => false;
};

/**
 * @param {Array<Function>} patterns
 * @param {Array<Function>} negPatterns
 * @param {String|Array} args
 * @param {Boolean} returnIndex
 * @returns {boolean|number}
 */
const matchPatterns = (patterns, negPatterns, args, returnIndex) => {
  const isList = Array.isArray(args);
  const _path = isList ? args[0] : args;
  if (!isList && typeof _path !== 'string') {
    throw new TypeError('anymatch: second argument must be a string: got ' +
      Object.prototype.toString.call(_path))
  }
  const path = normalizePath(_path, false);

  for (let index = 0; index < negPatterns.length; index++) {
    const nglob = negPatterns[index];
    if (nglob(path)) {
      return returnIndex ? -1 : false;
    }
  }

  const applied = isList && [path].concat(args.slice(1));
  for (let index = 0; index < patterns.length; index++) {
    const pattern = patterns[index];
    if (isList ? pattern(...applied) : pattern(path)) {
      return returnIndex ? index : true;
    }
  }

  return returnIndex ? -1 : false;
};

/**
 * @param {AnymatchMatcher} matchers
 * @param {Array|string} testString
 * @param {object} options
 * @returns {boolean|number|Function}
 */
const anymatch = (matchers, testString, options = DEFAULT_OPTIONS) => {
  if (matchers == null) {
    throw new TypeError('anymatch: specify first argument');
  }
  const opts = typeof options === 'boolean' ? {returnIndex: options} : options;
  const returnIndex = opts.returnIndex || false;

  // Early cache for matchers.
  const mtchers = arrify(matchers);
  const negatedGlobs = mtchers
    .filter(item => typeof item === 'string' && item.charAt(0) === BANG)
    .map(item => item.slice(1))
    .map(item => picomatch(item, opts));
  const patterns = mtchers
    .filter(item => typeof item !== 'string' || (typeof item === 'string' && item.charAt(0) !== BANG))
    .map(matcher => createPattern(matcher, opts));

  if (testString == null) {
    return (testString, ri = false) => {
      const returnIndex = typeof ri === 'boolean' ? ri : false;
      return matchPatterns(patterns, negatedGlobs, testString, returnIndex);
    }
  }

  return matchPatterns(patterns, negatedGlobs, testString, returnIndex);
};

anymatch.default = anymatch;
module.exports = anymatch;


/***/ }),

/***/ "./node_modules/binary-extensions/binary-extensions.json":
/*!***************************************************************!*\
  !*** ./node_modules/binary-extensions/binary-extensions.json ***!
  \***************************************************************/
/***/ ((module) => {

"use strict";
module.exports = /*#__PURE__*/JSON.parse('["3dm","3ds","3g2","3gp","7z","a","aac","adp","afdesign","afphoto","afpub","ai","aif","aiff","alz","ape","apk","appimage","ar","arj","asf","au","avi","bak","baml","bh","bin","bk","bmp","btif","bz2","bzip2","cab","caf","cgm","class","cmx","cpio","cr2","cur","dat","dcm","deb","dex","djvu","dll","dmg","dng","doc","docm","docx","dot","dotm","dra","DS_Store","dsk","dts","dtshd","dvb","dwg","dxf","ecelp4800","ecelp7470","ecelp9600","egg","eol","eot","epub","exe","f4v","fbs","fh","fla","flac","flatpak","fli","flv","fpx","fst","fvt","g3","gh","gif","graffle","gz","gzip","h261","h263","h264","icns","ico","ief","img","ipa","iso","jar","jpeg","jpg","jpgv","jpm","jxr","key","ktx","lha","lib","lvp","lz","lzh","lzma","lzo","m3u","m4a","m4v","mar","mdi","mht","mid","midi","mj2","mka","mkv","mmr","mng","mobi","mov","movie","mp3","mp4","mp4a","mpeg","mpg","mpga","mxu","nef","npx","numbers","nupkg","o","odp","ods","odt","oga","ogg","ogv","otf","ott","pages","pbm","pcx","pdb","pdf","pea","pgm","pic","png","pnm","pot","potm","potx","ppa","ppam","ppm","pps","ppsm","ppsx","ppt","pptm","pptx","psd","pya","pyc","pyo","pyv","qt","rar","ras","raw","resources","rgb","rip","rlc","rmf","rmvb","rpm","rtf","rz","s3m","s7z","scpt","sgi","shar","snap","sil","sketch","slk","smv","snk","so","stl","suo","sub","swf","tar","tbz","tbz2","tga","tgz","thmx","tif","tiff","tlz","ttc","ttf","txz","udf","uvh","uvi","uvm","uvp","uvs","uvu","viv","vob","war","wav","wax","wbmp","wdp","weba","webm","webp","whl","wim","wm","wma","wmv","wmx","woff","woff2","wrm","wvx","xbm","xif","xla","xlam","xls","xlsb","xlsm","xlsx","xlt","xltm","xltx","xm","xmind","xpi","xpm","xwd","xz","z","zip","zipx"]');

/***/ }),

/***/ "./node_modules/binary-extensions/index.js":
/*!*************************************************!*\
  !*** ./node_modules/binary-extensions/index.js ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__(/*! ./binary-extensions.json */ "./node_modules/binary-extensions/binary-extensions.json");


/***/ }),

/***/ "./node_modules/braces/index.js":
/*!**************************************!*\
  !*** ./node_modules/braces/index.js ***!
  \**************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const stringify = __webpack_require__(/*! ./lib/stringify */ "./node_modules/braces/lib/stringify.js");
const compile = __webpack_require__(/*! ./lib/compile */ "./node_modules/braces/lib/compile.js");
const expand = __webpack_require__(/*! ./lib/expand */ "./node_modules/braces/lib/expand.js");
const parse = __webpack_require__(/*! ./lib/parse */ "./node_modules/braces/lib/parse.js");

/**
 * Expand the given pattern or create a regex-compatible string.
 *
 * ```js
 * const braces = require('braces');
 * console.log(braces('{a,b,c}', { compile: true })); //=> ['(a|b|c)']
 * console.log(braces('{a,b,c}')); //=> ['a', 'b', 'c']
 * ```
 * @param {String} `str`
 * @param {Object} `options`
 * @return {String}
 * @api public
 */

const braces = (input, options = {}) => {
  let output = [];

  if (Array.isArray(input)) {
    for (const pattern of input) {
      const result = braces.create(pattern, options);
      if (Array.isArray(result)) {
        output.push(...result);
      } else {
        output.push(result);
      }
    }
  } else {
    output = [].concat(braces.create(input, options));
  }

  if (options && options.expand === true && options.nodupes === true) {
    output = [...new Set(output)];
  }
  return output;
};

/**
 * Parse the given `str` with the given `options`.
 *
 * ```js
 * // braces.parse(pattern, [, options]);
 * const ast = braces.parse('a/{b,c}/d');
 * console.log(ast);
 * ```
 * @param {String} pattern Brace pattern to parse
 * @param {Object} options
 * @return {Object} Returns an AST
 * @api public
 */

braces.parse = (input, options = {}) => parse(input, options);

/**
 * Creates a braces string from an AST, or an AST node.
 *
 * ```js
 * const braces = require('braces');
 * let ast = braces.parse('foo/{a,b}/bar');
 * console.log(stringify(ast.nodes[2])); //=> '{a,b}'
 * ```
 * @param {String} `input` Brace pattern or AST.
 * @param {Object} `options`
 * @return {Array} Returns an array of expanded values.
 * @api public
 */

braces.stringify = (input, options = {}) => {
  if (typeof input === 'string') {
    return stringify(braces.parse(input, options), options);
  }
  return stringify(input, options);
};

/**
 * Compiles a brace pattern into a regex-compatible, optimized string.
 * This method is called by the main [braces](#braces) function by default.
 *
 * ```js
 * const braces = require('braces');
 * console.log(braces.compile('a/{b,c}/d'));
 * //=> ['a/(b|c)/d']
 * ```
 * @param {String} `input` Brace pattern or AST.
 * @param {Object} `options`
 * @return {Array} Returns an array of expanded values.
 * @api public
 */

braces.compile = (input, options = {}) => {
  if (typeof input === 'string') {
    input = braces.parse(input, options);
  }
  return compile(input, options);
};

/**
 * Expands a brace pattern into an array. This method is called by the
 * main [braces](#braces) function when `options.expand` is true. Before
 * using this method it's recommended that you read the [performance notes](#performance))
 * and advantages of using [.compile](#compile) instead.
 *
 * ```js
 * const braces = require('braces');
 * console.log(braces.expand('a/{b,c}/d'));
 * //=> ['a/b/d', 'a/c/d'];
 * ```
 * @param {String} `pattern` Brace pattern
 * @param {Object} `options`
 * @return {Array} Returns an array of expanded values.
 * @api public
 */

braces.expand = (input, options = {}) => {
  if (typeof input === 'string') {
    input = braces.parse(input, options);
  }

  let result = expand(input, options);

  // filter out empty strings if specified
  if (options.noempty === true) {
    result = result.filter(Boolean);
  }

  // filter out duplicates if specified
  if (options.nodupes === true) {
    result = [...new Set(result)];
  }

  return result;
};

/**
 * Processes a brace pattern and returns either an expanded array
 * (if `options.expand` is true), a highly optimized regex-compatible string.
 * This method is called by the main [braces](#braces) function.
 *
 * ```js
 * const braces = require('braces');
 * console.log(braces.create('user-{200..300}/project-{a,b,c}-{1..10}'))
 * //=> 'user-(20[0-9]|2[1-9][0-9]|300)/project-(a|b|c)-([1-9]|10)'
 * ```
 * @param {String} `pattern` Brace pattern
 * @param {Object} `options`
 * @return {Array} Returns an array of expanded values.
 * @api public
 */

braces.create = (input, options = {}) => {
  if (input === '' || input.length < 3) {
    return [input];
  }

  return options.expand !== true
    ? braces.compile(input, options)
    : braces.expand(input, options);
};

/**
 * Expose "braces"
 */

module.exports = braces;


/***/ }),

/***/ "./node_modules/braces/lib/compile.js":
/*!********************************************!*\
  !*** ./node_modules/braces/lib/compile.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const fill = __webpack_require__(/*! fill-range */ "./node_modules/fill-range/index.js");
const utils = __webpack_require__(/*! ./utils */ "./node_modules/braces/lib/utils.js");

const compile = (ast, options = {}) => {
  const walk = (node, parent = {}) => {
    const invalidBlock = utils.isInvalidBrace(parent);
    const invalidNode = node.invalid === true && options.escapeInvalid === true;
    const invalid = invalidBlock === true || invalidNode === true;
    const prefix = options.escapeInvalid === true ? '\\' : '';
    let output = '';

    if (node.isOpen === true) {
      return prefix + node.value;
    }

    if (node.isClose === true) {
      console.log('node.isClose', prefix, node.value);
      return prefix + node.value;
    }

    if (node.type === 'open') {
      return invalid ? prefix + node.value : '(';
    }

    if (node.type === 'close') {
      return invalid ? prefix + node.value : ')';
    }

    if (node.type === 'comma') {
      return node.prev.type === 'comma' ? '' : invalid ? node.value : '|';
    }

    if (node.value) {
      return node.value;
    }

    if (node.nodes && node.ranges > 0) {
      const args = utils.reduce(node.nodes);
      const range = fill(...args, { ...options, wrap: false, toRegex: true, strictZeros: true });

      if (range.length !== 0) {
        return args.length > 1 && range.length > 1 ? `(${range})` : range;
      }
    }

    if (node.nodes) {
      for (const child of node.nodes) {
        output += walk(child, node);
      }
    }

    return output;
  };

  return walk(ast);
};

module.exports = compile;


/***/ }),

/***/ "./node_modules/braces/lib/constants.js":
/*!**********************************************!*\
  !*** ./node_modules/braces/lib/constants.js ***!
  \**********************************************/
/***/ ((module) => {

"use strict";


module.exports = {
  MAX_LENGTH: 10000,

  // Digits
  CHAR_0: '0', /* 0 */
  CHAR_9: '9', /* 9 */

  // Alphabet chars.
  CHAR_UPPERCASE_A: 'A', /* A */
  CHAR_LOWERCASE_A: 'a', /* a */
  CHAR_UPPERCASE_Z: 'Z', /* Z */
  CHAR_LOWERCASE_Z: 'z', /* z */

  CHAR_LEFT_PARENTHESES: '(', /* ( */
  CHAR_RIGHT_PARENTHESES: ')', /* ) */

  CHAR_ASTERISK: '*', /* * */

  // Non-alphabetic chars.
  CHAR_AMPERSAND: '&', /* & */
  CHAR_AT: '@', /* @ */
  CHAR_BACKSLASH: '\\', /* \ */
  CHAR_BACKTICK: '`', /* ` */
  CHAR_CARRIAGE_RETURN: '\r', /* \r */
  CHAR_CIRCUMFLEX_ACCENT: '^', /* ^ */
  CHAR_COLON: ':', /* : */
  CHAR_COMMA: ',', /* , */
  CHAR_DOLLAR: '$', /* . */
  CHAR_DOT: '.', /* . */
  CHAR_DOUBLE_QUOTE: '"', /* " */
  CHAR_EQUAL: '=', /* = */
  CHAR_EXCLAMATION_MARK: '!', /* ! */
  CHAR_FORM_FEED: '\f', /* \f */
  CHAR_FORWARD_SLASH: '/', /* / */
  CHAR_HASH: '#', /* # */
  CHAR_HYPHEN_MINUS: '-', /* - */
  CHAR_LEFT_ANGLE_BRACKET: '<', /* < */
  CHAR_LEFT_CURLY_BRACE: '{', /* { */
  CHAR_LEFT_SQUARE_BRACKET: '[', /* [ */
  CHAR_LINE_FEED: '\n', /* \n */
  CHAR_NO_BREAK_SPACE: '\u00A0', /* \u00A0 */
  CHAR_PERCENT: '%', /* % */
  CHAR_PLUS: '+', /* + */
  CHAR_QUESTION_MARK: '?', /* ? */
  CHAR_RIGHT_ANGLE_BRACKET: '>', /* > */
  CHAR_RIGHT_CURLY_BRACE: '}', /* } */
  CHAR_RIGHT_SQUARE_BRACKET: ']', /* ] */
  CHAR_SEMICOLON: ';', /* ; */
  CHAR_SINGLE_QUOTE: '\'', /* ' */
  CHAR_SPACE: ' ', /*   */
  CHAR_TAB: '\t', /* \t */
  CHAR_UNDERSCORE: '_', /* _ */
  CHAR_VERTICAL_LINE: '|', /* | */
  CHAR_ZERO_WIDTH_NOBREAK_SPACE: '\uFEFF' /* \uFEFF */
};


/***/ }),

/***/ "./node_modules/braces/lib/expand.js":
/*!*******************************************!*\
  !*** ./node_modules/braces/lib/expand.js ***!
  \*******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const fill = __webpack_require__(/*! fill-range */ "./node_modules/fill-range/index.js");
const stringify = __webpack_require__(/*! ./stringify */ "./node_modules/braces/lib/stringify.js");
const utils = __webpack_require__(/*! ./utils */ "./node_modules/braces/lib/utils.js");

const append = (queue = '', stash = '', enclose = false) => {
  const result = [];

  queue = [].concat(queue);
  stash = [].concat(stash);

  if (!stash.length) return queue;
  if (!queue.length) {
    return enclose ? utils.flatten(stash).map(ele => `{${ele}}`) : stash;
  }

  for (const item of queue) {
    if (Array.isArray(item)) {
      for (const value of item) {
        result.push(append(value, stash, enclose));
      }
    } else {
      for (let ele of stash) {
        if (enclose === true && typeof ele === 'string') ele = `{${ele}}`;
        result.push(Array.isArray(ele) ? append(item, ele, enclose) : item + ele);
      }
    }
  }
  return utils.flatten(result);
};

const expand = (ast, options = {}) => {
  const rangeLimit = options.rangeLimit === undefined ? 1000 : options.rangeLimit;

  const walk = (node, parent = {}) => {
    node.queue = [];

    let p = parent;
    let q = parent.queue;

    while (p.type !== 'brace' && p.type !== 'root' && p.parent) {
      p = p.parent;
      q = p.queue;
    }

    if (node.invalid || node.dollar) {
      q.push(append(q.pop(), stringify(node, options)));
      return;
    }

    if (node.type === 'brace' && node.invalid !== true && node.nodes.length === 2) {
      q.push(append(q.pop(), ['{}']));
      return;
    }

    if (node.nodes && node.ranges > 0) {
      const args = utils.reduce(node.nodes);

      if (utils.exceedsLimit(...args, options.step, rangeLimit)) {
        throw new RangeError('expanded array length exceeds range limit. Use options.rangeLimit to increase or disable the limit.');
      }

      let range = fill(...args, options);
      if (range.length === 0) {
        range = stringify(node, options);
      }

      q.push(append(q.pop(), range));
      node.nodes = [];
      return;
    }

    const enclose = utils.encloseBrace(node);
    let queue = node.queue;
    let block = node;

    while (block.type !== 'brace' && block.type !== 'root' && block.parent) {
      block = block.parent;
      queue = block.queue;
    }

    for (let i = 0; i < node.nodes.length; i++) {
      const child = node.nodes[i];

      if (child.type === 'comma' && node.type === 'brace') {
        if (i === 1) queue.push('');
        queue.push('');
        continue;
      }

      if (child.type === 'close') {
        q.push(append(q.pop(), queue, enclose));
        continue;
      }

      if (child.value && child.type !== 'open') {
        queue.push(append(queue.pop(), child.value));
        continue;
      }

      if (child.nodes) {
        walk(child, node);
      }
    }

    return queue;
  };

  return utils.flatten(walk(ast));
};

module.exports = expand;


/***/ }),

/***/ "./node_modules/braces/lib/parse.js":
/*!******************************************!*\
  !*** ./node_modules/braces/lib/parse.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const stringify = __webpack_require__(/*! ./stringify */ "./node_modules/braces/lib/stringify.js");

/**
 * Constants
 */

const {
  MAX_LENGTH,
  CHAR_BACKSLASH, /* \ */
  CHAR_BACKTICK, /* ` */
  CHAR_COMMA, /* , */
  CHAR_DOT, /* . */
  CHAR_LEFT_PARENTHESES, /* ( */
  CHAR_RIGHT_PARENTHESES, /* ) */
  CHAR_LEFT_CURLY_BRACE, /* { */
  CHAR_RIGHT_CURLY_BRACE, /* } */
  CHAR_LEFT_SQUARE_BRACKET, /* [ */
  CHAR_RIGHT_SQUARE_BRACKET, /* ] */
  CHAR_DOUBLE_QUOTE, /* " */
  CHAR_SINGLE_QUOTE, /* ' */
  CHAR_NO_BREAK_SPACE,
  CHAR_ZERO_WIDTH_NOBREAK_SPACE
} = __webpack_require__(/*! ./constants */ "./node_modules/braces/lib/constants.js");

/**
 * parse
 */

const parse = (input, options = {}) => {
  if (typeof input !== 'string') {
    throw new TypeError('Expected a string');
  }

  const opts = options || {};
  const max = typeof opts.maxLength === 'number' ? Math.min(MAX_LENGTH, opts.maxLength) : MAX_LENGTH;
  if (input.length > max) {
    throw new SyntaxError(`Input length (${input.length}), exceeds max characters (${max})`);
  }

  const ast = { type: 'root', input, nodes: [] };
  const stack = [ast];
  let block = ast;
  let prev = ast;
  let brackets = 0;
  const length = input.length;
  let index = 0;
  let depth = 0;
  let value;

  /**
   * Helpers
   */

  const advance = () => input[index++];
  const push = node => {
    if (node.type === 'text' && prev.type === 'dot') {
      prev.type = 'text';
    }

    if (prev && prev.type === 'text' && node.type === 'text') {
      prev.value += node.value;
      return;
    }

    block.nodes.push(node);
    node.parent = block;
    node.prev = prev;
    prev = node;
    return node;
  };

  push({ type: 'bos' });

  while (index < length) {
    block = stack[stack.length - 1];
    value = advance();

    /**
     * Invalid chars
     */

    if (value === CHAR_ZERO_WIDTH_NOBREAK_SPACE || value === CHAR_NO_BREAK_SPACE) {
      continue;
    }

    /**
     * Escaped chars
     */

    if (value === CHAR_BACKSLASH) {
      push({ type: 'text', value: (options.keepEscaping ? value : '') + advance() });
      continue;
    }

    /**
     * Right square bracket (literal): ']'
     */

    if (value === CHAR_RIGHT_SQUARE_BRACKET) {
      push({ type: 'text', value: '\\' + value });
      continue;
    }

    /**
     * Left square bracket: '['
     */

    if (value === CHAR_LEFT_SQUARE_BRACKET) {
      brackets++;

      let next;

      while (index < length && (next = advance())) {
        value += next;

        if (next === CHAR_LEFT_SQUARE_BRACKET) {
          brackets++;
          continue;
        }

        if (next === CHAR_BACKSLASH) {
          value += advance();
          continue;
        }

        if (next === CHAR_RIGHT_SQUARE_BRACKET) {
          brackets--;

          if (brackets === 0) {
            break;
          }
        }
      }

      push({ type: 'text', value });
      continue;
    }

    /**
     * Parentheses
     */

    if (value === CHAR_LEFT_PARENTHESES) {
      block = push({ type: 'paren', nodes: [] });
      stack.push(block);
      push({ type: 'text', value });
      continue;
    }

    if (value === CHAR_RIGHT_PARENTHESES) {
      if (block.type !== 'paren') {
        push({ type: 'text', value });
        continue;
      }
      block = stack.pop();
      push({ type: 'text', value });
      block = stack[stack.length - 1];
      continue;
    }

    /**
     * Quotes: '|"|`
     */

    if (value === CHAR_DOUBLE_QUOTE || value === CHAR_SINGLE_QUOTE || value === CHAR_BACKTICK) {
      const open = value;
      let next;

      if (options.keepQuotes !== true) {
        value = '';
      }

      while (index < length && (next = advance())) {
        if (next === CHAR_BACKSLASH) {
          value += next + advance();
          continue;
        }

        if (next === open) {
          if (options.keepQuotes === true) value += next;
          break;
        }

        value += next;
      }

      push({ type: 'text', value });
      continue;
    }

    /**
     * Left curly brace: '{'
     */

    if (value === CHAR_LEFT_CURLY_BRACE) {
      depth++;

      const dollar = prev.value && prev.value.slice(-1) === '$' || block.dollar === true;
      const brace = {
        type: 'brace',
        open: true,
        close: false,
        dollar,
        depth,
        commas: 0,
        ranges: 0,
        nodes: []
      };

      block = push(brace);
      stack.push(block);
      push({ type: 'open', value });
      continue;
    }

    /**
     * Right curly brace: '}'
     */

    if (value === CHAR_RIGHT_CURLY_BRACE) {
      if (block.type !== 'brace') {
        push({ type: 'text', value });
        continue;
      }

      const type = 'close';
      block = stack.pop();
      block.close = true;

      push({ type, value });
      depth--;

      block = stack[stack.length - 1];
      continue;
    }

    /**
     * Comma: ','
     */

    if (value === CHAR_COMMA && depth > 0) {
      if (block.ranges > 0) {
        block.ranges = 0;
        const open = block.nodes.shift();
        block.nodes = [open, { type: 'text', value: stringify(block) }];
      }

      push({ type: 'comma', value });
      block.commas++;
      continue;
    }

    /**
     * Dot: '.'
     */

    if (value === CHAR_DOT && depth > 0 && block.commas === 0) {
      const siblings = block.nodes;

      if (depth === 0 || siblings.length === 0) {
        push({ type: 'text', value });
        continue;
      }

      if (prev.type === 'dot') {
        block.range = [];
        prev.value += value;
        prev.type = 'range';

        if (block.nodes.length !== 3 && block.nodes.length !== 5) {
          block.invalid = true;
          block.ranges = 0;
          prev.type = 'text';
          continue;
        }

        block.ranges++;
        block.args = [];
        continue;
      }

      if (prev.type === 'range') {
        siblings.pop();

        const before = siblings[siblings.length - 1];
        before.value += prev.value + value;
        prev = before;
        block.ranges--;
        continue;
      }

      push({ type: 'dot', value });
      continue;
    }

    /**
     * Text
     */

    push({ type: 'text', value });
  }

  // Mark imbalanced braces and brackets as invalid
  do {
    block = stack.pop();

    if (block.type !== 'root') {
      block.nodes.forEach(node => {
        if (!node.nodes) {
          if (node.type === 'open') node.isOpen = true;
          if (node.type === 'close') node.isClose = true;
          if (!node.nodes) node.type = 'text';
          node.invalid = true;
        }
      });

      // get the location of the block on parent.nodes (block's siblings)
      const parent = stack[stack.length - 1];
      const index = parent.nodes.indexOf(block);
      // replace the (invalid) block with it's nodes
      parent.nodes.splice(index, 1, ...block.nodes);
    }
  } while (stack.length > 0);

  push({ type: 'eos' });
  return ast;
};

module.exports = parse;


/***/ }),

/***/ "./node_modules/braces/lib/stringify.js":
/*!**********************************************!*\
  !*** ./node_modules/braces/lib/stringify.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const utils = __webpack_require__(/*! ./utils */ "./node_modules/braces/lib/utils.js");

module.exports = (ast, options = {}) => {
  const stringify = (node, parent = {}) => {
    const invalidBlock = options.escapeInvalid && utils.isInvalidBrace(parent);
    const invalidNode = node.invalid === true && options.escapeInvalid === true;
    let output = '';

    if (node.value) {
      if ((invalidBlock || invalidNode) && utils.isOpenOrClose(node)) {
        return '\\' + node.value;
      }
      return node.value;
    }

    if (node.value) {
      return node.value;
    }

    if (node.nodes) {
      for (const child of node.nodes) {
        output += stringify(child);
      }
    }
    return output;
  };

  return stringify(ast);
};



/***/ }),

/***/ "./node_modules/braces/lib/utils.js":
/*!******************************************!*\
  !*** ./node_modules/braces/lib/utils.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


exports.isInteger = num => {
  if (typeof num === 'number') {
    return Number.isInteger(num);
  }
  if (typeof num === 'string' && num.trim() !== '') {
    return Number.isInteger(Number(num));
  }
  return false;
};

/**
 * Find a node of the given type
 */

exports.find = (node, type) => node.nodes.find(node => node.type === type);

/**
 * Find a node of the given type
 */

exports.exceedsLimit = (min, max, step = 1, limit) => {
  if (limit === false) return false;
  if (!exports.isInteger(min) || !exports.isInteger(max)) return false;
  return ((Number(max) - Number(min)) / Number(step)) >= limit;
};

/**
 * Escape the given node with '\\' before node.value
 */

exports.escapeNode = (block, n = 0, type) => {
  const node = block.nodes[n];
  if (!node) return;

  if ((type && node.type === type) || node.type === 'open' || node.type === 'close') {
    if (node.escaped !== true) {
      node.value = '\\' + node.value;
      node.escaped = true;
    }
  }
};

/**
 * Returns true if the given brace node should be enclosed in literal braces
 */

exports.encloseBrace = node => {
  if (node.type !== 'brace') return false;
  if ((node.commas >> 0 + node.ranges >> 0) === 0) {
    node.invalid = true;
    return true;
  }
  return false;
};

/**
 * Returns true if a brace node is invalid.
 */

exports.isInvalidBrace = block => {
  if (block.type !== 'brace') return false;
  if (block.invalid === true || block.dollar) return true;
  if ((block.commas >> 0 + block.ranges >> 0) === 0) {
    block.invalid = true;
    return true;
  }
  if (block.open !== true || block.close !== true) {
    block.invalid = true;
    return true;
  }
  return false;
};

/**
 * Returns true if a node is an open or close node
 */

exports.isOpenOrClose = node => {
  if (node.type === 'open' || node.type === 'close') {
    return true;
  }
  return node.open === true || node.close === true;
};

/**
 * Reduce an array of text nodes.
 */

exports.reduce = nodes => nodes.reduce((acc, node) => {
  if (node.type === 'text') acc.push(node.value);
  if (node.type === 'range') node.type = 'text';
  return acc;
}, []);

/**
 * Flatten an array
 */

exports.flatten = (...args) => {
  const result = [];

  const flat = arr => {
    for (let i = 0; i < arr.length; i++) {
      const ele = arr[i];

      if (Array.isArray(ele)) {
        flat(ele);
        continue;
      }

      if (ele !== undefined) {
        result.push(ele);
      }
    }
    return result;
  };

  flat(args);
  return result;
};


/***/ }),

/***/ "./node_modules/chokidar/index.js":
/*!****************************************!*\
  !*** ./node_modules/chokidar/index.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


const { EventEmitter } = __webpack_require__(/*! events */ "events");
const fs = __webpack_require__(/*! fs */ "fs");
const sysPath = __webpack_require__(/*! path */ "path");
const { promisify } = __webpack_require__(/*! util */ "util");
const readdirp = __webpack_require__(/*! readdirp */ "./node_modules/readdirp/index.js");
const anymatch = (__webpack_require__(/*! anymatch */ "./node_modules/anymatch/index.js")["default"]);
const globParent = __webpack_require__(/*! glob-parent */ "./node_modules/glob-parent/index.js");
const isGlob = __webpack_require__(/*! is-glob */ "./node_modules/is-glob/index.js");
const braces = __webpack_require__(/*! braces */ "./node_modules/braces/index.js");
const normalizePath = __webpack_require__(/*! normalize-path */ "./node_modules/normalize-path/index.js");

const NodeFsHandler = __webpack_require__(/*! ./lib/nodefs-handler */ "./node_modules/chokidar/lib/nodefs-handler.js");
const FsEventsHandler = __webpack_require__(/*! ./lib/fsevents-handler */ "./node_modules/chokidar/lib/fsevents-handler.js");
const {
  EV_ALL,
  EV_READY,
  EV_ADD,
  EV_CHANGE,
  EV_UNLINK,
  EV_ADD_DIR,
  EV_UNLINK_DIR,
  EV_RAW,
  EV_ERROR,

  STR_CLOSE,
  STR_END,

  BACK_SLASH_RE,
  DOUBLE_SLASH_RE,
  SLASH_OR_BACK_SLASH_RE,
  DOT_RE,
  REPLACER_RE,

  SLASH,
  SLASH_SLASH,
  BRACE_START,
  BANG,
  ONE_DOT,
  TWO_DOTS,
  GLOBSTAR,
  SLASH_GLOBSTAR,
  ANYMATCH_OPTS,
  STRING_TYPE,
  FUNCTION_TYPE,
  EMPTY_STR,
  EMPTY_FN,

  isWindows,
  isMacos,
  isIBMi
} = __webpack_require__(/*! ./lib/constants */ "./node_modules/chokidar/lib/constants.js");

const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);

/**
 * @typedef {String} Path
 * @typedef {'all'|'add'|'addDir'|'change'|'unlink'|'unlinkDir'|'raw'|'error'|'ready'} EventName
 * @typedef {'readdir'|'watch'|'add'|'remove'|'change'} ThrottleType
 */

/**
 *
 * @typedef {Object} WatchHelpers
 * @property {Boolean} followSymlinks
 * @property {'stat'|'lstat'} statMethod
 * @property {Path} path
 * @property {Path} watchPath
 * @property {Function} entryPath
 * @property {Boolean} hasGlob
 * @property {Object} globFilter
 * @property {Function} filterPath
 * @property {Function} filterDir
 */

const arrify = (value = []) => Array.isArray(value) ? value : [value];
const flatten = (list, result = []) => {
  list.forEach(item => {
    if (Array.isArray(item)) {
      flatten(item, result);
    } else {
      result.push(item);
    }
  });
  return result;
};

const unifyPaths = (paths_) => {
  /**
   * @type {Array<String>}
   */
  const paths = flatten(arrify(paths_));
  if (!paths.every(p => typeof p === STRING_TYPE)) {
    throw new TypeError(`Non-string provided as watch path: ${paths}`);
  }
  return paths.map(normalizePathToUnix);
};

// If SLASH_SLASH occurs at the beginning of path, it is not replaced
//     because "//StoragePC/DrivePool/Movies" is a valid network path
const toUnix = (string) => {
  let str = string.replace(BACK_SLASH_RE, SLASH);
  let prepend = false;
  if (str.startsWith(SLASH_SLASH)) {
    prepend = true;
  }
  while (str.match(DOUBLE_SLASH_RE)) {
    str = str.replace(DOUBLE_SLASH_RE, SLASH);
  }
  if (prepend) {
    str = SLASH + str;
  }
  return str;
};

// Our version of upath.normalize
// TODO: this is not equal to path-normalize module - investigate why
const normalizePathToUnix = (path) => toUnix(sysPath.normalize(toUnix(path)));

const normalizeIgnored = (cwd = EMPTY_STR) => (path) => {
  if (typeof path !== STRING_TYPE) return path;
  return normalizePathToUnix(sysPath.isAbsolute(path) ? path : sysPath.join(cwd, path));
};

const getAbsolutePath = (path, cwd) => {
  if (sysPath.isAbsolute(path)) {
    return path;
  }
  if (path.startsWith(BANG)) {
    return BANG + sysPath.join(cwd, path.slice(1));
  }
  return sysPath.join(cwd, path);
};

const undef = (opts, key) => opts[key] === undefined;

/**
 * Directory entry.
 * @property {Path} path
 * @property {Set<Path>} items
 */
class DirEntry {
  /**
   * @param {Path} dir
   * @param {Function} removeWatcher
   */
  constructor(dir, removeWatcher) {
    this.path = dir;
    this._removeWatcher = removeWatcher;
    /** @type {Set<Path>} */
    this.items = new Set();
  }

  add(item) {
    const {items} = this;
    if (!items) return;
    if (item !== ONE_DOT && item !== TWO_DOTS) items.add(item);
  }

  async remove(item) {
    const {items} = this;
    if (!items) return;
    items.delete(item);
    if (items.size > 0) return;

    const dir = this.path;
    try {
      await readdir(dir);
    } catch (err) {
      if (this._removeWatcher) {
        this._removeWatcher(sysPath.dirname(dir), sysPath.basename(dir));
      }
    }
  }

  has(item) {
    const {items} = this;
    if (!items) return;
    return items.has(item);
  }

  /**
   * @returns {Array<String>}
   */
  getChildren() {
    const {items} = this;
    if (!items) return;
    return [...items.values()];
  }

  dispose() {
    this.items.clear();
    delete this.path;
    delete this._removeWatcher;
    delete this.items;
    Object.freeze(this);
  }
}

const STAT_METHOD_F = 'stat';
const STAT_METHOD_L = 'lstat';
class WatchHelper {
  constructor(path, watchPath, follow, fsw) {
    this.fsw = fsw;
    this.path = path = path.replace(REPLACER_RE, EMPTY_STR);
    this.watchPath = watchPath;
    this.fullWatchPath = sysPath.resolve(watchPath);
    this.hasGlob = watchPath !== path;
    /** @type {object|boolean} */
    if (path === EMPTY_STR) this.hasGlob = false;
    this.globSymlink = this.hasGlob && follow ? undefined : false;
    this.globFilter = this.hasGlob ? anymatch(path, undefined, ANYMATCH_OPTS) : false;
    this.dirParts = this.getDirParts(path);
    this.dirParts.forEach((parts) => {
      if (parts.length > 1) parts.pop();
    });
    this.followSymlinks = follow;
    this.statMethod = follow ? STAT_METHOD_F : STAT_METHOD_L;
  }

  checkGlobSymlink(entry) {
    // only need to resolve once
    // first entry should always have entry.parentDir === EMPTY_STR
    if (this.globSymlink === undefined) {
      this.globSymlink = entry.fullParentDir === this.fullWatchPath ?
        false : {realPath: entry.fullParentDir, linkPath: this.fullWatchPath};
    }

    if (this.globSymlink) {
      return entry.fullPath.replace(this.globSymlink.realPath, this.globSymlink.linkPath);
    }

    return entry.fullPath;
  }

  entryPath(entry) {
    return sysPath.join(this.watchPath,
      sysPath.relative(this.watchPath, this.checkGlobSymlink(entry))
    );
  }

  filterPath(entry) {
    const {stats} = entry;
    if (stats && stats.isSymbolicLink()) return this.filterDir(entry);
    const resolvedPath = this.entryPath(entry);
    const matchesGlob = this.hasGlob && typeof this.globFilter === FUNCTION_TYPE ?
      this.globFilter(resolvedPath) : true;
    return matchesGlob &&
      this.fsw._isntIgnored(resolvedPath, stats) &&
      this.fsw._hasReadPermissions(stats);
  }

  getDirParts(path) {
    if (!this.hasGlob) return [];
    const parts = [];
    const expandedPath = path.includes(BRACE_START) ? braces.expand(path) : [path];
    expandedPath.forEach((path) => {
      parts.push(sysPath.relative(this.watchPath, path).split(SLASH_OR_BACK_SLASH_RE));
    });
    return parts;
  }

  filterDir(entry) {
    if (this.hasGlob) {
      const entryParts = this.getDirParts(this.checkGlobSymlink(entry));
      let globstar = false;
      this.unmatchedGlob = !this.dirParts.some((parts) => {
        return parts.every((part, i) => {
          if (part === GLOBSTAR) globstar = true;
          return globstar || !entryParts[0][i] || anymatch(part, entryParts[0][i], ANYMATCH_OPTS);
        });
      });
    }
    return !this.unmatchedGlob && this.fsw._isntIgnored(this.entryPath(entry), entry.stats);
  }
}

/**
 * Watches files & directories for changes. Emitted events:
 * `add`, `addDir`, `change`, `unlink`, `unlinkDir`, `all`, `error`
 *
 *     new FSWatcher()
 *       .add(directories)
 *       .on('add', path => log('File', path, 'was added'))
 */
class FSWatcher extends EventEmitter {
// Not indenting methods for history sake; for now.
constructor(_opts) {
  super();

  const opts = {};
  if (_opts) Object.assign(opts, _opts); // for frozen objects

  /** @type {Map<String, DirEntry>} */
  this._watched = new Map();
  /** @type {Map<String, Array>} */
  this._closers = new Map();
  /** @type {Set<String>} */
  this._ignoredPaths = new Set();

  /** @type {Map<ThrottleType, Map>} */
  this._throttled = new Map();

  /** @type {Map<Path, String|Boolean>} */
  this._symlinkPaths = new Map();

  this._streams = new Set();
  this.closed = false;

  // Set up default options.
  if (undef(opts, 'persistent')) opts.persistent = true;
  if (undef(opts, 'ignoreInitial')) opts.ignoreInitial = false;
  if (undef(opts, 'ignorePermissionErrors')) opts.ignorePermissionErrors = false;
  if (undef(opts, 'interval')) opts.interval = 100;
  if (undef(opts, 'binaryInterval')) opts.binaryInterval = 300;
  if (undef(opts, 'disableGlobbing')) opts.disableGlobbing = false;
  opts.enableBinaryInterval = opts.binaryInterval !== opts.interval;

  // Enable fsevents on OS X when polling isn't explicitly enabled.
  if (undef(opts, 'useFsEvents')) opts.useFsEvents = !opts.usePolling;

  // If we can't use fsevents, ensure the options reflect it's disabled.
  const canUseFsEvents = FsEventsHandler.canUse();
  if (!canUseFsEvents) opts.useFsEvents = false;

  // Use polling on Mac if not using fsevents.
  // Other platforms use non-polling fs_watch.
  if (undef(opts, 'usePolling') && !opts.useFsEvents) {
    opts.usePolling = isMacos;
  }

  // Always default to polling on IBM i because fs.watch() is not available on IBM i.
  if(isIBMi) {
    opts.usePolling = true;
  }

  // Global override (useful for end-developers that need to force polling for all
  // instances of chokidar, regardless of usage/dependency depth)
  const envPoll = process.env.CHOKIDAR_USEPOLLING;
  if (envPoll !== undefined) {
    const envLower = envPoll.toLowerCase();

    if (envLower === 'false' || envLower === '0') {
      opts.usePolling = false;
    } else if (envLower === 'true' || envLower === '1') {
      opts.usePolling = true;
    } else {
      opts.usePolling = !!envLower;
    }
  }
  const envInterval = process.env.CHOKIDAR_INTERVAL;
  if (envInterval) {
    opts.interval = Number.parseInt(envInterval, 10);
  }

  // Editor atomic write normalization enabled by default with fs.watch
  if (undef(opts, 'atomic')) opts.atomic = !opts.usePolling && !opts.useFsEvents;
  if (opts.atomic) this._pendingUnlinks = new Map();

  if (undef(opts, 'followSymlinks')) opts.followSymlinks = true;

  if (undef(opts, 'awaitWriteFinish')) opts.awaitWriteFinish = false;
  if (opts.awaitWriteFinish === true) opts.awaitWriteFinish = {};
  const awf = opts.awaitWriteFinish;
  if (awf) {
    if (!awf.stabilityThreshold) awf.stabilityThreshold = 2000;
    if (!awf.pollInterval) awf.pollInterval = 100;
    this._pendingWrites = new Map();
  }
  if (opts.ignored) opts.ignored = arrify(opts.ignored);

  let readyCalls = 0;
  this._emitReady = () => {
    readyCalls++;
    if (readyCalls >= this._readyCount) {
      this._emitReady = EMPTY_FN;
      this._readyEmitted = true;
      // use process.nextTick to allow time for listener to be bound
      process.nextTick(() => this.emit(EV_READY));
    }
  };
  this._emitRaw = (...args) => this.emit(EV_RAW, ...args);
  this._readyEmitted = false;
  this.options = opts;

  // Initialize with proper watcher.
  if (opts.useFsEvents) {
    this._fsEventsHandler = new FsEventsHandler(this);
  } else {
    this._nodeFsHandler = new NodeFsHandler(this);
  }

  // You’re frozen when your heart’s not open.
  Object.freeze(opts);
}

// Public methods

/**
 * Adds paths to be watched on an existing FSWatcher instance
 * @param {Path|Array<Path>} paths_
 * @param {String=} _origAdd private; for handling non-existent paths to be watched
 * @param {Boolean=} _internal private; indicates a non-user add
 * @returns {FSWatcher} for chaining
 */
add(paths_, _origAdd, _internal) {
  const {cwd, disableGlobbing} = this.options;
  this.closed = false;
  let paths = unifyPaths(paths_);
  if (cwd) {
    paths = paths.map((path) => {
      const absPath = getAbsolutePath(path, cwd);

      // Check `path` instead of `absPath` because the cwd portion can't be a glob
      if (disableGlobbing || !isGlob(path)) {
        return absPath;
      }
      return normalizePath(absPath);
    });
  }

  // set aside negated glob strings
  paths = paths.filter((path) => {
    if (path.startsWith(BANG)) {
      this._ignoredPaths.add(path.slice(1));
      return false;
    }

    // if a path is being added that was previously ignored, stop ignoring it
    this._ignoredPaths.delete(path);
    this._ignoredPaths.delete(path + SLASH_GLOBSTAR);

    // reset the cached userIgnored anymatch fn
    // to make ignoredPaths changes effective
    this._userIgnored = undefined;

    return true;
  });

  if (this.options.useFsEvents && this._fsEventsHandler) {
    if (!this._readyCount) this._readyCount = paths.length;
    if (this.options.persistent) this._readyCount += paths.length;
    paths.forEach((path) => this._fsEventsHandler._addToFsEvents(path));
  } else {
    if (!this._readyCount) this._readyCount = 0;
    this._readyCount += paths.length;
    Promise.all(
      paths.map(async path => {
        const res = await this._nodeFsHandler._addToNodeFs(path, !_internal, 0, 0, _origAdd);
        if (res) this._emitReady();
        return res;
      })
    ).then(results => {
      if (this.closed) return;
      results.filter(item => item).forEach(item => {
        this.add(sysPath.dirname(item), sysPath.basename(_origAdd || item));
      });
    });
  }

  return this;
}

/**
 * Close watchers or start ignoring events from specified paths.
 * @param {Path|Array<Path>} paths_ - string or array of strings, file/directory paths and/or globs
 * @returns {FSWatcher} for chaining
*/
unwatch(paths_) {
  if (this.closed) return this;
  const paths = unifyPaths(paths_);
  const {cwd} = this.options;

  paths.forEach((path) => {
    // convert to absolute path unless relative path already matches
    if (!sysPath.isAbsolute(path) && !this._closers.has(path)) {
      if (cwd) path = sysPath.join(cwd, path);
      path = sysPath.resolve(path);
    }

    this._closePath(path);

    this._ignoredPaths.add(path);
    if (this._watched.has(path)) {
      this._ignoredPaths.add(path + SLASH_GLOBSTAR);
    }

    // reset the cached userIgnored anymatch fn
    // to make ignoredPaths changes effective
    this._userIgnored = undefined;
  });

  return this;
}

/**
 * Close watchers and remove all listeners from watched paths.
 * @returns {Promise<void>}.
*/
close() {
  if (this.closed) return this._closePromise;
  this.closed = true;

  // Memory management.
  this.removeAllListeners();
  const closers = [];
  this._closers.forEach(closerList => closerList.forEach(closer => {
    const promise = closer();
    if (promise instanceof Promise) closers.push(promise);
  }));
  this._streams.forEach(stream => stream.destroy());
  this._userIgnored = undefined;
  this._readyCount = 0;
  this._readyEmitted = false;
  this._watched.forEach(dirent => dirent.dispose());
  ['closers', 'watched', 'streams', 'symlinkPaths', 'throttled'].forEach(key => {
    this[`_${key}`].clear();
  });

  this._closePromise = closers.length ? Promise.all(closers).then(() => undefined) : Promise.resolve();
  return this._closePromise;
}

/**
 * Expose list of watched paths
 * @returns {Object} for chaining
*/
getWatched() {
  const watchList = {};
  this._watched.forEach((entry, dir) => {
    const key = this.options.cwd ? sysPath.relative(this.options.cwd, dir) : dir;
    watchList[key || ONE_DOT] = entry.getChildren().sort();
  });
  return watchList;
}

emitWithAll(event, args) {
  this.emit(...args);
  if (event !== EV_ERROR) this.emit(EV_ALL, ...args);
}

// Common helpers
// --------------

/**
 * Normalize and emit events.
 * Calling _emit DOES NOT MEAN emit() would be called!
 * @param {EventName} event Type of event
 * @param {Path} path File or directory path
 * @param {*=} val1 arguments to be passed with event
 * @param {*=} val2
 * @param {*=} val3
 * @returns the error if defined, otherwise the value of the FSWatcher instance's `closed` flag
 */
async _emit(event, path, val1, val2, val3) {
  if (this.closed) return;

  const opts = this.options;
  if (isWindows) path = sysPath.normalize(path);
  if (opts.cwd) path = sysPath.relative(opts.cwd, path);
  /** @type Array<any> */
  const args = [event, path];
  if (val3 !== undefined) args.push(val1, val2, val3);
  else if (val2 !== undefined) args.push(val1, val2);
  else if (val1 !== undefined) args.push(val1);

  const awf = opts.awaitWriteFinish;
  let pw;
  if (awf && (pw = this._pendingWrites.get(path))) {
    pw.lastChange = new Date();
    return this;
  }

  if (opts.atomic) {
    if (event === EV_UNLINK) {
      this._pendingUnlinks.set(path, args);
      setTimeout(() => {
        this._pendingUnlinks.forEach((entry, path) => {
          this.emit(...entry);
          this.emit(EV_ALL, ...entry);
          this._pendingUnlinks.delete(path);
        });
      }, typeof opts.atomic === 'number' ? opts.atomic : 100);
      return this;
    }
    if (event === EV_ADD && this._pendingUnlinks.has(path)) {
      event = args[0] = EV_CHANGE;
      this._pendingUnlinks.delete(path);
    }
  }

  if (awf && (event === EV_ADD || event === EV_CHANGE) && this._readyEmitted) {
    const awfEmit = (err, stats) => {
      if (err) {
        event = args[0] = EV_ERROR;
        args[1] = err;
        this.emitWithAll(event, args);
      } else if (stats) {
        // if stats doesn't exist the file must have been deleted
        if (args.length > 2) {
          args[2] = stats;
        } else {
          args.push(stats);
        }
        this.emitWithAll(event, args);
      }
    };

    this._awaitWriteFinish(path, awf.stabilityThreshold, event, awfEmit);
    return this;
  }

  if (event === EV_CHANGE) {
    const isThrottled = !this._throttle(EV_CHANGE, path, 50);
    if (isThrottled) return this;
  }

  if (opts.alwaysStat && val1 === undefined &&
    (event === EV_ADD || event === EV_ADD_DIR || event === EV_CHANGE)
  ) {
    const fullPath = opts.cwd ? sysPath.join(opts.cwd, path) : path;
    let stats;
    try {
      stats = await stat(fullPath);
    } catch (err) {}
    // Suppress event when fs_stat fails, to avoid sending undefined 'stat'
    if (!stats || this.closed) return;
    args.push(stats);
  }
  this.emitWithAll(event, args);

  return this;
}

/**
 * Common handler for errors
 * @param {Error} error
 * @returns {Error|Boolean} The error if defined, otherwise the value of the FSWatcher instance's `closed` flag
 */
_handleError(error) {
  const code = error && error.code;
  if (error && code !== 'ENOENT' && code !== 'ENOTDIR' &&
    (!this.options.ignorePermissionErrors || (code !== 'EPERM' && code !== 'EACCES'))
  ) {
    this.emit(EV_ERROR, error);
  }
  return error || this.closed;
}

/**
 * Helper utility for throttling
 * @param {ThrottleType} actionType type being throttled
 * @param {Path} path being acted upon
 * @param {Number} timeout duration of time to suppress duplicate actions
 * @returns {Object|false} tracking object or false if action should be suppressed
 */
_throttle(actionType, path, timeout) {
  if (!this._throttled.has(actionType)) {
    this._throttled.set(actionType, new Map());
  }

  /** @type {Map<Path, Object>} */
  const action = this._throttled.get(actionType);
  /** @type {Object} */
  const actionPath = action.get(path);

  if (actionPath) {
    actionPath.count++;
    return false;
  }

  let timeoutObject;
  const clear = () => {
    const item = action.get(path);
    const count = item ? item.count : 0;
    action.delete(path);
    clearTimeout(timeoutObject);
    if (item) clearTimeout(item.timeoutObject);
    return count;
  };
  timeoutObject = setTimeout(clear, timeout);
  const thr = {timeoutObject, clear, count: 0};
  action.set(path, thr);
  return thr;
}

_incrReadyCount() {
  return this._readyCount++;
}

/**
 * Awaits write operation to finish.
 * Polls a newly created file for size variations. When files size does not change for 'threshold' milliseconds calls callback.
 * @param {Path} path being acted upon
 * @param {Number} threshold Time in milliseconds a file size must be fixed before acknowledging write OP is finished
 * @param {EventName} event
 * @param {Function} awfEmit Callback to be called when ready for event to be emitted.
 */
_awaitWriteFinish(path, threshold, event, awfEmit) {
  let timeoutHandler;

  let fullPath = path;
  if (this.options.cwd && !sysPath.isAbsolute(path)) {
    fullPath = sysPath.join(this.options.cwd, path);
  }

  const now = new Date();

  const awaitWriteFinish = (prevStat) => {
    fs.stat(fullPath, (err, curStat) => {
      if (err || !this._pendingWrites.has(path)) {
        if (err && err.code !== 'ENOENT') awfEmit(err);
        return;
      }

      const now = Number(new Date());

      if (prevStat && curStat.size !== prevStat.size) {
        this._pendingWrites.get(path).lastChange = now;
      }
      const pw = this._pendingWrites.get(path);
      const df = now - pw.lastChange;

      if (df >= threshold) {
        this._pendingWrites.delete(path);
        awfEmit(undefined, curStat);
      } else {
        timeoutHandler = setTimeout(
          awaitWriteFinish,
          this.options.awaitWriteFinish.pollInterval,
          curStat
        );
      }
    });
  };

  if (!this._pendingWrites.has(path)) {
    this._pendingWrites.set(path, {
      lastChange: now,
      cancelWait: () => {
        this._pendingWrites.delete(path);
        clearTimeout(timeoutHandler);
        return event;
      }
    });
    timeoutHandler = setTimeout(
      awaitWriteFinish,
      this.options.awaitWriteFinish.pollInterval
    );
  }
}

_getGlobIgnored() {
  return [...this._ignoredPaths.values()];
}

/**
 * Determines whether user has asked to ignore this path.
 * @param {Path} path filepath or dir
 * @param {fs.Stats=} stats result of fs.stat
 * @returns {Boolean}
 */
_isIgnored(path, stats) {
  if (this.options.atomic && DOT_RE.test(path)) return true;
  if (!this._userIgnored) {
    const {cwd} = this.options;
    const ign = this.options.ignored;

    const ignored = ign && ign.map(normalizeIgnored(cwd));
    const paths = arrify(ignored)
      .filter((path) => typeof path === STRING_TYPE && !isGlob(path))
      .map((path) => path + SLASH_GLOBSTAR);
    const list = this._getGlobIgnored().map(normalizeIgnored(cwd)).concat(ignored, paths);
    this._userIgnored = anymatch(list, undefined, ANYMATCH_OPTS);
  }

  return this._userIgnored([path, stats]);
}

_isntIgnored(path, stat) {
  return !this._isIgnored(path, stat);
}

/**
 * Provides a set of common helpers and properties relating to symlink and glob handling.
 * @param {Path} path file, directory, or glob pattern being watched
 * @param {Number=} depth at any depth > 0, this isn't a glob
 * @returns {WatchHelper} object containing helpers for this path
 */
_getWatchHelpers(path, depth) {
  const watchPath = depth || this.options.disableGlobbing || !isGlob(path) ? path : globParent(path);
  const follow = this.options.followSymlinks;

  return new WatchHelper(path, watchPath, follow, this);
}

// Directory helpers
// -----------------

/**
 * Provides directory tracking objects
 * @param {String} directory path of the directory
 * @returns {DirEntry} the directory's tracking object
 */
_getWatchedDir(directory) {
  if (!this._boundRemove) this._boundRemove = this._remove.bind(this);
  const dir = sysPath.resolve(directory);
  if (!this._watched.has(dir)) this._watched.set(dir, new DirEntry(dir, this._boundRemove));
  return this._watched.get(dir);
}

// File helpers
// ------------

/**
 * Check for read permissions.
 * Based on this answer on SO: https://stackoverflow.com/a/11781404/1358405
 * @param {fs.Stats} stats - object, result of fs_stat
 * @returns {Boolean} indicates whether the file can be read
*/
_hasReadPermissions(stats) {
  if (this.options.ignorePermissionErrors) return true;

  // stats.mode may be bigint
  const md = stats && Number.parseInt(stats.mode, 10);
  const st = md & 0o777;
  const it = Number.parseInt(st.toString(8)[0], 10);
  return Boolean(4 & it);
}

/**
 * Handles emitting unlink events for
 * files and directories, and via recursion, for
 * files and directories within directories that are unlinked
 * @param {String} directory within which the following item is located
 * @param {String} item      base path of item/directory
 * @returns {void}
*/
_remove(directory, item, isDirectory) {
  // if what is being deleted is a directory, get that directory's paths
  // for recursive deleting and cleaning of watched object
  // if it is not a directory, nestedDirectoryChildren will be empty array
  const path = sysPath.join(directory, item);
  const fullPath = sysPath.resolve(path);
  isDirectory = isDirectory != null
    ? isDirectory
    : this._watched.has(path) || this._watched.has(fullPath);

  // prevent duplicate handling in case of arriving here nearly simultaneously
  // via multiple paths (such as _handleFile and _handleDir)
  if (!this._throttle('remove', path, 100)) return;

  // if the only watched file is removed, watch for its return
  if (!isDirectory && !this.options.useFsEvents && this._watched.size === 1) {
    this.add(directory, item, true);
  }

  // This will create a new entry in the watched object in either case
  // so we got to do the directory check beforehand
  const wp = this._getWatchedDir(path);
  const nestedDirectoryChildren = wp.getChildren();

  // Recursively remove children directories / files.
  nestedDirectoryChildren.forEach(nested => this._remove(path, nested));

  // Check if item was on the watched list and remove it
  const parent = this._getWatchedDir(directory);
  const wasTracked = parent.has(item);
  parent.remove(item);

  // Fixes issue #1042 -> Relative paths were detected and added as symlinks
  // (https://github.com/paulmillr/chokidar/blob/e1753ddbc9571bdc33b4a4af172d52cb6e611c10/lib/nodefs-handler.js#L612),
  // but never removed from the map in case the path was deleted.
  // This leads to an incorrect state if the path was recreated:
  // https://github.com/paulmillr/chokidar/blob/e1753ddbc9571bdc33b4a4af172d52cb6e611c10/lib/nodefs-handler.js#L553
  if (this._symlinkPaths.has(fullPath)) {
    this._symlinkPaths.delete(fullPath);
  }

  // If we wait for this file to be fully written, cancel the wait.
  let relPath = path;
  if (this.options.cwd) relPath = sysPath.relative(this.options.cwd, path);
  if (this.options.awaitWriteFinish && this._pendingWrites.has(relPath)) {
    const event = this._pendingWrites.get(relPath).cancelWait();
    if (event === EV_ADD) return;
  }

  // The Entry will either be a directory that just got removed
  // or a bogus entry to a file, in either case we have to remove it
  this._watched.delete(path);
  this._watched.delete(fullPath);
  const eventName = isDirectory ? EV_UNLINK_DIR : EV_UNLINK;
  if (wasTracked && !this._isIgnored(path)) this._emit(eventName, path);

  // Avoid conflicts if we later create another file with the same name
  if (!this.options.useFsEvents) {
    this._closePath(path);
  }
}

/**
 * Closes all watchers for a path
 * @param {Path} path
 */
_closePath(path) {
  this._closeFile(path)
  const dir = sysPath.dirname(path);
  this._getWatchedDir(dir).remove(sysPath.basename(path));
}

/**
 * Closes only file-specific watchers
 * @param {Path} path
 */
_closeFile(path) {
  const closers = this._closers.get(path);
  if (!closers) return;
  closers.forEach(closer => closer());
  this._closers.delete(path);
}

/**
 *
 * @param {Path} path
 * @param {Function} closer
 */
_addPathCloser(path, closer) {
  if (!closer) return;
  let list = this._closers.get(path);
  if (!list) {
    list = [];
    this._closers.set(path, list);
  }
  list.push(closer);
}

_readdirp(root, opts) {
  if (this.closed) return;
  const options = {type: EV_ALL, alwaysStat: true, lstat: true, ...opts};
  let stream = readdirp(root, options);
  this._streams.add(stream);
  stream.once(STR_CLOSE, () => {
    stream = undefined;
  });
  stream.once(STR_END, () => {
    if (stream) {
      this._streams.delete(stream);
      stream = undefined;
    }
  });
  return stream;
}

}

// Export FSWatcher class
exports.FSWatcher = FSWatcher;

/**
 * Instantiates watcher with paths to be tracked.
 * @param {String|Array<String>} paths file/directory paths and/or globs
 * @param {Object=} options chokidar opts
 * @returns an instance of FSWatcher for chaining.
 */
const watch = (paths, options) => {
  const watcher = new FSWatcher(options);
  watcher.add(paths);
  return watcher;
};

exports.watch = watch;


/***/ }),

/***/ "./node_modules/chokidar/lib/constants.js":
/*!************************************************!*\
  !*** ./node_modules/chokidar/lib/constants.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


const {sep} = __webpack_require__(/*! path */ "path");
const {platform} = process;
const os = __webpack_require__(/*! os */ "os");

exports.EV_ALL = 'all';
exports.EV_READY = 'ready';
exports.EV_ADD = 'add';
exports.EV_CHANGE = 'change';
exports.EV_ADD_DIR = 'addDir';
exports.EV_UNLINK = 'unlink';
exports.EV_UNLINK_DIR = 'unlinkDir';
exports.EV_RAW = 'raw';
exports.EV_ERROR = 'error';

exports.STR_DATA = 'data';
exports.STR_END = 'end';
exports.STR_CLOSE = 'close';

exports.FSEVENT_CREATED = 'created';
exports.FSEVENT_MODIFIED = 'modified';
exports.FSEVENT_DELETED = 'deleted';
exports.FSEVENT_MOVED = 'moved';
exports.FSEVENT_CLONED = 'cloned';
exports.FSEVENT_UNKNOWN = 'unknown';
exports.FSEVENT_FLAG_MUST_SCAN_SUBDIRS = 1;
exports.FSEVENT_TYPE_FILE = 'file';
exports.FSEVENT_TYPE_DIRECTORY = 'directory';
exports.FSEVENT_TYPE_SYMLINK = 'symlink';

exports.KEY_LISTENERS = 'listeners';
exports.KEY_ERR = 'errHandlers';
exports.KEY_RAW = 'rawEmitters';
exports.HANDLER_KEYS = [exports.KEY_LISTENERS, exports.KEY_ERR, exports.KEY_RAW];

exports.DOT_SLASH = `.${sep}`;

exports.BACK_SLASH_RE = /\\/g;
exports.DOUBLE_SLASH_RE = /\/\//;
exports.SLASH_OR_BACK_SLASH_RE = /[/\\]/;
exports.DOT_RE = /\..*\.(sw[px])$|~$|\.subl.*\.tmp/;
exports.REPLACER_RE = /^\.[/\\]/;

exports.SLASH = '/';
exports.SLASH_SLASH = '//';
exports.BRACE_START = '{';
exports.BANG = '!';
exports.ONE_DOT = '.';
exports.TWO_DOTS = '..';
exports.STAR = '*';
exports.GLOBSTAR = '**';
exports.ROOT_GLOBSTAR = '/**/*';
exports.SLASH_GLOBSTAR = '/**';
exports.DIR_SUFFIX = 'Dir';
exports.ANYMATCH_OPTS = {dot: true};
exports.STRING_TYPE = 'string';
exports.FUNCTION_TYPE = 'function';
exports.EMPTY_STR = '';
exports.EMPTY_FN = () => {};
exports.IDENTITY_FN = val => val;

exports.isWindows = platform === 'win32';
exports.isMacos = platform === 'darwin';
exports.isLinux = platform === 'linux';
exports.isIBMi = os.type() === 'OS400';


/***/ }),

/***/ "./node_modules/chokidar/lib/fsevents-handler.js":
/*!*******************************************************!*\
  !*** ./node_modules/chokidar/lib/fsevents-handler.js ***!
  \*******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const fs = __webpack_require__(/*! fs */ "fs");
const sysPath = __webpack_require__(/*! path */ "path");
const { promisify } = __webpack_require__(/*! util */ "util");

let fsevents;
try {
  fsevents = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module 'fsevents'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
} catch (error) {
  if (process.env.CHOKIDAR_PRINT_FSEVENTS_REQUIRE_ERROR) console.error(error);
}

if (fsevents) {
  // TODO: real check
  const mtch = process.version.match(/v(\d+)\.(\d+)/);
  if (mtch && mtch[1] && mtch[2]) {
    const maj = Number.parseInt(mtch[1], 10);
    const min = Number.parseInt(mtch[2], 10);
    if (maj === 8 && min < 16) {
      fsevents = undefined;
    }
  }
}

const {
  EV_ADD,
  EV_CHANGE,
  EV_ADD_DIR,
  EV_UNLINK,
  EV_ERROR,
  STR_DATA,
  STR_END,
  FSEVENT_CREATED,
  FSEVENT_MODIFIED,
  FSEVENT_DELETED,
  FSEVENT_MOVED,
  // FSEVENT_CLONED,
  FSEVENT_UNKNOWN,
  FSEVENT_FLAG_MUST_SCAN_SUBDIRS,
  FSEVENT_TYPE_FILE,
  FSEVENT_TYPE_DIRECTORY,
  FSEVENT_TYPE_SYMLINK,

  ROOT_GLOBSTAR,
  DIR_SUFFIX,
  DOT_SLASH,
  FUNCTION_TYPE,
  EMPTY_FN,
  IDENTITY_FN
} = __webpack_require__(/*! ./constants */ "./node_modules/chokidar/lib/constants.js");

const Depth = (value) => isNaN(value) ? {} : {depth: value};

const stat = promisify(fs.stat);
const lstat = promisify(fs.lstat);
const realpath = promisify(fs.realpath);

const statMethods = { stat, lstat };

/**
 * @typedef {String} Path
 */

/**
 * @typedef {Object} FsEventsWatchContainer
 * @property {Set<Function>} listeners
 * @property {Function} rawEmitter
 * @property {{stop: Function}} watcher
 */

// fsevents instance helper functions
/**
 * Object to hold per-process fsevents instances (may be shared across chokidar FSWatcher instances)
 * @type {Map<Path,FsEventsWatchContainer>}
 */
const FSEventsWatchers = new Map();

// Threshold of duplicate path prefixes at which to start
// consolidating going forward
const consolidateThreshhold = 10;

const wrongEventFlags = new Set([
  69888, 70400, 71424, 72704, 73472, 131328, 131840, 262912
]);

/**
 * Instantiates the fsevents interface
 * @param {Path} path path to be watched
 * @param {Function} callback called when fsevents is bound and ready
 * @returns {{stop: Function}} new fsevents instance
 */
const createFSEventsInstance = (path, callback) => {
  const stop = fsevents.watch(path, callback);
  return {stop};
};

/**
 * Instantiates the fsevents interface or binds listeners to an existing one covering
 * the same file tree.
 * @param {Path} path           - to be watched
 * @param {Path} realPath       - real path for symlinks
 * @param {Function} listener   - called when fsevents emits events
 * @param {Function} rawEmitter - passes data to listeners of the 'raw' event
 * @returns {Function} closer
 */
function setFSEventsListener(path, realPath, listener, rawEmitter) {
  let watchPath = sysPath.extname(realPath) ? sysPath.dirname(realPath) : realPath;

  const parentPath = sysPath.dirname(watchPath);
  let cont = FSEventsWatchers.get(watchPath);

  // If we've accumulated a substantial number of paths that
  // could have been consolidated by watching one directory
  // above the current one, create a watcher on the parent
  // path instead, so that we do consolidate going forward.
  if (couldConsolidate(parentPath)) {
    watchPath = parentPath;
  }

  const resolvedPath = sysPath.resolve(path);
  const hasSymlink = resolvedPath !== realPath;

  const filteredListener = (fullPath, flags, info) => {
    if (hasSymlink) fullPath = fullPath.replace(realPath, resolvedPath);
    if (
      fullPath === resolvedPath ||
      !fullPath.indexOf(resolvedPath + sysPath.sep)
    ) listener(fullPath, flags, info);
  };

  // check if there is already a watcher on a parent path
  // modifies `watchPath` to the parent path when it finds a match
  let watchedParent = false;
  for (const watchedPath of FSEventsWatchers.keys()) {
    if (realPath.indexOf(sysPath.resolve(watchedPath) + sysPath.sep) === 0) {
      watchPath = watchedPath;
      cont = FSEventsWatchers.get(watchPath);
      watchedParent = true;
      break;
    }
  }

  if (cont || watchedParent) {
    cont.listeners.add(filteredListener);
  } else {
    cont = {
      listeners: new Set([filteredListener]),
      rawEmitter,
      watcher: createFSEventsInstance(watchPath, (fullPath, flags) => {
        if (!cont.listeners.size) return;
        if (flags & FSEVENT_FLAG_MUST_SCAN_SUBDIRS) return;
        const info = fsevents.getInfo(fullPath, flags);
        cont.listeners.forEach(list => {
          list(fullPath, flags, info);
        });

        cont.rawEmitter(info.event, fullPath, info);
      })
    };
    FSEventsWatchers.set(watchPath, cont);
  }

  // removes this instance's listeners and closes the underlying fsevents
  // instance if there are no more listeners left
  return () => {
    const lst = cont.listeners;

    lst.delete(filteredListener);
    if (!lst.size) {
      FSEventsWatchers.delete(watchPath);
      if (cont.watcher) return cont.watcher.stop().then(() => {
        cont.rawEmitter = cont.watcher = undefined;
        Object.freeze(cont);
      });
    }
  };
}

// Decide whether or not we should start a new higher-level
// parent watcher
const couldConsolidate = (path) => {
  let count = 0;
  for (const watchPath of FSEventsWatchers.keys()) {
    if (watchPath.indexOf(path) === 0) {
      count++;
      if (count >= consolidateThreshhold) {
        return true;
      }
    }
  }

  return false;
};

// returns boolean indicating whether fsevents can be used
const canUse = () => fsevents && FSEventsWatchers.size < 128;

// determines subdirectory traversal levels from root to path
const calcDepth = (path, root) => {
  let i = 0;
  while (!path.indexOf(root) && (path = sysPath.dirname(path)) !== root) i++;
  return i;
};

// returns boolean indicating whether the fsevents' event info has the same type
// as the one returned by fs.stat
const sameTypes = (info, stats) => (
  info.type === FSEVENT_TYPE_DIRECTORY && stats.isDirectory() ||
  info.type === FSEVENT_TYPE_SYMLINK && stats.isSymbolicLink() ||
  info.type === FSEVENT_TYPE_FILE && stats.isFile()
)

/**
 * @mixin
 */
class FsEventsHandler {

/**
 * @param {import('../index').FSWatcher} fsw
 */
constructor(fsw) {
  this.fsw = fsw;
}
checkIgnored(path, stats) {
  const ipaths = this.fsw._ignoredPaths;
  if (this.fsw._isIgnored(path, stats)) {
    ipaths.add(path);
    if (stats && stats.isDirectory()) {
      ipaths.add(path + ROOT_GLOBSTAR);
    }
    return true;
  }

  ipaths.delete(path);
  ipaths.delete(path + ROOT_GLOBSTAR);
}

addOrChange(path, fullPath, realPath, parent, watchedDir, item, info, opts) {
  const event = watchedDir.has(item) ? EV_CHANGE : EV_ADD;
  this.handleEvent(event, path, fullPath, realPath, parent, watchedDir, item, info, opts);
}

async checkExists(path, fullPath, realPath, parent, watchedDir, item, info, opts) {
  try {
    const stats = await stat(path)
    if (this.fsw.closed) return;
    if (sameTypes(info, stats)) {
      this.addOrChange(path, fullPath, realPath, parent, watchedDir, item, info, opts);
    } else {
      this.handleEvent(EV_UNLINK, path, fullPath, realPath, parent, watchedDir, item, info, opts);
    }
  } catch (error) {
    if (error.code === 'EACCES') {
      this.addOrChange(path, fullPath, realPath, parent, watchedDir, item, info, opts);
    } else {
      this.handleEvent(EV_UNLINK, path, fullPath, realPath, parent, watchedDir, item, info, opts);
    }
  }
}

handleEvent(event, path, fullPath, realPath, parent, watchedDir, item, info, opts) {
  if (this.fsw.closed || this.checkIgnored(path)) return;

  if (event === EV_UNLINK) {
    const isDirectory = info.type === FSEVENT_TYPE_DIRECTORY
    // suppress unlink events on never before seen files
    if (isDirectory || watchedDir.has(item)) {
      this.fsw._remove(parent, item, isDirectory);
    }
  } else {
    if (event === EV_ADD) {
      // track new directories
      if (info.type === FSEVENT_TYPE_DIRECTORY) this.fsw._getWatchedDir(path);

      if (info.type === FSEVENT_TYPE_SYMLINK && opts.followSymlinks) {
        // push symlinks back to the top of the stack to get handled
        const curDepth = opts.depth === undefined ?
          undefined : calcDepth(fullPath, realPath) + 1;
        return this._addToFsEvents(path, false, true, curDepth);
      }

      // track new paths
      // (other than symlinks being followed, which will be tracked soon)
      this.fsw._getWatchedDir(parent).add(item);
    }
    /**
     * @type {'add'|'addDir'|'unlink'|'unlinkDir'}
     */
    const eventName = info.type === FSEVENT_TYPE_DIRECTORY ? event + DIR_SUFFIX : event;
    this.fsw._emit(eventName, path);
    if (eventName === EV_ADD_DIR) this._addToFsEvents(path, false, true);
  }
}

/**
 * Handle symlinks encountered during directory scan
 * @param {String} watchPath  - file/dir path to be watched with fsevents
 * @param {String} realPath   - real path (in case of symlinks)
 * @param {Function} transform  - path transformer
 * @param {Function} globFilter - path filter in case a glob pattern was provided
 * @returns {Function} closer for the watcher instance
*/
_watchWithFsEvents(watchPath, realPath, transform, globFilter) {
  if (this.fsw.closed || this.fsw._isIgnored(watchPath)) return;
  const opts = this.fsw.options;
  const watchCallback = async (fullPath, flags, info) => {
    if (this.fsw.closed) return;
    if (
      opts.depth !== undefined &&
      calcDepth(fullPath, realPath) > opts.depth
    ) return;
    const path = transform(sysPath.join(
      watchPath, sysPath.relative(watchPath, fullPath)
    ));
    if (globFilter && !globFilter(path)) return;
    // ensure directories are tracked
    const parent = sysPath.dirname(path);
    const item = sysPath.basename(path);
    const watchedDir = this.fsw._getWatchedDir(
      info.type === FSEVENT_TYPE_DIRECTORY ? path : parent
    );

    // correct for wrong events emitted
    if (wrongEventFlags.has(flags) || info.event === FSEVENT_UNKNOWN) {
      if (typeof opts.ignored === FUNCTION_TYPE) {
        let stats;
        try {
          stats = await stat(path);
        } catch (error) {}
        if (this.fsw.closed) return;
        if (this.checkIgnored(path, stats)) return;
        if (sameTypes(info, stats)) {
          this.addOrChange(path, fullPath, realPath, parent, watchedDir, item, info, opts);
        } else {
          this.handleEvent(EV_UNLINK, path, fullPath, realPath, parent, watchedDir, item, info, opts);
        }
      } else {
        this.checkExists(path, fullPath, realPath, parent, watchedDir, item, info, opts);
      }
    } else {
      switch (info.event) {
      case FSEVENT_CREATED:
      case FSEVENT_MODIFIED:
        return this.addOrChange(path, fullPath, realPath, parent, watchedDir, item, info, opts);
      case FSEVENT_DELETED:
      case FSEVENT_MOVED:
        return this.checkExists(path, fullPath, realPath, parent, watchedDir, item, info, opts);
      }
    }
  };

  const closer = setFSEventsListener(
    watchPath,
    realPath,
    watchCallback,
    this.fsw._emitRaw
  );

  this.fsw._emitReady();
  return closer;
}

/**
 * Handle symlinks encountered during directory scan
 * @param {String} linkPath path to symlink
 * @param {String} fullPath absolute path to the symlink
 * @param {Function} transform pre-existing path transformer
 * @param {Number} curDepth level of subdirectories traversed to where symlink is
 * @returns {Promise<void>}
 */
async _handleFsEventsSymlink(linkPath, fullPath, transform, curDepth) {
  // don't follow the same symlink more than once
  if (this.fsw.closed || this.fsw._symlinkPaths.has(fullPath)) return;

  this.fsw._symlinkPaths.set(fullPath, true);
  this.fsw._incrReadyCount();

  try {
    const linkTarget = await realpath(linkPath);
    if (this.fsw.closed) return;
    if (this.fsw._isIgnored(linkTarget)) {
      return this.fsw._emitReady();
    }

    this.fsw._incrReadyCount();

    // add the linkTarget for watching with a wrapper for transform
    // that causes emitted paths to incorporate the link's path
    this._addToFsEvents(linkTarget || linkPath, (path) => {
      let aliasedPath = linkPath;
      if (linkTarget && linkTarget !== DOT_SLASH) {
        aliasedPath = path.replace(linkTarget, linkPath);
      } else if (path !== DOT_SLASH) {
        aliasedPath = sysPath.join(linkPath, path);
      }
      return transform(aliasedPath);
    }, false, curDepth);
  } catch(error) {
    if (this.fsw._handleError(error)) {
      return this.fsw._emitReady();
    }
  }
}

/**
 *
 * @param {Path} newPath
 * @param {fs.Stats} stats
 */
emitAdd(newPath, stats, processPath, opts, forceAdd) {
  const pp = processPath(newPath);
  const isDir = stats.isDirectory();
  const dirObj = this.fsw._getWatchedDir(sysPath.dirname(pp));
  const base = sysPath.basename(pp);

  // ensure empty dirs get tracked
  if (isDir) this.fsw._getWatchedDir(pp);
  if (dirObj.has(base)) return;
  dirObj.add(base);

  if (!opts.ignoreInitial || forceAdd === true) {
    this.fsw._emit(isDir ? EV_ADD_DIR : EV_ADD, pp, stats);
  }
}

initWatch(realPath, path, wh, processPath) {
  if (this.fsw.closed) return;
  const closer = this._watchWithFsEvents(
    wh.watchPath,
    sysPath.resolve(realPath || wh.watchPath),
    processPath,
    wh.globFilter
  );
  this.fsw._addPathCloser(path, closer);
}

/**
 * Handle added path with fsevents
 * @param {String} path file/dir path or glob pattern
 * @param {Function|Boolean=} transform converts working path to what the user expects
 * @param {Boolean=} forceAdd ensure add is emitted
 * @param {Number=} priorDepth Level of subdirectories already traversed.
 * @returns {Promise<void>}
 */
async _addToFsEvents(path, transform, forceAdd, priorDepth) {
  if (this.fsw.closed) {
    return;
  }
  const opts = this.fsw.options;
  const processPath = typeof transform === FUNCTION_TYPE ? transform : IDENTITY_FN;

  const wh = this.fsw._getWatchHelpers(path);

  // evaluate what is at the path we're being asked to watch
  try {
    const stats = await statMethods[wh.statMethod](wh.watchPath);
    if (this.fsw.closed) return;
    if (this.fsw._isIgnored(wh.watchPath, stats)) {
      throw null;
    }
    if (stats.isDirectory()) {
      // emit addDir unless this is a glob parent
      if (!wh.globFilter) this.emitAdd(processPath(path), stats, processPath, opts, forceAdd);

      // don't recurse further if it would exceed depth setting
      if (priorDepth && priorDepth > opts.depth) return;

      // scan the contents of the dir
      this.fsw._readdirp(wh.watchPath, {
        fileFilter: entry => wh.filterPath(entry),
        directoryFilter: entry => wh.filterDir(entry),
        ...Depth(opts.depth - (priorDepth || 0))
      }).on(STR_DATA, (entry) => {
        // need to check filterPath on dirs b/c filterDir is less restrictive
        if (this.fsw.closed) {
          return;
        }
        if (entry.stats.isDirectory() && !wh.filterPath(entry)) return;

        const joinedPath = sysPath.join(wh.watchPath, entry.path);
        const {fullPath} = entry;

        if (wh.followSymlinks && entry.stats.isSymbolicLink()) {
          // preserve the current depth here since it can't be derived from
          // real paths past the symlink
          const curDepth = opts.depth === undefined ?
            undefined : calcDepth(joinedPath, sysPath.resolve(wh.watchPath)) + 1;

          this._handleFsEventsSymlink(joinedPath, fullPath, processPath, curDepth);
        } else {
          this.emitAdd(joinedPath, entry.stats, processPath, opts, forceAdd);
        }
      }).on(EV_ERROR, EMPTY_FN).on(STR_END, () => {
        this.fsw._emitReady();
      });
    } else {
      this.emitAdd(wh.watchPath, stats, processPath, opts, forceAdd);
      this.fsw._emitReady();
    }
  } catch (error) {
    if (!error || this.fsw._handleError(error)) {
      // TODO: Strange thing: "should not choke on an ignored watch path" will be failed without 2 ready calls -__-
      this.fsw._emitReady();
      this.fsw._emitReady();
    }
  }

  if (opts.persistent && forceAdd !== true) {
    if (typeof transform === FUNCTION_TYPE) {
      // realpath has already been resolved
      this.initWatch(undefined, path, wh, processPath);
    } else {
      let realPath;
      try {
        realPath = await realpath(wh.watchPath);
      } catch (e) {}
      this.initWatch(realPath, path, wh, processPath);
    }
  }
}

}

module.exports = FsEventsHandler;
module.exports.canUse = canUse;


/***/ }),

/***/ "./node_modules/chokidar/lib/nodefs-handler.js":
/*!*****************************************************!*\
  !*** ./node_modules/chokidar/lib/nodefs-handler.js ***!
  \*****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const fs = __webpack_require__(/*! fs */ "fs");
const sysPath = __webpack_require__(/*! path */ "path");
const { promisify } = __webpack_require__(/*! util */ "util");
const isBinaryPath = __webpack_require__(/*! is-binary-path */ "./node_modules/is-binary-path/index.js");
const {
  isWindows,
  isLinux,
  EMPTY_FN,
  EMPTY_STR,
  KEY_LISTENERS,
  KEY_ERR,
  KEY_RAW,
  HANDLER_KEYS,
  EV_CHANGE,
  EV_ADD,
  EV_ADD_DIR,
  EV_ERROR,
  STR_DATA,
  STR_END,
  BRACE_START,
  STAR
} = __webpack_require__(/*! ./constants */ "./node_modules/chokidar/lib/constants.js");

const THROTTLE_MODE_WATCH = 'watch';

const open = promisify(fs.open);
const stat = promisify(fs.stat);
const lstat = promisify(fs.lstat);
const close = promisify(fs.close);
const fsrealpath = promisify(fs.realpath);

const statMethods = { lstat, stat };

// TODO: emit errors properly. Example: EMFILE on Macos.
const foreach = (val, fn) => {
  if (val instanceof Set) {
    val.forEach(fn);
  } else {
    fn(val);
  }
};

const addAndConvert = (main, prop, item) => {
  let container = main[prop];
  if (!(container instanceof Set)) {
    main[prop] = container = new Set([container]);
  }
  container.add(item);
};

const clearItem = cont => key => {
  const set = cont[key];
  if (set instanceof Set) {
    set.clear();
  } else {
    delete cont[key];
  }
};

const delFromSet = (main, prop, item) => {
  const container = main[prop];
  if (container instanceof Set) {
    container.delete(item);
  } else if (container === item) {
    delete main[prop];
  }
};

const isEmptySet = (val) => val instanceof Set ? val.size === 0 : !val;

/**
 * @typedef {String} Path
 */

// fs_watch helpers

// object to hold per-process fs_watch instances
// (may be shared across chokidar FSWatcher instances)

/**
 * @typedef {Object} FsWatchContainer
 * @property {Set} listeners
 * @property {Set} errHandlers
 * @property {Set} rawEmitters
 * @property {fs.FSWatcher=} watcher
 * @property {Boolean=} watcherUnusable
 */

/**
 * @type {Map<String,FsWatchContainer>}
 */
const FsWatchInstances = new Map();

/**
 * Instantiates the fs_watch interface
 * @param {String} path to be watched
 * @param {Object} options to be passed to fs_watch
 * @param {Function} listener main event handler
 * @param {Function} errHandler emits info about errors
 * @param {Function} emitRaw emits raw event data
 * @returns {fs.FSWatcher} new fsevents instance
 */
function createFsWatchInstance(path, options, listener, errHandler, emitRaw) {
  const handleEvent = (rawEvent, evPath) => {
    listener(path);
    emitRaw(rawEvent, evPath, {watchedPath: path});

    // emit based on events occurring for files from a directory's watcher in
    // case the file's watcher misses it (and rely on throttling to de-dupe)
    if (evPath && path !== evPath) {
      fsWatchBroadcast(
        sysPath.resolve(path, evPath), KEY_LISTENERS, sysPath.join(path, evPath)
      );
    }
  };
  try {
    return fs.watch(path, options, handleEvent);
  } catch (error) {
    errHandler(error);
  }
}

/**
 * Helper for passing fs_watch event data to a collection of listeners
 * @param {Path} fullPath absolute path bound to fs_watch instance
 * @param {String} type listener type
 * @param {*=} val1 arguments to be passed to listeners
 * @param {*=} val2
 * @param {*=} val3
 */
const fsWatchBroadcast = (fullPath, type, val1, val2, val3) => {
  const cont = FsWatchInstances.get(fullPath);
  if (!cont) return;
  foreach(cont[type], (listener) => {
    listener(val1, val2, val3);
  });
};

/**
 * Instantiates the fs_watch interface or binds listeners
 * to an existing one covering the same file system entry
 * @param {String} path
 * @param {String} fullPath absolute path
 * @param {Object} options to be passed to fs_watch
 * @param {Object} handlers container for event listener functions
 */
const setFsWatchListener = (path, fullPath, options, handlers) => {
  const {listener, errHandler, rawEmitter} = handlers;
  let cont = FsWatchInstances.get(fullPath);

  /** @type {fs.FSWatcher=} */
  let watcher;
  if (!options.persistent) {
    watcher = createFsWatchInstance(
      path, options, listener, errHandler, rawEmitter
    );
    return watcher.close.bind(watcher);
  }
  if (cont) {
    addAndConvert(cont, KEY_LISTENERS, listener);
    addAndConvert(cont, KEY_ERR, errHandler);
    addAndConvert(cont, KEY_RAW, rawEmitter);
  } else {
    watcher = createFsWatchInstance(
      path,
      options,
      fsWatchBroadcast.bind(null, fullPath, KEY_LISTENERS),
      errHandler, // no need to use broadcast here
      fsWatchBroadcast.bind(null, fullPath, KEY_RAW)
    );
    if (!watcher) return;
    watcher.on(EV_ERROR, async (error) => {
      const broadcastErr = fsWatchBroadcast.bind(null, fullPath, KEY_ERR);
      cont.watcherUnusable = true; // documented since Node 10.4.1
      // Workaround for https://github.com/joyent/node/issues/4337
      if (isWindows && error.code === 'EPERM') {
        try {
          const fd = await open(path, 'r');
          await close(fd);
          broadcastErr(error);
        } catch (err) {}
      } else {
        broadcastErr(error);
      }
    });
    cont = {
      listeners: listener,
      errHandlers: errHandler,
      rawEmitters: rawEmitter,
      watcher
    };
    FsWatchInstances.set(fullPath, cont);
  }
  // const index = cont.listeners.indexOf(listener);

  // removes this instance's listeners and closes the underlying fs_watch
  // instance if there are no more listeners left
  return () => {
    delFromSet(cont, KEY_LISTENERS, listener);
    delFromSet(cont, KEY_ERR, errHandler);
    delFromSet(cont, KEY_RAW, rawEmitter);
    if (isEmptySet(cont.listeners)) {
      // Check to protect against issue gh-730.
      // if (cont.watcherUnusable) {
      cont.watcher.close();
      // }
      FsWatchInstances.delete(fullPath);
      HANDLER_KEYS.forEach(clearItem(cont));
      cont.watcher = undefined;
      Object.freeze(cont);
    }
  };
};

// fs_watchFile helpers

// object to hold per-process fs_watchFile instances
// (may be shared across chokidar FSWatcher instances)
const FsWatchFileInstances = new Map();

/**
 * Instantiates the fs_watchFile interface or binds listeners
 * to an existing one covering the same file system entry
 * @param {String} path to be watched
 * @param {String} fullPath absolute path
 * @param {Object} options options to be passed to fs_watchFile
 * @param {Object} handlers container for event listener functions
 * @returns {Function} closer
 */
const setFsWatchFileListener = (path, fullPath, options, handlers) => {
  const {listener, rawEmitter} = handlers;
  let cont = FsWatchFileInstances.get(fullPath);

  /* eslint-disable no-unused-vars, prefer-destructuring */
  let listeners = new Set();
  let rawEmitters = new Set();

  const copts = cont && cont.options;
  if (copts && (copts.persistent < options.persistent || copts.interval > options.interval)) {
    // "Upgrade" the watcher to persistence or a quicker interval.
    // This creates some unlikely edge case issues if the user mixes
    // settings in a very weird way, but solving for those cases
    // doesn't seem worthwhile for the added complexity.
    listeners = cont.listeners;
    rawEmitters = cont.rawEmitters;
    fs.unwatchFile(fullPath);
    cont = undefined;
  }

  /* eslint-enable no-unused-vars, prefer-destructuring */

  if (cont) {
    addAndConvert(cont, KEY_LISTENERS, listener);
    addAndConvert(cont, KEY_RAW, rawEmitter);
  } else {
    // TODO
    // listeners.add(listener);
    // rawEmitters.add(rawEmitter);
    cont = {
      listeners: listener,
      rawEmitters: rawEmitter,
      options,
      watcher: fs.watchFile(fullPath, options, (curr, prev) => {
        foreach(cont.rawEmitters, (rawEmitter) => {
          rawEmitter(EV_CHANGE, fullPath, {curr, prev});
        });
        const currmtime = curr.mtimeMs;
        if (curr.size !== prev.size || currmtime > prev.mtimeMs || currmtime === 0) {
          foreach(cont.listeners, (listener) => listener(path, curr));
        }
      })
    };
    FsWatchFileInstances.set(fullPath, cont);
  }
  // const index = cont.listeners.indexOf(listener);

  // Removes this instance's listeners and closes the underlying fs_watchFile
  // instance if there are no more listeners left.
  return () => {
    delFromSet(cont, KEY_LISTENERS, listener);
    delFromSet(cont, KEY_RAW, rawEmitter);
    if (isEmptySet(cont.listeners)) {
      FsWatchFileInstances.delete(fullPath);
      fs.unwatchFile(fullPath);
      cont.options = cont.watcher = undefined;
      Object.freeze(cont);
    }
  };
};

/**
 * @mixin
 */
class NodeFsHandler {

/**
 * @param {import("../index").FSWatcher} fsW
 */
constructor(fsW) {
  this.fsw = fsW;
  this._boundHandleError = (error) => fsW._handleError(error);
}

/**
 * Watch file for changes with fs_watchFile or fs_watch.
 * @param {String} path to file or dir
 * @param {Function} listener on fs change
 * @returns {Function} closer for the watcher instance
 */
_watchWithNodeFs(path, listener) {
  const opts = this.fsw.options;
  const directory = sysPath.dirname(path);
  const basename = sysPath.basename(path);
  const parent = this.fsw._getWatchedDir(directory);
  parent.add(basename);
  const absolutePath = sysPath.resolve(path);
  const options = {persistent: opts.persistent};
  if (!listener) listener = EMPTY_FN;

  let closer;
  if (opts.usePolling) {
    options.interval = opts.enableBinaryInterval && isBinaryPath(basename) ?
      opts.binaryInterval : opts.interval;
    closer = setFsWatchFileListener(path, absolutePath, options, {
      listener,
      rawEmitter: this.fsw._emitRaw
    });
  } else {
    closer = setFsWatchListener(path, absolutePath, options, {
      listener,
      errHandler: this._boundHandleError,
      rawEmitter: this.fsw._emitRaw
    });
  }
  return closer;
}

/**
 * Watch a file and emit add event if warranted.
 * @param {Path} file Path
 * @param {fs.Stats} stats result of fs_stat
 * @param {Boolean} initialAdd was the file added at watch instantiation?
 * @returns {Function} closer for the watcher instance
 */
_handleFile(file, stats, initialAdd) {
  if (this.fsw.closed) {
    return;
  }
  const dirname = sysPath.dirname(file);
  const basename = sysPath.basename(file);
  const parent = this.fsw._getWatchedDir(dirname);
  // stats is always present
  let prevStats = stats;

  // if the file is already being watched, do nothing
  if (parent.has(basename)) return;

  const listener = async (path, newStats) => {
    if (!this.fsw._throttle(THROTTLE_MODE_WATCH, file, 5)) return;
    if (!newStats || newStats.mtimeMs === 0) {
      try {
        const newStats = await stat(file);
        if (this.fsw.closed) return;
        // Check that change event was not fired because of changed only accessTime.
        const at = newStats.atimeMs;
        const mt = newStats.mtimeMs;
        if (!at || at <= mt || mt !== prevStats.mtimeMs) {
          this.fsw._emit(EV_CHANGE, file, newStats);
        }
        if (isLinux && prevStats.ino !== newStats.ino) {
          this.fsw._closeFile(path)
          prevStats = newStats;
          this.fsw._addPathCloser(path, this._watchWithNodeFs(file, listener));
        } else {
          prevStats = newStats;
        }
      } catch (error) {
        // Fix issues where mtime is null but file is still present
        this.fsw._remove(dirname, basename);
      }
      // add is about to be emitted if file not already tracked in parent
    } else if (parent.has(basename)) {
      // Check that change event was not fired because of changed only accessTime.
      const at = newStats.atimeMs;
      const mt = newStats.mtimeMs;
      if (!at || at <= mt || mt !== prevStats.mtimeMs) {
        this.fsw._emit(EV_CHANGE, file, newStats);
      }
      prevStats = newStats;
    }
  }
  // kick off the watcher
  const closer = this._watchWithNodeFs(file, listener);

  // emit an add event if we're supposed to
  if (!(initialAdd && this.fsw.options.ignoreInitial) && this.fsw._isntIgnored(file)) {
    if (!this.fsw._throttle(EV_ADD, file, 0)) return;
    this.fsw._emit(EV_ADD, file, stats);
  }

  return closer;
}

/**
 * Handle symlinks encountered while reading a dir.
 * @param {Object} entry returned by readdirp
 * @param {String} directory path of dir being read
 * @param {String} path of this item
 * @param {String} item basename of this item
 * @returns {Promise<Boolean>} true if no more processing is needed for this entry.
 */
async _handleSymlink(entry, directory, path, item) {
  if (this.fsw.closed) {
    return;
  }
  const full = entry.fullPath;
  const dir = this.fsw._getWatchedDir(directory);

  if (!this.fsw.options.followSymlinks) {
    // watch symlink directly (don't follow) and detect changes
    this.fsw._incrReadyCount();

    let linkPath;
    try {
      linkPath = await fsrealpath(path);
    } catch (e) {
      this.fsw._emitReady();
      return true;
    }

    if (this.fsw.closed) return;
    if (dir.has(item)) {
      if (this.fsw._symlinkPaths.get(full) !== linkPath) {
        this.fsw._symlinkPaths.set(full, linkPath);
        this.fsw._emit(EV_CHANGE, path, entry.stats);
      }
    } else {
      dir.add(item);
      this.fsw._symlinkPaths.set(full, linkPath);
      this.fsw._emit(EV_ADD, path, entry.stats);
    }
    this.fsw._emitReady();
    return true;
  }

  // don't follow the same symlink more than once
  if (this.fsw._symlinkPaths.has(full)) {
    return true;
  }

  this.fsw._symlinkPaths.set(full, true);
}

_handleRead(directory, initialAdd, wh, target, dir, depth, throttler) {
  // Normalize the directory name on Windows
  directory = sysPath.join(directory, EMPTY_STR);

  if (!wh.hasGlob) {
    throttler = this.fsw._throttle('readdir', directory, 1000);
    if (!throttler) return;
  }

  const previous = this.fsw._getWatchedDir(wh.path);
  const current = new Set();

  let stream = this.fsw._readdirp(directory, {
    fileFilter: entry => wh.filterPath(entry),
    directoryFilter: entry => wh.filterDir(entry),
    depth: 0
  }).on(STR_DATA, async (entry) => {
    if (this.fsw.closed) {
      stream = undefined;
      return;
    }
    const item = entry.path;
    let path = sysPath.join(directory, item);
    current.add(item);

    if (entry.stats.isSymbolicLink() && await this._handleSymlink(entry, directory, path, item)) {
      return;
    }

    if (this.fsw.closed) {
      stream = undefined;
      return;
    }
    // Files that present in current directory snapshot
    // but absent in previous are added to watch list and
    // emit `add` event.
    if (item === target || !target && !previous.has(item)) {
      this.fsw._incrReadyCount();

      // ensure relativeness of path is preserved in case of watcher reuse
      path = sysPath.join(dir, sysPath.relative(dir, path));

      this._addToNodeFs(path, initialAdd, wh, depth + 1);
    }
  }).on(EV_ERROR, this._boundHandleError);

  return new Promise(resolve =>
    stream.once(STR_END, () => {
      if (this.fsw.closed) {
        stream = undefined;
        return;
      }
      const wasThrottled = throttler ? throttler.clear() : false;

      resolve();

      // Files that absent in current directory snapshot
      // but present in previous emit `remove` event
      // and are removed from @watched[directory].
      previous.getChildren().filter((item) => {
        return item !== directory &&
          !current.has(item) &&
          // in case of intersecting globs;
          // a path may have been filtered out of this readdir, but
          // shouldn't be removed because it matches a different glob
          (!wh.hasGlob || wh.filterPath({
            fullPath: sysPath.resolve(directory, item)
          }));
      }).forEach((item) => {
        this.fsw._remove(directory, item);
      });

      stream = undefined;

      // one more time for any missed in case changes came in extremely quickly
      if (wasThrottled) this._handleRead(directory, false, wh, target, dir, depth, throttler);
    })
  );
}

/**
 * Read directory to add / remove files from `@watched` list and re-read it on change.
 * @param {String} dir fs path
 * @param {fs.Stats} stats
 * @param {Boolean} initialAdd
 * @param {Number} depth relative to user-supplied path
 * @param {String} target child path targeted for watch
 * @param {Object} wh Common watch helpers for this path
 * @param {String} realpath
 * @returns {Promise<Function>} closer for the watcher instance.
 */
async _handleDir(dir, stats, initialAdd, depth, target, wh, realpath) {
  const parentDir = this.fsw._getWatchedDir(sysPath.dirname(dir));
  const tracked = parentDir.has(sysPath.basename(dir));
  if (!(initialAdd && this.fsw.options.ignoreInitial) && !target && !tracked) {
    if (!wh.hasGlob || wh.globFilter(dir)) this.fsw._emit(EV_ADD_DIR, dir, stats);
  }

  // ensure dir is tracked (harmless if redundant)
  parentDir.add(sysPath.basename(dir));
  this.fsw._getWatchedDir(dir);
  let throttler;
  let closer;

  const oDepth = this.fsw.options.depth;
  if ((oDepth == null || depth <= oDepth) && !this.fsw._symlinkPaths.has(realpath)) {
    if (!target) {
      await this._handleRead(dir, initialAdd, wh, target, dir, depth, throttler);
      if (this.fsw.closed) return;
    }

    closer = this._watchWithNodeFs(dir, (dirPath, stats) => {
      // if current directory is removed, do nothing
      if (stats && stats.mtimeMs === 0) return;

      this._handleRead(dirPath, false, wh, target, dir, depth, throttler);
    });
  }
  return closer;
}

/**
 * Handle added file, directory, or glob pattern.
 * Delegates call to _handleFile / _handleDir after checks.
 * @param {String} path to file or ir
 * @param {Boolean} initialAdd was the file added at watch instantiation?
 * @param {Object} priorWh depth relative to user-supplied path
 * @param {Number} depth Child path actually targeted for watch
 * @param {String=} target Child path actually targeted for watch
 * @returns {Promise}
 */
async _addToNodeFs(path, initialAdd, priorWh, depth, target) {
  const ready = this.fsw._emitReady;
  if (this.fsw._isIgnored(path) || this.fsw.closed) {
    ready();
    return false;
  }

  const wh = this.fsw._getWatchHelpers(path, depth);
  if (!wh.hasGlob && priorWh) {
    wh.hasGlob = priorWh.hasGlob;
    wh.globFilter = priorWh.globFilter;
    wh.filterPath = entry => priorWh.filterPath(entry);
    wh.filterDir = entry => priorWh.filterDir(entry);
  }

  // evaluate what is at the path we're being asked to watch
  try {
    const stats = await statMethods[wh.statMethod](wh.watchPath);
    if (this.fsw.closed) return;
    if (this.fsw._isIgnored(wh.watchPath, stats)) {
      ready();
      return false;
    }

    const follow = this.fsw.options.followSymlinks && !path.includes(STAR) && !path.includes(BRACE_START);
    let closer;
    if (stats.isDirectory()) {
      const absPath = sysPath.resolve(path);
      const targetPath = follow ? await fsrealpath(path) : path;
      if (this.fsw.closed) return;
      closer = await this._handleDir(wh.watchPath, stats, initialAdd, depth, target, wh, targetPath);
      if (this.fsw.closed) return;
      // preserve this symlink's target path
      if (absPath !== targetPath && targetPath !== undefined) {
        this.fsw._symlinkPaths.set(absPath, targetPath);
      }
    } else if (stats.isSymbolicLink()) {
      const targetPath = follow ? await fsrealpath(path) : path;
      if (this.fsw.closed) return;
      const parent = sysPath.dirname(wh.watchPath);
      this.fsw._getWatchedDir(parent).add(wh.watchPath);
      this.fsw._emit(EV_ADD, wh.watchPath, stats);
      closer = await this._handleDir(parent, stats, initialAdd, depth, path, wh, targetPath);
      if (this.fsw.closed) return;

      // preserve this symlink's target path
      if (targetPath !== undefined) {
        this.fsw._symlinkPaths.set(sysPath.resolve(path), targetPath);
      }
    } else {
      closer = this._handleFile(wh.watchPath, stats, initialAdd);
    }
    ready();

    this.fsw._addPathCloser(path, closer);
    return false;

  } catch (error) {
    if (this.fsw._handleError(error)) {
      ready();
      return path;
    }
  }
}

}

module.exports = NodeFsHandler;


/***/ }),

/***/ "./node_modules/electron-reload/main.js":
/*!**********************************************!*\
  !*** ./node_modules/electron-reload/main.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* module decorator */ module = __webpack_require__.nmd(module);
const { app } = __webpack_require__(/*! electron */ "electron")
const chokidar = __webpack_require__(/*! chokidar */ "./node_modules/chokidar/index.js")
const fs = __webpack_require__(/*! fs */ "fs")
const { spawn } = __webpack_require__(/*! child_process */ "child_process")

const appPath = app.getAppPath()
const ignoredPaths = /node_modules|[/\\]\./
// Main file poses a special case, as its changes are
// only effective when the process is restarted (hard reset)
// We assume that electron-reload is required by the main
// file of the electron application
const mainFile = module.parent.filename

/**
 * Creates a callback for hard resets.
 *
 * @param {string} eXecutable path to electron executable
 * @param {string} hardResetMethod method to restart electron
 * @param {string[]} eArgv arguments passed to electron
 * @param {string[]} aArgv arguments passed to the application
 * @returns {function} handler to pass to chokidar
 */
const createHardresetHandler = (eXecutable, hardResetMethod, eArgv, aArgv) =>
  () => {
    // Detaching child is useful when in Windows to let child
    // live after the parent is killed
    const args = (eArgv || [])
      .concat([appPath])
      .concat(aArgv || [])
    const child = spawn(eXecutable, args, {
      detached: true,
      stdio: 'inherit'
    })
    child.unref()
    // Kamikaze!

    // In cases where an app overrides the default closing or quiting actions
    // firing an `app.quit()` may not actually quit the app. In these cases
    // you can use `app.exit()` to gracefully close the app.
    if (hardResetMethod === 'exit') {
      app.exit()
    } else {
      app.quit()
    }
  }
module.exports = function elecronReload (glob, options = {}) {
  const browserWindows = []
  const watcher = chokidar.watch(glob, Object.assign({ ignored: [ignoredPaths, mainFile] }, options))

  // Callback function to be executed:
  // I) soft reset: reload browser windows
  const softResetHandler = () => browserWindows.forEach(bw => bw.webContents.reloadIgnoringCache())
  // II) hard reset: restart the whole electron process
  const eXecutable = options.electron
  const hardResetHandler = createHardresetHandler(
    eXecutable,
    options.hardResetMethod,
    options.electronArgv,
    options.appArgv)

  // Add each created BrowserWindow to list of maintained items
  app.on('browser-window-created', (e, bw) => {
    browserWindows.push(bw)

    // Remove closed windows from list of maintained items
    bw.on('closed', function () {
      const i = browserWindows.indexOf(bw) // Must use current index
      browserWindows.splice(i, 1)
    })
  })

  // Enable default soft reset
  watcher.on('change', softResetHandler)

  // Preparing hard reset if electron executable is given in options
  // A hard reset is only done when the main file has changed
  if (eXecutable) {
    if (!fs.existsSync(eXecutable)) {
      throw new Error('Provided electron executable cannot be found or is not exeecutable!')
    }

    const hardWatcher = chokidar.watch(mainFile, Object.assign({ ignored: [ignoredPaths] }, options))

    if (options.forceHardReset === true) {
      // Watch every file for hard reset and not only the main file
      hardWatcher.add(glob)
      // Stop our default soft reset
      watcher.close()
    }

    hardWatcher.once('change', hardResetHandler)
  }
}


/***/ }),

/***/ "./node_modules/fill-range/index.js":
/*!******************************************!*\
  !*** ./node_modules/fill-range/index.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*!
 * fill-range <https://github.com/jonschlinkert/fill-range>
 *
 * Copyright (c) 2014-present, Jon Schlinkert.
 * Licensed under the MIT License.
 */



const util = __webpack_require__(/*! util */ "util");
const toRegexRange = __webpack_require__(/*! to-regex-range */ "./node_modules/to-regex-range/index.js");

const isObject = val => val !== null && typeof val === 'object' && !Array.isArray(val);

const transform = toNumber => {
  return value => toNumber === true ? Number(value) : String(value);
};

const isValidValue = value => {
  return typeof value === 'number' || (typeof value === 'string' && value !== '');
};

const isNumber = num => Number.isInteger(+num);

const zeros = input => {
  let value = `${input}`;
  let index = -1;
  if (value[0] === '-') value = value.slice(1);
  if (value === '0') return false;
  while (value[++index] === '0');
  return index > 0;
};

const stringify = (start, end, options) => {
  if (typeof start === 'string' || typeof end === 'string') {
    return true;
  }
  return options.stringify === true;
};

const pad = (input, maxLength, toNumber) => {
  if (maxLength > 0) {
    let dash = input[0] === '-' ? '-' : '';
    if (dash) input = input.slice(1);
    input = (dash + input.padStart(dash ? maxLength - 1 : maxLength, '0'));
  }
  if (toNumber === false) {
    return String(input);
  }
  return input;
};

const toMaxLen = (input, maxLength) => {
  let negative = input[0] === '-' ? '-' : '';
  if (negative) {
    input = input.slice(1);
    maxLength--;
  }
  while (input.length < maxLength) input = '0' + input;
  return negative ? ('-' + input) : input;
};

const toSequence = (parts, options, maxLen) => {
  parts.negatives.sort((a, b) => a < b ? -1 : a > b ? 1 : 0);
  parts.positives.sort((a, b) => a < b ? -1 : a > b ? 1 : 0);

  let prefix = options.capture ? '' : '?:';
  let positives = '';
  let negatives = '';
  let result;

  if (parts.positives.length) {
    positives = parts.positives.map(v => toMaxLen(String(v), maxLen)).join('|');
  }

  if (parts.negatives.length) {
    negatives = `-(${prefix}${parts.negatives.map(v => toMaxLen(String(v), maxLen)).join('|')})`;
  }

  if (positives && negatives) {
    result = `${positives}|${negatives}`;
  } else {
    result = positives || negatives;
  }

  if (options.wrap) {
    return `(${prefix}${result})`;
  }

  return result;
};

const toRange = (a, b, isNumbers, options) => {
  if (isNumbers) {
    return toRegexRange(a, b, { wrap: false, ...options });
  }

  let start = String.fromCharCode(a);
  if (a === b) return start;

  let stop = String.fromCharCode(b);
  return `[${start}-${stop}]`;
};

const toRegex = (start, end, options) => {
  if (Array.isArray(start)) {
    let wrap = options.wrap === true;
    let prefix = options.capture ? '' : '?:';
    return wrap ? `(${prefix}${start.join('|')})` : start.join('|');
  }
  return toRegexRange(start, end, options);
};

const rangeError = (...args) => {
  return new RangeError('Invalid range arguments: ' + util.inspect(...args));
};

const invalidRange = (start, end, options) => {
  if (options.strictRanges === true) throw rangeError([start, end]);
  return [];
};

const invalidStep = (step, options) => {
  if (options.strictRanges === true) {
    throw new TypeError(`Expected step "${step}" to be a number`);
  }
  return [];
};

const fillNumbers = (start, end, step = 1, options = {}) => {
  let a = Number(start);
  let b = Number(end);

  if (!Number.isInteger(a) || !Number.isInteger(b)) {
    if (options.strictRanges === true) throw rangeError([start, end]);
    return [];
  }

  // fix negative zero
  if (a === 0) a = 0;
  if (b === 0) b = 0;

  let descending = a > b;
  let startString = String(start);
  let endString = String(end);
  let stepString = String(step);
  step = Math.max(Math.abs(step), 1);

  let padded = zeros(startString) || zeros(endString) || zeros(stepString);
  let maxLen = padded ? Math.max(startString.length, endString.length, stepString.length) : 0;
  let toNumber = padded === false && stringify(start, end, options) === false;
  let format = options.transform || transform(toNumber);

  if (options.toRegex && step === 1) {
    return toRange(toMaxLen(start, maxLen), toMaxLen(end, maxLen), true, options);
  }

  let parts = { negatives: [], positives: [] };
  let push = num => parts[num < 0 ? 'negatives' : 'positives'].push(Math.abs(num));
  let range = [];
  let index = 0;

  while (descending ? a >= b : a <= b) {
    if (options.toRegex === true && step > 1) {
      push(a);
    } else {
      range.push(pad(format(a, index), maxLen, toNumber));
    }
    a = descending ? a - step : a + step;
    index++;
  }

  if (options.toRegex === true) {
    return step > 1
      ? toSequence(parts, options, maxLen)
      : toRegex(range, null, { wrap: false, ...options });
  }

  return range;
};

const fillLetters = (start, end, step = 1, options = {}) => {
  if ((!isNumber(start) && start.length > 1) || (!isNumber(end) && end.length > 1)) {
    return invalidRange(start, end, options);
  }

  let format = options.transform || (val => String.fromCharCode(val));
  let a = `${start}`.charCodeAt(0);
  let b = `${end}`.charCodeAt(0);

  let descending = a > b;
  let min = Math.min(a, b);
  let max = Math.max(a, b);

  if (options.toRegex && step === 1) {
    return toRange(min, max, false, options);
  }

  let range = [];
  let index = 0;

  while (descending ? a >= b : a <= b) {
    range.push(format(a, index));
    a = descending ? a - step : a + step;
    index++;
  }

  if (options.toRegex === true) {
    return toRegex(range, null, { wrap: false, options });
  }

  return range;
};

const fill = (start, end, step, options = {}) => {
  if (end == null && isValidValue(start)) {
    return [start];
  }

  if (!isValidValue(start) || !isValidValue(end)) {
    return invalidRange(start, end, options);
  }

  if (typeof step === 'function') {
    return fill(start, end, 1, { transform: step });
  }

  if (isObject(step)) {
    return fill(start, end, 0, step);
  }

  let opts = { ...options };
  if (opts.capture === true) opts.wrap = true;
  step = step || opts.step || 1;

  if (!isNumber(step)) {
    if (step != null && !isObject(step)) return invalidStep(step, opts);
    return fill(start, end, 1, step);
  }

  if (isNumber(start) && isNumber(end)) {
    return fillNumbers(start, end, step, opts);
  }

  return fillLetters(start, end, Math.max(Math.abs(step), 1), opts);
};

module.exports = fill;


/***/ }),

/***/ "./node_modules/glob-parent/index.js":
/*!*******************************************!*\
  !*** ./node_modules/glob-parent/index.js ***!
  \*******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var isGlob = __webpack_require__(/*! is-glob */ "./node_modules/is-glob/index.js");
var pathPosixDirname = (__webpack_require__(/*! path */ "path").posix).dirname;
var isWin32 = (__webpack_require__(/*! os */ "os").platform)() === 'win32';

var slash = '/';
var backslash = /\\/g;
var enclosure = /[\{\[].*[\}\]]$/;
var globby = /(^|[^\\])([\{\[]|\([^\)]+$)/;
var escaped = /\\([\!\*\?\|\[\]\(\)\{\}])/g;

/**
 * @param {string} str
 * @param {Object} opts
 * @param {boolean} [opts.flipBackslashes=true]
 * @returns {string}
 */
module.exports = function globParent(str, opts) {
  var options = Object.assign({ flipBackslashes: true }, opts);

  // flip windows path separators
  if (options.flipBackslashes && isWin32 && str.indexOf(slash) < 0) {
    str = str.replace(backslash, slash);
  }

  // special case for strings ending in enclosure containing path separator
  if (enclosure.test(str)) {
    str += slash;
  }

  // preserves full path in case of trailing path separator
  str += 'a';

  // remove path parts that are globby
  do {
    str = pathPosixDirname(str);
  } while (isGlob(str) || globby.test(str));

  // remove escape chars and return result
  return str.replace(escaped, '$1');
};


/***/ }),

/***/ "./node_modules/is-binary-path/index.js":
/*!**********************************************!*\
  !*** ./node_modules/is-binary-path/index.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const path = __webpack_require__(/*! path */ "path");
const binaryExtensions = __webpack_require__(/*! binary-extensions */ "./node_modules/binary-extensions/index.js");

const extensions = new Set(binaryExtensions);

module.exports = filePath => extensions.has(path.extname(filePath).slice(1).toLowerCase());


/***/ }),

/***/ "./node_modules/is-extglob/index.js":
/*!******************************************!*\
  !*** ./node_modules/is-extglob/index.js ***!
  \******************************************/
/***/ ((module) => {

/*!
 * is-extglob <https://github.com/jonschlinkert/is-extglob>
 *
 * Copyright (c) 2014-2016, Jon Schlinkert.
 * Licensed under the MIT License.
 */

module.exports = function isExtglob(str) {
  if (typeof str !== 'string' || str === '') {
    return false;
  }

  var match;
  while ((match = /(\\).|([@?!+*]\(.*\))/g.exec(str))) {
    if (match[2]) return true;
    str = str.slice(match.index + match[0].length);
  }

  return false;
};


/***/ }),

/***/ "./node_modules/is-glob/index.js":
/*!***************************************!*\
  !*** ./node_modules/is-glob/index.js ***!
  \***************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/*!
 * is-glob <https://github.com/jonschlinkert/is-glob>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */

var isExtglob = __webpack_require__(/*! is-extglob */ "./node_modules/is-extglob/index.js");
var chars = { '{': '}', '(': ')', '[': ']'};
var strictCheck = function(str) {
  if (str[0] === '!') {
    return true;
  }
  var index = 0;
  var pipeIndex = -2;
  var closeSquareIndex = -2;
  var closeCurlyIndex = -2;
  var closeParenIndex = -2;
  var backSlashIndex = -2;
  while (index < str.length) {
    if (str[index] === '*') {
      return true;
    }

    if (str[index + 1] === '?' && /[\].+)]/.test(str[index])) {
      return true;
    }

    if (closeSquareIndex !== -1 && str[index] === '[' && str[index + 1] !== ']') {
      if (closeSquareIndex < index) {
        closeSquareIndex = str.indexOf(']', index);
      }
      if (closeSquareIndex > index) {
        if (backSlashIndex === -1 || backSlashIndex > closeSquareIndex) {
          return true;
        }
        backSlashIndex = str.indexOf('\\', index);
        if (backSlashIndex === -1 || backSlashIndex > closeSquareIndex) {
          return true;
        }
      }
    }

    if (closeCurlyIndex !== -1 && str[index] === '{' && str[index + 1] !== '}') {
      closeCurlyIndex = str.indexOf('}', index);
      if (closeCurlyIndex > index) {
        backSlashIndex = str.indexOf('\\', index);
        if (backSlashIndex === -1 || backSlashIndex > closeCurlyIndex) {
          return true;
        }
      }
    }

    if (closeParenIndex !== -1 && str[index] === '(' && str[index + 1] === '?' && /[:!=]/.test(str[index + 2]) && str[index + 3] !== ')') {
      closeParenIndex = str.indexOf(')', index);
      if (closeParenIndex > index) {
        backSlashIndex = str.indexOf('\\', index);
        if (backSlashIndex === -1 || backSlashIndex > closeParenIndex) {
          return true;
        }
      }
    }

    if (pipeIndex !== -1 && str[index] === '(' && str[index + 1] !== '|') {
      if (pipeIndex < index) {
        pipeIndex = str.indexOf('|', index);
      }
      if (pipeIndex !== -1 && str[pipeIndex + 1] !== ')') {
        closeParenIndex = str.indexOf(')', pipeIndex);
        if (closeParenIndex > pipeIndex) {
          backSlashIndex = str.indexOf('\\', pipeIndex);
          if (backSlashIndex === -1 || backSlashIndex > closeParenIndex) {
            return true;
          }
        }
      }
    }

    if (str[index] === '\\') {
      var open = str[index + 1];
      index += 2;
      var close = chars[open];

      if (close) {
        var n = str.indexOf(close, index);
        if (n !== -1) {
          index = n + 1;
        }
      }

      if (str[index] === '!') {
        return true;
      }
    } else {
      index++;
    }
  }
  return false;
};

var relaxedCheck = function(str) {
  if (str[0] === '!') {
    return true;
  }
  var index = 0;
  while (index < str.length) {
    if (/[*?{}()[\]]/.test(str[index])) {
      return true;
    }

    if (str[index] === '\\') {
      var open = str[index + 1];
      index += 2;
      var close = chars[open];

      if (close) {
        var n = str.indexOf(close, index);
        if (n !== -1) {
          index = n + 1;
        }
      }

      if (str[index] === '!') {
        return true;
      }
    } else {
      index++;
    }
  }
  return false;
};

module.exports = function isGlob(str, options) {
  if (typeof str !== 'string' || str === '') {
    return false;
  }

  if (isExtglob(str)) {
    return true;
  }

  var check = strictCheck;

  // optionally relax check
  if (options && options.strict === false) {
    check = relaxedCheck;
  }

  return check(str);
};


/***/ }),

/***/ "./node_modules/is-number/index.js":
/*!*****************************************!*\
  !*** ./node_modules/is-number/index.js ***!
  \*****************************************/
/***/ ((module) => {

"use strict";
/*!
 * is-number <https://github.com/jonschlinkert/is-number>
 *
 * Copyright (c) 2014-present, Jon Schlinkert.
 * Released under the MIT License.
 */



module.exports = function(num) {
  if (typeof num === 'number') {
    return num - num === 0;
  }
  if (typeof num === 'string' && num.trim() !== '') {
    return Number.isFinite ? Number.isFinite(+num) : isFinite(+num);
  }
  return false;
};


/***/ }),

/***/ "./node_modules/normalize-path/index.js":
/*!**********************************************!*\
  !*** ./node_modules/normalize-path/index.js ***!
  \**********************************************/
/***/ ((module) => {

/*!
 * normalize-path <https://github.com/jonschlinkert/normalize-path>
 *
 * Copyright (c) 2014-2018, Jon Schlinkert.
 * Released under the MIT License.
 */

module.exports = function(path, stripTrailing) {
  if (typeof path !== 'string') {
    throw new TypeError('expected path to be a string');
  }

  if (path === '\\' || path === '/') return '/';

  var len = path.length;
  if (len <= 1) return path;

  // ensure that win32 namespaces has two leading slashes, so that the path is
  // handled properly by the win32 version of path.parse() after being normalized
  // https://msdn.microsoft.com/library/windows/desktop/aa365247(v=vs.85).aspx#namespaces
  var prefix = '';
  if (len > 4 && path[3] === '\\') {
    var ch = path[2];
    if ((ch === '?' || ch === '.') && path.slice(0, 2) === '\\\\') {
      path = path.slice(2);
      prefix = '//';
    }
  }

  var segs = path.split(/[/\\]+/);
  if (stripTrailing !== false && segs[segs.length - 1] === '') {
    segs.pop();
  }
  return prefix + segs.join('/');
};


/***/ }),

/***/ "./node_modules/picomatch/index.js":
/*!*****************************************!*\
  !*** ./node_modules/picomatch/index.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


module.exports = __webpack_require__(/*! ./lib/picomatch */ "./node_modules/picomatch/lib/picomatch.js");


/***/ }),

/***/ "./node_modules/picomatch/lib/constants.js":
/*!*************************************************!*\
  !*** ./node_modules/picomatch/lib/constants.js ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const path = __webpack_require__(/*! path */ "path");
const WIN_SLASH = '\\\\/';
const WIN_NO_SLASH = `[^${WIN_SLASH}]`;

/**
 * Posix glob regex
 */

const DOT_LITERAL = '\\.';
const PLUS_LITERAL = '\\+';
const QMARK_LITERAL = '\\?';
const SLASH_LITERAL = '\\/';
const ONE_CHAR = '(?=.)';
const QMARK = '[^/]';
const END_ANCHOR = `(?:${SLASH_LITERAL}|$)`;
const START_ANCHOR = `(?:^|${SLASH_LITERAL})`;
const DOTS_SLASH = `${DOT_LITERAL}{1,2}${END_ANCHOR}`;
const NO_DOT = `(?!${DOT_LITERAL})`;
const NO_DOTS = `(?!${START_ANCHOR}${DOTS_SLASH})`;
const NO_DOT_SLASH = `(?!${DOT_LITERAL}{0,1}${END_ANCHOR})`;
const NO_DOTS_SLASH = `(?!${DOTS_SLASH})`;
const QMARK_NO_DOT = `[^.${SLASH_LITERAL}]`;
const STAR = `${QMARK}*?`;

const POSIX_CHARS = {
  DOT_LITERAL,
  PLUS_LITERAL,
  QMARK_LITERAL,
  SLASH_LITERAL,
  ONE_CHAR,
  QMARK,
  END_ANCHOR,
  DOTS_SLASH,
  NO_DOT,
  NO_DOTS,
  NO_DOT_SLASH,
  NO_DOTS_SLASH,
  QMARK_NO_DOT,
  STAR,
  START_ANCHOR
};

/**
 * Windows glob regex
 */

const WINDOWS_CHARS = {
  ...POSIX_CHARS,

  SLASH_LITERAL: `[${WIN_SLASH}]`,
  QMARK: WIN_NO_SLASH,
  STAR: `${WIN_NO_SLASH}*?`,
  DOTS_SLASH: `${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$)`,
  NO_DOT: `(?!${DOT_LITERAL})`,
  NO_DOTS: `(?!(?:^|[${WIN_SLASH}])${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$))`,
  NO_DOT_SLASH: `(?!${DOT_LITERAL}{0,1}(?:[${WIN_SLASH}]|$))`,
  NO_DOTS_SLASH: `(?!${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$))`,
  QMARK_NO_DOT: `[^.${WIN_SLASH}]`,
  START_ANCHOR: `(?:^|[${WIN_SLASH}])`,
  END_ANCHOR: `(?:[${WIN_SLASH}]|$)`
};

/**
 * POSIX Bracket Regex
 */

const POSIX_REGEX_SOURCE = {
  alnum: 'a-zA-Z0-9',
  alpha: 'a-zA-Z',
  ascii: '\\x00-\\x7F',
  blank: ' \\t',
  cntrl: '\\x00-\\x1F\\x7F',
  digit: '0-9',
  graph: '\\x21-\\x7E',
  lower: 'a-z',
  print: '\\x20-\\x7E ',
  punct: '\\-!"#$%&\'()\\*+,./:;<=>?@[\\]^_`{|}~',
  space: ' \\t\\r\\n\\v\\f',
  upper: 'A-Z',
  word: 'A-Za-z0-9_',
  xdigit: 'A-Fa-f0-9'
};

module.exports = {
  MAX_LENGTH: 1024 * 64,
  POSIX_REGEX_SOURCE,

  // regular expressions
  REGEX_BACKSLASH: /\\(?![*+?^${}(|)[\]])/g,
  REGEX_NON_SPECIAL_CHARS: /^[^@![\].,$*+?^{}()|\\/]+/,
  REGEX_SPECIAL_CHARS: /[-*+?.^${}(|)[\]]/,
  REGEX_SPECIAL_CHARS_BACKREF: /(\\?)((\W)(\3*))/g,
  REGEX_SPECIAL_CHARS_GLOBAL: /([-*+?.^${}(|)[\]])/g,
  REGEX_REMOVE_BACKSLASH: /(?:\[.*?[^\\]\]|\\(?=.))/g,

  // Replace globs with equivalent patterns to reduce parsing time.
  REPLACEMENTS: {
    '***': '*',
    '**/**': '**',
    '**/**/**': '**'
  },

  // Digits
  CHAR_0: 48, /* 0 */
  CHAR_9: 57, /* 9 */

  // Alphabet chars.
  CHAR_UPPERCASE_A: 65, /* A */
  CHAR_LOWERCASE_A: 97, /* a */
  CHAR_UPPERCASE_Z: 90, /* Z */
  CHAR_LOWERCASE_Z: 122, /* z */

  CHAR_LEFT_PARENTHESES: 40, /* ( */
  CHAR_RIGHT_PARENTHESES: 41, /* ) */

  CHAR_ASTERISK: 42, /* * */

  // Non-alphabetic chars.
  CHAR_AMPERSAND: 38, /* & */
  CHAR_AT: 64, /* @ */
  CHAR_BACKWARD_SLASH: 92, /* \ */
  CHAR_CARRIAGE_RETURN: 13, /* \r */
  CHAR_CIRCUMFLEX_ACCENT: 94, /* ^ */
  CHAR_COLON: 58, /* : */
  CHAR_COMMA: 44, /* , */
  CHAR_DOT: 46, /* . */
  CHAR_DOUBLE_QUOTE: 34, /* " */
  CHAR_EQUAL: 61, /* = */
  CHAR_EXCLAMATION_MARK: 33, /* ! */
  CHAR_FORM_FEED: 12, /* \f */
  CHAR_FORWARD_SLASH: 47, /* / */
  CHAR_GRAVE_ACCENT: 96, /* ` */
  CHAR_HASH: 35, /* # */
  CHAR_HYPHEN_MINUS: 45, /* - */
  CHAR_LEFT_ANGLE_BRACKET: 60, /* < */
  CHAR_LEFT_CURLY_BRACE: 123, /* { */
  CHAR_LEFT_SQUARE_BRACKET: 91, /* [ */
  CHAR_LINE_FEED: 10, /* \n */
  CHAR_NO_BREAK_SPACE: 160, /* \u00A0 */
  CHAR_PERCENT: 37, /* % */
  CHAR_PLUS: 43, /* + */
  CHAR_QUESTION_MARK: 63, /* ? */
  CHAR_RIGHT_ANGLE_BRACKET: 62, /* > */
  CHAR_RIGHT_CURLY_BRACE: 125, /* } */
  CHAR_RIGHT_SQUARE_BRACKET: 93, /* ] */
  CHAR_SEMICOLON: 59, /* ; */
  CHAR_SINGLE_QUOTE: 39, /* ' */
  CHAR_SPACE: 32, /*   */
  CHAR_TAB: 9, /* \t */
  CHAR_UNDERSCORE: 95, /* _ */
  CHAR_VERTICAL_LINE: 124, /* | */
  CHAR_ZERO_WIDTH_NOBREAK_SPACE: 65279, /* \uFEFF */

  SEP: path.sep,

  /**
   * Create EXTGLOB_CHARS
   */

  extglobChars(chars) {
    return {
      '!': { type: 'negate', open: '(?:(?!(?:', close: `))${chars.STAR})` },
      '?': { type: 'qmark', open: '(?:', close: ')?' },
      '+': { type: 'plus', open: '(?:', close: ')+' },
      '*': { type: 'star', open: '(?:', close: ')*' },
      '@': { type: 'at', open: '(?:', close: ')' }
    };
  },

  /**
   * Create GLOB_CHARS
   */

  globChars(win32) {
    return win32 === true ? WINDOWS_CHARS : POSIX_CHARS;
  }
};


/***/ }),

/***/ "./node_modules/picomatch/lib/parse.js":
/*!*********************************************!*\
  !*** ./node_modules/picomatch/lib/parse.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const constants = __webpack_require__(/*! ./constants */ "./node_modules/picomatch/lib/constants.js");
const utils = __webpack_require__(/*! ./utils */ "./node_modules/picomatch/lib/utils.js");

/**
 * Constants
 */

const {
  MAX_LENGTH,
  POSIX_REGEX_SOURCE,
  REGEX_NON_SPECIAL_CHARS,
  REGEX_SPECIAL_CHARS_BACKREF,
  REPLACEMENTS
} = constants;

/**
 * Helpers
 */

const expandRange = (args, options) => {
  if (typeof options.expandRange === 'function') {
    return options.expandRange(...args, options);
  }

  args.sort();
  const value = `[${args.join('-')}]`;

  try {
    /* eslint-disable-next-line no-new */
    new RegExp(value);
  } catch (ex) {
    return args.map(v => utils.escapeRegex(v)).join('..');
  }

  return value;
};

/**
 * Create the message for a syntax error
 */

const syntaxError = (type, char) => {
  return `Missing ${type}: "${char}" - use "\\\\${char}" to match literal characters`;
};

/**
 * Parse the given input string.
 * @param {String} input
 * @param {Object} options
 * @return {Object}
 */

const parse = (input, options) => {
  if (typeof input !== 'string') {
    throw new TypeError('Expected a string');
  }

  input = REPLACEMENTS[input] || input;

  const opts = { ...options };
  const max = typeof opts.maxLength === 'number' ? Math.min(MAX_LENGTH, opts.maxLength) : MAX_LENGTH;

  let len = input.length;
  if (len > max) {
    throw new SyntaxError(`Input length: ${len}, exceeds maximum allowed length: ${max}`);
  }

  const bos = { type: 'bos', value: '', output: opts.prepend || '' };
  const tokens = [bos];

  const capture = opts.capture ? '' : '?:';
  const win32 = utils.isWindows(options);

  // create constants based on platform, for windows or posix
  const PLATFORM_CHARS = constants.globChars(win32);
  const EXTGLOB_CHARS = constants.extglobChars(PLATFORM_CHARS);

  const {
    DOT_LITERAL,
    PLUS_LITERAL,
    SLASH_LITERAL,
    ONE_CHAR,
    DOTS_SLASH,
    NO_DOT,
    NO_DOT_SLASH,
    NO_DOTS_SLASH,
    QMARK,
    QMARK_NO_DOT,
    STAR,
    START_ANCHOR
  } = PLATFORM_CHARS;

  const globstar = opts => {
    return `(${capture}(?:(?!${START_ANCHOR}${opts.dot ? DOTS_SLASH : DOT_LITERAL}).)*?)`;
  };

  const nodot = opts.dot ? '' : NO_DOT;
  const qmarkNoDot = opts.dot ? QMARK : QMARK_NO_DOT;
  let star = opts.bash === true ? globstar(opts) : STAR;

  if (opts.capture) {
    star = `(${star})`;
  }

  // minimatch options support
  if (typeof opts.noext === 'boolean') {
    opts.noextglob = opts.noext;
  }

  const state = {
    input,
    index: -1,
    start: 0,
    dot: opts.dot === true,
    consumed: '',
    output: '',
    prefix: '',
    backtrack: false,
    negated: false,
    brackets: 0,
    braces: 0,
    parens: 0,
    quotes: 0,
    globstar: false,
    tokens
  };

  input = utils.removePrefix(input, state);
  len = input.length;

  const extglobs = [];
  const braces = [];
  const stack = [];
  let prev = bos;
  let value;

  /**
   * Tokenizing helpers
   */

  const eos = () => state.index === len - 1;
  const peek = state.peek = (n = 1) => input[state.index + n];
  const advance = state.advance = () => input[++state.index] || '';
  const remaining = () => input.slice(state.index + 1);
  const consume = (value = '', num = 0) => {
    state.consumed += value;
    state.index += num;
  };

  const append = token => {
    state.output += token.output != null ? token.output : token.value;
    consume(token.value);
  };

  const negate = () => {
    let count = 1;

    while (peek() === '!' && (peek(2) !== '(' || peek(3) === '?')) {
      advance();
      state.start++;
      count++;
    }

    if (count % 2 === 0) {
      return false;
    }

    state.negated = true;
    state.start++;
    return true;
  };

  const increment = type => {
    state[type]++;
    stack.push(type);
  };

  const decrement = type => {
    state[type]--;
    stack.pop();
  };

  /**
   * Push tokens onto the tokens array. This helper speeds up
   * tokenizing by 1) helping us avoid backtracking as much as possible,
   * and 2) helping us avoid creating extra tokens when consecutive
   * characters are plain text. This improves performance and simplifies
   * lookbehinds.
   */

  const push = tok => {
    if (prev.type === 'globstar') {
      const isBrace = state.braces > 0 && (tok.type === 'comma' || tok.type === 'brace');
      const isExtglob = tok.extglob === true || (extglobs.length && (tok.type === 'pipe' || tok.type === 'paren'));

      if (tok.type !== 'slash' && tok.type !== 'paren' && !isBrace && !isExtglob) {
        state.output = state.output.slice(0, -prev.output.length);
        prev.type = 'star';
        prev.value = '*';
        prev.output = star;
        state.output += prev.output;
      }
    }

    if (extglobs.length && tok.type !== 'paren') {
      extglobs[extglobs.length - 1].inner += tok.value;
    }

    if (tok.value || tok.output) append(tok);
    if (prev && prev.type === 'text' && tok.type === 'text') {
      prev.value += tok.value;
      prev.output = (prev.output || '') + tok.value;
      return;
    }

    tok.prev = prev;
    tokens.push(tok);
    prev = tok;
  };

  const extglobOpen = (type, value) => {
    const token = { ...EXTGLOB_CHARS[value], conditions: 1, inner: '' };

    token.prev = prev;
    token.parens = state.parens;
    token.output = state.output;
    const output = (opts.capture ? '(' : '') + token.open;

    increment('parens');
    push({ type, value, output: state.output ? '' : ONE_CHAR });
    push({ type: 'paren', extglob: true, value: advance(), output });
    extglobs.push(token);
  };

  const extglobClose = token => {
    let output = token.close + (opts.capture ? ')' : '');
    let rest;

    if (token.type === 'negate') {
      let extglobStar = star;

      if (token.inner && token.inner.length > 1 && token.inner.includes('/')) {
        extglobStar = globstar(opts);
      }

      if (extglobStar !== star || eos() || /^\)+$/.test(remaining())) {
        output = token.close = `)$))${extglobStar}`;
      }

      if (token.inner.includes('*') && (rest = remaining()) && /^\.[^\\/.]+$/.test(rest)) {
        // Any non-magical string (`.ts`) or even nested expression (`.{ts,tsx}`) can follow after the closing parenthesis.
        // In this case, we need to parse the string and use it in the output of the original pattern.
        // Suitable patterns: `/!(*.d).ts`, `/!(*.d).{ts,tsx}`, `**/!(*-dbg).@(js)`.
        //
        // Disabling the `fastpaths` option due to a problem with parsing strings as `.ts` in the pattern like `**/!(*.d).ts`.
        const expression = parse(rest, { ...options, fastpaths: false }).output;

        output = token.close = `)${expression})${extglobStar})`;
      }

      if (token.prev.type === 'bos') {
        state.negatedExtglob = true;
      }
    }

    push({ type: 'paren', extglob: true, value, output });
    decrement('parens');
  };

  /**
   * Fast paths
   */

  if (opts.fastpaths !== false && !/(^[*!]|[/()[\]{}"])/.test(input)) {
    let backslashes = false;

    let output = input.replace(REGEX_SPECIAL_CHARS_BACKREF, (m, esc, chars, first, rest, index) => {
      if (first === '\\') {
        backslashes = true;
        return m;
      }

      if (first === '?') {
        if (esc) {
          return esc + first + (rest ? QMARK.repeat(rest.length) : '');
        }
        if (index === 0) {
          return qmarkNoDot + (rest ? QMARK.repeat(rest.length) : '');
        }
        return QMARK.repeat(chars.length);
      }

      if (first === '.') {
        return DOT_LITERAL.repeat(chars.length);
      }

      if (first === '*') {
        if (esc) {
          return esc + first + (rest ? star : '');
        }
        return star;
      }
      return esc ? m : `\\${m}`;
    });

    if (backslashes === true) {
      if (opts.unescape === true) {
        output = output.replace(/\\/g, '');
      } else {
        output = output.replace(/\\+/g, m => {
          return m.length % 2 === 0 ? '\\\\' : (m ? '\\' : '');
        });
      }
    }

    if (output === input && opts.contains === true) {
      state.output = input;
      return state;
    }

    state.output = utils.wrapOutput(output, state, options);
    return state;
  }

  /**
   * Tokenize input until we reach end-of-string
   */

  while (!eos()) {
    value = advance();

    if (value === '\u0000') {
      continue;
    }

    /**
     * Escaped characters
     */

    if (value === '\\') {
      const next = peek();

      if (next === '/' && opts.bash !== true) {
        continue;
      }

      if (next === '.' || next === ';') {
        continue;
      }

      if (!next) {
        value += '\\';
        push({ type: 'text', value });
        continue;
      }

      // collapse slashes to reduce potential for exploits
      const match = /^\\+/.exec(remaining());
      let slashes = 0;

      if (match && match[0].length > 2) {
        slashes = match[0].length;
        state.index += slashes;
        if (slashes % 2 !== 0) {
          value += '\\';
        }
      }

      if (opts.unescape === true) {
        value = advance();
      } else {
        value += advance();
      }

      if (state.brackets === 0) {
        push({ type: 'text', value });
        continue;
      }
    }

    /**
     * If we're inside a regex character class, continue
     * until we reach the closing bracket.
     */

    if (state.brackets > 0 && (value !== ']' || prev.value === '[' || prev.value === '[^')) {
      if (opts.posix !== false && value === ':') {
        const inner = prev.value.slice(1);
        if (inner.includes('[')) {
          prev.posix = true;

          if (inner.includes(':')) {
            const idx = prev.value.lastIndexOf('[');
            const pre = prev.value.slice(0, idx);
            const rest = prev.value.slice(idx + 2);
            const posix = POSIX_REGEX_SOURCE[rest];
            if (posix) {
              prev.value = pre + posix;
              state.backtrack = true;
              advance();

              if (!bos.output && tokens.indexOf(prev) === 1) {
                bos.output = ONE_CHAR;
              }
              continue;
            }
          }
        }
      }

      if ((value === '[' && peek() !== ':') || (value === '-' && peek() === ']')) {
        value = `\\${value}`;
      }

      if (value === ']' && (prev.value === '[' || prev.value === '[^')) {
        value = `\\${value}`;
      }

      if (opts.posix === true && value === '!' && prev.value === '[') {
        value = '^';
      }

      prev.value += value;
      append({ value });
      continue;
    }

    /**
     * If we're inside a quoted string, continue
     * until we reach the closing double quote.
     */

    if (state.quotes === 1 && value !== '"') {
      value = utils.escapeRegex(value);
      prev.value += value;
      append({ value });
      continue;
    }

    /**
     * Double quotes
     */

    if (value === '"') {
      state.quotes = state.quotes === 1 ? 0 : 1;
      if (opts.keepQuotes === true) {
        push({ type: 'text', value });
      }
      continue;
    }

    /**
     * Parentheses
     */

    if (value === '(') {
      increment('parens');
      push({ type: 'paren', value });
      continue;
    }

    if (value === ')') {
      if (state.parens === 0 && opts.strictBrackets === true) {
        throw new SyntaxError(syntaxError('opening', '('));
      }

      const extglob = extglobs[extglobs.length - 1];
      if (extglob && state.parens === extglob.parens + 1) {
        extglobClose(extglobs.pop());
        continue;
      }

      push({ type: 'paren', value, output: state.parens ? ')' : '\\)' });
      decrement('parens');
      continue;
    }

    /**
     * Square brackets
     */

    if (value === '[') {
      if (opts.nobracket === true || !remaining().includes(']')) {
        if (opts.nobracket !== true && opts.strictBrackets === true) {
          throw new SyntaxError(syntaxError('closing', ']'));
        }

        value = `\\${value}`;
      } else {
        increment('brackets');
      }

      push({ type: 'bracket', value });
      continue;
    }

    if (value === ']') {
      if (opts.nobracket === true || (prev && prev.type === 'bracket' && prev.value.length === 1)) {
        push({ type: 'text', value, output: `\\${value}` });
        continue;
      }

      if (state.brackets === 0) {
        if (opts.strictBrackets === true) {
          throw new SyntaxError(syntaxError('opening', '['));
        }

        push({ type: 'text', value, output: `\\${value}` });
        continue;
      }

      decrement('brackets');

      const prevValue = prev.value.slice(1);
      if (prev.posix !== true && prevValue[0] === '^' && !prevValue.includes('/')) {
        value = `/${value}`;
      }

      prev.value += value;
      append({ value });

      // when literal brackets are explicitly disabled
      // assume we should match with a regex character class
      if (opts.literalBrackets === false || utils.hasRegexChars(prevValue)) {
        continue;
      }

      const escaped = utils.escapeRegex(prev.value);
      state.output = state.output.slice(0, -prev.value.length);

      // when literal brackets are explicitly enabled
      // assume we should escape the brackets to match literal characters
      if (opts.literalBrackets === true) {
        state.output += escaped;
        prev.value = escaped;
        continue;
      }

      // when the user specifies nothing, try to match both
      prev.value = `(${capture}${escaped}|${prev.value})`;
      state.output += prev.value;
      continue;
    }

    /**
     * Braces
     */

    if (value === '{' && opts.nobrace !== true) {
      increment('braces');

      const open = {
        type: 'brace',
        value,
        output: '(',
        outputIndex: state.output.length,
        tokensIndex: state.tokens.length
      };

      braces.push(open);
      push(open);
      continue;
    }

    if (value === '}') {
      const brace = braces[braces.length - 1];

      if (opts.nobrace === true || !brace) {
        push({ type: 'text', value, output: value });
        continue;
      }

      let output = ')';

      if (brace.dots === true) {
        const arr = tokens.slice();
        const range = [];

        for (let i = arr.length - 1; i >= 0; i--) {
          tokens.pop();
          if (arr[i].type === 'brace') {
            break;
          }
          if (arr[i].type !== 'dots') {
            range.unshift(arr[i].value);
          }
        }

        output = expandRange(range, opts);
        state.backtrack = true;
      }

      if (brace.comma !== true && brace.dots !== true) {
        const out = state.output.slice(0, brace.outputIndex);
        const toks = state.tokens.slice(brace.tokensIndex);
        brace.value = brace.output = '\\{';
        value = output = '\\}';
        state.output = out;
        for (const t of toks) {
          state.output += (t.output || t.value);
        }
      }

      push({ type: 'brace', value, output });
      decrement('braces');
      braces.pop();
      continue;
    }

    /**
     * Pipes
     */

    if (value === '|') {
      if (extglobs.length > 0) {
        extglobs[extglobs.length - 1].conditions++;
      }
      push({ type: 'text', value });
      continue;
    }

    /**
     * Commas
     */

    if (value === ',') {
      let output = value;

      const brace = braces[braces.length - 1];
      if (brace && stack[stack.length - 1] === 'braces') {
        brace.comma = true;
        output = '|';
      }

      push({ type: 'comma', value, output });
      continue;
    }

    /**
     * Slashes
     */

    if (value === '/') {
      // if the beginning of the glob is "./", advance the start
      // to the current index, and don't add the "./" characters
      // to the state. This greatly simplifies lookbehinds when
      // checking for BOS characters like "!" and "." (not "./")
      if (prev.type === 'dot' && state.index === state.start + 1) {
        state.start = state.index + 1;
        state.consumed = '';
        state.output = '';
        tokens.pop();
        prev = bos; // reset "prev" to the first token
        continue;
      }

      push({ type: 'slash', value, output: SLASH_LITERAL });
      continue;
    }

    /**
     * Dots
     */

    if (value === '.') {
      if (state.braces > 0 && prev.type === 'dot') {
        if (prev.value === '.') prev.output = DOT_LITERAL;
        const brace = braces[braces.length - 1];
        prev.type = 'dots';
        prev.output += value;
        prev.value += value;
        brace.dots = true;
        continue;
      }

      if ((state.braces + state.parens) === 0 && prev.type !== 'bos' && prev.type !== 'slash') {
        push({ type: 'text', value, output: DOT_LITERAL });
        continue;
      }

      push({ type: 'dot', value, output: DOT_LITERAL });
      continue;
    }

    /**
     * Question marks
     */

    if (value === '?') {
      const isGroup = prev && prev.value === '(';
      if (!isGroup && opts.noextglob !== true && peek() === '(' && peek(2) !== '?') {
        extglobOpen('qmark', value);
        continue;
      }

      if (prev && prev.type === 'paren') {
        const next = peek();
        let output = value;

        if (next === '<' && !utils.supportsLookbehinds()) {
          throw new Error('Node.js v10 or higher is required for regex lookbehinds');
        }

        if ((prev.value === '(' && !/[!=<:]/.test(next)) || (next === '<' && !/<([!=]|\w+>)/.test(remaining()))) {
          output = `\\${value}`;
        }

        push({ type: 'text', value, output });
        continue;
      }

      if (opts.dot !== true && (prev.type === 'slash' || prev.type === 'bos')) {
        push({ type: 'qmark', value, output: QMARK_NO_DOT });
        continue;
      }

      push({ type: 'qmark', value, output: QMARK });
      continue;
    }

    /**
     * Exclamation
     */

    if (value === '!') {
      if (opts.noextglob !== true && peek() === '(') {
        if (peek(2) !== '?' || !/[!=<:]/.test(peek(3))) {
          extglobOpen('negate', value);
          continue;
        }
      }

      if (opts.nonegate !== true && state.index === 0) {
        negate();
        continue;
      }
    }

    /**
     * Plus
     */

    if (value === '+') {
      if (opts.noextglob !== true && peek() === '(' && peek(2) !== '?') {
        extglobOpen('plus', value);
        continue;
      }

      if ((prev && prev.value === '(') || opts.regex === false) {
        push({ type: 'plus', value, output: PLUS_LITERAL });
        continue;
      }

      if ((prev && (prev.type === 'bracket' || prev.type === 'paren' || prev.type === 'brace')) || state.parens > 0) {
        push({ type: 'plus', value });
        continue;
      }

      push({ type: 'plus', value: PLUS_LITERAL });
      continue;
    }

    /**
     * Plain text
     */

    if (value === '@') {
      if (opts.noextglob !== true && peek() === '(' && peek(2) !== '?') {
        push({ type: 'at', extglob: true, value, output: '' });
        continue;
      }

      push({ type: 'text', value });
      continue;
    }

    /**
     * Plain text
     */

    if (value !== '*') {
      if (value === '$' || value === '^') {
        value = `\\${value}`;
      }

      const match = REGEX_NON_SPECIAL_CHARS.exec(remaining());
      if (match) {
        value += match[0];
        state.index += match[0].length;
      }

      push({ type: 'text', value });
      continue;
    }

    /**
     * Stars
     */

    if (prev && (prev.type === 'globstar' || prev.star === true)) {
      prev.type = 'star';
      prev.star = true;
      prev.value += value;
      prev.output = star;
      state.backtrack = true;
      state.globstar = true;
      consume(value);
      continue;
    }

    let rest = remaining();
    if (opts.noextglob !== true && /^\([^?]/.test(rest)) {
      extglobOpen('star', value);
      continue;
    }

    if (prev.type === 'star') {
      if (opts.noglobstar === true) {
        consume(value);
        continue;
      }

      const prior = prev.prev;
      const before = prior.prev;
      const isStart = prior.type === 'slash' || prior.type === 'bos';
      const afterStar = before && (before.type === 'star' || before.type === 'globstar');

      if (opts.bash === true && (!isStart || (rest[0] && rest[0] !== '/'))) {
        push({ type: 'star', value, output: '' });
        continue;
      }

      const isBrace = state.braces > 0 && (prior.type === 'comma' || prior.type === 'brace');
      const isExtglob = extglobs.length && (prior.type === 'pipe' || prior.type === 'paren');
      if (!isStart && prior.type !== 'paren' && !isBrace && !isExtglob) {
        push({ type: 'star', value, output: '' });
        continue;
      }

      // strip consecutive `/**/`
      while (rest.slice(0, 3) === '/**') {
        const after = input[state.index + 4];
        if (after && after !== '/') {
          break;
        }
        rest = rest.slice(3);
        consume('/**', 3);
      }

      if (prior.type === 'bos' && eos()) {
        prev.type = 'globstar';
        prev.value += value;
        prev.output = globstar(opts);
        state.output = prev.output;
        state.globstar = true;
        consume(value);
        continue;
      }

      if (prior.type === 'slash' && prior.prev.type !== 'bos' && !afterStar && eos()) {
        state.output = state.output.slice(0, -(prior.output + prev.output).length);
        prior.output = `(?:${prior.output}`;

        prev.type = 'globstar';
        prev.output = globstar(opts) + (opts.strictSlashes ? ')' : '|$)');
        prev.value += value;
        state.globstar = true;
        state.output += prior.output + prev.output;
        consume(value);
        continue;
      }

      if (prior.type === 'slash' && prior.prev.type !== 'bos' && rest[0] === '/') {
        const end = rest[1] !== void 0 ? '|$' : '';

        state.output = state.output.slice(0, -(prior.output + prev.output).length);
        prior.output = `(?:${prior.output}`;

        prev.type = 'globstar';
        prev.output = `${globstar(opts)}${SLASH_LITERAL}|${SLASH_LITERAL}${end})`;
        prev.value += value;

        state.output += prior.output + prev.output;
        state.globstar = true;

        consume(value + advance());

        push({ type: 'slash', value: '/', output: '' });
        continue;
      }

      if (prior.type === 'bos' && rest[0] === '/') {
        prev.type = 'globstar';
        prev.value += value;
        prev.output = `(?:^|${SLASH_LITERAL}|${globstar(opts)}${SLASH_LITERAL})`;
        state.output = prev.output;
        state.globstar = true;
        consume(value + advance());
        push({ type: 'slash', value: '/', output: '' });
        continue;
      }

      // remove single star from output
      state.output = state.output.slice(0, -prev.output.length);

      // reset previous token to globstar
      prev.type = 'globstar';
      prev.output = globstar(opts);
      prev.value += value;

      // reset output with globstar
      state.output += prev.output;
      state.globstar = true;
      consume(value);
      continue;
    }

    const token = { type: 'star', value, output: star };

    if (opts.bash === true) {
      token.output = '.*?';
      if (prev.type === 'bos' || prev.type === 'slash') {
        token.output = nodot + token.output;
      }
      push(token);
      continue;
    }

    if (prev && (prev.type === 'bracket' || prev.type === 'paren') && opts.regex === true) {
      token.output = value;
      push(token);
      continue;
    }

    if (state.index === state.start || prev.type === 'slash' || prev.type === 'dot') {
      if (prev.type === 'dot') {
        state.output += NO_DOT_SLASH;
        prev.output += NO_DOT_SLASH;

      } else if (opts.dot === true) {
        state.output += NO_DOTS_SLASH;
        prev.output += NO_DOTS_SLASH;

      } else {
        state.output += nodot;
        prev.output += nodot;
      }

      if (peek() !== '*') {
        state.output += ONE_CHAR;
        prev.output += ONE_CHAR;
      }
    }

    push(token);
  }

  while (state.brackets > 0) {
    if (opts.strictBrackets === true) throw new SyntaxError(syntaxError('closing', ']'));
    state.output = utils.escapeLast(state.output, '[');
    decrement('brackets');
  }

  while (state.parens > 0) {
    if (opts.strictBrackets === true) throw new SyntaxError(syntaxError('closing', ')'));
    state.output = utils.escapeLast(state.output, '(');
    decrement('parens');
  }

  while (state.braces > 0) {
    if (opts.strictBrackets === true) throw new SyntaxError(syntaxError('closing', '}'));
    state.output = utils.escapeLast(state.output, '{');
    decrement('braces');
  }

  if (opts.strictSlashes !== true && (prev.type === 'star' || prev.type === 'bracket')) {
    push({ type: 'maybe_slash', value: '', output: `${SLASH_LITERAL}?` });
  }

  // rebuild the output if we had to backtrack at any point
  if (state.backtrack === true) {
    state.output = '';

    for (const token of state.tokens) {
      state.output += token.output != null ? token.output : token.value;

      if (token.suffix) {
        state.output += token.suffix;
      }
    }
  }

  return state;
};

/**
 * Fast paths for creating regular expressions for common glob patterns.
 * This can significantly speed up processing and has very little downside
 * impact when none of the fast paths match.
 */

parse.fastpaths = (input, options) => {
  const opts = { ...options };
  const max = typeof opts.maxLength === 'number' ? Math.min(MAX_LENGTH, opts.maxLength) : MAX_LENGTH;
  const len = input.length;
  if (len > max) {
    throw new SyntaxError(`Input length: ${len}, exceeds maximum allowed length: ${max}`);
  }

  input = REPLACEMENTS[input] || input;
  const win32 = utils.isWindows(options);

  // create constants based on platform, for windows or posix
  const {
    DOT_LITERAL,
    SLASH_LITERAL,
    ONE_CHAR,
    DOTS_SLASH,
    NO_DOT,
    NO_DOTS,
    NO_DOTS_SLASH,
    STAR,
    START_ANCHOR
  } = constants.globChars(win32);

  const nodot = opts.dot ? NO_DOTS : NO_DOT;
  const slashDot = opts.dot ? NO_DOTS_SLASH : NO_DOT;
  const capture = opts.capture ? '' : '?:';
  const state = { negated: false, prefix: '' };
  let star = opts.bash === true ? '.*?' : STAR;

  if (opts.capture) {
    star = `(${star})`;
  }

  const globstar = opts => {
    if (opts.noglobstar === true) return star;
    return `(${capture}(?:(?!${START_ANCHOR}${opts.dot ? DOTS_SLASH : DOT_LITERAL}).)*?)`;
  };

  const create = str => {
    switch (str) {
      case '*':
        return `${nodot}${ONE_CHAR}${star}`;

      case '.*':
        return `${DOT_LITERAL}${ONE_CHAR}${star}`;

      case '*.*':
        return `${nodot}${star}${DOT_LITERAL}${ONE_CHAR}${star}`;

      case '*/*':
        return `${nodot}${star}${SLASH_LITERAL}${ONE_CHAR}${slashDot}${star}`;

      case '**':
        return nodot + globstar(opts);

      case '**/*':
        return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${slashDot}${ONE_CHAR}${star}`;

      case '**/*.*':
        return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${slashDot}${star}${DOT_LITERAL}${ONE_CHAR}${star}`;

      case '**/.*':
        return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${DOT_LITERAL}${ONE_CHAR}${star}`;

      default: {
        const match = /^(.*?)\.(\w+)$/.exec(str);
        if (!match) return;

        const source = create(match[1]);
        if (!source) return;

        return source + DOT_LITERAL + match[2];
      }
    }
  };

  const output = utils.removePrefix(input, state);
  let source = create(output);

  if (source && opts.strictSlashes !== true) {
    source += `${SLASH_LITERAL}?`;
  }

  return source;
};

module.exports = parse;


/***/ }),

/***/ "./node_modules/picomatch/lib/picomatch.js":
/*!*************************************************!*\
  !*** ./node_modules/picomatch/lib/picomatch.js ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const path = __webpack_require__(/*! path */ "path");
const scan = __webpack_require__(/*! ./scan */ "./node_modules/picomatch/lib/scan.js");
const parse = __webpack_require__(/*! ./parse */ "./node_modules/picomatch/lib/parse.js");
const utils = __webpack_require__(/*! ./utils */ "./node_modules/picomatch/lib/utils.js");
const constants = __webpack_require__(/*! ./constants */ "./node_modules/picomatch/lib/constants.js");
const isObject = val => val && typeof val === 'object' && !Array.isArray(val);

/**
 * Creates a matcher function from one or more glob patterns. The
 * returned function takes a string to match as its first argument,
 * and returns true if the string is a match. The returned matcher
 * function also takes a boolean as the second argument that, when true,
 * returns an object with additional information.
 *
 * ```js
 * const picomatch = require('picomatch');
 * // picomatch(glob[, options]);
 *
 * const isMatch = picomatch('*.!(*a)');
 * console.log(isMatch('a.a')); //=> false
 * console.log(isMatch('a.b')); //=> true
 * ```
 * @name picomatch
 * @param {String|Array} `globs` One or more glob patterns.
 * @param {Object=} `options`
 * @return {Function=} Returns a matcher function.
 * @api public
 */

const picomatch = (glob, options, returnState = false) => {
  if (Array.isArray(glob)) {
    const fns = glob.map(input => picomatch(input, options, returnState));
    const arrayMatcher = str => {
      for (const isMatch of fns) {
        const state = isMatch(str);
        if (state) return state;
      }
      return false;
    };
    return arrayMatcher;
  }

  const isState = isObject(glob) && glob.tokens && glob.input;

  if (glob === '' || (typeof glob !== 'string' && !isState)) {
    throw new TypeError('Expected pattern to be a non-empty string');
  }

  const opts = options || {};
  const posix = utils.isWindows(options);
  const regex = isState
    ? picomatch.compileRe(glob, options)
    : picomatch.makeRe(glob, options, false, true);

  const state = regex.state;
  delete regex.state;

  let isIgnored = () => false;
  if (opts.ignore) {
    const ignoreOpts = { ...options, ignore: null, onMatch: null, onResult: null };
    isIgnored = picomatch(opts.ignore, ignoreOpts, returnState);
  }

  const matcher = (input, returnObject = false) => {
    const { isMatch, match, output } = picomatch.test(input, regex, options, { glob, posix });
    const result = { glob, state, regex, posix, input, output, match, isMatch };

    if (typeof opts.onResult === 'function') {
      opts.onResult(result);
    }

    if (isMatch === false) {
      result.isMatch = false;
      return returnObject ? result : false;
    }

    if (isIgnored(input)) {
      if (typeof opts.onIgnore === 'function') {
        opts.onIgnore(result);
      }
      result.isMatch = false;
      return returnObject ? result : false;
    }

    if (typeof opts.onMatch === 'function') {
      opts.onMatch(result);
    }
    return returnObject ? result : true;
  };

  if (returnState) {
    matcher.state = state;
  }

  return matcher;
};

/**
 * Test `input` with the given `regex`. This is used by the main
 * `picomatch()` function to test the input string.
 *
 * ```js
 * const picomatch = require('picomatch');
 * // picomatch.test(input, regex[, options]);
 *
 * console.log(picomatch.test('foo/bar', /^(?:([^/]*?)\/([^/]*?))$/));
 * // { isMatch: true, match: [ 'foo/', 'foo', 'bar' ], output: 'foo/bar' }
 * ```
 * @param {String} `input` String to test.
 * @param {RegExp} `regex`
 * @return {Object} Returns an object with matching info.
 * @api public
 */

picomatch.test = (input, regex, options, { glob, posix } = {}) => {
  if (typeof input !== 'string') {
    throw new TypeError('Expected input to be a string');
  }

  if (input === '') {
    return { isMatch: false, output: '' };
  }

  const opts = options || {};
  const format = opts.format || (posix ? utils.toPosixSlashes : null);
  let match = input === glob;
  let output = (match && format) ? format(input) : input;

  if (match === false) {
    output = format ? format(input) : input;
    match = output === glob;
  }

  if (match === false || opts.capture === true) {
    if (opts.matchBase === true || opts.basename === true) {
      match = picomatch.matchBase(input, regex, options, posix);
    } else {
      match = regex.exec(output);
    }
  }

  return { isMatch: Boolean(match), match, output };
};

/**
 * Match the basename of a filepath.
 *
 * ```js
 * const picomatch = require('picomatch');
 * // picomatch.matchBase(input, glob[, options]);
 * console.log(picomatch.matchBase('foo/bar.js', '*.js'); // true
 * ```
 * @param {String} `input` String to test.
 * @param {RegExp|String} `glob` Glob pattern or regex created by [.makeRe](#makeRe).
 * @return {Boolean}
 * @api public
 */

picomatch.matchBase = (input, glob, options, posix = utils.isWindows(options)) => {
  const regex = glob instanceof RegExp ? glob : picomatch.makeRe(glob, options);
  return regex.test(path.basename(input));
};

/**
 * Returns true if **any** of the given glob `patterns` match the specified `string`.
 *
 * ```js
 * const picomatch = require('picomatch');
 * // picomatch.isMatch(string, patterns[, options]);
 *
 * console.log(picomatch.isMatch('a.a', ['b.*', '*.a'])); //=> true
 * console.log(picomatch.isMatch('a.a', 'b.*')); //=> false
 * ```
 * @param {String|Array} str The string to test.
 * @param {String|Array} patterns One or more glob patterns to use for matching.
 * @param {Object} [options] See available [options](#options).
 * @return {Boolean} Returns true if any patterns match `str`
 * @api public
 */

picomatch.isMatch = (str, patterns, options) => picomatch(patterns, options)(str);

/**
 * Parse a glob pattern to create the source string for a regular
 * expression.
 *
 * ```js
 * const picomatch = require('picomatch');
 * const result = picomatch.parse(pattern[, options]);
 * ```
 * @param {String} `pattern`
 * @param {Object} `options`
 * @return {Object} Returns an object with useful properties and output to be used as a regex source string.
 * @api public
 */

picomatch.parse = (pattern, options) => {
  if (Array.isArray(pattern)) return pattern.map(p => picomatch.parse(p, options));
  return parse(pattern, { ...options, fastpaths: false });
};

/**
 * Scan a glob pattern to separate the pattern into segments.
 *
 * ```js
 * const picomatch = require('picomatch');
 * // picomatch.scan(input[, options]);
 *
 * const result = picomatch.scan('!./foo/*.js');
 * console.log(result);
 * { prefix: '!./',
 *   input: '!./foo/*.js',
 *   start: 3,
 *   base: 'foo',
 *   glob: '*.js',
 *   isBrace: false,
 *   isBracket: false,
 *   isGlob: true,
 *   isExtglob: false,
 *   isGlobstar: false,
 *   negated: true }
 * ```
 * @param {String} `input` Glob pattern to scan.
 * @param {Object} `options`
 * @return {Object} Returns an object with
 * @api public
 */

picomatch.scan = (input, options) => scan(input, options);

/**
 * Compile a regular expression from the `state` object returned by the
 * [parse()](#parse) method.
 *
 * @param {Object} `state`
 * @param {Object} `options`
 * @param {Boolean} `returnOutput` Intended for implementors, this argument allows you to return the raw output from the parser.
 * @param {Boolean} `returnState` Adds the state to a `state` property on the returned regex. Useful for implementors and debugging.
 * @return {RegExp}
 * @api public
 */

picomatch.compileRe = (state, options, returnOutput = false, returnState = false) => {
  if (returnOutput === true) {
    return state.output;
  }

  const opts = options || {};
  const prepend = opts.contains ? '' : '^';
  const append = opts.contains ? '' : '$';

  let source = `${prepend}(?:${state.output})${append}`;
  if (state && state.negated === true) {
    source = `^(?!${source}).*$`;
  }

  const regex = picomatch.toRegex(source, options);
  if (returnState === true) {
    regex.state = state;
  }

  return regex;
};

/**
 * Create a regular expression from a parsed glob pattern.
 *
 * ```js
 * const picomatch = require('picomatch');
 * const state = picomatch.parse('*.js');
 * // picomatch.compileRe(state[, options]);
 *
 * console.log(picomatch.compileRe(state));
 * //=> /^(?:(?!\.)(?=.)[^/]*?\.js)$/
 * ```
 * @param {String} `state` The object returned from the `.parse` method.
 * @param {Object} `options`
 * @param {Boolean} `returnOutput` Implementors may use this argument to return the compiled output, instead of a regular expression. This is not exposed on the options to prevent end-users from mutating the result.
 * @param {Boolean} `returnState` Implementors may use this argument to return the state from the parsed glob with the returned regular expression.
 * @return {RegExp} Returns a regex created from the given pattern.
 * @api public
 */

picomatch.makeRe = (input, options = {}, returnOutput = false, returnState = false) => {
  if (!input || typeof input !== 'string') {
    throw new TypeError('Expected a non-empty string');
  }

  let parsed = { negated: false, fastpaths: true };

  if (options.fastpaths !== false && (input[0] === '.' || input[0] === '*')) {
    parsed.output = parse.fastpaths(input, options);
  }

  if (!parsed.output) {
    parsed = parse(input, options);
  }

  return picomatch.compileRe(parsed, options, returnOutput, returnState);
};

/**
 * Create a regular expression from the given regex source string.
 *
 * ```js
 * const picomatch = require('picomatch');
 * // picomatch.toRegex(source[, options]);
 *
 * const { output } = picomatch.parse('*.js');
 * console.log(picomatch.toRegex(output));
 * //=> /^(?:(?!\.)(?=.)[^/]*?\.js)$/
 * ```
 * @param {String} `source` Regular expression source string.
 * @param {Object} `options`
 * @return {RegExp}
 * @api public
 */

picomatch.toRegex = (source, options) => {
  try {
    const opts = options || {};
    return new RegExp(source, opts.flags || (opts.nocase ? 'i' : ''));
  } catch (err) {
    if (options && options.debug === true) throw err;
    return /$^/;
  }
};

/**
 * Picomatch constants.
 * @return {Object}
 */

picomatch.constants = constants;

/**
 * Expose "picomatch"
 */

module.exports = picomatch;


/***/ }),

/***/ "./node_modules/picomatch/lib/scan.js":
/*!********************************************!*\
  !*** ./node_modules/picomatch/lib/scan.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const utils = __webpack_require__(/*! ./utils */ "./node_modules/picomatch/lib/utils.js");
const {
  CHAR_ASTERISK,             /* * */
  CHAR_AT,                   /* @ */
  CHAR_BACKWARD_SLASH,       /* \ */
  CHAR_COMMA,                /* , */
  CHAR_DOT,                  /* . */
  CHAR_EXCLAMATION_MARK,     /* ! */
  CHAR_FORWARD_SLASH,        /* / */
  CHAR_LEFT_CURLY_BRACE,     /* { */
  CHAR_LEFT_PARENTHESES,     /* ( */
  CHAR_LEFT_SQUARE_BRACKET,  /* [ */
  CHAR_PLUS,                 /* + */
  CHAR_QUESTION_MARK,        /* ? */
  CHAR_RIGHT_CURLY_BRACE,    /* } */
  CHAR_RIGHT_PARENTHESES,    /* ) */
  CHAR_RIGHT_SQUARE_BRACKET  /* ] */
} = __webpack_require__(/*! ./constants */ "./node_modules/picomatch/lib/constants.js");

const isPathSeparator = code => {
  return code === CHAR_FORWARD_SLASH || code === CHAR_BACKWARD_SLASH;
};

const depth = token => {
  if (token.isPrefix !== true) {
    token.depth = token.isGlobstar ? Infinity : 1;
  }
};

/**
 * Quickly scans a glob pattern and returns an object with a handful of
 * useful properties, like `isGlob`, `path` (the leading non-glob, if it exists),
 * `glob` (the actual pattern), `negated` (true if the path starts with `!` but not
 * with `!(`) and `negatedExtglob` (true if the path starts with `!(`).
 *
 * ```js
 * const pm = require('picomatch');
 * console.log(pm.scan('foo/bar/*.js'));
 * { isGlob: true, input: 'foo/bar/*.js', base: 'foo/bar', glob: '*.js' }
 * ```
 * @param {String} `str`
 * @param {Object} `options`
 * @return {Object} Returns an object with tokens and regex source string.
 * @api public
 */

const scan = (input, options) => {
  const opts = options || {};

  const length = input.length - 1;
  const scanToEnd = opts.parts === true || opts.scanToEnd === true;
  const slashes = [];
  const tokens = [];
  const parts = [];

  let str = input;
  let index = -1;
  let start = 0;
  let lastIndex = 0;
  let isBrace = false;
  let isBracket = false;
  let isGlob = false;
  let isExtglob = false;
  let isGlobstar = false;
  let braceEscaped = false;
  let backslashes = false;
  let negated = false;
  let negatedExtglob = false;
  let finished = false;
  let braces = 0;
  let prev;
  let code;
  let token = { value: '', depth: 0, isGlob: false };

  const eos = () => index >= length;
  const peek = () => str.charCodeAt(index + 1);
  const advance = () => {
    prev = code;
    return str.charCodeAt(++index);
  };

  while (index < length) {
    code = advance();
    let next;

    if (code === CHAR_BACKWARD_SLASH) {
      backslashes = token.backslashes = true;
      code = advance();

      if (code === CHAR_LEFT_CURLY_BRACE) {
        braceEscaped = true;
      }
      continue;
    }

    if (braceEscaped === true || code === CHAR_LEFT_CURLY_BRACE) {
      braces++;

      while (eos() !== true && (code = advance())) {
        if (code === CHAR_BACKWARD_SLASH) {
          backslashes = token.backslashes = true;
          advance();
          continue;
        }

        if (code === CHAR_LEFT_CURLY_BRACE) {
          braces++;
          continue;
        }

        if (braceEscaped !== true && code === CHAR_DOT && (code = advance()) === CHAR_DOT) {
          isBrace = token.isBrace = true;
          isGlob = token.isGlob = true;
          finished = true;

          if (scanToEnd === true) {
            continue;
          }

          break;
        }

        if (braceEscaped !== true && code === CHAR_COMMA) {
          isBrace = token.isBrace = true;
          isGlob = token.isGlob = true;
          finished = true;

          if (scanToEnd === true) {
            continue;
          }

          break;
        }

        if (code === CHAR_RIGHT_CURLY_BRACE) {
          braces--;

          if (braces === 0) {
            braceEscaped = false;
            isBrace = token.isBrace = true;
            finished = true;
            break;
          }
        }
      }

      if (scanToEnd === true) {
        continue;
      }

      break;
    }

    if (code === CHAR_FORWARD_SLASH) {
      slashes.push(index);
      tokens.push(token);
      token = { value: '', depth: 0, isGlob: false };

      if (finished === true) continue;
      if (prev === CHAR_DOT && index === (start + 1)) {
        start += 2;
        continue;
      }

      lastIndex = index + 1;
      continue;
    }

    if (opts.noext !== true) {
      const isExtglobChar = code === CHAR_PLUS
        || code === CHAR_AT
        || code === CHAR_ASTERISK
        || code === CHAR_QUESTION_MARK
        || code === CHAR_EXCLAMATION_MARK;

      if (isExtglobChar === true && peek() === CHAR_LEFT_PARENTHESES) {
        isGlob = token.isGlob = true;
        isExtglob = token.isExtglob = true;
        finished = true;
        if (code === CHAR_EXCLAMATION_MARK && index === start) {
          negatedExtglob = true;
        }

        if (scanToEnd === true) {
          while (eos() !== true && (code = advance())) {
            if (code === CHAR_BACKWARD_SLASH) {
              backslashes = token.backslashes = true;
              code = advance();
              continue;
            }

            if (code === CHAR_RIGHT_PARENTHESES) {
              isGlob = token.isGlob = true;
              finished = true;
              break;
            }
          }
          continue;
        }
        break;
      }
    }

    if (code === CHAR_ASTERISK) {
      if (prev === CHAR_ASTERISK) isGlobstar = token.isGlobstar = true;
      isGlob = token.isGlob = true;
      finished = true;

      if (scanToEnd === true) {
        continue;
      }
      break;
    }

    if (code === CHAR_QUESTION_MARK) {
      isGlob = token.isGlob = true;
      finished = true;

      if (scanToEnd === true) {
        continue;
      }
      break;
    }

    if (code === CHAR_LEFT_SQUARE_BRACKET) {
      while (eos() !== true && (next = advance())) {
        if (next === CHAR_BACKWARD_SLASH) {
          backslashes = token.backslashes = true;
          advance();
          continue;
        }

        if (next === CHAR_RIGHT_SQUARE_BRACKET) {
          isBracket = token.isBracket = true;
          isGlob = token.isGlob = true;
          finished = true;
          break;
        }
      }

      if (scanToEnd === true) {
        continue;
      }

      break;
    }

    if (opts.nonegate !== true && code === CHAR_EXCLAMATION_MARK && index === start) {
      negated = token.negated = true;
      start++;
      continue;
    }

    if (opts.noparen !== true && code === CHAR_LEFT_PARENTHESES) {
      isGlob = token.isGlob = true;

      if (scanToEnd === true) {
        while (eos() !== true && (code = advance())) {
          if (code === CHAR_LEFT_PARENTHESES) {
            backslashes = token.backslashes = true;
            code = advance();
            continue;
          }

          if (code === CHAR_RIGHT_PARENTHESES) {
            finished = true;
            break;
          }
        }
        continue;
      }
      break;
    }

    if (isGlob === true) {
      finished = true;

      if (scanToEnd === true) {
        continue;
      }

      break;
    }
  }

  if (opts.noext === true) {
    isExtglob = false;
    isGlob = false;
  }

  let base = str;
  let prefix = '';
  let glob = '';

  if (start > 0) {
    prefix = str.slice(0, start);
    str = str.slice(start);
    lastIndex -= start;
  }

  if (base && isGlob === true && lastIndex > 0) {
    base = str.slice(0, lastIndex);
    glob = str.slice(lastIndex);
  } else if (isGlob === true) {
    base = '';
    glob = str;
  } else {
    base = str;
  }

  if (base && base !== '' && base !== '/' && base !== str) {
    if (isPathSeparator(base.charCodeAt(base.length - 1))) {
      base = base.slice(0, -1);
    }
  }

  if (opts.unescape === true) {
    if (glob) glob = utils.removeBackslashes(glob);

    if (base && backslashes === true) {
      base = utils.removeBackslashes(base);
    }
  }

  const state = {
    prefix,
    input,
    start,
    base,
    glob,
    isBrace,
    isBracket,
    isGlob,
    isExtglob,
    isGlobstar,
    negated,
    negatedExtglob
  };

  if (opts.tokens === true) {
    state.maxDepth = 0;
    if (!isPathSeparator(code)) {
      tokens.push(token);
    }
    state.tokens = tokens;
  }

  if (opts.parts === true || opts.tokens === true) {
    let prevIndex;

    for (let idx = 0; idx < slashes.length; idx++) {
      const n = prevIndex ? prevIndex + 1 : start;
      const i = slashes[idx];
      const value = input.slice(n, i);
      if (opts.tokens) {
        if (idx === 0 && start !== 0) {
          tokens[idx].isPrefix = true;
          tokens[idx].value = prefix;
        } else {
          tokens[idx].value = value;
        }
        depth(tokens[idx]);
        state.maxDepth += tokens[idx].depth;
      }
      if (idx !== 0 || value !== '') {
        parts.push(value);
      }
      prevIndex = i;
    }

    if (prevIndex && prevIndex + 1 < input.length) {
      const value = input.slice(prevIndex + 1);
      parts.push(value);

      if (opts.tokens) {
        tokens[tokens.length - 1].value = value;
        depth(tokens[tokens.length - 1]);
        state.maxDepth += tokens[tokens.length - 1].depth;
      }
    }

    state.slashes = slashes;
    state.parts = parts;
  }

  return state;
};

module.exports = scan;


/***/ }),

/***/ "./node_modules/picomatch/lib/utils.js":
/*!*********************************************!*\
  !*** ./node_modules/picomatch/lib/utils.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


const path = __webpack_require__(/*! path */ "path");
const win32 = process.platform === 'win32';
const {
  REGEX_BACKSLASH,
  REGEX_REMOVE_BACKSLASH,
  REGEX_SPECIAL_CHARS,
  REGEX_SPECIAL_CHARS_GLOBAL
} = __webpack_require__(/*! ./constants */ "./node_modules/picomatch/lib/constants.js");

exports.isObject = val => val !== null && typeof val === 'object' && !Array.isArray(val);
exports.hasRegexChars = str => REGEX_SPECIAL_CHARS.test(str);
exports.isRegexChar = str => str.length === 1 && exports.hasRegexChars(str);
exports.escapeRegex = str => str.replace(REGEX_SPECIAL_CHARS_GLOBAL, '\\$1');
exports.toPosixSlashes = str => str.replace(REGEX_BACKSLASH, '/');

exports.removeBackslashes = str => {
  return str.replace(REGEX_REMOVE_BACKSLASH, match => {
    return match === '\\' ? '' : match;
  });
};

exports.supportsLookbehinds = () => {
  const segs = process.version.slice(1).split('.').map(Number);
  if (segs.length === 3 && segs[0] >= 9 || (segs[0] === 8 && segs[1] >= 10)) {
    return true;
  }
  return false;
};

exports.isWindows = options => {
  if (options && typeof options.windows === 'boolean') {
    return options.windows;
  }
  return win32 === true || path.sep === '\\';
};

exports.escapeLast = (input, char, lastIdx) => {
  const idx = input.lastIndexOf(char, lastIdx);
  if (idx === -1) return input;
  if (input[idx - 1] === '\\') return exports.escapeLast(input, char, idx - 1);
  return `${input.slice(0, idx)}\\${input.slice(idx)}`;
};

exports.removePrefix = (input, state = {}) => {
  let output = input;
  if (output.startsWith('./')) {
    output = output.slice(2);
    state.prefix = './';
  }
  return output;
};

exports.wrapOutput = (input, state = {}, options = {}) => {
  const prepend = options.contains ? '' : '^';
  const append = options.contains ? '' : '$';

  let output = `${prepend}(?:${input})${append}`;
  if (state.negated === true) {
    output = `(?:^(?!${output}).*$)`;
  }
  return output;
};


/***/ }),

/***/ "./node_modules/readdirp/index.js":
/*!****************************************!*\
  !*** ./node_modules/readdirp/index.js ***!
  \****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const fs = __webpack_require__(/*! fs */ "fs");
const { Readable } = __webpack_require__(/*! stream */ "stream");
const sysPath = __webpack_require__(/*! path */ "path");
const { promisify } = __webpack_require__(/*! util */ "util");
const picomatch = __webpack_require__(/*! picomatch */ "./node_modules/picomatch/index.js");

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const lstat = promisify(fs.lstat);
const realpath = promisify(fs.realpath);

/**
 * @typedef {Object} EntryInfo
 * @property {String} path
 * @property {String} fullPath
 * @property {fs.Stats=} stats
 * @property {fs.Dirent=} dirent
 * @property {String} basename
 */

const BANG = '!';
const RECURSIVE_ERROR_CODE = 'READDIRP_RECURSIVE_ERROR';
const NORMAL_FLOW_ERRORS = new Set(['ENOENT', 'EPERM', 'EACCES', 'ELOOP', RECURSIVE_ERROR_CODE]);
const FILE_TYPE = 'files';
const DIR_TYPE = 'directories';
const FILE_DIR_TYPE = 'files_directories';
const EVERYTHING_TYPE = 'all';
const ALL_TYPES = [FILE_TYPE, DIR_TYPE, FILE_DIR_TYPE, EVERYTHING_TYPE];

const isNormalFlowError = error => NORMAL_FLOW_ERRORS.has(error.code);
const [maj, min] = process.versions.node.split('.').slice(0, 2).map(n => Number.parseInt(n, 10));
const wantBigintFsStats = process.platform === 'win32' && (maj > 10 || (maj === 10 && min >= 5));

const normalizeFilter = filter => {
  if (filter === undefined) return;
  if (typeof filter === 'function') return filter;

  if (typeof filter === 'string') {
    const glob = picomatch(filter.trim());
    return entry => glob(entry.basename);
  }

  if (Array.isArray(filter)) {
    const positive = [];
    const negative = [];
    for (const item of filter) {
      const trimmed = item.trim();
      if (trimmed.charAt(0) === BANG) {
        negative.push(picomatch(trimmed.slice(1)));
      } else {
        positive.push(picomatch(trimmed));
      }
    }

    if (negative.length > 0) {
      if (positive.length > 0) {
        return entry =>
          positive.some(f => f(entry.basename)) && !negative.some(f => f(entry.basename));
      }
      return entry => !negative.some(f => f(entry.basename));
    }
    return entry => positive.some(f => f(entry.basename));
  }
};

class ReaddirpStream extends Readable {
  static get defaultOptions() {
    return {
      root: '.',
      /* eslint-disable no-unused-vars */
      fileFilter: (path) => true,
      directoryFilter: (path) => true,
      /* eslint-enable no-unused-vars */
      type: FILE_TYPE,
      lstat: false,
      depth: 2147483648,
      alwaysStat: false
    };
  }

  constructor(options = {}) {
    super({
      objectMode: true,
      autoDestroy: true,
      highWaterMark: options.highWaterMark || 4096
    });
    const opts = { ...ReaddirpStream.defaultOptions, ...options };
    const { root, type } = opts;

    this._fileFilter = normalizeFilter(opts.fileFilter);
    this._directoryFilter = normalizeFilter(opts.directoryFilter);

    const statMethod = opts.lstat ? lstat : stat;
    // Use bigint stats if it's windows and stat() supports options (node 10+).
    if (wantBigintFsStats) {
      this._stat = path => statMethod(path, { bigint: true });
    } else {
      this._stat = statMethod;
    }

    this._maxDepth = opts.depth;
    this._wantsDir = [DIR_TYPE, FILE_DIR_TYPE, EVERYTHING_TYPE].includes(type);
    this._wantsFile = [FILE_TYPE, FILE_DIR_TYPE, EVERYTHING_TYPE].includes(type);
    this._wantsEverything = type === EVERYTHING_TYPE;
    this._root = sysPath.resolve(root);
    this._isDirent = ('Dirent' in fs) && !opts.alwaysStat;
    this._statsProp = this._isDirent ? 'dirent' : 'stats';
    this._rdOptions = { encoding: 'utf8', withFileTypes: this._isDirent };

    // Launch stream with one parent, the root dir.
    this.parents = [this._exploreDir(root, 1)];
    this.reading = false;
    this.parent = undefined;
  }

  async _read(batch) {
    if (this.reading) return;
    this.reading = true;

    try {
      while (!this.destroyed && batch > 0) {
        const { path, depth, files = [] } = this.parent || {};

        if (files.length > 0) {
          const slice = files.splice(0, batch).map(dirent => this._formatEntry(dirent, path));
          for (const entry of await Promise.all(slice)) {
            if (this.destroyed) return;

            const entryType = await this._getEntryType(entry);
            if (entryType === 'directory' && this._directoryFilter(entry)) {
              if (depth <= this._maxDepth) {
                this.parents.push(this._exploreDir(entry.fullPath, depth + 1));
              }

              if (this._wantsDir) {
                this.push(entry);
                batch--;
              }
            } else if ((entryType === 'file' || this._includeAsFile(entry)) && this._fileFilter(entry)) {
              if (this._wantsFile) {
                this.push(entry);
                batch--;
              }
            }
          }
        } else {
          const parent = this.parents.pop();
          if (!parent) {
            this.push(null);
            break;
          }
          this.parent = await parent;
          if (this.destroyed) return;
        }
      }
    } catch (error) {
      this.destroy(error);
    } finally {
      this.reading = false;
    }
  }

  async _exploreDir(path, depth) {
    let files;
    try {
      files = await readdir(path, this._rdOptions);
    } catch (error) {
      this._onError(error);
    }
    return { files, depth, path };
  }

  async _formatEntry(dirent, path) {
    let entry;
    try {
      const basename = this._isDirent ? dirent.name : dirent;
      const fullPath = sysPath.resolve(sysPath.join(path, basename));
      entry = { path: sysPath.relative(this._root, fullPath), fullPath, basename };
      entry[this._statsProp] = this._isDirent ? dirent : await this._stat(fullPath);
    } catch (err) {
      this._onError(err);
    }
    return entry;
  }

  _onError(err) {
    if (isNormalFlowError(err) && !this.destroyed) {
      this.emit('warn', err);
    } else {
      this.destroy(err);
    }
  }

  async _getEntryType(entry) {
    // entry may be undefined, because a warning or an error were emitted
    // and the statsProp is undefined
    const stats = entry && entry[this._statsProp];
    if (!stats) {
      return;
    }
    if (stats.isFile()) {
      return 'file';
    }
    if (stats.isDirectory()) {
      return 'directory';
    }
    if (stats && stats.isSymbolicLink()) {
      const full = entry.fullPath;
      try {
        const entryRealPath = await realpath(full);
        const entryRealPathStats = await lstat(entryRealPath);
        if (entryRealPathStats.isFile()) {
          return 'file';
        }
        if (entryRealPathStats.isDirectory()) {
          const len = entryRealPath.length;
          if (full.startsWith(entryRealPath) && full.substr(len, 1) === sysPath.sep) {
            const recursiveError = new Error(
              `Circular symlink detected: "${full}" points to "${entryRealPath}"`
            );
            recursiveError.code = RECURSIVE_ERROR_CODE;
            return this._onError(recursiveError);
          }
          return 'directory';
        }
      } catch (error) {
        this._onError(error);
      }
    }
  }

  _includeAsFile(entry) {
    const stats = entry && entry[this._statsProp];

    return stats && this._wantsEverything && !stats.isDirectory();
  }
}

/**
 * @typedef {Object} ReaddirpArguments
 * @property {Function=} fileFilter
 * @property {Function=} directoryFilter
 * @property {String=} type
 * @property {Number=} depth
 * @property {String=} root
 * @property {Boolean=} lstat
 * @property {Boolean=} bigint
 */

/**
 * Main function which ends up calling readdirRec and reads all files and directories in given root recursively.
 * @param {String} root Root directory
 * @param {ReaddirpArguments=} options Options to specify root (start directory), filters and recursion depth
 */
const readdirp = (root, options = {}) => {
  let type = options.entryType || options.type;
  if (type === 'both') type = FILE_DIR_TYPE; // backwards-compatibility
  if (type) options.type = type;
  if (!root) {
    throw new Error('readdirp: root argument is required. Usage: readdirp(root, options)');
  } else if (typeof root !== 'string') {
    throw new TypeError('readdirp: root argument must be a string. Usage: readdirp(root, options)');
  } else if (type && !ALL_TYPES.includes(type)) {
    throw new Error(`readdirp: Invalid type passed. Use one of ${ALL_TYPES.join(', ')}`);
  }

  options.root = root;
  return new ReaddirpStream(options);
};

const readdirpPromise = (root, options = {}) => {
  return new Promise((resolve, reject) => {
    const files = [];
    readdirp(root, options)
      .on('data', entry => files.push(entry))
      .on('end', () => resolve(files))
      .on('error', error => reject(error));
  });
};

readdirp.promise = readdirpPromise;
readdirp.ReaddirpStream = ReaddirpStream;
readdirp.default = readdirp;

module.exports = readdirp;


/***/ }),

/***/ "./node_modules/to-regex-range/index.js":
/*!**********************************************!*\
  !*** ./node_modules/to-regex-range/index.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*!
 * to-regex-range <https://github.com/micromatch/to-regex-range>
 *
 * Copyright (c) 2015-present, Jon Schlinkert.
 * Released under the MIT License.
 */



const isNumber = __webpack_require__(/*! is-number */ "./node_modules/is-number/index.js");

const toRegexRange = (min, max, options) => {
  if (isNumber(min) === false) {
    throw new TypeError('toRegexRange: expected the first argument to be a number');
  }

  if (max === void 0 || min === max) {
    return String(min);
  }

  if (isNumber(max) === false) {
    throw new TypeError('toRegexRange: expected the second argument to be a number.');
  }

  let opts = { relaxZeros: true, ...options };
  if (typeof opts.strictZeros === 'boolean') {
    opts.relaxZeros = opts.strictZeros === false;
  }

  let relax = String(opts.relaxZeros);
  let shorthand = String(opts.shorthand);
  let capture = String(opts.capture);
  let wrap = String(opts.wrap);
  let cacheKey = min + ':' + max + '=' + relax + shorthand + capture + wrap;

  if (toRegexRange.cache.hasOwnProperty(cacheKey)) {
    return toRegexRange.cache[cacheKey].result;
  }

  let a = Math.min(min, max);
  let b = Math.max(min, max);

  if (Math.abs(a - b) === 1) {
    let result = min + '|' + max;
    if (opts.capture) {
      return `(${result})`;
    }
    if (opts.wrap === false) {
      return result;
    }
    return `(?:${result})`;
  }

  let isPadded = hasPadding(min) || hasPadding(max);
  let state = { min, max, a, b };
  let positives = [];
  let negatives = [];

  if (isPadded) {
    state.isPadded = isPadded;
    state.maxLen = String(state.max).length;
  }

  if (a < 0) {
    let newMin = b < 0 ? Math.abs(b) : 1;
    negatives = splitToPatterns(newMin, Math.abs(a), state, opts);
    a = state.a = 0;
  }

  if (b >= 0) {
    positives = splitToPatterns(a, b, state, opts);
  }

  state.negatives = negatives;
  state.positives = positives;
  state.result = collatePatterns(negatives, positives, opts);

  if (opts.capture === true) {
    state.result = `(${state.result})`;
  } else if (opts.wrap !== false && (positives.length + negatives.length) > 1) {
    state.result = `(?:${state.result})`;
  }

  toRegexRange.cache[cacheKey] = state;
  return state.result;
};

function collatePatterns(neg, pos, options) {
  let onlyNegative = filterPatterns(neg, pos, '-', false, options) || [];
  let onlyPositive = filterPatterns(pos, neg, '', false, options) || [];
  let intersected = filterPatterns(neg, pos, '-?', true, options) || [];
  let subpatterns = onlyNegative.concat(intersected).concat(onlyPositive);
  return subpatterns.join('|');
}

function splitToRanges(min, max) {
  let nines = 1;
  let zeros = 1;

  let stop = countNines(min, nines);
  let stops = new Set([max]);

  while (min <= stop && stop <= max) {
    stops.add(stop);
    nines += 1;
    stop = countNines(min, nines);
  }

  stop = countZeros(max + 1, zeros) - 1;

  while (min < stop && stop <= max) {
    stops.add(stop);
    zeros += 1;
    stop = countZeros(max + 1, zeros) - 1;
  }

  stops = [...stops];
  stops.sort(compare);
  return stops;
}

/**
 * Convert a range to a regex pattern
 * @param {Number} `start`
 * @param {Number} `stop`
 * @return {String}
 */

function rangeToPattern(start, stop, options) {
  if (start === stop) {
    return { pattern: start, count: [], digits: 0 };
  }

  let zipped = zip(start, stop);
  let digits = zipped.length;
  let pattern = '';
  let count = 0;

  for (let i = 0; i < digits; i++) {
    let [startDigit, stopDigit] = zipped[i];

    if (startDigit === stopDigit) {
      pattern += startDigit;

    } else if (startDigit !== '0' || stopDigit !== '9') {
      pattern += toCharacterClass(startDigit, stopDigit, options);

    } else {
      count++;
    }
  }

  if (count) {
    pattern += options.shorthand === true ? '\\d' : '[0-9]';
  }

  return { pattern, count: [count], digits };
}

function splitToPatterns(min, max, tok, options) {
  let ranges = splitToRanges(min, max);
  let tokens = [];
  let start = min;
  let prev;

  for (let i = 0; i < ranges.length; i++) {
    let max = ranges[i];
    let obj = rangeToPattern(String(start), String(max), options);
    let zeros = '';

    if (!tok.isPadded && prev && prev.pattern === obj.pattern) {
      if (prev.count.length > 1) {
        prev.count.pop();
      }

      prev.count.push(obj.count[0]);
      prev.string = prev.pattern + toQuantifier(prev.count);
      start = max + 1;
      continue;
    }

    if (tok.isPadded) {
      zeros = padZeros(max, tok, options);
    }

    obj.string = zeros + obj.pattern + toQuantifier(obj.count);
    tokens.push(obj);
    start = max + 1;
    prev = obj;
  }

  return tokens;
}

function filterPatterns(arr, comparison, prefix, intersection, options) {
  let result = [];

  for (let ele of arr) {
    let { string } = ele;

    // only push if _both_ are negative...
    if (!intersection && !contains(comparison, 'string', string)) {
      result.push(prefix + string);
    }

    // or _both_ are positive
    if (intersection && contains(comparison, 'string', string)) {
      result.push(prefix + string);
    }
  }
  return result;
}

/**
 * Zip strings
 */

function zip(a, b) {
  let arr = [];
  for (let i = 0; i < a.length; i++) arr.push([a[i], b[i]]);
  return arr;
}

function compare(a, b) {
  return a > b ? 1 : b > a ? -1 : 0;
}

function contains(arr, key, val) {
  return arr.some(ele => ele[key] === val);
}

function countNines(min, len) {
  return Number(String(min).slice(0, -len) + '9'.repeat(len));
}

function countZeros(integer, zeros) {
  return integer - (integer % Math.pow(10, zeros));
}

function toQuantifier(digits) {
  let [start = 0, stop = ''] = digits;
  if (stop || start > 1) {
    return `{${start + (stop ? ',' + stop : '')}}`;
  }
  return '';
}

function toCharacterClass(a, b, options) {
  return `[${a}${(b - a === 1) ? '' : '-'}${b}]`;
}

function hasPadding(str) {
  return /^-?(0+)\d/.test(str);
}

function padZeros(value, tok, options) {
  if (!tok.isPadded) {
    return value;
  }

  let diff = Math.abs(tok.maxLen - String(value).length);
  let relax = options.relaxZeros !== false;

  switch (diff) {
    case 0:
      return '';
    case 1:
      return relax ? '0?' : '0';
    case 2:
      return relax ? '0{0,2}' : '00';
    default: {
      return relax ? `0{0,${diff}}` : `0{${diff}}`;
    }
  }
}

/**
 * Cache
 */

toRegexRange.cache = {};
toRegexRange.clearCache = () => (toRegexRange.cache = {});

/**
 * Expose `toRegexRange`
 */

module.exports = toRegexRange;


/***/ }),

/***/ "./src/main/SettingsManager.ts":
/*!*************************************!*\
  !*** ./src/main/SettingsManager.ts ***!
  \*************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

/**
 * Settings Manager
 * Handles persistence of user preferences and settings
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SettingsManager = void 0;
const electron_1 = __webpack_require__(/*! electron */ "electron");
const path = __importStar(__webpack_require__(/*! path */ "path"));
const fs = __importStar(__webpack_require__(/*! fs */ "fs"));
const SleepPreventionManager_1 = __webpack_require__(/*! ./activity/SleepPreventionManager */ "./src/main/activity/SleepPreventionManager.ts");
class SettingsManager {
    constructor() {
        this.settingsPath = path.join(electron_1.app.getPath('userData'), 'settings.json');
        this.settings = this.getDefaultSettings();
        this.loadSettings();
    }
    /**
     * Get default settings
     */
    getDefaultSettings() {
        return {
            sleepPreventionMode: SleepPreventionManager_1.SleepPreventionMode.FULL,
            activitySimulation: {
                interval: 30000, // 30 seconds
                activityType: 'both'
            },
            ui: {
                minimizeToTray: true,
                showNotifications: true,
                theme: 'light'
            },
            version: '1.0.0'
        };
    }
    /**
     * Load settings from disk
     */
    loadSettings() {
        try {
            if (fs.existsSync(this.settingsPath)) {
                console.log(`SettingsManager: Loading settings from ${this.settingsPath}`);
                const data = fs.readFileSync(this.settingsPath, 'utf8');
                const loadedSettings = JSON.parse(data);
                console.log('SettingsManager: Loaded settings:', JSON.stringify(loadedSettings, null, 2));
                // Get default settings
                const defaultSettings = this.getDefaultSettings();
                console.log('SettingsManager: Default settings:', JSON.stringify(defaultSettings, null, 2));
                // Deep merge settings recursively to preserve all nested properties
                const deepMerge = (target, source) => {
                    for (const key in source) {
                        if (source.hasOwnProperty(key)) {
                            if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
                                // If property is an object, recursively merge
                                target[key] = target[key] || {};
                                target[key] = deepMerge(target[key], source[key]);
                            }
                            else {
                                // Otherwise, overwrite with source value
                                target[key] = source[key];
                            }
                        }
                    }
                    return target;
                };
                // Apply deep merge with defaults and loaded settings
                this.settings = deepMerge(JSON.parse(JSON.stringify(defaultSettings)), loadedSettings);
                console.log('SettingsManager: Merged settings:', JSON.stringify(this.settings, null, 2));
                console.log('SettingsManager: Theme after loading:', this.settings.ui?.theme);
                // Ensure theme property exists
                if (!this.settings.ui) {
                    console.log('SettingsManager: ui object missing, creating it');
                    this.settings.ui = defaultSettings.ui;
                }
                if (!this.settings.ui.theme) {
                    console.log('SettingsManager: theme property missing, using default');
                    this.settings.ui.theme = defaultSettings.ui.theme;
                }
                console.log('SettingsManager: Settings loaded successfully');
            }
            else {
                console.log('SettingsManager: No settings file found, using defaults');
                this.settings = this.getDefaultSettings();
                this.saveSettings(); // Create initial settings file
            }
        }
        catch (error) {
            console.error('SettingsManager: Error loading settings:', error);
            this.settings = this.getDefaultSettings();
        }
    }
    /**
     * Save settings to disk
     */
    saveSettings() {
        try {
            console.log(`SettingsManager: Saving settings to ${this.settingsPath}`);
            console.log('SettingsManager: Settings to save:', JSON.stringify(this.settings, null, 2));
            const settingsDir = path.dirname(this.settingsPath);
            if (!fs.existsSync(settingsDir)) {
                console.log(`SettingsManager: Creating settings directory: ${settingsDir}`);
                fs.mkdirSync(settingsDir, { recursive: true });
            }
            // Make sure the theme property exists before saving
            if (!this.settings.ui.hasOwnProperty('theme')) {
                console.log('SettingsManager: Theme property missing, adding default');
                this.settings.ui.theme = 'light';
            }
            fs.writeFileSync(this.settingsPath, JSON.stringify(this.settings, null, 2));
            console.log('SettingsManager: Settings saved successfully');
            // Verify the file was written correctly
            if (fs.existsSync(this.settingsPath)) {
                const savedData = fs.readFileSync(this.settingsPath, 'utf8');
                const savedSettings = JSON.parse(savedData);
                console.log('SettingsManager: Verified saved settings:', JSON.stringify(savedSettings, null, 2));
            }
        }
        catch (error) {
            console.error('SettingsManager: Error saving settings:', error);
        }
    }
    /**
     * Get all settings
     */
    getSettings() {
        return { ...this.settings };
    }
    /**
     * Get sleep prevention mode
     */
    getSleepPreventionMode() {
        return this.settings.sleepPreventionMode;
    }
    /**
     * Set sleep prevention mode
     */
    setSleepPreventionMode(mode) {
        this.settings.sleepPreventionMode = mode;
        this.saveSettings();
    }
    /**
     * Get activity simulation settings
     */
    getActivitySimulationSettings() {
        return { ...this.settings.activitySimulation };
    }
    /**
     * Set activity simulation settings
     */
    setActivitySimulationSettings(settings) {
        this.settings.activitySimulation = {
            ...this.settings.activitySimulation,
            ...settings
        };
        this.saveSettings();
    }
    /**
     * Get UI settings
     */
    getUISettings() {
        return { ...this.settings.ui };
    }
    /**
     * Set UI settings
     */
    setUISettings(settings) {
        this.settings.ui = {
            ...this.settings.ui,
            ...settings
        };
        this.saveSettings();
    }
    /**
     * Get window position
     */
    getWindowPosition() {
        return this.settings.ui.windowPosition;
    }
    /**
     * Set window position
     */
    setWindowPosition(position) {
        this.settings.ui.windowPosition = position;
        this.saveSettings();
    }
    /**
     * Get window size
     */
    getWindowSize() {
        return this.settings.ui.windowSize;
    }
    /**
     * Set window size
     */
    setWindowSize(size) {
        this.settings.ui.windowSize = size;
        this.saveSettings();
    }
    /**
     * Get theme preference
     */
    getTheme() {
        console.log('SettingsManager: Getting theme preference, current settings:', JSON.stringify(this.settings, null, 2));
        const theme = this.settings.ui.theme || 'light';
        console.log(`SettingsManager: Current theme is ${theme}`);
        return theme;
    }
    /**
     * Set theme preference
     */
    setTheme(theme) {
        console.log(`SettingsManager: Setting theme to ${theme}`);
        if (!this.settings.ui) {
            console.log('SettingsManager: ui object is missing, creating it');
            this.settings.ui = {
                minimizeToTray: true,
                showNotifications: true,
                theme: theme
            };
        }
        else {
            console.log('SettingsManager: Updating ui.theme property');
            this.settings.ui.theme = theme;
        }
        console.log('SettingsManager: Settings after update:', JSON.stringify(this.settings, null, 2));
        this.saveSettings();
    }
    /**
     * Reset settings to defaults
     */
    resetSettings() {
        this.settings = this.getDefaultSettings();
        this.saveSettings();
    }
    /**
     * Export settings to JSON string
     */
    exportSettings() {
        return JSON.stringify(this.settings, null, 2);
    }
    /**
     * Import settings from JSON string
     */
    importSettings(jsonString) {
        try {
            const importedSettings = JSON.parse(jsonString);
            // Validate the imported settings
            if (this.validateSettings(importedSettings)) {
                this.settings = {
                    ...this.getDefaultSettings(),
                    ...importedSettings
                };
                this.saveSettings();
                return true;
            }
            else {
                console.error('Invalid settings format');
                return false;
            }
        }
        catch (error) {
            console.error('Error importing settings:', error);
            return false;
        }
    }
    /**
     * Validate settings structure
     */
    validateSettings(settings) {
        try {
            // Check required properties exist
            const basicValidation = (typeof settings === 'object' &&
                typeof settings.sleepPreventionMode === 'string' &&
                Object.values(SleepPreventionManager_1.SleepPreventionMode).includes(settings.sleepPreventionMode) &&
                typeof settings.activitySimulation === 'object' &&
                typeof settings.activitySimulation.interval === 'number' &&
                typeof settings.activitySimulation.activityType === 'string' &&
                ['mouse', 'keyboard', 'both'].includes(settings.activitySimulation.activityType));
            // Don't strictly require the theme property, but validate it if it exists
            if (basicValidation) {
                // If ui or ui.theme doesn't exist, that's fine - we'll use defaults
                if (!settings.ui || !settings.ui.theme) {
                    console.log('SettingsManager: Theme not found in settings, will use default');
                    return true;
                }
                // If theme exists, make sure it's a valid value
                if (typeof settings.ui.theme === 'string' &&
                    ['light', 'dark'].includes(settings.ui.theme)) {
                    console.log(`SettingsManager: Valid theme found in settings: ${settings.ui.theme}`);
                    return true;
                }
                else {
                    console.log(`SettingsManager: Invalid theme value found: ${settings.ui.theme}`);
                    return false;
                }
            }
            return basicValidation;
        }
        catch (error) {
            console.error('SettingsManager: Error validating settings:', error);
            return false;
        }
    }
    /**
     * Get sleep prevention config for the manager
     */
    getSleepPreventionConfig() {
        const activitySettings = this.getActivitySimulationSettings();
        return {
            defaultMode: this.getSleepPreventionMode(),
            activityInterval: activitySettings.interval,
            activityType: activitySettings.activityType,
            debug: "development" === 'development'
        };
    }
    /**
     * Get settings file path
     */
    getSettingsPath() {
        return this.settingsPath;
    }
}
exports.SettingsManager = SettingsManager;


/***/ }),

/***/ "./src/main/activity/ActivitySimulator.ts":
/*!************************************************!*\
  !*** ./src/main/activity/ActivitySimulator.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

/**
 * Activity Simulator Interface
 * Provides user activity simulation to prevent applications from showing "Away" status
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ActivitySimulator = void 0;
class ActivitySimulator {
    constructor(options = {}) {
        this.isRunning = false;
        this.interval = 30000; // 30 seconds default
        this.activityType = 'both';
        this.debug = false;
        this.intervalId = null;
        this.interval = options.interval || 30000;
        this.activityType = options.activityType || 'both';
        this.debug = options.debug || false;
    }
    /**
     * Start activity simulation
     */
    async start() {
        if (this.isRunning) {
            return;
        }
        this.log('Starting activity simulation...');
        this.isRunning = true;
        // Perform initial activity simulation
        await this.performActivity();
        // Set up interval for continuous simulation
        this.intervalId = setInterval(async () => {
            if (this.isRunning) {
                await this.performActivity();
            }
        }, this.interval);
    }
    /**
     * Stop activity simulation
     */
    stop() {
        if (!this.isRunning) {
            return;
        }
        this.log('Stopping activity simulation...');
        this.isRunning = false;
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
    /**
     * Update simulation interval
     */
    setInterval(intervalMs) {
        this.interval = intervalMs;
        // Restart with new interval if currently running
        if (this.isRunning) {
            this.stop();
            this.start();
        }
    }
    /**
     * Update activity type
     */
    setActivityType(type) {
        this.activityType = type;
    }
    /**
     * Get current status
     */
    getStatus() {
        return {
            isRunning: this.isRunning,
            interval: this.interval,
            activityType: this.activityType
        };
    }
    /**
     * Log debug messages
     */
    log(message) {
        if (this.debug) {
            console.log(`[ActivitySimulator] ${message}`);
        }
    }
    /**
     * Handle errors gracefully
     */
    handleError(error, context) {
        console.error(`[ActivitySimulator] Error in ${context}:`, error);
        // Don't stop the simulation for individual errors
    }
}
exports.ActivitySimulator = ActivitySimulator;


/***/ }),

/***/ "./src/main/activity/ActivitySimulatorFactory.ts":
/*!*******************************************************!*\
  !*** ./src/main/activity/ActivitySimulatorFactory.ts ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

/**
 * Activity Simulator Factory
 * Creates the appropriate activity simulator based on the current platform
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ActivitySimulatorFactory = void 0;
const WindowsActivitySimulator_1 = __webpack_require__(/*! ./WindowsActivitySimulator */ "./src/main/activity/WindowsActivitySimulator.ts");
const MacOSActivitySimulator_1 = __webpack_require__(/*! ./MacOSActivitySimulator */ "./src/main/activity/MacOSActivitySimulator.ts");
const LinuxActivitySimulator_1 = __webpack_require__(/*! ./LinuxActivitySimulator */ "./src/main/activity/LinuxActivitySimulator.ts");
class ActivitySimulatorFactory {
    /**
     * Create activity simulator for current platform
     */
    static create(options = {}) {
        const platform = process.platform;
        switch (platform) {
            case 'win32':
                return new WindowsActivitySimulator_1.WindowsActivitySimulator(options);
            case 'darwin':
                return new MacOSActivitySimulator_1.MacOSActivitySimulator(options);
            case 'linux':
                return new LinuxActivitySimulator_1.LinuxActivitySimulator(options);
            default:
                throw new Error(`Unsupported platform: ${platform}`);
        }
    }
    /**
     * Get platform name
     */
    static getPlatformName() {
        const platform = process.platform;
        switch (platform) {
            case 'win32':
                return 'Windows';
            case 'darwin':
                return 'macOS';
            case 'linux':
                return 'Linux';
            default:
                return 'Unknown';
        }
    }
    /**
     * Check if platform is supported
     */
    static isPlatformSupported() {
        const platform = process.platform;
        return ['win32', 'darwin', 'linux'].includes(platform);
    }
    /**
     * Get platform capabilities without creating simulator
     */
    static async getPlatformCapabilities() {
        const platform = process.platform;
        const platformName = ActivitySimulatorFactory.getPlatformName();
        if (!ActivitySimulatorFactory.isPlatformSupported()) {
            return {
                platform: platformName,
                supported: false,
                capabilities: null
            };
        }
        try {
            const simulator = ActivitySimulatorFactory.create();
            const capabilities = simulator.getCapabilities();
            return {
                platform: platformName,
                supported: true,
                capabilities
            };
        }
        catch (error) {
            return {
                platform: platformName,
                supported: false,
                capabilities: null
            };
        }
    }
}
exports.ActivitySimulatorFactory = ActivitySimulatorFactory;


/***/ }),

/***/ "./src/main/activity/LinuxActivitySimulator.ts":
/*!*****************************************************!*\
  !*** ./src/main/activity/LinuxActivitySimulator.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

/**
 * Linux Activity Simulator
 * Implements activity simulation for Linux using xdotool, xinput, and other tools
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LinuxActivitySimulator = void 0;
const ActivitySimulator_1 = __webpack_require__(/*! ./ActivitySimulator */ "./src/main/activity/ActivitySimulator.ts");
class LinuxActivitySimulator extends ActivitySimulator_1.ActivitySimulator {
    constructor(options = {}) {
        super(options);
        this.xdotoolAvailable = false;
        this.xinputAvailable = false;
        this.waylandDetected = false;
        this.desktopEnvironment = 'unknown';
        this.detectEnvironment();
    }
    /**
     * Detect Linux environment and available tools
     */
    async detectEnvironment() {
        try {
            await this.checkXdotoolAvailability();
            await this.checkXinputAvailability();
            await this.detectWayland();
            await this.detectDesktopEnvironment();
            this.log(`Environment detected: DE=${this.desktopEnvironment}, Wayland=${this.waylandDetected}`);
        }
        catch (error) {
            this.log('Error detecting environment: ' + error);
        }
    }
    /**
     * Check if xdotool is available
     */
    async checkXdotoolAvailability() {
        try {
            const { exec } = __webpack_require__(/*! child_process */ "child_process");
            const util = __webpack_require__(/*! util */ "util");
            const execAsync = util.promisify(exec);
            await execAsync('which xdotool');
            this.xdotoolAvailable = true;
            this.log('xdotool available');
        }
        catch (error) {
            this.xdotoolAvailable = false;
            this.log('xdotool not available');
        }
    }
    /**
     * Check if xinput is available
     */
    async checkXinputAvailability() {
        try {
            const { exec } = __webpack_require__(/*! child_process */ "child_process");
            const util = __webpack_require__(/*! util */ "util");
            const execAsync = util.promisify(exec);
            await execAsync('which xinput');
            this.xinputAvailable = true;
            this.log('xinput available');
        }
        catch (error) {
            this.xinputAvailable = false;
            this.log('xinput not available');
        }
    }
    /**
     * Detect if running on Wayland
     */
    async detectWayland() {
        try {
            const sessionType = process.env.XDG_SESSION_TYPE || '';
            const waylandDisplay = process.env.WAYLAND_DISPLAY || '';
            this.waylandDetected = sessionType.includes('wayland') || waylandDisplay !== '';
            this.log(`Wayland detected: ${this.waylandDetected}`);
        }
        catch (error) {
            this.waylandDetected = false;
        }
    }
    /**
     * Detect desktop environment
     */
    async detectDesktopEnvironment() {
        try {
            const de = process.env.XDG_CURRENT_DESKTOP ||
                process.env.DESKTOP_SESSION ||
                process.env.GDMSESSION ||
                'unknown';
            this.desktopEnvironment = de.toLowerCase();
            this.log(`Desktop environment: ${this.desktopEnvironment}`);
        }
        catch (error) {
            this.desktopEnvironment = 'unknown';
        }
    }
    /**
     * Get platform capabilities
     */
    getCapabilities() {
        const limitations = [];
        if (this.waylandDetected) {
            limitations.push('Wayland detected - some features may be limited');
        }
        if (!this.xdotoolAvailable && !this.xinputAvailable) {
            limitations.push('xdotool and xinput not available - install xdotool for full functionality');
        }
        return {
            mouseSimulation: this.xdotoolAvailable || this.xinputAvailable,
            keyboardSimulation: this.xdotoolAvailable,
            requiresElevation: false,
            limitations
        };
    }
    /**
     * Perform the actual activity simulation
     */
    async performActivity() {
        try {
            switch (this.activityType) {
                case 'mouse':
                    await this.simulateMouseMovement();
                    break;
                case 'keyboard':
                    await this.simulateKeyboardInput();
                    break;
                case 'both':
                    // Alternate between mouse and keyboard
                    if (Math.random() > 0.5) {
                        await this.simulateMouseMovement();
                    }
                    else {
                        await this.simulateKeyboardInput();
                    }
                    break;
            }
        }
        catch (error) {
            this.handleError(error, 'performActivity');
        }
    }
    /**
     * Simulate mouse movement
     */
    async simulateMouseMovement() {
        if (this.xdotoolAvailable) {
            await this.simulateMouseMovementXdotool();
        }
        else if (this.xinputAvailable) {
            await this.simulateMouseMovementXinput();
        }
        else {
            await this.simulateMouseMovementFallback();
        }
    }
    /**
     * Simulate keyboard input
     */
    async simulateKeyboardInput() {
        if (this.xdotoolAvailable) {
            await this.simulateKeyboardInputXdotool();
        }
        else {
            await this.simulateKeyboardInputFallback();
        }
    }
    /**
     * Simulate mouse movement using xdotool
     */
    async simulateMouseMovementXdotool() {
        try {
            const { exec } = __webpack_require__(/*! child_process */ "child_process");
            const util = __webpack_require__(/*! util */ "util");
            const execAsync = util.promisify(exec);
            // Move mouse by 1 pixel relative to current position
            await execAsync('xdotool mousemove_relative 1 0');
            // Wait a moment and move back
            await this.sleep(10);
            await execAsync('xdotool mousemove_relative -1 0');
            this.log('Mouse moved using xdotool');
        }
        catch (error) {
            this.handleError(error, 'simulateMouseMovementXdotool');
        }
    }
    /**
     * Simulate mouse movement using xinput
     */
    async simulateMouseMovementXinput() {
        try {
            const { exec } = __webpack_require__(/*! child_process */ "child_process");
            const util = __webpack_require__(/*! util */ "util");
            const execAsync = util.promisify(exec);
            // Get mouse device ID
            const { stdout } = await execAsync('xinput list | grep -i mouse | head -1');
            const deviceMatch = stdout.match(/id=(\d+)/);
            if (deviceMatch) {
                const deviceId = deviceMatch[1];
                // This is more complex with xinput, so fall back to xdotool approach
                await this.simulateMouseMovementXdotool();
            }
        }
        catch (error) {
            this.handleError(error, 'simulateMouseMovementXinput');
        }
    }
    /**
     * Simulate keyboard input using xdotool
     */
    async simulateKeyboardInputXdotool() {
        try {
            const { exec } = __webpack_require__(/*! child_process */ "child_process");
            const util = __webpack_require__(/*! util */ "util");
            const execAsync = util.promisify(exec);
            // Press Scroll Lock key
            await execAsync('xdotool key Scroll_Lock');
            this.log('Scroll Lock pressed using xdotool');
        }
        catch (error) {
            this.handleError(error, 'simulateKeyboardInputXdotool');
        }
    }
    /**
     * Fallback mouse movement simulation
     */
    async simulateMouseMovementFallback() {
        try {
            const { exec } = __webpack_require__(/*! child_process */ "child_process");
            const util = __webpack_require__(/*! util */ "util");
            const execAsync = util.promisify(exec);
            // Try using Python with pynput if available
            const pythonScript = `
try:
    from pynput.mouse import Controller
    import time
    
    mouse = Controller()
    current_pos = mouse.position
    
    # Move mouse by 1 pixel
    mouse.position = (current_pos[0] + 1, current_pos[1])
    time.sleep(0.01)
    
    # Move back
    mouse.position = current_pos
    print("Mouse moved using pynput")
except ImportError:
    print("pynput not available")
except Exception as e:
    print(f"Error: {e}")
      `;
            await execAsync(`python3 -c "${pythonScript}"`);
            this.log('Mouse moved using Python fallback');
        }
        catch (error) {
            this.handleError(error, 'simulateMouseMovementFallback');
        }
    }
    /**
     * Fallback keyboard input simulation
     */
    async simulateKeyboardInputFallback() {
        try {
            const { exec } = __webpack_require__(/*! child_process */ "child_process");
            const util = __webpack_require__(/*! util */ "util");
            const execAsync = util.promisify(exec);
            // Try using Python with pynput if available
            const pythonScript = `
try:
    from pynput.keyboard import Key, Controller
    
    keyboard = Controller()
    keyboard.press(Key.scroll_lock)
    keyboard.release(Key.scroll_lock)
    print("Scroll Lock pressed using pynput")
except ImportError:
    print("pynput not available")
except Exception as e:
    print(f"Error: {e}")
      `;
            await execAsync(`python3 -c "${pythonScript}"`);
            this.log('Scroll Lock pressed using Python fallback');
        }
        catch (error) {
            this.handleError(error, 'simulateKeyboardInputFallback');
        }
    }
    /**
     * Wayland-specific activity simulation
     */
    async simulateActivityWayland() {
        try {
            // For Wayland, options are more limited
            // Try using ydotool if available
            const { exec } = __webpack_require__(/*! child_process */ "child_process");
            const util = __webpack_require__(/*! util */ "util");
            const execAsync = util.promisify(exec);
            try {
                await execAsync('which ydotool');
                await execAsync('ydotool mousemove_relative 1 0');
                await this.sleep(10);
                await execAsync('ydotool mousemove_relative -1 0');
                this.log('Mouse moved using ydotool (Wayland)');
            }
            catch {
                // Fallback to Python method
                await this.simulateMouseMovementFallback();
            }
        }
        catch (error) {
            this.handleError(error, 'simulateActivityWayland');
        }
    }
    /**
     * Sleep utility function
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    /**
     * Get system information
     */
    async getSystemInfo() {
        try {
            const { exec } = __webpack_require__(/*! child_process */ "child_process");
            const util = __webpack_require__(/*! util */ "util");
            const execAsync = util.promisify(exec);
            let distribution = 'unknown';
            let version = 'unknown';
            try {
                const { stdout } = await execAsync('lsb_release -si 2>/dev/null || cat /etc/os-release | grep "^ID=" | cut -d= -f2 | tr -d \'"\'');
                distribution = stdout.trim();
            }
            catch { }
            try {
                const { stdout } = await execAsync('lsb_release -sr 2>/dev/null || cat /etc/os-release | grep "^VERSION_ID=" | cut -d= -f2 | tr -d \'"\'');
                version = stdout.trim();
            }
            catch { }
            return {
                distribution,
                version,
                desktop: this.desktopEnvironment,
                session: process.env.XDG_SESSION_TYPE || 'unknown'
            };
        }
        catch (error) {
            this.handleError(error, 'getSystemInfo');
            return {
                distribution: 'unknown',
                version: 'unknown',
                desktop: this.desktopEnvironment,
                session: 'unknown'
            };
        }
    }
    /**
     * Check if tools are available
     */
    getToolAvailability() {
        return {
            xdotool: this.xdotoolAvailable,
            xinput: this.xinputAvailable,
            ydotool: false, // Will be checked dynamically
            pynput: false // Will be checked dynamically
        };
    }
}
exports.LinuxActivitySimulator = LinuxActivitySimulator;


/***/ }),

/***/ "./src/main/activity/MacOSActivitySimulator.ts":
/*!*****************************************************!*\
  !*** ./src/main/activity/MacOSActivitySimulator.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

/**
 * macOS Activity Simulator
 * Implements activity simulation for macOS using osascript and shell commands
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MacOSActivitySimulator = void 0;
const ActivitySimulator_1 = __webpack_require__(/*! ./ActivitySimulator */ "./src/main/activity/ActivitySimulator.ts");
class MacOSActivitySimulator extends ActivitySimulator_1.ActivitySimulator {
    constructor(options = {}) {
        super(options);
        this.cliToolsAvailable = false;
        this.checkCliToolsAvailability();
    }
    /**
     * Check if CLI tools are available
     */
    async checkCliToolsAvailability() {
        try {
            const { exec } = __webpack_require__(/*! child_process */ "child_process");
            const util = __webpack_require__(/*! util */ "util");
            const execAsync = util.promisify(exec);
            await execAsync('which osascript');
            this.cliToolsAvailable = true;
            this.log('macOS CLI tools available');
        }
        catch (error) {
            this.cliToolsAvailable = false;
            this.log('macOS CLI tools not available');
        }
    }
    /**
     * Get platform capabilities
     */
    getCapabilities() {
        return {
            mouseSimulation: this.cliToolsAvailable,
            keyboardSimulation: this.cliToolsAvailable,
            requiresElevation: false,
            limitations: this.cliToolsAvailable
                ? []
                : ['osascript not available - requires macOS command line tools']
        };
    }
    /**
     * Perform the actual activity simulation
     */
    async performActivity() {
        try {
            switch (this.activityType) {
                case 'mouse':
                    await this.simulateMouseMovement();
                    break;
                case 'keyboard':
                    await this.simulateKeyboardInput();
                    break;
                case 'both':
                    // Alternate between mouse and keyboard
                    if (Math.random() > 0.5) {
                        await this.simulateMouseMovement();
                    }
                    else {
                        await this.simulateKeyboardInput();
                    }
                    break;
            }
        }
        catch (error) {
            this.handleError(error, 'performActivity');
        }
    }
    /**
     * Simulate mouse movement
     */
    async simulateMouseMovement() {
        if (!this.cliToolsAvailable) {
            this.log('Cannot simulate mouse movement - CLI tools not available');
            return;
        }
        try {
            const { exec } = __webpack_require__(/*! child_process */ "child_process");
            const util = __webpack_require__(/*! util */ "util");
            const execAsync = util.promisify(exec);
            // AppleScript to move mouse slightly
            const script = `
        tell application "System Events"
          set currentPosition to (current mouse position)
          set x to (item 1 of currentPosition)
          set y to (item 2 of currentPosition)
          
          -- Move mouse by 1 pixel
          set mouse position to {x + 1, y}
          delay 0.01
          
          -- Move mouse back to original position
          set mouse position to {x, y}
        end tell
      `;
            await execAsync(`osascript -e '${script}'`);
            this.log('Mouse moved using AppleScript');
        }
        catch (error) {
            this.handleError(error, 'simulateMouseMovement');
        }
    }
    /**
     * Simulate keyboard input
     */
    async simulateKeyboardInput() {
        if (!this.cliToolsAvailable) {
            this.log('Cannot simulate keyboard input - CLI tools not available');
            return;
        }
        try {
            const { exec } = __webpack_require__(/*! child_process */ "child_process");
            const util = __webpack_require__(/*! util */ "util");
            const execAsync = util.promisify(exec);
            // AppleScript to press F15 key (least intrusive)
            const script = `
        tell application "System Events"
          key code 113
        end tell
      `;
            await execAsync(`osascript -e '${script}'`);
            this.log('F15 key pressed using AppleScript');
        }
        catch (error) {
            this.handleError(error, 'simulateKeyboardInput');
        }
    }
    /**
     * Alternative method using cliclick if available
     */
    async simulateActivityUsingCliClick() {
        try {
            const { exec } = __webpack_require__(/*! child_process */ "child_process");
            const util = __webpack_require__(/*! util */ "util");
            const execAsync = util.promisify(exec);
            // Check if cliclick is available
            await execAsync('which cliclick');
            // Use cliclick to move mouse
            await execAsync('cliclick m:+1,+0');
            await execAsync('cliclick m:-1,+0');
            this.log('Activity simulated using cliclick');
        }
        catch (error) {
            // Fallback to AppleScript
            await this.simulateMouseMovement();
        }
    }
    /**
     * Simulate activity using Core Graphics (if available)
     */
    async simulateActivityUsingCoreGraphics() {
        try {
            const { exec } = __webpack_require__(/*! child_process */ "child_process");
            const util = __webpack_require__(/*! util */ "util");
            const execAsync = util.promisify(exec);
            // Python script using Core Graphics
            const pythonScript = `
import Quartz
import time

def simulate_mouse_movement():
    # Get current mouse position
    current_pos = Quartz.CGEventSourceStateCurrentMousePosition(Quartz.kCGEventSourceStateHIDSystemState)
    
    # Create mouse move event
    move_event = Quartz.CGEventCreateMouseEvent(
        None,
        Quartz.kCGEventMouseMoved,
        (current_pos.x + 1, current_pos.y),
        Quartz.kCGMouseButtonLeft
    )
    
    # Post the event
    Quartz.CGEventPost(Quartz.kCGHIDEventTap, move_event)
    
    # Wait a moment
    time.sleep(0.01)
    
    # Move back
    move_back_event = Quartz.CGEventCreateMouseEvent(
        None,
        Quartz.kCGEventMouseMoved,
        (current_pos.x, current_pos.y),
        Quartz.kCGMouseButtonLeft
    )
    
    Quartz.CGEventPost(Quartz.kCGHIDEventTap, move_back_event)

simulate_mouse_movement()
      `;
            await execAsync(`python3 -c "${pythonScript}"`);
            this.log('Activity simulated using Core Graphics');
        }
        catch (error) {
            this.handleError(error, 'simulateActivityUsingCoreGraphics');
        }
    }
    /**
     * Check if cliclick is available
     */
    async isCliClickAvailable() {
        try {
            const { exec } = __webpack_require__(/*! child_process */ "child_process");
            const util = __webpack_require__(/*! util */ "util");
            const execAsync = util.promisify(exec);
            await execAsync('which cliclick');
            return true;
        }
        catch {
            return false;
        }
    }
    /**
     * Get system information
     */
    async getSystemInfo() {
        try {
            const { exec } = __webpack_require__(/*! child_process */ "child_process");
            const util = __webpack_require__(/*! util */ "util");
            const execAsync = util.promisify(exec);
            const { stdout: version } = await execAsync('sw_vers -productVersion');
            const { stdout: arch } = await execAsync('uname -m');
            return {
                version: version.trim(),
                arch: arch.trim()
            };
        }
        catch (error) {
            this.handleError(error, 'getSystemInfo');
            return { version: 'unknown', arch: 'unknown' };
        }
    }
}
exports.MacOSActivitySimulator = MacOSActivitySimulator;


/***/ }),

/***/ "./src/main/activity/SleepPreventionManager.ts":
/*!*****************************************************!*\
  !*** ./src/main/activity/SleepPreventionManager.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

/**
 * Sleep Prevention Modes
 * Defines different levels of system and activity management
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SleepPreventionManager = exports.SleepPreventionMode = void 0;
var SleepPreventionMode;
(function (SleepPreventionMode) {
    /** Basic sleep prevention - only prevents system sleep */
    SleepPreventionMode["BASIC"] = "basic";
    /** Full prevention - prevents sleep AND simulates activity */
    SleepPreventionMode["FULL"] = "full";
    /** Activity only - simulates activity without preventing sleep */
    SleepPreventionMode["ACTIVITY_ONLY"] = "activity-only";
})(SleepPreventionMode || (exports.SleepPreventionMode = SleepPreventionMode = {}));
class SleepPreventionManager {
    constructor(config = {}) {
        this.state = {
            mode: SleepPreventionMode.FULL,
            systemSleepPrevention: false,
            activitySimulation: false,
            timerActive: false,
            timerDuration: 0,
            timeRemaining: 0
        };
        this.config = {
            defaultMode: SleepPreventionMode.FULL,
            activityInterval: 30000, // 30 seconds
            activityType: 'both',
            debug: false
        };
        this.listeners = [];
        this.config = { ...this.config, ...config };
        this.state.mode = this.config.defaultMode;
    }
    /**
     * Get current state
     */
    getState() {
        return { ...this.state };
    }
    /**
     * Get current configuration
     */
    getConfig() {
        return { ...this.config };
    }
    /**
     * Set sleep prevention mode
     */
    setMode(mode) {
        if (this.state.mode === mode) {
            return;
        }
        this.state.mode = mode;
        this.notifyListeners();
    }
    /**
     * Update system sleep prevention state
     */
    setSystemSleepPrevention(active) {
        if (this.state.systemSleepPrevention === active) {
            return;
        }
        this.state.systemSleepPrevention = active;
        this.notifyListeners();
    }
    /**
     * Update activity simulation state
     */
    setActivitySimulation(active) {
        if (this.state.activitySimulation === active) {
            return;
        }
        this.state.activitySimulation = active;
        this.notifyListeners();
    }
    /**
     * Update timer state
     */
    setTimerState(active, duration = 0, remaining = 0) {
        this.state.timerActive = active;
        this.state.timerDuration = duration;
        this.state.timeRemaining = remaining;
        this.notifyListeners();
    }
    /**
     * Update timer countdown
     */
    updateTimeRemaining(seconds) {
        this.state.timeRemaining = seconds;
        this.notifyListeners();
    }
    /**
     * Update configuration
     */
    updateConfig(config) {
        this.config = { ...this.config, ...config };
        this.notifyListeners();
    }
    /**
     * Add state change listener
     */
    addListener(listener) {
        this.listeners.push(listener);
    }
    /**
     * Remove state change listener
     */
    removeListener(listener) {
        const index = this.listeners.indexOf(listener);
        if (index >= 0) {
            this.listeners.splice(index, 1);
        }
    }
    /**
     * Notify all listeners of state changes
     */
    notifyListeners() {
        this.listeners.forEach(listener => {
            try {
                listener(this.getState());
            }
            catch (error) {
                console.error('Error notifying state listener:', error);
            }
        });
    }
    /**
     * Get mode description for UI
     */
    getModeDescription(mode) {
        switch (mode) {
            case SleepPreventionMode.BASIC:
                return 'Prevents system sleep only';
            case SleepPreventionMode.FULL:
                return 'Prevents sleep + simulates activity';
            case SleepPreventionMode.ACTIVITY_ONLY:
                return 'Simulates activity only';
            default:
                return 'Unknown mode';
        }
    }
    /**
     * Get mode display name
     */
    getModeDisplayName(mode) {
        switch (mode) {
            case SleepPreventionMode.BASIC:
                return 'Basic';
            case SleepPreventionMode.FULL:
                return 'Full';
            case SleepPreventionMode.ACTIVITY_ONLY:
                return 'Activity';
            default:
                return 'Unknown';
        }
    }
    /**
     * Check if mode should prevent system sleep
     */
    shouldPreventSystemSleep(mode) {
        return mode === SleepPreventionMode.BASIC || mode === SleepPreventionMode.FULL;
    }
    /**
     * Check if mode should simulate activity
     */
    shouldSimulateActivity(mode) {
        return mode === SleepPreventionMode.FULL || mode === SleepPreventionMode.ACTIVITY_ONLY;
    }
}
exports.SleepPreventionManager = SleepPreventionManager;


/***/ }),

/***/ "./src/main/activity/WindowsActivitySimulator.ts":
/*!*******************************************************!*\
  !*** ./src/main/activity/WindowsActivitySimulator.ts ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

/**
 * Windows Activity Simulator
 * Implements activity simulation for Windows using robotjs or native APIs
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WindowsActivitySimulator = void 0;
const ActivitySimulator_1 = __webpack_require__(/*! ./ActivitySimulator */ "./src/main/activity/ActivitySimulator.ts");
class WindowsActivitySimulator extends ActivitySimulator_1.ActivitySimulator {
    constructor(options = {}) {
        super(options);
        this.robotjs = null;
        this.lastMousePosition = { x: 0, y: 0 };
        this.scrollLockState = false;
        this.initializeRobotjs();
    }
    /**
     * Initialize robotjs library
     */
    initializeRobotjs() {
        try {
            // Try to load robotjs
            this.robotjs = __webpack_require__(/*! robotjs */ "robotjs");
            this.log('robotjs loaded successfully');
        }
        catch (error) {
            this.log('robotjs not available, using fallback methods');
            this.robotjs = null;
        }
    }
    /**
     * Get platform capabilities
     */
    getCapabilities() {
        return {
            mouseSimulation: this.robotjs !== null,
            keyboardSimulation: true, // Can use shell commands as fallback
            requiresElevation: false,
            limitations: this.robotjs
                ? []
                : ['robotjs not available - limited to shell commands']
        };
    }
    /**
     * Perform the actual activity simulation
     */
    async performActivity() {
        try {
            // Log every time activity is simulated
            console.log('[NoDoze] Simulating user activity:', this.activityType, new Date().toISOString());
            switch (this.activityType) {
                case 'mouse':
                    await this.simulateMouseMovement();
                    break;
                case 'keyboard':
                    await this.simulateKeyboardInput();
                    break;
                case 'both':
                    // Alternate between mouse and keyboard
                    if (Math.random() > 0.5) {
                        await this.simulateMouseMovement();
                    }
                    else {
                        await this.simulateKeyboardInput();
                    }
                    break;
            }
        }
        catch (error) {
            this.handleError(error, 'performActivity');
        }
    }
    /**
     * Simulate mouse movement
     */
    async simulateMouseMovement() {
        if (this.robotjs) {
            try {
                // Get current mouse position
                const currentPos = this.robotjs.getMousePos();
                // Move mouse by 1 pixel and back to simulate activity
                this.robotjs.moveMouse(currentPos.x + 1, currentPos.y);
                // Wait a moment and move back
                await this.sleep(10);
                this.robotjs.moveMouse(currentPos.x, currentPos.y);
                this.log(`Mouse moved to ${currentPos.x + 1},${currentPos.y} and back`);
            }
            catch (error) {
                this.handleError(error, 'simulateMouseMovement');
            }
        }
        else {
            // Fallback: Use PowerShell to simulate mouse activity
            await this.simulateMouseMovementPowerShell();
        }
    }
    /**
     * Simulate keyboard input
     */
    async simulateKeyboardInput() {
        if (this.robotjs) {
            try {
                // Toggle Scroll Lock key (least intrusive)
                this.robotjs.keyTap('scrolllock');
                this.log('Scroll Lock key pressed');
            }
            catch (error) {
                this.handleError(error, 'simulateKeyboardInput');
            }
        }
        else {
            // Fallback: Use PowerShell to simulate keyboard activity
            await this.simulateKeyboardInputPowerShell();
        }
    }
    /**
     * Simulate mouse movement using PowerShell
     */
    async simulateMouseMovementPowerShell() {
        try {
            const { exec } = __webpack_require__(/*! child_process */ "child_process");
            const util = __webpack_require__(/*! util */ "util");
            const execAsync = util.promisify(exec);
            // PowerShell script to move mouse slightly
            const script = `
        Add-Type -AssemblyName System.Windows.Forms
        $pos = [System.Windows.Forms.Cursor]::Position
        [System.Windows.Forms.Cursor]::Position = New-Object System.Drawing.Point(($pos.X + 1), $pos.Y)
        Start-Sleep -Milliseconds 10
        [System.Windows.Forms.Cursor]::Position = $pos
      `;
            await execAsync(`powershell -Command "${script}"`);
            this.log('Mouse moved using PowerShell');
        }
        catch (error) {
            this.handleError(error, 'simulateMouseMovementPowerShell');
        }
    }
    /**
     * Simulate keyboard input using PowerShell
     */
    async simulateKeyboardInputPowerShell() {
        try {
            const { exec } = __webpack_require__(/*! child_process */ "child_process");
            const util = __webpack_require__(/*! util */ "util");
            const execAsync = util.promisify(exec);
            // PowerShell script to press Scroll Lock
            const script = `
        Add-Type -AssemblyName System.Windows.Forms
        [System.Windows.Forms.SendKeys]::SendWait("{SCROLLLOCK}")
      `;
            await execAsync(`powershell -Command "${script}"`);
            this.log('Scroll Lock pressed using PowerShell');
        }
        catch (error) {
            this.handleError(error, 'simulateKeyboardInputPowerShell');
        }
    }
    /**
     * Alternative method using Windows API via shell
     */
    async simulateActivityViaShell() {
        try {
            const { exec } = __webpack_require__(/*! child_process */ "child_process");
            const util = __webpack_require__(/*! util */ "util");
            const execAsync = util.promisify(exec);
            // Use nircmd if available, otherwise use PowerShell
            try {
                await execAsync('nircmd sendkey 0x91 press'); // Scroll Lock key
                this.log('Activity simulated using nircmd');
            }
            catch {
                // Fallback to PowerShell
                await this.simulateKeyboardInputPowerShell();
            }
        }
        catch (error) {
            this.handleError(error, 'simulateActivityViaShell');
        }
    }
    /**
     * Sleep utility function
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    /**
     * Check if robotjs is available
     */
    isRobotjsAvailable() {
        return this.robotjs !== null;
    }
    /**
     * Get current mouse position (if available)
     */
    getCurrentMousePosition() {
        if (this.robotjs) {
            try {
                return this.robotjs.getMousePos();
            }
            catch (error) {
                this.handleError(error, 'getCurrentMousePosition');
            }
        }
        return null;
    }
}
exports.WindowsActivitySimulator = WindowsActivitySimulator;


/***/ }),

/***/ "./src/main/ensure-icons-available.js":
/*!********************************************!*\
  !*** ./src/main/ensure-icons-available.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

/**
 * Ensure Icons Available
 *
 * This utility copies icon files to the expected production locations
 * to ensure that the taskbar icon can be properly updated in a built app.
 */
const { app } = __webpack_require__(/*! electron */ "electron");
const fs = __webpack_require__(/*! fs */ "fs");
const path = __webpack_require__(/*! path */ "path");
/**
 * Copies icon files to production locations to ensure they're available
 * This is particularly important for electron-builder packaged apps
 */
async function ensureIconsAvailable() {
    console.log('Ensuring icon files are available in production environment...');
    try {
        const isProduction = app.isPackaged;
        if (!isProduction) {
            console.log('Development mode detected, skipping production icon setup');
            return;
        }
        console.log('Production mode detected, ensuring icon files are available');
        // Source icon paths (look in multiple possible locations)
        const sourcePaths = [
            app.getAppPath(),
            path.join(path.dirname(app.getPath('exe')), 'resources'),
            path.join(path.dirname(app.getPath('exe')), 'resources', 'app.asar.unpacked'),
            path.dirname(app.getPath('exe'))
        ];
        // Find source icons
        let eyeActiveIcoPath = null;
        let eyeInactiveIcoPath = null;
        for (const basePath of sourcePaths) {
            // Check different possible locations
            const possibleActivePaths = [
                path.join(basePath, 'build', 'icons', 'win', 'eye-active.ico'),
                path.join(basePath, 'build', 'eye-active.ico'),
                path.join(basePath, 'eye-active.ico')
            ];
            const possibleInactivePaths = [
                path.join(basePath, 'build', 'icons', 'win', 'eye-inactive.ico'),
                path.join(basePath, 'build', 'eye-inactive.ico'),
                path.join(basePath, 'eye-inactive.ico')
            ];
            // Look for active icon
            for (const p of possibleActivePaths) {
                try {
                    if (fs.existsSync(p)) {
                        eyeActiveIcoPath = p;
                        console.log(`Found active icon at: ${p}`);
                        break;
                    }
                }
                catch (err) {
                    // Ignore errors
                }
            }
            // Look for inactive icon
            for (const p of possibleInactivePaths) {
                try {
                    if (fs.existsSync(p)) {
                        eyeInactiveIcoPath = p;
                        console.log(`Found inactive icon at: ${p}`);
                        break;
                    }
                }
                catch (err) {
                    // Ignore errors
                }
            }
            // If we found both icons, we can stop searching
            if (eyeActiveIcoPath && eyeInactiveIcoPath)
                break;
        }
        if (!eyeActiveIcoPath || !eyeInactiveIcoPath) {
            console.error('Could not find source icon files');
            // Try to find any .ico files as a fallback
            if (!eyeActiveIcoPath) {
                for (const basePath of sourcePaths) {
                    try {
                        const files = fs.readdirSync(basePath);
                        for (const file of files) {
                            if (file.endsWith('.ico')) {
                                eyeActiveIcoPath = path.join(basePath, file);
                                console.log(`Using fallback active icon: ${eyeActiveIcoPath}`);
                                break;
                            }
                        }
                        if (eyeActiveIcoPath)
                            break;
                    }
                    catch (err) {
                        // Ignore errors
                    }
                }
            }
            if (!eyeInactiveIcoPath && eyeActiveIcoPath) {
                // Use the active icon for inactive as well if needed
                eyeInactiveIcoPath = eyeActiveIcoPath;
                console.log(`Using active icon for inactive as well`);
            }
            if (!eyeActiveIcoPath) {
                console.error('Could not find any icons, giving up');
                return;
            }
        }
        // Target paths where icons should be copied
        const exeDir = path.dirname(app.getPath('exe'));
        const targetPaths = [
            { source: eyeActiveIcoPath, dest: path.join(exeDir, 'eye-active.ico') },
            { source: eyeInactiveIcoPath, dest: path.join(exeDir, 'eye-inactive.ico') },
            { source: eyeActiveIcoPath, dest: path.join(exeDir, 'app.ico') }
        ];
        // Copy the icons
        for (const { source, dest } of targetPaths) {
            try {
                fs.copyFileSync(source, dest);
                console.log(`✓ Copied ${source} to ${dest}`);
            }
            catch (err) {
                console.error(`✗ Failed to copy ${source} to ${dest}: ${err.message}`);
            }
        }
        console.log('Finished ensuring icon files are available');
    }
    catch (err) {
        console.error('Error ensuring icons available:', err);
    }
}
module.exports = { ensureIconsAvailable };


/***/ }),

/***/ "./src/main/extract-and-copy-icons.js":
/*!********************************************!*\
  !*** ./src/main/extract-and-copy-icons.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

/**
 * Extract and Copy Icons
 *
 * This utility extracts icons from the app.asar file and copies them to locations
 * where the production app can access them. This is run at app startup in production.
 */
const { app } = __webpack_require__(/*! electron */ "electron");
const path = __webpack_require__(/*! path */ "path");
const fs = __webpack_require__(/*! fs */ "fs");
/**
 * Extracts icons from app.asar and copies them to accessible locations
 * Runs only in production and ensures icons are available for taskbar updates
 */
async function extractAndCopyIcons() {
    console.log('Running extract and copy icons utility...');
    if (!app.isPackaged) {
        console.log('Development mode detected, skipping icon extraction');
        return false;
    }
    try {
        const exeDir = path.dirname(app.getPath('exe'));
        const resourcesDir = path.join(exeDir, 'resources');
        const appAsarPath = path.join(resourcesDir, 'app.asar');
        console.log(`Extracting and copying icons in production mode`);
        console.log(`- Executable directory: ${exeDir}`);
        console.log(`- Resources directory: ${resourcesDir}`);
        // Ensure target directory exists
        if (!fs.existsSync(exeDir)) {
            console.error(`Executable directory does not exist: ${exeDir}`);
            return false;
        }
        // Copy icons from various possible locations to the exe directory
        const extractedIcons = {
            eyeActive: false,
            eyeInactive: false
        };
        // Try to find icons in all possible locations in the production build
        const possibleLocations = [
            // In resources directory directly
            resourcesDir,
            // In unpacked resources
            path.join(resourcesDir, 'app.asar.unpacked'),
            // In build folder 
            path.join(resourcesDir, 'app.asar.unpacked', 'build'),
            path.join(resourcesDir, 'build'),
            // In build/icons/win folders
            path.join(resourcesDir, 'app.asar.unpacked', 'build', 'icons', 'win'),
            path.join(resourcesDir, 'build', 'icons', 'win'),
            // In public folder
            path.join(resourcesDir, 'app.asar.unpacked', 'public'),
            path.join(resourcesDir, 'public'),
        ];
        // Try copying icons from each location
        for (const location of possibleLocations) {
            try {
                if (fs.existsSync(location)) {
                    console.log(`Checking location: ${location}`);
                    // Try to find eye-active.ico
                    if (!extractedIcons.eyeActive) {
                        const eyeActivePath = path.join(location, 'eye-active.ico');
                        if (fs.existsSync(eyeActivePath)) {
                            const targetPath = path.join(exeDir, 'eye-active.ico');
                            fs.copyFileSync(eyeActivePath, targetPath);
                            console.log(`✓ Copied eye-active.ico to ${targetPath}`);
                            extractedIcons.eyeActive = true;
                        }
                    }
                    // Try to find eye-inactive.ico
                    if (!extractedIcons.eyeInactive) {
                        const eyeInactivePath = path.join(location, 'eye-inactive.ico');
                        if (fs.existsSync(eyeInactivePath)) {
                            const targetPath = path.join(exeDir, 'eye-inactive.ico');
                            fs.copyFileSync(eyeInactivePath, targetPath);
                            console.log(`✓ Copied eye-inactive.ico to ${targetPath}`);
                            extractedIcons.eyeInactive = true;
                        }
                    }
                    // If we found both icons, we can stop searching
                    if (extractedIcons.eyeActive && extractedIcons.eyeInactive) {
                        break;
                    }
                }
            }
            catch (err) {
                console.error(`Error checking location ${location}:`, err);
            }
        }
        // If we still haven't found the icons, try extracting from the app.asar
        if (!extractedIcons.eyeActive || !extractedIcons.eyeInactive) {
            console.log('Could not find icons in standard locations, trying to extract from app.asar');
            try {
                // This requires the asar package, but we can't rely on it being available
                // So this is just a best-effort attempt
                try {
                    const asar = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module 'asar'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
                    console.log('Found asar package, attempting extraction');
                    // Extract build folder from asar
                    const tempDir = path.join(exeDir, 'temp_icons');
                    if (!fs.existsSync(tempDir)) {
                        fs.mkdirSync(tempDir, { recursive: true });
                    }
                    // Extract only the build folder with icons
                    asar.extractAll(appAsarPath, tempDir, 'build/**/*.ico');
                    // Check if we got the icons
                    const extractedActivePath = path.join(tempDir, 'build', 'eye-active.ico');
                    const extractedInactivePath = path.join(tempDir, 'build', 'eye-inactive.ico');
                    if (fs.existsSync(extractedActivePath) && !extractedIcons.eyeActive) {
                        const targetPath = path.join(exeDir, 'eye-active.ico');
                        fs.copyFileSync(extractedActivePath, targetPath);
                        console.log(`✓ Extracted and copied eye-active.ico to ${targetPath}`);
                        extractedIcons.eyeActive = true;
                    }
                    if (fs.existsSync(extractedInactivePath) && !extractedIcons.eyeInactive) {
                        const targetPath = path.join(exeDir, 'eye-inactive.ico');
                        fs.copyFileSync(extractedInactivePath, targetPath);
                        console.log(`✓ Extracted and copied eye-inactive.ico to ${targetPath}`);
                        extractedIcons.eyeInactive = true;
                    }
                    // Clean up temp dir
                    try {
                        fs.rmdirSync(tempDir, { recursive: true });
                    }
                    catch (cleanupErr) {
                        console.error('Error cleaning up temp dir:', cleanupErr);
                    }
                }
                catch (asarErr) {
                    console.log('Asar package not available, cannot extract from asar file:', asarErr);
                }
            }
            catch (extractErr) {
                console.error('Error extracting icons from asar:', extractErr);
            }
        }
        // Create alternative icons from any ico file as last resort
        if (!extractedIcons.eyeActive || !extractedIcons.eyeInactive) {
            console.log('Still missing some icons, looking for any .ico file as fallback');
            try {
                const files = fs.readdirSync(exeDir);
                let foundIco = null;
                for (const file of files) {
                    if (file.endsWith('.ico')) {
                        foundIco = path.join(exeDir, file);
                        console.log(`Found ico file to use as fallback: ${foundIco}`);
                        break;
                    }
                }
                if (foundIco) {
                    // Use this ico file for any missing icons
                    if (!extractedIcons.eyeActive) {
                        const targetPath = path.join(exeDir, 'eye-active.ico');
                        fs.copyFileSync(foundIco, targetPath);
                        console.log(`✓ Created eye-active.ico from fallback ico`);
                        extractedIcons.eyeActive = true;
                    }
                    if (!extractedIcons.eyeInactive) {
                        const targetPath = path.join(exeDir, 'eye-inactive.ico');
                        fs.copyFileSync(foundIco, targetPath);
                        console.log(`✓ Created eye-inactive.ico from fallback ico`);
                        extractedIcons.eyeInactive = true;
                    }
                }
            }
            catch (fallbackErr) {
                console.error('Error creating fallback icons:', fallbackErr);
            }
        }
        // Create app.ico from eye-active.ico
        if (extractedIcons.eyeActive) {
            const eyeActivePath = path.join(exeDir, 'eye-active.ico');
            const appIcoPath = path.join(exeDir, 'app.ico');
            try {
                fs.copyFileSync(eyeActivePath, appIcoPath);
                console.log(`✓ Created app.ico from eye-active.ico`);
            }
            catch (appIcoErr) {
                console.error('Error creating app.ico:', appIcoErr);
            }
        }
        // Report results
        if (extractedIcons.eyeActive && extractedIcons.eyeInactive) {
            console.log('Successfully extracted and copied all required icons');
            return true;
        }
        else {
            console.error('Failed to extract and copy all required icons');
            return false;
        }
    }
    catch (error) {
        console.error('Error in extractAndCopyIcons:', error);
        return false;
    }
}
module.exports = { extractAndCopyIcons };


/***/ }),

/***/ "./src/main/force-taskbar-icon-update.ts":
/*!***********************************************!*\
  !*** ./src/main/force-taskbar-icon-update.ts ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

/**
 * Special utility for forcing Windows taskbar icon updates
 * This uses aggressive techniques to overcome Windows icon caching issues
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.forceWindowsTaskbarIconUpdate = forceWindowsTaskbarIconUpdate;
const electron_1 = __webpack_require__(/*! electron */ "electron");
const path = __importStar(__webpack_require__(/*! path */ "path"));
const fs = __importStar(__webpack_require__(/*! fs */ "fs"));
/**
 * Force update the Windows taskbar icon to reflect the current state
 * @param window The main application window
 * @param isActive Whether sleep prevention is active
 * @returns True if successful, false otherwise
 */
function forceWindowsTaskbarIconUpdate(window, isActive) {
    if (!window || process.platform !== 'win32')
        return false;
    console.log(`Forcing Windows taskbar icon update (active=${isActive})`);
    try { // 1. Determine the correct icon path
        const iconName = isActive ? 'icon-active.ico' : 'icon-inactive.ico';
        let iconPath = '';
        // ALWAYS use absolute paths via app.getAppPath()
        const appPath = electron_1.app.getAppPath(); // Get the application's root directory
        console.log(`App path for icon search: ${appPath}`);
        // Check for icons in production vs development locations
        const possiblePaths = electron_1.app.isPackaged
            ? [
                // Production paths
                path.join(path.dirname(electron_1.app.getPath('exe')), 'resources', 'build', 'icons', 'win', iconName),
                path.join(path.dirname(electron_1.app.getPath('exe')), 'resources', 'build', 'icons', 'win', 'icon.ico'),
                path.join(path.dirname(electron_1.app.getPath('exe')), 'resources', 'app', 'build', 'icons', 'win', iconName),
                path.join(path.dirname(electron_1.app.getPath('exe')), 'resources', 'app', 'build', 'icons', 'win', 'icon.ico'),
                // PNG fallbacks
                path.join(path.dirname(electron_1.app.getPath('exe')), 'resources', 'public', 'icon.png')
            ]
            : [
                // Development paths
                path.join(appPath, 'build', 'icons', 'win', iconName),
                path.join(appPath, 'build', 'icons', 'win', 'icon.ico'),
                path.join(appPath, 'build', iconName),
                path.join(appPath, 'build', 'icon.ico'),
                // PNG fallback
                path.join(appPath, 'public', 'icon.png')
            ];
        for (const testPath of possiblePaths) {
            if (fs.existsSync(testPath)) {
                iconPath = testPath;
                console.log(`Using icon from: ${iconPath}`);
                break;
            }
        }
        if (!iconPath) {
            console.error('No suitable icon found for Windows taskbar update');
            return false;
        }
        // 2. Load the icon with all possible sizes
        const icon = electron_1.nativeImage.createFromPath(iconPath);
        if (icon.isEmpty()) {
            console.error(`Failed to load icon from ${iconPath}`);
            return false;
        }
        // 3. Apply multiple aggressive techniques to force the update
        // Technique 1: Set the window icon multiple times with different sizes
        window.setIcon(icon);
        // Windows uses different icon sizes in different contexts, so set multiple sizes
        const sizes = [16, 24, 32, 48, 64, 128, 256];
        for (const size of sizes) {
            try {
                const resizedIcon = icon.resize({ width: size, height: size });
                window.setIcon(resizedIcon);
            }
            catch (e) {
                // Ignore resize errors
            }
        }
        // Technique 2: Use overlay icon as a trigger to refresh the taskbar
        try {
            // First set an overlay
            const overlayIcon = icon.resize({ width: 16, height: 16 });
            window.setOverlayIcon(overlayIcon, isActive ? 'Active' : 'Inactive');
            // Then clear it after a delay
            setTimeout(() => {
                if (isActive) {
                    // If active, keep a small overlay to indicate status
                    const smallOverlay = icon.resize({ width: 10, height: 10 });
                    window.setOverlayIcon(smallOverlay, 'Active');
                }
                else {
                    window.setOverlayIcon(null, '');
                }
            }, 500);
        }
        catch (e) {
            console.warn('Overlay icon technique failed:', e);
        } // Technique 3: Copy to Electron executable directory (extreme fallback)
        try {
            // This technique can be useful in both production and development
            const execPath = process.execPath;
            const appDir = path.dirname(execPath);
            const appIconPath = path.join(appDir, 'app.ico');
            console.log(`Attempting to copy ${iconPath} to ${appIconPath}`);
            // Verify icon exists before copying
            if (fs.existsSync(iconPath)) {
                fs.copyFileSync(iconPath, appIconPath);
                console.log(`Copied icon to Electron exe directory: ${appIconPath}`);
            }
            else {
                console.warn(`Source icon doesn't exist at ${iconPath}, skipping copy`);
            }
        }
        catch (e) {
            console.warn('Failed to copy icon to exe directory:', e);
        }
        // Technique 4: Window manipulation to force a refresh
        try {
            // Save current state
            const wasVisible = window.isVisible();
            const wasFocused = window.isFocused();
            const bounds = window.getBounds();
            // Force a slight resize to trigger a window update
            window.setBounds({
                x: bounds.x,
                y: bounds.y,
                width: bounds.width + 1,
                height: bounds.height
            });
            // Restore original size after a short delay
            setTimeout(() => {
                window.setBounds(bounds);
                // Ensure window state is preserved
                if (wasVisible && !window.isVisible())
                    window.show();
                if (wasFocused && !window.isFocused())
                    window.focus();
            }, 100);
        }
        catch (e) {
            console.warn('Window manipulation technique failed:', e);
        }
        console.log('Windows taskbar icon update applied successfully');
        return true;
    }
    catch (error) {
        console.error('Failed to update Windows taskbar icon:', error);
        return false;
    }
}


/***/ }),

/***/ "./src/main/icon-manager-improved.ts":
/*!*******************************************!*\
  !*** ./src/main/icon-manager-improved.ts ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

/**
 * Improved Icon Manager
 * Handles loading and management of application icons for tray and taskbar/dock
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.IconManager = void 0;
exports.createTrayIcon = createTrayIcon;
exports.createAppIcon = createAppIcon;
exports.updateAppIcons = updateAppIcons;
const electron_1 = __webpack_require__(/*! electron */ "electron");
const path = __importStar(__webpack_require__(/*! path */ "path"));
const fs = __importStar(__webpack_require__(/*! fs */ "fs"));
const windows_taskbar_icon_fix_improved_1 = __webpack_require__(/*! ./windows-taskbar-icon-fix-improved */ "./src/main/windows-taskbar-icon-fix-improved.ts");
/**
 * Icon configuration for the application
 */
const iconConfig = {
    basePaths: {
        development: {
            win32: [
                path.join(electron_1.app.getAppPath(), 'build', 'icons', 'win'),
                path.join(electron_1.app.getAppPath(), 'build'),
                path.join(electron_1.app.getAppPath(), 'public')
            ],
            darwin: [
                path.join(electron_1.app.getAppPath(), 'build', 'icons', 'mac'),
                path.join(electron_1.app.getAppPath(), 'public')
            ],
            linux: [
                path.join(electron_1.app.getAppPath(), 'build', 'icons', 'linux'),
                path.join(electron_1.app.getAppPath(), 'public')
            ]
        },
        production: {
            win32: [
                path.join(path.dirname(electron_1.app.getPath('exe')), 'resources', 'build', 'icons', 'win'),
                path.join(path.dirname(electron_1.app.getPath('exe')), 'resources', 'build'),
                path.join(path.dirname(electron_1.app.getPath('exe')), 'resources', 'public')
            ],
            darwin: [
                path.join(path.dirname(electron_1.app.getPath('exe')), 'resources', 'build', 'icons', 'mac'),
                path.join(path.dirname(electron_1.app.getPath('exe')), 'resources', 'public')
            ],
            linux: [
                path.join(path.dirname(electron_1.app.getPath('exe')), 'resources', 'build', 'icons', 'linux'),
                path.join(path.dirname(electron_1.app.getPath('exe')), 'resources', 'public')
            ]
        }
    },
    fileNames: {
        active: {
            win32: {
                tray: ['eye-active.ico', 'eye-active.svg', 'icon.png'],
                app: ['eye-active.ico', 'eye-active.svg', 'icon.png'],
                overlay: ['eye-active.ico', 'eye-active.svg']
            },
            darwin: {
                tray: ['eye-active.svg', 'icon-active.svg', 'icon.png'],
                app: ['eye-active.svg', 'icon-active.svg', 'icon.icns', 'icon.png']
            },
            linux: {
                tray: ['eye-active.svg', 'icon-active.svg', 'icon.png', 'icon.svg'],
                app: ['eye-active.svg', 'icon-active.svg', 'icon.png', 'icon.svg']
            }
        },
        inactive: {
            win32: {
                tray: ['eye-inactive.ico', 'eye-inactive.svg', 'icon.png'],
                app: ['eye-inactive.ico', 'eye-inactive.svg', 'icon.png'],
                overlay: ['eye-inactive.ico', 'eye-inactive.svg']
            },
            darwin: {
                tray: ['eye-inactive.svg', 'icon-inactive.svg', 'icon.png'],
                app: ['eye-inactive.svg', 'icon-inactive.svg', 'icon.icns', 'icon.png']
            },
            linux: {
                tray: ['eye-inactive.svg', 'icon-inactive.svg', 'icon.png', 'icon.svg'],
                app: ['eye-inactive.svg', 'icon-inactive.svg', 'icon.png', 'icon.svg']
            }
        }
    },
    fallbackPaths: {
        win32: {
            tray: ['public/icon.png', 'public/icon.svg'],
            app: ['public/icon.png', 'public/icon.svg'],
            overlay: ['public/icon.png', 'public/icon.svg']
        },
        darwin: {
            tray: ['public/icon.png', 'public/icon.svg'],
            app: ['public/icon.png', 'public/icon.svg']
        },
        linux: {
            tray: ['public/icon.png', 'public/icon.svg'],
            app: ['public/icon.png', 'public/icon.svg']
        }
    },
    sizes: {
        win32: {
            tray: { width: 16, height: 16 },
            app: { width: 64, height: 64 },
            overlay: { width: 16, height: 16 }
        },
        darwin: {
            tray: { width: 22, height: 22 }
        },
        linux: {
            tray: { width: 24, height: 24 }
        }
    }
};
/**
 * Icon Manager class for handling all icon-related functionality
 */
class IconManager {
    constructor() {
        this.platform = process.platform;
        this.isPackaged = electron_1.app.isPackaged;
    }
    /**
     * Load an icon based on state, type and platform
     */
    loadIcon(state, type) {
        console.log(`Loading ${type} icon for state: ${state} on platform: ${this.platform}`);
        try {
            // Get icon paths for the current platform and state
            const iconPath = this.findIconPath(state, type);
            if (!iconPath) {
                console.error(`No suitable icon found for ${type} (${state})`);
                return this.createEmptyIcon();
            }
            console.log(`Found icon at: ${iconPath}`);
            let icon = electron_1.nativeImage.createFromPath(iconPath);
            // Resize icon if needed
            icon = this.resizeIconIfNeeded(icon, type);
            // Special handling for macOS template images
            if (this.platform === 'darwin' && type === 'tray') {
                icon.setTemplateImage(true);
            }
            return icon;
        }
        catch (error) {
            console.error(`Failed to load ${type} icon (${state}):`, error);
            return this.loadFallbackIcon(type);
        }
    }
    /**
     * Find the path to an icon based on state and type
     */
    findIconPath(state, type) {
        // Get base paths for the current environment
        const basePaths = this.isPackaged
            ? iconConfig.basePaths.production[this.platform] || []
            : iconConfig.basePaths.development[this.platform] || [];
        // Get file names for the current state and platform
        const fileNames = iconConfig.fileNames[state][this.platform]?.[type] || [];
        // Try each base path with each file name
        for (const basePath of basePaths) {
            for (const fileName of fileNames) {
                const iconPath = path.join(basePath, fileName);
                if (fs.existsSync(iconPath)) {
                    return iconPath;
                }
            }
        }
        return null;
    }
    /**
     * Load a fallback icon when the primary icon can't be found
     */
    loadFallbackIcon(type) {
        console.log(`Attempting to load fallback icon for ${type}`);
        // Get fallback paths for the current platform
        const fallbackPaths = iconConfig.fallbackPaths[this.platform]?.[type] || [];
        for (const relativePath of fallbackPaths) {
            try {
                const basePath = this.isPackaged
                    ? path.dirname(electron_1.app.getPath('exe'))
                    : electron_1.app.getAppPath();
                const iconPath = path.join(basePath, relativePath);
                if (fs.existsSync(iconPath)) {
                    console.log(`Using fallback icon: ${iconPath}`);
                    let icon = electron_1.nativeImage.createFromPath(iconPath);
                    // Resize fallback icon if needed
                    icon = this.resizeIconIfNeeded(icon, type);
                    return icon;
                }
            }
            catch (error) {
                console.error(`Failed to load fallback icon from ${relativePath}:`, error);
            }
        }
        console.error(`All fallback icons failed for ${type}`);
        return this.createEmptyIcon();
    }
    /**
     * Resize an icon based on platform and type requirements
     */
    resizeIconIfNeeded(icon, type) {
        const size = iconConfig.sizes[this.platform]?.[type];
        if (size && !icon.isEmpty()) {
            return icon.resize(size);
        }
        return icon;
    }
    /**
     * Create an empty icon (last resort fallback)
     */
    createEmptyIcon() {
        console.warn('Creating empty icon as last resort fallback');
        return electron_1.nativeImage.createEmpty();
    }
    /**
     * Get a tray icon based on active state
     */
    getTrayIcon(active) {
        return this.loadIcon(active ? 'active' : 'inactive', 'tray');
    }
    /**
     * Get an app icon based on active state
     */
    getAppIcon(active) {
        return this.loadIcon(active ? 'active' : 'inactive', 'app');
    }
    /**
     * Get an overlay icon based on active state
     */
    getOverlayIcon(active) {
        return this.loadIcon(active ? 'active' : 'inactive', 'overlay');
    }
    /**
     * Update all application icons based on active state
     */
    updateAppIcons(mainWindow, tray, active) {
        console.log(`Updating all app icons - active status: ${active}`);
        // Update tray icon
        if (tray) {
            try {
                const trayIcon = this.getTrayIcon(active);
                tray.setImage(trayIcon);
                tray.setToolTip(`NoDoze - ${active ? 'Sleep Prevention Active' : 'Sleep Prevention Inactive'}`);
                console.log('Tray icon updated successfully');
            }
            catch (trayErr) {
                console.error('Failed to update tray icon:', trayErr);
            }
        }
        // Update window icon
        if (mainWindow) {
            try {
                const appIcon = this.getAppIcon(active);
                mainWindow.setIcon(appIcon);
                console.log('Main window icon updated successfully');
                // For Windows, clear any overlay icon as we're using full icon replacement instead
                if (this.platform === 'win32') {
                    try {
                        // Remove any overlay icons - we're using full icon replacement instead
                        mainWindow.setOverlayIcon(null, '');
                        console.log('Cleared overlay icon (using full icon replacement for status indication)');
                    }
                    catch (overlayErr) {
                        console.error('Failed to clear overlay icon:', overlayErr);
                    }
                }
            }
            catch (appIconErr) {
                console.error('Failed to update app icon:', appIconErr);
            }
            // Apply Windows-specific taskbar icon fixes
            if (this.platform === 'win32') {
                try {
                    (0, windows_taskbar_icon_fix_improved_1.fixWindowsTaskbarIcon)(mainWindow);
                }
                catch (fixErr) {
                    console.error('Failed to apply Windows taskbar icon fix:', fixErr);
                }
            }
        }
    }
}
exports.IconManager = IconManager;
// Create and export a singleton instance
const iconManager = new IconManager();
exports["default"] = iconManager;
// Legacy API for backward compatibility
function createTrayIcon(active = false) {
    return iconManager.getTrayIcon(active);
}
function createAppIcon(active = false) {
    return iconManager.getAppIcon(active);
}
function updateAppIcons(mainWindow, tray, active) {
    iconManager.updateAppIcons(mainWindow, tray, active);
}


/***/ }),

/***/ "./src/main/index.ts":
/*!***************************!*\
  !*** ./src/main/index.ts ***!
  \***************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
const electron_1 = __webpack_require__(/*! electron */ "electron");
const path = __importStar(__webpack_require__(/*! path */ "path"));
const fs = __importStar(__webpack_require__(/*! fs */ "fs"));
const icon_manager_improved_1 = __webpack_require__(/*! ./icon-manager-improved */ "./src/main/icon-manager-improved.ts");
const windows_taskbar_icon_fix_improved_1 = __webpack_require__(/*! ./windows-taskbar-icon-fix-improved */ "./src/main/windows-taskbar-icon-fix-improved.ts");
const SleepPreventionManager_1 = __webpack_require__(/*! ./activity/SleepPreventionManager */ "./src/main/activity/SleepPreventionManager.ts");
const ActivitySimulatorFactory_1 = __webpack_require__(/*! ./activity/ActivitySimulatorFactory */ "./src/main/activity/ActivitySimulatorFactory.ts");
const SettingsManager_1 = __webpack_require__(/*! ./SettingsManager */ "./src/main/SettingsManager.ts");
// Import icon utilities
const { forceTaskbarIconUpdate } = __webpack_require__(/*! ./force-taskbar-icon-update */ "./src/main/force-taskbar-icon-update.ts");
const { ensureIconsAvailable } = __webpack_require__(/*! ./ensure-icons-available */ "./src/main/ensure-icons-available.js");
const { extractAndCopyIcons } = __webpack_require__(/*! ./extract-and-copy-icons */ "./src/main/extract-and-copy-icons.js");
// Setup live reload for development
if (true) {
    try {
        __webpack_require__(/*! electron-reload */ "./node_modules/electron-reload/main.js")(__dirname, {
            electron: path.join(__dirname, '..', '..', 'node_modules', '.bin', 'electron'),
            hardResetMethod: 'exit'
        });
        console.log('Electron reload enabled for development');
    }
    catch (err) {
        console.log('electron-reload not available, continuing without live reload');
    }
}
// Import platform-specific modules
const windowsImpl = __importStar(__webpack_require__(/*! ./platforms/windows */ "./src/main/platforms/windows.ts"));
const macosImpl = __importStar(__webpack_require__(/*! ./platforms/macos */ "./src/main/platforms/macos.ts"));
const linuxImpl = __importStar(__webpack_require__(/*! ./platforms/linux */ "./src/main/platforms/linux.ts"));
// Keep a global reference of objects to prevent garbage collection
let mainWindow = null;
let tray = null;
let isPreventingSleep = false;
let isAppQuitting = false; // Track app quitting state
// Activity simulation system
let sleepPreventionManager;
let activitySimulator = null;
let settingsManager;
// Get the appropriate platform implementation
const getPlatformImpl = () => {
    switch (process.platform) {
        case 'win32':
            return windowsImpl;
        case 'darwin':
            return macosImpl;
        case 'linux':
            return linuxImpl;
        default:
            console.error(`Unsupported platform: ${process.platform}`);
            return null;
    }
};
// Platform-specific sleep prevention
const preventSleep = async () => {
    if (isPreventingSleep)
        return;
    const platformImpl = getPlatformImpl();
    if (!platformImpl) {
        console.error('No platform implementation available');
        return;
    }
    try {
        const currentMode = sleepPreventionManager.getState().mode;
        // Handle system sleep prevention
        if (sleepPreventionManager.shouldPreventSystemSleep(currentMode)) {
            await platformImpl.preventSleep();
            sleepPreventionManager.setSystemSleepPrevention(true);
        }
        // Handle activity simulation
        if (sleepPreventionManager.shouldSimulateActivity(currentMode)) {
            await startActivitySimulation();
        }
        isPreventingSleep = true;
        // Update both tray and taskbar icons
        (0, icon_manager_improved_1.updateAppIcons)(mainWindow, tray, true);
        // Force Windows taskbar icon update
        if (process.platform === 'win32' && mainWindow) {
            // First apply the regular update
            const appIcon = (0, icon_manager_improved_1.createAppIcon)(true);
            mainWindow.setIcon(appIcon);
            // Then force a taskbar refresh using multiple techniques
            setTimeout(async () => {
                await forceTaskbarIconUpdate(mainWindow, true);
            }, 100);
        }
        console.log(`Sleep prevention enabled on ${process.platform} (mode: ${currentMode})`);
    }
    catch (error) {
        console.error('Error preventing sleep:', error);
    }
};
const allowSleep = async () => {
    if (!isPreventingSleep)
        return;
    const platformImpl = getPlatformImpl();
    if (!platformImpl)
        return;
    try {
        // Stop activity simulation
        await stopActivitySimulation();
        // Handle system sleep prevention
        if (sleepPreventionManager.getState().systemSleepPrevention) {
            await platformImpl.allowSleep();
            sleepPreventionManager.setSystemSleepPrevention(false);
        }
        isPreventingSleep = false;
        // Update both tray and taskbar icons
        (0, icon_manager_improved_1.updateAppIcons)(mainWindow, tray, false);
        // Force Windows taskbar icon update
        if (process.platform === 'win32' && mainWindow) {
            // First apply the regular update
            const appIcon = (0, icon_manager_improved_1.createAppIcon)(false);
            mainWindow.setIcon(appIcon);
            // Then force a taskbar refresh using multiple techniques
            setTimeout(async () => {
                await forceTaskbarIconUpdate(mainWindow, false);
            }, 100);
        }
        console.log(`Sleep prevention disabled on ${process.platform}`);
    }
    catch (error) {
        console.error('Error allowing sleep:', error);
    }
};
/**
 * Creates a system tray icon with menu
 */
function createTray() {
    // Don't create a tray if it already exists
    if (tray !== null)
        return;
    console.log('Creating system tray icon...');
    try {
        // Find the icon file using a similar approach as the test script
        const possibleIcons = [
            path.join(electron_1.app.getAppPath(), 'build', 'icons', 'win', isPreventingSleep ? 'eye-active.ico' : 'eye-inactive.ico'),
            path.join(electron_1.app.getAppPath(), 'build', isPreventingSleep ? 'eye-active.ico' : 'eye-inactive.ico'),
            path.join(electron_1.app.getAppPath(), 'app.ico'),
            path.join(electron_1.app.getAppPath(), 'build', 'icon.ico'),
            path.join(electron_1.app.getAppPath(), 'public', isPreventingSleep ? 'eye-active.svg' : 'eye-inactive.svg')
        ];
        // Find the first existing icon
        let iconPath = null;
        for (const p of possibleIcons) {
            try {
                if (fs.existsSync(p)) {
                    iconPath = p;
                    console.log(`Found tray icon at: ${iconPath}`);
                    break;
                }
            }
            catch (err) {
                console.error(`Error checking icon path: ${p}`, err);
            }
        }
        // Create icon and tray
        let icon;
        if (iconPath) {
            icon = electron_1.nativeImage.createFromPath(iconPath);
            console.log(`Created tray icon from: ${iconPath}`);
        }
        else {
            // Fallback to the icon manager
            icon = (0, icon_manager_improved_1.createTrayIcon)(isPreventingSleep);
            console.log('Used icon manager to create tray icon');
        }
        // Create the tray with the icon
        tray = new electron_1.Tray(icon);
        tray.setToolTip('NoDoze - Keep Your Computer Awake');
        console.log('System tray icon created successfully');
        // Update the context menu
        updateTrayMenu();
        // Show/hide window on tray click
        tray.on('click', () => {
            if (mainWindow?.isVisible()) {
                mainWindow.hide();
            }
            else {
                mainWindow?.show();
            }
        });
        // Log platform specific info to help with debugging
        console.log(`Platform: ${process.platform}`);
        console.log(`Electron version: ${process.versions.electron}`);
        // Help user find the tray icon in the notification area
        setTimeout(() => {
            if (mainWindow && process.platform === 'win32') {
                mainWindow.webContents.executeJavaScript(`
          if (!document.getElementById('tray-icon-alert')) {
            const alert = document.createElement('div');
            alert.id = 'tray-icon-alert';
            alert.style = 'position:fixed;bottom:20px;right:20px;background:#f0f7ff;border:1px solid #0078d4;padding:15px;border-radius:5px;box-shadow:0 2px 8px rgba(0,0,0,0.1);z-index:9999;';
            alert.innerHTML = '<h3 style="margin-top:0;color:#0078d4;">NoDoze Running in System Tray</h3><p>Look for the eye icon in your system tray (notification area).</p><p>Click on the up-arrow (^) in the taskbar if you don\'t see it.</p><button id="close-alert" style="padding:5px 10px;">Got it</button>';
            document.body.appendChild(alert);
            document.getElementById('close-alert').onclick = function() { document.getElementById('tray-icon-alert').style.display = 'none'; };
          }
        `).catch(err => console.error('Error showing tray notification:', err));
            }
        }, 2000);
        return true;
    }
    catch (error) {
        console.error('Failed to create system tray icon:', error);
        return false;
    }
}
/**
 * Updates the tray context menu with the current state
 */
function updateTrayMenu() {
    if (!tray)
        return;
    // Update both tray and app icons based on current state
    (0, icon_manager_improved_1.updateAppIcons)(mainWindow, tray, isPreventingSleep);
    const state = sleepPreventionManager.getState();
    const contextMenu = electron_1.Menu.buildFromTemplate([
        {
            label: 'Open NoDoze',
            click: () => { mainWindow?.show(); }
        },
        {
            type: 'separator'
        },
        {
            label: 'Prevent Sleep',
            type: 'checkbox',
            checked: isPreventingSleep,
            click: async (menuItem) => {
                if (menuItem.checked) {
                    await preventSleep();
                }
                else {
                    await allowSleep();
                }
                updateTrayMenu();
                mainWindow?.webContents.send('sleep-status-changed', isPreventingSleep);
            }
        },
        {
            label: 'Sleep Prevention Mode',
            submenu: [
                {
                    label: 'Basic (Sleep only)',
                    type: 'radio',
                    checked: state.mode === SleepPreventionManager_1.SleepPreventionMode.BASIC,
                    click: async () => {
                        await changeSleepPreventionMode(SleepPreventionManager_1.SleepPreventionMode.BASIC);
                    }
                },
                {
                    label: 'Full (Sleep + Activity)',
                    type: 'radio',
                    checked: state.mode === SleepPreventionManager_1.SleepPreventionMode.FULL,
                    click: async () => {
                        await changeSleepPreventionMode(SleepPreventionManager_1.SleepPreventionMode.FULL);
                    }
                },
                {
                    label: 'Activity Only',
                    type: 'radio',
                    checked: state.mode === SleepPreventionManager_1.SleepPreventionMode.ACTIVITY_ONLY,
                    click: async () => {
                        await changeSleepPreventionMode(SleepPreventionManager_1.SleepPreventionMode.ACTIVITY_ONLY);
                    }
                },
                {
                    type: 'separator'
                },
                {
                    label: `Current: ${sleepPreventionManager.getModeDisplayName(state.mode)}`,
                    enabled: false
                }
            ]
        },
        {
            type: 'separator'
        },
        {
            label: 'Quick Timer',
            submenu: [
                {
                    label: '15 Minutes',
                    click: async () => {
                        await preventSleep();
                        updateTrayMenu();
                        mainWindow?.webContents.send('sleep-status-changed', isPreventingSleep);
                        mainWindow?.webContents.send('set-quick-timer', 15);
                        // Set a timeout to disable sleep prevention
                        setTimeout(async () => {
                            await allowSleep();
                            updateTrayMenu();
                            mainWindow?.webContents.send('sleep-status-changed', isPreventingSleep);
                        }, 15 * 60 * 1000);
                    }
                },
                {
                    label: '30 Minutes',
                    click: async () => {
                        await preventSleep();
                        updateTrayMenu();
                        mainWindow?.webContents.send('sleep-status-changed', isPreventingSleep);
                        mainWindow?.webContents.send('set-quick-timer', 30);
                        setTimeout(async () => {
                            await allowSleep();
                            updateTrayMenu();
                            mainWindow?.webContents.send('sleep-status-changed', isPreventingSleep);
                        }, 30 * 60 * 1000);
                    }
                },
                {
                    label: '1 Hour',
                    click: async () => {
                        await preventSleep();
                        updateTrayMenu();
                        mainWindow?.webContents.send('sleep-status-changed', isPreventingSleep);
                        mainWindow?.webContents.send('set-quick-timer', 60);
                        setTimeout(async () => {
                            await allowSleep();
                            updateTrayMenu();
                            mainWindow?.webContents.send('sleep-status-changed', isPreventingSleep);
                        }, 60 * 60 * 1000);
                    }
                },
                {
                    label: '2 Hours',
                    click: async () => {
                        await preventSleep();
                        updateTrayMenu();
                        mainWindow?.webContents.send('sleep-status-changed', isPreventingSleep);
                        mainWindow?.webContents.send('set-quick-timer', 120);
                        setTimeout(async () => {
                            await allowSleep();
                            updateTrayMenu();
                            mainWindow?.webContents.send('sleep-status-changed', isPreventingSleep);
                        }, 120 * 60 * 1000);
                    }
                }
            ]
        },
        {
            type: 'separator'
        },
        {
            label: 'Launch at Startup',
            type: 'checkbox',
            checked: electron_1.app.getLoginItemSettings().openAtLogin,
            click: (menuItem) => {
                electron_1.app.setLoginItemSettings({
                    openAtLogin: menuItem.checked,
                    openAsHidden: menuItem.checked // Start minimized in tray
                });
            }
        },
        {
            type: 'separator'
        },
        {
            label: 'Quit',
            click: async () => {
                await allowSleep();
                electron_1.app.quit();
            }
        }
    ]);
    tray.setContextMenu(contextMenu);
    // Update tray tooltip based on sleep prevention state
    tray.setToolTip(`NoDoze - ${isPreventingSleep ? 'Sleep Prevention Active' : 'Idle'}`);
}
function createWindow() {
    console.log('Creating main window with improved icon management');
    // Get appropriate app icon using our improved icon manager with eye icons
    const appIcon = (0, icon_manager_improved_1.createAppIcon)(isPreventingSleep);
    // Create the browser window with the icon
    mainWindow = new electron_1.BrowserWindow({
        width: 380,
        height: 450,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
        icon: appIcon, // Set the icon directly using our improved icon manager with eye icons
        frame: false, // Remove default window frame
        resizable: false,
        transparent: false,
        hasShadow: true,
    });
    // Set the title
    mainWindow.setTitle('NoDoze');
    // Apply Windows-specific taskbar icon fixes
    if (process.platform === 'win32') {
        // Direct approach for Windows taskbar icon
        try {
            // Try several icon paths in order of preference, prioritizing eye icons
            const iconPaths = [
                path.join(electron_1.app.getAppPath(), 'app.ico'), // This should be eye-active.ico (copied by setup-eye-icons.js)
                path.join(electron_1.app.getAppPath(), 'build', 'icons', 'win', 'eye-active.ico'),
                path.join(electron_1.app.getAppPath(), 'build', 'icons', 'win', 'eye-inactive.ico'),
                path.join(electron_1.app.getAppPath(), 'build', 'icons', 'win', 'icon.ico'),
                path.join(electron_1.app.getAppPath(), 'public', 'icon.png')
            ];
            // Find the first icon that exists
            let foundIcon = null;
            for (const iconPath of iconPaths) {
                if (fs.existsSync(iconPath)) {
                    console.log(`Found icon at: ${iconPath}`);
                    foundIcon = iconPath;
                    break;
                }
            }
            if (foundIcon) {
                const icon = electron_1.nativeImage.createFromPath(foundIcon);
                if (!icon.isEmpty()) {
                    mainWindow.setIcon(icon);
                    console.log('Set Windows taskbar icon directly from file');
                }
            }
            // Set AppUserModelId for proper taskbar grouping
            electron_1.app.setAppUserModelId('com.nodoze.app');
            // Also use our improved taskbar icon fix utility
            (0, windows_taskbar_icon_fix_improved_1.fixWindowsTaskbarIcon)(mainWindow).then(success => {
                if (success) {
                    console.log('Applied Windows taskbar icon fixes successfully');
                }
                else {
                    console.warn('Windows taskbar icon fixes did not fully succeed');
                }
            });
        }
        catch (error) {
            console.error('Error setting direct Windows taskbar icon:', error);
        }
    }
    // Update both taskbar and tray icons based on current state
    (0, icon_manager_improved_1.updateAppIcons)(mainWindow, tray, isPreventingSleep);
    console.log('Window title and icon set for NoDoze');
    // Load the index.html file
    const indexPath = electron_1.app.isPackaged
        ? path.join(__dirname, 'index.html')
        : path.join(__dirname, '../dist/index.html');
    console.log('Loading index.html from:', indexPath);
    // In development mode, use a file URL with query param to avoid caching
    if ( true && mainWindow) {
        const fileUrl = `file://${indexPath}?time=${new Date().getTime()}`;
        mainWindow.loadURL(fileUrl).then(() => {
            console.log('Successfully loaded index.html (dev mode)');
        }).catch((error) => {
            console.error('Failed to load index.html (dev mode):', error);
            showErrorInWindow(error);
        });
    }
    else if (mainWindow) {
        mainWindow.loadFile(indexPath).then(() => {
            console.log('Successfully loaded index.html');
        }).catch((error) => {
            console.error('Failed to load index.html:', error);
            showErrorInWindow(error);
        });
    }
    // Open DevTools for debugging in development mode
    if (!electron_1.app.isPackaged && mainWindow) {
        mainWindow.webContents.openDevTools({ mode: 'detach' });
        console.log('DevTools opened');
    }
    // Handle window close event - hide instead of close
    if (mainWindow) {
        mainWindow.on('close', (event) => {
            if (!isAppQuitting) {
                event.preventDefault();
                mainWindow?.hide();
                return false;
            }
            return true;
        });
    }
}
/**
 * Initialize the sleep prevention system
 */
function initializeSleepPreventionSystem() {
    console.log('Initializing sleep prevention system...');
    // Initialize settings manager
    settingsManager = new SettingsManager_1.SettingsManager();
    // Debug settings file
    debugSettingsFile();
    // Create sleep prevention manager with settings
    const config = settingsManager.getSleepPreventionConfig();
    sleepPreventionManager = new SleepPreventionManager_1.SleepPreventionManager(config);
    // Add state change listener
    sleepPreventionManager.addListener((state) => {
        console.log('Sleep prevention state changed:', state);
        // Save the current mode to settings
        settingsManager.setSleepPreventionMode(state.mode);
        // Notify renderer process
        if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.webContents.send('sleep-state-changed', state);
        }
        // Update tray menu
        updateTrayMenu();
    });
    console.log('Sleep prevention system initialized with saved settings');
}
/**
 * Debug utility to log settings file info
 */
function debugSettingsFile() {
    try {
        const settingsPath = settingsManager.getSettingsPath();
        console.log('=== DEBUG SETTINGS INFO ===');
        console.log(`Settings file location: ${settingsPath}`);
        if (fs.existsSync(settingsPath)) {
            const settingsContent = fs.readFileSync(settingsPath, 'utf8');
            console.log('Settings file content:');
            console.log(settingsContent);
            try {
                const parsedSettings = JSON.parse(settingsContent);
                console.log('Theme setting:', parsedSettings.ui?.theme || 'not set');
            }
            catch (parseError) {
                console.error('Error parsing settings file:', parseError);
            }
        }
        else {
            console.log('Settings file does not exist yet');
        }
        console.log('=========================');
    }
    catch (error) {
        console.error('Error debugging settings file:', error);
    }
}
/**
 * Start activity simulation
 */
async function startActivitySimulation() {
    if (activitySimulator && activitySimulator.getStatus().isRunning) {
        console.log('[NoDoze] startActivitySimulation: Already running');
        return;
    }
    try {
        console.log('[NoDoze] startActivitySimulation: Creating or starting simulator');
        // Create activity simulator if it doesn't exist
        if (!activitySimulator) {
            const config = sleepPreventionManager.getConfig();
            console.log('[NoDoze] startActivitySimulation: Creating new ActivitySimulator with config', config);
            activitySimulator = ActivitySimulatorFactory_1.ActivitySimulatorFactory.create({
                interval: config.activityInterval,
                activityType: config.activityType,
                debug: config.debug
            });
        }
        await activitySimulator.start();
        sleepPreventionManager.setActivitySimulation(true);
        console.log('[NoDoze] Activity simulation started');
    }
    catch (error) {
        console.error('[NoDoze] Error starting activity simulation:', error);
    }
}
/**
 * Stop activity simulation
 */
async function stopActivitySimulation() {
    if (!activitySimulator || !activitySimulator.getStatus().isRunning) {
        return;
    }
    try {
        activitySimulator.stop();
        sleepPreventionManager.setActivitySimulation(false);
        console.log('Activity simulation stopped');
    }
    catch (error) {
        console.error('Error stopping activity simulation:', error);
    }
}
/**
 * Change sleep prevention mode
 */
async function changeSleepPreventionMode(mode) {
    const previousMode = sleepPreventionManager.getState().mode;
    if (previousMode === mode) {
        console.log(`[NoDoze] changeSleepPreventionMode: Mode unchanged (${mode})`);
        return;
    }
    console.log(`[NoDoze] Changing sleep prevention mode from ${previousMode} to ${mode}`);
    console.log(`[NoDoze] shouldSimulateActivity:`, sleepPreventionManager.shouldSimulateActivity(mode));
    console.log(`[NoDoze] shouldPreventSystemSleep:`, sleepPreventionManager.shouldPreventSystemSleep(mode));
    // Always allow sleep and stop simulation before changing mode
    if (isPreventingSleep) {
        await allowSleep();
    }
    sleepPreventionManager.setMode(mode);
    // After changing mode, start activity simulation if needed
    if (sleepPreventionManager.shouldSimulateActivity(mode)) {
        console.log('[NoDoze] changeSleepPreventionMode: Starting activity simulation');
        await startActivitySimulation();
    }
    // If the new mode also prevents system sleep, start that as well
    if (sleepPreventionManager.shouldPreventSystemSleep(mode)) {
        console.log('[NoDoze] changeSleepPreventionMode: Preventing system sleep');
        await preventSleep();
    }
}
/**
 * Get activity simulator capabilities
 */
async function getActivitySimulatorCapabilities() {
    try {
        const capabilities = await ActivitySimulatorFactory_1.ActivitySimulatorFactory.getPlatformCapabilities();
        return capabilities;
    }
    catch (error) {
        console.error('Error getting activity simulator capabilities:', error);
        return null;
    }
}
// Initialize platform-specific implementations
const initializePlatform = () => {
    const platformImpl = getPlatformImpl();
    if (platformImpl) {
        try {
            platformImpl.initialize();
            console.log(`Platform ${process.platform} initialized`);
        }
        catch (error) {
            console.error('Error initializing platform:', error);
        }
    }
};
/**
 * Helper function to show errors in the window
 */
function showErrorInWindow(error) {
    if (mainWindow) {
        mainWindow.webContents.executeJavaScript(`
      document.body.innerHTML = '<div style="padding: 20px; font-family: Arial, sans-serif;">
        <h2>Failed to load application</h2>
        <p>${error.toString()}</p>
        <p>Please check the console for more details.</p>
      </div>';
    `);
    }
}
// Helper function to debug icon paths and errors
function debugIconPath(iconPath) {
    try {
        if (fs.existsSync(iconPath)) {
            const stats = fs.statSync(iconPath);
            console.log(`Icon file exists: ${iconPath}`);
            console.log(`  - Size: ${stats.size} bytes`);
            console.log(`  - Created: ${stats.birthtime}`);
            console.log(`  - Modified: ${stats.mtime}`);
            return true;
        }
        else {
            console.error(`Icon file does not exist: ${iconPath}`);
            // Try to list files in the directory
            try {
                const dir = path.dirname(iconPath);
                if (fs.existsSync(dir)) {
                    const files = fs.readdirSync(dir);
                    console.log(`Files in directory ${dir}:`);
                    files.forEach((file) => console.log(`  - ${file}`));
                }
                else {
                    console.error(`Directory does not exist: ${dir}`);
                }
            }
            catch (dirError) {
                console.error(`Error listing directory:`, dirError);
            }
            return false;
        }
    }
    catch (error) {
        console.error(`Error checking icon path ${iconPath}:`, error);
        return false;
    }
}
/**
 * Show a notification to help users find the tray icon
 */
function showTrayIconNotification() {
    if (process.platform === 'win32' && mainWindow) {
        try {
            const notification = new electron_1.Notification({
                title: 'NoDoze System Tray Icon',
                body: 'NoDoze is running in the system tray. Look for the eye icon in the notification area.',
                icon: (0, icon_manager_improved_1.createAppIcon)(isPreventingSleep)
            });
            notification.show();
            console.log('Showed notification about tray icon location');
            // When clicked, show the main window
            notification.on('click', () => {
                if (mainWindow) {
                    mainWindow.show();
                }
            });
        }
        catch (err) {
            console.error('Failed to show tray icon notification:', err);
        }
    }
}
// This method will be called when Electron has finished initialization
electron_1.app.whenReady().then(async () => {
    // Extract icons from asar and copy them to accessible locations (production only)
    await extractAndCopyIcons();
    // Ensure icon files are available in production environment
    await ensureIconsAvailable();
    initializePlatform();
    createWindow();
    createTray();
    // Show notification to help users find the tray icon
    setTimeout(() => {
        showTrayIconNotification();
    }, 2000);
    // Apply our special Windows taskbar icon fix
    if (process.platform === 'win32' && mainWindow) {
        // Ensure icons are ready
        if (electron_1.app.isPackaged) {
            console.log('Production build detected - applying extra icon setup for Windows');
            // Wait longer in production to ensure icons are properly extracted
            setTimeout(async () => {
                // Apply both icon utilities
                await extractAndCopyIcons();
                await ensureIconsAvailable();
                // Force icon update with aggressive techniques
                await forceTaskbarIconUpdate(mainWindow, isPreventingSleep);
            }, 1000);
        }
        (0, windows_taskbar_icon_fix_improved_1.fixWindowsTaskbarIcon)(mainWindow);
        console.log('Applied Windows-specific taskbar icon fix');
    }
    electron_1.app.on('activate', function () {
        // On macOS it's common to re-create a window when the dock icon is clicked
        if (electron_1.BrowserWindow.getAllWindows().length === 0)
            createWindow();
    });
});
// Quit when all windows are closed, except on macOS
electron_1.app.on('window-all-closed', function () {
    if (process.platform !== 'darwin')
        electron_1.app.quit();
});
// IPC handlers for renderer process communication
electron_1.ipcMain.on('toggle-sleep-prevention', async (_, shouldPrevent) => {
    if (shouldPrevent) {
        await preventSleep();
    }
    else {
        await allowSleep();
    }
    // Update the tray menu with the new state
    updateTrayMenu();
    // Notify renderer of status change
    mainWindow?.webContents.send('sleep-status-changed', isPreventingSleep);
});
electron_1.ipcMain.handle('get-sleep-status', () => {
    return isPreventingSleep;
});
// Handle window control events
electron_1.ipcMain.on('window-minimize', () => {
    if (mainWindow) {
        mainWindow.minimize();
    }
});
electron_1.ipcMain.on('window-corner', () => {
    if (mainWindow) {
        try {
            // Get display where the window is currently located
            const windowBounds = mainWindow.getBounds();
            const currentDisplay = electron_1.screen.getDisplayNearestPoint({
                x: windowBounds.x + windowBounds.width / 2,
                y: windowBounds.y + windowBounds.height / 2
            });
            // Get the work area (screen size minus taskbar/dock)
            const { workArea } = currentDisplay;
            const windowSize = mainWindow.getSize();
            // Calculate position to place window in lower right corner with a small margin
            const margin = 20;
            const xPosition = workArea.x + workArea.width - windowSize[0] - margin;
            const yPosition = workArea.y + workArea.height - windowSize[1] - margin;
            // Store current position for potential future toggle
            // (We don't use this yet, but could be useful for adding a toggle feature later)
            const currentPosition = mainWindow.getPosition();
            // Ensure the window is visible and not minimized
            if (mainWindow.isMinimized()) {
                mainWindow.restore();
            }
            if (!mainWindow.isVisible()) {
                mainWindow.show();
            }
            // Move the window to the lower right corner with animated effect
            // by moving it in small increments
            const animateWindow = (fromX, fromY, toX, toY, steps = 15) => {
                const stepX = (toX - fromX) / steps;
                const stepY = (toY - fromY) / steps;
                let currentStep = 0;
                const moveStep = () => {
                    if (currentStep <= steps && mainWindow) {
                        const nextX = Math.round(fromX + stepX * currentStep);
                        const nextY = Math.round(fromY + stepY * currentStep);
                        mainWindow.setPosition(nextX, nextY, true);
                        currentStep++;
                        setTimeout(moveStep, 10);
                    }
                };
                moveStep();
            };
            const [currentX, currentY] = mainWindow.getPosition();
            animateWindow(currentX, currentY, xPosition, yPosition);
            console.log(`Moving window to corner position: (${xPosition}, ${yPosition})`);
        }
        catch (error) {
            console.error('Error moving window to corner:', error);
            // Fallback to simpler positioning if the animated approach fails
            try {
                const { workAreaSize } = electron_1.screen.getPrimaryDisplay();
                const windowSize = mainWindow.getSize();
                mainWindow.setPosition(workAreaSize.width - windowSize[0] - 10, workAreaSize.height - windowSize[1] - 10);
            }
            catch (fallbackError) {
                console.error('Fallback positioning also failed:', fallbackError);
            }
        }
    }
});
electron_1.ipcMain.on('window-close', () => {
    if (mainWindow) {
        // Don't actually quit the app, just hide the window
        mainWindow.hide();
    }
});
// Clean up before quitting
electron_1.app.on('before-quit', async () => {
    // Mark the app as quitting to allow window close
    isAppQuitting = true;
    await allowSleep();
    // Stop activity simulation
    if (activitySimulator) {
        try {
            activitySimulator.stop();
        }
        catch (error) {
            console.error('Error stopping activity simulation:', error);
        }
    }
    // Clean up platform-specific resources
    const platformImpl = getPlatformImpl();
    if (platformImpl && platformImpl.cleanup) {
        try {
            await platformImpl.cleanup();
        }
        catch (error) {
            console.error('Error during platform cleanup:', error);
        }
    }
    // Destroy the tray icon
    if (tray) {
        tray.destroy();
        tray = null;
    }
});
// Initialize the sleep prevention system
initializeSleepPreventionSystem();
debugSettingsFile();
// Handle sleep prevention mode changes
electron_1.ipcMain.handle('set-sleep-prevention-mode', async (event, mode) => {
    try {
        await changeSleepPreventionMode(mode);
        return { success: true };
    }
    catch (error) {
        console.error('Error setting sleep prevention mode:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
});
electron_1.ipcMain.handle('get-sleep-prevention-state', () => {
    return sleepPreventionManager.getState();
});
electron_1.ipcMain.handle('get-activity-simulator-capabilities', async () => {
    return await getActivitySimulatorCapabilities();
});
// Handle activity simulation controls
electron_1.ipcMain.handle('start-activity-simulation', async () => {
    try {
        await startActivitySimulation();
        return { success: true };
    }
    catch (error) {
        console.error('Error starting activity simulation:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
});
electron_1.ipcMain.handle('stop-activity-simulation', async () => {
    try {
        await stopActivitySimulation();
        return { success: true };
    }
    catch (error) {
        console.error('Error stopping activity simulation:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
});
// Handle configuration updates
electron_1.ipcMain.handle('update-sleep-prevention-config', async (event, config) => {
    try {
        sleepPreventionManager.updateConfig(config);
        // If activity simulator is running, update its configuration
        if (activitySimulator && activitySimulator.getStatus().isRunning) {
            activitySimulator.setInterval(config.activityInterval || 30000);
            activitySimulator.setActivityType(config.activityType || 'both');
        }
        return { success: true };
    }
    catch (error) {
        console.error('Error updating sleep prevention config:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
});
// Handle settings management
electron_1.ipcMain.handle('get-settings', () => {
    return settingsManager.getSettings();
});
electron_1.ipcMain.handle('update-settings', async (event, settings) => {
    try {
        // Update specific settings
        if (settings.sleepPreventionMode) {
            settingsManager.setSleepPreventionMode(settings.sleepPreventionMode);
        }
        if (settings.activitySimulation) {
            settingsManager.setActivitySimulationSettings(settings.activitySimulation);
        }
        if (settings.ui) {
            settingsManager.setUISettings(settings.ui);
        }
        return { success: true };
    }
    catch (error) {
        console.error('Error updating settings:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
});
electron_1.ipcMain.handle('reset-settings', () => {
    try {
        settingsManager.resetSettings();
        return { success: true };
    }
    catch (error) {
        console.error('Error resetting settings:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
});
electron_1.ipcMain.handle('export-settings', () => {
    return settingsManager.exportSettings();
});
electron_1.ipcMain.handle('import-settings', (event, jsonString) => {
    try {
        const success = settingsManager.importSettings(jsonString);
        return { success };
    }
    catch (error) {
        console.error('Error importing settings:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
});
// Handle theme preference operations
electron_1.ipcMain.handle('get-theme-preference', () => {
    console.log('Main: get-theme-preference IPC handler called');
    try {
        const theme = settingsManager.getTheme();
        console.log(`Main: Current theme preference: ${theme}`);
        return theme;
    }
    catch (error) {
        console.error('Main: Error getting theme preference:', error);
        return 'light'; // Default to light theme on error
    }
});
electron_1.ipcMain.handle('set-theme-preference', (_, theme) => {
    console.log(`Main: set-theme-preference IPC handler called with theme: ${theme}`);
    try {
        settingsManager.setTheme(theme);
        console.log(`Main: Theme preference set to: ${theme}`);
        return { success: true };
    }
    catch (error) {
        console.error('Main: Error setting theme preference:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
});
// Application icon state management
// Note: In production builds, the taskbar icon may not update correctly despite our efforts
// This is a known limitation due to Windows' aggressive icon caching and Electron packaging
// The system tray icon works reliably and serves as the primary visual indicator of app state


/***/ }),

/***/ "./src/main/platforms/linux.ts":
/*!*************************************!*\
  !*** ./src/main/platforms/linux.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.cleanup = exports.allowSleep = exports.preventSleep = exports.initialize = void 0;
/**
 * Linux platform-specific implementation for NoDoze
 * Uses a combination of dbus and xdg-screensaver commands to prevent sleep
 */
const child_process_1 = __webpack_require__(/*! child_process */ "child_process");
let inhibitCookie = null;
let screenSaverProcess = null;
/**
 * Initialize Linux sleep prevention systems
 */
const initialize = () => {
    // Nothing specific to initialize for Linux
    return true;
};
exports.initialize = initialize;
/**
 * Run a command and return its output
 */
const executeCommand = (command) => {
    return new Promise((resolve, reject) => {
        (0, child_process_1.exec)(command, (error, stdout, stderr) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(stdout.trim());
        });
    });
};
/**
 * Prevent the system from sleeping using D-Bus and xdg-screensaver
 */
const preventSleep = async () => {
    if (inhibitCookie || screenSaverProcess) {
        return true; // Already preventing sleep
    }
    try {
        // Try using dbus-send to inhibit sleep via org.freedesktop.PowerManagement
        try {
            const result = await executeCommand('dbus-send --system --print-reply --dest="org.freedesktop.login1" ' +
                '/org/freedesktop/login1 org.freedesktop.login1.Manager.Inhibit ' +
                'string:"sleep" string:"NoDoze" string:"Preventing system sleep" ' +
                'string:"block"');
            // Extract the inhibit cookie from dbus reply
            const match = result.match(/uint32 (\d+)/);
            if (match && match[1]) {
                inhibitCookie = match[1];
                console.log(`Linux sleep inhibitor enabled (cookie: ${inhibitCookie})`);
            }
        }
        catch (dbusError) {
            console.warn('Failed to inhibit sleep via dbus:', dbusError);
        }
        // Also use xdg-screensaver to prevent screen blanking
        // This is a fallback method which works on most desktop environments
        screenSaverProcess = (0, child_process_1.spawn)('xdg-screensaver', ['suspend', 'nodoze']);
        screenSaverProcess.on('error', (err) => {
            console.error('xdg-screensaver error:', err);
            screenSaverProcess = null;
        });
        console.log('Linux sleep prevention enabled');
        return true;
    }
    catch (error) {
        console.error('Failed to prevent sleep on Linux:', error);
        return false;
    }
};
exports.preventSleep = preventSleep;
/**
 * Allow the system to sleep normally
 */
const allowSleep = async () => {
    try {
        // Release D-Bus inhibitor if we have one
        if (inhibitCookie) {
            try {
                await executeCommand('dbus-send --system --print-reply --dest="org.freedesktop.login1" ' +
                    `/org/freedesktop/login1 org.freedesktop.login1.Manager.UnInhibit ` +
                    `uint32:${inhibitCookie}`);
            }
            catch (dbusError) {
                console.warn('Failed to uninhibit via dbus:', dbusError);
            }
            inhibitCookie = null;
        }
        // Kill the screensaver process if it's running
        if (screenSaverProcess) {
            screenSaverProcess.kill();
            screenSaverProcess = null;
            // Also run xdg-screensaver resume to be sure
            try {
                await executeCommand('xdg-screensaver resume nodoze');
            }
            catch (error) {
                console.warn('xdg-screensaver resume warning:', error);
            }
        }
        console.log('Linux sleep prevention disabled');
        return true;
    }
    catch (error) {
        console.error('Failed to restore sleep settings on Linux:', error);
        return false;
    }
};
exports.allowSleep = allowSleep;
/**
 * Clean up resources
 */
const cleanup = async () => {
    try {
        await (0, exports.allowSleep)();
    }
    catch (error) {
        console.error('Error during Linux cleanup:', error);
    }
    inhibitCookie = null;
    if (screenSaverProcess) {
        screenSaverProcess.kill();
        screenSaverProcess = null;
    }
};
exports.cleanup = cleanup;


/***/ }),

/***/ "./src/main/platforms/macos.ts":
/*!*************************************!*\
  !*** ./src/main/platforms/macos.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.cleanup = exports.allowSleep = exports.preventSleep = exports.initialize = void 0;
/**
 * macOS platform-specific implementation for NoDoze
 * Uses IOKit power assertions to prevent sleep
 */
const child_process_1 = __webpack_require__(/*! child_process */ "child_process");
let assertionId = null;
/**
 * Initialize macOS sleep prevention
 */
const initialize = () => {
    // Nothing specific to initialize for macOS
    return true;
};
exports.initialize = initialize;
/**
 * Helper function to execute macOS caffeinate command
 */
const executeCaffeinate = (args) => {
    return new Promise((resolve, reject) => {
        (0, child_process_1.exec)(`caffeinate ${args}`, (error, stdout, stderr) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(stdout.trim());
        });
    });
};
/**
 * Prevent the system from sleeping
 * Uses the built-in caffeinate command on macOS
 */
const preventSleep = async () => {
    if (assertionId) {
        return true; // Already preventing sleep
    }
    try {
        // Start caffeinate in background mode to prevent display and system sleep
        // -d prevents display sleep, -i prevents idle sleep
        assertionId = await executeCaffeinate('-d -i &');
        console.log(`Sleep prevention enabled on macOS (PID: ${assertionId})`);
        return true;
    }
    catch (error) {
        console.error('Failed to prevent sleep on macOS:', error);
        return false;
    }
};
exports.preventSleep = preventSleep;
/**
 * Allow the system to sleep normally
 * Terminates the caffeinate process
 */
const allowSleep = async () => {
    if (!assertionId) {
        return true; // Nothing to restore
    }
    try {
        // Kill the caffeinate process
        await executeCaffeinate(`kill ${assertionId}`);
        console.log('Sleep prevention disabled on macOS');
        assertionId = null;
        return true;
    }
    catch (error) {
        console.error('Failed to restore sleep settings on macOS:', error);
        return false;
    }
};
exports.allowSleep = allowSleep;
/**
 * Clean up resources
 */
const cleanup = async () => {
    if (assertionId) {
        try {
            await (0, exports.allowSleep)();
        }
        catch (error) {
            console.error('Error during macOS cleanup:', error);
        }
        assertionId = null;
    }
};
exports.cleanup = cleanup;


/***/ }),

/***/ "./src/main/platforms/windows.ts":
/*!***************************************!*\
  !*** ./src/main/platforms/windows.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getPowerStatus = exports.getLastActivityTime = exports.isPreventingDisplaySleep = exports.getInterval = exports.isPreventingSleep = exports.cleanup = exports.allowSleep = exports.preventSleep = exports.initialize = void 0;
/**
 * Windows platform-specific implementation for NoDoze
 * Uses Electron's built-in powerSaveBlocker API to prevent sleep
 */
const child_process_1 = __webpack_require__(/*! child_process */ "child_process");
const electron_1 = __webpack_require__(/*! electron */ "electron");
// Track state
let intervalSeconds = 59; // Default interval
let isActive = false;
let lastActivityTime = null;
let preventDisplaySleep = true; // Default to also prevent display sleep
let statusLogTimer = null;
// Track blockers
let displayBlockerId = -1;
let systemBlockerId = -1;
/**
 * Initialize Windows sleep prevention
 */
const initialize = () => {
    // Nothing specific to initialize for Windows
    return true;
};
exports.initialize = initialize;
/**
 * Prevent the system from going to sleep
 * Uses Electron's powerSaveBlocker API
 * @param seconds Optional parameter to set the interval in seconds (default: 59)
 * @param keepDisplayOn Optional parameter to also keep the display on (default: true)
 */
const preventSleep = async (seconds = 59, keepDisplayOn = true) => {
    try {
        // Kill any existing process first
        await (0, exports.allowSleep)();
        // Store the settings
        intervalSeconds = seconds;
        preventDisplaySleep = keepDisplayOn;
        // Start system sleep prevention
        systemBlockerId = electron_1.powerSaveBlocker.start('prevent-app-suspension');
        // Also prevent display sleep if requested
        if (keepDisplayOn) {
            displayBlockerId = electron_1.powerSaveBlocker.start('prevent-display-sleep');
        }
        // Create a timer to log status periodically (actual prevention is handled by powerSaveBlocker)
        statusLogTimer = setInterval(() => {
            console.log(`NoDoze: Keeping system awake at ${new Date().toISOString()}`);
        }, seconds * 1000);
        // Track activity status and time
        isActive = true;
        lastActivityTime = new Date();
        return true;
    }
    catch (error) {
        console.error('Failed to prevent sleep:', error);
        isActive = false;
        return false;
    }
};
exports.preventSleep = preventSleep;
/**
 * Allow the system to go to sleep by stopping the sleep prevention
 */
const allowSleep = async () => {
    try {
        if (statusLogTimer) {
            clearInterval(statusLogTimer);
            statusLogTimer = null;
        }
        // Stop the power save blockers
        if (displayBlockerId !== -1 && electron_1.powerSaveBlocker.isStarted(displayBlockerId)) {
            electron_1.powerSaveBlocker.stop(displayBlockerId);
            displayBlockerId = -1;
        }
        if (systemBlockerId !== -1 && electron_1.powerSaveBlocker.isStarted(systemBlockerId)) {
            electron_1.powerSaveBlocker.stop(systemBlockerId);
            systemBlockerId = -1;
        }
        isActive = false;
        return true;
    }
    catch (error) {
        console.error('Failed to allow sleep:', error);
        return false;
    }
};
exports.allowSleep = allowSleep;
/**
 * Clean up resources before application exit
 */
const cleanup = async () => {
    return await (0, exports.allowSleep)();
};
exports.cleanup = cleanup;
/**
 * Check if sleep prevention is active
 */
const isPreventingSleep = () => {
    return isActive;
};
exports.isPreventingSleep = isPreventingSleep;
/**
 * Get the current interval setting in seconds
 */
const getInterval = () => {
    return intervalSeconds;
};
exports.getInterval = getInterval;
/**
 * Get whether display sleep is also being prevented
 */
const isPreventingDisplaySleep = () => {
    return preventDisplaySleep;
};
exports.isPreventingDisplaySleep = isPreventingDisplaySleep;
/**
 * Get the timestamp of the last activity
 */
const getLastActivityTime = () => {
    return lastActivityTime;
};
exports.getLastActivityTime = getLastActivityTime;
/**
 * Check the system's current power status
 * Returns information about battery/AC power and current power plan
 */
const getPowerStatus = async () => {
    return new Promise((resolve, reject) => {
        (0, child_process_1.exec)('powercfg /list', (error, stdout) => {
            if (error) {
                console.error('Error getting power status:', error);
                resolve({ onBattery: false, powerPlan: 'Unknown' });
                return;
            }
            // Get power plan info
            const activePlanMatch = stdout.match(/\* (.*?) \((.*?)\)/);
            const powerPlan = activePlanMatch ? activePlanMatch[1] : 'Unknown';
            // Check if system is on battery
            (0, child_process_1.exec)('WMIC Path Win32_Battery Get BatteryStatus', (err, output) => {
                // BatteryStatus = 1 means on battery, 2 means on AC power
                // If there's no battery or an error, assume AC power
                const onBattery = !err && output.includes('1');
                resolve({ onBattery, powerPlan });
            });
        });
    });
};
exports.getPowerStatus = getPowerStatus;


/***/ }),

/***/ "./src/main/windows-taskbar-icon-fix-improved.ts":
/*!*******************************************************!*\
  !*** ./src/main/windows-taskbar-icon-fix-improved.ts ***!
  \*******************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

/**
 * Enhanced Windows Taskbar Icon Fix
 *
 * This utility addresses the common issue where Electron apps show the default Electron icon
 * in the Windows taskbar even when custom icons are set.
 *
 * Enhanced version with:
 * - Improved icon detection
 * - More robust fallback mechanisms
 * - Better logging
 * - Cleaner code organization
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.fixWindowsTaskbarIcon = fixWindowsTaskbarIcon;
const electron_1 = __webpack_require__(/*! electron */ "electron");
const path = __importStar(__webpack_require__(/*! path */ "path"));
const fs = __importStar(__webpack_require__(/*! fs */ "fs"));
/**
 * Apply Windows-specific fixes to ensure the taskbar icon shows correctly
 * Call this after creating your BrowserWindow
 */
async function fixWindowsTaskbarIcon(window) {
    if (!window || process.platform !== 'win32') {
        return false;
    }
    console.log('Applying Windows taskbar icon fixes...');
    // Get the application's root directory
    const appPath = electron_1.app.getAppPath();
    console.log(`App base path for taskbar fix: ${appPath}`);
    // Define icon fixes in order of preference/effectiveness
    const iconFixes = [
        {
            name: 'multi-size-icons',
            execute: applyMultiSizeIcons,
            description: 'Apply multiple icon sizes to window'
        },
        {
            name: 'app-user-model-id',
            execute: setAppUserModelId,
            description: 'Set AppUserModelId for proper taskbar grouping'
        },
        {
            name: 'copy-icon-to-exe-dir',
            execute: copyIconToExeDir,
            description: 'Copy icon to app.exe directory for direct access'
        },
        {
            name: 'overlay-icon-refresh',
            execute: applyOverlayIconRefresh,
            description: 'Apply and clear overlay icons to refresh icon cache'
        }
    ];
    let overallSuccess = false;
    // Try each fix in sequence
    for (const fix of iconFixes) {
        try {
            console.log(`Applying taskbar icon fix: ${fix.name} - ${fix.description}`);
            const success = await fix.execute(window);
            if (success) {
                console.log(`Taskbar icon fix "${fix.name}" applied successfully`);
                overallSuccess = true;
            }
            else {
                console.warn(`Taskbar icon fix "${fix.name}" did not succeed`);
            }
        }
        catch (error) {
            console.error(`Error applying taskbar icon fix "${fix.name}":`, error);
        }
    }
    if (overallSuccess) {
        console.log('Windows taskbar icon fixes applied successfully');
    }
    else {
        console.warn('All Windows taskbar icon fixes failed');
    }
    return overallSuccess;
}
/**
 * Find a suitable icon file for the taskbar
 * Returns the path to the icon file or null if not found
 */
async function findSuitableIcon() {
    // Try all possible icon paths in order of preference
    let possibleIconPaths;
    if (electron_1.app.isPackaged) {
        // Paths for packaged app (production)
        possibleIconPaths = [
            // Check for eye icons first in win folder (our preferred icons)
            path.join(path.dirname(electron_1.app.getPath('exe')), 'resources', 'build', 'icons', 'win', 'eye-active.ico'),
            path.join(path.dirname(electron_1.app.getPath('exe')), 'resources', 'build', 'icons', 'win', 'eye-inactive.ico'),
            // Then check for eye icons in build folder
            path.join(path.dirname(electron_1.app.getPath('exe')), 'resources', 'build', 'eye-active.ico'),
            path.join(path.dirname(electron_1.app.getPath('exe')), 'resources', 'build', 'eye-inactive.ico'),
            // Try app.ico in root as it's a common location
            path.join(path.dirname(electron_1.app.getPath('exe')), 'app.ico'),
            // Check standard icon locations as fallbacks
            path.join(path.dirname(electron_1.app.getPath('exe')), 'resources', 'build', 'icons', 'win', 'icon.ico'),
            path.join(path.dirname(electron_1.app.getPath('exe')), 'resources', 'build', 'icon.ico'),
            // Try public folder for fallbacks
            path.join(path.dirname(electron_1.app.getPath('exe')), 'resources', 'public', 'eye-active.svg'),
            path.join(path.dirname(electron_1.app.getPath('exe')), 'resources', 'public', 'icon.png'),
            path.join(path.dirname(electron_1.app.getPath('exe')), 'resources', 'public', 'icon.svg'),
        ];
    }
    else {
        // Paths for development
        possibleIconPaths = [
            // Check for eye icons first in win folder (our preferred icons)
            path.join(electron_1.app.getAppPath(), 'build', 'icons', 'win', 'eye-active.ico'),
            path.join(electron_1.app.getAppPath(), 'build', 'icons', 'win', 'eye-inactive.ico'),
            // Then check for eye icons in build folder
            path.join(electron_1.app.getAppPath(), 'build', 'eye-active.ico'),
            path.join(electron_1.app.getAppPath(), 'build', 'eye-inactive.ico'),
            // Try app.ico in root as it's a common location
            path.join(electron_1.app.getAppPath(), 'app.ico'),
            // Then check standard icon locations as fallbacks
            path.join(electron_1.app.getAppPath(), 'build', 'icons', 'win', 'icon.ico'),
            path.join(electron_1.app.getAppPath(), 'build', 'icon.ico'),
            // Then try public folder
            path.join(electron_1.app.getAppPath(), 'public', 'eye-active.svg'),
            path.join(electron_1.app.getAppPath(), 'public', 'icon.png'),
            path.join(electron_1.app.getAppPath(), 'public', 'icon.svg'),
        ];
    }
    // Find the first icon that exists
    for (const iconPath of possibleIconPaths) {
        try {
            if (fs.existsSync(iconPath)) {
                console.log(`Found suitable icon at: ${iconPath}`);
                return iconPath;
            }
        }
        catch (e) {
            console.error(`Error checking icon path: ${iconPath}`, e);
        }
    }
    console.warn('Could not find any suitable icons for Windows taskbar');
    return null;
}
/**
 * Fix 1: Apply multiple icon sizes to the window
 * This helps Windows properly display the icon in different contexts
 */
async function applyMultiSizeIcons(window) {
    try {
        const iconPath = await findSuitableIcon();
        if (!iconPath)
            return false;
        console.log(`Applying multiple icon sizes from: ${iconPath}`);
        // For ICO files, Electron will automatically extract different sizes
        if (path.extname(iconPath).toLowerCase() === '.ico') {
            window.setIcon(iconPath);
            console.log('Set ICO icon with multiple sizes');
            return true;
        }
        // For other formats, we need to manually resize
        const sizes = [16, 24, 32, 48, 64, 128];
        let baseIcon = electron_1.nativeImage.createFromPath(iconPath);
        if (baseIcon.isEmpty()) {
            console.warn('Icon is empty, cannot resize');
            return false;
        }
        // Apply each size to the window
        for (const size of sizes) {
            try {
                const resizedIcon = baseIcon.resize({ width: size, height: size });
                window.setIcon(resizedIcon);
                console.log(`Applied ${size}x${size} icon to Windows taskbar`);
            }
            catch (err) {
                console.error(`Failed to resize icon to ${size}x${size}:`, err);
            }
        }
        return true;
    }
    catch (error) {
        console.error('Error applying multi-size icons:', error);
        return false;
    }
}
/**
 * Fix 2: Set AppUserModelId for proper taskbar grouping
 * This helps Windows associate the window with the correct application
 */
async function setAppUserModelId(window) {
    try {
        // Get application name from package.json or use default
        let appId = 'com.electron.nodozesleepprevention';
        try {
            const packageJsonPath = path.join(electron_1.app.getAppPath(), 'package.json');
            const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
            if (packageJson.name) {
                appId = packageJson.name.replace(/[^a-zA-Z0-9]/g, '.');
                if (packageJson.author) {
                    const author = typeof packageJson.author === 'string' ?
                        packageJson.author :
                        packageJson.author.name;
                    appId = `com.${author.replace(/[^a-zA-Z0-9]/g, '.')}.${appId}`;
                }
                else {
                    appId = `com.electron.${appId}`;
                }
            }
        }
        catch (e) {
            console.error('Error reading package.json:', e);
        }
        window.setAppDetails({ appId });
        console.log(`Set AppUserModelId to: ${appId}`);
        return true;
    }
    catch (error) {
        console.error('Error setting AppUserModelId:', error);
        return false;
    }
}
/**
 * Fix 3: Copy icon to app.exe directory for direct access
 * This is a known workaround for Windows taskbar icon issues
 */
async function copyIconToExeDir(window) {
    if (!electron_1.app.isPackaged) {
        console.log('Skipping copy-to-exe-dir fix in development mode');
        return false;
    }
    try {
        const iconPath = await findSuitableIcon();
        if (!iconPath)
            return false;
        // Copy the icon to the app.exe directory as app.ico
        // This is a known workaround for Windows taskbar icon issues
        const appExePath = electron_1.app.getPath('exe');
        const appExeDir = path.dirname(appExePath);
        const appIcoPath = path.join(appExeDir, 'app.ico');
        // Only copy if source and destination are different
        if (path.normalize(iconPath) !== path.normalize(appIcoPath)) {
            fs.copyFileSync(iconPath, appIcoPath);
            console.log(`Copied icon to ${appIcoPath} (Windows taskbar workaround)`);
            // Apply this icon to the window
            window.setIcon(appIcoPath);
            return true;
        }
        else {
            console.log('Icon is already in the exe directory, skipping copy');
            return false;
        }
    }
    catch (error) {
        console.error('Error copying icon to exe directory:', error);
        return false;
    }
}
/**
 * Fix 4: Apply and clear overlay icons to refresh icon cache
 * Sometimes this helps "refresh" the taskbar icon cache
 */
async function applyOverlayIconRefresh(window) {
    try {
        // Skip this technique - we want to avoid using overlay icons completely
        // as we're using full icon replacement to indicate application state
        console.log('Skipping overlay icon refresh technique - using full icon replacement instead');
        return false;
    }
    catch (error) {
        console.error('Error applying overlay icon refresh:', error);
        return false;
    }
}


/***/ }),

/***/ "child_process":
/*!********************************!*\
  !*** external "child_process" ***!
  \********************************/
/***/ ((module) => {

"use strict";
module.exports = require("child_process");

/***/ }),

/***/ "electron":
/*!***************************!*\
  !*** external "electron" ***!
  \***************************/
/***/ ((module) => {

"use strict";
module.exports = require("electron");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("events");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ "os":
/*!*********************!*\
  !*** external "os" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("os");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),

/***/ "robotjs":
/*!**************************!*\
  !*** external "robotjs" ***!
  \**************************/
/***/ ((module) => {

"use strict";
module.exports = require("robotjs");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("stream");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("util");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/node module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.nmd = (module) => {
/******/ 			module.paths = [];
/******/ 			if (!module.children) module.children = [];
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/main/index.ts");
/******/ 	
/******/ })()
;
//# sourceMappingURL=main.js.map