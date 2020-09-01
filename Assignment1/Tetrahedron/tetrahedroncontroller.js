"use strict";

/**
 * Controller for the tetrahedron project.
 */
class TetrahedronController {

    /**
     * Creates a new TetrahedronController object.
     */
    constructor() {
        this._model = new TetrahedronData();
        this._view = new TetrahedronGL(this._model);
    }

    /**
     * Changes the rotation axis.
     */
    xButtonClicked() {
        this._view.axis = X_AXIS;
    }

    /**
     * Changes the rotation axis.
     */
    yButtonClicked() {
        this._view.axis = Y_AXIS;
    }

    /**
     * Changes the rotation axis.
     */
    zButtonClicked() {
        this._view.axis = Z_AXIS;
    }

}


