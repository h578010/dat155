
export default class CollisionObject {

    constructor(mesh, dynamic = false) {

        this.mesh = mesh;

        this._onIntersect = null;

        this._destroy = false;

        this._dynamic = dynamic; 

    }

    setOnIntersectListener(listener) {
        this._onIntersect = listener.bind(this);
    }

    destroy() {
        this._destroy = true;
    }
 }