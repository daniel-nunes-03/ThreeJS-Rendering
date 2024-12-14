import * as THREE from 'three';

class Plane {
    constructor() {
        // Plane size
        this.planeX = 20;
        this.planeY = 20;

        // Texture setup
        this.planeTexturePath = "textures/plane_wood_texture_480x320.jpg";
        this.planeTexture = new THREE.TextureLoader().load( this.planeTexturePath );
        this.planeTexture.wrapS = THREE.MirroredRepeatWrapping;
        this.planeTexture.wrapT = THREE.MirroredRepeatWrapping;
        this.planeUVRate = this.planeY / this.planeX;
        this.planeTextureUVRate = 480 / 320;
        this.planeTextureRepeatU = 3;
        this.planeTextureRepeatV = this.planeTextureRepeatU * this.planeUVRate * this.planeTextureUVRate;
        this.planeTexture.repeat.set( this.planeTextureRepeatU, this.planeTextureRepeatV );
        this.planeTexture.rotation = 0;
        this.planeTexture.offset = new THREE.Vector2( 0, 0 );

        // Material setup
        this.planeDiffuseColor = "#c57900"; // rgb(197,121,0)
        this.planeSpecularColor = "#000000";
        this.planeShininess = 0;

        this.planeMaterial = new THREE.MeshPhongMaterial({
            color: this.planeDiffuseColor,
            specular: this.planeSpecularColor,
            emissive: "#000000",
            shininess: this.planeShininess,
            map: this.planeTexture
        });

        this.planeMesh = null;
        this.planeMeshRotationX = -Math.PI / 2;
        this.planeMeshPositionY = 0;
    }

    /**
     * Updates the diffuse color of the plane.
     * @param {THREE.Color} color
     */
    updateDiffuseColor(color) {
        this.planeDiffuseColor = color;
        this.planeMaterial.color.set( this.planeDiffuseColor );
    }

    /**
     * Updates the specular color of the plane.
     * @param {THREE.Color} color
     */
    updateSpecularColor(color) {
        this.planeSpecularColor = color;
        this.planeMaterial.specular.set( this.planeSpecularColor );
    }

    /**
     * Updates the shininess of the plane.
     * @param {number} shininess
     */
    updateShininess(shininess) {
        this.planeShininess = shininess;
        this.planeMaterial.shininess = this.planeShininess;
    }

    /**
     * Adds the plane to the scene.
     * @param {THREE.Scene} scene
     */
    addToScene(scene) {
        // Create plane geometry and mesh if they haven't been created yet
        if (!this.planeMesh) {
            const planeGeometry = new THREE.PlaneGeometry( this.planeX, this.planeY );
            this.planeMesh = new THREE.Mesh( planeGeometry, this.planeMaterial );
            this.planeMesh.rotation.x = this.planeMeshRotationX;
            this.planeMesh.position.y = this.planeMeshPositionY;
            // Enable receiving shadows
            this.planeMesh.receiveShadow = true;
        }

        // Add the mesh to the provided scene
        scene.add(this.planeMesh);
    }
}

export { Plane };