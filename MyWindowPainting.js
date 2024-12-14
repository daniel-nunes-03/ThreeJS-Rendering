import * as THREE from 'three';

class WindowPainting {
    /**
     * Constructs the window painting object
     * @param {number} wallX - Width of the wall to position the painting.
     * @param {number} wallY - Height of the wall to position the painting.
     * @param {string} texturePath - Path to the window painting texture.
     */
    constructor(wallX, wallY, texturePath) {
        this.wallX = wallX;
        this.wallY = wallY;

        // Dimensions and positioning for window painting
        this.windowPaintingWidth = wallX * 1.5;
        this.windowPaintingHeight = wallY * 1.5;
        this.windowPaintingParallaxDistanceCoeff = 1.2;
        this.position = new THREE.Vector3(
            -wallX / 2 * this.windowPaintingParallaxDistanceCoeff,
            wallY / 2,
            0
        );

        // Texture setup
        this.texturePath = texturePath;
        this.texture = new THREE.TextureLoader().load( this.texturePath );
        this.texture.wrapS = THREE.RepeatWrapping;
        this.texture.wrapT = THREE.RepeatWrapping;

        // Material for the window painting
        this.material = new THREE.MeshBasicMaterial({
            color: "#ffffff",
            map: this.texture,
        });

        // Mesh setup
        this.mesh = this.createWindowPaintingMesh();
    }

    /**
     * Creates the mesh for the window painting
     * @returns {THREE.Mesh} - The window painting mesh
     */
    createWindowPaintingMesh() {
        const geometry = new THREE.PlaneGeometry( this.windowPaintingWidth, this.windowPaintingHeight );
        const mesh = new THREE.Mesh( geometry, this.material );
        mesh.position.copy( this.position );
        mesh.rotation.y = Math.PI / 2;
        return mesh;
    }

    /**
     * Adds the window painting to the scene
     * @param {THREE.Scene} scene - The scene to which the window painting is added
     */
    addToScene(scene) {
        scene.add( this.mesh );
    }
}

export { WindowPainting };