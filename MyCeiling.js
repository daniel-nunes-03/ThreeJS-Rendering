import * as THREE from 'three';

class Ceiling {
    constructor(width, depth, height, texturePath) {
        this.width = width;
        this.depth = depth;
        this.height = height;
        this.texturePath = texturePath;

        // Texture setup
        this.texture = new THREE.TextureLoader().load( texturePath );
        this.texture.wrapS = THREE.MirroredRepeatWrapping;
        this.texture.wrapT = THREE.MirroredRepeatWrapping;

        // Ceiling material setup
        this.material = new THREE.MeshPhongMaterial({
            color: "#808080", // rgb(128,128,128)
            emissive: "#000000",
            map: this.texture
        });

        // Ceiling geometry setup (rectangle plane)
        this.geometry = new THREE.PlaneGeometry( this.width, this.depth );
        this.mesh = new THREE.Mesh( this.geometry, this.material );

        // Rotate to be horizontal and position at wall height
        this.mesh.rotation.x = Math.PI / 2; // Rotate to be parallel with floor
        this.mesh.position.y = this.height; // Position at wall height
    }

    /**
     * Adds the ceiling to the scene
     * @param {THREE.Scene} scene - The scene to which the ceiling is added
     */
    addToScene(scene) {
        scene.add( this.mesh );
    }
}

export { Ceiling };