import * as THREE from 'three';

class Candle {
    constructor(radius, height, texturePath) {
        this.radius = radius;
        this.height = height;
        this.texturePath = texturePath;

        // Texture setup
        this.texture = new THREE.TextureLoader().load( texturePath );
        this.texture.wrapS = THREE.MirroredRepeatWrapping;
        this.texture.wrapT = THREE.MirroredRepeatWrapping;

        // Candle Material
        this.material = new THREE.MeshBasicMaterial({
            //color: "#fbf9d9",
            //shininess: 30,
            //specular: new THREE.Color( "#222222" ), // rgb(34,34,34)
            color: "#ffffff",
            map: this.texture
        });

        // Candle Geometry
        this.geometry = new THREE.CylinderGeometry(
            this.radius,
            this.radius,
            this.height,
            16, // radial segments
            1   // height segments
        );
        this.mesh = new THREE.Mesh( this.geometry, this.material );
    }

    // Method to add the candle to the scene
    addToScene(scene, position) {
        this.mesh.position.set( position.x, position.y, position.z );
        scene.add( this.mesh );
    }
}

export { Candle };