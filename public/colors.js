window.isMobile = /Android|iP(hone|ad)/.test(navigator.userAgent)

// Pixel objects.
var pixels

// TODO: REMOVE
var keepGoing = true
function end (data) {
  console.log(data)
  keepGoing = false
}

// TODO: Expose this API in a package.
Cute.ready(function () {
  var video = Cute.one('#video')
  var canvas = Cute.one('#canvas')
  var context = canvas.getContext('2d')
  var deviceId

  // Canvas dimensions.
  var width, height

  var scale = 5, offset = scale / 2, sx, sy

  // Size everything to the video dimensions.
  Cute.on(video, 'resize', function () {
    width = video.offsetWidth
    height = video.offsetHeight
    canvas.width = width
    canvas.height = height
    sx = -scale / width
    sy = -scale / height
    pixels = new Array(width * height)
    var n = 0
    for (var y = 0; y < height; y++) {
      for (var x = 0; x < width; x++) {
        pixels[n] = new Pixel(n, x, y)
        n++
      }
    }
    n = 0
    for (y = 0; y < height; y++) {
      for (x = 0; x < width; x++) {
        pixels[n].adjacent = [
          x < width - 1 ? pixels[n + 1] : undefined,
          y < height - 1 ? pixels[n + width] : undefined,
          x > 0 ? pixels[n - 1] : undefined,
          y > 0 ? pixels[n - width]: undefined
        ]
        n++
      }
    }
  })()

  navigator.mediaDevices.enumerateDevices().then(gotDevices).catch(startStreaming)

  // Capture the last camera device ID, which seems to always be the one that's
  // pointing outward.
  function gotDevices (devices) {
    Cute.each(devices, function (device) {
      if (device.kind === 'videoinput') {
        deviceId = device.deviceId
      }
    })
    startStreaming()
  }

  // Start streaming camera data.
  function startStreaming () {
    navigator.getUserMedia({
      video: {deviceId: deviceId},
      audio: false
    }, function (stream) {
      try {
        video.src = window.URL.createObjectURL(stream)
      } catch (ignore) {
        video.src = stream
      }
    }, function() {
      throw Error('Failed to get camera.')
    })
  }

  // Copy video contents to canvas, and update using the RGBA data array.
  function draw () {
    try {
      context.drawImage(video, 0, 0, width, height)
      rgba = context.getImageData(0, 0, width, height).data
      update()
      emit()
    } catch (err) {
      console.error(err)
    }
    if (keepGoing) {
      window.requestAnimationFrame(draw)
    }
  }
  draw()

  // Update pixels with a new RGBA array.
  function update () {
    var beforeUpdate = performance.now()
    context.clearRect(0, 0, width, height)
    for (var y = 1; y < height; y += 3) {
      var a = y * width + 1
      var b = (y + 1) * width
      for (var n = a; n < b; n += 3) {
        var pixel = pixels[n]
        pixel.update()
        var color = pixel.color
        if (color) {
          var up = n - width
          var last
          while (up >= 0) {
            last = pixel
            pixel = pixels[up]
            pixel.update()
            if (pixel.color !== color) {
              break
            }
            up -= width
          }
          if (!last.path) {
            var path = new Path(last)
            var list = path.pixels
            var length = list.length
            if (length > 15) {
              for (var i = 0; i < length; i++) {
                var p = list[i]
                context.fillStyle = p.color.name
                context.fillRect(p.x, p.y, 1, 1)
              }
            }
          }
        }
      }
    }
  }

  var Path = Cute.type(function Path (start) {
    var color = this.color = start.color
    var list = this.pixels = [start]
    var pixel = start
    var direction = 0
    var l, t = 0
    while (++t < 1e4) {
      var a = pixel.adjacent
      for (var i = 0; i < 4; i++) {
        var p = a[(direction + i) % 4]
        if (p) {
          p.update()
          if (p.color === color) {
            direction = (direction + i + 3) % 4
            pixel = p
            p.path = this
            list.push(p)
            break
          }
        }
      }
      if (pixel === start) {
        break
      }
    }
    if (t > 15) {
      this.update()
    } else {
      this.radius = 0
      this.score = 0
      this.circularity = 0
    }
    color.paths.push(this)
  }, {
    update: function () {
      var list = this.pixels
      var pairs = []
      for (var i = 0, l = Math.floor(list.length / 2); i < l; i++) {
        var a = list[i]
        var b = list[i + l]
        var dx = a.x - b.x
        var dy = a.y - b.y
        pairs.push({a: a, b: b, s: dx * dx + dy * dy})
      }
      pairs.sort(function (a, b) {
        return b.s - a.s
      })
      var xSum = 0
      var ySum = 0
      var dSum = 0
      var n = Math.floor(l / 4)
      pairs.slice(0, n).forEach(function (pair) {
        var a = pair.a
        var b = pair.b
        xSum += a.x + b.x
        ySum += a.y + b.y
        dSum += Math.sqrt(pair.s)
      })
      var x = this.x = xSum / n / 2
      var y = this.y = ySum / n / 2
      var radius = this.radius = dSum / n / 2
      var score = 0
      for (i = 0, l = list.length; i < l; i++) {
        var pixel = list[i]
        dx = x - pixel.x
        dy = y - pixel.y
        score += 1 / (Math.abs(radius - Math.sqrt(dx * dx + dy * dy)) + 1)
      }
      this.score = score
      this.circularity = score / l
    }
  })

  function emit () {
    colors.forEach(function (color) {
      color.shapes = []
      var paths = color.paths
      var l = paths.length
      paths = paths.sort(function (a, b) {
        return b.score - a.score
      })
      Cute.each(paths, function (path) {
        Cute.each(path.pixels, function (pixel) {
          pixel.path = null
        })
      })
      paths = paths.sort(function (a, b) {
        return b.score - a.score
      }).slice(0, 2)

      var first = paths[0]
      var last = paths[1]
      if (first && last) {
        var d = getDistance2d(first, last)
        //console.log(first, last, d)
        if (d < first.radius) {
          paths.pop()
        }
      }

      for (i = 0, l = paths.length; i < l; i++) {
        var path = paths[i]
        var pixels = path.pixels
        for (j = 0, m = pixels.length; j < m; j++) {
          var pixel = pixels[j]
          pixel.path = null
        }
        if (path.circularity > 0.35) {
          context.strokeStyle = 'white'
          context.beginPath()
          context.arc(path.x, path.y, path.radius, 0, 2 * Math.PI)
          context.stroke()

          var shape = new Point()
          var size = Math.max(path.radius * 2, 1) / width
          if (window.isMobile) {
            shape.x = (path.x / width - 0.5) / size / 8
            shape.y = (0.5 - path.y / height) / size / 8
            shape.z = -0.2 / size
          } else {
            shape.x = (0.5 - path.x / width) / size / 4
            shape.y = (0.5 - path.y / height) / size / 4
            shape.z = 0.1 / size - 4
          }
          color.shapes.push(shape)
        }
      }
      color.paths = []
      color.updateFingers()
    })
    Cute.each(hands, function (hand) {
      hand.update()
    })
  }
})

function byRadius (a, b) {
  return b.radius - a.radius
}

function byFitness (a, b) {
  return b.fitness - a.fitness
}

var Pixel = Cute.type(function Pixel (n, x, y) {
  this.n = n
  this.x = x
  this.y = y
  this.color = null
  this.adjacent = null
  this.path = null
}, {
  update: function () {
    var i = this.n * 4
    var r = rgba[i]
    var g = rgba[i + 1]
    var b = rgba[i + 2]
    var color = null
    var min = Math.min(r, g, b)
    var max = Math.max(r, g, b)
    var d = max - min
    var h
    if (d > 40) {
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0)
          break
        case g:
          h = (b - r) / d + 2
          break
        case b:
          h = (r - g) / d + 4
          break
      }
      if ((h > 1.8 && h < 2.8) && d > 40) {
        color = GREEN
      } else if ((h > 0.8 && h < 1.8) && d > 40) {
        color = YELLOW
      }
    }
    this.color = color
  }
})

var Color = Cute.type(function (name, fingerName) {
  this.i = colors.length
  this.name = name
  this.fingerName = fingerName
  this.paths = []
  this.fingers = []
  colors.push(this)
}, {
  updateFingers: function () {
    // The first color is the first finger (i.e. the thumb)
    var fingerI = this.i
    var shapes = this.shapes
    // Apply the left and right shapes to the left and right hands.
    // TODO: Instead, find the pairings that minimize the movement since the
    //       frame.
    if (shapes.length === 2) {
      shapes.sort(function (a, b) {
        return a.x - b.x
      })
      // The hand index is in ascending X order: left = 0, right = 1.
      Cute.each(shapes, function (shape, handI) {
        var finger = hands[handI].fingers[fingerI]
        smoothPull(finger, shape)
        parent.moveFinger(finger)
      })
    // If there's only one shape, move the nearest finger.
    } else if (shapes.length) {
      var shape = shapes[0]
      var near = 9e9
      var nearFinger = 0
      Cute.each(this.fingers, function (finger) {
        var d = getDistance(shape, finger.hand)
        if (d < near) {
          near = d
          nearFinger = finger
        }
      })
      if (nearFinger) {
        smoothPull(nearFinger, shape)
        parent.moveFinger(nearFinger)
      }
    }
  }
})

var colors = []
var GREEN = new Color('ForestGreen', 'thumb')
var YELLOW = new Color('Yellow', 'index')

var Point = Cute.type(function (x, y, z) {
  this.x = x || 0
  this.y = y || 0
  this.z = z || 0
}, {})

var Finger = Cute.type(Point, function (type, color, hand) {
  this._super.call(this)
  this.i = color.i
  this.type = type
  this.color = color
  this.hand = hand
  // Be able to refer to the DOM element once it exists.
  this.id = hand.name + '-' + type + '-finger'
  // Store the fingers by name and by index for convenience:
  //   hand.thumb === hand.fingers[0]
  //   hand.index === hand.fingers[1] ...
  hand.fingers.push(this)
  color.fingers.push(this)
  hand[type] = this
}, {})

var Hand = Cute.type(Point, function (name) {
  this.i = hands.length
  this.name = name
  // Be able to refer to the DOM element once it exists.
  this.id = this.name + '-hand'
  this.fingers = []
  new Finger('thumb', GREEN, this)
  new Finger('index', YELLOW, this)
  hands.push(this)

  this.gesture = null
}, {
  update: function () {
    var thumb = this.fingers[0]
    var index = this.fingers[1]
    var x = (index.x + thumb.x) / 2
    var y = (index.y + thumb.y) / 2
    var z = (index.z + thumb.z) / 2
    if (x === this.x && y === this.y && z === this.z) {
      return
    }
    this.x = x
    this.y = y
    this.z = z
    parent.moveHand(this)
    var dx = index.x - thumb.x
    var dy = index.y - thumb.y
    var dz = index.z - thumb.z
    this.vector = new Point(dx, dy, dz)
    this.gap = getDistance(index, thumb)

    var gesture = null
    if (this.gap < 0.4) {
      gesture = 'grab'
    } else if (dy < -0.4 && this.gap > 0.6) {
      gesture = 'fly'
    } else if ((dy > 1.2) && Math.sqrt(dx * dx + dz * dz) < 0.3) {
      gesture = 'menu'
    } else if (dz < -0.9) {
      gesture = 'point'
    }

    parent.emit('move:hand', this)

    // If the gesture for this hand is different, end and/or start.
    if (gesture !== this.gesture) {
      if (this.gesture) {
        parent.emit(this.gesture + ':end', this)
      }
      if (gesture) {
        this.gesture = gesture
        parent.emit(gesture + ':start', this)
      } else {
        this.gesture = null
      }
    // If the gesture exists and hasn't changed, move.
    } else if (gesture) {
      parent.emit(gesture + ':move', this)
    }
  },
  updateGesture: function (type, active) {
    var gestures = this.gestures
    var doc = parent.document
    var change
    if (active) {
      change = type + (gestures[type] ? ':move': ':start')
      gestures[type] = true
    } else {
      if (gestures[type]) {
        change = type + ':end'
        gestures[type] = false
      }
    }
    if (change) {
      parent.emit(change, this)
      socket.emit('gesture', {type: change, hand: this.name})
    }
  }
})

var hands = []
var LEFT = new Hand('left')
var RIGHT = new Hand('right')

// Translate fingers 1/2 the distance to where the camera frame shape says the
// finger has moved in X and Y directions, and 1/6 the distane in the Z
// direction, reduce jitter.
var xSmoothing = 2 // 2
var ySmoothing = 2 // 2
var zSmoothing = 3 // 6

function getDistance (a, b) {
  var x = b.x - a.x, y = b.y - a.y, z = b.z - a.z
  return Math.sqrt(x * x + y * y + z * z)
}

function getDistance2d (a, b) {
  var x = b.x - a.x, y = b.y - a.y
  return Math.sqrt(x * x + y * y)
}

// Pull a nearer to b.
function smoothPull (a, b) {
  a.x += (b.x - a.x) / xSmoothing
  a.y += (b.y - a.y) / ySmoothing
  a.z += (b.z - a.z) / zSmoothing
}

setTimeout(function() {
  location.reload()
}, 1e6)
