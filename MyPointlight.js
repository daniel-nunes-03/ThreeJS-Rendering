import * as THREE from 'three';

class PointLight {
    constructor(color = "#FFE8C1", intensity = 8, position = { x: 0, y: 10, z: 0 }) {
        // Initialize pointlight properties
        this.color = color;
        this.intensity = intensity;
        this.position = position;

        // Set pointlight parameters
        this.distance = position.y * 1.9;
        this.decay = 1.42;

        // Create the pointlight
        this.light = new THREE.PointLight( this.color, this.intensity, this.distance, this.decay );
        this.light.position.set( position.x, position.y, position.z );

        // Enable shadow casting
        //this.mapSize = 4096;
        //this.light.castShadow = true;
        //this.light.shadow.mapSize.width = this.mapSize;
        //this.light.shadow.mapSize.height = this.mapSize;
        //this.light.shadow.camera.near = 0.5;
        //this.light.shadow.camera.far = this.distance;

        // Create pointlight helper for visualization
        //this.helper = new THREE.PointLightHelper( this.light );
    }

    /**
     * Adds the pointlight and helper to the scene
     * @param {THREE.Scene} scene The scene object
     */
    addToScene(scene) {
        scene.add( this.light );
        //scene.add( this.helper );
        //this.helper.update();
    }

    /**
     * Updates the pointlight color and helper
     * @param {THREE.Color} color The new color
     */
    updateColor(value) {
        this.color = value;
        this.light.color.set( value );
        //this.helper.update();
    }

    /**
     * Updates the pointlight intensity and helper
     * @param {number} intensity The new intensity
     */
    updateIntensity(value) {
        this.intensity = value;
        this.light.intensity = value;
        //this.helper.update();
    }

    /**
     * Updates the pointlight distance and helper
     * @param {number} distance The new distance
     */
    updateDistance(value) {
        this.distance = value;
        this.light.distance = value;
        //this.helper.update();
    }

    /**
     * Updates the pointlight decay and helper
     * @param {number} decay The new decay value
     */
    updateDecay(value) {
        this.decay = value;
        this.light.decay = value;
        //this.helper.update();
    }
}

export { PointLight };