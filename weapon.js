/**
 *
 * @returns {Weapon}
 * @class
 * @requires Sprite
 */
function Weapon () {
    "use strict";
    /**
     * @type {number}
     */
    this.type = this.typeEnum.SINGLE;
    this.fireRate = 1000;
    return this;
}

Weapon.prototype = {
    typeEnum: {
        'SINGLE': 1,
        'DOUBLE': 2,
        'TRIPLE': 3
    }
};