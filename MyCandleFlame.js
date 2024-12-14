import * as THREE from 'three';

class CandleFlame {
    constructor(radius, height, texturePath) {
        this.radius = radius;
        this.height = height;
        this.texturePath = texturePath;

        // Setup flame texture with gradient effect
        this.texture = new THREE.TextureLoader().load( texturePath );
        this.texture.wrapS = THREE.MirroredRepeatWrapping;
        this.texture.wrapT = THREE.MirroredRepeatWrapping;

        // Candle flame material with transparency and emissive effect
        this.material = new THREE.MeshBasicMaterial({
            color: "#ffcf2b", // rgb(255,207,43)
            map: this.texture
        });

        // Candle flame geometry
        this.geometry = new THREE.CylinderGeometry(
            this.radius / 5,
            this.radius,
            this.height,
            16, // Radial segments
            1   // Height segments
        );

        // Create flame mesh
        this.mesh = new THREE.Mesh( this.geometry, this.material );

        // Light source for glow effect
        this.light = new THREE.PointLight(
            "#ffcf2b", // rgb(255,207,43)
            0.3,
            5
        );

        // Enable shadow casting for the point light
        //this.mapSize = 1024;
        //this.light.castShadow = true;
        //this.light.shadow.mapSize.width = this.mapSize;
        //this.light.shadow.mapSize.height = this.mapSize;
        //this.light.shadow.camera.near = 0.1;
        // Candlelight doesn’t cast shadows far
        //this.light.shadow.camera.far = 0.5;
    }

    // Method to add the flame to the scene with positioning
    addToScene(scene, position) {
        this.mesh.position.set( position.x, position.y, position.z );
        this.light.position.set( position.x, position.y, position.z );
        scene.add( this.mesh );
        scene.add( this.light );
    }

    // Animate flame flickering
    flicker() {
        this.light.intensity = 0.1 + Math.random() * 0.1;  // Vary light intensity slightly
        this.mesh.material.opacity = 0.8 + Math.random() * 0.1; // Vary opacity for flicker
        this.mesh.scale.set( 1 + Math.random() * 0.2, 1 + Math.random() * 0.2, 1 ) ; // Slight scale flicker
    }
}

export { CandleFlame };