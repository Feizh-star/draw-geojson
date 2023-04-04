import L from 'leaflet'
import crypto from 'crypto'
var common_v = "K3af69IGvzreqA3qy4LoJ2WrfL1Bo8pnnbW0AaMLXO7K9sJFDl0YAGTS / ek + YMNMbq9KD2hulySOc6vHN2Hpp31Vq4 / YKSkr86HcXjVOQ5NA6edQrmPpNdBcpEEvSU4kTv8bHuBCRdBn4jBdQJ06oPr3ACg9RlCfDiLvMRV + X9k=";
var common_header = "/eGVe97VRNBY1RdelByZF3usTB2rYw4hIRVNxfryoi24GOWkSvRcPG+7RJqq6WUj";
var px_to_latlng = "uclzsesRBqkOgx9eMItg0ctYFjC6uTuFdSd+FZFC2I5N3C3yGRrSv1HgR1Ja1DVKqOOHWhpOpD8fqcYUQ2RDc5xSezI4oYANgTc0LzSP4xpHXbyjXWxXF1g43l1OYPmdNG6xSExqlJp5E/4RuGQ+6tNinpehnyyqns1uDYDTR8T/2LXJEIhLGQZAyLF8vG9oVzeZCN3vRdLmK3+l9BaabGbvucIGlLQJLtGH2rEtCfKBNup0Yx4mgkS94SBOXPEAO4gXT3cPtzD4VWIpZN8F09grqrjO/usHmiUjSABPA2kZcxycFT6N0BMJwOaiJ7c7dkowp8uI5/5TCmyODoVHJzz5eiLiC4mFK2VeHRoQqUdwuf5YT/xaV+kg4m7XCZUaDRsEqTrymX0QkYdMucHBU1gW0qgLcvYdmzzemqwXvG+3ii2HyzDv4zHVn2POppLa/lHrJxXePdYzbsDmWH616zQH6cVSWSyb0cR99ru8fD49R7s7ZhM1ytfffL/Enp/d"
var rain_f = "iEk9ENIjjj2K3S8Yhg9aZJQTOuch/CrQTt+n7qwpC0qm+Fpznw2wHc/Yt0S5T8vL/gIjIn5pRkrGO/2n1nJf86kah19rz5RNAdfkzpgTa3/FvPRDvREVxXOlOlr5HQl5+pG8E/SsDN/zGG9k1ePeDxPh9ulqNe3iaiAM53AkJkDVmIESQXBL9QETlKk9LnEF+ib9PDvo4ezHy2o6PPiS+xb9S1c6zFvWfrmb6RyrOeIuaAWlhD8aCzaO7gtVTxgHdfl+vbURuGvNHlBsmHBNtxqvq0WHBzgdvnyCF7Auh+ypBoJAChD+16mXJCV05ahhnsBTRqx2xnEY+k7uLqTTQ/LIGfl+6aua5/zGjQODFdf5Qx6SQjBe6nn4N+LHvPL/Z9J2ei++Guajob5TCt9RetP5OrIe0iQeuhxSpoi2UdErsTfNryA60qRFFI87T1xVOKyqxXiwCD8mbSyn6qoQiUaZnl8I1DrsWz60+bGN3Ao3M80CEF3kSq8D1+UUFHL1vJR8LYcymx3tEmizIpoOtMZ83k6+SSrc9Nojpx+WyBcJcLbs29jXc8zsIC3pYGmjsJMlkx3b/eGgwBRLHnuPbGWzv9Ur9iB4wOGFNNw1wJfr1H9CF23o3MVaNHRjU+A4TLZGLM6ABGHxg3ZSIMu6PRrwqF87ROYcYvjmAipvY+6AoZ66GRTQWM4nM1hoEI346VA1IPTaP38hWr2QFNCF27SinNeXYZi2/ytckQOECQe7bt5gLPiPdT/BH5FnHP9cCS0QeFwNMTWiFWJ4TBmO8dGUR1f/hPeGHdL+tKZh7wH3eLqVD6+NW1Y+v7qmC7ZRAZ4WSnFHTKyGYIEnEw5sIVhXpuyb4et8EHgeGqk8/yIWmDq31z6QUl/XfUJeMG5Wou/r1sdASRvlKoOHwxxqLLe8xVX6HOo/m6b+5I9k7AtS79c+9/VnDzOynBUCrBeiTj+dobaE8nlaTB/VFNyaJcfg/lbSxFnX/EH/Lt2QlqMKtxDG6h/+hZSDreiO2M4G1GmENaAckfmfzOCa5EdHnDJWBhukK+Tb/hNBh22zKkC9HOMULyTb4SlArTAGp6n0mROhJs6OlosNLdnSJiDYxbxyg6yP7vdv0VUSK1GHLSXqwh2G4JhWL8K848OBYn9rYf0qzmQnVZZjSlsM+FNghAjLMqejEDCs3a+U9drDNLs+I+9vqnrgsCDrdJsDgRS4MEhcn1HPrm8o9keatv/4QfufgozzQ6hiLHioU60qSIZQ1oqY/hoyAHM9Zaxw73zL9amIn1pjbkYJlDIlUtw+OwewpztdzxpcnKef9B8zb48NsXqSIQRTgWvjImaGlqT05F1g81ZlW0RT1NDahFTX9fCGux3tOXKaMYhybFpESQy0lhz93EtK1bbrhlctqiw1u+7bJRg5k2Twq+yXb54dudpVpf4Tbx1ccJyiJJpeOL0wNrDXs1g+puTeWcWmXEXNjCULwxSub+0RWDuEEhMakHPUkq3vxQ72PNtR1oJTLhvZirbN64ECqP/tTaGf6zyc3h2FzuoX0R4SXIx10aNVpLVfg14YkWHheL2WthvqlSpTRJ4N8mNDIk5L9mEOckIRW0392bHLkADg8vMfGeLsAEIn1nPz+oWgmTB3U4VgsRuYIjShhqs2Cml1BfV90gy23ryup70AIVs7FFv9P4YjehUza9ONepz1READVnp9/GmOpF4H8fjjTcPW5MuxChuHBT7/4N0lwJibCf8J3jRtmRzDIPRq5MKGz8nptck1dmSmSH9jvUG/P8cgHsamqx480qloQ1gPkPD6WA1h3gswJgZPfbywfv0bSJtF9jkxK7uTudTL7kyY0WTggTfVbTSv";
var rain_cut = "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"
function Wbgl() {
  this.initShaders = function (gl, vshader, fshader) {
    var program = createProgram(gl, vshader, fshader);
    if (!program) {
      console.log('Failed to create program');
      return false;
    }

    gl.useProgram(program);
    gl.program = program;

    return true;
  };
  this.createBuffer = function (gl, data) {
    var buffer = gl.createBuffer();
    // 把缓冲区绑定到目标
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    // 向缓冲区写入数据
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    return buffer;
  };
  this.attributeBuffer = function (gl, buffer, attribute, pointNum, frizeNum, frizeOffset) {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    // 把缓冲区数据分配给变量
    gl.vertexAttribPointer(attribute, pointNum, gl.FLOAT, false, frizeNum, frizeOffset);
    // 连接变量和缓冲区
    gl.enableVertexAttribArray(attribute);
  };
  this.createVexture = function (gl, img, isnear) {
    // 创建纹理
    var texture = gl.createTexture();
    //gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.bindTexture(gl.TEXTURE_2D, texture); // 绑定纹理对象ni 
    // 配置纹理参数
    if (isnear) {
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    } else {
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    }

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    // 配置纹理图像
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    return texture;
  };
  this.bindVexture = function (gl, texture, num) {
    gl.activeTexture(gl.TEXTURE0 + num); // 激活0号纹理单元
    gl.bindTexture(gl.TEXTURE_2D, texture); // 绑定纹理对象
  };

  var createProgram = function (gl, vshader, fshader) {
    // Create shader object
    var vertexShader = loadShader(gl, gl.VERTEX_SHADER, vshader);
    var fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fshader);
    if (!vertexShader || !fragmentShader) {
      return null;
    }

    // Create a program object
    var program = gl.createProgram();
    if (!program) {
      return null;
    }

    // Attach the shader objects
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    // Link the program object
    gl.linkProgram(program);

    // Check the result of linking
    var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!linked) {
      var error = gl.getProgramInfoLog(program);
      console.log('Failed to link program: ' + error);
      gl.deleteProgram(program);
      gl.deleteShader(fragmentShader);
      gl.deleteShader(vertexShader);
      return null;
    }
    return program;
  };

  var loadShader = function (gl, type, source) {
    // Create shader object
    var shader = gl.createShader(type);
    if (shader == null) {
      console.log('unable to create shader');
      return null;
    }

    // Set the shader program
    gl.shaderSource(shader, source);

    // Compile the shader
    gl.compileShader(shader);

    // Check the result of compilation
    var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!compiled) {
      var error = gl.getShaderInfoLog(shader);
      console.log('Failed to compile shader: ' + error);
      gl.deleteShader(shader);
      return null;
    }

    return shader;
  };

  /**
     * Initialize and get the rendering for WebGL
     * @param canvas <cavnas> element
     * @param opt_debug flag to initialize the context for debugging
     * @return the rendering context for WebGL
     */
  this.getWebGLContext = function (canvas) {
    // Get the rendering context for WebGL
    var gl = setupWebGL(canvas);
    if (!gl) return null;
    return gl;
  };
  var setupWebGL = function (canvas) {
    try {
      var context = create3DContext(canvas);
      if (!context) {
        return false;
      }
    } catch (err) {
      return false;
    }

    return context;
  };

  /**
     * Creates a webgl context.
     * @param {!Canvas} canvas The canvas tag to get context
     *     from. If one is not passed in one will be created.
     * @return {!WebGLContext} The created context.
     */
  var create3DContext = function (canvas) {
    var names = ['webgl', 'experimental-webgl', 'webkit-3d', 'moz-webgl'];
    var context = null;
    for (var ii = 0; ii < names.length; ++ii) {
      try {
        context = canvas.getContext(names[ii]);
      } catch (e) {
        continue;
      }
      if (context) {
        break;
      }
    }
    return context;
  };
}
var wbgl = new Wbgl();
var canvasLayer_options = {
  //定义顶点坐标
  vertices: new Float32Array([-1, 1, -1, -1, 1, 1, 1, -1]),
  n: 4,
}
//根据输入颜色和渐变，自动生成一张色标图片
function createColorTable(colors, linear) {
  var colornum = colors.r.length; //获取色标总数
  linear = linear < 0 ? 0 : linear; //设置渐变度不能小于1
  var vmin = colors.v[0]; //value最小值
  var vmax = colors.v[colornum - 1]; //value 最大值
  var canvas = document.createElement('canvas'); //创建一个画布
  canvas.width = 400;
  canvas.height = 30;
  var ctx = canvas.getContext('2d');
  var gradient = ctx.createLinearGradient(0, 0, canvas.width, 0); //创建渐变填充
  for (var i = 0; i < colornum - 1; i++) {
    var stop1 = (colors.v[i] - vmin) / (vmax - vmin); //添加渐变点
    var stop2 = (colors.v[i + 1] - vmin) / (vmax - vmin);
    stop2 = stop2 - (stop2 - stop1) * linear;
    gradient.addColorStop(stop1, 'rgba(' + colors.r[i] + ',' + colors.g[i] + ',' + colors.b[i] + ',' + '255)');
    gradient.addColorStop(stop2, 'rgba(' + colors.r[i] + ',' + colors.g[i] + ',' + colors.b[i] + ',' + '255)');
  }
  gradient.addColorStop(
    1,
    'rgba(' + colors.r[colornum - 1] + ',' + colors.g[colornum - 1] + ',' + colors.b[colornum - 1] + ',' + '255)'
  )
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  var image = new Image();
  image.src = canvas.toDataURL('image/png');//把画布转换成图片
  // image.style.position = "absolute";
  // image.style.zIndex = 1000;
  // image.style.top = 0;
  // document.body.appendChild(image)
  return {
    vmin: vmin,
    vmax: vmax,
    value: image,
  }
}
function createBackMap(geojson, map) {
  // console.log(geojson)
  // console.log(map.getSize());
  var size = map.getSize()
  var bounds = map.getBounds()
  var latmin = bounds._southWest.lat
  var latmax = bounds._northEast.lat
  var lonmin = bounds._southWest.lng
  var lonmax = bounds._northEast.lng
  // console.log(bounds)
  var canvas = document.createElement('canvas')
  canvas.width = size.x
  canvas.height = size.y
  var ctx = canvas.getContext('2d')
  geojson.features.forEach(e => {
    var type = e.geometry.type
    if (type == 'Polygon') {
      var o = e.geometry.coordinates
      o[0].forEach((ev, i) => {
        var x = ((ev[0] - lonmin) / (lonmax - lonmin)) * size.x
        var y = ((ev[1] - latmin) / (latmax - latmin)) * size.y
        if (i == 0) {
          // console.log(ev)
          // console.log(x);
          // console.log(y)
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })
    } else {
      var oo = e.geometry.coordinates
      oo.forEach(eee => {
        eee[0].forEach((ev, i) => {
          var x = ((ev[0] - lonmin) / (lonmax - lonmin)) * size.x
          var y = ((ev[1] - latmin) / (latmax - latmin)) * size.y
          if (i == 0) {
            // console.log(ev)
            // console.log(x);
            // console.log(y)
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        })
      })
    }
    ctx.fillStyle = 'rgba(255,0,0,255)'
    ctx.fill()
  })
  var image = new Image()
  image.src = canvas.toDataURL('image/png') //把画布转换成图片
  // image.style.zIndex = 1000;
  // image.style.position = "absolute";
  // image.style.top = 0;
  // image.style.pointerEvents = "none"
  // document.body.appendChild(image)
  return image
}
function requestCors(img, url) {
  console.log((new URL(url, window.location.href)).origin)
  console.log(window.location.origin)

  if ((new URL(url, window.location.href)).origin != window.location.origin) {
    img.crossOrigin = "";
  }
}
//函数主入口
var canvasLayer = function (url, colors, option) {
  L.Layer.CanvasLayer = L.Layer.extend({
    //扩展layer
    initialize: function (url, colors, option) {
      //初始化函数 
      this.img = new Image();
      // this.img.addEventListener('load',)
      requestCors(this.img,url);
      this.img.src = url;
      this.colorTable = createColorTable(colors, option.linear);//制作色标图片
      console.log("databounds");
      console.log(option);
      this.databounds = [option.latmin, option.latmax, option.lonmin, option.lonmax]; //数据边界
      this.scale = option.scale;
      this.opacity = option.opacity;
      this.texture = null;
      this.texture1 = null;
      this.pane = option.pane || "overlayPane";
      this.cut = option.cut || false;
      this.geojson = option.geojson || null;
      this.grid = option.grid || false
      this.cryStr();
    },
    onAdd: function (map) {
      //添加到地图事件
      this._map = map
      if (this.cut && this.geojson == null) {
        return console.log("选择切割选项，没有输入边界信息");
      }
      if (this.img.complete) {
        this._map.on('zoomanim', this.zoomEvent, this);//添加地图事件
        this._map.on('moveend', this.moveEvent, this);
        this._map.on('resize', this.createCanvas, this);//之所以做这个函数，是因为浏览器窗口变化后，gl无法正常渲染，需要重新添加

        this.createCanvas(); //创建webgl实例函数
        map.fire('moveend'); //初始化触发一下函数
      } else {
        this.img.onload = function () {
          this._map.on('zoomanim', this.zoomEvent, this);//添加地图事件
          this._map.on('moveend', this.moveEvent, this);
          this._map.on('resize', this.createCanvas, this);//之所以做这个函数，是因为浏览器窗口变化后，gl无法正常渲染，需要重新添加

          this.createCanvas(); //创建webgl实例函数
          map.fire('moveend'); //初始化触发一下函数
          // }.bind(this)
        }.bind(this)
      }

    },
    createCanvas: function () {
      this.deleteTexture();

      try {
        //删除旧的canvas
        this._map.getPanes()[this.pane].removeChild(this._canvas)
      } catch (e) {
        console.log(111)
      }
      this._canvas = L.DomUtil.create('canvas', 'leaflet-layer') //创建canvas
      var size = this._map.getSize()
      this._canvas.width = size.x
      this._canvas.height = size.y
      this.gl = wbgl.getWebGLContext(this._canvas) //获取gl上下文
      this.gl.clearColor(0, 0, 0, 0)
      this.gl.enable(this.gl.BLEND)
      this.gl.blendFunc(this.gl.SRC_ALPHA_SATURATE, this.gl.ZERO)
      //初始化着色器
      var v = this.common_v
      var f = this.common_header + this.px_to_latlng
      if (this.cut) {
        f += this.rain_cut;
      } else {
        f += this.rain_f
      }

      if (!wbgl.initShaders(this.gl, v, f)) {
        return console.log('初始化着色器失败')
      }
      this.getUniformLocation()
      this._map._panes[this.pane].appendChild(this._canvas)
      var animated = this._map.options.zoomAnimation && L.Browser.any3d
      L.DomUtil.addClass(this._canvas, 'leaflet-zoom-' + (animated ? 'animated' : 'hide'))
    },
    onRemove: function () {
      //图层删除事件
      try {
        this._map.off('resize', this.createCanvas, this)
        this._map.off('zoomanim', this.zoomEvent, this) //添加地图事件
        this._map.off('moveend', this.moveEvent, this)
      } catch (e) {
        console.log(111)
      }
      this.deleteTexture();

      try {
        this._map.getPanes()[this.pane].removeChild(this._canvas)
      } catch (e) {
        console.log(111)
      }
    },
    deleteTexture() {
      try {
        if (this.texture != null) {
          this.gl.deleteTexture(this.texture);
        }
        if (this.texture1 != null) {
          this.gl.deleteTexture(this.texture1);
        }
        if (this.texture2 != null) {
          this.gl.deleteTexture(this.texture2)
        }
        this.texture1 = null;
        this.texture = null;
        this.texture2 = null;
      } catch (e) {
        console.log('当前纹理不存在,不用重复删除')
      }
      try {
        //为了防止gl实例过多，删除旧的实例
        this.gl.getExtension('WEBGL_lose_context').loseContext()
        this.gl = null
      } catch (e) {
        console.log(111)
      }
    },
    cryStr() {
      let key = '123456789abcdefg';
      let iv = 'abcdefg123456789';
      var crypted = Buffer.from(common_v, 'base64').toString('binary');
      let decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
      this.common_v = decipher.update(crypted, 'binary', 'utf8') + decipher.final('utf8');
      crypted = Buffer.from(common_header, 'base64').toString('binary');
      decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
      this.common_header = decipher.update(crypted, 'binary', 'utf8') + decipher.final('utf8');
      crypted = Buffer.from(px_to_latlng, 'base64').toString('binary');
      decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
      this.px_to_latlng = decipher.update(crypted, 'binary', 'utf8') + decipher.final('utf8');
      crypted = Buffer.from(rain_f, 'base64').toString('binary');
      decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
      this.rain_f = decipher.update(crypted, 'binary', 'utf8') + decipher.final('utf8');
      crypted = Buffer.from(rain_cut, 'base64').toString('binary');
      decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
      this.rain_cut = decipher.update(crypted, 'binary', 'utf8') + decipher.final('utf8');
    },
    moveEvent: function () {
      //地图拖动事件
      this.gl_draw()
    },
    draw_geo(worldpx, zoom) {
      var _this = this;
      var mapimg;
      new Promise(resolve => {
        mapimg = createBackMap(_this.geojson, _this._map)
        resolve()
      }).then(function () {
        var gl = _this.gl
        // console.log(gl)
        // console.log(gl.program)
        var mbounds = _this._map.getBounds()
        var a_position = gl.getAttribLocation(gl.program, 'a_Position') //获取gl顶点坐标变量
        var u_Sampler = gl.getUniformLocation(gl.program, 'u_Sampler') //获取gl色斑图纹理变量
        var u_Table = gl.getUniformLocation(gl.program, 'u_Table') //获取色标纹理变量
        var u_map = gl.getUniformLocation(gl.program, 'u_map')
        // var tcoord = gl.getUniformLocation(gl.program, 'tcoord');  //获取坐标变量
        // var tsize = gl.getUniformLocation(gl.program, 'tsize');  //获取画布大小变量
        var tvalue = gl.getUniformLocation(gl.program, 'tvalue') //获取色标大小值变量
        var tbound = gl.getUniformLocation(gl.program, 'tbound') //获取数据经纬度范围变量
        var topacity = gl.getUniformLocation(gl.program, 'opacity') //获取透明度参数
        var tscale = gl.getUniformLocation(gl.program, 'scale') //数据缩放倍数
        // var tlatlng = gl.getUniformLocation(gl.program, "tlatlng");
        var vertexBuffer = wbgl.createBuffer(gl, canvasLayer_options.vertices) //创建顶点数据buffer
        wbgl.attributeBuffer(gl, vertexBuffer, a_position, 2, 0, 0) //为顶点数据赋值
        _this.texture = wbgl.createVexture(gl, _this.img, _this.grid) //创建色斑图纹理
        _this.texture1 = wbgl.createVexture(gl, _this.colorTable.value) //创建色标纹理
        _this.texture2 = wbgl.createVexture(gl, mapimg)
        wbgl.bindVexture(gl, _this.texture, 0) //把色斑图纹理绑定到0号纹理
        wbgl.bindVexture(gl, _this.texture1, 1) //把色标纹理绑定到1号纹理
        wbgl.bindVexture(gl, _this.texture2, 2)
        gl.uniform1i(u_Sampler, 0) //把0号纹理赋值给色斑图变量
        gl.uniform1i(u_Table, 1) //把1号纹理赋值给色标变量
        gl.uniform1i(u_map, 2)
        gl.uniform3f(_this.tcoord, worldpx.x, worldpx.y, zoom) //为左边变量赋值
        gl.uniform2f(_this.tsize, _this._canvas.width, _this._canvas.height) //为画布尺寸变量赋值
        gl.uniform2f(tvalue, _this.colorTable.vmin, _this.colorTable.vmax) //为色标大小值赋值
        gl.uniform4f(tbound, _this.databounds[0], _this.databounds[1], _this.databounds[2], _this.databounds[3]) //为数据经纬度范围赋值
        gl.uniform1f(topacity, _this.opacity) //赋值透明度
        gl.uniform4f(tscale, _this.scale.r, _this.scale.g, _this.scale.b, _this.scale.a) //赋值数据缩放倍数
        gl.uniform4f(
          _this.tlatlng,
          mbounds._southWest.lat,
          mbounds._southWest.lng,
          mbounds._northEast.lat,
          mbounds._northEast.lng
        )
        gl.clear(gl.COLOR_BUFFER_BIT) //清空画布
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, canvasLayer_options.n) //绘图
      })
    },
    draw: function (worldpx, zoom) {
      // var mapimg = createBackMap(geojson, map);
      var _this = this
      var gl = _this.gl
      // console.log(gl)
      // console.log(gl.program)
      var mbounds = _this._map.getBounds()
      var a_position = gl.getAttribLocation(gl.program, 'a_Position') //获取gl顶点坐标变量
      var u_Sampler = gl.getUniformLocation(gl.program, 'u_Sampler') //获取gl色斑图纹理变量
      var u_Table = gl.getUniformLocation(gl.program, 'u_Table') //获取色标纹理变量
      var tvalue = gl.getUniformLocation(gl.program, 'tvalue') //获取色标大小值变量
      var tbound = gl.getUniformLocation(gl.program, 'tbound') //获取数据经纬度范围变量
      var topacity = gl.getUniformLocation(gl.program, 'opacity') //获取透明度参数
      var tscale = gl.getUniformLocation(gl.program, 'scale') //数据缩放倍数
      // var tlatlng = gl.getUniformLocation(gl.program, "tlatlng");
      var vertexBuffer = wbgl.createBuffer(gl, canvasLayer_options.vertices) //创建顶点数据buffer
      wbgl.attributeBuffer(gl, vertexBuffer, a_position, 2, 0, 0) //为顶点数据赋值
      _this.texture = wbgl.createVexture(gl, _this.img, this.grid) //创建色斑图纹理
      _this.texture1 = wbgl.createVexture(gl, _this.colorTable.value) //创建色标纹理
      wbgl.bindVexture(gl, _this.texture, 0) //把色斑图纹理绑定到0号纹理
      wbgl.bindVexture(gl, _this.texture1, 1) //把色标纹理绑定到1号纹理
      gl.uniform1i(u_Sampler, 0) //把0号纹理赋值给色斑图变量
      gl.uniform1i(u_Table, 1) //把1号纹理赋值给色标变量
      gl.uniform3f(_this.tcoord, worldpx.x, worldpx.y, zoom) //为左边变量赋值
      gl.uniform2f(_this.tsize, _this._canvas.width, _this._canvas.height) //为画布尺寸变量赋值
      gl.uniform2f(tvalue, _this.colorTable.vmin, _this.colorTable.vmax) //为色标大小值赋值
      gl.uniform4f(tbound, _this.databounds[0], _this.databounds[1], _this.databounds[2], _this.databounds[3]) //为数据经纬度范围赋值
      gl.uniform1f(topacity, _this.opacity) //赋值透明度
      gl.uniform4f(tscale, _this.scale.r, _this.scale.g, _this.scale.b, _this.scale.a) //赋值数据缩放倍数
      gl.uniform4f(
        _this.tlatlng,
        mbounds._southWest.lat,
        mbounds._southWest.lng,
        mbounds._northEast.lat,
        mbounds._northEast.lng
      )
      gl.clear(gl.COLOR_BUFFER_BIT) //清空画布
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, canvasLayer_options.n) //绘图
    },
    gl_draw: function () {
      var mbounds = this._map.getBounds()
      var zoom = this._map.getZoom()
      var new_position = this._map.latLngToLayerPoint([mbounds._northEast.lat, mbounds._southWest.lng])
      var worldpx = this._map.project([mbounds._northEast.lat, mbounds._southWest.lng], zoom)
      //拖动地图后，重新定位画布位置
      //重新计算画布左上角坐标
      L.DomUtil.setPosition(this._canvas, new_position)

      if (this.cut) {
        if (this.texture == null) {
          this.draw_geo(worldpx, zoom, mbounds)
        } else {
          this.drawByZoom_geo(worldpx, zoom)
        }
      } else {
        if (this.texture == null) {
          this.draw(worldpx, zoom, mbounds)
        } else {
          this.drawByZoom(worldpx, zoom)
        }
      }

    },
    drawByZoom_geo(worldpx, zoom) {
      var mapimg
      var _this = this
      // var gl = this.gl;
      new Promise(resolve => {
        mapimg = createBackMap(_this.geojson, _this._map)
        resolve()
      }).then(function () {
        var gl = _this.gl
        var mbounds = _this._map.getBounds()
        gl.activeTexture(gl.TEXTURE2)
        gl.bindTexture(gl.TEXTURE_2D, _this.texture2) // 绑定纹理对象ni
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, mapimg)
        gl.uniform4f(
          _this.tlatlng,
          mbounds._southWest.lat,
          mbounds._southWest.lng,
          mbounds._northEast.lat,
          mbounds._northEast.lng
        )
        gl.uniform3f(_this.tcoord, worldpx.x, worldpx.y, zoom) //为左边变量赋值
        gl.uniform2f(_this.tsize, _this._canvas.width, _this._canvas.height) //为画布尺寸变量赋值
        gl.clear(gl.COLOR_BUFFER_BIT) //清空画布
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, canvasLayer_options.n) //绘图
      })
    },
    drawByZoom(worldpx, zoom) {
      var _this = this
      var gl = _this.gl
      var mbounds = _this._map.getBounds()
      gl.uniform4f(
        _this.tlatlng,
        mbounds._southWest.lat,
        mbounds._southWest.lng,
        mbounds._northEast.lat,
        mbounds._northEast.lng
      )
      gl.uniform3f(_this.tcoord, worldpx.x, worldpx.y, zoom) //为左边变量赋值
      gl.uniform2f(_this.tsize, _this._canvas.width, _this._canvas.height) //为画布尺寸变量赋值
      gl.clear(gl.COLOR_BUFFER_BIT) //清空画布
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, canvasLayer_options.n) //绘图
    },
    drawByRun() {
      var gl = this.gl
      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, this.texture) // 绑定纹理对象ni
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.img)
      gl.clear(gl.COLOR_BUFFER_BIT) //清空画布
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, canvasLayer_options.n) //绘图
    },
    getUniformLocation() {
      var gl = this.gl
      this.tcoord = gl.getUniformLocation(gl.program, 'tcoord') //获取坐标变量
      this.tsize = gl.getUniformLocation(gl.program, 'tsize') //获取画布大小变量
      this.tlatlng = gl.getUniformLocation(gl.program, 'tlatlng')
    },
    zoomEvent: function () {
      //这个主要是为了地图缩放的时候，画布能跟着进行同步缩放
      var map = this._map
      var center = map._animateToCenter
      var zoom = map._animateToZoom
      var scale = map.getZoomScale(zoom)
      // var bound = map.getBounds()
      // var yun_lat1 = bound._northEast.lat
      // var yun_lon1 = bound._northEast.lng
      // var yun_lat2 = bound._southWest.lat
      // var yun_lon2 = bound._southWest.lng
      // var new_position = map.latLngToLayerPoint([yun_lat1, yun_lon2])
      // -- different calc of offset in leaflet 1.0.0 and 0.0.7 thanks for 1.0.0-rc2 calc @jduggan1
      var offset = L.Layer
        ? map._latLngToNewLayerPoint(map.getBounds().getNorthWest(), zoom, center)
        : map
          .getCenterOffset(center)
          .multiplyBy(-scale)
          .subtract(map.getMapPanePos())
      L.DomUtil.setTransform(this._canvas, offset, scale)
    },
    updateImg(url) {
      this.img.src = url
      this.img.onload = function () {
        this.drawByRun()
      }.bind(this)
    },
    updateGeo(data) {
      this.geojson = data;
      this.gl_draw()
    }
  })
  return new L.Layer.CanvasLayer(url, colors, option)
}
export default canvasLayer