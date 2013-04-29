/**
 *
 * @param {number} x
 * @param {number} y
 * @param {number} width
 * @param {number} height
 * @param {Rect|boolean} [wrapBounds=false]
 * @returns {Sprite}
 * @requires Vector
 * @requires Path
 * @class
 */
function Sprite (x, y, width, height, wrapBounds) {
    "use strict";
    this.position = new Vector(x, y);
    this.w = width;
    this.h = height;
    this.rotation = 0; // straight up
    this.rotationalVelocity = 0;
    this.color = 'rgb(255,255,255)';
    this.strokeWidth = 0.5;
    this.velocity = new Vector(0, 0);
    this.lastUpdate = (new Date()).getTime();
    this.elapsedTime = 0.0;

    /**
     * @type {Rect|boolean}
     */
    this.wrap = typeof wrapBounds !== 'undefined' ? wrapBounds : false;
    /**
     * @type {Path|boolean}
     */
    this.path = false;
    this.scale = 1.0;
    this.debug = {};
    this.recalcCollisionRadius();
    return this;
}

/**
 *
 * @returns {Sprite}
 */
Sprite.prototype.recalcCollisionRadius = function () {
    "use strict";
    var path = this.path;

    if (path) {
        this.collisionRadius = 0;
        for (var i = 0; i < path.points.length; i++) {
            var s = path.points[i].size();
            if (s > this.collisionRadius) {
                this.collisionRadius = s;
            }
        }
    } else {
        this.collisionRadius = Math.sqrt(this.w * this.w + this.h * this.h) * 0.5;
    }

    return this;
};

/**
 * Draw the sprite in a canvas graphics context
 *
 * @param {CanvasRenderingContext2D} g
 * @returns {Sprite}
 */
Sprite.prototype.draw = function (g) {
    "use strict";
    var x = this.position.x, y = this.position.y, w = this.w, h = this.h;

    g.save();
    g.translate(x, y);
    g.rotate(-this.rotation * DEGREES_TO_RADIANS);
    g.scale(this.scale, this.scale);
    g.beginPath();

    if (this.path) {
        this.path.draw(g);
    } else {
        g.moveTo(-w * 0.5, -h * 0.5);
        g.lineTo(w * 0.5, -h * 0.5);
        g.lineTo(w * 0.5, h * 0.5);
        g.lineTo(-w * 0.5, h * 0.5);
        g.lineTo(-w * 0.5, -h * 0.5);
    }

    g.closePath();

    if (this.debug.collision) {
        g.strokeStyle = 'rgb(255,0,0)';
    } else {
        g.strokeStyle = this.color;
    }

    g.lineWidth = this.strokeWidth;
    g.stroke();
    g.restore();

    return this;
};

/**
 *
 * @param {Date} [elapsedTime]
 * @returns {Sprite}
 */
Sprite.prototype.update = function (elapsedTime) {
    "use strict";
    if (typeof elapsedTime === 'undefined') {
        elapsedTime = (new Date()).getTime() - this.lastUpdate;
        this.lastUpdate += elapsedTime;
    } else {
        this.lastUpdate += (new Date()).getTime();
    }

    elapsedTime *= 0.001;

    this.elapsedTime = elapsedTime;

    this.rotation += this.rotationalVelocity * elapsedTime;
    this.position = this.position.add(this.velocity.mult(elapsedTime));

    if (this.wrap) {
        if (this.position.x < this.wrap.position.x) {
            this.position.x += this.wrap.w;
        } else if (this.position.x > this.wrap.position.x + this.wrap.w) {
            this.position.x -= this.wrap.w;
        }

        if (this.position.y < this.wrap.position.y) {
            this.position.y += this.wrap.h;
        } else if (this.position.y > this.wrap.position.y + this.wrap.h) {
            this.position.y -= this.wrap.h;
        }
    }

    return this;
};

/**
 *
 * @param {Sprite} [otherSprite]
 * @param {CanvasRenderingContext2D} [g] TODO: Not sure if this type is correct.
 * @returns {boolean}
 */
Sprite.prototype.hitTest = function (otherSprite, g) {
    "use strict";
    if (typeof otherSprite === 'undefined') {
        return false;
    }
    return this.position.distance(otherSprite.position) <= this.collisionRadius + otherSprite.collisionRadius;
};