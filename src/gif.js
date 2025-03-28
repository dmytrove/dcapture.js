(function (c) {
  function a(b, d) {
    if ({}.hasOwnProperty.call(a.cache, b)) return a.cache[b];
    var e = a.resolve(b);
    if (!e) throw new Error('Failed to resolve module ' + b);
    var c = { id: b, require: a, filename: b, exports: {}, loaded: !1, parent: d, children: [] };
    d && d.children.push(c);
    var f = b.slice(0, b.lastIndexOf('/') + 1);
    return (
      (a.cache[b] = c.exports),
      e.call(c.exports, c, c.exports, f, b),
      (c.loaded = !0),
      (a.cache[b] = c.exports)
    );
  }
  (a.modules = {}),
    (a.cache = {}),
    (a.resolve = function (b) {
      return {}.hasOwnProperty.call(a.modules, b) ? a.modules[b] : void 0;
    }),
    (a.define = function (b, c) {
      a.modules[b] = c;
    });
  var b = (function (a) {
    return (
      (a = '/'),
      {
        title: 'browser',
        version: 'v0.10.26',
        browser: !0,
        env: {},
        argv: [],
        nextTick:
          c.setImmediate ||
          function (a) {
            setTimeout(a, 0);
          },
        cwd: function () {
          return a;
        },
        chdir: function (b) {
          a = b;
        },
      }
    );
  })();
  a.define('/gif.coffee', function (d, m, l, k) {
    function g(a, b) {
      return {}.hasOwnProperty.call(a, b);
    }
    function j(d, b) {
      for (var a = 0, c = b.length; a < c; ++a) if (a in b && b[a] === d) return !0;
      return !1;
    }
    function i(a, b) {
      function d() {
        this.constructor = a;
      }
      for (var c in b) g(b, c) && (a[c] = b[c]);
      return (d.prototype = b.prototype), (a.prototype = new d()), (a.__super__ = b.prototype), a;
    }
    var h, c, f, b, e;
    (f = a('events', d).EventEmitter),
      (h = a('/browser.coffee', d)),
      (e = (function (d) {
        function a(d) {
          var a, b;
          (this.running = !1),
            (this.options = {}),
            (this.frames = []),
            (this.freeWorkers = []),
            (this.activeWorkers = []),
            this.setOptions(d);
          for (a in c)
            (b = c[a]), null != this.options[a] ? this.options[a] : (this.options[a] = b);
        }
        return (
          i(a, d),
          (c = {
            workerScript: 'gif.worker.js',
            workers: 2,
            repeat: 0,
            background: '#fff',
            quality: 10,
            width: null,
            height: null,
            transparent: null,
          }),
          (b = { delay: 500, copy: !1 }),
          (a.prototype.setOption = function (a, b) {
            return (
              (this.options[a] = b),
              null != this._canvas && (a === 'width' || a === 'height')
                ? (this._canvas[a] = b)
                : void 0
            );
          }),
          (a.prototype.setOptions = function (b) {
            var a, c;
            return function (d) {
              for (a in b) {
                if (!g(b, a)) continue;
                (c = b[a]), d.push(this.setOption(a, c));
              }
              return d;
            }.call(this, []);
          }),
          (a.prototype.addFrame = function (a, d) {
            var c, e;
            null == d && (d = {}), (c = {}), (c.transparent = this.options.transparent);
            for (e in b) c[e] = d[e] || b[e];
            if (
              (null != this.options.width || this.setOption('width', a.width),
              null != this.options.height || this.setOption('height', a.height),
              'undefined' !== typeof ImageData && null != ImageData && a instanceof ImageData)
            )
              c.data = a.data;
            else if (
              ('undefined' !== typeof CanvasRenderingContext2D &&
                null != CanvasRenderingContext2D &&
                a instanceof CanvasRenderingContext2D) ||
              ('undefined' !== typeof WebGLRenderingContext &&
                null != WebGLRenderingContext &&
                a instanceof WebGLRenderingContext)
            )
              d.copy ? (c.data = this.getContextData(a)) : (c.context = a);
            else if (null != a.childNodes) d.copy ? (c.data = this.getImageData(a)) : (c.image = a);
            else throw new Error('Invalid image');
            return this.frames.push(c);
          }),
          (a.prototype.render = function () {
            var d, a;
            if (this.running) throw new Error('Already running');
            if (!(null != this.options.width && null != this.options.height))
              throw new Error('Width and height must be set prior to rendering');
            (this.running = !0),
              (this.nextFrame = 0),
              (this.finishedFrames = 0),
              (this.imageParts = function (c) {
                for (
                  var b = function () {
                      var b;
                      b = [];
                      for (
                        var a = 0;
                        0 <= this.frames.length ? a < this.frames.length : a > this.frames.length;
                        0 <= this.frames.length ? ++a : --a
                      )
                        b.push(a);
                      return b;
                    }.apply(this, arguments),
                    a = 0,
                    e = b.length;
                  a < e;
                  ++a
                )
                  (d = b[a]), c.push(null);
                return c;
              }.call(this, [])),
              (a = this.spawnWorkers());
            for (
              var c = function () {
                  var c;
                  c = [];
                  for (var b = 0; 0 <= a ? b < a : b > a; 0 <= a ? ++b : --b) c.push(b);
                  return c;
                }.apply(this, arguments),
                b = 0,
                e = c.length;
              b < e;
              ++b
            )
              (d = c[b]), this.renderNextFrame();
            return this.emit('start'), this.emit('progress', 0);
          }),
          (a.prototype.abort = function () {
            var a;
            while (!0) {
              if (((a = this.activeWorkers.shift()), !(null != a))) break;
              console.log('killing active worker'), a.terminate();
            }
            return (this.running = !1), this.emit('abort');
          }),
          (a.prototype.spawnWorkers = function () {
            var a;
            return (
              (a = Math.min(this.options.workers, this.frames.length)),
              function () {
                var c;
                c = [];
                for (
                  var b = this.freeWorkers.length;
                  this.freeWorkers.length <= a ? b < a : b > a;
                  this.freeWorkers.length <= a ? ++b : --b
                )
                  c.push(b);
                return c;
              }
                .apply(this, arguments)
                .forEach(
                  (function (a) {
                    return function (c) {
                      var b;
                      return (
                        console.log('spawning worker ' + c),
                        (b = new Worker(a.options.workerScript)),
                        (b.onmessage = (function (a) {
                          return function (c) {
                            return (
                              a.activeWorkers.splice(a.activeWorkers.indexOf(b), 1),
                              a.freeWorkers.push(b),
                              a.frameFinished(c.data)
                            );
                          };
                        })(a)),
                        a.freeWorkers.push(b)
                      );
                    };
                  })(this)
                ),
              a
            );
          }),
          (a.prototype.frameFinished = function (a) {
            return (
              console.log(
                'frame ' + a.index + ' finished - ' + this.activeWorkers.length + ' active'
              ),
              this.finishedFrames++,
              this.emit('progress', this.finishedFrames / this.frames.length),
              (this.imageParts[a.index] = a),
              j(null, this.imageParts) ? this.renderNextFrame() : this.finishRendering()
            );
          }),
          (a.prototype.finishRendering = function () {
            var e, a, k, m, b, d, h;
            b = 0;
            for (var f = 0, j = this.imageParts.length; f < j; ++f)
              (a = this.imageParts[f]), (b += (a.data.length - 1) * a.pageSize + a.cursor);
            (b += a.pageSize - a.cursor),
              console.log('rendering finished - filesize ' + Math.round(b / 1e3) + 'kb'),
              (e = new Uint8Array(b)),
              (d = 0);
            for (var g = 0, l = this.imageParts.length; g < l; ++g) {
              a = this.imageParts[g];
              for (var c = 0, i = a.data.length; c < i; ++c)
                (h = a.data[c]),
                  (k = c),
                  e.set(h, d),
                  k === a.data.length - 1 ? (d += a.cursor) : (d += a.pageSize);
            }
            return (m = new Blob([e], { type: 'image/gif' })), this.emit('finished', m, e);
          }),
          (a.prototype.renderNextFrame = function () {
            var c, a, b;
            if (this.freeWorkers.length === 0) throw new Error('No free workers');
            return this.nextFrame >= this.frames.length
              ? void 0
              : ((c = this.frames[this.nextFrame++]),
                (b = this.freeWorkers.shift()),
                (a = this.getTask(c)),
                console.log('starting frame ' + (a.index + 1) + ' of ' + this.frames.length),
                this.activeWorkers.push(b),
                b.postMessage(a));
          }),
          (a.prototype.getContextData = function (a) {
            return a.getImageData(0, 0, this.options.width, this.options.height).data;
          }),
          (a.prototype.getImageData = function (b) {
            var a;
            return (
              null != this._canvas ||
                ((this._canvas = document.createElement('canvas')),
                (this._canvas.width = this.options.width),
                (this._canvas.height = this.options.height)),
              (a = this._canvas.getContext('2d')),
              (a.setFill = this.options.background),
              a.fillRect(0, 0, this.options.width, this.options.height),
              a.drawImage(b, 0, 0),
              this.getContextData(a)
            );
          }),
          (a.prototype.getTask = function (a) {
            var c, b;
            if (
              ((c = this.frames.indexOf(a)),
              (b = {
                index: c,
                last: c === this.frames.length - 1,
                delay: a.delay,
                transparent: a.transparent,
                width: this.options.width,
                height: this.options.height,
                quality: this.options.quality,
                repeat: this.options.repeat,
                canTransfer: h.name === 'chrome',
              }),
              null != a.data)
            )
              b.data = a.data;
            else if (null != a.context) b.data = this.getContextData(a.context);
            else if (null != a.image) b.data = this.getImageData(a.image);
            else throw new Error('Invalid frame');
            return b;
          }),
          a
        );
      })(f)),
      (d.exports = e);
  }),
    a.define('/browser.coffee', function (f, g, h, i) {
      var a, d, e, c, b;
      (c = navigator.userAgent.toLowerCase()),
        (e = navigator.platform.toLowerCase()),
        (b = c.match(
          /(opera|ie|firefox|chrome|version)[\s\/:]([\w\d\.]+)?.*?(safari|version[\s\/:]([\w\d\.]+)|$)/
        ) || [null, 'unknown', 0]),
        (d = b[1] === 'ie' && document.documentMode),
        (a = {
          name: b[1] === 'version' ? b[3] : b[1],
          version: d || parseFloat(b[1] === 'opera' && b[4] ? b[4] : b[2]),
          platform: {
            name: c.match(/ip(?:ad|od|hone)/)
              ? 'ios'
              : (c.match(/(?:webos|android)/) || e.match(/mac|win|linux/) || ['other'])[0],
          },
        }),
        (a[a.name] = !0),
        (a[a.name + parseInt(a.version, 10)] = !0),
        (a.platform[a.platform.name] = !0),
        (f.exports = a);
    }),
    a.define('events', function (f, e, g, h) {
      b.EventEmitter || (b.EventEmitter = function () {});
      var a = (e.EventEmitter = b.EventEmitter),
        c =
          typeof Array.isArray === 'function'
            ? Array.isArray
            : function (a) {
                return Object.prototype.toString.call(a) === '[object Array]';
              },
        d = 10;
      (a.prototype.setMaxListeners = function (a) {
        this._events || (this._events = {}), (this._events.maxListeners = a);
      }),
        (a.prototype.emit = function (f) {
          if (
            f === 'error' &&
            (!(this._events && this._events.error) ||
              (c(this._events.error) && !this._events.error.length))
          )
            throw arguments[1] instanceof Error
              ? arguments[1]
              : new Error("Uncaught, unspecified 'error' event.");
          if (!this._events) return !1;
          var a = this._events[f];
          if (!a) return !1;
          if (!(typeof a == 'function'))
            if (c(a)) {
              var b = Array.prototype.slice.call(arguments, 1),
                e = a.slice();
              for (var d = 0, g = e.length; d < g; d++) e[d].apply(this, b);
              return !0;
            } else return !1;
          switch (arguments.length) {
            case 1:
              a.call(this);
              break;
            case 2:
              a.call(this, arguments[1]);
              break;
            case 3:
              a.call(this, arguments[1], arguments[2]);
              break;
            default:
              var b = Array.prototype.slice.call(arguments, 1);
              a.apply(this, b);
          }
          return !0;
        }),
        (a.prototype.addListener = function (a, b) {
          if ('function' !== typeof b)
            throw new Error('addListener only takes instances of Function');
          if (
            (this._events || (this._events = {}), this.emit('newListener', a, b), !this._events[a])
          )
            this._events[a] = b;
          else if (c(this._events[a])) {
            if (!this._events[a].warned) {
              var e;
              this._events.maxListeners !== undefined ? (e = this._events.maxListeners) : (e = d),
                e &&
                  e > 0 &&
                  this._events[a].length > e &&
                  ((this._events[a].warned = !0),
                  console.error(
                    '(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.',
                    this._events[a].length
                  ),
                  console.trace());
            }
            this._events[a].push(b);
          } else this._events[a] = [this._events[a], b];
          return this;
        }),
        (a.prototype.on = a.prototype.addListener),
        (a.prototype.once = function (b, c) {
          var a = this;
          return (
            a.on(b, function d() {
              a.removeListener(b, d), c.apply(this, arguments);
            }),
            this
          );
        }),
        (a.prototype.removeListener = function (a, d) {
          if ('function' !== typeof d)
            throw new Error('removeListener only takes instances of Function');
          if (!(this._events && this._events[a])) return this;
          var b = this._events[a];
          if (c(b)) {
            var e = b.indexOf(d);
            if (e < 0) return this;
            b.splice(e, 1), b.length == 0 && delete this._events[a];
          } else this._events[a] === d && delete this._events[a];
          return this;
        }),
        (a.prototype.removeAllListeners = function (a) {
          return a && this._events && this._events[a] && (this._events[a] = null), this;
        }),
        (a.prototype.listeners = function (a) {
          return (
            this._events || (this._events = {}),
            this._events[a] || (this._events[a] = []),
            c(this._events[a]) || (this._events[a] = [this._events[a]]),
            this._events[a]
          );
        });
    }),
    (c.GIF = a('/gif.coffee'));
}).call(this, this);
//# sourceMappingURL=gif.js.map
// gif.js 0.1.6 - https://github.com/jnordberg/gif.js
