import * as THREE from 'three';

class AmbientLight {
    constructor(color = "#555555", intensity = 3) {
        this.color = color;
        this.intensity = intensity;
        this.light = new THREE.AmbientLight( this.color, this.intensity );
    }

    addToScene(scene) {
        scene.add( this.light );
    }
}

export { AmbientLight };