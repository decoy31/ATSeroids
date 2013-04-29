/**
 *
 * @param {number} x
 * @param {number} y
 * @param {Sprite.wrap} bounds
 * @returns {Ship}
 * @class
 * @requires Sprite
 * @requires Vector
 */
function Ship (x, y, bounds) {
    "use strict";
    this.Sprite = Sprite;
    this.Sprite(x, y, 100, 100, bounds);
    this.acceleration = new Vector(0, -200);
    this.rotationalAcceleration = 720;
    this.maxRotationalVelocity = 180;
    this.maxVelocity = 500;
    this.controls = {
        up: false,
        left: false,
        right: false,
        fire: false,
        hyperspace: false
    };

    this.bindings = {
        "38": "up",
        "37": "left",
        "39": "right",
        "32": "fire",
        "27": "hyperspace"
    };

    // add listeners

    var ship = this;

    /**
     * Key down event handler.
     *
     * @param {Event} evt
     */
    function keydown (evt) {
        var setting = ship.bindings[ evt.keyCode.toString() ];

        if (setting) {
            ship.controls[setting] = true;
        }
    }

    /**
     * Key up event handler.
     *
     * @param {Event} evt
     */
    function keyup (evt) {
        var setting = ship.bindings[ evt.keyCode.toString() ];

        if (setting) {
            ship.controls[setting] = false;
        }
    }

    if (document.addEventListener) {
        document.addEventListener('keydown', keydown, false);
        document.addEventListener('keyup', keyup, false);
    } else {
        document.onkeydown = keydown;
        document.onkeyup = keyup;
    }

    return this;
}

Ship.prototype = new Sprite;

Ship.prototype.log = function () {
    "use strict";
    var s = [];

    for (var setting in this.controls) {
        if (this.controls.hasOwnProperty(setting)) {
            s.push(setting + ': ' + this.controls[setting]);
        }
    }

    console.log(s.join(', '));
    return this;
};

Ship.prototype.update = function () {
    "use strict";

    Sprite.prototype.update.apply(this);

    if (this.controls.left) {
        this.rotationalVelocity += this.rotationalAcceleration * this.elapsedTime;
    }

    if (this.controls.right) {
        this.rotationalVelocity -= this.rotationalAcceleration * this.elapsedTime;
    }

    if (!this.controls.left && !this.controls.right) {
        this.rotationalVelocity -= this.rotationalVelocity * this.elapsedTime * 4;

        if (Math.abs(this.rotationalVelocity) < 0.5) {
            this.rotationalVelocity = 0;
        }
    }

    if (Math.abs(this.rotationalVelocity) > this.maxRotationalVelocity) {
        if (this.rotationalVelocity > 0) {
            this.rotationalVelocity = this.maxRotationalVelocity;
        } else {
            this.rotationalVelocity = -this.maxRotationalVelocity;
        }
    }

    if (this.controls.up) {
        var deltaV = this.acceleration.rotate(this.rotation).mult(this.elapsedTime);
        this.velocity = this.velocity.add(deltaV);
    }

    if (this.velocity.size() > this.maxVelocity) {
        this.velocity = this.velocity.scale(this.maxVelocity / this.velocity.size());
    }

    return this;
};