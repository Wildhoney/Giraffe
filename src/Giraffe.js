import obelisk from 'obelisk.js';

/**
 * @constant DEFAULT_SIZE
 * @type {Number}
 */
const DEFAULT_SIZE = 10;

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
    static ELEMENT = 'canvas.giraffe';

    /**
     * @constructor
     * @return {Giraffe}
     */
    constructor() {
        this.renderModel();
    }

    /**
     * @method getModel
     * @return {obelisk.Cube[]}
     */
    getModel() {

        const lightColour = new obelisk.CubeColor().getByHorizontalColor(0xEDCE93);
        const darkColour  = new obelisk.CubeColor().getByHorizontalColor(0x704A3A);
        const x           = 10;
        const y           = 10;
        const z           = 10;

        /**
         * @method sizeBy
         * @param {Number} x
         * @param {Number} [y=x]
         * @param {Number} [z=x]
         * @return {{x: number, y: number, z: number}}
         */
        const sizeBy = (x, y = x, z = x) => {
            return { x, y, z };
        };

        return {

            neck: [
                { colour: lightColour, size: sizeBy(DEFAULT_SIZE), position: sizeBy(x * 3, y * 3, z) },
                { colour: darkColour,  size: sizeBy(DEFAULT_SIZE), position: sizeBy(x * 2, y * 2, z) },
                { colour: lightColour, size: sizeBy(DEFAULT_SIZE), position: sizeBy(x, y, z) }
            ],

            head: [
                { colour: lightColour,
                  size: sizeBy(DEFAULT_SIZE * 2),
                  position: sizeBy(x, y, z * 3) }
            ]

        }

    }

    /**
     * @method renderModel
     * @return {void}
     */
    renderModel() {

        const canvas    = this.getElement();
        const point     = new obelisk.Point(200, 200);
        const pixelView = new obelisk.PixelView(canvas, point);
        const model     = this.getModel();

        Object.keys(model).forEach(key => {
            //model[key].forEach(component => pixelView.renderObject(component[0], component[1]));

            model[key].forEach(({ colour, size, position }) => {

                const shapeModel    = new obelisk.CubeDimension(size.x, size.y, size.z);
                const positionModel = new obelisk.Point3D(position.x, position.y, position.z);

                pixelView.renderObject(new obelisk.Cube(shapeModel, colour, true), positionModel);

            });

            //const color  = new obelisk.SlopeColor().getByHorizontalColor(0xEDCE93);
            //
            //var dimensionSouth = new obelisk.SlopeDimension(SIZE, SIZE);
            //
            //
            //var slopeSouth = new obelisk.SlopeSouth(dimensionSouth, color);
            //var p3dSouth   = new obelisk.Point3D(80, 50, 50);
            //pixelView.renderObject(slopeSouth, p3dSouth);

        });

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
