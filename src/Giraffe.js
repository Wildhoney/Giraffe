import obelisk from 'obelisk.js';

/**
 * @module Giraffe
 * @author Adam Timberlake
 * @link https://github.com/Wildhoney/Giraffe
 * @link http://giraffe-app.herokuapp.com/
 * @licence MIT
 */
export default class Giraffe {

    /**
     * @constant ELEMENT
     * @type {String}
     */
    ELEMENT = 'canvas.giraffe';

    /**
     * @constructor
     * @return {Giraffe}
     */
    constructor() {

        const canvas    = this.getElement();
        const point     = new obelisk.Point(200, 200);
        const pixelView = new obelisk.PixelView(canvas, point);

        pixelView.renderObject(this.renderGiraffe());

    }

    /**
     * @method renderGiraffe
     * @return {obelisk.Cube}
     */
    renderGiraffe() {

        const dimension = new obelisk.CubeDimension(80, 100, 120);
        const gray      = obelisk.ColorPattern.GRAY;
        const color     = new obelisk.CubeColor().getByHorizontalColor(gray);

        return new obelisk.Cube(dimension, color, true);

    }

    /**
     * @method getElement
     * @return {Element}
     */
    getElement() {

        const canvas = document.querySelector(Giraffe.ELEMENT);
        window.addEventListener('resize', resizeCanvas, false);

        function resizeCanvas() {
            canvas.width  = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        resizeCanvas();
        return canvas;

    }

}

document.addEventListener('DOMContentLoaded', () => new Giraffe());
