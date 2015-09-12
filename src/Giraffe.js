import obelisk from 'obelisk.js';
import yaml from 'js-yaml';

/**
 * @constant DEFAULT_SIZE
 * @type {Number}
 */
const DEFAULT_SIZE = 10;

/**
 * @constant COLOUR_MAP
 * @type {Object}
 */
const COLOUR_MAP = {
    darkBrown: new obelisk.CubeColor().getByHorizontalColor(0x704A3A),
    lightBrown: new obelisk.CubeColor().getByHorizontalColor(0xEDCE93)
};

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
     * @param {String} filename
     * @return {Promise}
     */
    getModel(filename) {

        /**
         * @method parseItem
         * @param {String} item
         * @param {Object|Number} model
         * @return {Number}
         */
        const parseItem = (item, model) => {

            if (typeof model === 'undefined') return DEFAULT_SIZE;
            if (typeof model === 'object')    return Number((model[item] || 1) * DEFAULT_SIZE);
            else                              return Number(model * DEFAULT_SIZE);

        };

        /**
         * @method parseModel
         * @param {Object} model
         * @return {Array}
         */
        const parseModel = model => {

            return model.reduce((accumulator, {colour, size, position}) => {

                accumulator.push({
                    colour: COLOUR_MAP[colour],
                    size: { x: parseItem('x', size), y: parseItem('y', size), z: parseItem('z', size) },
                    position: { x: parseItem('x', position), y: parseItem('y', position), z: parseItem('z', position) }
                });

                return accumulator;

            }, []);

        };

        return fetch(`./model/${filename}`)
            .then(data => data.text())
            .then(data => yaml.load(data))
            .then(data => parseModel(data));

    }

    /**
     * @method renderModel
     * @return {void}
     */
    renderModel() {

        const canvas    = this.getElement();
        const point     = new obelisk.Point(200, 200);
        const pixelView = new obelisk.PixelView(canvas, point);

        this.getModel('Giraffe.yml').then(model => {

            model.forEach(({ colour, size, position }) => {

                const shapeModel    = new obelisk.CubeDimension(size.x, size.y, size.z);
                const positionModel = new obelisk.Point3D(position.x, position.y, position.z);

                pixelView.renderObject(new obelisk.Cube(shapeModel, colour, true), positionModel);

            });

            //Object.keys(model).forEach(key => {
            //    //model[key].forEach(component => pixelView.renderObject(component[0], component[1]));
            //
            //    model[key].forEach(({ colour, size, position }) => {
            //
            //        const shapeModel    = new obelisk.CubeDimension(size.x, size.y, size.z);
            //        const positionModel = new obelisk.Point3D(position.x, position.y, position.z);
            //
            //        pixelView.renderObject(new obelisk.Cube(shapeModel, colour, true), positionModel);
            //
            //    });
            //
            //    //const color  = new obelisk.SlopeColor().getByHorizontalColor(0xEDCE93);
            //    //
            //    //var dimensionSouth = new obelisk.SlopeDimension(SIZE, SIZE);
            //    //
            //    //
            //    //var slopeSouth = new obelisk.SlopeSouth(dimensionSouth, color);
            //    //var p3dSouth   = new obelisk.Point3D(80, 50, 50);
            //    //pixelView.renderObject(slopeSouth, p3dSouth);
            //
            //});

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
