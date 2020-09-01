"use strict";

/**
 * Geometry and colors for the tetrahedron.
 */
class TetrahedronData {

    /**
     * Empty constructor.
     */
    constructor() {
    }

    /**
     * The vertices attribute.
     *
     * @returns {*[]}
     */
    get vertices() {
        return [
            vec4( -0.86, -0.5, -0.35, 1.0 ),     // v0
            vec4( 0.86, -0.5, -0.35, 1.0 ),     // v1
            vec4( 0.0, 0.0, 1.0, 1.0 ),     // v2
            vec4( 0.0, 1.0, -0.35, 1.0 )      // v3
        ];
    }

    /**
     * The colors attribute.
     *
     * @returns {*[]}
     */
    get colors() {
        return [
            [ 1.0, 1.0, 0.0, 1.0 ],  // yellow
            [ 0.0, 1.0, 0.0, 1.0 ],  // green
            [ 0.0, 0.0, 1.0, 1.0 ],  // blue
            [ 1.0, 0.0, 1.0, 1.0 ],  // magenta
            //[ 0.0, 1.0, 1.0, 1.0 ],  // cyan
        ];
    }

}

