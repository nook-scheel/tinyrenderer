// Code goes here

var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');
var selected_file = document.querySelector('input[type="file"]');
var width = 1200;
var height = 1200;

selected_file.addEventListener('change', function(e) {
  var f = e.target.files[0]
  var reader = new FileReader();
  reader.onload = (function(theFile) {
    return function(e) {
      var model = new Model(e.target.result, context);
      model.draw();
    };
  })(f);
  reader.readAsText(f);
}, false);

function Model(file, ctx) {
  this._verts = [6];
  this._faces = [];
  this.ctx = ctx;
  var lines = file.split("\n")
    , nline, f, faceArr, line, lineArr;

  for (nline in lines) {
    line = lines[nline];
    lineArr = line.split(" ");
    if (lineArr[0] === "v")
      this._verts.push(lineArr.splice(-3));
    if (lineArr[0] === "f") {
      f = [];
      faceArr = [lineArr[1], lineArr[2], lineArr[3]];
      for (var i = 0; i < 3; i++)
        f.push(faceArr[i].split('/')[0]);
      this._faces.push(f);
    }
  }
}

Model.prototype = {
  draw: function () {
    var iface, jface, face, v0, v1, x0, y0, x1, y1;
    this.ctx.clearRect(0 , 0 , canvas.width, canvas.height);

    for (iface in this._faces) {
      face = this._faces[iface];
      for (jface in face) {
        v0 = this._verts[face[jface]];
        v1 = this._verts[face[(jface + 1) % 3]];
        x0 = (parseFloat(v0[0]) + 1) * width / 2;
        y0 = (parseFloat(v0[1]) + 1) * height / 2;
        x1 = (parseFloat(v1[0]) + 1) * width / 2;
        y1 = (parseFloat(v1[1]) + 1) * height / 2;
        this.line(x0, y0, x1, y1, context);
      }
    }
  },

  line: function (x0, y0, x1, y1) {
    var ctx = this.ctx;
    ctx.beginPath();
    ctx.moveTo(x0, 1200 - y0);
    ctx.lineTo(x1, 1200 - y1);
    ctx.stroke();
  },

  triangle: function (face) {
    var ctx = this.ctx
      , v0 = [this._verts];
    ctx.beginPath();
  }
};

