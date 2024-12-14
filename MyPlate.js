import * as THREE from 'three';

class Plate {
    constructor(radius, height, texturePath) {
        this.radius = radius;
        this.height = height;

        // Texture setup
        this.texturePath = texturePath;
        this.texture = new THREE.TextureLoader().load( this.texturePath );
        this.texture.wrapS = THREE.RepeatWrapping;
        this.texture.wrapT = THREE.RepeatWrapping;

        this.plateDiffuseColor = "#e5e5e5"; // rgb(229,229,229)

        // Material setup
        this.material = new THREE.MeshPhongMaterial({
            color: this.plateDiffuseColor,
            shininess: 5,
            specular: new THREE.Color( "#cccccc" ), // rgb(204,204,204)
            map: this.texture,
        });

        // Geometry setup
        this.radialSegments = 32;
        this.geometry = new THREE.CylinderGeometry(
            this.radius,
            this.radius / 2,
            this.height,
            this.radialSegments
        );
        this.mesh = new THREE.Mesh( this.geometry, this.material );

        // Enable casting and receiving shadows for the plate
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
    }

    // Method to update the diffuse color of the plate
    updateDiffuseColor(color) {
        this.plateDiffuseColor = color;
        this.material.color.set(this.plateDiffuseColor);
    }

    // Method to update radial segments and rebuild the geometry
    updateRadialSegments(segments) {
        this.radialSegments = segments;

        // Dispose of the old geometry
        this.mesh.geometry.dispose();

        // Create new geometry with updated radial segments
        this.geometry = new THREE.CylinderGeometry(
            this.radius,
            this.radius / 2,
            this.height,
            this.radialSegments
        );
        this.mesh.geometry = this.geometry;
    }

    // Method to add the plate to a scene
    addToScene(scene, positionY) {
        this.mesh.position.y = positionY;
        scene.add( this.mesh );
    }
}

export { Plate };