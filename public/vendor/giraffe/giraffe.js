(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
; var __browserify_shim_require__=require;(function browserifyShim(module, exports, require, define, browserify_shim__define__module__export__) {
/*global window:true*/

/*
 * obelisk
 */

(function (window) {
    "use strict";

    /**
     * Static class holding library specific information
     * the library.
     * @class obelisk
     **/
    var obelisk = {};

    /**
     * @property version
     * @type String
     * @static
     **/
    obelisk.version = '1.1.0';

    /**
     * @property author
     * @type String
     * @static
     **/
    obelisk.author = 'max huang';

    window.obelisk = obelisk;
}(window));

/*global obelisk:true*/

/*
 * AbstractColor
 */

(function (obelisk) {
    "use strict";

    var AbstractColor, p;

    AbstractColor = function () {
        this.initialize();
    };
    p = AbstractColor.prototype;

    // public properties
    /**
     * The inner colors for elements of certain primitive
     */
    p.inner = null;

    /**
     * The border colors for elements of certain primitive
     */
    p.border = null;

    /**
     * The borderHighlight colors for elements of certain primitive
     */
    p.borderHighlight = null;

    /**
     * The left side colors for elements of certain primitive
     */
    p.left = null;

    /**
     * The right side colors for elements of certain primitive
     */
    p.right = null;

    /**
     * The horizontal colors for elements of certain primitive
     */
    p.horizontal = null;

    /**
     * The left slot side colors for elements of certain primitive
     */
    p.leftSlope = null;

    /**
     * The right slot side colors for elements of certain primitive
     */
    p.rightSlope = null;

    // constructor
    p.initialize = function () {
        return this;
    };

    // public methods
    p.toString = function () {
        return "[AbstractColor]";
    };

    // private methods

    obelisk.AbstractColor = AbstractColor;
}(obelisk));

/*global obelisk:true*/

/*
 * CubeColor
 */

(function (obelisk) {
    "use strict";

    var CubeColor, p;
    CubeColor = function (border, borderHighlight, left, right, horizontal) {
        this.initialize(border, borderHighlight, left, right, horizontal);
    };
    p = CubeColor.prototype = new obelisk.AbstractColor();

    // public properties
    p.BRIGHTNESS_GAIN = -20;

    // constructor
    p.initialize = function (border, borderHighlight, left, right, horizontal) {
        this.border = obelisk.ColorGeom.get32(border === undefined ? 0x878787 : border);
        this.borderHighlight = obelisk.ColorGeom.get32(borderHighlight === undefined ? 0xFFFFFF : borderHighlight);
        this.left = obelisk.ColorGeom.get32(left === undefined ? 0xC9CFD0 : left);
        this.right = obelisk.ColorGeom.get32(right === undefined ? 0xE3E3E3 : right);
        this.horizontal = obelisk.ColorGeom.get32(horizontal === undefined ? 0xEEEFF0 : horizontal);
        return this;
    };

    // public methods
    p.getByHorizontalColor = function (horizontal) {
        return new CubeColor(
            obelisk.ColorGeom.applyBrightness(horizontal, this.BRIGHTNESS_GAIN * 4),
            //apply hightlight
            obelisk.ColorGeom.applyBrightness(horizontal, 0, true),
            obelisk.ColorGeom.applyBrightness(horizontal, this.BRIGHTNESS_GAIN * 2),
            obelisk.ColorGeom.applyBrightness(horizontal, this.BRIGHTNESS_GAIN),
            horizontal
        );
    };

    p.toString = function () {
        return "[CubeColor]";
    };

    // private methods

    obelisk.CubeColor = CubeColor;
}(obelisk));

/*global obelisk:true*/

/*
 * PyramidColor
 */

(function (obelisk) {
    "use strict";

    var PyramidColor, p;
    PyramidColor = function (border, borderHighlight, left, right) {
        this.initialize(border, borderHighlight, left, right);
    };
    p = PyramidColor.prototype = new obelisk.AbstractColor();

    // public properties
    p.BRIGHTNESS_GAIN = -20;

    // constructor
    p.initialize = function (border, borderHighlight, left, right) {
        this.border = obelisk.ColorGeom.get32(border === undefined ? 0x949698 : border);
        this.borderHighlight = obelisk.ColorGeom.get32(borderHighlight === undefined ? 0xFFFFFF : borderHighlight);
        this.left = obelisk.ColorGeom.get32(left === undefined ? 0xE6E8E9 : left);
        this.right = obelisk.ColorGeom.get32(right === undefined ? 0xEEEFF0 : right);
        return this;
    };

    // public methods
    p.getByRightColor = function (right) {
        return new PyramidColor(
            obelisk.ColorGeom.applyBrightness(right, this.BRIGHTNESS_GAIN * 4),
            //apply hightlight
            obelisk.ColorGeom.applyBrightness(right, 0, true),
            obelisk.ColorGeom.applyBrightness(right, this.BRIGHTNESS_GAIN),
            right
        );
    };

    p.toString = function () {
        return "[PyramidColor]";
    };

    // private methods

    obelisk.PyramidColor = PyramidColor;
}(obelisk));

/*global obelisk:true*/

/*
 * SideColor
 */

(function (obelisk) {
    "use strict";

    var SideColor, p;
    SideColor = function (border, inner) {
        this.initialize(border, inner);
    };
    p = SideColor.prototype = new obelisk.AbstractColor();

    // public properties
    p.BRIGHTNESS_GAIN = -20;

    // constructor
    p.initialize = function (border, inner) {
        this.border = obelisk.ColorGeom.get32(border === undefined ? 0x878787 : border);
        this.inner = obelisk.ColorGeom.get32(inner === undefined ? 0xEEEEEE : inner);
        return this;
    };

    // public methods
    p.getByInnerColor = function (inner) {
        return new obelisk.SideColor(
            obelisk.ColorGeom.applyBrightness(inner, this.BRIGHTNESS_GAIN * 4),
            inner
        );
    };

    p.toString = function () {
        return "[SideColor]";
    };

    // private methods

    obelisk.SideColor = SideColor;
}(obelisk));

/*global obelisk:true*/

/*
 * SlopeColor
 */

(function (obelisk) {
    "use strict";

    var SlopeColor, p;
    SlopeColor = function (border, borderHighlight, left, right, leftSlope, rightSlope) {
        this.initialize(border, borderHighlight, left, right, leftSlope, rightSlope);
    };
    p = SlopeColor.prototype = new obelisk.AbstractColor();

    // public properties
    p.BRIGHTNESS_GAIN = -20;

    // constructor
    p.initialize = function (border, borderHighlight, left, right, leftSlope, rightSlope) {
        this.border = obelisk.ColorGeom.get32(border === undefined ? 0x949698 : border);
        this.borderHighlight = obelisk.ColorGeom.get32(borderHighlight === undefined ? 0xFFFFFF : borderHighlight);
        this.left = obelisk.ColorGeom.get32(left === undefined ? 0xC9CFD0 : left);
        this.right = obelisk.ColorGeom.get32(right === undefined ? 0xE6E8E9 : right);
        this.leftSlope = obelisk.ColorGeom.get32(leftSlope === undefined ? 0xDBDBDB : leftSlope);
        this.rightSlope = obelisk.ColorGeom.get32(rightSlope === undefined ? 0xDBDBDB : rightSlope);
        return this;
    };

    // public methods

    /*
     * horizontal side doesn't actually exist in the Slope primitive
     * you can assign the same horizontal color as cube
     * so that you will be able to arrange the slope with cube
     */
    p.getByHorizontalColor = function (horizontal) {
        return new obelisk.SlopeColor(
            obelisk.ColorGeom.applyBrightness(horizontal, this.BRIGHTNESS_GAIN * 4),
            //apply hightlight
            obelisk.ColorGeom.applyBrightness(horizontal, 0, true),
            obelisk.ColorGeom.applyBrightness(horizontal, this.BRIGHTNESS_GAIN * 2),
            obelisk.ColorGeom.applyBrightness(horizontal, this.BRIGHTNESS_GAIN),
            obelisk.ColorGeom.applyBrightness(horizontal, this.BRIGHTNESS_GAIN * 1.5),
            obelisk.ColorGeom.applyBrightness(horizontal, this.BRIGHTNESS_GAIN * 0.5)
        );
    };

    p.toString = function () {
        return "[SlopeColor]";
    };

    // private methods

    obelisk.SlopeColor = SlopeColor;
}(obelisk));

/*global obelisk:true*/

/*
 * AbstractDimension
 */

(function (obelisk) {
    "use strict";

    var AbstractDimension, p;
    AbstractDimension = function () {
        this.initialize();
    };
    p = AbstractDimension.prototype;

    // public properties
    /**
     * The x Axis dimensions in 22.6 degrees coordinate
     */
    p.xAxis = null;

    /**
     * The y Axis dimensions in 22.6 degrees coordinate
     */
    p.yAxis = null;

    /**
     * The z Axis dimensions in 22.6 degrees coordinate
     */
    p.zAxis = null;

    /**
     * Pyramid tall mode
     */
    p.tall = false;

    // constructor
    p.initialize = function () {
        return this;
    };

    // public methods
    p.toString = function () {
        return "[AbstractDimension]";
    };

    // private methods

    obelisk.AbstractDimension = AbstractDimension;
}(obelisk));

/*global obelisk:true*/

/*
 * BrickDimension
 */

(function (obelisk) {
    "use strict";

    var BrickDimension, p;
    BrickDimension = function (xAxis, yAxis) {
        this.initialize(xAxis, yAxis);
    };
    p = BrickDimension.prototype = new obelisk.AbstractDimension();

    // constructor
    p.initialize = function (xAxis, yAxis) {
        this.xAxis = xAxis || 30;
        this.yAxis = yAxis || 30;

        if (this.xAxis % 2 === 1 || this.yAxis % 2 === 1) {
            throw new Error("x,yAxis must be even number");
        }

        // xAxis || yAxis = 4 floodFill could not be applied
        if (this.xAxis <= 4 || this.yAxis <= 4) {
            throw new Error("dimension is too small");
        }

        return this;
    };

    p.toString = function () {
        return "[BrickDimension]";
    };

    obelisk.BrickDimension = BrickDimension;
}(obelisk));

/*global obelisk:true*/

/*
 * CubeDimension
 */

(function (obelisk) {
    "use strict";

    var CubeDimension, p;
    CubeDimension = function (xAxis, yAxis, zAxis) {
        this.initialize(xAxis, yAxis, zAxis);
    };
    p = CubeDimension.prototype = new obelisk.AbstractDimension();

    // constructor
    p.initialize = function (xAxis, yAxis, zAxis) {
        this.xAxis = xAxis || 30;
        this.yAxis = yAxis || 30;
        this.zAxis = zAxis || 30;

        if (this.xAxis % 2 === 1 || this.yAxis % 2 === 1) {
            throw new Error("x,yAxis must be even number");
        }

        // xAxis || yAxis = 4 floodFill could not be applied
        if (this.xAxis <= 4 || this.yAxis <= 4 || this.zAxis <= 2) {
            throw new Error("dimension is too small");
        }

        return this;
    };

    p.toString = function () {
        return "[CubeDimension]";
    };

    obelisk.CubeDimension = CubeDimension;
}(obelisk));

/*global obelisk:true*/

/*
 * PyramidDimension
 */

(function (obelisk) {
    "use strict";

    var PyramidDimension, p;
    PyramidDimension = function (axis, tall) {
        this.initialize(axis, tall);
    };
    p = PyramidDimension.prototype = new obelisk.AbstractDimension();

    // constructor
    p.initialize = function (axis, tall) {
        this.xAxis = axis || 30;
        this.yAxis = axis || 30;
        this.tall = tall || false;

        if (this.xAxis % 2 === 1) {
            throw new Error("axis must be even number");
        }

        if (this.xAxis <= 4) {
            throw new Error("dimension is too small");
        }

        return this;
    };

    p.toString = function () {
        return "[PyramidDimension]";
    };

    obelisk.PyramidDimension = PyramidDimension;
}(obelisk));

/*global obelisk:true*/

/*
 * SideXDimension
 */

(function (obelisk) {
    "use strict";

    var SideXDimension, p;
    SideXDimension = function (xAxis, zAxis) {
        this.initialize(xAxis, zAxis);
    };
    p = SideXDimension.prototype = new obelisk.AbstractDimension();

    // constructor
    p.initialize = function (xAxis, zAxis) {
        this.xAxis = xAxis || 30;
        this.zAxis = zAxis || 30;

        if (this.xAxis % 2 === 1) {
            throw new Error("xAxis must be even number");
        }

        // xAxis || zAxis = 4 floodFill could not be applied
        if (this.xAxis <= 4 || this.zAxis <= 2) {
            throw new Error("dimension is too small");
        }

        return this;
    };

    p.toString = function () {
        return "[SideXDimension]";
    };

    obelisk.SideXDimension = SideXDimension;
}(obelisk));

/*global obelisk:true*/

/*
 * SideYDimension
 */

(function (obelisk) {
    "use strict";

    var SideYDimension, p;

    SideYDimension = function (yAxis, zAxis) {
        this.initialize(yAxis, zAxis);
    };
    p = SideYDimension.prototype = new obelisk.AbstractDimension();

    // constructor
    p.initialize = function (yAxis, zAxis) {
        this.yAxis = yAxis || 30;
        this.zAxis = zAxis || 30;

        if (this.yAxis % 2 === 1) {
            throw new Error("yAxis must be even number");
        }

        // yAxis || zAxis = 4 floodFill could not be applied
        if (this.yAxis <= 4 || this.zAxis <= 2) {
            throw new Error("dimension is too small");
        }

        return this;
    };

    p.toString = function () {
        return "[SideYDimension]";
    };

    obelisk.SideYDimension = SideYDimension;
}(obelisk));

/*global obelisk:true*/

/*
 * SlopeDimension
 */

(function (obelisk) {
    "use strict";

    var SlopeDimension, p;
    SlopeDimension = function (xAxis, yAxis) {
        this.initialize(xAxis, yAxis);
    };
    p = SlopeDimension.prototype = new obelisk.AbstractDimension();

    // constructor
    p.initialize = function (xAxis, yAxis) {
        this.xAxis = xAxis || 30;
        this.yAxis = yAxis || 30;

        if (this.xAxis % 2 === 1 || this.yAxis % 2 === 1) {
            throw new Error("xAxis and yAxis must be even number");
        }

        if (this.xAxis <= 4 || this.yAxis <= 4) {
            throw new Error("dimension is too small");
        }

        return this;
    };

    p.toString = function () {
        return "[SlopeDimension]";
    };

    obelisk.SlopeDimension = SlopeDimension;
}(obelisk));

/*global obelisk:true*/

/*
 * BitmapData
 */

(function (obelisk) {
    "use strict";

    var BitmapData, p;
    BitmapData = function (w, h, useDefaultCanvas) {
        this.initialize(w, h, useDefaultCanvas);
    };
    p = BitmapData.prototype;

    // public property
    p.imageData = null;
    p.canvas = null;
    p.context = null;

    // constructor
    p.initialize = function (w, h, useDefaultCanvas) {
        if (w === undefined || h === undefined) {
            throw new Error("BitmapData width or height is missing");
        }

        if (useDefaultCanvas) {
            this.canvas = obelisk.CanvasManager.getDefaultCanvas();
        } else {
            this.canvas = obelisk.CanvasManager.getNewCanvas();
        }

        this.canvas.setAttribute('width', w);
        this.canvas.setAttribute('height', h);

        this.context = this.canvas.getContext('2d');
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.imageData = this.context.createImageData(w, h);

        return this;
    };

    p.setPixel = function (posX, posY, color) {
        var index = (posY * this.imageData.width + posX) * 4;
        this.setPixelByIndex(index, color);
    };

    p.setPixelByIndex = function (index, color) {
        var pixels = this.imageData.data;
        pixels[index] = (color >>> 16) & 0xFF;
        pixels[index + 1] = (color >>> 8) & 0xFF;
        pixels[index + 2] = (color >>> 0) & 0xFF;
        pixels[index + 3] = (color >>> 24) & 0xFF;
    };

    p.checkPixelAvailable = function (x, y) {
        var index = (y * this.imageData.width + x) * 4;
        return this.imageData.data[index + 3] === 0;
    };

    p.floodFill = function (posX, posY, color) {
        if (((color >>> 24) & 0xFF) === 0x00) {
            // transparent flood fill
            return;
        }

        var x = posX, y = posY,
            stack = [],
            nowCol = [],
            prevCol = [],
            col, row, matchFlag, newStart,
            w = this.imageData.width,
            h = this.imageData.height,
            i, j;

        // bound reach
        if (x < 0 || y < 0 || x >= w || y >= h) {
            return;
        }

        // first point check fail
        if (!this.checkPixelAvailable(x, y)) {
            throw new Error("Start point for flood fill is already filled");
        }

        // left side flood fill
        for (col = x; col >= 0; col -= 1) {
            // top side
            for (row = y; row >= 0; row -= 1) {
                if (this.checkPixelAvailable(col, row)) {
                    // available pixel
                    stack.push((row * w + col) * 4);
                    nowCol.push(row);
                } else {
                    // first one is invalid pixel && not at col top
                    if (row === y && this.checkPixelAvailable(col + 1, row - 1)) {

                        // next one is valid
                        if (this.checkPixelAvailable(col, row - 1)) {
                            newStart = row - 1;
                        } else {
                            if (this.checkPixelAvailable(col + 1, row - 2)) {
                                newStart = row - 2;
                            } else {
                                // fail, assign max value to avoid loop below
                                newStart = -1;
                            }
                        }

                        for (row = newStart; row >= 0; row -= 1) {
                            if (this.checkPixelAvailable(col, row)) {
                                // available pixel
                                stack.push((row * w + col) * 4);
                                nowCol.push(row);
                            } else {
                                break;
                            }
                        }
                    }

                    break;
                }
            }


            // bottom side
            for (row = y; row < h; row += 1) {
                if (this.checkPixelAvailable(col, row)) {
                    // available pixel
                    stack.push((row * w + col) * 4);
                    nowCol.push(row);
                } else {
                    // first one is invalid pixel && not at col bottom
                    if (row === y && this.checkPixelAvailable(col + 1, row + 1)) {

                        // next one is valid
                        if (this.checkPixelAvailable(col, row + 1)) {
                            newStart = row + 1;
                        } else {
                            if (this.checkPixelAvailable(col + 1, row + 2)) {
                                newStart = row + 2;
                            } else {
                                // fail, assign max value to avoid loop below
                                newStart = h;
                            }
                        }

                        for (row = newStart; row < h; row += 1) {
                            if (this.checkPixelAvailable(col, row)) {
                                // available pixel
                                stack.push((row * w + col) * 4);
                                nowCol.push(row);
                            } else {
                                break;
                            }
                        }
                    }

                    break;
                }
            }

            // compare with previous column
            // for first column
            // the given point should be inside the container
            if (col === x) {
                prevCol = nowCol.concat();
            }

            matchFlag = false;

            for (i = 0; i < prevCol.length; i += 1) {
                for (j = 0; j < prevCol.length; j += 1) {
                    if (nowCol[j] === prevCol[i]) {
                        matchFlag = true;
                        y = prevCol[i];
                        break;
                    }
                }

                if (matchFlag) {
                    break;
                }
            }

            if (matchFlag) {
                prevCol = nowCol.concat();
                nowCol = [];
            } else {
                // bound reach
                break;
            }
        }

        // reset start point
        x = posX;
        y = posY;
        prevCol = [];
        nowCol = [];

        // right side flood fill
        for (col = x; col < w; col += 1) {

            // top side
            for (row = y; row >= 0; row -= 1) {
                if (this.checkPixelAvailable(col, row)) {
                    // available pixel
                    stack.push((row * w + col) * 4);
                    nowCol.push(row);
                } else {
                    // first one is invalid pixel && not at col top
                    if (row === y && this.checkPixelAvailable(col - 1, row - 1)) {

                        // next one is valid
                        if (this.checkPixelAvailable(col, row - 1)) {
                            newStart = row - 1;
                        } else {
                            if (this.checkPixelAvailable(col - 1, row - 2)) {
                                newStart = row - 2;
                            } else {
                                // fail, assign max value to avoid loop below
                                newStart = -1;
                            }
                        }

                        for (row = newStart; row >= 0; row -= 1) {
                            if (this.checkPixelAvailable(col, row)) {
                                // available pixel
                                stack.push((row * w + col) * 4);
                                nowCol.push(row);
                            } else {
                                break;
                            }
                        }
                    }

                    break;
                }
            }

            // bottom side
            for (row = y; row < h; row += 1) {
                if (this.checkPixelAvailable(col, row)) {
                    // available pixel
                    stack.push((row * w + col) * 4);
                    nowCol.push(row);
                } else {
                    // first one is invalid pixel && not at col bottom
                    if (row === y && this.checkPixelAvailable(col - 1, row + 1)) {

                        // next one is valid
                        if (this.checkPixelAvailable(col, row + 1)) {
                            newStart = row + 1;
                        } else {
                            if (this.checkPixelAvailable(col - 1, row + 2)) {
                                newStart = row + 2;
                            } else {
                                // fail, assign max value to avoid loop below
                                newStart = h;
                            }
                        }

                        for (row = newStart; row < h; row += 1) {
                            if (this.checkPixelAvailable(col, row)) {
                                // available pixel
                                stack.push((row * w + col) * 4);
                                nowCol.push(row);
                            } else {
                                break;
                            }
                        }
                    }

                    break;
                }
            }

            // compare with previous column
            // for first column
            // the given point should be inside the container
            if (col === x) {
                prevCol = nowCol.concat();
            }

            matchFlag = false;

            for (i = 0; i < prevCol.length; i += 1) {
                for (j = 0; j < prevCol.length; j += 1) {
                    if (nowCol[j] === prevCol[i]) {
                        matchFlag = true;
                        y = prevCol[i];
                        break;
                    }
                }

                if (matchFlag) {
                    break;
                }
            }

            if (matchFlag) {
                prevCol = nowCol.concat();
                nowCol = [];
            } else {
                // bound reach
                break;
            }
        }

        // fill image data
        for (i = 0; i < stack.length; i += 1) {
            this.setPixelByIndex(stack[i], color);
        }
    };

    p.toString = function () {
        return "[BitmapData]";
    };

    obelisk.BitmapData = BitmapData;
}(obelisk));

/*global obelisk:true*/

/*
 * PixelObject
 */

(function (obelisk) {
    "use strict";

    var PixelObject, p;
    PixelObject = function (primitive, point3D) {
        this.initialize(primitive, point3D);
    };
    p = PixelObject.prototype;

    // public properties
    p.x = null;
    p.y = null;
    p.canvas = null;

    // constructor
    p.initialize = function (primitive, point3D) {
        if (!primitive) {
            throw new Error("Primitive is not defined");
        }

        var p3D = point3D || new obelisk.Point3D();

        this.canvas = primitive.canvas;
        this.x = primitive.matrix.tx + p3D.x - p3D.y;
        this.y = primitive.matrix.ty + Math.floor(p3D.x / 2 + p3D.y / 2) - p3D.z;

        return this;
    };

    // public methods

    // todo: add canvas remove method

    p.toString = function () {
        return "[PixelObject]";
    };

    // private methods

    obelisk.PixelObject = PixelObject;
}(obelisk));

/*global obelisk:true, jQuery:true*/

/*
 * PixelView
 */

(function (obelisk) {
    "use strict";

    var PixelView, p;
    PixelView = function (canvas, point) {
        this.initialize(canvas, point);
    };
    p = PixelView.prototype;

    // public properties
    p.canvas = null;
    p.context = null;
    p.point = null;

    // constructor
    p.initialize = function (canvas, point) {
        if (!canvas) {
            throw new Error("Canvas is not defined");
        }

        try {
            if (canvas instanceof jQuery) {
                canvas = canvas.get(0);
            }
        } catch (e) {
        }

        this.canvas = canvas;
        this.context = this.canvas.getContext('2d');
        this.point = point || new obelisk.Point(0, 0);

        return this;
    };

    // public methods
    p.renderObject = function (primitive, point3D) {
        var po = new obelisk.PixelObject(primitive, point3D);
        this.context.drawImage(po.canvas, this.point.x + po.x, this.point.y + po.y);
    };

    p.clear = function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    };

    p.toString = function () {
        return "[PixelView]";
    };

    obelisk.PixelView = PixelView;
}(obelisk));

/*global obelisk:true*/

/*
 * Matrix
 */

(function (obelisk) {
    "use strict";

    var Matrix, p;
    Matrix = function (a, b, c, d, tx, ty) {
        this.initialize(a, b, c, d, tx, ty);
    };
    p = Matrix.prototype;

    // public properties:
    /**
     * Position (0, 0) in a 3x3 matrix.
     * @property a
     * @type Number
     **/
    p.a = 1;

    /**
     * Position (0, 1) in a 3x3 matrix.
     * @property b
     * @type Number
     **/
    p.b = 0;

    /**
     * Position (1, 0) in a 3x3 matrix.
     * @property c
     * @type Number
     **/
    p.c = 0;

    /**
     * Position (1, 1) in a 3x3 matrix.
     * @property d
     * @type Number
     **/
    p.d = 1;

    /**
     * Position (2, 0) in a 3x3 matrix.
     * @property tx
     * @type Number
     **/
    p.tx = 0;

    /**
     * Position (2, 1) in a 3x3 matrix.
     * @property ty
     * @type Number
     **/
    p.ty = 0;

    // constructor
    p.initialize = function (a, b, c, d, tx, ty) {
        this.a = (a === undefined) ? 1 : a;
        this.b = b || 0;
        this.c = c || 0;
        this.d = (d === undefined) ? 1 : d;
        this.tx = tx || 0;
        this.ty = ty || 0;
        return this;
    };

    // public methods
    p.toString = function () {
        return "[Matrix]";
    };

    obelisk.Matrix = Matrix;
}(obelisk));

/*global obelisk:true*/

/*
 * Point
 */

(function (obelisk) {
    "use strict";

    var Point, p;
    Point = function (x, y) {
        this.initialize(x, y);
    };
    p = Point.prototype;

    // public properties
    p.x = 0;
    p.y = 0;

    // constructor
    p.initialize = function (x, y) {
        this.x = (x === undefined ? 0 : x);
        this.y = (y === undefined ? 0 : y);
        return this;
    };

    // public methods
    p.toString = function () {
        return "[Point x : " + this.x + ", y : " + this.y + "]";
    };

    // private methods

    obelisk.Point = Point;
}(obelisk));

/*global obelisk:true*/

/*
 * Point3D
 */

(function (obelisk) {
    "use strict";

    var Point3D, p;
    Point3D = function (x, y, z) {
        this.initialize(x, y, z);
    };
    p = Point3D.prototype;

    // public properties
    p.x = 0;
    p.y = 0;
    p.z = 0;

    // constructor
    p.initialize = function (x, y, z) {
        this.x = (x === undefined ? 0 : x);
        this.y = (y === undefined ? 0 : y);
        this.z = (z === undefined ? 0 : z);
        return this;
    };

    // public methods
    p.toGlobalCoordinates = function (offset) {
        var p2D = new obelisk.Point(
            this.x - this.y,
            Math.floor(this.x / 2 + this.y / 2) - this.z
        );

        if (offset !== undefined) {
            p2D.x = p2D.x + offset.x;
            p2D.y = p2D.y + offset.y;
        }

        return p2D;
    };

    p.toString = function () {
        return "[Point3D x : " + this.x + ", y : " + this.y + ", z: " + this.z + "]";
    };

    // private methods

    obelisk.Point3D = Point3D;
}(obelisk));

/*global obelisk:true*/

/*
 * AbstractPrimitive
 */

(function (obelisk) {
    "use strict";

    var AbstractPrimitive, p;
    AbstractPrimitive = function () {
        this.initialize();
    };
    p = AbstractPrimitive.prototype;

    // public properties
    /**
     * the canvas for drawImage to any canvas
     */
    p.canvas = null;

    // protect properties
    /**
     * the width of the bitmap in 2d flash coordinate
     */
    p.w = null;

    /**
     * the height of the bitmap in 2d flash coordinate
     */
    p.h = null;

    /**
     * the dimension of primitive in 3d pixel coordinate
     */
    p.dimension = null;

    /**
     * the color obj of the primitive
     */
    p.color = null;

    /**
     * the border option of the primitive
     */
    p.border = null;

    /**
     * the source bitmapdata contains pixel graphic
     */
    p.bitmapData = null;

    /**
     * the preserve canvas option
     */
    p.useDefaultCanvas = null;

    /**
     * the matrix offset between the bitmap and the 3d pixel coordinate ZERO point
     */
    p.matrix = null;

    // constructor
    p.initialize = function () {
        return this;
    };

    // public methods
    p.toString = function () {
        return "[AbstractPrimitive]";
    };

    // private methods

    obelisk.AbstractPrimitive = AbstractPrimitive;
}(obelisk));

/*global obelisk:true*/

/*
 * Brick
 */

(function (obelisk) {
    "use strict";

    var Brick, p;
    Brick = function (dimension, color, border, useDefaultCanvas) {
        this.initialize(dimension, color, border, useDefaultCanvas);
    };
    p = Brick.prototype = new obelisk.AbstractPrimitive();

    // public properties

    // constructor
    p.initialize = function (dimension, color, border, useDefaultCanvas) {
        this.initRender(dimension, color, border, useDefaultCanvas);
        this.initRectangle();
        this.initBitmapData();
        this.build();
        this.renderBitmapDataForCanvas();
        return this;
    };

    // private method
    p.initRender = function (dimension, color, border, useDefaultCanvas) {
        this.useDefaultCanvas = useDefaultCanvas || false;
        this.border = border || border === undefined;
        this.dimension = dimension === undefined ? new obelisk.BrickDimension() : dimension;
        this.color = color === undefined ? new obelisk.SideColor() : color;
    };

    p.initRectangle = function () {
        this.w = this.dimension.xAxis + this.dimension.yAxis;
        this.h = (this.dimension.xAxis + this.dimension.yAxis) / 2;

        // 22.6 degrees implementation
        this.w -= 2;
        this.h -= 1;

        // the matrix offset between the bitmap and the 3d pixel coordinate ZERO point
        this.matrix = new obelisk.Matrix();
        this.matrix.tx = -this.dimension.yAxis + 2;
        this.matrix.ty = 0;
    };

    p.initBitmapData = function () {
        this.bitmapData = new obelisk.BitmapData(this.w, this.h, this.useDefaultCanvas);
    };
    p.renderBitmapDataForCanvas = function () {
        this.bitmapData.context.putImageData(this.bitmapData.imageData, 0, 0);
        this.canvas = this.bitmapData.canvas;
    };

    p.build = function () {
        var xOffsetInner, yOffsetInner, xOffsetOut, yOffsetOut, i, j, borderColor;
        xOffsetInner = this.dimension.yAxis - 2;
        yOffsetInner = 0;
        xOffsetOut = this.dimension.xAxis - 1;
        yOffsetOut = this.h - 1;
        borderColor = this.border ? this.color.border : this.color.inner;

        //x axis
        for (i = 0; i < this.dimension.xAxis; i += 1) {
            this.bitmapData.setPixel(xOffsetInner + i, yOffsetInner + Math.floor(i / 2), borderColor);
            this.bitmapData.setPixel(xOffsetOut - i, yOffsetOut - Math.floor(i / 2), borderColor);
        }

        //y axis
        for (j = 0; j < this.dimension.yAxis; j += 1) {
            this.bitmapData.setPixel(xOffsetInner + 1 - j, yOffsetInner + Math.floor(j / 2), borderColor);
            this.bitmapData.setPixel(xOffsetOut - 1 + j, yOffsetOut - Math.floor(j / 2), borderColor);
        }

        //fill an pixel graphic enclosed
        this.bitmapData.floodFill(Math.floor(this.w / 2), Math.floor(this.h / 2), this.color.inner);
    };

    // public methods
    p.toString = function () {
        return "[Brick]";
    };

    obelisk.Brick = Brick;
}(obelisk));

/*global obelisk:true*/

/*
 * Cube
 */

(function (obelisk) {
    "use strict";

    var Cube, p;
    Cube = function (dimension, color, border, useDefaultCanvas) {
        this.initialize(dimension, color, border, useDefaultCanvas);
    };
    p = Cube.prototype = new obelisk.AbstractPrimitive();

    // public properties

    // constructor
    p.initialize = function (dimension, color, border, useDefaultCanvas) {
        this.initRender(dimension, color, border, useDefaultCanvas);
        this.initRectangle();
        this.initBitmapData();
        this.build();
        this.renderBitmapDataForCanvas();
        return this;
    };

    // private method
    p.initRender = function (dimension, color, border, useDefaultCanvas) {
        this.useDefaultCanvas = useDefaultCanvas || false;
        this.border = border || border === undefined;
        this.dimension = dimension === undefined ? new obelisk.CubeDimension() : dimension;
        this.color = color === undefined ? new obelisk.CubeColor() : color;
    };

    p.initRectangle = function () {
        this.w = this.dimension.xAxis + this.dimension.yAxis;
        this.h = this.dimension.zAxis + (this.dimension.xAxis + this.dimension.yAxis) / 2;

        // 22.6 degrees implementation
        this.w -= 2;
        this.h -= 1;

        // the matrix offset between the bitmap and the 3d pixel coordinate ZERO point
        this.matrix = new obelisk.Matrix();
        this.matrix.tx = -this.dimension.yAxis + 2;
        this.matrix.ty = -this.dimension.zAxis;
    };

    p.initBitmapData = function () {
        this.bitmapData = new obelisk.BitmapData(this.w, this.h, this.useDefaultCanvas);
    };
    p.renderBitmapDataForCanvas = function () {
        this.canvas = this.bitmapData.canvas;
    };

    p.build = function () {
        var brick, sideX, sideY, po_brick, po_x, po_y, ctx, bmd, offsetX, offsetY,
            i, j, k;
        // horizontal layer
        brick = new obelisk.Brick(
            new obelisk.BrickDimension(this.dimension.xAxis, this.dimension.yAxis),
            new obelisk.SideColor(this.color.border, this.color.horizontal),
            this.border
        );

        // left side
        sideX = new obelisk.SideX(
            new obelisk.SideXDimension(this.dimension.xAxis, this.dimension.zAxis),
            new obelisk.SideColor(this.color.border, this.color.left),
            this.border
        );

        // right side
        sideY = new obelisk.SideY(
            new obelisk.SideYDimension(this.dimension.yAxis, this.dimension.zAxis),
            new obelisk.SideColor(this.color.border, this.color.right),
            this.border
        );

        po_brick = new obelisk.PixelObject(brick);
        po_x = new obelisk.PixelObject(sideX);
        po_y = new obelisk.PixelObject(sideY);

        ctx = this.bitmapData.context;
        ctx.drawImage(po_brick.canvas, po_brick.x + this.dimension.yAxis - 2, po_brick.y);
        ctx.drawImage(po_x.canvas, po_x.x, po_x.y + this.dimension.zAxis + this.dimension.yAxis / 2 - 1);
        ctx.drawImage(po_y.canvas, po_y.x + this.w - 2, po_x.y + this.dimension.zAxis + this.dimension.xAxis / 2 - 1);

        // highlight & highlight fix
        bmd = new obelisk.BitmapData(this.w, this.h);

        if (this.border) {
            offsetX = this.dimension.xAxis - 2;
            offsetY = (this.dimension.xAxis + this.dimension.yAxis) / 2 - 2;

            //the 2px in bounding without hightlight
            for (i = 0; i < this.dimension.xAxis - 2; i += 1) {
                bmd.setPixel(offsetX + 1 - i, offsetY - Math.floor(i / 2), this.color.borderHighlight);
            }

            //the 2px in bounding without hightlight
            for (j = 0; j < this.dimension.yAxis - 2; j += 1) {
                bmd.setPixel(offsetX + j, offsetY - Math.floor(j / 2), this.color.borderHighlight);
            }

            for (k = 0; k < this.dimension.zAxis; k += 1) {
                bmd.setPixel(offsetX, offsetY + k, this.color.borderHighlight);
            }
        } else {
            for (i = 0; i < this.dimension.zAxis; i += 1) {
                bmd.setPixel(this.dimension.xAxis - 2, (this.dimension.xAxis + this.dimension.yAxis) / 2 - 1 + i, this.color.left);
            }
        }
        bmd.context.putImageData(bmd.imageData, 0, 0);
        ctx.drawImage(bmd.canvas, 0, 0);
    };

    // public methods
    p.toString = function () {
        return "[Cube]";
    };

    obelisk.Cube = Cube;
}(obelisk));

/*global obelisk:true*/

/*
 * Pyramid
 */

(function (obelisk) {
    "use strict";

    var Pyramid, p;
    Pyramid = function (dimension, color, border, useDefaultCanvas) {
        this.initialize(dimension, color, border, useDefaultCanvas);
    };
    p = Pyramid.prototype = new obelisk.AbstractPrimitive();

    // private properties
    p.hSize = null;
    p.hOffset = null;

    // constructor
    p.initialize = function (dimension, color, border, useDefaultCanvas) {
        this.initRender(dimension, color, border, useDefaultCanvas);
        this.initRectangle();
        this.initBitmapData();
        this.build();
        this.renderBitmapDataForCanvas();
        return this;
    };

    // private method
    p.initRender = function (dimension, color, border, useDefaultCanvas) {
        this.useDefaultCanvas = useDefaultCanvas || false;
        this.border = border || border === undefined;
        this.dimension = dimension === undefined ? new obelisk.PyramidDimension() : dimension;
        this.color = color === undefined ? new obelisk.PyramidColor() : color;

        this.hSize = this.dimension.tall ? this.dimension.xAxis * 2 : this.dimension.xAxis;
        this.hOffset = this.dimension.tall ? -3 : -2;
    };

    p.initRectangle = function () {
        this.w = this.dimension.xAxis + this.dimension.yAxis;
        this.h = this.hSize + this.dimension.xAxis / 2;

        // 22.6 degrees implementation
        this.w -= 2;
        this.h += this.hOffset;

        // the matrix offset between the bitmap and the 3d pixel coordinate ZERO point
        this.matrix = new obelisk.Matrix();
        this.matrix.tx = -this.dimension.xAxis + 2;
        this.matrix.ty = -this.hSize / 2 + 2 - (this.dimension.tall ? this.dimension.xAxis / 2 : 1);
    };

    p.initBitmapData = function () {
        this.bitmapData = new obelisk.BitmapData(this.w, this.h, this.useDefaultCanvas);
    };
    p.renderBitmapDataForCanvas = function () {
        this.bitmapData.context.putImageData(this.bitmapData.imageData, 0, 0);
        this.canvas = this.bitmapData.canvas;
    };

    p.build = function () {
        var colorborder_left, colorborder_right, colorborder_highlight,
            i, j, k, l1, m1, l2, m2;
        colorborder_left = this.border ? this.color.border : this.color.left;
        colorborder_right = this.border ? this.color.border : this.color.right;

        colorborder_highlight = this.border ? this.color.borderHighlight : colorborder_left;

        //z axis || hightlight
        for (k = 0; k < this.hSize + this.dimension.xAxis / 2 - 4; k += 1) {
            this.bitmapData.setPixel(this.dimension.xAxis - 2, k + 3 + this.hOffset, colorborder_highlight);
        }

        //x axis
        for (i = 0; i < this.dimension.xAxis; i += 1) {
            this.bitmapData.setPixel(i, this.hSize + Math.floor(i / 2) + this.hOffset, colorborder_left);
        }

        //y axis
        for (j = 0; j < this.dimension.xAxis; j += 1) {
            this.bitmapData.setPixel(j + this.dimension.xAxis - 2, this.hSize + this.dimension.xAxis / 2 - Math.floor(j / 2) - 1 + this.hOffset, colorborder_right);
        }

        if (!this.dimension.tall) {
            //left edge
            for (l1 = 0; l1 < this.hSize; l1 += 1) {
                this.bitmapData.setPixel(l1, this.hSize - l1 + this.hOffset, colorborder_left);
            }

            //right edge
            for (m1 = 0; m1 < this.hSize; m1 += 1) {
                this.bitmapData.setPixel(m1 + this.hSize - 2, m1 + 1 + this.hOffset, colorborder_right);
            }
        } else {
            //left edge
            for (l2 = 0; l2 < this.hSize - 2; l2 += 1) {
                this.bitmapData.setPixel(Math.floor(l2 / 2), this.hSize - l2 + this.hOffset, colorborder_left);
            }

            //right edge
            for (m2 = 2; m2 < this.hSize; m2 += 1) {
                this.bitmapData.setPixel(Math.floor(m2 / 2) + this.dimension.xAxis - 2, m2 + 1 + this.hOffset, colorborder_right);
            }
        }

        if (!this.border) {
            this.bitmapData.setPixel(this.dimension.xAxis - 2, this.hSize + this.dimension.xAxis / 2 - 1 + this.hOffset, colorborder_left);
        }

        //floodfill
        this.bitmapData.floodFill(this.dimension.xAxis - 1, this.hSize + Math.floor((this.dimension.xAxis - 1) / 2) + this.hOffset - 1, this.color.right);
        this.bitmapData.floodFill(this.dimension.xAxis - 3, this.hSize + Math.floor((this.dimension.xAxis - 1) / 2) + this.hOffset - 2, this.color.left);
    };

    // public methods
    p.toString = function () {
        return "[Pyramid]";
    };

    obelisk.Pyramid = Pyramid;
}(obelisk));

/*global obelisk:true*/

/*
 * SideX
 */

(function (obelisk) {
    "use strict";
    var SideX, p;
    SideX = function (dimension, color, border, useDefaultCanvas) {
        this.initialize(dimension, color, border, useDefaultCanvas);
    };
    p = SideX.prototype = new obelisk.AbstractPrimitive();

    // public properties

    // constructor
    p.initialize = function (dimension, color, border, useDefaultCanvas) {
        this.initRender(dimension, color, border, useDefaultCanvas);
        this.initRectangle();
        this.initBitmapData();
        this.build();
        this.renderBitmapDataForCanvas();
        return this;
    };

    // private method
    p.initRender = function (dimension, color, border, useDefaultCanvas) {
        this.useDefaultCanvas = useDefaultCanvas || false;
        this.border = border || border === undefined;
        this.dimension = dimension === undefined ? new obelisk.SideXDimension() : dimension;
        this.color = color === undefined ? new obelisk.SideColor() : color;
    };

    p.initRectangle = function () {
        this.w = this.dimension.xAxis;
        this.h = this.dimension.zAxis + this.dimension.xAxis / 2;

        // the matrix offset between the bitmap and the 3d pixel coordinate ZERO point
        this.matrix = new obelisk.Matrix();
        this.matrix.tx = 0;
        this.matrix.ty = -this.dimension.zAxis;
    };

    p.initBitmapData = function () {
        this.bitmapData = new obelisk.BitmapData(this.w, this.h, this.useDefaultCanvas);
    };
    p.renderBitmapDataForCanvas = function () {
        this.bitmapData.context.putImageData(this.bitmapData.imageData, 0, 0);
        this.canvas = this.bitmapData.canvas;
    };

    p.build = function () {
        var xOffsetInner, yOffsetInner, xOffsetOut, yOffsetOut, i, j, borderColor;

        xOffsetInner = 0;
        yOffsetInner = this.dimension.zAxis;
        xOffsetOut = this.dimension.xAxis - 1;
        yOffsetOut = this.h - this.dimension.zAxis - 1;
        borderColor = this.border ? this.color.border : this.color.inner;

        //x axis
        for (i = 0; i < this.dimension.xAxis; i += 1) {
            this.bitmapData.setPixel(xOffsetInner + i, yOffsetInner + Math.floor(i / 2), borderColor);
            this.bitmapData.setPixel(xOffsetOut - i, yOffsetOut - Math.floor(i / 2), borderColor);
        }

        //z axis
        for (j = 0; j < this.dimension.zAxis; j += 1) {
            this.bitmapData.setPixel(xOffsetInner, yOffsetInner - j, borderColor);
            this.bitmapData.setPixel(xOffsetOut, yOffsetOut + j, borderColor);
        }

        //fill an pixel graphic enclosed
        this.bitmapData.floodFill(Math.floor(this.w / 2), Math.floor(this.h / 2), this.color.inner);
    };

    // public methods
    p.toString = function () {
        return "[SideX]";
    };

    obelisk.SideX = SideX;
}(obelisk));

/*global obelisk:true*/

/*
 * SideY
 */

(function (obelisk) {
    "use strict";

    var SideY, p;
    SideY = function (dimension, color, border, useDefaultCanvas) {
        this.initialize(dimension, color, border, useDefaultCanvas);
    };
    p = SideY.prototype = new obelisk.AbstractPrimitive();

    // public properties

    // constructor
    p.initialize = function (dimension, color, border, useDefaultCanvas) {
        this.initRender(dimension, color, border, useDefaultCanvas);
        this.initRectangle();
        this.initBitmapData();
        this.build();
        this.renderBitmapDataForCanvas();
        return this;
    };

    // private method
    p.initRender = function (dimension, color, border, useDefaultCanvas) {
        this.useDefaultCanvas = useDefaultCanvas || false;
        this.border = border || border === undefined;
        this.dimension = dimension === undefined ? new obelisk.SideYDimension() : dimension;
        this.color = color === undefined ? new obelisk.SideColor() : color;
    };

    p.initRectangle = function () {
        this.w = this.dimension.yAxis;
        this.h = this.dimension.zAxis + this.dimension.yAxis / 2;

        // the matrix offset between the bitmap and the 3d pixel coordinate ZERO point
        this.matrix = new obelisk.Matrix();
        this.matrix.tx = -this.dimension.yAxis + 2;
        this.matrix.ty = -this.dimension.zAxis;
    };

    p.initBitmapData = function () {
        this.bitmapData = new obelisk.BitmapData(this.w, this.h, this.useDefaultCanvas);
    };
    p.renderBitmapDataForCanvas = function () {
        this.bitmapData.context.putImageData(this.bitmapData.imageData, 0, 0);
        this.canvas = this.bitmapData.canvas;
    };

    p.build = function () {
        var xOffsetInner, yOffsetInner, xOffsetOut, yOffsetOut, i, j, borderColor;
        xOffsetInner = 0;
        yOffsetInner = this.h - this.dimension.zAxis - 1;
        xOffsetOut = this.dimension.yAxis - 1;
        yOffsetOut = this.dimension.zAxis;
        borderColor = this.border ? this.color.border : this.color.inner;

        //y axis
        for (i = 0; i < this.dimension.yAxis; i += 1) {
            this.bitmapData.setPixel(xOffsetInner + i, yOffsetInner - Math.floor(i / 2), borderColor);
            this.bitmapData.setPixel(xOffsetOut - i, yOffsetOut + Math.floor(i / 2), borderColor);
        }

        //z axis
        for (j = 0; j < this.dimension.zAxis; j += 1) {
            this.bitmapData.setPixel(xOffsetInner, yOffsetInner + j, borderColor);
            this.bitmapData.setPixel(xOffsetOut, yOffsetOut - j, borderColor);
        }

        //fill an pixel graphic enclosed
        this.bitmapData.floodFill(Math.floor(this.w / 2), Math.floor(this.h / 2), this.color.inner);
    };

    // public methods
    p.toString = function () {
        return "[SideY]";
    };

    obelisk.SideY = SideY;
}(obelisk));

/*global obelisk:true*/

/*
 * Slope East
 */

(function (obelisk) {
    "use strict";

    var SlopeEast, p;
    SlopeEast = function (dimension, color, border, useDefaultCanvas) {
        this.initialize(dimension, color, border, useDefaultCanvas);
    };
    p = SlopeEast.prototype = new obelisk.AbstractPrimitive();

    // constructor
    p.initialize = function (dimension, color, border, useDefaultCanvas) {
        this.initRender(dimension, color, border, useDefaultCanvas);
        this.initRectangle();
        this.initBitmapData();
        this.build();
        this.renderBitmapDataForCanvas();
        return this;
    };

    // private method
    p.initRender = function (dimension, color, border, useDefaultCanvas) {
        this.useDefaultCanvas = useDefaultCanvas || false;
        this.border = border || border === undefined;
        this.dimension = dimension === undefined ? new obelisk.SlopeDimension() : dimension;
        this.color = color === undefined ? new obelisk.SlopeColor() : color;
    };

    p.initRectangle = function () {

        this.w = this.dimension.xAxis + this.dimension.yAxis;
        this.h = this.dimension.xAxis * 2 + this.dimension.yAxis / 2;

        // 22.6 degrees implementation
        this.w -= 2;
        this.h -= 3;

        // the matrix offset between the bitmap and the 3d pixel coordinate ZERO point
        this.matrix = new obelisk.Matrix();
        this.matrix.tx = -(this.dimension.yAxis - 2);
        this.matrix.ty = -(this.dimension.xAxis * 3 / 2 - 2);
    };

    p.initBitmapData = function () {
        this.bitmapData = new obelisk.BitmapData(this.w, this.h, this.useDefaultCanvas);
    };
    p.renderBitmapDataForCanvas = function () {
        this.bitmapData.context.putImageData(this.bitmapData.imageData, 0, 0);
        this.canvas = this.bitmapData.canvas;
    };

    p.build = function () {
        var colorBorderLeft, colorBorderRight,
            i, j, k, m, n;

        colorBorderLeft = this.border ? this.color.border : this.color.left;
        colorBorderRight = this.border ? this.color.border : this.color.rightSlope;

        // y axis
        for (j = 0; j < this.dimension.yAxis; j += 1) {
            this.bitmapData.setPixel(j, this.dimension.yAxis / 2 - Math.floor(j / 2) - 1, colorBorderRight);
            this.bitmapData.setPixel(j + this.dimension.xAxis - 2, this.h - Math.floor(j / 2) - 1, colorBorderRight);
        }

        // x axis
        for (i = 0; i < this.dimension.xAxis; i += 1) {
            this.bitmapData.setPixel(i, this.h - this.dimension.xAxis / 2 + Math.floor(i / 2), colorBorderLeft);
        }

        // z axis
        for (k = this.dimension.yAxis / 2 - 1; k < this.h - this.dimension.xAxis / 2; k += 1) {
            this.bitmapData.setPixel(0, k, colorBorderLeft);
        }

        // slot
        for (m = 0; m < this.dimension.xAxis * 2 - 2; m += 1) {
            this.bitmapData.setPixel(this.dimension.yAxis - 1 + Math.floor(m / 2), m, colorBorderRight);
            this.bitmapData.setPixel(1 + Math.floor(m / 2), this.dimension.yAxis / 2 + m - 1, colorBorderRight);
        }

        // flood fill
        this.bitmapData.floodFill(this.dimension.yAxis - 2, 1, this.color.rightSlope);
        this.bitmapData.floodFill(this.dimension.xAxis - 3, this.h - 3, this.color.left);
        // hack single pixel
        this.bitmapData.setPixel(this.dimension.xAxis - 2, this.h - 2, this.color.left);

        // highlight
        if (this.border) {
            for (n = 1; n < this.dimension.xAxis * 2 - 3; n += 1) {
                this.bitmapData.setPixel(1 + Math.floor(n / 2), this.dimension.yAxis / 2 + n - 1, this.color.borderHighlight);
            }
        }
    };

    // public methods
    p.toString = function () {
        return "[SlopeEast]";
    };

    obelisk.SlopeEast = SlopeEast;
}(obelisk));

/*global obelisk:true*/

/*
 * Slope North
 */

(function (obelisk) {
    "use strict";

    var SlopeNorth, p;
    SlopeNorth = function (dimension, color, border, useDefaultCanvas) {
        this.initialize(dimension, color, border, useDefaultCanvas);
    };
    p = SlopeNorth.prototype = new obelisk.AbstractPrimitive();

    // constructor
    p.initialize = function (dimension, color, border, useDefaultCanvas) {
        this.initRender(dimension, color, border, useDefaultCanvas);
        this.initRectangle();
        this.initBitmapData();
        this.build();
        this.renderBitmapDataForCanvas();
        return this;
    };

    // private method
    p.initRender = function (dimension, color, border, useDefaultCanvas) {
        this.useDefaultCanvas = useDefaultCanvas || false;
        this.border = border || border === undefined;
        this.dimension = dimension === undefined ? new obelisk.SlopeDimension() : dimension;
        this.color = color === undefined ? new obelisk.SlopeColor() : color;
    };

    p.initRectangle = function () {

        this.w = this.dimension.xAxis + this.dimension.yAxis;
        this.h = this.dimension.yAxis * 3 / 2 + this.dimension.xAxis / 2;

        // 22.6 degrees implementation
        this.w -= 2;
        this.h -= 3;

        // the matrix offset between the bitmap and the 3d pixel coordinate ZERO point
        this.matrix = new obelisk.Matrix();
        this.matrix.tx = -(this.dimension.yAxis - 2);
        this.matrix.ty = -(this.dimension.yAxis - 2);
    };

    p.initBitmapData = function () {
        this.bitmapData = new obelisk.BitmapData(this.w, this.h, this.useDefaultCanvas);
    };
    p.renderBitmapDataForCanvas = function () {
        this.canvas = this.bitmapData.canvas;
    };

    p.build = function () {
        var colorBorderLeft, colorBorderRight, colorBorderHighlight,
            sideX, poX, ctx, bmd,
            i, j, n;

        colorBorderLeft = this.border ? this.color.border : this.color.left;
        colorBorderRight = this.border ? this.color.border : this.color.right;
        colorBorderHighlight = this.border ? this.color.borderHighlight : this.color.left;

        sideX = new obelisk.SideX(
            new obelisk.SideXDimension(this.dimension.xAxis, this.h - this.dimension.xAxis / 2),
            new obelisk.SideColor(colorBorderLeft, this.color.left)
        );

        poX = new obelisk.PixelObject(sideX);

        ctx = this.bitmapData.context;
        ctx.drawImage(poX.canvas, poX.x, poX.y + this.h - this.dimension.xAxis / 2);

        bmd = new obelisk.BitmapData(this.w, this.h);

        // close the path for floodfill
        for (i = this.h - this.dimension.yAxis * 3 / 2 + 2; i < this.h; i += 1) {
            bmd.setPixel(this.dimension.xAxis - 1, i, colorBorderRight);
        }

        // y axis
        for (j = 1; j < this.dimension.yAxis; j += 1) {
            bmd.setPixel(this.dimension.xAxis + j - 2, this.h - Math.floor(j / 2) - 1, colorBorderRight);
            bmd.setPixel(this.dimension.xAxis + j - 2, this.dimension.xAxis / 2 - 2 + j, colorBorderRight);
        }

        // flood fill
        bmd.floodFill(this.dimension.xAxis + 1, this.h - 3, this.color.right);

        //highlight
        for (n = this.dimension.xAxis / 2; n < this.h - 1; n += 1) {
            bmd.setPixel(this.dimension.xAxis - 1, n, this.color.right);
            bmd.setPixel(this.dimension.xAxis - 2, n, colorBorderHighlight);
        }

        bmd.context.putImageData(bmd.imageData, 0, 0);
        ctx.drawImage(bmd.canvas, 0, 0);
    };

    // public methods
    p.toString = function () {
        return "[SlopeNorth]";
    };

    obelisk.SlopeNorth = SlopeNorth;
}(obelisk));

/*global obelisk:true*/

/*
 * Slope South
 */

(function (obelisk) {
    "use strict";

    var SlopeSouth, p;
    SlopeSouth = function (dimension, color, border, useDefaultCanvas) {
        this.initialize(dimension, color, border, useDefaultCanvas);
    };
    p = SlopeSouth.prototype = new obelisk.AbstractPrimitive();

    // constructor
    p.initialize = function (dimension, color, border, useDefaultCanvas) {
        this.initRender(dimension, color, border, useDefaultCanvas);
        this.initRectangle();
        this.initBitmapData();
        this.build();
        this.renderBitmapDataForCanvas();
        return this;
    };

    // private method
    p.initRender = function (dimension, color, border, useDefaultCanvas) {
        this.useDefaultCanvas = useDefaultCanvas || false;
        this.border = border || border === undefined;
        this.dimension = dimension === undefined ? new obelisk.SlopeDimension() : dimension;
        this.color = color === undefined ? new obelisk.SlopeColor() : color;
    };

    p.initRectangle = function () {

        this.w = this.dimension.xAxis + this.dimension.yAxis;
        this.h = this.dimension.xAxis / 2 + this.dimension.yAxis * 2;

        // 22.6 degrees implementation
        this.w -= 2;
        this.h -= 3;

        // the matrix offset between the bitmap and the 3d pixel coordinate ZERO point
        this.matrix = new obelisk.Matrix();
        this.matrix.tx = -(this.dimension.yAxis - 2);
        this.matrix.ty = -(this.dimension.yAxis * 3 / 2 - 2);
    };

    p.initBitmapData = function () {
        this.bitmapData = new obelisk.BitmapData(this.w, this.h, this.useDefaultCanvas);
    };
    p.renderBitmapDataForCanvas = function () {
        this.bitmapData.context.putImageData(this.bitmapData.imageData, 0, 0);
        this.canvas = this.bitmapData.canvas;
    };

    p.build = function () {
        var colorBorderLeft, colorBorderRight,
            i, j, k, m, n;

        colorBorderLeft = this.border ? this.color.border : this.color.leftSlope;
        colorBorderRight = this.border ? this.color.border : this.color.right;

        // x axis
        for (j = 0; j < this.dimension.xAxis; j += 1) {
            this.bitmapData.setPixel(j, this.dimension.yAxis * 2 + Math.floor(j / 2) - 3, colorBorderLeft);
            this.bitmapData.setPixel(j + this.dimension.yAxis - 2, Math.floor(j / 2), colorBorderLeft);
        }

        // y axis
        for (i = 0; i < this.dimension.yAxis; i += 1) {
            this.bitmapData.setPixel(this.dimension.xAxis - 2 + i, this.h - Math.floor(i / 2) - 1, colorBorderRight);
        }

        // z axis
        for (k = this.dimension.xAxis / 2 - 1; k < this.h - this.dimension.yAxis / 2; k += 1) {
            this.bitmapData.setPixel(this.w - 1, k, colorBorderRight);
        }

        // slot
        for (m = 0; m < this.dimension.yAxis * 2 - 2; m += 1) {
            this.bitmapData.setPixel(Math.floor(m / 2), this.dimension.yAxis * 2 - m - 3, colorBorderLeft);
            this.bitmapData.setPixel(this.dimension.xAxis - 2 + Math.floor(m / 2), this.h - m - 1, colorBorderLeft);
        }

        // flood fill
        this.bitmapData.floodFill(this.dimension.yAxis - 1, 1, this.color.leftSlope);
        this.bitmapData.floodFill(this.dimension.xAxis, this.h - 3, this.color.right);
        // hack single pixel
        this.bitmapData.setPixel(this.dimension.xAxis - 1, this.h - 2, this.color.right);

        // highlight
        if (this.border) {
            for (n = 1; n < this.dimension.yAxis * 2 - 3; n += 1) {
                this.bitmapData.setPixel(this.dimension.xAxis - 2 + Math.floor(n / 2), this.h - n - 1, this.color.borderHighlight);
            }
        }
    };

    // public methods
    p.toString = function () {
        return "[SlopeSouth]";
    };

    obelisk.SlopeSouth = SlopeSouth;
}(obelisk));

/*global obelisk:true*/

/*
 * Slope West
 */

(function (obelisk) {
    "use strict";

    var SlopeWest, p;
    SlopeWest = function (dimension, color, border, useDefaultCanvas) {
        this.initialize(dimension, color, border, useDefaultCanvas);
    };
    p = SlopeWest.prototype = new obelisk.AbstractPrimitive();

    // constructor
    p.initialize = function (dimension, color, border, useDefaultCanvas) {
        this.initRender(dimension, color, border, useDefaultCanvas);
        this.initRectangle();
        this.initBitmapData();
        this.build();
        this.renderBitmapDataForCanvas();
        return this;
    };

    // private method
    p.initRender = function (dimension, color, border, useDefaultCanvas) {
        this.useDefaultCanvas = useDefaultCanvas || false;
        this.border = border || border === undefined;
        this.dimension = dimension === undefined ? new obelisk.SlopeDimension() : dimension;
        this.color = color === undefined ? new obelisk.SlopeColor() : color;
    };

    p.initRectangle = function () {

        this.w = this.dimension.xAxis + this.dimension.yAxis;
        this.h = this.dimension.xAxis * 3 / 2 + this.dimension.yAxis / 2;

        // 22.6 degrees implementation
        this.w -= 2;
        this.h -= 3;

        // the matrix offset between the bitmap and the 3d pixel coordinate ZERO point
        this.matrix = new obelisk.Matrix();
        this.matrix.tx = -(this.dimension.yAxis - 2);
        this.matrix.ty = -(this.dimension.xAxis - 2);
    };

    p.initBitmapData = function () {
        this.bitmapData = new obelisk.BitmapData(this.w, this.h, this.useDefaultCanvas);
    };
    p.renderBitmapDataForCanvas = function () {
        this.canvas = this.bitmapData.canvas;
    };

    p.build = function () {
        var colorBorderLeft, colorBorderRight, colorBorderHighlight,
            sideY, poY, ctx, bmd,
            i, j, n;

        colorBorderLeft = this.border ? this.color.border : this.color.left;
        colorBorderRight = this.border ? this.color.border : this.color.right;
        colorBorderHighlight = this.border ? this.color.borderHighlight : this.color.left;

        sideY = new obelisk.SideY(
            new obelisk.SideYDimension(this.dimension.yAxis, this.h - this.dimension.yAxis / 2),
            new obelisk.SideColor(colorBorderRight, this.color.right)
        );

        poY = new obelisk.PixelObject(sideY);

        ctx = this.bitmapData.context;
        ctx.drawImage(poY.canvas, poY.x + this.w - 2, poY.y + this.h - this.dimension.yAxis / 2);

        bmd = new obelisk.BitmapData(this.w, this.h);

        // close the path for floodfill
        for (i = this.h - this.dimension.xAxis * 3 / 2 + 2; i < this.h; i += 1) {
            bmd.setPixel(this.dimension.xAxis - 2, i, colorBorderLeft);
        }

        //x axis
        for (j = 0; j < this.dimension.xAxis - 1; j += 1) {
            bmd.setPixel(j, this.dimension.xAxis + this.dimension.yAxis / 2 - 3 + Math.floor(j / 2), colorBorderLeft);
            bmd.setPixel(j, this.dimension.xAxis + this.dimension.yAxis / 2 - 3 - j, colorBorderLeft);
        }

        // flood fill
        bmd.floodFill(this.dimension.xAxis - 3, this.h - 3, this.color.left);

        //highlight
        for (n = this.dimension.yAxis / 2; n < this.h - 1; n += 1) {
            bmd.setPixel(this.dimension.xAxis - 2, n, colorBorderHighlight);
        }

        bmd.context.putImageData(bmd.imageData, 0, 0);
        ctx.drawImage(bmd.canvas, 0, 0);
    };

    // public methods
    p.toString = function () {
        return "[SlopeWest]";
    };

    obelisk.SlopeWest = SlopeWest;
}(obelisk));

/*global obelisk:true, document:true*/

/*
 * CanvasManager
 */

(function (obelisk, document) {
    "use strict";

    var CanvasManager, p;
    CanvasManager = function () {
        throw new Error('ColorGeom is a static Class, cannot be instanced.');
    };
    p = CanvasManager;

    // public properties
    p.defaultCanvas = null;

    // public methods
    p.getDefaultCanvas = function () {
        p.defaultCanvas = p.defaultCanvas || document.createElement('canvas');
        return p.defaultCanvas;
    };

    p.getNewCanvas = function () {
        return document.createElement('canvas');
    };

    p.toString = function () {
        return "[CanvasManager]";
    };

    obelisk.CanvasManager = CanvasManager;
}(obelisk, document));

/*global obelisk:true*/

/*
 * CanvasTool
 */

(function (obelisk) {
    "use strict";

    var CanvasTool, p;

    CanvasTool = function () {
        throw new Error('CanvasTool is a static Class, cannot be instanced.');
    };
    p = CanvasTool;

    // public methods
    p.getPixel = function (imageData, x, y) {
        var data, index, r, g, b;
        data = imageData.data;
        index = (y * imageData.width + x) * 4;
        r = data[index];
        g = data[index + 1];
        b = data[index + 2];

        return ((r << 16) | (g << 8) | b);
    };

    p.toString = function () {
        return "[CanvasTool]";
    };

    obelisk.CanvasTool = CanvasTool;
}(obelisk));

/*global obelisk:true*/

/*
 * ColorGeom
 */

(function (obelisk) {
    "use strict";

    var ColorGeom, p;

    ColorGeom = function () {
        throw new Error('ColorGeom is a static Class, cannot be instanced.');
    };
    p = ColorGeom;

    // public methods
    p.get32 = function (color) {
        return color < 0xFF000000 ? (color + 0xFF000000) : color;
    };

    p.applyBrightness = function (color, brightness, highlight) {
        var a, r, g, b, y, v, u;
        a = ((color >>> 24) & 0x000000FF);
        r = ((color >>> 16) & 0x000000FF);
        g = ((color >>> 8) & 0x000000FF);
        b = (color & 0x000000FF);

        y = ((r * 313524) >> 20) + ((g * 615514) >> 20) + ((b * 119538) >> 20);
        u = -((155189 * r) >> 20) - ((303038 * g) >> 20) + ((458227 * b) >> 20);
        v = ((644874 * r) >> 20) - ((540016 * g) >> 20) - ((104857 * b) >> 20);

        if (!highlight) {
            y += brightness;
        } else {
            y = 60 + Math.pow(y, 1.2);
        }

        r = y + ((1195376 * v) >> 20);
        g = y - ((408944 * u) >> 20) - ((608174 * v) >> 20);
        b = y + ((2128609 * u) >> 20);

        r = Math.max(0, Math.min(r, 255));
        g = Math.max(0, Math.min(g, 255));
        b = Math.max(0, Math.min(b, 255));

        return (a << 24) | (r << 16) | (g << 8) | b;
    };

    p.toString = function () {
        return "[ColorGeom]";
    };

    obelisk.ColorGeom = ColorGeom;
}(obelisk));

/*global obelisk:true*/

/*
 * ColorPattern
 */

(function (obelisk) {
    "use strict";

    var ColorPattren, p;

    ColorPattren = function () {
        throw new Error('ColorGeom is a static Class, cannot be instanced.');
    };
    p = ColorPattren;

    // public properties
    p.GRASS_GREEN = 0xCCFF00;
    p.YELLOW = 0xFFFF00;
    p.WINE_RED = 0xFF0099;
    p.PINK = 0xFF7CBF;
    p.PURPLE = 0xCC00FF;
    p.BLUE = 0x00CCFF;
    p.GRAY = 0xEEEEEE;
    p.BLACK = 0x666666;
    p.FINE_COLORS =
        [
            p.GRASS_GREEN,
            p.YELLOW,
            p.WINE_RED,
            p.PINK,
            p.PURPLE,
            p.BLUE,
            p.GRAY,
            p.BLACK
        ];

    // public methods
    p.getRandomComfortableColor = function () {
        return p.FINE_COLORS[Math.floor(Math.random() * p.FINE_COLORS.length)];
    };

    p.toString = function () {
        return "[ColorPattern]";
    };

    obelisk.ColorPattern = ColorPattren;
}(obelisk));

; browserify_shim__define__module__export__(typeof obelisk != "undefined" ? obelisk : window.obelisk);

}).call(global, undefined, undefined, undefined, undefined, function defineExport(ex) { module.exports = ex; });

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _obeliskJs = require('obelisk.js');

var _obeliskJs2 = _interopRequireDefault(_obeliskJs);

/**
 * @constant DEFAULT_SIZE
 * @type {Number}
 */
var DEFAULT_SIZE = 10;

/**
 * @module Giraffe
 * @author Adam Timberlake
 * @link https://github.com/Wildhoney/Giraffe
 * @link http://giraffe-app.herokuapp.com/
 * @licence MIT
 */

var Giraffe = (function () {
    _createClass(Giraffe, null, [{
        key: 'ELEMENT',

        /**
         * @constant ELEMENT
         * @type {String}
         */
        value: 'canvas.giraffe',

        /**
         * @constructor
         * @return {Giraffe}
         */
        enumerable: true
    }]);

    function Giraffe() {
        _classCallCheck(this, Giraffe);

        this.renderModel();
    }

    /**
     * @method getModel
     * @return {obelisk.Cube[]}
     */

    _createClass(Giraffe, [{
        key: 'getModel',
        value: function getModel() {

            var lightColour = new _obeliskJs2['default'].CubeColor().getByHorizontalColor(0xEDCE93);
            var darkColour = new _obeliskJs2['default'].CubeColor().getByHorizontalColor(0x704A3A);
            var x = 10;
            var y = 10;
            var z = 10;

            /**
             * @method sizeBy
             * @param {Number} x
             * @param {Number} [y=x]
             * @param {Number} [z=x]
             * @return {{x: number, y: number, z: number}}
             */
            var sizeBy = function sizeBy(x) {
                var y = arguments.length <= 1 || arguments[1] === undefined ? x : arguments[1];
                var z = arguments.length <= 2 || arguments[2] === undefined ? x : arguments[2];
                return (function () {
                    return { x: x, y: y, z: z };
                })();
            };

            return {

                neck: [{ colour: lightColour, size: sizeBy(DEFAULT_SIZE), position: sizeBy(x * 3, y * 3, z) }, { colour: darkColour, size: sizeBy(DEFAULT_SIZE), position: sizeBy(x * 2, y * 2, z) }, { colour: lightColour, size: sizeBy(DEFAULT_SIZE), position: sizeBy(x, y, z) }],

                head: [{ colour: lightColour,
                    size: sizeBy(DEFAULT_SIZE * 2),
                    position: sizeBy(x, y, z * 3) }]

            };
        }

        /**
         * @method renderModel
         * @return {void}
         */
    }, {
        key: 'renderModel',
        value: function renderModel() {

            var canvas = this.getElement();
            var point = new _obeliskJs2['default'].Point(200, 200);
            var pixelView = new _obeliskJs2['default'].PixelView(canvas, point);
            var model = this.getModel();

            Object.keys(model).forEach(function (key) {
                //model[key].forEach(component => pixelView.renderObject(component[0], component[1]));

                model[key].forEach(function (_ref) {
                    var colour = _ref.colour;
                    var size = _ref.size;
                    var position = _ref.position;

                    var shapeModel = new _obeliskJs2['default'].CubeDimension(size.x, size.y, size.z);
                    var positionModel = new _obeliskJs2['default'].Point3D(position.x, position.y, position.z);

                    pixelView.renderObject(new _obeliskJs2['default'].Cube(shapeModel, colour, true), positionModel);
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
    }, {
        key: 'getElement',
        value: function getElement() {

            var canvas = document.querySelector(Giraffe.ELEMENT);
            window.addEventListener('resize', resizeCanvas, false);

            function resizeCanvas() {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }

            resizeCanvas();
            return canvas;
        }
    }]);

    return Giraffe;
})();

exports['default'] = Giraffe;

document.addEventListener('DOMContentLoaded', function () {
    return new Giraffe();
});
module.exports = exports['default'];

},{"obelisk.js":1}]},{},[2])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvb2JlbGlzay5qcy9idWlsZC9vYmVsaXNrLmpzIiwiL1VzZXJzL2F0aW1iZXJsYWtlL1dlYnJvb3QvR2lyYWZmZS9zcmMvR2lyYWZmZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozt5QkNyMEVvQixZQUFZOzs7Ozs7OztBQU1oQyxJQUFNLFlBQVksR0FBRyxFQUFFLENBQUM7Ozs7Ozs7Ozs7SUFTSCxPQUFPO2lCQUFQLE9BQU87Ozs7Ozs7ZUFNUCxnQkFBZ0I7Ozs7Ozs7OztBQU10QixhQVpNLE9BQU8sR0FZVjs4QkFaRyxPQUFPOztBQWFwQixZQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7S0FDdEI7Ozs7Ozs7aUJBZGdCLE9BQU87O2VBb0JoQixvQkFBRzs7QUFFUCxnQkFBTSxXQUFXLEdBQUcsSUFBSSx1QkFBUSxTQUFTLEVBQUUsQ0FBQyxvQkFBb0IsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMzRSxnQkFBTSxVQUFVLEdBQUksSUFBSSx1QkFBUSxTQUFTLEVBQUUsQ0FBQyxvQkFBb0IsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMzRSxnQkFBTSxDQUFDLEdBQWEsRUFBRSxDQUFDO0FBQ3ZCLGdCQUFNLENBQUMsR0FBYSxFQUFFLENBQUM7QUFDdkIsZ0JBQU0sQ0FBQyxHQUFhLEVBQUUsQ0FBQzs7Ozs7Ozs7O0FBU3ZCLGdCQUFNLE1BQU0sR0FBRyxTQUFULE1BQU0sQ0FBSSxDQUFDO29CQUFFLENBQUMseURBQUcsQ0FBQztvQkFBRSxDQUFDLHlEQUFHLENBQUM7b0NBQUs7QUFDaEMsMkJBQU8sRUFBRSxDQUFDLEVBQUQsQ0FBQyxFQUFFLENBQUMsRUFBRCxDQUFDLEVBQUUsQ0FBQyxFQUFELENBQUMsRUFBRSxDQUFDO2lCQUN0QjthQUFBLENBQUM7O0FBRUYsbUJBQU87O0FBRUgsb0JBQUksRUFBRSxDQUNGLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRSxJQUFJLEVBQUUsTUFBTSxDQUFDLFlBQVksQ0FBQyxFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQ3RGLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRyxJQUFJLEVBQUUsTUFBTSxDQUFDLFlBQVksQ0FBQyxFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQ3RGLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRSxJQUFJLEVBQUUsTUFBTSxDQUFDLFlBQVksQ0FBQyxFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUNqRjs7QUFFRCxvQkFBSSxFQUFFLENBQ0YsRUFBRSxNQUFNLEVBQUUsV0FBVztBQUNuQix3QkFBSSxFQUFFLE1BQU0sQ0FBQyxZQUFZLEdBQUcsQ0FBQyxDQUFDO0FBQzlCLDRCQUFRLEVBQUUsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQ3BDOzthQUVKLENBQUE7U0FFSjs7Ozs7Ozs7ZUFNVSx1QkFBRzs7QUFFVixnQkFBTSxNQUFNLEdBQU0sSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO0FBQ3BDLGdCQUFNLEtBQUssR0FBTyxJQUFJLHVCQUFRLEtBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDOUMsZ0JBQU0sU0FBUyxHQUFHLElBQUksdUJBQVEsU0FBUyxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQztBQUN2RCxnQkFBTSxLQUFLLEdBQU8sSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDOztBQUVsQyxrQkFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQSxHQUFHLEVBQUk7OztBQUc5QixxQkFBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLElBQTBCLEVBQUs7d0JBQTdCLE1BQU0sR0FBUixJQUEwQixDQUF4QixNQUFNO3dCQUFFLElBQUksR0FBZCxJQUEwQixDQUFoQixJQUFJO3dCQUFFLFFBQVEsR0FBeEIsSUFBMEIsQ0FBVixRQUFROztBQUV4Qyx3QkFBTSxVQUFVLEdBQU0sSUFBSSx1QkFBUSxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN4RSx3QkFBTSxhQUFhLEdBQUcsSUFBSSx1QkFBUSxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7QUFFOUUsNkJBQVMsQ0FBQyxZQUFZLENBQUMsSUFBSSx1QkFBUSxJQUFJLENBQUMsVUFBVSxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsRUFBRSxhQUFhLENBQUMsQ0FBQztpQkFFckYsQ0FBQyxDQUFDOzs7Ozs7Ozs7O2FBV04sQ0FBQyxDQUFDO1NBRU47Ozs7Ozs7O2VBTVMsc0JBQUc7O0FBRVQsZ0JBQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ3ZELGtCQUFNLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLFlBQVksRUFBRSxLQUFLLENBQUMsQ0FBQzs7QUFFdkQscUJBQVMsWUFBWSxHQUFHO0FBQ3BCLHNCQUFNLENBQUMsS0FBSyxHQUFJLE1BQU0sQ0FBQyxVQUFVLENBQUM7QUFDbEMsc0JBQU0sQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQzthQUN0Qzs7QUFFRCx3QkFBWSxFQUFFLENBQUM7QUFDZixtQkFBTyxNQUFNLENBQUM7U0FFakI7OztXQTlHZ0IsT0FBTzs7O3FCQUFQLE9BQU87O0FBa0g1QixRQUFRLENBQUMsZ0JBQWdCLENBQUMsa0JBQWtCLEVBQUU7V0FBTSxJQUFJLE9BQU8sRUFBRTtDQUFBLENBQUMsQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCI7IHZhciBfX2Jyb3dzZXJpZnlfc2hpbV9yZXF1aXJlX189cmVxdWlyZTsoZnVuY3Rpb24gYnJvd3NlcmlmeVNoaW0obW9kdWxlLCBleHBvcnRzLCByZXF1aXJlLCBkZWZpbmUsIGJyb3dzZXJpZnlfc2hpbV9fZGVmaW5lX19tb2R1bGVfX2V4cG9ydF9fKSB7XG4vKmdsb2JhbCB3aW5kb3c6dHJ1ZSovXG5cbi8qXG4gKiBvYmVsaXNrXG4gKi9cblxuKGZ1bmN0aW9uICh3aW5kb3cpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIC8qKlxuICAgICAqIFN0YXRpYyBjbGFzcyBob2xkaW5nIGxpYnJhcnkgc3BlY2lmaWMgaW5mb3JtYXRpb25cbiAgICAgKiB0aGUgbGlicmFyeS5cbiAgICAgKiBAY2xhc3Mgb2JlbGlza1xuICAgICAqKi9cbiAgICB2YXIgb2JlbGlzayA9IHt9O1xuXG4gICAgLyoqXG4gICAgICogQHByb3BlcnR5IHZlcnNpb25cbiAgICAgKiBAdHlwZSBTdHJpbmdcbiAgICAgKiBAc3RhdGljXG4gICAgICoqL1xuICAgIG9iZWxpc2sudmVyc2lvbiA9ICcxLjEuMCc7XG5cbiAgICAvKipcbiAgICAgKiBAcHJvcGVydHkgYXV0aG9yXG4gICAgICogQHR5cGUgU3RyaW5nXG4gICAgICogQHN0YXRpY1xuICAgICAqKi9cbiAgICBvYmVsaXNrLmF1dGhvciA9ICdtYXggaHVhbmcnO1xuXG4gICAgd2luZG93Lm9iZWxpc2sgPSBvYmVsaXNrO1xufSh3aW5kb3cpKTtcblxuLypnbG9iYWwgb2JlbGlzazp0cnVlKi9cblxuLypcbiAqIEFic3RyYWN0Q29sb3JcbiAqL1xuXG4oZnVuY3Rpb24gKG9iZWxpc2spIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHZhciBBYnN0cmFjdENvbG9yLCBwO1xuXG4gICAgQWJzdHJhY3RDb2xvciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5pbml0aWFsaXplKCk7XG4gICAgfTtcbiAgICBwID0gQWJzdHJhY3RDb2xvci5wcm90b3R5cGU7XG5cbiAgICAvLyBwdWJsaWMgcHJvcGVydGllc1xuICAgIC8qKlxuICAgICAqIFRoZSBpbm5lciBjb2xvcnMgZm9yIGVsZW1lbnRzIG9mIGNlcnRhaW4gcHJpbWl0aXZlXG4gICAgICovXG4gICAgcC5pbm5lciA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgYm9yZGVyIGNvbG9ycyBmb3IgZWxlbWVudHMgb2YgY2VydGFpbiBwcmltaXRpdmVcbiAgICAgKi9cbiAgICBwLmJvcmRlciA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgYm9yZGVySGlnaGxpZ2h0IGNvbG9ycyBmb3IgZWxlbWVudHMgb2YgY2VydGFpbiBwcmltaXRpdmVcbiAgICAgKi9cbiAgICBwLmJvcmRlckhpZ2hsaWdodCA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgbGVmdCBzaWRlIGNvbG9ycyBmb3IgZWxlbWVudHMgb2YgY2VydGFpbiBwcmltaXRpdmVcbiAgICAgKi9cbiAgICBwLmxlZnQgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogVGhlIHJpZ2h0IHNpZGUgY29sb3JzIGZvciBlbGVtZW50cyBvZiBjZXJ0YWluIHByaW1pdGl2ZVxuICAgICAqL1xuICAgIHAucmlnaHQgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGhvcml6b250YWwgY29sb3JzIGZvciBlbGVtZW50cyBvZiBjZXJ0YWluIHByaW1pdGl2ZVxuICAgICAqL1xuICAgIHAuaG9yaXpvbnRhbCA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgbGVmdCBzbG90IHNpZGUgY29sb3JzIGZvciBlbGVtZW50cyBvZiBjZXJ0YWluIHByaW1pdGl2ZVxuICAgICAqL1xuICAgIHAubGVmdFNsb3BlID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIFRoZSByaWdodCBzbG90IHNpZGUgY29sb3JzIGZvciBlbGVtZW50cyBvZiBjZXJ0YWluIHByaW1pdGl2ZVxuICAgICAqL1xuICAgIHAucmlnaHRTbG9wZSA9IG51bGw7XG5cbiAgICAvLyBjb25zdHJ1Y3RvclxuICAgIHAuaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIC8vIHB1YmxpYyBtZXRob2RzXG4gICAgcC50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIFwiW0Fic3RyYWN0Q29sb3JdXCI7XG4gICAgfTtcblxuICAgIC8vIHByaXZhdGUgbWV0aG9kc1xuXG4gICAgb2JlbGlzay5BYnN0cmFjdENvbG9yID0gQWJzdHJhY3RDb2xvcjtcbn0ob2JlbGlzaykpO1xuXG4vKmdsb2JhbCBvYmVsaXNrOnRydWUqL1xuXG4vKlxuICogQ3ViZUNvbG9yXG4gKi9cblxuKGZ1bmN0aW9uIChvYmVsaXNrKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICB2YXIgQ3ViZUNvbG9yLCBwO1xuICAgIEN1YmVDb2xvciA9IGZ1bmN0aW9uIChib3JkZXIsIGJvcmRlckhpZ2hsaWdodCwgbGVmdCwgcmlnaHQsIGhvcml6b250YWwpIHtcbiAgICAgICAgdGhpcy5pbml0aWFsaXplKGJvcmRlciwgYm9yZGVySGlnaGxpZ2h0LCBsZWZ0LCByaWdodCwgaG9yaXpvbnRhbCk7XG4gICAgfTtcbiAgICBwID0gQ3ViZUNvbG9yLnByb3RvdHlwZSA9IG5ldyBvYmVsaXNrLkFic3RyYWN0Q29sb3IoKTtcblxuICAgIC8vIHB1YmxpYyBwcm9wZXJ0aWVzXG4gICAgcC5CUklHSFRORVNTX0dBSU4gPSAtMjA7XG5cbiAgICAvLyBjb25zdHJ1Y3RvclxuICAgIHAuaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uIChib3JkZXIsIGJvcmRlckhpZ2hsaWdodCwgbGVmdCwgcmlnaHQsIGhvcml6b250YWwpIHtcbiAgICAgICAgdGhpcy5ib3JkZXIgPSBvYmVsaXNrLkNvbG9yR2VvbS5nZXQzMihib3JkZXIgPT09IHVuZGVmaW5lZCA/IDB4ODc4Nzg3IDogYm9yZGVyKTtcbiAgICAgICAgdGhpcy5ib3JkZXJIaWdobGlnaHQgPSBvYmVsaXNrLkNvbG9yR2VvbS5nZXQzMihib3JkZXJIaWdobGlnaHQgPT09IHVuZGVmaW5lZCA/IDB4RkZGRkZGIDogYm9yZGVySGlnaGxpZ2h0KTtcbiAgICAgICAgdGhpcy5sZWZ0ID0gb2JlbGlzay5Db2xvckdlb20uZ2V0MzIobGVmdCA9PT0gdW5kZWZpbmVkID8gMHhDOUNGRDAgOiBsZWZ0KTtcbiAgICAgICAgdGhpcy5yaWdodCA9IG9iZWxpc2suQ29sb3JHZW9tLmdldDMyKHJpZ2h0ID09PSB1bmRlZmluZWQgPyAweEUzRTNFMyA6IHJpZ2h0KTtcbiAgICAgICAgdGhpcy5ob3Jpem9udGFsID0gb2JlbGlzay5Db2xvckdlb20uZ2V0MzIoaG9yaXpvbnRhbCA9PT0gdW5kZWZpbmVkID8gMHhFRUVGRjAgOiBob3Jpem9udGFsKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIC8vIHB1YmxpYyBtZXRob2RzXG4gICAgcC5nZXRCeUhvcml6b250YWxDb2xvciA9IGZ1bmN0aW9uIChob3Jpem9udGFsKSB7XG4gICAgICAgIHJldHVybiBuZXcgQ3ViZUNvbG9yKFxuICAgICAgICAgICAgb2JlbGlzay5Db2xvckdlb20uYXBwbHlCcmlnaHRuZXNzKGhvcml6b250YWwsIHRoaXMuQlJJR0hUTkVTU19HQUlOICogNCksXG4gICAgICAgICAgICAvL2FwcGx5IGhpZ2h0bGlnaHRcbiAgICAgICAgICAgIG9iZWxpc2suQ29sb3JHZW9tLmFwcGx5QnJpZ2h0bmVzcyhob3Jpem9udGFsLCAwLCB0cnVlKSxcbiAgICAgICAgICAgIG9iZWxpc2suQ29sb3JHZW9tLmFwcGx5QnJpZ2h0bmVzcyhob3Jpem9udGFsLCB0aGlzLkJSSUdIVE5FU1NfR0FJTiAqIDIpLFxuICAgICAgICAgICAgb2JlbGlzay5Db2xvckdlb20uYXBwbHlCcmlnaHRuZXNzKGhvcml6b250YWwsIHRoaXMuQlJJR0hUTkVTU19HQUlOKSxcbiAgICAgICAgICAgIGhvcml6b250YWxcbiAgICAgICAgKTtcbiAgICB9O1xuXG4gICAgcC50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIFwiW0N1YmVDb2xvcl1cIjtcbiAgICB9O1xuXG4gICAgLy8gcHJpdmF0ZSBtZXRob2RzXG5cbiAgICBvYmVsaXNrLkN1YmVDb2xvciA9IEN1YmVDb2xvcjtcbn0ob2JlbGlzaykpO1xuXG4vKmdsb2JhbCBvYmVsaXNrOnRydWUqL1xuXG4vKlxuICogUHlyYW1pZENvbG9yXG4gKi9cblxuKGZ1bmN0aW9uIChvYmVsaXNrKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICB2YXIgUHlyYW1pZENvbG9yLCBwO1xuICAgIFB5cmFtaWRDb2xvciA9IGZ1bmN0aW9uIChib3JkZXIsIGJvcmRlckhpZ2hsaWdodCwgbGVmdCwgcmlnaHQpIHtcbiAgICAgICAgdGhpcy5pbml0aWFsaXplKGJvcmRlciwgYm9yZGVySGlnaGxpZ2h0LCBsZWZ0LCByaWdodCk7XG4gICAgfTtcbiAgICBwID0gUHlyYW1pZENvbG9yLnByb3RvdHlwZSA9IG5ldyBvYmVsaXNrLkFic3RyYWN0Q29sb3IoKTtcblxuICAgIC8vIHB1YmxpYyBwcm9wZXJ0aWVzXG4gICAgcC5CUklHSFRORVNTX0dBSU4gPSAtMjA7XG5cbiAgICAvLyBjb25zdHJ1Y3RvclxuICAgIHAuaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uIChib3JkZXIsIGJvcmRlckhpZ2hsaWdodCwgbGVmdCwgcmlnaHQpIHtcbiAgICAgICAgdGhpcy5ib3JkZXIgPSBvYmVsaXNrLkNvbG9yR2VvbS5nZXQzMihib3JkZXIgPT09IHVuZGVmaW5lZCA/IDB4OTQ5Njk4IDogYm9yZGVyKTtcbiAgICAgICAgdGhpcy5ib3JkZXJIaWdobGlnaHQgPSBvYmVsaXNrLkNvbG9yR2VvbS5nZXQzMihib3JkZXJIaWdobGlnaHQgPT09IHVuZGVmaW5lZCA/IDB4RkZGRkZGIDogYm9yZGVySGlnaGxpZ2h0KTtcbiAgICAgICAgdGhpcy5sZWZ0ID0gb2JlbGlzay5Db2xvckdlb20uZ2V0MzIobGVmdCA9PT0gdW5kZWZpbmVkID8gMHhFNkU4RTkgOiBsZWZ0KTtcbiAgICAgICAgdGhpcy5yaWdodCA9IG9iZWxpc2suQ29sb3JHZW9tLmdldDMyKHJpZ2h0ID09PSB1bmRlZmluZWQgPyAweEVFRUZGMCA6IHJpZ2h0KTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIC8vIHB1YmxpYyBtZXRob2RzXG4gICAgcC5nZXRCeVJpZ2h0Q29sb3IgPSBmdW5jdGlvbiAocmlnaHQpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQeXJhbWlkQ29sb3IoXG4gICAgICAgICAgICBvYmVsaXNrLkNvbG9yR2VvbS5hcHBseUJyaWdodG5lc3MocmlnaHQsIHRoaXMuQlJJR0hUTkVTU19HQUlOICogNCksXG4gICAgICAgICAgICAvL2FwcGx5IGhpZ2h0bGlnaHRcbiAgICAgICAgICAgIG9iZWxpc2suQ29sb3JHZW9tLmFwcGx5QnJpZ2h0bmVzcyhyaWdodCwgMCwgdHJ1ZSksXG4gICAgICAgICAgICBvYmVsaXNrLkNvbG9yR2VvbS5hcHBseUJyaWdodG5lc3MocmlnaHQsIHRoaXMuQlJJR0hUTkVTU19HQUlOKSxcbiAgICAgICAgICAgIHJpZ2h0XG4gICAgICAgICk7XG4gICAgfTtcblxuICAgIHAudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBcIltQeXJhbWlkQ29sb3JdXCI7XG4gICAgfTtcblxuICAgIC8vIHByaXZhdGUgbWV0aG9kc1xuXG4gICAgb2JlbGlzay5QeXJhbWlkQ29sb3IgPSBQeXJhbWlkQ29sb3I7XG59KG9iZWxpc2spKTtcblxuLypnbG9iYWwgb2JlbGlzazp0cnVlKi9cblxuLypcbiAqIFNpZGVDb2xvclxuICovXG5cbihmdW5jdGlvbiAob2JlbGlzaykge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgdmFyIFNpZGVDb2xvciwgcDtcbiAgICBTaWRlQ29sb3IgPSBmdW5jdGlvbiAoYm9yZGVyLCBpbm5lcikge1xuICAgICAgICB0aGlzLmluaXRpYWxpemUoYm9yZGVyLCBpbm5lcik7XG4gICAgfTtcbiAgICBwID0gU2lkZUNvbG9yLnByb3RvdHlwZSA9IG5ldyBvYmVsaXNrLkFic3RyYWN0Q29sb3IoKTtcblxuICAgIC8vIHB1YmxpYyBwcm9wZXJ0aWVzXG4gICAgcC5CUklHSFRORVNTX0dBSU4gPSAtMjA7XG5cbiAgICAvLyBjb25zdHJ1Y3RvclxuICAgIHAuaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uIChib3JkZXIsIGlubmVyKSB7XG4gICAgICAgIHRoaXMuYm9yZGVyID0gb2JlbGlzay5Db2xvckdlb20uZ2V0MzIoYm9yZGVyID09PSB1bmRlZmluZWQgPyAweDg3ODc4NyA6IGJvcmRlcik7XG4gICAgICAgIHRoaXMuaW5uZXIgPSBvYmVsaXNrLkNvbG9yR2VvbS5nZXQzMihpbm5lciA9PT0gdW5kZWZpbmVkID8gMHhFRUVFRUUgOiBpbm5lcik7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICAvLyBwdWJsaWMgbWV0aG9kc1xuICAgIHAuZ2V0QnlJbm5lckNvbG9yID0gZnVuY3Rpb24gKGlubmVyKSB7XG4gICAgICAgIHJldHVybiBuZXcgb2JlbGlzay5TaWRlQ29sb3IoXG4gICAgICAgICAgICBvYmVsaXNrLkNvbG9yR2VvbS5hcHBseUJyaWdodG5lc3MoaW5uZXIsIHRoaXMuQlJJR0hUTkVTU19HQUlOICogNCksXG4gICAgICAgICAgICBpbm5lclxuICAgICAgICApO1xuICAgIH07XG5cbiAgICBwLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gXCJbU2lkZUNvbG9yXVwiO1xuICAgIH07XG5cbiAgICAvLyBwcml2YXRlIG1ldGhvZHNcblxuICAgIG9iZWxpc2suU2lkZUNvbG9yID0gU2lkZUNvbG9yO1xufShvYmVsaXNrKSk7XG5cbi8qZ2xvYmFsIG9iZWxpc2s6dHJ1ZSovXG5cbi8qXG4gKiBTbG9wZUNvbG9yXG4gKi9cblxuKGZ1bmN0aW9uIChvYmVsaXNrKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICB2YXIgU2xvcGVDb2xvciwgcDtcbiAgICBTbG9wZUNvbG9yID0gZnVuY3Rpb24gKGJvcmRlciwgYm9yZGVySGlnaGxpZ2h0LCBsZWZ0LCByaWdodCwgbGVmdFNsb3BlLCByaWdodFNsb3BlKSB7XG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZShib3JkZXIsIGJvcmRlckhpZ2hsaWdodCwgbGVmdCwgcmlnaHQsIGxlZnRTbG9wZSwgcmlnaHRTbG9wZSk7XG4gICAgfTtcbiAgICBwID0gU2xvcGVDb2xvci5wcm90b3R5cGUgPSBuZXcgb2JlbGlzay5BYnN0cmFjdENvbG9yKCk7XG5cbiAgICAvLyBwdWJsaWMgcHJvcGVydGllc1xuICAgIHAuQlJJR0hUTkVTU19HQUlOID0gLTIwO1xuXG4gICAgLy8gY29uc3RydWN0b3JcbiAgICBwLmluaXRpYWxpemUgPSBmdW5jdGlvbiAoYm9yZGVyLCBib3JkZXJIaWdobGlnaHQsIGxlZnQsIHJpZ2h0LCBsZWZ0U2xvcGUsIHJpZ2h0U2xvcGUpIHtcbiAgICAgICAgdGhpcy5ib3JkZXIgPSBvYmVsaXNrLkNvbG9yR2VvbS5nZXQzMihib3JkZXIgPT09IHVuZGVmaW5lZCA/IDB4OTQ5Njk4IDogYm9yZGVyKTtcbiAgICAgICAgdGhpcy5ib3JkZXJIaWdobGlnaHQgPSBvYmVsaXNrLkNvbG9yR2VvbS5nZXQzMihib3JkZXJIaWdobGlnaHQgPT09IHVuZGVmaW5lZCA/IDB4RkZGRkZGIDogYm9yZGVySGlnaGxpZ2h0KTtcbiAgICAgICAgdGhpcy5sZWZ0ID0gb2JlbGlzay5Db2xvckdlb20uZ2V0MzIobGVmdCA9PT0gdW5kZWZpbmVkID8gMHhDOUNGRDAgOiBsZWZ0KTtcbiAgICAgICAgdGhpcy5yaWdodCA9IG9iZWxpc2suQ29sb3JHZW9tLmdldDMyKHJpZ2h0ID09PSB1bmRlZmluZWQgPyAweEU2RThFOSA6IHJpZ2h0KTtcbiAgICAgICAgdGhpcy5sZWZ0U2xvcGUgPSBvYmVsaXNrLkNvbG9yR2VvbS5nZXQzMihsZWZ0U2xvcGUgPT09IHVuZGVmaW5lZCA/IDB4REJEQkRCIDogbGVmdFNsb3BlKTtcbiAgICAgICAgdGhpcy5yaWdodFNsb3BlID0gb2JlbGlzay5Db2xvckdlb20uZ2V0MzIocmlnaHRTbG9wZSA9PT0gdW5kZWZpbmVkID8gMHhEQkRCREIgOiByaWdodFNsb3BlKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIC8vIHB1YmxpYyBtZXRob2RzXG5cbiAgICAvKlxuICAgICAqIGhvcml6b250YWwgc2lkZSBkb2Vzbid0IGFjdHVhbGx5IGV4aXN0IGluIHRoZSBTbG9wZSBwcmltaXRpdmVcbiAgICAgKiB5b3UgY2FuIGFzc2lnbiB0aGUgc2FtZSBob3Jpem9udGFsIGNvbG9yIGFzIGN1YmVcbiAgICAgKiBzbyB0aGF0IHlvdSB3aWxsIGJlIGFibGUgdG8gYXJyYW5nZSB0aGUgc2xvcGUgd2l0aCBjdWJlXG4gICAgICovXG4gICAgcC5nZXRCeUhvcml6b250YWxDb2xvciA9IGZ1bmN0aW9uIChob3Jpem9udGFsKSB7XG4gICAgICAgIHJldHVybiBuZXcgb2JlbGlzay5TbG9wZUNvbG9yKFxuICAgICAgICAgICAgb2JlbGlzay5Db2xvckdlb20uYXBwbHlCcmlnaHRuZXNzKGhvcml6b250YWwsIHRoaXMuQlJJR0hUTkVTU19HQUlOICogNCksXG4gICAgICAgICAgICAvL2FwcGx5IGhpZ2h0bGlnaHRcbiAgICAgICAgICAgIG9iZWxpc2suQ29sb3JHZW9tLmFwcGx5QnJpZ2h0bmVzcyhob3Jpem9udGFsLCAwLCB0cnVlKSxcbiAgICAgICAgICAgIG9iZWxpc2suQ29sb3JHZW9tLmFwcGx5QnJpZ2h0bmVzcyhob3Jpem9udGFsLCB0aGlzLkJSSUdIVE5FU1NfR0FJTiAqIDIpLFxuICAgICAgICAgICAgb2JlbGlzay5Db2xvckdlb20uYXBwbHlCcmlnaHRuZXNzKGhvcml6b250YWwsIHRoaXMuQlJJR0hUTkVTU19HQUlOKSxcbiAgICAgICAgICAgIG9iZWxpc2suQ29sb3JHZW9tLmFwcGx5QnJpZ2h0bmVzcyhob3Jpem9udGFsLCB0aGlzLkJSSUdIVE5FU1NfR0FJTiAqIDEuNSksXG4gICAgICAgICAgICBvYmVsaXNrLkNvbG9yR2VvbS5hcHBseUJyaWdodG5lc3MoaG9yaXpvbnRhbCwgdGhpcy5CUklHSFRORVNTX0dBSU4gKiAwLjUpXG4gICAgICAgICk7XG4gICAgfTtcblxuICAgIHAudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBcIltTbG9wZUNvbG9yXVwiO1xuICAgIH07XG5cbiAgICAvLyBwcml2YXRlIG1ldGhvZHNcblxuICAgIG9iZWxpc2suU2xvcGVDb2xvciA9IFNsb3BlQ29sb3I7XG59KG9iZWxpc2spKTtcblxuLypnbG9iYWwgb2JlbGlzazp0cnVlKi9cblxuLypcbiAqIEFic3RyYWN0RGltZW5zaW9uXG4gKi9cblxuKGZ1bmN0aW9uIChvYmVsaXNrKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICB2YXIgQWJzdHJhY3REaW1lbnNpb24sIHA7XG4gICAgQWJzdHJhY3REaW1lbnNpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZSgpO1xuICAgIH07XG4gICAgcCA9IEFic3RyYWN0RGltZW5zaW9uLnByb3RvdHlwZTtcblxuICAgIC8vIHB1YmxpYyBwcm9wZXJ0aWVzXG4gICAgLyoqXG4gICAgICogVGhlIHggQXhpcyBkaW1lbnNpb25zIGluIDIyLjYgZGVncmVlcyBjb29yZGluYXRlXG4gICAgICovXG4gICAgcC54QXhpcyA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgeSBBeGlzIGRpbWVuc2lvbnMgaW4gMjIuNiBkZWdyZWVzIGNvb3JkaW5hdGVcbiAgICAgKi9cbiAgICBwLnlBeGlzID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIFRoZSB6IEF4aXMgZGltZW5zaW9ucyBpbiAyMi42IGRlZ3JlZXMgY29vcmRpbmF0ZVxuICAgICAqL1xuICAgIHAuekF4aXMgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogUHlyYW1pZCB0YWxsIG1vZGVcbiAgICAgKi9cbiAgICBwLnRhbGwgPSBmYWxzZTtcblxuICAgIC8vIGNvbnN0cnVjdG9yXG4gICAgcC5pbml0aWFsaXplID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgLy8gcHVibGljIG1ldGhvZHNcbiAgICBwLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gXCJbQWJzdHJhY3REaW1lbnNpb25dXCI7XG4gICAgfTtcblxuICAgIC8vIHByaXZhdGUgbWV0aG9kc1xuXG4gICAgb2JlbGlzay5BYnN0cmFjdERpbWVuc2lvbiA9IEFic3RyYWN0RGltZW5zaW9uO1xufShvYmVsaXNrKSk7XG5cbi8qZ2xvYmFsIG9iZWxpc2s6dHJ1ZSovXG5cbi8qXG4gKiBCcmlja0RpbWVuc2lvblxuICovXG5cbihmdW5jdGlvbiAob2JlbGlzaykge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgdmFyIEJyaWNrRGltZW5zaW9uLCBwO1xuICAgIEJyaWNrRGltZW5zaW9uID0gZnVuY3Rpb24gKHhBeGlzLCB5QXhpcykge1xuICAgICAgICB0aGlzLmluaXRpYWxpemUoeEF4aXMsIHlBeGlzKTtcbiAgICB9O1xuICAgIHAgPSBCcmlja0RpbWVuc2lvbi5wcm90b3R5cGUgPSBuZXcgb2JlbGlzay5BYnN0cmFjdERpbWVuc2lvbigpO1xuXG4gICAgLy8gY29uc3RydWN0b3JcbiAgICBwLmluaXRpYWxpemUgPSBmdW5jdGlvbiAoeEF4aXMsIHlBeGlzKSB7XG4gICAgICAgIHRoaXMueEF4aXMgPSB4QXhpcyB8fCAzMDtcbiAgICAgICAgdGhpcy55QXhpcyA9IHlBeGlzIHx8IDMwO1xuXG4gICAgICAgIGlmICh0aGlzLnhBeGlzICUgMiA9PT0gMSB8fCB0aGlzLnlBeGlzICUgMiA9PT0gMSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwieCx5QXhpcyBtdXN0IGJlIGV2ZW4gbnVtYmVyXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8geEF4aXMgfHwgeUF4aXMgPSA0IGZsb29kRmlsbCBjb3VsZCBub3QgYmUgYXBwbGllZFxuICAgICAgICBpZiAodGhpcy54QXhpcyA8PSA0IHx8IHRoaXMueUF4aXMgPD0gNCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiZGltZW5zaW9uIGlzIHRvbyBzbWFsbFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICBwLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gXCJbQnJpY2tEaW1lbnNpb25dXCI7XG4gICAgfTtcblxuICAgIG9iZWxpc2suQnJpY2tEaW1lbnNpb24gPSBCcmlja0RpbWVuc2lvbjtcbn0ob2JlbGlzaykpO1xuXG4vKmdsb2JhbCBvYmVsaXNrOnRydWUqL1xuXG4vKlxuICogQ3ViZURpbWVuc2lvblxuICovXG5cbihmdW5jdGlvbiAob2JlbGlzaykge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgdmFyIEN1YmVEaW1lbnNpb24sIHA7XG4gICAgQ3ViZURpbWVuc2lvbiA9IGZ1bmN0aW9uICh4QXhpcywgeUF4aXMsIHpBeGlzKSB7XG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZSh4QXhpcywgeUF4aXMsIHpBeGlzKTtcbiAgICB9O1xuICAgIHAgPSBDdWJlRGltZW5zaW9uLnByb3RvdHlwZSA9IG5ldyBvYmVsaXNrLkFic3RyYWN0RGltZW5zaW9uKCk7XG5cbiAgICAvLyBjb25zdHJ1Y3RvclxuICAgIHAuaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uICh4QXhpcywgeUF4aXMsIHpBeGlzKSB7XG4gICAgICAgIHRoaXMueEF4aXMgPSB4QXhpcyB8fCAzMDtcbiAgICAgICAgdGhpcy55QXhpcyA9IHlBeGlzIHx8IDMwO1xuICAgICAgICB0aGlzLnpBeGlzID0gekF4aXMgfHwgMzA7XG5cbiAgICAgICAgaWYgKHRoaXMueEF4aXMgJSAyID09PSAxIHx8IHRoaXMueUF4aXMgJSAyID09PSAxKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJ4LHlBeGlzIG11c3QgYmUgZXZlbiBudW1iZXJcIik7XG4gICAgICAgIH1cblxuICAgICAgICAvLyB4QXhpcyB8fCB5QXhpcyA9IDQgZmxvb2RGaWxsIGNvdWxkIG5vdCBiZSBhcHBsaWVkXG4gICAgICAgIGlmICh0aGlzLnhBeGlzIDw9IDQgfHwgdGhpcy55QXhpcyA8PSA0IHx8IHRoaXMuekF4aXMgPD0gMikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiZGltZW5zaW9uIGlzIHRvbyBzbWFsbFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICBwLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gXCJbQ3ViZURpbWVuc2lvbl1cIjtcbiAgICB9O1xuXG4gICAgb2JlbGlzay5DdWJlRGltZW5zaW9uID0gQ3ViZURpbWVuc2lvbjtcbn0ob2JlbGlzaykpO1xuXG4vKmdsb2JhbCBvYmVsaXNrOnRydWUqL1xuXG4vKlxuICogUHlyYW1pZERpbWVuc2lvblxuICovXG5cbihmdW5jdGlvbiAob2JlbGlzaykge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgdmFyIFB5cmFtaWREaW1lbnNpb24sIHA7XG4gICAgUHlyYW1pZERpbWVuc2lvbiA9IGZ1bmN0aW9uIChheGlzLCB0YWxsKSB7XG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZShheGlzLCB0YWxsKTtcbiAgICB9O1xuICAgIHAgPSBQeXJhbWlkRGltZW5zaW9uLnByb3RvdHlwZSA9IG5ldyBvYmVsaXNrLkFic3RyYWN0RGltZW5zaW9uKCk7XG5cbiAgICAvLyBjb25zdHJ1Y3RvclxuICAgIHAuaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uIChheGlzLCB0YWxsKSB7XG4gICAgICAgIHRoaXMueEF4aXMgPSBheGlzIHx8IDMwO1xuICAgICAgICB0aGlzLnlBeGlzID0gYXhpcyB8fCAzMDtcbiAgICAgICAgdGhpcy50YWxsID0gdGFsbCB8fCBmYWxzZTtcblxuICAgICAgICBpZiAodGhpcy54QXhpcyAlIDIgPT09IDEpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcImF4aXMgbXVzdCBiZSBldmVuIG51bWJlclwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLnhBeGlzIDw9IDQpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcImRpbWVuc2lvbiBpcyB0b28gc21hbGxcIik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgcC50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIFwiW1B5cmFtaWREaW1lbnNpb25dXCI7XG4gICAgfTtcblxuICAgIG9iZWxpc2suUHlyYW1pZERpbWVuc2lvbiA9IFB5cmFtaWREaW1lbnNpb247XG59KG9iZWxpc2spKTtcblxuLypnbG9iYWwgb2JlbGlzazp0cnVlKi9cblxuLypcbiAqIFNpZGVYRGltZW5zaW9uXG4gKi9cblxuKGZ1bmN0aW9uIChvYmVsaXNrKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICB2YXIgU2lkZVhEaW1lbnNpb24sIHA7XG4gICAgU2lkZVhEaW1lbnNpb24gPSBmdW5jdGlvbiAoeEF4aXMsIHpBeGlzKSB7XG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZSh4QXhpcywgekF4aXMpO1xuICAgIH07XG4gICAgcCA9IFNpZGVYRGltZW5zaW9uLnByb3RvdHlwZSA9IG5ldyBvYmVsaXNrLkFic3RyYWN0RGltZW5zaW9uKCk7XG5cbiAgICAvLyBjb25zdHJ1Y3RvclxuICAgIHAuaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uICh4QXhpcywgekF4aXMpIHtcbiAgICAgICAgdGhpcy54QXhpcyA9IHhBeGlzIHx8IDMwO1xuICAgICAgICB0aGlzLnpBeGlzID0gekF4aXMgfHwgMzA7XG5cbiAgICAgICAgaWYgKHRoaXMueEF4aXMgJSAyID09PSAxKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJ4QXhpcyBtdXN0IGJlIGV2ZW4gbnVtYmVyXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8geEF4aXMgfHwgekF4aXMgPSA0IGZsb29kRmlsbCBjb3VsZCBub3QgYmUgYXBwbGllZFxuICAgICAgICBpZiAodGhpcy54QXhpcyA8PSA0IHx8IHRoaXMuekF4aXMgPD0gMikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiZGltZW5zaW9uIGlzIHRvbyBzbWFsbFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICBwLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gXCJbU2lkZVhEaW1lbnNpb25dXCI7XG4gICAgfTtcblxuICAgIG9iZWxpc2suU2lkZVhEaW1lbnNpb24gPSBTaWRlWERpbWVuc2lvbjtcbn0ob2JlbGlzaykpO1xuXG4vKmdsb2JhbCBvYmVsaXNrOnRydWUqL1xuXG4vKlxuICogU2lkZVlEaW1lbnNpb25cbiAqL1xuXG4oZnVuY3Rpb24gKG9iZWxpc2spIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHZhciBTaWRlWURpbWVuc2lvbiwgcDtcblxuICAgIFNpZGVZRGltZW5zaW9uID0gZnVuY3Rpb24gKHlBeGlzLCB6QXhpcykge1xuICAgICAgICB0aGlzLmluaXRpYWxpemUoeUF4aXMsIHpBeGlzKTtcbiAgICB9O1xuICAgIHAgPSBTaWRlWURpbWVuc2lvbi5wcm90b3R5cGUgPSBuZXcgb2JlbGlzay5BYnN0cmFjdERpbWVuc2lvbigpO1xuXG4gICAgLy8gY29uc3RydWN0b3JcbiAgICBwLmluaXRpYWxpemUgPSBmdW5jdGlvbiAoeUF4aXMsIHpBeGlzKSB7XG4gICAgICAgIHRoaXMueUF4aXMgPSB5QXhpcyB8fCAzMDtcbiAgICAgICAgdGhpcy56QXhpcyA9IHpBeGlzIHx8IDMwO1xuXG4gICAgICAgIGlmICh0aGlzLnlBeGlzICUgMiA9PT0gMSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwieUF4aXMgbXVzdCBiZSBldmVuIG51bWJlclwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHlBeGlzIHx8IHpBeGlzID0gNCBmbG9vZEZpbGwgY291bGQgbm90IGJlIGFwcGxpZWRcbiAgICAgICAgaWYgKHRoaXMueUF4aXMgPD0gNCB8fCB0aGlzLnpBeGlzIDw9IDIpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcImRpbWVuc2lvbiBpcyB0b28gc21hbGxcIik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgcC50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIFwiW1NpZGVZRGltZW5zaW9uXVwiO1xuICAgIH07XG5cbiAgICBvYmVsaXNrLlNpZGVZRGltZW5zaW9uID0gU2lkZVlEaW1lbnNpb247XG59KG9iZWxpc2spKTtcblxuLypnbG9iYWwgb2JlbGlzazp0cnVlKi9cblxuLypcbiAqIFNsb3BlRGltZW5zaW9uXG4gKi9cblxuKGZ1bmN0aW9uIChvYmVsaXNrKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICB2YXIgU2xvcGVEaW1lbnNpb24sIHA7XG4gICAgU2xvcGVEaW1lbnNpb24gPSBmdW5jdGlvbiAoeEF4aXMsIHlBeGlzKSB7XG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZSh4QXhpcywgeUF4aXMpO1xuICAgIH07XG4gICAgcCA9IFNsb3BlRGltZW5zaW9uLnByb3RvdHlwZSA9IG5ldyBvYmVsaXNrLkFic3RyYWN0RGltZW5zaW9uKCk7XG5cbiAgICAvLyBjb25zdHJ1Y3RvclxuICAgIHAuaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uICh4QXhpcywgeUF4aXMpIHtcbiAgICAgICAgdGhpcy54QXhpcyA9IHhBeGlzIHx8IDMwO1xuICAgICAgICB0aGlzLnlBeGlzID0geUF4aXMgfHwgMzA7XG5cbiAgICAgICAgaWYgKHRoaXMueEF4aXMgJSAyID09PSAxIHx8IHRoaXMueUF4aXMgJSAyID09PSAxKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJ4QXhpcyBhbmQgeUF4aXMgbXVzdCBiZSBldmVuIG51bWJlclwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLnhBeGlzIDw9IDQgfHwgdGhpcy55QXhpcyA8PSA0KSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJkaW1lbnNpb24gaXMgdG9vIHNtYWxsXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIHAudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBcIltTbG9wZURpbWVuc2lvbl1cIjtcbiAgICB9O1xuXG4gICAgb2JlbGlzay5TbG9wZURpbWVuc2lvbiA9IFNsb3BlRGltZW5zaW9uO1xufShvYmVsaXNrKSk7XG5cbi8qZ2xvYmFsIG9iZWxpc2s6dHJ1ZSovXG5cbi8qXG4gKiBCaXRtYXBEYXRhXG4gKi9cblxuKGZ1bmN0aW9uIChvYmVsaXNrKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICB2YXIgQml0bWFwRGF0YSwgcDtcbiAgICBCaXRtYXBEYXRhID0gZnVuY3Rpb24gKHcsIGgsIHVzZURlZmF1bHRDYW52YXMpIHtcbiAgICAgICAgdGhpcy5pbml0aWFsaXplKHcsIGgsIHVzZURlZmF1bHRDYW52YXMpO1xuICAgIH07XG4gICAgcCA9IEJpdG1hcERhdGEucHJvdG90eXBlO1xuXG4gICAgLy8gcHVibGljIHByb3BlcnR5XG4gICAgcC5pbWFnZURhdGEgPSBudWxsO1xuICAgIHAuY2FudmFzID0gbnVsbDtcbiAgICBwLmNvbnRleHQgPSBudWxsO1xuXG4gICAgLy8gY29uc3RydWN0b3JcbiAgICBwLmluaXRpYWxpemUgPSBmdW5jdGlvbiAodywgaCwgdXNlRGVmYXVsdENhbnZhcykge1xuICAgICAgICBpZiAodyA9PT0gdW5kZWZpbmVkIHx8IGggPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQml0bWFwRGF0YSB3aWR0aCBvciBoZWlnaHQgaXMgbWlzc2luZ1wiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh1c2VEZWZhdWx0Q2FudmFzKSB7XG4gICAgICAgICAgICB0aGlzLmNhbnZhcyA9IG9iZWxpc2suQ2FudmFzTWFuYWdlci5nZXREZWZhdWx0Q2FudmFzKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmNhbnZhcyA9IG9iZWxpc2suQ2FudmFzTWFuYWdlci5nZXROZXdDYW52YXMoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY2FudmFzLnNldEF0dHJpYnV0ZSgnd2lkdGgnLCB3KTtcbiAgICAgICAgdGhpcy5jYW52YXMuc2V0QXR0cmlidXRlKCdoZWlnaHQnLCBoKTtcblxuICAgICAgICB0aGlzLmNvbnRleHQgPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgICAgICB0aGlzLmNvbnRleHQuY2xlYXJSZWN0KDAsIDAsIHRoaXMuY2FudmFzLndpZHRoLCB0aGlzLmNhbnZhcy5oZWlnaHQpO1xuXG4gICAgICAgIHRoaXMuaW1hZ2VEYXRhID0gdGhpcy5jb250ZXh0LmNyZWF0ZUltYWdlRGF0YSh3LCBoKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgcC5zZXRQaXhlbCA9IGZ1bmN0aW9uIChwb3NYLCBwb3NZLCBjb2xvcikge1xuICAgICAgICB2YXIgaW5kZXggPSAocG9zWSAqIHRoaXMuaW1hZ2VEYXRhLndpZHRoICsgcG9zWCkgKiA0O1xuICAgICAgICB0aGlzLnNldFBpeGVsQnlJbmRleChpbmRleCwgY29sb3IpO1xuICAgIH07XG5cbiAgICBwLnNldFBpeGVsQnlJbmRleCA9IGZ1bmN0aW9uIChpbmRleCwgY29sb3IpIHtcbiAgICAgICAgdmFyIHBpeGVscyA9IHRoaXMuaW1hZ2VEYXRhLmRhdGE7XG4gICAgICAgIHBpeGVsc1tpbmRleF0gPSAoY29sb3IgPj4+IDE2KSAmIDB4RkY7XG4gICAgICAgIHBpeGVsc1tpbmRleCArIDFdID0gKGNvbG9yID4+PiA4KSAmIDB4RkY7XG4gICAgICAgIHBpeGVsc1tpbmRleCArIDJdID0gKGNvbG9yID4+PiAwKSAmIDB4RkY7XG4gICAgICAgIHBpeGVsc1tpbmRleCArIDNdID0gKGNvbG9yID4+PiAyNCkgJiAweEZGO1xuICAgIH07XG5cbiAgICBwLmNoZWNrUGl4ZWxBdmFpbGFibGUgPSBmdW5jdGlvbiAoeCwgeSkge1xuICAgICAgICB2YXIgaW5kZXggPSAoeSAqIHRoaXMuaW1hZ2VEYXRhLndpZHRoICsgeCkgKiA0O1xuICAgICAgICByZXR1cm4gdGhpcy5pbWFnZURhdGEuZGF0YVtpbmRleCArIDNdID09PSAwO1xuICAgIH07XG5cbiAgICBwLmZsb29kRmlsbCA9IGZ1bmN0aW9uIChwb3NYLCBwb3NZLCBjb2xvcikge1xuICAgICAgICBpZiAoKChjb2xvciA+Pj4gMjQpICYgMHhGRikgPT09IDB4MDApIHtcbiAgICAgICAgICAgIC8vIHRyYW5zcGFyZW50IGZsb29kIGZpbGxcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciB4ID0gcG9zWCwgeSA9IHBvc1ksXG4gICAgICAgICAgICBzdGFjayA9IFtdLFxuICAgICAgICAgICAgbm93Q29sID0gW10sXG4gICAgICAgICAgICBwcmV2Q29sID0gW10sXG4gICAgICAgICAgICBjb2wsIHJvdywgbWF0Y2hGbGFnLCBuZXdTdGFydCxcbiAgICAgICAgICAgIHcgPSB0aGlzLmltYWdlRGF0YS53aWR0aCxcbiAgICAgICAgICAgIGggPSB0aGlzLmltYWdlRGF0YS5oZWlnaHQsXG4gICAgICAgICAgICBpLCBqO1xuXG4gICAgICAgIC8vIGJvdW5kIHJlYWNoXG4gICAgICAgIGlmICh4IDwgMCB8fCB5IDwgMCB8fCB4ID49IHcgfHwgeSA+PSBoKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBmaXJzdCBwb2ludCBjaGVjayBmYWlsXG4gICAgICAgIGlmICghdGhpcy5jaGVja1BpeGVsQXZhaWxhYmxlKHgsIHkpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJTdGFydCBwb2ludCBmb3IgZmxvb2QgZmlsbCBpcyBhbHJlYWR5IGZpbGxlZFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGxlZnQgc2lkZSBmbG9vZCBmaWxsXG4gICAgICAgIGZvciAoY29sID0geDsgY29sID49IDA7IGNvbCAtPSAxKSB7XG4gICAgICAgICAgICAvLyB0b3Agc2lkZVxuICAgICAgICAgICAgZm9yIChyb3cgPSB5OyByb3cgPj0gMDsgcm93IC09IDEpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jaGVja1BpeGVsQXZhaWxhYmxlKGNvbCwgcm93KSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBhdmFpbGFibGUgcGl4ZWxcbiAgICAgICAgICAgICAgICAgICAgc3RhY2sucHVzaCgocm93ICogdyArIGNvbCkgKiA0KTtcbiAgICAgICAgICAgICAgICAgICAgbm93Q29sLnB1c2gocm93KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBmaXJzdCBvbmUgaXMgaW52YWxpZCBwaXhlbCAmJiBub3QgYXQgY29sIHRvcFxuICAgICAgICAgICAgICAgICAgICBpZiAocm93ID09PSB5ICYmIHRoaXMuY2hlY2tQaXhlbEF2YWlsYWJsZShjb2wgKyAxLCByb3cgLSAxKSkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBuZXh0IG9uZSBpcyB2YWxpZFxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY2hlY2tQaXhlbEF2YWlsYWJsZShjb2wsIHJvdyAtIDEpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3U3RhcnQgPSByb3cgLSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jaGVja1BpeGVsQXZhaWxhYmxlKGNvbCArIDEsIHJvdyAtIDIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld1N0YXJ0ID0gcm93IC0gMjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBmYWlsLCBhc3NpZ24gbWF4IHZhbHVlIHRvIGF2b2lkIGxvb3AgYmVsb3dcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3U3RhcnQgPSAtMTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAocm93ID0gbmV3U3RhcnQ7IHJvdyA+PSAwOyByb3cgLT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoZWNrUGl4ZWxBdmFpbGFibGUoY29sLCByb3cpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGF2YWlsYWJsZSBwaXhlbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFjay5wdXNoKChyb3cgKiB3ICsgY29sKSAqIDQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBub3dDb2wucHVzaChyb3cpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICAvLyBib3R0b20gc2lkZVxuICAgICAgICAgICAgZm9yIChyb3cgPSB5OyByb3cgPCBoOyByb3cgKz0gMSkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoZWNrUGl4ZWxBdmFpbGFibGUoY29sLCByb3cpKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGF2YWlsYWJsZSBwaXhlbFxuICAgICAgICAgICAgICAgICAgICBzdGFjay5wdXNoKChyb3cgKiB3ICsgY29sKSAqIDQpO1xuICAgICAgICAgICAgICAgICAgICBub3dDb2wucHVzaChyb3cpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGZpcnN0IG9uZSBpcyBpbnZhbGlkIHBpeGVsICYmIG5vdCBhdCBjb2wgYm90dG9tXG4gICAgICAgICAgICAgICAgICAgIGlmIChyb3cgPT09IHkgJiYgdGhpcy5jaGVja1BpeGVsQXZhaWxhYmxlKGNvbCArIDEsIHJvdyArIDEpKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIG5leHQgb25lIGlzIHZhbGlkXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jaGVja1BpeGVsQXZhaWxhYmxlKGNvbCwgcm93ICsgMSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdTdGFydCA9IHJvdyArIDE7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoZWNrUGl4ZWxBdmFpbGFibGUoY29sICsgMSwgcm93ICsgMikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3U3RhcnQgPSByb3cgKyAyO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGZhaWwsIGFzc2lnbiBtYXggdmFsdWUgdG8gYXZvaWQgbG9vcCBiZWxvd1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdTdGFydCA9IGg7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHJvdyA9IG5ld1N0YXJ0OyByb3cgPCBoOyByb3cgKz0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoZWNrUGl4ZWxBdmFpbGFibGUoY29sLCByb3cpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGF2YWlsYWJsZSBwaXhlbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFjay5wdXNoKChyb3cgKiB3ICsgY29sKSAqIDQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBub3dDb2wucHVzaChyb3cpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gY29tcGFyZSB3aXRoIHByZXZpb3VzIGNvbHVtblxuICAgICAgICAgICAgLy8gZm9yIGZpcnN0IGNvbHVtblxuICAgICAgICAgICAgLy8gdGhlIGdpdmVuIHBvaW50IHNob3VsZCBiZSBpbnNpZGUgdGhlIGNvbnRhaW5lclxuICAgICAgICAgICAgaWYgKGNvbCA9PT0geCkge1xuICAgICAgICAgICAgICAgIHByZXZDb2wgPSBub3dDb2wuY29uY2F0KCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG1hdGNoRmxhZyA9IGZhbHNlO1xuXG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgcHJldkNvbC5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgICAgIGZvciAoaiA9IDA7IGogPCBwcmV2Q29sLmxlbmd0aDsgaiArPSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChub3dDb2xbal0gPT09IHByZXZDb2xbaV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hdGNoRmxhZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB5ID0gcHJldkNvbFtpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKG1hdGNoRmxhZykge1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChtYXRjaEZsYWcpIHtcbiAgICAgICAgICAgICAgICBwcmV2Q29sID0gbm93Q29sLmNvbmNhdCgpO1xuICAgICAgICAgICAgICAgIG5vd0NvbCA9IFtdO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBib3VuZCByZWFjaFxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gcmVzZXQgc3RhcnQgcG9pbnRcbiAgICAgICAgeCA9IHBvc1g7XG4gICAgICAgIHkgPSBwb3NZO1xuICAgICAgICBwcmV2Q29sID0gW107XG4gICAgICAgIG5vd0NvbCA9IFtdO1xuXG4gICAgICAgIC8vIHJpZ2h0IHNpZGUgZmxvb2QgZmlsbFxuICAgICAgICBmb3IgKGNvbCA9IHg7IGNvbCA8IHc7IGNvbCArPSAxKSB7XG5cbiAgICAgICAgICAgIC8vIHRvcCBzaWRlXG4gICAgICAgICAgICBmb3IgKHJvdyA9IHk7IHJvdyA+PSAwOyByb3cgLT0gMSkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoZWNrUGl4ZWxBdmFpbGFibGUoY29sLCByb3cpKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGF2YWlsYWJsZSBwaXhlbFxuICAgICAgICAgICAgICAgICAgICBzdGFjay5wdXNoKChyb3cgKiB3ICsgY29sKSAqIDQpO1xuICAgICAgICAgICAgICAgICAgICBub3dDb2wucHVzaChyb3cpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGZpcnN0IG9uZSBpcyBpbnZhbGlkIHBpeGVsICYmIG5vdCBhdCBjb2wgdG9wXG4gICAgICAgICAgICAgICAgICAgIGlmIChyb3cgPT09IHkgJiYgdGhpcy5jaGVja1BpeGVsQXZhaWxhYmxlKGNvbCAtIDEsIHJvdyAtIDEpKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIG5leHQgb25lIGlzIHZhbGlkXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jaGVja1BpeGVsQXZhaWxhYmxlKGNvbCwgcm93IC0gMSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdTdGFydCA9IHJvdyAtIDE7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoZWNrUGl4ZWxBdmFpbGFibGUoY29sIC0gMSwgcm93IC0gMikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3U3RhcnQgPSByb3cgLSAyO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGZhaWwsIGFzc2lnbiBtYXggdmFsdWUgdG8gYXZvaWQgbG9vcCBiZWxvd1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdTdGFydCA9IC0xO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChyb3cgPSBuZXdTdGFydDsgcm93ID49IDA7IHJvdyAtPSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY2hlY2tQaXhlbEF2YWlsYWJsZShjb2wsIHJvdykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYXZhaWxhYmxlIHBpeGVsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YWNrLnB1c2goKHJvdyAqIHcgKyBjb2wpICogNCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vd0NvbC5wdXNoKHJvdyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBib3R0b20gc2lkZVxuICAgICAgICAgICAgZm9yIChyb3cgPSB5OyByb3cgPCBoOyByb3cgKz0gMSkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoZWNrUGl4ZWxBdmFpbGFibGUoY29sLCByb3cpKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGF2YWlsYWJsZSBwaXhlbFxuICAgICAgICAgICAgICAgICAgICBzdGFjay5wdXNoKChyb3cgKiB3ICsgY29sKSAqIDQpO1xuICAgICAgICAgICAgICAgICAgICBub3dDb2wucHVzaChyb3cpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGZpcnN0IG9uZSBpcyBpbnZhbGlkIHBpeGVsICYmIG5vdCBhdCBjb2wgYm90dG9tXG4gICAgICAgICAgICAgICAgICAgIGlmIChyb3cgPT09IHkgJiYgdGhpcy5jaGVja1BpeGVsQXZhaWxhYmxlKGNvbCAtIDEsIHJvdyArIDEpKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIG5leHQgb25lIGlzIHZhbGlkXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jaGVja1BpeGVsQXZhaWxhYmxlKGNvbCwgcm93ICsgMSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdTdGFydCA9IHJvdyArIDE7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoZWNrUGl4ZWxBdmFpbGFibGUoY29sIC0gMSwgcm93ICsgMikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3U3RhcnQgPSByb3cgKyAyO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGZhaWwsIGFzc2lnbiBtYXggdmFsdWUgdG8gYXZvaWQgbG9vcCBiZWxvd1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdTdGFydCA9IGg7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHJvdyA9IG5ld1N0YXJ0OyByb3cgPCBoOyByb3cgKz0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoZWNrUGl4ZWxBdmFpbGFibGUoY29sLCByb3cpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGF2YWlsYWJsZSBwaXhlbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFjay5wdXNoKChyb3cgKiB3ICsgY29sKSAqIDQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBub3dDb2wucHVzaChyb3cpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gY29tcGFyZSB3aXRoIHByZXZpb3VzIGNvbHVtblxuICAgICAgICAgICAgLy8gZm9yIGZpcnN0IGNvbHVtblxuICAgICAgICAgICAgLy8gdGhlIGdpdmVuIHBvaW50IHNob3VsZCBiZSBpbnNpZGUgdGhlIGNvbnRhaW5lclxuICAgICAgICAgICAgaWYgKGNvbCA9PT0geCkge1xuICAgICAgICAgICAgICAgIHByZXZDb2wgPSBub3dDb2wuY29uY2F0KCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG1hdGNoRmxhZyA9IGZhbHNlO1xuXG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgcHJldkNvbC5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgICAgIGZvciAoaiA9IDA7IGogPCBwcmV2Q29sLmxlbmd0aDsgaiArPSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChub3dDb2xbal0gPT09IHByZXZDb2xbaV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hdGNoRmxhZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB5ID0gcHJldkNvbFtpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKG1hdGNoRmxhZykge1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChtYXRjaEZsYWcpIHtcbiAgICAgICAgICAgICAgICBwcmV2Q29sID0gbm93Q29sLmNvbmNhdCgpO1xuICAgICAgICAgICAgICAgIG5vd0NvbCA9IFtdO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBib3VuZCByZWFjaFxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gZmlsbCBpbWFnZSBkYXRhXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBzdGFjay5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgdGhpcy5zZXRQaXhlbEJ5SW5kZXgoc3RhY2tbaV0sIGNvbG9yKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBwLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gXCJbQml0bWFwRGF0YV1cIjtcbiAgICB9O1xuXG4gICAgb2JlbGlzay5CaXRtYXBEYXRhID0gQml0bWFwRGF0YTtcbn0ob2JlbGlzaykpO1xuXG4vKmdsb2JhbCBvYmVsaXNrOnRydWUqL1xuXG4vKlxuICogUGl4ZWxPYmplY3RcbiAqL1xuXG4oZnVuY3Rpb24gKG9iZWxpc2spIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHZhciBQaXhlbE9iamVjdCwgcDtcbiAgICBQaXhlbE9iamVjdCA9IGZ1bmN0aW9uIChwcmltaXRpdmUsIHBvaW50M0QpIHtcbiAgICAgICAgdGhpcy5pbml0aWFsaXplKHByaW1pdGl2ZSwgcG9pbnQzRCk7XG4gICAgfTtcbiAgICBwID0gUGl4ZWxPYmplY3QucHJvdG90eXBlO1xuXG4gICAgLy8gcHVibGljIHByb3BlcnRpZXNcbiAgICBwLnggPSBudWxsO1xuICAgIHAueSA9IG51bGw7XG4gICAgcC5jYW52YXMgPSBudWxsO1xuXG4gICAgLy8gY29uc3RydWN0b3JcbiAgICBwLmluaXRpYWxpemUgPSBmdW5jdGlvbiAocHJpbWl0aXZlLCBwb2ludDNEKSB7XG4gICAgICAgIGlmICghcHJpbWl0aXZlKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJQcmltaXRpdmUgaXMgbm90IGRlZmluZWRcIik7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgcDNEID0gcG9pbnQzRCB8fCBuZXcgb2JlbGlzay5Qb2ludDNEKCk7XG5cbiAgICAgICAgdGhpcy5jYW52YXMgPSBwcmltaXRpdmUuY2FudmFzO1xuICAgICAgICB0aGlzLnggPSBwcmltaXRpdmUubWF0cml4LnR4ICsgcDNELnggLSBwM0QueTtcbiAgICAgICAgdGhpcy55ID0gcHJpbWl0aXZlLm1hdHJpeC50eSArIE1hdGguZmxvb3IocDNELnggLyAyICsgcDNELnkgLyAyKSAtIHAzRC56O1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICAvLyBwdWJsaWMgbWV0aG9kc1xuXG4gICAgLy8gdG9kbzogYWRkIGNhbnZhcyByZW1vdmUgbWV0aG9kXG5cbiAgICBwLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gXCJbUGl4ZWxPYmplY3RdXCI7XG4gICAgfTtcblxuICAgIC8vIHByaXZhdGUgbWV0aG9kc1xuXG4gICAgb2JlbGlzay5QaXhlbE9iamVjdCA9IFBpeGVsT2JqZWN0O1xufShvYmVsaXNrKSk7XG5cbi8qZ2xvYmFsIG9iZWxpc2s6dHJ1ZSwgalF1ZXJ5OnRydWUqL1xuXG4vKlxuICogUGl4ZWxWaWV3XG4gKi9cblxuKGZ1bmN0aW9uIChvYmVsaXNrKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICB2YXIgUGl4ZWxWaWV3LCBwO1xuICAgIFBpeGVsVmlldyA9IGZ1bmN0aW9uIChjYW52YXMsIHBvaW50KSB7XG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZShjYW52YXMsIHBvaW50KTtcbiAgICB9O1xuICAgIHAgPSBQaXhlbFZpZXcucHJvdG90eXBlO1xuXG4gICAgLy8gcHVibGljIHByb3BlcnRpZXNcbiAgICBwLmNhbnZhcyA9IG51bGw7XG4gICAgcC5jb250ZXh0ID0gbnVsbDtcbiAgICBwLnBvaW50ID0gbnVsbDtcblxuICAgIC8vIGNvbnN0cnVjdG9yXG4gICAgcC5pbml0aWFsaXplID0gZnVuY3Rpb24gKGNhbnZhcywgcG9pbnQpIHtcbiAgICAgICAgaWYgKCFjYW52YXMpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbnZhcyBpcyBub3QgZGVmaW5lZFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBpZiAoY2FudmFzIGluc3RhbmNlb2YgalF1ZXJ5KSB7XG4gICAgICAgICAgICAgICAgY2FudmFzID0gY2FudmFzLmdldCgwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jYW52YXMgPSBjYW52YXM7XG4gICAgICAgIHRoaXMuY29udGV4dCA9IHRoaXMuY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gICAgICAgIHRoaXMucG9pbnQgPSBwb2ludCB8fCBuZXcgb2JlbGlzay5Qb2ludCgwLCAwKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgLy8gcHVibGljIG1ldGhvZHNcbiAgICBwLnJlbmRlck9iamVjdCA9IGZ1bmN0aW9uIChwcmltaXRpdmUsIHBvaW50M0QpIHtcbiAgICAgICAgdmFyIHBvID0gbmV3IG9iZWxpc2suUGl4ZWxPYmplY3QocHJpbWl0aXZlLCBwb2ludDNEKTtcbiAgICAgICAgdGhpcy5jb250ZXh0LmRyYXdJbWFnZShwby5jYW52YXMsIHRoaXMucG9pbnQueCArIHBvLngsIHRoaXMucG9pbnQueSArIHBvLnkpO1xuICAgIH07XG5cbiAgICBwLmNsZWFyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmNvbnRleHQuY2xlYXJSZWN0KDAsIDAsIHRoaXMuY2FudmFzLndpZHRoLCB0aGlzLmNhbnZhcy5oZWlnaHQpO1xuICAgIH07XG5cbiAgICBwLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gXCJbUGl4ZWxWaWV3XVwiO1xuICAgIH07XG5cbiAgICBvYmVsaXNrLlBpeGVsVmlldyA9IFBpeGVsVmlldztcbn0ob2JlbGlzaykpO1xuXG4vKmdsb2JhbCBvYmVsaXNrOnRydWUqL1xuXG4vKlxuICogTWF0cml4XG4gKi9cblxuKGZ1bmN0aW9uIChvYmVsaXNrKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICB2YXIgTWF0cml4LCBwO1xuICAgIE1hdHJpeCA9IGZ1bmN0aW9uIChhLCBiLCBjLCBkLCB0eCwgdHkpIHtcbiAgICAgICAgdGhpcy5pbml0aWFsaXplKGEsIGIsIGMsIGQsIHR4LCB0eSk7XG4gICAgfTtcbiAgICBwID0gTWF0cml4LnByb3RvdHlwZTtcblxuICAgIC8vIHB1YmxpYyBwcm9wZXJ0aWVzOlxuICAgIC8qKlxuICAgICAqIFBvc2l0aW9uICgwLCAwKSBpbiBhIDN4MyBtYXRyaXguXG4gICAgICogQHByb3BlcnR5IGFcbiAgICAgKiBAdHlwZSBOdW1iZXJcbiAgICAgKiovXG4gICAgcC5hID0gMTtcblxuICAgIC8qKlxuICAgICAqIFBvc2l0aW9uICgwLCAxKSBpbiBhIDN4MyBtYXRyaXguXG4gICAgICogQHByb3BlcnR5IGJcbiAgICAgKiBAdHlwZSBOdW1iZXJcbiAgICAgKiovXG4gICAgcC5iID0gMDtcblxuICAgIC8qKlxuICAgICAqIFBvc2l0aW9uICgxLCAwKSBpbiBhIDN4MyBtYXRyaXguXG4gICAgICogQHByb3BlcnR5IGNcbiAgICAgKiBAdHlwZSBOdW1iZXJcbiAgICAgKiovXG4gICAgcC5jID0gMDtcblxuICAgIC8qKlxuICAgICAqIFBvc2l0aW9uICgxLCAxKSBpbiBhIDN4MyBtYXRyaXguXG4gICAgICogQHByb3BlcnR5IGRcbiAgICAgKiBAdHlwZSBOdW1iZXJcbiAgICAgKiovXG4gICAgcC5kID0gMTtcblxuICAgIC8qKlxuICAgICAqIFBvc2l0aW9uICgyLCAwKSBpbiBhIDN4MyBtYXRyaXguXG4gICAgICogQHByb3BlcnR5IHR4XG4gICAgICogQHR5cGUgTnVtYmVyXG4gICAgICoqL1xuICAgIHAudHggPSAwO1xuXG4gICAgLyoqXG4gICAgICogUG9zaXRpb24gKDIsIDEpIGluIGEgM3gzIG1hdHJpeC5cbiAgICAgKiBAcHJvcGVydHkgdHlcbiAgICAgKiBAdHlwZSBOdW1iZXJcbiAgICAgKiovXG4gICAgcC50eSA9IDA7XG5cbiAgICAvLyBjb25zdHJ1Y3RvclxuICAgIHAuaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uIChhLCBiLCBjLCBkLCB0eCwgdHkpIHtcbiAgICAgICAgdGhpcy5hID0gKGEgPT09IHVuZGVmaW5lZCkgPyAxIDogYTtcbiAgICAgICAgdGhpcy5iID0gYiB8fCAwO1xuICAgICAgICB0aGlzLmMgPSBjIHx8IDA7XG4gICAgICAgIHRoaXMuZCA9IChkID09PSB1bmRlZmluZWQpID8gMSA6IGQ7XG4gICAgICAgIHRoaXMudHggPSB0eCB8fCAwO1xuICAgICAgICB0aGlzLnR5ID0gdHkgfHwgMDtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIC8vIHB1YmxpYyBtZXRob2RzXG4gICAgcC50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIFwiW01hdHJpeF1cIjtcbiAgICB9O1xuXG4gICAgb2JlbGlzay5NYXRyaXggPSBNYXRyaXg7XG59KG9iZWxpc2spKTtcblxuLypnbG9iYWwgb2JlbGlzazp0cnVlKi9cblxuLypcbiAqIFBvaW50XG4gKi9cblxuKGZ1bmN0aW9uIChvYmVsaXNrKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICB2YXIgUG9pbnQsIHA7XG4gICAgUG9pbnQgPSBmdW5jdGlvbiAoeCwgeSkge1xuICAgICAgICB0aGlzLmluaXRpYWxpemUoeCwgeSk7XG4gICAgfTtcbiAgICBwID0gUG9pbnQucHJvdG90eXBlO1xuXG4gICAgLy8gcHVibGljIHByb3BlcnRpZXNcbiAgICBwLnggPSAwO1xuICAgIHAueSA9IDA7XG5cbiAgICAvLyBjb25zdHJ1Y3RvclxuICAgIHAuaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uICh4LCB5KSB7XG4gICAgICAgIHRoaXMueCA9ICh4ID09PSB1bmRlZmluZWQgPyAwIDogeCk7XG4gICAgICAgIHRoaXMueSA9ICh5ID09PSB1bmRlZmluZWQgPyAwIDogeSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICAvLyBwdWJsaWMgbWV0aG9kc1xuICAgIHAudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBcIltQb2ludCB4IDogXCIgKyB0aGlzLnggKyBcIiwgeSA6IFwiICsgdGhpcy55ICsgXCJdXCI7XG4gICAgfTtcblxuICAgIC8vIHByaXZhdGUgbWV0aG9kc1xuXG4gICAgb2JlbGlzay5Qb2ludCA9IFBvaW50O1xufShvYmVsaXNrKSk7XG5cbi8qZ2xvYmFsIG9iZWxpc2s6dHJ1ZSovXG5cbi8qXG4gKiBQb2ludDNEXG4gKi9cblxuKGZ1bmN0aW9uIChvYmVsaXNrKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICB2YXIgUG9pbnQzRCwgcDtcbiAgICBQb2ludDNEID0gZnVuY3Rpb24gKHgsIHksIHopIHtcbiAgICAgICAgdGhpcy5pbml0aWFsaXplKHgsIHksIHopO1xuICAgIH07XG4gICAgcCA9IFBvaW50M0QucHJvdG90eXBlO1xuXG4gICAgLy8gcHVibGljIHByb3BlcnRpZXNcbiAgICBwLnggPSAwO1xuICAgIHAueSA9IDA7XG4gICAgcC56ID0gMDtcblxuICAgIC8vIGNvbnN0cnVjdG9yXG4gICAgcC5pbml0aWFsaXplID0gZnVuY3Rpb24gKHgsIHksIHopIHtcbiAgICAgICAgdGhpcy54ID0gKHggPT09IHVuZGVmaW5lZCA/IDAgOiB4KTtcbiAgICAgICAgdGhpcy55ID0gKHkgPT09IHVuZGVmaW5lZCA/IDAgOiB5KTtcbiAgICAgICAgdGhpcy56ID0gKHogPT09IHVuZGVmaW5lZCA/IDAgOiB6KTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIC8vIHB1YmxpYyBtZXRob2RzXG4gICAgcC50b0dsb2JhbENvb3JkaW5hdGVzID0gZnVuY3Rpb24gKG9mZnNldCkge1xuICAgICAgICB2YXIgcDJEID0gbmV3IG9iZWxpc2suUG9pbnQoXG4gICAgICAgICAgICB0aGlzLnggLSB0aGlzLnksXG4gICAgICAgICAgICBNYXRoLmZsb29yKHRoaXMueCAvIDIgKyB0aGlzLnkgLyAyKSAtIHRoaXMuelxuICAgICAgICApO1xuXG4gICAgICAgIGlmIChvZmZzZXQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcDJELnggPSBwMkQueCArIG9mZnNldC54O1xuICAgICAgICAgICAgcDJELnkgPSBwMkQueSArIG9mZnNldC55O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHAyRDtcbiAgICB9O1xuXG4gICAgcC50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIFwiW1BvaW50M0QgeCA6IFwiICsgdGhpcy54ICsgXCIsIHkgOiBcIiArIHRoaXMueSArIFwiLCB6OiBcIiArIHRoaXMueiArIFwiXVwiO1xuICAgIH07XG5cbiAgICAvLyBwcml2YXRlIG1ldGhvZHNcblxuICAgIG9iZWxpc2suUG9pbnQzRCA9IFBvaW50M0Q7XG59KG9iZWxpc2spKTtcblxuLypnbG9iYWwgb2JlbGlzazp0cnVlKi9cblxuLypcbiAqIEFic3RyYWN0UHJpbWl0aXZlXG4gKi9cblxuKGZ1bmN0aW9uIChvYmVsaXNrKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICB2YXIgQWJzdHJhY3RQcmltaXRpdmUsIHA7XG4gICAgQWJzdHJhY3RQcmltaXRpdmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZSgpO1xuICAgIH07XG4gICAgcCA9IEFic3RyYWN0UHJpbWl0aXZlLnByb3RvdHlwZTtcblxuICAgIC8vIHB1YmxpYyBwcm9wZXJ0aWVzXG4gICAgLyoqXG4gICAgICogdGhlIGNhbnZhcyBmb3IgZHJhd0ltYWdlIHRvIGFueSBjYW52YXNcbiAgICAgKi9cbiAgICBwLmNhbnZhcyA9IG51bGw7XG5cbiAgICAvLyBwcm90ZWN0IHByb3BlcnRpZXNcbiAgICAvKipcbiAgICAgKiB0aGUgd2lkdGggb2YgdGhlIGJpdG1hcCBpbiAyZCBmbGFzaCBjb29yZGluYXRlXG4gICAgICovXG4gICAgcC53ID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIHRoZSBoZWlnaHQgb2YgdGhlIGJpdG1hcCBpbiAyZCBmbGFzaCBjb29yZGluYXRlXG4gICAgICovXG4gICAgcC5oID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIHRoZSBkaW1lbnNpb24gb2YgcHJpbWl0aXZlIGluIDNkIHBpeGVsIGNvb3JkaW5hdGVcbiAgICAgKi9cbiAgICBwLmRpbWVuc2lvbiA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiB0aGUgY29sb3Igb2JqIG9mIHRoZSBwcmltaXRpdmVcbiAgICAgKi9cbiAgICBwLmNvbG9yID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIHRoZSBib3JkZXIgb3B0aW9uIG9mIHRoZSBwcmltaXRpdmVcbiAgICAgKi9cbiAgICBwLmJvcmRlciA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiB0aGUgc291cmNlIGJpdG1hcGRhdGEgY29udGFpbnMgcGl4ZWwgZ3JhcGhpY1xuICAgICAqL1xuICAgIHAuYml0bWFwRGF0YSA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiB0aGUgcHJlc2VydmUgY2FudmFzIG9wdGlvblxuICAgICAqL1xuICAgIHAudXNlRGVmYXVsdENhbnZhcyA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiB0aGUgbWF0cml4IG9mZnNldCBiZXR3ZWVuIHRoZSBiaXRtYXAgYW5kIHRoZSAzZCBwaXhlbCBjb29yZGluYXRlIFpFUk8gcG9pbnRcbiAgICAgKi9cbiAgICBwLm1hdHJpeCA9IG51bGw7XG5cbiAgICAvLyBjb25zdHJ1Y3RvclxuICAgIHAuaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIC8vIHB1YmxpYyBtZXRob2RzXG4gICAgcC50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIFwiW0Fic3RyYWN0UHJpbWl0aXZlXVwiO1xuICAgIH07XG5cbiAgICAvLyBwcml2YXRlIG1ldGhvZHNcblxuICAgIG9iZWxpc2suQWJzdHJhY3RQcmltaXRpdmUgPSBBYnN0cmFjdFByaW1pdGl2ZTtcbn0ob2JlbGlzaykpO1xuXG4vKmdsb2JhbCBvYmVsaXNrOnRydWUqL1xuXG4vKlxuICogQnJpY2tcbiAqL1xuXG4oZnVuY3Rpb24gKG9iZWxpc2spIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHZhciBCcmljaywgcDtcbiAgICBCcmljayA9IGZ1bmN0aW9uIChkaW1lbnNpb24sIGNvbG9yLCBib3JkZXIsIHVzZURlZmF1bHRDYW52YXMpIHtcbiAgICAgICAgdGhpcy5pbml0aWFsaXplKGRpbWVuc2lvbiwgY29sb3IsIGJvcmRlciwgdXNlRGVmYXVsdENhbnZhcyk7XG4gICAgfTtcbiAgICBwID0gQnJpY2sucHJvdG90eXBlID0gbmV3IG9iZWxpc2suQWJzdHJhY3RQcmltaXRpdmUoKTtcblxuICAgIC8vIHB1YmxpYyBwcm9wZXJ0aWVzXG5cbiAgICAvLyBjb25zdHJ1Y3RvclxuICAgIHAuaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uIChkaW1lbnNpb24sIGNvbG9yLCBib3JkZXIsIHVzZURlZmF1bHRDYW52YXMpIHtcbiAgICAgICAgdGhpcy5pbml0UmVuZGVyKGRpbWVuc2lvbiwgY29sb3IsIGJvcmRlciwgdXNlRGVmYXVsdENhbnZhcyk7XG4gICAgICAgIHRoaXMuaW5pdFJlY3RhbmdsZSgpO1xuICAgICAgICB0aGlzLmluaXRCaXRtYXBEYXRhKCk7XG4gICAgICAgIHRoaXMuYnVpbGQoKTtcbiAgICAgICAgdGhpcy5yZW5kZXJCaXRtYXBEYXRhRm9yQ2FudmFzKCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICAvLyBwcml2YXRlIG1ldGhvZFxuICAgIHAuaW5pdFJlbmRlciA9IGZ1bmN0aW9uIChkaW1lbnNpb24sIGNvbG9yLCBib3JkZXIsIHVzZURlZmF1bHRDYW52YXMpIHtcbiAgICAgICAgdGhpcy51c2VEZWZhdWx0Q2FudmFzID0gdXNlRGVmYXVsdENhbnZhcyB8fCBmYWxzZTtcbiAgICAgICAgdGhpcy5ib3JkZXIgPSBib3JkZXIgfHwgYm9yZGVyID09PSB1bmRlZmluZWQ7XG4gICAgICAgIHRoaXMuZGltZW5zaW9uID0gZGltZW5zaW9uID09PSB1bmRlZmluZWQgPyBuZXcgb2JlbGlzay5Ccmlja0RpbWVuc2lvbigpIDogZGltZW5zaW9uO1xuICAgICAgICB0aGlzLmNvbG9yID0gY29sb3IgPT09IHVuZGVmaW5lZCA/IG5ldyBvYmVsaXNrLlNpZGVDb2xvcigpIDogY29sb3I7XG4gICAgfTtcblxuICAgIHAuaW5pdFJlY3RhbmdsZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy53ID0gdGhpcy5kaW1lbnNpb24ueEF4aXMgKyB0aGlzLmRpbWVuc2lvbi55QXhpcztcbiAgICAgICAgdGhpcy5oID0gKHRoaXMuZGltZW5zaW9uLnhBeGlzICsgdGhpcy5kaW1lbnNpb24ueUF4aXMpIC8gMjtcblxuICAgICAgICAvLyAyMi42IGRlZ3JlZXMgaW1wbGVtZW50YXRpb25cbiAgICAgICAgdGhpcy53IC09IDI7XG4gICAgICAgIHRoaXMuaCAtPSAxO1xuXG4gICAgICAgIC8vIHRoZSBtYXRyaXggb2Zmc2V0IGJldHdlZW4gdGhlIGJpdG1hcCBhbmQgdGhlIDNkIHBpeGVsIGNvb3JkaW5hdGUgWkVSTyBwb2ludFxuICAgICAgICB0aGlzLm1hdHJpeCA9IG5ldyBvYmVsaXNrLk1hdHJpeCgpO1xuICAgICAgICB0aGlzLm1hdHJpeC50eCA9IC10aGlzLmRpbWVuc2lvbi55QXhpcyArIDI7XG4gICAgICAgIHRoaXMubWF0cml4LnR5ID0gMDtcbiAgICB9O1xuXG4gICAgcC5pbml0Qml0bWFwRGF0YSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5iaXRtYXBEYXRhID0gbmV3IG9iZWxpc2suQml0bWFwRGF0YSh0aGlzLncsIHRoaXMuaCwgdGhpcy51c2VEZWZhdWx0Q2FudmFzKTtcbiAgICB9O1xuICAgIHAucmVuZGVyQml0bWFwRGF0YUZvckNhbnZhcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5iaXRtYXBEYXRhLmNvbnRleHQucHV0SW1hZ2VEYXRhKHRoaXMuYml0bWFwRGF0YS5pbWFnZURhdGEsIDAsIDApO1xuICAgICAgICB0aGlzLmNhbnZhcyA9IHRoaXMuYml0bWFwRGF0YS5jYW52YXM7XG4gICAgfTtcblxuICAgIHAuYnVpbGQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB4T2Zmc2V0SW5uZXIsIHlPZmZzZXRJbm5lciwgeE9mZnNldE91dCwgeU9mZnNldE91dCwgaSwgaiwgYm9yZGVyQ29sb3I7XG4gICAgICAgIHhPZmZzZXRJbm5lciA9IHRoaXMuZGltZW5zaW9uLnlBeGlzIC0gMjtcbiAgICAgICAgeU9mZnNldElubmVyID0gMDtcbiAgICAgICAgeE9mZnNldE91dCA9IHRoaXMuZGltZW5zaW9uLnhBeGlzIC0gMTtcbiAgICAgICAgeU9mZnNldE91dCA9IHRoaXMuaCAtIDE7XG4gICAgICAgIGJvcmRlckNvbG9yID0gdGhpcy5ib3JkZXIgPyB0aGlzLmNvbG9yLmJvcmRlciA6IHRoaXMuY29sb3IuaW5uZXI7XG5cbiAgICAgICAgLy94IGF4aXNcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IHRoaXMuZGltZW5zaW9uLnhBeGlzOyBpICs9IDEpIHtcbiAgICAgICAgICAgIHRoaXMuYml0bWFwRGF0YS5zZXRQaXhlbCh4T2Zmc2V0SW5uZXIgKyBpLCB5T2Zmc2V0SW5uZXIgKyBNYXRoLmZsb29yKGkgLyAyKSwgYm9yZGVyQ29sb3IpO1xuICAgICAgICAgICAgdGhpcy5iaXRtYXBEYXRhLnNldFBpeGVsKHhPZmZzZXRPdXQgLSBpLCB5T2Zmc2V0T3V0IC0gTWF0aC5mbG9vcihpIC8gMiksIGJvcmRlckNvbG9yKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8veSBheGlzXG4gICAgICAgIGZvciAoaiA9IDA7IGogPCB0aGlzLmRpbWVuc2lvbi55QXhpczsgaiArPSAxKSB7XG4gICAgICAgICAgICB0aGlzLmJpdG1hcERhdGEuc2V0UGl4ZWwoeE9mZnNldElubmVyICsgMSAtIGosIHlPZmZzZXRJbm5lciArIE1hdGguZmxvb3IoaiAvIDIpLCBib3JkZXJDb2xvcik7XG4gICAgICAgICAgICB0aGlzLmJpdG1hcERhdGEuc2V0UGl4ZWwoeE9mZnNldE91dCAtIDEgKyBqLCB5T2Zmc2V0T3V0IC0gTWF0aC5mbG9vcihqIC8gMiksIGJvcmRlckNvbG9yKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vZmlsbCBhbiBwaXhlbCBncmFwaGljIGVuY2xvc2VkXG4gICAgICAgIHRoaXMuYml0bWFwRGF0YS5mbG9vZEZpbGwoTWF0aC5mbG9vcih0aGlzLncgLyAyKSwgTWF0aC5mbG9vcih0aGlzLmggLyAyKSwgdGhpcy5jb2xvci5pbm5lcik7XG4gICAgfTtcblxuICAgIC8vIHB1YmxpYyBtZXRob2RzXG4gICAgcC50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIFwiW0JyaWNrXVwiO1xuICAgIH07XG5cbiAgICBvYmVsaXNrLkJyaWNrID0gQnJpY2s7XG59KG9iZWxpc2spKTtcblxuLypnbG9iYWwgb2JlbGlzazp0cnVlKi9cblxuLypcbiAqIEN1YmVcbiAqL1xuXG4oZnVuY3Rpb24gKG9iZWxpc2spIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHZhciBDdWJlLCBwO1xuICAgIEN1YmUgPSBmdW5jdGlvbiAoZGltZW5zaW9uLCBjb2xvciwgYm9yZGVyLCB1c2VEZWZhdWx0Q2FudmFzKSB7XG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZShkaW1lbnNpb24sIGNvbG9yLCBib3JkZXIsIHVzZURlZmF1bHRDYW52YXMpO1xuICAgIH07XG4gICAgcCA9IEN1YmUucHJvdG90eXBlID0gbmV3IG9iZWxpc2suQWJzdHJhY3RQcmltaXRpdmUoKTtcblxuICAgIC8vIHB1YmxpYyBwcm9wZXJ0aWVzXG5cbiAgICAvLyBjb25zdHJ1Y3RvclxuICAgIHAuaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uIChkaW1lbnNpb24sIGNvbG9yLCBib3JkZXIsIHVzZURlZmF1bHRDYW52YXMpIHtcbiAgICAgICAgdGhpcy5pbml0UmVuZGVyKGRpbWVuc2lvbiwgY29sb3IsIGJvcmRlciwgdXNlRGVmYXVsdENhbnZhcyk7XG4gICAgICAgIHRoaXMuaW5pdFJlY3RhbmdsZSgpO1xuICAgICAgICB0aGlzLmluaXRCaXRtYXBEYXRhKCk7XG4gICAgICAgIHRoaXMuYnVpbGQoKTtcbiAgICAgICAgdGhpcy5yZW5kZXJCaXRtYXBEYXRhRm9yQ2FudmFzKCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICAvLyBwcml2YXRlIG1ldGhvZFxuICAgIHAuaW5pdFJlbmRlciA9IGZ1bmN0aW9uIChkaW1lbnNpb24sIGNvbG9yLCBib3JkZXIsIHVzZURlZmF1bHRDYW52YXMpIHtcbiAgICAgICAgdGhpcy51c2VEZWZhdWx0Q2FudmFzID0gdXNlRGVmYXVsdENhbnZhcyB8fCBmYWxzZTtcbiAgICAgICAgdGhpcy5ib3JkZXIgPSBib3JkZXIgfHwgYm9yZGVyID09PSB1bmRlZmluZWQ7XG4gICAgICAgIHRoaXMuZGltZW5zaW9uID0gZGltZW5zaW9uID09PSB1bmRlZmluZWQgPyBuZXcgb2JlbGlzay5DdWJlRGltZW5zaW9uKCkgOiBkaW1lbnNpb247XG4gICAgICAgIHRoaXMuY29sb3IgPSBjb2xvciA9PT0gdW5kZWZpbmVkID8gbmV3IG9iZWxpc2suQ3ViZUNvbG9yKCkgOiBjb2xvcjtcbiAgICB9O1xuXG4gICAgcC5pbml0UmVjdGFuZ2xlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLncgPSB0aGlzLmRpbWVuc2lvbi54QXhpcyArIHRoaXMuZGltZW5zaW9uLnlBeGlzO1xuICAgICAgICB0aGlzLmggPSB0aGlzLmRpbWVuc2lvbi56QXhpcyArICh0aGlzLmRpbWVuc2lvbi54QXhpcyArIHRoaXMuZGltZW5zaW9uLnlBeGlzKSAvIDI7XG5cbiAgICAgICAgLy8gMjIuNiBkZWdyZWVzIGltcGxlbWVudGF0aW9uXG4gICAgICAgIHRoaXMudyAtPSAyO1xuICAgICAgICB0aGlzLmggLT0gMTtcblxuICAgICAgICAvLyB0aGUgbWF0cml4IG9mZnNldCBiZXR3ZWVuIHRoZSBiaXRtYXAgYW5kIHRoZSAzZCBwaXhlbCBjb29yZGluYXRlIFpFUk8gcG9pbnRcbiAgICAgICAgdGhpcy5tYXRyaXggPSBuZXcgb2JlbGlzay5NYXRyaXgoKTtcbiAgICAgICAgdGhpcy5tYXRyaXgudHggPSAtdGhpcy5kaW1lbnNpb24ueUF4aXMgKyAyO1xuICAgICAgICB0aGlzLm1hdHJpeC50eSA9IC10aGlzLmRpbWVuc2lvbi56QXhpcztcbiAgICB9O1xuXG4gICAgcC5pbml0Qml0bWFwRGF0YSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5iaXRtYXBEYXRhID0gbmV3IG9iZWxpc2suQml0bWFwRGF0YSh0aGlzLncsIHRoaXMuaCwgdGhpcy51c2VEZWZhdWx0Q2FudmFzKTtcbiAgICB9O1xuICAgIHAucmVuZGVyQml0bWFwRGF0YUZvckNhbnZhcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5jYW52YXMgPSB0aGlzLmJpdG1hcERhdGEuY2FudmFzO1xuICAgIH07XG5cbiAgICBwLmJ1aWxkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYnJpY2ssIHNpZGVYLCBzaWRlWSwgcG9fYnJpY2ssIHBvX3gsIHBvX3ksIGN0eCwgYm1kLCBvZmZzZXRYLCBvZmZzZXRZLFxuICAgICAgICAgICAgaSwgaiwgaztcbiAgICAgICAgLy8gaG9yaXpvbnRhbCBsYXllclxuICAgICAgICBicmljayA9IG5ldyBvYmVsaXNrLkJyaWNrKFxuICAgICAgICAgICAgbmV3IG9iZWxpc2suQnJpY2tEaW1lbnNpb24odGhpcy5kaW1lbnNpb24ueEF4aXMsIHRoaXMuZGltZW5zaW9uLnlBeGlzKSxcbiAgICAgICAgICAgIG5ldyBvYmVsaXNrLlNpZGVDb2xvcih0aGlzLmNvbG9yLmJvcmRlciwgdGhpcy5jb2xvci5ob3Jpem9udGFsKSxcbiAgICAgICAgICAgIHRoaXMuYm9yZGVyXG4gICAgICAgICk7XG5cbiAgICAgICAgLy8gbGVmdCBzaWRlXG4gICAgICAgIHNpZGVYID0gbmV3IG9iZWxpc2suU2lkZVgoXG4gICAgICAgICAgICBuZXcgb2JlbGlzay5TaWRlWERpbWVuc2lvbih0aGlzLmRpbWVuc2lvbi54QXhpcywgdGhpcy5kaW1lbnNpb24uekF4aXMpLFxuICAgICAgICAgICAgbmV3IG9iZWxpc2suU2lkZUNvbG9yKHRoaXMuY29sb3IuYm9yZGVyLCB0aGlzLmNvbG9yLmxlZnQpLFxuICAgICAgICAgICAgdGhpcy5ib3JkZXJcbiAgICAgICAgKTtcblxuICAgICAgICAvLyByaWdodCBzaWRlXG4gICAgICAgIHNpZGVZID0gbmV3IG9iZWxpc2suU2lkZVkoXG4gICAgICAgICAgICBuZXcgb2JlbGlzay5TaWRlWURpbWVuc2lvbih0aGlzLmRpbWVuc2lvbi55QXhpcywgdGhpcy5kaW1lbnNpb24uekF4aXMpLFxuICAgICAgICAgICAgbmV3IG9iZWxpc2suU2lkZUNvbG9yKHRoaXMuY29sb3IuYm9yZGVyLCB0aGlzLmNvbG9yLnJpZ2h0KSxcbiAgICAgICAgICAgIHRoaXMuYm9yZGVyXG4gICAgICAgICk7XG5cbiAgICAgICAgcG9fYnJpY2sgPSBuZXcgb2JlbGlzay5QaXhlbE9iamVjdChicmljayk7XG4gICAgICAgIHBvX3ggPSBuZXcgb2JlbGlzay5QaXhlbE9iamVjdChzaWRlWCk7XG4gICAgICAgIHBvX3kgPSBuZXcgb2JlbGlzay5QaXhlbE9iamVjdChzaWRlWSk7XG5cbiAgICAgICAgY3R4ID0gdGhpcy5iaXRtYXBEYXRhLmNvbnRleHQ7XG4gICAgICAgIGN0eC5kcmF3SW1hZ2UocG9fYnJpY2suY2FudmFzLCBwb19icmljay54ICsgdGhpcy5kaW1lbnNpb24ueUF4aXMgLSAyLCBwb19icmljay55KTtcbiAgICAgICAgY3R4LmRyYXdJbWFnZShwb194LmNhbnZhcywgcG9feC54LCBwb194LnkgKyB0aGlzLmRpbWVuc2lvbi56QXhpcyArIHRoaXMuZGltZW5zaW9uLnlBeGlzIC8gMiAtIDEpO1xuICAgICAgICBjdHguZHJhd0ltYWdlKHBvX3kuY2FudmFzLCBwb195LnggKyB0aGlzLncgLSAyLCBwb194LnkgKyB0aGlzLmRpbWVuc2lvbi56QXhpcyArIHRoaXMuZGltZW5zaW9uLnhBeGlzIC8gMiAtIDEpO1xuXG4gICAgICAgIC8vIGhpZ2hsaWdodCAmIGhpZ2hsaWdodCBmaXhcbiAgICAgICAgYm1kID0gbmV3IG9iZWxpc2suQml0bWFwRGF0YSh0aGlzLncsIHRoaXMuaCk7XG5cbiAgICAgICAgaWYgKHRoaXMuYm9yZGVyKSB7XG4gICAgICAgICAgICBvZmZzZXRYID0gdGhpcy5kaW1lbnNpb24ueEF4aXMgLSAyO1xuICAgICAgICAgICAgb2Zmc2V0WSA9ICh0aGlzLmRpbWVuc2lvbi54QXhpcyArIHRoaXMuZGltZW5zaW9uLnlBeGlzKSAvIDIgLSAyO1xuXG4gICAgICAgICAgICAvL3RoZSAycHggaW4gYm91bmRpbmcgd2l0aG91dCBoaWdodGxpZ2h0XG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5kaW1lbnNpb24ueEF4aXMgLSAyOyBpICs9IDEpIHtcbiAgICAgICAgICAgICAgICBibWQuc2V0UGl4ZWwob2Zmc2V0WCArIDEgLSBpLCBvZmZzZXRZIC0gTWF0aC5mbG9vcihpIC8gMiksIHRoaXMuY29sb3IuYm9yZGVySGlnaGxpZ2h0KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy90aGUgMnB4IGluIGJvdW5kaW5nIHdpdGhvdXQgaGlnaHRsaWdodFxuICAgICAgICAgICAgZm9yIChqID0gMDsgaiA8IHRoaXMuZGltZW5zaW9uLnlBeGlzIC0gMjsgaiArPSAxKSB7XG4gICAgICAgICAgICAgICAgYm1kLnNldFBpeGVsKG9mZnNldFggKyBqLCBvZmZzZXRZIC0gTWF0aC5mbG9vcihqIC8gMiksIHRoaXMuY29sb3IuYm9yZGVySGlnaGxpZ2h0KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZm9yIChrID0gMDsgayA8IHRoaXMuZGltZW5zaW9uLnpBeGlzOyBrICs9IDEpIHtcbiAgICAgICAgICAgICAgICBibWQuc2V0UGl4ZWwob2Zmc2V0WCwgb2Zmc2V0WSArIGssIHRoaXMuY29sb3IuYm9yZGVySGlnaGxpZ2h0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCB0aGlzLmRpbWVuc2lvbi56QXhpczsgaSArPSAxKSB7XG4gICAgICAgICAgICAgICAgYm1kLnNldFBpeGVsKHRoaXMuZGltZW5zaW9uLnhBeGlzIC0gMiwgKHRoaXMuZGltZW5zaW9uLnhBeGlzICsgdGhpcy5kaW1lbnNpb24ueUF4aXMpIC8gMiAtIDEgKyBpLCB0aGlzLmNvbG9yLmxlZnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGJtZC5jb250ZXh0LnB1dEltYWdlRGF0YShibWQuaW1hZ2VEYXRhLCAwLCAwKTtcbiAgICAgICAgY3R4LmRyYXdJbWFnZShibWQuY2FudmFzLCAwLCAwKTtcbiAgICB9O1xuXG4gICAgLy8gcHVibGljIG1ldGhvZHNcbiAgICBwLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gXCJbQ3ViZV1cIjtcbiAgICB9O1xuXG4gICAgb2JlbGlzay5DdWJlID0gQ3ViZTtcbn0ob2JlbGlzaykpO1xuXG4vKmdsb2JhbCBvYmVsaXNrOnRydWUqL1xuXG4vKlxuICogUHlyYW1pZFxuICovXG5cbihmdW5jdGlvbiAob2JlbGlzaykge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgdmFyIFB5cmFtaWQsIHA7XG4gICAgUHlyYW1pZCA9IGZ1bmN0aW9uIChkaW1lbnNpb24sIGNvbG9yLCBib3JkZXIsIHVzZURlZmF1bHRDYW52YXMpIHtcbiAgICAgICAgdGhpcy5pbml0aWFsaXplKGRpbWVuc2lvbiwgY29sb3IsIGJvcmRlciwgdXNlRGVmYXVsdENhbnZhcyk7XG4gICAgfTtcbiAgICBwID0gUHlyYW1pZC5wcm90b3R5cGUgPSBuZXcgb2JlbGlzay5BYnN0cmFjdFByaW1pdGl2ZSgpO1xuXG4gICAgLy8gcHJpdmF0ZSBwcm9wZXJ0aWVzXG4gICAgcC5oU2l6ZSA9IG51bGw7XG4gICAgcC5oT2Zmc2V0ID0gbnVsbDtcblxuICAgIC8vIGNvbnN0cnVjdG9yXG4gICAgcC5pbml0aWFsaXplID0gZnVuY3Rpb24gKGRpbWVuc2lvbiwgY29sb3IsIGJvcmRlciwgdXNlRGVmYXVsdENhbnZhcykge1xuICAgICAgICB0aGlzLmluaXRSZW5kZXIoZGltZW5zaW9uLCBjb2xvciwgYm9yZGVyLCB1c2VEZWZhdWx0Q2FudmFzKTtcbiAgICAgICAgdGhpcy5pbml0UmVjdGFuZ2xlKCk7XG4gICAgICAgIHRoaXMuaW5pdEJpdG1hcERhdGEoKTtcbiAgICAgICAgdGhpcy5idWlsZCgpO1xuICAgICAgICB0aGlzLnJlbmRlckJpdG1hcERhdGFGb3JDYW52YXMoKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIC8vIHByaXZhdGUgbWV0aG9kXG4gICAgcC5pbml0UmVuZGVyID0gZnVuY3Rpb24gKGRpbWVuc2lvbiwgY29sb3IsIGJvcmRlciwgdXNlRGVmYXVsdENhbnZhcykge1xuICAgICAgICB0aGlzLnVzZURlZmF1bHRDYW52YXMgPSB1c2VEZWZhdWx0Q2FudmFzIHx8IGZhbHNlO1xuICAgICAgICB0aGlzLmJvcmRlciA9IGJvcmRlciB8fCBib3JkZXIgPT09IHVuZGVmaW5lZDtcbiAgICAgICAgdGhpcy5kaW1lbnNpb24gPSBkaW1lbnNpb24gPT09IHVuZGVmaW5lZCA/IG5ldyBvYmVsaXNrLlB5cmFtaWREaW1lbnNpb24oKSA6IGRpbWVuc2lvbjtcbiAgICAgICAgdGhpcy5jb2xvciA9IGNvbG9yID09PSB1bmRlZmluZWQgPyBuZXcgb2JlbGlzay5QeXJhbWlkQ29sb3IoKSA6IGNvbG9yO1xuXG4gICAgICAgIHRoaXMuaFNpemUgPSB0aGlzLmRpbWVuc2lvbi50YWxsID8gdGhpcy5kaW1lbnNpb24ueEF4aXMgKiAyIDogdGhpcy5kaW1lbnNpb24ueEF4aXM7XG4gICAgICAgIHRoaXMuaE9mZnNldCA9IHRoaXMuZGltZW5zaW9uLnRhbGwgPyAtMyA6IC0yO1xuICAgIH07XG5cbiAgICBwLmluaXRSZWN0YW5nbGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMudyA9IHRoaXMuZGltZW5zaW9uLnhBeGlzICsgdGhpcy5kaW1lbnNpb24ueUF4aXM7XG4gICAgICAgIHRoaXMuaCA9IHRoaXMuaFNpemUgKyB0aGlzLmRpbWVuc2lvbi54QXhpcyAvIDI7XG5cbiAgICAgICAgLy8gMjIuNiBkZWdyZWVzIGltcGxlbWVudGF0aW9uXG4gICAgICAgIHRoaXMudyAtPSAyO1xuICAgICAgICB0aGlzLmggKz0gdGhpcy5oT2Zmc2V0O1xuXG4gICAgICAgIC8vIHRoZSBtYXRyaXggb2Zmc2V0IGJldHdlZW4gdGhlIGJpdG1hcCBhbmQgdGhlIDNkIHBpeGVsIGNvb3JkaW5hdGUgWkVSTyBwb2ludFxuICAgICAgICB0aGlzLm1hdHJpeCA9IG5ldyBvYmVsaXNrLk1hdHJpeCgpO1xuICAgICAgICB0aGlzLm1hdHJpeC50eCA9IC10aGlzLmRpbWVuc2lvbi54QXhpcyArIDI7XG4gICAgICAgIHRoaXMubWF0cml4LnR5ID0gLXRoaXMuaFNpemUgLyAyICsgMiAtICh0aGlzLmRpbWVuc2lvbi50YWxsID8gdGhpcy5kaW1lbnNpb24ueEF4aXMgLyAyIDogMSk7XG4gICAgfTtcblxuICAgIHAuaW5pdEJpdG1hcERhdGEgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuYml0bWFwRGF0YSA9IG5ldyBvYmVsaXNrLkJpdG1hcERhdGEodGhpcy53LCB0aGlzLmgsIHRoaXMudXNlRGVmYXVsdENhbnZhcyk7XG4gICAgfTtcbiAgICBwLnJlbmRlckJpdG1hcERhdGFGb3JDYW52YXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuYml0bWFwRGF0YS5jb250ZXh0LnB1dEltYWdlRGF0YSh0aGlzLmJpdG1hcERhdGEuaW1hZ2VEYXRhLCAwLCAwKTtcbiAgICAgICAgdGhpcy5jYW52YXMgPSB0aGlzLmJpdG1hcERhdGEuY2FudmFzO1xuICAgIH07XG5cbiAgICBwLmJ1aWxkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgY29sb3Jib3JkZXJfbGVmdCwgY29sb3Jib3JkZXJfcmlnaHQsIGNvbG9yYm9yZGVyX2hpZ2hsaWdodCxcbiAgICAgICAgICAgIGksIGosIGssIGwxLCBtMSwgbDIsIG0yO1xuICAgICAgICBjb2xvcmJvcmRlcl9sZWZ0ID0gdGhpcy5ib3JkZXIgPyB0aGlzLmNvbG9yLmJvcmRlciA6IHRoaXMuY29sb3IubGVmdDtcbiAgICAgICAgY29sb3Jib3JkZXJfcmlnaHQgPSB0aGlzLmJvcmRlciA/IHRoaXMuY29sb3IuYm9yZGVyIDogdGhpcy5jb2xvci5yaWdodDtcblxuICAgICAgICBjb2xvcmJvcmRlcl9oaWdobGlnaHQgPSB0aGlzLmJvcmRlciA/IHRoaXMuY29sb3IuYm9yZGVySGlnaGxpZ2h0IDogY29sb3Jib3JkZXJfbGVmdDtcblxuICAgICAgICAvL3ogYXhpcyB8fCBoaWdodGxpZ2h0XG4gICAgICAgIGZvciAoayA9IDA7IGsgPCB0aGlzLmhTaXplICsgdGhpcy5kaW1lbnNpb24ueEF4aXMgLyAyIC0gNDsgayArPSAxKSB7XG4gICAgICAgICAgICB0aGlzLmJpdG1hcERhdGEuc2V0UGl4ZWwodGhpcy5kaW1lbnNpb24ueEF4aXMgLSAyLCBrICsgMyArIHRoaXMuaE9mZnNldCwgY29sb3Jib3JkZXJfaGlnaGxpZ2h0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8veCBheGlzXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCB0aGlzLmRpbWVuc2lvbi54QXhpczsgaSArPSAxKSB7XG4gICAgICAgICAgICB0aGlzLmJpdG1hcERhdGEuc2V0UGl4ZWwoaSwgdGhpcy5oU2l6ZSArIE1hdGguZmxvb3IoaSAvIDIpICsgdGhpcy5oT2Zmc2V0LCBjb2xvcmJvcmRlcl9sZWZ0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8veSBheGlzXG4gICAgICAgIGZvciAoaiA9IDA7IGogPCB0aGlzLmRpbWVuc2lvbi54QXhpczsgaiArPSAxKSB7XG4gICAgICAgICAgICB0aGlzLmJpdG1hcERhdGEuc2V0UGl4ZWwoaiArIHRoaXMuZGltZW5zaW9uLnhBeGlzIC0gMiwgdGhpcy5oU2l6ZSArIHRoaXMuZGltZW5zaW9uLnhBeGlzIC8gMiAtIE1hdGguZmxvb3IoaiAvIDIpIC0gMSArIHRoaXMuaE9mZnNldCwgY29sb3Jib3JkZXJfcmlnaHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0aGlzLmRpbWVuc2lvbi50YWxsKSB7XG4gICAgICAgICAgICAvL2xlZnQgZWRnZVxuICAgICAgICAgICAgZm9yIChsMSA9IDA7IGwxIDwgdGhpcy5oU2l6ZTsgbDEgKz0gMSkge1xuICAgICAgICAgICAgICAgIHRoaXMuYml0bWFwRGF0YS5zZXRQaXhlbChsMSwgdGhpcy5oU2l6ZSAtIGwxICsgdGhpcy5oT2Zmc2V0LCBjb2xvcmJvcmRlcl9sZWZ0KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy9yaWdodCBlZGdlXG4gICAgICAgICAgICBmb3IgKG0xID0gMDsgbTEgPCB0aGlzLmhTaXplOyBtMSArPSAxKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5iaXRtYXBEYXRhLnNldFBpeGVsKG0xICsgdGhpcy5oU2l6ZSAtIDIsIG0xICsgMSArIHRoaXMuaE9mZnNldCwgY29sb3Jib3JkZXJfcmlnaHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy9sZWZ0IGVkZ2VcbiAgICAgICAgICAgIGZvciAobDIgPSAwOyBsMiA8IHRoaXMuaFNpemUgLSAyOyBsMiArPSAxKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5iaXRtYXBEYXRhLnNldFBpeGVsKE1hdGguZmxvb3IobDIgLyAyKSwgdGhpcy5oU2l6ZSAtIGwyICsgdGhpcy5oT2Zmc2V0LCBjb2xvcmJvcmRlcl9sZWZ0KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy9yaWdodCBlZGdlXG4gICAgICAgICAgICBmb3IgKG0yID0gMjsgbTIgPCB0aGlzLmhTaXplOyBtMiArPSAxKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5iaXRtYXBEYXRhLnNldFBpeGVsKE1hdGguZmxvb3IobTIgLyAyKSArIHRoaXMuZGltZW5zaW9uLnhBeGlzIC0gMiwgbTIgKyAxICsgdGhpcy5oT2Zmc2V0LCBjb2xvcmJvcmRlcl9yaWdodCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRoaXMuYm9yZGVyKSB7XG4gICAgICAgICAgICB0aGlzLmJpdG1hcERhdGEuc2V0UGl4ZWwodGhpcy5kaW1lbnNpb24ueEF4aXMgLSAyLCB0aGlzLmhTaXplICsgdGhpcy5kaW1lbnNpb24ueEF4aXMgLyAyIC0gMSArIHRoaXMuaE9mZnNldCwgY29sb3Jib3JkZXJfbGVmdCk7XG4gICAgICAgIH1cblxuICAgICAgICAvL2Zsb29kZmlsbFxuICAgICAgICB0aGlzLmJpdG1hcERhdGEuZmxvb2RGaWxsKHRoaXMuZGltZW5zaW9uLnhBeGlzIC0gMSwgdGhpcy5oU2l6ZSArIE1hdGguZmxvb3IoKHRoaXMuZGltZW5zaW9uLnhBeGlzIC0gMSkgLyAyKSArIHRoaXMuaE9mZnNldCAtIDEsIHRoaXMuY29sb3IucmlnaHQpO1xuICAgICAgICB0aGlzLmJpdG1hcERhdGEuZmxvb2RGaWxsKHRoaXMuZGltZW5zaW9uLnhBeGlzIC0gMywgdGhpcy5oU2l6ZSArIE1hdGguZmxvb3IoKHRoaXMuZGltZW5zaW9uLnhBeGlzIC0gMSkgLyAyKSArIHRoaXMuaE9mZnNldCAtIDIsIHRoaXMuY29sb3IubGVmdCk7XG4gICAgfTtcblxuICAgIC8vIHB1YmxpYyBtZXRob2RzXG4gICAgcC50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIFwiW1B5cmFtaWRdXCI7XG4gICAgfTtcblxuICAgIG9iZWxpc2suUHlyYW1pZCA9IFB5cmFtaWQ7XG59KG9iZWxpc2spKTtcblxuLypnbG9iYWwgb2JlbGlzazp0cnVlKi9cblxuLypcbiAqIFNpZGVYXG4gKi9cblxuKGZ1bmN0aW9uIChvYmVsaXNrKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgdmFyIFNpZGVYLCBwO1xuICAgIFNpZGVYID0gZnVuY3Rpb24gKGRpbWVuc2lvbiwgY29sb3IsIGJvcmRlciwgdXNlRGVmYXVsdENhbnZhcykge1xuICAgICAgICB0aGlzLmluaXRpYWxpemUoZGltZW5zaW9uLCBjb2xvciwgYm9yZGVyLCB1c2VEZWZhdWx0Q2FudmFzKTtcbiAgICB9O1xuICAgIHAgPSBTaWRlWC5wcm90b3R5cGUgPSBuZXcgb2JlbGlzay5BYnN0cmFjdFByaW1pdGl2ZSgpO1xuXG4gICAgLy8gcHVibGljIHByb3BlcnRpZXNcblxuICAgIC8vIGNvbnN0cnVjdG9yXG4gICAgcC5pbml0aWFsaXplID0gZnVuY3Rpb24gKGRpbWVuc2lvbiwgY29sb3IsIGJvcmRlciwgdXNlRGVmYXVsdENhbnZhcykge1xuICAgICAgICB0aGlzLmluaXRSZW5kZXIoZGltZW5zaW9uLCBjb2xvciwgYm9yZGVyLCB1c2VEZWZhdWx0Q2FudmFzKTtcbiAgICAgICAgdGhpcy5pbml0UmVjdGFuZ2xlKCk7XG4gICAgICAgIHRoaXMuaW5pdEJpdG1hcERhdGEoKTtcbiAgICAgICAgdGhpcy5idWlsZCgpO1xuICAgICAgICB0aGlzLnJlbmRlckJpdG1hcERhdGFGb3JDYW52YXMoKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIC8vIHByaXZhdGUgbWV0aG9kXG4gICAgcC5pbml0UmVuZGVyID0gZnVuY3Rpb24gKGRpbWVuc2lvbiwgY29sb3IsIGJvcmRlciwgdXNlRGVmYXVsdENhbnZhcykge1xuICAgICAgICB0aGlzLnVzZURlZmF1bHRDYW52YXMgPSB1c2VEZWZhdWx0Q2FudmFzIHx8IGZhbHNlO1xuICAgICAgICB0aGlzLmJvcmRlciA9IGJvcmRlciB8fCBib3JkZXIgPT09IHVuZGVmaW5lZDtcbiAgICAgICAgdGhpcy5kaW1lbnNpb24gPSBkaW1lbnNpb24gPT09IHVuZGVmaW5lZCA/IG5ldyBvYmVsaXNrLlNpZGVYRGltZW5zaW9uKCkgOiBkaW1lbnNpb247XG4gICAgICAgIHRoaXMuY29sb3IgPSBjb2xvciA9PT0gdW5kZWZpbmVkID8gbmV3IG9iZWxpc2suU2lkZUNvbG9yKCkgOiBjb2xvcjtcbiAgICB9O1xuXG4gICAgcC5pbml0UmVjdGFuZ2xlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLncgPSB0aGlzLmRpbWVuc2lvbi54QXhpcztcbiAgICAgICAgdGhpcy5oID0gdGhpcy5kaW1lbnNpb24uekF4aXMgKyB0aGlzLmRpbWVuc2lvbi54QXhpcyAvIDI7XG5cbiAgICAgICAgLy8gdGhlIG1hdHJpeCBvZmZzZXQgYmV0d2VlbiB0aGUgYml0bWFwIGFuZCB0aGUgM2QgcGl4ZWwgY29vcmRpbmF0ZSBaRVJPIHBvaW50XG4gICAgICAgIHRoaXMubWF0cml4ID0gbmV3IG9iZWxpc2suTWF0cml4KCk7XG4gICAgICAgIHRoaXMubWF0cml4LnR4ID0gMDtcbiAgICAgICAgdGhpcy5tYXRyaXgudHkgPSAtdGhpcy5kaW1lbnNpb24uekF4aXM7XG4gICAgfTtcblxuICAgIHAuaW5pdEJpdG1hcERhdGEgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuYml0bWFwRGF0YSA9IG5ldyBvYmVsaXNrLkJpdG1hcERhdGEodGhpcy53LCB0aGlzLmgsIHRoaXMudXNlRGVmYXVsdENhbnZhcyk7XG4gICAgfTtcbiAgICBwLnJlbmRlckJpdG1hcERhdGFGb3JDYW52YXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuYml0bWFwRGF0YS5jb250ZXh0LnB1dEltYWdlRGF0YSh0aGlzLmJpdG1hcERhdGEuaW1hZ2VEYXRhLCAwLCAwKTtcbiAgICAgICAgdGhpcy5jYW52YXMgPSB0aGlzLmJpdG1hcERhdGEuY2FudmFzO1xuICAgIH07XG5cbiAgICBwLmJ1aWxkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgeE9mZnNldElubmVyLCB5T2Zmc2V0SW5uZXIsIHhPZmZzZXRPdXQsIHlPZmZzZXRPdXQsIGksIGosIGJvcmRlckNvbG9yO1xuXG4gICAgICAgIHhPZmZzZXRJbm5lciA9IDA7XG4gICAgICAgIHlPZmZzZXRJbm5lciA9IHRoaXMuZGltZW5zaW9uLnpBeGlzO1xuICAgICAgICB4T2Zmc2V0T3V0ID0gdGhpcy5kaW1lbnNpb24ueEF4aXMgLSAxO1xuICAgICAgICB5T2Zmc2V0T3V0ID0gdGhpcy5oIC0gdGhpcy5kaW1lbnNpb24uekF4aXMgLSAxO1xuICAgICAgICBib3JkZXJDb2xvciA9IHRoaXMuYm9yZGVyID8gdGhpcy5jb2xvci5ib3JkZXIgOiB0aGlzLmNvbG9yLmlubmVyO1xuXG4gICAgICAgIC8veCBheGlzXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCB0aGlzLmRpbWVuc2lvbi54QXhpczsgaSArPSAxKSB7XG4gICAgICAgICAgICB0aGlzLmJpdG1hcERhdGEuc2V0UGl4ZWwoeE9mZnNldElubmVyICsgaSwgeU9mZnNldElubmVyICsgTWF0aC5mbG9vcihpIC8gMiksIGJvcmRlckNvbG9yKTtcbiAgICAgICAgICAgIHRoaXMuYml0bWFwRGF0YS5zZXRQaXhlbCh4T2Zmc2V0T3V0IC0gaSwgeU9mZnNldE91dCAtIE1hdGguZmxvb3IoaSAvIDIpLCBib3JkZXJDb2xvcik7XG4gICAgICAgIH1cblxuICAgICAgICAvL3ogYXhpc1xuICAgICAgICBmb3IgKGogPSAwOyBqIDwgdGhpcy5kaW1lbnNpb24uekF4aXM7IGogKz0gMSkge1xuICAgICAgICAgICAgdGhpcy5iaXRtYXBEYXRhLnNldFBpeGVsKHhPZmZzZXRJbm5lciwgeU9mZnNldElubmVyIC0gaiwgYm9yZGVyQ29sb3IpO1xuICAgICAgICAgICAgdGhpcy5iaXRtYXBEYXRhLnNldFBpeGVsKHhPZmZzZXRPdXQsIHlPZmZzZXRPdXQgKyBqLCBib3JkZXJDb2xvcik7XG4gICAgICAgIH1cblxuICAgICAgICAvL2ZpbGwgYW4gcGl4ZWwgZ3JhcGhpYyBlbmNsb3NlZFxuICAgICAgICB0aGlzLmJpdG1hcERhdGEuZmxvb2RGaWxsKE1hdGguZmxvb3IodGhpcy53IC8gMiksIE1hdGguZmxvb3IodGhpcy5oIC8gMiksIHRoaXMuY29sb3IuaW5uZXIpO1xuICAgIH07XG5cbiAgICAvLyBwdWJsaWMgbWV0aG9kc1xuICAgIHAudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBcIltTaWRlWF1cIjtcbiAgICB9O1xuXG4gICAgb2JlbGlzay5TaWRlWCA9IFNpZGVYO1xufShvYmVsaXNrKSk7XG5cbi8qZ2xvYmFsIG9iZWxpc2s6dHJ1ZSovXG5cbi8qXG4gKiBTaWRlWVxuICovXG5cbihmdW5jdGlvbiAob2JlbGlzaykge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgdmFyIFNpZGVZLCBwO1xuICAgIFNpZGVZID0gZnVuY3Rpb24gKGRpbWVuc2lvbiwgY29sb3IsIGJvcmRlciwgdXNlRGVmYXVsdENhbnZhcykge1xuICAgICAgICB0aGlzLmluaXRpYWxpemUoZGltZW5zaW9uLCBjb2xvciwgYm9yZGVyLCB1c2VEZWZhdWx0Q2FudmFzKTtcbiAgICB9O1xuICAgIHAgPSBTaWRlWS5wcm90b3R5cGUgPSBuZXcgb2JlbGlzay5BYnN0cmFjdFByaW1pdGl2ZSgpO1xuXG4gICAgLy8gcHVibGljIHByb3BlcnRpZXNcblxuICAgIC8vIGNvbnN0cnVjdG9yXG4gICAgcC5pbml0aWFsaXplID0gZnVuY3Rpb24gKGRpbWVuc2lvbiwgY29sb3IsIGJvcmRlciwgdXNlRGVmYXVsdENhbnZhcykge1xuICAgICAgICB0aGlzLmluaXRSZW5kZXIoZGltZW5zaW9uLCBjb2xvciwgYm9yZGVyLCB1c2VEZWZhdWx0Q2FudmFzKTtcbiAgICAgICAgdGhpcy5pbml0UmVjdGFuZ2xlKCk7XG4gICAgICAgIHRoaXMuaW5pdEJpdG1hcERhdGEoKTtcbiAgICAgICAgdGhpcy5idWlsZCgpO1xuICAgICAgICB0aGlzLnJlbmRlckJpdG1hcERhdGFGb3JDYW52YXMoKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIC8vIHByaXZhdGUgbWV0aG9kXG4gICAgcC5pbml0UmVuZGVyID0gZnVuY3Rpb24gKGRpbWVuc2lvbiwgY29sb3IsIGJvcmRlciwgdXNlRGVmYXVsdENhbnZhcykge1xuICAgICAgICB0aGlzLnVzZURlZmF1bHRDYW52YXMgPSB1c2VEZWZhdWx0Q2FudmFzIHx8IGZhbHNlO1xuICAgICAgICB0aGlzLmJvcmRlciA9IGJvcmRlciB8fCBib3JkZXIgPT09IHVuZGVmaW5lZDtcbiAgICAgICAgdGhpcy5kaW1lbnNpb24gPSBkaW1lbnNpb24gPT09IHVuZGVmaW5lZCA/IG5ldyBvYmVsaXNrLlNpZGVZRGltZW5zaW9uKCkgOiBkaW1lbnNpb247XG4gICAgICAgIHRoaXMuY29sb3IgPSBjb2xvciA9PT0gdW5kZWZpbmVkID8gbmV3IG9iZWxpc2suU2lkZUNvbG9yKCkgOiBjb2xvcjtcbiAgICB9O1xuXG4gICAgcC5pbml0UmVjdGFuZ2xlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLncgPSB0aGlzLmRpbWVuc2lvbi55QXhpcztcbiAgICAgICAgdGhpcy5oID0gdGhpcy5kaW1lbnNpb24uekF4aXMgKyB0aGlzLmRpbWVuc2lvbi55QXhpcyAvIDI7XG5cbiAgICAgICAgLy8gdGhlIG1hdHJpeCBvZmZzZXQgYmV0d2VlbiB0aGUgYml0bWFwIGFuZCB0aGUgM2QgcGl4ZWwgY29vcmRpbmF0ZSBaRVJPIHBvaW50XG4gICAgICAgIHRoaXMubWF0cml4ID0gbmV3IG9iZWxpc2suTWF0cml4KCk7XG4gICAgICAgIHRoaXMubWF0cml4LnR4ID0gLXRoaXMuZGltZW5zaW9uLnlBeGlzICsgMjtcbiAgICAgICAgdGhpcy5tYXRyaXgudHkgPSAtdGhpcy5kaW1lbnNpb24uekF4aXM7XG4gICAgfTtcblxuICAgIHAuaW5pdEJpdG1hcERhdGEgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuYml0bWFwRGF0YSA9IG5ldyBvYmVsaXNrLkJpdG1hcERhdGEodGhpcy53LCB0aGlzLmgsIHRoaXMudXNlRGVmYXVsdENhbnZhcyk7XG4gICAgfTtcbiAgICBwLnJlbmRlckJpdG1hcERhdGFGb3JDYW52YXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuYml0bWFwRGF0YS5jb250ZXh0LnB1dEltYWdlRGF0YSh0aGlzLmJpdG1hcERhdGEuaW1hZ2VEYXRhLCAwLCAwKTtcbiAgICAgICAgdGhpcy5jYW52YXMgPSB0aGlzLmJpdG1hcERhdGEuY2FudmFzO1xuICAgIH07XG5cbiAgICBwLmJ1aWxkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgeE9mZnNldElubmVyLCB5T2Zmc2V0SW5uZXIsIHhPZmZzZXRPdXQsIHlPZmZzZXRPdXQsIGksIGosIGJvcmRlckNvbG9yO1xuICAgICAgICB4T2Zmc2V0SW5uZXIgPSAwO1xuICAgICAgICB5T2Zmc2V0SW5uZXIgPSB0aGlzLmggLSB0aGlzLmRpbWVuc2lvbi56QXhpcyAtIDE7XG4gICAgICAgIHhPZmZzZXRPdXQgPSB0aGlzLmRpbWVuc2lvbi55QXhpcyAtIDE7XG4gICAgICAgIHlPZmZzZXRPdXQgPSB0aGlzLmRpbWVuc2lvbi56QXhpcztcbiAgICAgICAgYm9yZGVyQ29sb3IgPSB0aGlzLmJvcmRlciA/IHRoaXMuY29sb3IuYm9yZGVyIDogdGhpcy5jb2xvci5pbm5lcjtcblxuICAgICAgICAvL3kgYXhpc1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5kaW1lbnNpb24ueUF4aXM7IGkgKz0gMSkge1xuICAgICAgICAgICAgdGhpcy5iaXRtYXBEYXRhLnNldFBpeGVsKHhPZmZzZXRJbm5lciArIGksIHlPZmZzZXRJbm5lciAtIE1hdGguZmxvb3IoaSAvIDIpLCBib3JkZXJDb2xvcik7XG4gICAgICAgICAgICB0aGlzLmJpdG1hcERhdGEuc2V0UGl4ZWwoeE9mZnNldE91dCAtIGksIHlPZmZzZXRPdXQgKyBNYXRoLmZsb29yKGkgLyAyKSwgYm9yZGVyQ29sb3IpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy96IGF4aXNcbiAgICAgICAgZm9yIChqID0gMDsgaiA8IHRoaXMuZGltZW5zaW9uLnpBeGlzOyBqICs9IDEpIHtcbiAgICAgICAgICAgIHRoaXMuYml0bWFwRGF0YS5zZXRQaXhlbCh4T2Zmc2V0SW5uZXIsIHlPZmZzZXRJbm5lciArIGosIGJvcmRlckNvbG9yKTtcbiAgICAgICAgICAgIHRoaXMuYml0bWFwRGF0YS5zZXRQaXhlbCh4T2Zmc2V0T3V0LCB5T2Zmc2V0T3V0IC0gaiwgYm9yZGVyQ29sb3IpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9maWxsIGFuIHBpeGVsIGdyYXBoaWMgZW5jbG9zZWRcbiAgICAgICAgdGhpcy5iaXRtYXBEYXRhLmZsb29kRmlsbChNYXRoLmZsb29yKHRoaXMudyAvIDIpLCBNYXRoLmZsb29yKHRoaXMuaCAvIDIpLCB0aGlzLmNvbG9yLmlubmVyKTtcbiAgICB9O1xuXG4gICAgLy8gcHVibGljIG1ldGhvZHNcbiAgICBwLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gXCJbU2lkZVldXCI7XG4gICAgfTtcblxuICAgIG9iZWxpc2suU2lkZVkgPSBTaWRlWTtcbn0ob2JlbGlzaykpO1xuXG4vKmdsb2JhbCBvYmVsaXNrOnRydWUqL1xuXG4vKlxuICogU2xvcGUgRWFzdFxuICovXG5cbihmdW5jdGlvbiAob2JlbGlzaykge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgdmFyIFNsb3BlRWFzdCwgcDtcbiAgICBTbG9wZUVhc3QgPSBmdW5jdGlvbiAoZGltZW5zaW9uLCBjb2xvciwgYm9yZGVyLCB1c2VEZWZhdWx0Q2FudmFzKSB7XG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZShkaW1lbnNpb24sIGNvbG9yLCBib3JkZXIsIHVzZURlZmF1bHRDYW52YXMpO1xuICAgIH07XG4gICAgcCA9IFNsb3BlRWFzdC5wcm90b3R5cGUgPSBuZXcgb2JlbGlzay5BYnN0cmFjdFByaW1pdGl2ZSgpO1xuXG4gICAgLy8gY29uc3RydWN0b3JcbiAgICBwLmluaXRpYWxpemUgPSBmdW5jdGlvbiAoZGltZW5zaW9uLCBjb2xvciwgYm9yZGVyLCB1c2VEZWZhdWx0Q2FudmFzKSB7XG4gICAgICAgIHRoaXMuaW5pdFJlbmRlcihkaW1lbnNpb24sIGNvbG9yLCBib3JkZXIsIHVzZURlZmF1bHRDYW52YXMpO1xuICAgICAgICB0aGlzLmluaXRSZWN0YW5nbGUoKTtcbiAgICAgICAgdGhpcy5pbml0Qml0bWFwRGF0YSgpO1xuICAgICAgICB0aGlzLmJ1aWxkKCk7XG4gICAgICAgIHRoaXMucmVuZGVyQml0bWFwRGF0YUZvckNhbnZhcygpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgLy8gcHJpdmF0ZSBtZXRob2RcbiAgICBwLmluaXRSZW5kZXIgPSBmdW5jdGlvbiAoZGltZW5zaW9uLCBjb2xvciwgYm9yZGVyLCB1c2VEZWZhdWx0Q2FudmFzKSB7XG4gICAgICAgIHRoaXMudXNlRGVmYXVsdENhbnZhcyA9IHVzZURlZmF1bHRDYW52YXMgfHwgZmFsc2U7XG4gICAgICAgIHRoaXMuYm9yZGVyID0gYm9yZGVyIHx8IGJvcmRlciA9PT0gdW5kZWZpbmVkO1xuICAgICAgICB0aGlzLmRpbWVuc2lvbiA9IGRpbWVuc2lvbiA9PT0gdW5kZWZpbmVkID8gbmV3IG9iZWxpc2suU2xvcGVEaW1lbnNpb24oKSA6IGRpbWVuc2lvbjtcbiAgICAgICAgdGhpcy5jb2xvciA9IGNvbG9yID09PSB1bmRlZmluZWQgPyBuZXcgb2JlbGlzay5TbG9wZUNvbG9yKCkgOiBjb2xvcjtcbiAgICB9O1xuXG4gICAgcC5pbml0UmVjdGFuZ2xlID0gZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIHRoaXMudyA9IHRoaXMuZGltZW5zaW9uLnhBeGlzICsgdGhpcy5kaW1lbnNpb24ueUF4aXM7XG4gICAgICAgIHRoaXMuaCA9IHRoaXMuZGltZW5zaW9uLnhBeGlzICogMiArIHRoaXMuZGltZW5zaW9uLnlBeGlzIC8gMjtcblxuICAgICAgICAvLyAyMi42IGRlZ3JlZXMgaW1wbGVtZW50YXRpb25cbiAgICAgICAgdGhpcy53IC09IDI7XG4gICAgICAgIHRoaXMuaCAtPSAzO1xuXG4gICAgICAgIC8vIHRoZSBtYXRyaXggb2Zmc2V0IGJldHdlZW4gdGhlIGJpdG1hcCBhbmQgdGhlIDNkIHBpeGVsIGNvb3JkaW5hdGUgWkVSTyBwb2ludFxuICAgICAgICB0aGlzLm1hdHJpeCA9IG5ldyBvYmVsaXNrLk1hdHJpeCgpO1xuICAgICAgICB0aGlzLm1hdHJpeC50eCA9IC0odGhpcy5kaW1lbnNpb24ueUF4aXMgLSAyKTtcbiAgICAgICAgdGhpcy5tYXRyaXgudHkgPSAtKHRoaXMuZGltZW5zaW9uLnhBeGlzICogMyAvIDIgLSAyKTtcbiAgICB9O1xuXG4gICAgcC5pbml0Qml0bWFwRGF0YSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5iaXRtYXBEYXRhID0gbmV3IG9iZWxpc2suQml0bWFwRGF0YSh0aGlzLncsIHRoaXMuaCwgdGhpcy51c2VEZWZhdWx0Q2FudmFzKTtcbiAgICB9O1xuICAgIHAucmVuZGVyQml0bWFwRGF0YUZvckNhbnZhcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5iaXRtYXBEYXRhLmNvbnRleHQucHV0SW1hZ2VEYXRhKHRoaXMuYml0bWFwRGF0YS5pbWFnZURhdGEsIDAsIDApO1xuICAgICAgICB0aGlzLmNhbnZhcyA9IHRoaXMuYml0bWFwRGF0YS5jYW52YXM7XG4gICAgfTtcblxuICAgIHAuYnVpbGQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBjb2xvckJvcmRlckxlZnQsIGNvbG9yQm9yZGVyUmlnaHQsXG4gICAgICAgICAgICBpLCBqLCBrLCBtLCBuO1xuXG4gICAgICAgIGNvbG9yQm9yZGVyTGVmdCA9IHRoaXMuYm9yZGVyID8gdGhpcy5jb2xvci5ib3JkZXIgOiB0aGlzLmNvbG9yLmxlZnQ7XG4gICAgICAgIGNvbG9yQm9yZGVyUmlnaHQgPSB0aGlzLmJvcmRlciA/IHRoaXMuY29sb3IuYm9yZGVyIDogdGhpcy5jb2xvci5yaWdodFNsb3BlO1xuXG4gICAgICAgIC8vIHkgYXhpc1xuICAgICAgICBmb3IgKGogPSAwOyBqIDwgdGhpcy5kaW1lbnNpb24ueUF4aXM7IGogKz0gMSkge1xuICAgICAgICAgICAgdGhpcy5iaXRtYXBEYXRhLnNldFBpeGVsKGosIHRoaXMuZGltZW5zaW9uLnlBeGlzIC8gMiAtIE1hdGguZmxvb3IoaiAvIDIpIC0gMSwgY29sb3JCb3JkZXJSaWdodCk7XG4gICAgICAgICAgICB0aGlzLmJpdG1hcERhdGEuc2V0UGl4ZWwoaiArIHRoaXMuZGltZW5zaW9uLnhBeGlzIC0gMiwgdGhpcy5oIC0gTWF0aC5mbG9vcihqIC8gMikgLSAxLCBjb2xvckJvcmRlclJpZ2h0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHggYXhpc1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5kaW1lbnNpb24ueEF4aXM7IGkgKz0gMSkge1xuICAgICAgICAgICAgdGhpcy5iaXRtYXBEYXRhLnNldFBpeGVsKGksIHRoaXMuaCAtIHRoaXMuZGltZW5zaW9uLnhBeGlzIC8gMiArIE1hdGguZmxvb3IoaSAvIDIpLCBjb2xvckJvcmRlckxlZnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8geiBheGlzXG4gICAgICAgIGZvciAoayA9IHRoaXMuZGltZW5zaW9uLnlBeGlzIC8gMiAtIDE7IGsgPCB0aGlzLmggLSB0aGlzLmRpbWVuc2lvbi54QXhpcyAvIDI7IGsgKz0gMSkge1xuICAgICAgICAgICAgdGhpcy5iaXRtYXBEYXRhLnNldFBpeGVsKDAsIGssIGNvbG9yQm9yZGVyTGVmdCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBzbG90XG4gICAgICAgIGZvciAobSA9IDA7IG0gPCB0aGlzLmRpbWVuc2lvbi54QXhpcyAqIDIgLSAyOyBtICs9IDEpIHtcbiAgICAgICAgICAgIHRoaXMuYml0bWFwRGF0YS5zZXRQaXhlbCh0aGlzLmRpbWVuc2lvbi55QXhpcyAtIDEgKyBNYXRoLmZsb29yKG0gLyAyKSwgbSwgY29sb3JCb3JkZXJSaWdodCk7XG4gICAgICAgICAgICB0aGlzLmJpdG1hcERhdGEuc2V0UGl4ZWwoMSArIE1hdGguZmxvb3IobSAvIDIpLCB0aGlzLmRpbWVuc2lvbi55QXhpcyAvIDIgKyBtIC0gMSwgY29sb3JCb3JkZXJSaWdodCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBmbG9vZCBmaWxsXG4gICAgICAgIHRoaXMuYml0bWFwRGF0YS5mbG9vZEZpbGwodGhpcy5kaW1lbnNpb24ueUF4aXMgLSAyLCAxLCB0aGlzLmNvbG9yLnJpZ2h0U2xvcGUpO1xuICAgICAgICB0aGlzLmJpdG1hcERhdGEuZmxvb2RGaWxsKHRoaXMuZGltZW5zaW9uLnhBeGlzIC0gMywgdGhpcy5oIC0gMywgdGhpcy5jb2xvci5sZWZ0KTtcbiAgICAgICAgLy8gaGFjayBzaW5nbGUgcGl4ZWxcbiAgICAgICAgdGhpcy5iaXRtYXBEYXRhLnNldFBpeGVsKHRoaXMuZGltZW5zaW9uLnhBeGlzIC0gMiwgdGhpcy5oIC0gMiwgdGhpcy5jb2xvci5sZWZ0KTtcblxuICAgICAgICAvLyBoaWdobGlnaHRcbiAgICAgICAgaWYgKHRoaXMuYm9yZGVyKSB7XG4gICAgICAgICAgICBmb3IgKG4gPSAxOyBuIDwgdGhpcy5kaW1lbnNpb24ueEF4aXMgKiAyIC0gMzsgbiArPSAxKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5iaXRtYXBEYXRhLnNldFBpeGVsKDEgKyBNYXRoLmZsb29yKG4gLyAyKSwgdGhpcy5kaW1lbnNpb24ueUF4aXMgLyAyICsgbiAtIDEsIHRoaXMuY29sb3IuYm9yZGVySGlnaGxpZ2h0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBwdWJsaWMgbWV0aG9kc1xuICAgIHAudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBcIltTbG9wZUVhc3RdXCI7XG4gICAgfTtcblxuICAgIG9iZWxpc2suU2xvcGVFYXN0ID0gU2xvcGVFYXN0O1xufShvYmVsaXNrKSk7XG5cbi8qZ2xvYmFsIG9iZWxpc2s6dHJ1ZSovXG5cbi8qXG4gKiBTbG9wZSBOb3J0aFxuICovXG5cbihmdW5jdGlvbiAob2JlbGlzaykge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgdmFyIFNsb3BlTm9ydGgsIHA7XG4gICAgU2xvcGVOb3J0aCA9IGZ1bmN0aW9uIChkaW1lbnNpb24sIGNvbG9yLCBib3JkZXIsIHVzZURlZmF1bHRDYW52YXMpIHtcbiAgICAgICAgdGhpcy5pbml0aWFsaXplKGRpbWVuc2lvbiwgY29sb3IsIGJvcmRlciwgdXNlRGVmYXVsdENhbnZhcyk7XG4gICAgfTtcbiAgICBwID0gU2xvcGVOb3J0aC5wcm90b3R5cGUgPSBuZXcgb2JlbGlzay5BYnN0cmFjdFByaW1pdGl2ZSgpO1xuXG4gICAgLy8gY29uc3RydWN0b3JcbiAgICBwLmluaXRpYWxpemUgPSBmdW5jdGlvbiAoZGltZW5zaW9uLCBjb2xvciwgYm9yZGVyLCB1c2VEZWZhdWx0Q2FudmFzKSB7XG4gICAgICAgIHRoaXMuaW5pdFJlbmRlcihkaW1lbnNpb24sIGNvbG9yLCBib3JkZXIsIHVzZURlZmF1bHRDYW52YXMpO1xuICAgICAgICB0aGlzLmluaXRSZWN0YW5nbGUoKTtcbiAgICAgICAgdGhpcy5pbml0Qml0bWFwRGF0YSgpO1xuICAgICAgICB0aGlzLmJ1aWxkKCk7XG4gICAgICAgIHRoaXMucmVuZGVyQml0bWFwRGF0YUZvckNhbnZhcygpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgLy8gcHJpdmF0ZSBtZXRob2RcbiAgICBwLmluaXRSZW5kZXIgPSBmdW5jdGlvbiAoZGltZW5zaW9uLCBjb2xvciwgYm9yZGVyLCB1c2VEZWZhdWx0Q2FudmFzKSB7XG4gICAgICAgIHRoaXMudXNlRGVmYXVsdENhbnZhcyA9IHVzZURlZmF1bHRDYW52YXMgfHwgZmFsc2U7XG4gICAgICAgIHRoaXMuYm9yZGVyID0gYm9yZGVyIHx8IGJvcmRlciA9PT0gdW5kZWZpbmVkO1xuICAgICAgICB0aGlzLmRpbWVuc2lvbiA9IGRpbWVuc2lvbiA9PT0gdW5kZWZpbmVkID8gbmV3IG9iZWxpc2suU2xvcGVEaW1lbnNpb24oKSA6IGRpbWVuc2lvbjtcbiAgICAgICAgdGhpcy5jb2xvciA9IGNvbG9yID09PSB1bmRlZmluZWQgPyBuZXcgb2JlbGlzay5TbG9wZUNvbG9yKCkgOiBjb2xvcjtcbiAgICB9O1xuXG4gICAgcC5pbml0UmVjdGFuZ2xlID0gZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIHRoaXMudyA9IHRoaXMuZGltZW5zaW9uLnhBeGlzICsgdGhpcy5kaW1lbnNpb24ueUF4aXM7XG4gICAgICAgIHRoaXMuaCA9IHRoaXMuZGltZW5zaW9uLnlBeGlzICogMyAvIDIgKyB0aGlzLmRpbWVuc2lvbi54QXhpcyAvIDI7XG5cbiAgICAgICAgLy8gMjIuNiBkZWdyZWVzIGltcGxlbWVudGF0aW9uXG4gICAgICAgIHRoaXMudyAtPSAyO1xuICAgICAgICB0aGlzLmggLT0gMztcblxuICAgICAgICAvLyB0aGUgbWF0cml4IG9mZnNldCBiZXR3ZWVuIHRoZSBiaXRtYXAgYW5kIHRoZSAzZCBwaXhlbCBjb29yZGluYXRlIFpFUk8gcG9pbnRcbiAgICAgICAgdGhpcy5tYXRyaXggPSBuZXcgb2JlbGlzay5NYXRyaXgoKTtcbiAgICAgICAgdGhpcy5tYXRyaXgudHggPSAtKHRoaXMuZGltZW5zaW9uLnlBeGlzIC0gMik7XG4gICAgICAgIHRoaXMubWF0cml4LnR5ID0gLSh0aGlzLmRpbWVuc2lvbi55QXhpcyAtIDIpO1xuICAgIH07XG5cbiAgICBwLmluaXRCaXRtYXBEYXRhID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmJpdG1hcERhdGEgPSBuZXcgb2JlbGlzay5CaXRtYXBEYXRhKHRoaXMudywgdGhpcy5oLCB0aGlzLnVzZURlZmF1bHRDYW52YXMpO1xuICAgIH07XG4gICAgcC5yZW5kZXJCaXRtYXBEYXRhRm9yQ2FudmFzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmNhbnZhcyA9IHRoaXMuYml0bWFwRGF0YS5jYW52YXM7XG4gICAgfTtcblxuICAgIHAuYnVpbGQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBjb2xvckJvcmRlckxlZnQsIGNvbG9yQm9yZGVyUmlnaHQsIGNvbG9yQm9yZGVySGlnaGxpZ2h0LFxuICAgICAgICAgICAgc2lkZVgsIHBvWCwgY3R4LCBibWQsXG4gICAgICAgICAgICBpLCBqLCBuO1xuXG4gICAgICAgIGNvbG9yQm9yZGVyTGVmdCA9IHRoaXMuYm9yZGVyID8gdGhpcy5jb2xvci5ib3JkZXIgOiB0aGlzLmNvbG9yLmxlZnQ7XG4gICAgICAgIGNvbG9yQm9yZGVyUmlnaHQgPSB0aGlzLmJvcmRlciA/IHRoaXMuY29sb3IuYm9yZGVyIDogdGhpcy5jb2xvci5yaWdodDtcbiAgICAgICAgY29sb3JCb3JkZXJIaWdobGlnaHQgPSB0aGlzLmJvcmRlciA/IHRoaXMuY29sb3IuYm9yZGVySGlnaGxpZ2h0IDogdGhpcy5jb2xvci5sZWZ0O1xuXG4gICAgICAgIHNpZGVYID0gbmV3IG9iZWxpc2suU2lkZVgoXG4gICAgICAgICAgICBuZXcgb2JlbGlzay5TaWRlWERpbWVuc2lvbih0aGlzLmRpbWVuc2lvbi54QXhpcywgdGhpcy5oIC0gdGhpcy5kaW1lbnNpb24ueEF4aXMgLyAyKSxcbiAgICAgICAgICAgIG5ldyBvYmVsaXNrLlNpZGVDb2xvcihjb2xvckJvcmRlckxlZnQsIHRoaXMuY29sb3IubGVmdClcbiAgICAgICAgKTtcblxuICAgICAgICBwb1ggPSBuZXcgb2JlbGlzay5QaXhlbE9iamVjdChzaWRlWCk7XG5cbiAgICAgICAgY3R4ID0gdGhpcy5iaXRtYXBEYXRhLmNvbnRleHQ7XG4gICAgICAgIGN0eC5kcmF3SW1hZ2UocG9YLmNhbnZhcywgcG9YLngsIHBvWC55ICsgdGhpcy5oIC0gdGhpcy5kaW1lbnNpb24ueEF4aXMgLyAyKTtcblxuICAgICAgICBibWQgPSBuZXcgb2JlbGlzay5CaXRtYXBEYXRhKHRoaXMudywgdGhpcy5oKTtcblxuICAgICAgICAvLyBjbG9zZSB0aGUgcGF0aCBmb3IgZmxvb2RmaWxsXG4gICAgICAgIGZvciAoaSA9IHRoaXMuaCAtIHRoaXMuZGltZW5zaW9uLnlBeGlzICogMyAvIDIgKyAyOyBpIDwgdGhpcy5oOyBpICs9IDEpIHtcbiAgICAgICAgICAgIGJtZC5zZXRQaXhlbCh0aGlzLmRpbWVuc2lvbi54QXhpcyAtIDEsIGksIGNvbG9yQm9yZGVyUmlnaHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8geSBheGlzXG4gICAgICAgIGZvciAoaiA9IDE7IGogPCB0aGlzLmRpbWVuc2lvbi55QXhpczsgaiArPSAxKSB7XG4gICAgICAgICAgICBibWQuc2V0UGl4ZWwodGhpcy5kaW1lbnNpb24ueEF4aXMgKyBqIC0gMiwgdGhpcy5oIC0gTWF0aC5mbG9vcihqIC8gMikgLSAxLCBjb2xvckJvcmRlclJpZ2h0KTtcbiAgICAgICAgICAgIGJtZC5zZXRQaXhlbCh0aGlzLmRpbWVuc2lvbi54QXhpcyArIGogLSAyLCB0aGlzLmRpbWVuc2lvbi54QXhpcyAvIDIgLSAyICsgaiwgY29sb3JCb3JkZXJSaWdodCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBmbG9vZCBmaWxsXG4gICAgICAgIGJtZC5mbG9vZEZpbGwodGhpcy5kaW1lbnNpb24ueEF4aXMgKyAxLCB0aGlzLmggLSAzLCB0aGlzLmNvbG9yLnJpZ2h0KTtcblxuICAgICAgICAvL2hpZ2hsaWdodFxuICAgICAgICBmb3IgKG4gPSB0aGlzLmRpbWVuc2lvbi54QXhpcyAvIDI7IG4gPCB0aGlzLmggLSAxOyBuICs9IDEpIHtcbiAgICAgICAgICAgIGJtZC5zZXRQaXhlbCh0aGlzLmRpbWVuc2lvbi54QXhpcyAtIDEsIG4sIHRoaXMuY29sb3IucmlnaHQpO1xuICAgICAgICAgICAgYm1kLnNldFBpeGVsKHRoaXMuZGltZW5zaW9uLnhBeGlzIC0gMiwgbiwgY29sb3JCb3JkZXJIaWdobGlnaHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgYm1kLmNvbnRleHQucHV0SW1hZ2VEYXRhKGJtZC5pbWFnZURhdGEsIDAsIDApO1xuICAgICAgICBjdHguZHJhd0ltYWdlKGJtZC5jYW52YXMsIDAsIDApO1xuICAgIH07XG5cbiAgICAvLyBwdWJsaWMgbWV0aG9kc1xuICAgIHAudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBcIltTbG9wZU5vcnRoXVwiO1xuICAgIH07XG5cbiAgICBvYmVsaXNrLlNsb3BlTm9ydGggPSBTbG9wZU5vcnRoO1xufShvYmVsaXNrKSk7XG5cbi8qZ2xvYmFsIG9iZWxpc2s6dHJ1ZSovXG5cbi8qXG4gKiBTbG9wZSBTb3V0aFxuICovXG5cbihmdW5jdGlvbiAob2JlbGlzaykge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgdmFyIFNsb3BlU291dGgsIHA7XG4gICAgU2xvcGVTb3V0aCA9IGZ1bmN0aW9uIChkaW1lbnNpb24sIGNvbG9yLCBib3JkZXIsIHVzZURlZmF1bHRDYW52YXMpIHtcbiAgICAgICAgdGhpcy5pbml0aWFsaXplKGRpbWVuc2lvbiwgY29sb3IsIGJvcmRlciwgdXNlRGVmYXVsdENhbnZhcyk7XG4gICAgfTtcbiAgICBwID0gU2xvcGVTb3V0aC5wcm90b3R5cGUgPSBuZXcgb2JlbGlzay5BYnN0cmFjdFByaW1pdGl2ZSgpO1xuXG4gICAgLy8gY29uc3RydWN0b3JcbiAgICBwLmluaXRpYWxpemUgPSBmdW5jdGlvbiAoZGltZW5zaW9uLCBjb2xvciwgYm9yZGVyLCB1c2VEZWZhdWx0Q2FudmFzKSB7XG4gICAgICAgIHRoaXMuaW5pdFJlbmRlcihkaW1lbnNpb24sIGNvbG9yLCBib3JkZXIsIHVzZURlZmF1bHRDYW52YXMpO1xuICAgICAgICB0aGlzLmluaXRSZWN0YW5nbGUoKTtcbiAgICAgICAgdGhpcy5pbml0Qml0bWFwRGF0YSgpO1xuICAgICAgICB0aGlzLmJ1aWxkKCk7XG4gICAgICAgIHRoaXMucmVuZGVyQml0bWFwRGF0YUZvckNhbnZhcygpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgLy8gcHJpdmF0ZSBtZXRob2RcbiAgICBwLmluaXRSZW5kZXIgPSBmdW5jdGlvbiAoZGltZW5zaW9uLCBjb2xvciwgYm9yZGVyLCB1c2VEZWZhdWx0Q2FudmFzKSB7XG4gICAgICAgIHRoaXMudXNlRGVmYXVsdENhbnZhcyA9IHVzZURlZmF1bHRDYW52YXMgfHwgZmFsc2U7XG4gICAgICAgIHRoaXMuYm9yZGVyID0gYm9yZGVyIHx8IGJvcmRlciA9PT0gdW5kZWZpbmVkO1xuICAgICAgICB0aGlzLmRpbWVuc2lvbiA9IGRpbWVuc2lvbiA9PT0gdW5kZWZpbmVkID8gbmV3IG9iZWxpc2suU2xvcGVEaW1lbnNpb24oKSA6IGRpbWVuc2lvbjtcbiAgICAgICAgdGhpcy5jb2xvciA9IGNvbG9yID09PSB1bmRlZmluZWQgPyBuZXcgb2JlbGlzay5TbG9wZUNvbG9yKCkgOiBjb2xvcjtcbiAgICB9O1xuXG4gICAgcC5pbml0UmVjdGFuZ2xlID0gZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIHRoaXMudyA9IHRoaXMuZGltZW5zaW9uLnhBeGlzICsgdGhpcy5kaW1lbnNpb24ueUF4aXM7XG4gICAgICAgIHRoaXMuaCA9IHRoaXMuZGltZW5zaW9uLnhBeGlzIC8gMiArIHRoaXMuZGltZW5zaW9uLnlBeGlzICogMjtcblxuICAgICAgICAvLyAyMi42IGRlZ3JlZXMgaW1wbGVtZW50YXRpb25cbiAgICAgICAgdGhpcy53IC09IDI7XG4gICAgICAgIHRoaXMuaCAtPSAzO1xuXG4gICAgICAgIC8vIHRoZSBtYXRyaXggb2Zmc2V0IGJldHdlZW4gdGhlIGJpdG1hcCBhbmQgdGhlIDNkIHBpeGVsIGNvb3JkaW5hdGUgWkVSTyBwb2ludFxuICAgICAgICB0aGlzLm1hdHJpeCA9IG5ldyBvYmVsaXNrLk1hdHJpeCgpO1xuICAgICAgICB0aGlzLm1hdHJpeC50eCA9IC0odGhpcy5kaW1lbnNpb24ueUF4aXMgLSAyKTtcbiAgICAgICAgdGhpcy5tYXRyaXgudHkgPSAtKHRoaXMuZGltZW5zaW9uLnlBeGlzICogMyAvIDIgLSAyKTtcbiAgICB9O1xuXG4gICAgcC5pbml0Qml0bWFwRGF0YSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5iaXRtYXBEYXRhID0gbmV3IG9iZWxpc2suQml0bWFwRGF0YSh0aGlzLncsIHRoaXMuaCwgdGhpcy51c2VEZWZhdWx0Q2FudmFzKTtcbiAgICB9O1xuICAgIHAucmVuZGVyQml0bWFwRGF0YUZvckNhbnZhcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5iaXRtYXBEYXRhLmNvbnRleHQucHV0SW1hZ2VEYXRhKHRoaXMuYml0bWFwRGF0YS5pbWFnZURhdGEsIDAsIDApO1xuICAgICAgICB0aGlzLmNhbnZhcyA9IHRoaXMuYml0bWFwRGF0YS5jYW52YXM7XG4gICAgfTtcblxuICAgIHAuYnVpbGQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBjb2xvckJvcmRlckxlZnQsIGNvbG9yQm9yZGVyUmlnaHQsXG4gICAgICAgICAgICBpLCBqLCBrLCBtLCBuO1xuXG4gICAgICAgIGNvbG9yQm9yZGVyTGVmdCA9IHRoaXMuYm9yZGVyID8gdGhpcy5jb2xvci5ib3JkZXIgOiB0aGlzLmNvbG9yLmxlZnRTbG9wZTtcbiAgICAgICAgY29sb3JCb3JkZXJSaWdodCA9IHRoaXMuYm9yZGVyID8gdGhpcy5jb2xvci5ib3JkZXIgOiB0aGlzLmNvbG9yLnJpZ2h0O1xuXG4gICAgICAgIC8vIHggYXhpc1xuICAgICAgICBmb3IgKGogPSAwOyBqIDwgdGhpcy5kaW1lbnNpb24ueEF4aXM7IGogKz0gMSkge1xuICAgICAgICAgICAgdGhpcy5iaXRtYXBEYXRhLnNldFBpeGVsKGosIHRoaXMuZGltZW5zaW9uLnlBeGlzICogMiArIE1hdGguZmxvb3IoaiAvIDIpIC0gMywgY29sb3JCb3JkZXJMZWZ0KTtcbiAgICAgICAgICAgIHRoaXMuYml0bWFwRGF0YS5zZXRQaXhlbChqICsgdGhpcy5kaW1lbnNpb24ueUF4aXMgLSAyLCBNYXRoLmZsb29yKGogLyAyKSwgY29sb3JCb3JkZXJMZWZ0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHkgYXhpc1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5kaW1lbnNpb24ueUF4aXM7IGkgKz0gMSkge1xuICAgICAgICAgICAgdGhpcy5iaXRtYXBEYXRhLnNldFBpeGVsKHRoaXMuZGltZW5zaW9uLnhBeGlzIC0gMiArIGksIHRoaXMuaCAtIE1hdGguZmxvb3IoaSAvIDIpIC0gMSwgY29sb3JCb3JkZXJSaWdodCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyB6IGF4aXNcbiAgICAgICAgZm9yIChrID0gdGhpcy5kaW1lbnNpb24ueEF4aXMgLyAyIC0gMTsgayA8IHRoaXMuaCAtIHRoaXMuZGltZW5zaW9uLnlBeGlzIC8gMjsgayArPSAxKSB7XG4gICAgICAgICAgICB0aGlzLmJpdG1hcERhdGEuc2V0UGl4ZWwodGhpcy53IC0gMSwgaywgY29sb3JCb3JkZXJSaWdodCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBzbG90XG4gICAgICAgIGZvciAobSA9IDA7IG0gPCB0aGlzLmRpbWVuc2lvbi55QXhpcyAqIDIgLSAyOyBtICs9IDEpIHtcbiAgICAgICAgICAgIHRoaXMuYml0bWFwRGF0YS5zZXRQaXhlbChNYXRoLmZsb29yKG0gLyAyKSwgdGhpcy5kaW1lbnNpb24ueUF4aXMgKiAyIC0gbSAtIDMsIGNvbG9yQm9yZGVyTGVmdCk7XG4gICAgICAgICAgICB0aGlzLmJpdG1hcERhdGEuc2V0UGl4ZWwodGhpcy5kaW1lbnNpb24ueEF4aXMgLSAyICsgTWF0aC5mbG9vcihtIC8gMiksIHRoaXMuaCAtIG0gLSAxLCBjb2xvckJvcmRlckxlZnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gZmxvb2QgZmlsbFxuICAgICAgICB0aGlzLmJpdG1hcERhdGEuZmxvb2RGaWxsKHRoaXMuZGltZW5zaW9uLnlBeGlzIC0gMSwgMSwgdGhpcy5jb2xvci5sZWZ0U2xvcGUpO1xuICAgICAgICB0aGlzLmJpdG1hcERhdGEuZmxvb2RGaWxsKHRoaXMuZGltZW5zaW9uLnhBeGlzLCB0aGlzLmggLSAzLCB0aGlzLmNvbG9yLnJpZ2h0KTtcbiAgICAgICAgLy8gaGFjayBzaW5nbGUgcGl4ZWxcbiAgICAgICAgdGhpcy5iaXRtYXBEYXRhLnNldFBpeGVsKHRoaXMuZGltZW5zaW9uLnhBeGlzIC0gMSwgdGhpcy5oIC0gMiwgdGhpcy5jb2xvci5yaWdodCk7XG5cbiAgICAgICAgLy8gaGlnaGxpZ2h0XG4gICAgICAgIGlmICh0aGlzLmJvcmRlcikge1xuICAgICAgICAgICAgZm9yIChuID0gMTsgbiA8IHRoaXMuZGltZW5zaW9uLnlBeGlzICogMiAtIDM7IG4gKz0gMSkge1xuICAgICAgICAgICAgICAgIHRoaXMuYml0bWFwRGF0YS5zZXRQaXhlbCh0aGlzLmRpbWVuc2lvbi54QXhpcyAtIDIgKyBNYXRoLmZsb29yKG4gLyAyKSwgdGhpcy5oIC0gbiAtIDEsIHRoaXMuY29sb3IuYm9yZGVySGlnaGxpZ2h0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBwdWJsaWMgbWV0aG9kc1xuICAgIHAudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBcIltTbG9wZVNvdXRoXVwiO1xuICAgIH07XG5cbiAgICBvYmVsaXNrLlNsb3BlU291dGggPSBTbG9wZVNvdXRoO1xufShvYmVsaXNrKSk7XG5cbi8qZ2xvYmFsIG9iZWxpc2s6dHJ1ZSovXG5cbi8qXG4gKiBTbG9wZSBXZXN0XG4gKi9cblxuKGZ1bmN0aW9uIChvYmVsaXNrKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICB2YXIgU2xvcGVXZXN0LCBwO1xuICAgIFNsb3BlV2VzdCA9IGZ1bmN0aW9uIChkaW1lbnNpb24sIGNvbG9yLCBib3JkZXIsIHVzZURlZmF1bHRDYW52YXMpIHtcbiAgICAgICAgdGhpcy5pbml0aWFsaXplKGRpbWVuc2lvbiwgY29sb3IsIGJvcmRlciwgdXNlRGVmYXVsdENhbnZhcyk7XG4gICAgfTtcbiAgICBwID0gU2xvcGVXZXN0LnByb3RvdHlwZSA9IG5ldyBvYmVsaXNrLkFic3RyYWN0UHJpbWl0aXZlKCk7XG5cbiAgICAvLyBjb25zdHJ1Y3RvclxuICAgIHAuaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uIChkaW1lbnNpb24sIGNvbG9yLCBib3JkZXIsIHVzZURlZmF1bHRDYW52YXMpIHtcbiAgICAgICAgdGhpcy5pbml0UmVuZGVyKGRpbWVuc2lvbiwgY29sb3IsIGJvcmRlciwgdXNlRGVmYXVsdENhbnZhcyk7XG4gICAgICAgIHRoaXMuaW5pdFJlY3RhbmdsZSgpO1xuICAgICAgICB0aGlzLmluaXRCaXRtYXBEYXRhKCk7XG4gICAgICAgIHRoaXMuYnVpbGQoKTtcbiAgICAgICAgdGhpcy5yZW5kZXJCaXRtYXBEYXRhRm9yQ2FudmFzKCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICAvLyBwcml2YXRlIG1ldGhvZFxuICAgIHAuaW5pdFJlbmRlciA9IGZ1bmN0aW9uIChkaW1lbnNpb24sIGNvbG9yLCBib3JkZXIsIHVzZURlZmF1bHRDYW52YXMpIHtcbiAgICAgICAgdGhpcy51c2VEZWZhdWx0Q2FudmFzID0gdXNlRGVmYXVsdENhbnZhcyB8fCBmYWxzZTtcbiAgICAgICAgdGhpcy5ib3JkZXIgPSBib3JkZXIgfHwgYm9yZGVyID09PSB1bmRlZmluZWQ7XG4gICAgICAgIHRoaXMuZGltZW5zaW9uID0gZGltZW5zaW9uID09PSB1bmRlZmluZWQgPyBuZXcgb2JlbGlzay5TbG9wZURpbWVuc2lvbigpIDogZGltZW5zaW9uO1xuICAgICAgICB0aGlzLmNvbG9yID0gY29sb3IgPT09IHVuZGVmaW5lZCA/IG5ldyBvYmVsaXNrLlNsb3BlQ29sb3IoKSA6IGNvbG9yO1xuICAgIH07XG5cbiAgICBwLmluaXRSZWN0YW5nbGUgPSBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgdGhpcy53ID0gdGhpcy5kaW1lbnNpb24ueEF4aXMgKyB0aGlzLmRpbWVuc2lvbi55QXhpcztcbiAgICAgICAgdGhpcy5oID0gdGhpcy5kaW1lbnNpb24ueEF4aXMgKiAzIC8gMiArIHRoaXMuZGltZW5zaW9uLnlBeGlzIC8gMjtcblxuICAgICAgICAvLyAyMi42IGRlZ3JlZXMgaW1wbGVtZW50YXRpb25cbiAgICAgICAgdGhpcy53IC09IDI7XG4gICAgICAgIHRoaXMuaCAtPSAzO1xuXG4gICAgICAgIC8vIHRoZSBtYXRyaXggb2Zmc2V0IGJldHdlZW4gdGhlIGJpdG1hcCBhbmQgdGhlIDNkIHBpeGVsIGNvb3JkaW5hdGUgWkVSTyBwb2ludFxuICAgICAgICB0aGlzLm1hdHJpeCA9IG5ldyBvYmVsaXNrLk1hdHJpeCgpO1xuICAgICAgICB0aGlzLm1hdHJpeC50eCA9IC0odGhpcy5kaW1lbnNpb24ueUF4aXMgLSAyKTtcbiAgICAgICAgdGhpcy5tYXRyaXgudHkgPSAtKHRoaXMuZGltZW5zaW9uLnhBeGlzIC0gMik7XG4gICAgfTtcblxuICAgIHAuaW5pdEJpdG1hcERhdGEgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuYml0bWFwRGF0YSA9IG5ldyBvYmVsaXNrLkJpdG1hcERhdGEodGhpcy53LCB0aGlzLmgsIHRoaXMudXNlRGVmYXVsdENhbnZhcyk7XG4gICAgfTtcbiAgICBwLnJlbmRlckJpdG1hcERhdGFGb3JDYW52YXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuY2FudmFzID0gdGhpcy5iaXRtYXBEYXRhLmNhbnZhcztcbiAgICB9O1xuXG4gICAgcC5idWlsZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGNvbG9yQm9yZGVyTGVmdCwgY29sb3JCb3JkZXJSaWdodCwgY29sb3JCb3JkZXJIaWdobGlnaHQsXG4gICAgICAgICAgICBzaWRlWSwgcG9ZLCBjdHgsIGJtZCxcbiAgICAgICAgICAgIGksIGosIG47XG5cbiAgICAgICAgY29sb3JCb3JkZXJMZWZ0ID0gdGhpcy5ib3JkZXIgPyB0aGlzLmNvbG9yLmJvcmRlciA6IHRoaXMuY29sb3IubGVmdDtcbiAgICAgICAgY29sb3JCb3JkZXJSaWdodCA9IHRoaXMuYm9yZGVyID8gdGhpcy5jb2xvci5ib3JkZXIgOiB0aGlzLmNvbG9yLnJpZ2h0O1xuICAgICAgICBjb2xvckJvcmRlckhpZ2hsaWdodCA9IHRoaXMuYm9yZGVyID8gdGhpcy5jb2xvci5ib3JkZXJIaWdobGlnaHQgOiB0aGlzLmNvbG9yLmxlZnQ7XG5cbiAgICAgICAgc2lkZVkgPSBuZXcgb2JlbGlzay5TaWRlWShcbiAgICAgICAgICAgIG5ldyBvYmVsaXNrLlNpZGVZRGltZW5zaW9uKHRoaXMuZGltZW5zaW9uLnlBeGlzLCB0aGlzLmggLSB0aGlzLmRpbWVuc2lvbi55QXhpcyAvIDIpLFxuICAgICAgICAgICAgbmV3IG9iZWxpc2suU2lkZUNvbG9yKGNvbG9yQm9yZGVyUmlnaHQsIHRoaXMuY29sb3IucmlnaHQpXG4gICAgICAgICk7XG5cbiAgICAgICAgcG9ZID0gbmV3IG9iZWxpc2suUGl4ZWxPYmplY3Qoc2lkZVkpO1xuXG4gICAgICAgIGN0eCA9IHRoaXMuYml0bWFwRGF0YS5jb250ZXh0O1xuICAgICAgICBjdHguZHJhd0ltYWdlKHBvWS5jYW52YXMsIHBvWS54ICsgdGhpcy53IC0gMiwgcG9ZLnkgKyB0aGlzLmggLSB0aGlzLmRpbWVuc2lvbi55QXhpcyAvIDIpO1xuXG4gICAgICAgIGJtZCA9IG5ldyBvYmVsaXNrLkJpdG1hcERhdGEodGhpcy53LCB0aGlzLmgpO1xuXG4gICAgICAgIC8vIGNsb3NlIHRoZSBwYXRoIGZvciBmbG9vZGZpbGxcbiAgICAgICAgZm9yIChpID0gdGhpcy5oIC0gdGhpcy5kaW1lbnNpb24ueEF4aXMgKiAzIC8gMiArIDI7IGkgPCB0aGlzLmg7IGkgKz0gMSkge1xuICAgICAgICAgICAgYm1kLnNldFBpeGVsKHRoaXMuZGltZW5zaW9uLnhBeGlzIC0gMiwgaSwgY29sb3JCb3JkZXJMZWZ0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8veCBheGlzXG4gICAgICAgIGZvciAoaiA9IDA7IGogPCB0aGlzLmRpbWVuc2lvbi54QXhpcyAtIDE7IGogKz0gMSkge1xuICAgICAgICAgICAgYm1kLnNldFBpeGVsKGosIHRoaXMuZGltZW5zaW9uLnhBeGlzICsgdGhpcy5kaW1lbnNpb24ueUF4aXMgLyAyIC0gMyArIE1hdGguZmxvb3IoaiAvIDIpLCBjb2xvckJvcmRlckxlZnQpO1xuICAgICAgICAgICAgYm1kLnNldFBpeGVsKGosIHRoaXMuZGltZW5zaW9uLnhBeGlzICsgdGhpcy5kaW1lbnNpb24ueUF4aXMgLyAyIC0gMyAtIGosIGNvbG9yQm9yZGVyTGVmdCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBmbG9vZCBmaWxsXG4gICAgICAgIGJtZC5mbG9vZEZpbGwodGhpcy5kaW1lbnNpb24ueEF4aXMgLSAzLCB0aGlzLmggLSAzLCB0aGlzLmNvbG9yLmxlZnQpO1xuXG4gICAgICAgIC8vaGlnaGxpZ2h0XG4gICAgICAgIGZvciAobiA9IHRoaXMuZGltZW5zaW9uLnlBeGlzIC8gMjsgbiA8IHRoaXMuaCAtIDE7IG4gKz0gMSkge1xuICAgICAgICAgICAgYm1kLnNldFBpeGVsKHRoaXMuZGltZW5zaW9uLnhBeGlzIC0gMiwgbiwgY29sb3JCb3JkZXJIaWdobGlnaHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgYm1kLmNvbnRleHQucHV0SW1hZ2VEYXRhKGJtZC5pbWFnZURhdGEsIDAsIDApO1xuICAgICAgICBjdHguZHJhd0ltYWdlKGJtZC5jYW52YXMsIDAsIDApO1xuICAgIH07XG5cbiAgICAvLyBwdWJsaWMgbWV0aG9kc1xuICAgIHAudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBcIltTbG9wZVdlc3RdXCI7XG4gICAgfTtcblxuICAgIG9iZWxpc2suU2xvcGVXZXN0ID0gU2xvcGVXZXN0O1xufShvYmVsaXNrKSk7XG5cbi8qZ2xvYmFsIG9iZWxpc2s6dHJ1ZSwgZG9jdW1lbnQ6dHJ1ZSovXG5cbi8qXG4gKiBDYW52YXNNYW5hZ2VyXG4gKi9cblxuKGZ1bmN0aW9uIChvYmVsaXNrLCBkb2N1bWVudCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgdmFyIENhbnZhc01hbmFnZXIsIHA7XG4gICAgQ2FudmFzTWFuYWdlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDb2xvckdlb20gaXMgYSBzdGF0aWMgQ2xhc3MsIGNhbm5vdCBiZSBpbnN0YW5jZWQuJyk7XG4gICAgfTtcbiAgICBwID0gQ2FudmFzTWFuYWdlcjtcblxuICAgIC8vIHB1YmxpYyBwcm9wZXJ0aWVzXG4gICAgcC5kZWZhdWx0Q2FudmFzID0gbnVsbDtcblxuICAgIC8vIHB1YmxpYyBtZXRob2RzXG4gICAgcC5nZXREZWZhdWx0Q2FudmFzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBwLmRlZmF1bHRDYW52YXMgPSBwLmRlZmF1bHRDYW52YXMgfHwgZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgICAgIHJldHVybiBwLmRlZmF1bHRDYW52YXM7XG4gICAgfTtcblxuICAgIHAuZ2V0TmV3Q2FudmFzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgfTtcblxuICAgIHAudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBcIltDYW52YXNNYW5hZ2VyXVwiO1xuICAgIH07XG5cbiAgICBvYmVsaXNrLkNhbnZhc01hbmFnZXIgPSBDYW52YXNNYW5hZ2VyO1xufShvYmVsaXNrLCBkb2N1bWVudCkpO1xuXG4vKmdsb2JhbCBvYmVsaXNrOnRydWUqL1xuXG4vKlxuICogQ2FudmFzVG9vbFxuICovXG5cbihmdW5jdGlvbiAob2JlbGlzaykge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgdmFyIENhbnZhc1Rvb2wsIHA7XG5cbiAgICBDYW52YXNUb29sID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NhbnZhc1Rvb2wgaXMgYSBzdGF0aWMgQ2xhc3MsIGNhbm5vdCBiZSBpbnN0YW5jZWQuJyk7XG4gICAgfTtcbiAgICBwID0gQ2FudmFzVG9vbDtcblxuICAgIC8vIHB1YmxpYyBtZXRob2RzXG4gICAgcC5nZXRQaXhlbCA9IGZ1bmN0aW9uIChpbWFnZURhdGEsIHgsIHkpIHtcbiAgICAgICAgdmFyIGRhdGEsIGluZGV4LCByLCBnLCBiO1xuICAgICAgICBkYXRhID0gaW1hZ2VEYXRhLmRhdGE7XG4gICAgICAgIGluZGV4ID0gKHkgKiBpbWFnZURhdGEud2lkdGggKyB4KSAqIDQ7XG4gICAgICAgIHIgPSBkYXRhW2luZGV4XTtcbiAgICAgICAgZyA9IGRhdGFbaW5kZXggKyAxXTtcbiAgICAgICAgYiA9IGRhdGFbaW5kZXggKyAyXTtcblxuICAgICAgICByZXR1cm4gKChyIDw8IDE2KSB8IChnIDw8IDgpIHwgYik7XG4gICAgfTtcblxuICAgIHAudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBcIltDYW52YXNUb29sXVwiO1xuICAgIH07XG5cbiAgICBvYmVsaXNrLkNhbnZhc1Rvb2wgPSBDYW52YXNUb29sO1xufShvYmVsaXNrKSk7XG5cbi8qZ2xvYmFsIG9iZWxpc2s6dHJ1ZSovXG5cbi8qXG4gKiBDb2xvckdlb21cbiAqL1xuXG4oZnVuY3Rpb24gKG9iZWxpc2spIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHZhciBDb2xvckdlb20sIHA7XG5cbiAgICBDb2xvckdlb20gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignQ29sb3JHZW9tIGlzIGEgc3RhdGljIENsYXNzLCBjYW5ub3QgYmUgaW5zdGFuY2VkLicpO1xuICAgIH07XG4gICAgcCA9IENvbG9yR2VvbTtcblxuICAgIC8vIHB1YmxpYyBtZXRob2RzXG4gICAgcC5nZXQzMiA9IGZ1bmN0aW9uIChjb2xvcikge1xuICAgICAgICByZXR1cm4gY29sb3IgPCAweEZGMDAwMDAwID8gKGNvbG9yICsgMHhGRjAwMDAwMCkgOiBjb2xvcjtcbiAgICB9O1xuXG4gICAgcC5hcHBseUJyaWdodG5lc3MgPSBmdW5jdGlvbiAoY29sb3IsIGJyaWdodG5lc3MsIGhpZ2hsaWdodCkge1xuICAgICAgICB2YXIgYSwgciwgZywgYiwgeSwgdiwgdTtcbiAgICAgICAgYSA9ICgoY29sb3IgPj4+IDI0KSAmIDB4MDAwMDAwRkYpO1xuICAgICAgICByID0gKChjb2xvciA+Pj4gMTYpICYgMHgwMDAwMDBGRik7XG4gICAgICAgIGcgPSAoKGNvbG9yID4+PiA4KSAmIDB4MDAwMDAwRkYpO1xuICAgICAgICBiID0gKGNvbG9yICYgMHgwMDAwMDBGRik7XG5cbiAgICAgICAgeSA9ICgociAqIDMxMzUyNCkgPj4gMjApICsgKChnICogNjE1NTE0KSA+PiAyMCkgKyAoKGIgKiAxMTk1MzgpID4+IDIwKTtcbiAgICAgICAgdSA9IC0oKDE1NTE4OSAqIHIpID4+IDIwKSAtICgoMzAzMDM4ICogZykgPj4gMjApICsgKCg0NTgyMjcgKiBiKSA+PiAyMCk7XG4gICAgICAgIHYgPSAoKDY0NDg3NCAqIHIpID4+IDIwKSAtICgoNTQwMDE2ICogZykgPj4gMjApIC0gKCgxMDQ4NTcgKiBiKSA+PiAyMCk7XG5cbiAgICAgICAgaWYgKCFoaWdobGlnaHQpIHtcbiAgICAgICAgICAgIHkgKz0gYnJpZ2h0bmVzcztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHkgPSA2MCArIE1hdGgucG93KHksIDEuMik7XG4gICAgICAgIH1cblxuICAgICAgICByID0geSArICgoMTE5NTM3NiAqIHYpID4+IDIwKTtcbiAgICAgICAgZyA9IHkgLSAoKDQwODk0NCAqIHUpID4+IDIwKSAtICgoNjA4MTc0ICogdikgPj4gMjApO1xuICAgICAgICBiID0geSArICgoMjEyODYwOSAqIHUpID4+IDIwKTtcblxuICAgICAgICByID0gTWF0aC5tYXgoMCwgTWF0aC5taW4ociwgMjU1KSk7XG4gICAgICAgIGcgPSBNYXRoLm1heCgwLCBNYXRoLm1pbihnLCAyNTUpKTtcbiAgICAgICAgYiA9IE1hdGgubWF4KDAsIE1hdGgubWluKGIsIDI1NSkpO1xuXG4gICAgICAgIHJldHVybiAoYSA8PCAyNCkgfCAociA8PCAxNikgfCAoZyA8PCA4KSB8IGI7XG4gICAgfTtcblxuICAgIHAudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBcIltDb2xvckdlb21dXCI7XG4gICAgfTtcblxuICAgIG9iZWxpc2suQ29sb3JHZW9tID0gQ29sb3JHZW9tO1xufShvYmVsaXNrKSk7XG5cbi8qZ2xvYmFsIG9iZWxpc2s6dHJ1ZSovXG5cbi8qXG4gKiBDb2xvclBhdHRlcm5cbiAqL1xuXG4oZnVuY3Rpb24gKG9iZWxpc2spIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHZhciBDb2xvclBhdHRyZW4sIHA7XG5cbiAgICBDb2xvclBhdHRyZW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignQ29sb3JHZW9tIGlzIGEgc3RhdGljIENsYXNzLCBjYW5ub3QgYmUgaW5zdGFuY2VkLicpO1xuICAgIH07XG4gICAgcCA9IENvbG9yUGF0dHJlbjtcblxuICAgIC8vIHB1YmxpYyBwcm9wZXJ0aWVzXG4gICAgcC5HUkFTU19HUkVFTiA9IDB4Q0NGRjAwO1xuICAgIHAuWUVMTE9XID0gMHhGRkZGMDA7XG4gICAgcC5XSU5FX1JFRCA9IDB4RkYwMDk5O1xuICAgIHAuUElOSyA9IDB4RkY3Q0JGO1xuICAgIHAuUFVSUExFID0gMHhDQzAwRkY7XG4gICAgcC5CTFVFID0gMHgwMENDRkY7XG4gICAgcC5HUkFZID0gMHhFRUVFRUU7XG4gICAgcC5CTEFDSyA9IDB4NjY2NjY2O1xuICAgIHAuRklORV9DT0xPUlMgPVxuICAgICAgICBbXG4gICAgICAgICAgICBwLkdSQVNTX0dSRUVOLFxuICAgICAgICAgICAgcC5ZRUxMT1csXG4gICAgICAgICAgICBwLldJTkVfUkVELFxuICAgICAgICAgICAgcC5QSU5LLFxuICAgICAgICAgICAgcC5QVVJQTEUsXG4gICAgICAgICAgICBwLkJMVUUsXG4gICAgICAgICAgICBwLkdSQVksXG4gICAgICAgICAgICBwLkJMQUNLXG4gICAgICAgIF07XG5cbiAgICAvLyBwdWJsaWMgbWV0aG9kc1xuICAgIHAuZ2V0UmFuZG9tQ29tZm9ydGFibGVDb2xvciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHAuRklORV9DT0xPUlNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogcC5GSU5FX0NPTE9SUy5sZW5ndGgpXTtcbiAgICB9O1xuXG4gICAgcC50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIFwiW0NvbG9yUGF0dGVybl1cIjtcbiAgICB9O1xuXG4gICAgb2JlbGlzay5Db2xvclBhdHRlcm4gPSBDb2xvclBhdHRyZW47XG59KG9iZWxpc2spKTtcblxuOyBicm93c2VyaWZ5X3NoaW1fX2RlZmluZV9fbW9kdWxlX19leHBvcnRfXyh0eXBlb2Ygb2JlbGlzayAhPSBcInVuZGVmaW5lZFwiID8gb2JlbGlzayA6IHdpbmRvdy5vYmVsaXNrKTtcblxufSkuY2FsbChnbG9iYWwsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgZnVuY3Rpb24gZGVmaW5lRXhwb3J0KGV4KSB7IG1vZHVsZS5leHBvcnRzID0gZXg7IH0pO1xuIiwiaW1wb3J0IG9iZWxpc2sgZnJvbSAnb2JlbGlzay5qcyc7XG5cbi8qKlxuICogQGNvbnN0YW50IERFRkFVTFRfU0laRVxuICogQHR5cGUge051bWJlcn1cbiAqL1xuY29uc3QgREVGQVVMVF9TSVpFID0gMTA7XG5cbi8qKlxuICogQG1vZHVsZSBHaXJhZmZlXG4gKiBAYXV0aG9yIEFkYW0gVGltYmVybGFrZVxuICogQGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL1dpbGRob25leS9HaXJhZmZlXG4gKiBAbGluayBodHRwOi8vZ2lyYWZmZS1hcHAuaGVyb2t1YXBwLmNvbS9cbiAqIEBsaWNlbmNlIE1JVFxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHaXJhZmZlIHtcblxuICAgIC8qKlxuICAgICAqIEBjb25zdGFudCBFTEVNRU5UXG4gICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgKi9cbiAgICBzdGF0aWMgRUxFTUVOVCA9ICdjYW52YXMuZ2lyYWZmZSc7XG5cbiAgICAvKipcbiAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgKiBAcmV0dXJuIHtHaXJhZmZlfVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLnJlbmRlck1vZGVsKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG1ldGhvZCBnZXRNb2RlbFxuICAgICAqIEByZXR1cm4ge29iZWxpc2suQ3ViZVtdfVxuICAgICAqL1xuICAgIGdldE1vZGVsKCkge1xuXG4gICAgICAgIGNvbnN0IGxpZ2h0Q29sb3VyID0gbmV3IG9iZWxpc2suQ3ViZUNvbG9yKCkuZ2V0QnlIb3Jpem9udGFsQ29sb3IoMHhFRENFOTMpO1xuICAgICAgICBjb25zdCBkYXJrQ29sb3VyICA9IG5ldyBvYmVsaXNrLkN1YmVDb2xvcigpLmdldEJ5SG9yaXpvbnRhbENvbG9yKDB4NzA0QTNBKTtcbiAgICAgICAgY29uc3QgeCAgICAgICAgICAgPSAxMDtcbiAgICAgICAgY29uc3QgeSAgICAgICAgICAgPSAxMDtcbiAgICAgICAgY29uc3QgeiAgICAgICAgICAgPSAxMDtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG1ldGhvZCBzaXplQnlcbiAgICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IHhcbiAgICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IFt5PXhdXG4gICAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSBbej14XVxuICAgICAgICAgKiBAcmV0dXJuIHt7eDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlcn19XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBzaXplQnkgPSAoeCwgeSA9IHgsIHogPSB4KSA9PiB7XG4gICAgICAgICAgICByZXR1cm4geyB4LCB5LCB6IH07XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIHtcblxuICAgICAgICAgICAgbmVjazogW1xuICAgICAgICAgICAgICAgIHsgY29sb3VyOiBsaWdodENvbG91ciwgc2l6ZTogc2l6ZUJ5KERFRkFVTFRfU0laRSksIHBvc2l0aW9uOiBzaXplQnkoeCAqIDMsIHkgKiAzLCB6KSB9LFxuICAgICAgICAgICAgICAgIHsgY29sb3VyOiBkYXJrQ29sb3VyLCAgc2l6ZTogc2l6ZUJ5KERFRkFVTFRfU0laRSksIHBvc2l0aW9uOiBzaXplQnkoeCAqIDIsIHkgKiAyLCB6KSB9LFxuICAgICAgICAgICAgICAgIHsgY29sb3VyOiBsaWdodENvbG91ciwgc2l6ZTogc2l6ZUJ5KERFRkFVTFRfU0laRSksIHBvc2l0aW9uOiBzaXplQnkoeCwgeSwgeikgfVxuICAgICAgICAgICAgXSxcblxuICAgICAgICAgICAgaGVhZDogW1xuICAgICAgICAgICAgICAgIHsgY29sb3VyOiBsaWdodENvbG91cixcbiAgICAgICAgICAgICAgICAgIHNpemU6IHNpemVCeShERUZBVUxUX1NJWkUgKiAyKSxcbiAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBzaXplQnkoeCwgeSwgeiAqIDMpIH1cbiAgICAgICAgICAgIF1cblxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbWV0aG9kIHJlbmRlck1vZGVsXG4gICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgKi9cbiAgICByZW5kZXJNb2RlbCgpIHtcblxuICAgICAgICBjb25zdCBjYW52YXMgICAgPSB0aGlzLmdldEVsZW1lbnQoKTtcbiAgICAgICAgY29uc3QgcG9pbnQgICAgID0gbmV3IG9iZWxpc2suUG9pbnQoMjAwLCAyMDApO1xuICAgICAgICBjb25zdCBwaXhlbFZpZXcgPSBuZXcgb2JlbGlzay5QaXhlbFZpZXcoY2FudmFzLCBwb2ludCk7XG4gICAgICAgIGNvbnN0IG1vZGVsICAgICA9IHRoaXMuZ2V0TW9kZWwoKTtcblxuICAgICAgICBPYmplY3Qua2V5cyhtb2RlbCkuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICAgICAgLy9tb2RlbFtrZXldLmZvckVhY2goY29tcG9uZW50ID0+IHBpeGVsVmlldy5yZW5kZXJPYmplY3QoY29tcG9uZW50WzBdLCBjb21wb25lbnRbMV0pKTtcblxuICAgICAgICAgICAgbW9kZWxba2V5XS5mb3JFYWNoKCh7IGNvbG91ciwgc2l6ZSwgcG9zaXRpb24gfSkgPT4ge1xuXG4gICAgICAgICAgICAgICAgY29uc3Qgc2hhcGVNb2RlbCAgICA9IG5ldyBvYmVsaXNrLkN1YmVEaW1lbnNpb24oc2l6ZS54LCBzaXplLnksIHNpemUueik7XG4gICAgICAgICAgICAgICAgY29uc3QgcG9zaXRpb25Nb2RlbCA9IG5ldyBvYmVsaXNrLlBvaW50M0QocG9zaXRpb24ueCwgcG9zaXRpb24ueSwgcG9zaXRpb24ueik7XG5cbiAgICAgICAgICAgICAgICBwaXhlbFZpZXcucmVuZGVyT2JqZWN0KG5ldyBvYmVsaXNrLkN1YmUoc2hhcGVNb2RlbCwgY29sb3VyLCB0cnVlKSwgcG9zaXRpb25Nb2RlbCk7XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvL2NvbnN0IGNvbG9yICA9IG5ldyBvYmVsaXNrLlNsb3BlQ29sb3IoKS5nZXRCeUhvcml6b250YWxDb2xvcigweEVEQ0U5Myk7XG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgLy92YXIgZGltZW5zaW9uU291dGggPSBuZXcgb2JlbGlzay5TbG9wZURpbWVuc2lvbihTSVpFLCBTSVpFKTtcbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgLy92YXIgc2xvcGVTb3V0aCA9IG5ldyBvYmVsaXNrLlNsb3BlU291dGgoZGltZW5zaW9uU291dGgsIGNvbG9yKTtcbiAgICAgICAgICAgIC8vdmFyIHAzZFNvdXRoICAgPSBuZXcgb2JlbGlzay5Qb2ludDNEKDgwLCA1MCwgNTApO1xuICAgICAgICAgICAgLy9waXhlbFZpZXcucmVuZGVyT2JqZWN0KHNsb3BlU291dGgsIHAzZFNvdXRoKTtcblxuICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBtZXRob2QgZ2V0RWxlbWVudFxuICAgICAqIEByZXR1cm4ge0VsZW1lbnR9XG4gICAgICovXG4gICAgZ2V0RWxlbWVudCgpIHtcblxuICAgICAgICBjb25zdCBjYW52YXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKEdpcmFmZmUuRUxFTUVOVCk7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCByZXNpemVDYW52YXMsIGZhbHNlKTtcblxuICAgICAgICBmdW5jdGlvbiByZXNpemVDYW52YXMoKSB7XG4gICAgICAgICAgICBjYW52YXMud2lkdGggID0gd2luZG93LmlubmVyV2lkdGg7XG4gICAgICAgICAgICBjYW52YXMuaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xuICAgICAgICB9XG5cbiAgICAgICAgcmVzaXplQ2FudmFzKCk7XG4gICAgICAgIHJldHVybiBjYW52YXM7XG5cbiAgICB9XG5cbn1cblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IG5ldyBHaXJhZmZlKCkpO1xuIl19
