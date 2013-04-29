/**
 * Given an SVG path element, create something useful.
 *
 * @param {string} [pathString]
 * @returns {Path}
 * @class
 * @requires Vector
 */
function Path (pathString) {
    "use strict";
    // <path id="svg_3" d="m203,273l63,-183l66,183l-63,-33l-66,33z" stroke-width="5" stroke="#000000" fill="#FF0000"/>

    /**
     * @type {Array.<Vector>}
     */
    this.points = [];

    if (typeof pathString === 'string' && pathString.length) {
        var pointList = pathString.match(/d\=\"m([^\"]*)z\"/);

        if (pointList.length === 2) {
            console.log('building point list');
            pointList = pointList[1];
            pointList = pointList.split('l');

            var x = 0, y = 0;

            for (var i = 0; i < pointList.length; i++) {
                var coords = pointList[i].split(',');
                x += parseFloat(coords[0]);
                y += parseFloat(coords[1]);
                this.points.push(new Vector(x, y));
                console.log(x + ', ' + y);
            }
        }
    }

    return this;
}

/**
 *
 * @param {CanvasRenderingContext2D} g
 */
Path.prototype.draw = function (g) {
    "use strict";
    var p = this.points[ this.points.length - 1 ];

    g.moveTo(p.x, p.y);

    for (var i = 0; i < this.points.length; i++) {
        p = this.points[i];
        g.lineTo(p.x, p.y);
    }
};

Path.prototype.jiggle = function (d) {
    "use strict";
    var path = new Path();

    for (var i = 0; i < this.points.length - 1; i++) {
        var offset = randomVector(0, d);
        path.points.push(this.points[i].add(offset));
    }

    path.points.push(path.points[0]);
    return path;
};

/**
 *
 * @param {number} s
 * @returns {Path}
 */
Path.prototype.scale = function (s) {
    "use strict";
    var path = new Path();

    for (var i = 0; i < this.points.length; i++) {
        path.points.push(this.points[i].scale(s));
    }

    return path;
};


/**
 * Center the path in its bounding box.
 *
 * @returns {Path}
 */
Path.prototype.normalize = function () {
    "use strict";
    var points = this.points;
    var x0, x1, y0, y1, i;
    x0 = x1 = this.points[0].x;
    y0 = y1 = this.points[0].y;
    for (i = 1; i < points.length; i++) {
        var p = points[i];
        x0 = p.x < x0 ? p.x : x0;
        x1 = p.x > x1 ? p.x : x1;
        y0 = p.y < y0 ? p.y : y0;
        y1 = p.y > y1 ? p.y : y1;
    }
    var dx = -( x0 + x1 ) * 0.5;
    var dy = -( y0 + y1 ) * 0.5;

    console.log('offset: ' + dx + ', ' + dy);

    for (i = 0; i < points.length; i++) {
        points[i] = points[i].add(dx, dy);
    }

    this.points = points;
    return this;
};