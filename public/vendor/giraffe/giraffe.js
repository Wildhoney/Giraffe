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
 * @module Giraffe
 * @author Adam Timberlake
 * @link https://github.com/Wildhoney/Giraffe
 * @link http://giraffe-app.herokuapp.com/
 * @licence MIT
 */

var Giraffe = (function () {

    /**
     * @constructor
     * @return {Giraffe}
     */

    function Giraffe() {
        _classCallCheck(this, Giraffe);

        var canvas = this.getElement();
        var point = new _obeliskJs2['default'].Point(200, 200);
        var pixelView = new _obeliskJs2['default'].PixelView(canvas, point);

        var dimension = new _obeliskJs2['default'].CubeDimension(80, 100, 120);
        var gray = _obeliskJs2['default'].ColorPattern.GRAY;
        var color = new _obeliskJs2['default'].CubeColor().getByHorizontalColor(gray);
        var cube = new _obeliskJs2['default'].Cube(dimension, color, true);

        pixelView.renderObject(cube);
    }

    /**
     * @method getElement
     * @return {Element}
     */

    _createClass(Giraffe, [{
        key: 'getElement',
        value: function getElement() {

            var canvas = document.querySelector('canvas.giraffe');

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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvb2JlbGlzay5qcy9idWlsZC9vYmVsaXNrLmpzIiwiL1VzZXJzL2F0aW1iZXJsYWtlL1dlYnJvb3QvR2lyYWZmZS9zcmMvR2lyYWZmZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozt5QkNyMEVvQixZQUFZOzs7Ozs7Ozs7Ozs7SUFTWCxPQUFPOzs7Ozs7O0FBTWIsYUFOTSxPQUFPLEdBTVY7OEJBTkcsT0FBTzs7QUFRcEIsWUFBTSxNQUFNLEdBQU0sSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO0FBQ3BDLFlBQU0sS0FBSyxHQUFPLElBQUksdUJBQVEsS0FBSyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUM5QyxZQUFNLFNBQVMsR0FBRyxJQUFJLHVCQUFRLFNBQVMsQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUM7O0FBRXZELFlBQU0sU0FBUyxHQUFHLElBQUksdUJBQVEsYUFBYSxDQUFDLEVBQUUsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDMUQsWUFBTSxJQUFJLEdBQVEsdUJBQVEsWUFBWSxDQUFDLElBQUksQ0FBQztBQUM1QyxZQUFNLEtBQUssR0FBTyxJQUFJLHVCQUFRLFNBQVMsRUFBRSxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3JFLFlBQU0sSUFBSSxHQUFRLElBQUksdUJBQVEsSUFBSSxDQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7O0FBRTNELGlCQUFTLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO0tBRWhDOzs7Ozs7O2lCQW5CZ0IsT0FBTzs7ZUF5QmQsc0JBQUc7O0FBRVQsZ0JBQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsZ0JBQWdCLENBQUMsQ0FBQzs7QUFFeEQsa0JBQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUUsWUFBWSxFQUFFLEtBQUssQ0FBQyxDQUFDOztBQUV2RCxxQkFBUyxZQUFZLEdBQUc7QUFDcEIsc0JBQU0sQ0FBQyxLQUFLLEdBQUksTUFBTSxDQUFDLFVBQVUsQ0FBQztBQUNsQyxzQkFBTSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsV0FBVyxDQUFDO2FBQ3RDOztBQUVELHdCQUFZLEVBQUUsQ0FBQztBQUNmLG1CQUFPLE1BQU0sQ0FBQztTQUVqQjs7O1dBdkNnQixPQUFPOzs7cUJBQVAsT0FBTzs7QUEyQzVCLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxrQkFBa0IsRUFBRTtXQUFNLElBQUksT0FBTyxFQUFFO0NBQUEsQ0FBQyxDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIjsgdmFyIF9fYnJvd3NlcmlmeV9zaGltX3JlcXVpcmVfXz1yZXF1aXJlOyhmdW5jdGlvbiBicm93c2VyaWZ5U2hpbShtb2R1bGUsIGV4cG9ydHMsIHJlcXVpcmUsIGRlZmluZSwgYnJvd3NlcmlmeV9zaGltX19kZWZpbmVfX21vZHVsZV9fZXhwb3J0X18pIHtcbi8qZ2xvYmFsIHdpbmRvdzp0cnVlKi9cblxuLypcbiAqIG9iZWxpc2tcbiAqL1xuXG4oZnVuY3Rpb24gKHdpbmRvdykge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgLyoqXG4gICAgICogU3RhdGljIGNsYXNzIGhvbGRpbmcgbGlicmFyeSBzcGVjaWZpYyBpbmZvcm1hdGlvblxuICAgICAqIHRoZSBsaWJyYXJ5LlxuICAgICAqIEBjbGFzcyBvYmVsaXNrXG4gICAgICoqL1xuICAgIHZhciBvYmVsaXNrID0ge307XG5cbiAgICAvKipcbiAgICAgKiBAcHJvcGVydHkgdmVyc2lvblxuICAgICAqIEB0eXBlIFN0cmluZ1xuICAgICAqIEBzdGF0aWNcbiAgICAgKiovXG4gICAgb2JlbGlzay52ZXJzaW9uID0gJzEuMS4wJztcblxuICAgIC8qKlxuICAgICAqIEBwcm9wZXJ0eSBhdXRob3JcbiAgICAgKiBAdHlwZSBTdHJpbmdcbiAgICAgKiBAc3RhdGljXG4gICAgICoqL1xuICAgIG9iZWxpc2suYXV0aG9yID0gJ21heCBodWFuZyc7XG5cbiAgICB3aW5kb3cub2JlbGlzayA9IG9iZWxpc2s7XG59KHdpbmRvdykpO1xuXG4vKmdsb2JhbCBvYmVsaXNrOnRydWUqL1xuXG4vKlxuICogQWJzdHJhY3RDb2xvclxuICovXG5cbihmdW5jdGlvbiAob2JlbGlzaykge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgdmFyIEFic3RyYWN0Q29sb3IsIHA7XG5cbiAgICBBYnN0cmFjdENvbG9yID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmluaXRpYWxpemUoKTtcbiAgICB9O1xuICAgIHAgPSBBYnN0cmFjdENvbG9yLnByb3RvdHlwZTtcblxuICAgIC8vIHB1YmxpYyBwcm9wZXJ0aWVzXG4gICAgLyoqXG4gICAgICogVGhlIGlubmVyIGNvbG9ycyBmb3IgZWxlbWVudHMgb2YgY2VydGFpbiBwcmltaXRpdmVcbiAgICAgKi9cbiAgICBwLmlubmVyID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIFRoZSBib3JkZXIgY29sb3JzIGZvciBlbGVtZW50cyBvZiBjZXJ0YWluIHByaW1pdGl2ZVxuICAgICAqL1xuICAgIHAuYm9yZGVyID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIFRoZSBib3JkZXJIaWdobGlnaHQgY29sb3JzIGZvciBlbGVtZW50cyBvZiBjZXJ0YWluIHByaW1pdGl2ZVxuICAgICAqL1xuICAgIHAuYm9yZGVySGlnaGxpZ2h0ID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIFRoZSBsZWZ0IHNpZGUgY29sb3JzIGZvciBlbGVtZW50cyBvZiBjZXJ0YWluIHByaW1pdGl2ZVxuICAgICAqL1xuICAgIHAubGVmdCA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgcmlnaHQgc2lkZSBjb2xvcnMgZm9yIGVsZW1lbnRzIG9mIGNlcnRhaW4gcHJpbWl0aXZlXG4gICAgICovXG4gICAgcC5yaWdodCA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgaG9yaXpvbnRhbCBjb2xvcnMgZm9yIGVsZW1lbnRzIG9mIGNlcnRhaW4gcHJpbWl0aXZlXG4gICAgICovXG4gICAgcC5ob3Jpem9udGFsID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIFRoZSBsZWZ0IHNsb3Qgc2lkZSBjb2xvcnMgZm9yIGVsZW1lbnRzIG9mIGNlcnRhaW4gcHJpbWl0aXZlXG4gICAgICovXG4gICAgcC5sZWZ0U2xvcGUgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogVGhlIHJpZ2h0IHNsb3Qgc2lkZSBjb2xvcnMgZm9yIGVsZW1lbnRzIG9mIGNlcnRhaW4gcHJpbWl0aXZlXG4gICAgICovXG4gICAgcC5yaWdodFNsb3BlID0gbnVsbDtcblxuICAgIC8vIGNvbnN0cnVjdG9yXG4gICAgcC5pbml0aWFsaXplID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgLy8gcHVibGljIG1ldGhvZHNcbiAgICBwLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gXCJbQWJzdHJhY3RDb2xvcl1cIjtcbiAgICB9O1xuXG4gICAgLy8gcHJpdmF0ZSBtZXRob2RzXG5cbiAgICBvYmVsaXNrLkFic3RyYWN0Q29sb3IgPSBBYnN0cmFjdENvbG9yO1xufShvYmVsaXNrKSk7XG5cbi8qZ2xvYmFsIG9iZWxpc2s6dHJ1ZSovXG5cbi8qXG4gKiBDdWJlQ29sb3JcbiAqL1xuXG4oZnVuY3Rpb24gKG9iZWxpc2spIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHZhciBDdWJlQ29sb3IsIHA7XG4gICAgQ3ViZUNvbG9yID0gZnVuY3Rpb24gKGJvcmRlciwgYm9yZGVySGlnaGxpZ2h0LCBsZWZ0LCByaWdodCwgaG9yaXpvbnRhbCkge1xuICAgICAgICB0aGlzLmluaXRpYWxpemUoYm9yZGVyLCBib3JkZXJIaWdobGlnaHQsIGxlZnQsIHJpZ2h0LCBob3Jpem9udGFsKTtcbiAgICB9O1xuICAgIHAgPSBDdWJlQ29sb3IucHJvdG90eXBlID0gbmV3IG9iZWxpc2suQWJzdHJhY3RDb2xvcigpO1xuXG4gICAgLy8gcHVibGljIHByb3BlcnRpZXNcbiAgICBwLkJSSUdIVE5FU1NfR0FJTiA9IC0yMDtcblxuICAgIC8vIGNvbnN0cnVjdG9yXG4gICAgcC5pbml0aWFsaXplID0gZnVuY3Rpb24gKGJvcmRlciwgYm9yZGVySGlnaGxpZ2h0LCBsZWZ0LCByaWdodCwgaG9yaXpvbnRhbCkge1xuICAgICAgICB0aGlzLmJvcmRlciA9IG9iZWxpc2suQ29sb3JHZW9tLmdldDMyKGJvcmRlciA9PT0gdW5kZWZpbmVkID8gMHg4Nzg3ODcgOiBib3JkZXIpO1xuICAgICAgICB0aGlzLmJvcmRlckhpZ2hsaWdodCA9IG9iZWxpc2suQ29sb3JHZW9tLmdldDMyKGJvcmRlckhpZ2hsaWdodCA9PT0gdW5kZWZpbmVkID8gMHhGRkZGRkYgOiBib3JkZXJIaWdobGlnaHQpO1xuICAgICAgICB0aGlzLmxlZnQgPSBvYmVsaXNrLkNvbG9yR2VvbS5nZXQzMihsZWZ0ID09PSB1bmRlZmluZWQgPyAweEM5Q0ZEMCA6IGxlZnQpO1xuICAgICAgICB0aGlzLnJpZ2h0ID0gb2JlbGlzay5Db2xvckdlb20uZ2V0MzIocmlnaHQgPT09IHVuZGVmaW5lZCA/IDB4RTNFM0UzIDogcmlnaHQpO1xuICAgICAgICB0aGlzLmhvcml6b250YWwgPSBvYmVsaXNrLkNvbG9yR2VvbS5nZXQzMihob3Jpem9udGFsID09PSB1bmRlZmluZWQgPyAweEVFRUZGMCA6IGhvcml6b250YWwpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgLy8gcHVibGljIG1ldGhvZHNcbiAgICBwLmdldEJ5SG9yaXpvbnRhbENvbG9yID0gZnVuY3Rpb24gKGhvcml6b250YWwpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBDdWJlQ29sb3IoXG4gICAgICAgICAgICBvYmVsaXNrLkNvbG9yR2VvbS5hcHBseUJyaWdodG5lc3MoaG9yaXpvbnRhbCwgdGhpcy5CUklHSFRORVNTX0dBSU4gKiA0KSxcbiAgICAgICAgICAgIC8vYXBwbHkgaGlnaHRsaWdodFxuICAgICAgICAgICAgb2JlbGlzay5Db2xvckdlb20uYXBwbHlCcmlnaHRuZXNzKGhvcml6b250YWwsIDAsIHRydWUpLFxuICAgICAgICAgICAgb2JlbGlzay5Db2xvckdlb20uYXBwbHlCcmlnaHRuZXNzKGhvcml6b250YWwsIHRoaXMuQlJJR0hUTkVTU19HQUlOICogMiksXG4gICAgICAgICAgICBvYmVsaXNrLkNvbG9yR2VvbS5hcHBseUJyaWdodG5lc3MoaG9yaXpvbnRhbCwgdGhpcy5CUklHSFRORVNTX0dBSU4pLFxuICAgICAgICAgICAgaG9yaXpvbnRhbFxuICAgICAgICApO1xuICAgIH07XG5cbiAgICBwLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gXCJbQ3ViZUNvbG9yXVwiO1xuICAgIH07XG5cbiAgICAvLyBwcml2YXRlIG1ldGhvZHNcblxuICAgIG9iZWxpc2suQ3ViZUNvbG9yID0gQ3ViZUNvbG9yO1xufShvYmVsaXNrKSk7XG5cbi8qZ2xvYmFsIG9iZWxpc2s6dHJ1ZSovXG5cbi8qXG4gKiBQeXJhbWlkQ29sb3JcbiAqL1xuXG4oZnVuY3Rpb24gKG9iZWxpc2spIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHZhciBQeXJhbWlkQ29sb3IsIHA7XG4gICAgUHlyYW1pZENvbG9yID0gZnVuY3Rpb24gKGJvcmRlciwgYm9yZGVySGlnaGxpZ2h0LCBsZWZ0LCByaWdodCkge1xuICAgICAgICB0aGlzLmluaXRpYWxpemUoYm9yZGVyLCBib3JkZXJIaWdobGlnaHQsIGxlZnQsIHJpZ2h0KTtcbiAgICB9O1xuICAgIHAgPSBQeXJhbWlkQ29sb3IucHJvdG90eXBlID0gbmV3IG9iZWxpc2suQWJzdHJhY3RDb2xvcigpO1xuXG4gICAgLy8gcHVibGljIHByb3BlcnRpZXNcbiAgICBwLkJSSUdIVE5FU1NfR0FJTiA9IC0yMDtcblxuICAgIC8vIGNvbnN0cnVjdG9yXG4gICAgcC5pbml0aWFsaXplID0gZnVuY3Rpb24gKGJvcmRlciwgYm9yZGVySGlnaGxpZ2h0LCBsZWZ0LCByaWdodCkge1xuICAgICAgICB0aGlzLmJvcmRlciA9IG9iZWxpc2suQ29sb3JHZW9tLmdldDMyKGJvcmRlciA9PT0gdW5kZWZpbmVkID8gMHg5NDk2OTggOiBib3JkZXIpO1xuICAgICAgICB0aGlzLmJvcmRlckhpZ2hsaWdodCA9IG9iZWxpc2suQ29sb3JHZW9tLmdldDMyKGJvcmRlckhpZ2hsaWdodCA9PT0gdW5kZWZpbmVkID8gMHhGRkZGRkYgOiBib3JkZXJIaWdobGlnaHQpO1xuICAgICAgICB0aGlzLmxlZnQgPSBvYmVsaXNrLkNvbG9yR2VvbS5nZXQzMihsZWZ0ID09PSB1bmRlZmluZWQgPyAweEU2RThFOSA6IGxlZnQpO1xuICAgICAgICB0aGlzLnJpZ2h0ID0gb2JlbGlzay5Db2xvckdlb20uZ2V0MzIocmlnaHQgPT09IHVuZGVmaW5lZCA/IDB4RUVFRkYwIDogcmlnaHQpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgLy8gcHVibGljIG1ldGhvZHNcbiAgICBwLmdldEJ5UmlnaHRDb2xvciA9IGZ1bmN0aW9uIChyaWdodCkge1xuICAgICAgICByZXR1cm4gbmV3IFB5cmFtaWRDb2xvcihcbiAgICAgICAgICAgIG9iZWxpc2suQ29sb3JHZW9tLmFwcGx5QnJpZ2h0bmVzcyhyaWdodCwgdGhpcy5CUklHSFRORVNTX0dBSU4gKiA0KSxcbiAgICAgICAgICAgIC8vYXBwbHkgaGlnaHRsaWdodFxuICAgICAgICAgICAgb2JlbGlzay5Db2xvckdlb20uYXBwbHlCcmlnaHRuZXNzKHJpZ2h0LCAwLCB0cnVlKSxcbiAgICAgICAgICAgIG9iZWxpc2suQ29sb3JHZW9tLmFwcGx5QnJpZ2h0bmVzcyhyaWdodCwgdGhpcy5CUklHSFRORVNTX0dBSU4pLFxuICAgICAgICAgICAgcmlnaHRcbiAgICAgICAgKTtcbiAgICB9O1xuXG4gICAgcC50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIFwiW1B5cmFtaWRDb2xvcl1cIjtcbiAgICB9O1xuXG4gICAgLy8gcHJpdmF0ZSBtZXRob2RzXG5cbiAgICBvYmVsaXNrLlB5cmFtaWRDb2xvciA9IFB5cmFtaWRDb2xvcjtcbn0ob2JlbGlzaykpO1xuXG4vKmdsb2JhbCBvYmVsaXNrOnRydWUqL1xuXG4vKlxuICogU2lkZUNvbG9yXG4gKi9cblxuKGZ1bmN0aW9uIChvYmVsaXNrKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICB2YXIgU2lkZUNvbG9yLCBwO1xuICAgIFNpZGVDb2xvciA9IGZ1bmN0aW9uIChib3JkZXIsIGlubmVyKSB7XG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZShib3JkZXIsIGlubmVyKTtcbiAgICB9O1xuICAgIHAgPSBTaWRlQ29sb3IucHJvdG90eXBlID0gbmV3IG9iZWxpc2suQWJzdHJhY3RDb2xvcigpO1xuXG4gICAgLy8gcHVibGljIHByb3BlcnRpZXNcbiAgICBwLkJSSUdIVE5FU1NfR0FJTiA9IC0yMDtcblxuICAgIC8vIGNvbnN0cnVjdG9yXG4gICAgcC5pbml0aWFsaXplID0gZnVuY3Rpb24gKGJvcmRlciwgaW5uZXIpIHtcbiAgICAgICAgdGhpcy5ib3JkZXIgPSBvYmVsaXNrLkNvbG9yR2VvbS5nZXQzMihib3JkZXIgPT09IHVuZGVmaW5lZCA/IDB4ODc4Nzg3IDogYm9yZGVyKTtcbiAgICAgICAgdGhpcy5pbm5lciA9IG9iZWxpc2suQ29sb3JHZW9tLmdldDMyKGlubmVyID09PSB1bmRlZmluZWQgPyAweEVFRUVFRSA6IGlubmVyKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIC8vIHB1YmxpYyBtZXRob2RzXG4gICAgcC5nZXRCeUlubmVyQ29sb3IgPSBmdW5jdGlvbiAoaW5uZXIpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBvYmVsaXNrLlNpZGVDb2xvcihcbiAgICAgICAgICAgIG9iZWxpc2suQ29sb3JHZW9tLmFwcGx5QnJpZ2h0bmVzcyhpbm5lciwgdGhpcy5CUklHSFRORVNTX0dBSU4gKiA0KSxcbiAgICAgICAgICAgIGlubmVyXG4gICAgICAgICk7XG4gICAgfTtcblxuICAgIHAudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBcIltTaWRlQ29sb3JdXCI7XG4gICAgfTtcblxuICAgIC8vIHByaXZhdGUgbWV0aG9kc1xuXG4gICAgb2JlbGlzay5TaWRlQ29sb3IgPSBTaWRlQ29sb3I7XG59KG9iZWxpc2spKTtcblxuLypnbG9iYWwgb2JlbGlzazp0cnVlKi9cblxuLypcbiAqIFNsb3BlQ29sb3JcbiAqL1xuXG4oZnVuY3Rpb24gKG9iZWxpc2spIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHZhciBTbG9wZUNvbG9yLCBwO1xuICAgIFNsb3BlQ29sb3IgPSBmdW5jdGlvbiAoYm9yZGVyLCBib3JkZXJIaWdobGlnaHQsIGxlZnQsIHJpZ2h0LCBsZWZ0U2xvcGUsIHJpZ2h0U2xvcGUpIHtcbiAgICAgICAgdGhpcy5pbml0aWFsaXplKGJvcmRlciwgYm9yZGVySGlnaGxpZ2h0LCBsZWZ0LCByaWdodCwgbGVmdFNsb3BlLCByaWdodFNsb3BlKTtcbiAgICB9O1xuICAgIHAgPSBTbG9wZUNvbG9yLnByb3RvdHlwZSA9IG5ldyBvYmVsaXNrLkFic3RyYWN0Q29sb3IoKTtcblxuICAgIC8vIHB1YmxpYyBwcm9wZXJ0aWVzXG4gICAgcC5CUklHSFRORVNTX0dBSU4gPSAtMjA7XG5cbiAgICAvLyBjb25zdHJ1Y3RvclxuICAgIHAuaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uIChib3JkZXIsIGJvcmRlckhpZ2hsaWdodCwgbGVmdCwgcmlnaHQsIGxlZnRTbG9wZSwgcmlnaHRTbG9wZSkge1xuICAgICAgICB0aGlzLmJvcmRlciA9IG9iZWxpc2suQ29sb3JHZW9tLmdldDMyKGJvcmRlciA9PT0gdW5kZWZpbmVkID8gMHg5NDk2OTggOiBib3JkZXIpO1xuICAgICAgICB0aGlzLmJvcmRlckhpZ2hsaWdodCA9IG9iZWxpc2suQ29sb3JHZW9tLmdldDMyKGJvcmRlckhpZ2hsaWdodCA9PT0gdW5kZWZpbmVkID8gMHhGRkZGRkYgOiBib3JkZXJIaWdobGlnaHQpO1xuICAgICAgICB0aGlzLmxlZnQgPSBvYmVsaXNrLkNvbG9yR2VvbS5nZXQzMihsZWZ0ID09PSB1bmRlZmluZWQgPyAweEM5Q0ZEMCA6IGxlZnQpO1xuICAgICAgICB0aGlzLnJpZ2h0ID0gb2JlbGlzay5Db2xvckdlb20uZ2V0MzIocmlnaHQgPT09IHVuZGVmaW5lZCA/IDB4RTZFOEU5IDogcmlnaHQpO1xuICAgICAgICB0aGlzLmxlZnRTbG9wZSA9IG9iZWxpc2suQ29sb3JHZW9tLmdldDMyKGxlZnRTbG9wZSA9PT0gdW5kZWZpbmVkID8gMHhEQkRCREIgOiBsZWZ0U2xvcGUpO1xuICAgICAgICB0aGlzLnJpZ2h0U2xvcGUgPSBvYmVsaXNrLkNvbG9yR2VvbS5nZXQzMihyaWdodFNsb3BlID09PSB1bmRlZmluZWQgPyAweERCREJEQiA6IHJpZ2h0U2xvcGUpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgLy8gcHVibGljIG1ldGhvZHNcblxuICAgIC8qXG4gICAgICogaG9yaXpvbnRhbCBzaWRlIGRvZXNuJ3QgYWN0dWFsbHkgZXhpc3QgaW4gdGhlIFNsb3BlIHByaW1pdGl2ZVxuICAgICAqIHlvdSBjYW4gYXNzaWduIHRoZSBzYW1lIGhvcml6b250YWwgY29sb3IgYXMgY3ViZVxuICAgICAqIHNvIHRoYXQgeW91IHdpbGwgYmUgYWJsZSB0byBhcnJhbmdlIHRoZSBzbG9wZSB3aXRoIGN1YmVcbiAgICAgKi9cbiAgICBwLmdldEJ5SG9yaXpvbnRhbENvbG9yID0gZnVuY3Rpb24gKGhvcml6b250YWwpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBvYmVsaXNrLlNsb3BlQ29sb3IoXG4gICAgICAgICAgICBvYmVsaXNrLkNvbG9yR2VvbS5hcHBseUJyaWdodG5lc3MoaG9yaXpvbnRhbCwgdGhpcy5CUklHSFRORVNTX0dBSU4gKiA0KSxcbiAgICAgICAgICAgIC8vYXBwbHkgaGlnaHRsaWdodFxuICAgICAgICAgICAgb2JlbGlzay5Db2xvckdlb20uYXBwbHlCcmlnaHRuZXNzKGhvcml6b250YWwsIDAsIHRydWUpLFxuICAgICAgICAgICAgb2JlbGlzay5Db2xvckdlb20uYXBwbHlCcmlnaHRuZXNzKGhvcml6b250YWwsIHRoaXMuQlJJR0hUTkVTU19HQUlOICogMiksXG4gICAgICAgICAgICBvYmVsaXNrLkNvbG9yR2VvbS5hcHBseUJyaWdodG5lc3MoaG9yaXpvbnRhbCwgdGhpcy5CUklHSFRORVNTX0dBSU4pLFxuICAgICAgICAgICAgb2JlbGlzay5Db2xvckdlb20uYXBwbHlCcmlnaHRuZXNzKGhvcml6b250YWwsIHRoaXMuQlJJR0hUTkVTU19HQUlOICogMS41KSxcbiAgICAgICAgICAgIG9iZWxpc2suQ29sb3JHZW9tLmFwcGx5QnJpZ2h0bmVzcyhob3Jpem9udGFsLCB0aGlzLkJSSUdIVE5FU1NfR0FJTiAqIDAuNSlcbiAgICAgICAgKTtcbiAgICB9O1xuXG4gICAgcC50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIFwiW1Nsb3BlQ29sb3JdXCI7XG4gICAgfTtcblxuICAgIC8vIHByaXZhdGUgbWV0aG9kc1xuXG4gICAgb2JlbGlzay5TbG9wZUNvbG9yID0gU2xvcGVDb2xvcjtcbn0ob2JlbGlzaykpO1xuXG4vKmdsb2JhbCBvYmVsaXNrOnRydWUqL1xuXG4vKlxuICogQWJzdHJhY3REaW1lbnNpb25cbiAqL1xuXG4oZnVuY3Rpb24gKG9iZWxpc2spIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHZhciBBYnN0cmFjdERpbWVuc2lvbiwgcDtcbiAgICBBYnN0cmFjdERpbWVuc2lvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5pbml0aWFsaXplKCk7XG4gICAgfTtcbiAgICBwID0gQWJzdHJhY3REaW1lbnNpb24ucHJvdG90eXBlO1xuXG4gICAgLy8gcHVibGljIHByb3BlcnRpZXNcbiAgICAvKipcbiAgICAgKiBUaGUgeCBBeGlzIGRpbWVuc2lvbnMgaW4gMjIuNiBkZWdyZWVzIGNvb3JkaW5hdGVcbiAgICAgKi9cbiAgICBwLnhBeGlzID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIFRoZSB5IEF4aXMgZGltZW5zaW9ucyBpbiAyMi42IGRlZ3JlZXMgY29vcmRpbmF0ZVxuICAgICAqL1xuICAgIHAueUF4aXMgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogVGhlIHogQXhpcyBkaW1lbnNpb25zIGluIDIyLjYgZGVncmVlcyBjb29yZGluYXRlXG4gICAgICovXG4gICAgcC56QXhpcyA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBQeXJhbWlkIHRhbGwgbW9kZVxuICAgICAqL1xuICAgIHAudGFsbCA9IGZhbHNlO1xuXG4gICAgLy8gY29uc3RydWN0b3JcbiAgICBwLmluaXRpYWxpemUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICAvLyBwdWJsaWMgbWV0aG9kc1xuICAgIHAudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBcIltBYnN0cmFjdERpbWVuc2lvbl1cIjtcbiAgICB9O1xuXG4gICAgLy8gcHJpdmF0ZSBtZXRob2RzXG5cbiAgICBvYmVsaXNrLkFic3RyYWN0RGltZW5zaW9uID0gQWJzdHJhY3REaW1lbnNpb247XG59KG9iZWxpc2spKTtcblxuLypnbG9iYWwgb2JlbGlzazp0cnVlKi9cblxuLypcbiAqIEJyaWNrRGltZW5zaW9uXG4gKi9cblxuKGZ1bmN0aW9uIChvYmVsaXNrKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICB2YXIgQnJpY2tEaW1lbnNpb24sIHA7XG4gICAgQnJpY2tEaW1lbnNpb24gPSBmdW5jdGlvbiAoeEF4aXMsIHlBeGlzKSB7XG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZSh4QXhpcywgeUF4aXMpO1xuICAgIH07XG4gICAgcCA9IEJyaWNrRGltZW5zaW9uLnByb3RvdHlwZSA9IG5ldyBvYmVsaXNrLkFic3RyYWN0RGltZW5zaW9uKCk7XG5cbiAgICAvLyBjb25zdHJ1Y3RvclxuICAgIHAuaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uICh4QXhpcywgeUF4aXMpIHtcbiAgICAgICAgdGhpcy54QXhpcyA9IHhBeGlzIHx8IDMwO1xuICAgICAgICB0aGlzLnlBeGlzID0geUF4aXMgfHwgMzA7XG5cbiAgICAgICAgaWYgKHRoaXMueEF4aXMgJSAyID09PSAxIHx8IHRoaXMueUF4aXMgJSAyID09PSAxKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJ4LHlBeGlzIG11c3QgYmUgZXZlbiBudW1iZXJcIik7XG4gICAgICAgIH1cblxuICAgICAgICAvLyB4QXhpcyB8fCB5QXhpcyA9IDQgZmxvb2RGaWxsIGNvdWxkIG5vdCBiZSBhcHBsaWVkXG4gICAgICAgIGlmICh0aGlzLnhBeGlzIDw9IDQgfHwgdGhpcy55QXhpcyA8PSA0KSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJkaW1lbnNpb24gaXMgdG9vIHNtYWxsXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIHAudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBcIltCcmlja0RpbWVuc2lvbl1cIjtcbiAgICB9O1xuXG4gICAgb2JlbGlzay5Ccmlja0RpbWVuc2lvbiA9IEJyaWNrRGltZW5zaW9uO1xufShvYmVsaXNrKSk7XG5cbi8qZ2xvYmFsIG9iZWxpc2s6dHJ1ZSovXG5cbi8qXG4gKiBDdWJlRGltZW5zaW9uXG4gKi9cblxuKGZ1bmN0aW9uIChvYmVsaXNrKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICB2YXIgQ3ViZURpbWVuc2lvbiwgcDtcbiAgICBDdWJlRGltZW5zaW9uID0gZnVuY3Rpb24gKHhBeGlzLCB5QXhpcywgekF4aXMpIHtcbiAgICAgICAgdGhpcy5pbml0aWFsaXplKHhBeGlzLCB5QXhpcywgekF4aXMpO1xuICAgIH07XG4gICAgcCA9IEN1YmVEaW1lbnNpb24ucHJvdG90eXBlID0gbmV3IG9iZWxpc2suQWJzdHJhY3REaW1lbnNpb24oKTtcblxuICAgIC8vIGNvbnN0cnVjdG9yXG4gICAgcC5pbml0aWFsaXplID0gZnVuY3Rpb24gKHhBeGlzLCB5QXhpcywgekF4aXMpIHtcbiAgICAgICAgdGhpcy54QXhpcyA9IHhBeGlzIHx8IDMwO1xuICAgICAgICB0aGlzLnlBeGlzID0geUF4aXMgfHwgMzA7XG4gICAgICAgIHRoaXMuekF4aXMgPSB6QXhpcyB8fCAzMDtcblxuICAgICAgICBpZiAodGhpcy54QXhpcyAlIDIgPT09IDEgfHwgdGhpcy55QXhpcyAlIDIgPT09IDEpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIngseUF4aXMgbXVzdCBiZSBldmVuIG51bWJlclwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHhBeGlzIHx8IHlBeGlzID0gNCBmbG9vZEZpbGwgY291bGQgbm90IGJlIGFwcGxpZWRcbiAgICAgICAgaWYgKHRoaXMueEF4aXMgPD0gNCB8fCB0aGlzLnlBeGlzIDw9IDQgfHwgdGhpcy56QXhpcyA8PSAyKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJkaW1lbnNpb24gaXMgdG9vIHNtYWxsXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIHAudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBcIltDdWJlRGltZW5zaW9uXVwiO1xuICAgIH07XG5cbiAgICBvYmVsaXNrLkN1YmVEaW1lbnNpb24gPSBDdWJlRGltZW5zaW9uO1xufShvYmVsaXNrKSk7XG5cbi8qZ2xvYmFsIG9iZWxpc2s6dHJ1ZSovXG5cbi8qXG4gKiBQeXJhbWlkRGltZW5zaW9uXG4gKi9cblxuKGZ1bmN0aW9uIChvYmVsaXNrKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICB2YXIgUHlyYW1pZERpbWVuc2lvbiwgcDtcbiAgICBQeXJhbWlkRGltZW5zaW9uID0gZnVuY3Rpb24gKGF4aXMsIHRhbGwpIHtcbiAgICAgICAgdGhpcy5pbml0aWFsaXplKGF4aXMsIHRhbGwpO1xuICAgIH07XG4gICAgcCA9IFB5cmFtaWREaW1lbnNpb24ucHJvdG90eXBlID0gbmV3IG9iZWxpc2suQWJzdHJhY3REaW1lbnNpb24oKTtcblxuICAgIC8vIGNvbnN0cnVjdG9yXG4gICAgcC5pbml0aWFsaXplID0gZnVuY3Rpb24gKGF4aXMsIHRhbGwpIHtcbiAgICAgICAgdGhpcy54QXhpcyA9IGF4aXMgfHwgMzA7XG4gICAgICAgIHRoaXMueUF4aXMgPSBheGlzIHx8IDMwO1xuICAgICAgICB0aGlzLnRhbGwgPSB0YWxsIHx8IGZhbHNlO1xuXG4gICAgICAgIGlmICh0aGlzLnhBeGlzICUgMiA9PT0gMSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiYXhpcyBtdXN0IGJlIGV2ZW4gbnVtYmVyXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMueEF4aXMgPD0gNCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiZGltZW5zaW9uIGlzIHRvbyBzbWFsbFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICBwLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gXCJbUHlyYW1pZERpbWVuc2lvbl1cIjtcbiAgICB9O1xuXG4gICAgb2JlbGlzay5QeXJhbWlkRGltZW5zaW9uID0gUHlyYW1pZERpbWVuc2lvbjtcbn0ob2JlbGlzaykpO1xuXG4vKmdsb2JhbCBvYmVsaXNrOnRydWUqL1xuXG4vKlxuICogU2lkZVhEaW1lbnNpb25cbiAqL1xuXG4oZnVuY3Rpb24gKG9iZWxpc2spIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHZhciBTaWRlWERpbWVuc2lvbiwgcDtcbiAgICBTaWRlWERpbWVuc2lvbiA9IGZ1bmN0aW9uICh4QXhpcywgekF4aXMpIHtcbiAgICAgICAgdGhpcy5pbml0aWFsaXplKHhBeGlzLCB6QXhpcyk7XG4gICAgfTtcbiAgICBwID0gU2lkZVhEaW1lbnNpb24ucHJvdG90eXBlID0gbmV3IG9iZWxpc2suQWJzdHJhY3REaW1lbnNpb24oKTtcblxuICAgIC8vIGNvbnN0cnVjdG9yXG4gICAgcC5pbml0aWFsaXplID0gZnVuY3Rpb24gKHhBeGlzLCB6QXhpcykge1xuICAgICAgICB0aGlzLnhBeGlzID0geEF4aXMgfHwgMzA7XG4gICAgICAgIHRoaXMuekF4aXMgPSB6QXhpcyB8fCAzMDtcblxuICAgICAgICBpZiAodGhpcy54QXhpcyAlIDIgPT09IDEpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcInhBeGlzIG11c3QgYmUgZXZlbiBudW1iZXJcIik7XG4gICAgICAgIH1cblxuICAgICAgICAvLyB4QXhpcyB8fCB6QXhpcyA9IDQgZmxvb2RGaWxsIGNvdWxkIG5vdCBiZSBhcHBsaWVkXG4gICAgICAgIGlmICh0aGlzLnhBeGlzIDw9IDQgfHwgdGhpcy56QXhpcyA8PSAyKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJkaW1lbnNpb24gaXMgdG9vIHNtYWxsXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIHAudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBcIltTaWRlWERpbWVuc2lvbl1cIjtcbiAgICB9O1xuXG4gICAgb2JlbGlzay5TaWRlWERpbWVuc2lvbiA9IFNpZGVYRGltZW5zaW9uO1xufShvYmVsaXNrKSk7XG5cbi8qZ2xvYmFsIG9iZWxpc2s6dHJ1ZSovXG5cbi8qXG4gKiBTaWRlWURpbWVuc2lvblxuICovXG5cbihmdW5jdGlvbiAob2JlbGlzaykge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgdmFyIFNpZGVZRGltZW5zaW9uLCBwO1xuXG4gICAgU2lkZVlEaW1lbnNpb24gPSBmdW5jdGlvbiAoeUF4aXMsIHpBeGlzKSB7XG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZSh5QXhpcywgekF4aXMpO1xuICAgIH07XG4gICAgcCA9IFNpZGVZRGltZW5zaW9uLnByb3RvdHlwZSA9IG5ldyBvYmVsaXNrLkFic3RyYWN0RGltZW5zaW9uKCk7XG5cbiAgICAvLyBjb25zdHJ1Y3RvclxuICAgIHAuaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uICh5QXhpcywgekF4aXMpIHtcbiAgICAgICAgdGhpcy55QXhpcyA9IHlBeGlzIHx8IDMwO1xuICAgICAgICB0aGlzLnpBeGlzID0gekF4aXMgfHwgMzA7XG5cbiAgICAgICAgaWYgKHRoaXMueUF4aXMgJSAyID09PSAxKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJ5QXhpcyBtdXN0IGJlIGV2ZW4gbnVtYmVyXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8geUF4aXMgfHwgekF4aXMgPSA0IGZsb29kRmlsbCBjb3VsZCBub3QgYmUgYXBwbGllZFxuICAgICAgICBpZiAodGhpcy55QXhpcyA8PSA0IHx8IHRoaXMuekF4aXMgPD0gMikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiZGltZW5zaW9uIGlzIHRvbyBzbWFsbFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICBwLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gXCJbU2lkZVlEaW1lbnNpb25dXCI7XG4gICAgfTtcblxuICAgIG9iZWxpc2suU2lkZVlEaW1lbnNpb24gPSBTaWRlWURpbWVuc2lvbjtcbn0ob2JlbGlzaykpO1xuXG4vKmdsb2JhbCBvYmVsaXNrOnRydWUqL1xuXG4vKlxuICogU2xvcGVEaW1lbnNpb25cbiAqL1xuXG4oZnVuY3Rpb24gKG9iZWxpc2spIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHZhciBTbG9wZURpbWVuc2lvbiwgcDtcbiAgICBTbG9wZURpbWVuc2lvbiA9IGZ1bmN0aW9uICh4QXhpcywgeUF4aXMpIHtcbiAgICAgICAgdGhpcy5pbml0aWFsaXplKHhBeGlzLCB5QXhpcyk7XG4gICAgfTtcbiAgICBwID0gU2xvcGVEaW1lbnNpb24ucHJvdG90eXBlID0gbmV3IG9iZWxpc2suQWJzdHJhY3REaW1lbnNpb24oKTtcblxuICAgIC8vIGNvbnN0cnVjdG9yXG4gICAgcC5pbml0aWFsaXplID0gZnVuY3Rpb24gKHhBeGlzLCB5QXhpcykge1xuICAgICAgICB0aGlzLnhBeGlzID0geEF4aXMgfHwgMzA7XG4gICAgICAgIHRoaXMueUF4aXMgPSB5QXhpcyB8fCAzMDtcblxuICAgICAgICBpZiAodGhpcy54QXhpcyAlIDIgPT09IDEgfHwgdGhpcy55QXhpcyAlIDIgPT09IDEpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcInhBeGlzIGFuZCB5QXhpcyBtdXN0IGJlIGV2ZW4gbnVtYmVyXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMueEF4aXMgPD0gNCB8fCB0aGlzLnlBeGlzIDw9IDQpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcImRpbWVuc2lvbiBpcyB0b28gc21hbGxcIik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgcC50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIFwiW1Nsb3BlRGltZW5zaW9uXVwiO1xuICAgIH07XG5cbiAgICBvYmVsaXNrLlNsb3BlRGltZW5zaW9uID0gU2xvcGVEaW1lbnNpb247XG59KG9iZWxpc2spKTtcblxuLypnbG9iYWwgb2JlbGlzazp0cnVlKi9cblxuLypcbiAqIEJpdG1hcERhdGFcbiAqL1xuXG4oZnVuY3Rpb24gKG9iZWxpc2spIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHZhciBCaXRtYXBEYXRhLCBwO1xuICAgIEJpdG1hcERhdGEgPSBmdW5jdGlvbiAodywgaCwgdXNlRGVmYXVsdENhbnZhcykge1xuICAgICAgICB0aGlzLmluaXRpYWxpemUodywgaCwgdXNlRGVmYXVsdENhbnZhcyk7XG4gICAgfTtcbiAgICBwID0gQml0bWFwRGF0YS5wcm90b3R5cGU7XG5cbiAgICAvLyBwdWJsaWMgcHJvcGVydHlcbiAgICBwLmltYWdlRGF0YSA9IG51bGw7XG4gICAgcC5jYW52YXMgPSBudWxsO1xuICAgIHAuY29udGV4dCA9IG51bGw7XG5cbiAgICAvLyBjb25zdHJ1Y3RvclxuICAgIHAuaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uICh3LCBoLCB1c2VEZWZhdWx0Q2FudmFzKSB7XG4gICAgICAgIGlmICh3ID09PSB1bmRlZmluZWQgfHwgaCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJCaXRtYXBEYXRhIHdpZHRoIG9yIGhlaWdodCBpcyBtaXNzaW5nXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHVzZURlZmF1bHRDYW52YXMpIHtcbiAgICAgICAgICAgIHRoaXMuY2FudmFzID0gb2JlbGlzay5DYW52YXNNYW5hZ2VyLmdldERlZmF1bHRDYW52YXMoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY2FudmFzID0gb2JlbGlzay5DYW52YXNNYW5hZ2VyLmdldE5ld0NhbnZhcygpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jYW52YXMuc2V0QXR0cmlidXRlKCd3aWR0aCcsIHcpO1xuICAgICAgICB0aGlzLmNhbnZhcy5zZXRBdHRyaWJ1dGUoJ2hlaWdodCcsIGgpO1xuXG4gICAgICAgIHRoaXMuY29udGV4dCA9IHRoaXMuY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gICAgICAgIHRoaXMuY29udGV4dC5jbGVhclJlY3QoMCwgMCwgdGhpcy5jYW52YXMud2lkdGgsIHRoaXMuY2FudmFzLmhlaWdodCk7XG5cbiAgICAgICAgdGhpcy5pbWFnZURhdGEgPSB0aGlzLmNvbnRleHQuY3JlYXRlSW1hZ2VEYXRhKHcsIGgpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICBwLnNldFBpeGVsID0gZnVuY3Rpb24gKHBvc1gsIHBvc1ksIGNvbG9yKSB7XG4gICAgICAgIHZhciBpbmRleCA9IChwb3NZICogdGhpcy5pbWFnZURhdGEud2lkdGggKyBwb3NYKSAqIDQ7XG4gICAgICAgIHRoaXMuc2V0UGl4ZWxCeUluZGV4KGluZGV4LCBjb2xvcik7XG4gICAgfTtcblxuICAgIHAuc2V0UGl4ZWxCeUluZGV4ID0gZnVuY3Rpb24gKGluZGV4LCBjb2xvcikge1xuICAgICAgICB2YXIgcGl4ZWxzID0gdGhpcy5pbWFnZURhdGEuZGF0YTtcbiAgICAgICAgcGl4ZWxzW2luZGV4XSA9IChjb2xvciA+Pj4gMTYpICYgMHhGRjtcbiAgICAgICAgcGl4ZWxzW2luZGV4ICsgMV0gPSAoY29sb3IgPj4+IDgpICYgMHhGRjtcbiAgICAgICAgcGl4ZWxzW2luZGV4ICsgMl0gPSAoY29sb3IgPj4+IDApICYgMHhGRjtcbiAgICAgICAgcGl4ZWxzW2luZGV4ICsgM10gPSAoY29sb3IgPj4+IDI0KSAmIDB4RkY7XG4gICAgfTtcblxuICAgIHAuY2hlY2tQaXhlbEF2YWlsYWJsZSA9IGZ1bmN0aW9uICh4LCB5KSB7XG4gICAgICAgIHZhciBpbmRleCA9ICh5ICogdGhpcy5pbWFnZURhdGEud2lkdGggKyB4KSAqIDQ7XG4gICAgICAgIHJldHVybiB0aGlzLmltYWdlRGF0YS5kYXRhW2luZGV4ICsgM10gPT09IDA7XG4gICAgfTtcblxuICAgIHAuZmxvb2RGaWxsID0gZnVuY3Rpb24gKHBvc1gsIHBvc1ksIGNvbG9yKSB7XG4gICAgICAgIGlmICgoKGNvbG9yID4+PiAyNCkgJiAweEZGKSA9PT0gMHgwMCkge1xuICAgICAgICAgICAgLy8gdHJhbnNwYXJlbnQgZmxvb2QgZmlsbFxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHggPSBwb3NYLCB5ID0gcG9zWSxcbiAgICAgICAgICAgIHN0YWNrID0gW10sXG4gICAgICAgICAgICBub3dDb2wgPSBbXSxcbiAgICAgICAgICAgIHByZXZDb2wgPSBbXSxcbiAgICAgICAgICAgIGNvbCwgcm93LCBtYXRjaEZsYWcsIG5ld1N0YXJ0LFxuICAgICAgICAgICAgdyA9IHRoaXMuaW1hZ2VEYXRhLndpZHRoLFxuICAgICAgICAgICAgaCA9IHRoaXMuaW1hZ2VEYXRhLmhlaWdodCxcbiAgICAgICAgICAgIGksIGo7XG5cbiAgICAgICAgLy8gYm91bmQgcmVhY2hcbiAgICAgICAgaWYgKHggPCAwIHx8IHkgPCAwIHx8IHggPj0gdyB8fCB5ID49IGgpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGZpcnN0IHBvaW50IGNoZWNrIGZhaWxcbiAgICAgICAgaWYgKCF0aGlzLmNoZWNrUGl4ZWxBdmFpbGFibGUoeCwgeSkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlN0YXJ0IHBvaW50IGZvciBmbG9vZCBmaWxsIGlzIGFscmVhZHkgZmlsbGVkXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gbGVmdCBzaWRlIGZsb29kIGZpbGxcbiAgICAgICAgZm9yIChjb2wgPSB4OyBjb2wgPj0gMDsgY29sIC09IDEpIHtcbiAgICAgICAgICAgIC8vIHRvcCBzaWRlXG4gICAgICAgICAgICBmb3IgKHJvdyA9IHk7IHJvdyA+PSAwOyByb3cgLT0gMSkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoZWNrUGl4ZWxBdmFpbGFibGUoY29sLCByb3cpKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGF2YWlsYWJsZSBwaXhlbFxuICAgICAgICAgICAgICAgICAgICBzdGFjay5wdXNoKChyb3cgKiB3ICsgY29sKSAqIDQpO1xuICAgICAgICAgICAgICAgICAgICBub3dDb2wucHVzaChyb3cpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGZpcnN0IG9uZSBpcyBpbnZhbGlkIHBpeGVsICYmIG5vdCBhdCBjb2wgdG9wXG4gICAgICAgICAgICAgICAgICAgIGlmIChyb3cgPT09IHkgJiYgdGhpcy5jaGVja1BpeGVsQXZhaWxhYmxlKGNvbCArIDEsIHJvdyAtIDEpKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIG5leHQgb25lIGlzIHZhbGlkXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jaGVja1BpeGVsQXZhaWxhYmxlKGNvbCwgcm93IC0gMSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdTdGFydCA9IHJvdyAtIDE7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoZWNrUGl4ZWxBdmFpbGFibGUoY29sICsgMSwgcm93IC0gMikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3U3RhcnQgPSByb3cgLSAyO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGZhaWwsIGFzc2lnbiBtYXggdmFsdWUgdG8gYXZvaWQgbG9vcCBiZWxvd1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdTdGFydCA9IC0xO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChyb3cgPSBuZXdTdGFydDsgcm93ID49IDA7IHJvdyAtPSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY2hlY2tQaXhlbEF2YWlsYWJsZShjb2wsIHJvdykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYXZhaWxhYmxlIHBpeGVsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YWNrLnB1c2goKHJvdyAqIHcgKyBjb2wpICogNCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vd0NvbC5wdXNoKHJvdyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgIC8vIGJvdHRvbSBzaWRlXG4gICAgICAgICAgICBmb3IgKHJvdyA9IHk7IHJvdyA8IGg7IHJvdyArPSAxKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY2hlY2tQaXhlbEF2YWlsYWJsZShjb2wsIHJvdykpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gYXZhaWxhYmxlIHBpeGVsXG4gICAgICAgICAgICAgICAgICAgIHN0YWNrLnB1c2goKHJvdyAqIHcgKyBjb2wpICogNCk7XG4gICAgICAgICAgICAgICAgICAgIG5vd0NvbC5wdXNoKHJvdyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gZmlyc3Qgb25lIGlzIGludmFsaWQgcGl4ZWwgJiYgbm90IGF0IGNvbCBib3R0b21cbiAgICAgICAgICAgICAgICAgICAgaWYgKHJvdyA9PT0geSAmJiB0aGlzLmNoZWNrUGl4ZWxBdmFpbGFibGUoY29sICsgMSwgcm93ICsgMSkpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gbmV4dCBvbmUgaXMgdmFsaWRcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoZWNrUGl4ZWxBdmFpbGFibGUoY29sLCByb3cgKyAxKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld1N0YXJ0ID0gcm93ICsgMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY2hlY2tQaXhlbEF2YWlsYWJsZShjb2wgKyAxLCByb3cgKyAyKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdTdGFydCA9IHJvdyArIDI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZmFpbCwgYXNzaWduIG1heCB2YWx1ZSB0byBhdm9pZCBsb29wIGJlbG93XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld1N0YXJ0ID0gaDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAocm93ID0gbmV3U3RhcnQ7IHJvdyA8IGg7IHJvdyArPSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY2hlY2tQaXhlbEF2YWlsYWJsZShjb2wsIHJvdykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYXZhaWxhYmxlIHBpeGVsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YWNrLnB1c2goKHJvdyAqIHcgKyBjb2wpICogNCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vd0NvbC5wdXNoKHJvdyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBjb21wYXJlIHdpdGggcHJldmlvdXMgY29sdW1uXG4gICAgICAgICAgICAvLyBmb3IgZmlyc3QgY29sdW1uXG4gICAgICAgICAgICAvLyB0aGUgZ2l2ZW4gcG9pbnQgc2hvdWxkIGJlIGluc2lkZSB0aGUgY29udGFpbmVyXG4gICAgICAgICAgICBpZiAoY29sID09PSB4KSB7XG4gICAgICAgICAgICAgICAgcHJldkNvbCA9IG5vd0NvbC5jb25jYXQoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbWF0Y2hGbGFnID0gZmFsc2U7XG5cbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBwcmV2Q29sLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICAgICAgZm9yIChqID0gMDsgaiA8IHByZXZDb2wubGVuZ3RoOyBqICs9IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5vd0NvbFtqXSA9PT0gcHJldkNvbFtpXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWF0Y2hGbGFnID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHkgPSBwcmV2Q29sW2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAobWF0Y2hGbGFnKSB7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG1hdGNoRmxhZykge1xuICAgICAgICAgICAgICAgIHByZXZDb2wgPSBub3dDb2wuY29uY2F0KCk7XG4gICAgICAgICAgICAgICAgbm93Q29sID0gW107XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIGJvdW5kIHJlYWNoXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyByZXNldCBzdGFydCBwb2ludFxuICAgICAgICB4ID0gcG9zWDtcbiAgICAgICAgeSA9IHBvc1k7XG4gICAgICAgIHByZXZDb2wgPSBbXTtcbiAgICAgICAgbm93Q29sID0gW107XG5cbiAgICAgICAgLy8gcmlnaHQgc2lkZSBmbG9vZCBmaWxsXG4gICAgICAgIGZvciAoY29sID0geDsgY29sIDwgdzsgY29sICs9IDEpIHtcblxuICAgICAgICAgICAgLy8gdG9wIHNpZGVcbiAgICAgICAgICAgIGZvciAocm93ID0geTsgcm93ID49IDA7IHJvdyAtPSAxKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY2hlY2tQaXhlbEF2YWlsYWJsZShjb2wsIHJvdykpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gYXZhaWxhYmxlIHBpeGVsXG4gICAgICAgICAgICAgICAgICAgIHN0YWNrLnB1c2goKHJvdyAqIHcgKyBjb2wpICogNCk7XG4gICAgICAgICAgICAgICAgICAgIG5vd0NvbC5wdXNoKHJvdyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gZmlyc3Qgb25lIGlzIGludmFsaWQgcGl4ZWwgJiYgbm90IGF0IGNvbCB0b3BcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJvdyA9PT0geSAmJiB0aGlzLmNoZWNrUGl4ZWxBdmFpbGFibGUoY29sIC0gMSwgcm93IC0gMSkpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gbmV4dCBvbmUgaXMgdmFsaWRcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoZWNrUGl4ZWxBdmFpbGFibGUoY29sLCByb3cgLSAxKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld1N0YXJ0ID0gcm93IC0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY2hlY2tQaXhlbEF2YWlsYWJsZShjb2wgLSAxLCByb3cgLSAyKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdTdGFydCA9IHJvdyAtIDI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZmFpbCwgYXNzaWduIG1heCB2YWx1ZSB0byBhdm9pZCBsb29wIGJlbG93XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld1N0YXJ0ID0gLTE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHJvdyA9IG5ld1N0YXJ0OyByb3cgPj0gMDsgcm93IC09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jaGVja1BpeGVsQXZhaWxhYmxlKGNvbCwgcm93KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhdmFpbGFibGUgcGl4ZWxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhY2sucHVzaCgocm93ICogdyArIGNvbCkgKiA0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm93Q29sLnB1c2gocm93KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGJvdHRvbSBzaWRlXG4gICAgICAgICAgICBmb3IgKHJvdyA9IHk7IHJvdyA8IGg7IHJvdyArPSAxKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY2hlY2tQaXhlbEF2YWlsYWJsZShjb2wsIHJvdykpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gYXZhaWxhYmxlIHBpeGVsXG4gICAgICAgICAgICAgICAgICAgIHN0YWNrLnB1c2goKHJvdyAqIHcgKyBjb2wpICogNCk7XG4gICAgICAgICAgICAgICAgICAgIG5vd0NvbC5wdXNoKHJvdyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gZmlyc3Qgb25lIGlzIGludmFsaWQgcGl4ZWwgJiYgbm90IGF0IGNvbCBib3R0b21cbiAgICAgICAgICAgICAgICAgICAgaWYgKHJvdyA9PT0geSAmJiB0aGlzLmNoZWNrUGl4ZWxBdmFpbGFibGUoY29sIC0gMSwgcm93ICsgMSkpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gbmV4dCBvbmUgaXMgdmFsaWRcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoZWNrUGl4ZWxBdmFpbGFibGUoY29sLCByb3cgKyAxKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld1N0YXJ0ID0gcm93ICsgMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY2hlY2tQaXhlbEF2YWlsYWJsZShjb2wgLSAxLCByb3cgKyAyKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdTdGFydCA9IHJvdyArIDI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZmFpbCwgYXNzaWduIG1heCB2YWx1ZSB0byBhdm9pZCBsb29wIGJlbG93XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld1N0YXJ0ID0gaDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAocm93ID0gbmV3U3RhcnQ7IHJvdyA8IGg7IHJvdyArPSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY2hlY2tQaXhlbEF2YWlsYWJsZShjb2wsIHJvdykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYXZhaWxhYmxlIHBpeGVsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YWNrLnB1c2goKHJvdyAqIHcgKyBjb2wpICogNCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vd0NvbC5wdXNoKHJvdyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBjb21wYXJlIHdpdGggcHJldmlvdXMgY29sdW1uXG4gICAgICAgICAgICAvLyBmb3IgZmlyc3QgY29sdW1uXG4gICAgICAgICAgICAvLyB0aGUgZ2l2ZW4gcG9pbnQgc2hvdWxkIGJlIGluc2lkZSB0aGUgY29udGFpbmVyXG4gICAgICAgICAgICBpZiAoY29sID09PSB4KSB7XG4gICAgICAgICAgICAgICAgcHJldkNvbCA9IG5vd0NvbC5jb25jYXQoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbWF0Y2hGbGFnID0gZmFsc2U7XG5cbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBwcmV2Q29sLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICAgICAgZm9yIChqID0gMDsgaiA8IHByZXZDb2wubGVuZ3RoOyBqICs9IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5vd0NvbFtqXSA9PT0gcHJldkNvbFtpXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWF0Y2hGbGFnID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHkgPSBwcmV2Q29sW2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAobWF0Y2hGbGFnKSB7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG1hdGNoRmxhZykge1xuICAgICAgICAgICAgICAgIHByZXZDb2wgPSBub3dDb2wuY29uY2F0KCk7XG4gICAgICAgICAgICAgICAgbm93Q29sID0gW107XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIGJvdW5kIHJlYWNoXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBmaWxsIGltYWdlIGRhdGFcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IHN0YWNrLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICB0aGlzLnNldFBpeGVsQnlJbmRleChzdGFja1tpXSwgY29sb3IpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIHAudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBcIltCaXRtYXBEYXRhXVwiO1xuICAgIH07XG5cbiAgICBvYmVsaXNrLkJpdG1hcERhdGEgPSBCaXRtYXBEYXRhO1xufShvYmVsaXNrKSk7XG5cbi8qZ2xvYmFsIG9iZWxpc2s6dHJ1ZSovXG5cbi8qXG4gKiBQaXhlbE9iamVjdFxuICovXG5cbihmdW5jdGlvbiAob2JlbGlzaykge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgdmFyIFBpeGVsT2JqZWN0LCBwO1xuICAgIFBpeGVsT2JqZWN0ID0gZnVuY3Rpb24gKHByaW1pdGl2ZSwgcG9pbnQzRCkge1xuICAgICAgICB0aGlzLmluaXRpYWxpemUocHJpbWl0aXZlLCBwb2ludDNEKTtcbiAgICB9O1xuICAgIHAgPSBQaXhlbE9iamVjdC5wcm90b3R5cGU7XG5cbiAgICAvLyBwdWJsaWMgcHJvcGVydGllc1xuICAgIHAueCA9IG51bGw7XG4gICAgcC55ID0gbnVsbDtcbiAgICBwLmNhbnZhcyA9IG51bGw7XG5cbiAgICAvLyBjb25zdHJ1Y3RvclxuICAgIHAuaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uIChwcmltaXRpdmUsIHBvaW50M0QpIHtcbiAgICAgICAgaWYgKCFwcmltaXRpdmUpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlByaW1pdGl2ZSBpcyBub3QgZGVmaW5lZFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBwM0QgPSBwb2ludDNEIHx8IG5ldyBvYmVsaXNrLlBvaW50M0QoKTtcblxuICAgICAgICB0aGlzLmNhbnZhcyA9IHByaW1pdGl2ZS5jYW52YXM7XG4gICAgICAgIHRoaXMueCA9IHByaW1pdGl2ZS5tYXRyaXgudHggKyBwM0QueCAtIHAzRC55O1xuICAgICAgICB0aGlzLnkgPSBwcmltaXRpdmUubWF0cml4LnR5ICsgTWF0aC5mbG9vcihwM0QueCAvIDIgKyBwM0QueSAvIDIpIC0gcDNELno7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIC8vIHB1YmxpYyBtZXRob2RzXG5cbiAgICAvLyB0b2RvOiBhZGQgY2FudmFzIHJlbW92ZSBtZXRob2RcblxuICAgIHAudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBcIltQaXhlbE9iamVjdF1cIjtcbiAgICB9O1xuXG4gICAgLy8gcHJpdmF0ZSBtZXRob2RzXG5cbiAgICBvYmVsaXNrLlBpeGVsT2JqZWN0ID0gUGl4ZWxPYmplY3Q7XG59KG9iZWxpc2spKTtcblxuLypnbG9iYWwgb2JlbGlzazp0cnVlLCBqUXVlcnk6dHJ1ZSovXG5cbi8qXG4gKiBQaXhlbFZpZXdcbiAqL1xuXG4oZnVuY3Rpb24gKG9iZWxpc2spIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHZhciBQaXhlbFZpZXcsIHA7XG4gICAgUGl4ZWxWaWV3ID0gZnVuY3Rpb24gKGNhbnZhcywgcG9pbnQpIHtcbiAgICAgICAgdGhpcy5pbml0aWFsaXplKGNhbnZhcywgcG9pbnQpO1xuICAgIH07XG4gICAgcCA9IFBpeGVsVmlldy5wcm90b3R5cGU7XG5cbiAgICAvLyBwdWJsaWMgcHJvcGVydGllc1xuICAgIHAuY2FudmFzID0gbnVsbDtcbiAgICBwLmNvbnRleHQgPSBudWxsO1xuICAgIHAucG9pbnQgPSBudWxsO1xuXG4gICAgLy8gY29uc3RydWN0b3JcbiAgICBwLmluaXRpYWxpemUgPSBmdW5jdGlvbiAoY2FudmFzLCBwb2ludCkge1xuICAgICAgICBpZiAoIWNhbnZhcykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2FudmFzIGlzIG5vdCBkZWZpbmVkXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlmIChjYW52YXMgaW5zdGFuY2VvZiBqUXVlcnkpIHtcbiAgICAgICAgICAgICAgICBjYW52YXMgPSBjYW52YXMuZ2V0KDApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNhbnZhcyA9IGNhbnZhcztcbiAgICAgICAgdGhpcy5jb250ZXh0ID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICAgICAgdGhpcy5wb2ludCA9IHBvaW50IHx8IG5ldyBvYmVsaXNrLlBvaW50KDAsIDApO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICAvLyBwdWJsaWMgbWV0aG9kc1xuICAgIHAucmVuZGVyT2JqZWN0ID0gZnVuY3Rpb24gKHByaW1pdGl2ZSwgcG9pbnQzRCkge1xuICAgICAgICB2YXIgcG8gPSBuZXcgb2JlbGlzay5QaXhlbE9iamVjdChwcmltaXRpdmUsIHBvaW50M0QpO1xuICAgICAgICB0aGlzLmNvbnRleHQuZHJhd0ltYWdlKHBvLmNhbnZhcywgdGhpcy5wb2ludC54ICsgcG8ueCwgdGhpcy5wb2ludC55ICsgcG8ueSk7XG4gICAgfTtcblxuICAgIHAuY2xlYXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuY29udGV4dC5jbGVhclJlY3QoMCwgMCwgdGhpcy5jYW52YXMud2lkdGgsIHRoaXMuY2FudmFzLmhlaWdodCk7XG4gICAgfTtcblxuICAgIHAudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBcIltQaXhlbFZpZXddXCI7XG4gICAgfTtcblxuICAgIG9iZWxpc2suUGl4ZWxWaWV3ID0gUGl4ZWxWaWV3O1xufShvYmVsaXNrKSk7XG5cbi8qZ2xvYmFsIG9iZWxpc2s6dHJ1ZSovXG5cbi8qXG4gKiBNYXRyaXhcbiAqL1xuXG4oZnVuY3Rpb24gKG9iZWxpc2spIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHZhciBNYXRyaXgsIHA7XG4gICAgTWF0cml4ID0gZnVuY3Rpb24gKGEsIGIsIGMsIGQsIHR4LCB0eSkge1xuICAgICAgICB0aGlzLmluaXRpYWxpemUoYSwgYiwgYywgZCwgdHgsIHR5KTtcbiAgICB9O1xuICAgIHAgPSBNYXRyaXgucHJvdG90eXBlO1xuXG4gICAgLy8gcHVibGljIHByb3BlcnRpZXM6XG4gICAgLyoqXG4gICAgICogUG9zaXRpb24gKDAsIDApIGluIGEgM3gzIG1hdHJpeC5cbiAgICAgKiBAcHJvcGVydHkgYVxuICAgICAqIEB0eXBlIE51bWJlclxuICAgICAqKi9cbiAgICBwLmEgPSAxO1xuXG4gICAgLyoqXG4gICAgICogUG9zaXRpb24gKDAsIDEpIGluIGEgM3gzIG1hdHJpeC5cbiAgICAgKiBAcHJvcGVydHkgYlxuICAgICAqIEB0eXBlIE51bWJlclxuICAgICAqKi9cbiAgICBwLmIgPSAwO1xuXG4gICAgLyoqXG4gICAgICogUG9zaXRpb24gKDEsIDApIGluIGEgM3gzIG1hdHJpeC5cbiAgICAgKiBAcHJvcGVydHkgY1xuICAgICAqIEB0eXBlIE51bWJlclxuICAgICAqKi9cbiAgICBwLmMgPSAwO1xuXG4gICAgLyoqXG4gICAgICogUG9zaXRpb24gKDEsIDEpIGluIGEgM3gzIG1hdHJpeC5cbiAgICAgKiBAcHJvcGVydHkgZFxuICAgICAqIEB0eXBlIE51bWJlclxuICAgICAqKi9cbiAgICBwLmQgPSAxO1xuXG4gICAgLyoqXG4gICAgICogUG9zaXRpb24gKDIsIDApIGluIGEgM3gzIG1hdHJpeC5cbiAgICAgKiBAcHJvcGVydHkgdHhcbiAgICAgKiBAdHlwZSBOdW1iZXJcbiAgICAgKiovXG4gICAgcC50eCA9IDA7XG5cbiAgICAvKipcbiAgICAgKiBQb3NpdGlvbiAoMiwgMSkgaW4gYSAzeDMgbWF0cml4LlxuICAgICAqIEBwcm9wZXJ0eSB0eVxuICAgICAqIEB0eXBlIE51bWJlclxuICAgICAqKi9cbiAgICBwLnR5ID0gMDtcblxuICAgIC8vIGNvbnN0cnVjdG9yXG4gICAgcC5pbml0aWFsaXplID0gZnVuY3Rpb24gKGEsIGIsIGMsIGQsIHR4LCB0eSkge1xuICAgICAgICB0aGlzLmEgPSAoYSA9PT0gdW5kZWZpbmVkKSA/IDEgOiBhO1xuICAgICAgICB0aGlzLmIgPSBiIHx8IDA7XG4gICAgICAgIHRoaXMuYyA9IGMgfHwgMDtcbiAgICAgICAgdGhpcy5kID0gKGQgPT09IHVuZGVmaW5lZCkgPyAxIDogZDtcbiAgICAgICAgdGhpcy50eCA9IHR4IHx8IDA7XG4gICAgICAgIHRoaXMudHkgPSB0eSB8fCAwO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgLy8gcHVibGljIG1ldGhvZHNcbiAgICBwLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gXCJbTWF0cml4XVwiO1xuICAgIH07XG5cbiAgICBvYmVsaXNrLk1hdHJpeCA9IE1hdHJpeDtcbn0ob2JlbGlzaykpO1xuXG4vKmdsb2JhbCBvYmVsaXNrOnRydWUqL1xuXG4vKlxuICogUG9pbnRcbiAqL1xuXG4oZnVuY3Rpb24gKG9iZWxpc2spIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHZhciBQb2ludCwgcDtcbiAgICBQb2ludCA9IGZ1bmN0aW9uICh4LCB5KSB7XG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZSh4LCB5KTtcbiAgICB9O1xuICAgIHAgPSBQb2ludC5wcm90b3R5cGU7XG5cbiAgICAvLyBwdWJsaWMgcHJvcGVydGllc1xuICAgIHAueCA9IDA7XG4gICAgcC55ID0gMDtcblxuICAgIC8vIGNvbnN0cnVjdG9yXG4gICAgcC5pbml0aWFsaXplID0gZnVuY3Rpb24gKHgsIHkpIHtcbiAgICAgICAgdGhpcy54ID0gKHggPT09IHVuZGVmaW5lZCA/IDAgOiB4KTtcbiAgICAgICAgdGhpcy55ID0gKHkgPT09IHVuZGVmaW5lZCA/IDAgOiB5KTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIC8vIHB1YmxpYyBtZXRob2RzXG4gICAgcC50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIFwiW1BvaW50IHggOiBcIiArIHRoaXMueCArIFwiLCB5IDogXCIgKyB0aGlzLnkgKyBcIl1cIjtcbiAgICB9O1xuXG4gICAgLy8gcHJpdmF0ZSBtZXRob2RzXG5cbiAgICBvYmVsaXNrLlBvaW50ID0gUG9pbnQ7XG59KG9iZWxpc2spKTtcblxuLypnbG9iYWwgb2JlbGlzazp0cnVlKi9cblxuLypcbiAqIFBvaW50M0RcbiAqL1xuXG4oZnVuY3Rpb24gKG9iZWxpc2spIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHZhciBQb2ludDNELCBwO1xuICAgIFBvaW50M0QgPSBmdW5jdGlvbiAoeCwgeSwgeikge1xuICAgICAgICB0aGlzLmluaXRpYWxpemUoeCwgeSwgeik7XG4gICAgfTtcbiAgICBwID0gUG9pbnQzRC5wcm90b3R5cGU7XG5cbiAgICAvLyBwdWJsaWMgcHJvcGVydGllc1xuICAgIHAueCA9IDA7XG4gICAgcC55ID0gMDtcbiAgICBwLnogPSAwO1xuXG4gICAgLy8gY29uc3RydWN0b3JcbiAgICBwLmluaXRpYWxpemUgPSBmdW5jdGlvbiAoeCwgeSwgeikge1xuICAgICAgICB0aGlzLnggPSAoeCA9PT0gdW5kZWZpbmVkID8gMCA6IHgpO1xuICAgICAgICB0aGlzLnkgPSAoeSA9PT0gdW5kZWZpbmVkID8gMCA6IHkpO1xuICAgICAgICB0aGlzLnogPSAoeiA9PT0gdW5kZWZpbmVkID8gMCA6IHopO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgLy8gcHVibGljIG1ldGhvZHNcbiAgICBwLnRvR2xvYmFsQ29vcmRpbmF0ZXMgPSBmdW5jdGlvbiAob2Zmc2V0KSB7XG4gICAgICAgIHZhciBwMkQgPSBuZXcgb2JlbGlzay5Qb2ludChcbiAgICAgICAgICAgIHRoaXMueCAtIHRoaXMueSxcbiAgICAgICAgICAgIE1hdGguZmxvb3IodGhpcy54IC8gMiArIHRoaXMueSAvIDIpIC0gdGhpcy56XG4gICAgICAgICk7XG5cbiAgICAgICAgaWYgKG9mZnNldCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBwMkQueCA9IHAyRC54ICsgb2Zmc2V0Lng7XG4gICAgICAgICAgICBwMkQueSA9IHAyRC55ICsgb2Zmc2V0Lnk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcDJEO1xuICAgIH07XG5cbiAgICBwLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gXCJbUG9pbnQzRCB4IDogXCIgKyB0aGlzLnggKyBcIiwgeSA6IFwiICsgdGhpcy55ICsgXCIsIHo6IFwiICsgdGhpcy56ICsgXCJdXCI7XG4gICAgfTtcblxuICAgIC8vIHByaXZhdGUgbWV0aG9kc1xuXG4gICAgb2JlbGlzay5Qb2ludDNEID0gUG9pbnQzRDtcbn0ob2JlbGlzaykpO1xuXG4vKmdsb2JhbCBvYmVsaXNrOnRydWUqL1xuXG4vKlxuICogQWJzdHJhY3RQcmltaXRpdmVcbiAqL1xuXG4oZnVuY3Rpb24gKG9iZWxpc2spIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHZhciBBYnN0cmFjdFByaW1pdGl2ZSwgcDtcbiAgICBBYnN0cmFjdFByaW1pdGl2ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5pbml0aWFsaXplKCk7XG4gICAgfTtcbiAgICBwID0gQWJzdHJhY3RQcmltaXRpdmUucHJvdG90eXBlO1xuXG4gICAgLy8gcHVibGljIHByb3BlcnRpZXNcbiAgICAvKipcbiAgICAgKiB0aGUgY2FudmFzIGZvciBkcmF3SW1hZ2UgdG8gYW55IGNhbnZhc1xuICAgICAqL1xuICAgIHAuY2FudmFzID0gbnVsbDtcblxuICAgIC8vIHByb3RlY3QgcHJvcGVydGllc1xuICAgIC8qKlxuICAgICAqIHRoZSB3aWR0aCBvZiB0aGUgYml0bWFwIGluIDJkIGZsYXNoIGNvb3JkaW5hdGVcbiAgICAgKi9cbiAgICBwLncgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogdGhlIGhlaWdodCBvZiB0aGUgYml0bWFwIGluIDJkIGZsYXNoIGNvb3JkaW5hdGVcbiAgICAgKi9cbiAgICBwLmggPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogdGhlIGRpbWVuc2lvbiBvZiBwcmltaXRpdmUgaW4gM2QgcGl4ZWwgY29vcmRpbmF0ZVxuICAgICAqL1xuICAgIHAuZGltZW5zaW9uID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIHRoZSBjb2xvciBvYmogb2YgdGhlIHByaW1pdGl2ZVxuICAgICAqL1xuICAgIHAuY29sb3IgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogdGhlIGJvcmRlciBvcHRpb24gb2YgdGhlIHByaW1pdGl2ZVxuICAgICAqL1xuICAgIHAuYm9yZGVyID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIHRoZSBzb3VyY2UgYml0bWFwZGF0YSBjb250YWlucyBwaXhlbCBncmFwaGljXG4gICAgICovXG4gICAgcC5iaXRtYXBEYXRhID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIHRoZSBwcmVzZXJ2ZSBjYW52YXMgb3B0aW9uXG4gICAgICovXG4gICAgcC51c2VEZWZhdWx0Q2FudmFzID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIHRoZSBtYXRyaXggb2Zmc2V0IGJldHdlZW4gdGhlIGJpdG1hcCBhbmQgdGhlIDNkIHBpeGVsIGNvb3JkaW5hdGUgWkVSTyBwb2ludFxuICAgICAqL1xuICAgIHAubWF0cml4ID0gbnVsbDtcblxuICAgIC8vIGNvbnN0cnVjdG9yXG4gICAgcC5pbml0aWFsaXplID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgLy8gcHVibGljIG1ldGhvZHNcbiAgICBwLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gXCJbQWJzdHJhY3RQcmltaXRpdmVdXCI7XG4gICAgfTtcblxuICAgIC8vIHByaXZhdGUgbWV0aG9kc1xuXG4gICAgb2JlbGlzay5BYnN0cmFjdFByaW1pdGl2ZSA9IEFic3RyYWN0UHJpbWl0aXZlO1xufShvYmVsaXNrKSk7XG5cbi8qZ2xvYmFsIG9iZWxpc2s6dHJ1ZSovXG5cbi8qXG4gKiBCcmlja1xuICovXG5cbihmdW5jdGlvbiAob2JlbGlzaykge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgdmFyIEJyaWNrLCBwO1xuICAgIEJyaWNrID0gZnVuY3Rpb24gKGRpbWVuc2lvbiwgY29sb3IsIGJvcmRlciwgdXNlRGVmYXVsdENhbnZhcykge1xuICAgICAgICB0aGlzLmluaXRpYWxpemUoZGltZW5zaW9uLCBjb2xvciwgYm9yZGVyLCB1c2VEZWZhdWx0Q2FudmFzKTtcbiAgICB9O1xuICAgIHAgPSBCcmljay5wcm90b3R5cGUgPSBuZXcgb2JlbGlzay5BYnN0cmFjdFByaW1pdGl2ZSgpO1xuXG4gICAgLy8gcHVibGljIHByb3BlcnRpZXNcblxuICAgIC8vIGNvbnN0cnVjdG9yXG4gICAgcC5pbml0aWFsaXplID0gZnVuY3Rpb24gKGRpbWVuc2lvbiwgY29sb3IsIGJvcmRlciwgdXNlRGVmYXVsdENhbnZhcykge1xuICAgICAgICB0aGlzLmluaXRSZW5kZXIoZGltZW5zaW9uLCBjb2xvciwgYm9yZGVyLCB1c2VEZWZhdWx0Q2FudmFzKTtcbiAgICAgICAgdGhpcy5pbml0UmVjdGFuZ2xlKCk7XG4gICAgICAgIHRoaXMuaW5pdEJpdG1hcERhdGEoKTtcbiAgICAgICAgdGhpcy5idWlsZCgpO1xuICAgICAgICB0aGlzLnJlbmRlckJpdG1hcERhdGFGb3JDYW52YXMoKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIC8vIHByaXZhdGUgbWV0aG9kXG4gICAgcC5pbml0UmVuZGVyID0gZnVuY3Rpb24gKGRpbWVuc2lvbiwgY29sb3IsIGJvcmRlciwgdXNlRGVmYXVsdENhbnZhcykge1xuICAgICAgICB0aGlzLnVzZURlZmF1bHRDYW52YXMgPSB1c2VEZWZhdWx0Q2FudmFzIHx8IGZhbHNlO1xuICAgICAgICB0aGlzLmJvcmRlciA9IGJvcmRlciB8fCBib3JkZXIgPT09IHVuZGVmaW5lZDtcbiAgICAgICAgdGhpcy5kaW1lbnNpb24gPSBkaW1lbnNpb24gPT09IHVuZGVmaW5lZCA/IG5ldyBvYmVsaXNrLkJyaWNrRGltZW5zaW9uKCkgOiBkaW1lbnNpb247XG4gICAgICAgIHRoaXMuY29sb3IgPSBjb2xvciA9PT0gdW5kZWZpbmVkID8gbmV3IG9iZWxpc2suU2lkZUNvbG9yKCkgOiBjb2xvcjtcbiAgICB9O1xuXG4gICAgcC5pbml0UmVjdGFuZ2xlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLncgPSB0aGlzLmRpbWVuc2lvbi54QXhpcyArIHRoaXMuZGltZW5zaW9uLnlBeGlzO1xuICAgICAgICB0aGlzLmggPSAodGhpcy5kaW1lbnNpb24ueEF4aXMgKyB0aGlzLmRpbWVuc2lvbi55QXhpcykgLyAyO1xuXG4gICAgICAgIC8vIDIyLjYgZGVncmVlcyBpbXBsZW1lbnRhdGlvblxuICAgICAgICB0aGlzLncgLT0gMjtcbiAgICAgICAgdGhpcy5oIC09IDE7XG5cbiAgICAgICAgLy8gdGhlIG1hdHJpeCBvZmZzZXQgYmV0d2VlbiB0aGUgYml0bWFwIGFuZCB0aGUgM2QgcGl4ZWwgY29vcmRpbmF0ZSBaRVJPIHBvaW50XG4gICAgICAgIHRoaXMubWF0cml4ID0gbmV3IG9iZWxpc2suTWF0cml4KCk7XG4gICAgICAgIHRoaXMubWF0cml4LnR4ID0gLXRoaXMuZGltZW5zaW9uLnlBeGlzICsgMjtcbiAgICAgICAgdGhpcy5tYXRyaXgudHkgPSAwO1xuICAgIH07XG5cbiAgICBwLmluaXRCaXRtYXBEYXRhID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmJpdG1hcERhdGEgPSBuZXcgb2JlbGlzay5CaXRtYXBEYXRhKHRoaXMudywgdGhpcy5oLCB0aGlzLnVzZURlZmF1bHRDYW52YXMpO1xuICAgIH07XG4gICAgcC5yZW5kZXJCaXRtYXBEYXRhRm9yQ2FudmFzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmJpdG1hcERhdGEuY29udGV4dC5wdXRJbWFnZURhdGEodGhpcy5iaXRtYXBEYXRhLmltYWdlRGF0YSwgMCwgMCk7XG4gICAgICAgIHRoaXMuY2FudmFzID0gdGhpcy5iaXRtYXBEYXRhLmNhbnZhcztcbiAgICB9O1xuXG4gICAgcC5idWlsZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHhPZmZzZXRJbm5lciwgeU9mZnNldElubmVyLCB4T2Zmc2V0T3V0LCB5T2Zmc2V0T3V0LCBpLCBqLCBib3JkZXJDb2xvcjtcbiAgICAgICAgeE9mZnNldElubmVyID0gdGhpcy5kaW1lbnNpb24ueUF4aXMgLSAyO1xuICAgICAgICB5T2Zmc2V0SW5uZXIgPSAwO1xuICAgICAgICB4T2Zmc2V0T3V0ID0gdGhpcy5kaW1lbnNpb24ueEF4aXMgLSAxO1xuICAgICAgICB5T2Zmc2V0T3V0ID0gdGhpcy5oIC0gMTtcbiAgICAgICAgYm9yZGVyQ29sb3IgPSB0aGlzLmJvcmRlciA/IHRoaXMuY29sb3IuYm9yZGVyIDogdGhpcy5jb2xvci5pbm5lcjtcblxuICAgICAgICAvL3ggYXhpc1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5kaW1lbnNpb24ueEF4aXM7IGkgKz0gMSkge1xuICAgICAgICAgICAgdGhpcy5iaXRtYXBEYXRhLnNldFBpeGVsKHhPZmZzZXRJbm5lciArIGksIHlPZmZzZXRJbm5lciArIE1hdGguZmxvb3IoaSAvIDIpLCBib3JkZXJDb2xvcik7XG4gICAgICAgICAgICB0aGlzLmJpdG1hcERhdGEuc2V0UGl4ZWwoeE9mZnNldE91dCAtIGksIHlPZmZzZXRPdXQgLSBNYXRoLmZsb29yKGkgLyAyKSwgYm9yZGVyQ29sb3IpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy95IGF4aXNcbiAgICAgICAgZm9yIChqID0gMDsgaiA8IHRoaXMuZGltZW5zaW9uLnlBeGlzOyBqICs9IDEpIHtcbiAgICAgICAgICAgIHRoaXMuYml0bWFwRGF0YS5zZXRQaXhlbCh4T2Zmc2V0SW5uZXIgKyAxIC0gaiwgeU9mZnNldElubmVyICsgTWF0aC5mbG9vcihqIC8gMiksIGJvcmRlckNvbG9yKTtcbiAgICAgICAgICAgIHRoaXMuYml0bWFwRGF0YS5zZXRQaXhlbCh4T2Zmc2V0T3V0IC0gMSArIGosIHlPZmZzZXRPdXQgLSBNYXRoLmZsb29yKGogLyAyKSwgYm9yZGVyQ29sb3IpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9maWxsIGFuIHBpeGVsIGdyYXBoaWMgZW5jbG9zZWRcbiAgICAgICAgdGhpcy5iaXRtYXBEYXRhLmZsb29kRmlsbChNYXRoLmZsb29yKHRoaXMudyAvIDIpLCBNYXRoLmZsb29yKHRoaXMuaCAvIDIpLCB0aGlzLmNvbG9yLmlubmVyKTtcbiAgICB9O1xuXG4gICAgLy8gcHVibGljIG1ldGhvZHNcbiAgICBwLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gXCJbQnJpY2tdXCI7XG4gICAgfTtcblxuICAgIG9iZWxpc2suQnJpY2sgPSBCcmljaztcbn0ob2JlbGlzaykpO1xuXG4vKmdsb2JhbCBvYmVsaXNrOnRydWUqL1xuXG4vKlxuICogQ3ViZVxuICovXG5cbihmdW5jdGlvbiAob2JlbGlzaykge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgdmFyIEN1YmUsIHA7XG4gICAgQ3ViZSA9IGZ1bmN0aW9uIChkaW1lbnNpb24sIGNvbG9yLCBib3JkZXIsIHVzZURlZmF1bHRDYW52YXMpIHtcbiAgICAgICAgdGhpcy5pbml0aWFsaXplKGRpbWVuc2lvbiwgY29sb3IsIGJvcmRlciwgdXNlRGVmYXVsdENhbnZhcyk7XG4gICAgfTtcbiAgICBwID0gQ3ViZS5wcm90b3R5cGUgPSBuZXcgb2JlbGlzay5BYnN0cmFjdFByaW1pdGl2ZSgpO1xuXG4gICAgLy8gcHVibGljIHByb3BlcnRpZXNcblxuICAgIC8vIGNvbnN0cnVjdG9yXG4gICAgcC5pbml0aWFsaXplID0gZnVuY3Rpb24gKGRpbWVuc2lvbiwgY29sb3IsIGJvcmRlciwgdXNlRGVmYXVsdENhbnZhcykge1xuICAgICAgICB0aGlzLmluaXRSZW5kZXIoZGltZW5zaW9uLCBjb2xvciwgYm9yZGVyLCB1c2VEZWZhdWx0Q2FudmFzKTtcbiAgICAgICAgdGhpcy5pbml0UmVjdGFuZ2xlKCk7XG4gICAgICAgIHRoaXMuaW5pdEJpdG1hcERhdGEoKTtcbiAgICAgICAgdGhpcy5idWlsZCgpO1xuICAgICAgICB0aGlzLnJlbmRlckJpdG1hcERhdGFGb3JDYW52YXMoKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIC8vIHByaXZhdGUgbWV0aG9kXG4gICAgcC5pbml0UmVuZGVyID0gZnVuY3Rpb24gKGRpbWVuc2lvbiwgY29sb3IsIGJvcmRlciwgdXNlRGVmYXVsdENhbnZhcykge1xuICAgICAgICB0aGlzLnVzZURlZmF1bHRDYW52YXMgPSB1c2VEZWZhdWx0Q2FudmFzIHx8IGZhbHNlO1xuICAgICAgICB0aGlzLmJvcmRlciA9IGJvcmRlciB8fCBib3JkZXIgPT09IHVuZGVmaW5lZDtcbiAgICAgICAgdGhpcy5kaW1lbnNpb24gPSBkaW1lbnNpb24gPT09IHVuZGVmaW5lZCA/IG5ldyBvYmVsaXNrLkN1YmVEaW1lbnNpb24oKSA6IGRpbWVuc2lvbjtcbiAgICAgICAgdGhpcy5jb2xvciA9IGNvbG9yID09PSB1bmRlZmluZWQgPyBuZXcgb2JlbGlzay5DdWJlQ29sb3IoKSA6IGNvbG9yO1xuICAgIH07XG5cbiAgICBwLmluaXRSZWN0YW5nbGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMudyA9IHRoaXMuZGltZW5zaW9uLnhBeGlzICsgdGhpcy5kaW1lbnNpb24ueUF4aXM7XG4gICAgICAgIHRoaXMuaCA9IHRoaXMuZGltZW5zaW9uLnpBeGlzICsgKHRoaXMuZGltZW5zaW9uLnhBeGlzICsgdGhpcy5kaW1lbnNpb24ueUF4aXMpIC8gMjtcblxuICAgICAgICAvLyAyMi42IGRlZ3JlZXMgaW1wbGVtZW50YXRpb25cbiAgICAgICAgdGhpcy53IC09IDI7XG4gICAgICAgIHRoaXMuaCAtPSAxO1xuXG4gICAgICAgIC8vIHRoZSBtYXRyaXggb2Zmc2V0IGJldHdlZW4gdGhlIGJpdG1hcCBhbmQgdGhlIDNkIHBpeGVsIGNvb3JkaW5hdGUgWkVSTyBwb2ludFxuICAgICAgICB0aGlzLm1hdHJpeCA9IG5ldyBvYmVsaXNrLk1hdHJpeCgpO1xuICAgICAgICB0aGlzLm1hdHJpeC50eCA9IC10aGlzLmRpbWVuc2lvbi55QXhpcyArIDI7XG4gICAgICAgIHRoaXMubWF0cml4LnR5ID0gLXRoaXMuZGltZW5zaW9uLnpBeGlzO1xuICAgIH07XG5cbiAgICBwLmluaXRCaXRtYXBEYXRhID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmJpdG1hcERhdGEgPSBuZXcgb2JlbGlzay5CaXRtYXBEYXRhKHRoaXMudywgdGhpcy5oLCB0aGlzLnVzZURlZmF1bHRDYW52YXMpO1xuICAgIH07XG4gICAgcC5yZW5kZXJCaXRtYXBEYXRhRm9yQ2FudmFzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmNhbnZhcyA9IHRoaXMuYml0bWFwRGF0YS5jYW52YXM7XG4gICAgfTtcblxuICAgIHAuYnVpbGQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBicmljaywgc2lkZVgsIHNpZGVZLCBwb19icmljaywgcG9feCwgcG9feSwgY3R4LCBibWQsIG9mZnNldFgsIG9mZnNldFksXG4gICAgICAgICAgICBpLCBqLCBrO1xuICAgICAgICAvLyBob3Jpem9udGFsIGxheWVyXG4gICAgICAgIGJyaWNrID0gbmV3IG9iZWxpc2suQnJpY2soXG4gICAgICAgICAgICBuZXcgb2JlbGlzay5Ccmlja0RpbWVuc2lvbih0aGlzLmRpbWVuc2lvbi54QXhpcywgdGhpcy5kaW1lbnNpb24ueUF4aXMpLFxuICAgICAgICAgICAgbmV3IG9iZWxpc2suU2lkZUNvbG9yKHRoaXMuY29sb3IuYm9yZGVyLCB0aGlzLmNvbG9yLmhvcml6b250YWwpLFxuICAgICAgICAgICAgdGhpcy5ib3JkZXJcbiAgICAgICAgKTtcblxuICAgICAgICAvLyBsZWZ0IHNpZGVcbiAgICAgICAgc2lkZVggPSBuZXcgb2JlbGlzay5TaWRlWChcbiAgICAgICAgICAgIG5ldyBvYmVsaXNrLlNpZGVYRGltZW5zaW9uKHRoaXMuZGltZW5zaW9uLnhBeGlzLCB0aGlzLmRpbWVuc2lvbi56QXhpcyksXG4gICAgICAgICAgICBuZXcgb2JlbGlzay5TaWRlQ29sb3IodGhpcy5jb2xvci5ib3JkZXIsIHRoaXMuY29sb3IubGVmdCksXG4gICAgICAgICAgICB0aGlzLmJvcmRlclxuICAgICAgICApO1xuXG4gICAgICAgIC8vIHJpZ2h0IHNpZGVcbiAgICAgICAgc2lkZVkgPSBuZXcgb2JlbGlzay5TaWRlWShcbiAgICAgICAgICAgIG5ldyBvYmVsaXNrLlNpZGVZRGltZW5zaW9uKHRoaXMuZGltZW5zaW9uLnlBeGlzLCB0aGlzLmRpbWVuc2lvbi56QXhpcyksXG4gICAgICAgICAgICBuZXcgb2JlbGlzay5TaWRlQ29sb3IodGhpcy5jb2xvci5ib3JkZXIsIHRoaXMuY29sb3IucmlnaHQpLFxuICAgICAgICAgICAgdGhpcy5ib3JkZXJcbiAgICAgICAgKTtcblxuICAgICAgICBwb19icmljayA9IG5ldyBvYmVsaXNrLlBpeGVsT2JqZWN0KGJyaWNrKTtcbiAgICAgICAgcG9feCA9IG5ldyBvYmVsaXNrLlBpeGVsT2JqZWN0KHNpZGVYKTtcbiAgICAgICAgcG9feSA9IG5ldyBvYmVsaXNrLlBpeGVsT2JqZWN0KHNpZGVZKTtcblxuICAgICAgICBjdHggPSB0aGlzLmJpdG1hcERhdGEuY29udGV4dDtcbiAgICAgICAgY3R4LmRyYXdJbWFnZShwb19icmljay5jYW52YXMsIHBvX2JyaWNrLnggKyB0aGlzLmRpbWVuc2lvbi55QXhpcyAtIDIsIHBvX2JyaWNrLnkpO1xuICAgICAgICBjdHguZHJhd0ltYWdlKHBvX3guY2FudmFzLCBwb194LngsIHBvX3gueSArIHRoaXMuZGltZW5zaW9uLnpBeGlzICsgdGhpcy5kaW1lbnNpb24ueUF4aXMgLyAyIC0gMSk7XG4gICAgICAgIGN0eC5kcmF3SW1hZ2UocG9feS5jYW52YXMsIHBvX3kueCArIHRoaXMudyAtIDIsIHBvX3gueSArIHRoaXMuZGltZW5zaW9uLnpBeGlzICsgdGhpcy5kaW1lbnNpb24ueEF4aXMgLyAyIC0gMSk7XG5cbiAgICAgICAgLy8gaGlnaGxpZ2h0ICYgaGlnaGxpZ2h0IGZpeFxuICAgICAgICBibWQgPSBuZXcgb2JlbGlzay5CaXRtYXBEYXRhKHRoaXMudywgdGhpcy5oKTtcblxuICAgICAgICBpZiAodGhpcy5ib3JkZXIpIHtcbiAgICAgICAgICAgIG9mZnNldFggPSB0aGlzLmRpbWVuc2lvbi54QXhpcyAtIDI7XG4gICAgICAgICAgICBvZmZzZXRZID0gKHRoaXMuZGltZW5zaW9uLnhBeGlzICsgdGhpcy5kaW1lbnNpb24ueUF4aXMpIC8gMiAtIDI7XG5cbiAgICAgICAgICAgIC8vdGhlIDJweCBpbiBib3VuZGluZyB3aXRob3V0IGhpZ2h0bGlnaHRcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCB0aGlzLmRpbWVuc2lvbi54QXhpcyAtIDI7IGkgKz0gMSkge1xuICAgICAgICAgICAgICAgIGJtZC5zZXRQaXhlbChvZmZzZXRYICsgMSAtIGksIG9mZnNldFkgLSBNYXRoLmZsb29yKGkgLyAyKSwgdGhpcy5jb2xvci5ib3JkZXJIaWdobGlnaHQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvL3RoZSAycHggaW4gYm91bmRpbmcgd2l0aG91dCBoaWdodGxpZ2h0XG4gICAgICAgICAgICBmb3IgKGogPSAwOyBqIDwgdGhpcy5kaW1lbnNpb24ueUF4aXMgLSAyOyBqICs9IDEpIHtcbiAgICAgICAgICAgICAgICBibWQuc2V0UGl4ZWwob2Zmc2V0WCArIGosIG9mZnNldFkgLSBNYXRoLmZsb29yKGogLyAyKSwgdGhpcy5jb2xvci5ib3JkZXJIaWdobGlnaHQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3IgKGsgPSAwOyBrIDwgdGhpcy5kaW1lbnNpb24uekF4aXM7IGsgKz0gMSkge1xuICAgICAgICAgICAgICAgIGJtZC5zZXRQaXhlbChvZmZzZXRYLCBvZmZzZXRZICsgaywgdGhpcy5jb2xvci5ib3JkZXJIaWdobGlnaHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IHRoaXMuZGltZW5zaW9uLnpBeGlzOyBpICs9IDEpIHtcbiAgICAgICAgICAgICAgICBibWQuc2V0UGl4ZWwodGhpcy5kaW1lbnNpb24ueEF4aXMgLSAyLCAodGhpcy5kaW1lbnNpb24ueEF4aXMgKyB0aGlzLmRpbWVuc2lvbi55QXhpcykgLyAyIC0gMSArIGksIHRoaXMuY29sb3IubGVmdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgYm1kLmNvbnRleHQucHV0SW1hZ2VEYXRhKGJtZC5pbWFnZURhdGEsIDAsIDApO1xuICAgICAgICBjdHguZHJhd0ltYWdlKGJtZC5jYW52YXMsIDAsIDApO1xuICAgIH07XG5cbiAgICAvLyBwdWJsaWMgbWV0aG9kc1xuICAgIHAudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBcIltDdWJlXVwiO1xuICAgIH07XG5cbiAgICBvYmVsaXNrLkN1YmUgPSBDdWJlO1xufShvYmVsaXNrKSk7XG5cbi8qZ2xvYmFsIG9iZWxpc2s6dHJ1ZSovXG5cbi8qXG4gKiBQeXJhbWlkXG4gKi9cblxuKGZ1bmN0aW9uIChvYmVsaXNrKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICB2YXIgUHlyYW1pZCwgcDtcbiAgICBQeXJhbWlkID0gZnVuY3Rpb24gKGRpbWVuc2lvbiwgY29sb3IsIGJvcmRlciwgdXNlRGVmYXVsdENhbnZhcykge1xuICAgICAgICB0aGlzLmluaXRpYWxpemUoZGltZW5zaW9uLCBjb2xvciwgYm9yZGVyLCB1c2VEZWZhdWx0Q2FudmFzKTtcbiAgICB9O1xuICAgIHAgPSBQeXJhbWlkLnByb3RvdHlwZSA9IG5ldyBvYmVsaXNrLkFic3RyYWN0UHJpbWl0aXZlKCk7XG5cbiAgICAvLyBwcml2YXRlIHByb3BlcnRpZXNcbiAgICBwLmhTaXplID0gbnVsbDtcbiAgICBwLmhPZmZzZXQgPSBudWxsO1xuXG4gICAgLy8gY29uc3RydWN0b3JcbiAgICBwLmluaXRpYWxpemUgPSBmdW5jdGlvbiAoZGltZW5zaW9uLCBjb2xvciwgYm9yZGVyLCB1c2VEZWZhdWx0Q2FudmFzKSB7XG4gICAgICAgIHRoaXMuaW5pdFJlbmRlcihkaW1lbnNpb24sIGNvbG9yLCBib3JkZXIsIHVzZURlZmF1bHRDYW52YXMpO1xuICAgICAgICB0aGlzLmluaXRSZWN0YW5nbGUoKTtcbiAgICAgICAgdGhpcy5pbml0Qml0bWFwRGF0YSgpO1xuICAgICAgICB0aGlzLmJ1aWxkKCk7XG4gICAgICAgIHRoaXMucmVuZGVyQml0bWFwRGF0YUZvckNhbnZhcygpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgLy8gcHJpdmF0ZSBtZXRob2RcbiAgICBwLmluaXRSZW5kZXIgPSBmdW5jdGlvbiAoZGltZW5zaW9uLCBjb2xvciwgYm9yZGVyLCB1c2VEZWZhdWx0Q2FudmFzKSB7XG4gICAgICAgIHRoaXMudXNlRGVmYXVsdENhbnZhcyA9IHVzZURlZmF1bHRDYW52YXMgfHwgZmFsc2U7XG4gICAgICAgIHRoaXMuYm9yZGVyID0gYm9yZGVyIHx8IGJvcmRlciA9PT0gdW5kZWZpbmVkO1xuICAgICAgICB0aGlzLmRpbWVuc2lvbiA9IGRpbWVuc2lvbiA9PT0gdW5kZWZpbmVkID8gbmV3IG9iZWxpc2suUHlyYW1pZERpbWVuc2lvbigpIDogZGltZW5zaW9uO1xuICAgICAgICB0aGlzLmNvbG9yID0gY29sb3IgPT09IHVuZGVmaW5lZCA/IG5ldyBvYmVsaXNrLlB5cmFtaWRDb2xvcigpIDogY29sb3I7XG5cbiAgICAgICAgdGhpcy5oU2l6ZSA9IHRoaXMuZGltZW5zaW9uLnRhbGwgPyB0aGlzLmRpbWVuc2lvbi54QXhpcyAqIDIgOiB0aGlzLmRpbWVuc2lvbi54QXhpcztcbiAgICAgICAgdGhpcy5oT2Zmc2V0ID0gdGhpcy5kaW1lbnNpb24udGFsbCA/IC0zIDogLTI7XG4gICAgfTtcblxuICAgIHAuaW5pdFJlY3RhbmdsZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy53ID0gdGhpcy5kaW1lbnNpb24ueEF4aXMgKyB0aGlzLmRpbWVuc2lvbi55QXhpcztcbiAgICAgICAgdGhpcy5oID0gdGhpcy5oU2l6ZSArIHRoaXMuZGltZW5zaW9uLnhBeGlzIC8gMjtcblxuICAgICAgICAvLyAyMi42IGRlZ3JlZXMgaW1wbGVtZW50YXRpb25cbiAgICAgICAgdGhpcy53IC09IDI7XG4gICAgICAgIHRoaXMuaCArPSB0aGlzLmhPZmZzZXQ7XG5cbiAgICAgICAgLy8gdGhlIG1hdHJpeCBvZmZzZXQgYmV0d2VlbiB0aGUgYml0bWFwIGFuZCB0aGUgM2QgcGl4ZWwgY29vcmRpbmF0ZSBaRVJPIHBvaW50XG4gICAgICAgIHRoaXMubWF0cml4ID0gbmV3IG9iZWxpc2suTWF0cml4KCk7XG4gICAgICAgIHRoaXMubWF0cml4LnR4ID0gLXRoaXMuZGltZW5zaW9uLnhBeGlzICsgMjtcbiAgICAgICAgdGhpcy5tYXRyaXgudHkgPSAtdGhpcy5oU2l6ZSAvIDIgKyAyIC0gKHRoaXMuZGltZW5zaW9uLnRhbGwgPyB0aGlzLmRpbWVuc2lvbi54QXhpcyAvIDIgOiAxKTtcbiAgICB9O1xuXG4gICAgcC5pbml0Qml0bWFwRGF0YSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5iaXRtYXBEYXRhID0gbmV3IG9iZWxpc2suQml0bWFwRGF0YSh0aGlzLncsIHRoaXMuaCwgdGhpcy51c2VEZWZhdWx0Q2FudmFzKTtcbiAgICB9O1xuICAgIHAucmVuZGVyQml0bWFwRGF0YUZvckNhbnZhcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5iaXRtYXBEYXRhLmNvbnRleHQucHV0SW1hZ2VEYXRhKHRoaXMuYml0bWFwRGF0YS5pbWFnZURhdGEsIDAsIDApO1xuICAgICAgICB0aGlzLmNhbnZhcyA9IHRoaXMuYml0bWFwRGF0YS5jYW52YXM7XG4gICAgfTtcblxuICAgIHAuYnVpbGQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBjb2xvcmJvcmRlcl9sZWZ0LCBjb2xvcmJvcmRlcl9yaWdodCwgY29sb3Jib3JkZXJfaGlnaGxpZ2h0LFxuICAgICAgICAgICAgaSwgaiwgaywgbDEsIG0xLCBsMiwgbTI7XG4gICAgICAgIGNvbG9yYm9yZGVyX2xlZnQgPSB0aGlzLmJvcmRlciA/IHRoaXMuY29sb3IuYm9yZGVyIDogdGhpcy5jb2xvci5sZWZ0O1xuICAgICAgICBjb2xvcmJvcmRlcl9yaWdodCA9IHRoaXMuYm9yZGVyID8gdGhpcy5jb2xvci5ib3JkZXIgOiB0aGlzLmNvbG9yLnJpZ2h0O1xuXG4gICAgICAgIGNvbG9yYm9yZGVyX2hpZ2hsaWdodCA9IHRoaXMuYm9yZGVyID8gdGhpcy5jb2xvci5ib3JkZXJIaWdobGlnaHQgOiBjb2xvcmJvcmRlcl9sZWZ0O1xuXG4gICAgICAgIC8veiBheGlzIHx8IGhpZ2h0bGlnaHRcbiAgICAgICAgZm9yIChrID0gMDsgayA8IHRoaXMuaFNpemUgKyB0aGlzLmRpbWVuc2lvbi54QXhpcyAvIDIgLSA0OyBrICs9IDEpIHtcbiAgICAgICAgICAgIHRoaXMuYml0bWFwRGF0YS5zZXRQaXhlbCh0aGlzLmRpbWVuc2lvbi54QXhpcyAtIDIsIGsgKyAzICsgdGhpcy5oT2Zmc2V0LCBjb2xvcmJvcmRlcl9oaWdobGlnaHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy94IGF4aXNcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IHRoaXMuZGltZW5zaW9uLnhBeGlzOyBpICs9IDEpIHtcbiAgICAgICAgICAgIHRoaXMuYml0bWFwRGF0YS5zZXRQaXhlbChpLCB0aGlzLmhTaXplICsgTWF0aC5mbG9vcihpIC8gMikgKyB0aGlzLmhPZmZzZXQsIGNvbG9yYm9yZGVyX2xlZnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy95IGF4aXNcbiAgICAgICAgZm9yIChqID0gMDsgaiA8IHRoaXMuZGltZW5zaW9uLnhBeGlzOyBqICs9IDEpIHtcbiAgICAgICAgICAgIHRoaXMuYml0bWFwRGF0YS5zZXRQaXhlbChqICsgdGhpcy5kaW1lbnNpb24ueEF4aXMgLSAyLCB0aGlzLmhTaXplICsgdGhpcy5kaW1lbnNpb24ueEF4aXMgLyAyIC0gTWF0aC5mbG9vcihqIC8gMikgLSAxICsgdGhpcy5oT2Zmc2V0LCBjb2xvcmJvcmRlcl9yaWdodCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRoaXMuZGltZW5zaW9uLnRhbGwpIHtcbiAgICAgICAgICAgIC8vbGVmdCBlZGdlXG4gICAgICAgICAgICBmb3IgKGwxID0gMDsgbDEgPCB0aGlzLmhTaXplOyBsMSArPSAxKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5iaXRtYXBEYXRhLnNldFBpeGVsKGwxLCB0aGlzLmhTaXplIC0gbDEgKyB0aGlzLmhPZmZzZXQsIGNvbG9yYm9yZGVyX2xlZnQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvL3JpZ2h0IGVkZ2VcbiAgICAgICAgICAgIGZvciAobTEgPSAwOyBtMSA8IHRoaXMuaFNpemU7IG0xICs9IDEpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmJpdG1hcERhdGEuc2V0UGl4ZWwobTEgKyB0aGlzLmhTaXplIC0gMiwgbTEgKyAxICsgdGhpcy5oT2Zmc2V0LCBjb2xvcmJvcmRlcl9yaWdodCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvL2xlZnQgZWRnZVxuICAgICAgICAgICAgZm9yIChsMiA9IDA7IGwyIDwgdGhpcy5oU2l6ZSAtIDI7IGwyICs9IDEpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmJpdG1hcERhdGEuc2V0UGl4ZWwoTWF0aC5mbG9vcihsMiAvIDIpLCB0aGlzLmhTaXplIC0gbDIgKyB0aGlzLmhPZmZzZXQsIGNvbG9yYm9yZGVyX2xlZnQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvL3JpZ2h0IGVkZ2VcbiAgICAgICAgICAgIGZvciAobTIgPSAyOyBtMiA8IHRoaXMuaFNpemU7IG0yICs9IDEpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmJpdG1hcERhdGEuc2V0UGl4ZWwoTWF0aC5mbG9vcihtMiAvIDIpICsgdGhpcy5kaW1lbnNpb24ueEF4aXMgLSAyLCBtMiArIDEgKyB0aGlzLmhPZmZzZXQsIGNvbG9yYm9yZGVyX3JpZ2h0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhpcy5ib3JkZXIpIHtcbiAgICAgICAgICAgIHRoaXMuYml0bWFwRGF0YS5zZXRQaXhlbCh0aGlzLmRpbWVuc2lvbi54QXhpcyAtIDIsIHRoaXMuaFNpemUgKyB0aGlzLmRpbWVuc2lvbi54QXhpcyAvIDIgLSAxICsgdGhpcy5oT2Zmc2V0LCBjb2xvcmJvcmRlcl9sZWZ0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vZmxvb2RmaWxsXG4gICAgICAgIHRoaXMuYml0bWFwRGF0YS5mbG9vZEZpbGwodGhpcy5kaW1lbnNpb24ueEF4aXMgLSAxLCB0aGlzLmhTaXplICsgTWF0aC5mbG9vcigodGhpcy5kaW1lbnNpb24ueEF4aXMgLSAxKSAvIDIpICsgdGhpcy5oT2Zmc2V0IC0gMSwgdGhpcy5jb2xvci5yaWdodCk7XG4gICAgICAgIHRoaXMuYml0bWFwRGF0YS5mbG9vZEZpbGwodGhpcy5kaW1lbnNpb24ueEF4aXMgLSAzLCB0aGlzLmhTaXplICsgTWF0aC5mbG9vcigodGhpcy5kaW1lbnNpb24ueEF4aXMgLSAxKSAvIDIpICsgdGhpcy5oT2Zmc2V0IC0gMiwgdGhpcy5jb2xvci5sZWZ0KTtcbiAgICB9O1xuXG4gICAgLy8gcHVibGljIG1ldGhvZHNcbiAgICBwLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gXCJbUHlyYW1pZF1cIjtcbiAgICB9O1xuXG4gICAgb2JlbGlzay5QeXJhbWlkID0gUHlyYW1pZDtcbn0ob2JlbGlzaykpO1xuXG4vKmdsb2JhbCBvYmVsaXNrOnRydWUqL1xuXG4vKlxuICogU2lkZVhcbiAqL1xuXG4oZnVuY3Rpb24gKG9iZWxpc2spIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICB2YXIgU2lkZVgsIHA7XG4gICAgU2lkZVggPSBmdW5jdGlvbiAoZGltZW5zaW9uLCBjb2xvciwgYm9yZGVyLCB1c2VEZWZhdWx0Q2FudmFzKSB7XG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZShkaW1lbnNpb24sIGNvbG9yLCBib3JkZXIsIHVzZURlZmF1bHRDYW52YXMpO1xuICAgIH07XG4gICAgcCA9IFNpZGVYLnByb3RvdHlwZSA9IG5ldyBvYmVsaXNrLkFic3RyYWN0UHJpbWl0aXZlKCk7XG5cbiAgICAvLyBwdWJsaWMgcHJvcGVydGllc1xuXG4gICAgLy8gY29uc3RydWN0b3JcbiAgICBwLmluaXRpYWxpemUgPSBmdW5jdGlvbiAoZGltZW5zaW9uLCBjb2xvciwgYm9yZGVyLCB1c2VEZWZhdWx0Q2FudmFzKSB7XG4gICAgICAgIHRoaXMuaW5pdFJlbmRlcihkaW1lbnNpb24sIGNvbG9yLCBib3JkZXIsIHVzZURlZmF1bHRDYW52YXMpO1xuICAgICAgICB0aGlzLmluaXRSZWN0YW5nbGUoKTtcbiAgICAgICAgdGhpcy5pbml0Qml0bWFwRGF0YSgpO1xuICAgICAgICB0aGlzLmJ1aWxkKCk7XG4gICAgICAgIHRoaXMucmVuZGVyQml0bWFwRGF0YUZvckNhbnZhcygpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgLy8gcHJpdmF0ZSBtZXRob2RcbiAgICBwLmluaXRSZW5kZXIgPSBmdW5jdGlvbiAoZGltZW5zaW9uLCBjb2xvciwgYm9yZGVyLCB1c2VEZWZhdWx0Q2FudmFzKSB7XG4gICAgICAgIHRoaXMudXNlRGVmYXVsdENhbnZhcyA9IHVzZURlZmF1bHRDYW52YXMgfHwgZmFsc2U7XG4gICAgICAgIHRoaXMuYm9yZGVyID0gYm9yZGVyIHx8IGJvcmRlciA9PT0gdW5kZWZpbmVkO1xuICAgICAgICB0aGlzLmRpbWVuc2lvbiA9IGRpbWVuc2lvbiA9PT0gdW5kZWZpbmVkID8gbmV3IG9iZWxpc2suU2lkZVhEaW1lbnNpb24oKSA6IGRpbWVuc2lvbjtcbiAgICAgICAgdGhpcy5jb2xvciA9IGNvbG9yID09PSB1bmRlZmluZWQgPyBuZXcgb2JlbGlzay5TaWRlQ29sb3IoKSA6IGNvbG9yO1xuICAgIH07XG5cbiAgICBwLmluaXRSZWN0YW5nbGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMudyA9IHRoaXMuZGltZW5zaW9uLnhBeGlzO1xuICAgICAgICB0aGlzLmggPSB0aGlzLmRpbWVuc2lvbi56QXhpcyArIHRoaXMuZGltZW5zaW9uLnhBeGlzIC8gMjtcblxuICAgICAgICAvLyB0aGUgbWF0cml4IG9mZnNldCBiZXR3ZWVuIHRoZSBiaXRtYXAgYW5kIHRoZSAzZCBwaXhlbCBjb29yZGluYXRlIFpFUk8gcG9pbnRcbiAgICAgICAgdGhpcy5tYXRyaXggPSBuZXcgb2JlbGlzay5NYXRyaXgoKTtcbiAgICAgICAgdGhpcy5tYXRyaXgudHggPSAwO1xuICAgICAgICB0aGlzLm1hdHJpeC50eSA9IC10aGlzLmRpbWVuc2lvbi56QXhpcztcbiAgICB9O1xuXG4gICAgcC5pbml0Qml0bWFwRGF0YSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5iaXRtYXBEYXRhID0gbmV3IG9iZWxpc2suQml0bWFwRGF0YSh0aGlzLncsIHRoaXMuaCwgdGhpcy51c2VEZWZhdWx0Q2FudmFzKTtcbiAgICB9O1xuICAgIHAucmVuZGVyQml0bWFwRGF0YUZvckNhbnZhcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5iaXRtYXBEYXRhLmNvbnRleHQucHV0SW1hZ2VEYXRhKHRoaXMuYml0bWFwRGF0YS5pbWFnZURhdGEsIDAsIDApO1xuICAgICAgICB0aGlzLmNhbnZhcyA9IHRoaXMuYml0bWFwRGF0YS5jYW52YXM7XG4gICAgfTtcblxuICAgIHAuYnVpbGQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB4T2Zmc2V0SW5uZXIsIHlPZmZzZXRJbm5lciwgeE9mZnNldE91dCwgeU9mZnNldE91dCwgaSwgaiwgYm9yZGVyQ29sb3I7XG5cbiAgICAgICAgeE9mZnNldElubmVyID0gMDtcbiAgICAgICAgeU9mZnNldElubmVyID0gdGhpcy5kaW1lbnNpb24uekF4aXM7XG4gICAgICAgIHhPZmZzZXRPdXQgPSB0aGlzLmRpbWVuc2lvbi54QXhpcyAtIDE7XG4gICAgICAgIHlPZmZzZXRPdXQgPSB0aGlzLmggLSB0aGlzLmRpbWVuc2lvbi56QXhpcyAtIDE7XG4gICAgICAgIGJvcmRlckNvbG9yID0gdGhpcy5ib3JkZXIgPyB0aGlzLmNvbG9yLmJvcmRlciA6IHRoaXMuY29sb3IuaW5uZXI7XG5cbiAgICAgICAgLy94IGF4aXNcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IHRoaXMuZGltZW5zaW9uLnhBeGlzOyBpICs9IDEpIHtcbiAgICAgICAgICAgIHRoaXMuYml0bWFwRGF0YS5zZXRQaXhlbCh4T2Zmc2V0SW5uZXIgKyBpLCB5T2Zmc2V0SW5uZXIgKyBNYXRoLmZsb29yKGkgLyAyKSwgYm9yZGVyQ29sb3IpO1xuICAgICAgICAgICAgdGhpcy5iaXRtYXBEYXRhLnNldFBpeGVsKHhPZmZzZXRPdXQgLSBpLCB5T2Zmc2V0T3V0IC0gTWF0aC5mbG9vcihpIC8gMiksIGJvcmRlckNvbG9yKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8veiBheGlzXG4gICAgICAgIGZvciAoaiA9IDA7IGogPCB0aGlzLmRpbWVuc2lvbi56QXhpczsgaiArPSAxKSB7XG4gICAgICAgICAgICB0aGlzLmJpdG1hcERhdGEuc2V0UGl4ZWwoeE9mZnNldElubmVyLCB5T2Zmc2V0SW5uZXIgLSBqLCBib3JkZXJDb2xvcik7XG4gICAgICAgICAgICB0aGlzLmJpdG1hcERhdGEuc2V0UGl4ZWwoeE9mZnNldE91dCwgeU9mZnNldE91dCArIGosIGJvcmRlckNvbG9yKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vZmlsbCBhbiBwaXhlbCBncmFwaGljIGVuY2xvc2VkXG4gICAgICAgIHRoaXMuYml0bWFwRGF0YS5mbG9vZEZpbGwoTWF0aC5mbG9vcih0aGlzLncgLyAyKSwgTWF0aC5mbG9vcih0aGlzLmggLyAyKSwgdGhpcy5jb2xvci5pbm5lcik7XG4gICAgfTtcblxuICAgIC8vIHB1YmxpYyBtZXRob2RzXG4gICAgcC50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIFwiW1NpZGVYXVwiO1xuICAgIH07XG5cbiAgICBvYmVsaXNrLlNpZGVYID0gU2lkZVg7XG59KG9iZWxpc2spKTtcblxuLypnbG9iYWwgb2JlbGlzazp0cnVlKi9cblxuLypcbiAqIFNpZGVZXG4gKi9cblxuKGZ1bmN0aW9uIChvYmVsaXNrKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICB2YXIgU2lkZVksIHA7XG4gICAgU2lkZVkgPSBmdW5jdGlvbiAoZGltZW5zaW9uLCBjb2xvciwgYm9yZGVyLCB1c2VEZWZhdWx0Q2FudmFzKSB7XG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZShkaW1lbnNpb24sIGNvbG9yLCBib3JkZXIsIHVzZURlZmF1bHRDYW52YXMpO1xuICAgIH07XG4gICAgcCA9IFNpZGVZLnByb3RvdHlwZSA9IG5ldyBvYmVsaXNrLkFic3RyYWN0UHJpbWl0aXZlKCk7XG5cbiAgICAvLyBwdWJsaWMgcHJvcGVydGllc1xuXG4gICAgLy8gY29uc3RydWN0b3JcbiAgICBwLmluaXRpYWxpemUgPSBmdW5jdGlvbiAoZGltZW5zaW9uLCBjb2xvciwgYm9yZGVyLCB1c2VEZWZhdWx0Q2FudmFzKSB7XG4gICAgICAgIHRoaXMuaW5pdFJlbmRlcihkaW1lbnNpb24sIGNvbG9yLCBib3JkZXIsIHVzZURlZmF1bHRDYW52YXMpO1xuICAgICAgICB0aGlzLmluaXRSZWN0YW5nbGUoKTtcbiAgICAgICAgdGhpcy5pbml0Qml0bWFwRGF0YSgpO1xuICAgICAgICB0aGlzLmJ1aWxkKCk7XG4gICAgICAgIHRoaXMucmVuZGVyQml0bWFwRGF0YUZvckNhbnZhcygpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgLy8gcHJpdmF0ZSBtZXRob2RcbiAgICBwLmluaXRSZW5kZXIgPSBmdW5jdGlvbiAoZGltZW5zaW9uLCBjb2xvciwgYm9yZGVyLCB1c2VEZWZhdWx0Q2FudmFzKSB7XG4gICAgICAgIHRoaXMudXNlRGVmYXVsdENhbnZhcyA9IHVzZURlZmF1bHRDYW52YXMgfHwgZmFsc2U7XG4gICAgICAgIHRoaXMuYm9yZGVyID0gYm9yZGVyIHx8IGJvcmRlciA9PT0gdW5kZWZpbmVkO1xuICAgICAgICB0aGlzLmRpbWVuc2lvbiA9IGRpbWVuc2lvbiA9PT0gdW5kZWZpbmVkID8gbmV3IG9iZWxpc2suU2lkZVlEaW1lbnNpb24oKSA6IGRpbWVuc2lvbjtcbiAgICAgICAgdGhpcy5jb2xvciA9IGNvbG9yID09PSB1bmRlZmluZWQgPyBuZXcgb2JlbGlzay5TaWRlQ29sb3IoKSA6IGNvbG9yO1xuICAgIH07XG5cbiAgICBwLmluaXRSZWN0YW5nbGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMudyA9IHRoaXMuZGltZW5zaW9uLnlBeGlzO1xuICAgICAgICB0aGlzLmggPSB0aGlzLmRpbWVuc2lvbi56QXhpcyArIHRoaXMuZGltZW5zaW9uLnlBeGlzIC8gMjtcblxuICAgICAgICAvLyB0aGUgbWF0cml4IG9mZnNldCBiZXR3ZWVuIHRoZSBiaXRtYXAgYW5kIHRoZSAzZCBwaXhlbCBjb29yZGluYXRlIFpFUk8gcG9pbnRcbiAgICAgICAgdGhpcy5tYXRyaXggPSBuZXcgb2JlbGlzay5NYXRyaXgoKTtcbiAgICAgICAgdGhpcy5tYXRyaXgudHggPSAtdGhpcy5kaW1lbnNpb24ueUF4aXMgKyAyO1xuICAgICAgICB0aGlzLm1hdHJpeC50eSA9IC10aGlzLmRpbWVuc2lvbi56QXhpcztcbiAgICB9O1xuXG4gICAgcC5pbml0Qml0bWFwRGF0YSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5iaXRtYXBEYXRhID0gbmV3IG9iZWxpc2suQml0bWFwRGF0YSh0aGlzLncsIHRoaXMuaCwgdGhpcy51c2VEZWZhdWx0Q2FudmFzKTtcbiAgICB9O1xuICAgIHAucmVuZGVyQml0bWFwRGF0YUZvckNhbnZhcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5iaXRtYXBEYXRhLmNvbnRleHQucHV0SW1hZ2VEYXRhKHRoaXMuYml0bWFwRGF0YS5pbWFnZURhdGEsIDAsIDApO1xuICAgICAgICB0aGlzLmNhbnZhcyA9IHRoaXMuYml0bWFwRGF0YS5jYW52YXM7XG4gICAgfTtcblxuICAgIHAuYnVpbGQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB4T2Zmc2V0SW5uZXIsIHlPZmZzZXRJbm5lciwgeE9mZnNldE91dCwgeU9mZnNldE91dCwgaSwgaiwgYm9yZGVyQ29sb3I7XG4gICAgICAgIHhPZmZzZXRJbm5lciA9IDA7XG4gICAgICAgIHlPZmZzZXRJbm5lciA9IHRoaXMuaCAtIHRoaXMuZGltZW5zaW9uLnpBeGlzIC0gMTtcbiAgICAgICAgeE9mZnNldE91dCA9IHRoaXMuZGltZW5zaW9uLnlBeGlzIC0gMTtcbiAgICAgICAgeU9mZnNldE91dCA9IHRoaXMuZGltZW5zaW9uLnpBeGlzO1xuICAgICAgICBib3JkZXJDb2xvciA9IHRoaXMuYm9yZGVyID8gdGhpcy5jb2xvci5ib3JkZXIgOiB0aGlzLmNvbG9yLmlubmVyO1xuXG4gICAgICAgIC8veSBheGlzXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCB0aGlzLmRpbWVuc2lvbi55QXhpczsgaSArPSAxKSB7XG4gICAgICAgICAgICB0aGlzLmJpdG1hcERhdGEuc2V0UGl4ZWwoeE9mZnNldElubmVyICsgaSwgeU9mZnNldElubmVyIC0gTWF0aC5mbG9vcihpIC8gMiksIGJvcmRlckNvbG9yKTtcbiAgICAgICAgICAgIHRoaXMuYml0bWFwRGF0YS5zZXRQaXhlbCh4T2Zmc2V0T3V0IC0gaSwgeU9mZnNldE91dCArIE1hdGguZmxvb3IoaSAvIDIpLCBib3JkZXJDb2xvcik7XG4gICAgICAgIH1cblxuICAgICAgICAvL3ogYXhpc1xuICAgICAgICBmb3IgKGogPSAwOyBqIDwgdGhpcy5kaW1lbnNpb24uekF4aXM7IGogKz0gMSkge1xuICAgICAgICAgICAgdGhpcy5iaXRtYXBEYXRhLnNldFBpeGVsKHhPZmZzZXRJbm5lciwgeU9mZnNldElubmVyICsgaiwgYm9yZGVyQ29sb3IpO1xuICAgICAgICAgICAgdGhpcy5iaXRtYXBEYXRhLnNldFBpeGVsKHhPZmZzZXRPdXQsIHlPZmZzZXRPdXQgLSBqLCBib3JkZXJDb2xvcik7XG4gICAgICAgIH1cblxuICAgICAgICAvL2ZpbGwgYW4gcGl4ZWwgZ3JhcGhpYyBlbmNsb3NlZFxuICAgICAgICB0aGlzLmJpdG1hcERhdGEuZmxvb2RGaWxsKE1hdGguZmxvb3IodGhpcy53IC8gMiksIE1hdGguZmxvb3IodGhpcy5oIC8gMiksIHRoaXMuY29sb3IuaW5uZXIpO1xuICAgIH07XG5cbiAgICAvLyBwdWJsaWMgbWV0aG9kc1xuICAgIHAudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBcIltTaWRlWV1cIjtcbiAgICB9O1xuXG4gICAgb2JlbGlzay5TaWRlWSA9IFNpZGVZO1xufShvYmVsaXNrKSk7XG5cbi8qZ2xvYmFsIG9iZWxpc2s6dHJ1ZSovXG5cbi8qXG4gKiBTbG9wZSBFYXN0XG4gKi9cblxuKGZ1bmN0aW9uIChvYmVsaXNrKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICB2YXIgU2xvcGVFYXN0LCBwO1xuICAgIFNsb3BlRWFzdCA9IGZ1bmN0aW9uIChkaW1lbnNpb24sIGNvbG9yLCBib3JkZXIsIHVzZURlZmF1bHRDYW52YXMpIHtcbiAgICAgICAgdGhpcy5pbml0aWFsaXplKGRpbWVuc2lvbiwgY29sb3IsIGJvcmRlciwgdXNlRGVmYXVsdENhbnZhcyk7XG4gICAgfTtcbiAgICBwID0gU2xvcGVFYXN0LnByb3RvdHlwZSA9IG5ldyBvYmVsaXNrLkFic3RyYWN0UHJpbWl0aXZlKCk7XG5cbiAgICAvLyBjb25zdHJ1Y3RvclxuICAgIHAuaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uIChkaW1lbnNpb24sIGNvbG9yLCBib3JkZXIsIHVzZURlZmF1bHRDYW52YXMpIHtcbiAgICAgICAgdGhpcy5pbml0UmVuZGVyKGRpbWVuc2lvbiwgY29sb3IsIGJvcmRlciwgdXNlRGVmYXVsdENhbnZhcyk7XG4gICAgICAgIHRoaXMuaW5pdFJlY3RhbmdsZSgpO1xuICAgICAgICB0aGlzLmluaXRCaXRtYXBEYXRhKCk7XG4gICAgICAgIHRoaXMuYnVpbGQoKTtcbiAgICAgICAgdGhpcy5yZW5kZXJCaXRtYXBEYXRhRm9yQ2FudmFzKCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICAvLyBwcml2YXRlIG1ldGhvZFxuICAgIHAuaW5pdFJlbmRlciA9IGZ1bmN0aW9uIChkaW1lbnNpb24sIGNvbG9yLCBib3JkZXIsIHVzZURlZmF1bHRDYW52YXMpIHtcbiAgICAgICAgdGhpcy51c2VEZWZhdWx0Q2FudmFzID0gdXNlRGVmYXVsdENhbnZhcyB8fCBmYWxzZTtcbiAgICAgICAgdGhpcy5ib3JkZXIgPSBib3JkZXIgfHwgYm9yZGVyID09PSB1bmRlZmluZWQ7XG4gICAgICAgIHRoaXMuZGltZW5zaW9uID0gZGltZW5zaW9uID09PSB1bmRlZmluZWQgPyBuZXcgb2JlbGlzay5TbG9wZURpbWVuc2lvbigpIDogZGltZW5zaW9uO1xuICAgICAgICB0aGlzLmNvbG9yID0gY29sb3IgPT09IHVuZGVmaW5lZCA/IG5ldyBvYmVsaXNrLlNsb3BlQ29sb3IoKSA6IGNvbG9yO1xuICAgIH07XG5cbiAgICBwLmluaXRSZWN0YW5nbGUgPSBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgdGhpcy53ID0gdGhpcy5kaW1lbnNpb24ueEF4aXMgKyB0aGlzLmRpbWVuc2lvbi55QXhpcztcbiAgICAgICAgdGhpcy5oID0gdGhpcy5kaW1lbnNpb24ueEF4aXMgKiAyICsgdGhpcy5kaW1lbnNpb24ueUF4aXMgLyAyO1xuXG4gICAgICAgIC8vIDIyLjYgZGVncmVlcyBpbXBsZW1lbnRhdGlvblxuICAgICAgICB0aGlzLncgLT0gMjtcbiAgICAgICAgdGhpcy5oIC09IDM7XG5cbiAgICAgICAgLy8gdGhlIG1hdHJpeCBvZmZzZXQgYmV0d2VlbiB0aGUgYml0bWFwIGFuZCB0aGUgM2QgcGl4ZWwgY29vcmRpbmF0ZSBaRVJPIHBvaW50XG4gICAgICAgIHRoaXMubWF0cml4ID0gbmV3IG9iZWxpc2suTWF0cml4KCk7XG4gICAgICAgIHRoaXMubWF0cml4LnR4ID0gLSh0aGlzLmRpbWVuc2lvbi55QXhpcyAtIDIpO1xuICAgICAgICB0aGlzLm1hdHJpeC50eSA9IC0odGhpcy5kaW1lbnNpb24ueEF4aXMgKiAzIC8gMiAtIDIpO1xuICAgIH07XG5cbiAgICBwLmluaXRCaXRtYXBEYXRhID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmJpdG1hcERhdGEgPSBuZXcgb2JlbGlzay5CaXRtYXBEYXRhKHRoaXMudywgdGhpcy5oLCB0aGlzLnVzZURlZmF1bHRDYW52YXMpO1xuICAgIH07XG4gICAgcC5yZW5kZXJCaXRtYXBEYXRhRm9yQ2FudmFzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmJpdG1hcERhdGEuY29udGV4dC5wdXRJbWFnZURhdGEodGhpcy5iaXRtYXBEYXRhLmltYWdlRGF0YSwgMCwgMCk7XG4gICAgICAgIHRoaXMuY2FudmFzID0gdGhpcy5iaXRtYXBEYXRhLmNhbnZhcztcbiAgICB9O1xuXG4gICAgcC5idWlsZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGNvbG9yQm9yZGVyTGVmdCwgY29sb3JCb3JkZXJSaWdodCxcbiAgICAgICAgICAgIGksIGosIGssIG0sIG47XG5cbiAgICAgICAgY29sb3JCb3JkZXJMZWZ0ID0gdGhpcy5ib3JkZXIgPyB0aGlzLmNvbG9yLmJvcmRlciA6IHRoaXMuY29sb3IubGVmdDtcbiAgICAgICAgY29sb3JCb3JkZXJSaWdodCA9IHRoaXMuYm9yZGVyID8gdGhpcy5jb2xvci5ib3JkZXIgOiB0aGlzLmNvbG9yLnJpZ2h0U2xvcGU7XG5cbiAgICAgICAgLy8geSBheGlzXG4gICAgICAgIGZvciAoaiA9IDA7IGogPCB0aGlzLmRpbWVuc2lvbi55QXhpczsgaiArPSAxKSB7XG4gICAgICAgICAgICB0aGlzLmJpdG1hcERhdGEuc2V0UGl4ZWwoaiwgdGhpcy5kaW1lbnNpb24ueUF4aXMgLyAyIC0gTWF0aC5mbG9vcihqIC8gMikgLSAxLCBjb2xvckJvcmRlclJpZ2h0KTtcbiAgICAgICAgICAgIHRoaXMuYml0bWFwRGF0YS5zZXRQaXhlbChqICsgdGhpcy5kaW1lbnNpb24ueEF4aXMgLSAyLCB0aGlzLmggLSBNYXRoLmZsb29yKGogLyAyKSAtIDEsIGNvbG9yQm9yZGVyUmlnaHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8geCBheGlzXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCB0aGlzLmRpbWVuc2lvbi54QXhpczsgaSArPSAxKSB7XG4gICAgICAgICAgICB0aGlzLmJpdG1hcERhdGEuc2V0UGl4ZWwoaSwgdGhpcy5oIC0gdGhpcy5kaW1lbnNpb24ueEF4aXMgLyAyICsgTWF0aC5mbG9vcihpIC8gMiksIGNvbG9yQm9yZGVyTGVmdCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyB6IGF4aXNcbiAgICAgICAgZm9yIChrID0gdGhpcy5kaW1lbnNpb24ueUF4aXMgLyAyIC0gMTsgayA8IHRoaXMuaCAtIHRoaXMuZGltZW5zaW9uLnhBeGlzIC8gMjsgayArPSAxKSB7XG4gICAgICAgICAgICB0aGlzLmJpdG1hcERhdGEuc2V0UGl4ZWwoMCwgaywgY29sb3JCb3JkZXJMZWZ0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHNsb3RcbiAgICAgICAgZm9yIChtID0gMDsgbSA8IHRoaXMuZGltZW5zaW9uLnhBeGlzICogMiAtIDI7IG0gKz0gMSkge1xuICAgICAgICAgICAgdGhpcy5iaXRtYXBEYXRhLnNldFBpeGVsKHRoaXMuZGltZW5zaW9uLnlBeGlzIC0gMSArIE1hdGguZmxvb3IobSAvIDIpLCBtLCBjb2xvckJvcmRlclJpZ2h0KTtcbiAgICAgICAgICAgIHRoaXMuYml0bWFwRGF0YS5zZXRQaXhlbCgxICsgTWF0aC5mbG9vcihtIC8gMiksIHRoaXMuZGltZW5zaW9uLnlBeGlzIC8gMiArIG0gLSAxLCBjb2xvckJvcmRlclJpZ2h0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGZsb29kIGZpbGxcbiAgICAgICAgdGhpcy5iaXRtYXBEYXRhLmZsb29kRmlsbCh0aGlzLmRpbWVuc2lvbi55QXhpcyAtIDIsIDEsIHRoaXMuY29sb3IucmlnaHRTbG9wZSk7XG4gICAgICAgIHRoaXMuYml0bWFwRGF0YS5mbG9vZEZpbGwodGhpcy5kaW1lbnNpb24ueEF4aXMgLSAzLCB0aGlzLmggLSAzLCB0aGlzLmNvbG9yLmxlZnQpO1xuICAgICAgICAvLyBoYWNrIHNpbmdsZSBwaXhlbFxuICAgICAgICB0aGlzLmJpdG1hcERhdGEuc2V0UGl4ZWwodGhpcy5kaW1lbnNpb24ueEF4aXMgLSAyLCB0aGlzLmggLSAyLCB0aGlzLmNvbG9yLmxlZnQpO1xuXG4gICAgICAgIC8vIGhpZ2hsaWdodFxuICAgICAgICBpZiAodGhpcy5ib3JkZXIpIHtcbiAgICAgICAgICAgIGZvciAobiA9IDE7IG4gPCB0aGlzLmRpbWVuc2lvbi54QXhpcyAqIDIgLSAzOyBuICs9IDEpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmJpdG1hcERhdGEuc2V0UGl4ZWwoMSArIE1hdGguZmxvb3IobiAvIDIpLCB0aGlzLmRpbWVuc2lvbi55QXhpcyAvIDIgKyBuIC0gMSwgdGhpcy5jb2xvci5ib3JkZXJIaWdobGlnaHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8vIHB1YmxpYyBtZXRob2RzXG4gICAgcC50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIFwiW1Nsb3BlRWFzdF1cIjtcbiAgICB9O1xuXG4gICAgb2JlbGlzay5TbG9wZUVhc3QgPSBTbG9wZUVhc3Q7XG59KG9iZWxpc2spKTtcblxuLypnbG9iYWwgb2JlbGlzazp0cnVlKi9cblxuLypcbiAqIFNsb3BlIE5vcnRoXG4gKi9cblxuKGZ1bmN0aW9uIChvYmVsaXNrKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICB2YXIgU2xvcGVOb3J0aCwgcDtcbiAgICBTbG9wZU5vcnRoID0gZnVuY3Rpb24gKGRpbWVuc2lvbiwgY29sb3IsIGJvcmRlciwgdXNlRGVmYXVsdENhbnZhcykge1xuICAgICAgICB0aGlzLmluaXRpYWxpemUoZGltZW5zaW9uLCBjb2xvciwgYm9yZGVyLCB1c2VEZWZhdWx0Q2FudmFzKTtcbiAgICB9O1xuICAgIHAgPSBTbG9wZU5vcnRoLnByb3RvdHlwZSA9IG5ldyBvYmVsaXNrLkFic3RyYWN0UHJpbWl0aXZlKCk7XG5cbiAgICAvLyBjb25zdHJ1Y3RvclxuICAgIHAuaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uIChkaW1lbnNpb24sIGNvbG9yLCBib3JkZXIsIHVzZURlZmF1bHRDYW52YXMpIHtcbiAgICAgICAgdGhpcy5pbml0UmVuZGVyKGRpbWVuc2lvbiwgY29sb3IsIGJvcmRlciwgdXNlRGVmYXVsdENhbnZhcyk7XG4gICAgICAgIHRoaXMuaW5pdFJlY3RhbmdsZSgpO1xuICAgICAgICB0aGlzLmluaXRCaXRtYXBEYXRhKCk7XG4gICAgICAgIHRoaXMuYnVpbGQoKTtcbiAgICAgICAgdGhpcy5yZW5kZXJCaXRtYXBEYXRhRm9yQ2FudmFzKCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICAvLyBwcml2YXRlIG1ldGhvZFxuICAgIHAuaW5pdFJlbmRlciA9IGZ1bmN0aW9uIChkaW1lbnNpb24sIGNvbG9yLCBib3JkZXIsIHVzZURlZmF1bHRDYW52YXMpIHtcbiAgICAgICAgdGhpcy51c2VEZWZhdWx0Q2FudmFzID0gdXNlRGVmYXVsdENhbnZhcyB8fCBmYWxzZTtcbiAgICAgICAgdGhpcy5ib3JkZXIgPSBib3JkZXIgfHwgYm9yZGVyID09PSB1bmRlZmluZWQ7XG4gICAgICAgIHRoaXMuZGltZW5zaW9uID0gZGltZW5zaW9uID09PSB1bmRlZmluZWQgPyBuZXcgb2JlbGlzay5TbG9wZURpbWVuc2lvbigpIDogZGltZW5zaW9uO1xuICAgICAgICB0aGlzLmNvbG9yID0gY29sb3IgPT09IHVuZGVmaW5lZCA/IG5ldyBvYmVsaXNrLlNsb3BlQ29sb3IoKSA6IGNvbG9yO1xuICAgIH07XG5cbiAgICBwLmluaXRSZWN0YW5nbGUgPSBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgdGhpcy53ID0gdGhpcy5kaW1lbnNpb24ueEF4aXMgKyB0aGlzLmRpbWVuc2lvbi55QXhpcztcbiAgICAgICAgdGhpcy5oID0gdGhpcy5kaW1lbnNpb24ueUF4aXMgKiAzIC8gMiArIHRoaXMuZGltZW5zaW9uLnhBeGlzIC8gMjtcblxuICAgICAgICAvLyAyMi42IGRlZ3JlZXMgaW1wbGVtZW50YXRpb25cbiAgICAgICAgdGhpcy53IC09IDI7XG4gICAgICAgIHRoaXMuaCAtPSAzO1xuXG4gICAgICAgIC8vIHRoZSBtYXRyaXggb2Zmc2V0IGJldHdlZW4gdGhlIGJpdG1hcCBhbmQgdGhlIDNkIHBpeGVsIGNvb3JkaW5hdGUgWkVSTyBwb2ludFxuICAgICAgICB0aGlzLm1hdHJpeCA9IG5ldyBvYmVsaXNrLk1hdHJpeCgpO1xuICAgICAgICB0aGlzLm1hdHJpeC50eCA9IC0odGhpcy5kaW1lbnNpb24ueUF4aXMgLSAyKTtcbiAgICAgICAgdGhpcy5tYXRyaXgudHkgPSAtKHRoaXMuZGltZW5zaW9uLnlBeGlzIC0gMik7XG4gICAgfTtcblxuICAgIHAuaW5pdEJpdG1hcERhdGEgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuYml0bWFwRGF0YSA9IG5ldyBvYmVsaXNrLkJpdG1hcERhdGEodGhpcy53LCB0aGlzLmgsIHRoaXMudXNlRGVmYXVsdENhbnZhcyk7XG4gICAgfTtcbiAgICBwLnJlbmRlckJpdG1hcERhdGFGb3JDYW52YXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuY2FudmFzID0gdGhpcy5iaXRtYXBEYXRhLmNhbnZhcztcbiAgICB9O1xuXG4gICAgcC5idWlsZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGNvbG9yQm9yZGVyTGVmdCwgY29sb3JCb3JkZXJSaWdodCwgY29sb3JCb3JkZXJIaWdobGlnaHQsXG4gICAgICAgICAgICBzaWRlWCwgcG9YLCBjdHgsIGJtZCxcbiAgICAgICAgICAgIGksIGosIG47XG5cbiAgICAgICAgY29sb3JCb3JkZXJMZWZ0ID0gdGhpcy5ib3JkZXIgPyB0aGlzLmNvbG9yLmJvcmRlciA6IHRoaXMuY29sb3IubGVmdDtcbiAgICAgICAgY29sb3JCb3JkZXJSaWdodCA9IHRoaXMuYm9yZGVyID8gdGhpcy5jb2xvci5ib3JkZXIgOiB0aGlzLmNvbG9yLnJpZ2h0O1xuICAgICAgICBjb2xvckJvcmRlckhpZ2hsaWdodCA9IHRoaXMuYm9yZGVyID8gdGhpcy5jb2xvci5ib3JkZXJIaWdobGlnaHQgOiB0aGlzLmNvbG9yLmxlZnQ7XG5cbiAgICAgICAgc2lkZVggPSBuZXcgb2JlbGlzay5TaWRlWChcbiAgICAgICAgICAgIG5ldyBvYmVsaXNrLlNpZGVYRGltZW5zaW9uKHRoaXMuZGltZW5zaW9uLnhBeGlzLCB0aGlzLmggLSB0aGlzLmRpbWVuc2lvbi54QXhpcyAvIDIpLFxuICAgICAgICAgICAgbmV3IG9iZWxpc2suU2lkZUNvbG9yKGNvbG9yQm9yZGVyTGVmdCwgdGhpcy5jb2xvci5sZWZ0KVxuICAgICAgICApO1xuXG4gICAgICAgIHBvWCA9IG5ldyBvYmVsaXNrLlBpeGVsT2JqZWN0KHNpZGVYKTtcblxuICAgICAgICBjdHggPSB0aGlzLmJpdG1hcERhdGEuY29udGV4dDtcbiAgICAgICAgY3R4LmRyYXdJbWFnZShwb1guY2FudmFzLCBwb1gueCwgcG9YLnkgKyB0aGlzLmggLSB0aGlzLmRpbWVuc2lvbi54QXhpcyAvIDIpO1xuXG4gICAgICAgIGJtZCA9IG5ldyBvYmVsaXNrLkJpdG1hcERhdGEodGhpcy53LCB0aGlzLmgpO1xuXG4gICAgICAgIC8vIGNsb3NlIHRoZSBwYXRoIGZvciBmbG9vZGZpbGxcbiAgICAgICAgZm9yIChpID0gdGhpcy5oIC0gdGhpcy5kaW1lbnNpb24ueUF4aXMgKiAzIC8gMiArIDI7IGkgPCB0aGlzLmg7IGkgKz0gMSkge1xuICAgICAgICAgICAgYm1kLnNldFBpeGVsKHRoaXMuZGltZW5zaW9uLnhBeGlzIC0gMSwgaSwgY29sb3JCb3JkZXJSaWdodCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyB5IGF4aXNcbiAgICAgICAgZm9yIChqID0gMTsgaiA8IHRoaXMuZGltZW5zaW9uLnlBeGlzOyBqICs9IDEpIHtcbiAgICAgICAgICAgIGJtZC5zZXRQaXhlbCh0aGlzLmRpbWVuc2lvbi54QXhpcyArIGogLSAyLCB0aGlzLmggLSBNYXRoLmZsb29yKGogLyAyKSAtIDEsIGNvbG9yQm9yZGVyUmlnaHQpO1xuICAgICAgICAgICAgYm1kLnNldFBpeGVsKHRoaXMuZGltZW5zaW9uLnhBeGlzICsgaiAtIDIsIHRoaXMuZGltZW5zaW9uLnhBeGlzIC8gMiAtIDIgKyBqLCBjb2xvckJvcmRlclJpZ2h0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGZsb29kIGZpbGxcbiAgICAgICAgYm1kLmZsb29kRmlsbCh0aGlzLmRpbWVuc2lvbi54QXhpcyArIDEsIHRoaXMuaCAtIDMsIHRoaXMuY29sb3IucmlnaHQpO1xuXG4gICAgICAgIC8vaGlnaGxpZ2h0XG4gICAgICAgIGZvciAobiA9IHRoaXMuZGltZW5zaW9uLnhBeGlzIC8gMjsgbiA8IHRoaXMuaCAtIDE7IG4gKz0gMSkge1xuICAgICAgICAgICAgYm1kLnNldFBpeGVsKHRoaXMuZGltZW5zaW9uLnhBeGlzIC0gMSwgbiwgdGhpcy5jb2xvci5yaWdodCk7XG4gICAgICAgICAgICBibWQuc2V0UGl4ZWwodGhpcy5kaW1lbnNpb24ueEF4aXMgLSAyLCBuLCBjb2xvckJvcmRlckhpZ2hsaWdodCk7XG4gICAgICAgIH1cblxuICAgICAgICBibWQuY29udGV4dC5wdXRJbWFnZURhdGEoYm1kLmltYWdlRGF0YSwgMCwgMCk7XG4gICAgICAgIGN0eC5kcmF3SW1hZ2UoYm1kLmNhbnZhcywgMCwgMCk7XG4gICAgfTtcblxuICAgIC8vIHB1YmxpYyBtZXRob2RzXG4gICAgcC50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIFwiW1Nsb3BlTm9ydGhdXCI7XG4gICAgfTtcblxuICAgIG9iZWxpc2suU2xvcGVOb3J0aCA9IFNsb3BlTm9ydGg7XG59KG9iZWxpc2spKTtcblxuLypnbG9iYWwgb2JlbGlzazp0cnVlKi9cblxuLypcbiAqIFNsb3BlIFNvdXRoXG4gKi9cblxuKGZ1bmN0aW9uIChvYmVsaXNrKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICB2YXIgU2xvcGVTb3V0aCwgcDtcbiAgICBTbG9wZVNvdXRoID0gZnVuY3Rpb24gKGRpbWVuc2lvbiwgY29sb3IsIGJvcmRlciwgdXNlRGVmYXVsdENhbnZhcykge1xuICAgICAgICB0aGlzLmluaXRpYWxpemUoZGltZW5zaW9uLCBjb2xvciwgYm9yZGVyLCB1c2VEZWZhdWx0Q2FudmFzKTtcbiAgICB9O1xuICAgIHAgPSBTbG9wZVNvdXRoLnByb3RvdHlwZSA9IG5ldyBvYmVsaXNrLkFic3RyYWN0UHJpbWl0aXZlKCk7XG5cbiAgICAvLyBjb25zdHJ1Y3RvclxuICAgIHAuaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uIChkaW1lbnNpb24sIGNvbG9yLCBib3JkZXIsIHVzZURlZmF1bHRDYW52YXMpIHtcbiAgICAgICAgdGhpcy5pbml0UmVuZGVyKGRpbWVuc2lvbiwgY29sb3IsIGJvcmRlciwgdXNlRGVmYXVsdENhbnZhcyk7XG4gICAgICAgIHRoaXMuaW5pdFJlY3RhbmdsZSgpO1xuICAgICAgICB0aGlzLmluaXRCaXRtYXBEYXRhKCk7XG4gICAgICAgIHRoaXMuYnVpbGQoKTtcbiAgICAgICAgdGhpcy5yZW5kZXJCaXRtYXBEYXRhRm9yQ2FudmFzKCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICAvLyBwcml2YXRlIG1ldGhvZFxuICAgIHAuaW5pdFJlbmRlciA9IGZ1bmN0aW9uIChkaW1lbnNpb24sIGNvbG9yLCBib3JkZXIsIHVzZURlZmF1bHRDYW52YXMpIHtcbiAgICAgICAgdGhpcy51c2VEZWZhdWx0Q2FudmFzID0gdXNlRGVmYXVsdENhbnZhcyB8fCBmYWxzZTtcbiAgICAgICAgdGhpcy5ib3JkZXIgPSBib3JkZXIgfHwgYm9yZGVyID09PSB1bmRlZmluZWQ7XG4gICAgICAgIHRoaXMuZGltZW5zaW9uID0gZGltZW5zaW9uID09PSB1bmRlZmluZWQgPyBuZXcgb2JlbGlzay5TbG9wZURpbWVuc2lvbigpIDogZGltZW5zaW9uO1xuICAgICAgICB0aGlzLmNvbG9yID0gY29sb3IgPT09IHVuZGVmaW5lZCA/IG5ldyBvYmVsaXNrLlNsb3BlQ29sb3IoKSA6IGNvbG9yO1xuICAgIH07XG5cbiAgICBwLmluaXRSZWN0YW5nbGUgPSBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgdGhpcy53ID0gdGhpcy5kaW1lbnNpb24ueEF4aXMgKyB0aGlzLmRpbWVuc2lvbi55QXhpcztcbiAgICAgICAgdGhpcy5oID0gdGhpcy5kaW1lbnNpb24ueEF4aXMgLyAyICsgdGhpcy5kaW1lbnNpb24ueUF4aXMgKiAyO1xuXG4gICAgICAgIC8vIDIyLjYgZGVncmVlcyBpbXBsZW1lbnRhdGlvblxuICAgICAgICB0aGlzLncgLT0gMjtcbiAgICAgICAgdGhpcy5oIC09IDM7XG5cbiAgICAgICAgLy8gdGhlIG1hdHJpeCBvZmZzZXQgYmV0d2VlbiB0aGUgYml0bWFwIGFuZCB0aGUgM2QgcGl4ZWwgY29vcmRpbmF0ZSBaRVJPIHBvaW50XG4gICAgICAgIHRoaXMubWF0cml4ID0gbmV3IG9iZWxpc2suTWF0cml4KCk7XG4gICAgICAgIHRoaXMubWF0cml4LnR4ID0gLSh0aGlzLmRpbWVuc2lvbi55QXhpcyAtIDIpO1xuICAgICAgICB0aGlzLm1hdHJpeC50eSA9IC0odGhpcy5kaW1lbnNpb24ueUF4aXMgKiAzIC8gMiAtIDIpO1xuICAgIH07XG5cbiAgICBwLmluaXRCaXRtYXBEYXRhID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmJpdG1hcERhdGEgPSBuZXcgb2JlbGlzay5CaXRtYXBEYXRhKHRoaXMudywgdGhpcy5oLCB0aGlzLnVzZURlZmF1bHRDYW52YXMpO1xuICAgIH07XG4gICAgcC5yZW5kZXJCaXRtYXBEYXRhRm9yQ2FudmFzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmJpdG1hcERhdGEuY29udGV4dC5wdXRJbWFnZURhdGEodGhpcy5iaXRtYXBEYXRhLmltYWdlRGF0YSwgMCwgMCk7XG4gICAgICAgIHRoaXMuY2FudmFzID0gdGhpcy5iaXRtYXBEYXRhLmNhbnZhcztcbiAgICB9O1xuXG4gICAgcC5idWlsZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGNvbG9yQm9yZGVyTGVmdCwgY29sb3JCb3JkZXJSaWdodCxcbiAgICAgICAgICAgIGksIGosIGssIG0sIG47XG5cbiAgICAgICAgY29sb3JCb3JkZXJMZWZ0ID0gdGhpcy5ib3JkZXIgPyB0aGlzLmNvbG9yLmJvcmRlciA6IHRoaXMuY29sb3IubGVmdFNsb3BlO1xuICAgICAgICBjb2xvckJvcmRlclJpZ2h0ID0gdGhpcy5ib3JkZXIgPyB0aGlzLmNvbG9yLmJvcmRlciA6IHRoaXMuY29sb3IucmlnaHQ7XG5cbiAgICAgICAgLy8geCBheGlzXG4gICAgICAgIGZvciAoaiA9IDA7IGogPCB0aGlzLmRpbWVuc2lvbi54QXhpczsgaiArPSAxKSB7XG4gICAgICAgICAgICB0aGlzLmJpdG1hcERhdGEuc2V0UGl4ZWwoaiwgdGhpcy5kaW1lbnNpb24ueUF4aXMgKiAyICsgTWF0aC5mbG9vcihqIC8gMikgLSAzLCBjb2xvckJvcmRlckxlZnQpO1xuICAgICAgICAgICAgdGhpcy5iaXRtYXBEYXRhLnNldFBpeGVsKGogKyB0aGlzLmRpbWVuc2lvbi55QXhpcyAtIDIsIE1hdGguZmxvb3IoaiAvIDIpLCBjb2xvckJvcmRlckxlZnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8geSBheGlzXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCB0aGlzLmRpbWVuc2lvbi55QXhpczsgaSArPSAxKSB7XG4gICAgICAgICAgICB0aGlzLmJpdG1hcERhdGEuc2V0UGl4ZWwodGhpcy5kaW1lbnNpb24ueEF4aXMgLSAyICsgaSwgdGhpcy5oIC0gTWF0aC5mbG9vcihpIC8gMikgLSAxLCBjb2xvckJvcmRlclJpZ2h0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHogYXhpc1xuICAgICAgICBmb3IgKGsgPSB0aGlzLmRpbWVuc2lvbi54QXhpcyAvIDIgLSAxOyBrIDwgdGhpcy5oIC0gdGhpcy5kaW1lbnNpb24ueUF4aXMgLyAyOyBrICs9IDEpIHtcbiAgICAgICAgICAgIHRoaXMuYml0bWFwRGF0YS5zZXRQaXhlbCh0aGlzLncgLSAxLCBrLCBjb2xvckJvcmRlclJpZ2h0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHNsb3RcbiAgICAgICAgZm9yIChtID0gMDsgbSA8IHRoaXMuZGltZW5zaW9uLnlBeGlzICogMiAtIDI7IG0gKz0gMSkge1xuICAgICAgICAgICAgdGhpcy5iaXRtYXBEYXRhLnNldFBpeGVsKE1hdGguZmxvb3IobSAvIDIpLCB0aGlzLmRpbWVuc2lvbi55QXhpcyAqIDIgLSBtIC0gMywgY29sb3JCb3JkZXJMZWZ0KTtcbiAgICAgICAgICAgIHRoaXMuYml0bWFwRGF0YS5zZXRQaXhlbCh0aGlzLmRpbWVuc2lvbi54QXhpcyAtIDIgKyBNYXRoLmZsb29yKG0gLyAyKSwgdGhpcy5oIC0gbSAtIDEsIGNvbG9yQm9yZGVyTGVmdCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBmbG9vZCBmaWxsXG4gICAgICAgIHRoaXMuYml0bWFwRGF0YS5mbG9vZEZpbGwodGhpcy5kaW1lbnNpb24ueUF4aXMgLSAxLCAxLCB0aGlzLmNvbG9yLmxlZnRTbG9wZSk7XG4gICAgICAgIHRoaXMuYml0bWFwRGF0YS5mbG9vZEZpbGwodGhpcy5kaW1lbnNpb24ueEF4aXMsIHRoaXMuaCAtIDMsIHRoaXMuY29sb3IucmlnaHQpO1xuICAgICAgICAvLyBoYWNrIHNpbmdsZSBwaXhlbFxuICAgICAgICB0aGlzLmJpdG1hcERhdGEuc2V0UGl4ZWwodGhpcy5kaW1lbnNpb24ueEF4aXMgLSAxLCB0aGlzLmggLSAyLCB0aGlzLmNvbG9yLnJpZ2h0KTtcblxuICAgICAgICAvLyBoaWdobGlnaHRcbiAgICAgICAgaWYgKHRoaXMuYm9yZGVyKSB7XG4gICAgICAgICAgICBmb3IgKG4gPSAxOyBuIDwgdGhpcy5kaW1lbnNpb24ueUF4aXMgKiAyIC0gMzsgbiArPSAxKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5iaXRtYXBEYXRhLnNldFBpeGVsKHRoaXMuZGltZW5zaW9uLnhBeGlzIC0gMiArIE1hdGguZmxvb3IobiAvIDIpLCB0aGlzLmggLSBuIC0gMSwgdGhpcy5jb2xvci5ib3JkZXJIaWdobGlnaHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8vIHB1YmxpYyBtZXRob2RzXG4gICAgcC50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIFwiW1Nsb3BlU291dGhdXCI7XG4gICAgfTtcblxuICAgIG9iZWxpc2suU2xvcGVTb3V0aCA9IFNsb3BlU291dGg7XG59KG9iZWxpc2spKTtcblxuLypnbG9iYWwgb2JlbGlzazp0cnVlKi9cblxuLypcbiAqIFNsb3BlIFdlc3RcbiAqL1xuXG4oZnVuY3Rpb24gKG9iZWxpc2spIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHZhciBTbG9wZVdlc3QsIHA7XG4gICAgU2xvcGVXZXN0ID0gZnVuY3Rpb24gKGRpbWVuc2lvbiwgY29sb3IsIGJvcmRlciwgdXNlRGVmYXVsdENhbnZhcykge1xuICAgICAgICB0aGlzLmluaXRpYWxpemUoZGltZW5zaW9uLCBjb2xvciwgYm9yZGVyLCB1c2VEZWZhdWx0Q2FudmFzKTtcbiAgICB9O1xuICAgIHAgPSBTbG9wZVdlc3QucHJvdG90eXBlID0gbmV3IG9iZWxpc2suQWJzdHJhY3RQcmltaXRpdmUoKTtcblxuICAgIC8vIGNvbnN0cnVjdG9yXG4gICAgcC5pbml0aWFsaXplID0gZnVuY3Rpb24gKGRpbWVuc2lvbiwgY29sb3IsIGJvcmRlciwgdXNlRGVmYXVsdENhbnZhcykge1xuICAgICAgICB0aGlzLmluaXRSZW5kZXIoZGltZW5zaW9uLCBjb2xvciwgYm9yZGVyLCB1c2VEZWZhdWx0Q2FudmFzKTtcbiAgICAgICAgdGhpcy5pbml0UmVjdGFuZ2xlKCk7XG4gICAgICAgIHRoaXMuaW5pdEJpdG1hcERhdGEoKTtcbiAgICAgICAgdGhpcy5idWlsZCgpO1xuICAgICAgICB0aGlzLnJlbmRlckJpdG1hcERhdGFGb3JDYW52YXMoKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIC8vIHByaXZhdGUgbWV0aG9kXG4gICAgcC5pbml0UmVuZGVyID0gZnVuY3Rpb24gKGRpbWVuc2lvbiwgY29sb3IsIGJvcmRlciwgdXNlRGVmYXVsdENhbnZhcykge1xuICAgICAgICB0aGlzLnVzZURlZmF1bHRDYW52YXMgPSB1c2VEZWZhdWx0Q2FudmFzIHx8IGZhbHNlO1xuICAgICAgICB0aGlzLmJvcmRlciA9IGJvcmRlciB8fCBib3JkZXIgPT09IHVuZGVmaW5lZDtcbiAgICAgICAgdGhpcy5kaW1lbnNpb24gPSBkaW1lbnNpb24gPT09IHVuZGVmaW5lZCA/IG5ldyBvYmVsaXNrLlNsb3BlRGltZW5zaW9uKCkgOiBkaW1lbnNpb247XG4gICAgICAgIHRoaXMuY29sb3IgPSBjb2xvciA9PT0gdW5kZWZpbmVkID8gbmV3IG9iZWxpc2suU2xvcGVDb2xvcigpIDogY29sb3I7XG4gICAgfTtcblxuICAgIHAuaW5pdFJlY3RhbmdsZSA9IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICB0aGlzLncgPSB0aGlzLmRpbWVuc2lvbi54QXhpcyArIHRoaXMuZGltZW5zaW9uLnlBeGlzO1xuICAgICAgICB0aGlzLmggPSB0aGlzLmRpbWVuc2lvbi54QXhpcyAqIDMgLyAyICsgdGhpcy5kaW1lbnNpb24ueUF4aXMgLyAyO1xuXG4gICAgICAgIC8vIDIyLjYgZGVncmVlcyBpbXBsZW1lbnRhdGlvblxuICAgICAgICB0aGlzLncgLT0gMjtcbiAgICAgICAgdGhpcy5oIC09IDM7XG5cbiAgICAgICAgLy8gdGhlIG1hdHJpeCBvZmZzZXQgYmV0d2VlbiB0aGUgYml0bWFwIGFuZCB0aGUgM2QgcGl4ZWwgY29vcmRpbmF0ZSBaRVJPIHBvaW50XG4gICAgICAgIHRoaXMubWF0cml4ID0gbmV3IG9iZWxpc2suTWF0cml4KCk7XG4gICAgICAgIHRoaXMubWF0cml4LnR4ID0gLSh0aGlzLmRpbWVuc2lvbi55QXhpcyAtIDIpO1xuICAgICAgICB0aGlzLm1hdHJpeC50eSA9IC0odGhpcy5kaW1lbnNpb24ueEF4aXMgLSAyKTtcbiAgICB9O1xuXG4gICAgcC5pbml0Qml0bWFwRGF0YSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5iaXRtYXBEYXRhID0gbmV3IG9iZWxpc2suQml0bWFwRGF0YSh0aGlzLncsIHRoaXMuaCwgdGhpcy51c2VEZWZhdWx0Q2FudmFzKTtcbiAgICB9O1xuICAgIHAucmVuZGVyQml0bWFwRGF0YUZvckNhbnZhcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5jYW52YXMgPSB0aGlzLmJpdG1hcERhdGEuY2FudmFzO1xuICAgIH07XG5cbiAgICBwLmJ1aWxkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgY29sb3JCb3JkZXJMZWZ0LCBjb2xvckJvcmRlclJpZ2h0LCBjb2xvckJvcmRlckhpZ2hsaWdodCxcbiAgICAgICAgICAgIHNpZGVZLCBwb1ksIGN0eCwgYm1kLFxuICAgICAgICAgICAgaSwgaiwgbjtcblxuICAgICAgICBjb2xvckJvcmRlckxlZnQgPSB0aGlzLmJvcmRlciA/IHRoaXMuY29sb3IuYm9yZGVyIDogdGhpcy5jb2xvci5sZWZ0O1xuICAgICAgICBjb2xvckJvcmRlclJpZ2h0ID0gdGhpcy5ib3JkZXIgPyB0aGlzLmNvbG9yLmJvcmRlciA6IHRoaXMuY29sb3IucmlnaHQ7XG4gICAgICAgIGNvbG9yQm9yZGVySGlnaGxpZ2h0ID0gdGhpcy5ib3JkZXIgPyB0aGlzLmNvbG9yLmJvcmRlckhpZ2hsaWdodCA6IHRoaXMuY29sb3IubGVmdDtcblxuICAgICAgICBzaWRlWSA9IG5ldyBvYmVsaXNrLlNpZGVZKFxuICAgICAgICAgICAgbmV3IG9iZWxpc2suU2lkZVlEaW1lbnNpb24odGhpcy5kaW1lbnNpb24ueUF4aXMsIHRoaXMuaCAtIHRoaXMuZGltZW5zaW9uLnlBeGlzIC8gMiksXG4gICAgICAgICAgICBuZXcgb2JlbGlzay5TaWRlQ29sb3IoY29sb3JCb3JkZXJSaWdodCwgdGhpcy5jb2xvci5yaWdodClcbiAgICAgICAgKTtcblxuICAgICAgICBwb1kgPSBuZXcgb2JlbGlzay5QaXhlbE9iamVjdChzaWRlWSk7XG5cbiAgICAgICAgY3R4ID0gdGhpcy5iaXRtYXBEYXRhLmNvbnRleHQ7XG4gICAgICAgIGN0eC5kcmF3SW1hZ2UocG9ZLmNhbnZhcywgcG9ZLnggKyB0aGlzLncgLSAyLCBwb1kueSArIHRoaXMuaCAtIHRoaXMuZGltZW5zaW9uLnlBeGlzIC8gMik7XG5cbiAgICAgICAgYm1kID0gbmV3IG9iZWxpc2suQml0bWFwRGF0YSh0aGlzLncsIHRoaXMuaCk7XG5cbiAgICAgICAgLy8gY2xvc2UgdGhlIHBhdGggZm9yIGZsb29kZmlsbFxuICAgICAgICBmb3IgKGkgPSB0aGlzLmggLSB0aGlzLmRpbWVuc2lvbi54QXhpcyAqIDMgLyAyICsgMjsgaSA8IHRoaXMuaDsgaSArPSAxKSB7XG4gICAgICAgICAgICBibWQuc2V0UGl4ZWwodGhpcy5kaW1lbnNpb24ueEF4aXMgLSAyLCBpLCBjb2xvckJvcmRlckxlZnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy94IGF4aXNcbiAgICAgICAgZm9yIChqID0gMDsgaiA8IHRoaXMuZGltZW5zaW9uLnhBeGlzIC0gMTsgaiArPSAxKSB7XG4gICAgICAgICAgICBibWQuc2V0UGl4ZWwoaiwgdGhpcy5kaW1lbnNpb24ueEF4aXMgKyB0aGlzLmRpbWVuc2lvbi55QXhpcyAvIDIgLSAzICsgTWF0aC5mbG9vcihqIC8gMiksIGNvbG9yQm9yZGVyTGVmdCk7XG4gICAgICAgICAgICBibWQuc2V0UGl4ZWwoaiwgdGhpcy5kaW1lbnNpb24ueEF4aXMgKyB0aGlzLmRpbWVuc2lvbi55QXhpcyAvIDIgLSAzIC0gaiwgY29sb3JCb3JkZXJMZWZ0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGZsb29kIGZpbGxcbiAgICAgICAgYm1kLmZsb29kRmlsbCh0aGlzLmRpbWVuc2lvbi54QXhpcyAtIDMsIHRoaXMuaCAtIDMsIHRoaXMuY29sb3IubGVmdCk7XG5cbiAgICAgICAgLy9oaWdobGlnaHRcbiAgICAgICAgZm9yIChuID0gdGhpcy5kaW1lbnNpb24ueUF4aXMgLyAyOyBuIDwgdGhpcy5oIC0gMTsgbiArPSAxKSB7XG4gICAgICAgICAgICBibWQuc2V0UGl4ZWwodGhpcy5kaW1lbnNpb24ueEF4aXMgLSAyLCBuLCBjb2xvckJvcmRlckhpZ2hsaWdodCk7XG4gICAgICAgIH1cblxuICAgICAgICBibWQuY29udGV4dC5wdXRJbWFnZURhdGEoYm1kLmltYWdlRGF0YSwgMCwgMCk7XG4gICAgICAgIGN0eC5kcmF3SW1hZ2UoYm1kLmNhbnZhcywgMCwgMCk7XG4gICAgfTtcblxuICAgIC8vIHB1YmxpYyBtZXRob2RzXG4gICAgcC50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIFwiW1Nsb3BlV2VzdF1cIjtcbiAgICB9O1xuXG4gICAgb2JlbGlzay5TbG9wZVdlc3QgPSBTbG9wZVdlc3Q7XG59KG9iZWxpc2spKTtcblxuLypnbG9iYWwgb2JlbGlzazp0cnVlLCBkb2N1bWVudDp0cnVlKi9cblxuLypcbiAqIENhbnZhc01hbmFnZXJcbiAqL1xuXG4oZnVuY3Rpb24gKG9iZWxpc2ssIGRvY3VtZW50KSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICB2YXIgQ2FudmFzTWFuYWdlciwgcDtcbiAgICBDYW52YXNNYW5hZ2VyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NvbG9yR2VvbSBpcyBhIHN0YXRpYyBDbGFzcywgY2Fubm90IGJlIGluc3RhbmNlZC4nKTtcbiAgICB9O1xuICAgIHAgPSBDYW52YXNNYW5hZ2VyO1xuXG4gICAgLy8gcHVibGljIHByb3BlcnRpZXNcbiAgICBwLmRlZmF1bHRDYW52YXMgPSBudWxsO1xuXG4gICAgLy8gcHVibGljIG1ldGhvZHNcbiAgICBwLmdldERlZmF1bHRDYW52YXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHAuZGVmYXVsdENhbnZhcyA9IHAuZGVmYXVsdENhbnZhcyB8fCBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgICAgICAgcmV0dXJuIHAuZGVmYXVsdENhbnZhcztcbiAgICB9O1xuXG4gICAgcC5nZXROZXdDYW52YXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgICB9O1xuXG4gICAgcC50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIFwiW0NhbnZhc01hbmFnZXJdXCI7XG4gICAgfTtcblxuICAgIG9iZWxpc2suQ2FudmFzTWFuYWdlciA9IENhbnZhc01hbmFnZXI7XG59KG9iZWxpc2ssIGRvY3VtZW50KSk7XG5cbi8qZ2xvYmFsIG9iZWxpc2s6dHJ1ZSovXG5cbi8qXG4gKiBDYW52YXNUb29sXG4gKi9cblxuKGZ1bmN0aW9uIChvYmVsaXNrKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICB2YXIgQ2FudmFzVG9vbCwgcDtcblxuICAgIENhbnZhc1Rvb2wgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignQ2FudmFzVG9vbCBpcyBhIHN0YXRpYyBDbGFzcywgY2Fubm90IGJlIGluc3RhbmNlZC4nKTtcbiAgICB9O1xuICAgIHAgPSBDYW52YXNUb29sO1xuXG4gICAgLy8gcHVibGljIG1ldGhvZHNcbiAgICBwLmdldFBpeGVsID0gZnVuY3Rpb24gKGltYWdlRGF0YSwgeCwgeSkge1xuICAgICAgICB2YXIgZGF0YSwgaW5kZXgsIHIsIGcsIGI7XG4gICAgICAgIGRhdGEgPSBpbWFnZURhdGEuZGF0YTtcbiAgICAgICAgaW5kZXggPSAoeSAqIGltYWdlRGF0YS53aWR0aCArIHgpICogNDtcbiAgICAgICAgciA9IGRhdGFbaW5kZXhdO1xuICAgICAgICBnID0gZGF0YVtpbmRleCArIDFdO1xuICAgICAgICBiID0gZGF0YVtpbmRleCArIDJdO1xuXG4gICAgICAgIHJldHVybiAoKHIgPDwgMTYpIHwgKGcgPDwgOCkgfCBiKTtcbiAgICB9O1xuXG4gICAgcC50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIFwiW0NhbnZhc1Rvb2xdXCI7XG4gICAgfTtcblxuICAgIG9iZWxpc2suQ2FudmFzVG9vbCA9IENhbnZhc1Rvb2w7XG59KG9iZWxpc2spKTtcblxuLypnbG9iYWwgb2JlbGlzazp0cnVlKi9cblxuLypcbiAqIENvbG9yR2VvbVxuICovXG5cbihmdW5jdGlvbiAob2JlbGlzaykge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgdmFyIENvbG9yR2VvbSwgcDtcblxuICAgIENvbG9yR2VvbSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDb2xvckdlb20gaXMgYSBzdGF0aWMgQ2xhc3MsIGNhbm5vdCBiZSBpbnN0YW5jZWQuJyk7XG4gICAgfTtcbiAgICBwID0gQ29sb3JHZW9tO1xuXG4gICAgLy8gcHVibGljIG1ldGhvZHNcbiAgICBwLmdldDMyID0gZnVuY3Rpb24gKGNvbG9yKSB7XG4gICAgICAgIHJldHVybiBjb2xvciA8IDB4RkYwMDAwMDAgPyAoY29sb3IgKyAweEZGMDAwMDAwKSA6IGNvbG9yO1xuICAgIH07XG5cbiAgICBwLmFwcGx5QnJpZ2h0bmVzcyA9IGZ1bmN0aW9uIChjb2xvciwgYnJpZ2h0bmVzcywgaGlnaGxpZ2h0KSB7XG4gICAgICAgIHZhciBhLCByLCBnLCBiLCB5LCB2LCB1O1xuICAgICAgICBhID0gKChjb2xvciA+Pj4gMjQpICYgMHgwMDAwMDBGRik7XG4gICAgICAgIHIgPSAoKGNvbG9yID4+PiAxNikgJiAweDAwMDAwMEZGKTtcbiAgICAgICAgZyA9ICgoY29sb3IgPj4+IDgpICYgMHgwMDAwMDBGRik7XG4gICAgICAgIGIgPSAoY29sb3IgJiAweDAwMDAwMEZGKTtcblxuICAgICAgICB5ID0gKChyICogMzEzNTI0KSA+PiAyMCkgKyAoKGcgKiA2MTU1MTQpID4+IDIwKSArICgoYiAqIDExOTUzOCkgPj4gMjApO1xuICAgICAgICB1ID0gLSgoMTU1MTg5ICogcikgPj4gMjApIC0gKCgzMDMwMzggKiBnKSA+PiAyMCkgKyAoKDQ1ODIyNyAqIGIpID4+IDIwKTtcbiAgICAgICAgdiA9ICgoNjQ0ODc0ICogcikgPj4gMjApIC0gKCg1NDAwMTYgKiBnKSA+PiAyMCkgLSAoKDEwNDg1NyAqIGIpID4+IDIwKTtcblxuICAgICAgICBpZiAoIWhpZ2hsaWdodCkge1xuICAgICAgICAgICAgeSArPSBicmlnaHRuZXNzO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgeSA9IDYwICsgTWF0aC5wb3coeSwgMS4yKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHIgPSB5ICsgKCgxMTk1Mzc2ICogdikgPj4gMjApO1xuICAgICAgICBnID0geSAtICgoNDA4OTQ0ICogdSkgPj4gMjApIC0gKCg2MDgxNzQgKiB2KSA+PiAyMCk7XG4gICAgICAgIGIgPSB5ICsgKCgyMTI4NjA5ICogdSkgPj4gMjApO1xuXG4gICAgICAgIHIgPSBNYXRoLm1heCgwLCBNYXRoLm1pbihyLCAyNTUpKTtcbiAgICAgICAgZyA9IE1hdGgubWF4KDAsIE1hdGgubWluKGcsIDI1NSkpO1xuICAgICAgICBiID0gTWF0aC5tYXgoMCwgTWF0aC5taW4oYiwgMjU1KSk7XG5cbiAgICAgICAgcmV0dXJuIChhIDw8IDI0KSB8IChyIDw8IDE2KSB8IChnIDw8IDgpIHwgYjtcbiAgICB9O1xuXG4gICAgcC50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIFwiW0NvbG9yR2VvbV1cIjtcbiAgICB9O1xuXG4gICAgb2JlbGlzay5Db2xvckdlb20gPSBDb2xvckdlb207XG59KG9iZWxpc2spKTtcblxuLypnbG9iYWwgb2JlbGlzazp0cnVlKi9cblxuLypcbiAqIENvbG9yUGF0dGVyblxuICovXG5cbihmdW5jdGlvbiAob2JlbGlzaykge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgdmFyIENvbG9yUGF0dHJlbiwgcDtcblxuICAgIENvbG9yUGF0dHJlbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDb2xvckdlb20gaXMgYSBzdGF0aWMgQ2xhc3MsIGNhbm5vdCBiZSBpbnN0YW5jZWQuJyk7XG4gICAgfTtcbiAgICBwID0gQ29sb3JQYXR0cmVuO1xuXG4gICAgLy8gcHVibGljIHByb3BlcnRpZXNcbiAgICBwLkdSQVNTX0dSRUVOID0gMHhDQ0ZGMDA7XG4gICAgcC5ZRUxMT1cgPSAweEZGRkYwMDtcbiAgICBwLldJTkVfUkVEID0gMHhGRjAwOTk7XG4gICAgcC5QSU5LID0gMHhGRjdDQkY7XG4gICAgcC5QVVJQTEUgPSAweENDMDBGRjtcbiAgICBwLkJMVUUgPSAweDAwQ0NGRjtcbiAgICBwLkdSQVkgPSAweEVFRUVFRTtcbiAgICBwLkJMQUNLID0gMHg2NjY2NjY7XG4gICAgcC5GSU5FX0NPTE9SUyA9XG4gICAgICAgIFtcbiAgICAgICAgICAgIHAuR1JBU1NfR1JFRU4sXG4gICAgICAgICAgICBwLllFTExPVyxcbiAgICAgICAgICAgIHAuV0lORV9SRUQsXG4gICAgICAgICAgICBwLlBJTkssXG4gICAgICAgICAgICBwLlBVUlBMRSxcbiAgICAgICAgICAgIHAuQkxVRSxcbiAgICAgICAgICAgIHAuR1JBWSxcbiAgICAgICAgICAgIHAuQkxBQ0tcbiAgICAgICAgXTtcblxuICAgIC8vIHB1YmxpYyBtZXRob2RzXG4gICAgcC5nZXRSYW5kb21Db21mb3J0YWJsZUNvbG9yID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gcC5GSU5FX0NPTE9SU1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBwLkZJTkVfQ09MT1JTLmxlbmd0aCldO1xuICAgIH07XG5cbiAgICBwLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gXCJbQ29sb3JQYXR0ZXJuXVwiO1xuICAgIH07XG5cbiAgICBvYmVsaXNrLkNvbG9yUGF0dGVybiA9IENvbG9yUGF0dHJlbjtcbn0ob2JlbGlzaykpO1xuXG47IGJyb3dzZXJpZnlfc2hpbV9fZGVmaW5lX19tb2R1bGVfX2V4cG9ydF9fKHR5cGVvZiBvYmVsaXNrICE9IFwidW5kZWZpbmVkXCIgPyBvYmVsaXNrIDogd2luZG93Lm9iZWxpc2spO1xuXG59KS5jYWxsKGdsb2JhbCwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBmdW5jdGlvbiBkZWZpbmVFeHBvcnQoZXgpIHsgbW9kdWxlLmV4cG9ydHMgPSBleDsgfSk7XG4iLCJpbXBvcnQgb2JlbGlzayBmcm9tICdvYmVsaXNrLmpzJztcblxuLyoqXG4gKiBAbW9kdWxlIEdpcmFmZmVcbiAqIEBhdXRob3IgQWRhbSBUaW1iZXJsYWtlXG4gKiBAbGluayBodHRwczovL2dpdGh1Yi5jb20vV2lsZGhvbmV5L0dpcmFmZmVcbiAqIEBsaW5rIGh0dHA6Ly9naXJhZmZlLWFwcC5oZXJva3VhcHAuY29tL1xuICogQGxpY2VuY2UgTUlUXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdpcmFmZmUge1xuXG4gICAgLyoqXG4gICAgICogQGNvbnN0cnVjdG9yXG4gICAgICogQHJldHVybiB7R2lyYWZmZX1cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcigpIHtcblxuICAgICAgICBjb25zdCBjYW52YXMgICAgPSB0aGlzLmdldEVsZW1lbnQoKTtcbiAgICAgICAgY29uc3QgcG9pbnQgICAgID0gbmV3IG9iZWxpc2suUG9pbnQoMjAwLCAyMDApO1xuICAgICAgICBjb25zdCBwaXhlbFZpZXcgPSBuZXcgb2JlbGlzay5QaXhlbFZpZXcoY2FudmFzLCBwb2ludCk7XG5cbiAgICAgICAgY29uc3QgZGltZW5zaW9uID0gbmV3IG9iZWxpc2suQ3ViZURpbWVuc2lvbig4MCwgMTAwLCAxMjApO1xuICAgICAgICBjb25zdCBncmF5ICAgICAgPSBvYmVsaXNrLkNvbG9yUGF0dGVybi5HUkFZO1xuICAgICAgICBjb25zdCBjb2xvciAgICAgPSBuZXcgb2JlbGlzay5DdWJlQ29sb3IoKS5nZXRCeUhvcml6b250YWxDb2xvcihncmF5KTtcbiAgICAgICAgY29uc3QgY3ViZSAgICAgID0gbmV3IG9iZWxpc2suQ3ViZShkaW1lbnNpb24sIGNvbG9yLCB0cnVlKTtcblxuICAgICAgICBwaXhlbFZpZXcucmVuZGVyT2JqZWN0KGN1YmUpO1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG1ldGhvZCBnZXRFbGVtZW50XG4gICAgICogQHJldHVybiB7RWxlbWVudH1cbiAgICAgKi9cbiAgICBnZXRFbGVtZW50KCkge1xuXG4gICAgICAgIGNvbnN0IGNhbnZhcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2NhbnZhcy5naXJhZmZlJyk7XG5cbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHJlc2l6ZUNhbnZhcywgZmFsc2UpO1xuXG4gICAgICAgIGZ1bmN0aW9uIHJlc2l6ZUNhbnZhcygpIHtcbiAgICAgICAgICAgIGNhbnZhcy53aWR0aCAgPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgICAgICAgICAgIGNhbnZhcy5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXNpemVDYW52YXMoKTtcbiAgICAgICAgcmV0dXJuIGNhbnZhcztcblxuICAgIH1cblxufVxuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4gbmV3IEdpcmFmZmUoKSk7XG4iXX0=
