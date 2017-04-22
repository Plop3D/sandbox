/**          _          __   __   ___
 *   __ _  _| |_ ___   /  \ /  \ | __|
 *  / _| || |  _/ -_) | () | () ||__ \
 *  \__|\_,_|\__\___|  \__(_)__(_)___/
 * 
 *
 * Source:
 *   https://github.com/lighterio/cute/blob/master/scripts/ajax.js
 *   https://github.com/lighterio/cute/blob/master/scripts/charts.js
 *   https://github.com/lighterio/cute/blob/master/scripts/collections.js
 *   https://github.com/lighterio/cute/blob/master/scripts/cookies.js
 *   https://github.com/lighterio/cute/blob/master/scripts/crypto.js
 *   https://github.com/lighterio/cute/blob/master/scripts/dates.js
 *   https://github.com/lighterio/cute/blob/master/scripts/dom.js
 *   https://github.com/lighterio/cute/blob/master/scripts/events.js
 *   https://github.com/lighterio/cute/blob/master/scripts/forms.js
 *   https://github.com/lighterio/cute/blob/master/scripts/functions.js
 *   https://github.com/lighterio/cute/blob/master/scripts/history.js
 *   https://github.com/lighterio/cute/blob/master/scripts/json.js
 *   https://github.com/lighterio/cute/blob/master/scripts/logging.js
 *   https://github.com/lighterio/cute/blob/master/scripts/numbers.js
 *   https://github.com/lighterio/cute/blob/master/scripts/page.js
 *   https://github.com/lighterio/cute/blob/master/scripts/ready.js
 *   https://github.com/lighterio/cute/blob/master/scripts/regexp.js
 *   https://github.com/lighterio/cute/blob/master/scripts/storage.js
 *   https://github.com/lighterio/cute/blob/master/scripts/strings.js
 *   https://github.com/lighterio/cute/blob/master/scripts/style.js
 *   https://github.com/lighterio/cute/blob/master/scripts/timing.js
 *   https://github.com/lighterio/cute/blob/master/scripts/type.js
 *   https://github.com/lighterio/cute/blob/master/scripts/types.js
 */

var Cute = {}

// +env:any
if (typeof exports === 'object') {
  module.exports = Cute
} else if (typeof define === 'function' && define.amd) {
  define(function () {return Cute});
} else {
  this.Cute = Cute
}
// -env:any

/**
 * Get an XMLHttpRequest object (or ActiveX object in old IE).
 *
 * @return {XMLHttpRequest}  The request object.
 */
Cute._xhr = function () {
  return new XMLHttpRequest()
}

/**
 * Get an XMLHttpRequest upload object.
 *
 * @return {XMLHttpRequestUpload}  The request upload object.
 */
Cute.upload = function () {
  return Cute._xhr().upload
}

/**
 * Make an AJAX request, and handle it with success or failure.
 *
 * @param  {String}   url   A URL from which to request a response.
 * @param  {String}   data  An optional query, which if provided, makes a POST
 *                          request, or if `null` makes a DELETE request.
 * @param  {Function} fn    An optional function which takes (data, status) arguments.
 */
Cute.request = function (url, data, fn) {
  // If the optional data argument is omitted, zero it.
  if (Cute.isFunction(data)) {
    fn = data
    data = 0
  }
  var request = Cute._xhr()
  request.onreadystatechange = function (event) {
    if (request.readyState === 4) {
      var status = request.status
      var text = request.responseText
      var data = Cute.parse(text, data)
      fn(data, status)
    }
  }
  var method = data ? 'POST' : Cute.isNull(data) ? 'DELETE' : 'GET'
  request.open(method, url, true)
  if (data) {
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    if (!Cute.isString(data)) {
      data = Cute.stringify(data)
    }
  }
  request.send(data || null)
  return request
}

/**
 * Get 100 consistent colors for charting.
 * These colors are designed to maximize visual distance.
 *
 * @return {Array}   The request object.
 */
Cute.colors = function () {
  var colors = Cute.colors._cache
  if (!colors) {
    var map = {}
    var string =
      '03f290c00eb0b0f0cbe6000605090307bf0c740f7a07f' +
      '686f97a098a0748f05a200a772d6332300b1708014dc0' +
      'c89f7a0ff045faf78304ab9798eb804020fcfd5600089' +
      '9f574be6f0f7f6405'
    colors = []
    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 35; j++) {
        var color = string.substr(j * 3 + i, 3)
        if (!map[color]) {
          map[color] = 1
          colors.push('#' + color)
        }
      }
    }
    Cute.colors._cache = colors
  }
  return colors
}

/**
 * Iterate over a string, array or object.
 * Call a function on each value.
 * If the function returns zero, stop iterating.
 *
 * - For strings, the function arguments are: (character, index, collection).
 * - For arrays, the function arguments are: (value, index, collection).
 * - For objects, the arguments are: (value, key, collection).
 *
 * @param  {String|Array|Object} collection  A collection of items.
 * @param  {Function}            fn          A function to call on each item.
 * @return {Number}                          Index or key that returned false.
 */
Cute.each = function (collection, fn) {
  if (collection) {
    var length = collection.length
    var key, result
    if (Cute.isNumber(length)) {
      for (key = 0; key < length; key++) {
        result = fn(collection[key], key, collection)
        if (result === 0) {
          break
        }
      }
    } else {
      for (key in collection) {
        result = fn(collection[key], key, collection)
        if (result === 0) {
          break
        }
      }
    }
    return key
  }
}

/**
 * Decorate an object with properties from another object.
 *
 * @param  {Object} object       An object to decorate.
 * @param  {Object} decorations  An object whose properties will be used as decorations.
 * @return {Object}              The decorated object.
 */
Cute.decorate = function (object, decorations) {
  if (object) {
    Cute.each(decorations, function (value, key) {
      object[key] = value
    })
  }
  return object
}

/**
 * Get the value of an object property, and optionally set it to a default
 * value if it's not defined.
 *
 * @param  {Object} object        An object to get/set a property on.
 * @param  {String} property      The property name.
 * @param  {Any}    defaultValue  An optional default value for the property.
 * @return {Any}                  The resulting property value.
 */
Cute.prop = function (object, property, defaultValue) {
  var value = object[property]
  if (Cute.isUndefined(value)) {
    value = object[property] = defaultValue
  }
  return value
}

/**
 * Return the subset of a collection for which a filter function returns truthy.
 *
 * @param  {Array|Object} collection  A collection to filter.
 * @param  {Function}     fn          A filter function.
 * @return {Array|Object}             The filtered subset.
 */
Cute.filter = function (collection, fn) {
  var isArray = Cute.isArray(collection)
  var filtered = isArray ? [] : {}
  Cute.each(collection, function (value, key) {
    if (fn(value)) {
      if (isArray) {
        filtered.push(value)
      } else {
        filtered[key] = value
      }
    }
  })
  return filtered
}

/**
 * Merge one or more arrays into an array.
 *
 * @param  {Array}     array  An array to merge into.
 * @param  {Array...}         Items to merge into the array.
 * @return {Array}            The first array argument, with new items merged in.
 */
Cute.merge = function (array) {
  Cute.each(arguments, function (items, index) {
    if (index) {
      [].push.apply(array, items)
    }
  })
  return array
}

/**
 * Read cookies, and optionally get or set one.
 *
 * @param  {String} name     An optional cookie name to get or set. If not provided, return a map.
 * @param  {Object} value    A value to be set as a string, or null if the cookie is to be deleted.
 * @param  {Object} options  Optional cookie settings, including "maxAge", "expires", "path", "domain" and "secure".
 * @return {Object}          A cookie, or a map of cookie names and values.
 */
Cute.cookie = function (name, value, options) {
  // Initialize a cookie map.
  var map = Cute.cookie.map
  if (!map) {
    map = Cute.cookie.map = {}
    var parts = document.cookie.split(/; |=/)
    for (var i = 0, l = parts.length; i < l; i++) {
      map[Cute.decode(parts[i])] = Cute.decode(parts[++i])
    }
  }

  // If no cookie is named, return the map.
  if (!name) {
    value = map

  // Otherwise, get or set one.
  } else {
    // If no value is provided, return the existing value.
    if (Cute.isUndefined(value)) {
      value = map[name]

    // If a value is provided, set the cookie to that value.
    } else {
      options = options || {}
      var pair = Cute.encode(name) + '=' + Cute.encode(value)

      var path = options.path
      var domain = options.domain
      var secure = options.secure

      // If the value is null, expire it as of one millisecond ago.
      var maxAge = Cute.isNull(value) ? -1 : options.maxAge
      var expires = maxAge ? new Date(Date.now() + maxAge) : 0

      document.cookie = pair +
        (path ? ';path=' + path : '') +
        (domain ? ';domain=' + domain : '') +
        (expires ? ';expires=' + expires.toUTCString() : '') +
        (secure ? ';secure' : '')

      map[name] = value
    }
  }
  return value
}

/**
 * Calculate an MD5 hash for a string (useful for things like Gravatars).
 *
 * @param  {String} s  A string to hash.
 * @return {String}    The MD5 hash for the given string.
 */
Cute.md5 = function (str) {
  // Encode as UTF-8.
  str = Cute.decode(Cute.encode(str))

  // Build an array of little-endian words.
  var arr = new Array(str.length >> 2)
  for (var idx = 0, len = arr.length; idx < len; idx += 1) {
    arr[idx] = 0
  }
  for (idx = 0, len = str.length * 8; idx < len; idx += 8) {
    arr[idx >> 5] |= (str.charCodeAt(idx / 8) & 0xFF) << (idx % 32)
  }

  // Calculate the MD5 of an array of little-endian words.
  arr[len >> 5] |= 0x80 << (len % 32)
  arr[(((len + 64) >>> 9) << 4) + 14] = len

  var a = 1732584193
  var b = -271733879
  var c = -1732584194
  var d = 271733878

  len = arr.length
  idx = 0
  while (idx < len) {
    var olda = a
    var oldb = b
    var oldc = c
    var oldd = d

    var e = arr[idx++]
    var f = arr[idx++]
    var g = arr[idx++]
    var h = arr[idx++]
    var i = arr[idx++]
    var j = arr[idx++]
    var k = arr[idx++]
    var l = arr[idx++]
    var m = arr[idx++]
    var n = arr[idx++]
    var o = arr[idx++]
    var p = arr[idx++]
    var q = arr[idx++]
    var r = arr[idx++]
    var s = arr[idx++]
    var t = arr[idx++]

    a = ff(a, b, c, d, e, 7, -680876936)
    d = ff(d, a, b, c, f, 12, -389564586)
    c = ff(c, d, a, b, g, 17, 606105819)
    b = ff(b, c, d, a, h, 22, -1044525330)
    a = ff(a, b, c, d, i, 7, -176418897)
    d = ff(d, a, b, c, j, 12, 1200080426)
    c = ff(c, d, a, b, k, 17, -1473231341)
    b = ff(b, c, d, a, l, 22, -45705983)
    a = ff(a, b, c, d, m, 7, 1770035416)
    d = ff(d, a, b, c, n, 12, -1958414417)
    c = ff(c, d, a, b, o, 17, -42063)
    b = ff(b, c, d, a, p, 22, -1990404162)
    a = ff(a, b, c, d, q, 7, 1804603682)
    d = ff(d, a, b, c, r, 12, -40341101)
    c = ff(c, d, a, b, s, 17, -1502002290)
    b = ff(b, c, d, a, t, 22, 1236535329)

    a = gg(a, b, c, d, f, 5, -165796510)
    d = gg(d, a, b, c, k, 9, -1069501632)
    c = gg(c, d, a, b, p, 14, 643717713)
    b = gg(b, c, d, a, e, 20, -373897302)
    a = gg(a, b, c, d, j, 5, -701558691)
    d = gg(d, a, b, c, o, 9, 38016083)
    c = gg(c, d, a, b, t, 14, -660478335)
    b = gg(b, c, d, a, i, 20, -405537848)
    a = gg(a, b, c, d, n, 5, 568446438)
    d = gg(d, a, b, c, s, 9, -1019803690)
    c = gg(c, d, a, b, h, 14, -187363961)
    b = gg(b, c, d, a, m, 20, 1163531501)
    a = gg(a, b, c, d, r, 5, -1444681467)
    d = gg(d, a, b, c, g, 9, -51403784)
    c = gg(c, d, a, b, l, 14, 1735328473)
    b = gg(b, c, d, a, q, 20, -1926607734)

    a = hh(a, b, c, d, j, 4, -378558)
    d = hh(d, a, b, c, m, 11, -2022574463)
    c = hh(c, d, a, b, p, 16, 1839030562)
    b = hh(b, c, d, a, s, 23, -35309556)
    a = hh(a, b, c, d, f, 4, -1530992060)
    d = hh(d, a, b, c, i, 11, 1272893353)
    c = hh(c, d, a, b, l, 16, -155497632)
    b = hh(b, c, d, a, o, 23, -1094730640)
    a = hh(a, b, c, d, r, 4, 681279174)
    d = hh(d, a, b, c, e, 11, -358537222)
    c = hh(c, d, a, b, h, 16, -722521979)
    b = hh(b, c, d, a, k, 23, 76029189)
    a = hh(a, b, c, d, n, 4, -640364487)
    d = hh(d, a, b, c, q, 11, -421815835)
    c = hh(c, d, a, b, t, 16, 530742520)
    b = hh(b, c, d, a, g, 23, -995338651)

    a = ii(a, b, c, d, e, 6, -198630844)
    d = ii(d, a, b, c, l, 10, 1126891415)
    c = ii(c, d, a, b, s, 15, -1416354905)
    b = ii(b, c, d, a, j, 21, -57434055)
    a = ii(a, b, c, d, q, 6, 1700485571)
    d = ii(d, a, b, c, h, 10, -1894986606)
    c = ii(c, d, a, b, o, 15, -1051523)
    b = ii(b, c, d, a, f, 21, -2054922799)
    a = ii(a, b, c, d, m, 6, 1873313359)
    d = ii(d, a, b, c, t, 10, -30611744)
    c = ii(c, d, a, b, k, 15, -1560198380)
    b = ii(b, c, d, a, r, 21, 1309151649)
    a = ii(a, b, c, d, i, 6, -145523070)
    d = ii(d, a, b, c, p, 10, -1120210379)
    c = ii(c, d, a, b, g, 15, 718787259)
    b = ii(b, c, d, a, n, 21, -343485551)

    a = add(a, olda)
    b = add(b, oldb)
    c = add(c, oldc)
    d = add(d, oldd)
  }
  arr = [a, b, c, d]

  // Build a string.
  var hex = '0123456789abcdef'
  str = ''
  for (idx = 0, len = arr.length * 32; idx < len; idx += 8) {
    var code = (arr[idx >> 5] >>> (idx % 32)) & 0xFF
    str += hex.charAt((code >>> 4) & 0x0F) + hex.charAt(code & 0x0F)
  }

  return str

  /**
   * Add 32-bit integers, using 16-bit operations to mitigate JS interpreter bugs.
   */
  function add (a, b) {
    var lsw = (a & 0xFFFF) + (b & 0xFFFF)
    var msw = (a >> 16) + (b >> 16) + (lsw >> 16)
    return (msw << 16) | (lsw & 0xFFFF)
  }

  function cmn (q, a, b, x, s, t) {
    a = add(add(a, q), add(x, t))
    return add((a << s) | (a >>> (32 - s)), b)
  }

  function ff (a, b, c, d, x, s, t) {
    return cmn((b & c) | ((~b) & d), a, b, x, s, t)
  }

  function gg (a, b, c, d, x, s, t) {
    return cmn((b & d) | (c & (~d)), a, b, x, s, t)
  }

  function hh (a, b, c, d, x, s, t) {
    return cmn(b ^ c ^ d, a, b, x, s, t)
  }

  function ii (a, b, c, d, x, s, t) {
    return cmn(c ^ (b | (~d)), a, b, x, s, t)
  }
}

/**
 * Returns a Date object.
 *
 * @param {Date|Number|String}  date  An optional Date or Date constructor
 *                                    argument (default: now).
 * @return {Date}                     A Date object.
 */
Cute.getDate = function (date) {
  return Cute.isDate(date) ? date : date ? new Date(date) : new Date()
}

/**
 * Get Unix epoch milliseconds from a date.
 *
 * @param  {Date}   date  An optional Date object (default: now).
 * @return {Number}       Epoch milliseconds.
 */
Cute.ms = function (date) {
  return date ? Cute.getDate(date).getTime() : Date.now()
}

/**
 * Get an ISO-standard date string.
 *
 * @param {Date}    date  Date object (default: now).
 * @return {String}       ISO date string.
 */
Cute.stamp = function (date) {
  date = Cute.getDate(date)
  return date.toISOString()
}

/**
 * Take a date and return a formatted date string in long or short format:
 * - Short: "8/26/14 7:42pm"
 * - Long: "August 26, 2014 at 7:42pm"
 *
 * @param  {Object}  date         An optional Date object or argument for the
 *                                Date constructor.
 * @param  {Boolean} isLong       Whether to output the short or long format.
 * @param  {Boolean} includeTime  Whether to append the time.
 * @return {String}               The formatted date string.
 */
Cute.formatDate = function (date, isLong, includeTime) {
  date = Cute.getDate(date)
  var month = date.getMonth()
  var day = date.getDate()
  var year = date.getFullYear()
  if (isLong) {
    month = Cute.months[month]
  } else {
    month++
    year = ('' + year).substr(2)
  }
  var string
  if (!Cute.useMonthDayYear) {
    string = month
    month = day
    day = string
  }
  if (isLong) {
    string = month + ' ' + day + ', ' + year
  } else {
    string = month + '/' + day + '/' + year
  }
  if (includeTime) {
    if (isLong) {
      string += ' ' + Cute.dateTimeSeparator
    }
    string += ' ' + Cute.formatTime(date)
  }
  return string
}

/**
 * Take a date object and return a formatted time string.
 *
 * @param  {Object}  date    An optional Date object or constructor argument.
 * @return {String}          A formatted time value.
 */
Cute.formatTime = function (date) {
  date = Cute.getDate(date)
  var hour = +date.getHours()
  var minute = +date.getMinutes()
  var isAm = 1
  minute = minute > 9 ? minute : '0' + minute
  if (Cute.useTwelveHour) {
    if (hour > 11) {
      isAm = 0
      if (hour > 12) {
        hour -= 12
      }
    } else if (!hour) {
      hour = 12
    }
  } else {
    hour = hour > 9 ? hour : '0' + hour
  }
  var string = hour + ':' + minute
  if (Cute.useTwelveHour) {
    string += (isAm ? 'am' : 'pm')
  }
  return string
}

Cute.months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

// A word for separating date & time in long format.
Cute.dateTimeSeparator = 'at'

// Whether to use American-style MM/DD/YY.
Cute.useMonthDayYear = 1

// Whether to use 12-hour instead of 24-hour times.
Cute.useTwelveHour = 1

/**
 * Get an element by its ID (if the argument is an ID).
 * If you pass in an element, it just returns it.
 * This can be used to ensure that you have an element.
 *
 * @param  {DOMElement}        parent  Optional element to call getElementById on (default: document).
 * @param  {string|DOMElement} idOrElement    ID of an element, or the element itself.
 * @return {DOMElement}                       The matching element, or undefined.
 */
Cute.id = function (parent, idOrElement) {
  if (!idOrElement) {
    idOrElement = parent
    parent = document
  }
  return Cute.isString(idOrElement) ? parent.getElementById(idOrElement) : idOrElement
}

/**
 * Get or set the parent of an element.
 *
 * @param  {DOMElement} element    A element whose parent we want to get/set.
 * @param  {String}      parent     An optional parent to add the element to.
 * @param  {String}      before     An optional child to insert the element before.
 * @return {DOMElement}            The parent of the element.
 */
Cute.parent = function (element, parent, before) {
  if (parent) {
    parent.insertBefore(element, before || null)
  } else {
    parent = element.parentNode
  }
  return parent
}

/**
 * Get an element's ancestors, optionally filtered by a selector.
 *
 * @param  {DOMElement} element   An element to start from.
 * @param  {String}      selector  An optional selector to filter ancestors.
 * @return {Array}                 The array of ancestors.
 */
Cute.up = function (element, selector) {
  var ancestors = []
  while (element = Cute.parent(element)) { // eslint-disable-line
    ancestors.push(element)
  }
  ancestors = Cute.filter(ancestors, function (element) {
    return Cute.matches(element, selector)
  })
  return ancestors
}

/**
 * Get the child nodes of a parent element.
 *
 * @param  {DOMElement}    element  A parent element who might have child nodes.
 * @return {HTMLCollection}          The collection of child nodes.
 */
Cute.nodes = function (element) {
  return element.childNodes
}

/**
 * Get an element's index with respect to its parent.
 *
 * @param  {DOMElement} element  An element with a parent, and potentially siblings.
 * @return {Number}               The element's index, or -1 if there's no matching element.
 */
Cute.index = function (element) {
  var index = -1
  while (element) {
    ++index
    element = element.previousSibling
  }
  return index
}

/**
 * Create an element, given a specified tag identifier.
 *
 * Identifiers are of the form:
 *   tagName#id.class1.class2?attr1=value1&attr2=value2
 *
 * Each part of the identifier is optional.
 *
 * @param  {DOMElement|String} elementOrString  An element or a string used to create an element (default: div).
 * @return {DOMElement}                         The existing or created element.
 */
Cute.create = function (elementOrString) {
  var element = elementOrString
  if (Cute.isString(elementOrString)) {
    var tagAndAttributes = elementOrString.split('?')
    var tagAndClass = tagAndAttributes[0].split('.')
    var className = tagAndClass.slice(1).join(' ')
    var tagAndId = tagAndClass[0].split('#')
    var tagName = tagAndId[0] || 'div'
    var id = tagAndId[1]
    var attributes = tagAndAttributes[1]
    var isSvg = /^(svg|g|path|circle|line)$/.test(tagName)
    var uri = 'http://www.w3.org/' + (isSvg ? '2000/svg' : '1999/xhtml')
    element = document.createElementNS(uri, tagName)
    if (id) {
      element.id = id
    }
    if (className) {
      element.className = className
    }
    // TODO: Do something less janky than using query string syntax (Maybe like Ltl?).
    if (attributes) {
      attributes = attributes.split('&')
      Cute.each(attributes, function (attribute) {
        var keyAndValue = attribute.split('=')
        var key = keyAndValue[0]
        var value = keyAndValue[1]
        element[key] = value
        Cute.attr(element, key, value)
      })
    }
  }
  return element
}

/**
 * Add a child element under a parent element, optionally before another element.
 *
 * @param  {DOMElement}         parent           An optional parent element (default: document).
 * @param  {DOMElement|String}  elementOrString  An element or a string used to create an element (default: div).
 * @param  {DOMElement}         beforeSibling    An optional child to insert the element before.
 * @return {DOMElement}                          The element that was inserted.
 */
Cute.add = function (parent, elementOrString, beforeSibling) {
  if (Cute.isString(parent)) {
    beforeSibling = elementOrString
    elementOrString = parent
    parent = Cute.body()
  }
  var element = Cute.create(elementOrString)
  // If the beforeSibling value is a number, get the (future) sibling at that index.
  if (Cute.isNumber(beforeSibling)) {
    beforeSibling = Cute.nodes(parent)[beforeSibling]
  }
  // Insert the element, optionally before an existing sibling.
  if (beforeSibling) {
    parent.insertBefore(element, beforeSibling)
  } else {
    parent.appendChild(element)
  }
  return element
}

/**
 * Remove an element from its parent.
 *
 * @param  {DOMElement} element  An element to remove.
 */
Cute.remove = function (element) {
  // Remove the element from its parent, provided that it has a parent.
  var parent = Cute.parent(element)
  if (parent) {
    parent.removeChild(element)
  }
}

/**
 * Get or set an element's inner HTML.
 *
 * @param  {DOMElement} element  An element.
 * @param  {String}      html     An optional string of HTML to set as the innerHTML.
 * @return {String}               The element's HTML.
 */
Cute.html = function (element, html) {
  if (!Cute.isUndefined(html)) {
    element.innerHTML = html
  }
  return element.innerHTML
}

/**
 * Get an element's lowercase tag name.
 *
 * @param  {DOMElement} element  An element.
 * @return {String}               The element's tag name.
 */
Cute.tag = function (element) {
  return Cute.lower(element.tagName)
}

/**
 * Get or set the text of an element.
 *
 * @param  {DOMElement} element  An optional element.
 * @return {String}      text     A text string to set.
 */
Cute.text = function (element, text) {
  if (!Cute.isUndefined(text)) {
    Cute.html(element, '')
    Cute.addText(element, text)
  }
  // Get the full text, but fall back to visible text for older browsers.
  return element.textContent || element.innerText
}

/**
 * Add text to an element.
 *
 * @param  {DOMElement} element  An element.
 * @return {String}      text     A text string to add.
 */
Cute.addText = function (element, text, beforeSibling) {
  Cute.add(element, document.createTextNode(text), beforeSibling)
}

/**
 * Get, set, or delete an attribute of an element.
 *
 * @param  {DOMElement}  element  An element.
 * @param  {String}      name     An attribute name.
 * @param  {String}      value    A value to set the attribute to.
 * @return {String}               The value of the attribute.
 */
Cute.attr = function (element, name, value) {
  if (Cute.isNull(value)) {
    element.removeAttribute(name)
  } else if (Cute.isUndefined(value)) {
    value = element.getAttribute(name)
  } else {
    var old = Cute.attr(element, name)
    if (value !== old) {
      element.setAttribute(name, value)
    }
  }
  return value
}

/**
 * Add, remove or check classes on an element.
 *
 * @param  {DOMElement} element     An element to change or read classes from.
 * @param  {String}      operations  Space-delimited operations to perform on
 *                                   an element's className.
 *                                     * "!name" adds the "name" class if not
 *                                       present, or removes it if present.
 *                                     * "+name" adds the "name" class.
 *                                     * "-name" removes the "name" class.
 *                                     * "name" returns 1 if the "name" class
 *                                       is present, or undefined if it isn't.
 * @return {Object}                  The map of all classes in the element's
 *                                   className, or 1 or undefined if the last queried class was found.
 */
Cute.classes = function (element, operations) {
  var map = {}
  var result = map
  var list = Cute.string(element.className).match(/\S+/g)
  Cute.each(list, function (key) {
    map[key] = 1
  })
  if (operations) {
    operations.replace(/([!\+-]*)?(\S+)/g, function (match, op, key) {
      var value = map[key]
      if (op === '!') {
        value = !value
      } else if (op === '+') {
        value = 1
      } else if (op === '-') {
        value = 0
      } else {
        result = value ? 1 : 0
      }
      map[key] = value
    })
    list = []
    Cute.each(map, function (value, key) {
      if (value) {
        list.push(key)
      }
    })
    element.className = list.join(' ')
  }
  return result
}

/**
 * Find elements matching a selector, and return or run a function on them.
 *
 * Selectors are not fully querySelector compatible.
 * Selectors only support commas, spaces, IDs, tags & classes.
 *
 * @param  {DOMElement}    parent    An optional element under which to find elements.
 * @param  {String}         selector  A simple selector for finding elements.
 * @param  {Function}       fn        An optional function to run on matching elements.
 * @return {HTMLCollection}           The matching elements (if any).
 */
Cute.all = function (parent, selector, fn) {
  if (!selector || Cute.isFunction(selector)) {
    fn = selector
    selector = parent
    parent = document
  }
  var elements = parent.querySelectorAll(selector)
  if (fn) {
    Cute.each(elements, fn)
  }
  return elements
}

/**
 * Find an element matching a selector, optionally run a function on it, and return it.
 *
 * @param  {DOMElement} parent  An optional element under which to find an element.
 * @param  {String}      selector       A simple selector for finding an element.
 * @param  {Function}    fn             An optional function to run on a matching element.
 * @return {DOMElement}                The matching element (if any).
 */
Cute.one = function (parent, selector, fn) {
  if (!selector || Cute.isFunction(selector)) {
    fn = selector
    selector = parent
    parent = document
  }
  var element = parent.querySelector(selector)
  if (element && fn) {
    fn(element)
  }
  return element
}

/**
 * Update a DOM node based on the contents of another.
 *
 * @param  {DOMElement} domNode     The DOM node to merge into.
 * @param  {DOMElement} newNode     The virtual DOM to merge from.
 */
Cute.update = function (domNode, newNode) {
  var domChild = domNode.firstChild || 0
  var newChild = newNode.firstChild || 0
  while (newChild) {
    var domTag = domChild.tagName
    var newTag = newChild.tagName
    var domNext = domChild.nextSibling || 0
    var newNext = newChild.nextSibling || 0
    if ((domTag !== newTag) || Cute.lower(newTag) === 'svg') {
      domNode.insertBefore(newChild, domChild || null)
      if (domChild) {
        domNode.removeChild(domChild)
      }
      domChild = domNext
    } else {
      if (newTag) {
        Cute.update(domChild, newChild)
      } else if (domChild) {
        domChild.textContent = newChild.textContent
      } else {
        domNode.appendChild(newChild)
      }
      domChild = domNext
    }
    newChild = newNext
  }
  while (domChild) {
    domNext = domChild.nextSibling
    domNode.removeChild(domChild)
    domChild = domNext
  }
  var map = {}
  function mapAttributes (element, index) {
    Cute.each(element.attributes, function (attribute) {
      map[attribute.name] = index ? attribute.value : null
    })
  }
  mapAttributes(domNode, 0)
  mapAttributes(newNode, 1)
  Cute.each(map, function (value, name) {
    Cute.attr(domNode, name, value)
  })
}

/**
 * Event Handlers
 * @type {Object}
 */
Cute._handlers = {}

/**
 * Listen for one or more events, optionally on a given element.
 *
 * @param  {String|DOMElement}  target    An optional selector or element.
 * @param  {String|Array}       types     A list of events to listen for.
 * @param  {Function}           listener  A callback function.
 */
Cute.on = function (target, types, listener) {
  if (!listener) {
    listener = types
    types = target
    target = document
  }
  var element = Cute.isString(target) ? document : target
  types = types.split(/\s+/)
  Cute.each(types, function (type) {
    var handlers = Cute._handlers[type]
    if (!handlers) {
      handlers = Cute._handlers[type] = []
      if (element.addEventListener) {
        element.addEventListener(type, Cute._propagate, true)
      } else if (element.attachEvent) {
        element.attachEvent('on' + type, Cute._propagate)
      } else {
        element['on' + type] = Cute._propagate
      }
    }
    handlers.push({t: target, f: listener})
  })
  return listener
}

/**
 * Remove a listener for one event type.
 *
 * @param  {String}    types     Types of event to stop listening for.
 * @param  {Function}  listener  A listener function to remove.
 */
Cute.off = function (types, listener) {
  types = types.split(/\s+/)
  Cute.each(types, function (type) {
    var handlers = Cute._handlers[type]
    Cute.each(handlers, function (item, index) {
      if (item && (item.f === listener)) {
        delete handlers[index]
      }
    })
  })
}

/**
 * Listen for one or more events, optionally on a given element, and ensure that the
 * listener will only be executed once.
 *
 * @param  {String|DOMElement} target    An optional selector or element.
 * @param  {String|Array}       types     A list of events to listen for.
 * @param  {Function}           listener  A function to execute when an event occurs.
 */
Cute.once = function (target, types, listener) {
  var onceFn = function (target, type, event) {
    Cute.off(types, onceFn)
    listener.apply(target, arguments)
  }
  Cute.on(target, types, onceFn)
}

/**
 * Simulate an event.
 *
 * @param  {DOMElement} target  A target to start propagation from.
 * @param  {String}      event   A type of event.
 * @param  {Object}      data    Optional data to report with the event.
 */
Cute.emit = function (target, type, data) {
  Cute._propagate({
    type: type,
    target: target,
    data: data
  })
}

/**
 * Propagate an event from a target element up to the DOM root.
 *
 * @param  {Object} event   An event to propagate:
 *                          {
 *                            type: String,   // An event type (e.g.) "click".
 *                            target: Object, // The element where the event occurred.
 *                            data: Object    // Optional event data.
 *                          }
 */
Cute._propagate = function (event) {
  // Get the window-level event if an event isn't passed.
  event = event || window.event

  // Reference the event target.
  var eventTarget = event.target || event.srcElement || document

  // Extract the event type.
  var type = event.type

  // Propagate the event up through the target's DOM parents.
  var element = eventTarget
  var handlers = Cute._handlers[type]
  while (element && !event.stop) {
    Cute.each(handlers, function (handler) {
      if (handler) {
        var target = handler.t
        var fn = handler.f
        var isMatch = Cute.isString(target)
          ? Cute.matches(element, target)
          : (element === target)
        if (isMatch) {
          fn(event.data || eventTarget, event, type)
        }
        return !event.stop
      }
    })
    if (element === document) {
      break
    }
    element = Cute.parent(element)
  }
}

/**
 * Find out if an element matches a given selector.
 *
 * @param  {DOMElement} element   An element to pretend the event occurred on.
 * @param  {String}      selector  A CSS selector to check against an element.
 * @return {Boolean}               True if the element (this) matches the selector.
 */
Cute.matches = function (element, selector) {
  var matches =
    element.webkitMatchesSelector ||
    element.msMatchesSelector ||
    element.mozMatchesSelector ||
    element.oMatchesSelector ||
    element.matchesSelector ||
    element.matches || Cute.no
  var isMatch = matches.call(element, selector)
  return isMatch
}

/**
 * Prevent the default action for this event.
 *
 * @param  {Event} event  Event to prevent from doing its default action.
 */
Cute.prevent = function (event) {
  Cute.apply(event, 'preventDefault')
}

/**
 * Stop an event from bubbling or performing its default action.
 *
 * @param  {Event} event  Event to stop.
 */
Cute.stop = function (event) {
  event.stop = 1
  Cute.prevent(event)
}

/**
 * Focus on a specified element.
 *
 * @param  {DOMElement} element  The element to focus on.
 */
Cute.focus = function (element) {
  Cute.apply(element, 'focus')
}

/**
 * Get or set the value of a form element.
 *
 * @param  {DOMElement}  input      A form element.
 * @param  {String|Array} newValue  An optional new value for the element.
 * @return {String|Array}           The current or new value.
 */
Cute.value = function (input, newValue) {
  if (!input) {
    return
  }
  var type = input.type[0]
  var value = input.value
  var options = input.options
  var setNew = arguments.length > 1

  var items, isMulti, flag
  if (type === 'c' || type === 'r') {
    var form = input.form || document
    var selector = 'input[name=' + input.name + ']'
    items = Cute.all(form, selector)
    isMulti = (type === 'c' && items.length > 1)
    flag = 'checked'
  } else if (options) {
    items = options
    isMulti = input.multiple
    flag = 'selected'
  }
  if (items) {
    var matches = {}
    var array = Cute.array(newValue)
    Cute.each(array, function (value) {
      matches[value] = 1
    })
    value = []
    Cute.each(items, function (input) {
      var isMatch = !!matches[input.value]
      if (setNew) {
        input[flag] = isMatch
      } else if (input[flag]) {
        value.push(input.value)
      }
    })
    if (!isMulti) {
      value = value[0]
    }
  } else if (setNew) {
    input.value = newValue
  }
  return setNew ? newValue : value
}

/**
 * Empty handler.
 * @type {Function}
 */
Cute.no = function () {}

/**
 * Apply arguments to an object method.
 *
 * @param  {Object} object      An object with methods.
 * @param  {String} methodName  A method name, which may exist on the object.
 * @param  {Array}  args        An array to apply to the method.
 * @return {Object}             The result returned by the object method.
 */
Cute.apply = function (object, methodName, args) {
  return ((object || 0)[methodName] || Cute.no).apply(object, args)
}

/**
 * Try to apply arguments to an object method.
 *
 * @param  {Object} object      An object with methods.
 * @param  {String} methodName  A method name, which may exist on the object.
 * @param  {Array}  args        An array to apply to the method.
 * @return {Object}             The result returned by the object method.
 */
Cute.attempt = function (object, methodName, args) {
  try {
    Cute.apply(object, methodName, args)
  } catch (ignore) {
  }
}

/**
 * Push, replace or pop a history item.
 *
 * @param  {String}  href     An optional href to visit (or falsy to go back).
 * @param  {Boolean} inPlace  Whether to just replace the current state.
 */
Cute.go = function (href, inPlace) {
  var history = window.history
  var method =
    href === -1 ? 'back'
    : href === 1 ? 'forward'
    : (inPlace ? 'replace' : 'push') + 'State'
  Cute.attempt(history, method, [undefined, undefined, href])
  return history
}

/**
 * Creates a JSON string.
 *
 * @param  {Any}    data  Data to stringify.
 * @return {String}       A JSON string.
 */
Cute.stringify = function (data, _stack) {
  if (Cute.isDate(data) ||
    data && Cute.isFunction(data.toJSON) ||
    Cute.isString(data)) {
    data = JSON.stringify(data)
  } else if (Cute.isFunction(data) || Cute.isUndefined(data)) {
    return _stack ? 'null' : undefined
  } else if (data && Cute.isObject(data) && !(data instanceof Boolean) && !(data instanceof Number)) {
    _stack = _stack || []
    var isCircular
    Cute.each(_stack, function (item) {
      if (item === data) {
        isCircular = 1
      }
    })
    if (isCircular) {
      return '"[Circular ' + (_stack.length) + ']"'
    }
    _stack.push(data)
    var isArray = Cute.isArray(data)
    var parts = []
    Cute.each(data, function (value, key) {
      value = Cute.stringify(value, _stack)
      parts.push(isArray ? value : Cute.stringify(key) + ':' + value)
    })
    _stack.pop()
    data = (isArray ? '[' : '{') + parts.join(',') + (isArray ? ']' : '}')
  } else {
    data = Cute.string(data)
  }
  return data
}

/**
 * Create a JSON string with its double quotes escaped.
 *
 * @param  {Any}    data  Data to stringify.
 * @return {String}       A JSON string with escaped quotes.
 */
Cute.attrify = function (data) {
  return Cute.stringify(data).replace(/"/g, '&quot;')
}

/**
 * Parse JSON (or JavaScript) and return a value.
 *
 * @param  {String} js           JSON (or JavaScript).
 * @param  {Any}    alternative  Fallback value if an error occurs.
 * @return {Any}                 Value of the JSON/JS or fallback.
 */
Cute.parse = function (js, alternative) {
  try {
    /* eslint-disable */
    eval('eval.J=' + js)
    js = eval.J
    /* eslint-enable */
  } catch (ignore) {
    // +env:debug
    Cute.error('[Cute] Could not parse JS: ' + js)
    // -env:debug
    js = alternative
  }
  return js
}

/**
 * Run some JavaScript.
 *
 * @param  {String} js  JavaScript code to run.
 */
Cute.run = function (js) {
  Cute.parse('0;' + js)
}

// When not in debug mode, make the logging functions do nothing.
Cute.error = Cute.no
Cute.warn = Cute.no
Cute.info = Cute.no
Cute.log = Cute.no
Cute.trace = Cute.no

// +env:debug

/**
 * Log values to the console, if it's available.
 */
Cute.error = function () {
  Cute.apply(window.console, 'error', arguments)
}

/**
 * Log values to the console, if it's available.
 */
Cute.warn = function () {
  Cute.apply(window.console, 'warn', arguments)
}

/**
 * Log values to the console, if it's available.
 */
Cute.info = function () {
  Cute.apply(window.console, 'info', arguments)
}

/**
 * Log values to the console, if it's available.
 */
Cute.log = function () {
  Cute.apply(window.console, 'log', arguments)
}

/**
 * Log values to the console, if it's available.
 */
Cute.trace = function () {
  Cute.apply(window.console, 'trace', arguments)
}

// -env:debug

/**
 * If the argument is numeric, return a number, otherwise return zero.
 *
 * @param  {Any}    value  A value to convert to a number, if necessary.
 * @return {Number}        The number, or zero.
 */
Cute.number = function (value) {
  return isNaN(value *= 1) ? 0 : (value || 0)
}

/**
 * Repeat a string a specified number of times.
 *
 * @param  {String} string  A string to repeat.
 * @param  {Number} times   A number of times to repeat the string.
 * @return {String}         The resulting string.
 */
Cute.repeat = function (string, times) {
  return (new Array(times + 1)).join(string)
}

/**
 * Pad a number with zeros or a string with spaces.
 *
 * @param  {Number|String} value   A value to pad.
 * @param  {Number}        length  A length to pad to.
 * @return {String}                The padded value.
 */
Cute.pad = function (value, length) {
  // Repurpose the length variable to count how much padding we need.
  length = Math.max(length - Cute.string(value).length, 0)

  // Pad based on type.
  if (Cute.isNumber(value)) {
    value = Cute.repeat('0', length) + value
  } else {
    value = value + Cute.repeat(' ', length)
  }
  return value
}

/**
 * Get the <head> element from the document.
 *
 * @return {DOMElement}   The <head> element.
 */
Cute.head = function () {
  return Cute.one('head')
}

/**
 * Get the <head> element from the document.
 *
 * @return {DOMElement}   The <head> element.
 */
Cute.body = function () {
  return Cute.one('body')
}

/**
 * Insert an external JavaScript file.
 *
 * @param  {String}   src  A source URL of a script to insert.
 * @param  {Function} fn   An optional function to run when the script loads.
 */
Cute.js = function (src, fn) {
  var head = Cute.head()
  var script = Cute.add(head, 'script')
  if (fn) {
    Cute.ready(script, fn)
  }
  script.async = true
  script.src = src
}

/**
 * Insert CSS text to the page.
 *
 * @param  {String} css  CSS text to be inserted.
 */
Cute.css = function (css) {
  var head = Cute.head()
  var style = Cute.add(head, 'style')
  Cute.text(style, css)
  var sheet = style.styleSheet
  if (sheet) {
    sheet.cssText = css
  }
}

/**
 * Scale CSS pixel sizes using a window property.
 *
 * @param  {String} css  CSS text to be zoomed.
 */
Cute.zoom = function (css) {
  var zoom = window._zoom || 1
  return css.replace(/([\.\d]+)px\b/g, function (match, n) {
    return Math.floor(n * zoom) + 'px'
  })
}

/**
 * Execute a function when the page loads or new content is added.
 *
 * @param  {Function}  listener  A function which will receive a ready element.
 */
Cute.ready = function (object, listener) {
  if (!listener) {
    listener = object
    object = document
  }

  // If the object is alreay ready, run the function now.
  if (Cute.isReady(object)) {
    listener(object)
  } else {
    // Create a function that replaces itself so it will only run once.
    var fn = function () {
      if (Cute.isReady(object)) {
        Cute.isReady(object, 1)
        listener(object)
        listener = Cute.no
      }
    }

    // Bind using multiple methods for a variety of browsers.
    Cute.on(object, 'readystatechange DOMContentLoaded', fn)
    Cute.on(object === document ? window : object, 'load', fn)

    // Bind to the Cute-triggered ready event.
    Cute.on(object, '_ready', fn)
  }
}

/**
 * Get or set the readiness status of an object.
 *
 * @param  {Object}  object    The object that might be ready.
 * @param  {Boolean} setReady  Whether to .
 * @return {Boolean}           Whether the object is currently ready.
 */
Cute.isReady = function (object, setReady) {
  // Declare an object to be ready, and run events that have been bound to it.
  if (setReady && !object._ready) {
    object._ready = 1
    Cute.emit(object, '_ready')
  }
  // AJAX requests have readyState 4 when loaded.
  // All documents will reach readyState=="complete".
  // In IE, scripts can reach readyState=="loaded" or readyState=="complete".
  return object._ready || /(4|complete|scriptloaded)$/.test('' + object.tagName + object.readyState)
}

/**
 * Get the contents of a specified type of tag within a string of HTML.
 *
 * @param  {String}   html     A string of HTML.
 * @param  {String}   tagName  The type of tag to find.
 * @param  {Function} fn       A function to call on each content block.
 * @return {Array}             The array of contents.
 */
Cute.tagContents = function (html, tagName, fn) {
  var pattern = Cute.tagPatterns[tagName]
  if (!pattern) {
    var flags = /^(html|head|title|body)$/.test(tagName) ? 'i' : 'gi'
    pattern = new RegExp('<' + tagName + '.*?>([\\s\\S]*?)<\\/' + tagName + '>', flags)
    Cute.tagPatterns[tagName] = pattern
  }
  var contents = []
  html.replace(pattern, function (match, content) {
    contents.push(content)
    if (fn) {
      fn(content)
    }
  })
  return contents
}

Cute.tagPatterns = {}

/**
 * Get or set an item in local storage.
 *
 * @param  {String} key    A key to fetch an object by.
 * @param  {Any}    value  A value to be stringified and stored.
 * @return {Any}           The object that was fetched and deserialized
 */
Cute.item = function (key, value) {
  var storage = window.localStorage

  // If no value is passed in, get a value.
  if (Cute.isUndefined(value)) {
    value = storage.getItem(key)
    value = Cute.parse(value, value)

  // A null value indicates that we want the actual value to be removed.
  } else if (Cute.isNull(value)) {
    storage.removeItem(key)
    value = undefined

  // If a non-null value is passed in, store it.
  } else {
    storage.setItem(key, Cute.stringify(value))
  }
  return value
}

/**
 * Return true if the string contains the given substring.
 *
 * @param  {String}  string     A string to search within.
 * @param  {String}  substring  A substring to search for.
 * @return {Boolean}            True if the string contains the substring.
 */
Cute.contains = function (string, substring) {
  return Cute.string(string).indexOf(substring) > -1
}

/**
 * Return true if the string starts with the given substring.
 *
 * @param  {String}  string     A string to search within.
 * @param  {String}  beginning  A substring to search for.
 * @return {Boolean}            True if the string starts with the substring.
 */
Cute.startsWith = function (string, beginning) {
  return Cute.string(string).indexOf(beginning) === 0
}

/**
 * Returns true if the string end with the given substring.
 *
 * @param  {String}  string  A string to search within.
 * @param  {String}  ending  A substring to search for.
 * @return {Boolean}         True if the string ends with the substring.
 */
Cute.endsWith = function (string, ending) {
  string = Cute.string(string)
  return string.indexOf(ending) === (string.length - ending.length)
}

/**
 * Trim the whitespace from a string.
 *
 * @param  {String} string  A string to trim.
 * @return {String}         The trimmed string.
 */
Cute.trim = function (string) {
  return Cute.string(string).replace(/^\s+|\s+$/g, '')
}

/**
 * Split a string by commas.
 *
 * @param  {String} string  A string to split.
 * @return {Array}          The comma-delimited contents of the string.
 */
Cute.split = function (string) {
  return Cute.string(string).split(',')
}

/**
 * Convert a string to lower case.
 *
 * @param  {String} string  A string to convert to lower case.
 * @return {String}         The lowercase string.
 */
Cute.lower = function (string) {
  return Cute.string(string).toLowerCase()
}

/**
 * Convert a string to an upper case.
 *
 * @param  {String} string  A string to convert to upper case.
 * @return {String}         The uppercase string.
 */
Cute.upper = function (string) {
  return Cute.string(string).toUpperCase()
}

/**
 * Measure the length of a string.
 *
 * @param  {String} string  A string to measure.
 * @return {Number}         The string length.
 */
Cute.length = function (string) {
  return Cute.string(string).length
}

/**
 * Return an encoded string for URLs.
 *
 * @param  {String} string  A string to escape.
 * @return {String}         The escaped string.
 */
Cute.encode = function (string) {
  return encodeURIComponent(Cute.string(string))
}

/**
 * Return the decoded version of an encoded URL component.
 *
 * @param  {String} string  A string to decode.
 * @return {String}         The decoded string.
 */
Cute.decode = function (string) {
  return decodeURIComponent(Cute.string(string))
}

/**
 * Set style properties on a given element.
 *
 * @param  {DOMElement} element  Element to set style properties on.
 * @param  {Object}     map      Optional style property map.
 * @return {Object}              Style property of the element.
 */
Cute.style = function (element, map) {
  var style = Cute.prop(element, 'style', 0)
  Cute.each(map, function (value, key) {
    style[key] = value
  })
  return style
}

/**
 * Scroll a page to a position or element.
 *
 * @param  {Integer|String|Object} to         A name, ID, element or Top/Left.
 * @param  {String}                direction  Default: "Top".
 */
Cute.scroll = function (to, direction) {
  direction = direction || 'Top'
  if (Cute.isString(to)) {
    to = Cute.one('a[name=' + to + '],#' + to)
  }
  if (to && Cute.isObject(to)) {
    var element = to
    to = 0
    while (element) {
      to += element['offset' + direction] || 0
      element = element.offsetParent
    }
  }
  var body = Cute.body()
  var key = 'scroll' + direction
  if (Cute.isNumber(to)) {
    body[key] = document.documentElement[key] = to
  }
  return body[key]
}

/**
 * Get or set the width and height of an element.
 *
 * @param  {DOMElement} element  Element to measure or resize.
 * @param  {Array}      size     Optional width and height.
 * @return {Array}               Width and height.
 */
Cute.size = function (element, size) {
  element = element || 0
  if (size) {
    Cute.style(element, {width: size[0], height: size[1]})
  } else {
    size = [element.offsetWidth || 0, element.offsetHeight || 0]
  }
  return size
}

/**
 * Get or set the left and top of an element.
 *
 * @param  {DOMElement} element   Element to measure or resize.
 * @param  {Array}      position  Optional left and top.
 * @return {Array}                Left and top.
 */
Cute.position = function (element, position) {
  element = element || 0
  if (position) {
    Cute.style(element, {left: position[0], top: position[1]})
  } else {
    position = [element.offsetLeft || 0, element.offsetTop || 0]
  }
  return position
}

/**
 * Get the width and height of the viewport as an array.
 *
 * @return {Array} [width, height]
 */
Cute.viewport = function () {
  function dim (key) {
    return Math.max(document.documentElement['client' + key] || 0, window['inner' + key] || 0)
  }
  return [dim('Width'), dim('Height')]
}

/**
 * Set or clear a timeout or interval. If set, save it for possible clearing.
 *
 * @param {Object}   object  An object to bind a timer to.
 * @param {String}   name    A name for the timer.
 * @param {Function} fn      A function to run if the timer is reached.
 * @param {Integer}  delay   An optional delay in milliseconds.
 * @param {Boolean}  recur   Whether to occur regularly (i.e. setInterval).
 */
Cute.wait = function (object, name, fn, delay, recur) {
  var map = Cute.prop(object, '_wait', {})
  clearTimeout(map[name])
  if (fn) {
    if (Cute.isUndefined(delay)) {
      delay = 9
    }
    map[name] = (recur ? setInterval : setTimeout)(fn, delay)
  }
}

Cute._times = {}

Cute.t = function () {
  return (window.performance || Date).now()
}

Cute.start = function (label) {
  Cute._times[label] = Cute.t()
}

Cute.end = function (label) {
  Cute._times[label] = Cute.t() - Cute._times[label]
}

Cute.logTimes = function () {
  var times = []
  Cute.each(Cute._times, function (value, key) {
    times.push(key + ' ' + value.toFixed(3) + 'ms')
  })
  Cute.log(times.join(', '))
}

/**
 * Decorate a Type constructor.
 *
 * @param  {Function}  sup   Optional super constructor.
 * @param  {Function}  con   Constructor to decorate.
 * @param  {Object}    pros  Prototype properties.
 * @return {Function}        The constructor.
 */
Cute.type = function (sup, con, pros) {
  if (!pros) {
    pros = con
    con = sup
    sup = Object
  }
  var pro = con.prototype
  Cute.decorate(pro, sup.prototype)
  Cute.decorate(pro, pros)
  pro._super = sup
  return con
}

/**
 * Check whether a value is undefined.
 *
 * @param  {Any}     value  A value to check.
 * @return {Boolean}        True if the value is undefined.
 */
Cute.isUndefined = function (value) {
  return typeof value === 'undefined'
}

/**
 * Check whether a value is a boolean.
 *
 * @param  {Any}     value  A value to check.
 * @return {Boolean}        True if the value is a boolean.
 */
Cute.isBoolean = function (value) {
  return typeof value === 'boolean' || value instanceof Boolean
}

/**
 * Check whether a value is a number.
 *
 * @param  {Any}     value  A value to check.
 * @return {Boolean}        True if the value is a number.
 */
Cute.isNumber = function (value) {
  return typeof value === 'number' || value instanceof Number
}

/**
 * Check whether a value is a string.
 *
 * @param  {Any}     value  A value to check.
 * @return {Boolean}        True if the value is a string.
 */
Cute.isString = function (value) {
  return typeof value === 'string' || value instanceof String
}

/**
 * Check whether a value is a function.
 *
 * @param  {Any}     value  A value to check.
 * @return {Boolean}        True if the value is a function.
 */
Cute.isFunction = function (value) {
  return typeof value === 'function'
}

/**
 * Check whether a value is an object.
 *
 * @param  {Any}     value  A value to check.
 * @return {Boolean}        True if the value is an object.
 */
Cute.isObject = function (value) {
  return typeof value === 'object'
}

/**
 * Check whether a value is null.
 *
 * @param  {Any}     value  A value to check.
 * @return {Boolean}        True if the value is null.
 */
Cute.isNull = function (value) {
  return value === null
}

/**
 * Check whether a value is an array.
 *
 * @param  {Any}     value  A value to check.
 * @return {Boolean}        True if the value is an array.
 */
Cute.isArray = function (value) {
  return value instanceof Array
}

/**
 * Check whether a value is a date.
 *
 * @param  {Any}     value  A value to check.
 * @return {Boolean}        True if the value is a date.
 */
Cute.isDate = function (value) {
  return value instanceof Date
}

/**
 * Turn a value into a string if it isn't already.
 *
 * @param  {Any}    value  A value that might be a string.
 * @return {String}        A string made from appending the given value to the
 *                         empty string.
 */
Cute.string = function (value) {
  return Cute.isString(value) ? value : '' + value
}

/**
 * Turn a value into an array if it isn't already.
 *
 * @param  {Any}     value  A value that might be an array.
 * @return {Array}          An array that is or contains the value passed in.
 */
Cute.array = function (value) {
  return Cute.isArray(value) ? value : (Cute.isUndefined(value) ? [] : [value])
}

