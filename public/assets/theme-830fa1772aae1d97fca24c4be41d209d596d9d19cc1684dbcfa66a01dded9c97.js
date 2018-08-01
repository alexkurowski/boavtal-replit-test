/**
* breakpoints-js v1.0.5
* https://github.com/amazingSurge/breakpoints-js
*
* Copyright (c) amazingSurge
* Released under the LGPL-3.0 license
*/

(function(global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports'], factory);
  } else if (typeof exports !== 'undefined') {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.breakpointsEs = mod.exports;
  }
})(this, function(exports) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError(
        "this hasn't been initialised - super() hasn't been called"
      );
    }

    return call && (typeof call === 'object' || typeof call === 'function')
      ? call
      : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== 'function' && superClass !== null) {
      throw new TypeError(
        'Super expression must either be null or a function, not ' +
          typeof superClass
      );
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass)
      Object.setPrototypeOf
        ? Object.setPrototypeOf(subClass, superClass)
        : (subClass.__proto__ = superClass);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError('Cannot call a class as a function');
    }
  }

  var _createClass = (function() {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ('value' in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function(Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  })();

  var _typeof =
    typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol'
      ? function(obj) {
          return typeof obj;
        }
      : function(obj) {
          return obj &&
          typeof Symbol === 'function' &&
          obj.constructor === Symbol &&
          obj !== Symbol.prototype
            ? 'symbol'
            : typeof obj;
        };

  /**
  * breakpoints-js v1.0.5
  * https://github.com/amazingSurge/breakpoints-js
  *
  * Copyright (c) amazingSurge
  * Released under the LGPL-3.0 license
  */
  var defaults = {
    // Extra small devices (phones)
    xs: {
      min: 0,
      max: 767
    },
    // Small devices (tablets)
    sm: {
      min: 768,
      max: 991
    },
    // Medium devices (desktops)
    md: {
      min: 992,
      max: 1199
    },
    // Large devices (large desktops)
    lg: {
      min: 1200,
      max: Infinity
    }
  };

  ('use strict');

  var util = {
    each: function each(obj, fn) {
      var continues = void 0;

      for (var i in obj) {
        if (
          (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) !==
            'object' ||
          obj.hasOwnProperty(i)
        ) {
          continues = fn(i, obj[i]);
          if (continues === false) {
            break; //allow early exit
          }
        }
      }
    },

    isFunction: function isFunction(obj) {
      return typeof obj === 'function' || false;
    },

    extend: function extend(obj, source) {
      for (var property in source) {
        obj[property] = source[property];
      }
      return obj;
    }
  };

  var Callbacks = (function() {
    function Callbacks() {
      _classCallCheck(this, Callbacks);

      this.length = 0;
      this.list = [];
    }

    _createClass(Callbacks, [
      {
        key: 'add',
        value: function add(fn, data) {
          var one =
            arguments.length > 2 && arguments[2] !== undefined
              ? arguments[2]
              : false;

          this.list.push({
            fn: fn,
            data: data,
            one: one
          });

          this.length++;
        }
      },
      {
        key: 'remove',
        value: function remove(fn) {
          for (var i = 0; i < this.list.length; i++) {
            if (this.list[i].fn === fn) {
              this.list.splice(i, 1);
              this.length--;
              i--;
            }
          }
        }
      },
      {
        key: 'empty',
        value: function empty() {
          this.list = [];
          this.length = 0;
        }
      },
      {
        key: 'call',
        value: function call(caller, i) {
          var fn =
            arguments.length > 2 && arguments[2] !== undefined
              ? arguments[2]
              : null;

          if (!i) {
            i = this.length - 1;
          }
          var callback = this.list[i];

          if (util.isFunction(fn)) {
            fn.call(this, caller, callback, i);
          } else if (util.isFunction(callback.fn)) {
            callback.fn.call(caller || window, callback.data);
          }

          if (callback.one) {
            delete this.list[i];
            this.length--;
          }
        }
      },
      {
        key: 'fire',
        value: function fire(caller) {
          var fn =
            arguments.length > 1 && arguments[1] !== undefined
              ? arguments[1]
              : null;

          for (var i in this.list) {
            if (this.list.hasOwnProperty(i)) {
              this.call(caller, i, fn);
            }
          }
        }
      }
    ]);

    return Callbacks;
  })();

  ('use strict');

  var ChangeEvent = {
    current: null,
    callbacks: new Callbacks(),
    trigger: function trigger(size) {
      var previous = this.current;
      this.current = size;
      this.callbacks.fire(size, function(caller, callback) {
        if (util.isFunction(callback.fn)) {
          callback.fn.call(
            {
              current: size,
              previous: previous
            },
            callback.data
          );
        }
      });
    },
    one: function one(data, fn) {
      return this.on(data, fn, true);
    },
    on: function on(data, fn) {
      var one =
        arguments.length > 2 && arguments[2] !== undefined
          ? arguments[2]
          : false;

      if (typeof fn === 'undefined' && util.isFunction(data)) {
        fn = data;
        data = undefined;
      }
      if (util.isFunction(fn)) {
        this.callbacks.add(fn, data, one);
      }
    },
    off: function off(fn) {
      if (typeof fn === 'undefined') {
        this.callbacks.empty();
      }
    }
  };

  var MediaQuery = (function() {
    function MediaQuery(name, media) {
      _classCallCheck(this, MediaQuery);

      this.name = name;
      this.media = media;

      this.initialize();
    }

    _createClass(MediaQuery, [
      {
        key: 'initialize',
        value: function initialize() {
          this.callbacks = {
            enter: new Callbacks(),
            leave: new Callbacks()
          };

          this.mql = (window.matchMedia && window.matchMedia(this.media)) || {
            matches: false,
            media: this.media,
            addListener: function addListener() {
              // do nothing
            },
            removeListener: function removeListener() {
              // do nothing
            }
          };

          var that = this;
          this.mqlListener = function(mql) {
            var type = (mql.matches && 'enter') || 'leave';

            that.callbacks[type].fire(that);
          };
          this.mql.addListener(this.mqlListener);
        }
      },
      {
        key: 'on',
        value: function on(types, data, fn) {
          var one =
            arguments.length > 3 && arguments[3] !== undefined
              ? arguments[3]
              : false;

          if (
            (typeof types === 'undefined' ? 'undefined' : _typeof(types)) ===
            'object'
          ) {
            for (var type in types) {
              if (types.hasOwnProperty(type)) {
                this.on(type, data, types[type], one);
              }
            }
            return this;
          }

          if (typeof fn === 'undefined' && util.isFunction(data)) {
            fn = data;
            data = undefined;
          }

          if (!util.isFunction(fn)) {
            return this;
          }

          if (typeof this.callbacks[types] !== 'undefined') {
            this.callbacks[types].add(fn, data, one);

            if (types === 'enter' && this.isMatched()) {
              this.callbacks[types].call(this);
            }
          }

          return this;
        }
      },
      {
        key: 'one',
        value: function one(types, data, fn) {
          return this.on(types, data, fn, true);
        }
      },
      {
        key: 'off',
        value: function off(types, fn) {
          var type = void 0;

          if (
            (typeof types === 'undefined' ? 'undefined' : _typeof(types)) ===
            'object'
          ) {
            for (type in types) {
              if (types.hasOwnProperty(type)) {
                this.off(type, types[type]);
              }
            }
            return this;
          }

          if (typeof types === 'undefined') {
            this.callbacks.enter.empty();
            this.callbacks.leave.empty();
          } else if (types in this.callbacks) {
            if (fn) {
              this.callbacks[types].remove(fn);
            } else {
              this.callbacks[types].empty();
            }
          }

          return this;
        }
      },
      {
        key: 'isMatched',
        value: function isMatched() {
          return this.mql.matches;
        }
      },
      {
        key: 'destroy',
        value: function destroy() {
          this.off();
        }
      }
    ]);

    return MediaQuery;
  })();

  ('use strict');

  var MediaBuilder = {
    min: function min(_min) {
      var unit =
        arguments.length > 1 && arguments[1] !== undefined
          ? arguments[1]
          : 'px';

      return '(min-width: ' + _min + unit + ')';
    },
    max: function max(_max) {
      var unit =
        arguments.length > 1 && arguments[1] !== undefined
          ? arguments[1]
          : 'px';

      return '(max-width: ' + _max + unit + ')';
    },
    between: function between(min, max) {
      var unit =
        arguments.length > 2 && arguments[2] !== undefined
          ? arguments[2]
          : 'px';

      return (
        '(min-width: ' + min + unit + ') and (max-width: ' + max + unit + ')'
      );
    },
    get: function get(min, max) {
      var unit =
        arguments.length > 2 && arguments[2] !== undefined
          ? arguments[2]
          : 'px';

      if (min === 0) {
        return this.max(max, unit);
      }
      if (max === Infinity) {
        return this.min(min, unit);
      }
      return this.between(min, max, unit);
    }
  };

  var Size = (function(_MediaQuery) {
    _inherits(Size, _MediaQuery);

    function Size(name) {
      var min =
        arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var max =
        arguments.length > 2 && arguments[2] !== undefined
          ? arguments[2]
          : Infinity;
      var unit =
        arguments.length > 3 && arguments[3] !== undefined
          ? arguments[3]
          : 'px';

      _classCallCheck(this, Size);

      var media = MediaBuilder.get(min, max, unit);

      var _this = _possibleConstructorReturn(
        this,
        (Size.__proto__ || Object.getPrototypeOf(Size)).call(this, name, media)
      );

      _this.min = min;
      _this.max = max;
      _this.unit = unit;

      var that = _this;
      _this.changeListener = function() {
        if (that.isMatched()) {
          ChangeEvent.trigger(that);
        }
      };
      if (_this.isMatched()) {
        ChangeEvent.current = _this;
      }

      _this.mql.addListener(_this.changeListener);
      return _this;
    }

    _createClass(Size, [
      {
        key: 'destroy',
        value: function destroy() {
          this.off();
          this.mql.removeListener(this.changeHander);
        }
      }
    ]);

    return Size;
  })(MediaQuery);

  var UnionSize = (function(_MediaQuery2) {
    _inherits(UnionSize, _MediaQuery2);

    function UnionSize(names) {
      _classCallCheck(this, UnionSize);

      var sizes = [];
      var media = [];

      util.each(names.split(' '), function(i, name) {
        var size = Breakpoints$1.get(name);
        if (size) {
          sizes.push(size);
          media.push(size.media);
        }
      });

      return _possibleConstructorReturn(
        this,
        (UnionSize.__proto__ || Object.getPrototypeOf(UnionSize))
          .call(this, names, media.join(','))
      );
    }

    return UnionSize;
  })(MediaQuery);

  var info = {
    version: '1.0.5'
  };

  ('use strict');

  var sizes = {};
  var unionSizes = {};

  var Breakpoints = (window.Breakpoints = function() {
    for (
      var _len = arguments.length, args = Array(_len), _key = 0;
      _key < _len;
      _key++
    ) {
      args[_key] = arguments[_key];
    }

    Breakpoints.define.apply(Breakpoints, args);
  });

  Breakpoints.defaults = defaults;

  Breakpoints = util.extend(Breakpoints, {
    version: info.version,
    defined: false,
    define: function define(values) {
      var options =
        arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      if (this.defined) {
        this.destroy();
      }

      if (!values) {
        values = Breakpoints.defaults;
      }

      this.options = util.extend(options, {
        unit: 'px'
      });

      for (var size in values) {
        if (values.hasOwnProperty(size)) {
          this.set(size, values[size].min, values[size].max, this.options.unit);
        }
      }

      this.defined = true;
    },
    destroy: function destroy() {
      util.each(sizes, function(name, size) {
        size.destroy();
      });
      sizes = {};
      ChangeEvent.current = null;
    },
    is: function is(size) {
      var breakpoint = this.get(size);
      if (!breakpoint) {
        return null;
      }

      return breakpoint.isMatched();
    },
    all: function all() {
      var names = [];
      util.each(sizes, function(name) {
        names.push(name);
      });
      return names;
    },

    set: function set(name) {
      var min =
        arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var max =
        arguments.length > 2 && arguments[2] !== undefined
          ? arguments[2]
          : Infinity;
      var unit =
        arguments.length > 3 && arguments[3] !== undefined
          ? arguments[3]
          : 'px';

      var size = this.get(name);
      if (size) {
        size.destroy();
      }

      sizes[name] = new Size(name, min, max, unit);
      return sizes[name];
    },

    get: function get(size) {
      if (sizes.hasOwnProperty(size)) {
        return sizes[size];
      }

      return null;
    },

    getUnion: function getUnion(sizes) {
      if (unionSizes.hasOwnProperty(sizes)) {
        return unionSizes[sizes];
      }

      unionSizes[sizes] = new UnionSize(sizes);

      return unionSizes[sizes];
    },
    getMin: function getMin(size) {
      var obj = this.get(size);
      if (obj) {
        return obj.min;
      }
      return null;
    },
    getMax: function getMax(size) {
      var obj = this.get(size);
      if (obj) {
        return obj.max;
      }
      return null;
    },
    current: function current() {
      return ChangeEvent.current;
    },
    getMedia: function getMedia(size) {
      var obj = this.get(size);
      if (obj) {
        return obj.media;
      }
      return null;
    },
    on: function on(sizes, types, data, fn) {
      var one =
        arguments.length > 4 && arguments[4] !== undefined
          ? arguments[4]
          : false;

      sizes = sizes.trim();

      if (sizes === 'change') {
        fn = data;
        data = types;
        return ChangeEvent.on(data, fn, one);
      }
      if (sizes.includes(' ')) {
        var union = this.getUnion(sizes);

        if (union) {
          union.on(types, data, fn, one);
        }
      } else {
        var size = this.get(sizes);

        if (size) {
          size.on(types, data, fn, one);
        }
      }

      return this;
    },
    one: function one(sizes, types, data, fn) {
      return this.on(sizes, types, data, fn, true);
    },
    off: function off(sizes, types, fn) {
      sizes = sizes.trim();

      if (sizes === 'change') {
        return ChangeEvent.off(types);
      }

      if (sizes.includes(' ')) {
        var union = this.getUnion(sizes);

        if (union) {
          union.off(types, fn);
        }
      } else {
        var size = this.get(sizes);

        if (size) {
          size.off(types, fn);
        }
      }

      return this;
    }
  });

  var Breakpoints$1 = Breakpoints;

  exports.default = Breakpoints$1;
});
(function (global) {
  var babelHelpers = global.babelHelpers = {};
  babelHelpers.typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  babelHelpers.jsx = function () {
    var REACT_ELEMENT_TYPE = typeof Symbol === "function" && Symbol.for && Symbol.for("react.element") || 0xeac7;
    return function createRawReactElement(type, props, key, children) {
      var defaultProps = type && type.defaultProps;
      var childrenLength = arguments.length - 3;

      if (!props && childrenLength !== 0) {
        props = {};
      }

      if (props && defaultProps) {
        for (var propName in defaultProps) {
          if (props[propName] === void 0) {
            props[propName] = defaultProps[propName];
          }
        }
      } else if (!props) {
        props = defaultProps || {};
      }

      if (childrenLength === 1) {
        props.children = children;
      } else if (childrenLength > 1) {
        var childArray = Array(childrenLength);

        for (var i = 0; i < childrenLength; i++) {
          childArray[i] = arguments[i + 3];
        }

        props.children = childArray;
      }

      return {
        $$typeof: REACT_ELEMENT_TYPE,
        type: type,
        key: key === undefined ? null : '' + key,
        ref: null,
        props: props,
        _owner: null
      };
    };
  }();

  babelHelpers.asyncIterator = function (iterable) {
    if (typeof Symbol === "function") {
      if (Symbol.asyncIterator) {
        var method = iterable[Symbol.asyncIterator];
        if (method != null) return method.call(iterable);
      }

      if (Symbol.iterator) {
        return iterable[Symbol.iterator]();
      }
    }

    throw new TypeError("Object is not async iterable");
  };

  babelHelpers.asyncGenerator = function () {
    function AwaitValue(value) {
      this.value = value;
    }

    function AsyncGenerator(gen) {
      var front, back;

      function send(key, arg) {
        return new Promise(function (resolve, reject) {
          var request = {
            key: key,
            arg: arg,
            resolve: resolve,
            reject: reject,
            next: null
          };

          if (back) {
            back = back.next = request;
          } else {
            front = back = request;
            resume(key, arg);
          }
        });
      }

      function resume(key, arg) {
        try {
          var result = gen[key](arg);
          var value = result.value;

          if (value instanceof AwaitValue) {
            Promise.resolve(value.value).then(function (arg) {
              resume("next", arg);
            }, function (arg) {
              resume("throw", arg);
            });
          } else {
            settle(result.done ? "return" : "normal", result.value);
          }
        } catch (err) {
          settle("throw", err);
        }
      }

      function settle(type, value) {
        switch (type) {
          case "return":
            front.resolve({
              value: value,
              done: true
            });
            break;

          case "throw":
            front.reject(value);
            break;

          default:
            front.resolve({
              value: value,
              done: false
            });
            break;
        }

        front = front.next;

        if (front) {
          resume(front.key, front.arg);
        } else {
          back = null;
        }
      }

      this._invoke = send;

      if (typeof gen.return !== "function") {
        this.return = undefined;
      }
    }

    if (typeof Symbol === "function" && Symbol.asyncIterator) {
      AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
        return this;
      };
    }

    AsyncGenerator.prototype.next = function (arg) {
      return this._invoke("next", arg);
    };

    AsyncGenerator.prototype.throw = function (arg) {
      return this._invoke("throw", arg);
    };

    AsyncGenerator.prototype.return = function (arg) {
      return this._invoke("return", arg);
    };

    return {
      wrap: function (fn) {
        return function () {
          return new AsyncGenerator(fn.apply(this, arguments));
        };
      },
      await: function (value) {
        return new AwaitValue(value);
      }
    };
  }();

  babelHelpers.asyncGeneratorDelegate = function (inner, awaitWrap) {
    var iter = {},
        waiting = false;

    function pump(key, value) {
      waiting = true;
      value = new Promise(function (resolve) {
        resolve(inner[key](value));
      });
      return {
        done: false,
        value: awaitWrap(value)
      };
    }

    ;

    if (typeof Symbol === "function" && Symbol.iterator) {
      iter[Symbol.iterator] = function () {
        return this;
      };
    }

    iter.next = function (value) {
      if (waiting) {
        waiting = false;
        return value;
      }

      return pump("next", value);
    };

    if (typeof inner.throw === "function") {
      iter.throw = function (value) {
        if (waiting) {
          waiting = false;
          throw value;
        }

        return pump("throw", value);
      };
    }

    if (typeof inner.return === "function") {
      iter.return = function (value) {
        return pump("return", value);
      };
    }

    return iter;
  };

  babelHelpers.asyncToGenerator = function (fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(function (value) {
              step("next", value);
            }, function (err) {
              step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  };

  babelHelpers.classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  babelHelpers.createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  babelHelpers.defineEnumerableProperties = function (obj, descs) {
    for (var key in descs) {
      var desc = descs[key];
      desc.configurable = desc.enumerable = true;
      if ("value" in desc) desc.writable = true;
      Object.defineProperty(obj, key, desc);
    }

    return obj;
  };

  babelHelpers.defaults = function (obj, defaults) {
    var keys = Object.getOwnPropertyNames(defaults);

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var value = Object.getOwnPropertyDescriptor(defaults, key);

      if (value && value.configurable && obj[key] === undefined) {
        Object.defineProperty(obj, key, value);
      }
    }

    return obj;
  };

  babelHelpers.defineProperty = function (obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  };

  babelHelpers.extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  babelHelpers.get = function get(object, property, receiver) {
    if (object === null) object = Function.prototype;
    var desc = Object.getOwnPropertyDescriptor(object, property);

    if (desc === undefined) {
      var parent = Object.getPrototypeOf(object);

      if (parent === null) {
        return undefined;
      } else {
        return get(parent, property, receiver);
      }
    } else if ("value" in desc) {
      return desc.value;
    } else {
      var getter = desc.get;

      if (getter === undefined) {
        return undefined;
      }

      return getter.call(receiver);
    }
  };

  babelHelpers.inherits = function (subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  };

  babelHelpers.instanceof = function (left, right) {
    if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
      return right[Symbol.hasInstance](left);
    } else {
      return left instanceof right;
    }
  };

  babelHelpers.interopRequireDefault = function (obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  };

  babelHelpers.interopRequireWildcard = function (obj) {
    if (obj && obj.__esModule) {
      return obj;
    } else {
      var newObj = {};

      if (obj != null) {
        for (var key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
        }
      }

      newObj.default = obj;
      return newObj;
    }
  };

  babelHelpers.newArrowCheck = function (innerThis, boundThis) {
    if (innerThis !== boundThis) {
      throw new TypeError("Cannot instantiate an arrow function");
    }
  };

  babelHelpers.objectDestructuringEmpty = function (obj) {
    if (obj == null) throw new TypeError("Cannot destructure undefined");
  };

  babelHelpers.objectWithoutProperties = function (obj, keys) {
    var target = {};

    for (var i in obj) {
      if (keys.indexOf(i) >= 0) continue;
      if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
      target[i] = obj[i];
    }

    return target;
  };

  babelHelpers.possibleConstructorReturn = function (self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  };

  babelHelpers.selfGlobal = typeof global === "undefined" ? self : global;

  babelHelpers.set = function set(object, property, value, receiver) {
    var desc = Object.getOwnPropertyDescriptor(object, property);

    if (desc === undefined) {
      var parent = Object.getPrototypeOf(object);

      if (parent !== null) {
        set(parent, property, value, receiver);
      }
    } else if ("value" in desc && desc.writable) {
      desc.value = value;
    } else {
      var setter = desc.set;

      if (setter !== undefined) {
        setter.call(receiver, value);
      }
    }

    return value;
  };

  babelHelpers.slicedToArray = function () {
    function sliceIterator(arr, i) {
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = undefined;

      try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);

          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"]) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }

      return _arr;
    }

    return function (arr, i) {
      if (Array.isArray(arr)) {
        return arr;
      } else if (Symbol.iterator in Object(arr)) {
        return sliceIterator(arr, i);
      } else {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      }
    };
  }();

  babelHelpers.slicedToArrayLoose = function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      var _arr = [];

      for (var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) {
        _arr.push(_step.value);

        if (i && _arr.length === i) break;
      }

      return _arr;
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };

  babelHelpers.taggedTemplateLiteral = function (strings, raw) {
    return Object.freeze(Object.defineProperties(strings, {
      raw: {
        value: Object.freeze(raw)
      }
    }));
  };

  babelHelpers.taggedTemplateLiteralLoose = function (strings, raw) {
    strings.raw = raw;
    return strings;
  };

  babelHelpers.temporalRef = function (val, name, undef) {
    if (val === undef) {
      throw new ReferenceError(name + " is not defined - temporal dead zone");
    } else {
      return val;
    }
  };

  babelHelpers.temporalUndefined = {};

  babelHelpers.toArray = function (arr) {
    return Array.isArray(arr) ? arr : Array.from(arr);
  };

  babelHelpers.toConsumableArray = function (arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    } else {
      return Array.from(arr);
    }
  };
})(typeof global === "undefined" ? self : global);
/**!
 * @fileOverview Kickass library to create and place poppers near their reference elements.
 * @version 1.12.6
 * @license
 * Copyright (c) 2016 Federico Zivolo and contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Popper = factory());
}(this, (function () { 'use strict';

var isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';
var longerTimeoutBrowsers = ['Edge', 'Trident', 'Firefox'];
var timeoutDuration = 0;
for (var i = 0; i < longerTimeoutBrowsers.length; i += 1) {
  if (isBrowser && navigator.userAgent.indexOf(longerTimeoutBrowsers[i]) >= 0) {
    timeoutDuration = 1;
    break;
  }
}

function microtaskDebounce(fn) {
  var called = false;
  return function () {
    if (called) {
      return;
    }
    called = true;
    Promise.resolve().then(function () {
      called = false;
      fn();
    });
  };
}

function taskDebounce(fn) {
  var scheduled = false;
  return function () {
    if (!scheduled) {
      scheduled = true;
      setTimeout(function () {
        scheduled = false;
        fn();
      }, timeoutDuration);
    }
  };
}

var supportsMicroTasks = isBrowser && window.Promise;

/**
* Create a debounced version of a method, that's asynchronously deferred
* but called in the minimum time possible.
*
* @method
* @memberof Popper.Utils
* @argument {Function} fn
* @returns {Function}
*/
var debounce = supportsMicroTasks ? microtaskDebounce : taskDebounce;

/**
 * Check if the given variable is a function
 * @method
 * @memberof Popper.Utils
 * @argument {Any} functionToCheck - variable to check
 * @returns {Boolean} answer to: is a function?
 */
function isFunction(functionToCheck) {
  var getType = {};
  return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}

/**
 * Get CSS computed property of the given element
 * @method
 * @memberof Popper.Utils
 * @argument {Eement} element
 * @argument {String} property
 */
function getStyleComputedProperty(element, property) {
  if (element.nodeType !== 1) {
    return [];
  }
  // NOTE: 1 DOM access here
  var css = window.getComputedStyle(element, null);
  return property ? css[property] : css;
}

/**
 * Returns the parentNode or the host of the element
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @returns {Element} parent
 */
function getParentNode(element) {
  if (element.nodeName === 'HTML') {
    return element;
  }
  return element.parentNode || element.host;
}

/**
 * Returns the scrolling parent of the given element
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @returns {Element} scroll parent
 */
function getScrollParent(element) {
  // Return body, `getScroll` will take care to get the correct `scrollTop` from it
  if (!element) {
    return window.document.body;
  }

  switch (element.nodeName) {
    case 'HTML':
    case 'BODY':
      return element.ownerDocument.body;
    case '#document':
      return element.body;
  }

  // Firefox want us to check `-x` and `-y` variations as well

  var _getStyleComputedProp = getStyleComputedProperty(element),
      overflow = _getStyleComputedProp.overflow,
      overflowX = _getStyleComputedProp.overflowX,
      overflowY = _getStyleComputedProp.overflowY;

  if (/(auto|scroll)/.test(overflow + overflowY + overflowX)) {
    return element;
  }

  return getScrollParent(getParentNode(element));
}

/**
 * Returns the offset parent of the given element
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @returns {Element} offset parent
 */
function getOffsetParent(element) {
  // NOTE: 1 DOM access here
  var offsetParent = element && element.offsetParent;
  var nodeName = offsetParent && offsetParent.nodeName;

  if (!nodeName || nodeName === 'BODY' || nodeName === 'HTML') {
    if (element) {
      return element.ownerDocument.documentElement;
    }

    return window.document.documentElement;
  }

  // .offsetParent will return the closest TD or TABLE in case
  // no offsetParent is present, I hate this job...
  if (['TD', 'TABLE'].indexOf(offsetParent.nodeName) !== -1 && getStyleComputedProperty(offsetParent, 'position') === 'static') {
    return getOffsetParent(offsetParent);
  }

  return offsetParent;
}

function isOffsetContainer(element) {
  var nodeName = element.nodeName;

  if (nodeName === 'BODY') {
    return false;
  }
  return nodeName === 'HTML' || getOffsetParent(element.firstElementChild) === element;
}

/**
 * Finds the root node (document, shadowDOM root) of the given element
 * @method
 * @memberof Popper.Utils
 * @argument {Element} node
 * @returns {Element} root node
 */
function getRoot(node) {
  if (node.parentNode !== null) {
    return getRoot(node.parentNode);
  }

  return node;
}

/**
 * Finds the offset parent common to the two provided nodes
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element1
 * @argument {Element} element2
 * @returns {Element} common offset parent
 */
function findCommonOffsetParent(element1, element2) {
  // This check is needed to avoid errors in case one of the elements isn't defined for any reason
  if (!element1 || !element1.nodeType || !element2 || !element2.nodeType) {
    return window.document.documentElement;
  }

  // Here we make sure to give as "start" the element that comes first in the DOM
  var order = element1.compareDocumentPosition(element2) & Node.DOCUMENT_POSITION_FOLLOWING;
  var start = order ? element1 : element2;
  var end = order ? element2 : element1;

  // Get common ancestor container
  var range = document.createRange();
  range.setStart(start, 0);
  range.setEnd(end, 0);
  var commonAncestorContainer = range.commonAncestorContainer;

  // Both nodes are inside #document

  if (element1 !== commonAncestorContainer && element2 !== commonAncestorContainer || start.contains(end)) {
    if (isOffsetContainer(commonAncestorContainer)) {
      return commonAncestorContainer;
    }

    return getOffsetParent(commonAncestorContainer);
  }

  // one of the nodes is inside shadowDOM, find which one
  var element1root = getRoot(element1);
  if (element1root.host) {
    return findCommonOffsetParent(element1root.host, element2);
  } else {
    return findCommonOffsetParent(element1, getRoot(element2).host);
  }
}

/**
 * Gets the scroll value of the given element in the given side (top and left)
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @argument {String} side `top` or `left`
 * @returns {number} amount of scrolled pixels
 */
function getScroll(element) {
  var side = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'top';

  var upperSide = side === 'top' ? 'scrollTop' : 'scrollLeft';
  var nodeName = element.nodeName;

  if (nodeName === 'BODY' || nodeName === 'HTML') {
    var html = element.ownerDocument.documentElement;
    var scrollingElement = element.ownerDocument.scrollingElement || html;
    return scrollingElement[upperSide];
  }

  return element[upperSide];
}

/*
 * Sum or subtract the element scroll values (left and top) from a given rect object
 * @method
 * @memberof Popper.Utils
 * @param {Object} rect - Rect object you want to change
 * @param {HTMLElement} element - The element from the function reads the scroll values
 * @param {Boolean} subtract - set to true if you want to subtract the scroll values
 * @return {Object} rect - The modifier rect object
 */
function includeScroll(rect, element) {
  var subtract = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  var scrollTop = getScroll(element, 'top');
  var scrollLeft = getScroll(element, 'left');
  var modifier = subtract ? -1 : 1;
  rect.top += scrollTop * modifier;
  rect.bottom += scrollTop * modifier;
  rect.left += scrollLeft * modifier;
  rect.right += scrollLeft * modifier;
  return rect;
}

/*
 * Helper to detect borders of a given element
 * @method
 * @memberof Popper.Utils
 * @param {CSSStyleDeclaration} styles
 * Result of `getStyleComputedProperty` on the given element
 * @param {String} axis - `x` or `y`
 * @return {number} borders - The borders size of the given axis
 */

function getBordersSize(styles, axis) {
  var sideA = axis === 'x' ? 'Left' : 'Top';
  var sideB = sideA === 'Left' ? 'Right' : 'Bottom';

  return +styles['border' + sideA + 'Width'].split('px')[0] + +styles['border' + sideB + 'Width'].split('px')[0];
}

/**
 * Tells if you are running Internet Explorer 10
 * @method
 * @memberof Popper.Utils
 * @returns {Boolean} isIE10
 */
var isIE10 = undefined;

var isIE10$1 = function () {
  if (isIE10 === undefined) {
    isIE10 = navigator.appVersion.indexOf('MSIE 10') !== -1;
  }
  return isIE10;
};

function getSize(axis, body, html, computedStyle) {
  return Math.max(body['offset' + axis], body['scroll' + axis], html['client' + axis], html['offset' + axis], html['scroll' + axis], isIE10$1() ? html['offset' + axis] + computedStyle['margin' + (axis === 'Height' ? 'Top' : 'Left')] + computedStyle['margin' + (axis === 'Height' ? 'Bottom' : 'Right')] : 0);
}

function getWindowSizes() {
  var body = window.document.body;
  var html = window.document.documentElement;
  var computedStyle = isIE10$1() && window.getComputedStyle(html);

  return {
    height: getSize('Height', body, html, computedStyle),
    width: getSize('Width', body, html, computedStyle)
  };
}

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();





var defineProperty = function (obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

/**
 * Given element offsets, generate an output similar to getBoundingClientRect
 * @method
 * @memberof Popper.Utils
 * @argument {Object} offsets
 * @returns {Object} ClientRect like output
 */
function getClientRect(offsets) {
  return _extends({}, offsets, {
    right: offsets.left + offsets.width,
    bottom: offsets.top + offsets.height
  });
}

/**
 * Get bounding client rect of given element
 * @method
 * @memberof Popper.Utils
 * @param {HTMLElement} element
 * @return {Object} client rect
 */
function getBoundingClientRect(element) {
  var rect = {};

  // IE10 10 FIX: Please, don't ask, the element isn't
  // considered in DOM in some circumstances...
  // This isn't reproducible in IE10 compatibility mode of IE11
  if (isIE10$1()) {
    try {
      rect = element.getBoundingClientRect();
      var scrollTop = getScroll(element, 'top');
      var scrollLeft = getScroll(element, 'left');
      rect.top += scrollTop;
      rect.left += scrollLeft;
      rect.bottom += scrollTop;
      rect.right += scrollLeft;
    } catch (err) {}
  } else {
    rect = element.getBoundingClientRect();
  }

  var result = {
    left: rect.left,
    top: rect.top,
    width: rect.right - rect.left,
    height: rect.bottom - rect.top
  };

  // subtract scrollbar size from sizes
  var sizes = element.nodeName === 'HTML' ? getWindowSizes() : {};
  var width = sizes.width || element.clientWidth || result.right - result.left;
  var height = sizes.height || element.clientHeight || result.bottom - result.top;

  var horizScrollbar = element.offsetWidth - width;
  var vertScrollbar = element.offsetHeight - height;

  // if an hypothetical scrollbar is detected, we must be sure it's not a `border`
  // we make this check conditional for performance reasons
  if (horizScrollbar || vertScrollbar) {
    var styles = getStyleComputedProperty(element);
    horizScrollbar -= getBordersSize(styles, 'x');
    vertScrollbar -= getBordersSize(styles, 'y');

    result.width -= horizScrollbar;
    result.height -= vertScrollbar;
  }

  return getClientRect(result);
}

function getOffsetRectRelativeToArbitraryNode(children, parent) {
  var isIE10 = isIE10$1();
  var isHTML = parent.nodeName === 'HTML';
  var childrenRect = getBoundingClientRect(children);
  var parentRect = getBoundingClientRect(parent);
  var scrollParent = getScrollParent(children);

  var styles = getStyleComputedProperty(parent);
  var borderTopWidth = +styles.borderTopWidth.split('px')[0];
  var borderLeftWidth = +styles.borderLeftWidth.split('px')[0];

  var offsets = getClientRect({
    top: childrenRect.top - parentRect.top - borderTopWidth,
    left: childrenRect.left - parentRect.left - borderLeftWidth,
    width: childrenRect.width,
    height: childrenRect.height
  });
  offsets.marginTop = 0;
  offsets.marginLeft = 0;

  // Subtract margins of documentElement in case it's being used as parent
  // we do this only on HTML because it's the only element that behaves
  // differently when margins are applied to it. The margins are included in
  // the box of the documentElement, in the other cases not.
  if (!isIE10 && isHTML) {
    var marginTop = +styles.marginTop.split('px')[0];
    var marginLeft = +styles.marginLeft.split('px')[0];

    offsets.top -= borderTopWidth - marginTop;
    offsets.bottom -= borderTopWidth - marginTop;
    offsets.left -= borderLeftWidth - marginLeft;
    offsets.right -= borderLeftWidth - marginLeft;

    // Attach marginTop and marginLeft because in some circumstances we may need them
    offsets.marginTop = marginTop;
    offsets.marginLeft = marginLeft;
  }

  if (isIE10 ? parent.contains(scrollParent) : parent === scrollParent && scrollParent.nodeName !== 'BODY') {
    offsets = includeScroll(offsets, parent);
  }

  return offsets;
}

function getViewportOffsetRectRelativeToArtbitraryNode(element) {
  var html = element.ownerDocument.documentElement;
  var relativeOffset = getOffsetRectRelativeToArbitraryNode(element, html);
  var width = Math.max(html.clientWidth, window.innerWidth || 0);
  var height = Math.max(html.clientHeight, window.innerHeight || 0);

  var scrollTop = getScroll(html);
  var scrollLeft = getScroll(html, 'left');

  var offset = {
    top: scrollTop - relativeOffset.top + relativeOffset.marginTop,
    left: scrollLeft - relativeOffset.left + relativeOffset.marginLeft,
    width: width,
    height: height
  };

  return getClientRect(offset);
}

/**
 * Check if the given element is fixed or is inside a fixed parent
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @argument {Element} customContainer
 * @returns {Boolean} answer to "isFixed?"
 */
function isFixed(element) {
  var nodeName = element.nodeName;
  if (nodeName === 'BODY' || nodeName === 'HTML') {
    return false;
  }
  if (getStyleComputedProperty(element, 'position') === 'fixed') {
    return true;
  }
  return isFixed(getParentNode(element));
}

/**
 * Computed the boundaries limits and return them
 * @method
 * @memberof Popper.Utils
 * @param {HTMLElement} popper
 * @param {HTMLElement} reference
 * @param {number} padding
 * @param {HTMLElement} boundariesElement - Element used to define the boundaries
 * @returns {Object} Coordinates of the boundaries
 */
function getBoundaries(popper, reference, padding, boundariesElement) {
  // NOTE: 1 DOM access here
  var boundaries = { top: 0, left: 0 };
  var offsetParent = findCommonOffsetParent(popper, reference);

  // Handle viewport case
  if (boundariesElement === 'viewport') {
    boundaries = getViewportOffsetRectRelativeToArtbitraryNode(offsetParent);
  } else {
    // Handle other cases based on DOM element used as boundaries
    var boundariesNode = void 0;
    if (boundariesElement === 'scrollParent') {
      boundariesNode = getScrollParent(getParentNode(popper));
      if (boundariesNode.nodeName === 'BODY') {
        boundariesNode = popper.ownerDocument.documentElement;
      }
    } else if (boundariesElement === 'window') {
      boundariesNode = popper.ownerDocument.documentElement;
    } else {
      boundariesNode = boundariesElement;
    }

    var offsets = getOffsetRectRelativeToArbitraryNode(boundariesNode, offsetParent);

    // In case of HTML, we need a different computation
    if (boundariesNode.nodeName === 'HTML' && !isFixed(offsetParent)) {
      var _getWindowSizes = getWindowSizes(),
          height = _getWindowSizes.height,
          width = _getWindowSizes.width;

      boundaries.top += offsets.top - offsets.marginTop;
      boundaries.bottom = height + offsets.top;
      boundaries.left += offsets.left - offsets.marginLeft;
      boundaries.right = width + offsets.left;
    } else {
      // for all the other DOM elements, this one is good
      boundaries = offsets;
    }
  }

  // Add paddings
  boundaries.left += padding;
  boundaries.top += padding;
  boundaries.right -= padding;
  boundaries.bottom -= padding;

  return boundaries;
}

function getArea(_ref) {
  var width = _ref.width,
      height = _ref.height;

  return width * height;
}

/**
 * Utility used to transform the `auto` placement to the placement with more
 * available space.
 * @method
 * @memberof Popper.Utils
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function computeAutoPlacement(placement, refRect, popper, reference, boundariesElement) {
  var padding = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;

  if (placement.indexOf('auto') === -1) {
    return placement;
  }

  var boundaries = getBoundaries(popper, reference, padding, boundariesElement);

  var rects = {
    top: {
      width: boundaries.width,
      height: refRect.top - boundaries.top
    },
    right: {
      width: boundaries.right - refRect.right,
      height: boundaries.height
    },
    bottom: {
      width: boundaries.width,
      height: boundaries.bottom - refRect.bottom
    },
    left: {
      width: refRect.left - boundaries.left,
      height: boundaries.height
    }
  };

  var sortedAreas = Object.keys(rects).map(function (key) {
    return _extends({
      key: key
    }, rects[key], {
      area: getArea(rects[key])
    });
  }).sort(function (a, b) {
    return b.area - a.area;
  });

  var filteredAreas = sortedAreas.filter(function (_ref2) {
    var width = _ref2.width,
        height = _ref2.height;
    return width >= popper.clientWidth && height >= popper.clientHeight;
  });

  var computedPlacement = filteredAreas.length > 0 ? filteredAreas[0].key : sortedAreas[0].key;

  var variation = placement.split('-')[1];

  return computedPlacement + (variation ? '-' + variation : '');
}

/**
 * Get offsets to the reference element
 * @method
 * @memberof Popper.Utils
 * @param {Object} state
 * @param {Element} popper - the popper element
 * @param {Element} reference - the reference element (the popper will be relative to this)
 * @returns {Object} An object containing the offsets which will be applied to the popper
 */
function getReferenceOffsets(state, popper, reference) {
  var commonOffsetParent = findCommonOffsetParent(popper, reference);
  return getOffsetRectRelativeToArbitraryNode(reference, commonOffsetParent);
}

/**
 * Get the outer sizes of the given element (offset size + margins)
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @returns {Object} object containing width and height properties
 */
function getOuterSizes(element) {
  var styles = window.getComputedStyle(element);
  var x = parseFloat(styles.marginTop) + parseFloat(styles.marginBottom);
  var y = parseFloat(styles.marginLeft) + parseFloat(styles.marginRight);
  var result = {
    width: element.offsetWidth + y,
    height: element.offsetHeight + x
  };
  return result;
}

/**
 * Get the opposite placement of the given one
 * @method
 * @memberof Popper.Utils
 * @argument {String} placement
 * @returns {String} flipped placement
 */
function getOppositePlacement(placement) {
  var hash = { left: 'right', right: 'left', bottom: 'top', top: 'bottom' };
  return placement.replace(/left|right|bottom|top/g, function (matched) {
    return hash[matched];
  });
}

/**
 * Get offsets to the popper
 * @method
 * @memberof Popper.Utils
 * @param {Object} position - CSS position the Popper will get applied
 * @param {HTMLElement} popper - the popper element
 * @param {Object} referenceOffsets - the reference offsets (the popper will be relative to this)
 * @param {String} placement - one of the valid placement options
 * @returns {Object} popperOffsets - An object containing the offsets which will be applied to the popper
 */
function getPopperOffsets(popper, referenceOffsets, placement) {
  placement = placement.split('-')[0];

  // Get popper node sizes
  var popperRect = getOuterSizes(popper);

  // Add position, width and height to our offsets object
  var popperOffsets = {
    width: popperRect.width,
    height: popperRect.height
  };

  // depending by the popper placement we have to compute its offsets slightly differently
  var isHoriz = ['right', 'left'].indexOf(placement) !== -1;
  var mainSide = isHoriz ? 'top' : 'left';
  var secondarySide = isHoriz ? 'left' : 'top';
  var measurement = isHoriz ? 'height' : 'width';
  var secondaryMeasurement = !isHoriz ? 'height' : 'width';

  popperOffsets[mainSide] = referenceOffsets[mainSide] + referenceOffsets[measurement] / 2 - popperRect[measurement] / 2;
  if (placement === secondarySide) {
    popperOffsets[secondarySide] = referenceOffsets[secondarySide] - popperRect[secondaryMeasurement];
  } else {
    popperOffsets[secondarySide] = referenceOffsets[getOppositePlacement(secondarySide)];
  }

  return popperOffsets;
}

/**
 * Mimics the `find` method of Array
 * @method
 * @memberof Popper.Utils
 * @argument {Array} arr
 * @argument prop
 * @argument value
 * @returns index or -1
 */
function find(arr, check) {
  // use native find if supported
  if (Array.prototype.find) {
    return arr.find(check);
  }

  // use `filter` to obtain the same behavior of `find`
  return arr.filter(check)[0];
}

/**
 * Return the index of the matching object
 * @method
 * @memberof Popper.Utils
 * @argument {Array} arr
 * @argument prop
 * @argument value
 * @returns index or -1
 */
function findIndex(arr, prop, value) {
  // use native findIndex if supported
  if (Array.prototype.findIndex) {
    return arr.findIndex(function (cur) {
      return cur[prop] === value;
    });
  }

  // use `find` + `indexOf` if `findIndex` isn't supported
  var match = find(arr, function (obj) {
    return obj[prop] === value;
  });
  return arr.indexOf(match);
}

/**
 * Loop trough the list of modifiers and run them in order,
 * each of them will then edit the data object.
 * @method
 * @memberof Popper.Utils
 * @param {dataObject} data
 * @param {Array} modifiers
 * @param {String} ends - Optional modifier name used as stopper
 * @returns {dataObject}
 */
function runModifiers(modifiers, data, ends) {
  var modifiersToRun = ends === undefined ? modifiers : modifiers.slice(0, findIndex(modifiers, 'name', ends));

  modifiersToRun.forEach(function (modifier) {
    if (modifier['function']) {
      // eslint-disable-line dot-notation
      console.warn('`modifier.function` is deprecated, use `modifier.fn`!');
    }
    var fn = modifier['function'] || modifier.fn; // eslint-disable-line dot-notation
    if (modifier.enabled && isFunction(fn)) {
      // Add properties to offsets to make them a complete clientRect object
      // we do this before each modifier to make sure the previous one doesn't
      // mess with these values
      data.offsets.popper = getClientRect(data.offsets.popper);
      data.offsets.reference = getClientRect(data.offsets.reference);

      data = fn(data, modifier);
    }
  });

  return data;
}

/**
 * Updates the position of the popper, computing the new offsets and applying
 * the new style.<br />
 * Prefer `scheduleUpdate` over `update` because of performance reasons.
 * @method
 * @memberof Popper
 */
function update() {
  // if popper is destroyed, don't perform any further update
  if (this.state.isDestroyed) {
    return;
  }

  var data = {
    instance: this,
    styles: {},
    arrowStyles: {},
    attributes: {},
    flipped: false,
    offsets: {}
  };

  // compute reference element offsets
  data.offsets.reference = getReferenceOffsets(this.state, this.popper, this.reference);

  // compute auto placement, store placement inside the data object,
  // modifiers will be able to edit `placement` if needed
  // and refer to originalPlacement to know the original value
  data.placement = computeAutoPlacement(this.options.placement, data.offsets.reference, this.popper, this.reference, this.options.modifiers.flip.boundariesElement, this.options.modifiers.flip.padding);

  // store the computed placement inside `originalPlacement`
  data.originalPlacement = data.placement;

  // compute the popper offsets
  data.offsets.popper = getPopperOffsets(this.popper, data.offsets.reference, data.placement);
  data.offsets.popper.position = 'absolute';

  // run the modifiers
  data = runModifiers(this.modifiers, data);

  // the first `update` will call `onCreate` callback
  // the other ones will call `onUpdate` callback
  if (!this.state.isCreated) {
    this.state.isCreated = true;
    this.options.onCreate(data);
  } else {
    this.options.onUpdate(data);
  }
}

/**
 * Helper used to know if the given modifier is enabled.
 * @method
 * @memberof Popper.Utils
 * @returns {Boolean}
 */
function isModifierEnabled(modifiers, modifierName) {
  return modifiers.some(function (_ref) {
    var name = _ref.name,
        enabled = _ref.enabled;
    return enabled && name === modifierName;
  });
}

/**
 * Get the prefixed supported property name
 * @method
 * @memberof Popper.Utils
 * @argument {String} property (camelCase)
 * @returns {String} prefixed property (camelCase or PascalCase, depending on the vendor prefix)
 */
function getSupportedPropertyName(property) {
  var prefixes = [false, 'ms', 'Webkit', 'Moz', 'O'];
  var upperProp = property.charAt(0).toUpperCase() + property.slice(1);

  for (var i = 0; i < prefixes.length - 1; i++) {
    var prefix = prefixes[i];
    var toCheck = prefix ? '' + prefix + upperProp : property;
    if (typeof window.document.body.style[toCheck] !== 'undefined') {
      return toCheck;
    }
  }
  return null;
}

/**
 * Destroy the popper
 * @method
 * @memberof Popper
 */
function destroy() {
  this.state.isDestroyed = true;

  // touch DOM only if `applyStyle` modifier is enabled
  if (isModifierEnabled(this.modifiers, 'applyStyle')) {
    this.popper.removeAttribute('x-placement');
    this.popper.style.left = '';
    this.popper.style.position = '';
    this.popper.style.top = '';
    this.popper.style[getSupportedPropertyName('transform')] = '';
  }

  this.disableEventListeners();

  // remove the popper if user explicity asked for the deletion on destroy
  // do not use `remove` because IE11 doesn't support it
  if (this.options.removeOnDestroy) {
    this.popper.parentNode.removeChild(this.popper);
  }
  return this;
}

/**
 * Get the window associated with the element
 * @argument {Element} element
 * @returns {Window}
 */
function getWindow(element) {
  var ownerDocument = element.ownerDocument;
  return ownerDocument ? ownerDocument.defaultView : window;
}

function attachToScrollParents(scrollParent, event, callback, scrollParents) {
  var isBody = scrollParent.nodeName === 'BODY';
  var target = isBody ? scrollParent.ownerDocument.defaultView : scrollParent;
  target.addEventListener(event, callback, { passive: true });

  if (!isBody) {
    attachToScrollParents(getScrollParent(target.parentNode), event, callback, scrollParents);
  }
  scrollParents.push(target);
}

/**
 * Setup needed event listeners used to update the popper position
 * @method
 * @memberof Popper.Utils
 * @private
 */
function setupEventListeners(reference, options, state, updateBound) {
  // Resize event listener on window
  state.updateBound = updateBound;
  getWindow(reference).addEventListener('resize', state.updateBound, { passive: true });

  // Scroll event listener on scroll parents
  var scrollElement = getScrollParent(reference);
  attachToScrollParents(scrollElement, 'scroll', state.updateBound, state.scrollParents);
  state.scrollElement = scrollElement;
  state.eventsEnabled = true;

  return state;
}

/**
 * It will add resize/scroll events and start recalculating
 * position of the popper element when they are triggered.
 * @method
 * @memberof Popper
 */
function enableEventListeners() {
  if (!this.state.eventsEnabled) {
    this.state = setupEventListeners(this.reference, this.options, this.state, this.scheduleUpdate);
  }
}

/**
 * Remove event listeners used to update the popper position
 * @method
 * @memberof Popper.Utils
 * @private
 */
function removeEventListeners(reference, state) {
  // Remove resize event listener on window
  getWindow(reference).removeEventListener('resize', state.updateBound);

  // Remove scroll event listener on scroll parents
  state.scrollParents.forEach(function (target) {
    target.removeEventListener('scroll', state.updateBound);
  });

  // Reset state
  state.updateBound = null;
  state.scrollParents = [];
  state.scrollElement = null;
  state.eventsEnabled = false;
  return state;
}

/**
 * It will remove resize/scroll events and won't recalculate popper position
 * when they are triggered. It also won't trigger onUpdate callback anymore,
 * unless you call `update` method manually.
 * @method
 * @memberof Popper
 */
function disableEventListeners() {
  if (this.state.eventsEnabled) {
    window.cancelAnimationFrame(this.scheduleUpdate);
    this.state = removeEventListeners(this.reference, this.state);
  }
}

/**
 * Tells if a given input is a number
 * @method
 * @memberof Popper.Utils
 * @param {*} input to check
 * @return {Boolean}
 */
function isNumeric(n) {
  return n !== '' && !isNaN(parseFloat(n)) && isFinite(n);
}

/**
 * Set the style to the given popper
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element - Element to apply the style to
 * @argument {Object} styles
 * Object with a list of properties and values which will be applied to the element
 */
function setStyles(element, styles) {
  Object.keys(styles).forEach(function (prop) {
    var unit = '';
    // add unit if the value is numeric and is one of the following
    if (['width', 'height', 'top', 'right', 'bottom', 'left'].indexOf(prop) !== -1 && isNumeric(styles[prop])) {
      unit = 'px';
    }
    element.style[prop] = styles[prop] + unit;
  });
}

/**
 * Set the attributes to the given popper
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element - Element to apply the attributes to
 * @argument {Object} styles
 * Object with a list of properties and values which will be applied to the element
 */
function setAttributes(element, attributes) {
  Object.keys(attributes).forEach(function (prop) {
    var value = attributes[prop];
    if (value !== false) {
      element.setAttribute(prop, attributes[prop]);
    } else {
      element.removeAttribute(prop);
    }
  });
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by `update` method
 * @argument {Object} data.styles - List of style properties - values to apply to popper element
 * @argument {Object} data.attributes - List of attribute properties - values to apply to popper element
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The same data object
 */
function applyStyle(data) {
  // any property present in `data.styles` will be applied to the popper,
  // in this way we can make the 3rd party modifiers add custom styles to it
  // Be aware, modifiers could override the properties defined in the previous
  // lines of this modifier!
  setStyles(data.instance.popper, data.styles);

  // any property present in `data.attributes` will be applied to the popper,
  // they will be set as HTML attributes of the element
  setAttributes(data.instance.popper, data.attributes);

  // if arrowElement is defined and arrowStyles has some properties
  if (data.arrowElement && Object.keys(data.arrowStyles).length) {
    setStyles(data.arrowElement, data.arrowStyles);
  }

  return data;
}

/**
 * Set the x-placement attribute before everything else because it could be used
 * to add margins to the popper margins needs to be calculated to get the
 * correct popper offsets.
 * @method
 * @memberof Popper.modifiers
 * @param {HTMLElement} reference - The reference element used to position the popper
 * @param {HTMLElement} popper - The HTML element used as popper.
 * @param {Object} options - Popper.js options
 */
function applyStyleOnLoad(reference, popper, options, modifierOptions, state) {
  // compute reference element offsets
  var referenceOffsets = getReferenceOffsets(state, popper, reference);

  // compute auto placement, store placement inside the data object,
  // modifiers will be able to edit `placement` if needed
  // and refer to originalPlacement to know the original value
  var placement = computeAutoPlacement(options.placement, referenceOffsets, popper, reference, options.modifiers.flip.boundariesElement, options.modifiers.flip.padding);

  popper.setAttribute('x-placement', placement);

  // Apply `position` to popper before anything else because
  // without the position applied we can't guarantee correct computations
  setStyles(popper, { position: 'absolute' });

  return options;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by `update` method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function computeStyle(data, options) {
  var x = options.x,
      y = options.y;
  var popper = data.offsets.popper;

  // Remove this legacy support in Popper.js v2

  var legacyGpuAccelerationOption = find(data.instance.modifiers, function (modifier) {
    return modifier.name === 'applyStyle';
  }).gpuAcceleration;
  if (legacyGpuAccelerationOption !== undefined) {
    console.warn('WARNING: `gpuAcceleration` option moved to `computeStyle` modifier and will not be supported in future versions of Popper.js!');
  }
  var gpuAcceleration = legacyGpuAccelerationOption !== undefined ? legacyGpuAccelerationOption : options.gpuAcceleration;

  var offsetParent = getOffsetParent(data.instance.popper);
  var offsetParentRect = getBoundingClientRect(offsetParent);

  // Styles
  var styles = {
    position: popper.position
  };

  // floor sides to avoid blurry text
  var offsets = {
    left: Math.floor(popper.left),
    top: Math.floor(popper.top),
    bottom: Math.floor(popper.bottom),
    right: Math.floor(popper.right)
  };

  var sideA = x === 'bottom' ? 'top' : 'bottom';
  var sideB = y === 'right' ? 'left' : 'right';

  // if gpuAcceleration is set to `true` and transform is supported,
  //  we use `translate3d` to apply the position to the popper we
  // automatically use the supported prefixed version if needed
  var prefixedProperty = getSupportedPropertyName('transform');

  // now, let's make a step back and look at this code closely (wtf?)
  // If the content of the popper grows once it's been positioned, it
  // may happen that the popper gets misplaced because of the new content
  // overflowing its reference element
  // To avoid this problem, we provide two options (x and y), which allow
  // the consumer to define the offset origin.
  // If we position a popper on top of a reference element, we can set
  // `x` to `top` to make the popper grow towards its top instead of
  // its bottom.
  var left = void 0,
      top = void 0;
  if (sideA === 'bottom') {
    top = -offsetParentRect.height + offsets.bottom;
  } else {
    top = offsets.top;
  }
  if (sideB === 'right') {
    left = -offsetParentRect.width + offsets.right;
  } else {
    left = offsets.left;
  }
  if (gpuAcceleration && prefixedProperty) {
    styles[prefixedProperty] = 'translate3d(' + left + 'px, ' + top + 'px, 0)';
    styles[sideA] = 0;
    styles[sideB] = 0;
    styles.willChange = 'transform';
  } else {
    // othwerise, we use the standard `top`, `left`, `bottom` and `right` properties
    var invertTop = sideA === 'bottom' ? -1 : 1;
    var invertLeft = sideB === 'right' ? -1 : 1;
    styles[sideA] = top * invertTop;
    styles[sideB] = left * invertLeft;
    styles.willChange = sideA + ', ' + sideB;
  }

  // Attributes
  var attributes = {
    'x-placement': data.placement
  };

  // Update `data` attributes, styles and arrowStyles
  data.attributes = _extends({}, attributes, data.attributes);
  data.styles = _extends({}, styles, data.styles);
  data.arrowStyles = _extends({}, data.offsets.arrow, data.arrowStyles);

  return data;
}

/**
 * Helper used to know if the given modifier depends from another one.<br />
 * It checks if the needed modifier is listed and enabled.
 * @method
 * @memberof Popper.Utils
 * @param {Array} modifiers - list of modifiers
 * @param {String} requestingName - name of requesting modifier
 * @param {String} requestedName - name of requested modifier
 * @returns {Boolean}
 */
function isModifierRequired(modifiers, requestingName, requestedName) {
  var requesting = find(modifiers, function (_ref) {
    var name = _ref.name;
    return name === requestingName;
  });

  var isRequired = !!requesting && modifiers.some(function (modifier) {
    return modifier.name === requestedName && modifier.enabled && modifier.order < requesting.order;
  });

  if (!isRequired) {
    var _requesting = '`' + requestingName + '`';
    var requested = '`' + requestedName + '`';
    console.warn(requested + ' modifier is required by ' + _requesting + ' modifier in order to work, be sure to include it before ' + _requesting + '!');
  }
  return isRequired;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function arrow(data, options) {
  // arrow depends on keepTogether in order to work
  if (!isModifierRequired(data.instance.modifiers, 'arrow', 'keepTogether')) {
    return data;
  }

  var arrowElement = options.element;

  // if arrowElement is a string, suppose it's a CSS selector
  if (typeof arrowElement === 'string') {
    arrowElement = data.instance.popper.querySelector(arrowElement);

    // if arrowElement is not found, don't run the modifier
    if (!arrowElement) {
      return data;
    }
  } else {
    // if the arrowElement isn't a query selector we must check that the
    // provided DOM node is child of its popper node
    if (!data.instance.popper.contains(arrowElement)) {
      console.warn('WARNING: `arrow.element` must be child of its popper element!');
      return data;
    }
  }

  var placement = data.placement.split('-')[0];
  var _data$offsets = data.offsets,
      popper = _data$offsets.popper,
      reference = _data$offsets.reference;

  var isVertical = ['left', 'right'].indexOf(placement) !== -1;

  var len = isVertical ? 'height' : 'width';
  var sideCapitalized = isVertical ? 'Top' : 'Left';
  var side = sideCapitalized.toLowerCase();
  var altSide = isVertical ? 'left' : 'top';
  var opSide = isVertical ? 'bottom' : 'right';
  var arrowElementSize = getOuterSizes(arrowElement)[len];

  //
  // extends keepTogether behavior making sure the popper and its
  // reference have enough pixels in conjuction
  //

  // top/left side
  if (reference[opSide] - arrowElementSize < popper[side]) {
    data.offsets.popper[side] -= popper[side] - (reference[opSide] - arrowElementSize);
  }
  // bottom/right side
  if (reference[side] + arrowElementSize > popper[opSide]) {
    data.offsets.popper[side] += reference[side] + arrowElementSize - popper[opSide];
  }

  // compute center of the popper
  var center = reference[side] + reference[len] / 2 - arrowElementSize / 2;

  // Compute the sideValue using the updated popper offsets
  // take popper margin in account because we don't have this info available
  var popperMarginSide = getStyleComputedProperty(data.instance.popper, 'margin' + sideCapitalized).replace('px', '');
  var sideValue = center - getClientRect(data.offsets.popper)[side] - popperMarginSide;

  // prevent arrowElement from being placed not contiguously to its popper
  sideValue = Math.max(Math.min(popper[len] - arrowElementSize, sideValue), 0);

  data.arrowElement = arrowElement;
  data.offsets.arrow = {};
  data.offsets.arrow[side] = Math.round(sideValue);
  data.offsets.arrow[altSide] = ''; // make sure to unset any eventual altSide value from the DOM node

  return data;
}

/**
 * Get the opposite placement variation of the given one
 * @method
 * @memberof Popper.Utils
 * @argument {String} placement variation
 * @returns {String} flipped placement variation
 */
function getOppositeVariation(variation) {
  if (variation === 'end') {
    return 'start';
  } else if (variation === 'start') {
    return 'end';
  }
  return variation;
}

/**
 * List of accepted placements to use as values of the `placement` option.<br />
 * Valid placements are:
 * - `auto`
 * - `top`
 * - `right`
 * - `bottom`
 * - `left`
 *
 * Each placement can have a variation from this list:
 * - `-start`
 * - `-end`
 *
 * Variations are interpreted easily if you think of them as the left to right
 * written languages. Horizontally (`top` and `bottom`), `start` is left and `end`
 * is right.<br />
 * Vertically (`left` and `right`), `start` is top and `end` is bottom.
 *
 * Some valid examples are:
 * - `top-end` (on top of reference, right aligned)
 * - `right-start` (on right of reference, top aligned)
 * - `bottom` (on bottom, centered)
 * - `auto-right` (on the side with more space available, alignment depends by placement)
 *
 * @static
 * @type {Array}
 * @enum {String}
 * @readonly
 * @method placements
 * @memberof Popper
 */
var placements = ['auto-start', 'auto', 'auto-end', 'top-start', 'top', 'top-end', 'right-start', 'right', 'right-end', 'bottom-end', 'bottom', 'bottom-start', 'left-end', 'left', 'left-start'];

// Get rid of `auto` `auto-start` and `auto-end`
var validPlacements = placements.slice(3);

/**
 * Given an initial placement, returns all the subsequent placements
 * clockwise (or counter-clockwise).
 *
 * @method
 * @memberof Popper.Utils
 * @argument {String} placement - A valid placement (it accepts variations)
 * @argument {Boolean} counter - Set to true to walk the placements counterclockwise
 * @returns {Array} placements including their variations
 */
function clockwise(placement) {
  var counter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  var index = validPlacements.indexOf(placement);
  var arr = validPlacements.slice(index + 1).concat(validPlacements.slice(0, index));
  return counter ? arr.reverse() : arr;
}

var BEHAVIORS = {
  FLIP: 'flip',
  CLOCKWISE: 'clockwise',
  COUNTERCLOCKWISE: 'counterclockwise'
};

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function flip(data, options) {
  // if `inner` modifier is enabled, we can't use the `flip` modifier
  if (isModifierEnabled(data.instance.modifiers, 'inner')) {
    return data;
  }

  if (data.flipped && data.placement === data.originalPlacement) {
    // seems like flip is trying to loop, probably there's not enough space on any of the flippable sides
    return data;
  }

  var boundaries = getBoundaries(data.instance.popper, data.instance.reference, options.padding, options.boundariesElement);

  var placement = data.placement.split('-')[0];
  var placementOpposite = getOppositePlacement(placement);
  var variation = data.placement.split('-')[1] || '';

  var flipOrder = [];

  switch (options.behavior) {
    case BEHAVIORS.FLIP:
      flipOrder = [placement, placementOpposite];
      break;
    case BEHAVIORS.CLOCKWISE:
      flipOrder = clockwise(placement);
      break;
    case BEHAVIORS.COUNTERCLOCKWISE:
      flipOrder = clockwise(placement, true);
      break;
    default:
      flipOrder = options.behavior;
  }

  flipOrder.forEach(function (step, index) {
    if (placement !== step || flipOrder.length === index + 1) {
      return data;
    }

    placement = data.placement.split('-')[0];
    placementOpposite = getOppositePlacement(placement);

    var popperOffsets = data.offsets.popper;
    var refOffsets = data.offsets.reference;

    // using floor because the reference offsets may contain decimals we are not going to consider here
    var floor = Math.floor;
    var overlapsRef = placement === 'left' && floor(popperOffsets.right) > floor(refOffsets.left) || placement === 'right' && floor(popperOffsets.left) < floor(refOffsets.right) || placement === 'top' && floor(popperOffsets.bottom) > floor(refOffsets.top) || placement === 'bottom' && floor(popperOffsets.top) < floor(refOffsets.bottom);

    var overflowsLeft = floor(popperOffsets.left) < floor(boundaries.left);
    var overflowsRight = floor(popperOffsets.right) > floor(boundaries.right);
    var overflowsTop = floor(popperOffsets.top) < floor(boundaries.top);
    var overflowsBottom = floor(popperOffsets.bottom) > floor(boundaries.bottom);

    var overflowsBoundaries = placement === 'left' && overflowsLeft || placement === 'right' && overflowsRight || placement === 'top' && overflowsTop || placement === 'bottom' && overflowsBottom;

    // flip the variation if required
    var isVertical = ['top', 'bottom'].indexOf(placement) !== -1;
    var flippedVariation = !!options.flipVariations && (isVertical && variation === 'start' && overflowsLeft || isVertical && variation === 'end' && overflowsRight || !isVertical && variation === 'start' && overflowsTop || !isVertical && variation === 'end' && overflowsBottom);

    if (overlapsRef || overflowsBoundaries || flippedVariation) {
      // this boolean to detect any flip loop
      data.flipped = true;

      if (overlapsRef || overflowsBoundaries) {
        placement = flipOrder[index + 1];
      }

      if (flippedVariation) {
        variation = getOppositeVariation(variation);
      }

      data.placement = placement + (variation ? '-' + variation : '');

      // this object contains `position`, we want to preserve it along with
      // any additional property we may add in the future
      data.offsets.popper = _extends({}, data.offsets.popper, getPopperOffsets(data.instance.popper, data.offsets.reference, data.placement));

      data = runModifiers(data.instance.modifiers, data, 'flip');
    }
  });
  return data;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function keepTogether(data) {
  var _data$offsets = data.offsets,
      popper = _data$offsets.popper,
      reference = _data$offsets.reference;

  var placement = data.placement.split('-')[0];
  var floor = Math.floor;
  var isVertical = ['top', 'bottom'].indexOf(placement) !== -1;
  var side = isVertical ? 'right' : 'bottom';
  var opSide = isVertical ? 'left' : 'top';
  var measurement = isVertical ? 'width' : 'height';

  if (popper[side] < floor(reference[opSide])) {
    data.offsets.popper[opSide] = floor(reference[opSide]) - popper[measurement];
  }
  if (popper[opSide] > floor(reference[side])) {
    data.offsets.popper[opSide] = floor(reference[side]);
  }

  return data;
}

/**
 * Converts a string containing value + unit into a px value number
 * @function
 * @memberof {modifiers~offset}
 * @private
 * @argument {String} str - Value + unit string
 * @argument {String} measurement - `height` or `width`
 * @argument {Object} popperOffsets
 * @argument {Object} referenceOffsets
 * @returns {Number|String}
 * Value in pixels, or original string if no values were extracted
 */
function toValue(str, measurement, popperOffsets, referenceOffsets) {
  // separate value from unit
  var split = str.match(/((?:\-|\+)?\d*\.?\d*)(.*)/);
  var value = +split[1];
  var unit = split[2];

  // If it's not a number it's an operator, I guess
  if (!value) {
    return str;
  }

  if (unit.indexOf('%') === 0) {
    var element = void 0;
    switch (unit) {
      case '%p':
        element = popperOffsets;
        break;
      case '%':
      case '%r':
      default:
        element = referenceOffsets;
    }

    var rect = getClientRect(element);
    return rect[measurement] / 100 * value;
  } else if (unit === 'vh' || unit === 'vw') {
    // if is a vh or vw, we calculate the size based on the viewport
    var size = void 0;
    if (unit === 'vh') {
      size = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    } else {
      size = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    }
    return size / 100 * value;
  } else {
    // if is an explicit pixel unit, we get rid of the unit and keep the value
    // if is an implicit unit, it's px, and we return just the value
    return value;
  }
}

/**
 * Parse an `offset` string to extrapolate `x` and `y` numeric offsets.
 * @function
 * @memberof {modifiers~offset}
 * @private
 * @argument {String} offset
 * @argument {Object} popperOffsets
 * @argument {Object} referenceOffsets
 * @argument {String} basePlacement
 * @returns {Array} a two cells array with x and y offsets in numbers
 */
function parseOffset(offset, popperOffsets, referenceOffsets, basePlacement) {
  var offsets = [0, 0];

  // Use height if placement is left or right and index is 0 otherwise use width
  // in this way the first offset will use an axis and the second one
  // will use the other one
  var useHeight = ['right', 'left'].indexOf(basePlacement) !== -1;

  // Split the offset string to obtain a list of values and operands
  // The regex addresses values with the plus or minus sign in front (+10, -20, etc)
  var fragments = offset.split(/(\+|\-)/).map(function (frag) {
    return frag.trim();
  });

  // Detect if the offset string contains a pair of values or a single one
  // they could be separated by comma or space
  var divider = fragments.indexOf(find(fragments, function (frag) {
    return frag.search(/,|\s/) !== -1;
  }));

  if (fragments[divider] && fragments[divider].indexOf(',') === -1) {
    console.warn('Offsets separated by white space(s) are deprecated, use a comma (,) instead.');
  }

  // If divider is found, we divide the list of values and operands to divide
  // them by ofset X and Y.
  var splitRegex = /\s*,\s*|\s+/;
  var ops = divider !== -1 ? [fragments.slice(0, divider).concat([fragments[divider].split(splitRegex)[0]]), [fragments[divider].split(splitRegex)[1]].concat(fragments.slice(divider + 1))] : [fragments];

  // Convert the values with units to absolute pixels to allow our computations
  ops = ops.map(function (op, index) {
    // Most of the units rely on the orientation of the popper
    var measurement = (index === 1 ? !useHeight : useHeight) ? 'height' : 'width';
    var mergeWithPrevious = false;
    return op
    // This aggregates any `+` or `-` sign that aren't considered operators
    // e.g.: 10 + +5 => [10, +, +5]
    .reduce(function (a, b) {
      if (a[a.length - 1] === '' && ['+', '-'].indexOf(b) !== -1) {
        a[a.length - 1] = b;
        mergeWithPrevious = true;
        return a;
      } else if (mergeWithPrevious) {
        a[a.length - 1] += b;
        mergeWithPrevious = false;
        return a;
      } else {
        return a.concat(b);
      }
    }, [])
    // Here we convert the string values into number values (in px)
    .map(function (str) {
      return toValue(str, measurement, popperOffsets, referenceOffsets);
    });
  });

  // Loop trough the offsets arrays and execute the operations
  ops.forEach(function (op, index) {
    op.forEach(function (frag, index2) {
      if (isNumeric(frag)) {
        offsets[index] += frag * (op[index2 - 1] === '-' ? -1 : 1);
      }
    });
  });
  return offsets;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @argument {Number|String} options.offset=0
 * The offset value as described in the modifier description
 * @returns {Object} The data object, properly modified
 */
function offset(data, _ref) {
  var offset = _ref.offset;
  var placement = data.placement,
      _data$offsets = data.offsets,
      popper = _data$offsets.popper,
      reference = _data$offsets.reference;

  var basePlacement = placement.split('-')[0];

  var offsets = void 0;
  if (isNumeric(+offset)) {
    offsets = [+offset, 0];
  } else {
    offsets = parseOffset(offset, popper, reference, basePlacement);
  }

  if (basePlacement === 'left') {
    popper.top += offsets[0];
    popper.left -= offsets[1];
  } else if (basePlacement === 'right') {
    popper.top += offsets[0];
    popper.left += offsets[1];
  } else if (basePlacement === 'top') {
    popper.left += offsets[0];
    popper.top -= offsets[1];
  } else if (basePlacement === 'bottom') {
    popper.left += offsets[0];
    popper.top += offsets[1];
  }

  data.popper = popper;
  return data;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by `update` method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function preventOverflow(data, options) {
  var boundariesElement = options.boundariesElement || getOffsetParent(data.instance.popper);

  // If offsetParent is the reference element, we really want to
  // go one step up and use the next offsetParent as reference to
  // avoid to make this modifier completely useless and look like broken
  if (data.instance.reference === boundariesElement) {
    boundariesElement = getOffsetParent(boundariesElement);
  }

  var boundaries = getBoundaries(data.instance.popper, data.instance.reference, options.padding, boundariesElement);
  options.boundaries = boundaries;

  var order = options.priority;
  var popper = data.offsets.popper;

  var check = {
    primary: function primary(placement) {
      var value = popper[placement];
      if (popper[placement] < boundaries[placement] && !options.escapeWithReference) {
        value = Math.max(popper[placement], boundaries[placement]);
      }
      return defineProperty({}, placement, value);
    },
    secondary: function secondary(placement) {
      var mainSide = placement === 'right' ? 'left' : 'top';
      var value = popper[mainSide];
      if (popper[placement] > boundaries[placement] && !options.escapeWithReference) {
        value = Math.min(popper[mainSide], boundaries[placement] - (placement === 'right' ? popper.width : popper.height));
      }
      return defineProperty({}, mainSide, value);
    }
  };

  order.forEach(function (placement) {
    var side = ['left', 'top'].indexOf(placement) !== -1 ? 'primary' : 'secondary';
    popper = _extends({}, popper, check[side](placement));
  });

  data.offsets.popper = popper;

  return data;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by `update` method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function shift(data) {
  var placement = data.placement;
  var basePlacement = placement.split('-')[0];
  var shiftvariation = placement.split('-')[1];

  // if shift shiftvariation is specified, run the modifier
  if (shiftvariation) {
    var _data$offsets = data.offsets,
        reference = _data$offsets.reference,
        popper = _data$offsets.popper;

    var isVertical = ['bottom', 'top'].indexOf(basePlacement) !== -1;
    var side = isVertical ? 'left' : 'top';
    var measurement = isVertical ? 'width' : 'height';

    var shiftOffsets = {
      start: defineProperty({}, side, reference[side]),
      end: defineProperty({}, side, reference[side] + reference[measurement] - popper[measurement])
    };

    data.offsets.popper = _extends({}, popper, shiftOffsets[shiftvariation]);
  }

  return data;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function hide(data) {
  if (!isModifierRequired(data.instance.modifiers, 'hide', 'preventOverflow')) {
    return data;
  }

  var refRect = data.offsets.reference;
  var bound = find(data.instance.modifiers, function (modifier) {
    return modifier.name === 'preventOverflow';
  }).boundaries;

  if (refRect.bottom < bound.top || refRect.left > bound.right || refRect.top > bound.bottom || refRect.right < bound.left) {
    // Avoid unnecessary DOM access if visibility hasn't changed
    if (data.hide === true) {
      return data;
    }

    data.hide = true;
    data.attributes['x-out-of-boundaries'] = '';
  } else {
    // Avoid unnecessary DOM access if visibility hasn't changed
    if (data.hide === false) {
      return data;
    }

    data.hide = false;
    data.attributes['x-out-of-boundaries'] = false;
  }

  return data;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by `update` method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function inner(data) {
  var placement = data.placement;
  var basePlacement = placement.split('-')[0];
  var _data$offsets = data.offsets,
      popper = _data$offsets.popper,
      reference = _data$offsets.reference;

  var isHoriz = ['left', 'right'].indexOf(basePlacement) !== -1;

  var subtractLength = ['top', 'left'].indexOf(basePlacement) === -1;

  popper[isHoriz ? 'left' : 'top'] = reference[basePlacement] - (subtractLength ? popper[isHoriz ? 'width' : 'height'] : 0);

  data.placement = getOppositePlacement(placement);
  data.offsets.popper = getClientRect(popper);

  return data;
}

/**
 * Modifier function, each modifier can have a function of this type assigned
 * to its `fn` property.<br />
 * These functions will be called on each update, this means that you must
 * make sure they are performant enough to avoid performance bottlenecks.
 *
 * @function ModifierFn
 * @argument {dataObject} data - The data object generated by `update` method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {dataObject} The data object, properly modified
 */

/**
 * Modifiers are plugins used to alter the behavior of your poppers.<br />
 * Popper.js uses a set of 9 modifiers to provide all the basic functionalities
 * needed by the library.
 *
 * Usually you don't want to override the `order`, `fn` and `onLoad` props.
 * All the other properties are configurations that could be tweaked.
 * @namespace modifiers
 */
var modifiers = {
  /**
   * Modifier used to shift the popper on the start or end of its reference
   * element.<br />
   * It will read the variation of the `placement` property.<br />
   * It can be one either `-end` or `-start`.
   * @memberof modifiers
   * @inner
   */
  shift: {
    /** @prop {number} order=100 - Index used to define the order of execution */
    order: 100,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: shift
  },

  /**
   * The `offset` modifier can shift your popper on both its axis.
   *
   * It accepts the following units:
   * - `px` or unitless, interpreted as pixels
   * - `%` or `%r`, percentage relative to the length of the reference element
   * - `%p`, percentage relative to the length of the popper element
   * - `vw`, CSS viewport width unit
   * - `vh`, CSS viewport height unit
   *
   * For length is intended the main axis relative to the placement of the popper.<br />
   * This means that if the placement is `top` or `bottom`, the length will be the
   * `width`. In case of `left` or `right`, it will be the height.
   *
   * You can provide a single value (as `Number` or `String`), or a pair of values
   * as `String` divided by a comma or one (or more) white spaces.<br />
   * The latter is a deprecated method because it leads to confusion and will be
   * removed in v2.<br />
   * Additionally, it accepts additions and subtractions between different units.
   * Note that multiplications and divisions aren't supported.
   *
   * Valid examples are:
   * ```
   * 10
   * '10%'
   * '10, 10'
   * '10%, 10'
   * '10 + 10%'
   * '10 - 5vh + 3%'
   * '-10px + 5vh, 5px - 6%'
   * ```
   * > **NB**: If you desire to apply offsets to your poppers in a way that may make them overlap
   * > with their reference element, unfortunately, you will have to disable the `flip` modifier.
   * > More on this [reading this issue](https://github.com/FezVrasta/popper.js/issues/373)
   *
   * @memberof modifiers
   * @inner
   */
  offset: {
    /** @prop {number} order=200 - Index used to define the order of execution */
    order: 200,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: offset,
    /** @prop {Number|String} offset=0
     * The offset value as described in the modifier description
     */
    offset: 0
  },

  /**
   * Modifier used to prevent the popper from being positioned outside the boundary.
   *
   * An scenario exists where the reference itself is not within the boundaries.<br />
   * We can say it has "escaped the boundaries" — or just "escaped".<br />
   * In this case we need to decide whether the popper should either:
   *
   * - detach from the reference and remain "trapped" in the boundaries, or
   * - if it should ignore the boundary and "escape with its reference"
   *
   * When `escapeWithReference` is set to`true` and reference is completely
   * outside its boundaries, the popper will overflow (or completely leave)
   * the boundaries in order to remain attached to the edge of the reference.
   *
   * @memberof modifiers
   * @inner
   */
  preventOverflow: {
    /** @prop {number} order=300 - Index used to define the order of execution */
    order: 300,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: preventOverflow,
    /**
     * @prop {Array} [priority=['left','right','top','bottom']]
     * Popper will try to prevent overflow following these priorities by default,
     * then, it could overflow on the left and on top of the `boundariesElement`
     */
    priority: ['left', 'right', 'top', 'bottom'],
    /**
     * @prop {number} padding=5
     * Amount of pixel used to define a minimum distance between the boundaries
     * and the popper this makes sure the popper has always a little padding
     * between the edges of its container
     */
    padding: 5,
    /**
     * @prop {String|HTMLElement} boundariesElement='scrollParent'
     * Boundaries used by the modifier, can be `scrollParent`, `window`,
     * `viewport` or any DOM element.
     */
    boundariesElement: 'scrollParent'
  },

  /**
   * Modifier used to make sure the reference and its popper stay near eachothers
   * without leaving any gap between the two. Expecially useful when the arrow is
   * enabled and you want to assure it to point to its reference element.
   * It cares only about the first axis, you can still have poppers with margin
   * between the popper and its reference element.
   * @memberof modifiers
   * @inner
   */
  keepTogether: {
    /** @prop {number} order=400 - Index used to define the order of execution */
    order: 400,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: keepTogether
  },

  /**
   * This modifier is used to move the `arrowElement` of the popper to make
   * sure it is positioned between the reference element and its popper element.
   * It will read the outer size of the `arrowElement` node to detect how many
   * pixels of conjuction are needed.
   *
   * It has no effect if no `arrowElement` is provided.
   * @memberof modifiers
   * @inner
   */
  arrow: {
    /** @prop {number} order=500 - Index used to define the order of execution */
    order: 500,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: arrow,
    /** @prop {String|HTMLElement} element='[x-arrow]' - Selector or node used as arrow */
    element: '[x-arrow]'
  },

  /**
   * Modifier used to flip the popper's placement when it starts to overlap its
   * reference element.
   *
   * Requires the `preventOverflow` modifier before it in order to work.
   *
   * **NOTE:** this modifier will interrupt the current update cycle and will
   * restart it if it detects the need to flip the placement.
   * @memberof modifiers
   * @inner
   */
  flip: {
    /** @prop {number} order=600 - Index used to define the order of execution */
    order: 600,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: flip,
    /**
     * @prop {String|Array} behavior='flip'
     * The behavior used to change the popper's placement. It can be one of
     * `flip`, `clockwise`, `counterclockwise` or an array with a list of valid
     * placements (with optional variations).
     */
    behavior: 'flip',
    /**
     * @prop {number} padding=5
     * The popper will flip if it hits the edges of the `boundariesElement`
     */
    padding: 5,
    /**
     * @prop {String|HTMLElement} boundariesElement='viewport'
     * The element which will define the boundaries of the popper position,
     * the popper will never be placed outside of the defined boundaries
     * (except if keepTogether is enabled)
     */
    boundariesElement: 'viewport'
  },

  /**
   * Modifier used to make the popper flow toward the inner of the reference element.
   * By default, when this modifier is disabled, the popper will be placed outside
   * the reference element.
   * @memberof modifiers
   * @inner
   */
  inner: {
    /** @prop {number} order=700 - Index used to define the order of execution */
    order: 700,
    /** @prop {Boolean} enabled=false - Whether the modifier is enabled or not */
    enabled: false,
    /** @prop {ModifierFn} */
    fn: inner
  },

  /**
   * Modifier used to hide the popper when its reference element is outside of the
   * popper boundaries. It will set a `x-out-of-boundaries` attribute which can
   * be used to hide with a CSS selector the popper when its reference is
   * out of boundaries.
   *
   * Requires the `preventOverflow` modifier before it in order to work.
   * @memberof modifiers
   * @inner
   */
  hide: {
    /** @prop {number} order=800 - Index used to define the order of execution */
    order: 800,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: hide
  },

  /**
   * Computes the style that will be applied to the popper element to gets
   * properly positioned.
   *
   * Note that this modifier will not touch the DOM, it just prepares the styles
   * so that `applyStyle` modifier can apply it. This separation is useful
   * in case you need to replace `applyStyle` with a custom implementation.
   *
   * This modifier has `850` as `order` value to maintain backward compatibility
   * with previous versions of Popper.js. Expect the modifiers ordering method
   * to change in future major versions of the library.
   *
   * @memberof modifiers
   * @inner
   */
  computeStyle: {
    /** @prop {number} order=850 - Index used to define the order of execution */
    order: 850,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: computeStyle,
    /**
     * @prop {Boolean} gpuAcceleration=true
     * If true, it uses the CSS 3d transformation to position the popper.
     * Otherwise, it will use the `top` and `left` properties.
     */
    gpuAcceleration: true,
    /**
     * @prop {string} [x='bottom']
     * Where to anchor the X axis (`bottom` or `top`). AKA X offset origin.
     * Change this if your popper should grow in a direction different from `bottom`
     */
    x: 'bottom',
    /**
     * @prop {string} [x='left']
     * Where to anchor the Y axis (`left` or `right`). AKA Y offset origin.
     * Change this if your popper should grow in a direction different from `right`
     */
    y: 'right'
  },

  /**
   * Applies the computed styles to the popper element.
   *
   * All the DOM manipulations are limited to this modifier. This is useful in case
   * you want to integrate Popper.js inside a framework or view library and you
   * want to delegate all the DOM manipulations to it.
   *
   * Note that if you disable this modifier, you must make sure the popper element
   * has its position set to `absolute` before Popper.js can do its work!
   *
   * Just disable this modifier and define you own to achieve the desired effect.
   *
   * @memberof modifiers
   * @inner
   */
  applyStyle: {
    /** @prop {number} order=900 - Index used to define the order of execution */
    order: 900,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: applyStyle,
    /** @prop {Function} */
    onLoad: applyStyleOnLoad,
    /**
     * @deprecated since version 1.10.0, the property moved to `computeStyle` modifier
     * @prop {Boolean} gpuAcceleration=true
     * If true, it uses the CSS 3d transformation to position the popper.
     * Otherwise, it will use the `top` and `left` properties.
     */
    gpuAcceleration: undefined
  }
};

/**
 * The `dataObject` is an object containing all the informations used by Popper.js
 * this object get passed to modifiers and to the `onCreate` and `onUpdate` callbacks.
 * @name dataObject
 * @property {Object} data.instance The Popper.js instance
 * @property {String} data.placement Placement applied to popper
 * @property {String} data.originalPlacement Placement originally defined on init
 * @property {Boolean} data.flipped True if popper has been flipped by flip modifier
 * @property {Boolean} data.hide True if the reference element is out of boundaries, useful to know when to hide the popper.
 * @property {HTMLElement} data.arrowElement Node used as arrow by arrow modifier
 * @property {Object} data.styles Any CSS property defined here will be applied to the popper, it expects the JavaScript nomenclature (eg. `marginBottom`)
 * @property {Object} data.arrowStyles Any CSS property defined here will be applied to the popper arrow, it expects the JavaScript nomenclature (eg. `marginBottom`)
 * @property {Object} data.boundaries Offsets of the popper boundaries
 * @property {Object} data.offsets The measurements of popper, reference and arrow elements.
 * @property {Object} data.offsets.popper `top`, `left`, `width`, `height` values
 * @property {Object} data.offsets.reference `top`, `left`, `width`, `height` values
 * @property {Object} data.offsets.arrow] `top` and `left` offsets, only one of them will be different from 0
 */

/**
 * Default options provided to Popper.js constructor.<br />
 * These can be overriden using the `options` argument of Popper.js.<br />
 * To override an option, simply pass as 3rd argument an object with the same
 * structure of this object, example:
 * ```
 * new Popper(ref, pop, {
 *   modifiers: {
 *     preventOverflow: { enabled: false }
 *   }
 * })
 * ```
 * @type {Object}
 * @static
 * @memberof Popper
 */
var Defaults = {
  /**
   * Popper's placement
   * @prop {Popper.placements} placement='bottom'
   */
  placement: 'bottom',

  /**
   * Whether events (resize, scroll) are initially enabled
   * @prop {Boolean} eventsEnabled=true
   */
  eventsEnabled: true,

  /**
   * Set to true if you want to automatically remove the popper when
   * you call the `destroy` method.
   * @prop {Boolean} removeOnDestroy=false
   */
  removeOnDestroy: false,

  /**
   * Callback called when the popper is created.<br />
   * By default, is set to no-op.<br />
   * Access Popper.js instance with `data.instance`.
   * @prop {onCreate}
   */
  onCreate: function onCreate() {},

  /**
   * Callback called when the popper is updated, this callback is not called
   * on the initialization/creation of the popper, but only on subsequent
   * updates.<br />
   * By default, is set to no-op.<br />
   * Access Popper.js instance with `data.instance`.
   * @prop {onUpdate}
   */
  onUpdate: function onUpdate() {},

  /**
   * List of modifiers used to modify the offsets before they are applied to the popper.
   * They provide most of the functionalities of Popper.js
   * @prop {modifiers}
   */
  modifiers: modifiers
};

/**
 * @callback onCreate
 * @param {dataObject} data
 */

/**
 * @callback onUpdate
 * @param {dataObject} data
 */

// Utils
// Methods
var Popper = function () {
  /**
   * Create a new Popper.js instance
   * @class Popper
   * @param {HTMLElement|referenceObject} reference - The reference element used to position the popper
   * @param {HTMLElement} popper - The HTML element used as popper.
   * @param {Object} options - Your custom options to override the ones defined in [Defaults](#defaults)
   * @return {Object} instance - The generated Popper.js instance
   */
  function Popper(reference, popper) {
    var _this = this;

    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    classCallCheck(this, Popper);

    this.scheduleUpdate = function () {
      return requestAnimationFrame(_this.update);
    };

    // make update() debounced, so that it only runs at most once-per-tick
    this.update = debounce(this.update.bind(this));

    // with {} we create a new object with the options inside it
    this.options = _extends({}, Popper.Defaults, options);

    // init state
    this.state = {
      isDestroyed: false,
      isCreated: false,
      scrollParents: []
    };

    // get reference and popper elements (allow jQuery wrappers)
    this.reference = reference && reference.jquery ? reference[0] : reference;
    this.popper = popper && popper.jquery ? popper[0] : popper;

    // Deep merge modifiers options
    this.options.modifiers = {};
    Object.keys(_extends({}, Popper.Defaults.modifiers, options.modifiers)).forEach(function (name) {
      _this.options.modifiers[name] = _extends({}, Popper.Defaults.modifiers[name] || {}, options.modifiers ? options.modifiers[name] : {});
    });

    // Refactoring modifiers' list (Object => Array)
    this.modifiers = Object.keys(this.options.modifiers).map(function (name) {
      return _extends({
        name: name
      }, _this.options.modifiers[name]);
    })
    // sort the modifiers by order
    .sort(function (a, b) {
      return a.order - b.order;
    });

    // modifiers have the ability to execute arbitrary code when Popper.js get inited
    // such code is executed in the same order of its modifier
    // they could add new properties to their options configuration
    // BE AWARE: don't add options to `options.modifiers.name` but to `modifierOptions`!
    this.modifiers.forEach(function (modifierOptions) {
      if (modifierOptions.enabled && isFunction(modifierOptions.onLoad)) {
        modifierOptions.onLoad(_this.reference, _this.popper, _this.options, modifierOptions, _this.state);
      }
    });

    // fire the first update to position the popper in the right place
    this.update();

    var eventsEnabled = this.options.eventsEnabled;
    if (eventsEnabled) {
      // setup event listeners, they will take care of update the position in specific situations
      this.enableEventListeners();
    }

    this.state.eventsEnabled = eventsEnabled;
  }

  // We can't use class properties because they don't get listed in the
  // class prototype and break stuff like Sinon stubs


  createClass(Popper, [{
    key: 'update',
    value: function update$$1() {
      return update.call(this);
    }
  }, {
    key: 'destroy',
    value: function destroy$$1() {
      return destroy.call(this);
    }
  }, {
    key: 'enableEventListeners',
    value: function enableEventListeners$$1() {
      return enableEventListeners.call(this);
    }
  }, {
    key: 'disableEventListeners',
    value: function disableEventListeners$$1() {
      return disableEventListeners.call(this);
    }

    /**
     * Schedule an update, it will run on the next UI update available
     * @method scheduleUpdate
     * @memberof Popper
     */


    /**
     * Collection of utilities useful when writing custom modifiers.
     * Starting from version 1.7, this method is available only if you
     * include `popper-utils.js` before `popper.js`.
     *
     * **DEPRECATION**: This way to access PopperUtils is deprecated
     * and will be removed in v2! Use the PopperUtils module directly instead.
     * Due to the high instability of the methods contained in Utils, we can't
     * guarantee them to follow semver. Use them at your own risk!
     * @static
     * @private
     * @type {Object}
     * @deprecated since version 1.8
     * @member Utils
     * @memberof Popper
     */

  }]);
  return Popper;
}();

/**
 * The `referenceObject` is an object that provides an interface compatible with Popper.js
 * and lets you use it as replacement of a real DOM node.<br />
 * You can use this method to position a popper relatively to a set of coordinates
 * in case you don't have a DOM node to use as reference.
 *
 * ```
 * new Popper(referenceObject, popperNode);
 * ```
 *
 * NB: This feature isn't supported in Internet Explorer 10
 * @name referenceObject
 * @property {Function} data.getBoundingClientRect
 * A function that returns a set of coordinates compatible with the native `getBoundingClientRect` method.
 * @property {number} data.clientWidth
 * An ES6 getter that will return the width of the virtual reference element.
 * @property {number} data.clientHeight
 * An ES6 getter that will return the height of the virtual reference element.
 */


Popper.Utils = (typeof window !== 'undefined' ? window : global).PopperUtils;
Popper.placements = placements;
Popper.Defaults = Defaults;

return Popper;

})));
//# sourceMappingURL=popper.js.map
;
/*!
  * Bootstrap v4.0.0-beta.2 (https://getbootstrap.com)
  * Copyright 2011-2017 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
  */

var bootstrap = (function (exports,$,Popper) {
'use strict';

$ = $ && $.hasOwnProperty('default') ? $['default'] : $;
Popper = Popper && Popper.hasOwnProperty('default') ? Popper['default'] : Popper;

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0-beta.2): util.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

var Util = function () {
  /**
   * ------------------------------------------------------------------------
   * Private TransitionEnd Helpers
   * ------------------------------------------------------------------------
   */
  var transition = false;
  var MAX_UID = 1000000;
  var TransitionEndEvent = {
    WebkitTransition: 'webkitTransitionEnd',
    MozTransition: 'transitionend',
    OTransition: 'oTransitionEnd otransitionend',
    transition: 'transitionend' // shoutout AngusCroll (https://goo.gl/pxwQGp)

  };

  function toType(obj) {
    return {}.toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
  }

  function getSpecialTransitionEndEvent() {
    return {
      bindType: transition.end,
      delegateType: transition.end,
      handle: function handle(event) {
        if ($(event.target).is(this)) {
          return event.handleObj.handler.apply(this, arguments); // eslint-disable-line prefer-rest-params
        }

        return undefined; // eslint-disable-line no-undefined
      }
    };
  }

  function transitionEndTest() {
    if (window.QUnit) {
      return false;
    }

    var el = document.createElement('bootstrap');

    for (var name in TransitionEndEvent) {
      if (typeof el.style[name] !== 'undefined') {
        return {
          end: TransitionEndEvent[name]
        };
      }
    }

    return false;
  }

  function transitionEndEmulator(duration) {
    var _this = this;

    var called = false;
    $(this).one(Util.TRANSITION_END, function () {
      called = true;
    });
    setTimeout(function () {
      if (!called) {
        Util.triggerTransitionEnd(_this);
      }
    }, duration);
    return this;
  }

  function setTransitionEndSupport() {
    transition = transitionEndTest();
    $.fn.emulateTransitionEnd = transitionEndEmulator;

    if (Util.supportsTransitionEnd()) {
      $.event.special[Util.TRANSITION_END] = getSpecialTransitionEndEvent();
    }
  }
  /**
   * --------------------------------------------------------------------------
   * Public Util Api
   * --------------------------------------------------------------------------
   */


  var Util = {
    TRANSITION_END: 'bsTransitionEnd',
    getUID: function getUID(prefix) {
      do {
        // eslint-disable-next-line no-bitwise
        prefix += ~~(Math.random() * MAX_UID); // "~~" acts like a faster Math.floor() here
      } while (document.getElementById(prefix));

      return prefix;
    },
    getSelectorFromElement: function getSelectorFromElement(element) {
      var selector = element.getAttribute('data-target');

      if (!selector || selector === '#') {
        selector = element.getAttribute('href') || '';
      }

      try {
        var $selector = $(document).find(selector);
        return $selector.length > 0 ? selector : null;
      } catch (error) {
        return null;
      }
    },
    reflow: function reflow(element) {
      return element.offsetHeight;
    },
    triggerTransitionEnd: function triggerTransitionEnd(element) {
      $(element).trigger(transition.end);
    },
    supportsTransitionEnd: function supportsTransitionEnd() {
      return Boolean(transition);
    },
    isElement: function isElement(obj) {
      return (obj[0] || obj).nodeType;
    },
    typeCheckConfig: function typeCheckConfig(componentName, config, configTypes) {
      for (var property in configTypes) {
        if (Object.prototype.hasOwnProperty.call(configTypes, property)) {
          var expectedTypes = configTypes[property];
          var value = config[property];
          var valueType = value && Util.isElement(value) ? 'element' : toType(value);

          if (!new RegExp(expectedTypes).test(valueType)) {
            throw new Error(componentName.toUpperCase() + ": " + ("Option \"" + property + "\" provided type \"" + valueType + "\" ") + ("but expected type \"" + expectedTypes + "\"."));
          }
        }
      }
    }
  };
  setTransitionEndSupport();
  return Util;
}($);

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

var createClass = _createClass;

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}

var inheritsLoose = _inheritsLoose;

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0-beta.2): alert.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

var Alert = function () {
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */
  var NAME = 'alert';
  var VERSION = '4.0.0-beta.2';
  var DATA_KEY = 'bs.alert';
  var EVENT_KEY = "." + DATA_KEY;
  var DATA_API_KEY = '.data-api';
  var JQUERY_NO_CONFLICT = $.fn[NAME];
  var TRANSITION_DURATION = 150;
  var Selector = {
    DISMISS: '[data-dismiss="alert"]'
  };
  var Event = {
    CLOSE: "close" + EVENT_KEY,
    CLOSED: "closed" + EVENT_KEY,
    CLICK_DATA_API: "click" + EVENT_KEY + DATA_API_KEY
  };
  var ClassName = {
    ALERT: 'alert',
    FADE: 'fade',
    SHOW: 'show'
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

  };

  var Alert =
  /*#__PURE__*/
  function () {
    function Alert(element) {
      this._element = element;
    } // getters


    var _proto = Alert.prototype;

    // public
    _proto.close = function close(element) {
      element = element || this._element;

      var rootElement = this._getRootElement(element);

      var customEvent = this._triggerCloseEvent(rootElement);

      if (customEvent.isDefaultPrevented()) {
        return;
      }

      this._removeElement(rootElement);
    };

    _proto.dispose = function dispose() {
      $.removeData(this._element, DATA_KEY);
      this._element = null;
    }; // private


    _proto._getRootElement = function _getRootElement(element) {
      var selector = Util.getSelectorFromElement(element);
      var parent = false;

      if (selector) {
        parent = $(selector)[0];
      }

      if (!parent) {
        parent = $(element).closest("." + ClassName.ALERT)[0];
      }

      return parent;
    };

    _proto._triggerCloseEvent = function _triggerCloseEvent(element) {
      var closeEvent = $.Event(Event.CLOSE);
      $(element).trigger(closeEvent);
      return closeEvent;
    };

    _proto._removeElement = function _removeElement(element) {
      var _this = this;

      $(element).removeClass(ClassName.SHOW);

      if (!Util.supportsTransitionEnd() || !$(element).hasClass(ClassName.FADE)) {
        this._destroyElement(element);

        return;
      }

      $(element).one(Util.TRANSITION_END, function (event) {
        return _this._destroyElement(element, event);
      }).emulateTransitionEnd(TRANSITION_DURATION);
    };

    _proto._destroyElement = function _destroyElement(element) {
      $(element).detach().trigger(Event.CLOSED).remove();
    }; // static


    Alert._jQueryInterface = function _jQueryInterface(config) {
      return this.each(function () {
        var $element = $(this);
        var data = $element.data(DATA_KEY);

        if (!data) {
          data = new Alert(this);
          $element.data(DATA_KEY, data);
        }

        if (config === 'close') {
          data[config](this);
        }
      });
    };

    Alert._handleDismiss = function _handleDismiss(alertInstance) {
      return function (event) {
        if (event) {
          event.preventDefault();
        }

        alertInstance.close(this);
      };
    };

    createClass(Alert, null, [{
      key: "VERSION",
      get: function get() {
        return VERSION;
      }
    }]);
    return Alert;
  }();
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  $(document).on(Event.CLICK_DATA_API, Selector.DISMISS, Alert._handleDismiss(new Alert()));
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $.fn[NAME] = Alert._jQueryInterface;
  $.fn[NAME].Constructor = Alert;

  $.fn[NAME].noConflict = function () {
    $.fn[NAME] = JQUERY_NO_CONFLICT;
    return Alert._jQueryInterface;
  };

  return Alert;
}($);

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0-beta.2): button.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

var Button = function () {
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */
  var NAME = 'button';
  var VERSION = '4.0.0-beta.2';
  var DATA_KEY = 'bs.button';
  var EVENT_KEY = "." + DATA_KEY;
  var DATA_API_KEY = '.data-api';
  var JQUERY_NO_CONFLICT = $.fn[NAME];
  var ClassName = {
    ACTIVE: 'active',
    BUTTON: 'btn',
    FOCUS: 'focus'
  };
  var Selector = {
    DATA_TOGGLE_CARROT: '[data-toggle^="button"]',
    DATA_TOGGLE: '[data-toggle="buttons"]',
    INPUT: 'input',
    ACTIVE: '.active',
    BUTTON: '.btn'
  };
  var Event = {
    CLICK_DATA_API: "click" + EVENT_KEY + DATA_API_KEY,
    FOCUS_BLUR_DATA_API: "focus" + EVENT_KEY + DATA_API_KEY + " " + ("blur" + EVENT_KEY + DATA_API_KEY)
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

  };

  var Button =
  /*#__PURE__*/
  function () {
    function Button(element) {
      this._element = element;
    } // getters


    var _proto = Button.prototype;

    // public
    _proto.toggle = function toggle() {
      var triggerChangeEvent = true;
      var addAriaPressed = true;
      var rootElement = $(this._element).closest(Selector.DATA_TOGGLE)[0];

      if (rootElement) {
        var input = $(this._element).find(Selector.INPUT)[0];

        if (input) {
          if (input.type === 'radio') {
            if (input.checked && $(this._element).hasClass(ClassName.ACTIVE)) {
              triggerChangeEvent = false;
            } else {
              var activeElement = $(rootElement).find(Selector.ACTIVE)[0];

              if (activeElement) {
                $(activeElement).removeClass(ClassName.ACTIVE);
              }
            }
          }

          if (triggerChangeEvent) {
            if (input.hasAttribute('disabled') || rootElement.hasAttribute('disabled') || input.classList.contains('disabled') || rootElement.classList.contains('disabled')) {
              return;
            }

            input.checked = !$(this._element).hasClass(ClassName.ACTIVE);
            $(input).trigger('change');
          }

          input.focus();
          addAriaPressed = false;
        }
      }

      if (addAriaPressed) {
        this._element.setAttribute('aria-pressed', !$(this._element).hasClass(ClassName.ACTIVE));
      }

      if (triggerChangeEvent) {
        $(this._element).toggleClass(ClassName.ACTIVE);
      }
    };

    _proto.dispose = function dispose() {
      $.removeData(this._element, DATA_KEY);
      this._element = null;
    }; // static


    Button._jQueryInterface = function _jQueryInterface(config) {
      return this.each(function () {
        var data = $(this).data(DATA_KEY);

        if (!data) {
          data = new Button(this);
          $(this).data(DATA_KEY, data);
        }

        if (config === 'toggle') {
          data[config]();
        }
      });
    };

    createClass(Button, null, [{
      key: "VERSION",
      get: function get() {
        return VERSION;
      }
    }]);
    return Button;
  }();
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  $(document).on(Event.CLICK_DATA_API, Selector.DATA_TOGGLE_CARROT, function (event) {
    event.preventDefault();
    var button = event.target;

    if (!$(button).hasClass(ClassName.BUTTON)) {
      button = $(button).closest(Selector.BUTTON);
    }

    Button._jQueryInterface.call($(button), 'toggle');
  }).on(Event.FOCUS_BLUR_DATA_API, Selector.DATA_TOGGLE_CARROT, function (event) {
    var button = $(event.target).closest(Selector.BUTTON)[0];
    $(button).toggleClass(ClassName.FOCUS, /^focus(in)?$/.test(event.type));
  });
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $.fn[NAME] = Button._jQueryInterface;
  $.fn[NAME].Constructor = Button;

  $.fn[NAME].noConflict = function () {
    $.fn[NAME] = JQUERY_NO_CONFLICT;
    return Button._jQueryInterface;
  };

  return Button;
}($);

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0-beta.2): carousel.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

var Carousel = function () {
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */
  var NAME = 'carousel';
  var VERSION = '4.0.0-beta.2';
  var DATA_KEY = 'bs.carousel';
  var EVENT_KEY = "." + DATA_KEY;
  var DATA_API_KEY = '.data-api';
  var JQUERY_NO_CONFLICT = $.fn[NAME];
  var TRANSITION_DURATION = 600;
  var ARROW_LEFT_KEYCODE = 37; // KeyboardEvent.which value for left arrow key

  var ARROW_RIGHT_KEYCODE = 39; // KeyboardEvent.which value for right arrow key

  var TOUCHEVENT_COMPAT_WAIT = 500; // Time for mouse compat events to fire after touch

  var Default = {
    interval: 5000,
    keyboard: true,
    slide: false,
    pause: 'hover',
    wrap: true
  };
  var DefaultType = {
    interval: '(number|boolean)',
    keyboard: 'boolean',
    slide: '(boolean|string)',
    pause: '(string|boolean)',
    wrap: 'boolean'
  };
  var Direction = {
    NEXT: 'next',
    PREV: 'prev',
    LEFT: 'left',
    RIGHT: 'right'
  };
  var Event = {
    SLIDE: "slide" + EVENT_KEY,
    SLID: "slid" + EVENT_KEY,
    KEYDOWN: "keydown" + EVENT_KEY,
    MOUSEENTER: "mouseenter" + EVENT_KEY,
    MOUSELEAVE: "mouseleave" + EVENT_KEY,
    TOUCHEND: "touchend" + EVENT_KEY,
    LOAD_DATA_API: "load" + EVENT_KEY + DATA_API_KEY,
    CLICK_DATA_API: "click" + EVENT_KEY + DATA_API_KEY
  };
  var ClassName = {
    CAROUSEL: 'carousel',
    ACTIVE: 'active',
    SLIDE: 'slide',
    RIGHT: 'carousel-item-right',
    LEFT: 'carousel-item-left',
    NEXT: 'carousel-item-next',
    PREV: 'carousel-item-prev',
    ITEM: 'carousel-item'
  };
  var Selector = {
    ACTIVE: '.active',
    ACTIVE_ITEM: '.active.carousel-item',
    ITEM: '.carousel-item',
    NEXT_PREV: '.carousel-item-next, .carousel-item-prev',
    INDICATORS: '.carousel-indicators',
    DATA_SLIDE: '[data-slide], [data-slide-to]',
    DATA_RIDE: '[data-ride="carousel"]'
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

  };

  var Carousel =
  /*#__PURE__*/
  function () {
    function Carousel(element, config) {
      this._items = null;
      this._interval = null;
      this._activeElement = null;
      this._isPaused = false;
      this._isSliding = false;
      this.touchTimeout = null;
      this._config = this._getConfig(config);
      this._element = $(element)[0];
      this._indicatorsElement = $(this._element).find(Selector.INDICATORS)[0];

      this._addEventListeners();
    } // getters


    var _proto = Carousel.prototype;

    // public
    _proto.next = function next() {
      if (!this._isSliding) {
        this._slide(Direction.NEXT);
      }
    };

    _proto.nextWhenVisible = function nextWhenVisible() {
      // Don't call next when the page isn't visible
      // or the carousel or its parent isn't visible
      if (!document.hidden && $(this._element).is(':visible') && $(this._element).css('visibility') !== 'hidden') {
        this.next();
      }
    };

    _proto.prev = function prev() {
      if (!this._isSliding) {
        this._slide(Direction.PREV);
      }
    };

    _proto.pause = function pause(event) {
      if (!event) {
        this._isPaused = true;
      }

      if ($(this._element).find(Selector.NEXT_PREV)[0] && Util.supportsTransitionEnd()) {
        Util.triggerTransitionEnd(this._element);
        this.cycle(true);
      }

      clearInterval(this._interval);
      this._interval = null;
    };

    _proto.cycle = function cycle(event) {
      if (!event) {
        this._isPaused = false;
      }

      if (this._interval) {
        clearInterval(this._interval);
        this._interval = null;
      }

      if (this._config.interval && !this._isPaused) {
        this._interval = setInterval((document.visibilityState ? this.nextWhenVisible : this.next).bind(this), this._config.interval);
      }
    };

    _proto.to = function to(index) {
      var _this = this;

      this._activeElement = $(this._element).find(Selector.ACTIVE_ITEM)[0];

      var activeIndex = this._getItemIndex(this._activeElement);

      if (index > this._items.length - 1 || index < 0) {
        return;
      }

      if (this._isSliding) {
        $(this._element).one(Event.SLID, function () {
          return _this.to(index);
        });
        return;
      }

      if (activeIndex === index) {
        this.pause();
        this.cycle();
        return;
      }

      var direction = index > activeIndex ? Direction.NEXT : Direction.PREV;

      this._slide(direction, this._items[index]);
    };

    _proto.dispose = function dispose() {
      $(this._element).off(EVENT_KEY);
      $.removeData(this._element, DATA_KEY);
      this._items = null;
      this._config = null;
      this._element = null;
      this._interval = null;
      this._isPaused = null;
      this._isSliding = null;
      this._activeElement = null;
      this._indicatorsElement = null;
    }; // private


    _proto._getConfig = function _getConfig(config) {
      config = $.extend({}, Default, config);
      Util.typeCheckConfig(NAME, config, DefaultType);
      return config;
    };

    _proto._addEventListeners = function _addEventListeners() {
      var _this2 = this;

      if (this._config.keyboard) {
        $(this._element).on(Event.KEYDOWN, function (event) {
          return _this2._keydown(event);
        });
      }

      if (this._config.pause === 'hover') {
        $(this._element).on(Event.MOUSEENTER, function (event) {
          return _this2.pause(event);
        }).on(Event.MOUSELEAVE, function (event) {
          return _this2.cycle(event);
        });

        if ('ontouchstart' in document.documentElement) {
          // if it's a touch-enabled device, mouseenter/leave are fired as
          // part of the mouse compatibility events on first tap - the carousel
          // would stop cycling until user tapped out of it;
          // here, we listen for touchend, explicitly pause the carousel
          // (as if it's the second time we tap on it, mouseenter compat event
          // is NOT fired) and after a timeout (to allow for mouse compatibility
          // events to fire) we explicitly restart cycling
          $(this._element).on(Event.TOUCHEND, function () {
            _this2.pause();

            if (_this2.touchTimeout) {
              clearTimeout(_this2.touchTimeout);
            }

            _this2.touchTimeout = setTimeout(function (event) {
              return _this2.cycle(event);
            }, TOUCHEVENT_COMPAT_WAIT + _this2._config.interval);
          });
        }
      }
    };

    _proto._keydown = function _keydown(event) {
      if (/input|textarea/i.test(event.target.tagName)) {
        return;
      }

      switch (event.which) {
        case ARROW_LEFT_KEYCODE:
          event.preventDefault();
          this.prev();
          break;

        case ARROW_RIGHT_KEYCODE:
          event.preventDefault();
          this.next();
          break;

        default:
          return;
      }
    };

    _proto._getItemIndex = function _getItemIndex(element) {
      this._items = $.makeArray($(element).parent().find(Selector.ITEM));
      return this._items.indexOf(element);
    };

    _proto._getItemByDirection = function _getItemByDirection(direction, activeElement) {
      var isNextDirection = direction === Direction.NEXT;
      var isPrevDirection = direction === Direction.PREV;

      var activeIndex = this._getItemIndex(activeElement);

      var lastItemIndex = this._items.length - 1;
      var isGoingToWrap = isPrevDirection && activeIndex === 0 || isNextDirection && activeIndex === lastItemIndex;

      if (isGoingToWrap && !this._config.wrap) {
        return activeElement;
      }

      var delta = direction === Direction.PREV ? -1 : 1;
      var itemIndex = (activeIndex + delta) % this._items.length;
      return itemIndex === -1 ? this._items[this._items.length - 1] : this._items[itemIndex];
    };

    _proto._triggerSlideEvent = function _triggerSlideEvent(relatedTarget, eventDirectionName) {
      var targetIndex = this._getItemIndex(relatedTarget);

      var fromIndex = this._getItemIndex($(this._element).find(Selector.ACTIVE_ITEM)[0]);

      var slideEvent = $.Event(Event.SLIDE, {
        relatedTarget: relatedTarget,
        direction: eventDirectionName,
        from: fromIndex,
        to: targetIndex
      });
      $(this._element).trigger(slideEvent);
      return slideEvent;
    };

    _proto._setActiveIndicatorElement = function _setActiveIndicatorElement(element) {
      if (this._indicatorsElement) {
        $(this._indicatorsElement).find(Selector.ACTIVE).removeClass(ClassName.ACTIVE);

        var nextIndicator = this._indicatorsElement.children[this._getItemIndex(element)];

        if (nextIndicator) {
          $(nextIndicator).addClass(ClassName.ACTIVE);
        }
      }
    };

    _proto._slide = function _slide(direction, element) {
      var _this3 = this;

      var activeElement = $(this._element).find(Selector.ACTIVE_ITEM)[0];

      var activeElementIndex = this._getItemIndex(activeElement);

      var nextElement = element || activeElement && this._getItemByDirection(direction, activeElement);

      var nextElementIndex = this._getItemIndex(nextElement);

      var isCycling = Boolean(this._interval);
      var directionalClassName;
      var orderClassName;
      var eventDirectionName;

      if (direction === Direction.NEXT) {
        directionalClassName = ClassName.LEFT;
        orderClassName = ClassName.NEXT;
        eventDirectionName = Direction.LEFT;
      } else {
        directionalClassName = ClassName.RIGHT;
        orderClassName = ClassName.PREV;
        eventDirectionName = Direction.RIGHT;
      }

      if (nextElement && $(nextElement).hasClass(ClassName.ACTIVE)) {
        this._isSliding = false;
        return;
      }

      var slideEvent = this._triggerSlideEvent(nextElement, eventDirectionName);

      if (slideEvent.isDefaultPrevented()) {
        return;
      }

      if (!activeElement || !nextElement) {
        // some weirdness is happening, so we bail
        return;
      }

      this._isSliding = true;

      if (isCycling) {
        this.pause();
      }

      this._setActiveIndicatorElement(nextElement);

      var slidEvent = $.Event(Event.SLID, {
        relatedTarget: nextElement,
        direction: eventDirectionName,
        from: activeElementIndex,
        to: nextElementIndex
      });

      if (Util.supportsTransitionEnd() && $(this._element).hasClass(ClassName.SLIDE)) {
        $(nextElement).addClass(orderClassName);
        Util.reflow(nextElement);
        $(activeElement).addClass(directionalClassName);
        $(nextElement).addClass(directionalClassName);
        $(activeElement).one(Util.TRANSITION_END, function () {
          $(nextElement).removeClass(directionalClassName + " " + orderClassName).addClass(ClassName.ACTIVE);
          $(activeElement).removeClass(ClassName.ACTIVE + " " + orderClassName + " " + directionalClassName);
          _this3._isSliding = false;
          setTimeout(function () {
            return $(_this3._element).trigger(slidEvent);
          }, 0);
        }).emulateTransitionEnd(TRANSITION_DURATION);
      } else {
        $(activeElement).removeClass(ClassName.ACTIVE);
        $(nextElement).addClass(ClassName.ACTIVE);
        this._isSliding = false;
        $(this._element).trigger(slidEvent);
      }

      if (isCycling) {
        this.cycle();
      }
    }; // static


    Carousel._jQueryInterface = function _jQueryInterface(config) {
      return this.each(function () {
        var data = $(this).data(DATA_KEY);

        var _config = $.extend({}, Default, $(this).data());

        if (typeof config === 'object') {
          $.extend(_config, config);
        }

        var action = typeof config === 'string' ? config : _config.slide;

        if (!data) {
          data = new Carousel(this, _config);
          $(this).data(DATA_KEY, data);
        }

        if (typeof config === 'number') {
          data.to(config);
        } else if (typeof action === 'string') {
          if (typeof data[action] === 'undefined') {
            throw new Error("No method named \"" + action + "\"");
          }

          data[action]();
        } else if (_config.interval) {
          data.pause();
          data.cycle();
        }
      });
    };

    Carousel._dataApiClickHandler = function _dataApiClickHandler(event) {
      var selector = Util.getSelectorFromElement(this);

      if (!selector) {
        return;
      }

      var target = $(selector)[0];

      if (!target || !$(target).hasClass(ClassName.CAROUSEL)) {
        return;
      }

      var config = $.extend({}, $(target).data(), $(this).data());
      var slideIndex = this.getAttribute('data-slide-to');

      if (slideIndex) {
        config.interval = false;
      }

      Carousel._jQueryInterface.call($(target), config);

      if (slideIndex) {
        $(target).data(DATA_KEY).to(slideIndex);
      }

      event.preventDefault();
    };

    createClass(Carousel, null, [{
      key: "VERSION",
      get: function get() {
        return VERSION;
      }
    }, {
      key: "Default",
      get: function get() {
        return Default;
      }
    }]);
    return Carousel;
  }();
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  $(document).on(Event.CLICK_DATA_API, Selector.DATA_SLIDE, Carousel._dataApiClickHandler);
  $(window).on(Event.LOAD_DATA_API, function () {
    $(Selector.DATA_RIDE).each(function () {
      var $carousel = $(this);

      Carousel._jQueryInterface.call($carousel, $carousel.data());
    });
  });
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $.fn[NAME] = Carousel._jQueryInterface;
  $.fn[NAME].Constructor = Carousel;

  $.fn[NAME].noConflict = function () {
    $.fn[NAME] = JQUERY_NO_CONFLICT;
    return Carousel._jQueryInterface;
  };

  return Carousel;
}($);

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0-beta.2): collapse.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

var Collapse = function () {
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */
  var NAME = 'collapse';
  var VERSION = '4.0.0-beta.2';
  var DATA_KEY = 'bs.collapse';
  var EVENT_KEY = "." + DATA_KEY;
  var DATA_API_KEY = '.data-api';
  var JQUERY_NO_CONFLICT = $.fn[NAME];
  var TRANSITION_DURATION = 600;
  var Default = {
    toggle: true,
    parent: ''
  };
  var DefaultType = {
    toggle: 'boolean',
    parent: '(string|element)'
  };
  var Event = {
    SHOW: "show" + EVENT_KEY,
    SHOWN: "shown" + EVENT_KEY,
    HIDE: "hide" + EVENT_KEY,
    HIDDEN: "hidden" + EVENT_KEY,
    CLICK_DATA_API: "click" + EVENT_KEY + DATA_API_KEY
  };
  var ClassName = {
    SHOW: 'show',
    COLLAPSE: 'collapse',
    COLLAPSING: 'collapsing',
    COLLAPSED: 'collapsed'
  };
  var Dimension = {
    WIDTH: 'width',
    HEIGHT: 'height'
  };
  var Selector = {
    ACTIVES: '.show, .collapsing',
    DATA_TOGGLE: '[data-toggle="collapse"]'
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

  };

  var Collapse =
  /*#__PURE__*/
  function () {
    function Collapse(element, config) {
      this._isTransitioning = false;
      this._element = element;
      this._config = this._getConfig(config);
      this._triggerArray = $.makeArray($("[data-toggle=\"collapse\"][href=\"#" + element.id + "\"]," + ("[data-toggle=\"collapse\"][data-target=\"#" + element.id + "\"]")));
      var tabToggles = $(Selector.DATA_TOGGLE);

      for (var i = 0; i < tabToggles.length; i++) {
        var elem = tabToggles[i];
        var selector = Util.getSelectorFromElement(elem);

        if (selector !== null && $(selector).filter(element).length > 0) {
          this._triggerArray.push(elem);
        }
      }

      this._parent = this._config.parent ? this._getParent() : null;

      if (!this._config.parent) {
        this._addAriaAndCollapsedClass(this._element, this._triggerArray);
      }

      if (this._config.toggle) {
        this.toggle();
      }
    } // getters


    var _proto = Collapse.prototype;

    // public
    _proto.toggle = function toggle() {
      if ($(this._element).hasClass(ClassName.SHOW)) {
        this.hide();
      } else {
        this.show();
      }
    };

    _proto.show = function show() {
      var _this = this;

      if (this._isTransitioning || $(this._element).hasClass(ClassName.SHOW)) {
        return;
      }

      var actives;
      var activesData;

      if (this._parent) {
        actives = $.makeArray($(this._parent).children().children(Selector.ACTIVES));

        if (!actives.length) {
          actives = null;
        }
      }

      if (actives) {
        activesData = $(actives).data(DATA_KEY);

        if (activesData && activesData._isTransitioning) {
          return;
        }
      }

      var startEvent = $.Event(Event.SHOW);
      $(this._element).trigger(startEvent);

      if (startEvent.isDefaultPrevented()) {
        return;
      }

      if (actives) {
        Collapse._jQueryInterface.call($(actives), 'hide');

        if (!activesData) {
          $(actives).data(DATA_KEY, null);
        }
      }

      var dimension = this._getDimension();

      $(this._element).removeClass(ClassName.COLLAPSE).addClass(ClassName.COLLAPSING);
      this._element.style[dimension] = 0;

      if (this._triggerArray.length) {
        $(this._triggerArray).removeClass(ClassName.COLLAPSED).attr('aria-expanded', true);
      }

      this.setTransitioning(true);

      var complete = function complete() {
        $(_this._element).removeClass(ClassName.COLLAPSING).addClass(ClassName.COLLAPSE).addClass(ClassName.SHOW);
        _this._element.style[dimension] = '';

        _this.setTransitioning(false);

        $(_this._element).trigger(Event.SHOWN);
      };

      if (!Util.supportsTransitionEnd()) {
        complete();
        return;
      }

      var capitalizedDimension = dimension[0].toUpperCase() + dimension.slice(1);
      var scrollSize = "scroll" + capitalizedDimension;
      $(this._element).one(Util.TRANSITION_END, complete).emulateTransitionEnd(TRANSITION_DURATION);
      this._element.style[dimension] = this._element[scrollSize] + "px";
    };

    _proto.hide = function hide() {
      var _this2 = this;

      if (this._isTransitioning || !$(this._element).hasClass(ClassName.SHOW)) {
        return;
      }

      var startEvent = $.Event(Event.HIDE);
      $(this._element).trigger(startEvent);

      if (startEvent.isDefaultPrevented()) {
        return;
      }

      var dimension = this._getDimension();

      this._element.style[dimension] = this._element.getBoundingClientRect()[dimension] + "px";
      Util.reflow(this._element);
      $(this._element).addClass(ClassName.COLLAPSING).removeClass(ClassName.COLLAPSE).removeClass(ClassName.SHOW);

      if (this._triggerArray.length) {
        for (var i = 0; i < this._triggerArray.length; i++) {
          var trigger = this._triggerArray[i];
          var selector = Util.getSelectorFromElement(trigger);

          if (selector !== null) {
            var $elem = $(selector);

            if (!$elem.hasClass(ClassName.SHOW)) {
              $(trigger).addClass(ClassName.COLLAPSED).attr('aria-expanded', false);
            }
          }
        }
      }

      this.setTransitioning(true);

      var complete = function complete() {
        _this2.setTransitioning(false);

        $(_this2._element).removeClass(ClassName.COLLAPSING).addClass(ClassName.COLLAPSE).trigger(Event.HIDDEN);
      };

      this._element.style[dimension] = '';

      if (!Util.supportsTransitionEnd()) {
        complete();
        return;
      }

      $(this._element).one(Util.TRANSITION_END, complete).emulateTransitionEnd(TRANSITION_DURATION);
    };

    _proto.setTransitioning = function setTransitioning(isTransitioning) {
      this._isTransitioning = isTransitioning;
    };

    _proto.dispose = function dispose() {
      $.removeData(this._element, DATA_KEY);
      this._config = null;
      this._parent = null;
      this._element = null;
      this._triggerArray = null;
      this._isTransitioning = null;
    }; // private


    _proto._getConfig = function _getConfig(config) {
      config = $.extend({}, Default, config);
      config.toggle = Boolean(config.toggle); // coerce string values

      Util.typeCheckConfig(NAME, config, DefaultType);
      return config;
    };

    _proto._getDimension = function _getDimension() {
      var hasWidth = $(this._element).hasClass(Dimension.WIDTH);
      return hasWidth ? Dimension.WIDTH : Dimension.HEIGHT;
    };

    _proto._getParent = function _getParent() {
      var _this3 = this;

      var parent = null;

      if (Util.isElement(this._config.parent)) {
        parent = this._config.parent; // it's a jQuery object

        if (typeof this._config.parent.jquery !== 'undefined') {
          parent = this._config.parent[0];
        }
      } else {
        parent = $(this._config.parent)[0];
      }

      var selector = "[data-toggle=\"collapse\"][data-parent=\"" + this._config.parent + "\"]";
      $(parent).find(selector).each(function (i, element) {
        _this3._addAriaAndCollapsedClass(Collapse._getTargetFromElement(element), [element]);
      });
      return parent;
    };

    _proto._addAriaAndCollapsedClass = function _addAriaAndCollapsedClass(element, triggerArray) {
      if (element) {
        var isOpen = $(element).hasClass(ClassName.SHOW);

        if (triggerArray.length) {
          $(triggerArray).toggleClass(ClassName.COLLAPSED, !isOpen).attr('aria-expanded', isOpen);
        }
      }
    }; // static


    Collapse._getTargetFromElement = function _getTargetFromElement(element) {
      var selector = Util.getSelectorFromElement(element);
      return selector ? $(selector)[0] : null;
    };

    Collapse._jQueryInterface = function _jQueryInterface(config) {
      return this.each(function () {
        var $this = $(this);
        var data = $this.data(DATA_KEY);

        var _config = $.extend({}, Default, $this.data(), typeof config === 'object' && config);

        if (!data && _config.toggle && /show|hide/.test(config)) {
          _config.toggle = false;
        }

        if (!data) {
          data = new Collapse(this, _config);
          $this.data(DATA_KEY, data);
        }

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new Error("No method named \"" + config + "\"");
          }

          data[config]();
        }
      });
    };

    createClass(Collapse, null, [{
      key: "VERSION",
      get: function get() {
        return VERSION;
      }
    }, {
      key: "Default",
      get: function get() {
        return Default;
      }
    }]);
    return Collapse;
  }();
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  $(document).on(Event.CLICK_DATA_API, Selector.DATA_TOGGLE, function (event) {
    // preventDefault only for <a> elements (which change the URL) not inside the collapsible element
    if (event.currentTarget.tagName === 'A') {
      event.preventDefault();
    }

    var $trigger = $(this);
    var selector = Util.getSelectorFromElement(this);
    $(selector).each(function () {
      var $target = $(this);
      var data = $target.data(DATA_KEY);
      var config = data ? 'toggle' : $trigger.data();

      Collapse._jQueryInterface.call($target, config);
    });
  });
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $.fn[NAME] = Collapse._jQueryInterface;
  $.fn[NAME].Constructor = Collapse;

  $.fn[NAME].noConflict = function () {
    $.fn[NAME] = JQUERY_NO_CONFLICT;
    return Collapse._jQueryInterface;
  };

  return Collapse;
}($);

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0-beta.2): dropdown.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

var Dropdown = function () {
  /**
   * Check for Popper dependency
   * Popper - https://popper.js.org
   */
  if (typeof Popper === 'undefined') {
    throw new Error('Bootstrap dropdown require Popper.js (https://popper.js.org)');
  }
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */


  var NAME = 'dropdown';
  var VERSION = '4.0.0-beta.2';
  var DATA_KEY = 'bs.dropdown';
  var EVENT_KEY = "." + DATA_KEY;
  var DATA_API_KEY = '.data-api';
  var JQUERY_NO_CONFLICT = $.fn[NAME];
  var ESCAPE_KEYCODE = 27; // KeyboardEvent.which value for Escape (Esc) key

  var SPACE_KEYCODE = 32; // KeyboardEvent.which value for space key

  var TAB_KEYCODE = 9; // KeyboardEvent.which value for tab key

  var ARROW_UP_KEYCODE = 38; // KeyboardEvent.which value for up arrow key

  var ARROW_DOWN_KEYCODE = 40; // KeyboardEvent.which value for down arrow key

  var RIGHT_MOUSE_BUTTON_WHICH = 3; // MouseEvent.which value for the right button (assuming a right-handed mouse)

  var REGEXP_KEYDOWN = new RegExp(ARROW_UP_KEYCODE + "|" + ARROW_DOWN_KEYCODE + "|" + ESCAPE_KEYCODE);
  var Event = {
    HIDE: "hide" + EVENT_KEY,
    HIDDEN: "hidden" + EVENT_KEY,
    SHOW: "show" + EVENT_KEY,
    SHOWN: "shown" + EVENT_KEY,
    CLICK: "click" + EVENT_KEY,
    CLICK_DATA_API: "click" + EVENT_KEY + DATA_API_KEY,
    KEYDOWN_DATA_API: "keydown" + EVENT_KEY + DATA_API_KEY,
    KEYUP_DATA_API: "keyup" + EVENT_KEY + DATA_API_KEY
  };
  var ClassName = {
    DISABLED: 'disabled',
    SHOW: 'show',
    DROPUP: 'dropup',
    MENURIGHT: 'dropdown-menu-right',
    MENULEFT: 'dropdown-menu-left'
  };
  var Selector = {
    DATA_TOGGLE: '[data-toggle="dropdown"]',
    FORM_CHILD: '.dropdown form',
    MENU: '.dropdown-menu',
    NAVBAR_NAV: '.navbar-nav',
    VISIBLE_ITEMS: '.dropdown-menu .dropdown-item:not(.disabled)'
  };
  var AttachmentMap = {
    TOP: 'top-start',
    TOPEND: 'top-end',
    BOTTOM: 'bottom-start',
    BOTTOMEND: 'bottom-end'
  };
  var Default = {
    offset: 0,
    flip: true
  };
  var DefaultType = {
    offset: '(number|string|function)',
    flip: 'boolean'
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

  };

  var Dropdown =
  /*#__PURE__*/
  function () {
    function Dropdown(element, config) {
      this._element = element;
      this._popper = null;
      this._config = this._getConfig(config);
      this._menu = this._getMenuElement();
      this._inNavbar = this._detectNavbar();

      this._addEventListeners();
    } // getters


    var _proto = Dropdown.prototype;

    // public
    _proto.toggle = function toggle() {
      if (this._element.disabled || $(this._element).hasClass(ClassName.DISABLED)) {
        return;
      }

      var parent = Dropdown._getParentFromElement(this._element);

      var isActive = $(this._menu).hasClass(ClassName.SHOW);

      Dropdown._clearMenus();

      if (isActive) {
        return;
      }

      var relatedTarget = {
        relatedTarget: this._element
      };
      var showEvent = $.Event(Event.SHOW, relatedTarget);
      $(parent).trigger(showEvent);

      if (showEvent.isDefaultPrevented()) {
        return;
      }

      var element = this._element; // for dropup with alignment we use the parent as popper container

      if ($(parent).hasClass(ClassName.DROPUP)) {
        if ($(this._menu).hasClass(ClassName.MENULEFT) || $(this._menu).hasClass(ClassName.MENURIGHT)) {
          element = parent;
        }
      }

      this._popper = new Popper(element, this._menu, this._getPopperConfig()); // if this is a touch-enabled device we add extra
      // empty mouseover listeners to the body's immediate children;
      // only needed because of broken event delegation on iOS
      // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html

      if ('ontouchstart' in document.documentElement && !$(parent).closest(Selector.NAVBAR_NAV).length) {
        $('body').children().on('mouseover', null, $.noop);
      }

      this._element.focus();

      this._element.setAttribute('aria-expanded', true);

      $(this._menu).toggleClass(ClassName.SHOW);
      $(parent).toggleClass(ClassName.SHOW).trigger($.Event(Event.SHOWN, relatedTarget));
    };

    _proto.dispose = function dispose() {
      $.removeData(this._element, DATA_KEY);
      $(this._element).off(EVENT_KEY);
      this._element = null;
      this._menu = null;

      if (this._popper !== null) {
        this._popper.destroy();
      }

      this._popper = null;
    };

    _proto.update = function update() {
      this._inNavbar = this._detectNavbar();

      if (this._popper !== null) {
        this._popper.scheduleUpdate();
      }
    }; // private


    _proto._addEventListeners = function _addEventListeners() {
      var _this = this;

      $(this._element).on(Event.CLICK, function (event) {
        event.preventDefault();
        event.stopPropagation();

        _this.toggle();
      });
    };

    _proto._getConfig = function _getConfig(config) {
      config = $.extend({}, this.constructor.Default, $(this._element).data(), config);
      Util.typeCheckConfig(NAME, config, this.constructor.DefaultType);
      return config;
    };

    _proto._getMenuElement = function _getMenuElement() {
      if (!this._menu) {
        var parent = Dropdown._getParentFromElement(this._element);

        this._menu = $(parent).find(Selector.MENU)[0];
      }

      return this._menu;
    };

    _proto._getPlacement = function _getPlacement() {
      var $parentDropdown = $(this._element).parent();
      var placement = AttachmentMap.BOTTOM; // Handle dropup

      if ($parentDropdown.hasClass(ClassName.DROPUP)) {
        placement = AttachmentMap.TOP;

        if ($(this._menu).hasClass(ClassName.MENURIGHT)) {
          placement = AttachmentMap.TOPEND;
        }
      } else if ($(this._menu).hasClass(ClassName.MENURIGHT)) {
        placement = AttachmentMap.BOTTOMEND;
      }

      return placement;
    };

    _proto._detectNavbar = function _detectNavbar() {
      return $(this._element).closest('.navbar').length > 0;
    };

    _proto._getPopperConfig = function _getPopperConfig() {
      var _this2 = this;

      var offsetConf = {};

      if (typeof this._config.offset === 'function') {
        offsetConf.fn = function (data) {
          data.offsets = $.extend({}, data.offsets, _this2._config.offset(data.offsets) || {});
          return data;
        };
      } else {
        offsetConf.offset = this._config.offset;
      }

      var popperConfig = {
        placement: this._getPlacement(),
        modifiers: {
          offset: offsetConf,
          flip: {
            enabled: this._config.flip
          }
        } // Disable Popper.js for Dropdown in Navbar

      };

      if (this._inNavbar) {
        popperConfig.modifiers.applyStyle = {
          enabled: !this._inNavbar
        };
      }

      return popperConfig;
    }; // static


    Dropdown._jQueryInterface = function _jQueryInterface(config) {
      return this.each(function () {
        var data = $(this).data(DATA_KEY);

        var _config = typeof config === 'object' ? config : null;

        if (!data) {
          data = new Dropdown(this, _config);
          $(this).data(DATA_KEY, data);
        }

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new Error("No method named \"" + config + "\"");
          }

          data[config]();
        }
      });
    };

    Dropdown._clearMenus = function _clearMenus(event) {
      if (event && (event.which === RIGHT_MOUSE_BUTTON_WHICH || event.type === 'keyup' && event.which !== TAB_KEYCODE)) {
        return;
      }

      var toggles = $.makeArray($(Selector.DATA_TOGGLE));

      for (var i = 0; i < toggles.length; i++) {
        var parent = Dropdown._getParentFromElement(toggles[i]);

        var context = $(toggles[i]).data(DATA_KEY);
        var relatedTarget = {
          relatedTarget: toggles[i]
        };

        if (!context) {
          continue;
        }

        var dropdownMenu = context._menu;

        if (!$(parent).hasClass(ClassName.SHOW)) {
          continue;
        }

        if (event && (event.type === 'click' && /input|textarea/i.test(event.target.tagName) || event.type === 'keyup' && event.which === TAB_KEYCODE) && $.contains(parent, event.target)) {
          continue;
        }

        var hideEvent = $.Event(Event.HIDE, relatedTarget);
        $(parent).trigger(hideEvent);

        if (hideEvent.isDefaultPrevented()) {
          continue;
        } // if this is a touch-enabled device we remove the extra
        // empty mouseover listeners we added for iOS support


        if ('ontouchstart' in document.documentElement) {
          $('body').children().off('mouseover', null, $.noop);
        }

        toggles[i].setAttribute('aria-expanded', 'false');
        $(dropdownMenu).removeClass(ClassName.SHOW);
        $(parent).removeClass(ClassName.SHOW).trigger($.Event(Event.HIDDEN, relatedTarget));
      }
    };

    Dropdown._getParentFromElement = function _getParentFromElement(element) {
      var parent;
      var selector = Util.getSelectorFromElement(element);

      if (selector) {
        parent = $(selector)[0];
      }

      return parent || element.parentNode;
    };

    Dropdown._dataApiKeydownHandler = function _dataApiKeydownHandler(event) {
      if (!REGEXP_KEYDOWN.test(event.which) || /button/i.test(event.target.tagName) && event.which === SPACE_KEYCODE || /input|textarea/i.test(event.target.tagName)) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      if (this.disabled || $(this).hasClass(ClassName.DISABLED)) {
        return;
      }

      var parent = Dropdown._getParentFromElement(this);

      var isActive = $(parent).hasClass(ClassName.SHOW);

      if (!isActive && (event.which !== ESCAPE_KEYCODE || event.which !== SPACE_KEYCODE) || isActive && (event.which === ESCAPE_KEYCODE || event.which === SPACE_KEYCODE)) {
        if (event.which === ESCAPE_KEYCODE) {
          var toggle = $(parent).find(Selector.DATA_TOGGLE)[0];
          $(toggle).trigger('focus');
        }

        $(this).trigger('click');
        return;
      }

      var items = $(parent).find(Selector.VISIBLE_ITEMS).get();

      if (!items.length) {
        return;
      }

      var index = items.indexOf(event.target);

      if (event.which === ARROW_UP_KEYCODE && index > 0) {
        // up
        index--;
      }

      if (event.which === ARROW_DOWN_KEYCODE && index < items.length - 1) {
        // down
        index++;
      }

      if (index < 0) {
        index = 0;
      }

      items[index].focus();
    };

    createClass(Dropdown, null, [{
      key: "VERSION",
      get: function get() {
        return VERSION;
      }
    }, {
      key: "Default",
      get: function get() {
        return Default;
      }
    }, {
      key: "DefaultType",
      get: function get() {
        return DefaultType;
      }
    }]);
    return Dropdown;
  }();
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  $(document).on(Event.KEYDOWN_DATA_API, Selector.DATA_TOGGLE, Dropdown._dataApiKeydownHandler).on(Event.KEYDOWN_DATA_API, Selector.MENU, Dropdown._dataApiKeydownHandler).on(Event.CLICK_DATA_API + " " + Event.KEYUP_DATA_API, Dropdown._clearMenus).on(Event.CLICK_DATA_API, Selector.DATA_TOGGLE, function (event) {
    event.preventDefault();
    event.stopPropagation();

    Dropdown._jQueryInterface.call($(this), 'toggle');
  }).on(Event.CLICK_DATA_API, Selector.FORM_CHILD, function (e) {
    e.stopPropagation();
  });
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $.fn[NAME] = Dropdown._jQueryInterface;
  $.fn[NAME].Constructor = Dropdown;

  $.fn[NAME].noConflict = function () {
    $.fn[NAME] = JQUERY_NO_CONFLICT;
    return Dropdown._jQueryInterface;
  };

  return Dropdown;
}($, Popper);

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0-beta.2): modal.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

var Modal = function () {
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */
  var NAME = 'modal';
  var VERSION = '4.0.0-beta.2';
  var DATA_KEY = 'bs.modal';
  var EVENT_KEY = "." + DATA_KEY;
  var DATA_API_KEY = '.data-api';
  var JQUERY_NO_CONFLICT = $.fn[NAME];
  var TRANSITION_DURATION = 300;
  var BACKDROP_TRANSITION_DURATION = 150;
  var ESCAPE_KEYCODE = 27; // KeyboardEvent.which value for Escape (Esc) key

  var Default = {
    backdrop: true,
    keyboard: true,
    focus: true,
    show: true
  };
  var DefaultType = {
    backdrop: '(boolean|string)',
    keyboard: 'boolean',
    focus: 'boolean',
    show: 'boolean'
  };
  var Event = {
    HIDE: "hide" + EVENT_KEY,
    HIDDEN: "hidden" + EVENT_KEY,
    SHOW: "show" + EVENT_KEY,
    SHOWN: "shown" + EVENT_KEY,
    FOCUSIN: "focusin" + EVENT_KEY,
    RESIZE: "resize" + EVENT_KEY,
    CLICK_DISMISS: "click.dismiss" + EVENT_KEY,
    KEYDOWN_DISMISS: "keydown.dismiss" + EVENT_KEY,
    MOUSEUP_DISMISS: "mouseup.dismiss" + EVENT_KEY,
    MOUSEDOWN_DISMISS: "mousedown.dismiss" + EVENT_KEY,
    CLICK_DATA_API: "click" + EVENT_KEY + DATA_API_KEY
  };
  var ClassName = {
    SCROLLBAR_MEASURER: 'modal-scrollbar-measure',
    BACKDROP: 'modal-backdrop',
    OPEN: 'modal-open',
    FADE: 'fade',
    SHOW: 'show'
  };
  var Selector = {
    DIALOG: '.modal-dialog',
    DATA_TOGGLE: '[data-toggle="modal"]',
    DATA_DISMISS: '[data-dismiss="modal"]',
    FIXED_CONTENT: '.fixed-top, .fixed-bottom, .is-fixed, .sticky-top',
    STICKY_CONTENT: '.sticky-top',
    NAVBAR_TOGGLER: '.navbar-toggler'
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

  };

  var Modal =
  /*#__PURE__*/
  function () {
    function Modal(element, config) {
      this._config = this._getConfig(config);
      this._element = element;
      this._dialog = $(element).find(Selector.DIALOG)[0];
      this._backdrop = null;
      this._isShown = false;
      this._isBodyOverflowing = false;
      this._ignoreBackdropClick = false;
      this._originalBodyPadding = 0;
      this._scrollbarWidth = 0;
    } // getters


    var _proto = Modal.prototype;

    // public
    _proto.toggle = function toggle(relatedTarget) {
      return this._isShown ? this.hide() : this.show(relatedTarget);
    };

    _proto.show = function show(relatedTarget) {
      var _this = this;

      if (this._isTransitioning || this._isShown) {
        return;
      }

      if (Util.supportsTransitionEnd() && $(this._element).hasClass(ClassName.FADE)) {
        this._isTransitioning = true;
      }

      var showEvent = $.Event(Event.SHOW, {
        relatedTarget: relatedTarget
      });
      $(this._element).trigger(showEvent);

      if (this._isShown || showEvent.isDefaultPrevented()) {
        return;
      }

      this._isShown = true;

      this._checkScrollbar();

      this._setScrollbar();

      this._adjustDialog();

      $(document.body).addClass(ClassName.OPEN);

      this._setEscapeEvent();

      this._setResizeEvent();

      $(this._element).on(Event.CLICK_DISMISS, Selector.DATA_DISMISS, function (event) {
        return _this.hide(event);
      });
      $(this._dialog).on(Event.MOUSEDOWN_DISMISS, function () {
        $(_this._element).one(Event.MOUSEUP_DISMISS, function (event) {
          if ($(event.target).is(_this._element)) {
            _this._ignoreBackdropClick = true;
          }
        });
      });

      this._showBackdrop(function () {
        return _this._showElement(relatedTarget);
      });
    };

    _proto.hide = function hide(event) {
      var _this2 = this;

      if (event) {
        event.preventDefault();
      }

      if (this._isTransitioning || !this._isShown) {
        return;
      }

      var hideEvent = $.Event(Event.HIDE);
      $(this._element).trigger(hideEvent);

      if (!this._isShown || hideEvent.isDefaultPrevented()) {
        return;
      }

      this._isShown = false;
      var transition = Util.supportsTransitionEnd() && $(this._element).hasClass(ClassName.FADE);

      if (transition) {
        this._isTransitioning = true;
      }

      this._setEscapeEvent();

      this._setResizeEvent();

      $(document).off(Event.FOCUSIN);
      $(this._element).removeClass(ClassName.SHOW);
      $(this._element).off(Event.CLICK_DISMISS);
      $(this._dialog).off(Event.MOUSEDOWN_DISMISS);

      if (transition) {
        $(this._element).one(Util.TRANSITION_END, function (event) {
          return _this2._hideModal(event);
        }).emulateTransitionEnd(TRANSITION_DURATION);
      } else {
        this._hideModal();
      }
    };

    _proto.dispose = function dispose() {
      $.removeData(this._element, DATA_KEY);
      $(window, document, this._element, this._backdrop).off(EVENT_KEY);
      this._config = null;
      this._element = null;
      this._dialog = null;
      this._backdrop = null;
      this._isShown = null;
      this._isBodyOverflowing = null;
      this._ignoreBackdropClick = null;
      this._scrollbarWidth = null;
    };

    _proto.handleUpdate = function handleUpdate() {
      this._adjustDialog();
    }; // private


    _proto._getConfig = function _getConfig(config) {
      config = $.extend({}, Default, config);
      Util.typeCheckConfig(NAME, config, DefaultType);
      return config;
    };

    _proto._showElement = function _showElement(relatedTarget) {
      var _this3 = this;

      var transition = Util.supportsTransitionEnd() && $(this._element).hasClass(ClassName.FADE);

      if (!this._element.parentNode || this._element.parentNode.nodeType !== Node.ELEMENT_NODE) {
        // don't move modals dom position
        document.body.appendChild(this._element);
      }

      this._element.style.display = 'block';

      this._element.removeAttribute('aria-hidden');

      this._element.scrollTop = 0;

      if (transition) {
        Util.reflow(this._element);
      }

      $(this._element).addClass(ClassName.SHOW);

      if (this._config.focus) {
        this._enforceFocus();
      }

      var shownEvent = $.Event(Event.SHOWN, {
        relatedTarget: relatedTarget
      });

      var transitionComplete = function transitionComplete() {
        if (_this3._config.focus) {
          _this3._element.focus();
        }

        _this3._isTransitioning = false;
        $(_this3._element).trigger(shownEvent);
      };

      if (transition) {
        $(this._dialog).one(Util.TRANSITION_END, transitionComplete).emulateTransitionEnd(TRANSITION_DURATION);
      } else {
        transitionComplete();
      }
    };

    _proto._enforceFocus = function _enforceFocus() {
      var _this4 = this;

      $(document).off(Event.FOCUSIN) // guard against infinite focus loop
      .on(Event.FOCUSIN, function (event) {
        if (document !== event.target && _this4._element !== event.target && !$(_this4._element).has(event.target).length) {
          _this4._element.focus();
        }
      });
    };

    _proto._setEscapeEvent = function _setEscapeEvent() {
      var _this5 = this;

      if (this._isShown && this._config.keyboard) {
        $(this._element).on(Event.KEYDOWN_DISMISS, function (event) {
          if (event.which === ESCAPE_KEYCODE) {
            event.preventDefault();

            _this5.hide();
          }
        });
      } else if (!this._isShown) {
        $(this._element).off(Event.KEYDOWN_DISMISS);
      }
    };

    _proto._setResizeEvent = function _setResizeEvent() {
      var _this6 = this;

      if (this._isShown) {
        $(window).on(Event.RESIZE, function (event) {
          return _this6.handleUpdate(event);
        });
      } else {
        $(window).off(Event.RESIZE);
      }
    };

    _proto._hideModal = function _hideModal() {
      var _this7 = this;

      this._element.style.display = 'none';

      this._element.setAttribute('aria-hidden', true);

      this._isTransitioning = false;

      this._showBackdrop(function () {
        $(document.body).removeClass(ClassName.OPEN);

        _this7._resetAdjustments();

        _this7._resetScrollbar();

        $(_this7._element).trigger(Event.HIDDEN);
      });
    };

    _proto._removeBackdrop = function _removeBackdrop() {
      if (this._backdrop) {
        $(this._backdrop).remove();
        this._backdrop = null;
      }
    };

    _proto._showBackdrop = function _showBackdrop(callback) {
      var _this8 = this;

      var animate = $(this._element).hasClass(ClassName.FADE) ? ClassName.FADE : '';

      if (this._isShown && this._config.backdrop) {
        var doAnimate = Util.supportsTransitionEnd() && animate;
        this._backdrop = document.createElement('div');
        this._backdrop.className = ClassName.BACKDROP;

        if (animate) {
          $(this._backdrop).addClass(animate);
        }

        $(this._backdrop).appendTo(document.body);
        $(this._element).on(Event.CLICK_DISMISS, function (event) {
          if (_this8._ignoreBackdropClick) {
            _this8._ignoreBackdropClick = false;
            return;
          }

          if (event.target !== event.currentTarget) {
            return;
          }

          if (_this8._config.backdrop === 'static') {
            _this8._element.focus();
          } else {
            _this8.hide();
          }
        });

        if (doAnimate) {
          Util.reflow(this._backdrop);
        }

        $(this._backdrop).addClass(ClassName.SHOW);

        if (!callback) {
          return;
        }

        if (!doAnimate) {
          callback();
          return;
        }

        $(this._backdrop).one(Util.TRANSITION_END, callback).emulateTransitionEnd(BACKDROP_TRANSITION_DURATION);
      } else if (!this._isShown && this._backdrop) {
        $(this._backdrop).removeClass(ClassName.SHOW);

        var callbackRemove = function callbackRemove() {
          _this8._removeBackdrop();

          if (callback) {
            callback();
          }
        };

        if (Util.supportsTransitionEnd() && $(this._element).hasClass(ClassName.FADE)) {
          $(this._backdrop).one(Util.TRANSITION_END, callbackRemove).emulateTransitionEnd(BACKDROP_TRANSITION_DURATION);
        } else {
          callbackRemove();
        }
      } else if (callback) {
        callback();
      }
    }; // ----------------------------------------------------------------------
    // the following methods are used to handle overflowing modals
    // todo (fat): these should probably be refactored out of modal.js
    // ----------------------------------------------------------------------


    _proto._adjustDialog = function _adjustDialog() {
      var isModalOverflowing = this._element.scrollHeight > document.documentElement.clientHeight;

      if (!this._isBodyOverflowing && isModalOverflowing) {
        this._element.style.paddingLeft = this._scrollbarWidth + "px";
      }

      if (this._isBodyOverflowing && !isModalOverflowing) {
        this._element.style.paddingRight = this._scrollbarWidth + "px";
      }
    };

    _proto._resetAdjustments = function _resetAdjustments() {
      this._element.style.paddingLeft = '';
      this._element.style.paddingRight = '';
    };

    _proto._checkScrollbar = function _checkScrollbar() {
      var rect = document.body.getBoundingClientRect();
      this._isBodyOverflowing = rect.left + rect.right < window.innerWidth;
      this._scrollbarWidth = this._getScrollbarWidth();
    };

    _proto._setScrollbar = function _setScrollbar() {
      var _this9 = this;

      if (this._isBodyOverflowing) {
        // Note: DOMNode.style.paddingRight returns the actual value or '' if not set
        //   while $(DOMNode).css('padding-right') returns the calculated value or 0 if not set
        // Adjust fixed content padding
        $(Selector.FIXED_CONTENT).each(function (index, element) {
          var actualPadding = $(element)[0].style.paddingRight;
          var calculatedPadding = $(element).css('padding-right');
          $(element).data('padding-right', actualPadding).css('padding-right', parseFloat(calculatedPadding) + _this9._scrollbarWidth + "px");
        }); // Adjust sticky content margin

        $(Selector.STICKY_CONTENT).each(function (index, element) {
          var actualMargin = $(element)[0].style.marginRight;
          var calculatedMargin = $(element).css('margin-right');
          $(element).data('margin-right', actualMargin).css('margin-right', parseFloat(calculatedMargin) - _this9._scrollbarWidth + "px");
        }); // Adjust navbar-toggler margin

        $(Selector.NAVBAR_TOGGLER).each(function (index, element) {
          var actualMargin = $(element)[0].style.marginRight;
          var calculatedMargin = $(element).css('margin-right');
          $(element).data('margin-right', actualMargin).css('margin-right', parseFloat(calculatedMargin) + _this9._scrollbarWidth + "px");
        }); // Adjust body padding

        var actualPadding = document.body.style.paddingRight;
        var calculatedPadding = $('body').css('padding-right');
        $('body').data('padding-right', actualPadding).css('padding-right', parseFloat(calculatedPadding) + this._scrollbarWidth + "px");
      }
    };

    _proto._resetScrollbar = function _resetScrollbar() {
      // Restore fixed content padding
      $(Selector.FIXED_CONTENT).each(function (index, element) {
        var padding = $(element).data('padding-right');

        if (typeof padding !== 'undefined') {
          $(element).css('padding-right', padding).removeData('padding-right');
        }
      }); // Restore sticky content and navbar-toggler margin

      $(Selector.STICKY_CONTENT + ", " + Selector.NAVBAR_TOGGLER).each(function (index, element) {
        var margin = $(element).data('margin-right');

        if (typeof margin !== 'undefined') {
          $(element).css('margin-right', margin).removeData('margin-right');
        }
      }); // Restore body padding

      var padding = $('body').data('padding-right');

      if (typeof padding !== 'undefined') {
        $('body').css('padding-right', padding).removeData('padding-right');
      }
    };

    _proto._getScrollbarWidth = function _getScrollbarWidth() {
      // thx d.walsh
      var scrollDiv = document.createElement('div');
      scrollDiv.className = ClassName.SCROLLBAR_MEASURER;
      document.body.appendChild(scrollDiv);
      var scrollbarWidth = scrollDiv.getBoundingClientRect().width - scrollDiv.clientWidth;
      document.body.removeChild(scrollDiv);
      return scrollbarWidth;
    }; // static


    Modal._jQueryInterface = function _jQueryInterface(config, relatedTarget) {
      return this.each(function () {
        var data = $(this).data(DATA_KEY);

        var _config = $.extend({}, Modal.Default, $(this).data(), typeof config === 'object' && config);

        if (!data) {
          data = new Modal(this, _config);
          $(this).data(DATA_KEY, data);
        }

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new Error("No method named \"" + config + "\"");
          }

          data[config](relatedTarget);
        } else if (_config.show) {
          data.show(relatedTarget);
        }
      });
    };

    createClass(Modal, null, [{
      key: "VERSION",
      get: function get() {
        return VERSION;
      }
    }, {
      key: "Default",
      get: function get() {
        return Default;
      }
    }]);
    return Modal;
  }();
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  $(document).on(Event.CLICK_DATA_API, Selector.DATA_TOGGLE, function (event) {
    var _this10 = this;

    var target;
    var selector = Util.getSelectorFromElement(this);

    if (selector) {
      target = $(selector)[0];
    }

    var config = $(target).data(DATA_KEY) ? 'toggle' : $.extend({}, $(target).data(), $(this).data());

    if (this.tagName === 'A' || this.tagName === 'AREA') {
      event.preventDefault();
    }

    var $target = $(target).one(Event.SHOW, function (showEvent) {
      if (showEvent.isDefaultPrevented()) {
        // only register focus restorer if modal will actually get shown
        return;
      }

      $target.one(Event.HIDDEN, function () {
        if ($(_this10).is(':visible')) {
          _this10.focus();
        }
      });
    });

    Modal._jQueryInterface.call($(target), config, this);
  });
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $.fn[NAME] = Modal._jQueryInterface;
  $.fn[NAME].Constructor = Modal;

  $.fn[NAME].noConflict = function () {
    $.fn[NAME] = JQUERY_NO_CONFLICT;
    return Modal._jQueryInterface;
  };

  return Modal;
}($);

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0-beta.2): tooltip.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

var Tooltip = function () {
  /**
   * Check for Popper dependency
   * Popper - https://popper.js.org
   */
  if (typeof Popper === 'undefined') {
    throw new Error('Bootstrap tooltips require Popper.js (https://popper.js.org)');
  }
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */


  var NAME = 'tooltip';
  var VERSION = '4.0.0-beta.2';
  var DATA_KEY = 'bs.tooltip';
  var EVENT_KEY = "." + DATA_KEY;
  var JQUERY_NO_CONFLICT = $.fn[NAME];
  var TRANSITION_DURATION = 150;
  var CLASS_PREFIX = 'bs-tooltip';
  var BSCLS_PREFIX_REGEX = new RegExp("(^|\\s)" + CLASS_PREFIX + "\\S+", 'g');
  var DefaultType = {
    animation: 'boolean',
    template: 'string',
    title: '(string|element|function)',
    trigger: 'string',
    delay: '(number|object)',
    html: 'boolean',
    selector: '(string|boolean)',
    placement: '(string|function)',
    offset: '(number|string)',
    container: '(string|element|boolean)',
    fallbackPlacement: '(string|array)'
  };
  var AttachmentMap = {
    AUTO: 'auto',
    TOP: 'top',
    RIGHT: 'right',
    BOTTOM: 'bottom',
    LEFT: 'left'
  };
  var Default = {
    animation: true,
    template: '<div class="tooltip" role="tooltip">' + '<div class="arrow"></div>' + '<div class="tooltip-inner"></div></div>',
    trigger: 'hover focus',
    title: '',
    delay: 0,
    html: false,
    selector: false,
    placement: 'top',
    offset: 0,
    container: false,
    fallbackPlacement: 'flip'
  };
  var HoverState = {
    SHOW: 'show',
    OUT: 'out'
  };
  var Event = {
    HIDE: "hide" + EVENT_KEY,
    HIDDEN: "hidden" + EVENT_KEY,
    SHOW: "show" + EVENT_KEY,
    SHOWN: "shown" + EVENT_KEY,
    INSERTED: "inserted" + EVENT_KEY,
    CLICK: "click" + EVENT_KEY,
    FOCUSIN: "focusin" + EVENT_KEY,
    FOCUSOUT: "focusout" + EVENT_KEY,
    MOUSEENTER: "mouseenter" + EVENT_KEY,
    MOUSELEAVE: "mouseleave" + EVENT_KEY
  };
  var ClassName = {
    FADE: 'fade',
    SHOW: 'show'
  };
  var Selector = {
    TOOLTIP: '.tooltip',
    TOOLTIP_INNER: '.tooltip-inner',
    ARROW: '.arrow'
  };
  var Trigger = {
    HOVER: 'hover',
    FOCUS: 'focus',
    CLICK: 'click',
    MANUAL: 'manual'
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

  };

  var Tooltip =
  /*#__PURE__*/
  function () {
    function Tooltip(element, config) {
      // private
      this._isEnabled = true;
      this._timeout = 0;
      this._hoverState = '';
      this._activeTrigger = {};
      this._popper = null; // protected

      this.element = element;
      this.config = this._getConfig(config);
      this.tip = null;

      this._setListeners();
    } // getters


    var _proto = Tooltip.prototype;

    // public
    _proto.enable = function enable() {
      this._isEnabled = true;
    };

    _proto.disable = function disable() {
      this._isEnabled = false;
    };

    _proto.toggleEnabled = function toggleEnabled() {
      this._isEnabled = !this._isEnabled;
    };

    _proto.toggle = function toggle(event) {
      if (!this._isEnabled) {
        return;
      }

      if (event) {
        var dataKey = this.constructor.DATA_KEY;
        var context = $(event.currentTarget).data(dataKey);

        if (!context) {
          context = new this.constructor(event.currentTarget, this._getDelegateConfig());
          $(event.currentTarget).data(dataKey, context);
        }

        context._activeTrigger.click = !context._activeTrigger.click;

        if (context._isWithActiveTrigger()) {
          context._enter(null, context);
        } else {
          context._leave(null, context);
        }
      } else {
        if ($(this.getTipElement()).hasClass(ClassName.SHOW)) {
          this._leave(null, this);

          return;
        }

        this._enter(null, this);
      }
    };

    _proto.dispose = function dispose() {
      clearTimeout(this._timeout);
      $.removeData(this.element, this.constructor.DATA_KEY);
      $(this.element).off(this.constructor.EVENT_KEY);
      $(this.element).closest('.modal').off('hide.bs.modal');

      if (this.tip) {
        $(this.tip).remove();
      }

      this._isEnabled = null;
      this._timeout = null;
      this._hoverState = null;
      this._activeTrigger = null;

      if (this._popper !== null) {
        this._popper.destroy();
      }

      this._popper = null;
      this.element = null;
      this.config = null;
      this.tip = null;
    };

    _proto.show = function show() {
      var _this = this;

      if ($(this.element).css('display') === 'none') {
        throw new Error('Please use show on visible elements');
      }

      var showEvent = $.Event(this.constructor.Event.SHOW);

      if (this.isWithContent() && this._isEnabled) {
        $(this.element).trigger(showEvent);
        var isInTheDom = $.contains(this.element.ownerDocument.documentElement, this.element);

        if (showEvent.isDefaultPrevented() || !isInTheDom) {
          return;
        }

        var tip = this.getTipElement();
        var tipId = Util.getUID(this.constructor.NAME);
        tip.setAttribute('id', tipId);
        this.element.setAttribute('aria-describedby', tipId);
        this.setContent();

        if (this.config.animation) {
          $(tip).addClass(ClassName.FADE);
        }

        var placement = typeof this.config.placement === 'function' ? this.config.placement.call(this, tip, this.element) : this.config.placement;

        var attachment = this._getAttachment(placement);

        this.addAttachmentClass(attachment);
        var container = this.config.container === false ? document.body : $(this.config.container);
        $(tip).data(this.constructor.DATA_KEY, this);

        if (!$.contains(this.element.ownerDocument.documentElement, this.tip)) {
          $(tip).appendTo(container);
        }

        $(this.element).trigger(this.constructor.Event.INSERTED);
        this._popper = new Popper(this.element, tip, {
          placement: attachment,
          modifiers: {
            offset: {
              offset: this.config.offset
            },
            flip: {
              behavior: this.config.fallbackPlacement
            },
            arrow: {
              element: Selector.ARROW
            }
          },
          onCreate: function onCreate(data) {
            if (data.originalPlacement !== data.placement) {
              _this._handlePopperPlacementChange(data);
            }
          },
          onUpdate: function onUpdate(data) {
            _this._handlePopperPlacementChange(data);
          }
        });
        $(tip).addClass(ClassName.SHOW); // if this is a touch-enabled device we add extra
        // empty mouseover listeners to the body's immediate children;
        // only needed because of broken event delegation on iOS
        // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html

        if ('ontouchstart' in document.documentElement) {
          $('body').children().on('mouseover', null, $.noop);
        }

        var complete = function complete() {
          if (_this.config.animation) {
            _this._fixTransition();
          }

          var prevHoverState = _this._hoverState;
          _this._hoverState = null;
          $(_this.element).trigger(_this.constructor.Event.SHOWN);

          if (prevHoverState === HoverState.OUT) {
            _this._leave(null, _this);
          }
        };

        if (Util.supportsTransitionEnd() && $(this.tip).hasClass(ClassName.FADE)) {
          $(this.tip).one(Util.TRANSITION_END, complete).emulateTransitionEnd(Tooltip._TRANSITION_DURATION);
        } else {
          complete();
        }
      }
    };

    _proto.hide = function hide(callback) {
      var _this2 = this;

      var tip = this.getTipElement();
      var hideEvent = $.Event(this.constructor.Event.HIDE);

      var complete = function complete() {
        if (_this2._hoverState !== HoverState.SHOW && tip.parentNode) {
          tip.parentNode.removeChild(tip);
        }

        _this2._cleanTipClass();

        _this2.element.removeAttribute('aria-describedby');

        $(_this2.element).trigger(_this2.constructor.Event.HIDDEN);

        if (_this2._popper !== null) {
          _this2._popper.destroy();
        }

        if (callback) {
          callback();
        }
      };

      $(this.element).trigger(hideEvent);

      if (hideEvent.isDefaultPrevented()) {
        return;
      }

      $(tip).removeClass(ClassName.SHOW); // if this is a touch-enabled device we remove the extra
      // empty mouseover listeners we added for iOS support

      if ('ontouchstart' in document.documentElement) {
        $('body').children().off('mouseover', null, $.noop);
      }

      this._activeTrigger[Trigger.CLICK] = false;
      this._activeTrigger[Trigger.FOCUS] = false;
      this._activeTrigger[Trigger.HOVER] = false;

      if (Util.supportsTransitionEnd() && $(this.tip).hasClass(ClassName.FADE)) {
        $(tip).one(Util.TRANSITION_END, complete).emulateTransitionEnd(TRANSITION_DURATION);
      } else {
        complete();
      }

      this._hoverState = '';
    };

    _proto.update = function update() {
      if (this._popper !== null) {
        this._popper.scheduleUpdate();
      }
    }; // protected


    _proto.isWithContent = function isWithContent() {
      return Boolean(this.getTitle());
    };

    _proto.addAttachmentClass = function addAttachmentClass(attachment) {
      $(this.getTipElement()).addClass(CLASS_PREFIX + "-" + attachment);
    };

    _proto.getTipElement = function getTipElement() {
      this.tip = this.tip || $(this.config.template)[0];
      return this.tip;
    };

    _proto.setContent = function setContent() {
      var $tip = $(this.getTipElement());
      this.setElementContent($tip.find(Selector.TOOLTIP_INNER), this.getTitle());
      $tip.removeClass(ClassName.FADE + " " + ClassName.SHOW);
    };

    _proto.setElementContent = function setElementContent($element, content) {
      var html = this.config.html;

      if (typeof content === 'object' && (content.nodeType || content.jquery)) {
        // content is a DOM node or a jQuery
        if (html) {
          if (!$(content).parent().is($element)) {
            $element.empty().append(content);
          }
        } else {
          $element.text($(content).text());
        }
      } else {
        $element[html ? 'html' : 'text'](content);
      }
    };

    _proto.getTitle = function getTitle() {
      var title = this.element.getAttribute('data-original-title');

      if (!title) {
        title = typeof this.config.title === 'function' ? this.config.title.call(this.element) : this.config.title;
      }

      return title;
    }; // private


    _proto._getAttachment = function _getAttachment(placement) {
      return AttachmentMap[placement.toUpperCase()];
    };

    _proto._setListeners = function _setListeners() {
      var _this3 = this;

      var triggers = this.config.trigger.split(' ');
      triggers.forEach(function (trigger) {
        if (trigger === 'click') {
          $(_this3.element).on(_this3.constructor.Event.CLICK, _this3.config.selector, function (event) {
            return _this3.toggle(event);
          });
        } else if (trigger !== Trigger.MANUAL) {
          var eventIn = trigger === Trigger.HOVER ? _this3.constructor.Event.MOUSEENTER : _this3.constructor.Event.FOCUSIN;
          var eventOut = trigger === Trigger.HOVER ? _this3.constructor.Event.MOUSELEAVE : _this3.constructor.Event.FOCUSOUT;
          $(_this3.element).on(eventIn, _this3.config.selector, function (event) {
            return _this3._enter(event);
          }).on(eventOut, _this3.config.selector, function (event) {
            return _this3._leave(event);
          });
        }

        $(_this3.element).closest('.modal').on('hide.bs.modal', function () {
          return _this3.hide();
        });
      });

      if (this.config.selector) {
        this.config = $.extend({}, this.config, {
          trigger: 'manual',
          selector: ''
        });
      } else {
        this._fixTitle();
      }
    };

    _proto._fixTitle = function _fixTitle() {
      var titleType = typeof this.element.getAttribute('data-original-title');

      if (this.element.getAttribute('title') || titleType !== 'string') {
        this.element.setAttribute('data-original-title', this.element.getAttribute('title') || '');
        this.element.setAttribute('title', '');
      }
    };

    _proto._enter = function _enter(event, context) {
      var dataKey = this.constructor.DATA_KEY;
      context = context || $(event.currentTarget).data(dataKey);

      if (!context) {
        context = new this.constructor(event.currentTarget, this._getDelegateConfig());
        $(event.currentTarget).data(dataKey, context);
      }

      if (event) {
        context._activeTrigger[event.type === 'focusin' ? Trigger.FOCUS : Trigger.HOVER] = true;
      }

      if ($(context.getTipElement()).hasClass(ClassName.SHOW) || context._hoverState === HoverState.SHOW) {
        context._hoverState = HoverState.SHOW;
        return;
      }

      clearTimeout(context._timeout);
      context._hoverState = HoverState.SHOW;

      if (!context.config.delay || !context.config.delay.show) {
        context.show();
        return;
      }

      context._timeout = setTimeout(function () {
        if (context._hoverState === HoverState.SHOW) {
          context.show();
        }
      }, context.config.delay.show);
    };

    _proto._leave = function _leave(event, context) {
      var dataKey = this.constructor.DATA_KEY;
      context = context || $(event.currentTarget).data(dataKey);

      if (!context) {
        context = new this.constructor(event.currentTarget, this._getDelegateConfig());
        $(event.currentTarget).data(dataKey, context);
      }

      if (event) {
        context._activeTrigger[event.type === 'focusout' ? Trigger.FOCUS : Trigger.HOVER] = false;
      }

      if (context._isWithActiveTrigger()) {
        return;
      }

      clearTimeout(context._timeout);
      context._hoverState = HoverState.OUT;

      if (!context.config.delay || !context.config.delay.hide) {
        context.hide();
        return;
      }

      context._timeout = setTimeout(function () {
        if (context._hoverState === HoverState.OUT) {
          context.hide();
        }
      }, context.config.delay.hide);
    };

    _proto._isWithActiveTrigger = function _isWithActiveTrigger() {
      for (var trigger in this._activeTrigger) {
        if (this._activeTrigger[trigger]) {
          return true;
        }
      }

      return false;
    };

    _proto._getConfig = function _getConfig(config) {
      config = $.extend({}, this.constructor.Default, $(this.element).data(), config);

      if (typeof config.delay === 'number') {
        config.delay = {
          show: config.delay,
          hide: config.delay
        };
      }

      if (typeof config.title === 'number') {
        config.title = config.title.toString();
      }

      if (typeof config.content === 'number') {
        config.content = config.content.toString();
      }

      Util.typeCheckConfig(NAME, config, this.constructor.DefaultType);
      return config;
    };

    _proto._getDelegateConfig = function _getDelegateConfig() {
      var config = {};

      if (this.config) {
        for (var key in this.config) {
          if (this.constructor.Default[key] !== this.config[key]) {
            config[key] = this.config[key];
          }
        }
      }

      return config;
    };

    _proto._cleanTipClass = function _cleanTipClass() {
      var $tip = $(this.getTipElement());
      var tabClass = $tip.attr('class').match(BSCLS_PREFIX_REGEX);

      if (tabClass !== null && tabClass.length > 0) {
        $tip.removeClass(tabClass.join(''));
      }
    };

    _proto._handlePopperPlacementChange = function _handlePopperPlacementChange(data) {
      this._cleanTipClass();

      this.addAttachmentClass(this._getAttachment(data.placement));
    };

    _proto._fixTransition = function _fixTransition() {
      var tip = this.getTipElement();
      var initConfigAnimation = this.config.animation;

      if (tip.getAttribute('x-placement') !== null) {
        return;
      }

      $(tip).removeClass(ClassName.FADE);
      this.config.animation = false;
      this.hide();
      this.show();
      this.config.animation = initConfigAnimation;
    }; // static


    Tooltip._jQueryInterface = function _jQueryInterface(config) {
      return this.each(function () {
        var data = $(this).data(DATA_KEY);

        var _config = typeof config === 'object' && config;

        if (!data && /dispose|hide/.test(config)) {
          return;
        }

        if (!data) {
          data = new Tooltip(this, _config);
          $(this).data(DATA_KEY, data);
        }

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new Error("No method named \"" + config + "\"");
          }

          data[config]();
        }
      });
    };

    createClass(Tooltip, null, [{
      key: "VERSION",
      get: function get() {
        return VERSION;
      }
    }, {
      key: "Default",
      get: function get() {
        return Default;
      }
    }, {
      key: "NAME",
      get: function get() {
        return NAME;
      }
    }, {
      key: "DATA_KEY",
      get: function get() {
        return DATA_KEY;
      }
    }, {
      key: "Event",
      get: function get() {
        return Event;
      }
    }, {
      key: "EVENT_KEY",
      get: function get() {
        return EVENT_KEY;
      }
    }, {
      key: "DefaultType",
      get: function get() {
        return DefaultType;
      }
    }]);
    return Tooltip;
  }();
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */


  $.fn[NAME] = Tooltip._jQueryInterface;
  $.fn[NAME].Constructor = Tooltip;

  $.fn[NAME].noConflict = function () {
    $.fn[NAME] = JQUERY_NO_CONFLICT;
    return Tooltip._jQueryInterface;
  };

  return Tooltip;
}($, Popper);

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0-beta.2): popover.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

var Popover = function () {
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */
  var NAME = 'popover';
  var VERSION = '4.0.0-beta.2';
  var DATA_KEY = 'bs.popover';
  var EVENT_KEY = "." + DATA_KEY;
  var JQUERY_NO_CONFLICT = $.fn[NAME];
  var CLASS_PREFIX = 'bs-popover';
  var BSCLS_PREFIX_REGEX = new RegExp("(^|\\s)" + CLASS_PREFIX + "\\S+", 'g');
  var Default = $.extend({}, Tooltip.Default, {
    placement: 'right',
    trigger: 'click',
    content: '',
    template: '<div class="popover" role="tooltip">' + '<div class="arrow"></div>' + '<h3 class="popover-header"></h3>' + '<div class="popover-body"></div></div>'
  });
  var DefaultType = $.extend({}, Tooltip.DefaultType, {
    content: '(string|element|function)'
  });
  var ClassName = {
    FADE: 'fade',
    SHOW: 'show'
  };
  var Selector = {
    TITLE: '.popover-header',
    CONTENT: '.popover-body'
  };
  var Event = {
    HIDE: "hide" + EVENT_KEY,
    HIDDEN: "hidden" + EVENT_KEY,
    SHOW: "show" + EVENT_KEY,
    SHOWN: "shown" + EVENT_KEY,
    INSERTED: "inserted" + EVENT_KEY,
    CLICK: "click" + EVENT_KEY,
    FOCUSIN: "focusin" + EVENT_KEY,
    FOCUSOUT: "focusout" + EVENT_KEY,
    MOUSEENTER: "mouseenter" + EVENT_KEY,
    MOUSELEAVE: "mouseleave" + EVENT_KEY
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

  };

  var Popover =
  /*#__PURE__*/
  function (_Tooltip) {
    inheritsLoose(Popover, _Tooltip);

    function Popover() {
      return _Tooltip.apply(this, arguments) || this;
    }

    var _proto = Popover.prototype;

    // overrides
    _proto.isWithContent = function isWithContent() {
      return this.getTitle() || this._getContent();
    };

    _proto.addAttachmentClass = function addAttachmentClass(attachment) {
      $(this.getTipElement()).addClass(CLASS_PREFIX + "-" + attachment);
    };

    _proto.getTipElement = function getTipElement() {
      this.tip = this.tip || $(this.config.template)[0];
      return this.tip;
    };

    _proto.setContent = function setContent() {
      var $tip = $(this.getTipElement()); // we use append for html objects to maintain js events

      this.setElementContent($tip.find(Selector.TITLE), this.getTitle());
      this.setElementContent($tip.find(Selector.CONTENT), this._getContent());
      $tip.removeClass(ClassName.FADE + " " + ClassName.SHOW);
    }; // private


    _proto._getContent = function _getContent() {
      return this.element.getAttribute('data-content') || (typeof this.config.content === 'function' ? this.config.content.call(this.element) : this.config.content);
    };

    _proto._cleanTipClass = function _cleanTipClass() {
      var $tip = $(this.getTipElement());
      var tabClass = $tip.attr('class').match(BSCLS_PREFIX_REGEX);

      if (tabClass !== null && tabClass.length > 0) {
        $tip.removeClass(tabClass.join(''));
      }
    }; // static


    Popover._jQueryInterface = function _jQueryInterface(config) {
      return this.each(function () {
        var data = $(this).data(DATA_KEY);

        var _config = typeof config === 'object' ? config : null;

        if (!data && /destroy|hide/.test(config)) {
          return;
        }

        if (!data) {
          data = new Popover(this, _config);
          $(this).data(DATA_KEY, data);
        }

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new Error("No method named \"" + config + "\"");
          }

          data[config]();
        }
      });
    };

    createClass(Popover, null, [{
      key: "VERSION",
      // getters
      get: function get() {
        return VERSION;
      }
    }, {
      key: "Default",
      get: function get() {
        return Default;
      }
    }, {
      key: "NAME",
      get: function get() {
        return NAME;
      }
    }, {
      key: "DATA_KEY",
      get: function get() {
        return DATA_KEY;
      }
    }, {
      key: "Event",
      get: function get() {
        return Event;
      }
    }, {
      key: "EVENT_KEY",
      get: function get() {
        return EVENT_KEY;
      }
    }, {
      key: "DefaultType",
      get: function get() {
        return DefaultType;
      }
    }]);
    return Popover;
  }(Tooltip);
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */


  $.fn[NAME] = Popover._jQueryInterface;
  $.fn[NAME].Constructor = Popover;

  $.fn[NAME].noConflict = function () {
    $.fn[NAME] = JQUERY_NO_CONFLICT;
    return Popover._jQueryInterface;
  };

  return Popover;
}($);

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0-beta.2): scrollspy.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

var ScrollSpy = function () {
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */
  var NAME = 'scrollspy';
  var VERSION = '4.0.0-beta.2';
  var DATA_KEY = 'bs.scrollspy';
  var EVENT_KEY = "." + DATA_KEY;
  var DATA_API_KEY = '.data-api';
  var JQUERY_NO_CONFLICT = $.fn[NAME];
  var Default = {
    offset: 10,
    method: 'auto',
    target: ''
  };
  var DefaultType = {
    offset: 'number',
    method: 'string',
    target: '(string|element)'
  };
  var Event = {
    ACTIVATE: "activate" + EVENT_KEY,
    SCROLL: "scroll" + EVENT_KEY,
    LOAD_DATA_API: "load" + EVENT_KEY + DATA_API_KEY
  };
  var ClassName = {
    DROPDOWN_ITEM: 'dropdown-item',
    DROPDOWN_MENU: 'dropdown-menu',
    ACTIVE: 'active'
  };
  var Selector = {
    DATA_SPY: '[data-spy="scroll"]',
    ACTIVE: '.active',
    NAV_LIST_GROUP: '.nav, .list-group',
    NAV_LINKS: '.nav-link',
    NAV_ITEMS: '.nav-item',
    LIST_ITEMS: '.list-group-item',
    DROPDOWN: '.dropdown',
    DROPDOWN_ITEMS: '.dropdown-item',
    DROPDOWN_TOGGLE: '.dropdown-toggle'
  };
  var OffsetMethod = {
    OFFSET: 'offset',
    POSITION: 'position'
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

  };

  var ScrollSpy =
  /*#__PURE__*/
  function () {
    function ScrollSpy(element, config) {
      var _this = this;

      this._element = element;
      this._scrollElement = element.tagName === 'BODY' ? window : element;
      this._config = this._getConfig(config);
      this._selector = this._config.target + " " + Selector.NAV_LINKS + "," + (this._config.target + " " + Selector.LIST_ITEMS + ",") + (this._config.target + " " + Selector.DROPDOWN_ITEMS);
      this._offsets = [];
      this._targets = [];
      this._activeTarget = null;
      this._scrollHeight = 0;
      $(this._scrollElement).on(Event.SCROLL, function (event) {
        return _this._process(event);
      });
      this.refresh();

      this._process();
    } // getters


    var _proto = ScrollSpy.prototype;

    // public
    _proto.refresh = function refresh() {
      var _this2 = this;

      var autoMethod = this._scrollElement !== this._scrollElement.window ? OffsetMethod.POSITION : OffsetMethod.OFFSET;
      var offsetMethod = this._config.method === 'auto' ? autoMethod : this._config.method;
      var offsetBase = offsetMethod === OffsetMethod.POSITION ? this._getScrollTop() : 0;
      this._offsets = [];
      this._targets = [];
      this._scrollHeight = this._getScrollHeight();
      var targets = $.makeArray($(this._selector));
      targets.map(function (element) {
        var target;
        var targetSelector = Util.getSelectorFromElement(element);

        if (targetSelector) {
          target = $(targetSelector)[0];
        }

        if (target) {
          var targetBCR = target.getBoundingClientRect();

          if (targetBCR.width || targetBCR.height) {
            // todo (fat): remove sketch reliance on jQuery position/offset
            return [$(target)[offsetMethod]().top + offsetBase, targetSelector];
          }
        }

        return null;
      }).filter(function (item) {
        return item;
      }).sort(function (a, b) {
        return a[0] - b[0];
      }).forEach(function (item) {
        _this2._offsets.push(item[0]);

        _this2._targets.push(item[1]);
      });
    };

    _proto.dispose = function dispose() {
      $.removeData(this._element, DATA_KEY);
      $(this._scrollElement).off(EVENT_KEY);
      this._element = null;
      this._scrollElement = null;
      this._config = null;
      this._selector = null;
      this._offsets = null;
      this._targets = null;
      this._activeTarget = null;
      this._scrollHeight = null;
    }; // private


    _proto._getConfig = function _getConfig(config) {
      config = $.extend({}, Default, config);

      if (typeof config.target !== 'string') {
        var id = $(config.target).attr('id');

        if (!id) {
          id = Util.getUID(NAME);
          $(config.target).attr('id', id);
        }

        config.target = "#" + id;
      }

      Util.typeCheckConfig(NAME, config, DefaultType);
      return config;
    };

    _proto._getScrollTop = function _getScrollTop() {
      return this._scrollElement === window ? this._scrollElement.pageYOffset : this._scrollElement.scrollTop;
    };

    _proto._getScrollHeight = function _getScrollHeight() {
      return this._scrollElement.scrollHeight || Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
    };

    _proto._getOffsetHeight = function _getOffsetHeight() {
      return this._scrollElement === window ? window.innerHeight : this._scrollElement.getBoundingClientRect().height;
    };

    _proto._process = function _process() {
      var scrollTop = this._getScrollTop() + this._config.offset;

      var scrollHeight = this._getScrollHeight();

      var maxScroll = this._config.offset + scrollHeight - this._getOffsetHeight();

      if (this._scrollHeight !== scrollHeight) {
        this.refresh();
      }

      if (scrollTop >= maxScroll) {
        var target = this._targets[this._targets.length - 1];

        if (this._activeTarget !== target) {
          this._activate(target);
        }

        return;
      }

      if (this._activeTarget && scrollTop < this._offsets[0] && this._offsets[0] > 0) {
        this._activeTarget = null;

        this._clear();

        return;
      }

      for (var i = this._offsets.length; i--;) {
        var isActiveTarget = this._activeTarget !== this._targets[i] && scrollTop >= this._offsets[i] && (typeof this._offsets[i + 1] === 'undefined' || scrollTop < this._offsets[i + 1]);

        if (isActiveTarget) {
          this._activate(this._targets[i]);
        }
      }
    };

    _proto._activate = function _activate(target) {
      this._activeTarget = target;

      this._clear();

      var queries = this._selector.split(','); // eslint-disable-next-line arrow-body-style


      queries = queries.map(function (selector) {
        return selector + "[data-target=\"" + target + "\"]," + (selector + "[href=\"" + target + "\"]");
      });
      var $link = $(queries.join(','));

      if ($link.hasClass(ClassName.DROPDOWN_ITEM)) {
        $link.closest(Selector.DROPDOWN).find(Selector.DROPDOWN_TOGGLE).addClass(ClassName.ACTIVE);
        $link.addClass(ClassName.ACTIVE);
      } else {
        // Set triggered link as active
        $link.addClass(ClassName.ACTIVE); // Set triggered links parents as active
        // With both <ul> and <nav> markup a parent is the previous sibling of any nav ancestor

        $link.parents(Selector.NAV_LIST_GROUP).prev(Selector.NAV_LINKS + ", " + Selector.LIST_ITEMS).addClass(ClassName.ACTIVE); // Handle special case when .nav-link is inside .nav-item

        $link.parents(Selector.NAV_LIST_GROUP).prev(Selector.NAV_ITEMS).children(Selector.NAV_LINKS).addClass(ClassName.ACTIVE);
      }

      $(this._scrollElement).trigger(Event.ACTIVATE, {
        relatedTarget: target
      });
    };

    _proto._clear = function _clear() {
      $(this._selector).filter(Selector.ACTIVE).removeClass(ClassName.ACTIVE);
    }; // static


    ScrollSpy._jQueryInterface = function _jQueryInterface(config) {
      return this.each(function () {
        var data = $(this).data(DATA_KEY);

        var _config = typeof config === 'object' && config;

        if (!data) {
          data = new ScrollSpy(this, _config);
          $(this).data(DATA_KEY, data);
        }

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new Error("No method named \"" + config + "\"");
          }

          data[config]();
        }
      });
    };

    createClass(ScrollSpy, null, [{
      key: "VERSION",
      get: function get() {
        return VERSION;
      }
    }, {
      key: "Default",
      get: function get() {
        return Default;
      }
    }]);
    return ScrollSpy;
  }();
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  $(window).on(Event.LOAD_DATA_API, function () {
    var scrollSpys = $.makeArray($(Selector.DATA_SPY));

    for (var i = scrollSpys.length; i--;) {
      var $spy = $(scrollSpys[i]);

      ScrollSpy._jQueryInterface.call($spy, $spy.data());
    }
  });
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $.fn[NAME] = ScrollSpy._jQueryInterface;
  $.fn[NAME].Constructor = ScrollSpy;

  $.fn[NAME].noConflict = function () {
    $.fn[NAME] = JQUERY_NO_CONFLICT;
    return ScrollSpy._jQueryInterface;
  };

  return ScrollSpy;
}($);

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0-beta.2): tab.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

var Tab = function () {
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */
  var NAME = 'tab';
  var VERSION = '4.0.0-beta.2';
  var DATA_KEY = 'bs.tab';
  var EVENT_KEY = "." + DATA_KEY;
  var DATA_API_KEY = '.data-api';
  var JQUERY_NO_CONFLICT = $.fn[NAME];
  var TRANSITION_DURATION = 150;
  var Event = {
    HIDE: "hide" + EVENT_KEY,
    HIDDEN: "hidden" + EVENT_KEY,
    SHOW: "show" + EVENT_KEY,
    SHOWN: "shown" + EVENT_KEY,
    CLICK_DATA_API: "click" + EVENT_KEY + DATA_API_KEY
  };
  var ClassName = {
    DROPDOWN_MENU: 'dropdown-menu',
    ACTIVE: 'active',
    DISABLED: 'disabled',
    FADE: 'fade',
    SHOW: 'show'
  };
  var Selector = {
    DROPDOWN: '.dropdown',
    NAV_LIST_GROUP: '.nav, .list-group',
    ACTIVE: '.active',
    ACTIVE_UL: '> li > .active',
    DATA_TOGGLE: '[data-toggle="tab"], [data-toggle="pill"], [data-toggle="list"]',
    DROPDOWN_TOGGLE: '.dropdown-toggle',
    DROPDOWN_ACTIVE_CHILD: '> .dropdown-menu .active'
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

  };

  var Tab =
  /*#__PURE__*/
  function () {
    function Tab(element) {
      this._element = element;
    } // getters


    var _proto = Tab.prototype;

    // public
    _proto.show = function show() {
      var _this = this;

      if (this._element.parentNode && this._element.parentNode.nodeType === Node.ELEMENT_NODE && $(this._element).hasClass(ClassName.ACTIVE) || $(this._element).hasClass(ClassName.DISABLED)) {
        return;
      }

      var target;
      var previous;
      var listElement = $(this._element).closest(Selector.NAV_LIST_GROUP)[0];
      var selector = Util.getSelectorFromElement(this._element);

      if (listElement) {
        var itemSelector = listElement.nodeName === 'UL' ? Selector.ACTIVE_UL : Selector.ACTIVE;
        previous = $.makeArray($(listElement).find(itemSelector));
        previous = previous[previous.length - 1];
      }

      var hideEvent = $.Event(Event.HIDE, {
        relatedTarget: this._element
      });
      var showEvent = $.Event(Event.SHOW, {
        relatedTarget: previous
      });

      if (previous) {
        $(previous).trigger(hideEvent);
      }

      $(this._element).trigger(showEvent);

      if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) {
        return;
      }

      if (selector) {
        target = $(selector)[0];
      }

      this._activate(this._element, listElement);

      var complete = function complete() {
        var hiddenEvent = $.Event(Event.HIDDEN, {
          relatedTarget: _this._element
        });
        var shownEvent = $.Event(Event.SHOWN, {
          relatedTarget: previous
        });
        $(previous).trigger(hiddenEvent);
        $(_this._element).trigger(shownEvent);
      };

      if (target) {
        this._activate(target, target.parentNode, complete);
      } else {
        complete();
      }
    };

    _proto.dispose = function dispose() {
      $.removeData(this._element, DATA_KEY);
      this._element = null;
    }; // private


    _proto._activate = function _activate(element, container, callback) {
      var _this2 = this;

      var activeElements;

      if (container.nodeName === 'UL') {
        activeElements = $(container).find(Selector.ACTIVE_UL);
      } else {
        activeElements = $(container).children(Selector.ACTIVE);
      }

      var active = activeElements[0];
      var isTransitioning = callback && Util.supportsTransitionEnd() && active && $(active).hasClass(ClassName.FADE);

      var complete = function complete() {
        return _this2._transitionComplete(element, active, isTransitioning, callback);
      };

      if (active && isTransitioning) {
        $(active).one(Util.TRANSITION_END, complete).emulateTransitionEnd(TRANSITION_DURATION);
      } else {
        complete();
      }

      if (active) {
        $(active).removeClass(ClassName.SHOW);
      }
    };

    _proto._transitionComplete = function _transitionComplete(element, active, isTransitioning, callback) {
      if (active) {
        $(active).removeClass(ClassName.ACTIVE);
        var dropdownChild = $(active.parentNode).find(Selector.DROPDOWN_ACTIVE_CHILD)[0];

        if (dropdownChild) {
          $(dropdownChild).removeClass(ClassName.ACTIVE);
        }

        if (active.getAttribute('role') === 'tab') {
          active.setAttribute('aria-selected', false);
        }
      }

      $(element).addClass(ClassName.ACTIVE);

      if (element.getAttribute('role') === 'tab') {
        element.setAttribute('aria-selected', true);
      }

      if (isTransitioning) {
        Util.reflow(element);
        $(element).addClass(ClassName.SHOW);
      } else {
        $(element).removeClass(ClassName.FADE);
      }

      if (element.parentNode && $(element.parentNode).hasClass(ClassName.DROPDOWN_MENU)) {
        var dropdownElement = $(element).closest(Selector.DROPDOWN)[0];

        if (dropdownElement) {
          $(dropdownElement).find(Selector.DROPDOWN_TOGGLE).addClass(ClassName.ACTIVE);
        }

        element.setAttribute('aria-expanded', true);
      }

      if (callback) {
        callback();
      }
    }; // static


    Tab._jQueryInterface = function _jQueryInterface(config) {
      return this.each(function () {
        var $this = $(this);
        var data = $this.data(DATA_KEY);

        if (!data) {
          data = new Tab(this);
          $this.data(DATA_KEY, data);
        }

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new Error("No method named \"" + config + "\"");
          }

          data[config]();
        }
      });
    };

    createClass(Tab, null, [{
      key: "VERSION",
      get: function get() {
        return VERSION;
      }
    }]);
    return Tab;
  }();
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  $(document).on(Event.CLICK_DATA_API, Selector.DATA_TOGGLE, function (event) {
    event.preventDefault();

    Tab._jQueryInterface.call($(this), 'show');
  });
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $.fn[NAME] = Tab._jQueryInterface;
  $.fn[NAME].Constructor = Tab;

  $.fn[NAME].noConflict = function () {
    $.fn[NAME] = JQUERY_NO_CONFLICT;
    return Tab._jQueryInterface;
  };

  return Tab;
}($);

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0-alpha.6): index.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

(function () {
  if (typeof $ === 'undefined') {
    throw new Error('Bootstrap\'s JavaScript requires jQuery. jQuery must be included before Bootstrap\'s JavaScript.');
  }

  var version = $.fn.jquery.split(' ')[0].split('.');
  var minMajor = 1;
  var ltMajor = 2;
  var minMinor = 9;
  var minPatch = 1;
  var maxMajor = 4;

  if (version[0] < ltMajor && version[1] < minMinor || version[0] === minMajor && version[1] === minMinor && version[2] < minPatch || version[0] >= maxMajor) {
    throw new Error('Bootstrap\'s JavaScript requires at least jQuery v1.9.1 but less than v4.0.0');
  }
})($);

exports.Util = Util;
exports.Alert = Alert;
exports.Button = Button;
exports.Carousel = Carousel;
exports.Collapse = Collapse;
exports.Dropdown = Dropdown;
exports.Modal = Modal;
exports.Popover = Popover;
exports.Scrollspy = ScrollSpy;
exports.Tab = Tab;
exports.Tooltip = Tooltip;

return exports;

}({},$,Popper));
//# sourceMappingURL=bootstrap.js.map
;
/*!
 * Datepicker for Bootstrap v1.7.1 (https://github.com/uxsolutions/bootstrap-datepicker)
 *
 * Licensed under the Apache License v2.0 (http://www.apache.org/licenses/LICENSE-2.0)
 */


(function(factory){
    if (typeof define === "function" && define.amd) {
        define(["jquery"], factory);
    } else if (typeof exports === 'object') {
        factory(require('jquery'));
    } else {
        factory(jQuery);
    }
}(function($, undefined){
	function UTCDate(){
		return new Date(Date.UTC.apply(Date, arguments));
	}
	function UTCToday(){
		var today = new Date();
		return UTCDate(today.getFullYear(), today.getMonth(), today.getDate());
	}
	function isUTCEquals(date1, date2) {
		return (
			date1.getUTCFullYear() === date2.getUTCFullYear() &&
			date1.getUTCMonth() === date2.getUTCMonth() &&
			date1.getUTCDate() === date2.getUTCDate()
		);
	}
	function alias(method, deprecationMsg){
		return function(){
			if (deprecationMsg !== undefined) {
				$.fn.datepicker.deprecated(deprecationMsg);
			}

			return this[method].apply(this, arguments);
		};
	}
	function isValidDate(d) {
		return d && !isNaN(d.getTime());
	}

	var DateArray = (function(){
		var extras = {
			get: function(i){
				return this.slice(i)[0];
			},
			contains: function(d){
				// Array.indexOf is not cross-browser;
				// $.inArray doesn't work with Dates
				var val = d && d.valueOf();
				for (var i=0, l=this.length; i < l; i++)
          // Use date arithmetic to allow dates with different times to match
          if (0 <= this[i].valueOf() - val && this[i].valueOf() - val < 1000*60*60*24)
						return i;
				return -1;
			},
			remove: function(i){
				this.splice(i,1);
			},
			replace: function(new_array){
				if (!new_array)
					return;
				if (!$.isArray(new_array))
					new_array = [new_array];
				this.clear();
				this.push.apply(this, new_array);
			},
			clear: function(){
				this.length = 0;
			},
			copy: function(){
				var a = new DateArray();
				a.replace(this);
				return a;
			}
		};

		return function(){
			var a = [];
			a.push.apply(a, arguments);
			$.extend(a, extras);
			return a;
		};
	})();


	// Picker object

	var Datepicker = function(element, options){
		$.data(element, 'datepicker', this);
		this._process_options(options);

		this.dates = new DateArray();
		this.viewDate = this.o.defaultViewDate;
		this.focusDate = null;

		this.element = $(element);
		this.isInput = this.element.is('input');
		this.inputField = this.isInput ? this.element : this.element.find('input');
		this.component = this.element.hasClass('date') ? this.element.find('.add-on, .input-group-addon, .btn') : false;
		if (this.component && this.component.length === 0)
			this.component = false;
		this.isInline = !this.component && this.element.is('div');

		this.picker = $(DPGlobal.template);

		// Checking templates and inserting
		if (this._check_template(this.o.templates.leftArrow)) {
			this.picker.find('.prev').html(this.o.templates.leftArrow);
		}

		if (this._check_template(this.o.templates.rightArrow)) {
			this.picker.find('.next').html(this.o.templates.rightArrow);
		}

		this._buildEvents();
		this._attachEvents();

		if (this.isInline){
			this.picker.addClass('datepicker-inline').appendTo(this.element);
		}
		else {
			this.picker.addClass('datepicker-dropdown dropdown-menu');
		}

		if (this.o.rtl){
			this.picker.addClass('datepicker-rtl');
		}

		if (this.o.calendarWeeks) {
			this.picker.find('.datepicker-days .datepicker-switch, thead .datepicker-title, tfoot .today, tfoot .clear')
				.attr('colspan', function(i, val){
					return Number(val) + 1;
				});
		}

		this._process_options({
			startDate: this._o.startDate,
			endDate: this._o.endDate,
			daysOfWeekDisabled: this.o.daysOfWeekDisabled,
			daysOfWeekHighlighted: this.o.daysOfWeekHighlighted,
			datesDisabled: this.o.datesDisabled
		});

		this._allow_update = false;
		this.setViewMode(this.o.startView);
		this._allow_update = true;

		this.fillDow();
		this.fillMonths();

		this.update();

		if (this.isInline){
			this.show();
		}
	};

	Datepicker.prototype = {
		constructor: Datepicker,

		_resolveViewName: function(view){
			$.each(DPGlobal.viewModes, function(i, viewMode){
				if (view === i || $.inArray(view, viewMode.names) !== -1){
					view = i;
					return false;
				}
			});

			return view;
		},

		_resolveDaysOfWeek: function(daysOfWeek){
			if (!$.isArray(daysOfWeek))
				daysOfWeek = daysOfWeek.split(/[,\s]*/);
			return $.map(daysOfWeek, Number);
		},

		_check_template: function(tmp){
			try {
				// If empty
				if (tmp === undefined || tmp === "") {
					return false;
				}
				// If no html, everything ok
				if ((tmp.match(/[<>]/g) || []).length <= 0) {
					return true;
				}
				// Checking if html is fine
				var jDom = $(tmp);
				return jDom.length > 0;
			}
			catch (ex) {
				return false;
			}
		},

		_process_options: function(opts){
			// Store raw options for reference
			this._o = $.extend({}, this._o, opts);
			// Processed options
			var o = this.o = $.extend({}, this._o);

			// Check if "de-DE" style date is available, if not language should
			// fallback to 2 letter code eg "de"
			var lang = o.language;
			if (!dates[lang]){
				lang = lang.split('-')[0];
				if (!dates[lang])
					lang = defaults.language;
			}
			o.language = lang;

			// Retrieve view index from any aliases
			o.startView = this._resolveViewName(o.startView);
			o.minViewMode = this._resolveViewName(o.minViewMode);
			o.maxViewMode = this._resolveViewName(o.maxViewMode);

			// Check view is between min and max
			o.startView = Math.max(this.o.minViewMode, Math.min(this.o.maxViewMode, o.startView));

			// true, false, or Number > 0
			if (o.multidate !== true){
				o.multidate = Number(o.multidate) || false;
				if (o.multidate !== false)
					o.multidate = Math.max(0, o.multidate);
			}
			o.multidateSeparator = String(o.multidateSeparator);

			o.weekStart %= 7;
			o.weekEnd = (o.weekStart + 6) % 7;

			var format = DPGlobal.parseFormat(o.format);
			if (o.startDate !== -Infinity){
				if (!!o.startDate){
					if (o.startDate instanceof Date)
						o.startDate = this._local_to_utc(this._zero_time(o.startDate));
					else
						o.startDate = DPGlobal.parseDate(o.startDate, format, o.language, o.assumeNearbyYear);
				}
				else {
					o.startDate = -Infinity;
				}
			}
			if (o.endDate !== Infinity){
				if (!!o.endDate){
					if (o.endDate instanceof Date)
						o.endDate = this._local_to_utc(this._zero_time(o.endDate));
					else
						o.endDate = DPGlobal.parseDate(o.endDate, format, o.language, o.assumeNearbyYear);
				}
				else {
					o.endDate = Infinity;
				}
			}

			o.daysOfWeekDisabled = this._resolveDaysOfWeek(o.daysOfWeekDisabled||[]);
			o.daysOfWeekHighlighted = this._resolveDaysOfWeek(o.daysOfWeekHighlighted||[]);

			o.datesDisabled = o.datesDisabled||[];
			if (!$.isArray(o.datesDisabled)) {
				o.datesDisabled = o.datesDisabled.split(',');
			}
			o.datesDisabled = $.map(o.datesDisabled, function(d){
				return DPGlobal.parseDate(d, format, o.language, o.assumeNearbyYear);
			});

			var plc = String(o.orientation).toLowerCase().split(/\s+/g),
				_plc = o.orientation.toLowerCase();
			plc = $.grep(plc, function(word){
				return /^auto|left|right|top|bottom$/.test(word);
			});
			o.orientation = {x: 'auto', y: 'auto'};
			if (!_plc || _plc === 'auto')
				; // no action
			else if (plc.length === 1){
				switch (plc[0]){
					case 'top':
					case 'bottom':
						o.orientation.y = plc[0];
						break;
					case 'left':
					case 'right':
						o.orientation.x = plc[0];
						break;
				}
			}
			else {
				_plc = $.grep(plc, function(word){
					return /^left|right$/.test(word);
				});
				o.orientation.x = _plc[0] || 'auto';

				_plc = $.grep(plc, function(word){
					return /^top|bottom$/.test(word);
				});
				o.orientation.y = _plc[0] || 'auto';
			}
			if (o.defaultViewDate instanceof Date || typeof o.defaultViewDate === 'string') {
				o.defaultViewDate = DPGlobal.parseDate(o.defaultViewDate, format, o.language, o.assumeNearbyYear);
			} else if (o.defaultViewDate) {
				var year = o.defaultViewDate.year || new Date().getFullYear();
				var month = o.defaultViewDate.month || 0;
				var day = o.defaultViewDate.day || 1;
				o.defaultViewDate = UTCDate(year, month, day);
			} else {
				o.defaultViewDate = UTCToday();
			}
		},
		_events: [],
		_secondaryEvents: [],
		_applyEvents: function(evs){
			for (var i=0, el, ch, ev; i < evs.length; i++){
				el = evs[i][0];
				if (evs[i].length === 2){
					ch = undefined;
					ev = evs[i][1];
				} else if (evs[i].length === 3){
					ch = evs[i][1];
					ev = evs[i][2];
				}
				el.on(ev, ch);
			}
		},
		_unapplyEvents: function(evs){
			for (var i=0, el, ev, ch; i < evs.length; i++){
				el = evs[i][0];
				if (evs[i].length === 2){
					ch = undefined;
					ev = evs[i][1];
				} else if (evs[i].length === 3){
					ch = evs[i][1];
					ev = evs[i][2];
				}
				el.off(ev, ch);
			}
		},
		_buildEvents: function(){
            var events = {
                keyup: $.proxy(function(e){
                    if ($.inArray(e.keyCode, [27, 37, 39, 38, 40, 32, 13, 9]) === -1)
                        this.update();
                }, this),
                keydown: $.proxy(this.keydown, this),
                paste: $.proxy(this.paste, this)
            };

            if (this.o.showOnFocus === true) {
                events.focus = $.proxy(this.show, this);
            }

            if (this.isInput) { // single input
                this._events = [
                    [this.element, events]
                ];
            }
            // component: input + button
            else if (this.component && this.inputField.length) {
                this._events = [
                    // For components that are not readonly, allow keyboard nav
                    [this.inputField, events],
                    [this.component, {
                        click: $.proxy(this.show, this)
                    }]
                ];
            }
			else {
				this._events = [
					[this.element, {
						click: $.proxy(this.show, this),
						keydown: $.proxy(this.keydown, this)
					}]
				];
			}
			this._events.push(
				// Component: listen for blur on element descendants
				[this.element, '*', {
					blur: $.proxy(function(e){
						this._focused_from = e.target;
					}, this)
				}],
				// Input: listen for blur on element
				[this.element, {
					blur: $.proxy(function(e){
						this._focused_from = e.target;
					}, this)
				}]
			);

			if (this.o.immediateUpdates) {
				// Trigger input updates immediately on changed year/month
				this._events.push([this.element, {
					'changeYear changeMonth': $.proxy(function(e){
						this.update(e.date);
					}, this)
				}]);
			}

			this._secondaryEvents = [
				[this.picker, {
					click: $.proxy(this.click, this)
				}],
				[this.picker, '.prev, .next', {
					click: $.proxy(this.navArrowsClick, this)
				}],
				[this.picker, '.day:not(.disabled)', {
					click: $.proxy(this.dayCellClick, this)
				}],
				[$(window), {
					resize: $.proxy(this.place, this)
				}],
				[$(document), {
					'mousedown touchstart': $.proxy(function(e){
						// Clicked outside the datepicker, hide it
						if (!(
							this.element.is(e.target) ||
							this.element.find(e.target).length ||
							this.picker.is(e.target) ||
							this.picker.find(e.target).length ||
							this.isInline
						)){
							this.hide();
						}
					}, this)
				}]
			];
		},
		_attachEvents: function(){
			this._detachEvents();
			this._applyEvents(this._events);
		},
		_detachEvents: function(){
			this._unapplyEvents(this._events);
		},
		_attachSecondaryEvents: function(){
			this._detachSecondaryEvents();
			this._applyEvents(this._secondaryEvents);
		},
		_detachSecondaryEvents: function(){
			this._unapplyEvents(this._secondaryEvents);
		},
		_trigger: function(event, altdate){
			var date = altdate || this.dates.get(-1),
				local_date = this._utc_to_local(date);

			this.element.trigger({
				type: event,
				date: local_date,
				viewMode: this.viewMode,
				dates: $.map(this.dates, this._utc_to_local),
				format: $.proxy(function(ix, format){
					if (arguments.length === 0){
						ix = this.dates.length - 1;
						format = this.o.format;
					} else if (typeof ix === 'string'){
						format = ix;
						ix = this.dates.length - 1;
					}
					format = format || this.o.format;
					var date = this.dates.get(ix);
					return DPGlobal.formatDate(date, format, this.o.language);
				}, this)
			});
		},

		show: function(){
			if (this.inputField.prop('disabled') || (this.inputField.prop('readonly') && this.o.enableOnReadonly === false))
				return;
			if (!this.isInline)
				this.picker.appendTo(this.o.container);
			this.place();
			this.picker.show();
			this._attachSecondaryEvents();
			this._trigger('show');
			if ((window.navigator.msMaxTouchPoints || 'ontouchstart' in document) && this.o.disableTouchKeyboard) {
				$(this.element).blur();
			}
			return this;
		},

		hide: function(){
			if (this.isInline || !this.picker.is(':visible'))
				return this;
			this.focusDate = null;
			this.picker.hide().detach();
			this._detachSecondaryEvents();
			this.setViewMode(this.o.startView);

			if (this.o.forceParse && this.inputField.val())
				this.setValue();
			this._trigger('hide');
			return this;
		},

		destroy: function(){
			this.hide();
			this._detachEvents();
			this._detachSecondaryEvents();
			this.picker.remove();
			delete this.element.data().datepicker;
			if (!this.isInput){
				delete this.element.data().date;
			}
			return this;
		},

		paste: function(e){
			var dateString;
			if (e.originalEvent.clipboardData && e.originalEvent.clipboardData.types
				&& $.inArray('text/plain', e.originalEvent.clipboardData.types) !== -1) {
				dateString = e.originalEvent.clipboardData.getData('text/plain');
			} else if (window.clipboardData) {
				dateString = window.clipboardData.getData('Text');
			} else {
				return;
			}
			this.setDate(dateString);
			this.update();
			e.preventDefault();
		},

		_utc_to_local: function(utc){
			if (!utc) {
				return utc;
			}

			var local = new Date(utc.getTime() + (utc.getTimezoneOffset() * 60000));

			if (local.getTimezoneOffset() !== utc.getTimezoneOffset()) {
				local = new Date(utc.getTime() + (local.getTimezoneOffset() * 60000));
			}

			return local;
		},
		_local_to_utc: function(local){
			return local && new Date(local.getTime() - (local.getTimezoneOffset()*60000));
		},
		_zero_time: function(local){
			return local && new Date(local.getFullYear(), local.getMonth(), local.getDate());
		},
		_zero_utc_time: function(utc){
			return utc && UTCDate(utc.getUTCFullYear(), utc.getUTCMonth(), utc.getUTCDate());
		},

		getDates: function(){
			return $.map(this.dates, this._utc_to_local);
		},

		getUTCDates: function(){
			return $.map(this.dates, function(d){
				return new Date(d);
			});
		},

		getDate: function(){
			return this._utc_to_local(this.getUTCDate());
		},

		getUTCDate: function(){
			var selected_date = this.dates.get(-1);
			if (selected_date !== undefined) {
				return new Date(selected_date);
			} else {
				return null;
			}
		},

		clearDates: function(){
			this.inputField.val('');
			this.update();
			this._trigger('changeDate');

			if (this.o.autoclose) {
				this.hide();
			}
		},

		setDates: function(){
			var args = $.isArray(arguments[0]) ? arguments[0] : arguments;
			this.update.apply(this, args);
			this._trigger('changeDate');
			this.setValue();
			return this;
		},

		setUTCDates: function(){
			var args = $.isArray(arguments[0]) ? arguments[0] : arguments;
			this.setDates.apply(this, $.map(args, this._utc_to_local));
			return this;
		},

		setDate: alias('setDates'),
		setUTCDate: alias('setUTCDates'),
		remove: alias('destroy', 'Method `remove` is deprecated and will be removed in version 2.0. Use `destroy` instead'),

		setValue: function(){
			var formatted = this.getFormattedDate();
			this.inputField.val(formatted);
			return this;
		},

		getFormattedDate: function(format){
			if (format === undefined)
				format = this.o.format;

			var lang = this.o.language;
			return $.map(this.dates, function(d){
				return DPGlobal.formatDate(d, format, lang);
			}).join(this.o.multidateSeparator);
		},

		getStartDate: function(){
			return this.o.startDate;
		},

		setStartDate: function(startDate){
			this._process_options({startDate: startDate});
			this.update();
			this.updateNavArrows();
			return this;
		},

		getEndDate: function(){
			return this.o.endDate;
		},

		setEndDate: function(endDate){
			this._process_options({endDate: endDate});
			this.update();
			this.updateNavArrows();
			return this;
		},

		setDaysOfWeekDisabled: function(daysOfWeekDisabled){
			this._process_options({daysOfWeekDisabled: daysOfWeekDisabled});
			this.update();
			return this;
		},

		setDaysOfWeekHighlighted: function(daysOfWeekHighlighted){
			this._process_options({daysOfWeekHighlighted: daysOfWeekHighlighted});
			this.update();
			return this;
		},

		setDatesDisabled: function(datesDisabled){
			this._process_options({datesDisabled: datesDisabled});
			this.update();
			return this;
		},

		place: function(){
			if (this.isInline)
				return this;
			var calendarWidth = this.picker.outerWidth(),
				calendarHeight = this.picker.outerHeight(),
				visualPadding = 10,
				container = $(this.o.container),
				windowWidth = container.width(),
				scrollTop = this.o.container === 'body' ? $(document).scrollTop() : container.scrollTop(),
				appendOffset = container.offset();

			var parentsZindex = [0];
			this.element.parents().each(function(){
				var itemZIndex = $(this).css('z-index');
				if (itemZIndex !== 'auto' && Number(itemZIndex) !== 0) parentsZindex.push(Number(itemZIndex));
			});
			var zIndex = Math.max.apply(Math, parentsZindex) + this.o.zIndexOffset;
			var offset = this.component ? this.component.parent().offset() : this.element.offset();
			var height = this.component ? this.component.outerHeight(true) : this.element.outerHeight(false);
			var width = this.component ? this.component.outerWidth(true) : this.element.outerWidth(false);
			var left = offset.left - appendOffset.left;
			var top = offset.top - appendOffset.top;

			if (this.o.container !== 'body') {
				top += scrollTop;
			}

			this.picker.removeClass(
				'datepicker-orient-top datepicker-orient-bottom '+
				'datepicker-orient-right datepicker-orient-left'
			);

			if (this.o.orientation.x !== 'auto'){
				this.picker.addClass('datepicker-orient-' + this.o.orientation.x);
				if (this.o.orientation.x === 'right')
					left -= calendarWidth - width;
			}
			// auto x orientation is best-placement: if it crosses a window
			// edge, fudge it sideways
			else {
				if (offset.left < 0) {
					// component is outside the window on the left side. Move it into visible range
					this.picker.addClass('datepicker-orient-left');
					left -= offset.left - visualPadding;
				} else if (left + calendarWidth > windowWidth) {
					// the calendar passes the widow right edge. Align it to component right side
					this.picker.addClass('datepicker-orient-right');
					left += width - calendarWidth;
				} else {
					if (this.o.rtl) {
						// Default to right
						this.picker.addClass('datepicker-orient-right');
					} else {
						// Default to left
						this.picker.addClass('datepicker-orient-left');
					}
				}
			}

			// auto y orientation is best-situation: top or bottom, no fudging,
			// decision based on which shows more of the calendar
			var yorient = this.o.orientation.y,
				top_overflow;
			if (yorient === 'auto'){
				top_overflow = -scrollTop + top - calendarHeight;
				yorient = top_overflow < 0 ? 'bottom' : 'top';
			}

			this.picker.addClass('datepicker-orient-' + yorient);
			if (yorient === 'top')
				top -= calendarHeight + parseInt(this.picker.css('padding-top'));
			else
				top += height;

			if (this.o.rtl) {
				var right = windowWidth - (left + width);
				this.picker.css({
					top: top,
					right: right,
					zIndex: zIndex
				});
			} else {
				this.picker.css({
					top: top,
					left: left,
					zIndex: zIndex
				});
			}
			return this;
		},

		_allow_update: true,
		update: function(){
			if (!this._allow_update)
				return this;

			var oldDates = this.dates.copy(),
				dates = [],
				fromArgs = false;
			if (arguments.length){
				$.each(arguments, $.proxy(function(i, date){
					if (date instanceof Date)
						date = this._local_to_utc(date);
					dates.push(date);
				}, this));
				fromArgs = true;
			} else {
				dates = this.isInput
						? this.element.val()
						: this.element.data('date') || this.inputField.val();
				if (dates && this.o.multidate)
					dates = dates.split(this.o.multidateSeparator);
				else
					dates = [dates];
				delete this.element.data().date;
			}

			dates = $.map(dates, $.proxy(function(date){
				return DPGlobal.parseDate(date, this.o.format, this.o.language, this.o.assumeNearbyYear);
			}, this));
			dates = $.grep(dates, $.proxy(function(date){
				return (
					!this.dateWithinRange(date) ||
					!date
				);
			}, this), true);
			this.dates.replace(dates);

			if (this.o.updateViewDate) {
				if (this.dates.length)
					this.viewDate = new Date(this.dates.get(-1));
				else if (this.viewDate < this.o.startDate)
					this.viewDate = new Date(this.o.startDate);
				else if (this.viewDate > this.o.endDate)
					this.viewDate = new Date(this.o.endDate);
				else
					this.viewDate = this.o.defaultViewDate;
			}

			if (fromArgs){
				// setting date by clicking
				this.setValue();
				this.element.change();
			}
			else if (this.dates.length){
				// setting date by typing
				if (String(oldDates) !== String(this.dates) && fromArgs) {
					this._trigger('changeDate');
					this.element.change();
				}
			}
			if (!this.dates.length && oldDates.length) {
				this._trigger('clearDate');
				this.element.change();
			}

			this.fill();
			return this;
		},

		fillDow: function(){
      if (this.o.showWeekDays) {
			var dowCnt = this.o.weekStart,
				html = '<tr>';
			if (this.o.calendarWeeks){
				html += '<th class="cw">&#160;</th>';
			}
			while (dowCnt < this.o.weekStart + 7){
				html += '<th class="dow';
        if ($.inArray(dowCnt, this.o.daysOfWeekDisabled) !== -1)
          html += ' disabled';
        html += '">'+dates[this.o.language].daysMin[(dowCnt++)%7]+'</th>';
			}
			html += '</tr>';
			this.picker.find('.datepicker-days thead').append(html);
      }
		},

		fillMonths: function(){
      var localDate = this._utc_to_local(this.viewDate);
			var html = '';
			var focused;
			for (var i = 0; i < 12; i++){
				focused = localDate && localDate.getMonth() === i ? ' focused' : '';
				html += '<span class="month' + focused + '">' + dates[this.o.language].monthsShort[i] + '</span>';
			}
			this.picker.find('.datepicker-months td').html(html);
		},

		setRange: function(range){
			if (!range || !range.length)
				delete this.range;
			else
				this.range = $.map(range, function(d){
					return d.valueOf();
				});
			this.fill();
		},

		getClassNames: function(date){
			var cls = [],
				year = this.viewDate.getUTCFullYear(),
				month = this.viewDate.getUTCMonth(),
				today = UTCToday();
			if (date.getUTCFullYear() < year || (date.getUTCFullYear() === year && date.getUTCMonth() < month)){
				cls.push('old');
			} else if (date.getUTCFullYear() > year || (date.getUTCFullYear() === year && date.getUTCMonth() > month)){
				cls.push('new');
			}
			if (this.focusDate && date.valueOf() === this.focusDate.valueOf())
				cls.push('focused');
			// Compare internal UTC date with UTC today, not local today
			if (this.o.todayHighlight && isUTCEquals(date, today)) {
				cls.push('today');
			}
			if (this.dates.contains(date) !== -1)
				cls.push('active');
			if (!this.dateWithinRange(date)){
				cls.push('disabled');
			}
			if (this.dateIsDisabled(date)){
				cls.push('disabled', 'disabled-date');
			}
			if ($.inArray(date.getUTCDay(), this.o.daysOfWeekHighlighted) !== -1){
				cls.push('highlighted');
			}

			if (this.range){
				if (date > this.range[0] && date < this.range[this.range.length-1]){
					cls.push('range');
				}
				if ($.inArray(date.valueOf(), this.range) !== -1){
					cls.push('selected');
				}
				if (date.valueOf() === this.range[0]){
          cls.push('range-start');
        }
        if (date.valueOf() === this.range[this.range.length-1]){
          cls.push('range-end');
        }
			}
			return cls;
		},

		_fill_yearsView: function(selector, cssClass, factor, year, startYear, endYear, beforeFn){
			var html = '';
			var step = factor / 10;
			var view = this.picker.find(selector);
			var startVal = Math.floor(year / factor) * factor;
			var endVal = startVal + step * 9;
			var focusedVal = Math.floor(this.viewDate.getFullYear() / step) * step;
			var selected = $.map(this.dates, function(d){
				return Math.floor(d.getUTCFullYear() / step) * step;
			});

			var classes, tooltip, before;
			for (var currVal = startVal - step; currVal <= endVal + step; currVal += step) {
				classes = [cssClass];
				tooltip = null;

				if (currVal === startVal - step) {
					classes.push('old');
				} else if (currVal === endVal + step) {
					classes.push('new');
				}
				if ($.inArray(currVal, selected) !== -1) {
					classes.push('active');
				}
				if (currVal < startYear || currVal > endYear) {
					classes.push('disabled');
				}
				if (currVal === focusedVal) {
				  classes.push('focused');
        }

				if (beforeFn !== $.noop) {
					before = beforeFn(new Date(currVal, 0, 1));
					if (before === undefined) {
						before = {};
					} else if (typeof before === 'boolean') {
						before = {enabled: before};
					} else if (typeof before === 'string') {
						before = {classes: before};
					}
					if (before.enabled === false) {
						classes.push('disabled');
					}
					if (before.classes) {
						classes = classes.concat(before.classes.split(/\s+/));
					}
					if (before.tooltip) {
						tooltip = before.tooltip;
					}
				}

				html += '<span class="' + classes.join(' ') + '"' + (tooltip ? ' title="' + tooltip + '"' : '') + '>' + currVal + '</span>';
			}

			view.find('.datepicker-switch').text(startVal + '-' + endVal);
			view.find('td').html(html);
		},

		fill: function(){
			var d = new Date(this.viewDate),
				year = d.getUTCFullYear(),
				month = d.getUTCMonth(),
				startYear = this.o.startDate !== -Infinity ? this.o.startDate.getUTCFullYear() : -Infinity,
				startMonth = this.o.startDate !== -Infinity ? this.o.startDate.getUTCMonth() : -Infinity,
				endYear = this.o.endDate !== Infinity ? this.o.endDate.getUTCFullYear() : Infinity,
				endMonth = this.o.endDate !== Infinity ? this.o.endDate.getUTCMonth() : Infinity,
				todaytxt = dates[this.o.language].today || dates['en'].today || '',
				cleartxt = dates[this.o.language].clear || dates['en'].clear || '',
				titleFormat = dates[this.o.language].titleFormat || dates['en'].titleFormat,
				tooltip,
				before;
			if (isNaN(year) || isNaN(month))
				return;
			this.picker.find('.datepicker-days .datepicker-switch')
						.text(DPGlobal.formatDate(d, titleFormat, this.o.language));
			this.picker.find('tfoot .today')
						.text(todaytxt)
						.css('display', this.o.todayBtn === true || this.o.todayBtn === 'linked' ? 'table-cell' : 'none');
			this.picker.find('tfoot .clear')
						.text(cleartxt)
						.css('display', this.o.clearBtn === true ? 'table-cell' : 'none');
			this.picker.find('thead .datepicker-title')
						.text(this.o.title)
						.css('display', typeof this.o.title === 'string' && this.o.title !== '' ? 'table-cell' : 'none');
			this.updateNavArrows();
			this.fillMonths();
			var prevMonth = UTCDate(year, month, 0),
				day = prevMonth.getUTCDate();
			prevMonth.setUTCDate(day - (prevMonth.getUTCDay() - this.o.weekStart + 7)%7);
			var nextMonth = new Date(prevMonth);
			if (prevMonth.getUTCFullYear() < 100){
        nextMonth.setUTCFullYear(prevMonth.getUTCFullYear());
      }
			nextMonth.setUTCDate(nextMonth.getUTCDate() + 42);
			nextMonth = nextMonth.valueOf();
			var html = [];
			var weekDay, clsName;
			while (prevMonth.valueOf() < nextMonth){
				weekDay = prevMonth.getUTCDay();
				if (weekDay === this.o.weekStart){
					html.push('<tr>');
					if (this.o.calendarWeeks){
						// ISO 8601: First week contains first thursday.
						// ISO also states week starts on Monday, but we can be more abstract here.
						var
							// Start of current week: based on weekstart/current date
							ws = new Date(+prevMonth + (this.o.weekStart - weekDay - 7) % 7 * 864e5),
							// Thursday of this week
							th = new Date(Number(ws) + (7 + 4 - ws.getUTCDay()) % 7 * 864e5),
							// First Thursday of year, year from thursday
							yth = new Date(Number(yth = UTCDate(th.getUTCFullYear(), 0, 1)) + (7 + 4 - yth.getUTCDay()) % 7 * 864e5),
							// Calendar week: ms between thursdays, div ms per day, div 7 days
							calWeek = (th - yth) / 864e5 / 7 + 1;
						html.push('<td class="cw">'+ calWeek +'</td>');
					}
				}
				clsName = this.getClassNames(prevMonth);
				clsName.push('day');

				var content = prevMonth.getUTCDate();

				if (this.o.beforeShowDay !== $.noop){
					before = this.o.beforeShowDay(this._utc_to_local(prevMonth));
					if (before === undefined)
						before = {};
					else if (typeof before === 'boolean')
						before = {enabled: before};
					else if (typeof before === 'string')
						before = {classes: before};
					if (before.enabled === false)
						clsName.push('disabled');
					if (before.classes)
						clsName = clsName.concat(before.classes.split(/\s+/));
					if (before.tooltip)
						tooltip = before.tooltip;
					if (before.content)
						content = before.content;
				}

				//Check if uniqueSort exists (supported by jquery >=1.12 and >=2.2)
				//Fallback to unique function for older jquery versions
				if ($.isFunction($.uniqueSort)) {
					clsName = $.uniqueSort(clsName);
				} else {
					clsName = $.unique(clsName);
				}

				html.push('<td class="'+clsName.join(' ')+'"' + (tooltip ? ' title="'+tooltip+'"' : '') + ' data-date="' + prevMonth.getTime().toString() + '">' + content + '</td>');
				tooltip = null;
				if (weekDay === this.o.weekEnd){
					html.push('</tr>');
				}
				prevMonth.setUTCDate(prevMonth.getUTCDate() + 1);
			}
			this.picker.find('.datepicker-days tbody').html(html.join(''));

			var monthsTitle = dates[this.o.language].monthsTitle || dates['en'].monthsTitle || 'Months';
			var months = this.picker.find('.datepicker-months')
						.find('.datepicker-switch')
							.text(this.o.maxViewMode < 2 ? monthsTitle : year)
							.end()
						.find('tbody span').removeClass('active');

			$.each(this.dates, function(i, d){
				if (d.getUTCFullYear() === year)
					months.eq(d.getUTCMonth()).addClass('active');
			});

			if (year < startYear || year > endYear){
				months.addClass('disabled');
			}
			if (year === startYear){
				months.slice(0, startMonth).addClass('disabled');
			}
			if (year === endYear){
				months.slice(endMonth+1).addClass('disabled');
			}

			if (this.o.beforeShowMonth !== $.noop){
				var that = this;
				$.each(months, function(i, month){
          var moDate = new Date(year, i, 1);
          var before = that.o.beforeShowMonth(moDate);
					if (before === undefined)
						before = {};
					else if (typeof before === 'boolean')
						before = {enabled: before};
					else if (typeof before === 'string')
						before = {classes: before};
					if (before.enabled === false && !$(month).hasClass('disabled'))
					    $(month).addClass('disabled');
					if (before.classes)
					    $(month).addClass(before.classes);
					if (before.tooltip)
					    $(month).prop('title', before.tooltip);
				});
			}

			// Generating decade/years picker
			this._fill_yearsView(
				'.datepicker-years',
				'year',
				10,
				year,
				startYear,
				endYear,
				this.o.beforeShowYear
			);

			// Generating century/decades picker
			this._fill_yearsView(
				'.datepicker-decades',
				'decade',
				100,
				year,
				startYear,
				endYear,
				this.o.beforeShowDecade
			);

			// Generating millennium/centuries picker
			this._fill_yearsView(
				'.datepicker-centuries',
				'century',
				1000,
				year,
				startYear,
				endYear,
				this.o.beforeShowCentury
			);
		},

		updateNavArrows: function(){
			if (!this._allow_update)
				return;

			var d = new Date(this.viewDate),
				year = d.getUTCFullYear(),
				month = d.getUTCMonth(),
				startYear = this.o.startDate !== -Infinity ? this.o.startDate.getUTCFullYear() : -Infinity,
				startMonth = this.o.startDate !== -Infinity ? this.o.startDate.getUTCMonth() : -Infinity,
				endYear = this.o.endDate !== Infinity ? this.o.endDate.getUTCFullYear() : Infinity,
				endMonth = this.o.endDate !== Infinity ? this.o.endDate.getUTCMonth() : Infinity,
				prevIsDisabled,
				nextIsDisabled,
				factor = 1;
			switch (this.viewMode){
				case 0:
					prevIsDisabled = year <= startYear && month <= startMonth;
					nextIsDisabled = year >= endYear && month >= endMonth;
					break;
				case 4:
					factor *= 10;
					/* falls through */
				case 3:
					factor *= 10;
					/* falls through */
				case 2:
					factor *= 10;
					/* falls through */
				case 1:
					prevIsDisabled = Math.floor(year / factor) * factor <= startYear;
					nextIsDisabled = Math.floor(year / factor) * factor + factor >= endYear;
					break;
			}

			this.picker.find('.prev').toggleClass('disabled', prevIsDisabled);
			this.picker.find('.next').toggleClass('disabled', nextIsDisabled);
		},

		click: function(e){
			e.preventDefault();
			e.stopPropagation();

			var target, dir, day, year, month;
			target = $(e.target);

			// Clicked on the switch
			if (target.hasClass('datepicker-switch') && this.viewMode !== this.o.maxViewMode){
				this.setViewMode(this.viewMode + 1);
			}

			// Clicked on today button
			if (target.hasClass('today') && !target.hasClass('day')){
				this.setViewMode(0);
				this._setDate(UTCToday(), this.o.todayBtn === 'linked' ? null : 'view');
			}

			// Clicked on clear button
			if (target.hasClass('clear')){
				this.clearDates();
			}

			if (!target.hasClass('disabled')){
				// Clicked on a month, year, decade, century
				if (target.hasClass('month')
						|| target.hasClass('year')
						|| target.hasClass('decade')
						|| target.hasClass('century')) {
					this.viewDate.setUTCDate(1);

					day = 1;
					if (this.viewMode === 1){
						month = target.parent().find('span').index(target);
						year = this.viewDate.getUTCFullYear();
						this.viewDate.setUTCMonth(month);
					} else {
						month = 0;
						year = Number(target.text());
						this.viewDate.setUTCFullYear(year);
					}

					this._trigger(DPGlobal.viewModes[this.viewMode - 1].e, this.viewDate);

					if (this.viewMode === this.o.minViewMode){
						this._setDate(UTCDate(year, month, day));
					} else {
						this.setViewMode(this.viewMode - 1);
						this.fill();
					}
				}
			}

			if (this.picker.is(':visible') && this._focused_from){
				this._focused_from.focus();
			}
			delete this._focused_from;
		},

		dayCellClick: function(e){
			var $target = $(e.currentTarget);
			var timestamp = $target.data('date');
			var date = new Date(timestamp);

			if (this.o.updateViewDate) {
				if (date.getUTCFullYear() !== this.viewDate.getUTCFullYear()) {
					this._trigger('changeYear', this.viewDate);
				}

				if (date.getUTCMonth() !== this.viewDate.getUTCMonth()) {
					this._trigger('changeMonth', this.viewDate);
				}
			}
			this._setDate(date);
		},

		// Clicked on prev or next
		navArrowsClick: function(e){
			var $target = $(e.currentTarget);
			var dir = $target.hasClass('prev') ? -1 : 1;
			if (this.viewMode !== 0){
				dir *= DPGlobal.viewModes[this.viewMode].navStep * 12;
			}
			this.viewDate = this.moveMonth(this.viewDate, dir);
			this._trigger(DPGlobal.viewModes[this.viewMode].e, this.viewDate);
			this.fill();
		},

		_toggle_multidate: function(date){
			var ix = this.dates.contains(date);
			if (!date){
				this.dates.clear();
			}

			if (ix !== -1){
				if (this.o.multidate === true || this.o.multidate > 1 || this.o.toggleActive){
					this.dates.remove(ix);
				}
			} else if (this.o.multidate === false) {
				this.dates.clear();
				this.dates.push(date);
			}
			else {
				this.dates.push(date);
			}

			if (typeof this.o.multidate === 'number')
				while (this.dates.length > this.o.multidate)
					this.dates.remove(0);
		},

		_setDate: function(date, which){
			if (!which || which === 'date')
				this._toggle_multidate(date && new Date(date));
			if ((!which && this.o.updateViewDate) || which === 'view')
				this.viewDate = date && new Date(date);

			this.fill();
			this.setValue();
			if (!which || which !== 'view') {
				this._trigger('changeDate');
			}
			this.inputField.trigger('change');
			if (this.o.autoclose && (!which || which === 'date')){
				this.hide();
			}
		},

		moveDay: function(date, dir){
			var newDate = new Date(date);
			newDate.setUTCDate(date.getUTCDate() + dir);

			return newDate;
		},

		moveWeek: function(date, dir){
			return this.moveDay(date, dir * 7);
		},

		moveMonth: function(date, dir){
			if (!isValidDate(date))
				return this.o.defaultViewDate;
			if (!dir)
				return date;
			var new_date = new Date(date.valueOf()),
				day = new_date.getUTCDate(),
				month = new_date.getUTCMonth(),
				mag = Math.abs(dir),
				new_month, test;
			dir = dir > 0 ? 1 : -1;
			if (mag === 1){
				test = dir === -1
					// If going back one month, make sure month is not current month
					// (eg, Mar 31 -> Feb 31 == Feb 28, not Mar 02)
					? function(){
						return new_date.getUTCMonth() === month;
					}
					// If going forward one month, make sure month is as expected
					// (eg, Jan 31 -> Feb 31 == Feb 28, not Mar 02)
					: function(){
						return new_date.getUTCMonth() !== new_month;
					};
				new_month = month + dir;
				new_date.setUTCMonth(new_month);
				// Dec -> Jan (12) or Jan -> Dec (-1) -- limit expected date to 0-11
				new_month = (new_month + 12) % 12;
			}
			else {
				// For magnitudes >1, move one month at a time...
				for (var i=0; i < mag; i++)
					// ...which might decrease the day (eg, Jan 31 to Feb 28, etc)...
					new_date = this.moveMonth(new_date, dir);
				// ...then reset the day, keeping it in the new month
				new_month = new_date.getUTCMonth();
				new_date.setUTCDate(day);
				test = function(){
					return new_month !== new_date.getUTCMonth();
				};
			}
			// Common date-resetting loop -- if date is beyond end of month, make it
			// end of month
			while (test()){
				new_date.setUTCDate(--day);
				new_date.setUTCMonth(new_month);
			}
			return new_date;
		},

		moveYear: function(date, dir){
			return this.moveMonth(date, dir*12);
		},

		moveAvailableDate: function(date, dir, fn){
			do {
				date = this[fn](date, dir);

				if (!this.dateWithinRange(date))
					return false;

				fn = 'moveDay';
			}
			while (this.dateIsDisabled(date));

			return date;
		},

		weekOfDateIsDisabled: function(date){
			return $.inArray(date.getUTCDay(), this.o.daysOfWeekDisabled) !== -1;
		},

		dateIsDisabled: function(date){
			return (
				this.weekOfDateIsDisabled(date) ||
				$.grep(this.o.datesDisabled, function(d){
					return isUTCEquals(date, d);
				}).length > 0
			);
		},

		dateWithinRange: function(date){
			return date >= this.o.startDate && date <= this.o.endDate;
		},

		keydown: function(e){
			if (!this.picker.is(':visible')){
				if (e.keyCode === 40 || e.keyCode === 27) { // allow down to re-show picker
					this.show();
					e.stopPropagation();
        }
				return;
			}
			var dateChanged = false,
				dir, newViewDate,
				focusDate = this.focusDate || this.viewDate;
			switch (e.keyCode){
				case 27: // escape
					if (this.focusDate){
						this.focusDate = null;
						this.viewDate = this.dates.get(-1) || this.viewDate;
						this.fill();
					}
					else
						this.hide();
					e.preventDefault();
					e.stopPropagation();
					break;
				case 37: // left
				case 38: // up
				case 39: // right
				case 40: // down
					if (!this.o.keyboardNavigation || this.o.daysOfWeekDisabled.length === 7)
						break;
					dir = e.keyCode === 37 || e.keyCode === 38 ? -1 : 1;
          if (this.viewMode === 0) {
  					if (e.ctrlKey){
  						newViewDate = this.moveAvailableDate(focusDate, dir, 'moveYear');

  						if (newViewDate)
  							this._trigger('changeYear', this.viewDate);
  					} else if (e.shiftKey){
  						newViewDate = this.moveAvailableDate(focusDate, dir, 'moveMonth');

  						if (newViewDate)
  							this._trigger('changeMonth', this.viewDate);
  					} else if (e.keyCode === 37 || e.keyCode === 39){
  						newViewDate = this.moveAvailableDate(focusDate, dir, 'moveDay');
  					} else if (!this.weekOfDateIsDisabled(focusDate)){
  						newViewDate = this.moveAvailableDate(focusDate, dir, 'moveWeek');
  					}
          } else if (this.viewMode === 1) {
            if (e.keyCode === 38 || e.keyCode === 40) {
              dir = dir * 4;
            }
            newViewDate = this.moveAvailableDate(focusDate, dir, 'moveMonth');
          } else if (this.viewMode === 2) {
            if (e.keyCode === 38 || e.keyCode === 40) {
              dir = dir * 4;
            }
            newViewDate = this.moveAvailableDate(focusDate, dir, 'moveYear');
          }
					if (newViewDate){
						this.focusDate = this.viewDate = newViewDate;
						this.setValue();
						this.fill();
						e.preventDefault();
					}
					break;
				case 13: // enter
					if (!this.o.forceParse)
						break;
					focusDate = this.focusDate || this.dates.get(-1) || this.viewDate;
					if (this.o.keyboardNavigation) {
						this._toggle_multidate(focusDate);
						dateChanged = true;
					}
					this.focusDate = null;
					this.viewDate = this.dates.get(-1) || this.viewDate;
					this.setValue();
					this.fill();
					if (this.picker.is(':visible')){
						e.preventDefault();
						e.stopPropagation();
						if (this.o.autoclose)
							this.hide();
					}
					break;
				case 9: // tab
					this.focusDate = null;
					this.viewDate = this.dates.get(-1) || this.viewDate;
					this.fill();
					this.hide();
					break;
			}
			if (dateChanged){
				if (this.dates.length)
					this._trigger('changeDate');
				else
					this._trigger('clearDate');
				this.inputField.trigger('change');
			}
		},

		setViewMode: function(viewMode){
			this.viewMode = viewMode;
			this.picker
				.children('div')
				.hide()
				.filter('.datepicker-' + DPGlobal.viewModes[this.viewMode].clsName)
					.show();
			this.updateNavArrows();
      this._trigger('changeViewMode', new Date(this.viewDate));
		}
	};

	var DateRangePicker = function(element, options){
		$.data(element, 'datepicker', this);
		this.element = $(element);
		this.inputs = $.map(options.inputs, function(i){
			return i.jquery ? i[0] : i;
		});
		delete options.inputs;

		this.keepEmptyValues = options.keepEmptyValues;
		delete options.keepEmptyValues;

		datepickerPlugin.call($(this.inputs), options)
			.on('changeDate', $.proxy(this.dateUpdated, this));

		this.pickers = $.map(this.inputs, function(i){
			return $.data(i, 'datepicker');
		});
		this.updateDates();
	};
	DateRangePicker.prototype = {
		updateDates: function(){
			this.dates = $.map(this.pickers, function(i){
				return i.getUTCDate();
			});
			this.updateRanges();
		},
		updateRanges: function(){
			var range = $.map(this.dates, function(d){
				return d.valueOf();
			});
			$.each(this.pickers, function(i, p){
				p.setRange(range);
			});
		},
		dateUpdated: function(e){
			// `this.updating` is a workaround for preventing infinite recursion
			// between `changeDate` triggering and `setUTCDate` calling.  Until
			// there is a better mechanism.
			if (this.updating)
				return;
			this.updating = true;

			var dp = $.data(e.target, 'datepicker');

			if (dp === undefined) {
				return;
			}

			var new_date = dp.getUTCDate(),
				keep_empty_values = this.keepEmptyValues,
				i = $.inArray(e.target, this.inputs),
				j = i - 1,
				k = i + 1,
				l = this.inputs.length;
			if (i === -1)
				return;

			$.each(this.pickers, function(i, p){
				if (!p.getUTCDate() && (p === dp || !keep_empty_values))
					p.setUTCDate(new_date);
			});

			if (new_date < this.dates[j]){
				// Date being moved earlier/left
				while (j >= 0 && new_date < this.dates[j]){
					this.pickers[j--].setUTCDate(new_date);
				}
			} else if (new_date > this.dates[k]){
				// Date being moved later/right
				while (k < l && new_date > this.dates[k]){
					this.pickers[k++].setUTCDate(new_date);
				}
			}
			this.updateDates();

			delete this.updating;
		},
		destroy: function(){
			$.map(this.pickers, function(p){ p.destroy(); });
			$(this.inputs).off('changeDate', this.dateUpdated);
			delete this.element.data().datepicker;
		},
		remove: alias('destroy', 'Method `remove` is deprecated and will be removed in version 2.0. Use `destroy` instead')
	};

	function opts_from_el(el, prefix){
		// Derive options from element data-attrs
		var data = $(el).data(),
			out = {}, inkey,
			replace = new RegExp('^' + prefix.toLowerCase() + '([A-Z])');
		prefix = new RegExp('^' + prefix.toLowerCase());
		function re_lower(_,a){
			return a.toLowerCase();
		}
		for (var key in data)
			if (prefix.test(key)){
				inkey = key.replace(replace, re_lower);
				out[inkey] = data[key];
			}
		return out;
	}

	function opts_from_locale(lang){
		// Derive options from locale plugins
		var out = {};
		// Check if "de-DE" style date is available, if not language should
		// fallback to 2 letter code eg "de"
		if (!dates[lang]){
			lang = lang.split('-')[0];
			if (!dates[lang])
				return;
		}
		var d = dates[lang];
		$.each(locale_opts, function(i,k){
			if (k in d)
				out[k] = d[k];
		});
		return out;
	}

	var old = $.fn.datepicker;
	var datepickerPlugin = function(option){
		var args = Array.apply(null, arguments);
		args.shift();
		var internal_return;
		this.each(function(){
			var $this = $(this),
				data = $this.data('datepicker'),
				options = typeof option === 'object' && option;
			if (!data){
				var elopts = opts_from_el(this, 'date'),
					// Preliminary otions
					xopts = $.extend({}, defaults, elopts, options),
					locopts = opts_from_locale(xopts.language),
					// Options priority: js args, data-attrs, locales, defaults
					opts = $.extend({}, defaults, locopts, elopts, options);
				if ($this.hasClass('input-daterange') || opts.inputs){
					$.extend(opts, {
						inputs: opts.inputs || $this.find('input').toArray()
					});
					data = new DateRangePicker(this, opts);
				}
				else {
					data = new Datepicker(this, opts);
				}
				$this.data('datepicker', data);
			}
			if (typeof option === 'string' && typeof data[option] === 'function'){
				internal_return = data[option].apply(data, args);
			}
		});

		if (
			internal_return === undefined ||
			internal_return instanceof Datepicker ||
			internal_return instanceof DateRangePicker
		)
			return this;

		if (this.length > 1)
			throw new Error('Using only allowed for the collection of a single element (' + option + ' function)');
		else
			return internal_return;
	};
	$.fn.datepicker = datepickerPlugin;

	var defaults = $.fn.datepicker.defaults = {
		assumeNearbyYear: false,
		autoclose: false,
		beforeShowDay: $.noop,
		beforeShowMonth: $.noop,
		beforeShowYear: $.noop,
		beforeShowDecade: $.noop,
		beforeShowCentury: $.noop,
		calendarWeeks: false,
		clearBtn: false,
		toggleActive: false,
		daysOfWeekDisabled: [],
		daysOfWeekHighlighted: [],
		datesDisabled: [],
		endDate: Infinity,
		forceParse: true,
		format: 'mm/dd/yyyy',
		keepEmptyValues: false,
		keyboardNavigation: true,
		language: 'en',
		minViewMode: 0,
		maxViewMode: 4,
		multidate: false,
		multidateSeparator: ',',
		orientation: "auto",
		rtl: false,
		startDate: -Infinity,
		startView: 0,
		todayBtn: false,
		todayHighlight: false,
		updateViewDate: true,
		weekStart: 0,
		disableTouchKeyboard: false,
		enableOnReadonly: true,
		showOnFocus: true,
		zIndexOffset: 10,
		container: 'body',
		immediateUpdates: false,
		title: '',
		templates: {
			leftArrow: '&#x00AB;',
			rightArrow: '&#x00BB;'
		},
    showWeekDays: true
	};
	var locale_opts = $.fn.datepicker.locale_opts = [
		'format',
		'rtl',
		'weekStart'
	];
	$.fn.datepicker.Constructor = Datepicker;
	var dates = $.fn.datepicker.dates = {
		en: {
			days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
			daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
			daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
			months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
			monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
			today: "Today",
			clear: "Clear",
			titleFormat: "MM yyyy"
		}
	};

	var DPGlobal = {
		viewModes: [
			{
				names: ['days', 'month'],
				clsName: 'days',
				e: 'changeMonth'
			},
			{
				names: ['months', 'year'],
				clsName: 'months',
				e: 'changeYear',
				navStep: 1
			},
			{
				names: ['years', 'decade'],
				clsName: 'years',
				e: 'changeDecade',
				navStep: 10
			},
			{
				names: ['decades', 'century'],
				clsName: 'decades',
				e: 'changeCentury',
				navStep: 100
			},
			{
				names: ['centuries', 'millennium'],
				clsName: 'centuries',
				e: 'changeMillennium',
				navStep: 1000
			}
		],
		validParts: /dd?|DD?|mm?|MM?|yy(?:yy)?/g,
		nonpunctuation: /[^ -\/:-@\u5e74\u6708\u65e5\[-`{-~\t\n\r]+/g,
		parseFormat: function(format){
			if (typeof format.toValue === 'function' && typeof format.toDisplay === 'function')
                return format;
            // IE treats \0 as a string end in inputs (truncating the value),
			// so it's a bad format delimiter, anyway
			var separators = format.replace(this.validParts, '\0').split('\0'),
				parts = format.match(this.validParts);
			if (!separators || !separators.length || !parts || parts.length === 0){
				throw new Error("Invalid date format.");
			}
			return {separators: separators, parts: parts};
		},
		parseDate: function(date, format, language, assumeNearby){
			if (!date)
				return undefined;
			if (date instanceof Date)
				return date;
			if (typeof format === 'string')
				format = DPGlobal.parseFormat(format);
			if (format.toValue)
				return format.toValue(date, format, language);
			var fn_map = {
					d: 'moveDay',
					m: 'moveMonth',
					w: 'moveWeek',
					y: 'moveYear'
				},
				dateAliases = {
					yesterday: '-1d',
					today: '+0d',
					tomorrow: '+1d'
				},
				parts, part, dir, i, fn;
			if (date in dateAliases){
				date = dateAliases[date];
			}
			if (/^[\-+]\d+[dmwy]([\s,]+[\-+]\d+[dmwy])*$/i.test(date)){
				parts = date.match(/([\-+]\d+)([dmwy])/gi);
				date = new Date();
				for (i=0; i < parts.length; i++){
					part = parts[i].match(/([\-+]\d+)([dmwy])/i);
					dir = Number(part[1]);
					fn = fn_map[part[2].toLowerCase()];
					date = Datepicker.prototype[fn](date, dir);
				}
				return Datepicker.prototype._zero_utc_time(date);
			}

			parts = date && date.match(this.nonpunctuation) || [];

			function applyNearbyYear(year, threshold){
				if (threshold === true)
					threshold = 10;

				// if year is 2 digits or less, than the user most likely is trying to get a recent century
				if (year < 100){
					year += 2000;
					// if the new year is more than threshold years in advance, use last century
					if (year > ((new Date()).getFullYear()+threshold)){
						year -= 100;
					}
				}

				return year;
			}

			var parsed = {},
				setters_order = ['yyyy', 'yy', 'M', 'MM', 'm', 'mm', 'd', 'dd'],
				setters_map = {
					yyyy: function(d,v){
						return d.setUTCFullYear(assumeNearby ? applyNearbyYear(v, assumeNearby) : v);
					},
					m: function(d,v){
						if (isNaN(d))
							return d;
						v -= 1;
						while (v < 0) v += 12;
						v %= 12;
						d.setUTCMonth(v);
						while (d.getUTCMonth() !== v)
							d.setUTCDate(d.getUTCDate()-1);
						return d;
					},
					d: function(d,v){
						return d.setUTCDate(v);
					}
				},
				val, filtered;
			setters_map['yy'] = setters_map['yyyy'];
			setters_map['M'] = setters_map['MM'] = setters_map['mm'] = setters_map['m'];
			setters_map['dd'] = setters_map['d'];
			date = UTCToday();
			var fparts = format.parts.slice();
			// Remove noop parts
			if (parts.length !== fparts.length){
				fparts = $(fparts).filter(function(i,p){
					return $.inArray(p, setters_order) !== -1;
				}).toArray();
			}
			// Process remainder
			function match_part(){
				var m = this.slice(0, parts[i].length),
					p = parts[i].slice(0, m.length);
				return m.toLowerCase() === p.toLowerCase();
			}
			if (parts.length === fparts.length){
				var cnt;
				for (i=0, cnt = fparts.length; i < cnt; i++){
					val = parseInt(parts[i], 10);
					part = fparts[i];
					if (isNaN(val)){
						switch (part){
							case 'MM':
								filtered = $(dates[language].months).filter(match_part);
								val = $.inArray(filtered[0], dates[language].months) + 1;
								break;
							case 'M':
								filtered = $(dates[language].monthsShort).filter(match_part);
								val = $.inArray(filtered[0], dates[language].monthsShort) + 1;
								break;
						}
					}
					parsed[part] = val;
				}
				var _date, s;
				for (i=0; i < setters_order.length; i++){
					s = setters_order[i];
					if (s in parsed && !isNaN(parsed[s])){
						_date = new Date(date);
						setters_map[s](_date, parsed[s]);
						if (!isNaN(_date))
							date = _date;
					}
				}
			}
			return date;
		},
		formatDate: function(date, format, language){
			if (!date)
				return '';
			if (typeof format === 'string')
				format = DPGlobal.parseFormat(format);
			if (format.toDisplay)
                return format.toDisplay(date, format, language);
            var val = {
				d: date.getUTCDate(),
				D: dates[language].daysShort[date.getUTCDay()],
				DD: dates[language].days[date.getUTCDay()],
				m: date.getUTCMonth() + 1,
				M: dates[language].monthsShort[date.getUTCMonth()],
				MM: dates[language].months[date.getUTCMonth()],
				yy: date.getUTCFullYear().toString().substring(2),
				yyyy: date.getUTCFullYear()
			};
			val.dd = (val.d < 10 ? '0' : '') + val.d;
			val.mm = (val.m < 10 ? '0' : '') + val.m;
			date = [];
			var seps = $.extend([], format.separators);
			for (var i=0, cnt = format.parts.length; i <= cnt; i++){
				if (seps.length)
					date.push(seps.shift());
				date.push(val[format.parts[i]]);
			}
			return date.join('');
		},
		headTemplate: '<thead>'+
			              '<tr>'+
			                '<th colspan="7" class="datepicker-title"></th>'+
			              '</tr>'+
							'<tr>'+
								'<th class="prev">'+defaults.templates.leftArrow+'</th>'+
								'<th colspan="5" class="datepicker-switch"></th>'+
								'<th class="next">'+defaults.templates.rightArrow+'</th>'+
							'</tr>'+
						'</thead>',
		contTemplate: '<tbody><tr><td colspan="7"></td></tr></tbody>',
		footTemplate: '<tfoot>'+
							'<tr>'+
								'<th colspan="7" class="today"></th>'+
							'</tr>'+
							'<tr>'+
								'<th colspan="7" class="clear"></th>'+
							'</tr>'+
						'</tfoot>'
	};
	DPGlobal.template = '<div class="datepicker">'+
							'<div class="datepicker-days">'+
								'<table class="table-condensed">'+
									DPGlobal.headTemplate+
									'<tbody></tbody>'+
									DPGlobal.footTemplate+
								'</table>'+
							'</div>'+
							'<div class="datepicker-months">'+
								'<table class="table-condensed">'+
									DPGlobal.headTemplate+
									DPGlobal.contTemplate+
									DPGlobal.footTemplate+
								'</table>'+
							'</div>'+
							'<div class="datepicker-years">'+
								'<table class="table-condensed">'+
									DPGlobal.headTemplate+
									DPGlobal.contTemplate+
									DPGlobal.footTemplate+
								'</table>'+
							'</div>'+
							'<div class="datepicker-decades">'+
								'<table class="table-condensed">'+
									DPGlobal.headTemplate+
									DPGlobal.contTemplate+
									DPGlobal.footTemplate+
								'</table>'+
							'</div>'+
							'<div class="datepicker-centuries">'+
								'<table class="table-condensed">'+
									DPGlobal.headTemplate+
									DPGlobal.contTemplate+
									DPGlobal.footTemplate+
								'</table>'+
							'</div>'+
						'</div>';

	$.fn.datepicker.DPGlobal = DPGlobal;


	/* DATEPICKER NO CONFLICT
	* =================== */

	$.fn.datepicker.noConflict = function(){
		$.fn.datepicker = old;
		return this;
	};

	/* DATEPICKER VERSION
	 * =================== */
	$.fn.datepicker.version = '1.7.1';

	$.fn.datepicker.deprecated = function(msg){
		var console = window.console;
		if (console && console.warn) {
			console.warn('DEPRECATED: ' + msg);
		}
	};


	/* DATEPICKER DATA-API
	* ================== */

	$(document).on(
		'focus.datepicker.data-api click.datepicker.data-api',
		'[data-provide="datepicker"]',
		function(e){
			var $this = $(this);
			if ($this.data('datepicker'))
				return;
			e.preventDefault();
			// component click requires us to explicitly show it
			datepickerPlugin.call($this, 'show');
		}
	);
	$(function(){
		datepickerPlugin.call($('[data-provide="datepicker-inline"]'));
	});

}));
!function(a){a.fn.datepicker.dates.sv={days:["Söndag","Måndag","Tisdag","Onsdag","Torsdag","Fredag","Lördag"],daysShort:["Sön","Mån","Tis","Ons","Tor","Fre","Lör"],daysMin:["Sö","Må","Ti","On","To","Fr","Lö"],months:["Januari","Februari","Mars","April","Maj","Juni","Juli","Augusti","September","Oktober","November","December"],monthsShort:["Jan","Feb","Mar","Apr","Maj","Jun","Jul","Aug","Sep","Okt","Nov","Dec"],today:"Idag",format:"yyyy-mm-dd",weekStart:1,clear:"Rensa"}}(jQuery);
/*!
 * animsition v4.0.2
 * A simple and easy jQuery plugin for CSS animated page transitions.
 * http://blivesta.github.io/animsition
 * License : MIT
 * Author : blivesta (http://blivesta.com/)
 */

;(function (factory) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('jquery'));
  } else {
    factory(jQuery);
  }
}(function ($) {
  'use strict';
  var namespace = 'animsition';
  var loaded = false;
  $(window).on('load', function() {
    loaded = true;
  });
  var __ = {
    init: function(options){
      options = $.extend({
        inClass               :   'fade-in',
        outClass              :   'fade-out',
        inDuration            :    1500,
        outDuration           :    800,
        linkElement           :   '.animsition-link',
        // e.g. linkElement   :   'a:not([target="_blank"]):not([href^="#"])'
        loading               :    true,
        loadingParentElement  :   'body', //animsition wrapper element
        loadingClass          :   'animsition-loading',
        loadingInner          :   '', // e.g '<img src="loading.svg" />'
        timeout               :   false,
        timeoutCountdown      :   5000,
        onLoadEvent           :   true,
        browser               : [ 'animation-duration', '-webkit-animation-duration'],
        // "browser" option allows you to disable the "animsition" in case the css property in the array is not supported by your browser.
        // The default setting is to disable the "animsition" in a browser that does not support "animation-duration".
        overlay               :   false,
        overlayClass          :   'animsition-overlay-slide',
        overlayParentElement  :   'body',
        transition            :   function(url){ window.location.href = url; }
      }, options);

      __.settings = {
        timer: false,
        data: {
          inClass: 'animsition-in-class',
          inDuration: 'animsition-in-duration',
          outClass: 'animsition-out-class',
          outDuration: 'animsition-out-duration',
          overlay: 'animsition-overlay'
        },
        events: {
          inStart: 'animsition.inStart',
          inEnd: 'animsition.inEnd',
          outStart: 'animsition.outStart',
          outEnd: 'animsition.outEnd'
        }
      };

      // Remove the "Animsition" in a browser
      // that does not support the "animaition-duration".
      var support = __.supportCheck.call(this, options);

      if(!support && options.browser.length > 0){
        if(!support || !this.length){
          // If do not have a console object to object window
          if (!('console' in window)) {
            window.console = {};
            window.console.log = function(str){ return str; };
          }
          if(!this.length) console.log('Animsition: Element does not exist on page.');
          if(!support) console.log('Animsition: Does not support this browser.');
          return __.destroy.call(this);
        }
      }

      var overlayMode = __.optionCheck.call(this, options);

      if (overlayMode && $('.' + options.overlayClass).length <= 0) {
        __.addOverlay.call(this, options);
      }

      if (options.loading && $('.' + options.loadingClass).length <= 0) {
        __.addLoading.call(this, options);
      }

      return this.each(function(){
        var _this = this;
        var $this = $(this);
        var $window = $(window);
        var $document = $(document);
        var data = $this.data(namespace);

        if (!data) {
          options = $.extend({}, options);

          $this.data(namespace, { options: options });

          if(options.timeout) __.addTimer.call(_this);

          if(options.onLoadEvent) {
            if(loaded) {
              if(__.settings.timer) clearTimeout(__.settings.timer);
              __.in.call(_this);
            } else {
              $window.on('load', function(e) {
                if(__.settings.timer) clearTimeout(__.settings.timer);
                __.in.call(_this);
              });
            }
          }

          $window.on('pageshow.' + namespace, function(event) {
            if(event.originalEvent.persisted) __.in.call(_this);
          });

          // Firefox back button issue #4
          $window.on('unload.' + namespace, function() { });

          $document.on('click.' + namespace, options.linkElement, function(event) {
            event.preventDefault();
            var $self = $(this);
            var url = $self.attr('href');

            // middle mouse button issue #24
            // if(middle mouse button || command key || shift key || win control key)
            if (event.which === 2 || event.metaKey || event.shiftKey || navigator.platform.toUpperCase().indexOf('WIN') !== -1 && event.ctrlKey) {
              window.open(url, '_blank');
            } else {
              __.out.call(_this, $self, url);
            }

          });
        }
      }); // end each
    },

    addOverlay: function(options){
      $(options.overlayParentElement)
        .prepend('<div class="' + options.overlayClass + '"></div>');
    },

    addLoading: function(options){
      $(options.loadingParentElement)
        .append('<div class="' + options.loadingClass + '">' + options.loadingInner + '</div>');
    },

    removeLoading: function(){
      var $this     = $(this);
      var options   = $this.data(namespace).options;
      var $loading  = $(options.loadingParentElement).children('.' + options.loadingClass);

      $loading.fadeOut().remove();
    },

    addTimer: function(){
      var _this = this;
      var $this = $(this);
      var options = $this.data(namespace).options;

      __.settings.timer = setTimeout(function(){
        __.in.call(_this);
        $(window).off('load.' + namespace);
      }, options.timeoutCountdown);
    },

    supportCheck: function(options){
      var $this = $(this);
      var props = options.browser;
      var propsNum = props.length;
      var support  = false;

      if (propsNum === 0) {
        support = true;
      }
      for (var i = 0; i < propsNum; i++) {
        if (typeof $this.css(props[i]) === 'string') {
          support = true;
          break;
        }
      }
      return support;
    },

    optionCheck: function(options){
      var $this = $(this);
      var overlayMode;
      if(options.overlay || $this.data(__.settings.data.overlay)){
        overlayMode = true;
      } else {
        overlayMode = false;
      }
      return overlayMode;
    },

    animationCheck : function(data, stateClass, stateIn){
      var $this = $(this);
      var options = $this.data(namespace).options;
      var dataType = typeof data;
      var dataDuration = !stateClass && dataType === 'number';
      var dataClass = stateClass && dataType === 'string' && data.length > 0;

      if(dataDuration || dataClass){
        data = data;
      } else if(stateClass && stateIn) {
        data = options.inClass;
      } else if(!stateClass && stateIn) {
        data = options.inDuration;
      } else if(stateClass && !stateIn) {
        data = options.outClass;
      } else if(!stateClass && !stateIn) {
        data = options.outDuration;
      }
      return data;
    },

    in: function(){
      var _this = this;
      var $this = $(this);
      var options = $this.data(namespace).options;
      var thisInDuration = $this.data(__.settings.data.inDuration);
      var thisInClass = $this.data(__.settings.data.inClass);
      var inDuration = __.animationCheck.call(_this, thisInDuration, false, true);
      var inClass = __.animationCheck.call(_this, thisInClass, true, true);
      var overlayMode = __.optionCheck.call(_this, options);
      var outClass = $this.data(namespace).outClass;

      if(options.loading) __.removeLoading.call(_this);

      if(outClass) $this.removeClass(outClass);

      if(overlayMode) {
        __.inOverlay.call(_this, inClass, inDuration);
      } else {
        __.inDefault.call(_this, inClass, inDuration);
      }
    },

    inDefault: function(inClass, inDuration){
      var $this = $(this);

      $this
        .css({ 'animation-duration' : inDuration + 'ms' })
        .addClass(inClass)
        .trigger(__.settings.events.inStart)
        .animateCallback(function(){
          $this
            .removeClass(inClass)
            .css({ 'opacity' : 1 })
            .trigger(__.settings.events.inEnd);
        });
    },

    inOverlay: function(inClass, inDuration){
      var $this = $(this);
      var options = $this.data(namespace).options;

      $this
        .css({ 'opacity' : 1 })
        .trigger(__.settings.events.inStart);

      $(options.overlayParentElement)
        .children('.' + options.overlayClass)
        .css({ 'animation-duration' : inDuration + 'ms' })
        .addClass(inClass)
        .animateCallback(function(){
          $this
            .trigger(__.settings.events.inEnd);
        });
    },

    out: function($self, url){
      var _this = this;
      var $this = $(this);
      var options = $this.data(namespace).options;
      var selfOutClass = $self.data(__.settings.data.outClass);
      var thisOutClass = $this.data(__.settings.data.outClass);
      var selfOutDuration = $self.data(__.settings.data.outDuration);
      var thisOutDuration = $this.data(__.settings.data.outDuration);
      var isOutClass = selfOutClass ? selfOutClass : thisOutClass;
      var isOutDuration = selfOutDuration ? selfOutDuration : thisOutDuration;
      var outClass = __.animationCheck.call(_this, isOutClass, true, false);
      var outDuration = __.animationCheck.call(_this, isOutDuration, false, false);
      var overlayMode = __.optionCheck.call(_this, options);

      $this.data(namespace).outClass = outClass;

      if(overlayMode) {
        __.outOverlay.call(_this, outClass, outDuration, url);
      } else {
        __.outDefault.call(_this, outClass, outDuration, url);
      }
    },

    outDefault: function(outClass, outDuration, url){
      var $this = $(this);
      var options = $this.data(namespace).options;

      // (outDuration + 1) | #55 outDuration: 0 crashes on Safari only
      $this
        .css({ 'animation-duration' : (outDuration + 1)  + 'ms' })
        .addClass(outClass)
        .trigger(__.settings.events.outStart)
        .animateCallback(function(){
          $this.trigger(__.settings.events.outEnd);
          options.transition(url);
        });
    },


    outOverlay: function(outClass, outDuration, url){
      var _this = this;
      var $this = $(this);
      var options = $this.data(namespace).options;
      var thisInClass = $this.data(__.settings.data.inClass);
      var inClass = __.animationCheck.call(_this, thisInClass, true, true);

      // (outDuration + 1) | #55 outDuration: 0 crashes animsition on Safari only
      $(options.overlayParentElement)
        .children('.' + options.overlayClass)
        .css({ 'animation-duration' : (outDuration + 1) + 'ms' })
        .removeClass(inClass)
        .addClass(outClass)
        .trigger(__.settings.events.outStart)
        .animateCallback(function(){
          $this.trigger(__.settings.events.outEnd);
          options.transition(url);
        });
    },

    destroy: function(){
      return this.each(function(){
        var $this = $(this);
        $(window).off('.'+ namespace);
        $this
          .css({'opacity': 1})
          .removeData(namespace);
      });
    }

  };

  $.fn.animateCallback = function(callback){
    var end = 'animationend webkitAnimationEnd';
    return this.each(function() {
      var $this = $(this);
      $this.on(end, function(){
        $this.off(end);
        return callback.call(this);
      });
    });
  };

  $.fn.animsition = function(method){
    if ( __[method] ) {
      return __[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return __.init.apply( this, arguments );
    } else {
      $.error( 'Method ' +  method + ' does not exist on jQuery.'+namespace);
    }
  };

}));
/*!
 * jQuery Mousewheel 3.1.13
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 */


(function (factory) {
    if ( typeof define === 'function' && define.amd ) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node/CommonJS style for Browserify
        module.exports = factory;
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {

    var toFix  = ['wheel', 'mousewheel', 'DOMMouseScroll', 'MozMousePixelScroll'],
        toBind = ( 'onwheel' in document || document.documentMode >= 9 ) ?
                    ['wheel'] : ['mousewheel', 'DomMouseScroll', 'MozMousePixelScroll'],
        slice  = Array.prototype.slice,
        nullLowestDeltaTimeout, lowestDelta;

    if ( $.event.fixHooks ) {
        for ( var i = toFix.length; i; ) {
            $.event.fixHooks[ toFix[--i] ] = $.event.mouseHooks;
        }
    }

    var special = $.event.special.mousewheel = {
        version: '3.1.12',

        setup: function() {
            if ( this.addEventListener ) {
                for ( var i = toBind.length; i; ) {
                    this.addEventListener( toBind[--i], handler, false );
                }
            } else {
                this.onmousewheel = handler;
            }
            // Store the line height and page height for this particular element
            $.data(this, 'mousewheel-line-height', special.getLineHeight(this));
            $.data(this, 'mousewheel-page-height', special.getPageHeight(this));
        },

        teardown: function() {
            if ( this.removeEventListener ) {
                for ( var i = toBind.length; i; ) {
                    this.removeEventListener( toBind[--i], handler, false );
                }
            } else {
                this.onmousewheel = null;
            }
            // Clean up the data we added to the element
            $.removeData(this, 'mousewheel-line-height');
            $.removeData(this, 'mousewheel-page-height');
        },

        getLineHeight: function(elem) {
            var $elem = $(elem),
                $parent = $elem['offsetParent' in $.fn ? 'offsetParent' : 'parent']();
            if (!$parent.length) {
                $parent = $('body');
            }
            return parseInt($parent.css('fontSize'), 10) || parseInt($elem.css('fontSize'), 10) || 16;
        },

        getPageHeight: function(elem) {
            return $(elem).height();
        },

        settings: {
            adjustOldDeltas: true, // see shouldAdjustOldDeltas() below
            normalizeOffset: true  // calls getBoundingClientRect for each event
        }
    };

    $.fn.extend({
        mousewheel: function(fn) {
            return fn ? this.bind('mousewheel', fn) : this.trigger('mousewheel');
        },

        unmousewheel: function(fn) {
            return this.unbind('mousewheel', fn);
        }
    });


    function handler(event) {
        var orgEvent   = event || window.event,
            args       = slice.call(arguments, 1),
            delta      = 0,
            deltaX     = 0,
            deltaY     = 0,
            absDelta   = 0,
            offsetX    = 0,
            offsetY    = 0;
        event = $.event.fix(orgEvent);
        event.type = 'mousewheel';

        // Old school scrollwheel delta
        if ( 'detail'      in orgEvent ) { deltaY = orgEvent.detail * -1;      }
        if ( 'wheelDelta'  in orgEvent ) { deltaY = orgEvent.wheelDelta;       }
        if ( 'wheelDeltaY' in orgEvent ) { deltaY = orgEvent.wheelDeltaY;      }
        if ( 'wheelDeltaX' in orgEvent ) { deltaX = orgEvent.wheelDeltaX * -1; }

        // Firefox < 17 horizontal scrolling related to DOMMouseScroll event
        if ( 'axis' in orgEvent && orgEvent.axis === orgEvent.HORIZONTAL_AXIS ) {
            deltaX = deltaY * -1;
            deltaY = 0;
        }

        // Set delta to be deltaY or deltaX if deltaY is 0 for backwards compatabilitiy
        delta = deltaY === 0 ? deltaX : deltaY;

        // New school wheel delta (wheel event)
        if ( 'deltaY' in orgEvent ) {
            deltaY = orgEvent.deltaY * -1;
            delta  = deltaY;
        }
        if ( 'deltaX' in orgEvent ) {
            deltaX = orgEvent.deltaX;
            if ( deltaY === 0 ) { delta  = deltaX * -1; }
        }

        // No change actually happened, no reason to go any further
        if ( deltaY === 0 && deltaX === 0 ) { return; }

        // Need to convert lines and pages to pixels if we aren't already in pixels
        // There are three delta modes:
        //   * deltaMode 0 is by pixels, nothing to do
        //   * deltaMode 1 is by lines
        //   * deltaMode 2 is by pages
        if ( orgEvent.deltaMode === 1 ) {
            var lineHeight = $.data(this, 'mousewheel-line-height');
            delta  *= lineHeight;
            deltaY *= lineHeight;
            deltaX *= lineHeight;
        } else if ( orgEvent.deltaMode === 2 ) {
            var pageHeight = $.data(this, 'mousewheel-page-height');
            delta  *= pageHeight;
            deltaY *= pageHeight;
            deltaX *= pageHeight;
        }

        // Store lowest absolute delta to normalize the delta values
        absDelta = Math.max( Math.abs(deltaY), Math.abs(deltaX) );

        if ( !lowestDelta || absDelta < lowestDelta ) {
            lowestDelta = absDelta;

            // Adjust older deltas if necessary
            if ( shouldAdjustOldDeltas(orgEvent, absDelta) ) {
                lowestDelta /= 40;
            }
        }

        // Adjust older deltas if necessary
        if ( shouldAdjustOldDeltas(orgEvent, absDelta) ) {
            // Divide all the things by 40!
            delta  /= 40;
            deltaX /= 40;
            deltaY /= 40;
        }

        // Get a whole, normalized value for the deltas
        delta  = Math[ delta  >= 1 ? 'floor' : 'ceil' ](delta  / lowestDelta);
        deltaX = Math[ deltaX >= 1 ? 'floor' : 'ceil' ](deltaX / lowestDelta);
        deltaY = Math[ deltaY >= 1 ? 'floor' : 'ceil' ](deltaY / lowestDelta);

        // Normalise offsetX and offsetY properties
        if ( special.settings.normalizeOffset && this.getBoundingClientRect ) {
            var boundingRect = this.getBoundingClientRect();
            offsetX = event.clientX - boundingRect.left;
            offsetY = event.clientY - boundingRect.top;
        }

        // Add information to the event object
        event.deltaX = deltaX;
        event.deltaY = deltaY;
        event.deltaFactor = lowestDelta;
        event.offsetX = offsetX;
        event.offsetY = offsetY;
        // Go ahead and set deltaMode to 0 since we converted to pixels
        // Although this is a little odd since we overwrite the deltaX/Y
        // properties with normalized deltas.
        event.deltaMode = 0;

        // Add event and delta to the front of the arguments
        args.unshift(event, delta, deltaX, deltaY);

        // Clearout lowestDelta after sometime to better
        // handle multiple device types that give different
        // a different lowestDelta
        // Ex: trackpad = 3 and mouse wheel = 120
        if (nullLowestDeltaTimeout) { clearTimeout(nullLowestDeltaTimeout); }
        nullLowestDeltaTimeout = setTimeout(nullLowestDelta, 200);

        return ($.event.dispatch || $.event.handle).apply(this, args);
    }

    function nullLowestDelta() {
        lowestDelta = null;
    }

    function shouldAdjustOldDeltas(orgEvent, absDelta) {
        // If this is an older event and the delta is divisable by 120,
        // then we are assuming that the browser is treating this as an
        // older mouse wheel event and that we should divide the deltas
        // by 40 to try and get a more usable deltaFactor.
        // Side note, this actually impacts the reported scroll distance
        // in older browsers and can cause scrolling to be slower than native.
        // Turn this off by setting $.event.special.mousewheel.settings.adjustOldDeltas to false.
        return special.settings.adjustOldDeltas && orgEvent.type === 'mousewheel' && absDelta % 120 === 0;
    }

}));
/**
* jQuery asScrollbar v0.5.7
* https://github.com/amazingSurge/jquery-asScrollbar
*
* Copyright (c) amazingSurge
* Released under the LGPL-3.0 license
*/

(function(global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory);
  } else if (typeof exports !== 'undefined') {
    factory(require('jquery'));
  } else {
    var mod = {
      exports: {}
    };
    factory(global.jQuery);
    global.jqueryAsScrollbarEs = mod.exports;
  }
})(this, function(_jquery) {
  'use strict';

  var _jquery2 = _interopRequireDefault(_jquery);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule
      ? obj
      : {
          default: obj
        };
  }

  var _typeof =
    typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol'
      ? function(obj) {
          return typeof obj;
        }
      : function(obj) {
          return obj &&
          typeof Symbol === 'function' &&
          obj.constructor === Symbol &&
          obj !== Symbol.prototype
            ? 'symbol'
            : typeof obj;
        };

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError('Cannot call a class as a function');
    }
  }

  var _createClass = (function() {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ('value' in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function(Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  })();

  var DEFAULTS = {
    namespace: 'asScrollbar',

    skin: null,
    handleSelector: null,
    handleTemplate: '<div class="{{handle}}"></div>',

    barClass: null,
    handleClass: null,

    disabledClass: 'is-disabled',
    draggingClass: 'is-dragging',
    hoveringClass: 'is-hovering',

    direction: 'vertical',

    barLength: null,
    handleLength: null,

    minHandleLength: 30,
    maxHandleLength: null,

    mouseDrag: true,
    touchDrag: true,
    pointerDrag: true,
    clickMove: true,
    clickMoveStep: 0.3, // 0 - 1
    mousewheel: true,
    mousewheelSpeed: 50,

    keyboard: true,

    useCssTransforms3d: true,
    useCssTransforms: true,
    useCssTransitions: true,

    duration: '500',
    easing: 'ease' // linear, ease-in, ease-out, ease-in-out
  };

  var easingBezier = function easingBezier(mX1, mY1, mX2, mY2) {
    'use strict';

    var a = function a(aA1, aA2) {
      return 1.0 - 3.0 * aA2 + 3.0 * aA1;
    };

    var b = function b(aA1, aA2) {
      return 3.0 * aA2 - 6.0 * aA1;
    };

    var c = function c(aA1) {
      return 3.0 * aA1;
    };

    // Returns x(t) given t, x1, and x2, or y(t) given t, y1, and y2.
    var calcBezier = function calcBezier(aT, aA1, aA2) {
      return ((a(aA1, aA2) * aT + b(aA1, aA2)) * aT + c(aA1)) * aT;
    };

    // Returns dx/dt given t, x1, and x2, or dy/dt given t, y1, and y2.
    var getSlope = function getSlope(aT, aA1, aA2) {
      return 3.0 * a(aA1, aA2) * aT * aT + 2.0 * b(aA1, aA2) * aT + c(aA1);
    };

    var getTForX = function getTForX(aX) {
      // Newton raphson iteration
      var aGuessT = aX;
      for (var i = 0; i < 4; ++i) {
        var currentSlope = getSlope(aGuessT, mX1, mX2);
        if (currentSlope === 0.0) {
          return aGuessT;
        }
        var currentX = calcBezier(aGuessT, mX1, mX2) - aX;
        aGuessT -= currentX / currentSlope;
      }
      return aGuessT;
    };

    if (mX1 === mY1 && mX2 === mY2) {
      return {
        css: 'linear',
        fn: function fn(aX) {
          return aX;
        }
      };
    }

    return {
      css: 'cubic-bezier(' + mX1 + ',' + mY1 + ',' + mX2 + ',' + mY2 + ')',
      fn: function fn(aX) {
        return calcBezier(getTForX(aX), mY1, mY2);
      }
    };
  };

  var EASING = {
    ease: easingBezier(0.25, 0.1, 0.25, 1.0),
    linear: easingBezier(0.0, 0.0, 1.0, 1.0),
    'ease-in': easingBezier(0.42, 0.0, 1.0, 1.0),
    'ease-out': easingBezier(0.0, 0.0, 0.58, 1.0),
    'ease-in-out': easingBezier(0.42, 0.0, 0.58, 1.0)
  };

  if (!Date.now) {
    Date.now = function() {
      return new Date().getTime();
    };
  }

  var vendors = ['webkit', 'moz'];
  for (var i = 0; i < vendors.length && !window.requestAnimationFrame; ++i) {
    var vp = vendors[i];
    window.requestAnimationFrame = window[vp + 'RequestAnimationFrame'];
    window.cancelAnimationFrame =
      window[vp + 'CancelAnimationFrame'] ||
      window[vp + 'CancelRequestAnimationFrame'];
  }

  if (
    /iP(ad|hone|od).*OS (6|7|8)/.test(window.navigator.userAgent) ||
    !window.requestAnimationFrame ||
    !window.cancelAnimationFrame
  ) {
    var lastTime = 0;
    window.requestAnimationFrame = function(callback) {
      var now = getTime();
      var timePlus = 16;
      var nextTime = Math.max(lastTime + timePlus, now);
      return setTimeout(function() {
        callback((lastTime = nextTime));
      }, nextTime - now);
    };
    window.cancelAnimationFrame = clearTimeout;
  }

  function isPercentage(n) {
    return typeof n === 'string' && n.indexOf('%') !== -1;
  }

  function convertPercentageToFloat(n) {
    return parseFloat(n.slice(0, -1) / 100, 10);
  }

  function convertMatrixToArray(value) {
    if (value && value.substr(0, 6) === 'matrix') {
      return value
        .replace(/^.*\((.*)\)$/g, '$1')
        .replace(/px/g, '')
        .split(/, +/);
    }
    return false;
  }

  function getTime() {
    if (typeof window.performance !== 'undefined' && window.performance.now) {
      return window.performance.now();
    }
    return Date.now();
  }

  /**
   * Css features detect
   **/
  var support = {};

  (function(support) {
    /**
     * Borrowed from Owl carousel
     **/
    'use strict';

    var events = {
        transition: {
          end: {
            WebkitTransition: 'webkitTransitionEnd',
            MozTransition: 'transitionend',
            OTransition: 'oTransitionEnd',
            transition: 'transitionend'
          }
        },
        animation: {
          end: {
            WebkitAnimation: 'webkitAnimationEnd',
            MozAnimation: 'animationend',
            OAnimation: 'oAnimationEnd',
            animation: 'animationend'
          }
        }
      },
      prefixes = ['webkit', 'Moz', 'O', 'ms'],
      style = (0, _jquery2.default)('<support>').get(0).style,
      tests = {
        csstransforms: function csstransforms() {
          return Boolean(test('transform'));
        },
        csstransforms3d: function csstransforms3d() {
          return Boolean(test('perspective'));
        },
        csstransitions: function csstransitions() {
          return Boolean(test('transition'));
        },
        cssanimations: function cssanimations() {
          return Boolean(test('animation'));
        }
      };

    var test = function test(property, prefixed) {
      var result = false,
        upper = property.charAt(0).toUpperCase() + property.slice(1);

      if (style[property] !== undefined) {
        result = property;
      }
      if (!result) {
        _jquery2.default.each(prefixes, function(i, prefix) {
          if (style[prefix + upper] !== undefined) {
            result = '-' + prefix.toLowerCase() + '-' + upper;
            return false;
          }
          return true;
        });
      }

      if (prefixed) {
        return result;
      }
      if (result) {
        return true;
      }
      return false;
    };

    var prefixed = function prefixed(property) {
      return test(property, true);
    };

    if (tests.csstransitions()) {
      /*eslint no-new-wrappers: "off"*/
      support.transition = new String(prefixed('transition'));
      support.transition.end = events.transition.end[support.transition];
    }

    if (tests.cssanimations()) {
      /*eslint no-new-wrappers: "off"*/
      support.animation = new String(prefixed('animation'));
      support.animation.end = events.animation.end[support.animation];
    }

    if (tests.csstransforms()) {
      /*eslint no-new-wrappers: "off"*/
      support.transform = new String(prefixed('transform'));
      support.transform3d = tests.csstransforms3d();
    }

    if (
      'ontouchstart' in window ||
      (window.DocumentTouch && document instanceof window.DocumentTouch)
    ) {
      support.touch = true;
    } else {
      support.touch = false;
    }

    if (window.PointerEvent || window.MSPointerEvent) {
      support.pointer = true;
    } else {
      support.pointer = false;
    }

    support.prefixPointerEvent = function(pointerEvent) {
      return window.MSPointerEvent
        ? 'MSPointer' +
          pointerEvent.charAt(9).toUpperCase() +
          pointerEvent.substr(10)
        : pointerEvent;
    };
  })(support);

  var NAMESPACE$1 = 'asScrollbar';

  /**
   * Plugin constructor
   **/

  var asScrollbar = (function() {
    function asScrollbar(bar) {
      var options =
        arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      _classCallCheck(this, asScrollbar);

      this.$bar = (0, _jquery2.default)(bar);
      options = this.options = _jquery2.default.extend(
        {},
        DEFAULTS,
        options,
        this.$bar.data('options') || {}
      );
      bar.direction = this.options.direction;

      this.classes = {
        directionClass: options.namespace + '-' + options.direction,
        barClass: options.barClass ? options.barClass : options.namespace,
        handleClass: options.handleClass
          ? options.handleClass
          : options.namespace + '-handle'
      };

      if (this.options.direction === 'vertical') {
        this.attributes = {
          axis: 'Y',
          position: 'top',
          length: 'height',
          clientLength: 'clientHeight'
        };
      } else if (this.options.direction === 'horizontal') {
        this.attributes = {
          axis: 'X',
          position: 'left',
          length: 'width',
          clientLength: 'clientWidth'
        };
      }

      // Current state information.
      this._states = {};

      // Current state information for the drag operation.
      this._drag = {
        time: null,
        pointer: null
      };

      // Current timeout
      this._frameId = null;

      // Current handle position
      this.handlePosition = 0;

      this.easing = EASING[this.options.easing] || EASING.ease;

      this.init();
    }

    _createClass(
      asScrollbar,
      [
        {
          key: 'init',
          value: function init() {
            var options = this.options;

            this.$handle = this.$bar.find(this.options.handleSelector);
            if (this.$handle.length === 0) {
              this.$handle = (0, _jquery2.default)(
                options.handleTemplate.replace(
                  /\{\{handle\}\}/g,
                  this.classes.handleClass
                )
              ).appendTo(this.$bar);
            } else {
              this.$handle.addClass(this.classes.handleClass);
            }

            this.$bar
              .addClass(this.classes.barClass)
              .addClass(this.classes.directionClass)
              .attr('draggable', false);

            if (options.skin) {
              this.$bar.addClass(options.skin);
            }
            if (options.barLength !== null) {
              this.setBarLength(options.barLength);
            }

            if (options.handleLength !== null) {
              this.setHandleLength(options.handleLength);
            }

            this.updateLength();

            this.bindEvents();

            this.trigger('ready');
          }
        },
        {
          key: 'trigger',
          value: function trigger(eventType) {
            for (
              var _len = arguments.length,
                params = Array(_len > 1 ? _len - 1 : 0),
                _key = 1;
              _key < _len;
              _key++
            ) {
              params[_key - 1] = arguments[_key];
            }

            var data = [this].concat(params);

            // event
            this.$bar.trigger(NAMESPACE$1 + '::' + eventType, data);

            // callback
            eventType = eventType.replace(/\b\w+\b/g, function(word) {
              return word.substring(0, 1).toUpperCase() + word.substring(1);
            });
            var onFunction = 'on' + eventType;

            if (typeof this.options[onFunction] === 'function') {
              this.options[onFunction].apply(this, params);
            }
          }
        },
        {
          key: 'is',
          value: function is(state) {
            return this._states[state] && this._states[state] > 0;
          }
        },
        {
          key: 'enter',
          value: function enter(state) {
            if (this._states[state] === undefined) {
              this._states[state] = 0;
            }

            this._states[state]++;
          }
        },
        {
          key: 'leave',
          value: function leave(state) {
            this._states[state]--;
          }
        },
        {
          key: 'eventName',
          value: function eventName(events) {
            if (typeof events !== 'string' || events === '') {
              return '.' + this.options.namespace;
            }
            events = events.split(' ');

            var length = events.length;
            for (var _i = 0; _i < length; _i++) {
              events[_i] = events[_i] + '.' + this.options.namespace;
            }
            return events.join(' ');
          }
        },
        {
          key: 'bindEvents',
          value: function bindEvents() {
            var _this = this;

            if (this.options.mouseDrag) {
              this.$handle.on(
                this.eventName('mousedown'),
                _jquery2.default.proxy(this.onDragStart, this)
              );
              this.$handle.on(
                this.eventName('dragstart selectstart'),
                function() {
                  return false;
                }
              );
            }

            if (this.options.touchDrag && support.touch) {
              this.$handle.on(
                this.eventName('touchstart'),
                _jquery2.default.proxy(this.onDragStart, this)
              );
              this.$handle.on(
                this.eventName('touchcancel'),
                _jquery2.default.proxy(this.onDragEnd, this)
              );
            }

            if (this.options.pointerDrag && support.pointer) {
              this.$handle.on(
                this.eventName(support.prefixPointerEvent('pointerdown')),
                _jquery2.default.proxy(this.onDragStart, this)
              );
              this.$handle.on(
                this.eventName(support.prefixPointerEvent('pointercancel')),
                _jquery2.default.proxy(this.onDragEnd, this)
              );
            }

            if (this.options.clickMove) {
              this.$bar.on(
                this.eventName('mousedown'),
                _jquery2.default.proxy(this.onClick, this)
              );
            }

            if (this.options.mousewheel) {
              this.$bar.on('mousewheel', function(e) {
                var delta = void 0;
                if (_this.options.direction === 'vertical') {
                  delta = e.deltaFactor * e.deltaY;
                } else if (_this.options.direction === 'horizontal') {
                  delta = -1 * e.deltaFactor * e.deltaX;
                }
                var offset = _this.getHandlePosition();
                if (offset <= 0 && delta > 0) {
                  return true;
                } else if (offset >= _this.barLength && delta < 0) {
                  return true;
                }
                offset -= _this.options.mousewheelSpeed * delta;
                _this.move(offset, true);
                return false;
              });
            }

            this.$bar.on(this.eventName('mouseenter'), function() {
              _this.$bar.addClass(_this.options.hoveringClass);
              _this.enter('hovering');
              _this.trigger('hover');
            });

            this.$bar.on(this.eventName('mouseleave'), function() {
              _this.$bar.removeClass(_this.options.hoveringClass);

              if (!_this.is('hovering')) {
                return;
              }
              _this.leave('hovering');
              _this.trigger('hovered');
            });

            if (this.options.keyboard) {
              (0, _jquery2.default)(document).on(
                this.eventName('keydown'),
                function(e) {
                  if (e.isDefaultPrevented && e.isDefaultPrevented()) {
                    return;
                  }

                  if (!_this.is('hovering')) {
                    return;
                  }
                  var activeElement = document.activeElement;
                  // go deeper if element is a webcomponent
                  while (activeElement.shadowRoot) {
                    activeElement = activeElement.shadowRoot.activeElement;
                  }
                  if (
                    (0, _jquery2.default)(activeElement).is(
                      ':input,select,option,[contenteditable]'
                    )
                  ) {
                    return;
                  }
                  var by = 0,
                    to = null;

                  var down = 40,
                    end = 35,
                    home = 36,
                    left = 37,
                    pageDown = 34,
                    pageUp = 33,
                    right = 39,
                    spaceBar = 32,
                    up = 38;

                  var webkitDown = 63233,
                    webkitEnd = 63275,
                    webkitHome = 63273,
                    webkitLeft = 63234,
                    webkitPageDown = 63277,
                    webkitPageUp = 63276,
                    webkitRight = 63235,
                    webkitUp = 63232;

                  switch (e.which) {
                    case left: // left
                    case webkitUp:
                      by = -30;
                      break;
                    case up: // up
                    case webkitDown:
                      by = -30;
                      break;
                    case right: // right
                    case webkitLeft:
                      by = 30;
                      break;
                    case down: // down
                    case webkitRight:
                      by = 30;
                      break;
                    case pageUp: // page up
                    case webkitPageUp:
                      by = -90;
                      break;
                    case spaceBar: // space bar
                    case pageDown: // page down
                    case webkitPageDown:
                      by = -90;
                      break;
                    case end: // end
                    case webkitEnd:
                      to = '100%';
                      break;
                    case home: // home
                    case webkitHome:
                      to = 0;
                      break;
                    default:
                      return;
                  }

                  if (by || to !== null) {
                    if (by) {
                      _this.moveBy(by, true);
                    } else if (to !== null) {
                      _this.moveTo(to, true);
                    }
                    e.preventDefault();
                  }
                }
              );
            }
          }
        },
        {
          key: 'onClick',
          value: function onClick(event) {
            var num = 3;

            if (event.which === num) {
              return;
            }

            if (event.target === this.$handle[0]) {
              return;
            }

            this._drag.time = new Date().getTime();
            this._drag.pointer = this.pointer(event);

            var offset = this.$handle.offset();
            var distance = this.distance(
                {
                  x: offset.left,
                  y: offset.top
                },
                this._drag.pointer
              ),
              factor = 1;

            if (distance > 0) {
              distance -= this.handleLength;
            } else {
              distance = Math.abs(distance);
              factor = -1;
            }

            if (distance > this.barLength * this.options.clickMoveStep) {
              distance = this.barLength * this.options.clickMoveStep;
            }
            this.moveBy(factor * distance, true);
          }
        },
        {
          key: 'onDragStart',
          value: function onDragStart(event) {
            var _this2 = this;

            var num = 3;
            if (event.which === num) {
              return;
            }

            // this.$bar.toggleClass(this.options.draggingClass, event.type === 'mousedown');
            this.$bar.addClass(this.options.draggingClass);

            this._drag.time = new Date().getTime();
            this._drag.pointer = this.pointer(event);

            var callback = function callback() {
              _this2.enter('dragging');
              _this2.trigger('drag');
            };

            if (this.options.mouseDrag) {
              (0, _jquery2.default)(document).on(
                this.eventName('mouseup'),
                _jquery2.default.proxy(this.onDragEnd, this)
              );

              (0, _jquery2.default)(document).one(
                this.eventName('mousemove'),
                _jquery2.default.proxy(function() {
                  (0, _jquery2.default)(document).on(
                    _this2.eventName('mousemove'),
                    _jquery2.default.proxy(_this2.onDragMove, _this2)
                  );

                  callback();
                }, this)
              );
            }

            if (this.options.touchDrag && support.touch) {
              (0, _jquery2.default)(document).on(
                this.eventName('touchend'),
                _jquery2.default.proxy(this.onDragEnd, this)
              );

              (0, _jquery2.default)(document).one(
                this.eventName('touchmove'),
                _jquery2.default.proxy(function() {
                  (0, _jquery2.default)(document).on(
                    _this2.eventName('touchmove'),
                    _jquery2.default.proxy(_this2.onDragMove, _this2)
                  );

                  callback();
                }, this)
              );
            }

            if (this.options.pointerDrag && support.pointer) {
              (0, _jquery2.default)(document).on(
                this.eventName(support.prefixPointerEvent('pointerup')),
                _jquery2.default.proxy(this.onDragEnd, this)
              );

              (0, _jquery2.default)(document).one(
                this.eventName(support.prefixPointerEvent('pointermove')),
                _jquery2.default.proxy(function() {
                  (0, _jquery2.default)(document).on(
                    _this2.eventName(support.prefixPointerEvent('pointermove')),
                    _jquery2.default.proxy(_this2.onDragMove, _this2)
                  );

                  callback();
                }, this)
              );
            }

            (0, _jquery2.default)(document).on(
              this.eventName('blur'),
              _jquery2.default.proxy(this.onDragEnd, this)
            );
          }
        },
        {
          key: 'onDragMove',
          value: function onDragMove(event) {
            var distance = this.distance(
              this._drag.pointer,
              this.pointer(event)
            );

            if (!this.is('dragging')) {
              return;
            }

            event.preventDefault();
            this.moveBy(distance, true);
          }
        },
        {
          key: 'onDragEnd',
          value: function onDragEnd() {
            (0, _jquery2.default)(document).off(
              this.eventName(
                'mousemove mouseup touchmove touchend pointermove pointerup MSPointerMove MSPointerUp blur'
              )
            );

            this.$bar.removeClass(this.options.draggingClass);
            this.handlePosition = this.getHandlePosition();

            if (!this.is('dragging')) {
              return;
            }

            this.leave('dragging');
            this.trigger('dragged');
          }
        },
        {
          key: 'pointer',
          value: function pointer(event) {
            var result = {
              x: null,
              y: null
            };

            event = event.originalEvent || event || window.event;

            event =
              event.touches && event.touches.length
                ? event.touches[0]
                : event.changedTouches && event.changedTouches.length
                  ? event.changedTouches[0]
                  : event;

            if (event.pageX) {
              result.x = event.pageX;
              result.y = event.pageY;
            } else {
              result.x = event.clientX;
              result.y = event.clientY;
            }

            return result;
          }
        },
        {
          key: 'distance',
          value: function distance(first, second) {
            if (this.options.direction === 'vertical') {
              return second.y - first.y;
            }
            return second.x - first.x;
          }
        },
        {
          key: 'setBarLength',
          value: function setBarLength(length, update) {
            if (typeof length !== 'undefined') {
              this.$bar.css(this.attributes.length, length);
            }
            if (update !== false) {
              this.updateLength();
            }
          }
        },
        {
          key: 'setHandleLength',
          value: function setHandleLength(length, update) {
            if (typeof length !== 'undefined') {
              if (length < this.options.minHandleLength) {
                length = this.options.minHandleLength;
              } else if (
                this.options.maxHandleLength &&
                length > this.options.maxHandleLength
              ) {
                length = this.options.maxHandleLength;
              }
              this.$handle.css(this.attributes.length, length);

              if (update !== false) {
                this.updateLength(length);
              }
            }
          }
        },
        {
          key: 'updateLength',
          value: function updateLength(length, barLength) {
            if (typeof length !== 'undefined') {
              this.handleLength = length;
            } else {
              this.handleLength = this.getHandleLenght();
            }
            if (typeof barLength !== 'undefined') {
              this.barLength = barLength;
            } else {
              this.barLength = this.getBarLength();
            }
          }
        },
        {
          key: 'getBarLength',
          value: function getBarLength() {
            return this.$bar[0][this.attributes.clientLength];
          }
        },
        {
          key: 'getHandleLenght',
          value: function getHandleLenght() {
            return this.$handle[0][this.attributes.clientLength];
          }
        },
        {
          key: 'getHandlePosition',
          value: function getHandlePosition() {
            var value = void 0;

            if (this.options.useCssTransforms && support.transform) {
              value = convertMatrixToArray(this.$handle.css(support.transform));

              if (!value) {
                return 0;
              }

              if (this.attributes.axis === 'X') {
                value = value[12] || value[4];
              } else {
                value = value[13] || value[5];
              }
            } else {
              value = this.$handle.css(this.attributes.position);
            }

            return parseFloat(value.replace('px', ''));
          }
        },
        {
          key: 'makeHandlePositionStyle',
          value: function makeHandlePositionStyle(value) {
            var property = void 0,
              x = '0',
              y = '0';

            if (this.options.useCssTransforms && support.transform) {
              if (this.attributes.axis === 'X') {
                x = value + 'px';
              } else {
                y = value + 'px';
              }

              property = support.transform.toString();

              if (this.options.useCssTransforms3d && support.transform3d) {
                value = 'translate3d(' + x + ',' + y + ',0)';
              } else {
                value = 'translate(' + x + ',' + y + ')';
              }
            } else {
              property = this.attributes.position;
            }
            var temp = {};
            temp[property] = value;

            return temp;
          }
        },
        {
          key: 'setHandlePosition',
          value: function setHandlePosition(value) {
            var style = this.makeHandlePositionStyle(value);
            this.$handle.css(style);

            if (!this.is('dragging')) {
              this.handlePosition = parseFloat(value);
            }
          }
        },
        {
          key: 'moveTo',
          value: function moveTo(value, trigger, sync) {
            var type =
              typeof value === 'undefined' ? 'undefined' : _typeof(value);

            if (type === 'string') {
              if (isPercentage(value)) {
                value =
                  convertPercentageToFloat(value) *
                  (this.barLength - this.handleLength);
              }

              value = parseFloat(value);
              type = 'number';
            }

            if (type !== 'number') {
              return;
            }

            this.move(value, trigger, sync);
          }
        },
        {
          key: 'moveBy',
          value: function moveBy(value, trigger, sync) {
            var type =
              typeof value === 'undefined' ? 'undefined' : _typeof(value);

            if (type === 'string') {
              if (isPercentage(value)) {
                value =
                  convertPercentageToFloat(value) *
                  (this.barLength - this.handleLength);
              }

              value = parseFloat(value);
              type = 'number';
            }

            if (type !== 'number') {
              return;
            }

            this.move(this.handlePosition + value, trigger, sync);
          }
        },
        {
          key: 'move',
          value: function move(value, trigger, sync) {
            if (typeof value !== 'number' || this.is('disabled')) {
              return;
            }
            if (value < 0) {
              value = 0;
            } else if (value + this.handleLength > this.barLength) {
              value = this.barLength - this.handleLength;
            }

            if (!this.is('dragging') && sync !== true) {
              this.doMove(
                value,
                this.options.duration,
                this.options.easing,
                trigger
              );
            } else {
              this.setHandlePosition(value);

              if (trigger) {
                this.trigger(
                  'change',
                  value / (this.barLength - this.handleLength)
                );
              }
            }
          }
        },
        {
          key: 'doMove',
          value: function doMove(value, duration, easing, trigger) {
            var _this3 = this;

            var property = void 0;
            this.enter('moving');
            duration = duration ? duration : this.options.duration;
            easing = easing ? easing : this.options.easing;

            var style = this.makeHandlePositionStyle(value);
            for (property in style) {
              if ({}.hasOwnProperty.call(style, property)) {
                break;
              }
            }

            if (this.options.useCssTransitions && support.transition) {
              this.enter('transition');
              this.prepareTransition(property, duration, easing);

              this.$handle.one(support.transition.end, function() {
                _this3.$handle.css(support.transition, '');

                if (trigger) {
                  _this3.trigger(
                    'change',
                    value / (_this3.barLength - _this3.handleLength)
                  );
                }
                _this3.leave('transition');
                _this3.leave('moving');
              });

              this.setHandlePosition(value);
            } else {
              this.enter('animating');

              var startTime = getTime();
              var start = this.getHandlePosition();
              var end = value;

              var run = function run(time) {
                var percent = (time - startTime) / _this3.options.duration;

                if (percent > 1) {
                  percent = 1;
                }

                percent = _this3.easing.fn(percent);
                var scale = 10;
                var current = parseFloat(
                  start + percent * (end - start),
                  scale
                );
                _this3.setHandlePosition(current);

                if (trigger) {
                  _this3.trigger(
                    'change',
                    current / (_this3.barLength - _this3.handleLength)
                  );
                }

                if (percent === 1) {
                  window.cancelAnimationFrame(_this3._frameId);
                  _this3._frameId = null;

                  _this3.leave('animating');
                  _this3.leave('moving');
                } else {
                  _this3._frameId = window.requestAnimationFrame(run);
                }
              };

              this._frameId = window.requestAnimationFrame(run);
            }
          }
        },
        {
          key: 'prepareTransition',
          value: function prepareTransition(property, duration, easing, delay) {
            var temp = [];
            if (property) {
              temp.push(property);
            }
            if (duration) {
              if (_jquery2.default.isNumeric(duration)) {
                duration = duration + 'ms';
              }
              temp.push(duration);
            }
            if (easing) {
              temp.push(easing);
            } else {
              temp.push(this.easing.css);
            }
            if (delay) {
              temp.push(delay);
            }
            this.$handle.css(support.transition, temp.join(' '));
          }
        },
        {
          key: 'enable',
          value: function enable() {
            this._states.disabled = 0;

            this.$bar.removeClass(this.options.disabledClass);

            this.trigger('enable');
          }
        },
        {
          key: 'disable',
          value: function disable() {
            this._states.disabled = 1;

            this.$bar.addClass(this.options.disabledClass);

            this.trigger('disable');
          }
        },
        {
          key: 'destroy',
          value: function destroy() {
            this.$handle.removeClass(this.classes.handleClass);
            this.$bar
              .removeClass(this.classes.barClass)
              .removeClass(this.classes.directionClass)
              .attr('draggable', null);
            if (this.options.skin) {
              this.$bar.removeClass(this.options.skin);
            }
            this.$bar.off(this.eventName());
            this.$handle.off(this.eventName());

            this.trigger('destroy');
          }
        }
      ],
      [
        {
          key: 'registerEasing',
          value: function registerEasing(name) {
            for (
              var _len2 = arguments.length,
                args = Array(_len2 > 1 ? _len2 - 1 : 0),
                _key2 = 1;
              _key2 < _len2;
              _key2++
            ) {
              args[_key2 - 1] = arguments[_key2];
            }

            EASING[name] = easingBezier.apply(undefined, args);
          }
        },
        {
          key: 'getEasing',
          value: function getEasing(name) {
            return EASING[name];
          }
        },
        {
          key: 'setDefaults',
          value: function setDefaults(options) {
            _jquery2.default.extend(
              DEFAULTS,
              _jquery2.default.isPlainObject(options) && options
            );
          }
        }
      ]
    );

    return asScrollbar;
  })();

  var info = {
    version: '0.5.7'
  };

  var NAMESPACE = 'asScrollbar';
  var OtherAsScrollbar = _jquery2.default.fn.asScrollbar;

  var jQueryAsScrollbar = function jQueryAsScrollbar(options) {
    for (
      var _len3 = arguments.length,
        args = Array(_len3 > 1 ? _len3 - 1 : 0),
        _key3 = 1;
      _key3 < _len3;
      _key3++
    ) {
      args[_key3 - 1] = arguments[_key3];
    }

    if (typeof options === 'string') {
      var method = options;

      if (/^_/.test(method)) {
        return false;
      } else if (/^(get)/.test(method)) {
        var instance = this.first().data(NAMESPACE);
        if (instance && typeof instance[method] === 'function') {
          return instance[method].apply(instance, args);
        }
      } else {
        return this.each(function() {
          var instance = _jquery2.default.data(this, NAMESPACE);
          if (instance && typeof instance[method] === 'function') {
            instance[method].apply(instance, args);
          }
        });
      }
    }

    return this.each(function() {
      if (!(0, _jquery2.default)(this).data(NAMESPACE)) {
        (0, _jquery2.default)(this).data(
          NAMESPACE,
          new asScrollbar(this, options)
        );
      }
    });
  };

  _jquery2.default.fn.asScrollbar = jQueryAsScrollbar;

  _jquery2.default.asScrollbar = _jquery2.default.extend(
    {
      setDefaults: asScrollbar.setDefaults,
      registerEasing: asScrollbar.registerEasing,
      getEasing: asScrollbar.getEasing,
      noConflict: function noConflict() {
        _jquery2.default.fn.asScrollbar = OtherAsScrollbar;
        return jQueryAsScrollbar;
      }
    },
    info
  );
});
/**
* jQuery asScrollable v0.4.10
* https://github.com/amazingSurge/jquery-asScrollable
*
* Copyright (c) amazingSurge
* Released under the LGPL-3.0 license
*/

(function(global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory);
  } else if (typeof exports !== 'undefined') {
    factory(require('jquery'));
  } else {
    var mod = {
      exports: {}
    };
    factory(global.jQuery);
    global.jqueryAsScrollableEs = mod.exports;
  }
})(this, function(_jquery) {
  'use strict';

  var _jquery2 = _interopRequireDefault(_jquery);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule
      ? obj
      : {
          default: obj
        };
  }

  var _typeof =
    typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol'
      ? function(obj) {
          return typeof obj;
        }
      : function(obj) {
          return obj &&
          typeof Symbol === 'function' &&
          obj.constructor === Symbol &&
          obj !== Symbol.prototype
            ? 'symbol'
            : typeof obj;
        };

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError('Cannot call a class as a function');
    }
  }

  var _createClass = (function() {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ('value' in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function(Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  })();

  var DEFAULTS = {
    namespace: 'asScrollable',

    skin: null,

    contentSelector: null,
    containerSelector: null,

    enabledClass: 'is-enabled',
    disabledClass: 'is-disabled',

    draggingClass: 'is-dragging',
    hoveringClass: 'is-hovering',
    scrollingClass: 'is-scrolling',

    direction: 'vertical', // vertical, horizontal, both, auto

    showOnHover: true,
    showOnBarHover: false,

    duration: 500,
    easing: 'ease-in', // linear, ease, ease-in, ease-out, ease-in-out

    responsive: true,
    throttle: 20,

    scrollbar: {}
  };

  function getTime() {
    if (typeof window.performance !== 'undefined' && window.performance.now) {
      return window.performance.now();
    }
    return Date.now();
  }

  function isPercentage(n) {
    return typeof n === 'string' && n.indexOf('%') !== -1;
  }

  function conventToPercentage(n) {
    if (n < 0) {
      n = 0;
    } else if (n > 1) {
      n = 1;
    }
    return parseFloat(n).toFixed(4) * 100 + '%';
  }

  function convertPercentageToFloat(n) {
    return parseFloat(n.slice(0, -1) / 100, 10);
  }

  var isFFLionScrollbar = (function() {
    'use strict';

    var isOSXFF = void 0,
      ua = void 0,
      version = void 0;
    ua = window.navigator.userAgent;
    isOSXFF = /(?=.+Mac OS X)(?=.+Firefox)/.test(ua);
    if (!isOSXFF) {
      return false;
    }
    version = /Firefox\/\d{2}\./.exec(ua);
    if (version) {
      version = version[0].replace(/\D+/g, '');
    }
    return isOSXFF && +version > 23;
  })();

  var NAMESPACE$1 = 'asScrollable';

  var instanceId = 0;

  var AsScrollable = (function() {
    function AsScrollable(element, options) {
      _classCallCheck(this, AsScrollable);

      this.$element = (0, _jquery2.default)(element);
      options = this.options = _jquery2.default.extend(
        {},
        DEFAULTS,
        options || {},
        this.$element.data('options') || {}
      );

      this.classes = {
        wrap: options.namespace,
        content: options.namespace + '-content',
        container: options.namespace + '-container',
        bar: options.namespace + '-bar',
        barHide: options.namespace + '-bar-hide',
        skin: options.skin
      };

      this.attributes = {
        vertical: {
          axis: 'Y',
          overflow: 'overflow-y',

          scroll: 'scrollTop',
          scrollLength: 'scrollHeight',
          pageOffset: 'pageYOffset',

          ffPadding: 'padding-right',

          length: 'height',
          clientLength: 'clientHeight',
          offset: 'offsetHeight',

          crossLength: 'width',
          crossClientLength: 'clientWidth',
          crossOffset: 'offsetWidth'
        },
        horizontal: {
          axis: 'X',
          overflow: 'overflow-x',

          scroll: 'scrollLeft',
          scrollLength: 'scrollWidth',
          pageOffset: 'pageXOffset',

          ffPadding: 'padding-bottom',

          length: 'width',
          clientLength: 'clientWidth',
          offset: 'offsetWidth',

          crossLength: 'height',
          crossClientLength: 'clientHeight',
          crossOffset: 'offsetHeight'
        }
      };

      // Current state information.
      this._states = {};

      // Supported direction
      this.horizontal = null;
      this.vertical = null;

      this.$bar = null;

      // Current timeout
      this._frameId = null;
      this._timeoutId = null;

      this.instanceId = ++instanceId;

      this.easing =
        _jquery2.default.asScrollbar.getEasing(this.options.easing) ||
        _jquery2.default.asScrollbar.getEasing('ease');

      this.init();
    }

    _createClass(
      AsScrollable,
      [
        {
          key: 'init',
          value: function init() {
            var position = this.$element.css('position');

            if (this.options.containerSelector) {
              this.$container = this.$element.find(
                this.options.containerSelector
              );
              this.$wrap = this.$element;

              if (position === 'static') {
                this.$wrap.css('position', 'relative');
              }
            } else {
              this.$container = this.$element.wrap('<div>');
              this.$wrap = this.$container.parent();
              this.$wrap.height(this.$element.height());

              if (position !== 'static') {
                this.$wrap.css('position', position);
              } else {
                this.$wrap.css('position', 'relative');
              }
            }

            if (this.options.contentSelector) {
              this.$content = this.$container.find(
                this.options.contentSelector
              );
            } else {
              this.$content = this.$container.wrap('<div>');
              this.$container = this.$content.parent();
            }

            switch (this.options.direction) {
              case 'vertical': {
                this.vertical = true;
                break;
              }
              case 'horizontal': {
                this.horizontal = true;
                break;
              }
              case 'both': {
                this.horizontal = true;
                this.vertical = true;
                break;
              }
              case 'auto': {
                var overflowX = this.$element.css('overflow-x'),
                  overflowY = this.$element.css('overflow-y');

                if (overflowX === 'scroll' || overflowX === 'auto') {
                  this.horizontal = true;
                }
                if (overflowY === 'scroll' || overflowY === 'auto') {
                  this.vertical = true;
                }
                break;
              }
              default: {
                break;
              }
            }

            if (!this.vertical && !this.horizontal) {
              return;
            }

            this.$wrap.addClass(this.classes.wrap);
            this.$container.addClass(this.classes.container);
            this.$content.addClass(this.classes.content);

            if (this.options.skin) {
              this.$wrap.addClass(this.classes.skin);
            }

            this.$wrap.addClass(this.options.enabledClass);

            if (this.vertical) {
              this.$wrap.addClass(this.classes.wrap + '-vertical');
              this.initLayout('vertical');
              this.createBar('vertical');
            }

            if (this.horizontal) {
              this.$wrap.addClass(this.classes.wrap + '-horizontal');
              this.initLayout('horizontal');
              this.createBar('horizontal');
            }

            this.bindEvents();

            this.trigger('ready');
          }
        },
        {
          key: 'bindEvents',
          value: function bindEvents() {
            var _this = this;

            if (this.options.responsive) {
              (0, _jquery2.default)(window).on(
                this.eventNameWithId('orientationchange'),
                function() {
                  _this.update();
                }
              );
              (0, _jquery2.default)(window).on(
                this.eventNameWithId('resize'),
                this.throttle(function() {
                  _this.update();
                }, this.options.throttle)
              );
            }

            if (!this.horizontal && !this.vertical) {
              return;
            }

            var that = this;

            this.$wrap.on(this.eventName('mouseenter'), function() {
              that.$wrap.addClass(_this.options.hoveringClass);
              that.enter('hovering');
              that.trigger('hover');
            });

            this.$wrap.on(this.eventName('mouseleave'), function() {
              that.$wrap.removeClass(_this.options.hoveringClass);

              if (!that.is('hovering')) {
                return;
              }
              that.leave('hovering');
              that.trigger('hovered');
            });

            if (this.options.showOnHover) {
              if (this.options.showOnBarHover) {
                this.$bar
                  .on('asScrollbar::hover', function() {
                    if (that.horizontal) {
                      that.showBar('horizontal');
                    }
                    if (that.vertical) {
                      that.showBar('vertical');
                    }
                  })
                  .on('asScrollbar::hovered', function() {
                    if (that.horizontal) {
                      that.hideBar('horizontal');
                    }
                    if (that.vertical) {
                      that.hideBar('vertical');
                    }
                  });
              } else {
                this.$element.on(
                  NAMESPACE$1 + '::hover',
                  _jquery2.default.proxy(this.showBar, this)
                );
                this.$element.on(
                  NAMESPACE$1 + '::hovered',
                  _jquery2.default.proxy(this.hideBar, this)
                );
              }
            }

            this.$container.on(this.eventName('scroll'), function() {
              if (that.horizontal) {
                var oldLeft = that.offsetLeft;
                that.offsetLeft = that.getOffset('horizontal');

                if (oldLeft !== that.offsetLeft) {
                  that.trigger(
                    'scroll',
                    that.getPercentOffset('horizontal'),
                    'horizontal'
                  );

                  if (that.offsetLeft === 0) {
                    that.trigger('scrolltop', 'horizontal');
                  }
                  if (that.offsetLeft === that.getScrollLength('horizontal')) {
                    that.trigger('scrollend', 'horizontal');
                  }
                }
              }

              if (that.vertical) {
                var oldTop = that.offsetTop;

                that.offsetTop = that.getOffset('vertical');

                if (oldTop !== that.offsetTop) {
                  that.trigger(
                    'scroll',
                    that.getPercentOffset('vertical'),
                    'vertical'
                  );

                  if (that.offsetTop === 0) {
                    that.trigger('scrolltop', 'vertical');
                  }
                  if (that.offsetTop === that.getScrollLength('vertical')) {
                    that.trigger('scrollend', 'vertical');
                  }
                }
              }
            });

            this.$element.on(NAMESPACE$1 + '::scroll', function(
              e,
              api,
              value,
              direction
            ) {
              if (!that.is('scrolling')) {
                that.enter('scrolling');
                that.$wrap.addClass(that.options.scrollingClass);
              }
              var bar = api.getBarApi(direction);

              bar.moveTo(conventToPercentage(value), false, true);

              clearTimeout(that._timeoutId);
              that._timeoutId = setTimeout(function() {
                that.$wrap.removeClass(that.options.scrollingClass);
                that.leave('scrolling');
              }, 200);
            });

            this.$bar.on('asScrollbar::change', function(e, api, value) {
              if (typeof e.target.direction === 'string') {
                that.scrollTo(
                  e.target.direction,
                  conventToPercentage(value),
                  false,
                  true
                );
              }
            });

            this.$bar
              .on('asScrollbar::drag', function() {
                that.$wrap.addClass(that.options.draggingClass);
              })
              .on('asScrollbar::dragged', function() {
                that.$wrap.removeClass(that.options.draggingClass);
              });
          }
        },
        {
          key: 'unbindEvents',
          value: function unbindEvents() {
            this.$wrap.off(this.eventName());
            this.$element
              .off(NAMESPACE$1 + '::scroll')
              .off(NAMESPACE$1 + '::hover')
              .off(NAMESPACE$1 + '::hovered');
            this.$container.off(this.eventName());
            (0, _jquery2.default)(window).off(this.eventNameWithId());
          }
        },
        {
          key: 'initLayout',
          value: function initLayout(direction) {
            if (direction === 'vertical') {
              this.$container.css('height', this.$wrap.height());
            }
            var attributes = this.attributes[direction],
              container = this.$container[0];

            // this.$container.css(attributes.overflow, 'scroll');

            var parentLength =
                container.parentNode[attributes.crossClientLength],
              scrollbarWidth = this.getBrowserScrollbarWidth(direction);

            this.$content.css(attributes.crossLength, parentLength + 'px');
            this.$container.css(
              attributes.crossLength,
              scrollbarWidth + parentLength + 'px'
            );

            if (scrollbarWidth === 0 && isFFLionScrollbar) {
              this.$container.css(attributes.ffPadding, 16);
            }
          }
        },
        {
          key: 'createBar',
          value: function createBar(direction) {
            var options = _jquery2.default.extend(this.options.scrollbar, {
              namespace: this.classes.bar,
              direction: direction,
              useCssTransitions: false,
              keyboard: false
            });
            var $bar = (0, _jquery2.default)('<div>');
            $bar.asScrollbar(options);

            if (this.options.showOnHover) {
              $bar.addClass(this.classes.barHide);
            }

            $bar.appendTo(this.$wrap);

            this['$' + direction] = $bar;

            if (this.$bar === null) {
              this.$bar = $bar;
            } else {
              this.$bar = this.$bar.add($bar);
            }

            this.updateBarHandle(direction);
          }
        },
        {
          key: 'trigger',
          value: function trigger(eventType) {
            for (
              var _len = arguments.length,
                params = Array(_len > 1 ? _len - 1 : 0),
                _key = 1;
              _key < _len;
              _key++
            ) {
              params[_key - 1] = arguments[_key];
            }

            var data = [this].concat(params);

            // event
            this.$element.trigger(NAMESPACE$1 + '::' + eventType, data);

            // callback
            eventType = eventType.replace(/\b\w+\b/g, function(word) {
              return word.substring(0, 1).toUpperCase() + word.substring(1);
            });
            var onFunction = 'on' + eventType;

            if (typeof this.options[onFunction] === 'function') {
              this.options[onFunction].apply(this, params);
            }
          }
        },
        {
          key: 'is',
          value: function is(state) {
            return this._states[state] && this._states[state] > 0;
          }
        },
        {
          key: 'enter',
          value: function enter(state) {
            if (this._states[state] === undefined) {
              this._states[state] = 0;
            }

            // this._states[state]++;
            this._states[state] = 1;
          }
        },
        {
          key: 'leave',
          value: function leave(state) {
            // this._states[state]--;

            this._states[state] = -1;
          }
        },
        {
          key: 'eventName',
          value: function eventName(events) {
            if (typeof events !== 'string' || events === '') {
              return '.' + this.options.namespace;
            }

            events = events.split(' ');
            var length = events.length;
            for (var i = 0; i < length; i++) {
              events[i] = events[i] + '.' + this.options.namespace;
            }
            return events.join(' ');
          }
        },
        {
          key: 'eventNameWithId',
          value: function eventNameWithId(events) {
            if (typeof events !== 'string' || events === '') {
              return '.' + this.options.namespace + '-' + this.instanceId;
            }

            events = events.split(' ');
            var length = events.length;
            for (var i = 0; i < length; i++) {
              events[i] =
                events[i] +
                '.' +
                this.options.namespace +
                '-' +
                this.instanceId;
            }
            return events.join(' ');
          }
        },
        {
          key: 'throttle',
          value: function throttle(func, wait) {
            var _this2 = this;

            var _now =
              Date.now ||
              function() {
                return new Date().getTime();
              };

            var timeout = void 0;
            var context = void 0;
            var args = void 0;
            var result = void 0;
            var previous = 0;
            var later = function later() {
              previous = _now();
              timeout = null;
              result = func.apply(context, args);
              if (!timeout) {
                context = args = null;
              }
            };

            return function() {
              for (
                var _len2 = arguments.length, params = Array(_len2), _key2 = 0;
                _key2 < _len2;
                _key2++
              ) {
                params[_key2] = arguments[_key2];
              }

              /*eslint consistent-this: "off"*/
              var now = _now();
              var remaining = wait - (now - previous);
              context = _this2;
              args = params;
              if (remaining <= 0 || remaining > wait) {
                if (timeout) {
                  clearTimeout(timeout);
                  timeout = null;
                }
                previous = now;
                result = func.apply(context, args);
                if (!timeout) {
                  context = args = null;
                }
              } else if (!timeout) {
                timeout = setTimeout(later, remaining);
              }
              return result;
            };
          }
        },
        {
          key: 'getBrowserScrollbarWidth',
          value: function getBrowserScrollbarWidth(direction) {
            var attributes = this.attributes[direction],
              outer = void 0,
              outerStyle = void 0;
            if (attributes.scrollbarWidth) {
              return attributes.scrollbarWidth;
            }
            outer = document.createElement('div');
            outerStyle = outer.style;
            outerStyle.position = 'absolute';
            outerStyle.width = '100px';
            outerStyle.height = '100px';
            outerStyle.overflow = 'scroll';
            outerStyle.top = '-9999px';
            document.body.appendChild(outer);
            attributes.scrollbarWidth =
              outer[attributes.offset] - outer[attributes.clientLength];
            document.body.removeChild(outer);
            return attributes.scrollbarWidth;
          }
        },
        {
          key: 'getOffset',
          value: function getOffset(direction) {
            var attributes = this.attributes[direction],
              container = this.$container[0];

            return (
              container[attributes.pageOffset] || container[attributes.scroll]
            );
          }
        },
        {
          key: 'getPercentOffset',
          value: function getPercentOffset(direction) {
            return this.getOffset(direction) / this.getScrollLength(direction);
          }
        },
        {
          key: 'getContainerLength',
          value: function getContainerLength(direction) {
            return this.$container[0][this.attributes[direction].clientLength];
          }
        },
        {
          key: 'getScrollLength',
          value: function getScrollLength(direction) {
            var scrollLength = this.$content[0][
              this.attributes[direction].scrollLength
            ];
            return scrollLength - this.getContainerLength(direction);
          }
        },
        {
          key: 'scrollTo',
          value: function scrollTo(direction, value, trigger, sync) {
            var type =
              typeof value === 'undefined' ? 'undefined' : _typeof(value);

            if (type === 'string') {
              if (isPercentage(value)) {
                value =
                  convertPercentageToFloat(value) *
                  this.getScrollLength(direction);
              }

              value = parseFloat(value);
              type = 'number';
            }

            if (type !== 'number') {
              return;
            }

            this.move(direction, value, trigger, sync);
          }
        },
        {
          key: 'scrollBy',
          value: function scrollBy(direction, value, trigger, sync) {
            var type =
              typeof value === 'undefined' ? 'undefined' : _typeof(value);

            if (type === 'string') {
              if (isPercentage(value)) {
                value =
                  convertPercentageToFloat(value) *
                  this.getScrollLength(direction);
              }

              value = parseFloat(value);
              type = 'number';
            }

            if (type !== 'number') {
              return;
            }

            this.move(
              direction,
              this.getOffset(direction) + value,
              trigger,
              sync
            );
          }
        },
        {
          key: 'move',
          value: function move(direction, value, trigger, sync) {
            if (this[direction] !== true || typeof value !== 'number') {
              return;
            }

            this.enter('moving');

            if (value < 0) {
              value = 0;
            } else if (value > this.getScrollLength(direction)) {
              value = this.getScrollLength(direction);
            }

            var attributes = this.attributes[direction];

            var that = this;
            var callback = function callback() {
              that.leave('moving');
            };

            if (sync) {
              this.$container[0][attributes.scroll] = value;

              if (trigger !== false) {
                this.trigger(
                  'change',
                  value / this.getScrollLength(direction),
                  direction
                );
              }
              callback();
            } else {
              this.enter('animating');

              var startTime = getTime();
              var start = this.getOffset(direction);
              var end = value;

              var run = function run(time) {
                var percent = (time - startTime) / that.options.duration;

                if (percent > 1) {
                  percent = 1;
                }

                percent = that.easing.fn(percent);

                var current = parseFloat(start + percent * (end - start), 10);
                that.$container[0][attributes.scroll] = current;

                if (trigger !== false) {
                  that.trigger(
                    'change',
                    value / that.getScrollLength(direction),
                    direction
                  );
                }

                if (percent === 1) {
                  window.cancelAnimationFrame(that._frameId);
                  that._frameId = null;

                  that.leave('animating');
                  callback();
                } else {
                  that._frameId = window.requestAnimationFrame(run);
                }
              };

              this._frameId = window.requestAnimationFrame(run);
            }
          }
        },
        {
          key: 'scrollXto',
          value: function scrollXto(value, trigger, sync) {
            return this.scrollTo('horizontal', value, trigger, sync);
          }
        },
        {
          key: 'scrollYto',
          value: function scrollYto(value, trigger, sync) {
            return this.scrollTo('vertical', value, trigger, sync);
          }
        },
        {
          key: 'scrollXby',
          value: function scrollXby(value, trigger, sync) {
            return this.scrollBy('horizontal', value, trigger, sync);
          }
        },
        {
          key: 'scrollYby',
          value: function scrollYby(value, trigger, sync) {
            return this.scrollBy('vertical', value, trigger, sync);
          }
        },
        {
          key: 'getBar',
          value: function getBar(direction) {
            if (direction && this['$' + direction]) {
              return this['$' + direction];
            }
            return this.$bar;
          }
        },
        {
          key: 'getBarApi',
          value: function getBarApi(direction) {
            return this.getBar(direction).data('asScrollbar');
          }
        },
        {
          key: 'getBarX',
          value: function getBarX() {
            return this.getBar('horizontal');
          }
        },
        {
          key: 'getBarY',
          value: function getBarY() {
            return this.getBar('vertical');
          }
        },
        {
          key: 'showBar',
          value: function showBar(direction) {
            this.getBar(direction).removeClass(this.classes.barHide);
          }
        },
        {
          key: 'hideBar',
          value: function hideBar(direction) {
            this.getBar(direction).addClass(this.classes.barHide);
          }
        },
        {
          key: 'updateBarHandle',
          value: function updateBarHandle(direction) {
            var api = this.getBarApi(direction);

            if (!api) {
              return;
            }

            var containerLength = this.getContainerLength(direction),
              scrollLength = this.getScrollLength(direction);

            if (scrollLength > 0) {
              if (api.is('disabled')) {
                api.enable();
              }
              api.setHandleLength(
                api.getBarLength() *
                  containerLength /
                  (scrollLength + containerLength),
                true
              );
            } else {
              api.disable();
            }
          }
        },
        {
          key: 'disable',
          value: function disable() {
            if (!this.is('disabled')) {
              this.enter('disabled');
              this.$wrap
                .addClass(this.options.disabledClass)
                .removeClass(this.options.enabledClass);

              this.unbindEvents();
              this.unStyle();
            }

            this.trigger('disable');
          }
        },
        {
          key: 'enable',
          value: function enable() {
            if (this.is('disabled')) {
              this.leave('disabled');
              this.$wrap
                .addClass(this.options.enabledClass)
                .removeClass(this.options.disabledClass);

              this.bindEvents();
              this.update();
            }

            this.trigger('enable');
          }
        },
        {
          key: 'update',
          value: function update() {
            if (this.is('disabled')) {
              return;
            }
            if (this.$element.is(':visible')) {
              if (this.vertical) {
                this.initLayout('vertical');
                this.updateBarHandle('vertical');
              }
              if (this.horizontal) {
                this.initLayout('horizontal');
                this.updateBarHandle('horizontal');
              }
            }
          }
        },
        {
          key: 'unStyle',
          value: function unStyle() {
            if (this.horizontal) {
              this.$container.css({
                height: '',
                'padding-bottom': ''
              });
              this.$content.css({
                height: ''
              });
            }
            if (this.vertical) {
              this.$container.css({
                width: '',
                height: '',
                'padding-right': ''
              });
              this.$content.css({
                width: ''
              });
            }
            if (!this.options.containerSelector) {
              this.$wrap.css({
                height: ''
              });
            }
          }
        },
        {
          key: 'destroy',
          value: function destroy() {
            this.$wrap
              .removeClass(this.classes.wrap + '-vertical')
              .removeClass(this.classes.wrap + '-horizontal')
              .removeClass(this.classes.wrap)
              .removeClass(this.options.enabledClass)
              .removeClass(this.classes.disabledClass);
            this.unStyle();

            if (this.$bar) {
              this.$bar.remove();
            }

            this.unbindEvents();

            if (this.options.containerSelector) {
              this.$container.removeClass(this.classes.container);
            } else {
              this.$container.unwrap();
            }
            if (!this.options.contentSelector) {
              this.$content.unwrap();
            }
            this.$content.removeClass(this.classes.content);
            this.$element.data(NAMESPACE$1, null);
            this.trigger('destroy');
          }
        }
      ],
      [
        {
          key: 'setDefaults',
          value: function setDefaults(options) {
            _jquery2.default.extend(
              DEFAULTS,
              _jquery2.default.isPlainObject(options) && options
            );
          }
        }
      ]
    );

    return AsScrollable;
  })();

  var info = {
    version: '0.4.10'
  };

  var NAMESPACE = 'asScrollable';
  var OtherAsScrollable = _jquery2.default.fn.asScrollable;

  var jQueryAsScrollable = function jQueryAsScrollable(options) {
    for (
      var _len3 = arguments.length,
        args = Array(_len3 > 1 ? _len3 - 1 : 0),
        _key3 = 1;
      _key3 < _len3;
      _key3++
    ) {
      args[_key3 - 1] = arguments[_key3];
    }

    if (typeof options === 'string') {
      var method = options;

      if (/^_/.test(method)) {
        return false;
      } else if (/^(get)/.test(method)) {
        var instance = this.first().data(NAMESPACE);
        if (instance && typeof instance[method] === 'function') {
          return instance[method].apply(instance, args);
        }
      } else {
        return this.each(function() {
          var instance = _jquery2.default.data(this, NAMESPACE);
          if (instance && typeof instance[method] === 'function') {
            instance[method].apply(instance, args);
          }
        });
      }
    }

    return this.each(function() {
      if (!(0, _jquery2.default)(this).data(NAMESPACE)) {
        (0, _jquery2.default)(this).data(
          NAMESPACE,
          new AsScrollable(this, options)
        );
      }
    });
  };

  _jquery2.default.fn.asScrollable = jQueryAsScrollable;

  _jquery2.default.asScrollable = _jquery2.default.extend(
    {
      setDefaults: AsScrollable.setDefaults,
      noConflict: function noConflict() {
        _jquery2.default.fn.asScrollable = OtherAsScrollable;
        return jQueryAsScrollable;
      }
    },
    info
  );
});
/**
* jQuery asHoverScroll v0.3.6
* https://github.com/amazingSurge/jquery-asHoverScroll
*
* Copyright (c) amazingSurge
* Released under the LGPL-3.0 license
*/

(function(global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory);
  } else if (typeof exports !== 'undefined') {
    factory(require('jquery'));
  } else {
    var mod = {
      exports: {}
    };
    factory(global.jQuery);
    global.jqueryAsHoverScrollEs = mod.exports;
  }
})(this, function(_jquery) {
  'use strict';

  var _jquery2 = _interopRequireDefault(_jquery);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule
      ? obj
      : {
          default: obj
        };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError('Cannot call a class as a function');
    }
  }

  var _createClass = (function() {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ('value' in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function(Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  })();

  var DEFAULTS = {
    namespace: 'asHoverScroll',

    list: '> ul',
    item: '> li',
    exception: null,

    direction: 'vertical',
    fixed: false,

    mouseMove: true,
    touchScroll: true,
    pointerScroll: true,

    useCssTransforms: true,
    useCssTransforms3d: true,
    boundary: 10,

    throttle: 20,

    onEnter: function onEnter() {
      $(this)
        .siblings()
        .removeClass('is-active');
      $(this).addClass('is-active');
    },
    onLeave: function onLeave() {
      $(this).removeClass('is-active');
    }
  };

  /**
   * Css features detect
   **/
  var support = {};

  (function(support) {
    /**
     * Borrowed from Owl carousel
     **/
    'use strict';

    var events = {
        transition: {
          end: {
            WebkitTransition: 'webkitTransitionEnd',
            MozTransition: 'transitionend',
            OTransition: 'oTransitionEnd',
            transition: 'transitionend'
          }
        },
        animation: {
          end: {
            WebkitAnimation: 'webkitAnimationEnd',
            MozAnimation: 'animationend',
            OAnimation: 'oAnimationEnd',
            animation: 'animationend'
          }
        }
      },
      prefixes = ['webkit', 'Moz', 'O', 'ms'],
      style = (0, _jquery2.default)('<support>').get(0).style,
      tests = {
        csstransforms: function csstransforms() {
          return Boolean(test('transform'));
        },
        csstransforms3d: function csstransforms3d() {
          return Boolean(test('perspective'));
        },
        csstransitions: function csstransitions() {
          return Boolean(test('transition'));
        },
        cssanimations: function cssanimations() {
          return Boolean(test('animation'));
        }
      };

    var test = function test(property, prefixed) {
      var result = false,
        upper = property.charAt(0).toUpperCase() + property.slice(1);

      if (style[property] !== undefined) {
        result = property;
      }
      if (!result) {
        _jquery2.default.each(prefixes, function(i, prefix) {
          if (style[prefix + upper] !== undefined) {
            result = '-' + prefix.toLowerCase() + '-' + upper;
            return false;
          }
          return true;
        });
      }

      if (prefixed) {
        return result;
      }
      if (result) {
        return true;
      }
      return false;
    };

    var prefixed = function prefixed(property) {
      return test(property, true);
    };

    if (tests.csstransitions()) {
      /*eslint no-new-wrappers: "off"*/
      support.transition = new String(prefixed('transition'));
      support.transition.end = events.transition.end[support.transition];
    }

    if (tests.cssanimations()) {
      /*eslint no-new-wrappers: "off"*/
      support.animation = new String(prefixed('animation'));
      support.animation.end = events.animation.end[support.animation];
    }

    if (tests.csstransforms()) {
      /*eslint no-new-wrappers: "off"*/
      support.transform = new String(prefixed('transform'));
      support.transform3d = tests.csstransforms3d();
    }

    if (
      'ontouchstart' in window ||
      (window.DocumentTouch && document instanceof window.DocumentTouch)
    ) {
      support.touch = true;
    } else {
      support.touch = false;
    }

    if (window.PointerEvent || window.MSPointerEvent) {
      support.pointer = true;
    } else {
      support.pointer = false;
    }

    support.convertMatrixToArray = function(value) {
      if (value && value.substr(0, 6) === 'matrix') {
        return value
          .replace(/^.*\((.*)\)$/g, '$1')
          .replace(/px/g, '')
          .split(/, +/);
      }
      return false;
    };

    support.prefixPointerEvent = function(pointerEvent) {
      var charStart = 9,
        subStart = 10;

      return window.MSPointerEvent
        ? 'MSPointer' +
          pointerEvent.charAt(charStart).toUpperCase() +
          pointerEvent.substr(subStart)
        : pointerEvent;
    };
  })(support);

  var NAMESPACE$1 = 'asHoverScroll';
  var instanceId = 0;

  /**
   * Plugin constructor
   **/

  var asHoverScroll = (function() {
    function asHoverScroll(element, options) {
      _classCallCheck(this, asHoverScroll);

      this.element = element;
      this.$element = (0, _jquery2.default)(element);

      this.options = _jquery2.default.extend(
        {},
        DEFAULTS,
        options,
        this.$element.data()
      );
      this.$list = (0, _jquery2.default)(this.options.list, this.$element);

      this.classes = {
        disabled: this.options.namespace + '-disabled'
      };

      if (this.options.direction === 'vertical') {
        this.attributes = {
          page: 'pageY',
          axis: 'Y',
          position: 'top',
          length: 'height',
          offset: 'offsetTop',
          client: 'clientY',
          clientLength: 'clientHeight'
        };
      } else if (this.options.direction === 'horizontal') {
        this.attributes = {
          page: 'pageX',
          axis: 'X',
          position: 'left',
          length: 'width',
          offset: 'offsetLeft',
          client: 'clientX',
          clientLength: 'clientWidth'
        };
      }

      // Current state information.
      this._states = {};

      // Current state information for the touch operation.
      this._scroll = {
        time: null,
        pointer: null
      };

      this.instanceId = ++instanceId;

      this.trigger('init');
      this.init();
    }

    _createClass(
      asHoverScroll,
      [
        {
          key: 'init',
          value: function init() {
            this.initPosition();

            // init length data
            this.updateLength();

            this.bindEvents();
          }
        },
        {
          key: 'bindEvents',
          value: function bindEvents() {
            var _this = this;

            var that = this;
            var enterEvents = ['enter'];
            var leaveEvents = [];

            if (this.options.mouseMove) {
              this.$element.on(
                this.eventName('mousemove'),
                _jquery2.default.proxy(this.onMove, this)
              );
              enterEvents.push('mouseenter');
              leaveEvents.push('mouseleave');
            }

            if (this.options.touchScroll && support.touch) {
              this.$element.on(
                this.eventName('touchstart'),
                _jquery2.default.proxy(this.onScrollStart, this)
              );
              this.$element.on(
                this.eventName('touchcancel'),
                _jquery2.default.proxy(this.onScrollEnd, this)
              );
            }

            if (this.options.pointerScroll && support.pointer) {
              this.$element.on(
                this.eventName(support.prefixPointerEvent('pointerdown')),
                _jquery2.default.proxy(this.onScrollStart, this)
              );
              this.$element.on(
                this.eventName(support.prefixPointerEvent('pointercancel')),
                _jquery2.default.proxy(this.onScrollEnd, this)
              );
            }

            this.$list.on(
              this.eventName(enterEvents.join(' ')),
              this.options.item,
              function() {
                if (!that.is('scrolling')) {
                  that.options.onEnter.call(_this);
                }
              }
            );
            this.$list.on(
              this.eventName(leaveEvents.join(' ')),
              this.options.item,
              function() {
                if (!that.is('scrolling')) {
                  that.options.onLeave.call(_this);
                }
              }
            );

            (0, _jquery2.default)(window).on(
              this.eventNameWithId('orientationchange'),
              function() {
                that.update();
              }
            );
            (0, _jquery2.default)(window).on(
              this.eventNameWithId('resize'),
              this.throttle(function() {
                that.update();
              }, this.options.throttle)
            );
          }
        },
        {
          key: 'unbindEvents',
          value: function unbindEvents() {
            this.$element.off(this.eventName());
            this.$list.off(this.eventName());
            (0, _jquery2.default)(window).off(this.eventNameWithId());
          }
        },
        {
          key: 'onScrollStart',
          value: function onScrollStart(event) {
            var _this2 = this;

            var that = this;

            if (this.is('scrolling')) {
              return;
            }

            if (event.which === 3) {
              return;
            }

            if (
              (0, _jquery2.default)(event.target).closest(
                this.options.exception
              ).length > 0
            ) {
              return;
            }

            this._scroll.time = new Date().getTime();
            this._scroll.pointer = this.pointer(event);
            this._scroll.start = this.getPosition();
            this._scroll.moved = false;

            var callback = function callback() {
              _this2.enter('scrolling');
              _this2.trigger('scroll');
            };

            if (this.options.touchScroll && support.touch) {
              (0, _jquery2.default)(document).on(
                this.eventName('touchend'),
                _jquery2.default.proxy(this.onScrollEnd, this)
              );

              (0, _jquery2.default)(document).one(
                this.eventName('touchmove'),
                _jquery2.default.proxy(function() {
                  if (!this.is('scrolling')) {
                    (0, _jquery2.default)(document).on(
                      that.eventName('touchmove'),
                      _jquery2.default.proxy(this.onScrollMove, this)
                    );
                    callback();
                  }
                }, this)
              );
            }

            if (this.options.pointerScroll && support.pointer) {
              (0, _jquery2.default)(document).on(
                this.eventName(support.prefixPointerEvent('pointerup')),
                _jquery2.default.proxy(this.onScrollEnd, this)
              );

              (0, _jquery2.default)(document).one(
                this.eventName(support.prefixPointerEvent('pointermove')),
                _jquery2.default.proxy(function() {
                  if (!this.is('scrolling')) {
                    (0, _jquery2.default)(document).on(
                      that.eventName(support.prefixPointerEvent('pointermove')),
                      _jquery2.default.proxy(this.onScrollMove, this)
                    );

                    callback();
                  }
                }, this)
              );
            }

            (0, _jquery2.default)(document).on(
              this.eventName('blur'),
              _jquery2.default.proxy(this.onScrollEnd, this)
            );

            event.preventDefault();
          }
        },
        {
          key: 'onScrollMove',
          value: function onScrollMove(event) {
            this._scroll.updated = this.pointer(event);
            var distance = this.distance(
              this._scroll.pointer,
              this._scroll.updated
            );

            if (
              Math.abs(this._scroll.pointer.x - this._scroll.updated.x) > 10 ||
              Math.abs(this._scroll.pointer.y - this._scroll.updated.y) > 10
            ) {
              this._scroll.moved = true;
            }

            if (!this.is('scrolling')) {
              return;
            }

            event.preventDefault();
            var postion = this._scroll.start + distance;

            if (this.canScroll()) {
              if (postion > 0) {
                postion = 0;
              } else if (postion < this.containerLength - this.listLength) {
                postion = this.containerLength - this.listLength;
              }
              this.updatePosition(postion);
            }
          }
        },
        {
          key: 'onScrollEnd',
          value: function onScrollEnd(event) {
            if (!this._scroll.moved) {
              (0, _jquery2.default)(event.target).trigger('tap');
            }

            // if (!this.is('scrolling')) {
            //   return;
            // }

            if (this.options.touchScroll && support.touch) {
              (0, _jquery2.default)(document).off(
                this.eventName('touchmove touchend')
              );
            }

            if (this.options.pointerScroll && support.pointer) {
              (0, _jquery2.default)(document).off(
                this.eventName(
                  support.prefixPointerEvent('pointermove pointerup')
                )
              );
            }

            (0, _jquery2.default)(document).off(this.eventName('blur'));

            this.leave('scrolling');
            this.trigger('scrolled');
          }
        },
        {
          key: 'pointer',
          value: function pointer(event) {
            var result = {
              x: null,
              y: null
            };

            event = this.getEvent(event);

            if (event.pageX && !this.options.fixed) {
              result.x = event.pageX;
              result.y = event.pageY;
            } else {
              result.x = event.clientX;
              result.y = event.clientY;
            }

            return result;
          }
        },
        {
          key: 'getEvent',
          value: function getEvent(event) {
            event = event.originalEvent || event || window.event;

            event =
              event.touches && event.touches.length
                ? event.touches[0]
                : event.changedTouches && event.changedTouches.length
                  ? event.changedTouches[0]
                  : event;

            return event;
          }
        },
        {
          key: 'distance',
          value: function distance(first, second) {
            if (this.options.direction === 'vertical') {
              return second.y - first.y;
            }
            return second.x - first.x;
          }
        },
        {
          key: 'onMove',
          value: function onMove(event) {
            event = this.getEvent(event);

            if (this.is('scrolling')) {
              return;
            }

            if (this.isMatchScroll(event)) {
              var pointer = void 0;
              var distance = void 0;
              var offset = void 0;
              if (event[this.attributes.page] && !this.options.fixed) {
                pointer = event[this.attributes.page];
              } else {
                pointer = event[this.attributes.client];
              }

              offset = pointer - this.element[this.attributes.offset];

              if (offset < this.options.boundary) {
                distance = 0;
              } else {
                distance = (offset - this.options.boundary) * this.multiplier;

                if (distance > this.listLength - this.containerLength) {
                  distance = this.listLength - this.containerLength;
                }
              }

              this.updatePosition(-distance);
            }
          }
        },
        {
          key: 'isMatchScroll',
          value: function isMatchScroll(event) {
            if (!this.is('disabled') && this.canScroll()) {
              if (this.options.exception) {
                if (
                  (0, _jquery2.default)(event.target).closest(
                    this.options.exception
                  ).length === 0
                ) {
                  return true;
                }
                return false;
              }
              return true;
            }
            return false;
          }
        },
        {
          key: 'canScroll',
          value: function canScroll() {
            return this.listLength > this.containerLength;
          }
        },
        {
          key: 'getContainerLength',
          value: function getContainerLength() {
            return this.element[this.attributes.clientLength];
          }
        },
        {
          key: 'getListhLength',
          value: function getListhLength() {
            return this.$list[0][this.attributes.clientLength];
          }
        },
        {
          key: 'updateLength',
          value: function updateLength() {
            this.containerLength = this.getContainerLength();
            this.listLength = this.getListhLength();
            this.multiplier =
              (this.listLength - this.containerLength) /
              (this.containerLength - 2 * this.options.boundary);
          }
        },
        {
          key: 'initPosition',
          value: function initPosition() {
            var style = this.makePositionStyle(0);
            this.$list.css(style);
          }
        },
        {
          key: 'getPosition',
          value: function getPosition() {
            var value = void 0;

            if (this.options.useCssTransforms && support.transform) {
              if (this.options.useCssTransforms3d && support.transform3d) {
                value = support.convertMatrixToArray(
                  this.$list.css(support.transform)
                );
              } else {
                value = support.convertMatrixToArray(
                  this.$list.css(support.transform)
                );
              }
              if (!value) {
                return 0;
              }

              if (this.attributes.axis === 'X') {
                value = value[12] || value[4];
              } else {
                value = value[13] || value[5];
              }
            } else {
              value = this.$list.css(this.attributes.position);
            }

            return parseFloat(value.replace('px', ''));
          }
        },
        {
          key: 'makePositionStyle',
          value: function makePositionStyle(value) {
            var property = void 0;
            var x = '0px';
            var y = '0px';

            if (this.options.useCssTransforms && support.transform) {
              if (this.attributes.axis === 'X') {
                x = value + 'px';
              } else {
                y = value + 'px';
              }

              property = support.transform.toString();

              if (this.options.useCssTransforms3d && support.transform3d) {
                value = 'translate3d(' + x + ',' + y + ',0px)';
              } else {
                value = 'translate(' + x + ',' + y + ')';
              }
            } else {
              property = this.attributes.position;
            }
            var temp = {};
            temp[property] = value;

            return temp;
          }
        },
        {
          key: 'updatePosition',
          value: function updatePosition(value) {
            var style = this.makePositionStyle(value);
            this.$list.css(style);
          }
        },
        {
          key: 'update',
          value: function update() {
            if (!this.is('disabled')) {
              this.updateLength();

              if (!this.canScroll()) {
                this.initPosition();
              }
            }
          }
        },
        {
          key: 'eventName',
          value: function eventName(events) {
            if (typeof events !== 'string' || events === '') {
              return '.' + NAMESPACE$1;
            }
            events = events.split(' ');

            var length = events.length;
            for (var i = 0; i < length; i++) {
              events[i] = events[i] + '.' + NAMESPACE$1;
            }
            return events.join(' ');
          }
        },
        {
          key: 'eventNameWithId',
          value: function eventNameWithId(events) {
            if (typeof events !== 'string' || events === '') {
              return '.' + this.options.namespace + '-' + this.instanceId;
            }

            events = events.split(' ');
            var length = events.length;
            for (var i = 0; i < length; i++) {
              events[i] =
                events[i] +
                '.' +
                this.options.namespace +
                '-' +
                this.instanceId;
            }
            return events.join(' ');
          }
        },
        {
          key: 'trigger',
          value: function trigger(eventType) {
            for (
              var _len = arguments.length,
                params = Array(_len > 1 ? _len - 1 : 0),
                _key = 1;
              _key < _len;
              _key++
            ) {
              params[_key - 1] = arguments[_key];
            }

            var data = [this].concat(params);

            // event
            this.$element.trigger(NAMESPACE$1 + '::' + eventType, data);

            // callback
            eventType = eventType.replace(/\b\w+\b/g, function(word) {
              return word.substring(0, 1).toUpperCase() + word.substring(1);
            });
            var onFunction = 'on' + eventType;

            if (typeof this.options[onFunction] === 'function') {
              this.options[onFunction].apply(this, params);
            }
          }
        },
        {
          key: 'is',
          value: function is(state) {
            return this._states[state] && this._states[state] > 0;
          }
        },
        {
          key: 'enter',
          value: function enter(state) {
            if (this._states[state] === undefined) {
              this._states[state] = 0;
            }

            this._states[state] = 1;
          }
        },
        {
          key: 'leave',
          value: function leave(state) {
            this._states[state] = 0;
          }
        },
        {
          key: 'throttle',
          value: function throttle(func, wait) {
            var _this3 = this;

            var _now =
              Date.now ||
              function() {
                return new Date().getTime();
              };

            var timeout = void 0;
            var context = void 0;
            var args = void 0;
            var result = void 0;
            var previous = 0;
            var later = function later() {
              previous = _now();
              timeout = null;
              result = func.apply(context, args);
              if (!timeout) {
                context = args = null;
              }
            };

            return function() {
              for (
                var _len2 = arguments.length, params = Array(_len2), _key2 = 0;
                _key2 < _len2;
                _key2++
              ) {
                params[_key2] = arguments[_key2];
              }

              /*eslint consistent-this: "off"*/
              var now = _now();
              var remaining = wait - (now - previous);
              context = _this3;
              args = params;
              if (remaining <= 0 || remaining > wait) {
                if (timeout) {
                  clearTimeout(timeout);
                  timeout = null;
                }
                previous = now;
                result = func.apply(context, args);
                if (!timeout) {
                  context = args = null;
                }
              } else if (!timeout) {
                timeout = setTimeout(later, remaining);
              }
              return result;
            };
          }
        },
        {
          key: 'enable',
          value: function enable() {
            if (this.is('disabled')) {
              this.leave('disabled');

              this.$element.removeClass(this.classes.disabled);

              this.bindEvents();
            }

            this.trigger('enable');
          }
        },
        {
          key: 'disable',
          value: function disable() {
            if (!this.is('disabled')) {
              this.enter('disabled');

              this.initPosition();
              this.$element.addClass(this.classes.disabled);

              this.unbindEvents();
            }

            this.trigger('disable');
          }
        },
        {
          key: 'destroy',
          value: function destroy() {
            this.$element.removeClass(this.classes.disabled);
            this.unbindEvents();
            this.$element.data(NAMESPACE$1, null);

            this.trigger('destroy');
          }
        }
      ],
      [
        {
          key: 'setDefaults',
          value: function setDefaults(options) {
            _jquery2.default.extend(
              DEFAULTS,
              _jquery2.default.isPlainObject(options) && options
            );
          }
        }
      ]
    );

    return asHoverScroll;
  })();

  var info = {
    version: '0.3.6'
  };

  var NAMESPACE = 'asHoverScroll';
  var OtherAsHoverScroll = _jquery2.default.fn.asHoverScroll;

  var jQueryAsHoverScroll = function jQueryAsHoverScroll(options) {
    for (
      var _len3 = arguments.length,
        args = Array(_len3 > 1 ? _len3 - 1 : 0),
        _key3 = 1;
      _key3 < _len3;
      _key3++
    ) {
      args[_key3 - 1] = arguments[_key3];
    }

    if (typeof options === 'string') {
      var method = options;

      if (/^_/.test(method)) {
        return false;
      } else if (/^(get)/.test(method)) {
        var instance = this.first().data(NAMESPACE);
        if (instance && typeof instance[method] === 'function') {
          return instance[method].apply(instance, args);
        }
      } else {
        return this.each(function() {
          var instance = _jquery2.default.data(this, NAMESPACE);
          if (instance && typeof instance[method] === 'function') {
            instance[method].apply(instance, args);
          }
        });
      }
    }

    return this.each(function() {
      if (!(0, _jquery2.default)(this).data(NAMESPACE)) {
        (0, _jquery2.default)(this).data(
          NAMESPACE,
          new asHoverScroll(this, options)
        );
      }
    });
  };

  _jquery2.default.fn.asHoverScroll = jQueryAsHoverScroll;

  _jquery2.default.asHoverScroll = _jquery2.default.extend(
    {
      setDefaults: asHoverScroll.setDefaults,
      noConflict: function noConflict() {
        _jquery2.default.fn.asHoverScroll = OtherAsHoverScroll;
        return jQueryAsHoverScroll;
      }
    },
    info
  );
});
/**
* asRange v0.3.4
* https://github.com/amazingSurge/jquery-asRange
*
* Copyright (c) amazingSurge
* Released under the LGPL-3.0 license
*/

(function(global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory);
  } else if (typeof exports !== 'undefined') {
    factory(require('jquery'));
  } else {
    var mod = {
      exports: {}
    };
    factory(global.jQuery);
    global.jqueryAsRangeEs = mod.exports;
  }
})(this, function(_jquery) {
  'use strict';

  var _jquery2 = _interopRequireDefault(_jquery);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule
      ? obj
      : {
          default: obj
        };
  }

  var _typeof =
    typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol'
      ? function(obj) {
          return typeof obj;
        }
      : function(obj) {
          return obj &&
          typeof Symbol === 'function' &&
          obj.constructor === Symbol &&
          obj !== Symbol.prototype
            ? 'symbol'
            : typeof obj;
        };

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError('Cannot call a class as a function');
    }
  }

  var _createClass = (function() {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ('value' in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function(Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  })();

  var DEFAULTS = {
    namespace: 'asRange',
    skin: null,
    max: 100,
    min: 0,
    value: null,
    step: 10,
    limit: true,
    range: false,
    direction: 'h', // 'v' or 'h'
    keyboard: true,
    replaceFirst: false, // false, 'inherit', {'inherit': 'default'}
    tip: true,
    scale: true,
    format: function format(value) {
      return value;
    }
  };

  function getEventObject(event) {
    var e = event.originalEvent;
    if (e.touches && e.touches.length && e.touches[0]) {
      e = e.touches[0];
    }

    return e;
  }

  var Pointer = (function() {
    function Pointer($element, id, parent) {
      _classCallCheck(this, Pointer);

      this.$element = $element;
      this.uid = id;
      this.parent = parent;
      this.options = _jquery2.default.extend(true, {}, this.parent.options);
      this.direction = this.options.direction;
      this.value = null;
      this.classes = {
        active: this.parent.namespace + '-pointer_active'
      };
    }

    _createClass(Pointer, [
      {
        key: 'mousedown',
        value: function mousedown(event) {
          var axis = this.parent.direction.axis;
          var position = this.parent.direction.position;
          var offset = this.parent.$wrap.offset();

          this.$element.trigger(this.parent.namespace + '::moveStart', this);

          this.data = {};
          this.data.start = event[axis];
          this.data.position = event[axis] - offset[position];

          var value = this.parent.getValueFromPosition(this.data.position);
          this.set(value);

          _jquery2.default.each(this.parent.pointer, function(i, p) {
            p.deactive();
          });

          this.active();

          this.mousemove = function(event) {
            var eventObj = getEventObject(event);
            var value = this.parent.getValueFromPosition(
              this.data.position +
                (eventObj[axis] || this.data.start) -
                this.data.start
            );
            this.set(value);

            event.preventDefault();
            return false;
          };
          this.mouseup = function() {
            (0, _jquery2.default)(document).off(
              '.asRange mousemove.asRange touchend.asRange mouseup.asRange touchcancel.asRange'
            );
            this.$element.trigger(this.parent.namespace + '::moveEnd', this);
            return false;
          };

          (0, _jquery2.default)(document)
            .on(
              'touchmove.asRange mousemove.asRange',
              _jquery2.default.proxy(this.mousemove, this)
            )
            .on(
              'touchend.asRange mouseup.asRange',
              _jquery2.default.proxy(this.mouseup, this)
            );
          return false;
        }
      },
      {
        key: 'active',
        value: function active() {
          this.$element.addClass(this.classes.active);
        }
      },
      {
        key: 'deactive',
        value: function deactive() {
          this.$element.removeClass(this.classes.active);
        }
      },
      {
        key: 'set',
        value: function set(value) {
          if (this.value === value) {
            return;
          }

          if (this.parent.step) {
            value = this.matchStep(value);
          }
          if (this.options.limit === true) {
            value = this.matchLimit(value);
          } else {
            if (value <= this.parent.min) {
              value = this.parent.min;
            }
            if (value >= this.parent.max) {
              value = this.parent.max;
            }
          }
          this.value = value;

          this.updatePosition();
          this.$element.focus();

          this.$element.trigger(this.parent.namespace + '::move', this);
        }
      },
      {
        key: 'updatePosition',
        value: function updatePosition() {
          var position = {};

          position[this.parent.direction.position] = this.getPercent() + '%';
          this.$element.css(position);
        }
      },
      {
        key: 'getPercent',
        value: function getPercent() {
          return (this.value - this.parent.min) / this.parent.interval * 100;
        }
      },
      {
        key: 'get',
        value: function get() {
          return this.value;
        }
      },
      {
        key: 'matchStep',
        value: function matchStep(value) {
          var step = this.parent.step;
          var decimal = step.toString().split('.')[1];

          value = Math.round(value / step) * step;

          if (decimal) {
            value = value.toFixed(decimal.length);
          }

          return parseFloat(value);
        }
      },
      {
        key: 'matchLimit',
        value: function matchLimit(value) {
          var left = void 0;
          var right = void 0;
          var pointer = this.parent.pointer;

          if (this.uid === 1) {
            left = this.parent.min;
          } else {
            left = pointer[this.uid - 2].value;
          }

          if (pointer[this.uid] && pointer[this.uid].value !== null) {
            right = pointer[this.uid].value;
          } else {
            right = this.parent.max;
          }

          if (value <= left) {
            value = left;
          }
          if (value >= right) {
            value = right;
          }
          return value;
        }
      },
      {
        key: 'destroy',
        value: function destroy() {
          this.$element.off('.asRange');
          this.$element.remove();
        }
      }
    ]);

    return Pointer;
  })();

  var scale = {
    defaults: {
      scale: {
        valuesNumber: 3,
        gap: 1,
        grid: 5
      }
    },
    init: function init(instance) {
      var opts = _jquery2.default.extend(
        {},
        this.defaults,
        instance.options.scale
      );
      var scale = opts.scale;
      scale.values = [];
      scale.values.push(instance.min);
      var part = (instance.max - instance.min) / (scale.valuesNumber - 1);
      for (var j = 1; j <= scale.valuesNumber - 2; j++) {
        scale.values.push(part * j);
      }
      scale.values.push(instance.max);
      var classes = {
        scale: instance.namespace + '-scale',
        lines: instance.namespace + '-scale-lines',
        grid: instance.namespace + '-scale-grid',
        inlineGrid: instance.namespace + '-scale-inlineGrid',
        values: instance.namespace + '-scale-values'
      };

      var len = scale.values.length;
      var num =
        ((scale.grid - 1) * (scale.gap + 1) + scale.gap) * (len - 1) + len;
      var perOfGrid = 100 / (num - 1);
      var perOfValue = 100 / (len - 1);

      this.$scale = (0, _jquery2.default)('<div></div>').addClass(
        classes.scale
      );
      this.$lines = (0, _jquery2.default)('<ul></ul>').addClass(classes.lines);
      this.$values = (0, _jquery2.default)('<ul></ul>').addClass(
        classes.values
      );

      for (var i = 0; i < num; i++) {
        var $list = void 0;
        if (i === 0 || i === num || i % ((num - 1) / (len - 1)) === 0) {
          $list = (0, _jquery2.default)(
            '<li class="' + classes.grid + '"></li>'
          );
        } else if (i % scale.grid === 0) {
          $list = (0, _jquery2.default)(
            '<li class="' + classes.inlineGrid + '"></li>'
          );
        } else {
          $list = (0, _jquery2.default)('<li></li>');
        }

        // position scale
        $list
          .css({
            left: perOfGrid * i + '%'
          })
          .appendTo(this.$lines);
      }

      for (var v = 0; v < len; v++) {
        // position value
        (0, _jquery2.default)('<li><span>' + scale.values[v] + '</span></li>')
          .css({
            left: perOfValue * v + '%'
          })
          .appendTo(this.$values);
      }

      this.$lines.add(this.$values).appendTo(this.$scale);
      this.$scale.appendTo(instance.$wrap);
    },
    update: function update(instance) {
      this.$scale.remove();
      this.init(instance);
    }
  };

  var selected = {
    defaults: {},
    init: function init(instance) {
      var _this = this;

      this.$arrow = (0, _jquery2.default)('<span></span>').appendTo(
        instance.$wrap
      );
      this.$arrow.addClass(instance.namespace + '-selected');

      if (instance.options.range === false) {
        instance.p1.$element.on(instance.namespace + '::move', function(
          e,
          pointer
        ) {
          _this.$arrow.css({
            left: 0,
            width: pointer.getPercent() + '%'
          });
        });
      }

      if (instance.options.range === true) {
        var onUpdate = function onUpdate() {
          var width = instance.p2.getPercent() - instance.p1.getPercent();
          var left = void 0;
          if (width >= 0) {
            left = instance.p1.getPercent();
          } else {
            width = -width;
            left = instance.p2.getPercent();
          }
          _this.$arrow.css({
            left: left + '%',
            width: width + '%'
          });
        };
        instance.p1.$element.on(instance.namespace + '::move', onUpdate);
        instance.p2.$element.on(instance.namespace + '::move', onUpdate);
      }
    }
  };

  var tip = {
    defaults: {
      active: 'always' // 'always' 'onMove'
    },
    init: function init(instance) {
      var that = this;
      var opts = _jquery2.default.extend(
        {},
        this.defaults,
        instance.options.tip
      );

      this.opts = opts;
      this.classes = {
        tip: instance.namespace + '-tip',
        show: instance.namespace + '-tip-show'
      };
      _jquery2.default.each(instance.pointer, function(i, p) {
        var $tip = (0, _jquery2.default)('<span></span>').appendTo(
          instance.pointer[i].$element
        );

        $tip.addClass(that.classes.tip);
        if (that.opts.active === 'onMove') {
          $tip.css({
            display: 'none'
          });
          p.$element
            .on(instance.namespace + '::moveEnd', function() {
              that.hide($tip);
              return false;
            })
            .on(instance.namespace + '::moveStart', function() {
              that.show($tip);
              return false;
            });
        }
        p.$element.on(instance.namespace + '::move', function() {
          var value = void 0;
          if (instance.options.range) {
            value = instance.get()[i];
          } else {
            value = instance.get();
          }
          if (typeof instance.options.format === 'function') {
            if (instance.options.replaceFirst && typeof value !== 'number') {
              if (typeof instance.options.replaceFirst === 'string') {
                value = instance.options.replaceFirst;
              }
              if (_typeof(instance.options.replaceFirst) === 'object') {
                for (var key in instance.options.replaceFirst) {
                  if (
                    Object.hasOwnProperty(instance.options.replaceFirst, key)
                  ) {
                    value = instance.options.replaceFirst[key];
                  }
                }
              }
            } else {
              value = instance.options.format(value);
            }
          }
          $tip.text(value);
          return false;
        });
      });
    },
    show: function show($tip) {
      $tip.addClass(this.classes.show);
      $tip.css({
        display: 'block'
      });
    },
    hide: function hide($tip) {
      $tip.removeClass(this.classes.show);
      $tip.css({
        display: 'none'
      });
    }
  };

  var keyboard = function keyboard() {
    var $doc = (0, _jquery2.default)(document);

    $doc.on('asRange::ready', function(event, instance) {
      var step = void 0;

      var keyboard = {
        keys: {
          UP: 38,
          DOWN: 40,
          LEFT: 37,
          RIGHT: 39,
          RETURN: 13,
          ESCAPE: 27,
          BACKSPACE: 8,
          SPACE: 32
        },
        map: {},
        bound: false,
        press: function press(e) {
          /*eslint consistent-return: "off"*/
          var key = e.keyCode || e.which;
          if (key in keyboard.map && typeof keyboard.map[key] === 'function') {
            keyboard.map[key](e);
            return false;
          }
        },
        attach: function attach(map) {
          var key = void 0;
          var up = void 0;
          for (key in map) {
            if (map.hasOwnProperty(key)) {
              up = key.toUpperCase();
              if (up in keyboard.keys) {
                keyboard.map[keyboard.keys[up]] = map[key];
              } else {
                keyboard.map[up] = map[key];
              }
            }
          }
          if (!keyboard.bound) {
            keyboard.bound = true;
            $doc.bind('keydown', keyboard.press);
          }
        },
        detach: function detach() {
          keyboard.bound = false;
          keyboard.map = {};
          $doc.unbind('keydown', keyboard.press);
        }
      };

      if (instance.options.keyboard === true) {
        _jquery2.default.each(instance.pointer, function(i, p) {
          if (instance.options.step) {
            step = instance.options.step;
          } else {
            step = 1;
          }
          var left = function left() {
            var value = p.value;
            p.set(value - step);
          };
          var right = function right() {
            var value = p.value;
            p.set(value + step);
          };
          p.$element
            .attr('tabindex', '0')
            .on('focus', function() {
              keyboard.attach({
                left: left,
                right: right
              });
              return false;
            })
            .on('blur', function() {
              keyboard.detach();
              return false;
            });
        });
      }
    });
  };

  var components = {};

  /**
   * Plugin constructor
   **/

  var asRange = (function() {
    function asRange(element, options) {
      var _this2 = this;

      _classCallCheck(this, asRange);

      var metas = {};
      this.element = element;
      this.$element = (0, _jquery2.default)(element);

      if (this.$element.is('input')) {
        var value = this.$element.val();

        if (typeof value === 'string') {
          metas.value = value.split(',');
        }

        _jquery2.default.each(['min', 'max', 'step'], function(index, key) {
          var val = parseFloat(_this2.$element.attr(key));
          if (!isNaN(val)) {
            metas[key] = val;
          }
        });

        this.$element.css({
          display: 'none'
        });
        this.$wrap = (0, _jquery2.default)('<div></div>');
        this.$element.after(this.$wrap);
      } else {
        this.$wrap = this.$element;
      }

      this.options = _jquery2.default.extend(
        {},
        DEFAULTS,
        options,
        this.$element.data(),
        metas
      );
      this.namespace = this.options.namespace;
      this.components = _jquery2.default.extend(true, {}, components);
      if (this.options.range) {
        this.options.replaceFirst = false;
      }

      // public properties
      this.value = this.options.value;
      if (this.value === null) {
        this.value = this.options.min;
      }

      if (!this.options.range) {
        if (_jquery2.default.isArray(this.value)) {
          this.value = this.value[0];
        }
      } else if (!_jquery2.default.isArray(this.value)) {
        this.value = [this.value, this.value];
      } else if (this.value.length === 1) {
        this.value[1] = this.value[0];
      }

      this.min = this.options.min;
      this.max = this.options.max;
      this.step = this.options.step;
      this.interval = this.max - this.min;

      // flag
      this.initialized = false;
      this.updating = false;
      this.disabled = false;

      if (this.options.direction === 'v') {
        this.direction = {
          axis: 'pageY',
          position: 'top'
        };
      } else {
        this.direction = {
          axis: 'pageX',
          position: 'left'
        };
      }

      this.$wrap.addClass(this.namespace);

      if (this.options.skin) {
        this.$wrap.addClass(this.namespace + '_' + this.options.skin);
      }

      if (this.max < this.min || this.step >= this.interval) {
        throw new Error('error options about max min step');
      }

      this.init();
    }

    _createClass(
      asRange,
      [
        {
          key: 'init',
          value: function init() {
            this.$wrap.append('<div class="' + this.namespace + '-bar" />');

            // build pointers
            this.buildPointers();

            // initial components
            this.components.selected.init(this);

            if (this.options.tip !== false) {
              this.components.tip.init(this);
            }
            if (this.options.scale !== false) {
              this.components.scale.init(this);
            }

            // initial pointer value
            this.set(this.value);

            // Bind events
            this.bindEvents();

            this._trigger('ready');
            this.initialized = true;
          }
        },
        {
          key: '_trigger',
          value: function _trigger(eventType) {
            for (
              var _len = arguments.length,
                params = Array(_len > 1 ? _len - 1 : 0),
                _key = 1;
              _key < _len;
              _key++
            ) {
              params[_key - 1] = arguments[_key];
            }

            var data = [this].concat(params);

            // event
            this.$element.trigger(this.namespace + ('::' + eventType), data);

            // callback
            eventType = eventType.replace(/\b\w+\b/g, function(word) {
              return word.substring(0, 1).toUpperCase() + word.substring(1);
            });
            var onFunction = 'on' + eventType;

            if (typeof this.options[onFunction] === 'function') {
              this.options[onFunction].apply(this, params);
            }
          }
        },
        {
          key: 'buildPointers',
          value: function buildPointers() {
            this.pointer = [];
            var pointerCount = 1;
            if (this.options.range) {
              pointerCount = 2;
            }
            for (var i = 1; i <= pointerCount; i++) {
              var $pointer = (0, _jquery2.default)(
                '<div class="' +
                  this.namespace +
                  '-pointer ' +
                  this.namespace +
                  '-pointer-' +
                  i +
                  '"></div>'
              ).appendTo(this.$wrap);
              var p = new Pointer($pointer, i, this);
              this.pointer.push(p);
            }

            // alias of pointer
            this.p1 = this.pointer[0];

            if (this.options.range) {
              this.p2 = this.pointer[1];
            }
          }
        },
        {
          key: 'bindEvents',
          value: function bindEvents() {
            var _this3 = this;

            var that = this;
            this.$wrap.on('touchstart.asRange mousedown.asRange', function(
              event
            ) {
              /*eslint consistent-return: "off"*/
              if (that.disabled === true) {
                return;
              }
              event = getEventObject(event);
              var rightclick = event.which
                ? event.which === 3
                : event.button === 2;
              if (rightclick) {
                return false;
              }

              var offset = that.$wrap.offset();
              var start =
                event[that.direction.axis] - offset[that.direction.position];
              var p = that.getAdjacentPointer(start);

              p.mousedown(event);
              return false;
            });

            if (this.$element.is('input')) {
              this.$element.on(this.namespace + '::change', function() {
                var value = _this3.get();
                _this3.$element.val(value);
              });
            }

            _jquery2.default.each(this.pointer, function(i, p) {
              p.$element.on(_this3.namespace + '::move', function() {
                that.value = that.get();
                if (!that.initialized || that.updating) {
                  return false;
                }
                that._trigger('change', that.value);
                return false;
              });
            });
          }
        },
        {
          key: 'getValueFromPosition',
          value: function getValueFromPosition(px) {
            if (px > 0) {
              return this.min + px / this.getLength() * this.interval;
            }
            return 0;
          }
        },
        {
          key: 'getAdjacentPointer',
          value: function getAdjacentPointer(start) {
            var value = this.getValueFromPosition(start);
            if (this.options.range) {
              var p1 = this.p1.value;
              var p2 = this.p2.value;
              var diff = Math.abs(p1 - p2);
              if (p1 <= p2) {
                if (value > p1 + diff / 2) {
                  return this.p2;
                }
                return this.p1;
              }

              if (value > p2 + diff / 2) {
                return this.p1;
              }

              return this.p2;
            }
            return this.p1;
          }
        },
        {
          key: 'getLength',
          value: function getLength() {
            if (this.options.direction === 'v') {
              return this.$wrap.height();
            }
            return this.$wrap.width();
          }
        },
        {
          key: 'update',
          value: function update(options) {
            var _this4 = this;

            this.updating = true;
            _jquery2.default.each(
              ['max', 'min', 'step', 'limit', 'value'],
              function(key, value) {
                if (options[value]) {
                  _this4[value] = options[value];
                }
              }
            );
            if (options.max || options.min) {
              this.setInterval(options.min, options.max);
            }

            if (!options.value) {
              this.value = options.min;
            }

            _jquery2.default.each(this.components, function(key, value) {
              if (typeof value.update === 'function') {
                value.update(_this4);
              }
            });

            this.set(this.value);

            this._trigger('update');

            this.updating = false;
          }
        },
        {
          key: 'get',
          value: function get() {
            var value = [];

            _jquery2.default.each(this.pointer, function(i, p) {
              value[i] = p.get();
            });

            if (this.options.range) {
              return value;
            }

            if (value[0] === this.options.min) {
              if (typeof this.options.replaceFirst === 'string') {
                value[0] = this.options.replaceFirst;
              }
              if (_typeof(this.options.replaceFirst) === 'object') {
                for (var key in this.options.replaceFirst) {
                  if (Object.hasOwnProperty(this.options.replaceFirst, key)) {
                    value[0] = key;
                  }
                }
              }
            }

            return value[0];
          }
        },
        {
          key: 'set',
          value: function set(value) {
            if (this.options.range) {
              if (typeof value === 'number') {
                value = [value];
              }
              if (!_jquery2.default.isArray(value)) {
                return;
              }
              _jquery2.default.each(this.pointer, function(i, p) {
                p.set(value[i]);
              });
            } else {
              this.p1.set(value);
            }

            this.value = value;
          }
        },
        {
          key: 'val',
          value: function val(value) {
            if (value) {
              this.set(value);
              return this;
            }
            return this.get();
          }
        },
        {
          key: 'setInterval',
          value: function setInterval(start, end) {
            this.min = start;
            this.max = end;
            this.interval = end - start;
          }
        },
        {
          key: 'enable',
          value: function enable() {
            this.disabled = false;
            this.$wrap.removeClass(this.namespace + '_disabled');

            this._trigger('enable');
            return this;
          }
        },
        {
          key: 'disable',
          value: function disable() {
            this.disabled = true;
            this.$wrap.addClass(this.namespace + '_disabled');

            this._trigger('disable');
            return this;
          }
        },
        {
          key: 'destroy',
          value: function destroy() {
            _jquery2.default.each(this.pointer, function(i, p) {
              p.destroy();
            });
            this.$wrap.destroy();

            this._trigger('destroy');
          }
        }
      ],
      [
        {
          key: 'registerComponent',
          value: function registerComponent(component, methods) {
            components[component] = methods;
          }
        },
        {
          key: 'setDefaults',
          value: function setDefaults(options) {
            _jquery2.default.extend(
              DEFAULTS,
              _jquery2.default.isPlainObject(options) && options
            );
          }
        }
      ]
    );

    return asRange;
  })();

  asRange.registerComponent('scale', scale);
  asRange.registerComponent('selected', selected);
  asRange.registerComponent('tip', tip);
  keyboard();

  var info = {
    version: '0.3.4'
  };

  var NAMESPACE = 'asRange';
  var OtherAsRange = _jquery2.default.fn.asRange;

  var jQueryAsRange = function jQueryAsRange(options) {
    for (
      var _len2 = arguments.length,
        args = Array(_len2 > 1 ? _len2 - 1 : 0),
        _key2 = 1;
      _key2 < _len2;
      _key2++
    ) {
      args[_key2 - 1] = arguments[_key2];
    }

    if (typeof options === 'string') {
      var method = options;

      if (/^_/.test(method)) {
        return false;
      } else if (
        /^(get)$/.test(method) ||
        (method === 'val' && args.length === 0)
      ) {
        var instance = this.first().data(NAMESPACE);
        if (instance && typeof instance[method] === 'function') {
          return instance[method].apply(instance, args);
        }
      } else {
        return this.each(function() {
          var instance = _jquery2.default.data(this, NAMESPACE);
          if (instance && typeof instance[method] === 'function') {
            instance[method].apply(instance, args);
          }
        });
      }
    }

    return this.each(function() {
      if (!(0, _jquery2.default)(this).data(NAMESPACE)) {
        (0, _jquery2.default)(this).data(NAMESPACE, new asRange(this, options));
      }
    });
  };

  _jquery2.default.fn.asRange = jQueryAsRange;

  _jquery2.default.asRange = _jquery2.default.extend(
    {
      setDefaults: asRange.setDefaults,
      noConflict: function noConflict() {
        _jquery2.default.fn.asRange = OtherAsRange;
        return jQueryAsRange;
      }
    },
    info
  );
});
/*!
 * LABELAUTY jQuery Plugin
 *
 * @file: jquery-labelauty.js
 * @author: Francisco Neves (@fntneves)
 * @site: www.francisconeves.com
 * @license: MIT License
 */


(function( $ ){

	$.fn.labelauty = function( options )
	{
		/*
		 * Our default settings
		 * Hope you don't need to change anything, with these settings
		 */
		var settings = $.extend(
		{
			// Development Mode
			// This will activate console debug messages
			"development": false,

			// Trigger Class
			// This class will be used to apply styles
			"class": "labelauty",

			// Use icon?
			// If false, then only a text label represents the input
			"icon": true,

			// Use text label ?
			// If false, then only an icon represents the input
			"label": true,

			// Separator between labels' messages
			// If you use this separator for anything, choose a new one
			"separator": "|",

			// Default Checked Message
			// This message will be visible when input is checked
			"checked_label": "Checked",

			// Default UnChecked Message
			// This message will be visible when input is unchecked
			"unchecked_label": "Unchecked",

			// Force random ID's
			// Replace original ID's with random ID's,
			"force_random_id": false,

			// Minimum Label Width
			// This value will be used to apply a minimum width to the text labels
			"minimum_width": false,

			// Use the greatest width between two text labels ?
			// If this has a true value, then label width will be the greatest between labels
			"same_width": true
		}, options);

		/*
		 * Let's create the core function
		 * It will try to cover all settings and mistakes of using
		 */
		return this.each(function()
		{
			var $object = $( this );
			var selected = $object.is(':checked');
			var type = $object.attr('type');
			var use_icons = true;
			var use_labels = true;
			var labels;
			var labels_object;
			var input_id;

			//Get the aria label from the input element
			var aria_label = $object.attr( "aria-label" );

			// Hide the object form screen readers
			$object.attr( "aria-hidden", true );

			// Test if object is a check input
			// Don't mess me up, come on
			if( $object.is( ":checkbox" ) === false && $object.is( ":radio" ) === false )
				return this;

			// Add "labelauty" class to all checkboxes
			// So you can apply some custom styles
			$object.addClass( settings["class"] );

			// Get the value of "data-labelauty" attribute
			// Then, we have the labels for each case (or not, as we will see)
			labels = $object.attr( "data-labelauty" );

			use_labels = settings.label;
			use_icons = settings.icon;

			// It's time to check if it's going to the right way
			// Null values, more labels than expected or no labels will be handled here
			if( use_labels === true )
			{
				if( labels == null || labels.length === 0 )
				{
					// If attribute has no label and we want to use, then use the default labels
					labels_object = [settings.unchecked_label, settings.checked_label]
				}
				else
				{
					// Ok, ok, it's time to split Checked and Unchecked labels
					// We split, by the "settings.separator" option
					labels_object = labels.split( settings.separator );

					// Now, let's check if exist _only_ two labels
					// If there's more than two, then we do not use labels :(
					// Else, do some additional tests
					if( labels_object.length > 2 )
					{
						use_labels = false;
						debug( settings.development, "There's more than two labels. LABELAUTY will not use labels." );
					}
					else
					{
						// If there's just one label (no split by "settings.separator"), it will be used for both cases
						// Here, we have the possibility of use the same label for both cases
						if( labels_object.length === 1 )
							debug( settings.development, "There's just one label. LABELAUTY will use this one for both cases." );
					}
				}
			}

			/*
			 * Let's begin the beauty
			 */

			// Start hiding ugly checkboxes
			// Obviously, we don't need native checkboxes :O
			$object.css({ display : "none" });

			// We don't need more data-labelauty attributes!
			// Ok, ok, it's just for beauty improvement
			$object.removeAttr( "data-labelauty" );

			// Now, grab checkbox ID Attribute for "label" tag use
			// If there's no ID Attribute, then generate a new one
			input_id = $object.attr( "id" );

			if( settings.force_random_id || input_id == null || input_id.trim() === "")
			{
				var input_id_number = 1 + Math.floor( Math.random() * 1024000 );
				input_id = "labelauty-" + input_id_number;

				// Is there any element with this random ID ?
				// If exists, then increment until get an unused ID
				while( $( input_id ).length !== 0 )
				{
					input_id_number++;
					input_id = "labelauty-" + input_id_number;
					debug( settings.development, "Holy crap, between 1024 thousand numbers, one raised a conflict. Trying again." );
				}

				$object.attr( "id", input_id );
			}

			// Now, add necessary tags to make this work
			// Here, we're going to test some control variables and act properly

			var element = jQuery(create( input_id, aria_label, selected, type, labels_object, use_labels, use_icons ));

			element.click(function(){
				if($object.is(':checked')){
					$(element).attr('aria-checked', false);
				}else{
					$(element).attr('aria-checked', true);
				}
			});

			element.keypress(function(event){
				event.preventDefault();
				if(event.keyCode === 32 || event.keyCode === 13){
					if($object.is(':checked')){
						$object.prop('checked', false);
						$(element).attr('aria-checked',false);
					}else{
						$object.prop('checked', true);
						$(element).attr('aria-checked', true);
					}
				}
			});

			$object.after(element);

			// Now, add "min-width" to label
			// Let's say the truth, a fixed width is more beautiful than a variable width
			if( settings.minimum_width !== false )
				$object.next( "label[for=" + input_id + "]" ).css({ "min-width": settings.minimum_width });

			// Now, add "min-width" to label
			// Let's say the truth, a fixed width is more beautiful than a variable width
			if( settings.same_width != false && settings.label == true )
			{
				var label_object = $object.next( "label[for='" + input_id + "']" );
				var unchecked_width = getRealWidth(label_object.find( "span.labelauty-unchecked" ));
				var checked_width = getRealWidth(label_object.find( "span.labelauty-checked" ));

				if( unchecked_width > checked_width )
					label_object.find( "span.labelauty-checked" ).width( unchecked_width );
				else
					label_object.find( "span.labelauty-unchecked" ).width( checked_width );
			}
		});
	};

	/*
	 * Tricky code to work with hidden elements, like tabs.
	 * Note: This code is based on jquery.actual plugin.
	 * https://github.com/dreamerslab/jquery.actual
	 */
	function getRealWidth( element )
	{
		var width = 0;
		var $target = element;
		var css_class = 'hidden_element';

		$target = $target.clone().attr('class', css_class).appendTo('body');
		width = $target.width(true);
		$target.remove();

		return width;
	}

	function debug( debug, message )
	{
		if( debug && window.console && window.console.log )
			window.console.log( "jQuery-LABELAUTY: " + message );
	}

	function create( input_id, aria_label, selected, type, messages_object, label, icon )
	{
		var block;
		var unchecked_message;
		var checked_message;
		var aria = "";

		if( messages_object == null )
			unchecked_message = checked_message = "";
		else
		{
			unchecked_message = messages_object[0];

			// If checked message is null, then put the same text of unchecked message
			if( messages_object[1] == null )
				checked_message = unchecked_message;
			else
				checked_message = messages_object[1];
		}

		if(aria_label == null)
			aria = "";
		else
			aria = 'tabindex="0" role="' + type + '" aria-checked="' + selected + '" aria-label="' + aria_label + '"';

		if( label == true && icon == true)
		{
			block = '<label for="' + input_id + '" ' + aria + '>' +
						'<span class="labelauty-unchecked-image"></span>' +
						'<span class="labelauty-unchecked">' + unchecked_message + '</span>' +
						'<span class="labelauty-checked-image"></span>' +
						'<span class="labelauty-checked">' + checked_message + '</span>' +
					'</label>';
		}
		else if( label == true )
		{
			block = '<label for="' + input_id + '" ' + aria + '>' +
				'<span class="labelauty-unchecked">' + unchecked_message + '</span>' +
				'<span class="labelauty-checked">' + checked_message + '</span>' +
				'</label>';
		}
		else
		{
			block = '<label for="' + input_id + '" ' + aria + '>' +
						'<span class="labelauty-unchecked-image"></span>' +
						'<span class="labelauty-checked-image"></span>' +
					'</label>';
		}

		return block;
	}

}( jQuery ));
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define('/Component', ['exports', 'jquery'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('jquery'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.jQuery);
    global.Component = mod.exports;
  }
})(this, function (exports, _jquery) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _jquery2 = babelHelpers.interopRequireDefault(_jquery);

  if (typeof Object.assign === 'undefined') {
    Object.assign = _jquery2.default.extend;
  }
  var Component = function () {
    function Component() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      babelHelpers.classCallCheck(this, Component);

      this.$el = options.$el ? options.$el : (0, _jquery2.default)(document);
      this.el = this.$el[0];
      delete options.$el;

      this.options = options;

      this.isProcessed = false;
    }

    babelHelpers.createClass(Component, [{
      key: 'initialize',
      value: function initialize() {
        // Initialize the Component
      }
    }, {
      key: 'process',
      value: function process() {
        // Bind the Event on the Component
      }
    }, {
      key: 'run',
      value: function run() {
        // run Component
        if (!this.isProcessed) {
          this.initialize();
          this.process();
        }

        this.isProcessed = true;
      }
    }, {
      key: 'triggerResize',
      value: function triggerResize() {
        if (document.createEvent) {
          var ev = document.createEvent('Event');
          ev.initEvent('resize', true, true);
          window.dispatchEvent(ev);
        } else {
          element = document.documentElement;
          var event = document.createEventObject();
          element.fireEvent('onresize', event);
        }
      }
    }]);
    return Component;
  }();

  exports.default = Component;
});
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define('/Plugin', ['exports', 'jquery'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('jquery'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.jQuery);
    global.Plugin = mod.exports;
  }
})(this, function (exports, _jquery) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.pluginFactory = exports.getDefaults = exports.getPlugin = exports.getPluginAPI = exports.Plugin = undefined;

  var _jquery2 = babelHelpers.interopRequireDefault(_jquery);

  var plugins = {};
  var apis = {};

  var Plugin = function () {
    function Plugin($el) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      babelHelpers.classCallCheck(this, Plugin);

      this.name = this.getName();
      this.$el = $el;
      this.options = options;
      this.isRendered = false;
    }

    babelHelpers.createClass(Plugin, [{
      key: 'getName',
      value: function getName() {
        return 'plugin';
      }
    }, {
      key: 'render',
      value: function render() {
        if (_jquery2.default.fn[this.name]) {
          this.$el[this.name](this.options);
        } else {
          return false;
        }
      }
    }, {
      key: 'initialize',
      value: function initialize() {
        if (this.isRendered) {
          return false;
        }
        this.render();
        this.isRendered = true;
      }
    }], [{
      key: 'getDefaults',
      value: function getDefaults() {
        return {};
      }
    }, {
      key: 'register',
      value: function register(name, obj) {
        if (typeof obj === 'undefined') {
          return;
        }

        plugins[name] = obj;

        if (typeof obj.api !== 'undefined') {
          Plugin.registerApi(name, obj);
        }
      }
    }, {
      key: 'registerApi',
      value: function registerApi(name, obj) {
        var api = obj.api();

        if (typeof api === 'string') {
          var _api = obj.api().split('|');
          var event = _api[0] + ('.plugin.' + name);
          var func = _api[1] || 'render';

          var callback = function callback(e) {
            var $el = (0, _jquery2.default)(this);
            var plugin = $el.data('pluginInstance');

            if (!plugin) {
              plugin = new obj($el, _jquery2.default.extend(true, {}, getDefaults(name), $el.data()));
              plugin.initialize();
              $el.data('pluginInstance', plugin);
            }

            plugin[func](e);
          };

          apis[name] = function (selector, context) {
            if (context) {
              (0, _jquery2.default)(context).off(event);
              (0, _jquery2.default)(context).on(event, selector, callback);
            } else {
              (0, _jquery2.default)(selector).on(event, callback);
            }
          };
        } else if (typeof api === 'function') {
          apis[name] = api;
        }
      }
    }]);
    return Plugin;
  }();

  function getPluginAPI(name) {
    if (typeof name === 'undefined') {
      return apis;
    } else {
      return apis[name];
    }
  }

  function getPlugin(name) {
    if (typeof plugins[name] !== 'undefined') {
      return plugins[name];
    } else {
      console.warn('Plugin:' + name + ' has no warpped class.');
      return false;
    }
  }

  function getDefaults(name) {
    var PluginClass = getPlugin(name);

    if (PluginClass) {
      return PluginClass.getDefaults();
    } else {
      return {};
    }
  }

  function pluginFactory(name, $el) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    var PluginClass = getPlugin(name);

    if (PluginClass && typeof PluginClass.api === 'undefined') {
      return new PluginClass($el, _jquery2.default.extend(true, {}, getDefaults(name), options));
    } else if (_jquery2.default.fn[name]) {
      var plugin = new Plugin($el, options);
      plugin.getName = function () {
        return name;
      };
      plugin.name = name;
      return plugin;
    } else if (typeof PluginClass.api !== 'undefined') {
      // console.log('Plugin:' + name + ' use api render.');
      return false;
    } else {
      console.warn('Plugin:' + name + ' script is not loaded.');
      return false;
    }
  }

  exports.Plugin = Plugin;
  exports.getPluginAPI = getPluginAPI;
  exports.getPlugin = getPlugin;
  exports.getDefaults = getDefaults;
  exports.pluginFactory = pluginFactory;
  exports.default = Plugin;
});
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define('/Base', ['exports', 'jquery', 'Component', 'Plugin'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('jquery'), require('Component'), require('Plugin'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.jQuery, global.Component, global.Plugin);
    global.Base = mod.exports;
  }
})(this, function (exports, _jquery, _Component2, _Plugin) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _jquery2 = babelHelpers.interopRequireDefault(_jquery);

  var _Component3 = babelHelpers.interopRequireDefault(_Component2);

  var Base = function (_Component) {
    babelHelpers.inherits(Base, _Component);

    function Base() {
      babelHelpers.classCallCheck(this, Base);
      return babelHelpers.possibleConstructorReturn(this, (Base.__proto__ || Object.getPrototypeOf(Base)).apply(this, arguments));
    }

    babelHelpers.createClass(Base, [{
      key: 'initializePlugins',
      value: function initializePlugins() {
        var context = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

        (0, _jquery2.default)('[data-plugin]', context || this.$el).each(function () {
          var $this = (0, _jquery2.default)(this),
              name = $this.data('plugin'),
              plugin = (0, _Plugin.pluginFactory)(name, $this, $this.data());

          if (plugin) {
            plugin.initialize();
          }
        });
      }
    }, {
      key: 'initializePluginAPIs',
      value: function initializePluginAPIs() {
        var context = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document;

        var apis = (0, _Plugin.getPluginAPI)();

        for (var name in apis) {
          (0, _Plugin.getPluginAPI)(name)('[data-plugin=' + name + ']', context);
        }
      }
    }]);
    return Base;
  }(_Component3.default);

  exports.default = Base;
});
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define('/Config', ['exports'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.Config = mod.exports;
  }
})(this, function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var values = {
    fontFamily: 'Noto Sans, sans-serif',
    primaryColor: 'blue',
    assets: '../assets'
  };

  function get() {
    var data = values;
    var callback = function callback(data, name) {
      return data[name];
    };

    for (var _len = arguments.length, names = Array(_len), _key = 0; _key < _len; _key++) {
      names[_key] = arguments[_key];
    }

    for (var i = 0; i < names.length; i++) {
      var name = names[i];

      data = callback(data, name);
    }

    return data;
  }

  function set(name, value) {
    if (typeof name === 'string' && typeof value !== 'undefined') {
      values[name] = value;
    } else if ((typeof name === 'undefined' ? 'undefined' : babelHelpers.typeof(name)) === 'object') {
      values = $.extend(true, {}, values, name);
    }
  }

  function getColor(name, level) {
    if (name === 'primary') {
      name = get('primaryColor');
      if (!name) {
        name = 'red';
      }
    }

    if (typeof values.colors === 'undefined') {
      return null;
    }

    if (typeof values.colors[name] !== 'undefined') {
      if (level && typeof values.colors[name][level] !== 'undefined') {
        return values.colors[name][level];
      }

      if (typeof level === 'undefined') {
        return values.colors[name];
      }
    }

    return null;
  }

  function colors(name, level) {
    return getColor(name, level);
  }

  exports.get = get;
  exports.set = set;
  exports.getColor = getColor;
  exports.colors = colors;
});
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define('/Section/Menubar', ['exports', 'jquery', 'Component'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('jquery'), require('Component'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.jQuery, global.Component);
    global.SectionMenubar = mod.exports;
  }
})(this, function (exports, _jquery, _Component2) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _jquery2 = babelHelpers.interopRequireDefault(_jquery);

  var _Component3 = babelHelpers.interopRequireDefault(_Component2);

  var $BODY = (0, _jquery2.default)('body');
  var $HTML = (0, _jquery2.default)('html');

  var Scrollable = function () {
    function Scrollable($el) {
      babelHelpers.classCallCheck(this, Scrollable);

      this.$el = $el;
      this.native = false;
      this.api = null;

      this.init();
    }

    babelHelpers.createClass(Scrollable, [{
      key: 'init',
      value: function init() {
        if ($BODY.is('.site-menubar-native')) {
          this.native = true;
          return;
        }

        this.api = this.$el.asScrollable({
          namespace: 'scrollable',
          skin: 'scrollable-inverse',
          direction: 'vertical',
          contentSelector: '>',
          containerSelector: '>'
        }).data('asScrollable');
      }
    }, {
      key: 'update',
      value: function update() {
        if (this.api) {
          this.api.update();
        }
      }
    }, {
      key: 'enable',
      value: function enable() {
        if (this.native) {
          return;
        }
        if (!this.api) {
          this.init();
        }
        if (this.api) {
          this.api.enable();
        }
      }
    }, {
      key: 'disable',
      value: function disable() {
        if (this.api) {
          this.api.disable();
        }
      }
    }]);
    return Scrollable;
  }();

  var Hoverscroll = function () {
    function Hoverscroll($el) {
      babelHelpers.classCallCheck(this, Hoverscroll);

      this.$el = $el;
      this.api = null;

      this.init();
    }

    babelHelpers.createClass(Hoverscroll, [{
      key: 'init',
      value: function init() {
        this.api = this.$el.asHoverScroll({
          namespace: 'hoverscorll',
          direction: 'vertical',
          list: '.site-menu',
          item: '> li',
          exception: '.site-menu-sub',
          fixed: false,
          boundary: 100,
          onEnter: function onEnter() {
            // $(this).siblings().removeClass('hover'); $(this).addClass('hover');
          },
          onLeave: function onLeave() {
            // $(this).removeClass('hover');
          }
        }).data('asHoverScroll');
      }
    }, {
      key: 'update',
      value: function update() {
        if (this.api) {
          this.api.update();
        }
      }
    }, {
      key: 'enable',
      value: function enable() {
        if (!this.api) {
          this.init();
        }
        if (this.api) {
          this.api.enable();
        }
      }
    }, {
      key: 'disable',
      value: function disable() {
        if (this.api) {
          this.api.disable();
        }
      }
    }]);
    return Hoverscroll;
  }();

  var Menubar = function (_Component) {
    babelHelpers.inherits(Menubar, _Component);

    function Menubar() {
      var _ref;

      babelHelpers.classCallCheck(this, Menubar);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var _this = babelHelpers.possibleConstructorReturn(this, (_ref = Menubar.__proto__ || Object.getPrototypeOf(Menubar)).call.apply(_ref, [this].concat(args)));

      _this.top = false;
      _this.folded = false;
      _this.foldAlt = false;
      _this.$menuBody = _this.$el.children('.site-menubar-body');
      _this.$menu = _this.$el.find('[data-plugin=menu]');

      if ($BODY.data('autoMenubar') === false || $BODY.is('.site-menubar-keep')) {
        if ($BODY.hasClass('site-menubar-fold')) {
          _this.auto = 'fold';
        } else if ($BODY.hasClass('site-menubar-unfold')) {
          _this.auto = 'unfold';
        }
      } else {
        _this.auto = true;
      }

      var breakpoint = Breakpoints.current();
      if (_this.auto === true) {
        if (breakpoint) {
          switch (breakpoint.name) {
            case 'lg':
              _this.type = 'unfold';
              break;
            case 'md':
            case 'sm':
              _this.type = 'fold';
              break;
            case 'xs':
              _this.type = 'hide';
              break;
          }
        }
      } else {
        switch (_this.auto) {
          case 'fold':
            if (breakpoint.name == 'xs') {
              _this.type = 'hide';
            } else {
              _this.type = 'fold';
            }
            break;
          case 'unfold':
            if (breakpoint.name == 'xs') {
              _this.type = 'hide';
            } else {
              _this.type = 'unfold';
            }
            break;
        }
      }
      return _this;
    }

    babelHelpers.createClass(Menubar, [{
      key: 'initialize',
      value: function initialize() {
        if (this.$menuBody.length > 0) {
          this.initialized = true;
        } else {
          this.initialized = false;
          return;
        }

        this.scrollable = new Scrollable(this.$menuBody);
        this.hoverscroll = new Hoverscroll(this.$menuBody);

        $HTML.removeClass('css-menubar').addClass('js-menubar');

        if ($BODY.is('.site-menubar-top')) {
          this.top = true;
        }

        if ($BODY.is('.site-menubar-fold-alt')) {
          this.foldAlt = true;
        }

        this.change(this.type);
      }
    }, {
      key: 'process',
      value: function process() {
        (0, _jquery2.default)('.site-menu-sub').on('touchstart', function (e) {
          e.stopPropagation();
        }).on('ponitstart', function (e) {
          e.stopPropagation();
        });
      }
    }, {
      key: 'getMenuApi',
      value: function getMenuApi() {
        return this.$menu.data('menuApi');
      }
    }, {
      key: 'setMenuData',
      value: function setMenuData() {
        var api = this.getMenuApi();

        if (api) {
          api.folded = this.folded;
          api.foldAlt = this.foldAlt;
          api.outerHeight = this.$el.outerHeight();
        }
      }
    }, {
      key: 'update',
      value: function update() {
        this.scrollable.update();
        this.hoverscroll.update();
      }
    }, {
      key: 'change',
      value: function change(type) {
        if (this.initialized) {
          this.reset();
          this[type]();
          this.setMenuData();
        }
      }
    }, {
      key: 'animate',
      value: function animate(doing) {
        var _this2 = this;

        var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};

        $BODY.addClass('site-menubar-changing');

        doing.call(this);

        this.$el.trigger('changing.site.menubar');

        var menuApi = this.getMenuApi();
        if (menuApi) {
          menuApi.refresh();
        }

        setTimeout(function () {
          callback.call(_this2);
          $BODY.removeClass('site-menubar-changing');
          _this2.update();
          _this2.$el.trigger('changed.site.menubar');
        }, 500);
      }
    }, {
      key: 'reset',
      value: function reset() {
        $BODY.removeClass('site-menubar-hide site-menubar-open site-menubar-fold site-menubar-unfold');
        $HTML.removeClass('disable-scrolling');
      }
    }, {
      key: 'open',
      value: function open() {
        this.animate(function () {
          $BODY.addClass('site-menubar-open site-menubar-unfold');

          $HTML.addClass('disable-scrolling');
        }, function () {
          this.scrollable.enable();
        });

        this.type = 'open';
      }
    }, {
      key: 'hide',
      value: function hide() {
        this.hoverscroll.disable();

        this.animate(function () {
          $BODY.addClass('site-menubar-hide site-menubar-unfold');
        }, function () {
          this.scrollable.enable();
        });

        this.type = 'hide';
      }
    }, {
      key: 'unfold',
      value: function unfold() {
        this.hoverscroll.disable();

        this.animate(function () {
          $BODY.addClass('site-menubar-unfold');
          this.folded = false;
        }, function () {
          this.scrollable.enable();

          this.triggerResize();
        });

        this.type = 'unfold';
      }
    }, {
      key: 'fold',
      value: function fold() {
        this.scrollable.disable();

        this.animate(function () {
          $BODY.addClass('site-menubar-fold');
          this.folded = true;
        }, function () {
          this.hoverscroll.enable();

          this.triggerResize();
        });

        this.type = 'fold';
      }
    }]);
    return Menubar;
  }(_Component3.default);

  exports.default = Menubar;
});
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define('/Section/GridMenu', ['exports', 'jquery', 'Component'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('jquery'), require('Component'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.jQuery, global.Component);
    global.SectionGridMenu = mod.exports;
  }
})(this, function (exports, _jquery, _Component2) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _jquery2 = babelHelpers.interopRequireDefault(_jquery);

  var _Component3 = babelHelpers.interopRequireDefault(_Component2);

  var $BODY = (0, _jquery2.default)('body');
  var $HTML = (0, _jquery2.default)('html');

  var Scrollable = function () {
    function Scrollable($el) {
      babelHelpers.classCallCheck(this, Scrollable);

      this.$el = $el;
      this.api = null;

      this.init();
    }

    babelHelpers.createClass(Scrollable, [{
      key: 'init',
      value: function init() {
        this.api = this.$el.asScrollable({
          namespace: 'scrollable',
          skin: 'scrollable-inverse',
          direction: 'vertical',
          contentSelector: '>',
          containerSelector: '>'
        }).data('asScrollable');
      }
    }, {
      key: 'update',
      value: function update() {
        if (this.api) {
          this.api.update();
        }
      }
    }, {
      key: 'enable',
      value: function enable() {
        if (!this.api) {
          this.init();
        }
        if (this.api) {
          this.api.enable();
        }
      }
    }, {
      key: 'disable',
      value: function disable() {
        if (this.api) {
          this.api.disable();
        }
      }
    }]);
    return Scrollable;
  }();

  var GridMenu = function (_Component) {
    babelHelpers.inherits(GridMenu, _Component);

    function GridMenu() {
      var _ref;

      babelHelpers.classCallCheck(this, GridMenu);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var _this = babelHelpers.possibleConstructorReturn(this, (_ref = GridMenu.__proto__ || Object.getPrototypeOf(GridMenu)).call.apply(_ref, [this].concat(args)));

      _this.isOpened = false;
      _this.scrollable = new Scrollable(_this.$el);
      return _this;
    }

    babelHelpers.createClass(GridMenu, [{
      key: 'open',
      value: function open() {
        this.animate(function () {
          this.$el.addClass('active');

          (0, _jquery2.default)('[data-toggle="gridmenu"]').addClass('active').attr('aria-expanded', true);

          $BODY.addClass('site-gridmenu-active');
          $HTML.addClass('disable-scrolling');
        }, function () {
          this.scrollable.enable();
        });

        this.isOpened = true;
      }
    }, {
      key: 'close',
      value: function close() {
        this.animate(function () {
          this.$el.removeClass('active');

          (0, _jquery2.default)('[data-toggle="gridmenu"]').addClass('active').attr('aria-expanded', true);

          $BODY.removeClass('site-gridmenu-active');
          $HTML.removeClass('disable-scrolling');
        }, function () {
          this.scrollable.disable();
        });

        this.isOpened = false;
      }
    }, {
      key: 'toggle',
      value: function toggle(opened) {
        if (opened) {
          this.open();
        } else {
          this.close();
        }
      }
    }, {
      key: 'animate',
      value: function animate(doing, callback) {
        var _this2 = this;

        doing.call(this);
        this.$el.trigger('changing.site.gridmenu');

        setTimeout(function () {
          callback.call(_this2);

          _this2.$el.trigger('changed.site.gridmenu');
        }, 500);
      }
    }]);
    return GridMenu;
  }(_Component3.default);

  exports.default = GridMenu;
});
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define('/Section/Sidebar', ['exports', 'jquery', 'Base', 'Plugin'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('jquery'), require('Base'), require('Plugin'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.jQuery, global.Base, global.Plugin);
    global.SectionSidebar = mod.exports;
  }
})(this, function (exports, _jquery, _Base2, _Plugin) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _jquery2 = babelHelpers.interopRequireDefault(_jquery);

  var _Base3 = babelHelpers.interopRequireDefault(_Base2);

  var Sidebar = function (_Base) {
    babelHelpers.inherits(Sidebar, _Base);

    function Sidebar() {
      babelHelpers.classCallCheck(this, Sidebar);
      return babelHelpers.possibleConstructorReturn(this, (Sidebar.__proto__ || Object.getPrototypeOf(Sidebar)).apply(this, arguments));
    }

    babelHelpers.createClass(Sidebar, [{
      key: 'process',
      value: function process() {
        if (typeof _jquery2.default.slidePanel === 'undefined') {
          return;
        }
        var sidebar = this;
        (0, _jquery2.default)(document).on('click', '[data-toggle="site-sidebar"]', function () {
          var $this = (0, _jquery2.default)(this);

          var direction = 'right';
          if ((0, _jquery2.default)('body').hasClass('site-menubar-flipped')) {
            direction = 'left';
          }

          var options = _jquery2.default.extend({}, (0, _Plugin.getDefaults)('slidePanel'), {
            direction: direction,
            skin: 'site-sidebar',
            dragTolerance: 80,
            template: function template(options) {
              return '<div class="' + options.classes.base + ' ' + options.classes.base + '-' + options.direction + '">\n\t    <div class="' + options.classes.content + ' site-sidebar-content"></div>\n\t    <div class="slidePanel-handler"></div>\n\t    </div>';
            },
            afterLoad: function afterLoad() {
              var self = this;
              this.$panel.find('.tab-pane').asScrollable({
                namespace: 'scrollable',
                contentSelector: '> div',
                containerSelector: '> div'
              });

              sidebar.initializePlugins(self.$panel);

              this.$panel.on('shown.bs.tab', function () {
                self.$panel.find('.tab-pane.active').asScrollable('update');
              });
            },
            beforeShow: function beforeShow() {
              if (!$this.hasClass('active')) {
                $this.addClass('active');
              }
            },
            afterHide: function afterHide() {
              if ($this.hasClass('active')) {
                $this.removeClass('active');
              }
            }
          });

          if ($this.hasClass('active')) {
            _jquery2.default.slidePanel.hide();
          } else {
            var url = $this.data('url');
            if (!url) {
              url = $this.attr('href');
              url = url && url.replace(/.*(?=#[^\s]*$)/, '');
            }

            _jquery2.default.slidePanel.show({
              url: url
            }, options);
          }
        });

        (0, _jquery2.default)(document).on('click', '[data-toggle="show-chat"]', function () {
          (0, _jquery2.default)('#conversation').addClass('active');
        });

        (0, _jquery2.default)(document).on('click', '[data-toggle="close-chat"]', function () {
          (0, _jquery2.default)('#conversation').removeClass('active');
        });
      }
    }]);
    return Sidebar;
  }(_Base3.default);

  exports.default = Sidebar;
});
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define('/Section/PageAside', ['exports', 'jquery', 'Component'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('jquery'), require('Component'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.jQuery, global.Component);
    global.SectionPageAside = mod.exports;
  }
})(this, function (exports, _jquery, _Component2) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _jquery2 = babelHelpers.interopRequireDefault(_jquery);

  var _Component3 = babelHelpers.interopRequireDefault(_Component2);

  var $BODY = (0, _jquery2.default)('body');

  var PageAside = function (_Component) {
    babelHelpers.inherits(PageAside, _Component);

    function PageAside() {
      var _ref;

      babelHelpers.classCallCheck(this, PageAside);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var _this = babelHelpers.possibleConstructorReturn(this, (_ref = PageAside.__proto__ || Object.getPrototypeOf(PageAside)).call.apply(_ref, [this].concat(args)));

      _this.$scroll = _this.$el.find('.page-aside-scroll');
      _this.scrollable = _this.$scroll.asScrollable({
        namespace: 'scrollable',
        contentSelector: '> [data-role=\'content\']',
        containerSelector: '> [data-role=\'container\']'
      }).data('asScrollable');
      return _this;
    }

    babelHelpers.createClass(PageAside, [{
      key: 'process',
      value: function process() {
        var _this2 = this;

        if ($BODY.is('.page-aside-fixed') || $BODY.is('.page-aside-scroll')) {
          this.$el.on('transitionend', function () {
            _this2.scrollable.update();
          });
        }

        Breakpoints.on('change', function () {
          var current = Breakpoints.current().name;

          if (!$BODY.is('.page-aside-fixed') && !$BODY.is('.page-aside-scroll')) {
            if (current === 'xs') {
              _this2.scrollable.enable();
              _this2.$el.on('transitionend', function () {
                _this2.scrollable.update();
              });
            } else {
              _this2.$el.off('transitionend');
              _this2.scrollable.update();
            }
          }
        });

        (0, _jquery2.default)(document).on('click.pageAsideScroll', '.page-aside-switch', function () {
          var isOpen = _this2.$el.hasClass('open');

          if (isOpen) {
            _this2.$el.removeClass('open');
          } else {
            _this2.scrollable.update();
            _this2.$el.addClass('open');
          }
        });

        (0, _jquery2.default)(document).on('click.pageAsideScroll', '[data-toggle="collapse"]', function (e) {
          var $trigger = (0, _jquery2.default)(e.target);
          if (!$trigger.is('[data-toggle="collapse"]')) {
            $trigger = $trigger.parents('[data-toggle="collapse"]');
          }
          var href = void 0;
          var target = $trigger.attr('data-target') || (href = $trigger.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '');
          var $target = (0, _jquery2.default)(target);

          if ($target.attr('id') === 'site-navbar-collapse') {
            _this2.scrollable.update();
          }
        });
      }
    }]);
    return PageAside;
  }(_Component3.default);

  exports.default = PageAside;
});
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define('/Plugin/menu', ['exports', 'Plugin'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('Plugin'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.Plugin);
    global.PluginMenu = mod.exports;
  }
})(this, function (exports, _Plugin2) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _Plugin3 = babelHelpers.interopRequireDefault(_Plugin2);

  var NAME = 'menu';

  var Menu = function (_Plugin) {
    babelHelpers.inherits(Menu, _Plugin);

    function Menu() {
      var _ref;

      babelHelpers.classCallCheck(this, Menu);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var _this = babelHelpers.possibleConstructorReturn(this, (_ref = Menu.__proto__ || Object.getPrototypeOf(Menu)).call.apply(_ref, [this].concat(args)));

      _this.folded = true;
      _this.foldAlt = true;
      _this.outerHeight = 0;
      return _this;
    }

    babelHelpers.createClass(Menu, [{
      key: 'getName',
      value: function getName() {
        return NAME;
      }
    }, {
      key: 'render',
      value: function render() {
        this.bindEvents();
        this.$el.data('menuApi', this);
      }
    }, {
      key: 'bindEvents',
      value: function bindEvents() {
        var self = this;

        this.$el.on('mouseenter.site.menu', '.site-menu-item', function () {
          var $item = $(this);
          if (self.folded === true && $item.is('.has-sub') && $item.parent('.site-menu').length > 0) {
            var $sub = $item.children('.site-menu-sub');
            self.position($item, $sub);
          }
          $item.addClass('hover');
        }).on('mouseleave.site.menu', '.site-menu-item', function () {
          var $item = $(this);
          if (self.folded === true && $item.is('.has-sub') && $item.parent('.site-menu').length > 0) {
            $item.children('.site-menu-sub').css('max-height', '');
            $item.removeClass('open');
          }
          $item.removeClass('hover');
        }).on('deactive.site.menu', '.site-menu-item.active', function (e) {
          $(this).removeClass('active');

          e.stopPropagation();
        }).on('active.site.menu', '.site-menu-item', function (e) {
          $(this).addClass('active');

          e.stopPropagation();
        }).on('open.site.menu', '.site-menu-item', function (e) {
          var $item = $(this);

          self.expand($item, function () {
            $item.addClass('open');
          });

          if (self.options.accordion) {
            $item.siblings('.open').trigger('close.site.menu');
          }

          e.stopPropagation();
        }).on('close.site.menu', '.site-menu-item.open', function (e) {
          var $item = $(this);

          self.collapse($item, function () {
            $item.removeClass('open');
          });

          e.stopPropagation();
        }).on('click.site.menu ', '.site-menu-item', function (e) {
          var $item = $(this);

          if ($item.is('.has-sub') && $(e.target).closest('.site-menu-item').is(this)) {
            if ($item.is('.open')) {
              $item.trigger('close.site.menu');
            } else {
              $item.trigger('open.site.menu');
            }
          } else if (!$item.is('.active')) {
            $item.siblings('.active').trigger('deactive.site.menu');
            $item.trigger('active.site.menu');
          }

          e.stopPropagation();
        }).on('tap.site.menu', '> .site-menu-item > a', function () {
          var link = $(this).attr('href');

          if (link) {
            window.location = link;
          }
        }).on('touchend.site.menu', '> .site-menu-item > a', function () {
          var $item = $(this).parent('.site-menu-item');

          if (self.folded === true) {
            if ($item.is('.has-sub') && $item.parent('.site-menu').length > 0) {
              $item.siblings('.hover').removeClass('hover');

              if ($item.is('.hover')) {
                $item.removeClass('hover');
              } else {
                $item.addClass('hover');
              }
            }
          }
        }).on('scroll.site.menu', '.site-menu-sub', function (e) {
          e.stopPropagation();
        });
      }
    }, {
      key: 'collapse',
      value: function collapse($item, callback) {
        var self = this;
        var $sub = $item.children('.site-menu-sub');

        $sub.show().slideUp(this.options.speed, function () {
          $(this).css('display', '');

          $(this).find('> .site-menu-item').removeClass('is-shown');

          if (callback) {
            callback();
          }

          self.$el.trigger('collapsed.site.menu');
        });
      }
    }, {
      key: 'expand',
      value: function expand($item, callback) {
        var self = this;
        var $sub = $item.children('.site-menu-sub');
        var $children = $sub.children('.site-menu-item').addClass('is-hidden');

        $sub.hide().slideDown(this.options.speed, function () {
          $(this).css('display', '');

          if (callback) {
            callback();
          }

          self.$el.trigger('expanded.site.menu');
        });

        setTimeout(function () {
          $children.addClass('is-shown');
          $children.removeClass('is-hidden');
        }, 0);
      }
    }, {
      key: 'refresh',
      value: function refresh() {
        this.$el.find('.open').filter(':not(.active)').removeClass('open');
      }
    }, {
      key: 'position',
      value: function position($item, $dropdown) {
        var itemHeight = $item.find('> a').outerHeight(),
            menubarHeight = this.outerHeight,
            offsetTop = $item.position().top;

        $dropdown.removeClass('site-menu-sub-up').css('max-height', '');

        if (offsetTop > menubarHeight / 2) {
          $dropdown.addClass('site-menu-sub-up');

          if (this.foldAlt) {
            offsetTop -= itemHeight;
          }
          $dropdown.css('max-height', offsetTop + itemHeight);
        } else {
          if (this.foldAlt) {
            offsetTop += itemHeight;
          }
          $dropdown.removeClass('site-menu-sub-up');
          $dropdown.css('max-height', menubarHeight - offsetTop);
        }
      }
    }], [{
      key: 'getDefaults',
      value: function getDefaults() {
        return {
          speed: 250,
          accordion: true
        };
      }
    }]);
    return Menu;
  }(_Plugin3.default);

  _Plugin3.default.register(NAME, Menu);

  exports.default = Menu;
});
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define('/config/colors', ['Config'], factory);
  } else if (typeof exports !== "undefined") {
    factory(require('Config'));
  } else {
    var mod = {
      exports: {}
    };
    factory(global.Config);
    global.configColors = mod.exports;
  }
})(this, function (_Config) {
  'use strict';

  (0, _Config.set)('colors', {
    red: {
      '100': '#ffdbdc',
      '200': '#ffbfc1',
      '300': '#ffbfc1',
      '400': '#ff8589',
      '500': '#ff666b',
      '600': '#ff4c52',
      '700': '#f2353c',
      '800': '#e62020',
      '900': '#d60b0b'
    },
    pink: {
      '100': '#ffd9e6',
      '200': '#ffbad2',
      '300': '#ff9ec0',
      '400': '#ff7daa',
      '500': '#ff5e97',
      '600': '#f74584',
      '700': '#eb2f71',
      '800': '#e6155e',
      '900': '#d10049'
    },
    purple: {
      '100': '#eae1fc',
      '200': '#d9c7fc',
      '300': '#c8aefc',
      '400': '#b693fa',
      '500': '#a57afa',
      '600': '#9463f7',
      '700': '#8349f5',
      '800': '#7231f5',
      '900': '#6118f2'
    },
    indigo: {
      '100': '#e1e4fc',
      '200': '#c7cffc',
      '300': '#afb9fa',
      '400': '#96a3fa',
      '500': '#7d8efa',
      '600': '#667afa',
      '700': '#4d64fa',
      '800': '#364ff5',
      '900': '#1f3aed'
    },
    blue: {
      '100': '#d9e9ff',
      '200': '#b8d7ff',
      '300': '#99c5ff',
      '400': '#79b2fc',
      '500': '#589ffc',
      '600': '#3e8ef7',
      '700': '#247cf0',
      '800': '#0b69e3',
      '900': '#0053bf'
    },
    cyan: {
      '100': '#c2f5ff',
      '200': '#9de6f5',
      '300': '#77d9ed',
      '400': '#54cbe3',
      '500': '#28c0de',
      '600': '#0bb2d4',
      '700': '#0099b8',
      '800': '#007d96',
      '900': '#006275'
    },
    teal: {
      '100': '#c3f7f2',
      '200': '#92f0e6',
      '300': '#6be3d7',
      '400': '#45d6c8',
      '500': '#28c7b7',
      '600': '#17b3a3',
      '700': '#089e8f',
      '800': '#008577',
      '900': '#00665c'
    },
    green: {
      '100': '#c2fadc',
      '200': '#99f2c2',
      '300': '#72e8ab',
      '400': '#49de94',
      '500': '#28d17c',
      '600': '#11c26d',
      '700': '#05a85c',
      '800': '#008c4d',
      '900': '#006e3c'
    },
    'light-green': {
      '100': '#dcf7b0',
      '200': '#c3e887',
      '300': '#add966',
      '400': '#94cc39',
      '500': '#7eb524',
      '600': '#6da611',
      '700': '#5a9101',
      '800': '#4a7800',
      '900': '#3a5e00'
    },
    yellow: {
      '100': '#fff6b5',
      '200': '#fff39c',
      '300': '#ffed78',
      '400': '#ffe54f',
      '500': '#ffdc2e',
      '600': '#ffcd17',
      '700': '#fcb900',
      '800': '#faa700',
      '900': '#fa9600'
    },
    orange: {
      '100': '#ffe1c4',
      '200': '#ffc894',
      '300': '#fab06b',
      '400': '#fa983c',
      '500': '#f57d1b',
      '600': '#eb6709',
      '700': '#de4e00',
      '800': '#b53f00',
      '900': '#962d00'
    },
    brown: {
      '100': '#f5e2da',
      '200': '#e0cdc5',
      '300': '#cfb8b0',
      '400': '#bda299',
      '500': '#ab8c82',
      '600': '#997b71',
      '700': '#82675f',
      '800': '#6b534c',
      '900': '#57403a'
    },
    grey: {
      '100': '#fafafa',
      '200': '#eeeeee',
      '300': '#e0e0e0',
      '400': '#bdbdbd',
      '500': '#9e9e9e',
      '600': '#757575',
      '700': '#616161',
      '800': '#424242'
    },
    'blue-grey': {
      '100': '#f3f7f9',
      '200': '#e4eaec',
      '300': '#ccd5db',
      '400': '#a3afb7',
      '500': '#76838f',
      '600': '#526069',
      '700': '#37474f',
      '800': '#263238'
    }
  });
});
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define('/Site', ['exports', 'jquery', 'Config', 'Base', 'Menubar', 'GridMenu', 'Sidebar', 'PageAside'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('jquery'), require('Config'), require('Base'), require('Menubar'), require('GridMenu'), require('Sidebar'), require('PageAside'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.jQuery, global.Config, global.Base, global.SectionMenubar, global.SectionGridMenu, global.SectionSidebar, global.SectionPageAside);
    global.Site = mod.exports;
  }
})(this, function (exports, _jquery, _Config, _Base2, _Menubar, _GridMenu, _Sidebar, _PageAside) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.getInstance = exports.run = exports.Site = undefined;

  var _jquery2 = babelHelpers.interopRequireDefault(_jquery);

  var _Base3 = babelHelpers.interopRequireDefault(_Base2);

  var _Menubar2 = babelHelpers.interopRequireDefault(_Menubar);

  var _GridMenu2 = babelHelpers.interopRequireDefault(_GridMenu);

  var _Sidebar2 = babelHelpers.interopRequireDefault(_Sidebar);

  var _PageAside2 = babelHelpers.interopRequireDefault(_PageAside);

  var DOC = document;
  var $DOC = (0, _jquery2.default)(document);
  var $BODY = (0, _jquery2.default)('body');

  var Site = function (_Base) {
    babelHelpers.inherits(Site, _Base);

    function Site() {
      babelHelpers.classCallCheck(this, Site);
      return babelHelpers.possibleConstructorReturn(this, (Site.__proto__ || Object.getPrototypeOf(Site)).apply(this, arguments));
    }

    babelHelpers.createClass(Site, [{
      key: 'initialize',
      value: function initialize() {
        var _this2 = this;

        this.startLoading();
        this.initializePluginAPIs();
        this.initializePlugins();

        this.initComponents();

        setTimeout(function () {
          _this2.setDefaultState();
        }, 500);
      }
    }, {
      key: 'process',
      value: function process() {
        this.polyfillIEWidth();
        this.initBootstrap();

        this.setupMenubar();
        this.setupGridMenu();
        this.setupFullScreen();
        this.setupMegaNavbar();
        this.setupTour();
        this.setupNavbarCollpase();
        // Dropdown menu setup ===================
        this.$el.on('click', '.dropdown-menu-media', function (e) {
          e.stopPropagation();
        });
      }
    }, {
      key: '_getDefaultMeunbarType',
      value: function _getDefaultMeunbarType() {
        var breakpoint = this.getCurrentBreakpoint(),
            type = false;

        if ($BODY.data('autoMenubar') === false || $BODY.is('.site-menubar-keep')) {
          if ($BODY.hasClass('site-menubar-fold')) {
            type = 'fold';
          } else if ($BODY.hasClass('site-menubar-unfold')) {
            type = 'unfold';
          }
        }

        switch (breakpoint) {
          case 'lg':
            type = type || 'unfold';
            break;
          case 'md':
          case 'sm':
            type = type || 'fold';
            break;
          case 'xs':
            type = 'hide';
            break;
          // no default
        }
        return type;
      }
    }, {
      key: 'setDefaultState',
      value: function setDefaultState() {
        var defaultState = this.getDefaultState();

        // menubar
        this.menubar.change(defaultState.menubarType);
        // gridmenu
        this.gridmenu.toggle(defaultState.gridmenu);
      }
    }, {
      key: 'getDefaultState',
      value: function getDefaultState() {
        var menubarType = this._getDefaultMeunbarType();
        return {
          menubarType: menubarType,
          gridmenu: false
        };
      }
    }, {
      key: 'menubarType',
      value: function menubarType(type) {
        var toggle = function toggle($el) {
          $el.toggleClass('hided', !(type === 'open'));
          $el.toggleClass('unfolded', !(type === 'fold'));
        };

        (0, _jquery2.default)('[data-toggle="menubar"]').each(function () {
          var $this = (0, _jquery2.default)(this);
          var $hamburger = (0, _jquery2.default)(this).find('.hamburger');

          if ($hamburger.length > 0) {
            toggle($hamburger);
          } else {
            toggle($this);
          }
        });
      }
    }, {
      key: 'initComponents',
      value: function initComponents() {
        var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;

        this.menubar = new _Menubar2.default({
          $el: (0, _jquery2.default)('.site-menubar')
        });
        this.gridmenu = new _GridMenu2.default({
          $el: (0, _jquery2.default)('.site-gridmenu')
        });
        this.sidebar = new _Sidebar2.default();

        var $aside = (0, _jquery2.default)('.page-aside');
        if ($aside.length > 0) {
          this.aside = new _PageAside2.default({
            $el: $aside
          });
          this.aside.run();
        }

        this.menubar.run();
        this.sidebar.run();
      }
    }, {
      key: 'getCurrentBreakpoint',
      value: function getCurrentBreakpoint() {
        var bp = Breakpoints.current();
        return bp ? bp.name : 'lg';
      }
    }, {
      key: 'initBootstrap',
      value: function initBootstrap() {
        // Tooltip setup =============
        $DOC.tooltip({
          selector: '[data-tooltip=true]',
          container: 'body'
        });

        (0, _jquery2.default)('[data-toggle="tooltip"]').tooltip();
        (0, _jquery2.default)('[data-toggle="popover"]').popover();
      }
    }, {
      key: 'polyfillIEWidth',
      value: function polyfillIEWidth() {
        if (navigator.userAgent.match(/IEMobile\/10\.0/)) {
          var msViewportStyle = DOC.createElement('style');
          msViewportStyle.appendChild(DOC.createTextNode('@-ms-viewport{width:auto!important}'));
          DOC.querySelector('head').appendChild(msViewportStyle);
        }
      }
    }, {
      key: 'setupFullScreen',
      value: function setupFullScreen() {
        if (typeof screenfull !== 'undefined') {
          $DOC.on('click', '[data-toggle="fullscreen"]', function () {
            if (screenfull.enabled) {
              screenfull.toggle();
            }

            return false;
          });

          if (screenfull.enabled) {
            DOC.addEventListener(screenfull.raw.fullscreenchange, function () {
              (0, _jquery2.default)('[data-toggle="fullscreen"]').toggleClass('active', screenfull.isFullscreen);
            });
          }
        }
      }
    }, {
      key: 'setupGridMenu',
      value: function setupGridMenu() {
        var self = this;

        $DOC.on('click', '[data-toggle="gridmenu"]', function () {
          var $this = (0, _jquery2.default)(this);
          var isOpened = self.gridmenu.isOpened;

          if (isOpened) {
            $this.addClass('active').attr('aria-expanded', true);
          } else {
            $this.removeClass('active').attr('aria-expanded', false);
          }

          self.gridmenu.toggle(!isOpened);
        });
      }
    }, {
      key: 'setupMegaNavbar',
      value: function setupMegaNavbar() {
        $DOC.on('click', '.navbar-mega .dropdown-menu', function (e) {
          e.stopPropagation();
        }).on('show.bs.dropdown', function (e) {
          var $target = (0, _jquery2.default)(e.target);
          var $trigger = e.relatedTarget ? (0, _jquery2.default)(e.relatedTarget) : $target.children('[data-toggle="dropdown"]');
          var animation = $trigger.data('animation');

          if (animation) {
            var $menu = $target.children('.dropdown-menu');
            $menu.addClass('animation-' + animation).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
              $menu.removeClass('animation-' + animation);
            });
          }
        }).on('shown.bs.dropdown', function (e) {
          var $menu = (0, _jquery2.default)(e.target).find('.dropdown-menu-media > .list-group');
          if ($menu.length > 0) {
            var api = $menu.data('asScrollable');
            if (api) {
              api.update();
            } else {
              $menu.asScrollable({
                namespace: 'scrollable',
                contentSelector: '> [data-role=\'content\']',
                containerSelector: '> [data-role=\'container\']'
              });
            }
          }
        });
      }
    }, {
      key: 'setupMenubar',
      value: function setupMenubar() {
        var _this3 = this;

        (0, _jquery2.default)(document).on('click', '[data-toggle="menubar"]:visible', function () {
          var type = _this3.menubar.type;

          switch (type) {
            case 'fold':
              type = 'unfold';
              break;
            case 'unfold':
              type = 'fold';
              break;
            case 'open':
              type = 'hide';
              break;
            case 'hide':
              type = 'open';
              break;
            // no default
          }

          _this3.menubar.change(type);
          _this3.menubarType(type);
          return false;
        });

        Breakpoints.on('change', function () {
          _this3.menubar.type = _this3._getDefaultMeunbarType();
          _this3.menubar.change(_this3.menubar.type);
        });
      }
    }, {
      key: 'setupNavbarCollpase',
      value: function setupNavbarCollpase() {
        (0, _jquery2.default)(document).on('click', '[data-target=\'#site-navbar-collapse\']', function (e) {
          var $trigger = (0, _jquery2.default)(this);
          var isClose = $trigger.hasClass('collapsed');
          $BODY.addClass('site-navbar-collapsing');
          $BODY.toggleClass('site-navbar-collapse-show', !isClose);
          setTimeout(function () {
            $BODY.removeClass('site-navbar-collapsing');
          }, 350);
        });
      }
    }, {
      key: 'startLoading',
      value: function startLoading() {
        if (typeof _jquery2.default.fn.animsition === 'undefined') {
          return false;
        }

        if (!$BODY.hasClass('animsition')) {
          return false;
        }

        var assets = (0, _Config.get)('assets');
        $BODY.animsition({
          inClass: 'fade-in',
          outClass: 'fade-out',
          inDuration: 800,
          outDuration: 500,
          loading: true,
          loadingClass: 'loader-overlay',
          loadingParentElement: 'html',
          loadingInner: '\n      <div class="loader-content">\n        <div class="loader-index">\n          <div></div>\n          <div></div>\n          <div></div>\n          <div></div>\n          <div></div>\n          <div></div>\n        </div>\n      </div>',
          onLoadEvent: true
        });
      }
    }, {
      key: 'setupTour',
      value: function setupTour(flag) {
        if (typeof this.tour === 'undefined') {
          if (typeof introJs === 'undefined') {
            return;
          }
          var overflow = (0, _jquery2.default)('body').css('overflow'),
              self = this,
              tourOptions = (0, _Config.get)('tour');

          this.tour = introJs();

          this.tour.onbeforechange(function () {
            (0, _jquery2.default)('body').css('overflow', 'hidden');
          });

          this.tour.oncomplete(function () {
            (0, _jquery2.default)('body').css('overflow', overflow);
          });

          this.tour.onexit(function () {
            (0, _jquery2.default)('body').css('overflow', overflow);
          });

          this.tour.setOptions(tourOptions);
          (0, _jquery2.default)('.site-tour-trigger').on('click', function () {
            self.tour.start();
          });
        }
      }
    }]);
    return Site;
  }(_Base3.default);

  var instance = null;

  function getInstance() {
    if (!instance) {
      instance = new Site();
    }
    return instance;
  }

  function run() {
    var site = getInstance();
    site.run();
  }

  exports.Site = Site;
  exports.run = run;
  exports.getInstance = getInstance;
  exports.default = Site;
});
(function() {
  $(document).ready(function() {
    return $('[data-toggle=cut]').on('click', function(e) {
      var $target, height, willOpen;
      e.preventDefault();
      $target = $(this.dataset.target);
      willOpen = $target.hasClass('cut');
      if (willOpen) {
        $(this).text(this.dataset.textHide);
        height = $target.children().get(0).offsetHeight;
        $target.css('max-height', height);
        return $target.removeClass('cut');
      } else {
        $(this).text(this.dataset.textShow);
        $target.css('max-height', '');
        return $target.addClass('cut');
      }
    });
  });

}).call(this);
(function() {
  $(function() {
    var Site;
    Breakpoints();
    Site = window.Site;
    return $(document).ready(function() {
      return Site.run();
    });
  });

}).call(this);
(function() {
  $(document).ready(function() {
    var $form, any_assets, any_debts;
    $form = $('form.new_property, form.edit_property');
    if (!$form.length) {
      return;
    }
    any_assets = function() {
      return document.getElementById('property_data[assets_debts][any_assets]_true').checked;
    };
    any_debts = function() {
      return document.getElementById('property_data[assets_debts][any_debts]_true').checked;
    };
    $form.parsley({
      trigger: 'input change changeDate',
      errorClass: 'is-invalid',
      errorsContainer: function(field) {
        return field.$element.closest('.form-group').find('.parsley-error');
      }
    });
    window.Parsley.addValidator('requiredRange', {
      validateNumber: function(value, _, field) {
        var $other, $this;
        if (field.element.name.indexOf('template') !== -1) {
          return true;
        }
        if (field.element.dataset.parsleyRequiredRange === 'false') {
          return true;
        }
        if (!$(field.element).closest('.tab-pane').hasClass('active')) {
          return true;
        }
        if ($(field.element).closest('.assets').length && !any_assets()) {
          return true;
        }
        if ($(field.element).closest('.debts').length && !any_debts()) {
          return true;
        }
        $this = $(field.element);
        $other = $this.closest('.row').find('input[type="range"]').filter(function(i, node) {
          return node !== field.element;
        });
        return $this.val() !== '0' || $other.val() !== '0';
      }
    });
    window.Parsley.addValidator('requiredField', {
      validateString: function(value, _, field) {
        if (field.element.name.indexOf('template') !== -1) {
          return true;
        }
        if (!$(field.element).closest('.tab-pane').hasClass('active')) {
          return true;
        }
        if ($(field.element).closest('.assets').length && !any_assets()) {
          return true;
        }
        if ($(field.element).closest('.debts').length && !any_debts()) {
          return true;
        }
        return value.length > 0;
      }
    });
    return $form.on('changeDate', function(e) {
      return $(e.target).trigger('input');
    });
  });

}).call(this);
(function() {
  $(document).ready(function() {
    var $form, $payment_to_whom_husband, $payment_to_whom_wife, addProperty, beforeValidSubmit, initProperties, numericalSettings, rangeSettings, resetProperties, updatePropertyRemoveButtons, updatePropertyTitles;
    $form = $('.property-form > form');
    if (!$form.length) {
      return;
    }
    rangeSettings = {
      namespace: 'rangeUi',
      min: 0,
      max: 100,
      step: 1,
      scale: false,
      onChange: function() {
        var $after_full, $after_part, $asset, $other, $this, element, entangled, max, other_value, this_value;
        element = this.element;
        $this = $(element);
        $other = $this.closest('.row').find('input[type="range"]').filter(function(i, node) {
          return node !== element;
        });
        this_value = $this.asRange('get');
        other_value = $other.asRange('get');
        entangled = element.dataset.entangled === 'true';
        max = parseInt(element.dataset.maxvalue);
        if (entangled || this_value + other_value > max) {
          $other.asRange('set', max - this_value);
        }
        $asset = $this.closest('.asset');
        if ($asset.length) {
          this_value = $this.asRange('get');
          other_value = $other.asRange('get');
          $after_full = $asset.find('.after-full');
          $after_part = $asset.find('.after-part');
          if (this_value + other_value >= max) {
            $after_full.removeClass('d-none');
            $after_part.addClass('d-none');
          } else {
            $after_full.addClass('d-none');
            $after_part.removeClass('d-none');
            $after_part.find('.after-part-percent').text(this_value + other_value);
          }
        }
        return $this.closest('.form-group').find('.parsley-error').empty();
      }
    };
    numericalSettings = {
      alias: 'integer',
      regex: '\\d*',
      rightAlign: false,
      allowPlus: false,
      allowMinus: false,
      autoGroup: true,
      groupSeparator: ' ',
      removeMaskOnSubmit: true
    };
    beforeValidSubmit = function() {
      var any_assets, any_debts;
      $form.find('.template .asset').remove();
      $form.find('.template .debt').remove();
      any_assets = document.getElementById('property_data[assets_debts][any_assets]_true').checked;
      if (any_assets) {
        $form.find('.asset .tab-pane:not(.active)').remove();
      } else {
        $form.find('.asset').remove();
      }
      any_debts = document.getElementById('property_data[assets_debts][any_debts]_true').checked;
      if (any_debts) {
        return $form.find('.debt .tab-pane:not(.active)').remove();
      } else {
        return $form.find('.debt').remove();
      }
    };
    window.Parsley.on('form:submit', function() {
      return beforeValidSubmit();
    });
    $form.find('.soft-submit').on('click', function() {
      $form.find('#submit_type').val('soft');
      $form.off('submit.Parsley');
      $form.off('form:validate');
      return beforeValidSubmit();
    });
    $form.find('.hard-submit').on('click', function() {
      return $form.find('#submit_type').val('hard');
    });
    $form.find('input[data-slide-target]').on('change', function() {
      var slideTargets;
      slideTargets = this.dataset.slideTarget.split(' ');
      return slideTargets.forEach(function(slideTarget) {
        var $target, show, target;
        target = slideTarget.split(':')[0];
        show = slideTarget.split(':')[1] === 'show';
        $target = $(target);
        if (show) {
          $target.slideDown();
        } else {
          $target.slideUp();
        }
        $target.find('input[data-parsley-required]').each(function() {
          this.dataset.parsleyRequired = show;
          return true;
        });
        if (!show) {
          $target.find('.is-invalid').removeClass('is-invalid');
          return $target.find('ul.parsley-errors-list').remove();
        }
      });
    });
    $payment_to_whom_husband = $('.payment-to-whom input').first();
    $payment_to_whom_wife = $('.payment-to-whom input').last();
    $payment_to_whom_husband.labelauty({
      checked_label: $payment_to_whom_husband.data('name'),
      unchecked_label: $payment_to_whom_husband.data('name')
    });
    $payment_to_whom_wife.labelauty({
      checked_label: $payment_to_whom_wife.data('name'),
      unchecked_label: $payment_to_whom_wife.data('name')
    });
    $form.find('.interest-rate').on('input', function(event) {
      var max, min, val;
      min = parseInt(this.min);
      max = parseInt(this.max);
      val = parseInt(this.value);
      if (val < min) {
        return this.value = this.min;
      } else if (val > max) {
        return this.value = this.max;
      }
    });
    $form.find('.ssn2').inputmask('9{4}', {
      numericInput: true,
      jitMasking: true
    });
    $form.find('.case-number-field').inputmask('T-*{*}', {
      clearMaskOnLostFocus: false
    });
    $form.find('.payment-how-much').inputmask(numericalSettings);
    $form.on('focus', '[type=tel]', function() {
      var isAndroid, isInputmask;
      isInputmask = $(this).inputmask('hasMaskedValue');
      isAndroid = /(android)/i.test(navigator.userAgent);
      if (isInputmask && isAndroid) {
        return this.type = 'number';
      }
    });
    initProperties = function() {
      $form.find('input[type="range"]').filter(function(i, node) {
        return node.id.indexOf('template') === -1;
      }).asRange(rangeSettings);
      $form.find('.numerical').filter(function(i, node) {
        return node.id.indexOf('template') === -1;
      }).inputmask(numericalSettings);
      setTimeout(function() {
        $form.find('.asset a.nav-link.active').click();
        return $form.find('.debt a.nav-link.active').click();
      }, 0);
      return updatePropertyRemoveButtons();
    };
    addProperty = function(type) {
      var $container, $prop, $template, id;
      id = String(Date.now());
      $container = $form.find("." + type + "s");
      $template = $form.find(".template ." + type);
      $prop = $template.clone().removeClass('d-none').appendTo($container);
      $prop.find('a.nav-link').each(function(_, node) {
        var new_id;
        new_id = "#asset_" + node.dataset.tab + "_" + id;
        node.href = new_id;
        return node.setAttribute('aria-controls', new_id);
      });
      $prop.find('.tab-pane').each(function(_, node) {
        var new_id;
        new_id = "asset_" + node.dataset.tab + "_" + id;
        return node.id = new_id;
      });
      $prop.find('.plugin-tabs').tabs();
      $prop.find('input[type="range"]').asRange(rangeSettings);
      $prop.find('input[data-plugin="datepicker"]').datepicker({
        container: '.page'
      });
      $prop.find('.numerical').inputmask(numericalSettings);
      return $prop.find('input').each(function(i, input) {
        var new_name, old_name;
        old_name = $(input).attr('name');
        new_name = old_name.replace('[template]', "[" + id + "]");
        input.id = new_name;
        return input.name = new_name;
      });
    };
    resetProperties = function(type) {
      return setTimeout(function() {
        $form.find("." + type + "s").empty();
        return addProperty(type);
      }, 400);
    };
    updatePropertyTitles = function($tab) {
      var $panel, name, tab;
      tab = $tab.data('tab');
      name = $tab.data('name');
      $panel = $tab.find("#panel_" + tab);
      return $panel.children().each(function(index, entry) {
        return $(entry).find('a.panel-title').text(name + " #" + (index + 1));
      });
    };
    updatePropertyRemoveButtons = function() {
      return ['.assets', '.debts'].forEach(function(propClass) {
        var $parent, single;
        $parent = $(propClass);
        single = $parent.children().length <= 1;
        if (single) {
          return $parent.addClass('single');
        } else {
          return $parent.removeClass('single');
        }
      });
    };
    $form.on('click', '.asset a[data-toggle="tab"], .debt a[data-toggle="tab"]', function() {
      var $parent;
      $parent = $(this).closest('.asset, .debt');
      return $parent.find('.tab-content.d-none').removeClass('d-none');
    });
    $form.on('click', '.add-asset a', function(e) {
      e.preventDefault();
      addProperty('asset');
      return updatePropertyRemoveButtons();
    });
    $form.on('click', '.add-debt a', function(e) {
      e.preventDefault();
      addProperty('debt');
      return updatePropertyRemoveButtons();
    });
    $form.on('click', '.remove-asset', function(e) {
      e.preventDefault();
      $(this).closest('.asset').remove();
      return updatePropertyRemoveButtons();
    });
    $form.on('click', '.remove-debt', function(e) {
      e.preventDefault();
      $(this).closest('.debt').remove();
      return updatePropertyRemoveButtons();
    });
    $form.on('change', 'input[name="property[data[assets_debts][any_assets]]"]', function() {
      return resetProperties('asset');
    });
    $form.on('change', 'input[name="property[data[assets_debts][any_debts]]"]', function() {
      return resetProperties('debt');
    });
    initProperties();
    return $form.on('click', '.faq > .btn', function() {
      var $answer, show;
      $answer = $(this).closest('.faq').find('.faq-body');
      show = $answer.css('display') === 'none';
      if (show) {
        return $answer.slideDown();
      } else {
        return $answer.slideUp();
      }
    });
  });

}).call(this);
























//

;
