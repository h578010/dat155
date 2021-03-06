"use strict";

import { BoxGeometry, MeshBasicMaterial, AmbientLight, Mesh, MeshPhongMaterial, Object3D, PointLight, Sphere, SphereGeometry, TextureLoader } from "./three.module.js";
import SimpleColorMaterial from "./SimpleColorMaterial.js";

export default class SolarSystem {
    constructor(scene) {
        let radius = 5;
        let widthSegments = 64;
        let heightSegments = 64;

        let sunGeometry = new SphereGeometry(radius, widthSegments, heightSegments);
        let sunTextureUrl = 'resources/texture_sun.jpg';
        let sunTexture = new TextureLoader().load(sunTextureUrl);
        let sunMaterial = new MeshBasicMaterial({map:sunTexture,
            shininess:1.0
        });

        this.sun = new Mesh(sunGeometry, sunMaterial);
        scene.add(this.sun);

        this.earthOrbitNode = new Object3D();
        this.marsOrbitNode = new Object3D();
        this.sun.add(this.earthOrbitNode);
        this.sun.add(this.marsOrbitNode);

        let earthTextureUrl = "resources/texture_earth.jpg";
        let earthTexture = new TextureLoader().load(earthTextureUrl);
        let marsTextureUrl = "resources/texture_mars.jpg";
        let marsTexture = new TextureLoader().load(marsTextureUrl);

        let earthSpecularMap = new TextureLoader().load("resources/earthspec1k.jpg");
        let earthNormalMap = new TextureLoader().load("resources/2k_earth_normal_map.png");

        let earthMaterial = new MeshPhongMaterial({map:earthTexture,
            shininess:1.0,
            specular: earthSpecularMap,
            normalMap: earthNormalMap
        });

        let marsSpecularMap = new TextureLoader().load("resources/mars_spec.png");
        let marsNormalMap = new TextureLoader().load("resources/mars_norm.jpg");

        let marsMaterial = new MeshPhongMaterial({map:marsTexture,
            shininess:1.0,
            specular: marsSpecularMap,
            normalMap: marsNormalMap
        });

      
        radius = 2.5;
        let earthGeometry = new SphereGeometry(radius, widthSegments, heightSegments);
        let marsGeometry = new SphereGeometry(radius, widthSegments, heightSegments);
        this.earth = new Mesh(earthGeometry, earthMaterial);
        this.mars = new Mesh(marsGeometry, marsMaterial);
                
        this.earth.position.x = 15;
        this.mars.position.x = 25;

        this.earthOrbitNode.add(this.earth);
        this.marsOrbitNode.add(this.mars);

        this.sunLight = new PointLight(0xffffff, 3);
        this.sun.add(this.sunLight);

        this.ambientLight = new AmbientLight(0xffffff, 0.05);
        scene.add(this.ambientLight);
    }

    animate() {
        this.rotateObject(this.sun, [0, 0.005, 0]);
        this.rotateObject(this.earthOrbitNode, [0, 0.01, 0]);
        this.rotateObject(this.earth, [0, 0.002, 0]);
    }

    rotateObject(object, rotation) {
        object.rotation.x += rotation[0];
        object.rotation.y += rotation[1];
        object.rotation.z += rotation[2];
    }
}